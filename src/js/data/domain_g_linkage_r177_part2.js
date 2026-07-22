/**
 * 域G联动增强 Part 2 -- 存款里程碑 + 疲劳预警
 * [全系统自洽修复] 域G R177: resources.totalAssets/fatigue首次被事件叙事消费
 */
(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  // ===== A组: 存款里程碑链式阈值 (1k->5k->20k) =====

  function _getTotalAssets(st) {
    var cash = st.resources && isFinite(st.resources.cash) ? st.resources.cash : 0;
    var bank = st.resources && isFinite(st.resources.bankBalance) ? st.resources.bankBalance : 0;
    var invest = st.investment && isFinite(st.investment.portfolioValue) ? st.investment.portfolioValue : 0;
    return Math.round(cash + bank + invest);
  }

  // --- 里程碑1: 1000元 第一桶金的雏形 ---
  var milestone_savings_1k = {
    id: 'milestone_savings_1k',
    title: '破千！',
    phase: 'street',
    repeatable: false,
    priority: 90,
    conditions: function (st) {
      if (!st || !st.resources) return false;
      if (st.flags._milestone1kDone) return false;
      var total = _getTotalAssets(st);
      var prev = st.flags._prevSavingsCheck || 0;
      return total >= 1000 && (total - prev) >= 500;
    },
    probability: 1.0,
    getStory: function (st) {
      var total = _getTotalAssets(st);
      return '你打开账户看了一眼\u2014\u2014存款终于过了￥1,000！\n\n从刚来城市的￥300，到这一千块，你吃了不知道多少顿路边摊、省了多少顿像样的饭。\n\n一千块不多，但它是你的。第一笔真正的、完全属于自己的数字。\n\n总资产：￥' + total + '。';
    },
    getText: function (st) {
      return this.getStory(st);
    },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._milestone1kDone = true;
      if (!st.flags) st.flags = {};
      st.flags._prevSavingsCheck = _getTotalAssets(st);
      if (choiceId === 'save_more') {
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 8);
        st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
        StateManager.addMessage('你把这事记在心里。一千不是终点，只是起点。心情+8，精神+3。', 'success');
      } else if (choiceId === 'treat_self') {
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 10);
        st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100);
        StateManager.addMessage('出去吃了一顿好的！￥100的烤肉，配一碗白米饭。快乐无价。心情+10。', 'info');
      }
    },
    choices: [
      { text: '\ud83d\udc37 继续存，不慌', id: 'save_more' },
      { text: '\ud83c\udf56 犒劳自己吃一顿', id: 'treat_self' },
    ],
    icons: ['\ud83d\udcb0', '里程碑'],
  };

  // --- 里程碑2: 5000元 安全垫 ---
  var milestone_savings_5k = {
    id: 'milestone_savings_5k',
    title: '安全垫',
    phase: 'street',
    repeatable: false,
    priority: 90,
    conditions: function (st) {
      if (!st || !st.resources) return false;
      if (st.flags._milestone5kDone) return false;
      if (!st.flags._milestone1kDone) return false;
      var total = _getTotalAssets(st);
      var prev = st.flags._prevSavingsCheck || 0;
      return total >= 5000 && (total - prev) >= 2000;
    },
    probability: 1.0,
    getStory: function (st) {
      var total = _getTotalAssets(st);
      return '五千元。城市里大部分人一个月的工资，但你一分一分攒下来的。\n\n房东涨租你不慌了\u2014\u2014这个月房租可以先缓两天。病假请不起了\u2014\u2014至少药钱有了着落。\n\n五千元不叫富有，但它给了你一个"安全垫"。在这个城市里，安全垫就是尊严。\n\n总资产：￥' + total + '。';
    },
    getText: function (st) {
      return this.getStory(st);
    },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._milestone5kDone = true;
      if (!st.flags) st.flags = {};
      st.flags._prevSavingsCheck = _getTotalAssets(st);
      if (choiceId === 'learn_invest') {
        st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
        st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
        StateManager.addMessage('你买了一本理财入门书。知识才是最好的投资。智力+4，精神+2。', 'success');
      } else if (choiceId === 'emergency_fund') {
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 6);
        st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
        st.flags._emergencyMindset = true;
        StateManager.addMessage('你把心安了下来。知道钱在那儿，你就知道再怎么也能活下去。心情+6，精神+5。', 'success');
      }
    },
    choices: [
      { text: '\ud83d\udcda 买理财书学习', id: 'learn_invest' },
      { text: '\ud83d\udee1\ufe0f 这就是我的紧急备用金', id: 'emergency_fund' },
    ],
    icons: ['\ud83d\udcb0', '安全垫'],
  };

  // --- 里程碑3: 20000元 城市的敲门砖 ---
  var milestone_savings_20k = {
    id: 'milestone_savings_20k',
    title: '两万块的分量',
    phase: 'street',
    repeatable: false,
    priority: 95,
    conditions: function (st) {
      if (!st || !st.resources) return false;
      if (st.flags._milestone20kDone) return false;
      if (!st.flags._milestone5kDone) return false;
      var total = _getTotalAssets(st);
      var prev = st.flags._prevSavingsCheck || 0;
      return total >= 20000 && (total - prev) >= 5000;
    },
    probability: 1.0,
    getStory: function (st) {
      var total = _getTotalAssets(st);
      return '两万块。\n\n这个数字让你突然有了一些以前不敢想的念头\u2014\u2014报个技能培训班？换个好点的住处？或者\u2026\u2026开始考虑副业甚至创业？\n\n在城市的规则里，两万块是一块敲门砖。它不够买房，但足够让你说"我可以试试"。\n\n总资产：￥' + total + '。';
    },
    getText: function (st) {
      return this.getStory(st);
    },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._milestone20kDone = true;
      if (!st.flags) st.flags = {};
      st.flags._prevSavingsCheck = _getTotalAssets(st);
      if (choiceId === 'invest_self') {
        st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
        st.flags._investInSelf = true;
        StateManager.addMessage('你决定把这笔钱的一部分用在自己身上。培训/证书/技能\u2014\u2014这是最有回报的投资。智力+5。', 'success');
      } else if (choiceId === 'expand_hustle') {
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 10);
        st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
        st.flags._expandHustle = true;
        StateManager.addMessage('你有底气去拓展副业了。两万块的底牌在手，不怕试错。心情+10。', 'success');
      }
    },
    choices: [
      { text: '\ud83d\udca1 投资自己（技能培训/考证）', id: 'invest_self' },
      { text: '\ud83d\ude80 扩大副业规模', id: 'expand_hustle' },
    ],
    icons: ['\ud83d\udcb0', '敲门砖'],
  };

  // ===== B组: 疲劳预警 =====

  var milestone_fatigue_warning = {
    id: 'milestone_fatigue_warning',
    title: '身体的提醒',
    phase: 'any',
    repeatable: false,
    priority: 70,
    conditions: function (st) {
      if (!st) return false;
      var fatigue = (st.needs && isFinite(st.needs.fatigue)) ? st.needs.fatigue : 0;
      if (fatigue < 80) return false;
      var prevCheck = st.flags._prevFatigueCheck || 0;
      if ((st.player.day || 0) - prevCheck < 15) return false;
      return true;
    },
    probability: 0.12,
    getStory: function (st) {
      var fat = (st.needs && isFinite(st.needs.fatigue)) ? Math.round(st.needs.fatigue) : 85;
      return '你已经连续几天觉得特别累了。\n\n肩膀酸痛、眼睛干涩、注意力不集中\u2014\u2014身体在抗议了。\n\n疲劳值：' + Math.round(fat) + '%。你知道再这样下去会出问题，但"今天还有好多事没做完"\u2026\u2026\n\n你真的还能撑下去吗？';
    },
    getText: function (st) {
      return this.getStory(st);
    },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      st.flags._prevFatigueCheck = st.player.day || 0;
      if (choiceId === 'caffeine') {
        var cost = Math.min((st.resources && isFinite(st.resources.cash) ? st.resources.cash : 0), 15);
        st.resources.cash = (st.resources.cash || 0) - cost;
        st.status.health = Math.max(0, (st.status && isFinite(st.status.health) ? st.status.health : 70) - 5);
        st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
        StateManager.addMessage('灌了三杯浓缩咖啡硬扛下去。疲劳-10，健康-5。明天你会后悔今天的决定。', 'warning');
      } else {
        st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 30);
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 5);
        StateManager.addMessage('你请了一天假。躺在床上发呆，什么也没做。反而感觉好多了。疲劳-30，心情+5。', 'success');
      }
    },
    choices: [
      { text: '\u2615\ufe0f 咖啡因硬扛（￥15，健康-5）', id: 'caffeine' },
      { text: '\ud83d\ude34 请假补觉（疲劳-30）', id: 'rest_day' },
    ],
    icons: ['\u26a0\ufe0f', '疲劳'],
  };

  // ===== IIFE注入 =====
  if (typeof RANDOM_EVENTS !== 'undefined') {
    RANDOM_EVENTS.push(milestone_savings_1k, milestone_savings_5k, milestone_savings_20k, milestone_fatigue_warning);
  }
})();

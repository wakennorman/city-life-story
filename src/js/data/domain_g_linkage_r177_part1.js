/**
 * 域G联动增强 Part 1 -- 人生节点情绪余波 + 章节回响
 * [全系统自洽修复] 域G R177: life_nodes/story_chapters 首次被事件系统消费
 */
(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  // ===== A组: 人生节点情绪余波 =====

  var life_node_emotional_afterglow = {
    id: 'life_node_emotional_afterglow',
    title: '节点的余波',
    phase: 'street',
    repeatable: false,
    priority: 85,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (!st.flags._lastLifeNodeTriggered) return false;
      if (st.flags._emotionalAfterglowDone) return false;
      return true;
    },
    probability: 0.06,
    getStory: function (st) {
      var flag = st.flags._lastLifeNodeTriggered;
      if (flag === 'gaokao') {
        return '那天考完最后一科，你走出考场的那一刻，阳光刺眼得让你想哭。\n\n不是悲伤，是那种"终于熬过一关了"的虚脱感。\n\n现在想来，那天的风、蝉鸣、考场外举着扇子的妈妈\u2014\u2014像一部老电影的开场。';
      } else if (flag === 'university') {
        return '拿到大学录取通知书的那天，全家都忙开了。\n\n你把通知书放在枕头底下睡了一整夜\u2014\u2014怕被风吹跑，怕是一场梦。\n\n如今在城市里摸爬滚打，那张纸不知还躺在哪个角落。';
      } else if (flag === 'career35') {
        return '35岁这天，你照了照镜子。\n\n发际线比上个月又退了一点。公司群里的00后开始用你没听过的术语。\n\n但你突然意识到\u2014\u201435不是下坡路的起点，只是换了条上坡路。';
      } else if (flag === 'retirement') {
        return '退休证到手的那天，你站在窗前发了很久的呆。\n\n四十年工作说没就没\u2014\u2014但那些一起熬过大夜的同事、一起拿下的项目、一起喝过的茶，都在。\n\n你终于有时间想想，自己想要什么生活了。';
      } else {
        return '某个深夜，你突然想起生命中的一个重要节点。\n\n那一刻的紧张、期待、恐惧\u2014\u2014像刚发生一样清晰。\n\n你问自己：那时的选择，对吗？';
      }
    },
    getText: function (st) {
      return this.getStory(st);
    },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._emotionalAfterglowDone = true;
      if (choiceId === 'diary') {
        st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
        StateManager.addMessage('你把那段记忆写进了日记。有时候记录本身就是疗愈。精神+5，心情+5。', 'success');
      } else if (choiceId === 'walk_out') {
        st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 3);
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
        StateManager.addMessage('你出门走了走。城市的灯火依然温暖。疲劳+3，心情+8。', 'info');
      } else {
        st.flags._pragmaticCoping = true;
        StateManager.addMessage('算了，想这些没用。明天还得赚钱。', 'hint');
      }
    },
    choices: [
      { text: '\ud83d\udcdd 写进日记', id: 'diary' },
      { text: '\ud83d\udeb6 出去走走', id: 'walk_out' },
      { text: '\ud83d\udcb0 先攒钱要紧', id: 'save_money' },
    ],
    icons: ['\ud83e\udd14', '\ud83d\udcdd'],
  };

  // ===== B组: 章节回响 =====

  var chapter_echo_emotional_impact = {
    id: 'chapter_echo_emotional_impact',
    title: '章节回响',
    phase: 'street',
    repeatable: true,
    maxTriggers: 3,
    priority: 80,
    conditions: function (st) {
      if (!st || !st.flags) return false;
      var hasChapter =
        !!st.flags._ch1Done ||
        !!st.flags._ch2Done ||
        !!st.flags._ch3Done;
      if (!hasChapter) return false;
      var usedCount = st.flags._chapterEchoUsedCount || 0;
      if (usedCount >= 3) return false;
      return true;
    },
    probability: 0.05,
    getStory: function (st) {
      var cash = (st.resources && isFinite(st.resources.cash) ? st.resources.cash : 0);
      var health = (st.status && isFinite(st.status.health) ? st.status.health : 70);
      var day = (st.player && isFinite(st.player.day) ? st.player.day : 1);

      if (st.flags._ch3Done) {
        return '你已经在这个城市度过了近一年的时间。\n\n第' + day + '天，回头一看\u2014\u2014从第一天连租房都找不到，到现在居然有了自己的节奏。\n\n存款' + (cash >= 1000 ? '\u00a5' + Math.round(cash) : '快见底了') + '，身体' + (health >= 60 ? '还不错' : '有点吃不消了') + '。\n\n你还记得刚来时的那个自己吗？';
      } else if (st.flags._ch2Done) {
        return '第一百多天过去了。\n\n你在某个加班的深夜突然想起来\u2014\u2014刚来这座城市的时候，连地图都看不懂。\n\n现在的你至少知道哪家面馆最划算，哪个时间点打车最便宜。\n\n生存技能点满了。';
      } else {
        return '三十天。\n\n你说你来这个城市才不久，但已经经历了不少事\u2014\u2014第一次被骗、第一份兼职、第一次生病。\n\n那些你以为熬不过去的日子，都已经过去了。';
      }
    },
    getText: function (st) {
      return this.getStory(st);
    },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      st.flags._chapterEchoUsedCount = (st.flags._chapterEchoUsedCount || 0) + 1;
      if (choiceId === 'move_forward') {
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
        st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
        StateManager.addMessage('你深吸一口气，继续往前走。每一步都算数。心情+10，精神+3。', 'success');
      } else if (choiceId === 'thank_self') {
        st.player.charm = Math.min(100, (st.player.charm || 50) + 2);
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
        StateManager.addMessage('你对自己说声辛苦了。这份自我认可比任何人的赞美都重要。魅力+2，心情+12。', 'success');
      } else {
        st.flags._chapterEchoRegret = true;
        StateManager.addMessage('如果重来一次\u2026\u2026但你没有if。只有now。', 'hint');
      }
    },
    choices: [
      { text: '\u27a1\ufe0f 只管往前走', id: 'move_forward' },
      { text: '\ud83d\ude4f 感谢自己', id: 'thank_self' },
      { text: '\u2753 如果重来一次', id: 'regret' },
    ],
    icons: ['\ud83d\udcd6', '\ud83d\udd04'],
  };

  // ===== IIFE注入 =====
  if (typeof RANDOM_EVENTS !== 'undefined') {
    RANDOM_EVENTS.push(life_node_emotional_afterglow, chapter_echo_emotional_impact);
  }
})();

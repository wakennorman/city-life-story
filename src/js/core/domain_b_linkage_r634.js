/**
 * 域B(事件/叙事) 联动增强 R634
 * 桥接：
 *   B→A  b634_event_data_wealth  事件数据财富 → 消费 state.flags._eventHistory+state.stats 数据,
 *     叙事→"经历就是财富"数据回响
 *   B→E  b634_story_investment_confidence  故事投资信心 → 消费 state.flags+state.investment 数据,
 *     叙事→"经历塑造投资哲学"经济回响
 *   B→C  b634_narrative_career_motivation  叙事职业动力 → 消费 state.flags+state.player 数据,
 *     叙事→"故事激发职业动力"职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR634Loaded) return;
  RANDOM_EVENTS._domainBLinkageR634Loaded = true;

  var EVENTS = [
    {
      id: "b634_event_data_wealth", phase: "street", _isChainEvent: false, icon: "💎",
      title: "经历就是财富",
      story: "回头看你经历过的那些事,才发现它们本身就是一笔财富——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 1, excludeFlags: ["_b634WealthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b634WealthDone) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 30;
      },
      choices: [
        { text: "📊 量化经历价值", hint: "智力+4,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b634WealthDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '每一段经历都有它的价值。' 你量化了自己的经历财富。智力+4,心智+3。", "success");
        }},
        { text: "📖 写回忆录", hint: "社交XP+5,心情+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b634WealthDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把故事写下来,就是永恒的财富。' 你写下了回忆录。社交XP+5,心情+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var hist = st.flags._eventHistory || [];
        return "回头看你经历过的那些事,才发现它们本身就是一笔财富——" + hist.length + "段经历,每一段都塑造了今天的你。";
      }
    },
    {
      id: "b634_story_investment_confidence", phase: "street", _isChainEvent: false, icon: "📈",
      title: "经历塑造投资哲学",
      story: "这些年的起起伏伏,让你对风险有了更深的理解——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_b634InvestDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b634InvestDone) return false;
        return st.investment && (st.investment.stockHoldings || st.investment.btcHoldings);
      },
      choices: [
        { text: "🛡️ 稳健为主", hint: "心智+5,置_b634Conservative", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b634InvestDone = true;
          st.flags._b634Conservative = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛡️ '经历过低谷,更懂得稳健的价值。' 你选择了稳健投资。心智+5。", "success");
        }},
        { text: "🚀 适度冒险", hint: "智力+4,置_b634RiskTaker", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b634InvestDone = true;
          st.flags._b634RiskTaker = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '风险与收益并存。' 你选择适度冒险。智力+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "这些年的起起伏伏,让你对风险有了更深的理解——'亏过钱才知道,稳健不是胆小,是智慧。'";
      }
    },
    {
      id: "b634_narrative_career_motivation", phase: "street", _isChainEvent: false, icon: "🔥",
      title: "故事激发动力",
      story: "你听过一些故事,让你重新燃起了职业斗志——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 2, excludeFlags: ["_b634MotivationCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b634MotivationCooldown) return false;
        var mental = (st.player && st.player.mental) || 50;
        return mental < 60;
      },
      choices: [
        { text: "💪 重燃斗志", hint: "心智+6,置_b634Rekindled", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b634MotivationCooldown = true;
          st.flags._b634Rekindled = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '别人能做到,我也能!' 你重燃斗志。心智+6。", "success");
        }},
        { text: "📖 记录感悟", hint: "智力+3,社交XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b634MotivationCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把感悟写下来,动力更持久。' 你记录了这段心路。智力+3,社交XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你听过一些故事,让你重新燃起了职业斗志——'每个成功的人,都有自己的至暗时刻。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

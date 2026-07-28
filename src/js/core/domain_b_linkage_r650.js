/**
 * 域B(事件/叙事) 联动增强 R650
 * 桥接：
 *   B→A  b650_event_data_mining  事件数据挖掘 → 消费 state.flags._eventHistory+state.stats 数据,
 *     叙事→"从数据中发现规律"数据回响
 *   B→E  b650_story_finance_lesson  故事财务教训 → 消费 state.flags+state.resources 数据,
 *     叙事→"经历塑造财富观"经济回响
 *   B→G  b650_narrative_growth  叙事成长 → 消费 state.flags+state.player+state.needs 数据,
 *     叙事→"故事促进成长"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR650Loaded) return;
  RANDOM_EVENTS._domainBLinkageR650Loaded = true;

  var EVENTS = [
    {
      id: "b650_event_data_mining", phase: "street", _isChainEvent: false, icon: "⛏️",
      title: "从数据中发现规律",
      story: "你开始从过往经历中挖掘有价值的规律——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 1, excludeFlags: ["_b650MineDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b650MineDone) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 50;
      },
      choices: [
        { text: "📊 深度挖掘", hint: "智力+6,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b650MineDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据背后,藏着规律。' 你深度挖掘了事件数据。智力+6,心智+4。", "success");
        }},
        { text: "📖 写总结", hint: "管理XP+4,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b650MineDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把规律写下来,就是知识。' 你总结了事件规律。管理XP+4,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var hist = st.flags._eventHistory || [];
        return "你开始从过往经历中挖掘有价值的规律——" + hist.length + "条事件记录,每一段都是宝贵的数据。'数据背后,藏着规律。'";
      }
    },
    {
      id: "b650_story_finance_lesson", phase: "street", _isChainEvent: false, icon: "💰",
      title: "经历塑造财富观",
      story: "你经历过的那些事,教会了你很多关于金钱的道理——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_b650FinanceDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b650FinanceDone) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 25;
      },
      choices: [
        { text: "🛡️ 稳健为主", hint: "心智+5,置_b650Safe", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b650FinanceDone = true;
          st.flags._b650Safe = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛡️ '经历过穷,更懂得稳健。' 你选择了稳健理财。心智+5。", "success");
        }},
        { text: "🚀 适度冒险", hint: "智力+4,置_b650Risk", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b650FinanceDone = true;
          st.flags._b650Risk = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '风险与收益并存。' 你选择适度冒险。智力+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你经历过的那些事,教会了你很多关于金钱的道理——'经历过穷,才知道钱的重要;经历过亏,才知道风险的可怕。'";
      }
    },
    {
      id: "b650_narrative_growth", phase: "street", _isChainEvent: false, icon: "🌱",
      title: "故事促进成长",
      story: "你听过一些故事,让自己在逆境中成长——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 1, excludeFlags: ["_b650GrowthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b650GrowthDone) return false;
        var mental = (st.player && st.player.mental) || 50;
        return mental < 45;
      },
      choices: [
        { text: "💪 逆境成长", hint: "心智+8,置_b650Grit", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b650GrowthDone = true;
          st.flags._b650Grit = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '逆境是最好的老师。' 你在故事中找到了力量。心智+8。", "success");
        }},
        { text: "📖 记录感悟", hint: "社交XP+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b650GrowthDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把感悟写下来,力量更持久。' 你记录了这段心路。社交XP+4,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你听过一些故事,让自己在逆境中成长——'每个成功的人,都有自己的至暗时刻。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

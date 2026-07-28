/**
 * 域B(事件/叙事) 联动增强 R642
 * 桥接：
 *   B→A  b642_event_pattern_analysis  事件模式分析 → 消费 state.flags._eventHistory+state.stats 数据,
 *     叙事→"从经历中提炼智慧"数据回响
 *   B→E  b642_story_wealth_lesson  故事财富教训 → 消费 state.flags+state.resources 数据,
 *     叙事→"经历塑造财富观"经济回响
 *   B→G  b642_narrative_resilience  叙事韧性 → 消费 state.flags+state.player+state.needs 数据,
 *     叙事→"故事让人更强大"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR642Loaded) return;
  RANDOM_EVENTS._domainBLinkageR642Loaded = true;

  var EVENTS = [
    {
      id: "b642_event_pattern_analysis", phase: "street", _isChainEvent: false, icon: "🧩",
      title: "从经历中提炼智慧",
      story: "回头看你经历过的那些事,你会发现一些反复出现的模式——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_b642PatternDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b642PatternDone) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 40;
      },
      choices: [
        { text: "📊 分析模式", hint: "智力+5,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b642PatternDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '从经历中提炼智慧,是最好的学习。' 你分析了事件模式。智力+5,心智+4。", "success");
        }},
        { text: "📖 写总结", hint: "管理XP+4,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b642PatternDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把经验写下来,就是永恒的财富。' 你总结了经历。管理XP+4,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var hist = st.flags._eventHistory || [];
        return "回头看你经历过的那些事——" + hist.length + "段经历中,有些模式反复出现。'从经历中提炼智慧,是最好的学习。'";
      }
    },
    {
      id: "b642_story_wealth_lesson", phase: "street", _isChainEvent: false, icon: "💰",
      title: "经历塑造财富观",
      story: "你经历过的那些事,塑造了你对金钱的态度——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 1, excludeFlags: ["_b642WealthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b642WealthDone) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 20;
      },
      choices: [
        { text: "🛡️ 稳健理财", hint: "心智+5,置_b642Conservative", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b642WealthDone = true;
          st.flags._b642Conservative = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛡️ '经历过穷,更懂得稳健。' 你选择了稳健理财。心智+5。", "success");
        }},
        { text: "🚀 适度冒险", hint: "智力+4,置_b642RiskTaker", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b642WealthDone = true;
          st.flags._b642RiskTaker = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '风险与收益并存。' 你选择适度冒险。智力+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你经历过的那些事,塑造了你对金钱的态度——'经历过穷,才知道钱的重要;经历过亏,才知道风险的可怕。'";
      }
    },
    {
      id: "b642_narrative_resilience", phase: "street", _isChainEvent: false, icon: "🧠",
      title: "故事让人更强大",
      story: "你听过一些故事,让你在困难面前更加坚韧——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 1, excludeFlags: ["_b642ResilienceDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b642ResilienceDone) return false;
        var mental = (st.player && st.player.mental) || 50;
        return mental < 50;
      },
      choices: [
        { text: "💪 重燃斗志", hint: "心智+7,置_b642Resilient", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b642ResilienceDone = true;
          st.flags._b642Resilient = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '别人能做到,我也能!' 你在故事中找到了力量。心智+7。", "success");
        }},
        { text: "📖 记录感悟", hint: "社交XP+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b642ResilienceDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把感悟写下来,力量更持久。' 你记录了这段心路。社交XP+4,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你听过一些故事,让你在困难面前更加坚韧——'每个成功的人,都有自己的至暗时刻。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

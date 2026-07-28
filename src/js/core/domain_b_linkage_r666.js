/**
 * 域B(事件/叙事) 联动增强 R666
 * 桥接：
 *   B→A  b660_event_pattern_library  事件模式库 → 消费 state.flags._eventHistory+state.stats 数据,
 *     叙事→"从经历中提炼智慧"数据回响
 *   B→E  b660_story_wealth_wisdom  故事财富智慧 → 消费 state.flags+state.resources 数据,
 *     叙事→"经历塑造财富观"经济回响
 *   B→G  b660_narrative_resilience_v2  叙事韧性v2 → 消费 state.flags+state.player+state.needs 数据,
 *     叙事→"故事让人更强大"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR666Loaded) return;
  RANDOM_EVENTS._domainBLinkageR666Loaded = true;

  var EVENTS = [
    {
      id: "b660_event_pattern_library", phase: "street", _isChainEvent: false, icon: "📚",
      title: "从经历中提炼智慧",
      story: "你开始建立自己的事件模式库,从过往经历中提炼智慧——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 1, excludeFlags: ["_b660LibDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b660LibDone) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 60;
      },
      choices: [
        { text: "📊 深度分析", hint: "智力+7,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b660LibDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 7);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '从经历中提炼智慧,是最好的学习。' 你建立了事件模式库。智力+7,心智+5。", "success");
        }},
        { text: "📖 写总结", hint: "管理XP+5,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b660LibDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把规律写下来,就是知识。' 你总结了事件模式。管理XP+5,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var hist = st.flags._eventHistory || [];
        return "你开始建立自己的事件模式库——" + hist.length + "条事件记录,每一段都是宝贵的数据。'从经历中提炼智慧,是最好的学习。'";
      }
    },
    {
      id: "b660_story_wealth_wisdom", phase: "street", _isChainEvent: false, icon: "💰",
      title: "经历塑造财富观",
      story: "你经历过的那些事,教会了你很多关于金钱的道理——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_b660WealthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b660WealthDone) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 30;
      },
      choices: [
        { text: "🛡️ 稳健为主", hint: "心智+6,置_b660Safe", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b660WealthDone = true;
          st.flags._b660Safe = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛡️ '经历过穷,更懂得稳健。' 你选择了稳健理财。心智+6。", "success");
        }},
        { text: "🚀 适度冒险", hint: "智力+4,置_b660Risk", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b660WealthDone = true;
          st.flags._b660Risk = true;
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
      id: "b660_narrative_resilience_v2", phase: "street", _isChainEvent: false, icon: "🧠",
      title: "故事让人更强大",
      story: "你听过一些故事,让自己在逆境中成长——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_b660ResilienceDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b660ResilienceDone) return false;
        var mental = (st.player && st.player.mental) || 50;
        return mental < 40;
      },
      choices: [
        { text: "💪 逆境成长", hint: "心智+9,置_b660Grit", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b660ResilienceDone = true;
          st.flags._b660Grit = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '逆境是最好的老师。' 你在故事中找到了力量。心智+9。", "success");
        }},
        { text: "📖 记录感悟", hint: "社交XP+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b660ResilienceDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把感悟写下来,力量更持久。' 你记录了这段心路。社交XP+5,心情+3。", "success");
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

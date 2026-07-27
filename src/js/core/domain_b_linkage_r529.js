/**
 * 域B(事件/叙事) 联动增强 R529
 * 桥接：
 *   B→G  b520_weather_life_weather  天气人生回响 → 消费 weather+needs 数据,
 *     事件→"天气影响心情"的生命体验
 *   B→C  b520_event_career_inspiration 事件职业灵感 → 消费 event+skills 数据,
 *     事件→"故事激发职业灵感"的成长回响
 *   B→E  b520_event_investment_awakening 事件投资觉醒 → 消费 event+resources 数据,
 *     事件→"新闻唤醒投资意识"的经济回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR529Loaded) return;
  RANDOM_EVENTS._domainBLinkageR529Loaded = true;

  var EVENTS = [
    {
      id: "b529_weather_life_resonance", phase: "street", _isChainEvent: false, icon: "🌤️",
      title: "天气与心情",
      story: "今天的天气让你感慨万千——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_b529WeatherLifeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b529WeatherLifeCooldown) return false;
        return st.weather && st.weather.current;
      },
      choices: [
        { text: "🌞 享受当下", hint: "心情+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b529WeatherLifeCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌤️ '天气真好，心情也好了。' 你享受这美好的一天。心情+5,心智+2。", "success");
        }},
        { text: "📝 记录感受", hint: "智力+2,社交XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b529WeatherLifeCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌤️ '这种感受值得记录。' 你写下了一篇日记。智力+2,社交XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var w = st.weather && st.weather.current ? st.weather.current : "sunny";
        var desc = { sunny: "阳光明媚，心情也跟着好起来", rainy: "雨天让人沉思", snowy: "雪景让人平静", cloudy: "阴天适合思考" }[w] || "天气影响心情";
        return "今天的天气让你感慨万千——'" + desc + "。' 你开始思考天气与人生的关系。";
      }
    },
    {
      id: "b529_event_career_inspiration", phase: "street", _isChainEvent: false, icon: "💡",
      title: "故事激发的职业灵感",
      story: "最近经历的事情让你对职业有了新的思考——{desc}",
      triggers: { minDay: 50, interval: 120, maxRepeats: 3, excludeFlags: ["_b529CareerInspCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b529CareerInspCooldown) return false;
        // 需要至少经历过一些事件
        return st.stats && st.stats.eventsTriggered >= 5;
      },
      choices: [
        { text: "🎯 投入学习", hint: "随机技能XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b529CareerInspCooldown = true;
          var skills = ["cooking", "repair", "sales", "coding", "accounting", "management"];
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '这些经历让我想学更多。" + sk + "技能XP+5。'", "success");
        }},
        { text: "📖 写下来", hint: "智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b529CareerInspCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '好记性不如烂笔头。' 你把灵感记录下来。智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "最近经历的事情让你对职业有了新的思考——'原来还有这样的可能。' 你开始规划未来的方向。";
      }
    },
    {
      id: "b529_event_investment_awakening", phase: "street", _isChainEvent: false, icon: "📈",
      title: "新闻唤醒投资意识",
      story: "最近的市场新闻让你开始关注投资——{desc}",
      triggers: { minDay: 40, interval: 100, maxRepeats: 3, excludeFlags: ["_b529InvestAwakeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b529InvestAwakeCooldown) return false;
        return (st.resources && (st.resources.cash || 0) >= 5000);
      },
      choices: [
        { text: "💰 小额试水", hint: "现金-1000,置投资意识flag", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b529InvestAwakeCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
          st.flags._dataInvestorMindset = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '用小钱学投资。' 你决定小额试水。现金-¥1000,投资意识觉醒。", "success");
        }},
        { text: "📚 先学习", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b529InvestAwakeCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '先学再投。' 你决定先学习投资知识。会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "最近的市场新闻让你开始关注投资——'钱存在银行会贬值。' 你开始思考如何让钱生钱。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();

/**
 * 域G(核心机制/生命周期) 联动增强 R422
 * 桥接：
 *   G→C  g422_lifecycle_career_v2   生命周期职业v2 → age+employment→职业阶段
 *   G→D  g422_weather_social_v2     天气社交v2 → weather+relationships→季节社交
 *   G→E  g422_needs_economy_v2       需求经济v2 → needs+investment→消费投资决策
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR422Loaded) return;
  RANDOM_EVENTS._domainGLinkageR422Loaded = true;
  function grantXp(key, amt) { if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} } }
  var EVENTS = [
    {
      id: "g422_lifecycle_career_v2", phase: "street", _isChainEvent: false, icon: "🔄",
      title: "职业阶段",
      story: "你站在职业的新阶段——{desc}",
      triggers: { minDay: 90, excludeFlags: ["_g422CareerCooldown"] },
      conditions: function (st) { return !st.gameOver; },
      choices: [
        { text: "🌟 规划下一阶段", hint: "心智+4,management XP+3", apply: function (st) {
          if (!st) return; st.flags._g422CareerCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          grantXp("management", 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 你规划职业下一阶段——每个阶段都有新的机遇。心智+4,管理XP+3。", "success");
        }},
        { text: "💪 做好当下", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var age = st.player.age || 20;
        var desc = age + "岁,职业发展正在稳步推进";
        if (st.career && st.career.history && st.career.history.length > 2) desc = "经历过多次职业变动,你更加清楚自己想要什么";
        return "你站在职业的新阶段——" + desc + "。";
      }
    },
    {
      id: "g422_weather_social_v2", phase: "street", _isChainEvent: false, icon: "🌤️",
      title: "天气与社交",
      story: "天气影响着人们的社交——{desc}",
      triggers: { minDay: 50, excludeFlags: ["_g422WeatherCooldown"] },
      conditions: function (st) { return !st.gameOver && st.relationships && Object.keys(st.relationships).length > 0; },
      choices: [
        { text: "🤝 趁好天气约朋友", hint: "心情+4,心智+2", apply: function (st) {
          if (!st) return; st.flags._g422WeatherCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌤️ 好天气适合社交——朋友让生活更美好。心情+4,心智+2。", "success");
        }},
        { text: "😌 在家休息", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "好天气适合外出社交,约朋友出来走走";
        if (st.weather && st.weather.season) {
          var map = { spring: "春暖花开,适合踏青", summer: "夏日炎炎,找个凉快的地方聚会", autumn: "秋高气爽,适合登高", winter: "冬日寒冷,围炉取暖" };
          desc = map[st.weather.season] || "天气在影响着人们的社交节奏";
        }
        return "天气影响着人们的社交——" + desc + "。";
      }
    },
    {
      id: "g422_needs_economy_v2", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "需求与经济",
      story: "生活需求与经济状况相互影响——{desc}",
      triggers: { minDay: 60, excludeFlags: ["_g422EconCooldown"] },
      conditions: function (st) { return !st.gameOver && st.needs && st.resources; },
      choices: [
        { text: "📊 平衡消费与投资", hint: "心智+3,accounting XP+3", apply: function (st) {
          if (!st) return; st.flags._g422EconCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          grantXp("accounting", 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ 你平衡消费与投资——合理的财务规划是生活的基础。心智+3,会计XP+3。", "success");
        }},
        { text: "🤷 过一天算一天", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "生活需求与经济状况需要平衡";
        if (st.needs && (st.needs.hunger || 0) > 60) desc = "饥饿感提醒你需要优先满足基本生存需求";
        return "生活需求与经济状况相互影响——" + desc + "。";
      }
    }
  ];
  for (var i = 0; i < EVENTS.length; i++) { if (!RANDOM_EVENTS.find(function (ev) { return ev.id === EVENTS[i].id; })) RANDOM_EVENTS.push(EVENTS[i]); }
})();

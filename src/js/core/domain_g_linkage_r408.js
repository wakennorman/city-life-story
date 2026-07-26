/**
 * 域G(核心机制/生命周期) 联动增强 R408
 * 第十七轮循环——把隐藏在weather/travel/lifecycle管线步骤中的数据转化为叙事体验。
 * 桥接：
 *   G→F  g408_weather_ui_v2          天气UI增强v2 → 消费 weather+season 数据,
 *     把天气系统数据转化为"今日天气如何影响行动"的UI提示
 *   G→B  g408_travel_narrative        旅行叙事 → 消费 travel+scenarios 数据,
 *     旅行经历→"旅途中的故事"叙事回响
 *   G→C  g408_lifecycle_milestone     生命周期里程碑 → 消费 age+day+story_chapters,
 *     年龄/天数→"人生走到哪一站了"的里程碑叙事
 *
 * 严格照 domain_g_linkage_r402.js / r391.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR408Loaded) return;
  RANDOM_EVENTS._domainGLinkageR408Loaded = true;

  var EVENTS = [
    {
      // G→F: 天气UI增强v2 — 消费 weather+season
      id: "g408_weather_ui_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🌤️",
      title: "天气与行动",
      story:
        "今天的天气{weatherDesc}。{actionHint}\n\n读懂天气,是城市生活的智慧。",
      triggers: { minDay: 30, excludeFlags: ["_g408WeatherCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.weather !== undefined;
      },
      choices: [
        {
          text: "📋 根据天气调整计划",
          hint: "心智+3,置 _g408WeatherCooldown(45天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g408WeatherCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🌤️ 你学会了根据天气调整计划——顺应天时,事半功倍。心智+3。", "success");
          }
        },
        {
          text: "😅 天气无所谓,干就完了",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "似乎不错";
        var hint = "适合外出行动";
        if (st.weather) {
          var w = st.weather;
          if (w.current) desc = w.current;
          if (w.season) {
            var seasonMap = { spring: "春暖花开", summer: "夏日炎炎", autumn: "秋高气爽", winter: "冬日寒冷" };
            hint = (seasonMap[w.season] || w.season) + ",注意调整行动节奏";
          }
        }
        return "今天的天气" + desc + "。" + hint + "。\n\n读懂天气,是城市生活的智慧。";
      }
    },
    {
      // G→B: 旅行叙事 — 消费 travel+scenarios
      id: "g408_travel_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "✈️",
      title: "旅途故事",
      story:
        "你想起旅途中的经历——{travelMemory}\n\n旅行不只是看风景,更是遇见自己。",
      triggers: { minDay: 80, excludeFlags: ["_g408TravelCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.travel && st.travel.visited && st.travel.visited.length > 0;
      },
      choices: [
        {
          text: "📖 记录旅途故事",
          hint: "心智+4,心情+3,置 _g408TravelCooldown(100天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g408TravelCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("✈️ 你记录了旅途故事——旅行是遇见自己的过程。心智+4,心情+3。", "success");
          }
        },
        {
          text: "😊 美好的回忆留在心里",
          hint: "心情+2",
          apply: function (st) {
            if (st && st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.travel || !st.travel.visited) return null;
        var places = st.travel.visited.length;
        var memory = "去过" + places + "个地方,每段旅程都有独特的风景和故事";
        if (st.travel.visited.length > 3) {
          memory = "走过" + places + "座城市,旅途让你看到了更大的世界";
        }
        return "你想起旅途中的经历——" + memory + "。\n\n旅行不只是看风景,更是遇见自己。";
      }
    },
    {
      // G→C: 生命周期里程碑 — 消费 age+day+story_chapters
      id: "g408_lifecycle_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "🎂",
      title: "人生走到哪一站",
      story:
        "你站在人生的某个节点——{milestoneText}\n\n{ageInsight}",
      triggers: { minDay: 90, excludeFlags: ["_g408MilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "🌟 感恩当下的自己",
          hint: "心智+5,心情+4,置 _g408MilestoneCooldown(120天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g408MilestoneCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🎂 你站在人生节点回望——每一段路程都值得被铭记。心智+5,心情+4。", "achievement");
          }
        },
        {
          text: "💪 继续前行,未来可期",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var age = st.player.age || 20;
        var day = st.player.day || 1;
        var text = age + "岁,来到这座城市第" + day + "天";
        var insight = "人生的每一步都算数";
        if (age >= 30) insight = "三十而立,你正在为自己的事业打下基础";
        else if (age >= 25) insight = "二十多岁是最宝贵的成长年华";
        else insight = "年轻就是最大的资本,勇敢去闯";
        return "你站在人生的某个节点——" + text + "。\n\n" + insight + "。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();

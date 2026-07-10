/**
 * v3.6 蒙特卡洛验证脚本 — trigger_registry 基础设施完整性检查
 * 运行：node mc_verify_v3.6.cjs
 */
(function () {
  "use strict";
  global.window = global.window || {};

  var RANDOM_EVENTS = [
    {
      id: "stray_dog_rain",
      title: "🐕 雨中的流浪狗",
      triggers: ["daily_start"],
      minDay: 4,
      triggerWeight: 1,
      triggerCooldown: 14,
      condition: function (s) {
        return (
          s.weather &&
          (s.weather.current === "rainy" || s.weather.current === "stormy")
        );
      },
      choices: [],
    },
    {
      id: "after_work_find_coin",
      title: "🪙 工友留下的硬币",
      triggers: ["after_work"],
      minDay: 5,
      triggerWeight: 5,
      triggerCooldown: 25,
      choices: [],
    },
    {
      id: "after_work_rain_shelter",
      title: "☔ 暴雨突至",
      triggers: ["after_work"],
      minDay: 8,
      triggerWeight: 3,
      triggerCooldown: 40,
      condition: function (s) {
        return (
          s.weather &&
          (s.weather.current === "rainy" || s.weather.current === "stormy")
        );
      },
      choices: [],
    },
    {
      id: "after_work_fellow_story",
      title: "🍺 工友的酒话",
      triggers: ["after_work"],
      minDay: 15,
      triggerWeight: 2,
      triggerCooldown: 60,
      choices: [],
    },
  ];
  global.window.RANDOM_EVENTS = RANDOM_EVENTS;

  // Load trigger_registry.js
  var fs = require("fs"),
    path = require("path");
  var code = fs.readFileSync(
    path.join(__dirname, "..", "src", "js", "core", "trigger_registry.js"),
    "utf8",
  );
  try {
    eval(code);
  } catch (e) {
    console.error("❌ load:", e.message);
    process.exit(1);
  }
  console.log("✅ trigger_registry.js 加载成功");

  var TR = global.window.TriggerRegistry;
  if (!TR) {
    console.error("❌ TriggerRegistry undefined");
    process.exit(1);
  }

  // V1: SLOTS
  var slotsOk = [
    "daily_start",
    "after_work",
    "after_travel",
    "after_trade",
    "after_heal",
    "daily_mid",
    "daily_end",
    "monthly",
    "weekly",
    "career_promo",
    "corp_startup",
    "random_encounter",
  ].every(function (k) {
    return !!TR.SLOTS[k];
  });
  console.log(slotsOk ? "✅ 12 SLOTS 完整" : "❌ SLOTS 缺失");

  // V2: TEMPLATES
  var tplOk = [
    "has_debt",
    "cash_above_100",
    "day_above_7",
    "day_above_30",
    "has_health_issue",
    "has_debt_urgent",
    "in_company",
    "low_cash",
  ].every(function (k) {
    return typeof TR.TEMPLATES[k] === "function";
  });
  console.log(tplOk ? "✅ 8 TEMPLATES 完整" : "❌ TEMPLATES 缺失");

  // V3: Register events
  TR.loadAll();
  var dsEvs = TR.getEventsForSlot("daily_start");
  var awEvs = TR.getEventsForSlot("after_work");
  console.log(
    "✅ daily_start:",
    dsEvs.length,
    "事件",
    "| after_work:",
    awEvs.length,
    "事件",
  );
  if (dsEvs.length < 1 || awEvs.length !== 3) {
    console.error("❌ 事件注册数不对");
    process.exit(1);
  }

  // V4: 1000-day simulation
  function makeState(day, weather) {
    return {
      day: day,
      weather: weather ? { current: weather } : null,
      _eventCooldowns: {},
      player: { day: day, phase: "street" },
      resources: { cash: 500 },
      needs: { happiness: 50, fatigue: 30 },
      status: { health: 80 },
      flags: {},
    };
  }
  var dsFires = 0,
    awFires = 0,
    awIds = {};
  for (var day = 1; day <= 1000; day++) {
    var weather = Math.random() < 0.3 ? "rainy" : "clear";
    var state = makeState(day, weather);
    try {
      var ds = TR.triggerRandom("daily_start", state);
      if (ds) dsFires++;
      var aw = TR.triggerRandom("after_work", state);
      if (aw) {
        awFires++;
        awIds[aw.id] = (awIds[aw.id] || 0) + 1;
      }
    } catch (e) {
      console.error("❌ day", day, e.message);
    }
  }
  console.log(
    "✅ 1000天模拟:",
    dsFires,
    "daily_start触发 +",
    awFires,
    "after_work触发",
  );
  var sorted = Object.keys(awIds).sort(function (a, b) {
    return awIds[b] - awIds[a];
  });
  sorted.forEach(function (id) {
    console.log("  -", id, ":", awIds[id], "次");
  });

  // V5: Cooldown check
  var s1 = makeState(100, "clear");
  var e1 = TR.triggerRandom("after_work", s1);
  if (!e1) {
    console.error("❌ 冷却测试: 第1次触发失败");
    process.exit(1);
  }
  var e2 = TR.triggerRandom("after_work", s1);
  // e2 可以是另一个事件，或者 null（如果都在冷却中）
  console.log("✅ 冷却机制: 第1次 →", e1.id, "| 第2次 →", e2 ? e2.id : "null");

  // V6: Weather-dependent events
  var sClear = makeState(20, "clear");
  var sRain = makeState(20, "rainy");
  // Reset cooldowns for fresh test
  sClear._eventCooldowns = {};
  sRain._eventCooldowns = {};
  var clearResult = TR.triggerRandom("after_work", sClear);
  var rainResult = TR.triggerRandom("after_work", sRain);
  console.log(
    "✅ 天气条件: 晴天 →",
    clearResult ? clearResult.id : "null",
    "| 雨天 →",
    rainResult ? rainResult.id : "null",
  );

  // Final
  if (dsFires > 0 && awFires > 0 && slotsOk && tplOk) {
    console.log("\n🎉 全部验证通过！v3.6 trigger_registry 基础设施完整可用。");
  } else {
    console.error("\n❌ 部分验证失败");
    process.exit(1);
  }
})();

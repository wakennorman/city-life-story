/**
 * v3.22 跨系统联动事件扩充 — 天气×工作/NPC/消费深度联动
 *
 * 与 cross_system_events_v321.js 相同的 IIFE 模式：
 *   在 RANDOM_EVENTS 数组上 push 新事件，加载顺序在之后即可。
 *
 * 5个事件覆盖的空白区域：
 *   1. 天气×工作联动（heatwave_outdoor_worker）
 *   2. NPC×天气联动（old_zhou_weather_tip）
 *   3. 天气×NPC联动（boss_li_typhoon_warning）
 *   4. 工作×NPC联动（zhang_factory_skill_offer）
 *   5. 天气×消费联动（heavy_smog_price_surge）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._crossSystemV322Loaded) return;
  RANDOM_EVENTS._crossSystemV322Loaded = true;

  var NEW_EVENTS = [
    // ===== 事件1：天气×工作联动 — 高温天户外工作选择 =====
    // 联动：weather.current + employment.currentJob + resources
    {
      id: "heatwave_outdoor_worker",
      phase: "street",
      icon: "🥵",
      title: "高温预警，干还是不干",
      story:
        "气象台发出高温红色预警，室外温度超过40度。\n" +
        "工地的工友说：「今天这天气，干一小时累得跟驴一样。」\n" +
        "但包工头说工期紧，今天必须赶进度。",
      conditions: function (st) {
        var w = st.weather && st.weather.current;
        var isOutdoor =
          st.employment &&
          st.employment.currentJob &&
          [
            "manual_labor_construction",
            "waste_recycling",
            "old_zhou_recycling",
            "street_vending_food",
            "street_vending_goods",
            "food_stall",
          ].includes(st.employment.currentJob.id);
        return (
          st.player.phase === "street" &&
          w === "heatwave" &&
          isOutdoor &&
          st.player.day >= 30
        );
      },
      probability: 0.1,
      repeatable: false,
      choices: [
        {
          text: "💧 买冰水防暑，继续干（¥15）",
          hint: "健康+3，疲劳+5",
          apply: function (st) {
            if (st.resources.cash >= 15) {
              st.resources.cash -= 15;
              st.status.health = Math.min(
                100,
                (st.status.health || 0) + 3,
              );
              st.needs.fatigue = Math.min(
                100,
                (st.needs.fatigue || 0) + 5,
              );
              var pay = st.employment.currentJob.payCalc(st);
              st.resources.cash += Math.floor(pay * 0.8);
              st.resources.totalEarned =
                (st.resources.totalEarned || 0) + Math.floor(pay * 0.8);
              StateManager.addMessage(
                "💧 买了冰水，顶着烈日干了一下午。收入打八折，但健康+3。拿到¥" +
                  Math.floor(pay * 0.8),
                "success",
              );
            } else {
              StateManager.addMessage(
                "😅 连¥15的冰水都买不起，只能在烈日下硬扛。",
                "warning",
              );
              st.status.health = Math.max(
                0,
                (st.status.health || 0) - 5,
              );
            }
          },
        },
        {
          text: "🌳 找阴凉处躲一躲，下午再去",
          hint: "收入×0.6，但健康+5",
          apply: function (st) {
            var pay = st.employment.currentJob.payCalc(st);
            st.resources.cash += Math.floor(pay * 0.6);
            st.resources.totalEarned =
              (st.resources.totalEarned || 0) + Math.floor(pay * 0.6);
            st.status.health = Math.min(100, (st.status.health || 0) + 5);
            StateManager.addMessage(
              "🌳 你在树荫下躲到下午才开工，收入打了六折，但身体没出事。拿到¥" +
                Math.floor(pay * 0.6) +
                "，健康+5。",
              "info",
            );
          },
        },
        {
          text: "🏠 今天实在没法干了，休息吧",
          hint: "零收入，健康+8，疲劳-10",
          apply: function (st) {
            st.status.health = Math.min(100, (st.status.health || 0) + 8);
            st.needs.fatigue = Math.max(
              0,
              (st.needs.fatigue || 0) - 10,
            );
            StateManager.addMessage(
              "🏠 你决定今天休息。身体是革命的本钱，健康+8。",
              "info",
            );
          },
        },
      ],
    },

    // ===== 事件2：NPC×天气联动 — 老周根据天气推荐废品出售时机 =====
    // 联动：relationships.old_zhou.met + weather.current + trade.currentLocation
    {
      id: "old_zhou_weather_tip",
      phase: "street",
      icon: "♻️",
      title: "老周的气象情报",
      story:
        "老周在废品站门口指着天说：\n" +
        "「小伙子，明天台风来了，这几天废品价格会上涨——大家清理家里杂物，废品多呢。\n" +
        "「要干就这两天赶紧收，别等台风过了。」",
      conditions: function (st) {
        var w = st.weather && st.weather.current;
        var nextDayForecast = st.weather && st.weather._nextDayForecast;
        var isTyphoonComing =
          nextDayForecast && nextDayForecast.weatherId === "typhoon";
        var isHeavyRainComing =
          nextDayForecast &&
          ["rainy", "stormy", "typhoon"].includes(nextDayForecast.weatherId);
        return (
          st.relationships &&
          st.relationships.old_zhou &&
          st.relationships.old_zhou.met &&
          st.trade &&
          st.trade.currentLocation === "wholesaleMarket" &&
          (st.player.day >= 15 || st.stats.actionFreq.waste_recycling > 0) &&
          (isTyphoonComing || isHeavyRainComing)
        );
      },
      probability: 0.08,
      repeatable: true,
      choices: [
        {
          text: "📦 听老周的，多收废品（需¥50进货）",
          hint: "台风前废品价格涨，但需资本",
          cost: 50,
          apply: function (st) {
            var profit = Random.int(80, 180);
            st.resources.cash += profit;
            st.resources.totalEarned =
              (st.resources.totalEarned || 0) + profit;
            if (!st.relationships.old_zhou.affinity)
              st.relationships.old_zhou.affinity = 0;
            st.relationships.old_zhou.affinity = Math.min(
              100,
              st.relationships.old_zhou.affinity + 5,
            );
            StateManager.addMessage(
              "📦 听老周的，台风前多收了一批废品。转手赚了¥" +
                profit +
                "，老周对你更信任了。",
              "success",
            );
          },
        },
        {
          text: "🤔 记在心里，明天去问问",
          hint: "无收益，但老周记性好感+3",
          apply: function (st) {
            if (!st.relationships.old_zhou.affinity)
              st.relationships.old_zhou.affinity = 0;
            st.relationships.old_zhou.affinity = Math.min(
              100,
              st.relationships.old_zhou.affinity + 3,
            );
            st.flags._oldZhouWeatherTipNoted = true;
            StateManager.addMessage(
              "🤔 你把老周的话记在心里。台风来了，废品价格确实涨了。",
              "info",
            );
          },
        },
        {
          text: "😒 老周也就嘴上说说",
          hint: "好感-3",
          apply: function (st) {
            st.relationships.old_zhou.affinity = Math.max(
              -100,
              (st.relationships.old_zhou.affinity || 0) - 3,
            );
            StateManager.addMessage(
              "😒 你觉得老周又在吹牛，不以为然。",
              "warning",
            );
          },
        },
      ],
    },

    // ===== 事件3：天气×NPC联动 — 李工头台风安全警告 =====
    // 联动：relationships.boss_li.met + weather.forecast + employment.currentJob
    {
      id: "boss_li_typhoon_warning",
      phase: "street",
      icon: "🌀",
      title: "台风来了，工地停工",
      story:
        "李工头急匆匆跑到你面前：\n" +
        "「台风预警了，明天工地必须停工！所有工人明天不要来！\n" +
        "「不过……我有个私活，台风天送材料到偏远仓库，敢不敢接？」",
      conditions: function (st) {
        var nextDayForecast = st.weather && st.weather._nextDayForecast;
        var isTyphoon =
          nextDayForecast && nextDayForecast.weatherId === "typhoon";
        var isHeavyRain =
          nextDayForecast &&
          ["rainy", "stormy", "typhoon"].includes(nextDayForecast.weatherId);
        return (
          st.relationships &&
          st.relationships.boss_li &&
          st.relationships.boss_li.met &&
          (isTyphoon || isHeavyRain) &&
          st.player.day >= 20
        );
      },
      probability: 0.08,
      repeatable: true,
      choices: [
        {
          text: "💪 接私活，风险高但钱多",
          hint: "收入×2，但疲劳+20，可能受伤",
          apply: function (st) {
            var pay = st.employment.currentJob
              ? st.employment.currentJob.payCalc(st)
              : 100;
            var bonus = Math.floor(pay * 1.5);
            st.resources.cash += bonus;
            st.resources.totalEarned =
              (st.resources.totalEarned || 0) + bonus;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
            if (Random.chance(0.3)) {
              st.status.health = Math.max(
                0,
                (st.status.health || 0) - 10,
              );
              StateManager.addMessage(
                "💪 你在台风天送完材料，拿了¥" +
                  bonus +
                  "。但路上摔了一跤，健康-10。",
                "warning",
              );
            } else {
              StateManager.addMessage(
                "💪 你在台风天送完材料，顺利拿到¥" +
                  bonus +
                  "。虽然累但平安无事。",
                "success",
              );
            }
          },
        },
        {
          text: "🏠 不接，安全第一",
          hint: "零收入，但健康+5",
          apply: function (st) {
            st.status.health = Math.min(100, (st.status.health || 0) + 5);
            StateManager.addMessage(
              "🏠 你拒绝了李工头，决定在家休息。健康+5。",
              "info",
            );
          },
        },
        {
          text: "💬 问李工头有没有更稳妥的活",
          hint: "好感+5，可能获得室内工作",
          apply: function (st) {
            st.relationships.boss_li.affinity = Math.min(
              100,
              (st.relationships.boss_li.affinity || 0) + 5,
            );
            var indoorPay = Random.int(80, 150);
            st.resources.cash += indoorPay;
            st.resources.totalEarned =
              (st.resources.totalEarned || 0) + indoorPay;
            StateManager.addMessage(
              "💬 李工头说让你帮忙整理仓库材料，不用出去。拿到¥" +
                indoorPay +
                "，安全又稳定。",
              "success",
            );
          },
        },
      ],
    },

    // ===== 事件4：工作×NPC联动 — 张姐发现你的技能，提供晋升机会 =====
    // 联动：relationships.sister_zhang.met + skills.repair/electrician + employment.currentJob
    {
      id: "zhang_factory_skill_offer",
      phase: "street",
      icon: "🏭",
      title: "张姐的升迁提议",
      story:
        "下班时张姐把你叫到一边：\n" +
        "「你技术不错啊，能不能帮忙修一下产线的设备？\n" +
        "「如果修得好，以后厂里的维修工长职位就留给你。」\n" +
        "她递给你一个工具箱：「试试？」",
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.sister_zhang &&
          st.relationships.sister_zhang.met &&
          st.employment &&
          st.employment.currentJob &&
          st.employment.currentJob.id === "factory_work_assembly" &&
          ((st.skills.repair && st.skills.repair.level >= 20) ||
            (st.skills.electrician && st.skills.electrician.level >= 20)) &&
          st.player.day >= 40
        );
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🔧 修设备，展示技术（需维修≥20级）",
          hint: "成功晋升，失败受伤",
          apply: function (st) {
            var skill = st.skills.repair || st.skills.electrician;
            var success = skill && skill.level >= 20 && Random.chance(0.7);
            if (success) {
              st.flags._factoryRepairMan = true;
              st.skills.repair.xp += 50;
              var bonus = Random.int(200, 400);
              st.resources.cash += bonus;
              st.resources.totalEarned =
                (st.resources.totalEarned || 0) + bonus;
              StateManager.addMessage(
                "🔧 你修好了设备，张姐非常满意！晋升维修工长，月薪+¥500，现金奖励¥" +
                  bonus +
                  "。",
                "success",
              );
            } else {
              st.status.health = Math.max(
                0,
                (st.status.health || 0) - 8,
              );
              StateManager.addMessage(
                "🔧 你试了半天没修好，还被机器烫了一下。健康-8。",
                "warning",
              );
            }
          },
        },
        {
          text: "🤔 谦虚一下，先观察",
          hint: "好感+5，后续再试",
          apply: function (st) {
            st.relationships.sister_zhang.affinity = Math.min(
              100,
              (st.relationships.sister_zhang.affinity || 0) + 5,
            );
            StateManager.addMessage(
              "🤔 你说：「张姐，我还需锻炼。」张姐点点头，等你准备好了再试。",
              "info",
            );
          },
        },
        {
          text: "🙅 拒绝，不想管设备",
          hint: "好感-5",
          apply: function (st) {
            st.relationships.sister_zhang.affinity = Math.max(
              -100,
              (st.relationships.sister_zhang.affinity || 0) - 5,
            );
            StateManager.addMessage(
              "🙅 你婉拒了张姐，表示只想干流水线。",
              "info",
            );
          },
        },
      ],
    },

    // ===== 事件5：天气×消费联动 — 重度雾霾口罩涨价 =====
    // 联动：weather.current + resources.cash + status.health
    {
      id: "heavy_smog_price_surge",
      phase: "street",
      icon: "😷",
      title: "口罩涨价了",
      story:
        "重度雾霾天，街边小卖部口罩价格从¥2涨到了¥5。\n" +
        "老板说：「雾霾天口罩需求大，进货价也涨了，不涨价我亏本啊。」\n" +
        "你看了看空气质量指数，又摸了摸口袋……",
      conditions: function (st) {
        var w = st.weather && st.weather.current;
        return (
          st.player.phase === "street" &&
          w === "heavy_smog" &&
          st.player.day >= 10 &&
          st.status.health < 70
        );
      },
      probability: 0.08,
      repeatable: true,
      choices: [
        {
          text: "😷 买口罩，防护健康（¥10）",
          hint: "健康+5，雾霾伤害减免",
          cost: 10,
          apply: function (st) {
            st.resources.cash -= 10;
            st.status.health = Math.min(100, (st.status.health || 0) + 5);
            StateManager.addMessage(
              "😷 你买了口罩，虽然贵了点，但雾霾天保护自己很重要。健康+5。",
              "success",
            );
          },
        },
        {
          text: "👕 用湿毛巾捂住口鼻",
          hint: "免费，效果差",
          apply: function (st) {
            st.status.health = Math.max(0, (st.status.health || 0) - 2);
            StateManager.addMessage(
              "👕 你用湿毛巾捂住口鼻，效果差但免费。健康-2。",
              "warning",
            );
          },
        },
        {
          text: "🏠 今天不出门了",
          hint: "健康+3，零收入",
          apply: function (st) {
            st.status.health = Math.min(100, (st.status.health || 0) + 3);
            StateManager.addMessage(
              "🏠 你决定今天不出门，躲在家里。健康+3，但没收入。",
              "info",
            );
          },
        },
      ],
    },
  ];

  // 将新事件推入 RANDOM_EVENTS 数组
  for (var i = 0; i < NEW_EVENTS.length; i++) {
    RANDOM_EVENTS.push(NEW_EVENTS[i]);
  }
})();
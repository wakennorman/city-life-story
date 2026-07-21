/**
 * 核心机制/生命周期域联动增强事件 — 域 G（核心机制/生命周期）跨域桥接
 *
 * 设计意图（全系统优化·循环 R12 · 域G）：
 *   游戏的时间轴很长（数十载、年关、退休、身后），但"人生节点"长期只作为
 *   数值跳变（age++ / corpYear++）而缺乏叙事回响。本文件补 3 个跨域桥接事件，
 *   把"时间流过"变成玩家能感知、能抉择的人生片段：
 *     ① life_city_anniversary   — G→D（人生→社交）：每满一年，与已结识 NPC 的年度相聚
 *     ② life_work_anniversary   — G→C（人生→职业）：入职每满一年，职场成长的仪式感
 *     ③ life_estate_planning     — G→E（人生→经济）：中年后资产传承/公益的抉择
 *
 * 接入方式：与 economy_linkage_events.js 相同的 IIFE 注入 RANDOM_EVENTS 模式
 * 全部字段 || 防御；数值标 [PLACEHOLDER]，待 playtest 调参。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._lifecycleLinkageLoaded) return;
  RANDOM_EVENTS._lifecycleLinkageLoaded = true;

  // ====== 工具: 估算玩家总资产（现金+存款+房产+车辆+股票市值+比特币）======
  function estimateTotalAssets(st) {
    var cash = (st.resources && st.resources.cash) || 0;
    var bank = (st.resources && st.resources.bankBalance) || 0;
    var total = cash + bank;
    var inv = st.investment;
    if (!inv) return total;
    if (inv.properties) {
      for (var i = 0; i < inv.properties.length; i++) {
        var p = inv.properties[i];
        total += p.currentPrice || p.buyPrice || 0;
      }
    }
    if (inv.cars) {
      for (var c = 0; c < inv.cars.length; c++) {
        var car = inv.cars[c];
        total += car.currentPrice || car.buyPrice || 0;
      }
    }
    if (inv.stockHoldings && inv.stockMarket) {
      for (var s = 0; s < inv.stockHoldings.length; s++) {
        var h = inv.stockHoldings[s];
        var m = inv.stockMarket[h.symbol];
        if (m && m.price) total += m.price * (h.shares || 0);
      }
    }
    if (inv.btcHoldings > 0 && inv.btcPrice > 0) {
      total += inv.btcHoldings * inv.btcPrice;
    }
    return total;
  }

  // ====== 工具: 选取好感最高的已结识 NPC id（守卫遍历）======
  function pickClosestMetNpc(st) {
    var rels = st.relationships || {};
    var bestId = null;
    var bestAff = -1;
    Object.keys(rels).forEach(function (k) {
      var r = rels[k];
      if (r && r.met && (r.affinity || 0) > bestAff) {
        bestAff = r.affinity || 0;
        bestId = k;
      }
    });
    return bestId;
  }

  // ====== 工具: 安全好感增减（优先 applyAffinityChange，否则自建 relationships 条目）======
  function safeAffinity(st, npcId, change, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "人生节点事件");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { affinity: 0, met: true };
    var rel = st.relationships[npcId];
    rel.affinity = (rel.affinity || 0) + change;
    if (rel.affinity > 100) rel.affinity = 100;
    if (rel.affinity < -100) rel.affinity = -100;
    rel.met = true;
  }

  var LIFE_EVENTS = [
    // ===== ① G→D：城中周年（人生节点→社交回响）=====
    {
      id: "life_city_anniversary",
      phase: "street",
      icon: "🗓️",
      title: "又一年，城中",
      story:
        "今天翻手机日历，忽然意识到：你来这座城，整整一年了。\n\n从火车站广场那个兜里只剩三百块的夜晚，到如今有了熟悉的早餐摊、常去的茶馆、几个能随时发消息的人——城市不再只是钢筋水泥，而是一本慢慢写满的通讯录。\n\n你想起这一年里帮过你、也被你帮过的人。",
      triggers: { minDay: 365, excludeFlags: ["_cityAnnivDone"] },
      conditions: function (st) {
        var day = (st.player && st.player.day) || 0;
        if (day < 365) return false;
        var yearMark = Math.floor(day / 365);
        // 每满一整年触发一次：记录已达成的周年数，避免每年反复弹
        if (((st.flags && st.flags._cityAnnivYear) || 0) >= yearMark)
          return false;
        var rels = st.relationships || {};
        var hasMet = Object.keys(rels).some(function (k) {
          var r = rels[k];
          return r && r.met;
        });
        return hasMet;
      },
      probability: 0.05, // [PLACEHOLDER] 触发率待 playtest
      repeatable: false,
      choices: [
        {
          text: "📞 约最好的一位熟人小聚",
          hint: "好感+[PLACEHOLDER]，心情+[PLACEHOLDER]",
          apply: function (st) {
            var yearMark = Math.floor((st.player.day || 0) / 365);
            if (st.flags) st.flags._cityAnnivYear = yearMark;
            var npcId = pickClosestMetNpc(st);
            safeAffinity(
              st,
              npcId,
              6 /*[PLACEHOLDER] 好感增益*/,
              "城中周年小聚",
            );
            st.needs.happiness = Math.min(
              100,
              (st.needs.happiness || 50) + 8 /*[PLACEHOLDER] 心情增益*/,
            );
            StateManager.addMessage(
              "📞 你拨通了那个最熟的号码，约了顿饭。一年了，值得为这座城、为这段关系举杯。好感+6，心情+8。",
              "success",
            );
          },
        },
        {
          text: "🌆 独自走走，和这座城待一会儿",
          hint: "心智+[PLACEHOLDER]，安静自省",
          apply: function (st) {
            var yearMark = Math.floor((st.player.day || 0) / 365);
            if (st.flags) st.flags._cityAnnivYear = yearMark;
            st.player.mental = Math.min(
              100,
              (st.player.mental || 50) + 5 /*[PLACEHOLDER] 心智增益*/,
            );
            StateManager.addMessage(
              "🌆 你没约人，只是沿着熟悉的街走了很久。一年前你不敢停下，如今你愿意为自己慢下来。心智+5。",
              "info",
            );
          },
        },
      ],
    },

    // ===== ② G→C：职场周年（人生节点→职业仪式感）=====
    {
      id: "life_work_anniversary",
      phase: "corporate",
      icon: "💼",
      title: "入职周年",
      story:
        "工位上那盆绿萝又长高了一截。HR 的系统推送了一条提醒：你入职满 " +
        (0 + 1) +
        " 年。\n\n你想起第一年手忙脚乱对需求、被导师拎去谈话的下午；如今你也能给新人讲清楚门道了。\n\n职场不是终点，是另一段人生的刻度尺。",
      triggers: { minDay: 1, excludeFlags: ["_workAnnivDone"] },
      conditions: function (st) {
        if (!st.player || st.player.phase !== "corporate") return false;
        var cy = st.player.corpYear || 0;
        if (cy < 1) return false;
        if (((st.flags && st.flags._lastWorkAnnivYear) || 0) >= cy)
          return false;
        return true;
      },
      probability: 0.05, // [PLACEHOLDER] 触发率待 playtest
      repeatable: false,
      choices: [
        {
          text: "🍻 组个小局，和组里同事庆祝",
          hint: "职场声誉+[PLACEHOLDER]，心情+[PLACEHOLDER]",
          apply: function (st) {
            if (st.flags) st.flags._lastWorkAnnivYear = st.player.corpYear || 0;
            if (st.player.corporate) {
              st.player.corporate.upwardMgmt = Math.min(
                100,
                (st.player.corporate.upwardMgmt || 50) +
                  5 /*[PLACEHOLDER] 职场声誉增益*/,
              );
            }
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            StateManager.addMessage(
              "🍻 你张罗了顿饭，组里几个人难得卸下工牌聊生活。一年了，有人记得你的成长，你也记得他们的。职场声誉+5，心情+6。",
              "success",
            );
          },
        },
        {
          text: "📝 安静复盘这一年",
          hint: "心智+[PLACEHOLDER]，沉淀",
          apply: function (st) {
            if (st.flags) st.flags._lastWorkAnnivYear = st.player.corpYear || 0;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            StateManager.addMessage(
              "📝 你没声张，只是把这一年的得失在文档里理了一遍：哪些事做成了，哪些坑别再踩。复盘让人踏实。心智+8。",
              "info",
            );
          },
        },
      ],
    },

    // ===== ③ G→E：世代资产（人生节点→经济传承）=====
    {
      id: "life_estate_planning",
      phase: "street",
      icon: "🏛️",
      title: "人到中年，身后之事",
      story:
        "体检报告摊在桌上，各项指标还算平稳，但医生那句「这个年纪要注意了」让你第一次认真想：万一。\n\n你攒下的票子和资产，若是哪天自己顾不上，该交给谁、怎么交？\n\n这不是晦气，是把辛苦半生换来的东西，安放进一个稳妥的结局。",
      triggers: { minDay: 1, excludeFlags: ["_estatePlanDone"] },
      conditions: function (st) {
        if (!st.flags || st.flags._estatePlanDone) return false;
        var age = (st.player && st.player.age) || 0;
        if (age < 40 /*[PLACEHOLDER] 触发年龄阈值待调参*/) return false;
        var total = estimateTotalAssets(st);
        if (total < 500000 /*[PLACEHOLDER] 资产门槛待调参*/) return false;
        return true;
      },
      probability: 0.04, // [PLACEHOLDER] 触发率待 playtest
      repeatable: false,
      choices: [
        {
          text: "📜 立下继承与安排",
          hint: "心智+[PLACEHOLDER]，标记家庭传承",
          apply: function (st) {
            if (st.flags) st.flags._estatePlanDone = true;
            if (st.family) st.family._estatePlanned = true;
            st.player.mental = Math.min(
              100,
              (st.player.mental || 50) + 6 /*[PLACEHOLDER] 心智增益*/,
            );
            StateManager.addMessage(
              "📜 你找了天傍晚，把继承安排和几笔重要资产交代清楚。想通了身后事，眼前反倒更轻了。心智+6。",
              "success",
            );
          },
        },
        {
          text: "🤝 划拨一笔做公益捐赠",
          hint: "¥15%现金(≤¥20k)，道德+5，心智+3",
          apply: function (st) {
            if (st.flags) st.flags._estatePlanDone = true;
            // [全系统自洽修复] 域B 修复: 叙事描述"捐一笔"但apply未扣款，按现金15%比例扣(封顶¥20k)
            var donation = Math.min(
              20000,
              Math.max(5000, Math.floor((st.resources.cash || 0) * 0.15)),
            );
            st.resources.cash = Math.max(
              0,
              (st.resources.cash || 0) - donation,
            );
            st.player.morality = Math.min(
              100,
              (st.player.morality || 50) + 5 /*[PLACEHOLDER] 道德增益*/,
            );
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            StateManager.addMessage(
              "🤝 你捐出¥" +
                donation.toLocaleString() +
                "委托给公益信托。钱离开了手，意义却留了下来。道德+5，心智+3。",
              "info",
            );
          },
        },
      ],
    },
  ];

  for (var i = 0; i < LIFE_EVENTS.length; i++) {
    RANDOM_EVENTS.push(LIFE_EVENTS[i]);
  }

  // ====== 联动增强 3 项：天气×旅行 / 人生节点×缎带 / 世界参数×季节 ======

  /** ① 旅行归来天气事件 — 旅行放松效果受归来后天气影响（G×F 联动） */
  RANDOM_EVENTS.push({
    id: "travel_return_weather_echo",
    icon: "🌤️",
    title: "旅行归来",
    phase: "street",
    probability: 0.03,
    // [自洽修复] 域G: 旅行flag + 天气系统双重门控
    conditions: function (st) {
      return (
        st.travel &&
        st.travel.visitedDestinations &&
        st.travel.visitedDestinations.length > 0 &&
        !st.flags._travelReturnWeatherEchoDone
      );
    },
    apply: function (st) {
      var lastDest =
        st.travel.visitedDestinations[st.travel.visitedDestinations.length - 1];
      var destName = "";
      if (typeof TRAVEL_DESTINATIONS !== "undefined") {
        var d = TRAVEL_DESTINATIONS[lastDest];
        destName = d ? d.name : lastDest;
      }
      var weatherId = (st.weather && st.weather.current) || "sunny";
      var weatherIcon =
        {
          sunny: "☀️",
          cloudy: "⛅",
          rainy: "🌧️",
          stormy: "⛈️",
          snowy: "❄️",
          foggy: "🌫️",
          heatwave: "🥵",
          cold_snap: "🥶",
          heavy_smog: "😷",
          typhoon: "🌀",
          sandstorm: "🌪️",
          plum_rain: "🌧️",
        }[weatherId] || "☀️";
      var weatherName =
        {
          sunny: "晴朗",
          cloudy: "多云",
          rainy: "小雨",
          stormy: "暴雨",
          snowy: "下雪",
          foggy: "大雾",
          heatwave: "高温",
          cold_snap: "寒潮",
          heavy_smog: "重度雾霾",
          typhoon: "台风",
          sandstorm: "沙尘暴",
          plum_rain: "梅雨",
        }[weatherId] || "未知";

      // 好天气→旅行记忆延续；坏天气→落差感
      if (
        ["sunny", "cloudy"].indexOf(weatherId) >= 0 ||
        weatherId === "windy"
      ) {
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
        st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
        StateManager.addMessage(
          "🌤️ 从" +
            destName +
            "回来后，今天天气正好。旅途的美好回忆在这一刻达到了顶峰。心情+5，心智+2。",
          "success",
        );
      } else {
        st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
        StateManager.addMessage(
          "🌧️ 从" +
            destName +
            "回来后，迎接你的是" +
            weatherIcon +
            weatherName +
            "。旅途的轻松感瞬间被现实浇灭。心情-3。",
          "warning",
        );
      }
      if (st.flags) st.flags._travelReturnWeatherEchoDone = true;
    },
  });

  /** ② 人生节点×缎带继承 — 人生节点选择影响多周目继承加成（G×H 联动） */
  RANDOM_EVENTS.push({
    id: "life_node_legacy_bonus",
    icon: "🎯",
    title: "人生回响",
    phase: "street",
    probability: 0.02,
    // [自洽修复] 域G: 人生节点flag + 多周目继承系统双重门控
    conditions: function (st) {
      return (
        st.flags &&
        (st.flags._gaokaoResult || st.flags._crisis35Path) &&
        !st.flags._lifeNodeLegacyDone &&
        st.player.day >= 60
      );
    },
    apply: function (st) {
      var narrative = "";
      var bonus = {};

      if (st.flags._gaokaoResult === "skip") {
        narrative =
          "你当年放弃了高考，直接闯社会。如今回头看，那份胆识让你在街头摸爬滚打时比别人多一分韧性。";
        bonus.physique = 3;
        bonus.agility = 2;
      } else if (st.flags._gaokaoResult === "excellent") {
        narrative =
          "高考那年你全力以赴，学到的知识和养成的思维习惯，至今仍在暗中帮你做出更好的判断。";
        bonus.intelligence = 3;
        bonus.mental = 2;
      } else if (st.flags._crisis35Path === "transform") {
        narrative =
          "35岁那年你选择充电转型，那段埋头学习的日子，让你在后来无数次关键时刻都能抓住机会。";
        bonus.intelligence = 2;
        bonus.charm = 2;
      } else if (st.flags._crisis35Path === "lieflat") {
        narrative =
          "你选择了不那么拼的人生。这份豁达让你在压力面前比别人更能稳住心态。";
        bonus.mental = 3;
        bonus.happiness = 5;
      } else {
        narrative =
          "人生的每一个选择都在暗中塑造着你。那些看似微不足道的决定，累积起来就是你独特的人生轨迹。";
        bonus.mental = 2;
        bonus.charm = 1;
      }

      StateManager.addMessage(
        "🎯 " +
          narrative +
          " 你感受到了一种跨越时间的力量——你的人生选择，正在成为你的遗产。",
        "info",
      );

      // 应用属性加成
      if (bonus.physique)
        st.player.physique = Math.min(
          100,
          (st.player.physique || 0) + bonus.physique,
        );
      if (bonus.agility)
        st.player.agility = Math.min(
          100,
          (st.player.agility || 0) + bonus.agility,
        );
      if (bonus.intelligence)
        st.player.intelligence = Math.min(
          100,
          (st.player.intelligence || 0) + bonus.intelligence,
        );
      if (bonus.mental)
        st.player.mental = Math.min(
          100,
          (st.player.mental || 50) + bonus.mental,
        );
      if (bonus.charm)
        st.player.charm = Math.min(100, (st.player.charm || 0) + bonus.charm);
      if (bonus.happiness)
        st.needs.happiness = Math.min(
          100,
          (st.needs.happiness || 50) + bonus.happiness,
        );

      if (st.flags) st.flags._lifeNodeLegacyDone = true;
    },
  });

  /** ④ 季节初体验 — 第一场雪/第一场雨的人生标记（G→B 联动） */
  // 设计心理学：峰终定律·季节转换的第一次总是最深刻
  RANDOM_EVENTS.push({
    id: "season_first_weather_echo",
    icon: "🌨️",
    title: "季节的第一场",
    phase: "street",
    probability: 0.05,
    conditions: function (st) {
      if (!st.weather || !st.weather.current || !st.weather.season)
        return false;
      if (st.flags && st.flags._seasonFirstWeatherSeen) return false;
      if (st.player && st.player.day < 7) return false;
      // 只有在出现对应季节的特征天气时才触发
      var w = st.weather.current;
      var s = st.weather.season;
      var match = false;
      // 冬→雪 春→雨/梅雨 夏→高温/暴雨 秋→雾/凉爽
      if (
        s === "winter" &&
        (w === "snowy" || w === "heavy_snow" || w === "cold_snap")
      )
        match = true;
      if (s === "spring" && (w === "rainy" || w === "plum_rain")) match = true;
      if (
        s === "summer" &&
        (w === "heatwave" || w === "stormy" || w === "typhoon")
      )
        match = true;
      if (s === "autumn" && (w === "foggy" || w === "heavy_smog")) match = true;
      return match;
    },
    apply: function (st) {
      if (st.flags) st.flags._seasonFirstWeatherSeen = true;
      var seasonName = (st.weather && st.weather.season) || "未知";
      var weatherId = (st.weather && st.weather.current) || "sunny";
      var weatherLabel =
        {
          snowy: "雪",
          heavy_snow: "大雪",
          cold_snap: "寒潮",
          rainy: "雨",
          plum_rain: "梅雨",
          heatwave: "高温",
          stormy: "暴雨",
          typhoon: "台风",
          foggy: "雾",
          heavy_smog: "雾霾",
        }[weatherId] || weatherId;
      var seasonLabel =
        { spring: "春", summer: "夏", autumn: "秋", winter: "冬" }[
          seasonName
        ] || seasonName;

      var housed = st.housing && st.housing.tier >= 1;
      var poor =
        (st.resources && (st.resources.cash || 0) < 500) ||
        (st.housing && st.housing.tier === 0);

      var narrative = "";
      if (
        weatherId === "snowy" ||
        weatherId === "heavy_snow" ||
        weatherId === "cold_snap"
      ) {
        if (poor) {
          narrative =
            seasonLabel +
            "天的第一场" +
            weatherLabel +
            "落下来了。你裹紧衣服，看着雪花落在城市的屋顶上。冷，但这座城市安静下来的时候，有一种说不出的温柔。";
        } else if (housed) {
          narrative =
            seasonLabel +
            "天的第一场" +
            weatherLabel +
            "来了。你站在窗边看了一会儿——这座城市换上了银装，连平时嘈杂的街道都安静了许多。";
        } else {
          narrative =
            seasonLabel +
            "天的第一场" +
            weatherLabel +
            "不期而至。你停下脚步，抬头看了一眼飘落的白色——这座城市在告诉你，又过了一季。";
        }
      } else if (weatherId === "plum_rain" || weatherId === "rainy") {
        narrative =
          seasonLabel +
          "天的第一场" +
          weatherLabel +
          "淅淅沥沥地下起来了。空气里有泥土和青草的味道——这座城市被洗过一遍，干净得让人想深呼吸。";
      } else if (weatherId === "heatwave") {
        narrative =
          seasonLabel +
          "天第一个高温日来了。阳光白晃晃地打在柏油路上，知了开始叫了——这座城市进入了最热烈的季节。";
      } else if (weatherId === "typhoon" || weatherId === "stormy") {
        narrative =
          seasonLabel +
          "天的第一场暴风雨。风很大，树被吹得东倒西歪——这座城市在经历它的脾气。";
      } else {
        narrative =
          seasonLabel +
          "天的第一场" +
          weatherLabel +
          "。这座城市换了一副面孔，你也是。";
      }

      st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
      st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
      StateManager.addMessage("🌨️ " + narrative + " 心情+4，心智+2。", "info");
    },
  });

  /** ⑤ 失业空窗期 — 失去工作后的身份重构时刻（G→C 联动） */
  // 设计心理学：损失厌恶·失去工作不仅是收入归零，更是社会坐标的迷失
  RANDOM_EVENTS.push({
    id: "jobless_identity_moment",
    icon: "🚪",
    title: "失业后的第一个早晨",
    phase: "street",
    probability: 0.05,
    conditions: function (st) {
      if (st.flags && st.flags._joblessIdentitySeen) return false;
      if (st.player && st.player.day < 15) return false;
      // 曾经有过工作，但现在失业了
      var hadJob = st.flags && st.flags._everHadJob;
      var currentlyJobless = !st.employment || !st.employment.currentJob;
      return hadJob && currentlyJobless;
    },
    apply: function (st) {
      if (st.flags) st.flags._joblessIdentitySeen = true;
      var prevJobLabel = (st.flags && st.flags._lastJobLabel) || "之前的工作";
      var cash = (st.resources && st.resources.cash) || 0;
      var savings = cash + ((st.resources && st.resources.bankBalance) || 0);
      var mentalDelta = 0;

      var narrative = "";
      if (savings < 1000) {
        narrative =
          prevJobLabel +
          "没有了。你站在出租屋门口，银行卡里只剩¥" +
          savings +
          "。今天没有打卡，没有工位，没有要去的地方。但你清楚——这座城市不会等你缓过来。你得自己走出去。";
        mentalDelta = 5;
        st.flags._joblessMotivation = true;
      } else if (savings < 10000) {
        narrative =
          prevJobLabel +
          "成了过去式。你盘点了一下——积蓄还能撑一阵。但「闲」这件事比想象中更磨人。你决定给自己三天时间想清楚下一步，然后重新出发。";
        mentalDelta = 3;
      } else {
        narrative =
          prevJobLabel +
          "结束了。你看着积蓄——不算多，但够你从容地找下一份工作。你忽然意识到，工作不只是收入，更是一种日常的锚。现在锚没了，你得重新找。";
        mentalDelta = 2;
      }

      st.player.mental = Math.min(
        100,
        Math.max(0, (st.player.mental || 50) + mentalDelta),
      );
      st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
      StateManager.addMessage(
        "🚪 " + narrative + " 心智+" + mentalDelta + "，心情-3。",
        "warning",
      );
    },
  });

  /** ⑥ 世界参数×季节叙事 — 季节变化+行业热度触发专属事件（G×E 联动） */
  RANDOM_EVENTS.push({
    id: "season_sector_narrative",
    icon: "🍂",
    title: "季节与时代",
    phase: "street",
    probability: 0.025,
    // [自洽修复] 域G: 世界参数 + 季节系统双重门控
    conditions: function (st) {
      return (
        st._worldParams &&
        st._worldParams.sectorHeat &&
        st.weather &&
        st.weather.season &&
        !st.flags._seasonSectorNarrativeDone
      );
    },
    apply: function (st) {
      var season = st.weather.season;
      var params = st._worldParams;
      var hottestSector = "";
      var hottestHeat = 0;
      for (var s in params.sectorHeat) {
        if (params.sectorHeat[s] > hottestHeat) {
          hottestHeat = params.sectorHeat[s];
          hottestSector = s;
        }
      }

      var seasonNarratives = {
        spring: {
          high:
            "春天来了，" +
            hottestSector +
            "行业的火热像这季节一样生机勃勃。街头多了许多带着梦想来找机会的人。",
          low:
            "春风拂面，" +
            hottestSector +
            "的热度却渐渐消退。也许是时候换个方向了。",
        },
        summer: {
          high:
            "酷暑难耐，但" +
            hottestSector +
            "行业的热情比天气更炽烈。有人在夏天抓住了翻身机会。",
          low:
            "烈日当空，" +
            hottestSector +
            "行业却像被晒蔫了的花。市场在降温，但冬天过后总有春天。",
        },
        autumn: {
          high:
            "秋高气爽，" +
            hottestSector +
            "行业的丰收季到了。汗水终于有了回报。",
          low:
            "落叶纷飞，" +
            hottestSector +
            "行业也进入了淡季。学会在低谷期蓄力，也是一种本事。",
        },
        winter: {
          high:
            "寒冬腊月，" +
            hottestSector +
            "行业却依然火热。逆周期操作的人，往往能捡到别人看不到的机会。",
          low:
            "大雪封门，" +
            hottestSector +
            "行业也进入了冰点。但你知道，最冷的时候，春天就不远了。",
        },
      };

      var narrative =
        (seasonNarratives[season] || {}).high ||
        "季节在变，行业在变，唯一不变的是你在这座城市里一天天走下去的决心。";

      if (hottestHeat < 1.0) {
        narrative = (seasonNarratives[season] || {}).low || narrative;
      }

      StateManager.addMessage(
        "🍂 " +
          narrative +
          "（当前最热行业：" +
          hottestSector +
          " · " +
          (hottestHeat * 100).toFixed(0) +
          "%）",
        "info",
      );

      // 轻微 buff：季节与行业共振时给一点点心情/心智
      st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
      st.player.mental = Math.min(100, (st.player.mental || 50) + 1);

      if (st.flags) st.flags._seasonSectorNarrativeDone = true;
    },
  });
})();

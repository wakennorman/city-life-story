/**
 * 跨系统联动事件 — 拆分片段 4/8（原 cross_system_events.js 机械拆分，行为不变）
 * 仅含自包含的 RANDOM_EVENTS.push 语句；顺序无关（事件选择走 phase 过滤+概率）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._crossPart4Loaded) return;
  RANDOM_EVENTS._crossPart4Loaded = true;

  RANDOM_EVENTS.push({
    id: "hygiene_low_sister_wu_remind",

    phase: "street",

    icon: "🚿",

    title: "吴姐的提醒",

    story:
      "你几天没顾上收拾，身上味儿重。吴姐不嫌弃，递你块肥皂：「干净点，人也精神。」",

    // conditions：sister_wu 已结识+好感 + 低卫生（NPC ∩ 需求系统）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["sister_wu"]; // 检查 sister_wu 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      if (typeof st.needs.hygiene !== "number" || st.needs.hygiene >= 25)
        return false; // 检查 低卫生

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 中后期

      if (st.flags && st.flags._hwWuSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🚿 洗个干净",

        hint: "卫生+ 好感+",

        apply: function (st) {
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 30);

          var rel = st.relationships && st.relationships["sister_wu"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._hwWuSeen = true;

          StateManager.addMessage(
            "你洗了个干净，卫生+30，吴姐好感+2。",

            "success",
          );
        },
      },

      {
        text: "🙈 先凑合",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["sister_wu"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._hwWuSeen = true;

          StateManager.addMessage("你先凑合，吴姐好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "hygiene_low_well",

    phase: "street",

    icon: "🚿",

    title: "贫民区的水龙头",

    story:
      "你身上味儿重，在贫民区倒没人嫌，巷口公用水龙头边的大爷招呼你：「这儿不讲体面讲活命，洗洗再来。」",

    // conditions：卫生极低 + 当前在贫民区（需求系统 + 交易地点系统）

    conditions: function (st) {
      var hyg = st.needs && st.needs.hygiene; // 检查 卫生

      if (typeof hyg !== "number" || hyg >= 30) return false; // 检查 卫生<30

      if (st.trade.currentLocation !== "slum") return false; // 检查 当前在贫民区

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 中后期

      if (st.flags && st.flags._hygieneWellSeen2) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "🚿 蹭水洗干净",

        hint: "卫生+ 名声+",

        apply: function (st) {
          if (st.needs)
            st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 22);

          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._hygieneWellSeen2 = true;

          StateManager.addMessage(
            "你蹭公用水洗了个干净，卫生+22，名声+2。",

            "success",
          );
        },
      },

      {
        text: "💧 只抹把脸",

        hint: "轻量 卫生+",

        apply: function (st) {
          if (st.needs)
            st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 10);

          st.flags._hygieneWellSeen2 = true;

          StateManager.addMessage("你只抹了把脸，卫生+10，不讲究。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "hygiene_wellness_sidehustle",

    phase: "street",

    icon: "🚿",

    title: "副业里的体面",

    story:
      "你副业跑得多，身上总灰头土脸，洗漱点老板给你办了张折扣卡：「看你天天忙活，干净点精神也好，回头客更多。」",

    // conditions：卫生差 + 副业进行中（需求×职业空白区）

    conditions: function (st) {
      var hyg = st.needs && st.needs.hygiene; // 检查 卫生

      if (typeof hyg !== "number" || hyg >= 30) return false; // 检查 卫生<30

      if (!(st.sideHustle && st.sideHustle.active)) return false; // 检查 副业进行中

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._hygieneWellSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🚿 办折扣卡",

        hint: "现金- 卫生+ 名声+",

        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 60); // 办卡花销

          if (st.needs)
            st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 25); // 卫生回升

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3); // 体面形象加分

          st.flags._hygieneWellSeen = true;

          StateManager.addMessage(
            "你办了洗漱折扣卡，花¥60换一身清爽，卫生+25，名声+3。",

            "success",
          );
        },
      },

      {
        text: "🧼 只蹭免费水",

        hint: "轻量 卫生+",

        apply: function (st) {
          if (st.needs)
            st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 12); // 卫生回升

          st.flags._hygieneWellSeen = true;

          StateManager.addMessage(
            "你只蹭了免费自来水洗把脸，卫生+12，不花钱。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "inflation_coding_freelance",

    phase: "street",

    icon: "💻",

    title: "通胀里的外包活",

    story:
      "通胀高企，小公司不愿养人，外包需求反而旺。你接点远程编程的散活：「钱毛了，技术活反倒吃香。」",

    // conditions：通胀指数高 + coding 技能 + 自由职业副业（时代变迁系统 + 技能系统 + 副业系统）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (typeof era.inflationIndex !== "number" || era.inflationIndex < 1.3)
        return false; // 检查 通胀指数>=1.3

      var code = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof code !== "number" || code < 20) return false; // 检查 coding>=20

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.sideHustle.type !== "freelance") return false; // 检查 副业为自由职业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._inflationFreeSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.022,

    repeatable: false,

    choices: [
      {
        text: "💻 接外包单",

        hint: "现金+ 技能+",

        apply: function (st) {
          st.resources.cash += 380;

          if (st.skills && st.skills.coding)
            st.skills.coding.level = Math.min(100, st.skills.coding.level + 2);

          st.flags._inflationFreeSeen = true;

          StateManager.addMessage(
            "你接下通胀期的外包单，落袋¥380，编程+2。",

            "success",
          );
        },
      },

      {
        text: "📨 只接小单",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 150;

          st.flags._inflationFreeSeen = true;

          StateManager.addMessage("你只接了俩小外包单，落袋¥150。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "inflation_era_wage",

    phase: "street",

    icon: "📈",

    title: "通胀里的算盘",

    story:
      "物价一路涨，懂算账的人吃香。你帮小老板们重新核成本、谈涨价：「这年头不会算账，辛苦钱都给通胀吃了。」",

    // conditions：时代通胀高 + accounting 技能（时代×经济空白区）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (typeof era.inflationIndex !== "number" || era.inflationIndex < 1.3)
        return false; // 检查 通胀指数>=1.3

      var acc = st.skills && st.skills.accounting && st.skills.accounting.level; // 检查 accounting 等级

      if (typeof acc !== "number" || acc < 15) return false; // 检查 accounting>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 20) return false; // 检查 中后期

      if (st.flags && st.flags._inflationWageSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "📈 接成本核账",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash += 480;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);

          st.flags._inflationWageSeen = true;

          StateManager.addMessage(
            "你帮小老板们核成本谈涨价，落袋¥480，名声+5。",

            "success",
          );
        },
      },

      {
        text: "🧮 只做顾问",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 170;

          st.flags._inflationWageSeen = true;

          StateManager.addMessage(
            "你只做通胀理财顾问，落袋¥170，不担账。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "inflation_welding_demand",

    phase: "street",

    icon: "🔩",

    title: "通胀里的焊活",

    story:
      "物价飞涨，基建维修的活儿反而紧俏。你手里有电焊手艺，东家抢着雇，工钱也水涨船高。",

    // conditions：高通胀时代 + welding 技能（时代变迁 ∩ 技能 ∩ 经济）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (typeof era.inflationIndex !== "number" || era.inflationIndex < 1.2)
        return false; // 检查 高通胀

      var wd = st.skills && st.skills.welding && st.skills.welding.level; // 检查 welding 等级

      if (typeof wd !== "number" || wd < 15) return false; // 检查 welding>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._infWeldSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🔩 接高价焊活",

        hint: "现金+ welding+",

        apply: function (st) {
          var s = st.skills.welding;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash += 320;

          st.flags._infWeldSeen = true;

          StateManager.addMessage(
            "通胀期你接下高价焊活，welding+2，落袋¥320。",

            "success",
          );
        },
      },

      {
        text: "🔧 只做零活",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 110;

          st.flags._infWeldSeen = true;

          StateManager.addMessage("你只做零活，落袋¥110。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "inheritance_family_morality",

    phase: "street",

    icon: "🏠",

    title: "远亲的嘱托",

    story:
      "一位远房亲戚留了点家底，指明要给本分人。你品行端正，这份托付顺理成章落到了你头上。",

    // conditions：高道德 + 中后期（家族/继承系统 ∩ 道德系统 ∩ 经济）

    conditions: function (st) {
      if (typeof st.player.morality !== "number" || st.player.morality < 50)
        return false; // 检查 高道德

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 20) return false; // 检查 中后期

      if (st.flags && st.flags._inheritSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🏠 接下家底",

        hint: "现金+ 道德+",

        apply: function (st) {
          st.resources.cash += 500;

          st.player.morality = Math.min(100, st.player.morality + 3);

          st.flags._inheritSeen = true;

          StateManager.addMessage(
            "你接下远亲家底，落袋¥500，道德+3。",

            "success",
          );
        },
      },

      {
        text: "🤝 分些给族人",

        hint: "轻量 道德+",

        apply: function (st) {
          st.player.morality = Math.min(100, st.player.morality + 5);

          st.flags._inheritSeen = true;

          StateManager.addMessage("你分了些给族人，道德+5。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r60_drive_fatigue",

    phase: "street",

    icon: "🚕",

    title: "代驾接单到深夜",

    story:
      "你兼职代驾，今晚单子格外多。方向盘握久了，眼皮直打架，得权衡接不接。",

    // conditions：driving 技能 + 代驾副业 + 疲劳（技能 ∩ 副业 ∩ 需求）

    conditions: function (st) {
      var dr = st.skills && st.skills.driving && st.skills.driving.level; // 检查 driving 等级

      if (typeof dr !== "number" || dr < 10) return false; // 检查 driving>=10

      if (!st.sideHustle || st.sideHustle.type !== "driving") return false; // 检查 代驾副业

      if (typeof st.needs.fatigue !== "number" || st.needs.fatigue < 60)
        return false; // 检查 疲劳高

      if (st.flags && st.flags._driveFatigueSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🚕 再接两单",

        hint: "现金+ 疲劳+",

        apply: function (st) {
          st.resources.cash += 150;

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);

          st.flags._driveFatigueSeen = true;

          StateManager.addMessage(
            "你咬牙多接两单，现金+¥150，疲劳+15。",

            "success",
          );
        },
      },

      {
        text: "😴 收车休息",

        hint: "轻量 幸福+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);

          st.flags._driveFatigueSeen = true;

          StateManager.addMessage("你收车歇了，幸福+5。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r60_english_xiaomei",

    phase: "street",

    icon: "🗣️",

    title: "英语角帮小美",

    story:
      "科技园办英语角，小美怯场不敢开口。你英语底子好，顺手帮她过了关，园子里也多了你名号。",

    // conditions：english 技能 + xiao_mei 已结识 + 科技园声望（技能 ∩ NPC ∩ 声望）

    conditions: function (st) {
      var en = st.skills && st.skills.english && st.skills.english.level; // 检查 english 等级

      if (typeof en !== "number" || en < 15) return false; // 检查 english>=15

      var rel = st.relationships && st.relationships["xiao_mei"]; // 检查 xiao_mei 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (
        typeof (st.reputation && st.reputation.techPark) !== "number" ||
        (st.reputation.techPark || 0) < 20
      )
        return false; // 检查 科技园声望>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._engXiaomeiSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🗣️ 带她练口语",

        hint: "声望+ 好感+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 4,
            );

          var rel = st.relationships["xiao_mei"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._engXiaomeiSeen = true;

          StateManager.addMessage(
            "小美开口了，科技园声望+4，小美好感+3。",

            "success",
          );
        },
      },

      {
        text: "📝 只改稿",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 2,
            );

          st.flags._engXiaomeiSeen = true;

          StateManager.addMessage("你只帮改了稿，科技园声望+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r60_rainy_soup",

    phase: "street",

    icon: "🍲",

    title: "雨天煮热汤",

    story:
      "下雨天街坊都不愿出门，你凭着一身厨艺支起小锅煮热汤，来问价的还真不少。",

    // conditions：cooking 技能 + 雨天 + 有交易地点（技能 ∩ 天气 ∩ 交易）

    conditions: function (st) {
      var ck = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof ck !== "number" || ck < 10) return false; // 检查 cooking>=10

      if (st.weather.current !== "rainy") return false; // 检查 雨天

      if (!st.trade || !st.trade.currentLocation) return false; // 检查 有交易地点

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 中后期

      if (st.flags && st.flags._rainySoupSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🍲 摆摊卖汤",

        hint: "现金+ cooking+",

        apply: function (st) {
          st.resources.cash += 120;

          st.skills.cooking.level = Math.min(100, st.skills.cooking.level + 1);

          st.flags._rainySoupSeen = true;

          StateManager.addMessage(
            "雨天人暖汤好卖，现金+¥120，cooking+1。",

            "success",
          );
        },
      },

      {
        text: "🤝 请街坊喝",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 3);

          st.flags._rainySoupSeen = true;

          StateManager.addMessage("你请街坊喝了汤，贫民区声望+3。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r61_accounting_chenbank",

    phase: "street",

    icon: "🧮",

    title: "帮陈叔理清账目",

    story:
      "银行里的陈叔被一摞旧账绊住了，知道你懂财会，拉你来搭把手。理清了，银行口的风评也好了。",

    // conditions：accounting 技能 + 银行声望 + uncle_chen_bank 已结识（技能 ∩ 声望 ∩ NPC）

    conditions: function (st) {
      var ac = st.skills && st.skills.accounting && st.skills.accounting.level; // 检查 accounting 等级

      if (typeof ac !== "number" || ac < 15) return false; // 检查 accounting>=15

      if (
        typeof (st.reputation && st.reputation.bank) !== "number" ||
        (st.reputation.bank || 0) < 20
      )
        return false; // 检查 银行声望>=20

      var rel = st.relationships && st.relationships["uncle_chen_bank"]; // 检查 uncle_chen_bank 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._accChenbankSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🧮 接手理账",

        hint: "现金+ 声望+",

        apply: function (st) {
          st.resources.cash += 200;

          if (st.reputation)
            st.reputation.bank = Math.min(100, (st.reputation.bank || 0) + 4);

          st.flags._accChenbankSeen = true;

          StateManager.addMessage(
            "你理清旧账，现金+¥200，银行声望+4。",

            "success",
          );
        },
      },

      {
        text: "📋 只指点",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships["uncle_chen_bank"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._accChenbankSeen = true;

          StateManager.addMessage("你只指点了两句，陈叔好感+3。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r61_repair_stormy",

    phase: "street",

    icon: "🔧",

    title: "暴风天修屋顶",

    story:
      "暴风雨砸漏了出租屋的顶，雨直往里灌。你正好会修，抄起家伙自己补上了。",

    // conditions：repair 技能 + 暴风天气 + 有住所（技能 ∩ 天气 ∩ 住所）

    conditions: function (st) {
      var rp = st.skills && st.skills.repair && st.skills.repair.level; // 检查 repair 等级

      if (typeof rp !== "number" || rp < 10) return false; // 检查 repair>=10

      if (st.weather.current !== "stormy") return false; // 检查 暴风

      if (!st.housing || (st.housing.tier || 0) < 1) return false; // 检查 有住所

      if (st.flags && st.flags._repairStormySeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🔧 自己补顶",

        hint: "现金+ 幸福+",

        apply: function (st) {
          st.resources.cash += 80;

          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 4);

          st.flags._repairStormySeen = true;

          StateManager.addMessage(
            "你自补屋顶省下工钱，现金+¥80，幸福+4。",

            "success",
          );
        },
      },

      {
        text: "🪜 顺手加固",

        hint: "轻量 repair+",

        apply: function (st) {
          st.skills.repair.level = Math.min(100, st.skills.repair.level + 1);

          st.flags._repairStormySeen = true;

          StateManager.addMessage("你顺手把屋顶加固了，repair+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r61_sales_bossli",

    phase: "street",

    icon: "📈",

    title: "推销业绩获李老板赏识",

    story:
      "你嘴皮子利索，跑业务接连开单。李老板看在眼里，点名让你带新人的小团队。",

    // conditions：sales 技能 + 有职业 + boss_li 已结识（技能 ∩ 就业 ∩ NPC）

    conditions: function (st) {
      var sl = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof sl !== "number" || sl < 15) return false; // 检查 sales>=15

      if (!st.employment || !st.employment.currentJob) return false; // 检查 有职业

      var rel = st.relationships && st.relationships["boss_li"]; // 检查 boss_li 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._salesBossliSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📈 带团队冲业绩",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash += 260;

          st.player.fame = (st.player.fame || 0) + 3;

          st.flags._salesBossliSeen = true;

          StateManager.addMessage(
            "李老板让你带团队，现金+¥260，名声+3。",

            "success",
          );
        },
      },

      {
        text: "🤝 只做师傅",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships["boss_li"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._salesBossliSeen = true;

          StateManager.addMessage("你只当师傅带新人，李老板好感+3。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r62_coding_growth",

    phase: "street",

    icon: "💻",

    title: "成长期接外包码活",

    story:
      "经济正往上走，科技园里外包单子多。你代码底子硬、园子里也有名号，接了一单顺手活。",

    // conditions：coding 技能 + 科技园声望 + 成长期（技能 ∩ 声望 ∩ 时代）

    conditions: function (st) {
      var cd = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof cd !== "number" || cd < 15) return false; // 检查 coding>=15

      if (
        typeof (st.reputation && st.reputation.techPark) !== "number" ||
        (st.reputation.techPark || 0) < 25
      )
        return false; // 检查 科技园声望>=25

      var era = st._eraState; // 检查 时代状态

      if (!era || era.stageId !== "growth") return false; // 检查 成长期

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._codeGrowthSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "💻 接下外包",

        hint: "现金+ coding+",

        apply: function (st) {
          st.resources.cash += 280;

          st.skills.coding.level = Math.min(100, st.skills.coding.level + 2);

          st.flags._codeGrowthSeen = true;

          StateManager.addMessage(
            "成长期你接下外包码活，现金+¥280，coding+2。",

            "success",
          );
        },
      },

      {
        text: "📦 只做模块",

        hint: "轻量 coding+",

        apply: function (st) {
          st.skills.coding.level = Math.min(100, st.skills.coding.level + 1);

          st.flags._codeGrowthSeen = true;

          StateManager.addMessage("你只做了个模块，coding+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r62_mgmt_stall",

    phase: "street",

    icon: "📊",

    title: "摆摊用上管理学",

    story: "你支起小摊，凭着管理脑子把进销存理得清清楚楚，街口同行都来讨教。",

    // conditions：management 技能 + 摆摊副业 + 有交易地点（技能 ∩ 副业 ∩ 交易）

    conditions: function (st) {
      var mg = st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级

      if (typeof mg !== "number" || mg < 15) return false; // 检查 management>=15

      if (!st.sideHustle || st.sideHustle.type !== "stall") return false; // 检查 摆摊副业

      if (!st.trade || !st.trade.currentLocation) return false; // 检查 有交易地点

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._mgmtStallSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📊 优化铺货",

        hint: "现金+ management+",

        apply: function (st) {
          st.resources.cash += 160;

          st.skills.management.level = Math.min(
            100,

            st.skills.management.level + 1,
          );

          st.flags._mgmtStallSeen = true;

          StateManager.addMessage(
            "你理顺了小摊进销存，现金+¥160，management+1。",

            "success",
          );
        },
      },

      {
        text: "🤝 带徒摆摊",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 3);

          st.flags._mgmtStallSeen = true;

          StateManager.addMessage("你带徒摆摊，贫民区声望+3。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r62_weld_heat",

    phase: "street",

    icon: "🔥",

    title: "高温下烧焊",

    story:
      "热浪滚滚，你在户外烧焊一身汗。讲究点的人知道先冲个凉再上手，免得中暑出岔子。",

    // conditions：welding 技能 + 热浪天气 + 卫生低（技能 ∩ 天气 ∩ 需求）

    conditions: function (st) {
      var w = st.skills && st.skills.welding && st.skills.welding.level; // 检查 welding 等级

      if (typeof w !== "number" || w < 10) return false; // 检查 welding>=10

      if (st.weather.current !== "heatwave") return false; // 检查 热浪

      if (typeof st.needs.hygiene !== "number" || st.needs.hygiene < 40)
        return false; // 检查 卫生低

      if (st.flags && st.flags._weldHeatSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🚿 先冲凉再焊",

        hint: "卫生+ 健康+",

        apply: function (st) {
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 20);

          st.status.health = Math.min(100, (st.status.health || 0) + 5);

          st.flags._weldHeatSeen = true;

          StateManager.addMessage(
            "你先冲凉再上手，卫生+20，健康+5。",

            "success",
          );
        },
      },

      {
        text: "🔥 硬扛着焊",

        hint: "轻量 疲劳+",

        apply: function (st) {
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);

          st.flags._weldHeatSeen = true;

          StateManager.addMessage("你硬扛着干完，疲劳+10。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r63_huanghua_comm",

    phase: "street",

    icon: "🛒",

    title: "黄哥拉你入团购",

    story: "黄哥搞社区团购缺个帮手，知道你正做这行副业，邀你一起跑货分利。",

    // conditions：brother_huang 已结识 + 社区副业 + 现金少（NPC ∩ 副业 ∩ 经济）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["brother_huang"]; // 检查 brother_huang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (!st.sideHustle || st.sideHustle.type !== "community") return false; // 检查 社区副业

      if (typeof st.resources.cash !== "number" || st.resources.cash < 200)
        return false; // 检查 现金少

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._huangCommSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🛒 一起跑货",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash += 130;

          var rel = st.relationships["brother_huang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._huangCommSeen = true;

          StateManager.addMessage(
            "你跟黄哥跑货分利，现金+¥130，好感+3。",

            "success",
          );
        },
      },

      {
        text: "📋 只供货",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 3);

          st.flags._huangCommSeen = true;

          StateManager.addMessage("你只供货给黄哥，贫民区声望+3。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r63_oldzhou_cooking",

    phase: "street",

    icon: "🍜",

    title: "老周来蹭饭",

    story:
      "老周闻着香味蹭上门，你下厨露了一手。老人家吃得眉开眼笑，直夸你手艺好。",

    // conditions：old_zhou 已结识 + cooking 技能（NPC ∩ 技能）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["old_zhou"]; // 检查 old_zhou 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      var ck = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof ck !== "number" || ck < 8) return false; // 检查 cooking>=8

      if (st.player.day < 8) return false; // 检查 中后期

      if (st.flags && st.flags._zhouCookSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🍜 再炒两个",

        hint: "好感+ 幸福+",

        apply: function (st) {
          var rel = st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);

          st.flags._zhouCookSeen = true;

          StateManager.addMessage("老周吃得开心，好感+4，幸福+6。", "success");
        },
      },

      {
        text: "🥡 打包给他",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._zhouCookSeen = true;

          StateManager.addMessage("你给老周打包了饭菜，好感+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r63_zhangzhi_morality",

    phase: "street",

    icon: "👀",

    title: "张姐眼里的你",

    story:
      "张姐在街坊里是个明白人，你平日的做派她都看在眼里。仗义些，贫民区风评就往上走。",

    // conditions：sister_zhang 已结识 + 高道德 + 贫民区声望（NPC ∩ 道德 ∩ 声望）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["sister_zhang"]; // 检查 sister_zhang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof st.player.morality !== "number" || st.player.morality < 60)
        return false; // 检查 高道德

      if (typeof (st.reputation && st.reputation.slum) !== "number")
        return false; // 检查 声望已初始化

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._zhangMorSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🤝 帮邻里出头",

        hint: "声望+ 好感+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 5);

          var rel = st.relationships["sister_zhang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._zhangMorSeen = true;

          StateManager.addMessage(
            "张姐替你美言，贫民区声望+5，好感+3。",

            "success",
          );
        },
      },

      {
        text: "🙂 低调做人",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships["sister_zhang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._zhangMorSeen = true;

          StateManager.addMessage("你低调行事，张姐好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r64_chen_mgmt",

    phase: "street",

    icon: "👨‍🍳",

    title: "陈厨让你当管事",

    story:
      "陈厨的档口越做越大，缺个会统筹的。你懂管理又有名气，他直接让你挂了管事的名。",

    // conditions：chef_chen 已结识 + management 技能 + 名声（NPC ∩ 技能 ∩ 名声）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["chef_chen"]; // 检查 chef_chen 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      var mg = st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级

      if (typeof mg !== "number" || mg < 12) return false; // 检查 management>=12

      if (typeof st.player.fame !== "number" || st.player.fame < 10)
        return false; // 检查 名声

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._chenMgmtSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "👨‍🍳 接下管事",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash += 220;

          var rel = st.relationships["chef_chen"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.flags._chenMgmtSeen = true;

          StateManager.addMessage(
            "你接下陈厨的管事，现金+¥220，好感+4。",

            "success",
          );
        },
      },

      {
        text: "📋 只出方案",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = (st.player.fame || 0) + 2;

          st.flags._chenMgmtSeen = true;

          StateManager.addMessage("你只给陈厨出方案，名声+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r64_decline_cash",

    phase: "street",

    icon: "📉",

    title: "衰退期囤点货",

    story:
      "经济走下坡，物价眼看要蹦。你手头有点积蓄，趁低在交易点囤了一批硬通货。",

    // conditions：衰退期 + 现金充裕 + 有交易地点（时代 ∩ 经济 ∩ 交易）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era || era.stageId !== "decline") return false; // 检查 衰退期

      if (typeof st.resources.cash !== "number" || st.resources.cash < 400)
        return false; // 检查 现金充裕

      if (!st.trade || !st.trade.currentLocation) return false; // 检查 有交易地点

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._declineCashSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "📉 逢低囤货",

        hint: "现金- 声望+",

        apply: function (st) {
          st.resources.cash = Math.max(0, st.resources.cash - 200);

          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 3,
            );

          st.flags._declineCashSeen = true;

          StateManager.addMessage(
            "衰退期你逢低囤货，现金-¥200，商区声望+3。",

            "success",
          );
        },
      },

      {
        text: "💰 落袋为安",

        hint: "轻量 幸福+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 4);

          st.flags._declineCashSeen = true;

          StateManager.addMessage("你选择落袋为安，幸福+4。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r64_stress_cooking",

    phase: "street",

    icon: "🍳",

    title: "压力大自己下厨",

    story:
      "心里压着事，浑身不自在。你钻进厨房鼓捣一顿热乎的，锅气一冒，紧绷的弦松了。",

    // conditions：心理压高 + 卫生低 + cooking 技能（心理 ∩ 需求 ∩ 技能）

    conditions: function (st) {
      var stress =
        st.player.health && st.player.health.mental
          ? st.player.health.mental.stress
          : 0; // 检查 心理压力

      if (stress < 50) return false; // 检查 压力>=50

      if (typeof st.needs.hygiene !== "number" || st.needs.hygiene < 50)
        return false; // 检查 卫生低

      var ck = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof ck !== "number" || ck < 5) return false; // 检查 cooking>=5

      if (st.flags && st.flags._stressCookSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🍳 认真做一顿",

        hint: "压力- 幸福+",

        apply: function (st) {
          if (st.player.health && st.player.health.mental)
            st.player.health.mental.stress = Math.max(
              0,

              st.player.health.mental.stress - 20,
            );

          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);

          st.flags._stressCookSeen = true;

          StateManager.addMessage(
            "你认真做了一顿，压力-20，幸福+6。",

            "success",
          );
        },
      },

      {
        text: "🥣 随便煮碗面",

        hint: "轻量 压力-",

        apply: function (st) {
          if (st.player.health && st.player.health.mental)
            st.player.health.mental.stress = Math.max(
              0,

              st.player.health.mental.stress - 8,
            );

          st.flags._stressCookSeen = true;

          StateManager.addMessage("你煮了碗面，压力-8。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r65_morality_loan",

    phase: "street",

    icon: "⚖️",

    title: "村长的「好意」",

    story:
      "村长找上门，说能给你放笔「周转钱」，利息高得吓人。你心里掂量：这钱看着救命，实则是坑。",

    // conditions：高道德 + 已有欠款（道德×贷款空白区）

    conditions: function (st) {
      if ((st.player.morality || 0) < 75) return false; // 检查 道德>=75

      var debt =
        (st.resources.villageDebt || 0) + (st.resources.loanPrincipal || 0); // 检查 欠款

      if (debt <= 0) return false; // 检查 已有欠款

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._moralLoanSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🙅 拒绝高利贷",

        hint: "道德+ 名声+",

        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 0) + 4);

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          st.flags._moralLoanSeen = true;

          StateManager.addMessage(
            "你咬牙拒绝了村长的高利贷，清白比钱重要。",

            "success",
          );
        },
      },

      {
        text: "😞 还是借了",

        hint: "现金+ 道德-",

        apply: function (st) {
          st.resources.cash += 500;

          st.player.morality = Math.max(0, (st.player.morality || 0) - 6);

          st.flags._moralLoanSeen = true;

          StateManager.addMessage(
            "你终究借了村长的钱，利息压得人喘不过气。",

            "warning",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r65_repair_rain",

    phase: "street",

    icon: "🌧️",

    title: "漏雨的屋檐",

    story:
      "连夜暴雨把出租屋的屋檐泡漏了，水顺着墙角往下淌。你想起练过的维修手艺，抄起工具就爬上梯子。",

    // conditions：雨天/暴雨 + repair 技能 + 有住所（技能×天气×需求空白区）

    conditions: function (st) {
      if (!st.housing || st.housing.tier < 1) return false; // [Layer3] 叙事涉及出租屋

      var w = st.weather && st.weather.current; // 检查 天气

      if (w !== "rainy" && w !== "stormy") return false; // 检查 雨天或暴雨

      var rep = st.skills && st.skills.repair && st.skills.repair.level; // 检查 repair 等级

      if (typeof rep !== "number" || rep < 10) return false; // 检查 repair>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 中后期

      if (st.flags && st.flags._repairRainSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🔧 自己修好",

        hint: "现金- 维修+ 幸福+",

        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 60); // 材料

          if (st.skills && st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 30;

          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);

          st.flags._repairRainSeen = true;

          StateManager.addMessage(
            "你冒雨修好屋檐，省下一笔工钱，心里踏实了。",

            "success",
          );
        },
      },

      {
        text: "📞 叫师傅",

        hint: "现金- 轻量",

        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 180);

          st.flags._repairRainSeen = true;

          StateManager.addMessage(
            "你请师傅来修，花了¥180，屋檐不再漏。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r65_xiaomei_english",

    phase: "street",

    icon: "🗣️",

    title: "小美的翻译活",

    story:
      "小美在夜市碰见你，说她姐夫的外贸单缺个临时翻译：「你英文不是还行吗？这活儿来钱快，带你去见见世面。」",

    // conditions：小美已结识 + 好感 + english 技能（NPC×技能×经济空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.xiao_mei; // 检查 小美关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 20) return false; // 检查 好感>=20

      var eng = st.skills && st.skills.english && st.skills.english.level; // 检查 english 等级

      if (typeof eng !== "number" || eng < 15) return false; // 检查 english>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._xmEngSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🌐 接下翻译",

        hint: "现金+ 名声+ 英文+",

        apply: function (st) {
          st.resources.cash += 360;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          if (st.skills && st.skills.english)
            st.skills.english.xp = (st.skills.english.xp || 0) + 25;

          if (st.relationships && st.relationships.xiao_mei)
            st.relationships.xiao_mei.affinity = Math.min(
              100,

              st.relationships.xiao_mei.affinity + 3,
            );

          st.flags._xmEngSeen = true;

          StateManager.addMessage(
            "你接下小美介绍的翻译活，落袋¥360，英文也更溜了。",

            "success",
          );
        },
      },

      {
        text: "🙅 婉拒",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.xiao_mei)
            st.relationships.xiao_mei.affinity = Math.max(
              -100,

              st.relationships.xiao_mei.affinity - 2,
            );

          st.flags._xmEngSeen = true;

          StateManager.addMessage("你婉拒了小美，她有点小失落。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r66_fame_rent",

    phase: "street",

    icon: "🏠",

    title: "名气换房租",

    story:
      "你在街坊里小有名气，房东笑着递来一张纸条：「你这人靠谱，下季度房租给你抹个零头，往后多帮衬。」",

    // conditions：名声高 + 已租房（名声×经济空白区）

    conditions: function (st) {
      if ((st.player.fame || 0) < 30) return false; // 检查 名声>=30

      if (!st.housing || (st.housing.tier || 0) < 1) return false; // 检查 已租房

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._fameRentSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🤝 谢过房东",

        hint: "现金+ 幸福+",

        apply: function (st) {
          st.resources.cash += 240;

          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);

          st.flags._fameRentSeen = true;

          StateManager.addMessage(
            "房东给你抹了¥240房租零头，你心里暖暖的。",

            "success",
          );
        },
      },

      {
        text: "🎁 回请一顿",

        hint: "现金- 名声+",

        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 120);

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          st.flags._fameRentSeen = true;

          StateManager.addMessage("你回请房东吃顿饭，名声又涨了点。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r66_oldzhou_electrician",

    phase: "street",

    icon: "💡",

    title: "老周的电工活",

    story:
      "老周拍着你肩膀：「小兄弟手巧，我跟个物业管事的熟，缺个临时电工，要不要跟我去见见？」",

    // conditions：老周已结识 + 好感 + electrician 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.old_zhou; // 检查 老周关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 25) return false; // 检查 好感>=25

      var ele =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 检查 electrician 等级

      if (typeof ele !== "number" || ele < 10) return false; // 检查 electrician>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._ozEleSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🔌 跟老周去",

        hint: "现金+ 电工+ 好感+",

        apply: function (st) {
          st.resources.cash += 300;

          if (st.skills && st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 30;

          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.min(
              100,

              st.relationships.old_zhou.affinity + 4,
            );

          st.flags._ozEleSeen = true;

          StateManager.addMessage(
            "你跟着老周接下电工活，落袋¥300，老周更信你。",

            "success",
          );
        },
      },

      {
        text: "🙅 这回不去",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.max(
              -100,

              st.relationships.old_zhou.affinity - 2,
            );

          st.flags._ozEleSeen = true;

          StateManager.addMessage("你推了老周的活，他有点意外。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r66_welding_typhoon",

    phase: "street",

    icon: "🌪️",

    title: "台风里的抢修",

    story:
      "台风把街区招牌吹得东倒西歪，老板急吼吼找会电焊的人加固。你披上雨衣抄起焊枪就上。",

    // conditions：台风/风暴 + welding 技能（技能×天气空白区）

    conditions: function (st) {
      var w = st.weather && st.weather.current; // 检查 天气

      if (w !== "typhoon" && w !== "stormy") return false; // 检查 台风或风暴

      var weld = st.skills && st.skills.welding && st.skills.welding.level; // 检查 welding 等级

      if (typeof weld !== "number" || weld < 15) return false; // 检查 welding>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._weldTyphoonSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🔥 接单抢修",

        hint: "现金+ 焊接+ 风险",

        apply: function (st) {
          st.resources.cash += 520;

          if (st.skills && st.skills.welding)
            st.skills.welding.xp = (st.skills.welding.xp || 0) + 35;

          if (st.needs)
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);

          st.flags._weldTyphoonSeen = true;

          StateManager.addMessage(
            "你冒台风抢修招牌，落袋¥520，焊技见长但累得不轻。",

            "success",
          );
        },
      },

      {
        text: "🏠 躲风休息",

        hint: "轻量 疲惫+",

        apply: function (st) {
          if (st.needs)
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);

          st.flags._weldTyphoonSeen = true;

          StateManager.addMessage("你躲进屋里避风，安全第一。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r67_boss_li_mgmt",

    phase: "corporate",

    icon: "🤝",

    title: "李总的内推",

    story: "李总拍板：「你管理有一套，我公司正好缺个小组长，要不要过来？」",

    // conditions：李总已结识 + 好感 + management 技能 + 在职（NPC×技能×就业空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.boss_li; // 检查 李总关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 30) return false; // 检查 好感>=30

      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级

      if (typeof mgmt !== "number" || mgmt < 15) return false; // 检查 management>=15

      if (!st.employment || !st.employment.currentJob) return false; // 检查 在职

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._bossLiMgmtSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📈 接下内推",

        hint: "名声+ 公司好感+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);

          if (st.corporate && st.corporate.company)
            st.corporate.company = st.corporate.company; // 占位：保留现有公司

          if (st.relationships && st.relationships.boss_li)
            st.relationships.boss_li.affinity = Math.min(
              100,

              st.relationships.boss_li.affinity + 5,
            );

          st.flags._bossLiMgmtSeen = true;

          StateManager.addMessage(
            "你接下李总的内推，名声+6，职场路子更宽。",

            "success",
          );
        },
      },

      {
        text: "🙅 暂不考虑",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.boss_li)
            st.relationships.boss_li.affinity = Math.max(
              -100,

              st.relationships.boss_li.affinity - 3,
            );

          st.flags._bossLiMgmtSeen = true;

          StateManager.addMessage("你婉拒了李总，他点点头没勉强。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r67_heatwave_cooking",

    phase: "street",

    icon: "🍧",

    title: "热浪里的凉品",

    story:
      "热浪滚滚，路人渴得直舔嘴唇。你支起小摊，用厨艺熬了锅酸梅汤，凉丝丝的生意火爆。",

    // conditions：热浪 + cooking 技能（天气×技能×经济空白区）

    conditions: function (st) {
      var w = st.weather && st.weather.current; // 检查 天气

      if (w !== "heatwave") return false; // 检查 热浪

      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof cook !== "number" || cook < 10) return false; // 检查 cooking>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._heatCookSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🍧 摆摊卖汤",

        hint: "现金+ 厨艺+ 疲惫+",

        apply: function (st) {
          st.resources.cash += 260;

          if (st.skills && st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 25;

          if (st.needs)
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);

          st.flags._heatCookSeen = true;

          StateManager.addMessage(
            "热浪里你的酸梅汤卖了¥260，厨艺见长。",

            "success",
          );
        },
      },

      {
        text: "🥤 自己解暑",

        hint: "轻量 幸福+",

        apply: function (st) {
          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);

          st.flags._heatCookSeen = true;

          StateManager.addMessage(
            "你给自己盛了碗酸梅汤，暑气消了大半。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r67_sales_techpark",

    phase: "street",

    icon: "💼",

    title: "科技园的地推",

    story:
      "科技园里公司扎堆，你凭着嘴皮子帮人推销办公耗材，园区里攒下的好名声让你一路绿灯。",

    // conditions：sales 技能 + 科技园声望 + 科技园位置（技能×声望×地点空白区）

    conditions: function (st) {
      if (!st.trade || st.trade.currentLocation !== "techPark") return false; // [Layer3] 叙事涉及科技园

      var sales = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof sales !== "number" || sales < 15) return false; // 检查 sales>=15

      if (((st.reputation && st.reputation.techPark) || 0) < 10) return false; // 检查 科技园声望>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._salesTpSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📣 大干一场",

        hint: "现金+ 销售+ 声望+",

        apply: function (st) {
          st.resources.cash += 420;

          if (st.skills && st.skills.sales)
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 30;

          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 5,
            );

          st.flags._salesTpSeen = true;

          StateManager.addMessage(
            "你在科技园地推大赚¥420，销售更老练，声望也涨了。",

            "success",
          );
        },
      },

      {
        text: "🤝 只做熟客",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 3,
            );

          st.flags._salesTpSeen = true;

          StateManager.addMessage("你只服务熟客，口碑稳稳的。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r68_driving_bank",

    phase: "street",

    icon: "🚗",

    title: "开车跑银行",

    story:
      "你在跑车副业，银行那边熟客多，这天被叫去连跑几趟网点送文件，油费报销还另给辛苦费。",

    // conditions：开车副业 + driving 技能 + 银行声望（技能×副业×声望空白区）

    conditions: function (st) {
      if (!st.sideHustle || st.sideHustle.type !== "driving") return false; // 检查 开车副业

      var drv = st.skills && st.skills.driving && st.skills.driving.level; // 检查 driving 等级

      if (typeof drv !== "number" || drv < 10) return false; // 检查 driving>=10

      if (((st.reputation && st.reputation.bank) || 0) < 5) return false; // 检查 银行声望>=5

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._drvBankSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🚗 跑完这几趟",

        hint: "现金+ 驾驶+ 声望+",

        apply: function (st) {
          st.resources.cash += 320;

          if (st.skills && st.skills.driving)
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 25;

          if (st.reputation)
            st.reputation.bank = Math.min(100, (st.reputation.bank || 0) + 4);

          st.flags._drvBankSeen = true;

          StateManager.addMessage(
            "你跑完银行几趟，落袋¥320，驾驶更稳，银行声望+4。",

            "success",
          );
        },
      },

      {
        text: "🛑 只跑一趟",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 110;

          st.flags._drvBankSeen = true;

          StateManager.addMessage("你只跑了一趟，落袋¥110，留着力气。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r68_sister_wu_rep",

    phase: "street",

    icon: "🧧",

    title: "吴姐的口碑单",

    story:
      "吴姐在巷口跟人夸你：「这后生靠谱，活儿交给他放心。」转头塞给你一单跑腿的活。",

    // conditions：吴姐已结识 + 好感 + 贫民区声望（NPC×声望×经济空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_wu; // 检查 吴姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 20) return false; // 检查 好感>=20

      if (((st.reputation && st.reputation.slum) || 0) < 10) return false; // 检查 贫民区声望>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._swRepSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🧧 接下活儿",

        hint: "现金+ 声望+ 好感+",

        apply: function (st) {
          st.resources.cash += 280;

          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 4);

          if (st.relationships && st.relationships.sister_wu)
            st.relationships.sister_wu.affinity = Math.min(
              100,

              st.relationships.sister_wu.affinity + 3,
            );

          st.flags._swRepSeen = true;

          StateManager.addMessage(
            "你接下吴姐的口碑单，落袋¥280，贫民区声望+4。",

            "success",
          );
        },
      },

      {
        text: "🙅 这回没空",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_wu)
            st.relationships.sister_wu.affinity = Math.max(
              -100,

              st.relationships.sister_wu.affinity - 2,
            );

          st.flags._swRepSeen = true;

          StateManager.addMessage("你这回没空，吴姐理解地摆摆手。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r68_talent_referral",

    phase: "corporate",

    icon: "🌟",

    title: "天赋带来的门路",

    story:
      "你点亮的那个天赋分支在圈里传开了，有前辈主动找你：「听说你那手绝活，我公司正缺人，来聊聊？」",

    // conditions：已激活天赋节点 + 在职（天赋×就业空白区）

    conditions: function (st) {
      if (!st.talentNodes || Object.keys(st.talentNodes).length === 0)
        return false; // 检查 已激活天赋

      if (!st.employment || !st.employment.currentJob) return false; // 检查 在职

      if (st.player.phase !== "corporate") return false; // 检查 职场阶段

      if (st.player.day < 15) return false; // 检查 中后期

      if (st.flags && st.flags._talentRefSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🤝 赴约面谈",

        hint: "名声+ 公司好感+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);

          st.flags._talentRefSeen = true;

          StateManager.addMessage(
            "前辈的内推让你名声+5，职场路子更宽。",

            "success",
          );
        },
      },

      {
        text: "🙅 暂时不去",

        hint: "轻量",

        apply: function (st) {
          st.flags._talentRefSeen = true;

          StateManager.addMessage("你记下了这门路，暂未赴约。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r69_accounting_trade",

    phase: "street",

    icon: "📒",

    title: "帮人理账",

    story:
      "你在集市摆摊，旁边小贩愁眉苦脸地对不上账。你用会计底子三两下帮他理清了进出，他连连道谢。",

    // conditions：accounting 技能 + 有交易地点（技能×交易空白区）

    conditions: function (st) {
      var acc = st.skills && st.skills.accounting && st.skills.accounting.level; // 检查 accounting 等级

      if (typeof acc !== "number" || acc < 15) return false; // 检查 accounting>=15

      if (!st.trade || !st.trade.currentLocation) return false; // 检查 有交易地点

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._accTradeSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📒 收个辛苦费",

        hint: "现金+ 会计+",

        apply: function (st) {
          st.resources.cash += 200;

          if (st.skills && st.skills.accounting)
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 25;

          st.flags._accTradeSeen = true;

          StateManager.addMessage(
            "你帮小贩理清账目，落袋¥200，会计更熟了。",

            "success",
          );
        },
      },

      {
        text: "🙅 免费帮忙",

        hint: "轻量 幸福+",

        apply: function (st) {
          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 4);

          st.flags._accTradeSeen = true;

          StateManager.addMessage(
            "你免费帮了忙，小贩感激，你心里也舒坦。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r69_aunt_wang_morality",

    phase: "street",

    icon: "🧶",

    title: "王姨的托付",

    story:
      "王姨攥着个信封找你：「这点钱帮我存着，我信你这孩子的人品。」你掂量着，没辜负这份信任。",

    // conditions：王姨已结识 + 好感 + 高道德（NPC×道德空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.aunt_wang; // 检查 王姨关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 20) return false; // 检查 好感>=20

      if ((st.player.morality || 0) < 50) return false; // 检查 道德>=50

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._awMoralSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🤝 受托保管",

        hint: "道德+ 好感+",

        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 0) + 4);

          if (st.relationships && st.relationships.aunt_wang)
            st.relationships.aunt_wang.affinity = Math.min(
              100,

              st.relationships.aunt_wang.affinity + 4,
            );

          st.flags._awMoralSeen = true;

          StateManager.addMessage(
            "你妥善保管王姨的托付，道德+4，王姨更信你。",

            "success",
          );
        },
      },

      {
        text: "🙅 不敢接",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.aunt_wang)
            st.relationships.aunt_wang.affinity = Math.max(
              -100,

              st.relationships.aunt_wang.affinity - 3,
            );

          st.flags._awMoralSeen = true;

          StateManager.addMessage("你婉拒了托付，王姨有点失望但理解。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r69_era_coding_freelance",

    phase: "street",

    icon: "💻",

    title: "衰退期的外包",

    story:
      "经济步入衰退，大厂砍项目，反倒多了零散外包。你靠着 coding 底子在副业里接点远程活儿。",

    // conditions：衰退期 + coding 技能 + 自由职业副业（时代×技能×副业空白区）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era || era.stageId !== "decline") return false; // 检查 衰退期

      var code = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof code !== "number" || code < 15) return false; // 检查 coding>=15

      if (!st.sideHustle || st.sideHustle.type !== "freelance") return false; // 检查 自由职业副业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._eraCodeSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "💻 接下外包",

        hint: "现金+ 编程+",

        apply: function (st) {
          st.resources.cash += 460;

          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 30;

          st.flags._eraCodeSeen = true;

          StateManager.addMessage(
            "衰退期里你接下外包，落袋¥460，coding 更扎实。",

            "success",
          );
        },
      },

      {
        text: "🛑 怕做不完",

        hint: "轻量",

        apply: function (st) {
          st.flags._eraCodeSeen = true;

          StateManager.addMessage("你担心工期，暂未接单。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r70_brother_huang_sales",

    phase: "street",

    icon: "📦",

    title: "黄哥的代销",

    story: "黄哥拍着你：「你嘴皮子利索，帮我代销批货，卖出算你提成。」",

    // conditions：黄哥已结识 + 好感 + sales 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.brother_huang; // 检查 黄哥关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 20) return false; // 检查 好感>=20

      var sales = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof sales !== "number" || sales < 10) return false; // 检查 sales>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._bhSalesSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📦 接代销",

        hint: "现金+ 销售+ 好感+",

        apply: function (st) {
          st.resources.cash += 300;

          if (st.skills && st.skills.sales)
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 25;

          if (st.relationships && st.relationships.brother_huang)
            st.relationships.brother_huang.affinity = Math.min(
              100,

              st.relationships.brother_huang.affinity + 3,
            );

          st.flags._bhSalesSeen = true;

          StateManager.addMessage(
            "你接下黄哥代销，落袋¥300，销售更溜。",

            "success",
          );
        },
      },

      {
        text: "🙅 先不接",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.brother_huang)
            st.relationships.brother_huang.affinity = Math.max(
              -100,

              st.relationships.brother_huang.affinity - 2,
            );

          st.flags._bhSalesSeen = true;

          StateManager.addMessage("你暂未接代销，黄哥点点头。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r70_chef_chen_cooking",

    phase: "street",

    icon: "🍳",

    title: "陈厨的切磋",

    story: "陈厨瞅见你下厨的手艺：「有点意思，来我后厨搭把手，顺便教你两招。」",

    // conditions：陈厨已结识 + 好感 + cooking 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.chef_chen; // 检查 陈厨关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 20) return false; // 检查 好感>=20

      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof cook !== "number" || cook < 15) return false; // 检查 cooking>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._ccCookSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🍳 去后厨学艺",

        hint: "现金+ 厨艺+ 好感+",

        apply: function (st) {
          st.resources.cash += 220;

          if (st.skills && st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 35;

          if (st.relationships && st.relationships.chef_chen)
            st.relationships.chef_chen.affinity = Math.min(
              100,

              st.relationships.chef_chen.affinity + 4,
            );

          st.flags._ccCookSeen = true;

          StateManager.addMessage(
            "你在陈厨后厨学艺，落袋¥220，厨艺大涨。",

            "success",
          );
        },
      },

      {
        text: "🙅 改天再约",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.chef_chen)
            st.relationships.chef_chen.affinity = Math.max(
              -100,

              st.relationships.chef_chen.affinity - 2,
            );

          st.flags._ccCookSeen = true;

          StateManager.addMessage("你改天再约，陈厨笑着应了。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r70_hygiene_stall",

    phase: "street",

    icon: "🧼",

    title: "邋遢摊子的顾虑",

    story:
      "你卫生状况堪忧，摆摊时顾客捏着鼻子犹豫。你意识到：干净点，生意才走得远。",

    // conditions：卫生低 + 摆摊副业（需求×副业空白区）

    conditions: function (st) {
      var hyg = st.needs && st.needs.hygiene; // 检查 卫生

      if (typeof hyg !== "number" || hyg >= 30) return false; // 检查 卫生<30

      if (!st.sideHustle || st.sideHustle.type !== "stall") return false; // 检查 摆摊副业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._hygStallSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🧼 收拾干净再摆",

        hint: "卫生+ 幸福+",

        apply: function (st) {
          if (st.needs) {
            st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 25);

            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          }

          st.flags._hygStallSeen = true;

          StateManager.addMessage(
            "你拾掇干净再出摊，顾客多了，心情也好了。",

            "success",
          );
        },
      },

      {
        text: "😣 凑合着卖",

        hint: "轻量 名声-",

        apply: function (st) {
          st.player.fame = Math.max(0, (st.player.fame || 0) - 2);

          st.flags._hygStallSeen = true;

          StateManager.addMessage("你凑合着摆，生意清淡，名声略降。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r71_era_growth_invest",

    phase: "street",

    icon: "📊",

    title: "成长期的钱潮",

    story:
      "经济进入成长期，街头都在聊风口和机会。你手头有点闲钱，琢磨着是不是该投一把。",

    // conditions：成长期 + 现金充裕（时代×经济空白区）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era || era.stageId !== "growth") return false; // 检查 成长期

      if ((st.resources.cash || 0) < 300) return false; // 检查 现金>=300

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._eraGrowSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📈 投一笔",

        hint: "现金- 投资+",

        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300);

          if (st.investment && st.investment.stockHoldings)
            st.investment.stockHoldings.push({
              id: "growth_bet",

              amount: 300,

              day: st.player.day,
            });

          st.flags._eraGrowSeen = true;

          StateManager.addMessage("成长期里你投出¥300，押注风口。", "success");
        },
      },

      {
        text: "🛡️ 先观望",

        hint: "轻量 现金保",

        apply: function (st) {
          st.flags._eraGrowSeen = true;

          StateManager.addMessage("你决定先观望，现金留在手里更踏实。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r71_sister_zhang_mgmt",

    phase: "corporate",

    icon: "👩‍💼",

    title: "张姐的点拨",

    story:
      "张姐把你叫到一旁：「你管理上差点火候，我当年这么过来的，听我两句。」",

    // conditions：张姐已结识 + 好感 + management 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_zhang; // 检查 张姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 20) return false; // 检查 好感>=20

      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级

      if (typeof mgmt !== "number" || mgmt < 10) return false; // 检查 management>=10

      if (st.player.phase !== "corporate") return false; // 检查 职场阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._szMgmtSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "👩‍💼 虚心请教",

        hint: "管理+ 好感+",

        apply: function (st) {
          if (st.skills && st.skills.management)
            st.skills.management.xp = (st.skills.management.xp || 0) + 30;

          if (st.relationships && st.relationships.sister_zhang)
            st.relationships.sister_zhang.affinity = Math.min(
              100,

              st.relationships.sister_zhang.affinity + 4,
            );

          st.flags._szMgmtSeen = true;

          StateManager.addMessage(
            "你虚心请教张姐，管理经验+，张姐更看重你。",

            "success",
          );
        },
      },

      {
        text: "🙅 自有主张",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_zhang)
            st.relationships.sister_zhang.affinity = Math.max(
              -100,

              st.relationships.sister_zhang.affinity - 2,
            );

          st.flags._szMgmtSeen = true;

          StateManager.addMessage("你婉拒了点拨，张姐耸耸肩。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r71_uncle_chen_bank_loan",

    phase: "street",

    icon: "🏦",

    title: "陈叔的低息贷",

    story:
      "银行里的陈叔私下透口风：「你名声在，这茬能走低息通道，比外面的划算多了。」",

    // conditions：陈叔已结识 + 好感 + 银行声望（NPC×声望×贷款空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.uncle_chen_bank; // 检查 陈叔关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 20) return false; // 检查 好感>=20

      if (((st.reputation && st.reputation.bank) || 0) < 10) return false; // 检查 银行声望>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._ucbLoanSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🏦 走低息通道",

        hint: "现金+ 声望+",

        apply: function (st) {
          st.resources.cash += 400;

          if (st.reputation)
            st.reputation.bank = Math.min(100, (st.reputation.bank || 0) + 4);

          st.flags._ucbLoanSeen = true;

          StateManager.addMessage(
            "你走陈叔的低息通道，到手¥400，银行声望+4。",

            "success",
          );
        },
      },

      {
        text: "🙅 不想背债",

        hint: "轻量",

        apply: function (st) {
          st.flags._ucbLoanSeen = true;

          StateManager.addMessage("你暂不想背债，谢过陈叔的好意。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r72_cloudy_driving",

    phase: "street",

    icon: "☁️",

    title: "阴天跑车省油",

    story:
      "阴天不晒，路上车流也稀，你开着副业车跑了几单，油钱省下不少，腿脚也轻快。",

    // conditions：阴天 + driving 技能 + 开车副业（天气×技能×副业空白区）

    conditions: function (st) {
      var w = st.weather && st.weather.current; // 检查 天气

      if (w !== "cloudy") return false; // 检查 阴天

      if (!st.sideHustle || st.sideHustle.type !== "driving") return false; // 检查 开车副业

      var drv = st.skills && st.skills.driving && st.skills.driving.level; // 检查 driving 等级

      if (typeof drv !== "number" || drv < 10) return false; // 检查 driving>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._cloudyDrvSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🚗 多跑两单",

        hint: "现金+ 驾驶+",

        apply: function (st) {
          st.resources.cash += 260;

          if (st.skills && st.skills.driving)
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 25;

          st.flags._cloudyDrvSeen = true;

          StateManager.addMessage(
            "阴天里你多跑两单，落袋¥260，驾驶更稳。",

            "success",
          );
        },
      },

      {
        text: "🏠 早点收车",

        hint: "轻量 疲惫-",

        apply: function (st) {
          if (st.needs)
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);

          st.flags._cloudyDrvSeen = true;

          StateManager.addMessage("你早点收车，留着力气明天再战。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r72_reputation_commercial_stall",

    phase: "street",

    icon: "🏪",

    title: "商区红火摊",

    story: "你在商区攒下的好名声起了作用，街坊认你这摊子，生意比别处红火一截。",

    // conditions：商区声望 + 摆摊副业（声望×副业空白区）

    conditions: function (st) {
      if (((st.reputation && st.reputation.commercialDist) || 0) < 15)
        return false; // 检查 商区声望>=15

      if (!st.sideHustle || st.sideHustle.type !== "stall") return false; // 检查 摆摊副业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._repStallSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🏪 趁热多卖",

        hint: "现金+ 声望+",

        apply: function (st) {
          st.resources.cash += 320;

          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 4,
            );

          st.flags._repStallSeen = true;

          StateManager.addMessage(
            "你趁商区名声多卖了¥320，声望继续涨。",

            "success",
          );
        },
      },

      {
        text: "🙆 见好就收",

        hint: "轻量 幸福+",

        apply: function (st) {
          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 4);

          st.flags._repStallSeen = true;

          StateManager.addMessage("你见好就收，心满意足收了摊。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r72_stress_management",

    phase: "corporate",

    icon: "😣",

    title: "顶着压力带队伍",

    story:
      "你压力拉满，却还得带队冲指标。好在你管理有一套，硬是把散沙拧成一股绳。",

    // conditions：心理压高 + management 技能 + 在职（心理×技能×就业空白区）

    conditions: function (st) {
      var stress =
        st.player &&
        st.player.health &&
        st.player.health.mental &&
        st.player.health.mental.stress; // 检查 心理压

      if (typeof stress !== "number" || stress < 50) return false; // 检查 心理压>=50

      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级

      if (typeof mgmt !== "number" || mgmt < 15) return false; // 检查 management>=15

      if (!st.employment || !st.employment.currentJob) return false; // 检查 在职

      if (st.player.phase !== "corporate") return false; // 检查 职场阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._stressMgmtSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "💪 扛住带队伍",

        hint: "名声+ 管理+ 压力-",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);

          if (st.skills && st.skills.management)
            st.skills.management.xp = (st.skills.management.xp || 0) + 30;

          if (st.player && st.player.health && st.player.health.mental)
            st.player.health.mental.stress = Math.max(
              0,

              (st.player.health.mental.stress || 0) - 15,
            );

          st.flags._stressMgmtSeen = true;

          StateManager.addMessage(
            "你顶着压力带好队伍，名声+5，管理见长，压力也松了。",

            "success",
          );
        },
      },

      {
        text: "😮‍💨 喘口气",

        hint: "轻量 压力-",

        apply: function (st) {
          if (st.player && st.player.health && st.player.health.mental)
            st.player.health.mental.stress = Math.max(
              0,

              (st.player.health.mental.stress || 0) - 10,
            );

          st.flags._stressMgmtSeen = true;

          StateManager.addMessage("你先喘了口气，缓了缓神。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r73_heatwave_driving",

    phase: "street",

    icon: "🥤",

    title: "热浪送水郎",

    story:
      "热浪炙烤街头，你开着副业车给工地送桶装水，汗珠子砸在地上滋滋响，钱却实打实进了袋。",

    // conditions：热浪 + driving 技能 + 开车副业（天气×技能×副业空白区）

    conditions: function (st) {
      var w = st.weather && st.weather.current; // 检查 天气

      if (w !== "heatwave") return false; // 检查 热浪

      if (!st.sideHustle || st.sideHustle.type !== "driving") return false; // 检查 开车副业

      var drv = st.skills && st.skills.driving && st.skills.driving.level; // 检查 driving 等级

      if (typeof drv !== "number" || drv < 10) return false; // 检查 driving>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._hwDrvSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🥤 顶着热浪送",

        hint: "现金+ 驾驶+ 疲惫+",

        apply: function (st) {
          st.resources.cash += 300;

          if (st.skills && st.skills.driving)
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 25;

          if (st.needs)
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);

          st.flags._hwDrvSeen = true;

          StateManager.addMessage(
            "热浪里你送水赚了¥300，驾驶更稳但也更累。",

            "success",
          );
        },
      },

      {
        text: "🏠 歇晌再说",

        hint: "轻量 疲惫-",

        apply: function (st) {
          if (st.needs)
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 8);

          st.flags._hwDrvSeen = true;

          StateManager.addMessage("你躲过最毒的日头，傍晚再出车。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r73_morality_charity",

    phase: "street",

    icon: "🤲",

    title: "街头的一笔善",

    story: "巷口募捐箱前，你想起初来乍到的难。手头宽裕的你，把一笔钱投了进去。",

    // conditions：高道德 + 现金充裕（道德×经济×名声空白区）

    conditions: function (st) {
      if ((st.player.morality || 0) < 70) return false; // 检查 道德>=70

      if ((st.resources.cash || 0) < 200) return false; // 检查 现金>=200

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._moralCharitySeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🤲 捐一笔",

        hint: "现金- 道德+ 名声+",

        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 150);

          st.player.morality = Math.min(100, (st.player.morality || 0) + 3);

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._moralCharitySeen = true;

          StateManager.addMessage("你捐出¥150，心里敞亮，名声+4。", "success");
        },
      },

      {
        text: "🙅 这回不捐",

        hint: "轻量",

        apply: function (st) {
          st.flags._moralCharitySeen = true;

          StateManager.addMessage("你这回没捐，默默走开。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r73_oldzhou_rep",

    phase: "street",

    icon: "🔧",

    title: "老周的口碑活",

    story:
      "老周在街坊里替你美言，贫民区里都知你手艺地道。这天有人慕名找上门修家电。",

    // conditions：老周已结识 + 好感 + 贫民区声望（NPC×声望×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.old_zhou; // 检查 老周关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 20) return false; // 检查 好感>=20

      if (((st.reputation && st.reputation.slum) || 0) < 10) return false; // 检查 贫民区声望>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._ozRepSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🔧 接下口碑活",

        hint: "现金+ 声望+ 好感+",

        apply: function (st) {
          st.resources.cash += 260;

          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 4);

          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.min(
              100,

              st.relationships.old_zhou.affinity + 3,
            );

          st.flags._ozRepSeen = true;

          StateManager.addMessage(
            "你接下老周介绍的口碑活，落袋¥260，贫民区声望+4。",

            "success",
          );
        },
      },

      {
        text: "🙅 手头满",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.max(
              -100,

              st.relationships.old_zhou.affinity - 2,
            );

          st.flags._ozRepSeen = true;

          StateManager.addMessage("你手头满了，婉拒了老周的介绍。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r74_coding_reputation_techpark",

    phase: "street",

    icon: "🖥️",

    title: "科技园的技术私活",

    story:
      "你在科技园攒下的技术口碑传开了，有公司慕名找你接私活，点名要你这把手。",

    // conditions：coding 技能 + 科技园声望 + 自由职业副业（技能×声望×副业空白区）

    conditions: function (st) {
      var code = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof code !== "number" || code < 20) return false; // 检查 coding>=20

      if (((st.reputation && st.reputation.techPark) || 0) < 15) return false; // 检查 科技园声望>=15

      if (!st.sideHustle || st.sideHustle.type !== "freelance") return false; // 检查 自由职业副业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._codeTpSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🖥️ 接下私活",

        hint: "现金+ 编程+ 声望+",

        apply: function (st) {
          st.resources.cash += 480;

          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 35;

          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 4,
            );

          st.flags._codeTpSeen = true;

          StateManager.addMessage(
            "你接下科技园私活，落袋¥480，技术口碑更响。",

            "success",
          );
        },
      },

      {
        text: "🙅 怕顾不上",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 2,
            );

          st.flags._codeTpSeen = true;

          StateManager.addMessage(
            "你怕顾不上主业，婉拒了，但口碑仍在涨。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r74_era_mature_cash",

    phase: "street",

    icon: "📈",

    title: "成熟期的守成",

    story:
      "经济步入成熟期，暴富故事少了，稳扎稳打的人反而笑到最后。你用会计底子理了笔闲钱。",

    // conditions：成熟期 + accounting 技能 + 现金充裕（时代×技能×经济空白区）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era || era.stageId !== "mature") return false; // 检查 成熟期

      var acc = st.skills && st.skills.accounting && st.skills.accounting.level; // 检查 accounting 等级

      if (typeof acc !== "number" || acc < 15) return false; // 检查 accounting>=15

      if ((st.resources.cash || 0) < 200) return false; // 检查 现金>=200

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._eraMatureSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📈 稳健理财",

        hint: "现金+ 会计+",

        apply: function (st) {
          st.resources.cash += 350;

          if (st.skills && st.skills.accounting)
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 30;

          st.flags._eraMatureSeen = true;

          StateManager.addMessage(
            "成熟期里你稳健理财，落袋¥350，会计更熟。",

            "success",
          );
        },
      },

      {
        text: "🛡️ 持币观望",

        hint: "轻量 现金保",

        apply: function (st) {
          st.flags._eraMatureSeen = true;

          StateManager.addMessage("你选择持币观望，稳字当头。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r74_sister_wu_needs",

    phase: "street",

    icon: "🍚",

    title: "吴姐的一碗饭",

    story: "你饿得前胸贴后背，吴姐端着碗热饭过来：「趁热吃，别硬扛。」",

    // conditions：吴姐已结识 + 好感 + 饥饿低（NPC×需求空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_wu; // 检查 吴姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 20) return false; // 检查 好感>=20

      var hun = st.needs && st.needs.hunger; // 检查 饥饿

      if (typeof hun !== "number" || hun >= 30) return false; // 检查 饥饿<30

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 中后期

      if (st.flags && st.flags._swNeedsSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🍚 接过热饭",

        hint: "饱食+ 好感+ 幸福+",

        apply: function (st) {
          if (st.needs) {
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 30);

            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);
          }

          if (st.relationships && st.relationships.sister_wu)
            st.relationships.sister_wu.affinity = Math.min(
              100,

              st.relationships.sister_wu.affinity + 3,
            );

          st.flags._swNeedsSeen = true;

          StateManager.addMessage(
            "你接过热饭，饱了肚子也暖了心，吴姐更亲近你。",

            "success",
          );
        },
      },

      {
        text: "🙅 婉拒好意",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_wu)
            st.relationships.sister_wu.affinity = Math.max(
              -100,

              st.relationships.sister_wu.affinity - 2,
            );

          st.flags._swNeedsSeen = true;

          StateManager.addMessage("你婉拒了吴姐，她笑着收了碗。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r75_npc_chef_chen_loc",

    phase: "street",

    icon: "👨‍🍳",

    title: "陈厨的商区秘方",

    story:
      "你在商区撞见陈厨，他瞅着你篮子里的料：「懂行啊，这配料商区最吃香。」",

    // conditions：陈厨已结识 + 好感 + 当前在商区（NPC×地点空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.chef_chen; // 检查 陈厨关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 15) return false; // 检查 好感>=15

      if (st.trade && st.trade.currentLocation !== "commercialDist")
        return false; // 检查 商区

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 早期之后

      if (st.flags && st.flags._r75ChefLoc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "👨‍🍳 讨教秘方",

        hint: "厨艺+ 商区声望+",

        apply: function (st) {
          if (st.skills && st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 30;

          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 4,
            );

          st.flags._r75ChefLoc = true;

          StateManager.addMessage(
            "陈厨倾囊相授，你厨艺更精，商区也记下了你这号人。",

            "success",
          );
        },
      },

      {
        text: "🙏 记下了",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.chef_chen)
            st.relationships.chef_chen.affinity = Math.min(
              100,

              st.relationships.chef_chen.affinity + 3,
            );

          st.flags._r75ChefLoc = true;

          StateManager.addMessage("你谢过陈厨，记下了这份人情。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r75_skills_cook_drive",

    phase: "street",

    icon: "🛵",

    title: "厨艺加车轮",

    story:
      "你灵机一动：白天练的厨艺，晚上用电动车送自己做的小吃，岂不是双重变现？",

    // conditions：cooking 技能 + driving 技能（技能×技能空白区）

    conditions: function (st) {
      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 厨艺等级

      if (typeof cook !== "number" || cook < 10) return false; // 检查 cooking>=10

      var driv = st.skills && st.skills.driving && st.skills.driving.level; // 检查 驾驶等级

      if (typeof driv !== "number" || driv < 10) return false; // 检查 driving>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 6) return false; // 检查 早期之后

      if (st.flags && st.flags._r75CookDrive) return false; // 检查 未触发过

      return true;
    },

    probability: 0.06,

    repeatable: false,

    choices: [
      {
        text: "🛵 开张送餐",

        hint: "现金+ 厨艺+ 驾驶+",

        apply: function (st) {
          st.resources.cash += 220;

          if (st.skills && st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 25;

          if (st.skills && st.skills.driving)
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 20;

          st.flags._r75CookDrive = true;

          StateManager.addMessage(
            "厨艺配车轮，你当晚多赚¥220，手艺也更熟。",

            "success",
          );
        },
      },

      {
        text: "🍳 先顾本职",

        hint: "轻量 厨艺+",

        apply: function (st) {
          if (st.skills && st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 12;

          st.flags._r75CookDrive = true;

          StateManager.addMessage(
            "你先把本职的厨艺练扎实，日后再图副业。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r75_weather_career",

    phase: "street",

    icon: "🌧️",

    title: "暴雨里的班",

    story: "暴雨倾盆，你正上着班，工地的脚手架在风里直晃。主管却催着赶工。",

    // conditions：暴雨天气 + 已就业（天气×职业空白区）

    conditions: function (st) {
      if (!st.career || !st.career.currentJob) return false; // [Layer3] 叙事涉及工地上班

      if (st.weather && st.weather.current !== "stormy") return false; // 检查 暴雨

      if (!st.employment || !st.employment.currentJob) return false; // 检查 已就业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 6) return false; // 检查 早期之后

      if (st.flags && st.flags._r75StormJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.06,

    repeatable: false,

    choices: [
      {
        text: "🛡️ 请假避险",

        hint: "压力- 现金-",

        apply: function (st) {
          st.resources.cash -= 60;

          if (st.player && st.player.health && st.player.health.mental)
            st.player.health.mental.stress = Math.max(
              0,

              (st.player.health.mental.stress || 0) - 5,
            );

          st.flags._r75StormJob = true;

          StateManager.addMessage(
            "你请了假躲过暴雨，少赚¥60但人平安。",

            "info",
          );
        },
      },

      {
        text: "💪 照常上工",

        hint: "现金+ 疲劳+",

        apply: function (st) {
          st.resources.cash += 120;

          if (st.needs)
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);

          st.flags._r75StormJob = true;

          StateManager.addMessage(
            "你冒雨上工多挣¥120，浑身湿透，累得够呛。",

            "success",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r76_needs_event",

    phase: "street",

    icon: "🚿",

    title: "邻居的提醒",

    story:
      "你蓬头垢面、闷闷不乐地窝在角落，邻居探头：「兄弟，你这状态不太对啊。」",

    // conditions：卫生低 + 幸福低（需求×事件空白区）

    conditions: function (st) {
      var hyg = st.needs && st.needs.hygiene; // 检查 卫生

      if (typeof hyg !== "number" || hyg >= 25) return false; // 检查 卫生<25

      var hap = st.needs && st.needs.happiness; // 检查 幸福

      if (typeof hap !== "number" || hap >= 30) return false; // 检查 幸福<30

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 早期之后

      if (st.flags && st.flags._r76Needs) return false; // 检查 未触发过

      return true;
    },

    probability: 0.06,

    repeatable: false,

    choices: [
      {
        text: "🚿 洗把脸振作",

        hint: "卫生+ 幸福+",

        apply: function (st) {
          if (st.needs) {
            st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 25);

            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
          }

          st.flags._r76Needs = true;

          StateManager.addMessage("你洗了把脸，精神头回来不少。", "success");
        },
      },

      {
        text: "😶 没在意",

        hint: "轻量 幸福-",

        apply: function (st) {
          if (st.needs)
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);

          st.flags._r76Needs = true;

          StateManager.addMessage("你没太在意邻居的提醒，继续发着呆。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r76_rep_loan",

    phase: "street",

    icon: "🏦",

    title: "银行的低息口子",

    story:
      "你在银行口碑不错，客户经理悄悄递来一个低息周转额度：「手头紧时能用。」",

    // conditions：银行声望高 + 现金紧（声望×贷款空白区）

    conditions: function (st) {
      if (!st.reputation || (st.reputation.bank || 0) < 40) return false; // 检查 银行声望>=40

      if ((st.resources.cash || 0) >= 100) return false; // 检查 现金紧

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._r76RepLoan) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🏦 借一笔周转",

        hint: "现金+ 声望+",

        apply: function (st) {
          st.resources.cash += 400;

          if (st.reputation)
            st.reputation.bank = Math.min(100, (st.reputation.bank || 0) + 3);

          st.flags._r76RepLoan = true;

          StateManager.addMessage(
            "你低息借到¥400周转，银行也更信你。",

            "success",
          );
        },
      },

      {
        text: "🙅 不想欠",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.bank = Math.min(100, (st.reputation.bank || 0) + 2);

          st.flags._r76RepLoan = true;

          StateManager.addMessage(
            "你不想欠人情，谢过经理，记下了这份情。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r76_talent_job",

    phase: "street",

    icon: "📋",

    title: "管理天赋被看见",

    story: "你平日展露的销售管理天赋，被主管记在了心里，这回提拔名单上有你。",

    // conditions：已激活销售管理天赋 + 已就业（天赋×职业空白区）

    conditions: function (st) {
      if (!st.talentNodes || !st.talentNodes["sales_management"]) return false; // 检查 天赋节点

      if (!st.employment || !st.employment.currentJob) return false; // 检查 已就业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._r76TalentJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "📋 接下担子",

        hint: "现金+ 好感+ 压力+",

        apply: function (st) {
          st.resources.cash += 300;

          if (st.player && st.player.health && st.player.health.mental)
            st.player.health.mental.stress = Math.min(
              100,

              (st.player.health.mental.stress || 0) + 6,
            );

          st.flags._r76TalentJob = true;

          StateManager.addMessage(
            "你接下管理担子，月薪多¥300，责任也更重了。",

            "success",
          );
        },
      },

      {
        text: "🙏 再历练",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 120;

          st.flags._r76TalentJob = true;

          StateManager.addMessage("你婉拒了提拔，先多历练，落袋¥120。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r77_npc_oldzhou_location",

    phase: "street",

    icon: "🧓",

    title: "老周的贫民区差事",

    story: "在贫民区，老周招手：「小子，帮我跑个腿，顺手给你点好处。」",

    // conditions：已结识老周且好感 + 身处贫民区（NPC×地点空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.old_zhou; // 检查 老周关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (st.trade && st.trade.currentLocation !== "slum") return false; // 检查 贫民区

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 6) return false; // 检查 早期之后

      if (st.flags && st.flags._r77OzLoc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🏃 跑一趟",

        hint: "现金+ 好感+ 贫民区声望+",

        apply: function (st) {
          st.resources.cash += 150;

          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.min(
              100,

              st.relationships.old_zhou.affinity + 3,
            );

          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 3);

          st.flags._r77OzLoc = true;

          StateManager.addMessage(
            "你帮老周跑腿，落袋¥150，贫民区里更吃得开。",

            "success",
          );
        },
      },

      {
        text: "🙅 抽不开身",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.max(
              -100,

              st.relationships.old_zhou.affinity - 2,
            );

          st.flags._r77OzLoc = true;

          StateManager.addMessage("你抽不开身，老周摆摆手：下次再说。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r77_skill_npc_xiaomei",

    phase: "street",

    icon: "🌐",

    title: "小美的翻译活",

    story: "小美凑过来：「有个外文菜单的活儿，你英语行不行？帮帮忙分你一份。」",

    // conditions：英语技能 + 已结识小美且好感（技能×NPC空白区）

    conditions: function (st) {
      var eng = st.skills && st.skills.english && st.skills.english.level; // 检查 英语等级

      if (typeof eng !== "number" || eng < 15) return false; // 检查 english>=15

      var rel = st.relationships && st.relationships.xiao_mei; // 检查 小美关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 早期之后

      if (st.flags && st.flags._r77XmSkill) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🌐 接下翻译",

        hint: "现金+ 英语+ 好感+",

        apply: function (st) {
          st.resources.cash += 260;

          if (st.skills && st.skills.english)
            st.skills.english.xp = (st.skills.english.xp || 0) + 25;

          if (st.relationships && st.relationships.xiao_mei)
            st.relationships.xiao_mei.affinity = Math.min(
              100,

              st.relationships.xiao_mei.affinity + 4,
            );

          st.flags._r77XmSkill = true;

          StateManager.addMessage(
            "你接下翻译活，落袋¥260，英语更溜，小美也更信你。",

            "success",
          );
        },
      },

      {
        text: "🙅 怕误事",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.xiao_mei)
            st.relationships.xiao_mei.affinity = Math.min(
              100,

              st.relationships.xiao_mei.affinity + 2,
            );

          st.flags._r77XmSkill = true;

          StateManager.addMessage(
            "你怕翻错误事，婉拒了，小美倒没见怪。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r77_weather_sidehustle",

    phase: "street",

    icon: "🔥",

    title: "热浪摆摊旺",

    story: "热浪袭城，街口人人想喝口凉的，你支起的小摊前排起了队。",

    // conditions：热浪天气 + 摆摊副业进行中（天气×副业空白区）

    conditions: function (st) {
      if (st.weather && st.weather.current !== "heatwave") return false; // 检查 热浪

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.sideHustle.type !== "stall") return false; // 检查 摆摊副业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 6) return false; // 检查 早期之后

      if (st.flags && st.flags._r77HeatStall) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🔥 加料促销",

        hint: "现金+ 副业口碑+",

        apply: function (st) {
          st.resources.cash += 200;

          if (st.sideHustle)
            st.sideHustle.reputation = Math.min(
              100,

              (st.sideHustle.reputation || 0) + 5,
            );

          st.flags._r77HeatStall = true;

          StateManager.addMessage(
            "热浪里你加料促销，多赚¥200，摊子口碑也涨了。",

            "success",
          );
        },
      },

      {
        text: "🧊 见好就收",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 90;

          st.flags._r77HeatStall = true;

          StateManager.addMessage("你见好就收，落袋¥90，免得中暑。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r78_mgmt_economy",

    phase: "street",

    icon: "📊",

    title: "通胀下的对冲",

    story: "物价水涨船高，你凭着管理脑子，把手头的开支重新盘了一遍，省下不少。",

    // conditions：管理技能 + 高通胀（技能×经济空白区）

    conditions: function (st) {
      var mg = st.skills && st.skills.management && st.skills.management.level; // 检查 管理等级

      if (typeof mg !== "number" || mg < 15) return false; // 检查 management>=15

      var era = st._eraState; // 检查 时代状态

      if (!era || (era.inflationIndex || 1) < 1.2) return false; // 检查 通胀>=1.2

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._r78MgInfl) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "📊 重新盘账",

        hint: "现金+ 管理+",

        apply: function (st) {
          st.resources.cash += 240;

          if (st.skills && st.skills.management)
            st.skills.management.xp = (st.skills.management.xp || 0) + 25;

          st.flags._r78MgInfl = true;

          StateManager.addMessage(
            "你重盘开支，省下¥240，管理也更老练。",

            "success",
          );
        },
      },

      {
        text: "🤔 先观望",

        hint: "轻量 管理+",

        apply: function (st) {
          if (st.skills && st.skills.management)
            st.skills.management.xp = (st.skills.management.xp || 0) + 12;

          st.flags._r78MgInfl = true;

          StateManager.addMessage(
            "你先观望通胀走向，管理上多了份心眼。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r78_needs_fatigue_job",

    phase: "street",

    icon: "😵",

    title: "累到犯困的班",

    story: "你连轴转，眼皮直打架，偏偏今天手头活儿最不能出错。",

    // conditions：疲劳高 + 已就业（需求×职业空白区）

    conditions: function (st) {
      var fat = st.needs && st.needs.fatigue; // 检查 疲劳

      if (typeof fat !== "number" || fat <= 70) return false; // 检查 疲劳>70

      if (!st.employment || !st.employment.currentJob) return false; // 检查 已就业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 6) return false; // 检查 早期之后

      if (st.flags && st.flags._r78FatJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.06,

    repeatable: false,

    choices: [
      {
        text: "☕ 强撑过去",

        hint: "现金+ 疲劳+ 压力+",

        apply: function (st) {
          st.resources.cash += 110;

          if (st.needs)
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);

          if (st.player && st.player.health && st.player.health.mental)
            st.player.health.mental.stress = Math.min(
              100,

              (st.player.health.mental.stress || 0) + 8,
            );

          st.flags._r78FatJob = true;

          StateManager.addMessage(
            "你强撑过去，多挣¥110，整个人快散架了。",

            "info",
          );
        },
      },

      {
        text: "😴 请个短假",

        hint: "疲劳- 现金-",

        apply: function (st) {
          st.resources.cash -= 40;

          if (st.needs)
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 30);

          st.flags._r78FatJob = true;

          StateManager.addMessage(
            "你请了个短假缓口气，少赚¥40，精神回来了。",

            "success",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r78_skill_sales_rep",

    phase: "street",

    icon: "🛒",

    title: "商区的销冠",

    story: "你在商区攒下的口碑起效了，熟客指名要你接待，销量蹭蹭涨。",

    // conditions：销售技能 + 商区声望（技能×声望空白区）

    conditions: function (st) {
      var sal = st.skills && st.skills.sales && st.skills.sales.level; // 检查 销售等级

      if (typeof sal !== "number" || sal < 15) return false; // 检查 sales>=15

      if (!st.reputation || (st.reputation.commercialDist || 0) < 20)
        return false; // 检查 商区声望>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._r78SalesRep) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🛒 趁势多卖",

        hint: "现金+ 销售+ 商区声望+",

        apply: function (st) {
          st.resources.cash += 280;

          if (st.skills && st.skills.sales)
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 25;

          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 4,
            );

          st.flags._r78SalesRep = true;

          StateManager.addMessage(
            "你趁势多卖，落袋¥280，销冠之名更响。",

            "success",
          );
        },
      },

      {
        text: "😌 稳着来",

        hint: "轻量 商区声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 2,
            );

          st.flags._r78SalesRep = true;

          StateManager.addMessage("你稳着来，口碑仍在慢慢涨。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r79_rep_techpark_coding",

    phase: "street",

    icon: "💻",

    title: "科技园的外包单",

    story: "科技园那边认你这块招牌，一单外包编程活儿直接点名找你。",

    // conditions：科技园声望 + 编程技能 + 自由职业副业（声望×技能×副业空白区）

    conditions: function (st) {
      if (!st.reputation || (st.reputation.techPark || 0) < 30) return false; // 检查 科技园声望>=30

      var cod = st.skills && st.skills.coding && st.skills.coding.level; // 检查 编程等级

      if (typeof cod !== "number" || cod < 15) return false; // 检查 coding>=15

      if (!st.sideHustle || st.sideHustle.type !== "freelance") return false; // 检查 自由职业副业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._r79TpCode) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "💻 接外包",

        hint: "现金+ 编程+ 科技园声望+",

        apply: function (st) {
          st.resources.cash += 360;

          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 30;

          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 4,
            );

          st.flags._r79TpCode = true;

          StateManager.addMessage(
            "你接下科技园外包，落袋¥360，招牌更亮。",

            "success",
          );
        },
      },

      {
        text: "🙅 排期满",

        hint: "轻量 科技园声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 2,
            );

          st.flags._r79TpCode = true;

          StateManager.addMessage("你排期已满，婉拒了，口碑仍在。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r79_weather_rainy_npc",

    phase: "street",

    icon: "☔",

    title: "张姐的伞",

    story: "细雨里，张姐撑着伞走来：「没带伞吧？搭我一段。」",

    // conditions：雨天 + 已结识张姐（天气×NPC空白区）

    conditions: function (st) {
      if (st.weather && st.weather.current !== "rainy") return false; // 检查 雨天

      var rel = st.relationships && st.relationships.sister_zhang; // 检查 张姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 6) return false; // 检查 早期之后

      if (st.flags && st.flags._r79RainNpc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "☔ 谢过张姐",

        hint: "好感+ 幸福+",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_zhang)
            st.relationships.sister_zhang.affinity = Math.min(
              100,

              st.relationships.sister_zhang.affinity + 5,
            );

          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);

          st.flags._r79RainNpc = true;

          StateManager.addMessage(
            "你谢过张姐，心里暖暖的，好感又近了一步。",

            "success",
          );
        },
      },

      {
        text: "🙂 不用麻烦",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_zhang)
            st.relationships.sister_zhang.affinity = Math.min(
              100,

              st.relationships.sister_zhang.affinity + 2,
            );

          st.flags._r79RainNpc = true;

          StateManager.addMessage("你没让张姐绕路，她笑了笑走了。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r79_welding_job",

    phase: "street",

    icon: "🔧",

    title: "焊枪下的加班",

    story: "厂里急单，点的就是你这手焊接活儿，班长拍你肩：「这活儿离不了你。」",

    // conditions：焊接技能 + 已就业（技能×职业空白区）

    conditions: function (st) {
      var wel = st.skills && st.skills.welding && st.skills.welding.level; // 检查 焊接等级

      if (typeof wel !== "number" || wel < 15) return false; // 检查 welding>=15

      if (!st.employment || !st.employment.currentJob) return false; // 检查 已就业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 早期之后

      if (st.flags && st.flags._r79WeldJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🔧 接下急单",

        hint: "现金+ 焊接+ 疲劳+",

        apply: function (st) {
          st.resources.cash += 260;

          if (st.skills && st.skills.welding)
            st.skills.welding.xp = (st.skills.welding.xp || 0) + 25;

          if (st.needs)
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 14);

          st.flags._r79WeldJob = true;

          StateManager.addMessage(
            "你接下急单，落袋¥260，焊技更稳，就是累。",

            "success",
          );
        },
      },

      {
        text: "🙅 吃不消",

        hint: "轻量 焊接+",

        apply: function (st) {
          if (st.skills && st.skills.welding)
            st.skills.welding.xp = (st.skills.welding.xp || 0) + 12;

          st.flags._r79WeldJob = true;

          StateManager.addMessage(
            "你婉拒了加班，留着精力，焊技也没落下。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r80_electrician_sidehustle",

    phase: "street",

    icon: "💡",

    title: "顺手接的电路活",

    story: "副业跑腿时，街坊看你懂电，拽住你：「我家线路老跳闸，帮我瞧瞧？」",

    // conditions：电工技能 + 副业进行中（技能×副业空白区）

    conditions: function (st) {
      var ele =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 检查 电工等级

      if (typeof ele !== "number" || ele < 12) return false; // 检查 electrician>=12

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 早期之后

      if (st.flags && st.flags._r80EleSh) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "💡 顺手修好",

        hint: "现金+ 电工+ 副业口碑+",

        apply: function (st) {
          st.resources.cash += 180;

          if (st.skills && st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 25;

          if (st.sideHustle)
            st.sideHustle.reputation = Math.min(
              100,

              (st.sideHustle.reputation || 0) + 4,
            );

          st.flags._r80EleSh = true;

          StateManager.addMessage(
            "你顺手修好线路，落袋¥180，副业口碑又涨。",

            "success",
          );
        },
      },

      {
        text: "🙅 改天吧",

        hint: "轻量 电工+",

        apply: function (st) {
          if (st.skills && st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 12;

          st.flags._r80EleSh = true;

          StateManager.addMessage("你约了改天再修，手艺没生疏。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r80_era_decline_morality",

    phase: "street",

    icon: "🌑",

    title: "下行期的灰色邀约",

    story: "经济走下坡，有人悄悄递话：「规矩松了，想赚快钱，带你不亏。」",

    // conditions：衰退期 + 道德偏低（时代×道德空白区）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era || era.stageId !== "decline") return false; // 检查 衰退期

      if ((st.player.morality || 0) >= 40) return false; // 检查 道德<40

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._r80DeclineMor) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "🚫 不蹚浑水",

        hint: "道德+ 名声-",

        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 0) + 5);

          st.player.fame = Math.max(-100, (st.player.fame || 0) - 3);

          st.flags._r80DeclineMor = true;

          StateManager.addMessage(
            "你谢绝了灰色邀约，守住了底线，名声虽掉点但心安。",

            "success",
          );
        },
      },

      {
        text: "💰 赚一笔",

        hint: "现金+ 道德- 风险",

        apply: function (st) {
          st.resources.cash += 400;

          st.player.morality = Math.max(-100, (st.player.morality || 0) - 10);

          st.flags._r80DeclineMor = true;

          StateManager.addMessage(
            "你赚下¥400快钱，道德却蒙了尘，怕是后患。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r80_npc_bossli_career",

    phase: "street",

    icon: "👔",

    title: "李老板的考评",

    story: "李老板把你叫进办公室：「最近表现我看着呢，好好干。」",

    // conditions：已结识李老板 + 已就业（NPC×职业空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.boss_li; // 检查 李老板关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (!st.employment || !st.employment.currentJob) return false; // 检查 已就业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._r80Boss) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "👔 表个态",

        hint: "好感+ 现金+",

        apply: function (st) {
          if (st.relationships && st.relationships.boss_li)
            st.relationships.boss_li.affinity = Math.min(
              100,

              st.relationships.boss_li.affinity + 5,
            );

          st.resources.cash += 150;

          st.flags._r80Boss = true;

          StateManager.addMessage(
            "你表了态，李老板点头，顺手发了笔奖金¥150。",

            "success",
          );
        },
      },

      {
        text: "🤐 闷头干",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.boss_li)
            st.relationships.boss_li.affinity = Math.min(
              100,

              st.relationships.boss_li.affinity + 2,
            );

          st.flags._r80Boss = true;

          StateManager.addMessage(
            "你闷头应了声，李老板倒也认可你的踏实。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r81_npc_unclechen_bank",

    phase: "street",

    icon: "🧓",

    title: "陈叔的理财经",

    story: "银行的陈叔把你拉到一边：「手头紧吧？我教你几招周转，别走歪路。」",

    // conditions：已结识银行陈叔 + 现金紧（NPC×经济空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.uncle_chen_bank; // 检查 陈叔关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if ((st.resources.cash || 0) >= 200) return false; // 检查 现金紧

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._r81Ucb) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🧓 听陈叔的",

        hint: "现金+ 好感+ 道德+",

        apply: function (st) {
          st.resources.cash += 160;

          if (st.relationships && st.relationships.uncle_chen_bank)
            st.relationships.uncle_chen_bank.affinity = Math.min(
              100,

              st.relationships.uncle_chen_bank.affinity + 4,
            );

          st.player.morality = Math.min(100, (st.player.morality || 0) + 3);

          st.flags._r81Ucb = true;

          StateManager.addMessage(
            "你听了陈叔的理财经，落袋¥160，正道走得踏实。",

            "success",
          );
        },
      },

      {
        text: "🙏 记心里",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.uncle_chen_bank)
            st.relationships.uncle_chen_bank.affinity = Math.min(
              100,

              st.relationships.uncle_chen_bank.affinity + 2,
            );

          st.flags._r81Ucb = true;

          StateManager.addMessage("你把陈叔的话记在心里，日后有用。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r81_rep_bank_loan2",

    phase: "street",

    icon: "🏦",

    title: "银行的VIP额度",

    story: "你在银行口碑极佳，客户经理主动升级了你的周转额度，利息还更低。",

    // conditions：银行声望极高 + 现金极紧（声望×贷款空白区）

    conditions: function (st) {
      if (!st.reputation || (st.reputation.bank || 0) < 50) return false; // 检查 银行声望>=50

      if ((st.resources.cash || 0) >= 50) return false; // 检查 现金极紧

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 后期

      if (st.flags && st.flags._r81BankVip) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "🏦 用额度救急",

        hint: "现金+ 银行声望+",

        apply: function (st) {
          st.resources.cash += 500;

          if (st.reputation)
            st.reputation.bank = Math.min(100, (st.reputation.bank || 0) + 3);

          st.flags._r81BankVip = true;

          StateManager.addMessage(
            "你动用VIP额度救急，落袋¥500，银行更信你。",

            "success",
          );
        },
      },

      {
        text: "🙅 不借",

        hint: "轻量 银行声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.bank = Math.min(100, (st.reputation.bank || 0) + 2);

          st.flags._r81BankVip = true;

          StateManager.addMessage(
            "你不愿背债，谢过经理，记下了这份信任。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r81_skill_repair_weather",

    phase: "street",

    icon: "🌪️",

    title: "台风后的抢修",

    story: "台风过境，街区一片狼藉，懂修理的你成了街坊眼中的能人。",

    // conditions：维修技能 + 台风天气（技能×天气空白区）

    conditions: function (st) {
      var rep = st.skills && st.skills.repair && st.skills.repair.level; // 检查 维修等级

      if (typeof rep !== "number" || rep < 15) return false; // 检查 repair>=15

      if (st.weather && st.weather.current !== "typhoon") return false; // 检查 台风

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 早期之后

      if (st.flags && st.flags._r81RepTy) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "🌪️ 帮街坊修",

        hint: "现金+ 维修+ 声望+",

        apply: function (st) {
          st.resources.cash += 220;

          if (st.skills && st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 25;

          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 4);

          st.flags._r81RepTy = true;

          StateManager.addMessage(
            "你帮街坊抢修，落袋¥220，贫民区里更受敬重。",

            "success",
          );
        },
      },

      {
        text: "🏠 先顾自己",

        hint: "轻量 维修+",

        apply: function (st) {
          if (st.skills && st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 12;

          st.flags._r81RepTy = true;

          StateManager.addMessage("你先修好自家，手艺没生，留着力气。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r82_needs_hygiene_npc",

    phase: "street",

    icon: "🚿",

    title: "吴姐的嫌弃",

    story:
      "你几天没顾上收拾，吴姐掩了掩鼻：「你这味儿，咱先把自个儿拾掇拾掇？」",

    // conditions：卫生极低 + 已结识吴姐（需求×NPC空白区）

    conditions: function (st) {
      var hyg = st.needs && st.needs.hygiene; // 检查 卫生

      if (typeof hyg !== "number" || hyg >= 20) return false; // 检查 卫生<20

      var rel = st.relationships && st.relationships.sister_wu; // 检查 吴姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 6) return false; // 检查 早期之后

      if (st.flags && st.flags._r82HygNpc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🚿 赶紧洗漱",

        hint: "卫生+ 好感+",

        apply: function (st) {
          if (st.needs)
            st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 40);

          if (st.relationships && st.relationships.sister_wu)
            st.relationships.sister_wu.affinity = Math.min(
              100,

              st.relationships.sister_wu.affinity + 3,
            );

          st.flags._r82HygNpc = true;

          StateManager.addMessage(
            "你赶紧洗漱清爽了，吴姐气色也好了些。",

            "success",
          );
        },
      },

      {
        text: "😣 没空",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_wu)
            st.relationships.sister_wu.affinity = Math.max(
              -100,

              st.relationships.sister_wu.affinity - 3,
            );

          st.flags._r82HygNpc = true;

          StateManager.addMessage("你忙着没空收拾，吴姐皱了皱眉走开。", "info");
        },
      },
    ],
  });
})();

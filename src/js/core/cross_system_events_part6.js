/**
 * 跨系统联动事件 — 拆分片段 6/8（原 cross_system_events.js 机械拆分，行为不变）
 * 仅含自包含的 RANDOM_EVENTS.push 语句；顺序无关（事件选择走 phase 过滤+概率）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._crossPart6Loaded) return;
  RANDOM_EVENTS._crossPart6Loaded = true;

  RANDOM_EVENTS.push({
    id: "l21_r109_hygiene_low_npc",

    phase: "street",

    icon: "🚿",

    title: "张姐嫌你味儿大",

    story: "你几天没顾上洗漱，张姐捏着鼻子笑你，顺手塞给你块胰子，催你去冲冲。",

    // conditions：卫生偏低 + 已结识张姐（需求×NPC空白区）

    conditions: function (st) {
      if (!st.needs || (st.needs.hygiene || 0) >= 35) return false; // 检查 卫生<35

      var rel = st.relationships && st.relationships.sister_zhang; // 检查 张姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (st.flags && st.flags._r109HygNpc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🚿 痛快冲个澡",

        hint: "卫生+ 现金-",

        apply: function (st) {
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 35);

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 15);

          st.flags._r109HygNpc = true;

          StateManager.addMessage(
            "你花¥15冲了个澡，身上清爽，张姐也乐了。",

            "success",
          );
        },
      },

      {
        text: "🙈 先凑合着",

        hint: "轻量 好感-",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_zhang)
            st.relationships.sister_zhang.affinity = Math.max(
              -100,

              st.relationships.sister_zhang.affinity - 1,
            );

          st.flags._r109HygNpc = true;

          StateManager.addMessage("你没去洗，张姐撇撇嘴，好感淡了点。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r110_commercialDist_rep_loan",

    phase: "street",

    icon: "🏬",

    title: "商圈里的信用贷",

    story: "你在商圈攒下的好名头让放贷的愿意松口，说凭你这信誉能走一笔周转。",

    // conditions：商业区声望达标（声望×贷款空白区）

    conditions: function (st) {
      if (!st.reputation || (st.reputation.commercialDist || 0) < 30)
        return false; // 检查 商业区声望>=30

      if (st.flags && st.flags._r110CdLoan) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🏬 走商圈贷",

        hint: "现金+ 债务+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 550;

          st.resources.debt = (st.resources.debt || 0) + 550;

          st.flags._r110CdLoan = true;

          StateManager.addMessage(
            "凭商圈信誉走了笔周转贷，到手¥550，记得按时还。",

            "success",
          );
        },
      },

      {
        text: "🤝 先不借",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r110CdLoan = true;

          StateManager.addMessage("你婉拒了，落得个不赖账的好名声。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r110_driving_sales",

    phase: "street",

    icon: "🚚",

    title: "开着车卖货",

    story: "你开着车走街串巷，边开边吆喝，车轮子一转，货就跟着出了手。",

    // conditions：驾驶技能达标 + 销售技能达标（技能×技能空白区）

    conditions: function (st) {
      if (!st.skills) return false; // 检查 技能结构

      if (((st.skills.driving && st.skills.driving.level) || 0) < 10)
        return false; // 检查 驾驶>=10

      if (((st.skills.sales && st.skills.sales.level) || 0) < 10) return false; // 检查 销售>=10

      if (st.flags && st.flags._r110DrvSale) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🚚 走街串巷卖",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 210;

          if (st.skills && st.skills.sales)
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 25;

          if (st.skills && st.skills.driving)
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 15;

          st.flags._r110DrvSale = true;

          StateManager.addMessage(
            "你开车卖货走了一圈，落袋¥210，两张手艺都涨。",

            "success",
          );
        },
      },

      {
        text: "🛑 只练不卖",

        hint: "轻量 经验+",

        apply: function (st) {
          if (st.skills && st.skills.driving)
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 12;

          st.flags._r110DrvSale = true;

          StateManager.addMessage("你光练车没卖货，先把方向盘摸熟。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r110_typhoon_location",

    phase: "street",

    icon: "🌀",

    title: "台风天困在批发市场",

    story: "台风刮得批发市场卷帘门直晃，你正巧在那儿进货，一时半会儿走不脱。",

    // conditions：台风天气 + 身处批发市场（天气×地点空白区）

    conditions: function (st) {
      if (!st.weather || st.weather.current !== "typhoon") return false; // 检查 台风

      if (!st.trade || st.trade.currentLocation !== "wholesaleMarket")
        return false; // 检查 批发市场

      if (st.flags && st.flags._r110Typh) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🌀 就地避险",

        hint: "健康+ 现金-",

        apply: function (st) {
          st.status.health = Math.min(100, (st.status.health || 0) + 5);

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 20);

          st.flags._r110Typh = true;

          StateManager.addMessage(
            "你在批发市场角落避险，花¥20买了点干粮，人平安。",

            "success",
          );
        },
      },

      {
        text: "🌧️ 冒风往回赶",

        hint: "轻量 健康- 疲劳+",

        apply: function (st) {
          st.status.health = Math.max(0, (st.status.health || 0) - 6);

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);

          st.flags._r110Typh = true;

          StateManager.addMessage(
            "你冒风往回赶，淋得透湿，身子虚了点。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r111_brotherhuang_electrician",

    phase: "street",

    icon: "⚡",

    title: "黄哥的线路经",

    story: "黄哥看你接电总短路，递来万用表教你怎么查虚接，说电这东西最欺生。",

    // conditions：已结识黄哥且好感达标 + 电工技能达标（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.brother_huang; // 检查 黄哥关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (
        !st.skills ||
        ((st.skills.electrician && st.skills.electrician.level) || 0) < 10
      )
        return false; // 检查 电工>=10

      if (st.flags && st.flags._r111BhElec) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "⚡ 学查虚接",

        hint: "经验+ 好感+",

        apply: function (st) {
          if (st.skills && st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 25;

          if (st.relationships && st.relationships.brother_huang)
            st.relationships.brother_huang.affinity = Math.min(
              100,

              st.relationships.brother_huang.affinity + 2,
            );

          st.flags._r111BhElec = true;

          StateManager.addMessage(
            "黄哥教了查虚接，电工手艺涨了，两人也更投缘。",

            "success",
          );
        },
      },

      {
        text: "🤝 只叙不学",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.brother_huang)
            st.relationships.brother_huang.affinity = Math.min(
              100,

              st.relationships.brother_huang.affinity + 1,
            );

          st.flags._r111BhElec = true;

          StateManager.addMessage("你陪黄哥闲聊，情分又近一层。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r111_hunger_streak_habit",

    phase: "street",

    icon: "🍚",

    title: "连饿成习惯",

    story:
      "你连着好几顿没正经吃，胃都饿出了记性，反倒不觉得多慌了，随手煎了个饼对付。",

    // conditions：低饥习惯标记 + 烹饪技能达标（习惯×技能空白区）

    conditions: function (st) {
      if (!st.flags || !st.flags._habits || !st.flags._habits.lowHungerStreak)
        return false; // 检查 低饥习惯

      if (
        !st.skills ||
        ((st.skills.cooking && st.skills.cooking.level) || 0) < 10
      )
        return false; // 检查 烹饪>=10

      if (st.flags && st.flags._r111HungerHab) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🍚 煎饼垫肚子",

        hint: "饥饿- 经验+",

        apply: function (st) {
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 25);

          if (st.skills && st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 12;

          st.flags._r111HungerHab = true;

          StateManager.addMessage(
            "你随手煎了个饼垫肚子，厨艺也练了手。",

            "success",
          );
        },
      },

      {
        text: "🥤 喝口对付",

        hint: "轻量 饥饿-",

        apply: function (st) {
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 12);

          st.flags._r111HungerHab = true;

          StateManager.addMessage("你胡乱喝口顶了顶，没真吃饭。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r111_talent_freelance_coding",

    phase: "street",

    icon: "🧑‍💻",

    title: "接单天赋爆发",

    story:
      "你点通了接单一道的天赋，码起来如有神助，自由职业的活儿一件接一件砸过来。",

    // conditions：已激活天赋 + 编程技能达标 + 自由职业副业（天赋×副业空白区）

    conditions: function (st) {
      if (!st.talentNodes || Object.keys(st.talentNodes).length === 0)
        return false; // 检查 已激活天赋

      if (
        !st.skills ||
        ((st.skills.coding && st.skills.coding.level) || 0) < 15
      )
        return false; // 检查 编程>=15

      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "freelance"
      )
        return false; // 检查 自由职业副业

      if (st.flags && st.flags._r111TalFree) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🧑‍💻 连接两单",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 320;

          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 30;

          st.flags._r111TalFree = true;

          StateManager.addMessage(
            "天赋加持下连接两单，落袋¥320，码力更稳。",

            "success",
          );
        },
      },

      {
        text: "🧊 挑着接",

        hint: "轻量 经验+",

        apply: function (st) {
          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 15;

          st.flags._r111TalFree = true;

          StateManager.addMessage("你挑着接单，天赋的红利慢慢攒。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r112_initial_phase_cash",

    phase: "street",

    icon: "🌱",

    title: "开局那点本钱",

    story:
      "城里刚起步，百废待兴，你捏着兜里那点本钱盘算，是先攒着还是先投个进项。",

    // conditions：时代初期 + 现金偏低（时代×经济空白区）

    conditions: function (st) {
      if (!st._eraState) return false; // 检查 时代已初始化

      if (st._eraState.stageId !== "initial") return false; // 检查 初期

      if ((st.resources.cash || 0) >= 200) return false; // 检查 现金<200

      if (st.flags && st.flags._r112InitCash) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🌱 先投个进项",

        hint: "现金+ 风险+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 160;

          st.resources.invested = (st.resources.invested || 0) + 100;

          st.flags._r112InitCash = true;

          StateManager.addMessage(
            "开局你投了个小进项，落袋¥160，账面活了。",

            "success",
          );
        },
      },

      {
        text: "🐢 攒着不动",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r112InitCash = true;

          StateManager.addMessage(
            "你没乱投，把本钱攥紧，落个稳当名声。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r112_repair_electrician",

    phase: "street",

    icon: "🔌",

    title: "修带电气的活",

    story:
      "一台带电路的旧家电摆在你面前，你先查线再动手，修得好还顺带把虚接一并治了。",

    // conditions：修理技能达标 + 电工技能达标（技能×技能空白区）

    conditions: function (st) {
      if (!st.skills) return false; // 检查 技能结构

      if (((st.skills.repair && st.skills.repair.level) || 0) < 10)
        return false; // 检查 修理>=10

      if (((st.skills.electrician && st.skills.electrician.level) || 0) < 10)
        return false; // 检查 电工>=10

      if (st.flags && st.flags._r112RepElec) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🔌 修好它",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 180;

          if (st.skills && st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 20;

          if (st.skills && st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 20;

          st.flags._r112RepElec = true;

          StateManager.addMessage(
            "你修好带电气的旧家电，落袋¥180，两门手艺都涨。",

            "success",
          );
        },
      },

      {
        text: "🧊 只查不修",

        hint: "轻量 经验+",

        apply: function (st) {
          if (st.skills && st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 10;

          st.flags._r112RepElec = true;

          StateManager.addMessage("你只查了线没动手，先攒了点经验。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r112_xiaomei_location",

    phase: "street",

    icon: "💄",

    title: "商圈撞见小美",

    story:
      "你在商圈逛着，正巧撞见小美在挑衣裳，她招手喊你帮她掌掌眼，顺带聊起近况。",

    // conditions：已结识小美且好感达标 + 身处商圈（NPC×地点空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.xiao_mei; // 检查 小美关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (!st.trade || st.trade.currentLocation !== "commercialDist")
        return false; // 检查 商圈

      if (st.flags && st.flags._r112XmLoc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "💄 陪她挑衣",

        hint: "好感+ 现金-",

        apply: function (st) {
          if (st.relationships && st.relationships.xiao_mei)
            st.relationships.xiao_mei.affinity = Math.min(
              100,

              st.relationships.xiao_mei.affinity + 3,
            );

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 40);

          st.flags._r112XmLoc = true;

          StateManager.addMessage(
            "你陪小美挑了衣裳，花¥40，两人更熟了。",

            "success",
          );
        },
      },

      {
        text: "🤝 只叙不买",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.xiao_mei)
            st.relationships.xiao_mei.affinity = Math.min(
              100,

              st.relationships.xiao_mei.affinity + 1,
            );

          st.flags._r112XmLoc = true;

          StateManager.addMessage(
            "你陪小美聊了会儿没买东西，情分又近一层。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r113_actionfreq_train",

    phase: "street",

    icon: "📚",

    title: "练出心得",

    story: "你连日死磕编程，练得手都熟了，忽而开窍，一通百通，码起来顺手许多。",

    // conditions：编程训练频次高（行为×技能空白区）

    conditions: function (st) {
      if (!st.stats || !st.stats.trainFreq) return false; // 检查 训练统计

      if ((st.stats.trainFreq.coding || 0) < 5) return false; // 检查 编程训练>=5

      if (st.flags && st.flags._r113FreqTrain) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📚 趁热打铁",

        hint: "经验+ 现金+",

        apply: function (st) {
          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 35;

          st.resources.cash = (st.resources.cash || 0) + 120;

          st.flags._r113FreqTrain = true;

          StateManager.addMessage(
            "你趁开窍打铁，编程涨了一大截，还顺手接了小活。",

            "success",
          );
        },
      },

      {
        text: "🧊 缓缓再练",

        hint: "轻量 经验+",

        apply: function (st) {
          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 18;

          st.flags._r113FreqTrain = true;

          StateManager.addMessage("你缓了缓没硬练，心得先记着。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r113_sisterzhang_slum",

    phase: "street",

    icon: "🏚️",

    title: "贫民区遇张姐",

    story:
      "你在贫民区串门，正撞见张姐在给街坊分旧衣，见你来便塞给你一件挡风的。",

    // conditions：已结识张姐且好感达标 + 身处贫民区（NPC×地点空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_zhang; // 检查 张姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (!st.trade || st.trade.currentLocation !== "slum") return false; // 检查 贫民区

      if (st.flags && st.flags._r113SzSlum) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🏚️ 帮她分衣",

        hint: "好感+ 名声+",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_zhang)
            st.relationships.sister_zhang.affinity = Math.min(
              100,

              st.relationships.sister_zhang.affinity + 3,
            );

          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r113SzSlum = true;

          StateManager.addMessage(
            "你帮张姐分旧衣，两人更近，落了个热心名声。",

            "success",
          );
        },
      },

      {
        text: "🤝 只叙不帮",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_zhang)
            st.relationships.sister_zhang.affinity = Math.min(
              100,

              st.relationships.sister_zhang.affinity + 1,
            );

          st.flags._r113SzSlum = true;

          StateManager.addMessage("你陪张姐唠了会儿，情分又近一层。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r113_welding_job_employment",

    phase: "street",

    icon: "🔥",

    title: "焊工上了岗",

    story: "你焊活利索，老板把车间里最费焊的件都划给你，说交给你省心。",

    // conditions：焊接技能达标 + 有主业（技能×职业空白区）

    conditions: function (st) {
      if (
        !st.skills ||
        ((st.skills.welding && st.skills.welding.level) || 0) < 15
      )
        return false; // 检查 焊接>=15

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r113WeldJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🔥 接下重活",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 240;

          if (st.skills && st.skills.welding)
            st.skills.welding.xp = (st.skills.welding.xp || 0) + 30;

          st.flags._r113WeldJob = true;

          StateManager.addMessage(
            "你接下车间重焊活，落袋¥240，手艺更稳。",

            "success",
          );
        },
      },

      {
        text: "🧊 稳着干",

        hint: "轻量 经验+",

        apply: function (st) {
          if (st.skills && st.skills.welding)
            st.skills.welding.xp = (st.skills.welding.xp || 0) + 15;

          st.flags._r113WeldJob = true;

          StateManager.addMessage("你稳着出活，焊接的红利慢慢攒。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r114_cloudy_stress_relief",

    phase: "street",

    icon: "☁️",

    title: "阴天的松快",

    story:
      "阴天不晒不燥，你难得没紧绷着，蹲在檐下发了会儿呆，心口那股压力散了些。",

    // conditions：阴天 + 心理压力大（天气×需求空白区）

    conditions: function (st) {
      if (!st.weather || st.weather.current !== "cloudy") return false; // 检查 阴天

      if (!st.player || !st.player.health || !st.player.health.mental)
        return false; // 检查 心理结构存在

      if ((st.player.health.mental.stress || 0) <= 50) return false; // 检查 压力>50

      if (st.flags && st.flags._r114Cloudy) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "☁️ 檐下发呆",

        hint: "压力-",

        apply: function (st) {
          st.player.health.mental.stress = Math.max(
            0,
            (st.player.health.mental.stress || 0) - 20,
          );

          st.flags._r114Cloudy = true;

          StateManager.addMessage(
            "阴天里你发了会儿呆，心理压力下去一截。",
            "success",
          );
        },
      },

      {
        text: "🚶 阴天走走",

        hint: "轻量 压力- 疲劳+",

        apply: function (st) {
          st.player.health.mental.stress = Math.max(
            0,
            (st.player.health.mental.stress || 0) - 10,
          );

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 6);

          st.flags._r114Cloudy = true;

          StateManager.addMessage(
            "你顺着阴天散了散步，压力轻了，腿脚酸了点。",
            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r114_rep_slum_loan",

    phase: "street",

    icon: "🏚️",

    title: "贫民区的周转",

    story:
      "你在贫民区攒下的义名让街坊信你，有人愿意垫钱帮你过这道坎，说先救急再还。",

    // conditions：贫民区声望达标（声望×贷款空白区）

    conditions: function (st) {
      if (!st.reputation || (st.reputation.slum || 0) < 30) return false; // 检查 贫民区声望>=30

      if (st.flags && st.flags._r114SlumLoan) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🏚️ 借街坊钱",

        hint: "现金+ 债务+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 400;

          st.resources.debt = (st.resources.debt || 0) + 400;

          st.flags._r114SlumLoan = true;

          StateManager.addMessage(
            "凭贫民区义名借了街坊¥400周转，记得还人情。",
            "success",
          );
        },
      },

      {
        text: "🤝 先不借",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r114SlumLoan = true;

          StateManager.addMessage("你婉拒了，落得个不欠人情的好名声。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r114_sales_english_job",

    phase: "street",

    icon: "🗣️",

    title: "外语谈单",

    story:
      "你凭着一张利嘴加半吊子外语，竟把一单对外的买卖谈成了，老板直夸你会来事。",

    // conditions：销售技能达标 + 英语技能达标 + 有主业（技能×技能×职业空白区）

    conditions: function (st) {
      if (!st.skills) return false; // 检查 技能结构

      if (((st.skills.sales && st.skills.sales.level) || 0) < 10) return false; // 检查 销售>=10

      if (((st.skills.english && st.skills.english.level) || 0) < 10)
        return false; // 检查 英语>=10

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r114SalesEng) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🗣️ 谈下这单",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 260;

          if (st.skills && st.skills.sales)
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 20;

          if (st.skills && st.skills.english)
            st.skills.english.xp = (st.skills.english.xp || 0) + 20;

          st.flags._r114SalesEng = true;

          StateManager.addMessage(
            "你外语谈成单，落袋¥260，两张手艺都涨。",
            "success",
          );
        },
      },

      {
        text: "🧊 稳着谈",

        hint: "轻量 经验+",

        apply: function (st) {
          if (st.skills && st.skills.english)
            st.skills.english.xp = (st.skills.english.xp || 0) + 10;

          st.flags._r114SalesEng = true;

          StateManager.addMessage("你稳着谈，没急成，先攒了点经验。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r95_bankrep_loan",

    phase: "street",

    icon: "🏦",

    title: "银行的青睐",

    story:
      "你在商圈的口碑传到了银行，信贷经理主动问你要不要周转一笔，利息比外头公道。",

    // conditions：银行声望达标 + 有主业或副业（声望×贷款空白区）

    conditions: function (st) {
      if (!st.reputation || (st.reputation.bank || 0) < 30) return false; // 检查 银行声望>=30

      if (
        !(st.employment && st.employment.currentJob) &&
        !(st.sideHustle && st.sideHustle.active)
      )
        return false; // 检查 有收入来源

      if (st.flags && st.flags._r95BankLoan) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🏦 借一笔周转",

        hint: "现金+ 债务+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 800;

          st.resources.debt = (st.resources.debt || 0) + 800;

          st.flags._r95BankLoan = true;

          StateManager.addMessage(
            "银行痛快放款¥800，记得按时还，利息不坑人。",

            "success",
          );
        },
      },

      {
        text: "🙅 暂不需要",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.bank = Math.min(100, (st.reputation.bank || 0) + 3);

          st.flags._r95BankLoan = true;

          StateManager.addMessage(
            "你婉拒了，经理反而高看一眼，银行声望又涨。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r95_cooking_chefchen",

    phase: "street",

    icon: "🍳",

    title: "陈厨的点拨",

    story: "你摆弄厨艺被陈厨撞见，他看你手生却肯琢磨，当场点拨了几手家常绝活。",

    // conditions：厨艺达标 + 已结识陈厨且好感达标（技能×NPC空白区）

    conditions: function (st) {
      if (
        !st.skills ||
        ((st.skills.cooking && st.skills.cooking.level) || 0) < 15
      )
        return false; // 检查 厨艺>=15

      var rel = st.relationships && st.relationships.chef_chen; // 检查 陈厨关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (st.flags && st.flags._r95CookChef) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🍳 拜师学艺",

        hint: "厨艺+ 经验+",

        apply: function (st) {
          st.skills.cooking.level += 1;

          st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 40;

          st.flags._r95CookChef = true;

          StateManager.addMessage(
            "陈厨点拨，厨艺精进一级，家常菜更拿手了。",

            "success",
          );
        },
      },

      {
        text: "🤝 记在心里",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 15;

          st.flags._r95CookChef = true;

          StateManager.addMessage("你默默记下陈厨的诀窍，留着日后用。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r95_hygiene_slum",

    phase: "street",

    icon: "🚿",

    title: "棚户里的脏乱",

    story:
      "你在贫民区落脚，屋里乱得下不去脚，身上也泛着味儿，邻居掩着鼻子绕开你。",

    // conditions：卫生偏低 + 身处贫民区（需求×地点空白区）

    conditions: function (st) {
      if (!st.needs || (st.needs.hygiene || 0) >= 30) return false; // 检查 卫生<30

      if (!st.trade || st.trade.currentLocation !== "slum") return false; // 检查 贫民区

      if (st.flags && st.flags._r95HygSlum) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🚿 拾掇屋子",

        hint: "卫生+ 心情+",

        apply: function (st) {
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 25);

          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);

          st.flags._r95HygSlum = true;

          StateManager.addMessage(
            "你花半天把窝棚收拾干净，人精神了不少。",

            "success",
          );
        },
      },

      {
        text: "😣 将就过去",

        hint: "轻量 心情-",

        apply: function (st) {
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 4);

          st.flags._r95HygSlum = true;

          StateManager.addMessage(
            "你将就着过，可那味儿自己也闻着别扭。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r95_rainy_driving",

    phase: "street",

    icon: "🌧️",

    title: "雨夜代驾",

    story: "雨天路滑，叫车的人多了起来，你开着副业接单，雨刷哗哗地刮着前路。",

    // conditions：雨天 + 驾驶副业进行中（天气×副业空白区）

    conditions: function (st) {
      if (!st.weather || st.weather.current !== "rainy") return false; // 检查 雨天

      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "driving"
      )
        return false; // 检查 驾驶副业

      if (st.flags && st.flags._r95RainDrive) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🌧️ 冒雨出车",

        hint: "现金+ 疲劳+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 210;

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);

          st.flags._r95RainDrive = true;

          StateManager.addMessage(
            "雨夜代驾跑了好几单，落袋¥210，人也有些乏了。",

            "success",
          );
        },
      },

      {
        text: "🛑 收车歇着",

        hint: "轻量 疲劳-",

        apply: function (st) {
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 8);

          st.flags._r95RainDrive = true;

          StateManager.addMessage("你早早收车，雨大路滑，稳妥要紧。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r96_auntwang_location",

    phase: "street",

    icon: "🧶",

    title: "商圈遇王姨",

    story:
      "你在商圈转悠，正撞见王姨进货，她拉着你念叨生意经，顺手塞给你个熟人生意。",

    // conditions：已结识王姨且好感达标 + 身处商圈（NPC×地点空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.aunt_wang; // 检查 王姨关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (!st.trade || st.trade.currentLocation !== "commercialDist")
        return false; // 检查 商圈

      if (st.flags && st.flags._r96AwLoc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🧶 接下生意",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 160;

          if (st.relationships && st.relationships.aunt_wang)
            st.relationships.aunt_wang.affinity = Math.min(
              100,

              st.relationships.aunt_wang.affinity + 3,
            );

          st.flags._r96AwLoc = true;

          StateManager.addMessage(
            "王姨的熟人生意到手，落袋¥160，她愈发信你。",

            "success",
          );
        },
      },

      {
        text: "🤝 陪聊两句",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.aunt_wang)
            st.relationships.aunt_wang.affinity = Math.min(
              100,

              st.relationships.aunt_wang.affinity + 1,
            );

          st.flags._r96AwLoc = true;

          StateManager.addMessage(
            "你陪王姨聊了会儿，人情味儿比买卖值钱。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r96_era_mature_accounting",

    phase: "street",

    icon: "📒",

    title: "成熟期理账",

    story: "城里步入鼎盛，小本生意遍地开花，懂账的人被抢着请去理这本糊涂账。",

    // conditions：时代成熟期 + 会计技能达标（时代×经济空白区）

    conditions: function (st) {
      if (!st._eraState) return false; // 检查 时代已初始化

      if (st._eraState.stageId !== "mature") return false; // 检查 成熟期

      if (
        !st.skills ||
        ((st.skills.accounting && st.skills.accounting.level) || 0) < 15
      )
        return false; // 检查 会计>=15

      if (st.flags && st.flags._r96EraAcc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📒 接账理账",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;

          st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 35;

          st.flags._r96EraAcc = true;

          StateManager.addMessage(
            "鼎盛年景里你帮人理账，落袋¥300，账面利落。",

            "success",
          );
        },
      },

      {
        text: "📉 只点拨不接",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 12;

          st.flags._r96EraAcc = true;

          StateManager.addMessage(
            "你只给人点了拨门道，没揽活儿，留了清闲。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r96_heatwave_job",

    phase: "street",

    icon: "🥵",

    title: "热浪里的班",

    story: "高温红色预警，你还得蹬去上工，柏油路蒸腾着热气，工装早湿透了。",

    // conditions：热浪天气 + 有主业（天气×职业空白区）

    conditions: function (st) {
      if (!st.weather || st.weather.current !== "heatwave") return false; // 检查 热浪

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r96HeatJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🥵 硬扛上工",

        hint: "现金+ 健康- 疲劳+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 150;

          st.status.health = Math.max(0, (st.status.health || 0) - 6);

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 14);

          st.flags._r96HeatJob = true;

          StateManager.addMessage(
            "热浪里硬扛完一班，落袋¥150，人却虚脱了。",

            "success",
          );
        },
      },

      {
        text: "🧊 讨半天假",

        hint: "轻量 健康+ 现金-",

        apply: function (st) {
          st.status.health = Math.min(100, (st.status.health || 0) + 4);

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 40);

          st.flags._r96HeatJob = true;

          StateManager.addMessage(
            "你跟工头磨来半天假，少赚¥40却保住了身子。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r96_skill_repair_elec",

    phase: "street",

    icon: "🔧",

    title: "双料手艺",

    story:
      "你修得了家电也接得了电路，街坊把俩活儿一并塞给你，夸你是难得的全把式。",

    // conditions：修理+电工双技能达标（技能×技能空白区）

    conditions: function (st) {
      if (!st.skills) return false;

      if (((st.skills.repair && st.skills.repair.level) || 0) < 15)
        return false; // 检查 修理>=15

      if (((st.skills.electrician && st.skills.electrician.level) || 0) < 15)
        return false; // 检查 电工>=15

      if (st.flags && st.flags._r96RepElec) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🔧 一并接下",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 240;

          st.skills.repair.xp = (st.skills.repair.xp || 0) + 30;

          st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 30;

          st.flags._r96RepElec = true;

          StateManager.addMessage(
            "双活儿一手包办，落袋¥240，手艺更瓷实了。",

            "success",
          );
        },
      },

      {
        text: "🙇 只挑一样",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.repair.xp = (st.skills.repair.xp || 0) + 15;

          st.flags._r96RepElec = true;

          StateManager.addMessage("你只接了修家电的活儿，稳扎稳打。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r96_talent_mgmt_job",

    phase: "street",

    icon: "🧠",

    title: "天赋撑腰",

    story:
      "你点通了管理一道的天赋，带起人来上手极快，老板悄悄把更重要的摊子交给你。",

    // conditions：已激活天赋 + 有主业 + 管理技能达标（天赋×职业空白区）

    conditions: function (st) {
      if (!st.talentNodes || Object.keys(st.talentNodes).length === 0)
        return false; // 检查 已激活天赋

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (
        !st.skills ||
        ((st.skills.management && st.skills.management.level) || 0) < 10
      )
        return false; // 检查 管理>=10

      if (st.flags && st.flags._r96TalentJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🧠 挑大梁",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 260;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._r96TalentJob = true;

          StateManager.addMessage(
            "天赋加持下你挑起大梁，落袋¥260，名声也涨。",

            "success",
          );
        },
      },

      {
        text: "🤫 低调干活",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.management.xp = (st.skills.management.xp || 0) + 20;

          st.flags._r96TalentJob = true;

          StateManager.addMessage(
            "你闷头把活干漂亮，天赋的红利慢慢攒着。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r97_era_growth_trade",

    phase: "street",

    icon: "📈",

    title: "扩张期好行情",

    story: "城里正扩张，买卖红火，你早先跑通的的那点贸易门道，这会儿格外吃香。",

    // conditions：时代扩张期 + 已有贸易积累（时代×经济空白区）

    conditions: function (st) {
      if (!st._eraState) return false; // 检查 时代已初始化

      if (st._eraState.stageId !== "growth") return false; // 检查 扩张期

      if (((st.trade && st.trade.totalProfit) || 0) <= 0) return false; // 检查 有过贸易积累

      if (st.flags && st.flags._r97EraTrade) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📈 加仓倒腾",

        hint: "现金+ 风险+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 280;

          st.trade.totalProfit = (st.trade.totalProfit || 0) + 280;

          st.flags._r97EraTrade = true;

          StateManager.addMessage(
            "扩张期你加码倒腾，落袋¥280，行情果然给脸。",

            "success",
          );
        },
      },

      {
        text: "🧊 见好就收",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          st.flags._r97EraTrade = true;

          StateManager.addMessage("你见好就收，落得个稳当名声。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r97_fatigue_sleep",

    phase: "street",

    icon: "😴",

    title: "撑不住的困",

    story: "连轴转了几天，你眼皮直打架，走路都打飘，再不眯一会儿怕要栽跟头。",

    // conditions：疲劳偏高（需求×事件空白区）

    conditions: function (st) {
      if (!st.needs || (st.needs.fatigue || 0) <= 70) return false; // 检查 疲劳>70

      if (st.flags && st.flags._r97FatSleep) return false; // 检查 未触发过

      return true;
    },

    probability: 0.35,

    repeatable: false,

    choices: [
      {
        text: "😴 找地补觉",

        hint: "疲劳- 现金-",

        apply: function (st) {
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 35);

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);

          st.flags._r97FatSleep = true;

          StateManager.addMessage(
            "你狠心歇了一觉，疲劳大减，花了¥30找个窝。",

            "success",
          );
        },
      },

      {
        text: "☕ 死撑着",

        hint: "轻量 疲劳+ 健康-",

        apply: function (st) {
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);

          st.status.health = Math.max(0, (st.status.health || 0) - 4);

          st.flags._r97FatSleep = true;

          StateManager.addMessage(
            "你硬撑着，疲劳更重，身子先垮了一步。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r97_stormy_job",

    phase: "street",

    icon: "⛈️",

    title: "暴雨中的工",

    story:
      "暴风雨说来就来，你顶着雨去上工，工地的架子在风里直晃，老师傅喊你赶紧撤。",

    // conditions：暴风雨天气 + 有主业（天气×职业空白区）

    conditions: function (st) {
      if (!st.weather || st.weather.current !== "stormy") return false; // 检查 暴风雨

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r97StormJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "⛈️ 冒雨顶上",

        hint: "现金+ 健康-",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          st.status.health = Math.max(0, (st.status.health || 0) - 10);

          st.flags._r97StormJob = true;

          StateManager.addMessage(
            "暴雨里硬顶完一班，落袋¥200，回来咳了半宿。",

            "success",
          );
        },
      },

      {
        text: "🏠 听劝撤了",

        hint: "轻量 现金- 健康+",

        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 60);

          st.status.health = Math.min(100, (st.status.health || 0) + 6);

          st.flags._r97StormJob = true;

          StateManager.addMessage(
            "你听了老师傅的撤了，少赚¥60，捡回条稳当。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r97_techpark_coding",

    phase: "street",

    icon: "💻",

    title: "科技园的活儿",

    story:
      "你在科技园攒下的口碑传到一家初创，他们缺个能写脚本的帮手，开价不算低。",

    // conditions：科技园声望达标 + 编程技能达标（声望×技能空白区）

    conditions: function (st) {
      if (!st.reputation || (st.reputation.techPark || 0) < 30) return false; // 检查 科技园声望>=30

      if (
        !st.skills ||
        ((st.skills.coding && st.skills.coding.level) || 0) < 15
      )
        return false; // 检查 编程>=15

      if (st.flags && st.flags._r97TpCode) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "💻 接活儿",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 320;

          st.skills.coding.xp = (st.skills.coding.xp || 0) + 40;

          st.flags._r97TpCode = true;

          StateManager.addMessage(
            "科技园的活儿到手，落袋¥320，代码更熟了。",

            "success",
          );
        },
      },

      {
        text: "🤔 谈价钱",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 4,
            );

          st.flags._r97TpCode = true;

          StateManager.addMessage(
            "你谈价时敞亮，对方反而高看，科技园声望又涨。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r97_xiaomei_sales",

    phase: "street",

    icon: "💄",

    title: "小美的带货经",

    story:
      "小美看你嘴皮子利索，拉你搭伙练摊，教你几手把寻常物件说成抢手货的诀窍。",

    // conditions：已结识小美且好感达标 + 销售技能达标（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.xiao_mei; // 检查 小美关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (!st.skills || ((st.skills.sales && st.skills.sales.level) || 0) < 10)
        return false; // 检查 销售>=10

      if (st.flags && st.flags._r97XmSales) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "💄 搭伙练摊",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 180;

          st.skills.sales.xp = (st.skills.sales.xp || 0) + 25;

          st.flags._r97XmSales = true;

          StateManager.addMessage(
            "跟小美搭伙练摊，落袋¥180，嘴皮子更溜了。",

            "success",
          );
        },
      },

      {
        text: "📝 只学不练",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.sales.xp = (st.skills.sales.xp || 0) + 10;

          st.flags._r97XmSales = true;

          StateManager.addMessage("你光听小美讲诀窍，没下场，先记着。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r98_era_decline_job",

    phase: "street",

    icon: "📉",

    title: "下坡路的工",

    story:
      "城里景气转衰，厂子订单少了，工头话里话外透着要裁人的意思，你心里直打鼓。",

    // conditions：时代衰退期 + 有主业（时代×经济空白区）

    conditions: function (st) {
      if (!st._eraState) return false; // 检查 时代已初始化

      if (st._eraState.stageId !== "decline") return false; // 检查 衰退期

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r98EraDec) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📉 咬牙留着",

        hint: "轻量 现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r98EraDec = true;

          StateManager.addMessage(
            "衰退年里你咬牙稳住岗位，落袋¥120，工头另眼相看。",

            "success",
          );
        },
      },

      {
        text: "🧭 暗中铺路",

        hint: "轻量 技能+",

        apply: function (st) {
          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 15;

          st.flags._r98EraDec = true;

          StateManager.addMessage(
            "你一边上工一边偷偷学艺，给往后留条后路。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r98_hunger_food",

    phase: "street",

    icon: "🍚",

    title: "饿过劲了",

    story: "你半天没顾上吃东西，胃里一阵阵抽，眼前发飘，再不吃点怕要晕在路边。",

    // conditions：饥饿偏高（需求×事件空白区）

    conditions: function (st) {
      if (!st.needs || (st.needs.hunger || 0) <= 70) return false; // 检查 饥饿>70

      if (st.flags && st.flags._r98Hunger) return false; // 检查 未触发过

      return true;
    },

    probability: 0.35,

    repeatable: false,

    choices: [
      {
        text: "🍚 先垫一口",

        hint: "饥饿- 现金-",

        apply: function (st) {
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 40);

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 25);

          st.flags._r98Hunger = true;

          StateManager.addMessage(
            "你花¥25买了份热乎饭，饥饿下去一大截。",

            "success",
          );
        },
      },

      {
        text: "💧 灌水硬扛",

        hint: "轻量 饥饿- 健康-",

        apply: function (st) {
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 15);

          st.status.health = Math.max(0, (st.status.health || 0) - 3);

          st.flags._r98Hunger = true;

          StateManager.addMessage(
            "你灌了几口凉水顶着，胃还是空落落的。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r98_rep_slum_cash",

    phase: "street",

    icon: "🤝",

    title: "贫民区的接济",

    story: "你在贫民区攒下的好名声传开，街坊见你手头紧，悄悄塞来些零活和吃食。",

    // conditions：贫民区声望达标 + 现金偏低（声望×事件空白区）

    conditions: function (st) {
      if (!st.reputation || (st.reputation.slum || 0) < 30) return false; // 检查 贫民区声望>=30

      if ((st.resources.cash || 0) >= 100) return false; // 检查 现金<100

      if (st.flags && st.flags._r98SlumCash) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🤝 领下情谊",

        hint: "现金+ 饥饿-",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 90;

          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 20);

          st.flags._r98SlumCash = true;

          StateManager.addMessage(
            "街坊的接济让你缓过口气，落袋¥90，胃里也有了底。",

            "success",
          );
        },
      },

      {
        text: "🙏 记着恩",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 4);

          st.flags._r98SlumCash = true;

          StateManager.addMessage(
            "你谢绝了多余的好处，只记下这份情，声望更牢。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r98_sisterwu_mgmt",

    phase: "street",

    icon: "👩‍💼",

    title: "吴姐的提点",

    story: "吴姐看你办事有条理，点拨你几句带人的门道，说你是个能扛事的材料。",

    // conditions：已结识吴姐且好感达标 + 管理技能达标（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_wu; // 检查 吴姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (
        !st.skills ||
        ((st.skills.management && st.skills.management.level) || 0) < 10
      )
        return false; // 检查 管理>=10

      if (st.flags && st.flags._r98SwMgmt) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "👩‍💼 受教带人",

        hint: "经验+ 好感+",

        apply: function (st) {
          st.skills.management.xp = (st.skills.management.xp || 0) + 30;

          if (st.relationships && st.relationships.sister_wu)
            st.relationships.sister_wu.affinity = Math.min(
              100,

              st.relationships.sister_wu.affinity + 2,
            );

          st.flags._r98SwMgmt = true;

          StateManager.addMessage(
            "吴姐的提点让你带人更顺手，管理经验涨了。",

            "success",
          );
        },
      },

      {
        text: "🤝 记下心意",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_wu)
            st.relationships.sister_wu.affinity = Math.min(
              100,

              st.relationships.sister_wu.affinity + 1,
            );

          st.flags._r98SwMgmt = true;

          StateManager.addMessage("你谢过吴姐，把她的话悄悄记在心里。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r98_typhoon_driving",

    phase: "street",

    icon: "🌀",

    title: "台风天代驾",

    story:
      "台风登陆，街上没人敢乱跑，可偏有人急着用车，你掂量着要不要出这趟险。",

    // conditions：台风天气 + 驾驶副业（天气×副业空白区）

    conditions: function (st) {
      if (!st.weather || st.weather.current !== "typhoon") return false; // 检查 台风

      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "driving"
      )
        return false; // 检查 驾驶副业

      if (st.flags && st.flags._r98TyphDrv) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🌀 接这趟险单",

        hint: "现金+ 健康- 疲劳+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 360;

          st.status.health = Math.max(0, (st.status.health || 0) - 8);

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 16);

          st.flags._r98TyphDrv = true;

          StateManager.addMessage(
            "台风天你接了险单，落袋¥360，回来腿都软了。",

            "success",
          );
        },
      },

      {
        text: "🛑 台风歇业",

        hint: "轻量 健康+",

        apply: function (st) {
          st.status.health = Math.min(100, (st.status.health || 0) + 5);

          st.flags._r98TyphDrv = true;

          StateManager.addMessage(
            "你关了接单，台风天保命要紧，身子暖回几分。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r99_bossli_fame",

    phase: "street",

    icon: "🤵",

    title: "李总的赏识",

    story:
      "你在圈子里有了名号，李总托人递话，说往后有用得着你的地方，先记着这份情。",

    // conditions：已结识李总且好感达标 + 名声达标（NPC×名声空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.boss_li; // 检查 李总关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if ((st.player.fame || 0) < 20) return false; // 检查 名声>=20

      if (st.flags && st.flags._r99BlFame) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🤵 领这份情",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 220;

          if (st.relationships && st.relationships.boss_li)
            st.relationships.boss_li.affinity = Math.min(
              100,

              st.relationships.boss_li.affinity + 3,
            );

          st.flags._r99BlFame = true;

          StateManager.addMessage(
            "李总递来的好处落袋¥220，关系更近一层。",

            "success",
          );
        },
      },

      {
        text: "🙇 客气记着",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          st.flags._r99BlFame = true;

          StateManager.addMessage(
            "你客气谢过，名声反倒因稳重又涨了些。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r99_english_job",

    phase: "street",

    icon: "🔤",

    title: "外语派上用",

    story:
      "单位来了桩对外的活儿，偏偏缺个能说两句外语的，你那点英语底子正经派上了用场。",

    // conditions：英语技能达标 + 有主业（技能×职业空白区）

    conditions: function (st) {
      if (
        !st.skills ||
        ((st.skills.english && st.skills.english.level) || 0) < 20
      )
        return false; // 检查 英语>=20

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r99EngJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🔤 接下对外活",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 260;

          st.skills.english.xp = (st.skills.english.xp || 0) + 35;

          st.flags._r99EngJob = true;

          StateManager.addMessage(
            "英语底子帮你接下对外活，落袋¥260，口语也练了。",

            "success",
          );
        },
      },

      {
        text: "📞 只做翻译",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.english.xp = (st.skills.english.xp || 0) + 15;

          st.flags._r99EngJob = true;

          StateManager.addMessage(
            "你只帮着翻了翻，没揽全活，落个轻省。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r99_happiness_low",

    phase: "street",

    icon: "🌧️",

    title: "提不起劲",

    story: "这些天事事不顺，你心里像压了块石，干啥都提不起劲，连笑都显得勉强。",

    // conditions：心情偏低（需求×事件空白区）

    conditions: function (st) {
      if (!st.needs || (st.needs.happiness || 0) >= 30) return false; // 检查 心情<30

      if (st.flags && st.flags._r99Happy) return false; // 检查 未触发过

      return true;
    },

    probability: 0.35,

    repeatable: false,

    choices: [
      {
        text: "🌤️ 找乐子散心",

        hint: "心情+ 现金-",

        apply: function (st) {
          if ((st.resources.cash || 0) >= 40) {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 30);
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 40);
            st.flags._r99Happy = true;
            StateManager.addMessage(
              "你花了¥40找点乐子，心情松快不少。",
              "success",
            );
          } else {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
            st.flags._r99Happy = true;
            StateManager.addMessage(
              "你摸了摸口袋，只剩¥" + (st.resources.cash || 0) + "，只好在公园里散了散步，心情好了一些。",
              "info",
            );
          }
        },
      },
      {
        text: "🧘 自己缓着",

        hint: "轻量 心情+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);

          st.flags._r99Happy = true;

          StateManager.addMessage("你闷头缓了两天，心里那块石轻了些。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r99_inflation_driving",

    phase: "street",

    icon: "⛽",

    title: "通胀里的车轮",

    story:
      "物价一涨再涨，跑车送货的油钱也跟着贵，你盘算着这趟代驾到底划不划算。",

    // conditions：通胀偏高 + 驾驶副业（时代×经济空白区）

    conditions: function (st) {
      if (!st._eraState || typeof st._eraState.inflationIndex !== "number")
        return false; // 检查 时代已初始化

      if (st._eraState.inflationIndex < 1.3) return false; // 检查 通胀>1.3

      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "driving"
      )
        return false; // 检查 驾驶副业

      if (st.flags && st.flags._r99InflDrv) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "⛽ 照跑不误",

        hint: "现金+ 疲劳+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 240;

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);

          st.flags._r99InflDrv = true;

          StateManager.addMessage(
            "通胀年里你照跑代驾，落袋¥240，油钱虽贵总算有赚。",

            "success",
          );
        },
      },

      {
        text: "🧮 算准再跑",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120;

          st.flags._r99InflDrv = true;

          StateManager.addMessage(
            "你只挑划算的单跑，落袋¥120，没白耗油。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r99_oldzhou_repair",

    phase: "street",

    icon: "🔩",

    title: "老周的旧物",

    story: "老周翻出一堆坏家电，看你手巧，索性让你练手，修好一件便分你些零钱。",

    // conditions：已结识老周且好感达标 + 修理技能达标（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.old_zhou; // 检查 老周关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (
        !st.skills ||
        ((st.skills.repair && st.skills.repair.level) || 0) < 10
      )
        return false; // 检查 修理>=10

      if (st.flags && st.flags._r99OzRep) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🔩 一件件修",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 150;

          st.skills.repair.xp = (st.skills.repair.xp || 0) + 25;

          st.flags._r99OzRep = true;

          StateManager.addMessage(
            "你帮老周修好旧物，落袋¥150，手更巧了。",

            "success",
          );
        },
      },

      {
        text: "🤝 只修最急的",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.min(
              100,

              st.relationships.old_zhou.affinity + 2,
            );

          st.flags._r99OzRep = true;

          StateManager.addMessage("你挑最急的修了一件，老周直念你好。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "management_boss_li_project",

    phase: "street",

    icon: "📋",

    title: "李老板的点将",

    story: "你懂管理，李老板有个烂尾的活儿，点名让你来带，许了你成了有赏。",

    // conditions：management 技能 + 有职业 + boss_li 已结识（技能 ∩ 职业 ∩ NPC ∩ 名声）

    conditions: function (st) {
      var mg = st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级

      if (typeof mg !== "number" || mg < 15) return false; // 检查 management>=15

      if (!st.employment || !st.employment.currentJob) return false; // 检查 有职业

      var rel = st.relationships && st.relationships["boss_li"]; // 检查 boss_li 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._bossProjectSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📋 接下项目",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 280;

          st.player.fame = (st.player.fame || 0) + 3;

          st.flags._bossProjectSeen = true;

          StateManager.addMessage(
            "你接下李老板的项目，现金+¥280，名声+3。",

            "success",
          );
        },
      },

      {
        text: "🗂️ 只出方案",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = (st.player.fame || 0) + 1;

          st.flags._bossProjectSeen = true;

          StateManager.addMessage("你只出了方案，名声+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "management_crew_lead",

    phase: "street",

    icon: "📣",

    title: "带队的活儿",

    story:
      "你正做着副业，摊子慢慢铺开，几个零散工友愿意跟着你干：「你懂安排，带着我们干比单打强。」",

    // conditions：management 技能 + 副业进行中（技能×职业空白区）

    conditions: function (st) {
      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级

      if (typeof mgmt !== "number" || mgmt < 20) return false; // 检查 management>=20

      if (!(st.sideHustle && st.sideHustle.active)) return false; // 检查 副业进行中

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._crewLeadSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "📣 组队接活",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 500;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);

          st.flags._crewLeadSeen = true;

          StateManager.addMessage(
            "你组起小队接了批活，落袋¥500，名声+5。",

            "success",
          );
        },
      },

      {
        text: "🧾 只做调度",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          st.flags._crewLeadSeen = true;

          StateManager.addMessage(
            "你只做排班调度，落袋¥200，不背大头。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "management_npc_team",

    phase: "street",

    icon: "👥",

    title: "李总的点将",

    story:
      "你做副业小有团队，李总来挖人：「你这管理两把刷子，带几个人正好，跟我干一票大的。」",

    // conditions：management 技能 + boss_li 已结识且好感达标 + 副业进行中（技能系统 + NPC 系统 + 副业系统）

    conditions: function (st) {
      var man = st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级

      if (typeof man !== "number" || man < 20) return false; // 检查 management>=20

      var rel = st.relationships && st.relationships["boss_li"]; // 检查 boss_li 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 20) return false; // 检查 中后期

      if (st.flags && st.flags._manageTeamSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.018,

    repeatable: false,

    choices: [
      {
        text: "👥 带人跟李总干",

        hint: "现金+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["boss_li"];

          st.resources.cash = (st.resources.cash || 0) + 480;

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5);

          st.flags._manageTeamSeen = true;

          StateManager.addMessage(
            "你带人跟李总干了一票，落袋¥480，李总好感+5。",

            "success",
          );
        },
      },

      {
        text: "📋 只出管理方子",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["boss_li"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._manageTeamSeen = true;

          StateManager.addMessage("你只给李总出了个管理方子，好感+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "morality_high_boss_li_praise",

    phase: "street",

    icon: "🏅",

    title: "李老板的夸奖",

    story: "你一贯本分，李老板当众夸你靠谱，街坊都高看你了眼，名头也亮了些。",

    // conditions：高道德 + 有职业 + boss_li 已结识（道德 ∩ 职业 ∩ NPC ∩ 名声）

    conditions: function (st) {
      if (typeof st.player.morality !== "number" || st.player.morality < 70)
        return false; // 检查 高道德

      if (!st.employment || !st.employment.currentJob) return false; // 检查 有职业

      var rel = st.relationships && st.relationships["boss_li"]; // 检查 boss_li 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 15) return false; // 检查 好感>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._bossPraiseSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🏅 受下这夸",

        hint: "名声+ 好感+",

        apply: function (st) {
          st.player.fame = (st.player.fame || 0) + 3;

          var rel = st.relationships && st.relationships["boss_li"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._bossPraiseSeen = true;

          StateManager.addMessage(
            "李老板当众夸你，名声+3，李老板好感+2。",

            "success",
          );
        },
      },

      {
        text: "🙇 谦一句",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = (st.player.fame || 0) + 1;

          st.flags._bossPraiseSeen = true;

          StateManager.addMessage("你谦了一句，名声+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "morality_high_charity",

    phase: "street",

    icon: "🤲",

    title: "张姐的善事",

    story:
      "张姐张罗给街坊困难户募捐，看你人实在：「你心善，一块儿搭把手，街坊都记着。」",

    // conditions：道德偏高 + 现金充裕 + sister_zhang 已结识（道德系统 + 经济系统 + NPC 系统）

    conditions: function (st) {
      var mor = st.player && st.player.morality; // 检查 道德

      if (typeof mor !== "number" || mor < 70) return false; // 检查 道德>=70

      var cash = st.resources && st.resources.cash; // 检查 现金

      if (typeof cash !== "number" || cash < 200) return false; // 检查 现金>=200

      var rel = st.relationships && st.relationships["sister_zhang"]; // 检查 sister_zhang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._moralityCharitySeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🤲 捐一笔",

        hint: "现金- 名声+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["sister_zhang"];

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 150);

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.flags._moralityCharitySeen = true;

          StateManager.addMessage(
            "你随张姐捐了¥150，名声+4，张姐好感+4。",

            "success",
          );
        },
      },

      {
        text: "🙌 只出力",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["sister_zhang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._moralityCharitySeen = true;

          StateManager.addMessage("你只出力没掏钱，张姐好感+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "morality_low_boss_li_cover",

    phase: "street",

    icon: "🤥",

    title: "李总的锅",

    story:
      "你名声不咋地，李总出了岔子，顺手把黑锅扣你头上。你权衡利弊，还是替他顶了。",

    // conditions：boss_li 已结识+好感 + 低道德（NPC ∩ 道德系统 ∩ 职业）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["boss_li"]; // 检查 boss_li 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      if (typeof st.player.morality !== "number" || st.player.morality >= 40)
        return false; // 检查 低道德

      if (!st.employment || !st.employment.currentJob) return false; // 检查 有职业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._lowMoralBossSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🤥 替他顶锅",

        hint: "现金+ 道德-",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          st.player.morality = Math.max(0, st.player.morality - 4);

          st.flags._lowMoralBossSeen = true;

          StateManager.addMessage(
            "你替李总顶锅，落袋¥200，道德-4。",

            "success",
          );
        },
      },

      {
        text: "🙅 不背这锅",

        hint: "轻量 好感-",

        apply: function (st) {
          var rel = st.relationships && st.relationships["boss_li"];

          if (rel) rel.affinity = Math.max(-100, rel.affinity - 4);

          st.flags._lowMoralBossSeen = true;

          StateManager.addMessage("你拒背黑锅，李总好感-4。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "morality_low_cheat",

    phase: "street",

    icon: "😏",

    title: "走偏的门道",

    story:
      "有人教你耍点滑头多赚钱：「会说话就能忽悠，规矩是给老实人定的。」你心里那杆秤有点晃。",

    // conditions：道德偏低 + sales 技能（道德系统 + 技能系统）

    conditions: function (st) {
      var mor = st.player && st.player.morality; // 检查 道德

      if (typeof mor !== "number" || mor >= 30) return false; // 检查 道德<30

      var sale = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof sale !== "number" || sale < 15) return false; // 检查 sales>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._moralityCheatSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "😏 耍个滑头",

        hint: "现金+ 道德-",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 260;

          if (st.player)
            st.player.morality = Math.max(0, (st.player.morality || 0) - 5);

          st.flags._moralityCheatSeen = true;

          StateManager.addMessage("你耍了滑头多赚¥260，道德-5。", "success");
        },
      },

      {
        text: "🙅 不为所动",

        hint: "轻量 道德+",

        apply: function (st) {
          if (st.player)
            st.player.morality = Math.min(100, (st.player.morality || 0) + 2);

          st.flags._moralityCheatSeen = true;

          StateManager.addMessage(
            "你没搭理那套歪门邪道，守住了底线，道德+2。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "morality_low_shady_deal",

    phase: "street",

    icon: "🕶️",

    title: "灰色的单子",

    story:
      "你路子野、嘴皮子利，有人递来一单踩线的买卖：「别问来路，能说会道就能糊弄过去，赚快钱。」",

    // conditions：道德低 + sales 技能（道德×职业空白区）

    conditions: function (st) {
      var mor = st.player && st.player.morality; // 检查 道德值

      if (typeof mor !== "number" || mor >= 30) return false; // 检查 道德<30

      var sale = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof sale !== "number" || sale < 15) return false; // 检查 sales>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._shadyDealSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🕶️ 接灰色单",

        hint: "现金+ 道德-",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 550;

          st.player.morality = Math.max(0, (st.player.morality || 0) - 8); // 道德下降

          st.flags._shadyDealSeen = true;

          StateManager.addMessage(
            "你接下踩线买卖，落袋¥550，但心里清楚这钱不干净，道德-8。",

            "warning",
          );
        },
      },

      {
        text: "🚫 摇头婉拒",

        hint: "轻量 道德+",

        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 0) + 3); // 道德微升

          st.flags._shadyDealSeen = true;

          StateManager.addMessage("你摇头婉拒，守住了底线，道德+3。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "morality_low_sister_wu_gossip",

    phase: "street",

    icon: "🗣️",

    title: "吴姐的闲话",

    story:
      "你这人向来不讲究，吴姐背地里跟街坊嚼了你的舌根，贫民区里风评有点往下掉。",

    // conditions：低道德 + sister_wu 已结识（道德 ∩ NPC ∩ 声望）

    conditions: function (st) {
      if (typeof st.player.morality !== "number" || st.player.morality > 30)
        return false; // 检查 低道德

      var rel = st.relationships && st.relationships["sister_wu"]; // 检查 sister_wu 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._wuGossipSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🗣️ 不理会",

        hint: "声望- 道德-",

        apply: function (st) {
          if (st.reputation)
            st.reputation.slum = Math.max(0, (st.reputation.slum || 0) - 5);

          st.player.morality = Math.max(0, (st.player.morality || 0) - 1);

          st.flags._wuGossipSeen = true;

          StateManager.addMessage(
            "吴姐的闲话传开，贫民区声望-5，道德-1。",

            "info",
          );
        },
      },

      {
        text: "🤫 去圆场",

        hint: "声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 3);

          st.flags._wuGossipSeen = true;

          StateManager.addMessage("你上门圆了场，贫民区声望+3。", "success");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "needs_happiness_performer",

    phase: "street",

    icon: "🎤",

    title: "街头卖艺",

    story:
      "你心情低落，却发现自己挺有亲和力，干脆在地铁口唱两首、耍个小把戏：「散散闷气，顺带赚点零花。」",

    // conditions：幸福感低 + 魅力高（需求×事件空白区）

    conditions: function (st) {
      var hap = st.needs && st.needs.happiness; // 检查 幸福感

      if (typeof hap !== "number" || hap >= 25) return false; // 检查 幸福感<25

      var charm = st.player && st.player.charm; // 检查 魅力

      if (typeof charm !== "number" || charm < 30) return false; // 检查 魅力>=30

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._performerSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🎤 摆摊卖艺",

        hint: "现金+ 心情+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 320;

          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12); // 心情回升

          st.flags._performerSeen = true;

          StateManager.addMessage(
            "你地铁口卖艺解闷又赚零花，落袋¥320，心情+12。",

            "success",
          );
        },
      },

      {
        text: "🎶 只自娱自乐",

        hint: "轻量 心情+",

        apply: function (st) {
          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8); // 心情回升

          st.flags._performerSeen = true;

          StateManager.addMessage(
            "你只自娱自乐唱了两首，心情松快了些，心情+8。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "news_accounting_invest",

    phase: "street",

    icon: "📰",

    title: "财经新闻的眼力",

    story:
      "你常读财经新闻，又懂点账。一条政策动向被你看出门道，顺势小投了一笔，赚了点信息差。",

    // conditions：accounting 技能 + 中后期 + 有现金（技能 ∩ 经济 ∩ 新闻系统）

    conditions: function (st) {
      if (!st.resources || (st.resources.cash || 0) < 500) return false; // [Layer3] 叙事涉及投资

      var acc = st.skills && st.skills.accounting && st.skills.accounting.level; // 检查 accounting 等级

      if (typeof acc !== "number" || acc < 20) return false; // 检查 accounting>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._newsAccSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "📰 跟新闻下注",

        hint: "现金+ accounting+",

        apply: function (st) {
          var s = st.skills.accounting;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash = (st.resources.cash || 0) + 220;

          st.flags._newsAccSeen = true;

          StateManager.addMessage(
            "你凭新闻眼力小赚，accounting+2，落袋¥220。",

            "success",
          );
        },
      },

      {
        text: "📉 只看不买",

        hint: "轻量 accounting+",

        apply: function (st) {
          var s = st.skills.accounting;

          s.level = Math.min(100, s.level + 1);

          st.flags._newsAccSeen = true;

          StateManager.addMessage("你只琢磨门道，accounting+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "old_zhou_rep_slum_trade",

    phase: "street",

    icon: "🔧",

    title: "老周的活儿",

    story:
      "老周在贫民区口碑好，见你修东西有两下子，又念着你在这儿的名声，把一笔家电维修的活儿包给了你。",

    // conditions：old_zhou 已结识+好感 + slum 声望 + repair 技能（NPC ∩ 声望 ∩ 技能）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["old_zhou"]; // 检查 old_zhou 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      if (typeof (st.reputation && st.reputation.slum) !== "number" || st.reputation.slum < 25)
        return false; // 检查 贫民区声望

      var rep = st.skills && st.skills.repair && st.skills.repair.level; // 检查 repair 等级

      if (typeof rep !== "number" || rep < 10) return false; // 检查 repair>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._ozTradeSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🔧 接下维修活",

        hint: "现金+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["old_zhou"];

          st.resources.cash = (st.resources.cash || 0) + 200;

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._ozTradeSeen = true;

          StateManager.addMessage(
            "你接下老周的维修活，落袋¥200，老周好感+3。",

            "success",
          );
        },
      },

      {
        text: "🙅 手头紧推了",

        hint: "轻量 好感-",

        apply: function (st) {
          var rel = st.relationships && st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.max(-100, rel.affinity - 2);

          st.flags._ozTradeSeen = true;

          StateManager.addMessage("你推了老周的活，老周好感-2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "old_zhou_repair_trust",

    phase: "street",

    icon: "🔧",

    title: "老周的信任",

    story:
      "修车老周看你手脚利索，把摊子交给你看半天：「会修东西的人踏实，这摊子我放心交给你。」",

    // conditions：old_zhou 已结识且好感达标 + repair 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["old_zhou"]; // 检查 old_zhou 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      var rep = st.skills && st.skills.repair && st.skills.repair.level; // 检查 repair 等级

      if (typeof rep !== "number" || rep < 15) return false; // 检查 repair>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._oldZhouTrustSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🔧 接下摊子",

        hint: "现金+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["old_zhou"];

          st.resources.cash = (st.resources.cash || 0) + 220;

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5);

          st.flags._oldZhouTrustSeen = true;

          StateManager.addMessage(
            "你帮老周看摊半天，落袋¥220，老周好感+5。",

            "success",
          );
        },
      },

      {
        text: "🛠️ 只帮小修",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._oldZhouTrustSeen = true;

          StateManager.addMessage("你只帮老周修了俩小件，老周好感+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "old_zhou_welding_mentor",

    phase: "street",

    icon: "🧓",

    title: "老周的私活",

    story:
      "老周看你焊活稳当，拍拍你肩：「后生可畏，我这有批私活，带你一起干，分你一份。」",

    // conditions：old_zhou 已结识且好感达标 + welding 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["old_zhou"]; // 检查 old_zhou 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      var weld = st.skills && st.skills.welding && st.skills.welding.level; // 检查 welding 等级

      if (typeof weld !== "number" || weld < 15) return false; // 检查 welding>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 15) return false; // 检查 中后期

      if (st.flags && st.flags._oldZhouWeldSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🧓 跟老周干私活",

        hint: "现金+ 名声+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["old_zhou"];

          st.resources.cash = (st.resources.cash || 0) + 430;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5); // 老周更信你

          st.flags._oldZhouWeldSeen = true;

          StateManager.addMessage(
            "你跟老周干了批私活，落袋¥430，名声+3，老周好感+5。",

            "success",
          );
        },
      },

      {
        text: "📚 只学手艺",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 8); // 老周赏识你肯学

          st.flags._oldZhouWeldSeen = true;

          StateManager.addMessage(
            "你只跟老周学手艺，他赏识你肯钻研，好感+8。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r115_morality_loan_bank", // 道德×声望×贷款

    phase: "street",

    icon: "🏦",

    title: "银行的灰色捷径",

    story:
      "你在银行圈子风评不错，有位相熟的客户经理私下递话：「有笔款子走个擦边流程，能提前给你周转——规矩嘛，向来是活人变通的。」",

    // conditions：道德偏低 + 银行声望达标（道德×声望×贷款空白区）

    conditions: function (st) {
      if (typeof st.player.morality !== "number" || st.player.morality >= 30)
        return false; // 检查 道德<30

      var rep = (st.reputation && st.reputation.bank) || 0; // 检查 银行声望

      if (rep < 15) return false; // 检查 银行声望>=15

      if (st.flags && st.flags._r115BankGray) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🏦 走这条捷径",

        hint: "现金+ 道德- 名声-",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 500;

          st.player.morality = Math.max(0, (st.player.morality || 0) - 8);

          st.player.fame = Math.max(0, (st.player.fame || 0) - 4);

          st.flags._r115BankGray = true;

          StateManager.addMessage(
            "你走了擦边流程，落袋¥500，但心里发虚，名声-4、道德-8。",
            "success",
          );
        },
      },

      {
        text: "🙅 不碰灰的",

        hint: "轻量 道德+",

        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 0) + 3);

          st.flags._r115BankGray = true;

          StateManager.addMessage(
            "你婉拒了灰色捷径，守住了底线，道德+3。",
            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r115_weld_elec_techpark", // 技能×技能×地点

    phase: "street",

    icon: "🔧",

    title: "园区里的巧手",

    story:
      "科技园区的设备间又出了岔子：既要电焊补架，又要接电布线。你两手都会，师傅盯着你直乐：「这年头能焊能接的，比研究生还稀罕。」",

    // conditions：焊接技能 + 电工技能 + 在科技园区（技能×技能×地点空白区）

    conditions: function (st) {
      if (!st.skills) return false; // 检查 技能结构

      if (((st.skills.welding && st.skills.welding.level) || 0) < 10)
        return false; // 检查 焊接>=10

      if (((st.skills.electrician && st.skills.electrician.level) || 0) < 10)
        return false; // 检查 电工>=10

      if (!(st.trade && st.trade.currentLocation === "techPark")) return false; // 检查 在科技园区

      if (st.flags && st.flags._r115WeldElec) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🔧 接下这活",

        hint: "现金+ 双技能xp+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 320;

          if (st.skills && st.skills.welding)
            st.skills.welding.xp = (st.skills.welding.xp || 0) + 25;

          if (st.skills && st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 25;

          st.flags._r115WeldElec = true;

          StateManager.addMessage(
            "你焊完又接好线，落袋¥320，两门手艺都涨。",
            "success",
          );
        },
      },

      {
        text: "🧊 只帮小忙",

        hint: "轻量 电工xp+",

        apply: function (st) {
          if (st.skills && st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 10;

          st.flags._r115WeldElec = true;

          StateManager.addMessage("你只接了布线的小活，先攒点经验。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r115_xiaomei_rain", // NPC×天气

    phase: "street",

    icon: "☔",

    title: "小美的伞",

    story:
      "突降的雨把街口浇透了，小美撑着一把伞挪到你身边：「一起躲躲？我刚打听到批发市场的行情，顺手告诉你。」",

    // conditions：认识小美 + 好感达标 + 雨天（NPC×天气空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.xiao_mei; // 检查 小美关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 30) return false; // 检查 好感>=30

      if (!(st.weather && st.weather.current === "rainy")) return false; // 检查 雨天

      if (st.flags && st.flags._r115XiaomeiRain) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "☔ 听她的行情",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120;

          var rel = st.relationships.xiao_mei;

          rel.affinity = Math.min(100, (rel.affinity || 0) + 5);

          st.flags._r115XiaomeiRain = true;

          StateManager.addMessage(
            "你听了小美给的行情，小赚¥120，好感+5。",
            "success",
          );
        },
      },

      {
        text: "🤝 请她喝杯热的",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships.xiao_mei;

          rel.affinity = Math.min(100, (rel.affinity || 0) + 8);

          st.flags._r115XiaomeiRain = true;

          StateManager.addMessage(
            "你请小美喝了杯热的，两人更近了，好感+8。",
            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r116_era_growth_inflation", // 时代×经济

    phase: "street",

    icon: "📈",

    title: "扩张期的钱潮",

    story:
      "城里一片热火朝天，到处是新开的铺子和招工启事。通胀也跟着爬，钱看着多，其实毛得更快——你盘算着得让手里的活钱动起来。",

    // conditions：扩张期 + 通胀上行（时代×经济空白区）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (era.stageId !== "growth") return false; // 检查 扩张期

      if (typeof era.inflationIndex !== "number" || era.inflationIndex < 1.2)
        return false; // 检查 通胀>=1.2

      if (st.flags && st.flags._r116EraGrowth) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📈 追着风口投",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 360;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._r116EraGrowth = true;

          StateManager.addMessage(
            "你踩着扩张节奏投了笔小钱，落袋¥360，名声+4。",
            "success",
          );
        },
      },

      {
        text: "🧮 先捂紧钱袋",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120;

          st.flags._r116EraGrowth = true;

          StateManager.addMessage("你没盲目追风口，稳稳小赚¥120。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r116_needs_hygiene_job", // 需求×职业

    phase: "street",

    icon: "🚿",

    title: "邋遢被点名",

    story:
      "连着几天没顾上收拾，你顶着油头去上工，主管皱着眉把你叫到一边：「形象也是活计的一部分，你这样客人怎么信你？」",

    // conditions：卫生需求偏低 + 有主业（需求×职业空白区）

    conditions: function (st) {
      if (!(st.needs && typeof st.needs.hygiene === "number")) return false; // 检查 需求结构

      if (st.needs.hygiene >= 20) return false; // 检查 卫生<20

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r116HygieneJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🚿 赶紧收拾利索",

        hint: "卫生+ 名声+",

        apply: function (st) {
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 40);

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          st.flags._r116HygieneJob = true;

          StateManager.addMessage(
            "你回去洗漱利索了，主管点头，名声+3、卫生回血。",
            "success",
          );
        },
      },

      {
        text: "😶 嘴硬不改",

        hint: "名声- 轻量",

        apply: function (st) {
          st.player.fame = Math.max(0, (st.player.fame || 0) - 3);

          st.flags._r116HygieneJob = true;

          StateManager.addMessage("你不以为然，主管记了一笔，名声-3。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r116_talent_management_job", // 天赋×职业

    phase: "street",

    icon: "📋",

    title: "会管人的你",

    story:
      "你点过管理天赋，又攒了些带队的经验。这回单位要拉个小组，主管第一个想到你：「这批新人交给你带，我放心。」",

    // conditions：管理天赋节点 + 管理技能 + 有主业（天赋×职业空白区）

    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["sales_management"])) return false; // 检查 管理天赋节点

      if (!st.skills) return false; // 检查 技能结构

      if (((st.skills.management && st.skills.management.level) || 0) < 15)
        return false; // 检查 管理>=15

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r116TalentMgmt) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📋 接下来带人",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 280;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);

          if (st.skills && st.skills.management)
            st.skills.management.xp = (st.skills.management.xp || 0) + 20;

          st.flags._r116TalentMgmt = true;

          StateManager.addMessage(
            "你接手带组，落袋¥280，名声+5，管理更熟了。",
            "success",
          );
        },
      },

      {
        text: "🧊 只当顾问",

        hint: "轻量 管理xp+",

        apply: function (st) {
          if (st.skills && st.skills.management)
            st.skills.management.xp = (st.skills.management.xp || 0) + 10;

          st.flags._r116TalentMgmt = true;

          StateManager.addMessage("你只做顾问不出头，先攒点管理经验。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r117_cooking_chefchen", // 技能×NPC

    phase: "street",

    icon: "🍳",

    title: "陈厨的私活",

    story:
      "你手艺见长，陈厨尝了你带的便当，挑眉：「有点意思。我后厨缺个帮闲的，活不多，算你长长见识。」",

    // conditions：烹饪技能 + 结识陈厨 + 好感达标（技能×NPC空白区）

    conditions: function (st) {
      if (!st.skills) return false; // 检查 技能结构

      if (((st.skills.cooking && st.skills.cooking.level) || 0) < 20)
        return false; // 检查 烹饪>=20

      var rel = st.relationships && st.relationships.chef_chen; // 检查 陈厨关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 25) return false; // 检查 好感>=25

      if (st.flags && st.flags._r117CookChef) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🍳 去后厨帮闲",

        hint: "现金+ 烹饪xp+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          if (st.skills && st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 25;

          var rel = st.relationships.chef_chen;

          rel.affinity = Math.min(100, (rel.affinity || 0) + 5);

          st.flags._r117CookChef = true;

          StateManager.addMessage(
            "你去了陈厨后厨帮闲，落袋¥200，厨艺+，好感+5。",
            "success",
          );
        },
      },

      {
        text: "🧊 先记着人情",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships.chef_chen;

          rel.affinity = Math.min(100, (rel.affinity || 0) + 8);

          st.flags._r117CookChef = true;

          StateManager.addMessage(
            "你没急着接活，先记下陈厨这份人情，好感+8。",
            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r117_rep_commercialdist_trade", // 声望×交易

    phase: "street",

    icon: "🏪",

    title: "商圈里有人罩",

    story:
      "你在商圈里的口碑传开了，几个摊主见你来了主动让价、留好货：「你这人实诚，路子给你留着。」",

    // conditions：商圈声望 + 身在商圈（声望×交易空白区）

    conditions: function (st) {
      var rep = (st.reputation && st.reputation.commercialDist) || 0; // 检查 商圈声望

      if (rep < 30) return false; // 检查 声望>=30

      if (!(st.trade && st.trade.currentLocation === "commercialDist"))
        return false; // 检查 在商圈

      if (st.flags && st.flags._r117RepTrade) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🏪 吃下这波让利",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 240;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._r117RepTrade = true;

          StateManager.addMessage(
            "你吃下商圈摊主的让利，落袋¥240，名声+4。",
            "success",
          );
        },
      },

      {
        text: "🤝 回请一顿",

        hint: "轻量 声望+",

        apply: function (st) {
          var rep = (st.reputation && st.reputation.commercialDist) || 0;

          if (st.reputation)
            st.reputation.commercialDist = Math.min(100, rep + 5);

          st.flags._r117RepTrade = true;

          StateManager.addMessage("你回请摊主们一顿，商圈声望+5。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r117_stress_morality", // 心理×道德

    phase: "street",

    icon: "🕊️",

    title: "心安才睡得着",

    story:
      "这些天你紧绷得厉害，偏又总惦记着良心那点事。夜里翻来覆去，你忽然想通：「钱要挣，但别挣得自己都看不起自己。」",

    // conditions：心理压力大 + 道德偏高（心理×道德空白区）

    conditions: function (st) {
      var stress =
        (st.player &&
          st.player.health &&
          st.player.health.mental &&
          st.player.health.mental.stress) ||
        0; // 检查 心理压力

      if (stress < 50) return false; // 检查 压力>=50

      if (typeof st.player.morality !== "number" || st.player.morality < 60)
        return false; // 检查 道德>=60

      if (st.flags && st.flags._r117StressMoral) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🕊️ 守住底线松口气",

        hint: "压力- 道德+",

        apply: function (st) {
          var m = st.player.health.mental;

          m.stress = Math.max(0, (m.stress || 0) - 15);

          st.player.morality = Math.min(100, (st.player.morality || 0) + 3);

          st.flags._r117StressMoral = true;

          StateManager.addMessage(
            "你决定守住底线，心里一块石头落了地，压力-15、道德+3。",
            "success",
          );
        },
      },

      {
        text: "😮‍💨 先不管那么多了",

        hint: "轻量 压力-",

        apply: function (st) {
          var m = st.player.health.mental;

          m.stress = Math.max(0, (m.stress || 0) - 8);

          st.flags._r117StressMoral = true;

          StateManager.addMessage(
            "你暂且把纠结放下，先让自己喘口气，压力-8。",
            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r118_actionfreq_coding_job", // 行为统计×技能×职业

    phase: "street",

    icon: "💻",

    title: "练出来的手感",

    story:
      "你断断续续把编程练出了手感，单位正好要搭个小工具，组长瞥见你敲的代码：「哟，这活儿你比外包靠谱。」",

    // conditions：编程训练频次 + 编程技能 + 有主业（行为统计×技能×职业空白区）

    conditions: function (st) {
      if (!st.stats || !st.stats.trainFreq) return false; // 检查 行为统计结构

      if ((st.stats.trainFreq.coding || 0) < 5) return false; // 检查 编程训练>=5次

      if (!st.skills) return false; // 检查 技能结构

      if (((st.skills.coding && st.skills.coding.level) || 0) < 10)
        return false; // 检查 编程>=10

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r118FreqCoding) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "💻 接下这工具",

        hint: "现金+ 编程xp+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 260;

          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 25;

          st.flags._r118FreqCoding = true;

          StateManager.addMessage(
            "你接下单位的工具活，落袋¥260，编程更溜了。",
            "success",
          );
        },
      },

      {
        text: "🧊 只帮个小忙",

        hint: "轻量 编程xp+",

        apply: function (st) {
          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 10;

          st.flags._r118FreqCoding = true;

          StateManager.addMessage("你只帮了个小忙，先攒点编程经验。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r118_driving_heatwave", // 技能×天气

    phase: "street",

    icon: "🚗",

    title: "热浪里的跑腿",

    story:
      "连日高温，街上没人愿意动，可外卖和急件反倒挤成了堆。你握着方向盘盘算：「这种天，会开车就是会印钱。」",

    // conditions：驾驶技能 + 热浪天气（技能×天气空白区）

    conditions: function (st) {
      if (!st.skills) return false; // 检查 技能结构

      if (((st.skills.driving && st.skills.driving.level) || 0) < 15)
        return false; // 检查 驾驶>=15

      if (!(st.weather && st.weather.current === "heatwave")) return false; // 检查 热浪

      if (st.flags && st.flags._r118DriveHeat) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🚗 顶着热浪跑单",

        hint: "现金+ 驾驶xp+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;

          if (st.skills && st.skills.driving)
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 20;

          st.needs.hygiene = Math.max(0, (st.needs.hygiene || 0) - 10);

          st.flags._r118DriveHeat = true;

          StateManager.addMessage(
            "你顶着热浪跑单，落袋¥300，驾驶更熟，就是一身汗。",
            "success",
          );
        },
      },

      {
        text: "🧊 跑两单就收",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 130;

          st.flags._r118DriveHeat = true;

          StateManager.addMessage("你跑两单就收手，小赚¥130，没累着。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r118_oldzhou_wholesale", // NPC×地点

    phase: "street",

    icon: "📦",

    title: "老周的进货经",

    story:
      "在批发市场撞见老周，他正跟人砍价，回头冲你招手：「来，这档口的货实在，我带你摸摸门道，别被人当生瓜蛋子宰。」",

    // conditions：结识老周 + 好感达标 + 在批发市场（NPC×地点空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.old_zhou; // 检查 老周关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 20) return false; // 检查 好感>=20

      if (!(st.trade && st.trade.currentLocation === "wholesaleMarket"))
        return false; // 检查 在批发市场

      if (st.flags && st.flags._r118OldZhou) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📦 跟着老周进货",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 220;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          var rel = st.relationships.old_zhou;

          rel.affinity = Math.min(100, (rel.affinity || 0) + 5);

          st.flags._r118OldZhou = true;

          StateManager.addMessage(
            "你跟着老周进了批好货，落袋¥220，名声+4、好感+5。",
            "success",
          );
        },
      },

      {
        text: "🤝 只记门道",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships.old_zhou;

          rel.affinity = Math.min(100, (rel.affinity || 0) + 8);

          st.flags._r118OldZhou = true;

          StateManager.addMessage(
            "你没急着进货，先把老周的门道记下了，好感+8。",
            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r119_english_typhoon", // 技能×天气

    phase: "street",

    icon: "🌪️",

    title: "台风里的翻译",

    story:
      "台风天，街角避风的外籍游客急得团团转，比划半天没人懂。你凑过去用半吊子外语帮着跟救援队搭上了话。",

    // conditions：英语技能 + 台风天气（技能×天气空白区）

    conditions: function (st) {
      if (!st.skills) return false; // 检查 技能结构

      if (((st.skills.english && st.skills.english.level) || 0) < 10)
        return false; // 检查 英语>=10

      if (!(st.weather && st.weather.current === "typhoon")) return false; // 检查 台风

      if (st.flags && st.flags._r119EngTyphoon) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🌪️ 帮到底",

        hint: "现金+ 英语xp+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 240;

          if (st.skills && st.skills.english)
            st.skills.english.xp = (st.skills.english.xp || 0) + 25;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);

          st.flags._r119EngTyphoon = true;

          StateManager.addMessage(
            "你帮外籍游客联络上救援，落袋¥240，英语+，名声+5。",
            "success",
          );
        },
      },

      {
        text: "🧊 帮个忙就走",

        hint: "轻量 英语xp+",

        apply: function (st) {
          if (st.skills && st.skills.english)
            st.skills.english.xp = (st.skills.english.xp || 0) + 10;

          st.flags._r119EngTyphoon = true;

          StateManager.addMessage("你帮完忙就撤了，先攒点英语经验。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r119_repair_sidehustle", // 技能×副业

    phase: "street",

    icon: "🔩",

    title: "摊车自己修",

    story:
      "你那副业的小摊车又吱呀作响，找人修不如自己上手。你蹲下捣鼓半天，竟把它调得比新的还顺溜。",

    // conditions：维修技能 + 副业摆摊中（技能×副业空白区）

    conditions: function (st) {
      if (!st.skills) return false; // 检查 技能结构

      if (((st.skills.repair && st.skills.repair.level) || 0) < 15)
        return false; // 检查 维修>=15

      if (!(
        st.sideHustle &&
        st.sideHustle.active &&
        st.sideHustle.type === "stall"
      ))
        return false; // 检查 摆摊副业

      if (st.flags && st.flags._r119RepairHustle) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🔩 顺手升级摊车",

        hint: "现金+ 维修xp+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 180;

          if (st.skills && st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 25;

          st.flags._r119RepairHustle = true;

          StateManager.addMessage(
            "你把摊车修好还升了级，多赚¥180，维修更熟。",
            "success",
          );
        },
      },

      {
        text: "🧊 只修不改",

        hint: "轻量 维修xp+",

        apply: function (st) {
          if (st.skills && st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 10;

          st.flags._r119RepairHustle = true;

          StateManager.addMessage("你只把摊车修好，先攒点维修经验。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "r119_sisterwu_fame", // NPC×名声

    phase: "street",

    icon: "📣",

    title: "吴姐替你吆喝",

    story:
      "你在街坊间有点名气了，吴姐在邻里群里替你发了条：「这后生靠谱，有活儿找他准没错。」底下唰唰点了一片赞。",

    // conditions：结识吴姐 + 好感达标 + 名声达标（NPC×名声空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_wu; // 检查 吴姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 20) return false; // 检查 好感>=20

      if (typeof st.player.fame !== "number" || st.player.fame < 20)
        return false; // 检查 名声>=20

      if (st.flags && st.flags._r119SisterWu) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📣 接下这波口碑",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);

          var rel = st.relationships.sister_wu;

          rel.affinity = Math.min(100, (rel.affinity || 0) + 5);

          st.flags._r119SisterWu = true;

          StateManager.addMessage(
            "你借吴姐的吆喝接了活，落袋¥200，名声+5、好感+5。",
            "success",
          );
        },
      },

      {
        text: "🤝 回请吴姐",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships.sister_wu;

          rel.affinity = Math.min(100, (rel.affinity || 0) + 8);

          st.flags._r119SisterWu = true;

          StateManager.addMessage("你回请吴姐吃了顿好的，好感+8。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "rainy_repair_wet_electronics",

    phase: "street",

    icon: "🌧️",

    title: "潮天修电器",

    story:
      "连阴雨返潮，街坊的电器一个个闹脾气。你懂电工，巷口排起小队：「师傅帮看看，一受潮就罢工。」",

    // conditions：天气 rainy + electrician 技能（天气×职业空白区）

    conditions: function (st) {
      if (st.weather.current !== "rainy") return false; // 检查 雨天

      var elec =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 检查 electrician 等级

      if (typeof elec !== "number" || elec < 10) return false; // 检查 electrician>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._wetElecSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🌧️ 上门修电器",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 380;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._wetElecSeen = true;

          StateManager.addMessage(
            "你冒雨上门修了一排受潮电器，落袋¥380，名声+4。",

            "success",
          );
        },
      },

      {
        text: "📦 只卖防潮件",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 130;

          st.flags._wetElecSeen = true;

          StateManager.addMessage(
            "你只帮人装防潮插座卖配件，落袋¥130，不出力。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "rainy_stall_shelter",

    phase: "street",

    icon: "🌧️",

    title: "雨天摆摊的棚子",

    story:
      "下起雨来，你的小摊眼看着要泡汤。隔壁摊主扔来一块塑料布：「雨天才显人情，搭上棚子还能多卖两单。」",

    // conditions：雨天 + 副业摆摊（天气系统 + 副业系统）

    conditions: function (st) {
      if (st.weather.current !== "rainy") return false; // 检查 雨天

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.sideHustle.type !== "stall") return false; // 检查 副业为摆摊

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._rainyStallSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "🌧️ 搭棚多卖",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 180;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          st.flags._rainyStallSeen = true;

          StateManager.addMessage(
            "你搭棚冒雨多卖两单，落袋¥180，名声+3。",

            "success",
          );
        },
      },

      {
        text: "📦 收摊避雨",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 1);

          st.flags._rainyStallSeen = true;

          StateManager.addMessage("你收摊避雨，邻居念你规矩，名声+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "repair_coding_sidegig",

    phase: "street",

    icon: "🛠️",

    title: "修电器兼写程序",

    story:
      "你既会修电器又懂代码，副业里两头接活，给小店做了台带智能屏的收银机。",

    // conditions：repair + coding 技能 + 副业进行中（技能协同 ∩ 副业）

    conditions: function (st) {
      var rp = st.skills && st.skills.repair && st.skills.repair.level; // 检查 repair 等级

      if (typeof rp !== "number" || rp < 10) return false; // 检查 repair>=10

      var cod = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof cod !== "number" || cod < 10) return false; // 检查 coding>=10

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._repairCodeSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🛠️ 接下改造",

        hint: "现金+ repair+ coding+",

        apply: function (st) {
          var s1 = st.skills.repair,
            s2 = st.skills.coding;

          s1.level = Math.min(100, s1.level + 1);

          s2.level = Math.min(100, s2.level + 1);

          st.resources.cash = (st.resources.cash || 0) + 260;

          st.flags._repairCodeSeen = true;

          StateManager.addMessage(
            "你给小店做智能收银机，repair+1、coding+1，落袋¥260。",

            "success",
          );
        },
      },

      {
        text: "🔧 只修不写",

        hint: "轻量 repair+",

        apply: function (st) {
          var s1 = st.skills.repair;

          s1.level = Math.min(100, s1.level + 1);

          st.flags._repairCodeSeen = true;

          StateManager.addMessage("你只接了维修活，repair+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "reputation_bank_loan_lowrate",

    phase: "street",

    icon: "🏦",

    title: "银行里的好名头",

    story:
      "你在银行圈名声不坏，陈行长念着这份信誉，主动给你背着的贷款降了点息。",

    // conditions：bank 声望 + 有银行贷款 + uncle_chen_bank 已结识（声望 ∩ 经济 ∩ NPC）

    conditions: function (st) {
      if (typeof (st.reputation && st.reputation.bank) !== "number" || st.reputation.bank < 30)
        return false; // 检查 银行声望

      if (
        typeof st.resources.bankDebt !== "number" ||
        st.resources.bankDebt <= 0
      )
        return false; // 检查 有贷款

      var rel = st.relationships && st.relationships["uncle_chen_bank"]; // 检查 uncle_chen_bank 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._bankRepLoanSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🏦 接受降息",

        hint: "贷款减负 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["uncle_chen_bank"];

          st.resources.bankDebt = Math.max(
            0,

            Math.round((st.resources.bankDebt || 0) * 0.93),
          ); // 减免7%

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._bankRepLoanSeen = true;

          StateManager.addMessage("陈行长给你贷款降息7%，好感+3。", "success");
        },
      },

      {
        text: "📉 只聊不办",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["uncle_chen_bank"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._bankRepLoanSeen = true;

          StateManager.addMessage("你和陈行长叙了旧，好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "reputation_bank_uncle_chen_invest",

    phase: "street",

    icon: "🏦",

    title: "陈叔引的路子",

    story: "你在银行攒下好名声，陈叔信你，引你走了一条稳妥的理财路子。",

    // conditions：银行声望 + uncle_chen_bank 已结识（声望 ∩ NPC ∩ 投资）

    conditions: function (st) {
      if (
        typeof (st.reputation && st.reputation.bank) !== "number" ||
        (st.reputation.bank || 0) < 40
      )
        return false; // 检查 银行声望>=40

      var rel = st.relationships && st.relationships["uncle_chen_bank"]; // 检查 uncle_chen_bank 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._chenInvestSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🏦 跟陈叔理财",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 220;

          var rel = st.relationships && st.relationships["uncle_chen_bank"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._chenInvestSeen = true;

          StateManager.addMessage(
            "你跟陈叔的理财路子落袋¥220，陈叔好感+2。",

            "success",
          );
        },
      },

      {
        text: "📋 先记门道",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["uncle_chen_bank"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._chenInvestSeen = true;

          StateManager.addMessage("你记下陈叔的门道，陈叔好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "reputation_slum_mutual_aid",

    phase: "street",

    icon: "🤝",

    title: "贫民区的互助",

    story:
      "你在贫民区人缘好，谁家揭不开锅都先想到你。这回几户凑了点米面过来：「你常帮人，这回轮到我们帮你。」",

    // conditions：贫民区声望高 + 饥饿（声望×需求空白区）

    conditions: function (st) {
      var rep = st.reputation && st.reputation.slum; // 检查 贫民区声望

      if ((rep || 0) < 40) return false; // 检查 声望>=40

      var hun = st.needs && st.needs.hunger; // 检查 饥饿

      if (typeof hun !== "number" || hun >= 35) return false; // 检查 饥饿<35（饿肚子）

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._slumMutualSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🤝 收下米面",

        hint: "现金+ 饥饿-",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          if (st.needs)
            st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 20); // 饥饿缓解

          st.flags._slumMutualSeen = true;

          StateManager.addMessage(
            "你收下邻里凑的米面，落袋¥200，肚子也缓过劲来，饥饿-20。",

            "success",
          );
        },
      },

      {
        text: "🍲 煮大锅饭",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 5); // 贫民区声望+

          st.flags._slumMutualSeen = true;

          StateManager.addMessage(
            "你把米面煮成大锅饭回请邻里，贫民区声望+5。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "reputation_slum_old_zhou_trust",

    phase: "street",

    icon: "🤝",

    title: "老周的人情账",

    story: "你在贫民区攒下了名声，老周信得过你，把一笔周转钱先垫给你应急。",

    // conditions：贫民区声望 + old_zhou 已结识（声望 ∩ NPC ∩ 经济）

    conditions: function (st) {
      if (
        typeof (st.reputation && st.reputation.slum) !== "number" ||
        (st.reputation.slum || 0) < 40
      )
        return false; // 检查 贫民区声望>=40

      var rel = st.relationships && st.relationships["old_zhou"]; // 检查 old_zhou 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._zhouTrustSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "🤝 收下周转",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          var rel = st.relationships && st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._zhouTrustSeen = true;

          StateManager.addMessage(
            "老周垫了你¥200周转，老周好感+3。",

            "success",
          );
        },
      },

      {
        text: "🙅 先不欠人情",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._zhouTrustSeen = true;

          StateManager.addMessage("你谢过老周的好意，老周好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "sister_wu_cooking_rep",

    phase: "street",

    icon: "🍲",

    title: "吴姐的灶台",

    story:
      "吴姐看你做饭像模像样，又念着你在商业区的好名声，邀你到她店里帮忙掌勺，包你练手又得名。",

    // conditions：sister_wu 已结识+好感 + cooking 技能 + commercialDist 声望（NPC ∩ 技能 ∩ 声望）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["sister_wu"]; // 检查 sister_wu 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      var ck = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof ck !== "number" || ck < 15) return false; // 检查 cooking>=15

      if (
        typeof (st.reputation && st.reputation.commercialDist) !== "number" ||
        st.reputation.commercialDist < 25
      )
        return false; // 检查 商业区声望

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._swCookSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🍲 去帮灶台",

        hint: "cooking+ 声望+",

        apply: function (st) {
          var s = st.skills.cooking;

          s.level = Math.min(100, s.level + 2);

          st.reputation.commercialDist =
            (st.reputation.commercialDist || 0) + 3;

          st.flags._swCookSeen = true;

          StateManager.addMessage(
            "你在吴姐灶台练手，cooking+2，商业区声望+3。",

            "success",
          );
        },
      },

      {
        text: "🙏 改日再学",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["sister_wu"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._swCookSeen = true;

          StateManager.addMessage("你谢过吴姐，好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "sister_wu_sales_partner",

    phase: "street",

    icon: "🤝",

    title: "吴姐的搭子",

    story:
      "吴姐做买卖有一套，看你会来事，邀你搭伙跑量：「你嘴皮子利，我有人脉货，咱俩凑一块儿稳赚。」",

    // conditions：sister_wu 已结识且好感达标 + sales 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["sister_wu"]; // 检查 sister_wu 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 30) return false; // 检查 好感>=30

      var sale = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof sale !== "number" || sale < 20) return false; // 检查 sales>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._sisterWuPartnerSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🤝 搭伙跑量",

        hint: "现金+ 名声+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["sister_wu"];

          st.resources.cash = (st.resources.cash || 0) + 470;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5); // 吴姐更信你

          st.flags._sisterWuPartnerSeen = true;

          StateManager.addMessage(
            "你跟吴姐搭伙跑量，落袋¥470，名声+4，吴姐好感+5。",

            "success",
          );
        },
      },

      {
        text: "📦 只代销",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 170;

          st.flags._sisterWuPartnerSeen = true;

          StateManager.addMessage(
            "你只帮吴姐代销拿提成，落袋¥170，不担本。",

            "info",
          );
        },
      },
    ],
  });
})();

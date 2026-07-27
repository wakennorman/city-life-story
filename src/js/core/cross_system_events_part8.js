// [全系统自洽修复] 域B R410 修复: 死字段 st.player.health.*(state无此对象,守卫永false压力效果静默失效)->st.personalGrowth.health.*; st.needs.health(needs无health)->st.status.health
/**
 * 跨系统联动事件 — 拆分片段 8/8（原 cross_system_events.js 机械拆分，行为不变）
 * 仅含自包含的 RANDOM_EVENTS.push 语句；顺序无关（事件选择走 phase 过滤+概率）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._crossPart8Loaded) return;
  RANDOM_EVENTS._crossPart8Loaded = true;

  RANDOM_EVENTS.push({
    id: "winter_year_end_reflection",
    phase: "street", // [全系统自洽修复] 域B 修复:phase "any"永不触发(引擎只认street/corporate)
    icon: "🎆",
    title: "又一年快过去了",
    story:
      "街上开始有人贴春联，超市里挂起了红灯笼。你算了一下——距离这一年结束，还有不到35天。\n\n你翻开自己的账本，对比年初的数字。有些东西变了，有些东西没变。城市在冬天里安静了一点，连街头巷尾的叫卖声都低了几分。\n\n你不知道明年会是什么样，但至少今年，你还在这里。",
    conditions: function (st) {
      if (st.flags._yearEndReflectionDone) return false;
      if (!st.weather || st.weather.season !== "winter") return false;
      var day = st.player.day || 0;
      // 每年第330天后触发（330~365，365后重置年份）
      var dayOfYear = ((day - 1) % 365) + 1;
      if (dayOfYear < 330) return false;
      return true;
    },
    probability: 0.15,
    repeatable: true,
    choices: [
      {
        text: "📊 仔细复盘这一年的得失",
        hint: "智力+5·解锁年度总结感悟",
        apply: function (st) {
          st.flags._yearEndReflectionDone = true;
          setTimeout(function () {
            st.flags._yearEndReflectionDone = false;
          }, 0);
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 5,
          );
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
          StateManager.addMessage(
            "📊 你认真复盘了这一年。有遗憾，有收获，但整体在往前走。智力+5，心情+8。",
            "success",
          );
        },
      },
      {
        text: "🍺 和朋友喝一杯，聊聊这一年",
        hint: "消费¥30·心情+20·社交感",
        apply: function (st) {
          st.flags._yearEndReflectionDone = true;
          setTimeout(function () {
            st.flags._yearEndReflectionDone = false;
          }, 0);
          var cost = 30;
          if ((st.resources.cash || 0) >= cost) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 20);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "🍺 你们聊了很久，从今年说到小时候，喝了不少。花了¥30，但值了。心情+20，名声+2。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🍺 口袋里钱不够请客，你一个人坐在路边发了会儿呆。",
              "info",
            );
          }
        },
      },
      {
        text: "🌃 一个人走走，吹吹冬风",
        hint: "清醒·心智+3·心情+5",
        apply: function (st) {
          st.flags._yearEndReflectionDone = true;
          setTimeout(function () {
            st.flags._yearEndReflectionDone = false;
          }, 0);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
          StateManager.addMessage(
            "🌃 你一个人走了很久，冬风把思绪吹清醒了。心智+3，心情+5。",
            "info",
          );
        },
      },
    ],
  });

  // R40-③ Corporate 年终述职困境 — corporate专属高张力事件
  RANDOM_EVENTS.push({
    id: "corporate_year_end_review",
    phase: "corporate",
    icon: "📋",
    title: "年终述职",
    story:
      "今天是年终述职日。你坐在台下等着叫到你的名字，手心微微出汗。\n\n隔壁部门的王总监已经把PPT做了50页，据说去年绩效是S+。你只做了15页，里面有三项指标没完成——原因你知道，但解释起来很难听。\n\n主持人叫到你的名字。你深吸一口气，站起来。",
    conditions: function (st) {
      if (st.flags._corpYearReviewDone) return false;
      if (!st.player || st.player.phase !== "corporate") return false;
      if (!st.employment || !st.employment.currentJob) return false;
      var day = st.player.day || 0;
      var dayOfYear = ((day - 1) % 365) + 1;
      if (dayOfYear < 300) return false;
      return true;
    },
    probability: 0.25,
    repeatable: true,
    choices: [
      {
        text: "📊 如实汇报，诚信应对",
        hint: "道德+8·概率晋升加分·上司好感+5",
        apply: function (st) {
          st.flags._corpYearReviewDone = true;
          setTimeout(function () {
            st.flags._corpYearReviewDone = false;
          }, 0);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 8);
          if (st.employment && st.employment.burnout !== undefined) {
            st.employment.burnout = Math.max(
              0,
              (st.employment.burnout || 0) - 5,
            );
          }
          if (st.flags) st.flags._reviewHonest = true;
          StateManager.addMessage(
            "📋 你如实汇报了，包括没完成的部分。上司点点头说：「诚实是最重要的品质。」道德+8，倦怠-5。",
            "success",
          );
        },
      },
      {
        text: "💼 包装数据，只讲成功",
        hint: "魅力+5·但道德-5·短期印象分+",
        apply: function (st) {
          st.flags._corpYearReviewDone = true;
          setTimeout(function () {
            st.flags._corpYearReviewDone = false;
          }, 0);
          st.player.charm = Math.min(100, (st.player.charm || 0) + 5);
          st.player.morality = Math.max(0, (st.player.morality || 50) - 5);
          StateManager.addMessage(
            "💼 你把能说的都说了，不能说的跳过去。台下掌声比别人响。魅力+5，道德-5。",
            "info",
          );
        },
      },
      {
        text: "🎯 主动请缨明年更高指标",
        hint: "勇气加分·心情-5（压力）·长期晋升概率+",
        apply: function (st) {
          st.flags._corpYearReviewDone = true;
          setTimeout(function () {
            st.flags._corpYearReviewDone = false;
          }, 0);
          st.flags._reviewAmbitious = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 3,
          );
          _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 50) - 5);
          StateManager.addMessage(
            "🎯 你当场提出明年目标再提30%。全场一静，然后上司眼睛亮了。智力+3，心情-5（压力增大）。",
            "warning",
          );
        },
      },
    ],
  });

  // R40-④ Corporate 职场站队 — corporate×同事关系
  RANDOM_EVENTS.push({
    id: "corporate_office_politics",
    phase: "corporate",
    icon: "⚔️",
    title: "站队时刻",
    story:
      "午饭时，市场部的陈经理把你叫到一边，压低声音说：「你知道技术部李总要被换掉的事吗？我这边正在整合资源，你跟着我走，好处少不了你的。」\n\n下午，技术部的老王也找到你：「陈那边的事你知道吧？别被他拉下水，他早晚出事。我这里稳得住，你安心跟着我。」\n\n两个人说的都头头是道，但你知道：只能站一边。",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.boss_li || !st.relationships.boss_li.met) return false; // [Layer3] 叙事涉及陈经理/李总
      if (st.flags._corpOfficePoliticsDone) return false;
      if (!st.player || st.player.phase !== "corporate") return false;
      if (!st.employment || !st.employment.currentJob) return false;
      var tenure = st.employment.tenureDays || 0;
      if (tenure < 30) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🤝 站陈经理那边",
        hint: "魅力+5·道德-3·赌一把",
        apply: function (st) {
          st.flags._corpOfficePoliticsDone = true;
          st.flags._sideWithChen = true;
          st.player.charm = Math.min(100, (st.player.charm || 0) + 5);
          st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
          StateManager.addMessage(
            "⚔️ 你选择了陈经理。他满意地拍拍你的肩：「明智。」道德-3，魅力+5。后续影响待定。",
            "info",
          );
        },
      },
      {
        text: "🛡️ 站老王那边",
        hint: "智力+5·道德+2·稳健选择",
        apply: function (st) {
          st.flags._corpOfficePoliticsDone = true;
          st.flags._sideWithWang = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 5,
          );
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          StateManager.addMessage(
            "🛡️ 你选了老王。他点点头：「踏实。」智力+5，道德+2。",
            "success",
          );
        },
      },
      {
        text: "😶 保持中立，两边都不得罪",
        hint: "道德+5·但两边都对你冷淡",
        apply: function (st) {
          st.flags._corpOfficePoliticsDone = true;
          st.flags._stayNeutral = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          if (st.employment && st.employment.burnout !== undefined) {
            st.employment.burnout = Math.min(
              100,
              (st.employment.burnout || 0) + 8,
            );
          }
          StateManager.addMessage(
            "😶 你两边都没站。两个人后来见到你，都只点头不说话。道德+5，倦怠+8（夹心饼的压力）。",
            "warning",
          );
        },
      },
    ],
  });

  // ====================================================================
  // v3.83 loop R41 新增事件（4个：装备磨损/城管关系/教育认证/社区聚会）
  // ====================================================================

  // R41-① 装备关键时刻损坏 — 装备系统×天气×工作联动
  RANDOM_EVENTS.push({
    id: "gear_break_critical_moment",
    phase: "street",
    icon: "🔧",
    title: "装备在关键时刻坏了",
    story:
      "你正忙着手头的活计，突然「咔嚓」一声——用了很久的工具终于撑不住了。\n\n手套磨破了口子，鞋底彻底裂开，或者背包带子断了。总之，这件陪你风里来雨里去的装备，在这一刻正式宣告退役。\n\n你蹲下来看着它，有点心疼——不是因为它多值钱，而是因为它陪你扛过了最难的那段日子。",
    conditions: function (st) {
      // [自洽修复] 需要装备系统中有低耐久装备
      var inst = st.inventory && st.inventory.equipmentInstances;
      if (!inst) return false;
      var hasLowDurability = false;
      for (var slot in inst) {
        if (
          inst[slot] &&
          typeof inst[slot].durability === "number" &&
          inst[slot].durability < 30
        ) {
          hasLowDurability = true;
          break;
        }
      }
      if (!hasLowDurability) return false;
      if (st.flags._gearBreakSeen) return false;
      if (st.player.day < 20) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🔨 想办法修修，凑合再用",
        hint: "修理技能≥15 能用",
        apply: function (st) {
          st.flags._gearBreakSeen = true;
          var repairLvl =
            st.skills && st.skills.repair ? st.skills.repair.level || 0 : 0;
          if (repairLvl >= 15) {
            // 修好了
            for (var slot in (st.inventory &&
              st.inventory.equipmentInstances) ||
              {}) {
              var eq = st.inventory.equipmentInstances[slot];
              if (eq && eq.durability < 30) {
                eq.durability = Math.min(100, eq.durability + 30);
              }
            }
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 15;
            StateManager.addMessage(
              "🔨 你凭着手艺勉强修好了。虽然不太好看，但还能撑一阵子。修理XP+15。",
              "success",
            );
          } else {
            _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 50) - 5);
            StateManager.addMessage(
              "🔨 你试着修了修，但手艺不行，越弄越糟。只好等有钱再换新的。心情-5。",
              "warning",
            );
          }
        },
      },
      {
        text: "💰 攒钱买新的吧，旧的扔了",
        hint: "心情-10·激励赚钱",
        apply: function (st) {
          st.flags._gearBreakSeen = true;
          // 移除所有低耐久装备
          if (st.inventory && st.inventory.equipmentInstances) {
            for (var slot in st.inventory.equipmentInstances) {
              if (
                st.inventory.equipmentInstances[slot] &&
                st.inventory.equipmentInstances[slot].durability < 30
              ) {
                delete st.inventory.equipmentInstances[slot];
              }
            }
          }
          _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 50) - 10);
          st.flags._needBuyNewGear = true;
          StateManager.addMessage(
            "📦 你叹了口气，把旧装备扔进了垃圾桶。它陪了你很久，你甚至有点舍不得。心情-10。得赶紧赚钱买新的了。",
            "warning",
          );
        },
      },
      {
        text: "🙏 凑合着用，还能撑",
        hint: "免费·但效率降低",
        apply: function (st) {
          st.flags._gearBreakSeen = true;
          // 耐久继续下降但不处理
          _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 50) - 3);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "🙏 你把破的地方打了个结，继续用。穷人的智慧就是——什么都能将就。心智+3，心情-3。",
            "info",
          );
        },
      },
    ],
  });

  // R41-② 城管关系改善机会 — chengguan系统×好感反馈
  RANDOM_EVENTS.push({
    id: "chengguan_relationship_help",
    phase: "street",
    icon: "👮",
    title: "城管的通融",
    story:
      "你正在街边整理摊位，一辆执法车停在了不远处。你心里一紧——但车上的老城管探出头来，居然是上次打过交道的那个。\n\n他冲你点了点头：「今天上面来检查，这一片下午三点前不能摆。你去后街那边，我跟那边打过招呼了。」\n\n旁边的小贩投来羡慕的目光。你意识到——平时攒下的那点关系，有时候比钱管用。",
    conditions: function (st) {
      // [自洽修复] chengguan关系好时触发
      if (!st.chengguan) return false;
      if ((st.chengguan.relationship || 0) < 25) return false;
      if (st.flags && st.flags._chengguanHelpSeen) return false;
      if ((st.chengguan.heat || 0) < 30) return false;
      if (st.player.day < 15) return false;
      return true;
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "🙏 谢谢！马上搬",
        hint: "城管关系+5·免于处罚",
        apply: function (st) {
          st.flags._chengguanHelpSeen = true;
          st.chengguan.relationship = Math.min(
            100,
            (st.chengguan.relationship || 0) + 5,
          );
          st.chengguan.warnings = Math.max(0, (st.chengguan.warnings || 0) - 1);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
          StateManager.addMessage(
            "🙏 你赶紧收摊。搬到后街果然没人管，还多卖了两个钟头。城管关系+5，警告-1，心情+5。关系真的有用。",
            "success",
          );
        },
      },
      {
        text: "🍵 给他递瓶水",
        hint: "城管关系+10·¥5",
        cost: 5,
        apply: function (st) {
          st.flags._chengguanHelpSeen = true;
          st.chengguan.relationship = Math.min(
            100,
            (st.chengguan.relationship || 0) + 10,
          );
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
          StateManager.addMessage(
            "🍵 你递了瓶水过去。他愣了一下，接过去说：「行了，赶紧搬吧。」旁边的同行看着，有人悄悄记下了你的脸。城管关系+10，心情+8，花费¥5。",
            "success",
          );
        },
      },
      {
        text: "😅 今天太累了，收摊不摆了",
        hint: "安全第一·无损失",
        apply: function (st) {
          st.flags._chengguanHelpSeen = true;
          st.chengguan.warnings = Math.max(0, (st.chengguan.warnings || 0) - 1);
          _guardNeedsP8(st).fatigue = Math.max(0, (_guardNeedsP8(st).fatigue || 50) - 8);
          StateManager.addMessage(
            "😅 你跟城管打了招呼，收摊回去了。他冲你摆摆手：「明儿早点来。」有时候，听劝比硬扛聪明。疲劳-8，警告-1。",
            "info",
          );
        },
      },
    ],
  });

  // R41-③ 教育改变人生 — 学历认证带来工作机会
  RANDOM_EVENTS.push({
    id: "education_opening_door",
    phase: "street",
    icon: "🎓",
    title: "学历带来的机会",
    story:
      "你在街上闲逛时，手机响了。是一个陌生号码。\n\n「你好，我们在人才网上看到了你的学历信息，这边有一份工作觉得你很合适……」\n\n你愣了一下——你确实在某天无聊时填过一份简历，之后就忘了这回事。没想到，当时随手填的学历信息，居然真的有人看到了。\n\n电话那头继续说：「岗位是XX公司的初级文员，带培训，月薪¥4500起。」",
    conditions: function (st) {
      // [自洽修复] 学历≥本科(1) + 未在职 + 天数适中
      if ((st.player.education || 0) < 1) return false;
      if (st.employment && st.employment.currentJob) return false;
      if (st.flags && st.flags._educationDoorOpened) return false;
      if (st.player.day < 30 || st.player.day > 300) return false;
      if (st.player.phase !== "street") return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🎯 约面试时间",
        hint: "智力+3·收入提升机会",
        apply: function (st) {
          st.flags._educationDoorOpened = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 3,
          );
          st.flags._educationJobOffer = true;
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
          StateManager.addMessage(
            "🎯 你约了下周面试。挂了电话，你看着手机屏幕——大专文凭在别人眼里可能是废纸，但在这座城市，它可能就是一把钥匙。智力+3，心情+8。",
            "success",
          );
        },
      },
      {
        text: "🤔 先问问工资待遇再说",
        hint: "了解更多·不承诺",
        apply: function (st) {
          st.flags._educationDoorOpened = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "🤔 你多问了几句——五险一金、双休、带薪培训。听起来不错，但你知道没有天上掉馅饼的事。先记下来，回头再说。心智+3。",
            "info",
          );
        },
      },
      {
        text: "😅 现在没空，以后再联系",
        hint: "不改变现状",
        apply: function (st) {
          st.flags._educationDoorOpened = true;
          st.flags._educationOfferDeferred = true;
          StateManager.addMessage(
            "😅 你说现在不太方便，对方说没关系，让你有空再联系。你挂了电话，心里有点五味杂陈——也许下次机会就没这么容易了。",
            "info",
          );
        },
      },
    ],
  });

  // R41-④ 社区熟人网络 — 认识多个NPC后的邻里聚会
  RANDOM_EVENTS.push({
    id: "community_gathering_invite",
    phase: "street",
    icon: "🏘️",
    title: "邻里聚会邀请",
    story:
      "傍晚，你在门口看到一张手写的告示：「本周末巷口举办社区聚餐，各家带一道菜来！」\n\n你正看着，背后有人拍了拍你的肩膀——是楼上住了半年但只在楼道见过几次的大姐。\n\n她笑着说：「你也来吧！不用带什么，人都来就行。巷子里的人想认识认识你——住了大半年了，大家只知道你是'那个年轻人'。」\n\n你这才意识到，虽然在这里住了这么久，但除了打招呼的面孔，你真的还没好好认识过这些邻居。",
    conditions: function (st) {
      // [自洽修复] 认识至少3个NPC + 非流浪状态
      if (!st.relationships) return false;
      var metCount = 0;
      for (var r in st.relationships) {
        if (st.relationships[r] && st.relationships[r].met) metCount++;
      }
      if (metCount < 3) return false;
      if (st.flags._communityGatheringSeen) return false;
      if (st.player.day < 30) return false;
      // 需要住所
      if ((st.resources.housing || "").indexOf("homeless") >= 0) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🍲 带一道菜去参加",
        hint: "名气+·心情+·社交圈+",
        apply: function (st) {
          st.flags._communityGatheringSeen = true;
          // [全系统自洽修复] 域B 修复: st.fame 应为 st.player.fame（裸根导致名气+3失效）
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 12);
          st.needs.hunger = Math.max(0, (st.needs.hunger || 50) - 15);
          // 所有已认识NPC好感+2
          if (st.relationships) {
            for (var r in st.relationships) {
              if (st.relationships[r] && st.relationships[r].met) {
                st.relationships[r].affinity = Math.min(
                  100,
                  (st.relationships[r].affinity || 0) + 2,
                );
              }
            }
          }
          StateManager.addMessage(
            "🍲 你带了一锅番茄炒蛋去了。虽然简单，但大家都说好吃。席间认识了楼下修车的张师傅和对面的保洁阿姨——这座城市又暖和了一点。名气+3，心情+12，邻里好感+2。",
            "success",
          );
        },
      },
      {
        text: "👋 去坐坐聊聊天就好",
        hint: "心情+·社交",
        apply: function (st) {
          st.flags._communityGatheringSeen = true;
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
          if (st.relationships) {
            for (var r in st.relationships) {
              if (st.relationships[r] && st.relationships[r].met) {
                st.relationships[r].affinity = Math.min(
                  100,
                  (st.relationships[r].affinity || 0) + 1,
                );
              }
            }
          }
          StateManager.addMessage(
            "👋 你空着手去了。大家没在意——给你夹菜、递饮料。你坐在角落听着他们聊家长里短，第一次觉得自己不是这个城市的过客。心情+8，邻里好感+1。",
            "info",
          );
        },
      },
      {
        text: "📦 在屋里待着，不去",
        hint: "独处·不社交",
        apply: function (st) {
          st.flags._communityGatheringSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          StateManager.addMessage(
            "📦 你待在屋里，听着外面的热闹声。一个人也挺好，但你心里清楚——城市里的人情，不是靠躲出来的。心智+4。",
            "neutral",
          );
        },
      },
    ],
  });

  // ====================================================================
  // v3.83 loop R41 注册完毕（4个：装备磨损/城管关系/教育认证/社区聚会）
  // ====================================================================

  // ====================================================================
  // v3.88d loop R42 — 4个高影响联动事件
  // 空白区：社交深度(1→2) / 道德回响(4→5) / 装备品质(1→2) / 天气情境(3→4)
  // ====================================================================

  // 事件1：NPC人生故事 — 好感≥80触发深度对话
  // [自洽修复] conditions 校验：NPC好感≥80 + met + day≥50
  // 设计意图：NPC好感突破阈值后解锁"人生故事"对话，让NPC从功能提供者变成有血有肉的人
  // 联动系统：NPC关系 + 属性成长（心智+5永久）+ 禀赋效应（珍视深度关系）
  RANDOM_EVENTS.push({
    id: "social_npc_life_story",
    phase: "street",
    icon: "📖",
    title: "深夜的人生故事",
    story:
      "加完班回家，你在巷口碰见了熟悉的面孔。对方难得没在忙，一个人坐在台阶上抽烟/织毛衣。看到你，招了招手：\n\n「来，坐会儿。」\n\n也许是今晚太安静了，也许是你从来没问过——对方第一次讲起了自己的故事。那些年的不容易，那些没能实现的梦，那些放下又拿起来的执念。\n\n你听着，才发现这个每天跟你点头的人，原来也有一段人生。",
    conditions: function (st) {
      // [Layer3] 叙事涉及加班，需有工作
      if (!st.career || !st.career.currentJob) return false;
      // [自洽修复] 检查是否有任意NPC好感≥80且已结识
      if (!st.relationships) return false;
      var hasDeepBond = false;
      for (var nid in st.relationships) {
        var rel = st.relationships[nid];
        if (rel && rel.met && (rel.affinity || 0) >= 80) {
          hasDeepBond = true;
          break;
        }
      }
      if (!hasDeepBond) return false;
      if (st.player.day < 50) return false; // 中后期才触发
      if (st.flags._npcLifeStorySeen) return false; // 一次性
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "👂 安静听他说完",
        hint: "心智+5，好感+10",
        apply: function (st) {
          st.flags._npcLifeStorySeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          // 所有好感≥80的NPC好感+10
          for (var nid in st.relationships) {
            var rel = st.relationships[nid];
            if (rel && rel.met && (rel.affinity || 0) >= 80) {
              rel.affinity = Math.min(100, (rel.affinity || 0) + 10);
            }
          }
          StateManager.addMessage(
            "📖 你安静地听完了他的故事。那些年的不容易，让你对自己的困境也有了新的看法。心智+5，你们的关系更深了一层。",
            "success",
          );
        },
      },
      {
        text: "🤝 也分享自己的故事",
        hint: "双向交心，心智+8",
        apply: function (st) {
          st.flags._npcLifeStorySeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 10);
          for (var nid in st.relationships) {
            var rel = st.relationships[nid];
            if (rel && rel.met && (rel.affinity || 0) >= 80) {
              rel.affinity = Math.min(100, (rel.affinity || 0) + 15);
            }
          }
          StateManager.addMessage(
            "🤝 你也讲了自己的故事。两个在城市里漂泊的人，今晚靠得更近了。心智+8，心情+10，好感+15。",
            "success",
          );
        },
      },
      {
        text: "😅 聊几句就回去休息",
        hint: "礼貌但疏离",
        apply: function (st) {
          st.flags._npcLifeStorySeen = true;
          _guardNeedsP8(st).fatigue = Math.max(0, (_guardNeedsP8(st).fatigue || 50) - 5);
          StateManager.addMessage(
            "😅 你聊了几句就回去了。对方笑了笑说「早点休息」。有些故事，也许下次吧。疲劳-5。",
            "info",
          );
        },
      },
    ],
  });

  // 事件2：道德回响 — 曾经的选择在多年后回响
  // [自洽修复] conditions 校验：之前做过道德选择（有相关flag）+ day≥40
  // 设计意图：之前的道德选择产生长期回响，让玩家感受到"选择有后果"
  // 联动系统：道德系统 + flag历史 + 损失厌恶 + 社会认同
  RANDOM_EVENTS.push({
    id: "moral_choice_long_echo",
    phase: "street",
    icon: "🔔",
    title: "多年前的那个选择",
    story:
      "你在街上走着，突然被一个声音叫住。\n\n「哎——是你吗？！」\n\n你转过身，看着面前这张似曾相识的脸，一时没认出来。对方激动地走过来，一把抓住你的手：\n\n「你可能不记得了，前几年你捡到一个钱包交给了派出所——那里面有我母亲的救命钱！后来派出所找到我，我赶到医院时还好没耽误。我现在在城里站稳了脚跟，一直想找到你……」\n\n说着，对方从兜里掏出一个红包，硬往你手里塞。",
    conditions: function (st) {
      // [自洽修复] 检查玩家是否做过"归还钱包"的道德选择
      if (!st.flags) return false;
      var didGoodDeed =
        st.flags._returnedWallet ||
        st.flags._returnedFoundMoney ||
        st.flags._helpedOldMan ||
        st.flags._donatedToCharity ||
        st.flags._volunteerWork;
      if (!didGoodDeed) return false;
      if (st.player.day < 40) return false; // 需要时间发酵
      if (st.flags._moralEchoSeen) return false; // 一次性
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "💰 收下红包",
        hint: "¥500-1500，名气+5",
        apply: function (st) {
          st.flags._moralEchoSeen = true;
          var reward = Random.int(500, 1500);
          st.resources.cash = (st.resources.cash || 0) + reward;
          st.resources.totalEarned += reward;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          StateManager.addMessage(
            "💰 你收下红包，对方连声道谢。好人有好报——这笔¥" +
              reward.toLocaleString() +
              "的意外之财让你相信，这座城市不会忘记善良的人。名气+5。",
            "success",
          );
        },
      },
      {
        text: "🙏 红包拿走，转捐掉",
        hint: "名气+10，道德+",
        apply: function (st) {
          st.flags._moralEchoSeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 8);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 15);
          StateManager.addMessage(
            "🙏 你把红包转捐给了社区互助基金。对方看着你，眼里多了几分敬意。名气+10，道德+8，心情+15。",
            "success",
          );
        },
      },
      {
        text: "🤝 请对方吃顿饭就好",
        hint: "人情+，关系网扩展",
        apply: function (st) {
          st.flags._moralEchoSeen = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 80);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 10);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          // 解锁人脉网络标记
          st.flags._moralNetworkUnlocked = true;
          StateManager.addMessage(
            "🤝 你在路边小馆请对方吃了顿饭。两人聊了一晚上——他给你介绍了几个城里的朋友。名气+3，心情+10，人脉+1。",
            "success",
          );
        },
      },
    ],
  });

  // 事件3：废品站淘宝 — 装备品质深度联动
  // [自洽修复] conditions 校验：repair技能≥25 + 在废品站/批发市场 + day≥20
  // 设计意图：专业技能赋予"淘宝"能力，让玩家感受成长带来的世界观变化
  // 联动系统：装备品质 + 技能门槛 + 位置 + 经济
  RANDOM_EVENTS.push({
    id: "equipment_scrap_treasure",
    phase: "street",
    icon: "🔍",
    title: "废品堆里的宝贝",
    story:
      "你在废品站翻找能卖钱的东西，手碰到一个沉甸甸的金属盒子。擦掉灰尘一看——是一台老式电动工具，外壳有磕碰但齿轮咬合依然紧密。\n\n你试着通电转了转，马达声音平稳。这种老牌子现在都停产了，二手市场上有的是人抢着要。\n\n废品站老板瞥了一眼：「那个啊，¥500拿走。放这儿占地方。」",
    conditions: function (st) {
      // [自洽修复] 检查repair技能≥25（有专业眼光识别价值）
      if (!st.skills || !st.skills.repair) return false;
      if ((st.skills.repair.level || 0) < 25) return false;
      // 检查当前位置是废品站或批发市场
      var loc = st.trade && st.trade.currentLocation;
      if (loc !== "scrapStation" && loc !== "wholesaleMarket" && loc !== "slum")
        return false;
      if (st.player.day < 20) return false;
      if (st.flags._scrapTreasureSeen) return false; // 一次性
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "💰 ¥500拿下，转手卖高价",
        hint: "净赚¥300-800",
        apply: function (st) {
          st.flags._scrapTreasureSeen = true;
          if ((st.resources.cash || 0) < 500) {
            StateManager.addMessage(
              "💰 翻遍口袋只有¥" +
                st.resources.cash +
                "。老板摇摇头：「下次带够钱再来。」",
              "warning",
            );
            return;
          }
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          var profit = Random.int(300, 800);
          st.resources.cash = (st.resources.cash || 0) + profit + 500; // 卖出价=成本+利润
          st.resources.totalEarned += profit;
          st.skills.repair.xp = (st.skills.repair.xp || 0) + 20;
          StateManager.addMessage(
            "🔍 你花¥500拿下，转手卖了¥" +
              (profit + 500).toLocaleString() +
              "。净赚¥" +
              profit +
              "！专业眼光就是印钞机。修理XP+20。",
            "success",
          );
        },
      },
      {
        text: "🔧 留着自己用",
        hint: "修理XP+40，装备耐久恢复",
        apply: function (st) {
          st.flags._scrapTreasureSeen = true;
          if ((st.resources.cash || 0) < 500) {
            StateManager.addMessage("🔧 钱不够，只能看着别人买走。", "warning");
            return;
          }
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          st.skills.repair.xp = (st.skills.repair.xp || 0) + 40;
          // 恢复一件装备的耐久
          var eq = st.inventory && st.inventory.equipmentInstances;
          if (eq) {
            for (var slot in eq) {
              if (eq[slot] && eq[slot].durability < 80) {
                eq[slot].durability = Math.min(
                  100,
                  (eq[slot].durability || 50) + 30,
                );
                break;
              }
            }
          }
          StateManager.addMessage(
            "🔧 你花¥500买下自己用。拆开研究了一晚上，修理技术又精进了不少。修理XP+40，一件装备耐久+30。",
            "success",
          );
        },
      },
      {
        text: "🚶 不稀罕，继续翻别的",
        hint: "保守选择",
        apply: function (st) {
          st.flags._scrapTreasureSeen = true;
          StateManager.addMessage(
            "🚶 你放下工具继续翻别的。不是所有的机会都值得抓。",
            "info",
          );
        },
      },
    ],
  });

  // 事件4：大雾中的陌生人 — 天气+道德+位置联动
  // [自洽修复] conditions 校验：weather=foggy/heavy_smog + day≥15 + 不在住所
  // 设计意图：极端天气下遇到需要帮助的人，制造道德困境
  // 联动系统：天气 + 道德 + 需求消耗 + 社会支持
  RANDOM_EVENTS.push({
    id: "weather_fog_stranger_lost",
    phase: "street",
    icon: "🌫️",
    title: "大雾中的问路人",
    story:
      "今天的雾特别大，能见度不到十米。街灯在雾里晕成一团模糊的光。\n\n你裹紧衣服走在路上，突然听到旁边传来一个焦急的声音：\n\n「不好意思——请问XX路怎么走？我手机没电了，在这转了半小时了……」\n\n你顺着声音看过去，是一个背着大包的外地人，脸上写满了疲惫和迷茫。雾太大了，连路牌都看不清。",
    conditions: function (st) {
      // [自洽修复] 检查天气为雾霾或重度雾霾
      var w = st.weather && st.weather.current;
      if (w !== "foggy" && w !== "heavy_smog") return false;
      if (st.player.day < 15) return false;
      if (st.flags._fogStrangerSeen) return false; // 一次性
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🤝 带他走到大路上",
        hint: "疲劳+10，道德+，名气+",
        apply: function (st) {
          st.flags._fogStrangerSeen = true;
          _guardNeedsP8(st).fatigue = Math.min(100, (_guardNeedsP8(st).fatigue || 50) + 10);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          // 15%概率获得意外回报
          if (Random.chance(0.15)) {
            var tip = Random.int(50, 150);
            st.resources.cash = (st.resources.cash || 0) + tip;
            StateManager.addMessage(
              "🤝 你带他走了二十分钟到大路。他千恩万谢，硬塞给你¥" +
                tip +
                "。好人有好报。疲劳+10，道德+5，名气+3。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🤝 你带他走了二十分钟到大路。他连声道谢，消失在雾里。你转身继续赶路——能帮助一个人，今晚没白累。疲劳+10，道德+5，名气+3。",
              "success",
            );
          }
        },
      },
      {
        text: "🗺️ 给他指个方向",
        hint: "低成本帮助",
        apply: function (st) {
          st.flags._fogStrangerSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          StateManager.addMessage(
            "🗺️ 你指着雾里隐约可见的路牌方向：「往左拐，看到红绿灯右转。」他将信将疑地走了。你希望他没走错。道德+2。",
            "info",
          );
        },
      },
      {
        text: "😰 雾太大，自顾不暇",
        hint: "自保优先",
        apply: function (st) {
          st.flags._fogStrangerSeen = true;
          _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 50) - 5);
          StateManager.addMessage(
            "😰 你摆摆手快步走开。雾太大了，你自己都看不清路。心里有点过意不去，但自保要紧。心情-5。",
            "warning",
          );
        },
      },
    ],
  });

  // ====================================================================
  // v3.88d loop R42 注册完毕（4个：NPC人生故事/道德回响/废品淘宝/雾中问路）
  // ====================================================================

  // ====== 事件1：NPC关系调解——王婶×张姐的紧张关系 ======
  // 设计意图：NPC_RELATION_MATRIX 中 aunt_wang↔sister_zhang 为"strained"，
  // 玩家首次同时认识两人后，有机会调解城中村最棘手的邻里矛盾
  RANDOM_EVENTS.push({
    id: "npc_auntwang_zhang_mediation",
    phase: "street",
    icon: "🤝",
    title: "婆婆和中介",
    story:
      "你刚走进巷子，就听见王大婶扯着嗓子在骂人——对面站着的竟是张姐，脸涨得通红。\\n\\n「你还有脸来？上次你给我介绍的那个租客，住了三个月跑了，押金还不够修水管的！」王大婶叉着腰。\\n\\n张姐也不甘示弱：「那租客背景我查过了，是你自己没签合同！我中介费都没收齐呢！」\\n\\n两人同时看到了你，同时开口：「你来得正好，你来评评理！」",
    conditions: function (st) {
      if (!st.relationships) return false;
      var aw = st.relationships.aunt_wang;
      var sz = st.relationships.sister_zhang;
      if (!aw || !aw.met || !sz || !sz.met) return false;
      if ((aw.affinity || 0) < 40 || (sz.affinity || 0) < 40) return false;
      if (st.player.day < 60) return false;
      if (st.flags._auntZhangMediationSeen) return false;
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "🧠 当和事佬，各打五十大板",
        hint: "需心智≥35，同时提升两人好感",
        apply: function (st) {
          st.flags._auntZhangMediationSeen = true;
          if ((st.player.mental || 0) >= 35) {
            st.relationships.aunt_wang.affinity = Math.min(
              100,
              (st.relationships.aunt_wang.affinity || 40) + 8,
            );
            st.relationships.sister_zhang.affinity = Math.min(
              100,
              (st.relationships.sister_zhang.affinity || 40) + 8,
            );
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 10);
            st.flags._auntZhangMediated = true;
            StateManager.addMessage(
              "🧠 你分别听两人说完，不急不慢地分析：「大婶，合同的事不能怪张姐；张姐，你也没提醒人家签合同。各退一步，这顿我请。」两人面面相觑，最后都笑了。王大婶好感+8，张姐好感+8，心智+3，名气+3。",
              "success",
            );
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "aunt_zhang_payoff", 30, "street");
            }
          } else {
            st.relationships.aunt_wang.affinity = Math.max(
              0,
              (st.relationships.aunt_wang.affinity || 40) - 3,
            );
            st.relationships.sister_zhang.affinity = Math.max(
              0,
              (st.relationships.sister_zhang.affinity || 40) - 3,
            );
            StateManager.addMessage(
              "🧠 你想劝架，但说出来的话两边都不爱听。两人都甩手走了。好感各-3。",
              "warning",
            );
          }
        },
      },
      {
        text: "👩 帮王大婶说话",
        hint: "王婶好感+10，张姐好感-15",
        apply: function (st) {
          st.flags._auntZhangMediationSeen = true;
          st.relationships.aunt_wang.affinity = Math.min(
            100,
            (st.relationships.aunt_wang.affinity || 40) + 10,
          );
          st.relationships.sister_zhang.affinity = Math.max(
            0,
            (st.relationships.sister_zhang.affinity || 40) - 15,
          );
          _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 50) - 5);
          StateManager.addMessage(
            "👩 你站在王大婶这边。张姐脸一沉，转身走了。王婶好感+10，张姐好感-15。",
            "warning",
          );
        },
      },
      {
        text: "👩‍💼 帮张姐说话",
        hint: "张姐好感+10，王婶好感-15",
        apply: function (st) {
          st.flags._auntZhangMediationSeen = true;
          st.relationships.sister_zhang.affinity = Math.min(
            100,
            (st.relationships.sister_zhang.affinity || 40) + 10,
          );
          st.relationships.aunt_wang.affinity = Math.max(
            0,
            (st.relationships.aunt_wang.affinity || 40) - 15,
          );
          _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 50) - 5);
          StateManager.addMessage(
            "👩‍💼 你帮张姐说了几句话。王大婶气得摔门进屋。张姐好感+10，王婶好感-15。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== 事件2：百日匠人——同一工作坚持100天 ======
  RANDOM_EVENTS.push({
    id: "career_hundred_day_master",
    phase: "street",
    icon: "🏅",
    title: "百日匠人",
    story:
      "今天是你在这份工作上干的第一百天。\\n\\n没人给你庆祝，没人发奖金——但你自己知道，这一百天里你学会了什么。\\n\\n刚来的时候，你连工具都拿不稳。现在闭上眼睛都能把活干完。老板开始让你带新人，客户开始指定要你。\\n\\n你站在工作的位置上，忽然觉得——这座城市，开始认可你了。",
    conditions: function (st) {
      if (!st.career || !st.career.currentJob) return false;
      if ((st.career.currentJob.workDays || 0) < 100) return false;
      if (st.flags._hundredDayMasterSeen) return false;
      return true;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "📝 默默记下这个里程碑",
        hint: "心智+5，获得'百日匠人'flag",
        apply: function (st) {
          st.flags._hundredDayMasterSeen = true;
          st.flags._hundredDayMaster = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 15);
          StateManager.addMessage(
            "📝 你在手机备忘录里记下：「第100天。」你看着窗外，这座城市有千万个打工的人——你是其中之一，但你坚持了一百天。心智+5，心情+15。",
            "success",
          );
        },
      },
      {
        text: "📸 发个朋友圈记录",
        hint: "名气+5，可能收到问候",
        apply: function (st) {
          st.flags._hundredDayMasterSeen = true;
          st.flags._hundredDayMaster = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 12);
          StateManager.addMessage(
            "📸 你发了条朋友圈，收获了二十几个赞。名气+5，心情+12。",
            "success",
          );
        },
      },
      {
        text: "🍜 给自己加个菜庆祝",
        hint: "花费¥30，心情+20",
        apply: function (st) {
          st.flags._hundredDayMasterSeen = true;
          st.flags._hundredDayMaster = true;
          var cost = Math.min(30, st.resources.cash || 0);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
          st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 20);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 20);
          StateManager.addMessage(
            "🍜 你去了常去的那家面馆，点了一碗最贵的牛肉面。老板娘认得你，给你多加了一块肉。心情+20，饥饿+20。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 事件3：百万财富里程碑——人生第一个100万 ======
  RANDOM_EVENTS.push({
    id: "wealth_million_milestone",
    phase: "street",
    icon: "💎",
    title: "百万时刻",
    story:
      "你坐在出租屋里，算了一笔账。\\n\\n从第一天来到这座城市起，你搬过砖、送过外卖、摆过摊、熬过夜、吃过亏、也赚过钱。\\n\\n那些¥20、¥50、¥100攒起来的数字，今天终于跨过了一个门槛——你在这座城市里，赚到了第一个一百万。\\n\\n不是存款，是流水。但这一百万，每一分都是你亲手挣的。",
    conditions: function (st) {
      if (!st.housing || st.housing.tier < 1) return false; // [Layer3] 叙事涉及出租屋
      if (!st.resources) return false;
      var totalEarned = st.resources.totalEarned || 0;
      if (totalEarned < 1000000) return false;
      if (st.flags._millionMilestoneSeen) return false;
      if (st.player.day < 100) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🙏 安静地感恩这一刻",
        hint: "心智+5，心情+20",
        apply: function (st) {
          st.flags._millionMilestoneSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 20);
          StateManager.addMessage(
            "🙏 你放下手机，静静地坐了一会儿。窗外是万家灯火——你想起刚到的那天，口袋里只有¥300。心智+5，心情+20。",
            "success",
          );
        },
      },
      {
        text: "📊 规划下一个目标",
        hint: "心智+3，获得'百万雄心'buff",
        apply: function (st) {
          st.flags._millionMilestoneSeen = true;
          st.flags._millionAmbition = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 20) + 2,
          );
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 10);
          StateManager.addMessage(
            "📊 你打开记账本，写下新的目标：下一个一百万，要攒下来。心智+3，智力+2。",
            "success",
          );
        },
      },
      {
        text: "📞 给家里打个电话",
        hint: "情感·家庭关系",
        apply: function (st) {
          st.flags._millionMilestoneSeen = true;
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 25);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          if (st.family && st.family.parents) {
            if (st.family.parents.father)
              st.family.parents.father.companionship = Math.min(
                100,
                (st.family.parents.father.companionship || 0) + 5,
              );
            if (st.family.parents.mother)
              st.family.parents.mother.companionship = Math.min(
                100,
                (st.family.parents.mother.companionship || 0) + 5,
              );
          }
          StateManager.addMessage(
            "📞 你给家里打了个电话。妈妈问你在外面好不好。你说挺好的。心情+25，道德+3，家庭关系提升。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 事件4：三技能跨界 ======
  RANDOM_EVENTS.push({
    id: "skill_triple_threshold",
    phase: "street",
    icon: "🌟",
    title: "三栖能手",
    story:
      "你最近发现自己越来越「全能」了。\\n\\n以前只会干一样活，现在——你既能修东西，又能跟客户谈价钱，还能自己做点小账。\\n\\n今天在批发市场，一个老板上下打量了你一番：「你什么都会一点？我正缺一个你这样能管技术又能管业务的人。」\\n\\n他递来一张名片。",
    conditions: function (st) {
      if (!st.skills || st.player.day < 60) return false;
      var highSkills = 0;
      for (var sk in st.skills) {
        if (st.skills[sk] && st.skills[sk].level >= 60) {
          highSkills++;
          if (highSkills >= 3) break;
        }
      }
      if (highSkills < 3) return false;
      if (st.flags._tripleSkillSeen) return false;
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "📋 接下名片，考虑合作",
        hint: "解锁新职业路线可能性",
        apply: function (st) {
          st.flags._tripleSkillSeen = true;
          st.flags._tripleSkillContact = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 15);
          StateManager.addMessage(
            "🌟 你收下名片，心里清楚——不是运气好，是你把几样技能都练到了能拿出手的程度。名气+5，心情+15。",
            "success",
          );
        },
      },
      {
        text: "💪 继续磨练，还不够好",
        hint: "心智+5，保持专注",
        apply: function (st) {
          st.flags._tripleSkillSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
          StateManager.addMessage(
            "💪 你婉拒了，说还要再练练。三项技能只是开始，你想看看自己到底能走多远。心智+5。",
            "info",
          );
        },
      },
      {
        text: "📱 发朋友圈炫耀一下",
        hint: "名气+3",
        apply: function (st) {
          st.flags._tripleSkillSeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 10);
          StateManager.addMessage(
            "📱 你发了条朋友圈：「今天被人夸全能了。」名气+3，心情+10。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 事件5：无债一身轻 ======
  RANDOM_EVENTS.push({
    id: "debt_free_liberation",
    phase: "street",
    icon: "🕊️",
    title: "终于自由了",
    story:
      "你看着手机银行上的余额——¥0。\\n\\n不对，应该是——你看着「已还清」三个字。\\n\\n最后一个还款日，你把最后一笔钱转了出去。信用卡还清了，借的钱还清了，甚至连城中村小卖部赊的账都结了。\\n\\n你站了一会儿，不知道该做什么。\\n\\n来这座城市几年了，第一次——你谁的钱都不欠了。",
    conditions: function (st) {
      if (!st.flags || !st.resources) return false;
      if (!st.flags._everHadDebt) return false;
      var totalDebt =
        (st.resources.debt || 0) + (st.resources.villageDebt || 0) + (st.resources.fineDebt || 0);
      if (totalDebt > 0) return false;
      if (st.player.day < 30) return false;
      if (st.flags._debtFreeSeen) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🍜 去吃顿好的庆祝",
        hint: "¥50，心情+25",
        apply: function (st) {
          st.flags._debtFreeSeen = true;
          var cost = Math.min(50, st.resources.cash || 0);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
          st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 25);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 25);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "🍜 你去了那家以前总路过但舍不得进的小馆子。老板问是不是有喜事。你说：「还清债了。」老板给你加了瓶啤酒：「这顿算我的，恭喜。」心情+25，饥饿+25，心智+3。",
            "success",
          );
        },
      },
      {
        text: "📝 写下这段经历，提醒自己",
        hint: "心智+5，获得'无债'buff",
        apply: function (st) {
          st.flags._debtFreeSeen = true;
          st.flags._debtFreeExperience = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 15);
          StateManager.addMessage(
            "📝 你在笔记本上画了一条线，写了三个字：「还清了」。那些熬夜加班的日子、那些借钱时难以启齿的时刻——都过去了。心智+5，心情+15。",
            "success",
          );
        },
      },
      {
        text: "🤝 去感谢借过钱给你的人",
        hint: "道德+5，修复关系",
        apply: function (st) {
          st.flags._debtFreeSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 20);
          if (st.relationships) {
            for (var r in st.relationships) {
              if (st.relationships[r] && st.relationships[r].met) {
                st.relationships[r].affinity = Math.min(
                  100,
                  (st.relationships[r].affinity || 0) + 3,
                );
              }
            }
          }
          StateManager.addMessage(
            "🤝 你一个个找到那些曾经借过钱给你的人——每一句谢谢，都是真心的。道德+5，心情+20，所有NPC好感+3。",
            "success",
          );
        },
      },
    ],
  });

  // ====================================================================
  // v3.88d 注册完毕（5个：NPC调解/百日匠人/百万财富/三技能跨界/无债一身轻）
  // ====================================================================
  // ====================================================================
  // v3.89 联动空白区填充（5个：老手特遇/专业视角/NPC意外发现/天气×位置/道德分叉）
  // 设计原则：每个事件都用「可验证状态」做 conditions 闸门，叙事与闸门严格自洽
  // ====================================================================

  // ----- 空白区①：老手特遇（长期跑腿/驾驶后遇到熟人客户）-----
  RANDOM_EVENTS.push({
    id: "vet_runner_regular_client",
    phase: "street",
    icon: "🛵",
    title: "片区熟客的请柬",
    story:
      "你跑单跑得久了，这片商圈的老板娘们都认得你。今天「便民超市」的阿姨拦住你，塞来一张红帖：「我侄女下周结婚，你一定来凑个热闹——你每次送货最稳当。」她又压低声音：「这条巷子你平时绕远了，从后门穿过去能省十分钟。」",
    // conditions：长期跑腿（驾驶副业或驾驶技能达标）+ 街头阶段 + 中后期 + 未触发
    conditions: function (st) {
      var isRunner =
        (st.sideHustle && st.sideHustle.type === "driving") || // 检查 正在做驾驶/跑腿副业
        (st.skills &&
          st.skills.driving &&
          (st.skills.driving.level || 0) >= 35); // 检查 驾驶技能≥35（老手）
      if (!isRunner) return false;
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 40) return false; // 检查 中后期
      if (st.flags && st.flags._vetRunnerClientSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🎉 去喝喜酒",
        hint: "现金-，驾驶经验+",
        apply: function (st) {
          st.flags._vetRunnerClientSeen = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 80);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 10);
          if (st.skills && st.skills.driving)
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 40; // 抄近道→驾驶经验
          StateManager.addMessage(
            "🎉 你去了婚礼，老板娘把你介绍给不少商圈朋友。花¥80随了份子，但学到了抄近道的路线，驾驶经验+40，心情+10。",
            "success",
          );
        },
      },
      {
        text: "📦 送份厚礼就好",
        hint: "省力，少量经验",
        apply: function (st) {
          st.flags._vetRunnerClientSeen = true;
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 5);
          if (st.skills && st.skills.driving)
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 15;
          StateManager.addMessage(
            "📦 你忙没空去，托人带了份礼物。老板娘很领情，之后送货总给你留瓶水。驾驶经验+15，心情+5。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 空白区②：技能门槛解锁「专业人士视角」（修理≥40 识别翻新机）-----
  RANDOM_EVENTS.push({
    id: "repair_expert_spot_fake",
    phase: "street",
    icon: "🔧",
    title: "老师傅的眼力",
    story:
      "旧货市场里，摊主热情推销一台「九成新」的二手空调，价格低得离谱。你蹲下敲了敲外机，又看了眼焊点——这是翻新机，压缩机随时可能炸。旁边一位大姐正犹豫要不要买。",
    // conditions：修理技能达标（专业视角门槛）+ 街头 + 中后期 + 未触发
    conditions: function (st) {
      var rep = st.skills && st.skills.repair && st.skills.repair.level; // 检查 修理等级
      if (typeof rep !== "number" || rep < 40) return false; // 检查 repair>=40
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 30) return false; // 检查 中后期
      if (st.flags && st.flags._repairFakeSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🗣️ 悄悄提醒大姐",
        hint: "助人+道德，维修经验+",
        apply: function (st) {
          st.flags._repairFakeSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 5);
          if (st.skills && st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 20;
          StateManager.addMessage(
            "🗣️ 你压低声音把翻新机的破绽说了。大姐惊出一身汗，连连道谢走了。你这身手艺，关键时刻真能护人。道德+3，心情+5，维修经验+20。",
            "success",
          );
        },
      },
      {
        text: "⚠️ 当众揭穿摊主",
        hint: "名气+，但得罪人",
        apply: function (st) {
          st.flags._repairFakeSeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          StateManager.addMessage(
            "⚠️ 你当着围观的人点破了翻新手法。摊主脸绿了，周围人纷纷散开。名气+5，道德+2——这市场你短期怕是混不进去了。",
            "event",
          );
        },
      },
      {
        text: "🤐 装没看见",
        hint: "少惹事，心里过意不去",
        apply: function (st) {
          st.flags._repairFakeSeen = true;
          _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 0) - 2);
          StateManager.addMessage(
            "🤐 你犹豫了一下，还是没出声。摊主卖出去了，你心里有点不是滋味。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 空白区③：NPC好感积累后的「意外发现」（张姐好感≥60 透露内推岗）-----
  RANDOM_EVENTS.push({
    id: "zhang_hidden_job_lead",
    phase: "street",
    icon: "💡",
    title: "张姐的私下消息",
    story:
      "张姐把你拉到工厂后巷，四下看看才开口：「我表弟在开发区管招工，有个不对外放的夜班质检岗，活儿轻、补贴高。我想着你人踏实，问你要不要。」",
    // conditions：已结识张姐 + 好感≥60（好感积累后的意外发现）+ 中后期 + 未触发
    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_zhang; // 检查 张姐关系
      if (!rel || !rel.met) return false; // 检查 已结识
      if ((rel.affinity || 0) < 60) return false; // 检查 好感≥60
      if (st.player.phase !== "street") return false;
      if (st.player.day < 40) return false;
      if (st.flags && st.flags._zhangJobLeadSeen) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "✅ 拜托张姐引荐",
        hint: "开启新工作线",
        apply: function (st) {
          st.flags._zhangJobLeadSeen = true;
          st.flags._zhangReferral = true; // 内推标记，供后续工作系统接住
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 8);
          StateManager.addMessage(
            "✅ 你一口答应。张姐拍胸脯保证，过两天带你去面试。多了一条稳当的活路，心里踏实。心情+8（标记「张姐内推」）。",
            "success",
          );
        },
      },
      {
        text: "🤔 先打听清楚",
        hint: "谨慎，留人情",
        apply: function (st) {
          st.flags._zhangJobLeadSeen = true;
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 3);
          var rel = st.relationships && st.relationships.sister_zhang;
          if (rel) rel.affinity = Math.min(100, (rel.affinity || 0) + 3);
          StateManager.addMessage(
            "🤔 你说先了解下再定。张姐把厂名和待遇都写了条子给你。这份情，你记下了。好感+3，心情+3。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 空白区④：天气×位置组合情境（暴雨/大雨 + 商业区，与雾天批发市场事件区分）-----
  RANDOM_EVENTS.push({
    id: "stormy_commercial_rider_down",
    phase: "street",
    icon: "🌧️",
    title: "暴雨里的摔车",
    story:
      "商业区暴雨如注，你看见一个外卖骑手在积水的路口连人带车摔了出去，餐箱滚进下水道。他爬起来第一件事是去捞餐盒，浑身湿透，膝盖渗血。",
    // conditions：暴雨/大雨天气 + 当前在商业区（天气×位置情境）+ 街头 + 中后期 + 未触发
    conditions: function (st) {
      var w = st.weather && st.weather.current; // 检查 天气
      if (w !== "stormy" && w !== "rainy") return false; // 检查 暴雨或大雨
      var loc = st.trade && st.trade.currentLocation; // 检查 位置
      if (loc !== "commercialDist") return false; // 检查 在商业区
      if (st.player.phase !== "street") return false;
      if (st.player.day < 15) return false;
      if (st.flags && st.flags._stormRiderSeen) return false;
      return true;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "🚑 扶他并帮忙捡餐",
        hint: "助人+道德，疲惫+",
        apply: function (st) {
          st.flags._stormRiderSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 4);
          _guardNeedsP8(st).fatigue = Math.min(100, (_guardNeedsP8(st).fatigue || 0) + 10);
          StateManager.addMessage(
            "🚑 你冲过去帮他捞起餐盒、扶到屋檐下。他连声道谢，把手机号留给你：「以后这片区，找我帮衬。」道德+3，心情+4，疲惫+10。",
            "success",
          );
        },
      },
      {
        text: "📱 拍下发给媒体",
        hint: "名气+，但消费苦难",
        apply: function (st) {
          st.flags._stormRiderSeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          st.player.morality = Math.max(0, (st.player.morality || 50) - 2);
          StateManager.addMessage(
            "📱 你拍了视频发网上，配文「暴雨中的骑手」。一夜小爆，名气+4，可你盯着屏幕有点心虚——这算消费别人的难吗？道德-2。",
            "event",
          );
        },
      },
      {
        text: "☔ 自顾躲雨",
        hint: "明哲保身",
        apply: function (st) {
          st.flags._stormRiderSeen = true;
          _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 0) - 1);
          StateManager.addMessage(
            "☔ 你缩在便利店屋檐下，没敢上前。骑手自己爬起来走了。你告诉自己「帮不了所有人」，可那道身影一直晃。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 空白区⑤：道德极端「人设分叉」（高道德/低道德遇到同一情境反应不同）-----
  RANDOM_EVENTS.push({
    id: "moral_extreme_found_wallet",
    phase: "street",
    icon: "👛",
    title: "ATM旁的鼓囊钱包",
    story:
      "你在ATM旁捡到一个鼓鼓囊囊的钱包，现金、证件、一张写满待办事项的纸条都在。四周没人看见——这一刻，你是什么人，就怎么选。",
    // conditions：道德极端（仅≥70或≤30触发人设分叉）+ 街头 + 中后期 + 未触发
    conditions: function (st) {
      var m = st.player.morality || 50; // 检查 道德值
      if (m < 70 && m > 30) return false; // 检查 仅极端值触发分叉
      if (st.player.phase !== "street") return false;
      if (st.player.day < 20) return false;
      if (st.flags && st.flags._moralWalletSeen) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🏢 交到派出所",
        hint: "物归原主，名声大涨",
        apply: function (st) {
          st.flags._moralWalletSeen = true;
          var m = st.player.morality || 50;
          if (m >= 70) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            st.player.morality = Math.min(100, m + 4);
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 10);
            StateManager.addMessage(
              "🏢 你冒雨把钱包送进派出所。民警登记时多看了你一眼：「现在这样的人不多了。」名气+8，道德+4，心情+10——你这样的人，自有福报。",
              "success",
            );
          } else {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 4);
            StateManager.addMessage(
              "🏢 你到底还是把钱包送去了派出所。手在门把上停了很久——曾走过弯路的人，更懂物归原主的分量。名气+3，心情+4。",
              "info",
            );
          }
        },
      },
      {
        text: "💰 拿走现金",
        hint: "短期获利，道德受损",
        apply: function (st) {
          st.flags._moralWalletSeen = true;
          var m = st.player.morality || 50;
          var take = Random.int(50, 300);
          st.resources.cash = (st.resources.cash || 0) + take;
          if (m <= 30) {
            st.player.morality = Math.max(0, m - 6);
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 3);
            StateManager.addMessage(
              "💰 你抽走现金，把空钱包连同证件甩进垃圾桶。手头宽裕了几天，可每次路过派出所都下意识绕路。现金+" +
                take +
                "，道德-6。",
              "warning",
            );
          } else {
            st.player.morality = Math.max(0, m - 10);
            _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 0) - 4);
            StateManager.addMessage(
              "💰 你终究没忍住拿走了现金——可那一晚你翻来覆去。空钱包你放回了原地。现金+" +
                take +
                "，道德-10，心里空落落的。",
              "warning",
            );
          }
        },
      },
    ],
  });

  // ====== 空白区⑥：NPC关系矩阵深度互动——王婶×张姐紧张调解 ======
  // 设计意图：NPC_RELATION_MATRIX有14×14关系，但只有少数被事件消费。
  // 王婶和张姐的"紧张"关系是经典邻里冲突——玩家作为中间人调解
  RANDOM_EVENTS.push({
    id: "npc_mediate_aunt_wang_sister_zhang",
    phase: "street",
    icon: "🤝",
    title: "屋檐下的战火",
    story:
      "你刚走到城中村口就听见王大婶扯着嗓门说话：「我晾的被子被她浇花淋湿三回了！」\n\n对方也不甘示弱——是张姐的声音。\n\n两个平时对你还不错的女人正站在楼道里对峙。看见你走过来，两人同时看向你——「你来评评理！」",
    conditions: function (st) {
      var aw = st.relationships && st.relationships.aunt_wang;
      var sz = st.relationships && st.relationships.sister_zhang;
      if (!aw || !aw.met || !sz || !sz.met) return false;
      if ((aw.affinity || 0) < 30) return false;
      if ((sz.affinity || 0) < 30) return false;
      if (st.player.phase !== "street") return false;
      if (st.player.day < 30) return false;
      if (st.flags && st.flags._npcMediationSeen) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🤲 两边说好话，当和事佬",
        hint: "好感各+5",
        apply: function (st) {
          st.flags._npcMediationSeen = true;
          st.relationships.aunt_wang.affinity = Math.min(
            100,
            (st.relationships.aunt_wang.affinity || 0) + 5,
          );
          st.relationships.sister_zhang.affinity = Math.min(
            100,
            (st.relationships.sister_zhang.affinity || 0) + 5,
          );
          st.player.charm = Math.min(100, (st.player.charm || 0) + 1);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 8);
          st.flags._auntZhangMediated = true;
          StateManager.addMessage(
            "🤲 你耐着性子两头说和，说得口干舌燥，两人终于各哼一声各自散了。魅力+1，好感各+5，心情+8。",
            "success",
          );
          if (typeof scheduleChainEvent === "function") {
            scheduleChainEvent(st, "aunt_zhang_payoff", 30, "street");
          }
        },
      },
      {
        text: "🔍 指出晾衣架位置问题是根源",
        hint: "讲道理，好感各+3",
        apply: function (st) {
          st.flags._npcMediationSeen = true;
          st.relationships.aunt_wang.affinity = Math.min(
            100,
            (st.relationships.aunt_wang.affinity || 0) + 3,
          );
          st.relationships.sister_zhang.affinity = Math.min(
            100,
            (st.relationships.sister_zhang.affinity || 0) + 3,
          );
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 1,
          );
          st.flags._auntZhangMediated = true;
          StateManager.addMessage(
            "🔍 你没站任何一方，直接动手把晾衣架往旁边挪了两米。两人愣了一下，都没再说话。智力+1，好感各+3。",
            "success",
          );
          if (typeof scheduleChainEvent === "function") {
            scheduleChainEvent(st, "aunt_zhang_payoff", 30, "street");
          }
        },
      },
      {
        text: "🚶 不掺和，绕道走",
        hint: "明哲保身",
        apply: function (st) {
          st.flags._npcMediationSeen = true;
          StateManager.addMessage(
            "🚶 你低头从旁边绕过去了。身后两人的声音更大了些。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 空白区⑦：财富里程碑——人生第一桶金 ======
  // 设计意图：wealth到达¥1M/¥10M无叙事事件。取¥200,000为门槛覆盖更多玩家
  RANDOM_EVENTS.push({
    id: "wealth_first_bucket_milestone",
    phase: "street",
    icon: "💰",
    title: "第一个二十万",
    story:
      "你盯着银行APP上的余额反复数了三遍——¥200,000。\n\n你从刚进城时的¥300开始攒到现在。记得第一次吃盒饭¥12都要犹豫半天，记得发着高烧还去工地搬砖。\n\n二十万。这是你的第一桶金。",
    conditions: function (st) {
      if (st.player.phase !== "street") return false;
      if (st.player.day < 60) return false;
      var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
      if (total < 200000) return false;
      if (st.flags && st.flags._firstBucketSeen) return false;
      return true;
    },
    probability: 0.08,
    repeatable: false,
    choices: [
      {
        text: "📈 了解理财，钱生钱",
        hint: "投资思维开启",
        apply: function (st) {
          st.flags._firstBucketSeen = true;
          st.flags._firstBucketInvestor = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 4,
          );
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 18);
          StateManager.addMessage(
            "📈 你约了理财顾问下周聊。挂了电话站在窗边看夜景——第一次觉得这座城市不再只是打工的地方。智力+4，心情+18。",
            "success",
          );
        },
      },
      {
        text: "🏦 继续存着，攒首付",
        hint: "稳扎稳打",
        apply: function (st) {
          st.flags._firstBucketSeen = true;
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 12);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "🏦 你把手机收起继续干活。二十万还差得远——但你已经不是那个交不起房租的人了。心智+3，心情+12。",
            "success",
          );
        },
      },
      {
        text: "🎉 犒劳自己，吃顿好的",
        hint: "情绪释放",
        apply: function (st) {
          st.flags._firstBucketSeen = true;
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 20);
          _guardNeedsP8(st).fatigue = Math.max(0, (_guardNeedsP8(st).fatigue || 0) - 15);
          StateManager.addMessage(
            "🎉 你关了手机去吃了一顿好的。¥68的酸菜鱼，吃得满头大汗——原来对自己好一点是这种感觉。心情+20，疲劳-15。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 空白区⑧：NPC关系矩阵——李工头×陈哥合作 ======
  // 设计意图：boss_li和chen_ge的关系矩阵是"中立"——两个不同类型的人合作
  RANDOM_EVENTS.push({
    id: "npc_boss_li_chen_ge_coop",
    phase: "street",
    icon: "⚙️",
    title: "石头碰上齿轮",
    story:
      "你正吃面，李工头突然坐过来：「你认识陈哥对吧？我有个工程需要提前知道城西拆迁时间——早一个月知道，光废品就能多赚三万。你要是能搭个线，佣金三成分你。」",
    conditions: function (st) {
      var bl = st.relationships && st.relationships.boss_li;
      var cg = st.relationships && st.relationships.chen_ge;
      if (!bl || !bl.met || !cg || !cg.met) return false;
      if ((bl.affinity || 0) < 40) return false;
      if ((cg.affinity || 0) < 40) return false;
      if (st.player.phase !== "street") return false;
      if (st.player.day < 50) return false;
      if (st.flags && st.flags._bossChenCoopSeen) return false;
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "🤝 牵线搭桥促成合作",
        hint: "佣金+好感",
        apply: function (st) {
          st.flags._bossChenCoopSeen = true;
          st.flags._bossChenCooperation = true;
          var commission = 500 + Random.int(0, 300);
          st.resources.cash = (st.resources.cash || 0) + commission;
          st.resources.totalEarned += commission;
          st.relationships.boss_li.affinity = Math.min(
            100,
            (st.relationships.boss_li.affinity || 0) + 8,
          );
          st.relationships.chen_ge.affinity = Math.min(
            100,
            (st.relationships.chen_ge.affinity || 0) + 8,
          );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          StateManager.addMessage(
            "🤝 你组了个酒局。三杯下肚两人发现对方挺实在。半个月后消息拿到，你分得¥" +
              commission +
              "。好感各+8。",
            "success",
          );
        },
      },
      {
        text: "🔗 只传话不分钱",
        hint: "纯帮忙，好感更多",
        apply: function (st) {
          st.flags._bossChenCoopSeen = true;
          st.relationships.boss_li.affinity = Math.min(
            100,
            (st.relationships.boss_li.affinity || 0) + 12,
          );
          st.relationships.chen_ge.affinity = Math.min(
            100,
            (st.relationships.chen_ge.affinity || 0) + 10,
          );
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          StateManager.addMessage(
            "🔗 你摆摆手说不用分成。一个月后两人都欠你人情——在这座城市，人情比钱值钱。道德+3。",
            "success",
          );
        },
      },
      {
        text: "🙅 不掺和",
        hint: "明哲保身",
        apply: function (st) {
          st.flags._bossChenCoopSeen = true;
          StateManager.addMessage("🙅 你婉拒了。李工头有些失望。", "info");
        },
      },
    ],
  });

  // ====== 空白区⑨：长期居住归属感——城市融入时刻 ======
  // 设计意图：玩家在同一座城市生活满一年——从"漂泊者"到"居住者"的身份转变
  RANDOM_EVENTS.push({
    id: "city_one_year_anniversary",
    phase: "street",
    icon: "🏙️",
    title: "这座城市的第365天",
    story:
      "你像往常一样走出门，卖早点的阿姨笑着问你「今天吃啥？老样子？」菜市场林阿姨老远就挥手。修车的赵师傅点头说了声「早」。\n\n你突然意识到——你在这座城市已经住了一年。365天。你不再是一个陌生人了。",
    conditions: function (st) {
      if (st.player.day < 365) return false;
      if (st.player.phase !== "street") return false;
      if (st.flags && st.flags._cityYearSeen) return false;
      return true;
    },
    probability: 0.09,
    repeatable: false,
    choices: [
      {
        text: "🌟 给认识的NPC送小礼物",
        hint: "全城NPC好感+3",
        apply: function (st) {
          st.flags._cityYearSeen = true;
          var rels = st.relationships || {};
          for (var nid in rels) {
            if (rels[nid] && rels[nid].met) {
              rels[nid].affinity = Math.min(100, (rels[nid].affinity || 0) + 3);
            }
          }
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 20);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "🌟 你花了一天给每个认识的人送了小礼物。晚上门口挂了袋东西——纸条上写：「欢迎留下来。」全城NPC好感+3，心情+20。",
            "success",
          );
        },
      },
      {
        text: "📸 去观景台看日落",
        hint: "内心沉淀",
        apply: function (st) {
          st.flags._cityYearSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 8);
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 3,
          );
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 15);
          var cost = 50;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
          StateManager.addMessage(
            "📸 站在观景台顶，整个城市铺在脚下。夕阳把一切都染成金色。心智+8，心情+15。",
            "success",
          );
        },
      },
      {
        text: "📝 写日记记录这一年",
        hint: "心智+5，解锁回忆",
        apply: function (st) {
          st.flags._cityYearSeen = true;
          st.flags._cityJournalWritten = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 10);
          if (!st.flags._narrativeLog) st.flags._narrativeLog = [];
          st.flags._narrativeLog.push("city_year_" + st.player.day);
          StateManager.addMessage(
            "📝 你写了一个晚上——从第一天走出火车站的迷茫到现在的所有经历。写完最后一个字，有什么东西终于落定了。心智+5，心情+10。",
            "success",
          );
        },
      },
    ],
  });

  // ====================================================================
  // v3.88f (loop R43) 新增5个联动事件：社工温情/市场波动/城管体验/孝心抉择/师徒传承
  // ====================================================================

  // ====== 空白区⑩：社工走访——无家者的心灵陪伴 ======
  // 设计意图：露宿玩家(housing.tier≤1)在精神低谷(mental<30)时被社工打动
  RANDOM_EVENTS.push({
    id: "social_worker_visit",
    phase: "street",
    icon: "💌",
    title: "雨夜里的社工",
    story:
      '一个穿红马甲的年轻社工蹲到你的面前，没有同情和施舍的眼神，只是轻声说："下这么大雨，收容所还有空位，要不要来看看？不登记不住也行，至少喝口热的再走。"\n\n她把自己的伞递过来，自己顶着文件袋跑向下一处避雨点。',
    conditions: function (st) {
      if (st.player.phase !== "street") return false;
      if (st.player.day < 14) return false; // 检查：至少经历两周漂泊
      if ((st.player.mental || 50) > 30) return false; // 检查：精神<30才触发
      if (((st.housing && st.housing.tier) || 0) > 1) return false; // 检查：住所≤1级(露宿/合租床位)
      if (st.flags && st.flags._socialWorkerSeen) return false;
      return true;
    },
    probability: 0.08,
    repeatable: false,
    choices: [
      {
        text: "🍜 跟着去收容所喝口热的",
        hint: "精神+15",
        apply: function (st) {
          st.flags._socialWorkerSeen = true;
          st.flags._shelterVisited = true;
          st.player.mental = Math.min(100, (st.player.mental || 30) + 15);
          _guardNeedsP8(st).fatigue = Math.max(0, (_guardNeedsP8(st).fatigue || 0) - 10);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 8);
          StateManager.addMessage(
            "🍜 一碗热粥下肚，你的眼眶湿了。原来还有人记得这座城市里像你这样的人。心智+15，疲劳-10。",
            "success",
          );
        },
      },
      {
        text: "🚶 谢绝好意，继续赶路",
        hint: "独立",
        apply: function (st) {
          st.flags._socialWorkerSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 30) + 5);
          StateManager.addMessage(
            "🚶 你道了谢走开。雨停后偶尔会想起那把没还的伞。",
            "info",
          );
        },
      },
      {
        text: "📋 问社工是否需要帮忙",
        hint: "助人自助",
        apply: function (st) {
          st.flags._socialWorkerSeen = true;
          st.flags._volunteerSocial = true;
          st.player.mental = Math.min(100, (st.player.mental || 30) + 10);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "📋 你帮她整理了三天受助者档案。从被人帮到帮别人，你找回了些力气。心智+10，道德+5，名气+3。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 空白区⑪：政策补贴窗口——低保/临时救助申请 ======
  // 设计意图：极端困境(cash<200+连续工作≥30天)触发政策帮扶事件
  RANDOM_EVENTS.push({
    id: "gov_subsidy_window",
    phase: "street",
    icon: "🏛️",
    title: "社区来了政策宣讲队",
    story:
      "社区服务中心门口支起了桌子——「临时困难救助+就业帮扶政策宣讲」。\n\n工作人员忙得脚不沾地，但看到你之后说了句：「你这种情况符合临时救助条件，三个月每月¥800补贴，还能免费参加就业培训——带身份证了吗？」",
    conditions: function (st) {
      if (st.player.phase !== "street") return false;
      if (st.player.day < 30) return false; // 检查：至少满一个月
      if ((st.resources.cash || 0) >= 200) return false; // 检查：现金不足¥200才需救助
      var workedLong =
        st.stats &&
        st.stats.actionFreq &&
        (st.stats.actionFreq["manual_labor_construction"] > 30 ||
          st.stats.actionFreq["haul_goods"] > 30 ||
          st.stats.actionFreq["food_stall"] > 30);
      if (!workedLong) return false; // 检查：长期苦力劳动者的尊严
      if (st.flags && st.flags._subsidySeen) return false;
      return true;
    },
    probability: 0.1,
    repeatable: false,
    choices: [
      {
        text: "📋 排队申请救助",
        hint: "三个月¥2400",
        apply: function (st) {
          st.flags._subsidySeen = true;
          st.flags._subsidyActive = true;
          st.flags._subsidyEndDay = st.player.day + 90;
          var bonus = 800;
          st.resources.cash = (st.resources.cash || 0) + bonus;
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 5);
          StateManager.addMessage(
            "📋 申请通过了！首月¥800当场到账。工作人员说「下月按时来签收。」心情+5，三个月补贴激活。",
            "success",
          );
        },
      },
      {
        text: "💼 问就业培训有什么",
        hint: "技能提升",
        apply: function (st) {
          st.flags._subsidySeen = true;
          st.flags._freeTrainingSeen = true;
          var skillKey = Random.fromArray([
            "repair",
            "sales",
            "cooking",
            "coding",
          ]);
          if (st.skills && st.skills[skillKey]) {
            st.skills[skillKey].xp = (st.skills[skillKey].xp || 0) + 60;
          }
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 2,
          );
          StateManager.addMessage(
            "💼 登记了免费" +
              {
                repair: "维修",
                sales: "销售",
                cooking: "烹饪",
                coding: "编程",
              }[skillKey] +
              "培训班。下周开班，智力+2，技能XP+60。",
            "success",
          );
        },
      },
      {
        text: "😤 不食嗟来之食",
        hint: "骨气",
        apply: function (st) {
          st.flags._subsidySeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          StateManager.addMessage(
            "😤 你扭头走了。靠自己的手吃饭，不丢人。回去的路上步子比来时沉了些，但也稳了些。心智+8，名气+2。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 空白区⑫：城管来查——互动体验版 ======
  // 设计意图：摆摊玩家(chengguan.heat≥40)在高热度时触发有选择的城管遭遇
  RANDOM_EVENTS.push({
    id: "chengguan_encounter_interactive",
    phase: "street",
    icon: "🚓",
    title: "城管来了",
    story:
      "「城管来了！」不知道谁喊了一声。\n\n整条街顿时像被按了快进键——折叠桌「咔咔」往三轮车上扔，锅碗瓢盆叮当作响。\n\n你对面走来两个穿制服的城管，其中一个看了你一眼：「此处禁止占道经营，请配合立即撤离。」\n\n旁边已经有摊贩被拦下在登记……",
    conditions: function (st) {
      if (st.player.phase !== "street") return false;
      if (st.player.day < 20) return false; // 检查：经营至少20天
      var hasStallExp =
        (st.stats &&
          st.stats.actionFreq &&
          (st.stats.actionFreq["food_stall"] > 5 ||
            st.stats.actionFreq["night_stall"] > 5 ||
            st.stats.actionFreq["morning_stall"] > 5 ||
            st.stats.actionFreq["weekend_market"] > 5 ||
            st.stats.actionFreq["sell_goods"] > 5)) ||
        (st.sideHustle && st.sideHustle.type === "stall");
      if (!hasStallExp) return false; // 检查：有摆摊经验才遇到城管
      var heat = (st.chengguan && st.chengguan.heat) || 0;
      if (heat < 40) return false; // 检查：城管热度≥40
      if (st.flags && st.flags._chengguanEncounter) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🏃 收摊就跑",
        hint: "敏捷考验",
        apply: function (st) {
          st.flags._chengguanEncounter = true;
          if (Random.chance(0.5 + (st.player.agility - 25) * 0.01)) {
            _guardNeedsP8(st).fatigue = Math.min(100, (_guardNeedsP8(st).fatigue || 0) + 8);
            StateManager.addMessage(
              "🏃 你蹬着三轮车跑了三条街才停下来。没追上。虽然后怕，但货保住了。疲劳+8。",
              "success",
            );
          } else {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
            StateManager.addMessage(
              "🏃 没跑出几步就被堵住了，罚了¥50。下次得跑快点。",
              "warning",
            );
          }
        },
      },
      {
        text: "🙏 求情说好话",
        hint: "心智考验",
        apply: function (st) {
          st.flags._chengguanEncounter = true;
          if (Random.chance(0.4)) {
            st.chengguan.relationship = (st.chengguan.relationship || 0) + 5;
            StateManager.addMessage(
              "🙏 城管摆摆手：「下不为例，赶紧收了走吧。」给了一次机会。城管关系+5。",
              "success",
            );
          } else {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100);
            StateManager.addMessage(
              "🙏 城管摇头：「每个都这么说，罚¥100,下回直接扣货。」",
              "warning",
            );
          }
        },
      },
      {
        text: "🤝 主动帮城管搬障碍物换好感",
        hint: "出奇招",
        apply: function (st) {
          st.flags._chengguanEncounter = true;
          st.chengguan = st.chengguan || {
            heat: 0,
            warnings: 0,
            relationship: 0,
          };
          st.chengguan.heat = Math.max(0, (st.chengguan.heat || 0) - 15);
          st.chengguan.relationship = (st.chengguan.relationship || 0) + 10;
          st.player.charm = Math.min(100, (st.player.charm || 0) + 2);
          StateManager.addMessage(
            "🤝 你帮城管把路边一个废弃石墩子搬到皮卡上。他们走时说了句「你这小伙子，行。」热度-15，关系+10，魅力+2。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 空白区⑬：父母的一通电话——亲情与愧疚 ======
  // 设计意图：玩家漂泊≥60天+极少回家触发，引发情感共鸣
  RANDOM_EVENTS.push({
    id: "parents_phone_call",
    phase: "street",
    icon: "📞",
    title: "母亲来电话了",
    story:
      "晚饭时手机响了——「妈」。\n\n那头先是沉默了几秒，然后说：「没什么事，就是想问问你今天吃了吗。」\n\n你听见电话里爸在旁边说「别耽误他上班」。\n\n妈又说：「今年中秋能回来吗？也不用啥时候，你爸他……你回来就好。」",
    conditions: function (st) {
      if (st.player.phase !== "street") return false;
      if (st.player.day < 60) return false; // 检查：至少漂泊2个月
      var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
      if (total < 1000) return false; // 检查：钱不多才触发愧疚感(有钱就不愧疚了)
      var littleFamily = st.family && st.family.parents ? true : false;
      if (!littleFamily) return false;
      if (st.flags && st.flags._parentsPhoneSeen) return false;
      return true;
    },
    probability: 0.07,
    repeatable: false,
    choices: [
      {
        text: "💸 转¥500回家",
        hint: "尽孝",
        cost: 500,
        apply: function (st) {
          st.flags._parentsPhoneSeen = true;
          if ((st.resources.cash || 0) >= 500) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
            if (st.family && st.family.parents) {
              st.family.parents.father.companionship = Math.min(
                100,
                (st.family.parents.father.companionship || 0) + 15,
              );
              st.family.parents.mother.companionship = Math.min(
                100,
                (st.family.parents.mother.companionship || 0) + 15,
              );
            }
            st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 10);
            StateManager.addMessage(
              "💸 钱转过去了。妈打电话过来哭着说「你自己都没吃好」。你的心揪了一下。心情+10，道德+3，父母陪伴感+15。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "💸 卡上余额不够——这¥500你还拿不出来。握着手机的手在抖。心里愧疚极了。",
              "warning",
            );
            st.player.mental = Math.max(0, (st.player.mental || 50) - 8);
          }
        },
      },
      {
        text: "📱 答应中秋一定回去",
        hint: "承诺",
        apply: function (st) {
          st.flags._parentsPhoneSeen = true;
          st.flags._promisedHome = true;
          if (st.family && st.family.parents) {
            st.family.parents.mother.companionship = Math.min(
              100,
              (st.family.parents.mother.companionship || 0) + 8,
            );
          }
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 8);
          StateManager.addMessage(
            "📱 妈那头笑着跟你爸说「他说回来！」。挂了电话你在街边坐了好一会。心智+5，心情+8，承诺回家flag已设置。",
            "success",
          );
        },
      },
      {
        text: "😶 敷衍两句挂断",
        hint: "愧疚",
        apply: function (st) {
          st.flags._parentsPhoneSeen = true;
          _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 0) - 12);
          st.player.mental = Math.max(0, (st.player.mental || 50) - 5);
          st.flags._ignoredParentsCall = true;
          StateManager.addMessage(
            "😶 你说「忙，先挂了」。整晚翻来覆去睡不着。心情-12，心智-5。今天你欠了自己一个答案。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== 空白区⑭：师徒传承——工匠手艺的仪式 ======
  // 设计意图：工匠技能(welding/electrician/repair)≥60时触发"带徒弟"事件
  RANDOM_EVENTS.push({
    id: "craftsman_apprentice",
    phase: "street",
    icon: "🔨",
    title: "有人想跟你学手艺",
    story:
      "你正干着活，一个二十出头的小伙子在旁边看了半天，最后鼓起勇气开口：「师傅，我想跟你学这个，不要钱也行，能吃饱饭就行。」\n\n他眼睛亮亮的，让你想起十年前的自己。\n\n但你知道——带徒弟意味着分担自己的时间，也意味着……你在这行的经验要传下去了。",
    conditions: function (st) {
      if (st.player.phase !== "street") return false;
      if (st.player.day < 90) return false; // 检查：至少从业3个月
      var craftHigh =
        st.skills &&
        ((st.skills.welding && st.skills.welding.level >= 60) ||
          (st.skills.electrician && st.skills.electrician.level >= 60) ||
          (st.skills.repair && st.skills.repair.level >= 70));
      if (!craftHigh) return false; // 检查：任一手艺达门槛
      if (st.flags && st.flags._apprenticeSeen) return false;
      return true;
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "👨‍🏫 收他为徒，传承手艺",
        hint: "长远回报",
        apply: function (st) {
          st.flags._apprenticeSeen = true;
          st.flags._hasApprentice = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          st.player.charm = Math.min(100, (st.player.charm || 0) + 3);
          if (typeof scheduleChainEvent === "function") {
            scheduleChainEvent(st, "craftsman_apprentice_payoff", 30, "street");
          }
          StateManager.addMessage(
            "👨‍🏫 你收下了他。第二天他开始跟着你出工。你知道这条路不好走——但你当年的师傅也是这么把你带出来的。名气+8，心智+8，魅力+3。30天后回报触发。",
            "success",
          );
        },
      },
      {
        text: "💰 介绍他去同行那边干",
        hint: "人情债",
        apply: function (st) {
          st.flags._apprenticeSeen = true;
          var recFriend = Random.fromArray(["boss_li", "old_zhou", "chen_ge"]);
          if (
            st.relationships &&
            st.relationships[recFriend] &&
            st.relationships[recFriend].met
          ) {
            st.relationships[recFriend].affinity = Math.min(
              100,
              (st.relationships[recFriend].affinity || 0) + 10,
            );
          }
          StateManager.addMessage(
            "💰 你写了条微信把他推荐给一个老朋友。对方回了句「你介绍的人我放心」。朋友好感+10。",
            "success",
          );
        },
      },
      {
        text: "🙏 婉拒——自己还泥菩萨过江",
        hint: "诚实",
        apply: function (st) {
          st.flags._apprenticeSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          StateManager.addMessage(
            "🙏 你诚实地说自己也还在挣扎。小伙子点点头没说什么——但你看出他眼里没怪你。道德+3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 链式后续：师徒回报 ======
  // 带徒弟30天后的回报——学徒出师带来意外收益
  RANDOM_EVENTS.push({
    id: "craftsman_apprentice_payoff",
    phase: "street",
    _isChainEvent: true,
    icon: "🎓",
    title: "徒弟出师了",
    story:
      "那天你收下的徒弟今天跑来跟你说：「师傅，我这周独立接到第一单了——一个饭店后厨电路改造，人家给了¥1500。」\n\n他拿出个信封要塞给你：「你教我的，我不能白学。」\n\n你看着他的手，粗糙、有力——就像你当年。",
    conditions: function (st) {
      if (st.player.phase !== "street") return false;
      if (!st.flags || !st.flags._hasApprentice) return false; // 检查：必须有徒弟flag
      return true;
    },
    probability: 0.5,
    repeatable: false,
    choices: [
      {
        text: "💰 收下信封",
        hint: "¥1500",
        apply: function (st) {
          st.flags._apprenticePaidOff = true;
          var pay = 1500;
          st.resources.cash = (st.resources.cash || 0) + pay;
          st.resources.totalEarned += pay;
          StateManager.addMessage(
            "💰 你收下信封但没有全拿——抽了一半又塞回去。「剩下的买点工具。」传承不只是钱。收入¥750。",
            "success",
          );
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 750);
        },
      },
      {
        text: "🙏 让他全留着当工具费",
        hint: "师徒关系升级",
        apply: function (st) {
          st.flags._apprenticePaidOff = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          StateManager.addMessage(
            "🙏 你摆摆手：「买点好的工具，别用破东西出事。」他使劲点了点头。你突然觉得一身轻——有人接班了。名气+5，心智+5。",
            "success",
          );
        },
      },
    ],
  });

  // ====== v3.90 联动事件（空白区填充·第二批） ======
  // 全部 gate 在已验证 state 字段：player.phase / skills.*.level / flags._habits.lowHungerStreak
  // / trade.currentLocation / weather.current / needs.* / day。叙事与闸门严格自洽。
  RANDOM_EVENTS.push({
    id: "coding_expert_review_pr",
    phase: "street",
    icon: "💻",
    title: "代码里的江湖",
    story:
      "你修 bug 的手速被同行看到了。一位前辈私信你：「小子，你这异常处理写得比我们组 senior 还干净。」他扔来一个开源项目的 PR 邀请——「来，帮我 review 这坨山。」",
    conditions: function (st) {
      if (st.player.phase !== "street") return false; // 检查：仅街头阶段
      if (!st.skills || !st.skills.coding) return false; // 检查：coding 技能存在
      if ((st.skills.coding.level || 0) < 40) return false; // 检查：编程≥40（专业视角门槛）
      if ((st.player.day || 0) < 30) return false; // 检查：day≥30
      if (st.flags && st.flags._codingPrSeen) return false; // 检查：未触发过
      return true;
    },
    probability: 0.05, // [PLACEHOLDER] 待 playtest 调参
    repeatable: false,
    choices: [
      {
        text: "🔍 接下 PR，认真 review",
        hint: "coding.xp +30",
        apply: function (st) {
          st.flags._codingPrSeen = true; // 标记：防重复
          if (st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 30; // 编程经验+
          StateManager.addMessage(
            "你花了一晚把那坨山理成了清爽的模块。前辈回了个「牛逼」。coding 经验+30。",
            "success",
          );
        },
      },
      {
        text: "🙅 婉拒，怕坑",
        hint: "无变化",
        apply: function (st) {
          st.flags._codingPrSeen = true; // 标记：防重复
          StateManager.addMessage("你婉拒了。有些江湖，还没准备好闯。", "info");
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "heatwave_market_faint",
    phase: "street",
    icon: "🥵",
    title: "三伏天的商圈",
    story:
      "气温计爆表，商圈柏油路面烫得能煎蛋。你拎着东西走到一半，眼前一黑——旁边卖冰粉的阿姨一把扶住你：「崽啊，快进来吹会儿空调，这天气哪是人熬的。」",
    conditions: function (st) {
      if (st.player.phase !== "street") return false; // 检查：仅街头阶段
      if (!st.weather || st.weather.current !== "heatwave") return false; // 检查：极端高温天气
      if (!st.trade || st.trade.currentLocation !== "commercialDist")
        return false; // 检查：身处商圈
      if ((st.player.day || 0) < 15) return false; // 检查：day≥15
      if (st.flags && st.flags._heatwaveFaintSeen) return false; // 检查：未触发过
      return true;
    },
    probability: 0.04, // [PLACEHOLDER] 待 playtest 调参
    repeatable: false,
    choices: [
      {
        text: "🧊 进店歇脚，阿姨硬塞冰粉",
        hint: "心情+15，饥饱+10",
        apply: function (st) {
          st.flags._heatwaveFaintSeen = true; // 标记：防重复
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 15); // 心情+
          st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 10); // 饥饱+
          StateManager.addMessage(
            "阿姨的冰粉甜得发苦——是被人惦记的滋味。心情+15，饥饱+10。",
            "success",
          );
        },
      },
      {
        text: "🚶 谢过阿姨，硬撑着走了",
        hint: "fatigue+10（硬扛）",
        apply: function (st) {
          st.flags._heatwaveFaintSeen = true; // 标记：防重复
          _guardNeedsP8(st).fatigue = Math.min(100, (_guardNeedsP8(st).fatigue || 0) + 10); // 疲惫+
          StateManager.addMessage(
            "你谢过阿姨，咬牙走进了热浪里。疲惫+10。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "hunger_streak_neighbor_share",
    phase: "street",
    icon: "🍚",
    title: "连着饿的日子里",
    story:
      "这已经是你记不清第几个胃里空空的早晨。隔壁的租客老周敲了敲门，递来半袋米和一罐咸菜：「我吃不完，你先拿着。人不能连饭都吃不上。」你这才发现，自己已经连着好些天没正经吃过饭了。",
    conditions: function (st) {
      if (st.player.phase !== "street") return false; // 检查：仅街头阶段
      if (!st.flags || !st.flags._habits) return false; // 检查：习惯 flag 容器存在
      if ((st.flags._habits.lowHungerStreak || 0) < 3) return false; // 检查：连续饥饿≥3天（真实累积状态）
      if ((st.player.day || 0) < 10) return false; // 检查：day≥10
      if (st.flags._hungerShareSeen) return false; // 检查：未触发过
      return true;
    },
    probability: 0.06, // [PLACEHOLDER] 待 playtest 调参
    repeatable: false,
    choices: [
      {
        text: "🙏 收下，记下这份人情",
        hint: "饥饱+40，心情+10",
        apply: function (st) {
          st.flags._hungerShareSeen = true; // 标记：防重复
          st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 40); // 饥饱+
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 10); // 心情+
          StateManager.addMessage(
            "米下锅的那一刻，眼眶有点热。饥饱+40，心情+10。这份人情，你记下了。",
            "success",
          );
        },
      },
      {
        text: "🙅 推回去，说自己能行",
        hint: "心情+5（倔强），饥饱不变",
        apply: function (st) {
          st.flags._hungerShareSeen = true; // 标记：防重复
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 5); // 心情微+
          StateManager.addMessage(
            "你把米推了回去，说自己能行。老周没再劝，只是留了句「门别锁死」。心情+5。",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.91 联动事件（空白区填充·第三批） ======
  // 新增空白区：第二名 NPC 好感深挖（old_zhou）、雪天×位置情境（snowy）。
  // 全部 gate 在已验证字段：relationships.* / weather.current / player.phase / day。
  RANDOM_EVENTS.push({
    id: "old_zhou_story_relic",
    phase: "street",
    icon: "📻",
    title: "老周的老收音机",
    story:
      "你帮老周修了几次水管，他今儿破天荒拉你进屋，从床底拖出台蒙灰的收音机：「这是我爹留下的，文革那年他偷偷听外台，被带走前塞给我……你懂电路，能给它续口气不？」",
    conditions: function (st) {
      if (st.player.phase !== "street") return false; // 检查：仅街头阶段
      var r = st.relationships && st.relationships.old_zhou; // 检查：old_zhou 关系对象
      if (!r || !r.met) return false; // 检查：已结识
      if ((r.affinity || 0) < 50) return false; // 检查：好感≥50（深挖门槛）
      if ((st.player.day || 0) < 35) return false; // 检查：day≥35
      if (st.flags && st.flags._oldZhouRelicSeen) return false; // 检查：未触发过
      return true;
    },
    probability: 0.05, // [PLACEHOLDER] 待 playtest 调参
    repeatable: false,
    choices: [
      {
        text: "🔧 接过来，慢慢修",
        hint: "repair.xp +25，老周好感+10",
        apply: function (st) {
          st.flags._oldZhouRelicSeen = true; // 标记：防重复
          if (st.skills && st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 25; // 修理经验+
          var r = st.relationships && st.relationships.old_zhou;
          if (r) r.affinity = Math.min(100, (r.affinity || 0) + 10); // 好感+
          StateManager.addMessage(
            "你换上电容，电流声里飘出一段老戏。老周红了眼圈。repair 经验+25，老周好感+10。",
            "success",
          );
        },
      },
      {
        text: "📦 劝他捐给纪念馆",
        hint: "老周好感+5（价值观共鸣）",
        apply: function (st) {
          st.flags._oldZhouRelicSeen = true; // 标记：防重复
          var r = st.relationships && st.relationships.old_zhou;
          if (r) r.affinity = Math.min(100, (r.affinity || 0) + 5); // 好感+
          StateManager.addMessage(
            "你劝他：「这机器该被记住。」老周沉默良久，点了头。老周好感+5。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "snowy_commute_warmth",
    phase: "street",
    icon: "❄️",
    title: "雪天里的热豆浆",
    story:
      "入冬第一场雪，路滑得像抹了油。你趔趄着赶路，街角早餐铺的老板娘探出头：「哎哟摔着没有？进来暖和暖和，这杯豆浆算我请的。」她往杯子里多舀了一勺糖。",
    conditions: function (st) {
      if (st.player.phase !== "street") return false; // 检查：仅街头阶段
      if (!st.weather || st.weather.current !== "snowy") return false; // 检查：雪天
      if ((st.player.day || 0) < 15) return false; // 检查：day≥15
      if (st.flags && st.flags._snowyWarmthSeen) return false; // 检查：未触发过
      return true;
    },
    probability: 0.05, // [PLACEHOLDER] 待 playtest 调参
    repeatable: false,
    choices: [
      {
        text: "☕ 进店焐手，谢过老板娘",
        hint: "心情+15，卫生+5",
        apply: function (st) {
          st.flags._snowyWarmthSeen = true; // 标记：防重复
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 15); // 心情+
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 5); // 卫生+
          StateManager.addMessage(
            "热豆浆下肚，手也缓过来了。雪天里这点暖意，记很久。心情+15，卫生+5。",
            "success",
          );
        },
      },
      {
        text: "🙏 接过豆浆，急着赶路",
        hint: "心情+8（暖意），卫生不变",
        apply: function (st) {
          st.flags._snowyWarmthSeen = true; // 标记：防重复
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 8); // 心情+
          StateManager.addMessage(
            "你接过豆浆揣进怀里，朝老板娘鞠了一躬就跑。心里是暖的。心情+8。",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.92 空白区第四批（道德极端-boss贿赂 / 技能里程碑-烹饪 / 低心情邻居探访）======
  // 设计原则：全部门控于已验证 state 字段，零 A 类缺陷风险。

  // 空白区：道德极端分叉（职场线）
  // 联动：道德·职业·NPC(boss_li)·经济
  // 设计心理学：道德两难·沉没成本·身份认同
  RANDOM_EVENTS.push({
    id: "moral_extreme_boss_bribe",
    icon: "💼",
    title: "老板的“小信封”",
    phase: "corporate",
    probability: 0.05,
    repeatable: false,
    story:
      "加班到十点，老板李总把信封推到你面前：「这个月账上有点‘灵活空间’，你懂的。签了字，有你一份。」\n\n你看着那叠钞票，想起刚入职时立过的规矩。",
    conditions: function (st) {
      // 检查 必须已就业（才能遇到老板贿赂场景）
      if (!st.employment || !st.employment.currentJob) return false;
      // 检查 必须已认识老板李总
      var rel = st.relationships && st.relationships.boss_li;
      if (!rel || !rel.met) return false;
      // 检查 仅道德极端玩家（高道德或低道德），中间派不会遇到此两难
      if (!(st.player.morality >= 70 || st.player.morality <= 30)) return false;
      // 检查 游戏进程需足够长，职场关系已建立
      if (st.player.day < 50) return false;
      // 检查 一次性事件防刷
      if (st.flags._moralBribeSeen) return false;
      return true;
    },
    choices: [
      {
        text: "🙅 拒绝并提醒合规（+道德，+老板尊重，无现金）",
        hint: "高道德路线：守住底线，长期口碑更稳",
        apply: function (st) {
          st.flags._moralBribeSeen = true;
          st.player.morality = Math.min(100, st.player.morality + 3);
          var r = st.relationships.boss_li;
          if (r) r.affinity = Math.min(100, (r.affinity || 0) + 5);
          StateManager.addMessage(
            "你把信封推了回去。李总看了你一眼，没再说什么——但此后他交任务时更放心了。",
            "good",
          );
        },
      },
      {
        text: "💰 收下信封（＋现金，−道德，−老板长期信任）",
        hint: "低道德路线：短期收益，但埋下隐患",
        apply: function (st) {
          st.flags._moralBribeSeen = true;
          var cash = 800;
          st.finance = st.finance || {};
          st.finance.cash = (st.finance.cash || 0) + cash;
          st.player.morality = Math.max(0, st.player.morality - 8);
          var r = st.relationships.boss_li;
          if (r) r.affinity = Math.max(-100, (r.affinity || 0) - 10);
          StateManager.addMessage(
            "你收下了。钱进了口袋，可那晚你睡得不太踏实。",
            "bad",
          );
        },
      },
    ],
  });

  // 空白区：技能里程碑=专业人士视角（烹饪）
  // 联动：技能(cooking)·NPC(chef_chen)·经济
  // 设计心理学： mastery 反馈·身份转变（从学徒到行家）
  RANDOM_EVENTS.push({
    id: "cooking_expert_secret_recipe",
    icon: "🍳",
    title: "行家一眼看穿的配方",
    phase: "street",
    probability: 0.05,
    repeatable: false,
    story:
      "巷口新开的私房菜，你尝了一口就皱起眉——火候过了，酱油也放早了。老板娘还在得意地介绍‘秘方’。\n\n你忽然意识到：自己已经能尝出别人尝不出的门道了。",
    conditions: function (st) {
      // 检查 烹饪技能达到行家门槛
      var sk = st.skills && st.skills.cooking;
      if (!sk || sk.level < 40) return false;
      // 检查 游戏进程
      if (st.player.day < 30) return false;
      // 检查 一次性
      if (st.flags._cookingRecipeSeen) return false;
      return true;
    },
    choices: [
      {
        text: "👨‍🍳 主动指点老板娘（＋烹饪xp，＋与陈厨好感）",
        hint: "利他回馈，巩固行家身份",
        apply: function (st) {
          st.flags._cookingRecipeSeen = true;
          var sk = st.skills.cooking;
          sk.xp = (sk.xp || 0) + 40;
          var r = st.relationships && st.relationships.chef_chen;
          if (r && r.met) r.affinity = Math.min(100, (r.affinity || 0) + 8);
          StateManager.addMessage(
            "你随手提了两句，老板娘眼睛亮了：‘您是内行！’ 烹饪手感又精进了些。",
            "good",
          );
        },
      },
      {
        text: "🤫 默默记下心法（＋烹饪xp，自用）",
        hint: "低调打磨自身",
        apply: function (st) {
          st.flags._cookingRecipeSeen = true;
          var sk = st.skills.cooking;
          sk.xp = (sk.xp || 0) + 25;
          StateManager.addMessage(
            "你没多说，只在心里记下了那处火候。手艺，是自己的。",
            "normal",
          );
        },
      },
    ],
  });

  // 空白区：连续/深度低心情的邻里关怀
  // 联动：需求(happiness)·NPC·心理健康
  // 设计心理学：低谷被看见·社会资本缓冲·求助去污名
  // 说明：state 无 lowMoodStreak，改用 needs.happiness 阈值触发一次性关怀事件
  RANDOM_EVENTS.push({
    id: "low_mood_neighbor_visit",
    icon: "🫂",
    title: "隔壁的敲门声",
    phase: "street",
    probability: 0.05,
    repeatable: false,
    story:
      "你已经好几天没怎么出门了。傍晚，隔壁阿姨敲了敲门，端着一碗热汤：「小同志，一个人别总凑合。」\n\n你才发现自己最近确实闷得厉害。",
    conditions: function (st) {
      // 检查 心情处于深度低位（非 streak，用阈值）
      if (!st.needs || st.needs.happiness >= 18) return false;
      // 检查 游戏进程
      if (st.player.day < 15) return false;
      // 检查 一次性
      if (st.flags._lowMoodVisitSeen) return false;
      return true;
    },
    choices: [
      {
        text: "🗣️ 开门聊聊（＋心情，＋邻里好感）",
        hint: "接受关怀，缓解低谷",
        apply: function (st) {
          st.flags._lowMoodVisitSeen = true;
          _guardNeedsP8(st).happiness = Math.min(100, _guardNeedsP8(st).happiness + 15);
          // [自洽修复] 域B A类#3: 不再强制激活 aunt_wang
          var r = st.relationships && st.relationships.aunt_wang;
          if (r && r.met === true) {
            r.affinity = Math.min(100, (r.affinity || 0) + 6);
            StateManager.addMessage(
              "你开了门，隔壁王婶端着热汤进来。热气腾腾的汤下肚，心里也松了松。",
              "good",
            );
          } else {
            StateManager.addMessage(
              "你开了门，热气腾腾的汤下肚，心里也松了松。",
              "good",
            );
          }
        },
      },
      {
        text: "🚪 婉拒，说自己没事（无变化）",
        hint: "习惯独处，但错过一次连接",
        apply: function (st) {
          st.flags._lowMoodVisitSeen = true;
          StateManager.addMessage(
            "你谢过阿姨，关上门。屋子里又安静下来。",
            "normal",
          );
        },
      },
    ],
  });

  // ====== v3.93 空白区第五批（NPC好感深挖-小梅 / 天气×位置-台风避险）======
  // 设计原则：门控于已验证 state 字段，零 A 类缺陷风险。

  // 空白区：NPC 好感深挖（第二名女性线 — 小梅）
  // 联动：NPC(xiao_mei)·情感·技能(english)·职业
  // 设计心理学：关系破冰·隐藏面·互助契约
  RANDOM_EVENTS.push({
    id: "xiao_mei_affinity_discovery",
    icon: "🌸",
    title: "小梅的另一个样子",
    phase: "street",
    probability: 0.05,
    repeatable: false,
    story:
      "你常去的便利店，收银的小梅今天没怎么笑。趁没人的时候她低声说：「其实我晚上在准备自考……怕考不过。」\n\n你这才知道，这个总说‘欢迎光临’的姑娘，也有自己的硬仗。",
    conditions: function (st) {
      // 检查 必须已认识小梅
      var r = st.relationships && st.relationships.xiao_mei;
      if (!r || !r.met) return false;
      // 检查 好感需达到‘熟络’门槛才触发深层互动
      if ((r.affinity || 0) < 55) return false;
      // 检查 游戏进程
      if (st.player.day < 35) return false;
      // 检查 一次性
      if (st.flags._xiaoMeiDiscoverySeen) return false;
      return true;
    },
    choices: [
      {
        text: "📚 用自己的经验帮她捋复习思路（＋小梅好感，若英文高额外加成）",
        hint: "以过来人身份互助，关系升温",
        apply: function (st) {
          st.flags._xiaoMeiDiscoverySeen = true;
          var r = st.relationships.xiao_mei;
          var sk = st.skills && st.skills.english;
          var bonus = sk && sk.level >= 30 ? 10 : 0;
          r.affinity = Math.min(100, (r.affinity || 0) + 8 + bonus);
          StateManager.addMessage(
            "你把自己啃书的笨办法讲给她听。小梅眼睛弯起来：‘原来你也是这么熬过来的。’ 你们的距离近了些。",
            "good",
          );
        },
      },
      {
        text: "🤝 鼓励她就好，不多问（＋小梅好感，轻量）",
        hint: "保持分寸的温柔",
        apply: function (st) {
          st.flags._xiaoMeiDiscoverySeen = true;
          var r = st.relationships.xiao_mei;
          r.affinity = Math.min(100, (r.affinity || 0) + 4);
          StateManager.addMessage(
            "你只说‘肯定行，你这么拼’。小梅点点头，嘴角有了点笑意。",
            "normal",
          );
        },
      },
    ],
  });

  // 空白区：天气×位置（台风 + 城中村/贫民窟）
  // 联动：天气(typhoon)·位置(slum)·需求(safety)·社区
  // 设计心理学：极端情境下的互助·脆弱暴露·社会资本
  RANDOM_EVENTS.push({
    id: "typhoon_shelter_community",
    icon: "🌀",
    title: "台风夜的屋檐",
    phase: "street",
    probability: 0.06,
    repeatable: false,
    story:
      "台风预警拉响，你住在城中村的隔断房，窗户吱呀作响。楼下的房东阿姨挨家敲门：‘都到堂屋来，别在里头待着！’\n\n雨砸在铁皮上，像有人在擂鼓。",
    conditions: function (st) {
      // 检查 当前天气为台风
      if (!st.weather || st.weather.current !== "typhoon") return false;
      // 检查 当前位于城中村/贫民窟
      if (!st.trade || st.trade.currentLocation !== "slum") return false;
      // 检查 游戏进程
      if (st.player.day < 10) return false;
      // 检查 一次性
      if (st.flags._typhoonShelterSeen) return false;
      return true;
    },
    choices: [
      {
        text: "🏠 下楼和大家挤一屋（＋安全感，＋社区好感，−少许体力）",
        hint: "危难中抱团，积累社区资本",
        apply: function (st) {
          st.flags._typhoonShelterSeen = true;
          _guardNeedsP8(st).fatigue = Math.max(0, _guardNeedsP8(st).fatigue + 8);
          // [自洽修复] 域B A类#4: 不再强制激活 aunt_wang
          var r = st.relationships && st.relationships.aunt_wang;
          if (r && r.met === true) {
            r.affinity = Math.min(100, (r.affinity || 0) + 7);
            StateManager.addMessage(
              "一屋子人挤着，有人讲笑话，有人分橘子。王婶也在，给你塞了一瓣橘子。风雨再大，屋里是暖的。",
              "good",
            );
          } else {
            StateManager.addMessage(
              "一屋子人挤着，有人讲笑话，有人分橘子。风雨再大，屋里是暖的。",
              "good",
            );
          }
        },
      },
      {
        text: "😶 锁门硬扛（无变化，但错过社区联结）",
        hint: "独立但也孤立",
        apply: function (st) {
          st.flags._typhoonShelterSeen = true;
          StateManager.addMessage(
            "你没动。整夜听着风声，直到天亮。窗户没碎，但你有点后悔没下去。",
            "normal",
          );
        },
      },
    ],
  });

  // ====== v3.94 恢复块（2026-07-11 从 18f6f7f9 的 dist 取回，先前 v3.94 提交漏提 cross_system_events.js，本次补全）======
  RANDOM_EVENTS.push({
    id: "management_expert_team_conflict",
    icon: "🧭",
    title: "你一眼看出的症结",
    phase: "corporate",
    probability: 0.05,
    repeatable: false,
    story:
      "两个组员为排期吵得面红耳赤，老板李总头疼地看你：‘你来说说？’\n\n你没急着站队，而是把两人的任务拆开一看——冲突根本不在人，在接口定义不清。",
    conditions: function (st) {
      // [Layer3] 叙事涉及李总
      if (!st.relationships || !st.relationships.boss_li || !st.relationships.boss_li.met) return false;
      // 检查 管理技能达到行家门槛
      var sk = st.skills && st.skills.management;
      if (!sk || sk.level < 40) return false;
      // 检查 必须已就业（职场场景）
      if (!st.employment || !st.employment.currentJob) return false;
      // 检查 游戏进程
      if (st.player.day < 40) return false;
      // 检查 一次性
      if (st.flags._mgmtConflictSeen) return false;
      return true;
    },
    choices: [
      {
        text: "🗂️ 用框架重新拆解任务（＋管理xp，＋老板信任，＋心情）",
        hint: "以专业度立威，巩固协调者身份",
        apply: function (st) {
          st.flags._mgmtConflictSeen = true;
          var sk = st.skills.management;
          sk.xp = (sk.xp || 0) + 45;
          var r = st.relationships.boss_li;
          if (r) r.affinity = Math.min(100, (r.affinity || 0) + 6);
          _guardNeedsP8(st).happiness = Math.min(100, _guardNeedsP8(st).happiness + 6);
          StateManager.addMessage(
            "你三两下把乱麻捋顺。李总挑眉：‘可以啊。’ 那种‘被需要’的感觉，挺好。",
            "good",
          );
        },
      },
      {
        text: "🤐 和稀泥各打五十大板（轻量，无成长）",
        hint: "稳妥但错失立威机会",
        apply: function (st) {
          st.flags._mgmtConflictSeen = true;
          StateManager.addMessage(
            "你打了个圆场，两人不吵了，但问题还在。李总没说什么。",
            "normal",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "foggy_commute_misdirection",
    icon: "🌫️",
    title: "雾里撞见的热心人",
    phase: "street",
    probability: 0.05,
    repeatable: false,
    story:
      "大雾把整条街糊成了牛奶色，你在商圈转了三圈没找着地铁路口。正发懵，一个遛狗的大爷停住：‘小伙子，去地铁啊？顺着这墙根走就到了。’",
    conditions: function (st) {
      // 检查 当前天气为大雾
      if (!st.weather || st.weather.current !== "foggy") return false;
      // 检查 当前位于商圈
      if (!st.trade || st.trade.currentLocation !== "commercialDist")
        return false;
      // 检查 游戏进程
      if (st.player.day < 20) return false;
      // 检查 一次性
      if (st.flags._foggyCommuteSeen) return false;
      return true;
    },
    choices: [
      {
        text: "🙏 道谢并聊两句（＋心情，＋社区好感）",
        hint: "接受陌生善意，城市变温柔",
        apply: function (st) {
          st.flags._foggyCommuteSeen = true;
          _guardNeedsP8(st).happiness = Math.min(100, _guardNeedsP8(st).happiness + 5);
          var r = st.relationships && st.relationships.old_zhou;
          if (!r) {
            st.relationships = st.relationships || {};
            r = st.relationships.old_zhou = {
              met: true,
              affinity: 0,
              discovered: {},
            };
          } else {
            r.met = true;
          }
          r.affinity = Math.min(100, (r.affinity || 0) + 4);
          StateManager.addMessage(
            "你谢过大爷，顺着墙根真的摸到了路口。雾还没散，但心里亮了点。",
            "good",
          );
        },
      },
      {
        text: "🤳 低头开导航自己找（无变化）",
        hint: "独立解决",
        apply: function (st) {
          st.flags._foggyCommuteSeen = true;
          StateManager.addMessage(
            "你没多说，低头戳着手机绕了十分钟，总算上了地铁。",
            "normal",
          );
        },
      },
    ],
  });

  // ====== 装备品质奖励事件（老手/高好感NPC赠送精品装备） ======
  // 【事件】老工匠的馈赠
  RANDOM_EVENTS.push({
    id: "equipment_quality_reward",
    phase: "street",
    icon: "🔧",
    title: "老工匠的馈赠",
    story:
      "你在城中村闲逛时，遇到了一个退休的老工匠。他看你穿着朴素，问你：「小伙子/姑娘，你这身装备太差了。我家里有几件以前做的好东西，放着也是放着，你拿去吧。」\n\n他打开一个旧木箱，里面躺着一件保养得极好的装备。",
    conditions: function (st) {
      return (
        st.player.day > 90 &&
        (st.player.fame || 0) >= 15 &&
        !st.flags._equipmentQualityRewardShown
      );
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🙏 感激地收下",
        hint: "获得一件优质装备",
        apply: function (st) {
          st.flags._equipmentQualityRewardShown = true;
          // 随机选择一个有槽位的装备类型
          var slotItems = {
            head: ["straw_hat", "mask", "safety_helmet"],
            hand: ["work_gloves"],
            feet: ["sturdy_shoes", "work_boots"],
            body: ["work_uniform", "warm_coat", "reflective_vest"],
            accessory: ["backpack", "thermos", "power_bank"],
          };
          var slotKeys = Object.keys(slotItems);
          var chosenSlot = slotKeys[Random.int(0, slotKeys.length - 1)];
          var pool = slotItems[chosenSlot];
          var chosenId = pool[Random.int(0, pool.length - 1)];
          if (typeof createEquipmentInstance === "function") {
            var quality = Random.chance(0.3) ? "premium" : "fine";
            var newInst = createEquipmentInstance(chosenId, quality);
            if (newInst) {
              if (typeof initItemDurability === "function") {
                newInst = initItemDurability(newInst, {
                  slot: chosenSlot,
                  id: chosenId,
                });
              }
              st.inventory.equipmentInstances[chosenSlot] = newInst;
              st.inventory.equipment[chosenSlot] = chosenId;
              var itemDef =
                typeof getItemById === "function"
                  ? getItemById(chosenId)
                  : null;
              StateManager.addMessage(
                "🎁 你获得了" +
                  (quality === "premium" ? "★高档" : "◆优质") +
                  "品质的" +
                  (itemDef ? itemDef.name : chosenId) +
                  "！老工匠的眼光果然好。",
                "success",
              );
            }
          }
        },
      },
      {
        text: "💰 坚持付钱",
        hint: "道德+3，花¥200",
        cost: 200,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._equipmentQualityRewardShown = true;
          st.player.morality = Math.min(100, (st.player.morality || 0) + 3);
          StateManager.addMessage(
            "😊 老工匠推辞了几下，最后还是收了。「你是个实在人，有空来坐。」",
            "success",
          );
          // 仍然给装备，但品质降一级
          var slotItems2 = {
            head: ["straw_hat", "mask", "safety_helmet"],
            hand: ["work_gloves"],
            feet: ["sturdy_shoes", "work_boots"],
            body: ["work_uniform", "warm_coat", "reflective_vest"],
            accessory: ["backpack", "thermos", "power_bank"],
          };
          var slotKeys2 = Object.keys(slotItems2);
          var chosenSlot2 = slotKeys2[Random.int(0, slotKeys2.length - 1)];
          var pool2 = slotItems2[chosenSlot2];
          var chosenId2 = pool2[Random.int(0, pool2.length - 1)];
          if (typeof createEquipmentInstance === "function") {
            var newInst2 = createEquipmentInstance(chosenId2, "fine");
            if (newInst2) {
              if (typeof initItemDurability === "function") {
                newInst2 = initItemDurability(newInst2, {
                  slot: chosenSlot2,
                  id: chosenId2,
                });
              }
              st.inventory.equipmentInstances[chosenSlot2] = newInst2;
              st.inventory.equipment[chosenSlot2] = chosenId2;
              var itemDef2 =
                typeof getItemById === "function"
                  ? getItemById(chosenId2)
                  : null;
              StateManager.addMessage(
                "🎁 老工匠还是给了你一件" +
                  (itemDef2 ? itemDef2.name : chosenId2) +
                  "（优质品质）。",
                "success",
              );
            }
          }
        },
      },
      {
        text: "😅 谢谢，但我不需要",
        hint: "心智+2",
        apply: function (st) {
          st.flags._equipmentQualityRewardShown = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
          StateManager.addMessage(
            "你婉拒了老工匠的好意。他笑着说：「年轻人有志气，但该添的装备还是要添。」",
            "info",
          );
        },
      },
    ],
  });

  // ====== 旅行后续事件（after_travel 触发槽） ======
  // 【事件 A】旅行归来·新的视角
  RANDOM_EVENTS.push({
    id: "travel_perspective_shift",
    phase: "street",
    icon: "✈️",
    title: "旅行归来的感想",
    story:
      "回到熟悉的城市，你发现街道变得不太一样了。可能是旅行的后劲——那些在旅途中见过的风景、遇过的人，悄悄地改变了你。\n\n你站在车站出口，深吸一口气。这座城市似乎不再那么令你窒息了。",
    triggers: ["after_travel"],
    conditions: function (st) {
      return st.player.day > 30 && !st.flags._travelPerspectiveSeen;
    },
    probability: 1.0,
    repeatable: false,
    choices: [
      {
        text: "📝 把旅行感悟写进日记",
        hint: "心智+3，心情+5",
        apply: function (st) {
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
          st.flags._travelPerspectiveSeen = true;
          StateManager.addMessage(
            "📝 你坐在住处把这次的经历写了下来。有些路，走过才会懂。",
            "success",
          );
        },
      },
      {
        text: "💪 化旅行的动力为行动力",
        hint: "体质+2",
        apply: function (st) {
          st.player.physique = Math.min(100, (st.player.physique || 0) + 2);
          st.flags._travelPerspectiveSeen = true;
          StateManager.addMessage(
            "💪 旅途中看到别人活得那么用力，你觉得自己也不能松懈。",
            "success",
          );
        },
      },
      {
        text: "🛌 躺平休息，回味旅行",
        hint: "疲劳-20，心情+3",
        apply: function (st) {
          _guardNeedsP8(st).fatigue = Math.max(0, (_guardNeedsP8(st).fatigue || 0) - 20);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 3);
          st.flags._travelPerspectiveSeen = true;
          StateManager.addMessage(
            "😌 你躺在床上，翻看着旅行时拍的照片。美好的回忆本身就是力量。",
            "info",
          );
        },
      },
    ],
  });

  // 【事件 B】旅行中认识的新朋友
  RANDOM_EVENTS.push({
    id: "travel_new_friend",
    phase: "street",
    icon: "🤝",
    title: "旅行中认识的新朋友",
    story:
      "旅行的最后一天，你在青旅的公共区域遇到了一个很有意思的人。你们聊了一整晚——从旅行聊到人生，从工作聊到梦想。\n\n分别时，他/她说：「加个微信吧，以后去我那儿玩。」",
    triggers: ["after_travel"],
    conditions: function (st) {
      return (
        st.player.day > 60 &&
        (st.player.charm || 0) >= 25 &&
        !st.flags._travelNewFriendSeen
      );
    },
    probability: 0.8,
    repeatable: false,
    choices: [
      {
        text: "📱 加微信保持联系",
        hint: "人脉+2，名气+1",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
          st.player.charm = Math.min(100, (st.player.charm || 0) + 1);
          st.flags._travelNewFriendSeen = true;
          st.flags._travelFriendAdded = true;
          StateManager.addMessage(
            "📱 你们加了微信。朋友圈里又多了一个在不同城市生活的人——世界变大了。",
            "success",
          );
        },
      },
      {
        text: "🤗 合个影留念就好",
        hint: "心情+8",
        apply: function (st) {
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
          st.flags._travelNewFriendSeen = true;
          StateManager.addMessage(
            "📸 你们在青旅的留言墙前合了影。有些人注定只会出现在一段旅途中，但那份温暖是真实的。",
            "info",
          );
        },
      },
      {
        text: "😅 社恐发作，匆匆告别",
        hint: "无事发生",
        apply: function (st) {
          st.flags._travelNewFriendSeen = true;
          StateManager.addMessage(
            "你说了声「有缘再见」，然后低头快步走开了。有些人注定只是过客。",
            "normal",
          );
        },
      },
    ],
  });

  // ====================================================================
  // v3.95 loop R44 全系统优化·纽带回响（5个事件）
  // ① 调解后续：王婶×张姐和解宴（aunt_zhang_payoff）
  // ② 遗赠回响：阿杰跨周目再会彩蛋（ng_plus_ajie_return）
  // ③ NPC关系矩阵：赵姐×李工头业务牵线（npc_zhaojie_boss_li）
  // ④ NPC关系矩阵：赵姐×张姐合伙摆摊（npc_zhang_zhaojie_partner）
  // ====================================================================

  // ====================================================================
  // R44-① 调解后续·和解宴（王婶×张姐，30天后链式触发）
  // 触发条件：aunt_zhang_payoff 由 npc_auntwang_zhang_mediation 和
  //   npc_auntzhang_mediate（v3.90两个调解入口）通过 scheduleChainEvent 调起
  // 设计意图：调解不应是单发节点，峰终定律需要"和好"作为第二峰
  // ====================================================================
  RANDOM_EVENTS.push({
    id: "aunt_zhang_payoff",
    phase: "street",
    _isChainEvent: true,
    icon: "🍶",
    title: "和解宴",
    story:
      "今天一大早，王婶就敲你的门：「今晚来家里吃饭！张姐也来！」\n\n你到了才发现，那桌菜远比你想的隆重——红烧肉、清蒸鱼、还有一瓶存了三年的黄酒。王婶拉着张姐的手，当着你的面说：「那天要不是你在中间调停，我们俩真能吵到老死不相往来。」\n\n张姐难得地笑了笑，从包里推过来一个信封：「这是上次那个租客后来补的违约金，多亏你提醒我签合同，这次我没吃亏。」\n\n黄酒过三巡，两个人居然开始合伙商量——王婶找房源，张姐做中介，拉你入个小股。",
    conditions: function (st) {
      if (st.flags._auntZhangPayoffSeen) return false;
      if (!st.relationships) return false;
      var aw = st.relationships.aunt_wang;
      var sz = st.relationships.sister_zhang;
      if (!aw || !aw.met || !sz || !sz.met) return false;
      if ((aw.affinity || 0) < 30 || (sz.affinity || 0) < 30) return false;
      if (st.flags._auntZhangMediated !== true) return false;
      return true;
    },
    probability: 0.9,
    repeatable: false,
    choices: [
      {
        text: "🏡 答应入股（启动合伙事件链）",
        hint: "需现金≥¥2000，名气+10、人脉+1",
        apply: function (st) {
          st.flags._auntZhangPayoffSeen = true;
          st.flags._auntZhangPartnership = true;
          var seed = 2000;
          if ((st.resources.cash || 0) >= seed) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - seed);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
            StateManager.addMessage(
              "🏡 你拿出¥2000入了股。王婶和张姐笑得眼睛都没了——这条巷子，不再是她们的战场，而是你们三个人的起点。名气+10，现金-¥2000。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🏡 你说「想入但钱不够」。王婶笑着摆摆手：「不急，下回有了再入。」人情社会，欠着也舒服。",
              "info",
            );
          }
        },
      },
      {
        text: "🍶 只喝酒不入股",
        hint: "纯感情、零成本，心情+25",
        apply: function (st) {
          st.flags._auntZhangPayoffSeen = true;
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 25);
          StateManager.addMessage(
            "🍶 你摆摆手说「我就负责喝酒」。王婶笑骂了一句「没出息」，但给你又满上了一杯。心情+25。",
            "info",
          );
        },
      },
    ],
  });

  // ====================================================================
  // R44-② 遗赠回响·阿杰的跨周目彩蛋（多周目专属）
  // 触发条件（满足任一即可）：
  //   ① 多周目回归玩家（state.inheritanceBonuses 存在，即 NG+ 继承已生效）
  //   ② 本局已结识阿杰并完成深入委托（st.flags._ajieTrusted，表示与阿杰建立过命交情）
  //   且本局已遇到阿杰
  // 设计意图：兑现"上辈子认识的老朋友这辈子又遇见了"的情怀型彩蛋
  // ====================================================================
  RANDOM_EVENTS.push({
    id: "ng_plus_ajie_return",
    phase: "street",
    icon: "🌀",
    title: "似曾相识",
    story:
      "你在街上走着，一个瘦瘦的男人从对面过来，忽然停下脚步，直愣愣地看着你。\n\n「……哥们儿，我们是不是在哪儿见过？」\n\n他说不上来，你更说不上来。但你们看着彼此的时候，有一种奇怪的熟悉感，像一条河在梦里流过一次，第二次听见水声就认出来了。\n\n他挠挠头：「我叫阿杰。不知道为啥，觉得你面交。」",
    conditions: function (st) {
      if (st.flags._ngPlusAjieSeen) return false;
      if (
        !st.relationships ||
        !st.relationships.ajie ||
        !st.relationships.ajie.met
      )
        return false;
      if (st.player.day > 30) return false;
      var multiRun = !!st.inheritanceBonuses;
      var deepBond = !!st.flags._ajieTrusted;
      return multiRun || deepBond;
    },
    probability: 0.7,
    repeatable: false,
    choices: [
      {
        text: "🌀 也许，是在另一个梦里见过",
        hint: "好感+10、道德+5",
        apply: function (st) {
          st.flags._ngPlusAjieSeen = true;
          st.relationships.ajie.affinity = Math.min(
            100,
            (st.relationships.ajie.affinity || 0) + 10,
          );
          st.player.morality = Math.min(100, (st.player.morality || 0) + 5);
          StateManager.addMessage(
            "🌀 阿杰愣了一下，然后笑着拍了一下大腿：「对！就是这个感觉。」好感+10，道德+5。",
            "success",
          );
          if (typeof scheduleChainEvent === "function") {
            scheduleChainEvent(st, "ng_plus_ajie_payoff", 60, "street");
          }
        },
      },
      {
        text: "😅 认错人了吧，我叫XX",
        hint: "跳过彩蛋，无事发生",
        apply: function (st) {
          st.flags._ngPlusAjieSeen = true;
          StateManager.addMessage(
            "😅 阿杰尴尬地摆摆手：「啊对对对，认错人了。」",
            "normal",
          );
        },
      },
    ],
  });

  // R44-②b 阿杰跨周目回响·后续（60天后）
  RANDOM_EVENTS.push({
    id: "ng_plus_ajie_payoff",
    phase: "street",
    _isChainEvent: true,
    icon: "🔑",
    title: "老朋友的礼物",
    story:
      "阿杰今天忽然找上门，拿着一个皱巴巴的牛皮纸袋。\n\n「哥们儿，上次见面之后我总觉得对不住你——说不上来为啥。我这有朋友在郊区搞装修，缺小工，一天¥250，你要不要去？」\n\n他其实不需要解释。你就是觉得，这人交得住。",
    conditions: function (st) {
      if (st.flags._ngPlusAjiePayoffSeen) return false;
      if (st.flags._ngPlusAjieSeen !== true) return false;
      if (
        !st.relationships ||
        !st.relationships.ajie ||
        !st.relationships.ajie.met
      )
        return false;
      return true;
    },
    probability: 1.0,
    repeatable: false,
    choices: [
      {
        text: "🔑 收下工作，交这个朋友",
        hint: "固定工作线索解锁、好感+15",
        apply: function (st) {
          st.flags._ngPlusAjiePayoffSeen = true;
          st.flags._ajieReferred = true;
          st.relationships.ajie.affinity = Math.min(
            100,
            (st.relationships.ajie.affinity || 0) + 15,
          );
          StateManager.addMessage(
            "🔑 阿杰点点头：「够意思。」好感+15，家装小工工作线索已通过阿杰解锁。",
            "success",
          );
        },
      },
      {
        text: "🫰 谢谢，最近忙",
        hint: "婉拒、友情不变",
        apply: function (st) {
          st.flags._ngPlusAjiePayoffSeen = true;
          StateManager.addMessage(
            "🫰 阿杰摆摆手说「不好意思打扰了」。友情没变。",
            "info",
          );
        },
      },
    ],
  });

  // ====================================================================
  // R44-③ NPC关系矩阵：赵姐×李工头 业务牵线（business 类型）
  // 设计意图：NPC_RELATION_MATRIX 中 boss_li↔zhaojie 为 "business"，
  //   此前无任何事件消费此对。赵姐是做房产经纪的，李工头搞工地，
  //   两条线有天然的业务合作机会。
  // [自洽修复] 双守卫：boss_li.met && zhaojie.met、好感均≥25
  // ====================================================================
  RANDOM_EVENTS.push({
    id: "npc_zhaojie_boss_li",
    phase: "street",
    icon: "🏗️",
    title: "工地上的房产经纪",
    story:
      "你去看赵姐的时候，发现李工头居然也在，两个人坐在中介门店里喝茶，面前摊着一张户型图。\n\n赵姐看见你就招手：「来得正好。李工头那边工地有批工人要租房，我手上有几套城中村的房源，就是拿不准租金定多少合适。你帮我参谋参谋？」\n\n李工头嘿嘿一笑：「你脑子活，你来说。」",
    conditions: function (st) {
      if (st.flags._zhaojieBossLiSeen) return false;
      if (!st.relationships) return false;
      var zj = st.relationships.zhaojie;
      var bl = st.relationships.boss_li;
      if (!zj || !zj.met || !bl || !bl.met) return false;
      if ((zj.affinity || 0) < 25 || (bl.affinity || 0) < 25) return false;
      if (st.player.day < 40) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🧠 帮两方分析定价策略",
        hint: "心智≥35 触发三方好感+名气+5",
        apply: function (st) {
          st.flags._zhaojieBossLiSeen = true;
          if ((st.player.mental || 0) >= 35) {
            st.relationships.zhaojie.affinity = Math.min(
              100,
              (st.relationships.zhaojie.affinity || 25) + 8,
            );
            st.relationships.boss_li.affinity = Math.min(
              100,
              (st.relationships.boss_li.affinity || 25) + 8,
            );
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            StateManager.addMessage(
              "🧠 你画了一张简表：工人月薪¥6000~8000，可承受租金¥800~1200。按这个价格跑量，比高价少租划算。赵姐和李工头都点头——这笔生意成了。双方好感+8，名气+5。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🧠 你支支吾吾说了半天没说清楚。赵姐李工头互看一眼，笑着岔开了话题。下次再努力吧。",
              "warning",
            );
          }
        },
      },
      {
        text: "👋 我只租房，不谈业务",
        hint: "中立、不影响关系",
        apply: function (st) {
          st.flags._zhaojieBossLiSeen = true;
          StateManager.addMessage(
            "👋 你笑着摆手。赵姐说「没关系，有空常来坐。」",
            "info",
          );
        },
      },
    ],
  });

  // ====================================================================
  // R44-④ NPC关系矩阵：赵姐×张姐 合伙摆摊（business 类型·互补线）
  // 设计意图：sister_zhang↔zhaojie 同为 "business"，张姐摆摊揽客 +
  //   赵姐做地产带看，两人合资摊位分租可降低各自成本。
  // [自洽修复] 双守卫：sister_zhang.met && zhaojie.met、好感均≥25
  // ====================================================================
  RANDOM_EVENTS.push({
    id: "npc_zhang_zhaojie_partner",
    phase: "street",
    icon: "🤝",
    title: "摊位的合伙生意",
    story:
      "你路过巷口时，看见张姐正跟赵姐商量着什么。\n\n张姐手里攥着一沓手写价签：「我这个摊位一个月¥1500，你那边带客户看房是不是顺路？咱俩分租——白天你挂房产广告，早晚我摆摊卖卤味。」\n\n赵姐想了想：「那水电费怎么算？」\n\n两个人同时看向你：「你是文化人，你给拿个主意。」",
    conditions: function (st) {
      if (st.flags._zhangZhaojiePartnerSeen) return false;
      if (!st.relationships) return false;
      var zj = st.relationships.zhaojie;
      var sz = st.relationships.sister_zhang;
      if (!zj || !zj.met || !sz || !sz.met) return false;
      if ((zj.affinity || 0) < 25 || (sz.affinity || 0) < 25) return false;
      if (st.player.day < 50) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "📊 帮她们算一笔合伙账",
        hint: "智力≥35 触发三方好感+名气",
        apply: function (st) {
          st.flags._zhangZhaojiePartnerSeen = true;
          if ((st.player.intelligence || 0) >= 35) {
            st.relationships.zhaojie.affinity = Math.min(
              100,
              (st.relationships.zhaojie.affinity || 25) + 7,
            );
            st.relationships.sister_zhang.affinity = Math.min(
              100,
              (st.relationships.sister_zhang.affinity || 25) + 7,
            );
            st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
            StateManager.addMessage(
              "📊 你帮她们算清：分租后每人每月省¥600，水电均摊。赵姐和张姐当场拍板。双方好感+7，名气+4。",
              "success",
            );
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "npc_zhang_zhaojie_payoff", 30, "street");
            }
          } else {
            StateManager.addMessage(
              "📊 你算了半天把账算错了。赵姐和张姐哈哈大笑，决定自己商量。",
              "warning",
            );
          }
        },
      },
      {
        text: "😅 我只是来买个卤味",
        hint: "中立、过场",
        apply: function (st) {
          st.flags._zhangZhaojiePartnerSeen = true;
          StateManager.addMessage(
            "😅 张姐笑着夹了一块卤蛋给你：「慢慢吃。」",
            "info",
          );
        },
      },
    ],
  });

  // R44-④b 赵姐×张姐合伙后续（30天后）
  RANDOM_EVENTS.push({
    id: "npc_zhang_zhaojie_payoff",
    phase: "street",
    _isChainEvent: true,
    icon: "🛍️",
    title: "分租的回报",
    story:
      "一个月后，赵姐和张姐合伙的摊位成了巷口一景。张姐卤味卖得好，赵姐顺手带看了三套房——两单成交。\n\n今天她们拎着水果找到你：「多亏你当初那笔账，一个月省了一千二。下个月的水电费我们包了，算是谢你。」",
    conditions: function (st) {
      if (st.flags._zhangZhaojiePayoffSeen) return false;
      if (st.flags._zhangZhaojiePartnerSeen !== true) return false;
      if (!st.relationships) return false;
      return true;
    },
    probability: 1.0,
    repeatable: false,
    choices: [
      {
        text: "🛍️ 收下水果，祝生意兴隆",
        hint: "心情+20、小额现金回报",
        apply: function (st) {
          st.flags._zhangZhaojiePayoffSeen = true;
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 20);
          st.resources.cash = (st.resources.cash || 0) + 380;
          StateManager.addMessage(
            "🛍️ 赵姐和张姐一人塞给你一个红包，加起来¥380。合伙摊位口碑传开了。心情+20，现金+¥380。",
            "success",
          );
        },
      },
    ],
  });

  // ====================================================================
  // R44 同步修改：王婶调解两条路线接入 scheduleChainEvent(①)
  // 将 _auntZhangMediationSeen 语义扩展为调解结果标记，
  // 满足条件时写入 _auntZhangMediated=true，供 payoff 事件门控
  // ====================================================================

  // ========== 主题F：跨阶段桥接补强 (street → corporate) ==========
  // 设计意图：corporate 阶段仅 10 事件、street 655 事件，两系统几乎孤岛。
  // 以下事件把"街头积累的资产"（地点声望 / 硬技能）溢出到职场，形成双向桥。

  // F1：街头地点声望 → 职场猎头邀约（跨系统：reputation × corporate）
  RANDOM_EVENTS.push({
    id: "corp_reputation_headhunt",
    phase: "corporate",
    icon: "📞",
    title: "一个陌生来电",
    story:
      "下班路上手机响了，是个你没存号的号码。\n对方自称某大厂招聘负责人：「我们在行业里注意到你了——你在商业区/科技园区的口碑很好，有人向我们推荐。想不想聊聊？」\n你愣了一下。你从没投过这家公司。原来你在街坊间攒下的那点名声，自己不当回事，别人却记着。",
    conditions: function (st) {
      // 检查 处于职场阶段
      if (!(st.player && st.player.phase === "corporate")) return false;
      // 检查 街头积累的地点声望达门槛（商业区≥30 或 科技园≥25）
      var repComm = (st.reputation && st.reputation.commercialDist) || 0;
      var repTech = (st.reputation && st.reputation.techPark) || 0;
      if (repComm < 30 && repTech < 25) return false;
      // 检查 已在职场扎根（工作天数）
      var wd =
        (st.career && st.career.currentJob && st.career.currentJob.workDays) ||
        0;
      if (wd < 60) return false;
      // 检查 未触发过
      return !(st.flags && st.flags._corpRepHeadhunt);
    },
    probability: 0.3,
    repeatable: false,
    choices: [
      {
        text: "🤝 「我有兴趣，约个时间」",
        hint: "晋升意向+15，职场尊严+10，签约奖金 [PLACEHOLDER]",
        apply: function (st) {
          st.flags = st.flags || {};
          st.flags._corpRepHeadhunt = true;
          if (st.player.corporate) {
            st.player.corporate.upwardMgmt = Math.min(
              100,
              (st.player.corporate.upwardMgmt || 50) + 15,
            );
            st.player.corporate.dignity = Math.min(
              100,
              (st.player.corporate.dignity || 60) + 10,
            );
          }
          // 签约奖金：跨系统经济反馈
          var bonus = Random.int(2000, 6000); // [PLACEHOLDER] 依难度/通胀调整
          st.resources.cash = (st.resources.cash || 0) + bonus;
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
          st.player.mental = Math.max(0, (st.player.mental || 0) - 3); // 变动的轻微压力
          StateManager.addMessage(
            "🤝 三周后你拿到了 offer，含 ¥" +
              bonus +
              " 签字费。街坊口中的好名声，第一次变成了真金白银。晋升意向+15，职场尊严+10，心情+8。",
            "success",
          );
        },
      },
      {
        text: "🙅 「谢谢，我现在挺稳定的」",
        hint: "维持现状，但机会窗口关闭",
        apply: function (st) {
          st.flags = st.flags || {};
          st.flags._corpRepHeadhunt = true;
          _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 50) - 4);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 2); // 拒绝后的松口气
          StateManager.addMessage(
            "🙅 你婉拒了。挂掉电话那一刻有点可惜，但你也知道，现在不是冒险的时候。心情-4。",
            "info",
          );
        },
      },
    ],
  });

  // F2：街头硬技能 → 职场项目牵头（跨系统：skills × corporate × reputation）
  RANDOM_EVENTS.push(
    {
      id: "corp_skill_project_lead",
      phase: "corporate",
      icon: "🛠️",
      title: "「这个你熟，你来带」",
      story:
        "部门接了个跨业务的硬骨头项目，会上主管扫了一圈，目光停在你身上：\n「你在 X 上的底子，公司里没几个比得上——这活儿你来牵头，行不行？」\n你心里清楚，这门本事不是在公司学的，是那些年在外面接活、啃书、踩坑一点点磨出来的。职场终于看见了你身上那块街头的钢。",
      conditions: function (st) {
        if (!(st.player && st.player.phase === "corporate")) return false;
        // 检查 某项硬技能达专家门槛（编程/管理/会计，街头可积累）
        var coding =
          (st.skills && st.skills.coding && st.skills.coding.level) || 0;
        var mgmt =
          (st.skills && st.skills.management && st.skills.management.level) ||
          0;
        var acc =
          (st.skills && st.skills.accounting && st.skills.accounting.level) ||
          0;
        if (coding < 25 && mgmt < 25 && acc < 25) return false;
        // 检查 已在职场扎根
        var wd =
          (st.career &&
            st.career.currentJob &&
            st.career.currentJob.workDays) ||
          0;
        if (wd < 120) return false;
        return !(st.flags && st.flags._corpSkillLead);
      },
      probability: 0.32,
      repeatable: false,
      choices: [
        {
          text: "💪 「我来。」",
          hint: "晋升意向+12，项目奖金 [PLACEHOLDER]，科技园声望+3，压力+",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._corpSkillLead = true;
            if (st.player.corporate) {
              st.player.corporate.upwardMgmt = Math.min(
                100,
                (st.player.corporate.upwardMgmt || 50) + 12,
              );
            }
            var bonus = Random.int(1500, 4000); // [PLACEHOLDER] 依难度/通胀调整
            st.resources.cash = (st.resources.cash || 0) + bonus;
            if (st.reputation) {
              st.reputation.techPark = Math.min(
                100,
                (st.reputation.techPark || 0) + 3,
              );
            }
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 6);
            st.player.mental = Math.max(0, (st.player.mental || 0) - 5); // 牵头压力
            StateManager.addMessage(
              "💪 你接下了。三个月后项目交付，庆功宴上主管拍你肩膀。¥" +
                bonus +
                " 项目奖到账，科技园声望+3。晋升意向+12，心情+6，但那段时间你瘦了一圈。",
              "success",
            );
          },
        },
        {
          text: "🤝 「我推荐组里的小张，他更合适」",
          hint: "团队好感+，轻量回报，压力小",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._corpSkillLead = true;
            st.flags._teamGoodwill = (st.flags._teamGoodwill || 0) + 1;
            if (st.player.corporate) {
              st.player.corporate.upwardMgmt = Math.min(
                100,
                (st.player.corporate.upwardMgmt || 50) + 4,
              );
            }
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 2); // 让贤的轻松
            StateManager.addMessage(
              "🤝 你把机会让给了年轻同事。后来他真扛下来了，还专门来谢你。团队里你的口碑悄悄涨了。晋升意向+4，心情+5。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 全系统优化·Domain A 联动增强 (v3.97 循环R1) ======
    // 联动空白: economy_v3.1(财富税/市场饱和/动态利率)与 pricing.js(市场事件)
    // 均为"算而不显"——核心数值从未被任何事件引用或呈现给玩家。
    // 以下事件把隐形经济数据包装为玩家可感知的叙事决策。

    {
      id: "econ_wealth_tax_tier",
      phase: "street",
      icon: "⚖️",
      title: "财富税阶梯提示",
      story: `你盘了盘账：手头现金加上积蓄，已悄悄踏进更高的税阶。\n城市对高额资产征收累进财富税，每天从总资产里默默抽走一小笔。\n这不是惩罚，而是提醒你——钱"躺着"也会缩水，是时候考虑资产配置了。`,
      conditions: function (st) {
        var cash = (st.resources && st.resources.cash) || 0;
        var savings = st.savings || 0;
        var assets = cash + savings;
        var F = st.flags || {};
        // [PLACEHOLDER] 阈值对齐 economy_v3.1.WEALTH_TAX_THRESHOLDS，待调参
        var tier =
          assets >= 10000000
            ? 4
            : assets >= 2000000
              ? 3
              : assets >= 500000
                ? 2
                : assets >= 200000
                  ? 1
                  : 0;
        return (
          tier >= 2 && tier > (F._econTaxTier || 0) && (st.player.day || 0) > 20
        );
      },
      probability: 0.05, // [PLACEHOLDER] 触发权重待调参
      repeatable: true,
      choices: [
        {
          text: "📊 研究税务规划",
          hint: "标记税务意识，幸福感小幅+",
          apply: function (st) {
            var F = st.flags || {};
            st.flags = F;
            var cash = (st.resources && st.resources.cash) || 0;
            var savings = st.savings || 0;
            F._econTaxTier =
              cash + savings >= 10000000
                ? 4
                : cash + savings >= 2000000
                  ? 3
                  : cash + savings >= 500000
                    ? 2
                    : 1;
            F._taxPlanning = true;
            if (st.needs && st.needs.happiness !== undefined)
              _guardNeedsP8(st).happiness = Math.min(100, _guardNeedsP8(st).happiness + 3);
            StateManager.addMessage(
              "📊 你开始研究累进财富税，意识到资产结构需调整。税务意识+。",
              "info",
            );
          },
        },
        {
          text: "🏠 留意置业分散资产",
          hint: "标记置业意向",
          apply: function (st) {
            var F = st.flags || {};
            st.flags = F;
            var cash = (st.resources && st.resources.cash) || 0;
            var savings = st.savings || 0;
            F._econTaxTier =
              cash + savings >= 10000000
                ? 4
                : cash + savings >= 2000000
                  ? 3
                  : cash + savings >= 500000
                    ? 2
                    : 1;
            F._planProperty = true;
            StateManager.addMessage(
              "🏠 你留意起房价，打算把部分现金转成固定资产以摊薄税基。",
              "info",
            );
          },
        },
        {
          text: "💪 无所谓，继续赚钱",
          hint: "小幅掉幸福感",
          apply: function (st) {
            var F = st.flags || {};
            st.flags = F;
            var cash = (st.resources && st.resources.cash) || 0;
            var savings = st.savings || 0;
            F._econTaxTier =
              cash + savings >= 10000000
                ? 4
                : cash + savings >= 2000000
                  ? 3
                  : cash + savings >= 500000
                    ? 2
                    : 1;
            if (st.needs && st.needs.happiness !== undefined)
              if(st.needs) st.needs.happiness = Math.max(0, st.needs.happiness - 2);
            StateManager.addMessage("💪 你决定先不管税，赚钱要紧。", "info");
          },
        },
      ],
    },

    {
      id: "econ_wealth_tax_tier_corp",
      phase: "corporate",
      icon: "⚖️",
      title: "财富税阶梯提示",
      story: `薪水虽稳，但总资产已悄然跨入更高税阶。\nHR系统不会提醒你，城市的累进财富税却每天默默抽走一笔。\n职场人最容易忽视"睡着的钱"在交税——这正是对资产配置的温柔警告。`,
      conditions: function (st) {
        var cash = (st.resources && st.resources.cash) || 0;
        var savings = st.savings || 0;
        var assets = cash + savings;
        var F = st.flags || {};
        var tier =
          assets >= 10000000
            ? 4
            : assets >= 2000000
              ? 3
              : assets >= 500000
                ? 2
                : assets >= 200000
                  ? 1
                  : 0;
        return (
          tier >= 2 && tier > (F._econTaxTier || 0) && (st.player.day || 0) > 20
        );
      },
      probability: 0.05,
      repeatable: true,
      choices: [
        {
          text: "📊 研究税务规划",
          hint: "标记税务意识",
          apply: function (st) {
            var F = st.flags || {};
            st.flags = F;
            var cash = (st.resources && st.resources.cash) || 0;
            var savings = st.savings || 0;
            F._econTaxTier =
              cash + savings >= 10000000
                ? 4
                : cash + savings >= 2000000
                  ? 3
                  : cash + savings >= 500000
                    ? 2
                    : 1;
            F._taxPlanning = true;
            if (st.needs && st.needs.happiness !== undefined)
              _guardNeedsP8(st).happiness = Math.min(100, _guardNeedsP8(st).happiness + 3);
            StateManager.addMessage(
              "📊 你开始研究累进财富税与资产配置。税务意识+。",
              "info",
            );
          },
        },
        {
          text: "🏠 留意置业分散资产",
          hint: "标记置业意向",
          apply: function (st) {
            var F = st.flags || {};
            st.flags = F;
            var cash = (st.resources && st.resources.cash) || 0;
            var savings = st.savings || 0;
            F._econTaxTier =
              cash + savings >= 10000000
                ? 4
                : cash + savings >= 2000000
                  ? 3
                  : cash + savings >= 500000
                    ? 2
                    : 1;
            F._planProperty = true;
            StateManager.addMessage(
              "🏠 你留意起房价，打算把部分现金转成固定资产。",
              "info",
            );
          },
        },
        {
          text: "💪 无所谓，继续搬砖",
          hint: "小幅掉幸福感",
          apply: function (st) {
            var F = st.flags || {};
            st.flags = F;
            var cash = (st.resources && st.resources.cash) || 0;
            var savings = st.savings || 0;
            F._econTaxTier =
              cash + savings >= 10000000
                ? 4
                : cash + savings >= 2000000
                  ? 3
                  : cash + savings >= 500000
                    ? 2
                    : 1;
            if (st.needs && st.needs.happiness !== undefined)
              if(st.needs) st.needs.happiness = Math.max(0, st.needs.happiness - 2);
            StateManager.addMessage("💪 你决定先不管税，搞钱要紧。", "info");
          },
        },
      ],
    },

    {
      id: "econ_market_saturation",
      phase: "street",
      icon: "📉",
      title: "市场饱和预警",
      story: `你发现自己占这座城市财富的比重越来越高。\n常识告诉你：当个人资产占城市总财富比例过高，投资收益会边际递减——市场开始"消化"你的存在。\n这不是bug，是反膨胀设计的温柔刹车。`,
      conditions: function (st) {
        var cash = (st.resources && st.resources.cash) || 0;
        var savings = st.savings || 0;
        var assets = cash + savings;
        var cityWealth = st.cityWealth || 10000000; // 对齐 economy_v3.1 默认
        var ratio = assets / cityWealth;
        var F = st.flags || {};
        // [PLACEHOLDER] 阈值对齐 economy_v3.1.getMarketSaturationPenalty(normal=0.2)
        return ratio > 0.2 && (st.player.day || 0) - (F._satLastDay || 0) > 30;
      },
      probability: 0.05,
      repeatable: true,
      choices: [
        {
          text: "🛒 加大消费（购车置业）",
          hint: "花掉部分现金以降低占比",
          apply: function (st) {
            var F = st.flags || {};
            st.flags = F;
            F._satLastDay = st.player.day || 0;
            var cash = (st.resources && st.resources.cash) || 0;
            var spend = Math.min(cash, 100000);
            if (spend > 0) {
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - spend);
              StateManager.addMessage(
                "🛒 你花掉¥" + spend + "改善生活，资产占比回落，收益有望恢复。",
                "info",
              );
            } else {
              StateManager.addMessage("🛒 你本想消费，但现金不足。", "info");
            }
          },
        },
        {
          text: "📉 暂停扩张观望",
          hint: "标记观望，幸福感+",
          apply: function (st) {
            var F = st.flags || {};
            st.flags = F;
            F._satLastDay = st.player.day || 0;
            F._marketWatch = true;
            if (st.needs && st.needs.happiness !== undefined)
              _guardNeedsP8(st).happiness = Math.min(100, _guardNeedsP8(st).happiness + 2);
            StateManager.addMessage(
              "📉 你决定暂停激进投资，观望市场。",
              "info",
            );
          },
        },
        {
          text: "🚀 逆势加仓",
          hint: "赌一把，幸福感-",
          apply: function (st) {
            var F = st.flags || {};
            st.flags = F;
            F._satLastDay = st.player.day || 0;
            if (st.needs && st.needs.happiness !== undefined)
              if(st.needs) st.needs.happiness = Math.max(0, st.needs.happiness - 3);
            StateManager.addMessage(
              "🚀 你不信邪，逆势加仓。市场沉默以对。",
              "info",
            );
          },
        },
      ],
    },

    {
      id: "price_market_event_alert",
      phase: "street",
      icon: "📰",
      title: "物价异动播报",
      story: `街坊都在议论：最近市场上某种民生商品的价格不太对劲。\n有人在囤货，有人在抛售，信息就是钱。\n你决定留意一下这波行情。`,
      conditions: function (st) {
        if (
          !st.trade ||
          !st.trade.marketEvents ||
          !st.trade.marketEvents.length
        )
          return false;
        // [PLACEHOLDER] 民生商品白名单，对齐 pricing.js MARKET_EVENTS.goodId
        var staples = {
          water: 1,
          fruits: 1,
          vegetables: 1,
          beer: 1,
          cigarettes: 1,
          clothing: 1,
        };
        var F = st.flags || {};
        for (var i = 0; i < st.trade.marketEvents.length; i++) {
          var ev = st.trade.marketEvents[i];
          if (staples[ev.goodId] && ev.id !== (F._priceAlertId || ""))
            return true;
        }
        return false;
      },
      probability: 0.06,
      repeatable: true,
      choices: [
        {
          text: "🔍 关注并调整采购",
          hint: "标记关注该行情",
          apply: function (st) {
            var F = st.flags || {};
            st.flags = F;
            if (
              st.trade &&
              st.trade.marketEvents &&
              st.trade.marketEvents.length
            ) {
              var ev = st.trade.marketEvents[0];
              F._priceAlertId = ev.id;
              StateManager.addMessage(
                "🔍 你记下「" +
                  (ev.name || "某商品") +
                  "」的行情异动，打算顺势调整买卖。",
                "info",
              );
            } else {
              StateManager.addMessage("🔍 你留意起市场行情。", "info");
            }
          },
        },
        {
          text: "🤷 与我无关",
          hint: "不采取行动",
          apply: function (st) {
            StateManager.addMessage("🤷 你觉得这点波动影响不到自己。", "info");
          },
        },
      ],
    },

    // ====== [R2 域B 联动增强] 街头→职场桥接事件（治愈"阶段孤岛"：corporate 仅~10事件，street 655）======
    // 设计意图：让街头期积累的社会资本/硬技能在职场期产生叙事回报，
    // 打通 B(事件)↔C(职业)↔D(NPC社交) 三域，缓解跨阶段断档。

    // B↔C↔D：街头导师的隔空寄语
    {
      id: "corp_street_roots_letter",
      phase: "corporate",
      icon: "✉️",
      title: "来自街头的短信",
      story:
        "加班到深夜，手机一震。是当年在街头带你、给你第一个机会的那个人：\n「听说你进写字楼了，出息。别学那些弯弯绕绕的，当年怎么活下来的，就怎么做人。」\n\n你盯着屏幕，写字楼的冷气和当年城中村的汗味重叠了一瞬。",
      // 守卫：必须在 corporate 阶段，且确实存在一位"已结识 + 好感≥40"的街头导师
      conditions: function (st) {
        if (!st.player || st.player.phase !== "corporate") return false;
        if (st.flags && st.flags._corpRootsLetterSeen) return false;
        var rels = st.relationships || {};
        var hasMentor = ["old_zhou", "boss_li", "chef_chen", "aunt_wang"].some(
          function (id) {
            var r = rels[id];
            return r && r.met && (r.affinity || 0) >= 40;
          },
        );
        return hasMentor;
      },
      probability: 0.18, // [PLACEHOLDER] 职场期触发率待 playtest（参照 corp 池 0.22~0.4 基准）
      repeatable: false,
      choices: [
        {
          text: "💬 回条消息：记着呢",
          hint: "心情+10，标记初心",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._corpRootsLetterSeen = true;
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 10);
            if (st.player.corporate) {
              st.player.corporate.dignity = Math.min(
                100,
                (st.player.corporate.dignity || 60) + 4,
              );
            }
            StateManager.addMessage(
              "💬 你回了句「记着呢」，把手机扣在桌上。尊严+4，心情+10。",
              "success",
            );
          },
        },
        {
          text: "🗂️ 收下，继续赶报告",
          hint: "轻量 心情+3",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._corpRootsLetterSeen = true;
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 3);
            StateManager.addMessage("🗂️ 你截了图，继续改PPT。心情+3。", "info");
          },
        },
      ],
    },

    // B↔C：街头硬技能在职场意外立功
    {
      id: "corp_street_skill_advantage",
      phase: "corporate",
      icon: "🔧",
      title: "你那手本事派上用场了",
      story:
        "会议室投影仪接口烧了，IT 半天搞不定，甲方脸色越来越难看。\n你蹲下来看了眼线路——这活儿跟你当年在街头修摊子、接电线一个道理。三下五除二，画面亮了。\n全场安静一秒，接着有人鼓掌。",
      // 守卫：corporate 阶段 + 任意街头硬技能等级≥40（焊接/烹饪/维修/编程/会计/电工）
      conditions: function (st) {
        if (!st.player || st.player.phase !== "corporate") return false;
        if (st.flags && st.flags._corpStreetSkillSeen) return false;
        var sk = st.skills || {};
        var handy = [
          "welding",
          "cooking",
          "repair",
          "coding",
          "accounting",
          "electrician",
        ];
        var hasHandy = handy.some(function (id) {
          return (
            sk[id] && typeof sk[id].level === "number" && sk[id].level >= 40
          );
        });
        return hasHandy;
      },
      probability: 0.15, // [PLACEHOLDER] 待 playtest
      repeatable: false,
      choices: [
        {
          text: "🛠️ 低调收下掌声",
          hint: "职场声誉+8，心情+8",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._corpStreetSkillSeen = true;
            if (st.player.corporate) {
              st.player.corporate.dignity = Math.min(
                100,
                (st.player.corporate.dignity || 60) + 8,
              );
            }
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
            StateManager.addMessage(
              "🛠️ 你摆摆手说「随手的事」。职场声誉+8，心情+8。",
              "success",
            );
          },
        },
        {
          text: "🤝 顺手教IT小哥两招",
          hint: "人脉+，轻量声誉",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._corpStreetSkillSeen = true;
            if (st.player.corporate) {
              st.player.corporate.popularity = Math.min(
                100,
                (st.player.corporate.popularity || 50) + 5,
              );
            }
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
            StateManager.addMessage(
              "🤝 你顺手教了IT小哥，顺手攒了点好人缘。人气+5，心情+5。",
              "info",
            );
          },
        },
      ],
    },

    // B↔D：街头挚友的人脉反哺职场
    {
      id: "corp_npc_referral_from_street",
      phase: "corporate",
      icon: "🤝",
      title: "老关系的牵线",
      story:
        "微信弹出一条消息——是你在街头混时交下的一个朋友。\n「我表哥在你们行业做采购，前两天还问有没有靠谱的人。我把你微信推给他了，成不成看你本事。」\n\n你想起当年一起熬过的那些夜，忽然觉得这座城市没那么冷。",
      // 守卫：corporate 阶段 + 存在"已结识 + 好感≥60"的街头挚友 + 确有职场身份
      conditions: function (st) {
        if (!st.player || st.player.phase !== "corporate") return false;
        if (st.flags && st.flags._corpNpcReferralSeen) return false;
        if (
          !(st.career && st.career.currentJob) &&
          !(st.player.corporate && st.player.corporate.company)
        ) {
          return false;
        }
        var rels = st.relationships || {};
        var hasCloseFriend = Object.keys(rels).some(function (id) {
          var r = rels[id];
          return r && r.met && (r.affinity || 0) >= 60;
        });
        return hasCloseFriend;
      },
      probability: 0.12, // [PLACEHOLDER] 待 playtest
      repeatable: false,
      choices: [
        {
          text: "📞 主动加微信跟进",
          hint: "标记人脉线索，职场上行+6",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._corpNpcReferralSeen = true;
            st.flags._streetReferralActive = true;
            if (st.player.corporate) {
              st.player.corporate.upwardMgmt = Math.min(
                100,
                (st.player.corporate.upwardMgmt || 50) + 6,
              );
            }
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 6);
            StateManager.addMessage(
              "📞 你加了微信，聊得投缘。人脉线索已记下，职场上行+6，心情+6。",
              "success",
            );
          },
        },
        {
          text: "🙏 先道谢，暂不打扰",
          hint: "轻量 心情+3",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._corpNpcReferralSeen = true;
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 3);
            StateManager.addMessage(
              "🙏 你道了谢，把这份情记在心里。心情+3。",
              "info",
            );
          },
        },
      ],
    },

    // ====== [R2 域B 联动增强] 3个新事件填充已验证空白区 ======

    // ① NPC 社区聚会（填充 friendly格 8个空白）
    {
      id: "npc_neighborhood_gathering_v2",
      phase: "street",
      icon: "🎉",
      title: "街坊邻居的聚会",
      story:
        "傍晚收工，你发现巷子里比平时热闹。王大婶搬出了桌椅，老周拎了几瓶啤酒，陈师傅端着一盘花生米——他们招呼你：「愣着干嘛，今天街坊聚会，就差你了！」\\n\\n你在城市里第一次感受到——原来「邻居」不只是住得近的人。",
      conditions: function (st) {
        if (st.player.phase !== "street") return false;
        // 检查至少3个NPC好感≥50（真正融入社区）
        var count = 0;
        var rels = st.relationships || {};
        for (var key in rels) {
          if (rels[key].met && rels[key].affinity >= 50) count++;
        }
        if (count < 3) return false;
        if ((st.player.day || 0) < 30) return false;
        if (st.flags && st.flags._communityGatheringSeen) return false;
        return true;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🍺 坐下来，一起喝一杯",
          hint: "融入社区，好感群体+3，心情+12",
          apply: function (st) {
            st.flags._communityGatheringSeen = true;
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 12);
            // 群体好感+3
            var rels = st.relationships || {};
            for (var key in rels) {
              if (rels[key].met) {
                rels[key].affinity = Math.min(
                  100,
                  (rels[key].affinity || 0) + 3,
                );
              }
            }
            StateManager.addMessage(
              "🎉 你坐下和大家碰了杯。老周讲了个笑话，王大婶又给你夹了菜。全NPC好感+3，心情+12。",
              "success",
            );
          },
        },
        {
          text: "🙏 打个招呼，先回去休息",
          hint: "礼貌但保持距离，心情+5",
          apply: function (st) {
            st.flags._communityGatheringSeen = true;
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
            StateManager.addMessage(
              "🙏 你说累了想先休息，大家表示理解。回屋后还能听到外面的笑声，心里暖暖的。心情+5。",
              "info",
            );
          },
        },
      ],
    },

    // ② 春日生机（季节叙事：春天只有 job_fair 一个事件）
    {
      id: "weather_spring_awakening",
      phase: "street",
      icon: "🌱",
      title: "春天来了",
      story:
        "你推开窗，发现楼下那棵枯了一冬的梧桐树冒出了新芽。空气里有股潮湿的泥土味，混着远处早餐摊的蒸汽。\\n\\n王大婶在楼下喊：「今天太阳好，把被子拿出来晒晒！」巷子里突然有了生气，连流浪猫都伸了个懒腰。",
      conditions: function (st) {
        if (st.player.phase !== "street") return false;
        if (!st.weather || st.weather.season !== "spring") return false;
        if ((st.player.day || 0) < 15) return false;
        if (st.flags && st.flags._springAwakeningSeen) return false;
        return true;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🌞 出门晒晒太阳，感受春天",
          hint: "心情+10，疲劳-10，精神+3",
          apply: function (st) {
            st.flags._springAwakeningSeen = true;
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 10);
            _guardNeedsP8(st).fatigue = Math.max(0, (_guardNeedsP8(st).fatigue || 0) - 10);
            st.player.mental = Math.min(100, (st.player.mental || 10) + 3);
            StateManager.addMessage(
              "🌞 你在阳光下走了一圈，感觉整个人都活过来了。心情+10，疲劳-10，精神+3。",
              "success",
            );
          },
        },
        {
          text: "📋 趁着春天，好好规划一下",
          hint: "精神+5，获得「春日规划」buff",
          apply: function (st) {
            st.flags._springAwakeningSeen = true;
            st.player.mental = Math.min(100, (st.player.mental || 10) + 5);
            st.flags._springPlanBuff = true;
            StateManager.addMessage(
              "📋 你坐在窗前，听着鸟叫，把接下来的计划写了下来。精神+5，获得规划buff。",
              "hint",
            );
          },
        },
      ],
    },

    // ③ 乔迁之喜（高端住房叙事 gap）
    {
      id: "housing_mansion_celebration",
      phase: "street",
      icon: "🏠",
      title: "乔迁新居",
      story:
        "你终于搬进了像样的房子。不再是城中村的隔断间，不是地下室，而是一个有阳光、有厨房、有自己桌子的地方。\\n\\n你站在空荡荡的新房间里，突然不知道该做什么——这些年漂泊惯了，突然有了「家」，竟有些不习惯。",
      conditions: function (st) {
        if (st.player.phase !== "street") return false;
        // 住房等级≥4（有品质的住所）
        var tier = st.housing && st.housing.tier;
        if (!tier || tier < 4) return false;
        if ((st.player.day || 0) < 60) return false;
        if (st.flags && st.flags._housingMansionSeen) return false;
        return true;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🎊 简单办个暖房派对，请朋友来",
          hint: "NPC好感+5，心情+15，友情升温",
          apply: function (st) {
            st.flags._housingMansionSeen = true;
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 15);
            var rels = st.relationships || {};
            for (var key in rels) {
              if (rels[key].met) {
                rels[key].affinity = Math.min(
                  100,
                  (rels[key].affinity || 0) + 5,
                );
              }
            }
            StateManager.addMessage(
              "🎊 你请了几个朋友来家里吃饭。老周带了酒，王大婶包了饺子，他们说你「终于像个人样了」。全NPC好感+5，心情+15。",
              "success",
            );
          },
        },
        {
          text: "🕯️ 安静地待着，享受属于自己的空间",
          hint: "精神+8，心情+8",
          apply: function (st) {
            st.flags._housingMansionSeen = true;
            st.player.mental = Math.min(100, (st.player.mental || 10) + 8);
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
            StateManager.addMessage(
              "🕯️ 你坐在窗边，看着城市的灯火。第一次觉得，这座城市也有一盏灯是属于你的。精神+8，心情+8。",
              "success",
            );
          },
        },
      ],
    },

    // ====== 事件N+1：职场新人回望（corporation 阶段叙事锚点）======
    // 联动：corporate 阶段 + day≥180 → 回望街头岁月的成长
    // 设计心理学：峰终定律·成长弧光·社会比较（和过去的自己对比）
    {
      id: "corporate_first_quarter_reflection",
      phase: "corporate",
      icon: "🪞",
      title: "三个月后的回望",
      story:
        "你已经在这家公司待了三个月。今天加班到晚上九点，你站在写字楼的落地窗前，看着楼下的街道。\\n\\n街灯下，一个年轻人正蹲在路边吃炒面——就像你半年前的样子。\\n\\n手机震了一下，是老周发来的语音：「你小子现在混写字楼了？有空回来坐坐，废品站新收了台好收音机。」\\n\\n你笑了笑，没有立刻回复。\\n\\n这座城市还是那座城市。但你好像已经不是那个你了。",
      conditions: function (st) {
        // [Layer3] 叙事/apply涉及老周
        if (!st.relationships || !st.relationships.old_zhou || !st.relationships.old_zhou.met) return false;
        return (
          st.player &&
          st.player.phase === "corporate" &&
          st.player.day >= 180 &&
          st.career &&
          st.career.currentJob &&
          !st.flags._corpQuarterReflectionSeen
        );
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📝 给老周回条消息：周末回去",
          hint: "老周好感+5",
          apply: function (st) {
            st.flags._corpQuarterReflectionSeen = true;
            if (st.relationships && st.relationships.old_zhou) {
              st.relationships.old_zhou.affinity = Math.min(
                100,
                (st.relationships.old_zhou.affinity || 50) + 5,
              );
            }
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            StateManager.addMessage(
              "📝 你给老周回了个消息：「这周末回去，帮我留一碗炒面。」老周回了一个笑脸。心情+8，心智+3。",
              "success",
            );
          },
        },
        {
          text: "📸 拍张夜景发朋友圈",
          hint: "心情+5",
          apply: function (st) {
            st.flags._corpQuarterReflectionSeen = true;
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "📸 你拍了张窗外的夜景，配上文字：「走了很远的路，还有更远的路。」朋友圈一片点赞。心情+5，名气+2。",
              "success",
            );
          },
        },
        {
          text: "😌 继续干活，别矫情",
          hint: "效率+3",
          apply: function (st) {
            st.flags._corpQuarterReflectionSeen = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            _guardNeedsP8(st).fatigue = Math.min(100, (_guardNeedsP8(st).fatigue || 0) + 5);
            StateManager.addMessage(
              "😌 你回过神来，继续改方案。这座城市不会等你感慨。心智+5。",
              "hint",
            );
          },
        },
      ],
    },

    // ====== 事件N+2：张姐的祝贺（street→corporate 跨阶段 NPC 回响）======
    // 联动：corporate 阶段 + 张姐已认识 + day≥150 → 跨阶段 NPC 叙事闭环
    // 设计心理学：社会认同·峰终定律·禀赋效应（被看见的成就）
    {
      id: "npc_sister_zhang_corp_congrats",
      phase: "corporate",
      icon: "🎯",
      title: "张姐的祝贺",
      story:
        "你在写字楼电梯里刷手机时，看到了张姐发来的微信。\\n\\n「听说你现在在科技园上班了？可以啊！」\\n\\n后面跟了一条语音，你按开听筒：张姐的声音还是那么爽朗，「从当初在批发市场扛货到现在坐办公室，姐没看错你。周末有空没？我请你吃顿饭。」\\n\\n你站在电梯里，看着楼层数字跳到了 28。\\n\\n心里有点热。",
      conditions: function (st) {
        return (
          st.player &&
          st.player.phase === "corporate" &&
          st.player.day >= 150 &&
          st.relationships &&
          st.relationships.sister_zhang &&
          st.relationships.sister_zhang.met === true &&
          (st.relationships.sister_zhang.affinity || 0) >= 20 &&
          !st.flags._zhangCorpCongratsSeen
        );
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🍜 去！姐你请客我买单",
          hint: "张姐好感+8",
          apply: function (st) {
            st.flags._zhangCorpCongratsSeen = true;
            if (st.relationships && st.relationships.sister_zhang) {
              st.relationships.sister_zhang.affinity = Math.min(
                100,
                (st.relationships.sister_zhang.affinity || 50) + 8,
              );
            }
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 80);
            st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 20);
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 10);
            StateManager.addMessage(
              "🍜 你们约在了一家老字号面馆。张姐讲了很多你走后批发市场的变化。你请了客，花了¥80，但心里很暖。心情+10，张姐好感大增。",
              "success",
            );
          },
        },
        {
          text: "🙏 谢谢姐，但我最近太忙了",
          hint: "张姐好感+3",
          apply: function (st) {
            st.flags._zhangCorpCongratsSeen = true;
            if (st.relationships && st.relationships.sister_zhang) {
              st.relationships.sister_zhang.affinity = Math.min(
                100,
                (st.relationships.sister_zhang.affinity || 50) + 3,
              );
            }
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
            StateManager.addMessage(
              "🙏 你说最近项目赶。张姐说：「行，那你先忙。改天也行，姐又不跑。」心情+5。",
              "info",
            );
          },
        },
      ],
    },

    // ====================================================================
    // v3.99 (loop R3) 联动增强：博士毕业仪式
    // 设计意图：学历系统 edu=0/1/2/3，本科(edu_graduation_ceremony)和研究生
    //   (edu_white_collar_threshold)已有叙事，博士毕业智力+5但零事件回响。
    //   博士是最高学历档，应仪式感收尾（峰终定律）。
    // ====================================================================
    {
      id: "edu_phd_graduation",
      phase: "street",
      icon: "🎓",
      title: "博士毕业典礼",
      story:
        "五年寒窗，今天终于穿上红色的博士服。\n\n导师在你胸前拨穗那一刻，你突然想起第一天来大学城报到的自己——连图书馆的门朝哪边开都分不清。\n\n母亲在电话那头哭得说不出话，父亲只说了一句：「咱家第一个博士。」\n\n你的论文获评优秀，导师建议你留校或去研究所。但这么多年在外，你开始想家了。",
      conditions: function (st) {
        return (
          st.player &&
          st.player.education >= 3 &&
          !(st.flags && st.flags._phdGradSeen) &&
          st.player.day >= 600
        );
      },
      probability: 0.4,
      repeatable: false,
      choices: [
        {
          text: "🏛️ 接受研究所 offer，走学术路",
          hint: "智力+3，研究进度+2",
          apply: function (st) {
            st.flags._phdGradSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 50) + 3,
            );
            st.player.research = (st.player.research || 0) + 2;
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 15);
            StateManager.addMessage(
              "🏛️ 你选择了学术道路。研究所的Offer象征着多年钻研的回报，论文是新的起点。智力+3，研究+2。",
              "success",
            );
          },
        },
        {
          text: "💼 带着学位回商界",
          hint: "白领路径预备、薪资谈判+10%",
          apply: function (st) {
            st.flags._phdGradSeen = true;
            st.flags._phdNegotiateBonus = true;
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 10);
            StateManager.addMessage(
              "💼 你决定把学问变现。博士学位在职场是硬通货——未来的薪资谈判有了底气。谈判加成已解锁。",
              "info",
            );
          },
        },
        {
          text: "🚄 回家乡，照顾父母",
          hint: "道德+15、开启回乡抉择",
          apply: function (st) {
            st.flags._phdGradSeen = true;
            st.flags._homeboundAfterPhd = true;
            st.player.morality = Math.min(100, (st.player.morality || 50) + 15);
            StateManager.addMessage(
              "🚄 你买了回家的票。学历拿到了，但这些年缺席的家庭时光再也补不回来。父母老了，该陪着他们了。道德+15。",
              "success",
            );
          },
        },
      ],
    },

    // ====================================================================
    // v3.99 (loop R3) 联动增强：驾驶专业技能视角
    // 设计意图：driving 技能达到 Lv.40（熟练司机），触发「老司机」视角事件，
    //   让玩家感知技能成长的世界观变化（禀赋效应·专业视角解锁）。
    //   driving 技能目前无任何门槛叙事，仅通用满级事件。
    // ====================================================================
    {
      id: "skill_driving_road_sense",
      phase: "street",
      icon: "🚗",
      title: "老司机的路感",
      story:
        "深夜送完最后一批货，你抄小路往回开。\n\n导航显示前方有主路可走，但你凭直觉打了方向盘拐进一条黑漆漆的窄巷——果然，五分钟后远处传来主路交通事故的警笛声。\n\n这不是运气。跑了五年车，城市的每条路都刻在你脑子里。哪里有近道、哪个路口有摄像头、雨天哪段路会积水——身体自己就记住了。\n\n副座的年轻同事看呆了：「师父你怎么知道要绕路？」",
      conditions: function (st) {
        // [Layer3] 叙事涉及送完货
        if (!st.career || !st.career.currentJob) return false;
        return (
          st.skills &&
          st.skills.driving &&
          st.skills.driving.level >= 40 &&
          !(st.flags && st.flags._drivingRoadSenseSeen) &&
          st.player &&
          st.player.day >= 90
        );
      },
      probability: 0.15,
      repeatable: false,
      choices: [
        {
          text: "🧭 教他看路、认灯、听声",
          hint: "驾驶XP+20，道德+5（传承）",
          apply: function (st) {
            st.flags._drivingRoadSenseSeen = true;
            if (typeof addSkillXp === "function") addSkillXp("driving", 20);
            st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
            StateManager.addMessage(
              "🧭 你把五年跑车的经验倾囊相授。小伙子眼睛亮了——这就是老师傅的传承。驾驶XP+20，道德+5。",
              "success",
            );
          },
        },
        {
          text: "🤫 留一手，只教三成",
          hint: "驾驶XP+10，现金+800（日后收徒费）",
          apply: function (st) {
            st.flags._drivingRoadSenseSeen = true;
            if (typeof addSkillXp === "function") addSkillXp("driving", 10);
            st.resources.cash = (st.resources.cash || 0) + 800;
            StateManager.addMessage(
              "🤫 老话说「教会徒弟饿死师傅」。你藏了两手，等他求你的时候再慢慢教。驾驶XP+10，现金+800。",
              "info",
            );
          },
        },
      ],
    },

    // ====================================================================
    // v3.99 (loop R3) 联动增强：管理专业技能视角
    // 设计意图：management 技能达到 Lv.40（团队管理入门），触发「班子危机」
    //   视角事件。管理技能目前无专属门槛叙事。
    // ====================================================================
    {
      id: "skill_management_team_crisis",
      phase: "street",
      icon: "👥",
      title: "班子危机",
      story:
        "你带着的三人小团队里，老李和小张因为分工不公吵起来了。\n\n老李把手里的工具往地上一扔：「凭什么脏活儿都我干？」\n\n小张回嘴：「你跑得慢还怪我？」\n\n你当了半年小头目，第一次遇到这种局面。上头催着交工期，下面两个人瞪着对方不说话，等你的态度。\n\n你知道这时候说什么比做什么更重要。",
      conditions: function (st) {
        return (
          st.skills &&
          st.skills.management &&
          st.skills.management.level >= 40 &&
          st.player &&
          st.player.day >= 120 &&
          ((st.career &&
            st.career.currentJob &&
            st.career.currentJob.workDays) ||
            0) >= 60
        );
      },
      probability: 0.12,
      repeatable: false,
      choices: [
        {
          text: "🔍 先听两边再定方案",
          hint: "管理XP+25，团队稳定性+",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._mgmtCrisisResolved = true;
            if (typeof addSkillXp === "function") addSkillXp("management", 25);
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
            StateManager.addMessage(
              "🔍 你各打了五十大板又各给了台阶：重新分工、透明化派活。两个人虽然还有点拧巴，但都服气。管理XP+25。",
              "success",
            );
          },
        },
        {
          text: "⚡ 当场拍板，不许再说",
          hint: "管理XP+10，但留隐患",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._mgmtCrisisResolved = true;
            st.flags._mgmtCrisisHiddenRisk = true;
            if (typeof addSkillXp === "function") addSkillXp("management", 10);
            StateManager.addMessage(
              "⚡ 你强制执行了新分工，工期保住了。但老李阴阳怪气的眼神告诉你——这事没完。管理XP+10。",
              "warning",
            );
          },
        },
      ],
    },

    // ====== 域D NPC友好关系事件（v3.99b）======
    // 设计意图：消费 NPC_RELATION_MATRIX 中 8 个 friendly 未使用关系
    {
      id: "npc_friendly_wang_xiao_shopping",
      phase: "street",
      icon: "🛍️",
      title: "王大婶和小美约你逛街",
      story:
        "你路过商业街，远远看见王大婶和小美正站在一家服装店门口比划着什么。\n\n王大婶先看见你：「嘿！来得正好！小美说这家店打折，我说质量一般，你来看看这布料值不值这个价？」\n\n小美笑着说：「王姐非说我是个冤大头，你给评评理！」\n\n两人都看着你，等你表态。",
      conditions: function (st) {
        if (!st.relationships) return false;
        var aw = st.relationships.aunt_wang;
        var xm = st.relationships.xiao_mei;
        return (
          aw &&
          aw.met &&
          aw.affinity >= 20 &&
          xm &&
          xm.met &&
          xm.affinity >= 20 &&
          !st.flags._npcFriendlyWangXiaoSeen &&
          st.player.day >= 30
        );
      },
      probability: 0.025,
      repeatable: false,
      choices: [
        {
          text: "🛒 帮小美说话，说这料子值",
          hint: "小美好感+5，王大婶好感+2",
          apply: function (st) {
            st.flags._npcFriendlyWangXiaoSeen = true;
            if (st.relationships.aunt_wang)
              st.relationships.aunt_wang.affinity = Math.min(
                100,
                (st.relationships.aunt_wang.affinity || 0) + 2,
              );
            if (st.relationships.xiao_mei)
              st.relationships.xiao_mei.affinity = Math.min(
                100,
                (st.relationships.xiao_mei.affinity || 0) + 5,
              );
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
            StateManager.addMessage(
              "🛍️ 你仔细看了看料子，说这做工确实值这个价。小美得意地朝王大婶一扬下巴。王大婶笑着摇头：「你们年轻人啊，花钱不眨眼。」王大婶好感+2，小美好感+5。",
              "success",
            );
          },
        },
        {
          text: "🧐 站王大婶这边，说划不来",
          hint: "王大婶好感+5，小美好感+2",
          apply: function (st) {
            st.flags._npcFriendlyWangXiaoSeen = true;
            if (st.relationships.aunt_wang)
              st.relationships.aunt_wang.affinity = Math.min(
                100,
                (st.relationships.aunt_wang.affinity || 0) + 5,
              );
            if (st.relationships.xiao_mei)
              st.relationships.xiao_mei.affinity = Math.min(
                100,
                (st.relationships.xiao_mei.affinity || 0) + 2,
              );
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            StateManager.addMessage(
              "🧐 你摸着料子摇了摇头：「这面料洗几次就起球，不值这个价。」王大婶满意地点头：「还是你会过日子。」小美嘟着嘴：「好吧，听你的。」王大婶好感+5，小美好感+2，智力+1。",
              "info",
            );
          },
        },
        {
          text: "😅 你们聊，我先走了",
          hint: "不参与",
          apply: function (st) {
            st.flags._npcFriendlyWangXiaoSeen = true;
            StateManager.addMessage(
              "😅 你摆摆手说还有事要忙。两人继续争论着，你听到身后传来王大婶的大嗓门和小美的笑声。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "npc_friendly_zhou_chen_teahouse",
      phase: "street",
      icon: "🍵",
      title: "老周和陈哥的茶局",
      story:
        "你路过老城区的一家小茶馆，透过玻璃窗看到老周和陈哥正坐在靠窗的位置下棋。\n\n老周先看见你，隔着玻璃招手让你进来。陈哥回头看了一眼：「哟，来得正好！老周这棋臭得没法看，你来指点两招？」\n\n老周啐了一口：「少来！你上把输我三目的事忘了？」\n\n两个人都在笑，看得出来是老交情了。",
      conditions: function (st) {
        if (!st.relationships) return false;
        var oz = st.relationships.old_zhou;
        var cg = st.relationships.chen_ge;
        return (
          oz &&
          oz.met &&
          oz.affinity >= 20 &&
          cg &&
          cg.met &&
          cg.affinity >= 20 &&
          !st.flags._npcFriendlyZhouChenSeen &&
          st.player.day >= 45
        );
      },
      probability: 0.02,
      repeatable: false,
      choices: [
        {
          text: "♟️ 坐下来指点两招",
          hint: "智力+2，老周+陈哥好感各+3",
          apply: function (st) {
            st.flags._npcFriendlyZhouChenSeen = true;
            if (st.relationships.old_zhou)
              st.relationships.old_zhou.affinity = Math.min(
                100,
                (st.relationships.old_zhou.affinity || 0) + 3,
              );
            if (st.relationships.chen_ge)
              st.relationships.chen_ge.affinity = Math.min(
                100,
                (st.relationships.chen_ge.affinity || 0) + 3,
              );
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
            StateManager.addMessage(
              "♟️ 你坐下来，看了一会儿盘面，指出老周的一步妙手。陈哥拍桌：「我说什么来着！你小子就是藏了一手！」老周咧嘴笑，给你倒了杯茶。智力+2，老周+陈哥好感各+3。",
              "success",
            );
          },
        },
        {
          text: "☕ 坐下来喝茶聊天",
          hint: "心情+8，老周好感+2",
          apply: function (st) {
            st.flags._npcFriendlyZhouChenSeen = true;
            if (st.relationships.old_zhou)
              st.relationships.old_zhou.affinity = Math.min(
                100,
                (st.relationships.old_zhou.affinity || 0) + 2,
              );
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
            _guardNeedsP8(st).fatigue = Math.max(0, (_guardNeedsP8(st).fatigue || 0) - 10);
            StateManager.addMessage(
              "☕ 你坐下端起茶杯，听两人聊最近的行情。老周说废品价格要涨，陈哥说工地缺人。你喝着茶听着，觉得城市里能有几个说得上话的人，也挺好。心情+8，疲劳-10。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "npc_friendly_lin_zhou_market_tip",
      phase: "street",
      icon: "🧺",
      title: "林阿姨和老周的菜场密语",
      story:
        "你在批发市场碰到林阿姨在挑菜，旁边老周居然也在，正帮林阿姨拎着袋子。\n\n林阿姨看到你：「小X！来得正好！我和老周刚说这季的菜价要涨，你囤点干货准没错——老周你觉得呢？」\n\n老周点头：「嗯，我废品站那边最近纸箱和铜管回收价也在涨，经济有动静了。」\n\n两人都是这条街的老江湖，同时给你建议，这可不常见。",
      conditions: function (st) {
        if (!st.relationships) return false;
        var al = st.relationships.auntie_lin;
        var oz = st.relationships.old_zhou;
        return (
          al &&
          al.met &&
          al.affinity >= 20 &&
          oz &&
          oz.met &&
          oz.affinity >= 20 &&
          !st.flags._npcFriendlyLinZhouSeen &&
          st.player.day >= 60
        );
      },
      probability: 0.02,
      repeatable: false,
      choices: [
        {
          text: "📦 囤干货等涨价",
          hint: "花¥200，收益+50%",
          apply: function (st) {
            st.flags._npcFriendlyLinZhouSeen = true;
            st.flags._dryGoodsInvest = true;
            st.flags._dryGoodsDay = st.player.day;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            StateManager.addMessage(
              "📦 你听了两人的建议，花¥200囤了一批干货。林阿姨帮你挑的货，说放两个月没问题。智力+1。",
              "info",
            );
          },
        },
        {
          text: "🙏 谢谢两位，记下了",
          hint: "老周+林阿姨好感各+2",
          apply: function (st) {
            st.flags._npcFriendlyLinZhouSeen = true;
            if (st.relationships.old_zhou)
              st.relationships.old_zhou.affinity = Math.min(
                100,
                (st.relationships.old_zhou.affinity || 0) + 2,
              );
            if (st.relationships.auntie_lin)
              st.relationships.auntie_lin.affinity = Math.min(
                100,
                (st.relationships.auntie_lin.affinity || 0) + 2,
              );
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 3);
            StateManager.addMessage(
              "🙏 你认真记下了两人的建议。老周拍拍你肩膀：「年轻人肯听老人言，日子不会差。」林阿姨笑着塞了个苹果给你。",
              "success",
            );
          },
        },
      ],
    },

    // ====================================================================
    // R15 联动增强①：半夜做噩梦惊醒 — 高债务+低心情 → 心理回响
    // 联动域：债务 × 心理 × 道德
    // 设计意图：债务高压下的心理状态从未被叙事化，玩家只有数值没有情感体验
    // ====================================================================
    {
      id: "debt_nightmare_wake",
      phase: "street",
      icon: "😰",
      title: "半夜惊醒",
      story:
        "你从噩梦里猛地坐起来，后背全是冷汗。\n\n梦里的场景还历历在目：还款日到了，你翻遍口袋也凑不出那笔钱。电话一个接一个，催收的声音像钝刀子在割。你张了张嘴想解释，对方已经挂了。\n\n窗外天还黑着。你看了眼手机：凌晨3:47。\n\n离天亮还有几个小时，但你知道自己再也睡不着了。",
      conditions: function (st) {
        if (st.flags._debtNightmareSeen) return false;
        var debt = (st.resources && st.resources.debt) || 0;
        var cash = (st.resources && st.resources.cash) || 0;
        if (debt < 3000) return false;
        if (debt <= cash * 2) return false; // 还得起就不焦虑
        return st.player.day >= 15 && Random.chance(0.04);
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "💨 起身去便利店夜班 — 多赚一分是一分",
          hint: "疲劳+25 现金+¥150 心情-5",
          apply: function (st) {
            st.flags._debtNightmareSeen = true;
            _guardNeedsP8(st).fatigue = Math.min(100, (_guardNeedsP8(st).fatigue || 0) + 25);
            _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 0) - 5);
            st.resources.cash = (st.resources.cash || 0) + 150;
            StateManager.addMessage(
              "💨 你凌晨四点去了便利店搬货。天亮了结¥150。手在抖,但心里踏实一分是一分。疲劳+25，现金+¥150。",
              "warning",
            );
          },
        },
        {
          text: "📱 打电话给朋友借钱",
          hint: "有概率成功，好感-10",
          apply: function (st) {
            st.flags._debtNightmareSeen = true;
            if (Random.chance(0.4)) {
              var lendAmt = Random.int(500, 2000);
              st.resources.cash = (st.resources.cash || 0) + lendAmt;
              StateManager.addMessage(
                '📱 电话响了三声就接了。朋友说："转你了，不急还。"\n你看着到账通知§' +
                  lendAmt +
                  "，眼眶一热。有些人，借钱时才看得清。",
                "success",
              );
            } else {
              _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 0) - 8);
              StateManager.addMessage(
                "📱 电话响了很久。接起来那头说：「最近也紧张。」然后是一阵沉默，接着是忙音。你坐回床边,把脸埋进手里。",
                "warning",
              );
            }
          },
        },
        {
          text: "🌧️ 去阳台坐一会儿 — 等天亮",
          hint: "心情+10（接受现实的力量）",
          apply: function (st) {
            st.flags._debtNightmareSeen = true;
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 10);
            StateManager.addMessage(
              "🌧️ 你去阳台坐着,看这座城市的天际线一点点亮起来。债务还在,但你还在。新的一天,总有新办法。心情+10。",
              "info",
            );
          },
        },
      ],
    },

    // ====================================================================
    // R15 联动增强②：城管关系积累到一定程度 → 城管主动递烟"提醒"
    // 联动域：城管 × 社交 × 街头工作
    // 设计意图：chengguan.relationship 自 v3.22 引入以来，只有负面互动（逃跑/塞钱），
    //   没有"积累到一定关系后得到正面回馈"。关系≥25 时给一次正向反馈。
    // ====================================================================
    {
      id: "chengguan_relationship_tip",
      phase: "street",
      icon: "🚬",
      title: "城管老张递了根烟",
      story:
        "收摊时，那个每次来巡逻的城管老张居然没催你走，反而凑过来递了一根烟。\n\n「你小子，最近挺老实。」他点燃自己的那根，深吸一口。「告诉你个消息——下周这条路要搞文明示范街，所有临时摊位统一整顿。你要是想继续在这儿摆，后天去所里登个记，一个月¥200管理费，合法摆摊。」\n\n他弹了弹烟灰：「别人我不告诉，你这人还行，不给我添乱。」",
      conditions: function (st) {
        if (st.flags._chengguanTipSeen) return false;
        var cg = st.chengguan;
        if (!cg || !cg.relationship || cg.relationship < 25) return false;
        return st.player.day >= 45 && Random.chance(0.04);
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "📝 后天去所里登记",
          hint: "¥200管理费 → 永久合法摆摊 热度上限-30",
          apply: function (st) {
            st.flags._chengguanTipSeen = true;
            st.flags._legalVendor = true;
            var cg = st.chengguan;
            if (cg) {
              cg.relationship = Math.min(100, (cg.relationship || 0) + 5);
              cg.heat += 30; // 热度上限提升（能承受更多热度才触发巡逻）
            }
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
            StateManager.addMessage(
              "📝 你第三天去城管所登了记，交了¥200管理费。从此你在这条街合法摆摊，城管来了点个头就走。城里混，关系也是路。",
              "success",
            );
          },
        },
        {
          text: "💰 塞¥50给老张 — 不登记了",
          hint: "保持灰色地带，好感+3",
          apply: function (st) {
            st.flags._chengguanTipSeen = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
            var cg = st.chengguan;
            if (cg) cg.relationship = Math.min(100, (cg.relationship || 0) + 3);
            StateManager.addMessage(
              '💰 你笑嘻嘻塞了¥50到老张手里："小弟请你抽烟。"老张捏着钱哼了一声，没再说什么。',
              "info",
            );
          },
        },
        {
          text: "🙏 谢谢老张，我再想想",
          hint: "好感+2 无损失",
          apply: function (st) {
            st.flags._chengguanTipSeen = true;
            var cg = st.chengguan;
            if (cg) cg.relationship = Math.min(100, (cg.relationship || 0) + 2);
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 3);
            StateManager.addMessage(
              "🙏 你认真道了谢。老张摆摆手走了。有些路，要自己选。心情+3。",
              "info",
            );
          },
        },
      ],
    },

    // ====================================================================
    // R15 联动增强③：街头工作 × 技能协同 → "手艺升级"叙事事件
    // 联动域：工作 × 技能 × 经济收益
    // 设计意图：skill_work_synergy 子系统存在但从未通过随机事件呈现。
    //   当任一技能 level≥20 时，触发"手艺变现"抉择 — 是把技能当副业还是深耕主业。
    // ====================================================================
    {
      id: "skill_monetization_choice",
      phase: "street",
      icon: "🔧",
      title: "手艺与饭碗",
      story:
        "你在街头干活时，有人注意到你的手艺。\n\n「你这[手艺]做得不错啊，接不接私活？一单¥200~¥500，时间自由。」\n\n你知道这是条赚钱的路。但分心做私活，主业业绩会不会受影响？\n\n每个人都会面对这个选择：是把一门手艺当副业变现，还是全部精力砸在一条路上赌一把？",
      conditions: function (st) {
        if (st.flags._skillMonetizeSeen) return false;
        var skills = st.skills || {};
        var highSkill = Object.keys(skills).filter(function (k) {
          return skills[k] && (skills[k].level || 0) >= 20;
        });
        var hasJob = !!(st.employment && st.employment.currentJob);
        return (
          st.player.day >= 30 &&
          hasJob &&
          highSkill.length > 0 &&
          Random.chance(0.03)
        );
      },
      probability: 0.025,
      repeatable: false,
      choices: [
        {
          text: "💼 接副业 — 月多赚¥2000，倦怠+2/天",
          hint: "收入增加 倦怠累积",
          apply: function (st) {
            st.flags._skillMonetizeSeen = true;
            st.flags._sideSkillActive = true;
            st.flags._sideSkillDay = st.player.day;
            var skills = st.skills || {};
            var highSkill = Object.keys(skills).filter(function (k) {
              return skills[k] && (skills[k].level || 0) >= 20;
            });
            var sk = highSkill[Random.int(0, highSkill.length - 1)];
            st.player.charm = Math.min(100, (st.player.charm || 50) + 2);
            StateManager.addMessage(
              "💼 你接了副业。每天下班后多干两小时，月多赚¥2000。\n你的" +
                sk +
                "技能，成了第二收入来源。\n但你知道，这条路走到头，身体会先抗议。",
              "success",
            );
          },
        },
        {
          text: "🎯 不接 — 把主业做到极致",
          hint: "技能XP+50 绩效+10",
          apply: function (st) {
            st.flags._skillMonetizeSeen = true;
            var skills = st.skills || {};
            var highSkill = Object.keys(skills).filter(function (k) {
              return skills[k] && (skills[k].level || 0) >= 20;
            });
            var sk = highSkill[Random.int(0, highSkill.length - 1)];
            st.skills[sk].xp = (st.skills[sk].xp || 0) + 50;
            if (st.employment && st.employment.performance !== undefined) {
              st.employment.performance = Math.min(
                100,
                (st.employment.performance || 50) + 10,
              );
            }
            StateManager.addMessage(
              "🎯 你婉拒了私活。\n「先把一件事做好。」你这样告诉自己。\n接下来的日子里，你把时间都砸在了" +
                sk +
                "上。\n技能经验+50，业绩+10。极致，是另一种路线。",
              "info",
            );
          },
        },
        {
          text: "🤔 先观望 — 看三个月后再决定",
          hint: "好感无变化 信息+",
          apply: function (st) {
            st.flags._skillMonetizeSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 0) + 3);
            StateManager.addMessage(
              '🤔 你说"考虑考虑"。回去的路上你想了很多：到底哪条路才是对的？\n没人知道答案,但至少你开始想了。智力+1，心情+3。',
              "info",
            );
          },
        },
      ],
    },

    // ====================================================================
    // R15 联动增强④：天气 × 健康 × 心情 × 道德 — "雨中让伞"
    // 联动域：天气 × 健康状况 × 道德系统
    // 设计意图：下雨天事件rainy_umbrella/moral_pickpocket_extreme只考虑了"避雨"和"捡钱包"，
    //   从未涉及雨中帮助陌生人的道德抉择。而下雨天恰恰是城市最有人情味的时刻。
    // ====================================================================
    {
      id: "rainy_umbrella_stranger",
      phase: "street",
      icon: "☂️",
      title: "雨中的老人",
      story:
        "暴雨如注。你撑着伞匆匆赶路，突然看见路边一个老人没有伞，蹲在商店檐下瑟瑟发抖。\n\n他脚边散落着几个塑料袋——刚买的菜。雨水顺着他的头发往下淌。\n\n你想起来今天下班还有一个重要的活要赶过去。但如果淋这场雨，你昨天才刚好一点的感冒怕是要复发。\n\n老人抬起头看了你一眼。那一眼里没有哀求，只有一种认命的平静。",
      conditions: function (st) {
        if (st.flags._rainyUmbrellaSeen) return false;
        if (
          !st.weather ||
          (st.weather.current !== "rainy" && st.weather.current !== "stormy")
        )
          return false;
        if (st.status.health && st.status.health < 60) return false; // 健康太差自己走路都难
        return st.player.day >= 10 && Random.chance(0.05);
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🤝 把伞让给他 — 自己淋雨",
          hint: "健康-8 道德+8 心情+15",
          apply: function (st) {
            st.flags._rainyUmbrellaSeen = true;
            st.status.health = Math.max(0, (st.status.health || 70) - 8);
            st.player.morality = Math.min(100, (st.player.morality || 50) + 8);
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 15);
            st.flags._gaveUmbrella = true; // 供后续回响事件消费
            StateManager.addMessage(
              "🤝 你走过去把伞塞到老人手里。「你用，我年轻，没事。」\n老人握着伞，嘴张了张。\n你转身走进雨里，水流进脖子，凉得打了个哆嗦。\n但心里暖的。健康-8，道德+8，心情+15。",
              "success",
            );
          },
        },
        {
          text: "🏃 心里过意不去，但还是赶路了",
          hint: "道德-6 心情-10",
          apply: function (st) {
            st.flags._rainyUmbrellaSeen = true;
            st.player.morality = Math.max(0, (st.player.morality || 50) - 6);
            _guardNeedsP8(st).happiness = Math.max(0, (_guardNeedsP8(st).happiness || 50) - 10);
            StateManager.addMessage(
              "🏃 你低头快步走过去了。\n每走一步都觉得身后有道目光。\n你知道你做了合理的选择，但那个画面会在你脑子里停很久。道德-6，心情-10。",
              "warning",
            );
          },
        },
        {
          text: "📱 帮老人叫个网约车",
          hint: "¥30 道德+3 老人平安到家",
          apply: function (st) {
            st.flags._rainyUmbrellaSeen = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);
            st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
            _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
            st.flags._helpedElderTaxi = true;
            StateManager.addMessage(
              "📱 你帮老人叫了辆网约车，付了¥30。\n老人连声谢你。车来了，老人坐进去，雨被隔在了窗外。\n¥30，两不相欠。道德+3，心情+8。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 注册结束 ======
  );

  // ====== v3.99e 联动增强（R15 域B）=====
  // 3个新增事件填补：新闻×事件联动 / 极端天气消费 / 道德flag→NPC反应 空白

  // ====== P1-4 长线因果链（2026-07-16）=====
  // 3条链把单点事件串联为多步因果序列，复用 scheduleChainEvent 基础设施。

  // 链#1：王婶人情链 — 帮王婶 → 15天后她回报
  RANDOM_EVENTS.push({
    id: "a_wang_return",
    title: "🙏 王婶的回报",
    story: "上次你帮了王婶一把，她一直记在心里。今天她拎着一袋腌菜和熟鸡蛋来找你。",
    _isChainEvent: true,
    phase: "street",
    // [自洽修复] 域B A类#1: 补 aunt_wang.met 门控
    conditions: function (st) {
      return (st.relationships && st.relationships.aunt_wang && st.relationships.aunt_wang.met === true && st.relationships.aunt_wang.affinity >= 25) && st.player.day >= 15;
    },
    choices: [
      {
        text: "😊 收下，人情往来",
        hint: "心情+ 关系+",
        apply: function (st) {
          st.needs.hunger = Math.max(0, st.needs.hunger - 15);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
          if (st.relationships && st.relationships.aunt_wang) {
            st.relationships.aunt_wang.affinity = Math.min(100, (st.relationships.aunt_wang.affinity || 0) + 5);
          }
          StateManager.addMessage("🍱 王婶的腌菜够吃好几天。", "success");
        },
      },
      {
        text: "🙅 婉拒，举手之劳",
        hint: "道德+",
        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          if (st.relationships && st.relationships.aunt_wang) {
            st.relationships.aunt_wang.affinity = Math.min(100, (st.relationships.aunt_wang.affinity || 0) + 3);
          }
          StateManager.addMessage("🤝 王婶点点头：「你这孩子，心肠好。」", "info");
        },
      },
    ],
  });

  // 链#2：街坊口碑链 — 见义勇为 → 20天后口碑传播
  RANDOM_EVENTS.push({
    id: "street_rep_bonus",
    title: "🗣️ 街坊口碑传开了",
    story: "上回你仗义出手的事传开了。今天买菜，好几个摊主主动打招呼，卖水果的大姐塞了你几个橘子。",
    _isChainEvent: true,
    phase: "street",
    conditions: function (st) {
      return (st.player && st.player.morality >= 55) && st.player.day >= 25;
    },
    choices: [
      {
        text: "😄 跟街坊打成一片",
        hint: "名气+ 心情+",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
          StateManager.addMessage("🌟 你在这一带有了点小名气。", "success");
        },
      },
      {
        text: "😌 低调处理",
        hint: "心智+",
        apply: function (st) {
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage("🧘 你选择低调。", "info");
        },
      },
    ],
  });

  // 链#3：健康危机链 — 忽视健康 → 30天后危机爆发
  RANDOM_EVENTS.push({
    id: "health_crash_warning",
    title: "🏥 身体在报警",
    story: "你一直硬撑着。今天早上头晕得厉害，眼前发黑。隔壁大爷说：「别把身子骨熬坏了。」",
    _isChainEvent: true,
    phase: "street",
    conditions: function (st) {
      return st.flags._ignoredHealthWarnings >= 2 && st.player.day >= 30;
    },
    choices: [
      {
        text: "🏥 去医院检查",
        hint: "健康+ ¥-200",
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
          st.status.health = Math.min(100, (st.status.health || 100) + 15);
          st.flags._ignoredHealthWarnings = 0;
          StateManager.addMessage("💊 疲劳过度+轻度营养不良，医生开了药。", "info");
        },
      },
      {
        text: "💪 再扛一扛",
        hint: "风险：健康恶化",
        apply: function (st) {
          st.status.health = Math.max(0, (st.status.health || 100) - 10);
          st.flags._ignoredHealthWarnings = (st.flags._ignoredHealthWarnings || 0) + 1;
          if ((st.flags._ignoredHealthWarnings || 0) >= 3) {
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "health_crash_severe", 30, "street");
            }
          }
          StateManager.addMessage("😰 再撑一撑。身体不会一直等你。", "warning");
        },
      },
    ],
  });

  // 严重健康危机（链#3 第三阶段）
  RANDOM_EVENTS.push({
    id: "health_crash_severe",
    title: "🚑 倒下了",
    story: "你在街头一阵天旋地转后失去知觉。醒来时躺在医院里，护士递来缴费单——¥800。",
    _isChainEvent: true,
    phase: "street",
    conditions: function (st) {
      return st.player.day >= 5;
    },
    choices: [
      {
        text: "💳 借钱缴费",
        hint: "负债+ 健康恢复",
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 800);
          if ((st.resources.cash || 0) < 0) {
            st.resources.debt = (st.resources.debt || 0) + Math.abs(st.resources.cash);
            st.resources.cash = 0;
          }
          st.status.health = Math.min(100, (st.status.health || 100) + 25);
          st.flags._ignoredHealthWarnings = 0;
          StateManager.addMessage("💊 医生说再晚来两天就麻烦了。", "info");
        },
      },
      {
        text: "😤 签免责书出院",
        hint: "健康再恶化",
        apply: function (st) {
          st.status.health = Math.max(0, (st.status.health || 100) - 10);
          st.player.physique = Math.max(0, (st.player.physique || 0) - 2);
          StateManager.addMessage("🚶 你蹒跚走出医院，风吹过来，头还是晕的。", "warning");
        },
      },
    ],
  });

  // ====================================================================
  // R44 联动增强①：心智巅峰·清明（高心智里程碑 · B→A/G）
  // 联动域：属性(心智) × 需求(心情) × NPC社交
  // 设计意图：mental 是六大核心属性之一，但从未有过"心智巅峰"叙事。
  //   心理学：峰终定律（顿悟时刻成为峰值记忆）+ 自我实现（马斯洛顶层需求）
  //   mental≥82 + day≥120 时触发人生顿悟时刻，把数值成长转化为情感体验。
  // ====================================================================
  RANDOM_EVENTS.push({
    id: "mental_milestone_clarity",
    phase: "street",
    icon: "💎",
    title: "清明的瞬间",
    story:
      "你蹲在出租屋里整理杂物，翻出初来乍到时那件起球的外套和一本写满计划的笔记本。\n\n你一页页翻着——有些计划实现了，有些早就忘了。窗外阳光照进来，灰尘在光柱里慢慢转。你突然觉得脑子里从未这么清楚过：哦，原来我已经走到这里了。\n\n不是高兴，也不是难过，是一种很安静的明白。",
    conditions: function (st) {
      if (!st || !st.player) return false;
      if (st.flags._mentalClaritySeen) return false;
      if (st.player.day < 120) return false;
      if ((st.player.mental || 0) < 82) return false;
      return true;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "✍️ 把这个瞬间写下来",
        hint: "智力+2 心智+1 心情+10",
        apply: function (st) {
          st.flags._mentalClaritySeen = true;
          st.flags._wroteClarity = true;
          st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 2);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 10);
          StateManager.addMessage(
            "✍️ 你在笔记本空白页写下了一些字。笔停下的那一刻，胸口暖暖的。智力+2，心智+1，心情+10。",
            "success",
          );
        },
      },
      {
        text: "💬 找最亲近的人分享",
        hint: "心情+8 NPC好感+5（如果有）",
        apply: function (st) {
          st.flags._mentalClaritySeen = true;
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 8);
          var bestNpc = null, bestAff = 59;
          var rels = st.relationships || {};
          for (var nid in rels) {
            var r = rels[nid];
            if (r && r.met && (r.affinity || 0) > bestAff) { bestAff = r.affinity; bestNpc = nid; }
          }
          if (bestNpc) {
            rels[bestNpc].affinity = Math.min(100, (rels[bestNpc].affinity || 0) + 5);
            StateManager.addMessage(
              "💬 你去找了生命里那个人，把今天的感觉说了出来。对方静静地听，最后说：你真的变了很多。\n有些话，说出来才算数。心情+8，好感+5。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "💬 你翻遍手机，才发现没什么适合拨的号码。但这种明白的感觉，自己收着也挺好。心情+8。",
              "info",
            );
          }
        },
      },
      {
        text: "🧘 一个人坐着消化",
        hint: "心智+3 心情+5",
        apply: function (st) {
          st.flags._mentalClaritySeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
          StateManager.addMessage(
            "🧘 你就这么坐着，看光柱慢慢移到墙根。不说话，不记录。有些明白，自己知道就够了。心智+3，心情+5。",
            "info",
          );
        },
      },
    ],
  });

  // ====================================================================
  // R44 联动增强②：名气变现·代言（名声首次转化为经济机会 · B→D/E）
  // 联动域：名气子系统 × 经济 × 道德
  // 设计意图：fame 数值长期只有"被认出"类叙事，从未真正"变现"。
  //   心理学：禀赋效应（名气是资产要善用）+ 损失厌恶（拒绝怕失去机会）
  //   fame≥50 时有人请玩家当代言人，检验玩家价值观。
  // ====================================================================
  RANDOM_EVENTS.push({
    id: "fame_endorsement_offer",
    phase: "street",
    icon: "📢",
    title: "代言的邀约",
    story:
      "菜市场开小卖部的刘老板一脸笑意地拦住你：哎，你就是那个谁吧？我见过你——在这条街上你有名！\n\n他压低声音：帮个忙呗，月底我店里搞活动，你往店门口站一天，拍几张照，给大家笑着说两句。一天¥1000，怎么样？\n\n你瞥了眼他店里——烟酒混杂，广告写着喝XX酒，做阔过人。这不是什么体面广告，但钱是真的。",
    conditions: function (st) {
      if (!st || !st.player || st.player.day < 90) return false;
      if (st.flags._fameEndorseSeen) return false;
      return (st.player.fame || 0) >= 50;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "💰 收钱站一天",
        hint: "现金+¥1000 名气+5 道德-3",
        apply: function (st) {
          st.flags._fameEndorseSeen = true;
          st.resources.cash = (st.resources.cash || 0) + 1000;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
          StateManager.addMessage(
            "💰 你在店门口站了一整天。¥1000到账很快，但回家路上你一直在想——这张脸还能不能要。现金+¥1000，名气+5，道德-3。",
            "warning",
          );
        },
      },
      {
        text: "🤝 只收成本¥300",
        hint: "现金+¥300 名气+3 心情+5",
        apply: function (st) {
          st.flags._fameEndorseSeen = true;
          st.resources.cash = (st.resources.cash || 0) + 300;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 5);
          StateManager.addMessage(
            "🤝 你砍到了¥300。刘老板不太高兴，但你心里舒服。名字可以卖，但不能论斤卖。现金+¥300，名气+3，心情+5。",
            "success",
          );
        },
      },
      {
        text: "🙅 婉拒，名气不是这么用的",
        hint: "道德+5 心智+2",
        apply: function (st) {
          st.flags._fameEndorseSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          StateManager.addMessage(
            "🙅 你微笑着摇头。刘老板走的时候嘟囔了一句不识抬举。但你守住了底线——名气这东西，太容易贱卖。道德+5，心智+2。",
            "success",
          );
        },
      },
    ],
  });

  // ====================================================================
  // R44 联动增强③：王婶×陈师傅 从摊到厨（NPC友好格 · B→D）
  // 联动域：NPC关系矩阵 friendly格 × 食材经济
  // 设计意图：消费 NPC_RELATION_MATRIX 中 aunt_wang × chef_chen 友好关系。
  //   王婶是菜摊阿姨，陈师傅是餐馆厨师——天然食材供应链的两端。
  //   心理学：社会闭合理论（朋友的朋友是朋友）+ 关系资产
  // ====================================================================
  RANDOM_EVENTS.push({
    id: "npc_friendly_wang_chen_supply",
    phase: "street",
    icon: "🥬",
    title: "一条供应链上的两个熟人",
    story:
      "你拎着王婶刚给你留的一袋时蔬往回走，路过陈师傅的餐馆后门——陈师傅居然也在，正和王婶隔着板车说话。\n\n王婶看见你，招手：来得正好！陈师傅说我卖给他的菜新鲜，想让我每周固定供货——你给评评，他餐馆一天能消化多少斤？\n\n陈师傅搓着手笑：王姐的菜没得说，就是量不稳定。你能帮我俩搭个线，保证每周一三五各送二十斤，我给你俩都优惠。\n\n两个人都看着你，等你拿主意。",
    conditions: function (st) {
      if (!st || !st.relationships) return false;
      if (st.flags._npcFriendlyWangChenSeen) return false;
      var aw = st.relationships.aunt_wang;
      var cc = st.relationships.chef_chen;
      return (
        aw && aw.met && (aw.affinity || 0) >= 25 &&
        cc && cc.met && (cc.affinity || 0) >= 25 &&
        st.player.day >= 70
      );
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🤝 促成两人长期合作",
        hint: "王婶+陈师傅好感各+4 开启供应线",
        apply: function (st) {
          st.flags._npcFriendlyWangChenSeen = true;
          st.flags._wangChenSupply = true;
          if (st.relationships.aunt_wang)
            st.relationships.aunt_wang.affinity = Math.min(100, (st.relationships.aunt_wang.affinity || 0) + 4);
          if (st.relationships.chef_chen)
            st.relationships.chef_chen.affinity = Math.min(100, (st.relationships.chef_chen.affinity || 0) + 4);
          _guardNeedsP8(st).happiness = Math.min(100, (_guardNeedsP8(st).happiness || 50) + 6);
          StateManager.addMessage(
            "🤝 你帮两人敲定了送菜时间。王婶高兴——固定客源；陈师傅高兴——稳定供应。你搭了一根线，两个人都念你的好。王婶+陈师傅好感各+4，心情+6。",
            "success",
          );
        },
      },
      {
        text: "🥬 帮王婶谈个好价钱",
        hint: "王婶好感+6 陈师傅好感+1",
        apply: function (st) {
          st.flags._npcFriendlyWangChenSeen = true;
          if (st.relationships.aunt_wang)
            st.relationships.aunt_wang.affinity = Math.min(100, (st.relationships.aunt_wang.affinity || 0) + 6);
          if (st.relationships.chef_chen)
            st.relationships.chef_chen.affinity = Math.min(100, (st.relationships.chef_chen.affinity || 0) + 1);
          st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 1);
          StateManager.addMessage(
            "🥬 你帮王婶把供货价往上谈了两成。王婶笑着说还是你会过日子。陈师傅虽然多付了钱，但也服气。王婶好感+6，陈师傅+1，智力+1。",
            "success",
          );
        },
      },
      {
        text: "🍳 帮陈师傅压点成本",
        hint: "陈师傅好感+6 王婶好感+1",
        apply: function (st) {
          st.flags._npcFriendlyWangChenSeen = true;
          if (st.relationships.chef_chen)
            st.relationships.chef_chen.affinity = Math.min(100, (st.relationships.chef_chen.affinity || 0) + 6);
          if (st.relationships.aunt_wang)
            st.relationships.aunt_wang.affinity = Math.min(100, (st.relationships.aunt_wang.affinity || 0) + 1);
          st.player.charm = Math.min(100, (st.player.charm || 10) + 1);
          StateManager.addMessage(
            "🍳 你帮陈师傅把次货剔出去，按质定价。陈师傅感谢——成本控住了。王婶虽然少赚了点道理，但也认同——做生意不能骗自己人。陈师傅好感+6，王婶+1，魅力+1。",
            "success",
          );
        },
      },
    ],
  });
})();

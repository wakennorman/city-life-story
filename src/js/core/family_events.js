/**
 * 家庭联动事件 — 接入 state.family 子系统
 *
 * 设计意图：state.js 中的 family.parents.health / medicalCost / mortgage / children
 * 字段目前**没有任何随机事件读取或写入**。情感核心子系统处于沉睡状态。
 *
 * 本文件用 3 个高情感温度事件唤醒它：
 *   1. family_mother_sick     — 妈妈生病，手术费道德困境
 *   2. family_mortgage_overdue — 房贷逾期警告，经济压力与家庭责任
 *   3. family_father_birthday — 父亲生日，回乡抉择（时间×金钱×情感）
 *
 * 接入方式：与 cross_system_events.js 相同的 IIFE 注入模式
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._familyEventsLoaded) return;
  RANDOM_EVENTS._familyEventsLoaded = true;

  var FAMILY_EVENTS = [
    // ===== 事件1：妈妈生病（医疗费道德困境）=====
    // 联动：family.parents.mother.health + medicalCost + 道德值 + 经济
    {
      id: "family_mother_sick",
      phase: "street",
      icon: "🏥",
      title: "老家的电话",
      story:
        "深夜手机震了三下，是爸爸打来的。他的声音很哑：「你妈晕倒了，县医院查出来是胆结石，医生说要做手术……至少要准备两万块。」\\n\\n电话那头沉默了几秒：「家里能凑八千，剩下的……你看看能不能想想办法。」",
      // [已审查] 含 OR 逻辑（motherIll || firstTime），保留 conditions
      conditions: function (st) {
        if (!st.family || !st.family.parents || !st.family.parents.mother)
          return false;
        var motherIll = st.family.parents.mother.health !== "healthy";
        var firstTime =
          st.player.day >= 60 &&
          !st.flags._motherSickSeen &&
          Random.chance(0.04);
        return st.player.phase === "street" && (motherIll || firstTime);
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💸 立刻汇¥12,000（耗尽积蓄）",
          hint: "妈妈手术顺利进行，道德+10",
          apply: function (st) {
            st.flags._motherSickSeen = true;
            var cost = Math.min(12000, st.resources.cash);
            st.resources.cash -= cost;
            if (!st.family.parents.mother) st.family.parents.mother = {};
            st.family.parents.mother.health = "healthy";
            st.family.parents.mother.medicalCost = 0;
            st.player.morality = Math.min(100, (st.player.morality || 50) + 10);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
            StateManager.addMessage(
              "💸 你连夜汇了¥" +
                cost.toLocaleString() +
                "。三天后爸爸发来照片——妈已经能下床了，笑得有点虚弱。道德+10，心情+8。钱没了，但人还在。",
              "success",
            );
          },
        },
        {
          text: "💰 先汇¥5,000，剩余让家里借",
          hint: "折中方案，手术延期",
          apply: function (st) {
            st.flags._motherSickSeen = true;
            var cost = Math.min(5000, st.resources.cash);
            st.resources.cash -= cost;
            if (!st.family.parents.mother) st.family.parents.mother = {};
            // 手术延期，健康维持"观察中"
            st.family.parents.mother.health = "under_observation";
            st.family.parents.mother.medicalCost =
              st.family.parents.mother.medicalCost || 0;
            st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
            StateManager.addMessage(
              "💰 你汇了¥" +
                cost.toLocaleString() +
                "，说剩下的正在想办法。爸爸沉默着没说话，最后只说了句「你自己也要注意身体」。道德+3。手术要再拖一拖了。",
              "warning",
            );
          },
        },
        {
          text: "😔 实在凑不出，让家里先借钱",
          hint: "道德-8，母亲健康恶化风险",
          apply: function (st) {
            st.flags._motherSickSeen = true;
            if (!st.family.parents.mother) st.family.parents.mother = {};
            st.family.parents.mother.health = "declining";
            st.player.morality = Math.max(0, (st.player.morality || 50) - 8);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 12);
            StateManager.addMessage(
              "😔 你说手头实在紧。电话那头很久没声音，最后爸爸说「行，你别太挂念」。道德-8，心情-12。那天夜里你翻来覆去睡不着。",
              "warning",
            );
          },
        },
      ],
    },

    // ===== 事件2：房贷逾期警告（经济压力×家庭责任）=====
    // 联动：family.mortgage + cash + 心态
    {
      id: "family_mortgage_overdue",
      phase: "street",
      icon: "🏠",
      title: "房贷催收短信",
      story:
        "手机弹出一条短信：「您的住房贷款已逾期15天，剩余本金+罚息合计¥86,420。请尽快还款以免影响征信。如有困难请联系客户经理协商。」\\n\\n你盯着那个数字，想起这是爸妈掏了首付、你一直在供的那套房子。",
      // [conditions→triggers]
      triggers: {
        minDay: 90,
        excludeFlags: ["_mortgageOverdueSeen"],
      },
      conditions: function (st) {
        return (
          st.family &&
          st.family.mortgage &&
          st.family.mortgage.remainingDays > 0 &&
          st.resources.cash < (st.family.mortgage.monthlyPayment || 5000)
        );
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "💸 砸锅卖铁也要按时还",
          hint: "保护征信 + 家庭稳定",
          apply: function (st) {
            st.flags._mortgageOverdueSeen = true;
            var payment = st.family.mortgage.monthlyPayment || 5000;
            var actualPay = Math.min(payment, st.resources.cash);
            st.resources.cash -= actualPay;
            st.family.mortgage.remainingDays = Math.max(
              0,
              (st.family.mortgage.remainingDays || 360) - 30,
            );
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
            StateManager.addMessage(
              "💸 你咬牙还了¥" +
                actualPay.toLocaleString() +
                "。账户又见了底，但房子保住了。心情-5。",
              "info",
            );
          },
        },
        {
          text: "📞 联系客户经理协商延期",
          hint: "心智≥40可成功",
          apply: function (st) {
            st.flags._mortgageOverdueSeen = true;
            if ((st.player.mental || 0) >= 40) {
              st.family.mortgage.remainingDays =
                (st.family.mortgage.remainingDays || 360) + 60;
              st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
              StateManager.addMessage(
                "📞 你跟客户经理磨了两个小时，争取到两个月宽限期。征信没受影响。心智+2。有时候开口比硬扛聪明。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 8);
              st.flags._mortgagePenalty = true;
              StateManager.addMessage(
                "📞 对方说资料不全、态度暧昧，协商没成功。下个月还有罚息。心情-8。要是心智更高，也许能谈下来。",
                "warning",
              );
            }
          },
        },
        {
          text: "😶 先不管，挣钱要紧",
          hint: "征信受损，未来贷款困难",
          apply: function (st) {
            st.flags._mortgageOverdueSeen = true;
            st.flags._mortgagePenalty = true;
            st.flags._creditDamaged = true;
            st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
            StateManager.addMessage(
              "😶 你把手机扣过去，继续干活。但心里清楚这不是最后一次催收。道德-3，征信记录上会多一笔污点。",
              "warning",
            );
          },
        },
      ],
    },

    // ===== 事件3：父亲生日（回乡抉择·峰终定律）=====
    // 联动：day + 交通费 + 家庭关系阶段 + 名气（陪伴是最好的礼物）
    {
      id: "family_father_birthday",
      phase: "street",
      icon: "🎂",
      title: "爸爸的六十大寿",
      story:
        "家族群里沸腾了。大伯发了语音：「你爸六十大寿，今年无论如何要回来！」姑姑晒出了饭店定好的照片。\\n\\n你在群里打了几个字又删掉。回一趟家，路费加礼品至少三千，请三天假还要少赚好几百。但不回去……你不敢想隔壁邻居会怎么说。",
      // [conditions→triggers]
      triggers: {
        minDay: 120,
        excludeFlags: ["_fatherBirthdaySeen"],
      },
      conditions: function (st) {
        return (
          st.family &&
          st.family.parents &&
          st.family.parents.father &&
          st.family.parents.father.age >= 58
        );
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🚄 买票回去，给他一个惊喜",
          hint: "亲情最大化 + 家庭关系阶段提升",
          apply: function (st) {
            st.flags._fatherBirthdaySeen = true;
            var cost = Math.min(4000, Math.max(2000, st.resources.cash * 0.3));
            st.resources.cash -= cost;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 25);
            // 提升家庭关系阶段
            var stageOrder = [
              "stranger",
              "acquaintance",
              "friend",
              "good_friend",
              "crush",
              "dating",
              "engaged",
              "married",
            ];
            var cur = st.family.relationshipStage || "stranger";
            var idx = stageOrder.indexOf(cur);
            if (idx < stageOrder.length - 1) {
              st.family.relationshipStage = stageOrder[idx + 1];
            }
            if (!st.family.parents.father) st.family.parents.father = {};
            st.family.parents.father.companionship = Math.min(
              100,
              (st.family.parents.father.companionship || 10) + 20,
            );
            StateManager.addMessage(
              "🚄 你出现在饭店门口时，我爸愣了一下，然后假装生气地说「回来干嘛，浪费钱」。但那天晚上他喝了好多酒，一直在笑。心情+25，家庭关系升级，父陪伴+20。有些钱花出去才变成记忆。",
              "success",
            );
          },
        },
        {
          text: "💌 转¥1500红包 + 视频祝福",
          hint: "现代折中，心意到了",
          apply: function (st) {
            st.flags._fatherBirthdaySeen = true;
            var cost = Math.min(1500, st.resources.cash);
            st.resources.cash -= cost;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
            if (!st.family.parents.father) st.family.parents.father = {};
            st.family.parents.father.companionship =
              (st.family.parents.father.companionship || 10) + 8;
            StateManager.addMessage(
              "💌 群里爸爸发了语音：「收到了收到了，你在外面照顾好自己就行。」听起来很高兴，但总觉得缺了点什么。心情+8。",
              "info",
            );
          },
        },
        {
          text: "😶 假装信号不好，没看到群消息",
          hint: "省钱省情，道德-5",
          apply: function (st) {
            st.flags._fatherBirthdaySeen = true;
            st.player.morality = Math.max(0, (st.player.morality || 50) - 5);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 10);
            if (!st.family.parents.father) st.family.parents.father = {};
            st.family.parents.father.companionship = Math.max(
              0,
              (st.family.parents.father.companionship || 10) - 10,
            );
            StateManager.addMessage(
              "😶 你关了群通知。三天后妈妈单独发来一条语音，欲言又止。道德-5，心情-10，父陪伴-10。有些沉默比拒绝更伤人。",
              "warning",
            );
          },
        },
      ],
    },

    // ===== 公司阶段家庭事件（R30 新增）=====
    // 事件4：母亲手术费·公司阶段版
    {
      id: "corporate_mother_surgery",
      phase: "corporate",
      icon: "🏥",
      title: "母亲需要手术",
      story:
        "你接到老家电话，母亲血压持续升高，医生建议住院观察一周，费用大约¥5,000。\\n\\n你现在的公司手头比较宽裕，但你正在准备下一次市场推广，这笔钱如果拿去，营销计划就得延后。\\n\\n你犹豫了。公司是你的事业，母亲是你的根。",
      // [conditions→triggers]
      triggers: {
        minAge: 25,
        excludeFlags: ["_corpMotherSurgeryDone"],
      },
      conditions: function (st) {
        return st.corporate && st.resources.cash >= 10000;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "💰 全额支付手术费（公司资金-¥5,000，morality+3，mood+5）",
          hint: "亲情最大化",
          apply: function (st) {
            st.flags._corpMotherSurgeryDone = true;
            st.resources.cash = Math.max(0, st.resources.cash - 5000);
            st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "💰 你当场转了¥5,000给母亲。她电话那头说：你辛苦了，别太累。道德+3，心情+5。事业再大也大不过这一句话。",
              "success",
            );
          },
        },
        {
          text: "🏦 部分支付¥2,000，催家人分担（资金-¥2,000，morality+1）",
          hint: "折中方案",
          apply: function (st) {
            st.flags._corpMotherSurgeryDone = true;
            st.resources.cash = Math.max(0, st.resources.cash - 2000);
            st.player.morality = Math.min(100, (st.player.morality || 50) + 1);
            StateManager.addMessage(
              "🏦 你转了¥2,000，让父亲和弟弟凑剩下的。电话那头沉默了一会儿：行吧，我们想辦法。",
              "info",
            );
          },
        },
        {
          text: "📋 等营销结束再处理（morality-3，mood-8）",
          hint: "先顾事业，有心理负担",
          apply: function (st) {
            st.flags._corpMotherSurgeryDone = true;
            st.flags._corpMotherSurgeryDelay = true;
            st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
            StateManager.addMessage(
              "📋 你选择了先顾事业。挂掉电话后你坐了很久。道德-3，心情-8。夜里你梦见小时候母亲在灯下给你缝衣服的画面。",
              "warning",
            );
          },
        },
      ],
    },

    // 事件5：公司扩张·全家搬城市
    {
      id: "corporate_family_relocation",
      phase: "corporate",
      icon: "🏠",
      title: "全家搬来城市",
      story:
        "公司发展到第五人，你终于觉得自己有能力了。爸妈主动打来电话：我们不想再拖累你，但如果你愿意，我们想搬来城市帮你带孩子、做家务。\\n\\n搬来城市意味着你要给他们租一套房，月租大约¥1,200。这是一笔固定开销，但有人分担家务，你每天可以多挣两个小时。\\n\\n这是一道关于家与成本的选择题。",
      // [conditions→triggers]
      triggers: {
        excludeFlags: ["_corpFamilyRelocated"],
      },
      conditions: function (st) {
        return (
          st.corporate &&
          (st.corporate.employees || 0) >= 5 &&
          (st.corporate.level || 1) >= 2
        );
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🏡 接他们来，租房住（月租-¥1,200/天，mood+8）",
          hint: "亲情最大化 + 家务帮手",
          apply: function (st) {
            st.flags._corpFamilyRelocated = true;
            st.flags._familyInCity = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (!st.corporate.monthlyExpenses)
              st.corporate.monthlyExpenses = {};
            st.corporate.monthlyExpenses.familyRent = 1200;
            StateManager.addMessage(
              "🏡 你租了一间两居室，爸妈搬来了。妈说：终于能天天吃上热饭了。你每天下班回到家，饭已经好了——这是你在城市里最踏实的感觉。心情+8。",
              "success",
            );
          },
        },
        {
          text: "📞 婉拒，汇钱回老家装修（资金-¥8,000，mood+2）",
          hint: "给钱不接人",
          apply: function (st) {
            st.flags._corpFamilyRelocated = true;
            st.flags._familyStayedHometown = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 8000);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            StateManager.addMessage(
              "📞 你汇了¥8,000回老家，让父亲把房子翻修一下。妈说：你别太累，我们在老家挺好的。",
              "info",
            );
          },
        },
      ],
    },

    // 事件6：公司盈利·家庭分红仪式
    {
      id: "corporate_family_dividend",
      phase: "corporate",
      icon: "💎",
      title: "公司第一次分红",
      story:
        "公司月利润突破¥20,000，你可以开始给自己发分红了。但在此之前，你决定先给家里人打一笔钱。\\n\\n爸：你挣了这么多，给我们也分点。\\n\\n妈：你存着吧，买房用。\\n\\n你站在公司的办公室里，看着窗外的城市，突然意识到——你终于能让家人不再吃苦了。",
      // [conditions→triggers]
      triggers: {
        excludeFlags: ["_corpFamilyDividend"],
      },
      conditions: function (st) {
        return (
          st.corporate &&
          (st.corporate.level || 1) >= 3 &&
          (st.corporate.monthlyProfit || 0) >= 20000
        );
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 给家里打¥20,000，给父母买新车（funds-¥20k，mood+10，morality+5）",
          hint: "回报最大化",
          apply: function (st) {
            st.flags._corpFamilyDividend = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 20000);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
            st.achievements = st.achievements || [];
            st.achievements.push({
              id: "family_dividend",
              name: "回报家人",
              desc: "公司盈利后给家人发第一笔分红",
              date: st.player.day,
            });
            StateManager.addMessage(
              "💰 你给老家转了¥20,000，给父母买了辆五菱宏光。爸在电话那头声音有点抖：你小子，终于熬出来了。心情+10，道德+5。",
              "success",
            );
          },
        },
        {
          text: "💼 先攒首付，给家里打¥10,000（funds-¥10k，mood+5）",
          hint: "兼顾事业与亲情",
          apply: function (st) {
            st.flags._corpFamilyDividend = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 10000);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "💼 你给家里打了¥10,000，自己留了大部分准备买房。妈说：你心里有数就好。心情+5。",
              "info",
            );
          },
        },
      ],
    },
  ];

  // 注入到 RANDOM_EVENTS
  for (var i = 0; i < FAMILY_EVENTS.length; i++) {
    RANDOM_EVENTS.push(FAMILY_EVENTS[i]);
  }
})();

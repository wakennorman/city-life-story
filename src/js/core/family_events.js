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
      conditions: function (st) {
        // 家庭系统已初始化 + 母亲健康非"健康"状态 + 玩家有足够天数发展
        if (!st.family || !st.family.parents || !st.family.parents.mother)
          return false;
        // 母亲已患病 或 随机在长期存活后触发（首次发现病情）
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
      conditions: function (st) {
        // 有房贷 + 现金不足以覆盖（触发困境感）+ 天数足够
        return (
          st.player.phase === "street" &&
          st.family &&
          st.family.mortgage &&
          st.family.mortgage.remainingDays > 0 &&
          st.resources.cash < (st.family.mortgage.monthlyPayment || 5000) &&
          st.player.day >= 90 &&
          !st.flags._mortgageOverdueSeen
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
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.family &&
          st.family.parents &&
          st.family.parents.father &&
          st.family.parents.father.age >= 58 &&
          st.player.day >= 120 &&
          !st.flags._fatherBirthdaySeen
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
            st.family.parents.father.companionsion =
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
  ];

  // 注入到 RANDOM_EVENTS
  for (var i = 0; i < FAMILY_EVENTS.length; i++) {
    RANDOM_EVENTS.push(FAMILY_EVENTS[i]);
  }
})();

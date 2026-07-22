/**
 * 域H(Phase2/公司) 联动增强 R170
 * 桥接：H→A(高管生活品质回填生活需求/开启生活方式通胀) / H→C(资深带教反哺职业成长) / H→D(职场向前辈请教社交)
 * 严格照 events_corp.js 已验证 IIFE 注入范式：phase:"corporate"、RANDOM_EVENTS 守卫、conditions 全字段防御、gameOver 闸门。
 * 引擎不自动扣 cost（仅禁用按钮），扣费在 apply 内手动执行。数值标 [PLACEHOLDER]，待平衡。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._corpLinkR170Loaded) return;
  RANDOM_EVENTS._corpLinkR170Loaded = true;

  var EVENTS = [
    {
      id: "corp_exec_lifestyle",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🥂",
      title: "高管的生活品质",
      story:
        "升到高位后，薪水水涨船高。你开始考虑要不要给自己换个更好的生活——私教、米其林、周末度假村。同事们说『赚得多也得花在刀刃上』，但你也清楚，这种生活方式一旦开始就很难回头。",
      triggers: { minDay: 30, excludeFlags: ["_execLifestyleSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false; // [Layer4-L4A] 死亡/破产后不再触发
        if (!st.player || !st.player.corporate) return false;
        var rankIdx = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(st.corporate.rank);
        if (rankIdx < 3) return false; // 仅 P8+ 高管可触发（有相应消费力）
        if ((st.resources.cash || 0) < 5000) return false; // [PLACEHOLDER] 消费门槛
        return true;
      },
      choices: [
        {
          text: "🥂 犒劳自己（¥[PLACEHOLDER]5000）",
          hint: "生活品质↑，但开启生活方式通胀",
          cost: 5000,
          apply: function (st) {
            st.flags._execLifestyleSeen = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5000); // 引擎不自动扣，手动扣
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            st.needs.health = Math.min(100, (st.needs.health || 50) + 8);
            st.flags._execLifestyleInflation = true; // H→A: 高生活标准，后续日常开销基线抬升（待 A 域消费系统读取）
            StateManager.addMessage("🥂 你给自己安排了一场久违的放松，身心都轻盈了不少。", "success");
          },
        },
        {
          text: "🏦 把钱攒起来",
          hint: "克制消费，现金+",
          apply: function (st) {
            st.flags._execLifestyleSeen = true;
            st.resources.cash = (st.resources.cash || 0) + 2000; // [PLACEHOLDER] 理财分红感
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage("🏦 你按捺住冲动，把这笔钱存了起来，心里反而踏实。", "info");
          },
        },
      ],
    },
    {
      id: "corp_mentor_newcomer",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🧑‍🏫",
      title: "带新人的机会",
      story:
        "部门来了个刚毕业的新人，主管点名让你带。带人费时费力，但也是攒管理资本、巩固地位的好机会——你带过的兵，将来都是你的人脉。",
      triggers: { minDay: 60, excludeFlags: ["_mentorNewcomerSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        var rankIdx = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(st.corporate.rank);
        if (rankIdx < 2) return false; // P7+ 才有带教资格
        if ((st.player.corpYear || 1) < 3) return false; // 至少在职 3 年
        return true;
      },
      choices: [
        {
          text: "🧑‍🏫 认真带，倾囊相授",
          hint: "管理+，职场声誉+",
          apply: function (st) {
            st.flags._mentorNewcomerSeen = true;
            st.player.corporate.upwardMgmt = Math.min(100, (st.player.corporate.upwardMgmt || 0) + 5);
            st.player.corporate.ability = Math.min(100, (st.player.corporate.ability || 0) + 3);
            st.flags._mentorCount = (st.flags._mentorCount || 0) + 1; // H→C: 带教计数，供职业传承/legacy 事件复用
            StateManager.addMessage("🧑‍🏫 新人进步飞快，主管也看在眼里，你的管理口碑更稳了。", "success");
          },
        },
        {
          text: "📋 应付了事",
          hint: "省心但错失机会",
          apply: function (st) {
            st.flags._mentorNewcomerSeen = true;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 2);
            StateManager.addMessage("📋 你随便指点了两句，新人似懂非懂——算了，自己忙自己的。", "info");
          },
        },
      ],
    },
    {
      id: "corp_seek_senior_advice",
      phase: "corporate",
      _isChainEvent: false,
      icon: "💬",
      title: "向前辈请教",
      story:
        "入职不久，你卡在一个项目上。组里的前辈经验丰富，要是能请教一二，或许能少走不少弯路。但你也有点犹豫——主动请教，会不会显得自己不行？",
      triggers: { minDay: 20, excludeFlags: ["_seniorAdviceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        var rankIdx = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(st.corporate.rank);
        if (rankIdx > 1) return false; // 仅 P5/P6 junior
        // H→D: 需已结识至少一位职场前辈(boss_li)
        if (!st.relationships || !st.relationships.boss_li || !st.relationships.boss_li.met) return false;
        return true;
      },
      choices: [
        {
          text: "💬 虚心请教 boss_li",
          hint: "好感+，KPI+",
          apply: function (st) {
            st.flags._seniorAdviceSeen = true;
            if (typeof applyAffinityChange === "function") {
              applyAffinityChange(st, "boss_li", 5, "向前辈请教");
            }
            st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 0) + 3);
            StateManager.addMessage("💬 boss_li 毫无保留地分享了经验，你们的关系更近了，项目也理顺了。", "success");
          },
        },
        {
          text: "🤔 自己硬扛",
          hint: "独立但更累",
          apply: function (st) {
            st.flags._seniorAdviceSeen = true;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 4);
            StateManager.addMessage("🤔 你咬牙自己啃下了难题，虽累，但底气又厚了一层。", "info");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

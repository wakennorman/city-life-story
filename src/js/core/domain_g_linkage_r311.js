/**
 * 域G(核心机制/生命周期) 联动增强 R311
 * 第七轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→E  life_wealth_milestone_v2     财富→经济事件（经济·时间积累）
 *   G→H  life_company_anniversary_v2  人生→公司周年（公司·时间里程碑）
 *   G→A  life_data_comprehensive      人生→综合数据（数据/数值·信息中枢）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR311Loaded) return;
  RANDOM_EVENTS._domainGLinkageR311Loaded = true;

  var EVENTS = [
    {
      id: "life_wealth_milestone_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "财富里程碑事件v2",
      story: "你的总资产达到了¥500,000！\n\n这个数字，一年前的你想都不敢想。你决定把这个时刻记录下来——不是作为炫耀，而是作为对未来的自己在低谷时的鼓励。\n\n「财富不仅是数字，也是你在这座城市努力活过的证据。」",
      triggers: { minDay: 400, excludeFlags: ["_lifeWealthMilestoneV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return total >= 500000;
      },
      choices: [
        {
          text: "💰 记录这个财富里程碑",
          hint: "心情+15，心智+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneV2Seen = true;
            st.flags._wealthMilestone500k = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你记录了财富里程碑。财富是你努力活过的证据。心情+15，心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续积累",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "life_company_anniversary_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🎉",
      title: "公司周年庆v2",
      story: "今天是公司成立两周年。\n\n你站在办公室里，看着墙上的营业执照，想起两年创业路上的点点滴滴。从一个人到一群人，从一个想法到一家公司。\n\n你决定举办一场周年庆典，感谢每一个陪伴公司走过来的伙伴。\n\n「创业不是短跑，是马拉松。」",
      triggers: { minDay: 730, excludeFlags: ["_lifeCompanyAnniversaryV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return st.player && st.player.day >= 730;
      },
      choices: [
        {
          text: "🎉 举办两周年庆典",
          hint: "公司声誉+12，心情+15",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCompanyAnniversaryV2Seen = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 12;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎉 你举办了两周年庆典。创业不是短跑，是马拉松。声誉+12，心情+15。", "success");
            }
          },
        },
        {
          text: "🤷 不用庆祝，继续干活",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCompanyAnniversaryV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用庆祝。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      id: "life_data_comprehensive",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "人生综合数据",
      story: "你打开人生综合数据面板，看到自己这些年的全方位指标——工作、收入、健康、社交、技能、投资、公司。\n\n这些数字和图表，是你在这座城市存在过的全方位证据。每一个指标都是一段真实经历的浓缩。\n\n你开始用数据「理解」自己的人生，而不是用感觉。",
      triggers: { minDay: 500, excludeFlags: ["_lifeDataComprehensiveSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 500;
      },
      choices: [
        {
          text: "📊 设置人生综合面板",
          hint: "心智+10，置综合数据flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeDataComprehensiveSeen = true;
            st.flags._comprehensiveDataHub = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了人生综合数据面板。数据让人生变得全面可见。心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用设置，大概了解就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeDataComprehensiveSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得大概了解就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

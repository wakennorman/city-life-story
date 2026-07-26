/**
 * 域G(核心机制/生命周期) 联动增强 R369
 * 第十四轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→H  life_company_milestone_v3   人生→公司里程碑（公司·时间积累）
 *   G→C  life_career_milestone_v5    人生→职业里程碑（职业/成长·时间积累）
 *   G→D  life_social_milestone_v3    人生→社交里程碑（NPC/社交·时间积累）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR369Loaded) return;
  RANDOM_EVENTS._domainGLinkageR369Loaded = true;

  var EVENTS = [
    {
      id: "life_company_milestone_v3",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "公司的里程碑",
      story: "你坐在办公室里，回想起公司从创立到现在的历程。\n\n从一个人的想法，到几个人的团队，再到现在的规模。\n\n每一个里程碑背后，都是团队的努力和你的坚持。\n\n「公司不仅是赚钱的工具，也是你在这个城市留下的印记。」",
      triggers: { minDay: 90, excludeFlags: ["_lifeCompanyMilestoneV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.startup && st.startup.company && (st.startup.company.reputation || 0) >= 20);
      },
      choices: [
        {
          text: "🏢 庆祝公司里程碑",
          hint: "心智+5，公司声誉+5，心情+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCompanyMilestoneV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你庆祝了公司里程碑。公司是你在这个城市留下的印记。心智+5，心情+5，声誉+5。", "success");
            }
          },
        },
        {
          text: "📋 继续前进",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCompanyMilestoneV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你继续前进。最好的里程碑是下一个。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "life_career_milestone_v5",
      phase: "street",
      _isChainEvent: false,
      icon: "💼",
      title: "职业的里程碑",
      story: "你回顾自己的职业生涯，从第一份工作到现在的成就。\n\n每一次晋升、每一次转行、每一次突破，都是你职业生涯的里程碑。\n\n你发现，职业不仅是谋生手段，也是你实现自我价值的方式。\n\n「职业的巅峰不是你爬了多高，而是你在这个过程中成为了什么样的人。」",
      triggers: { minDay: 60, excludeFlags: ["_lifeCareerMilestoneV5Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        return !!(job && job.path && (job.workDays || 0) >= 90);
      },
      choices: [
        {
          text: "💼 回顾职业里程碑",
          hint: "心智+5，心情+5，职业flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerMilestoneV5Seen = true;
            st.flags._careerMilestoneFlag = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你回顾了职业里程碑。职业巅峰不是你爬了多高，而是你成为了什么样的人。心智+5，心情+5。", "success");
            }
          },
        },
        {
          text: "📈 继续努力",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerMilestoneV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你继续努力。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "life_social_milestone_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "社交的里程碑",
      story: "你翻看手机通讯录，发现在这座城市里，你已经认识了不少人。\n\n有些人成了好朋友，有些人是工作伙伴，有些人只是一面之缘。\n\n但每一个人，都在你的人生中留下了痕迹。\n\n「社交不是数量，而是质量。真正重要的不是认识多少人，而是有多少人真正在乎你。」",
      triggers: { minDay: 45, excludeFlags: ["_lifeSocialMilestoneV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var metCount = 0;
        for (var id in st.relationships) {
          if (Object.prototype.hasOwnProperty.call(st.relationships, id)) {
            if (st.relationships[id] && st.relationships[id].met) metCount++;
          }
        }
        return metCount >= 5;
      },
      choices: [
        {
          text: "🤝 珍惜身边的朋友",
          hint: "心智+5，心情+5，社交flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSocialMilestoneV3Seen = true;
            st.flags._socialMilestoneFlag = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你珍惜身边的朋友。真正重要的不是认识多少人，而是有多少人真正在乎你。心智+5，心情+5。", "success");
            }
          },
        },
        {
          text: "📱 保持联系",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSocialMilestoneV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📱 你保持联系。心智+2。", "info");
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
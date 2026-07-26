/**
 * 域D(NPC/社交) 联动增强 R374
 * 第十五轮循环——社交积累的多维回响。
 * 桥接：
 *   D→A  social_data_v4             社交→数据v4（数据/数值·关系分析）
 *   D→C  social_career_v2           社交→职业v2（职业/成长·人脉价值）
 *   D→H  social_company_v2          社交→公司v2（公司·社会资本）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR374Loaded) return;
  RANDOM_EVENTS._domainDLinkageR374Loaded = true;

  function countMetNpcs(st) {
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (Object.prototype.hasOwnProperty.call(st.relationships, id)) {
        if (st.relationships[id] && st.relationships[id].met) count++;
      }
    }
    return count;
  }

  var EVENTS = [
    {
      id: "social_data_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "社交数据洞察",
      story: "你用数据看自己的社交网络——哪些关系是双向的、哪些是你单方面付出的、哪些人值得深交。\n\n数据让你看清了很多平时忽略的东西。\n\n原来，真正重要的不是认识多少人，而是有多少人愿意在你需要的时候伸出手。",
      triggers: { minDay: 45, excludeFlags: ["_socialDataV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return countMetNpcs(st) >= 4;
      },
      choices: [
        {
          text: "📊 分析社交数据",
          hint: "心智+5，社交洞察flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataV4Seen = true;
            st.flags._socialNetworkInsight = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你分析了社交数据。真正重要的不是认识多少人，而是有多少人愿意帮你。心智+5。", "success");
            }
          },
        },
        {
          text: "🤝 用心交友",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你用心交友。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_career_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💼",
      title: "朋友带来的机会",
      story: "一个朋友告诉你，他们公司正在招人，觉得你很适合。\n\n你发现，很多机会不是从招聘网站上来的，而是从朋友那里来的。\n\n「你认识谁，往往比你知道什么更重要。」",
      triggers: { minDay: 60, excludeFlags: ["_socialCareerV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return countMetNpcs(st) >= 3;
      },
      choices: [
        {
          text: "💼 抓住朋友推荐的机会",
          hint: "心智+5，职业机会flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCareerV2Seen = true;
            st.flags._friendJobReferral = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你抓住了朋友推荐的机会。你认识谁，往往比你知道什么更重要。心智+5。", "success");
            }
          },
        },
        {
          text: "📝 先了解一下",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCareerV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你先了解一下情况。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_company_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "社交圈赋能公司",
      story: "你的社交圈开始为公司带来实际价值——朋友介绍客户、熟人提供资源、同行分享经验。\n\n你发现，公司的发展不仅取决于产品和团队，也取决于创始人的社交网络。\n\n「你的社交圈就是公司的竞争力。」",
      triggers: { minDay: 90, excludeFlags: ["_socialCompanyV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.startup && st.startup.company);
      },
      choices: [
        {
          text: "🏢 用社交圈赋能公司",
          hint: "心智+5，公司声誉+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCompanyV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你的社交圈赋能了公司。社交圈就是公司的竞争力。心智+5，声誉+5。", "success");
            }
          },
        },
        {
          text: "📋 专注产品",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCompanyV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你专注产品。产品是核心竞争力。心智+2。", "info");
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
/**
 * 域D(NPC/社交) 联动增强 R299
 * 第六轮循环——社交积累的多维回响。
 * 桥接：
 *   D→A  social_data_insight         社交→数据洞察（数据/数值·关系分析）
 *   D→H  social_company_partnership 社交→公司合作（公司·社交网络变现）
 *   D→G  social_wellbeing            社交→幸福感（核心机制·心理健康）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR299Loaded) return;
  RANDOM_EVENTS._domainDLinkageR299Loaded = true;

  function countHighNpcsD299(st, minAff) {
    minAff = minAff || 50;
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= minAff) count++;
    }
    return count;
  }

  var EVENTS = [
    {
      id: "social_data_insight_r299",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "社交数据洞察",
      story: "你开始分析自己的社交网络数据——好感分布、互动频率、关系深度。\n\n这些数字让你发现了一些有趣的规律：某些NPC在特定时段更容易互动，某些类型的礼物效果更好，某些话题更能拉近距离。\n\n你开始用数据「经营」人际关系，而不是凭感觉。",
      triggers: { minDay: 200, excludeFlags: ["_socialDataInsightSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD299(st, 40) >= 3;
      },
      choices: [
        {
          text: "📊 用数据优化社交策略",
          hint: "心智+8，置社交分析flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataInsightSeen = true;
            st.flags._socialDataAnalysis = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据优化社交策略。数据让关系经营更科学。心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 关系不用分析，用心就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataInsightSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得关系不用分析。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_company_partnership",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🤝",
      title: "社交关系促成公司合作",
      story: "一个老朋友找到你，想和你所在的公司建立合作关系。\n\n「我信得过你，这个项目我们一起做。」\n\n这是你第一次因为「认识人」而获得商业机会。你开始理解，社交网络不仅是情感支持，也是商业资源。",
      triggers: { minDay: 300, excludeFlags: ["_socialCompanyPartnershipSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.relationships) return false;
        return countHighNpcsD299(st, 65) >= 1;
      },
      choices: [
        {
          text: "🤝 接受合作邀请",
          hint: "现金+8000，公司声誉+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCompanyPartnershipSeen = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 8000;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 6;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你接受了合作邀请。社交网络是最大的商业资产。现金+8000，声誉+6。", "success");
            }
          },
        },
        {
          text: "🤷 公司不缺这一个合作",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCompanyPartnershipSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得公司不缺这一个合作。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
    {
      id: "social_wellbeing",
      phase: "street",
      _isChainEvent: false,
      icon: "😊",
      title: "社交带来的幸福感",
      story: "你发现，和朋友们在一起的时光，是你在城市中最快乐的时刻。\n\n不是花钱的快乐，不是成功的快乐，而是「有人在乎你、你也在乎别人」的快乐。\n\n你开始理解，幸福感不是来自物质，而是来自「连接」。",
      triggers: { minDay: 180, excludeFlags: ["_socialWellbeingSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.needs || !st.relationships) return false;
        return countHighNpcsD299(st, 30) >= 3;
      },
      choices: [
        {
          text: "😊 珍惜这些朋友",
          hint: "心情+15，NPC好感+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialWellbeingSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 30) {
                  applyAffinityChange(st, id, 4, "幸福感分享");
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("😊 你珍惜了这些朋友。幸福感来自连接，不是物质。心情+15，好感+4。", "success");
            }
          },
        },
        {
          text: "🤷 朋友不用刻意维护",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialWellbeingSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得朋友不用刻意维护。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

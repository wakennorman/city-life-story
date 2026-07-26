/**
 * 域D(NPC/社交) 联动增强 R325
 * 第九轮循环——社交积累的多维回响。
 * 桥接：
 *   D→A  social_data_dashboard_v2     社交→数据面板（数据/数值·关系可视化）
 *   D→B  social_event_resonance       社交→事件共鸣（事件/叙事·人物连接）
 *   D→H  social_company_network       社交→公司网络（公司·人脉变现）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR325Loaded) return;
  RANDOM_EVENTS._domainDLinkageR325Loaded = true;

  function countHighNpcsD325(st, minAff) {
    minAff = minAff || 45;
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= minAff) count++;
    }
    return count;
  }

  var EVENTS = [
    {
      id: "social_data_dashboard_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "社交数据面板v2",
      story: "你打开社交数据面板，看到自己这些年的社交网络——好感分布、互动频率、关系深度、互惠次数。\n\n这些数字让你发现了一些有趣的规律：某些NPC是「关键节点」，某些关系是「高价值投资」。\n\n你开始用数据「经营」自己的社交网络，而不是凭感觉。",
      triggers: { minDay: 400, excludeFlags: ["_socialDataDashV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD325(st, 40) >= 6;
      },
      choices: [
        {
          text: "📊 设置社交资本面板",
          hint: "心智+10，置社交面板flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataDashV2Seen = true;
            st.flags._socialCapitalDashboardV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了社交数据面板。数据让关系经营更科学。心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 关系不用量化",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataDashV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得关系不用量化。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_event_resonance",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "社交是事件的共鸣",
      story: "你发现，和已结识NPC聊起共同经历的事件，能迅速拉近彼此的距离。\n\n「你也经历过这种事？」「原来你也是这么过来的。」共同经历是社交的催化剂，让陌生人变成朋友，让朋友变成挚友。\n\n你开始主动和NPC分享自己的故事，也倾听TA们的故事。",
      triggers: { minDay: 350, excludeFlags: ["_socialEventResonanceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD325(st, 35) >= 3;
      },
      choices: [
        {
          text: "🤝 和NPC分享你的故事",
          hint: "NPC好感+6，心情+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEventResonanceSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 35) {
                  applyAffinityChange(st, id, 6, "故事分享");
                }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你和NPC分享了你的故事。共同经历是社交的催化剂。好感+6，心情+10。", "success");
            }
          },
        },
        {
          text: "🤫 故事不用分享，自己知道就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEventResonanceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你觉得故事不用分享。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "social_company_network",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "社交网络助力公司",
      story: "你发现，多年积累的社交网络开始助力公司的发展——朋友介绍客户、前同事推荐人才、行业前辈提供建议。\n\n你开始理解，「社交网络」不仅是情感支持，也是商业资源。\n\n「人脉不是认识多少人，是多少人愿意帮你。」",
      triggers: { minDay: 400, excludeFlags: ["_socialCompanyNetworkSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.relationships) return false;
        return countHighNpcsD325(st, 50) >= 2;
      },
      choices: [
        {
          text: "🏢 主动利用社交网络助力公司",
          hint: "公司声誉+10，NPC好感+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCompanyNetworkSeen = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 10;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 50) {
                  applyAffinityChange(st, id, 5, "公司助力");
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你主动利用社交网络助力公司。人脉是商业资源。声誉+10，好感+5。", "success");
            }
          },
        },
        {
          text: "🤷 公司靠产品，不靠人脉",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCompanyNetworkSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得产品比人脉重要。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

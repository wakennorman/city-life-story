/**
 * 域G(核心机制/生命周期) 联动增强 R319
 * 第八轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→H  life_company_legacy         人生→公司传承（公司·基业长青）
 *   G→E  life_wealth_milestone_v3    财富→经济事件（经济·时间积累）
 *   G→D  life_social_milestone       人生→社交里程碑（NPC/社交·时间积累）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR319Loaded) return;
  RANDOM_EVENTS._domainGLinkageR319Loaded = true;

  var EVENTS = [
    {
      id: "life_company_legacy",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏛️",
      title: "公司传承",
      story: "你开始思考公司的「基业长青」——不仅是财务上的可持续，还有文化、价值观、和人才的传承。\n\n你决定建立一套「接班人计划」，培养下一代管理者。你开始写一本「公司历史书」，记录创业路上的每一个重要时刻。\n\n「公司会倒闭，但精神会传承。」",
      triggers: { minDay: 500, excludeFlags: ["_lifeCompanyLegacySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.valuation || 0) >= 800000;
      },
      choices: [
        {
          text: "🏛️ 建立接班人计划",
          hint: "心智+12，公司声誉+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCompanyLegacySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 10;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏛️ 你建立了接班人计划。公司会倒闭，但精神会传承。心智+12，声誉+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用计划，顺其自然",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCompanyLegacySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得顺其自然就好。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "life_wealth_milestone_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "财富里程碑事件v3",
      story: "你的总资产达到了¥1,000,000！\n\n这个数字，两年前的你想都不敢想。你决定把这个时刻记录下来——不是作为炫耀，而是作为对未来的自己在低谷时的鼓励。\n\n「财富不仅是数字，也是你在这座城市努力活过的证据。」",
      triggers: { minDay: 500, excludeFlags: ["_lifeWealthMilestoneV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return total >= 1000000;
      },
      choices: [
        {
          text: "💰 记录这个财富里程碑",
          hint: "心情+20，心智+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneV3Seen = true;
            st.flags._wealthMilestone1M = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你记录了财富里程碑。财富是你努力活过的证据。心情+20，心智+12。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续积累",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneV3Seen = true;
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
      id: "life_social_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "👥",
      title: "人生社交里程碑",
      story: "你回顾自己这些年的社交历程——从一个人都不认识，到有了朋友、同事、导师、合作伙伴。\n\n这些人不仅是你的社交网络，也是你在这座城市里的「家」。你决定组织一次「老友聚会」，把大家聚在一起，回忆过去的点点滴滴。\n\n「社交不是利益交换，是情感的积累。」",
      triggers: { minDay: 400, excludeFlags: ["_lifeSocialMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var highNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 50) highNpcs++;
        }
        return highNpcs >= 3;
      },
      choices: [
        {
          text: "👥 组织老友聚会",
          hint: "NPC好感+8，心情+15",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSocialMilestoneSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 50) {
                  applyAffinityChange(st, id, 8, "老友聚会");
                }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你组织了老友聚会。社交不是利益交换，是情感的积累。好感+8，心情+15。", "success");
            }
          },
        },
        {
          text: "🤷 不用组织，各自安好",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSocialMilestoneSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得各自安好就好。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

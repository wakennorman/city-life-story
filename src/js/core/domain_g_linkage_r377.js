/**
 * 域G(核心机制/生命周期) 联动增强 R377
 * 第十五轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→A  life_data_dashboard_v3     人生→数据面板v3（数据/数值·信息中枢）
 *   G→B  life_event_chapters_v6     人生→事件章节v6（事件/叙事·生命主线）
 *   G→E  life_wealth_milestone_v6   人生→财富里程碑v6（经济·时间积累）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR377Loaded) return;
  RANDOM_EVENTS._domainGLinkageR377Loaded = true;

  var EVENTS = [
    {
      id: "life_data_dashboard_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "人生数据面板",
      story: "你把自己的人生数据整理成了一个面板——\n\n天数、收入、技能、社交、健康……所有维度的数据都在上面。\n\n你看着这个面板，就像看着自己经营的「人生公司」的财报。\n\n「数据是你人生的资产负债表，定期看看，才知道自己过得怎么样。」",
      triggers: { minDay: 30, excludeFlags: ["_lifeDataDashboardV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.player && st.player.day >= 30);
      },
      choices: [
        {
          text: "📊 查看人生数据面板",
          hint: "心智+5，自我认知flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeDataDashboardV3Seen = true;
            st.flags._lifeDataAwareness = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你查看了人生数据面板。数据是你人生的资产负债表。心智+5。", "success");
            }
          },
        },
        {
          text: "📝 心里有数",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeDataDashboardV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你心里有数。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "life_event_chapters_v6",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "人生的篇章",
      story: "你把自己的人生故事分成几个篇章——\n\n第一章：初心\n第二章：磨砺\n第三章：转折\n第四章：成长\n……\n\n每一个篇章都有它的主题和意义。你发现，那些曾经让你痛苦的经历，在「人生全书」中也只是其中一章而已。\n\n「翻过这一章，下一章会更精彩。」",
      triggers: { minDay: 60, excludeFlags: ["_lifeEventChaptersV6Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 10;
      },
      choices: [
        {
          text: "📖 书写人生篇章",
          hint: "心智+6，心情+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeEventChaptersV6Seen = true;
            st.flags._lifeChapterNarrative = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你书写了人生篇章。翻过这一章，下一章会更精彩。心智+6，心情+5。", "success");
            }
          },
        },
        {
          text: "📝 继续生活",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeEventChaptersV6Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你继续生活。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "life_wealth_milestone_v6",
      phase: "street",
      _isChainEvent: false,
      icon: "🏆",
      title: "财富里程碑",
      story: "你又达到了一个新的财富里程碑。\n\n从刚来时的身无分文，到现在有了自己的积蓄和资产。\n\n每一步都不容易，但每一步都值得。\n\n「财富不是终点，而是你在这个城市里努力生活的证明。」",
      triggers: { minDay: 45, excludeFlags: ["_lifeWealthMilestoneV6Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var total = (st.resources && st.resources.cash || 0) + (st.resources && st.resources.bankBalance || 0);
        return total >= 30000;
      },
      choices: [
        {
          text: "🏆 庆祝财富里程碑",
          hint: "心智+5，心情+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneV6Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏆 你庆祝了财富里程碑。财富是努力生活的证明。心智+5，心情+8。", "success");
            }
          },
        },
        {
          text: "💰 继续前进",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneV6Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你继续前进。心智+3。", "info");
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
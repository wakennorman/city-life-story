/**
 * 域F(UI/UX) 联动增强 R376
 * 第十五轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→C  ui_career_path_v4          职业→路径导航v4（职业/成长·导航升级）
 *   F→D  ui_social_network_v3        社交→关系网络v3（NPC/社交·可视化）
 *   F→G  ui_health_dashboard_v3      健康→仪表盘v3（核心机制·预防医学）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR376Loaded) return;
  RANDOM_EVENTS._domainFLinkageR376Loaded = true;

  var EVENTS = [
    {
      id: "ui_career_path_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "🗺️",
      title: "职业路线图",
      story: "你画了一张自己的职业路线图，看看过去、现在和未来。\n\n过去你做过什么工作，现在你在做什么，未来你想做什么。\n\n一张清晰的路线图，让你对自己的职业发展有了更明确的方向。\n\n「没有路线图，任何风都不是顺风。」",
      triggers: { minDay: 60, excludeFlags: ["_uiCareerPathV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        return !!(job && job.path);
      },
      choices: [
        {
          text: "🗺️ 规划职业路线图",
          hint: "心智+5，职业规划flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCareerPathV4Seen = true;
            st.flags._careerRoadmapMade = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🗺️ 你规划了职业路线图。没有路线图，任何风都不是顺风。心智+5。", "success");
            }
          },
        },
        {
          text: "📝 边走边看",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCareerPathV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你边走边看。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_social_network_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🔗",
      title: "关系网络图",
      story: "你画了一张自己的社交关系图，看看谁是你的核心圈、谁是你的弱连接、谁只是过客。\n\n你发现，那些你以为很重要的关系，在图上看其实很弱；而一些你平时忽略的人，其实是你的「关键节点」。\n\n「可视化让你看到关系背后的真相。」",
      triggers: { minDay: 45, excludeFlags: ["_uiSocialNetworkV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var metCount = 0;
        for (var id in st.relationships) {
          if (Object.prototype.hasOwnProperty.call(st.relationships, id)) {
            if (st.relationships[id] && st.relationships[id].met) metCount++;
          }
        }
        return metCount >= 4;
      },
      choices: [
        {
          text: "🔗 分析关系网络",
          hint: "心智+5，社交洞察flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiSocialNetworkV3Seen = true;
            st.flags._socialNetworkVisualized = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔗 你分析了关系网络。可视化让你看到关系背后的真相。心智+5。", "success");
            }
          },
        },
        {
          text: "🤝 用心维护",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiSocialNetworkV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你用心维护关系。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_health_dashboard_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "💊",
      title: "健康仪表盘",
      story: "你建立了一个健康仪表盘，追踪自己的身体数据。\n\n睡眠质量、运动频率、饮食结构、压力水平……每一项都在告诉你，身体需要什么。\n\n以前你只知道自己「不舒服」，现在你知道哪里不舒服、为什么不舒服、怎么改善。\n\n「健康数据是你身体发出的信号，不要忽视它。」",
      triggers: { minDay: 30, excludeFlags: ["_uiHealthDashboardV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.status && st.status.health < 80);
      },
      choices: [
        {
          text: "💊 建立健康追踪系统",
          hint: "健康+8，心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiHealthDashboardV3Seen = true;
            st.flags._healthTrackingActive = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💊 你建立了健康追踪系统。健康数据是你身体发出的信号，不要忽视它。健康+8，心智+4。", "success");
            }
          },
        },
        {
          text: "🏃 多运动就好",
          hint: "健康+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiHealthDashboardV3Seen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏃 你多运动。简单的方法往往最有效。健康+4。", "info");
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
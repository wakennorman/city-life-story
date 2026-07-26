/**
 * 域A(数据/数值平衡) 联动增强 R379
 * 第十六轮循环——数据不仅是数字，还在叙事/UI/核心机制层面留下痕迹。
 * 桥接：
 *   A→B  quantified_life_v4         数据→量化人生v4（事件/叙事·数据故事）
 *   A→C  skill_data_insight_v2      数据→技能洞察v2（职业/成长·技能价值）
 *   A→G  health_data_v2             数据→健康数据v2（核心机制·健康管理）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR379Loaded) return;
  RANDOM_EVENTS._domainALinkageR379Loaded = true;

  var EVENTS = [
    {
      id: "quantified_life_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "数字人生",
      story: "你看着自己在这座城市积累的数据，突然意识到——\n\n这些数字不只是一串串冰冷的统计，它们是你活过的证明。\n\n每一步、每一分钱、每一个技能、每一段关系，都在数据中留下了痕迹。\n\n「数据是你人生的日记，只是用一种更诚实的方式记录。」",
      triggers: { minDay: 20, excludeFlags: ["_quantifiedLifeV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.player && st.player.day >= 20);
      },
      choices: [
        {
          text: "📊 解读数据中的自己",
          hint: "心智+5，心情+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._quantifiedLifeV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你解读了数据中的自己。数据是你人生的日记。心智+5，心情+5。", "success");
            }
          },
        },
        {
          text: "📝 继续生活",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._quantifiedLifeV4Seen = true;
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
      id: "skill_data_insight_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📚",
      title: "技能的价值",
      story: "你算了一笔账——你的技能帮你赚了多少钱？\n\n如果没有这些技能，你的收入会少多少？哪些技能最值钱？哪些技能虽然不直接赚钱但很有用？\n\n你发现，技能不仅是你的能力，也是你的资产。\n\n「技能是唯一不会贬值的资产，它们会随着时间的推移越来越值钱。」",
      triggers: { minDay: 45, excludeFlags: ["_skillDataInsightV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.skills);
      },
      choices: [
        {
          text: "📚 评估技能价值",
          hint: "心智+5，技能洞察flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillDataInsightV2Seen = true;
            st.flags._skillValueAwareness = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📚 你评估了技能价值。技能是唯一不会贬值的资产。心智+5。", "success");
            }
          },
        },
        {
          text: "📖 继续学习",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillDataInsightV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你继续学习。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "health_data_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💊",
      title: "健康数据管理",
      story: "你开始用数据来管理自己的健康——\n\n每天的睡眠时间、饮食热量、运动量、身体指标……\n\n你发现，很多健康问题在数据上早有预兆，只是你以前没有注意到。\n\n「身体不会突然出问题，它一直在用数据给你发信号。」",
      triggers: { minDay: 30, excludeFlags: ["_healthDataV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.status && st.status.health < 85);
      },
      choices: [
        {
          text: "💊 建立健康数据档案",
          hint: "健康+8，心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._healthDataV2Seen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💊 你建立了健康数据档案。身体一直在用数据给你发信号。健康+8，心智+4。", "success");
            }
          },
        },
        {
          text: "🏃 多运动",
          hint: "健康+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._healthDataV2Seen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏃 你多运动。健康+4。", "info");
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
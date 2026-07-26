/**
 * 域A(数据/数值平衡) 联动增强 R371
 * 第十五轮循环——数据不仅是数字，还在叙事/UI/核心机制层面留下痕迹。
 * 桥接：
 *   A→B  quantified_life_v3         数据→量化人生v3（事件/叙事·数据故事）
 *   A→D  social_data_insight_v2     数据→社交洞察v2（NPC/社交·关系分析）
 *   A→E  market_data_insight_v2     数据→市场洞察v2（经济·数据驱动）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR371Loaded) return;
  RANDOM_EVENTS._domainALinkageR371Loaded = true;

  var EVENTS = [
    {
      id: "quantified_life_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "数据中的成长",
      story: "你打开自己的数据记录，发现时间真的能改变很多东西。\n\n刚来时的数据和现在的数据对比——收入涨了、技能高了、朋友多了、身体也变好了。\n\n你看着这些数据，就像看着自己一路走来的脚印。\n\n「数据不会说谎，每一分努力都在上面留下了痕迹。」",
      triggers: { minDay: 30, excludeFlags: ["_quantifiedLifeV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.player && st.player.day >= 30);
      },
      choices: [
        {
          text: "📊 看看自己的成长数据",
          hint: "心智+5，心情+5，成长flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._quantifiedLifeV3Seen = true;
            st.flags._growthDataAwareness = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你看到了自己的成长数据。每一分努力都在上面留下了痕迹。心智+5，心情+5。", "success");
            }
          },
        },
        {
          text: "📝 继续努力",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._quantifiedLifeV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你继续努力。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_data_insight_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🔍",
      title: "社交数据分析",
      story: "你开始用数据来分析自己的社交关系——互动频率、好感变化、关系深度。\n\n你发现，有些你认为很好的朋友，数据上显示互动很少；而有些你不太在意的人，却一直在默默关心你。\n\n「数据让你看到你以为自己知道，但实际并不知道的东西。」",
      triggers: { minDay: 45, excludeFlags: ["_socialDataInsightV2Seen"] },
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
          text: "🔍 分析社交数据",
          hint: "心智+5，社交洞察flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataInsightV2Seen = true;
            st.flags._socialDataAwareness = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔍 你分析了社交数据。数据让你看到你以为自己知道但实际并不知道的东西。心智+5。", "success");
            }
          },
        },
        {
          text: "🤝 用心感受就好",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataInsightV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你用心感受就好。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "market_data_insight_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "市场数据洞察",
      story: "你开始关注市场数据——物价走势、供需变化、行业动态。\n\n你发现，这些数据背后隐藏着机会。\n\n当别人还在凭感觉做决策时，你已经用数据看到了趋势。\n\n「在信息时代，数据就是新的石油。」",
      triggers: { minDay: 60, excludeFlags: ["_marketDataInsightV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 8;
      },
      choices: [
        {
          text: "📈 用数据指导决策",
          hint: "心智+5，投资洞察flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._marketDataInsightV2Seen = true;
            st.flags._marketDataDriven = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你用数据指导决策。在信息时代数据就是新的石油。心智+5。", "success");
            }
          },
        },
        {
          text: "📊 参考一下就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._marketDataInsightV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你参考了一下数据。心智+2。", "info");
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
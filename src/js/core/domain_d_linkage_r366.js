/**
 * 域D(NPC/社交) 联动增强 R366
 * 第十四轮循环——社交积累的多维回响。
 * 桥接：
 *   D→E  social_investment_v2        社交→投资（经济·社交信息）
 *   D→G  social_wellbeing_v3         社交→幸福感（核心机制·心理健康）
 *   D→B  social_event_v3             社交→事件（事件/叙事·人物连接）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR366Loaded) return;
  RANDOM_EVENTS._domainDLinkageR366Loaded = true;

  function countHighAffNpcs(st, minAff) {
    minAff = minAff || 30;
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (Object.prototype.hasOwnProperty.call(st.relationships, id)) {
        var r = st.relationships[id];
        if (r && r.met && (r.affinity || 0) >= minAff) count++;
      }
    }
    return count;
  }

  var EVENTS = [
    {
      id: "social_investment_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "社交圈里的机会",
      story: "你在和朋友聊天时，听说了一个投资机会。朋友说：「这个项目我信得过，但一个人拿不准，想听听你的意见。」\n\n你发现，社交圈不仅是情感支持，也是信息和机会的来源。\n\n那些你用心维护的关系，正在以意想不到的方式回报你。",
      triggers: { minDay: 60, excludeFlags: ["_socialInvestmentV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return countHighAffNpcs(st, 30) >= 3;
      },
      choices: [
        {
          text: "💡 和朋友一起投资",
          hint: "心智+5，投资回报+10%，好感+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialInvestmentV2Seen = true;
            st.flags._socialInvestmentIntel = true;
            st.flags._socialInvestmentIntelDay = st.player ? st.player.day : 0;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💡 你和朋友一起投资。社交圈里的机会，往往是最好的机会。心智+5。", "success");
            }
          },
        },
        {
          text: "🤔 先了解一下再说",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialInvestmentV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤔 你决定先了解一下再说。谨慎是投资的第一课。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_wellbeing_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "😊",
      title: "朋友的力量",
      story: "你最近压力很大，但一个朋友注意到了你的状态，主动约你出来聊天。\n\n你们坐在街边的小摊上，喝着啤酒，聊着各自的生活。\n\n你发现，那些让你喘不过气来的压力，在说出来之后，似乎就没那么重了。\n\n「朋友不是用来解决问题的，是用来让你知道，你不是一个人。」",
      triggers: { minDay: 30, excludeFlags: ["_socialWellbeingV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (countHighAffNpcs(st, 20) < 2) return false;
        return !!(st.needs && (st.needs.happiness || 50) < 50);
      },
      choices: [
        {
          text: "😊 向朋友倾诉",
          hint: "心情+12，好感+5，心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialWellbeingV3Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("😊 你向朋友倾诉了烦恼。说出来之后，感觉好多了。心情+12，心智+3。", "success");
            }
          },
        },
        {
          text: "🤷 不想让人担心",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialWellbeingV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你不想让人担心。有些事，自己扛着也是一种成长。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_event_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🎉",
      title: "朋友们的聚会",
      story: "你组织了一场小型聚会，把几个好朋友叫到一起。\n\n大家聊着各自的近况，分享着生活中的趣事和烦恼。你发现，每个人都有自己的故事，每个人都在努力地生活。\n\n在这个城市里，有这样一群朋友，就是最大的财富。",
      triggers: { minDay: 45, excludeFlags: ["_socialEventV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return countHighAffNpcs(st, 25) >= 3;
      },
      choices: [
        {
          text: "🎉 组织聚会，加深情谊",
          hint: "心情+10，全员好感+3，心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEventV3Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎉 聚会很成功。在这个城市里，有这样一群朋友就是最大的财富。心情+10，心智+3。", "success");
            }
          },
        },
        {
          text: "🤝 小聚一下就好",
          hint: "心情+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEventV3Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你们小聚了一下。简单也是一种快乐。心情+5。", "info");
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
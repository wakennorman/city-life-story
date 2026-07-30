/*
 * 城市浮生记 — 域E(经济/投资) 联动增强 R941
 * 全系统优化·Domain E 第七十一轮循环
 *
 * 【联动增强3项】
 *   1. E→B 投资故事叙事v1 — 投资里程碑触发叙事回响
 *   2. E→C 技能投资回报v1 — 投资盈利促进技能提升
 *   3. E→D 投资者社交圈v1 — 投资成就影响社交圈层
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR941Loaded) return;
  RANDOM_EVENTS._domainELinkageR941Loaded = true;

  function grantXp(k, a) { if (typeof addSkillXp === "function") { try { addSkillXp(k, a); } catch(e) {} } }

  var EVENTS = [
    {
      id: "e941_invest_story_v1", phase: "street", icon: "💰",
      title: "投资路上的故事",
      story: "你翻看自己的投资记录，每一笔交易背后都有一个故事。\n\n从第一次买入时的忐忑，到现在的从容——这条路走得值。",
      triggers: { minDay: 45, interval: 100, maxRepeats: 4, excludeFlags: ["_e941InvestStoryCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e941InvestStoryCd) return false;
        if (!st.investment) return false;
        return ((st.investment.totalInvested || 0) + (st.investment.totalStockInvested || 0)) >= 3000 && st.player.day >= 45;
      },
      probability: 0.04, repeatable: true,
      choices: [
        { text: "💰 回顾投资历程", hint: "心智+12,会计XP+15,置_e941Investor", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._e941InvestStoryCd = true; st.flags._e941Investor = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
          grantXp("accounting", 15);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 回顾了投资历程——心智+12,会计XP+15。", "success");
        }},
        { text: "😅 过去了", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._e941InvestStoryCd = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😅 过去了。心智+3。", "info");
        }}
      ]
    },
    {
      id: "e941_skill_invest_v1", phase: "street", icon: "📚",
      title: "盈利了，投资自己",
      story: "投资赚了钱，你开始思考怎么用这笔钱创造更大的价值。\n\n「最好的投资，是投资自己。」你想起这句话。",
      triggers: { minDay: 35, interval: 90, maxRepeats: 4, excludeFlags: ["_e941SkillInvestCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e941SkillInvestCd) return false;
        if (!st.investment) return false;
        return ((st.investment.totalProfit || 0) + (st.investment.totalStockProfit || 0)) >= 1500 && st.player.day >= 35;
      },
      probability: 0.04, repeatable: true,
      choices: [
        { text: "📚 投资自己学新技能", hint: "智力+10,管理XP+12,置_e941SelfInvestor", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._e941SkillInvestCd = true; st.flags._e941SelfInvestor = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
          grantXp("management", 12);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 投资自己学新技能——智力+10,管理XP+12。", "success");
        }},
        { text: "😅 享受生活", hint: "心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._e941SkillInvestCd = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😅 享受生活。心情+5。", "info");
        }}
      ]
    },
    {
      id: "e941_social_circle_v1", phase: "street", icon: "🤝",
      title: "投资成功，朋友圈扩大",
      story: "你的投资眼光在朋友圈里传开了，连以前不太熟的人都来请教。\n\n你发现，当你做得好时，世界会对你更友善。",
      triggers: { minDay: 55, interval: 110, maxRepeats: 3, excludeFlags: ["_e941SocialCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e941SocialCd) return false;
        if (!st.relationships || !st.investment) return false;
        return ((st.investment.totalProfit || 0) + (st.investment.totalStockProfit || 0)) >= 4000 && st.player.day >= 55;
      },
      probability: 0.04, repeatable: true,
      choices: [
        { text: "🤝 分享投资心得", hint: "魅力+8,好感+3,置_e941Social", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._e941SocialCd = true; st.flags._e941Social = true;
          if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 8);
          if (st.relationships && typeof applyAffinityChange === "function") {
            var _ids = []; for (var _id in st.relationships) { if (st.relationships[_id] && st.relationships[_id].met) _ids.push(_id); }
            if (_ids.length > 0) { var _p = typeof Random !== "undefined" ? Random.int(0, _ids.length - 1) : 0; applyAffinityChange(st, _ids[_p], 3, "投资心得"); }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 分享了投资心得——魅力+8。", "success");
        }},
        { text: "😅 低调", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._e941SocialCd = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😅 低调。心智+3。", "info");
        }}
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
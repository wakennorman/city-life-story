/*
 * 城市浮生记 — 域E(经济/投资) 联动增强 R933
 * 全系统优化·Domain E 第七十轮循环
 *
 * 【联动增强3项】
 *   1. E→B 投资故事叙事v1 — 投资里程碑触发叙事回响
 *   2. E→C 职业技能投资v1 — 投资回报促进技能提升动机
 *   3. E→D 投资者社交圈v1 — 投资成就影响社交圈层
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动现有文件。
 *  - 所有 state 访问均 || 防御。
 *  - 严格遵守目标域数据格式。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR933Loaded) return;
  RANDOM_EVENTS._domainELinkageR933Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: E→B 投资故事叙事v1
    // 设计意图：投资里程碑(首次盈利/大赚/大亏)触发叙事事件，
    //    让玩家在投资旅程中留下故事回忆。
    // 心理学：峰终定律 — 投资的高光时刻成为记忆锚点
    // ========================================================================
    {
      id: "e933_invest_story_v1",
      phase: "street",
      icon: "💰",
      title: "投资路上的里程碑",
      story: "你翻看自己的投资记录，不知不觉已经有了不少交易。\n\n从第一次小心翼翼地买入，到现在的从容操作——这条路走得不容易，但每一步都算数。",
      triggers: { minDay: 50, interval: 120, maxRepeats: 3, excludeFlags: ["_e933InvestStoryCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e933InvestStoryCd) return false;
        if (!st.investment) return false;
        // 需要有投资记录
        var _totalInv = (st.investment.totalInvested || 0) + (st.investment.totalStockInvested || 0);
        return _totalInv >= 5000 && st.player.day >= 50;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "💰 回顾投资历程",
          hint: "心智+15, 会计XP+20, 置_e933InvestorStory",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e933InvestStoryCd = true;
            st.flags._e933InvestorStory = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            grantXp("accounting", 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你回顾了投资历程，收获良多——心智+15, 会计XP+20。", "success");
            }
          }
        },
        {
          text: "😅 过去的就过去了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e933InvestStoryCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 过去的就过去了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: E→C 职业技能投资v1
    // 设计意图：投资回报应促进技能提升动机，
    //    让玩家感到"投资赚钱后，更有动力提升自己"。
    // 心理学：禀赋效应 — 投资回报增强自我效能感
    // ========================================================================
    {
      id: "e933_skill_invest_motivation_v1",
      phase: "street",
      icon: "📚",
      title: "投资回报，自我提升",
      story: "你的投资账户有了不错的回报。\n\n手里有了余钱，你开始思考——与其把钱花在消费上，不如投资自己。\n\n学一门新技能，也许能带来更大的回报。",
      triggers: { minDay: 40, interval: 100, maxRepeats: 4, excludeFlags: ["_e933SkillMotivationCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e933SkillMotivationCd) return false;
        if (!st.investment) return false;
        // 需要投资盈利
        var _totalProfit = (st.investment.totalProfit || 0) + (st.investment.totalStockProfit || 0);
        return _totalProfit >= 2000 && st.player.day >= 40;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "📚 投资自己，学习新技能",
          hint: "智力+12, 管理XP+15, 置_e933SelfInvestor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e933SkillMotivationCd = true;
            st.flags._e933SelfInvestor = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            grantXp("management", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 你决定投资自己，学习新技能——智力+12, 管理XP+15。", "success");
            }
          }
        },
        {
          text: "😅 先享受一下生活",
          hint: "心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e933SkillMotivationCd = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 先享受一下生活。心情+5。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: E→D 投资者社交圈v1
    // 设计意图：投资成就应影响社交圈层，
    //    让玩家感到"投资做得好，朋友自然多"。
    // 心理学：社会比较 — 投资成功带来社交地位提升
    // ========================================================================
    {
      id: "e933_investor_social_circle_v1",
      phase: "street",
      icon: "🤝",
      title: "投资成功，朋友圈扩大",
      story: "你的投资眼光在朋友圈里传开了。\n\n朋友们开始向你请教投资心得，连以前不太熟的人都来主动找你聊天。\n\n你发现，当你做得好时，世界会对你更友善。",
      triggers: { minDay: 60, interval: 130, maxRepeats: 3, excludeFlags: ["_e933InvestorSocialCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e933InvestorSocialCd) return false;
        if (!st.relationships || !st.investment) return false;
        // 需要投资总盈利≥¥5000
        var _totalProfit2 = (st.investment.totalProfit || 0) + (st.investment.totalStockProfit || 0);
        return _totalProfit2 >= 5000 && st.player.day >= 60;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "🤝 分享投资心得",
          hint: "魅力+10, 社交好感+3, 置_e933InvestorSocial",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e933InvestorSocialCd = true;
            st.flags._e933InvestorSocial = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 10);
            // 给随机已结识NPC加好感
            if (st.relationships && typeof applyAffinityChange === "function") {
              var _metIds = [];
              for (var _id in st.relationships) {
                if (st.relationships[_id] && st.relationships[_id].met) _metIds.push(_id);
              }
              if (_metIds.length > 0) {
                var _pick = typeof Random !== "undefined"
                  ? Random.int(0, _metIds.length - 1)
                  : Math.floor(Math.random() * _metIds.length);
                applyAffinityChange(st, _metIds[_pick], 3, "投资心得分享");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 你分享了投资心得，朋友圈又扩大了——魅力+10。", "success");
            }
          }
        },
        {
          text: "😅 低调低调",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e933InvestorSocialCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 低调低调。心智+3。", "info");
            }
          }
        }
      ]
    }
  ];

  // 去重注册
  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
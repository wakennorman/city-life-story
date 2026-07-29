/*
 * 城市浮生记 — 域C(职业/成长) 联动增强 R806
 * 全系统优化·Domain C 第五十九轮循环
 *
 * 【联动增强3项】
 *   1. C→B 职业故事叙事 — 职业选择触发事件叙事回响
 *   2. C→D 职业人脉网络 — 职业环境拓展NPC社交圈
 *   3. C→H 职业到创业 — 职业积累引导创业时机
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR806Loaded) return;
  RANDOM_EVENTS._domainCLinkageR806Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: C→B 职业故事叙事 — 职业选择触发事件叙事回响
    // 设计意图：职业路径中的关键选择应产生叙事回响，让玩家感到"职业有故事"。
    // 本事件在玩家晋升≥3次时触发，给予"职业故事"标记。
    // 心理学：峰终定律 — 晋升时刻成为职业记忆锚点。
    // ========================================================================
    {
      id: "c806_career_story_narrative",
      phase: "street",
      icon: "📖",
      title: "每一步晋升，都是一段故事",
      story: "你回顾了这一路走来的职业历程——从最初的打工人，到现在的岗位。\n\n每一次晋升，都是一次挑战；每一次挑战，都让你成长。\n\n这些经历，构成了你独有的「职业故事」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c806CareerStoryDone) return false;
        var _promotions = st.flags._promotionCount || 0;
        return _promotions >= 3 && st.player.day >= 120;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📖 记录我的职业故事",
          hint: "心智+8, 置_c806CareerNarrative",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c806CareerStoryDone = true;
            st.flags._c806CareerNarrative = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 职业故事记录完成——心智+8。每一步晋升，都是一段故事。", "success");
            }
          }
        },
        {
          text: "😊 过去就过去了",
          hint: "心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c806CareerStoryDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 过去就过去了。心情+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: C→D 职业人脉网络 — 职业环境拓展NPC社交圈
    // 设计意图：职业环境应带来社交机会，让玩家感到"工作中有朋友"。
    // 本事件在玩家在职≥60天且已结识NPC<8时触发。
    // 心理学：社会认同 — 被同事认同的满足感。
    // ========================================================================
    {
      id: "c806_career_network",
      phase: "street",
      icon: "🤝",
      title: "工作中，也能遇到对的人",
      story: "你发现——每天一起工作的同事，有些人慢慢成了朋友。\n\n他们不只是工作伙伴，更是可以交心的人。\n\n职场里能遇到这样的伙伴，是一种幸运。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c806CareerNetDone) return false;
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          if (st.relationships[_id] && st.relationships[_id].met) _metCount++;
        }
        return _metCount < 8 && st.player.day >= 60;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🤝 主动结识职场朋友",
          hint: "魅力+5, 社交XP+8, 置_c806WorkFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c806CareerNetDone = true;
            st.flags._c806WorkFriend = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            grantXp("social", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 主动结识职场朋友——魅力+5, 社交XP+8。", "success");
            }
          }
        },
        {
          text: "😊 保持职场距离",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c806CareerNetDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 保持职场距离。心智+2。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: C→H 职业到创业 — 职业积累引导创业时机
    // 设计意图：职业积累应引导玩家考虑创业，形成"打工→创业"的叙事弧线。
    // 本事件在玩家在职≥365天且总资产≥¥20万时触发。
    // 心理学：禀赋效应 — 玩家感到"职业积累为创业铺路"。
    // ========================================================================
    {
      id: "c806_career_to_startup",
      phase: "street",
      icon: "🚀",
      title: "打工，还是创业？",
      story: "你算了算——在职场摸爬滚打了一年多，积累了经验、人脉、资金。\n\n一个念头开始浮现：是时候创业了吗？\n\n还是，继续打工更安全？\n\n这是一个需要认真思考的问题。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c806StartupPrepDone) return false;
        if (!st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return _total >= 200000 && st.player.day >= 365;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "🚀 认真考虑创业",
          hint: "智力+10, 管理XP+12, 置_c806StartupReady",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c806StartupPrepDone = true;
            st.flags._c806StartupReady = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            grantXp("management", 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 你开始认真考虑创业——智力+10, 管理XP+12。", "success");
            }
          }
        },
        {
          text: "😅 打工更稳定",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c806StartupPrepDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 打工更稳定。心智+3。", "info");
            }
          }
        }
      ]
    }
  ];

  // ---- 注入全局 RANDOM_EVENTS ----
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

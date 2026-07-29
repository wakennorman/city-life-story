/*
 * 城市浮生记 — 域C(职业/成长) 联动增强 R832
 * 全系统优化·Domain C 第六十三轮循环
 *
 * 【联动增强3项】
 *   1. C→B 职业故事叙事v3 — 职业选择触发事件叙事回响
 *   2. C→D 职业人脉网络v3 — 职业环境深度拓展NPC社交圈
 *   3. C→H 职业到创业v3 — 职业积累深度引导创业时机
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR832Loaded) return;
  RANDOM_EVENTS._domainCLinkageR832Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: C→B 职业故事叙事v3 — 职业选择触发事件叙事回响
    // 设计意图：职业路径中的关键选择应产生叙事回响，让玩家感到"职业有故事"。
    // 本事件在玩家晋升≥4次时触发，给予"职业故事v3"标记。
    // 心理学：峰终定律 — 晋升时刻成为职业记忆锚点。
    // ========================================================================
    {
      id: "c832_career_story_v3",
      phase: "street",
      icon: "📖",
      title: "每一步晋升，都是一段故事",
      story: "你回顾了这一路走来的职业历程——从最初的打工人，到现在的岗位。\n\n每一次晋升，都是一次挑战；每一次挑战，都让你成长。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c832CareerStoryDone) return false;
        var _promotions = st.flags._promotionCount || 0;
        return _promotions >= 4 && st.player.day >= 150;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📖 记录我的职业故事",
          hint: "心智+10, 置_c832CareerNarrative",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c832CareerStoryDone = true;
            st.flags._c832CareerNarrative = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 职业故事记录完成——心智+10。每一步晋升，都是一段故事。", "success");
            }
          }
        },
        {
          text: "😊 过去就过去了",
          hint: "心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c832CareerStoryDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 过去就过去了。心情+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: C→D 职业人脉网络v3 — 职业环境深度拓展NPC社交圈
    // 设计意图：职业环境应带来更深层的社交机会，让玩家感到"同事变朋友"。
    // 本事件在玩家在职≥120天且已结识NPC<12时触发。
    // 心理学：社会认同 — 被同事认同的满足感。
    // ========================================================================
    {
      id: "c832_career_network_v3",
      phase: "street",
      icon: "🤝",
      title: "职场朋友，是最稳固的人脉",
      story: "你发现——那些一起扛过项目的同事，成了你最稳固的人脉。\n\n职场朋友不同于酒肉朋友，他们见过你的能力、了解你的为人。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c832CareerNetDone) return false;
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          if (st.relationships[_id] && st.relationships[_id].met) _metCount++;
        }
        return _metCount < 12 && st.player.day >= 120;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🤝 深化职场友谊",
          hint: "魅力+8, 社交XP+12, 置_c832DeepWorkFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c832CareerNetDone = true;
            st.flags._c832DeepWorkFriend = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 8);
            grantXp("social", 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 你深化了职场友谊——魅力+8, 社交XP+12。", "success");
            }
          }
        },
        {
          text: "😊 保持职场距离",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c832CareerNetDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 保持职场距离。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: C→H 职业到创业v3 — 职业积累深度引导创业时机
    // 设计意图：职业积累应深度引导玩家考虑创业，形成"打工→创业"的叙事弧线。
    // 本事件在玩家在职≥600天且总资产≥¥40万时触发。
    // 心理学：禀赋效应 — 玩家感到"职业积累为创业铺路"。
    // ========================================================================
    {
      id: "c832_career_to_startup_v3",
      phase: "street",
      icon: "🚀",
      title: "时机成熟了吗？",
      story: "你在职场摸爬滚打了一年半多，积累了丰富的经验、人脉、资金。\n\n一个越来越清晰的声音在问：是时候创业了吗？",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c832StartupV3Done) return false;
        if (!st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return _total >= 400000 && st.player.day >= 600;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "🚀 认真评估创业时机",
          hint: "智力+12, 管理XP+15, 置_c832StartupReady",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c832StartupV3Done = true;
            st.flags._c832StartupReady = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            grantXp("management", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 你认真评估了创业时机——智力+12, 管理XP+15。", "success");
            }
          }
        },
        {
          text: "😅 再等等看",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c832StartupV3Done = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 再等等看。心智+3。", "info");
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

/*
 * 城市浮生记 — 域C(职业/成长) 联动增强 R818
 * 全系统优化·Domain C 第六十一轮循环
 *
 * 【联动增强3项】
 *   1. C→D 职业人脉网络v2 — 职业环境深度拓展NPC社交圈
 *   2. C→H 职业到创业v2 — 职业积累深度引导创业时机
 *   3. C→F 职业技能展示UI — 技能面板展示职业成长轨迹
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR818Loaded) return;
  RANDOM_EVENTS._domainCLinkageR818Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: C→D 职业人脉网络v2 — 职业环境深度拓展NPC社交圈
    // 设计意图：职业环境应带来更深层的社交机会，让玩家感到"同事变朋友"。
    // 本事件在玩家在职≥90天且已结识NPC<10时触发。
    // 心理学：社会认同 — 被同事认同的满足感。
    // ========================================================================
    {
      id: "c818_career_network_v2",
      phase: "street",
      icon: "🤝",
      title: "职场朋友，是最稳固的人脉",
      story: "你发现——那些一起扛过项目的同事，成了你最稳固的人脉。\n\n职场朋友不同于酒肉朋友，他们见过你的能力、了解你的为人。\n\n这种关系，经得起时间考验。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c818CareerNetDone) return false;
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          if (st.relationships[_id] && st.relationships[_id].met) _metCount++;
        }
        return _metCount < 10 && st.player.day >= 90;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🤝 深化职场友谊",
          hint: "魅力+5, 社交XP+10, 置_c818DeepWorkFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c818CareerNetDone = true;
            st.flags._c818DeepWorkFriend = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            grantXp("social", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 你深化了职场友谊——魅力+5, 社交XP+10。职场朋友，是最稳固的人脉。", "success");
            }
          }
        },
        {
          text: "😊 保持职场距离",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c818CareerNetDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 保持职场距离。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: C→H 职业到创业v2 — 职业积累深度引导创业时机
    // 设计意图：职业积累应深度引导玩家考虑创业，形成"打工→创业"的叙事弧线。
    // 本事件在玩家在职≥500天且总资产≥¥30万时触发。
    // 心理学：禀赋效应 — 玩家感到"职业积累为创业铺路"。
    // ========================================================================
    {
      id: "c818_career_to_startup_v2",
      phase: "street",
      icon: "🚀",
      title: "时机成熟了吗？",
      story: "你在职场摸爬滚打了一年半多，积累了丰富的经验、人脉、资金。\n\n一个越来越清晰的声音在问：是时候创业了吗？\n\n这不是冲动，而是准备就绪后的自然选择。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c818StartupV2Done) return false;
        if (!st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return _total >= 300000 && st.player.day >= 500;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "🚀 认真评估创业时机",
          hint: "智力+10, 管理XP+15, 置_c818StartupReady",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c818StartupV2Done = true;
            st.flags._c818StartupReady = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            grantXp("management", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 你认真评估了创业时机——智力+10, 管理XP+15。时机成熟了吗？", "success");
            }
          }
        },
        {
          text: "😅 再等等看",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c818StartupV2Done = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 再等等看。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: C→F 职业技能展示UI — 技能面板展示职业成长轨迹
    // 设计意图：技能面板应展示职业成长轨迹和市场需求，让玩家感到"成长可见"。
    // 本事件在玩家拥有≥3个Lv.30+技能时触发，给予"技能成长可视化"标记。
    // 心理学：禀赋效应 — 玩家更珍视自己投入时间培养的技能。
    // ========================================================================
    {
      id: "c818_skill_growth_ui",
      phase: "street",
      icon: "📊",
      title: "你的技能成长，一目了然",
      story: "你打开技能面板——每一个技能的成长轨迹、市场需求、职业关联都清晰可见。\n\n从最初的生疏，到现在的熟练。每一点进步，都记录在案。\n\n成长，最好的证明就是数据。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c818SkillUIDone) return false;
        if (!st.skills) return false;
        var _count = 0;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 30) _count++;
        }
        return _count >= 3;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 查看技能成长轨迹",
          hint: "智力+5, 置_c818SkillGrowthViz",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c818SkillUIDone = true;
            st.flags._c818SkillGrowthViz = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 技能成长轨迹已可视化——智力+5。成长，最好的证明就是数据。", "success");
            }
          }
        },
        {
          text: "😅 技能够用就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c818SkillUIDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 技能够用就行。心智+2。", "info");
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

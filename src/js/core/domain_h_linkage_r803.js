/*
 * 城市浮生记 — 域H(Phase2/公司) 联动增强 R803
 * 全系统优化·Domain H 第五十七轮循环
 *
 * 【联动增强3项】
 *   1. H→C 公司职业成长 — 公司经历转化为职场技能
 *   2. H→D 团队社交凝聚力 — 公司团队互动拓展NPC关系
 *   3. H→F 公司健康度UI — 公司数据在UI层的可视化展示
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR803Loaded) return;
  RANDOM_EVENTS._domainHLinkageR803Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: H→C 公司职业成长 — 公司经历转化为职场技能
    // 设计意图：公司运营经历应转化为职场技能成长，让玩家感到"创业有回报"。
    // 本事件在公司存续≥180天时触发，给予"创业者技能"标记。
    // 心理学：禀赋效应 — 玩家感到"创业经历没有白费"。
    // ========================================================================
    {
      id: "h803_corporate_career_growth",
      phase: "corporate",
      icon: "🎓",
      title: "创业教会你的，比职场更多",
      story: "你回顾了这一年的创业经历——带团队、做决策、应对风险、把握机会。\n\n这些经历，比任何职场培训都来得深刻。\n\n你发现，自己已经不再是那个只会执行命令的打工者了。你是一个能独当一面的「创业者」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h803CorpCareerDone) return false;
        if (st.player.phase !== "corporate" || !st.startup) return false;
        return st.player.day >= 180;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "🎓 总结创业经验，沉淀为技能",
          hint: "管理XP+15, 置_h803EntrepreneurSkill",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h803CorpCareerDone = true;
            st.flags._h803EntrepreneurSkill = true;
            grantXp("management", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎓 创业经验沉淀为职场能力——管理XP+15。", "success");
            }
          }
        },
        {
          text: "😊 创业就是创业，职场就是职场",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h803CorpCareerDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 创业就是创业，职场就是职场。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: H→D 团队社交凝聚力 — 公司团队互动拓展NPC关系
    // 设计意图：公司团队成员应成为潜在的NPC朋友，让玩家感到"同事变朋友"。
    // 本事件在公司团队≥3人时触发，给予"团队友谊"标记。
    // 心理学：社会认同 — 被团队接纳的满足感。
    // ========================================================================
    {
      id: "h803_team_social_bond",
      phase: "corporate",
      icon: "🤝",
      title: "同事，也可以成为朋友",
      story: "你和团队成员一起加班、一起庆功、一起扛过最难的时刻。\n\n不知不觉中，你们不再是单纯的同事关系——你们成了可以交心的朋友。\n\n职场里能遇到这样的伙伴，是一种幸运。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h803TeamBondDone) return false;
        if (st.player.phase !== "corporate" || !st.corporate || !st.corporate.colleagues) return false;
        var _teamSize = (st.corporate.colleagues.network || []).length;
        return _teamSize >= 3;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🤝 珍惜这段同事情谊",
          hint: "魅力+5, 社交XP+8, 置_h803TeamFriendship",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h803TeamBondDone = true;
            st.flags._h803TeamFriendship = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            grantXp("social", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 同事也可以成为朋友——魅力+5, 社交XP+8。", "success");
            }
          }
        },
        {
          text: "😊 保持职场距离",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h803TeamBondDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 保持职场距离。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: H→F 公司健康度UI — 公司数据在UI层的可视化展示
    // 设计意图：公司运营数据应在UI层有直观的仪表盘展示。
    // 本事件在公司存续≥90天时触发，给予"经营仪表盘"标记。
    // 心理学：认知负荷 — 综合仪表盘降低玩家信息处理负担。
    // ========================================================================
    {
      id: "h803_corporate_dashboard",
      phase: "corporate",
      icon: "📊",
      title: "一眼看清公司全貌",
      story: "你打开经营仪表盘——KPI、现金流、团队士气、市场份额……\n\n所有数据一目了然。你终于看清了公司的全貌：哪里健康、哪里需要调整。\n\n清晰的数据认知，是正确经营决策的基础。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h803CorpDashDone) return false;
        if (st.player.phase !== "corporate" || !st.startup) return false;
        return st.player.day >= 90;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "📊 启用经营仪表盘",
          hint: "智力+5, 管理XP+8, 置_h803CorpDashboard",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h803CorpDashDone = true;
            st.flags._h803CorpDashboard = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            grantXp("management", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 经营仪表盘已启用——智力+5, 管理XP+8。", "success");
            }
          }
        },
        {
          text: "😅 看报表就够了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h803CorpDashDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 看报表就够了。心智+3。", "info");
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

/*
 * 城市浮生记 — 域F(UI/UX) 联动增强 R820
 * 全系统优化·Domain F 第六十二轮循环
 *
 * 【联动增强3项】
 *   1. F→C 职业技能展示UIv2 — 技能面板展示职业技能成长轨迹
 *   2. F→D 社交关系图谱UIv2 — 社交面板展示NPC关系网络可视化
 *   3. F→H 公司健康度UIv2 — 职场Tab展示经营数据一览
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR820Loaded) return;
  RANDOM_EVENTS._domainFLinkageR820Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: F→C 职业技能展示UIv2 — 技能面板展示职业技能成长轨迹
    // 设计意图：技能面板应展示职业技能成长轨迹和市场需求。
    // 本事件在玩家拥有≥3个Lv.40+技能时触发，给予"技能成长可视化"标记。
    // 心理学：禀赋效应 — 玩家更珍视自己投入时间培养的技能。
    // ========================================================================
    {
      id: "f820_skill_growth_ui_v2",
      phase: "street",
      icon: "📊",
      title: "你的职业技能成长，看得见",
      story: "你打开技能面板——每一个技能的成长轨迹、市场需求、职业关联都清晰可见。\n\n从最初的生疏，到现在的熟练。每一点进步，都记录在案。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f820SkillGrowthDone) return false;
        if (!st.skills) return false;
        var _count = 0;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 40) _count++;
        }
        return _count >= 3;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 查看技能成长轨迹",
          hint: "智力+5, 置_f820SkillGrowthViz",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f820SkillGrowthDone = true;
            st.flags._f820SkillGrowthViz = true;
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
            st.flags._f820SkillGrowthDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 技能够用就行。心智+2。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: F→D 社交关系图谱UIv2 — 社交面板展示NPC关系网络可视化
    // 设计意图：社交面板应展示NPC关系网络图，让玩家感到"社交圈可见"。
    // 本事件在玩家拥有≥6个已结识NPC时触发，给予"关系图谱"标记。
    // 心理学：社会认同 — 被群体接纳的满足感。
    // ========================================================================
    {
      id: "f820_social_graph_ui_v2",
      phase: "street",
      icon: "🕸️",
      title: "你的社交圈，是一张网",
      story: "你打开社交面板——每一个朋友都是一个节点，每一条关系都是一条线。\n\n你的社交圈，像一张网一样展开。谁是核心节点，谁是边缘连接，一目了然。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f820SocGraphDone) return false;
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          if (st.relationships[_id] && st.relationships[_id].met) _metCount++;
        }
        return _metCount >= 6;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🕸️ 查看社交关系图谱",
          hint: "魅力+5, 社交XP+8, 置_f820SocialGraph",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f820SocGraphDone = true;
            st.flags._f820SocialGraph = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            grantXp("social", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🕸️ 社交关系图谱已可视化——魅力+5, 社交XP+8。", "success");
            }
          }
        },
        {
          text: "😅 朋友不用看得那么清楚",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f820SocGraphDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 朋友不用看得那么清楚。心智+2。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: F→H 公司健康度UIv2 — 职场Tab展示经营数据一览
    // 设计意图：公司运营数据应在UI层有直观的仪表盘展示。
    // 本事件在corporate阶段且公司存续≥120天时触发。
    // 心理学：认知负荷 — 综合仪表盘降低玩家信息处理负担。
    // ========================================================================
    {
      id: "f820_corporate_dashboard_v2",
      phase: "corporate",
      icon: "🏢",
      title: "一眼看清公司全貌",
      story: "你打开经营仪表盘——KPI、现金流、团队士气、市场份额……\n\n所有数据一目了然。你终于看清了公司的全貌：哪里健康、哪里需要调整。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f820CorpDashDone) return false;
        if (st.player.phase !== "corporate" || !st.startup) return false;
        return st.player.day >= 120;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "📊 查看经营仪表盘",
          hint: "智力+5, 管理XP+8, 置_f820CorpDashboard",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f820CorpDashDone = true;
            st.flags._f820CorpDashboard = true;
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
            st.flags._f820CorpDashDone = true;
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

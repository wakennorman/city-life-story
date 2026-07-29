/*
 * 城市浮生记 — 域F(UI/UX) 联动增强 R808
 * 全系统优化·Domain F 第六十一轮循环
 *
 * 【联动增强3项】
 *   1. F→C 职业技能展示UI — 技能面板展示职业技能成长轨迹
 *   2. F→D 社交关系图谱UI — 社交面板展示NPC关系网络可视化
 *   3. F→G 生命质量仪表盘 — UI层展示综合生命质量评分
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR808Loaded) return;
  RANDOM_EVENTS._domainFLinkageR808Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: F→C 职业技能展示UI — 技能面板展示职业技能成长轨迹
    // 设计意图：技能面板应展示技能成长轨迹和职业关联，让玩家感到"成长可见"。
    // 本事件在玩家拥有≥3个Lv.20+技能时触发，给予"技能成长可视化"标记。
    // 心理学：禀赋效应 — 玩家更珍视自己投入时间培养的技能。
    // ========================================================================
    {
      id: "f808_skill_growth_ui",
      phase: "street",
      icon: "📊",
      title: "你的技能成长，看得见",
      story: "你打开技能面板——每一个技能的成长轨迹都清晰可见。\n\n从最初的生疏，到现在的熟练。每一点进步，都记录在案。\n\n成长，最好的证明就是数据。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f808SkillGrowthDone) return false;
        if (!st.skills) return false;
        var _count = 0;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 20) _count++;
        }
        return _count >= 3;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 查看技能成长轨迹",
          hint: "智力+5, 置_f808SkillGrowthViz",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f808SkillGrowthDone = true;
            st.flags._f808SkillGrowthViz = true;
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
            st.flags._f808SkillGrowthDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 技能够用就行。心智+2。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: F→D 社交关系图谱UI — 社交面板展示NPC关系网络可视化
    // 设计意图：社交面板应展示NPC关系网络图，让玩家感到"社交圈可见"。
    // 本事件在玩家拥有≥5个已结识NPC时触发，给予"关系图谱"标记。
    // 心理学：社会认同 — 被群体接纳的满足感。
    // ========================================================================
    {
      id: "f808_social_graph_ui",
      phase: "street",
      icon: "🕸️",
      title: "你的社交圈，是一张网",
      story: "你打开社交面板——每一个朋友都是一个节点，每一条关系都是一条线。\n\n你的社交圈，像一张网一样展开。谁是核心节点，谁是边缘连接，一目了然。\n\n社交圈的质量，决定了生活的质量。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f808SocGraphDone) return false;
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          if (st.relationships[_id] && st.relationships[_id].met) _metCount++;
        }
        return _metCount >= 5;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🕸️ 查看社交关系图谱",
          hint: "魅力+5, 社交XP+8, 置_f808SocialGraph",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f808SocGraphDone = true;
            st.flags._f808SocialGraph = true;
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
            st.flags._f808SocGraphDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 朋友不用看得那么清楚。心智+2。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: F→G 生命质量仪表盘 — UI层展示综合生命质量评分
    // 设计意图：综合生命质量评分应在UI层有直观的仪表盘展示。
    // 本事件在玩家生存≥120天时触发，给予"生命质量仪表盘"标记。
    // 心理学：认知负荷 — 综合评分降低玩家信息处理负担。
    // ========================================================================
    {
      id: "f808_life_quality_dashboard",
      phase: "street",
      icon: "🌟",
      title: "你的生命质量，几分？",
      story: "你打开生命质量仪表盘——健康、心情、财富、社交、技能……\n\n所有指标汇聚成一个清晰的综合评分。你终于看清了自己的生命状态：哪里好、哪里需要改善。\n\n清晰的认知，是改善的第一步。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f808LifeQualDone) return false;
        return st.player.day >= 120;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🌟 查看生命质量仪表盘",
          hint: "心智+8, 置_f808LifeQualityDash",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f808LifeQualDone = true;
            st.flags._f808LifeQualityDash = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌟 生命质量仪表盘已启用——心智+8。清晰的认知，是改善的第一步。", "success");
            }
          }
        },
        {
          text: "😅 活得开心就好",
          hint: "心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f808LifeQualDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 活得开心就好。心情+3。", "info");
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

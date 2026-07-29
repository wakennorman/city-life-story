/*
 * 城市浮生记 — 域D(NPC/社交) 联动增强 R825
 * 全系统优化·Domain D 第六十二轮循环
 *
 * 【联动增强3项】
 *   1. D→F 社交UI面板v3 — NPC关系在UI层的综合可视化展示
 *   2. D→H 创业社交圈v2 — NPC关系网络深度反哺创业团队
 *   3. D→A 社交资本数据v3 — NPC关系网络转化为数值平衡数据资产
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR825Loaded) return;
  RANDOM_EVENTS._domainDLinkageR825Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: D→F 社交UI面板v3 — NPC关系在UI层的综合可视化展示
    // 设计意图：NPC关系应在UI层有直观的可视化展示，让玩家感到"社交圈可见"。
    // 本事件在玩家拥有≥7个已结识NPC时触发，给予"社交UIv3"标记。
    // 心理学：认知负荷 — 可视化降低玩家信息处理负担。
    // ========================================================================
    {
      id: "d825_social_ui_v3",
      phase: "street",
      icon: "🖼️",
      title: "你的社交圈，一目了然",
      story: "你打开社交面板——每一个朋友都是一个节点，每一条关系都是一条线。\n\n你的社交圈，像一张网一样展开。谁是核心节点，谁是边缘连接，一目了然。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d825SocUIPanelDone) return false;
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          if (st.relationships[_id] && st.relationships[_id].met) _metCount++;
        }
        return _metCount >= 7;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🖼️ 查看社交面板",
          hint: "魅力+5, 社交XP+10, 置_d825SocialUIPanel",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d825SocUIPanelDone = true;
            st.flags._d825SocialUIPanel = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            grantXp("social", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🖼️ 社交面板已可视化——魅力+5, 社交XP+10。", "success");
            }
          }
        },
        {
          text: "😅 朋友不用看得那么清楚",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d825SocUIPanelDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 朋友不用看得那么清楚。心智+2。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: D→H 创业社交圈v2 — NPC关系网络深度反哺创业团队
    // 设计意图：NPC关系网络应在创业阶段提供团队组建优势。
    // 本事件在corporate阶段且玩家拥有≥4个好感≥50的NPC时触发。
    // 心理学：社会认同 — 被朋友支持的满足感。
    // ========================================================================
    {
      id: "d825_social_to_startup_v2",
      phase: "corporate",
      icon: "🚀",
      title: "朋友圈，就是创业团队的人才库",
      story: "你发现——身边那些信得过的朋友，其实就是创业团队最好的候选人。\n\n他们了解你、信任你、愿意和你一起拼。\n\n朋友圈，就是创业团队的人才库。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d825SocToStartupDone) return false;
        if (st.player.phase !== "corporate" || !st.relationships) return false;
        var _trusted = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 50) _trusted++;
        }
        return _trusted >= 4;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🚀 邀请朋友加入创业",
          hint: "管理XP+12, 置_d825TeamFromFriends",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d825SocToStartupDone = true;
            st.flags._d825TeamFromFriends = true;
            grantXp("management", 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 朋友圈就是创业团队的人才库——管理XP+12。", "success");
            }
          }
        },
        {
          text: "😊 朋友归朋友，创业归创业",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d825SocToStartupDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 朋友归朋友，创业归创业。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: D→A 社交资本数据v3 — NPC关系网络转化为数值平衡数据资产
    // 设计意图：NPC关系网络应产生可量化的"社交资本"数据，供数值域消费。
    // 本事件在玩家拥有≥10个已结识NPC时触发，给予"社交资本数据v3"标记。
    // 心理学：禀赋效应 — 玩家感到"人脉是我的财富"。
    // ========================================================================
    {
      id: "d825_social_capital_data_v3",
      phase: "street",
      icon: "💎",
      title: "你的社交资本，可以量化",
      story: "你查看了社交资本报告——已结识10位朋友，平均好感65，社交资本总值650。\n\n这些数字不只是统计，它们代表了你在城市里的「关系资产」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d825SocCapDataDone) return false;
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          if (st.relationships[_id] && st.relationships[_id].met) _metCount++;
        }
        return _metCount >= 10;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "💎 查看社交资本数据",
          hint: "智力+8, 管理XP+10, 置_d825SocialCapitalData",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d825SocCapDataDone = true;
            st.flags._d825SocialCapitalData = true;
            // 计算社交资本数据供A域消费
            var _totalAff = 0;
            for (var _id in st.relationships) {
              var _r = st.relationships[_id];
              if (_r && _r.met) _totalAff += (_r.affinity || 0);
            }
            st.flags._d825SocialCapitalValue = _totalAff;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("management", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💎 社交资本数据已生成——智力+8, 管理XP+10。", "success");
            }
          }
        },
        {
          text: "😅 朋友不用数据衡量",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d825SocCapDataDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 朋友不用数据衡量。心智+2。", "info");
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

/*
 * 城市浮生记 — 域E(经济/投资) 联动增强 R819
 * 全系统优化·Domain E 第六十三轮循环
 *
 * 【联动增强3项】
 *   1. E→C 职业技能→投资v2 — 职业技能深度引导投资决策
 *   2. E→D 投资者社交v2 — NPC关系网络提供投资情报
 *   3. E→F 投资UI展示v2 — 投资数据在UI层的综合展示
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR819Loaded) return;
  RANDOM_EVENTS._domainELinkageR819Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: E→C 职业技能→投资v2 — 职业技能深度引导投资决策
    // 设计意图：职业技能应深度引导玩家关注投资，形成"技能→投资"决策链。
    // 本事件在玩家拥有≥1个Lv.50+技能且总资产≥¥8万时触发。
    // 心理学：禀赋效应 — 玩家感到"技能应该变现"。
    // ========================================================================
    {
      id: "e819_skill_to_invest_v2",
      phase: "street",
      icon: "💰",
      title: "用技能赚钱，让钱生钱",
      story: "你发现——自己的技能水平已经足够高了，但收入增长却遇到了瓶颈。\n\n是时候考虑：如何让技能赚到的钱，继续为你赚钱？\n\n从「打工者」到「投资者」，是人生的重要跨越。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e819SkillInvestDone) return false;
        if (!st.skills || !st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        if (_total < 80000) return false;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 50) return true;
        }
        return false;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 学习用技能收益投资",
          hint: "智力+8, 会计XP+12, 置_e819SkillInvestor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e819SkillInvestDone = true;
            st.flags._e819SkillInvestor = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你开始学习用技能收益投资——智力+8, 会计XP+12。", "success");
            }
          }
        },
        {
          text: "😅 技能赚钱就够了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e819SkillInvestDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 技能赚钱就够了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: E→D 投资者社交v2 — NPC关系网络提供投资情报
    // 设计意图：NPC关系网络应提供更深层的投资情报，让玩家感到"朋友有用"。
    // 本事件在玩家拥有≥2个好感≥60的NPC且总资产≥¥5万时触发。
    // 心理学：互惠原则 — 玩家感到"帮朋友也是帮自己"。
    // ========================================================================
    {
      id: "e819_investor_social_v2",
      phase: "street",
      icon: "🤝",
      title: "投资圈里的人脉，是用信息换来的",
      story: "你在投资交流会上遇到了几个志同道合的人——大家都在讨论市场、分析数据、分享经验。\n\n原来，投资圈里的人脉，是用信息换来的。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e819InvestorSocDone) return false;
        if (!st.relationships || !st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        if (_total < 50000) return false;
        var _closeFriends = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 60) _closeFriends++;
        }
        return _closeFriends >= 2;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🤝 加入投资者圈子",
          hint: "魅力+5, 社交XP+10, 置_e819InvestorCircle",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e819InvestorSocDone = true;
            st.flags._e819InvestorCircle = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            grantXp("social", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 你加入了投资者圈子——魅力+5, 社交XP+10。", "success");
            }
          }
        },
        {
          text: "😅 独自投资更自在",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e819InvestorSocDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 独自投资更自在。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: E→F 投资UI展示v2 — 投资数据在UI层的综合展示
    // 设计意图：投资数据应在UI层有直观的综合仪表盘展示。
    // 本事件在玩家持有≥3个不同标的且总资产≥¥5万时触发。
    // 心理学：认知负荷 — 综合仪表盘降低玩家信息处理负担。
    // ========================================================================
    {
      id: "e819_invest_dashboard_v2",
      phase: "street",
      icon: "📊",
      title: "你的投资组合，一目了然",
      story: "你打开投资仪表盘——股票、基金、房产、BTC……\n\n所有持仓、收益、风险指标一目了然。你终于看清了自己的投资全貌：哪里赚、哪里亏、哪里需要调整。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e819InvestDashDone) return false;
        if (!st.investment || !st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        if (_total < 50000) return false;
        var _holdings = st.investment.stockHoldings || [];
        var _stockCount = 0;
        for (var _s in _holdings) { if (_holdings[_s] && _holdings[_s].shares > 0) _stockCount++; }
        var _types = _stockCount + (st.investment.btcHoldings > 0 ? 1 : 0) + (st.investment.properties.length > 0 ? 1 : 0);
        return _types >= 3;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📊 查看投资仪表盘",
          hint: "智力+8, 会计XP+10, 置_e819InvestDashboard",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e819InvestDashDone = true;
            st.flags._e819InvestDashboard = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 投资仪表盘已启用——智力+8, 会计XP+10。", "success");
            }
          }
        },
        {
          text: "😅 大概知道就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e819InvestDashDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 大概知道就行。心智+3。", "info");
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

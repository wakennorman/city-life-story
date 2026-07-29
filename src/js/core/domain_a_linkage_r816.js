/*
 * 城市浮生记 — 域A(数据/数值平衡) 联动增强 R816
 * 全系统优化·Domain A 第十五轮循环
 *
 * 【联动增强3项】
 *   1. A→C 技能市场需求 — 技能等级影响职业市场需求
 *   2. A→D 公平价格社交 — 价格公平感影响NPC社交
 *   3. A→G 经济健康度 — 经济数据反馈为生命质量
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR816Loaded) return;
  RANDOM_EVENTS._domainALinkageR816Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: A→C 技能市场需求 — 技能等级影响职业市场需求
    // 设计意图：技能数据应影响职业市场需求，让玩家感到"技能决定机会"。
    // 本事件在玩家拥有≥1个Lv.40+技能时触发，给予"技能市场需求"标记。
    // 心理学：禀赋效应 — 玩家更珍视自己投入时间培养的技能。
    // ========================================================================
    {
      id: "a816_skill_market_demand",
      phase: "street",
      icon: "📈",
      title: "你的技能，市场上抢着要",
      story: "你打开求职市场——发现自己的技能水平，已经超过了大多数岗位的要求。\n\n不是因为你运气好，而是因为你把技能练到了市场上真正需要的水平。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a816SkillDemandDone) return false;
        if (!st.skills) return false;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 40) return true;
        }
        return false;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📈 用技能匹配市场需求",
          hint: "智力+5, 管理XP+8, 置_a816SkillDemand",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a816SkillDemandDone = true;
            st.flags._a816SkillDemand = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            grantXp("management", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 技能匹配市场需求——智力+5, 管理XP+8。", "success");
            }
          }
        },
        {
          text: "😅 技能够用就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a816SkillDemandDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 技能够用就行。心智+2。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: A→D 公平价格社交 — 价格公平感影响NPC社交
    // 设计意图：价格数据(公平/不公平)应影响NPC对玩家的态度。
    // 本事件在玩家经历过≥3次价格异常事件时触发，给予"公平价格"标记。
    // 心理学：社会比较 — 玩家感到"公平对待他人，他人也公平对待你"。
    // ========================================================================
    {
      id: "a816_fair_price_social",
      phase: "street",
      icon: "⚖️",
      title: "公平交易，赢得尊重",
      story: "你在市场上总是坚持公平交易——不坑人，不欺生。\n\n渐渐地，摊主们都知道你是个实在人。有人给你留好的，有人给你便宜价。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a816FairPriceDone) return false;
        var _priceEvents = st.flags._priceEventCount || 0;
        return _priceEvents >= 3;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "⚖️ 坚持公平交易",
          hint: "魅力+5, 社交XP+8, 置_a816FairPriceTrader",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a816FairPriceDone = true;
            st.flags._a816FairPriceTrader = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            grantXp("social", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("⚖️ 公平交易赢得尊重——魅力+5, 社交XP+8。", "success");
            }
          }
        },
        {
          text: "😅 做生意总要赚点",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a816FairPriceDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 做生意总要赚点。心智+2。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: A→G 经济健康度 — 经济数据反馈为生命质量
    // 设计意图：经济数据(收支/储蓄/负债)应反馈为生命质量评分。
    // 本事件在玩家总资产≥¥10万时触发，给予"经济健康"标记。
    // 心理学：认知负荷 — 综合经济评分降低玩家信息处理负担。
    // ========================================================================
    {
      id: "a816_economic_health",
      phase: "street",
      icon: "💚",
      title: "经济健康，生命才有质量",
      story: "你算了算——总资产终于突破了六位数。\n\n存款、投资、房产……这些数字背后，是你在这座城市里一点一滴的积累。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a816EconHealthDone) return false;
        if (!st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return _total >= 100000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💚 评估经济健康度",
          hint: "心智+8, 会计XP+10, 置_a816EconHealthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a816EconHealthDone = true;
            st.flags._a816EconHealthy = true;
            var _debt = (st.resources.villageDebt || 0) + (st.resources.fineDebt || 0) + (st.resources.bankDebt || 0);
            var _assets = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
            st.flags._a816DebtToAssetRatio = _assets > 0 ? Math.round(_debt / _assets * 100) / 100 : 0;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 经济健康度评估完成——心智+8, 会计XP+10。", "success");
            }
          }
        },
        {
          text: "😅 有钱就行，不用评估",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a816EconHealthDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 有钱就行。心智+3。", "info");
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

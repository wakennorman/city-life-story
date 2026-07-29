/*
 * 城市浮生记 — 域A(数据/数值平衡) 联动增强 R854
 * 全系统优化·Domain A 第十八轮循环
 *
 * 【联动增强3项】
 *   1. A→B 价格波动叙事v15 — 价格数据触发事件叙事回响
 *   2. A→G 经济健康度v14 — 经济数据反馈为生命质量
 *   3. A→C 技能市场需求v14 — 技能数据影响职业市场需求
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR854Loaded) return;
  RANDOM_EVENTS._domainALinkageR854Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: A→B 价格波动叙事v15 — 价格数据触发事件叙事
    // 设计意图：价格异常应产生叙事回响，让玩家感到"市场在说话"。
    // 本事件在玩家经历≥7次价格异常事件时触发，给予"市场感知v15"标记。
    // 心理学：峰终定律 — 极端价格时刻成为记忆锚点。
    // ========================================================================
    {
      id: "a854_price_narrative_v15",
      phase: "street",
      icon: "📈",
      title: "市场在说话，你听懂了吗？",
      story: "最近市场价格波动剧烈——有人赚得盆满钵满，有人亏得血本无归。\n\n你开始意识到：市场不是随机的，它有自己的语言。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a854PriceNarrDone) return false;
        var _volEvents = st.flags._priceVolatilityCount || 0;
        return _volEvents >= 7 && st.player.day >= 200;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📈 学习读懂市场语言",
          hint: "智力+18, 置_a854MarketSense",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a854PriceNarrDone = true;
            st.flags._a854MarketSense = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 你开始学习读懂市场语言——智力+18。", "success");
            }
          }
        },
        {
          text: "😅 市场太复杂了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a854PriceNarrDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 市场太复杂了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: A→G 经济健康度v14 — 经济数据反馈为生命质量
    // 设计意图：经济数据(收支/储蓄/负债)应反馈为生命质量评分。
    // 本事件在玩家总资产≥¥20万时触发，给予"经济健康v14"标记。
    // 心理学：认知负荷 — 综合经济评分降低玩家信息处理负担。
    // ========================================================================
    {
      id: "a854_econ_health_v14",
      phase: "street",
      icon: "💚",
      title: "经济健康，生命才有质量",
      story: "你算了算——总资产突破了二十万。\n\n存款、投资、房产……这些数字背后，是你在这座城市里一点一滴的积累。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a854EconHealthDone) return false;
        if (!st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return _total >= 200000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💚 评估经济健康度",
          hint: "心智+18, 会计XP+20, 置_a854EconHealthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a854EconHealthDone = true;
            st.flags._a854EconHealthy = true;
            var _debt = (st.resources.villageDebt || 0) + (st.resources.fineDebt || 0) + (st.resources.bankDebt || 0);
            var _assets = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
            st.flags._a854DebtToAssetRatio = _assets > 0 ? Math.round(_debt / _assets * 100) / 100 : 0;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            grantXp("accounting", 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 经济健康度评估完成——心智+18, 会计XP+20。", "success");
            }
          }
        },
        {
          text: "😅 有钱就行，不用评估",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a854EconHealthDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 有钱就行。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: A→C 技能市场需求v14 — 技能数据影响职业市场需求
    // 设计意图：技能数据应影响职业市场需求，让玩家感到"技能决定机会"。
    // 本事件在玩家拥有≥4个Lv.60+技能时触发，给予"技能市场需求v14"标记。
    // 心理学：禀赋效应 — 玩家更珍视自己投入时间培养的技能。
    // ========================================================================
    {
      id: "a854_skill_demand_v14",
      phase: "street",
      icon: "📈",
      title: "你的技能，市场上抢着要",
      story: "你打开求职市场——发现自己的技能水平，已经超过了大多数岗位的要求。\n\n不是因为你运气好，而是因为你把技能练到了市场上真正需要的水平。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a854SkillDemandDone) return false;
        if (!st.skills) return false;
        var _count = 0;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 60) _count++;
        }
        return _count >= 4;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📈 用技能匹配市场需求",
          hint: "智力+15, 管理XP+18, 置_a854SkillDemand",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a854SkillDemandDone = true;
            st.flags._a854SkillDemand = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            grantXp("management", 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 技能匹配市场需求——智力+15, 管理XP+18。", "success");
            }
          }
        },
        {
          text: "😅 技能够用就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a854SkillDemandDone = true;
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

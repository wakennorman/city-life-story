/*
 * 城市浮生记 — 域A(数据/数值平衡) 联动增强 R929
 * 全系统优化·Domain A 第七十一轮循环
 *
 * 【联动增强3项】
 *   1. A→E 价格波动影响投资风险评估v1 — 市场波动率调整投资风险提示
 *   2. A→H 市场数据赋能企业决策v1 — 价格数据影响公司运营策略
 *   3. A→D 贸易声望影响NPC交易v1 — 交易数据影响NPC对玩家的态度
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动现有文件。
 *  - 所有 state 访问均 || 防御。
 *  - 严格遵守目标域数据格式。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR929Loaded) return;
  RANDOM_EVENTS._domainALinkageR929Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: A→E 价格波动影响投资风险评估v1
    // 设计意图：市场波动率数据应影响投资风险评估，高波动时提示风险。
    // 触发：玩家有≥10次交易记录，且市场波动率监测到异常
    // 心理学：损失厌恶 — 高波动环境触发风险规避心理
    // ========================================================================
    {
      id: "a929_volatility_invest_risk_v1",
      phase: "street",
      icon: "📊",
      title: "市场波动，投资需谨慎",
      story: "你盯着最近的价格走势图——波动幅度明显加大。\n\n上一次这种波动之后，市场经历了一轮洗牌。现在进场，风险不小。",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_a929VolRiskCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a929VolRiskCd) return false;
        if (!st.trade || (st.trade.totalTrades || 0) < 10) return false;
        // 检测市场波动：通过价格波动计数判断
        var _vol = st.flags._priceVolatilityCount || 0;
        return _vol >= 5 && st.player.day >= 60;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "📊 分析风险，调整策略",
          hint: "智力+15, 会计XP+18, 置_a929RiskAware",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a929VolRiskCd = true;
            st.flags._a929RiskAware = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            grantXp("accounting", 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 你分析了波动数据，调整了投资策略——智力+15, 会计XP+18。", "success");
            }
          }
        },
        {
          text: "😅 先观望再说",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a929VolRiskCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 先观望再说。心智+5。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: A→H 市场数据赋能企业决策v1
    // 设计意图：价格数据(通胀/成本)应影响公司运营策略。
    // 触发：玩家已开公司(corporate.active)，且市场通胀数据可用
    // 心理学：认知负荷 — 综合市场数据降低决策负担
    // ========================================================================
    {
      id: "a929_market_data_corp_v1",
      phase: "corporate",
      icon: "🏢",
      title: "市场数据指导公司运营",
      story: "你翻阅这个季度的采购报表——原材料价格波动直接影响利润。\n\n如果能提前预判市场走向，就能在成本最低时囤货。",
      triggers: { minDay: 120, interval: 150, maxRepeats: 4, excludeFlags: ["_a929CorpDataCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a929CorpDataCd) return false;
        if (!st.corporate || !st.corporate.active) return false;
        // 需要有一定通胀数据积累
        var _inf = st.flags._cumulativeInflation || 0;
        return Math.abs(_inf) > 0.05 && st.player.day >= 120;
      },
      probability: 0.05,
      repeatable: true,
      choices: [
        {
          text: "📈 用数据优化采购策略",
          hint: "管理XP+20, 智力+12, 置_a929DataDriven",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a929CorpDataCd = true;
            st.flags._a929DataDriven = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            grantXp("management", 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 你用市场数据优化了采购策略——管理XP+20, 智力+12。", "success");
            }
          }
        },
        {
          text: "😅 靠经验就行了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a929CorpDataCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 靠经验就行了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: A→D 贸易声望影响NPC交易v1
    // 设计意图：玩家的交易记录(利润/次数)应影响NPC对玩家的态度，
    //    让NPC把玩家视为"懂行的人"或"精明商人"。
    // 触发：玩家累计交易利润≥¥2000，且有已结识NPC
    // 心理学：社会比较 — NPC通过比较玩家交易水平调整态度
    // ========================================================================
    {
      id: "a929_trade_reputation_npc_v1",
      phase: "street",
      icon: "🤝",
      title: "交易圈的名声传开了",
      story: "你在市场里倒买倒卖的日子久了，街坊邻居都看在眼里。\n\n卖菜的王婶和修车的老张都在议论你——说你是个精明的生意人，手里的货总比别人便宜两成。",
      triggers: { minDay: 30, interval: 90, maxRepeats: 2, excludeFlags: ["_a929TradeRepCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a929TradeRepCd) return false;
        if (!st.trade || !st.relationships) return false;
        // 需要累计交易利润≥¥2000
        var _profit = st.trade.totalProfit || 0;
        if (_profit < 2000) return false;
        // 需要至少1个已结识NPC
        var _met = 0;
        for (var _id in st.relationships) {
          if (st.relationships[_id] && st.relationships[_id].met) { _met++; }
        }
        return _met >= 1;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "🤝 分享交易经验",
          hint: "社交好感+3, 销售XP+15, 置_a929TradeRep",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a929TradeRepCd = true;
            st.flags._a929TradeRep = true;
            // 给随机已结识NPC加好感
            var _metIds = [];
            for (var _id2 in st.relationships) {
              if (st.relationships[_id2] && st.relationships[_id2].met) _metIds.push(_id2);
            }
            if (_metIds.length > 0 && typeof applyAffinityChange === "function") {
              var _pick = _metIds[typeof Random !== "undefined" ? Random.int(0, _metIds.length - 1) : Math.floor(Math.random() * _metIds.length)];
              applyAffinityChange(st, _pick, 3, "交易经验分享");
            }
            grantXp("sales", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 你分享了交易经验，朋友们对你刮目相看！销售XP+15。", "success");
            }
          }
        },
        {
          text: "😅 低调低调",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a929TradeRepCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 低调低调。心智+3。", "info");
            }
          }
        }
      ]
    }
  ];

  // 去重注册
  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
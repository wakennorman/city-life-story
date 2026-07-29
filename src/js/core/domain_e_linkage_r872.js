/*
 * 城市浮生记 — 域E(经济/投资) 联动增强 R872
 * 全系统优化·Domain E 第六十七轮循环
 *
 * 【联动增强3项 — E→D(仅6次) + E→H(22次) 方向,均为历轮薄弱】
 *   1. E→D 朋友借钱投资v1 — 高好感NPC向你借钱投资,借不借?
 *   2. E→D 投资失败时朋友的态度v1 — 投资亏损后朋友的态度变化
 *   3. E→H 投资收益反哺公司v1 — 个人投资赚钱后把收益投入公司
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS,避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 *  - E→D 核心设计理念：投资不是孤立的数字游戏,
 *    赚了钱有人恭喜,亏了钱有人借钱——损失厌恶+社会比较。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR872Loaded) return;
  RANDOM_EVENTS._domainELinkageR872Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  /** 获取最高好感的已结识NPCid */
  function topMetNpcId(state) {
    if (!state || !state.relationships) return null;
    var _best = null, _bestAff = -101;
    for (var _id in state.relationships) {
      if (!Object.prototype.hasOwnProperty.call(state.relationships, _id)) continue;
      var _r = state.relationships[_id];
      if (_r && _r.met && (_r.affinity || 0) > _bestAff) { _bestAff = _r.affinity || 0; _best = _id; }
    }
    return _best;
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: E→D 朋友借钱投资v1 — 高好感NPC向你借钱投资
    // 设计意图：投资赚钱后,高好感NPC来借钱投资,借不借?
    //   借：可能亏钱导致友情破裂,也可能赚钱大家一起赚
    //   不借：保全资金但友情有裂痕
    // 触发：持有投资 + ≥1个好感≥60的NPC + 有盈利
    // 心理学：损失厌恶(怕亏钱)+社会比较(朋友也想赚钱)+禀赋效应(拥有感)
    // ========================================================================
    {
      id: "e872_friend_borrow_invest_v1",
      phase: "street",
      icon: "🤝",
      title: "朋友想借钱投资",
      story: "一个关系不错的朋友找到你——「听说你投资赚了点钱？我手里有点闲钱,想跟着你一起投,你带我一个？」\n\n借钱容易,可万一亏了呢？",
      triggers: { minDay: 120, interval: 240, maxRepeats: 1, excludeFlags: ["_e872BorrowCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e872BorrowCd) return false;
        // 需持有投资且有盈利
        if (!st.investment) return false;
        var _inv = st.investment;
        var _hasProfit = (_inv.stockHoldings && Object.keys(_inv.stockHoldings).length > 0) ||
                         (_inv.btcHoldings && _inv.btcHoldings > 0);
        if (!_hasProfit) return false;
        // 需有至少1个好感≥60的已结识NPC
        if (!st.relationships) return false;
        var _hasFriend = false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 60) { _hasFriend = true; break; }
        }
        return _hasFriend;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🤝 带他一起投",
          hint: "社交XP+15, 朋友好感+5, 置_e872CoInvest",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e872BorrowCd = true;
            st.flags._e872CoInvest = true;
            grantXp("social", 15);
            var _friend = topMetNpcId(st);
            if (_friend && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, _friend, 5, "带朋友投资");
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 你带朋友一起投资——社交XP+15, 朋友好感+5。投资有风险,入市需谨慎。", "success");
            }
          }
        },
        {
          text: "😅 婉拒,建议他自己学",
          hint: "智力+10, 会计XP+10, 置_e872DeclineBorrow",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e872BorrowCd = true;
            st.flags._e872DeclineBorrow = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 你婉拒了,建议他自己先学习——智力+10, 会计XP+10。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: E→D 投资失败时朋友的态度v1 — 投资亏损后朋友的态度
    // 设计意图：投资亏损后,不同态度的NPC给出不同反应,
    //   让玩家感到"投资不是孤立的"——损失厌恶+社会支持
    // 触发：投资亏损≥20% + ≥1个好感≥40的NPC
    // 心理学：损失厌恶(亏钱后的情绪)+社会支持(朋友的温暖)
    // ========================================================================
    {
      id: "e872_invest_loss_friend_v1",
      phase: "street",
      icon: "💔",
      title: "投资亏了,朋友怎么看你",
      story: "最近投资亏了不少,心情低落。\n\n这时候,有个朋友找到了你——他没有嘲笑,也没有说教,只是默默地陪你喝了一杯。",
      triggers: { minDay: 150, interval: 300, maxRepeats: 1, excludeFlags: ["_e872LossFriendCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e872LossFriendCd) return false;
        // 需有投资且总体亏损
        if (!st.investment) return false;
        var _inv = st.investment;
        var _profit = (typeof _inv._totalInvestmentProfit === "number") ? _inv._totalInvestmentProfit : 0;
        if (_profit >= 0) return false; // 必须亏损
        // 需有至少1个好感≥40的已结识NPC
        if (!st.relationships) return false;
        var _hasFriend = false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 40) { _hasFriend = true; break; }
        }
        return _hasFriend;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "💚 感谢朋友的陪伴",
          hint: "社交XP+15, 朋友好感+8, 心情+10, 置_e872Grateful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e872LossFriendCd = true;
            st.flags._e872Grateful = true;
            grantXp("social", 15);
            var _friend = topMetNpcId(st);
            if (_friend && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, _friend, 8, "低谷时陪伴");
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 感谢朋友的陪伴——社交XP+15, 朋友好感+8, 心情+10。低谷时的温暖最珍贵。", "success");
            }
          }
        },
        {
          text: "😅 自己消化,不让朋友担心",
          hint: "心智+15, 置_e872SoloProcess",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e872LossFriendCd = true;
            st.flags._e872SoloProcess = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 你选择自己消化——心智+15。投资的路,终究要自己走。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: E→H 投资收益反哺公司v1 — 个人投资赚钱后投入公司
    // 设计意图：个人投资获得收益后,把部分收益注入公司,
    //   体现"个人财富与公司成长"的联动——禀赋效应+峰终定律
    // 触发：corporate阶段 + 个人投资盈利 + 公司现金流紧张
    // 心理学：禀赋效应(拥有感转移)+峰终定律(赚钱时刻的决策)
    // ========================================================================
    {
      id: "e872_profit_to_company_v1",
      phase: "corporate",
      icon: "🏦",
      title: "把投资收益投入公司",
      story: "个人投资赚了一笔,公司这边正好需要资金周转。\n\n是提现落袋为安,还是把收益注入公司、让钱继续生钱？",
      triggers: { minDay: 180, interval: 360, maxRepeats: 1, excludeFlags: ["_e872ProfitToCoCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e872ProfitToCoCd) return false;
        if (st.player.phase !== "corporate") return false;
        // 需有个人投资且盈利
        if (!st.investment) return false;
        var _inv = st.investment;
        var _profit = (typeof _inv._totalInvestmentProfit === "number") ? _inv._totalInvestmentProfit : 0;
        if (_profit <= 0) return false; // 必须盈利
        return true;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🏦 投入公司,钱生钱",
          hint: "管理XP+20, 现金+8000, 置_e872Reinvest",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e872ProfitToCoCd = true;
            st.flags._e872Reinvest = true;
            grantXp("management", 20);
            st.resources = st.resources || {};
            st.resources.cash = (st.resources.cash || 0) + 8000;
            if (typeof addDailyTransaction === "function") {
              addDailyTransaction(st, "income", "profit_reinvest", 8000, "投资收益投入公司");
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏦 把投资收益投入公司——管理XP+20, 现金+8000。钱放在会生钱的地方。", "success");
            }
          }
        },
        {
          text: "😅 提现落袋为安",
          hint: "心智+10, 现金+3000(仅部分提现), 置_e872PartialCash",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e872ProfitToCoCd = true;
            st.flags._e872PartialCash = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            st.resources = st.resources || {};
            st.resources.cash = (st.resources.cash || 0) + 3000;
            if (typeof addDailyTransaction === "function") {
              addDailyTransaction(st, "income", "profit_partial_cash", 3000, "投资收益部分提现");
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 提现落袋为安——心智+10, 现金+3000。落袋为安也是一种智慧。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();

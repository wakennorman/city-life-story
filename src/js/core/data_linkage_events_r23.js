/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强事件 · 第三轮
 * v3.120 · loop 全系统优化·Domain A 数值平衡→核心机制叙事化
 *          （R14 data_linkage_events.js / R22 data_linkage_events_r22.js 之后，
 *           补充「隐形经济平衡数据」的叙事化——此前 A 域联动只覆盖净资产的"量"，
 *           从未触及 economy_v3.1.js 真正计算的两套隐形机制：累进财富税梯度 / 市场饱和度惩罚）
 *
 * 设计约束（与 R14 / R22 一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS；所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 事件引擎严格按 e.phase 过滤（仅 "street"/"corporate"），本文件 2 个事件均 corporate。
 *  - 里程碑类事件用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截）。
 *  - EconomySystem（economy_v3.1.js）在 index.html 中于本文件之后加载，
 *    故所有 EconomySystem 访问均在事件函数体内惰性进行，并以 typeof 守卫，运行时必已就绪。
 *  - 本文件事件 id 统一前缀 data3_*，与 R14 data_* / R22 data2_* 不冲突。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._dataLinkageR23Loaded) return;
  RANDOM_EVENTS._dataLinkageR23Loaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 净资产快照（现金 + 银行存款 + 投资市值）
  function netWorthR23(st) {
    if (!st || !st.resources) return 0;
    var nw = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
    if (typeof getInvestmentAssetSnapshot === "function") {
      try {
        var snap = getInvestmentAssetSnapshot(st);
        if (snap && snap.investmentValue) nw += snap.investmentValue;
      } catch (e) {
        /* 忽略 */
      }
    }
    return nw;
  }

  // 当前活跃财富税档（惰性 + 守卫）
  function activeTaxTierR23(st) {
    if (typeof EconomySystem === "undefined" || !EconomySystem) return null;
    try {
      return EconomySystem.getActiveTaxTier(netWorthR23(st));
    } catch (e) {
      return null;
    }
  }

  // 市场饱和度惩罚系数（< 1.0 表示惩罚已生效）；惰性 + 守卫
  function satPenaltyR23(st) {
    if (typeof EconomySystem === "undefined" || !EconomySystem) return 1.0;
    try {
      var diff = (st && st._difficulty) || "normal";
      return EconomySystem.getMarketSaturationPenalty(
        netWorthR23(st),
        10000000,
        diff,
      );
    } catch (e) {
      return 1.0;
    }
  }

  // ============ 事件定义 ============

  // ===== A→G：累进财富税梯度 ↔ 核心机制叙事化（首次进入中产税档） =====
  // 设计意图：economy_v3.1.js 的 WEALTH_TAX_THRESHOLDS 是隐形数据，玩家从不知"为什么扣税、扣多少"。
  //   本事件在玩家首次踏入可感知的税档时，把"累进税制"这一核心机制包装成可理解的叙事。
  RANDOM_EVENTS.push({
    id: "data3_wealth_tax_intro",
    title: "账本上多了一笔「税」",
    desc: "你注意到每日结算里开始稳定扣一笔财富税——资产越多，边际税率越高。这背后是一套累进税制：入门税、中产税、精英税、富豪税逐级递增，越往上每一块钱都被征走更多。",
    phase: "corporate",
    triggers: { minDay: 150 },
    conditions: function (st) {
      if (!st || !st.player || st.player.phase !== "corporate") return false;
      if (st.flags && st.flags._data3WealthTaxIntroDone) return false;
      var tier = activeTaxTierR23(st);
      // 进入中产税及以上档（净资产 ≥ ¥50万），且税已可感知
      if (!tier || tier.min < 500000) return false; // [PLACEHOLDER] 触发档位门槛
      return true;
    },
    choices: [
      {
        text: "研究税制，把溢价部分做合理规划",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 4;
          if (st.flags) {
            st.flags._data3WealthTaxIntroDone = true;
            st.flags._dataTaxAware = true; // 供后续经济事件消费（税务规划心智）
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "你开始把累进税当成资产配置的一部分，而非单纯的损失。",
              "good",
            );
        },
      },
      {
        text: "肉疼，但认了",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._data3WealthTaxIntroDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== A→E：市场饱和度惩罚 ↔ 交易/投资经济（玩家体量开始影响市价） =====
  // 设计意图：economy_v3.1.js 的 getMarketSaturationPenalty 是隐形数据，玩家倒卖利润变薄却不知原因。
  //   本事件在饱和度惩罚首次生效时，把"你的体量在搅动市场"这一机制叙事化，并桥接 E 域投资心智。
  RANDOM_EVENTS.push({
    id: "data3_market_saturation",
    title: "你的买卖开始「搅动」市场",
    desc: "你发现同一笔倒卖生意的利润在悄悄变薄——当你的体量占到城市财富相当比例，买卖本身就会压低价、推高成本。这是市场饱和度的隐形之手，再大的盘子也逃不开边际递减。",
    phase: "corporate",
    triggers: { minDay: 200 },
    conditions: function (st) {
      if (!st || !st.player || st.player.phase !== "corporate") return false;
      if (st.flags && st.flags._data3MarketSaturationDone) return false;
      // 饱和度惩罚生效（玩家/城市财富比超过阈值 → 返回值 < 1.0）
      if (satPenaltyR23(st) >= 1.0) return false; // [PLACEHOLDER] 阈值由 EconomySystem 决定
      return true;
    },
    choices: [
      {
        text: "分散投资，绕开单一市场饱和",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 3;
          if (st.flags) {
            st.flags._data3MarketSaturationDone = true;
            st.flags._dataDiversifyMindset = true; // 供 E域投资事件消费（分散心智）
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "体量变大后，你学会了用分散来对抗市场饱和。",
              "good",
            );
        },
      },
      {
        text: "继续加码，赌规模效应",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._data3MarketSaturationDone = true;
        },
      },
    ],
    probability: 0.04,
  });
})();

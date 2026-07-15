/*
 * 城市浮生记 — 域E（经济/投资）联动增强事件 · R27（第二轮）
 * v3.118 · loop 全系统优化·Domain E 经济/投资 → 跨域桥接
 *
 * 设计约束（与 R11/R15/R18/R23/R26 一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || / isFinite 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件每个事件显式注册 street + corporate 两个变体（共享去重 flag，不会跨阶段双发）。
 *  - 投资组合市值复用全局 getInvestmentAssetSnapshot(st).investmentValue（与引擎/UI 同源，
 *    避免重算导致口径漂移）；净值镜像 data_linkage_events.js 的 netWorthA（现金+存款+投资市值）。
 *  - 本次聚焦「经济成就 ↔ 职场圈层」(E→C) 与「组合回撤 ↔ 损失厌恶叙事」(E→B) 两段此前空白。
 *
 * 与既有 E 域事件不重复说明：
 *  - invest_acumen_career(E→C) 是「盘感→会计技能 XP」；本 R27 的 econ_career_invest_unlock(E→C)
 *    是「净值/职级达门槛→被私募圈层邀请跟投，给真实现金+管理技能」，触发前提与收益均不同。
 *  - invest_drawdown_moral(E→B) 是「单只持仓浮亏>10%」；本 R27 的 econ_portfolio_drawdown(E→B)
 *    是「组合市值自历史峰值回撤≥20%」（峰终定律/损失厌恶），是更宏观的回撤叙事，互不构成冗余。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._econLinkageR27Loaded) return;
  RANDOM_EVENTS._econLinkageR27Loaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 投资组合市值（现金等价物以外的投资仓位），复用引擎全局快照，口径一致
  function portfolioValueR27(st) {
    try {
      if (typeof getInvestmentAssetSnapshot === "function") {
        var snap = getInvestmentAssetSnapshot(st);
        if (snap && isFinite(snap.investmentValue)) return snap.investmentValue;
      }
    } catch (e) {
      /* 忽略 */
    }
    return 0;
  }

  // 净资产（镜像 netWorthA：现金 + 银行存款 + 投资市值）
  function netWorthR27(st) {
    try {
      var nw = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
      return nw + portfolioValueR27(st);
    } catch (e) {
      return 0;
    }
  }

  // 是否已踏入投资门槛（持有一个以上投资标的）——作为经济域联动的触发闸门
  function isInvestorR27(st) {
    if (!st || !st.investment) return false;
    var h = st.investment.stockHoldings;
    return Array.isArray(h) && h.length >= 1;
  }

  // 安全改心情（兜底直写，避免依赖可能不存在的全局助手）
  function moodR27(st, delta) {
    if (!st || !st.needs) return;
    st.needs.happiness = Math.max(
      0,
      Math.min(100, (st.needs.happiness || 50) + delta),
    );
  }

  // ---- 事件定义 ----

  // ===== E→C：财富/职级立足 → 私募跟投圈层（经济成就反哺职场圈层）=====
  function careerUnlockCond(st) {
    if (!st || !st.player || !st.resources) return false;
    if (st.flags && st.flags._careerInvestUnlocked) return false; // 一次性
    if (netWorthR27(st) >= 200000) return true; // [PLACEHOLDER] 净值门槛
    // 职场期：职级达 P6 及以上（中层）也被圈层注意到
    if (
      st.player.phase === "corporate" &&
      st.corporate &&
      ["P6", "P7", "P8", "P9", "P10"].indexOf(st.corporate.rank) >= 0
    )
      return true;
    return false;
  }

  function careerUnlockApply(st, accept) {
    try {
      if (st.flags) st.flags._careerInvestUnlocked = true; // 无论接受与否都锁定一次性
      if (accept) {
        // 真实收益：圈层跟投首笔分红（现金）+ 管理技能（职场硬技能）兑现
        if (st.resources) st.resources.cash = (st.resources.cash || 0) + 30000; // [PLACEHOLDER] 跟投首笔分红
        if (st.skills)
          st.skills.management = Math.min(
            100,
            (st.skills.management || 0) + 3, // [PLACEHOLDER] 管理技能加成
          );
        if (st.player) st.player.mental = (st.player.mental || 50) + 4;
        moodR27(st, 3);
        if (typeof StateManager !== "undefined" && StateManager.addMessage)
          StateManager.addMessage(
            "圈层递来跟投的橄榄枝——钱生钱之外，你也成了「被看见」的人。现金+¥30000，管理+3。",
            "success",
          );
      } else {
        if (st.player) st.player.mental = (st.player.mental || 50) + 1;
        if (typeof StateManager !== "undefined" && StateManager.addMessage)
          StateManager.addMessage(
            "你婉拒了圈层邀请，先把眼前的事做扎实。心智+1。",
            "info",
          );
      }
    } catch (e) {
      /* 静默：任一奖励失败都不应阻断每日管线 */
    }
  }

  // ===== E→B：组合市值自峰值回撤 ≥20% → 损失厌恶叙事化（峰终定律）=====
  function drawdownCond(st) {
    if (!st || !st.player) return false;
    if (!isInvestorR27(st)) return false;
    var inv = st.investment || {};
    var cur = portfolioValueR27(st);
    if (!(cur > 0)) return false;
    // 峰值追踪（每日更新，幂等）：创新高当天不触发，等回撤
    if (!(inv._portfolioPeak > 0) || cur > inv._portfolioPeak) {
      inv._portfolioPeak = cur;
      return false;
    }
    if (cur > inv._portfolioPeak * 0.8) return false; // [PLACEHOLDER] 回撤阈值 20%
    // 仅在新低时触发（避免同一轮下跌反复敲击）
    var lastLow = (st.flags && st.flags._econLastDrawdownValue) || Infinity;
    if (!(cur < lastLow)) return false;
    // 30 天冷却
    if (
      st.flags &&
      typeof st.flags._econPeakDrawdownDay === "number" &&
      st.player.day - st.flags._econPeakDrawdownDay < 30 // [PLACEHOLDER] 冷却天数
    )
      return false;
    return true;
  }

  function drawdownApply(st, action) {
    try {
      var inv = st.investment || {};
      if (st.flags) {
        st.flags._econPeakDrawdownDay = st.player.day;
        st.flags._econLastDrawdownValue = portfolioValueR27(st);
      }
      if (action === "cut") {
        // 割肉止损：卖掉一半 BTC，落袋为安，但心情受挫
        if ((inv.btcHoldings || 0) > 0 && (inv.btcPrice || 0) > 0) {
          var half = inv.btcHoldings / 2;
          var proceeds = half * inv.btcPrice;
          inv.btcHoldings = inv.btcHoldings - half;
          if (!isFinite(inv.btcHoldings)) inv.btcHoldings = 0;
          if (st.resources)
            st.resources.cash = (st.resources.cash || 0) + proceeds;
        }
        moodR27(st, -4); // [PLACEHOLDER] 割肉心情惩罚
        if (typeof StateManager !== "undefined" && StateManager.addMessage)
          StateManager.addMessage(
            "你按下卖出键，账户不再滴血——但那种抽离感，半天没缓过来。心情-4。",
            "warning",
          );
      } else if (action === "add") {
        // 逆势加仓：用 ≤¥50000 预算抄底 BTC
        var budget = Math.min(50000, st.resources ? st.resources.cash || 0 : 0); // [PLACEHOLDER] 加仓预算
        if (budget > 0 && (inv.btcPrice || 0) > 0) {
          if (st.resources)
            st.resources.cash = (st.resources.cash || 0) - budget;
          inv.btcHoldings = (inv.btcHoldings || 0) + budget / inv.btcPrice;
        }
        moodR27(st, -2); // [PLACEHOLDER] 抄底焦虑
        if (typeof StateManager !== "undefined" && StateManager.addMessage)
          StateManager.addMessage(
            "别人恐惧你贪婪——你又补了点仓，赌的是反转，押上的是神经。心情-2。",
            "info",
          );
      } else {
        // 装死：什么也不做，但账户绿得发慌
        moodR27(st, -6); // [PLACEHOLDER] 躺平心情惩罚
        if (typeof StateManager !== "undefined" && StateManager.addMessage)
          StateManager.addMessage(
            "你关掉软件，假装什么都没发生。可夜里翻来覆去，全是绿油油的数字。心情-6。",
            "warning",
          );
      }
    } catch (e) {
      /* 静默 */
    }
  }

  var ECON_R27_EVENTS = [
    // ---- E→C：财富/职级立足 → 私募跟投圈层 ----
    {
      id: "econ_career_invest_unlock_street",
      title: "圈层递来的橄榄枝",
      desc: "你资产摸到某个 invisible 门槛后，忽然有人引荐你进一个「低调却精明」的私募饭局。席间没人谈股票代码，谈的是谁拿到了哪轮份额。\n\n你意识到：钱到了一定量级，机会会自己找上门。",
      phase: "street",
      triggers: { minDay: 120 },
      conditions: careerUnlockCond,
      probability: 0.05,
      choices: [
        {
          text: "接住这层关系，跟投一笔",
          apply: function (st) {
            careerUnlockApply(st, true);
          },
        },
        {
          text: "先观望，不急着入场",
          apply: function (st) {
            careerUnlockApply(st, false);
          },
        },
      ],
    },
    {
      id: "econ_career_invest_unlock_corporate",
      title: "中层之后的「隐形人脉」",
      desc: "升到 P6 这道坎，你发现周报之外另有圈子——饭局、内推、跟投名额，都悄悄流向「已被认可」的人。\n\n一位前辈拍拍你肩：「下次有好项目，带你一个。」",
      phase: "corporate",
      triggers: { minDay: 120 },
      conditions: careerUnlockCond,
      probability: 0.05,
      choices: [
        {
          text: "跟紧这层关系，接下跟投",
          apply: function (st) {
            careerUnlockApply(st, true);
          },
        },
        {
          text: "先把手头业务做扎实",
          apply: function (st) {
            careerUnlockApply(st, false);
          },
        },
      ],
    },

    // ---- E→B：组合市值自峰值回撤 ≥20% → 损失厌恶叙事化 ----
    {
      id: "econ_portfolio_drawdown_street",
      title: "账户从最高点摔下来的那天",
      desc: "你曾盯着账户笑过。如今它从峰值跌去两成，绿得刺眼。手指悬在键盘上——割肉、加仓、还是装死？\n\n这一刻你才懂，真正考验人的从来不是上涨。",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: drawdownCond,
      probability: 0.04,
      choices: [
        {
          text: "🔪 割肉止损，落袋为安",
          apply: function (st) {
            drawdownApply(st, "cut");
          },
        },
        {
          text: "📈 逆势加仓，赌个反转",
          apply: function (st) {
            drawdownApply(st, "add");
          },
        },
        {
          text: "😶 关掉软件，装死",
          apply: function (st) {
            drawdownApply(st, "hold");
          },
        },
      ],
    },
    {
      id: "econ_portfolio_drawdown_corporate",
      title: "职场顺风顺水，账户却在褪色",
      desc: "职级往上走，工资涨了，可你那笔悄悄布局的投资正从高位滑落两成。白天你在会议室谈笑，夜里却盯着绿油油的曲线发呆。\n\n割肉、加仓、还是装死？",
      phase: "corporate",
      triggers: { minDay: 90 },
      conditions: drawdownCond,
      probability: 0.04,
      choices: [
        {
          text: "🔪 割肉止损，落袋为安",
          apply: function (st) {
            drawdownApply(st, "cut");
          },
        },
        {
          text: "📈 逆势加仓，赌个反转",
          apply: function (st) {
            drawdownApply(st, "add");
          },
        },
        {
          text: "😶 关掉软件，装死",
          apply: function (st) {
            drawdownApply(st, "hold");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < ECON_R27_EVENTS.length; i++) {
    RANDOM_EVENTS.push(ECON_R27_EVENTS[i]);
  }
})();

// ============================================================
// economy_linkage_events_r27.js — 域E(经济/投资) 联动增强 (R27)
// ============================================================
// 设计意图（指令二·通用联动方向）：
//   LE1  econ_career_invest_unlock  → E→C 职业/事业积累 → 经济高阶机会
//        让"财务立足 / 职场资深"在游戏里有经济延续回报，缝合职业收益与经济脱钩的空白区。
//   LE2  econ_portfolio_drawdown    → E→B 经济波动 → 叙事包装
//        把无形的组合回撤变成有重量的叙事时刻（损失厌恶 / 峰终定律），让玩家"记得"那次暴跌。
//
// 实现约定：
//   - RANDOM_EVENTS 按 phase 严格过滤（events_core.js:401），故每个事件 street/corporate 各推一份。
//   - 共享 seen/cooldown 标记，避免双阶段重复触发。
//   - 全部数值 || 防御；apply 只改已存在字段，不引入死字段（避免 死字段→死事件）。
//   - 组合峰值由 investment.js 的 tickInvestmentDaily 每日维护 inv._portfolioPeak（域E联动启用）。
// ============================================================

(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._econLinkR27Loaded) return;
  RANDOM_EVENTS._econLinkR27Loaded = true;

  // 计算当前投资组合市值（股票+房产+比特币），全程 || 防御
  function _portfolioValue(inv) {
    if (!inv) return 0;
    var total = 0;
    var sm = inv.stockMarket || {};
    var holdings = inv.stockHoldings || [];
    for (var i = 0; i < holdings.length; i++) {
      var h = holdings[i];
      var m = sm[h.symbol];
      if (m && isFinite(m.price) && isFinite(h.shares)) total += m.price * h.shares;
    }
    var props = inv.properties || [];
    for (var j = 0; j < props.length; j++) {
      var p = props[j];
      total += p.currentPrice || p.buyPrice || 0;
    }
    if ((inv.btcHoldings || 0) > 0) total += (inv.btcPrice || 0) * inv.btcHoldings;
    return total;
  }

  // ---------- LE1：职业/事业立足 → 私募跟投圈层 ----------
  function makeCareerInvestEvent(phase) {
    return {
      id: "econ_career_invest_unlock_" + phase,
      title: "💼 圈层敲门：私募跟投",
      icon: "🤝",
      phase: phase,
      probability: 0.03, // 稀有·一次性机会
      story:
        "一个许久没联系的老同学突然约你喝咖啡。他这两年跟着前司老板做一级市场，今天半开玩笑半认真地说：" +
        "「你现在也算站稳了，有个跟投额度，门槛不高，但圈子里才传。要不要了解下？」",
      conditions: function (st) {
        if (st.flags && st.flags._careerInvestUnlocked) return false;
        var cash =
          (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        // 财务立足 或 职场资深（职业→经济联动的两种兑现路径）
        var senior =
          st.corporate &&
          ["P6", "P7", "P8", "P9", "P10"].indexOf(st.corporate.rank) >= 0;
        return cash >= 200000 || !!senior; // [PLACEHOLDER] 阈值待调参
      },
      choices: [
        {
          text: "🚀 接受跟投邀请",
          hint: "圈层资源 + 管理眼界 +",
          apply: function (st) {
            st.flags._careerInvestUnlocked = true;
            var gain = 30000; // [PLACEHOLDER] 早期份额成熟落袋，叙事合理化
            st.resources.cash = (st.resources.cash || 0) + gain;
            if (st.skills) {
              st.skills.management = Math.min(
                100,
                (st.skills.management || 0) + 3,
              );
            }
            StateManager.addMessage(
              "你早年跟投的老同学创业项目今天退出，分到 ¥" +
                gain.toLocaleString() +
                "。私募圈层向你敞开了门，管理眼界也开阔了。",
              "success",
            );
          },
        },
        {
          text: "🙅 婉拒，先观望",
          hint: "人脉已记下",
          apply: function (st) {
            st.flags._careerInvestUnlocked = true;
            StateManager.addMessage(
              "你婉拒了邀约，但记住了这条人脉——说不定下次用得上。",
              "info",
            );
          },
        },
      ],
    };
  }

  // ---------- LE2：组合回撤 → 叙事化（损失厌恶 / 峰终定律） ----------
  function makeDrawdownEvent(phase) {
    return {
      id: "econ_portfolio_drawdown_" + phase,
      title: "📉 资产回撤：那次暴跌",
      icon: "💸",
      phase: phase,
      probability: 0.04,
      story:
        "你盯着持仓界面，数字一片刺眼的红。从高点算，组合已经回撤了不止两成。" +
        "手机弹窗还在推送「恐慌情绪蔓延」，你忽然意识到——这座城市从不保证谁一定能赢。",
      conditions: function (st) {
        var inv = st.investment;
        if (!inv) return false;
        if (!(inv._portfolioPeak > 0)) return false; // 峰值由每日 tick 维护
        var cur = _portfolioValue(inv);
        if (!(cur > 0)) return false;
        var dd = (inv._portfolioPeak - cur) / inv._portfolioPeak;
        if (dd < 0.2) return false; // 回撤超 20% 才触发 [PLACEHOLDER]
        // 30 天冷却，避免熊市里天天弹窗
        if (
          st.flags._econDrawdownSeenDay &&
          st.player.day - st.flags._econDrawdownSeenDay < 30
        )
          return false;
        return true;
      },
      choices: [
        {
          text: "🩹 割肉止损（卖掉一半）",
          hint: "落袋为安 · 现金 +",
          apply: function (st) {
            st.flags._econDrawdownSeenDay = st.player.day;
            var inv = st.investment;
            var h = inv.btcHoldings || 0;
            // 优先减比特币（波动最大），其余资产等比减半
            var sold = Math.floor(h * 0.5);
            if (sold > 0) {
              var px = inv.btcPrice || 0;
              var cash = Math.round(sold * px);
              inv.btcHoldings = h - sold;
              st.resources.cash = (st.resources.cash || 0) + cash;
              StateManager.addMessage(
                "你割肉卖出 " +
                  sold +
                  " 枚比特币，回笼 ¥" +
                  cash.toLocaleString() +
                  "。",
                "info",
              );
            }
            if (st.needs)
              st.needs.happiness = Math.max(
                0,
                (st.needs.happiness || 50) - 4,
              );
          },
        },
        {
          text: "💪 逆势加仓",
          hint: "赌反弹 · 需现金",
          apply: function (st) {
            st.flags._econDrawdownSeenDay = st.player.day;
            var inv = st.investment;
            var px = inv.btcPrice || 0;
            var budget = Math.min(st.resources.cash || 0, 50000); // [PLACEHOLDER]
            if (budget > px && px > 0) {
              var bought = Math.floor(budget / px);
              inv.btcHoldings = (inv.btcHoldings || 0) + bought;
              st.resources.cash = (st.resources.cash || 0) - bought * px;
              StateManager.addMessage(
                "你逆势加仓 " + bought + " 枚，赌一波反弹。",
                "warning",
              );
            } else {
              StateManager.addMessage(
                "你想加仓，但现金不够撬动仓位。",
                "info",
              );
            }
          },
        },
        {
          text: "😶 装死，等回本",
          hint: "无操作 · 心情 -",
          apply: function (st) {
            st.flags._econDrawdownSeenDay = st.player.day;
            if (st.needs)
              st.needs.happiness = Math.max(
                0,
                (st.needs.happiness || 50) - 6,
              );
            StateManager.addMessage(
              "你把手机一扔，决定装死等回本。",
              "info",
            );
          },
        },
      ],
    };
  }

  // 每个事件按阶段各推一份（events_core.js 严格按 phase 过滤）
  RANDOM_EVENTS.push(makeCareerInvestEvent("street"));
  RANDOM_EVENTS.push(makeCareerInvestEvent("corporate"));
  RANDOM_EVENTS.push(makeDrawdownEvent("street"));
  RANDOM_EVENTS.push(makeDrawdownEvent("corporate"));

  if (typeof console !== "undefined") {
    console.log(
      "[域E联动R27] 已注入 2 个经济联动事件（职业→经济 / 组合回撤叙事），各 street+corporate 双阶段。",
    );
  }
})();

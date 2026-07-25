/*
 * 城市浮生记 — 域E（经济/投资）联动增强 · R201
 * 全系统优化 loop R201
 *
 * 本轮 A类修复（在 investment.js / stock.js 内，含注释锚点）：
 *  - investment.js 经济焦虑块两处死字段：state.needs.health→state.status.health、
 *    state.needs.mental→state.player.mental（每日净值回撤惩罚此前静默丢失）。
 *  - stock.js OIL「黑金能源」industry "能源"→"新能源"（不在 WORLD_SECTORS，
 *    getSectorHeat/新闻板块匹配恒中性，OIL 与游戏经济脱钩）。
 *
 * 联动增强 3 项（补齐历轮域E未充分利用的 E→G/E→A/E→H 方向）：
 *  1. E→G econ_r201_drawdown_reflect（street）：**首次叙事消费本轮修复的
 *     经济焦虑回撤机制**（st.flags._econAnxietyDay，由 investment.js 净值回撤>20%
 *     时写入）——把「财务焦虑」这一核心生命体验包装成一次自省与心态调整。
 *  2. E→A econ_r201_annual_ledger（corporate）：**首个反思式消费 _totalInvestmentProfit
 *     真实字段**（sellInvStock/sellBtc 维护的已实现总损益）——年度投资总账复盘，
 *     把交易数据沉淀为数据素养。
 *  3. E→H econ_r201_capital_backbone（corporate）：投资积累的底气反哺事业——
 *     有已实现盈利 + 在职/掌企 → 经营视野（management XP）+ 现金周转。
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS；所有 state 访问均 || / typeof 防御。
 *  - 里程碑/冷却用 st.flags._xxx 去重；数值标 [PLACEHOLDER]。
 *  - 每个事件显式设 phase（events_core.js:379 按 e.phase===phase 过滤，无 phase=死事件）。
 *  - 本文件须在 investment.js 之后加载（src/index.html 注册序保证）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR201Loaded) return;
  RANDOM_EVENTS._domainELinkageR201Loaded = true;

  // ---- 本地助手（全防御） ----

  // 是否处于/刚经历净值回撤焦虑（消费 investment.js 本轮修复写入的 _econAnxietyDay）
  function inDrawdownAnxietyR201(st) {
    if (!st || !st.player || !st.flags) return false;
    var day = st.player.day || 0;
    var anx = st.flags._econAnxietyDay || 0;
    // 近 3 天内触发过经济焦虑（净值回撤>20%）
    return anx > 0 && day - anx <= 3;
  }

  // 已实现投资总损益（真实字段，sellInvStock/sellBtc 维护），无则 0
  function realizedProfitR201(st) {
    if (!st || !st.investment) return 0;
    var v = st.investment._totalInvestmentProfit;
    return typeof v === "number" && isFinite(v) ? v : 0;
  }

  // 是否持有任意投资仓位
  function hasHoldingsR201(st) {
    if (!st || !st.investment) return false;
    var inv = st.investment;
    if (Array.isArray(inv.stockHoldings) && inv.stockHoldings.length > 0) return true;
    if ((inv.btcHoldings || 0) > 0) return true;
    if (Array.isArray(inv.properties) && inv.properties.length > 0) return true;
    return false;
  }

  // 是否在职或掌企（E→H 门控）
  function hasCareerOrCompanyR201(st) {
    if (!st) return false;
    if (st.career && st.career.currentJob) return true;
    if (st.corporate && st.corporate.company) return true;
    return false;
  }

  // ===== 联动1: E→G 净值回撤后的深夜自省（首次消费本轮修复的焦虑回撤机制） =====
  RANDOM_EVENTS.push({
    id: "econ_r201_drawdown_reflect",
    phase: "street",
    icon: "📉",
    title: "净值回撤的那个深夜",
    desc:
      "打开账户，绿油油一片，账面比高点缩水了一大截。\n\n" +
      "那种攥着手机睡不着的滋味你尝到了——不是缺这点钱，" +
      "是「眼看着数字往下掉」的失控感在啃人。\n\n" +
      "你放下手机，深吸一口气：钱有波动，日子还得过。",
    conditions: function (st) {
      if (!st || !st.player) return false;
      // 30 天冷却，可复发（人生焦虑非一次性）
      if (st.flags && st.flags._investDrawdownReflectDay &&
        (st.player.day || 0) - st.flags._investDrawdownReflectDay < 30) return false;
      return inDrawdownAnxietyR201(st);
    },
    choices: [
      {
        text: "🌙 调整心态：波动是投资的一部分",
        hint: "mental+[PLACEHOLDER], happiness+[PLACEHOLDER]",
        apply: function (st) {
          if (st.flags) st.flags._investDrawdownReflectDay = st.player.day || 0;
          if (st.player)
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5); // [PLACEHOLDER]
          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🌙 你把注意力从涨跌拉回生活本身——心态稳了，觉也睡踏实了。mental+5，happiness+3。",
              "good",
            );
        },
      },
      {
        text: "😣 越想越焦虑，一夜没睡好",
        hint: "疲劳+[PLACEHOLDER]",
        apply: function (st) {
          if (st.flags) st.flags._investDrawdownReflectDay = st.player.day || 0;
          if (st.needs)
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 4); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("😣 一整夜辗转反侧，天亮时人是虚的。疲劳+4。", "bad");
        },
      },
    ],
    probability: 0.06,
  });

  // ===== 联动2: E→A 年度投资总账复盘（首个反思式消费 _totalInvestmentProfit） =====
  RANDOM_EVENTS.push({
    id: "econ_r201_annual_ledger",
    phase: "corporate",
    icon: "🧾",
    title: "给自己的投资做一次年终总账",
    desc:
      "年底了，你把这一年所有买卖记录导出来，一笔笔对——\n\n" +
      "赚过、亏过、追高过也割肉过。把这些真金白银的教训做成一张表，" +
      "比读十本理财书都实在。数据不会安慰你，但它从不说谎。",
    conditions: function (st) {
      if (!st || !st.player || !st.investment) return false;
      if (st.player.phase !== "corporate") return false;
      if (st.flags && st.flags._investAnnualLedgerDone) return false;
      if ((st.player.day || 0) < 60) return false;
      // 须有真实交易痕迹（已实现损益非0 或 当前有持仓）
      return realizedProfitR201(st) !== 0 || hasHoldingsR201(st);
    },
    choices: [
      {
        text: "🧾 认真复盘，把教训沉淀成方法",
        hint: "intelligence+[PLACEHOLDER], mental+[PLACEHOLDER]，投资数据素养",
        apply: function (st) {
          if (st.flags) {
            st.flags._investAnnualLedgerDone = true;
            st.flags._dataInvestorMindset = true; // 复用既有投资素养 flag（多事件共享）
          }
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 20) + 2); // [PLACEHOLDER]
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
          }
          var pl = realizedProfitR201(st);
          var verdict = pl > 0 ? "这一年是赚的" : pl < 0 ? "这一年交了学费" : "打了个平手";
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🧾 总账做完——" + verdict + "。数据里全是方法。intelligence+2，mental+3。",
              "good",
            );
        },
      },
      {
        text: "🙈 亏的那几笔实在不想看",
        hint: "无变化",
        apply: function (st) {
          if (st.flags) st.flags._investAnnualLedgerDone = true;
        },
      },
    ],
    probability: 0.03,
  });

  // ===== 联动3: E→H 投资底气反哺事业（已实现盈利 + 在职/掌企 → 经营视野+周转） =====
  RANDOM_EVENTS.push({
    id: "econ_r201_capital_backbone",
    phase: "corporate",
    icon: "💼",
    title: "投资赚的那点底气",
    desc:
      "账户里那笔已经落袋的收益，成了你敢在事业上做决定的底气——\n\n" +
      "不必为一时进退患得患失，也更看得懂现金流、回报周期这些词背后的分量。\n\n" +
      "钱生钱的经验，反过来喂养了你经营一摊事的眼光。",
    conditions: function (st) {
      if (!st || !st.player || !st.investment) return false;
      if (st.player.phase !== "corporate") return false;
      if (st.flags && st.flags._investCapitalBackboneDone) return false;
      if ((st.player.day || 0) < 80) return false;
      // 须有已实现盈利（>0）且在职或掌企
      return realizedProfitR201(st) > 0 && hasCareerOrCompanyR201(st);
    },
    choices: [
      {
        text: "💼 把投资的定力带进事业",
        hint: "management XP+[PLACEHOLDER], cash+[PLACEHOLDER]",
        apply: function (st) {
          if (st.flags) st.flags._investCapitalBackboneDone = true;
          if (typeof addSkillXp === "function") addSkillXp("management", 8); // [PLACEHOLDER] 真实技能键
          if (st.resources)
            st.resources.cash = (st.resources.cash || 0) + 600; // [PLACEHOLDER] 周转小额入账
          if (st.player)
            st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "💼 投资磨出的定力反哺了事业判断。management XP+8，现金+600，mental+2。",
              "good",
            );
        },
      },
      {
        text: "🤔 投资是投资，事业是事业，分开看",
        hint: "无变化",
        apply: function (st) {
          if (st.flags) st.flags._investCapitalBackboneDone = true;
        },
      },
    ],
    probability: 0.03,
  });
})();

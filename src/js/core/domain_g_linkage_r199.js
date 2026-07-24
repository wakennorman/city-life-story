/*
 * 城市浮生记 — 域G（核心机制/生命周期）联动增强事件 · R199
 * 全系统优化 loop R199 · 联动增强 3项（2 street + 1 corporate）
 *
 * 设计约束：
 *  - IIFE 注入 RANDOM_EVENTS，显式 phase:"street"/"corporate"（events_core:379 按 phase 过滤，无 phase 即死事件）
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]
 *
 * 本轮主题：把 era_transform「时代变迁」核心机制包装成玩家可感知的叙事层，
 *   补齐历轮域G未覆盖的跨域方向 G→B(时代叙事) / G→E(通胀避险) / G→H(经营定力)。
 *   历轮已用 G→B(天气/季节 R169/R192) / G→A / G→C / G→D(R192)，本轮刻意避开。
 *
 * [全系统自洽修复] 域G 修复:_pendingEraEvent 死flag复活 —— era_transform.js:137
 *   在里程碑日(90/180/270/365/450/540/720/900)写入 state._pendingEraEvent，
 *   但全库无任何消费者(仅 :137 写入 / :240 init 置null)，属确证死flag。
 *   本文件事件1 era_r199_reflection 首次消费该flag并在 apply 中清除，形成闭环。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainG_linkage_r199) return;
  RANDOM_EVENTS._domainG_linkage_r199 = true;

  // ---- 本地助手 ----
  function stageNameR199(stageId) {
    var names = {
      initial: "初来乍到的年头",
      growth: "遍地机会的扩张期",
      mature: "趋于稳定的成熟期",
      decline: "增速放缓的调整期",
    };
    return names[stageId] || "变化中的时代";
  }
  function inCorpR199(st) {
    return !!(
      st &&
      ((st.corporate && st.corporate.company) ||
        (st.career && st.career.currentJob))
    );
  }

  // ====== 联动1: G→B 时代变迁回望（消费死flag _pendingEraEvent，加叙事层） ======
  // [联动意图] era_transform 里程碑机制此前只有数值调度、无玩家可感知的情感回望；
  //   本事件读取 _pendingEraEvent（里程碑日写入）→ 给玩家一段时代变迁的驻足反思，
  //   并在 apply 清除该flag，让原本静默写入的死flag首次拥有真实消费者。
  RANDOM_EVENTS.push({
    id: "era_r199_reflection",
    phase: "street",
    icon: "🏙️",
    title: "站在时代的节点上",
    story: function (st) {
      var pending = st && st._pendingEraEvent;
      var stageId = pending && pending.stage ? pending.stage : (st && st._eraState ? st._eraState.stageId : "initial");
      var d = pending && pending.triggerDay ? pending.triggerDay : (st && st.player ? st.player.day : 0);
      return (
        "不知不觉，你在这座城市已经走过了第 " + d + " 天。\n\n" +
        "街角的店铺换了招牌，熟悉的路口修起了高架。这是一个" + stageNameR199(stageId) + "——" +
        "物价、机会、人心都在悄悄改变，而你也不再是刚来时的那个自己。\n\n" +
        "你停下脚步，回望这一路。"
      );
    },
    conditions: function (st) {
      // 仅当里程碑日写入的 _pendingEraEvent 尚未被消费时触发（消费后 apply 置 null）
      return !!(
        st &&
        st.player &&
        st._pendingEraEvent &&
        typeof st._pendingEraEvent === "object"
      );
    },
    probability: 0.5, // [PLACEHOLDER] 里程碑窗口内高概率触发，确保叙事不错过
    repeatable: true, // 每个里程碑日都会写入新的 _pendingEraEvent，故可重复（靠 flag 消费去重）
    choices: [
      {
        text: "🌇 感慨万千，但脚步更坚定了",
        hint: "心智+[PLACEHOLDER] · 心情+[PLACEHOLDER]",
        apply: function (st) {
          // [全系统自洽修复] 域G 修复:消费并清除死flag _pendingEraEvent
          st._pendingEraEvent = null;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6); // [PLACEHOLDER]
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4); // [PLACEHOLDER]
          if (!st.flags) st.flags = {};
          st.flags._eraReflectionCount = (st.flags._eraReflectionCount || 0) + 1;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🏙️ 时代在变，你也在变。这份对变化的清醒，是这座城市给你的礼物。心智+6，心情+4。",
              "success"
            );
        },
      },
      {
        text: "🚶 时代太大，我只管过好眼前",
        hint: "心情+[PLACEHOLDER]",
        apply: function (st) {
          // [全系统自洽修复] 域G 修复:两个选项都必须清除死flag，避免重复触发
          st._pendingEraEvent = null;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🚶 宏大的叙事与你无关，你只想把今天的日子过踏实。这也是一种智慧。心情+2。",
              "info"
            );
        },
      },
    ],
  });

  // ====== 联动2: G→E 通胀时代的避险觉醒 ======
  // [联动意图] _eraState.inflationIndex（era_transform 每日维护的真实字段）此前只被
  //   经济结算读取、从未转化为玩家的「理财意识」；当通胀显著(≥[PLACEHOLDER])时，
  //   玩家意识到现金在贬值 → 置 _dataInvestorMindset 投资意识（历轮跨域共用flag）。
  RANDOM_EVENTS.push({
    id: "era_r199_inflation_hedge",
    phase: "street",
    icon: "📈",
    title: "钱不经花了",
    story: function (st) {
      var idx = st && st._eraState && typeof st._eraState.inflationIndex === "number"
        ? st._eraState.inflationIndex
        : 1.0;
      return (
        "你翻着记账本，发现同样一顿饭、同样一趟车，花的钱比一年前多了不少。" +
        "物价指数悄悄爬到了 " + idx.toFixed(2) + "。\n\n" +
        "把钱压在枕头底下，它正一天天变薄。或许，是时候想想怎么让钱不再只是躺着。"
      );
    },
    conditions: function (st) {
      var idx = st && st._eraState && typeof st._eraState.inflationIndex === "number"
        ? st._eraState.inflationIndex
        : 0;
      return !!(
        st &&
        st.player &&
        st.player.day >= 120 && // [PLACEHOLDER]
        idx >= 1.3 && // [PLACEHOLDER] 通胀显著阈值（与 cross_system part6 一致）
        (!st.flags || !st.flags._eraInflationHedgeSeen)
      );
    },
    probability: 0.05, // [PLACEHOLDER]
    repeatable: false,
    choices: [
      {
        text: "💡 学着让钱生钱，别让通胀吃掉积蓄",
        hint: "投资意识觉醒 · 心智+[PLACEHOLDER]",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._eraInflationHedgeSeen = true;
          st.flags._dataInvestorMindset = true; // 跨域共用：解锁/强化理财意识（G→E）
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "📈 你第一次认真思考「资产」这件事。通胀是最沉默的税，而你决定不再坐以待毙。心智+4。",
              "success"
            );
        },
      },
      {
        text: "😌 省着点花就是了",
        hint: "心情+[PLACEHOLDER]",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._eraInflationHedgeSeen = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "😌 开源不易，那就节流。你把开支又收紧了一圈——朴素，但踏实。心情+2。",
              "info"
            );
        },
      },
    ],
  });

  // ====== 联动3: G→H 久历时代变迁的经营定力（corporate） ======
  // [联动意图] 在城市里熬过时代阶段更替(非 initial)且已步入职场/经营的玩家，
  //   把「见过周期」的阅历沉淀为经营管理能力 → addSkillXp("management") + 现金奖励。
  RANDOM_EVENTS.push({
    id: "era_r199_veteran_poise",
    phase: "corporate",
    icon: "🧭",
    title: "见过周期的人",
    story: function (st) {
      var stageId = st && st._eraState ? st._eraState.stageId : "growth";
      return (
        "从" + stageNameR199("initial") + "一路走到" + stageNameR199(stageId) + "，" +
        "你亲历了这座城市的起落。别人还在为一时的涨跌慌乱，而你已经学会了在周期里保持定力。\n\n" +
        "这份阅历，正在变成你经营上的底气。"
      );
    },
    conditions: function (st) {
      var stageId = st && st._eraState ? st._eraState.stageId : "initial";
      return !!(
        st &&
        st.player &&
        st.player.day >= 300 && // [PLACEHOLDER]
        st._eraState &&
        stageId !== "initial" &&
        inCorpR199(st) &&
        (!st.flags || !st.flags._eraVeteranPoiseSeen)
      );
    },
    probability: 0.04, // [PLACEHOLDER]
    repeatable: false,
    choices: [
      {
        text: "🧭 把阅历写进决策里",
        hint: "管理经验+[PLACEHOLDER] · 现金+[PLACEHOLDER]",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._eraVeteranPoiseSeen = true;
          if (typeof addSkillXp === "function") addSkillXp("management", 8); // [PLACEHOLDER] 真实技能键
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 800; // [PLACEHOLDER]
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🧭 你在会议上从容地道出对周期的判断，同事和上级都对你刮目相看。管理经验提升，还拿到一笔额外回报。",
              "success"
            );
        },
      },
      {
        text: "🤐 阅历放心里，闷声做事",
        hint: "心智+[PLACEHOLDER]",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._eraVeteranPoiseSeen = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🤐 你不动声色，只把判断藏在心底，用行动说话。沉稳，是老手的底色。心智+4。",
              "info"
            );
        },
      },
    ],
  });
})();

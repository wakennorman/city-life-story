/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强事件 · 第二轮
 * v3.113 · loop R22 全系统优化·Domain A 数值平衡→跨域桥接（R14 之后补充新角度）
 *
 * 设计约束（与 R14 data_linkage_events.js 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 以覆盖两种人生阶段。
 *  - 里程碑类事件用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 *  - 本文件事件 id 统一前缀 data2_*，与 R14 的 data_* 不冲突。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._dataLinkageR22Loaded) return;
  RANDOM_EVENTS._dataLinkageR22Loaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表
  function getMetNpcsR22(st, minAff) {
    minAff = minAff || 0;
    var out = [];
    if (!st || !st.relationships) return out;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff)
        out.push({ id: id, rel: r });
    }
    return out;
  }

  // 取好感最高的已结识 NPC
  function pickClosestMetNpcR22(st, minAff) {
    var met = getMetNpcsR22(st, minAff || 0);
    if (!met.length) return null;
    met.sort(function (a, b) {
      return (b.rel.affinity || 0) - (a.rel.affinity || 0);
    });
    return met[0];
  }

  // 安全改好感：优先全局 applyAffinityChange（自动 clamp + 记 _lastInteractionDay），否则兜底直写
  function safeAffinityR22(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域A联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 取等级最高的技能 key（用于 A→C 复盘加成落到真实技能上）
  function topSkillKeyR22(st) {
    if (!st || !st.skills) return null;
    var best = null,
      bestLv = 0;
    for (var k in st.skills) {
      if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
      var lv = (st.skills[k] && st.skills[k].level) || 0;
      if (lv > bestLv) {
        bestLv = lv;
        best = k;
      }
    }
    return best;
  }

  // ============ 事件定义 ============

  // ===== A→D：现金缓冲纪律 ↔ 社交底气（轻量聚会） =====
  RANDOM_EVENTS.push({
    id: "data2_lean_budget",
    title: "账面上的余裕，让你敢约人",
    desc: "连续几周，你的现金与存款都留出了安全垫。这种'算得清'的踏实，让你第一次愿意主动张罗一场小聚。",
    phase: "street",
    triggers: { minDay: 60 },
    conditions: function (st) {
      if (!st || !st.resources) return false;
      if (st.flags && st.flags._data2LeanBudgetDone) return false;
      // [PLACEHOLDER] 现金/存款安全垫阈值
      if ((st.resources.cash || 0) < 1000) return false;
      if ((st.resources.bankBalance || 0) < 3000) return false;
      if (!getMetNpcsR22(st, 10).length) return false;
      return true;
    },
    choices: [
      {
        text: "张罗一场小聚，把余裕分享出去",
        apply: function (st) {
          var npc = pickClosestMetNpcR22(st, 10);
          if (npc) safeAffinityR22(st, npc.id, 5, "账面余裕带来的底气");
          if (st.player) st.player.mental = (st.player.mental || 50) + 2;
          if (st.flags) st.flags._data2LeanBudgetDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "算得清的账目，让你在朋友面前更从容。",
              "good",
            );
        },
      },
      {
        text: "自己享受这份踏实",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 2;
          if (st.flags) st.flags._data2LeanBudgetDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== A→C：技能账本复盘 ↔ 职业精进（落到真实技能） =====
  RANDOM_EVENTS.push({
    id: "data2_skill_ledger",
    title: "你的技能账本露出规律",
    desc: "一份持续记录的技能账本显示，你在某一项上的投入已经形成清晰曲线。你决定把这种'复盘习惯'固化下来。",
    phase: "street",
    triggers: { minDay: 30 },
    conditions: function (st) {
      if (!st || !st.player || !st.skills) return false;
      if (st.flags && st.flags._data2SkillLedgerDone) return false;
      // [PLACEHOLDER] 触发所需的技能熟练门槛
      var top = 0;
      for (var k in st.skills) {
        if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
        var lv = (st.skills[k] && st.skills[k].level) || 0;
        if (lv > top) top = lv;
      }
      if (top < 20) return false;
      return true;
    },
    choices: [
      {
        text: "把复盘变成习惯，精进最拿手的那项",
        apply: function (st) {
          var key = topSkillKeyR22(st);
          if (key && typeof addSkillXp === "function") {
            addSkillXp(key, 6); // [PLACEHOLDER] 复盘加成
          }
          if (st.player) st.player.mental = (st.player.mental || 50) + 4;
          if (st.flags) st.flags._data2SkillLedgerDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "持续的数据复盘，让专长增长更有方向感。",
              "good",
            );
        },
      },
      {
        text: "只是看了看，没多想",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._data2SkillLedgerDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== A→E：资本储备纪律 ↔ 投资本金（职场阶段） =====
  RANDOM_EVENTS.push({
    id: "data2_capital_reserve",
    title: "一次干脆的财务复盘",
    desc: "在职场打拼之余，你给自己做了一次彻底的账务复盘：现金、存款、负债一目了然。你腾出了一笔可以长期不动的本金。",
    phase: "corporate",
    triggers: { minDay: 120 },
    conditions: function (st) {
      if (!st || !st.player || st.player.phase !== "corporate") return false;
      if (!st.resources) return false;
      if (st.flags && st.flags._data2CapitalReserveDone) return false;
      // [PLACEHOLDER] 触发所需的存款/现金储备阈值
      if ((st.resources.bankBalance || 0) < 5000) return false;
      if ((st.resources.cash || 0) < 2000) return false;
      return true;
    },
    choices: [
      {
        text: "把腾出的本金划入长期投资账户",
        apply: function (st) {
          if (st.resources)
            st.resources.bankBalance = (st.resources.bankBalance || 0) + 1500; // [PLACEHOLDER] 腾出本金
          if (st.flags) st.flags._dataInvestorMindset = true; // 复用跨轮投资者心态标记
          if (st.player) st.player.mental = (st.player.mental || 50) + 3;
          if (st.flags) st.flags._data2CapitalReserveDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "纪律性的财务复盘，让你有了第一笔长期本金。",
              "good",
            );
        },
      },
      {
        text: "维持现状，先不挪动",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 2;
          if (st.flags) st.flags._data2CapitalReserveDone = true;
        },
      },
    ],
    probability: 0.05,
  });
})();

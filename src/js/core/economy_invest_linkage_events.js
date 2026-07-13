/*
 * 城市浮生记 — 域E（经济/投资）联动增强事件
 * v3.108 · loop R18 全系统优化·Domain E 经济/投资→跨域桥接
 *
 * 设计约束（与 R11 economy / R12 lifecycle / R13 company / R14 data / R16 career / R17 域D 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 覆盖两种人生阶段。
 *  - E→D 社交桥接严格遵守域D架构铁律：只读 state.relationships；引用 NPC 须 rel && rel.met；
 *    跨 NPC 好感传导一律走 applyAffinityChange（自动 clamp + 记 _lastInteractionDay + 升级播报）。
 *  - 经济桥接复用 R14 的投资者心态 flag `st.flags._dataInvestorMindset`（数据/经济域共享），
 *    以及真实的 `state.investment` 容器（stockHoldings / stockMarket 均属实字段）。
 *  - 里程碑/冷却用 st.flags._xxxCooldown 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._econInvestLinkageLoaded) return;
  RANDOM_EVENTS._econInvestLinkageLoaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 是否已踏入投资门槛（持有一个以上投资标的）——作为经济域联动的触发闸门
  function isInvestorE(st) {
    if (!st || !st.investment) return false;
    var h = st.investment.stockHoldings;
    return Array.isArray(h) && h.length >= 1;
  }

  // 取已结识且好感达阈值的 NPC 列表（域D铁律：须 rel && rel.met）
  function getMetNpcsE(st, minAff) {
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

  // 安全改好感：优先全局 applyAffinityChange，否则兜底直写（域D铁律）
  function safeAffinityE(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域E联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // ---- 域E 联动事件 ----

  var ECON_EVENTS = [
    // ===== E→A：投资里程碑 ↔ 数值/心智（状态刷新 + 投资者心态） =====
    {
      id: "invest_milestone_mindset",
      title: "账户里第一次有了「钱生钱」的底气",
      desc: "某天你点开投资账户，发现那笔被你忘记的持仓竟悄悄涨了一截。不是大钱，但那种「钱在替你干活」的感觉，让紧绷的肩背松了一点。",
      phase: "street",
      triggers: { minDay: 80 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._investMilestoneCooldown) return false;
        if (!isInvestorE(st)) return false; // 须已持有一个以上投资标的
        return true;
      },
      choices: [
        {
          text: "把这份踏实感记在心里，继续稳健",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 5; // [PLACEHOLDER] 心智回馈
            if (st.needs)
              st.needs.happiness = (st.needs.happiness || 50) + 4; // [PLACEHOLDER] 心情
            if (st.flags) {
              st.flags._investMilestoneCooldown = true;
              st.flags._dataInvestorMindset = true; // 复用 R14 data_savings_milestone 投资者心态 flag
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "财务上的第一份「余裕」，悄悄改善了你的状态。",
                "good",
              );
          },
        },
        {
          text: "乐呵一下，该干嘛干嘛",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._investMilestoneCooldown = true;
          },
        },
      ],
      probability: 0.05,
    },

    // ===== E→C：盘感 ↔ 职业/成长（金融洞察转化为职场硬技能） =====
    {
      id: "invest_acumen_career",
      title: "看盘练出的那点「数字直觉」",
      desc: "盯了许久行情，你渐渐能嗅出报表里的门道。某次部门例会，你随口点出的成本异常，让主管高看了一眼——原来投资练出的盘感，也能用在班上。",
      phase: "street",
      triggers: { minDay: 100 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._investAcumenCooldown) return false;
        if (!isInvestorE(st)) return false;
        return true;
      },
      choices: [
        {
          text: "把这份洞察沉淀成能力",
          apply: function (st) {
            // C域桥接：金融盘感转化为会计/财务技能（accounting 为职业体系真实技能键）
            if (typeof addSkillXp === "function") addSkillXp("accounting", 8); // [PLACEHOLDER] 财务技能XP
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.flags) st.flags._investAcumenCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "投资练出的数字直觉，成了职场上实打实的加分项。",
                "good",
              );
          },
        },
        {
          text: "只是运气好，别当真",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._investAcumenCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== E→D：落袋为安后请朋友一顿 ↔ NPC/社交（经济反哺人情） =====
    {
      id: "invest_treat_friend",
      title: "一笔小赚，想请那个总帮你的朋友吃顿饭",
      desc: "账户里那笔收益落袋，你下意识想起一直照应你的朋友。赚钱的快乐若没人分享，好像也就那样——不如趁热请一顿，把好事说开。",
      phase: "corporate",
      triggers: { minDay: 120 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._investTreatCooldown) return false;
        if (!isInvestorE(st)) return false;
        // 至少一个"聊得来的圈内人"(好感≥25)的已结识 NPC
        if (!getMetNpcsE(st, 25).length) return false;
        return true;
      },
      choices: [
        {
          text: "大方请客，好好谢谢你朋友",
          apply: function (st) {
            // D域桥接：经济宽裕反哺人情（域D铁律：跨NPC好感走 applyAffinityChange）
            var npc = getMetNpcsE(st, 25)[0];
            if (npc) safeAffinityE(st, npc.id, 6, "投资小赚·请客致谢");
            // 请客花销从现金扣除（真实字段 state.resources.cash）
            if (st.resources)
              st.resources.cash = Math.max(
                0,
                (st.resources.cash || 0) - 800, // [PLACEHOLDER] 一顿饭的成本
              );
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.needs)
              st.needs.happiness = (st.needs.happiness || 50) + 3;
            if (st.flags) st.flags._investTreatCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "钱赚到了，情谊也更近了一步。",
                "good",
              );
          },
        },
        {
          text: "心里记着，下次再谢",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._investTreatCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < ECON_EVENTS.length; i++) {
    RANDOM_EVENTS.push(ECON_EVENTS[i]);
  }
})();

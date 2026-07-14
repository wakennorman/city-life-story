/*
 * 城市浮生记 — 域G（核心机制/生命周期）联动增强事件
 * v3.111 · loop R20 全系统优化·Domain G 核心机制/生命周期 → 跨域桥接
 *
 * 设计约束（与 R11 economy / R12 lifecycle / R13 company / R14 data / R16 career /
 *           R17 npc_social / R18 economy_invest / R19 ui 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 覆盖两种人生阶段。
 *  - 社交桥接严格遵守域D架构铁律：只读 state.relationships；引用 NPC 须 rel && rel.met；
 *    跨 NPC 好感传导一律走 applyAffinityChange（自动 clamp + 记 _lastInteractionDay + 升级播报）。
 *  - 里程碑/冷却用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 *  - 域D 仅做跨域桥接，不新建平行 NPC 系统、不依赖 npcs.js 中仍处 TODO 的 xiaoli/auntie_lin/master_zhao，
 *    一律用通用 state.relationships 遍历。
 *  - 主题：核心生存机制/生命周期里的「习惯地基、人生体悟、掌舵定力」反哺到数值(A)、社交(D)、职业(C)。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._coreMechanicsLinkageLoaded) return;
  RANDOM_EVENTS._coreMechanicsLinkageLoaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表（域D铁律：须 rel && rel.met）
  function getMetNpcsG(st, minAff) {
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

  // 安全改好感：优先全局 applyAffinityChange，否则兜底直写（域D铁律：跨NPC传导走 applyAffinityChange）
  function safeAffinityG(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域G联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // ---- 域G 联动事件 ----

  var CORE_EVENTS = [
    // ===== G→A：把日子过出地基 ↔ 数值/心智（习惯回馈属性） =====
    {
      id: "core_habit_foundation",
      title: "把日子过出了地基",
      desc: "撑过最难的那段日子后，你慢慢摸到了一套自己的节奏：几点睡、怎么吃、钱往哪儿花。再慌的事，落到这套节奏里，也变得没那么可怕了。",
      phase: "street",
      triggers: { minDay: 50 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._coreHabitFoundationCooldown) return false;
        // 至少撑过一段时间、且基础需求不崩
        if (
          st.needs &&
          typeof st.needs.hygiene === "number" &&
          st.needs.hygiene < 20
        )
          return false;
        return true;
      },
      choices: [
        {
          text: "把这套节奏坚持下来",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 5; // [PLACEHOLDER] 心智回馈
            if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 4; // [PLACEHOLDER] 心情
            if (st.flags) st.flags._coreHabitFoundationCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "有了节奏感，连意外都显得没那么狰狞了。",
                "good",
              );
          },
        },
        {
          text: "顺其自然，不强求",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._coreHabitFoundationCooldown = true;
          },
        },
      ],
      probability: 0.05,
    },

    // ===== G→D：把人生体悟讲给信得过的人 ↔ NPC/社交（体悟转化为好感） =====
    {
      id: "core_wisdom_share",
      title: "一次深夜的长谈",
      desc: "你把一个自己摔过跟头才懂的道理，说给了圈子里一个正卡在同样处境的人听。对方沉默了很久，说：没想到你看得这么透。",
      phase: "street",
      triggers: { minDay: 80 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._coreWisdomShareCooldown) return false;
        // 至少一个"信得过"(好感≥30)的已结识 NPC
        if (!getMetNpcsG(st, 30).length) return false;
        return true;
      },
      choices: [
        {
          text: "多陪他聊会儿",
          apply: function (st) {
            // D域桥接：人生体悟转化为社交好感（守域D铁律：rel.met + applyAffinityChange）
            var npc = getMetNpcsG(st, 30)[0];
            if (npc) safeAffinityG(st, npc.id, 6, "人生体悟·彼此托底"); // [PLACEHOLDER] 好感增量
            if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 3;
            if (st.flags) st.flags._coreWisdomShareCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "把摔过的跟头讲成灯，照亮的就不止自己。",
                "good",
              );
          },
        },
        {
          text: "点到为止，不深聊",
          apply: function (st) {
            if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 1;
            if (st.flags) st.flags._coreWisdomShareCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== G→C：掌舵的定力 ↔ 职业/成长（生命周期沉淀为管理力） =====
    {
      id: "core_exec_resilience",
      title: "在风浪里掌住了舵",
      desc: "公司又一轮动荡，好几位同龄人被调到边缘。你想起刚进城时连房租都凑不齐的日子，反倒比谁都稳。会上你那几句不慌不忙的判断，被总监记在了心里。",
      phase: "corporate",
      triggers: { minDay: 140 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._coreExecResilienceCooldown) return false;
        return true;
      },
      choices: [
        {
          text: "把这份定力沉淀成方法论",
          apply: function (st) {
            // C域桥接：生命周期里的掌舵定力转化为真实管理技能
            if (typeof addSkillXp === "function") addSkillXp("management", 8); // [PLACEHOLDER] 管理XP
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 2;
            if (st.flags) st.flags._coreExecResilienceCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "见过的风浪，最后都成了你站稳的锚。",
                "good",
              );
          },
        },
        {
          text: "稳住就好，不多想",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._coreExecResilienceCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < CORE_EVENTS.length; i++) {
    RANDOM_EVENTS.push(CORE_EVENTS[i]);
  }
})();

/*
 * 城市浮生记 — 域F（UI/UX）联动增强事件
 * v3.110 · loop R19 全系统优化·Domain F 界面/体验 → 跨域桥接
 *
 * 设计约束（与 R11 economy / R12 lifecycle / R13 company / R14 data / R16 career /
 *           R17 npc_social / R18 economy_invest 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 覆盖两种人生阶段。
 *  - 社交桥接严格遵守域D架构铁律：只读 state.relationships；引用 NPC 须 rel && rel.met；
 *    跨 NPC 好感传导一律走 applyAffinityChange（自动 clamp + 记 _lastInteractionDay + 升级播报）。
 *  - 里程碑/冷却用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 *  - 域D 仅做跨域桥接，不新建平行 NPC 系统、不依赖 npcs.js 中仍处 TODO 的 xiaoli/auntie_lin/master_zhao，
 *    一律用通用 state.relationships 遍历。
 *  - 主题：界面/体验层面的「清晰感、呈现力、社交形象」反哺到数值(A)、职业(C)、社交(D)。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._uiLinkageLoaded) return;
  RANDOM_EVENTS._uiLinkageLoaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表（域D铁律：须 rel && rel.met）
  function getMetNpcsF(st, minAff) {
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
  function safeAffinityF(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域F联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // ---- 域F 联动事件 ----

  var UI_EVENTS = [
    // ===== F→A：把生活理出清晰感 ↔ 数值/心智（状态回馈） =====
    {
      id: "ui_daily_clarity",
      title: "把生活理出的一点清晰感",
      desc: "你花了一个晚上，把每天要做的事、要还的账、要顾的人，分门别类排进了清单。第二天醒来，脑子里那团乱麻好像松了扣。",
      phase: "street",
      triggers: { minDay: 40 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._uiDailyClarityCooldown) return false;
        return true;
      },
      choices: [
        {
          text: "保持这个节奏",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 5; // [PLACEHOLDER] 心智回馈
            if (st.needs)
              st.needs.happiness = (st.needs.happiness || 50) + 4; // [PLACEHOLDER] 心情
            if (st.flags) st.flags._uiDailyClarityCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "井井有条的早晨，让一整天的紧绷都轻了几分。",
                "good",
              );
          },
        },
        {
          text: "列完就丢一边",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._uiDailyClarityCooldown = true;
          },
        },
      ],
      probability: 0.05,
    },

    // ===== F→D：把社交形象打理得更得体 ↔ NPC/社交（形象资本转化为好感） =====
    {
      id: "ui_social_presence",
      title: "被人记住的，是一个得体的你",
      desc: "群里有人发起聚会，你特意把头像、签名和常说的几句话都收拾了一遍。后来才听说，就是这点讲究，让好几位圈内人对你印象好了不少。",
      phase: "street",
      triggers: { minDay: 70 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._uiSocialPresenceCooldown) return false;
        // 至少一个"信得过"(好感≥30)的已结识 NPC
        if (!getMetNpcsF(st, 30).length) return false;
        return true;
      },
      choices: [
        {
          text: "顺势多在同好圈露个脸",
          apply: function (st) {
            // D域桥接：形象经营转化为社交好感（守域D铁律：rel.met + applyAffinityChange）
            var npc = getMetNpcsF(st, 30)[0];
            if (npc) safeAffinityF(st, npc.id, 5, "形象得体·圈内好感"); // [PLACEHOLDER] 好感增量
            if (st.needs)
              st.needs.happiness = (st.needs.happiness || 50) + 3;
            if (st.flags) st.flags._uiSocialPresenceCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "得体的分寸感，让关系里的信任又厚了一层。",
                "good",
              );
          },
        },
        {
          text: "虚一下就够了，不勉强",
          apply: function (st) {
            if (st.needs)
              st.needs.happiness = (st.needs.happiness || 50) + 1;
            if (st.flags) st.flags._uiSocialPresenceCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== F→C：把成果讲清楚 ↔ 职业/成长（呈现力转化为职场技能） =====
    {
      id: "ui_career_portfolio",
      title: "一次被领导记住的汇报",
      desc: "项目组要你讲清楚这半年的成果。你没堆术语，而是用一张清爽的图把来龙去脉说透了。散会后，好几位前辈私下说：这小子，表达比以前利落多了。",
      phase: "corporate",
      triggers: { minDay: 120 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._uiCareerPortfolioCooldown) return false;
        return true;
      },
      choices: [
        {
          text: "把这套呈现方式沉淀下来",
          apply: function (st) {
            // C域桥接：清晰表达转化为真实职业技能（coding 为职场通用门槛技能，语义一致）
            if (typeof addSkillXp === "function") addSkillXp("coding", 8); // [PLACEHOLDER] 表达/技能XP
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.needs)
              st.needs.happiness = (st.needs.happiness || 50) + 2;
            if (st.flags) st.flags._uiCareerPortfolioCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "把复杂的事讲清楚，本身就是一种稀缺的本事。",
                "good",
              );
          },
        },
        {
          text: "讲完拉倒，下不为例",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._uiCareerPortfolioCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < UI_EVENTS.length; i++) {
    RANDOM_EVENTS.push(UI_EVENTS[i]);
  }
})();

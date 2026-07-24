/*
 * 城市浮生记 — 域C（职业/成长）联动增强事件 · 第二轮（R196）
 * loop R196 全系统优化·Domain C 职业/成长 → 跨域桥接（C→B / C→F / C→H）
 *
 * 背景：域C 已在 R16/R191 覆盖 C→D/C→A/C→E/C→G（career_linkage_events.js / domain_c_linkage_r191.js）。
 * 本轮补齐尚未覆盖的跨域视角：C→B（手艺成街坊美谈·叙事）、C→F（执业沉淀成清晰作品集·UI清晰感）、
 * C→H（职场专业被公司/创业看重·经营资本）。id 前缀 c196_ 与 R16 career_ 及 R191 skill_r191_ 既有前缀不冲突。
 *
 * 设计约束（与 R16/R191 各域 linkage 一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），故显式设 phase（2 street + 1 corporate）。
 *  - 社交桥接严守域D铁律：只读 state.relationships；引用 NPC 须 rel && rel.met；跨 NPC 好感走 applyAffinityChange。
 *  - 里程碑/冷却用 st.flags._xxxCooldown 去重（conditions 与 apply 双重拦截）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR196Loaded) return;
  RANDOM_EVENTS._domainCLinkageR196Loaded = true;

  // 取已结识且好感达阈值的 NPC（域D铁律：须 rel && rel.met）
  function getMetNpcsC196(st, minAff) {
    minAff = minAff || 0;
    var out = [];
    if (!st || !st.relationships) return out;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) out.push({ id: id, rel: r });
    }
    return out;
  }

  // 安全改好感：优先 applyAffinityChange，否则兜底直写（域D铁律）
  function safeAffinityC196(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域C联动R196");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId]) st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity = (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  var C_EVENTS_R196 = [
    // ===== C→B：手艺被街坊传为美谈 ↔ 事件/叙事（职业声望化为名望记忆） =====
    {
      id: "c196_craft_mastery_tale",
      title: "你的手艺，成了街坊嘴里的美谈",
      desc: "你咬牙磨了好几年的那门手艺，不知从哪天起成了附近人茶余饭后的谈资——「就是那个谁，东西做得真地道」。后来连隔壁街区都有人专门找上门。",
      phase: "street",
      triggers: { minDay: 80 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._c196CraftTaleCooldown) return false;
        // 须有真实职业技能沉淀（coding/repair/welding/cooking 等真实键）
        var hasSkill = false;
        if (st.skills) {
          for (var k in st.skills) {
            if (Object.prototype.hasOwnProperty.call(st.skills, k) && (st.skills[k] || 0) >= 25) {
              hasSkill = true; break;
            }
          }
        }
        return hasSkill;
      },
      choices: [
        {
          text: "把这门手艺继续磨下去",
          apply: function (st) {
            // B域桥接：职业声望化为真实名望（state.player.fame 是真实字段）
            if (st.player) st.player.fame = (st.player.fame || 0) + 4; // [PLACEHOLDER] 名望回馈
            if (st.flags) {
              st.flags._careerTaleSeen = true; // 叙事记忆 flag（B域事件可消费）
              st.flags._c196CraftTaleCooldown = true;
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "被人念叨的手艺，比奖状更让人踏实。",
                "good",
              );
          },
        },
        {
          text: "听过就算了",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._c196CraftTaleCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== C→F：执业沉淀成清晰作品集 ↔ 界面/体验（职业秩序感反哺心智+心情） =====
    {
      id: "c196_portfolio_clarity",
      title: "把执业沉淀成一份说得清的作品集",
      desc: "你把散落各处的项目、证书、客户评价，归置成一份清爽的看板。某天翻开，发现几年的成长竟一目了然——那种「没白干」的踏实感，比升职信还顶用。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._c196PortfolioClarityCooldown) return false;
        return true;
      },
      choices: [
        {
          text: "定期更新这份看板",
          apply: function (st) {
            // F域桥接：职业沉淀的清晰感反哺核心生存属性（mental 在 player，happiness 在 needs，均为真实字段）
            if (st.player) st.player.mental = (st.player.mental || 50) + 5; // [PLACEHOLDER] 心智
            if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 4; // [PLACEHOLDER] 心情
            if (st.flags) st.flags._c196PortfolioClarityCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "看得清来路，才走得稳前路。",
                "good",
              );
          },
        },
        {
          text: "做一次就丢一边",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._c196PortfolioClarityCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== C→H：职场专业被公司/创业看重 ↔ 公司/创业（专业资本转化为经营技能+现金） =====
    {
      id: "c196_corporate_mentor_value",
      title: "前辈点名：这活儿，你来带新人",
      desc: "部门里有个新项目要带人，主管没绕弯子，直接点你：『你那套干法，新人得学。』你硬着头皮开了几场内训，没想到反响比预期好——连老板都来听了半场。",
      phase: "corporate",
      triggers: { minDay: 120 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._c196CorpMentorCooldown) return false;
        // 须处于公司/职场语境（真实字段）
        var hasJob =
          (st.career && st.career.currentJob) ||
          (st.corporate && st.corporate.company);
        if (!hasJob) return false;
        return true;
      },
      choices: [
        {
          text: "把经验梳理成方法论",
          apply: function (st) {
            // H域桥接：职业专业资本转化为真实经营/管理技能（management 为公司 KPI 真实技能键）
            if (typeof addSkillXp === "function") addSkillXp("management", 8); // [PLACEHOLDER] 管理/经营XP
            // 内训补贴落袋（state.resources.cash 真实）
            if (st.resources && typeof st.resources.cash === "number") {
              st.resources.cash += 800; // [PLACEHOLDER] 内训补贴
            } else if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + 800; // [PLACEHOLDER]
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 2;
            if (st.flags) st.flags._c196CorpMentorCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "能教别人的本事，才是真本事。",
                "good",
              );
          },
        },
        {
          text: "带完就完，不折腾",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._c196CorpMentorCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < C_EVENTS_R196.length; i++) {
    RANDOM_EVENTS.push(C_EVENTS_R196[i]);
  }
})();

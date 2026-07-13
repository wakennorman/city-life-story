/*
 * 城市浮生记 — 域H（Phase2/公司）联动增强事件（R21 第二轮）
 * v3.112 · loop R21 全系统优化·Domain H 创业/公司 → 跨域桥接
 *
 * 设计约束（与 R11~R20 各域 linkage 文件一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 覆盖两种人生阶段。
 *  - 社交桥接严格遵守域D架构铁律：只读 state.relationships；引用 NPC 须 rel && rel.met；
 *    跨 NPC 好感传导一律走 applyAffinityChange（自动 clamp + 记 _lastInteractionDay + 升级播报）。
 *  - 里程碑/冷却用 st.flags._companyHL* 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 *  - 域D 仅做跨域桥接，不新建平行 NPC 系统、不依赖 npcs.js 中仍处 TODO 的 xiaoli/auntie_lin/master_zhao，
 *    一律用通用 state.relationships 遍历。
 *  - 主题：创业/公司层面的「纪律感、带队温度、经营眼界」反哺到数值(A)、社交(D)、职业(C)。
 *  - 注意：本文件 id 前缀 company_h_* 与 R12 company_linkage_events.js 的 startup_* 不冲突。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._companyLinkageR21Loaded) return;
  RANDOM_EVENTS._companyLinkageR21Loaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表（域D铁律：须 rel && rel.met）
  function getMetNpcsH(st, minAff) {
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
  function safeAffinityH(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域H联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // ---- 域H 联动事件 ----

  var COMPANY_EVENTS = [
    // ===== H→A：把创业的纪律感带回日常 ↔ 数值/心智（状态回馈） =====
    {
      id: "company_h_foundation_discipline",
      title: "创业磨出来的那点纪律感",
      desc: "连着几个月盯现金流、排优先级，你发现自己不再熬夜刷手机了。那种'今天的事今天毕'的劲头，悄悄渗进了柴米油盐的日子。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._companyHLDisciplineCooldown) return false;
        // 仅在已创立公司后，纪律感才有来源
        if (!(st.startup && st.startup.company)) return false;
        return true;
      },
      choices: [
        {
          text: "把这份节奏守住",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 5; // [PLACEHOLDER] 心智回馈
            if (st.needs)
              st.needs.happiness = (st.needs.happiness || 50) + 4; // [PLACEHOLDER] 心情
            if (st.flags) st.flags._companyHLDisciplineCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "创业逼出来的自律，反手把日常生活也理顺了几分。",
                "good",
              );
          },
        },
        {
          text: "松一口气也不错",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._companyHLDisciplineCooldown = true;
          },
        },
      ],
      probability: 0.05,
    },

    // ===== H→D：把带队的温度带到人际 ↔ NPC/社交（管理风格转化为好感） =====
    {
      id: "company_h_team_warmth",
      title: "你对人好，圈子也暖了你",
      desc: "公司里你习惯先听再说、遇事扛一句'我的锅'。后来才发现，这种带人的温度，让你在圈子里也多了几个真肯帮忙的朋友。",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._companyHLTeamWarmthCooldown) return false;
        if (!(st.startup && st.startup.company)) return false;
        // 至少一个"信得过"(好感≥30)的已结识 NPC
        if (!getMetNpcsH(st, 30).length) return false;
        return true;
      },
      choices: [
        {
          text: "把这份温度继续传下去",
          apply: function (st) {
            // D域桥接：管理温度转化为社交好感（守域D铁律：rel.met + applyAffinityChange）
            var npc = getMetNpcsH(st, 30)[0];
            if (npc) safeAffinityH(st, npc.id, 6, "带人温度·圈内好感"); // [PLACEHOLDER] 好感增量
            if (st.needs)
              st.needs.happiness = (st.needs.happiness || 50) + 3;
            if (st.flags) st.flags._companyHLTeamWarmthCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "肯扛事的人，关系里总不缺搭把手的朋友。",
                "good",
              );
          },
        },
        {
          text: "公是公私是私，分清楚",
          apply: function (st) {
            if (st.needs)
              st.needs.happiness = (st.needs.happiness || 50) + 1;
            if (st.flags) st.flags._companyHLTeamWarmthCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== H→C：把经营公司的眼界带回职场 ↔ 职业/成长（经营眼界转化为职场技能） =====
    {
      id: "company_h_business_acumen",
      title: "一次被合伙人记住的判断",
      desc: "董事会要你讲清下个季度的打法。你没堆 PPT，而是用一组数字把'为什么赢、输在哪'说透了。散会后，带你的前辈私下说：这小子，看事的格局比以前高了。",
      phase: "corporate",
      triggers: { minDay: 150 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._companyHLBusinessAcumenCooldown) return false;
        return true;
      },
      choices: [
        {
          text: "把这套经营打法沉淀下来",
          apply: function (st) {
            // C域桥接：经营眼界转化为真实职业技能（management 为通用管理门槛技能，语义一致）
            if (typeof addSkillXp === "function") addSkillXp("management", 8); // [PLACEHOLDER] 经营/管理 XP
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.needs)
              st.needs.happiness = (st.needs.happiness || 50) + 2;
            if (st.flags) st.flags._companyHLBusinessAcumenCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "把公司当沙盘练出来的眼界，回到职场也是一种降维。",
                "good",
              );
          },
        },
        {
          text: "讲完拉倒，下不为例",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._companyHLBusinessAcumenCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < COMPANY_EVENTS.length; i++) {
    RANDOM_EVENTS.push(COMPANY_EVENTS[i]);
  }
})();

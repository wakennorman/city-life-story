/*
 * 城市浮生记 — 域D（NPC/社交）联动增强事件
 * v3.108 · loop R17 全系统优化·Domain D 社交→跨域桥接
 *
 * 设计约束（与 R11 economy / R12 lifecycle / R13 company / R14 data / R16 career 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 覆盖两种人生阶段。
 *  - 社交桥接严格遵守域D架构铁律：只读 state.relationships；引用 NPC 须 rel && rel.met；
 *    跨 NPC 好感传导一律走 applyAffinityChange（自动 clamp + 记 _lastInteractionDay + 升级播报）。
 *  - 里程碑/冷却用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 *  - 域D 仅做跨域桥接，不新建平行 NPC 系统、不依赖 npcs.js 中仍处 TODO 的 xiaoli/auntie_lin/master_zhao，
 *    一律用通用 state.relationships 遍历。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._npcSocialLinkageLoaded) return;
  RANDOM_EVENTS._npcSocialLinkageLoaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表（域D铁律：须 rel && rel.met）
  function getMetNpcsD(st, minAff) {
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
  function safeAffinityD(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域D联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // ---- 域D 联动事件 ----

  var SOCIAL_EVENTS = [
    // ===== D→A：深度交谈 ↔ 数值/心智（状态刷新） =====
    {
      id: "social_deep_talk",
      title: "一个肯对你掏心窝子的朋友",
      desc: "深夜，一位真正信得过你的朋友打来电话，说起自己撑了很久的难处。你听着，也难得的，把压在心里的东西倒了出来。挂掉电话，脑子好像轻了一些。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._socialDeepTalkCooldown) return false;
        // 至少有一个"熟络"(好感≥40)的已结识 NPC
        if (!getMetNpcsD(st, 40).length) return false;
        return true;
      },
      choices: [
        {
          text: "珍惜这份信任，常联系",
          apply: function (st) {
            var npc = getMetNpcsD(st, 40)[0];
            if (npc) safeAffinityD(st, npc.id, 4, "深度交谈·彼此信任");
            if (st.player) st.player.mental = (st.player.mental || 50) + 6; // [PLACEHOLDER] 心智回馈
            if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 4; // [PLACEHOLDER] 心情
            if (st.flags) st.flags._socialDeepTalkCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "一段被认真对待的友谊，悄悄把你从紧绷里松了下来。",
                "good",
              );
          },
        },
        {
          text: "客气听完，各自安好",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._socialDeepTalkCooldown = true;
          },
        },
      ],
      probability: 0.05,
    },

    // ===== D→C：圈内人牵线 ↔ 职业/成长（社交资本转化为职场技能） =====
    {
      id: "social_job_referral",
      title: "圈内人递来的一个机会",
      desc: "酒局散场，一位交情够深的熟人压低声音说：「我们公司正好缺人，你这底子，要不要我替你递个话？」",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._socialJobReferralCooldown) return false;
        // 至少一个"信得过"(好感≥30)的已结识 NPC
        if (!getMetNpcsD(st, 30).length) return false;
        return true;
      },
      choices: [
        {
          text: "请对方引荐，并认真准备",
          apply: function (st) {
            // C域桥接：人脉转化为社交技能经验（networking 在职业体系里是真实技能 social）
            if (typeof addSkillXp === "function") addSkillXp("social", 8); // [PLACEHOLDER] 社交技能XP
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 2;
            if (st.flags) st.flags._socialJobReferralCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "一段人脉，变成了职业路上实实在在的助力。",
                "good",
              );
          },
        },
        {
          text: "记下信息，自己投简历",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._socialJobReferralCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== D→E：朋友的消息 ↔ 经济/投资（公司阶段理财契机） =====
    {
      id: "social_market_tip",
      title: "在咖啡馆听到的一句闲话",
      desc: "做金融的朋友随口提了句行业风向，你没当真，却在之后几天看到了印证。原来有些信息，真的只在圈子里流转。",
      phase: "corporate",
      triggers: { minDay: 120 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._socialMarketTipCooldown) return false;
        // 至少一个"聊得来的圈内人"(好感≥25)的已结识 NPC
        if (!getMetNpcsD(st, 25).length) return false;
        return true;
      },
      choices: [
        {
          text: "顺着这条线小试一笔",
          apply: function (st) {
            // E域桥接：朋友的消息释放可投资资金并强化投资心态（复用 R14 _dataInvestorMindset）
            if (st.resources) {
              st.resources.bankBalance =
                (st.resources.bankBalance || 0) + 15000; // [PLACEHOLDER] 试水本金
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.flags) {
              st.flags._socialMarketTipCooldown = true;
              st.flags._dataInvestorMindset = true; // 与 R14 data_savings_milestone / R16 career_promotion_bonus 同一投资心态 flag
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "圈子里的一句话，让你第一次认真想着让钱生钱。",
                "good",
              );
          },
        },
        {
          text: "听过就算，不冒险",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._socialMarketTipCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < SOCIAL_EVENTS.length; i++) {
    RANDOM_EVENTS.push(SOCIAL_EVENTS[i]);
  }
})();

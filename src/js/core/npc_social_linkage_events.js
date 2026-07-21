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
      desc: "一个朋友随口提了句行业风向，你没当真，却在之后几天看到了印证。原来有些信息，真的只在圈子里流转。",
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

/*
 * 城市浮生记 — 域D（NPC/社交）联动增强·常态NPC互动
 * v3.117 · loop R26 全系统优化·Domain D（NPC/社交）主审第二轮
 *
 * 【联动意图】R26 指令一刚激活 auntie_lin(林阿姨)/chen_ge(陈哥)/ajie(阿杰) 三名沉睡NPC，
 * 但激活只是"能结识"。要让 NPC 真正"活"在系统里，需给信息型 NPC 接一条常态化互动：
 *  - chen_ge(情报贩子) → E 经济/投资：周期性透漏市场/门路消息（NPC→经济，逆向桥接，未覆盖）
 *  - auntie_lin(菜市场摊主) → A 数据/数值：周期性透漏菜价门道（NPC→物价/烹饪，未覆盖）
 * 这样 NPC 不只是关系条上的数字，而是持续产出跨域价值的"活人"。
 *
 * 设计约束（与 npc_social_linkage_events.js 一致）：
 *  - IIFE 注入 RANDOM_EVENTS，不改动 cross_system_events.js。
 *  - 域D铁律：只读 state.relationships；引用 NPC 须 rel && rel.met。
 *  - 冷却用 st.flags._xxxCooldown(存 day) 去重，conditions 与 apply 双重拦截。
 *  - 所有 state 访问 || 防御；数值标 [PLACEHOLDER]。
 *  - phase:"street"（三人均 street 阶段角色）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._npcLinkageR26Loaded) return;
  RANDOM_EVENTS._npcLinkageR26Loaded = true;

  // ===== D→E：陈哥的市场耳语（NPC→经济/投资） =====
  RANDOM_EVENTS.push({
    id: "npc_chen_ge_market_whisper",
    phase: "street",
    icon: "🕶️",
    title: "陈哥递来的耳语",
    desc:
      "陈哥在商业区角落冲你招手，压低声音：「有个消息，别外传——下礼拜城东要开个新商圈，周边铺面租金得涨。你手头要有闲钱，早点布阵。」\n\n" +
      "他没说具体投什么，但眼神里那股「你懂的」意味，让你心里一动。",
    triggers: { minDay: 30 },
    conditions: function (st) {
      if (!st || !st.player || !st.relationships) return false;
      var r = st.relationships.chen_ge;
      if (!r || !r.met || (r.affinity || 0) < 25) return false; // 域D铁律：须 rel && rel.met
      if (st.flags && st.flags._chenGeWhisperCooldown) {
        if (st.player.day - st.flags._chenGeWhisperCooldown < 30) return false; // [PLACEHOLDER] 冷却30天
      }
      return true;
    },
    choices: [
      {
        text: "📈 顺藤摸瓜，小试一笔",
        hint: "激活投资心态 + 小额试水",
        apply: function (st) {
          if (st.resources) {
            st.resources.bankBalance = (st.resources.bankBalance || 0) + 8000; // [PLACEHOLDER] 试水本金
          }
          if (st.player) st.player.mental = (st.player.mental || 50) + 2;
          if (st.flags) {
            st.flags._chenGeWhisperCooldown = st.player.day;
            st.flags._dataInvestorMindset = true; // 复用 R14/R16 同一投资心态 flag
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "📈 陈哥的一句话，让你第一次认真盘算「让钱生钱」。银行户头多了¥8000试水金。",
              "good",
            );
        },
      },
      {
        text: "🤔 听听就好，不冒险",
        hint: "记下人脉，不投钱",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._chenGeWhisperCooldown = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🤔 你笑着点头，没掏钱。陈哥摆摆手：「谨慎点好。」",
              "info",
            );
        },
      },
    ],
    probability: 0.04,
  });

  // ===== D→A：林阿姨的菜价门道（NPC→数据/数值·物价/烹饪） =====
  RANDOM_EVENTS.push({
    id: "npc_auntie_lin_fresh_deal",
    phase: "street",
    icon: "🥬",
    title: "林阿姨的批发价",
    desc:
      "你在菜市场，林阿姨神秘兮兮地把你拉到摊位后头：「丫头/小子，今天批发价到了一批好货，外面卖¥8的青菜，我这儿¥3拿走。\n\n" +
      "「做饭的，懂食材才是真省钱。这周你来我这儿拿，算你成本价。」",
    triggers: { minDay: 25 },
    conditions: function (st) {
      if (!st || !st.player || !st.relationships) return false;
      var r = st.relationships.auntie_lin;
      if (!r || !r.met) return false; // 域D铁律：须 rel && rel.met
      if (!(
        st.skills &&
        st.skills.cooking &&
        (st.skills.cooking.level || 0) >= 5
      ))
        return false; // 需有点烹饪底子才懂门道
      if (st.flags && st.flags._auntieLinDealCooldown) {
        if (st.player.day - st.flags._auntieLinDealCooldown < 21) return false; // [PLACEHOLDER] 冷却21天
      }
      return true;
    },
    choices: [
      {
        text: "🥬 按批发价囤一波",
        hint: "省一笔伙食费 + 烹饪经验",
        apply: function (st) {
          var save = 60; // [PLACEHOLDER] 批发省下的伙食费
          if (st.resources) {
            st.resources.cash = (st.resources.cash || 0) + save;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + save;
          }
          if (
            st.skills &&
            st.skills.cooking &&
            st.skills.cooking.xp !== undefined
          ) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 15; // [PLACEHOLDER] 烹饪经验
          }
          if (st.flags) st.flags._auntieLinDealCooldown = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🥬 你按批发价囤了菜，省下¥" +
                save +
                "，顺手跟林阿姨学了两手刀工（烹饪经验+15）。",
              "good",
            );
        },
      },
      {
        text: "🙂 先拿一把尝尝",
        hint: "少量实惠",
        apply: function (st) {
          if (st.flags) st.flags._auntieLinDealCooldown = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🙂 你只拿了一把葱。林阿姨笑：「慢慢来，常来就行。」",
              "info",
            );
        },
      },
    ],
    probability: 0.04,
  });
})();

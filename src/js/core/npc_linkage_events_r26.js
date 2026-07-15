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
            st.resources.bankBalance =
              (st.resources.bankBalance || 0) + 8000; // [PLACEHOLDER] 试水本金
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
      if (!(st.skills && st.skills.cooking && (st.skills.cooking.level || 0) >= 5))
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
          if (st.skills && st.skills.cooking && st.skills.cooking.xp !== undefined) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 15; // [PLACEHOLDER] 烹饪经验
          }
          if (st.flags) st.flags._auntieLinDealCooldown = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🥬 你按批发价囤了菜，省下¥" + save + "，顺手跟林阿姨学了两手刀工（烹饪经验+15）。",
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

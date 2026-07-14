/*
 * 城市浮生记 — 域C（职业/成长）联动增强事件 · 第二轮
 * v3.115 · loop R24 全系统优化·Domain C 职业成长→跨域桥接
 *
 * 设计约束（与 R11–R23 各域 linkage 文件一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 以覆盖两种人生阶段。
 *  - 里程碑类事件用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 *  - 域D 桥接严守铁律：只读 state.relationships、rel&&rel.met 守卫、跨NPC传导走 applyAffinityChange。
 *  - 本文件事件 id 统一前缀 career2_*，与 R16 career_linkage_events.js 的 career_* 不冲突。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._career2LinkageR24Loaded) return;
  RANDOM_EVENTS._career2LinkageR24Loaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表
  function getMetNpcsR24(st, minAff) {
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
  function pickClosestMetNpcR24(st, minAff) {
    var met = getMetNpcsR24(st, minAff || 0);
    if (!met.length) return null;
    met.sort(function (a, b) {
      return (b.rel.affinity || 0) - (a.rel.affinity || 0);
    });
    return met[0];
  }

  // 安全改好感：优先全局 applyAffinityChange（自动 clamp + 记 _lastInteractionDay），否则兜底直写
  function safeAffinityR24(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域C联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // ============ 事件定义 ============

  // ===== C→D：职业被看见 ↔ 社交亲近（旧同事辗转找到你，重连一段旧缘） =====
  RANDOM_EVENTS.push({
    id: "career2_peer_reconnect",
    title: "一位老同事辗转找到了你",
    desc: "多年没联系的前同事忽然发来消息，说你当年带他入行时那股认真劲，他一直记着。聊起来，你们竟在同一个城市。",
    phase: "street",
    triggers: { minDay: 30 },
    conditions: function (st) {
      if (!st || !st.relationships) return false;
      if (st.flags && st.flags._career2PeerReconnectDone) return false;
      if (!getMetNpcsR24(st, 0).length) return false;
      return true;
    },
    choices: [
      {
        text: "约他出来，好好叙叙旧",
        apply: function (st) {
          var npc = pickClosestMetNpcR24(st, 0);
          if (npc) safeAffinityR24(st, npc.id, 6, "职场旧缘被重新看见");
          if (st.player) st.player.mental = (st.player.mental || 50) + 3;
          if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 3;
          if (st.flags) st.flags._career2PeerReconnectDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "一份被记住的认真，让你对这座城市又近了一分。",
              "good",
            );
        },
      },
      {
        text: "客套几句，没多约",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._career2PeerReconnectDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== C→A：稳定就业 ↔ 生活底气（有活干、有进账，慢慢攒出一点缓冲） =====
  RANDOM_EVENTS.push({
    id: "career2_steady_grounding",
    title: "连续上班的日子，让你心里有了底",
    desc: "不知不觉已经在这个岗位上待了一阵。每月固定的进账，让你第一次觉得'明天'不是悬着的。你开始给未来留一点余量。",
    phase: "street",
    triggers: { minDay: 60 },
    conditions: function (st) {
      if (!st || !st.player || st.player.phase !== "street") return false;
      if (!st.resources) return false;
      if (st.flags && st.flags._career2SteadyGroundingDone) return false;
      // [PLACEHOLDER] 触发所需的连续在职天数门槛
      if ((st.player.day || 0) < 60) return false;
      // 有一份稳定工作（employment 或 career 任一存在即视为在职）
      var employed =
        (st.employment && st.employment.currentJob) ||
        (st.career && st.career.currentJob);
      if (!employed) return false;
      return true;
    },
    choices: [
      {
        text: "把每月结余划出一小笔，攒应急金",
        apply: function (st) {
          // 稳定就业带来生活底气：属性稳定 + 储蓄缓冲（域A 数值平衡）
          if (st.player) st.player.mental = (st.player.mental || 50) + 4;
          if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 2;
          if (st.resources)
            st.resources.bankBalance = (st.resources.bankBalance || 0) + 800; // [PLACEHOLDER] 应急储蓄缓冲
          if (st.flags) st.flags._career2SteadyGroundingDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "有活干、有进账，你对日子的掌控感悄悄回来了。",
              "good",
            );
        },
      },
      {
        text: "还是先顾眼前开销",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._career2SteadyGroundingDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== C→E：项目分红 ↔ 投资嗅觉（职场阶段，分红到账，第一次认真想钱生钱） =====
  RANDOM_EVENTS.push({
    id: "career2_bonus_to_capital",
    title: "一笔项目分红，让你动了理财的念头",
    desc: "年底项目结项，你拿到一笔意料之外的分红。钱躺在卡里几天后，你第一次认真想：能不能让它别只是躺着。",
    phase: "corporate",
    triggers: { minDay: 120 },
    conditions: function (st) {
      if (!st || !st.player || st.player.phase !== "corporate") return false;
      if (!st.resources) return false;
      if (st.flags && st.flags._career2BonusToCapitalDone) return false;
      // [PLACEHOLDER] 触发所需的现金/存款储备阈值
      if ((st.resources.bankBalance || 0) < 8000) return false;
      if ((st.resources.cash || 0) < 3000) return false;
      return true;
    },
    choices: [
      {
        text: "拿分红的小头，开始留意理财",
        apply: function (st) {
          if (st.resources)
            st.resources.bankBalance = (st.resources.bankBalance || 0) + 2000; // [PLACEHOLDER] 腾出可投资本金
          if (st.flags) st.flags._dataInvestorMindset = true; // 复用跨轮投资者心态标记
          if (st.player) st.player.mental = (st.player.mental || 50) + 3;
          if (st.flags) st.flags._career2BonusToCapitalDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "一笔分红，让你对'钱怎么生钱'第一次上了心。",
              "good",
            );
        },
      },
      {
        text: "分红先还了账单，没多想",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._career2BonusToCapitalDone = true;
        },
      },
    ],
    probability: 0.05,
  });
})();

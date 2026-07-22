/*
 * 城市浮生记 — 域B（事件/叙事）联动增强事件 · 第二轮
 * v3.114 · loop R23 全系统优化·Domain B 叙事事件→跨域桥接
 *
 * 设计约束（与 R11–R22 各域 linkage 文件一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 以覆盖两种人生阶段。
 *  - 里程碑类事件用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 *  - 域D 桥接严守铁律：只读 state.relationships、rel&&rel.met 守卫、跨NPC传导走 applyAffinityChange。
 *  - 本文件事件 id 统一前缀 narr_*，与既有各域 linkage 文件不冲突。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._narrLinkageR23Loaded) return;
  RANDOM_EVENTS._narrLinkageR23Loaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表
  function getMetNpcsR23(st, minAff) {
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
  function pickClosestMetNpcR23(st, minAff) {
    var met = getMetNpcsR23(st, minAff || 0);
    if (!met.length) return null;
    met.sort(function (a, b) {
      return (b.rel.affinity || 0) - (a.rel.affinity || 0);
    });
    return met[0];
  }

  // 安全改好感：优先全局 applyAffinityChange（自动 clamp + 记 _lastInteractionDay），否则兜底直写
  function safeAffinityR23(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域B联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 取等级最高的技能 key（用于 B→C 加成落到真实技能上）
  function topSkillKeyR23(st) {
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

  // ===== B→D：市井叙事 ↔ 社交亲近（听老故事，与偶遇 NPC 更近） =====
  RANDOM_EVENTS.push({
    id: "narr_old_town_story",
    title: "老街坊拉住你讲城市的旧事",
    desc: "傍晚收摊时，一位住了四十年的老街坊拉着你，讲起这条街从前怎么从一片荒地变成如今模样。你没急着走，听完了整段故事。",
    phase: "street",
    triggers: { minDay: 40 },
    conditions: function (st) {
      if (!st || !st.relationships) return false;
      if (!st.relationships.auntie_lin || !st.relationships.auntie_lin.met) return false; // [Layer3]
      if (st.flags && st.flags._narrOldTownDone) return false;
      if (!getMetNpcsR23(st, 0).length) return false;
      return true;
    },
    choices: [
      {
        text: "坐下来，把故事听完",
        apply: function (st) {
          var npc = pickClosestMetNpcR23(st, 0);
          if (npc) safeAffinityR23(st, npc.id, 5, "市井旧事里的亲近");
          if (st.player) st.player.mental = (st.player.mental || 50) + 2;
          if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 3;
          if (st.flags) st.flags._narrOldTownDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "听一段旧故事，你对这座城市多了点人情味。",
              "good",
            );
        },
      },
      {
        text: "客气两句，先走了",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._narrOldTownDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== B→C：匠人叙事 ↔ 职业/技能启发（读传记，想学一门手艺） =====
  RANDOM_EVENTS.push({
    id: "narr_craft_saga",
    title: "一本手艺人传记，悄悄改了你的念头",
    desc: "你在旧书摊翻到一本老匠人的传记：他如何用十年把一件事做到极致。合上书，你忽然很想亲手做出点什么。",
    phase: "street",
    triggers: { minDay: 30 },
    conditions: function (st) {
      if (!st || !st.player || !st.skills) return false;
      if (st.flags && st.flags._narrCraftSagaDone) return false;
      // [PLACEHOLDER] 触发所需的技能投入门槛（已开始打磨手艺）
      var top = 0;
      for (var k in st.skills) {
        if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
        var lv = (st.skills[k] && st.skills[k].level) || 0;
        if (lv > top) top = lv;
      }
      if (top < 10) return false;
      return true;
    },
    choices: [
      {
        text: "照着书里的门道，练一门手艺",
        apply: function (st) {
          // repair 为职业体系真实技能键（手艺人叙事语义一致）
          if (typeof addSkillXp === "function") {
            addSkillXp("repair", 6); // [PLACEHOLDER] 叙事启发的技能加成
          }
          if (st.player) st.player.mental = (st.player.mental || 50) + 3;
          if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 2;
          if (st.flags) st.flags._narrCraftSagaDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "一个匠人故事，让你对手里的活计更上心了。",
              "good",
            );
        },
      },
      {
        text: "只是读得入神，没多想",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._narrCraftSagaDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== B→E：茶馆传闻 ↔ 投资嗅觉（职场阶段，听来行业风声） =====
  RANDOM_EVENTS.push({
    id: "narr_market_whisper",
    title: "茶馆里听来的一则行业风声",
    desc: "午休时你在茶馆听见邻桌聊起某个行业正在悄悄起变化。你未必全信，但心里第一次认真盘算起'钱还能怎么生钱'。",
    phase: "corporate",
    triggers: { minDay: 120 },
    conditions: function (st) {
      if (!st || !st.player || st.player.phase !== "corporate") return false;
      if (!st.resources) return false;
      if (st.flags && st.flags._narrMarketWhisperDone) return false;
      // [PLACEHOLDER] 触发所需的现金/存款储备阈值
      if ((st.resources.bankBalance || 0) < 5000) return false;
      if ((st.resources.cash || 0) < 2000) return false;
      return true;
    },
    choices: [
      {
        text: "把闲钱划出一小笔，开始留意机会",
        apply: function (st) {
          if (st.resources)
            st.resources.bankBalance = (st.resources.bankBalance || 0) + 1500; // [PLACEHOLDER] 腾出可投资本金
          if (st.flags) st.flags._dataInvestorMindset = true; // 复用跨轮投资者心态标记
          if (st.player) st.player.mental = (st.player.mental || 50) + 3;
          if (st.flags) st.flags._narrMarketWhisperDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "一则茶余饭后的风声，让你对理财多了份自觉。",
              "good",
            );
        },
      },
      {
        text: "听听就算了，先顾眼前",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._narrMarketWhisperDone = true;
        },
      },
    ],
    probability: 0.05,
  });
})();

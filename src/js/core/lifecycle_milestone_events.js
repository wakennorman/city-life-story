/*
 * 城市浮生记 — 域G（核心机制/生命周期）联动增强事件 · 第三轮
 * v3.112 · loop R20 全系统优化·Domain G 核心机制/生命周期 → 跨域桥接
 *
 * 设计约束（与既有 R11/R12/R13/R14/R15/R16/R17/R18/R19 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤，故事件须显式设置 phase。
 *  - NP C桥接严格遵守域D架构铁律：只读 state.relationships；引用须 rel && rel.met。
 *  - 冷却/去重用 st.flags._xxxDone 双重拦截。
 *
 * 本轮新增3项联动：
 *   ① fame_npc_gossip — city-life-story 名氣子系统首次被 NPC 事件消费（G→D 跨域桥接）
 *   ② fame_npc_personal — 名气+NPC好感双门槛，解锁深度互动（G→D 桥接·高门槛回报）
 *   - 已在 story_chapters.js 内联: 情绪/健康子系统深度影响叙事走向（G→G 深度包装）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._lifecycleMilestoneLinkageLoaded) return;
  RANDOM_EVENTS._lifecycleMilestoneLinkageLoaded = true;

  // ---- 本地助手 ----
  // 取已结识且好感达阈值的 NPC 数量
  function countMetNpcs(st, minAff) {
    minAff = minAff || 0;
    var c = 0;
    if (!st || !st.relationships) return 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) c++;
    }
    return c;
  }

  // 取最高好感的 NPC 信息（Domain D 铁律：须 rel && rel.met）
  function getTopNpc(st) {
    if (!st || !st.relationships) return null;
    var top = null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (!r || !r.met) continue;
      if (!top || (r.affinity || 0) > (top.affinity || 0)) {
        top = { id: id, rel: r, affinity: r.affinity || 0 };
      }
    }
    return top;
  }

  // 安全改好感
  function safeAff(st, npcId, delta, reason) {
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, delta, reason || "lifecycle");
      return;
    }
    if (st.relationships && st.relationships[npcId]) {
      st.relationships[npcId].affinity = Math.max(
        -100,
        Math.min(100, (st.relationships[npcId].affinity || 0) + delta),
      );
    }
  }

  var LIFE_MILESTONE_EVENTS = [
    // ===== ① NPC 名气传播（ fame 子系统首次被 NPC 事件消费 ） =====
    {
      id: "fame_npc_gossip",
      title: "街头议论",
      desc: "你在街边摊吃面，听到邻桌在议论你。城里有些人认识你了。",
      phase: "street",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        // [全系统自洽修复] 域G 联动增强: fame 子系统首次被事件消费（名气→社交桥接）
        if (st.flags._fameGossipDone) return false;
        if ((st.player.fame || 0) < 25) return false; // [PLACEHOLDER] 名气门槛
        // 至少结识1位NPC
        if (countMetNpcs(st, 0) < 1) return false;
        return true;
      },
      choices: [
        {
          text: "🍜 低头吃完面，当作没听见",
          apply: function (st) {
            st.flags._fameGossipDone = true;
            if (st.player)
              st.player.morality = Math.min(
                100,
                (st.player.morality || 50) + 1,
              );
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "🍜 你闷头吃完那碗面。名气是虚的，碗里的面才是真的。道德+1。",
                "info",
              );
          },
        },
        {
          text: "🤝 跟他们打个招呼",
          hint: "好感+H2O[PLACEHOLDER]、名气+[PLACEHOLDER]",
          apply: function (st) {
            st.flags._fameGossipDone = true;
            var top = getTopNpc(st);
            if (top) safeAff(st, top.id, 3, "fame_gossip");
            if (st.player)
              st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "🤝 你过去打了个招呼。原来被人认出来，感觉还不错。名气+2，最高好感好友+3。",
                "good",
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== ② 名气+好感双门槛 — 深度互动解锁 =====
    {
      id: "fame_npc_personal",
      title: "故人的另一面",
      desc: "一位与你相熟的人悄悄告诉你 —— 你现在的'名气'，让他们看到了你身上以前没被注意到的东西。",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._famePersonalDone) return false;
        // 必须同时满足：名气≥50 且存在好感≥30的NPC
        if ((st.player.fame || 0) < 50) return false;
        if (countMetNpcs(st, 30) < 1) return false;
        return true;
      },
      choices: [
        {
          text: "🤲 感谢他们、请他们喝杯茶",
          hint: "心智+2、好感+[PLACEHOLDER]",
          apply: function (st) {
            st.flags._famePersonalDone = true;
            var top = getTopNpc(st);
            if (top) safeAff(st, top.id, 5, "fame_personal");
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            st.resources.cash = (st.resources.cash || 0) - 80;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "🤲 那人笑了笑说'以前怎么没发现你这么有脑子'。被熟人重新认识，是城市生活独特的心智成长。心智+2，好感+5。",
                "good",
              );
          },
        },
        {
          text: "📖 点头记下、继续做自己的事",
          hint: "智力+1",
          apply: function (st) {
            st.flags._famePersonalDone = true;
            if (st.player)
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 20) + 1,
              );
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "📖 你把这句话折好收进心里。别人的反馈是镜子，照见你自己看不见的侧面。智力+1。",
                "info",
              );
          },
        },
      ],
      probability: 0.03,
    },

    // ===== ③ corporate 阶段：名气+职场联动 =====
    {
      id: "fame_corporate_recognition",
      title: "公司里认出新面孔",
      desc: "你的名字开始在行业里被人提起。这在 corporate 世界里，既是助力也是压力。",
      phase: "corporate",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._fameCorporateDone) return false;
        if (st.player.phase !== "corporate") return false;
        if ((st.player.fame || 0) < 40) return false; // [PLACEHOLDER]
        return true;
      },
      choices: [
        {
          text: "🎤 主动承担一个跨部门项目",
          hint: "职场人气( popularity )+[PLACEHOLDER]、公司评价(upward)+[PLACEHOLDER]",
          apply: function (st) {
            st.flags._fameCorporateDone = true;
            // [全系统自洽修复] 域G A类#1: popularity 在 st.player.corporate 而非 st.corporate，写错对象静默丢失
            if (st.player && st.player.corporate) {
              st.player.corporate.popularity = Math.min(
                100,
                (st.player.corporate.popularity || 30) + 4,
              );
            }
            if (st.player && st.player.corporate) {
              st.player.corporate.upwardMgmt = Math.min(
                100,
                (st.player.corporate.upwardMgmt || 20) + 3,
              );
            } // [全系统自洽修复] 域B 修复: upward→upwardMgmt
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "🎤 跨部门协作中，人们记住了你的名字和方案。你的'名气'在公司内部开始有实质价值。",
                "good",
              );
          },
        },
        {
          text: "📋 保持低调、避免树敌",
          hint: "风险(risk)-[PLACEHOLDER]",
          apply: function (st) {
            st.flags._fameCorporateDone = true;
            // [全系统自洽修复] 域G A类#1: risk 在 st.player.corporate 而非 st.corporate
            if (st.player && st.player.corporate) {
              st.player.corporate.risk = Math.max(0, (st.player.corporate.risk || 0) - 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "📋 枪打出头鸟。你选择让名气只是名气，别成为靶子。风险-5。",
                "info",
              );
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < LIFE_MILESTONE_EVENTS.length; i++) {
    RANDOM_EVENTS.push(LIFE_MILESTONE_EVENTS[i]);
  }
})();

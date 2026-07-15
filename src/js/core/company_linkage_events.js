/*
 * 城市浮生记 — 域H（Phase2/公司）联动增强事件
 * v3.105 · loop R13 全系统优化·Domain H 核心机制/生命周期→跨域桥接
 *
 * 设计约束（与 R11 economy_linkage / R12 lifecycle_linkage 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"）；
 *    创业/公司 subsystem 在 corporate 阶段被创立（startup.js:89 要求 player.phase==="corporate"），
 *    故本文件事件统一 phase:"corporate"，并以 conditions 守卫 st.startup.company 存在。
 *  - 里程碑类事件用 st.flags._xxxDone 去重（在 conditions 与 apply 内双重拦截），不依赖引擎 onResolved。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._companyLinkageLoaded) return;
  RANDOM_EVENTS._companyLinkageLoaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表
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

  // 取好感最高的已结识 NPC
  function pickClosestMetNpcH(st, minAff) {
    var met = getMetNpcsH(st, minAff || 0);
    if (!met.length) return null;
    met.sort(function (a, b) {
      return (b.rel.affinity || 0) - (a.rel.affinity || 0);
    });
    return met[0];
  }

  // 安全改好感：优先全局 applyAffinityChange（自动 clamp + 记 _lastInteractionDay），否则兜底直写
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

  // 公司存在守卫（统一复用）
  function hasCompanyH(st) {
    return !!(
      st &&
      st.startup &&
      st.startup.company &&
      st.startup.status &&
      st.startup.status !== "none"
    );
  }

  // ---- 域H 联动事件 ----

  var COMPANY_EVENTS = [
    // ===== H→D：创业压力 ↔ 社交支持（NPC 好感） =====
    {
      id: "startup_friend_support",
      title: "创业低谷与挚友",
      desc: "公司账面紧张，连着几晚没睡好。手机里躺着几个老朋友的名字——也许该找人说说话。",
      phase: "corporate",
      triggers: { minDay: 200 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (!hasCompanyH(st)) return false;
        if (st.flags && st.flags._startupFriendSupportCooldown) return false;
        if (!getMetNpcsH(st, 20).length) return false;
        return true;
      },
      choices: [
        {
          text: "约挚友小聚倾诉",
          apply: function (st) {
            var npc = pickClosestMetNpcH(st, 20);
            if (npc) safeAffinityH(st, npc.id, 5, "创业倾诉");
            if (st.player) {
              st.player.mental = (st.player.mental || 50) + 6;
              st.needs.happiness = (st.needs.happiness || 50) + 4;
            }
            if (st.flags) st.flags._startupFriendSupportCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("和老友聊完，心里松快了不少。", "good");
          },
        },
        {
          text: "自己扛着，埋头干活",
          apply: function (st) {
            if (st.player) {
              st.player.mental = (st.player.mental || 50) - 2;
              st.needs.happiness = (st.needs.happiness || 50) - 1;
            }
            if (st.flags) st.flags._startupFriendSupportCooldown = true;
          },
        },
      ],
      probability: 0.05,
    },

    // ===== H→E：创业估值里程碑 ↔ 经济/投资资本 =====
    {
      id: "startup_wealth_milestone",
      title: "估值里程碑后的财富观",
      desc: "公司估值首次突破 [PLACEHOLDER] 关口，账面身价水涨船高，你开始认真思考'钱该怎么生钱'。",
      phase: "corporate",
      triggers: { minDay: 150 },
      conditions: function (st) {
        if (!hasCompanyH(st)) return false;
        var val = st.startup.company.valuation || 0;
        if (val < 1000000) return false; // [PLACEHOLDER] 估值门槛
        if (st.flags && st.flags._startupWealthMilestoneDone) return false;
        return true;
      },
      choices: [
        {
          text: "把部分收益划入可投资资金",
          apply: function (st) {
            // E域桥接：释放一笔可投资现金（银行户），并强化投资心态
            if (st.resources) {
              st.resources.bankBalance =
                (st.resources.bankBalance || 0) + 50000; // [PLACEHOLDER] 一次性可投资资金
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 5;
            if (st.flags) {
              st.flags._startupWealthMilestoneDone = true;
              st.flags._startupInvestorMindset = true; // 供 E域事件后续消费
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "公司估值里程碑达成，你开始系统规划个人投资。",
                "good",
              );
          },
        },
        {
          text: "全部再投入公司扩张",
          apply: function (st) {
            if (st.startup.company)
              st.startup.company.valuation = Math.round(
                (st.startup.company.valuation || 0) * 1.05,
              ); // [PLACEHOLDER] 再投资系数
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.flags) st.flags._startupWealthMilestoneDone = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== H→C：职场积累资本 ↔ 创业助力 =====
    {
      id: "startup_career_legacy",
      title: "职场积累反哺创业",
      desc: "创业路上，你发现当年在职场攒下的口碑与人脉仍在悄悄发力。",
      phase: "corporate",
      triggers: { minDay: 250 },
      conditions: function (st) {
        if (!hasCompanyH(st)) return false;
        var upward =
          (st.player &&
            st.player.corporate &&
            (st.player.corporate.upwardMgmt || 50)) ||
          50;
        if (upward < 40) return false; // [PLACEHOLDER] 职场声誉门槛
        if (st.flags && st.flags._startupCareerLegacyDone) return false;
        return true;
      },
      choices: [
        {
          text: "用前同事人脉拉来关键客户",
          apply: function (st) {
            if (st.startup.company)
              st.startup.company.valuation = Math.round(
                (st.startup.company.valuation || 0) * 1.08,
              ); // [PLACEHOLDER] 客户带来估值提升
            if (st.player && st.player.corporate)
              st.player.corporate.upwardMgmt = Math.min(
                (st.player.corporate.upwardMgmt || 50) + 5,
                100,
              ); // [PLACEHOLDER] 职场声誉回馈
            if (st.player) st.player.mental = (st.player.mental || 50) + 4;
            if (st.flags) st.flags._startupCareerLegacyDone = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "老同事的介绍，为公司带来了关键订单。",
                "good",
              );
          },
        },
        {
          text: "不靠旧关系，独立开拓",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.flags) st.flags._startupCareerLegacyDone = true;
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

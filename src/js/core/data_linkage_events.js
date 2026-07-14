/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强事件
 * v3.106 · loop R14 全系统优化·Domain A 数值平衡→跨域桥接
 *
 * 设计约束（与 R11 economy / R12 lifecycle / R13 company 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 以覆盖两种人生阶段。
 *  - 里程碑类事件用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._dataLinkageLoaded) return;
  RANDOM_EVENTS._dataLinkageLoaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表
  function getMetNpcsA(st, minAff) {
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
  function pickClosestMetNpcA(st, minAff) {
    var met = getMetNpcsA(st, minAff || 0);
    if (!met.length) return null;
    met.sort(function (a, b) {
      return (b.rel.affinity || 0) - (a.rel.affinity || 0);
    });
    return met[0];
  }

  // 安全改好感：优先全局 applyAffinityChange（自动 clamp + 记 _lastInteractionDay），否则兜底直写
  function safeAffinityA(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域A联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 净资产快照（现金 + 银行存款 + 投资市值）
  function netWorthA(st) {
    if (!st || !st.resources) return 0;
    var nw = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
    if (typeof getInvestmentAssetSnapshot === "function") {
      try {
        var snap = getInvestmentAssetSnapshot(st);
        if (snap && snap.investmentValue) nw += snap.investmentValue;
      } catch (e) {
        /* 忽略 */
      }
    }
    return nw;
  }

  // ---- 域A 联动事件 ----

  var DATA_EVENTS = [
    // ===== A→D：数值平衡（身心状态均衡）↔ 社交好感 =====
    {
      id: "data_balanced_living",
      title: "状态仪表盘上的平衡感",
      desc: "你翻看自己的状态记录——健康、清洁、心情、心态都处在舒适的区间。这种稳稳的节奏，身边朋友也都感觉到了。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._dataBalancedLivingCooldown) return false;
        var health = (st.status && st.status.health) || 0;
        var hyg = (st.needs && st.needs.hygiene) || 0;
        var happy = (st.needs && st.needs.happiness) || 0;
        var mental = st.player.mental || 0;
        // 四项核心指标均达均衡线，才算"数值平衡"
        if (health < 60 || hyg < 60 || happy < 50 || mental < 50) return false;
        if (!getMetNpcsA(st, 10).length) return false;
        return true;
      },
      choices: [
        {
          text: "约上朋友，把这份安稳分享出去",
          apply: function (st) {
            var npc = pickClosestMetNpcA(st, 10);
            if (npc) safeAffinityA(st, npc.id, 5, "状态均衡的感染力");
            if (st.player) {
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 3,
              );
              st.player.mental = (st.player.mental || 50) + 2;
            }
            if (st.flags) st.flags._dataBalancedLivingCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "稳定的生活状态，让你在朋友圈里更让人安心。",
                "good",
              );
          },
        },
        {
          text: "自己享受这份踏实",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._dataBalancedLivingCooldown = true;
          },
        },
      ],
      probability: 0.05,
    },

    // ===== A→C：技能数据追踪 ↔ 职业成长（口碑/晋升势能） =====
    {
      id: "data_skill_efficiency",
      title: "你的技能曲线被看见了",
      desc: "一份长期技能记录显示，你在某项专长上的投入已经相当可观。一位前辈留意到了这条上扬的曲线。",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player || !st.skills) return false;
        if (st.flags && st.flags._dataSkillEfficiencyDone) return false;
        // 任意一项技能达到可量化的熟练门槛，代表被追踪到的"效率"
        var top = 0;
        for (var k in st.skills) {
          if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
          var lv = (st.skills[k] && st.skills[k].level) || 0;
          if (lv > top) top = lv;
        }
        if (top < 30) return false; // [PLACEHOLDER] 技能熟练门槛
        return true;
      },
      choices: [
        {
          text: "把这份专长转化为职场口碑",
          apply: function (st) {
            if (st.player && st.player.corporate)
              st.player.corporate.upward = Math.min(
                (st.player.corporate.upward || 50) + 5,
                100,
              ); // [PLACEHOLDER] 职场声誉回馈
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.flags) st.flags._dataSkillEfficiencyDone = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "长期积累的专长，开始在你的职业口碑里兑现。",
                "good",
              );
          },
        },
        {
          text: "继续深耕，不急于变现",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._dataSkillEfficiencyDone = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== A→E：净资产里程碑 ↔ 经济/投资资本（公司阶段） =====
    {
      id: "data_savings_milestone",
      title: "资产数字越过一道坎",
      desc: "记账本上的净资产第一次稳稳越过了 [PLACEHOLDER] 关口。你意识到，除了埋头赚钱，也该让钱开始替你工作。",
      phase: "corporate",
      triggers: { minDay: 120 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._dataSavingsMilestoneDone) return false;
        if (netWorthA(st) < 200000) return false; // [PLACEHOLDER] 净资产里程碑
        return true;
      },
      choices: [
        {
          text: "划出一笔可投资资金，开始系统理财",
          apply: function (st) {
            // E域桥接：释放一笔可投资现金（银行户），并强化投资心态
            if (st.resources) {
              st.resources.bankBalance =
                (st.resources.bankBalance || 0) + 30000; // [PLACEHOLDER] 一次性可投资资金
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 4;
            if (st.flags) {
              st.flags._dataSavingsMilestoneDone = true;
              st.flags._dataInvestorMindset = true; // 供 E域事件后续消费
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "资产里程碑达成，你开始认真规划个人投资。",
                "good",
              );
          },
        },
        {
          text: "维持现状，继续滚雪球",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._dataSavingsMilestoneDone = true;
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < DATA_EVENTS.length; i++) {
    RANDOM_EVENTS.push(DATA_EVENTS[i]);
  }
})();

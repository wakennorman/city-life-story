/**
 * 域A(数据/数值平衡) 联动增强 R331
 * 第十轮循环——数据自省驱动的多维回响，呼应本轮 jobRiskMap 职业病风险数据修复主题。
 * 桥接：
 *   A→G  a331_occupational_health_guard  职业病风险数据→主动健康防护（核心机制/生命周期·消费 _habits 累积字段）
 *   A→D  a331_price_data_neighbor        物价成本数据→街坊分享涨好感（NPC/社交·守 rel.met 铁律）
 *   A→H  a331_cost_structure_audit       成本结构数据→公司经营审计（Phase2/公司·management 变现+晋升势能）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR331Loaded) return;
  RANDOM_EVENTS._domainALinkageR331Loaded = true;

  // 取首个已结识 NPC（守 rel.met 铁律）
  function firstMetNpcA331(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!st.relationships.hasOwnProperty(id)) continue;
      var rel = st.relationships[id];
      if (rel && rel.met) return id;
    }
    return null;
  }

  var EVENTS = [
    {
      // [全系统自洽修复] 域A 联动:A→G 职业病风险数据→主动防护（消费 _habits.highFatigueStreak 累积字段,呼应本轮 jobRiskMap 修复）
      id: "a331_occupational_health_guard",
      phase: "street",
      _isChainEvent: false,
      icon: "🩺",
      title: "职业健康风险自检",
      story: "你翻出这段时间的身体数据——连续高强度工作、睡眠不足、颈肩酸痛的频次，全都被你记了下来。\n\n对照着看，你忽然意识到：过劳不是突然来的，它是一天天累积的风险。数据把那些「还扛得住」的自我安慰变成了刺眼的曲线。\n\n「与其等病来了再治，不如照着数据提前防。」",
      triggers: { minDay: 300, excludeFlags: ["_occHealthGuardSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || !st.status) return false;
        var h = st.flags._habits || {};
        return (h.highFatigueStreak || 0) >= 3 || (h.lateNightActions || 0) >= 5;
      },
      choices: [
        {
          text: "🩺 照着风险数据主动调整作息",
          hint: "健康+[PLACEHOLDER]，心智+[PLACEHOLDER]，降低过劳累积",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._occHealthGuardSeen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10); // [PLACEHOLDER] 健康
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6); // [PLACEHOLDER] 心智
            // 消费/削减过劳累积字段（真实由每日管线维护）
            if (st.flags._habits) {
              st.flags._habits.highFatigueStreak = Math.max(0, (st.flags._habits.highFatigueStreak || 0) - 2); // [PLACEHOLDER]
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🩺 你照着风险数据主动调整了作息。防患于未然。健康+10，心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 身体还扛得住，先不管",
          hint: "心智+[PLACEHOLDER]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._occHealthGuardSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得身体还扛得住。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // [全系统自洽修复] 域A 联动:A→D 物价成本数据→街坊分享（守 rel.met 铁律,走 applyAffinityChange）
      id: "a331_price_data_neighbor",
      phase: "street",
      _isChainEvent: false,
      icon: "🧾",
      title: "把物价账本讲给街坊",
      story: "你算惯了自己的收支账，对菜市场、批发市场哪家便宜、什么时候进货最划算，心里门儿清。\n\n隔壁街坊为柴米油盐犯愁时，你顺手把这套「省钱数据」分享了出去——哪天打折、哪家实惠、怎么囤货不浪费。\n\n人情就是这么攒起来的：你帮别人省下的每一块钱，都记在了他们心里。",
      triggers: { minDay: 200, excludeFlags: ["_priceDataNeighborSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources || !st.relationships) return false;
        return (st.resources.cash || 0) >= 500 && firstMetNpcA331(st) !== null; // [PLACEHOLDER] 现金门槛
      },
      choices: [
        {
          text: "🧾 把省钱数据分享给街坊",
          hint: "已结识街坊好感+[PLACEHOLDER]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._priceDataNeighborSeen = true;
            var nid = firstMetNpcA331(st);
            if (nid && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, nid, 5, "你把省钱的物价数据分享给街坊，帮他们过日子"); // [PLACEHOLDER] 好感
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧾 你把省钱数据分享给街坊。人情攒下了。好感+5。", "success");
            }
          },
        },
        {
          text: "🤐 自己知道就好",
          hint: "心智+[PLACEHOLDER]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._priceDataNeighborSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤐 你觉得自己知道就好。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      // [全系统自洽修复] 域A 联动:A→H 成本结构数据→公司经营审计（management 变现 + 晋升势能 upward 真实惰性字段）
      id: "a331_cost_structure_audit",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📉",
      title: "成本结构审计",
      story: "公司账面利润看着还行，但你没被表象骗到。你把成本一项项拆开：房租、人力、采购、损耗、隐性支出……\n\n拆到最后，你发现真正吃掉利润的往往不是最大的那笔开支，而是那些没人盯着的小口子。数据一目了然地指出了漏洞。\n\n「管理的第一步，是先把账算明白。」",
      triggers: { minDay: 420, excludeFlags: ["_costStructureAuditSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 处于经营阶段：创业公司或在职公司任一存在即可
        var hasBiz = (st.startup && st.startup.company) || (st.corporate && st.corporate.company);
        return !!hasBiz;
      },
      choices: [
        {
          text: "📉 用数据做一次成本结构审计",
          hint: "经营+管理XP[PLACEHOLDER]，晋升势能+[PLACEHOLDER]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._costStructureAuditSeen = true;
            if (typeof addSkillXp === "function") addSkillXp("management", 10); // [PLACEHOLDER] 管理XP
            if (st.player && st.player.corporate) {
              st.player.corporate.upward = Math.min(100, (st.player.corporate.upward || 50) + 4); // [PLACEHOLDER] 晋升势能
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📉 你用数据做了成本结构审计，堵住了利润漏洞。管理XP+10，晋升势能+4。", "success");
            }
          },
        },
        {
          text: "🤷 账面利润过得去就行",
          hint: "心智+[PLACEHOLDER]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._costStructureAuditSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得账面利润过得去就行。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

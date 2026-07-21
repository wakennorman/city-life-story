/*
 * 城市浮生记 — 域H（Phase2/公司）联动增强 · R83
 * 全系统优化 loop R83 · 联动增强 2项
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR83) return;
  RANDOM_EVENTS._domainHLinkageR83 = true;

  function safeAffinityH83(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域H R83联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  var H_EVENTS = [
    // ===== 联动1: H→G 公司里程碑叙事 =====
    // 设计意图：公司达到特定规模（员工数/估值）时触发叙事，让创业成长有情感回响。
    {
      id: "company_milestone_10_employees",
      title: "十人团队",
      desc: "你的公司终于突破了两位数员工。从一个人单枪匹马到十个人的团队，你回望来路，感慨万千。",
      phase: "corporate",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.corporate || !st.flags) return false;
        if (st.flags._companyMilestone10Done) return false;
        return st.corporate.team && st.corporate.team.length >= 10;
      },
      choices: [
        {
          text: "🎉 请大家吃顿好的，庆祝一下",
          apply: function (st) {
            if (st.flags) st.flags._companyMilestone10Done = true;
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) - 2000;
            }
            if (st.corporate && st.corporate.team) {
              for (var i = 0; i < st.corporate.team.length; i++) {
                st.corporate.team[i].loyalty = Math.min(
                  100,
                  (st.corporate.team[i].loyalty || 50) + 5
                );
              }
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "🎉 十人庆功宴上，大家喝了不少酒，聊了不少真心话。团队凝聚力提升了！心智+5。",
                "good"
              );
          },
        },
        {
          text: "💼 低调处理，把预算投到业务上",
          apply: function (st) {
            if (st.flags) st.flags._companyMilestone10Done = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "💼 你把庆功预算投到了业务上。员工们虽然没说什么，但心里都懂。智力+3。",
                "info"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动2: H→D 公司阶段NPC社交圈 =====
    // 设计意图：公司阶段与已结识NPC的社交互动，让NPC对玩家的创业经历有感知。
    {
      id: "corporate_npc_congratulation",
      title: "老朋友的祝贺",
      desc: "你创业的消息传开了。一位老朋友听说你现在当老板了，特意来找你聊聊。",
      phase: "corporate",
      triggers: { minDay: 45 },
      conditions: function (st) {
        if (!st || !st.player || !st.relationships || !st.flags) return false;
        if (st.flags._corporateNpcCongratsDone) return false;
        // 至少1个已结识且好感≥50的NPC
        for (var id in st.relationships) {
          if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
          var r = st.relationships[id];
          if (r && r.met === true && (r.affinity || 0) >= 50) return true;
        }
        return false;
      },
      choices: [
        {
          text: "🤝 热情接待，分享创业故事",
          apply: function (st) {
            if (st.flags) st.flags._corporateNpcCongratsDone = true;
            // 随机选一个高好感NPC好感+4
            if (st.relationships) {
              var best = null, bestAff = 50;
              for (var id in st.relationships) {
                if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
                var r = st.relationships[id];
                if (r && r.met === true && (r.affinity || 0) > bestAff) {
                  best = id; bestAff = r.affinity || 0;
                }
              }
              if (best) safeAffinityH83(st, best, 4, "创业分享");
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "和老朋友聊了很久，创业的苦与乐都有人听。名气+2，心智+3。",
                "good"
              );
          },
        },
        {
          text: "😅 谦虚说还在摸索阶段",
          apply: function (st) {
            if (st.flags) st.flags._corporateNpcCongratsDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你谦虚地说还在摸索。老朋友笑着说：「你从小就稳重。」心智+5。",
                "info"
              );
          },
        },
      ],
      probability: 0.03,
    },
  ];

  for (var i = 0; i < H_EVENTS.length; i++) {
    var evt = H_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions) evt.conditions = function () { return false; };
    RANDOM_EVENTS.push(evt);
  }
})();

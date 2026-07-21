/*
 * 城市浮生记 — 域D（NPC/社交）联动增强 · R87
 * 全系统优化 loop R87 · 联动增强 2项
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR87) return;
  RANDOM_EVENTS._domainDLinkageR87 = true;

  function safeAffinityD87(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域D R87联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  var D_EVENTS = [
    // ===== 联动1: D→H NPC创业人脉桥接 =====
    {
      id: "npc_corporate_contact_intro",
      title: "老朋友的人脉",
      desc: "一位老朋友听说你在创业，说可以给你介绍一个业内的熟人。",
      phase: "corporate",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player || !st.relationships || !st.flags || !st.corporate) return false;
        if (st.flags._npcCorporateContactDone) return false;
        if (!st.corporate.company) return false;
        for (var id in st.relationships) {
          if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
          var r = st.relationships[id];
          if (r && r.met === true && (r.affinity || 0) >= 70) return true;
        }
        return false;
      },
      choices: [
        {
          text: "🤝 请朋友帮忙引荐",
          apply: function (st) {
            if (st.flags) st.flags._npcCorporateContactDone = true;
            if (st.relationships) {
              var best = null, bestAff = 70;
              for (var id in st.relationships) {
                if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
                var r = st.relationships[id];
                if (r && r.met === true && (r.affinity || 0) > bestAff) {
                  best = id; bestAff = r.affinity || 0;
                }
              }
              if (best) safeAffinityD87(st, best, 3, "创业人脉引荐");
            }
            if (st.corporate) {
              st.corporate.networkValue = (st.corporate.networkValue || 0) + 5;
            }
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "老朋友帮你引荐了一位业内熟人。公司人脉资源+5，名气+3。",
                "good"
              );
          },
        },
        {
          text: "🙏 心领了，先靠自己",
          apply: function (st) {
            if (st.flags) st.flags._npcCorporateContactDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("你决定先靠自己打拼。心智+3。", "info");
          },
        },
      ],
      probability: 0.03,
    },

    // ===== 联动2: D→G 社交圈归属感里程碑 =====
    {
      id: "social_circle_belonging_milestone",
      title: "这座城市里的牵绊",
      desc: "你发现自己在这些城市里已经有了不少牵绊。那些认识的人、经历过的事，让你觉得自己不再是一个漂泊的外人。",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player || !st.relationships || !st.flags) return false;
        if (st.flags._socialCircleMilestoneDone) return false;
        var count = 0;
        for (var id in st.relationships) {
          if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
          var r = st.relationships[id];
          if (r && r.met === true && (r.affinity || 0) >= 50) count++;
        }
        return count >= 3;
      },
      choices: [
        {
          text: "😊 给几个老朋友发条消息",
          apply: function (st) {
            if (st.flags) st.flags._socialCircleMilestoneDone = true;
            if (st.relationships) {
              for (var id in st.relationships) {
                if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
                var r = st.relationships[id];
                if (r && r.met === true && (r.affinity || 0) >= 50) {
                  safeAffinityD87(st, id, 2, "社交圈归属感");
                }
              }
            }
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你给几个老朋友发了消息，大家都很高兴。心情+8，所有好友好感+2。",
                "good"
              );
          },
        },
        {
          text: "🤫 把这份温暖藏在心里",
          apply: function (st) {
            if (st.flags) st.flags._socialCircleMilestoneDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你把这份温暖藏在心里。独处也是一种力量。心智+5。",
                "info"
              );
          },
        },
      ],
      probability: 0.03,
    },
  ];

  for (var i = 0; i < D_EVENTS.length; i++) {
    var evt = D_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions) evt.conditions = function () { return false; };
    RANDOM_EVENTS.push(evt);
  }
})();

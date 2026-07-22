/*
 * 城市浮生记 — 域D（NPC/社交）联动增强 · R166
 * 全系统优化 loop R166 · 联动增强 2项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR166) return;
  RANDOM_EVENTS._domainDLinkageR166 = true;

  // ---- 本地助手 ----

  function safeAffinityR166(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域D R166联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 已结识且好感≥阈值的NPC数量
  function closeNpcCountR166(st, minAff) {
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) count++;
    }
    return count;
  }

  // 取好感最高的NPC id
  function topAffinityNpcR166(st) {
    if (!st || !st.relationships) return null;
    var bestId = null, bestAff = 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) > bestAff) {
        bestAff = r.affinity || 0;
        bestId = id;
      }
    }
    return bestId;
  }

  // 取NPC中文名
  function npcNameR166(st, npcId) {
    if (!npcId) return "朋友";
    try {
      if (typeof NPCS !== "undefined" && NPCS[npcId]) return NPCS[npcId].name;
    } catch (e) { /* ignore */ }
    return npcId;
  }

  // ---- 联动事件 ----

  var D_EVENTS = [

    // ===== D→B 社交圈·城内传闻 =====
    // 设计意图：当玩家拥有多个高好感NPC时，触发社交圈内传闻事件，
    //   让NPC社交关系产生叙事回报——人脉不只是数值，更是信息流。
    {
      id: "social_grapevine_rumor",
      title: "朋友多了，消息灵通了",
      desc: "你在这个城市认识的人越来越多，消息也渐渐串了起来。\n\n饭桌上，一位朋友压低声音说：'听说城西要建新商圈，那边的铺子要涨了……'另一位朋友打断：'别听他瞎说，我表弟在规划局，说是要建公园。'\n\n不管真假，有人愿意跟你聊这些，本身就是一种信任。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._socialGrapevineRumorDone) return false;
        // 至少3个好感≥40的NPC
        if (closeNpcCountR166(st, 40) < 3) return false;
        return true;
      },
      choices: [
        {
          text: "🎯 记下消息，留意城西动向",
          apply: function (st) {
            if (st.flags) st.flags._socialGrapevineRumorDone = true;
            // 标记：后续投资事件可消费此 flag 解锁"城西投资"选项
            if (st.flags) st.flags._westCityIntel = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "人脉就是信息。你记下了城西的消息，准备留心观察。智力+2，心智+3。",
                "good"
              );
          },
        },
        {
          text: "🤝 享受朋友相聚的时光，不谈正事",
          apply: function (st) {
            if (st.flags) st.flags._socialGrapevineRumorDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 1);
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "朋友相聚，不谈利益只谈感情——这才是真正的人情味。魅力+1，心智+4，心情+5。",
                "good"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== D→A 人情往来·礼物交换 =====
    // 设计意图：当玩家与某个NPC好感达到较高水平时，NPC会回赠礼物，
    //   让玩家感受到"人情往来"的社交温度——关系不只是消耗，也有回报。
    {
      id: "npc_reciprocal_gift",
      title: "一份回礼，暖了心",
      desc: "你平时对朋友们的关照，有人默默记在心里。\n\n今天见面，对方塞给你一个袋子：'上次你帮了我那么大忙，一直想谢谢你。这个你拿着，别推辞。'\n\n袋子里装着一份实用的礼物——在这个城市里，还有人惦记着你的好，这比什么都值钱。",
      phase: "street",
      triggers: { minDay: 45 },
      conditions: function (st) {
        if (!st || !st.player || !st.relationships || !st.flags) return false;
        if (st.flags._npcReciprocalGiftDone) return false;
        // 至少1个好感≥70的NPC
        var bestId = topAffinityNpcR166(st);
        if (!bestId) return false;
        var r = st.relationships[bestId];
        if (!r || (r.affinity || 0) < 70) return false;
        return true;
      },
      choices: [
        {
          text: "🎁 收下礼物，心里暖暖的",
          apply: function (st) {
            if (st.flags) st.flags._npcReciprocalGiftDone = true;
            // 给最高好感NPC加好感
            var bestId = topAffinityNpcR166(st);
            if (bestId) safeAffinityR166(st, bestId, 3, "回礼互动");
            // 给玩家加心情和属性
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
              st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            // 随机给一点现金或物品
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 500;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "有人惦记着你的好，是这个城市最温暖的礼物。道德+2，心智+5，心情+5，收到¥500回礼。",
                "success"
              );
          },
        },
        {
          text: "🙏 婉拒，说'朋友之间不用这么客气'",
          apply: function (st) {
            if (st.flags) st.flags._npcReciprocalGiftDone = true;
            var bestId = topAffinityNpcR166(st);
            if (bestId) safeAffinityR166(st, bestId, 5, "婉拒礼物但人情更重");
            if (st.player) {
              st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "真正的朋友，不在一时礼物的轻重。你婉拒了礼物，但这份情谊更重了。道德+5，心智+3。",
                "good"
              );
          },
        },
      ],
      probability: 0.04,
    },
  ];

  // 注册到 RANDOM_EVENTS
  for (var i = 0; i < D_EVENTS.length; i++) {
    var evt = D_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions) evt.conditions = function () { return false; };
    RANDOM_EVENTS.push(evt);
  }
})();
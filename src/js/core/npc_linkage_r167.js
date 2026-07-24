/*
 * 城市浮生记 — 域D（NPC/社交）联动增强 · R167
 * 全系统优化 loop R167 · 联动增强 3项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._npcLinkageR167) return;
  RANDOM_EVENTS._npcLinkageR167 = true;

  // ---- 本地助手 ----

  // 安全改好感
  function safeAffinityR167(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域D R167联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 获取已结识NPC数量
  function metNpcCountR167(st) {
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      if (st.relationships[id] && st.relationships[id].met) count++;
    }
    return count;
  }

  // 获取好感最高的已结识NPC
  function pickClosestNpcR167(st, minAff) {
    minAff = minAff || 0;
    if (!st || !st.relationships) return null;
    var best = null, bestAff = minAff;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) > bestAff) {
        best = id; bestAff = r.affinity || 0;
      }
    }
    // [全系统自洽修复] 域D 修复:返回捕获的最高好感NPC id(best),
    // 原写 id 为 for...in 尾次迭代变量,导致 safeAffinityR167(st,best.id,...) 把好感+5加错NPC
    return best ? { id: best, affinity: bestAff } : null;
  }

  // ---- 联动事件 ----

  var D_EVENTS = [

    // ===== 联动1: D→A NPC好感影响商贩定价 =====
    // 设计意图：当玩家与某NPC好感度高时，该NPC作为商贩给予价格优惠，
    //   让社交关系直接产生经济收益，激励玩家经营NPC关系。
    {
      id: "npc_friend_price_discount",
      title: "老熟人价",
      desc: "你在市场买东西时，一位相熟的商贩悄悄给你打了折——'都是老熟人了，少收你点。'",
      phase: "street",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.player || !st.relationships || !st.flags) return false;
        if (st.flags._npcFriendPriceDiscountDone) return false;
        // 至少有一个已结识且好感≥50的NPC
        if (metNpcCountR167(st) < 1) return false;
        var hasHighAffNpc = false;
        for (var id in st.relationships) {
          if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
          var r = st.relationships[id];
          if (r && r.met && (r.affinity || 0) >= 50) {
            hasHighAffNpc = true;
            break;
          }
        }
        if (!hasHighAffNpc) return false;
        // 有一定交易基础
        var trade = st.trade || {};
        if ((trade.totalBuys || 0) + (trade.totalSells || 0) < 10) return false;
        return true;
      },
      choices: [
        {
          text: "😊 谢过老熟人，记下这份情",
          apply: function (st) {
            if (st.flags) st.flags._npcFriendPriceDiscountDone = true;
            // 给好感最高的NPC加好感
            var best = pickClosestNpcR167(st, 50);
            if (best) safeAffinityR167(st, best.id, 3, "老熟人价人情");
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            // 标记：后续交易事件可消费此 flag 解锁折扣选项
            if (st.flags) st.flags._npcPriceDiscountActive = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "老熟人给你打了折——在这个城市里，认识人就是好处。心智+3。",
                "good"
              );
          },
        },
        {
          text: "🧾 按市场价付，不欠人情",
          apply: function (st) {
            if (st.flags) st.flags._npcFriendPriceDiscountDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你坚持按市场价付款——骨气虽好，但有时候人情也是一种财富。",
                "info"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动2: D→B NPC生日分层叙事 =====
    // 设计意图：当玩家已结识NPC数量多时，触发"同一天多个NPC生日"的忙碌社交日，
    //   让社交关系产生叙事张力，体现"朋友多了都要顾"的现实感。
    {
      id: "npc_birthday_busy_day",
      title: "忙碌的生日周",
      desc: "这周已经有三个朋友过生日了——你开始感受到，朋友多了不只是热闹，也是一笔不小的开销。",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player || !st.relationships || !st.flags) return false;
        if (st.flags._npcBirthdayBusyDayDone) return false;
        // 至少结识3个NPC
        if (metNpcCountR167(st) < 3) return false;
        // 至少2个NPC好感≥30
        var closeCount = 0;
        for (var id in st.relationships) {
          if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
          var r = st.relationships[id];
          if (r && r.met && (r.affinity || 0) >= 30) closeCount++;
        }
        if (closeCount < 2) return false;
        return true;
      },
      choices: [
        {
          text: "🎁 精打细算，每份礼物都用心",
          apply: function (st) {
            if (st.flags) st.flags._npcBirthdayBusyDayDone = true;
            // 花费¥300给朋友们买礼物
            var cost = 300;
            if ((st.resources && (st.resources.cash || 0)) >= cost) {
              if (st.resources) st.resources.cash = (st.resources.cash || 0) - cost;
              // 给所有好感≥30的NPC加好感
              if (st.relationships) {
                for (var id in st.relationships) {
                  if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
                  var r = st.relationships[id];
                  if (r && r.met && (r.affinity || 0) >= 30) {
                    safeAffinityR167(st, id, 3, "生日礼物");
                  }
                }
              }
              if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
              if (typeof StateManager !== "undefined" && StateManager.addMessage)
                StateManager.addMessage(
                  "你花了¥300给朋友们买了礼物——虽然钱包瘦了，但心里暖洋洋的。全好友好感+3，心智+5。",
                  "good"
                );
            } else {
              if (typeof StateManager !== "undefined" && StateManager.addMessage)
                StateManager.addMessage(
                  "你想给朋友们买礼物，但手头现金不足¥300。心意到了就好。",
                  "warning"
                );
            }
          },
        },
        {
          text: "💌 发个祝福消息就好",
          apply: function (st) {
            if (st.flags) st.flags._npcBirthdayBusyDayDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你给朋友们发了祝福消息——礼轻情意重。心智+2。",
                "info"
              );
          },
        },
      ],
      probability: 0.03,
    },

    // ===== 联动3: D→G NPC社交支持缓冲心情低落 =====
    // 设计意图：当玩家心情低落时，已结识NPC主动关心，
    //   让社交关系成为情绪缓冲，体现"朋友是最大财富"的设计理念。
    {
      id: "npc_social_mood_buffer",
      title: "朋友的一个电话",
      desc: "你心情低落的时候，一个朋友打来电话约你出去走走。有时候，一句话就能让人重新振作。",
      phase: "street",
      triggers: { minDay: 45 },
      conditions: function (st) {
        if (!st || !st.player || !st.relationships || !st.flags) return false;
        if (st.flags._npcSocialMoodBufferDone) return false;
        // 心情低落（mental<35）
        var mental = st.player.mental || 50;
        if (mental >= 35) return false;
        // 至少有一个已结识且好感≥40的NPC
        var hasCloseFriend = false;
        for (var id in st.relationships) {
          if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
          var r = st.relationships[id];
          if (r && r.met && (r.affinity || 0) >= 40) {
            hasCloseFriend = true;
            break;
          }
        }
        if (!hasCloseFriend) return false;
        return true;
      },
      choices: [
        {
          text: "🚶 出去走走，和朋友聊聊",
          apply: function (st) {
            if (st.flags) st.flags._npcSocialMoodBufferDone = true;
            // 恢复心情
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 30) + 12);
              // [全系统自洽修复] 域D 修复:st.player.happiness 是死字段(全库仅写入、无任何渲染读取),
              // 真实幸福感字段为 st.needs.happiness——原写 player.happiness 致"心情+8"被静默丢弃。
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            }
            // 给好感最高的NPC加好感
            var best = pickClosestNpcR167(st, 40);
            if (best) safeAffinityR167(st, best.id, 5, "低谷时的陪伴");
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "和朋友聊完之后，你觉得世界没那么糟了。心智+12，心情+8。",
                "good"
              );
          },
        },
        {
          text: "😶 婉拒，想一个人静静",
          apply: function (st) {
            if (st.flags) st.flags._npcSocialMoodBufferDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 30) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你选择独处——有时候人需要时间自己消化情绪。心智+4。",
                "info"
              );
          },
        },
      ],
      probability: 0.05,
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

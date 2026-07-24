/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强 · R183
 * 全系统优化 loop R183 · 联动增强 2项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR183) return;
  RANDOM_EVENTS._domainALinkageR183 = true;

  // ---- 本地助手 ----

  function netWorthR183(st) {
    if (!st || !st.resources) return 0;
    return (st.resources.cash || 0) + (st.resources.bankBalance || 0);
  }

  function metNpcsR183(st) {
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      if (st.relationships[id] && st.relationships[id].met) count++;
    }
    return count;
  }

  function safeAffinityR183(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域A R183联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 检查某地点是否有极端供需
  function hasExtremeSupplyDemandR183(st) {
    if (!st || !st.trade || !st.trade.supplyDemand) return null;
    var extremes = [];
    for (var locKey in st.trade.supplyDemand) {
      if (!Object.prototype.hasOwnProperty.call(st.trade.supplyDemand, locKey)) continue;
      var locSD = st.trade.supplyDemand[locKey];
      for (var goodId in locSD) {
        if (!Object.prototype.hasOwnProperty.call(locSD, goodId)) continue;
        var val = locSD[goodId];
        if (val >= 40) {
          extremes.push({ locKey: locKey, goodId: goodId, direction: "buy", value: val });
        } else if (val <= -40) {
          extremes.push({ locKey: locKey, goodId: goodId, direction: "sell", value: val });
        }
      }
    }
    return extremes.length > 0 ? extremes[0] : null;
  }

  // 检查是否有活跃市场事件
  function getActiveMarketEventR183(st) {
    if (!st || !st.trade || !st.trade.marketEvents) return null;
    if (st.trade.marketEvents.length === 0) return null;
    // 返回第一个有描述的市场事件
    for (var i = 0; i < st.trade.marketEvents.length; i++) {
      var evt = st.trade.marketEvents[i];
      if (evt && evt.name && evt.desc && evt.remaining > 0) {
        return evt;
      }
    }
    return null;
  }

  // 获取地点中文名
  function locNameR183(locKey) {
    if (typeof getLocation === "function") {
      var loc = getLocation(locKey);
      if (loc && loc.name) return loc.name;
    }
    return locKey;
  }

  // 获取商品中文名
  function goodNameR183(goodId) {
    if (typeof getGoodById === "function") {
      var g = getGoodById(goodId);
      if (g && g.name) return g.name;
    }
    return goodId;
  }

  // 获取NPC中文名
  function npcNameR183(npcId) {
    if (typeof getNpcById === "function") {
      var n = getNpcById(npcId);
      if (n && n.name) return n.name;
    }
    return npcId;
  }

  var A_EVENTS = [

    // ===== 联动1: A→B 极端供需叙事事件 =====
    // 设计意图：当玩家在某地大量买卖导致供需指数极端时，触发叙事事件，
    //   让玩家感受到自己的交易行为对市场产生了影响，增强代入感。
    {
      id: "extreme_supply_demand_news",
      title: "市场异动",
      desc: "你频繁的交易活动引起了市场上的注意，商贩们开始议论纷纷。",
      phase: "street",
      triggers: { minDay: 5 },
      conditions: function (st) {
        if (!st || !st.flags || !st.trade) return false;
        if (st.flags._extremeSupplyDemandSeen) return false;
        var extreme = hasExtremeSupplyDemandR183(st);
        if (!extreme) return false;
        // 缓存极值信息供 choices 使用
        st.flags._extremeSDCache = extreme;
        return true;
      },
      choices: [
        {
          text: "📢 打听一下详情",
          apply: function (st) {
            if (!st || !st.flags) return;
            st.flags._extremeSupplyDemandSeen = true;
            var cache = st.flags._extremeSDCache;
            if (cache) {
              var locName = locNameR183(cache.locKey);
              var goodName = goodNameR183(cache.goodId);
              var direction = cache.direction === "buy" ? "抢购" : "抛售";
              if (typeof StateManager !== "undefined" && StateManager.addMessage) {
                StateManager.addMessage(
                  "📰 市场传闻：" + locName + "出现" + direction + "潮，" +
                  goodName + "价格大幅波动。商贩们说最近有个神秘买家/卖家在频繁交易。",
                  "event"
                );
              }
              // 销售技能微量增长
              if (st.skills && st.skills.sales) {
                st.skills.sales.xp = (st.skills.sales.xp || 0) + 15;
              }
              // 智力微量增长（了解市场规律）
              if (st.player) {
                st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
              }
            }
          },
        },
        {
          text: "🙈 低调行事，不管了",
          apply: function (st) {
            if (!st || !st.flags) return;
            st.flags._extremeSupplyDemandSeen = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("你决定低调行事，避免引起更多注意。", "info");
            }
          },
        },
      ],
    },

    // ===== 联动2: A→D NPC市场行情评论 =====
    // 设计意图：当市场事件活跃时，NPC会主动向玩家提及当前行情，
    //   让市场事件产生社交反馈，增强世界活力感。
    {
      id: "npc_market_comment",
      title: "NPC的行情提醒",
      desc: "一位认识的熟人向你提起了最近的行情变化。",
      phase: "street",
      triggers: { minDay: 3 },
      conditions: function (st) {
        if (!st || !st.flags || !st.trade) return false;
        if (st.flags._npcMarketCommentSeen) return false;
        // 需要至少认识一个NPC
        if (metNpcsR183(st) < 1) return false;
        // 需要有活跃的市场事件
        var evt = getActiveMarketEventR183(st);
        if (!evt) return false;
        // 缓存事件信息
        st.flags._activeMarketEventCache = evt;
        return true;
      },
      choices: [
        {
          text: "👂 认真听他说完",
          apply: function (st) {
            if (!st || !st.flags) return;
            st.flags._npcMarketCommentSeen = true;
            var evt = st.flags._activeMarketEventCache;
            if (evt) {
              if (typeof StateManager !== "undefined" && StateManager.addMessage) {
                StateManager.addMessage(
                  "💬 " + evt.name + "：" + evt.desc + "（还剩" + evt.remaining + "天）",
                  "event"
                );
              }
              // 随机选一个已结识的NPC提升好感
              if (st.relationships) {
                var npcIds = Object.keys(st.relationships);
                var metIds = [];
                for (var i = 0; i < npcIds.length; i++) {
                  if (st.relationships[npcIds[i]] && st.relationships[npcIds[i]].met) {
                    metIds.push(npcIds[i]);
                  }
                }
                if (metIds.length > 0) {
                  var chosenNpc = metIds[Random.int(0, metIds.length - 1)]; // [全系统自洽修复] 域A A类: Math.random→Random.int 种子化RNG
                  safeAffinityR183(st, chosenNpc, 2, "NPC市场行情分享");
                }
              }
              // 销售技能增长
              if (st.skills && st.skills.sales) {
                st.skills.sales.xp = (st.skills.sales.xp || 0) + 10;
              }
            }
          },
        },
        {
          text: "😐 敷衍几句走开",
          apply: function (st) {
            if (!st || !st.flags) return;
            st.flags._npcMarketCommentSeen = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("你心不在焉地应付了几句，对方似乎有点失望。", "info");
            }
          },
        },
      ],
    },
  ];

  // 注册到 RANDOM_EVENTS
  for (var i = 0; i < A_EVENTS.length; i++) {
    RANDOM_EVENTS.push(A_EVENTS[i]);
  }
})();
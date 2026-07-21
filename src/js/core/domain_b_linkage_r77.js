/*
 * 城市浮生记 — 域B（事件/叙事）联动增强 · R77
 * 全系统优化 loop R77 · 联动增强 2项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR77) return;
  RANDOM_EVENTS._domainBLinkageR77 = true;

  // ---- 本地助手 ----

  // 安全改好感
  function safeAffinityR77(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域B R77联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  var B_EVENTS = [
    // ===== 联动1: B→D 住所升级NPC反应 =====
    // 设计意图：住所升级是重要里程碑，已结识NPC（尤其是同地点邻居）应给出反应。
    //   连接住房系统(housing.tier)与社交系统(relationships)，让NPC对玩家的生活变化有感知。
    {
      id: "housing_upgrade_npc_reaction",
      title: "乔迁之喜",
      desc: "你搬进新房子的消息不知怎么传开了。老邻居们各有各的反应。",
      phase: "street",
      triggers: { minDay: 20 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags || !st.relationships) return false;
        if (st.flags._housingUpgradeReactionDone) return false;
        // 住所tier≥2（单间及以上）
        if (!st.housing || st.housing.tier < 2) return false;
        // 至少1个已结识NPC
        var hasMet = false;
        for (var id in st.relationships) {
          if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
          if (st.relationships[id] && st.relationships[id].met === true) {
            hasMet = true;
            break;
          }
        }
        return hasMet;
      },
      choices: [
        {
          text: "🏠 邀请老朋友来新家坐坐",
          apply: function (st) {
            if (st.flags) st.flags._housingUpgradeReactionDone = true;
            // 随机选一个已结识NPC好感+4
            if (st.relationships) {
              var best = null, bestAff = 0;
              for (var id in st.relationships) {
                if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
                var r = st.relationships[id];
                if (r && r.met === true && (r.affinity || 0) > bestAff) {
                  best = id; bestAff = r.affinity || 0;
                }
              }
              if (best) safeAffinityR77(st, best, 4, "乔迁邀请");
            }
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("老友来新家坐了一晚，聊到很晚。心情+8。", "good");
          },
        },
        {
          text: "🤫 低调搬家，不声张",
          apply: function (st) {
            if (st.flags) st.flags._housingUpgradeReactionDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("你低调搬了家。不打扰别人，自己清净。心智+3。", "hint");
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动2: B→A 持有商品价格暴跌叙事 =====
    // 设计意图：玩家持有商品时，若该商品价格暴跌（市场事件或供需失衡），
    //   触发损失厌恶叙事。连接交易系统(goodsPrices)与事件系统，让玩家感受市场波动的情绪冲击。
    {
      id: "trade_portfolio_loss_narrative",
      title: "市场的冷水",
      desc: "你打开手机查看行情，发现你持有的商品价格在短时间内暴跌。那些压了本的货，现在卖出去就要亏钱。",
      phase: "street",
      triggers: { minDay: 25 },
      conditions: function (st) {
        if (!st || !st.player || !st.inventory || !st.trade || !st.flags) return false;
        if (st.flags._tradePortfolioLossSeen) return false;
        if (!st.inventory.items || !st.inventory.items.length) return false;
        if (typeof getGoodById !== "function") return false;
        // 检查是否有持有商品的价格相对买入价跌超25%
        for (var i = 0; i < st.inventory.items.length; i++) {
          var item = st.inventory.items[i];
          if (!item || !item.id || !item.avgBuyPrice) continue;
          var good = getGoodById(item.id);
          if (!good) continue;
          var currentPrice = st.trade.currentLocation ?
            (st.trade.goodsPrices[st.trade.currentLocation] &&
             st.trade.goodsPrices[st.trade.currentLocation][item.id]) || good.basePrice :
            good.basePrice;
          // 当前价格相对买入价跌超25%
          if (item.avgBuyPrice > 0 && currentPrice < item.avgBuyPrice * 0.75) {
            return true;
          }
        }
        return false;
      },
      choices: [
        {
          text: "😤 割肉卖出，认亏离场",
          apply: function (st) {
            if (st.flags) st.flags._tradePortfolioLossSeen = true;
            if (st.player) {
              st.player.mental = Math.max(0, (st.player.mental || 50) - 3);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("你忍痛割肉。亏了钱，但学到了教训：及时止损。智力+1，心智-3。", "warning");
          },
        },
        {
          text: "😤 死扛不放，等价格回升",
          apply: function (st) {
            if (st.flags) st.flags._tradePortfolioLossSeen = true;
            if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("你决定死扛。每天看着账户里的浮亏，心里不是滋味。心智-5。", "warning");
          },
        },
        {
          text: "🧘 冷静分析，研究市场供需",
          apply: function (st) {
            if (st.flags) st.flags._tradePortfolioLossSeen = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("你冷静分析了市场供需。价格有跌有涨，关键看供需。智力+2，心智+1。", "good");
          },
        },
      ],
      probability: 0.05,
    },
  ];

  // 注册到 RANDOM_EVENTS
  for (var i = 0; i < B_EVENTS.length; i++) {
    var evt = B_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions) evt.conditions = function () { return false; };
    RANDOM_EVENTS.push(evt);
  }
})();

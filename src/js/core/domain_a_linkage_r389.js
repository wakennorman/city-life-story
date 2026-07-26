/**
 * 域A(数据/数值平衡) 联动增强 R389
 * 背景：域A 经 R14/R22/R189/R197/R242/R245/R248/R251/R258/R267/R277/R280/R288/R296/
 *   R304/R313/R321/R331/R339/R347/R355/R363/R371/R379 多轮加固后 A类净尽。
 * 本轮聚焦3个历轮未覆盖的数据→叙事桥接：
 *   A→F a389_price_tag_insight  价格标签洞察 → 消费 getPriceAlertData+calcFinalPrice,
 *     把抽象价格数字转化为"贵了/便宜了"的UI提示,mental+happiness
 *   A→D a389_friend_price        熟人价 → 消费 getNpcTradeAdvice(全库零事件消费),
 *     高好感NPC给你留好货/讲行市,严守域D rel.met 铁律
 *   A→G a389_health_spending     健康消费闭环 → 消费 status.health+needs 数据,
 *     健康下滑时触发"该花钱买药/维生素"的消费觉醒
 *
 * 严格照 domain_a_linkage_r248.js / r251.js 已验证IIFE注入范式。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR389Loaded) return;
  RANDOM_EVENTS._domainALinkageR389Loaded = true;

  // 安全读取技能等级
  function skillLv(st, key) {
    if (!st || !st.skills || !st.skills[key]) return 0;
    return st.skills[key].level || 0;
  }

  // 取首个已结识(met)的NPC id——守met铁律
  function firstMetNpcR389(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met) return id;
    }
    return null;
  }

  // 安全NPC中文名
  function npcNameR389(st, npcId) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(npcId) || npcId; } catch (e) { /* safe */ }
    }
    return npcId;
  }

  // 安全增加好感(守域D铁律)
  function bumpAffinityR389(st, npcId, delta) {
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, delta); } catch (e) { /* safe */ }
    }
  }

  // 安全地点中文名
  function locNameR389(locKey) {
    if (typeof getLocation === "function") {
      try { var l = getLocation(locKey); if (l && l.name) return l.name; } catch (e) { /* safe */ }
    }
    return locKey;
  }

  var EVENTS = [
    {
      // A→F: 价格标签洞察 — 消费 getPriceAlertData + calcFinalPrice
      id: "a389_price_tag_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "🏷️",
      title: "价格标签洞察",
      story:
        "你在市场闲逛时留心比较了几种常买商品的价格，发现{goodName}当前{priceInsight}。",
      triggers: { minDay: 20, excludeFlags: ["_a389PriceTagCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources || st.resources.cash < 30) return false;
        if (!st.trade || !st.trade.currentLocation) return false;
        // 需要销售技能≥5才能培养出价格敏感
        if (skillLv(st, "sales") < 5) return false;
        return true;
      },
      choices: [
        {
          text: "📊 记住这个价格锚点",
          hint: "心智+3,置 _a389PriceTagCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a389PriceTagCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📊 你记下了今天的价格锚点——下次买卖时一眼就能看出贵贱。心智+3。", "success");
          }
        },
        {
          text: "🤷 无所谓,该买就买",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      // 动态文本：找到价格偏离最大的商品
      text: function (st) {
        if (!st || !st.trade || typeof calcFinalPrice !== "function") return null;
        var loc = st.trade.currentLocation;
        var bestGood = null, bestRatio = 1, bestPrice = 0;
        if (typeof GOODS !== "undefined") {
          for (var i = 0; i < GOODS.length; i++) {
            var g = GOODS[i];
            if (g.isIngredient) continue;
            try {
              var p = calcFinalPrice(st, loc, g.id);
              if (!isFinite(p) || p <= 0) continue;
              var ratio = p / (g.basePrice || 1);
              if (Math.abs(ratio - 1) > Math.abs(bestRatio - 1)) {
                bestRatio = ratio; bestGood = g; bestPrice = p;
              }
            } catch (e) { /* skip */ }
          }
        }
        if (!bestGood) return null;
        var insight = bestRatio > 1.3 ? "太贵了(比均价高" + Math.round((bestRatio - 1) * 100) + "%)"
          : bestRatio < 0.7 ? "很便宜(比均价低" + Math.round((1 - bestRatio) * 100) + "%)"
          : "价格合理";
        return "你在市场闲逛时留心比较了几种常买商品的价格，发现" + bestGood.name + "(¥" + bestPrice.toFixed(1) + "/" + (bestGood.unit || "件") + ")当前" + insight + "。";
      }
    },
    {
      // A→D: 熟人价 — 消费 getNpcTradeAdvice(全库零事件消费者)
      id: "a389_friend_price",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "熟人价",
      story:
        "{npcName}悄悄跟你说：'{goodName}去{buyLoc}买更划算，我认识那边的老板，给你留一批好的。'",
      triggers: { minDay: 40, excludeFlags: ["_a389FriendPriceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        // 需要至少1个已结识NPC且好感≥40
        var hasFriend = false;
        for (var k in st.relationships) {
          var r = st.relationships[k];
          if (r && r.met && (r.favor || 0) >= 40) { hasFriend = true; break; }
        }
        if (!hasFriend) return false;
        // 需要交易系统已启用
        if (!st.trade || !st.trade.currentLocation) return false;
        return true;
      },
      choices: [
        {
          text: "🙏 谢了兄弟,这就去看看",
          hint: "好感+4,sales XP+2,置 _a389FriendPriceCooldown(60天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a389FriendPriceCooldown = true;
            var npc = firstMetNpcR389(st);
            if (npc) bumpAffinityR389(st, npc, 4);
            if (typeof addSkillXp === "function") {
              try { addSkillXp("sales", 2); } catch(e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🙏 熟人给的内行价让你省了不少钱。好感+4,销售XP+2。", "success");
          }
        },
        {
          text: "😊 心领了,我自己转转",
          hint: "好感+1",
          apply: function (st) {
            var npc = firstMetNpcR389(st);
            if (npc) bumpAffinityR389(st, npc, 1);
          }
        }
      ],
      // 动态文本：借用 getNpcTradeAdvice 获取NPC建议
      text: function (st) {
        if (!st || typeof getNpcTradeAdvice !== "function") return null;
        // 取一个常见商品让NPC给建议
        var sampleGoods = ["vegetables", "fruits", "rice", "water", "snacks"];
        var advice = null;
        for (var i = 0; i < sampleGoods.length; i++) {
          try {
            advice = getNpcTradeAdvice(st, sampleGoods[i]);
            if (advice && advice.buyLoc) break;
          } catch (e) { /* skip */ }
        }
        var npc = firstMetNpcR389(st);
        if (!npc) return null;
        var npcN = npcNameR389(st, npc);
        if (advice && advice.buyLoc) {
          var gn = "蔬菜";
          if (typeof getGoodById === "function") {
            var gg = getGoodById(advice.goodId);
            if (gg) gn = gg.name;
          }
          return npcN + "悄悄跟你说：'" + gn + "去" + (advice.buyLocName || locNameR389(advice.buyLoc)) + "买更划算，我认识那边的老板，给你留一批好的。'";
        }
        return npcN + "悄悄跟你说：'最近行情波动大，买东西多比几家，别被宰了。'";
      }
    },
    {
      // A→G: 健康消费闭环 — 消费 status.health + needs 数据触发消费觉醒
      id: "a389_health_spending",
      phase: "street",
      _isChainEvent: false,
      icon: "💊",
      title: "健康消费觉醒",
      story:
        "最近总觉得身体有点不对劲——{healthComplaint}。是该花点钱买点{healthGood}补补了。",
      triggers: { minDay: 25, excludeFlags: ["_a389HealthSpendCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player) return false;
        // 健康偏低但未到危境(30~65之间触发最合适)
        var health = (st.status && isFinite(st.status.health)) ? st.status.health : 100;
        if (health < 30 || health > 65) return false;
        // 需要有一定现金
        if (!st.resources || st.resources.cash < 50) return false;
        return true;
      },
      choices: [
        {
          text: "💊 走,去药店买点补药",
          hint: "心智+2,置 _healthSpendingAwareness,置 _a389HealthSpendCooldown(45天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a389HealthSpendCooldown = true;
            st.flags._healthSpendingAwareness = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            // 象征性花费少量现金买药
            if (st.resources) {
              var cost = 30;
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💊 你花了¥30买了点维生素和健康补品。身体是革命的本钱,这钱花得值。心智+2。", "success");
          }
        },
        {
          text: "😤 扛一扛就过去了",
          hint: "无花费",
          apply: function (st) {
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😤 你觉得扛一扛就过去了,但身体发出的信号不应忽视。", "warning");
          }
        }
      ],
      // 动态文本：根据健康值和需求生成具体抱怨
      text: function (st) {
        if (!st || !st.player) return null;
        var health = (st.status && isFinite(st.status.health)) ? st.status.health : 100;
        var complaint = "浑身没劲";
        if (st.needs) {
          if ((st.needs.fatigue || 0) > 70) complaint = "累得慌,干啥都提不起劲";
          else if ((st.needs.hunger || 0) > 60) complaint = "吃啥都没胃口,脸色不太好";
          else if ((st.needs.happiness || 0) < 30) complaint = "整个人都不在状态,心烦意乱";
        }
        var good = "维生素片";
        if (health < 45) good = "感冒药和补体保健品";
        else if (health < 55) good = "维生素和营养补品";
        return "最近总觉得身体有点不对劲——" + complaint + "。是该花点钱买点" + good + "补补了。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();

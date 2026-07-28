/**
 * 域A(数据/数值平衡) 联动增强 R624
 * 桥接：
 *   A→G  a624_food_health_awareness  食材健康自觉 → 消费 state.ingredients+state.needs 数据,
 *     数据→"吃得健康"的生命回响
 *   A→C  a624_skill_market_value  技能市场价值 → 消费 state.skills+state.jobs 数据,
 *     数据→"技能值多少钱"的职业回响
 *   A→F  a624_price_alert_ui  价格预警UI → 消费 state.trade+state.goods 数据,
 *     数据→"价格异动"的UI回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR624Loaded) return;
  RANDOM_EVENTS._domainALinkageR624Loaded = true;

  // 辅助：获取食材健康评分
  function _foodHealthScoreR624(ingredientId) {
    if (typeof INGREDIENTS === "undefined" || !INGREDIENTS) return 0;
    for (var i = 0; i < INGREDIENTS.length; i++) {
      if (INGREDIENTS[i] && INGREDIENTS[i].id === ingredientId) {
        var eff = INGREDIENTS[i].effects || {};
        // 健康食材 = 加健康/心智的，减体制/卫生的
        var score = 0;
        if (eff.health > 0) score += eff.health;
        if (eff.mental > 0) score += eff.mental * 0.5;
        if (eff.fatigue > 0) score -= eff.fatigue * 0.3;
        if (eff.hygiene < 0) score += Math.abs(eff.hygiene) * 0.2;
        return score;
      }
    }
    return 0;
  }

  // 辅助：获取技能市场需求度
  function _skillDemandR624(skillId) {
    if (typeof getSkillMarketValue === "function") {
      return getSkillMarketValue(skillId);
    }
    return 0;
  }

  var EVENTS = [
    // ================================================================
    // A→G: 食材健康自觉 — 基于食材数据分析饮食健康
    // ================================================================
    {
      id: "a624_food_health_awareness",
      phase: "street",
      _isChainEvent: false,
      icon: "🥗",
      title: "饮食健康分析",
      triggers: { minDay: 5 },
      story: function (st) {
        var inventory = st.inventory || [];
        var foodItems = [];
        for (var i = 0; i < inventory.length; i++) {
          var inv = inventory[i];
          if (inv && inv.id && typeof INGREDIENTS !== "undefined") {
            for (var j = 0; j < INGREDIENTS.length; j++) {
              if (INGREDIENTS[j] && INGREDIENTS[j].id === inv.id) {
                foodItems.push(INGREDIENTS[j]);
                break;
              }
            }
          }
        }

        if (foodItems.length === 0) {
          return "你身上没有食材。去市场买些新鲜食材，自己做饭比外卖更健康省钱。";
        }

        var healthyCount = 0;
        var unhealthyCount = 0;
        for (var fi = 0; fi < foodItems.length; fi++) {
          var score = _foodHealthScoreR624(foodItems[fi].id);
          if (score >= 3) healthyCount++;
          else if (score <= -1) unhealthyCount++;
        }

        var total = foodItems.length;
        if (healthyCount > unhealthyCount && healthyCount >= total * 0.5) {
          return "你背包里的食材整体比较健康（" + healthyCount + "/" + total + "份健康食材）。" +
            "多吃蔬菜水果、少吃油炸食品，长期来看对体质和心智都有好处。";
        } else if (unhealthyCount > healthyCount) {
          return "你背包里不太健康的食材偏多（" + unhealthyCount + "/" + total + "份）。" +
            "偶尔吃吃没问题，但长期依赖高油高盐食物会影响健康和心情。";
        }
        return "你背包里的食材营养搭配还算均衡。注意多吃不同种类的食物，保证营养全面。";
      },
      choices: [
        { text: "🍎 去市场买食材", next: null, handler: function(st) {
          if (typeof showLocationNavModal === "function") {
            showLocationNavModal("commercialDist", "🏪 去市场买菜", "trade");
          } else {
            StateManager.addMessage("🍎 前往商业区购买食材", "info");
          }
        }},
        { text: "🍳 做顿饭", next: null, handler: function(st) {
          if (st.needs) {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            st.needs.fullness = Math.min(100, (st.needs.fullness || 50) + 15);
          }
          StateManager.addMessage("🍳 给自己做了一顿热乎饭，心情+3，饱食+15", "success");
        }},
      ],
      conditions: function (st) {
        return st.inventory && st.inventory.length > 0;
      },
      weight: 1,
    },

    // ================================================================
    // A→C: 技能市场价值 — 基于市场需求分析技能价值
    // ================================================================
    {
      id: "a624_skill_market_value",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "技能市场价值分析",
      triggers: { minDay: 10 },
      story: function (st) {
        var skills = st.skills || {};
        var skillList = [];
        for (var sk in skills) {
          if (skills[sk] && typeof skills[sk].level === "number") {
            var demand = _skillDemandR624(sk);
            skillList.push({
              id: sk,
              level: skills[sk].level,
              demand: demand,
              name: (typeof getSkillChineseName === "function") ? getSkillChineseName(sk) : sk,
            });
          }
        }

        if (skillList.length === 0) {
          return "你还没有学习任何技能。去培训中心或通过工作实践来提升技能吧。";
        }

        // 按市场需求排序
        skillList.sort(function(a, b) { return b.demand - a.demand; });
        var top = skillList.slice(0, 3);
        var parts = top.map(function(s) {
          var demandLabel = s.demand >= 3 ? "🔥高需求" : s.demand >= 2 ? "📈中等" : s.demand >= 1 ? "📋低需求" : "❓无需求";
          return s.name + " Lv." + s.level + " (" + demandLabel + ")";
        });

        var totalSkills = skillList.length;
        var highDemand = skillList.filter(function(s) { return s.demand >= 2; }).length;

        return "根据当前市场分析，你的技能价值评估如下：<br>" +
          top.map(function(s) {
            var demandLabel = s.demand >= 3 ? "🔥" : s.demand >= 2 ? "📈" : s.demand >= 1 ? "📋" : "❓";
            return demandLabel + " " + s.name + " Lv." + s.level;
          }).join("<br>") +
          "<br>共" + totalSkills + "项技能，" + highDemand + "项市场需求中等以上。" +
          (highDemand < 2 ? "建议优先提升市场需求高的技能，以获得更好的职业发展。" : "你的技能组合不错，继续提升可以争取更高薪资。");
      },
      choices: [
        { text: "🎓 去培训中心", next: null, handler: function(st) {
          if (typeof showLocationNavModal === "function") {
            showLocationNavModal("trainingCenter", "🎓 培训中心", "actions");
          } else {
            StateManager.addMessage("🎓 前往培训中心提升技能", "info");
          }
        }},
        { text: "💼 查看相关工作", next: null, handler: function(st) {
          if (typeof switchCareerSubTab === "function") {
            switchCareerSubTab("career_jobs");
          }
          StateManager.addMessage("💼 查看当前技能匹配的职业方向", "info");
        }},
      ],
      conditions: function (st) {
        var skills = st.skills || {};
        var count = 0;
        for (var k in skills) {
          if (skills[k] && skills[k].level > 0) count++;
        }
        return count >= 2;
      },
      weight: 1,
    },

    // ================================================================
    // A→F: 价格预警UI — 商品价格异动提醒
    // ================================================================
    {
      id: "a624_price_alert_ui",
      phase: "street",
      _isChainEvent: false,
      icon: "🏷️",
      title: "价格异动提醒",
      triggers: { minDay: 3 },
      story: function (st) {
        var trade = st.trade || {};
        var location = trade.currentLocation || "commercialDist";
        var goods = (typeof GOODS !== "undefined" && GOODS) ? GOODS : [];
        var alerts = [];

        for (var gi = 0; gi < goods.length; gi++) {
          var g = goods[gi];
          if (!g || !g.id || !g.name) continue;
          var curPrice = (typeof getPrice === "function") ? getPrice(g.id, location, st) : 0;
          var basePrice = g.basePrice || 100;
          var ratio = curPrice > 0 ? (curPrice / basePrice) : 1;

          if (ratio >= 1.5) {
            alerts.push({ name: g.name, trend: "📈暴涨", ratio: Math.round(ratio * 100), type: "sell" });
          } else if (ratio <= 0.6) {
            alerts.push({ name: g.name, trend: "📉暴跌", ratio: Math.round(ratio * 100), type: "buy" });
          } else if (ratio >= 1.25) {
            alerts.push({ name: g.name, trend: "📈偏高", ratio: Math.round(ratio * 100), type: "sell" });
          } else if (ratio <= 0.75) {
            alerts.push({ name: g.name, trend: "📉偏低", ratio: Math.round(ratio * 100), type: "buy" });
          }
        }

        // 只显示最明显的3个
        alerts.sort(function(a, b) { return Math.abs(b.ratio - 100) - Math.abs(a.ratio - 100); });
        var topAlerts = alerts.slice(0, 3);

        if (topAlerts.length === 0) {
          return "今日市场价格平稳，没有明显异动。" +
            "适合按需采购，也可以关注一下有没有你需要的商品在低价区间。";
        }

        var sellAlerts = topAlerts.filter(function(a) { return a.type === "sell"; });
        var buyAlerts = topAlerts.filter(function(a) { return a.type === "buy"; });

        var parts = [];
        if (sellAlerts.length > 0) {
          parts.push("📈 适合卖出：" + sellAlerts.map(function(a) { return a.name + "(" + a.ratio + "%)"; }).join("、"));
        }
        if (buyAlerts.length > 0) {
          parts.push("📉 适合买入：" + buyAlerts.map(function(a) { return a.name + "(" + a.ratio + "%)"; }).join("、"));
        }

        return "今日价格异动提醒：<br>" + parts.join("<br>") + "<br>" +
          (topAlerts.length > 3 ? "还有" + (alerts.length - 3) + "种商品价格异常。" : "") +
          "低价买入、高价卖出是赚钱的基本法则。";
      },
      choices: [
        { text: "🛒 去交易", next: null, handler: function(st) {
          if (typeof showTradeTab === "function") {
            showTradeTab();
          } else {
            StateManager.addMessage("🛒 前往交易界面查看详情", "info");
          }
        }},
        { text: "📝 记住价格", next: null, handler: function(st) {
          st.flags = st.flags || {};
          st.flags._a624_priceAlert = (st.flags._a624_priceAlert || 0) + 1;
          StateManager.addMessage("📝 你记住了今天的价格异动，对市场规律更了解了", "info");
        }},
      ],
      conditions: function (st) {
        return st.trade && st.trade.currentLocation && (st.player.day || 0) % 3 === 0;
      },
      weight: 1,
    },
  ];

  // 注册事件
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
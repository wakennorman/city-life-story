/**
 * 域D(NPC/社交) 联动增强 R661
 * 桥接：
 *   D→E  d661_friend_invest_network  朋友投资网络 → 消费 state.relationships+state.resources 数据,
 *     社交→"朋友带你投资"的经济回响
 *   D→G  d661_social_health_benefit  社交健康收益 → 消费 state.relationships+state.needs+state.status 数据,
 *     社交→"社交活动促进健康"的生命回响
 *   D→A  d661_friend_market_knowledge  朋友市场知识 → 消费 state.relationships 数据,
 *     社交→"朋友分享的市场知识"的数值回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR661Loaded) return;
  RANDOM_EVENTS._domainDLinkageR661Loaded = true;

  function metNpcsR661(st, minAff) {
    var out = [];
    var rels = st.relationships || {};
    minAff = minAff || 0;
    for (var k in rels) {
      if (rels[k] && rels[k].met && (rels[k].affinity || 0) >= minAff) {
        out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
      }
    }
    return out;
  }

  var EVENTS = [
    // ====== D→E: 朋友投资网络 ======
    {
      id: "d661_friend_invest_network", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "投资朋友圈",
      story: "朋友们凑在一起讨论投资机会——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 5, excludeFlags: ["_d661InvestNetworkCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d661InvestNetworkCooldown) return false;
        if ((st.resources.cash || 0) < 5000) return false;
        return metNpcsR661(st, 40).length >= 1;
      },
      choices: [
        { text: "💼 跟朋友一起投", hint: "收益¥1000-3000,风险亏¥500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d661InvestNetworkCooldown = true;
          var invest = Math.min(2000, (st.resources.cash || 0) * 0.3);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - invest);
          var win = Random.chance(0.6);
          if (win) {
            var ret = Math.round(invest * Random.float(1.5, 2.5));
            st.resources.cash = (st.resources.cash || 0) + ret;
            if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '跟着大家投,果然没错!' 投资赚了¥" + (ret - invest).toLocaleString() + "。", "success");
          } else {
            var loss = Math.round(invest * Random.float(0.3, 0.7));
            st.resources.cash = (st.resources.cash || 0) + loss;
            if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '这次看走眼了...' 投资亏了¥" + (invest - loss) + "。", "warning");
          }
        }},
        { text: "📝 先听听大家分析", hint: "智力+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d661InvestNetworkCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你认真听了每个人的分析。'每个人的视角都不一样,收获很大。' 智力+4,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR661(st, 40);
        var name = met.length > 0 ? met[0].name : "朋友们";
        return name + "拉了个群:'最近有个好项目,大家一起研究研究?' 你看着群里的讨论,感觉这是个不错的机会。";
      }
    },

    // ====== D→G: 社交健康收益 ======
    {
      id: "d661_social_health_benefit", phase: "street", _isChainEvent: false, icon: "🏃",
      title: "一起运动",
      story: "朋友约你一起运动——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 10, excludeFlags: ["_d661HealthBenefitCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d661HealthBenefitCooldown) return false;
        return metNpcsR661(st, 20).length >= 1;
      },
      choices: [
        { text: "🏸 打羽毛球", hint: "健康+5,心情+8,疲劳+10,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d661HealthBenefitCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          var met = metNpcsR661(st, 20);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "一起运动"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 '好球!' 你和朋友打了场羽毛球,出了一身汗。健康+5,心情+8,疲劳+10,好感+3。", "success");
        }},
        { text: "🚶 散步聊天", hint: "健康+2,心情+5,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d661HealthBenefitCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 2);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          var met = metNpcsR661(st, 20);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "散步聊天"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚶 你们一边散步一边聊天,心情舒畅。健康+2,心情+5,好感+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR661(st, 20);
        var name = met.length > 0 ? met[0].name : "朋友";
        return name + "发来消息:'周末一起去打球?' 你看了看自己日渐下降的健康值,觉得这是个好主意。";
      }
    },

    // ====== D→A: 朋友市场知识 ======
    {
      id: "d661_friend_market_knowledge", phase: "street", _isChainEvent: false, icon: "📚",
      title: "朋友的经验",
      story: "一个经验丰富的朋友分享了他的市场心得——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 8, excludeFlags: ["_d661MarketKnowledgeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d661MarketKnowledgeCooldown) return false;
        return metNpcsR661(st, 30).length >= 1;
      },
      choices: [
        { text: "🎓 认真学习", hint: "智力+5,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d661MarketKnowledgeCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          var met = metNpcsR661(st, 30);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "学习经验"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '在市场里摸爬滚打这么多年,我总结了几条铁律...' 你学到了宝贵的经验。智力+5,好感+3。", "success");
        }},
        { text: "📝 记下来实践", hint: "心智+5,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d661MarketKnowledgeCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 你认真记下了朋友的经验,打算在实践中验证。'理论加实践,才是真本事。' 心智+5,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR661(st, 30);
        var name = met.length > 0 ? met[0].name : "朋友";
        return name + "说:'在这个市场混了这么久,我总结了一个道理——便宜没好货,但贵的也不一定好。' 你听得连连点头。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
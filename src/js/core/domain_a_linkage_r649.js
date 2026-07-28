/**
 * 域A(数据/数值平衡) 联动增强 R649
 * 桥接：
 *   A→B  a649_data_storytelling  数据故事化 → 消费 state.stats+state.player 数据,
 *     数据→"用数据讲故事"叙事回响
 *   A→D  a649_fair_price_movement  公平价格运动 → 消费 state.trade+state.relationships 数据,
 *     数据→"价格公平关乎社会和谐"社交回响
 *   A→G  a649_preventive_care  预防性保健 → 消费 state.status+state.needs 数据,
 *     数据→"防患于未然"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR649Loaded) return;
  RANDOM_EVENTS._domainALinkageR649Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR649(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "a649_data_storytelling", phase: "street", _isChainEvent: false, icon: "📖",
      title: "用数据讲故事",
      story: "你开始用数据来讲述自己的人生故事——{desc}",
      triggers: { minDay: 365, interval: 365, maxRepeats: 1, excludeFlags: ["_a649StoryDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a649StoryDone) return false;
        var day = (st.player && st.player.day) || 0;
        return day >= 365;
      },
      choices: [
        { text: "📊 制作数据故事", hint: "智力+6,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a649StoryDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据是事实,故事是意义。' 你制作了个人数据故事。智力+6,心智+5。", "success");
        }},
        { text: "🎯 分享经验", hint: "社交XP+5,心情+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a649StoryDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '分享经验,帮助他人。' 你分享了人生故事。社交XP+5,心情+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var totalEarned = (st.stats && st.stats.totalEarned) || 0;
        return "你开始用数据来讲述自己的人生故事——" + day + "天,赚了¥" + totalEarned + "。'数据是事实,故事是意义。'";
      }
    },
    {
      id: "a649_fair_price_movement", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "价格公平关乎社会和谐",
      story: "你开始关注身边的价格公平问题——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 2, excludeFlags: ["_a649FairCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a649FairCooldown) return false;
        var met = metNpcsR649(st);
        return met.length >= 3;
      },
      choices: [
        { text: "🤝 倡导公平", hint: "好感+4,社交XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a649FairCooldown = true;
          var met = metNpcsR649(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 4, "倡导价格公平"); } catch(e) {}
            }
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '价格公平,关乎社会和谐。' 你倡导了价格公平。全NPC好感+4,社交XP+4。", "success");
        }},
        { text: "📊 用数据说话", hint: "智力+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a649FairCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '用数据说话,更有说服力。' 你收集了价格数据。智力+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始关注身边的价格公平问题——'价格不公平,会伤害消费者,也会伤害商家。公平交易,才能长久。'";
      }
    },
    {
      id: "a649_preventive_care", phase: "street", _isChainEvent: false, icon: "🛡️",
      title: "防患于未然",
      story: "你开始用数据来预防健康问题——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 1, excludeFlags: ["_a649PreventDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a649PreventDone) return false;
        var health = (st.status && st.status.health) || 100;
        return health < 65;
      },
      choices: [
        { text: "🏃 制定健康计划", hint: "心智+6,置_a649HealthPlan", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a649PreventDone = true;
          st.flags._a649HealthPlan = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 '预防胜于治疗。' 你制定了健康计划。心智+6。", "success");
        }},
        { text: "😌 顺其自然", hint: "心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a649PreventDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '心态好,身体自然好。' 你选择顺其自然。心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 100;
        return "你开始用数据来预防健康问题——健康" + Math.round(health) + "%,'防患于未然,才是聪明人。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

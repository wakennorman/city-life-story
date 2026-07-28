/**
 * 域A(数据/数值平衡) 联动增强 R665
 * 桥接：
 *   A→B  a659_market_pulse_v2  市场脉搏v2 → 消费 state.trade+state.stats 数据,
 *     数据→"市场在说话"叙事回响
 *   A→D  a659_npc_price_network_v2  NPC价格网络v2 → 消费 state.trade+state.relationships 数据,
 *     数据→"熟人价真相"社交回响
 *   A→G  a659_health_awareness_v3  健康觉醒v3 → 消费 state.status+state.needs 数据,
 *     数据→"健康数据驱动行为"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR665Loaded) return;
  RANDOM_EVENTS._domainALinkageR665Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR665(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "a659_market_pulse_v2", phase: "street", _isChainEvent: false, icon: "📈",
      title: "市场在说话",
      story: "你开始用数据来感知市场的脉搏——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_a659PulseCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a659PulseCooldown) return false;
        return st.trade && st.trade.supplyDemand;
      },
      choices: [
        { text: "📊 深度分析", hint: "智力+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a659PulseCooldown = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '市场在说话,数据是语言。' 你分析了市场脉搏。智力+5,心智+3。", "success");
        }},
        { text: "🎯 制定策略", hint: "管理XP+4,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a659PulseCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '有数据,才能制定好策略。' 你制定了市场策略。管理XP+4,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始用数据来感知市场的脉搏——'市场在说话,数据是语言。'";
      }
    },
    {
      id: "a659_npc_price_network_v2", phase: "street", _isChainEvent: false, icon: "🏷️",
      title: "熟人价真相",
      story: "你发现不同NPC给出的价格差异很大——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 2, excludeFlags: ["_a659PriceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a659PriceCooldown) return false;
        var met = metNpcsR665(st);
        return met.length >= 3;
      },
      choices: [
        { text: "🤝 找熟人买", hint: "好感+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a659PriceCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          var met = metNpcsR665(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 4, "熟人交易"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '熟人价确实实惠。' 你找朋友买了东西。全NPC好感+4,心情+3。", "success");
        }},
        { text: "🔍 货比三家", hint: "智力+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a659PriceCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔍 '货比三家不吃亏。' 你选择了理性消费。智力+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现不同NPC给出的价格差异很大——'同样的东西,熟人便宜十块。这座城市的人情世故,都藏在价格里。'";
      }
    },
    {
      id: "a659_health_awareness_v3", phase: "street", _isChainEvent: false, icon: "💪",
      title: "健康数据驱动行为",
      story: "你开始用健康数据来驱动自己的行为——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 1, excludeFlags: ["_a659HealthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a659HealthDone) return false;
        var health = (st.status && st.status.health) || 100;
        return health < 50;
      },
      choices: [
        { text: "🏃 制定健康计划", hint: "心智+6,置_a659HealthPlan", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a659HealthDone = true;
          st.flags._a659HealthPlan = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 '健康数据驱动行为。' 你制定了健康计划。心智+6。", "success");
        }},
        { text: "😌 顺其自然", hint: "心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a659HealthDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '心态好,身体自然好。' 你选择顺其自然。心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 100;
        return "你开始用健康数据来驱动自己的行为——健康" + Math.round(health) + "%,'健康数据驱动行为,行为改变生活。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

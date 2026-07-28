/**
 * 域A(数据/数值平衡) 联动增强 R641
 * 桥接：
 *   A→B  a641_quantified_self  量化自我 → 消费 state.player+state.stats+state.skills 数据,
 *     数据→"用数据认识自己"叙事回响
 *   A→D  a641_npc_price_insight  NPC价格洞察 → 消费 state.trade+state.relationships 数据,
 *     数据→"熟人价真相"社交回响
 *   A→G  a641_health_optimization  健康优化 → 消费 state.status+state.needs 数据,
 *     数据→"数据驱动健康"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR641Loaded) return;
  RANDOM_EVENTS._domainALinkageR641Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR641(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "a641_quantified_self", phase: "street", _isChainEvent: false, icon: "🔬",
      title: "量化自我",
      story: "你开始用数据全面认识自己——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 1, excludeFlags: ["_a641SelfDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a641SelfDone) return false;
        var day = (st.player && st.player.day) || 0;
        return day >= 300;
      },
      choices: [
        { text: "📊 深度分析", hint: "智力+6,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a641SelfDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '认识自己,是最难的功课。' 你完成了深度自我分析。智力+6,心智+4。", "success");
        }},
        { text: "🎯 制定改进计划", hint: "管理XP+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a641SelfDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '知不足,然后能自反也。' 你制定了改进计划。管理XP+5,心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var totalEarned = (st.stats && st.stats.totalEarned) || 0;
        return "你开始用数据全面认识自己——" + day + "天,赚了¥" + totalEarned + ",认识" + metNpcsR641(st).length + "位朋友。'量化自我,是成长的第一步。'";
      }
    },
    {
      id: "a641_npc_price_insight", phase: "street", _isChainEvent: false, icon: "🏷️",
      title: "熟人价的真相",
      story: "你发现不同NPC给出的价格差异很大——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 2, excludeFlags: ["_a641PriceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a641PriceCooldown) return false;
        var met = metNpcsR641(st);
        return met.length >= 2;
      },
      choices: [
        { text: "🤝 找熟人买", hint: "好感+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a641PriceCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          var met = metNpcsR641(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "熟人交易"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '熟人价确实实惠。' 你找朋友买了东西。好感+3,心情+2。", "success");
        }},
        { text: "🔍 货比三家", hint: "智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a641PriceCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔍 '不怕不识货,就怕货比货。' 你选择了理性消费。智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现不同NPC给出的价格差异很大——'同样的东西,熟人便宜十块。这座城市的人情世故,都藏在价格里。'";
      }
    },
    {
      id: "a641_health_optimization", phase: "street", _isChainEvent: false, icon: "💪",
      title: "数据驱动健康",
      story: "你开始用数据来优化自己的健康——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 1, excludeFlags: ["_a641HealthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a641HealthDone) return false;
        var health = (st.status && st.status.health) || 100;
        return health < 70;
      },
      choices: [
        { text: "🏃 制定运动计划", hint: "心智+5,置_a641Exercise", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a641HealthDone = true;
          st.flags._a641Exercise = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 '生命在于运动。' 你制定了运动计划。心智+5。", "success");
        }},
        { text: "🥗 改善饮食", hint: "心情+5,厨艺XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a641HealthDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof addSkillXp === "function") { try { addSkillXp("cooking", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🥗 '病从口入,健康从口出。' 你改善了饮食结构。心情+5,厨艺XP+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 100;
        return "你开始用数据来优化自己的健康——健康" + Math.round(health) + "%,'数据不会说谎,身体也是。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

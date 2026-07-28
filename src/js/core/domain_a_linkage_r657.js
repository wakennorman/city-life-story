/**
 * 域A(数据/数值平衡) 联动增强 R657
 * 桥接：
 *   A→B  a657_life_chapter_data  人生章节数据 → 消费 state.player+state.stats 数据,
 *     数据→"用数据书写人生篇章"叙事回响
 *   A→D  a657_npc_trade_network  NPC交易网络 → 消费 state.trade+state.relationships 数据,
 *     数据→"朋友是交易伙伴"社交回响
 *   A→G  a657_health_optimization_v2  健康优化v2 → 消费 state.status+state.needs 数据,
 *     数据→"数据驱动健康"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR657Loaded) return;
  RANDOM_EVENTS._domainALinkageR657Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR657(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "a657_life_chapter_data", phase: "street", _isChainEvent: false, icon: "📖",
      title: "用数据书写人生篇章",
      story: "你开始用数据来书写自己的人生篇章——{desc}",
      triggers: { minDay: 400, interval: 365, maxRepeats: 1, excludeFlags: ["_a657ChapterDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a657ChapterDone) return false;
        var day = (st.player && st.player.day) || 0;
        return day >= 400;
      },
      choices: [
        { text: "📊 制作人生数据报告", hint: "智力+7,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a657ChapterDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 7);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据是事实,故事是意义。' 你制作了人生数据报告。智力+7,心智+5。", "success");
        }},
        { text: "🎯 设定新章目标", hint: "心智+8,置_a657NewChapter", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a657ChapterDone = true;
          st.flags._a657NewChapter = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '每一段人生,都值得被记录。' 你设定了新章目标。心智+8。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var totalEarned = (st.stats && st.stats.totalEarned) || 0;
        return "你开始用数据来书写自己的人生篇章——" + day + "天,赚了¥" + totalEarned + "。'用数据书写人生篇章。'";
      }
    },
    {
      id: "a657_npc_trade_network", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "朋友是交易伙伴",
      story: "你发现身边的朋友也是你的交易伙伴——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_a657TradeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a657TradeCooldown) return false;
        var met = metNpcsR657(st);
        return met.length >= 3;
      },
      choices: [
        { text: "💰 朋友价交易", hint: "好感+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a657TradeCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          var met = metNpcsR657(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 4, "朋友交易"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '朋友价,确实实惠。' 你与朋友进行了交易。全NPC好感+4,心情+3。", "success");
        }},
        { text: "🔍 货比三家", hint: "智力+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a657TradeCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔍 '货比三家不吃亏。' 你选择了理性消费。智力+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现身边的朋友也是你的交易伙伴——'朋友是交易伙伴,交易加深友谊。'";
      }
    },
    {
      id: "a657_health_optimization_v2", phase: "street", _isChainEvent: false, icon: "💪",
      title: "数据驱动健康",
      story: "你开始用数据来优化自己的健康——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_a657HealthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a657HealthDone) return false;
        var health = (st.status && st.status.health) || 100;
        return health < 55;
      },
      choices: [
        { text: "🏃 制定健康计划", hint: "心智+6,置_a657HealthPlan", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a657HealthDone = true;
          st.flags._a657HealthPlan = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 '数据驱动健康,健康改变生活。' 你制定了健康计划。心智+6。", "success");
        }},
        { text: "😌 顺其自然", hint: "心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a657HealthDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '心态好,身体自然好。' 你选择顺其自然。心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 100;
        return "你开始用数据来优化自己的健康——健康" + Math.round(health) + "%,'数据驱动健康,健康改变生活。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

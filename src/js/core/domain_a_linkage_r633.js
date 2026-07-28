/**
 * 域A(数据/数值平衡) 联动增强 R633
 * 桥接：
 *   A→B  a633_data_driven_narrative  数据驱动叙事 → 消费 state.stats+state.flags 数据,
 *     数据→"用数据讲故事"叙事回响
 *   A→D  a633_price_fairness  价格公平感 → 消费 state.trade+state.relationships 数据,
 *     数据→"被宰过的记忆"社交回响
 *   A→G  a633_preventive_health  预防性健康 → 消费 state.status+state.needs 数据,
 *     数据→"防患于未然"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR633Loaded) return;
  RANDOM_EVENTS._domainALinkageR633Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR633(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "a633_data_driven_narrative", phase: "street", _isChainEvent: false, icon: "📊",
      title: "用数据讲故事",
      story: "你开始用数据来理解自己的城市生活——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 1, excludeFlags: ["_a633NarrativeDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a633NarrativeDone) return false;
        var day = (st.player && st.player.day) || 0;
        return day >= 120;
      },
      choices: [
        { text: "📈 数据可视化", hint: "智力+4,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a633NarrativeDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '让数据自己说话。' 你制作了个人数据看板。智力+4,心智+3。", "success");
        }},
        { text: "📖 写总结报告", hint: "管理XP+4,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a633NarrativeDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把经历写成报告,更有条理。' 你总结了这段日子。管理XP+4,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var totalEarned = (st.stats && st.stats.totalEarned) || 0;
        return "你开始用数据来理解自己的城市生活——" + day + "天,赚了¥" + totalEarned + "。'数字背后,是一个真实的人生故事。'";
      }
    },
    {
      id: "a633_price_fairness", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "价格公平感",
      story: "你开始注意到处处存在的'熟人价'和'生人价'——{desc}",
      triggers: { minDay: 50, interval: 100, maxRepeats: 2, excludeFlags: ["_a633FairCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a633FairCooldown) return false;
        var met = metNpcsR633(st);
        return met.length >= 2;
      },
      choices: [
        { text: "🤝 找熟人买东西", hint: "好感+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a633FairCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          var met = metNpcsR633(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "熟人交易"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '熟人价确实便宜些。' 你找朋友买了东西。好感+3,心情+2。", "success");
        }},
        { text: "🔍 货比三家", hint: "智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a633FairCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔍 '货比三家不吃亏。' 你选择了理性消费。智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始注意处处存在的'熟人价'和'生人价'——'同样东西,熟人便宜十块。这座城市的人情世故,都藏在价格里。'";
      }
    },
    {
      id: "a633_preventive_health", phase: "street", _isChainEvent: false, icon: "🛡️",
      title: "防患于未然",
      story: "你开始关注预防,而不是等生病了才去医院——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 2, excludeFlags: ["_a633PreventCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a633PreventCooldown) return false;
        var health = (st.status && st.status.health) || 100;
        return health < 80;
      },
      choices: [
        { text: "🏃 开始锻炼", hint: "心智+4,置_a633ExerciseHabit", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a633PreventCooldown = true;
          st.flags._a633ExerciseHabit = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 '预防胜于治疗。' 你开始了锻炼计划。心智+4。", "success");
        }},
        { text: "🥗 调整饮食", hint: "心情+4,健康XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a633PreventCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("cooking", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🥗 '吃得好,病得少。' 你调整了饮食结构。心情+4,厨艺XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 100;
        return "你开始关注预防——健康" + Math.round(health) + "%,'等生病就晚了,防患于未然才是聪明人。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

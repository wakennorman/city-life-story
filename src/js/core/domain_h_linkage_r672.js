/**
 * 域H(Phase2/公司) 联动增强 R672
 * 桥接：
 *   H→A  h654_corp_data_intelligence  公司数据智能 → 消费 state.startup 数据,
 *    公司→"数据驱动决策"数据回响
 *   H→D  h654_corp_culture_evolution  公司文化演化 → 消费 state.startup+state.relationships 数据,
 *    公司→"企业文化在演化"社交回响
 *   H→G  h654_founder_wellness_v3  创始人健康v3 → 消费 state.startup+state.status+state.needs 数据,
 *    公司→"创始人健康就是公司健康"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR672Loaded) return;
  RANDOM_EVENTS._domainHLinkageR672Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR672(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "h654_corp_data_intelligence", phase: "corporate", _isChainEvent: false, icon: "💾",
      title: "数据驱动决策",
      story: "公司积累的数据,已经成为决策的重要依据——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 1, excludeFlags: ["_h654DataDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h654DataDone) return false;
        return st.startup && st.startup.company && (st.startup.company.revenue || 0) >= 50000;
      },
      choices: [
        { text: "📊 数据变现", hint: "管理XP+7,现金+5000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h654DataDone = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 5000;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 7); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据驱动决策,决策产生价值。' 你发现了公司数据的商业价值。管理XP+7,现金+¥5000。", "success");
        }},
        { text: "🔒 保护数据", hint: "心智+6,置_h654DataPrivacy", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h654DataDone = true;
          st.flags._h654DataPrivacy = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔒 '数据安全是底线。' 你选择保护数据隐私。心智+6。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var rev = (st.startup && st.startup.company && st.startup.company.revenue) || 0;
        return "公司积累的数据,已经成为决策的重要依据——月营收¥" + rev + "。'数据驱动决策,决策产生价值。'";
      }
    },
    {
      id: "h654_corp_culture_evolution", phase: "corporate", _isChainEvent: false, icon: "🎭",
      title: "企业文化在演化",
      story: "公司的文化,正在随着团队的成长而演化——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_h654CultureDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h654CultureDone) return false;
        return st.startup && st.startup.company && (st.startup.company.employees || 0) >= 5;
      },
      choices: [
        { text: "🤝 分享文化", hint: "好感+6,社交XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h654CultureDone = true;
          var met = metNpcsR672(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 6, "分享企业文化"); } catch(e) {}
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '好文化值得分享。' 你向朋友分享了公司文化。好感+6,社交XP+5。", "success");
        }},
        { text: "💼 专注内部", hint: "管理XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h654CultureDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '先把内部做好。' 你选择专注内部管理。管理XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var empCount = (st.startup && st.startup.company && st.startup.company.employees) || 0;
        return "公司的文化,正在随着团队的成长而演化——" + empCount + "名员工共同塑造的文化。'企业文化在演化。'";
      }
    },
    {
      id: "h654_founder_wellness_v3", phase: "corporate", _isChainEvent: false, icon: "❤️",
      title: "创始人健康就是公司健康",
      story: "你开始意识到:创始人倒下,公司就倒了——{desc}",
      triggers: { minDay: 200, interval: 300, maxRepeats: 1, excludeFlags: ["_h654WellnessDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h654WellnessDone) return false;
        if (!st.startup || !st.startup.company) return false;
        var health = (st.status && st.status.health) || 100;
        return health < 45;
      },
      choices: [
        { text: "🏥 花钱保养", hint: "现金-5000,健康+20,心情+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h654WellnessDone = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5000);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 20);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏥 '创始人健康就是公司健康。' 你花钱做了全面保养。现金-¥5000,健康+20,心情+8。", "success");
        }},
        { text: "😌 调整节奏", hint: "心智+7", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h654WellnessDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '慢下来,才能走得更远。' 你调整了工作节奏。心智+7。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 100;
        return "你开始意识到:创始人倒下,公司就倒了——健康" + Math.round(health) + "%,'创始人健康就是公司健康。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

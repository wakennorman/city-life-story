/**
 * 域H(Phase2/公司) 联动增强 R664
 * 桥接：
 *   H→A  h652_corp_data_rooted  公司数据扎根 → 消费 state.startup 数据,
 *    公司→"数据驱动决策"数据回响
 *   H→D  h652_corp_culture_impact  公司文化影响 → 消费 state.startup+state.relationships 数据,
 *    公司→"企业文化影响社交"社交回响
 *   H→G  h652_founder_life_harmony  创始人生活和谐 → 消费 state.startup+state.player+state.needs 数据,
 *    公司→"工作与生活和谐"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR664Loaded) return;
  RANDOM_EVENTS._domainHLinkageR664Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR664(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "h652_corp_data_rooted", phase: "corporate", _isChainEvent: false, icon: "💾",
      title: "数据驱动决策",
      story: "公司积累的数据,已经成为决策的重要依据——{desc}",
      triggers: { minDay: 200, interval: 300, maxRepeats: 1, excludeFlags: ["_h652DataDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h652DataDone) return false;
        return st.startup && st.startup.company && (st.startup.company.revenue || 0) >= 30000;
      },
      choices: [
        { text: "📊 数据变现", hint: "管理XP+6,现金+4000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h652DataDone = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 4000;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据驱动决策,决策产生价值。' 你发现了公司数据的商业价值。管理XP+6,现金+¥4000。", "success");
        }},
        { text: "🔒 保护数据", hint: "心智+5,置_h652DataPrivacy", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h652DataDone = true;
          st.flags._h652DataPrivacy = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔒 '数据安全是底线。' 你选择保护数据隐私。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var rev = (st.startup && st.startup.company && st.startup.company.revenue) || 0;
        return "公司积累的数据,已经成为决策的重要依据——月营收¥" + rev + "。'数据驱动决策,决策产生价值。'";
      }
    },
    {
      id: "h652_corp_culture_impact", phase: "corporate", _isChainEvent: false, icon: "🎭",
      title: "企业文化影响社交",
      story: "公司的文化,正在影响你与身边人的相处方式——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_h652CultureDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h652CultureDone) return false;
        return st.startup && st.startup.company && (st.startup.company.employees || 0) >= 4;
      },
      choices: [
        { text: "🤝 分享文化", hint: "好感+5,社交XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h652CultureDone = true;
          var met = metNpcsR664(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "分享企业文化"); } catch(e) {}
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '好文化值得分享。' 你向朋友分享了公司文化。好感+5,社交XP+4。", "success");
        }},
        { text: "💼 专注内部", hint: "管理XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h652CultureDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '先把内部做好。' 你选择专注内部管理。管理XP+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var empCount = (st.startup && st.startup.company && st.startup.company.employees) || 0;
        return "公司的文化,正在影响你与身边人的相处方式——" + empCount + "名员工共同塑造的文化。'企业文化影响社交。'";
      }
    },
    {
      id: "h652_founder_life_harmony", phase: "corporate", _isChainEvent: false, icon: "⚖️",
      title: "工作与生活和谐",
      story: "你开始追求工作与生活的和谐——{desc}",
      triggers: { minDay: 200, interval: 300, maxRepeats: 1, excludeFlags: ["_h652HarmonyDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h652HarmonyDone) return false;
        if (!st.startup || !st.startup.company) return false;
        var happy = (st.needs && st.needs.happiness) || 50;
        return happy < 30;
      },
      choices: [
        { text: "🧘 调整节奏", hint: "心智+8,心情+7", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h652HarmonyDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 7);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 '工作与生活和谐,才是完整的人生。' 你调整了工作节奏。心智+8,心情+7。", "success");
        }},
        { text: "💪 坚持一下", hint: "心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h652HarmonyDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '再坚持一下,就能看到曙光。' 你选择坚持。心智+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var happy = (st.needs && st.needs.happiness) || 50;
        return "你开始追求工作与生活的和谐——心情" + Math.round(happy) + "%,'工作与生活和谐,才是完整的人生。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

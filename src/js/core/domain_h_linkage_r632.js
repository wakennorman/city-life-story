/**
 * 域H(Phase2/公司) 联动增强 R632
 * 桥接：
 *   H→A  h624_corp_data_monopoly  公司数据资产 → 消费 state.startup+state.trade 数据,
 *    公司→"企业数据也是资产"数据回响
 *   H→D  h624_corp_social_impact  公司社会影响 → 消费 state.startup+state.relationships 数据,
 *    公司→"企业公民"社交回响
 *   H→G  h624_founder_legacy  创始人传承 → 消费 state.startup+state.player 数据,
 *    公司→"留下些什么"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR632Loaded) return;
  RANDOM_EVENTS._domainHLinkageR632Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR632(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "h624_corp_data_monopoly", phase: "corporate", _isChainEvent: false, icon: "💾",
      title: "公司数据资产",
      story: "公司积累的数据,本身就是一笔财富——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 1, excludeFlags: ["_h624DataAssetDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h624DataAssetDone) return false;
        return st.startup && st.startup.company && (st.startup.company.revenue || 0) >= 10000;
      },
      choices: [
        { text: "📊 数据变现", hint: "管理XP+5,现金+2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h624DataAssetDone = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据就是新石油。' 你发现了公司数据的商业价值。管理XP+5,现金+¥2000。", "success");
        }},
        { text: "🔒 保护隐私", hint: "心智+5,置_h624PrivacyFirst", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h624DataAssetDone = true;
          st.flags._h624PrivacyFirst = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔒 '数据有价值,但信任更珍贵。' 你选择保护客户隐私。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var rev = (st.startup && st.startup.company && st.startup.company.revenue) || 0;
        return "公司积累的数据,本身就是一笔财富——月营收¥" + rev + "背后,是宝贵的客户洞察。'数据就是新石油。'";
      }
    },
    {
      id: "h624_corp_social_impact", phase: "corporate", _isChainEvent: false, icon: "🤲",
      title: "企业公民",
      story: "公司做大了,开始有人期待你承担更多社会责任——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_h624SocialDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h624SocialDone) return false;
        return st.startup && st.startup.company && (st.startup.company.employees || 0) >= 5;
      },
      choices: [
        { text: "💝 做公益", hint: "心智+5,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h624SocialDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          var met = metNpcsR632(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "企业公益"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 '取之于社会,用之于社会。' 你组织了一次公益活动。心智+5,好感+3。", "success");
        }},
        { text: "💼 专注经营", hint: "管理XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h624SocialDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '把公司做好,就是最大的社会责任。' 你专注经营。管理XP+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var empCount = (st.startup && st.startup.company && st.startup.company.employees) || 0;
        return "公司做大了,开始有人期待你承担更多社会责任——" + empCount + "名员工背后,是" + empCount + "个家庭。'能力越大,责任越大。'";
      }
    },
    {
      id: "h624_founder_legacy", phase: "corporate", _isChainEvent: false, icon: "🏛️",
      title: "留下什么",
      story: "创业路上,你开始思考:这一切的终点是什么?——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 1, excludeFlags: ["_h624LegacyDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h624LegacyDone) return false;
        return st.startup && st.startup.company && (st.startup.company.valuation || 0) >= 100000;
      },
      choices: [
        { text: "📖 写创业笔记", hint: "智力+5,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h624LegacyDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把走过的路记下来,给后来者看。' 你写下了创业笔记。智力+5,心智+5。", "success");
        }},
        { text: "🚀 继续做大", hint: "心智+8,置_h624KeepGrowing", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h624LegacyDone = true;
          st.flags._h624KeepGrowing = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '这还不够,还能更大。' 你目光投向更远处。心智+8。", "success");
        }},
        { text: "😌 享受当下", hint: "心情+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h624LegacyDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '走到今天,已经很好了。' 你学会了享受当下。心情+8。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var val = (st.startup && st.startup.company && st.startup.company.valuation) || 0;
        return "创业路上,你开始思考:这一切的终点是什么?——公司估值¥" + val + ",但数字之外,你还想留下些什么。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

/**
 * 域H(Phase2/公司) 联动增强 R656
 * 桥接：
 *   H→A  h649_corp_performance_review  公司绩效回顾 → 消费 state.startup 数据,
 *    公司→"绩效驱动成长"数据回响
 *   H→D  h649_corp_social_responsibility  企业社会责任 → 消费 state.startup+state.relationships 数据,
 *    公司→"企业公民"社交回响
 *   H→G  h649_founder_life_balance_v2  创始人生活平衡v2 → 消费 state.startup+state.player+state.needs 数据,
 *    公司→"工作不是全部"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR656Loaded) return;
  RANDOM_EVENTS._domainHLinkageR656Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR656(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "h649_corp_performance_review", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "绩效驱动成长",
      story: "你开始用绩效回顾来驱动团队成长——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_h649PerfDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h649PerfDone) return false;
        return st.startup && st.startup.company && (st.startup.company.employees || 0) >= 4;
      },
      choices: [
        { text: "📈 数据化考核", hint: "管理XP+6,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h649PerfDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '绩效驱动成长,数据说话。' 你建立了绩效回顾制度。管理XP+6,智力+3。", "success");
        }},
        { text: "🎯 目标导向", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h649PerfDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '目标导向,结果说话。' 你设定了团队目标。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var empCount = (st.startup && st.startup.company && st.startup.company.employees) || 0;
        return "你开始用绩效回顾来驱动团队成长——" + empCount + "名员工,需要明确的目标和反馈。'绩效驱动成长,数据说话。'";
      }
    },
    {
      id: "h649_corp_social_responsibility", phase: "corporate", _isChainEvent: false, icon: "🤲",
      title: "企业公民",
      story: "公司做大了,开始有人期待你承担更多社会责任——{desc}",
      triggers: { minDay: 200, interval: 300, maxRepeats: 1, excludeFlags: ["_h649SocialDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h649SocialDone) return false;
        return st.startup && st.startup.company && (st.startup.company.employees || 0) >= 6;
      },
      choices: [
        { text: "💝 做公益", hint: "心智+6,好感+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h649SocialDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          var met = metNpcsR656(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 4, "企业公益"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 '取之于社会,用之于社会。' 你组织了一次公益活动。心智+6,好感+4。", "success");
        }},
        { text: "💼 专注经营", hint: "管理XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h649SocialDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '把公司做好,就是最大的社会责任。' 你专注经营。管理XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var empCount = (st.startup && st.startup.company && st.startup.company.employees) || 0;
        return "公司做大了,开始有人期待你承担更多社会责任——" + empCount + "名员工背后,是" + empCount + "个家庭。'能力越大,责任越大。'";
      }
    },
    {
      id: "h649_founder_life_balance_v2", phase: "corporate", _isChainEvent: false, icon: "⚖️",
      title: "工作不是全部",
      story: "你开始追求工作与生活的平衡——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 1, excludeFlags: ["_h649BalanceDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h649BalanceDone) return false;
        if (!st.startup || !st.startup.company) return false;
        var happy = (st.needs && st.needs.happiness) || 50;
        return happy < 35;
      },
      choices: [
        { text: "🧘 调整节奏", hint: "心智+7,心情+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h649BalanceDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 '工作不是全部,生活才是。' 你调整了工作节奏。心智+7,心情+6。", "success");
        }},
        { text: "💪 坚持一下", hint: "心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h649BalanceDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '再坚持一下,就能看到曙光。' 你选择坚持。心智+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var happy = (st.needs && st.needs.happiness) || 50;
        return "你开始追求工作与生活的平衡——心情" + Math.round(happy) + "%,'工作不是全部,生活才是。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

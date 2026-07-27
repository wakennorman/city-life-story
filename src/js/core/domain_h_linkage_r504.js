/**
 * 域H(Phase2/公司) 联动增强 R504
 * 桥接：
 *   H→B  h504_corp_market_legend 公司市场传奇 → 消费 corporate 数据,
 *     营销→"公司产品如何成为爆款"的市场叙事
 *   H→A  h504_corp_financial_report 公司财务报告 → 消费 corporate+resources 数据,
 *     财务→"公司财报解读"的数据分析
 *   H→G  h504_corp_founder_wisdom 创始人智慧 → 消费 corporate+player 数据,
 *     成长→"创业这些年学到的道理"的人生智慧
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR504Loaded) return;
  RANDOM_EVENTS._domainHLinkageR504Loaded = true;

  var EVENTS = [
    {
      id: "h504_corp_market_legend", phase: "corporate", _isChainEvent: false, icon: "🔥",
      title: "爆款故事",
      story: "公司的产品突然火了——{desc}",
      triggers: { minDay: 55, interval: 180, maxRepeats: 3, excludeFlags: ["_h504MarketLegendCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h504MarketLegendCooldown);
      },
      choices: [
        { text: "🔥 趁热打铁", hint: "管理XP+5,公司知名度+5,名气+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h504MarketLegendCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 5);
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔥 '产品火了，但这才刚刚开始。' 你趁热打铁推出了新产品线。管理XP+5,公司知名度+5,名气+2。", "success");
        }},
        { text: "📊 分析原因", hint: "会计XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h504MarketLegendCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔥 你分析了产品爆火的原因——'原来是这个因素。' 会计XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司的产品突然火了——'订单爆了！供应不上了！' 你既兴奋又紧张，机会来了，能不能抓住就看现在了。";
      }
    },
    {
      id: "h504_corp_financial_report", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "财报解读",
      story: "公司的季度财报出来了——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 5, excludeFlags: ["_h504FinancialReportCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h504FinancialReportCooldown);
      },
      choices: [
        { text: "📊 逐项分析", hint: "会计XP+5,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h504FinancialReportCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你逐项分析了财报——'营收增长、毛利提升、费用控制合理。' 会计XP+5,管理XP+3。", "success");
        }},
        { text: "📈 只看关键指标", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h504FinancialReportCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你重点关注了现金流和利润率——'这两个指标没问题，公司就健康。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司的季度财报出来了——'营收、利润、现金流...' 每个数字都牵动着你的神经。";
      }
    },
    {
      id: "h504_corp_founder_wisdom", phase: "corporate", _isChainEvent: false, icon: "💡",
      title: "创业心得",
      story: "回顾创业历程，你总结了几条心得——{desc}",
      triggers: { minDay: 70, interval: 180, maxRepeats: 3, excludeFlags: ["_h504FounderWisdomCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h504FounderWisdomCooldown);
      },
      choices: [
        { text: "💡 写下来", hint: "管理XP+5,心智+4,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h504FounderWisdomCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '创业教会我的三件事：第一，永远不要放弃；第二，找到对的人；第三，相信直觉。' 管理XP+5,心智+4,心情+2。", "success");
        }},
        { text: "🗣️ 分享给团队", hint: "管理XP+3,团队忠诚+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h504FounderWisdomCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 2); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 你把创业心得分享给了团队——'这些道理，希望能帮你们少走弯路。' 管理XP+3,团队忠诚+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "回顾创业历程，你总结了几条心得——'如果回到当初，我会告诉那时的自己...' 你笑了笑，没有如果。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();
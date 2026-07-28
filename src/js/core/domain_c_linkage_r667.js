/**
 * 域C(职业/成长) 联动增强 R667
 * 桥接：
 *   C→E  c655_career_investment_mastery_v2  职业投资精通v2 → 消费 state.career+state.investment 数据,
 *     职业→"事业与投资双丰收"经济回响
 *   C→D  c655_professional_network_v2  职业人脉网络v2 → 消费 state.employment+state.relationships 数据,
 *     职业→"同行是朋友"社交回响
 *   C→G  c655_work_life_integration  工作生活融合 → 消费 state.player+state.needs 数据,
 *     职业→"工作与生活融合"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR667Loaded) return;
  RANDOM_EVENTS._domainCLinkageR667Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR667(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "c655_career_investment_mastery_v2", phase: "street", _isChainEvent: false, icon: "📈",
      title: "事业与投资双丰收",
      story: "你的职业发展带来了投资上的优势——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 1, excludeFlags: ["_c655MasteryDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c655MasteryDone) return false;
        return st.employment && st.employment.currentJob && st.investment && (st.investment.stockHoldings || st.investment.btcHoldings);
      },
      choices: [
        { text: "💰 加大投资", hint: "会计XP+6,现金+3000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c655MasteryDone = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 3000;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '事业与投资,可以互相促进。' 你加大了投资。会计XP+6,现金+¥3000。", "success");
        }},
        { text: "🎯 专注事业", hint: "管理XP+5,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c655MasteryDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '先把事业做好。' 你选择专注事业。管理XP+5,心智+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你的职业发展带来了投资上的优势——'事业与投资,可以互相促进。'";
      }
    },
    {
      id: "c655_professional_network_v2", phase: "street", _isChainEvent: false, icon: "👥",
      title: "同行是朋友",
      story: "你在工作中结识了很多同行,有些人慢慢变成了朋友——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 2, excludeFlags: ["_c655NetCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c655NetCooldown) return false;
        var met = metNpcsR667(st);
        return met.length >= 3;
      },
      choices: [
        { text: "🤝 深度交流", hint: "好感+5,管理XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c655NetCooldown = true;
          var met = metNpcsR667(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "同行交流"); } catch(e) {}
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '同行是朋友,交流是财富。' 你与同行深度交流。好感+5,管理XP+4。", "success");
        }},
        { text: "💼 保持距离", hint: "心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c655NetCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '职场友情,贵在分寸。' 你保持了专业距离。心智+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你在工作中结识了很多同行,有些人慢慢变成了朋友——'同行是朋友,交流是财富。'";
      }
    },
    {
      id: "c655_work_life_integration", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "工作与生活融合",
      story: "你开始追求工作与生活的融合——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_c655IntegrateDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c655IntegrateDone) return false;
        var happy = (st.needs && st.needs.happiness) || 50;
        return happy < 35;
      },
      choices: [
        { text: "🧘 调整节奏", hint: "心智+7,心情+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c655IntegrateDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 '工作与生活融合,才是完整的人生。' 你调整了工作节奏。心智+7,心情+6。", "success");
        }},
        { text: "💪 坚持一下", hint: "心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c655IntegrateDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '再坚持一下,就能看到曙光。' 你选择坚持。心智+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var happy = (st.needs && st.needs.happiness) || 50;
        return "你开始追求工作与生活的融合——心情" + Math.round(happy) + "%,'工作与生活融合,才是完整的人生。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

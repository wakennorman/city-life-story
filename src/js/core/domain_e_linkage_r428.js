/**
 * 域E(经济/投资) 联动增强 R428
 * 桥接：
 *   E→C  e428_investment_mastery       投资精通 → 投资经验→职业自信
 *   E→F  e428_risk_dashboard            风险仪表盘 → 持仓风险→UI
 *   E→G  e428_wealth_wellbeing          财富健康 → 资产→身心健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR428Loaded) return;
  RANDOM_EVENTS._domainELinkageR428Loaded = true;
  function grantXp(key, amt) { if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} } }
  var EVENTS = [
    {
      id: "e428_investment_mastery", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "投资精通",
      story: "你的投资经验日益丰富——{desc}",
      triggers: { minDay: 90, excludeFlags: ["_e428MasteryCooldown"] },
      conditions: function (st) { return !st.gameOver && st.investment; },
      choices: [
        { text: "📚 投资精通助力职业发展", hint: "management XP+5,心智+4", apply: function (st) {
          if (!st) return; st.flags._e428MasteryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          grantXp("management", 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 投资精通助力职业发展——财商是综合素质的重要组成。管理XP+5,心智+4。", "success");
        }},
        { text: "🤷 投资只是副业", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        var desc = "投资经验日益丰富,判断力不断提升";
        if ((st.investment._totalInvestmentProfit || 0) > 50000) desc = "投资盈利超过5万,你已经具备出色的投资能力";
        return "你的投资经验日益丰富——" + desc + "。";
      }
    },
    {
      id: "e428_risk_dashboard", phase: "street", _isChainEvent: false, icon: "⚠️",
      title: "投资风险",
      story: "你关注投资风险——{desc}",
      triggers: { minDay: 65, excludeFlags: ["_e428RiskCooldown"] },
      conditions: function (st) { return !st.gameOver && st.investment; },
      choices: [
        { text: "📊 分散投资降低风险", hint: "心智+3,accounting XP+3", apply: function (st) {
          if (!st) return; st.flags._e428RiskCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          grantXp("accounting", 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ 你关注投资风险——分散投资是稳健的基础。心智+3,会计XP+3。", "success");
        }},
        { text: "😅 高风险高回报", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        return "你关注投资风险——合理的资产配置能平衡收益与风险。";
      }
    },
    {
      id: "e428_wealth_wellbeing", phase: "street", _isChainEvent: false, icon: "💚",
      title: "财富与健康",
      story: "财富与健康相互影响——{desc}",
      triggers: { minDay: 70, excludeFlags: ["_e428WellbeingCooldown"] },
      conditions: function (st) { return !st.gameOver && st.status; },
      choices: [
        { text: "💪 健康是最大的财富", hint: "心智+4,心情+4", apply: function (st) {
          if (!st) return; st.flags._e428WellbeingCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💚 你理解财富与健康的关系——健康是1,财富是0。心智+4,心情+4。", "success");
        }},
        { text: "🤷 财富更重要", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "财富为健康提供保障,健康为财富提供基础";
        if (st.status && typeof st.status.health === "number" && st.status.health < 50) desc = "近期健康下滑,需要更多关注身体状况";
        return "财富与健康相互影响——" + desc + "。";
      }
    }
  ];
  for (var i = 0; i < EVENTS.length; i++) { if (!RANDOM_EVENTS.find(function (ev) { return ev.id === EVENTS[i].id; })) RANDOM_EVENTS.push(EVENTS[i]); }
})();

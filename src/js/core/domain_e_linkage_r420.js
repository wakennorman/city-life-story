/**
 * 域E(经济/投资) 联动增强 R420
 * 桥接：
 *   E→C  e420_investment_career       投资职业觉醒 → 投资经验→职业自信
 *   E→F  e420_portfolio_ui            投资组合UI → 持仓→UI摘要
 *   E→H  e420_corp_invest_loop        企业投资循环 → 公司→个人投资
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR420Loaded) return;
  RANDOM_EVENTS._domainELinkageR420Loaded = true;
  function grantXp(key, amt) { if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} } }
  var EVENTS = [
    {
      id: "e420_investment_career", phase: "street", _isChainEvent: false, icon: "💼",
      title: "投资经验反哺职业",
      story: "投资经验让你在职场更有底气——{desc}",
      triggers: { minDay: 80, excludeFlags: ["_e420CareerCooldown"] },
      conditions: function (st) { return !st.gameOver && st.investment; },
      choices: [
        { text: "📈 投资视野开阔了职业格局", hint: "心智+4,management XP+3", apply: function (st) {
          if (!st) return; st.flags._e420CareerCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          grantXp("management", 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 投资视野开阔了职业格局。心智+4,管理XP+3。", "success");
        }},
        { text: "🤷 投资和职业是两码事", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "投资中的风险判断力,让职场决策更加从容";
        if (st.investment && (st.investment._totalInvestmentProfit || 0) > 0) desc = "投资盈利增强了你的财务自信,职场表现更加从容";
        return "投资经验让你在职场更有底气——" + desc;
      }
    },
    {
      id: "e420_portfolio_ui", phase: "street", _isChainEvent: false, icon: "📊",
      title: "投资组合一览",
      story: "你查看了投资组合——{desc}",
      triggers: { minDay: 55, excludeFlags: ["_e420UiCooldown"] },
      conditions: function (st) { return !st.gameOver && st.investment; },
      choices: [
        { text: "📊 关注资产配置", hint: "心智+3,accounting XP+3", apply: function (st) {
          if (!st) return; st.flags._e420UiCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          grantXp("accounting", 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你审视了投资组合——合理的资产配置是稳健收益的基础。心智+3,会计XP+3。", "success");
        }},
        { text: "🤷 长期持有不用看", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        var parts = [];
        if (st.investment.stockHoldings && st.investment.stockHoldings.length > 0) parts.push(st.investment.stockHoldings.length + "只股票");
        if (st.investment.btcHoldings && st.investment.btcHoldings > 0) parts.push("数字货币");
        if (st.investment.properties && st.investment.properties.length > 0) parts.push(st.investment.properties.length + "套房产");
        var desc = parts.length > 0 ? "当前持有:" + parts.join("+") : "投资组合正在建立中";
        return "你查看了投资组合——" + desc + "。";
      }
    },
    {
      id: "e420_corp_invest_loop", phase: "corporate", _isChainEvent: false, icon: "🔄",
      title: "企业反哺个人投资",
      story: "公司经验反哺个人投资——{desc}",
      triggers: { minDay: 95, excludeFlags: ["_e420LoopCooldown"] },
      conditions: function (st) { return !st.gameOver && st.player && st.player.corporate && st.investment; },
      choices: [
        { text: "📈 公司经验是最好的投资教材", hint: "accounting XP+5,心智+3", apply: function (st) {
          if (!st) return; st.flags._e420LoopCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          grantXp("accounting", 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 公司经验反哺个人投资——实战是最好的老师。会计XP+5,心智+3。", "success");
        }},
        { text: "🤷 公司钱和个人钱要分开", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "经营公司积累的财务分析能力,让个人投资决策更加理性";
        return "公司经验反哺个人投资——" + desc + "。";
      }
    }
  ];
  for (var i = 0; i < EVENTS.length; i++) { if (!RANDOM_EVENTS.find(function (ev) { return ev.id === EVENTS[i].id; })) RANDOM_EVENTS.push(EVENTS[i]); }
})();

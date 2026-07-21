/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强 · R92
 * 全系统优化 loop R92 · 联动增强 2项
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR92) return;
  RANDOM_EVENTS._domainALinkageR92 = true;

  var A_EVENTS = [
    // ===== 联动1: A→C 技能溢价工资叙事 =====
    // 设计意图：技能等级影响工资的数值关系通过叙事让玩家感知，连接数据平衡与职业系统。
    {
      id: "skill_salary_premium_narrative",
      title: "技能溢价的回报",
      desc: "你发现随着技能提升，同样的活儿能拿到更多钱了。技能不只是数字，是真金白银的回报。",
      phase: "street",
      triggers: { minDay: 20 },
      conditions: function (st) {
        if (!st || !st.player || !st.skills || !st.flags) return false;
        if (st.flags._skillSalaryNarrativeSeen) return false;
        // 至少1个技能≥20级
        for (var key in st.skills) {
          if (st.skills[key] && st.skills[key].level >= 20) return true;
        }
        return false;
      },
      choices: [
        {
          text: "💰 继续深耕技能，期待更高回报",
          apply: function (st) {
            if (st.flags) st.flags._skillSalaryNarrativeSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "技能就是资本。你决定继续深耕，期待更高的回报。心智+3，智力+1。",
                "good"
              );
          },
        },
        {
          text: "🤔 考虑换个技能方向",
          apply: function (st) {
            if (st.flags) st.flags._skillSalaryNarrativeSeen = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你开始思考：哪个技能最值钱？换个方向会不会更好？智力+3。",
                "info"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动2: A→E 市场供需感知 =====
    // 设计意图：玩家对市场供需变化的感知，连接数据平衡与经济系统。
    {
      id: "market_supply_demand_sense",
      title: "市场的脉搏",
      desc: "你开始注意到市场上商品价格的变化规律。供需关系影响着每一次买卖的利润。",
      phase: "street",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.player || !st.trade || !st.flags) return false;
        if (st.flags._marketSenseSeen) return false;
        // 至少完成过3次交易
        return (st.trade.totalProfit || 0) > 0 && (st.player.day || 0) >= 30;
      },
      choices: [
        {
          text: "📊 开始记录价格波动规律",
          apply: function (st) {
            if (st.flags) st.flags._marketSenseSeen = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            }
            if (typeof getTradeIntelSystem === "function") {
              st.flags._tradeIntelUnlocked = true;
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你开始记录价格波动。市场有规律，关键在于发现它。智力+3。",
                "good"
              );
          },
        },
        {
          text: "😐 随行就市，不想那么多",
          apply: function (st) {
            if (st.flags) st.flags._marketSenseSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你决定随行就市。想太多反而累。心智+2。",
                "info"
              );
          },
        },
      ],
      probability: 0.03,
    },
  ];

  for (var i = 0; i < A_EVENTS.length; i++) {
    var evt = A_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions) evt.conditions = function () { return false; };
    RANDOM_EVENTS.push(evt);
  }
})();

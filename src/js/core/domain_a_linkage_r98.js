/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强 · R98
 * 全系统优化 loop R98 · 联动增强 2项
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR98) return;
  RANDOM_EVENTS._domainALinkageR98 = true;

  var A_EVENTS = [
    // ===== 联动1: A→G 财富里程碑叙事 =====
    {
      id: "wealth_milestone_reflection",
      title: "数字背后的意义",
      desc: "你看着账户里的数字，回想起一路走来的点点滴滴。每一个数字背后，都是一段经历。",
      phase: "street",
      triggers: { minDay: 50 },
      conditions: function (st) {
        if (!st || !st.player || !st.resources || !st.flags) return false;
        if (st.flags._wealthMilestoneSeen) return false;
        var totalAssets = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return totalAssets >= 100000;
      },
      choices: [
        {
          text: "💰 继续积累，向下一个目标进发",
          apply: function (st) {
            if (st.flags) st.flags._wealthMilestoneSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "十万块，是一个新的起点。你决定继续积累。心智+5。",
                "good"
              );
          },
        },
        {
          text: "🤔 反思钱的真正意义",
          apply: function (st) {
            if (st.flags) st.flags._wealthMilestoneSeen = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你开始思考：钱是手段，不是目的。智力+3，心智+3。",
                "info"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动2: A→F 数据可视化感知 =====
    {
      id: "data_visualization_sense",
      title: "看见自己的成长",
      desc: "你打开游戏里的数据面板，看到自己的属性和资产在稳步增长。这种可视化的成长，给了你继续前进的动力。",
      phase: "street",
      triggers: { minDay: 35 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._dataVizSenseSeen) return false;
        // 总资产≥¥20000且至少1个属性≥40
        var totalAssets = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        var hasHighStat = st.player.physique >= 40 || st.player.intelligence >= 40 ||
                          st.player.agility >= 40 || st.player.mental >= 40 || st.player.charm >= 40;
        return totalAssets >= 20000 && hasHighStat;
      },
      choices: [
        {
          text: "📊 继续追踪数据，优化成长路线",
          apply: function (st) {
            if (st.flags) st.flags._dataVizSenseSeen = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "数据是最好的反馈。你决定继续追踪，优化成长路线。智力+3。",
                "good"
              );
          },
        },
        {
          text: "🎯 设定下一个目标",
          apply: function (st) {
            if (st.flags) st.flags._dataVizSenseSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你设定了下一个目标。有目标，才有方向。心智+4。",
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

/**
 * 域C(职业/成长) 联动增强 R315
 * 第八轮循环——技能积累的多维回响。
 * 桥接：
 *   C→G  career_life_balance         职业→生活平衡（核心机制·身心健康）
 *   C→A  career_data_dashboard       职业→数据面板（数据/数值·信息展示）
 *   C→E  career_investment_confidence 职业→投资信心（经济·心理账户）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR315Loaded) return;
  RANDOM_EVENTS._domainCLinkageR315Loaded = true;

  var EVENTS = [
    {
      id: "career_life_balance",
      phase: "street",
      _isChainEvent: false,
      icon: "⚖️",
      title: "职业与生活的平衡",
      story: "你发现，过度投入工作开始影响你的生活——忽略了健康、疏远了朋友、失去了爱好。\n\n你开始思考：工作的目的是什么？是为了更好的生活，还是成了生活的全部？\n\n你决定设定一个「工作结束时间」，把更多的时间留给生活本身。\n\n「工作是为了更好地生活，而不是生活是为了工作。」",
      triggers: { minDay: 300, excludeFlags: ["_careerLifeBalanceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob || !st.needs || !st.status) return false;
        return (st.career.currentJob.workDays || 0) >= 200 && ((st.needs.happiness || 50) < 50 || (st.status.health || 100) < 55);
      },
      choices: [
        {
          text: "⚖️ 设定工作结束时间",
          hint: "心情+15，健康+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerLifeBalanceSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("⚖️ 你设定了工作结束时间。工作是为了更好地生活。心情+15，健康+10。", "success");
            }
          },
        },
        {
          text: "💼 工作更重要，继续拼",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerLifeBalanceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你选择继续拼。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "career_data_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "职业数据面板",
      story: "你打开职业数据面板，看到自己这些年的职业历程——技能成长曲线、收入变化趋势、工作天数统计。\n\n这些图表让你第一次直观地看到自己的职业轨迹——什么时候进步快、什么时候在停滞、什么时候需要调整方向。\n\n你开始用数据「驾驶」自己的职业发展，而不是凭感觉。",
      triggers: { minDay: 250, excludeFlags: ["_careerDataDashSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 150;
      },
      choices: [
        {
          text: "📊 设置职业发展提醒",
          hint: "心智+8，置职业面板flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataDashSeen = true;
            st.flags._careerDataDashboard = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了职业数据面板。数据让职业轨迹变得可见。心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 不用设置，心里有数",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataDashSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用设置。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // [全系统自洽修复] R434: 重命名重复id career_investment_confidence→_v2 (R260已定义)
      id: "career_investment_confidence_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "职业稳定带来的投资信心",
      story: "你的职业越来越稳定，收入也有了保障。这种「底气」开始影响你的投资决策。\n\n你不再为了一份工资忍气吞声，开始敢于表达自己的观点、争取自己的权益。\n\n你发现，经济独立带来的不仅是物质保障，更是精神自由。",
      triggers: { minDay: 300, excludeFlags: ["_careerInvConfidenceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob || !st.resources) return false;
        return (st.career.currentJob.workDays || 0) >= 180 && (st.resources.cash || 0) >= 8000;
      },
      choices: [
        {
          text: "💰 把底气带到投资中",
          hint: "心智+9，置投资信心flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerInvConfidenceSeen = true;
            st.flags._careerInvestmentConfidence = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你把职业底气带到了投资中。经济独立带来精神自由。心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 职业归职业，投资归投资",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerInvConfidenceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得职业和投资应该分开。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

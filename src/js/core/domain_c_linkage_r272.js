/**
 * 域C(职业/成长) 联动增强 R272
 * 技能积累的多维回响——技能不仅是赚钱工具，还在经济/社交/UI层面留下痕迹。
 * 桥接：
 *   C→A  skill_data_visualization  技能数据→数值面板（数据/数值·信息展示）
 *   C→E  skill_investment_insight   技能洞察→投资眼光（经济·知识迁移）
 *   C→F  skill_achievement_wall     技能成就→成就墙UI（UI/UX·自我呈现）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR272Loaded) return;
  RANDOM_EVENTS._domainCLinkageR272Loaded = true;

  function countHighSkillsC272(st, threshold) {
    threshold = threshold || 30;
    if (!st || !st.skills) return 0;
    var count = 0;
    for (var k in st.skills) {
      if ((st.skills[k] && st.skills[k].level || 0) >= threshold) count++;
    }
    return count;
  }

  var EVENTS = [
    {
      id: "skill_data_visualization",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "技能数据可视化",
      story: "你打开技能页面，看到自己这些年的技能成长曲线——从Lv.0到现在的每一个等级，都是一段奋斗的历史。\n\n这些数据和图表，是你在这座城市存在过的证据。每一条上升的曲线，都是你一天一天练出来的。",
      triggers: { minDay: 90, excludeFlags: ["_skillDataVizSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return countHighSkillsC272(st, 20) >= 2;
      },
      choices: [
        {
          text: "📊 截个图保存",
          hint: "心情+5，解锁技能面板flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillDataVizSeen = true;
            st.flags._skillDashboard = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你截下了技能成长曲线。这些线条，是你一点一滴攒出来的。心情+5。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续练",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillDataVizSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "skill_investment_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "技能洞察迁移投资",
      story: "你发现，多年积累的专业技能开始影响你的投资判断。\n\n一个懂编程的人能看懂科技公司的技术壁垒，一个懂财务的人能分析上市公司的报表。你的专业，成了你投资的「护城河」。",
      triggers: { minDay: 180, excludeFlags: ["_skillInvInsightSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.investment) return false;
        if (countHighSkillsC272(st, 50) < 1) return false;
        var totalInv = (st.investment.cash || 0) + (st.investment.bankBalance || 0);
        if (st.investment.stockHoldings) {
          for (var i = 0; i < st.investment.stockHoldings.length; i++) {
            totalInv += (st.investment.stockHoldings[i].shares || 0) * (st.investment.stockHoldings[i].avgPrice || 0);
          }
        }
        return totalInv >= 5000;
      },
      choices: [
        {
          text: "💡 用专业眼光选投资标的",
          hint: "心智+7，置投资意识flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillInvInsightSeen = true;
            st.flags._dataInvestorMindset = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💡 你用专业眼光选投资标的。知识就是最大的护城河。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 投资归投资，专业归专业",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillInvInsightSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得投资和专业应该分开。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "skill_achievement_wall",
      phase: "street",
      _isChainEvent: false,
      icon: "🏆",
      title: "技能成就墙",
      story: "你开始把自己获得的证书、技能等级、职业里程碑整理成一面「成就墙」。\n\n这面墙不仅是装饰，更是你在这座城市奋斗的见证。每一个证书、每一个等级，都是一段故事的浓缩。",
      triggers: { minDay: 120, excludeFlags: ["_skillAchWallSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var certCount = (st.certificates && st.certificates.length) || 0;
        return certCount >= 2 || countHighSkillsC272(st, 40) >= 2;
      },
      choices: [
        {
          text: "🏆 整理成成就墙",
          hint: "心情+8，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillAchWallSeen = true;
            st.flags._skillAchievementWall = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏆 你整理了技能成就墙。每一块砖，都是一段故事。心情+8，心智+5。", "success");
            }
          },
        },
        {
          text: "🤷 不用展示，自己知道就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillAchWallSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用展示。心智+3。", "info");
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

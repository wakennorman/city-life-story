/**
 * 域C(职业/成长) 联动增强 R290
 * 第五轮循环——技能积累的多维回响。
 * 桥接：
 *   C→H  skill_business_foundation   技能→创业基础（公司·技能变现）
 *   C→G  skill_health_benefit        技能→健康收益（核心机制·职业健康）
 *   C→A  skill_market_analysis       技能→市场分析（数据/数值·信息沉淀）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR290Loaded) return;
  RANDOM_EVENTS._domainCLinkageR290Loaded = true;

  function countHighSkillsC290(st, threshold) {
    threshold = threshold || 40;
    if (!st || !st.skills) return 0;
    var count = 0;
    for (var k in st.skills) {
      if ((st.skills[k] && st.skills[k].level || 0) >= threshold) count++;
    }
    return count;
  }

  var EVENTS = [
    {
      id: "skill_business_foundation",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🚀",
      title: "技能是创业的基础",
      story: "你发现，多年积累的技能是创业最坚实的基础。\n\n编程技能让你能快速验证产品想法，销售技能让你能拿到第一批客户，管理技能让你能带好团队。你不再是「只会打工的人」，而是「能创造价值的人」。\n\n你开始理解，打工不是目的，是积累创业资本的过程。",
      triggers: { minDay: 250, excludeFlags: ["_skillBizFoundationSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return countHighSkillsC290(st, 50) >= 2;
      },
      choices: [
        {
          text: "🚀 把技能转化为公司的核心竞争力",
          hint: "公司声誉+10，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillBizFoundationSeen = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 10;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🚀 你把技能转化为公司的核心竞争力。技能是最好的创业资本。声誉+10，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 技能和创业是两回事",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillBizFoundationSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得技能和创业是两回事。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "skill_health_benefit",
      phase: "street",
      _isChainEvent: false,
      icon: "💪",
      title: "技能对健康的益处",
      story: "你发现，某些技能对健康有直接的益处。\n\n烹饪技能让你能做出健康的饭菜，运动技能让你知道如何科学锻炼，医疗技能让你能及时处理小病小痛。\n\n你开始理解，技能不仅是赚钱工具，也是健康生活的「工具箱」。",
      triggers: { minDay: 180, excludeFlags: ["_skillHealthBenefitSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.status) return false;
        var hasHealthSkill = (st.skills.cooking && st.skills.cooking.level >= 30) ||
                             (st.skills.medicine && st.skills.medicine.level >= 20);
        return hasHealthSkill && (st.status.health || 100) < 70;
      },
      choices: [
        {
          text: "💪 用技能改善自己的健康",
          hint: "健康+10，心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillHealthBenefitSeen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你用技能改善自己的健康。技能是健康生活的工具箱。健康+10，心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 技能归技能，健康归健康",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillHealthBenefitSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得技能归技能，健康归健康。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "skill_market_analysis",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "技能驱动的市场分析",
      story: "你开始用专业技能分析市场趋势——编程技能让你能抓取数据，财务技能让你能分析报表，销售技能让你能感知客户需求。\n\n这些技能让你拥有「专业视角」，能看懂别人看不懂的市场机会。\n\n你开始理解，技能不仅是执行工具，也是分析框架。",
      triggers: { minDay: 200, excludeFlags: ["_skillMarketAnalysisSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.stats || !st.stats.actionFreq) return false;
        var totalTrades = (st.stats.actionFreq.buyGood || 0) + (st.stats.actionFreq.sellGood || 0);
        if (totalTrades < 20) return false;
        return countHighSkillsC290(st, 40) >= 1;
      },
      choices: [
        {
          text: "📊 用专业技能分析市场",
          hint: "心智+8，置市场分析flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillMarketAnalysisSeen = true;
            st.flags._skillDrivenMarketAnalysis = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用专业技能分析市场。技能是分析框架。心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 凭直觉就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillMarketAnalysisSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭直觉就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

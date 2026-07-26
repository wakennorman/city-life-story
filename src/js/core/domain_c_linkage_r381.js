/**
 * 域C(职业/成长) 联动增强 R381
 * 第十六轮循环——技能积累的多维回响。
 * 桥接：
 *   C→B  career_event_v5             职业→事件v5（事件/叙事·职业故事）
 *   C→E  career_skill_investment     职业→技能投资（经济·技能变现）
 *   C→G  career_health_v2            职业→健康v2（核心机制·身心平衡）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR381Loaded) return;
  RANDOM_EVENTS._domainCLinkageR381Loaded = true;

  var EVENTS = [
    {
      id: "career_event_v5",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "职业故事续集",
      story: "你的职业生涯又翻开了新的一页。\n\n每一次经历都在丰富你的职业故事——那些成功的喜悦、失败的教训、坚持的意义。\n\n你发现，职业不是一条直线，而是一本充满转折的小说。\n\n「最好的职业故事，往往是最曲折的那一本。」",
      triggers: { minDay: 60, excludeFlags: ["_careerEventV5Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        return !!(job && job.path && (job.workDays || 0) >= 60);
      },
      choices: [
        {
          text: "📖 续写职业故事",
          hint: "心情+8，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerEventV5Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你续写了职业故事。最好的职业故事往往是最曲折的那一本。心情+8，心智+5。", "success");
            }
          },
        },
        {
          text: "💼 继续工作",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerEventV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你继续工作。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_skill_investment",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "技能就是投资",
      story: "你在想，如果把花在学习技能上的时间和金钱看作一种投资，那回报率是多少？\n\n一个技能可以帮你找到更好的工作、赚更多的钱、打开更多的机会。\n\n你发现，技能投资是回报率最高的投资之一，因为它永远不属于市场，只属于你自己。\n\n「投资技能，是唯一不会被市场波动影响的投资。」",
      triggers: { minDay: 45, excludeFlags: ["_careerSkillInvestmentSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.skills);
      },
      choices: [
        {
          text: "📈 规划技能投资",
          hint: "心智+5，技能投资flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerSkillInvestmentSeen = true;
            st.flags._skillInvestmentPlan = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你规划了技能投资。投资技能是唯一不会被市场波动影响的投资。心智+5。", "success");
            }
          },
        },
        {
          text: "📚 先学再说",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerSkillInvestmentSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📚 你先学再说。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_health_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🏥",
      title: "工作的代价",
      story: "你发现，长时间的工作开始影响你的健康了。\n\n肩膀酸痛、视力下降、睡眠质量变差……这些都是身体在发出警告。\n\n你开始思考：工作是为了更好的生活，但如果工作毁了健康，那生活还有什么意义？\n\n「健康是1，其他都是后面的0。没有1，再多的0也没有意义。」",
      triggers: { minDay: 90, excludeFlags: ["_careerHealthV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 90 && (st.status && st.status.health || 100) < 65;
      },
      choices: [
        {
          text: "🏥 关注健康，调整工作节奏",
          hint: "健康+12，心智+4，心情+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerHealthV2Seen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏥 你关注健康，调整了工作节奏。健康是1，其他都是后面的0。健康+12，心智+4，心情+4。", "success");
            }
          },
        },
        {
          text: "💪 再坚持一下",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerHealthV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你再坚持一下。心智+2。", "warning");
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
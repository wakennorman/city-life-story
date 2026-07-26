/**
 * 域C(职业/成长) 联动增强 R298
 * 第六轮循环——技能积累的多维回响。
 * 桥接：
 *   C→B  career_event_resilience     职业→事件韧性（事件/叙事·逆境成长）
 *   C→G  career_health_awareness      职业→健康意识（核心机制·职业健康）
 *   C→A  career_data_visualization   职业→数据可视化（数据/数值·信息展示）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR298Loaded) return;
  RANDOM_EVENTS._domainCLinkageR298Loaded = true;

  var EVENTS = [
    {
      id: "career_event_resilience",
      phase: "street",
      _isChainEvent: false,
      icon: "💪",
      title: "职业逆境中的韧性",
      story: "你发现，职业生涯中的每一次挫折，都让你变得更强大。\n\n被拒绝、被解雇、被客户投诉——这些曾经让你崩溃的瞬间，现在看来都是成长的契机。你不再害怕失败，因为你知道——每一次跌倒，都是站起来变得更强的机会。\n\n「韧性不是天生的，是练出来的。」",
      triggers: { minDay: 250, excludeFlags: ["_careerEventResilienceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 200;
      },
      choices: [
        {
          text: "💪 感谢逆境让我成长",
          hint: "心情+12，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerEventResilienceSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你感谢逆境让你成长。韧性不是天生的，是练出来的。心情+12，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 不用感谢，继续前行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerEventResilienceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用感谢。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "career_health_awareness",
      phase: "street",
      _isChainEvent: false,
      icon: "❤️",
      title: "职业健康意识",
      story: "你开始关注自己的职业健康——长期久坐对颈椎的影响、加班对睡眠的损耗、压力对心理的侵蚀。\n\n你开始调整工作习惯：每小时起来活动一下、设定工作结束时间、学会说「不」。\n\n你意识到，健康是职业发展的「基础设施」。没有健康，一切归零。",
      triggers: { minDay: 200, excludeFlags: ["_careerHealthAwarenessSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.status || !st.needs || !st.career || !st.career.currentJob) return false;
        return (st.career.currentJob.workDays || 0) >= 150 && (st.status.health || 100) < 75;
      },
      choices: [
        {
          text: "❤️ 开始关注职业健康",
          hint: "健康+10，心情+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerHealthAwarenessSeen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("❤️ 你开始关注职业健康。健康是职业发展的基础设施。健康+10，心情+8。", "success");
            }
          },
        },
        {
          text: "🤷 工作重要，健康以后再说",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerHealthAwarenessSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得工作重要。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_data_viz",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "职业数据可视化",
      story: "你开始用数据可视化自己的职业历程——技能成长曲线、收入变化趋势、工作天数统计。\n\n这些图表让你第一次直观地看到自己的职业轨迹——什么时候进步快、什么时候在停滞、什么时候需要调整方向。\n\n你开始用数据「看见」自己的职业发展，而不是凭感觉。",
      triggers: { minDay: 180, excludeFlags: ["_careerDataVizSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 120;
      },
      choices: [
        {
          text: "📊 整理成职业数据面板",
          hint: "心智+7，置职业可视化flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataVizSeen = true;
            st.flags._careerDataVisualization = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你整理了职业数据面板。数据让职业轨迹变得可见。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 不用整理，心里有数",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataVizSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用整理。心智+2。", "info");
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

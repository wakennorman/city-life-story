/**
 * 域C(职业/成长) 联动增强 R282
 * 第四轮循环——技能积累的多维回响。
 * 桥接：
 *   C→G  career_burnout_recovery   职业倦怠→健康恢复（核心机制·身心平衡）
 *   C→A  career_data_feedback     职业数据→数值回馈（数据/数值·信息沉淀）
 *   C→B  career_life_chapter      职业历程→人生章节（事件/叙事·生命主线）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR282Loaded) return;
  RANDOM_EVENTS._domainCLinkageR282Loaded = true;

  var EVENTS = [
    {
      id: "career_burnout_recovery",
      phase: "street",
      _isChainEvent: false,
      icon: "🧘",
      title: "职业倦怠后的恢复",
      story: "你最近感觉特别累——不是身体累，是心累。每天重复的工作、看不到的尽头、机械式的日常。\n\n你决定给自己放一天假，不工作、不思考、只是好好休息。\n\n你发现，有时候停下来，是为了更好地前进。倦怠不是软弱，是身体在提醒你：该休息了。",
      triggers: { minDay: 200, excludeFlags: ["_careerBurnoutRecoverySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob || !st.needs || !st.status) return false;
        return (st.career.currentJob.workDays || 0) >= 180 && ((st.needs.happiness || 50) < 45 || (st.status.health || 100) < 50);
      },
      choices: [
        {
          text: "🧘 给自己放一天假",
          hint: "心情+12，健康+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerBurnoutRecoverySeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧘 你给自己放了一天假。停下来，是为了更好地前进。心情+12，健康+8。", "success");
            }
          },
        },
        {
          text: "💼 咬咬牙继续扛",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerBurnoutRecoverySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💼 你选择继续扛。但身体记住了这一次。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      id: "career_data_feedback",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "职业数据回馈",
      story: "你开始用数据审视自己的职业历程——工作天数、收入增长、技能提升速度。\n\n这些数字让你发现了一些有趣的规律：某些技能在特定阶段提升最快，某些工作日在特定时段收入最高。\n\n你开始用数据优化自己的职业路径，而不是盲目试错。",
      triggers: { minDay: 150, excludeFlags: ["_careerDataFeedbackSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 100;
      },
      choices: [
        {
          text: "📊 用数据优化职业路径",
          hint: "心智+7，置职业数据flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataFeedbackSeen = true;
            st.flags._careerDataDriven = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据优化职业路径。数据让选择更清晰。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 凭感觉走就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDataFeedbackSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭感觉走就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_life_chapter",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "职业历程是人生章节",
      story: "你回顾自己这些年的职业历程——从最初的打零工，到现在有了稳定的职业技能和收入。\n\n这一段经历，是你人生故事中不可或缺的一章。它教会了你坚持、教会了你成长、教会了你什么是「靠自己」。\n\n你开始理解，职业不仅是谋生手段，也是自我实现的途径。",
      triggers: { minDay: 365, excludeFlags: ["_careerLifeChapterSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 365;
      },
      choices: [
        {
          text: "📖 写下这一年的职业历程",
          hint: "心情+10，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerLifeChapterSeen = true;
            st.flags._careerJournalKeeper = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了这一年的职业历程。职业是自我实现的途径。心情+10，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerLifeChapterSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

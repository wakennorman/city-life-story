/**
 * 域G(核心机制/生命周期) 联动增强 R286
 * 第四轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→A  life_data_visualization   人生数据→可视化（数据/数值·信息展示）
 *   G→E  life_wealth_narrative      财富→人生叙事（经济·时间积累）
 *   G→B  life_career_chapter       职业→人生章节（事件/叙事·生命主线）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR286Loaded) return;
  RANDOM_EVENTS._domainGLinkageR286Loaded = true;

  var EVENTS = [
    {
      id: "life_data_visualization",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "人生数据可视化",
      story: "你打开人生数据面板，看到自己这些年的关键指标——工作天数、收入增长、健康趋势、社交密度。\n\n这些数字和图表，是你在这座城市存在过的证据。每一条曲线、每一个百分比，都是一段真实经历的浓缩。\n\n你开始用数据理解自己的人生，而不是用感觉。",
      triggers: { minDay: 365, excludeFlags: ["_lifeDataVizSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 365;
      },
      choices: [
        {
          text: "📊 截图保存这一刻",
          hint: "心情+8，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeDataVizSeen = true;
            st.flags._lifeDataVisualization = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你截下了人生数据面板。数据让人生变得可见。心情+8，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续生活",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeDataVizSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "life_wealth_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "财富积累的人生叙事",
      story: "你开始回顾自己的财富积累历程——第一个¥1000、第一个¥10000、第一个¥100000。\n\n每一个里程碑都是一段奋斗的历史。从口袋里揣着几百块来到这座城市，到现在有了一笔不小的积蓄。\n\n你发现，财富不仅是数字，更是你在这座城市努力活过的证据。",
      triggers: { minDay: 250, excludeFlags: ["_lifeWealthNarrSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return total >= 80000;
      },
      choices: [
        {
          text: "💰 写下财富积累的故事",
          hint: "心情+10，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthNarrSeen = true;
            st.flags._wealthNarrative = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你写下了财富积累的故事。财富是你努力活过的证据。心情+10，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续赚钱",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthNarrSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得赚钱比记录重要。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "life_career_chapter",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "职业历程是人生章节",
      story: "你回顾自己这些年的职业历程——从最初的打零工，到现在有了稳定的职业技能和收入。\n\n这一段经历，是你人生故事中不可或缺的一章。它教会了你坚持、教会了你成长、教会了你什么是「靠自己」。\n\n你开始理解，职业不仅是谋生手段，也是自我实现的途径。",
      triggers: { minDay: 365, excludeFlags: ["_lifeCareerChapterSeen"] },
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
            st.flags._lifeCareerChapterSeen = true;
            st.flags._careerChapterNarrative = true;
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
            st.flags._lifeCareerChapterSeen = true;
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

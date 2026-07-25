/**
 * 域C(职业/成长) 联动增强 R260
 * 技能积累的多维回响——技能不仅是赚钱工具，还在社交/经济/自我认知层面留下痕迹。
 * 桥接：
 *   C→D  skill_mentor_circle       技能分支解锁→行业圈子→已结识NPC好感（社交·圈子归属）
 *   C→E  career_investment_confidence 职业稳定→投资信心（经济·心理账户）
 *   C→F  career_progress_dashboard 职业积累→UI进度面板（UI/UX信息展示）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR260Loaded) return;
  RANDOM_EVENTS._domainCLinkageR260Loaded = true;

  var EVENTS = [
    {
      id: "skill_mentor_circle",
      phase: "street",
      _isChainEvent: false,
      icon: "👥",
      title: "同行圈子",
      story: "你的本事在圈子里传开了。开始有人主动来找你请教，也有人想跟你合作。\n\n你发现自己不再是一个人在战斗——身边聚集了一群志同道合的人。这种归属感，比赚到钱更让你踏实。",
      triggers: { minDay: 90, excludeFlags: ["_skillMentorCircleSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skillBranches || !st.relationships) return false;
        var branchCount = Object.keys(st.skillBranches).length;
        if (branchCount < 1) return false;
        var metNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met) metNpcs++;
        }
        return metNpcs >= 2;
      },
      choices: [
        {
          text: "🤝 主动组织聚会，加深联系",
          hint: "已结识NPC好感+3，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillMentorCircleSeen = true;
            for (var id in st.relationships) {
              if (st.relationships[id] && st.relationships[id].met) {
                if (typeof applyAffinityChange === "function") applyAffinityChange(st, id, 3, "同行圈子");
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你组织了一次同行聚会。圈子，是比简历更重要的资产。好感+3，心智+5。", "success");
            }
          },
        },
        {
          text: "🤫 顺其自然，不刻意经营",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._skillMentorCircleSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你觉得圈子不用刻意经营。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
    {
      id: "career_investment_confidence",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "职业稳定后的投资信心",
      story: "你的职业越来越稳定，收入也有了保障。你开始有了一笔「闲钱」——不是很多，但足够让你考虑一个问题：\n\n「是不是该让钱生钱了？」\n\n你想起那些因为没钱而错过的机会。现在，你终于有了选择的底气。",
      triggers: { minDay: 120, excludeFlags: ["_careerInvConfidenceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        if ((job.workDays || 0) < 90) return false;
        var totalAssets = (st.resources && st.resources.cash || 0) + (st.resources && st.resources.bankBalance || 0);
        return totalAssets >= 5000;
      },
      choices: [
        {
          text: "💰 拿出一小部分试试投资",
          hint: "置投资信心flag，现金-1000",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerInvConfidenceSeen = true;
            st.flags._dataInvestorMindset = true;
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你拿出¥1000准备试试投资。钱生钱的第一步，是迈出第一步。", "info");
            }
          },
        },
        {
          text: "🏦 还是存银行更踏实",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerInvConfidenceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏦 你觉得存银行更踏实。稳妥不是缺点。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "career_progress_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "职业进度面板",
      story: "你打开手机，看到自己这些年的职业历程——从最初的打零工，到现在有了稳定的职业技能和收入。\n\n这些数字和进度条，是你在这座城市存在过的证据。每一个百分比，都是你一天一天熬出来的。",
      triggers: { minDay: 60, excludeFlags: ["_careerDashboardSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 30;
      },
      choices: [
        {
          text: "📊 截个图保存",
          hint: "心情+5，解锁职业面板flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDashboardSeen = true;
            st.flags._careerDashboard = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你截下了职业进度面板。这些数字，是你一点一滴攒出来的。心情+5。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续干活",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerDashboardSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用形式化，继续干活。心智+2。", "info");
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

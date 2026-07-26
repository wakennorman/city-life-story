/**
 * 域B(事件/叙事) 联动增强 R314
 * 第八轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→G  event_life_milestone_marker_v2  事件→人生里程碑标记（核心机制·峰终定律）
 *   B→H  event_company_challenge          事件→公司挑战（公司·危机叙事）
 *   B→C  event_skill_inspiration          事件→技能灵感（职业/成长·经历催化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR314Loaded) return;
  RANDOM_EVENTS._domainBLinkageR314Loaded = true;

  var EVENTS = [
    {
      id: "event_life_milestone_marker_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🏅",
      title: "人生里程碑标记v2",
      story: "今天，你经历了一件值得记住的事——也许是第一次赚到¥1000，也许是第一次被老板表扬，也许是第一次在深夜觉得自己长大了。\n\n你拿出手机，把这个里程碑标记在时间线上。不是为了炫耀，而是为了在未来的某一天，当你怀疑自己时，可以翻回这一页，告诉自己：「我已经走了这么远。」",
      triggers: { minDay: 400, excludeFlags: ["_eventLifeMilestoneMarkerV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 60;
      },
      choices: [
        {
          text: "🏅 标记这个里程碑",
          hint: "心情+12，心智+9",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeMilestoneMarkerV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏅 你标记了人生里程碑。每一个值得被记住的瞬间，都是你存在的证明。心情+12，心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 不用标记，心里记得就行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeMilestoneMarkerV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用标记。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "event_company_challenge",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🔥",
      title: "公司危机事件",
      story: "公司遇到了前所未有的危机——大客户流失、现金流紧张、团队动荡。\n\n你站在十字路口：是裁员止损，还是借钱硬撑？\n\n这是你创业以来最艰难的选择题。不管结果如何，这一刻都值得被记住。\n\n「危机不是终点，是转折点的开始。」",
      triggers: { minDay: 350, excludeFlags: ["_eventCompanyChallengeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.risk || 0) > 65;
      },
      choices: [
        {
          text: "🔥 裁员止损，稳住现金流",
          hint: "公司风险-15，声誉-5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCompanyChallengeSeen = true;
            if (st.startup && st.startup.company) {
              st.startup.company.risk = Math.max(0, (st.startup.company.risk || 0) - 15);
              st.startup.company.reputation = Math.max(0, (st.startup.company.reputation || 0) - 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔥 你选择了裁员止损。危机不是终点，是转折点的开始。风险-15，声誉-5。", "warning");
            }
          },
        },
        {
          text: "💪 借钱硬撑，相信团队",
          hint: "现金-20000，公司声誉+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCompanyChallengeSeen = true;
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 20000);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你选择借钱硬撑。创业者，有时候需要一点疯狂。现金-20000，声誉+8。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "event_skill_inspiration",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "事件激发技能灵感",
      story: "你发现，某些随机事件会激发你的技能灵感——一个关于技术的新闻让你想学习编程，一个关于美食的故事让你想研究烹饪，一个关于管理的案例让你想提升领导力。\n\n你开始主动从事件中提取「技能灵感」，而不是被动等待机会。\n\n「经历不仅是故事，也是学习的素材。」",
      triggers: { minDay: 250, excludeFlags: ["_eventSkillInspSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.career || !st.career.currentJob) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 35;
      },
      choices: [
        {
          text: "💡 从事件中提取技能灵感",
          hint: "最高技能XP+12，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventSkillInspSeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💡 你从事件中提取了技能灵感。经历是学习的素材。技能XP+12，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 事件是事件，学习是学习",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventSkillInspSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得事件和学习应该分开。心智+3。", "info");
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

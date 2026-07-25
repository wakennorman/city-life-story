/**
 * 域H(Phase2/公司) 联动增强 R265
 * 公司运营的多维回响——公司不仅是赚钱机器，还在文化/创始人成长/叙事层面留下痕迹。
 * 桥接：
 *   H→H  company_culture_evolution 公司文化演化→内部动态（公司·文化闭环）
 *   H→G  founder_legacy            创始人传承→个人成长（核心机制·人生主线）
 *   H→B  company_crisis_narrative  公司危机→叙事事件（事件/叙事·戏剧张力）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR265Loaded) return;
  RANDOM_EVENTS._domainHLinkageR265Loaded = true;

  var EVENTS = [
    {
      id: "company_culture_evolution",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏛️",
      title: "文化在生长",
      story: "你发现公司的文化不是写在墙上的标语，而是活在每个人的日常里。\n\n有人主动加班不是因为制度，是因为「我们就是这样做事的」。有人带新人不是因为任务，是因为「当年有人这样带我」。\n\n文化不是管理的结果，是时间的沉淀。",
      triggers: { minDay: 200, excludeFlags: ["_companyCultureEvolvedSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        if (!st.startup.company.culture) return false;
        return st.startup.company.team && st.startup.company.team.length >= 4;
      },
      choices: [
        {
          text: "🏛️ 让文化自然生长",
          hint: "公司声誉+8，心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyCultureEvolvedSeen = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏛️ 你选择让文化自然生长。最好的文化不是设计出来的，是长出来的。声誉+8，心智+6。", "success");
            }
          },
        },
        {
          text: "📋 主动引导文化方向",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyCultureEvolvedSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你决定主动引导文化方向。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
    {
      id: "founder_legacy",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌱",
      title: "创始人传承",
      story: "你开始带新人，把自己这些年踩过的坑、总结的经验，一点一点传下去。\n\n「我当年就是因为不懂这个，亏了三个月的利润。」\n\n你突然意识到，传承不是复制，是让更多人少走弯路。这是比赚钱更有成就感的事。",
      triggers: { minDay: 250, excludeFlags: ["_founderLegacySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        if (!st.startup.company.team || st.startup.company.team.length < 3) return false;
        var highSkill = false;
        if (st.skills) {
          for (var k in st.skills) {
            if ((st.skills[k] && st.skills[k].level || 0) >= 50) { highSkill = true; break; }
          }
        }
        return highSkill;
      },
      choices: [
        {
          text: "🌱 认真带新人",
          hint: "最高技能XP+20，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._founderLegacySeen = true;
            st.flags._mentorCount = (st.flags._mentorCount || 0) + 1;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 20);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌱 你认真带了新人。传承是比赚钱更有成就感的事。技能XP+20，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 让新人自己摸索",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._founderLegacySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得让新人自己摸索更好。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "company_crisis_narrative",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🔥",
      title: "公司危机",
      story: "公司遇到了前所未有的危机——大客户流失、现金流紧张、团队动荡。\n\n你站在十字路口：是裁员止损，还是赌一把？\n\n这是你创业以来最难的选择题。不管结果如何，这一刻都值得被记住。",
      triggers: { minDay: 300, excludeFlags: ["_companyCrisisSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        var company = st.startup.company;
        return (company.risk || 0) > 70 || (company.burnRate || 0) > 8000;
      },
      choices: [
        {
          text: "🔥 裁员止损，稳住现金流",
          hint: "公司风险-10，声誉-5，现金+5000",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyCrisisSeen = true;
            if (st.startup && st.startup.company) {
              st.startup.company.risk = Math.max(0, (st.startup.company.risk || 0) - 10);
              st.startup.company.reputation = Math.max(0, (st.startup.company.reputation || 0) - 5);
            }
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 5000;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔥 你选择了裁员止损。这是创业以来最难的决定。风险-10，现金+5000，声誉-5。", "warning");
            }
          },
        },
        {
          text: "💪 赌一把，借钱发工资",
          hint: "现金-3000，公司声誉+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyCrisisSeen = true;
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 3000);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你决定赌一把。创业者，有时候需要一点疯狂。现金-3000，声誉+5。", "info");
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

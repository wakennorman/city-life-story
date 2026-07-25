/**
 * 域B(事件/叙事) 联动增强 R266
 * 叙事积累的多维回响——事件不仅是文字泡，还在经济/职业/UI层面留下痕迹。
 * 桥接：
 *   B→E  news_investment_diary   新闻→投资日记→经济意识（经济·信息沉淀）
 *   B→C  event_career_synergy    事件→职业联动→技能成长（职业·经历变现）
 *   B→F  event_history_timeline  事件历史→时间线UI（UI/UX信息展示）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR266Loaded) return;
  RANDOM_EVENTS._domainBLinkageR266Loaded = true;

  var EVENTS = [
    {
      id: "news_investment_diary",
      phase: "street",
      _isChainEvent: false,
      icon: "📝",
      title: "投资日记",
      story: "你开始记录每天看到的财经新闻，以及它们对你生活的影响。\n\n「今天猪肉涨价了，我的买菜预算要调整。」「科技股涨了，我的基金跟着受益。」\n\n这些看似琐碎的记录，慢慢变成了你的投资直觉。你开始知道，新闻不只是新闻，它是你决策的参考。",
      triggers: { minDay: 120, excludeFlags: ["_newsInvDiarySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.activeNews || st.activeNews.length < 3) return false;
        return (st.resources && st.resources.cash || 0) >= 2000;
      },
      choices: [
        {
          text: "📝 认真记录每一条新闻",
          hint: "心智+6，置投资意识flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._newsInvDiarySeen = true;
            st.flags._dataInvestorMindset = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你开始写投资日记。信息就是财富。心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 看看就算了，不用记录",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._newsInvDiarySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得看看就够了。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "event_career_synergy",
      phase: "street",
      _isChainEvent: false,
      icon: "🔗",
      title: "事件与职业的联动",
      story: "你发现，很多随机事件其实和你的职业息息相关。\n\n一个关于食品安全的新闻让你开始关注食材质量，一个关于技术趋势的讨论让你想学习新技能。\n\n你不再把事件当作独立的故事，而是当作职业成长的催化剂。",
      triggers: { minDay: 150, excludeFlags: ["_eventCareerSynergySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 8;
      },
      choices: [
        {
          text: "🔗 主动寻找事件与职业的连接",
          hint: "心智+7，最高技能XP+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCareerSynergySeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔗 你开始主动寻找事件与职业的连接。经历就是资本。技能XP+10，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 事件是事件，工作是工作",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCareerSynergySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得事件和工作应该分开。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "event_history_timeline",
      phase: "street",
      _isChainEvent: false,
      icon: "📅",
      title: "事件时间线",
      story: "你打开手机，看到自己这些年经历的事件——有些让你笑，有些让你哭，有些让你成长。\n\n这些事件像时间线上的节点，串联起你在这座城市的人生。每一个节点，都是你存在过的证据。",
      triggers: { minDay: 180, excludeFlags: ["_eventTimelineSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 15;
      },
      choices: [
        {
          text: "📅 整理成时间线",
          hint: "心情+8，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventTimelineSeen = true;
            st.flags._eventTimelineUI = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📅 你整理了事件时间线。这些节点，串联起你的人生。心情+8，心智+5。", "success");
            }
          },
        },
        {
          text: "🤷 不用整理，记住就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventTimelineSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用整理，记住就好。心智+3。", "info");
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

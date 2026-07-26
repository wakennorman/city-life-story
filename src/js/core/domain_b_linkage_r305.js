/**
 * 域B(事件/叙事) 联动增强 R305
 * 第七轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→H  event_company_anniversary   事件→公司周年（公司·时间里程碑）
 *   B→G  event_life_reflection        事件→人生反思（核心机制·生命主线）
 *   B→A  event_data_pattern_v2        事件→数据模式（数据/数值·信息沉淀）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR305Loaded) return;
  RANDOM_EVENTS._domainBLinkageR305Loaded = true;

  var EVENTS = [
    {
      id: "event_company_anniversary",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🎉",
      title: "公司周年纪念",
      story: "今天是公司成立一周年。\n\n你站在办公室里，看着墙上的营业执照，想起刚创业时的窘迫——没有团队、没有客户、没有资金，只有一腔热血。\n\n一年后，你有了团队、有了客户、有了稳定的收入。这一年的经历，是你人生中最珍贵的一章。\n\n「创业不是短跑，是马拉松。」",
      triggers: { minDay: 400, excludeFlags: ["_eventCompanyAnniversarySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return st.player && st.player.day >= 400;
      },
      choices: [
        {
          text: "🎉 举办周年庆典",
          hint: "公司声誉+10，心情+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCompanyAnniversarySeen = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 10;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎉 你举办了公司周年庆典。创业不是短跑，是马拉松。声誉+10，心情+12。", "success");
            }
          },
        },
        {
          text: "🤷 不用庆祝，继续干活",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCompanyAnniversarySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用庆祝。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      id: "event_life_reflection",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "人生反思事件",
      story: "你经历了一件让你重新思考人生的事——也许是朋友的离开，也许是家人的电话，也许是深夜的独处。\n\n你开始思考：我来这座城市是为了什么？我现在过得开心吗？这是我想要的人生吗？\n\n这些问题没有标准答案，但思考本身就是成长。\n\n「人生不是找到答案，是学会提问。」",
      triggers: { minDay: 300, excludeFlags: ["_eventLifeReflectionSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 50;
      },
      choices: [
        {
          text: "📖 写下你的思考",
          hint: "心智+10，心情+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeReflectionSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了你的思考。人生不是找到答案，是学会提问。心智+10，心情+10。", "success");
            }
          },
        },
        {
          text: "🤫 不用想太多，继续生活",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeReflectionSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用想太多。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "event_data_pattern_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🔍",
      title: "事件数据的深度模式",
      story: "你开始深度分析自己经历的事件数据——不仅是频率和类型，还有事件之间的因果关系、时间间隔的规律、选择的长期影响。\n\n这些分析让你发现了一些更深层的模式：某些事件是「因」，某些事件是「果」，某些事件是「催化剂」。\n\n你开始用数据「理解」人生的因果链，而不是用命运。",
      triggers: { minDay: 350, excludeFlags: ["_eventDataPatternV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.actionFreq) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 60;
      },
      choices: [
        {
          text: "🔍 深度分析事件因果",
          hint: "心智+10，置因果分析flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataPatternV2Seen = true;
            st.flags._eventCausalAnalysis = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔍 你深度分析了事件因果。数据让人生有因可循。心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 事件是随机的，没有因果",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataPatternV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得事件是随机的。心智+3。", "info");
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

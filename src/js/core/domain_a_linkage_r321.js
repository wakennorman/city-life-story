/**
 * 域A(数据/数值平衡) 联动增强 R321
 * 第九轮循环——数据积累的多维回响。
 * 桥接：
 *   A→H  data_business_intelligence   数据→商业智能（公司·数据驱动经营）
 *   A→B  data_event_pattern_v3       数据→事件模式（事件/叙事·量化故事）
 *   A→G  data_health_lifestyle_v2     数据→健康生活方式（核心机制·精准健康）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR321Loaded) return;
  RANDOM_EVENTS._domainALinkageR321Loaded = true;

  var EVENTS = [
    {
      id: "data_business_intelligence",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "数据驱动的商业智能",
      story: "你开始用数据分析自己的商业决策——哪些产品最赚钱？哪些客户最有价值？哪些渠道效率最高？\n\n这些洞察让你发现了一些以前没注意到的市场机会。你开始用数据「看见」商业的本质，而不是凭感觉。\n\n「数据不会说谎，但需要会提问。」",
      triggers: { minDay: 400, excludeFlags: ["_dataBizIntelSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.stats || !st.stats.actionFreq) return false;
        return (st.stats.actionFreq.buyGood || 0) + (st.stats.actionFreq.sellGood || 0) >= 40;
      },
      choices: [
        {
          text: "📊 用数据指导商业决策",
          hint: "心智+10，公司声誉+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataBizIntelSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据指导商业决策。数据让商业本质变得可见。心智+10，声誉+8。", "success");
            }
          },
        },
        {
          text: "🤷 凭经验就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataBizIntelSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭经验就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "data_event_pattern_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🔍",
      title: "事件数据模式v3",
      story: "你开始深度分析自己经历的事件数据——不仅是频率和类型，还有事件之间的因果关系、时间间隔的规律、选择的长期影响。\n\n这些分析让你发现了一些更深层的模式：某些事件是「因」，某些事件是「果」，某些事件是「催化剂」。\n\n你开始用数据「理解」人生的因果链，而不是用命运。",
      triggers: { minDay: 500, excludeFlags: ["_dataEventPatternV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.actionFreq) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 80;
      },
      choices: [
        {
          text: "🔍 深度分析事件因果",
          hint: "心智+12，置因果分析flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataEventPatternV3Seen = true;
            st.flags._eventCausalAnalysisV3 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔍 你深度分析了事件因果。数据让人生有因可循。心智+12。", "success");
            }
          },
        },
        {
          text: "🤷 事件是随机的，没有因果",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataEventPatternV3Seen = true;
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
    {
      id: "data_health_lifestyle_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💪",
      title: "数据驱动的健康生活v2",
      story: "你开始用数据设计自己的健康生活方式——追踪睡眠、运动、饮食对心情和工作的影响。\n\n这些分析让你发现了一些精确的规律：某种运动时间让你睡得更好，某种饮食结构让你工作时更专注。\n\n你开始用数据「定制」自己的健康生活，而不是跟风。",
      triggers: { minDay: 350, excludeFlags: ["_dataHealthLifestyleV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.status || !st.needs || !st.stats) return false;
        return (st.stats.actionFreq && (st.stats.actionFreq.exercise || 0) >= 12);
      },
      choices: [
        {
          text: "💪 定制数据驱动的健康方案",
          hint: "健康+15，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataHealthLifestyleV2Seen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你定制了数据驱动的健康方案。数据让健康更精准。健康+15，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 健康生活不用那么精确",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataHealthLifestyleV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得健康生活不用那么精确。心智+3。", "info");
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

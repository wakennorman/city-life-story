/**
 * 域A(数据/数值平衡) 联动增强 R296
 * 第六轮循环——数据积累的多维回响。
 * 桥接：
 *   A→H  data_business_insight       数据→商业洞察（公司·数据驱动决策）
 *   A→G  data_lifestyle_optimization 数据→生活优化（核心机制·精准生活）
 *   A→B  data_narrative_pattern      数据→叙事模式（事件/叙事·量化故事）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR296Loaded) return;
  RANDOM_EVENTS._domainALinkageR296Loaded = true;

  var EVENTS = [
    {
      id: "data_business_insight",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "数据驱动的商业洞察",
      story: "你开始用数据分析自己的商业决策——哪些产品最赚钱？哪些客户最有价值？哪些渠道效率最高？\n\n这些洞察让你发现了一些以前没注意到的市场机会。你开始用数据「看见」商业的本质，而不是凭感觉。\n\n「数据不会说谎，但需要会提问。」",
      triggers: { minDay: 250, excludeFlags: ["_dataBizInsightSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.stats || !st.stats.actionFreq) return false;
        return (st.stats.actionFreq.buyGood || 0) + (st.stats.actionFreq.sellGood || 0) >= 30;
      },
      choices: [
        {
          text: "📊 用数据指导商业决策",
          hint: "心智+8，公司声誉+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataBizInsightSeen = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据指导商业决策。数据让商业本质变得可见。心智+8，声誉+5。", "success");
            }
          },
        },
        {
          text: "🤷 凭经验就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataBizInsightSeen = true;
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
      id: "data_lifestyle_optimization",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "数据驱动的生活优化",
      story: "你开始用数据优化自己的生活方式——追踪睡眠、运动、饮食、心情的相互关系。\n\n这些分析让你发现了一些精确的规律：某种运动时间让你睡得更好，某种饮食结构让你工作时更专注。\n\n你开始用数据「设计」自己的理想生活，而不是靠运气。",
      triggers: { minDay: 200, excludeFlags: ["_dataLifestyleOptSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.status || !st.needs || !st.stats) return false;
        return (st.stats.actionFreq && (st.stats.actionFreq.exercise || 0) >= 10);
      },
      choices: [
        {
          text: "🎯 设计数据驱动的理想生活",
          hint: "健康+10，心情+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataLifestyleOptSeen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎯 你设计了数据驱动的理想生活。数据让生活更精准。健康+10，心情+8。", "success");
            }
          },
        },
        {
          text: "🤷 生活不用那么精确",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataLifestyleOptSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得生活不用那么精确。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "data_narrative_pattern",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "数据中的叙事模式",
      story: "你开始分析自己经历的事件数据，发现了一些有趣的叙事模式。\n\n某些类型的事件总是出现在人生的特定阶段，某些选择总是导致相似的人生轨迹。这些模式不是命运，而是概率和选择的叠加。\n\n你开始用数据理解自己的人生故事，而不是用感觉。",
      triggers: { minDay: 300, excludeFlags: ["_dataNarrPatternSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 45;
      },
      choices: [
        {
          text: "📖 写下数据中的叙事模式",
          hint: "心智+9，心情+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataNarrPatternSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了数据中的叙事模式。数据让故事有迹可循。心智+9，心情+8。", "success");
            }
          },
        },
        {
          text: "🤷 故事不用分析",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataNarrPatternSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得故事不用分析。心智+3。", "info");
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

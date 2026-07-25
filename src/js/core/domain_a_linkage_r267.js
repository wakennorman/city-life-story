/**
 * 域A(数据/数值平衡) 联动增强 R267
 * 数据积累的多维回响——数值不仅是数字，还在健康/职业/UI层面留下痕迹。
 * 桥接：
 *   A→G  data_health_awareness   健康数据→健康自觉（核心机制·预防意识）
 *   A→C  market_knowledge_xp     市场知识→职业技能XP（职业·经历变现）
 *   A→F  price_alert_system      价格追踪→预警UI（UI/UX信息展示）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR267Loaded) return;
  RANDOM_EVENTS._domainALinkageR267Loaded = true;

  var EVENTS = [
    {
      id: "data_health_awareness",
      phase: "street",
      _isChainEvent: false,
      icon: "❤️",
      title: "健康自觉",
      story: "你开始关注自己的健康数据——睡眠时间、运动频率、饮食规律。\n\n这些数字让你意识到，身体不是可以无限透支的机器。你开始调整作息、注意饮食、适当运动。\n\n「预防胜于治疗」不是口号，是你用数据换来的觉悟。",
      triggers: { minDay: 90, excludeFlags: ["_dataHealthAwarenessSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.status || !st.needs) return false;
        return (st.stats && st.stats.actionFreq && st.stats.actionFreq.exercise || 0) >= 5;
      },
      choices: [
        {
          text: "❤️ 制定健康计划",
          hint: "健康+8，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataHealthAwarenessSeen = true;
            st.flags._healthBaselineKeeper = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("❤️ 你制定了健康计划。身体是革命的本钱。健康+8，心智+5。", "success");
            }
          },
        },
        {
          text: "🤷 顺其自然",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dataHealthAwarenessSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得顺其自然就好。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "market_knowledge_xp",
      phase: "street",
      _isChainEvent: false,
      icon: "📚",
      title: "市场知识变现",
      story: "这些年跑市场积累的经验，开始在你的职业中发挥作用。\n\n你知道什么时候该进货、什么时候该清仓、哪个摊位的价格最公道。这些书本上学不到的东西，成了你的核心竞争力。",
      triggers: { minDay: 120, excludeFlags: ["_marketKnowledgeXpSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.stats || !st.stats.actionFreq) return false;
        var totalTrades = (st.stats.actionFreq.buyGood || 0) + (st.stats.actionFreq.sellGood || 0);
        if (totalTrades < 20) return false;
        var topSkill = "", topLv = 0;
        for (var k in st.skills) {
          var lv = (st.skills[k] && st.skills[k].level) || 0;
          if (lv > topLv) { topLv = lv; topSkill = k; }
        }
        return topSkill === "sales" || topSkill === "management" || topSkill === "accounting";
      },
      choices: [
        {
          text: "📚 系统整理市场经验",
          hint: "最高商业技能XP+15，心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._marketKnowledgeXpSeen = true;
            var bizSkills = ["sales", "management", "accounting"];
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              if (bizSkills.indexOf(k) >= 0) {
                var lv = (st.skills[k] && st.skills[k].level) || 0;
                if (lv > topLv) { topLv = lv; topSkill = k; }
              }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📚 你系统整理了市场经验。知识就是力量。技能XP+15，心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 经验不用整理，用多了自然记住",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._marketKnowledgeXpSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得经验不用整理。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "price_alert_system",
      phase: "street",
      _isChainEvent: false,
      icon: "🔔",
      title: "价格预警",
      story: "你开始用手机记录每个地点的商品价格，设置价格提醒。\n\n「猪肉降到20以下就买」「啤酒涨到5以上就等等」。\n\n这些小小的价格预警，帮你省下了不少钱。积少成多，聚沙成塔。",
      triggers: { minDay: 60, excludeFlags: ["_priceAlertSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.visits) return false;
        var locCount = 0;
        for (var k in st.stats.visits) {
          if (st.stats.visits[k] > 0) locCount++;
        }
        return locCount >= 4;
      },
      choices: [
        {
          text: "🔔 设置价格预警",
          hint: "心智+5，解锁价格预警flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._priceAlertSeen = true;
            st.flags._priceAlertSystem = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔔 你设置了价格预警系统。省钱就是赚钱。心智+5。", "success");
            }
          },
        },
        {
          text: "🤷 不用那么复杂",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._priceAlertSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用那么复杂。心智+2。", "info");
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

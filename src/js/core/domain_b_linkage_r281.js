/**
 * 域B(事件/叙事) 联动增强 R281
 * 第四轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→H  event_milestone_narrative   事件→公司里程碑叙事（公司·叙事包装）
 *   B→G  event_health_narrative       事件→健康叙事（核心机制·情感温度）
 *   B→A  event_economic_narrative     事件→经济叙事（数据/数值·信息沉淀）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR281Loaded) return;
  if (RANDOM_EVENTS._domainBLinkageR281) return;
  RANDOM_EVENTS._domainBLinkageR281 = true;

  var EVENTS = [
    {
      id: "event_milestone_narrative",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🎉",
      title: "公司里程碑叙事",
      story: "今天，你的公司达成了一个重要的里程碑——也许是营收破百万，也许是团队突破50人，也许是产品上线一周年。\n\n你决定把这个时刻记录下来，不是作为冷冰冰的财报数据，而是作为一段有温度的故事。这个故事里，有团队的汗水、有客户的信任、有无数个加班的夜晚。\n\n「数字是结果，故事是意义。」",
      triggers: { minDay: 300, excludeFlags: ["_eventMilestoneNarrSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 50000 || (st.startup.company.valuation || 0) >= 500000;
      },
      choices: [
        {
          text: "🎉 写下这个里程碑的故事",
          hint: "心智+8，公司声誉+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventMilestoneNarrSeen = true;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎉 你写下了公司里程碑的故事。数字是结果，故事是意义。心智+8，声誉+5。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前进",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventMilestoneNarrSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "event_health_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "❤️",
      title: "健康事件的叙事包装",
      story: "你生了一场病，或者经历了一次健康危机。\n\n这段经历让你重新审视自己的生活方式——不再把健康当作理所当然，而是当作需要经营的资产。\n\n你开始理解，健康不仅是体质数值，更是生活质量的叙事。",
      triggers: { minDay: 180, excludeFlags: ["_eventHealthNarrSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.status || !st.needs) return false;
        return (st.status.health || 100) < 50 && (st.needs.happiness || 50) < 50;
      },
      choices: [
        {
          text: "❤️ 记录这段健康叙事",
          hint: "心情+10，健康+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventHealthNarrSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("❤️ 你记录了健康叙事。健康是需要经营的资产。心情+10，健康+5。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，养好就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventHealthNarrSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      id: "event_economic_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "经济事件的叙事化",
      story: "你开始把经济数据变成故事——不是冷冰冰的数字，而是有温度的人生经历。\n\n「那一年，我靠摆摊攒下了第一笔钱。」「那一次，我投资失败亏了三个月工资。」\n\n这些故事不仅是回忆，也是你理解经济规律的方式。",
      triggers: { minDay: 200, excludeFlags: ["_eventEconNarrSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return total >= 30000;
      },
      choices: [
        {
          text: "💰 写下经济故事",
          hint: "心情+8，心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventEconNarrSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你写下了经济故事。数字是结果，故事是意义。心情+8，心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，赚钱就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventEconNarrSeen = true;
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
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

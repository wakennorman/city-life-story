/**
 * 域B(事件/叙事) 联动增强 R348
 * 第十二轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→H  event_milestone_narrative   事件→公司里程碑（公司·叙事包装）
 *   B→G  event_life_chapter_v5       事件→人生章节（核心机制·生命主线）
 *   B→A  event_data_v3               事件→数据（数据/数值·信息沉淀）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR348Loaded) return;
  RANDOM_EVENTS._domainBLinkageR348Loaded = true;

  var EVENTS = [
    {
      id: "event_milestone_narrative_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🎉",
      title: "事件构成公司里程碑",
      story: "今天，你的公司达成了一个重要的里程碑——也许是营收破百万，也许是团队突破50人，也许是产品上线一周年。\n\n你决定把这个时刻记录下来，不是作为冷冰冰的财报数据，而是作为一段有温度的故事。这个故事里，有团队的汗水、有客户的信任、有无数个加班的夜晚。\n\n「数字是结果，故事是意义。」",
      triggers: { minDay: 600, excludeFlags: ["_eventMilestoneNarrSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 150000 || (st.startup.company.valuation || 0) >= 2000000;
      },
      choices: [
        {
          text: "🎉 写下这个里程碑的故事",
          hint: "心智+14，公司声誉+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventMilestoneNarrSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 14);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 12;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎉 你写下了公司里程碑的故事。数字是结果，故事是意义。心智+14，声誉+12。", "success");
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
      id: "event_life_chapter_v5",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "事件构成人生章节v5",
      story: "你回顾自己这些年经历的事件，发现它们构成了你人生故事的各个章节——生存、立足、选择、成长、转型、传承。\n\n每一个章节都有其主题和挑战，每一个事件都是这个章节的一个注脚。你开始理解，人生不是线性的，而是由无数个事件编织而成的「叙事网络」。\n\n「人生不是找到答案，是学会讲故事。」",
      triggers: { minDay: 800, excludeFlags: ["_eventLifeChapterV5Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 160;
      },
      choices: [
        {
          text: "📖 写下人生章节",
          hint: "心情+25，心智+16",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeChapterV5Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 16);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了人生章节。人生不是找到答案，是学会讲故事。心情+25，心智+16。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeChapterV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "event_data_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "事件数据v3",
      story: "你开始系统地记录和分析自己经历过的每一个事件——类型、频率、结果、教训。\n\n这些数据让你发现了一些有趣的规律：某些类型的事件总是在特定时期密集出现，某些选择总是导致更好的长期结果。\n\n你开始用数据理解自己的人生轨迹，而不是用感觉。",
      triggers: { minDay: 700, excludeFlags: ["_eventDataV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 140;
      },
      choices: [
        {
          text: "📊 建立事件数据库",
          hint: "心智+15，置事件分析flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataV3Seen = true;
            st.flags._eventDatabaseV4 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你建立了事件数据库。数据让人生有迹可循。心智+15。", "success");
            }
          },
        },
        {
          text: "🤷 不用那么系统",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用那么系统。心智+3。", "info");
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

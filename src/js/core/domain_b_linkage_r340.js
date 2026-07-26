/**
 * 域B(事件/叙事) 联动增强 R340
 * 第十一轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→A  event_data_v2               事件→数据（数据/数值·信息沉淀）
 *   B→G  event_life_chapter_v3       事件→人生章节（核心机制·生命主线）
 *   B→H  event_company_culture_v2    事件→公司文化（公司·企业叙事）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR340Loaded) return;
  RANDOM_EVENTS._domainBLinkageR340Loaded = true;

  var EVENTS = [
    {
      id: "event_data_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "事件数据v2",
      story: "你开始系统地记录和分析自己经历过的每一个事件——类型、频率、结果、教训。\n\n这些数据让你发现了一些有趣的规律：某些类型的事件总是在特定时期密集出现，某些选择总是导致更好的长期结果。\n\n你开始用数据理解自己的人生轨迹，而不是用感觉。",
      triggers: { minDay: 700, excludeFlags: ["_eventDataV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 120;
      },
      choices: [
        {
          text: "📊 建立事件数据库",
          hint: "心智+14，置事件分析flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataV2Seen = true;
            st.flags._eventDatabaseV3 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 14);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你建立了事件数据库。数据让人生有迹可循。心智+14。", "success");
            }
          },
        },
        {
          text: "🤷 不用那么系统",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataV2Seen = true;
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
    {
      id: "event_life_chapter_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "事件构成人生章节v3",
      story: "你回顾自己这些年经历的事件，发现它们构成了你人生故事的各个章节——生存、立足、选择、成长、转型、传承。\n\n每一个章节都有其主题和挑战，每一个事件都是这个章节的一个注脚。你开始理解，人生不是线性的，而是由无数个事件编织而成的「叙事网络」。\n\n「人生不是找到答案，是学会讲故事。」",
      triggers: { minDay: 600, excludeFlags: ["_eventLifeChapterV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 130;
      },
      choices: [
        {
          text: "📖 写下人生章节",
          hint: "心情+20，心智+14",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeChapterV3Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 14);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了人生章节。人生不是找到答案，是学会讲故事。心情+20，心智+14。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeChapterV3Seen = true;
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
      id: "event_company_culture_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏛️",
      title: "事件构成公司文化v2",
      story: "你开始收集公司的「文化故事」——团队一起熬过难关的故事、客户感谢信背后的故事、员工成长的故事。\n\n这些故事不仅是回忆，也是公司文化的载体。你决定把它们整理成一本「公司文化手册」，让每一个新员工都能感受到这份传承。\n\n「公司会倒闭，但故事会留下来。」",
      triggers: { minDay: 600, excludeFlags: ["_eventCompanyCultureV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.reputation || 0) >= 60;
      },
      choices: [
        {
          text: "🏛️ 整理成文化手册",
          hint: "心智+12，公司声誉+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCompanyCultureV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 12;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏛️ 你整理了公司文化手册。公司会倒闭，但故事会留下来。心智+12，声誉+12。", "success");
            }
          },
        },
        {
          text: "🤷 文化不用记录",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCompanyCultureV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得文化不用记录。心智+3。", "info");
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

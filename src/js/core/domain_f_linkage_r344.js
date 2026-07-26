/**
 * 域F(UI/UX) 联动增强 R344
 * 第十一轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→B  ui_event_journal_v3          事件→日记（事件/叙事·历史记录）
 *   F→D  ui_social_map_v3             社交→关系图谱（NPC/社交·网络可视化）
 *   F→G  ui_health_dashboard_v2       健康→仪表盘（核心机制·预防医学）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR344Loaded) return;
  RANDOM_EVENTS._domainFLinkageR344Loaded = true;

  var EVENTS = [
    {
      id: "ui_event_journal_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "事件日记v3",
      story: "你打开事件日记，看到自己这些年经历的所有事件——有些让你笑，有些让你哭，有些让你成长。\n\n这些事件在日记中按时间排列，形成了一部属于你的「城市浮生记」。\n\n你决定把这些故事写下来，不是为了发表，而是为了在未来的某一天，当你迷茫时，可以翻回这些页面，告诉自己：「我已经走过了这么远。」",
      triggers: { minDay: 600, excludeFlags: ["_uiEventJournalV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 140;
      },
      choices: [
        {
          text: "📖 写下事件日记",
          hint: "心情+20，心智+14",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiEventJournalV3Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 14);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了事件日记。文字让记忆变成历史。心情+20，心智+14。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，记住就好",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiEventJournalV3Seen = true;
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
      id: "ui_social_map_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🕸️",
      title: "社交关系图谱v3",
      story: "你打开社交关系图谱，看到自己认识的NPC之间的关系网络——谁和谁关系好、谁和谁有矛盾、谁是关键节点。\n\n这些关系在图谱上可视化，让你发现了一些以前没注意到的社交结构。你开始理解，社交不是点对点的连线，而是一张复杂的网。",
      triggers: { minDay: 550, excludeFlags: ["_uiSocialMapV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var metNpcs = 0;
        for (var id in st.relationships) if (st.relationships[id] && st.relationships[id].met) metNpcs++;
        return metNpcs >= 8;
      },
      choices: [
        {
          text: "🕸️ 整理成关系图谱",
          hint: "心智+12，解锁社交图谱flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiSocialMapV3Seen = true;
            st.flags._socialNetworkMapV3 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🕸️ 你整理了社交关系图谱。关系是张网，你是网上的节点。心智+12。", "success");
            }
          },
        },
        {
          text: "🤷 不用整理，心里有数",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiSocialMapV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用整理。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_health_dashboard_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "❤️",
      title: "健康仪表盘v2",
      story: "你打开健康仪表盘，看到自己这些年的健康趋势——体重变化、运动频率、睡眠质量、疾病记录。\n\n这些数字让你第一次直观地看到自己的健康轨迹——什么时候状态好、什么时候在透支、什么时候需要调整。\n\n你开始用数据「管理」自己的健康，而不是等到生病才重视。",
      triggers: { minDay: 500, excludeFlags: ["_uiHealthDashV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.status || !st.needs || !st.stats) return false;
        return (st.stats.actionFreq && (st.stats.actionFreq.exercise || 0) >= 18);
      },
      choices: [
        {
          text: "❤️ 设置健康预警",
          hint: "健康+15，心智+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiHealthDashV2Seen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("❤️ 你设置了健康仪表盘。数据让健康管理更科学。健康+15，心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用设置，感觉身体好就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiHealthDashV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得感觉比数据重要。心智+3。", "info");
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

/**
 * 域F(UI/UX) 联动增强 R277
 * 第三轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→G  ui_health_dashboard      健康数据→UI面板（核心机制·预防可视化）
 *   F→A  ui_market_intelligence    市场数据→数值分析（数据/数值·信息沉淀）
 *   F→D  ui_npc_relationship_web   NPC关系→关系网UI（NPC/社交·可视化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR277Loaded) return;
  RANDOM_EVENTS._domainFLinkageR277Loaded = true;

  var EVENTS = [
    {
      id: "ui_health_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "❤️",
      title: "健康仪表盘",
      story: "你开始用APP追踪自己的健康数据——睡眠、运动、饮食、心情。这些数字变成了一张张清晰的图表。\n\n你第一次直观地看到自己的健康趋势——什么时候状态好、什么时候在透支。数据让你更早发现问题，更早调整。\n\n「预防胜于治疗」从口号变成了可执行的计划。",
      triggers: { minDay: 120, excludeFlags: ["_uiHealthDashSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.status || !st.needs) return false;
        return (st.stats && st.stats.actionFreq && st.stats.actionFreq.exercise || 0) >= 3;
      },
      choices: [
        {
          text: "❤️ 设置健康提醒",
          hint: "健康+6，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiHealthDashSeen = true;
            st.flags._healthDashboard = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 6);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("❤️ 你设置了健康仪表盘。数据让健康管理更科学。健康+6，心智+5。", "success");
            }
          },
        },
        {
          text: "🤷 不用那么复杂",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiHealthDashSeen = true;
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
    {
      id: "ui_market_intelligence",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "市场情报面板",
      story: "你开始收集各地的商品价格、客流量、热门商品等数据，整理成一份「市场情报」。\n\n这份情报不仅是你的进货指南，也是你理解这座城市商业生态的窗口。你开始知道，哪些地点在什么时段最赚钱，哪些商品在哪些区域最畅销。\n\n「信息不对称」是最大的竞争优势。",
      triggers: { minDay: 150, excludeFlags: ["_uiMarketIntelSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.visits) return false;
        var locCount = 0;
        for (var k in st.stats.visits) if (st.stats.visits[k] > 0) locCount++;
        return locCount >= 5;
      },
      choices: [
        {
          text: "📊 整理成市场情报",
          hint: "心智+7，置市场意识flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiMarketIntelSeen = true;
            st.flags._marketIntelligence = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你整理了市场情报面板。信息就是竞争力。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 凭经验就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiMarketIntelSeen = true;
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
      id: "ui_npc_relationship_web",
      phase: "street",
      _isChainEvent: false,
      icon: "🕸️",
      title: "NPC关系图谱",
      story: "你开始整理自己认识的NPC——谁和谁关系好、谁和谁有矛盾、谁是关键节点。\n\n这些关系变成了一张可视化的图谱。你发现，社交不是点对点的连线，而是一张复杂的网。你是网上的一个节点，你的每一个动作都牵动着整张网的张力。",
      triggers: { minDay: 180, excludeFlags: ["_uiNpcWebSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var metNpcs = 0;
        for (var id in st.relationships) if (st.relationships[id] && st.relationships[id].met) metNpcs++;
        return metNpcs >= 5;
      },
      choices: [
        {
          text: "🕸️ 整理成关系图谱",
          hint: "心智+7，解锁NPC图谱flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiNpcWebSeen = true;
            st.flags._npcRelationshipWeb = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🕸️ 你整理了NPC关系图谱。关系是张网，你是网上的节点。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 不用整理，心里有数",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiNpcWebSeen = true;
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
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

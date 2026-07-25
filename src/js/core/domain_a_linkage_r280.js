/**
 * 域A(数据/数值平衡) 联动增强 R280
 * 第四轮循环——数据积累的多维回响。
 * 桥接：
 *   A→B  data_event_pattern       信息→事件模式（事件/叙事·数据驱动叙事）
 *   A→G  info_health_optimization   信息→健康优化（核心机制·数据驱动健康）
 *   A→D  info_npc_price_insight    信息→NPC价格洞察（NPC/社交·信息不对称）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR280Loaded) return;
  RANDOM_EVENTS._domainALinkageR280Loaded = true;

  var EVENTS = [
    {
      id: "info_event_pattern",
      phase: "street",
      _isChainEvent: false,
      icon: "🔍",
      title: "数据驱动叙事",
      story: "你开始用数据理解自己经历的事件——哪些类型的事件最常出现？哪些选择导致了最好的结果？\n\n这些分析让你发现，人生不是随机的，而是有规律可循的。你开始用数据指导选择，而不是凭直觉。\n\n「理性不是冷漠，是对自己负责。」",
      triggers: { minDay: 250, excludeFlags: ["_infoEventPatternSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        if (history.length < 30) return false;
        return st.player && st.player.day >= 250;
      },
      choices: [
        {
          text: "🔍 用数据指导未来选择",
          hint: "心智+8，置数据驱动flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._infoEventPatternSeen = true;
            st.flags._dataDrivenNarrative = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔍 你用数据指导选择。理性是对自己负责。心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 人生不需要那么理性",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._infoEventPatternSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得人生不需要那么理性。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "info_health_optimization",
      phase: "street",
      _isChainEvent: false,
      icon: "💪",
      title: "数据驱动健康优化",
      story: "你开始用数据优化自己的健康——追踪睡眠、运动、饮食对心情和工作的影响。\n\n你发现了一些有趣的规律：运动后第二天工作效率更高，睡眠不足时更容易做出冲动决定。\n\n你开始用数据设计自己的健康生活，而不是跟风。",
      triggers: { minDay: 180, excludeFlags: ["_infoHealthOptSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.status || !st.needs || !st.stats) return false;
        return (st.stats.actionFreq && (st.stats.actionFreq.exercise || 0) >= 5);
      },
      choices: [
        {
          text: "💪 制定数据驱动的健康计划",
          hint: "健康+10，心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._infoHealthOptSeen = true;
            st.flags._dataDrivenHealth = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你制定了数据驱动的健康计划。科学养生，从数据开始。健康+10，心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 健康生活不用那么复杂",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._infoHealthOptSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得健康生活不用那么复杂。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "info_npc_price_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "信息不对称的NPC洞察",
      story: "你发现，不同NPC对不同商品的价格感知差异很大。\n\n王阿姨觉得¥5的蔬菜很便宜，但¥20的衣服很贵。李工头觉得¥100的工具很值，但¥50的饭太贵。\n\n你开始利用这种「信息不对称」——不是欺骗，而是帮助NPC找到他们真正需要的东西。",
      triggers: { minDay: 150, excludeFlags: ["_infoNpcPriceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships || !st.stats || !st.stats.visits) return false;
        var metNpcs = 0;
        for (var id in st.relationships) if (st.relationships[id] && st.relationships[id].met) metNpcs++;
        if (metNpcs < 3) return false;
        var locCount = 0;
        for (var k in st.stats.visits) if (st.stats.visits[k] > 0) locCount++;
        return locCount >= 4;
      },
      choices: [
        {
          text: "💡 帮助NPC找到性价比最高的商品",
          hint: "已结识NPC好感+3，心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._infoNpcPriceSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met) {
                  applyAffinityChange(st, id, 3, "价格洞察帮助");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💡 你帮助NPC找到性价比最高的商品。信息就是价值。好感+3，心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 每个人自己会判断",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._infoNpcPriceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得每个人自己会判断。心智+3。", "info");
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

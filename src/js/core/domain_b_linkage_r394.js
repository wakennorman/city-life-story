/**
 * 域B(事件/叙事) 联动增强 R394
 * 第十七轮循环——事件的叙事回响:把玩家的选择历史/世界状态转化为新的叙事体验。
 * 桥接：
 *   B→F  b394_event_memory_wall   事件记忆墙 → 消费 _eventHistory 数据,
 *     把玩家经历过的关键事件转化为"人生故事墙"UI提示,mental+happiness
 *   B→A  b394_data_driven_narrative 数据驱动叙事 → 消费 goods定价+news 数据,
 *     市场价格波动触发"这个故事发生在特定经济背景下"的叙事风味
 *   B→G  b394_life_chapter_echo     人生章节回响 → 消费 story_chapters+_narrativeChoices,
 *     人生节点选择触发"当初的选择如何塑造了现在的你"的回顾叙事
 *
 * 严格照 domain_b_linkage_r388.js / r380.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR394Loaded) return;
  RANDOM_EVENTS._domainBLinkageR394Loaded = true;

  var EVENTS = [
    {
      // B→F: 事件记忆墙 — 消费 _eventHistory 数据
      id: "b394_event_memory_wall",
      phase: "street",
      _isChainEvent: false,
      icon: "🖼️",
      title: "事件记忆墙",
      story:
        "你翻看手机里记录的生活片段——{memorySummary}。\n\neventCount个瞬间,构成了你在这座城市的记忆。",
      triggers: { minDay: 75, excludeFlags: ["_b394MemoryWallCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 10;
      },
      choices: [
        {
          text: "📖 把这些记忆珍藏起来",
          hint: "心智+4,心情+5,置 _b394MemoryWallCooldown(120天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b394MemoryWallCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📖 你回顾了在这座城市的点点滴滴,每一段经历都是珍贵的记忆。心智+4,心情+5。", "success");
          }
        },
        {
          text: "💪 向前看,新的故事还在继续",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var history = (st.flags && st.flags._eventHistory) || [];
        var count = history.length;
        var summary = "从初来乍到到今天,你经历了许多";
        if (count >= 30) summary = "满满的回忆——你在这座城市经历了数不清的故事";
        else if (count >= 20) summary = "不少故事——这座城市给你留下了深刻的印记";
        return "你翻看手机里记录的生活片段——" + summary + "。\n\n" + count + "个瞬间,构成了你在这座城市的记忆。";
      }
    },
    {
      // B→A: 数据驱动叙事 — 消费 goods定价+news 数据
      id: "b394_data_driven_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "数字背后的人生",
      story:
        "你注意到最近{priceObservation}。{connectionInsight}\n\n每一个价格背后,都是无数人的人生。",
      triggers: { minDay: 50, excludeFlags: ["_b394DataNarrativeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.trade || !st.trade.currentLocation) return false;
        // 需要有一定交易经验
        var totalTrades = (st.trade._totalBought || 0) + (st.trade._totalSold || 0);
        return totalTrades >= 5;
      },
      choices: [
        {
          text: "🤔 从数字中读出人情冷暖",
          hint: "心智+3,accounting XP+3,置 _b394DataNarrativeCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b394DataNarrativeCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof addSkillXp === "function") {
              try { addSkillXp("accounting", 3); } catch(e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📊 你学会了从市场数据中读出人情冷暖。心智+3,会计XP+3。", "success");
          }
        },
        {
          text: "🤷 数字只是数字",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.trade) return null;
        var obs = "市场价格的波动牵动着每个人的神经";
        // 尝试读取当前新闻/市场事件
        if (st.trade.marketEvents && st.trade.marketEvents.length > 0) {
          var evt = st.trade.marketEvents[0];
          obs = "「" + (evt.name || "市场异动") + "」正在影响商品价格";
        }
        var insight = "菜价涨了,可能是产地遭了灾;房价跌了,可能是政策在调整。";
        if (st.flags && st.flags._eraState && st.flags._eraState.inflationIndex > 1.2) {
          insight = "通胀压力下,每一分钱都要精打细算。";
        }
        return "你注意到最近" + obs + "。" + insight + "\n\n每一个价格背后,都是无数人的人生。";
      }
    },
    {
      // B→G: 人生章节回响 — 消费 story_chapters+_narrativeChoices
      id: "b394_life_chapter_echo",
      phase: "street",
      _isChainEvent: false,
      icon: "📜",
      title: "人生章节的回响",
      story:
        "你回想起当初的一个选择——{choiceMemory}。\n\n当时的决定,如今看来{retrospectiveInsight}。",
      triggers: { minDay: 100, excludeFlags: ["_b394ChapterEchoCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要有故事章节数据或叙事选择记录
        var hasChoices = st.flags && (
          (st.flags._narrativeChoices && st.flags._narrativeChoices.length > 0) ||
          st.flags._lifeChoicesAcknowledged ||
          (st.flags._eventHistory && st.flags._eventHistory.length >= 15)
        );
        return hasChoices ? true : false;
      },
      choices: [
        {
          text: "🌟 感恩当初的选择",
          hint: "心智+5,心情+4,置 _b394ChapterEchoCooldown(150天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b394ChapterEchoCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🌟 你感恩当初的每一个选择——它们塑造了今天的你。心智+5,心情+4。", "achievement");
          }
        },
        {
          text: "😌 人生没有白走的路",
          hint: "心情+3",
          apply: function (st) {
            if (st && st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var memory = "在那个十字路口你做出了自己的选择";
        var insight = "时间证明了它的价值";
        if (st.flags && st.flags._narrativeChoices && st.flags._narrativeChoices.length > 0) {
          memory = "你曾经面临" + st.flags._narrativeChoices.length + "次重要抉择";
          insight = "每一次选择都在悄然改变着人生的轨迹";
        }
        return "你回想起当初的一个选择——" + memory + "。\n\n当时的决定,如今看来" + insight + "。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();

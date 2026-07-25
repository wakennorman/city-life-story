/**
 * 域A(数据/数值平衡) 联动增强 R258
 * 数据积累的多维回响——数值不仅是数字，还在UI/叙事/自我认知层面留下痕迹。
 * 桥接：
 *   A→G  market_intuition       多次交易后培养市场直觉→交易时获得微小价格优势（核心机制·熟练度红利）
 *   A→F  price_comparison_tool  访问≥3个地点→解锁比价视图（UI/UX信息展示）
 *   A→B  economic_milestone     存款达到里程碑→叙事事件（事件/叙事·财务峰终）
 *
 * 严格照 domain_a_linkage_r242.js 已验证 IIFE 注入范式：
 *   显式 phase、RANDOM_EVENTS 守卫、triggers 用引擎白名单字段、
 *   conditions 全字段防御、gameOver 闸门、apply 内自理副作用。
 * 真实字段核实：
 *   交易统计 st.stats.*（actionFreq、trades、visits）；
 *   现金 st.resources.cash；存款 st.resources.bankBalance；
 *   心智 st.player.mental；心情 st.needs.happiness；
 *   标志 _marketIntuitionSeen / _priceComparisonSeen / _economicMilestoneSeen（去重）。
 *   数值标 [PLACEHOLDER] 待平衡组校准。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR258Loaded) return;
  RANDOM_EVENTS._domainALinkageR258Loaded = true;

  // 计算玩家访问过的不同地点数量
  function countVisitedLocationsA258(st) {
    if (!st || !st.stats || !st.stats.visits) return 0;
    var count = 0;
    for (var k in st.stats.visits) {
      if (Object.prototype.hasOwnProperty.call(st.stats.visits, k) && st.stats.visits[k] > 0) count++;
    }
    return count;
  }

  // 计算总交易次数
  function countTotalTradesA258(st) {
    if (!st || !st.stats || !st.stats.actionFreq) return 0;
    var total = 0;
    var tradeActions = ["buyGood", "sellGood", "buyWholesale", "sellWholesale"];
    for (var i = 0; i < tradeActions.length; i++) {
      total += st.stats.actionFreq[tradeActions[i]] || 0;
    }
    return total;
  }

  var EVENTS = [
    {
      // A→G: 多次交易后培养市场直觉→交易时获得微小价格优势（核心机制·熟练度红利）
      id: "market_intuition",
      phase: "street",
      _isChainEvent: false,
      icon: "🧠",
      title: "市场直觉",
      story:
        "这些年你经手了无数次买卖，数字在你眼里开始有了韵律。\n\n哪个摊位的价格公道，哪个时段的货品质好，哪个老板可以砍价——这些判断已经变成了你的本能。\n\n你不再需要计算器，因为你的「市场直觉」已经替你做了大部分工作。",
      triggers: { minDay: 60, excludeFlags: ["_marketIntuitionSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 至少完成20次交易
        return countTotalTradesA258(st) >= 20;
      },
      choices: [
        {
          text: "🧠 把直觉变成系统",
          hint: "心智+5，解锁市场直觉flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._marketIntuitionSeen = true;
            st.flags._marketIntuition = true; // 解锁市场直觉flag（供pricing.js读取）
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧠 你把多年交易经验内化为「市场直觉」。以后买卖时，你会本能地知道什么是好价格。心智+5。", "success");
            }
          },
        },
        {
          text: "🤷 直觉不够，还是得算",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._marketIntuitionSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得直觉不可靠，还是用计算器更踏实。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      // A→F: 访问≥3个地点→解锁比价视图（UI/UX信息展示）
      id: "price_comparison_tool",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "货比三家",
      story:
        "你在这片城区走南闯北，去过不少地方。现在你发现，同样的东西在不同的地方价格差得离谱。\n\n你开始用手机记录每个地点的价格——不是为了占便宜，而是为了不再被坑。\n\n「货比三家」不再是老生常谈，而是你的生存技能。",
      triggers: { minDay: 30, excludeFlags: ["_priceComparisonSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 访问过≥3个不同地点
        return countVisitedLocationsA258(st) >= 3;
      },
      choices: [
        {
          text: "📊 整理成比价表",
          hint: "心智+4，解锁比价视图flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._priceComparisonSeen = true;
            st.flags._priceComparisonTool = true; // 解锁比价视图flag（供UI展示）
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你整理了一份城区比价表。以后买东西前，你知道该去哪里最划算。心智+4。", "success");
            }
          },
        },
        {
          text: "🤷 没必要，差不多就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._priceComparisonSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得没必要这么精细，差不多就行。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // A→B: 存款达到里程碑→叙事事件（事件/叙事·财务峰终）
      id: "economic_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "存款里程碑",
      story:
        "你打开银行APP，看到余额后面有好几个零。\n\n这个数字，一年前的你想都不敢想。那时候你口袋里揣着几百块来到这座城市，连住一晚旅馆都要算计。\n\n现在的你，终于有了一点点「安全感」。不是很多，但足够让你在某些深夜，睡得稍微踏实一点。",
      triggers: { minDay: 90, excludeFlags: ["_economicMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var totalAssets = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        // 总资产达到¥50,000
        return totalAssets >= 50000;
      },
      choices: [
        {
          text: "💰 给自己买件像样的衣服",
          hint: "心情+10，现金-500",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._economicMilestoneSeen = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            }
            if (st.resources) {
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你给自己买了一件像样的衣服。这是你在这座城市第一次为自己花钱而不是为生存。心情+10。", "success");
            }
          },
        },
        {
          text: "📈 继续攒钱，安全感比面子重要",
          hint: "心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._economicMilestoneSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你选择继续攒钱。安全感比面子重要。心智+5。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
  ];

  // 注入全局事件池
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

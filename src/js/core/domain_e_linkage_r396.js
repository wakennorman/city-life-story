/**
 * 域E(经济/投资) 联动增强 R396
 * 第十七轮循环——投资系统的数据回响:把隐藏在investment/portfolio中的数据转化为叙事体验。
 * 桥接：
 *   E→F  e396_portfolio_glance   投资面板一瞥 → 消费 investment.stockHoldings/btcHoldings/properties 数据,
 *     把持仓数据转化为"我的投资组合"UI摘要,mental+happiness
 *   E→B  e396_investment_story    投资故事 → 消费 _totalInvestmentProfit+_consecutiveWins 数据,
     投资盈亏→"我的投资人生故事"叙事回响,management XP
 *   E→G  e396_financial_stress     财务压力回响 → 消费 investment+needs 数据,
 *     投资亏损→"财务焦虑"影响心情的负面反馈
 *
 * 严格照 domain_e_linkage_r383.js / r375.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR396Loaded) return;
  RANDOM_EVENTS._domainELinkageR396Loaded = true;

  // 安全技能经验
  function grantSkillXpR396(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  // 计算投资组合摘要
  function portfolioSummaryR396(st) {
    var inv = st.investment || {};
    var hasStocks = inv.stockHoldings && inv.stockHoldings.length > 0;
    var hasBtc = inv.btcHoldings && inv.btcHoldings > 0;
    var hasProps = inv.properties && inv.properties.length > 0;
    var count = (hasStocks ? 1 : 0) + (hasBtc ? 1 : 0) + (hasProps ? 1 : 0);
    return { hasStocks: hasStocks, hasBtc: hasBtc, hasProps: hasProps, count: count,
             totalProfit: inv._totalInvestmentProfit || 0 };
  }

  var EVENTS = [
    {
      // E→F: 投资面板一瞥 — 消费 investment 数据
      id: "e396_portfolio_glance",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "投资面板一瞥",
      story:
        "你打开投资账户看了一眼——{portfolioSummary}\n\n{performanceInsight}",
      triggers: { minDay: 60, excludeFlags: ["_e396PortfolioCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var p = portfolioSummaryR396(st);
        return p.count >= 1; // 至少有一种投资
      },
      choices: [
        {
          text: "📈 关注长期价值",
          hint: "心智+3,置 _e396PortfolioCooldown(60天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e396PortfolioCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📊 你审视了自己的投资组合,关注长期价值而非短期波动。心智+3。", "success");
          }
        },
        {
          text: "😅 眼不见为净",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var p = portfolioSummaryR396(st);
        var parts = [];
        if (p.hasStocks) parts.push("股票");
        if (p.hasBtc) parts.push("数字货币");
        if (p.hasProps) parts.push("房产");
        if (parts.length > 0) summary = "你持有" + parts.join("、");
        var insight = "";
        if (p.totalProfit > 0) insight = "总体盈利,投资决策带来了回报。";
        else if (p.totalProfit < 0) insight = "暂时亏损,但投资是一场马拉松。";
        else insight = "投资组合正在建立中。";
        return "你打开投资账户看了一眼——" + summary + "。\n\n" + insight;
      }
    },
    {
      // E→B: 投资故事 — 消费 _totalInvestmentProfit+_consecutiveWins
      id: "e396_investment_story",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "我的投资故事",
      story:
        "回望这一路投资——{storyNarrative}\n\n每一次买卖,都是人生的一次选择。",
      triggers: { minDay: 90, excludeFlags: ["_e396StoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var p = portfolioSummaryR396(st);
        return p.count >= 1 && (p.totalProfit !== 0 || (st.investment._consecutiveWins || 0) > 0);
      },
      choices: [
        {
          text: "📝 记录下这些经验",
          hint: "management XP+5,心智+4,置 _e396StoryCooldown(120天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e396StoryCooldown = true;
            grantSkillXpR396("management", 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📝 你记录了投资经验——从实战中学习是最宝贵的成长。管理XP+5,心智+4。", "success");
          }
        },
        {
          text: "🤷 过去就过去了",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        var profit = st.investment._totalInvestmentProfit || 0;
        var wins = st.investment._consecutiveWins || 0;
        var narrative = "从第一笔投资到今天,你经历了不少起伏";
        if (profit > 50000) narrative = "你的投资带来了可观的回报,证明了你的判断力";
        else if (profit > 0) narrative = "小有盈利,投资之路正在步入正轨";
        else if (profit < -20000) narrative = "投资有起伏,但这些经验比金钱更宝贵";
        else if (profit < 0) narrative = "暂时亏损,但你不曾放弃";
        if (wins >= 3) narrative += "。连续" + wins + "次盈利让你信心倍增";
        return "回望这一路投资——" + narrative + "。\n\n每一次买卖,都是人生的一次选择。";
      }
    },
    {
      // E→G: 财务压力回响 — 消费 investment+needs
      id: "e396_financial_stress",
      phase: "street",
      _isChainEvent: false,
      icon: "😰",
      title: "财务压力",
      story:
        "最近投资{financialSituation}。{stressImpact}\n\n金钱带来的不仅是物质,还有心理负担。",
      triggers: { minDay: 45, excludeFlags: ["_e396StressCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var profit = st.investment._totalInvestmentProfit || 0;
        // 亏损达到一定阈值触发
        return profit < -10000;
      },
      choices: [
        {
          text: "😌 接受波动,保持平常心",
          hint: "心智+4,置 _e396StressCooldown(75天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e396StressCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😌 你学会了接受投资波动——保持平常心是投资者最重要的品质。心智+4。", "success");
          }
        },
        {
          text: "😰 焦虑难眠",
          hint: "心情-2",
          apply: function (st) {
            if (st && st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😰 投资的亏损让你感到焦虑。适时调整心态很重要。", "warning");
          }
        }
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        var profit = st.investment._totalInvestmentProfit || 0;
        var situation = "亏损已达¥" + Math.abs(profit).toLocaleString();
        var impact = "这些数字让你感到压力";
        if (st.needs && (st.needs.happiness || 50) < 40) {
          impact = "投资亏损让本就不好的心情雪上加霜";
        } else {
          impact = "但适度的压力也是前进的动力";
        }
        return "最近投资" + situation + "。" + impact + "\n\n金钱带来的不仅是物质,还有心理负担。";
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

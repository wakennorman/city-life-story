/**
 * 域A(数据/数值平衡) 联动增强 R658
 * 桥接：
 *   A→H  a658_cost_analysis  成本分析 → 消费 state.resources+state.startup 数据,
 *     数据→"经营成本数据分析"的公司回响
 *   A→B  a658_market_narrative  市场叙事 → 消费 state.flags+state.resources 数据,
 *     数据→"价格波动中的故事"的叙事回响
 *   A→D  a658_fair_price_friendship  公平价友谊 → 消费 state.relationships+state.skills 数据,
 *     数据→"懂价格的人更受欢迎"的社交回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR658Loaded) return;
  RANDOM_EVENTS._domainALinkageR658Loaded = true;

  var EVENTS = [
    // ====== A→H: 成本分析 ======
    {
      id: "a658_cost_analysis", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "成本分析",
      story: "你仔细分析了公司的各项成本——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 6, excludeFlags: ["_a658CostAnalysisCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a658CostAnalysisCooldown) return false;
        return st.startup && st.startup.company;
      },
      choices: [
        { text: "📉 优化成本结构", hint: "公司效率+8,月成本-5%,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a658CostAnalysisCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.startup && st.startup.company) {
            st.startup.company.efficiency = Math.min(100, (st.startup.company.efficiency || 50) + 8);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你优化了公司的成本结构。'省下来的每一分钱,都是利润。' 公司效率+8,心智+3。", "success");
        }},
        { text: "📈 加大投入扩张", hint: "智力+5,现金-5000,月收入+10%", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a658CostAnalysisCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5000);
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '舍不得孩子套不着狼。' 你决定加大投入,扩张业务。智力+5,现金-5000。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.startup || !st.startup.company) return null;
        var rev = st.startup.company.revenue || 0;
        var cost = st.startup.company.monthlyCost || 0;
        return "公司的月收入¥" + rev.toLocaleString() + ",月成本¥" + cost.toLocaleString() + "。'赚得多不如花得巧,该好好分析一下成本结构了。'";
      }
    },

    // ====== A→B: 市场叙事 ======
    {
      id: "a658_market_narrative", phase: "street", _isChainEvent: false, icon: "📈",
      title: "市场叙事",
      story: "价格波动背后,总有故事——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 10, excludeFlags: ["_a658MarketNarrativeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a658MarketNarrativeCooldown) return false;
        return true;
      },
      choices: [
        { text: "🔍 研究涨价原因", hint: "智力+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a658MarketNarrativeCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '原来是因为天气原因导致减产...' 你找到了涨价背后的故事。智力+4,心智+2。", "success");
        }},
        { text: "🤔 想想怎么应对", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a658MarketNarrativeCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '涨价有涨价的道理,我得想想怎么应对。' 你冷静地分析着形势。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "菜市场的猪肉又涨价了。摊主说:'没办法,进货价就贵了,听说是因为饲料涨价了。' 你发现,每一次价格波动的背后,都有一个故事。";
      }
    },

    // ====== A→D: 公平价友谊 ======
    {
      id: "a658_fair_price_friendship", phase: "street", _isChainEvent: false, icon: "🏷️",
      title: "人情价格",
      story: "你发现懂价格的人,在朋友中更受欢迎——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 8, excludeFlags: ["_a658FairPriceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a658FairPriceCooldown) return false;
        return true;
      },
      choices: [
        { text: "🛍️ 帮朋友代购省钱", hint: "好感+8,心情+5,省下¥200", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a658FairPriceCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 200;
          if (typeof applyAffinityChange === "function" && st.relationships) {
            for (var k in st.relationships) {
              if (st.relationships[k] && st.relationships[k].met) {
                try { applyAffinityChange(st, k, 8, "代购省钱"); } catch(e) {} break;
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏷️ '这家店的东西最便宜,跟我来!' 你帮朋友省了一大笔钱。好感+8,心情+5,省下¥200。", "success");
        }},
        { text: "📝 分享省钱攻略", hint: "名气+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a658FairPriceCooldown = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏷️ 你在朋友圈分享了省钱攻略,朋友们纷纷点赞收藏。'实用!收藏了!' 名气+5,心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友们都知道你对价格很了解,买什么东西都先来问你。'你帮我看看这个价格合理吗?' 你发现,懂价格的人,在朋友圈里特别受欢迎。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
/**
 * 域E(经济/投资) 联动增强 R629
 * 桥接：
 *   E→A  e629_invest_data_insight  投资数据洞察 → 消费 state.investment+state.resources 数据,
 *     投资→"数据驱动的投资决策"的数值回响
 *   E→D  e629_investor_network  投资者网络 → 消费 state.investment+state.relationships 数据,
 *     投资→"投资者社交圈层"的社交回响
 *   E→F  e629_portfolio_ui  投资组合UI → 消费 state.investment 数据,
 *     投资→"投资组合可视化"的UI回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR629Loaded) return;
  RANDOM_EVENTS._domainELinkageR629Loaded = true;

  function metNpcsR629(st, minAff) {
    var out = [];
    var rels = st.relationships || {};
    minAff = minAff || 0;
    for (var k in rels) {
      if (rels[k] && rels[k].met && (rels[k].affinity || 0) >= minAff) {
        out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
      }
    }
    return out;
  }

  var EVENTS = [
    // ====== E→A: 投资数据洞察 ======
    {
      id: "e629_invest_data_insight", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据复盘",
      story: "你坐下来,认真复盘自己的投资数据——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 8, excludeFlags: ["_e629DataInsightCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e629DataInsightCooldown) return false;
        return (st.resources && st.resources.cash || 0) >= 5000;
      },
      choices: [
        { text: "📈 分析投资收益", hint: "智力+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e629DataInsightCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你复盘了最近的投资记录。'收益不错,但风险控制还可以更好。' 智力+5,心智+3。", "success");
        }},
        { text: "📝 优化投资策略", hint: "智力+3,未来收益+5%", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e629DataInsightCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (st.flags) st.flags._investStrategyBonus = (st.flags._investStrategyBonus || 0) + 1;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你调整了投资策略,优化了资产配置。'数据告诉我,方向比努力更重要。' 智力+3,未来收益提升。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        return "你打开账户,看着自己的投资数据。总资产¥" + cash.toLocaleString() + "。'哪些投资赚了,哪些亏了,该好好总结一下了。'";
      }
    },

    // ====== E→D: 投资者网络 ======
    {
      id: "e629_investor_network", phase: "street", _isChainEvent: false, icon: "🌐",
      title: "投资圈",
      story: "你的投资成绩引起了圈内人的注意——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 4, excludeFlags: ["_e629InvestorNetworkCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e629InvestorNetworkCooldown) return false;
        return (st.resources && st.resources.cash || 0) >= 30000;
      },
      choices: [
        { text: "🤝 加入投资俱乐部", hint: "心智+5,好感+5,现金-3000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e629InvestorNetworkCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 3000);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.flags) st.flags._investClubMember = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌐 你加入了一个高端投资俱乐部。'这里的人,都在认真研究怎么让钱生钱。' 心智+5,现金-3000。", "success");
        }},
        { text: "☕ 约人喝咖啡聊投资", hint: "心智+3,好感+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e629InvestorNetworkCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          var met = metNpcsR629(st, 40);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "投资交流"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌐 '你的投资理念很有意思,有空聊聊?' 一杯咖啡的时间,你交到了一个投资圈的朋友。心智+3,好感+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你的投资成绩在圈子里传开了。有人想跟你交流经验,有人想拉你入伙。'投资不只是数字游戏,更是人脉的游戏。'";
      }
    },

    // ====== E→F: 投资组合UI ======
    {
      id: "e629_portfolio_ui", phase: "street", _isChainEvent: false, icon: "📱",
      title: "投资组合",
      story: "你打开手机查看自己的投资组合——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 10, excludeFlags: ["_e629PortfolioUICooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e629PortfolioUICooldown) return false;
        return true;
      },
      choices: [
        { text: "📊 仔细分析持仓", hint: "智力+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e629PortfolioUICooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 你仔细研究了每只持仓的走势。'嗯,这只该加仓,那只该止损了。' 智力+4,心智+2。", "success");
        }},
        { text: "💰 看看收益开心一下", hint: "心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e629PortfolioUICooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 看着账户里数字的增长,你露出了满意的笑容。'投资,让钱为我工作。' 心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你打开投资APP,彩色的K线图映入眼帘。'红红绿绿之间,藏着财富的密码。' 你开始研究今天的行情。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
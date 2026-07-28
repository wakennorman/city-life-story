/**
 * 域E(经济/投资) 联动增强 R598
 * 桥接：
 *   E→B  e598_market_news_ripple  市场新闻涟漪 → 消费 state.investment+state.activeNews 数据,
 *     投资→"市场波动引发叙事回响"的故事回响
 *   E→D  e598_invest_social_circle  投资社交圈 → 消费 state.investment+state.relationships 数据,
 *     投资→"有钱朋友的圈子"的社交回响
 *   E→G  e598_financial_freedom_health  财务自由健康 → 消费 state.resources+state.status 数据,
 *     投资→"财务自由后的生活方式"的生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR598Loaded) return;
  RANDOM_EVENTS._domainELinkageR598Loaded = true;

  // 辅助：获取已结识NPC列表
  function metNpcsR598(st, minAff) {
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
    // ====== E→B: 市场新闻涟漪 ======
    {
      id: "e598_market_news_ripple", phase: "street", _isChainEvent: false, icon: "📰",
      title: "市场传闻",
      story: "街头巷尾流传着关于经济形势的传闻——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 10, excludeFlags: ["_e598MarketNewsCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e598MarketNewsCooldown) return false;
        return (st.resources.cash || 0) >= 10000;
      },
      choices: [
        { text: "📰 打听更多消息", hint: "心智+3,投资情报+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e598MarketNewsCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.flags) st.flags._marketIntel = (st.flags._marketIntel || 0) + 1;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 '听说XX行业要出政策了...' 你多方打听,对市场有了更深的了解。心智+3,投资情报+1。", "success");
        }},
        { text: "📉 暂时观望", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e598MarketNewsCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 '市场传闻真假难辨,先看看再说。' 你选择保持冷静。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "最近市场上流传着各种传闻——有人说经济要回暖,有人说还要继续跌。你手里的现金让你既兴奋又不安。该怎么做?";
      }
    },

    // ====== E→D: 投资社交圈 ======
    {
      id: "e598_invest_social_circle", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "高端社交",
      story: "你的投资成绩让你进入了一个新的社交圈子——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_e598InvestSocialCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e598InvestSocialCooldown) return false;
        // 需要有投资且总资产≥5万
        var inv = st.investment || {};
        var totalInv = 0;
        if (inv.stockHoldings) {
          for (var si = 0; si < inv.stockHoldings.length; si++) {
            totalInv += (inv.stockHoldings[si].avgPrice || 0) * (inv.stockHoldings[si].shares || 0);
          }
        }
        return totalInv >= 50000;
      },
      choices: [
        { text: "🤝 参加投资沙龙", hint: "好感+8,心智+5,现金-1000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e598InvestSocialCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          var met = metNpcsR598(st, 30);
          for (var mi = 0; mi < Math.min(met.length, 2); mi++) {
            if (typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, met[mi].id, 8, "投资沙龙"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 投资沙龙上,你认识了几个志同道合的朋友。大家交流投资心得,收获颇丰。好感+8,心智+5,现金-1000。", "success");
        }},
        { text: "📚 自己学习", hint: "智力+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e598InvestSocialCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '与其混圈子,不如充实自己。' 你花时间研究投资知识。智力+5,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你的投资成绩在圈子里传开了,有人邀请你参加一个投资沙龙。'来的都是投资界的朋友,交流一下经验。' 你犹豫着要不要去。";
      }
    },

    // ====== E→G: 财务自由健康 ======
    {
      id: "e598_financial_freedom_health", phase: "street", _isChainEvent: false, icon: "🌴",
      title: "财务自由的滋味",
      story: "你的资产到了一定规模,开始思考生活的意义——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 2, excludeFlags: ["_e598FinancialFreedomCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e598FinancialFreedomCooldown) return false;
        return (st.resources.cash || 0) >= 200000;
      },
      choices: [
        { text: "🏖️ 给自己放个假", hint: "心情+15,疲劳-20,现金-5000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e598FinancialFreedomCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5000);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌴 你给自己放了一个长假,去海边住了几天。阳光、沙滩、海风——这才是生活!心情+15,疲劳-20,健康+5,现金-5000。", "success");
        }},
        { text: "❤️ 做公益捐点钱", hint: "名气+10,心智+8,现金-10000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e598FinancialFreedomCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 10000);
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("❤️ 你捐了一笔钱给当地的学校。'谢谢叔叔/阿姨!' 孩子们的笑脸,比任何投资收益都珍贵。名气+10,心智+8,现金-10000。", "success");
        }},
        { text: "💰 继续投资,追求更大目标", hint: "智力+3,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e598FinancialFreedomCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '¥20万只是开始,我的目标是¥100万!' 你充满斗志。智力+3,心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        return "你的账户余额已经达到¥" + cash.toLocaleString() + "。曾经遥不可及的财务自由,现在触手可及。但你真的快乐吗?是时候思考一下:赚钱的最终目的是什么?";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
/**
 * 域E(经济/投资) 联动增强 R662
 * 桥接：
 *   E→B  e662_invest_story  投资故事 → 消费 state.investment+state.flags 数据,
 *     投资→"投资经历中的故事"的叙事回响
 *   E→G  e662_financial_independence  财务独立 → 消费 state.resources+state.status 数据,
 *     投资→"财务独立后的生活选择"的生命回响
 *   E→H  e662_investment_company 投资助力公司 → 消费 state.investment+state.startup 数据,
 *     投资→"投资收益反哺公司"的公司回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR662Loaded) return;
  RANDOM_EVENTS._domainELinkageR662Loaded = true;

  var EVENTS = [
    // ====== E→B: 投资故事 ======
    {
      id: "e662_invest_story", phase: "street", _isChainEvent: false, icon: "📖",
      title: "投资往事",
      story: "你回想起自己投资生涯中最难忘的一笔交易——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 5, excludeFlags: ["_e662InvestStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e662InvestStoryCooldown) return false;
        return (st.resources.cash || 0) >= 10000;
      },
      choices: [
        { text: "📝 写下来分享", hint: "名气+5,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e662InvestStoryCooldown = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你把自己的投资故事写了出来。'成功的经验,失败的教训,都是财富。' 名气+5,心智+5。", "success");
        }},
        { text: "🗣️ 和朋友聊聊", hint: "好感+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e662InvestStoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof applyAffinityChange === "function" && st.relationships) {
            for (var k in st.relationships) {
              if (st.relationships[k] && st.relationships[k].met) {
                try { applyAffinityChange(st, k, 5, "聊投资故事"); } catch(e) {} break;
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '那次我差点就放弃了...' 朋友们听得入神。好感+5,心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你想起自己第一次投资时的情景。'那时候什么都不懂,凭着一股冲劲就投了。' 现在回头看,那些经历都成了故事。";
      }
    },

    // ====== E→G: 财务独立 ======
    {
      id: "e662_financial_independence", phase: "street", _isChainEvent: false, icon: "🌴",
      title: "财务自由",
      story: "你的资产到了一定水平,开始思考真正的自由——{desc}",
      triggers: { minDay: 90, interval: 180, maxRepeats: 3, excludeFlags: ["_e662FinancialIndependenceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e662FinancialIndependenceCooldown) return false;
        return (st.resources.cash || 0) >= 100000;
      },
      choices: [
        { text: "🏖️ 半退休享受生活", hint: "心情+15,健康+5,疲劳-15,月收入-¥2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e662FinancialIndependenceCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌴 '终于可以停下来,好好看看这个世界了。' 你开始享受生活。心情+15,健康+5,疲劳-15。", "success");
        }},
        { text: "💰 继续滚雪球", hint: "智力+5,心智+5,投资效率+10%", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e662FinancialIndependenceCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌴 '¥10万只是开始,我的目标是¥100万!' 你继续前进。智力+5,心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        return "你的资产突破了¥" + cash.toLocaleString() + "。'终于可以不用为钱发愁了。' 但你真的自由了吗?你开始思考,什么是真正的财务自由。";
      }
    },

    // ====== E→H: 投资反哺公司 ======
    {
      id: "e662_investment_company", phase: "corporate", _isChainEvent: false, icon: "🏭",
      title: "投资反哺",
      story: "你的投资收益可以拿来发展公司——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 4, excludeFlags: ["_e662InvestmentCompanyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e662InvestmentCompanyCooldown) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.resources.cash || 0) >= 20000;
      },
      choices: [
        { text: "🏗️ 扩大公司规模", hint: "公司估值+15%,现金-10000,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e662InvestmentCompanyCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 10000);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.startup && st.startup.company) {
            st.startup.company.valuation = Math.round((st.startup.company.valuation || 0) * 1.15);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏭 你把投资收益投入公司,扩大了规模。'钱生钱,再拿钱去创造更大的价值。' 公司估值+15%,心智+3,现金-10000。", "success");
        }},
        { text: "🤝 投资合作伙伴", hint: "公司声誉+10,现金-5000,好感+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e662InvestmentCompanyCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5000);
          if (st.startup && st.startup.company) {
            st.startup.company.reputation = Math.min(100, (st.startup.company.reputation || 50) + 10);
          }
          if (typeof applyAffinityChange === "function" && st.relationships) {
            for (var k in st.relationships) {
              if (st.relationships[k] && st.relationships[k].met) {
                try { applyAffinityChange(st, k, 5, "投资合作"); } catch(e) {} break;
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏭 你投资了合作伙伴的项目,拓展了公司业务网络。公司声誉+10,好感+5,现金-5000。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.startup || !st.startup.company) return null;
        var name = st.startup.company.name || "你的公司";
        var val = st.startup.company.valuation || 0;
        return name + "的估值是¥" + val.toLocaleString() + "。你的投资收益可以用来推动公司发展。'投资不只是为了赚钱,更是为了做更大的事。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
/**
 * 域E(经济/投资) 联动增强 R570
 * 桥接：
 *   E→G  e570_investment_life_balance  投资生活平衡 → 消费 investment+needs 数据,
 *     投资→"财富与生活"的生命回响
 *   E→C  e570_investment_career_confidence 投资职业信心 → 消费 investment+skills 数据,
 *     投资→"投资收益增强职业信心"的职业回响
 *   E→B  e570_investment_story         投资故事 → 消费 investment+event 数据,
 *     投资→"投资人生章节"的叙事回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR570Loaded) return;
  RANDOM_EVENTS._domainELinkageR570Loaded = true;

  var EVENTS = [
    {
      id: "e570_investment_life_balance", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "财富与生活",
      story: "看着自己的投资收益，你开始思考——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_e570LifeBalanceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e570LifeBalanceCooldown) return false;
        return st.investment && (st.investment.stockHoldings && st.investment.stockHoldings.length > 0);
      },
      choices: [
        { text: "🎉 犒劳自己", hint: "心情+5,现金-500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e570LifeBalanceCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ '赚了钱也要享受生活。' 你好好犒劳了自己。心情+5,现金-¥500。", "success");
        }},
        { text: "📈 继续投资", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e570LifeBalanceCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ '让钱生钱。' 你选择继续投资。会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "看着自己的投资收益，你开始思考——'财富是为了更好的生活。' 你开始平衡投资与生活。";
      }
    },
    {
      id: "e570_investment_career_confidence", phase: "corporate", _isChainEvent: false, icon: "💼",
      title: "投资收益增强职业信心",
      story: "投资的成功让你对职业也更有信心——{desc}",
      triggers: { minDay: 50, interval: 100, maxRepeats: 3, excludeFlags: ["_e570CareerConfCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e570CareerConfCooldown) return false;
        return st.investment && (st.investment.stockHoldings && st.investment.stockHoldings.length > 0);
      },
      choices: [
        { text: "💪 更有底气", hint: "管理XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e570CareerConfCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '投资成功让我更有底气。' 你在职场上更有信心。管理XP+5。", "success");
        }},
        { text: "📚 学习更多", hint: "随机技能XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e570CareerConfCooldown = true;
          var skills = ["coding", "sales", "accounting", "management", "english"]; // [全系统自洽修复] 域E R588 修复:finance非真实技能键(addSkillXp静默丢弃XP)→映射english(理财进修=继续教育,accounting已在数组)
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '学无止境。' " + sk + "XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "投资的成功让你对职业也更有信心——'财商就是智商。' 你开始思考如何将投资思维应用到职业中。";
      }
    },
    {
      id: "e570_investment_story", phase: "street", _isChainEvent: false, icon: "📖",
      title: "投资人生章节",
      story: "回顾自己的投资历程，你感慨万千——{desc}",
      triggers: { minDay: 70, interval: 150, maxRepeats: 3, excludeFlags: ["_e570InvestStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._e570InvestStoryCooldown) return false;
        return st.stats && st.stats.eventsTriggered >= 10;
      },
      choices: [
        { text: "📝 记录下来", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e570InvestStoryCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '这些经历值得被记住。' 你把投资历程记录下来。会计XP+5,心智+2。", "success");
        }},
        { text: "🎯 规划未来", hint: "智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e570InvestStoryCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '下一章要写得更加精彩。' 你开始规划未来的投资计划。智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "回顾自己的投资历程，你感慨万千——'从第一笔投资到今天。' 你开始思考下一章该怎么写。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();

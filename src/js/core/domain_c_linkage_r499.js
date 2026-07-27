/**
 * 域C(职业/成长) 联动增强 R499
 * 桥接：
 *   C→H  c499_career_entrepreneur  职业创业者 → 消费 skills+corporate 数据,
 *     技能→"打工的尽头是创业"的创业桥接
 *   C→A  c499_career_salary_bench 职业薪资对标 → 消费 skills+jobs 数据,
 *     技能→"你的技能值多少工资"的薪资对标
 *   C→E  c499_career_stock_option 职业股票期权 → 消费 skills+corporate 数据,
 *     职场→"公司给的期权值不值钱"的财务判断
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR499Loaded) return;
  RANDOM_EVENTS._domainCLinkageR499Loaded = true;

  var EVENTS = [
    {
      id: "c499_career_entrepreneur", phase: "corporate", _isChainEvent: false, icon: "🚀",
      title: "打工的尽头",
      story: "你看着自己的技能积累，开始思考——{desc}",
      triggers: { minDay: 60, interval: 180, maxRepeats: 3, excludeFlags: ["_c499EntrepreneurCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c499EntrepreneurCooldown);
      },
      choices: [
        { text: "🚀 筹备创业", hint: "管理XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c499EntrepreneurCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '技能攒够了，是时候为自己干了。' 你开始认真筹备创业计划。管理XP+5,心智+2。", "success");
        }},
        { text: "📈 继续积累", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c499EntrepreneurCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '再等等，等技能再强一点，等资金再多一点。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你看着自己的技能积累，开始思考——'打工的尽头是什么？' 也许，是时候为自己打工了。";
      }
    },
    {
      id: "c499_career_salary_bench", phase: "corporate", _isChainEvent: false, icon: "💰",
      title: "薪资对标",
      story: "你查了一下同行的薪资水平——{desc}",
      triggers: { minDay: 25, interval: 90, maxRepeats: 3, excludeFlags: ["_c499SalaryBenchCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._c499SalaryBenchCooldown);
      },
      choices: [
        { text: "💰 跟老板谈加薪", hint: "管理XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c499SalaryBenchCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '根据市场行情，我的薪资应该在这个范围。' 你有理有据地提出了加薪。管理XP+5,心智+2。", "success");
        }},
        { text: "📈 提升技能再谈", hint: "随机技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c499SalaryBenchCooldown = true;
          var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域B R572 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '等技能再提升一级，谈加薪的底气更足。' 随机技能XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你查了一下同行的薪资水平——'同样的技能，别人拿的薪资比我高这么多？' 是时候重新评估自己的价值了。";
      }
    },
    {
      id: "c499_career_stock_option", phase: "corporate", _isChainEvent: false, icon: "📜",
      title: "期权值不值",
      story: "公司要给你发期权，你不知道该不该要——{desc}",
      triggers: { minDay: 40, interval: 180, maxRepeats: 3, excludeFlags: ["_c499StockOptionCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._c499StockOptionCooldown);
      },
      choices: [
        { text: "📜 要期权", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c499StockOptionCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📜 '期权是公司对你的认可，也是你对公司的信心。' 你要了期权，开始研究怎么估值。会计XP+5,心智+2。", "success");
        }},
        { text: "💰 要现金", hint: "现金+5000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c499StockOptionCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 5000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📜 '期权可能是一张废纸，现金才是实实在在的。' 你选择了现金。现金+¥5000。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司要给你发期权，你不知道该不该要——'期权到底值不值钱？' 这取决于你对公司未来的判断。";
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
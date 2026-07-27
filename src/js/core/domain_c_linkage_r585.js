/**
 * 域C(职业/成长) 联动增强 R585
 * 桥接：
 *   C→G  c585_career_life_balance  职业生活平衡 → 消费 skills+needs 数据,
 *     职业→"工作与生活"的生命回响
 *   C→E  c585_career_investment    职业投资 → 消费 skills+resources 数据,
 *     职业→"技能变现投资"的经济回响
 *   C→B  c585_career_story         职业故事 → 消费 skills+event 数据,
 *     职业→"职业人生章节"的叙事回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR585Loaded) return;
  RANDOM_EVENTS._domainCLinkageR585Loaded = true;

  var EVENTS = [
    {
      id: "c585_career_life_balance", phase: "corporate", _isChainEvent: false, icon: "⚖️",
      title: "工作与生活",
      story: "连续的高压工作让你开始反思——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_c585LifeBalanceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c585LifeBalanceCooldown) return false;
        return st.needs && (st.needs.fatigue || 0) >= 40;
      },
      choices: [
        { text: "🧘 休息调整", hint: "疲劳-20,健康+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c585LifeBalanceCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ '身体是革命的本钱。' 你决定好好休息调整。疲劳-20,健康+5。", "success");
        }},
        { text: "💪 咬牙坚持", hint: "业绩+5,疲劳+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c585LifeBalanceCooldown = true;
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ '再坚持一下，熬过这阵就好了。' 你选择继续拼搏。疲劳+10。", "warning");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "连续的高压工作让你开始反思——'我是不是该停下来休息一下？' 但手头的工作还在催着你。";
      }
    },
    {
      id: "c585_career_investment", phase: "corporate", _isChainEvent: false, icon: "📈",
      title: "技能变现投资",
      story: "你开始思考如何用技能创造被动收入——{desc}",
      triggers: { minDay: 50, interval: 100, maxRepeats: 3, excludeFlags: ["_c585CareerInvestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c585CareerInvestCooldown) return false;
        return (st.resources && (st.resources.cash || 0) >= 5000);
      },
      choices: [
        { text: "💰 投资自己", hint: "现金-2000,随机技能XP+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c585CareerInvestCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
          var skills = ["coding", "sales", "accounting", "management", "cooking", "repair"];
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 8); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '投资自己是最划算的投资。' " + sk + "XP+8,现金-¥2000。", "success");
        }},
        { text: "📚 学习新技能", hint: "随机新技能XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c585CareerInvestCooldown = true;
          var skills = ["coding", "sales", "accounting", "management", "english", "driving"];
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '多学一门技能多一条路。' " + sk + "XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始思考如何用技能创造被动收入——'技能不只是用来打工的。' 你开始探索副业可能。";
      }
    },
    {
      id: "c585_career_story", phase: "corporate", _isChainEvent: false, icon: "📖",
      title: "职业人生章节",
      story: "回顾自己的职业历程，你感慨万千——{desc}",
      triggers: { minDay: 70, interval: 150, maxRepeats: 3, excludeFlags: ["_c585CareerStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c585CareerStoryCooldown) return false;
        return st.stats && st.stats.eventsTriggered >= 10;
      },
      choices: [
        { text: "📝 记录下来", hint: "管理XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c585CareerStoryCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '这些经历值得被记住。' 你把职业历程记录下来。管理XP+5,心智+2。", "success");
        }},
        { text: "🎯 规划未来", hint: "智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c585CareerStoryCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '下一章要写得更加精彩。' 你开始规划未来的职业道路。智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "回顾自己的职业历程，你感慨万千——'从职场小白到独当一面。' 你开始思考下一章该怎么写。";
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

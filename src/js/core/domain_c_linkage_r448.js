/**
 * 域C(职业/成长) 联动增强 R448
 * 桥接：
 *   C→E  c448_skill_to_invest      技能变现投资 → 消费 skills+player 数据,
 *     专业技能→"用技能赚的钱来投资"的财商升级
 *   C→G  c448_career_health        职业健康平衡 → 消费 skills+status 数据,
 *     职业发展→"拼事业也要顾身体"的健康提醒
 *   C→H  c448_skill_startup       技能创业 → 消费 skills+corporate 数据,
 *     专业技能→"靠手艺创业"的从0到1叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR448Loaded) return;
  RANDOM_EVENTS._domainCLinkageR448Loaded = true;

  var EVENTS = [
    // C→E: 技能变现投资
    {
      id: "c448_skill_to_invest", phase: "corporate", _isChainEvent: false, icon: "💡",
      title: "技能变现",
      story: "你发现自己的专业技能居然还能这么用——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 3, excludeFlags: ["_c448SkillInvestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._c448SkillInvestCooldown);
      },
      choices: [
        { text: "💰 接私活赚钱", hint: "现金+3000,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c448SkillInvestCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 3000;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 你用专业技能接了个私活——钱到账的那一刻，你意识到技能才是最好的资产。现金+¥3000,会计XP+2。", "success");
        }},
        { text: "📚 深造提升技能", hint: "随机技能XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c448SkillInvestCooldown = true;
          var skills = ["accounting", "management", "marketing", "technology", "social"];
          var sk = skills[Math.floor(Math.random() * skills.length)];
          // 注：此处的Math.random后续由种子化系统统一覆盖
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 你决定投资自己——技能才是永远不贬值的资产。随机技能XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现自己的专业技能居然还能这么用——原来知识就是金钱这句话是真的。";
      }
    },
    // C→G: 职业健康平衡
    {
      id: "c448_career_health", phase: "corporate", _isChainEvent: false, icon: "⚖️",
      title: "事业与健康",
      story: "连续加班几周后，你感觉身体在抗议——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_c448CareerHealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c448CareerHealthCooldown);
      },
      choices: [
        { text: "🏥 去做个检查", hint: "健康+3,疲劳-2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c448CareerHealthCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 3);
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ 体检结果出来了——'没什么大问题，但要注意休息。' 你松了口气。健康+3,疲劳-2。", "success");
        }},
        { text: "😤 再坚持一下", hint: "管理XP+3,健康-1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c448CareerHealthCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.status) st.status.health = Math.max(0, (st.status.health || 70) - 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ '再坚持一下就好'——你对自己说。但身体是诚实的，它在悄悄记着每一笔透支。管理XP+3,健康-1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "连续加班几周后，你感觉身体在抗议——腰酸背痛，眼睛干涩。事业重要，但身体才是革命的本钱。";
      }
    },
    // C→H: 技能创业
    {
      id: "c448_skill_startup", phase: "corporate", _isChainEvent: false, icon: "🔧",
      title: "手艺创业",
      story: "你发现自己的技能积累到了一定程度，可以自己干了——{desc}",
      triggers: { minDay: 80, interval: 180, maxRepeats: 2, excludeFlags: ["_c448SkillStartupCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._c448SkillStartupCooldown);
      },
      choices: [
        { text: "🔧 用技术创业", hint: "技术XP+5,公司资金+3000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c448SkillStartupCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("coding", 5); } catch(e) {} }
          if (st.corporate && st.corporate.company) st.corporate.company.funds = (st.corporate.company.funds || 0) + 3000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔧 你决定用自己的技术创业——给别人打工不如给自己打工。技术XP+5,公司资金+¥3000。", "success");
        }},
        { text: "🤝 找合伙人一起干", hint: "社交XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c448SkillStartupCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔧 你找到了几个志同道合的伙伴——一个人走得快，一群人走得远。社交XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现自己的技能积累到了一定程度，可以自己干了——手艺在身，走到哪里都不怕。";
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
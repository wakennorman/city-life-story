/**
 * 域G(核心机制/生命周期) 联动增强 R472（第五轮循环·续）
 * 桥接：
 *   G→F  g472_life_ribbon_ui      人生缎带UI → 消费 life_ribbon 数据,
 *     缎带→"你的人生标签"的UI展示
 *   G→H  g472_life_phase_business  人生阶段生意 → 消费 age+startup 数据,
 *     年龄→"什么年龄做什么生意"的创业叙事
 *   g472_annual_review(G→B 年度人生回顾): day+stats→"这一年你经历了什么"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR472Loaded) return;
  RANDOM_EVENTS._domainGLinkageR472Loaded = true;

  var EVENTS = [
    {
      id: "g472_life_ribbon_ui", phase: "street", _isChainEvent: false, icon: "🎗️",
      title: "人生标签",
      story: "你看了看自己的人生缎带——{desc}",
      triggers: { minDay: 60, interval: 100, maxRepeats: 3, excludeFlags: ["_g472RibbonUiCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.lifeRibbons || !st.lifeRibbons.earned) return false;
        return st.lifeRibbons.earned.length >= 1 && (st.flags && !st.flags._g472RibbonUiCooldown);
      },
      choices: [
        { text: "📊 分析缎带模式", hint: "智力+2,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g472RibbonUiCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了缎带模式——'标签不能定义你，但能帮你看清自己。' 智力+2,心智+2。", "success");
        }},
        { text: "🎯 追求新缎带", hint: "心情+5,全技能XP+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g472RibbonUiCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          var skills = ["accounting", "management", "sales", "coding", "trade"];
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 1); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你决定追求新缎带——'人生需要新目标。' 心情+5,全技能XP+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = st.lifeRibbons && st.lifeRibbons.earned ? st.lifeRibbons.earned.length : 0;
        return "你看了看自己的人生缎带——已经获得了" + n + "条缎带。每一条都是你人生故事的注脚。";
      }
    },
    {
      id: "g472_life_phase_business", phase: "corporate", _isChainEvent: false, icon: "🏢",
      title: "年龄与生意",
      story: "你开始思考年龄和事业的关系——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 2, excludeFlags: ["_g472PhaseBizCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        if (!st.player || st.player.age < 30) return false;
        return (st.flags && !st.flags._g472PhaseBizCooldown);
      },
      choices: [
        { text: "🚀 大胆扩张", hint: "公司资金+8000,风险+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g472PhaseBizCooldown = true;
          if (st.corporate && st.corporate.company) st.corporate.company.funds = (st.corporate.company.funds || 0) + 8000;
          if (st.player) st.player.risk = Math.min(100, (st.player.risk || 0) + 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你决定大胆扩张——'年纪正好，时不我待。' 公司资金+8000,风险+10。", "success");
        }},
        { text: "🧘 稳健经营", hint: "心智+4,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g472PhaseBizCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 你选择稳健经营——'慢就是快。' 心智+4,管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var age = st.player && st.player.age ? st.player.age : 30;
        return "你已经" + age + "岁了——在职场，年龄既是资本也是压力。你开始思考：在这个人生阶段，事业该怎么走？";
      }
    },
    {
      id: "g472_annual_review", phase: "street", _isChainEvent: false, icon: "📋",
      title: "年度回顾",
      story: "你回顾了这一年的经历——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 3, excludeFlags: ["_g472AnnualCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.actionFreq) return false;
        return (st.flags && !st.flags._g472AnnualCooldown);
      },
      choices: [
        { text: "📊 量化总结", hint: "智力+3,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g472AnnualCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你做了量化总结——'数据不说谎。' 智力+3,会计XP+2。", "success");
        }},
        { text: "📖 写成年记", hint: "心智+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g472AnnualCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你写下了年记——'记录，是为了更好地前行。' 心智+4,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var workDays = st.stats && st.stats.actionFreq ? (st.stats.actionFreq.work || 0) : 0;
        return "你回顾了这一年的经历——工作了" + workDays + "天。这一年你经历了什么？学到了什么？";
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

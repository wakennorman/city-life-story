/**
 * 域C(职业/成长) 联动增强 R474（第十六轮循环）
 * 桥接：
 *   C→H  c474_career_to_business  职业到创业 → 消费 employment+startup 数据,
 *     职场积累→"打工是为了不打工"的创业桥接
 *   C→F  c474_skill_showcase       技能展示UI → 消费 skills 数据,
 *     技能→"你最擅长什么"的UI展示
 *   c474_career_anniversary(C→G 职业周年): workDays→"你在这行多久了"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR474Loaded) return;
  RANDOM_EVENTS._domainCLinkageR474Loaded = true;

  function topSkillKey(st) {
    if (!st || !st.skills) return null;
    var best = null, bestLv = -1;
    for (var k in st.skills) { var lv = st.skills[k] && st.skills[k].level ? st.skills[k].level : 0; if (lv > bestLv) { bestLv = lv; best = k; } }
    return best;
  }

  var EVENTS = [
    {
      id: "c474_career_to_business", phase: "corporate", _isChainEvent: false, icon: "🚀",
      title: "创业种子",
      story: "你开始思考：打工是为了什么？{desc}",
      triggers: { minDay: 150, interval: 180, maxRepeats: 2, excludeFlags: ["_c474BizSeedCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob) return false;
        if ((st.career.currentJob.workDays || 0) < 365) return false;
        return (st.flags && !st.flags._c474BizSeedCooldown);
      },
      choices: [
        { text: "💡 开始副业", hint: "现金+1000,管理XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c474BizSeedCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1000;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 你开始尝试副业——'不把鸡蛋放在一个篮子里。' 现金+1000,管理XP+5。", "success");
        }},
        { text: "📚 积累资源", hint: "行业资源+10,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c474BizSeedCooldown = true;
          var cap = st.career && st.career.capital;
          if (cap) cap.industryResources = (cap.industryResources || 0) + 10;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 你选择继续积累——'厚积薄发。' 行业资源+10,心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.career && st.career.currentJob ? (st.career.currentJob.workDays || 0) : 0;
        return "你已经工作了" + days + "天——打工是为了什么？是为了积累，还是为了有一天不再打工？";
      }
    },
    {
      id: "c474_skill_showcase", phase: "street", _isChainEvent: false, icon: "🏅",
      title: "技能展示",
      story: "你整理了一下自己的技能面板——{desc}",
      triggers: { minDay: 35, interval: 60, maxRepeats: 5, excludeFlags: ["_c474ShowcaseCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills) return false;
        return (st.flags && !st.flags._c474ShowcaseCooldown);
      },
      choices: [
        { text: "📊 分析技能树", hint: "智力+2,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c474ShowcaseCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了技能树——'知道自己知道什么，是智慧的开始。' 智力+2,心智+2。", "success");
        }},
        { text: "🎯 补强弱项", hint: "最低技能XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c474ShowcaseCooldown = true;
          var worst = null, worstLv = 999;
          for (var k in st.skills) { var lv = st.skills[k] && st.skills[k].level ? st.skills[k].level : 0; if (lv < worstLv) { worstLv = lv; worst = k; } }
          if (worst && typeof addSkillXp === "function") { try { addSkillXp(worst, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你决定补强弱项——'短板决定下限。' 最低技能XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var sk = topSkillKey(st);
        var lv = sk && st.skills[sk] ? st.skills[sk].level : 0;
        var name = sk && typeof getSkillChineseName === "function" ? getSkillChineseName(sk) : (sk || "技能");
        return "你整理了一下技能面板——最强的" + name + "Lv." + lv + "，最弱的还在起点。你的技能树长什么样？";
      }
    },
    {
      id: "c474_career_anniversary", phase: "corporate", _isChainEvent: false, icon: "🎂",
      title: "职业周年",
      story: "你回顾了在职场的岁月——{desc}",
      triggers: { minDay: 200, interval: 200, maxRepeats: 2, excludeFlags: ["_c474AnniversaryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob) return false;
        return (st.career.currentJob.workDays || 0) >= 365 && (st.flags && !st.flags._c474AnniversaryCooldown);
      },
      choices: [
        { text: "📖 写职业总结", hint: "心智+4,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c474AnniversaryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你写下了职业总结——'一年了，你学到了什么？' 心智+4,管理XP+3。", "success");
        }},
        { text: "🎯 设定新目标", hint: "智力+2,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c474AnniversaryCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你设定了新目标——'每一年都是新的开始。' 智力+2,心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.career && st.career.currentJob ? (st.career.currentJob.workDays || 0) : 0;
        var years = Math.floor(days / 365);
        return "你已经在职场走过了" + (years || 1) + "年——从新人到老兵，你经历了什么？成长了多少？";
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

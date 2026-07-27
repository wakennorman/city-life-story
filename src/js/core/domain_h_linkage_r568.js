/**
 * 域H(Phase2/公司) 联动增强 R568
 * 桥接：
 *   H→E  h568_corp_ipo_plan    公司IPO计划 → 消费 corporate 数据,
 *     上市→"公司要上市了"的IPO叙事
 *   H→C  h568_corp_skill_academy 公司技能学院 → 消费 corporate+skills 数据,
 *     培训→"公司内部技能培训"的成长叙事
 *   H→G  h568_corp_founder_health_v2 创始人健康v2 → 消费 corporate+status 数据,
 *     健康→"创业是一场马拉松"的健康管理
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR568Loaded) return;
  RANDOM_EVENTS._domainHLinkageR568Loaded = true;

  var EVENTS = [
    {
      id: "h568_corp_ipo_plan", phase: "corporate", _isChainEvent: false, icon: "📈",
      title: "IPO计划",
      story: "公司在考虑上市计划——{desc}",
      triggers: { minDay: 70, interval: 360, maxRepeats: 2, excludeFlags: ["_h568IPOPlanCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h568IPOPlanCooldown);
      },
      choices: [
        { text: "📈 准备上市", hint: "管理XP+5,公司知名度+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h568IPOPlanCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '公司要上市了，这是所有创业者的梦想！' 管理XP+5,公司知名度+5,心智+2。", "success");
        }},
        { text: "📊 评估时机", hint: "会计XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h568IPOPlanCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '现在上市是不是最好的时机？需要评估一下。' 会计XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司在考虑上市计划——'投行的人来了几次了，建议我们今年上市。' 上市，是公司发展的新起点。";
      }
    },
    {
      id: "h568_corp_skill_academy", phase: "corporate", _isChainEvent: false, icon: "📚",
      title: "技能学院",
      story: "你在公司内部成立了技能学院——{desc}",
      triggers: { minDay: 40, interval: 180, maxRepeats: 3, excludeFlags: ["_h568SkillAcademyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h568SkillAcademyCooldown);
      },
      choices: [
        { text: "📚 开设课程", hint: "管理XP+5,全技能XP+2,团队忠诚+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h568SkillAcademyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          var skills = ["accounting", "management", "marketing", "technology", "social", "trade"];
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 2); } catch(e) {} } }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 2); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '公司技能学院开课了，大家学习热情很高。' 管理XP+5,全技能XP+2,团队忠诚+2。", "success");
        }},
        { text: "👨‍🏫 请外部讲师", hint: "管理XP+3,社交XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h568SkillAcademyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '请外部讲师来公司培训，开拓了大家的视野。' 管理XP+3,社交XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你在公司内部成立了技能学院——'帮助员工成长，就是帮助公司成长。' 最好的投资，是投资员工的未来。";
      }
    },
    {
      id: "h568_corp_founder_health_v2", phase: "corporate", _isChainEvent: false, icon: "💪",
      title: "创业者健康",
      story: "你意识到创业者的健康是公司最大的资产——{desc}",
      triggers: { minDay: 35, interval: 90, maxRepeats: 3, excludeFlags: ["_h568FounderHealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._h568FounderHealthCooldown);
      },
      choices: [
        { text: "💪 开始健身", hint: "健康+3,疲劳+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h568FounderHealthCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 3);
          if (st.needs) { st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 2); st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '身体是革命的本钱，开始健身！' 健康+3,疲劳+2,心情+2。", "success");
        }},
        { text: "🧘 减压", hint: "疲劳-3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h568FounderHealthCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 3);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '创业压力大，要学会减压。' 疲劳-3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你意识到创业者的健康是公司最大的资产——'如果我倒下了，公司怎么办？' 照顾好自己，是对公司最大的负责。";
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
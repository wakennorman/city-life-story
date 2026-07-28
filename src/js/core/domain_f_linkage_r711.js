/**
 * 域F(UI/UX) 联动增强 R711
 * 桥接：
 *   F→A  f711_data_story_panel 数据故事面板 → 消费 state.jobs/skills/wealth 数据,
 *     将隐形数据显性化为"人生数据故事"
 *   F→G  f711_health_dashboard_v4 健康仪表盘v4 → 消费 state.status/needs,
 *     健康数据可视化+健康行为引导
 *   F→C  f711_career_milestone_ui 职业里程碑UI → 消费 career 数据,
 *     职业成长可视化+生涯回顾
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR711Loaded) return;
  RANDOM_EVENTS._domainFLinkageR711Loaded = true;

  var EVENTS = [
    {
      id: "f711_data_story_panel", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生数据故事",
      story: "你的数据正在讲述故事——{desc}",
      triggers: { minDay: 100, interval: 120, maxRepeats: 3, excludeFlags: ["_f711DataStoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f711DataStoryCd) return false;
        return st.player && st.player.day >= 100 && st.skills;
      },
      choices: [
        {
          text: "📈 回顾成长轨迹", hint: "心智+5,置_f711GrowthReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f711DataStoryCd = true;
            st.flags._f711GrowthReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据背后,是成长的足迹。' 心智+5。", "success");
            }
          }
        },
        {
          text: "🎯 设定数据目标", hint: "智力+4,置_f711DataGoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f711DataStoryCd = true;
            st.flags._f711DataGoalSetter = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,才有方向。' 智力+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var topSkill = "";
        var topLv = 0;
        if (st.skills) {
          for (var k in st.skills) {
            if (st.skills[k] && typeof st.skills[k].level === "number" && st.skills[k].level > topLv) {
              topLv = st.skills[k].level;
              topSkill = k;
            }
          }
        }
        var skillName = topSkill;
        if (typeof getSkillChineseName === "function") skillName = getSkillChineseName(topSkill) || topSkill;
        return "你的最高技能" + skillName + "Lv." + topLv + "——'这些数据,诉说着你的成长。'";
      }
    },
    {
      id: "f711_health_dashboard_v4", phase: "street", _isChainEvent: false, icon: "💚",
      title: "健康仪表盘",
      story: "你的健康状况一目了然——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 4, excludeFlags: ["_f711HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f711HealthCd) return false;
        return st.status && st.needs && st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "🏃 制定健康计划", hint: "健康+3,疲劳-5,置_f711HealthPlan",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f711HealthCd = true;
            st.flags._f711HealthPlan = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '健康是1,其他是0。' 健康+3,疲劳-5。", "success");
            }
          }
        },
        {
          text: "😴 调整作息", hint: "心情+6,置_f711SleepAdjust",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f711HealthCd = true;
            st.flags._f711SleepAdjust = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 '早睡早起,精神百倍。' 心情+6。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var health = st.status && st.status.health ? Math.round(st.status.health) : 100;
        var fatigue = st.needs && st.needs.fatigue ? Math.round(st.needs.fatigue) : 0;
        return "健康" + health + "%,疲劳" + fatigue + "——'身体,最诚实的仪表盘。'";
      }
    },
    {
      id: "f711_career_milestone_ui", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "职业里程碑",
      story: "你的职业生涯正在书写里程碑——{desc}",
      triggers: { minDay: 120, interval: 150, maxRepeats: 3, excludeFlags: ["_f711CareerCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f711CareerCd) return false;
        return st.player && st.player.day >= 120 && ((st.corporate && st.corporate.rank) || (st.employment && st.employment.currentJob));
      },
      choices: [
        {
          text: "📜 回顾职业历程", hint: "心智+5,置_f711CareerReflector",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f711CareerCd = true;
            st.flags._f711CareerReflector = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📜 '回头看,是为了更好地向前走。' 心智+5。", "success");
            }
          }
        },
        {
          text: "🎯 规划下一阶段", hint: "管理XP+6,置_f711CareerPlanner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f711CareerCd = true;
            st.flags._f711CareerPlanner = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '职业规划,是对未来的投资。' 管理XP+6。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var rank = "无";
        if (st.corporate && st.corporate.rank) rank = st.corporate.rank;
        else if (st.employment && st.employment.currentJob) rank = st.employment.currentJob.name || "在职";
        return "当前职级" + rank + "——'职业生涯,需要仪式感。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

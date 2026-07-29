/**
 * 域C(职业/成长) 联动增强 R777 (第十轮循环)
 * 桥接：
 *   C→A  c777_career_capital_v8 职业资本v8 → 消费 jobs/skills/employment 数据
 *   C→B  c777_career_story_v8 职业故事v8 → 消费 职业历史+事件
 *   C→G  c777_career_health_v8 职业健康v8 → 消费 职业数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR777Loaded) return;
  RANDOM_EVENTS._domainCLinkageR777Loaded = true;

  var EVENTS = [
    {
      id: "c777_career_capital_v8", phase: "street", _isChainEvent: false, icon: "💼",
      title: "职业资本报告",
      story: "你的职业数据正在讲述成长故事——{desc}",
      triggers: { minDay: 1000, interval: 1100, maxRepeats: 3, excludeFlags: ["_c777DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c777DataCd) return false;
        return st.player && st.player.day >= 1000 && st.skills;
      },
      choices: [
        {
          text: "📊 分析职业轨迹", hint: "智力+25,会计XP+20,置_c777Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c777DataCd = true;
            st.flags._c777Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 25);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '职业成长,需要数据支撑。' 智力+25,会计XP+20。", "success");
            }
          }
        },
        {
          text: "🎯 规划职业路径", hint: "管理XP+25,置_c777Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c777DataCd = true;
            st.flags._c777Planner = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有规划,才有方向。' 管理XP+25。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "你的职业正在成长——'这些数据,就是你的职业资本。'";
      }
    },
    {
      id: "c777_career_story_v8", phase: "street", _isChainEvent: false, icon: "📖",
      title: "职业故事",
      story: "你的职业变化正在书写故事——{desc}",
      triggers: { minDay: 1100, interval: 1200, maxRepeats: 3, excludeFlags: ["_c777NarrCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c777NarrCd) return false;
        return st.player && st.player.day >= 1100 && st.employment;
      },
      choices: [
        {
          text: "📜 记录职业历程", hint: "心智+25,置_c777Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c777NarrCd = true;
            st.flags._c777Chronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '每一步,都值得记录。' 心智+25。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+18,魅力+15,置_c777Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c777NarrCd = true;
            st.flags._c777Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '职业生涯,需要远见。' 智力+18,魅力+15。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var jobName = "无";
        if (st.employment && st.employment.currentJob) jobName = st.employment.currentJob.name || "在职";
        return "当前职业" + jobName + "——'这就是你的职业故事。'";
      }
    },
    {
      id: "c777_career_health_v8", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "职业健康",
      story: "工作不应以牺牲健康为代价——{desc}",
      triggers: { minDay: 900, interval: 1000, maxRepeats: 4, excludeFlags: ["_c777HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c777HealthCd) return false;
        return st.player && st.player.day >= 900 && st.needs && st.status && st.corporate;
      },
      choices: [
        {
          text: "🧘 工作生活平衡", hint: "心情+25,疲劳-25,置_c777Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c777HealthCd = true;
            st.flags._c777Balanced = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 25);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '工作是为了生活,不是为了牺牲生活。' 心情+25,疲劳-25。", "success");
            }
          }
        },
        {
          text: "🏋️ 职场健康管理", hint: "健康+18,置_c777Healthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c777HealthCd = true;
            st.flags._c777Healthy = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+18。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var fatigue = st.needs && st.needs.fatigue ? Math.round(st.needs.fatigue) : 0;
        return "职场疲劳" + fatigue + "——'工作与健康,需要平衡。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

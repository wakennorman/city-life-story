/**
 * 域C(职业/成长) 联动增强 R821 (第十四轮循环)
 * 桥接：
 *   C→A  c821_career_data_v9 职业数据v9 → 消费 jobs/skills/employment 数据
 *   C→B  c821_career_story_v9 职业故事v9 → 消费 职业历史+事件
 *   C→G  c821_career_health_v9 职业健康v9 → 消费 职业数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR821Loaded) return;
  RANDOM_EVENTS._domainCLinkageR821Loaded = true;

  var EVENTS = [
    {
      id: "c821_career_data_v9", phase: "street", _isChainEvent: false, icon: "💼",
      title: "职业数据报告",
      story: "你的职业数据正在讲述成长故事——这些数据,就是你的职业资本。",
      triggers: { minDay: 200, interval: 300, maxRepeats: 3, excludeFlags: ["_c821DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c821DataCd) return false;
        return st.player && st.player.day >= 200 && st.skills;
      },
      text: function (st) {
        if (!st) return null;
        return "你的职业正在成长——'这些数据,就是你的职业资本。'";
      },
      choices: [
        {
          text: "📊 分析职业轨迹", hint: "智力+20,会计XP+15,置_c821Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c821DataCd = true;
            st.flags._c821Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '职业成长,需要数据支撑。' 智力+20,会计XP+15。", "success");
            }
          }
        },
        {
          text: "🎯 规划职业路径", hint: "管理XP+20,置_c821Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c821DataCd = true;
            st.flags._c821Planner = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有规划,才有方向。' 管理XP+20。", "info");
            }
          }
        }
      ]
    },
    {
      id: "c821_career_story_v9", phase: "street", _isChainEvent: false, icon: "📖",
      title: "职业故事",
      story: "你的职业变化正在书写故事——每一步,都值得被记录。",
      triggers: { minDay: 300, interval: 350, maxRepeats: 3, excludeFlags: ["_c821NarrCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c821NarrCd) return false;
        return st.player && st.player.day >= 300 && st.employment;
      },
      text: function (st) {
        if (!st) return null;
        var jobName = "无";
        if (st.employment && st.employment.currentJob) jobName = st.employment.currentJob.name || "在职";
        return "当前职业" + jobName + "——'这就是你的职业故事。'";
      },
      choices: [
        {
          text: "📜 记录职业历程", hint: "心智+20,置_c821Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c821NarrCd = true;
            st.flags._c821Chronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '每一步,都值得记录。' 心智+20。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+18,魅力+15,置_c821Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c821NarrCd = true;
            st.flags._c821Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '职业生涯,需要远见。' 智力+18,魅力+15。", "info");
            }
          }
        }
      ]
    },
    {
      id: "c821_career_health_v9", phase: "street", _isChainEvent: false, icon: "💚",
      title: "职业健康",
      story: "工作不应以牺牲健康为代价——工作与健康,需要平衡。",
      triggers: { minDay: 400, interval: 450, maxRepeats: 4, excludeFlags: ["_c821HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c821HealthCd) return false;
        return st.player && st.player.day >= 400 && st.needs && st.status;
      },
      text: function (st) {
        if (!st) return null;
        var fatigue = st.needs && isFinite(st.needs.fatigue) ? Math.round(st.needs.fatigue) : 0;
        return "职场疲劳" + fatigue + "——'工作与健康,需要平衡。'";
      },
      choices: [
        {
          text: "🧘 工作生活平衡", hint: "心情+20,疲劳-20,置_c821Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c821HealthCd = true;
            st.flags._c821Balanced = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '工作是为了生活。' 心情+20,疲劳-20。", "success");
            }
          }
        },
        {
          text: "🏋️ 职场健康管理", hint: "健康+18,置_c821Healthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c821HealthCd = true;
            st.flags._c821Healthy = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+18。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
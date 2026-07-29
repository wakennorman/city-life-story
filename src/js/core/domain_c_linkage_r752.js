/**
 * 域C(职业/成长) 联动增强 R752 (第七轮循环)
 * 桥接：
 *   C→A  c752_career_capital_v5 职业资本v5 → 消费 jobs/skills/employment 数据
 *   C→B  c752_career_story_v5 职业故事v5 → 消费 职业历史+事件
 *   C→G  c752_career_health_v5 职业健康v5 → 消费 职业数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR752Loaded) return;
  RANDOM_EVENTS._domainCLinkageR752Loaded = true;

  var EVENTS = [
    {
      id: "c752_career_capital_v5", phase: "street", _isChainEvent: false, icon: "💼",
      title: "职业资本报告",
      story: "你的职业数据正在讲述成长故事——{desc}",
      triggers: { minDay: 365, interval: 500, maxRepeats: 3, excludeFlags: ["_c752DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c752DataCd) return false;
        return st.player && st.player.day >= 365 && st.skills;
      },
      choices: [
        {
          text: "📊 分析职业轨迹", hint: "智力+15,会计XP+10,置_c752Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c752DataCd = true;
            st.flags._c752Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '职业成长,需要数据支撑。' 智力+15,会计XP+10。", "success");
            }
          }
        },
        {
          text: "🎯 规划职业路径", hint: "管理XP+15,置_c752Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c752DataCd = true;
            st.flags._c752Planner = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有规划,才有方向。' 管理XP+15。", "info");
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
      id: "c752_career_story_v5", phase: "street", _isChainEvent: false, icon: "📖",
      title: "职业故事",
      story: "你的职业变化正在书写故事——{desc}",
      triggers: { minDay: 400, interval: 500, maxRepeats: 3, excludeFlags: ["_c752NarrCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c752NarrCd) return false;
        return st.player && st.player.day >= 400 && st.employment;
      },
      choices: [
        {
          text: "📜 记录职业历程", hint: "心智+15,置_c752Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c752NarrCd = true;
            st.flags._c752Chronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '每一步,都值得记录。' 心智+15。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+10,魅力+8,置_c752Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c752NarrCd = true;
            st.flags._c752Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '职业生涯,需要远见。' 智力+10,魅力+8。", "info");
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
      id: "c752_career_health_v5", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "职业健康",
      story: "工作不应以牺牲健康为代价——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 4, excludeFlags: ["_c752HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c752HealthCd) return false;
        return st.player && st.player.day >= 300 && st.needs && st.status && st.corporate;
      },
      choices: [
        {
          text: "🧘 工作生活平衡", hint: "心情+15,疲劳-15,置_c752Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c752HealthCd = true;
            st.flags._c752Balanced = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '工作是为了生活,不是为了牺牲生活。' 心情+15,疲劳-15。", "success");
            }
          }
        },
        {
          text: "🏋️ 职场健康管理", hint: "健康+10,置_c752Healthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c752HealthCd = true;
            st.flags._c752Healthy = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+10。", "info");
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

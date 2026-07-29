/**
 * 域C(职业/成长) 联动增强 R760 (第八轮循环)
 * 桥接：
 *   C→A  c760_career_capital_v6 职业资本v6 → 消费 jobs/skills/employment 数据
 *   C→B  c760_career_story_v6 职业故事v6 → 消费 职业历史+事件
 *   C→G  c760_career_health_v6 职业健康v6 → 消费 职业数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR760Loaded) return;
  RANDOM_EVENTS._domainCLinkageR760Loaded = true;

  var EVENTS = [
    {
      id: "c760_career_capital_v6", phase: "street", _isChainEvent: false, icon: "💼",
      title: "职业资本报告",
      story: "你的职业数据正在讲述成长故事——{desc}",
      triggers: { minDay: 500, interval: 600, maxRepeats: 3, excludeFlags: ["_c760DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c760DataCd) return false;
        return st.player && st.player.day >= 500 && st.skills;
      },
      choices: [
        {
          text: "📊 分析职业轨迹", hint: "智力+18,会计XP+15,置_c760Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c760DataCd = true;
            st.flags._c760Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '职业成长,需要数据支撑。' 智力+18,会计XP+15。", "success");
            }
          }
        },
        {
          text: "🎯 规划职业路径", hint: "管理XP+18,置_c760Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c760DataCd = true;
            st.flags._c760Planner = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有规划,才有方向。' 管理XP+18。", "info");
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
      id: "c760_career_story_v6", phase: "street", _isChainEvent: false, icon: "📖",
      title: "职业故事",
      story: "你的职业变化正在书写故事——{desc}",
      triggers: { minDay: 600, interval: 700, maxRepeats: 3, excludeFlags: ["_c760NarrCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c760NarrCd) return false;
        return st.player && st.player.day >= 600 && st.employment;
      },
      choices: [
        {
          text: "📜 记录职业历程", hint: "心智+18,置_c760Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c760NarrCd = true;
            st.flags._c760Chronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '每一步,都值得记录。' 心智+18。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+12,魅力+10,置_c760Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c760NarrCd = true;
            st.flags._c760Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '职业生涯,需要远见。' 智力+12,魅力+10。", "info");
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
      id: "c760_career_health_v6", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "职业健康",
      story: "工作不应以牺牲健康为代价——{desc}",
      triggers: { minDay: 400, interval: 500, maxRepeats: 4, excludeFlags: ["_c760HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c760HealthCd) return false;
        return st.player && st.player.day >= 400 && st.needs && st.status && st.corporate;
      },
      choices: [
        {
          text: "🧘 工作生活平衡", hint: "心情+18,疲劳-18,置_c760Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c760HealthCd = true;
            st.flags._c760Balanced = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 18);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '工作是为了生活,不是为了牺牲生活。' 心情+18,疲劳-18。", "success");
            }
          }
        },
        {
          text: "🏋️ 职场健康管理", hint: "健康+12,置_c760Healthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c760HealthCd = true;
            st.flags._c760Healthy = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+12。", "info");
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

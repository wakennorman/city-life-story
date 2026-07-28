/**
 * 域C(职业/成长) 联动增强 R740 (第五轮循环)
 * 桥接：
 *   C→A  c740_career_capital_v4 职业资本v4 → 消费 jobs/skills/employment 数据
 *   C→B  c740_career_story_v4 职业故事v4 → 消费 职业历史+事件
 *   C→G  c740_career_health_v4 职业健康v4 → 消费 职业数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR740Loaded) return;
  RANDOM_EVENTS._domainCLinkageR740Loaded = true;

  var EVENTS = [
    {
      id: "c740_career_capital_v4", phase: "street", _isChainEvent: false, icon: "💼",
      title: "职业资本报告",
      story: "你的职业数据正在讲述成长故事——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 3, excludeFlags: ["_c740DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c740DataCd) return false;
        return st.player && st.player.day >= 250 && st.skills;
      },
      choices: [
        {
          text: "📊 分析职业轨迹", hint: "智力+9,会计XP+7,置_c740Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c740DataCd = true;
            st.flags._c740Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 9);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 7); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '职业成长,需要数据支撑。' 智力+9,会计XP+7。", "success");
            }
          }
        },
        {
          text: "🎯 规划职业路径", hint: "管理XP+9,置_c740Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c740DataCd = true;
            st.flags._c740Planner = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 9); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有规划,才有方向。' 管理XP+9。", "info");
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
      id: "c740_career_story_v4", phase: "street", _isChainEvent: false, icon: "📖",
      title: "职业故事",
      story: "你的职业变化正在书写故事——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 3, excludeFlags: ["_c740NarrCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c740NarrCd) return false;
        return st.player && st.player.day >= 300 && st.employment;
      },
      choices: [
        {
          text: "📜 记录职业历程", hint: "心智+9,置_c740Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c740NarrCd = true;
            st.flags._c740Chronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '每一步,都值得记录。' 心智+9。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+7,魅力+5,置_c740Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c740NarrCd = true;
            st.flags._c740Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 7);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '职业生涯,需要远见。' 智力+7,魅力+5。", "info");
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
      id: "c740_career_health_v4", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "职业健康",
      story: "工作不应以牺牲健康为代价——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 4, excludeFlags: ["_c740HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c740HealthCd) return false;
        return st.player && st.player.day >= 200 && st.needs && st.status && st.corporate;
      },
      choices: [
        {
          text: "🧘 工作生活平衡", hint: "心情+12,疲劳-12,置_c740Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c740HealthCd = true;
            st.flags._c740Balanced = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 12);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '工作是为了生活,不是为了牺牲生活。' 心情+12,疲劳-12。", "success");
            }
          }
        },
        {
          text: "🏋️ 职场健康管理", hint: "健康+8,置_c740Healthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c740HealthCd = true;
            st.flags._c740Healthy = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+8。", "info");
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

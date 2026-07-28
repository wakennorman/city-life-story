/**
 * 域C(职业/成长) 联动增强 R716
 * 桥接：
 *   C→A  c716_career_data_v3 职业数据洞察v3 → 消费 jobs/skills/employment 数据,
 *     将隐形职业数据显性化为"职业资本报告"
 *   C→B  c716_career_narrative_v3 职业叙事v3 → 消费 职业历史+事件,
 *     职业变化触发叙事回响
 *   C→G  c716_career_wellbeing_v3 职业幸福感v3 → 消费 职业数据+needs,
 *     职业状态影响身心健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR716Loaded) return;
  RANDOM_EVENTS._domainCLinkageR716Loaded = true;

  var EVENTS = [
    {
      id: "c716_career_data_v3", phase: "street", _isChainEvent: false, icon: "💼",
      title: "职业资本报告",
      story: "你的职业数据正在讲述成长故事——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_c716DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c716DataCd) return false;
        return st.player && st.player.day >= 100 && st.skills;
      },
      choices: [
        {
          text: "📊 分析职业轨迹", hint: "智力+5,会计XP+4,置_c716Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c716DataCd = true;
            st.flags._c716Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '职业成长,需要数据支撑。' 智力+5,会计XP+4。", "success");
            }
          }
        },
        {
          text: "🎯 规划职业路径", hint: "管理XP+6,置_c716Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c716DataCd = true;
            st.flags._c716Planner = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有规划,才有方向。' 管理XP+6。", "info");
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
      id: "c716_career_narrative_v3", phase: "street", _isChainEvent: false, icon: "📖",
      title: "职业叙事",
      story: "你的职业变化正在书写故事——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 3, excludeFlags: ["_c716NarrCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c716NarrCd) return false;
        return st.player && st.player.day >= 120 && st.employment;
      },
      choices: [
        {
          text: "📜 记录职业历程", hint: "心智+5,置_c716Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c716NarrCd = true;
            st.flags._c716Chronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '每一步,都值得记录。' 心智+5。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+4,魅力+3,置_c716Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c716NarrCd = true;
            st.flags._c716Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '职业生涯,需要远见。' 智力+4,魅力+3。", "info");
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
      id: "c716_career_wellbeing_v3", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "职业幸福感",
      story: "工作不应以牺牲健康为代价——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 4, excludeFlags: ["_c716WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c716WellbeingCd) return false;
        return st.player && st.player.day >= 80 && st.needs && st.status && st.corporate;
      },
      choices: [
        {
          text: "🧘 工作生活平衡", hint: "心情+8,疲劳-8,置_c716Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c716WellbeingCd = true;
            st.flags._c716Balanced = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '工作是为了生活,不是为了牺牲生活。' 心情+8,疲劳-8。", "success");
            }
          }
        },
        {
          text: "🏋️ 职场健康管理", hint: "健康+5,置_c716Healthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c716WellbeingCd = true;
            st.flags._c716Healthy = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+5。", "info");
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

/**
 * 域C(职业/成长) 联动增强 R828 (第十五轮循环)
 * 桥接：
 *   C→A  c828_career_insight 职业洞察 → 消费 jobs/skills 数据
 *   C→B  c828_career_narrative 职业叙事 → 消费 职业历史+事件
 *   C→G  c828_career_wellness 职业健康 → 消费 职业数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR828Loaded) return;
  RANDOM_EVENTS._domainCLinkageR828Loaded = true;

  var EVENTS = [
    {
      id: "c828_career_insight", phase: "street", _isChainEvent: false, icon: "💼",
      title: "职业洞察", story: "你的职业数据正在讲述成长故事——这些数据,就是你的职业资本。",
      triggers: { minDay: 150, interval: 250, maxRepeats: 3, excludeFlags: ["_c828DataCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._c828DataCd) return false; return st.player && st.player.day >= 150 && st.skills; },
      text: function (st) { if (!st) return null; return "你的职业正在成长——'这些数据,就是你的职业资本。'"; },
      choices: [
        { text: "📊 分析轨迹", hint: "智力+20,会计XP+15,置_c828Analyst",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c828DataCd = true; st.flags._c828Analyst = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20); if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("💼 '职业成长需要数据支撑。' 智力+20,会计XP+15。", "success"); } }
        },
        { text: "🎯 规划路径", hint: "管理XP+20,置_c828Planner",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c828DataCd = true; st.flags._c828Planner = true; if (typeof addSkillXp === "function") { try { addSkillXp("management", 20); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🎯 '有规划才有方向。' 管理XP+20。", "info"); } }
        }
      ]
    },
    {
      id: "c828_career_narrative", phase: "street", _isChainEvent: false, icon: "📖",
      title: "职业叙事", story: "你的职业变化正在书写故事——每一步,都值得记录。",
      triggers: { minDay: 250, interval: 300, maxRepeats: 3, excludeFlags: ["_c828NarrCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._c828NarrCd) return false; return st.player && st.player.day >= 250 && st.employment; },
      text: function (st) { if (!st) return null; var j = "无"; if (st.employment && st.employment.currentJob) j = st.employment.currentJob.name || "在职"; return "当前职业" + j + "——'这就是你的职业故事。'"; },
      choices: [
        { text: "📜 记录历程", hint: "心智+20,置_c828Chronicler",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c828NarrCd = true; st.flags._c828Chronicler = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '每一步都值得记录。' 心智+20。", "success"); } }
        },
        { text: "🚀 展望未来", hint: "智力+18,魅力+15,置_c828Visionary",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c828NarrCd = true; st.flags._c828Visionary = true; if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18); st.player.charm = Math.min(100, (st.player.charm || 50) + 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("🚀 '职业生涯需要远见。' 智力+18,魅力+15。", "info"); } }
        }
      ]
    },
    {
      id: "c828_career_wellness", phase: "street", _isChainEvent: false, icon: "💚",
      title: "职业健康", story: "工作不应以牺牲健康为代价——工作与健康,需要平衡。",
      triggers: { minDay: 350, interval: 400, maxRepeats: 4, excludeFlags: ["_c828HealthCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._c828HealthCd) return false; return st.player && st.player.day >= 350 && st.needs && st.status; },
      text: function (st) { if (!st) return null; var f = st.needs && isFinite(st.needs.fatigue) ? Math.round(st.needs.fatigue) : 0; return "职场疲劳" + f + "——'工作与健康,需要平衡。'"; },
      choices: [
        { text: "🧘 平衡生活", hint: "心情+20,疲劳-20,置_c828Balanced",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c828HealthCd = true; st.flags._c828Balanced = true; if (st.needs) { st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20); st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20); } if (typeof StateManager !== "undefined") { StateManager.addMessage("💚 '工作是为了生活。' 心情+20,疲劳-20。", "success"); } }
        },
        { text: "🏋️ 健康管理", hint: "健康+18,置_c828Healthy",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c828HealthCd = true; st.flags._c828Healthy = true; if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18); if (typeof StateManager !== "undefined") { StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+18。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
/**
 * 域C(职业/成长) 联动增强 R843 (第十七轮循环)
 * 桥接：
 *   C→A  c843_career_path 职业路径 → 消费 jobs/skills 数据
 *   C→B  c843_career_memo 职业记忆 → 消费 职业历史+事件
 *   C→G  c843_career_energy 职业精力 → 消费 职业数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR843Loaded) return;
  RANDOM_EVENTS._domainCLinkageR843Loaded = true;

  var EVENTS = [
    {
      id: "c843_career_path", phase: "street", _isChainEvent: false, icon: "💼",
      title: "职业路径", story: "你的职业数据正在讲述成长故事——这些数据,就是你的职业资本。",
      triggers: { minDay: 100, interval: 180, maxRepeats: 3, excludeFlags: ["_c843PathCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._c843PathCd) return false; return st.player && st.player.day >= 100 && st.skills; },
      text: function (st) { if (!st) return null; return "你的职业正在成长——'这些数据,就是你的职业资本。'"; },
      choices: [
        { text: "📊 分析", hint: "智力+20,会计XP+15,置_c843Analyst",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c843PathCd = true; st.flags._c843Analyst = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20); if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("💼 '职业成长需要数据支撑。' 智力+20,会计XP+15。", "success"); } }
        },
        { text: "🎯 规划", hint: "管理XP+20,置_c843Planner",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c843PathCd = true; st.flags._c843Planner = true; if (typeof addSkillXp === "function") { try { addSkillXp("management", 20); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🎯 '有规划才有方向。' 管理XP+20。", "info"); } }
        }
      ]
    },
    {
      id: "c843_career_memo", phase: "street", _isChainEvent: false, icon: "📖",
      title: "职业记忆", story: "你的职业变化正在书写故事——每一步,都值得记录。",
      triggers: { minDay: 180, interval: 220, maxRepeats: 3, excludeFlags: ["_c843MemoCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._c843MemoCd) return false; return st.player && st.player.day >= 180 && st.employment; },
      text: function (st) { if (!st) return null; var j = "无"; if (st.employment && st.employment.currentJob) j = st.employment.currentJob.name || "在职"; return "当前职业" + j + "——'这就是你的职业故事。'"; },
      choices: [
        { text: "📜 记录", hint: "心智+20,置_c843Chronicler",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c843MemoCd = true; st.flags._c843Chronicler = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '每一步都值得记录。' 心智+20。", "success"); } }
        },
        { text: "🚀 展望", hint: "智力+18,魅力+15,置_c843Visionary",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c843MemoCd = true; st.flags._c843Visionary = true; if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18); st.player.charm = Math.min(100, (st.player.charm || 50) + 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("🚀 '职业生涯需要远见。' 智力+18,魅力+15。", "info"); } }
        }
      ]
    },
    {
      id: "c843_career_energy", phase: "street", _isChainEvent: false, icon: "💚",
      title: "职业精力", story: "工作不应以牺牲健康为代价——工作与健康,需要平衡。",
      triggers: { minDay: 250, interval: 300, maxRepeats: 4, excludeFlags: ["_c843EnergyCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._c843EnergyCd) return false; return st.player && st.player.day >= 250 && st.needs && st.status; },
      text: function (st) { if (!st) return null; var f = st.needs && isFinite(st.needs.fatigue) ? Math.round(st.needs.fatigue) : 0; return "职场疲劳" + f + "——'工作与健康,需要平衡。'"; },
      choices: [
        { text: "🧘 平衡", hint: "心情+20,疲劳-20,置_c843Balanced",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c843EnergyCd = true; st.flags._c843Balanced = true; if (st.needs) { st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20); st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20); } if (typeof StateManager !== "undefined") { StateManager.addMessage("💚 '工作是为了生活。' 心情+20,疲劳-20。", "success"); } }
        },
        { text: "🏋️ 健康", hint: "健康+18,置_c843Healthy",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c843EnergyCd = true; st.flags._c843Healthy = true; if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18); if (typeof StateManager !== "undefined") { StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+18。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
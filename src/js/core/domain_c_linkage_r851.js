/**
 * 域C(职业/成长) 联动增强 R851 (第十八轮循环)
 * 桥接：
 *   C→A  c851_career_mile 职业里程 → 消费 jobs/skills 数据
 *   C→B  c851_career_note 职业笔记 → 消费 职业历史+事件
 *   C→G  c851_career_stamina 职业耐力 → 消费 职业数据+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR851Loaded) return;
  RANDOM_EVENTS._domainCLinkageR851Loaded = true;

  var EVENTS = [
    {
      id: "c851_career_mile", phase: "street", _isChainEvent: false, icon: "💼",
      title: "职业里程", story: "你的职业数据正在讲述成长故事——这些数据,就是你的职业资本。",
      triggers: { minDay: 90, interval: 160, maxRepeats: 3, excludeFlags: ["_c851MileCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._c851MileCd) return false; return st.player && st.player.day >= 90 && st.skills; },
      text: function (st) { if (!st) return null; return "你的职业正在成长——'这些数据,就是你的职业资本。'"; },
      choices: [
        { text: "📊 分析", hint: "智力+20,会计XP+15,置_c851Analyst",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c851MileCd = true; st.flags._c851Analyst = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20); if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("💼 '职业成长需要数据支撑。' 智力+20,会计XP+15。", "success"); } }
        },
        { text: "🎯 规划", hint: "管理XP+20,置_c851Planner",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c851MileCd = true; st.flags._c851Planner = true; if (typeof addSkillXp === "function") { try { addSkillXp("management", 20); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🎯 '有规划才有方向。' 管理XP+20。", "info"); } }
        }
      ]
    },
    {
      id: "c851_career_note", phase: "street", _isChainEvent: false, icon: "📖",
      title: "职业笔记", story: "你的职业变化正在书写故事——每一步,都值得记录。",
      triggers: { minDay: 160, interval: 200, maxRepeats: 3, excludeFlags: ["_c851NoteCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._c851NoteCd) return false; return st.player && st.player.day >= 160 && st.employment; },
      text: function (st) { if (!st) return null; var j = "无"; if (st.employment && st.employment.currentJob) j = st.employment.currentJob.name || "在职"; return "当前职业" + j + "——'这就是你的职业故事。'"; },
      choices: [
        { text: "📜 记录", hint: "心智+20,置_c851Chronicler",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c851NoteCd = true; st.flags._c851Chronicler = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '每一步都值得记录。' 心智+20。", "success"); } }
        },
        { text: "🚀 展望", hint: "智力+18,魅力+15,置_c851Visionary",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c851NoteCd = true; st.flags._c851Visionary = true; if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18); st.player.charm = Math.min(100, (st.player.charm || 50) + 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("🚀 '职业生涯需要远见。' 智力+18,魅力+15。", "info"); } }
        }
      ]
    },
    {
      id: "c851_career_stamina", phase: "street", _isChainEvent: false, icon: "💚",
      title: "职业耐力", story: "工作不应以牺牲健康为代价——工作与健康,需要平衡。",
      triggers: { minDay: 220, interval: 280, maxRepeats: 4, excludeFlags: ["_c851StaminaCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._c851StaminaCd) return false; return st.player && st.player.day >= 220 && st.needs && st.status; },
      text: function (st) { if (!st) return null; var f = st.needs && isFinite(st.needs.fatigue) ? Math.round(st.needs.fatigue) : 0; return "职场疲劳" + f + "——'工作与健康,需要平衡。'"; },
      choices: [
        { text: "🧘 平衡", hint: "心情+20,疲劳-20,置_c851Balanced",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c851StaminaCd = true; st.flags._c851Balanced = true; if (st.needs) { st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20); st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20); } if (typeof StateManager !== "undefined") { StateManager.addMessage("💚 '工作是为了生活。' 心情+20,疲劳-20。", "success"); } }
        },
        { text: "🏋️ 健康", hint: "健康+18,置_c851Healthy",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._c851StaminaCd = true; st.flags._c851Healthy = true; if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18); if (typeof StateManager !== "undefined") { StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+18。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
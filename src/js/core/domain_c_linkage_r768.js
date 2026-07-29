/**
 * 域C(职业/成长) 联动增强 R768 (第九轮循环)
 * 桥接：
 *   C→A  c768_career_capital_v7 职业资本v7 → 消费 jobs/skills/employment 数据
 *   C→B  c768_career_story_v7 职业故事v7 → 消费 职业历史+事件
 *   C→G  c768_career_health_v7 职业健康v7 → 消费 职业数据+needs
 *   C→D  c768_career_network_v7 职业人脉v7 → 消费 职业社交+关系
 *
 * [全系统自洽修复] R768 A类#1: chammer拼写错误→charm(原值恒忽略玩家魅力)
 * [全系统自洽修复] R768 A类#2: minDay 800/900/600过高→降至150/180/120(事件不可达)
 * [全系统自洽修复] R768 A类#3: 新增C→D职业人脉事件(原r768仅3事件,缺社交桥接)
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR768Loaded) return;
  RANDOM_EVENTS._domainCLinkageR768Loaded = true;

  var EVENTS = [
    // ===== C→A: 职业资本数据化 =====
    {
      id: "c768_career_capital_v7", phase: "street", _isChainEvent: false, icon: "💼",
      title: "职业资本报告",
      story: "你的职业数据正在讲述成长故事——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 3, excludeFlags: ["_c768DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c768DataCd) return false;
        return st.player && st.player.day >= 150 && st.skills;
      },
      choices: [
        {
          text: "📊 分析职业轨迹", hint: "智力+20,会计XP+18,洞察+1",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c768DataCd = true;
            st.flags._c768Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '职业成长,需要数据支撑。' 智力+20,会计XP+18。", "success");
            }
          }
        },
        {
          text: "🎯 规划职业路径", hint: "管理XP+20,置_c768Planner,感知市场",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c768DataCd = true;
            st.flags._c768Planner = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有规划,才有方向。' 管理XP+20,对市场价格的感知更敏锐了。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var skillCount = 0;
        if (st.skills) { for (var k in st.skills) { if (st.skills[k] && st.skills[k].level > 0) skillCount++; } }
        return "你的职业正在成长——已掌握" + skillCount + "项技能。'这些数据,就是你的职业资本。'";
      }
    },

    // ===== C→B: 职业故事叙事化 =====
    {
      id: "c768_career_story_v7", phase: "street", _isChainEvent: false, icon: "📖",
      title: "职业故事",
      story: "你的职业变化正在书写故事——{desc}",
      triggers: { minDay: 180, interval: 220, maxRepeats: 3, excludeFlags: ["_c768NarrCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c768NarrCd) return false;
        return st.player && st.player.day >= 180 && st.employment;
      },
      choices: [
        {
          text: "📜 记录职业历程", hint: "心智+20,魅力+8,置_c768Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c768NarrCd = true;
            st.flags._c768Chronicler = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '每一步,都值得记录。' 心智+20,魅力+8。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+15,魅力+12,置_c768Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c768NarrCd = true;
            st.flags._c768Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 12);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '职业生涯,需要远见。' 智力+15,魅力+12。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var jobName = "无";
        if (st.employment && st.employment.currentJob) jobName = st.employment.currentJob.name || "在职";
        var jobDays = (st.employment && st.employment.currentJob && st.employment.currentJob.workDays) || 0;
        return "当前职业" + jobName + "，已工作" + jobDays + "天——'这就是你的职业故事。'";
      }
    },

    // ===== C→G: 职业健康关联 =====
    {
      id: "c768_career_health_v7", phase: "street", _isChainEvent: false, icon: "💚",
      title: "职业健康",
      story: "工作不应以牺牲健康为代价——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 4, excludeFlags: ["_c768HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c768HealthCd) return false;
        return st.player && st.player.day >= 120 && st.needs && st.status;
      },
      choices: [
        {
          text: "🧘 工作生活平衡", hint: "心情+20,疲劳-20,置_c768Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c768HealthCd = true;
            st.flags._c768Balanced = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '工作是为了生活,不是为了牺牲生活。' 心情+20,疲劳-20。", "success");
            }
          }
        },
        {
          text: "🏋️ 职场健康管理", hint: "健康+15,疲劳-10,置_c768Healthy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c768HealthCd = true;
            st.flags._c768Healthy = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 15);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+15,疲劳-10。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var fatigue = st.needs && st.needs.fatigue ? Math.round(st.needs.fatigue) : 0;
        var health = st.status && st.status.health ? Math.round(st.status.health) : 100;
        return "职场疲劳" + fatigue + "，当前健康" + health + "——'工作与健康,需要平衡。'";
      }
    },

    // ===== C→D: 职业人脉社交 =====
    {
      id: "c768_career_network_v7", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "职场人脉",
      story: "你的职业圈子正在扩大——{desc}",
      triggers: { minDay: 100, interval: 200, maxRepeats: 3, excludeFlags: ["_c768NetworkCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c768NetworkCd) return false;
        return st.player && st.player.day >= 100 && st.employment;
      },
      choices: [
        {
          text: "🤝 主动拓展人脉", hint: "社交XP+15,魅力+10,置_c768Networker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c768NetworkCd = true;
            st.flags._c768Networker = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 10);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 15); } catch(e) {} }
            // 提升职场同事好感
            if (st.relationships) {
              var workplaceIds = ["boss_li", "xiao_mei", "zhaojie", "old_zhou"];
              for (var ni = 0; ni < workplaceIds.length; ni++) {
                if (st.relationships[workplaceIds[ni]] && st.relationships[workplaceIds[ni]].met) {
                  if (typeof applyAffinityChange === "function") {
                    applyAffinityChange(st, workplaceIds[ni], 3, "职场人脉拓展");
                  }
                }
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '人脉就是机会。' 社交XP+15,魅力+10,同事好感+3。", "success");
            }
          }
        },
        {
          text: "💡 深耕专业圈子", hint: "智力+10,管理XP+12,置_c768DeepExpert",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c768NetworkCd = true;
            st.flags._c768DeepExpert = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 '专业能力才是立身之本。' 智力+10,管理XP+12。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var metCount = 0;
        if (st.relationships) { for (var rid in st.relationships) { if (st.relationships[rid] && st.relationships[rid].met) metCount++; } }
        return "你已结识" + metCount + "位朋友——'职场人脉,是职业成长的加速器。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
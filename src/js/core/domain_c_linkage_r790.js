/**
 * 域C(职业/成长) 联动增强 R790 (sensenova-exp 第四轮循环)
 * 桥接：
 *   C→B  c790_career_story_milestone 职业故事里程碑 → 消费 职业历史+事件
 *   C→D  c790_career_colleague_bond 职场同事羁绊 → 消费 职业+关系数据
 *   C→F  c790_career_path_ui 职业路径UI → 消费 技能+履历数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR790Loaded) return;
  RANDOM_EVENTS._domainCLinkageR790Loaded = true;

  var EVENTS = [
    // ====== C→B 职业故事里程碑 ======
    {
      id: "c790_career_story_milestone", phase: "street", _isChainEvent: false, icon: "📜",
      title: "职业故事里程碑",
      story: "每一份工作都是一段故事——{desc}",
      triggers: { minDay: 520, interval: 600, maxRepeats: 3, excludeFlags: ["_c790StoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c790StoryCd) return false;
        return st.player && st.player.day >= 520 && st.player.job;
      },
      choices: [
        {
          text: "📖 回顾职业经历", hint: "心智+12, 智力+10, 置_c790StoryReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c790StoryCd = true;
            st.flags._c790StoryReviewer = true;
            // 记录职业故事供B域消费
            var _job = st.player.job || "unknown";
            var _day = st.player && st.player.day || 0;
            if (!st.flags._careerStoryMilestones) st.flags._careerStoryMilestones = [];
            st.flags._careerStoryMilestones.push({
              day: _day, job: _job, type: "review"
            });
            if (st.flags._careerStoryMilestones.length > 10) st.flags._careerStoryMilestones.shift();
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '每一份工作都是人生的一个章节。' 心智+12, 智力+10。", "info");
            }
          }
        },
        {
          text: "📝 写下职业感悟", hint: "心智+15, 魅力+5, 置_c790StoryWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c790StoryCd = true;
            st.flags._c790StoryWriter = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 '文字是时间的锚。' 心智+15, 魅力+5。", "success");
            }
          }
        }
      ]
    },

    // ====== C→D 职场同事羁绊 ======
    {
      id: "c790_career_colleague_bond", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "职场同事羁绊",
      story: "同事不只是同事——{desc}",
      triggers: { minDay: 580, interval: 600, maxRepeats: 3, excludeFlags: ["_c790ColleagueCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c790ColleagueCd) return false;
        return st.player && st.player.day >= 580 && st.player.job && st.relationships;
      },
      choices: [
        {
          text: "🤝 加深同事关系", hint: "魅力+12, 心智+8, 置_c790ColleagueBuilder",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c790ColleagueCd = true;
            st.flags._c790ColleagueBuilder = true;
            // 记录同事羁绊数据供D域消费
            var _job = st.player.job || "unknown";
            st.flags._c790ColleagueJob = _job;
            st.flags._c790ColleagueDay = st.player && st.player.day || 0;
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 12);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '职场上的朋友，是一辈子的财富。' 魅力+12, 心智+8。", "info");
            }
          }
        },
        {
          text: "🍵 请同事喝下午茶", hint: "魅力+15, 心情+8, 置_c790TeaHost",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c790ColleagueCd = true;
            st.flags._c790TeaHost = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🍵 '下午茶是职场关系的润滑剂。' 魅力+15, 心情+8。", "success");
            }
          }
        }
      ]
    },

    // ====== C→F 职业路径UI ======
    {
      id: "c790_career_path_ui", phase: "street", _isChainEvent: false, icon: "🗺️",
      title: "职业路径规划",
      story: "你的职业道路通向何方？——{desc}",
      triggers: { minDay: 460, interval: 600, maxRepeats: 3, excludeFlags: ["_c790PathCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c790PathCd) return false;
        return st.player && st.player.day >= 460;
      },
      choices: [
        {
          text: "🗺️ 查看职业路径", hint: "心智+12, 智力+10, 置_c790PathViewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c790PathCd = true;
            st.flags._c790PathViewer = true;
            // 收集职业路径数据供UI展示
            var _job = st.player && st.player.job || "unemployed";
            var _phase = st.player && st.player.phase || "street";
            var _education = (st.player && st.player.education) || 0;
            st.flags._c790CareerPath = { job: _job, phase: _phase, education: _education };
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗺️ '知道自己在哪里，才知道要去哪里。' 心智+12, 智力+10。", "info");
            }
          }
        },
        {
          text: "🎯 设定职业目标", hint: "心智+15, 管理XP+10, 置_c790PathGoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c790PathCd = true;
            st.flags._c790PathGoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '目标决定方向，行动决定结果。' 心智+15, 管理XP+10。", "success");
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
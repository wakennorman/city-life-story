/**
 * 域F(UI/UX) 联动增强 R696
 * 桥接：
 *   F→A  f696_data_story_v3          数据故事v3 → 消费 state.resources+state.player,
 *     将数字转化为叙事
 *   F→C  f696_career_path_viz        职业路径可视化 → 消费 state.employment,
 *     职业发展轨迹展示
 *   F→G  f696_wellness_tracker       健康追踪 → 消费 state.status+state.needs,
 *     综合健康管理
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR696Loaded) return;
  RANDOM_EVENTS._domainFLinkageR696Loaded = true;

  var EVENTS = [
    {
      id: "f696_data_story_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "数字背后的人生",
      story: "你开始把生活中的数字变成故事",
      triggers: { minDay: 60, interval: 80, maxRepeats: 3, excludeFlags: ["_f696StoryCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._f696StoryCd) return false;
        return st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "📊 写生活总结",
          hint: "心智+5,智力+2,置_f696Writer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f696StoryCd = true;
            st.flags._f696Writer = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 把数字写成故事,就是赋予生活意义。心智+5,智力+2。", "success");
            }
          }
        },
        {
          text: "📈 做数据图表",
          hint: "会计XP+4,置_f696Chart",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f696StoryCd = true;
            st.flags._f696Chart = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 一图胜千言,数据可视化让规律一目了然。会计XP+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        return "第" + day + "天——'如果人生有仪表盘,现在各项指标如何?'";
      }
    },
    {
      id: "f696_career_path_viz",
      phase: "street",
      _isChainEvent: false,
      icon: "🗺️",
      title: "职业路径可视化",
      story: "你的职业发展历程值得被记录",
      triggers: { minDay: 90, interval: 100, maxRepeats: 2, excludeFlags: ["_f696CareerCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._f696CareerCd) return false;
        return st.employment && st.employment.currentJob && st.player && st.player.day >= 90;
      },
      choices: [
        {
          text: "🎯 规划下一步",
          hint: "管理XP+5,智力+3,置_f696Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f696CareerCd = true;
            st.flags._f696Planner = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗺️ 看到来路,才能规划去路。管理XP+5,智力+3。", "success");
            }
          }
        },
        {
          text: "😊 感恩经历",
          hint: "心情+8,置_f696Thankful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f696CareerCd = true;
            st.flags._f696Thankful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 每一步都算数,感恩一路走来。心情+8。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "从第一份工作到现在——'职业发展不是直线,是螺旋上升。'";
      }
    },
    {
      id: "f696_wellness_tracker",
      phase: "street",
      _isChainEvent: false,
      icon: "💚",
      title: "健康追踪",
      story: "你的健康数据一目了然",
      triggers: { minDay: 50, interval: 70, maxRepeats: 3, excludeFlags: ["_f696WellCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._f696WellCd) return false;
        return st.player && st.player.day >= 50;
      },
      choices: [
        {
          text: "🏃 制定运动计划",
          hint: "健康+5,心智+3,置_f696Exercise",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f696WellCd = true;
            st.flags._f696Exercise = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 身体是革命的本钱。健康+5,心智+3。", "success");
            }
          }
        },
        {
          text: "😴 关注睡眠",
          hint: "健康+3,心情+6,置_f696Sleep",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f696WellCd = true;
            st.flags._f696Sleep = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 睡好觉,一切都好。健康+3,心情+6。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 0;
        return "健康" + health + "%——'看着仪表盘,今天该关注哪个指标?'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

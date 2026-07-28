/**
 * 域F(UI/UX) 联动增强 R680
 * 桥接：
 *   F→A  f680_data_storytelling      数据故事化 → 消费 state.resources+state.player 数据,
 *     将数字转化为叙事体验
 *   F→C  f680_career_milestone_ui    职业里程碑UI → 消费 state.employment+state.career 数据,
 *     职业节点可视化反馈
 *   F→G  f680_life_dashboard         人生仪表盘 → 消费 state.player+state.needs+state.status 数据,
 *     综合健康/幸福/成长一览
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR680Loaded) return;
  RANDOM_EVENTS._domainFLinkageR680Loaded = true;

  var EVENTS = [
    {
      id: "f680_data_storytelling",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "数字背后的人生",
      story: "你开始把生活中的数字变成故事",
      triggers: { minDay: 60, interval: 90, maxRepeats: 3, excludeFlags: ["_f680StoryCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._f680StoryCd) return false;
        return st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "📖 写一篇生活总结",
          hint: "心智+5,智力+2,置_f680Writer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f680StoryCd = true;
            st.flags._f680Writer = true;
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
          text: "📈 做一张数据图表",
          hint: "会计XP+4,置_f680Chart",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f680StoryCd = true;
            st.flags._f680Chart = true;
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
        var cash = (st.resources && st.resources.cash) || 0;
        return "第" + day + "天,存款¥" + cash + "——这些数字背后,是你每天起早贪黑的故事。'如果把生活画成曲线,会是什么样子?'";
      }
    },
    {
      id: "f680_career_milestone_ui",
      phase: "street",
      _isChainEvent: false,
      icon: "🏆",
      title: "职业里程碑",
      story: "你的职业历程值得被记录",
      triggers: { minDay: 90, interval: 100, maxRepeats: 2, excludeFlags: ["_f680MilestoneCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._f680MilestoneCd) return false;
        return st.employment && st.employment.currentJob && st.player && st.player.day >= 90;
      },
      choices: [
        {
          text: "🎉 庆祝小成就",
          hint: "心情+8,置_f680Celebrate(峰终定律)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f680MilestoneCd = true;
            st.flags._f680Celebrate = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 每一段旅程都值得庆祝!心情+8。", "success");
            }
          }
        },
        {
          text: "🎯 设定下一目标",
          hint: "管理XP+5,智力+3,置_f680GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f680MilestoneCd = true;
            st.flags._f680GoalSetter = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 里程碑不是终点,是新起点。管理XP+5,智力+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var job = st.employment && st.employment.currentJob && st.employment.currentJob.title;
        return "回想这一路——" + (job ? "从做" + job + "开始" : "从最低处开始") + ",每一步都算数。'是时候停下来,看看自己走了多远。'";
      }
    },
    {
      id: "f680_life_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "🎛️",
      title: "人生仪表盘",
      story: "你开始审视自己人生的全貌",
      triggers: { minDay: 120, interval: 150, maxRepeats: 2, excludeFlags: ["_f680DashCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._f680DashCd) return false;
        return st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "💪 关注健康指标",
          hint: "健康+5,心智+3,置_f680HealthFocus",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f680DashCd = true;
            st.flags._f680HealthFocus = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 健康是1,其他是0。健康+5,心智+3。", "success");
            }
          }
        },
        {
          text: "😊 关注幸福指数",
          hint: "心情+10,置_f680HappyFocus",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f680DashCd = true;
            st.flags._f680HappyFocus = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 幸福不是终点,是旅程本身。心情+10。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 0;
        var happy = (st.needs && st.needs.happiness) || 0;
        return "健康" + health + "%,心情" + happy + "%——'人生就像仪表盘,每个指标都值得关注。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

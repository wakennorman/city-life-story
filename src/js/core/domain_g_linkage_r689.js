/**
 * 域G(核心机制/生命周期) 联动增强 R689
 * 桥接：
 *   G→C  g689_life_stage_career_pivot 人生阶段职业转折 → 消费 state.player+state.employment,
 *     年龄节点触发职业转折
 *   G→A  g689_life_data_visualization 人生数据可视化 → 消费 state.player+state.status+state.needs,
 *     综合人生数据叙事
 *   G→E  g689_life_wealth_milestone   人生财富里程碑 → 消费 state.resources,
 *     财富节点叙事回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR689Loaded) return;
  RANDOM_EVENTS._domainGLinkageR689Loaded = true;

  var EVENTS = [
    {
      id: "g689_life_stage_career_pivot",
      phase: "street",
      _isChainEvent: false,
      icon: "🔄",
      title: "职业转折点",
      story: "站在人生的路口,你思考职业方向",
      triggers: { minDay: 180, interval: 200, maxRepeats: 2, excludeFlags: ["_g689PivotCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._g689PivotCd) return false;
        return st.employment && st.employment.currentJob && st.player && st.player.day >= 180;
      },
      choices: [
        {
          text: "🎯 深耕当前领域",
          hint: "管理XP+6,置_g689Deepen",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g689PivotCd = true;
            st.flags._g689Deepen = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 专注是稀缺能力,时间壁垒最坚固。管理XP+6。", "success");
            }
          }
        },
        {
          text: "🌱 探索新可能",
          hint: "智力+5,社交XP+3,置_g689Explore",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g689PivotCd = true;
            st.flags._g689Explore = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌱 树挪死人挪活,看看别的可能。智力+5,社交XP+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "工作这么久,你问自己——'这辈子就这样了,还是还有别的可能?'";
      }
    },
    {
      id: "g689_life_data_visualization",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "人生数据可视化",
      story: "你开始用数据审视自己的人生",
      triggers: { minDay: 100, interval: 120, maxRepeats: 2, excludeFlags: ["_g689VizCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._g689VizCd) return false;
        return st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "📈 做人生复盘",
          hint: "心智+5,智力+3,置_g689Review",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g689VizCd = true;
            st.flags._g689Review = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 了解自己是改变的第一步。心智+5,智力+3。", "success");
            }
          }
        },
        {
          text: "🎯 设定新目标",
          hint: "管理XP+4,智力+2,置_g689Goal",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g689VizCd = true;
            st.flags._g689Goal = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 没有目标就没有方向。管理XP+4,智力+2。", "info");
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
      id: "g689_life_wealth_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "财富里程碑",
      story: "你想起了那些关于钱的时刻",
      triggers: { minDay: 120, interval: 150, maxRepeats: 2, excludeFlags: ["_g689WealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._g689WealthCd) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash >= 10000 && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "🎉 庆祝小成就",
          hint: "心情+8,置_g689Celebrate(峰终定律)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g689WealthCd = true;
            st.flags._g689Celebrate = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 每个里程碑都值得庆祝!心情+8。", "success");
            }
          }
        },
        {
          text: "🚀 继续滚雪球",
          hint: "会计XP+5,智力+2,置_g689Compound",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g689WealthCd = true;
            st.flags._g689Compound = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 复利是世界第八大奇迹。会计XP+5,智力+2。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "存款终于突破一万——'记得第一次赚到¥500时的激动吗?这种成就感,值得铭记。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

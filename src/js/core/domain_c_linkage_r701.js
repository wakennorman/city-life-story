/**
 * 域C(职业/成长) 联动增强 R701
 * 桥接：
 *   C→A  c701_skill_data_insight     技能数据洞察 → 消费 state.skills,
 *     技能等级数据分析
 *   C→E  c701_career_finance_bridge  职业财务桥梁 → 消费 state.employment+state.resources,
 *     职业收入与财务管理
 *   C→G  c701_growth_milestone       成长里程碑 → 消费 state.skills+state.player,
 *     技能成长节点叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR701Loaded) return;
  RANDOM_EVENTS._domainCLinkageR701Loaded = true;

  function topSkill(st) {
    if (!st || !st.skills) return null;
    var best = null, bestLv = -1;
    for (var k in st.skills) {
      var s = st.skills[k];
      if (s && typeof s.level === "number" && s.level > bestLv) {
        bestLv = s.level; best = k;
      }
    }
    return best;
  }

  var EVENTS = [
    {
      id: "c701_skill_data_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "🔬",
      title: "技能数据洞察",
      story: "你的技能数据藏着成长的规律",
      triggers: { minDay: 70, interval: 90, maxRepeats: 3, excludeFlags: ["_c701InsightCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c701InsightCd) return false;
        return topSkill(st) && st.player && st.player.day >= 70;
      },
      choices: [
        {
          text: "📊 分析成长曲线",
          hint: "智力+4,会计XP+4,置_c701Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c701InsightCd = true;
            st.flags._c701Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据揭示成长的规律。智力+4,会计XP+4。", "success");
            }
          }
        },
        {
          text: "🎯 设定新目标",
          hint: "管理XP+5,智力+2,置_c701Goal",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c701InsightCd = true;
            st.flags._c701Goal = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 没有目标就没有方向。管理XP+5,智力+2。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "技能'" + (topSkill(st) || "无") + "'的积累越来越快——'数据告诉我,坚持是有回报的。'";
      }
    },
    {
      id: "c701_career_finance_bridge",
      phase: "street",
      _isChainEvent: false,
      icon: "🌉",
      title: "职业与财务的桥梁",
      story: "工作收入是财务自由的基础",
      triggers: { minDay: 80, interval: 100, maxRepeats: 2, excludeFlags: ["_c701BridgeCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c701BridgeCd) return false;
        return st.employment && st.employment.currentJob && st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "💰 规划工资分配",
          hint: "会计XP+5,心智+3,置_c701Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c701BridgeCd = true;
            st.flags._c701Planner = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 工资到账,先规划再花。会计XP+5,心智+3。", "success");
            }
          }
        },
        {
          text: "🎁 犒劳自己",
          hint: "心情+8,置_c701Treat",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c701BridgeCd = true;
            st.flags._c701Treat = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎁 辛苦赚钱,也要懂得享受。心情+8。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "工资到账——'工作不只是为了钱,但钱是工作的基础。'";
      }
    },
    {
      id: "c701_growth_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "🏆",
      title: "成长里程碑",
      story: "技能提升到一个新阶段",
      triggers: { minDay: 100, interval: 120, maxRepeats: 2, excludeFlags: ["_c701MsCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c701MsCd) return false;
        return st.skills && Object.keys(st.skills).length > 0 && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "🎉 庆祝成就",
          hint: "心情+10,置_c701Celebrate(峰终定律)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c701MsCd = true;
            st.flags._c701Celebrate = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 每一个里程碑都值得庆祝!心情+10。", "success");
            }
          }
        },
        {
          text: "🚀 继续前进",
          hint: "管理XP+4,智力+3,置_c701Forward",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c701MsCd = true;
            st.flags._c701Forward = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 路还长,继续前进。管理XP+4,智力+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "技能提升到新阶段——'本事长在身上,谁也拿不走。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

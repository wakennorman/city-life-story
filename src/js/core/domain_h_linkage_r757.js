/**
 * 域H(Phase2/公司) 联动增强 R757 (第七轮循环)
 * 桥接：
 *   H→A  h757_corp_intelligence_v8 公司情报v8 → 消费 company 全量数据
 *   H→B  h757_corp_legend_v9 公司传奇v9 → 消费 startup 估值+营收
 *   H→G  h757_founder_wellbeing_v8 创始人幸福感v8 → 消费 公司压力+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR757Loaded) return;
  RANDOM_EVENTS._domainHLinkageR757Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  var EVENTS = [
    {
      id: "h757_corp_intelligence_v8", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "经营者智慧",
      story: "公司的数据正在讲述经营故事——{desc}",
      triggers: { minDay: 500, interval: 600, maxRepeats: 3, excludeFlags: ["_h757IntelCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h757IntelCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 500;
      },
      choices: [
        {
          text: "📈 分析经营数据", hint: "会计XP+18,智力+15,置_h757Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h757IntelCd = true;
            st.flags._h757Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据驱动决策。' 会计XP+18,智力+15。", "success");
            }
          }
        },
        {
          text: "🎯 设定经营目标", hint: "管理XP+18,置_h757GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h757IntelCd = true;
            st.flags._h757GoalSetter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '目标明确,执行有力。' 管理XP+18。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var val = st.startup && st.startup.company && st.startup.company.valuation ? Math.round(st.startup.company.valuation) : 0;
        return "公司估值¥" + val.toLocaleString() + "——'这些数据,就是你的经营智慧。'";
      }
    },
    {
      id: "h757_corp_legend_v9", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司传奇",
      story: "你的公司正在书写传奇——{desc}",
      triggers: { minDay: 600, interval: 700, maxRepeats: 3, excludeFlags: ["_h757LegendCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h757LegendCd) return false;
        return hasCompany(st) && st.startup.company.valuation >= 100000000 && st.player && st.player.day >= 600;
      },
      choices: [
        {
          text: "📖 记录公司故事", hint: "心智+18,置_h757Storyteller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h757LegendCd = true;
            st.flags._h757Storyteller = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 '每家公司都有自己的传奇。' 心智+18。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+15,魅力+15,置_h757Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h757LegendCd = true;
            st.flags._h757Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '心有多大,舞台就有多大。' 智力+15,魅力+15。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var val = st.startup && st.startup.company && st.startup.company.valuation ? Math.round(st.startup.company.valuation) : 0;
        return "公司估值¥" + val.toLocaleString() + "——'这是一个值得讲述的故事。'";
      }
    },
    {
      id: "h757_founder_wellbeing_v8", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "创始人幸福感",
      story: "经营公司不应以健康为代价——{desc}",
      triggers: { minDay: 400, interval: 500, maxRepeats: 4, excludeFlags: ["_h757WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h757WellbeingCd) return false;
        return hasCompany(st) && st.needs && st.status && st.player && st.player.day >= 400;
      },
      choices: [
        {
          text: "🧘 调整工作节奏", hint: "健康+15,疲劳-20,置_h757Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h757WellbeingCd = true;
            st.flags._h757Balanced = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 15);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '创业是马拉松,不是百米冲刺。' 健康+15,疲劳-20。", "success");
            }
          }
        },
        {
          text: "🏋️ 坚持锻炼", hint: "健康+18,置_h757Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h757WellbeingCd = true;
            st.flags._h757Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+18。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var health = st.status && st.status.health ? Math.round(st.status.health) : 100;
        var fatigue = st.needs && st.needs.fatigue ? Math.round(st.needs.fatigue) : 0;
        return "健康" + health + "%,疲劳" + fatigue + "——'创始人健康,才是最大的资产。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

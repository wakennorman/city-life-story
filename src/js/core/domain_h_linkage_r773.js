/**
 * 域H(Phase2/公司) 联动增强 R773 (第九轮循环)
 * 桥接：
 *   H→A  h773_corp_intelligence_v10 公司情报v10 → 消费 company 全量数据
 *   H→B  h773_corp_legend_v11 公司传奇v11 → 消费 startup 估值+营收
 *   H→G  h773_founder_wellbeing_v10 创始人幸福感v10 → 消费 公司压力+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR773Loaded) return;
  RANDOM_EVENTS._domainHLinkageR773Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  var EVENTS = [
    {
      id: "h773_corp_intelligence_v10", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "经营者智慧",
      story: "公司的数据正在讲述经营故事——{desc}",
      triggers: { minDay: 1000, interval: 1100, maxRepeats: 3, excludeFlags: ["_h773IntelCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h773IntelCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 1000;
      },
      choices: [
        {
          text: "📈 分析经营数据", hint: "会计XP+25,智力+20,置_h773Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h773IntelCd = true;
            st.flags._h773Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据驱动决策。' 会计XP+25,智力+20。", "success");
            }
          }
        },
        {
          text: "🎯 设定经营目标", hint: "管理XP+25,置_h773GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h773IntelCd = true;
            st.flags._h773GoalSetter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '目标明确,执行有力。' 管理XP+25。", "info");
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
      id: "h773_corp_legend_v11", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司传奇",
      story: "你的公司正在书写传奇——{desc}",
      triggers: { minDay: 1100, interval: 1200, maxRepeats: 3, excludeFlags: ["_h773LegendCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h773LegendCd) return false;
        return hasCompany(st) && st.startup.company.valuation >= 1000000000 && st.player && st.player.day >= 1100;
      },
      choices: [
        {
          text: "📖 记录公司故事", hint: "心智+25,置_h773Storyteller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h773LegendCd = true;
            st.flags._h773Storyteller = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 '每家公司都有自己的传奇。' 心智+25。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+20,魅力+20,置_h773Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h773LegendCd = true;
            st.flags._h773Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 20);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '心有多大,舞台就有多大。' 智力+20,魅力+20。", "info");
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
      id: "h773_founder_wellbeing_v10", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "创始人幸福感",
      story: "经营公司不应以健康为代价——{desc}",
      triggers: { minDay: 900, interval: 1000, maxRepeats: 4, excludeFlags: ["_h773WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h773WellbeingCd) return false;
        return hasCompany(st) && st.needs && st.status && st.player && st.player.day >= 900;
      },
      choices: [
        {
          text: "🧘 调整工作节奏", hint: "健康+20,疲劳-30,置_h773Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h773WellbeingCd = true;
            st.flags._h773Balanced = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 20);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 30);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '创业是马拉松,不是百米冲刺。' 健康+20,疲劳-30。", "success");
            }
          }
        },
        {
          text: "🏋️ 坚持锻炼", hint: "健康+25,置_h773Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h773WellbeingCd = true;
            st.flags._h773Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+25。", "info");
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

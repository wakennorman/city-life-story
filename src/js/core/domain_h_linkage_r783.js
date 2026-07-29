/**
 * 域H(Phase2/公司) 联动增强 R783 (第十轮循环)
 * 桥接：
 *   H→A  h783_corp_intelligence_v11 公司情报v11 → 消费 company 全量数据
 *   H→B  h783_corp_legend_v12 公司传奇v12 → 消费 startup 估值+营收
 *   H→G  h783_founder_wellbeing_v11 创始人幸福感v11 → 消费 公司压力+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR783Loaded) return;
  RANDOM_EVENTS._domainHLinkageR783Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  var EVENTS = [
    {
      id: "h783_corp_intelligence_v11", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "经营者智慧",
      story: "公司的数据正在讲述经营故事——{desc}",
      triggers: { minDay: 1000, interval: 1100, maxRepeats: 3, excludeFlags: ["_h783IntelCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h783IntelCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 1000;
      },
      choices: [
        {
          text: "📈 分析经营数据", hint: "会计XP+30,智力+25,置_h783Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h783IntelCd = true;
            st.flags._h783Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 25);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 30); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据驱动决策。' 会计XP+30,智力+25。", "success");
            }
          }
        },
        {
          text: "🎯 设定经营目标", hint: "管理XP+30,置_h783GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h783IntelCd = true;
            st.flags._h783GoalSetter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 30); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '目标明确,执行有力。' 管理XP+30。", "info");
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
      id: "h783_corp_legend_v12", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司传奇",
      story: "你的公司正在书写传奇——{desc}",
      triggers: { minDay: 1200, interval: 1300, maxRepeats: 3, excludeFlags: ["_h783LegendCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h783LegendCd) return false;
        return hasCompany(st) && st.startup.company.valuation >= 1000000000 && st.player && st.player.day >= 1200;
      },
      choices: [
        {
          text: "📖 记录公司故事", hint: "心智+30,置_h783Storyteller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h783LegendCd = true;
            st.flags._h783Storyteller = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 30);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 '每家公司都有自己的传奇。' 心智+30。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+25,魅力+25,置_h783Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h783LegendCd = true;
            st.flags._h783Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 25);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 25);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '心有多大,舞台就有多大。' 智力+25,魅力+25。", "info");
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
      id: "h783_founder_wellbeing_v11", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "创始人幸福感",
      story: "经营公司不应以健康为代价——{desc}",
      triggers: { minDay: 900, interval: 1000, maxRepeats: 4, excludeFlags: ["_h783WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h783WellbeingCd) return false;
        return hasCompany(st) && st.needs && st.status && st.player && st.player.day >= 900;
      },
      choices: [
        {
          text: "🧘 调整工作节奏", hint: "健康+25,疲劳-35,置_h783Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h783WellbeingCd = true;
            st.flags._h783Balanced = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 25);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 35);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '创业是马拉松,不是百米冲刺。' 健康+25,疲劳-35。", "success");
            }
          }
        },
        {
          text: "🏋️ 坚持锻炼", hint: "健康+30,置_h783Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h783WellbeingCd = true;
            st.flags._h783Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 30);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+30。", "info");
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

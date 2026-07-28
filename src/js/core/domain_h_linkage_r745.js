/**
 * 域H(Phase2/公司) 联动增强 R745 (第五轮循环)
 * 桥接：
 *   H→A  h745_corp_intelligence_v5 公司情报v5 → 消费 company 全量数据
 *   H→B  h745_corp_legend_v6 公司传奇v6 → 消费 startup 估值+营收
 *   H→G  h745_founder_wellbeing_v5 创始人幸福感v5 → 消费 公司压力+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR745Loaded) return;
  RANDOM_EVENTS._domainHLinkageR745Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  var EVENTS = [
    {
      id: "h745_corp_intelligence_v5", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "经营者智慧",
      story: "公司的数据正在讲述经营故事——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 3, excludeFlags: ["_h745IntelCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h745IntelCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 250;
      },
      choices: [
        {
          text: "📈 分析经营数据", hint: "会计XP+10,智力+8,置_h745Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h745IntelCd = true;
            st.flags._h745Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据驱动决策。' 会计XP+10,智力+8。", "success");
            }
          }
        },
        {
          text: "🎯 设定经营目标", hint: "管理XP+10,置_h745GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h745IntelCd = true;
            st.flags._h745GoalSetter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '目标明确,执行有力。' 管理XP+10。", "info");
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
      id: "h745_corp_legend_v6", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司传奇",
      story: "你的公司正在书写传奇——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 3, excludeFlags: ["_h745LegendCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h745LegendCd) return false;
        return hasCompany(st) && st.startup.company.valuation >= 10000000 && st.player && st.player.day >= 300;
      },
      choices: [
        {
          text: "📖 记录公司故事", hint: "心智+10,置_h745Storyteller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h745LegendCd = true;
            st.flags._h745Storyteller = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 '每家公司都有自己的传奇。' 心智+10。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+8,魅力+8,置_h745Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h745LegendCd = true;
            st.flags._h745Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '心有多大,舞台就有多大。' 智力+8,魅力+8。", "info");
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
      id: "h745_founder_wellbeing_v5", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "创始人幸福感",
      story: "经营公司不应以健康为代价——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 4, excludeFlags: ["_h745WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h745WellbeingCd) return false;
        return hasCompany(st) && st.needs && st.status && st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "🧘 调整工作节奏", hint: "健康+8,疲劳-15,置_h745Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h745WellbeingCd = true;
            st.flags._h745Balanced = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 8);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '创业是马拉松,不是百米冲刺。' 健康+8,疲劳-15。", "success");
            }
          }
        },
        {
          text: "🏋️ 坚持锻炼", hint: "健康+10,置_h745Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h745WellbeingCd = true;
            st.flags._h745Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+10。", "info");
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

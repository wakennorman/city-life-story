/**
 * 域H(Phase2/公司) 联动增强 R737 (第四轮循环)
 * 桥接：
 *   H→A  h737_corp_intelligence_v4 公司情报v4 → 消费 company 全量数据
 *   H→B  h737_corp_legend_v5 公司传奇v5 → 消费 startup 估值+营收
 *   H→G  h737_founder_wellbeing_v4 创始人幸福感v4 → 消费 公司压力+needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR737Loaded) return;
  RANDOM_EVENTS._domainHLinkageR737Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  var EVENTS = [
    {
      id: "h737_corp_intelligence_v4", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "经营者智慧",
      story: "公司的数据正在讲述经营故事——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 3, excludeFlags: ["_h737IntelCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h737IntelCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "📈 分析经营数据", hint: "会计XP+9,智力+6,置_h737Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h737IntelCd = true;
            st.flags._h737Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 9); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据驱动决策。' 会计XP+9,智力+6。", "success");
            }
          }
        },
        {
          text: "🎯 设定经营目标", hint: "管理XP+8,置_h737GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h737IntelCd = true;
            st.flags._h737GoalSetter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '目标明确,执行有力。' 管理XP+8。", "info");
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
      id: "h737_corp_legend_v5", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司传奇",
      story: "你的公司正在书写传奇——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 3, excludeFlags: ["_h737LegendCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h737LegendCd) return false;
        return hasCompany(st) && st.startup.company.valuation >= 5000000 && st.player && st.player.day >= 250;
      },
      choices: [
        {
          text: "📖 记录公司故事", hint: "心智+8,置_h737Storyteller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h737LegendCd = true;
            st.flags._h737Storyteller = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 '每家公司都有自己的传奇。' 心智+8。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+7,魅力+6,置_h737Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h737LegendCd = true;
            st.flags._h737Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 7);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 6);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '心有多大,舞台就有多大。' 智力+7,魅力+6。", "info");
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
      id: "h737_founder_wellbeing_v4", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "创始人幸福感",
      story: "经营公司不应以健康为代价——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 4, excludeFlags: ["_h737WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h737WellbeingCd) return false;
        return hasCompany(st) && st.needs && st.status && st.player && st.player.day >= 150;
      },
      choices: [
        {
          text: "🧘 调整工作节奏", hint: "健康+7,疲劳-14,置_h737Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h737WellbeingCd = true;
            st.flags._h737Balanced = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 7);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 14);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '创业是马拉松,不是百米冲刺。' 健康+7,疲劳-14。", "success");
            }
          }
        },
        {
          text: "🏋️ 坚持锻炼", hint: "健康+9,置_h737Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h737WellbeingCd = true;
            st.flags._h737Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 9);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+9。", "info");
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

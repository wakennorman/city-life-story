/**
 * 域H(Phase2/公司) 联动增强 R721
 * 桥接：
 *   H→A  h713_corp_intelligence_v2 公司情报v2 → 消费 company 全量数据,
 *     将隐形公司数据显性化为"经营者智慧"
 *   H→B  h713_corp_legend_v3 公司传奇v3 → 消费 startup 估值+营收,
 *     公司里程碑触发叙事回响
 *   H→G  h713_founder_wellbeing_v2 创始人幸福感v2 → 消费 公司压力+needs,
 *     经营压力传导至创始人健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR721Loaded) return;
  RANDOM_EVENTS._domainHLinkageR721Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  var EVENTS = [
    {
      id: "h713_corp_intelligence_v2", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "经营者智慧",
      story: "公司的数据正在讲述经营故事——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 3, excludeFlags: ["_h721IntelCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h721IntelCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "📈 分析经营数据", hint: "会计XP+7,智力+4,置_h721Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h721IntelCd = true;
            st.flags._h721Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 7); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据驱动决策。' 会计XP+7,智力+4。", "success");
            }
          }
        },
        {
          text: "🎯 设定经营目标", hint: "管理XP+6,置_h721GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h721IntelCd = true;
            st.flags._h721GoalSetter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '目标明确,执行有力。' 管理XP+6。", "info");
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
      id: "h713_corp_legend_v3", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司传奇",
      story: "你的公司正在书写传奇——{desc}",
      triggers: { minDay: 180, interval: 240, maxRepeats: 3, excludeFlags: ["_h721LegendCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h721LegendCd) return false;
        return hasCompany(st) && st.startup.company.valuation >= 1000000 && st.player && st.player.day >= 180;
      },
      choices: [
        {
          text: "📖 记录公司故事", hint: "心智+6,置_h721Storyteller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h721LegendCd = true;
            st.flags._h721Storyteller = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 '每家公司都有自己的传奇。' 心智+6。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+5,魅力+4,置_h721Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h721LegendCd = true;
            st.flags._h721Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 4);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '心有多大,舞台就有多大。' 智力+5,魅力+4。", "info");
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
      id: "h713_founder_wellbeing_v2", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "创始人幸福感",
      story: "经营公司不应以健康为代价——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 4, excludeFlags: ["_h721WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h721WellbeingCd) return false;
        return hasCompany(st) && st.needs && st.status && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "🧘 调整工作节奏", hint: "健康+5,疲劳-10,置_h721Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h721WellbeingCd = true;
            st.flags._h721Balanced = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '创业是马拉松,不是百米冲刺。' 健康+5,疲劳-10。", "success");
            }
          }
        },
        {
          text: "🏋️ 坚持锻炼", hint: "健康+7,置_h721Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h721WellbeingCd = true;
            st.flags._h721Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 7);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+7。", "info");
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

/**
 * 域H(Phase2/公司) 联动增强 R713
 * 桥接：
 *   H→A  h713_corp_data_asset_v3 公司数据资产v3 → 消费 company 运营数据,
 *     将隐形公司数据显性化为"经营者仪表盘"
 *   H→B  h713_corp_legend_v2 公司传奇v2 → 消费 startup 估值+营收,
 *     公司里程碑触发叙事回响
 *   H→G  h713_founder_lifestyle_v3 创始人生活v3 → 消费 公司压力+needs,
 *     经营压力传导至创始人健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR713Loaded) return;
  RANDOM_EVENTS._domainHLinkageR713Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  var EVENTS = [
    {
      id: "h713_corp_data_asset_v3", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "经营者仪表盘",
      story: "公司的数据正在讲述经营故事——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_h713DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h713DataCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "📈 分析经营数据", hint: "会计XP+6,智力+3,置_h713Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h713DataCd = true;
            st.flags._h713Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据驱动决策。' 会计XP+6,智力+3。", "success");
            }
          }
        },
        {
          text: "🎯 设定经营目标", hint: "管理XP+5,置_h713GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h713DataCd = true;
            st.flags._h713GoalSetter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '目标明确,执行有力。' 管理XP+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var val = st.startup && st.startup.company && st.startup.company.valuation ? Math.round(st.startup.company.valuation) : 0;
        return "公司估值¥" + val.toLocaleString() + "——'这些数据,就是你的经营成果。'";
      }
    },
    {
      id: "h713_corp_legend_v2", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司传奇",
      story: "你的公司正在书写传奇——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 3, excludeFlags: ["_h713LegendCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h713LegendCd) return false;
        return hasCompany(st) && st.startup.company.valuation >= 500000 && st.player && st.player.day >= 150;
      },
      choices: [
        {
          text: "📖 记录公司故事", hint: "心智+5,置_h713Storyteller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h713LegendCd = true;
            st.flags._h713Storyteller = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 '每家公司都有自己的传奇。' 心智+5。", "success");
            }
          }
        },
        {
          text: "🚀 展望未来发展", hint: "智力+4,魅力+3,置_h713Visionary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h713LegendCd = true;
            st.flags._h713Visionary = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 '心有多大,舞台就有多大。' 智力+4,魅力+3。", "info");
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
      id: "h713_founder_lifestyle_v3", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "创始人生活平衡",
      story: "经营公司不应以健康为代价——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 4, excludeFlags: ["_h713LifestyleCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h713LifestyleCd) return false;
        return hasCompany(st) && st.needs && st.status && st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "🧘 调整工作节奏", hint: "健康+4,疲劳-8,置_h713Balanced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h713LifestyleCd = true;
            st.flags._h713Balanced = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 4);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '创业是马拉松,不是百米冲刺。' 健康+4,疲劳-8。", "success");
            }
          }
        },
        {
          text: "🏋️ 坚持锻炼", hint: "健康+6,置_h713Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h713LifestyleCd = true;
            st.flags._h713Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+6。", "info");
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

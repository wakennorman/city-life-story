/**
 * 域F(UI/UX) 联动增强 R719
 * 桥接：
 *   F→B  f719_event_memory_wall_v4 事件记忆墙v4 → 消费 events_core+news 数据,
 *     将隐形事件数据显性化为"人生记忆墙"
 *   F→E  f719_finance_dashboard_v5 财务仪表盘v5 → 消费 investment+resources,
 *     财务数据可视化+理财行为引导
 *   F→H  f719_corp_health_v4 公司健康度v4 → 消费 company+status,
 *     公司运营健康度可视化
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR719Loaded) return;
  RANDOM_EVENTS._domainFLinkageR719Loaded = true;

  var EVENTS = [
    {
      id: "f719_event_memory_wall_v4", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "人生记忆墙",
      story: "你经历的事件正在组成记忆墙——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 3, excludeFlags: ["_f719MemoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f719MemoryCd) return false;
        return st.player && st.player.day >= 150;
      },
      choices: [
        {
          text: "📜 回顾重要事件", hint: "心智+6,置_f719EventReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f719MemoryCd = true;
            st.flags._f719EventReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🖼️ '记忆,是人生最珍贵的财富。' 心智+6。", "success");
            }
          }
        },
        {
          text: "📖 书写人生故事", hint: "社交XP+7,置_f719LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f719MemoryCd = true;
            st.flags._f719LifeWriter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 7); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '书写,让记忆永存。' 社交XP+7。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        return "你已度过" + days + "天——'这些记忆,构成了你的人生。'";
      }
    },
    {
      id: "f719_finance_dashboard_v5", phase: "corporate", _isChainEvent: false, icon: "💰",
      title: "财务仪表盘",
      story: "你的财务状况一目了然——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_f719FinanceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f719FinanceCd) return false;
        return st.resources && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "📊 分析收支结构", hint: "智力+5,会计XP+5,置_f719Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f719FinanceCd = true;
            st.flags._f719Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '理财,从了解收支开始。' 智力+5,会计XP+5。", "success");
            }
          }
        },
        {
          text: "🎯 设定理财目标", hint: "管理XP+6,置_f719FinancePlanner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f719FinanceCd = true;
            st.flags._f719FinancePlanner = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,理财才有方向。' 管理XP+6。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var cash = st.resources && st.resources.cash ? Math.round(st.resources.cash) : 0;
        var bank = st.resources && st.resources.bankBalance ? Math.round(st.resources.bankBalance) : 0;
        return "现金¥" + cash.toLocaleString() + "+存款¥" + bank.toLocaleString() + "——'财务健康,一目了然。'";
      }
    },
    {
      id: "f719_corp_health_v4", phase: "corporate", _isChainEvent: false, icon: "🏢",
      title: "公司健康度",
      story: "公司运营的健康状况需要关注——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 3, excludeFlags: ["_f719CorpHealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f719CorpHealthCd) return false;
        return st.startup && st.startup.company && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "📊 评估公司健康", hint: "管理XP+7,置_f719CorpAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f719CorpHealthCd = true;
            st.flags._f719CorpAnalyst = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 7); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏢 '公司健康,需要定期体检。' 管理XP+7。", "success");
            }
          }
        },
        {
          text: "🧘 关注团队状态", hint: "社交XP+6,置_f719TeamCaretaker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f719CorpHealthCd = true;
            st.flags._f719TeamCaretaker = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '团队健康,是公司最大的资产。' 社交XP+6。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var empCount = st.startup && st.startup.company && st.startup.company.employees ? st.startup.company.employees.length : 0;
        return "团队" + empCount + "人——'公司健康,需要每个人的关注。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

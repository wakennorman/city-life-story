/**
 * 域F(UI/UX) 联动增强 R784 (sensenova-exp 第三轮循环)
 * 桥接：
 *   F→A  f784_data_story_panel 数据故事面板 → 消费 全维度数据
 *   F→E  f784_finance_dashboard 财务仪表盘 → 消费 投资+资产数据
 *   F→G  f784_health_trend_ui 健康趋势UI → 消费 健康+需求数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR784Loaded) return;
  RANDOM_EVENTS._domainFLinkageR784Loaded = true;

  var EVENTS = [
    // ====== F→A 数据故事面板 ======
    {
      id: "f784_data_story_panel", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据故事",
      story: "数据不会说谎——{desc}",
      triggers: { minDay: 400, interval: 600, maxRepeats: 3, excludeFlags: ["_f784DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f784DataCd) return false;
        return st.player && st.player.day >= 400;
      },
      choices: [
        {
          text: "📋 查看综合数据", hint: "智力+12, 心智+8, 置_f784DataViewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f784DataCd = true;
            st.flags._f784DataViewer = true;
            // 收集综合数据供UI展示
            var _day = st.player && st.player.day || 0;
            var _cash = (st.resources && st.resources.cash) || 0;
            var _health = (st.status && st.status.health) || 100;
            var _topSkill = "无";
            if (st.skills) {
              var _maxLv = 0;
              for (var _sk in st.skills) {
                var _lv = st.skills[_sk] && st.skills[_sk].level || 0;
                if (_lv > _maxLv) { _maxLv = _lv; _topSkill = _sk; }
              }
            }
            st.flags._f784LastDataSnapshot = { day: _day, cash: _cash, health: _health, topSkill: _topSkill };
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据是人生的镜子。' 智力+12, 心智+8。", "info");
            }
          }
        },
        {
          text: "🎯 设定数据目标", hint: "心智+15, 置_f784DataGoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f784DataCd = true;
            st.flags._f784DataGoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标的数据才有意义。' 心智+15。", "success");
            }
          }
        }
      ]
    },

    // ====== F→E 财务仪表盘 ======
    {
      id: "f784_finance_dashboard", phase: "street", _isChainEvent: false, icon: "💰",
      title: "财务仪表盘",
      story: "你的财务状况一目了然——{desc}",
      triggers: { minDay: 520, interval: 600, maxRepeats: 3, excludeFlags: ["_f784FinanceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f784FinanceCd) return false;
        return st.player && st.player.day >= 520 && st.resources;
      },
      choices: [
        {
          text: "💰 查看财务概览", hint: "智力+12, 会计XP+12, 置_f784FinanceViewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f784FinanceCd = true;
            st.flags._f784FinanceViewer = true;
            // 记录财务数据供UI展示
            var _cash = (st.resources && st.resources.cash) || 0;
            var _bank = (st.resources && st.resources.bankBalance) || 0;
            var _debt = 0;
            if (st.resources) {
              _debt = (st.resources.villageDebt || 0) + (st.resources.fineDebt || 0) + (st.resources.bankDebt || 0);
            }
            st.flags._f784LastFinanceSnapshot = { cash: _cash, bank: _bank, debt: _debt, netWorth: _cash + _bank - _debt };
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '财务健康是人生自由的基础。' 智力+12, 会计XP+12。", "info");
            }
          }
        },
        {
          text: "📈 分析收支结构", hint: "智力+15, 会计XP+15, 置_f784IncomeAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f784FinanceCd = true;
            st.flags._f784IncomeAnalyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '开源节流，财富自来。' 智力+15, 会计XP+15。", "success");
            }
          }
        }
      ]
    },

    // ====== F→G 健康趋势UI ======
    {
      id: "f784_health_trend_ui", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "健康趋势报告",
      story: "你的健康在说话——{desc}",
      triggers: { minDay: 300, interval: 500, maxRepeats: 4, excludeFlags: ["_f784HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f784HealthCd) return false;
        return st.player && st.player.day >= 300 && st.status && st.needs;
      },
      choices: [
        {
          text: "📋 查看健康趋势", hint: "心智+10, 健康+3, 置_f784HealthTrendViewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f784HealthCd = true;
            st.flags._f784HealthTrendViewer = true;
            // 记录健康趋势数据供UI展示
            var _health = (st.status && st.status.health) || 100;
            var _happiness = (st.needs && st.needs.happiness) || 50;
            var _fatigue = (st.needs && st.needs.fatigue) || 0;
            if (!st.flags._healthTrendHistory) st.flags._healthTrendHistory = [];
            st.flags._healthTrendHistory.push({
              day: st.player && st.player.day || 0,
              health: _health,
              happiness: _happiness,
              fatigue: _fatigue
            });
            if (st.flags._healthTrendHistory.length > 30) st.flags._healthTrendHistory.shift();
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 80) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("❤️ '关注健康趋势，胜过临时抱佛脚。' 心智+10, 健康+3。", "info");
            }
          }
        },
        {
          text: "💪 设定健康目标", hint: "心智+12, 置_f784HealthGoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f784HealthCd = true;
            st.flags._f784HealthGoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 '健康是一生的课题。' 心智+12。", "success");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
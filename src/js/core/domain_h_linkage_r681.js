/**
 * 域H(Phase2/公司) 联动增强 R681
 * 桥接：
 *   H→C  h681_corp_career_synergy    公司职业协同 → 消费 state.corporate+state.career 数据,
 *     公司→职场经验反哺公司管理
 *   H→B  h681_corp_legend_narrative   公司传奇叙事 → 消费 state.startup+state.flags 数据,
 *     公司→创业故事成为传奇叙事
 *   H→E  h681_corp_financial_mastery  公司财务精通 → 消费 state.startup+state.investment 数据,
 *     公司→公司运营经验提升投资能力
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR681Loaded) return;
  RANDOM_EVENTS._domainHLinkageR681Loaded = true;

  // 辅助：获取公司阶段
  function corpStage(st) {
    if (!st || !st.startup || !st.startup.company) return "none";
    var rev = st.startup.company.revenue || 0;
    var emp = (st.startup.company.employees || []).length;
    if (rev >= 1000000) return "scale";
    if (rev >= 200000) return "growth";
    if (rev >= 50000) return "early";
    if (emp > 0 || rev > 0) return "mvp";
    return "idea";
  }

  var EVENTS = [
    {
      id: "h681_corp_career_synergy", phase: "corporate", _isChainEvent: false, icon: "🔄",
      title: "公司职业协同",
      story: "你的职场经验正在反哺公司管理——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_h681CareerSynergyDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h681CareerSynergyDone) return false;
        if (!st.startup || !st.startup.company) return false;
        return st.corporate && st.corporate.active;
      },
      choices: [
        { text: "📋 引入管理方法", hint: "管理XP+10,公司效率+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h681CareerSynergyDone = true;
          st.flags._corpMgmtSynergy = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch(e) {} }
          if (st.startup && st.startup.company) {
            st.startup.company.efficiency = Math.min(100, (st.startup.company.efficiency || 0) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 '职场经验是最好的管理教材。' 你引入了成熟的职场管理方法。管理XP+10,公司效率+5。", "success");
        }},
        { text: "👥 团队培训", hint: "社交XP+6,团队士气+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h681CareerSynergyDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
          if (st.startup && st.startup.company) {
            st.startup.company.morale = Math.min(100, (st.startup.company.morale || 0) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 '分享经验,共同成长。' 你为团队做了培训。社交XP+6,团队士气+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var stage = corpStage(st);
        return "你的职场经验正在反哺公司管理——'公司处于" + stage + "阶段,你的职场经验正在反哺公司管理。'";
      }
    },
    {
      id: "h681_corp_legend_narrative", phase: "corporate", _isChainEvent: false, icon: "📖",
      title: "公司传奇叙事",
      story: "创业路上的每一个故事,都在成为公司的传奇——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 1, excludeFlags: ["_h681LegendDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h681LegendDone) return false;
        if (!st.startup || !st.startup.company) return false;
        var rev = st.startup.company.revenue || 0;
        return rev >= 200000;
      },
      choices: [
        { text: "📝 记录创业故事", hint: "心智+7,社交XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h681LegendDone = true;
          st.flags._corpLegendWritten = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 '每个创业故事都值得被记录。' 你开始记录公司的传奇故事。心智+7,社交XP+5。", "success");
        }},
        { text: "📣 分享经验", hint: "管理XP+5,名气+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h681LegendDone = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📣 '分享传奇,成就传奇。' 你在行业会议上分享了创业经验。管理XP+5,名气+10。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var rev = (st.startup && st.startup.company && st.startup.company.revenue) || 0;
        return "创业路上的每一个故事,都在成为公司的传奇——'月营收¥" + Math.round(rev).toLocaleString() + ",每一个数字背后都是一个故事。'";
      }
    },
    {
      id: "h681_corp_financial_mastery", phase: "corporate", _isChainEvent: false, icon: "💹",
      title: "公司财务精通",
      story: "经营公司让你对财务有了更深刻的理解——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_h681FinanceMasteryDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h681FinanceMasteryDone) return false;
        if (!st.startup || !st.startup.company) return false;
        var rev = st.startup.company.revenue || 0;
        return rev >= 100000;
      },
      choices: [
        { text: "📊 优化财务结构", hint: "会计XP+10,现金+5000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h681FinanceMasteryDone = true;
          st.flags._corpFinanceOptimized = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 5000;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 10); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '公司财务是投资的基础。' 你优化了公司财务结构。会计XP+10,现金+¥5000。", "success");
        }},
        { text: "📈 拓展融资渠道", hint: "管理XP+6,公司估值+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h681FinanceMasteryDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
          if (st.startup && st.startup.company) {
            st.startup.company.valuation = Math.round((st.startup.company.valuation || 0) * 1.1);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '融资是公司发展的加速器。' 你拓展了融资渠道。管理XP+6,公司估值+10%。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var rev = (st.startup && st.startup.company && st.startup.company.revenue) || 0;
        var val = (st.startup && st.startup.company && st.startup.company.valuation) || 0;
        return "经营公司让你对财务有了更深刻的理解——'月营收¥" + Math.round(rev).toLocaleString() + ",估值¥" + Math.round(val).toLocaleString() + "。公司财务精通,投资能力提升。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
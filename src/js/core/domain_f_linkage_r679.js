/**
 * 域F(UI/UX) 联动增强 R679
 * 桥接：
 *   F→H  f679_ui_corp_health_dash    公司运营健康度 → 消费 state.corporate+state.corp 数据,
 *     UI→公司运营指标可视化展示
 *   F→C  f679_ui_skill_roadmap_v2    技能成长路线图v2 → 消费 state.skills 数据,
 *     UI→技能成长路径可视化
 *   F→E  f679_ui_portfolio_snapshot   投资组合快照 → 消费 state.investment 数据,
 *     UI→投资组合摘要与风险提示
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR679Loaded) return;
  RANDOM_EVENTS._domainFLinkageR679Loaded = true;

  // 辅助：获取技能总等级
  function totalSkillLevel(st) {
    if (!st || !st.skills) return 0;
    var total = 0;
    for (var k in st.skills) {
      var s = st.skills[k];
      if (s && typeof s.level === "number") total += s.level;
    }
    return total;
  }

  var EVENTS = [
    {
      id: "f679_ui_corp_health_dash", phase: "corporate", _isChainEvent: false, icon: "🏢",
      title: "公司运营健康度",
      story: "你开始用数据仪表盘来审视公司运营状况——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_f679CorpHealthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f679CorpHealthDone) return false;
        return st.corporate && st.corporate.active;
      },
      choices: [
        { text: "📊 分析运营数据", hint: "管理XP+10,智力+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f679CorpHealthDone = true;
          st.flags._corpHealthDashboard = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据驱动决策。' 你分析了公司运营数据。管理XP+10,智力+4。", "success");
        }},
        { text: "🎯 优化策略", hint: "会计XP+6,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f679CorpHealthDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '优化永无止境。' 你优化了公司运营策略。会计XP+6,心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var corp = st.corporate || {};
        return "你开始用数据仪表盘来审视公司运营状况——'公司运营" + (corp.corpQuarter || 1) + "季度,健康度数据一目了然。'";
      }
    },
    {
      id: "f679_ui_skill_roadmap_v2", phase: "street", _isChainEvent: false, icon: "🗺️",
      title: "技能成长路线图",
      story: "你绘制了一张技能成长路线图,未来的学习方向清晰可见——{desc}",
      triggers: { minDay: 100, interval: 180, maxRepeats: 2, excludeFlags: ["_f679SkillRoadCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f679SkillRoadCooldown) return false;
        var total = totalSkillLevel(st);
        return total >= 30;
      },
      choices: [
        { text: "📚 制定学习计划", hint: "智力+5,各技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f679SkillRoadCooldown = true;
          st.flags._skillRoadmapPlan = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          // 给技能加少量经验
          if (st.skills) {
            var _count = 0;
            for (var _sk in st.skills) {
              if (st.skills[_sk] && typeof st.skills[_sk].xp === "number" && _count < 3) {
                st.skills[_sk].xp = (st.skills[_sk].xp || 0) + 3;
                _count++;
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '学习路线图,让成长有方向。' 你制定了学习计划。智力+5,技能XP+3。", "success");
        }},
        { text: "🎯 专注突破", hint: "最高技能XP+10,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f679SkillRoadCooldown = true;
          // 给最高技能加经验
          if (st.skills) {
            var _best = null, _bestLv = -1;
            for (var _sk2 in st.skills) {
              if (st.skills[_sk2] && typeof st.skills[_sk2].level === "number" && st.skills[_sk2].level > _bestLv) {
                _bestLv = st.skills[_sk2].level;
                _best = _sk2;
              }
            }
            if (_best && typeof addSkillXp === "function") { try { addSkillXp(_best, 10); } catch(e) {} }
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '专注一个方向,做到极致。' 你专注突破最高技能。最高技能XP+10,管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var total = totalSkillLevel(st);
        return "你绘制了一张技能成长路线图——'技能总等级" + total + ",未来的学习方向清晰可见。'";
      }
    },
    {
      id: "f679_ui_portfolio_snapshot", phase: "street", _isChainEvent: false, icon: "📸",
      title: "投资组合快照",
      story: "你拍了一张投资组合的快照,记录了当前的市场仓位——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_f679PortfolioCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f679PortfolioCooldown) return false;
        return st.investment && (st.investment.stockHoldings || st.investment.btcHoldings);
      },
      choices: [
        { text: "📊 分析仓位", hint: "会计XP+7,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f679PortfolioCooldown = true;
          st.flags._portfolioSnapshotTaken = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 7); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '投资组合需要定期审视。' 你分析了仓位配置。会计XP+7,智力+3。", "success");
        }},
        { text: "⚖️ 再平衡", hint: "管理XP+5,现金+2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f679PortfolioCooldown = true;
          st.flags._portfolioRebalanced = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ '再平衡是投资的艺术。' 你调整了投资组合。管理XP+5,现金+¥2000。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var stocks = (st.investment && st.investment.stockHoldings) ? st.investment.stockHoldings.length : 0;
        return "你拍了一张投资组合的快照——'持有" + stocks + "只股票,市场仓位一目了然。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
/**
 * 域H(Phase2/公司) 联动增强 R787 (sensenova-exp 第三轮循环)
 * 桥接：
 *   H→D  h787_corp_team_social 公司团队社交 → 消费 公司+团队数据
 *   H→E  h787_corp_revenue_invest 公司营收投资 → 消费 公司+投资数据
 *   H→F  h787_corp_health_ui 公司健康度UI → 消费 公司运营数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR787Loaded) return;
  RANDOM_EVENTS._domainHLinkageR787Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  var EVENTS = [
    // ====== H→D 公司团队社交 ======
    {
      id: "h787_corp_team_social", phase: "corporate", _isChainEvent: false, icon: "👥",
      title: "团队社交氛围",
      story: "公司的氛围，决定了团队的战斗力——{desc}",
      triggers: { minDay: 620, interval: 700, maxRepeats: 3, excludeFlags: ["_h787TeamCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h787TeamCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 620;
      },
      choices: [
        {
          text: "🤝 组织团队活动", hint: "魅力+12, 管理XP+15, 置_h787TeamBuilder",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h787TeamCd = true;
            st.flags._h787TeamBuilder = true;
            // 记录团队社交数据供D域消费
            var _company = st.startup && st.startup.company;
            var _empCount = _company ? (_company.employees || []).length : 0;
            st.flags._h787TeamSize = _empCount;
            st.flags._h787LastTeamEvent = st.player && st.player.day || 0;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 12);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("👥 " + _empCount + "人的团队，凝聚力是核心竞争力。魅力+12, 管理XP+15。", "info");
            }
          }
        },
        {
          text: "💬 一对一沟通", hint: "魅力+15, 心智+8, 置_h787TeamCommunicator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h787TeamCd = true;
            st.flags._h787TeamCommunicator = true;
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💬 '倾听是最好的管理。' 魅力+15, 心智+8。", "success");
            }
          }
        }
      ]
    },

    // ====== H→E 公司营收投资 ======
    {
      id: "h787_corp_revenue_invest", phase: "corporate", _isChainEvent: false, icon: "📈",
      title: "公司营收策略",
      story: "公司的现金流，是最好的投资信号——{desc}",
      triggers: { minDay: 700, interval: 700, maxRepeats: 3, excludeFlags: ["_h787RevenueCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h787RevenueCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 700;
      },
      choices: [
        {
          text: "💰 分析营收数据", hint: "智力+15, 会计XP+18, 置_h787RevenueAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h787RevenueCd = true;
            st.flags._h787RevenueAnalyst = true;
            // 记录营收数据供E域消费
            var _company = st.startup && st.startup.company;
            var _revenue = _company ? _company.revenue || 0 : 0;
            var _burnRate = _company ? _company.burnRate || 0 : 0;
            st.flags._h787LastRevenue = _revenue;
            st.flags._h787LastBurnRate = _burnRate;
            st.flags._h787RevenueBurnRatio = _burnRate > 0 ? (_revenue / _burnRate) : 0;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              var _ratio = st.flags._h787RevenueBurnRatio;
              var _msg = _ratio >= 2 ? "📈 营收健康，现金流充裕。" : _ratio >= 1 ? "📈 收支平衡，需关注增长。" : "📈 烧钱率高于营收，需尽快改善！";
              StateManager.addMessage(_msg + " 智力+15, 会计XP+18。", _ratio >= 2 ? "success" : _ratio >= 1 ? "info" : "danger");
            }
          }
        },
        {
          text: "💡 优化收入结构", hint: "智力+18, 管理XP+15, 置_h787RevenueOptimizer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h787RevenueCd = true;
            st.flags._h787RevenueOptimizer = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 '收入结构决定抗风险能力。' 智力+18, 管理XP+15。", "success");
            }
          }
        }
      ]
    },

    // ====== H→F 公司健康度UI ======
    {
      id: "h787_corp_health_ui", phase: "corporate", _isChainEvent: false, icon: "🏥",
      title: "公司健康度",
      story: "公司和人一样，需要定期体检——{desc}",
      triggers: { minDay: 580, interval: 600, maxRepeats: 3, excludeFlags: ["_h787HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h787HealthCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 580;
      },
      choices: [
        {
          text: "🏥 检查公司健康度", hint: "智力+12, 管理XP+12, 置_h787HealthChecker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h787HealthCd = true;
            st.flags._h787HealthChecker = true;
            // 计算公司健康度评分供UI展示
            var _company = st.startup && st.startup.company;
            var _score = 50; // 基础分
            if (_company) {
              var _revenue = _company.revenue || 0;
              var _burnRate = _company.burnRate || 1;
              var _valuation = _company.valuation || 0;
              var _empCount = (_company.employees || []).length;
              if (_revenue > _burnRate * 1.5) _score += 20;
              else if (_revenue > _burnRate) _score += 10;
              else _score -= 10;
              if (_valuation > 500000) _score += 15;
              else if (_valuation > 100000) _score += 5;
              if (_empCount >= 5) _score += 10;
              else if (_empCount >= 3) _score += 5;
              _score = Math.max(0, Math.min(100, _score));
            }
            st.flags._h787CorpHealthScore = _score;
            st.flags._h787LastHealthCheck = st.player && st.player.day || 0;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              var _grade = _score >= 80 ? "优秀" : _score >= 60 ? "良好" : _score >= 40 ? "一般" : "堪忧";
              StateManager.addMessage("🏥 公司健康度评分：" + _score + "分(" + _grade + ")。智力+12, 管理XP+12。", _score >= 60 ? "success" : _score >= 40 ? "info" : "danger");
            }
          }
        },
        {
          text: "📋 制定改善计划", hint: "心智+15, 管理XP+15, 置_h787HealthImprover",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h787HealthCd = true;
            st.flags._h787HealthImprover = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📋 '健康的企业，才有未来。' 心智+15, 管理XP+15。", "success");
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
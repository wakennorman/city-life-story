/**
 * 域H(Phase2/公司) 联动增强 R771 (sensenova-exp 第三轮循环)
 * 桥接：
 *   H→A  h771_corp_data_insight 公司运营数据洞察 → 消费 company 运营数据
 *   H→D  h771_founder_social_circle 创始人社交圈 → 消费 公司阶段+关系
 *   H→G  h771_founder_health_pressure 创始人健康压力 → 消费 公司压力+健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR771Loaded) return;
  RANDOM_EVENTS._domainHLinkageR771Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  var EVENTS = [
    {
      id: "h771_corp_data_insight", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "运营数据洞察",
      story: "你的公司在用数据说话——{desc}",
      triggers: { minDay: 600, interval: 700, maxRepeats: 3, excludeFlags: ["_h771CorpDataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h771CorpDataCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 600;
      },
      choices: [
        {
          text: "📈 分析运营数据", hint: "智力+15, 管理XP+20, 置_h771CorpAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            var _company = st.startup && st.startup.company;
            st.flags._h771CorpDataCd = true;
            st.flags._h771CorpAnalyst = true;
            if (_company) {
              if (!st.flags._corpDataSnapshots) st.flags._corpDataSnapshots = [];
              st.flags._corpDataSnapshots.push({
                day: st.player && st.player.day || 0,
                revenue: _company.revenue || 0,
                burnRate: _company.burnRate || 0,
                valuation: _company.valuation || 0,
                employees: (_company.employees || []).length,
                stage: _company.stage || 0
              });
              if (st.flags._corpDataSnapshots.length > 20) st.flags._corpDataSnapshots.shift();
            }
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据是企业的脉搏。' 智力+15, 管理XP+20。", "success");
            }
          }
        },
        {
          text: "💡 优化运营策略", hint: "智力+18, 会计XP+15, 置_h771CorpOptimizer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h771CorpDataCd = true;
            st.flags._h771CorpOptimizer = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 '优化是永无止境的。' 智力+18, 会计XP+15。", "success");
            }
          }
        }
      ]
    },
    {
      id: "h771_founder_social_circle", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "创始人社交圈",
      story: "你的公司就是你的名片——{desc}",
      triggers: { minDay: 660, interval: 600, maxRepeats: 3, excludeFlags: ["_h771SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h771SocialCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 660;
      },
      choices: [
        {
          text: "🌐 拓展商业人脉", hint: "魅力+12, 名气+8, 置_h771Networker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            var _company = st.startup && st.startup.company;
            st.flags._h771SocialCd = true;
            st.flags._h771Networker = true;
            if (_company) {
              var _valuation = _company.valuation || 0;
              if (_valuation >= 500000) st.flags._h771SocialCircleTier = "elite";
              else if (_valuation >= 100000) st.flags._h771SocialCircleTier = "mid";
              else st.flags._h771SocialCircleTier = "startup";
            }
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 12);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '公司做大了，人脉自然来。' 魅力+12, 名气+8。", "success");
            }
          }
        },
        {
          text: "🎯 参加行业峰会", hint: "魅力+15, 管理XP+15, 置_h771SummitGoer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h771SocialCd = true;
            st.flags._h771SummitGoer = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '行业峰会，信息就是金钱。' 魅力+15, 管理XP+15。", "success");
            }
          }
        }
      ]
    },
    {
      id: "h771_founder_health_pressure", phase: "corporate", _isChainEvent: false, icon: "💊",
      title: "创始人健康警报",
      story: "创业是一场马拉松，不是百米冲刺——{desc}",
      triggers: { minDay: 720, interval: 500, maxRepeats: 3, excludeFlags: ["_h771HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h771HealthCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 720 && st.status && st.needs;
      },
      choices: [
        {
          text: "🏥 做一次全面体检", hint: "健康+15, 心智+8, 置_h771HealthChecked",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h771HealthCd = true;
            st.flags._h771HealthChecked = true;
            var _company = st.startup && st.startup.company;
            var _burnRate = _company ? _company.burnRate || 0 : 0;
            var _health = (st.status && st.status.health) || 80;
            st.flags._h771LastHealthCheck = { day: st.player && st.player.day || 0, health: _health, burnRate: _burnRate };
            if (st.status) st.status.health = Math.min(100, (st.status.health || 80) + 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              var _pressureMsg = _burnRate > 5000 ? "⚠️ 公司烧钱率过高，你的健康正在被透支！" : "💚 体检显示身体状况良好，继续保持。";
              StateManager.addMessage("🏥 " + _pressureMsg + " 健康+15, 心智+8。", _burnRate > 5000 ? "danger" : "success");
            }
          }
        },
        {
          text: "🧘 强制休息一天", hint: "心情+18, 疲劳-15, 置_h771TookRest",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h771HealthCd = true;
            st.flags._h771TookRest = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '休息是为了走更远的路。' 心情+18, 疲劳-15。", "success");
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
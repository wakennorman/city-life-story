/**
 * 域E(经济/投资) 联动增强 R783 (sensenova-exp 第三轮循环)
 * 桥接：
 *   E→A  e783_invest_data_journal 投资数据日记 → 消费 投资组合+市场数据
 *   E→D  e783_investor_social_circle 投资者社交圈 → 消费 投资+关系数据
 *   E→G  e783_financial_freedom_health 财务自由健康 → 消费 资产+健康数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR783Loaded) return;
  RANDOM_EVENTS._domainELinkageR783Loaded = true;

  function getPortfolioValue(st) {
    if (!st || !st.investment) return 0;
    var _pv = st.resources ? (st.resources.cash || 0) + (st.resources.bankBalance || 0) : 0;
    if (st.investment.stockHoldings && st.investment.stockMarket) {
      for (var _s in st.investment.stockHoldings) {
        var _h = st.investment.stockHoldings[_s];
        var _m = st.investment.stockMarket[_s];
        _pv += (_m ? _m.price : 0) * (_h.shares || 0);
      }
    }
    return _pv;
  }

  var EVENTS = [
    // ====== E→A 投资数据日记 ======
    {
      id: "e783_invest_data_journal", phase: "street", _isChainEvent: false, icon: "📒",
      title: "投资数据日记",
      story: "每一笔投资都在书写你的财富故事——{desc}",
      triggers: { minDay: 500, interval: 600, maxRepeats: 3, excludeFlags: ["_e783InvestCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e783InvestCd) return false;
        return st.player && st.player.day >= 500 && st.investment;
      },
      choices: [
        {
          text: "📊 记录投资数据", hint: "智力+15, 会计XP+15, 置_e783InvestJournalist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e783InvestCd = true;
            st.flags._e783InvestJournalist = true;
            // 记录投资数据供A域消费
            var _pv = getPortfolioValue(st);
            if (!st.flags._investDataHistory) st.flags._investDataHistory = [];
            st.flags._investDataHistory.push({
              day: st.player && st.player.day || 0,
              portfolioValue: _pv
            });
            if (st.flags._investDataHistory.length > 20) st.flags._investDataHistory.shift();
            st.flags._e783LastPortfolioValue = _pv;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📒 '投资数据是最诚实的老师。' 智力+15, 会计XP+15。", "info");
            }
          }
        },
        {
          text: "📈 分析收益率", hint: "智力+18, 管理XP+10, 置_e783YieldAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e783InvestCd = true;
            st.flags._e783YieldAnalyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '收益率是投资能力的标尺。' 智力+18, 管理XP+10。", "success");
            }
          }
        }
      ]
    },

    // ====== E→D 投资者社交圈 ======
    {
      id: "e783_investor_social_circle", phase: "street", _isChainEvent: false, icon: "🔄",
      title: "投资者社交圈",
      story: "有钱人总是和有钱人在一起——{desc}",
      triggers: { minDay: 580, interval: 600, maxRepeats: 3, excludeFlags: ["_e783SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e783SocialCd) return false;
        return st.player && st.player.day >= 580 && st.investment;
      },
      choices: [
        {
          text: "🤝 加入投资俱乐部", hint: "魅力+12, 智力+10, 置_e783ClubMember",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e783SocialCd = true;
            st.flags._e783ClubMember = true;
            // 记录投资者社交圈数据供D域消费
            var _pv = getPortfolioValue(st);
            st.flags._e783InvestorSocialTier = _pv >= 200000 ? "high" : _pv >= 50000 ? "mid" : "low";
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 12);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '投资圈里的人脉，是用实力换来的。' 魅力+12, 智力+10。", "success");
            }
          }
        },
        {
          text: "📰 分享投资心得", hint: "魅力+15, 名气+5, 置_e783ShareGuru",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e783SocialCd = true;
            st.flags._e783ShareGuru = true;
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📰 '分享是最好的学习。' 魅力+15, 名气+5。", "info");
            }
          }
        }
      ]
    },

    // ====== E→G 财务自由健康 ======
    {
      id: "e783_financial_freedom_health", phase: "street", _isChainEvent: false, icon: "🛡️",
      title: "财务自由健康",
      story: "钱不是万能的，但没钱是万万不能的——{desc}",
      triggers: { minDay: 660, interval: 600, maxRepeats: 3, excludeFlags: ["_e783HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e783HealthCd) return false;
        return st.player && st.player.day >= 660 && st.investment && st.status && st.needs;
      },
      choices: [
        {
          text: "🏥 评估财务健康", hint: "心智+15, 健康+5, 置_e783HealthFinCheck",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e783HealthCd = true;
            st.flags._e783HealthFinCheck = true;
            // 记录财务健康数据供G域消费
            var _pv = getPortfolioValue(st);
            var _debt = 0;
            if (st.resources) {
              _debt = (st.resources.villageDebt || 0) + (st.resources.fineDebt || 0) + (st.resources.bankDebt || 0);
            }
            st.flags._e783FinHealthRatio = _debt > 0 ? Math.round(_pv / _debt * 100) / 100 : 999;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 80) + 5);
            if (typeof StateManager !== "undefined") {
              var _ratio = st.flags._e783FinHealthRatio;
              var _msg = _ratio >= 5 ? "💪 财务状况健康，资产足以覆盖债务。" : _ratio >= 1 ? "⚠️ 资产勉强覆盖债务，需警惕。" : "🔴 资不抵债！请立即改善财务状况。";
              StateManager.addMessage("🛡️ " + _msg + " 心智+15, 健康+5。", _ratio >= 5 ? "success" : _ratio >= 1 ? "warning" : "danger");
            }
          }
        },
        {
          text: "📋 制定财务计划", hint: "智力+15, 会计XP+15, 置_e783FinancePlanner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e783HealthCd = true;
            st.flags._e783FinancePlanner = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📋 '没有计划的目标，只是愿望。' 智力+15, 会计XP+15。", "success");
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
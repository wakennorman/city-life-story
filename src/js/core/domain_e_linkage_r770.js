/**
 * 域E(经济/投资) 联动增强 R770 (第九轮循环)
 * 桥接：
 *   E→A  e770_investment_wisdom_v8 投资智慧v8 → 消费 investment 全量数据
 *   E→B  e770_market_narrative_v8 市场叙事v8 → 消费 投资盈亏+市场趋势
 *   E→G  e770_wealth_health_v7 财富健康v7 → 消费 财富数据+needs
 *   E→D  e770_invest_social_v7 投资社交圈v7 → 消费 投资数据+关系
 *
 * [全系统自洽修复] R770 A类#1: minDay 800/700/600过高→降至160/180/130(事件不可达)
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR770Loaded) return;
  RANDOM_EVENTS._domainELinkageR770Loaded = true;

  var EVENTS = [
    {
      id: "e770_investment_wisdom_v8", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "投资智慧",
      story: "你的投资数据正在讲述经营故事——{desc}",
      triggers: { minDay: 160, interval: 220, maxRepeats: 3, excludeFlags: ["_e770WisdomCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e770WisdomCd) return false;
        return st.investment && st.investment.portfolio && st.player && st.player.day >= 160;
      },
      choices: [
        {
          text: "📈 分析投资模式", hint: "智力+20,会计XP+18,置_e770Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e770WisdomCd = true;
            st.flags._e770Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据不说谎,但需要解读。' 智力+20,会计XP+18。", "success");
            }
          }
        },
        {
          text: "🎯 调整投资策略", hint: "管理XP+20,置_e770Strategist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e770WisdomCd = true;
            st.flags._e770Strategist = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '策略,决定成败。' 管理XP+20。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var pv = st.investment && st.investment.portfolio ? Math.round(st.investment.portfolio.totalValue || 0) : 0;
        return "投资组合¥" + pv.toLocaleString() + "——'这些数据,就是你的投资智慧。'";
      }
    },
    {
      id: "e770_market_narrative_v8", phase: "corporate", _isChainEvent: false, icon: "📰",
      title: "市场叙事",
      story: "市场的波动正在书写故事——{desc}",
      triggers: { minDay: 180, interval: 240, maxRepeats: 3, excludeFlags: ["_e770NarrCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e770NarrCd) return false;
        return st.investment && st.player && st.player.day >= 180;
      },
      choices: [
        {
          text: "📖 记录市场感悟", hint: "心智+20,置_e770Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e770NarrCd = true;
            st.flags._e770Chronicler = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '市场是最好的老师。' 心智+20。", "success");
            }
          }
        },
        {
          text: "🤝 分享投资心得", hint: "社交XP+20,置_e770Sharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e770NarrCd = true;
            st.flags._e770Sharer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '分享,让知识增值。' 社交XP+20。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "市场的起起落落,正在书写属于你的投资故事——'这些波动,意味着什么?'";
      }
    },
    {
      id: "e770_wealth_health_v7", phase: "street", _isChainEvent: false, icon: "💚",
      title: "财富健康",
      story: "财务健康与身心健康息息相关——{desc}",
      triggers: { minDay: 130, interval: 200, maxRepeats: 4, excludeFlags: ["_e770HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e770HealthCd) return false;
        return st.resources && st.needs && st.status && st.player && st.player.day >= 130;
      },
      choices: [
        {
          text: "😊 感恩财务安全", hint: "心情+20,健康+12,置_e770Secure",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e770HealthCd = true;
            st.flags._e770Secure = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 '财务安全,是幸福的基础。' 心情+20,健康+12。", "success");
            }
          }
        },
        {
          text: "🎯 设定财富目标", hint: "心智+15,置_e770GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e770HealthCd = true;
            st.flags._e770GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '财富目标,需要规划。' 心智+15。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var totalAssets = (st.resources && st.resources.cash || 0) + (st.resources && st.resources.bankBalance || 0);
        return "总资产¥" + Math.round(totalAssets).toLocaleString() + "——'财富,带来了安全感。'";
      }
    },

    // ===== E→D: 投资社交圈 =====
    {
      id: "e770_invest_social_v7", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "投资社交圈",
      story: "你的投资能力引起了朋友们的注意——{desc}",
      triggers: { minDay: 110, interval: 200, maxRepeats: 3, excludeFlags: ["_e770SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e770SocialCd) return false;
        return st.investment && st.player && st.player.day >= 110 && st.relationships;
      },
      choices: [
        {
          text: "🤝 分享投资心得", hint: "社交XP+15,魅力+10,置_e770SocialInvestor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e770SocialCd = true;
            st.flags._e770SocialInvestor = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 10);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 15); } catch(e) {} }
            // 提升已结识NPC好感
            if (st.relationships) {
              for (var rid in st.relationships) {
                if (st.relationships[rid] && st.relationships[rid].met) {
                  if (typeof applyAffinityChange === "function") {
                    applyAffinityChange(st, rid, 2, "投资社交分享");
                    break; // 只提升一个最亲近的NPC
                  }
                }
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '分享投资心得,收获人脉与机会。' 社交XP+15,魅力+10,好友好感+2。", "success");
            }
          }
        },
        {
          text: "💡 低调观察学习", hint: "智力+10,会计XP+12,置_e770SocialLearner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e770SocialCd = true;
            st.flags._e770SocialLearner = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 '多听多看,投资之道在于学习。' 智力+10,会计XP+12。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var metCount = 0;
        if (st.relationships) { for (var rid in st.relationships) { if (st.relationships[rid] && st.relationships[rid].met) metCount++; } }
        var profit = st.investment && st.investment._totalInvestmentProfit ? Math.round(st.investment._totalInvestmentProfit) : 0;
        return "你的投资眼光被" + metCount + "位朋友知晓,累计收益¥" + profit.toLocaleString() + "——'投资,也是一种社交语言。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

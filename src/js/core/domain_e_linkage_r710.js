/**
 * 域E(经济/投资) 联动增强 R710
 * 桥接：
 *   E→B  e710_investment_story          投资故事叙事 → 消费 state.investment,
 *     投资经历转化为叙事成长
 *   E→D  e710_investor_social_circle    投资者社交圈 → 消费 state.investment,
 *     投资成功带来社交圈层提升
 *   E→G  e710_wealth_life_balance       财富与生活平衡 → 消费 state.resources+state.needs,
 *     财富积累影响生活品质
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR710Loaded) return;
  RANDOM_EVENTS._domainELinkageR710Loaded = true;

  function getTotalInvestValue(st) {
    if (!st || !st.investment) return 0;
    var inv = st.investment;
    var total = 0;
    var holdings = inv.stockHoldings || [];
    for (var hi = 0; hi < holdings.length; hi++) {
      var h = holdings[hi];
      var m = inv.stockMarket && inv.stockMarket[h.symbol];
      if (m) total += m.price * h.shares;
    }
    var props = inv.properties || [];
    for (var pi = 0; pi < props.length; pi++) {
      total += props[pi].currentPrice || props[pi].buyPrice || 0;
    }
    if (inv.btcHoldings && inv.btcHoldings > 0) {
      total += (inv.btcPrice || 0) * inv.btcHoldings;
    }
    return total;
  }

  var EVENTS = [
    {
      id: "e710_investment_story", phase: "street", _isChainEvent: false, icon: "📖",
      title: "投资故事",
      story: "每一次投资都是一段故事——{desc}",
      triggers: { minDay: 60, interval: 100, maxRepeats: 3, excludeFlags: ["_e710StoryCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e710StoryCd) return false;
        return st.player && st.player.day >= 60 && st.investment;
      },
      choices: [
        {
          text: "📝 记录投资心得", hint: "会计XP+5,智力+3,置_e710Journal",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e710StoryCd = true;
            st.flags._e710Journal = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 记录投资心得,是最好的学习方式。会计XP+5,智力+3。", "success");
            }
          }
        },
        {
          text: "🗣️ 分享经验", hint: "社交XP+4,心智+3,置_e710Share",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e710StoryCd = true;
            st.flags._e710Share = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗣️ 分享投资经验,在交流中成长。社交XP+4,心智+3。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var total = getTotalInvestValue(st);
        return "持仓市值¥" + Math.round(total).toLocaleString() + "——'每一分钱背后,都有一个故事。'";
      }
    },
    {
      id: "e710_investor_social_circle", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "投资者社交圈",
      story: "财富增长带来了新的社交圈层——{desc}",
      triggers: { minDay: 90, interval: 120, maxRepeats: 2, excludeFlags: ["_e710SocialCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e710SocialCd) return false;
        return st.player && st.player.day >= 90 && st.investment && getTotalInvestValue(st) >= 50000;
      },
      choices: [
        {
          text: "🎯 拓展人脉", hint: "社交XP+6,好感+2,置_e710Network",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e710SocialCd = true;
            st.flags._e710Network = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
            if (typeof applyAffinityChange === "function") {
              var npcs = ["boss_li", "xiao_mei", "zhaojie", "old_zhou"];
              for (var _ni = 0; _ni < npcs.length; _ni++) {
                try { applyAffinityChange(st, npcs[_ni], 2, "投资社交圈"); } catch(e) {}
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 和优秀的人在一起,你也会变得更优秀。社交XP+6,好感+2。", "success");
            }
          }
        },
        {
          text: "📚 低调学习", hint: "智力+5,管理XP+3,置_e710Learn",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e710SocialCd = true;
            st.flags._e710Learn = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 真正的投资者,永远在学习。智力+5,管理XP+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var total = getTotalInvestValue(st);
        return "持仓市值¥" + Math.round(total).toLocaleString() + "——'你的圈子,决定你的阶层。'";
      }
    },
    {
      id: "e710_wealth_life_balance", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "财富与生活",
      story: "钱多了,生活就一定会变好吗——{desc}",
      triggers: { minDay: 50, interval: 80, maxRepeats: 3, excludeFlags: ["_e710WealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e710WealthCd) return false;
        return st.player && st.player.day >= 50;
      },
      choices: [
        {
          text: "🏥 投资健康", hint: "健康+5,现金-500,置_e710HealthInvest",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e710WealthCd = true;
            st.flags._e710HealthInvest = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏥 健康是最大的财富。健康+5,花费¥500。", "success");
            }
          }
        },
        {
          text: "🎯 设定财务目标", hint: "心智+5,管理XP+3,置_e710Goal",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e710WealthCd = true;
            st.flags._e710Goal = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 有目标的人生,才有方向。心智+5,管理XP+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        var health = (st.status && st.status.health) || 100;
        return "存款¥" + cash.toLocaleString() + "·健康" + health + "%——'钱买不到健康,但可以买更好的医疗。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
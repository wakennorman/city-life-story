/**
 * 域E(经济/投资) 联动增强 R679
 * 桥接：
 *   E→C  e679_invest_career_confidence  投资职场信心 → 消费 state.flags._investCareerConfidence+state.employment,
 *     投资收益转化为职场谈判底气
 *   E→G  e679_wealth_life_balance        财富人生平衡 → 消费 state.resources+state.needs,
 *     财富积累后反思生活品质
 *   E→D  e679_investor_friend_circle     投资者朋友圈 → 消费 state.investment+state.relationships,
 *     投资路上结识同道朋友
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR679Loaded) return;
  RANDOM_EVENTS._domainELinkageR679Loaded = true;

  function hasInvestment(st) {
    if (!st || !st.investment) return false;
    return (st.investment.stockHoldings && st.investment.stockHoldings.length > 0) ||
           (st.investment.btcHoldings && st.investment.btcHoldings > 0) ||
           (st.investment.properties && st.investment.properties.length > 0);
  }

  function bumpAff(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {}
    }
  }

  function topMetNpc(st) {
    if (!st || !st.relationships) return null;
    var best = null, bestAff = -999;
    for (var k in st.relationships) {
      var r = st.relationships[k];
      if (r && r.met && typeof r.affinity === "number" && r.affinity > bestAff) {
        bestAff = r.affinity; best = k;
      }
    }
    return best;
  }

  var EVENTS = [
    {
      id: "e679_invest_career_confidence",
      phase: "street",
      _isChainEvent: false,
      icon: "💼",
      title: "投资带来的底气",
      story: "投资收益让你在职场更有底气",
      triggers: { minDay: 100, interval: 120, maxRepeats: 2, excludeFlags: ["_e679ConfCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e679ConfCd) return false;
        if (!hasInvestment(st)) return false;
        return st.employment && st.employment.currentJob && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "💪 用投资收益谈加薪",
          hint: "管理XP+6,心智+3,置_e679Negotiate",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e679ConfCd = true;
            st.flags._e679Negotiate = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 有投资底气就是不一样,你跟老板谈加薪更有筹码了。管理XP+6,心智+3。", "success");
            }
          }
        },
        {
          text: "🤫 低调积累",
          hint: "智力+4,置_e679LowProfile(韬光养晦)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e679ConfCd = true;
            st.flags._e679LowProfile = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤫 财不外露,低调积累才是长久之计。智力+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "看着投资账户里的数字,你心里有了底——'就算工作丢了,我也有底气重新开始。这种安全感,让你在职场中更加从容。'";
      }
    },
    {
      id: "e679_wealth_life_balance",
      phase: "street",
      _isChainEvent: false,
      icon: "⚖️",
      title: "财富与生活的平衡",
      story: "你开始思考赚钱之外的生活",
      triggers: { minDay: 150, interval: 100, maxRepeats: 2, excludeFlags: ["_e679BalanceCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e679BalanceCd) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash >= 30000 && st.player && st.player.day >= 150;
      },
      choices: [
        {
          text: "🌿 给自己放个假",
          hint: "心情+10,健康+5,置_e679Recharge",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e679BalanceCd = true;
            st.flags._e679Recharge = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 3000);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌿 钱是赚不完的,身体是自己的。心情+10,健康+5,花费¥3000。", "success");
            }
          }
        },
        {
          text: "📈 继续滚雪球",
          hint: "会计XP+5,智力+2,置_e679Compound",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e679BalanceCd = true;
            st.flags._e679Compound = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 复利是世界第八大奇迹。会计XP+5,智力+2。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "每天盯盘、算收益、看K线——你突然意识到,已经很久没有好好吃一顿饭、好好走一段路了。'赚钱是为了生活,不是为了把自己累死。'";
      }
    },
    {
      id: "e679_investor_friend_circle",
      phase: "street",
      _isChainEvent: false,
      icon: "👥",
      title: "投资路上的朋友",
      story: "你在投资路上结识了同道中人",
      triggers: { minDay: 60, interval: 80, maxRepeats: 3, excludeFlags: ["_e679FriendCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._e679FriendCd) return false;
        return hasInvestment(st) && st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "🤝 加入投资交流群",
          hint: "社交XP+5,置_e679GroupChat(信息优势)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e679FriendCd = true;
            st.flags._e679GroupChat = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 三人行必有我师,投资群里高手不少。社交XP+5。", "success");
            }
          }
        },
        {
          text: "😌 独自研究",
          hint: "智力+4,会计XP+3,置_e679Solo",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e679FriendCd = true;
            st.flags._e679Solo = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😌 独立思考,不随大流。智力+4,会计XP+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "在投资社区里,你发现了一群志同道合的人——'原来不只是我一个人在研究K线,有人一起讨论真好。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

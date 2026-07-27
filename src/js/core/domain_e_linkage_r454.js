/**
 * 域E(经济/投资) 联动增强 R454（第三轮循环）
 * 桥接：
 *   E→D  e454_invest_social_circle 投资社交圈 → 消费 investment+relationships 数据,
 *     投资心得→"找到同频的人"的投资社交叙事
 *   E→G  e454_invest_life_quality  投资生活品质 → 消费 investment+needs 数据,
 *     投资收益→"钱让生活更好了吗"的生活品质反思
 *   E→C  e454_invest_career_confidence 投资职业自信 → 消费 investment+skills 数据,
 *     投资成功→"赚钱的能力让你更有底气"的职业自信
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR454Loaded) return;
  RANDOM_EVENTS._domainELinkageR454Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }
  function calcPortfolioValue(st) {
    if (!st || !st.investment || !st.investment.portfolio) return 0;
    var p = st.investment.portfolio, total = 0;
    if (p.stocks) { for (var s in p.stocks) { total += (p.stocks[s].shares || 0) * (p.stocks[s].avgPrice || 0); } }
    if (p.funds) { for (var f in p.funds) { total += (p.funds[f].shares || 0) * (p.funds[f].avgPrice || 0); } }
    return total;
  }

  var EVENTS = [
    {
      id: "e454_invest_social_circle", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "投资圈",
      story: "你参加了一个投资交流会，遇到了几个同频的人——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 3, excludeFlags: ["_e454SocialCircleCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 10000 && (st.flags && !st.flags._e454SocialCircleCooldown);
      },
      choices: [
        { text: "🤝 加微信保持联系", hint: "社交XP+5,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e454SocialCircleCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "投资交流会上认识");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你在投资交流会上认识了几位朋友——大家的投资理念相似，聊得很投机。社交XP+5,好感+2。", "success");
        }},
        { text: "📝 记下投资心得", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e454SocialCircleCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你把交流会上听到的投资心得记了下来——别人的经验，可以少走很多弯路。会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var pv = Math.floor(calcPortfolioValue(st));
        return "你参加了一个投资交流会，遇到了几个同频的人——大家聊着各自的投资组合（你的是¥" + pv.toLocaleString() + "），互相分享着心得。";
      }
    },
    {
      id: "e454_invest_life_quality", phase: "street", _isChainEvent: false, icon: "🏠",
      title: "钱买得到什么",
      story: "看着账户里的数字，你问自己——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_e454LifeQualityCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash >= 20000 && (st.flags && !st.flags._e454LifeQualityCooldown);
      },
      choices: [
        { text: "🏠 改善居住环境", hint: "心情+3,健康+1,花费2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e454LifeQualityCooldown = true;
          if (st.resources && st.resources.cash >= 2000) {
            st.resources.cash -= 2000;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
            if (typeof StateManager !== "undefined") StateManager.addMessage("🏠 你花钱把住的地方收拾了一下——换了新床单，买了盆绿植。生活品质提升了一点点。心情+3,健康+1,花费¥2000。", "success");
          }
        }},
        { text: "💰 继续存着", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e454LifeQualityCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏠 你决定继续存着——钱在手里，心里不慌。心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        return "看着账户里的数字（¥" + Math.floor(cash).toLocaleString() + "），你问自己——钱买得到快乐吗？买得到，但买不到全部。";
      }
    },
    {
      id: "e454_invest_career_confidence", phase: "corporate", _isChainEvent: false, icon: "📈",
      title: "底气",
      story: "投资赚了钱之后，你发现自己整个人都更有底气了——{desc}",
      triggers: { minDay: 45, interval: 90, maxRepeats: 3, excludeFlags: ["_e454CareerConfidenceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 20000 && (st.flags && !st.flags._e454CareerConfidenceCooldown);
      },
      choices: [
        { text: "📈 跟老板谈加薪", hint: "管理XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e454CareerConfidenceCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你有底气跟老板谈加薪了——'我有投资收入，不是非靠这份工资不可。' 心态变了，谈判的底气也足了。管理XP+5,心智+2。", "success");
        }},
        { text: "🚀 考虑创业", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e454CareerConfidenceCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 投资赚的钱给了你一条退路——'就算创业失败了，我还有投资兜底。' 这种安全感，是无价的。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var pv = Math.floor(calcPortfolioValue(st));
        return "投资赚了钱之后，你发现自己整个人都更有底气了——¥" + pv.toLocaleString() + "的投资组合，是你跟这个世界谈判的筹码。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();
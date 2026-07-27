/**
 * 域E(经济/投资) 联动增强 R529
 * 桥接：
 *   E→D  e529_invest_mentor     投资导师 → 消费 investment+relationships 数据,
 *     学习→"跟着投资大师学投资"的师徒叙事
 *   E→C  e529_invest_side_project 投资副业项目 → 消费 investment+skills 数据,
 *     副业→"用投资思维做副业"的多元收入
 *   E→G  e529_invest_retirement  投资退休计划 → 消费 investment+player 数据,
 *     未来→"现在开始规划退休"的长期规划
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR529Loaded) return;
  RANDOM_EVENTS._domainELinkageR529Loaded = true;

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
      id: "e529_invest_mentor", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "投资导师",
      story: "你遇到了一位投资经验丰富的前辈——{desc}",
      triggers: { minDay: 30, interval: 120, maxRepeats: 3, excludeFlags: ["_e529MentorCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._e529MentorCooldown);
      },
      choices: [
        { text: "🎓 拜师学艺", hint: "会计XP+5,社交XP+3,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e529MentorCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "拜师学投资");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 '投资最重要的不是技术，是心态。' 前辈的一句话，让你醍醐灌顶。会计XP+5,社交XP+3,好感+3。", "success");
        }},
        { text: "📝 请教经验", hint: "会计XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e529MentorCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 '前辈的经验，能让你少走十年弯路。' 会计XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你遇到了一位投资经验丰富的前辈——'年轻人，投资不是赌博，是认知的变现。' 你认真地听着。";
      }
    },
    {
      id: "e529_invest_side_project", phase: "corporate", _isChainEvent: false, icon: "💼",
      title: "投资副业",
      story: "你发现了一个可以用投资思维做的副业——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_e529SideProjectCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._e529SideProjectCooldown);
      },
      choices: [
        { text: "💼 开始做", hint: "管理XP+4,会计XP+3,现金+3000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e529SideProjectCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 3000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '副业不只是赚钱，更是锻炼商业思维。' 管理XP+4,会计XP+3,现金+¥3000。", "success");
        }},
        { text: "📊 先做调研", hint: "会计XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e529SideProjectCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '先调研市场，再决定怎么做。' 会计XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现了一个可以用投资思维做的副业——'低买高卖不只是股票，任何生意都是这个道理。'";
      }
    },
    {
      id: "e529_invest_retirement", phase: "corporate", _isChainEvent: false, icon: "🏖️",
      title: "退休计划",
      story: "你开始认真考虑退休后的生活——{desc}",
      triggers: { minDay: 60, interval: 180, maxRepeats: 3, excludeFlags: ["_e529RetirementCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 50000 && (st.flags && !st.flags._e529RetirementCooldown);
      },
      choices: [
        { text: "🏖️ 制定退休计划", hint: "会计XP+5,心智+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e529RetirementCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏖️ '现在开始规划退休，让钱为我工作。' 会计XP+5,心智+3,心情+2。", "success");
        }},
        { text: "💰 加速积累", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e529RetirementCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏖️ '退休还早，趁年轻多积累一些。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var pv = Math.floor(calcPortfolioValue(st));
        return "你开始认真考虑退休后的生活——'¥" + pv.toLocaleString() + "够不够退休？' 你开始认真算起了这笔账。";
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
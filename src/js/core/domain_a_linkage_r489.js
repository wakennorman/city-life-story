/**
 * 域A(数据/数值平衡) 联动增强 R489
 * 桥接：
 *   A→B  a489_economic_indicator  经济指标 → 消费 goods 数据,
 *     物价指数→"经济数据说明了什么"的叙事
 *   A→D  a489_npc_fair_price     NPC公平价 → 消费 goods 数据,
 *     合理价格→"不给熟人添麻烦"的社交定价
 *   A→C  a489_skill_roi          技能ROI → 消费 skills 数据,
 *     投入产出→"学这个技能值不值"的成本分析
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR489Loaded) return;
  RANDOM_EVENTS._domainALinkageR489Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "a489_economic_indicator", phase: "street", _isChainEvent: false, icon: "📊",
      title: "经济风向标",
      story: "你注意到最近的经济数据有些变化——{desc}",
      triggers: { minDay: 20, interval: 45, maxRepeats: 5, excludeFlags: ["_a489EconIndicatorCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a489EconIndicatorCooldown);
      },
      choices: [
        { text: "📊 研究趋势", hint: "会计XP+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a489EconIndicatorCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你研究了经济数据的变化趋势——'CPI在涨，但工资也在涨，还能接受。' 会计XP+4,心智+2。", "success");
        }},
        { text: "📰 关注新闻", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a489EconIndicatorCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你多关注了经济新闻——'了解宏观趋势，才能做好微观决策。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你注意到最近的经济数据有些变化——物价在涨，但有些东西在降价。经济就像天气，需要时刻关注。";
      }
    },
    {
      id: "a489_npc_fair_price", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "公道价",
      story: "熟人想买你的东西，问你多少钱——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_a489FairPriceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a489FairPriceCooldown);
      },
      choices: [
        { text: "🤝 给个公道价", hint: "好感+3,现金+500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a489FairPriceCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 3, "给了公道价");
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 500;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你给了个公道价——'熟人之间，不赚那么多。' 对方很开心，说以后多合作。好感+3,现金+¥500。", "success");
        }},
        { text: "📈 按市场价", hint: "现金+800", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a489FairPriceCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 800;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你按市场价收了钱——'生意就是生意。' 虽然对方没说什么，但你知道这价格合理。现金+¥800。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "熟人想买你的东西，问你多少钱——'咱们这么熟了，给个优惠价呗？' 你笑了笑，心里开始算账。";
      }
    },
    {
      id: "a489_skill_roi", phase: "corporate", _isChainEvent: false, icon: "📈",
      title: "技能投资回报",
      story: "你在算花在技能上的时间和钱，值不值——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_a489SkillROICooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a489SkillROICooldown);
      },
      choices: [
        { text: "📈 算清楚", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a489SkillROICooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你算了一笔账——'花在技能上的每一分钱，都赚回来了，还多赚了不少。' 会计XP+5,心智+2。", "success");
        }},
        { text: "📚 继续投资", hint: "随机技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a489SkillROICooldown = true;
          var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域B R572 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你决定继续投资技能——'最好的投资，就是投资自己。' 随机技能XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你在算花在技能上的时间和钱，值不值——答案是肯定的。技能是唯一不会贬值的资产。";
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
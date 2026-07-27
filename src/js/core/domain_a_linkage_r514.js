/**
 * 域A(数据/数值平衡) 联动增强 R514
 * 桥接：
 *   A→G  a514_goods_health_curve 商品健康曲线 → 消费 goods 数据,
 *     物价→"物价涨了，你的健康还好吗"的生活成本分析
 *   A→D  a514_npc_group_buy     NPC团购 → 消费 goods 数据,
 *     省钱→"跟朋友一起买更便宜"的团购社交
 *   A→E  a514_inflation_hedge   通胀对冲 → 消费 goods+investment 数据,
 *     保值→"什么能跑赢通胀"的投资品分析
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR514Loaded) return;
  RANDOM_EVENTS._domainALinkageR514Loaded = true;

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
      id: "a514_goods_health_curve", phase: "street", _isChainEvent: false, icon: "📈",
      title: "物价与健康",
      story: "你发现物价上涨后，吃得越来越差了——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_a514HealthCurveCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a514HealthCurveCooldown);
      },
      choices: [
        { text: "📈 健康优先", hint: "健康+2,花费500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a514HealthCurveCooldown = true;
          if (st.resources && st.resources.cash >= 500) { st.resources.cash -= 500; }
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '物价再涨，也不能亏待自己的身体。' 你买了好一点的食材。健康+2,花费¥500。", "success");
        }},
        { text: "💰 找便宜替代", hint: "会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a514HealthCurveCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你找到了性价比更高的替代品——'一样的营养，一半的价格。' 会计XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现物价上涨后，吃得越来越差了——'以前天天吃水果，现在看看价格就放下了。' 物价和健康，真的在绑在一起。";
      }
    },
    {
      id: "a514_npc_group_buy", phase: "street", _isChainEvent: false, icon: "🛒",
      title: "一起团购",
      story: "朋友问你要不要一起团购——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_a514GroupBuyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a514GroupBuyCooldown);
      },
      choices: [
        { text: "🛒 拼单", hint: "好感+2,省200元", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a514GroupBuyCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "一起团购");
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 200;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛒 '拼单省运费，还能打折！' 和/or朋友一起买东西，又省了钱又增进了感情。好感+2,省¥200。", "success");
        }},
        { text: "📋 组织团购", hint: "社交XP+3,省500元", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a514GroupBuyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 500;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛒 你组织了公司团购——'量大从优，大家都省了钱。' 社交XP+3,省¥500。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友问你要不要一起团购——'XX东西打折，买二送一，一起拼？' 团购，是城市生活的基本技能。";
      }
    },
    {
      id: "a514_inflation_hedge", phase: "corporate", _isChainEvent: false, icon: "🛡️",
      title: "跑赢通胀",
      story: "你发现钱放在银行里越来越不值钱了——{desc}",
      triggers: { minDay: 35, interval: 90, maxRepeats: 3, excludeFlags: ["_a514InflationHedgeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var bank = (st.resources && st.resources.bankBalance) || 0;
        return bank >= 10000 && (st.flags && !st.flags._a514InflationHedgeCooldown);
      },
      choices: [
        { text: "🛡️ 买黄金", hint: "会计XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a514InflationHedgeCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛡️ '黄金是抗通胀的硬通货。' 你买了一些黄金作为保值资产。会计XP+4,心智+1。", "success");
        }},
        { text: "📈 买指数基金", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a514InflationHedgeCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛡️ '长期来看，指数基金能跑赢通胀。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var bank = (st.resources && st.resources.bankBalance) || 0;
        return "你发现钱放在银行里越来越不值钱了——'¥" + Math.floor(bank).toLocaleString() + "存银行一年，利息还跑不赢通胀。' 得想办法让钱生钱。";
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
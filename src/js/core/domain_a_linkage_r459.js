/**
 * 域A(数据/数值平衡) 联动增强 R459（第四轮循环）
 * 桥接：
 *   A→B  a459_market_whisper      市场低语 → 消费 goods 数据,
 *     价格波动→"市场在悄悄告诉你什么"的叙事
 *   A→H  a459_corp_cost_analysis  公司成本分析 → 消费 goods 数据,
 *     原材料价格→"成本控制从了解市场开始"的经营
 *   A→D  a459_npc_bargain          NPC砍价 → 消费 goods 数据,
 *     价格谈判→"跟熟人做生意怎么谈价"的社交
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR459Loaded) return;
  RANDOM_EVENTS._domainALinkageR459Loaded = true;

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
      id: "a459_market_whisper", phase: "street", _isChainEvent: false, icon: "👂",
      title: "市场在说话",
      story: "你注意到最近市场上的商品价格有些异常——{desc}",
      triggers: { minDay: 20, interval: 45, maxRepeats: 5, excludeFlags: ["_a459MarketWhisperCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a459MarketWhisperCooldown);
      },
      choices: [
        { text: "👂 研究一下", hint: "贸易XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a459MarketWhisperCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("trade", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👂 你研究了最近的价格异常——发现每次涨价前都有征兆。市场在说话，只是需要你用心听。贸易XP+4,心智+1。", "success");
        }},
        { text: "🛒 趁机囤货", hint: "获得随机商品+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a459MarketWhisperCooldown = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("👂 你趁价格低的时候囤了一些货——'等涨价了再卖。' 这就是最朴素的生意经。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你注意到最近市场上的商品价格有些异常——有些东西在悄悄涨价，有些在降价。市场从来不会说谎，它只是在低语。";
      }
    },
    {
      id: "a459_corp_cost_analysis", phase: "corporate", _isChainEvent: false, icon: "📉",
      title: "成本压力",
      story: "采购部报告说原材料又涨价了——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 3, excludeFlags: ["_a459CorpCostCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._a459CorpCostCooldown);
      },
      choices: [
        { text: "📉 优化供应链", hint: "管理XP+5,公司资金+2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a459CorpCostCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate && st.corporate.company) st.corporate.company.funds = (st.corporate.company.funds || 0) + 2000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📉 你优化了供应链——'换个供应商，成本能降不少。' 管理XP+5,公司资金+¥2000。", "success");
        }},
        { text: "📊 调整定价策略", hint: "会计XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a459CorpCostCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📉 你调整了产品的定价策略——'成本涨了，价格也要跟着涨，但要让客户觉得值。' 会计XP+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "采购部报告说原材料又涨价了——'成本压力越来越大了。' 你揉了揉太阳穴，开始算账。";
      }
    },
    {
      id: "a459_npc_bargain", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "人情价",
      story: "你跟熟人摊主聊了聊价格——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_a459BargainCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a459BargainCooldown);
      },
      choices: [
        { text: "🤝 砍个价", hint: "省300元,好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a459BargainCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 300;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 1, "砍价成功");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '老板，便宜点呗？'——熟人之间好说话，省了300块。省到就是赚到。好感+1,省¥300。", "success");
        }},
        { text: "😊 不砍价", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a459BargainCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "爽快付钱");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你没砍价，爽快地付了钱——'下次再来啊！' 摊主笑着说。好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你跟熟人摊主聊了聊价格——'这个进价都涨了，我真的没赚你多少。' 你笑了笑，心里有数。";
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
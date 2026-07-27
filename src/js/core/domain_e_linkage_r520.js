/**
 * 域E(经济/投资) 联动增强 R520
 * 桥接：
 *   E→F  e520_invest_platform_ui 投资平台UI → 消费 investment 数据,
 *     平台→"你的投资平台体验"的UI反馈
 *   E→D  e520_invest_community  投资社区 → 消费 investment+relationships 数据,
 *     社群→"和一群懂投资的人在一起"的社区叙事
 *   E→B  e520_economic_outlook  经济展望 → 消费 investment 数据,
 *     预测→"经济学家说未来会怎样"的展望叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR520Loaded) return;
  RANDOM_EVENTS._domainELinkageR520Loaded = true;

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
      id: "e520_invest_platform_ui", phase: "corporate", _isChainEvent: false, icon: "📱",
      title: "投资平台",
      story: "你打开投资APP，发现界面更新了——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_e520PlatformUICooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._e520PlatformUICooldown);
      },
      choices: [
        { text: "📱 体验新功能", hint: "会计XP+3,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e520PlatformUICooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 '新界面更好用了，数据分析功能也更强大。' 会计XP+3,心智+1。", "success");
        }},
        { text: "📊 看新功能教程", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e520PlatformUICooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 你花时间学习了新功能——'工欲善其事，必先利其器。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你打开投资APP，发现界面更新了——'新功能看起来不错，试试看。' 好的工具，让投资事半功倍。";
      }
    },
    {
      id: "e520_invest_community", phase: "street", _isChainEvent: false, icon: "👥",
      title: "投资圈子",
      story: "你加入了一个投资交流群——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_e520CommunityCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var pv = calcPortfolioValue(st);
        return pv >= 10000 && (st.flags && !st.flags._e520CommunityCooldown);
      },
      choices: [
        { text: "👥 交流分享", hint: "社交XP+5,会计XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e520CommunityCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "投资交流");
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 '群里的人都很厉害，学到了很多。' 社交XP+5,会计XP+3,好感+2。", "success");
        }},
        { text: "👀 潜水学习", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e520CommunityCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 '先看别人怎么说，再自己判断。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你加入了一个投资交流群——'欢迎新人！' 群里的人热情地打招呼。你发现，这里的人都在认真研究投资。";
      }
    },
    {
      id: "e520_economic_outlook", phase: "street", _isChainEvent: false, icon: "🔮",
      title: "经济展望",
      story: "你看到了一份经济展望报告——{desc}",
      triggers: { minDay: 35, interval: 120, maxRepeats: 3, excludeFlags: ["_e520OutlookCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._e520OutlookCooldown);
      },
      choices: [
        { text: "🔮 调整投资策略", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e520OutlookCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔮 '经济展望说未来可能加息，得调整投资组合了。' 会计XP+5,心智+2。", "success");
        }},
        { text: "📝 保持关注", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e520OutlookCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔮 '预测只是预测，但值得关注。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你看到了一份经济展望报告——'经济学家预测明年GDP增长XX%，通胀率XX%...' 这些数字，关系到你的钱包。";
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
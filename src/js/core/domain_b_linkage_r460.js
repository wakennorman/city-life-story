/**
 * 域B(事件/叙事) 联动增强 R460（第四轮循环）
 * 桥接：
 *   B→A  b460_event_market_shift   事件市场转向 → 消费 flags 数据,
 *     突发事件→"市场风向变了"的经济数据叙事
 *   B→H  b460_event_team_spirit    事件团队精神 → 消费 flags+corporate 数据,
 *     共同经历→"一起扛过事"的团队凝聚力
 *   B→E  b460_event_invest_alert   事件投资预警 → 消费 flags+investment 数据,
 *     风险事件→"是时候调整投资了"的财务提醒
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR460Loaded) return;
  RANDOM_EVENTS._domainBLinkageR460Loaded = true;

  var EVENTS = [
    {
      id: "b460_event_market_shift", phase: "street", _isChainEvent: false, icon: "🔄",
      title: "风向变了",
      story: "最近发生的一些事，让市场行情发生了变化——{desc}",
      triggers: { minDay: 35, interval: 60, maxRepeats: 5, excludeFlags: ["_b460MarketShiftCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b460MarketShiftCooldown);
      },
      choices: [
        { text: "🔄 调整策略", hint: "贸易XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b460MarketShiftCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("trade", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 你根据市场变化调整了策略——'风向变了，帆也要跟着转。' 贸易XP+4,心智+1。", "success");
        }},
        { text: "👀 观望", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b460MarketShiftCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 你决定先观望——'看不清的时候，不动就是最好的策略。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "最近发生的一些事，让市场行情发生了变化——有人看到了危机，有人看到了机会。";
      }
    },
    {
      id: "b460_event_team_spirit", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "同舟共济",
      story: "公司遇到了一些困难，但团队选择了共同面对——{desc}",
      triggers: { minDay: 50, interval: 120, maxRepeats: 3, excludeFlags: ["_b460TeamSpiritCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.team) return false;
        return (st.flags && !st.flags._b460TeamSpiritCooldown);
      },
      choices: [
        { text: "🤝 感谢团队", hint: "管理XP+5,团队忠诚+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b460TeamSpiritCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 2); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你召集全员开了个会——'谢谢大家在这个时候选择留下来。' 团队凝聚力更强了。管理XP+5,团队忠诚+2。", "success");
        }},
        { text: "💪 带头冲锋", hint: "管理XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b460TeamSpiritCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你带头冲在最前面——'跟我上'比'给我上'更有力量。管理XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司遇到了一些困难，但团队选择了共同面对——'老板，我们相信你。' 这句话让你鼻子一酸。";
      }
    },
    {
      id: "b460_event_invest_alert", phase: "corporate", _isChainEvent: false, icon: "⚠️",
      title: "风险警示",
      story: "新闻里报道了一起金融风险事件——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_b460InvestAlertCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b460InvestAlertCooldown);
      },
      choices: [
        { text: "⚠️ 检查自己的投资", hint: "会计XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b460InvestAlertCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ 看到新闻后你检查了自己的投资组合——还好，风险可控。'别人的教训，是最好的学习。' 会计XP+4,心智+1。", "success");
        }},
        { text: "📉 减仓避险", hint: "会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b460InvestAlertCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ 你决定减仓避险——'宁可少赚，不能大亏。' 投资的第一要义是保住本金。会计XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "新闻里报道了一起金融风险事件——'XX公司暴雷，投资者损失惨重。' 你看了看自己的投资，心里一紧。";
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
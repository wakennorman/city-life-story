/**
 * 域E(经济/投资) 联动增强 R475（第二十五轮循环·续）
 * 桥接：
 *   E→F  e475_invest_daily_pnl      每日损益UI → 消费 investment 数据,
 *     每日盈亏→"今天赚了还是亏了"的UI展示
 *   E→E  e475_invest_milestone      投资里程碑 → 消费 investment 数据,
 *     累计收益→"你的投资生涯"的自叙事
 *   e475_property_story(E→B 房产故事): property→"那套房子"的叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR475Loaded) return;
  RANDOM_EVENTS._domainELinkageR475Loaded = true;

  var EVENTS = [
    {
      id: "e475_invest_daily_pnl", phase: "street", _isChainEvent: false, icon: "📊",
      title: "今日盈亏",
      story: "你查看了今天的投资损益——{desc}",
      triggers: { minDay: 40, interval: 50, maxRepeats: 5, excludeFlags: ["_e475PnlCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return (st.flags && !st.flags._e475PnlCooldown);
      },
      choices: [
        { text: "📈 记录盈亏", hint: "会计XP+2,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e475PnlCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你记录了今日盈亏——'每天进步一点点。' 会计XP+2,心智+2。", "success");
        }},
        { text: "🧘 不看也罢", hint: "心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e475PnlCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 你决定不看——'眼不见心不烦。' 心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var pnl = st.investment && st.investment._dailyPnL ? st.investment._dailyPnL : 0;
        if (pnl > 0) return "今天投资赚了¥" + Math.round(pnl) + "——看着数字上涨，心情也跟着好起来。";
        if (pnl < 0) return "今天投资亏了¥" + Math.round(Math.abs(pnl)) + "——市场有涨有跌，很正常。";
        return "今天投资持平——不赚不亏，也是种幸运。";
      }
    },
    {
      id: "e475_invest_milestone", phase: "street", _isChainEvent: false, icon: "🏆",
      title: "投资里程碑",
      story: "你回顾了自己的投资生涯——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 3, excludeFlags: ["_e475MilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var profit = st.investment._totalInvestmentProfit || 0;
        return (profit >= 10000 || profit <= -5000) && (st.flags && !st.flags._e475MilestoneCooldown);
      },
      choices: [
        { text: "📖 总结经验", hint: "智力+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e475MilestoneCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你总结了投资经验——'每一次里程碑都是新的起点。' 智力+3,心智+2。", "success");
        }},
        { text: "🎯 设定新目标", hint: "管理XP+3,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e475MilestoneCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你设定了投资新目标——'投资是一场马拉松。' 管理XP+3,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var profit = st.investment && st.investment._totalInvestmentProfit ? st.investment._totalInvestmentProfit : 0;
        if (profit > 0) return "你的投资累计盈利¥" + profit.toLocaleString() + "——从第一笔投资到现在，你已经走过了很长的路。";
        return "你的投资累计亏损¥" + Math.abs(profit).toLocaleString() + "——投资有输有亏，重要的是学到了什么。";
      }
    },
    {
      id: "e475_property_story", phase: "street", _isChainEvent: false, icon: "🏠",
      title: "那套房子",
      story: "你回顾了自己买过的房子——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 2, excludeFlags: ["_e475PropStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.investment.properties) return false;
        return st.investment.properties.length >= 1 && (st.flags && !st.flags._e475PropStoryCooldown);
      },
      choices: [
        { text: "📖 写下购房故事", hint: "心智+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e475PropStoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你写下了购房故事——'每套房子都有一段回忆。' 心智+4,心情+3。", "success");
        }},
        { text: "📈 关注涨跌", hint: "智力+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e475PropStoryCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你关注了房价涨跌——'房子首先是资产。' 智力+2,会计XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = st.investment && st.investment.properties ? st.investment.properties.length : 0;
        return "你回顾了自己买过的" + n + "套房子——每套都有故事，每套都是人生的一个章节。";
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

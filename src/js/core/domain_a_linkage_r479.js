/**
 * 域A(数据/数值平衡) 联动增强 R479
 * 桥接：
 *   A→C  a479_job_market_trend    就业市场趋势 → 消费 jobs 数据,
 *     行业数据→"哪些工作在涨价"的职业市场洞察
 *   A→G  a479_price_health_impact  价格健康影响 → 消费 goods 数据,
 *     物价→"吃不起水果的健康代价"的生活成本叙事
 *   A→F  a479_data_visual_tip     数据可视化提示 → 消费 goods+trade 数据,
 *     数据→"一张图看懂市场"的UI提示
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR479Loaded) return;
  RANDOM_EVENTS._domainALinkageR479Loaded = true;

  var EVENTS = [
    {
      id: "a479_job_market_trend", phase: "street", _isChainEvent: false, icon: "💼",
      title: "行情报价",
      story: "你看到一份行业薪资报告——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_a479JobMarketCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a479JobMarketCooldown);
      },
      choices: [
        { text: "💼 评估自身价值", hint: "心智+2,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a479JobMarketCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 你对照薪资报告评估了自己的市场价值——'原来我值这个价。' 心智+2,管理XP+3。", "success");
        }},
        { text: "📈 关注热门行业", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a479JobMarketCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 你关注了薪资涨幅最快的行业——'选对赛道，比努力更重要。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你看到一份行业薪资报告——有些岗位薪资涨得飞快，有些却在下降。市场在告诉你该往哪走。";
      }
    },
    {
      id: "a479_price_health_impact", phase: "street", _isChainEvent: false, icon: "🍎",
      title: "水果自由",
      story: "你发现水果价格涨得越来越离谱了——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_a479PriceHealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a479PriceHealthCooldown);
      },
      choices: [
        { text: "🍎 贵也要买", hint: "健康+1,花费200", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a479PriceHealthCooldown = true;
          if (st.resources && st.resources.cash >= 200) {
            st.resources.cash -= 200;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍎 你咬咬牙买了些水果——'贵是贵了点，但健康更重要。' 健康+1,花费¥200。", "success");
        }},
        { text: "💊 吃维生素片", hint: "健康+1,花费100", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a479PriceHealthCooldown = true;
          if (st.resources && st.resources.cash >= 100) {
            st.resources.cash -= 100;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍎 你买了瓶维生素片——'吃不起水果，至少得补充维生素。' 健康+1,花费¥100。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现水果价格涨得越来越离谱了——'苹果都要10块钱一斤了？' 物价上涨，最先感受到的是你的胃。";
      }
    },
    {
      id: "a479_data_visual_tip", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据可视化",
      story: "你试着把最近的市场数据做成图表——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_a479DataVisualCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a479DataVisualCooldown);
      },
      choices: [
        { text: "📊 分析图表", hint: "会计XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a479DataVisualCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你把数据做成图表后，趋势一目了然——'一张图胜过千言万语。' 会计XP+4,心智+1。", "success");
        }},
        { text: "📝 记录发现", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a479DataVisualCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你把分析发现记了下来——'这些规律，以后用得上。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你试着把最近的市场数据做成图表——数字变成图形之后，很多隐藏的规律就显现出来了。";
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
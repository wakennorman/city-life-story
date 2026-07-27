/**
 * 域A(数据/数值平衡) 联动增强 R505
 * 桥接：
 *   A→H  a505_corp_pricing_strategy 公司定价策略 → 消费 goods 数据,
 *     定价→"怎么定价才能利润最大化"的经营分析
 *   A→C  a505_skill_demand_forecast 技能需求预测 → 消费 jobs 数据,
 *     市场→"未来什么技能最吃香"的职业预测
 *   A→B  a505_market_cycle_story  市场周期故事 → 消费 goods 数据,
 *     周期→"市场总是在涨涨跌跌"的周期叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR505Loaded) return;
  RANDOM_EVENTS._domainALinkageR505Loaded = true;

  var EVENTS = [
    {
      id: "a505_corp_pricing_strategy", phase: "corporate", _isChainEvent: false, icon: "🏷️",
      title: "定价策略",
      story: "你研究了一下市场上的定价策略——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_a505PricingStrategyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._a505PricingStrategyCooldown);
      },
      choices: [
        { text: "🏷️ 优化定价", hint: "会计XP+5,管理XP+3,公司资金+3000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a505PricingStrategyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.corporate && st.corporate.company) st.corporate.company.funds = (st.corporate.company.funds || 0) + 3000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏷️ 你优化了产品定价——'价格提高10%，利润反而增加了。' 会计XP+5,管理XP+3,公司资金+¥3000。", "success");
        }},
        { text: "📊 A/B测试", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a505PricingStrategyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏷️ 你决定做A/B测试——'先试试不同价格的效果，再决定。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你研究了一下市场上的定价策略——'定价定生死。' 价格定高了没人买，定低了赚不到钱。";
      }
    },
    {
      id: "a505_skill_demand_forecast", phase: "street", _isChainEvent: false, icon: "🔮",
      title: "未来技能",
      story: "你看到一份未来技能需求报告——{desc}",
      triggers: { minDay: 25, interval: 90, maxRepeats: 3, excludeFlags: ["_a505SkillDemandCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a505SkillDemandCooldown);
      },
      choices: [
        { text: "🔮 提前学习", hint: "编程XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a505SkillDemandCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("coding", 5); } catch(e) {} } // [全系统自洽修复] 域C R517: addSkillXp("technology")非真实技能键(XP静默丢弃)→映射coding(技术=编程)
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔮 '未来AI相关的技能需求会暴涨，现在学还来得及。' 编程XP+5,心智+2。", "success");
        }},
        { text: "📈 关注趋势", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a505SkillDemandCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔮 你开始关注行业趋势——'了解未来的方向，才能走在前面。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你看到一份未来技能需求报告——'未来五年，XX技能需求将增长300%。' 你看了看自己的技能树，开始思考。";
      }
    },
    {
      id: "a505_market_cycle_story", phase: "street", _isChainEvent: false, icon: "🎢",
      title: "市场就像过山车",
      story: "你发现市场总是周期性地涨跌——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_a505MarketCycleCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a505MarketCycleCooldown);
      },
      choices: [
        { text: "🎢 顺势而为", hint: "销售XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a505MarketCycleCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 4); } catch(e) {} } // [全系统自洽修复] 域C R517: addSkillXp("trade")非真实技能键(XP静默丢弃)→映射sales(市场买卖=销售)
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎢 '市场就像过山车，有起有落。关键是在低谷时买入，在高点时卖出。' 销售XP+4,心智+1。", "success");
        }},
        { text: "📊 研究规律", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a505MarketCycleCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎢 你研究了市场周期的规律——'历史不会重演，但会押韵。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现市场总是周期性地涨跌——'涨多了会跌，跌多了会涨。' 这个简单的道理，很多人一辈子都学不会。";
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
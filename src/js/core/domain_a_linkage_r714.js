/**
 * 域A(数据/数值平衡) 联动增强 R714
 * 桥接：
 *   A→B  a714_price_narrative_v4 价格叙事v4 → 消费 pricing 全量因子,
 *     将隐形定价引擎显性化为"市场低语"
 *   A→G  a714_economic_health_v4 经济健康度v4 → 消费 经济数据+needs,
 *     经济波动影响身心健康
 *   A→C  a714_skill_market_v3 技能市场v3 → 消费 skills+payCalc,
 *     技能市场价值变化触发职业洞察
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR714Loaded) return;
  RANDOM_EVENTS._domainALinkageR714Loaded = true;

  var EVENTS = [
    {
      id: "a714_price_narrative_v4", phase: "street", _isChainEvent: false, icon: "📉",
      title: "市场低语",
      story: "菜市场里的价格波动,藏着看不见的手——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 3, excludeFlags: ["_a714PriceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a714PriceCd) return false;
        return st.player && st.player.day >= 80 && st.trade;
      },
      choices: [
        {
          text: "📊 分析价格趋势", hint: "智力+5,会计XP+4,置_a714Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a714PriceCd = true;
            st.flags._a714Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '价格背后,是供需的博弈。' 智力+5,会计XP+4。", "success");
            }
          }
        },
        {
          text: "🤝 和摊主聊天", hint: "社交XP+6,置_a714Chatter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a714PriceCd = true;
            st.flags._a714Chatter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '聊天,是最好的情报收集。' 社交XP+6。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "菜市场的价格每天都在变——'这些波动,藏着什么规律?'";
      }
    },
    {
      id: "a714_economic_health_v4", phase: "street", _isChainEvent: false, icon: "💚",
      title: "经济健康度",
      story: "你的经济状况正在影响健康——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 4, excludeFlags: ["_a714HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a714HealthCd) return false;
        return st.player && st.player.day >= 60 && st.resources && st.needs && st.status;
      },
      choices: [
        {
          text: "💰 理财规划", hint: "心智+5,智力+3,置_a714Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a714HealthCd = true;
            st.flags._a714Planner = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '理财,就是理生活。' 心智+5,智力+3。", "success");
            }
          }
        },
        {
          text: "🏃 运动减压", hint: "健康+4,疲劳-6,置_a714Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a714HealthCd = true;
            st.flags._a714Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 4);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '运动,是最好的减压方式。' 健康+4,疲劳-6。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var cash = st.resources && st.resources.cash ? Math.round(st.resources.cash) : 0;
        return "现金¥" + cash.toLocaleString() + "——'经济健康,是身心健康的基础。'";
      }
    },
    {
      id: "a714_skill_market_v3", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "技能市场洞察",
      story: "你的技能在市场上越来越有价值——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_a714SkillCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a714SkillCd) return false;
        if (!st.skills) return false;
        var topLv = 0;
        for (var k in st.skills) {
          if (st.skills[k] && typeof st.skills[k].level === "number" && st.skills[k].level > topLv) {
            topLv = st.skills[k].level;
          }
        }
        return topLv >= 30 && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "📈 评估技能价值", hint: "智力+5,置_a714SkillEvaluator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a714SkillCd = true;
            st.flags._a714SkillEvaluator = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '技能的价值,由市场决定。' 智力+5。", "success");
            }
          }
        },
        {
          text: "💼 技能变现", hint: "管理XP+6,置_a714SkillMonetizer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a714SkillCd = true;
            st.flags._a714SkillMonetizer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '让技能变成收入。' 管理XP+6。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var topSkill = "";
        var topLv = 0;
        if (st.skills) {
          for (var k in st.skills) {
            if (st.skills[k] && typeof st.skills[k].level === "number" && st.skills[k].level > topLv) {
              topLv = st.skills[k].level;
              topSkill = k;
            }
          }
        }
        var skillName = topSkill;
        if (typeof getSkillChineseName === "function") skillName = getSkillChineseName(topSkill) || topSkill;
        return "你的" + skillName + "已达Lv." + topLv + "——'这个技能,在市场上值多少钱?'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

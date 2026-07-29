/**
 * 域A(数据/数值平衡) 联动增强 R774 (第十轮循环)
 * 桥接：
 *   A→B  a774_market_whisper_v11 市场低语v11 → 消费 pricing 全量因子
 *   A→G  a774_economic_wellbeing_v8 经济幸福感v8 → 消费 经济数据+needs
 *   A→C  a774_skill_premium_v8 技能溢价v8 → 消费 skills+payCalc
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR774Loaded) return;
  RANDOM_EVENTS._domainALinkageR774Loaded = true;

  var EVENTS = [
    {
      id: "a774_market_whisper_v11", phase: "street", _isChainEvent: false, icon: "📉",
      title: "市场低语",
      story: "菜市场里的价格波动,藏着看不见的手——{desc}",
      triggers: { minDay: 1000, interval: 1100, maxRepeats: 3, excludeFlags: ["_a774PriceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a774PriceCd) return false;
        return st.player && st.player.day >= 1000 && st.trade;
      },
      choices: [
        {
          text: "📊 分析价格趋势", hint: "智力+20,会计XP+18,置_a774Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a774PriceCd = true;
            st.flags._a774Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '价格背后,是供需的博弈。' 智力+20,会计XP+18。", "success");
            }
          }
        },
        {
          text: "🤝 和摊主聊天", hint: "社交XP+20,置_a774Chatter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a774PriceCd = true;
            st.flags._a774Chatter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '聊天,是最好的情报收集。' 社交XP+20。", "info");
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
      id: "a774_economic_wellbeing_v8", phase: "street", _isChainEvent: false, icon: "💚",
      title: "经济幸福感",
      story: "你的经济状况正在影响幸福感——{desc}",
      triggers: { minDay: 900, interval: 1000, maxRepeats: 4, excludeFlags: ["_a774WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a774WellbeingCd) return false;
        return st.player && st.player.day >= 900 && st.resources && st.needs && st.status;
      },
      choices: [
        {
          text: "💰 理财规划", hint: "心智+20,智力+18,置_a774Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a774WellbeingCd = true;
            st.flags._a774Planner = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '理财,就是理生活。' 心智+20,智力+18。", "success");
            }
          }
        },
        {
          text: "🏃 运动减压", hint: "健康+18,疲劳-20,置_a774Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a774WellbeingCd = true;
            st.flags._a774Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 18);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '运动,是最好的减压方式。' 健康+18,疲劳-20。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var cash = st.resources && st.resources.cash ? Math.round(st.resources.cash) : 0;
        return "现金¥" + cash.toLocaleString() + "——'经济健康,是幸福的基础。'";
      }
    },
    {
      id: "a774_skill_premium_v8", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "技能溢价",
      story: "高技能正在带来高回报——{desc}",
      triggers: { minDay: 1100, interval: 1200, maxRepeats: 3, excludeFlags: ["_a774SkillCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a774SkillCd) return false;
        if (!st.skills) return false;
        var topLv = 0;
        for (var k in st.skills) {
          if (st.skills[k] && typeof st.skills[k].level === "number" && st.skills[k].level > topLv) {
            topLv = st.skills[k].level;
          }
        }
        return topLv >= 100 && st.player && st.player.day >= 1100;
      },
      choices: [
        {
          text: "📈 评估技能价值", hint: "智力+20,置_a774SkillEvaluator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a774SkillCd = true;
            st.flags._a774SkillEvaluator = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '技能的价值,由市场决定。' 智力+20。", "success");
            }
          }
        },
        {
          text: "💼 技能变现", hint: "管理XP+20,置_a774SkillMonetizer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a774SkillCd = true;
            st.flags._a774SkillMonetizer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '让技能变成收入。' 管理XP+20。", "info");
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

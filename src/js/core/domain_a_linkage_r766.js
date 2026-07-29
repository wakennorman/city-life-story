/**
 * 域A(数据/数值平衡) 联动增强 R766 (第九轮循环)
 * 桥接：
 *   A→B  a766_market_whisper_v10 市场低语v10 → 消费 pricing 全量因子
 *   A→G  a766_economic_wellbeing_v7 经济幸福感v7 → 消费 经济数据+needs
 *   A→C  a766_skill_premium_v7 技能溢价v7 → 消费 skills+payCalc
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR766Loaded) return;
  RANDOM_EVENTS._domainALinkageR766Loaded = true;

  var EVENTS = [
    {
      id: "a766_market_whisper_v10", phase: "street", _isChainEvent: false, icon: "📉",
      title: "市场低语",
      story: "菜市场里的价格波动,藏着看不见的手——{desc}",
      triggers: { minDay: 800, interval: 900, maxRepeats: 3, excludeFlags: ["_a766PriceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a766PriceCd) return false;
        return st.player && st.player.day >= 800 && st.trade;
      },
      choices: [
        {
          text: "📊 分析价格趋势", hint: "智力+18,会计XP+15,置_a766Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a766PriceCd = true;
            st.flags._a766Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '价格背后,是供需的博弈。' 智力+18,会计XP+15。", "success");
            }
          }
        },
        {
          text: "🤝 和摊主聊天", hint: "社交XP+18,置_a766Chatter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a766PriceCd = true;
            st.flags._a766Chatter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '聊天,是最好的情报收集。' 社交XP+18。", "info");
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
      id: "a766_economic_wellbeing_v7", phase: "street", _isChainEvent: false, icon: "💚",
      title: "经济幸福感",
      story: "你的经济状况正在影响幸福感——{desc}",
      triggers: { minDay: 600, interval: 700, maxRepeats: 4, excludeFlags: ["_a766WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a766WellbeingCd) return false;
        return st.player && st.player.day >= 600 && st.resources && st.needs && st.status;
      },
      choices: [
        {
          text: "💰 理财规划", hint: "心智+18,智力+15,置_a766Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a766WellbeingCd = true;
            st.flags._a766Planner = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '理财,就是理生活。' 心智+18,智力+15。", "success");
            }
          }
        },
        {
          text: "🏃 运动减压", hint: "健康+15,疲劳-18,置_a766Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a766WellbeingCd = true;
            st.flags._a766Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 15);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '运动,是最好的减压方式。' 健康+15,疲劳-18。", "info");
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
      id: "a766_skill_premium_v7", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "技能溢价",
      story: "高技能正在带来高回报——{desc}",
      triggers: { minDay: 900, interval: 1000, maxRepeats: 3, excludeFlags: ["_a766SkillCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a766SkillCd) return false;
        if (!st.skills) return false;
        var topLv = 0;
        for (var k in st.skills) {
          if (st.skills[k] && typeof st.skills[k].level === "number" && st.skills[k].level > topLv) {
            topLv = st.skills[k].level;
          }
        }
        return topLv >= 100 && st.player && st.player.day >= 900;
      },
      choices: [
        {
          text: "📈 评估技能价值", hint: "智力+18,置_a766SkillEvaluator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a766SkillCd = true;
            st.flags._a766SkillEvaluator = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '技能的价值,由市场决定。' 智力+18。", "success");
            }
          }
        },
        {
          text: "💼 技能变现", hint: "管理XP+18,置_a766SkillMonetizer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a766SkillCd = true;
            st.flags._a766SkillMonetizer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '让技能变成收入。' 管理XP+18。", "info");
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

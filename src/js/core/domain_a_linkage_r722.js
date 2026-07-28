/**
 * 域A(数据/数值平衡) 联动增强 R722 (第三轮循环)
 * 桥接：
 *   A→B  a722_market_whisper_v5 市场低语v5 → 消费 pricing 全量因子
 *   A→G  a722_economic_wellbeing_v2 经济幸福感v2 → 消费 经济数据+needs
 *   A→C  a722_skill_premium_v2 技能溢价v2 → 消费 skills+payCalc
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR722Loaded) return;
  RANDOM_EVENTS._domainALinkageR722Loaded = true;

  var EVENTS = [
    {
      id: "a722_market_whisper_v5", phase: "street", _isChainEvent: false, icon: "📉",
      title: "市场低语",
      story: "菜市场里的价格波动,藏着看不见的手——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_a722PriceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a722PriceCd) return false;
        return st.player && st.player.day >= 100 && st.trade;
      },
      choices: [
        {
          text: "📊 分析价格趋势", hint: "智力+6,会计XP+5,置_a722Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a722PriceCd = true;
            st.flags._a722Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '价格背后,是供需的博弈。' 智力+6,会计XP+5。", "success");
            }
          }
        },
        {
          text: "🤝 和摊主聊天", hint: "社交XP+7,置_a722Chatter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a722PriceCd = true;
            st.flags._a722Chatter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 7); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '聊天,是最好的情报收集。' 社交XP+7。", "info");
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
      id: "a722_economic_wellbeing_v2", phase: "street", _isChainEvent: false, icon: "💚",
      title: "经济幸福感",
      story: "你的经济状况正在影响幸福感——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 4, excludeFlags: ["_a722WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a722WellbeingCd) return false;
        return st.player && st.player.day >= 80 && st.resources && st.needs && st.status;
      },
      choices: [
        {
          text: "💰 理财规划", hint: "心智+6,智力+4,置_a722Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a722WellbeingCd = true;
            st.flags._a722Planner = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '理财,就是理生活。' 心智+6,智力+4。", "success");
            }
          }
        },
        {
          text: "🏃 运动减压", hint: "健康+5,疲劳-7,置_a722Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a722WellbeingCd = true;
            st.flags._a722Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 7);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '运动,是最好的减压方式。' 健康+5,疲劳-7。", "info");
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
      id: "a722_skill_premium_v2", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "技能溢价",
      story: "高技能正在带来高回报——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 3, excludeFlags: ["_a722SkillCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a722SkillCd) return false;
        if (!st.skills) return false;
        var topLv = 0;
        for (var k in st.skills) {
          if (st.skills[k] && typeof st.skills[k].level === "number" && st.skills[k].level > topLv) {
            topLv = st.skills[k].level;
          }
        }
        return topLv >= 50 && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "📈 评估技能价值", hint: "智力+6,置_a722SkillEvaluator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a722SkillCd = true;
            st.flags._a722SkillEvaluator = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '技能的价值,由市场决定。' 智力+6。", "success");
            }
          }
        },
        {
          text: "💼 技能变现", hint: "管理XP+7,置_a722SkillMonetizer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a722SkillCd = true;
            st.flags._a722SkillMonetizer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 7); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '让技能变成收入。' 管理XP+7。", "info");
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

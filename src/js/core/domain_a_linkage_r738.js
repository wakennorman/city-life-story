/**
 * 域A(数据/数值平衡) 联动增强 R738 (第五轮循环)
 * 桥接：
 *   A→B  a738_market_whisper_v7 市场低语v7 → 消费 pricing 全量因子
 *   A→G  a738_economic_wellbeing_v4 经济幸福感v4 → 消费 经济数据+needs
 *   A→C  a738_skill_premium_v4 技能溢价v4 → 消费 skills+payCalc
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR738Loaded) return;
  RANDOM_EVENTS._domainALinkageR738Loaded = true;

  var EVENTS = [
    {
      id: "a738_market_whisper_v7", phase: "street", _isChainEvent: false, icon: "📉",
      title: "市场低语",
      story: "菜市场里的价格波动,藏着看不见的手——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 3, excludeFlags: ["_a738PriceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a738PriceCd) return false;
        return st.player && st.player.day >= 200 && st.trade;
      },
      choices: [
        {
          text: "📊 分析价格趋势", hint: "智力+8,会计XP+7,置_a738Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a738PriceCd = true;
            st.flags._a738Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 7); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '价格背后,是供需的博弈。' 智力+8,会计XP+7。", "success");
            }
          }
        },
        {
          text: "🤝 和摊主聊天", hint: "社交XP+9,置_a738Chatter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a738PriceCd = true;
            st.flags._a738Chatter = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 9); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '聊天,是最好的情报收集。' 社交XP+9。", "info");
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
      id: "a738_economic_wellbeing_v4", phase: "street", _isChainEvent: false, icon: "💚",
      title: "经济幸福感",
      story: "你的经济状况正在影响幸福感——{desc}",
      triggers: { minDay: 180, interval: 240, maxRepeats: 4, excludeFlags: ["_a738WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a738WellbeingCd) return false;
        return st.player && st.player.day >= 180 && st.resources && st.needs && st.status;
      },
      choices: [
        {
          text: "💰 理财规划", hint: "心智+8,智力+6,置_a738Planner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a738WellbeingCd = true;
            st.flags._a738Planner = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '理财,就是理生活。' 心智+8,智力+6。", "success");
            }
          }
        },
        {
          text: "🏃 运动减压", hint: "健康+7,疲劳-9,置_a738Exerciser",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a738WellbeingCd = true;
            st.flags._a738Exerciser = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 7);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 9);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '运动,是最好的减压方式。' 健康+7,疲劳-9。", "info");
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
      id: "a738_skill_premium_v4", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "技能溢价",
      story: "高技能正在带来高回报——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 3, excludeFlags: ["_a738SkillCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a738SkillCd) return false;
        if (!st.skills) return false;
        var topLv = 0;
        for (var k in st.skills) {
          if (st.skills[k] && typeof st.skills[k].level === "number" && st.skills[k].level > topLv) {
            topLv = st.skills[k].level;
          }
        }
        return topLv >= 80 && st.player && st.player.day >= 250;
      },
      choices: [
        {
          text: "📈 评估技能价值", hint: "智力+8,置_a738SkillEvaluator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a738SkillCd = true;
            st.flags._a738SkillEvaluator = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '技能的价值,由市场决定。' 智力+8。", "success");
            }
          }
        },
        {
          text: "💼 技能变现", hint: "管理XP+9,置_a738SkillMonetizer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a738SkillCd = true;
            st.flags._a738SkillMonetizer = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 9); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '让技能变成收入。' 管理XP+9。", "info");
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

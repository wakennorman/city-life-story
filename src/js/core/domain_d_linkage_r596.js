/**
 * 域D(NPC/社交) 联动增强 R596
 * 桥接：
 *   D→G  d596_social_health_network  社交健康网络 → 消费 relationships+needs 数据,
 *     社交→"朋友让你更健康"的生命回响
 *   D→C  d596_social_career_mentor    社交职业导师 → 消费 relationships+skills 数据,
 *     社交→"朋友帮你成长"的职业回响
 *   D→E  d596_social_investment_network 社交投资网络 → 消费 relationships+resources 数据,
 *     社交→"朋友带来投资机会"的经济回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR596Loaded) return;
  RANDOM_EVENTS._domainDLinkageR596Loaded = true;

  var EVENTS = [
    {
      id: "d596_social_health_network", phase: "street", _isChainEvent: false, icon: "💪",
      title: "朋友让你更健康",
      story: "朋友们的鼓励让你更有动力保持健康——{desc}",
      triggers: { minDay: 40, interval: 100, maxRepeats: 3, excludeFlags: ["_d596HealthNetCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d596HealthNetCooldown) return false;
        var metCount = 0;
        if (st.relationships) {
          for (var k in st.relationships) {
            if (st.relationships[k] && st.relationships[k].met && st.relationships[k].affinity >= 30) metCount++;
          }
        }
        return metCount >= 2;
      },
      choices: [
        { text: "🏃 和朋友一起运动", hint: "健康+3,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d596HealthNetCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '和朋友一起运动，更有动力了！' 健康+3,心情+5。", "success");
        }},
        { text: "🍳 一起做饭", hint: "烹饪XP+3,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d596HealthNetCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("cooking", 3); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '一起做饭，既健康又快乐！' 烹饪XP+3,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友们的鼓励让你更有动力保持健康——'有朋友陪伴，运动不再孤单。' 你开始思考如何让社交促进健康。";
      }
    },
    {
      id: "d596_social_career_mentor", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "朋友帮你成长",
      story: "一位朋友在职业上给了你很好的建议——{desc}",
      triggers: { minDay: 50, interval: 120, maxRepeats: 3, excludeFlags: ["_d596CareerMentorCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d596CareerMentorCooldown) return false;
        var hasFriend = false;
        if (st.relationships) {
          for (var k in st.relationships) {
            if (st.relationships[k] && st.relationships[k].met && st.relationships[k].affinity >= 50) { hasFriend = true; break; }
          }
        }
        return hasFriend;
      },
      choices: [
        { text: "📖 认真记录", hint: "管理XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d596CareerMentorCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 '好记性不如烂笔头。' 你把建议记录下来。管理XP+5。", "success");
        }},
        { text: "🤝 感谢朋友", hint: "社交XP+3,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d596CareerMentorCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 '谢谢你的建议！' 社交XP+3,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一位朋友在职业上给了你很好的建议——'听君一席话，胜读十年书。' 你开始思考如何把建议转化为行动。";
      }
    },
    {
      id: "d596_social_investment_network", phase: "street", _isChainEvent: false, icon: "💰",
      title: "朋友带来投资机会",
      story: "朋友分享了一个投资信息——{desc}",
      triggers: { minDay: 60, interval: 150, maxRepeats: 3, excludeFlags: ["_d596InvestNetCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d596InvestNetCooldown) return false;
        return (st.resources && (st.resources.cash || 0) >= 3000);
      },
      choices: [
        { text: "📈 小额尝试", hint: "现金-500,置投资意识flag", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d596InvestNetCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          st.flags._dataInvestorMindset = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '小额试水学投资。' 现金-¥500,投资意识觉醒。", "success");
        }},
        { text: "📚 先学习", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d596InvestNetCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '先学再投。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友分享了一个投资信息——'这个消息可能有用。' 你开始思考是否要尝试。";
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

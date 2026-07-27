/**
 * 域A(数据/数值平衡) 联动增强 R602
 * 桥接：
 *   A→G  a602_data_health_awareness  数据健康觉醒 → 消费 status+needs 数据,
 *     数据→"健康数据提醒你关注身体"的生命回响
 *   A→C  a602_data_skill_market      数据技能市场 → 消费 skills+jobs 数据,
 *     数据→"你的技能在市场上值多少"的职业回响
 *   A→E  a602_data_wealth_insight    数据财富洞察 → 消费 resources 数据,
 *     数据→"你的资产增长趋势"的经济回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR602Loaded) return;
  RANDOM_EVENTS._domainALinkageR602Loaded = true;

  var EVENTS = [
    {
      id: "a602_data_health_awareness", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "健康数据的提醒",
      story: "看着自己的健康数据，你开始反思——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_a602HealthAwareCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a602HealthAwareCooldown) return false;
        return st.status && (st.status.health || 0) < 60;
      },
      choices: [
        { text: "🏃 开始锻炼", hint: "健康+3,疲劳+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a602HealthAwareCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("❤️ '身体是革命的本钱。' 你决定每天锻炼。健康+3,疲劳+5。", "success");
        }},
        { text: "😴 多休息", hint: "疲劳-10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a602HealthAwareCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("❤️ '今晚早点睡。' 你决定调整作息。疲劳-10。", "info");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "看着自己的健康数据，你开始反思——'我是不是该关注一下身体了？' 健康数据提醒你要注意休息。";
      }
    },
    {
      id: "a602_data_skill_market", phase: "street", _isChainEvent: false, icon: "📊",
      title: "你的技能值多少",
      story: "你查看了一下市场上对技能的需求——{desc}",
      triggers: { minDay: 40, interval: 100, maxRepeats: 3, excludeFlags: ["_a602SkillMarketCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a602SkillMarketCooldown) return false;
        var hasSkill = false;
        if (st.skills) {
          for (var k in st.skills) {
            if (st.skills[k] && (st.skills[k].level || 0) >= 10) { hasSkill = true; break; }
          }
        }
        return hasSkill;
      },
      choices: [
        { text: "📈 继续深耕", hint: "最高技能XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a602SkillMarketCooldown = true;
          var topSkill = null, topLv = 0;
          if (st.skills) {
            for (var k in st.skills) {
              if (st.skills[k] && (st.skills[k].level || 0) > topLv) { topLv = st.skills[k].level; topSkill = k; }
            }
          }
          if (topSkill && typeof addSkillXp === "function") { try { addSkillXp(topSkill, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '" + topSkill + "技能在市场上很抢手，继续深耕！' " + topSkill + "XP+5。", "success");
        }},
        { text: "🔄 学习新技能", hint: "随机新技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a602SkillMarketCooldown = true;
          var skills = ["coding", "sales", "accounting", "management", "english", "driving"];
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '多学一门技能多一条路。' " + sk + "XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你查看了一下市场上对技能的需求——'原来这项技能这么值钱！' 你开始思考如何提升自己的市场价值。";
      }
    },
    {
      id: "a602_data_wealth_insight", phase: "street", _isChainEvent: false, icon: "💰",
      title: "资产增长趋势",
      story: "看着自己的资产变化，你开始规划——{desc}",
      triggers: { minDay: 50, interval: 120, maxRepeats: 3, excludeFlags: ["_a602WealthInsightCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a602WealthInsightCooldown) return false;
        var totalAssets = (st.resources && st.resources.cash || 0) + (st.resources && st.resources.bankBalance || 0);
        return totalAssets >= 10000;
      },
      choices: [
        { text: "📈 投资理财", hint: "会计XP+3,现金+500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a602WealthInsightCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 500;
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '让钱生钱。' 你学会了基础理财。会计XP+3,现金+¥500。", "success");
        }},
        { text: "🛡️ 稳健储蓄", hint: "心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a602WealthInsightCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '稳稳当当最踏实。' 你决定继续储蓄。心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "看着自己的资产变化，你开始规划——'钱该怎么花才能发挥最大价值？' 你开始思考财富管理。";
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

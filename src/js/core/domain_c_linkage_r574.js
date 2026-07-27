/**
 * 域C(职业/成长) 联动增强 R574
 * 桥接：
 *   C→A  c574_skill_market_value 技能市场价值 → 消费 skills 数据,
 *     市场→"你的技能在市场上的真实价值"的数据分析
 *   C→D  c574_career_networking 职业社交网络 → 消费 skills+relationships 数据,
 *     社交→"职业社交圈"的人脉拓展
 *   C→E  c574_career_financial 职业财务规划 → 消费 skills+resources 数据,
 *     财务→"职业发展中的财务决策"的财务规划
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR574Loaded) return;
  RANDOM_EVENTS._domainCLinkageR574Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "c574_skill_market_value", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "技能估值",
      story: "你算了一下自己的技能在市场上值多少钱——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_c574SkillMarketValueCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._c574SkillMarketValueCooldown);
      },
      choices: [
        { text: "📊 分析数据", hint: "会计XP+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c574SkillMarketValueCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '你的技能组合在市场上估值¥XX万/年。' 会计XP+4,心智+2。", "success");
        }},
        { text: "📈 提升价值", hint: "随机技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c574SkillMarketValueCooldown = true;
          var skills = ["accounting", "management", "marketing", "technology", "social", "trade"];
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '提升技能，就是在提升自己的市场价值。' 随机技能XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你算了一下自己的技能在市场上值多少钱——'如果把所有技能变现，一年能赚...' 数字让你陷入了思考。";
      }
    },
    {
      id: "c574_career_networking", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "职业社交",
      story: "你参加了一个职业社交活动——{desc}",
      triggers: { minDay: 25, interval: 90, maxRepeats: 3, excludeFlags: ["_c574NetworkingCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c574NetworkingCooldown);
      },
      choices: [
        { text: "🤝 交换名片", hint: "社交XP+5,管理XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c574NetworkingCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "职业社交");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '认识了很多同行，人脉就是钱脉。' 社交XP+5,管理XP+3,好感+2。", "success");
        }},
        { text: "💬 深入交流", hint: "社交XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c574NetworkingCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '和几个同行深入交流了行业趋势，收获很大。' 社交XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你参加了一个职业社交活动——'来参加的人都是各行各业的精英。' 这种场合，是拓展人脉的好机会。";
      }
    },
    {
      id: "c574_career_financial", phase: "corporate", _isChainEvent: false, icon: "💰",
      title: "职业财务",
      story: "你开始规划职业发展的财务方面——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_c574FinancialCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c574FinancialCooldown);
      },
      choices: [
        { text: "💰 制定计划", hint: "会计XP+5,管理XP+2,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c574FinancialCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 2); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '职业发展需要财务支持，提前规划。' 会计XP+5,管理XP+2,心智+2。", "success");
        }},
        { text: "📈 投资自己", hint: "随机技能XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c574FinancialCooldown = true;
          var skills = ["accounting", "management", "marketing", "technology", "social", "trade"];
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '最好的投资，是投资自己的职业发展。' 随机技能XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始规划职业发展的财务方面——'职业发展需要钱，但怎么花最值？' 职业财务规划，是每个职场人的必修课。";
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
/**
 * 域C(职业/成长) 联动增强 R424
 * 桥接：
 *   C→G  c424_career_health_v2        职业健康v2 → 消费 employment+status.health
 *   C→A  c424_skill_value_v2           技能价值v2 → 消费 skills+jobs→技能市场价值
 *   C→E  c424_career_invest_v2         职业投资v2 → 消费 employment+investment
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR424Loaded) return;
  RANDOM_EVENTS._domainCLinkageR424Loaded = true;
  function grantXp(key, amt) { if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} } }
  var EVENTS = [
    {
      id: "c424_career_health_v2", phase: "street", _isChainEvent: false, icon: "💚",
      title: "工作与健康",
      story: "你关注工作对健康的影响——{desc}",
      triggers: { minDay: 60, excludeFlags: ["_c424HealthCooldown"] },
      conditions: function (st) { return !st.gameOver && st.status; },
      choices: [
        { text: "💪 平衡工作与健康", hint: "心智+4,心情+4", apply: function (st) {
          if (!st) return; st.flags._c424HealthCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💚 你关注工作与健康的平衡——可持续的发展需要健康的身体。心智+4,心情+4。", "success");
        }},
        { text: "😅 年轻不怕拼", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "工作压力对健康有一定影响,需要注意平衡";
        if (st.needs && (st.needs.fatigue || 0) > 70) desc = "过度工作已经影响了健康,需要适当休息";
        return "你关注工作对健康的影响——" + desc + "。";
      }
    },
    {
      id: "c424_skill_value_v2", phase: "street", _isChainEvent: false, icon: "💎",
      title: "技能的市场价值",
      story: "你分析了技能的市场价值——{desc}",
      triggers: { minDay: 70, excludeFlags: ["_c424ValueCooldown"] },
      conditions: function (st) { return !st.gameOver && st.skills; },
      choices: [
        { text: "📊 投资高价值技能", hint: "心智+3,accounting XP+4", apply: function (st) {
          if (!st) return; st.flags._c424ValueCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          grantXp("accounting", 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💎 你分析技能的市场价值——投资高回报技能是最优策略。心智+3,会计XP+4。", "success");
        }},
        { text: "😊 兴趣最重要", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st || !st.skills) return null;
        var top = null, topLv = 0;
        for (var k in st.skills) { if (st.skills[k] && (st.skills[k].level || 0) > topLv) { topLv = st.skills[k].level || 0; top = k; } }
        var cn = { cooking: "烹饪", repair: "维修", coding: "编程", english: "英语", driving: "驾驶", sales: "销售" };
        var desc = top ? "你的" + (cn[top] || top) + "技能最具市场价值(Lv." + topLv + ")" : "各项技能都有其市场价值";
        return "你分析了技能的市场价值——" + desc + "。";
      }
    },
    {
      id: "c424_career_invest_v2", phase: "street", _isChainEvent: false, icon: "📈",
      title: "职业助力投资",
      story: "你的职业经验帮助了投资决策——{desc}",
      triggers: { minDay: 85, excludeFlags: ["_c424InvestCooldown"] },
      conditions: function (st) { return !st.gameOver && st.investment; },
      choices: [
        { text: "📊 职业认知是投资优势", hint: "accounting XP+5,心智+3", apply: function (st) {
          if (!st) return; st.flags._c424InvestCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          grantXp("accounting", 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你的职业经验帮助了投资——行业认知是最有价值的信息优势。会计XP+5,心智+3。", "success");
        }},
        { text: "🤷 两码事", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) { return "你的职业经验帮助了投资决策——工作中积累的行业认知,让你能更准确地判断投资机会。"; }
    }
  ];
  for (var i = 0; i < EVENTS.length; i++) { if (!RANDOM_EVENTS.find(function (ev) { return ev.id === EVENTS[i].id; })) RANDOM_EVENTS.push(EVENTS[i]); }
})();

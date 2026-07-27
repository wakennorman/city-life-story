/**
 * 域A(数据/数值平衡) 联动增强 R423
 * 桥接：
 *   A→G  a423_health_data_v2          健康数据v2 → 消费 status/illnesses→健康画像
 *   A→B  a423_economy_narrative_v2    经济叙事v2 → 消费 economy_v3.1→叙事风味
 *   A→C  a423_job_market_v2           就业市场v2 → 消费 jobs+skills→市场洞察
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR423Loaded) return;
  RANDOM_EVENTS._domainALinkageR423Loaded = true;
  function grantXp(key, amt) { if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} } }
  var EVENTS = [
    {
      id: "a423_health_data_v2", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "健康画像",
      story: "你审视自己的健康数据——{desc}",
      triggers: { minDay: 50, excludeFlags: ["_a423HealthCooldown"] },
      conditions: function (st) { return !st.gameOver && st.status; },
      choices: [
        { text: "💪 根据数据调整生活", hint: "心智+4,心情+3", apply: function (st) {
          if (!st) return; st.flags._a423HealthCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("❤️ 你根据健康数据调整生活——数据是健康管理的基础。心智+4,心情+3。", "success");
        }},
        { text: "😅 感觉还行", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st || !st.status) return null;
        var h = st.status.health;
        var desc = typeof h === "number" ? (h >= 70 ? "健康良好(" + h + "分)" : h >= 50 ? "健康一般(" + h + "分)" : "健康欠佳(" + h + "分)") : "健康状态稳定";
        return "你审视自己的健康数据——" + desc + "。";
      }
    },
    {
      id: "a423_economy_narrative_v2", phase: "street", _isChainEvent: false, icon: "📖",
      title: "经济背景叙事",
      story: "你感受到经济环境在变化——{desc}",
      triggers: { minDay: 65, excludeFlags: ["_a423EconCooldown"] },
      conditions: function (st) { return !st.gameOver; },
      choices: [
        { text: "📊 读懂经济,顺势而为", hint: "心智+3,sales XP+3", apply: function (st) {
          if (!st) return; st.flags._a423EconCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          grantXp("sales", 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你感受到经济变化——读懂环境是生存的智慧。心智+3,销售XP+3。", "success");
        }},
        { text: "🤷 过好自己就好", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "经济环境在不断变化,影响着每个人的生活";
        if (st.flags && st.flags._eraState && st.flags._eraState.inflationIndex > 1.2) desc = "通胀压力下,钱越来越不值钱,需要更精明地管理财务";
        return "你感受到经济环境在变化——" + desc + "。";
      }
    },
    {
      id: "a423_job_market_v2", phase: "street", _isChainEvent: false, icon: "🏢",
      title: "就业市场",
      story: "你分析了就业市场——{desc}",
      triggers: { minDay: 70, excludeFlags: ["_a423JobCooldown"] },
      conditions: function (st) { return !st.gameOver && typeof STREET_JOBS !== "undefined"; },
      choices: [
        { text: "📊 根据市场需求学技能", hint: "心智+4,accounting XP+2", apply: function (st) {
          if (!st) return; st.flags._a423JobCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          grantXp("accounting", 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏢 你分析了就业市场——按需学习是最优策略。心智+4,会计XP+2。", "success");
        }},
        { text: "😊 做好当前工作", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st || typeof STREET_JOBS === "undefined") return null;
        return "你分析了就业市场——当前有" + STREET_JOBS.length + "种工作机会,选择适合自己的方向。";
      }
    }
  ];
  for (var i = 0; i < EVENTS.length; i++) { if (!RANDOM_EVENTS.find(function (ev) { return ev.id === EVENTS[i].id; })) RANDOM_EVENTS.push(EVENTS[i]); }
})();

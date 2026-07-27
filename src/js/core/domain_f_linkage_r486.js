/**
 * 域F(UI/UX) 联动增强 R486（第二十八轮循环）
 * 桥接：
 *   F→E  f486_finance_clarity_v2   财务清晰v2 → 消费 resources 数据,
 *     收支→"你的钱去哪了"的UI洞察
 *   F→A  f486_data_story_v3        数据故事v3 → 消费 stats 数据,
 *     数据→"你的数字在说什么"的经济面板
 *   f486_life_portrait(F→G 人生画像): stats→"你的人生数据画像"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR486Loaded) return;
  RANDOM_EVENTS._domainFLinkageR486Loaded = true;

  var EVENTS = [
    {
      id: "f486_finance_clarity_v2", phase: "street", _isChainEvent: false, icon: "💰",
      title: "钱去哪了",
      story: "你整理了一下最近的收支——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_f486FinanceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        return (st.flags && !st.flags._f486FinanceCooldown);
      },
      choices: [
        { text: "📊 分类统计", hint: "会计XP+3,智力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f486FinanceCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分类统计了收支——'钱要花在刀刃上。' 会计XP+3,智力+1。", "success");
        }},
        { text: "🎯 设定预算", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f486FinanceCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你设定了月度预算——'有规划，心里不慌。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = st.resources && st.resources.cash ? st.resources.cash : 0;
        var bank = st.resources && st.resources.bankBalance ? st.resources.bankBalance : 0;
        return "你整理了一下最近的收支——手头¥" + Math.round(cash) + "，银行¥" + Math.round(bank) + "。钱去哪了？";
      }
    },
    {
      id: "f486_data_story_v3", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据故事",
      story: "你的数据开始编织出故事——{desc}",
      triggers: { minDay: 40, interval: 70, maxRepeats: 4, excludeFlags: ["_f486DataCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.resources) return false;
        return (st.flags && !st.flags._f486DataCooldown);
      },
      choices: [
        { text: "📈 解读趋势", hint: "智力+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f486DataCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你解读了数据趋势——'数字背后是人生。' 智力+2,会计XP+2。", "success");
        }},
        { text: "🎯 设定目标", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f486DataCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你设定了数据目标——'有目标才有方向。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var totalEarned = st.resources && st.resources.totalEarned ? st.resources.totalEarned : 0;
        return "你的数据开始编织出故事——累计赚取¥" + totalEarned.toLocaleString() + "。这些数字在说什么？";
      }
    },
    {
      id: "f486_life_portrait", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "人生画像",
      story: "你查看了自己的人生数据画像——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 3, excludeFlags: ["_f486PortraitCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.player) return false;
        return (st.flags && !st.flags._f486PortraitCooldown);
      },
      choices: [
        { text: "📊 全面分析", hint: "智力+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f486PortraitCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你全面分析了人生画像——'知己知彼。' 智力+3,心智+2。", "success");
        }},
        { text: "🎯 聚焦成长", hint: "全技能XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f486PortraitCooldown = true;
          var skills = ["accounting", "management", "sales", "coding", "trade"];
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 2); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你聚焦于成长——'每天进步一点点。' 全技能XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        return "你查看了自己的人生数据画像——已经走过了" + days + "天。这些数据就是你的人生故事。";
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

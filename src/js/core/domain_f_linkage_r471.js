/**
 * 域F(UI/UX) 联动增强 R471（第二十四轮循环·续）
 * 桥接：
 *   F→E  f471_finance_clarity     财务清晰UI → 消费 resources 数据,
 *     收支→"你的钱去哪了"的UI洞察
 *   F→A  f471_economy_panel       经济面板 → 消费 economy+skills 数据,
 *     数据→"你的经济状况如何"的UI展示
 *   f471_quest_ritual(F→G 每日目标仪式感): daily_quest→"今天该做什么"的生命节奏
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR471Loaded) return;
  RANDOM_EVENTS._domainFLinkageR471Loaded = true;

  var EVENTS = [
    {
      id: "f471_finance_clarity", phase: "street", _isChainEvent: false, icon: "💰",
      title: "钱去哪了",
      story: "你整理了一下最近的收支——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_f471FinanceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        return (st.flags && !st.flags._f471FinanceCooldown);
      },
      choices: [
        { text: "📊 分类统计", hint: "会计XP+3,智力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f471FinanceCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分类统计了收支——'钱要花在刀刃上。' 会计XP+3,智力+1。", "success");
        }},
        { text: "🎯 设定预算", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f471FinanceCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你设定了月度预算——'有规划，心里不慌。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = st.resources && st.resources.cash ? st.resources.cash : 0;
        var bank = st.resources && st.resources.bankBalance ? st.resources.bankBalance : 0;
        return "你整理了一下最近的收支——手头现金¥" + Math.round(cash) + "，银行余额¥" + Math.round(bank) + "。钱去哪了？";
      }
    },
    {
      id: "f471_economy_panel", phase: "street", _isChainEvent: false, icon: "📈",
      title: "经济面板",
      story: "你查看了自己的经济数据面板——{desc}",
      triggers: { minDay: 40, interval: 70, maxRepeats: 4, excludeFlags: ["_f471PanelCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources || !st.stats) return false;
        return (st.flags && !st.flags._f471PanelCooldown);
      },
      choices: [
        { text: "📊 分析资产结构", hint: "智力+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f471PanelCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了资产结构——'不要把鸡蛋放在一个篮子里。' 智力+2,会计XP+2。", "success");
        }},
        { text: "🎯 优化配置", hint: "心智+2,现金+200", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f471PanelCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 200;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你优化了资产配置——'钱要流动起来。' 心智+2,现金+200。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var totalEarned = st.resources && st.resources.totalEarned ? st.resources.totalEarned : 0;
        return "你查看了自己的经济数据面板——累计赚取¥" + totalEarned.toLocaleString() + "。数字背后，是你每一天的努力。";
      }
    },
    {
      id: "f471_quest_ritual", phase: "street", _isChainEvent: false, icon: "✅",
      title: "今日目标",
      story: "你看了看今天的目标清单——{desc}",
      triggers: { minDay: 20, interval: 30, maxRepeats: 6, excludeFlags: ["_f471QuestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.dailyQuest || !st.dailyQuest.quests) return false;
        return st.dailyQuest.quests.length >= 1 && (st.flags && !st.flags._f471QuestCooldown);
      },
      choices: [
        { text: "🎯 优先完成最难的目标", hint: "心智+3,全技能XP+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f471QuestCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          var skills = ["accounting", "management", "sales", "coding", "social"]; // [全系统自洽修复] 域E R588 修复:trade非真实技能键(addSkillXp静默丢弃XP)→映射social
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 1); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你决定先啃硬骨头——'最难的事最值得做。' 心智+3,全技能XP+1。", "success");
        }},
        { text: "😊 从简单的开始", hint: "心情+5,现金+100", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f471QuestCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 100;
          if (typeof StateManager !== "undefined") StateManager.addMessage("😊 你从简单的开始——'先赢一局，建立信心。' 心情+5,现金+100。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = st.dailyQuest && st.dailyQuest.quests ? st.dailyQuest.quests.length : 0;
        return "你看了看今天的目标清单——" + n + "个待完成的目标在等着你。先做哪个？";
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

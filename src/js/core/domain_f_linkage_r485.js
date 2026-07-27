/**
 * 域F(UI/UX) 联动增强 R485（第二十七轮循环）
 * 桥接：
 *   F→A  f485_wealth_dashboard    财富仪表盘 → 消费 resources 数据,
 *     资产→"你有多少钱"的经济面板
 *   F→E  f485_invest_overview     投资概览UI → 消费 investment 数据,
 *     投资→"你的钱投在哪"的UI洞察
 *   f485_quest_board(F→G 任务面板): daily_quest→"今天要做什么"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR485Loaded) return;
  RANDOM_EVENTS._domainFLinkageR485Loaded = true;

  var EVENTS = [
    {
      id: "f485_wealth_dashboard", phase: "street", _isChainEvent: false, icon: "💰",
      title: "财富仪表盘",
      story: "你查看了自己的财富仪表盘——{desc}",
      triggers: { minDay: 30, interval: 50, maxRepeats: 5, excludeFlags: ["_f485WealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        return (st.flags && !st.flags._f485WealthCooldown);
      },
      choices: [
        { text: "📊 分析资产", hint: "会计XP+3,智力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f485WealthCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了资产状况——'知道自己是多少钱。' 会计XP+3,智力+1。", "success");
        }},
        { text: "🎯 设定目标", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f485WealthCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你设定了财富目标——'有目标才有动力。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = st.resources && st.resources.cash ? st.resources.cash : 0;
        var bank = st.resources && st.resources.bankBalance ? st.resources.bankBalance : 0;
        return "你查看了财富仪表盘——手头¥" + Math.round(cash) + "，银行¥" + Math.round(bank) + "。你的钱都在哪？";
      }
    },
    {
      id: "f485_invest_overview", phase: "street", _isChainEvent: false, icon: "📈",
      title: "投资概览",
      story: "你查看了自己的投资分布——{desc}",
      triggers: { minDay: 50, interval: 70, maxRepeats: 4, excludeFlags: ["_f485InvestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return (st.flags && !st.flags._f485InvestCooldown);
      },
      choices: [
        { text: "📊 分析分布", hint: "智力+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f485InvestCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了投资分布——'不要把所有鸡蛋放在一个篮子里。' 智力+2,会计XP+2。", "success");
        }},
        { text: "🎯 再平衡", hint: "心智+3,风险-3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f485InvestCooldown = true;
          if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 3); st.player.risk = Math.max(0, (st.player.risk || 0) - 3); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你决定再平衡——'纪律胜于预测。' 心智+3,风险-3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = st.investment && st.investment.stockHoldings ? st.investment.stockHoldings.length : 0;
        return "你查看了自己的投资分布——持有" + n + "只股票。你的钱都投在了哪里？";
      }
    },
    {
      id: "f485_quest_board", phase: "street", _isChainEvent: false, icon: "📋",
      title: "任务面板",
      story: "你查看了今天的任务面板——{desc}",
      triggers: { minDay: 20, interval: 30, maxRepeats: 6, excludeFlags: ["_f485QuestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.dailyQuest || !st.dailyQuest.quests) return false;
        return st.dailyQuest.quests.length >= 1 && (st.flags && !st.flags._f485QuestCooldown);
      },
      choices: [
        { text: "🎯 优先完成", hint: "心智+3,全技能XP+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f485QuestCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          var skills = ["accounting", "management", "sales", "coding", "social"]; // [全系统自洽修复] 域E R588 修复:trade非真实技能键(addSkillXp静默丢弃XP)→映射social
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 1); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你优先完成了任务——'今日事今日毕。' 心智+3,全技能XP+1。", "success");
        }},
        { text: "😊 从易到难", hint: "心情+5,现金+100", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f485QuestCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 100;
          if (typeof StateManager !== "undefined") StateManager.addMessage("😊 你从简单的开始——'先赢一局。' 心情+5,现金+100。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = st.dailyQuest && st.dailyQuest.quests ? st.dailyQuest.quests.length : 0;
        return "你查看了今天的任务面板——" + n + "个待完成的目标在等着你。先做哪个？";
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

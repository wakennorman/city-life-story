/**
 * 域G(核心机制/生命周期) 联动增强 R445
 * 桥接：
 *   G→A  g445_life_data_portrait   人生数据画像 → 消费 player.day+resources 数据,
 *     每日收支→"你的城市生存数据报告"的数据积累
 *   G→E  g445_daily_cost_insight   日常开销洞察 → 消费 resources/needs 数据,
 *     每日开销→"钱都花在哪了"的财务健康检查
 *   G→H  g445_life_stage_startup  人生阶段创业 → 消费 player.age+day 数据,
 *     年龄增长→"什么年龄做什么事"的创业时机思考
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR445Loaded) return;
  RANDOM_EVENTS._domainGLinkageR445Loaded = true;

  var EVENTS = [
    // G→A: 人生数据画像
    {
      id: "g445_life_data_portrait", phase: "street", _isChainEvent: false, icon: "📋",
      title: "城市生存报告",
      story: "你算了算自己在这座城市的生存数据——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_g445DataPortraitCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g445DataPortraitCooldown);
      },
      choices: [
        { text: "📊 认真分析", hint: "心智+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g445DataPortraitCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 你认真分析了这些数据——数字不会骗人，它们记录着你在城市里的每一步。心智+2,会计XP+2。", "success");
        }},
        { text: "😅 看一眼就过了", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g445DataPortraitCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var cash = (st.resources && st.resources.cash) || 0;
        var bank = (st.resources && st.resources.bankBalance) || 0;
        return "你算了算自己在这座城市的生存数据——已经过了" + day + "天，手头现金¥" + Math.floor(cash).toLocaleString() + "，银行存款¥" + Math.floor(bank).toLocaleString() + "。这些数字，就是你的城市人生。";
      }
    },
    // G→E: 日常开销洞察
    {
      id: "g445_daily_cost_insight", phase: "street", _isChainEvent: false, icon: "💸",
      title: "钱去哪了",
      story: "你翻着钱包里的零钱和账单——{desc}",
      triggers: { minDay: 15, interval: 30, maxRepeats: 5, excludeFlags: ["_g445CostInsightCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g445CostInsightCooldown);
      },
      choices: [
        { text: "📝 记账", hint: "会计XP+3,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g445CostInsightCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💸 你掏出一个小本子开始记账——每一笔钱都记下来，花的每一分都心里有数。会计XP+3,心智+1。", "success");
        }},
        { text: "💪 下个月省着点", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g445CostInsightCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        return "你翻着钱包里的零钱和账单——还剩¥" + Math.floor(cash).toLocaleString() + "。钱就像流水，不记账就不知道花哪了。";
      }
    },
    // G→H: 人生阶段创业时机
    {
      id: "g445_life_stage_startup", phase: "corporate", _isChainEvent: false, icon: "🎯",
      title: "什么年龄做什么事",
      story: "你看着日历，忽然意识到自己已经在这个行业打拼了这么久——{desc}",
      triggers: { minDay: 90, interval: 180, maxRepeats: 3, excludeFlags: ["_g445LifeStageCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._g445LifeStageCooldown);
      },
      choices: [
        { text: "🚀 全力冲刺", hint: "管理XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g445LifeStageCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '现在就是最好的时机'——你告诉自己。人生没有白走的路，每一步都算数。管理XP+5,心智+2。", "success");
        }},
        { text: "🧘 稳扎稳打", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g445LifeStageCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你决定不急不躁——创业是一场马拉松，不是百米冲刺。稳扎稳打才是长久之道。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var year = Math.floor(day / 365) + 1;
        return "你看着日历，忽然意识到自己已经在这个行业打拼了这么久——第" + day + "天，第" + year + "个年头。什么年龄做什么事，但你相信，创业永远不嫌晚。";
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
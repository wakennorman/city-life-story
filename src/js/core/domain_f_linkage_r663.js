/**
 * 域F(UI/UX) 联动增强 R663
 * 桥接：
 *   F→E  f663_ui_expense_tracker  UI支出追踪 → 消费 state.resources 数据,
 *     UI→"支出可视化追踪"的经济回响
 *   F→D  f663_ui_social_calendar  UI社交日历 → 消费 state.relationships+state.player 数据,
 *     UI→"社交日程提醒"的社交回响
 *   F→G  f663_ui_daily_routine  UI日常作息 → 消费 state.needs+state.player 数据,
 *     UI→"作息规律可视化"的生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR663Loaded) return;
  RANDOM_EVENTS._domainFLinkageR663Loaded = true;

  var EVENTS = [
    // ====== F→E: UI支出追踪 ======
    {
      id: "f663_ui_expense_tracker", phase: "street", _isChainEvent: false, icon: "💳",
      title: "支出分析",
      story: "手机APP显示了你这个月的消费明细——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 10, excludeFlags: ["_f663ExpenseTrackerCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f663ExpenseTrackerCooldown) return false;
        return true;
      },
      choices: [
        { text: "📊 分析消费结构", hint: "智力+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f663ExpenseTrackerCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💳 '原来我每个月花这么多钱在吃的上面!' 你惊讶地看着数据。智力+5,心智+3。", "success");
        }},
        { text: "💰 制定预算", hint: "心智+5,未来支出-10%", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f663ExpenseTrackerCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.flags) st.flags._budgetPlan = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("💳 你制定了详细的月度预算。'花钱有计划,心里才有底。' 心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        return "你打开记账APP,看到这个月的支出明细。'¥" + cash.toLocaleString() + "的余额,但感觉没买什么东西就花了一大半。' 钱去哪了?";
      }
    },

    // ====== F→D: UI社交日历 ======
    {
      id: "f663_ui_social_calendar", phase: "street", _isChainEvent: false, icon: "📅",
      title: "社交日历",
      story: "手机提醒你,已经很久没和某些朋友联系了——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 8, excludeFlags: ["_f663SocialCalendarCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f663SocialCalendarCooldown) return false;
        if (!st.relationships) return false;
        var today = st.player ? st.player.day : 0;
        for (var k in st.relationships) {
          var r = st.relationships[k];
          if (r && r.met && r._lastInteractionDay && (today - r._lastInteractionDay) >= 20) return true;
        }
        return false;
      },
      choices: [
        { text: "📞 主动联系", hint: "好感+8,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f663SocialCalendarCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          var today = st.player ? st.player.day : 0;
          for (var k in (st.relationships || {})) {
            var r = st.relationships[k];
            if (r && r.met && r._lastInteractionDay && (today - r._lastInteractionDay) >= 20) {
              if (typeof applyAffinityChange === "function") {
                try { applyAffinityChange(st, k, 8, "主动联系"); } catch(e) {}
              } break;
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📅 '好久不见,最近怎么样?' 一个电话,让友谊重新升温。好感+8,心情+5。", "success");
        }},
        { text: "💬 发条消息", hint: "好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f663SocialCalendarCooldown = true;
          var today = st.player ? st.player.day : 0;
          for (var k in (st.relationships || {})) {
            var r = st.relationships[k];
            if (r && r.met && r._lastInteractionDay && (today - r._lastInteractionDay) >= 20) {
              if (typeof applyAffinityChange === "function") {
                try { applyAffinityChange(st, k, 3, "发消息问候"); } catch(e) {}
              } break;
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📅 你发了条问候消息。'虽然简单,但至少让朋友知道你在乎TA。' 好感+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var today = st.player.day || 0;
        return "你的社交日历提醒:'你已经" + today + "天没出门见朋友了。' 你看着空荡荡的日程表,决定改变一下。";
      }
    },

    // ====== F→G: UI日常作息 ======
    {
      id: "f663_ui_daily_routine", phase: "street", _isChainEvent: false, icon: "⏰",
      title: "作息分析",
      story: "你的健康APP发来了一份作息报告——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 15, excludeFlags: ["_f663DailyRoutineCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f663DailyRoutineCooldown) return false;
        return true;
      },
      choices: [
        { text: "😴 早点睡", hint: "疲劳-15,健康+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f663DailyRoutineCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⏰ 你决定今晚不熬夜,好好睡一觉。'明天又是新的一天。' 疲劳-15,健康+5,心情+3。", "success");
        }},
        { text: "🏃 晨跑" , hint: "健康+5,心情+5,疲劳+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f663DailyRoutineCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⏰ 你早起晨跑了一圈,感觉整个人都精神了。健康+5,心情+5,疲劳+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var fatigue = (st.needs && st.needs.fatigue) || 0;
        var health = (st.status && st.status.health) || 100;
        return "健康APP显示:你的平均睡眠时间不足7小时,疲劳度" + fatigue + ",健康值" + health + "。'您的作息需要改善。' 你看着报告,陷入沉思。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
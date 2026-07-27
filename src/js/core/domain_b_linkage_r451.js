/**
 * 域B(事件/叙事) 联动增强 R451（第二轮循环）
 * 桥接：
 *   B→C  b451_event_career_boost  事件职业催化剂 → 消费 flags+skills 数据,
 *     重大事件→"这件事改变了你的职业方向"的职业转折
 *   B→F  b451_event_visual       事件可视化 → 消费 flags 数据,
 *     事件记录→"你的人生时间线"的可视化展示
 *   B→G  b451_event_resilience   事件心理韧性 → 消费 flags+needs 数据,
 *     经历风雨→"打不倒你的让你更强"的心智成长
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR451Loaded) return;
  RANDOM_EVENTS._domainBLinkageR451Loaded = true;

  var EVENTS = [
    {
      id: "b451_event_career_boost", phase: "corporate", _isChainEvent: false, icon: "🚀",
      title: "转折点",
      story: "最近发生的一件事，让你重新思考自己的职业方向——{desc}",
      triggers: { minDay: 50, interval: 120, maxRepeats: 3, excludeFlags: ["_b451CareerBoostCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b451CareerBoostCooldown);
      },
      choices: [
        { text: "🎯 调整职业规划", hint: "管理XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b451CareerBoostCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你重新审视了自己的职业规划——每一次转折都是新的机会。管理XP+5,心智+2。", "success");
        }},
        { text: "💪 坚定原路", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b451CareerBoostCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你决定继续走原来的路——不是因为固执，而是因为你知道自己要什么。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "最近发生的一件事，让你重新思考自己的职业方向——有些事，发生了就是提醒你该转弯了。";
      }
    },
    {
      id: "b451_event_visual", phase: "street", _isChainEvent: false, icon: "🖼️",
      title: "人生快照",
      story: "你翻着手机相册，回顾最近发生的事——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_b451EventVisualCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b451EventVisualCooldown);
      },
      choices: [
        { text: "📱 发条朋友圈", hint: "名气+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b451EventVisualCooldown = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🖼️ 你发了条朋友圈，记录最近的生活——朋友们纷纷点赞。名气+2,心情+2。", "success");
        }},
        { text: "📝 写日记", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b451EventVisualCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🖼️ 你把最近的经历写进了日记——好的坏的，都是人生。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你翻着手机相册，回顾最近发生的事——每一张照片都是一个故事，每一段经历都是人生的一页。";
      }
    },
    {
      id: "b451_event_resilience", phase: "street", _isChainEvent: false, icon: "💪",
      title: "打不倒的",
      story: "回想最近遇到的困难，你笑了笑——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_b451ResilienceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b451ResilienceCooldown);
      },
      choices: [
        { text: "💪 继续前进", hint: "心智+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b451ResilienceCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '那些打不倒你的，终将使你更强大'——你深吸一口气，继续向前走。心智+3,心情+2。", "success");
        }},
        { text: "🧘 停下来休息", hint: "疲劳-3,健康+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b451ResilienceCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 3);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 你决定停下来歇一歇——充电是为了走更远的路。疲劳-3,健康+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "回想最近遇到的困难，你笑了笑——那些当时觉得过不去的坎，现在回头看，也不过如此。";
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
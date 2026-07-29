/**
 * 域F(UI/UX) 联动增强 R846 (第十七轮循环)
 * 桥接：
 *   F→A  f846_data_portrait 数据画像 → 消费 全维度数据
 *   F→B  f846_event_timeline_v2 事件时间线v2 → 消费 事件历史
 *   F→G  f846_health_monitor 健康监测 → 消费 status/needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR846Loaded) return;
  RANDOM_EVENTS._domainFLinkageR846Loaded = true;

  var EVENTS = [
    {
      id: "f846_data_portrait", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据画像", story: "你的数据正在讲述一个完整的故事——每一个数字,都是你成长的见证。",
      triggers: { minDay: 100, interval: 180, maxRepeats: 3, excludeFlags: ["_f846DataCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._f846DataCd) return false; return st.player && st.player.day >= 100; },
      text: function (st) { if (!st) return null; var d = st.player && st.player.day ? st.player.day : 0; var c = st.resources && isFinite(st.resources.cash) ? Math.round(st.resources.cash) : 0; return "你已度过" + d + "天,存款¥" + c.toLocaleString() + "——'每一个数字,都是你成长的见证。'"; },
      choices: [
        { text: "📈 查看", hint: "心智+20,智力+15,置_f846Tracker",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f846DataCd = true; st.flags._f846Tracker = true; if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 20); st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("📈 '数据是最好的见证者。' 心智+20,智力+15。", "success"); } }
        },
        { text: "🎯 目标", hint: "心智+25,置_f846Goal",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f846DataCd = true; st.flags._f846Goal = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25); if (typeof StateManager !== "undefined") { StateManager.addMessage("🎯 '有目标才有方向。' 心智+25。", "info"); } }
        }
      ]
    },
    {
      id: "f846_event_timeline_v2", phase: "street", _isChainEvent: false, icon: "📜",
      title: "事件时间线", story: "你经历的事件,串联成了一条故事线——每一件事,都改变了你的人生。",
      triggers: { minDay: 180, interval: 220, maxRepeats: 3, excludeFlags: ["_f846TimelineCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._f846TimelineCd) return false; return st.player && st.player.day >= 180; },
      text: function (st) { if (!st) return null; var d = st.player && st.player.day ? st.player.day : 0; return "你已度过" + d + "天——'每一件事,都改变了你的人生。'"; },
      choices: [
        { text: "📖 回顾", hint: "心智+20,魅力+15,置_f846Chronicler",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f846TimelineCd = true; st.flags._f846Chronicler = true; if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 20); st.player.charm = Math.min(100, (st.player.charm || 50) + 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '每一个选择都塑造了今天的你。' 心智+20,魅力+15。", "success"); } }
        },
        { text: "✍️ 记录", hint: "心智+22,置_f846Writer",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f846TimelineCd = true; st.flags._f846Writer = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 22); if (typeof StateManager !== "undefined") { StateManager.addMessage("✍️ '记录当下就是为未来留下礼物。' 心智+22。", "info"); } }
        }
      ]
    },
    {
      id: "f846_health_monitor", phase: "street", _isChainEvent: false, icon: "💚",
      title: "健康监测", story: "健康,是你最需要关注的核心指标——定期检查,才能及时调整。",
      triggers: { minDay: 250, interval: 280, maxRepeats: 4, excludeFlags: ["_f846HealthCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._f846HealthCd) return false; return st.player && st.player.day >= 250 && st.status && st.needs; },
      text: function (st) { if (!st) return null; var h = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100; var f = st.needs && isFinite(st.needs.fatigue) ? Math.round(st.needs.fatigue) : 0; return "健康" + h + "%,疲劳" + f + "——'定期检查,才能及时调整。'"; },
      choices: [
        { text: "🏃 计划", hint: "健康+20,疲劳-20,置_f846Plan",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f846HealthCd = true; st.flags._f846Plan = true; if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 20); if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("🏃 '健康是1,其他都是0。' 健康+20,疲劳-20。", "success"); } }
        },
        { text: "😴 作息", hint: "心情+25,疲劳-15,置_f846Sleep",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f846HealthCd = true; st.flags._f846Sleep = true; if (st.needs) { st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25); st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("😴 '早睡早起精神百倍。' 心情+25,疲劳-15。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
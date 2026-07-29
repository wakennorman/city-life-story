/**
 * 域F(UI/UX) 联动增强 R838 (第十六轮循环)
 * 桥接：
 *   F→A  f838_data_lens 数据透镜 → 消费 全维度数据
 *   F→B  f838_event_mirror 事件镜 → 消费 事件历史
 *   F→G  f838_health_gauge 健康计 → 消费 status/needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR838Loaded) return;
  RANDOM_EVENTS._domainFLinkageR838Loaded = true;

  var EVENTS = [
    {
      id: "f838_data_lens", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据透镜", story: "你的数据正在讲述一个完整的故事——每一个数字,都是你成长的见证。",
      triggers: { minDay: 120, interval: 200, maxRepeats: 3, excludeFlags: ["_f838DataCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._f838DataCd) return false; return st.player && st.player.day >= 120; },
      text: function (st) { if (!st) return null; var d = st.player && st.player.day ? st.player.day : 0; var c = st.resources && isFinite(st.resources.cash) ? Math.round(st.resources.cash) : 0; return "你已度过" + d + "天,存款¥" + c.toLocaleString() + "——'每一个数字,都是你成长的见证。'"; },
      choices: [
        { text: "📈 查看轨迹", hint: "心智+20,智力+15,置_f838Tracker",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f838DataCd = true; st.flags._f838Tracker = true; if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 20); st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("📈 '数据是最好的见证者。' 心智+20,智力+15。", "success"); } }
        },
        { text: "🎯 设定目标", hint: "心智+25,置_f838Goal",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f838DataCd = true; st.flags._f838Goal = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25); if (typeof StateManager !== "undefined") { StateManager.addMessage("🎯 '有目标才有方向。' 心智+25。", "info"); } }
        }
      ]
    },
    {
      id: "f838_event_mirror", phase: "street", _isChainEvent: false, icon: "📜",
      title: "事件镜", story: "你经历的事件,串联成了一条故事线——每一件事,都改变了你的人生。",
      triggers: { minDay: 200, interval: 250, maxRepeats: 3, excludeFlags: ["_f838EventCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._f838EventCd) return false; return st.player && st.player.day >= 200; },
      text: function (st) { if (!st) return null; var d = st.player && st.player.day ? st.player.day : 0; return "你已度过" + d + "天——'每一件事,都改变了你的人生。'"; },
      choices: [
        { text: "📖 回顾", hint: "心智+20,魅力+15,置_f838Chronicler",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f838EventCd = true; st.flags._f838Chronicler = true; if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 20); st.player.charm = Math.min(100, (st.player.charm || 50) + 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '每一个选择都塑造了今天的你。' 心智+20,魅力+15。", "success"); } }
        },
        { text: "✍️ 记录当下", hint: "心智+22,置_f838Writer",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f838EventCd = true; st.flags._f838Writer = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 22); if (typeof StateManager !== "undefined") { StateManager.addMessage("✍️ '记录当下就是为未来留下礼物。' 心智+22。", "info"); } }
        }
      ]
    },
    {
      id: "f838_health_gauge", phase: "street", _isChainEvent: false, icon: "💚",
      title: "健康计", story: "健康,是你最需要关注的核心指标——定期检查,才能及时调整。",
      triggers: { minDay: 300, interval: 300, maxRepeats: 4, excludeFlags: ["_f838HealthCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._f838HealthCd) return false; return st.player && st.player.day >= 300 && st.status && st.needs; },
      text: function (st) { if (!st) return null; var h = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100; var f = st.needs && isFinite(st.needs.fatigue) ? Math.round(st.needs.fatigue) : 0; return "健康" + h + "%,疲劳" + f + "——'定期检查,才能及时调整。'"; },
      choices: [
        { text: "🏃 制定计划", hint: "健康+20,疲劳-20,置_f838Plan",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f838HealthCd = true; st.flags._f838Plan = true; if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 20); if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("🏃 '健康是1,其他都是0。' 健康+20,疲劳-20。", "success"); } }
        },
        { text: "😴 调整作息", hint: "心情+25,疲劳-15,置_f838Sleep",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f838HealthCd = true; st.flags._f838Sleep = true; if (st.needs) { st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25); st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("😴 '早睡早起精神百倍。' 心情+25,疲劳-15。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
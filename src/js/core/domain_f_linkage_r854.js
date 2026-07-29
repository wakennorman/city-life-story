/**
 * 域F(UI/UX) 联动增强 R854 (第十八轮循环)
 * 桥接：
 *   F→A  f854_data_overview 数据概览 → 消费 全维度数据
 *   F→B  f854_event_album 事件相册 → 消费 事件历史
 *   F→G  f854_health_radar 健康雷达 → 消费 status/needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR854Loaded) return;
  RANDOM_EVENTS._domainFLinkageR854Loaded = true;

  var EVENTS = [
    {
      id: "f854_data_overview", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据概览", story: "你的数据正在讲述一个完整的故事——每一个数字,都是你成长的见证。",
      triggers: { minDay: 80, interval: 150, maxRepeats: 3, excludeFlags: ["_f854DataCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._f854DataCd) return false; return st.player && st.player.day >= 80; },
      text: function (st) { if (!st) return null; var d = st.player && st.player.day ? st.player.day : 0; var c = st.resources && isFinite(st.resources.cash) ? Math.round(st.resources.cash) : 0; return "你已度过" + d + "天,存款¥" + c.toLocaleString() + "——'每一个数字,都是你成长的见证。'"; },
      choices: [
        { text: "📈 查看", hint: "心智+20,智力+15,置_f854Tracker",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f854DataCd = true; st.flags._f854Tracker = true; if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 20); st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("📈 '数据是最好的见证者。' 心智+20,智力+15。", "success"); } }
        },
        { text: "🎯 目标", hint: "心智+25,置_f854Goal",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f854DataCd = true; st.flags._f854Goal = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25); if (typeof StateManager !== "undefined") { StateManager.addMessage("🎯 '有目标才有方向。' 心智+25。", "info"); } }
        }
      ]
    },
    {
      id: "f854_event_album", phase: "street", _isChainEvent: false, icon: "📜",
      title: "事件相册", story: "你经历的事件,串联成了一条故事线——每一件事,都改变了你的人生。",
      triggers: { minDay: 150, interval: 200, maxRepeats: 3, excludeFlags: ["_f854AlbumCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._f854AlbumCd) return false; return st.player && st.player.day >= 150; },
      text: function (st) { if (!st) return null; var d = st.player && st.player.day ? st.player.day : 0; return "你已度过" + d + "天——'每一件事,都改变了你的人生。'"; },
      choices: [
        { text: "📖 回顾", hint: "心智+20,魅力+15,置_f854Chronicler",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f854AlbumCd = true; st.flags._f854Chronicler = true; if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 20); st.player.charm = Math.min(100, (st.player.charm || 50) + 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '每一个选择都塑造了今天的你。' 心智+20,魅力+15。", "success"); } }
        },
        { text: "✍️ 记录", hint: "心智+22,置_f854Writer",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f854AlbumCd = true; st.flags._f854Writer = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 22); if (typeof StateManager !== "undefined") { StateManager.addMessage("✍️ '记录当下就是为未来留下礼物。' 心智+22。", "info"); } }
        }
      ]
    },
    {
      id: "f854_health_radar", phase: "street", _isChainEvent: false, icon: "💚",
      title: "健康雷达", story: "健康,是你最需要关注的核心指标——定期检查,才能及时调整。",
      triggers: { minDay: 220, interval: 250, maxRepeats: 4, excludeFlags: ["_f854HealthCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._f854HealthCd) return false; return st.player && st.player.day >= 220 && st.status && st.needs; },
      text: function (st) { if (!st) return null; var h = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100; var f = st.needs && isFinite(st.needs.fatigue) ? Math.round(st.needs.fatigue) : 0; return "健康" + h + "%,疲劳" + f + "——'定期检查,才能及时调整。'"; },
      choices: [
        { text: "🏃 计划", hint: "健康+20,疲劳-20,置_f854Plan",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f854HealthCd = true; st.flags._f854Plan = true; if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 20); if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("🏃 '健康是1,其他都是0。' 健康+20,疲劳-20。", "success"); } }
        },
        { text: "😴 作息", hint: "心情+25,疲劳-15,置_f854Sleep",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._f854HealthCd = true; st.flags._f854Sleep = true; if (st.needs) { st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25); st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15); } if (typeof StateManager !== "undefined") { StateManager.addMessage("😴 '早睡早起精神百倍。' 心情+25,疲劳-15。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
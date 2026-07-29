/**
 * 域B(事件/叙事) 联动增强 R834 (第十六轮循环)
 * 桥接：
 *   B→D  b834_event_relate 事件关联 → 消费 事件+NPC关系
 *   B→E  b834_event_econ 事件经济 → 消费 事件+经济
 *   B→G  b834_event_grow 事件成长 → 消费 事件历史+心智
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR834Loaded) return;
  RANDOM_EVENTS._domainBLinkageR834Loaded = true;

  var EVENTS = [
    {
      id: "b834_event_relate", phase: "street", _isChainEvent: false, icon: "💬",
      title: "事件关联", story: "你经历的事,在朋友间传开了——每一件事,都在编织你的社交网。",
      triggers: { minDay: 100, interval: 180, maxRepeats: 3, excludeFlags: ["_b834RelateCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._b834RelateCd) return false; return st.player && st.player.day >= 100 && st.relationships; },
      text: function (st) { if (!st) return null; return "你经历的事,在朋友间传开了——'每一件事,都在编织你的社交网。'"; },
      choices: [
        { text: "💬 分享", hint: "社交XP+25,魅力+15,置_b834Share",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._b834RelateCd = true; st.flags._b834Share = true; if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15); if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("💬 '分享让快乐加倍。' 社交XP+25,魅力+15。", "success"); } }
        },
        { text: "📝 记录", hint: "心智+20,置_b834Record",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._b834RelateCd = true; st.flags._b834Record = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("📝 '有些事适合自己品味。' 心智+20。", "info"); } }
        }
      ]
    },
    {
      id: "b834_event_econ", phase: "street", _isChainEvent: false, icon: "🌊",
      title: "事件经济", story: "事件会改变市场——每一次波动,都是重新布局的机会。",
      triggers: { minDay: 180, interval: 220, maxRepeats: 3, excludeFlags: ["_b834EconCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._b834EconCd) return false; return st.player && st.player.day >= 180 && st.trade; },
      text: function (st) { if (!st) return null; return "每一次波动,都是重新布局的机会。"; },
      choices: [
        { text: "📊 分析", hint: "智力+22,会计XP+18,置_b834Analyst",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._b834EconCd = true; st.flags._b834Analyst = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 22); if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 18); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📊 '事件驱动市场。' 智力+22,会计XP+18。", "success"); } }
        },
        { text: "💰 机会", hint: "智力+18,置_b834Opportunist",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._b834EconCd = true; st.flags._b834Opportunist = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18); if (typeof StateManager !== "undefined") { StateManager.addMessage("💰 '危机中总有机会。' 智力+18。", "info"); } }
        }
      ]
    },
    {
      id: "b834_event_grow", phase: "street", _isChainEvent: false, icon: "🌱",
      title: "事件成长", story: "每一次经历,都在塑造更强大的你——成长,就在这些事件中。",
      triggers: { minDay: 250, interval: 300, maxRepeats: 4, excludeFlags: ["_b834GrowCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._b834GrowCd) return false; return st.player && st.player.day >= 250 && st.status; },
      text: function (st) { if (!st) return null; var d = st.player && st.player.day ? st.player.day : 0; var m = st.player && isFinite(st.player.mental) ? Math.round(st.player.mental) : 50; return "你已度过" + d + "天,心智" + m + "——'成长就在每一次经历中。'"; },
      choices: [
        { text: "🧘 反思", hint: "心智+25,健康+10,置_b834Reflect",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._b834GrowCd = true; st.flags._b834Reflect = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25); if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 10); if (typeof StateManager !== "undefined") { StateManager.addMessage("🧘 '每一次反思都是一次成长。' 心智+25,健康+10。", "success"); } }
        },
        { text: "📈 总结", hint: "智力+20,置_b834Learn",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._b834GrowCd = true; st.flags._b834Learn = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("📈 '经验是最好的老师。' 智力+20。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
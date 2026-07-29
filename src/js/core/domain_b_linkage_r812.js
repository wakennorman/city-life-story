/**
 * 域B(事件/叙事) 联动增强 R812 (第十二轮循环)
 * 桥接：
 *   B→D  b812_event_social_echo 事件社交回声 → 消费 事件数据+NPC关系
 *   B→E  b812_event_market_ripple 事件市场涟漪 → 消费 事件+经济
 *   B→G  b812_event_growth_wisdom 事件成长智慧 → 消费 事件历史+心智
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR812Loaded) return;
  RANDOM_EVENTS._domainBLinkageR812Loaded = true;

  var EVENTS = [
    // ====== B→D 事件社交回声 ======
    {
      id: "b812_event_social_echo", phase: "street", _isChainEvent: false, icon: "🔊",
      title: "事件社交回声",
      story: "你经历的事,在朋友间传开了——好事坏事,都有人在听。",
      triggers: { minDay: 200, interval: 300, maxRepeats: 3, excludeFlags: ["_b812SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b812SocialCd) return false;
        return st.player && st.player.day >= 200 && st.relationships;
      },
      text: function (st) {
        if (!st) return null;
        return "你经历的事,在朋友间传开了——'好事坏事,都有人在听。'";
      },
      choices: [
        {
          text: "💬 和朋友分享", hint: "社交XP+25,魅力+15,置_b812Share",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b812SocialCd = true;
            st.flags._b812Share = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💬 '分享,让快乐加倍,让痛苦减半。' 社交XP+25,魅力+15。", "success");
            }
          }
        },
        {
          text: "📝 默默记录", hint: "心智+20,置_b812Record",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b812SocialCd = true;
            st.flags._b812Record = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 '有些事,适合自己慢慢品味。' 心智+20。", "info");
            }
          }
        }
      ]
    },

    // ====== B→E 事件市场涟漪 ======
    {
      id: "b812_event_market_ripple", phase: "street", _isChainEvent: false, icon: "🌊",
      title: "事件市场涟漪",
      story: "有些事件会引发经济波动——看懂连锁反应,就能把握机会。",
      triggers: { minDay: 300, interval: 350, maxRepeats: 3, excludeFlags: ["_b812MarketCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b812MarketCd) return false;
        return st.player && st.player.day >= 300 && st.trade;
      },
      text: function (st) {
        if (!st) return null;
        return "每一次事件,都可能改变市场——'看懂连锁反应,就能把握机会。'";
      },
      choices: [
        {
          text: "📊 分析市场影响", hint: "智力+22,会计XP+18,置_b812MarketAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b812MarketCd = true;
            st.flags._b812MarketAnalyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 22);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '事件驱动市场,市场驱动机会。' 智力+22,会计XP+18。", "success");
            }
          }
        },
        {
          text: "💰 寻找投资机会", hint: "智力+18,管理XP+15,置_b812Opportunist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b812MarketCd = true;
            st.flags._b812Opportunist = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '危机中,总有机会。' 智力+18,管理XP+15。", "info");
            }
          }
        }
      ]
    },

    // ====== B→G 事件成长智慧 ======
    {
      id: "b812_event_growth_wisdom", phase: "street", _isChainEvent: false, icon: "🌱",
      title: "事件成长智慧",
      story: "每一次经历,都在塑造更强大的你——成长,就在这些事件中。",
      triggers: { minDay: 400, interval: 400, maxRepeats: 4, excludeFlags: ["_b812GrowthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b812GrowthCd) return false;
        return st.player && st.player.day >= 400 && st.status;
      },
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        var mental = st.player && isFinite(st.player.mental) ? Math.round(st.player.mental) : 50;
        return "你已度过" + days + "天,心智" + mental + "——'成长,就在每一次经历中。'";
      },
      choices: [
        {
          text: "🧘 反思成长", hint: "心智+25,健康+10,置_b812Reflect",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b812GrowthCd = true;
            st.flags._b812Reflect = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '每一次反思,都是一次成长。' 心智+25,健康+10。", "success");
            }
          }
        },
        {
          text: "📈 总结经验", hint: "智力+20,置_b812Learn",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b812GrowthCd = true;
            st.flags._b812Learn = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '经验是最好的老师。' 智力+20。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
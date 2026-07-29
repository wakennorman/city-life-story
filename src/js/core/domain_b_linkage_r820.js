/**
 * 域B(事件/叙事) 联动增强 R820 (第十四轮循环)
 * 桥接：
 *   B→D  b820_event_social_story 事件社交故事 → 消费 事件+NPC关系
 *   B→E  b820_event_market_insight 事件市场洞察 → 消费 事件+经济
 *   B→G  b820_event_growth_lesson 事件成长教训 → 消费 事件历史+心智
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR820Loaded) return;
  RANDOM_EVENTS._domainBLinkageR820Loaded = true;

  var EVENTS = [
    {
      id: "b820_event_social_story", phase: "street", _isChainEvent: false, icon: "💬",
      title: "事件社交故事",
      story: "你经历的事,成了朋友间的谈资——每一个故事,都在拉近你们的距离。",
      triggers: { minDay: 150, interval: 250, maxRepeats: 3, excludeFlags: ["_b820SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b820SocialCd) return false;
        return st.player && st.player.day >= 150 && st.relationships;
      },
      text: function (st) {
        if (!st) return null;
        return "你经历的事,成了朋友间的谈资——'每一个故事,都在拉近你们的距离。'";
      },
      choices: [
        {
          text: "💬 分享故事", hint: "社交XP+25,魅力+15,置_b820Share",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b820SocialCd = true;
            st.flags._b820Share = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💬 '分享,让快乐加倍。' 社交XP+25,魅力+15。", "success");
            }
          }
        },
        {
          text: "📝 默默记录", hint: "心智+20,置_b820Record",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b820SocialCd = true;
            st.flags._b820Record = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 '有些事,适合自己慢慢品味。' 心智+20。", "info");
            }
          }
        }
      ]
    },
    {
      id: "b820_event_market_insight", phase: "street", _isChainEvent: false, icon: "🌊",
      title: "事件市场洞察",
      story: "事件会改变市场——看懂连锁反应,就能把握先机。",
      triggers: { minDay: 250, interval: 300, maxRepeats: 3, excludeFlags: ["_b820MarketCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b820MarketCd) return false;
        return st.player && st.player.day >= 250 && st.trade;
      },
      text: function (st) {
        if (!st) return null;
        return "每一次事件,都可能改变市场——'看懂连锁反应,就能把握先机。'";
      },
      choices: [
        {
          text: "📊 分析市场影响", hint: "智力+22,会计XP+18,置_b820MarketAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b820MarketCd = true;
            st.flags._b820MarketAnalyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 22);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 18); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '事件驱动市场,市场驱动机会。' 智力+22,会计XP+18。", "success");
            }
          }
        },
        {
          text: "💰 寻找机会", hint: "智力+18,管理XP+15,置_b820Opportunist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b820MarketCd = true;
            st.flags._b820Opportunist = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '危机中,总有机会。' 智力+18,管理XP+15。", "info");
            }
          }
        }
      ]
    },
    {
      id: "b820_event_growth_lesson", phase: "street", _isChainEvent: false, icon: "🌱",
      title: "事件成长教训",
      story: "每一次经历,都在塑造更强大的你——成长,就在这些教训中。",
      triggers: { minDay: 350, interval: 400, maxRepeats: 4, excludeFlags: ["_b820GrowthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b820GrowthCd) return false;
        return st.player && st.player.day >= 350 && st.status;
      },
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        var mental = st.player && isFinite(st.player.mental) ? Math.round(st.player.mental) : 50;
        return "你已度过" + days + "天,心智" + mental + "——'成长,就在每一次经历中。'";
      },
      choices: [
        {
          text: "🧘 反思成长", hint: "心智+25,健康+10,置_b820Reflect",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b820GrowthCd = true;
            st.flags._b820Reflect = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '每一次反思,都是一次成长。' 心智+25,健康+10。", "success");
            }
          }
        },
        {
          text: "📈 总结经验", hint: "智力+20,置_b820Learn",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b820GrowthCd = true;
            st.flags._b820Learn = true;
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
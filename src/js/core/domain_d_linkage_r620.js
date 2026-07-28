/**
 * 域D(NPC/社交) 联动增强 R620
 * 桥接：
 *   D→A  d620_social_price_intel  社交价格情报 → 消费 state.relationships+state.trade 数据,
 *     社交→"熟人价"的数据回响
 *   D→C  d620_referral_boost  内推加成 → 消费 state.relationships+state.skills 数据,
 *     社交→"贵人相助"的职业回响
 *   D→G  d620_belonging_ritual  归属感仪式 → 消费 state.relationships+state.needs 数据,
 *     社交→"此心安处是吾乡"的生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR620Loaded) return;
  RANDOM_EVENTS._domainDLinkageR620Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR620(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "d620_social_price_intel", phase: "street", _isChainEvent: false, icon: "🏷️",
      title: "熟人价的情报",
      story: "老朋友告诉你一个省钱的门道——{desc}",
      triggers: { minDay: 40, interval: 100, maxRepeats: 3, excludeFlags: ["_d620PriceIntelCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d620PriceIntelCooldown) return false;
        var met = metNpcsR620(st);
        return met.length >= 1 && met[0].affinity >= 30;
      },
      choices: [
        { text: "🛒 记下门道", hint: "心智+2,置_d620PriceIntel", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d620PriceIntelCooldown = true;
          st.flags._d620PriceIntel = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛒 '这个消息能省不少钱。' 你记下了门道。心智+2,获得价格情报。", "success");
        }},
        { text: "🤝 分享回报", hint: "好感+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d620PriceIntelCooldown = true;
          var met = metNpcsR620(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "分享回报"); } catch(e) {}
          }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '有来有往,朋友才长久。' 你分享了其他情报作为回报。好感+5,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR620(st);
        var npcName = met.length > 0 ? met[0].name : "老朋友";
        return npcName + "告诉你一个省钱的门道——'那边菜市场下午快收摊的时候去买,便宜一半。在这座城市里,信息就是钱。'";
      }
    },
    {
      id: "d620_referral_boost", phase: "street", _isChainEvent: false, icon: "🚀",
      title: "贵人内推",
      story: "一个熟人愿意为你的职业前途助力——{desc}",
      triggers: { minDay: 80, interval: 180, maxRepeats: 2, excludeFlags: ["_d620ReferralCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d620ReferralCooldown) return false;
        var met = metNpcsR620(st);
        var highAff = 0;
        for (var i = 0; i < met.length; i++) { if (met[i].affinity >= 50) highAff++; }
        return highAff >= 1;
      },
      choices: [
        { text: "🎯 接受推荐", hint: "管理XP+6,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d620ReferralCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
          var met = metNpcsR620(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "内推助力"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '多亏你帮忙。' 你接受了内推,事业更进一步。管理XP+6,好感+3。", "success");
        }},
        { text: "💪 自己闯", hint: "心智+5,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d620ReferralCooldown = true;
          if (st.player) {
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '谢谢好意,我想自己试试。' 你选择自己闯。心智+5,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR620(st);
        var npcName = met.length > 0 ? met[0].name : "熟人";
        return npcName + "愿意为你的职业前途助力——'我那边认识人,可以帮你递个话。在这座城市里,有人愿意帮你,是最大的幸运。'";
      }
    },
    {
      id: "d620_belonging_ritual", phase: "street", _isChainEvent: false, icon: "🏠",
      title: "此心安处是吾乡",
      story: "在这座城市里扎下根来,你开始有了归属感——{desc}",
      triggers: { minDay: 200, interval: 365, maxRepeats: 1, excludeFlags: ["_d620BelongingDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d620BelongingDone) return false;
        var met = metNpcsR620(st);
        var totalAff = 0;
        for (var i = 0; i < met.length; i++) { totalAff += met[i].affinity; }
        return met.length >= 5 && totalAff >= 200;
      },
      choices: [
        { text: "🎉 办个聚会", hint: "心情+10,全已结识NPC好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d620BelongingDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          var met = metNpcsR620(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 3, "归属感聚会"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 '有朋自远方来,不亦乐乎。' 你办了场聚会,宾主尽欢。心情+10,全NPC好感+3。", "success");
        }},
        { text: "📖 写下感悟", hint: "心智+8,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d620BelongingDone = true;
          if (st.player) {
            st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '此心安处是吾乡。' 你写下这些年的感悟。心智+8,智力+3。", "success");
        }},
        { text: "🤫 默默感恩", hint: "心情+6,心智+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d620BelongingDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 '大恩不言谢。' 你默默感恩这些陪伴。心情+6,心智+6。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR620(st);
        return "在这座城市里扎下根来,你已结识" + met.length + "位朋友——'此心安处是吾乡。' 你感受到了久违的归属感。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

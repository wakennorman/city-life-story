/**
 * 域D(NPC/社交) 联动增强 R465（第二十四轮循环）
 * 桥接：
 *   D→F  d465_social_ui_insight   社交UI洞察 → 消费 relationships 数据,
 *     关系网→"你的社交圈长什么样"的UI展示
 *   D→H  d465_npc_business_intro   NPC生意介绍 → 消费 relationships+corporate 数据,
 *     好感→"老关系介绍新生意"的创业桥接
 *   D→E  d465_npc_invest_tip       NPC投资情报 → 消费 relationships+investment 数据,
 *     熟人→"内部消息"的投资情报
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR465Loaded) return;
  RANDOM_EVENTS._domainDLinkageR465Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "d465_social_ui_insight", phase: "street", _isChainEvent: false, icon: "🕸️",
      title: "社交图谱",
      story: "你看了看自己的社交关系网——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_d465SocialUiCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var count = 0;
        for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) count++; }
        return count >= 3 && (st.flags && !st.flags._d465SocialUiCooldown);
      },
      choices: [
        { text: "📊 分析关系结构", hint: "智力+2,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d465SocialUiCooldown = true;
          if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了社交关系网——'人脉就是钱脉。' 智力+2,心智+2。", "success");
        }},
        { text: "💝 主动维护弱关系", hint: "好感+3(最低者),心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d465SocialUiCooldown = true;
          var lowest = null, lowestAff = 999;
          for (var k in st.relationships) {
            if (st.relationships[k] && st.relationships[k].met) {
              var aff = st.relationships[k].affinity || 0;
              if (aff < lowestAff) { lowestAff = aff; lowest = k; }
            }
          }
          bumpAffinity(st, lowest, 3, "主动维护");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 你主动维护了最弱的关系——'患难见真情。' 好感+3,心情+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var count = 0;
        for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) count++; }
        return "你看了看自己的社交关系网——已经认识了" + count + "个人。每一条线都是一段故事，每一个人都是你人生的一部分。";
      }
    },
    {
      id: "d465_npc_business_intro", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "老关系",
      story: "一位老朋友给你介绍了一个生意机会——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 3, excludeFlags: ["_d465BusinessCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        if (!st.relationships) return false;
        var hasHigh = false;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 60) { hasHigh = true; break; }
        }
        return hasHigh && (st.flags && !st.flags._d465BusinessCooldown);
      },
      choices: [
        { text: "💼 认真对接", hint: "公司资金+5000,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d465BusinessCooldown = true;
          if (st.corporate && st.corporate.company) st.corporate.company.funds = (st.corporate.company.funds || 0) + 5000;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 3, "生意介绍");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 你认真对接了老朋友介绍的生意——'人脉就是钱脉。' 公司资金+5000,好感+3。", "success");
        }},
        { text: "🙏 婉拒好意", hint: "心智+2,道德+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d465BusinessCooldown = true;
          if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 2); st.player.morality = Math.min(100, (st.player.morality || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙏 你婉拒了——'有些关系，不想掺杂利益。' 心智+2,道德+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一位老朋友给你介绍了一个生意机会——在职场混了这么多年，你终于体会到'关系就是资源'这句话的分量。";
      }
    },
    {
      id: "d465_npc_invest_tip", phase: "street", _isChainEvent: false, icon: "💡",
      title: "内部消息",
      story: "一个朋友给你透露了一个投资情报——{desc}",
      triggers: { minDay: 60, interval: 100, maxRepeats: 3, excludeFlags: ["_d465InvestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships || !st.investment) return false;
        var hasHigh = false;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 50) { hasHigh = true; break; }
        }
        return hasHigh && (st.flags && !st.flags._d465InvestCooldown);
      },
      choices: [
        { text: "💰 跟着投一点", hint: "现金+200~600,风险+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d465InvestCooldown = true;
          var profit = typeof Random !== "undefined" ? Random.int(200, 600) : 400;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + profit;
          if (st.player) st.player.risk = Math.min(100, (st.player.risk || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你跟着投了一点——'跟着懂行人走，不会太差。' 现金+" + profit + "。", "success");
        }},
        { text: "🧐 自己分析", hint: "会计XP+3,智力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d465InvestCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧐 你决定自己分析——'别人的消息只是参考。' 会计XP+3,智力+1。", "success");
        }},
        { text: "🚫 不碰内幕", hint: "道德+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d465InvestCooldown = true;
          if (st.player) { st.player.morality = Math.min(100, (st.player.morality || 50) + 5); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚫 你决定不碰内幕——'君子爱财，取之有道。' 道德+5,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一个朋友给你透露了一个投资情报——'内部消息'四个字让人兴奋，但也让人警惕。你决定怎么处理这个信息？";
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

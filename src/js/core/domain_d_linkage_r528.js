/**
 * 域D(NPC/社交) 联动增强 R528
 * 桥接：
 *   D→G  d528_npc_weather_care  NPC天气关怀 → 消费 relationships 数据,
 *     天气→"天冷了，多穿点"的关心叙事
 *   D→C  d528_npc_job_referral  NPC工作推荐 → 消费 relationships 数据,
 *     内推→"朋友的公司正在招人"的内推机会
 *   D→E  d528_npc_fund_idea    NPC资金想法 → 消费 relationships 数据,
 *     创业→"朋友有个创业想法"的合伙叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR528Loaded) return;
  RANDOM_EVENTS._domainDLinkageR528Loaded = true;

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
      id: "d528_npc_weather_care", phase: "street", _isChainEvent: false, icon: "🌡️",
      title: "天冷加衣",
      story: "朋友发来一条消息提醒你注意天气——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 5, excludeFlags: ["_d528WeatherCareCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d528WeatherCareCooldown);
      },
      choices: [
        { text: "🌡️ 暖心回复", hint: "好感+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d528WeatherCareCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "关心天气");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌡️ '你也是，别感冒了！' 相互关心的感觉，温暖了这座城市寒冷的冬天。好感+2,心情+2。", "success");
        }},
        { text: "☕ 约TA喝热饮", hint: "好感+3,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d528WeatherCareCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "约喝热饮");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌡️ '走，请你喝杯热咖啡暖暖身子！' 好感+3,心情+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友发来一条消息提醒你注意天气——'天气预报说今天要降温，多穿点。' 有人惦记的感觉，真好。";
      }
    },
    {
      id: "d528_npc_job_referral", phase: "street", _isChainEvent: false, icon: "📋",
      title: "内推机会",
      story: "朋友说TA公司正在招人——{desc}",
      triggers: { minDay: 25, interval: 90, maxRepeats: 3, excludeFlags: ["_d528JobReferralCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._d528JobReferralCooldown);
      },
      choices: [
        { text: "📋 去看看", hint: "管理XP+4,社交XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d528JobReferralCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "内推工作");
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 '我们公司正在招人，我觉得你挺合适的！' 内推，是最靠谱的求职方式。管理XP+4,社交XP+3,好感+2。", "success");
        }},
        { text: "🙏 谢谢TA", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d528JobReferralCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "感谢推荐");
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 '谢谢！我暂时不打算换工作，但以后有需要一定找你。' 好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友说TA公司正在招人——'我觉得你挺适合的，要不要我帮你内推？' 有一个愿意帮你内推的朋友，是职场上最大的幸运。";
      }
    },
    {
      id: "d528_npc_fund_idea", phase: "street", _isChainEvent: false, icon: "💡",
      title: "创业想法",
      story: "朋友有个创业想法，想找你一起——{desc}",
      triggers: { minDay: 35, interval: 120, maxRepeats: 3, excludeFlags: ["_d528FundIdeaCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._d528FundIdeaCooldown);
      },
      choices: [
        { text: "💡 认真评估", hint: "管理XP+5,会计XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d528FundIdeaCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "一起评估创业想法");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '这个想法不错，但需要验证一下市场。' 你和朋友一起做了市场调研。管理XP+5,会计XP+3,好感+2。", "success");
        }},
        { text: "🤝 愿意投资", hint: "社交XP+3,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d528FundIdeaCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "支持创业想法");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '我相信你，算我一份！' 朋友被你感动了。社交XP+3,好感+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友有个创业想法，想找你一起——'我有一个改变世界的想法，就差一个程序员/合伙人了！' 你笑了笑，认真听了TA的想法。";
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
/**
 * 域F(UI/UX) 联动增强 R552
 * 桥接：
 *   F→H  f552_corp_insight_ui   公司洞察UI → 消费 corporate 数据,
 *     洞察→"公司运营数据洞察"的智能分析
 *   F→D  f552_social_discover_ui 社交发现UI → 消费 relationships 数据,
 *     发现→"发现新朋友"的社交推荐
 *   F→G  f552_life_goal_ui      人生目标UI → 消费 player+needs 数据,
 *     目标→"你的人生目标清单"的目标管理
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR552Loaded) return;
  RANDOM_EVENTS._domainFLinkageR552Loaded = true;

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
      id: "f552_corp_insight_ui", phase: "corporate", _isChainEvent: false, icon: "💡",
      title: "智能洞察",
      story: "AI分析了你的公司数据，给出了洞察——{desc}",
      triggers: { minDay: 40, interval: 60, maxRepeats: 5, excludeFlags: ["_f552CorpInsightCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._f552CorpInsightCooldown);
      },
      choices: [
        { text: "💡 采纳建议", hint: "管理XP+5,公司资金+3000,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f552CorpInsightCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate && st.corporate.company) st.corporate.company.funds = (st.corporate.company.funds || 0) + 3000;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 'AI洞察发现，周末是客户活跃度最高的时段。' 管理XP+5,公司资金+¥3000,心智+2。", "success");
        }},
        { text: "📊 看更多数据", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f552CorpInsightCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '数据还有很多值得挖掘的地方。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "AI分析了你的公司数据，给出了洞察——'根据数据分析，建议你关注XX方向。' 数据驱动的决策，越来越重要了。";
      }
    },
    {
      id: "f552_social_discover_ui", phase: "street", _isChainEvent: false, icon: "🔍",
      title: "发现新朋友",
      story: "系统推荐了一些你可能认识的人——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_f552SocialDiscoverCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f552SocialDiscoverCooldown);
      },
      choices: [
        { text: "🔍 加好友", hint: "社交XP+3,好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f552SocialDiscoverCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "新朋友");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔍 '你好，我是XX的朋友，很高兴认识你！' 社交XP+3,好感+1。", "success");
        }},
        { text: "👀 先看看", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f552SocialDiscoverCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔍 '先看看TA的朋友圈，了解一下。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "系统推荐了一些你可能认识的人——'你们有3个共同好友，可能认识。' 世界真小，到处都有熟人。";
      }
    },
    {
      id: "f552_life_goal_ui", phase: "street", _isChainEvent: false, icon: "🎯",
      title: "人生目标",
      story: "你设定了新的人生目标——{desc}",
      triggers: { minDay: 15, interval: 60, maxRepeats: 5, excludeFlags: ["_f552LifeGoalCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f552LifeGoalCooldown);
      },
      choices: [
        { text: "🎯 努力实现", hint: "管理XP+4,心智+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f552LifeGoalCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '有了目标，就有了方向。' 管理XP+4,心智+2,心情+2。", "success");
        }},
        { text: "📝 细化步骤", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f552LifeGoalCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '把大目标分解成小步骤，更容易实现。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你设定了新的人生目标——'今年要存够XX万，学会XX技能，去XX旅行。' 有目标的人生，不会迷茫。";
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
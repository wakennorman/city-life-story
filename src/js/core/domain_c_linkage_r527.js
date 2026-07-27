/**
 * 域C(职业/成长) 联动增强 R527
 * 桥接：
 *   C→F  c527_career_portfolio_ui 职业作品集UI → 消费 skills 数据,
 *     展示→"你的职业作品集"的UI展示
 *   C→D  c527_career_peer_review 职业同行评议 → 消费 skills+relationships 数据,
 *     反馈→"同行眼中的你"的职业评价
 *   C→G  c527_career_sabbatical  职业休假 → 消费 skills+needs 数据,
 *     休息→"工作久了，给自己放个假"的休假叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR527Loaded) return;
  RANDOM_EVENTS._domainCLinkageR527Loaded = true;

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
      id: "c527_career_portfolio_ui", phase: "corporate", _isChainEvent: false, icon: "📁",
      title: "作品集",
      story: "你整理了自己的职业作品集——{desc}",
      triggers: { minDay: 25, interval: 90, maxRepeats: 3, excludeFlags: ["_c527PortfolioCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._c527PortfolioCooldown);
      },
      choices: [
        { text: "📁 展示出来", hint: "管理XP+4,名气+2,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c527PortfolioCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📁 '我的作品集，就是最好的简历。' 管理XP+4,名气+2,心智+1。", "success");
        }},
        { text: "📝 补充完善", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c527PortfolioCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📁 '作品集还不够完善，再补充一些项目。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你整理了自己的职业作品集——'这些都是我做过的东西。' 看着过去的作品，你感慨万千。";
      }
    },
    {
      id: "c527_career_peer_review", phase: "corporate", _isChainEvent: false, icon: "👥",
      title: "同行评价",
      story: "同行对你的工作给出了评价——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_c527PeerReviewCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c527PeerReviewCooldown);
      },
      choices: [
        { text: "👥 虚心接受", hint: "管理XP+5,社交XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c527PeerReviewCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "同行交流");
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 '你的这个项目做得很好，但如果在XX方面改进一下会更好。' 管理XP+5,社交XP+3,好感+2。", "success");
        }},
        { text: "📝 记下建议", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c527PeerReviewCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 '同行提的建议很有价值，记下来慢慢消化。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "同行对你的工作给出了评价——'你们团队最近做的项目很有创意。' 被同行认可，是最好的成就感。";
      }
    },
    {
      id: "c527_career_sabbatical", phase: "corporate", _isChainEvent: false, icon: "🏖️",
      title: "休假",
      story: "你决定给自己放个长假——{desc}",
      triggers: { minDay: 50, interval: 180, maxRepeats: 3, excludeFlags: ["_c527SabbaticalCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c527SabbaticalCooldown);
      },
      choices: [
        { text: "🏖️ 去旅行", hint: "心情+5,健康+2,疲劳-5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c527SabbaticalCooldown = true;
          if (st.needs) { st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5); st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5); }
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏖️ '世界那么大，我想去看看。' 你踏上了旅途。心情+5,健康+2,疲劳-5。", "success");
        }},
        { text: "🏠 在家休息", hint: "疲劳-5,健康+1,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c527SabbaticalCooldown = true;
          if (st.needs) { st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5); st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2); }
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏖️ '哪里都不去，就在家躺着。' 疲劳-5,健康+1,心情+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你决定给自己放个长假——'工作这么多年，第一次给自己放这么长的假。' 休息，是为了走更远的路。";
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
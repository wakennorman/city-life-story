/**
 * 域H(Phase2/公司) 联动增强 R592
 * 桥接：
 *   H→B  h592_corp_industry_rank 公司行业排名 → 消费 corporate 数据,
 *     排名→"公司行业排名提升"的成就叙事
 *   H→D  h592_corp_social_event 公司社交活动 → 消费 corporate+relationships 数据,
 *     活动→"公司组织的社交活动"的商务社交
 *   H→G  h592_corp_work_stress 公司工作压力 → 消费 corporate+needs 数据,
 *     压力→"工作压力管理"的健康叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR592Loaded) return;
  RANDOM_EVENTS._domainHLinkageR592Loaded = true;

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
      id: "h592_corp_industry_rank", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "行业排名",
      story: "公司的行业排名上升了——{desc}",
      triggers: { minDay: 50, interval: 180, maxRepeats: 3, excludeFlags: ["_h592IndustryRankCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h592IndustryRankCooldown);
      },
      choices: [
        { text: "🏆 庆祝成就", hint: "管理XP+5,公司知名度+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h592IndustryRankCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 '公司在行业排名中上升了X位，这是大家共同努力的结果！' 管理XP+5,公司知名度+3,心情+2。", "success");
        }},
        { text: "📊 分析原因", hint: "会计XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h592IndustryRankCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 '分析排名上升的原因，找出可以复制的成功经验。' 会计XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司的行业排名上升了——'从第X名上升到了第X名！' 排名上升，是对团队努力的最好肯定。";
      }
    },
    {
      id: "h592_corp_social_event", phase: "corporate", _isChainEvent: false, icon: "🎪",
      title: "商务社交活动",
      story: "公司组织了一场商务社交活动——{desc}",
      triggers: { minDay: 35, interval: 120, maxRepeats: 3, excludeFlags: ["_h592SocialEventCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._h592SocialEventCooldown);
      },
      choices: [
        { text: "🎪 积极参与", hint: "社交XP+5,公司知名度+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h592SocialEventCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 3);
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "商务社交");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎪 '商务社交活动上认识了很多潜在的合作伙伴。' 社交XP+5,公司知名度+3,好感+2。", "success");
        }},
        { text: "📋 组织活动", hint: "管理XP+3,社交XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h592SocialEventCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎪 '你参与了活动的组织工作，活动很成功。' 管理XP+3,社交XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司组织了一场商务社交活动——'邀请了行业内的合作伙伴和潜在客户。' 商务社交，是拓展业务的重要方式。";
      }
    },
    {
      id: "h592_corp_work_stress", phase: "corporate", _isChainEvent: false, icon: "😰",
      title: "工作压力",
      story: "你发现团队的工作压力有点大——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_h592WorkStressCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._h592WorkStressCooldown);
      },
      choices: [
        { text: "😰 减压措施", hint: "管理XP+4,团队忠诚+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h592WorkStressCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 2); } }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😰 '给团队安排了减压活动，大家都很开心。' 管理XP+4,团队忠诚+2,心情+2。", "success");
        }},
        { text: "📊 评估工作量", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h592WorkStressCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("😰 '重新评估工作量分配，避免过度加班。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现团队的工作压力有点大——'最近加班越来越多了，大家的情绪有些低落。' 工作压力管理，是管理者的重要职责。";
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
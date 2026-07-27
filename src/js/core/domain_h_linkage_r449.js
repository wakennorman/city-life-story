/**
 * 域H(Phase2/公司) 联动增强 R449（第二轮循环）
 * 桥接：
 *   H→A  h449_corp_data_insight    公司数据洞察 → 消费 corporate+resources 数据,
 *     经营数据→"公司赚了多少花了多少"的财务数据积累
 *   H→C  h449_corp_skill_growth    公司技能成长 → 消费 corporate+team 数据,
 *     带团队→"管理是最好的实践"的领导力成长
 *   H→D  h449_corp_social_circle   公司社交圈 → 消费 corporate+relationships 数据,
 *     公司社交→"生意场上交朋友"的商务社交叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR449Loaded) return;
  RANDOM_EVENTS._domainHLinkageR449Loaded = true;

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
    // H→A: 公司数据洞察
    {
      id: "h449_corp_data_insight", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "公司财报",
      story: "财务把季度的报表放在你桌上——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 5, excludeFlags: ["_h449CorpDataCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h449CorpDataCooldown);
      },
      choices: [
        { text: "🔍 仔细审阅", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h449CorpDataCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你仔细审阅了公司的季度财报——收入、成本、利润，每一行数字都在讲述公司的故事。会计XP+5,心智+2。", "success");
        }},
        { text: "👀 扫一眼签字", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h449CorpDataCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "财务把季度的报表放在你桌上——密密麻麻的数字，但你知道，每一个数字背后都是团队的汗水。";
      }
    },
    // H→C: 公司技能成长
    {
      id: "h449_corp_skill_growth", phase: "corporate", _isChainEvent: false, icon: "📚",
      title: "管理即修行",
      story: "带团队的时间越久，你越发现——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 5, excludeFlags: ["_h449SkillGrowthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._h449SkillGrowthCooldown);
      },
      choices: [
        { text: "📚 参加管理培训", hint: "管理XP+5,社交XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h449SkillGrowthCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 你参加了一个管理培训课程——学到了很多带团队的方法论。管理XP+5,社交XP+2。", "success");
        }},
        { text: "👥 在实践中学习", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h449SkillGrowthCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 你决定在实践中学习——每个管理难题都是最好的老师。管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "带团队的时间越久，你越发现——管理不是管别人，而是修自己。";
      }
    },
    // H→D: 公司社交圈
    {
      id: "h449_corp_social_circle", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "商务社交",
      story: "生意场上，你遇到了几个有趣的人——{desc}",
      triggers: { minDay: 50, interval: 90, maxRepeats: 3, excludeFlags: ["_h449SocialCircleCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h449SocialCircleCooldown);
      },
      choices: [
        { text: "🤝 交换联系方式", hint: "社交XP+5,公司知名度+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h449SocialCircleCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "商务场合认识，互换了联系方式");
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你在商务场合认识了几个新朋友——交换了名片，加了微信。这些人脉，未来可能价值连城。社交XP+5,公司知名度+2。", "success");
        }},
        { text: "🍷 酒桌上加深感情", hint: "好感+3,公司知名度+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h449SocialCircleCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 3, "酒桌上推杯换盏，关系拉近了");
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 酒过三巡，气氛热络了起来——生意场上，酒桌文化虽然老套，但确实管用。好感+3,公司知名度+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "生意场上，你遇到了几个有趣的人——有人是同行，有人是客户，有人可能是未来的合伙人。";
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
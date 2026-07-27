/**
 * 域H(Phase2/公司) 联动增强 R524
 * 桥接：
 *   H→B  h524_corp_industry_voice 公司行业声音 → 消费 corporate 数据,
 *     影响力→"公司成为行业标杆"的影响力叙事
 *   H→D  h524_corp_partner_network 公司合作伙伴 → 消费 corporate+relationships 数据,
 *     合作→"找到对的合作伙伴"的生态叙事
 *   H→G  h524_corp_founder_story  创始人故事 → 消费 corporate+player 数据,
 *     初心→"从0到1的创业故事"的完整叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR524Loaded) return;
  RANDOM_EVENTS._domainHLinkageR524Loaded = true;

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
      id: "h524_corp_industry_voice", phase: "corporate", _isChainEvent: false, icon: "📢",
      title: "行业声音",
      story: "公司在行业内的影响力越来越大了——{desc}",
      triggers: { minDay: 65, interval: 180, maxRepeats: 3, excludeFlags: ["_h524IndustryVoiceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h524IndustryVoiceCooldown);
      },
      choices: [
        { text: "📢 发表观点", hint: "管理XP+5,公司知名度+5,名气+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h524IndustryVoiceCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 5);
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📢 '我们在行业峰会上发表了演讲，反响很好。' 管理XP+5,公司知名度+5,名气+3。", "success");
        }},
        { text: "📝 写行业文章", hint: "管理XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h524IndustryVoiceCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📢 你写了一篇行业分析文章——'分享知识，也是建立影响力。' 管理XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司在行业内的影响力越来越大了——'最近好几个媒体来约采访。' 从无名小卒到行业标杆，这条路走了很久。";
      }
    },
    {
      id: "h524_corp_partner_network", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "合作伙伴",
      story: "一家公司想和你建立战略合作——{desc}",
      triggers: { minDay: 50, interval: 180, maxRepeats: 3, excludeFlags: ["_h524PartnerNetworkCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h524PartnerNetworkCooldown);
      },
      choices: [
        { text: "🤝 达成合作", hint: "管理XP+5,社交XP+3,公司资金+5000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h524PartnerNetworkCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (st.corporate && st.corporate.company) st.corporate.company.funds = (st.corporate.company.funds || 0) + 5000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '合作共赢，一起把市场做大。' 管理XP+5,社交XP+3,公司资金+¥5000。", "success");
        }},
        { text: "📋 审慎评估", hint: "会计XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h524PartnerNetworkCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '先评估一下合作方的背景和实力，再决定。' 会计XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一家公司想和你建立战略合作——'我们优势互补，一起合作肯定能做大。' 你开始认真考虑这个提议。";
      }
    },
    {
      id: "h524_corp_founder_story", phase: "corporate", _isChainEvent: false, icon: "📖",
      title: "创始人的故事",
      story: "你回顾了从0到1的整个创业历程——{desc}",
      triggers: { minDay: 75, interval: 360, maxRepeats: 2, excludeFlags: ["_h524FounderStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h524FounderStoryCooldown);
      },
      choices: [
        { text: "📖 写回忆录", hint: "管理XP+5,心智+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h524FounderStoryCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '从0到1，从一个人到一群人，从想法到公司。' 你开始写自己的创业回忆录。管理XP+5,心智+4,心情+3。", "success");
        }},
        { text: "🗣️ 分享给团队", hint: "管理XP+3,团队忠诚+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h524FounderStoryCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 3); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '这是我的故事，也是公司的故事。' 你分享给了团队。管理XP+3,团队忠诚+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你回顾了从0到1的整个创业历程——'当初只有一个想法，现在有了一个团队、一家公司。' 这条路，走得不容易，但值得。";
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
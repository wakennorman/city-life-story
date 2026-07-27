/**
 * 域H(Phase2/公司) 联动增强 R487
 * 桥接：
 *   H→B  h487_corp_legend        公司传奇 → 消费 corporate 数据,
 *     公司故事→"从0到1的创业传奇"的品牌叙事
 *   H→D  h487_corp_social_resp   公司社会责任 → 消费 corporate+resources 数据,
 *     公司大了→"回馈社会"的公益叙事
 *   H→G  h487_corp_founder_life  创始人生活 → 消费 corporate+needs 数据,
 *     事业有成→"有钱了，但快乐吗"的人生反思
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR487Loaded) return;
  RANDOM_EVENTS._domainHLinkageR487Loaded = true;

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
      id: "h487_corp_legend", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "创业传奇",
      story: "你的创业故事被媒体报道了——{desc}",
      triggers: { minDay: 80, interval: 180, maxRepeats: 3, excludeFlags: ["_h487CorpLegendCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h487CorpLegendCooldown);
      },
      choices: [
        { text: "🏆 接受采访", hint: "管理XP+5,公司知名度+5,名气+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h487CorpLegendCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 5);
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 你接受了媒体的采访——'从0到1，我的创业故事。' 管理XP+5,公司知名度+5,名气+3。", "success");
        }},
        { text: "📝 低调处理", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h487CorpLegendCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 你选择了低调——'故事还没到结尾。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你的创业故事被媒体报道了——你看着报道，想起了那些不为人知的艰辛。";
      }
    },
    {
      id: "h487_corp_social_resp", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "回馈社会",
      story: "公司发展得不错，你开始思考如何回馈社会——{desc}",
      triggers: { minDay: 70, interval: 180, maxRepeats: 3, excludeFlags: ["_h487SocialRespCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h487SocialRespCooldown);
      },
      choices: [
        { text: "🤝 捐款助学", hint: "管理XP+5,公司知名度+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h487SocialRespCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你以公司名义捐了一笔钱——'能力越大，责任越大。' 管理XP+5,公司知名度+5,心情+3。", "success");
        }},
        { text: "🌱 支持环保", hint: "管理XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h487SocialRespCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你决定支持环保事业。管理XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司发展得不错，你开始思考如何回馈社会——'赚了钱之后，还能做些什么？'";
      }
    },
    {
      id: "h487_corp_founder_life", phase: "corporate", _isChainEvent: false, icon: "🤔",
      title: "钱买不到什么",
      story: "事业成功了，但你发现有些东西钱买不到——{desc}",
      triggers: { minDay: 60, interval: 180, maxRepeats: 3, excludeFlags: ["_h487FounderLifeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._h487FounderLifeCooldown);
      },
      choices: [
        { text: "🤔 陪伴家人", hint: "心情+4,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h487FounderLifeCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "花时间陪伴");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤔 你推掉会议回家陪家人——'钱永远赚不完，但陪伴是有限的。' 心情+4,好感+3。", "success");
        }},
        { text: "🧘 找回自己", hint: "心智+3,健康+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h487FounderLifeCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤔 你开始思考——'我这么拼命是为了什么？' 心智+3,健康+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "事业成功了，但你发现有些东西钱买不到——时间、健康、真情。";
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
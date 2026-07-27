/**
 * 域B(事件/叙事) 联动增强 R447
 * 桥接：
 *   B→E  b447_event_economy       事件经济涟漪 → 消费 flags+resources 数据,
 *     重大事件→"经济也被影响了"的财务回响
 *   B→D  b447_event_friendship    事件友谊深化 → 消费 flags+relationships 数据,
 *     共同经历→"一起经历过大事"的NPC关系升华
 *   B→H  b447_event_corp_culture  事件公司文化 → 消费 flags+corporate 数据,
 *     外部事件→"公司如何看待这件事"的文化回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR447Loaded) return;
  RANDOM_EVENTS._domainBLinkageR447Loaded = true;

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
    // B→E: 事件经济涟漪
    {
      id: "b447_event_economy", phase: "street", _isChainEvent: false, icon: "💹",
      title: "经济余波",
      story: "最近发生的大事，连菜市场的大妈都在议论——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_b447EventEconomyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b447EventEconomyCooldown);
      },
      choices: [
        { text: "📰 关注经济动向", hint: "会计XP+3,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b447EventEconomyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💹 你留意到最近的大事对经济的影响——有些东西涨价了，有些东西跌了。危机里永远有机会。会计XP+3,心智+1。", "success");
        }},
        { text: "🙅 跟我没关系", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b447EventEconomyCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "最近发生的大事，连菜市场的大妈都在议论——'听说物价又要涨了'。在这座城市，没有一件事是孤立的。";
      }
    },
    // B→D: 事件友谊深化
    {
      id: "b447_event_friendship", phase: "street", _isChainEvent: false, icon: "🤗",
      title: "共度难关",
      story: "你想起之前和朋友们一起经历的那些事——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_b447EventFriendshipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._b447EventFriendshipCooldown);
      },
      choices: [
        { text: "🤗 约老朋友出来坐坐", hint: "好感+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b447EventFriendshipCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 4, "一起经历过风雨，感情更深了");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤗 你约了老朋友出来喝酒——聊起一起经历过的那些事，两人都笑了。一起扛过事的人，才是真朋友。好感+4,心情+3。", "success");
        }},
        { text: "📞 发条消息问候", hint: "好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b447EventFriendshipCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 1, "偶尔问候");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤗 你给老朋友发了条消息——'最近还好吗？' 对方秒回：'挺好的，有空出来聚聚！' 好感+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你想起之前和朋友们一起经历的那些事——那些一起扛过的日子，让你们的感情更深了。";
      }
    },
    // B→H: 事件公司文化
    {
      id: "b447_event_corp_culture", phase: "corporate", _isChainEvent: false, icon: "🏢",
      title: "公司态度",
      story: "最近的社会事件在公司里引起了讨论——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 3, excludeFlags: ["_b447CorpCultureCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._b447CorpCultureCooldown);
      },
      choices: [
        { text: "🗣️ 组织讨论会", hint: "管理XP+5,公司凝聚力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b447CorpCultureCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏢 你组织了一场全员讨论会——让大家畅所欲言。这种开放的氛围，让团队的凝聚力更强了。管理XP+5,公司凝聚力+2。", "success");
        }},
        { text: "📢 发内部信表态", hint: "公司知名度+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b447CorpCultureCooldown = true;
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏢 你发了一封内部信，表明了公司的态度——员工们纷纷点赞转发。公司知名度+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "最近的社会事件在公司里引起了讨论——员工们都在看公司会怎么表态。一家公司的文化，就看它在大事面前的态度。";
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
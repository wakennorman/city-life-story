/**
 * 域D(NPC/社交) 联动增强 R483
 * 桥接：
 *   D→B  d483_npc_rumor_mill      NPC谣言坊 → 消费 relationships 数据,
 *     社交圈→"你听说了吗"的市井传闻叙事
 *   D→E  d483_npc_invest_tip      NPC投资提示 → 消费 relationships+investment 数据,
 *     朋友消息→"内部消息"的投资机遇
 *   D→C  d483_npc_career_advice   NPC职业建议 → 消费 relationships 数据,
 *     过来人→"前辈的一句话"的职业转折
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR483Loaded) return;
  RANDOM_EVENTS._domainDLinkageR483Loaded = true;

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
      id: "d483_npc_rumor_mill", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "你听说了吗",
      story: "街坊邻居在传一个消息——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 5, excludeFlags: ["_d483RumorMillCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d483RumorMillCooldown);
      },
      choices: [
        { text: "🗣️ 打听一下", hint: "心智+2,好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d483RumorMillCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 1, "一起八卦");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗣️ '听说XX要拆迁了！'——街坊的闲谈里，有时候藏着真金白银的信息。心智+2,好感+1。", "success");
        }},
        { text: "🙉 不凑热闹", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d483RumorMillCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "街坊邻居在传一个消息——'你听说了吗？' 三个女人一台戏，一个小区就是一部连续剧。";
      }
    },
    {
      id: "d483_npc_invest_tip", phase: "street", _isChainEvent: false, icon: "💡",
      title: "内部消息",
      story: "一个在相关行业工作的朋友透露了条消息——{desc}",
      triggers: { minDay: 35, interval: 90, maxRepeats: 3, excludeFlags: ["_d483InvestTipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._d483InvestTipCooldown);
      },
      choices: [
        { text: "💡 研究一下", hint: "会计XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d483InvestTipCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "分享了一条重要消息");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 你认真研究了朋友给的消息——'信息就是金钱，这句话一点不假。' 会计XP+4,心智+1,好感+2。", "success");
        }},
        { text: "📝 记下来", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d483InvestTipCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 你默默记下了这条消息——'不一定现在用得上，但以后说不定。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一个在相关行业工作的朋友透露了条消息——'我只跟你说，你别往外传...' 你竖起耳朵，一字不落。";
      }
    },
    {
      id: "d483_npc_career_advice", phase: "street", _isChainEvent: false, icon: "🎓",
      title: "前辈的话",
      story: "一位前辈看出了你的迷茫——{desc}",
      triggers: { minDay: 25, interval: 90, maxRepeats: 3, excludeFlags: ["_d483CareerAdviceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._d483CareerAdviceCooldown);
      },
      choices: [
        { text: "🎓 虚心请教", hint: "管理XP+5,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d483CareerAdviceCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "虚心请教职业建议");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 '你还年轻，不要着急。' 前辈的一句话，让你想了很久。管理XP+5,好感+2。", "success");
        }},
        { text: "💭 自己思考", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d483CareerAdviceCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 你谢过前辈，独自思考了很久——有些路，终究要自己走。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一位前辈看出了你的迷茫——'年轻人，我像你这么大的时候也迷茫过。' 他的一句话，可能改变你的一生。";
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
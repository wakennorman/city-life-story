/**
 * 域D(NPC/社交) 联动增强 R453（第三轮循环）
 * 桥接：
 *   D→E  d453_npc_business_tip   NPC生意经 → 消费 relationships+trade 数据,
 *     朋友经验→"跟着有经验的人做生意"的投资启蒙
 *   D→G  d453_npc_health_care    NPC健康关怀 → 消费 relationships+status 数据,
 *     朋友关心→"有人在乎你的健康"的温暖叙事
 *   D→A  d453_npc_market_knowledge NPC市场知识 → 消费 relationships 数据,
 *     社交网络→"朋友多了路好走"的市场信息交换
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR453Loaded) return;
  RANDOM_EVENTS._domainDLinkageR453Loaded = true;

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
      id: "d453_npc_business_tip", phase: "street", _isChainEvent: false, icon: "💼",
      title: "朋友的经验",
      story: "一个做生意的朋友跟你聊起了他的经验——{desc}",
      triggers: { minDay: 35, interval: 90, maxRepeats: 3, excludeFlags: ["_d453BusinessTipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._d453BusinessTipCooldown);
      },
      choices: [
        { text: "💼 认真取经", hint: "会计XP+5,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d453BusinessTipCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "朋友分享了生意经");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 朋友的经验让你受益匪浅——'做生意最重要的不是资金，是信息差。' 会计XP+5,好感+2。", "success");
        }},
        { text: "🍺 请朋友喝一杯", hint: "好感+3,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d453BusinessTipCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 3, "请客喝酒");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 你请朋友喝了顿酒——酒桌上说的话，比任何商业课程都实在。好感+3,心情+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一个做生意的朋友跟你聊起了他的经验——'我当年也是这么过来的...' 你认真听着，每一句都是真金白银。";
      }
    },
    {
      id: "d453_npc_health_care", phase: "street", _isChainEvent: false, icon: "💝",
      title: "朋友的关心",
      story: "朋友注意到你最近气色不太好——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_d453HealthCareCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var h = (st.status && st.status.health) || 70;
        return h < 60 && (st.flags && !st.flags._d453HealthCareCooldown);
      },
      choices: [
        { text: "💝 接受关心", hint: "好感+3,健康+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d453HealthCareCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 3, "朋友关心健康");
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 '你最近是不是太累了？多注意身体啊。'——有人关心你的感觉，真好。好感+3,健康+2,心情+2。", "success");
        }},
        { text: "😤 说没事", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d453HealthCareCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友注意到你最近气色不太好——'你是不是又熬夜了？走，我请你喝碗汤去。' 在这座城市，有人关心是一种奢侈。";
      }
    },
    {
      id: "d453_npc_market_knowledge", phase: "street", _isChainEvent: false, icon: "🧠",
      title: "信息就是金钱",
      story: "几个朋友聚在一起，聊起了最近的市场行情——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_d453MarketKnowledgeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d453MarketKnowledgeCooldown);
      },
      choices: [
        { text: "🧠 多听多记", hint: "心智+2,销售XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d453MarketKnowledgeCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 3); } catch(e) {} } // [全系统自洽修复] 域B R469 修复:假技能键"trade"→真实键"sales"
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧠 你从朋友们的闲聊中捕捉到了不少市场信息——这些信息，可能比钱还值钱。心智+2,销售XP+3。", "success");
        }},
        { text: "🗣️ 分享自己的信息", hint: "好感+2,社交XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d453MarketKnowledgeCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "分享了市场信息");
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧠 你分享了自己知道的一些信息——朋友们纷纷点赞。信息交换得越多，大家的路越宽。好感+2,社交XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "几个朋友聚在一起，聊起了最近的市场行情——'听说XX要涨价了''YY最近跌得厉害'... 你竖起耳朵，一字不落。";
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
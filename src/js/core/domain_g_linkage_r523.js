/**
 * 域G(核心机制/生命周期) 联动增强 R523
 * 桥接：
 *   G→H  g523_life_corp_maturity 人生公司成熟 → 消费 player.day+corporate 数据,
 *     成熟→"公司和我一起成长"的共同成熟叙事
 *   G→D  g523_life_neighborhood  人生邻里 → 消费 player.day+relationships 数据,
 *     社区→"远亲不如近邻"的邻里关系
 *   G→C  g523_life_career_peak   人生职业巅峰 → 消费 player.day+skills 数据,
 *     巅峰→"在最好的年纪做最好的事"的职业巅峰
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR523Loaded) return;
  RANDOM_EVENTS._domainGLinkageR523Loaded = true;

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
      id: "g523_life_corp_maturity", phase: "corporate", _isChainEvent: false, icon: "🌳",
      title: "共同成长",
      story: "你发现公司和自己都在变得越来越成熟——{desc}",
      triggers: { minDay: 80, interval: 180, maxRepeats: 3, excludeFlags: ["_g523CorpMaturityCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._g523CorpMaturityCooldown);
      },
      choices: [
        { text: "🌳 感恩成长", hint: "管理XP+5,心智+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g523CorpMaturityCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌳 '公司和我，都在成长。' 管理XP+5,心智+3,心情+2。", "success");
        }},
        { text: "📈 规划下一步", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g523CorpMaturityCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌳 '成长没有终点，继续前进。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现公司和自己都在变得越来越成熟——'刚创业的时候手忙脚乱，现在越来越从容了。'";
      }
    },
    {
      id: "g523_life_neighborhood", phase: "street", _isChainEvent: false, icon: "🏘️",
      title: "邻里之间",
      story: "你和邻居在楼道里碰见了——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_g523NeighborhoodCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g523NeighborhoodCooldown);
      },
      choices: [
        { text: "🏘️ 聊几句", hint: "好感+2,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g523NeighborhoodCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "和邻居聊天");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏘️ '你好！今天天气不错啊。' 简单的寒暄，让邻里关系更近了一步。好感+2,心情+1。", "success");
        }},
        { text: "🙂 点头微笑", hint: "好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g523NeighborhoodCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "微笑打招呼");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏘️ 你微笑着点了点头——'虽然没说话，但善意传达到了。' 好感+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你和邻居在楼道里碰见了——'好久不见！最近忙什么呢？' 在这座城市，邻居是最近的陌生人。";
      }
    },
    {
      id: "g523_life_career_peak", phase: "corporate", _isChainEvent: false, icon: "⛰️",
      title: "职业巅峰",
      story: "你感觉自己正处于职业的黄金时期——{desc}",
      triggers: { minDay: 60, interval: 180, maxRepeats: 3, excludeFlags: ["_g523CareerPeakCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._g523CareerPeakCooldown);
      },
      choices: [
        { text: "⛰️ 全力以赴", hint: "管理XP+5,心智+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g523CareerPeakCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⛰️ '这就是我的黄金时代，不能浪费。' 管理XP+5,心智+2,心情+2。", "success");
        }},
        { text: "🎯 设定更高目标", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g523CareerPeakCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("⛰️ '巅峰不是终点，而是新的起点。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你感觉自己正处于职业的黄金时期——'精力充沛、经验丰富、资源充足。' 现在就是最好的时候。";
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
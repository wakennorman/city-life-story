/**
 * 域G(核心机制/生命周期) 联动增强 R671
 * 桥接：
 *   G→A  g653_life_data_legacy_v3  人生数据遗产v3 → 消费 state.player+state.stats+state.flags 数据,
 *    生命→"数字遗产"数据回响
 *   G→D  g653_npc_milestone_v2  NPC里程碑v2 → 消费 state.relationships+state.player 数据,
 *    生命→"与NPC的共同回忆"社交回响
 *   G→C  g653_career_lifecycle_v2  职业生命周期v2 → 消费 state.career+state.player 数据,
 *    生命→"职业发展如人生"职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR671Loaded) return;
  RANDOM_EVENTS._domainGLinkageR671Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR671(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "g653_life_data_legacy_v3", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数字遗产",
      story: "你开始思考:这些数据,将来会留给谁?——{desc}",
      triggers: { minDay: 400, interval: 365, maxRepeats: 1, excludeFlags: ["_g653LegacyDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g653LegacyDone) return false;
        var day = (st.player && st.player.day) || 0;
        return day >= 400;
      },
      choices: [
        { text: "📖 写人生总结", hint: "智力+8,心智+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g653LegacyDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把人生写下来,就是最好的遗产。' 你写下了人生总结。智力+8,心智+6。", "success");
        }},
        { text: "🎯 设定传承计划", hint: "心智+9,置_g653LegacyPlan", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g653LegacyDone = true;
          st.flags._g653LegacyPlan = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '数字遗产,值得被传承。' 你设定了传承计划。心智+9。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        return "你开始思考:这些数据,将来会留给谁?——" + day + "天的记录,是你在这座城市活过的证明。'数字遗产,值得被传承。'";
      }
    },
    {
      id: "g653_npc_milestone_v2", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "与NPC的共同回忆",
      story: "你和朋友一起经历了很多事,这些共同的回忆成为了珍贵的财富——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 1, excludeFlags: ["_g653NpcDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g653NpcDone) return false;
        var met = metNpcsR671(st);
        var highAff = 0;
        for (var i = 0; i < met.length; i++) { if (met[i].affinity >= 85) highAff++; }
        return highAff >= 2;
      },
      choices: [
        { text: "💝 珍惜友情", hint: "全NPC好感+4,心情+7", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g653NpcDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 7);
          var met = metNpcsR671(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 4, "共同回忆"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 '与朋友一起经历的,才是最珍贵的。' 你更加珍惜友情。全NPC好感+4,心情+7。", "success");
        }},
        { text: "📖 记录回忆", hint: "社交XP+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g653NpcDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把回忆写下来,就是永恒。' 你记录了与朋友的故事。社交XP+6。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR671(st);
        return "你和朋友一起经历了很多事——" + met.length + "位朋友,每一段共同的回忆都是珍贵的财富。'与朋友一起经历的,才是最珍贵的。'";
      }
    },
    {
      id: "g653_career_lifecycle_v2", phase: "street", _isChainEvent: false, icon: "🔄",
      title: "职业发展如人生",
      story: "你开始用生命周期的视角来看待职业发展——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 1, excludeFlags: ["_g653CareerDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g653CareerDone) return false;
        return st.stats && (st.stats.totalEarned || 0) >= 100000;
      },
      choices: [
        { text: "📊 复盘职业", hint: "管理XP+6,智力+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g653CareerDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '复盘是为了更好地前行。' 你复盘了职业历程。管理XP+6,智力+4。", "success");
        }},
        { text: "🚀 规划新篇", hint: "心智+8,置_g653NewCareer", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g653CareerDone = true;
          st.flags._g653NewCareer = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '职业发展如人生,需要不断规划。' 你规划了职业新篇章。心智+8。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var totalEarned = (st.stats && st.stats.totalEarned) || 0;
        return "你开始用生命周期的视角来看待职业发展——累计赚取¥" + totalEarned + "。'职业发展如人生,有起有落,关键在于持续成长。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

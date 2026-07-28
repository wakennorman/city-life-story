/**
 * 域G(核心机制/生命周期) 联动增强 R655
 * 桥接：
 *   G→A  g655_life_milestone_tracker  人生里程碑追踪 → 消费 state.player+state.stats 数据,
 *    生命→"记录人生的重要时刻"数据回响
 *   G→D  g655_npc_relationship_evolution  关系演化 → 消费 state.relationships+state.player 数据,
 *    生命→"关系在时间中演变"社交回响
 *   G→C  g655_skill_legacy  技能传承 → 消费 state.skills+state.player 数据,
 *    生命→"技能是终身财富"职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR655Loaded) return;
  RANDOM_EVENTS._domainGLinkageR655Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR655(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "g655_life_milestone_tracker", phase: "street", _isChainEvent: false, icon: "🏆",
      title: "记录人生的重要时刻",
      story: "你开始系统地记录人生中的重要里程碑——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 1, excludeFlags: ["_g655TrackerDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g655TrackerDone) return false;
        var day = (st.player && st.player.day) || 0;
        return day >= 300;
      },
      choices: [
        { text: "📖 制作里程碑时间线", hint: "智力+6,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g655TrackerDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '记录人生的重要时刻,让回忆有迹可循。' 你制作了里程碑时间线。智力+6,心智+5。", "success");
        }},
        { text: "🎯 设定新里程碑", hint: "心智+7,置_g655NewMilestone", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g655TrackerDone = true;
          st.flags._g655NewMilestone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '每个里程碑,都是新的起点。' 你设定了新的人生里程碑。心智+7。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        return "你开始系统地记录人生中的重要里程碑——" + day + "天,每一个重要时刻都值得被铭记。'记录人生的重要时刻,让回忆有迹可循。'";
      }
    },
    {
      id: "g655_npc_relationship_evolution", phase: "street", _isChainEvent: false, icon: "🌱",
      title: "关系在时间中演变",
      story: "你注意到与朋友的关系随着时间的推移在不断变化——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_g655EvoDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g655EvoDone) return false;
        var met = metNpcsR655(st);
        return met.length >= 5;
      },
      choices: [
        { text: "💝 珍惜每一段关系", hint: "全NPC好感+3,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g655EvoDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          var met = metNpcsR655(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 3, "珍惜关系"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 '关系在时间中演变,要珍惜每一段。' 你更加珍惜身边的人。全NPC好感+3,心情+5。", "success");
        }},
        { text: "📖 记录关系变化", hint: "社交XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g655EvoDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把关系变化写下来,就是人生故事。' 你记录了关系的演变。社交XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR655(st);
        return "你注意到与朋友的关系随着时间的推移在不断变化——" + met.length + "位朋友,每一段关系都在演变。'关系在时间中演变,要珍惜每一段。'";
      }
    },
    {
      id: "g655_skill_legacy", phase: "street", _isChainEvent: false, icon: "📚",
      title: "技能是终身财富",
      story: "你开始思考:这些技能,将来能传给谁?——{desc}",
      triggers: { minDay: 200, interval: 300, maxRepeats: 1, excludeFlags: ["_g655LegacyDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g655LegacyDone) return false;
        var skills = st.skills || {};
        var highCount = 0;
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number" && skills[k].level >= 50) highCount++;
        }
        return highCount >= 2;
      },
      choices: [
        { text: "📖 编写技能手册", hint: "管理XP+6,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g655LegacyDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '技能是终身财富,值得被传承。' 你编写了技能手册。管理XP+6,智力+3。", "success");
        }},
        { text: "🎯 继续精进", hint: "心智+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g655LegacyDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '学无止境,继续精进。' 你选择继续提升技能。心智+6。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var skills = st.skills || {};
        var highCount = 0;
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number" && skills[k].level >= 50) highCount++;
        }
        return "你开始思考:这些技能,将来能传给谁?——" + highCount + "门技能达到Lv.50+。'技能是终身财富,值得被传承。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

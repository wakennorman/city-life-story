/**
 * 域G(核心机制/生命周期) 联动增强 R639
 * 桥接：
 *   G→A  g639_life_data_visualization  人生数据可视化 → 消费 state.player+state.stats+state.skills 数据,
 *    生命→"看见自己的成长"数据回响
 *   G→D  g639_npc_lifecycle  NPC生命周期 → 消费 state.relationships+state.player 数据,
 *    生命→"朋友也在变老"社交回响
 *   G→C  g639_skill_milestone_event  技能里程碑事件 → 消费 state.skills+state.player 数据,
 *    生命→"学有所成"职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR639Loaded) return;
  RANDOM_EVENTS._domainGLinkageR639Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR639(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "g639_life_data_visualization", phase: "street", _isChainEvent: false, icon: "📊",
      title: "看见自己的成长",
      story: "用数据看见自己的成长轨迹——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 1, excludeFlags: ["_g639VizDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g639VizDone) return false;
        var day = (st.player && st.player.day) || 0;
        return day >= 250;
      },
      choices: [
        { text: "📈 制作成长曲线", hint: "智力+5,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g639VizDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '看见成长,是最好的激励。' 你制作了个人成长曲线。智力+5,心智+4。", "success");
        }},
        { text: "🎯 设定下阶段目标", hint: "心智+6,置_g639NextGoal", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g639VizDone = true;
          st.flags._g639NextGoal = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '看清了现在,才能规划未来。' 你设定了新目标。心智+6。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var totalXp = 0;
        var skills = st.skills || {};
        for (var k in skills) {
          if (skills[k] && typeof skills[k].xp === "number") totalXp += skills[k].xp;
        }
        return "用数据看见自己的成长——" + day + "天,累计" + totalXp + "技能经验。'成长不是线性的,但回头看,每一步都算数。'";
      }
    },
    {
      id: "g639_npc_lifecycle", phase: "street", _isChainEvent: false, icon: "👴",
      title: "朋友也在变老",
      story: "你注意到身边的朋友也在经历人生的变化——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_g639NpcLifeDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g639NpcLifeDone) return false;
        var met = metNpcsR639(st);
        return met.length >= 4;
      },
      choices: [
        { text: "💝 珍惜眼前人", hint: "全NPC好感+2,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g639NpcLifeDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          var met = metNpcsR639(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 2, "珍惜眼前人"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 '朋友也在变老,要珍惜眼前人。' 你更加珍惜身边的人。全NPC好感+2,心情+5。", "success");
        }},
        { text: "📖 记录友情", hint: "社交XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g639NpcLifeDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把友情记下来,是最温暖的财富。' 你记录了与朋友的故事。社交XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR639(st);
        return "你注意到身边的朋友也在经历人生的变化——" + met.length + "位朋友,每个人都在自己的轨道上前行。'朋友也在变老,要珍惜眼前人。'";
      }
    },
    {
      id: "g639_skill_milestone_event", phase: "street", _isChainEvent: false, icon: "🏆",
      title: "学有所成",
      story: "当一门技能练到极致,你感受到了真正的成就感——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 1, excludeFlags: ["_g639MilestoneDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g639MilestoneDone) return false;
        var skills = st.skills || {};
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number" && skills[k].level >= 60) return true;
        }
        return false;
      },
      choices: [
        { text: "🎉 庆祝突破", hint: "心情+10,置_g639Celebrated", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g639MilestoneDone = true;
          st.flags._g639Celebrated = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 'Lv.60! 这一路走来不容易。' 你为自己的突破庆祝。心情+10。", "success");
        }},
        { text: "🚀 向更深处进发", hint: "心智+8,置_g639Deeper", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g639MilestoneDone = true;
          st.flags._g639Deeper = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '这才哪到哪,继续深挖。' 你向更深处进发。心智+8。", "success");
        }},
        { text: "📖 总结经验", hint: "管理XP+6,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g639MilestoneDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把经验总结出来,才能传承。' 你总结了技能提升方法论。管理XP+6,智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var skills = st.skills || {};
        var masters = [];
        var skillNames = { cooking:"厨艺", repair:"修理", coding:"编程", english:"英语", driving:"驾驶", sales:"销售", management:"管理", accounting:"会计", electrician:"电工", welding:"焊接", medicine:"医术", social:"社交" };
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number" && skills[k].level >= 60) {
            masters.push((skillNames[k] || k) + "(Lv." + skills[k].level + ")");
          }
        }
        return "当一门技能练到极致,你感受到了真正的成就感——" + masters.join(", ") + "。'学有所成,是对努力最好的回报。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

/**
 * 域A(数据/数值平衡) 联动增强 R533
 * 桥接：
 *   A→D  a533_npc_compliment    NPC称赞 → 消费 goods 数据,
 *     生意→"你的眼光真好"的社交称赞
 *   A→C  a533_job_skill_map     工作技能地图 → 消费 jobs+skills 数据,
 *     匹配→"你的技能适合什么工作"的匹配分析
 *   A→G  a533_health_goods_ratio 健康商品比 → 消费 goods 数据,
 *     健康→"买健康食品的性价比"的健康投资
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR533Loaded) return;
  RANDOM_EVENTS._domainALinkageR533Loaded = true;

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
      id: "a533_npc_compliment", phase: "street", _isChainEvent: false, icon: "😊",
      title: "好眼光",
      story: "摊主夸你选东西的眼光好——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 5, excludeFlags: ["_a533ComplimentCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a533ComplimentCooldown);
      },
      choices: [
        { text: "😊 谦虚回应", hint: "好感+2,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a533ComplimentCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "被夸赞后谦虚回应");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😊 '哪里哪里，是你家的东西好。' 好感+2,心情+1。", "success");
        }},
        { text: "😎 自信接受", hint: "名气+1,好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a533ComplimentCooldown = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "自信接受夸赞");
          if (typeof StateManager !== "undefined") StateManager.addMessage("😎 '那当然，我可是很会挑的。' 名气+1,好感+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "摊主夸你选东西的眼光好——'小伙子/姑娘真会挑，这个品质最好！' 被夸的感觉，让一天都心情好。";
      }
    },
    {
      id: "a533_job_skill_map", phase: "street", _isChainEvent: false, icon: "🎯",
      title: "技能匹配",
      story: "你发现自己的技能很适合某个工作——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_a533JobSkillMapCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a533JobSkillMapCooldown);
      },
      choices: [
        { text: "🎯 投简历", hint: "管理XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a533JobSkillMapCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '这个工作简直就是为我量身定做的！' 管理XP+4,心智+1。", "success");
        }},
        { text: "📈 提升匹配度", hint: "随机技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a533JobSkillMapCooldown = true;
          var skills = ["accounting", "management", "sales", "coding", "social", "driving"]; // [全系统自洽修复] 域C R535 修复:marketing/technology/trade非真实技能键(XP静默丢弃)→映射sales/coding/driving
          var sk = Random.fromArray(skills); // [全系统自洽修复] 域A R400: Math.random()→Random.fromArray()
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '技能还差一点，再提升一下就能达到要求了。' 随机技能XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现自己的技能很适合某个工作——'这个工作要求的能力，我刚好都有。' 原来技能真的能直接对接到工作。";
      }
    },
    {
      id: "a533_health_goods_ratio", phase: "street", _isChainEvent: false, icon: "🥗",
      title: "健康投资",
      story: "你算了算健康食品和普通食品的价格差——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_a533HealthRatioCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a533HealthRatioCooldown);
      },
      choices: [
        { text: "🥗 买健康的", hint: "健康+2,花费300", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a533HealthRatioCooldown = true;
          if (st.resources && st.resources.cash >= 300) { st.resources.cash -= 300; }
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🥗 '贵是贵了点，但健康是无价的。' 健康+2,花费¥300。", "success");
        }},
        { text: "📊 找性价比", hint: "会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a533HealthRatioCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🥗 '找到了性价比最高的健康食品，既营养又不太贵。' 会计XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你算了算健康食品和普通食品的价格差——'有机蔬菜比普通贵一倍，但真的值得吗？' 健康和经济，需要找到平衡。";
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
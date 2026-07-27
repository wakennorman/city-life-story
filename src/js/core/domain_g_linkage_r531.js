/**
 * 域G(核心机制/生命周期) 联动增强 R531
 * 桥接：
 *   G→E  g531_life_cost_tracking 人生成本追踪 → 消费 player.day+resources 数据,
 *     记账→"每天花了多少钱"的成本追踪
 *   G→D  g531_life_season_greeting 人生季节问候 → 消费 player.day+relationships 数据,
 *     季节→"每个季节给朋友送问候"的季节叙事
 *   G→C  g531_life_skill_plateau 人生技能平台 → 消费 player.day+skills 数据,
 *     瓶颈→"技能遇到瓶颈期"的突破叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR531Loaded) return;
  RANDOM_EVENTS._domainGLinkageR531Loaded = true;

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
      id: "g531_life_cost_tracking", phase: "street", _isChainEvent: false, icon: "📝",
      title: "每日记账",
      story: "你记下了今天的每一笔花销——{desc}",
      triggers: { minDay: 10, interval: 15, maxRepeats: 10, excludeFlags: ["_g531CostTrackingCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g531CostTrackingCooldown);
      },
      choices: [
        { text: "📝 认真记账", hint: "会计XP+3,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g531CostTrackingCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 '今天花了¥128，其中吃饭¥45，交通¥12...' 会计XP+3,心智+1。", "success");
        }},
        { text: "💰 看个大概", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g531CostTrackingCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 '大概心里有数就行，不用记太细。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你记下了今天的每一笔花销——'钱花在哪了，心里要有数。' 记账，是理财的第一步。";
      }
    },
    {
      id: "g531_life_season_greeting", phase: "street", _isChainEvent: false, icon: "🌸",
      title: "季节问候",
      story: "换季了，你给朋友们发了问候——{desc}",
      triggers: { minDay: 15, interval: 30, maxRepeats: 10, excludeFlags: ["_g531SeasonGreetingCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g531SeasonGreetingCooldown);
      },
      choices: [
        { text: "🌸 群发问候", hint: "好感+1,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g531SeasonGreetingCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "季节问候");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌸 '春天来了，大家都要开心哦！' 简单的问候，温暖了朋友圈。好感+1,心情+1。", "success");
        }},
        { text: "💌 单独问候", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g531SeasonGreetingCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "单独季节问候");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌸 '春天快乐！好久不见，想你了。' 好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "换季了，你给朋友们发了问候——'春天来了，夏天还会远吗？' 季节更替，也是问候朋友的好时机。";
      }
    },
    {
      id: "g531_life_skill_plateau", phase: "corporate", _isChainEvent: false, icon: "📈",
      title: "瓶颈期",
      story: "你发现技能很久没有进步了——{desc}",
      triggers: { minDay: 40, interval: 120, maxRepeats: 3, excludeFlags: ["_g531SkillPlateauCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g531SkillPlateauCooldown);
      },
      choices: [
        { text: "📈 突破瓶颈", hint: "全技能XP+3,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g531SkillPlateauCooldown = true;
          var skills = ["accounting", "management", "sales", "coding", "social", "driving"]; // [全系统自洽修复] 域C R535 修复:marketing/technology/trade非真实技能键(XP静默丢弃)→映射sales/coding/driving
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 3); } catch(e) {} } }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '瓶颈期就是突破期，熬过去就是新的天地。' 全技能XP+3,心智+3。", "success");
        }},
        { text: "🔄 换个方向", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g531SkillPlateauCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '也许不是技能的问题，是该换个方向了。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现技能很久没有进步了——'每天在做同样的事，感觉没有成长。' 这是瓶颈期，也是突破的前夜。";
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
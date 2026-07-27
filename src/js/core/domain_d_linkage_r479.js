/**
 * 域D(NPC/社交) 联动增强 R479（第二十六轮循环）
 * 桥接：
 *   D→F  d479_social_capital_ui   社交资本UI → 消费 relationships 数据,
 *     人脉→"你的社交圈有多大"的UI洞察
 *   D→D  d479_npc_relationship_web NPC关系网 → 消费 relationships 数据,
 *     关系→"朋友的朋友也是朋友"的社交演化
 *   d479_npc_life_story(D→B NPC人生故事): npcs→"TA的人生轨迹"叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR479Loaded) return;
  RANDOM_EVENTS._domainDLinkageR479Loaded = true;

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
      id: "d479_social_capital_ui", phase: "street", _isChainEvent: false, icon: "💎",
      title: "社交资本",
      story: "你盘点了自己的社交圈——{desc}",
      triggers: { minDay: 45, interval: 70, maxRepeats: 4, excludeFlags: ["_d479CapitalUiCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var count = 0;
        for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) count++; }
        return count >= 4 && (st.flags && !st.flags._d479CapitalUiCooldown);
      },
      choices: [
        { text: "📊 量化分析", hint: "智力+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d479CapitalUiCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你量化了社交资本——'人脉就是钱脉。' 智力+2,会计XP+2。", "success");
        }},
        { text: "💝 主动维护", hint: "好感+3(最低者),心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d479CapitalUiCooldown = true;
          var lowest = null, lowestAff = 999;
          for (var k in st.relationships) {
            if (st.relationships[k] && st.relationships[k].met) {
              var aff = st.relationships[k].affinity || 0;
              if (aff < lowestAff) { lowestAff = aff; lowest = k; }
            }
          }
          bumpAffinity(st, lowest, 3, "主动维护");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 你主动维护了最弱的关系——'患难见真情。' 好感+3,心情+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var count = 0, totalAff = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met) { count++; totalAff += st.relationships[k].affinity || 0; }
        }
        var avg = count > 0 ? Math.round(totalAff / count) : 0;
        return "你盘点了自己的社交圈——" + count + "个熟人，平均好感" + avg + "。你的社交资本值多少钱？";
      }
    },
    {
      id: "d479_npc_relationship_web", phase: "street", _isChainEvent: false, icon: "🕸️",
      title: "关系网",
      story: "你发现朋友之间也互相认识——{desc}",
      triggers: { minDay: 70, interval: 100, maxRepeats: 3, excludeFlags: ["_d479RelWebCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var count = 0;
        for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) count++; }
        return count >= 5 && (st.flags && !st.flags._d479RelWebCooldown);
      },
      choices: [
        { text: "🔗 牵线搭桥", hint: "好感+5(双方),心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d479RelWebCooldown = true;
          var npcs = [];
          for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) npcs.push(k); }
          if (npcs.length >= 2) {
            bumpAffinity(st, npcs[0], 5, "牵线搭桥");
            bumpAffinity(st, npcs[1], 5, "牵线搭桥");
          }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔗 你帮两个朋友牵了线——'朋友的朋友也是朋友。' 好感+5,心情+3。", "success");
        }},
        { text: "🤫 保守秘密", hint: "心智+3,道德+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d479RelWebCooldown = true;
          if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 3); st.player.morality = Math.min(100, (st.player.morality || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 你选择保守秘密——'嘴严是信任的基础。' 心智+3,道德+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var count = 0;
        for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) count++; }
        return "你发现" + count + "个朋友之间也互相认识——社交圈原来是一张网，牵一发而动全身。";
      }
    },
    {
      id: "d479_npc_life_story", phase: "street", _isChainEvent: false, icon: "📖",
      title: "TA的人生",
      story: "你了解了某个NPC的人生故事——{desc}",
      triggers: { minDay: 50, interval: 80, maxRepeats: 4, excludeFlags: ["_d479LifeStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return !!firstMetNpc(st) && (st.flags && !st.flags._d479LifeStoryCooldown);
      },
      choices: [
        { text: "📖 深入了解", hint: "好感+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d479LifeStoryCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 5, "了解人生故事");
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你深入了解了TA的人生故事——'每个人都有自己的不容易。' 好感+5,心智+3。", "success");
        }},
        { text: "🎯 从中学习", hint: "智力+2,全技能XP+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d479LifeStoryCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          var skills = ["accounting", "management", "sales", "coding", "social"]; // [全系统自洽修复] 域E R588 修复:trade非真实技能键(addSkillXp静默丢弃XP)→映射social
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 1); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你从TA的人生中汲取了经验——'别人的经历是最好的教材。' 智力+2,全技能XP+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你了解了某个NPC的人生故事——原来TA也经历过低谷，也曾经迷茫。每个人都有自己的故事。";
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

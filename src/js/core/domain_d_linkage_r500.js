/**
 * 域D(NPC/社交) 联动增强 R500
 * 桥接：
 *   D→E  d500_npc_side_business  NPC副业合作 → 消费 relationships 数据,
 *     朋友→"一起搞点副业"的合伙叙事
 *   D→C  d500_npc_skill_exchange NPC技能交换 → 消费 relationships 数据,
 *     互助→"你教我XX，我教你XX"的技能交换
 *   D→B  d500_npc_city_chatter  NPC城市闲聊 → 消费 relationships 数据,
 *     日常→"城市里每天发生的新鲜事"的生活叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR500Loaded) return;
  RANDOM_EVENTS._domainDLinkageR500Loaded = true;

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
      id: "d500_npc_side_business", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "一起搞副业",
      story: "朋友找你一起搞点副业——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_d500SideBusinessCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._d500SideBusinessCooldown);
      },
      choices: [
        { text: "🤝 一起干", hint: "社交XP+5,现金+2000,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d500SideBusinessCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "一起搞副业");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '两个人一起干，比一个人强。' 你们的副业小有起色。社交XP+5,现金+¥2000,好感+2。", "success");
        }},
        { text: "📋 给建议", hint: "社交XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d500SideBusinessCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "给了副业建议");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你给了朋友一些建议——'这个方向不错，但要注意XXX。' 社交XP+3,好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友找你一起搞点副业——'我有个想法，你技术好，我懂运营，咱们一起干？' 你心动了。";
      }
    },
    {
      id: "d500_npc_skill_exchange", phase: "street", _isChainEvent: false, icon: "🔄",
      title: "技能交换",
      story: "朋友想学你的技能，你也可以学TA的——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_d500SkillExchangeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._d500SkillExchangeCooldown);
      },
      choices: [
        { text: "🔄 交换技能", hint: "全技能XP+2,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d500SkillExchangeCooldown = true;
          var skills = ["accounting", "management", "sales", "coding", "social", "driving"]; // [全系统自洽修复] 域C R535 修复:marketing/technology/trade非真实技能键(XP静默丢弃)→映射sales/coding/driving
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 2); } catch(e) {} } }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "技能交换");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 '你教我英语，我教你编程，互利共赢！' 全技能XP+2,好感+2。", "success");
        }},
        { text: "📝 约时间", hint: "好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d500SkillExchangeCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "约了技能交换时间");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 '这周末有空，咱们约个时间互相学？' 好感+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友想学你的技能，你也可以学TA的——'你教我XX，我教你XX，怎么样？' 技能交换，是最划算的学习方式。";
      }
    },
    {
      id: "d500_npc_city_chatter", phase: "street", _isChainEvent: false, icon: "💭",
      title: "城市新鲜事",
      story: "朋友跟你分享了一件城市里发生的趣事——{desc}",
      triggers: { minDay: 10, interval: 20, maxRepeats: 10, excludeFlags: ["_d500CityChatterCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._d500CityChatterCooldown);
      },
      choices: [
        { text: "💭 聊得开心", hint: "好感+1,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d500CityChatterCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "聊城市趣事");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💭 '真的假的？太有意思了！' 你们笑成一团。好感+1,心情+2。", "success");
        }},
        { text: "👂 听着", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d500CityChatterCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💭 你听着朋友分享的趣事，嘴角不自觉地上扬——生活虽苦，但有趣的事也不少。心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "朋友跟你分享了一件城市里发生的趣事——'你知道吗，昨天XX街上...' 在这座城市，每天都有新鲜事发生。";
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
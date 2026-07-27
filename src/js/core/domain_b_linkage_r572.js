/**
 * 域B(事件/叙事) 联动增强 R572
 * 桥接：
 *   B→H  b572_event_corp_crisis  事件公司危机 → 消费 flags+corporate 数据,
 *     危机→"公司遇到了一个危机"的危机叙事
 *   B→A  b572_event_data_reveal  事件数据揭示 → 消费 flags 数据,
 *     数据→"事件背后的数据真相"的数据叙事
 *   B→C  b572_event_career_spark 事件职业火花 → 消费 flags 数据,
 *     火花→"一个事件点燃了职业热情"的职业叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR572Loaded) return;
  RANDOM_EVENTS._domainBLinkageR572Loaded = true;

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
      id: "b572_event_corp_crisis", phase: "corporate", _isChainEvent: false, icon: "⚠️",
      title: "公司危机",
      story: "公司遇到了一次突发危机——{desc}",
      triggers: { minDay: 45, interval: 180, maxRepeats: 3, excludeFlags: ["_b572CorpCrisisCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._b572CorpCrisisCooldown);
      },
      choices: [
        { text: "⚠️ 从容应对", hint: "管理XP+5,心智+3,公司知名度+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b572CorpCrisisCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ '危机也是机会，处理好了能赢得更多信任。' 管理XP+5,心智+3,公司知名度+2。", "success");
        }},
        { text: "📋 成立应急小组", hint: "管理XP+3,团队忠诚+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b572CorpCrisisCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 2); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ '组建应急小组，各司其职，共渡难关。' 管理XP+3,团队忠诚+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司遇到了一次突发危机——'产品质量问题被曝光了！' 你深吸一口气，开始处理。";
      }
    },
    {
      id: "b572_event_data_reveal", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据真相",
      story: "一组数据揭开了事件的真相——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_b572DataRevealCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b572DataRevealCooldown);
      },
      choices: [
        { text: "📊 深入挖掘", hint: "会计XP+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b572DataRevealCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据背后的真相，往往比表面看到的更复杂。' 会计XP+4,心智+2。", "success");
        }},
        { text: "📝 记录发现", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b572DataRevealCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '把数据揭示的真相记下来，以后可能用得上。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一组数据揭开了事件的真相——'原来XX事件的背后，是数据在说话。' 数据不会说谎。";
      }
    },
    {
      id: "b572_event_career_spark", phase: "street", _isChainEvent: false, icon: "✨",
      title: "职业火花",
      story: "一个偶然的事件点燃了你的职业热情——{desc}",
      triggers: { minDay: 15, interval: 90, maxRepeats: 3, excludeFlags: ["_b572CareerSparkCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b572CareerSparkCooldown);
      },
      choices: [
        { text: "✨ 追随热情", hint: "全技能XP+2,心智+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b572CareerSparkCooldown = true;
          var skills = ["accounting", "management", "marketing", "technology", "social", "trade"];
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 2); } catch(e) {} } }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("✨ '原来这才是我真正想做的事！' 全技能XP+2,心智+3,心情+2。", "success");
        }},
        { text: "📝 认真规划", hint: "心智+2,管理XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b572CareerSparkCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("✨ '热情需要规划，才能变成事业。' 心智+2,管理XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一个偶然的事件点燃了你的职业热情——'我从来没想过，这件事会让我这么兴奋！' 也许，这就是你一直在寻找的方向。";
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
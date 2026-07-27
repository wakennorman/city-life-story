/**
 * 域B(事件/叙事) 联动增强 R481
 * 桥接：
 *   B→C  b481_career_inspiration   职业灵感 → 消费 flags+skills 数据,
 *     他人故事→"我也想像TA一样"的职业启发
 *   B→D  b481_story_bonding       故事纽带 → 消费 flags+relationships 数据,
 *     分享经历→"原来你也有这样的故事"的共鸣
 *   B→H  b481_corp_origin_story   公司起源故事 → 消费 flags+corporate 数据,
 *     创业初心→"还记得为什么出发吗"的创始叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR481Loaded) return;
  RANDOM_EVENTS._domainBLinkageR481Loaded = true;

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
      id: "b481_career_inspiration", phase: "street", _isChainEvent: false, icon: "✨",
      title: "榜样的力量",
      story: "你听说了一个普通人的逆袭故事——{desc}",
      triggers: { minDay: 20, interval: 90, maxRepeats: 3, excludeFlags: ["_b481InspirationCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b481InspirationCooldown);
      },
      choices: [
        { text: "✨ 受到激励", hint: "管理XP+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b481InspirationCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("✨ 'TA能做到，我也可以！' 这个普通人的逆袭故事，点燃了你心里的火。管理XP+4,心智+2。", "success");
        }},
        { text: "📝 写下自己的目标", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b481InspirationCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("✨ 你写下自己的目标——'总有一天，我的故事也会激励别人。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你听说了一个普通人的逆袭故事——从负债累累到年入百万，TA只用了两年。'为什么不能是我？'";
      }
    },
    {
      id: "b481_story_bonding", phase: "street", _isChainEvent: false, icon: "💬",
      title: "原来你也是",
      story: "你跟朋友聊天时发现，TA也有过类似的经历——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_b481StoryBondingCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._b481StoryBondingCooldown);
      },
      choices: [
        { text: "💬 深聊下去", hint: "好感+4,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b481StoryBondingCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 4, "分享相似的经历");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 你们越聊越投机——'原来你也经历过这些！' 共同的经历让你们的距离一下子拉近了。好感+4,心情+2。", "success");
        }},
        { text: "☕ 约下次再聊", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b481StoryBondingCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "聊得投机");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 '今天聊得很开心，下次再约！' 有些朋友，是在故事里认识的。好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你跟朋友聊天时发现，TA也有过类似的经历——'真的吗？我以为只有我这样过！' 原来同病相怜的人，比你想象的要多。";
      }
    },
    {
      id: "b481_corp_origin_story", phase: "corporate", _isChainEvent: false, icon: "🚀",
      title: "创业初心",
      story: "你在整理旧物时，翻到了当初的创业计划书——{desc}",
      triggers: { minDay: 70, interval: 180, maxRepeats: 3, excludeFlags: ["_b481OriginStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._b481OriginStoryCooldown);
      },
      choices: [
        { text: "🚀 重温初心", hint: "管理XP+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b481OriginStoryCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你翻出当初的创业计划书——字迹已经褪色，但那份热情还在。'不忘初心，方得始终。' 管理XP+5,心情+3。", "success");
        }},
        { text: "📖 分享给团队", hint: "管理XP+3,团队忠诚+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b481OriginStoryCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 2); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你把创业故事分享给了团队——'这就是我们为什么要做这件事。' 团队凝聚力更强了。管理XP+3,团队忠诚+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你在整理旧物时，翻到了当初的创业计划书——泛黄的纸上写满了当时的雄心壮志。";
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
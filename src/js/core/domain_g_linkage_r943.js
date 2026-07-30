/*
 * 城市浮生记 — 域G(核心机制/生命周期) 联动增强 R943
 * 全系统优化·Domain G 第七十三轮循环
 *
 * 【联动增强3项】
 *   1. G→A 生命周期数据沉淀v1 — 天数节点触发数据回顾
 *   2. G→B 人生章节叙事v1 — 关键人生节点叙事回响
 *   3. G→D 社交里程碑v1 — 时间沉淀友谊
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR943Loaded) return;
  RANDOM_EVENTS._domainGLinkageR943Loaded = true;

  function grantXp(k, a) { if (typeof addSkillXp === "function") { try { addSkillXp(k, a); } catch(e) {} } }

  var EVENTS = [
    {
      id: "g943_life_data_reflect_v1", phase: "street", icon: "📊",
      title: "时间记录，数据沉淀",
      story: "日子一天天过去，你积累的数据越来越多。\n\n翻看这些记录，你能清晰地看到自己走过的路——每一步都算数。",
      triggers: { minDay: 50, interval: 50, maxRepeats: 12, excludeFlags: ["_g943DataReflectCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g943DataReflectCd) return false;
        return st.player.day >= 50 && st.player.day % 50 === 0;
      },
      probability: 0.03, repeatable: true,
      choices: [
        { text: "📊 查看成长数据", hint: "心智+10,会计XP+12,置_g943DataAware", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._g943DataReflectCd = true; st.flags._g943DataAware = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
          grantXp("accounting", 12);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 查看了成长数据——心智+10,会计XP+12。", "success");
        }},
        { text: "😅 继续前进", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._g943DataReflectCd = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😅 继续前进。心智+3。", "info");
        }}
      ]
    },
    {
      id: "g943_life_chapter_v1", phase: "street", icon: "📖",
      title: "人生新篇章",
      story: "你忽然意识到，自己已经走过了人生的一段重要旅程。\n\n回头看看来时的路，那些曾经觉得过不去的坎，现在都成了茶余饭后的谈资。",
      triggers: { minDay: 80, interval: 180, maxRepeats: 3, excludeFlags: ["_g943LifeChapterCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g943LifeChapterCd) return false;
        var _d = st.player.day || 0;
        return (_d === 80 || _d === 180 || _d === 365) && !st.flags["_g943Chapter_" + _d];
      },
      probability: 0.06, repeatable: true,
      choices: [
        { text: "📖 写下感悟", hint: "心智+18,魅力+8,置_g943Writer", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          var _d = (st.player && st.player.day) || 0;
          st.flags._g943LifeChapterCd = true; st.flags["_g943Chapter_" + _d] = true; st.flags._g943Writer = true;
          if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 18); st.player.charm = Math.min(100, (st.player.charm || 50) + 8); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 写下了感悟——心智+18,魅力+8。", "success");
        }},
        { text: "😅 继续赶路", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          var _d2 = (st.player && st.player.day) || 0;
          st.flags._g943LifeChapterCd = true; st.flags["_g943Chapter_" + _d2] = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😅 继续赶路。心智+5。", "info");
        }}
      ]
    },
    {
      id: "g943_social_milestone_v1", phase: "street", icon: "🎂",
      title: "时间沉淀的友谊",
      story: "你在这座城市待得越久，身边的人也在慢慢变化。\n\n时间是最好的过滤器，留下的都是真心。",
      triggers: { minDay: 40, interval: 90, maxRepeats: 5, excludeFlags: ["_g943SocialMilestoneCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g943SocialMilestoneCd) return false;
        if (!st.relationships) return false;
        var _m = 0; for (var _id in st.relationships) { if (st.relationships[_id] && st.relationships[_id].met) _m++; }
        return _m >= 2 && st.player.day >= 40;
      },
      probability: 0.04, repeatable: true,
      choices: [
        { text: "🎂 和老朋友聚聚", hint: "心情+12,魅力+6,好感+3,置_g943SocialTies", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._g943SocialMilestoneCd = true; st.flags._g943SocialTies = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 6);
          if (st.relationships && typeof applyAffinityChange === "function") {
            var _ids = []; for (var _id2 in st.relationships) { if (st.relationships[_id2] && st.relationships[_id2].met) _ids.push(_id2); }
            if (_ids.length > 0) { var _p = typeof Random !== "undefined" ? Random.int(0, _ids.length - 1) : 0; applyAffinityChange(st, _ids[_p], 3, "时间沉淀友谊"); }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎂 和老朋友聚了聚——心情+12,魅力+6。", "success");
        }},
        { text: "😅 各自忙", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          st.flags._g943SocialMilestoneCd = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😅 各自忙。心智+3。", "info");
        }}
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
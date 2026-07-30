/*
 * 城市浮生记 — 域G(核心机制/生命周期) 联动增强 R935
 * 全系统优化·Domain G 第七十二轮循环
 *
 * 【联动增强3项】
 *   1. G→A 生命周期数据沉淀v1 — 年龄增长触发数据沉淀事件
 *   2. G→B 人生章节叙事v1 — 人生阶段转换触发叙事回响
 *   3. G→D 社交里程碑v1 — 年龄增长影响社交关系变化
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动现有文件。
 *  - 所有 state 访问均 || 防御。
 *  - 严格遵守目标域数据格式。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR935Loaded) return;
  RANDOM_EVENTS._domainGLinkageR935Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: G→A 生命周期数据沉淀v1
    // 设计意图：年龄增长(每30天)触发数据沉淀事件，
    //    让玩家回顾过去一段时间的成长数据。
    // 心理学：峰终定律 — 定期回顾强化记忆锚点
    // ========================================================================
    {
      id: "g935_life_data_reflect_v1",
      phase: "street",
      icon: "📊",
      title: "时间记录，数据沉淀",
      story: "不知不觉又过了一段日子。\n\n你翻看着自己的记录——收入、支出、技能、社交……这些数字勾勒出了你在这座城市里生活的轨迹。\n\n数据不会说谎，每一步都算数。",
      triggers: { minDay: 60, interval: 60, maxRepeats: 10, excludeFlags: ["_g935DataReflectCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g935DataReflectCd) return false;
        // 每60天触发一次
        return st.player.day >= 60 && st.player.day % 60 === 0;
      },
      probability: 0.03,
      repeatable: true,
      choices: [
        {
          text: "📊 查看成长数据",
          hint: "心智+12, 会计XP+15, 置_g935DataAware",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g935DataReflectCd = true;
            st.flags._g935DataAware = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            grantXp("accounting", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 你查看了这段日子的成长数据——心智+12, 会计XP+15。", "success");
            }
          }
        },
        {
          text: "😅 懒得看，继续前进",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g935DataReflectCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 懒得看，继续前进。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: G→B 人生章节叙事v1
    // 设计意图：人生阶段转换(青年/中年/老年)触发叙事回响，
    //    让玩家在人生关键节点留下故事回忆。
    // 心理学：叙事自我 — 人生阶段转换重塑自我叙事
    // ========================================================================
    {
      id: "g935_life_chapter_narrative_v1",
      phase: "street",
      icon: "📖",
      title: "人生新篇章",
      story: "你忽然意识到，自己已经走过了人生的一段重要旅程。\n\n回头看看来时的路，那些曾经觉得过不去的坎，现在都成了茶余饭后的谈资。\n\n前方还有新的篇章等着你去书写。",
      triggers: { minDay: 90, interval: 200, maxRepeats: 3, excludeFlags: ["_g935LifeChapterCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g935LifeChapterCd) return false;
        // 在人生关键节点触发：第90/180/365天
        var _day = st.player.day || 0;
        return (_day === 90 || _day === 180 || _day === 365) && !st.flags["_g935Chapter_" + _day];
      },
      probability: 0.06,
      repeatable: true,
      choices: [
        {
          text: "📖 写下这段经历的感悟",
          hint: "心智+20, 魅力+10, 置_g935LifeWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            var _day = (st.player && st.player.day) || 0;
            st.flags._g935LifeChapterCd = true;
            st.flags["_g935Chapter_" + _day] = true;
            st.flags._g935LifeWriter = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 你写下了这段经历的感悟——心智+20, 魅力+10。", "success");
            }
          }
        },
        {
          text: "😅 继续赶路",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            var _day2 = (st.player && st.player.day) || 0;
            st.flags._g935LifeChapterCd = true;
            st.flags["_g935Chapter_" + _day2] = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 继续赶路。心智+5。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: G→D 社交里程碑v1
    // 设计意图：年龄增长(天数增加)影响社交关系变化，
    //    让玩家感到"时间让友谊沉淀"。
    // 心理学：社会情绪选择理论 — 年龄增长改变社交偏好
    // ========================================================================
    {
      id: "g935_social_milestone_v1",
      phase: "street",
      icon: "🎂",
      title: "时间沉淀的友谊",
      story: "你在这座城市待得越久，身边的人也在慢慢变化。\n\n有些人来了又走，有些关系却越来越深。\n\n时间是最好的过滤器，留下的都是真心。",
      triggers: { minDay: 50, interval: 100, maxRepeats: 5, excludeFlags: ["_g935SocialMilestoneCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g935SocialMilestoneCd) return false;
        if (!st.relationships) return false;
        // 需要至少2个已结识NPC
        var _metCount = 0;
        for (var _id in st.relationships) {
          if (st.relationships[_id] && st.relationships[_id].met) _metCount++;
        }
        return _metCount >= 2 && st.player.day >= 50;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "🎂 和老朋友聚一聚",
          hint: "心情+15, 魅力+8, 置_g935SocialTies",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g935SocialMilestoneCd = true;
            st.flags._g935SocialTies = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 8);
            // 给随机已结识NPC加好感
            if (st.relationships && typeof applyAffinityChange === "function") {
              var _metIds = [];
              for (var _id2 in st.relationships) {
                if (st.relationships[_id2] && st.relationships[_id2].met) _metIds.push(_id2);
              }
              if (_metIds.length > 0) {
                var _pick = typeof Random !== "undefined"
                  ? Random.int(0, _metIds.length - 1)
                  : Math.floor(Math.random() * _metIds.length);
                applyAffinityChange(st, _metIds[_pick], 5, "时间沉淀的友谊");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎂 和老朋友聚了聚，感觉真好——心情+15, 魅力+8。", "success");
            }
          }
        },
        {
          text: "😅 各自忙各自的",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g935SocialMilestoneCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 各自忙各自的。心智+3。", "info");
            }
          }
        }
      ]
    }
  ];

  // 去重注册
  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
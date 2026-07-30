/*
 * 城市浮生记 — 域D(NPC/社交) 联动增强 R932
 * 全系统优化·Domain D 第六十八轮循环
 *
 * 【联动增强3项】
 *   1. D→B NPC事件回响v1 — NPC好感度事件触发叙事回响
 *   2. D→E 社交投资情报v1 — NPC提供投资情报事件
 *   3. D→G 社交健康恢复v1 — 社交互动提升心理健康
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动现有文件。
 *  - 所有 state 访问均 || 防御。
 *  - 严格遵守目标域数据格式。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR932Loaded) return;
  RANDOM_EVENTS._domainDLinkageR932Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: D→B NPC事件回响v1
    // 设计意图：当玩家与NPC建立深厚关系(好感≥60)时，触发叙事回响，
    //    让NPC的过往故事浮出水面，增强世界沉浸感。
    // 心理学：叙事自我 — 他人的故事成为自我叙事的一部分
    // ========================================================================
    {
      id: "d932_npc_story_echo_v1",
      phase: "street",
      icon: "💬",
      title: "朋友的往事",
      story: "你和这位老朋友聊起了过去的事。\n\n他/她讲起年轻时的经历——那些你从未听过的故事，让你对这个熟悉的人有了全新的认识。",
      triggers: { minDay: 40, interval: 120, maxRepeats: 3, excludeFlags: ["_d932NpcStoryCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d932NpcStoryCd) return false;
        if (!st.relationships) return false;
        // 需要至少2个好感≥60的NPC
        var _highAffCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 60) _highAffCount++;
        }
        return _highAffCount >= 2 && st.player.day >= 40;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "💬 认真倾听",
          hint: "心智+15, 魅力+8, 置_d932StoryListener",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d932NpcStoryCd = true;
            st.flags._d932StoryListener = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💬 你认真倾听了朋友的往事——心智+15, 魅力+8。", "success");
            }
          }
        },
        {
          text: "😅 下次再说吧",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d932NpcStoryCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 下次再说吧。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: D→E 社交投资情报v1
    // 设计意图：社交圈中的NPC不仅是朋友，还是投资情报的来源。
    //    触发条件：玩家认识至少3个NPC且玩家有投资记录。
    // 心理学：社会比较 — 通过他人获得信息优势
    // ========================================================================
    {
      id: "d932_social_invest_intel_v1",
      phase: "street",
      icon: "📰",
      title: "朋友带来的投资消息",
      story: "你在和朋友聊天时，无意中听到了一条投资消息。\n\n「听说最近新能源板块有政策利好，我一个在里面的朋友说的。」朋友压低声音说道。",
      triggers: { minDay: 60, interval: 100, maxRepeats: 3, excludeFlags: ["_d932InvestIntelCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d932InvestIntelCd) return false;
        if (!st.relationships) return false;
        // 需要至少3个已结识NPC
        var _metCount = 0;
        for (var _id2 in st.relationships) {
          if (st.relationships[_id2] && st.relationships[_id2].met) _metCount++;
        }
        return _metCount >= 3 && st.player.day >= 60;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "📰 仔细打听详情",
          hint: "智力+12, 会计XP+18, 置_d932IntelNetwork",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d932InvestIntelCd = true;
            st.flags._d932IntelNetwork = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            grantXp("accounting", 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📰 你仔细打听了投资消息——智力+12, 会计XP+18。", "success");
            }
          }
        },
        {
          text: "😅 不太可靠",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d932InvestIntelCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 不太可靠。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: D→G 社交健康恢复v1
    // 设计意图：社交互动(与NPC见面/聊天)应促进心理健康恢复，
    //    让玩家感到"朋友是治愈的力量"。
    // 心理学：社会支持 — 社交支持缓解压力
    // ========================================================================
    {
      id: "d932_social_health_boost_v1",
      phase: "street",
      icon: "❤️",
      title: "友情是最好的良药",
      story: "你最近心情不太好，但一个朋友注意到了你的状态。\n\n「走，出去走走，别一个人闷着。」朋友拉着你出了门。\n\n有时候，一句关心的话就能让人好起来。",
      triggers: { minDay: 20, interval: 80, maxRepeats: 5, excludeFlags: ["_d932SocialHealthCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d932SocialHealthCd) return false;
        if (!st.relationships) return false;
        // 需要至少1个已结识NPC，且心情或心智偏低
        var _metCount2 = 0;
        for (var _id3 in st.relationships) {
          if (st.relationships[_id3] && st.relationships[_id3].met) { _metCount2++; break; }
        }
        if (_metCount2 < 1) return false;
        var _happiness = (st.needs && st.needs.happiness) || 50;
        var _mental = (st.player && st.player.mental) || 50;
        // 心情<45或心智<40时触发
        return (_happiness < 45 || _mental < 40) && st.player.day >= 20;
      },
      probability: 0.05,
      repeatable: true,
      choices: [
        {
          text: "❤️ 接受朋友的关心",
          hint: "心情+18, 心智+12, 置_d932SocialHealed",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d932SocialHealthCd = true;
            st.flags._d932SocialHealed = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("❤️ 朋友的关心让你感觉好多了——心情+18, 心智+12。", "success");
            }
          }
        },
        {
          text: "😅 想一个人待着",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d932SocialHealthCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 想一个人待着。心智+3。", "info");
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
/**
 * 域D(NPC/社交) 联动增强 R660
 * 桥接：
 *   D→A  d648_social_capital_rooted  社交资本扎根 → 消费 state.relationships 数据,
 *     社交→"人脉深深扎根"数据回响
 *   D→B  d648_npc_life_chapter  NPC人生章节 → 消费 state.relationships+state.player 数据,
 *     社交→"朋友的人生故事"叙事回响
 *   D→C  d648_career_network_bridge  职业网络桥梁 → 消费 state.relationships+state.skills 数据,
 *     社交→"人脉助事业"职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR660Loaded) return;
  RANDOM_EVENTS._domainDLinkageR660Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR660(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "d648_social_capital_rooted", phase: "street", _isChainEvent: false, icon: "🌳",
      title: "人脉深深扎根",
      story: "你在这座城市的人脉网络已经深深扎根——{desc}",
      triggers: { minDay: 200, interval: 300, maxRepeats: 1, excludeFlags: ["_d648RootedDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d648RootedDone) return false;
        var met = metNpcsR660(st);
        return met.length >= 10;
      },
      choices: [
        { text: "📊 量化人脉", hint: "智力+5,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d648RootedDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '人脉深深扎根,是最大的财富。' 你量化了社交资本。智力+5,心智+4。", "success");
        }},
        { text: "🤝 主动维护", hint: "全NPC好感+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d648RootedDone = true;
          var met = metNpcsR660(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 4, "扎根人脉"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '人脉是要维护的。' 你主动联系了朋友们。全NPC好感+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR660(st);
        var totalAff = 0;
        for (var i = 0; i < met.length; i++) { totalAff += met[i].affinity; }
        return "你在这座城市的人脉网络已经深深扎根——" + met.length + "位朋友,总好感" + totalAff + "。'人脉深深扎根,是最大的财富。'";
      }
    },
    {
      id: "d648_npc_life_chapter", phase: "street", _isChainEvent: false, icon: "📖",
      title: "朋友的人生故事",
      story: "你开始深入了解身边朋友的人生故事——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_d648ChapterCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d648ChapterCooldown) return false;
        var met = metNpcsR660(st);
        var highAff = 0;
        for (var i = 0; i < met.length; i++) { if (met[i].affinity >= 70) highAff++; }
        return highAff >= 1;
      },
      choices: [
        { text: "👂 倾听故事", hint: "好感+6,社交XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d648ChapterCooldown = true;
          var met = metNpcsR660(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 6, "倾听故事"); } catch(e) {}
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("👂 '每个人都有自己的故事。' 你认真倾听了朋友的故事。好感+6,社交XP+4。", "success");
        }},
        { text: "🤫 尊重隐私", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d648ChapterCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 '尊重隐私,是交友的基本。' 你选择了尊重。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR660(st);
        return "你开始深入了解身边朋友的人生故事——'" + (met.length > 0 ? met[0].name : "朋友") + "的故事,让我对TA有了更深的了解。'";
      }
    },
    {
      id: "d648_career_network_bridge", phase: "street", _isChainEvent: false, icon: "🌉",
      title: "人脉助事业",
      story: "你开始利用人脉网络来助力职业发展——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_d648BridgeDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d648BridgeDone) return false;
        var met = metNpcsR660(st);
        var highAff = 0;
        for (var i = 0; i < met.length; i++) { if (met[i].affinity >= 60) highAff++; }
        return highAff >= 2;
      },
      choices: [
        { text: "🙏 寻求帮助", hint: "管理XP+6,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d648BridgeDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
          var met = metNpcsR660(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "人脉助力"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙏 '人脉助事业。' 你寻求了朋友的帮助。管理XP+6,好感+3。", "success");
        }},
        { text: "💪 自己努力", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d648BridgeDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '靠人不如靠己。' 你选择自己努力。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始利用人脉网络来助力职业发展——'人脉助事业,贵人相助是关键。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

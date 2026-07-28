/**
 * 域D(NPC/社交) 联动增强 R707
 * 桥接：
 *   D→A  d707_social_capital_report 社交资本报告 → 消费 state.relationships 全量数据,
 *     将隐形人脉网络显性化为"社交资产"
 *   D→B  d707_npc_story_weaving NPC故事织网 → 消费 NPC关系+事件,
 *     让NPC关系变化产生叙事回响
 *   D→G  d707_social_wellbeing 社交幸福感 → 消费 社交数据+needs,
 *     社交生活质量影响身心健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR707Loaded) return;
  RANDOM_EVENTS._domainDLinkageR707Loaded = true;

  function hasMetNpcs(st) {
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var k in st.relationships) {
      if (st.relationships[k] && st.relationships[k].met) count++;
    }
    return count;
  }

  var EVENTS = [
    {
      id: "d707_social_capital_report", phase: "street", _isChainEvent: false, icon: "📊",
      title: "社交资本报告",
      story: "你回顾这段时间在城里结识的人——{desc}",
      triggers: { minDay: 90, interval: 120, maxRepeats: 3, excludeFlags: ["_d707SocCapCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d707SocCapCd) return false;
        return hasMetNpcs(st) >= 3 && st.player && st.player.day >= 90;
      },
      choices: [
        {
          text: "📈 梳理人脉", hint: "心智+5,置_d707NetworkAware",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d707SocCapCd = true;
            st.flags._d707NetworkAware = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '人脉不是认识多少人,而是多少人认识你。' 心智+5。", "success");
            }
          }
        },
        {
          text: "🤝 主动维护关系", hint: "社交XP+8,置_d707ActiveNet",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d707SocCapCd = true;
            st.flags._d707ActiveNet = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '关系是走出来的,不是等出来的。' 社交XP+8。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var met = hasMetNpcs(st);
        return "你在城里已经结识了" + met + "个人——'这些关系,是资源还是负担?'";
      }
    },
    {
      id: "d707_npc_story_weaving", phase: "street", _isChainEvent: false, icon: "🕸️",
      title: "NPC故事织网",
      story: "你发现身边NPC的故事正在交织——{desc}",
      triggers: { minDay: 120, interval: 150, maxRepeats: 3, excludeFlags: ["_d707StoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d707StoryCd) return false;
        if (!st.relationships) return false;
        var highAff = 0;
        for (var k in st.relationships) {
          var r = st.relationships[k];
          if (r && r.met && (r.affinity || 0) >= 60) highAff++;
        }
        return highAff >= 2 && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "👂 倾听他们的故事", hint: "心智+3,魅力+2,置_d707Listener",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d707StoryCd = true;
            st.flags._d707Listener = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 2);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("👂 '每个人都有自己的故事。' 心智+3,魅力+2。", "success");
            }
          }
        },
        {
          text: "📝 记录这些联系", hint: "智力+4,置_d707Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d707StoryCd = true;
            st.flags._d707Chronicler = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 '好记性不如烂笔头。' 智力+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        if (!st.relationships) return "你发现身边的人们正在产生联系...";
        var names = [];
        for (var k in st.relationships) {
          var r = st.relationships[k];
          if (r && r.met && (r.affinity || 0) >= 60) {
            var nm = k;
            if (typeof getNpcDisplayName === "function") nm = getNpcDisplayName(k);
            names.push(nm);
            if (names.length >= 3) break;
          }
        }
        return "你发现" + names.join("、") + "之间有着微妙的关系——'这些联系,会改变什么?'";
      }
    },
    {
      id: "d707_social_wellbeing", phase: "street", _isChainEvent: false, icon: "💚",
      title: "社交幸福感",
      story: "良好的社交关系让你的身心更加健康——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 4, excludeFlags: ["_d707WellbeingCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d707WellbeingCd) return false;
        if (!st.relationships || !st.needs || !st.status) return false;
        var closeCount = 0;
        for (var k in st.relationships) {
          var r = st.relationships[k];
          if (r && r.met && (r.affinity || 0) >= 30) closeCount++;
        }
        return closeCount >= 3 && st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "😊 感恩社交圈", hint: "心情+8,健康+2,置_d707Grateful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d707WellbeingCd = true;
            st.flags._d707Grateful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 '有朋友真好。' 心情+8,健康+2。", "success");
            }
          }
        },
        {
          text: "🏃 独自充电", hint: "心智+4,疲劳-5,置_d707Solo",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d707WellbeingCd = true;
            st.flags._d707Solo = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '独处也是一种力量。' 心智+4,疲劳-5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        if (!st.relationships) return "你感受到社交关系的温度...";
        var closeCount = 0;
        for (var k in st.relationships) {
          var r = st.relationships[k];
          if (r && r.met && (r.affinity || 0) >= 30) closeCount++;
        }
        return "你有" + closeCount + "位熟络的朋友——'这些关系,让你更健康。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

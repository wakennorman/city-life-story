/**
 * 域B(事件/叙事) 联动增强 R618
 * 桥接：
 *   B→D  b618_rumor_mill  市井谣言 → 消费 state.relationships 数据,
 *     事件→"三人成虎"的社交回响(好感越熟越易受谣言影响)
 *   B→E  b618_windfall_gamble  意外之财的抉择 → 消费 state.resources+state.investment 数据,
 *     事件→"横财是考验"的经济回响
 *   B→G  b618_midnight_reverie  深夜自省 → 消费 state.player+state.needs+state.flags 数据,
 *     事件→"夜阑卧听风吹雨"的生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR618Loaded) return;
  RANDOM_EVENTS._domainBLinkageR618Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR618(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "b618_rumor_mill", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "市井谣言",
      story: "街头巷尾流传着一个关于你熟人的说法——{desc}",
      triggers: { minDay: 45, interval: 90, maxRepeats: 3, excludeFlags: ["_b618RumorMillCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b618RumorMillCooldown) return false;
        var met = metNpcsR618(st);
        return met.length >= 2;
      },
      choices: [
        { text: "🤫 不信谣不传谣", hint: "心智+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b618RumorMillCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 '耳听为虚，眼见为实。' 你选择保持清醒。心智+3,心情+2。", "success");
        }},
        { text: "🤝 当面求证", hint: "好感±5,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b618RumorMillCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          var met = metNpcsR618(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            var target = met[0];
            try { applyAffinityChange(st, target.id, 5, "当面求证谣言"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '有事当面说清楚。' 你选择直接沟通,反而拉近了距离。心智+1,好感+5。", "success");
        }},
        { text: "😤 愤然反驳", hint: "心情-3,好感-3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b618RumorMillCooldown = true;
          if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          var met = metNpcsR618(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            var target = met[0];
            try { applyAffinityChange(st, target.id, -3, "愤然反驳"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("😤 '岂有此理!' 你怒而反驳,但心情和关系都受了影响。心情-3,好感-3。", "warning");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR618(st);
        var target = met.length > 0 ? met[0].name : "一位熟人";
        return "街头巷尾流传着一个关于" + target + "的说法——'听说TA最近出了点事,不知道真的假的。' 你决定怎么对待这个传言?";
      }
    },
    {
      id: "b618_windfall_gamble", phase: "street", _isChainEvent: false, icon: "🎰",
      title: "意外之财的抉择",
      story: "一笔意外之财从天而降——{desc}",
      triggers: { minDay: 30, interval: 120, maxRepeats: 2, excludeFlags: ["_b618WindfallCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b618WindfallCooldown) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash >= 2000 && cash <= 30000;
      },
      choices: [
        { text: "💰 稳稳存起来", hint: "心智+2,现金+800", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b618WindfallCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 800;
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '飞来横财,稳字当头。' 你把钱存好,心里踏实。心智+2,现金+¥800。", "success");
        }},
        { text: "📈 拿去投资", hint: "会计XP+5,现金+500/-500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b618WindfallCooldown = true;
          var gain = (typeof Random !== "undefined" && Random.chance(0.5)) ? 500 : -500;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) + gain);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage(gain > 0 ? "📈 '小赌怡情!' 你小赚一笔,投资经验+5。现金+¥500。" : "📉 '市场有风。' 你小亏一点,但积累了经验。现金-¥500。", gain > 0 ? "success" : "warning");
        }},
        { text: "🎁 请客花掉", hint: "心情+8,现金-1000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b618WindfallCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎁 '独乐乐不如众乐乐。' 你请朋友们吃了顿好的,心情+8,现金-¥1000。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一笔意外之财从天而降——'这钱来得太突然,你有点不知所措。' 横财是考验,你怎么处理?";
      }
    },
    {
      id: "b618_midnight_reverie", phase: "street", _isChainEvent: false, icon: "🌙",
      title: "深夜自省",
      story: "夜深人静,你躺在床上回想这些日子的起起伏伏——{desc}",
      triggers: { minDay: 60, interval: 150, maxRepeats: 2, excludeFlags: ["_b618ReverieCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b618ReverieCooldown) return false;
        var mental = (st.player && st.player.mental) || 50;
        var happy = (st.needs && st.needs.happiness) || 50;
        return mental < 60 || happy < 50;
      },
      choices: [
        { text: "📝 写下日记", hint: "智力+2,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b618ReverieCooldown = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 '把心事写下来,轻松多了。' 你记录下今天的感悟。智力+2,心智+3。", "success");
        }},
        { text: "🧘 静坐冥想", hint: "心情+6,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b618ReverieCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 '呼吸,放空,一切都会好的。' 你静坐片刻,内心平静许多。心情+6,心智+2。", "success");
        }},
        { text: "💪 立下决心", hint: "心智+5,置_b618ResolveFlag", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b618ReverieCooldown = true;
          st.flags._b618ResolveFlag = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '明天开始,不一样的活法。' 你暗下决心。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "夜深人静,你躺在床上回想这些日子的起起伏伏——'走到今天不容易,但前面的路还长。' 你决定如何面对自己?";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

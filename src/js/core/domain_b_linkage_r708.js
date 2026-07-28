/**
 * 域B(事件/叙事) 联动增强 R708
 * 桥接：
 *   B→D  b708_shared_memory              共同记忆 → 消费 state.flags,
 *     经历重大事件后与NPC分享回忆，增进社交关系
 *   B→E  b708_event_economic_lesson       事件经济教训 → 消费 state.flags,
 *     事件经历塑造财富观
 *   B→G  b708_narrative_resilience        叙事韧性 → 消费 state.flags,
 *     故事让人成长，获得心智提升
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR708Loaded) return;
  RANDOM_EVENTS._domainBLinkageR708Loaded = true;

  function eventCount(st) {
    return (st && st.flags && st.flags._eventHistory) ? st.flags._eventHistory.length : 0;
  }

  var EVENTS = [
    {
      id: "b708_shared_memory", phase: "street", _isChainEvent: false, icon: "💭",
      title: "共同记忆",
      story: "经历过的那些事,成了你和朋友之间的共同话题——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 3, excludeFlags: ["_b708MemoryCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._b708MemoryCd) return false;
        return st.player && st.player.day >= 60 && st.relationships;
      },
      choices: [
        {
          text: "🤝 约老朋友叙旧", hint: "社交XP+4,好感+2,置_b708OldFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b708MemoryCd = true;
            st.flags._b708OldFriend = true;
            if (typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, "ajie", 2, "共同记忆"); } catch(e) {}
              try { applyAffinityChange(st, "old_zhou", 2, "共同记忆"); } catch(e) {}
            }
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 和老朋友聊起往事,大家都笑了。社交XP+4,好感+2。", "success");
            }
          }
        },
        {
          text: "📝 写日记", hint: "心智+5,置_b708Diary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b708MemoryCd = true;
            st.flags._b708Diary = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 把经历写下来,是对过去的梳理,也是对未来的思考。心智+5。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "经历了那么多,你发现——'那些曾经以为过不去的坎,现在都成了下酒菜。'";
      }
    },
    {
      id: "b708_event_economic_lesson", phase: "street", _isChainEvent: false, icon: "💡",
      title: "生活的经济学",
      story: "每一次经历都在教你如何对待金钱——{desc}",
      triggers: { minDay: 45, interval: 80, maxRepeats: 3, excludeFlags: ["_b708EconCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._b708EconCd) return false;
        return st.player && st.player.day >= 45;
      },
      choices: [
        {
          text: "💰 存钱应急", hint: "心智+4,置_b708SaveMoney",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b708EconCd = true;
            st.flags._b708SaveMoney = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 经历过手头拮据的日子,你懂得了存钱的重要性。心智+4。", "success");
            }
          }
        },
        {
          text: "📊 学习理财", hint: "会计XP+6,智力+2,置_b708Finance",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b708EconCd = true;
            st.flags._b708Finance = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 吃一堑长一智,开始学习理财知识。会计XP+6,智力+2。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "'钱不是万能的,但没有钱是万万不能的'——这句话,你比谁都懂。";
      }
    },
    {
      id: "b708_narrative_resilience", phase: "street", _isChainEvent: false, icon: "🌱",
      title: "故事的力量",
      story: "那些艰难的日子,最终都化作了你的力量——{desc}",
      triggers: { minDay: 80, interval: 100, maxRepeats: 2, excludeFlags: ["_b708ResilienceCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._b708ResilienceCd) return false;
        return st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "💪 从经历中汲取力量", hint: "心智+6,健康+3,置_b708Strong",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b708ResilienceCd = true;
            st.flags._b708Strong = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 '那些杀不死你的,终将使你更强大。' 心智+6,健康+3。", "success");
            }
          }
        },
        {
          text: "🎯 重新出发", hint: "智力+5,管理XP+3,置_b708NewStart",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b708ResilienceCd = true;
            st.flags._b708NewStart = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '每一次跌倒,都是为了更好地站起来。' 智力+5,管理XP+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "回望来路,你发现——'故事,是最好的老师。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
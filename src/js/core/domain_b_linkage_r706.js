/**
 * 域B(事件/叙事) 联动增强 R706
 * 桥接：
 *   B→D  b706_narrative_resonance    叙事共鸣 → 消费 state.flags._eventHistory,
 *     经历重大事件后与NPC分享回忆，增进社交关系
 *   B→C  b706_event_career_inspire    事件职业灵感 → 消费 state.flags._eventHistory,
 *     事件经历激发职业灵感，获得技能成长
 *   B→G  b706_narrative_growth        叙事成长 → 消费 state.flags._eventHistory,
 *     经历塑造人生韧性，获得心智+健康加成
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR706Loaded) return;
  RANDOM_EVENTS._domainBLinkageR706Loaded = true;

  function eventCount(st) {
    return (st && st.flags && st.flags._eventHistory) ? st.flags._eventHistory.length : 0;
  }

  function getRandomNpc(st) {
    if (!st || !st.relationships) return null;
    var npcIds = Object.keys(st.relationships);
    if (npcIds.length === 0) return null;
    var known = npcIds.filter(function (id) {
      return st.relationships[id] && st.relationships[id].met;
    });
    if (known.length === 0) return null;
    var idx = (typeof Random !== "undefined" && Random.int) ? Random.int(0, known.length - 1) : 0;
    return known[idx];
  }

  var EVENTS = [
    // === B→D 叙事共鸣：与NPC分享事件回忆 ===
    {
      id: "b706_narrative_resonance",
      phase: "street",
      _isChainEvent: false,
      icon: "💬",
      title: "往事如烟",
      story: "你坐在街边，回想起这段时间经历的风风雨雨。这时一个熟悉的身影走了过来——",
      triggers: { minDay: 60, interval: 90, maxRepeats: 3, excludeFlags: ["_b706NarrativeCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._b706NarrativeCd) return false;
        return eventCount(st) >= 10 && st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "📖 和对方聊聊这些经历",
          hint: "社交XP+5,与该NPC好感+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b706NarrativeCd = true;
            var npcId = getRandomNpc(st);
            if (npcId && st.relationships[npcId]) {
              st.relationships[npcId].affinity = Math.min(100, (st.relationships[npcId].affinity || 0) + 8);
              if (typeof StateManager !== "undefined") {
                StateManager.addMessage("💬 你与" + (npcId) + "分享了最近的经历，关系更近了。好感+8。", "success");
              }
            }
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          }
        },
        {
          text: "🤝 请对方吃顿饭，边吃边聊",
          hint: "社交XP+8,与该NPC好感+12,花费¥200",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b706NarrativeCd = true;
            if ((st.resources.cash || 0) >= 200) {
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
              var npcId = getRandomNpc(st);
              if (npcId && st.relationships[npcId]) {
                st.relationships[npcId].affinity = Math.min(100, (st.relationships[npcId].affinity || 0) + 12);
                if (typeof StateManager !== "undefined") {
                  StateManager.addMessage("🍽️ 你和" + (npcId) + "边吃边聊，回忆往事。好感+12。", "success");
                }
              }
              if (typeof addSkillXp === "function") { try { addSkillXp("social", 8); } catch(e) {} }
            } else {
              if (typeof StateManager !== "undefined") {
                StateManager.addMessage("💰 你摸了摸口袋，还是下次再请吧。", "hint");
              }
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "经历了" + eventCount(st) + "次事件后，你发现自己有很多故事可以讲了。";
      }
    },
    // === B→C 事件职业灵感 ===
    {
      id: "b706_event_career_inspire",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "经历的启示",
      story: "回顾这些日子的经历，你突然意识到——有些事件其实在悄悄指引你的职业方向。",
      triggers: { minDay: 90, interval: 120, maxRepeats: 2, excludeFlags: ["_b706CareerCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._b706CareerCd) return false;
        return eventCount(st) >= 15 && st.player && st.player.day >= 90;
      },
      choices: [
        {
          text: "🔧 从经历中提炼技能方向",
          hint: "技能XP+15,智力+3,置_b706SkillInsight",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b706CareerCd = true;
            st.flags._b706SkillInsight = true;
            // 给所有技能加少量XP，模拟"从经历中学习"
            if (st.skills && typeof st.skills === "object") {
              for (var sk in st.skills) {
                if (st.skills[sk] && typeof st.skills[sk].xp === "number") {
                  st.skills[sk].xp += 3;
                }
              }
            }
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 你从经历中提炼出技能方向，全部技能XP+3，智力+3。", "success");
            }
          }
        },
        {
          text: "📝 记录职业灵感笔记",
          hint: "会计XP+10,管理XP+10,置_b706CareerNote",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b706CareerCd = true;
            st.flags._b706CareerNote = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 10); } catch(e) {} }
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 你认真记录了职业灵感。会计XP+10，管理XP+10。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "那些" + eventCount(st) + "次经历，慢慢拼凑出了你未来的职业图景。";
      }
    },
    // === B→G 叙事成长：经历塑造人生韧性 ===
    {
      id: "b706_narrative_growth",
      phase: "street",
      _isChainEvent: false,
      icon: "🌱",
      title: "成长的代价",
      story: "你站在城市的天桥上，看着脚下车水马龙。一路走来，经历的风雨已经把你变成了另一个人。",
      triggers: { minDay: 150, interval: 180, maxRepeats: 1, excludeFlags: ["_b706GrowthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._b706GrowthCd) return false;
        return eventCount(st) >= 25 && st.player && st.player.day >= 150;
      },
      choices: [
        {
          text: "🌟 感谢所有的经历——无论好坏",
          hint: "心智+6,心情+12,置_b706Grateful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b706GrowthCd = true;
            st.flags._b706Grateful = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            }
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌟 经历是最好的老师。心智+6，心情+12。", "success");
            }
          }
        },
        {
          text: "💪 把伤痛转化为力量",
          hint: "体质+4,心智+4,置_b706Stronger",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b706GrowthCd = true;
            st.flags._b706Stronger = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
              st.player.strength = Math.min(100, (st.player.strength || 50) + 4);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 那些杀不死你的，终将使你更强大。体质+4，心智+4。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "从最初的迷茫到现在的从容——" + eventCount(st) + "次事件，把你锻造成了今天的自己。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
/**
 * 域B(事件/叙事) 联动增强 R684
 * 桥接：
 *   B→A  b684_event_data_legacy     事件数据遗产 → 消费 state.flags._eventHistory,
 *     过往事件成为人生数据资产
 *   B→E  b684_story_wealth_lesson    故事财富教训 → 消费 state.flags+state.resources,
 *     经历转化为财富智慧
 *   B→G  b684_narrative_resilience   叙事韧性 → 消费 state.flags+state.player,
 *     故事让人更强大(心理韧性)
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR684Loaded) return;
  RANDOM_EVENTS._domainBLinkageR684Loaded = true;

  function eventCount(st) {
    return (st && st.flags && st.flags._eventHistory) ? st.flags._eventHistory.length : 0;
  }

  var EVENTS = [
    {
      id: "b684_event_data_legacy",
      phase: "street",
      _isChainEvent: false,
      icon: "📚",
      title: "经历是最宝贵的数据",
      story: "你开始把经历当作财富",
      triggers: { minDay: 100, interval: 120, maxRepeats: 2, excludeFlags: ["_b684LegacyCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._b684LegacyCd) return false;
        return eventCount(st) >= 20 && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "📖 写回忆录",
          hint: "心智+6,智力+2,置_b684Writer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b684LegacyCd = true;
            st.flags._b684Writer = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 把经历写下来,就是最好的传承。心智+6,智力+2。", "success");
            }
          }
        },
        {
          text: "🤫 记在心里",
          hint: "心智+4,置_b684Keeper",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b684LegacyCd = true;
            st.flags._b684Keeper = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤫 有些事,记在心里就好。心智+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "经历了" + eventCount(st) + "次事件——'每一段经历,都是人生数据库里的一条记录。'";
      }
    },
    {
      id: "b684_story_wealth_lesson",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "经历教会你的财富课",
      story: "每一段经历都藏着财富教训",
      triggers: { minDay: 80, interval: 100, maxRepeats: 2, excludeFlags: ["_b684WealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._b684WealthCd) return false;
        return eventCount(st) >= 15 && st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "📊 总结规律",
          hint: "会计XP+5,智力+3,置_b684Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b684WealthCd = true;
            st.flags._b684Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 经历是最好的老师。会计XP+5,智力+3。", "success");
            }
          }
        },
        {
          text: "💡 应用到投资",
          hint: "管理XP+4,置_b684ApplyInvest",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b684WealthCd = true;
            st.flags._b684ApplyInvest = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 把经历转化为投资智慧。管理XP+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "那些赚过的钱、亏过的本、遇到的人——'每一段经历,都是免费的财富课。'";
      }
    },
    {
      id: "b684_narrative_resilience",
      phase: "street",
      _isChainEvent: false,
      icon: "💪",
      title: "故事让人更强大",
      story: "回顾过往,你发现自己变强了",
      triggers: { minDay: 120, interval: 150, maxRepeats: 2, excludeFlags: ["_b684ResilienceCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._b684ResilienceCd) return false;
        return eventCount(st) >= 25 && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "🌟 感恩经历",
          hint: "心情+8,心智+4,置_b684Grateful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b684ResilienceCd = true;
            st.flags._b684Grateful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌟 每一次跌倒,都是站起来的力量。心情+8,心智+4。", "success");
            }
          }
        },
        {
          text: "🎯 继续前行",
          hint: "智力+4,置_b684MoveOn",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b684ResilienceCd = true;
            st.flags._b684MoveOn = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 前方还有更多故事等着。智力+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "从最初的无措,到现在的从容——'" + eventCount(st) + "次事件,把你锻造成了今天的自己。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

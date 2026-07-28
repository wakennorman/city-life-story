/**
 * 域B(事件/叙事) 联动增强 R692
 * 桥接：
 *   B→A  b692_event_pattern_library_v2 事件模式库v2 → 消费 state.flags._eventHistory,
 *     从经历中提炼智慧(认知负荷)
 *   B→E  b692_story_investment_wisdom  故事投资智慧 → 消费 state.flags+state.investment,
 *     经历塑造财富观
 *   B→H  b692_corp_legend_seed         公司传奇种子 → 消费 state.flags+state.startup,
 *     个人故事成为公司文化基因
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR692Loaded) return;
  RANDOM_EVENTS._domainBLinkageR692Loaded = true;

  function eventCount(st) {
    return (st && st.flags && st.flags._eventHistory) ? st.flags._eventHistory.length : 0;
  }

  var EVENTS = [
    {
      id: "b692_event_pattern_library_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📚",
      title: "经历是最好的老师",
      story: "你开始建立自己的事件模式库",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_b692LibCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._b692LibCd) return false;
        return eventCount(st) >= 30 && st.player && st.player.day >= 150;
      },
      choices: [
        {
          text: "📊 深度分析",
          hint: "智力+6,心智+4,置_b692Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b692LibCd = true;
            st.flags._b692Analyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 从经历中提炼智慧,是最好的学习。智力+6,心智+4。", "success");
            }
          }
        },
        {
          text: "📖 写总结",
          hint: "管理XP+5,智力+2,置_b692Writer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b692LibCd = true;
            st.flags._b692Writer = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 把规律写下来,就是知识。管理XP+5,智力+2。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "经历了" + eventCount(st) + "次事件——'每一段经历,都是人生数据库里珍贵的记录。'";
      }
    },
    {
      id: "b692_story_investment_wisdom",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "经历塑造财富观",
      story: "你经历过的那些事,教会了你很多关于金钱的道理",
      triggers: { minDay: 120, interval: 150, maxRepeats: 2, excludeFlags: ["_b692WealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._b692WealthCd) return false;
        return eventCount(st) >= 20 && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "🛡️ 稳健为主",
          hint: "心智+6,置_b692Safe(损失厌恶)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b692WealthCd = true;
            st.flags._b692Safe = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🛡️ 经历过穷,更懂得稳健。心智+6。", "success");
            }
          }
        },
        {
          text: "🚀 适度冒险",
          hint: "智力+4,置_b692Risk",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b692WealthCd = true;
            st.flags._b692Risk = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 风险与收益并存。智力+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "那些赚过的钱、亏过的本——'经历过穷,才知道钱的重要;经历过亏,才知道风险的可怕。'";
      }
    },
    {
      id: "b692_corp_legend_seed",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌱",
      title: "公司传奇的种子",
      story: "你的个人故事正在成为公司文化的一部分",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_b692CorpCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._b692CorpCd) return false;
        return st.startup && st.startup.company && st.startup.active && eventCount(st) >= 25 && st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "📖 编写公司故事集",
          hint: "管理XP+8,置_b682StoryBook(文化传承)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b692CorpCd = true;
            st.flags._b692StoryBook = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 每个公司都有自己的故事,你就是创始人。管理XP+8。", "success");
            }
          }
        },
        {
          text: "🗣️ 开分享会",
          hint: "社交XP+5,置_b692Share",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b692CorpCd = true;
            st.flags._b692Share = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗣️ 分享经历,凝聚人心。社交XP+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "从个人故事到公司文化——'你的经历,就是公司最好的文化基因。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

/**
 * 域B(事件/叙事) 联动增强 R674
 * 桥接：
 *   B→H  b674_story_corp_heritage   故事公司文化 → 消费 state.corporate+state.flags._eventHistory 数据,
 *     职场故事沉淀为公司文化资产
 *   B→E  b674_event_econ_wisdom     事件经济智慧 → 消费 state.flags._eventHistory+state.investment 数据,
 *     经历重大事件后提升经济判断力
 *   B→F  b674_event_life_milestone  事件人生里程碑 → 消费 state.flags._eventHistory 数据,
 *     将重大事件标记为人生里程碑供UI展示
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR674Loaded) return;
  RANDOM_EVENTS._domainBLinkageR674Loaded = true;

  // 辅助：获取事件历史中特定类型事件的数量
  function countEventType(st, typePrefix) {
    if (!st || !st.flags || !st.flags._eventHistory) return 0;
    var count = 0;
    for (var i = 0; i < st.flags._eventHistory.length; i++) {
      var e = st.flags._eventHistory[i];
      if (e && e.id && e.id.indexOf(typePrefix) === 0) count++;
    }
    return count;
  }

  // 辅助：获取事件历史总数
  function totalEvents(st) {
    if (!st || !st.flags || !st.flags._eventHistory) return 0;
    return st.flags._eventHistory.length;
  }

  var EVENTS = [
    {
      id: "b674_story_corp_heritage", phase: "corporate", _isChainEvent: false, icon: "🏛️",
      title: "故事公司文化",
      story: "你在职场经历的风风雨雨，正在成为公司文化的一部分——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_b674CorpHertDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b674CorpHertDone) return false;
        if (!st.corporate || !st.corporate.active) return false;
        var evtCount = totalEvents(st);
        return evtCount >= 30;
      },
      choices: [
        { text: "📖 编写公司故事集", hint: "管理XP+10,公司文化+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b674CorpHertDone = true;
          st.flags._corpStoryBook = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch(e) {} }
          if (st.corporate) st.corporate.culture = Math.min(100, (st.corporate.culture || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '每个公司都有自己的故事。' 你整理了公司发展历程中的关键时刻。管理XP+10,公司文化+5。", "success");
        }},
        { text: "🗣️ 开分享会", hint: "社交XP+6,团队凝聚力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b674CorpHertDone = true;
          if (typeof addSkillXp === "function") {
            try { addSkillXp("social", 6); } catch(e) {}
            try { addSkillXp("management", 3); } catch(e) {}
          }
          if (st.corporate) st.corporate.morale = Math.min(100, (st.corporate.morale || 0) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗣️ '分享经历,凝聚人心。' 你组织了团队分享会。社交XP+6,团队士气+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var evtCount = totalEvents(st);
        return "你在职场经历的风风雨雨,正在成为公司文化的一部分——'经历了" + evtCount + "次事件洗礼,你的故事就是公司的历史。'";
      }
    },
    {
      id: "b674_event_econ_wisdom", phase: "street", _isChainEvent: false, icon: "🧠",
      title: "事件经济智慧",
      story: "回顾过往经历,你发现每一次重大事件都藏着经济规律——{desc}",
      triggers: { minDay: 120, interval: 200, maxRepeats: 2, excludeFlags: ["_b674EconWisdomCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b674EconWisdomCooldown) return false;
        var evtCount = totalEvents(st);
        return evtCount >= 15;
      },
      choices: [
        { text: "📊 总结经济规律", hint: "会计XP+8,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b674EconWisdomCooldown = true;
          st.flags._eventEconWisdom = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 8); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '历史不会重复,但规律会。' 你从过往事件中总结出经济规律。会计XP+8,智力+3。", "success");
        }},
        { text: "💡 调整投资策略", hint: "投资分析+1,管理XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b674EconWisdomCooldown = true;
          st.flags._eventDrivenInvestor = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '事件驱动投资,经验是最好的风控。' 你调整了投资策略。管理XP+4,投资分析能力提升。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var evtCount = totalEvents(st);
        var moralCount = countEventType(st, "moral_");
        return "回顾过往经历,你发现每一次重大事件都藏着经济规律——'经历了" + evtCount + "次事件(其中" + moralCount + "次道德抉择),你开始从故事中读懂经济运行的逻辑。'";
      }
    },
    {
      id: "b674_event_life_milestone", phase: "street", _isChainEvent: false, icon: "🏆",
      title: "人生里程碑",
      story: "翻看记忆,那些刻骨铭心的时刻构成了你的人生轨迹——{desc}",
      triggers: { minDay: 90, interval: 180, maxRepeats: 3, excludeFlags: ["_b674MilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b674MilestoneCooldown) return false;
        var evtCount = totalEvents(st);
        return evtCount >= 10;
      },
      choices: [
        { text: "📝 写人生日记", hint: "心智+5,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b674MilestoneCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          // 标记里程碑事件以供UI展示
          if (!st.flags._milestoneEvents) st.flags._milestoneEvents = [];
          st.flags._milestoneEvents.push({
            id: "b674_milestone_" + (st.player.day || 0),
            day: st.player.day || 0,
            title: "人生里程碑·第" + (st.player.day || 0) + "天",
          });
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 '记录生活,就是记录成长。' 你写下了人生日记。心智+5,心情+5。", "success");
        }},
        { text: "🗺️ 规划未来", hint: "智力+4,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b674MilestoneCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗺️ '回顾过去,才能更好地规划未来。' 你根据人生经历制定了新的目标。智力+4,管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var evtCount = totalEvents(st);
        return "翻看记忆,那些刻骨铭心的时刻构成了你的人生轨迹——'第" + (st.player ? st.player.day : 0) + "天,已经经历了" + evtCount + "次值得铭记的事件。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
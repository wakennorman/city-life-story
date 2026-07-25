/**
 * 域B(事件/叙事) 联动增强 R259
 * 叙事积累的多维回响——事件不仅是文字泡，还在人生节点/职业/社交层面留下痕迹。
 * 桥接：
 *   B→G  life_chapter_reflection  人生节点回顾→自我叙事（核心机制·生命主线）
 *   B→C  career_crossroads        同职业路径满N天→职业抉择叙事（职业/成长·人生十字路口）
 *   B→D  npc_reunion             许久未互动NPC→重逢叙事（社交·情感觉醒）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR259Loaded) return;
  RANDOM_EVENTS._domainBLinkageR259Loaded = true;

  function getMostNeglectedNpcB259(st) {
    if (!st || !st.relationships || !st.player) return null;
    var oldest = null;
    var oldestDay = 9999;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (!r || !r.met) continue;
      var lastDay = r._lastInteractionDay || 0;
      var daysSince = st.player.day - lastDay;
      if (daysSince > 30 && daysSince < oldestDay) {
        oldestDay = daysSince;
        oldest = id;
      }
    }
    return oldest;
  }

  var EVENTS = [
    {
      id: "life_chapter_reflection",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "人生章节",
      story: "你坐在出租屋的床边，回顾这些年的日子。\n\n从初来乍到的窘迫，到现在的安稳——或者不安稳。你经历了无数个第一次：第一次赚到钱、第一次被解雇、第一次在深夜哭出来、第一次觉得自己长大了。\n\n人生没有重启键，但每一章都值得被记住。",
      triggers: { minDay: 180, excludeFlags: ["_lifeChapterSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 10;
      },
      choices: [
        {
          text: "📖 写一篇日记记录下来",
          hint: "心智+8，心情+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeChapterSeen = true;
            st.flags._lifeJournalKeeper = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了一篇日记。文字让模糊的记忆变得清晰。心智+8，心情+5。", "success");
            }
          },
        },
        {
          text: "🤫 不用记录，经历过就够了",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeChapterSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你觉得不需要形式化，经历过就够了。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "career_crossroads",
      phase: "street",
      _isChainEvent: false,
      icon: "🔀",
      title: "职业十字路口",
      story: "你在这条路上走了很久了。每天重复着类似的工作，类似的人，类似的烦恼。\n\n有时候你会想：要不要换一条路？要不要回到学校？要不要试试那个一直想做但不敢做的事？\n\n十字路口并不可怕。可怕的是站在原地太久，忘了自己还能选择。",
      triggers: { minDay: 200, excludeFlags: ["_careerCrossroadsSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 180;
      },
      choices: [
        {
          text: "🔀 认真考虑换条路",
          hint: "心智+6，解锁职业探索flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerCrossroadsSeen = true;
            st.flags._careerExploration = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔀 你开始认真考虑换条路。改变需要勇气，但停在原地需要更大的勇气。心智+6。", "info");
            }
          },
        },
        {
          text: "💪 继续深耕，行行出状元",
          hint: "心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerCrossroadsSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💪 你决定继续深耕。万事贵在坚持。心智+5。", "success");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "npc_reunion",
      phase: "street",
      _isChainEvent: false,
      icon: "👋",
      title: "好久不见",
      story: "你在街上走着，一个熟悉的身影迎面走来。是好久没见的熟人。\n\n「哎呀，好久不见！最近怎么样？」对方笑着打招呼。\n\n你们站在路边聊了很久，从近况聊到过去，从过去聊到未来。分别的时候，你突然意识到——这座城市里，总有些人是在乎你的。",
      triggers: { minDay: 60, excludeFlags: ["_npcReunionSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var npc = getMostNeglectedNpcB259(st);
        return !!npc;
      },
      choices: [
        {
          text: "🤝 交换联系方式，保持联系",
          hint: "NPC好感+5，心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcReunionSeen = true;
            var npc = getMostNeglectedNpcB259(st);
            if (npc && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, npc, 5, "街头重逢");
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你们交换了联系方式。有些人，不见面不代表忘记。好感+5，心智+4。", "success");
            }
          },
        },
        {
          text: "👋 点头微笑，各自前行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcReunionSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👋 你们点头微笑，各自前行。有些关系，淡淡的刚好。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

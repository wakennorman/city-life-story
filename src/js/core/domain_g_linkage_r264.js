/**
 * 域G(核心机制/生命周期) 联动增强 R264
 * 核心机制的多维回响——pipeline不仅是状态机，还在叙事/UI/社交层面留下痕迹。
 * 桥接：
 *   G→F  life_pipeline_dashboard  人生进度UI面板（UI/UX信息展示）
 *   G→D  life_event_npc_reaction  人生节点→NPC反应（社交·情感觉醒）
 *   G→B  life_chapter_narrative    人生章节→叙事事件（事件/叙事·生命主线）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR264Loaded) return;
  RANDOM_EVENTS._domainGLinkageR264Loaded = true;

  var EVENTS = [
    {
      id: "life_pipeline_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "人生进度",
      story: "你打开手机，看到自己这些年的人生进度——工作了多少天、赚了多少钱、认识了多少人、经历了多少事。\n\n这些数字和图表，是你在这座城市存在过的证据。每一个百分比，都是一天一天熬出来的。",
      triggers: { minDay: 90, excludeFlags: ["_lifePipelineSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 90;
      },
      choices: [
        {
          text: "📊 截个图保存",
          hint: "心情+5，解锁人生面板flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifePipelineSeen = true;
            st.flags._lifeDashboard = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你截下了人生进度面板。这些数字，是你一点一滴攒出来的。心情+5。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续生活",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifePipelineSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用形式化，继续生活。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "life_event_npc_reaction",
      phase: "street",
      _isChainEvent: false,
      icon: "👥",
      title: "有人记得你",
      story: "你经历了一件人生大事——也许是搬家、也许是升职、也许是病了一场。\n\n没想到，有朋友主动打来电话关心你。\n\n「听说你最近怎么样？需要帮忙吗？」\n\n你突然意识到，自己不是一个人在这座城市里。",
      triggers: { minDay: 120, excludeFlags: ["_lifeEventNpcReactionSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var metNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 30) metNpcs++;
        }
        return metNpcs >= 1;
      },
      choices: [
        {
          text: "🤝 感谢朋友的关心",
          hint: "NPC好感+5，心情+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeEventNpcReactionSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 30) {
                  applyAffinityChange(st, id, 5, "人生节点关怀");
                }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你感谢了朋友的关心。有人记得你，是一件温暖的事。好感+5，心情+8。", "success");
            }
          },
        },
        {
          text: "👋 谢谢，但我能自己扛",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeEventNpcReactionSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👋 你谢绝了朋友的帮助。独立，是一种力量。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "life_chapter_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "人生篇章",
      story: "你站在人生的某个节点上，回头看看走过的路。\n\n从初来乍到的窘迫，到现在有了工作、有了朋友、有了属于自己的生活。这一章不算精彩，但足够真实。\n\n下一章会写什么？你不知道。但你已经准备好了。",
      triggers: { minDay: 365, excludeFlags: ["_lifeChapterNarrativeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 365;
      },
      choices: [
        {
          text: "📖 写一篇年末总结",
          hint: "心智+10，心情+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeChapterNarrativeSeen = true;
            st.flags._lifeJournalKeeper = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了一篇年末总结。文字让模糊的记忆变得清晰。心智+10，心情+8。", "success");
            }
          },
        },
        {
          text: "🤫 不用总结，继续前行",
          hint: "心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeChapterNarrativeSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你觉得不用总结，继续前行。心智+5。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

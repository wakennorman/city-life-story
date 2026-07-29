/**
 * 域G(核心机制/生命周期) 联动增强 R764 (第八轮循环)
 * 桥接：
 *   G→A  g764_life_data_v8 人生数据v8 → 消费 全维度状态
 *   G→B  g764_life_chapter_v7 人生章节v7 → 消费 life_nodes+story_chapters
 *   G→D  g764_life_social_v7 人生社交v7 → 消费 年龄+关系
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR764Loaded) return;
  RANDOM_EVENTS._domainGLinkageR764Loaded = true;

  var EVENTS = [
    {
      id: "g764_life_data_v8", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生数据报告",
      story: "你的每一天都在积累数据——{desc}",
      triggers: { minDay: 800, interval: 900, maxRepeats: 3, excludeFlags: ["_g764DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g764DataCd) return false;
        return st.player && st.player.day >= 800 && st.status && st.needs;
      },
      choices: [
        {
          text: "📈 分析人生数据", hint: "智力+18,心智+15,置_g764Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g764DataCd = true;
            st.flags._g764Analyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据,是人生的刻度。' 智力+18,心智+15。", "success");
            }
          }
        },
        {
          text: "🎯 设定人生目标", hint: "心智+18,置_g764GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g764DataCd = true;
            st.flags._g764GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,人生才有方向。' 心智+18。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        return "你已度过" + days + "天——'这些数据,就是你的人生。'";
      }
    },
    {
      id: "g764_life_chapter_v7", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生章节",
      story: "你的人生正在翻开新的篇章——{desc}",
      triggers: { minDay: 700, interval: 800, maxRepeats: 3, excludeFlags: ["_g764ChapterCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g764ChapterCd) return false;
        return st.player && st.player.day >= 700;
      },
      choices: [
        {
          text: "📜 回顾过往", hint: "心智+18,置_g764Reviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g764ChapterCd = true;
            st.flags._g764Reviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '回望来路,方知归处。' 心智+18。", "success");
            }
          }
        },
        {
          text: "✍️ 书写新篇章", hint: "智力+15,魅力+12,置_g764Writer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g764ChapterCd = true;
            st.flags._g764Writer = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 12);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("✍️ '人生如书,每一页都值得期待。' 智力+15,魅力+12。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        var years = Math.floor(days / 365) + 1;
        return "你已度过" + years + "年——'人生如书,每一章都值得回味。'";
      }
    },
    {
      id: "g764_life_social_v7", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "人生社交里程碑",
      story: "在这个人生阶段,你的社交关系值得庆祝——{desc}",
      triggers: { minDay: 600, interval: 700, maxRepeats: 3, excludeFlags: ["_g764SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g764SocialCd) return false;
        return st.player && st.player.day >= 600 && st.relationships;
      },
      choices: [
        {
          text: "🤝 庆祝友谊", hint: "心情+20,社交XP+20,置_g764Celebrator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g764SocialCd = true;
            st.flags._g764Celebrator = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 '友谊,是人生最珍贵的财富。' 心情+20,社交XP+20。", "success");
            }
          }
        },
        {
          text: "💭 反思社交", hint: "心智+18,置_g764SocialThinker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g764SocialCd = true;
            st.flags._g764SocialThinker = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💭 '反思,让关系更深刻。' 心智+18。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        if (!st.relationships) return "社交关系,是人生的重要组成部分...";
        var metCount = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met) metCount++;
        }
        return "你有" + metCount + "位结识的朋友——'这些关系,值得庆祝。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

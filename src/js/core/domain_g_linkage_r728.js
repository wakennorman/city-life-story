/**
 * 域G(核心机制/生命周期) 联动增强 R728 (第三轮循环)
 * 桥接：
 *   G→A  g728_life_data_v3 人生数据v3 → 消费 全维度状态
 *   G→B  g728_life_chapter_v2 人生章节v2 → 消费 life_nodes+story_chapters
 *   G→D  g728_life_social_v2 人生社交v2 → 消费 年龄+关系
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR728Loaded) return;
  RANDOM_EVENTS._domainGLinkageR728Loaded = true;

  var EVENTS = [
    {
      id: "g728_life_data_v3", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生数据报告",
      story: "你的每一天都在积累数据——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 3, excludeFlags: ["_g728DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g728DataCd) return false;
        return st.player && st.player.day >= 250 && st.status && st.needs;
      },
      choices: [
        {
          text: "📈 分析人生数据", hint: "智力+7,心智+5,置_g728Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g728DataCd = true;
            st.flags._g728Analyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 7);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据,是人生的刻度。' 智力+7,心智+5。", "success");
            }
          }
        },
        {
          text: "🎯 设定人生目标", hint: "心智+8,置_g728GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g728DataCd = true;
            st.flags._g728GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,人生才有方向。' 心智+8。", "info");
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
      id: "g728_life_chapter_v2", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生章节",
      story: "你的人生正在翻开新的篇章——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 3, excludeFlags: ["_g728ChapterCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g728ChapterCd) return false;
        return st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "📜 回顾过往", hint: "心智+7,置_g728Reviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g728ChapterCd = true;
            st.flags._g728Reviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '回望来路,方知归处。' 心智+7。", "success");
            }
          }
        },
        {
          text: "✍️ 书写新篇章", hint: "智力+6,魅力+4,置_g728Writer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g728ChapterCd = true;
            st.flags._g728Writer = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 4);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("✍️ '人生如书,每一页都值得期待。' 智力+6,魅力+4。", "info");
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
      id: "g728_life_social_v2", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "人生社交里程碑",
      story: "在这个人生阶段,你的社交关系值得庆祝——{desc}",
      triggers: { minDay: 180, interval: 220, maxRepeats: 3, excludeFlags: ["_g728SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g728SocialCd) return false;
        return st.player && st.player.day >= 180 && st.relationships;
      },
      choices: [
        {
          text: "🤝 庆祝友谊", hint: "心情+10,社交XP+8,置_g728Celebrator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g728SocialCd = true;
            st.flags._g728Celebrator = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 '友谊,是人生最珍贵的财富。' 心情+10,社交XP+8。", "success");
            }
          }
        },
        {
          text: "💭 反思社交", hint: "心智+7,置_g728SocialThinker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g728SocialCd = true;
            st.flags._g728SocialThinker = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💭 '反思,让关系更深刻。' 心智+7。", "info");
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

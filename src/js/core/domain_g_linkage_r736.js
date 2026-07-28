/**
 * 域G(核心机制/生命周期) 联动增强 R736 (第四轮循环)
 * 桥接：
 *   G→A  g736_life_data_v4 人生数据v4 → 消费 全维度状态
 *   G→B  g736_life_chapter_v3 人生章节v3 → 消费 life_nodes+story_chapters
 *   G→D  g736_life_social_v3 人生社交v3 → 消费 年龄+关系
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR736Loaded) return;
  RANDOM_EVENTS._domainGLinkageR736Loaded = true;

  var EVENTS = [
    {
      id: "g736_life_data_v4", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生数据报告",
      story: "你的每一天都在积累数据——{desc}",
      triggers: { minDay: 365, interval: 400, maxRepeats: 3, excludeFlags: ["_g736DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g736DataCd) return false;
        return st.player && st.player.day >= 365 && st.status && st.needs;
      },
      choices: [
        {
          text: "📈 分析人生数据", hint: "智力+8,心智+6,置_g736Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g736DataCd = true;
            st.flags._g736Analyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据,是人生的刻度。' 智力+8,心智+6。", "success");
            }
          }
        },
        {
          text: "🎯 设定人生目标", hint: "心智+9,置_g736GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g736DataCd = true;
            st.flags._g736GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,人生才有方向。' 心智+9。", "info");
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
      id: "g736_life_chapter_v3", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生章节",
      story: "你的人生正在翻开新的篇章——{desc}",
      triggers: { minDay: 300, interval: 365, maxRepeats: 3, excludeFlags: ["_g736ChapterCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g736ChapterCd) return false;
        return st.player && st.player.day >= 300;
      },
      choices: [
        {
          text: "📜 回顾过往", hint: "心智+8,置_g736Reviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g736ChapterCd = true;
            st.flags._g736Reviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '回望来路,方知归处。' 心智+8。", "success");
            }
          }
        },
        {
          text: "✍️ 书写新篇章", hint: "智力+7,魅力+5,置_g736Writer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g736ChapterCd = true;
            st.flags._g736Writer = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 7);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("✍️ '人生如书,每一页都值得期待。' 智力+7,魅力+5。", "info");
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
      id: "g736_life_social_v3", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "人生社交里程碑",
      story: "在这个人生阶段,你的社交关系值得庆祝——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 3, excludeFlags: ["_g736SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g736SocialCd) return false;
        return st.player && st.player.day >= 250 && st.relationships;
      },
      choices: [
        {
          text: "🤝 庆祝友谊", hint: "心情+12,社交XP+10,置_g736Celebrator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g736SocialCd = true;
            st.flags._g736Celebrator = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 '友谊,是人生最珍贵的财富。' 心情+12,社交XP+10。", "success");
            }
          }
        },
        {
          text: "💭 反思社交", hint: "心智+8,置_g736SocialThinker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g736SocialCd = true;
            st.flags._g736SocialThinker = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💭 '反思,让关系更深刻。' 心智+8。", "info");
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

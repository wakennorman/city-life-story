/**
 * 域G(核心机制/生命周期) 联动增强 R720
 * 桥接：
 *   G→A  g720_life_quantified_v2 量化人生v2 → 消费 全维度状态,
 *     将游戏数据转化为"人生量化报告"
 *   G→B  g720_life_chapter_story 人生章节故事 → 消费 life_nodes+story_chapters,
 *     人生节点触发叙事回响
 *   G→D  g720_life_social_milestone 人生社交里程碑 → 消费 年龄+关系,
 *     人生阶段触发社交仪式
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR720Loaded) return;
  RANDOM_EVENTS._domainGLinkageR720Loaded = true;

  var EVENTS = [
    {
      id: "g720_life_quantified_v2", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生量化报告",
      story: "你的每一天都在积累数据——{desc}",
      triggers: { minDay: 200, interval: 240, maxRepeats: 3, excludeFlags: ["_g720QuantCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g720QuantCd) return false;
        return st.player && st.player.day >= 200 && st.status && st.needs;
      },
      choices: [
        {
          text: "📈 分析人生数据", hint: "智力+6,心智+4,置_g720Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g720QuantCd = true;
            st.flags._g720Analyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 6);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据,是人生的刻度。' 智力+6,心智+4。", "success");
            }
          }
        },
        {
          text: "🎯 设定人生目标", hint: "心智+7,置_g720GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g720QuantCd = true;
            st.flags._g720GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,人生才有方向。' 心智+7。", "info");
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
      id: "g720_life_chapter_story", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生章节",
      story: "你的人生正在翻开新的篇章——{desc}",
      triggers: { minDay: 180, interval: 200, maxRepeats: 3, excludeFlags: ["_g720ChapterCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g720ChapterCd) return false;
        return st.player && st.player.day >= 180;
      },
      choices: [
        {
          text: "📜 回顾过往", hint: "心智+6,置_g720Reviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g720ChapterCd = true;
            st.flags._g720Reviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '回望来路,方知归处。' 心智+6。", "success");
            }
          }
        },
        {
          text: "✍️ 书写新篇章", hint: "智力+5,魅力+3,置_g720Writer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g720ChapterCd = true;
            st.flags._g720Writer = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("✍️ '人生如书,每一页都值得期待。' 智力+5,魅力+3。", "info");
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
      id: "g720_life_social_milestone", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "人生社交里程碑",
      story: "在这个人生阶段,你的社交关系值得庆祝——{desc}",
      triggers: { minDay: 150, interval: 180, maxRepeats: 3, excludeFlags: ["_g720SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g720SocialCd) return false;
        return st.player && st.player.day >= 150 && st.relationships;
      },
      choices: [
        {
          text: "🤝 庆祝友谊", hint: "心情+8,社交XP+6,置_g720Celebrator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g720SocialCd = true;
            st.flags._g720Celebrator = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 '友谊,是人生最珍贵的财富。' 心情+8,社交XP+6。", "success");
            }
          }
        },
        {
          text: "💭 反思社交", hint: "心智+6,置_g720SocialThinker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g720SocialCd = true;
            st.flags._g720SocialThinker = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💭 '反思,让关系更深刻。' 心智+6。", "info");
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

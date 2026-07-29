/**
 * 域G(核心机制/生命周期) 联动增强 R809 (第十二轮循环)
 * 桥接：
 *   G→A  g809_life_data_v11 人生数据v11 → 消费 全维度状态
 *   G→B  g809_life_chapter_v10 人生章节v10 → 消费 life_nodes+story_chapters
 *   G→D  g809_life_social_v10 人生社交v10 → 消费 年龄+关系
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR809Loaded) return;
  RANDOM_EVENTS._domainGLinkageR809Loaded = true;

  var EVENTS = [
    // ====== G→A 人生数据v11 ======
    {
      id: "g809_life_data_v11", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生数据报告",
      story: "你的每一天都在积累数据——这些数字,就是你的人生故事。",
      triggers: { minDay: 500, interval: 600, maxRepeats: 3, excludeFlags: ["_g809DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g809DataCd) return false;
        return st.player && st.player.day >= 500 && st.status && st.needs;
      },
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        var health = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100;
        return "你已度过" + days + "天,健康" + health + "%——'这些数字,就是你的人生故事。'";
      },
      choices: [
        {
          text: "📈 分析人生轨迹", hint: "智力+25,心智+20,置_g809Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g809DataCd = true;
            st.flags._g809Analyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 25);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '数据是过去的见证,也是未来的指引。' 智力+25,心智+20。", "success");
            }
          }
        },
        {
          text: "🎯 设定人生目标", hint: "心智+25,置_g809GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g809DataCd = true;
            st.flags._g809GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,人生才有方向。' 心智+25。", "info");
            }
          }
        }
      ]
    },

    // ====== G→B 人生章节v10 ======
    {
      id: "g809_life_chapter_v10", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生章节",
      story: "你的人生正在翻开新的篇章——每一个阶段,都值得被铭记。",
      triggers: { minDay: 600, interval: 700, maxRepeats: 3, excludeFlags: ["_g809ChapterCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g809ChapterCd) return false;
        return st.player && st.player.day >= 600;
      },
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        var years = Math.floor(days / 365) + 1;
        return "你已度过" + years + "年('" + days + "天')——'人生如书,每一章都值得回味。'";
      },
      choices: [
        {
          text: "📜 回顾过往", hint: "心智+25,置_g809Reviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g809ChapterCd = true;
            st.flags._g809Reviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '回望来路,方知归处。' 心智+25。", "success");
            }
          }
        },
        {
          text: "✍️ 书写新篇章", hint: "智力+20,魅力+18,置_g809Writer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g809ChapterCd = true;
            st.flags._g809Writer = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 18);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("✍️ '人生如书,每一页都值得期待。' 智力+20,魅力+18。", "info");
            }
          }
        }
      ]
    },

    // ====== G→D 人生社交v10 ======
    {
      id: "g809_life_social_v10", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "人生社交里程碑",
      story: "在这个人生阶段,你的社交关系值得庆祝——朋友,是人生最珍贵的财富。",
      triggers: { minDay: 700, interval: 800, maxRepeats: 3, excludeFlags: ["_g809SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g809SocialCd) return false;
        return st.player && st.player.day >= 700 && st.relationships;
      },
      text: function (st) {
        if (!st) return null;
        var relCount = st.relationships ? Object.keys(st.relationships).length : 0;
        return "你已结识" + relCount + "位朋友——'朋友,是人生最珍贵的财富。'";
      },
      choices: [
        {
          text: "🤝 庆祝友谊", hint: "心情+30,社交XP+30,置_g809Celebrator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g809SocialCd = true;
            st.flags._g809Celebrator = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 30);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 30); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 '友谊,是人生最珍贵的财富。' 心情+30,社交XP+30。", "success");
            }
          }
        },
        {
          text: "💭 反思社交", hint: "心智+25,置_g809SocialThinker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g809SocialCd = true;
            st.flags._g809SocialThinker = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💭 '反思,让关系更深刻。' 心智+25。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
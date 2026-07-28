/**
 * 域G(核心机制/生命周期) 联动增强 R712
 * 桥接：
 *   G→A  g712_life_data_quantified 量化人生 → 消费 全维度状态数据,
 *     将游戏数据转化为"人生量化报告"
 *   G→B  g712_story_chapter_milestone 故事章节里程碑 → 消费 story_chapters+life_nodes,
 *     人生节点触发叙事回响
 *   G→D  g712_life_social_reflection 人生社交反思 → 消费 年龄+关系数据,
 *     人生阶段触发社交反思
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR712Loaded) return;
  RANDOM_EVENTS._domainGLinkageR712Loaded = true;

  var EVENTS = [
    {
      id: "g712_life_data_quantified", phase: "street", _isChainEvent: false, icon: "📊",
      title: "量化人生",
      story: "你的每一天都在积累数据——{desc}",
      triggers: { minDay: 180, interval: 200, maxRepeats: 3, excludeFlags: ["_g712QuantCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g712QuantCd) return false;
        return st.player && st.player.day >= 180 && st.status && st.needs;
      },
      choices: [
        {
          text: "📈 分析生活数据", hint: "智力+5,心智+3,置_g712DataAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g712QuantCd = true;
            st.flags._g712DataAnalyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '量化自我,是成长的第一步。' 智力+5,心智+3。", "success");
            }
          }
        },
        {
          text: "🎯 设定人生目标", hint: "心智+6,置_g712GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g712QuantCd = true;
            st.flags._g712GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标的人,走得更远。' 心智+6。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        var health = st.status && st.status.health ? Math.round(st.status.health) : 100;
        return "你已度过" + days + "天,健康" + health + "%——'这些数据,就是你的人生。'";
      }
    },
    {
      id: "g712_story_chapter_milestone", phase: "street", _isChainEvent: false, icon: "📖",
      title: "故事章节",
      story: "你的人生翻开了新的一页——{desc}",
      triggers: { minDay: 150, interval: 180, maxRepeats: 3, excludeFlags: ["_g712ChapterCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g712ChapterCd) return false;
        return st.player && st.player.day >= 150;
      },
      choices: [
        {
          text: "📜 回顾过往章节", hint: "心智+5,置_g712ChapterReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g712ChapterCd = true;
            st.flags._g712ChapterReviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '回望来路,方知归处。' 心智+5。", "success");
            }
          }
        },
        {
          text: "✍️ 书写新篇章", hint: "智力+4,魅力+3,置_g712ChapterWriter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g712ChapterCd = true;
            st.flags._g712ChapterWriter = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("✍️ '人生如书,每一页都值得期待。' 智力+4,魅力+3。", "info");
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
      id: "g712_life_social_reflection", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "人生社交反思",
      story: "在这个人生阶段,你开始反思社交关系——{desc}",
      triggers: { minDay: 200, interval: 240, maxRepeats: 3, excludeFlags: ["_g712ReflectCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g712ReflectCd) return false;
        return st.player && st.player.day >= 200 && st.relationships;
      },
      choices: [
        {
          text: "💭 深度反思", hint: "心智+7,置_g712DeepThinker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g712ReflectCd = true;
            st.flags._g712DeepThinker = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💭 '反思,是成长的催化剂。' 心智+7。", "success");
            }
          }
        },
        {
          text: "🤗 感恩身边人", hint: "心情+8,置_g712Thankful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g712ReflectCd = true;
            st.flags._g712Thankful = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤗 '感恩,让心更温暖。' 心情+8。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var age = st.player && st.player.age ? st.player.age : 20;
        return "你今年" + age + "岁——'人生的每个阶段,都值得反思。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

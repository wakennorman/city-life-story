/**
 * 域G(核心机制/生命周期) 联动增强 R831 (第十五轮循环)
 * 桥接：
 *   G→A  g831_life_data_v14 人生数据v14 → 消费 全维度状态
 *   G→B  g831_life_chapter_v13 人生章节v13 → 消费 年龄+里程碑
 *   G→D  g831_life_social_v13 人生社交v13 → 消费 年龄+关系
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR831Loaded) return;
  RANDOM_EVENTS._domainGLinkageR831Loaded = true;

  var EVENTS = [
    {
      id: "g831_life_data_v14", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生数据报告", story: "你的每一天都在积累数据——这些数字,就是你的人生故事。",
      triggers: { minDay: 300, interval: 400, maxRepeats: 3, excludeFlags: ["_g831DataCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._g831DataCd) return false; return st.player && st.player.day >= 300 && st.status && st.needs; },
      text: function (st) { if (!st) return null; var d = st.player && st.player.day ? st.player.day : 0; var h = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100; return "你已度过" + d + "天,健康" + h + "%——'这些数字,就是你的人生故事。'"; },
      choices: [
        { text: "📈 分析轨迹", hint: "智力+22,心智+20,置_g831Analyst",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._g831DataCd = true; st.flags._g831Analyst = true; if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 22); st.player.mental = Math.min(100, (st.player.mental || 50) + 20); } if (typeof StateManager !== "undefined") { StateManager.addMessage("📈 '数据是未来的指引。' 智力+22,心智+20。", "success"); } }
        },
        { text: "🎯 设定目标", hint: "心智+25,置_g831Goal",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._g831DataCd = true; st.flags._g831Goal = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25); if (typeof StateManager !== "undefined") { StateManager.addMessage("🎯 '有目标才有方向。' 心智+25。", "info"); } }
        }
      ]
    },
    {
      id: "g831_life_chapter_v13", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生章节", story: "你的人生正在翻开新的篇章——每一个阶段,都值得被铭记。",
      triggers: { minDay: 400, interval: 450, maxRepeats: 3, excludeFlags: ["_g831ChapterCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._g831ChapterCd) return false; return st.player && st.player.day >= 400; },
      text: function (st) { if (!st) return null; var d = st.player && st.player.day ? st.player.day : 0; var y = Math.floor(d / 365) + 1; return "你已度过" + y + "年——'人生如书,每一章都值得回味。'"; },
      choices: [
        { text: "📜 回顾过往", hint: "心智+25,置_g831Reviewer",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._g831ChapterCd = true; st.flags._g831Reviewer = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25); if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '回望来路,方知归处。' 心智+25。", "success"); } }
        },
        { text: "✍️ 书写新章", hint: "智力+20,魅力+18,置_g831Writer",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._g831ChapterCd = true; st.flags._g831Writer = true; if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20); st.player.charm = Math.min(100, (st.player.charm || 50) + 18); } if (typeof StateManager !== "undefined") { StateManager.addMessage("✍️ '人生如书,每一页都值得期待。' 智力+20,魅力+18。", "info"); } }
        }
      ]
    },
    {
      id: "g831_life_social_v13", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "人生社交里程碑", story: "在这个人生阶段,你的社交关系值得庆祝——朋友,是人生最珍贵的财富。",
      triggers: { minDay: 500, interval: 500, maxRepeats: 3, excludeFlags: ["_g831SocialCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._g831SocialCd) return false; return st.player && st.player.day >= 500 && st.relationships; },
      text: function (st) { if (!st) return null; var r = st.relationships ? Object.keys(st.relationships).length : 0; return "你已结识" + r + "位朋友——'朋友,是人生最珍贵的财富。'"; },
      choices: [
        { text: "🤝 庆祝友谊", hint: "心情+25,社交XP+25,置_g831Celebrator",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._g831SocialCd = true; st.flags._g831Celebrator = true; if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25); if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🎉 '友谊是人生最珍贵的财富。' 心情+25,社交XP+25。", "success"); } }
        },
        { text: "💭 反思社交", hint: "心智+22,置_g831Thinker",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._g831SocialCd = true; st.flags._g831Thinker = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 22); if (typeof StateManager !== "undefined") { StateManager.addMessage("💭 '反思让关系更深刻。' 心智+22。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
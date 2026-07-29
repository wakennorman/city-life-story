/**
 * 域G(核心机制/生命周期) 联动增强 R847 (第十七轮循环)
 * 桥接：
 *   G→A  g847_life_data_v16 人生数据v16 → 消费 全维度状态
 *   G→B  g847_life_chapter_v15 人生章节v15 → 消费 年龄+里程碑
 *   G→D  g847_life_social_v15 人生社交v15 → 消费 年龄+关系
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR847Loaded) return;
  RANDOM_EVENTS._domainGLinkageR847Loaded = true;

  var EVENTS = [
    {
      id: "g847_life_data_v16", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生数据报告", story: "你的每一天都在积累数据——这些数字,就是你的人生故事。",
      triggers: { minDay: 200, interval: 300, maxRepeats: 3, excludeFlags: ["_g847DataCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._g847DataCd) return false; return st.player && st.player.day >= 200 && st.status && st.needs; },
      text: function (st) { if (!st) return null; var d = st.player && st.player.day ? st.player.day : 0; var h = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100; return "你已度过" + d + "天,健康" + h + "%——'这些数字,就是你的人生故事。'"; },
      choices: [
        { text: "📈 分析", hint: "智力+22,心智+20,置_g847Analyst",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._g847DataCd = true; st.flags._g847Analyst = true; if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 22); st.player.mental = Math.min(100, (st.player.mental || 50) + 20); } if (typeof StateManager !== "undefined") { StateManager.addMessage("📈 '数据是未来的指引。' 智力+22,心智+20。", "success"); } }
        },
        { text: "🎯 目标", hint: "心智+25,置_g847Goal",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._g847DataCd = true; st.flags._g847Goal = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25); if (typeof StateManager !== "undefined") { StateManager.addMessage("🎯 '有目标才有方向。' 心智+25。", "info"); } }
        }
      ]
    },
    {
      id: "g847_life_chapter_v15", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生章节", story: "你的人生正在翻开新的篇章——每一个阶段,都值得被铭记。",
      triggers: { minDay: 300, interval: 350, maxRepeats: 3, excludeFlags: ["_g847ChapterCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._g847ChapterCd) return false; return st.player && st.player.day >= 300; },
      text: function (st) { if (!st) return null; var d = st.player && st.player.day ? st.player.day : 0; var y = Math.floor(d / 365) + 1; return "你已度过" + y + "年——'人生如书,每一章都值得回味。'"; },
      choices: [
        { text: "📜 回顾", hint: "心智+25,置_g847Reviewer",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._g847ChapterCd = true; st.flags._g847Reviewer = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25); if (typeof StateManager !== "undefined") { StateManager.addMessage("📖 '回望来路,方知归处。' 心智+25。", "success"); } }
        },
        { text: "✍️ 书写", hint: "智力+20,魅力+18,置_g847Writer",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._g847ChapterCd = true; st.flags._g847Writer = true; if (st.player) { st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20); st.player.charm = Math.min(100, (st.player.charm || 50) + 18); } if (typeof StateManager !== "undefined") { StateManager.addMessage("✍️ '人生如书,每一页都值得期待。' 智力+20,魅力+18。", "info"); } }
        }
      ]
    },
    {
      id: "g847_life_social_v15", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "人生社交里程碑", story: "在这个人生阶段,你的社交关系值得庆祝——朋友,是人生最珍贵的财富。",
      triggers: { minDay: 400, interval: 400, maxRepeats: 3, excludeFlags: ["_g847SocialCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._g847SocialCd) return false; return st.player && st.player.day >= 400 && st.relationships; },
      text: function (st) { if (!st) return null; var r = st.relationships ? Object.keys(st.relationships).length : 0; return "你已结识" + r + "位朋友——'朋友,是人生最珍贵的财富。'"; },
      choices: [
        { text: "🤝 庆祝", hint: "心情+25,社交XP+25,置_g847Celebrator",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._g847SocialCd = true; st.flags._g847Celebrator = true; if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25); if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🎉 '友谊是人生最珍贵的财富。' 心情+25,社交XP+25。", "success"); } }
        },
        { text: "💭 反思", hint: "心智+22,置_g847Thinker",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._g847SocialCd = true; st.flags._g847Thinker = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 22); if (typeof StateManager !== "undefined") { StateManager.addMessage("💭 '反思让关系更深刻。' 心智+22。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
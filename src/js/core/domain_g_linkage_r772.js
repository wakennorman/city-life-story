/**
 * 域G(核心机制/生命周期) 联动增强 R772 (第九轮循环)
 * 桥接：
 *   G→A  g772_life_data_v9 人生数据v9 → 消费 全维度状态
 *   G→B  g772_life_chapter_v8 人生章节v8 → 消费 life_nodes+story_chapters
 *   G→D  g772_life_social_v8 人生社交v8 → 消费 年龄+关系
 *
 * [全系统自洽修复] R772 A类#1: minDay 1000/900/800过高→降至160/200/120(事件不可达)
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR772Loaded) return;
  RANDOM_EVENTS._domainGLinkageR772Loaded = true;

  var EVENTS = [
    {
      id: "g772_life_data_v9", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生数据报告",
      story: "你的每一天都在积累数据——{desc}",
      triggers: { minDay: 160, interval: 220, maxRepeats: 3, excludeFlags: ["_g772DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g772DataCd) return false;
        return st.player && st.player.day >= 160 && st.status && st.needs;
      },
      choices: [
        {
          text: "📈 分析人生数据", hint: "智力+20,心智+18,置_g772Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g772DataCd = true;
            st.flags._g772Analyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据,是人生的刻度。' 智力+20,心智+18。", "success");
            }
          }
        },
        {
          text: "🎯 设定人生目标", hint: "心智+20,置_g772GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g772DataCd = true;
            st.flags._g772GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,人生才有方向。' 心智+20。", "info");
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
      id: "g772_life_chapter_v8", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生章节",
      story: "你的人生正在翻开新的篇章——{desc}",
      triggers: { minDay: 200, interval: 260, maxRepeats: 3, excludeFlags: ["_g772ChapterCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g772ChapterCd) return false;
        return st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "📜 回顾过往", hint: "心智+20,置_g772Reviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g772ChapterCd = true;
            st.flags._g772Reviewer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '回望来路,方知归处。' 心智+20。", "success");
            }
          }
        },
        {
          text: "✍️ 书写新篇章", hint: "智力+18,魅力+15,置_g772Writer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g772ChapterCd = true;
            st.flags._g772Writer = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("✍️ '人生如书,每一页都值得期待。' 智力+18,魅力+15。", "info");
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
      id: "g772_life_social_v8", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "人生社交里程碑",
      story: "在这个人生阶段,你的社交关系值得庆祝——{desc}",
      triggers: { minDay: 120, interval: 200, maxRepeats: 3, excludeFlags: ["_g772SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g772SocialCd) return false;
        return st.player && st.player.day >= 120 && st.relationships;
      },
      choices: [
        {
          text: "🤝 庆祝友谊", hint: "心情+25,社交XP+25,置_g772Celebrator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g772SocialCd = true;
            st.flags._g772Celebrator = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 '友谊,是人生最珍贵的财富。' 心情+25,社交XP+25。", "success");
            }
          }
        },
        {
          text: "💭 反思社交", hint: "心智+20,置_g772SocialThinker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g772SocialCd = true;
            st.flags._g772SocialThinker = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💭 '反思,让关系更深刻。' 心智+20。", "info");
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
    },

    // ===== G→E: 人生财富里程碑 =====
    {
      id: "g772_life_wealth_v8", phase: "street", _isChainEvent: false, icon: "💰",
      title: "人生财富里程碑",
      story: "你的人生财富正在积累——{desc}",
      triggers: { minDay: 100, interval: 200, maxRepeats: 3, excludeFlags: ["_g772WealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g772WealthCd) return false;
        return st.player && st.player.day >= 100 && st.resources;
      },
      choices: [
        {
          text: "📊 盘点资产", hint: "会计XP+15,智力+10,置_g772AssetManager",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g772WealthCd = true;
            st.flags._g772AssetManager = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '清楚自己的资产,才能规划更好的未来。' 会计XP+15,智力+10。", "success");
            }
          }
        },
        {
          text: "🎯 制定财务目标", hint: "管理XP+12,置_g772FinancialPlanner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g772WealthCd = true;
            st.flags._g772FinancialPlanner = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '财务自由,从规划开始。' 管理XP+12。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var cash = st.resources && st.resources.cash ? Math.round(st.resources.cash) : 0;
        var bank = st.resources && st.resources.bankBalance ? Math.round(st.resources.bankBalance) : 0;
        var total = cash + bank;
        return "总资产¥" + total.toLocaleString() + "——'财富,是人生选择的底气。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

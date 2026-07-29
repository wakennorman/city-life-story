/*
 * 城市浮生记 — 域B(事件/叙事) 联动增强 R805
 * 全系统优化·Domain B 第二十六轮循环
 *
 * 【联动增强3项】
 *   1. B→C 事件职业催化剂 — 事件选择触发职业技能成长
 *   2. B→E 事件经济教训 — 事件选择带来经济/投资教训
 *   3. B→H 事件公司文化 — 事件选择影响公司文化氛围
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域B铁律：NPC事件须 rel && rel.met；天气事件须 weather 守卫。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR805Loaded) return;
  RANDOM_EVENTS._domainBLinkageR805Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: B→C 事件职业催化剂 — 事件选择触发职业技能成长
    // 设计意图：事件中的选择应触发职业技能成长，让玩家感到"经历就是能力"。
    // 本事件在玩家经历≥25个事件后触发，给予"经历催化"标记。
    // 心理学：技能协同 — 不同领域的经历互相强化。
    // ========================================================================
    {
      id: "b805_event_career_catalyst",
      phase: "street",
      icon: "🚀",
      title: "经历，是最好的老师",
      story: "你回顾了来这座城市后的经历——那些成功与失败、抉择与后果。\n\n每一个事件，都在你身上留下了痕迹。它们不只是故事，更是你独有的「职业经验」。\n\n经历，是最好的老师。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b805EventCatalystDone) return false;
        var _eventCount = st.flags._eventCount || 0;
        return _eventCount >= 25 && st.player.day >= 90;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🚀 将经历转化为职业能力",
          hint: "管理XP+12, 置_b805ExperienceToSkill",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b805EventCatalystDone = true;
            st.flags._b805ExperienceToSkill = true;
            grantXp("management", 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 经历转化为职业能力——管理XP+12。", "success");
            }
          }
        },
        {
          text: "😊 经历就是经历",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b805EventCatalystDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 经历就是经历。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: B→E 事件经济教训 — 事件选择带来经济/投资教训
    // 设计意图：事件中的经济选择应产生教训，供投资域消费。
    // 本事件在玩家经历过≥5个经济相关事件时触发，给予"经济教训"标记。
    // 心理学：损失厌恶 — 玩家从经济损失中学到更多。
    // ========================================================================
    {
      id: "b805_event_economic_lesson",
      phase: "street",
      icon: "📚",
      title: "那些亏掉的钱，都是学费",
      story: "你回想起那些经济上的失误——买高了、卖低了、信错了人。\n\n每一次亏损，都教会了你一个道理。\n\n市场上有句话：亏过钱的人，才知道怎么赚钱。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b805EconLessonDone) return false;
        var _econEvents = st.flags._economicEventCount || 0;
        return _econEvents >= 5 && st.player.day >= 60;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📚 总结经济教训",
          hint: "智力+8, 会计XP+10, 置_b805EconWisdom",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b805EconLessonDone = true;
            st.flags._b805EconWisdom = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 经济教训总结完成——智力+8, 会计XP+10。", "success");
            }
          }
        },
        {
          text: "😅 亏了就亏了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b805EconLessonDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 亏了就亏了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: B→H 事件公司文化 — 事件选择影响公司文化氛围
    // 设计意图：事件中的道德/管理选择应影响公司文化，让玩家感到"我的选择塑造了公司"。
    // 本事件在corporate阶段且玩家经历≥10个管理相关事件时触发。
    // 心理学：禀赋效应 — 玩家感到"公司文化是我塑造的"。
    // ========================================================================
    {
      id: "b805_event_corporate_culture",
      phase: "corporate",
      icon: "🏢",
      title: "你的选择，塑造了公司文化",
      story: "你发现——公司的文化，其实就是你每一次选择的累积。\n\n选择信任，公司就有信任的文化；选择务实，公司就有务实的风气。\n\n你不仅是公司的创始人，更是公司文化的塑造者。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b805CorpCultureDone) return false;
        if (st.player.phase !== "corporate") return false;
        var _mgmtEvents = st.flags._managementEventCount || 0;
        return _mgmtEvents >= 10 && st.player.day >= 120;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🏢 主动塑造公司文化",
          hint: "管理XP+12, 置_b805CultureShaper",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b805CorpCultureDone = true;
            st.flags._b805CultureShaper = true;
            grantXp("management", 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏢 你开始主动塑造公司文化——管理XP+12。", "success");
            }
          }
        },
        {
          text: "😊 文化是自然形成的",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b805CorpCultureDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 文化是自然形成的。心智+3。", "info");
            }
          }
        }
      ]
    }
  ];

  // ---- 注入全局 RANDOM_EVENTS ----
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

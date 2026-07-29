/*
 * 城市浮生记 — 域G(核心机制/生命周期) 联动增强 R802
 * 全系统优化·Domain G 第五十七轮循环
 *
 * 【联动增强3项】
 *   1. G→B 人生章节叙事 — 人生节点触发叙事事件回响
 *   2. G→C 生命周期职业转折 — 年龄节点触发职业路径反思
 *   3. G→E 经济周期投资 — 通胀/行业数据引导投资决策
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR802Loaded) return;
  RANDOM_EVENTS._domainGLinkageR802Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: G→B 人生章节叙事 — 人生节点触发叙事事件回响
    // 设计意图：life_nodes 已定义人生节点，但缺少"节点触发叙事"的反馈。
    // 本事件在玩家年龄≥28时触发，给予"人生转折"标记。
    // 心理学：峰终定律 — 人生节点时刻应成为记忆锚点。
    // ========================================================================
    {
      id: "g802_life_chapter_narrative",
      phase: "street",
      icon: "📖",
      title: "人生新章节",
      story: "你站在人生的十字路口——过去的选择已经定格，未来的路还很长。\n\n有人说过，人生没有白走的路，每一步都算数。\n\n现在，是时候翻开新的篇章了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g802LifeChapterDone) return false;
        var _age = st.player.age || 18;
        return _age >= 28 && st.player.day >= 180;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📖 翻开人生新章节",
          hint: "心智+10, 置_g802LifeChapter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g802LifeChapterDone = true;
            st.flags._g802LifeChapter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 你翻开了人生的新章节——心智+10。每一步都算数。", "success");
            }
          }
        },
        {
          text: "😊 顺其自然",
          hint: "心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g802LifeChapterDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 顺其自然。心情+5。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: G→C 生命周期职业转折 — 年龄节点触发职业路径反思
    // 设计意图：年龄增长应触发职业反思，让玩家感到"时间不等人"。
    // 本事件在玩家年龄≥30且已就业≥1年时触发。
    // 心理学：社会比较 — 同龄人压力驱动职业发展。
    // ========================================================================
    {
      id: "g802_life_career_turn",
      phase: "street",
      icon: "🔄",
      title: "三十岁，你准备好了吗？",
      story: "你算了算——已经三十岁了。\n\n同龄人有的已经当了主管，有的已经创业成功，有的已经买房结婚。\n\n而你，还在原地踏步吗？\n\n三十岁，不是终点，但确实是一个该认真想想「下一步」的年纪了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g802CareerTurnDone) return false;
        var _age = st.player.age || 18;
        return _age >= 30 && st.player.day >= 365;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "🔄 认真规划下一步",
          hint: "智力+8, 管理XP+10, 置_g802CareerTurn",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g802CareerTurnDone = true;
            st.flags._g802CareerTurn = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("management", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔄 你认真规划了下一步——智力+8, 管理XP+10。", "success");
            }
          }
        },
        {
          text: "😅 三十岁也没什么特别的",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g802CareerTurnDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 三十岁也没什么特别的。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: G→E 经济周期投资 — 通胀/行业数据引导投资决策
    // 设计意图：era_transform 已追踪经济周期，但缺少"用周期指导投资"的叙事层。
    // 本事件在通胀指数≥1.3或≤0.7时触发，给予"周期投资者"标记。
    // 心理学：损失厌恶 — 玩家更害怕在高点买入。
    // ========================================================================
    {
      id: "g802_cycle_investor",
      phase: "street",
      icon: "📈",
      title: "读懂周期，才能穿越周期",
      story: "你注意到——经济正在经历一轮明显的周期波动。\n\n有人在恐慌中抛售，有人在狂热中追高。\n\n但你明白：周期有起有落，关键是站在正确的一边。\n\n读懂周期的人，才能穿越周期。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g802CycleInvestorDone) return false;
        var _era = st._eraState;
        if (!_era || !isFinite(_era.inflationIndex)) return false;
        return (_era.inflationIndex >= 1.3 || _era.inflationIndex <= 0.7) && st.player.day >= 90;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📈 跟随周期调整投资策略",
          hint: "智力+8, 会计XP+10, 置_g802CycleInvestor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g802CycleInvestorDone = true;
            st.flags._g802CycleInvestor = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 你学会了跟随周期调整投资——智力+8, 会计XP+10。", "success");
            }
          }
        },
        {
          text: "😅 太复杂了，不想研究",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g802CycleInvestorDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 太复杂了，不想研究。心智+3。", "info");
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

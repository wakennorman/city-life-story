/*
 * 城市浮生记 — 域B(事件/叙事) 联动增强 R930
 * 全系统优化·Domain B 第七十二轮循环
 *
 * 【联动增强3项】
 *   1. B→G 事件韧性成长叙事v1 — 负面事件累积触发韧性成长事件
 *   2. B→E 事件经济智慧v1 — 市场事件积累触发投资智慧事件
 *   3. B→C 事件职业灵感v1 — 职业事件积累触发路径启发事件
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动现有文件。
 *  - 所有 state 访问均 || 防御。
 *  - 严格遵守目标域数据格式。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR930Loaded) return;
  RANDOM_EVENTS._domainBLinkageR930Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: B→G 事件韧性成长叙事v1
    // 设计意图：负面事件累积(≥5次)后，触发韧性成长事件，
    //    让玩家感到"经历挫折使人成长"。
    // 心理学：峰终定律 — 负面体验的终点是成长，强化正向记忆
    // ========================================================================
    {
      id: "b930_resilience_growth_v1",
      phase: "street",
      icon: "🌱",
      title: "风雨过后，心智更坚",
      story: "回头看看这些日子——你经历了不少糟心事。\n\n但奇怪的是，你现在反而觉得那些事没那么可怕了。每一次跌到谷底，你都爬了起来，而且比之前站得更稳。",
      triggers: { minDay: 100, interval: 200, maxRepeats: 2, excludeFlags: ["_b930ResilienceCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b930ResilienceCd) return false;
        // 需要经历≥5次负面事件
        var _negCount = st.flags._negativeEventStreak || 0;
        var _negTotal = 0;
        if (st.flags._eventHistory && Array.isArray(st.flags._eventHistory)) {
          for (var _i = 0; _i < st.flags._eventHistory.length; _i++) {
            var _e = st.flags._eventHistory[_i];
            if (_e && _e.type === "negative") _negTotal++;
          }
        }
        return (_negCount >= 5 || _negTotal >= 5) && st.player.day >= 100;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "🌱 反思成长，汲取力量",
          hint: "心智+18, 体质+10, 置_b930Resilience",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b930ResilienceCd = true;
            st.flags._b930Resilience = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
              st.player.physique = Math.min(100, (st.player.physique || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌱 你反思了这些日子的经历，心智和体质都得到了锤炼——心智+18, 体质+10。", "success");
            }
          }
        },
        {
          text: "😅 不想回忆了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b930ResilienceCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 不想回忆了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: B→E 事件经济智慧v1
    // 设计意图：市场/经济事件积累后，触发投资智慧事件，
    //    让玩家把事件经验转化为投资判断力。
    // 心理学：经验学习曲线 — 事件经验转化为投资决策能力
    // ========================================================================
    {
      id: "b930_econ_wisdom_v1",
      phase: "street",
      icon: "💡",
      title: "从事件中学会投资",
      story: "你经历了这么多次市场波动和新闻事件，渐渐摸出了一些规律。\n\n「新闻里说政府要扶持新能源，那新能源股票肯定会涨……」你喃喃自语。",
      triggers: { minDay: 80, interval: 150, maxRepeats: 3, excludeFlags: ["_b930EconWisdomCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b930EconWisdomCd) return false;
        // 需要经历≥8次事件(有事件历史记录)
        var _evtCount = 0;
        if (st.flags._eventHistory && Array.isArray(st.flags._eventHistory)) {
          _evtCount = st.flags._eventHistory.length;
        }
        return _evtCount >= 8 && st.player.day >= 80;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "💡 总结市场规律",
          hint: "智力+15, 会计XP+20, 置_b930EconWisdom",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b930EconWisdomCd = true;
            st.flags._b930EconWisdom = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            grantXp("accounting", 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 你总结了市场规律，投资眼光更敏锐了——智力+15, 会计XP+20。", "success");
            }
          }
        },
        {
          text: "😅 投资太复杂了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b930EconWisdomCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 投资太复杂了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: B→C 事件职业灵感v1
    // 设计意图：职业相关事件积累后，触发职业路径启发事件，
    //    让玩家从事件中找到职业方向。
    // 心理学：叙事自我 — 事件塑造个人职业叙事
    // ========================================================================
    {
      id: "b930_career_inspiration_v1",
      phase: "street",
      icon: "💼",
      title: "事件中的职业启示",
      story: "你经历了一些与工作相关的事件，每次都在你心里留下了一点痕迹。\n\n「也许我该往那个方向发展……」一个念头在脑海中闪过。",
      triggers: { minDay: 50, interval: 120, maxRepeats: 3, excludeFlags: ["_b930CareerInspCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b930CareerInspCd) return false;
        // 需要有职业相关事件记录
        var _careerEvents = 0;
        if (st.flags._eventHistory && Array.isArray(st.flags._eventHistory)) {
          for (var _i2 = 0; _i2 < st.flags._eventHistory.length; _i2++) {
            var _e2 = st.flags._eventHistory[_i2];
            if (_e2 && (_e2.type === "career" || _e2.type === "job" || _e2.type === "work")) _careerEvents++;
          }
        }
        // 或者有职业数据
        var _hasJob = st.career && st.career.currentJob;
        return (_careerEvents >= 3 || _hasJob) && st.player.day >= 50;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "💼 探索职业新方向",
          hint: "智力+12, 管理XP+15, 置_b930CareerInsp",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b930CareerInspCd = true;
            st.flags._b930CareerInsp = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            grantXp("management", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 你从过去的经历中获得了职业启示——智力+12, 管理XP+15。", "success");
            }
          }
        },
        {
          text: "😅 先做好眼前的事",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b930CareerInspCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 先做好眼前的事。心智+3。", "info");
            }
          }
        }
      ]
    }
  ];

  // 去重注册
  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
/*
 * 城市浮生记 — 域G(核心机制/生命周期) 联动增强 R868
 * 全系统优化·Domain G 第六十六轮循环
 *
 * 【联动增强3项】
 *   1. G→A 人生数据v19 — 核心机制数据转化为数值平衡洞察
 *   2. G→D 人生社交v17 — 人生节点触发NPC社交事件
 *   3. G→H 生命阶段公司v7 — 年龄/阶段引导创业时机
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR868Loaded) return;
  RANDOM_EVENTS._domainGLinkageR868Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: G→A 人生数据v19 — 核心机制数据转化为数值洞察
    // 设计意图：核心机制产生的数据(健康/需求/状态)应成为数值域可消费的资产。
    // 本事件在玩家生存≥450天时触发，给予"人生数据v19"标记。
    // 心理学：认知负荷 — 综合数据评分降低玩家信息处理负担。
    // ========================================================================
    {
      id: "g868_life_data_v19",
      phase: "street",
      icon: "📊",
      title: "人生数据报告",
      story: "你的每一天都在积累数据——这些数字,就是你的人生故事。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g868LifeDataDone) return false;
        return st.player.day >= 450 && st.status && st.needs;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📈 分析人生轨迹",
          hint: "智力+22, 心智+20, 置_g868Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g868LifeDataDone = true;
            st.flags._g868Analyst = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 22);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '数据是过去的见证,也是未来的指引。' 智力+22, 心智+20。", "success");
            }
          }
        },
        {
          text: "🎯 设定人生目标",
          hint: "心智+22, 置_g868GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g868LifeDataDone = true;
            st.flags._g868GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 22);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,人生才有方向。' 心智+22。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: G→D 人生社交v17 — 人生节点触发NPC社交事件
    // 设计意图：人生节点(年龄/阶段)应触发NPC社交事件，让玩家感到"朋友陪我成长"。
    // 本事件在玩家年龄≥40且拥有≥9个好友时触发。
    // 心理学：社会支持 — 被朋友陪伴的满足感。
    // ========================================================================
    {
      id: "g868_life_social_v17",
      phase: "street",
      icon: "🎉",
      title: "朋友们陪你走过人生节点",
      story: "你发现——每当你走到人生的一个重要节点，总有一些朋友在你身边。\n\n他们不一定能帮你解决问题，但他们的陪伴，本身就是一种力量。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g868LifeSocialDone) return false;
        if (!st.relationships) return false;
        var _age = st.player.age || 18;
        if (_age < 40) return false;
        var _friends = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 60) _friends++;
        }
        return _friends >= 9;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🎉 感谢朋友的陪伴",
          hint: "心情+28, 置_g868FriendCompanion",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g868LifeSocialDone = true;
            st.flags._g868FriendCompanion = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 28);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 感谢朋友的陪伴——心情+28。人生的路上，有朋友同行，是一种幸运。", "success");
            }
          }
        },
        {
          text: "😊 自己走也挺好",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g868LifeSocialDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 自己走也挺好。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: G→H 生命阶段公司v7 — 年龄/阶段引导创业时机
    // 设计意图：不同年龄阶段应引导不同的创业时机，让玩家感到"阶段不同时机不同"。
    // 本事件在玩家年龄≥45且总资产≥¥50万时触发。
    // 心理学：禀赋效应 — 玩家感到"准备就绪后的自然选择"。
    // ========================================================================
    {
      id: "g868_life_stage_startup_v7",
      phase: "street",
      icon: "🚀",
      title: "这个年纪，该创业了吗？",
      story: "你算了算——已经四十五岁了，在职场摸爬滚打了好几年。\n\n一个念头开始浮现：是时候创业了吗？",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g868StartupDone) return false;
        if (!st.resources) return false;
        var _age = st.player.age || 18;
        if (_age < 45) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return _total >= 500000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🚀 认真评估创业时机",
          hint: "智力+22, 管理XP+25, 置_g868StartupReady",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g868StartupDone = true;
            st.flags._g868StartupReady = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 22);
            grantXp("management", 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 你认真评估了创业时机——智力+22, 管理XP+25。", "success");
            }
          }
        },
        {
          text: "😅 再等等看",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g868StartupDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 再等等看。心智+3。", "info");
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

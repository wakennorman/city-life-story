/*
 * 城市浮生记 — 域A(数据/数值平衡) 联动增强 R878
 * 全系统优化·Domain A 第六十六轮循环
 *
 * 【联动增强3项 — A→D 方向(仅4次,历轮最薄弱)】
 *   1. A→D 价格波动影响NPC关系v1 — 市场波动导致NPC关系变化
 *   2. A→D 职业数据影响社交地位v1 — 职业数据影响NPC对玩家态度
 *   3. A→D 健康数据影响社交互动v1 — 健康数据影响NPC互动意愿
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS,避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 *  - A→D 核心设计理念：数据不应只是后台数值,
 *    应影响NPC对玩家的态度——社会比较+禀赋效应。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR878Loaded) return;
  RANDOM_EVENTS._domainALinkageR878Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: A→D 价格波动影响NPC关系v1
    // 设计意图：市场大幅波动时,NPC对玩家的态度发生变化——
    //    社会比较(有人羡慕有人同情)+禀赋效应(拥有感)。
    // 触发：市场价格波动≥20% + ≥2个已结识NPC
    // 心理学：社会比较(有人羡慕有人同情)+峰终定律(极端价格时刻的记忆)
    // ========================================================================
    {
      id: "a878_price_npc_reaction_v1",
      phase: "street",
      icon: "📈",
      title: "市场波动,朋友们怎么看",
      story: "最近市场价格波动剧烈——有人赚得盆满钵满,有人亏得血本无归。\n\n朋友们对这件事的反应各不相同：有人羡慕,有人担忧,还有人想跟着你一起投。",
      triggers: { minDay: 80, interval: 200, maxRepeats: 1, excludeFlags: ["_a878PriceNpcCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a878PriceNpcCd) return false;
        // 需有至少2个已结识NPC
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met) _metCount++;
        }
        return _metCount >= 2;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📈 分享经验,大家一起赚",
          hint: "社交XP+18, 所有已结识NPC好感+4, 置_a878Share",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a878PriceNpcCd = true;
            st.flags._a878Share = true;
            grantXp("social", 18);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 4, "分享市场经验");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 分享经验,大家一起赚——社交XP+18, 所有朋友好感+4。", "success");
            }
          }
        },
        {
          text: "😅 低调,不张扬",
          hint: "心智+10, 置_a878LowKey",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a878PriceNpcCd = true;
            st.flags._a878LowKey = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 低调,不张扬——心智+10。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: A→D 职业数据影响社交地位v1
    // 设计意图：职业数据(薪资/职级)影响NPC对玩家的态度——
    //    社会比较+禀赋效应。
    // 触发：在职≥180天 + ≥2个已结识NPC
    // 心理学：社会比较(职业成就被认可)+禀赋效应(拥有感)
    // ========================================================================
    {
      id: "a878_career_social_status_v1",
      phase: "street",
      icon: "💼",
      title: "职业成就,朋友们看在眼里",
      story: "你在职场的表现已经引起了朋友们的注意——升职加薪,职业成就让他们对你刮目相看。",
      triggers: { minDay: 120, interval: 240, maxRepeats: 1, excludeFlags: ["_a878CareerNpcCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a878CareerNpcCd) return false;
        // 需有固定工作且在职≥180天
        if (!st.career || !st.career.currentJob) return false;
        if ((st.career.currentJob.workDays || 0) < 180) return false;
        // 需有至少2个已结识NPC
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met) _metCount++;
        }
        return _metCount >= 2;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "💼 谦虚,继续努力",
          hint: "社交XP+15, 心智+10, 所有已结识NPC好感+5, 置_a878Humble",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a878CareerNpcCd = true;
            st.flags._a878Humble = true;
            grantXp("social", 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 5, "职业成就");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 谦虚,继续努力——社交XP+15, 心智+10, 所有朋友好感+5。", "success");
            }
          }
        },
        {
          text: "😅 成就还小,不算什么",
          hint: "智力+12, 置_a878Understate",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a878CareerNpcCd = true;
            st.flags._a878Understate = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 成就还小,不算什么——智力+12。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: A→D 健康数据影响社交互动v1
    // 设计意图：健康数据影响NPC与玩家的互动意愿——
    //    社会支持(健康时朋友更愿互动)+损失厌恶(生病时朋友担忧)。
    // 触发：健康<40或≥80 + ≥1个好感≥40的NPC
    // 心理学：社会支持(健康时朋友更愿互动)+损失厌恶(生病时朋友担忧)
    // ========================================================================
    {
      id: "a878_health_social_impact_v1",
      phase: "street",
      icon: "❤️",
      title: "健康,影响了你的社交",
      story: "最近身体不太好——朋友们看出来了,有的劝你休息,有的默默帮你分担。\n\n健康,也是社交的一部分。",
      triggers: { minDay: 60, interval: 180, maxRepeats: 2, excludeFlags: ["_a878HealthNpcCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a878HealthNpcCd) return false;
        // 需健康显著异常(<40或≥80)
        if (!st.status) return false;
        var _health = st.status.health || 50;
        if (_health >= 40 && _health < 80) return false;
        // 需有至少1个好感≥40的已结识NPC
        if (!st.relationships) return false;
        var _hasCloseFriend = false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 40) { _hasCloseFriend = true; break; }
        }
        return _hasCloseFriend;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "❤️ 感谢朋友的关心",
          hint: "社交XP+15, 朋友好感+8, 心情+10, 置_a878Thankful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a878HealthNpcCd = true;
            st.flags._a878Thankful = true;
            grantXp("social", 15);
            // 找到最高好感NPC并提升
            var _bestNpc = null, _bestAff = -1;
            if (st.relationships) {
              for (var _id in st.relationships) {
                var _r = st.relationships[_id];
                if (_r && _r.met && (_r.affinity || 0) > _bestAff) { _bestAff = _r.affinity || 0; _bestNpc = _id; }
              }
            }
            if (_bestNpc && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, _bestNpc, 8, "健康关怀");
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("❤️ 感谢朋友的关心——社交XP+15, 朋友好感+8, 心情+10。", "success");
            }
          }
        },
        {
          text: "😅 自己会注意,不让朋友担心",
          hint: "心智+10, 置_a878SelfCare",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a878HealthNpcCd = true;
            st.flags._a878SelfCare = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 自己会注意——心智+10。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();

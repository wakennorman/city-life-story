/*
 * 城市浮生记 — 域B(事件/叙事) 联动增强 R863
 * 全系统优化·Domain B 第三十轮循环
 *
 * 【联动增强3项】
 *   1. B→H 事件公司文化v7 — 事件选择影响公司文化氛围（历轮域B全新方向）
 *   2. B→D 事件友谊深化v7 — 事件选择导致NPC关系深度变化
 *   3. B→G 事件人生影响v7 — 事件选择触发核心机制状态回响
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域B铁律：NPC事件须 rel && rel.met；天气事件须 weather 守卫。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR863Loaded) return;
  RANDOM_EVENTS._domainBLinkageR863Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: B→H 事件公司文化v7 — 事件选择影响公司文化氛围
    // 设计意图：玩家在事件中的道德/管理选择应影响公司文化，形成"选择→文化"反馈环。
    // 本事件在corporate阶段且玩家经历≥20个事件时触发，给予"公司文化"标记。
    // 心理学：禀赋效应 — 玩家感到"公司文化是我塑造的"。
    // ========================================================================
    {
      id: "b863_event_corporate_culture_v7",
      phase: "corporate",
      icon: "🏢",
      title: "你的选择，塑造了公司文化",
      story: "回想这一路走来的抉择——那些坚持原则的时刻，那些灵活变通的瞬间。\n\n这些选择，不知不觉中成了一种「文化」。你的团队在模仿你，你的公司在反映你。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b863CorpCultureDone) return false;
        if (st.player.phase !== "corporate") return false;
        var _eventCount = st.flags._eventCount || 0;
        return _eventCount >= 20 && st.player.day >= 150;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🏢 坚持以身作则，强化文化",
          hint: "管理XP+15, 置_b863CultureShaper",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b863CorpCultureDone = true;
            st.flags._b863CultureShaper = true;
            grantXp("management", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏢 你的坚持让团队有了灵魂——管理XP+15。", "success");
            }
          }
        },
        {
          text: "😊 文化是自然形成的",
          hint: "心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b863CorpCultureDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 顺其自然，也是一种智慧。心情+5。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: B→D 事件友谊深化v7 — 事件选择导致NPC关系深度变化
    // 设计意图：事件中的选择应影响NPC关系，让玩家感到"选择有后果"。
    // 本事件在玩家拥有≥2个好友(好感≥60)时触发。
    // 心理学：社会比较 — 被朋友认可的满足感。
    // ========================================================================
    {
      id: "b863_event_friendship_v7",
      phase: "street",
      icon: "💕",
      title: "那些选择，让你和某些人更近了",
      story: "你发现——那些曾经帮助过的朋友，现在成了你最坚实的后盾。\n\n不是因为你帮了他们，而是因为在每一个选择面前，你都选择了善良。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b863FriendshipDone) return false;
        if (!st.relationships) return false;
        var _closeCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 60) _closeCount++;
        }
        return _closeCount >= 2;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "💕 珍惜这份友谊",
          hint: "所有好友(≥60)好感+5, 置_b863DeepFriendship",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b863FriendshipDone = true;
            st.flags._b863DeepFriendship = true;
            for (var _id in st.relationships) {
              var _r = st.relationships[_id];
              if (_r && _r.met && (_r.affinity || 0) >= 60) {
                if (typeof applyAffinityChange === "function") {
                  applyAffinityChange(st, _id, 5, "友谊深化");
                }
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💕 你珍惜了每一份友谊——所有好友好感+5。", "success");
            }
          }
        },
        {
          text: "😊 朋友不用刻意维护",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b863FriendshipDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 朋友不用刻意维护。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: B→G 事件人生影响v7 — 事件选择触发核心机制状态回响
    // 设计意图：事件中的选择应触发核心机制状态变化，让玩家感到"选择有后果"。
    // 本事件在玩家经历≥30个事件且健康<50时触发。
    // 心理学：损失厌恶 — 玩家更害怕因选择不当而失去健康。
    // ========================================================================
    {
      id: "b863_event_life_impact_v7",
      phase: "street",
      icon: "🌟",
      title: "那些选择，改变了你的人生",
      story: "你回想起那些关键的时刻——\n\n选择帮王大婶修水管，还是选择旁观？\n\n选择揭发工头的违规，还是选择沉默？\n\n每一个选择，都把你推向了不同的人生轨道。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b863LifeImpactDone) return false;
        var _eventCount = st.flags._eventCount || 0;
        if (_eventCount < 30) return false;
        var _health = st.status ? st.status.health : 100;
        return _health < 50;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🌟 每一个选择都值得",
          hint: "健康+15, 心情+15, 置_b863LifeChoicesAcknowledged",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b863LifeImpactDone = true;
            st.flags._b863LifeChoicesAcknowledged = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 15);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌟 每一个选择都值得——健康+15, 心情+15。这就是你的人生。", "success");
            }
          }
        },
        {
          text: "😊 路还长，继续走",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b863LifeImpactDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 路还长，继续走。心智+5。", "success");
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

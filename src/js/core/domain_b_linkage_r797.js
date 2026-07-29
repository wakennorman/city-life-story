/*
 * 城市浮生记 — 域B(事件/叙事) 联动增强 R797
 * 全系统优化·Domain B 第二十五轮循环
 *
 * 【联动增强3项】
 *   1. B→A 事件数据遗产 — 事件积累的数据转化为数值平衡洞察
 *   2. B→D 事件友谊深化 — 事件选择导致NPC关系深度变化
 *   3. B→G 事件人生影响 — 事件选择触发核心机制状态回响
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域B铁律：NPC事件须 rel && rel.met；天气事件须 weather 守卫。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR797Loaded) return;
  RANDOM_EVENTS._domainBLinkageR797Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }
  function getNpcNameB797(npcId) {
    if (typeof getNpcDisplayName === "function") return getNpcDisplayName(npcId);
    return npcId ? String(npcId).replace(/_/g, " ") : "某人";
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: B→A 事件数据遗产 — 事件积累的数据转化为数值洞察
    // 设计意图：玩家经历的事件(选择/结果)应积累为"人生经验数据"，供数值域消费。
    // 本事件在玩家经历≥20个事件后触发，给予"人生经验"标记。
    // 心理学：禀赋效应 — 玩家感到"这些经历塑造了现在的我"。
    // ========================================================================
    {
      id: "b797_event_data_legacy",
      phase: "street",
      icon: "📚",
      title: "你经历的一切，都在塑造你",
      story: "你回顾了来这座城市后的点点滴滴——那些做出的选择、那些遇到的人、那些成功与失败。\n\n每一个事件，都在你身上留下了痕迹。它们不只是故事，更是你独有的「人生经验数据」。\n\n这些经验，让你比别人更懂这座城市。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b797EventDataDone) return false;
        // 经历≥20个事件（通过flags中的事件计数）
        var _eventCount = st.flags._eventCount || 0;
        return _eventCount >= 20 && st.player.day >= 60;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📚 总结人生经验",
          hint: "智力+8, 心智+5, 置_b797LifeExperience",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b797EventDataDone = true;
            st.flags._b797LifeExperience = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 你总结了人生经验——智力+8, 心智+5。经历是最宝贵的财富。", "success");
            }
          }
        },
        {
          text: "😊 活在当下，不想过去",
          hint: "心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b797EventDataDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 活在当下，也是一种智慧。心情+5。", "success");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: B→D 事件友谊深化 — 事件选择导致NPC关系深度变化
    // 设计意图：事件中的选择应影响NPC关系，让玩家感到"我的选择很重要"。
    // 本事件在玩家拥有≥1个好感≥60的NPC时触发，给予深度互动机会。
    // 心理学：禀赋效应 — 玩家更珍视通过选择建立的关系。
    // ========================================================================
    {
      id: "b797_event_friendship_deepening",
      phase: "street",
      icon: "💕",
      title: "那些选择，让你和某些人更近了",
      story: "你发现——那些曾经帮助过的朋友，现在成了你最坚实的后盾。\n\n不是偶然，是你在每一个选择面前，都选择了善良。\n\n这座城市里，你不再是一个人了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b797FriendDeepDone) return false;
        if (!st.relationships) return false;
        // 至少1个好感≥60的已结识NPC
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 60) return true;
        }
        return false;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💕 珍惜这份友谊",
          hint: "所有好友(≥60)好感+5, 置_b797DeepFriendship",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b797FriendDeepDone = true;
            st.flags._b797DeepFriendship = true;
            var _count = 0;
            for (var _id in st.relationships) {
              var _r = st.relationships[_id];
              if (_r && _r.met && (_r.affinity || 0) >= 60) {
                if (typeof applyAffinityChange === "function") {
                  applyAffinityChange(st, _id, 5, "友谊深化");
                }
                _count++;
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💕 你珍惜了" + _count + "份友谊。所有好友好感+5。", "success");
            }
          }
        },
        {
          text: "😊 朋友贵精不贵多",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b797FriendDeepDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 朋友贵精不贵多。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: B→G 事件人生影响 — 事件选择触发核心机制状态回响
    // 设计意图：重大事件选择应影响核心状态(健康/心情/需求)，形成"事件→机制"反馈环。
    // 本事件在玩家经历≥10个"重大选择"事件后触发。
    // 心理学：峰终定律 — 重大选择时刻成为人生记忆锚点。
    // ========================================================================
    {
      id: "b797_event_life_impact",
      phase: "street",
      icon: "🌟",
      title: "那些重大选择，改变了你的人生",
      story: "你回想起那些关键的时刻——\n\n选择帮王大婶修水管，还是选择旁观？\n\n选择揭发工头的违规，还是选择沉默？\n\n选择把钱投资自己，还是选择存银行？\n\n每一个选择，都把你推向了不同的人生轨道。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b797LifeImpactDone) return false;
        // 经历≥10个重大选择事件
        var _majorChoices = st.flags._majorChoiceCount || 0;
        return _majorChoices >= 10 && st.player.day >= 90;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🌟 每一个选择都值得",
          hint: "健康+10, 心情+10, 置_b797LifeChoicesAcknowledged",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b797LifeImpactDone = true;
            st.flags._b797LifeChoicesAcknowledged = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 80) + 10);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌟 每一个选择都值得——健康+10, 心情+10。这就是你的人生。", "success");
            }
          }
        },
        {
          text: "😊 路还长，继续走",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b797LifeImpactDone = true;
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

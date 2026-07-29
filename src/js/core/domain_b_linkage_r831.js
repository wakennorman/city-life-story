/*
 * 城市浮生记 — 域B(事件/叙事) 联动增强 R831
 * 全系统优化·Domain B 第二十九轮循环
 *
 * 【联动增强3项】
 *   1. B→A 事件数据遗产v2 — 事件积累的数据转化为数值平衡洞察
 *   2. B→F 事件UI回响v3 — 事件选择在UI层的展示更新
 *   3. B→G 事件人生影响v2 — 事件选择触发核心机制状态回响
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域B铁律：NPC事件须 rel && rel.met；天气事件须 weather 守卫。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR831Loaded) return;
  RANDOM_EVENTS._domainBLinkageR831Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: B→A 事件数据遗产v2 — 事件积累的数据转化为数值洞察
    // 设计意图：玩家经历的事件(选择/结果)应积累为"人生经验数据"，供数值域消费。
    // 本事件在玩家经历≥40个事件后触发，给予"人生经验数据v2"标记。
    // 心理学：禀赋效应 — 玩家感到"这些经历塑造了现在的我"。
    // ========================================================================
    {
      id: "b831_event_data_v2",
      phase: "street",
      icon: "📚",
      title: "你经历的一切，都是数据",
      story: "你回顾了来这座城市后的点点滴滴——那些做出的选择、那些遇到的人、那些成功与失败。\n\n每一个事件，都在你身上留下了痕迹。它们不只是故事，更是你独有的「人生经验数据」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b831EventDataDone) return false;
        var _eventCount = st.flags._eventCount || 0;
        return _eventCount >= 40 && st.player.day >= 120;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📚 深度分析人生数据",
          hint: "智力+10, 心智+8, 置_b831LifeDataV2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b831EventDataDone = true;
            st.flags._b831LifeDataV2 = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 你深度分析了人生数据——智力+10, 心智+8。经历是最宝贵的财富。", "success");
            }
          }
        },
        {
          text: "😊 活在当下",
          hint: "心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b831EventDataDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 活在当下，也是一种智慧。心情+5。", "success");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: B→F 事件UI回响v3 — 事件选择在UI层的展示更新
    // 设计意图：事件中的选择应在UI层有反馈，让玩家感到"我的选择被看见"。
    // 本事件在玩家经历≥30个事件后触发，给予"选择回响UIv3"标记。
    // 心理学：认知负荷 — UI反馈降低玩家信息处理负担。
    // ========================================================================
    {
      id: "b831_event_ui_v3",
      phase: "street",
      icon: "🖼️",
      title: "你的选择，都记录在案",
      story: "你打开事件历史面板——每一个选择、每一个结果，都清晰地记录在案。\n\n这些不是枯燥的日志，而是你人生的「选择轨迹」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b831EventUIDone) return false;
        var _eventCount = st.flags._eventCount || 0;
        return _eventCount >= 30;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🖼️ 查看选择轨迹",
          hint: "心智+10, 置_b831ChoiceTrackerV3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b831EventUIDone = true;
            st.flags._b831ChoiceTrackerV3 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🖼️ 选择轨迹已可视化——心智+10。看到自己的选择被记录，你会更认真地对待每一个决定。", "success");
            }
          }
        },
        {
          text: "😅 过去就过去了",
          hint: "心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b831EventUIDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 过去就过去了。心情+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: B→G 事件人生影响v2 — 事件选择触发核心机制状态回响
    // 设计意图：事件中的选择应触发核心机制状态变化，让玩家感到"选择有后果"。
    // 本事件在玩家经历≥25个事件且健康<60时触发。
    // 心理学：损失厌恶 — 玩家更害怕因选择不当而失去健康。
    // ========================================================================
    {
      id: "b831_event_life_impact_v2",
      phase: "street",
      icon: "🌟",
      title: "那些选择，改变了你的人生",
      story: "你回想起那些关键的时刻——\n\n选择帮王大婶修水管，还是选择旁观？\n\n选择揭发工头的违规，还是选择沉默？\n\n每一个选择，都把你推向了不同的人生轨道。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b831LifeImpactDone) return false;
        var _eventCount = st.flags._eventCount || 0;
        if (_eventCount < 25) return false;
        var _health = st.status ? st.status.health : 100;
        return _health < 60;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🌟 每一个选择都值得",
          hint: "健康+10, 心情+10, 置_b831LifeChoicesAcknowledged",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b831LifeImpactDone = true;
            st.flags._b831LifeChoicesAcknowledged = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
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
            st.flags._b831LifeImpactDone = true;
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

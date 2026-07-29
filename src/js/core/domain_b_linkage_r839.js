/*
 * 城市浮生记 — 域B(事件/叙事) 联动增强 R839
 * 全系统优化·Domain B 第三十轮循环
 *
 * 【联动增强3项】
 *   1. B→A 事件数据遗产v3 — 事件积累的数据转化为数值平衡洞察
 *   2. B→F 事件UI回响v4 — 事件选择在UI层的展示更新
 *   3. B→C 事件职业催化剂v4 — 事件选择触发职业技能成长
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域B铁律：NPC事件须 rel && rel.met；天气事件须 weather 守卫。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR839Loaded) return;
  RANDOM_EVENTS._domainBLinkageR839Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: B→A 事件数据遗产v3 — 事件积累的数据转化为数值洞察
    // 设计意图：玩家经历的事件(选择/结果)应积累为"人生经验数据"，供数值域消费。
    // 本事件在玩家经历≥45个事件后触发，给予"人生经验数据v3"标记。
    // 心理学：禀赋效应 — 玩家感到"这些经历塑造了现在的我"。
    // ========================================================================
    {
      id: "b839_event_data_v3",
      phase: "street",
      icon: "📚",
      title: "你经历的一切，都是数据",
      story: "你回顾了来这座城市后的点点滴滴——那些做出的选择、那些遇到的人、那些成功与失败。\n\n每一个事件，都在你身上留下了痕迹。它们不只是故事，更是你独有的「人生经验数据」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b839EventDataDone) return false;
        var _eventCount = st.flags._eventCount || 0;
        return _eventCount >= 45 && st.player.day >= 150;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📚 深度分析人生数据",
          hint: "智力+12, 心智+10, 置_b839LifeDataV3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b839EventDataDone = true;
            st.flags._b839LifeDataV3 = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 你深度分析了人生数据——智力+12, 心智+10。经历是最宝贵的财富。", "success");
            }
          }
        },
        {
          text: "😊 活在当下",
          hint: "心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b839EventDataDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 活在当下，也是一种智慧。心情+5。", "success");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: B→F 事件UI回响v4 — 事件选择在UI层的展示更新
    // 设计意图：事件中的选择应在UI层有反馈，让玩家感到"我的选择被看见"。
    // 本事件在玩家经历≥35个事件后触发，给予"选择回响UIv4"标记。
    // 心理学：认知负荷 — UI反馈降低玩家信息处理负担。
    // ========================================================================
    {
      id: "b839_event_ui_v4",
      phase: "street",
      icon: "🖼️",
      title: "你的选择，都记录在案",
      story: "你打开事件历史面板——每一个选择、每一个结果，都清晰地记录在案。\n\n这些不是枯燥的日志，而是你人生的「选择轨迹」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b839EventUIDone) return false;
        var _eventCount = st.flags._eventCount || 0;
        return _eventCount >= 35;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🖼️ 查看选择轨迹",
          hint: "心智+12, 置_b839ChoiceTrackerV4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b839EventUIDone = true;
            st.flags._b839ChoiceTrackerV4 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🖼️ 选择轨迹已可视化——心智+12。看到自己的选择被记录，你会更认真地对待每一个决定。", "success");
            }
          }
        },
        {
          text: "😅 过去就过去了",
          hint: "心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b839EventUIDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 过去就过去了。心情+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: B→C 事件职业催化剂v4 — 事件选择触发职业技能成长
    // 设计意图：事件中的选择应触发职业技能成长，让玩家感到"经历就是能力"。
    // 本事件在玩家经历≥30个事件且拥有≥2个Lv.30+技能时触发。
    // 心理学：技能协同 — 不同领域的经历互相强化。
    // ========================================================================
    {
      id: "b839_event_career_v4",
      phase: "street",
      icon: "🚀",
      title: "经历，是更好的老师",
      story: "你发现——那些经历过的事件，不知不觉中提升了你的职业技能。\n\n不是刻意的学习，而是「做中学」的自然成长。\n\n经历，是更好的老师。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b839CareerCatalystDone) return false;
        if (!st.skills) return false;
        var _eventCount = st.flags._eventCount || 0;
        if (_eventCount < 30) return false;
        var _count = 0;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 30) _count++;
        }
        return _count >= 2;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🚀 将经历转化为能力",
          hint: "最高技能XP+15, 置_b839ExperienceToSkill",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b839CareerCatalystDone = true;
            st.flags._b839ExperienceToSkill = true;
            var _topSkill = "", _topLevel = 0;
            if (st.skills) {
              for (var _sk in st.skills) {
                var _sl = st.skills[_sk];
                if (_sl && (_sl.level || 0) > _topLevel) {
                  _topLevel = _sl.level || 0;
                  _topSkill = _sk;
                }
              }
            }
            if (_topSkill && typeof addSkillXp === "function") {
              try { addSkillXp(_topSkill, 15); } catch(e) {}
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 经历转化为职业能力——" + (_topSkill || "技能") + "XP+15。", "success");
            }
          }
        },
        {
          text: "😊 经历就是经历",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b839CareerCatalystDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 经历就是经历。心智+3。", "info");
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

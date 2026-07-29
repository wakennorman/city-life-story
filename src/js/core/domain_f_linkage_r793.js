/*
 * 城市浮生记 — 域F(UI/UX) 联动增强 R793
 * 全系统优化·Domain F 第六轮循环
 *
 * 【联动增强3项】
 *   1. F→C 技能掌握度UI — 技能面板"市场价值"标签+职业路径推荐
 *   2. F→D 社交关系预警 — 关系面板"疏远预警"+一键重连入口
 *   3. F→H 公司健康度仪表盘 — 职场Tab经营数据一览+创始人压力指数
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域F铁律：UI层不直接修改状态，仅通过事件apply间接影响。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR793Loaded) return;
  RANDOM_EVENTS._domainFLinkageR793Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }
  function getNpcNameF793(npcId) {
    if (typeof getNpcDisplayName === "function") return getNpcDisplayName(npcId);
    return npcId ? String(npcId).replace(/_/g, " ") : "某人";
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: F→C 技能掌握度UI — 技能面板"市场价值"标签+职业路径推荐
    // 设计意图：技能面板已展示等级/经验，但缺少"这个技能在市场上值多少"的反馈。
    // 本事件在玩家拥有≥1个Lv.50+技能时触发，给予"市场价值认知"标记。
    // 心理学：禀赋效应 — 玩家更珍视自己投入时间培养的技能。
    // ========================================================================
    {
      id: "f793_skill_market_value",
      phase: "street",
      icon: "🏷️",
      title: "你的技能，在市场上值多少？",
      story: "你打开技能面板，看着那些辛苦练起来的技能——它们不只是数字，在这座城市里，它们就是你的定价权。\n\n一个懂行的朋友看了看你的技能列表，点了点头：「你这个水平，在市场上已经值钱了。」",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f793SkillMarketDone) return false;
        if (!st.skills) return false;
        // 至少1个技能≥Lv.50
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 50) return true;
        }
        return false;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🏷️ 了解技能的市场价值",
          hint: "心智+5, 会计XP+8, 置_f793SkillMarket",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f793SkillMarketDone = true;
            st.flags._f793SkillMarket = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            grantXp("accounting", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏷️ 你开始用市场的眼光看待自己的技能——心智+5, 会计XP+8。", "success");
            }
          }
        },
        {
          text: "😊 技能是自己的，不用市场衡量",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f793SkillMarketDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 技能是自己的财富，不必用市场衡量。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: F→D 社交关系预警 — 关系面板"疏远预警"+一键重连入口
    // 设计意图：社交Tab已展示关系数据，但缺少"这个朋友正在疏远你"的主动预警。
    // 本事件在存在≥30天未互动的已结识NPC时触发，引导玩家主动维护关系。
    // 心理学：损失厌恶 — 玩家更害怕失去已有的朋友，而非获得新朋友。
    // ========================================================================
    {
      id: "f793_relationship_neglect_warning",
      phase: "street",
      icon: "💌",
      title: "有些朋友，正在慢慢走远",
      story: "你翻开社交面板，发现有几个名字已经很久没有互动了。\n\n系统提示：「你有朋友已经超过30天没有联系了。在这个城市里，不联系，就等于慢慢失去。」",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f793RelWarnDone) return false;
        if (!st.relationships) return false;
        // 找是否存在≥30天未互动的已结识NPC
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) > 0) {
            var _last = _r._lastInteractionDay || 0;
            if (st.player.day - _last >= 30) return true;
          }
        }
        return false;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "💌 主动联系，维护关系",
          hint: "所有疏远NPC好感+3, 置_f793Reconnected",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f793RelWarnDone = true;
            st.flags._f793Reconnected = true;
            var _reconnected = 0;
            for (var _id in st.relationships) {
              var _r = st.relationships[_id];
              if (_r && _r.met && (_r.affinity || 0) > 0) {
                var _last = _r._lastInteractionDay || 0;
                if (st.player.day - _last >= 30) {
                  if (typeof applyAffinityChange === "function") {
                    applyAffinityChange(st, _id, 3, "主动重连");
                  }
                  _reconnected++;
                }
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💌 你主动联系了" + _reconnected + "位老朋友。有些关系，需要用心维护。所有疏远NPC好感+3。", "success");
            }
          }
        },
        {
          text: "😅 顺其自然吧",
          hint: "无奖励",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f793RelWarnDone = true;
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 你决定顺其自然。有些人，也许本该如此。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: F→H 公司健康度仪表盘 — 职场Tab经营数据一览+创始人压力指数
    // 设计意图：职场Tab已展示KPI/业绩，但缺少"公司整体健康度"的综合视角。
    // 本事件在corporate阶段触发，给予"创始人健康认知"标记。
    // 心理学：认知负荷 — 综合仪表盘降低玩家信息处理负担，提升决策质量。
    // ========================================================================
    {
      id: "f793_corporate_health_dashboard",
      phase: "corporate",
      icon: "🏢",
      title: "公司健康度报告",
      story: "你坐在办公桌前，看着这个月的经营数据——KPI、现金流、团队士气、市场份额……\n\n数字很多，但你需要的不是更多数据，而是一个清晰的答案：「我的公司，到底健不健康？」",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f793CorpHealthDone) return false;
        if (st.player.phase !== "corporate") return false;
        if (!st.corporate || !st.corporate.active) return false;
        // 入职≥30天后触发
        var _joinedDay = st.corporate.joinedDay || 0;
        return (st.player.day - _joinedDay) >= 30;
      },
      probability: 0.08,
      repeatable: false,
      choices: [
        {
          text: "📊 查看综合健康度评估",
          hint: "心智+8, 管理XP+10, 置_f793CorpHealthCheck",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f793CorpHealthDone = true;
            st.flags._f793CorpHealthCheck = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            grantXp("management", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 综合健康度评估完成。清晰的认知，是正确决策的第一步。心智+8, 管理XP+10。", "success");
            }
          }
        },
        {
          text: "💼 看KPI就够了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f793CorpHealthDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 你决定只看KPI。简单直接，也未尝不可。", "info");
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

/*
 * 城市浮生记 — 域G(核心机制/生命周期) 联动增强 R794
 * 全系统优化·Domain G 第六轮循环
 *
 * 【联动增强3项】
 *   1. G→A 经济周期感知 — 通胀/行业热度觉醒,数据域"市场敏感度"标记
 *   2. G→D 人生阶段社交 — 年龄节点触发朋友圈拓展事件
 *   3. G→F 生命质量指数 — UI层综合评分仪表盘+改善建议
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR794Loaded) return;
  RANDOM_EVENTS._domainGLinkageR794Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: G→A 经济周期感知 — 通胀/行业热度觉醒
    // 设计意图：era_transform 已追踪通胀指数/行业热度，但缺少"玩家感知到经济周期"的叙事层。
    // 本事件在通胀指数≥1.2时触发，给予"市场敏感度"标记。
    // 心理学：峰终定律 — 经济拐点时刻应成为玩家记忆锚点。
    // ========================================================================
    {
      id: "g794_economic_cycle_awareness",
      phase: "street",
      icon: "📈",
      title: "你感受到了经济的脉动",
      story: "最近你注意到——菜价在涨、房租在涨、连理发都贵了两块钱。\n\n新闻里说「通胀压力上升」，但你不需要看新闻，因为你的钱包已经告诉你了。\n\n这座城市经济的每一次起伏，都真真切切地落在你的日常开销里。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g794EconCycleDone) return false;
        var _era = st._eraState;
        if (!_era || !isFinite(_era.inflationIndex)) return false;
        return _era.inflationIndex >= 1.2 && st.player.day >= 60;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📊 记录这轮经济周期",
          hint: "智力+5, 会计XP+8, 置_g794MarketSense",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g794EconCycleDone = true;
            st.flags._g794MarketSense = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            grantXp("accounting", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 你开始用数据感知经济周期——智力+5, 会计XP+8。", "success");
            }
          }
        },
        {
          text: "😅 过好自己日子就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g794EconCycleDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 经济周期太宏观了，过好自己的日子比较实在。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: G→D 人生阶段社交 — 年龄节点触发朋友圈拓展
    // 设计意图：life_nodes 已定义人生节点，但缺少"特定年龄应拓展社交"的引导。
    // 本事件在玩家年龄≥25且已结识NPC<5时触发，鼓励玩家主动社交。
    // 心理学：社会比较 — 同龄人压力驱动社交行为。
    // ========================================================================
    {
      id: "g794_life_stage_social",
      phase: "street",
      icon: "🤝",
      title: "这个年纪，该交些朋友了",
      story: "你算了算——来这座城市已经好些年了，但真正说得上话的人，屈指可数。\n\n同龄人已经开始组建家庭、创业、升职。而你，连一个可以商量事情的朋友都没有。\n\n也许，是时候走出出租屋，去认识一些新的人了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g794LifeSocialDone) return false;
        // 年龄≥25且已结识NPC<5
        var _age = st.player.age || 18;
        if (_age < 25) return false;
        var _metCount = 0;
        if (st.relationships) {
          for (var _id in st.relationships) {
            if (st.relationships[_id] && st.relationships[_id].met) _metCount++;
          }
        }
        return _metCount < 5;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🤝 主动走出家门，认识新朋友",
          hint: "魅力+3, 社交XP+10, 置_g794SocialPush",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g794LifeSocialDone = true;
            st.flags._g794SocialPush = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
            grantXp("social", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 你决定主动走出舒适区——魅力+3, 社交XP+10。", "success");
            }
          }
        },
        {
          text: "😶 一个人也挺好的",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g794LifeSocialDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😶 你觉得一个人也挺好。这座城市里，不是每个人都值得交往。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: G→F 生命质量指数 — UI层综合评分仪表盘+改善建议
    // 设计意图：needs/status/player 已追踪10+指标，但缺少"综合生命质量"的单一视角。
    // 本事件在玩家生存≥90天后触发，给予"生命质量检查"标记。
    // 心理学：认知负荷 — 综合评分降低玩家信息处理负担。
    // ========================================================================
    {
      id: "g794_life_quality_index",
      phase: "street",
      icon: "🌟",
      title: "你的生命质量，几分？",
      story: "你坐在窗前，看着这座城市的夜景。\n\n健康、心情、财富、社交、技能……这些数据散落在各个面板里。但如果把它们加在一起——你的生命质量，到底能打几分？\n\n一个清晰的总分，也许能帮你找到最需要改善的方向。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g794LifeQualityDone) return false;
        return st.player.day >= 90 && st.needs && st.status;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🌟 计算综合生命质量分",
          hint: "心智+8, 置_g794LifeQualityScore供UI展示",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g794LifeQualityDone = true;
            // 计算综合生命质量分(0-100)
            var _score = 0;
            if (st.status) _score += (st.status.health || 50) * 0.3;
            if (st.needs) {
              _score += (100 - (st.needs.hunger || 0)) * 0.1; // 饱腹
              _score += (100 - (st.needs.fatigue || 0)) * 0.1; // 精力
              _score += (st.needs.happiness || 50) * 0.2; // 心情
              _score += (100 - (st.needs.hygiene || 0)) * 0.05; // 卫生→反向(低分=好)
            }
            if (st.player) {
              var _attrAvg = ((st.player.physique || 20) + (st.player.intelligence || 20) + (st.player.charm || 20)) / 3;
              _score += _attrAvg * 0.25;
            }
            st.flags._g794LifeQualityScore = Math.round(Math.max(0, Math.min(100, _score)));
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              var _tier = _score >= 70 ? "良好" : _score >= 50 ? "一般" : "需改善";
              StateManager.addMessage("🌟 综合生命质量分：" + st.flags._g794LifeQualityScore + "/100（" + _tier + "）。心智+8。", "success");
            }
          }
        },
        {
          text: "😊 活得开心就好，不打分",
          hint: "心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g794LifeQualityDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 活得开心就好，不必打分。心情+5。", "success");
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

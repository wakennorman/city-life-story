/*
 * 城市浮生记 — 域F（UI/UX）联动增强 · R168
 * 全系统优化 loop R168 · 联动增强 3项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._uiLinkageR168) return;
  RANDOM_EVENTS._uiLinkageR168 = true;

  // ---- 本地助手 ----

  // 安全改好感
  function safeAffinityR168(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域F R168联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 获取已结识NPC数量
  function metNpcCountR168(st) {
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      if (st.relationships[id] && st.relationships[id].met) count++;
    }
    return count;
  }

  // ---- 联动事件 ----

  var F_EVENTS = [

    // ===== 联动1: F→A 市场数据洞察 =====
    // 设计意图：当玩家积累了足够的经济数据时，触发"数据洞察"叙事事件，
    //   让玩家感受到"数字背后有故事"，增强数据可视化感知。
    {
      id: "ui_market_data_insight",
      title: "账本里的秘密",
      desc: "你翻看这几天的收支记录，发现了一个规律——有些日子赚钱特别容易，有些日子怎么努力都白忙。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player || !st.resources || !st.flags) return false;
        if (st.flags._uiMarketDataInsightDone) return false;
        // 有一定交易基础
        var trade = st.trade || {};
        var totalTrades = (trade.totalBuys || 0) + (trade.totalSells || 0);
        if (totalTrades < 15) return false;
        // 有正收入
        var cash = st.resources.cash || 0;
        if (cash <= 0) return false;
        return true;
      },
      choices: [
        {
          text: "📊 总结规律，优化策略",
          apply: function (st) {
            if (st.flags) st.flags._uiMarketDataInsightDone = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你从数据中发现了规律——有些日子适合买卖，有些日子适合存钱。智力+3，心智+2。",
                "good"
              );
          },
        },
        {
          text: "🎲 太复杂了，继续埋头干",
          apply: function (st) {
            if (st.flags) st.flags._uiMarketDataInsightDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你决定不去想太多——有时候直觉比数据更可靠。",
                "info"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动2: F→D 朋友圈里的NPC动态 =====
    // 设计意图：当玩家已结识多个NPC时，触发"NPC发朋友圈"叙事事件，
    //   让NPC的社交动态成为玩家与NPC互动的新渠道。
    {
      id: "ui_npc_social_feed",
      title: "朋友圈里的TA",
      desc: "你刷到一位熟人发的朋友圈，内容让你有些意外——原来TA还有这样的一面。",
      phase: "street",
      triggers: { minDay: 45 },
      conditions: function (st) {
        if (!st || !st.player || !st.relationships || !st.flags) return false;
        if (st.flags._uiNpcSocialFeedDone) return false;
        // 至少结识2个NPC
        if (metNpcCountR168(st) < 2) return false;
        // 至少1个NPC好感≥25
        var hasCloseNpc = false;
        for (var id in st.relationships) {
          if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
          var r = st.relationships[id];
          if (r && r.met && (r.affinity || 0) >= 25) {
            hasCloseNpc = true;
            break;
          }
        }
        if (!hasCloseNpc) return false;
        return true;
      },
      choices: [
        {
          text: "❤️ 点赞并留言关心",
          apply: function (st) {
            if (st.flags) st.flags._uiNpcSocialFeedDone = true;
            // 给好感最高的NPC加好感
            if (st.relationships) {
              var best = null, bestAff = 0;
              for (var id in st.relationships) {
                if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
                var r = st.relationships[id];
                if (r && r.met && (r.affinity || 0) > bestAff) {
                  best = id; bestAff = r.affinity || 0;
                }
              }
              if (best) safeAffinityR168(st, best, 5, "朋友圈互动");
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你在朋友圈里和熟人互动——维系关系不需要大动作，一点关心就够了。心智+3。",
                "good"
              );
          },
        },
        {
          text: "👀 默默划过，不留言",
          apply: function (st) {
            if (st.flags) st.flags._uiNpcSocialFeedDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你选择了沉默——有时候不说话也是一种态度。",
                "info"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动3: F→G 日报反思与目标设定 =====
    // 设计意图：当玩家游戏天数足够时，触发"日报反思"叙事事件，
    //   让玩家回顾过去、展望未来，增强留存钩子。
    {
      id: "ui_daily_reflection",
      title: "今天的你，比昨天更好吗？",
      desc: "你看着今天的日报，忍不住想——明天要怎么做才能比今天更好？",
      phase: "street",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._uiDailyReflectionDone) return false;
        // 至少活了30天
        if ((st.player.day || 0) < 30) return false;
        return true;
      },
      choices: [
        {
          text: "🎯 设定明天的小目标",
          apply: function (st) {
            if (st.flags) st.flags._uiDailyReflectionDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
            }
            // 标记：后续日报事件可消费此 flag 解锁目标追踪
            if (st.flags) st.flags._dailyGoalSet = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你为明天设定了一个小目标——有目标的人，不会迷失方向。心智+5，智力+1。",
                "good"
              );
          },
        },
        {
          text: "😌 顺其自然，明天再说",
          apply: function (st) {
            if (st.flags) st.flags._uiDailyReflectionDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你决定顺其自然——有时候放松也是一种智慧。心智+2。",
                "info"
              );
          },
        },
      ],
      probability: 0.03,
    },
  ];

  // 注册到 RANDOM_EVENTS
  for (var i = 0; i < F_EVENTS.length; i++) {
    var evt = F_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions) evt.conditions = function () { return false; };
    RANDOM_EVENTS.push(evt);
  }
})();

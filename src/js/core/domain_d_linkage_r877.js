/*
 * 城市浮生记 — 域D(NPC/社交) 联动增强 R877
 * 全系统优化·Domain D 第六十七轮循环
 *
 * 【联动增强3项 — D→F 方向(仅22次,相对薄弱)】
 *   1. D→F 社交资本可视化v1 — 社交数据在UI层的综合可视化展示
 *   2. D→F 朋友活动推送UIv1 — NPC动态在UI层的推送展示
 *   3. D→F 社交关系变化提醒UIv1 — 关系变化的UI提醒
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS,避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 *  - D→F 核心设计理念：社交数据不应只是后台数值,
 *    应在UI层有直观的可视化展示——认知负荷+禀赋效应。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR877Loaded) return;
  RANDOM_EVENTS._domainDLinkageR877Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: D→F 社交资本可视化v1
    // 设计意图：社交数据在UI层综合展示,让玩家直观看到自己的社交资本——
    //    认知负荷(降低信息处理成本)+禀赋效应(拥有感)。
    // 触发：≥5个已结识NPC + 总好感度≥200
    // 心理学：认知负荷(综合评分降低信息处理成本)+禀赋效应(拥有感)
    // ========================================================================
    {
      id: "d877_social_capital_viz_v1",
      phase: "street",
      icon: "📊",
      title: "社交资本可视化",
      story: "你的社交圈已经初具规模——朋友遍布各行各业,总好感度达到了新的高度。\n\n是时候看看自己的社交资本在全城排第几了。",
      triggers: { minDay: 100, interval: 200, maxRepeats: 1, excludeFlags: ["_d877SocialCapVizCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d877SocialCapVizCd) return false;
        // 需有至少5个已结识NPC + 总好感度≥200
        if (!st.relationships) return false;
        var _metCount = 0, _totalAff = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met) { _metCount++; _totalAff += _r.affinity || 0; }
        }
        return _metCount >= 5 && _totalAff >= 200;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 查看社交资本仪表盘",
          hint: "社交XP+15, 智力+10, 置_d877CapViz",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d877SocialCapVizCd = true;
            st.flags._d877CapViz = true;
            grantXp("social", 15);
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 社交资本仪表盘已生成——社交XP+15, 智力+10。", "success");
            }
          }
        },
        {
          text: "😅 数据是虚的,感情是真的",
          hint: "心智+10, 置_d877Emotional",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d877SocialCapVizCd = true;
            st.flags._d877Emotional = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 数据是虚的,感情是真的——心智+10。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: D→F 朋友活动推送UIv1
    // 设计意图：NPC动态在UI层推送,让玩家感到"朋友在身边"——
    //    社会认同+弱连接理论。
    // 触发：≥3个已结识NPC + 冷却期已过
    // 心理学：社会认同(朋友的生活引发共鸣)+弱连接理论(泛泛之交的信息价值)
    // ========================================================================
    {
      id: "d877_friend_activity_feed_v1",
      phase: "street",
      icon: "📱",
      title: "朋友们的最新动态",
      story: "打开手机,发现朋友们都在分享自己的生活——有人升职了,有人去旅行了,有人养了只猫。\n\n点赞,评论,社交就在这些小事中维系。",
      triggers: { minDay: 60, interval: 150, maxRepeats: 2, excludeFlags: ["_d877FeedCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d877FeedCd) return false;
        // 需有至少3个已结识NPC
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met) _metCount++;
        }
        return _metCount >= 3;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📱 点赞评论,互动一下",
          hint: "社交XP+15, 所有已结识NPC好感+3, 置_d877Engage",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d877FeedCd = true;
            st.flags._d877Engage = true;
            grantXp("social", 15);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 3, "动态互动");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📱 点赞评论,互动一下——社交XP+15, 所有朋友好感+3。", "success");
            }
          }
        },
        {
          text: "😅 刷完就算,不评论",
          hint: "心智+8, 置_d877Lurker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d877FeedCd = true;
            st.flags._d877Lurker = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 刷完就算——心智+8。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: D→F 社交关系变化提醒UIv1
    // 设计意图：UI层检测到关系显著变化时触发提醒,
    //   引导玩家关注社交圈——认知负荷+禀赋效应。
    // 触发：≥1个NPC好感达到新里程碑(30/60/80) + 冷却期已过
    // 心理学：认知负荷(降低信息处理成本)+峰终定律(里程碑记忆)
    // ========================================================================
    {
      id: "d877_relationship_milestone_v1",
      phase: "street",
      icon: "💕",
      title: "关系有了新进展",
      story: "你和朋友之间的关系有了新的突破——从陌生到相识,从相识到好友。\n\n每一段关系都值得珍惜。",
      triggers: { minDay: 40, interval: 120, maxRepeats: 3, excludeFlags: ["_d877MilestoneCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d877MilestoneCd) return false;
        // 需有至少1个NPC好感达到里程碑(30/60/80)
        if (!st.relationships) return false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met) {
            var _aff = _r.affinity || 0;
            if (_aff === 30 || _aff === 60 || _aff === 80) return true;
          }
        }
        return false;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💕 珍惜这段关系",
          hint: "社交XP+12, 该NPC好感+5, 置_d877Cherish",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d877MilestoneCd = true;
            st.flags._d877Cherish = true;
            grantXp("social", 12);
            // 找到达到里程碑的NPC并提升好感
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) {
                  var _aff = _mr.affinity || 0;
                  if (_aff === 30 || _aff === 60 || _aff === 80) {
                    applyAffinityChange(st, _mid, 5, "关系里程碑");
                  }
                }
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💕 珍惜这段关系——社交XP+12, 该NPC好感+5。", "success");
            }
          }
        },
        {
          text: "😅 顺其自然,不用刻意",
          hint: "心智+8, 置_d877Natural",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d877MilestoneCd = true;
            st.flags._d877Natural = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 顺其自然——心智+8。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();

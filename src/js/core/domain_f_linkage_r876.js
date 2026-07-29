/*
 * 城市浮生记 — 域F(UI/UX) 联动增强 R876
 * 全系统优化·Domain F 第三十轮循环
 *
 * 【联动增强3项 — F→D 方向(仅3次,历轮最薄弱)】
 *   1. F→D 社交资本变化提醒v1 — UI层展示社交资本变化,提醒玩家关注朋友
 *   2. F→D 朋友生日提醒v1 — UI层提醒今日有NPC生日,引导拜访
 *   3. F→D 朋友动态推送v1 — UI层推送NPC动态,触发社交互动
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS,避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 *  - F→D 核心设计理念：UI不应只是展示信息,还应引导社交行为——
 *    认知负荷(降低信息处理成本)+禀赋效应(拥有感)。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR876Loaded) return;
  RANDOM_EVENTS._domainFLinkageR876Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: F→D 社交资本变化提醒v1
    // 设计意图：UI层检测到社交资本(总好感度)显著变化时触发提醒,
    //   引导玩家关注社交圈——认知负荷+禀赋效应。
    // 触发：总好感度≥100 + ≥3个已结识NPC
    // 心理学：认知负荷(降低信息处理成本)+禀赋效应(拥有感)
    // ========================================================================
    {
      id: "f876_social_capital_change_v1",
      phase: "street",
      icon: "📊",
      title: "社交资本变化",
      story: "你的社交圈在悄悄变化——有些关系在升温,有些在降温。\n\n是时候审视一下自己的社交资本了。",
      triggers: { minDay: 70, interval: 180, maxRepeats: 2, excludeFlags: ["_f876SocialCapCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f876SocialCapCd) return false;
        // 需有至少3个已结识NPC
        if (!st.relationships) return false;
        var _metCount = 0, _totalAff = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met) { _metCount++; _totalAff += _r.affinity || 0; }
        }
        // 需总好感度≥100(社交资本积累)
        return _metCount >= 3 && _totalAff >= 100;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 查看社交资本报告",
          hint: "社交XP+12, 智力+8, 置_f876SocialCapReview",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f876SocialCapCd = true;
            st.flags._f876SocialCapReview = true;
            grantXp("social", 12);
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 社交资本报告已生成——社交XP+12, 智力+8。", "success");
            }
          }
        },
        {
          text: "😅 知道就好,不用细看",
          hint: "心智+8, 置_f876SkipReport",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f876SocialCapCd = true;
            st.flags._f876SkipReport = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 知道就好——心智+8。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: F→D 朋友生日提醒v1
    // 设计意图：UI层检测到今日有已结识NPC生日时触发提醒,
    //   引导玩家拜访——峰终定律+互惠原则。
    // 触发：今日有已结识NPC生日 + 该NPC好感≥30
    // 心理学：峰终定律(生日是记忆峰值)+互惠原则(礼尚往来)
    // ========================================================================
    {
      id: "f876_npc_birthday_reminder_v1",
      phase: "street",
      icon: "🎂",
      title: "今天有人过生日",
      story: "翻翻日历,发现今天有位朋友过生日。\n\n一个祝福,一次拜访,也许就能让这段关系更进一步。",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_f876BirthdayCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f876BirthdayCd) return false;
        if (!st.relationships || !st.player.day) return false;
        // 检查是否有已结识NPC今天生日
        var _dayOfYear = ((st.player.day - 1) % 365) + 1;
        if (typeof NPCS === "undefined") return false;
        for (var _bi = 0; _bi < NPCS.length; _bi++) {
          var _n = NPCS[_bi];
          if (_n && _n.birthday === _dayOfYear && _n.id && st.relationships[_n.id] && st.relationships[_n.id].met) {
            if ((st.relationships[_n.id].affinity || 0) >= 30) return true;
          }
        }
        return false;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🎂 去拜访,送个祝福",
          hint: "社交XP+15, 该NPC好感+8, 心情+8, 置_f876BirthdayVisit",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f876BirthdayCd = true;
            st.flags._f876BirthdayVisit = true;
            grantXp("social", 15);
            // 找到生日NPC并提升好感
            if (st.relationships && st.player && typeof NPCS !== "undefined") {
              var _dayOfYear = ((st.player.day - 1) % 365) + 1;
              for (var _bi = 0; _bi < NPCS.length; _bi++) {
                var _n = NPCS[_bi];
                if (_n && _n.birthday === _dayOfYear && _n.id && st.relationships[_n.id] && st.relationships[_n.id].met) {
                  if (typeof applyAffinityChange === "function") {
                    applyAffinityChange(st, _n.id, 8, "生日祝福");
                  }
                  break;
                }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎂 去拜访,送个祝福——社交XP+15, 朋友好感+8, 心情+8。", "success");
            }
          }
        },
        {
          text: "😅 太忙了,下次吧",
          hint: "心智+6, 置_f876SkipBirthday",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f876BirthdayCd = true;
            st.flags._f876SkipBirthday = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 太忙了,下次吧——心智+6。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: F→D 朋友动态推送v1
    // 设计意图：UI层推送NPC动态(生活事件),触发玩家与NPC互动——
    //    社会认同+弱连接理论。
    // 触发：≥2个已结识NPC + 冷却期已过
    // 心理学：社会认同(朋友的生活引发共鸣)+弱连接理论(泛泛之交的信息价值)
    // ========================================================================
    {
      id: "f876_npc_feed_push_v1",
      phase: "street",
      icon: "📱",
      title: "朋友发了新动态",
      story: "刷到手机,发现朋友们都在分享自己的生活——有人升职了,有人去旅行了,有人养了只猫。\n\n点点赞,评论几句,社交就在这些小事中维系。",
      triggers: { minDay: 50, interval: 120, maxRepeats: 2, excludeFlags: ["_f876FeedPushCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f876FeedPushCd) return false;
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
          text: "📱 点赞评论,互动一下",
          hint: "社交XP+15, 所有已结识NPC好感+3, 置_f876Engage",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f876FeedPushCd = true;
            st.flags._f876Engage = true;
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
          hint: "心智+8, 置_f876Lurker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f876FeedPushCd = true;
            st.flags._f876Lurker = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 刷完就算——心智+8。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();

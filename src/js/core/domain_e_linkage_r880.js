/*
 * 城市浮生记 — 域E(经济/投资) 联动增强 R880
 * 全系统优化·Domain E 第六十八轮循环
 *
 * 【联动增强3项 — E→D 方向(仅7次,历轮薄弱)】
 *   1. E→D 投资成功时朋友的祝贺v1 — 投资收益后朋友的态度
 *   2. E→D 投资失败时朋友的安慰v1 — 投资亏损后朋友的支持
 *   3. E→D 投资俱乐部社交v1 — 投资者圈子的人脉拓展
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS,避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 *  - E→D 核心设计理念：投资不是孤立的数字游戏,
 *    赚了钱有人恭喜,亏了钱有人安慰——社会认同+社会支持。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR880Loaded) return;
  RANDOM_EVENTS._domainELinkageR880Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: E→D 投资成功时朋友的祝贺v1
    // 设计意图：投资获得收益后,已结识NPC主动祝贺——社会认同+峰终定律。
    // 触发：投资总收益≥50000 + ≥1个好感≥50的NPC
    // 心理学：社会认同(被朋友认可)+峰终定律(赚钱时刻的记忆)
    // ========================================================================
    {
      id: "e880_invest_success_congrats_v1",
      phase: "street",
      icon: "🎉",
      title: "投资赚了,朋友们都知道了",
      story: "最近投资赚了一笔,心情大好。\n\n朋友们纷纷发来祝贺——「听说你最近混得不错啊,请客请客！」\n\n被朋友认可的感觉,真好。",
      triggers: { minDay: 100, interval: 240, maxRepeats: 1, excludeFlags: ["_e880SuccessCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e880SuccessCd) return false;
        // 需投资总收益≥50000
        if (!st.investment) return false;
        var _inv = st.investment;
        var _profit = (typeof _inv._totalInvestmentProfit === "number") ? _inv._totalInvestmentProfit : 0;
        if (_profit < 50000) return false;
        // 需有至少1个好感≥50的已结识NPC
        if (!st.relationships) return false;
        var _hasFriend = false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 50) { _hasFriend = true; break; }
        }
        return _hasFriend;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🎉 请客,大家一起开心",
          hint: "社交XP+18, 所有已结识NPC好感+5, 置_e880Celebrate",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e880SuccessCd = true;
            st.flags._e880Celebrate = true;
            grantXp("social", 18);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 5, "投资成功祝贺");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 请客,大家一起开心——社交XP+18, 所有朋友好感+5。", "success");
            }
          }
        },
        {
          text: "😅 谦虚一下,继续努力",
          hint: "心智+10, 管理XP+10, 置_e880Humble",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e880SuccessCd = true;
            st.flags._e880Humble = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            grantXp("management", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 谦虚一下——心智+10, 管理XP+10。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: E→D 投资失败时朋友的安慰v1
    // 设计意图：投资亏损后,已结识NPC主动安慰——社会支持+峰终定律。
    // 触发：投资总亏损≥20000 + ≥1个好感≥40的NPC
    // 心理学：社会支持(低谷时的温暖)+峰终定律(危机时刻的记忆)
    // ========================================================================
    {
      id: "e880_invest_loss_comfort_v1",
      phase: "street",
      icon: "💚",
      title: "投资亏了,朋友怎么看你",
      story: "最近投资亏了不少,心情低落。\n\n这时候,一个朋友找到了你——他没有嘲笑,也没有说教,只是默默陪你喝了一杯。\n\n患难见真情。",
      triggers: { minDay: 120, interval: 280, maxRepeats: 1, excludeFlags: ["_e880LossCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e880LossCd) return false;
        // 需投资总亏损≥20000
        if (!st.investment) return false;
        var _inv = st.investment;
        var _profit = (typeof _inv._totalInvestmentProfit === "number") ? _inv._totalInvestmentProfit : 0;
        if (_profit > -20000) return false; // 必须亏损≥20000
        // 需有至少1个好感≥40的已结识NPC
        if (!st.relationships) return false;
        var _hasFriend = false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 40) { _hasFriend = true; break; }
        }
        return _hasFriend;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "💚 感谢朋友的陪伴",
          hint: "社交XP+15, 朋友好感+8, 心情+10, 置_e880Grateful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e880LossCd = true;
            st.flags._e880Grateful = true;
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
              applyAffinityChange(st, _bestNpc, 8, "投资亏损安慰");
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 感谢朋友的陪伴——社交XP+15, 朋友好感+8, 心情+10。", "success");
            }
          }
        },
        {
          text: "😅 自己消化,不让朋友担心",
          hint: "心智+12, 置_e880SoloProcess",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e880LossCd = true;
            st.flags._e880SoloProcess = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 自己消化——心智+12。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: E→D 投资俱乐部社交v1
    // 设计意图：投资者圈子的人脉拓展——弱连接理论+社会认同。
    // 触发：持有投资 + ≥2个已结识NPC + 冷却期已过
    // 心理学：弱连接理论(泛泛之交的信息价值)+社会认同(圈子归属感)
    // ========================================================================
    {
      id: "e880_investor_club_social_v1",
      phase: "street",
      icon: "🥂",
      title: "投资者聚会",
      story: "一个投资者交流会的邀请函摆在你面前——同行们聚在一起,聊聊市场动态,分享投资心得。\n\n这种聚会,是结识行业人脉的好机会。",
      triggers: { minDay: 150, interval: 300, maxRepeats: 1, excludeFlags: ["_e880ClubCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e880ClubCd) return false;
        // 需持有投资
        if (!st.investment) return false;
        var _inv = st.investment;
        var _hasInvestment = (_inv.stockHoldings && Object.keys(_inv.stockHoldings).length > 0) ||
                             (_inv.btcHoldings && _inv.btcHoldings > 0) ||
                             (_inv.properties && _inv.properties.length > 0);
        if (!_hasInvestment) return false;
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
          text: "🥂 积极参加,扩展人脉",
          hint: "社交XP+18, 魅力+12, 所有已结识NPC好感+3, 置_e880Mixer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e880ClubCd = true;
            st.flags._e880Mixer = true;
            grantXp("social", 18);
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 12);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 3, "投资者聚会");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🥂 积极参加投资者聚会——社交XP+18, 魅力+12, 所有朋友好感+3。", "success");
            }
          }
        },
        {
          text: "😅 独自研究,不凑热闹",
          hint: "智力+12, 会计XP+10, 置_e880SoloStudy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e880ClubCd = true;
            st.flags._e880SoloStudy = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 独自研究——智力+12, 会计XP+10。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();

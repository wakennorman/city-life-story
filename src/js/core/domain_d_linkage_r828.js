/**
 * 域D(NPC/社交) 联动增强 R828
 * 全系统优化·Domain D 第六十三轮循环
 *
 * 【联动增强3项】
 *   1. D→A 社交资本数据v7 — NPC社交关系转化为数值洞察
 *   2. D→E 社交投资情报v6 — 社交圈情报影响投资决策
 *   3. D→G 社交健康恢复v6 — 社交活动反馈为健康恢复
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - NPC引用一律 rel && rel.met(域D铁律)；好感走 applyAffinityChange。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR828Loaded) return;
  RANDOM_EVENTS._domainDLinkageR828Loaded = true;

  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }
  function safeAffinity(st, nid, amt, reason) {
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, nid, amt, reason); } catch (e) {}
    }
  }
  function pickMetNpc(st) {
    if (!st || !st.relationships) return null;
    var ids = [];
    for (var k in st.relationships) {
      var rel = st.relationships[k];
      if (rel && rel.met) ids.push(k);
    }
    if (ids.length === 0) return null;
    return ids[Random.int(0, ids.length - 1)];
  }
  function npcName(id) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(id) || "老友"; } catch (e) { return "老友"; }
    }
    return "老友";
  }

  var EVENTS = [
    {
      // D→A: 社交资本数据v7 — 社交圈规模转化为数据洞察
      id: "d828_social_capital_v7",
      phase: "street",
      icon: "📊",
      title: "你的社交圈，是一张价值网",
      story: "你翻了翻通讯录——不知不觉已经认识了这么多人。每个名字背后，都是一段故事。而这张社交网络，本身就是一种资本。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d828SocialCapitalDone) return false;
        if (!st.relationships) return false;
        var _met = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met) _met++;
        }
        return _met >= 8 && st.player.day >= 150;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 量化社交资本价值",
          hint: "心智+22, 社交XP+25, 置_d828SocialCapital",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d828SocialCapitalDone = true;
            st.flags._d828SocialCapital = true;
            var _met = 0, _highAff = 0;
            for (var k in st.relationships) {
              var r = st.relationships[k];
              if (r && r.met) { _met++; if ((r.affinity || 0) >= 60) _highAff++; }
            }
            st.flags._d828SocialNetworkSize = _met;
            st.flags._d828HighAffinityCount = _highAff;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 22);
            grantXp("social", 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 社交资本量化完成——认识" + _met + "人,深交" + _highAff + "人。心智+22, 社交XP+25。", "success");
            }
          }
        },
        {
          text: "😊 朋友不是用来算的",
          hint: "心情+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d828SocialCapitalDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 朋友不是用来算的。心情+8。", "info");
            }
          }
        }
      ]
    },
    {
      // D→E: 社交投资情报v6 — 从NPC聊天中获取投资线索
      id: "d828_invest_tip_v6",
      phase: "street",
      icon: "💬",
      title: "朋友一句话，投资新思路",
      story: "你和一个老友聊天时，他无意中提起最近某个行业很火。说者无心，听者有意——也许这就是你一直在等的投资线索。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d828InvestTipDone) return false;
        if (!st.relationships) return false;
        var _met = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met) _met++;
        }
        return _met >= 5 && st.player.day >= 180;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💬 认真记下这个线索",
          hint: "智力+20, 会计XP+20, 置_d828InvestTip",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d828InvestTipDone = true;
            st.flags._d828InvestTip = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            grantXp("accounting", 20);
            // 给一个临时投资线索标记（供后续事件消费）
            st.flags._d828InvestmentHint = true;
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💬 你认真记下了朋友的投资线索——智力+20, 会计XP+20。", "success");
            }
          }
        },
        {
          text: "😅 听过就算了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d828InvestTipDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 听过就算了。心智+3。", "info");
            }
          }
        }
      ]
    },
    {
      // D→G: 社交健康恢复v6 — 与好友聚会恢复身心状态
      id: "d828_social_health_v6",
      phase: "street",
      icon: "🎉",
      title: "好友聚会，治愈身心",
      story: "你最近太累了。一个老朋友打来电话，约你周末聚聚。你犹豫了一下——手上的工作还没做完，但身体确实需要休息了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d828SocialHealthDone) return false;
        if (!st.relationships || !st.needs) return false;
        var _fatigue = st.needs.fatigue || 0;
        var _happiness = st.needs.happiness || 50;
        return _fatigue >= 50 && _happiness <= 40 && st.player.day >= 100;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "🎉 赴约，好好放松一下",
          hint: "疲劳-20, 心情+18, 健康+8, 置_d828SocialHealed",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d828SocialHealthDone = true;
            st.flags._d828SocialHealed = true;
            if (st.needs) {
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
            }
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 8);
            var nid = pickMetNpc(st);
            if (nid) safeAffinity(st, nid, 3, "聚会放松");
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 聚会很愉快——疲劳-20, 心情+18, 健康+8。", "success");
            }
          }
        },
        {
          text: "😅 下次吧，工作还没做完",
          hint: "疲劳+5, 心情-5, 置_d828SocialSkip",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d828SocialHealthDone = true;
            st.flags._d828SocialSkip = true;
            if (st.needs) {
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 下次吧。工作永远做不完，但身体会累垮。", "warning");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
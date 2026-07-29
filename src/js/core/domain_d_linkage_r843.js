/**
 * 域D(NPC/社交) 联动增强 R843
 * 全系统优化·Domain D 第六十五轮循环
 *
 * 【联动增强3项】
 *   1. D→A 社交资本数据v9 — NPC社交关系转化为数值洞察
 *   2. D→E 社交投资情报v8 — 社交圈情报影响投资决策
 *   3. D→G 社交健康恢复v8 — 社交活动反馈为健康恢复
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - NPC引用一律 rel && rel.met(域D铁律)；好感走 applyAffinityChange。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR843Loaded) return;
  RANDOM_EVENTS._domainDLinkageR843Loaded = true;

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
      if (st.relationships[k] && st.relationships[k].met) ids.push(k);
    }
    return ids.length > 0 ? ids[Random.int(0, ids.length - 1)] : null;
  }
  function npcName(id) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(id) || "老友"; } catch (e) { return "老友"; }
    }
    return "老友";
  }

  var EVENTS = [
    {
      id: "d843_social_capital_v9",
      phase: "street",
      icon: "📊",
      title: "你的社交圈，是一张价值网",
      story: "你翻了翻通讯录——不知不觉已经认识了这么多人。每个名字背后，都是一段故事。而这张社交网络，本身就是一种资本。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d843SocialCapitalDone) return false;
        if (!st.relationships) return false;
        var _met = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met) _met++;
        }
        return _met >= 12 && st.player.day >= 250;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 量化社交资本价值",
          hint: "心智+26, 社交XP+30, 置_d843SocialCapital",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d843SocialCapitalDone = true;
            st.flags._d843SocialCapital = true;
            var _met = 0, _highAff = 0;
            for (var k in st.relationships) {
              var r = st.relationships[k];
              if (r && r.met) { _met++; if ((r.affinity || 0) >= 60) _highAff++; }
            }
            st.flags._d843SocialNetworkSize = _met;
            st.flags._d843HighAffinityCount = _highAff;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 26);
            grantXp("social", 30);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 社交资本量化完成——认识" + _met + "人,深交" + _highAff + "人。心智+26, 社交XP+30。", "success");
            }
          }
        },
        {
          text: "😊 朋友不是用来算的",
          hint: "心情+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d843SocialCapitalDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 朋友不是用来算的。心情+10。", "info");
            }
          }
        }
      ]
    },
    {
      id: "d843_invest_tip_v8",
      phase: "street",
      icon: "💬",
      title: "朋友一句话，投资新思路",
      story: "你和一个老友聊天时，他无意中提起最近某个行业很火。说者无心，听者有意——也许这就是你一直在等的投资线索。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d843InvestTipDone) return false;
        if (!st.relationships) return false;
        var _met = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met) _met++;
        }
        return _met >= 8 && st.player.day >= 250;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💬 认真记下这个线索",
          hint: "智力+24, 会计XP+25, 置_d843InvestTip",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d843InvestTipDone = true;
            st.flags._d843InvestTip = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 24);
            grantXp("accounting", 25);
            st.flags._d843InvestmentHint = true;
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💬 你认真记下了朋友的投资线索——智力+24, 会计XP+25。", "success");
            }
          }
        },
        {
          text: "😅 听过就算了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d843InvestTipDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 听过就算了。心智+3。", "info");
            }
          }
        }
      ]
    },
    {
      id: "d843_social_health_v8",
      phase: "street",
      icon: "🎉",
      title: "好友聚会，治愈身心",
      story: "你最近太累了。一个老朋友打来电话，约你周末聚聚。你犹豫了一下——手上的工作还没做完，但身体确实需要休息了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d843SocialHealthDone) return false;
        if (!st.relationships || !st.needs) return false;
        var _fatigue = st.needs.fatigue || 0;
        var _happiness = st.needs.happiness || 50;
        return _fatigue >= 60 && _happiness <= 30 && st.player.day >= 150;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "🎉 赴约，好好放松一下",
          hint: "疲劳-25, 心情+22, 健康+12, 置_d843SocialHealed",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d843SocialHealthDone = true;
            st.flags._d843SocialHealed = true;
            if (st.needs) {
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 25);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 22);
            }
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 12);
            var nid = pickMetNpc(st);
            if (nid) safeAffinity(st, nid, 3, "聚会放松");
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 聚会很愉快——疲劳-25, 心情+22, 健康+12。", "success");
            }
          }
        },
        {
          text: "😅 下次吧，工作还没做完",
          hint: "疲劳+5, 心情-5, 置_d843SocialSkip",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d843SocialHealthDone = true;
            st.flags._d843SocialSkip = true;
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
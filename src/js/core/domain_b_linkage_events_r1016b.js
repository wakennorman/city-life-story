/**
 * 域B(事件/叙事) 联动增强 R1016b
 * — B→A 市场波动老手 / B→G 抉择的重量 / B→D 阅历讲述者
 *
 * 设计意图：本轮 A类修复让 _priceVolatilityCount / _majorChoiceCount / _eventsExperienced
 * 三个"经历计数器"首次拥有真实写入方（trade.js updateAllPrices + events_core.js 单点）。
 * 本联动在更高档位二次消费这批新生数据，形成「经历→顿悟」的峰终回响：
 * 玩家不再只是被动经历事件，而是在累积到阈值时收获一次身份认同式的叙事奖励。
 *
 * 约束：IIFE 注册 RANDOM_EVENTS；显式 phase；全 || 防御；done-flag 防重；
 *       NPC 一律 met 铁律 + applyAffinityChange 四参 + getNpcDisplayName 兜底。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR1016bLoaded) return;
  RANDOM_EVENTS._domainBLinkageR1016bLoaded = true;

  function gx(k, a) {
    if (typeof addSkillXp === "function") { try { addSkillXp(k, a); } catch (e) {} }
  }
  function msg(t, k) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage) StateManager.addMessage(t, k || "info");
  }
  // 取一位已认识且好感最高的 NPC（met 铁律）
  function topMetNpc(st) {
    if (!st || !st.relationships) return null;
    var best = null, bestAff = -1;
    for (var id in st.relationships) {
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) > bestAff) { bestAff = r.affinity || 0; best = id; }
    }
    return best;
  }
  function npcName(st, id) {
    if (typeof getNpcDisplayName === "function") {
      try { var n = getNpcDisplayName(st, id); if (n) return n; } catch (e) {}
    }
    return "邻居";
  }

  var E = [
    // 1. B→A：市场波动老手 —— 消费 R1016b 新生的 _priceVolatilityCount（真实价格波动周期数）
    {
      id: "b1016b_volatility_veteran",
      phase: "street",
      icon: "📊",
      title: "涨涨跌跌，你已经不慌了",
      story: "你翻着自己记的那本流水账，忽然愣了一下。\n\n物价涨过，也跌过；你抢过便宜货，也吃过高价的亏。一轮又一轮，你数不清经历了多少回。\n\n但今天菜价又跳了一截，你心里竟然一点波澜都没有——你已经知道它三天后会回来。\n\n这种笃定，是市场用真金白银教给你的。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b1016bVeteranDone) return false;
        return (st.flags._priceVolatilityCount || 0) >= 8 && st.player.day >= 60;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📊 把规律记成自己的进货节奏",
          hint: "销售XP+35, 智力+12, 置_b1016bMarketVeteran",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1016bVeteranDone = true;
            st.flags._b1016bMarketVeteran = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            gx("sales", 35);
            msg("📊 销售XP+35，智力+12。你不再追涨杀跌——你开始等它回来。", "success");
          },
        },
        {
          text: "😌 涨跌随它去，日子照过",
          hint: "心智+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1016bVeteranDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            msg("😌 心智+10。看淡了，也是一种本事。", "info");
          },
        },
      ],
    },

    // 2. B→G：抉择的重量 —— 消费 R1016b 新生的 _majorChoiceCount（真实多选项抉择次数）
    {
      id: "b1016b_decision_weight",
      phase: "street",
      icon: "⚖️",
      title: "那些岔路口，是你自己走过来的",
      story: "夜里睡不着，你把这些年做过的决定在脑子里过了一遍。\n\n有几个当时选得心惊胆战，现在看是对的；也有几个当时觉得聪明，后来才知道亏在哪。\n\n你忽然明白：没有哪一个选项是标准答案，是你走下去之后，它才变成了对的路。\n\n能替你负责的人，从来只有你自己。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b1016bWeightDone) return false;
        return (st.flags._majorChoiceCount || 0) >= 20 && st.player.day >= 80;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "⚖️ 认下每一个决定的后果",
          hint: "心智+25, 置_b1016bDecisive(决断者)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1016bWeightDone = true;
            st.flags._b1016bDecisive = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
            msg("⚖️ 心智+25。你不再害怕选错——你只怕不敢选。", "success");
          },
        },
        {
          text: "😮‍💨 不想再回头看了",
          hint: "心智+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1016bWeightDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            msg("😮‍💨 心智+8。往前看吧。", "info");
          },
        },
      ],
    },

    // 3. B→D：阅历讲述者 —— 消费 R1016b 新生的 _eventsExperienced（真实累计事件数）
    {
      id: "b1016b_story_teller",
      phase: "street",
      icon: "🍵",
      title: "你的故事，成了别人的路灯",
      story: "楼下石凳上，几个人正在聊各自的难处。\n\n有人问你：「你这些年，是怎么熬过来的？」\n\n你张了张嘴，忽然发现自己真的有东西可讲——那些狼狈的、侥幸的、咬牙撑过去的日子，如今都成了能说出口的经验。\n\n讲完了，有人沉默，有人点头。你也第一次看清了自己走过的路。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b1016bTellerDone) return false;
        if (!st.relationships) return false;
        return (st.flags._eventsExperienced || 0) >= 40 && st.player.day >= 100 && topMetNpc(st) !== null;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🍵 把真话讲给他们听",
          hint: "好感+6, 社交XP+30, 心智+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1016bTellerDone = true;
            st.flags._b1016bStoryShared = true;
            var id = topMetNpc(st);
            if (id && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, id, 6, "分享人生阅历"); } catch (e) {}
            }
            gx("social", 30);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            msg("🍵 " + npcName(st, id) + " 听得很认真。好感+6，社交XP+30，心智+10。", "success");
          },
        },
        {
          text: "😶 摆摆手，说没什么好讲的",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1016bTellerDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            msg("😶 心智+5。有些事，说出来反而轻了。", "info");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < E.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === E[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(E[i]);
  }
})();

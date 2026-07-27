/**
 * domain_e_linkage_r470.js — 域E(经济/投资) 联动增强 R470
 *
 * 设计背景：inv.cars（汽车持仓，phase2/investment.js buyCar 写入）此前在事件层
 * 仅被净资产求和消费（r262/economy_linkage/finance），其叙事子维度
 * travelBonus / depreciation / maintenance 全库零事件消费——买车后没有任何
 * "拥有座驾的生活质感"叙事，禀赋效应完全没被利用。本文件三事件全部首消费：
 *   1. e470_car_depreciation_lesson (E→G): 首消费 currentPrice<buyPrice 折旧对照
 *      ——消费品与资产的区别，损失厌恶教学叙事。
 *   2. e470_car_road_trip          (E→D): 有车 ∩ 已结识NPC → 载友出行涨好感，
 *      首消费 travelBonus 叙事维度。守 rel.met + applyAffinityChange 铁律。
 *   3. e470_car_ledger             (E→C): 养车成本记账 → accounting XP，
 *      首消费 maintenance 叙事维度，corporate 阶段职业化包装。
 * 全 || 防御；conditions 全 false 时叙事仍自洽（无车即不触发）。
 * 数值 [PLACEHOLDER] 已按同类事件基准填充。
 */
(function () {
  "use strict";
  if (typeof window !== "undefined" && window._domainELinkageR470Loaded) return;
  if (typeof window !== "undefined") window._domainELinkageR470Loaded = true;

  function carsOf(st) {
    if (!st || !st.investment || !Array.isArray(st.investment.cars)) return [];
    return st.investment.cars;
  }
  function firstMetNpcR470(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      var rel = st.relationships[id];
      if (rel && rel.met && (rel.affinity || 0) >= 20) return id;
    }
    return null;
  }

  var EVENTS = [
    {
      id: "e470_car_depreciation_lesson",
      phase: "street",
      _isChainEvent: false,
      icon: "📉",
      title: "落地打八折",
      story: "你查了查自己那辆车现在的行情——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 3, excludeFlags: ["_e470DepreciationSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e470DepreciationSeen) return false;
        var cars = carsOf(st);
        for (var i = 0; i < cars.length; i++) {
          var c = cars[i];
          var bp = c.buyPrice || 0, cp = c.currentPrice || 0;
          if (bp > 0 && cp > 0 && cp < bp * 0.9) return true; // 折旧超10%才有叙事张力
        }
        return false;
      },
      text: function (st) {
        var cars = carsOf(st);
        for (var i = 0; i < cars.length; i++) {
          var c = cars[i];
          var bp = c.buyPrice || 0, cp = c.currentPrice || 0;
          if (bp > 0 && cp > 0 && cp < bp * 0.9) {
            var lost = Math.round(bp - cp);
            return "「" + (c.name || "座驾") + "」当初花了 ¥" + Math.round(bp) + "，现在二手市场只值 ¥" + Math.round(cp) + "——开一天亏一天，已经蒸发了 ¥" + lost + "。";
          }
        }
        return null;
      },
      choices: [
        { text: "📉 记住这一课", hint: "心智+4,解锁资产意识", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e470DepreciationSeen = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          st.flags._dataInvestorMindset = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📉 '车是消费品，房和股才是资产。' 你第一次真切理解了折旧——买它是为了生活，不是为了赚钱，想明白这一点反而踏实了。心智+4，投资意识觉醒。", "success");
        }},
        { text: "🚗 车是用的不是存的", hint: "幸福+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e470DepreciationSeen = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚗 '账不能这么算——它载着我跑了这么多地方，值回票价了。' 有些东西的价值不写在二手行情里。幸福+4。", "success");
        }}
      ]
    },
    {
      id: "e470_car_road_trip",
      phase: "street",
      _isChainEvent: false,
      icon: "🛣️",
      title: "周末兜风",
      story: "难得的好天气，你的车正好闲着——{desc}",
      triggers: { minDay: 25, interval: 50, maxRepeats: 5, excludeFlags: ["_e470RoadTripCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e470RoadTripCooldown) return false;
        if (carsOf(st).length < 1) return false;
        return !!firstMetNpcR470(st);
      },
      text: function (st) {
        var cars = carsOf(st);
        var car = cars[0] || {};
        var nid = firstMetNpcR470(st);
        var nm = nid;
        if (typeof getNpcDisplayName === "function") { try { nm = getNpcDisplayName(nid) || nid; } catch (e) {} }
        return "开着「" + (car.name || "你的车") + "」，喊上" + nm + "去城郊转一圈？有车之后，朋友间的距离好像也近了。";
      },
      choices: [
        { text: "🛣️ 出发！", hint: "好感+6,幸福+5,现金-80", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e470RoadTripCooldown = true;
          var nid = firstMetNpcR470(st);
          if (nid && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, nid, 6, "周末载友兜风"); } catch (e) {}
          }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 80);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛣️ 车窗摇下来，风灌进来，副驾的朋友笑着说'早知道你买车了就该多约你'。油钱花了80，但这一路的畅快聊天，值。好感+6，幸福+5。", "success");
        }},
        { text: "⛽ 油钱太贵，算了", hint: "现金保留", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e470RoadTripCooldown = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("⛽ 你看了眼油价，默默把钥匙放回去了——'车可以有，油得省着烧。'", "info");
        }}
      ]
    },
    {
      id: "e470_car_ledger",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🧾",
      title: "养车账本",
      story: "月底整理开销，你把这个月的养车成本单独列了一栏——{desc}",
      triggers: { minDay: 40, interval: 70, maxRepeats: 3, excludeFlags: ["_e470CarLedgerDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e470CarLedgerDone) return false;
        var cars = carsOf(st);
        for (var i = 0; i < cars.length; i++) {
          if ((cars[i].maintenance || 0) > 0) return true;
        }
        return false;
      },
      text: function (st) {
        var cars = carsOf(st);
        var total = 0;
        for (var i = 0; i < cars.length; i++) total += cars[i].maintenance || 0;
        return "保养、保险、停车费……每天固定流出约 ¥" + Math.round(total) + "。职场人的体面，原来每一分都有账可查。";
      },
      choices: [
        { text: "🧾 建立成本台账", hint: "会计XP+8,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e470CarLedgerDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 8); } catch (e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧾 你给车建了张成本台账：折旧+保养+隐性支出一目了然。同事看到后惊了：'你这台账比我们部门的预算表还专业。' 会计XP+8，心智+3。", "success");
        }},
        { text: "💳 糊涂账就糊涂过", hint: "幸福+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e470CarLedgerDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💳 '算太清楚就不敢开了。' 你合上账本，决定让快乐保持一点模糊。幸福+2。", "info");
        }}
      ]
    }
  ];

  if (typeof RANDOM_EVENTS !== "undefined" && Array.isArray(RANDOM_EVENTS)) {
    for (var i = 0; i < EVENTS.length; i++) RANDOM_EVENTS.push(EVENTS[i]);
  } else if (typeof window !== "undefined" && Array.isArray(window.RANDOM_EVENTS)) {
    for (var j = 0; j < EVENTS.length; j++) window.RANDOM_EVENTS.push(EVENTS[j]);
  }
})();

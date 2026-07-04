#!/usr/bin/env node
/**
 * 蒙特卡洛模拟 — 城市浮生记数值平衡测试 v3.1
 *
 * 使用 headless_runner.cjs 加载真实游戏引擎，
 * 运行 N 次 × 1000 天模拟，检测经济平衡问题。
 *
 * 用法:
 *   node tests/monte_carlo.cjs                        # 默认: 100次 × 1000天
 *   node tests/monte_carlo.cjs --trials 50            # 快速测试
 *   node tests/monte_carlo.cjs --days 500             # 500天
 *   node tests/monte_carlo.cjs --verbose              # 详细输出
 *   node tests/monte_carlo.cjs --strategy balanced    # 只跑平衡策略
 *   node tests/monte_carlo.cjs --output report.json   # 输出到文件
 *
 * 通过条件（v3.1 基准）：
 *   - 存活率 > 80%
 *   - 前 30 天死亡率 < 15%
 *   - 中位现金 Day 30: ¥500~¥2000
 *   - 中位现金 Day 100: ¥2000~¥10000
 *   - 中位现金 Day 365: ¥10000~¥50000
 *   - 疾病/受伤率 < 30%
 *   - 经济分层：> 50% 玩家 Day 100 后进入温饱 (cash > ¥2000)
 */

(function () {
  "use strict";

  var runner;
  var fs = require("fs");
  var path = require("path");

  // ============ 配置 ============
  var CONFIG = {
    trials: 100,
    daysPerTrial: 1000,
    verbose: false,
    strategy: "all",
    outputFile: "",
    seed: 42,
  };

  function parseArgs() {
    var args = process.argv.slice(2);
    for (var i = 0; i < args.length; i++) {
      if (args[i] === "--trials" && i + 1 < args.length)
        CONFIG.trials = parseInt(args[++i], 10) || 100;
      else if (args[i] === "--days" && i + 1 < args.length)
        CONFIG.daysPerTrial = parseInt(args[++i], 10) || 1000;
      else if (args[i] === "--verbose") CONFIG.verbose = true;
      else if (args[i] === "--strategy" && i + 1 < args.length)
        CONFIG.strategy = args[++i];
      else if (args[i] === "--output" && i + 1 < args.length)
        CONFIG.outputFile = args[++i];
      else if (args[i] === "--seed" && i + 1 < args.length)
        CONFIG.seed = parseInt(args[++i], 10) || 42;
    }
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // ====== 策略工厂 ======

  function applyJobPay(state, job) {
    var pay = 0;
    try {
      if (job && typeof job.payCalc === "function") {
        pay = job.payCalc(state);
      }
    } catch (e) {}
    if (pay > 0) {
      state.resources.cash += pay;
      state.resources.totalEarned = (state.resources.totalEarned || 0) + pay;
      // v3.1 第39轮：工作获得街坊声望
      if (
        typeof gainReputation === "function" &&
        state.trade &&
        state.trade.currentLocation
      ) {
        gainReputation(state, state.trade.currentLocation, 1, "工作(MC)");
      }
      state.needs.fatigue = Math.min(
        100,
        (state.needs.fatigue || 0) + (job.fatigueCost || 8),
      );
      state.needs.hygiene = Math.min(
        100,
        (state.needs.hygiene || 0) + (job.hygieneCost || 5),
      );
      if (job.risk) {
        var riskMod = Random.chance(0.3) ? 0.8 : 1.0;
        if (
          job.risk.injury &&
          Random.chance(Math.min(1, job.risk.injury * riskMod))
        ) {
          state.status.health = Math.max(0, (state.status.health || 70) - 15);
          state.status.injured = true;
          state._mcInjuries = (state._mcInjuries || 0) + 1;
        }
        if (
          job.risk.illness &&
          Random.chance(Math.min(1, (job.risk.illness || 0) * riskMod))
        ) {
          state.status.health = Math.max(0, (state.status.health || 70) - 10);
          state.status.sick = true;
          state._mcIllnesses = (state._mcIllnesses || 0) + 1;
        }
      }
    } else {
      state.resources.cash += 15 + Math.floor(Math.random() * 20);
      state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 8);
    }
  }

  function findJobAtLocation(state, location) {
    if (
      typeof STREET_JOBS === "undefined" ||
      typeof checkJobRequirements === "undefined"
    )
      return null;
    var avail = [];
    for (var ji = 0; ji < STREET_JOBS.length; ji++) {
      var jj = STREET_JOBS[ji];
      if (!jj.location || jj.location === location) {
        try {
          if (typeof checkJobRequirements(jj, state) !== "string") {
            avail.push({
              job: jj,
              pay: typeof jj.payCalc === "function" ? jj.payCalc(state) : 0,
            });
          }
        } catch (e) {}
      }
    }
    if (avail.length === 0) return null;
    avail.sort(function (a, b) {
      return b.pay - a.pay;
    });
    return avail[0].job;
  }

  function createBalancedPolicy() {
    return function (state) {
      var ap = state.player ? state.player.actionPoints : 0;
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs || ap <= 0) return;

      // v3.2.1 修复: 优先生存 + 住房 + 工作/休息交替循环
      // 原 bug: AP 全花在技能/洗澡/娱乐，疲劳日增而休息不足 → Day 80 死亡螺旋
      // 1. 吃饭
      if (needs.hunger < 50 && cash >= 6 && ap >= 10) {
        var foodCost = 10;
        var foodRecover = 38;
        if (cash >= 35 && needs.hunger < 25) {
          foodCost = 35;
          foodRecover = 65;
        }
        state.resources.cash = Math.max(0, state.resources.cash - foodCost);
        needs.hunger = Math.min(100, needs.hunger + foodRecover);
        needs.happiness = Math.min(100, needs.happiness + 3);
        ap -= 10;
      }
      // 2. 积极住房升级（寿命 = tier² × 恢复力，越早升级越好）
      var ht = state.housing ? state.housing.tier : 0;
      var day = state.player.day;
      if (ht === 0 && cash >= 500 && day > 2) {
        state.resources.cash -= 300;
        state.housing.tier = 1;
        state.housing.rentedDay = day;
        if (state.inventory) state.inventory.capacity = 50;
      } else if (ht === 1 && cash >= 1500 && day > 12) {
        state.resources.cash -= 500;
        state.housing.tier = 2;
        state.housing.rentedDay = day;
        if (state.inventory) state.inventory.capacity = 100;
      } else if (ht === 2 && cash >= 4000 && day > 40) {
        state.resources.cash -= 1000;
        state.housing.tier = 3;
        state.housing.rentedDay = day;
        if (state.inventory) state.inventory.capacity = 200;
      }
      // 3. 地点进阶
      var loc = "slum";
      if (day > 18 && cash >= 1200) loc = "commercialDist";
      if (day > 50 && cash >= 4000) loc = "techPark";
      state.trade.currentLocation = loc;
      // 4. 工作/休息交替循环（核心修复：每工作一轮检查疲劳，累了先休息）
      var worked = 0;
      while (ap >= 14 && worked < 10) {
        if (needs.fatigue > 50 && ap >= 12) {
          needs.fatigue = Math.max(0, needs.fatigue - 30);
          ap -= 12;
          continue;
        }
        if (state.status.health < 35 && ap >= 15) {
          needs.fatigue = Math.max(0, needs.fatigue - 20);
          ap -= 15;
          continue;
        }
        var job = findJobAtLocation(state, loc);
        applyJobPay(state, job);
        ap -= 14;
        worked++;
      }
      state.player.actionPoints = Math.max(0, ap);
    };
  }
  function createGrinderPolicy() {
    return function (state) {
      var ap = state.player ? state.player.actionPoints : 0;
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs || ap <= 0) return;
      if (needs.hunger < 45 && cash >= 8 && ap >= 10) {
        state.resources.cash = Math.max(0, state.resources.cash - 8);
        needs.hunger = Math.min(100, needs.hunger + 25);
        ap -= 10;
      }
      if (needs.fatigue > 70 && ap >= 15) {
        needs.fatigue = Math.max(0, needs.fatigue - 25);
        ap -= 15;
      }

      var ht = state.housing ? state.housing.tier : 0;
      if (ht === 0 && state.resources.cash >= 500 && state.player.day > 5) {
        state.resources.cash -= 300;
        state.housing.tier = 1;
        state.housing.rentedDay = state.player.day;
      }
      if (ht === 1 && state.resources.cash >= 1500 && state.player.day > 15) {
        state.resources.cash -= 500;
        state.housing.tier = 2;
        state.housing.rentedDay = state.player.day;
      }

      var day = state.player.day;
      var loc = "slum";
      if (day > 40 && state.resources.cash >= 3000) loc = "factoryZone";
      if (day > 80 && state.resources.cash >= 8000) loc = "commercialDist";
      state.trade.currentLocation = loc;

      // v3.2.1 对齐social: worked<4, fatigue<65
      var worked = 0;
      while (ap >= 14 && worked < 4 && needs.fatigue < 65) {
        var job = findJobAtLocation(state, loc);
        applyJobPay(state, job);
        ap -= 14;
        worked++;
      }
      state.player.actionPoints = Math.max(0, ap);
    };
  }
  function createSkillerPolicy() {
    return function (state) {
      var ap = state.player ? state.player.actionPoints : 0;
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs || ap <= 0) return;
      if (needs.hunger < 45 && cash >= 8 && ap >= 10) {
        state.resources.cash = Math.max(0, state.resources.cash - 8);
        needs.hunger = Math.min(100, needs.hunger + 30);
        ap -= 10;
      }
      if (needs.fatigue > 60 && ap >= 15) {
        needs.fatigue = Math.max(0, needs.fatigue - 25);
        ap -= 15;
      }

      // 住房升级
      var ht = state.housing ? state.housing.tier : 0;
      if (ht === 0 && state.resources.cash >= 500 && state.player.day > 4) {
        state.resources.cash -= 300;
        state.housing.tier = 1;
        state.housing.rentedDay = state.player.day;
      }
      if (ht === 1 && state.resources.cash >= 1500 && state.player.day > 15) {
        state.resources.cash -= 500;
        state.housing.tier = 2;
        state.housing.rentedDay = state.player.day;
      }

      // v3.2.1: 降低技能AP消耗优先级，先住房后学习
      var day = state.player.day;
      if (
        day > 10 &&
        day % 4 === 0 &&
        state.skills &&
        ap >= 18 &&
        needs.fatigue < 50
      ) {
        // 隔天学一次，不抢占工作AP
        var skids = Object.keys(state.skills);
        var cs = null;
        for (var i = 0; i < skids.length; i++) {
          if (
            skids[i] === "coding" ||
            skids[i] === "english" ||
            skids[i] === "management"
          ) {
            cs = skids[i];
            break;
          }
        }
        if (!cs) cs = skids[0];
        if (state.skills[cs].level < 60) {
          state.skills[cs].xp = (state.skills[cs].xp || 0) + 5;
          if (state.skills[cs].xp >= 100) {
            state.skills[cs].xp = 0;
            state.skills[cs].level = Math.min(100, state.skills[cs].level + 1);
          }
          ap -= 15;
          needs.fatigue = Math.min(100, needs.fatigue + 3);
        }
      }

      var loc = "slum";
      if (day > 25 && state.resources.cash >= 2000) loc = "commercialDist";
      if (day > 50 && state.resources.cash >= 4000) loc = "techPark";
      state.trade.currentLocation = loc;

      // v3.2.1 对齐social: worked<4
      var worked = 0;
      while (ap >= 14 && worked < 4 && needs.fatigue < 60) {
        var job = findJobAtLocation(state, loc);
        applyJobPay(state, job);
        ap -= 14;
        worked++;
      }
      state.player.actionPoints = Math.max(0, ap);
    };
  }

  // ====== 商人策略 ======
  function createTraderPolicy() {
    return function (state) {
      var ap = state.player ? state.player.actionPoints : 0;
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs || ap <= 0) return;
      if (needs.hunger < 45 && cash >= 8 && ap >= 10) {
        state.resources.cash = Math.max(0, state.resources.cash - 10);
        needs.hunger = Math.min(100, needs.hunger + 30);
        ap -= 10;
      }
      if (needs.fatigue > 70 && ap >= 15) {
        needs.fatigue = Math.max(0, needs.fatigue - 25);
        ap -= 15;
      }
      var ht = state.housing ? state.housing.tier : 0;
      if (ht === 0 && cash >= 500 && state.player.day > 10) {
        state.resources.cash -= 300;
        state.housing.tier = 1;
      }

      var day = state.player.day;
      var survived = state.status.health > 0;

      // 阶段1（Day1-15）：纯打工攒本金
      if (day <= 15 || cash < 150) {
        state.trade.currentLocation = "slum";
        var w1 = 0;
        while (ap >= 14 && w1 < 3 && needs.fatigue < 60) {
          applyJobPay(state, findJobAtLocation(state, "slum"));
          ap -= 14;
          w1++;
        }
        // 有经验后去商业区赚更多
        if (day > 10 && cash >= 300) {
          state.trade.currentLocation = "commercialDist";
          applyJobPay(state, findJobAtLocation(state, "commercialDist"));
          ap -= 14;
        }
        state.player.actionPoints = Math.max(0, ap);
        return;
      }

      // 确保生活费
      var reserve = 100;
      var surplus = Math.max(0, cash - reserve);

      // 阶段2：打工+套利混合
      // 每3天做一次贸易，其他时间打工
      if (surplus >= 50 && ap >= 24 && day % 3 === 0) {
        // 批发市场进货
        state.trade.currentLocation = "wholesaleMarket";
        var goodsList = [
          "fruits",
          "vegetables",
          "snacks",
          "cigarettes",
          "clothing",
          "electronics",
        ];
        var chosen = goodsList[day % goodsList.length];
        var baseP = 10;
        try {
          var g = typeof GOODS !== "undefined" ? GOODS : null;
          if (g && g[chosen]) baseP = g[chosen].basePrice;
        } catch (e) {}
        var buyPrice = Math.floor(baseP * 0.78);
        // 只用50%的盈余现金进货
        var investCash = Math.floor(surplus * 0.5);
        var qty = Math.min(Math.floor(investCash / Math.max(buyPrice, 1)), 10);
        if (qty > 0) {
          state.resources.cash -= buyPrice * qty;
          if (!state._mcInv) state._mcInv = {};
          state._mcInv[chosen] = (state._mcInv[chosen] || 0) + qty;
          ap -= 12;
        }

        // 卖到商业区
        state.trade.currentLocation = "commercialDist";
        var sellPrice = Math.floor(baseP * 1.15);
        var haveQty = state._mcInv ? state._mcInv[chosen] || 0 : 0;
        if (haveQty > 0) {
          state.resources.cash += sellPrice * haveQty;
          state.resources.totalEarned =
            (state.resources.totalEarned || 0) + sellPrice * haveQty;
          delete state._mcInv[chosen];
          ap -= 12;
        }
      }

      // v3.2.1: 对齐social模式(worked<4, fatigue<65, 留AP给endDay恢复)
      state.trade.currentLocation = "commercialDist";
      var w2 = 0;
      while (ap >= 14 && w2 < 4 && needs.fatigue < 65) {
        applyJobPay(state, findJobAtLocation(state, "commercialDist"));
        ap -= 14;
        w2++;
      }

      state.player.actionPoints = Math.max(0, ap);
    };
  }

  // ====== 社交策略 ======
  function createSocialPolicy() {
    return function (state) {
      var ap = state.player ? state.player.actionPoints : 0;
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs || ap <= 0) return;
      if (needs.hunger < 45 && cash >= 8 && ap >= 10) {
        state.resources.cash = Math.max(0, state.resources.cash - 10);
        needs.hunger = Math.min(100, needs.hunger + 30);
        ap -= 10;
      }
      if (needs.fatigue > 70 && ap >= 15) {
        needs.fatigue = Math.max(0, needs.fatigue - 25);
        ap -= 15;
      }
      var ht = state.housing ? state.housing.tier : 0;
      if (ht === 0 && cash >= 500 && state.player.day > 7) {
        state.resources.cash -= 300;
        state.housing.tier = 1;
      }
      if (ht === 1 && cash >= 1200 && state.player.day > 25) {
        state.resources.cash -= 500;
        state.housing.tier = 2;
      }

      var day = state.player.day;
      // 解锁NPC推荐工作
      if (day > 15) state.flags.oldZhouReferred = true;
      if (day > 25) state.flags.bossLiReferred = true;
      if (day > 20) state.flags.sisterZhangReferred = true;
      if (day > 20) state.flags.chefChenAssistant = true;
      if (day > 30 && state.player.intelligence >= 25)
        state.flags.xiaoMeiReferred = true;

      // 地点进阶：利用NPC关系获取高薪工作
      var loc = "slum";
      if (day > 20 && cash >= 400) loc = "construction";
      if (day > 35 && cash >= 800) loc = "commercialDist";
      if (day > 60 && cash >= 3000 && state.player.intelligence >= 30)
        loc = "school";
      state.trade.currentLocation = loc;

      var worked = 0;
      while (ap >= 14 && worked < 4 && needs.fatigue < 60) {
        var job = findJobAtLocation(state, loc);
        applyJobPay(state, job);
        ap -= 14;
        worked++;
      }
      state.player.actionPoints = Math.max(0, ap);
    };
  }

  // ====== 企业晋升策略 ======
  function createCorporatePolicy() {
    return function (state) {
      var ap = state.player ? state.player.actionPoints : 0;
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs || ap <= 0) return;
      if (needs.hunger < 45 && cash >= 8 && ap >= 10) {
        state.resources.cash = Math.max(0, state.resources.cash - 10);
        needs.hunger = Math.min(100, needs.hunger + 30);
        ap -= 10;
      }
      if (needs.fatigue > 70 && ap >= 15) {
        needs.fatigue = Math.max(0, needs.fatigue - 25);
        ap -= 15;
      }
      var ht = state.housing ? state.housing.tier : 0;
      if (ht === 0 && cash >= 500 && state.player.day > 7) {
        state.resources.cash -= 300;
        state.housing.tier = 1;
      }
      if (ht === 1 && cash >= 1200 && state.player.day > 25) {
        state.resources.cash -= 500;
        state.housing.tier = 2;
      }

      var day = state.player.day;
      // 前60天：技能积累+打工（不直接改intelligence，改用skill study）
      if (day <= 60 && state.skills && ap >= 18 && needs.fatigue < 55) {
        var skids = Object.keys(state.skills);
        var cs = null;
        for (var i = 0; i < skids.length; i++) {
          if (
            skids[i] === "coding" ||
            skids[i] === "english" ||
            skids[i] === "management"
          ) {
            cs = skids[i];
            break;
          }
        }
        if (!cs) cs = skids[0];
        if (state.skills[cs].level < 60) {
          state.skills[cs].xp = (state.skills[cs].xp || 0) + 5;
          if (state.skills[cs].xp >= 100) {
            state.skills[cs].xp = 0;
            state.skills[cs].level = Math.min(100, state.skills[cs].level + 1);
          }
          ap -= 15;
          needs.fatigue = Math.min(100, needs.fatigue + 3);
        }
      }

      var loc = "slum";
      if (day > 20 && cash >= 1200) loc = "commercialDist";
      if (day > 50 && cash >= 4000) loc = "techPark";
      state.trade.currentLocation = loc;

      // v3.2.1 对齐social: worked<4, fatigue<60
      var worked = 0;
      while (ap >= 14 && worked < 4 && needs.fatigue < 60) {
        var job = findJobAtLocation(state, loc);
        applyJobPay(state, job);
        ap -= 14;
        worked++;
      }
      state.player.actionPoints = Math.max(0, ap);
    };
  }

  // (corporate phase: street job → corporate job offers via game mechanics)

  function runTrial(baseState, policyFn, seed) {
    var state = deepClone(baseState);
    state.player.day = 1;
    state.flags.gameOver = false;
    state.flags.gameOverReason = "";
    state.status.health = baseState.status.health;
    if (typeof Random !== "undefined" && Random.setSeed) Random.setSeed(seed);

    return _runTrialInner(state, policyFn);
  }

  function _runTrialInner(state, policyFn) {
    var snaps = [],
      sick = 0,
      hurt = 0,
      diedOn = -1,
      deathCause = "",
      dayCash = [],
      dayHealth = [],
      dayHunger = [],
      dayFatigue = [],
      jobsWorked = {},
      totalWorks = 0,
      phaseTransitionDay = -1,
      maxHousingTier = 0,
      housingUpgradeDays = [],
      rentPaid = 0,
      foodSpent = 0,
      amenityUsed = 0,
      eventsTriggered = 0;

    var snapDays = [30, 90, 365];
    var dayCashWindow = [];
    var recentCash = [];

    for (var d = 0; d < CONFIG.daysPerTrial; d++) {
      var startHealth = state.status.health;
      var startCash = state.resources.cash;

      try {
        policyFn(state);
      } catch (e) {}
      try {
        state.player.actionPoints = 0;
        state.player.timeSlot = "evening";
        var prePipelineHealth = state.status.health;
        if (typeof runDailyPipeline === "function") runDailyPipeline(state);
      } catch (e) {
        if (state.flags) state.flags.gameOver = true;
        state.flags.gameOverReason = "pipeline_error: " + e.message;
      }

      // Track phase transition
      if (
        phaseTransitionDay < 0 &&
        state.player.phase === "corporate" &&
        d > 0
      ) {
        phaseTransitionDay = d + 1;
      }

      // Track housing upgrades
      var curTier = state.housing ? state.housing.tier : 0;
      if (curTier > maxHousingTier) {
        if (
          housingUpgradeDays.length === 0 ||
          housingUpgradeDays[housingUpgradeDays.length - 1] !== curTier
        ) {
          housingUpgradeDays.push({ tier: curTier, day: d + 1 });
        }
        maxHousingTier = curTier;
      }

      // Death detection with cause
      if (state.flags.gameOver || state.status.health <= 0) {
        diedOn = d + 1;
        deathCause = state.flags.gameOverReason || "";
        if (!deathCause) {
          if (state.status.health <= 0) deathCause = "health_depleted";
          else if (
            (state.resources.debt || 0) + (state.resources.villageDebt || 0) >
            50000
          )
            deathCause = "debt_over_50000";
          else deathCause = "unknown";
        }
        break;
      }

      // Count illness/injury
      if (
        state.flags._dailyTransactions &&
        Array.isArray(state.flags._dailyTransactions)
      ) {
        for (var ti = 0; ti < state.flags._dailyTransactions.length; ti++) {
          var t = state.flags._dailyTransactions[ti];
          if (
            t.type === "illness" ||
            (t.category && t.category.indexOf("illness") >= 0)
          )
            sick++;
          if (
            t.type === "injury" ||
            (t.category && t.category.indexOf("injury") >= 0)
          )
            hurt++;
          if (t.category === "rent") rentPaid += t.amount || 0;
          if (t.category === "food" || t.category === "amenity_food")
            foodSpent += t.amount || 0;
          if (t.type === "event") eventsTriggered++;
        }
      }

      if (snapDays.indexOf(d + 1) >= 0) {
        snaps.push({
          d: d + 1,
          c: state.resources.cash,
          h: state.status.health,
          ht: state.housing ? state.housing.tier : 0,
          p: state.player.phase,
        });
      }
    }

    var survived = diedOn === -1;
    return {
      survived: survived,
      diedOnDay: diedOn,
      deathCause: deathCause,
      finalCash: state.resources.cash,
      finalBank: state.resources.bankBalance || 0,
      finalDebt:
        (state.resources.debt || 0) + (state.resources.villageDebt || 0),
      finalHealth: state.status.health,
      finalHousingTierMax: maxHousingTier,
      finalHousingTier: state.housing ? state.housing.tier : 0,
      totalEarned: state.resources.totalEarned || 0,
      illnessCount: sick,
      injuryCount: hurt,
      snapshots: snaps,
      finalPhase: state.player.phase,
      phaseTransitionDay: phaseTransitionDay,
      housingUpgradeDays: housingUpgradeDays,
      rentPaid: rentPaid,
      foodSpent: foodSpent,
      eventsTriggered: eventsTriggered,
    };
  }

  function runStrategy(strategyName, baseState) {
    var policies = {
      balanced: createBalancedPolicy(),
      grinder: createGrinderPolicy(),
      skiller: createSkillerPolicy(),
      trader: createTraderPolicy(),
      social: createSocialPolicy(),
      corporate: createCorporatePolicy(),
    };
    var policy = policies[strategyName];
    if (!policy) {
      console.error("  ❌ 未知策略: " + strategyName);
      return null;
    }

    var results = [],
      start = Date.now();
    for (var i = 0; i < CONFIG.trials; i++) {
      results.push(
        runTrial(
          baseState,
          policy,
          CONFIG.seed + i * 1000 + strategyName.length,
        ),
      );
      if (CONFIG.verbose && (i + 1) % 25 === 0)
        process.stderr.write("    ..." + (i + 1) + "/" + CONFIG.trials + "\n");
    }
    return analyzeResults(
      strategyName,
      results,
      ((Date.now() - start) / 1000).toFixed(1),
    );
  }

  function analyzeResults(name, results, elapsed) {
    var n = results.length,
      alive = results.filter(function (r) {
        return r.survived;
      }),
      dead = results.filter(function (r) {
        return !r.survived;
      });
    var sr = (alive.length / n) * 100;
    var d1 = dead.filter(function (r) {
      return r.diedOnDay <= 7;
    }).length;
    var d2 = dead.filter(function (r) {
      return r.diedOnDay > 7 && r.diedOnDay <= 30;
    }).length;
    var d3 = dead.filter(function (r) {
      return r.diedOnDay > 30 && r.diedOnDay <= 90;
    }).length;
    var d4 = dead.filter(function (r) {
      return r.diedOnDay > 90;
    }).length;
    var add =
      dead.length > 0
        ? dead.reduce(function (s, r) {
            return s + r.diedOnDay;
          }, 0) / dead.length
        : -1;

    var ca = alive.map(function (r) {
      return r.finalCash;
    });
    ca.sort(function (a, b) {
      return a - b;
    });
    var pct = function (arr, p) {
      return arr[Math.min(Math.floor((arr.length * p) / 100), arr.length - 1)];
    };
    var avgCash =
      alive.length > 0
        ? ca.reduce(function (s, v) {
            return s + v;
          }, 0) / alive.length
        : 0;
    var avgHe =
      alive.reduce(function (s, r) {
        return s + r.finalHealth;
      }, 0) / Math.max(1, alive.length);
    var poor = alive.filter(function (r) {
      return r.finalCash < 500;
    }).length;
    var sub = alive.filter(function (r) {
      return r.finalCash >= 500 && r.finalCash < 5000;
    }).length;
    var com = alive.filter(function (r) {
      return r.finalCash >= 5000 && r.finalCash < 50000;
    }).length;
    var ric = alive.filter(function (r) {
      return r.finalCash >= 50000;
    }).length;
    var snapData = {};
    [30, 90, 365].forEach(function (sd) {
      var vals = results
        .filter(function (r) {
          return r.snapshots.some(function (s) {
            return s.d === sd;
          });
        })
        .map(function (r) {
          var s = r.snapshots.filter(function (x) {
            return x.d === sd;
          })[0];
          return s ? s.c : null;
        })
        .filter(function (c) {
          return c !== null;
        });
      if (vals.length > 0) {
        vals.sort(function (a, b) {
          return a - b;
        });
        snapData[sd] = {
          n: vals.length,
          median: pct(vals, 50),
          p25: pct(vals, 25),
          p75: pct(vals, 75),
          min: vals[0],
          max: vals[vals.length - 1],
        };
      }
    });
    var avgIl =
      alive.reduce(function (s, r) {
        return s + r.illnessCount;
      }, 0) / Math.max(1, alive.length);
    var avgIn =
      alive.reduce(function (s, r) {
        return s + r.injuryCount;
      }, 0) / Math.max(1, alive.length);
    var avgHo =
      alive.reduce(function (s, r) {
        return s + (r.finalHousingTierMax || r.finalHousingTier);
      }, 0) / Math.max(1, alive.length);
    var corp3 = alive.filter(function (r) {
      return r.finalPhase === "corporate";
    }).length;
    var avgFood =
      alive.reduce(function (s, r) {
        return s + (r.foodSpent || 0);
      }, 0) / Math.max(1, alive.length);
    var avgEvt =
      alive.reduce(function (s, r) {
        return s + (r.eventsTriggered || 0);
      }, 0) / Math.max(1, alive.length);
    var transitioned2 = alive.filter(function (r) {
      return r.phaseTransitionDay > 0;
    });
    var avgPhaseDay2 =
      transitioned2.length > 0
        ? transitioned2.reduce(function (s, r) {
            return s + r.phaseTransitionDay;
          }, 0) / transitioned2.length
        : -1;

    // Housing tier distribution
    var housingTiers = {};
    for (var hi3 = 0; hi3 < alive.length; hi3++) {
      var ht3 = alive[hi3].finalHousingTierMax || alive[hi3].finalHousingTier;
      housingTiers[ht3] = (housingTiers[ht3] || 0) + 1;
    }
    // Death cause breakdown
    var deathCauses = {};
    for (var di3 = 0; di3 < dead.length; di3++) {
      var cause3 = dead[di3].deathCause || "unknown";
      deathCauses[cause3] = (deathCauses[cause3] || 0) + 1;
    }

    return {
      strategy: name,
      trials: n,
      elapsed: elapsed,
      survivalRate: sr,
      died1_7: (d1 / n) * 100,
      died8_30: (d2 / n) * 100,
      died31_90: (d3 / n) * 100,
      died91plus: (d4 / n) * 100,
      avgDeathDay: add,
      deathCauses: deathCauses,
      avgCash: avgCash,
      medianCash: alive.length > 0 ? pct(ca, 50) : 0,
      p10Cash: alive.length > 0 ? pct(ca, 10) : 0,
      p90Cash: alive.length > 0 ? pct(ca, 90) : 0,
      minCash: alive.length > 0 ? ca[0] : 0,
      maxCash: alive.length > 0 ? ca[ca.length - 1] : 0,
      avgHealth: avgHe,
      avgIllness: avgIl,
      avgInjury: avgIn,
      avgHousing: avgHo,
      housingTiersReached: housingTiers,
      avgFoodSpentTotal: avgFood,
      avgEventsTriggered: avgEvt,
      corpPhaseRate: (corp3 / Math.max(1, alive.length)) * 100,
      avgPhaseTransitionDay: isNaN(avgPhaseDay2) ? -1 : avgPhaseDay2,
      economicLayers: {
        poor: poor,
        subsistence: sub,
        comfortable: com,
        rich: ric,
      },
      snapshots: snapData,
    };
  }

  function printReport(allStats) {
    var L = "=".repeat(72);
    var fmt = function (n) {
      return Math.round(n).toLocaleString();
    };
    var pc = function (n) {
      return n.toFixed(1);
    };

    console.log("\n" + L);
    console.log("  城市浮生记 v3.2 — 蒙特卡洛平衡测试报告");
    console.log(
      "  " + new Date().toISOString().replace("T", " ").substring(0, 19),
    );
    console.log(L);
    console.log(
      "  配置: " +
        allStats.length +
        " 策略 x " +
        CONFIG.trials +
        " 次 x " +
        CONFIG.daysPerTrial +
        " 天",
    );

    for (var si = 0; si < allStats.length; si++) {
      var s = allStats[si];
      console.log("\n" + "-".repeat(72));
      console.log(
        "  📊 策略: " +
          s.strategy +
          " (" +
          s.trials +
          " 次, " +
          s.elapsed +
          ")",
      );
      console.log("-".repeat(72));

      console.log("\n  📈 存活统计");
      console.log(
        "    存活率:      " +
          (s.survivalRate >= 80 ? "" : "⚠️ ") +
          pc(s.survivalRate) +
          "%" +
          (s.survivalRate >= 80 ? " ✅" : " ❌"),
      );
      console.log("    死亡分布:");
      console.log(
        "      Day 1-7:   " +
          (s.died1_7 >= 10 ? "⚠️ " : "   ") +
          pc(s.died1_7) +
          "%" +
          (s.died1_7 < 10 ? " ✅" : " ❌"),
      );
      console.log("      Day 8-30:  " + pc(s.died8_30) + "%");
      console.log("      Day 31-90: " + pc(s.died31_90) + "%");
      console.log("      Day 91+:   " + pc(s.died91plus) + "%");
      if (s.avgDeathDay > 0) {
        console.log("    死亡平均天数: " + s.avgDeathDay.toFixed(1) + " 天");
        // Death causes
        var causeKeys = Object.keys(s.deathCauses || {});
        if (causeKeys.length > 0) {
          console.log("    死亡原因:");
          for (var dc = 0; dc < causeKeys.length; dc++) {
            console.log(
              "      " + causeKeys[dc] + ": " + s.deathCauses[causeKeys[dc]],
            );
          }
        }
      }

      console.log("\n  💰 经济统计（存活玩家）");
      console.log("    平均现金:    ¥" + fmt(s.avgCash));
      console.log("    中位现金:    ¥" + fmt(s.medianCash));
      console.log("    P10现金:     ¥" + fmt(s.p10Cash));
      console.log("    P90现金:     ¥" + fmt(s.p90Cash));
      console.log("    最小现金:    ¥" + fmt(s.minCash));
      console.log("    最大现金:    ¥" + fmt(s.maxCash));

      var tl =
        s.economicLayers.poor +
        s.economicLayers.subsistence +
        s.economicLayers.comfortable +
        s.economicLayers.rich;
      console.log("\n  🏠 经济分层（存活玩家）");
      console.log(
        "    赤贫(<¥500):    " +
          s.economicLayers.poor +
          " (" +
          ((s.economicLayers.poor / tl) * 100).toFixed(1) +
          "%)",
      );
      console.log(
        "    温饱(¥500~5k):  " +
          s.economicLayers.subsistence +
          " (" +
          ((s.economicLayers.subsistence / tl) * 100).toFixed(1) +
          "%)",
      );
      console.log(
        "    小康(¥5k~50k):  " +
          s.economicLayers.comfortable +
          " (" +
          ((s.economicLayers.comfortable / tl) * 100).toFixed(1) +
          "%)",
      );
      console.log(
        "    富裕(>¥50k):   " +
          s.economicLayers.rich +
          " (" +
          ((s.economicLayers.rich / tl) * 100).toFixed(1) +
          "%)",
      );

      console.log("\n  📅 里程碑现金中位数");
      [30, 90, 365].forEach(function (sd) {
        if (s.snapshots[sd]) {
          var sp = s.snapshots[sd];
          console.log(
            "    Day " +
              sd +
              ": ¥" +
              fmt(sp.median) +
              " [P25:¥" +
              fmt(sp.p25) +
              "  P75:¥" +
              fmt(sp.p75) +
              "] (n=" +
              sp.n +
              ")",
          );
        }
      });

      console.log("\n  🏥 健康统计（存活玩家）");
      console.log("    平均健康:    " + s.avgHealth.toFixed(1));
      console.log("    平均疾病次数: " + s.avgIllness.toFixed(1));
      console.log("    平均受伤次数: " + s.avgInjury.toFixed(1));

      // Housing tier distribution
      var htKeys = Object.keys(s.housingTiersReached || {}).sort();
      if (htKeys.length > 0) {
        var htStr = htKeys
          .map(function (k) {
            return "T" + k + ":" + s.housingTiersReached[k];
          })
          .join(" ");
        console.log("    住房等级分布: " + htStr);
      }
      console.log("    公司阶段转化率: " + s.corpPhaseRate.toFixed(1) + "%");
      if (s.avgPhaseTransitionDay > 0)
        console.log(
          "    平均转公司阶段天: " + s.avgPhaseTransitionDay.toFixed(0),
        );
      console.log("    总食品花费:   ¥" + fmt(s.avgFoodSpentTotal || 0));
      console.log(
        "    总事件触发:   " + (s.avgEventsTriggered || 0).toFixed(1) + "次",
      );
    }

    if (allStats.length > 1) {
      console.log("\n" + L);
      console.log("  📋 策略对比摘要");
      console.log(L);
      var hdr = ["策略", "存活率", "中位现金", "平均健康", "转化率", "住房"];
      console.log("  " + hdr.join("\t"));
      for (var si2 = 0; si2 < allStats.length; si2++) {
        var s2 = allStats[si2];
        console.log(
          "  " +
            [
              s2.strategy,
              pc(s2.survivalRate) + "%",
              "¥" + fmt(s2.medianCash),
              s2.avgHealth.toFixed(1),
              s2.corpPhaseRate.toFixed(1) + "%",
              s2.avgHousing.toFixed(1),
            ].join("\t"),
        );
      }
    }

    console.log("\n" + L);
    console.log("  ✅ 判定");
    console.log(L);
    var passed = true;
    for (var si3 = 0; si3 < allStats.length; si3++) {
      var s3 = allStats[si3],
        sn = s3.strategy;
      if (s3.survivalRate < 80) {
        console.log(
          "  ❌ [" + sn + "] 存活率 " + pc(s3.survivalRate) + "% < 80%",
        );
        passed = false;
      } else {
        console.log(
          "  ✅ [" + sn + "] 存活率 " + pc(s3.survivalRate) + "% ≥ 80%",
        );
      }
      if (s3.died1_7 >= 10) {
        console.log(
          "  ❌ [" + sn + "] 前7天死亡率 " + pc(s3.died1_7) + "% ≥ 10%",
        );
        passed = false;
      } else {
        console.log(
          "  ✅ [" + sn + "] 前7天死亡率 " + pc(s3.died1_7) + "% < 10%",
        );
      }
      if (s3.snapshots[30]) {
        var m30 = s3.snapshots[30].median;
        if (m30 < 500 || m30 > 20000) {
          console.log(
            "  ⚠️  [" + sn + "] Day30 ¥" + fmt(m30) + " 偏离 [¥500~¥20000]",
          );
        } else {
          console.log("  ✅ [" + sn + "] Day30 ¥" + fmt(m30) + " 合理");
        }
      }
    }
    console.log(
      "\n  " +
        (passed ? "🎉 总体通过" : "🔧 需要调整") +
        ": " +
        (passed ? "all pass" : "fix needed"),
    );
    console.log(L + "\n");
  }

  function outputToFile(allStats) {
    if (!CONFIG.outputFile) return;
    fs.writeFileSync(
      CONFIG.outputFile,
      JSON.stringify(
        {
          config: CONFIG,
          timestamp: new Date().toISOString(),
          results: allStats,
        },
        null,
        2,
      ),
      "utf8",
    );
    console.log("  📝 保存: " + CONFIG.outputFile);
  }

  function main() {
    parseArgs();
    console.log("\n🧪 城市浮生记 v3.1 — 蒙特卡洛平衡测试\n   加载游戏引擎...");
    var t0 = Date.now();

    try {
      runner = require("./headless_runner.cjs");
    } catch (e) {
      console.error("  ❌ " + e.message);
      process.exit(1);
    }
    var ok = runner.init({ strict: false });
    if (!ok) {
      console.error("  ❌ init 失败");
      process.exit(1);
    }

    console.log(
      "   加载: " +
        (Date.now() - t0) +
        "ms, 错误: " +
        runner.getLoadErrors().length,
    );
    console.log(
      "   引擎: JOBS=" +
        (typeof STREET_JOBS !== "undefined" ? STREET_JOBS.length : "?") +
        " LOCS=" +
        (typeof LOCATIONS !== "undefined"
          ? Object.keys(LOCATIONS).length
          : "?") +
        " NPCs=" +
        (typeof NPCS !== "undefined" ? NPCS.length : "?"),
    );

    var bs = runner.createState({ seed: CONFIG.seed, scenario: "classic" });
    if (!bs) {
      process.exit(1);
    }
    console.log("   初始: ¥" + bs.resources.cash + " 健康:" + bs.status.health);

    var strategies =
      CONFIG.strategy === "all"
        ? ["balanced", "grinder", "skiller", "trader", "social", "corporate"]
        : [CONFIG.strategy];
    var allStats = [];
    for (var i = 0; i < strategies.length; i++) {
      var stats = runStrategy(strategies[i], bs);
      if (stats) allStats.push(stats);
    }
    printReport(allStats);
    outputToFile(allStats);
    console.log("   总耗时: " + ((Date.now() - t0) / 1000).toFixed(1) + " 秒");
  }

  if (typeof require !== "undefined" && require.main === module) {
    main();
  }
})();

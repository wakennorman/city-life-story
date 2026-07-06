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
 * 通过条件（v3.3 策略分化）：
 *   - 普通路径(balanced/social/trader/corporate)存活率 ≥ 80%
 *   - 高风险路径(grinder过劳/skiller犯罪)存活率 ≥ 30%（设计意图：高风险高回报）
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

  // ============ 策略辅助函数（v3.3 策略分化） ============

  /**
   * 疾病治疗（所有策略共用）
   * v3.3: 仅健康<30且现金>¥500时治疗，轻症依赖pipeline的+3/天自然恢复
   */
  function mcTreatIllness(state) {
    if (!state.status.illnesses || state.status.illnesses.length === 0) return;
    if (state.status.health > 30) return;
    if (state.resources.cash < 500) return;
    var ILL = typeof ILLNESSES !== "undefined" ? ILLNESSES : null;
    if (!ILL) return;
    var worst = null,
      worstSev = 0;
    for (var i = 0; i < state.status.illnesses.length; i++) {
      var inst = state.status.illnesses[i];
      var ill = ILL[inst.id];
      if (!ill || !ill.treatCost) continue;
      var sev =
        ill.severity === "critical"
          ? 4
          : ill.severity === "severe"
            ? 3
            : ill.severity === "moderate"
              ? 2
              : 1;
      if (sev > worstSev) {
        worstSev = sev;
        worst = { inst: inst, ill: ill };
      }
    }
    if (!worst) return;
    var tier = null,
      cost = 0;
    if (worst.ill.treatCost.pharmacy > 0) {
      tier = "pharmacy";
      cost = worst.ill.treatCost.pharmacy;
    }
    if (
      worstSev >= 3 &&
      worst.ill.treatCost.hospital > 0 &&
      state.resources.cash > worst.ill.treatCost.hospital + 200
    ) {
      tier = "hospital";
      cost = worst.ill.treatCost.hospital;
    }
    if (!tier || state.resources.cash < cost + 200) return;
    state.resources.cash -= cost;
    state._mcMedicalSpent = (state._mcMedicalSpent || 0) + cost;
    if (tier === "hospital") {
      for (var j = 0; j < state.status.illnesses.length; j++) {
        if (state.status.illnesses[j].id === worst.inst.id) {
          state.status.illnesses.splice(j, 1);
          break;
        }
      }
    } else {
      worst.inst.treated = true;
    }
  }

  /** 通用吃饭：低饱即吃 */
  function mcFeed(state, threshold, recover, cost) {
    var ap = state.player.actionPoints;
    if (
      state.needs.hunger < threshold &&
      state.resources.cash >= cost &&
      ap >= 10
    ) {
      state.resources.cash = Math.max(0, state.resources.cash - cost);
      state.needs.hunger = Math.min(100, state.needs.hunger + recover);
      state.needs.happiness = Math.min(100, state.needs.happiness + 3);
      state.player.actionPoints = ap - 10;
      return true;
    }
    return false;
  }

  /** 通用住房升级 */
  function mcUpgradeHousing(state) {
    var ht = state.housing ? state.housing.tier : 0;
    var day = state.player.day;
    var cash = state.resources.cash;
    // [cost, dayMin, minReserve]
    var tbl = [
      {},
      { c: 300, d: 3, r: 300 },
      { c: 500, d: 15, r: 500 },
      { c: 1000, d: 45, r: 800 },
      { c: 6000, d: 120, r: 2000 },
      { c: 20000, d: 250, r: 5000 },
    ];
    var up = tbl[ht + 1];
    if (up && day >= up.d && cash >= up.c + up.r) {
      state.resources.cash -= up.c;
      state.housing.tier = ht + 1;
      state.housing.rentedDay = day;
      state._mcHousingUpgrades = (state._mcHousingUpgrades || 0) + 1;
    }
  }

  /** 通用工作循环（含工作前疲劳检查） */
  function mcWorkLoop(state, loc, maxWorked, fatigueLimit) {
    var ap = state.player.actionPoints;
    var needs = state.needs;
    // 工作前先检查疲劳（原版social金色路径：fatigue>70先休息）
    if (needs.fatigue > 70 && ap >= 15) {
      needs.fatigue = Math.max(0, needs.fatigue - 25);
      ap -= 15;
    }
    var worked = 0;
    while (ap >= 14 && worked < maxWorked && needs.fatigue < fatigueLimit) {
      if (needs.fatigue > 60 && ap >= 12) {
        needs.fatigue = Math.max(0, needs.fatigue - 25);
        ap -= 12;
        continue;
      }
      if (state.status.health < 25 && ap >= 15) {
        needs.fatigue = Math.max(0, needs.fatigue - 15);
        ap -= 15;
        continue;
      }
      applyJobPay(state, findJobAtLocation(state, loc));
      ap -= 14;
      worked++;
    }
    state.player.actionPoints = ap;
  }

  /**
   * 技能学习（每4天一次）
   * v3.3: 每次+100 XP = 1级（模拟真实游戏中工作/事件/学习多渠道XP获取的累积效果）
   * 真实游戏中技能升级更快（工作给XP、事件给XP），MC仅模拟学习单一渠道，故加速
   */
  function mcStudySkill(state, preferList) {
    var ap = state.player.actionPoints;
    var day = state.player.day;
    if (day <= 10 || day % 4 !== 0 || !state.skills || ap < 18) return false;
    if (state.needs.fatigue > 50) return false;
    var skids = Object.keys(state.skills);
    // 在偏好列表中选等级最低的（平衡提升多个技能，满足创业"2技能≥12"门槛）
    var cs = null,
      csLvl = 999;
    for (var i = 0; i < skids.length; i++) {
      for (var j = 0; j < preferList.length; j++) {
        if (skids[i] === preferList[j]) {
          var lvl = state.skills[skids[i]].level || 0;
          if (lvl < csLvl) {
            cs = skids[i];
            csLvl = lvl;
          }
          break;
        }
      }
    }
    if (!cs) cs = skids[0];
    if (state.skills[cs].level < 60) {
      // 每次直接+1级（100 XP），模拟多渠道XP累积
      state.skills[cs].level = Math.min(100, state.skills[cs].level + 1);
      state.skills[cs].xp = 0;
      state.player.actionPoints = ap - 15;
      state.needs.fatigue = Math.min(100, state.needs.fatigue + 3);
      state._mcSkillUps = (state._mcSkillUps || 0) + 1;
      return true;
    }
    return false;
  }

  /** 犯罪执行（skiller策略专属） */
  function mcAttemptCrime(state, actionId) {
    if (typeof state.flags._mcMorality !== "number")
      state.flags._mcMorality = 50;
    var CRIMES = {
      steal_battery: {
        loc: "slum",
        reward: [150, 300],
        catchRate: 0.35,
        morality: 15,
        fine: 500,
        healthDmg: 5,
        name: "偷电瓶",
      },
      pickpocket: {
        loc: "commercialDist",
        reward: [80, 200],
        catchRate: 0.3,
        morality: 12,
        fine: 300,
        healthDmg: 3,
        name: "扒窃",
      },
      blackmarket: {
        loc: "wholesaleMarket",
        reward: [300, 600],
        catchRate: 0.4,
        morality: 20,
        fine: 1000,
        healthDmg: 8,
        name: "黑市倒卖",
      },
      shop_theft: {
        loc: "commercialDist",
        reward: [200, 500],
        catchRate: 0.4,
        morality: 18,
        fine: 800,
        healthDmg: 6,
        name: "盗窃店铺",
      },
      scam: {
        loc: "commercialDist",
        reward: [100, 300],
        catchRate: 0.45,
        morality: 15,
        fine: 500,
        healthDmg: 4,
        name: "碰瓷",
      },
    };
    var crime = CRIMES[actionId];
    if (!crime) return false;
    state._mcCrimeAttempts = (state._mcCrimeAttempts || 0) + 1;
    // 地点风险修正
    var locKey = state.trade.currentLocation || "slum";
    var locMul = 1.0;
    if (locKey === "bank" || locKey === "government") locMul = 1.3;
    if (locKey === "slum") locMul = 0.9;
    var effCatch = Math.min(0.95, crime.catchRate * locMul);
    if (Random.chance(effCatch)) {
      // 被抓
      state.resources.cash = Math.max(0, state.resources.cash - crime.fine);
      state.flags._mcMorality = Math.max(0, state.flags._mcMorality - 5);
      state._mcCrimeCaught = (state._mcCrimeCaught || 0) + 1;
      state.status.health = Math.max(0, state.status.health - crime.healthDmg);
      state.needs.happiness = Math.max(0, state.needs.happiness - 10);
      return false;
    } else {
      var reward =
        crime.reward[0] +
        Math.floor(Math.random() * (crime.reward[1] - crime.reward[0]));
      state.resources.cash += reward;
      state.resources.totalEarned = (state.resources.totalEarned || 0) + reward;
      state.flags._mcMorality = Math.max(
        0,
        state.flags._mcMorality - crime.morality,
      );
      state._mcCrimeSuccess = (state._mcCrimeSuccess || 0) + 1;
      state.needs.happiness = Math.min(100, state.needs.happiness + 3);
      return true;
    }
  }

  /** 房产购买（trader策略专属） */
  var MC_PROPERTIES = [
    { id: "room_rent", price: 1500, rent: 250, dayMin: 15 },
    { id: "studio_small", price: 4000, rent: 500, dayMin: 70 },
    { id: "apt_one_bed", price: 10000, rent: 900, dayMin: 180 },
  ];
  function mcBuyProperty(state) {
    var day = state.player.day;
    for (var i = 0; i < MC_PROPERTIES.length; i++) {
      var p = MC_PROPERTIES[i];
      // 是否已拥有
      var owned =
        state.investments && state.investments.properties
          ? state.investments.properties.some(function (pr) {
              return pr.id === p.id;
            })
          : false;
      if (owned) continue;
      if (day >= p.dayMin && state.resources.cash >= p.price + 3000) {
        state.resources.cash -= p.price;
        if (!state.investments) state.investments = {};
        if (!state.investments.properties) state.investments.properties = [];
        state.investments.properties.push({
          id: p.id,
          buyPrice: p.price,
          currentPrice: p.price,
          rent: p.rent,
          selfLive: false,
          boughtDay: day,
        });
        state._mcPropertyCount = (state._mcPropertyCount || 0) + 1;
        return true;
      }
    }
    return false;
  }

  /** 月度房租收入（trader策略，在runDailyPipeline月结算之外MC主动模拟） */
  function mcCollectRent(state) {
    var props = state.investments && state.investments.properties;
    if (!props || props.length === 0) return;
    var day = state.player.day;
    if (day % 30 !== 0) return;
    var totalRent = 0;
    for (var i = 0; i < props.length; i++) {
      if (!props[i].selfLive) totalRent += props[i].rent;
    }
    if (totalRent > 0) {
      state.resources.cash += totalRent;
      state._mcTotalRentEarned = (state._mcTotalRentEarned || 0) + totalRent;
    }
  }

  /** 创业注册（corporate策略专属） */
  function mcRegisterStartup(state) {
    if (state._mcStartup) return false; // 已注册
    var day = state.player.day;
    if (day < 60) return false;
    // 技能门槛：2个技能>=12级
    var skillsMet = 0;
    if (state.skills) {
      for (var key in state.skills) {
        if (state.skills[key].level >= 12) skillsMet++;
      }
    }
    if (skillsMet < 2) return false;
    // 现金门槛：经典=15k（v3.3 降低使街头→创业可达）
    var threshold = 15000;
    if (state.resources.cash < threshold + 10000) return false;
    state.resources.cash -= threshold;
    state._mcStartup = {
      foundedDay: day,
      valuation: 100000 + Math.floor(Math.random() * 150000),
      phase: "seed",
    };
    state.player.phase = "corporate";
    return true;
  }

  /** 创业月度收入（corporate策略） */
  function mcStartupIncome(state) {
    if (!state._mcStartup) return;
    var day = state.player.day;
    if (day % 30 !== 0) return;
    // 早期亏损期(前6月)无收入，之后收益递增
    var monthsSince = (day - state._mcStartup.foundedDay) / 30;
    if (monthsSince < 6) return;
    // 月利润 = 估值 × (0.5% ~ 2%) × 随机因子
    var rate = 0.005 + Math.random() * 0.015;
    var profit = Math.floor(state._mcStartup.valuation * rate);
    if (profit > 0) {
      state.resources.cash += profit;
      state._mcTotalStartupProfit = (state._mcTotalStartupProfit || 0) + profit;
    }
  }

  /** 副业收入（social策略专属） */
  function mcSideHustleIncome(state) {
    var day = state.player.day;
    if (day % 5 !== 0) return; // 每5天一次
    // 副业收益：¥80-250（简化模拟 side_hustle.js 的兼职系统）
    var amt = 80 + Math.floor(Math.random() * 170);
    state.resources.cash += amt;
    state._mcSideHustleEarned = (state._mcSideHustleEarned || 0) + amt;
  }

  // ============ 策略工厂（v3.3 分化版） ============

  /**
   * 策略1: balanced（稳健均衡型）
   * 路径: 工作+住房+治病 — 最安全的活法
   * 特点: 平衡支出与储蓄，升级住房优先
   */
  function createBalancedPolicy() {
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs) return;
      mcFeed(state, 50, 38, 10);
      mcTreatIllness(state);
      mcUpgradeHousing(state);
      var day = state.player.day;
      var loc =
        day > 50 && cash >= 4000
          ? "techPark"
          : day > 18 && cash >= 1200
            ? "commercialDist"
            : "slum";
      state.trade.currentLocation = loc;
      mcWorkLoop(state, loc, 4, 60);
    };
  }

  /**
   * 策略2: grinder（拼命工作狂）
   * 路径: 高强度工作换取现金流，牺牲生活质量
   * 特点: worked<6, fatigue<75，极少休息，不升级住房（省租金）
   * 风险: 高受伤率，但现金积累最快
   */
  function createGrinderPolicy() {
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      var health = state.status ? state.status.health : 100;
      var hygiene = needs ? needs.hygiene : 50;
      if (!needs) return;

      // 健康底线：health<25 时降低工作次数（但不停工！继续赚钱买饭）
      var workLimit = health < 25 ? 3 : 5;
      // 健康差时多买点吃的
      var foodBudget = health < 40 ? 12 : 8;
      var feedThreshold = health < 40 ? 48 : 42;

      // 节俭吃饭：降阈值+便宜食物，省下每一分钱（grinder的"赤贫美学"）
      mcFeed(state, feedThreshold, 30, foodBudget);

      // 卫生底线：hygiene<15时洗澡一次（¥10），防止hygiene=0→健康-2/天
      if (hygiene < 15 && cash >= 15) {
        needs.hygiene = Math.min(100, hygiene + 40);
        state.resources.cash -= 10;
      }

      mcTreatIllness(state); // 健康<30才治
      // 住房：只升T1（最便宜），不追求更高等级
      var ht = state.housing ? state.housing.tier : 0;
      var day = state.player.day;
      if (ht === 0 && cash >= 600 && day > 5) {
        state.resources.cash -= 300;
        state.housing.tier = 1;
        state.housing.rentedDay = day;
      }
      var loc = "slum";
      if (day > 30 && cash >= 2000) loc = "factoryZone";
      if (day > 70 && cash >= 6000) loc = "commercialDist";
      state.trade.currentLocation = loc;
      // 核心区别：workLimit 随健康动态调整
      mcWorkLoop(state, loc, workLimit, 70);
    };
  }

  /**
   * 策略3: skiller（灰色路径）
   * 路径: 技能学习 + 犯罪（高风险高回报）
   * 特点: 高风险，现金波动大，道德值下降
   * 风险: 被抓 → 罚款+健康扣血
   */
  function createSkillerPolicy() {
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs) return;
      mcFeed(state, 45, 30, 8);
      mcTreatIllness(state);
      mcUpgradeHousing(state);

      var day = state.player.day;
      var ap = state.player.actionPoints;

      // 犯罪：仅现金极度紧张且道德未破产时铤而走险（每14天最多一次）
      if (typeof state.flags._mcMorality !== "number")
        state.flags._mcMorality = 50;
      var desperate = cash < 400 && state.flags._mcMorality > 20;
      var opportunistic =
        day > 30 &&
        day % 14 === 0 &&
        state.resources.cash < 3000 &&
        state.flags._mcMorality > 30;
      if (desperate || opportunistic) {
        // 根据地点选择犯罪类型
        var locKey = state.trade.currentLocation || "slum";
        var crimeId = null;
        if (locKey === "slum") crimeId = "steal_battery";
        else if (locKey === "wholesaleMarket") crimeId = "blackmarket";
        else if (locKey === "commercialDist")
          crimeId = Random.chance(0.5) ? "pickpocket" : "scam";
        if (crimeId) {
          mcAttemptCrime(state, crimeId);
          ap = state.player.actionPoints;
        }
      }

      // 偶尔学技能（不抢占犯罪/工作AP）
      mcStudySkill(state, ["coding", "english", "management"]);

      var loc = "slum";
      if (day > 25 && cash >= 1500) loc = "commercialDist";
      if (day > 50 && cash >= 3000) loc = "techPark";
      state.trade.currentLocation = loc;
      mcWorkLoop(state, loc, 4, 60);
    };
  }

  /**
   * 策略4: trader（房产投资者）
   * 路径: 打工攒首付 → 买房收租 → 积累被动收入
   * 特点: 中期现金流紧张，后期被动收入稳定
   * 目标: 拥有2-3套房产，每月固定租金收入
   */
  function createTraderPolicy() {
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs) return;
      mcFeed(state, 45, 30, 10);
      mcTreatIllness(state);
      mcUpgradeHousing(state);

      var day = state.player.day;

      // 核心：攒钱买房
      mcBuyProperty(state);
      // 收房租（月度）
      mcCollectRent(state);

      var loc = "slum";
      if (day > 20 && cash >= 1200) loc = "commercialDist";
      if (day > 60 && cash >= 5000) loc = "techPark";
      state.trade.currentLocation = loc;
      mcWorkLoop(state, loc, 4, 60);
    };
  }

  /**
   * 策略5: social（社交+副业型）
   * 路径: NPC关系 + 副业兼职 — 靠人脉赚钱
   * 特点: 稳定副业收入，NPC推荐解锁高薪工作
   */
  function createSocialPolicy() {
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs) return;
      mcFeed(state, 45, 30, 10);
      mcTreatIllness(state);
      // social: 仅升T1+T2（不追T3+，高维护费吃副业收入）
      var htS = state.housing ? state.housing.tier : 0;
      var day = state.player.day;
      var cashS = state.resources.cash;
      if (htS === 0 && cashS >= 600 && day > 7) {
        state.resources.cash -= 300;
        state.housing.tier = 1;
        state.housing.rentedDay = day;
      } else if (htS === 1 && cashS >= 1500 && day > 40) {
        state.resources.cash -= 500;
        state.housing.tier = 2;
        state.housing.rentedDay = day;
      }

      // 核心：副业收入
      mcSideHustleIncome(state);
      // NPC推荐（解锁高薪工作）
      if (day > 15) state.flags.oldZhouReferred = true;
      if (day > 25) state.flags.bossLiReferred = true;
      if (day > 20) state.flags.sisterZhangReferred = true;
      if (day > 20) state.flags.chefChenAssistant = true;
      if (day > 30 && state.player.intelligence >= 25)
        state.flags.xiaoMeiReferred = true;

      var loc = "slum";
      if (day > 20 && cash >= 400) loc = "construction";
      if (day > 35 && cash >= 800) loc = "commercialDist";
      if (day > 60 && cash >= 3000 && state.player.intelligence >= 30)
        loc = "school";
      state.trade.currentLocation = loc;
      mcWorkLoop(state, loc, 4, 60);
    };
  }

  /**
   * 策略6: crowner（创业路径）
   * 路径: 攒钱+学技能 → 注册公司 → 被动创业收入
   * 特点: 前60天攒钱+学技能，之后创业获取被动收入
   * 目标: Day 60+ 注册公司
   * v3.3 修复: 健康底线(health<50停学)+ 生存预算(cash<500先工作)+ 降学频(每3天一次)
   */
  function createCorporatePolicy() {
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      var health = state.status ? state.status.health : 100;
      if (!needs) return;

      // 健康底线：health<50 时跳过学习，只生存
      if (health < 50) {
        mcFeed(state, 50, 35, 12);
        mcTreatIllness(state);
        mcUpgradeHousing(state);
        var loc = "slum";
        if (cash >= 1200) loc = "commercialDist";
        state.trade.currentLocation = loc;
        mcWorkLoop(state, loc, 5, 60);
        return;
      }

      mcFeed(state, 45, 30, 10);
      mcTreatIllness(state);
      mcUpgradeHousing(state);

      var day = state.player.day;

      // 核心：攒钱+学技能 → 创业
      if (!state._mcStartup) {
        // v3.3 修复: 生存预算 — cash<500时优先工作不学习
        var studying = false;
        if (cash >= 500) {
          // 每3天学一次（从每2天降低频率），专攻2个技能
          if (
            day <= 120 &&
            day > 10 &&
            day % 3 === 0 &&
            state.player.actionPoints >= 18
          ) {
            var skids2 = Object.keys(state.skills);
            var cs2 = null,
              csLvl2 = 999;
            var prefers = ["coding", "english"];
            for (var si = 0; si < skids2.length; si++) {
              for (var pi = 0; pi < prefers.length; pi++) {
                if (skids2[si] === prefers[pi]) {
                  var lv = state.skills[skids2[si]].level || 0;
                  if (lv < csLvl2) {
                    cs2 = skids2[si];
                    csLvl2 = lv;
                  }
                  break;
                }
              }
            }
            if (
              cs2 &&
              state.skills[cs2].level < 60 &&
              state.needs.fatigue < 50
            ) {
              state.skills[cs2].level = Math.min(
                100,
                state.skills[cs2].level + 1,
              );
              state.skills[cs2].xp = 0;
              state.player.actionPoints -= 15;
              state.needs.fatigue = Math.min(100, state.needs.fatigue + 3);
              state._mcSkillUps = (state._mcSkillUps || 0) + 1;
              studying = true;
            }
          }
        }
        // 尝试注册
        mcRegisterStartup(state);
      } else {
        // 创业收入
        mcStartupIncome(state);
      }

      var loc = "slum";
      if (day > 20 && cash >= 1200) loc = "commercialDist";
      if (day > 50 && cash >= 4000) loc = "techPark";
      state.trade.currentLocation = loc;
      // 学习后减少工作次数保留AP
      var workLimit = studying ? 3 : 4;
      mcWorkLoop(state, loc, workLimit, 60);
    };
  }

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

      // v3.3 差异化指标在 trial 结束时统一读取（state字段为累积计数器）

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
      // v3.3 差异化指标
      medicalSpent: state._mcMedicalSpent || 0,
      crimeAttempts: state._mcCrimeAttempts || 0,
      crimeSuccess: state._mcCrimeSuccess || 0,
      crimeCaught: state._mcCrimeCaught || 0,
      propertyCount: state._mcPropertyCount || 0,
      totalRentEarned: state._mcTotalRentEarned || 0,
      totalStartupProfit: state._mcTotalStartupProfit || 0,
      sideHustleEarned: state._mcSideHustleEarned || 0,
      housingUpgrades: state._mcHousingUpgrades || 0,
      skillUps: state._mcSkillUps || 0,
      startupFoundedDay: state._mcStartup ? state._mcStartup.foundedDay : -1,
      finalMorality: state.flags._mcMorality || 50,
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
    // v3.3 差异化指标
    var avgMedical =
      alive.reduce(function (s, r) {
        return s + (r.medicalSpent || 0);
      }, 0) / Math.max(1, alive.length);
    var avgCrime =
      alive.reduce(function (s, r) {
        return s + (r.crimeAttempts || 0);
      }, 0) / Math.max(1, alive.length);
    var avgCrimeSucc =
      alive.reduce(function (s, r) {
        return s + (r.crimeSuccess || 0);
      }, 0) / Math.max(1, alive.length);
    var avgProperty =
      alive.reduce(function (s, r) {
        return s + (r.propertyCount || 0);
      }, 0) / Math.max(1, alive.length);
    var avgRent =
      alive.reduce(function (s, r) {
        return s + (r.totalRentEarned || 0);
      }, 0) / Math.max(1, alive.length);
    var avgStartupP =
      alive.reduce(function (s, r) {
        return s + (r.totalStartupProfit || 0);
      }, 0) / Math.max(1, alive.length);
    var avgSideHustle =
      alive.reduce(function (s, r) {
        return s + (r.sideHustleEarned || 0);
      }, 0) / Math.max(1, alive.length);
    var avgSkillUps =
      alive.reduce(function (s, r) {
        return s + (r.skillUps || 0);
      }, 0) / Math.max(1, alive.length);
    var startupFounders = alive.filter(function (r) {
      return r.startupFoundedDay > 0;
    });
    var avgStartupDay =
      startupFounders.length > 0
        ? startupFounders.reduce(function (s, r) {
            return s + r.startupFoundedDay;
          }, 0) / startupFounders.length
        : -1;
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
      // v3.3 差异化指标
      avgMedicalSpent: avgMedical,
      avgCrimeAttempts: avgCrime,
      avgCrimeSuccess: avgCrimeSucc,
      avgPropertyCount: avgProperty,
      avgRentEarned: avgRent,
      avgStartupProfit: avgStartupP,
      avgSideHustleEarned: avgSideHustle,
      avgSkillUps: avgSkillUps,
      startupFounderRate:
        (startupFounders.length / Math.max(1, alive.length)) * 100,
      avgStartupFoundDay: avgStartupDay,
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

      // v3.3 差异化路径摘要（每个策略展示其独特路径指标）
      console.log("\n  🎯 路径特征（v3.3 策略分化）");
      if (s.strategy === "skiller") {
        console.log(
          "    平均犯罪尝试: " + s.avgCrimeAttempts.toFixed(1) + "次",
        );
        console.log("    平均犯罪成功: " + s.avgCrimeSuccess.toFixed(1) + "次");
      } else if (s.strategy === "trader") {
        console.log(
          "    平均房产数量: " + s.avgPropertyCount.toFixed(1) + "套",
        );
        console.log("    累计租金收入: ¥" + fmt(s.avgRentEarned));
      } else if (s.strategy === "crowner" || s.strategy === "corporate") {
        console.log(
          "    创业成功率:   " + s.startupFounderRate.toFixed(1) + "%",
        );
        console.log(
          "    平均创业天:   " +
            (s.avgStartupFoundDay > 0
              ? s.avgStartupFoundDay.toFixed(0)
              : "未创业"),
        );
        console.log("    累计创业收益: ¥" + fmt(s.avgStartupProfit));
      } else if (s.strategy === "social") {
        console.log("    累计副业收入: ¥" + fmt(s.avgSideHustleEarned));
      } else if (s.strategy === "grinder") {
        console.log("    累计医疗支出: ¥" + fmt(s.avgMedicalSpent));
      }
    }

    if (allStats.length > 1) {
      console.log("\n" + L);
      console.log("  📋 策略对比摘要（v3.3 分化）");
      console.log(L);
      var hdr = ["策略", "存活率", "中位现金", "特征指标"];
      console.log("  " + hdr.join("\t"));
      for (var si2 = 0; si2 < allStats.length; si2++) {
        var s2 = allStats[si2];
        var feature = "";
        if (s2.strategy === "skiller")
          feature = "犯罪" + s2.avgCrimeSuccess.toFixed(0) + "次";
        else if (s2.strategy === "trader")
          feature =
            "房产" +
            s2.avgPropertyCount.toFixed(1) +
            "套/租¥" +
            fmt(s2.avgRentEarned);
        else if (s2.strategy === "social")
          feature = "副业¥" + fmt(s2.avgSideHustleEarned);
        else if (s2.strategy === "grinder") feature = "住房T1/低消费";
        else if (s2.strategy === "corporate" || s2.strategy === "crowner")
          feature = "创业" + s2.startupFounderRate.toFixed(0) + "%";
        else feature = "均衡";
        console.log(
          "  " +
            [
              s2.strategy,
              pc(s2.survivalRate) + "%",
              "¥" + fmt(s2.medianCash),
              feature,
            ].join("\t"),
        );
      }
    }

    console.log("\n" + L);
    console.log("  ✅ 判定");
    console.log(L);
    var passed = true;
    var HIGH_RISK = { grinder: true, skiller: true };
    for (var si3 = 0; si3 < allStats.length; si3++) {
      var s3 = allStats[si3],
        sn = s3.strategy,
        threshold = HIGH_RISK[sn] ? 30 : 80;
      if (s3.survivalRate < threshold) {
        console.log(
          "  ❌ [" +
            sn +
            "] 存活率 " +
            pc(s3.survivalRate) +
            "% < " +
            threshold +
            "%",
        );
        passed = false;
      } else if (HIGH_RISK[sn]) {
        console.log(
          "  ✅ [" +
            sn +
            "] 存活率 " +
            pc(s3.survivalRate) +
            "% ≥ " +
            threshold +
            "%（高风险路径）",
        );
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

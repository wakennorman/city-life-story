/**
 * 副业系统深化（v3.6 P0-3）
 *
 * 6种副业：代购/家教/网约车/外卖/自媒体/投资理财
 * - 代购：18:00后+15%售价（与trade.js联动）
 * - 网约车/外卖：需要agility≥50
 * - 家教：需要intelligence≥30
 * - 自媒体：持续投入+粉丝积累
 * - 投资理财：资金门槛
 * - 副业疲劳度系统：过度副业影响主业
 */

(function () {
  // ====== 副业定义 ======
  const SIDE_HUSTLES = {
    // 代购
    daigou: {
      id: "daigou",
      name: "代购",
      icon: "🛍️",
      desc: "帮人代购商品，赚取差价",
      minAttr: { agility: 30 },
      baseIncome: 80,
      incomeVar: [50, 150],
      fatigueCost: 15,
      timeSlot: ["afternoon", "evening"],
      specialBonus: { time: "evening", mod: 1.15 }, // 18:00后+15%
      levelUp: { level: 1, xp: 0 },
    },
    // 家教
    tutoring: {
      id: "tutoring",
      name: "家教",
      icon: "📚",
      desc: "给学生补课，时薪可观",
      minAttr: { intelligence: 30 },
      baseIncome: 60,
      incomeVar: [40, 100],
      fatigueCost: 10,
      timeSlot: ["afternoon", "evening"],
      specialBonus: null,
      levelUp: { level: 1, xp: 0 },
    },
    // 网约车
    rideHailing: {
      id: "ride_hailing",
      name: "网约车",
      icon: "🚗",
      desc: "开网约车接单，自由灵活",
      minAttr: { agility: 50 },
      baseIncome: 120,
      incomeVar: [80, 200],
      fatigueCost: 25,
      timeSlot: ["morning", "afternoon", "evening"],
      specialBonus: null,
      levelUp: { level: 1, xp: 0 },
    },
    // 外卖
    foodDelivery: {
      id: "food_delivery",
      name: "外卖配送",
      icon: "🛵",
      desc: "送外卖，多劳多得",
      minAttr: { agility: 50 },
      baseIncome: 100,
      incomeVar: [60, 180],
      fatigueCost: 30,
      timeSlot: ["morning", "afternoon", "evening"],
      specialBonus: null,
      levelUp: { level: 1, xp: 0 },
    },
    // 自媒体
    selfMedia: {
      id: "self_media",
      name: "自媒体",
      icon: "📱",
      desc: "做短视频/写文章，积累粉丝",
      minAttr: { intelligence: 40, charm: 30 },
      baseIncome: 50,
      incomeVar: [20, 300], // 波动大
      fatigueCost: 20,
      timeSlot: ["evening", "night"],
      specialBonus: { followers: 100, mod: 1.5 }, // 粉丝≥100时+50%
      levelUp: { level: 1, xp: 0, followers: 0 },
    },
    // 投资理财
    investment: {
      id: "investment_side",
      name: "投资理财",
      icon: "📈",
      desc: "用闲钱投资，获得被动收入",
      minAttr: { intelligence: 50 },
      minCash: 500, // 资金门槛
      baseIncome: 30,
      incomeVar: [10, 200],
      fatigueCost: 5,
      timeSlot: ["morning", "afternoon"],
      specialBonus: null,
      levelUp: { level: 1, xp: 0 },
    },
  };

  // ====== 副业疲劳度配置 ======
  const FATIGUE_CONFIG = {
    maxSideHustleFatigue: 100,
    penaltyThreshold: 60, // 疲劳度超过60开始惩罚
    penaltyRate: 0.1, // 每超过1点，收入-1%
    recoveryRate: 10, // 每天自然恢复
  };

  /**
   * 检查是否满足副业条件
   * @param {string} hustleId - 副业ID
   * @param {Object} state - 游戏状态
   * @returns {Object} 检查结果
   */
  function checkHustleConditions(hustleId, state) {
    const hustle = SIDE_HUSTLES[hustleId];
    if (!hustle) return { ok: false, reason: "未知副业" };

    // 属性检查
    if (hustle.minAttr) {
      for (let attr in hustle.minAttr) {
        if ((state.player[attr] || 0) < hustle.minAttr[attr]) {
          return {
            ok: false,
            reason: `${attr}不足（需要${hustle.minAttr[attr]}）`,
          };
        }
      }
    }

    // 现金检查
    if (hustle.minCash && (state.resources.cash || 0) < hustle.minCash) {
      return {
        ok: false,
        reason: `资金不足（需要¥${hustle.minCash}）`,
      };
    }

    // 时间槽检查
    const currentSlot = state.player.timeSlot;
    if (!hustle.timeSlot.includes(currentSlot)) {
      return {
        ok: false,
        reason: `当前时间段不可进行（可在${hustle.timeSlot.join("、")}进行）`,
      };
    }

    return { ok: true };
  }

  /**
   * 执行副业
   * @param {string} hustleId - 副业ID
   * @param {Object} state - 游戏状态
   * @returns {Object} 执行结果
   */
  function performHustle(hustleId, state) {
    const hustle = SIDE_HUSTLES[hustleId];
    if (!hustle) return { success: false, error: "未知副业" };

    // 检查条件
    const check = checkHustleConditions(hustleId, state);
    if (!check.ok) {
      return { success: false, error: check.reason };
    }

    // 检查疲劳度
    const fatigue = state._sideHustleFatigue || 0;
    if (fatigue >= FATIGUE_CONFIG.maxSideHustleFatigue) {
      return {
        success: false,
        error: "副业疲劳度过高，需要休息",
      };
    }

    // 计算收入
    let income = hustle.baseIncome;
    if (hustle.incomeVar) {
      income += Random.int(hustle.incomeVar[0], hustle.incomeVar[1]);
    }

    // P1-4：主业在职→副业冲突惩罚（利用晚上/周末时间，精力打折）
    const hasMainJob = state.career && state.career.currentJob && !(state.flags && state.flags._retired);
    if (hasMainJob) {
      const careerCap = typeof ensureCareerCapital === "function" ? ensureCareerCapital(state) : null;
      const curBurnout = careerCap ? (careerCap.burnout || 0) : 0;
      // 主业占用主要精力，副业效率基础-20%；高倦怠时再-15%
      let conflictMult = curBurnout >= 60 ? 0.65 : 0.80;
      income = Math.round(income * conflictMult);
      // 副业也加剧职业倦怠（偷用工作时间/精力）
      if (careerCap && typeof clampCareerCapital === "function") {
        careerCap.burnout = Math.min(100, (careerCap.burnout || 0) + 3);
        clampCareerCapital(careerCap);
      }
    }

    // 特殊加成
    if (hustle.specialBonus) {
      if (hustle.specialBonus.time === state.player.timeSlot) {
        income *= hustle.specialBonus.mod;
      }
      if (hustle.specialBonus.followers) {
        const followers =
          (state._sideHustleData &&
            state._sideHustleData.selfMedia &&
            state._sideHustleData.selfMedia.followers) ||
          0;
        if (followers >= hustle.specialBonus.followers) {
          income *= hustle.specialBonus.mod;
        }
      }
    }

    income = Math.round(income);

    // 应用收入
    state.resources.cash += income;
    state.resources.totalEarned = (state.resources.totalEarned || 0) + income;

    // 增加疲劳度
    const newFatigue = Math.min(
      FATIGUE_CONFIG.maxSideHustleFatigue,
      fatigue + hustle.fatigueCost,
    );
    state._sideHustleFatigue = newFatigue;

    // 更新自媒体粉丝（如果是自媒体）
    if (hustleId === "self_media") {
      if (!state._sideHustleData) state._sideHustleData = {};
      if (!state._sideHustleData.selfMedia)
        state._sideHustleData.selfMedia = { followers: 0 };
      state._sideHustleData.selfMedia.followers = Math.min(
        10000,
        (state._sideHustleData.selfMedia.followers || 0) + Random.int(1, 5),
      );
    }

    // 疲劳度惩罚检查
    let penalty = 0;
    if (newFatigue > FATIGUE_CONFIG.penaltyThreshold) {
      penalty =
        (newFatigue - FATIGUE_CONFIG.penaltyThreshold) *
        FATIGUE_CONFIG.penaltyRate;
    }

    return {
      success: true,
      income,
      fatigueCost: hustle.fatigueCost,
      newFatigue,
      penalty,
      message: `完成${hustle.name}，收入¥${income}${penalty > 0 ? `（疲劳惩罚-${Math.round(penalty * 100)}%）` : ""}`,
    };
  }

  /**
   * 副业每日 tick
   * @param {Object} state - 游戏状态
   */
  function sideHustleTick(state) {
    if (!state.player) return;

    // 疲劳度自然恢复
    if (state._sideHustleFatigue !== undefined) {
      state._sideHustleFatigue = Math.max(
        0,
        state._sideHustleFatigue - FATIGUE_CONFIG.recoveryRate,
      );
    }
  }

  /**
   * 获取副业疲劳度状态
   * @param {Object} state - 游戏状态
   * @returns {Object} 疲劳度状态
   */
  function getFatigueStatus(state) {
    const fatigue = state._sideHustleFatigue || 0;
    let status = "normal";
    if (fatigue > 80) status = "exhausted";
    else if (fatigue > FATIGUE_CONFIG.penaltyThreshold) status = "warning";

    return {
      fatigue,
      max: FATIGUE_CONFIG.maxSideHustleFatigue,
      status,
      penalty: Math.max(
        0,
        (fatigue - FATIGUE_CONFIG.penaltyThreshold) *
          FATIGUE_CONFIG.penaltyRate,
      ),
    };
  }

  /**
   * 初始化副业系统
   * @param {Object} state - 游戏状态
   */
  function initSideHustle(state) {
    state._sideHustleFatigue = 0;
    state._sideHustleData = {
      selfMedia: { followers: 0 },
    };
  }

  // ====== 导出 ======
  if (typeof window !== "undefined") {
    window.SIDE_HUSTLES = SIDE_HUSTLES;
    window.sideHustleTick = sideHustleTick; // 供 daily_pipeline.js 直接调用
    window.sideHustle = {
      init: initSideHustle,
      tick: sideHustleTick,
      check: checkHustleConditions,
      perform: performHustle,
      getFatigue: getFatigueStatus,
      getList: () => SIDE_HUSTLES,
    };
  }
})();

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
  // 设计原则：低技能时副业收入约为同类临时工1.1~1.3x（门槛溢价），
  // 技能成长后可达1.8~2.5x（激励长期经营），不应初期就碾压所有临时工。
  const SIDE_HUSTLES = {
    // 代购：agility门槛较低，收入适中，体现"需要跑腿"
    daigou: {
      id: "daigou",
      name: "代购",
      icon: "🛍️",
      desc: "帮人代购商品，赚取差价，需要熟悉各大商圈",
      minAttr: { agility: 35 },
      baseIncome: 50, // 降：80→50，初始¥50+20~80=70~130（原130~230）
      incomeVar: [20, 80],
      fatigueCost: 18, // 疲劳略升
      timeSlot: ["afternoon", "evening"],
      specialBonus: { time: "evening", mod: 1.2 }, // 晚上熟客+20%
      levelUp: { level: 1, xp: 0 },
    },
    // 家教：智力门槛，疲劳低，但初始收入不能比自学室训练强太多
    tutoring: {
      id: "tutoring",
      name: "家教",
      icon: "📚",
      desc: "给中小学生补课，需要一定知识储备",
      minAttr: { intelligence: 35 }, // 提高：30→35
      baseIncome: 55, // 降：60→55
      incomeVar: [25, 75], // 缩窄：[40,100]→[25,75]
      fatigueCost: 12,
      timeSlot: ["afternoon", "evening"],
      specialBonus: null,
      levelUp: { level: 1, xp: 0 },
    },
    // 网约车：高agility门槛，疲劳高，收入有竞争力但不离谱
    rideHailing: {
      id: "ride_hailing",
      name: "网约车",
      icon: "🚗",
      desc: "开网约车接单，需要驾照和高敏捷（体能要好）",
      minAttr: { agility: 60 }, // 提高：50→60（需驾驶技能或高agility）
      minSkill: { driving: 5 }, // 新增：需要驾驶技能≥5
      baseIncome: 90, // 降：120→90
      incomeVar: [40, 120], // 缩窄：[80,200]→[40,120]
      fatigueCost: 28,
      timeSlot: ["morning", "afternoon", "evening"],
      specialBonus: null,
      levelUp: { level: 1, xp: 0 },
    },
    // 外卖：中等agility门槛，收入对应体力消耗
    foodDelivery: {
      id: "food_delivery",
      name: "外卖配送",
      icon: "🛵",
      desc: "送外卖，多劳多得，但非常消耗体力",
      minAttr: { agility: 55 }, // 提高：50→55
      baseIncome: 70, // 降：100→70
      incomeVar: [30, 100], // 缩窄：[60,180]→[30,100]
      fatigueCost: 35, // 疲劳升：30→35（高强度体力活）
      timeSlot: ["morning", "afternoon", "evening"],
      specialBonus: null,
      levelUp: { level: 1, xp: 0 },
    },
    // 自媒体：高波动，初始极低但粉丝积累后暴增（正确体现"0→1破壁"）
    selfMedia: {
      id: "self_media",
      name: "自媒体",
      icon: "📱",
      desc: "做短视频/写文章，初期几乎没收入，靠粉丝积累起飞",
      minAttr: { intelligence: 40, charm: 30 },
      baseIncome: 10, // 降：50→10（初期冷启动）
      incomeVar: [0, 100], // 缩窄：[20,300]→[0,100]（高波动保留）
      fatigueCost: 20,
      timeSlot: ["evening", "night"],
      specialBonus: { followers: 200, mod: 3.0 }, // 粉丝≥200才有3x爆发（原100粉×1.5太早）
      levelUp: { level: 1, xp: 0, followers: 0 },
    },
    // 投资理财：几乎零疲劳，但初始收入极低，高智力高本金才有回报
    investment: {
      id: "investment_side",
      name: "投资理财",
      icon: "📈",
      desc: "用闲钱投资，高风险高回报，需要财商积累",
      minAttr: { intelligence: 50 },
      minCash: 1000, // 提高资金门槛：500→1000
      baseIncome: 10, // 降：30→10
      incomeVar: [0, 150], // 缩窄：[10,200]→[0,150]（保留高波动）
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
      var attrLabelMap = {
        agility: "敏捷",
        intelligence: "智力",
        charm: "魅力",
        physique: "体质",
        mental: "能力",
      };
      for (let attr in hustle.minAttr) {
        if ((state.player[attr] || 0) < hustle.minAttr[attr]) {
          return {
            ok: false,
            reason: `${attrLabelMap[attr] || attr}不足（需要${hustle.minAttr[attr]}）`,
          };
        }
      }
    }

    // 技能检查（新增 minSkill 字段支持）
    if (hustle.minSkill) {
      var skillLabelMap = {
        driving: "驾驶",
        coding: "编程",
        cooking: "厨艺",
        sales: "销售",
      };
      for (let sk in hustle.minSkill) {
        var curSkLv =
          (state.skills && state.skills[sk] && state.skills[sk].level) || 0;
        if (curSkLv < hustle.minSkill[sk]) {
          return {
            ok: false,
            reason: `${skillLabelMap[sk] || sk}技能不足（需要Lv.${hustle.minSkill[sk]}）`,
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
   * 详细检查副业条件 — 返回所有条件的 ✅/❌ 状态
   * @returns {Array<{label:string, ok:boolean, current:*, required:*}>}
   */
  function checkHustleConditionsDetailed(hustleId, state) {
    const hustle = SIDE_HUSTLES[hustleId];
    if (!hustle)
      return [
        { label: "副业存在", ok: false, current: "不存在", required: "存在" },
      ];
    var results = [];
    var attrLabelMap = {
      agility: "敏捷",
      intelligence: "智力",
      charm: "魅力",
      physique: "体质",
      mental: "能力",
    };
    var skillLabelMap = {
      driving: "驾驶",
      coding: "编程",
      cooking: "厨艺",
      sales: "销售",
    };

    // 属性检查
    if (hustle.minAttr) {
      for (let attr in hustle.minAttr) {
        var required = hustle.minAttr[attr];
        var current = state.player[attr] || 0;
        results.push({
          label: (attrLabelMap[attr] || attr) + "≥" + required,
          ok: current >= required,
          current: current,
          required: required,
        });
      }
    }

    // 技能检查
    if (hustle.minSkill) {
      for (let sk in hustle.minSkill) {
        var skillRequired = hustle.minSkill[sk];
        var skillCurrent =
          (state.skills && state.skills[sk] && state.skills[sk].level) || 0;
        results.push({
          label: (skillLabelMap[sk] || sk) + "≥Lv." + skillRequired,
          ok: skillCurrent >= skillRequired,
          current: "Lv." + skillCurrent,
          required: "Lv." + skillRequired,
        });
      }
    }

    // 现金检查
    if (hustle.minCash) {
      var cash = state.resources.cash || 0;
      results.push({
        label: "资金≥¥" + hustle.minCash,
        ok: cash >= hustle.minCash,
        current: "¥" + cash,
        required: "¥" + hustle.minCash,
      });
    }

    // 时间槽检查
    const currentSlot = state.player.timeSlot;
    var slotNames = {
      morning: "上午",
      afternoon: "下午",
      evening: "晚上",
      night: "深夜",
    };
    results.push({
      label:
        "当前时间段可进行（" +
        hustle.timeSlot
          .map(function (s) {
            return slotNames[s] || s;
          })
          .join("、") +
        "）",
      ok: hustle.timeSlot.includes(currentSlot),
      current: slotNames[currentSlot] || currentSlot,
      required:
        "需要" +
        hustle.timeSlot
          .map(function (s) {
            return slotNames[s] || s;
          })
          .join("或"),
    });

    return results;
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
    const hasMainJob =
      state.career &&
      state.career.currentJob &&
      !(state.flags && state.flags._retired);
    if (hasMainJob) {
      const careerCap =
        typeof ensureCareerCapital === "function"
          ? ensureCareerCapital(state)
          : null;
      const curBurnout = careerCap ? careerCap.burnout || 0 : 0;
      // 主业占用主要精力，副业效率基础-20%；高倦怠时再-15%
      let conflictMult = curBurnout >= 60 ? 0.65 : 0.8;
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
    state.resources.cash = (state.resources.cash || 0) + income;
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

    // v3.1 — 副业执行后 8% 概率触发随机副业事件（当日无其他待弹事件时）
    if (
      !state._pendingEvent &&
      typeof triggerSideHustleEvent === "function" &&
      Random.chance(0.08)
    ) {
      triggerSideHustleEvent(state, hustleId);
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
      checkDetailed: checkHustleConditionsDetailed,
      perform: performHustle,
      getFatigue: getFatigueStatus,
      getList: () => SIDE_HUSTLES,
    };
  }
})();

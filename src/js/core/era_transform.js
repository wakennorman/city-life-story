/**
 * 时代变迁系统（v3.6 P0-2）
 *
 * 模拟中国近30年经济变迁对物价/工资的影响：
 * - 通胀指数：1.0 → 1.08（8%/年）
 * - 时代阶段：初期/成长期/成熟期/衰退期
 * - 每个阶段有不同的价格/工资倍率
 *
 * 设计参考：中国CPI历史数据 / Capitalism Lab经济周期
 */

(function () {
  // ====== 时代阶段定义 ======
  const ERA_STAGES = {
    initial: {
      id: "initial",
      name: "起步期",
      icon: "🌱",
      desc: "经济起步阶段，物价稳定但工资较低",
      priceMod: 0.85,
      wageMod: 0.8,
      color: "var(--success)",
    },
    growth: {
      id: "growth",
      name: "成长期",
      icon: "📈",
      desc: "经济高速增长，物价温和上涨，工资快速提升",
      priceMod: 1.0,
      wageMod: 1.0,
      color: "var(--primary)",
    },
    mature: {
      id: "mature",
      name: "成熟期",
      icon: "💰",
      desc: "经济成熟，物价上涨明显，工资增长放缓",
      priceMod: 1.15,
      wageMod: 1.1,
      color: "var(--warning)",
    },
    decline: {
      id: "decline",
      name: "调整期",
      icon: "📉",
      desc: "经济调整期，部分行业下行，机会与风险并存",
      priceMod: 1.05,
      wageMod: 0.95,
      color: "var(--danger)",
    },
  };

  // ====== 通胀指数配置 ======
  const INFLATION_CONFIG = {
    annualRate: 0.08, // 8%/年
    baseIndex: 1.0,
    maxIndex: 2.5, // 通胀指数上限
    minIndex: 0.8, // 通胀指数下限
  };

  // ====== 时代事件触发点（按游戏天数） ======
  const ERA_EVENTS_TRIGGER_DAYS = [90, 180, 270, 365, 450, 540, 720, 900];

  /**
   * 获取当前时代阶段
   * @param {number} day - 当前游戏天数
   * @returns {string} 阶段ID
   */
  function getEraStage(day) {
    const year = day / 365;
    if (year < 0.5) return "initial";
    if (year < 1.5) return "growth";
    if (year < 3) return "mature";
    return "decline";
  }

  /**
   * 获取当前时代修正
   * @param {Object} state - 游戏状态
   * @returns {Object} 时代修正信息
   */
  function getEraMod(state) {
    const day = state.player ? state.player.day : 1;
    const stageId = getEraStage(day);
    const stage = ERA_STAGES[stageId];

    // 计算通胀指数
    const year = day / 365;
    let inflationIndex = INFLATION_CONFIG.baseIndex;
    inflationIndex *= Math.pow(1 + INFLATION_CONFIG.annualRate, year);
    inflationIndex = Math.max(
      INFLATION_CONFIG.minIndex,
      Math.min(INFLATION_CONFIG.maxIndex, inflationIndex),
    );

    // 世界参数叠加
    let sectorDrift = 0;
    if (state._worldParams && state._worldParams.sectorHeat) {
      // 取平均行业热度
      const heats = Object.values(state._worldParams.sectorHeat);
      if (heats.length > 0) {
        sectorDrift = heats.reduce((a, b) => a + b, 0) / heats.length - 1;
      }
    }

    return {
      stageId,
      stageName: stage.name,
      stageIcon: stage.icon,
      stageDesc: stage.desc,
      priceMod: stage.priceMod * inflationIndex * (1 + sectorDrift * 0.1),
      wageMod: stage.wageMod * inflationIndex * (1 + sectorDrift * 0.05),
      inflationIndex: inflationIndex,
      year: year,
    };
  }

  /**
   * 时代变迁每日 tick
   * @param {Object} state - 游戏状态
   */
  function eraTick(state) {
    if (!state.player) return;

    const day = state.player.day;
    const eraMod = getEraMod(state);

    // 记录时代状态
    state._eraState = {
      stageId: eraMod.stageId,
      inflationIndex: eraMod.inflationIndex,
      lastCheckDay: day,
    };

    // 检查是否触发时代事件
    if (ERA_EVENTS_TRIGGER_DAYS.includes(day)) {
      state._pendingEraEvent = {
        triggerDay: day,
        stage: eraMod.stageId,
      };
    }
  }

  /**
   * 获取时代事件列表
   * @returns {Array} 时代事件
   */
  function getEraEvents() {
    return [
      {
        id: "era_90",
        day: 90,
        title: "第一桶金",
        story:
          "你在这座城市已经待了三个月。物价开始有了微妙的变化——菜价涨了5%，但你也学会了怎么挑便宜货。",
        effect: "物价+5%，工资+3%",
      },
      {
        id: "era_180",
        day: 180,
        title: "行业风口",
        story:
          "某个新兴行业突然火爆，相关岗位薪资翻倍。你看到新闻，心里痒痒的。",
        effect: "解锁新工作机会，部分行业热度+20%",
      },
      {
        id: "era_270",
        day: 270,
        title: "物价飞涨",
        story:
          "通胀开始显现。房租涨了10%，菜价涨了8%。你开始认真考虑要不要存点钱买房。",
        effect: "物价+10%，房租+10%",
      },
      {
        id: "era_365",
        day: 365,
        title: "一周年",
        story:
          "一年过去了。你回头看刚来时的自己，感慨万千。这一年，城市变了，你也变了。",
        effect: "获得「城市生存者」成就，所有NPC好感衰减减半",
      },
      {
        id: "era_450",
        day: 450,
        title: "行业洗牌",
        story:
          "某些行业开始整合，小公司倒闭，大公司收购。有人失业，有人跳槽成功。",
        effect: "部分工作消失，新工作出现",
      },
      {
        id: "era_540",
        day: 540,
        title: "消费升级",
        story:
          "城里人开始追求品质生活。高端消费场所增多，但普通人的日子也没变差。",
        effect: "高端商品解锁，物价+5%",
      },
      {
        id: "era_720",
        day: 720,
        title: "两年之痒",
        story:
          "两年了。你开始思考：是继续打工，还是自己单干？城市给了你机会，也给了你压力。",
        effect: "创业门槛降低，创业事件概率+50%",
      },
      {
        id: "era_900",
        day: 900,
        title: "三年之变",
        story:
          "三年。这座城市已经把你塑造成了另一个人。你开始有能力影响周围的人。",
        effect: "解锁「城市影响者」成就，NPC关系传导效果+20%",
      },
    ];
  }

  /**
   * 初始化时代变迁系统
   * @param {Object} state - 游戏状态
   */
  function initEraTransform(state) {
    state._eraState = {
      stageId: "initial",
      inflationIndex: INFLATION_CONFIG.baseIndex,
      lastCheckDay: state.player ? state.player.day : 1,
    };
    state._pendingEraEvent = null;
  }

  // ====== 导出 ======
  if (typeof window !== "undefined") {
    window.ERA_STAGES = ERA_STAGES;
    window.eraTransform = {
      init: initEraTransform,
      tick: eraTick,
      getMod: getEraMod,
      getStage: getEraStage,
      getEvents: getEraEvents,
      getInflationConfig: () => INFLATION_CONFIG,
    };
  }
})();

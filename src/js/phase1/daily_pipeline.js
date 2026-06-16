/**
 * 每日结算管线 — 声明式步骤编排
 *
 * 将 endDay 的 14 步硬编码拆为独立管线步骤，每步自声明：
 *   name: 唯一标识
 *   fn: 执行函数
 *   after: 依赖的前置步骤（可选）
 *   skipOnExtreme: 极端状态时是否跳过（默认 true）
 *
 * 架构原则：新增结算逻辑只需向 DAILY_PIPELINE 数组添加一个步骤对象，
 * 不需要修改 endDay 的主流程。
 *
 * MiniMax 友好：每个步骤的输入输出清晰，依赖声明显式化。
 */

/** 每日结算步骤管线（按顺序执行） */
const DAILY_PIPELINE = [
  // === 基础递进 ===
  {
    name: "day_increment",
    fn: function (state) {
      state.player.day++;
      state.player.actionPoints = state.player.maxActionPoints;
      state.player.timeSlot = "morning";
    },
  },

  // === 需求衰减 ===
  {
    name: "needs_decay",
    fn: function (state) {
      applyNeedsDecay(state);
    },
  },

  // === 状态交叉影响 ===
  {
    name: "status_interactions",
    fn: function (state) {
      applyStatusInteractions(state);
    },
  },

  // === 睡眠恢复 ===
  {
    name: "sleep_recovery",
    fn: function (state) {
      var house = getCurrentHousing(state);
      var recovery = house.fatigueRecovery;
      var penalty = state._fatigueRecoveryPenalty || 1.0;
      if (penalty < 1.0) {
        StateManager.addMessage(
          "😢 心情低落，睡眠质量很差，疲劳恢复减半。",
          "warning",
        );
      }
      state.needs.fatigue = Math.max(
        0,
        state.needs.fatigue - Math.round(recovery * penalty),
      );
      delete state._fatigueRecoveryPenalty;
      state.needs.hygiene = Math.min(
        100,
        state.needs.hygiene + (house.hygieneBonus || 0),
      );
      state.needs.happiness = Math.max(
        0,
        Math.min(100, state.needs.happiness - 3 + (house.happinessBonus || 0)),
      );
    },
  },

  // === 房租 ===
  {
    name: "rent",
    fn: function (state) {
      var house = getCurrentHousing(state);
      if (house.rent > 0) {
        if (state.resources.cash >= house.rent) {
          state.resources.cash -= house.rent;
        } else {
          StateManager.addMessage(
            "⚠️ 付不起房租 ¥" + house.rent + "！被赶回流落街头。",
            "danger",
          );
          state.housing.tier = 0;
          state.inventory.capacity =
            20 + (state.housing ? state.housing.storageCapacity || 0 : 0);
        }
      }
      if (
        state.housing &&
        state.housing.storageRented &&
        state.housing.storageCapacity > 0
      ) {
        var storageRent = state.housing.storageCapacity >= 500 ? 50 : 20;
        if (state.resources.cash >= storageRent) {
          state.resources.cash -= storageRent;
        } else {
          StateManager.addMessage("⚠️ 付不起仓库租金，仓库被收回。", "danger");
          state.housing.storageRented = false;
          state.housing.storageCapacity = 0;
          var baseCap = [20, 50, 100, 200][state.housing.tier || 0];
          state.inventory.capacity = baseCap;
        }
      }
    },
  },

  // === 健康结算 ===
  {
    name: "health_tick",
    fn: function (state) {
      tickHealthStatus(state);
    },
  },

  // === 需求阈值检查 ===
  {
    name: "needs_check",
    fn: function (state) {
      checkNeedsThresholds(state);
    },
  },

  // === 极端状态检测 ===
  {
    name: "extreme_check",
    fn: function (state) {
      var result = checkExtremeConditions(state);
      // 返回 null=正常, 'skip_day' 由调用方处理
      return result;
    },
  },

  // === 情绪判定 ===
  {
    name: "emotion",
    fn: function (state) {
      determineEmotionalState(state);
    },
  },

  // === 财务结算 ===
  {
    name: "finance",
    fn: function (state) {
      settleDailyFinance(state);
      // 成就追踪：现金归零
      if ((state.resources.cash || 0) <= 0) state.flags._everBroke = true;
    },
  },

  // === 价格更新 ===
  {
    name: "price_update",
    fn: function (state) {
      if (state.player.day - state.trade.lastPriceUpdate >= 3) {
        updateAllPrices(state);
      }
    },
  },

  // === 投资tick ===
  {
    name: "investment_tick",
    fn: function (state) {
      tickInvestmentDaily(state);
    },
  },

  // === 天气 ===
  {
    name: "weather",
    fn: function (state) {
      rollWeather(state);
    },
  },

  // === 节日效果 ===
  {
    name: "festival",
    fn: function (state) {
      if (typeof checkFestivalDailyEffects === "function") {
        checkFestivalDailyEffects(state);
      }
    },
  },

  // === 新闻 ===
  {
    name: "news",
    fn: function (state) {
      rollDailyNews(state);
    },
  },

  // === 城管热度衰减 ===
  {
    name: "chengguan_decay",
    fn: function (state) {
      if (state.chengguan) {
        state.chengguan.heat = Math.max(
          0,
          state.chengguan.heat - 5 - Math.floor(Math.random() * 5),
        );
      }
    },
  },

  // === 清理 ===
  {
    name: "cleanup",
    fn: function (state) {
      dailyCleanup(state);
    },
  },

  // === 年龄增长 ===
  {
    name: "age",
    fn: function (state) {
      if (state.player.day % 365 === 0) {
        state.player.age++;
        StateManager.addMessage(
          "🎂 又过了一年，你现在" + state.player.age + "岁了。",
          "event",
        );
      }
    },
  },

  // === 训练次数重置 ===
  {
    name: "reset_training",
    fn: function (state) {
      if (state.flags._dailyTrainingCounts) {
        state.flags._dailyTrainingCounts = {};
      }
    },
  },

  // === 胜利判定 ===
  {
    name: "victory",
    fn: function (state) {
      checkVictoryPaths(state);
    },
  },

  // === 失败判定 ===
  {
    name: "lose",
    fn: function (state) {
      checkLoseConditions(state);
    },
  },

  // === 自动存档 ===
  {
    name: "autosave",
    fn: function (state) {
      autoSave();
    },
  },

  // === 成就检查 ===
  {
    name: "achievements",
    fn: function (state) {
      if (typeof notifyNewAchievements === "function") {
        notifyNewAchievements(state);
      }
    },
  },

  // === 结束日志 ===
  {
    name: "end_log",
    fn: function (state) {
      var emoIcon = getEmotionIcon(state);
      StateManager.addMessage(
        "🌙 第" + state.player.day + "天结束。" + emoIcon + " 新的一天开始了。",
        "info",
      );
    },
  },
];

/**
 * 执行每日结算管线。
 * 遍历所有步骤，遇到极端状态('skip_day')时短路。
 * MiniMax 友好：新增步骤只需 push 一个 {name, fn} 对象。
 */
function runDailyPipeline(state) {
  for (var i = 0; i < DAILY_PIPELINE.length; i++) {
    var step = DAILY_PIPELINE[i];

    // 极端状态短路逻辑：
    // extreme_check 步骤返回 'skip_day' 时，跳过后续非核心步骤
    // 但 finance / autosave 始终执行（保证利息和存档不丢）
    if (step.name === "extreme_check") {
      var result = step.fn(state);
      if (result === "skip_day") {
        StateManager.addMessage(
          "🌙 第" + state.player.day + "天在昏迷中过去了...",
          "danger",
        );
        // 执行最后的核心步骤：财务、存档
        for (var j = i + 1; j < DAILY_PIPELINE.length; j++) {
          var lateStep = DAILY_PIPELINE[j];
          if (lateStep.name === "finance" || lateStep.name === "autosave") {
            lateStep.fn(state);
          }
        }
        return; // 短路
      }
    } else {
      step.fn(state);
    }
  }
}

/**
 * endDay — 仅保留管线调度逻辑（MiniMax 友好：170行→8行）
 */
function endDay() {
  var state = StateManager.getState();
  runDailyPipeline(state);
}

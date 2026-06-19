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
      // 命名疾病的疲劳恢复倍率叠加（失眠症等）
      if (typeof getIllnessAttrDebuffs === "function") {
        var ad = getIllnessAttrDebuffs(state);
        if (ad.fatigueRecoveryMult && ad.fatigueRecoveryMult < 1) {
          penalty *= ad.fatigueRecoveryMult;
        }
      }
      if (penalty < 1.0) {
        StateManager.addMessage(
          "😢 睡眠质量很差，疲劳恢复打了" + Math.round(penalty * 100) + "%折。",
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
      // 王大婶好感30解锁每日带饭（饥饱+15）
      if (state.flags.auntWangMeal) {
        state.needs.hunger = Math.min(100, state.needs.hunger + 15);
        if (Math.random() < 0.3) {
          StateManager.addMessage(
            "🍱 早上发现门口有王大婶留的饭菜，暖心。",
            "info",
          );
        }
      }
    },
  },

  // === 房租 ===
  {
    name: "rent",
    fn: function (state) {
      var house = getCurrentHousing(state);
      var selfLiving =
        state.investment && state.investment.selfLivePropertyId != null;
      if (house.rent > 0 && !selfLiving) {
        var rentAmount = house.rent;
        // 王大婶好感60解锁租房折扣（-¥50/天）
        if (state.flags.auntWangRentDiscount && rentAmount >= 50) {
          rentAmount -= 50;
        }
        if (state.resources.cash >= rentAmount) {
          state.resources.cash -= rentAmount;
          addDailyTransaction(
            state,
            "expense",
            "rent",
            rentAmount,
            house.name ? "房租 - " + house.name : "房租",
          );
        } else {
          StateManager.addMessage(
            "⚠️ 付不起房租 ¥" + rentAmount + "！被赶回流落街头。",
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
          addDailyTransaction(
            state,
            "expense",
            "rent",
            storageRent,
            "仓库租金",
          );
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

  // === 习惯追踪 ===
  {
    name: "habit_tick",
    fn: function (state) {
      if (typeof tickHabits === "function") tickHabits(state);
      // 办公室工作天数追踪（职业病）
      if (typeof tickOfficeWorkDays === "function") tickOfficeWorkDays(state);
    },
  },

  // === 命名疾病掷骰 ===
  {
    name: "illness_roll",
    fn: function (state) {
      if (typeof rollDailyIllness === "function") rollDailyIllness(state);
    },
  },

  // === 需求阈值检查 ===
  {
    name: "needs_check",
    fn: function (state) {
      checkNeedsThresholds(state);
    },
  },

  // === 临界值延期惩罚（在 extreme_check 之前）===
  {
    name: "critical_punish",
    fn: function (state) {
      if (typeof applyDeferredCriticalPunishments === "function") {
        return applyDeferredCriticalPunishments(state);
      }
      return null;
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

  // === 每日快照（用于成长图表） ===
  {
    name: "snapshot",
    fn: function (state) {
      if (!state.flags._cashHistory) state.flags._cashHistory = [];
      var totalAsset =
        (state.resources.cash || 0) + (state.resources.bankBalance || 0);
      state.flags._cashHistory.push({
        day: state.player.day,
        value: totalAsset,
      });
      if (state.flags._cashHistory.length > 90) {
        state.flags._cashHistory = state.flags._cashHistory.slice(-90);
      }
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

  // === 企业命运tick ===
  {
    name: "enterprise_fate_tick",
    fn: function (state) {
      if (typeof tickEnterpriseFate === "function") {
        tickEnterpriseFate(state);
      }
    },
  },

  // === 技能天赋树检查（P2#12） ===
  {
    name: "skill_tree_check",
    fn: function (state) {
      if (!state.skillBranches || typeof getUnlockedTalentNodes !== "function")
        return;
      if (!state.flags._checkedTalentNodes)
        state.flags._checkedTalentNodes = {};
      for (var sk in state.skills) {
        if (!state.skillBranches[sk]) continue;
        var unlocked = getUnlockedTalentNodes(sk, state);
        for (var ni = 0; ni < unlocked.length; ni++) {
          var node = unlocked[ni];
          var nodeKey = sk + "_" + state.skillBranches[sk] + "_" + node.id;
          if (state.flags._checkedTalentNodes[nodeKey]) continue;
          state.flags._checkedTalentNodes[nodeKey] = true;
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage(
              "🌟 " +
                getSkillChineseName(sk) +
                "天赋节点「" +
                node.name +
                "」可激活！",
              "hint",
            );
          }
        }
      }
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
      // 春节7天特殊活动
      if (typeof checkSpringFestivalEvents === "function") {
        checkSpringFestivalEvents(state);
      }
    },
  },

  // === 新闻 ===
  {
    name: "news",
    fn: function (state) {
      rollDailyNews(state);
      // L1-L4 新闻传导链检查
      if (typeof checkNewsConduit === "function") {
        checkNewsConduit(state);
      }
      if (typeof applyPendingConduitNews === "function") {
        applyPendingConduitNews(state);
      }
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
      // 名气VIP行动每日重置
      if (state.flags._fameVipUsedToday) {
        state.flags._fameVipUsedToday = {};
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

  // === 梦想进度检查 ===
  {
    name: "dream_check",
    fn: function (state) {
      if (typeof checkDreamProgress === "function") {
        checkDreamProgress(state);
      }
    },
  },

  // === NPC 生日提醒 ===
  {
    name: "npc_birthday",
    fn: function (state) {
      if (typeof NPCS === "undefined") return;
      var dayOfYear = ((state.player.day - 1) % 365) + 1;
      for (var i = 0; i < NPCS.length; i++) {
        var npc = NPCS[i];
        if (!npc.birthday) continue;
        var key = "_birthdayToday_" + npc.id;
        if (dayOfYear === npc.birthday) {
          state.flags[key] = true;
          var rel = state.relationships && state.relationships[npc.id];
          if (rel && rel.met) {
            StateManager.addMessage(
              "🎂 今天是" + npc.name + "的生日！送礼好感×2，快去找ta吧！",
              "event",
            );
          }
        } else {
          delete state.flags[key];
        }
      }
    },
  },

  // === 新闻级联后续（L2层触发）===
  {
    name: "news_followup",
    fn: function (state) {
      if (typeof checkNewsFollowUp === "function") {
        checkNewsFollowUp(state);
      }
    },
  },

  // === 动态教程提示 ===
  {
    name: "hint_check",
    fn: function (state) {
      if (typeof checkDynamicHints === "function") {
        checkDynamicHints(state);
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
      // 今日总结（仅街头阶段，职场有自己的季末总结）
      if (state.player.phase === "street") {
        var summary = generateDailySummary(
          state,
          state.flags._dayStartCash || 0,
          state.flags._dayStartHealth || 100,
          state.flags._dayStartHappiness || 0,
        );
        StateManager.addMessage(summary, "hint");
      }
    },
  },

  // === 每日收支报告（阻塞弹窗）===
  {
    name: "daily_report",
    fn: function (state) {
      if (typeof showDailyReport === "function") {
        showDailyReport(state);
      }
    },
  },
];

/** 生成每日一句话总结 */
function generateDailySummary(state, startCash, startHealth, startHappiness) {
  var cash = state.resources.cash || 0;
  var bank = state.resources.bankBalance || 0;
  var delta = cash - startCash;
  var healthDrop = startHealth - ((state.status && state.status.health) || 100);
  var happyDrop =
    startHappiness - ((state.needs && state.needs.happiness) || 0);
  var day = state.player.day || 1;

  var highlights = [];

  // 特殊叙事片段（优先级最高）
  if (state.flags._todayDeepTaskDone) {
    highlights.push("有个人在你心里留下了什么");
  } else if (state.flags._todayDebtEvent) {
    highlights.push("村长的钱，又压了一整天");
  } else if (state.flags._todayMentalEvent) {
    highlights.push("心里那根弦今天绷得很紧");
  }

  // 财务总结（分更多档次，语气有温度）
  if (delta >= 1000) {
    highlights.push("今天是个好日子，净赚了¥" + delta.toLocaleString());
  } else if (delta >= 300) {
    highlights.push("今天赚了¥" + delta.toLocaleString() + "，还不错");
  } else if (delta >= 50) {
    highlights.push("今天净入¥" + delta.toLocaleString() + "，比昨天强点");
  } else if (delta >= 0) {
    highlights.push("今天收支基本持平，活下来了");
  } else if (delta < -500) {
    highlights.push("今天支出不少，净亏了¥" + Math.abs(delta).toLocaleString());
  } else if (delta < 0) {
    highlights.push(
      "今天支出略多，口袋瘦了¥" + Math.abs(delta).toLocaleString(),
    );
  }

  // 里程碑叙事
  if (day === 7) highlights.push("来这座城市整整一周了");
  else if (day === 30) highlights.push("整整一个月，你还在");
  else if (day === 100) highlights.push("百天了，城市没把你打倒");
  else if (day === 365) highlights.push("一年了，从头到今天");

  // 存款鼓励
  if (bank >= 10000 && highlights.length < 2) {
    highlights.push("银行里¥" + bank.toLocaleString() + "，是你在这城市的底气");
  } else if (bank > 0 && highlights.length < 2) {
    highlights.push("银行里的¥" + bank.toLocaleString() + "还在生息");
  }

  // 健康/心情状态
  if (healthDrop >= 15) {
    highlights.push("身体吃不消了，明天注意");
  } else if (happyDrop >= 20) {
    highlights.push("今天过得不太开心，明天找找乐子");
  }

  // 村长债务提示（仅经典模式/有 villageDebt 的剧本）
  if ((state.resources.villageDebt || 0) > 0 && highlights.length < 2) {
    highlights.push(
      "村长那¥" +
        (state.resources.villageDebt || 0).toLocaleString() +
        "的债还压着呢",
    );
  }

  // 节日氛围
  if (typeof getCurrentFestival === "function") {
    var fest = getCurrentFestival(day);
    if (fest && highlights.length < 2)
      highlights.push(fest.icon + " " + fest.name + "的气氛越来越浓了");
  }

  // 梦想进度
  if (typeof getDreamProgress === "function" && highlights.length < 2) {
    var dp = getDreamProgress(state);
    if (dp > 0 && dp < 100) highlights.push("梦想进度" + dp + "%，一直往前");
  }

  // 清除今日临时标记
  delete state.flags._todayDeepTaskDone;
  delete state.flags._todayDebtEvent;
  delete state.flags._todayMentalEvent;

  if (!highlights.length) highlights.push("平凡的一天，活着就是赢了");

  var summary = highlights.slice(0, 2).join("，") + "。";
  return "📋 今日总结：" + summary;
}

/**
 * 执行每日结算管线。
 * 遍历所有步骤，遇到极端状态('skip_day')时短路。
 * MiniMax 友好：新增步骤只需 push 一个 {name, fn} 对象。
 */
function runDailyPipeline(state) {
  // 记录日始状态用于今日总结（存入 state.flags 供 end_log fn 读取）
  state.flags._dayStartCash = state.resources.cash || 0;
  state.flags._dayStartHealth = (state.status && state.status.health) || 100;
  state.flags._dayStartHappiness = (state.needs && state.needs.happiness) || 0;

  for (var i = 0; i < DAILY_PIPELINE.length; i++) {
    var step = DAILY_PIPELINE[i];

    // 极端状态短路逻辑：
    // extreme_check / critical_punish 返回 'skip_day' 时，跳过后续非核心步骤
    // 但 finance / autosave 始终执行（保证利息和存档不丢）
    if (step.name === "extreme_check" || step.name === "critical_punish") {
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

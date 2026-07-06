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

  // === v3.3 W2-T3: 剧本专属开局链（在需求衰减之前触发）===
  {
    name: "scenario_start_chain",
    fn: function (state) {
      if (typeof checkScenarioStartChain === "function") {
        checkScenarioStartChain(state);
      }
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

  // === 资产关联维持性开支（P1-5：后期"钱太多没事做"） ===
  {
    name: "wealth_overhead",
    fn: function (state) {
      if (typeof applyWealthBasedOverhead === "function") {
        applyWealthBasedOverhead(state);
      }
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
        if (Random.chance(0.3)) {
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
          var houseInfo =
            typeof getCurrentHousing === "function"
              ? getCurrentHousing(state)
              : null;
          var baseCap = houseInfo ? houseInfo.capacity : 20;
          state.inventory.capacity = baseCap;
        }
      }
    },
  },

  // === v3.8: 住房维护费（按住房等级月度扣除） ===
  {
    name: "housing_maintenance",
    fn: function (state) {
      if (!state.housing) return;
      var day = state.player.day || 1;
      // 每月第 1 天结算（不是每天）
      if (day % 30 !== 1) return;
      var tier = state.housing.tier || 0;
      // 住房等级：0=无/1=城中村/2=老旧小区/3=普通公寓/4=高档小区/5=管家服务
      var maintenanceFee = 0;
      if (tier <= 1) maintenanceFee = 0;
      else if (tier === 2) maintenanceFee = 150;
      else if (tier === 3) maintenanceFee = 300;
      else if (tier === 4) maintenanceFee = 800;
      else if (tier >= 5) maintenanceFee = 2000;
      if (maintenanceFee > 0 && state.resources.cash >= maintenanceFee) {
        state.resources.cash -= maintenanceFee;
        addDailyTransaction(
          state,
          "expense",
          "housing_maintenance",
          maintenanceFee,
          "住房物业维护费",
        );
      } else if (maintenanceFee > 0) {
        StateManager.addMessage(
          "⚠️ 付不起住房维护费 ¥" + maintenanceFee + "，房屋状况变差。",
          "warning",
        );
        // 维护费付不起不降级，但累积欠费标记
        state.flags._maintenanceArrears =
          (state.flags._maintenanceArrears || 0) + 1;
      }
    },
  },

  // === v3.8: 社交圈维护费（每月基于 NPC 好感总值扣除） ===
  {
    name: "social_maintenance",
    fn: function (state) {
      if (!state.npcRelationships) return;
      var day = state.player.day || 1;
      // 每月第 1 天结算
      if (day % 30 !== 1) return;
      var totalAffinity = 0;
      var npcCount = 0;
      for (var npcId in state.npcRelationships) {
        var rel = state.npcRelationships[npcId];
        if (rel && typeof rel.affinity === "number" && rel.affinity >= 10) {
          totalAffinity += rel.affinity;
          npcCount++;
        }
      }
      if (npcCount === 0) return;
      // 每 100 好感 = ¥50/月
      var socialCost = Math.round(totalAffinity / 100) * 50;
      if (socialCost <= 0) return;
      socialCost = Math.min(socialCost, 500); // 上限 ¥500/月
      if (state.resources.cash >= socialCost) {
        state.resources.cash -= socialCost;
        addDailyTransaction(
          state,
          "expense",
          "social_maintenance",
          socialCost,
          "人情往来（" + npcCount + "位朋友）",
        );
      } else {
        state.resources.cash = 0;
        StateManager.addMessage(
          "⚠️ 连人情钱都凑不出… 朋友可能觉得你在疏远他们。",
          "warning",
        );
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

  // === 疾病演化风险检查 ===
  {
    name: "illness_evolution_check",
    fn: function (state) {
      if (typeof checkEvolutionRisk === "function") checkEvolutionRisk(state);
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
      // 1. 总资产快照
      if (!state.flags._cashHistory) state.flags._cashHistory = [];
      var assetSnapshot =
        typeof getInvestmentAssetSnapshot === "function"
          ? getInvestmentAssetSnapshot(state)
          : null;
      var totalAsset = assetSnapshot
        ? Math.round(assetSnapshot.totalAssets)
        : (state.resources.cash || 0) + (state.resources.bankBalance || 0);
      state.flags._cashHistory.push({
        day: state.player.day,
        value: totalAsset,
      });
      if (state.flags._cashHistory.length > 180) {
        state.flags._cashHistory = state.flags._cashHistory.slice(-180);
      }

      // 2. 收入/支出历史（供 incomeChart 使用）
      if (!state.history) state.history = { income: [], expense: [] };
      var txs = state.flags._dailyTransactions || [];
      var dailyIncome = 0,
        dailyExpense = 0;
      for (var ti = 0; ti < txs.length; ti++) {
        var t = txs[ti];
        if (t.type === "income") dailyIncome += t.amount || 0;
        else if (t.type === "expense") dailyExpense += t.amount || 0;
      }
      state.history.income.push(dailyIncome);
      state.history.expense.push(dailyExpense);
      if (state.history.income.length > 180) {
        state.history.income = state.history.income.slice(-180);
        state.history.expense = state.history.expense.slice(-180);
      }

      // 3. 属性快照（每 7 天记录一次，供雷达图历史对比）
      if (!state.history.stats) state.history.stats = [];
      var p = state.player || {};
      var lastStat = state.history.stats[state.history.stats.length - 1];
      if (
        !lastStat ||
        state.player.day - lastStat.day >= 7 ||
        state.history.stats.length === 0
      ) {
        state.history.stats.push({
          day: state.player.day,
          physique: p.physique || 0,
          intelligence: p.intelligence || 0,
          agility: p.agility || 0,
          mental: p.mental || 0,
          fame: p.fame || 0,
        });
        if (state.history.stats.length > 12) {
          // 保留最近 12 次 = 约 84 天
          state.history.stats = state.history.stats.slice(-12);
        }
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

  // === 市场事件（供需随机波动）===
  {
    name: "pricing_market",
    fn: function (state) {
      if (typeof checkMarketEvents === "function") checkMarketEvents(state);
      if (typeof decaySupplyDemand === "function") decaySupplyDemand(state);
    },
  },

  // === 投资tick ===
  {
    name: "investment_tick",
    fn: function (state) {
      tickInvestmentDaily(state);
    },
  },

  // === 创业公司每日运营tick ===
  {
    name: "startup_tick",
    fn: function (state) {
      // 仅在注册了公司且未退出时执行
      if (
        state.startup &&
        state.startup.company &&
        !state.startup.flags?.exited
      ) {
        if (typeof tickStartup === "function") {
          tickStartup(state, "daily");
        }
        // 每日随机创业事件（概率8%）
        if (Random.chance(0.08) && typeof triggerStartupEvent === "function") {
          triggerStartupEvent(state);
        }
      }
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
  // === Phase 2 职场社交每日 tick ===
  {
    name: "workplace_social_tick",
    fn: function (state) {
      if (typeof tickWorkplaceSocialDaily === "function") {
        tickWorkplaceSocialDaily(state);
      }
    },
  },

  // === Phase 2 家庭每日 tick ===
  {
    name: "family_daily",
    fn: function (state) {
      if (typeof tickFamilyDaily === "function") {
        tickFamilyDaily(state);
      }
    },
  },

  // === Phase 2 社交网络每日 tick ===
  {
    name: "social_network_daily",
    fn: function (state) {
      if (typeof tickSocialNetwork === "function") {
        tickSocialNetwork(state);
      }
    },
  },

  // === 固定工作（上班族）每日 tick ===
  {
    name: "career_job_daily",
    fn: function (state) {
      if (typeof tickCareerJobDaily === "function") {
        tickCareerJobDaily(state);
      }
    },
  },

  // === Phase 2 个人成长每日 tick ===
  {
    name: "personal_growth_daily",
    fn: function (state) {
      if (typeof tickPersonalGrowthDaily === "function") {
        tickPersonalGrowthDaily(state);
      }
    },
  },

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

  // === 世界参数反馈环（在天气和新闻之前，确保参数最新） ===
  {
    name: "world_params_tick",
    fn: function (state) {
      if (typeof tickWorldParams === "function") {
        tickWorldParams(state);
      }
    },
  },

  // === v3.4 C3D-T1: NPC 位置轮换 ===
  {
    name: "npc_location_tick",
    fn: function (state) {
      if (typeof tickNpcLocationRotation === "function") {
        tickNpcLocationRotation(state);
      }
    },
  },

  // === 天气 ===
  {
    name: "weather",
    fn: function (state) {
      rollWeather(state);
      // v3.3 W2-T2: 更新明日天气预报
      if (typeof updateNextDayForecast === "function") {
        updateNextDayForecast(state);
      }
    },
  },

  // === 天气每日效果（温度/舒适度/健康影响）===
  {
    name: "weather_daily_effects",
    fn: function (state) {
      if (typeof applyWeatherDailyEffects === "function") {
        applyWeatherDailyEffects(state);
      }
    },
  },

  // === v3.3 W2-T2: 天气准备减免惩罚（伞/暖宝）===
  {
    name: "weather_prep_mitigation",
    fn: function (state) {
      var prep = state.flags && state.flags._weatherPrep;
      if (!prep) return;
      var wId = state.weather && state.weather.current;
      var isRainy = ["rainy", "stormy", "plum_rain"].indexOf(wId) >= 0;
      var isCold = ["snowy", "cold_snap", "foggy"].indexOf(wId) >= 0;

      // 雨伞：雨天直接减免疲劳
      if (prep.umbrella && isRainy) {
        if (prep.umbrellaUses == null) prep.umbrellaUses = 3;
        state.needs.fatigue = Math.max(0, (state.needs.fatigue || 0) - 5);
        prep.umbrellaUses -= 1;
        StateManager.addMessage(
          "☂️ 雨伞挡住了风雨，疲劳感减轻了不少。（剩余" +
            Math.max(0, prep.umbrellaUses) +
            "次）",
          "info",
        );
        if (prep.umbrellaUses <= 0) {
          prep.umbrella = false;
          StateManager.addMessage(
            "☂️ 雨伞被风雨折腾坏了，需要重新准备。",
            "warning",
          );
        }
      }

      // 暖宝：寒冷天气健康保护
      if (prep.warmPack && isCold) {
        if (prep.warmPackUses == null) prep.warmPackUses = 2;
        if (state.status) {
          state.status.health = Math.min(100, (state.status.health || 100) + 3);
        }
        prep.warmPackUses -= 1;
        StateManager.addMessage(
          "🧣 暖宝让你在寒风中感到一丝温暖。（剩余" +
            Math.max(0, prep.warmPackUses) +
            "次）",
          "info",
        );
        if (prep.warmPackUses <= 0) {
          prep.warmPack = false;
          StateManager.addMessage(
            "🧣 保暖用品已经用尽，需要重新准备。",
            "warning",
          );
        }
      }
    },
  },

  // === 发型设计临时魅力衰减 ===
  {
    name: "hair_style_decay",
    fn: function (state) {
      var flags = state.flags || {};
      var boost = flags._hairStyleBoost || 0;
      if (boost <= 0 || !state.player) return;
      if (state.player.day === flags._hairStyleLastDay) return;
      var decay = Math.min(boost, 1);
      flags._hairStyleBoost = Math.max(0, boost - decay);
      state.player.charm = Math.max(0, (state.player.charm || 0) - decay);
      if (flags._hairStyleBoost <= 0) {
        StateManager.addMessage("💇 发型带来的魅力加成已经自然消退。", "info");
      }
    },
  },

  // === 天气→疾病风险（天气深化系统）===
  {
    name: "weather_illness_risk",
    fn: function (state) {
      if (typeof applyWeatherIllnessRisk === "function") {
        applyWeatherIllnessRisk(state);
      }
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
      // v3.1: 清明/中秋深度事件
      if (typeof checkFestivalDeepEvents === "function") {
        checkFestivalDeepEvents(state);
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
          state.chengguan.heat - 5 - Random.int(0, 4),
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

  // === 食材过期检查 ===
  {
    name: "ingredient_perish",
    after: ["day_increment"],
    fn: function (state) {
      if (!state.inventory || !state.inventory.items) return;
      var currentDay = state.player.day;
      var spoiled = [];
      var items = state.inventory.items;
      for (var i = items.length - 1; i >= 0; i--) {
        var item = items[i];
        if (!item.boughtDay || !item.perishDays) continue;
        // 检查食材是否在 items.js 中有 isIngredient 标记
        var itemDef =
          typeof getItemById === "function" ? getItemById(item.id) : null;
        if (!itemDef || !itemDef.isIngredient) continue;
        var age = currentDay - item.boughtDay;
        if (age >= item.perishDays) {
          spoiled.push({
            name: itemDef.name,
            icon: itemDef.icon || "📦",
            qty: item.qty || 1,
          });
          items.splice(i, 1);
        }
      }
      if (spoiled.length > 0) {
        var msg = "🥀 食材过期：";
        for (var si = 0; si < spoiled.length; si++) {
          msg +=
            spoiled[si].icon + spoiled[si].name + "×" + spoiled[si].qty + " ";
        }
        StateManager.addMessage(msg + "已变质扔掉。", "warning");
      }
    },
  },

  // === 交易商品变质（非食材：水果/蔬菜等易腐贸易品）===
  {
    name: "carry_perish",
    fn: function (state) {
      if (typeof tickPerishableGoods === "function") {
        tickPerishableGoods(state);
      }
    },
  },

  // === 装备耐久度磨损 ===
  {
    name: "durability_wear",
    fn: function (state) {
      if (typeof applyDailyWear === "function") {
        applyDailyWear(state);
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

  // === NPC桥接（事件后NPC回响 + 日常互动）===
  {
    name: "npc_bridge",
    fn: function (state) {
      if (typeof runDailyNpcBridge === "function") {
        runDailyNpcBridge(state);
      }
    },
  },

  // === v3.6 P0-2: 时代变迁每日演化 ===
  {
    name: "era_tick",
    fn: function (state) {
      if (typeof eraTick === "function") {
        eraTick(state);
      }
    },
  },

  // === v3.6 P0-3: 副业系统每日演化 ===
  {
    name: "side_hustle_tick",
    fn: function (state) {
      if (typeof sideHustleTick === "function") {
        sideHustleTick(state);
      }
    },
  },

  // === 道德后果检查 ===
  {
    name: "moral_consequences",
    fn: function (state) {
      if (typeof checkMoralConsequences === "function") {
        checkMoralConsequences(state);
      }
    },
  },

  // === Review P0-4：中产税事件 + P1-1：35岁危机 ===
  {
    name: "review_improvements_tick",
    fn: function (state) {
      if (typeof checkWealthTaxTick === "function") {
        checkWealthTaxTick(state);
      }
      if (typeof check35Crisis === "function") {
        check35Crisis(state);
      }
      if (typeof tickHealthFollowups === "function") {
        tickHealthFollowups(state);
      }
    },
  },

  // === v3.0 黑暗开局：道德良知回响检查 ===
  {
    name: "morality_echo",
    fn: function (state) {
      if (typeof checkMoralityEcho === "function") {
        checkMoralityEcho(state);
      }
    },
  },

  // === v3.1：主线章节检查 ===
  {
    name: "story_chapter_check",
    fn: function (state) {
      if (typeof checkStoryChapter === "function") {
        checkStoryChapter(state);
      }
    },
  },

  // === 三章结局路线效应 ===
  {
    name: "route_effects",
    fn: function (state) {
      if (typeof tickRouteEffects === "function") {
        tickRouteEffects(state);
      }
    },
  },

  // === v3.5 装备套装检测 ===
  {
    name: "equipment_suites_check",
    fn: function (state) {
      if (typeof checkEquipmentSuites === "function") {
        var suiteResults = checkEquipmentSuites(state);
        // 将套装结果存入 state 供渲染使用
        state.equipmentSuites = suiteResults;
      }
    },
  },

  // === v3.5 装备耐久消耗（每日工作后） ===
  {
    name: "equipment_durability_tick",
    fn: function (state) {
      if (typeof tickEquipmentDurability === "function") {
        tickEquipmentDurability(state);
      }
    },
  },

  // === v3.5 技能连携检测 ===
  {
    name: "skill_synergy_check",
    fn: function (state) {
      if (typeof checkSkillSynergies === "function") {
        var synergyResults = checkSkillSynergies(state);
        // 将连携结果存入 state 供渲染使用
        state.skillSynergies = synergyResults;
      }
    },
  },

  // === 新闻桥接（新闻→事件权重 + 价格情绪）===
  {
    name: "news_bridge",
    fn: function (state) {
      if (typeof runDailyNewsBridge === "function") {
        runDailyNewsBridge(state);
      }
    },
  },

  // === NPC 主动分享交易情报 ===
  {
    name: "npc_trade_info_share",
    fn: function (state) {
      if (typeof tryTriggerNPCInfoShare !== "function") return;
      // 遍历所有NPC，看是否有主动分享
      for (var npcId in NPC_TRADE_INFO) {
        if (!NPC_TRADE_INFO.hasOwnProperty(npcId)) continue;
        var infoText = tryTriggerNPCInfoShare(npcId, state);
        if (infoText) {
          var npc = getNpcById(npcId);
          var nameStr = npc ? npc.name : npcId;
          StateManager.addMessage(
            "💬 " + nameStr + "告诉你：" + infoText,
            "info",
          );
        }
      }
    },
  },

  // === v3.6 NPC关系链每日tick（蝴蝶效应传播）===
  {
    name: "npc_relationships_tick",
    fn: function (state) {
      if (typeof tickNpcRelationships === "function") {
        tickNpcRelationships(state);
      }
    },
  },

  // === v3.7 Expansion v1: 人生节点检查 ===
  {
    name: "life_node_check",
    fn: function (state) {
      if (typeof checkLifeNodes === "function") {
        checkLifeNodes(state);
      }
    },
  },

  // === v3.7 Expansion v1: 医疗系统每日tick ===
  {
    name: "medical_tick",
    fn: function (state) {
      if (typeof tickMedical === "function") {
        tickMedical(state);
      }
    },
  },

  // === v3.7 Expansion v1: 康复期tick ===
  {
    name: "recovery_tick",
    fn: function (state) {
      if (typeof tickRecovery === "function") {
        tickRecovery(state);
      }
    },
  },

  // === v3.7 Expansion v1: 旅行每日tick ===
  {
    name: "travel_tick",
    fn: function (state) {
      if (typeof tickTravel === "function") {
        tickTravel(state);
      }
    },
  },

  // === v3.7 Expansion v1: 法律系统每日tick ===
  {
    name: "legal_tick",
    fn: function (state) {
      if (typeof tickLegal === "function") {
        tickLegal(state);
      }
    },
  },

  // === v3.8 Web App bridge: 城市服务后续反馈 ===
  {
    name: "webapp_city_services_tick",
    fn: function (state) {
      if (
        typeof WebAppBridge !== "undefined" &&
        WebAppBridge &&
        typeof WebAppBridge.tickCityServices === "function"
      ) {
        WebAppBridge.tickCityServices(state);
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
  // 记录日始状态用于今日总结
  // v3.2 修复: _dayStartCash 在 day_increment 步骤中设置（正确捕获日初现金）
  // 此处仅记录健康/心情日始值（这些在管线中不变化）
  state.flags._dayStartHealth = (state.status && state.status.health) || 100;
  state.flags._dayStartHappiness = (state.needs && state.needs.happiness) || 0;

  for (var i = 0; i < DAILY_PIPELINE.length; i++) {
    var step = DAILY_PIPELINE[i];

    // 极端状态短路逻辑：
    // extreme_check / critical_punish 返回 'skip_day' 时，跳过后续非核心步骤
    // 但 finance / autosave / daily_report 始终执行
    // （v3.0 修复：daily_report 也加入始终执行列表，否则极端状态天玩家看不到收支报告）
    if (step.name === "extreme_check" || step.name === "critical_punish") {
      var result = step.fn(state);
      if (result === "skip_day") {
        StateManager.addMessage(
          "🌙 第" + state.player.day + "天在昏迷中过去了...",
          "danger",
        );
        // 执行最后的核心步骤：财务、收支报告、存档
        for (var j = i + 1; j < DAILY_PIPELINE.length; j++) {
          var lateStep = DAILY_PIPELINE[j];
          if (
            lateStep.name === "finance" ||
            lateStep.name === "lose" ||
            lateStep.name === "autosave" ||
            lateStep.name === "daily_report"
          ) {
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

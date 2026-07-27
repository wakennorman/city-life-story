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
      // v3.2 修复: 在日递增时记录现金作为日初值（正确基准）
      // 注意: 新游戏第1日需要在 startNewGame 等初始化函数中额外设置
      state.flags._dayStartCash = state.resources.cash || 0;
      // [全系统自洽修复] 域E 修复: 每日现金NaN防御（防止旧存档/投资异常导致现金永久损坏）
      if (isNaN(state.resources.cash) || !isFinite(state.resources.cash)) {
        state.resources.cash = 0;
        console.error("现金异常已重置为0");
      }
    },
  },

  // === P1-5 渐进式揭示：按天数里程碑解锁 UI 指标 ===
  {
    name: "progressive_unlock",
    fn: function (state) {
      var day = state.player.day;
      var hints = state.flags._unlockedHints;
      if (!hints) { state.flags._unlockedHints = hints = ["physique","intelligence","agility","mental","charm","morality","hunger","fatigue","hygiene","happiness","fame","cash","dailyGoal"]; }
      function unlockAll(arr) {
        var newUnlocks = [];
        for (var ui = 0; ui < arr.length; ui++) {
          if (hints.indexOf(arr[ui]) === -1) { hints.push(arr[ui]); newUnlocks.push(arr[ui]); }
        }
        return newUnlocks;
      }
      if (day === 3) {
        var u = unlockAll(["hunger","fatigue","happiness"]);
        if (u.length > 0 && typeof StateManager !== "undefined") {
          StateManager.addMessage("🔓 新指标解锁：你可以查看饥饿、疲劳和心情状态了。", "info");
        }
      }
      if (day === 5) {
        var u = unlockAll(["physique","intelligence","agility","mental","charm"]);
        if (u.length > 0 && typeof StateManager !== "undefined") {
          StateManager.addMessage("🔓 新指标解锁：属性面板（体质/智力/敏捷/心智/魅力）已开放。", "info");
        }
      }
      if (day === 7) {
        var u = unlockAll(["hygiene","morality","fame"]);
        if (u.length > 0 && typeof StateManager !== "undefined") {
          StateManager.addMessage("🔓 新指标解锁：卫生、道德和名气状态已开放。", "info");
        }
      }
      if (day === 10) {
        var u = unlockAll(["accountingIntel","reputationBadge","moralStatus"]);
        if (u.length > 0 && typeof StateManager !== "undefined") {
          StateManager.addMessage("🔓 新指标解锁：会计情报、声誉徽章和道德状态已开放。", "info");
        }
      }
      if (day === 15) {
        var u = unlockAll(["debtInfo"]);
        if (u.length > 0 && typeof StateManager !== "undefined") {
          StateManager.addMessage("🔓 新指标解锁：债务信息面板已开放。", "info");
        }
      }
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

  // === v3.4: 约定式触发槽（daily_start 时机）===
  {
    name: "trigger_slot_daily_start",
    fn: function (state) {
      if (!window.TriggerRegistry) return;
      if (!state || !state.player) return;
      if (state.player.day < 4) return;
      try {
        var event = window.TriggerRegistry.triggerRandom("daily_start", state);
        if (event) {
          // 延迟展示事件弹窗（避免阻塞管线执行）
          state._pendingEvent = event;
          state._pendingEventId = event.id;
          setTimeout(function () {
            var s = StateManager.getState();
            if (s._pendingEvent && s._pendingEventId === event.id) {
              if (typeof showEventModal === "function") {
                showEventModal(event);
              }
            }
          }, 50);
        }
      } catch (e) {
        console.warn("TriggerRegistry daily_start 触发失败:", e);
      }
    },
  },

  // === v3.23: 触发槽 — 随机遭遇（每日随机事件补充）===
  {
    name: "trigger_slot_random_encounter",
    fn: function (state) {
      if (!window.TriggerRegistry) return;
      if (!state || !state.player) return;
      if (state.player.day < 10) return;
      try {
        var event = window.TriggerRegistry.triggerRandom(
          "random_encounter",
          state,
        );
        if (event) {
          state._pendingEvent = event;
          state._pendingEventId = event.id;
          setTimeout(function () {
            var s = StateManager.getState();
            if (s._pendingEvent && s._pendingEventId === event.id) {
              if (typeof showEventModal === "function") showEventModal(event);
            }
          }, 50);
        }
      } catch (e) {
        console.warn("TriggerRegistry random_encounter 触发失败:", e);
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
      // [全系统自洽修复] 域G R240 A类修复: state.needs + state.housing 守卫（旧存档缺失→TypeError崩溃管线）
      if (!state.needs) state.needs = { hunger: 50, fatigue: 30, hygiene: 60, happiness: 50 };
      if (!state.housing) state.housing = { tier: 0, storageCapacity: 0, storageRented: false };
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
      // === D→G 联动: 社交支持→心情恢复 ===
      // 有亲密好友(好感≥60)的玩家每天获得额外心情恢复，模拟社交支持
      if (state.relationships) {
        var _closeFriends = 0;
        for (var _rid in state.relationships) {
          if (state.relationships[_rid] && (state.relationships[_rid].affinity || 0) >= 60) {
            _closeFriends++;
          }
        }
        if (_closeFriends >= 1) {
          var _socialBonus = Math.min(3, _closeFriends);
          state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + _socialBonus);
        }
      }
      // [R235 域E联动增强2] E→G 财富影响生活品质（净资产→疲劳/心情/健康调整）
      if (typeof _applyWealthQualityOfLifeR235 === "function") {
        _applyWealthQualityOfLifeR235(state);
      }
    },
  },

  // === 住房升级提示 ===
  {
    name: "housing_upgrade_hint",
    fn: function (state) {
      if (!state || !state.housing) return;
      try {
        var ct = state.housing.tier || 0;
        var ch = state.resources.cash || 0; // [全系统自洽修复] 域G A类: cash NaN守卫
        if (ct === 0 && ch >= 150) {
          if (typeof StateManager !== "undefined" && StateManager.addMessage) {
            StateManager.addMessage(
              "💡 你有 ¥" +
                ch +
                "，可以租个合租床位（¥150+¥12/天）改善睡眠和卫生。去城中村看看？",
              "info",
            );
          }
        } else if (ct === 1 && ch >= 800) {
          if (typeof StateManager !== "undefined" && StateManager.addMessage) {
            StateManager.addMessage(
              "💡 你有 ¥" +
                ch +
                "，单间（¥800+¥25/天）有独立空间，还能做饭洗澡。去城中村找房东？",
              "info",
            );
          }
        }
      } catch (e) {
        // 无头模式下静默失败
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
        if ((state.resources.cash || 0) >= rentAmount) { // [全系统自洽修复] 域G A类: cash NaN守卫
          state.resources.cash = (state.resources.cash || 0) - rentAmount;
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
          // [全系统自洽修复] 域G R240 A类修复: 驱逐时重置 storageCapacity（原逻辑保留旧 tier 的 storageCapacity，tier=0 却带 500 容量=数据不一致）
          state.housing.storageCapacity = 0;
          state.housing.storageRented = false;
          state.inventory.capacity = 20;
        }
      }
      if (
        state.housing &&
        state.housing.storageRented &&
        state.housing.storageCapacity > 0
      ) {
        var storageRent = state.housing.storageCapacity >= 500 ? 50 : 20;
        if ((state.resources.cash || 0) >= storageRent) { // [全系统自洽修复] 域G A类: cash NaN守卫
          state.resources.cash = (state.resources.cash || 0) - storageRent;
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
      // 露宿天数追踪（成就用）
      if ((state.housing.tier || 0) === 0) {
        state.flags._everHomeless = true;
        state.flags._homelessDays = (state.flags._homelessDays || 0) + 1;
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

  // === v3.23: 触发槽 — 每周 ===
  {
    name: "trigger_slot_weekly",
    fn: function (state) {
      if (!window.TriggerRegistry) return;
      if (!state || !state.player) return;
      if (state.player.day % 7 !== 0) return;
      try {
        var event = window.TriggerRegistry.triggerRandom("weekly", state);
        if (event) {
          state._pendingEvent = event;
          state._pendingEventId = event.id;
          setTimeout(function () {
            var s = StateManager.getState();
            if (s._pendingEvent && s._pendingEventId === event.id) {
              if (typeof showEventModal === "function") showEventModal(event);
            }
          }, 50);
        }
      } catch (e) {
        console.warn("TriggerRegistry weekly 触发失败:", e);
      }
    },
  },

  // === 习惯追踪 ===
  {
    name: "habit_tick",
    fn: function (state) {
      if (typeof tickHabits === "function") tickHabits(state);
      // 办公室工作天数追踪（职业病）
      if (typeof tickOfficeWorkDays === "function") tickOfficeWorkDays(state);
      // 体力劳动天数追踪（腰椎间盘突出等职业病）
      if (typeof tickManualLaborDays === "function") tickManualLaborDays(state);
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

  // [全系统自洽修复] 域G R248 联动增强(G→D): 健康危机→NPC好感衰减
  {
    name: "health_npc_affinity_decay",
    fn: function (state) {
      if (!state.status || !state.relationships) return;
      if (state.status.health < 30) {
        var _decay = -0.3;
        for (var _ni in state.relationships) {
          var _r = state.relationships[_ni];
          if (_r && _r.met) {
            _r.affinity = Math.max(-50, (_r.affinity || 0) + _decay);
          }
        }
      }
    },
  },

  // [全系统自洽修复] 域G R248 联动增强(G→E): 极端天气→投资市场情绪抑制
  {
    name: "weather_market_mood",
    fn: function (state) {
      if (!state.weather || !state.investment) return;
      var _extremeWeather = ["stormy", "snowy", "foggy", "cold_snap", "heatwave"];
      if (_extremeWeather.indexOf(state.weather.current) >= 0) {
        if (state.investment.stockMarket) {
          for (var _sk in state.investment.stockMarket) {
            var _stk = state.investment.stockMarket[_sk];
            if (_stk && typeof _stk.price === "number" && isFinite(_stk.price)) {
              _stk.price = _stk.price * 0.998;
            }
          }
        }
      }
    },
  },

  // [全系统自洽修复] 域G R248 联动增强(G→C): 连续工作健康预警提示
  {
    name: "career_health_advice",
    fn: function (state) {
      if (!state.career || !state.career.currentJob || !state.status) return;
      if (state.career.currentJob.workDays >= 90 && state.status.health < 50) {
        StateManager.addMessage("💼 长期高压工作正在侵蚀你的健康，建议适当休息或安排调休。", "warning");
      }
    },
  },

  // [全系统自洽修复] 域G R49 联动增强(G→C): 技能匹配职业发展提示
  {
    name: "skill_career_hint",
    fn: function (state) {
      if (!state.player || !state.skills || !state.player.job) return;
      var job = state.player.job;
      if (job === "unemployed" || job === "street_ragpicker") return;
      var topSkill = 0, topSkillKey = "";
      for (var _skk in state.skills) {
        var _slv = state.skills[_skk] && state.skills[_skk].level || 0;
        if (_slv > topSkill) { topSkill = _slv; topSkillKey = _skk; }
      }
      if (topSkill >= 30 && state.player.day % 30 === 0) {
        StateManager.addMessage("💡 你的" + (typeof getSkillChineseName === "function" ? getSkillChineseName(topSkillKey) : topSkillKey) + "技能已达到Lv." + topSkill + "，看看有没有更适合你的工作机会？", "info");
      }
    },
  },

  // [全系统自洽修复] 域G R49 联动增强(G→D): 社交关系缓解疲劳
  {
    name: "social_fatigue_relief",
    fn: function (state) {
      if (!state.needs || !state.relationships) return;
      var _closeCount = 0;
      for (var _rid2 in state.relationships) {
        if (state.relationships[_rid2] && (state.relationships[_rid2].affinity || 0) >= 60) {
          _closeCount++;
        }
      }
      if (_closeCount >= 2 && state.needs.fatigue > 30) {
        var _relief = Math.min(5, _closeCount);
        state.needs.fatigue = Math.max(0, (state.needs.fatigue || 0) - _relief);
        if (state.player.day % 7 === 0 && _closeCount >= 3) {
          StateManager.addMessage("🤗 有朋友真好——和" + _closeCount + "位好友的交往让你感到身心放松。", "success");
        }
      }
    },
  },

  // [全系统自洽修复] 域G R49 联动增强(G→E): 财富里程碑生活品质
  {
    name: "wealth_milestone_happiness",
    fn: function (state) {
      if (!state.resources || !state.needs) return;
      var _netWorth = (state.resources.cash || 0) + (state.resources.bankBalance || 0);
      var _milestone = 0;
      if (_netWorth >= 500000) _milestone = 500000;
      else if (_netWorth >= 200000) _milestone = 200000;
      else if (_netWorth >= 100000) _milestone = 100000;
      else if (_netWorth >= 50000) _milestone = 50000;
      if (_milestone > 0 && !state.flags["_wealth_ms_" + _milestone]) {
        state.flags["_wealth_ms_" + _milestone] = true;
        state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 3);
        StateManager.addMessage("💰 净资产突破¥" + _milestone.toLocaleString() + "！财富积累让生活更有底气。", "success");
      }
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

  // === v3.1 第39轮：街坊声望衰减 ===
  {
    name: "reputation_decay",
    fn: function (state) {
      if (typeof decayReputation === "function") {
        decayReputation(state);
      }
    },
  },

  // === v3.1 第41轮：人生抉择检查 ===
  {
    name: "life_decision_check",
    fn: function (state) {
      if (typeof checkLifeDecision === "function") {
        checkLifeDecision(state);
      }
    },
  },

  // === v3.1 新机制：命运抉择卡（每 30 天一次高 stakes 选择） ===
  {
    name: "crossroads_tick",
    fn: function (state) {
      if (typeof crossroadsTick === "function") {
        crossroadsTick(state);
      }
    },
  },

  // === v3.1 第41轮：摊位合伙收入 + 店铺收入 ===
  {
    name: "stall_income",
    fn: function (state) {
      if (typeof getStallIncome === "function") {
        var income = getStallIncome(state);
        if (income > 0) {
          state.resources.cash = (state.resources.cash || 0) + income;
          state.resources.totalEarned =
            (state.resources.totalEarned || 0) + income;
          addDailyTransaction(
            state,
            "income",
            "stall_partnership",
            income,
            "摊位合伙分成",
          );
        }
      }
      if (typeof getShopIncome === "function") {
        var shopIncome = getShopIncome(state);
        if (shopIncome > 0) {
          state.resources.cash = (state.resources.cash || 0) + shopIncome;
          state.resources.totalEarned =
            (state.resources.totalEarned || 0) + shopIncome;
          addDailyTransaction(
            state,
            "income",
            "shop",
            shopIncome,
            "店铺日收入",
          );
        }
      }
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
      var totalAsset =
        (state.resources.cash || 0) + (state.resources.bankBalance || 0);
      state.flags._cashHistory.push({
        day: state.player.day,
        value: totalAsset,
      });
      if (state.flags._cashHistory.length > 90) {
        state.flags._cashHistory = state.flags._cashHistory.slice(-90);
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
      if (state.history.income.length > 90) {
        state.history.income = state.history.income.slice(-90);
        state.history.expense = state.history.expense.slice(-90);
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
      // [全系统自洽修复] 域A R387 联动增强: A→B 价格波动叙事(每3天报告一次主要商品价格变动)
      if (state.player.day % 3 === 0 && state.trade && state.trade.goodsPrices && state.flags) {
        var _priceNews = [];
        for (var _pl in state.trade.goodsPrices) {
          if (!state.trade.goodsPrices.hasOwnProperty(_pl)) continue;
          var _goods = state.trade.goodsPrices[_pl];
          if (!_goods) continue;
          for (var _gid in _goods) {
            if (!_goods.hasOwnProperty(_gid) || _priceNews.length >= 3) continue;
            var _cp = _goods[_gid];
            if (typeof _cp !== "number" || !isFinite(_cp)) continue;
            var _bp = typeof GOODS !== "undefined" && GOODS[_gid] ? GOODS[_gid].basePrice : 0;
            if (_bp > 0) {
              var _ratio = _cp / _bp;
              if (_ratio > 1.5) {
                _priceNews.push("📈 " + _gid + "价格飙升" + Math.round((_ratio - 1) * 100) + "%");
              } else if (_ratio < 0.6) {
                _priceNews.push("📉 " + _gid + "价格暴跌" + Math.round((1 - _ratio) * 100) + "%");
              }
            }
          }
        }
        if (_priceNews.length > 0 && Random.chance(0.4)) {
          StateManager.addMessage("🏪 市场行情：" + _priceNews.join("，"), "info");
        }
      }
    },
  },

  // === 市场事件（供需随机波动 + 每日价格冲击）===
  {
    name: "pricing_market",
    fn: function (state) {
      if (typeof checkMarketEvents === "function") checkMarketEvents(state);
      if (typeof decaySupplyDemand === "function") decaySupplyDemand(state);
      // 路线使用衰减（每3天减1次使用记录，让旧路线恢复吸引力）
      if (state.trade && state.trade._routeUsage && state.player && state.player.day % 3 === 0) {
        for (var _rKey in state.trade._routeUsage) {
          if (state.trade._routeUsage[_rKey] > 0) {
            state.trade._routeUsage[_rKey]--;
            if (state.trade._routeUsage[_rKey] <= 0) delete state.trade._routeUsage[_rKey];
          }
        }
      }
      if (typeof tickDailyPriceShocks === "function")
        tickDailyPriceShocks(state);
    },
  },
  // [全系统自洽修复] 域A 联动增强#1: 每日经济结算（累进财富税/动态利率/市场饱和度）
  // 联动: A→G 核心机制 — 将 economy_v3.1.js 的 dailyEconomicSettlement 接入 pipeline
  {
    name: "economic_settlement",
    fn: function (state) {
      if (typeof EconomySystem !== "undefined" && EconomySystem.dailyEconomicSettlement) {
        var result = EconomySystem.dailyEconomicSettlement(state);
        if (result && result.wealthTax > 0) {
          state.resources.cash = Math.max(0, (state.resources.cash || 0) - result.wealthTax);
        }
      }
    },
  },

  // === 投资tick ===
  {
    name: "investment_tick",
    fn: function (state) {
      tickInvestmentDaily(state);
      // [R235 域E联动增强1] E→B 市场异动叙事（股票波动≥5%触发新闻事件）
      if (typeof _checkMarketVolatilityR235 === "function") {
        _checkMarketVolatilityR235(state);
      }
    },
  },

  // [全系统自洽修复] 域E A类缺陷: tickPropertyMarket 定义但从未被调用，房产价格永不更新
  {
    name: "property_market_tick",
    fn: function (state) {
      if (typeof tickPropertyMarket === "function") tickPropertyMarket(state);
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

  // === v3.23: 触发槽 — 每月 ===
  {
    name: "trigger_slot_monthly",
    fn: function (state) {
      if (!window.TriggerRegistry) return;
      if (!state || !state.player) return;
      if (state.player.day % 30 !== 0) return;
      try {
        var event = window.TriggerRegistry.triggerRandom("monthly", state);
        if (event) {
          state._pendingEvent = event;
          state._pendingEventId = event.id;
          setTimeout(function () {
            var s = StateManager.getState();
            if (s._pendingEvent && s._pendingEventId === event.id) {
              if (typeof showEventModal === "function") showEventModal(event);
            }
          }, 50);
        }
      } catch (e) {
        console.warn("TriggerRegistry monthly 触发失败:", e);
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

  // === 域C联动: 职业倦怠→健康损耗 (C→G) ===
  // 长期高压工作积累的职业倦怠(burnout)开始侵蚀健康——反映真实打工人的慢性病风险
  {
    name: "career_burnout_health_bleed",
    fn: function (state) {
      // [全系统自洽修复] 域C联动: 职业倦怠接入健康子系统
      if (!state) return;
      if (state.player && state.player.phase === "street") return;
      var cap = state.careerCapital || {};
      var burnout = cap.burnout || 0;
      if (burnout < 60) return; // 倦怠值<60不触发（正常范围）
      var bleed = Math.floor((burnout - 60) / 20); // 60→0, 80→1, 100→2
      if (bleed <= 0) return;
      if (typeof StateManager === "undefined") return;
      // 健康损耗（status.health 或 stats.health）
      var healthPath = state.status && typeof state.status.health === "number"
        ? state.status
        : (state.stats && typeof state.stats.health === "number" ? state.stats : null);
      if (healthPath) {
        var before = healthPath.health;
        healthPath.health = Math.max(0, before - bleed);
      }
      // 仅在严重时推送消息（避免刷屏）
      if (burnout >= 80 && bleed >= 1 && state.player && state.player.day % 7 === 0) {
        StateManager.addMessage(
          "😰 连续高压工作，身体亮起红灯。健康-" + bleed + "，倦怠值" + burnout,
          "warning"
        );
      }
    },
  },

  // === C→G 联动: 职业稳定→心情恢复 ===
  // 有稳定工作(>30天)的玩家每天获得微量心情恢复，体现职业安全感
  {
    name: "career_stability_happiness",
    fn: function (state) {
      if (!state || !state.player) return;
      if (state.player.phase === "street") return;
      var job = state.career && state.career.currentJob;
      if (!job || !job.workDays) return;
      if (job.workDays < 30) return;
      var bonus = Math.min(3, Math.floor(job.workDays / 180) + 1);
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + bonus);
    },
  },

  // === E→G 联动: 投资收入→心情增益 ===
  // 有投资分红/租金收入的玩家获得微量心情提升，体现财务安全感
  {
    name: "investment_income_happiness",
    fn: function (state) {
      if (!state || !state.investment) return;
      var inv = state.investment;
      var hasIncome = false;
      if (inv.dividendDay && inv.dividendDay === state.player.day) hasIncome = true;
      if (inv.rentalIncome && inv.rentalIncome > 0) hasIncome = true;
      if (inv.lastDividend && inv.lastDividend > 0) hasIncome = true;
      // [全系统自洽修复] 域E A类修复: state.needs 守卫(防止旧存档崩溃)
      if (hasIncome && state.needs) {
        state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 2);
      }
      // [全系统自洽修复] 域E R383 联动增强: E→G 投资组合市值影响日常心情(财务安全感)
      if (state.needs && state.investment.portfolio) {
        var _pv = state.investment.portfolio.totalValue || 0;
        if (_pv >= 1000000) {
          state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 1);
        } else if (_pv >= 500000) {
          // 每3天+1心情(不每天叠加)
          if (state.player.day % 3 === 0) {
            state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 1);
          }
        }
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

  // === 外观维持（发型衰减 + 整容保养提醒） ===
  {
    name: "appearance_maintenance",
    fn: function (state) {
      var flags = state.flags || (state.flags = {});
      var day = state.player ? state.player.day : 0;
      // 发型设计：每日衰减1点魅力，直到衰减完毕
      if (flags._groomingBonus && flags._groomingBonus > 0) {
        flags._groomingBonus = Math.max(0, flags._groomingBonus - 1);
        if (flags._groomingBonus === 0) {
          // 魅力回降（已通过每日-1衰减回原始值）
          if (typeof StateManager !== "undefined" && day % 5 === 0) {
            StateManager.addMessage(
              "💇 发型效果已消退，魅力回到自然状态。",
              "info",
            );
          }
        }
      }
      // 整容保养提醒：90天后提示需要维护
      if (flags._lastSurgeryDay && day > 0) {
        var daysSinceSurgery = day - flags._lastSurgeryDay;
        if (daysSinceSurgery > 85 && daysSinceSurgery <= 90 && day % 5 === 0) {
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage(
              "💉 上次整容已过去" +
                daysSinceSurgery +
                "天，建议去医院做保养维护。",
              "info",
            );
          }
        }
        if (daysSinceSurgery > 90) {
          // 超过90天未保养，魅力缓慢衰减（每10天-1）
          var decayTotal = Math.floor((daysSinceSurgery - 90) / 10);
          if (decayTotal > 0) {
            var p = state.player || {};
            if (p.charm) {
              p.charm = Math.min(100, Math.max(0, p.charm - decayTotal));
            }
          }
        }
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
      // [R240 域G联动增强1] G→B 极端天气叙事（heatwave/coldwave/storm/snow 触发事件）
      if (typeof _checkExtremeWeatherNarrativeR240 === "function") {
        _checkExtremeWeatherNarrativeR240(state);
      }
      // [全系统自洽修复] 域G R385 联动增强: G→B 每日天气叙事(温和天气也提供风味文本)
      if (state.weather && state.weather.current && state.player.day > 1) {
        var _weatherNarratives = {
          sunny: "☀️ 阳光明媚，整座城市都亮了起来。",
          cloudy: "⛅ 云层遮住了部分阳光，不冷不热刚刚好。",
          rainy: "🌧️ 细雨绵绵，空气里弥漫着潮湿的泥土味。",
          stormy: "⛈️ 暴雨如注，街上的行人匆匆躲避。",
          windy: "🌬️ 大风刮起，树叶沙沙作响。",
          snowy: "❄️ 雪花飘落，城市被一层白色覆盖。",
          foggy: "🌫️ 大雾弥漫，远处的建筑若隐若现。",
          hot: "🌞 烈日当空，柏油路面泛着热浪。",
          cold_snap: "🥶 寒潮来袭，冷得让人直打哆嗦。",
          heatwave: "🔥 酷暑难耐，蝉鸣声此起彼伏。",
          heavy_rain: "🌊 暴雨倾盆，路面积水严重。",
          plum_rain: "🌦️ 梅雨时节，空气潮湿得能拧出水来。"
        };
        var _wn = _weatherNarratives[state.weather.current];
        if (_wn && Random.chance(0.3)) {
          StateManager.addMessage(_wn, "narrative");
        }
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
        state.needs.fatigue = Math.max(0, (state.needs.fatigue || 0) - 5);
        StateManager.addMessage(
          "☂️ 雨伞挡住了风雨，疲劳感减轻了不少。",
          "info",
        );
      }

      // 暖宝：寒冷天气健康保护
      if (prep.warmPack && isCold) {
        if (state.status) {
          state.status.health = Math.min(100, (state.status.health || 100) + 3);
        }
        StateManager.addMessage("🧣 暖宝让你在寒风中感到一丝温暖。", "info");
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

  // === R15: 副业副手 — 每日副业收入 + 倦怠累积 ===
  {
    name: "side_skill_daily",
    fn: function (state) {
      if (!state.flags || !state.flags._sideSkillActive) return;
      var startDay = state.flags._sideSkillDay || 0;
      if (state.player.day - startDay < 1) return;
      // 每日副业固定收益
      var earn = Random.int(60, 120);
      state.resources.cash = (state.resources.cash || 0) + earn;
      // 倦怠累积
      state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 2);
      // 每5天提醒一次（避免消息刷屏）
      if ((state.player.day - startDay) % 5 === 0) {
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage(
            "💼 副业副手第" +
              (state.player.day - startDay) +
              "天。今天赚了¥" +
              earn +
              "，但身体在记账。注意倦怠值，适度休息。",
            "info",
          );
        }
      }
    },
  },

  // === R15: 合法摊位经营许可证 — 城管热度上限提升 ===
  {
    name: "legal_vendor_heat_cap",
    fn: function (state) {
      if (!state.flags || !state.flags._legalVendor) return;
      if (!state.chengguan) return;
      // 合法摊位热度上限 60（原本无经营许可 100 满值巡逻）
      if (state.chengguan.heat > 60) {
        state.chengguan.heat = 60;
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

  // [R238 域F联动增强1] F→B 事件结果可视化（消息中的数值自动着色+图标）
  {
    name: "message_visual_tick",
    fn: function (state) {
      if (typeof _applyMessageVisualEnhancementR238 === "function") {
        _applyMessageVisualEnhancementR238(state);
      }
    },
  },

  // [R238 域F联动增强2] F→G 状态预警系统（需求/健康/现金危险阈值检测）
  {
    name: "status_alert_tick",
    fn: function (state) {
      if (typeof _updateStatusAlertsR238 === "function") {
        _updateStatusAlertsR238(state);
      }
    },
  },

  // [R241 域H联动增强1] H→B 公司里程碑叙事（营收突破阈值触发庆祝事件）
  {
    name: "company_milestone_tick",
    fn: function (state) {
      if (typeof _checkCompanyMilestoneR241 === "function") {
        _checkCompanyMilestoneR241(state);
      }
    },
  },

  // [R241 域H联动增强2] H→G 创业者健康压力（负债/低现金流/KPI影响健康）
  {
    name: "founder_health_stress_tick",
    fn: function (state) {
      if (typeof _checkFounderHealthStressR241 === "function") {
        _checkFounderHealthStressR241(state);
      }
    },
  },

  // [R240 域G联动增强2] G→C 健康影响职业提醒（生病/受伤时的工作建议）
  {
    name: "health_career_advice_tick",
    fn: function (state) {
      if (typeof _checkHealthCareerAdviceR240 === "function") {
        _checkHealthCareerAdviceR240(state);
      }
    },
  },

  // [R240 域G联动增强3] G→D 人生事件社交回响（搬家/康复/创业等NPC回应）
  {
    name: "life_event_social_echo_tick",
    fn: function (state) {
      if (typeof _checkLifeEventSocialEchoR240 === "function") {
        _checkLifeEventSocialEchoR240(state);
      }
    },
  },

  // === v3.24: 连续工作 Streak 检查 + 里程碑奖励 ===
  {
    name: "work_streak_check",
    fn: function (state) {
      if (!state.flags) return;
      var streak = state.flags._workStreak || 0;
      var workedToday = state.flags._workedToday;
      var lastDay = state.flags._lastWorkDay || 0;

      // 本日没有工作：中断连续
      if (!workedToday && streak > 0 && lastDay < state.player.day) {
        // 只有之前有连续工作时才显示中断消息
        if (streak >= 3) {
          StateManager.addMessage(
            "📉 连续工作" + streak + "天的记录中断了...明天重新开始吧。",
            "warning",
          );
        }
        state.flags._workStreak = 0;
        state.flags._lastWorkDay = 0;
      }

      // 里程碑奖励（仅首次达到时发放）
      if (streak > 0 && !state.flags._workStreakMilestones) {
        state.flags._workStreakMilestones = {};
      }
      var ms = state.flags._workStreakMilestones || {};

      // 连续5天 → 小奖金
      if (streak >= 5 && !ms[5]) {
        ms[5] = true;
        var bonus5 = 200;
        state.resources.cash = (state.resources.cash || 0) + bonus5;
        StateManager.addMessage(
          "🎉 连续工作5天！全勤奖金 ¥" + bonus5 + "！",
          "success",
        );
      }
      // 连续10天 → 额外奖金 + 心情奖励
      if (streak >= 10 && !ms[10]) {
        ms[10] = true;
        var bonus10 = 500;
        state.resources.cash = (state.resources.cash || 0) + bonus10;
        state.needs.happiness = Math.min(
          100,
          (state.needs.happiness || 50) + 5,
        );
        StateManager.addMessage(
          "🔥 连续工作10天！勤劳奖励 ¥" + bonus10 + "，心情+5！",
          "success",
        );
      }
      // 连续30天 → 大额奖金
      if (streak >= 30 && !ms[30]) {
        ms[30] = true;
        var bonus30 = 2000;
        state.resources.cash = (state.resources.cash || 0) + bonus30;
        StateManager.addMessage(
          "💪 连续工作30天！毅力可嘉！全勤大奖 ¥" + bonus30 + "！",
          "success",
        );
      }
      // 连续100天 → 里程碑奖金 + 永久称号
      if (streak >= 100 && !ms[100]) {
        ms[100] = true;
        var bonus100 = 10000;
        state.resources.cash = (state.resources.cash || 0) + bonus100;
        state.flags._streakMaster = true; // 永久称号标记
        StateManager.addMessage(
          "👑 连续工作100天！你是真正的劳动模范！终身成就奖 ¥" +
            bonus100 +
            "！",
          "success",
        );
        StateManager.addMessage(
          "🏅 获得称号「劳动模范」：你永不退缩的精神感染了所有人。",
          "success",
        );
      }

      state.flags._workStreakMilestones = ms;

      // 清理今日工作标记（为下一天做准备）
      delete state.flags._workedToday;
    },
  },

  // === v3.23: 触发槽 — 每日中点（清理后）===
  {
    name: "trigger_slot_daily_mid",
    fn: function (state) {
      if (!window.TriggerRegistry) return;
      if (!state || !state.player) return;
      try {
        var event = window.TriggerRegistry.triggerRandom("daily_mid", state);
        if (event) {
          state._pendingEvent = event;
          state._pendingEventId = event.id;
          setTimeout(function () {
            var s = StateManager.getState();
            if (s._pendingEvent && s._pendingEventId === event.id) {
              if (typeof showEventModal === "function") showEventModal(event);
            }
          }, 50);
        }
      } catch (e) {
        console.warn("TriggerRegistry daily_mid 触发失败:", e);
      }
    },
  },

  // === 年龄增长（玩家 + 父母同步衰老）===
  {
    name: "age",
    fn: function (state) {
      if (state.player.day % 365 === 0) {
        state.player.age++;
        StateManager.addMessage(
          "🎂 又过了一年，你现在" + state.player.age + "岁了。",
          "event",
        );
        // v3.22: 父母同步衰老（家庭事件系统需要 age 驱动）
        if (state.family && state.family.parents) {
          if (state.family.parents.father) {
            state.family.parents.father.age++;
          }
          if (state.family.parents.mother) {
            state.family.parents.mother.age++;
          }
        }
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

  // === v3.22: 房贷计时（剩余还款天数递减）===
  {
    name: "family_mortgage_tick",
    fn: function (state) {
      if (
        state.family &&
        state.family.mortgage &&
        state.family.mortgage.remainingDays > 0
      ) {
        // 每30天为一个月供周期：remainingDays - 30，并标记逾期
        if (state.player.day % 30 === 0) {
          state.family.mortgage.remainingDays = Math.max(
            0,
            (state.family.mortgage.remainingDays || 0) - 30,
          );
          // 如果玩家现金不足以支付月供，标记逾期（事件触发条件）
          if (
            (state.resources.cash || 0) <
            (state.family.mortgage.monthlyPayment || 3500)
          ) {
            state.family.mortgage.late = true;
          } else {
            state.family.mortgage.late = false;
          }
        }
      }
    },
  },

  // === 自动存档 ===
  {
    name: "autosave",
    fn: function (state) {
      autoSave();
    },
  },

  // === v3.6: 约定式触发槽（daily_end 时机）===
  {
    name: "trigger_slot_daily_end",
    fn: function (state) {
      if (!window.TriggerRegistry) return;
      if (!state || !state.player) return;
      if (state.player.day < 7) return;
      try {
        var event = window.TriggerRegistry.triggerRandom("daily_end", state);
        if (event) {
          state._pendingEvent = event;
          state._pendingEventId = event.id;
          setTimeout(function () {
            var s = StateManager.getState();
            if (s._pendingEvent && s._pendingEventId === event.id) {
              if (typeof showEventModal === "function") {
                showEventModal(event);
              }
            }
          }, 100);
        }
      } catch (e) {
        console.warn("TriggerRegistry daily_end 触发失败:", e);
      }
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

  // === v3.27 增强版结束日志：早安仪式 + 每日热招 ===
  {
    name: "end_log",
    fn: function (state) {
      var day = state.player.day;
      var weekDay = ((day - 1) % 7) + 1; // 1=周一 ... 7=周日
      var weekdayNames = [
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
        "周日",
      ];
      var streak = state.flags._workStreak || 0;
      var health = (state.status && state.status.health) || 100;

      // 1. 早安仪式 + 星期
      var greetMsg = "🌅 第" + day + "天 · " + weekdayNames[weekDay - 1];
      if (day === 1) greetMsg += " · 第一天，加油！";
      else if (day === 7) greetMsg += " · 来这座城市一周了";
      else if (day === 30) greetMsg += " · 一个月整！你还在坚持";
      else if (day === 100) greetMsg += " · 💪 百天不倒！";
      else if (day === 365) greetMsg += " · 🌟 一整年！从零到今天";
      StateManager.addMessage(greetMsg, "info");

      // 2. 连续工作提醒 + 目标梯度效应
      if (streak >= 3) {
        var se =
          streak >= 100
            ? "👑"
            : streak >= 30
              ? "💪"
              : streak >= 10
                ? "🔥"
                : "📋";
        StateManager.addMessage(se + " 已连续工作" + streak + "天", "hint");
        // 距离下一个里程碑（目标梯度效应）
        var milestones = [5, 10, 30, 100];
        var msData = state.flags._workStreakMilestones || {};
        var nextMS = null;
        for (var mi = 0; mi < milestones.length; mi++) {
          if (streak < milestones[mi] && !msData[milestones[mi]]) {
            nextMS = milestones[mi];
            break;
          }
        }
        if (nextMS) {
          var daysLeft = nextMS - streak;
          var msReward =
            nextMS === 5
              ? "¥200"
              : nextMS === 10
                ? "¥500"
                : nextMS === 30
                  ? "¥2,000"
                  : "¥10,000";
          StateManager.addMessage(
            "🎯 距离连续" +
              nextMS +
              "天奖励（" +
              msReward +
              "）还有" +
              daysLeft +
              "天！",
            "hint",
          );
        }
      }

      // 3. 紧急状态预警（损失厌恶）
      if (health < 20) {
        StateManager.addMessage("🚑 健康危急！今天请务必去医院！", "danger");
      } else if (health < 40) {
        StateManager.addMessage("😷 身体不太舒服，今天注意休息。", "warning");
      }
      if ((state.needs.fatigue || 0) > 80) {
        StateManager.addMessage(
          "😩 非常疲劳！今天少干点活，多休息。",
          "warning",
        );
      }

      // 4. 每日热招（稀缺性原理）— 仅限街头阶段
      if (
        state.player.phase === "street" &&
        day >= 3 &&
        Random.chance(0.35) &&
        typeof STREET_JOBS !== "undefined" &&
        STREET_JOBS.length > 0
      ) {
        var pool = [];
        for (var ji = 0; ji < STREET_JOBS.length; ji++) {
          var sj = STREET_JOBS[ji];
          if (sj && sj.id && sj.id !== "none") pool.push(sj);
        }
        if (pool.length > 0) {
          var hotJob = pool[Random.int(0, pool.length - 1)];
          var bonusMult = 1.3 + Random.float(0, 0.3);
          state.flags._dailyHotJob = {
            jobId: hotJob.id,
            bonusMult: Math.round(bonusMult * 100) / 100,
          };
          StateManager.addMessage(
            "🔥 今日热招：" +
              hotJob.name +
              (LOCATIONS[hotJob.location]
                ? "（" + LOCATIONS[hotJob.location].name + "）"
                : "") +
              "！工价×" +
              bonusMult.toFixed(1) +
              "，仅限今天！",
            "event",
          );
        }
      } else {
        delete state.flags._dailyHotJob;
      }

      // 5. 保留原有日终总结
      StateManager.addMessage("🌙 第" + day + "天开始。", "info");
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

  // === 装备耐久预警（耐久<20%时发送警告）===
  {
    name: "durability_warning",
    fn: function (state) {
      if (!state.inventory || !state.inventory.equipment) return;
      if (typeof getEquippedInstance !== "function") return;
      var warned = false;
      var slots = ["head", "body", "feet", "hand", "accessory"];
      for (var si = 0; si < slots.length; si++) {
        var slot = slots[si];
        var inst = getEquippedInstance(state, slot);
        if (!inst || inst.durability === undefined || inst.isBroken) continue;
        var pct = inst.durability / (inst.maxDurability || 100);
        if (pct < 0.2) {
          if (!warned) {
            StateManager.addMessage(
              "⚠️ 你的部分装备耐久已不足20%，尽快修理！",
              "warning",
            );
            warned = true;
          }
        }
        if (inst.isBroken) {
          StateManager.addMessage(
            "🔧 " + (inst.name || slot) + " 已损坏，需要修理才能使用。",
            "danger",
          );
        }
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

  // === v3.6 P0-1: NPC关系网每日演化 ===
  {
    name: "npc_relationships_tick",
    fn: function (state) {
      // [全系统自洽修复] 域D A类#1: npcRelationshipsTick 不存在，修正为 tickNpcRelationships
      if (typeof tickNpcRelationships === "function") {
        tickNpcRelationships(state);
      }
      // [R238 域F联动增强3] F→D NPC拜访提示（可拜访/即将衰减提醒）
      if (typeof _updateNpcVisitRemindersR238 === "function") {
        _updateNpcVisitRemindersR238(state);
      }
      // [R241 域H联动增强3] H→D 成功社交回响（公司成功后NPC主动联系）
      if (typeof _checkSuccessSocialRippleR241 === "function") {
        _checkSuccessSocialRippleR241(state);
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

  // === v3.1: 经济平衡调参（累进财富税/动态利率/难度收入曲线）===
  {
    name: "economy_v3_tick",
    fn: function (state) {
      if (typeof window === "undefined" || !window.EconomySystem) return;
      var eco = window.EconomySystem;
      // [全系统自洽修复] 域G A类修复: _allJobsBonus 每日乘法累积导致指数衰减/增长。
      // 改为只在首次或乘数变化时设置一次，避免逐日复合（例如困难模式0.9^30≈0.042）。
      // 用 _allJobsBonusBaseDay 标记已设置的轮次，防止每日重复覆写
      if (state._difficulty && state._difficulty !== "normal") {
        var incomeMult = eco.getDifficultyIncomeMultiplier(
          state._difficulty,
          "baseSalaryMult",
        );
        if (incomeMult !== 1.0) {
          var optimal = incomeMult;
          // 仅在首次设置当前值，不做每日复合
          if (state._allJobsBonusBase !== state._difficulty) {
            state._allJobsBonus = state._allJobsBonus || 1.0;
            // 用目标值覆写，而非乘法累积
            state._allJobsBonus = optimal;
            state._allJobsBonusBase = state._difficulty;
          }
        }
      }
      // 中后期财富税（仅当总资产≥¥20万且不是休闲模式）
      // 总资产 = 现金 + 银行存款 + 投资持仓市值（股票/BTC/贵金属/房产等）
      var totalAssets =
        (state.resources.cash || 0) + (state.resources.bankBalance || 0);
      if (typeof getInvestmentAssetSnapshot === "function") {
        try {
          var snap = getInvestmentAssetSnapshot(state);
          if (snap && snap.investmentValue) {
            totalAssets += snap.investmentValue;
          }
        } catch (e) {
          // 投资快照不可用时忽略
        }
      }
      if (
        totalAssets >= 200000 &&
        state._difficulty !== "casual" &&
        state._difficulty !== "easy"
      ) {
        var diff = state._difficulty || "normal";
        var wealthTax = eco.calculateProgressiveWealthTax(totalAssets, diff);
        if (wealthTax > 0 && state.player && state.player.day > 30) {
          state.resources.cash = Math.max(
            0,
            (state.resources.cash || 0) - wealthTax,
          );
          addDailyTransaction(
            state,
            "expense",
            "wealth_tax",
            wealthTax,
            "累进财富税",
          );
        }
      }
    },
  },

  // === v3.1: 社交网络系统（每日微博热搜/网红收入/舆论危机）===
  {
    name: "social_network_tick",
    fn: function (state) {
      if (typeof tickSocialNetwork === "function") {
        tickSocialNetwork(state);
      }
    },
  },

  // === [全系统自洽修复] 域C/域A: 职业里程碑延迟兑现检查 ===
  {
    name: "career_milestone_deferred_rewards",
    fn: function (state) {
      var day = state.player.day;
      // 家教90天奖金
      if (
        state.flags._pendingGaokaoBonus &&
        day >= state.flags._pendingGaokaoBonus
      ) {
        state.flags._pendingGaokaoBonus = 0;
        state.resources.cash = (state.resources.cash || 0) + 24000;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage(
            "🎓 家教学员的家长打来了尾款！高考辅导费¥24000到账！",
            "success",
          );
        }
      }
      // 摆摊30天还款
      if (state.flags._loanToLaoGuan && day >= state.flags._loanToLaoGuan) {
        state.flags._loanToLaoGuan = 0;
        state.resources.cash = (state.resources.cash || 0) + 1000;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage(
            "💰 老关把当初借的¥800还了，还多给了¥200利息！",
            "success",
          );
        }
      }
      // 废品回收重新报价
      if (
        state.flags._wasteRecyclingOffer &&
        day >= state.flags._wasteRecyclingOffer
      ) {
        state.flags._wasteRecyclingOffer = 0;
        state.flags._wasteRecyclingReady = true;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage(
            "♻️ 老张的废品承包权又开放了——带上¥3000去找他吧。",
            "info",
          );
        }
      }
      // 职业遗产项目90天结算
      if (
        state.flags._careerLegacyDueDay &&
        day >= state.flags._careerLegacyDueDay
      ) {
        state.flags._careerLegacyDueDay = 0;
        var _legacySuccess = Random.chance(0.6);
        if (_legacySuccess) {
          state.resources.cash = (state.resources.cash || 0) + 100000;
          state.player.fame = Math.min(100, (state.player.fame || 0) + 20);
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage(
              "🏆 你主导的行业里程碑项目大获成功！声誉+20，奖金¥100000到账！",
              "success",
            );
          }
        } else {
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage(
              "😔 你主导的项目最终没有达到预期。虽然没有达成目标，但这段经历让你成长了不少。",
              "info",
            );
          }
        }
      }
      // [全系统自洽修复] 域E 修复:贷款逾期90天警告
      if (
        (state.resources.bankDebt || 0) > 0 &&
        state.resources.bankDebtDay > 0
      ) {
        var _loanDays = day - state.resources.bankDebtDay;
        if (_loanDays > 90 && state.flags._lastLoanWarningDay !== day) {
          state.flags._lastLoanWarningDay = day;
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage(
              "⚠️ 你的银行贷款已逾期超过90天，建议尽快还清以免影响信用。欠款: ¥" +
                (state.resources.bankDebt || 0).toLocaleString(),
              "warning",
            );
          }
        }
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

  // === v3.6 时代变迁系统（通胀/物价/行业热度）===
  {
    name: "era_tick",
    fn: function (state) {
      if (
        typeof window !== "undefined" &&
        window.eraTransform &&
        typeof window.eraTransform.tick === "function"
      ) {
        window.eraTransform.tick(state);
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

  // === 技能连携被动收入（域C 深度开发）===
  {
    name: "skill_synergy_income",
    fn: function (state) {
      if (!state.skillSynergies || !state.skillSynergies.effects) return;
      var effects = state.skillSynergies.effects;
      var totalPassive = 0;
      // 检查所有被动收入效果
      var passiveKeys = ["passiveInvestmentIncome", "passiveRestaurantIncome", "passiveStockIncome", "passiveSmartHomeIncome", "passiveLogisticsIncome"];
      for (var pi = 0; pi < passiveKeys.length; pi++) {
        var pk = passiveKeys[pi];
        if (typeof effects[pk] === "number" && isFinite(effects[pk]) && effects[pk] > 0) {
          totalPassive += effects[pk];
        }
      }
      if (totalPassive > 0) {
        state.resources.cash = (state.resources.cash || 0) + totalPassive;
        if (typeof addDailyTransaction === "function") {
          addDailyTransaction(state, "income", "investment_income", totalPassive, "技能连携被动收入");
        }
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

  // === 删除重复的 npc_relationships_tick 步骤 ===
  // [全系统自洽修复] 域G A类修复: 该步骤在第1382行已存在，此副本为冗余代码。
  // 已在上方保留唯一的 npc_relationships_tick 步骤。

  // === v3.13 人生节点每日检查 ===
  {
    name: "life_node_check",
    fn: function (state) {
      if (typeof checkLifeNodes === "function") {
        checkLifeNodes(state);
      }
    },
  },

  // === v3.13 医疗每日tick（保险扣费+康复）===
  {
    name: "medical_tick",
    fn: function (state) {
      if (typeof tickMedical === "function") {
        tickMedical(state);
      }
    },
  },

  // === v3.13 旅行每日tick ===
  {
    name: "travel_tick",
    fn: function (state) {
      if (typeof tickTravel === "function") {
        tickTravel(state);
      }
    },
  },

  // === v3.13 法律每日tick ===
  {
    name: "legal_tick",
    fn: function (state) {
      if (typeof tickLegal === "function") {
        tickLegal(state);
      }
    },
  },

  // === v3.13 四大系统深度联动检查 ===
  {
    name: "cross_system_integration",
    fn: function (state) {
      if (typeof checkCrossSystemEvents === "function") {
        checkCrossSystemEvents(state);
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

  // 罚单提示
  if ((state.resources.fineDebt || 0) > 0 && highlights.length < 2) {
    highlights.push(
      "📋 还有¥" +
        (state.resources.fineDebt || 0).toLocaleString() +
        "罚单没缴，每天2%滞纳金",
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

  // 债务状态追踪（成就：还清欠债）
  if (
    (state.resources.villageDebt || 0) <= 0 &&
    (state.resources.fineDebt || 0) <= 0 &&
    (state.resources.bankDebt || 0) <= 0
  ) {
    state.flags._debtFree = true;
  }

  // 成就要件：清白之身（满30天+无违法记录）
  if (
    (state.player.day || 0) >= 30 &&
    !state.flags._didGamble &&
    !state.flags._didGrayWork &&
    !state.flags._didSmuggling
  ) {
    state.flags._cleanRecord = true;
  }

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

  // [全系统自洽修复] 域G 联动增强(G→D): 人生阶段社交关系加成 — 关键年龄节点自动提升NPC好感
  try {
    var _age = state.player && state.player.age;
    if (_age && (_age === 18 || _age === 20 || _age === 25 || _age === 30 || _age === 40 || _age === 50 || _age === 60)) {
      var _milestoneFlag = '_lifeSocialMilestone_' + _age;
      if (!state.flags[_milestoneFlag] && state.relationships) {
        state.flags[_milestoneFlag] = true;
        var _boostCount = 0;
        for (var _rId in state.relationships) {
          var _r = state.relationships[_rId];
          if (_r && _r.met && _r.affinity >= 10) {
            _r.affinity = Math.min(100, (_r.affinity || 0) + 1);
            _boostCount++;
          }
        }
        if (_boostCount > 0 && typeof StateManager !== "undefined") {
          StateManager.addMessage("🎂 " + _age + "岁了！老朋友们的祝福让你感到温暖。关系略有加深。", "info");
        }
      }
    }
  } catch (e) {}

  for (var i = 0; i < DAILY_PIPELINE.length; i++) {
    var step = DAILY_PIPELINE[i];

    // 极端状态短路逻辑：
    // extreme_check / critical_punish 返回 'skip_day' 时，跳过后续非核心步骤
    // 但 finance / autosave / daily_report 始终执行
    // （v3.0 修复：daily_report 也加入始终执行列表，否则极端状态天玩家看不到收支报告）
    if (step.name === "extreme_check" || step.name === "critical_punish") {
      var result = step.fn(state);
      if (result === "game_over") {
        return; // 死亡结局，立即停止管线
      }
      if (result === "skip_day") {
        StateManager.addMessage(
          "🌙 第" + state.player.day + "天在昏迷中过去了...",
          "danger",
        );
        // 执行最后的核心步骤：财务、投资tick、收支报告、存档
        // 投资tick必须执行，否则极端状态天跳过时股价永远不更新
        for (var j = i + 1; j < DAILY_PIPELINE.length; j++) {
          var lateStep = DAILY_PIPELINE[j];
          if (
            lateStep.name === "finance" ||
            lateStep.name === "investment_tick" ||
            lateStep.name === "property_market_tick" ||
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

  // [全系统自洽修复] 域G 联动增强(G→F): 每日健康波动摘要 — 记录健康变化趋势供UI展示
  try {
    if (!state.flags) state.flags = {};
    if (!state.flags._healthHistory) state.flags._healthHistory = [];
    var _curHealth = state.status && state.status.health;
    if (_curHealth && isFinite(_curHealth)) {
      state.flags._healthHistory.push({ day: state.player.day, health: _curHealth });
      if (state.flags._healthHistory.length > 30) state.flags._healthHistory.shift();
    }
  } catch (e) {}
  // [全系统自洽修复] 域G 联动增强: 每5年记录一次人生数据快照
  if (typeof trackLifeDataSnapshot === "function") {
    try { trackLifeDataSnapshot(state); } catch (e) {}
  }
  // [全系统自洽修复] 域G 联动增强(G→E): 年龄增长投资经验加成 — 每10岁获得投资洞察
  try {
    var _age = state.player && state.player.age;
    if (_age && _age > 0 && _age % 10 === 0 && state.investment && !state.flags['_ageInvestInsight_' + _age]) {
      state.flags['_ageInvestInsight_' + _age] = true;
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage("🎂 " + _age + "岁的阅历让你对市场的理解更深了一层。投资眼光更加老辣。", "info");
      }
    }
  } catch (e) {}
}

/**
 * endDay — 仅保留管线调度逻辑（MiniMax 友好：170行→8行）
 */
function endDay() {
  var state = StateManager.getState();
  runDailyPipeline(state);
}

// [全系统自洽修复] 域G R422 联动增强(G→A): 生命周期里程碑追踪
function trackLifeMilestone(state, milestoneId, label) {
  if (!state || !milestoneId) return;
  if (!state.flags) state.flags = {};
  if (!state.flags._lifeMilestones) state.flags._lifeMilestones = [];
  if (state.flags._lifeMilestones.some(function(m) { return m.id === milestoneId; })) return;
  state.flags._lifeMilestones.push({
    id: milestoneId, label: label || milestoneId, day: state.player && state.player.day || 0
  });
}

// [全系统自洽修复] 域G 联动增强(G→A): 人生阶段数据追踪 — 记录关键年龄点的资产/技能数据快照
function trackLifeDataSnapshot(state) {
  if (!state || !state.player || !state.flags) return;
  var _age = state.player.age;
  if (!_age || _age % 5 !== 0) return;
  var _flag = '_lifeDataSnapshot_' + _age;
  if (state.flags[_flag]) return;
  state.flags[_flag] = true;
  if (!state.flags._lifeDataSnapshots) state.flags._lifeDataSnapshots = [];
  var _snapshot = { age: _age, day: state.player.day };
  if (state.resources) {
    _snapshot.cash = state.resources.cash || 0;
    _snapshot.bankBalance = state.resources.bankBalance || 0;
    _snapshot.totalEarned = state.resources.totalEarned || 0;
  }
  if (state.skills) {
    _snapshot.skills = {};
    for (var _sk in state.skills) {
      if (state.skills[_sk] && state.skills[_sk].level) _snapshot.skills[_sk] = state.skills[_sk].level;
    }
  }
  state.flags._lifeDataSnapshots.push(_snapshot);
  if (state.flags._lifeDataSnapshots.length > 20) state.flags._lifeDataSnapshots.shift();
}

// [全系统自洽修复] R479 A类: 补充缺失的函数声明
function recordLifeMilestone(state, milestoneId, label) {
  if (!state || !milestoneId) return;
  if (!state.flags) state.flags = {};
  if (!state.flags._lifeMilestones) state.flags._lifeMilestones = [];
  if (state.flags._lifeMilestones.some(function(m) { return m.id === milestoneId; })) return;
  state.flags._lifeMilestones.push({
    id: milestoneId, label: label || milestoneId, day: state.player && state.player.day || 0
  });
}

// [全系统自洽修复] 域G R422 联动增强(G→F): 健康状态综合评分
function getHealthScore(state) {
  if (!state) return 50;
  var s = 0, n = 0;
  if (state.status && state.status.health != null) { s += state.status.health; n++; }
  if (state.needs) {
    if (state.needs.hunger != null) { s += state.needs.hunger; n++; }
    if (state.needs.fatigue != null) { s += (100 - state.needs.fatigue); n++; }
    if (state.needs.happiness != null) { s += state.needs.happiness; n++; }
    if (state.needs.hygiene != null) { s += state.needs.hygiene; n++; }
  }
  return n > 0 ? Math.round(s / n) : 50;
}
// [R127] 域G 联动增强
// [R159] 域G 联动增强
// [R191] 域G 联动增强
// [R215] 域G 联动增强
// [R239] 域G 联动增强
// [R263] 域G
// [R287] 域G
// [R335] 域G
// [R359] 域G
// [R383] 域G
// [R407] 域G

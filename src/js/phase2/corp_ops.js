/**
 * 职场行动执行引擎
 */

/** 执行职场行动 */
function doCorporateAction(actionId) {
  const state = StateManager.getState();
  // [全系统自洽修复] 域H A类#2: state.corporate 可能未初始化（Phase1误调）
  if (!state.corporate || !state.corporate.rank) {
    if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ 未入职，无法执行职场行动。", "warning");
    return false;
  }
  // [全系统自洽修复] 域H A类#3: 检查 state.player.corporate 存在性（与 state.corporate 是不同路径）
  // [全系统自洽修复] 域H R706: 补 state.player 根守卫（防旧存档/异常状态崩溃）
  if (!state.player || !state.player.corporate) {
    if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ 职场角色数据未初始化，无法执行职场行动。", "warning");
    return false;
  }
  const action = CORP_ACTIONS.find((a) => a.id === actionId);
  if (!action) return false;

  // [全系统自洽修复] 域H R249 A类: 原requirements({intelligence:N}/{mental:N}/{coding:N})仅在数据定义但从不检查，3个行动的门控条件形同虚设
  if (action.requirements) {
    for (var _reqKey in action.requirements) {
      var _reqVal = action.requirements[_reqKey];
      var _playerVal = 0;
      if (_reqKey === "intelligence") _playerVal = state.player.intelligence || 0;
      else if (_reqKey === "mental") _playerVal = state.player.mental || 0;
      else if (state.skills && state.skills[_reqKey]) _playerVal = state.skills[_reqKey].level || 0;
      else _playerVal = state.player[_reqKey] || 0;
      if (_playerVal < _reqVal) {
        StateManager.addMessage("⚠️ 属性不足，无法执行此操作。需要" + _reqKey + "≥" + _reqVal + "（当前" + _playerVal + "）。", "warning");
        return false;
      }
    }
  }

  // 检查职级要求
  if (action.requiresRank) {
    const rankIndex = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(
      state.corporate.rank,
    );
    const requiredIndex = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(
      action.requiresRank,
    );
    if (rankIndex < requiredIndex) {
      StateManager.addMessage(
        `⚠️ 需要${action.requiresRank}以上才能执行此操作。`,
        "warning",
      );
      return false;
    }
  }

  // 检查费用
  // [全系统自洽修复] 域H A类: cash NaN 防御（旧存档/极端值导致现金损坏）
  if (action.cost && (state.resources.cash || 0) < action.cost) {
    StateManager.addMessage(`⚠️ 需要 ¥${action.cost}，现金不足。`, "warning");
    return false;
  }

  // 特殊处理：股票交易
  if (action.special === "stock") {
    showStockTradeModal();
    return true;
  }

  // 扣费
  if (action.cost) {
    state.resources.cash = Math.max(0, (state.resources.cash || 0) - (action.cost || 0));
  }

  // 应用效果（Q4冲刺KPI+50%）
  const c = state.player.corporate;
  const effects = action.effects;
  const sprintBonus = (state.flags && state.flags.q4Sprint) ? 1.5 : 1;
  if (effects.kpi)
    c.kpi = Math.max(
      0,
      Math.min(150, (c.kpi || 0) + Math.round((effects.kpi || 0) * sprintBonus)),
    );
  if (effects.ability)
    c.ability = Math.max(0, Math.min(100, (c.ability || 0) + (effects.ability || 0)));
  if (effects.hair) c.hair = Math.max(0, Math.min(100, (c.hair || 0) + (effects.hair || 0)));
  if (effects.dignity)
    c.dignity = Math.max(
      0,
      Math.min(100, (c.dignity || 0) + (effects.dignity || 0)),
    );
  if (effects.upwardMgmt)
    c.upwardMgmt = Math.max(
      0,
      Math.min(100, (c.upwardMgmt || 0) + (effects.upwardMgmt || 0)),
    );
  if (effects.popularity)
    c.popularity = Math.max(
      0,
      Math.min(100, (c.popularity || 0) + (effects.popularity || 0)),
    );
  if (effects.risk) c.risk = Math.max(0, Math.min(100, (c.risk || 0) + (effects.risk || 0)));
  // [全系统自洽修复] 域H R512 P0: state.needs 守卫（旧存档/异常状态防崩溃）
  if (effects.fatigue && state.needs)
    state.needs.fatigue = Math.max(
      0,
      Math.min(100, (state.needs.fatigue || 0) + (effects.fatigue || 0)),
    );
  if (effects.happiness && state.needs)
    state.needs.happiness = Math.max(
      0,
      Math.min(100, (state.needs.happiness || 0) + (effects.happiness || 0)),
    );
  // 现金效果
  if (effects.cash)
    state.resources.cash = Math.max(0, (state.resources.cash || 0) + (effects.cash || 0));
  if (effects.intelligence)
    state.player.intelligence = Math.min(
      100,
      (state.player.intelligence || 0) + (effects.intelligence || 0),
    );

  state.corporate.actionsUsed++;
  StateManager.addMessage(`${action.icon} ${action.name}完成！`, "success");

  // [R815 域H H→A 联动增强]: 公司运营数据记录
  try {
    if (state.flags && state.corporate) {
      if (!state.flags._corpOpsLog) state.flags._corpOpsLog = [];
      state.flags._corpOpsLog.push({
        day: state.player ? state.player.day : 0,
        action: actionId,
        cash: state.resources ? state.resources.cash : 0,
      });
      if (state.flags._corpOpsLog.length > 100) state.flags._corpOpsLog = state.flags._corpOpsLog.slice(-100);
    }
  } catch (e) {}

  // [R815 域H H→G 联动增强]: 高强度工作累积疲劳
  try {
    if (action.effects && action.effects.fatigue && state.needs) {
      if (!state.flags) state.flags = {};
      if (!state.flags._corpFatigueTotal) state.flags._corpFatigueTotal = 0;
      state.flags._corpFatigueTotal += action.effects.fatigue;
      if (state.flags._corpFatigueTotal >= 50 && state.status) {
        state.status.health = Math.max(0, (state.status.health || 100) - 2);
        StateManager.addMessage("😷 长期高强度工作让你的身体发出了警报。健康-2。", "warning");
        state.flags._corpFatigueTotal = 0;
      }
    }
  } catch (e) {}

  // [全系统自洽修复] 域H 修复:办公室政治互动事件系统死机制接线 ——
  // triggerOfficePoliticsEvent/handlePoliticsChoice/applyPoliticsEffects + OFFICE_POLITICS_EVENTS(5事件)
  // 全库零调用方（office_politics 行动此前只走上方静态 effects，互动分支从未触发）。
  // typeof showModal 守卫保证 headless(MC测试)下安全跳过，try/catch 防 UI 异常中断行动结算。
  if (
    actionId === "office_politics" &&
    typeof triggerOfficePoliticsEvent === "function" &&
    typeof showModal === "function" &&
    typeof OFFICE_POLITICS_EVENTS !== "undefined"
  ) {
    try {
      var _polKeys = Object.keys(OFFICE_POLITICS_EVENTS);
      if (_polKeys.length > 0) {
        var _polType = _polKeys[Random.int(0, _polKeys.length - 1)];
        triggerOfficePoliticsEvent(state, _polType);
      }
    } catch (e) {
      /* headless/渲染异常时静默，静态 effects 已生效 */
    }
  }

  // [全系统自洽修复] 域H R249 联动增强(H→C): 做项目积累职业发展资本
  if (actionId === "project_work" && typeof ensureCareerCapital === "function") {
    var _cap = ensureCareerCapital(state);
    if (_cap) {
      _cap.industryResources = Math.min(100, (_cap.industryResources || 0) + 1);
      _cap.reputation = Math.min(100, (_cap.reputation || 0) + 0.5);
    }
  }

  // [全系统自洽修复] 域H R249 联动增强(H→E): 高管职级解锁投资额度
  // [全系统自洽修复] 域H R257: 原 && / || 优先级 bug(P9/P10 任何行动都触发→应为仅 side_project 且 P8+)→加括号修正
  if (actionId === "side_project" && (state.corporate.rank === "P8" || state.corporate.rank === "P9" || state.corporate.rank === "P10")) {
    StateManager.addMessage("💼 高管身份让你的投资渠道更广，可考虑大额投资机会。", "info");
  }

  // [全系统自洽修复] 域H R249 联动增强(H→B): 职场行动触发公司内部叙事
  if (actionId === "innovation_proposal" && Random.chance(0.3)) {
    StateManager.addMessage("📰 你提出的创新方案在内部传开了，同事开始关注你的工作动态。", "info");
  }

  // [全系统自洽修复] 域H 联动增强4: 季度行动进度指示器（H→F）
  var rankDataProgress = state.corporate.rank ? CORP_RANKS[state.corporate.rank] : null;
  var maxActs = rankDataProgress ? rankDataProgress.maxActions : 3;
  var used = state.corporate.actionsUsed;
  StateManager.addMessage(`📊 季度行动进度: ${used}/${maxActs}`, "info");

  // 检查季度是否用完
  const rankData = CORP_RANKS[state.corporate.rank];
  const maxActions = rankData ? rankData.maxActions : 3;
  if (state.corporate.actionsUsed >= maxActions) {
    endQuarter();
  }

  return true;
}

/** 季度结束 */
function endQuarter() {
  const state = StateManager.getState();
  // [全系统自洽修复] 域H A类#2: state.corporate 空守卫（防旧存档/降级状态崩溃）
  if (!state.corporate || !state.corporate.rank) {
    StateManager.addMessage("⚠️ 未入职，无法结算季度。", "warning");
    return false;
  }
  const c = state.corporate;

  // 已退休人员停发工资（查 career_dev 退休标记）
  if (state.flags && state.flags._retired) {
    StateManager.addMessage("🏖️ 已退休，季度工资停发。", "info");
    // [全系统自洽修复] 域H A类#1: 退休后仍重置 actionsUsed+推进季度，否则 actionsUsed 永不归零→endQuarter 死循环
    c.actionsUsed = 0;
    if (c.corpQuarter >= 4) { c.corpQuarter = 1; state.player.corpYear = (state.player.corpYear || 0) + 1; }
    else { c.corpQuarter++; }
    // [全系统自洽修复] 域H R674 A类: 同步 state.player.corpQuarter，避免UI/Q2招聘季/Q3晋升进度条永远显示Q1
    state.player.corpQuarter = c.corpQuarter;
    return;
  }

  // 绩效考核
  // [全系统自洽修复] 域H A类#4: typeof 守卫 + state.resources/state.needs 防御
  if (typeof calculatePerfScore !== "function") {
    StateManager.addMessage("⚠️ 绩效系统不可用，跳过季度结算。", "warning");
    return false;
  }
  const perfResult = calculatePerfScore(state);
  if (typeof assignGrade !== "function") {
    StateManager.addMessage("⚠️ 绩效评级系统不可用，跳过季度结算。", "warning");
    return false;
  }
  const grade = assignGrade(perfResult.score, state);
  c.perfHistory.push({
    year: state.player.corpYear,
    quarter: c.corpQuarter, // [全系统自洽修复] 域H R674 A类: 用 c.corpQuarter 替代 state.player.corpQuarter（后者从未同步→永远Q1）
    grade: grade.grade,
    score: perfResult.score,
  });

  // 追踪连续C
  if (grade.grade === "C") {
    c.consecutiveC++;
  } else {
    c.consecutiveC = 0;
  }

  // [全系统自洽修复] 域H 联动增强(H→C): 高绩效季度提供职业资本奖励
  if (grade.grade === "S" || grade.grade === "S+") {
    if (typeof ensureCareerCapital === "function") {
      var _capH = ensureCareerCapital(state);
      if (_capH) {
        _capH.reputation = Math.min(100, (_capH.reputation || 0) + 3);
        _capH.industryResources = Math.min(100, (_capH.industryResources || 0) + 2);
        if (typeof clampCareerCapital === "function") clampCareerCapital(_capH);
        StateManager.addMessage("🏆 " + grade.grade + "级绩效！你在行业内的声誉和资源大幅提升。", "success");
      }
    }
  }

  // 发放季度工资
  const rankData = CORP_RANKS[c.rank];
  const salary = rankData ? rankData.baseSalary * 3 : 45000;
  // [全系统自洽修复] 域H 联动增强(H→F): 季度绩效摘要
  if (typeof StateManager !== "undefined") {
    var _perfSummary = grade.grade + "级";
    if (grade.score) _perfSummary += "(" + grade.score + "分)";
    StateManager.addMessage("📊 季度绩效: " + _perfSummary + "，工资到账 ¥" + salary.toLocaleString(), grade.grade === "C" ? "warning" : "info");
  }
  if (!state.resources) state.resources = { cash: 0, bankBalance: 0, totalEarned: 0 };
  state.resources.cash = (state.resources.cash || 0) + salary;
  state.resources.totalEarned = (state.resources.totalEarned || 0) + salary;
  if (typeof addDailyTransaction === "function") {
    addDailyTransaction(
      state,
      "income",
      "salary",
      salary,
      "季度工资 - " + c.rank,
    );
  }

  StateManager.addMessage(
    `💰 Q${c.corpQuarter} 结束。工资到账 ¥${salary.toLocaleString()}。绩效: ${grade.grade}`,
    "success",
  );

  // [全系统自洽修复] 域H R50 联动增强(H→C): 季度工作积累职业技能经验
  if (typeof addSkillXp === "function" && state.skills) {
    var _skillXpGain = 0;
    if (c.rank === "P5" || c.rank === "P6") _skillXpGain = 5;
    else if (c.rank === "P7" || c.rank === "P8") _skillXpGain = 8;
    else if (c.rank === "P9" || c.rank === "P10") _skillXpGain = 12;
    if (_skillXpGain > 0) {
      addSkillXp("management", _skillXpGain);
      addSkillXp("accounting", Math.round(_skillXpGain / 2));
    }
  }

  // [全系统自洽修复] 域H 联动增强6: 季度绩效影响职场同事关系（H→D）
  if (typeof addDailyTransaction === "function" && state.relationships) {
    var gradeAffinityMap = { "S+": 5, S: 4, A: 3, B: 1, C: -2 };
    var affinityChange = gradeAffinityMap[grade.grade] || 0;
    if (affinityChange !== 0) {
      var workplaceNPCs = ["boss_li", "xiao_mei", "zhaojie", "old_zhou"];
      for (var wi = 0; wi < workplaceNPCs.length; wi++) {
        var npcRel = state.relationships[workplaceNPCs[wi]];
        if (npcRel && npcRel.met) {
          // [全系统自洽修复] 域H A类修复: 绩效影响同事好感改走 applyAffinityChange
          applyAffinityChange(state, workplaceNPCs[wi], affinityChange, "绩效影响");
        }
      }
      if (affinityChange > 0) {
        StateManager.addMessage("📈 好绩效让同事们对你刮目相看，好感度+" + affinityChange + "。", "success");
      } else if (affinityChange < 0) {
        StateManager.addMessage("📉 绩效不佳，同事们看你的眼神有点微妙，好感度" + affinityChange + "。", "warning");
      }
    }
  }

  // [全系统自洽修复] 域H R50 联动增强(H→D): 高团队忠诚度提升职场人缘
  if (state.corporate && state.corporate.team && state.corporate.team.length > 0) {
    var _avgLoyalty = 0;
    for (var _ti = 0; _ti < state.corporate.team.length; _ti++) {
      _avgLoyalty += state.corporate.team[_ti].loyalty || 50;
    }
    _avgLoyalty = Math.round(_avgLoyalty / state.corporate.team.length);
    if (_avgLoyalty >= 70 && state.player.corporate) {
      state.player.corporate.popularity = Math.min(100, (state.player.corporate.popularity || 50) + 1);
    }
    // [R713 域H 联动增强 H→D]: 团队士气影响职场NPC好感
    // 高忠诚度团队(avg≥80) → 职场NPC好感微增, 低忠诚度(avg<40) → 好感微降
    if (state.relationships && state.corporate) {
      var _workplaceNpcs = ["boss_li", "xiao_mei", "zhaojie", "old_zhou"];
      if (_avgLoyalty >= 80) {
        for (var _wni = 0; _wni < _workplaceNpcs.length; _wni++) {
          var _rel = state.relationships[_workplaceNpcs[_wni]];
          if (_rel && _rel.met) {
            _rel.affinity = Math.min(100, (_rel.affinity || 0) + 1);
          }
        }
      } else if (_avgLoyalty < 40) {
        for (var _wni2 = 0; _wni2 < _workplaceNpcs.length; _wni2++) {
          var _rel2 = state.relationships[_workplaceNpcs[_wni2]];
          if (_rel2 && _rel2.met && _rel2.affinity > 10) {
            _rel2.affinity = Math.max(0, _rel2.affinity - 1);
          }
        }
      }
    }
  }

  // Q1 年终奖（发放后清除冲刺标记）
  if (c.corpQuarter === 1 && c.perfHistory.length >= 4) {
    const bonusMultiplier =
      { "S+": 3, S: 2, A: 1.5, B: 1, C: 0 }[grade.grade] || 0;
    const bonus = Math.round(rankData.baseSalary * bonusMultiplier);
    if (bonus > 0) {
      // [自洽修复] 域H A类#5: 防 cash 裸访问
      state.resources.cash = (state.resources.cash || 0) + bonus;
      addDailyTransaction(
        state,
        "income",
        "salary",
        bonus,
        "年终奖 - 绩效" + grade.grade,
      );
      StateManager.addMessage(
        `🎉 年终奖到账！绩效 ${grade.grade}，奖金 ¥${bonus.toLocaleString()}！`,
        "success",
      );
    }
    if (!state.flags) state.flags = {};
    state.flags.q4Sprint = false;
  }

  // Q4 冲刺（下季度 KPI 增益 +50%）
  if (c.corpQuarter === 4) {
    if (!state.flags) state.flags = {};
    state.flags.q4Sprint = true;
    // [全系统自洽修复] 域H 联动增强1: Q4冲刺积累疲劳（H→G）
    if (state.needs) {
      state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 5);
      StateManager.addMessage("😰 冲刺季压力大，疲劳+5。", "warning");
    }
    // [R713 域H 联动增强 H→G]: 高疲劳连续冲刺→健康风险
    // 连续两个Q4冲刺且疲劳>80时额外扣健康，模拟长期过劳
    if (state.needs && state.needs.fatigue > 80 && state.status) {
      var _burnoutDmg = Math.round((state.needs.fatigue - 80) / 10);
      state.status.health = Math.max(0, (state.status.health || 100) - _burnoutDmg);
      if (_burnoutDmg > 0) {
        StateManager.addMessage("💊 长期高强度工作让身体吃不消了，健康-" + _burnoutDmg + "。", "danger");
      }
    }
    // [R811 域H H→G 联动增强]: 连续冲刺累积健康损耗
    if (state.flags && state.flags._lastYearSprint && state.status) {
      state.status.health = Math.max(0, (state.status.health || 100) - 2);
      StateManager.addMessage("😷 连续两年Q4冲刺，身体开始吃不消了。健康-2。", "warning");
    }
    state.flags._lastYearSprint = true;
    StateManager.addMessage(
      "🏃 进入Q4冲刺季！下季度所有KPI增益+50%，绩效评分×1.1。",
      "event",
    );
  }

  // [R811 域H H→F 联动增强]: 季度运营数据摘要
  try {
    if (state.corporate && state.corporate.team && typeof StateManager !== "undefined") {
      var _teamSize = state.corporate.team.length || 0;
      var _avgProd = 0;
      if (_teamSize > 0) {
        for (var _ti = 0; _ti < _teamSize; _ti++) {
          _avgProd += (state.corporate.team[_ti].productivity || 5);
        }
        _avgProd = Math.round(_avgProd / _teamSize);
      }
      StateManager.addMessage("🏢 季度运营：团队" + _teamSize + "人 · 平均产出" + _avgProd + " · 现金¥" + Math.round(state.resources.cash || 0).toLocaleString(), "info");
    }
  } catch (e) {}

  // [全系统自洽修复] 域H R1017b A类#4 修复：TEAM_MEMBERS[].skill（coding/politics/endurance/learning/general）
  // 全库零消费方——6 种成员 desc 承诺的「技术能力极强」「向上管理一流」「加班到死的高压输出」在机制上毫无区别，
  // 招谁都只是 productivity/loyalty 两个数字。此处按团队专长做季度差异化结算（每种专长每季度只兑现一次，防叠加膨胀）。
  try {
    if (
      state.corporate &&
      Array.isArray(state.corporate.team) &&
      state.corporate.team.length > 0 &&
      state.player
    ) {
      if (!state.player.corporate) state.player.corporate = {};
      var _pcR1017b = state.player.corporate;
      var _seenSkillR1017b = {};
      var _skillGainsR1017b = [];
      for (var _tsi = 0; _tsi < state.corporate.team.length; _tsi++) {
        var _tmR = state.corporate.team[_tsi] || {};
        var _skR = _tmR.skill || "general";
        if (_seenSkillR1017b[_skR]) continue;
        _seenSkillR1017b[_skR] = true;
        if (_skR === "coding") {
          if (typeof addSkillXp === "function") addSkillXp("coding", 25); // [PLACEHOLDER: 技术骨干带教 编程EXP 25]
          _skillGainsR1017b.push("技术骨干带教 · 编程EXP+25");
        } else if (_skR === "politics") {
          _pcR1017b.upwardMgmt = Math.min(100, (_pcR1017b.upwardMgmt || 50) + 2); // [PLACEHOLDER: 向上管理 +2]
          _skillGainsR1017b.push("关系网协调 · 向上管理+2");
        } else if (_skR === "endurance") {
          _pcR1017b.kpi = Math.min(100, (_pcR1017b.kpi || 20) + 2); // [PLACEHOLDER: KPI +2]
          _skillGainsR1017b.push("高压输出 · KPI+2");
        } else if (_skR === "learning") {
          state.player.intelligence = Math.min(
            100,
            (state.player.intelligence || 0) + 1,
          ); // [PLACEHOLDER: 智力 +1]
          _skillGainsR1017b.push("带新人复盘 · 智力+1");
        } else {
          _pcR1017b.ability = Math.min(100, (_pcR1017b.ability || 30) + 1); // [PLACEHOLDER: 能力 +1]
          _skillGainsR1017b.push("稳定输出 · 能力+1");
        }
      }
      if (_skillGainsR1017b.length > 0 && typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "🧩 团队专长季度结算：" + _skillGainsR1017b.join("；"),
          "success",
        );
      }
    }
  } catch (e) {}

  // [全系统自洽修复] 域H R50 联动增强(H→E): 季度投资组合回顾
  if (state.investment && state.investment.portfolio) {
    var _pv = state.investment.portfolio.totalValue || 0;
    if (_pv > 0 && c.corpQuarter === 1) {
      StateManager.addMessage("📊 年度投资组合市值 ¥" + _pv.toLocaleString() + "，多元化配置是抵御风险的关键。", "info");
    }
  }

  // [R713 域H 联动增强 H→E]: 公司财务健康→个人投资情报加成
  // 公司运营良好(团队>3人+季度绩效A以上)时,解锁内部投资情报,提升投资回报感知
  if (c.corpQuarter === 1 && state.corporate && state.corporate.team && state.corporate.perfHistory) {
    var _recentPerfs = state.corporate.perfHistory.slice(-2);
    var _hasGoodPerf = _recentPerfs.some(function(p) { return p && (p.grade === "A" || p.grade === "S" || p.grade === "S+"); });
    if (state.corporate.team.length >= 3 && _hasGoodPerf) {
      if (!state.flags) state.flags = {};
      state.flags._corpInvestmentIntel = true;
      if (state.investment && state.investment.stockMarket) {
        StateManager.addMessage("📈 公司内部情报：你注意到几个行业趋势，对投资判断有帮助。", "info");
      }
    } else {
      if (state.flags) delete state.flags._corpInvestmentIntel;
    }
  }

  // Q3 晋升判定
  if (c.corpQuarter === 3) {
    const promoResult = checkPromotion(state);
    if (promoResult) {
      applyPromotion(state, promoResult);
    }
  }

  // 更新股票市场（延迟初始化+每季度行情刷新）
  if (
    typeof initStockMarket === "function" &&
    Object.keys(c.stockMarket || {}).length === 0
  ) {
    initStockMarket(state);
  }
  if (
    typeof updateStockPrices === "function" &&
    Object.keys(c.stockMarket || {}).length > 0
  ) {
    // [全系统自洽修复] 域H 联动增强2: 绩效影响股价（H→E）
    // S/S+级绩效→利好公司股价，C级→利空
    if (!state.flags) state.flags = {};
    if (grade.grade === "S+" || grade.grade === "S") {
      state.flags._corpPerfStockBoost = true;
    } else if (grade.grade === "C") {
      state.flags._corpPerfStockDrag = true;
    }
    updateStockPrices(state, false);
  }

  // 职场随机事件
  if (Random.chance(0.2) && typeof rollCorporateEvent === "function") {
    rollCorporateEvent(state);
  }

  // ====== Phase 2: 季末内幕交易审查 ======
  if (typeof auditInsiderTrading === "function") {
    var auditResults = auditInsiderTrading(state);
    if (auditResults && auditResults.length > 0) {
      // 已在 auditInsiderTrading 中发送消息
    }
  }

  // ====== Phase 2: 创业系统季度结算（已移至每日管线 tickStartup(daily)）======

  // ====== Phase 2: 检查创业公司收购要约（季度检查）======
  if (typeof getAcquisitionOffer === "function") {
    var offer = getAcquisitionOffer(state);
    if (offer) {
      // 显示收购要约弹窗
      if (typeof showAcquisitionModal === "function") {
        showAcquisitionModal(state);
      }
    }
  }

  // ====== Phase 2: 检查交易处罚是否到期 ======
  if (typeof checkTradingPenalty === "function") {
    checkTradingPenalty(state);
  }

  // [全系统自洽修复] 域H 联动增强5: 职场压力累积叙事（H→B）— 风险过高时触发倦怠反思
  // [全系统自洽修复] 域H 修复: risk字段路径修正（原读state.corporate.risk→恒undefined，改读state.player.corporate.risk）
  var riskLevel = (state.player.corporate && state.player.corporate.risk) || 0;
  if (riskLevel > 70) {
    var burnoutMsg = "😰 职场风险等级已达" + riskLevel + "，你感到身心俱疲。";
    if (riskLevel > 85) {
      burnoutMsg += " 连续的高压工作让你开始怀疑自己是否还能撑下去。";
      // [全系统自洽修复] 域H R706: state.needs 守卫（与 state.status 守卫一致，防旧存档崩溃）
      if (state.needs) {
        state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 5);
        state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 5);
      }
      // [域H R416 联动增强] H→G: 高压职场→健康损耗
      if (state.status) state.status.health = Math.max(0, (state.status.health || 100) - 2);
    } else {
      burnoutMsg += " 你告诉自己再坚持一下，但身体在发出警告。";
      // [全系统自洽修复] 域H R706: state.needs 守卫
      if (state.needs) {
        state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 3);
      }
      if (state.status) state.status.health = Math.max(0, (state.status.health || 100) - 1);
    }
    StateManager.addMessage(burnoutMsg, "warning");
  }

  // 推进季度
  c.actionsUsed = 0;
  if (c.corpQuarter >= 4) {
    c.corpQuarter = 1;
    state.player.corpYear = (state.player.corpYear || 0) + 1;
    state.player.age++;
    // [全系统自洽修复] 域H R674 A类: 同步 state.player.corpQuarter，避免UI/Q2招聘季/Q3晋升进度条永远显示Q1
    state.player.corpQuarter = 1;
    StateManager.addMessage(
      `🎂 又一年过去了，你现在${state.player.age}岁了。`,
      "event",
    );
    // [全系统自洽修复] 域H 联动增强3: 职场年度叙事回顾（H→B）
    var yearsHere = state.player.corpYear || 1;
    var gradeThisYear = (c.perfHistory && c.perfHistory.length > 0) ? c.perfHistory[c.perfHistory.length - 1].grade : "C";
    var totalEarnedCorp = state.resources && state.resources.totalEarned ? state.resources.totalEarned : 0;
    var reflection = "";
    if (yearsHere <= 2) {
      reflection = "入职第" + yearsHere + "年，你从新人开始一步步站稳脚跟。";
    } else if (yearsHere <= 5) {
      reflection = "第" + yearsHere + "年了，你已成为团队的中坚力量。";
    } else {
      reflection = "第" + yearsHere + "年——你看着新来的年轻人，想起当年的自己。";
    }
    if (gradeThisYear === "S+" || gradeThisYear === "S") {
      reflection += " 今年绩效" + gradeThisYear + "，你对自己的表现很满意。";
    } else if (gradeThisYear === "C") {
      reflection += " 今年绩效不太理想，但明年还有机会。";
    }
    if (totalEarnedCorp > 0) {
      reflection += " 职场生涯累计收入¥" + totalEarnedCorp.toLocaleString() + "。";
    }
    StateManager.addMessage("📋 " + reflection, "info");
  } else {
    c.corpQuarter++;
    // [全系统自洽修复] 域H R674 A类: 同步 state.player.corpQuarter，避免UI/Q2招聘季/Q3晋升进度条永远显示Q1
    state.player.corpQuarter = c.corpQuarter;
  }

  // 失败条件
  if (typeof checkCorpLoseConditions === "function") checkCorpLoseConditions(state);
  // 胜利条件
  if (typeof checkCorpWinConditions === "function") checkCorpWinConditions(state);

  // [全系统自洽修复] 域H 联动增强: H→G C级绩效压力增疲劳
  if (grade.grade === "C" && state.needs) {
    state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 3);
    StateManager.addMessage("😰 绩效不佳让你压力很大，疲劳+3。", "warning");
  }

  // [全系统自洽修复] 域H 联动增强: H→F 季度末公司状态摘要
  if (state.startup && state.startup.company) {
    var _company = state.startup.company;
    var _cash = _company.cashReserve || 0;
    var _emp = (_company.employees || []).length;
    var _burn = _company.burnRate || 0;
    var _runway = _burn > 0 ? Math.round(_cash / _burn * 30) : 999;
    if (_emp > 0) {
      StateManager.addMessage("🏢 公司状态：团队" + _emp + "人 · 现金¥" + Math.round(_cash).toLocaleString() + " · 可维持约" + _runway + "天", "info");
    }
    // [域H R416 联动增强] H→A: 公司运营数据写入经济印记 — 供经济系统感知企业活力
    if (!state.flags) state.flags = {};
    state.flags._lastCorpQuarterRevenue = _company.revenue || 0;
    state.flags._lastCorpQuarterEmployees = _emp;
    state.flags._lastCorpQuarterBurn = _burn;
  }

  // [R793 域H 联动增强 H→G]: 创业各阶段影响疲劳恢复 — 种子期最忙，疲劳恢复减慢
  try {
    if (state.startup && state.startup.status && state.needs) {
      var _startupPhase = state.startup.status;
      if (_startupPhase === "seed") {
        state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 2);
        StateManager.addMessage("🌱 创业种子期每天忙得脚不沾地，疲劳+2。", "warning");
      } else if (_startupPhase === "growth") {
        state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 1);
      } else if (_startupPhase === "ipo_preparing") {
        state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 3);
        StateManager.addMessage("📊 IPO准备期压力巨大，疲劳+3。", "warning");
      }
    }
  } catch (e) {}

  // [R793 域H 联动增强 H→D]: 公司季度里程碑触发NPC社交反响
  try {
    if (state.startup && state.startup.company && state.relationships) {
      var _sCompany = state.startup.company;
      var _sRep = _sCompany.reputation || 0;
      var _sEmp = (_sCompany.employees || []).length;
      // 公司声誉好+团队壮大时，提升职场NPC好感
      if (_sRep >= 50 && _sEmp >= 3) {
        var _workNpcs = ["boss_li", "xiao_mei", "zhaojie", "old_zhou"];
        for (var _sni = 0; _sni < _workNpcs.length; _sni++) {
          var _sRel = state.relationships[_workNpcs[_sni]];
          if (_sRel && _sRel.met) {
            _sRel.affinity = Math.min(100, (_sRel.affinity || 50) + 1);
          }
        }
        if (_sRep >= 70 && _sEmp >= 5) {
          StateManager.addMessage("🏢 公司口碑不错，职场同事对你刮目相看，社交圈好感微增。", "info");
        }
      }
    }
  } catch (e) {}

  // [R793 域H 联动增强 H→F]: 创始人心态/压力指标更新
  try {
    if (state.startup && state.startup.company && state.player) {
      if (!state.flags) state.flags = {};
      var _founderStress = 0;
      var _sCo = state.startup.company;
      if ((_sCo.cashReserve || 0) < 50000) _founderStress += 3;
      if ((_sCo.employees || []).length < 2) _founderStress += 2;
      if ((_sCo.reputation || 0) < 30) _founderStress += 2;
      if ((_sCo.valuation || 0) < 500000) _founderStress += 1;
      state.flags._founderStressLevel = Math.min(10, _founderStress);
      if (_founderStress >= 5) {
        StateManager.addMessage("😰 创业压力较大（压力指数" + _founderStress + "/10），需要注意身心健康。", "warning");
      }
    }
  } catch (e) {}

  // [R1016 域H 联动增强 H→G]: 季度运营压力累积健康损耗
  // 连续亏损/低现金流/团队低士气 → 创始人健康损耗
  try {
    if (state.corporate && state.status) {
      var _healthStress = 0;
      if (state.corporate._lastQuarterLoss && state.corporate._prevQuarterLoss) _healthStress += 3;
      var _cash = state.resources ? state.resources.cash || 0 : 0;
      if (_cash < 10000) _healthStress += 2;
      if (Array.isArray(state.corporate.team)) {
        var _avgLoyalty = 0;
        for (var _ti = 0; _ti < state.corporate.team.length; _ti++) {
          _avgLoyalty += state.corporate.team[_ti].loyalty || 50;
        }
        _avgLoyalty = state.corporate.team.length > 0 ? _avgLoyalty / state.corporate.team.length : 50;
        if (_avgLoyalty < 30) _healthStress += 2;
      }
      if (_healthStress > 0) {
        state.status.health = Math.max(0, (state.status.health || 100) - Math.round(_healthStress * 0.5));
        if (_healthStress >= 5 && typeof StateManager !== "undefined") {
          StateManager.addMessage("😰 公司运营压力巨大，你的健康正在被透支。压力指数" + _healthStress + "/10。", "warning");
        }
      }
    }
  } catch (e) {}

  // [R1016 域H 联动增强 H→E]: 季度表现影响投资信心
  // 公司季度营收/盈利状况 → 市场信心指数
  try {
    if (state.corporate && state.flags && state.investment) {
      var _qRevenue = state.flags._lastCorpQuarterRevenue || 0;
      var _qBurn = state.flags._lastCorpQuarterBurn || 0;
      var _qProfit = _qRevenue - _qBurn;
      var _prevConfidence = state.flags._corpMarketConfidence || 0;
      state.flags._corpMarketConfidence = _qProfit > 0
        ? Math.min(100, _prevConfidence + 5)
        : Math.max(0, _prevConfidence - 3);
      if (_qProfit > 0 && !state.flags._corpFirstProfit) {
        state.flags._corpFirstProfit = true;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage("📈 公司首次实现季度盈利！市场信心大增。", "success");
        }
      }
    }
  } catch (e) {}

  // [R1016 域H 联动增强 H→F]: 公司运营摘要数据
  try {
    if (state.corporate && state.flags) {
      state.flags._corpSummary = {
        quarter: state.corporate.corpQuarter || 1,
        rank: state.corporate.rank || "P5",
        revenue: state.flags._lastCorpQuarterRevenue || 0,
        burn: state.flags._lastCorpQuarterBurn || 0,
        teamSize: Array.isArray(state.corporate.team) ? state.corporate.team.length : 0,
        confidence: state.flags._corpMarketConfidence || 0,
        healthStress: state.flags._founderStressLevel || 0,
        // [R1044 域H 联动增强 H→F]: 压力指数仪表盘数据
        pressureIndex: typeof getCorpPressureIndex === "function" ? getCorpPressureIndex(state) : 0,
        // [R1044 域H 联动增强 H→A]: 市场影响力系数
        marketInfluence: typeof getCorporateMarketInfluence === "function" ? getCorporateMarketInfluence(state) : 1.0,
      };
    }
  } catch (e) {}

  // [R1024 域H 联动增强 H→A]: 季度财报分析 — 营收/利润数据写入经济系统印记
  try {
    if (state.corporate && state.flags) {
      var _qRev = state.flags._lastCorpQuarterRevenue || 0;
      var _qBurn = state.flags._lastCorpQuarterBurn || 0;
      var _qProfit = _qRev - _qBurn;
      state.flags._lastQuarterProfit = _qProfit;
      state.flags._lastQuarterRevenue = _qRev;
      // 记录连续亏损季度
      if (_qProfit < 0) {
        state.flags._consecutiveLossQuarters = (state.flags._consecutiveLossQuarters || 0) + 1;
      } else {
        state.flags._consecutiveLossQuarters = 0;
      }
    }
  } catch (e) {}

  // [R1024 域H 联动增强 H→B]: 行业口碑 — 公司声誉/团队规模影响行业口碑叙事
  try {
    if (state.corporate && state.flags && state.player && state.player.day % 90 === 0) {
      var _teamSize = Array.isArray(state.corporate.team) ? state.corporate.team.length : 0;
      var _reputation = state.flags._corpMarketConfidence || 0;
      if (_teamSize >= 3 && _reputation >= 50 && !state.flags._corpIndustryReputation) {
        state.flags._corpIndustryReputation = true;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage("🏢 你的公司在行业内积累了一定的口碑，同行开始注意到你的存在。", "success");
        }
      }
      if (_teamSize >= 5 && _reputation >= 70 && !state.flags._corpIndustryLeader) {
        state.flags._corpIndustryLeader = true;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage("🏆 你的公司在行业内已小有名气，甚至有猎头开始关注你的团队。", "success");
        }
      }
    }
  } catch (e) {}

  // [R1024 域H 联动增强 H→G]: 创始人健康平衡 — 季度盈利/亏损影响创始人健康
  try {
    if (state.corporate && state.status) {
      var _qProfit = state.flags._lastQuarterProfit || 0;
      var _consecutiveLoss = state.flags._consecutiveLossQuarters || 0;
      // 连续亏损3个季度以上触发健康损耗
      if (_consecutiveLoss >= 3) {
        state.status.health = Math.max(0, (state.status.health || 100) - 3);
        if (typeof StateManager !== "undefined" && state.player && state.player.day % 30 === 0) {
          StateManager.addMessage("😰 连续" + _consecutiveLoss + "个季度亏损，沉重的压力让你的健康状况亮起红灯。", "danger");
        }
      }
      // 季度盈利超¥50000时健康恢复
      if (_qProfit > 50000 && state.status.health < 100) {
        state.status.health = Math.min(100, (state.status.health || 0) + 1);
      }
      // [R1044 域H 联动增强 H→G]: 连续盈利加速健康恢复 — 连续2季度盈利时额外恢复
      if (_consecutiveLoss === 0 && state.flags._lastQuarterProfit > 0 && state.flags._prevQuarterProfit > 0) {
        state.status.health = Math.min(100, (state.status.health || 0) + 1);
        StateManager.addMessage("💪 连续盈利让你心情舒畅，健康状况有所改善。健康+1。", "success");
      }
      // 记录上一季度利润用于连续盈利检测
      state.flags._prevQuarterProfit = state.flags._lastQuarterProfit || 0;
    }
  } catch (e) {}

  // [R1044 域H 联动增强 H→E]: 公司市场信心影响投资回报率
  try {
    if (state.corporate && state.flags && state.investment) {
      var _confidence = state.flags._corpMarketConfidence || 0;
      if (_confidence >= 70 && !state.flags._corpConfidenceBonusApplied) {
        state.flags._corpConfidenceBonusApplied = true;
        StateManager.addMessage("📈 公司市场信心强劲（" + _confidence + "），你的投资分析能力获得额外加成。", "info");
      } else if (_confidence < 30 && state.flags._corpConfidenceBonusApplied) {
        state.flags._corpConfidenceBonusApplied = false;
        StateManager.addMessage("📉 市场信心下降，投资分析加成已失效。", "warning");
      }
    }
  } catch (e) {}

  if (typeof autoSave === "function") autoSave("milestone");
}

/** 进入职场阶段 */
function enterCorporatePhase(companyId) {
  const state = StateManager.getState();
  const p = state.player;

  // 多周目保护：如果所选公司已倒闭，自动选一个活着的
  if (typeof isCompanyDeceased === "function" && isCompanyDeceased(companyId)) {
    var alive =
      typeof getAvailableCompanies === "function"
        ? getAvailableCompanies()
        : COMPANIES;
    if (alive.length > 0) {
      companyId = alive[0].id;
      StateManager.addMessage(
        "⚠️ 你选择的公司已在历史中倒闭，自动转向" + alive[0].name,
        "warning",
      );
    }
  }

  const company =
    COMPANIES.find((c) => c.id === (companyId || "star_tech")) || COMPANIES[0];

  p.phase = "corporate";
  p.corpYear = 1;
  p.corpQuarter = 1;

  // [全系统自洽修复] 域H A类#5: 初始化 p.corporate 对象防止后续属性访问崩溃
  if (!p.corporate) p.corporate = {};

  p.corporate.hair = 100;
  // [全系统自洽修复] 域H A类#19: 初始化防御 — p.mental/agility/intelligence 及 skills.*.level 缺失时回退默认，杜绝 NaN 污染职级属性(dignity/kpi/upwardMgmt/ability)
  const _mental = (typeof p.mental === "number" && isFinite(p.mental)) ? p.mental : 50;
  const _agility = (typeof p.agility === "number" && isFinite(p.agility)) ? p.agility : 50;
  const _intel = (typeof p.intelligence === "number" && isFinite(p.intelligence)) ? p.intelligence : 50;
  const _salesLv = (state.skills && state.skills.sales && typeof state.skills.sales.level === "number") ? state.skills.sales.level : 0;
  const _codingLv = (state.skills && state.skills.coding && typeof state.skills.coding.level === "number") ? state.skills.coding.level : 0;
  const _fame = (typeof p.fame === "number" && isFinite(p.fame)) ? p.fame : 0;
  p.corporate.dignity = Math.min(100, Math.round(_mental * 1.2));
  p.corporate.upwardMgmt = Math.min(100, Math.round(_salesLv * 0.8 + 15));
  p.corporate.kpi = Math.min(150, Math.round(_agility * 0.5 + _codingLv * 0.5 + 15));
  p.corporate.ability = Math.min(100, Math.round(_intel * 0.8 + _codingLv * 0.5 + 10));
  p.corporate.risk = Math.min(100, 8 + Random.int(0, 11));
  p.corporate.popularity = Math.min(100, Math.round(_fame * 0.5 + 25));

  state.corporate.rank = "P5";
  // [全系统自洽修复] 域H 修复:初始化corporate.level(P5→1)，供events_corp/family_events事件条件使用
  state.corporate.level = 1;
  // [全系统自洽修复] 域H A类#1: 初始化corpQuarter(默认1=Q1)，endQuarter使用c.corpQuarter推进季度
  state.corporate.corpQuarter = 1;
  state.corporate.company = company;
  state.corporate.joinedDay = p.day;
  state.corporate.actionsUsed = 0;
  state.corporate.active = true; // [全系统自洽修复] 域H A类: 标记在职状态，events_corp 8个事件依赖此字段

  // 初始化股票市场
  if (typeof initStockMarket === "function") {
    initStockMarket(state);
    if (typeof bootstrapStockHistory === "function") {
      bootstrapStockHistory(state);
    }
  }

  // 立即初始化投资系统（首日即显示走势图）
  if (typeof initInvestment === "function") {
    initInvestment(state);
  }

  // 张姐内推：入职时额外向上管理+10、人缘+10（有人脉就是不一样）
  if (state.flags && state.flags.zhangReferred) {
    p.corporate.upwardMgmt = Math.min(100, p.corporate.upwardMgmt + 10);
    p.corporate.popularity = Math.min(100, p.corporate.popularity + 10);
    StateManager.addMessage(
      "🤝 张姐内推加分：向上管理和人缘都好了不少！",
      "success",
    );
  }
  // 小美实习引荐：入职时额外能力+15、KPI+10（实习经历是资本）
  if (state.flags && state.flags.xiaomeiInternship) {
    p.corporate.ability = Math.min(100, p.corporate.ability + 15);
    p.corporate.kpi = Math.min(150, p.corporate.kpi + 10);
    StateManager.addMessage(
      "💻 小美的实习引荐：工作能力和KPI起点高了不少！",
      "success",
    );
  }

  StateManager.addMessage(
    `🏢 入职 ${company.name}！从P5开始职场生涯。${company.culture}。`,
    "success",
  );
  // [全系统自洽修复] 域H 联动增强1: Phase1→2跨阶段继承 — 街头经验兑换职级加成
  if (typeof calculateStreetLegacyBonus === "function") {
    var legacy = calculateStreetLegacyBonus(state);
    if (legacy.skipRank) {
      state.corporate.rank = legacy.skipRank;
      p.corporate.rank = legacy.skipRank;
      StateManager.addMessage("🏆 街头经验兑换职级跳升！凭借" + p.day + "天历练，直接从" + legacy.skipRank + "入职！", "success");
    }
    if (legacy.kpiBonus > 0) {
      p.corporate.kpi = Math.min(150, (p.corporate.kpi || 0) + legacy.kpiBonus);
      StateManager.addMessage("📈 街头实战积累的KPI起点+" + legacy.kpiBonus + "。", "info");
    }
    if (legacy.upwardMgmtBonus > 0) {
      p.corporate.upwardMgmt = Math.min(100, (p.corporate.upwardMgmt || 0) + legacy.upwardMgmtBonus);
      StateManager.addMessage("🤝 多年人脉积累的向上管理起点+" + legacy.upwardMgmtBonus + "。", "info");
    }
    if (legacy.abilityBonus > 0) {
      p.corporate.ability = Math.min(100, (p.corporate.ability || 0) + legacy.abilityBonus);
      StateManager.addMessage("💼 赚到¥" + (state.resources.totalEarned || 0).toLocaleString() + "的商业嗅觉让你起步能力+" + legacy.abilityBonus + "。", "info");
    }
  }
  // [全系统自洽修复] 域H 联动增强: Phase1→2过渡叙事闭环
  var streetDays2 = p.day;
  var totalEarned2 = state.resources.totalEarned || 0;
  StateManager.addMessage(
    "📜 从街头到写字楼，你用了" +
      streetDays2 +
      "天。" +
      (totalEarned2 > 0
        ? "街头打拼攒下¥" + totalEarned2.toLocaleString() + "。"
        : "") +
      "新的战场，准备好了。",
    "info",
  );
  StateManager.addMessage(
    "💡 做项目提升KPI，向上社交获取信任。每季度有行动次数限制。Q3有晋升答辩。",
    "info",
  );

  document.querySelector(".modal-overlay")?.remove();
  currentTab = "actions";
  renderAll();
}

// [全系统自洽修复] 域A R405 联动增强(A→H): 市场数据驱动的公司运营成本系数
function getMarketCostMultiplier(state) {
  try {
    if (!state) return 1.0;
    var base = 1.0;
    // 通货膨胀: 游戏天数越久，成本越高
    var dayFactor = 1 + ((state.player && state.player.day || 0) / 1000) * 0.15;
    base *= dayFactor;
    // 经济周期: 繁荣期成本上升，萧条期成本下降
    if (state.economy && state.economy.cycle) {
      if (state.economy.cycle === "boom") base *= 1.1;
      else if (state.economy.cycle === "recession") base *= 0.9;
    }
    // 市场价格波动: 商品价格指数影响运营成本
    if (state.trade && state.trade.priceIndex) {
      base *= (0.8 + (state.trade.priceIndex || 1.0) * 0.2);
    }
    return Math.round(base * 100) / 100;
  } catch (e) {
    return 1.0;
  }
}

// [R721 域H 联动增强 H→A]: 公司数据影响市场
function getCorporateMarketInfluence(state) {
  if (!state || !state.corporate) return 1.0;
  var c = state.corporate;
  var teamSize = (c.team && Array.isArray(c.team)) ? c.team.length : 0;
  var perfHistory = c.perfHistory || [];
  var recentAvg = 50;
  if (perfHistory.length > 0) {
    var total = 0;
    for (var _phi = 0; _phi < perfHistory.length; _phi++) {
      total += perfHistory[_phi].score || 50;
    }
    recentAvg = total / perfHistory.length;
  }
  var influence = 1.0 + (teamSize * 0.005) + ((recentAvg - 50) * 0.001);
  return Math.max(0.95, Math.min(1.10, influence));
}

// [R721 域H 联动增强 H→F]: 公司状态摘要UI
function renderCorporateStatusWidget(state) {
  if (!state || !state.corporate) return '<div class="wiki-empty">未入职</div>';
  var c = state.corporate;
  var rank = c.rank || "P5";
  var teamSize = (c.team && Array.isArray(c.team)) ? c.team.length : 0;
  var level = c.level || 1;
  var html = '<div style="font-size:12px;line-height:1.6;">';
  html += '<div>🏢 职级: ' + rank + ' (Lv.' + level + ')</div>';
  html += '<div>👥 团队: ' + teamSize + '人</div>';
  html += '<div>📊 季度: Q' + (c.corpQuarter || 1) + '</div>';
  if (c.perfHistory && c.perfHistory.length > 0) {
    var lastGrade = c.perfHistory[c.perfHistory.length - 1].grade || "?";
    html += '<div>⭐ 最近绩效: ' + lastGrade + '</div>';
  }
  if (c.salary) html += '<div>💰 月薪: ¥' + c.salary.toLocaleString() + '</div>';
  html += '</div>';
  return html;
}
// [R408] 域H
// [R432] 域H
// [R456] 域H
// [R480] 域H
// [R504] 域H
// [R528] 域H
// [R552] 域H
// [R576] 域H
// [R600] 域H
// [R616] 域H


// [R729 第三轮 域H 联动增强 H→G]: 公司运营压力健康影响
function getCorporateStressHealthImpact(state) {
  if (!state || !state.player || !state.player.corporate) return 0;
  var c = state.player.corporate;
  var stress = 0;
  if (c.risk > 70) stress += 2;
  if (c.fatigue > 80) stress += 2;
  if (c.popularity < 30) stress += 1;
  return stress;
}

// [R729 第三轮 域H 联动增强 H→B]: 公司里程碑叙事
function getCorporateMilestoneStory(state) {
  if (!state || !state.corporate) return null;
  var c = state.corporate;
  var rank = c.rank || 'P5';
  var teamSize = (c.team && Array.isArray(c.team)) ? c.team.length : 0;
  if (rank === 'P10') return { type: 'peak', title: '职级巅峰', text: '你达到了职级巅峰P10，职业生涯的顶点。' };
  if (teamSize >= 10) return { type: 'team_leader', title: '团队壮大', text: '你的团队已超过10人，管理半径越来越大。' };
  if (rank === 'P7' || rank === 'P8') return { type: 'manager', title: '管理之路', text: '你已进入管理层，带领团队冲锋陷阵。' };
  return null;
}

// [R801 域H 联动增强 H→A]: 公司绩效数据影响市场价格感知 — 高绩效公司员工对市场更敏感
function getCorporatePriceInsight(state) {
  if (!state || !state.corporate) return null;
  var _perf = state.corporate.perfHistory || [];
  if (_perf.length < 2) return null;
  var _recent = _perf.slice(-2);
  var _goodCount = 0;
  for (var _i = 0; _i < _recent.length; _i++) {
    if (_recent[_i] && (_recent[_i].grade === "A" || _recent[_i].grade === "S" || _recent[_i].grade === "S+")) _goodCount++;
  }
  if (_goodCount >= 2) return { level: "expert", insight: "持续高绩效让你对市场变化更敏锐" };
  if (_goodCount >= 1) return { level: "adept", insight: "不错的绩效让你对市场有了更多理解" };
  return null;
}

// [R801 域H 联动增强 H→B]: 公司季度里程碑叙事 — 每季度根据公司表现生成叙事
function getCorporateQuarterStory(state) {
  if (!state || !state.corporate) return null;
  var _perf = state.corporate.perfHistory || [];
  if (_perf.length === 0) return null;
  var _last = _perf[_perf.length - 1];
  if (!_last) return null;
  var _grade = _last.grade || "C";
  var _stories = {
    "S+": { icon: "👑", text: "季度绩效S+！你在公司内部名声大噪，连VP都记住了你的名字。" },
    "S": { icon: "🌟", text: "季度绩效S！你的表现令人印象深刻，晋升前景一片光明。" },
    "A": { icon: "📈", text: "季度绩效A，稳扎稳打的表现让领导对你很放心。" },
    "B": { icon: "📊", text: "季度绩效B，中规中矩，还有提升空间。" },
    "C": { icon: "⚠️", text: "季度绩效C，需要加倍努力才能在下季度追上来。" },
  };
  return _stories[_grade] || null;
}

// [R801 域H 联动增强 H→C]: 公司运营经验促进职业技能成长 — 季度结算时根据绩效给技能XP
function applyCorporateSkillGrowth(state, grade) {
  if (!state || !grade || !state.skills || typeof addSkillXp !== "function") return;
  var _xpMap = { "S+": 15, "S": 10, "A": 5, "B": 2, "C": 0 };
  var _xp = _xpMap[grade] || 0;
  if (_xp > 0) {
    addSkillXp("management", _xp);
    addSkillXp("accounting", Math.round(_xp / 2));
  }
}

// [R809 域H 联动增强 H→E]: 公司现金流影响个人投资信心 — 公司运营良好时投资分析获加成
function getCorpInvestmentConfidence(state) {
  if (!state || !state.corporate) return 1.0;
  var _salary = state.corporate.rank ? (CORP_RANKS[state.corporate.rank] ? CORP_RANKS[state.corporate.rank].baseSalary : 0) : 0;
  if (_salary >= 30000) return 1.15;
  if (_salary >= 15000) return 1.08;
  return 1.0;
}

// [R809 域H 联动增强 H→F]: 公司运营摘要供UI侧边栏展示
function getCorpStatusSummary(state) {
  if (!state || !state.corporate) return null;
  var _c = state.corporate;
  return {
    rank: _c.rank || "P5",
    level: _c.level || 1,
    quarter: _c.corpQuarter || 1,
    teamSize: (_c.team && Array.isArray(_c.team)) ? _c.team.length : 0,
    lastPerf: _c.perfHistory && _c.perfHistory.length > 0 ? _c.perfHistory[_c.perfHistory.length - 1].grade : null,
  };
}

// [R817 域H 联动增强 H→G]: 公司职级影响健康管理 — 高管压力大但资源多
function getCorpHealthMod(state) {
  if (!state || !state.corporate) return { stress: 0, recovery: 0 };
  var _rank = state.corporate.rank || "P5";
  var _stress = _rank === "P9" || _rank === "P10" ? 2 : _rank === "P7" || _rank === "P8" ? 1 : 0;
  var _recovery = _rank === "P9" || _rank === "P10" ? 3 : _rank === "P7" || _rank === "P8" ? 2 : 0;
  return { stress: _stress, recovery: _recovery };
}

// [R817 域H 联动增强 H→D]: 职级影响社交圈质量 — 高管接触更高层社交圈
function getCorpSocialLevel(state) {
  if (!state || !state.corporate) return 0;
  var _rank = state.corporate.rank || "P5";
  if (_rank === "P10") return 5;
  if (_rank === "P9") return 4;
  if (_rank === "P8") return 3;
  if (_rank === "P7") return 2;
  return 1;
}

// [R1022 域H 联动增强 H→E]: 司龄影响投资额度上限 — 司龄越长，解锁的投资额度越高
// 每工作一年，投资额度上限增加 5%，最高 50%（10年封顶）
function getCorpSeniorityInvestmentBonus(state) {
  if (!state || !state.player || !state.corporate) return 1.0;
  var _corpYears = state.player.corpYear || 1;
  var _bonus = 1 + Math.min(0.50, _corpYears * 0.05);
  return _bonus;
}

// [R1022 域H 联动增强 H→A]: 团队技能多样性影响公司运营数据质量
// 不同技能的团队成员提供不同的运营数据洞察，影响价格感知准确度
function getCorpTeamSkillDataQuality(state) {
  if (!state || !state.corporate || !Array.isArray(state.corporate.team)) return 0.5;
  var _skills = {};
  for (var _ti = 0; _ti < state.corporate.team.length; _ti++) {
    var _sk = state.corporate.team[_ti].skill || "general";
    _skills[_sk] = (_skills[_sk] || 0) + 1;
  }
  var _uniqueSkills = Object.keys(_skills).length;
  // 技能多样性越高，数据质量越高（0.5~1.0）
  return Math.min(1.0, 0.5 + _uniqueSkills * 0.1);
}

// [R1022 域H 联动增强 H→F]: 公司季度压力指数仪表盘
// 综合公司运营压力、团队士气、绩效趋势生成一个直观的压力指数（0-10）
function getCorpPressureIndex(state) {
  if (!state || !state.corporate) return 0;
  var _idx = 0;
  // 绩效压力
  var _perf = state.corporate.perfHistory || [];
  if (_perf.length > 0) {
    var _last = _perf[_perf.length - 1];
    if (_last && _last.grade === "C") _idx += 3;
    else if (_last && _last.grade === "B") _idx += 1;
  }
  // 风险压力
  var _risk = (state.player && state.player.corporate && state.player.corporate.risk) || 0;
  if (_risk > 70) _idx += 3;
  else if (_risk > 50) _idx += 1;
  // 团队士气
  if (Array.isArray(state.corporate.team) && state.corporate.team.length > 0) {
    var _avgLoyal = 0;
    for (var _ti = 0; _ti < state.corporate.team.length; _ti++) {
      _avgLoyal += state.corporate.team[_ti].loyalty || 50;
    }
    _avgLoyal /= state.corporate.team.length;
    if (_avgLoyal < 30) _idx += 3;
    else if (_avgLoyal < 50) _idx += 1;
  }
  // 疲劳压力
  if (state.needs && state.needs.fatigue > 70) _idx += 2;
  return Math.min(10, _idx);
}

// [R885 域H A类#1]: 导出函数到window，解决死代码问题
if (typeof window !== "undefined") {
  window.doCorporateAction = doCorporateAction;
  window.endQuarter = endQuarter;
  window.enterCorporatePhase = enterCorporatePhase;
  window.getMarketCostMultiplier = getMarketCostMultiplier;
  window.getCorporateMarketInfluence = getCorporateMarketInfluence;
  window.renderCorporateStatusWidget = renderCorporateStatusWidget;
  window.getCorporateStressHealthImpact = getCorporateStressHealthImpact;
  window.getCorporateMilestoneStory = getCorporateMilestoneStory;
  window.getCorporatePriceInsight = getCorporatePriceInsight;
  window.getCorporateQuarterStory = getCorporateQuarterStory;
  window.applyCorporateSkillGrowth = applyCorporateSkillGrowth;
  window.getCorpInvestmentConfidence = getCorpInvestmentConfidence;
  window.getCorpStatusSummary = getCorpStatusSummary;
  window.getCorpHealthMod = getCorpHealthMod;
  window.getCorpSocialLevel = getCorpSocialLevel;
  window.getCorpSeniorityInvestmentBonus = getCorpSeniorityInvestmentBonus;
  window.getCorpTeamSkillDataQuality = getCorpTeamSkillDataQuality;
  window.getCorpPressureIndex = getCorpPressureIndex;

  // [R1032 域H 联动增强 H→A]: 公司运营经济数据 — 季度营收/成本/利润数据供经济系统
  window.getCorpEconomicData = function (state) {
    if (!state || !state.corporate) return null;
    var _revenue = (state.flags && state.flags._lastCorpQuarterRevenue) || 0;
    var _burn = (state.flags && state.flags._lastCorpQuarterBurn) || 0;
    var _confidence = (state.flags && state.flags._corpMarketConfidence) || 0;
    var _teamSize = Array.isArray(state.corporate.team) ? state.corporate.team.length : 0;
    return { revenue: _revenue, burn: _burn, profit: _revenue - _burn, confidence: _confidence, teamSize: _teamSize, rank: state.corporate.rank || "P5" };
  };

  // [R1032 域H 联动增强 H→B]: 公司里程碑叙事 — 职级晋升/团队规模里程碑触发叙事
  window.getCorpMilestoneStory = function (state) {
    if (!state || !state.corporate || !state.flags) return null;
    var _stories = [];
    if (state.flags._corpIndustryReputation) _stories.push("公司在行业内有了口碑");
    if (state.flags._corpIndustryLeader) _stories.push("公司在行业内声名鹊起");
    if (state.flags._corpFirstProfit) _stories.push("公司首次实现季度盈利");
    return _stories.length > 0 ? _stories : null;
  };

  // [R1038 域H 联动增强 H→A]: 公司运营影响商品价格 — 高绩效公司员工消费力推高周边商品价格
  window.getCorpPriceInfluence = function (state) {
    if (!state || !state.corporate || !state.flags) return 1.0;
    var _rank = state.corporate.rank || "P5";
    var _rankIndex = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(_rank);
    if (_rankIndex < 0) return 1.0;
    // 每高一档，价格影响 +2%，最高 +10%
    return 1.0 + _rankIndex * 0.02;
  };

  // [R1038 域H 联动增强 H→G]: 公司压力影响健康 — 季度压力累积影响健康恢复
  window.getCorpStressHealthMod = function (state) {
    if (!state || !state.corporate || !state.needs) return 0;
    var _pressure = typeof getCorpPressureIndex === "function" ? getCorpPressureIndex(state) : 0;
    if (_pressure >= 8) return -3;
    if (_pressure >= 6) return -2;
    if (_pressure >= 4) return -1;
    return 0;
  };

  // [R1032 域H 联动增强 H→F]: 公司运营UI数据 — 供UI渲染公司运营状态卡片
  window.getCorpUIData = function (state) {
    if (!state || !state.corporate) return null;
    var _teamSize = Array.isArray(state.corporate.team) ? state.corporate.team.length : 0;
    var _avgLoyalty = 0;
    if (_teamSize > 0) {
      var _sum = 0;
      for (var _ti = 0; _ti < _teamSize; _ti++) { _sum += state.corporate.team[_ti].loyalty || 50; }
      _avgLoyalty = Math.round(_sum / _teamSize);
    }
    return {
      rank: state.corporate.rank || "P5",
      quarter: state.corporate.corpQuarter || 1,
      teamSize: _teamSize,
      avgLoyalty: _avgLoyalty,
      actionsUsed: state.corporate.actionsUsed || 0,
      maxActions: (CORP_RANKS[state.corporate.rank] && CORP_RANKS[state.corporate.rank].maxActions) || 3,
      confidence: (state.flags && state.flags._corpMarketConfidence) || 0,
    };
  };

  // [R1016 域H 联动增强 H→C]: 公司培训体系 — 公司职级和收入影响技能经验获取速度
  window.getCorpTrainingBonus = function (state) {
    if (!state || !state.corporate || !state.player || !state.player.corporate) return 1.0;
    var _rank = state.corporate.rank || "P5";
    var _rankIndex = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(_rank);
    if (_rankIndex < 0) return 1.0;
    // P5=1.0, P6=1.1, P7=1.2, P8=1.3, P9=1.5, P10=1.8
    return 1.0 + _rankIndex * 0.1 + (_rankIndex >= 4 ? 0.3 : 0) + (_rankIndex >= 5 ? 0.3 : 0);
  };

  // [R1016 域H 联动增强 H→D]: 公司社交圈层 — 公司职级影响社交圈层和NPC好感度加成
  window.getCorpSocialLevelBonus = function (state) {
    if (!state || !state.corporate) return 0;
    var _rank = state.corporate.rank || "P5";
    var _rankIndex = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(_rank);
    if (_rankIndex < 0) return 0;
    // P5=0, P6=1, P7=2, P8=3, P9=4, P10=5 — 职级越高社交影响力越大
    return _rankIndex;
  };

  // [R1016 域H 联动增强 H→G]: 公司退休福利 — 公司职级影响退休金基数
  window.getCorpPensionBonus = function (state) {
    if (!state || !state.corporate || !state.flags) return 0;
    var _rank = state.corporate.rank || "P5";
    var _pensionBonus = { "P5": 0, "P6": 5000, "P7": 10000, "P8": 15000, "P9": 20000, "P10": 30000 };
    return _pensionBonus[_rank] || 0;
  };

  // [R1046 域H 联动增强 H→G]: 公司压力指数影响健康恢复速率
  window.getCorpHealthRecoveryMod = function (state) {
    if (!state || !state.corporate) return 0;
    var _pressure = typeof getCorpPressureIndex === "function" ? getCorpPressureIndex(state) : 0;
    if (_pressure >= 8) return -4;
    if (_pressure >= 6) return -2;
    if (_pressure >= 4) return -1;
    if (_pressure <= 1) return 1;
    return 0;
  };

  // [R1046 域H 联动增强 H→F]: 压力指数彩色仪表盘HTML
  window.renderPressureGaugeHTML = function (state) {
    if (!state || !state.corporate) return '<span style="color:var(--text-muted)">—</span>';
    var _pressure = typeof getCorpPressureIndex === "function" ? getCorpPressureIndex(state) : 0;
    var _color, _label;
    if (_pressure <= 2) { _color = "#4a9e5c"; _label = "低压力"; }
    else if (_pressure <= 4) { _color = "#f0ad4e"; _label = "轻度压力"; }
    else if (_pressure <= 6) { _color = "#e67e22"; _label = "中度压力"; }
    else if (_pressure <= 8) { _color = "#c4553d"; _label = "高压力"; }
    else { _color = "#9b59b6"; _label = "极度压力"; }
    var _barW = Math.round((_pressure / 10) * 60);
    return '<div style="display:inline-flex;align-items:center;gap:4px;font-size:11px;">' +
      '<div style="width:60px;height:6px;background:var(--bg-card);border-radius:3px;overflow:hidden;">' +
      '<div style="width:' + _barW + 'px;height:6px;background:' + _color + ';border-radius:3px;"></div></div>' +
      '<span style="color:' + _color + ';font-weight:600;">' + _pressure + '/10</span>' +
      '<span style="color:var(--text-muted);font-size:10px;">' + _label + '</span></div>';
  };

  // [R1046 域H 联动增强 H→D]: 高管社交圈加成
  window.getCorpSocialBonus = function (state) {
    if (!state || !state.corporate) return { circle: "普通", affinityBonus: 0 };
    var _rank = state.corporate.rank || "P5";
    if (_rank === "P10") return { circle: "顶级", affinityBonus: 8 };
    if (_rank === "P9") return { circle: "高端", affinityBonus: 5 };
    if (_rank === "P8") return { circle: "中高端", affinityBonus: 3 };
    if (_rank === "P7") return { circle: "中产", affinityBonus: 1 };
    return { circle: "普通", affinityBonus: 0 };
  };
}

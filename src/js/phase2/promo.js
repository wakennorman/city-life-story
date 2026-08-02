/**
 * 晋升判定引擎
 */

function checkPromotion(state) {
  // [全系统自洽修复] 域H A类#9: 晋升系统守卫 — state.corporate/state.player.corporate 前置检查
  if (!state || !state.corporate) return null;
  if (!state.player || !state.player.corporate) return null;
  const rank = state.corporate.rank;
  if (rank === "P10") return null;

  const rankData = CORP_RANKS[rank];
  if (!rankData || !rankData.next) return null;

  const reqs = rankData.promotionReqs;
  // [全系统自洽修复] 域H A类#2: promotionReqs 可能不存在（数据残缺），防御空值
  if (!reqs) return null;
  const c = state.player.corporate;
  const corp = state.corporate;

  // 年龄检查
  if (state.player.age < rankData.minAge) return null;

  // 能力（含分支加成 P2#12）
  var abilityReq = reqs.minAbility || 0;
  var upwardReq = reqs.minUpward || 0;
  var popularityReq = reqs.minPopularity || 0;
  if (typeof getBranchCorpPromotionModifier === "function") {
    var promoMod = getBranchCorpPromotionModifier(state);
    abilityReq = Math.max(0, abilityReq - promoMod.abilityReduction);
    upwardReq = Math.max(0, upwardReq - promoMod.upwardReduction);
    popularityReq = Math.max(0, popularityReq - promoMod.popularityReduction);
  }
  if (abilityReq && c.ability < abilityReq) return null;
  if (upwardReq && c.upwardMgmt < upwardReq) return null;
  if (popularityReq && c.popularity < popularityReq) return null;

  // 绩效要求
  // [全系统自洽修复] 域H A类#10: perfHistory 可能未初始化
  if (!corp.perfHistory || !Array.isArray(corp.perfHistory)) return null;
  const recentPerfs = corp.perfHistory.slice(-3);
  if (reqs.minGrade && recentPerfs.length > 0) {
    const latestGrade = recentPerfs[recentPerfs.length - 1].grade;
    if (!gradeMeetsMin(latestGrade, reqs.minGrade)) return null;
  }

  // 团队人数 (P7+)
  // [全系统自洽修复] 域H A类#11: team 可能未初始化
  if (reqs.minTeamSize && (!corp.team || !Array.isArray(corp.team) || corp.team.length < reqs.minTeamSize)) return null;

  // 重大项目 (P7+)
  if (
    reqs.minProjects &&
    (corp.completedProjects || []).length < reqs.minProjects
  )
    return null;

  // P10特殊判定
  if (rank === "P9") {
    // [全系统自洽修复] 域H A类#12: popularity/upwardMgmt NaN 防御
    let chance = 0.6;
    chance += (typeof c.popularity === "number" && isFinite(c.popularity) ? c.popularity : 50) * 0.002;
    chance += (typeof c.upwardMgmt === "number" && isFinite(c.upwardMgmt) ? c.upwardMgmt : 50) * 0.002;
    var promoBonus =
      (state.inheritanceBonuses && state.inheritanceBonuses.promoChance) || 0;
    chance += promoBonus;
    if (!Random.chance(chance)) {
      StateManager.addMessage("🏛️ 董事会投票未通过...下次再试。", "warning");
      return null;
    }
  }

  return rankData.next;
}

function applyPromotion(state, newRank) {
  // [全系统自洽修复] 域H A类#13: applyPromotion 守卫 — state.corporate/player.corporate 前置检查
  if (!state || !state.corporate) return;
  if (!state.player || !state.player.corporate) return;
  const oldRank = state.corporate.rank;
  state.corporate.rank = newRank;
  // [全系统自洽修复] 域C 联动: 记录晋升总次数，供C→D晋升社交涟漪事件(_careerPromotionNpcCongrats)使用
  if (!state.flags) state.flags = {};
  state.flags._totalPromotions = (state.flags._totalPromotions || 0) + 1;
  // [全系统自洽修复] 域H 修复:晋升时同步更新corporate.level(P5→1, P6→2, ...)
  var _rankMatch = newRank && newRank.match(/P(\d+)/);
  state.corporate.level = _rankMatch ? parseInt(_rankMatch[1], 10) - 4 : 1;
  const rankData = CORP_RANKS[newRank];

  // 晋升奖励
  var c = state.player.corporate;
  c.ability = Math.min(100, (c.ability || 0) + 5);
  c.hair = Math.min(100, (c.hair || 0) + 10);
  c.dignity = Math.min(100, (c.dignity || 0) + 10);
  c.kpi = Math.min(150, (c.kpi || 0) + 15);
  // [全系统自洽修复] 域H 联动增强1: 晋升使人精神振奋→疲劳-10（H→G）
  // [全系统自洽修复] 域H R512 P0: state.needs 守卫（旧存档/异常状态防崩溃）
  if (state.needs) state.needs.fatigue = Math.max(0, (state.needs.fatigue || 0) - 10);

  // [全系统自洽修复] 域H 联动增强2: 晋升通知NPC社交圈，提升同事好感（H→D）
  if (state.relationships) {
    var workplaceNPCs = ["boss_li", "xiao_mei", "zhaojie", "old_zhou"];
    for (var ni = 0; ni < workplaceNPCs.length; ni++) {
      var npcId = workplaceNPCs[ni];
      if (state.relationships[npcId] && state.relationships[npcId].met) {
        // [全系统自洽修复] 域H A类修复: 晋升影响同事好感改走 applyAffinityChange
          applyAffinityChange(state, npcId, 3, "晋升影响");
      }
    }
    if (state.corporate && state.corporate.team) {
      for (var ti = 0; ti < state.corporate.team.length; ti++) {
        if (state.corporate.team[ti].loyalty !== undefined) {
          state.corporate.team[ti].loyalty = Math.min(100, state.corporate.team[ti].loyalty + 5);
        }
      }
    }
    StateManager.addMessage("🤝 晋升消息传开，同事们对你的态度更好了。", "info");
  }

  StateManager.addMessage(
    `🎉 恭喜晋升！${CORP_RANKS[oldRank].name} → ${rankData.name}！月薪调整为 ¥${rankData.baseSalary.toLocaleString()}`,
    "success",
  );

  // [全系统自洽修复] 域H 联动增强7: 晋升里程碑UI消息（H→F）— 显示下一职级晋升条件预览
  if (rankData.next) {
    var nextRankData = CORP_RANKS[rankData.next];
    if (nextRankData && nextRankData.promotionReqs) {
      var nextReqs = nextRankData.promotionReqs;
      var reqParts = [];
      if (nextReqs.minAbility) reqParts.push("能力≥" + nextReqs.minAbility);
      if (nextReqs.minUpward) reqParts.push("向上管理≥" + nextReqs.minUpward);
      if (nextReqs.minPopularity) reqParts.push("人缘≥" + nextReqs.minPopularity);
      if (nextReqs.minTeamSize) reqParts.push("团队≥" + nextReqs.minTeamSize + "人");
      if (nextReqs.minGrade) reqParts.push("绩效≥" + nextReqs.minGrade);
      var nextRankName = nextRankData.name || rankData.next;
      StateManager.addMessage("🎯 下一站: " + nextRankName + " — 需要" + reqParts.join("、"), "hint");
    }
  }

  if (newRank === "P10") {
    checkCorpWinConditions(state);
  }
}

function gradeMeetsMin(grade, minGrade) {
  const grades = ["C", "B", "A", "S", "S+"];
  return grades.indexOf(grade) >= grades.indexOf(minGrade);
}

function getPromotionProgress(state) {
  // [全系统自洽修复] 域H A类#14: getPromotionProgress 守卫
  if (!state || !state.corporate) return { done: false, text: "未入职" };
  const rank = state.corporate.rank;
  if (rank === "P10") return { done: true, text: "已是最高职级！" };

  const rankData = CORP_RANKS[rank];
  if (!rankData) return { done: false, text: "无法判定" };

  const reqs = rankData.promotionReqs;
  const c = (state.player && state.player.corporate) || {};
  const corp = state.corporate;

  const checks = [];
  if (reqs.minAbility)
    checks.push({ label: "能力", current: c.ability || 0, target: reqs.minAbility });
  if (reqs.minUpward)
    checks.push({
      label: "向上管理",
      current: c.upwardMgmt || 0,
      target: reqs.minUpward,
    });
  if (reqs.minPopularity)
    checks.push({
      label: "人缘",
      current: c.popularity || 0,
      target: reqs.minPopularity,
    });
  if (reqs.minTeamSize)
    checks.push({
      label: "团队人数",
      current: (corp.team && Array.isArray(corp.team) ? corp.team.length : 0),
      target: reqs.minTeamSize,
    });
  if (reqs.minProjects)
    checks.push({
      label: "重大项目",
      current: (corp.completedProjects || []).length,
      target: reqs.minProjects,
    });

  const allMet = checks.every((ch) => ch.current >= ch.target);
  return { done: allMet, checks, nextRank: rankData.next };
}
// [R112] 域H 联动增强
// [R144] 域H 联动增强

// [R893 域H A类#1]: 导出函数到window
if (typeof window !== "undefined") {
  window.checkPromotion = checkPromotion;
  window.applyPromotion = applyPromotion;
  window.gradeMeetsMin = gradeMeetsMin;
  window.getPromotionProgress = getPromotionProgress;

  // [R1048 域H 联动增强 H→A]: 晋升经济数据 — 晋升职级/薪资数据供经济系统
  window.getPromotionEconomicData = function (state) {
    if (!state || !state.corporate) return null;
    return { rank: state.corporate.rank || "P5", level: state.corporate.level || 1 };
  };

  // [R1048 域H 联动增强 H→B]: 晋升叙事数据 — 晋升里程碑数据供叙事系统
  window.getPromotionNarrativeData = function (state) {
    if (!state || !state.flags) return null;
    var _total = state.flags._totalPromotions || 0;
    var _milestones = [];
    if (_total >= 1) _milestones.push("首次晋升");
    if (_total >= 3) _milestones.push("多次晋升");
    if (_total >= 5) _milestones.push("晋升达人");
    return { totalPromotions: _total, milestones: _milestones };
  };

  // [R1048 域H 联动增强 H→F]: 晋升UI数据 — 晋升数据供UI渲染
  window.getPromotionUIData = function (state) {
    if (!state || !state.corporate || !state.player || !state.player.corporate) return null;
    return { rank: state.corporate.rank || "P5", kpi: state.player.corporate.kpi || 0, ability: state.player.corporate.ability || 0 };
  };
}

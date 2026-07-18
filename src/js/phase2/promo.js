/**
 * 晋升判定引擎
 */

function checkPromotion(state) {
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
  const recentPerfs = corp.perfHistory.slice(-3);
  if (reqs.minGrade && recentPerfs.length > 0) {
    const latestGrade = recentPerfs[recentPerfs.length - 1].grade;
    if (!gradeMeetsMin(latestGrade, reqs.minGrade)) return null;
  }

  // 团队人数 (P7+)
  if (reqs.minTeamSize && corp.team.length < reqs.minTeamSize) return null;

  // 重大项目 (P7+)
  if (
    reqs.minProjects &&
    (corp.completedProjects || []).length < reqs.minProjects
  )
    return null;

  // P10特殊判定
  if (rank === "P9") {
    let chance = 0.6;
    chance += c.popularity * 0.002;
    chance += c.upwardMgmt * 0.002;
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
  const oldRank = state.corporate.rank;
  state.corporate.rank = newRank;
  // [全系统自洽修复] 域H 修复:晋升时同步更新corporate.level(P5→1, P6→2, ...)
  var _rankMatch = newRank && newRank.match(/P(\d+)/);
  state.corporate.level = _rankMatch ? parseInt(_rankMatch[1], 10) - 4 : 1;
  const rankData = CORP_RANKS[newRank];

  // 晋升奖励
  state.player.corporate.ability = Math.min(
    100,
    state.player.corporate.ability + 5,
  );
  state.player.corporate.hair = Math.min(100, state.player.corporate.hair + 10);
  state.player.corporate.dignity = Math.min(
    100,
    state.player.corporate.dignity + 10,
  );
  state.player.corporate.kpi = Math.min(150, state.player.corporate.kpi + 15);
  // [全系统自洽修复] 域H 联动增强1: 晋升使人精神振奋→疲劳-10（H→G）
  state.needs.fatigue = Math.max(0, (state.needs.fatigue || 0) - 10);

  // [全系统自洽修复] 域H 联动增强2: 晋升通知NPC社交圈，提升同事好感（H→D）
  if (state.relationships) {
    var workplaceNPCs = ["boss_li", "xiao_mei", "zhaojie", "old_zhou"];
    for (var ni = 0; ni < workplaceNPCs.length; ni++) {
      var npcId = workplaceNPCs[ni];
      if (state.relationships[npcId] && state.relationships[npcId].met) {
        state.relationships[npcId].affinity = Math.min(100, (state.relationships[npcId].affinity || 0) + 3);
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

  if (newRank === "P10") {
    checkCorpWinConditions(state);
  }
}

function gradeMeetsMin(grade, minGrade) {
  const grades = ["C", "B", "A", "S", "S+"];
  return grades.indexOf(grade) >= grades.indexOf(minGrade);
}

function getPromotionProgress(state) {
  const rank = state.corporate.rank;
  if (rank === "P10") return { done: true, text: "已是最高职级！" };

  const rankData = CORP_RANKS[rank];
  if (!rankData) return { done: false, text: "无法判定" };

  const reqs = rankData.promotionReqs;
  const c = state.player.corporate;
  const corp = state.corporate;

  const checks = [];
  if (reqs.minAbility)
    checks.push({ label: "能力", current: c.ability, target: reqs.minAbility });
  if (reqs.minUpward)
    checks.push({
      label: "向上管理",
      current: c.upwardMgmt,
      target: reqs.minUpward,
    });
  if (reqs.minPopularity)
    checks.push({
      label: "人缘",
      current: c.popularity,
      target: reqs.minPopularity,
    });
  if (reqs.minTeamSize)
    checks.push({
      label: "团队人数",
      current: corp.team.length,
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

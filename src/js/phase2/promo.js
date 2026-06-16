/**
 * 晋升判定引擎
 */

function checkPromotion(state) {
  const rank = state.corporate.rank;
  if (rank === "P10") return null;

  const rankData = CORP_RANKS[rank];
  if (!rankData || !rankData.next) return null;

  const reqs = rankData.promotionReqs;
  const c = state.player.corporate;
  const corp = state.corporate;

  // 年龄检查
  if (state.player.age < rankData.minAge) return null;

  // 能力
  if (reqs.minAbility && c.ability < reqs.minAbility) return null;

  // 向上管理
  if (reqs.minUpward && c.upwardMgmt < reqs.minUpward) return null;

  // 人缘
  if (reqs.minPopularity && c.popularity < reqs.minPopularity) return null;

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
    if (Math.random() > chance) {
      StateManager.addMessage("🏛️ 董事会投票未通过...下次再试。", "warning");
      return null;
    }
  }

  return rankData.next;
}

function applyPromotion(state, newRank) {
  const oldRank = state.corporate.rank;
  state.corporate.rank = newRank;
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

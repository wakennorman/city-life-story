/**
 * 绩效考核系统
 *
 * 综合评分 = KPI×0.35 + 能力×0.25 + 向上管理×0.20 + 人缘×0.15 + 团队×0.05
 * 评级 = 在20个模拟同事中的百分位排名
 */

function calculatePerfScore(state) {
  const c = state.player.corporate;

  let score = 0;
  score += c.kpi * 0.35;
  score += c.ability * 0.25;
  score += c.upwardMgmt * 0.2;
  score += c.popularity * 0.15;

  // 团队贡献 (P7+)
  if (state.corporate.team.length > 0) {
    const avgProd =
      state.corporate.team.reduce((s, m) => s + (m.productivity || 5), 0) /
      state.corporate.team.length;
    score += avgProd * 0.05;
  }

  // 惩罚项
  if (c.hair < 30) score -= 15;
  else if (c.hair < 50) score -= 5;
  if (c.dignity < 20) score -= 20;
  else if (c.dignity < 40) score -= 8;
  if (c.risk > 70) score -= 15;
  else if (c.risk > 50) score -= 5;

  // 奖励项
  if (c.dignity > 80) score += 5;
  if (c.popularity > 80) score += 5;

  // 随机方差 ±8%
  score += Random.float(-0.5, 0.5) * score * 0.16;
  score = Math.max(0, Math.min(100, score));

  return { score: Math.round(score) };
}

function assignGrade(rawScore, state) {
  // 生成20个模拟同事的分数（围绕玩家分数聚类）
  const peerScores = [];
  const base = rawScore;
  for (let i = 0; i < 20; i++) {
    let ps = base + Random.float(-17.5, 17.5);
    ps = Math.max(5, Math.min(100, ps));
    peerScores.push(Math.round(ps));
  }

  const allScores = [...peerScores, rawScore];
  allScores.sort((a, b) => b - a);
  const rank = allScores.indexOf(rawScore);
  const percentile = rank / allScores.length;

  let grade;
  if (rawScore < 25) grade = "C";
  else if (percentile < 0.05) grade = "S+";
  else if (percentile < 0.15) grade = "S";
  else if (percentile < 0.5) grade = "A";
  else if (percentile < 0.85) grade = "B";
  else grade = "C";

  // 人缘极差时降级
  if (state.player.corporate.popularity < 20 && grade === "A") grade = "B";

  return {
    grade,
    score: rawScore,
    peerAvg: Math.round(
      peerScores.reduce((a, b) => a + b, 0) / peerScores.length,
    ),
    percentile: Math.round((1 - percentile) * 100),
  };
}

function getGradeColor(grade) {
  return (
    { "S+": "#c4604a", S: "#d4a840", A: "#4aa8cc", B: "#b8bcc4", C: "#b898b4" }[
      grade
    ] || "#ccc"
  );
}

function getGradeBonus(grade) {
  return { "S+": 3, S: 2, A: 1.5, B: 1, C: 0 }[grade] || 0;
}

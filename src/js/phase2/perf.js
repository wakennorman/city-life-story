/**
 * 绩效考核系统
 *
 * 综合评分 = KPI×0.35 + 能力×0.25 + 向上管理×0.20 + 人缘×0.15 + 团队×0.05
 * 评级 = 在20个模拟同事中的百分位排名
 *
 * [全系统自洽修复] 域C A类#6: state.corporate.rank/team 添加防御性空值守卫
 */

function calculatePerfScore(state) {
  // [全系统自洽修复] 域H A类#1: state.player.corporate 空守卫（防止链式事件错误触发）
  if (!state || !state.player || !state.player.corporate) {
    return { score: 50 };
  }
  const c = state.player.corporate;
  const rank = (state.corporate && state.corporate.rank) || "P5";
  const isLowRank = rank === "P5" || rank === "P6";

  // 职级分段权重
  let score = 0;
  if (isLowRank) {
    // P5/P6 执行层: KPI(70%) + 向上管理(30%)
    // [全系统自洽修复] 域C 修复:kpi/upwardMgmt加typeof守卫(非数字→NaN→错误S+评分)
    score += (typeof c.kpi === "number" ? c.kpi : 0) * 0.7;
    score += (typeof c.upwardMgmt === "number" ? c.upwardMgmt : 0) * 0.3;
  } else {
    // P7+ 管理层: KPI(40%) + 向上管理(60%)
    score += (typeof c.kpi === "number" ? c.kpi : 0) * 0.4;
    score += (typeof c.upwardMgmt === "number" ? c.upwardMgmt : 0) * 0.6;
  }

  // 团队贡献 (P7+)
  var corpTeam = state.corporate && state.corporate.team;
  if (corpTeam && corpTeam.length > 0) {
    const avgProd =
      corpTeam.reduce((s, m) => s + (m.productivity || 5), 0) /
      corpTeam.length;
    score += avgProd * 0.05;
  }

  // 惩罚项（[全系统自洽修复] 域C A类#1: c.hair/dignity/risk可能undefined→NaN传播）
  var _hair = typeof c.hair === "number" ? c.hair : 50;
  var _dignity = typeof c.dignity === "number" ? c.dignity : 50;
  var _risk = typeof c.risk === "number" ? c.risk : 50;
  var _popularity = typeof c.popularity === "number" ? c.popularity : 50;
  if (_hair < 30) score -= 15;
  else if (_hair < 50) score -= 5;
  if (_dignity < 20) score -= 20;
  else if (_dignity < 40) score -= 8;
  if (_risk > 70) score -= 15;
  else if (_risk > 50) score -= 5;

  // 奖励项
  if (_dignity > 80) score += 5;
  if (_popularity > 80) score += 5;

  // Q4冲刺加成（在 endQuarter 中设置）
  if (state.flags && state.flags.q4Sprint) {
    score *= 1.1;
  }

  // 随机方差 ±8%（[全系统自洽修复] 域C R499 P1: score 为负时 min/max 反转→取绝对值保对称区间）
  var _varianceBase = Math.abs(score);
  score += Random.float(-_varianceBase * 0.08, _varianceBase * 0.08);
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

  // 人缘惩罚：<40 封顶 A, <20 再降一级
  // [全系统自洽修复] 域H A类#2: state.player.corporate 空守卫
  var pop = (state && state.player && state.player.corporate) ? state.player.corporate.popularity : 50;
  if (pop < 20 && grade !== "C") {
    const gradeOrder = ["C", "B", "A", "S", "S+"];
    const idx = gradeOrder.indexOf(grade);
    if (idx > 0) grade = gradeOrder[idx - 1];
  } else if (pop < 40 && (grade === "S" || grade === "S+")) {
    grade = "A";
  }

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
    { "S+": "#c4553d", S: "#c49a3a", A: "#4a9e5c", B: "#6b6760", C: "#9b74b8" }[
      grade
    ] || "#ccc"
  );
}

function getGradeBonus(grade) {
  return { "S+": 3, S: 2, A: 1.5, B: 1, C: 0 }[grade] || 0;
}
// [R107] 域C 联动增强
// [R315] 域C
// [R371] 域C
// [R411] 域C
// [R467] 域C
// [R507] 域C

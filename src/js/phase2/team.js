/**
 * 团队管理系统 (P7+ 专属)
 */

/** 招聘团队成员 */
function hireTeamMember(memberTypeId) {
  const state = StateManager.getState();
  // [全系统自洽修复] 域H A类#6: 团队系统守卫 — state.corporate/state.resources/state.player 前置检查
  if (!state.corporate || !state.corporate.rank) {
    StateManager.addMessage("⚠️ 未入职，无法管理团队。", "warning");
    return false;
  }
  if (!state.resources) state.resources = { cash: 0, bankBalance: 0 };
  if (!state.player) { StateManager.addMessage("⚠️ 游戏状态异常。", "warning"); return false; }
  const rankData = CORP_RANKS[state.corporate.rank];
  if (!rankData || !rankData.canManageTeam) {
    StateManager.addMessage("⚠️ P7以上才能管理团队。", "warning");
    return false;
  }
  if (state.corporate.team.length >= (rankData.maxTeamSize || 5)) {
    StateManager.addMessage("⚠️ 团队已满员。", "warning");
    return false;
  }

  const template = TEAM_MEMBERS.find((m) => m.id === memberTypeId);
  if (!template) return false;

  // 招聘成本
  const cost = 10000;
  if ((state.resources.cash || 0) < cost) {
    StateManager.addMessage(
      `⚠️ 招聘需要 ¥${cost.toLocaleString()}。`,
      "warning",
    );
    return false;
  }

  state.resources.cash = Math.max(0, (state.resources.cash || 0) - cost);

  // 创建成员（加入随机性，[自洽修复] 域H A类#1: clamp loyalty/productivity 防负值）
  const member = {
    ...template,
    productivity: Math.max(0, template.productivity + Random.int(-2, 1)),
    loyalty: Math.max(0, Math.min(100, template.loyalty + Random.int(-5, 4))),
    hiredDay: state.player.day,
  };

  state.corporate.team.push(member);

  // 降低现有团队士气
  for (const m of state.corporate.team) {
    if (m !== member) m.loyalty = Math.max(0, m.loyalty - 3);
  }

  StateManager.addMessage(
    `👥 招聘了 ${member.name}（${member.role}）加入团队！`,
    "success",
  );
  return true;
}

/** 解雇团队成员 */
function fireTeamMember(index) {
  const state = StateManager.getState();
  if (!state.corporate || !state.corporate.team || !Array.isArray(state.corporate.team)) {
    StateManager.addMessage("⚠️ 团队数据不可用。", "warning");
    return false;
  }
  if (index < 0 || index >= state.corporate.team.length) return false;

  const member = state.corporate.team[index];
  state.corporate.team.splice(index, 1);

  // 团队士气影响
  for (const m of state.corporate.team) {
    m.loyalty = Math.max(0, (m.loyalty || 50) - 5);
  }
  // [全系统自洽修复] 域H A类#8: state.player.corporate 守卫 + NaN 防御
  if (state.player && state.player.corporate) {
    state.player.corporate.popularity = Math.max(
      0,
      (state.player.corporate.popularity || 50) - 5,
    );
  }

  StateManager.addMessage(`👋 ${member.name} 离开了团队。`, "warning");
  return true;
}

/** 计算团队产出系数 */
function getTeamProductivity(state) {
  // [全系统自洽修复] 域H A类#7: 团队系统守卫 — 防止 state.corporate/team 未初始化崩溃
  if (!state || !state.corporate || !state.corporate.team || !Array.isArray(state.corporate.team)) {
    return 1.0;
  }
  if (state.corporate.team.length === 0) return 1.0;

  // [自洽修复] 域H A类#15: 用 Math.max(0, ...) 替代 Math.max(1, ...)，负 loyalty 贡献 0 而非 1
  const totalProductivity = state.corporate.team.reduce(
    (s, m) => s + Math.max(0, (typeof m.productivity === "number" && isFinite(m.productivity)) ? m.productivity : 0),
    0,
  );
  const avgLoyalty =
    state.corporate.team.reduce((s, m) => s + Math.max(0, (typeof m.loyalty === "number" && isFinite(m.loyalty)) ? m.loyalty : 0), 0) /
    state.corporate.team.length;
  const sizeBonus = Math.min(1.5, 1 + state.corporate.team.length * 0.05);

  // [全系统自洽修复] 域H A类#7: 防止 NaN 传播（如果所有团队成员属性异常，返回基础值 1.0）
  var result = (totalProductivity / state.corporate.team.length) * (avgLoyalty / 100) * sizeBonus;
  if (!isFinite(result) || isNaN(result)) return 1.0;
  return result;
}

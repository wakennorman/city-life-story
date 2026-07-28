/**
 * Phase1街头经验 → Phase2入职定级加成（跨阶段继承）
 * G→H 联动增强 | [全系统自洽修复] 域H 联动增强1
 */
function calculateStreetLegacyBonus(state) {
  // [全系统自洽修复] 域H R706: state.player 根守卫（防旧存档/异常状态崩溃）
  if (!state.player) return {};
  var p = state.player;
  var s = state.skills;
  var rel = state.relationships;
  var legacy = {};

  if (!state.resources || !state.needs) return legacy;

  // 技能门槛→职级跳级
  var skipRank = null;
  if ((s.coding?.level || 0) >= 30 && (s.management?.level || 0) >= 10) {
    skipRank = "P6";
  } else if ((s.coding?.level || 0) >= 40) {
    skipRank = "P6";
  } else if ((s.sales?.level || 0) >= 40 && (p.fame || 0) >= 10) {
    skipRank = "P6";
  }
  legacy.skipRank = skipRank;

  // 街头工作经验→KPI起点加成
  // [全系统自洽修复] 域H R706: state.flags 守卫（防旧存档崩溃）
  var streetDays = (state.flags && state.flags._totalStreetDays) || (p.day || 0);
  legacy.kpiBonus = Math.min(30, Math.floor(streetDays / 30));

  // 人脉积累→向上管理加成
  var metCount = 0;
  if (rel) {
    for (var key in rel) {
      if (rel[key]?.met) metCount++;
    }
  }
  legacy.upwardMgmtBonus = Math.min(20, metCount * 3);

  // 副业收入证明商业嗅觉→能力起点加成
  var totalEarned = state.resources.totalEarned || 0;
  if (totalEarned >= 50000) {
    legacy.abilityBonus = 15;
  } else if (totalEarned >= 20000) {
    legacy.abilityBonus = 8;
  }

  return legacy;
}

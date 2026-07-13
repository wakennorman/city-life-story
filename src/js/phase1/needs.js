/**
 * 需求系统 — 饥饱/疲劳/卫生/心情衰减 + 情绪状态判定 + 伤病效果
 */

/** 每日需求衰减 (v3.2 蒙特卡洛平衡：饥饱衰减从18→13，防止开局饿死) */
function applyNeedsDecay(state) {
  const n = state.needs;
  // v3.1: 接入难度乘数 — 休闲档衰减慢，困难/地狱档衰减快
  const decayMul =
    typeof getDifficultyMultiplier === "function"
      ? getDifficultyMultiplier(state, "needsDecay")
      : 1.0;
  // [全系统自洽修复] 域G B类修复: 防止 NaN 传播（用 (x || 0) 兜底）
  n.hunger = Math.max(0, (n.hunger || 0) - Math.round(13 * decayMul));
  n.hygiene = Math.max(0, (n.hygiene || 0) - Math.round(7 * decayMul));
  n.happiness = Math.max(0, (n.happiness || 0) - Math.round(4 * decayMul));
  // fatigue 在 endDay 中通过睡眠恢复单独处理
}

/** 检查需求阈值并施加惩罚 (v3.2 蒙特卡洛平衡：降低阈值惩罚，前30天减半) */
function checkNeedsThresholds(state) {
  const n = state.needs;
  const msgs = [];
  // v3.2 新手保护：前30天需求惩罚减半
  const dayMul = state.player.day <= 30 ? 0.5 : 1.0;
  // v3.1: 接入难度乘数 — 困难/地狱档惩罚更重
  const diffMul =
    typeof getDifficultyMultiplier === "function"
      ? getDifficultyMultiplier(state, "needsDecay")
      : 1.0;
  const combinedMul = dayMul * diffMul;

  if (n.hunger < 10) {
    const dmg = Math.round(2 * combinedMul);
    state.status.health = Math.max(0, state.status.health - dmg);
    if (n.hunger <= 0) state.flags._everStarved = true; // 成就追踪
    msgs.push("⚠️ 极度饥饿！健康-" + dmg + "。赶紧吃点什么！");
  } else if (n.hunger < 25) {
    const dmg = Math.round(1 * combinedMul);
    state.status.health = Math.max(0, state.status.health - dmg);
    msgs.push("🍞 肚子饿了，工作效率下降。");
  }

  if (n.hygiene < 10) {
    const dmg = Math.round(2 * combinedMul);
    state.status.health = Math.max(0, state.status.health - dmg);
    msgs.push("🦠 卫生极差！容易生病。去洗个澡吧。");
  }

  if (n.fatigue > 90) {
    const dmg = Math.round(2 * combinedMul);
    state.status.health = Math.max(0, state.status.health - dmg);
    msgs.push("😵 极度疲劳！需要休息或睡眠。");
  }

  if (n.happiness < 10) {
    msgs.push("😢 心情极度低落，做什么都提不起劲。");
  }

  for (const msg of msgs) {
    StateManager.addMessage(msg, "warning");
  }
}

/** 伤病每日结算 — 已迁移到 illness.js，遍历 status.illnesses 数组 */
function tickHealthStatus(state) {
  // 新疾病系统：每日 tick illness（自然康复+症状结算+慢性病月费）
  if (typeof tickIllnessDecay === "function") {
    tickIllnessDecay(state);
  }
  var st = state.status;
  // 兼容：旧的 injured 字段（受伤还是单独保留，工作中可能受伤）
  if (st.injured) {
    st.health = Math.max(0, st.health - 2);
    if (Random.chance(0.07)) {
      st.injured = false;
      StateManager.addMessage("🩹 伤好了，可以正常干活了。", "info");
    }
  }
  // v3.2.2 MC长期恢复：无受伤时始终+2/天
  // 150-300天MC显示：+2 recovery vs (需求阈值惩罚 + 工作疲劳 > 90 penalty + 慢性病月扣)
  // 勉强平衡但长期有净流失。观察玩家死于Day 69-107。
  // 提高至 +3 recovery 提供更宽的安全余量，仍能被重度受伤/疾病combo击穿
  // 参考：《大多数》稳定的日恢复=让慢性病的"可管理"设计意图成立
  if (!st.injured && st.health < 100) {
    var baseRecovery = 3;
    var recoveryBonus =
      (state.inheritanceBonuses && state.inheritanceBonuses.recoveryRate) || 0;
    var totalRecovery = Math.max(
      1,
      Math.round(baseRecovery * (1 + recoveryBonus)),
    );
    st.health = Math.min(100, st.health + totalRecovery);
  }
}

/** 判定情绪状态（整合有效属性，状态互联系统） */
function determineEmotionalState(state) {
  // 使用有效属性（受状态交叉影响后的真实值）
  var effective =
    typeof getEffectiveStats === "function"
      ? getEffectiveStats(state)
      : {
          mental: state.player.mental,
          intelligence: state.player.intelligence,
        };

  const p = state.player;
  const n = state.needs;
  let score = 50;

  score += (n.happiness - 50) * 0.3;
  if (n.fatigue > 80) score -= 20;
  else if (n.fatigue > 60) score -= 10;
  else if (n.fatigue < 20) score += 5;
  if (n.hunger < 20) score -= 15;
  else if (n.hunger < 40) score -= 5;
  if (n.hygiene < 20) score -= 10;
  // 使用有效心智（状态差→心智打折→情绪更差→恶性循环）
  score += (effective.mental - 50) * 0.15;
  if (state.status.health < 30) score -= 20;
  if (state.status.injured) score -= 10;
  if (state.status.sick) score -= 8;

  let emotionalState;
  if (score < 15) emotionalState = "depressed";
  else if (score < 30) emotionalState = "sad";
  else if (score < 45) emotionalState = "stressed";
  else if (score < 60) emotionalState = "stable";
  else if (score < 80) emotionalState = "happy";
  else emotionalState = "happy";

  state.status.emotionalState = emotionalState;
  return emotionalState;
}

/** 情绪对工作的修正 */
function getEmotionWorkModifier(state) {
  const emo = state.status.emotionalState || "stable";
  const mods = {
    depressed: { pay: 0.45, injury: 2.5, skillXp: 0.3 },
    sad: { pay: 0.65, injury: 1.5, skillXp: 0.5 },
    stressed: { pay: 0.8, injury: 1.3, skillXp: 0.7 },
    stable: { pay: 1.0, injury: 1.0, skillXp: 1.0 },
    happy: { pay: 1.25, injury: 0.7, skillXp: 1.5 },
  };
  return mods[emo] || mods.stable;
}

/** 获取情绪图标 */
function getEmotionIcon(state) {
  const icons = {
    depressed: "😢",
    sad: "😔",
    stressed: "😰",
    stable: "😐",
    happy: "😊",
  };
  return icons[state.status.emotionalState] || "😐";
}

/**
 * 资产关联维持性开支 — 解决后期"钱太多没事做"
 * 物业费按资产 0.1%/天，社交应酬按资产梯度衰减心情
 * 调用位置：daily_pipeline.js needs_decay 步骤后
 */
function applyWealthBasedOverhead(state) {
  if (typeof StateManager === "undefined") return;
  var totalAssets = state.resources.cash + (state.resources.bankBalance || 0);
  if (totalAssets < 50000) return; // 仅资产 > 5W 触发

  // 物业费：按资产 0.03%/天（v3.1：0.1%→0.03%，¥500K→¥150/天封顶¥2000/天）
  var propertyFee = Math.min(2000, Math.round(totalAssets * 0.0003));
  if (propertyFee > 0) {
    state.resources.cash -= propertyFee;
    if (typeof addDailyTransaction === "function") {
      addDailyTransaction(
        state,
        "expense",
        "wealth_overhead",
        propertyFee,
        "物业管理费",
      );
    }
    StateManager.addMessage(
      "🏠 物业管理费 ¥" + propertyFee.toLocaleString() + "（资产越高维护越贵）",
      "info",
    );
  }

  // 住房维护费：住房等级越高越贵
  // v3.2: tier 0=¥0, tier 1=¥10, tier 2=¥40, tier 3=¥200 (降低中期负担)
  // v3.53 修复：扩展至 7 档，tier 4-6 维护费不为零（原数组越界导致 tier≥4 维护费=0 的性价比崩坏）
  var houseTier = (state.housing && state.housing.tier) || 0;
  var UPKEEP = [0, 10, 40, 200, 500, 2000, 5000];
  var houseCost = UPKEEP[houseTier] || 0;
  if (houseCost > 0) {
    state.resources.cash -= houseCost;
    if (typeof addDailyTransaction === "function") {
      addDailyTransaction(
        state,
        "expense",
        "wealth_overhead",
        houseCost,
        "住房维护费",
      );
    }
    StateManager.addMessage("🏡 住房维护费 ¥" + houseCost + "/天", "info");
  }

  // 社交应酬：资产每 ¥200K 增加 -1 心情衰减（富人有更多社交压力）
  if (totalAssets > 200000) {
    var socialDecay = Math.min(8, Math.floor(totalAssets / 200000) * 0.8);
    state.needs.happiness = Math.max(0, state.needs.happiness - socialDecay);
  }

  // 高额资产管理费：资产超 1000 万后每日 0.1% 消耗（防止资金无限膨胀）
  if (totalAssets > 10000000) {
    var excessWealth = totalAssets - 10000000;
    var wealthFee = Math.round(excessWealth * 0.001);
    if (wealthFee > 0) {
      state.resources.cash -= wealthFee;
      if (typeof addDailyTransaction === "function") {
        addDailyTransaction(
          state,
          "expense",
          "wealth_overhead",
          wealthFee,
          "财富管理费",
        );
      }
      StateManager.addMessage(
        "💼 财富管理费 ¥" +
          wealthFee.toLocaleString() +
          "（资产超千万的专项管理费用）",
        "info",
      );
    }
  }
}

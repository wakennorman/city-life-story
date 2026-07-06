/**
 * 需求系统 — 饥饱/疲劳/卫生/心情衰减 + 情绪状态判定 + 伤病效果
 */

/** 每日需求衰减 */
function applyNeedsDecay(state) {
  const n = state.needs;
  n.hunger = Math.max(0, n.hunger - 18);
  n.hygiene = Math.max(0, n.hygiene - 8);
  n.happiness = Math.max(0, n.happiness - 3);
  // fatigue 在 endDay 中通过睡眠恢复单独处理
}

/** 检查需求阈值并施加惩罚 */
function checkNeedsThresholds(state) {
  const n = state.needs;
  const msgs = [];

  if (n.hunger < 15) {
    state.status.health = Math.max(0, state.status.health - 5);
    msgs.push("⚠️ 极度饥饿！健康-5。赶紧吃点什么！");
  } else if (n.hunger < 30) {
    state.status.health = Math.max(0, state.status.health - 2);
    msgs.push("🍞 肚子饿了，工作效率下降。");
  }

  if (n.hygiene < 15) {
    state.status.health = Math.max(0, state.status.health - 3);
    msgs.push("🦠 卫生极差！容易生病。去洗个澡吧。");
  }

  if (n.fatigue > 85) {
    state.status.health = Math.max(0, state.status.health - 3);
    msgs.push("😵 极度疲劳！需要休息或睡眠。");
  }

  if (n.happiness < 15) {
    msgs.push("😢 心情极度低落，做什么都提不起劲。");
  }

  for (const msg of msgs) {
    StateManager.addMessage(msg, "warning");
  }
}

/** 伤病每日结算 */
function tickHealthStatus(state) {
  const st = state.status;
  if (st.sick) {
    st.health = Math.max(0, st.health - 3);
    if (Random.chance(0.12)) {
      st.sick = false;
      StateManager.addMessage("🤒 病好了，身体恢复了。", "info");
    }
  }
  if (st.injured) {
    st.health = Math.max(0, st.health - 2);
    if (Random.chance(0.07)) {
      st.injured = false;
      StateManager.addMessage("🩹 伤好了，可以正常干活了。", "info");
    }
  }
  // 自然恢复
  if (!st.sick && !st.injured && st.health < 100) {
    st.health = Math.min(100, st.health + 1);
  }
}

/** 判定情绪状态 */
function determineEmotionalState(state) {
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
  score += (p.mental - 50) * 0.15;
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

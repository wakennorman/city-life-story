/**
 * 需求系统 — 饥饱/疲劳/卫生/心情衰减 + 情绪状态判定 + 伤病效果
 */

/** 每日需求衰减 (v3.2 蒙特卡洛平衡：饥饱衰减从18→13，防止开局饿死) */
function applyNeedsDecay(state) {
  const n = state.needs;
  // v3.1: 接入难度乘数 — 休闲档衰减慢，困难/地狱档衰减快
  var decayMul =
    typeof getDifficultyMultiplier === "function"
      ? getDifficultyMultiplier(state, "needsDecay")
      : 1.0;
  // [全系统自洽修复] 域G A类修复: 原 `(x||0)` 仅兜底首参，未覆盖 `Math.round(13*decayMul)` 中间值 NaN（Math.max(0,NaN)=NaN 非 0，需求阈值判定全面失灵）
  if (!isFinite(decayMul) || isNaN(decayMul)) decayMul = 1.0;
  decayMul = Math.max(0.1, Math.min(5.0, decayMul));
  n.hunger = Math.max(
    0,
    Math.min(100, (n.hunger || 0) - Math.round(13 * decayMul)),
  );
  n.hygiene = Math.max(
    0,
    Math.min(100, (n.hygiene || 0) - Math.round(7 * decayMul)),
  );
  n.happiness = Math.max(
    0,
    Math.min(100, (n.happiness || 0) - Math.round(4 * decayMul)),
  );
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

  score += (n.happiness - 50) * 0.35;
  if (n.fatigue > 80) score -= 20;
  else if (n.fatigue > 60) score -= 10;
  else if (n.fatigue < 20) score += 5;
  if (n.hunger < 20) score -= 15;
  else if (n.hunger < 40) score -= 5;
  if (n.hygiene < 20) score -= 10;
  else if (n.hygiene > 80) score += 5; // 干净整洁心情好
  // 使用有效心智（状态差→心智打折→情绪更差→恶性循环）
  score += (effective.mental - 50) * 0.2;
  if (state.status.health < 30) score -= 20;
  else if (state.status.health > 90) score += 5; // 健康良好加分
  if (state.status.injured) score -= 10;
  if (state.status.sick) score -= 8;

  let emotionalState;
  if (score < 15) emotionalState = "depressed";
  else if (score < 30) emotionalState = "sad";
  else if (score < 45) emotionalState = "stressed";
  else if (score < 60) emotionalState = "stable";
  else if (score < 80) emotionalState = "happy";
  // [全系统自洽修复] 域G A类修复: 原条件两分支都映射到"happy"，≥80分和60-79分无区分——新增"elated"状态
  else emotionalState = "elated";

  // [全系统自洽修复] 域F联动: 情绪状态转变时推送转折消息 (F→G 联动,让玩家感知情绪轨迹)
  var prevEmo = state.status.emotionalState;
  state.status.emotionalState = emotionalState;
  if (prevEmo && prevEmo !== emotionalState && typeof StateManager !== "undefined") {
    var _emoTransitionMsgs = {
      "stable_happy": "☀️ 今天状态不错,做事心情舒畅。",
      "happy_elated": "🌟 你感觉自己状态极佳！今天做什么都特别顺手！",
      "sad_stable": "🌤️ 心情总算慢慢平复了,生活还要继续。",
      "stressed_sad": "😔 压力让你有些喘不过气,记得给自己减减负。",
      "happy_stable": "🌥️ 激情退去,回归日常,这也是一种节奏。",
      "stable_stressed": "😰 生活压力渐增,别忘了找点乐子调剂。",
    };
    var _key = prevEmo + "_" + emotionalState;
    // 仅对正向/显著负向转变推送,避免刷屏(每7天最多一次)
    if (_emoTransitionMsgs[_key] && state.player && state.player.day % 7 === 0) {
      StateManager.addMessage(_emoTransitionMsgs[_key], "info");
    }
  }

  // [全系统自洽修复] 域G 联动增强: 首次达到 elated 状态时发送庆祝消息
  if (emotionalState === "elated" && !state.flags._everElated) {
    state.flags._everElated = true;
    StateManager.addMessage("🌟 你感觉自己状态极佳！今天做什么都特别顺手！", "success");
    // 记录到回忆录
    if (typeof addMemoir === "function") {
      try { addMemoir("career", { icon: "🌟", title: "状态极佳", text: "今天你感觉自己状态极佳，做什么都特别顺手！这是你在这座城市第一次达到这样的巅峰状态。" }); } catch(e) {}
    }
  }
  // 首次进入抑郁/悲伤时发送关注提示
  if (emotionalState === "depressed" && !state.flags._everDepressed) {
    state.flags._everDepressed = true;
    StateManager.addMessage("😢 你感到前所未有的低落。也许该找人聊聊，或者好好休息一下。", "warning");
    // 记录到回忆录
    if (typeof addMemoir === "function") {
      try { addMemoir("illness", { icon: "😢", title: "情绪低谷", text: "今天是你在城市里最艰难的一天。情绪跌到了谷底，但你还在这里，没有放弃。" }); } catch(e) {}
    }
  }

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
    // [全系统自洽修复] 域G A类修复: 新增 elated 状态（情绪分值≥80时触发）
    elated: { pay: 1.5, injury: 0.5, skillXp: 2.0 },
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
    // [全系统自洽修复] 域G A类修复: 新增 elated 状态图标
    elated: "🌟",
  };
  return icons[state.status.emotionalState] || "😐";
}

/** 获取情绪中文名 */
function getEmotionName(state) {
  var names = {
    depressed: "抑郁",
    sad: "悲伤",
    stressed: "焦虑",
    stable: "平稳",
    happy: "开心",
    elated: "极佳",
  };
  return names[state.status.emotionalState] || "未知";
}

// ====== 百科自动注册 ======
if (typeof window !== "undefined" && window.MECHANICS) {
  window.MECHANICS.emotion_system = {
    id: "emotion_system",
    name: "情绪系统",
    icon: "😊",
    brief: "情绪状态影响工作收入、技能经验和受伤率。6种状态从抑郁到极佳，好状态带来高收益。",
    version: "1.0.0",
    related: ["mechanics:needs", "mechanics:illness_system"],
    sections: [
      { kind: "desc", text: "情绪由心情、疲劳、饥饿、卫生、心智、健康综合决定。每日结算时自动判定，次日生效。" },
      { kind: "subhead", text: "😊 情绪状态一览" },
      {
        kind: "list",
        items: [
          "😢 抑郁 (score<15)：收入×0.45 受伤×2.5 技能经验×0.3",
          "😔 悲伤 (score<30)：收入×0.65 受伤×1.5 技能经验×0.5",
          "😰 焦虑 (score<45)：收入×0.8 受伤×1.3 技能经验×0.7",
          "😐 平稳 (score<60)：基线 1.0×",
          "😊 开心 (score<80)：收入×1.25 受伤×0.7 技能经验×1.5",
          "🌟 极佳 (score≥80)：收入×1.5 受伤×0.5 技能经验×2.0",
        ],
      },
      {
        kind: "tip",
        text: "保持心情高、疲劳低、心智好是获得高情绪状态的关键。好情绪能显著提升收入效率！",
      },
    ],
  };
}

/**
 * 资产关联维持性开支 — 解决后期"钱太多没事做"
 * 物业费按资产 0.1%/天，社交应酬按资产梯度衰减心情
 * 调用位置：daily_pipeline.js needs_decay 步骤后
 */
function applyWealthBasedOverhead(state) {
  if (typeof StateManager === "undefined") return;
  // [全系统自洽修复] 域G A类修复: cash NaN 传播导致现金永久损坏（undefined/NaN 令 totalAssets=NaN → NaN<50000=false → 进入核心逻辑 → state.resources.cash -= NaN = NaN）
  var totalAssets = (state.resources.cash || 0) + (state.resources.bankBalance || 0);
  if (!isFinite(totalAssets)) totalAssets = 0;
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

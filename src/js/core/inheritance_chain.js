/**
 * 遗产链系统 — Phase3#2
 *
 * 多周目继承不仅仅是现金和技能，还包括：
 * 1. 声誉徽章：上局积累的道德选择带来的声誉
 * 2. NPC关系：重要NPC记得你，提供特殊帮助
 * 3. 特殊物品：上局获得的装备/证书可带入新周目
 * 4. 梦想进度：未完成的梦想可继承进度
 * 5. 城市记忆：NPC记得你上局的事迹
 * 6. 公司关系：曾就职/投资过的公司留下人脉
 *
 * 继承规则：
 * - 声誉徽章：根据上局道德选择，提供收入/社交加成
 * - NPC关系：好感度50+的NPC保留初始好感（衰减至30）
 * - 特殊物品：仅限"传奇物品"和"成就物品"
 * - 梦想进度：保留已达成里程碑数
 * - 技能树：已激活的天赋节点保留
 * - 现金：基础继承 + 声誉加成（最高+20%）
 */

// ====== 声誉徽章定义 ======
const REPUTATION_BADGES = [
  {
    id: "honest_trader",
    name: "诚信商人",
    icon: "🤝",
    desc: "从未欺诈顾客，交易诚信度满分",
    effect: "交易收入+5%，NPC初始好感+5",
    apply: function (state) {
      state.inheritanceBonuses = state.inheritanceBonuses || {};
      state.inheritanceBonuses.tradeIncome =
        (state.inheritanceBonuses.tradeIncome || 0) + 0.05;
      state.inheritanceBonuses.npcInitialAffinity =
        (state.inheritanceBonuses.npcInitialAffinity || 0) + 5;
    },
  },
  {
    id: "helpful_neighbor",
    name: "热心邻居",
    icon: "❤️",
    desc: "多次帮助他人，社区口碑极佳",
    effect: "NPC初始好感+10，求助成功率+10%",
    apply: function (state) {
      state.inheritanceBonuses = state.inheritanceBonuses || {};
      state.inheritanceBonuses.npcInitialAffinity =
        (state.inheritanceBonuses.npcInitialAffinity || 0) + 10;
      state.inheritanceBonuses.helpSuccessRate =
        (state.inheritanceBonuses.helpSuccessRate || 0) + 0.1;
    },
  },
  {
    id: "financial_genius",
    name: "理财高手",
    icon: "💰",
    desc: "精通投资理财，资产增值能力出众",
    effect: "初始现金+10%，投资收益率+2%",
    apply: function (state) {
      state.inheritanceBonuses = state.inheritanceBonuses || {};
      state.inheritanceBonuses.cashBonus =
        (state.inheritanceBonuses.cashBonus || 0) + 0.1;
      state.inheritanceBonuses.investmentReturn =
        (state.inheritanceBonuses.investmentReturn || 0) + 0.02;
    },
  },
  {
    id: "career_star",
    name: "职场之星",
    icon: "🌟",
    desc: "职场表现卓越，晋升速度远超常人",
    effect: "职场能力初始+5，晋升概率+5%",
    apply: function (state) {
      state.inheritanceBonuses = state.inheritanceBonuses || {};
      state.inheritanceBonuses.corpAbility =
        (state.inheritanceBonuses.corpAbility || 0) + 5;
      state.inheritanceBonuses.promoChance =
        (state.inheritanceBonuses.promoChance || 0) + 0.05;
    },
  },
  {
    id: "skill_master",
    name: "技能大师",
    icon: "🎓",
    desc: "多项技能达到专家级别",
    effect: "技能学习速度+10%",
    apply: function (state) {
      state.inheritanceBonuses = state.inheritanceBonuses || {};
      state.inheritanceBonuses.skillXpMult =
        (state.inheritanceBonuses.skillXpMult || 0) + 0.1;
    },
  },
  {
    id: "networker",
    name: "社交达人",
    icon: "🕸️",
    desc: "人脉广泛，认识各行各业的人",
    effect: "NPC初始好感+8，解锁特殊对话",
    apply: function (state) {
      state.inheritanceBonuses = state.inheritanceBonuses || {};
      state.inheritanceBonuses.npcInitialAffinity =
        (state.inheritanceBonuses.npcInitialAffinity || 0) + 8;
    },
  },
  {
    id: "survivor",
    name: "生存专家",
    icon: "🛡️",
    desc: "经历过多次危机并成功化解",
    effect: "健康初始+5，伤病恢复速度+10%",
    apply: function (state) {
      state.inheritanceBonuses = state.inheritanceBonuses || {};
      state.inheritanceBonuses.healthInitial =
        (state.inheritanceBonuses.healthInitial || 0) + 5;
      state.inheritanceBonuses.healingRate =
        (state.inheritanceBonuses.healingRate || 0) + 0.1;
    },
  },
  {
    id: "moral_compass",
    name: "道德罗盘",
    icon: "⚖️",
    desc: "在道德困境中始终选择正直",
    effect: "初始声誉+10，正直事件触发率+15%",
    apply: function (state) {
      state.inheritanceBonuses = state.inheritanceBonuses || {};
      state.inheritanceBonuses.reputationInitial =
        (state.inheritanceBonuses.reputationInitial || 0) + 10;
      state.inheritanceBonuses.moralEventRate =
        (state.inheritanceBonuses.moralEventRate || 0) + 0.15;
    },
  },
  {
    id: "city_legend",
    name: "城市传奇",
    icon: "🏆",
    desc: "在这座城市留下了不可磨灭的印记",
    effect: "所有加成叠加，初始现金+20%",
    apply: function (state) {
      state.inheritanceBonuses = state.inheritanceBonuses || {};
      state.inheritanceBonuses.cashBonus =
        (state.inheritanceBonuses.cashBonus || 0) + 0.2;
      state.inheritanceBonuses.npcInitialAffinity =
        (state.inheritanceBonuses.npcInitialAffinity || 0) + 15;
      state.inheritanceBonuses.fameInitial =
        (state.inheritanceBonuses.fameInitial || 0) + 20;
    },
  },
];

/** 获取声誉徽章定义 */
function getReputationBadge(badgeId) {
  return REPUTATION_BADGES.find((b) => b.id === badgeId) || null;
}

/** 获取所有声誉徽章 */
function getAllReputationBadges() {
  return REPUTATION_BADGES;
}

/**
 * 计算上局声誉徽章
 * 根据游戏结束时的状态，自动计算应获得的徽章
 */
function calculateReputationBadges(state) {
  const badges = [];

  // 诚信商人：交易总利润为正且无欺诈记录
  if ((state.trade?.totalProfit || 0) > 10000 && !state.flags?.hasFraudRecord) {
    badges.push("honest_trader");
  }

  // 热心邻居：帮助NPC次数 >= 10
  if ((state.flags?.helpNpcCount || 0) >= 10) {
    badges.push("helpful_neighbor");
  }

  // 理财高手：投资总收益 > 50000
  if ((state.investment?.totalProfit || 0) > 50000) {
    badges.push("financial_genius");
  }

  // 职场之星：晋升到P7+
  if (state.corporate?.rank) {
    const rankOrder = ["P5", "P6", "P7", "P8", "P9", "P10"];
    const currentRank = rankOrder.indexOf(state.corporate.rank);
    if (currentRank >= 2) {
      badges.push("career_star");
    }
  }

  // 技能大师：有3项技能达到60+
  const highSkills = Object.values(state.skills || {}).filter(
    (s) => (s.level || 0) >= 60,
  ).length;
  if (highSkills >= 3) {
    badges.push("skill_master");
  }

  // 社交达人：好感度50+的NPC >= 5
  const highAffinity = Object.values(state.relationships || {}).filter(
    (r) => (r?.affinity || 0) >= 50,
  ).length;
  if (highAffinity >= 5) {
    badges.push("networker");
  }

  // 生存专家：活过365天且健康始终>50
  if (state.player?.day >= 365 && (state.status?.minHealth || 100) > 50) {
    badges.push("survivor");
  }

  // 道德罗盘：在道德事件中正直选择 >= 5次
  if ((state.flags?.moralGoodChoices || 0) >= 5) {
    badges.push("moral_compass");
  }

  // 城市传奇：达成任意胜利条件
  if (state.flags?.victory) {
    badges.push("city_legend");
  }

  return badges;
}

/**
 * 继承上局NPC关系
 * 好感度50+的NPC保留初始好感（衰减至30-50之间）
 */
function inheritRelationships(state, prevState) {
  const inherited = {};
  const prevRels = prevState.relationships || {};

  for (const npcId in prevRels) {
    const prevRel = prevRels[npcId];
    if (!prevRel || !prevRel.met) continue;

    const affinity = prevRel.affinity || 0;
    if (affinity >= 50) {
      // 衰减至30-50
      inherited[npcId] = {
        ...prevRel,
        affinity: Math.max(30, Math.min(50, Math.floor(affinity * 0.6))),
        inherited: true,
        inheritedFromPrev: true,
        note: "上局结识，记得你",
      };
    } else if (affinity >= 30) {
      // 衰减至15-30
      inherited[npcId] = {
        ...prevRel,
        affinity: Math.max(15, Math.floor(affinity * 0.5)),
        inherited: true,
        inheritedFromPrev: true,
        note: "上局有过交集",
      };
    }
  }

  return inherited;
}

/**
 * 继承特殊物品
 * 只继承"传奇物品"和"成就物品"
 */
function inheritItems(state, prevState) {
  const inherited = [];
  const prevItems = prevState.inventory || [];

  for (const item of prevItems) {
    // 传奇物品：legendary = true
    // 成就物品：achievement = true
    if (item.legendary || item.achievement || item.unique) {
      inherited.push({
        ...item,
        inherited: true,
        note: "上局获得的" + (item.legendary ? "传奇" : "成就") + "物品",
      });
    }
  }

  return inherited;
}

/**
 * 继承梦想进度
 * 保留已达成里程碑数
 */
function inheritDreamProgress(state, prevState) {
  const prevDreamId = prevState.flags?._dreamId;
  const prevMilestone = prevState.flags?._dreamMilestone || 0;

  if (prevDreamId && prevMilestone > 0) {
    return {
      dreamId: prevDreamId,
      completedMilestones: prevMilestone,
      note: "上局梦想进度已继承",
    };
  }
  return null;
}

/**
 * 继承技能树
 * 已激活的天赋节点保留
 */
function inheritSkillTree(state, prevState) {
  const prevBranches = prevState.skillBranches || {};
  const prevNodes = prevState.talentNodes || {};

  // 只保留已激活的天赋节点（不保留分支选择，让玩家重新选择）
  const inheritedNodes = {};
  for (const nodeKey in prevNodes) {
    if (prevNodes[nodeKey]) {
      inheritedNodes[nodeKey] = true;
    }
  }

  return {
    branches: prevBranches, // 保留分支选择
    nodes: inheritedNodes,
    note: "已激活的天赋节点已继承",
  };
}

/**
 * v3.0 P2-B-1：继承 35 岁分水岭选择
 * 让上局的"卷/考公/躺平"路径在新周目留下叙事痕迹与微小加成
 */
function inheritCrisisPath(prevState) {
  var path = prevState?.flags?._crisis35Path;
  if (!path) return null;
  var pathMap = {
    grind: {
      label: "再卷职场",
      statBonus: { mental: 3 },
      bonus: { promoChance: 0.03, corpSalaryBonus: 0.05 },
      note: "上辈子的卷王气质延续——新周目职场晋升+3%，月薪+5%",
    },
    civil: {
      label: "备考公",
      statBonus: { intelligence: 3 },
      bonus: { examSuccessBonus: 0.1, civilSalaryBonus: 0.03 },
      note: "上辈子埋首题海的余温——新周目考试成功率+10%，公职月薪+3%",
    },
    lie_flat: {
      label: "摆烂",
      statBonus: { happiness: 5 },
      bonus: { recoveryRateBonus: 0.1, stressReduction: 3 },
      note: "上辈子的松弛感传承——新周目体力恢复+10%，每日压力-3",
    },
  };
  var info = pathMap[path];
  if (!info) return null;
  return {
    path: path,
    label: info.label,
    statBonus: info.statBonus,
    bonus: info.bonus,
    note: info.note,
  };
}

/**
 * v3.0 P2-B-1：继承道德分
 * 善行 - 恶行的净值，新周目影响"前世业力"叙事 + 微小幸运加成
 */
function inheritMoralScore(prevState) {
  var good = prevState?.flags?.moralGoodChoices || 0;
  var bad = prevState?.flags?.moralBadChoices || 0;
  var score = good - bad;
  // 业力→NPC初始好感偏移（-8~+8）
  var npcAffinityAdjust = Math.max(-8, Math.min(8, Math.floor(score * 0.8)));
  // 业力→道德事件触发率调整（-15%~+15%）
  var moralEventRateAdjust = Math.max(-0.15, Math.min(0.15, score * 0.03));
  return {
    score: score,
    good: good,
    bad: bad,
    label:
      score >= 10
        ? "善人"
        : score >= 0
          ? "普通人"
          : score >= -5
            ? "小恶"
            : "恶人",
    npcAffinityAdjust: npcAffinityAdjust,
    moralEventRateAdjust: moralEventRateAdjust,
    note:
      "前世业力 " +
      (score >= 0 ? "+" : "") +
      score +
      "，NPC初始好感" +
      (npcAffinityAdjust >= 0 ? "+" : "") +
      npcAffinityAdjust +
      "，道德事件率" +
      (moralEventRateAdjust >= 0 ? "+" : "") +
      Math.round(moralEventRateAdjust * 100) +
      "%",
  };
}

/**
 * v3.0 P2-B-1：继承 NPC 巅峰好感
 * 记录每个 NPC 上局达到过的最大好感，新周目作为"老熟人"留下信息解锁线索
 */
function inheritPeakAffinity(prevState) {
  var prevRels = prevState?.relationships || {};
  var peak = {};
  for (var npcId in prevRels) {
    var r = prevRels[npcId];
    if (!r || !r.met) continue;
    var maxAff = Math.max(r.affinity || 0, r.peakAffinity || 0);
    if (maxAff >= 50) {
      peak[npcId] = { peakAffinity: maxAff, infoUnlocked: true };
    }
  }
  return { npcs: peak, count: Object.keys(peak).length };
}

/**
 * 计算继承现金加成
 * 基础现金 + 声誉徽章加成
 */
function calculateInheritanceCash(prevState, badges) {
  let baseCash = prevState.resources?.cash || 0;
  let bonusPercent = 0;

  // 声誉徽章加成
  for (const badgeId of badges) {
    const badge = getReputationBadge(badgeId);
    if (badge && badge.effect && badge.effect.includes("现金")) {
      // 解析加成百分比
      const match = badge.effect.match(/现金\+(\d+)%/);
      if (match) {
        bonusPercent += parseInt(match[1]);
      }
    }
  }

  // 根据游戏天数给予额外加成
  const days = prevState.player?.day || 0;
  if (days >= 365) bonusPercent += 5;
  if (days >= 730) bonusPercent += 5;
  if (days >= 1095) bonusPercent += 5;

  // 上限20%
  bonusPercent = Math.min(20, bonusPercent);

  const bonusCash = Math.floor(baseCash * (bonusPercent / 100));
  return {
    base: baseCash,
    bonus: bonusCash,
    total: baseCash + bonusCash,
    bonusPercent: bonusPercent,
  };
}

/**
 * 生成继承摘要（用于新游戏开始时展示）
 */
function generateInheritanceSummary(
  prevState,
  badges,
  relationships,
  items,
  dreamProgress,
  skillTree,
  cashInfo,
) {
  const summary = {
    badges: badges.map((b) => getReputationBadge(b)).filter(Boolean),
    badgeCount: badges.length,
    relationshipCount: Object.keys(relationships).length,
    itemCount: items.length,
    dreamProgress: dreamProgress,
    skillTree: skillTree,
    cash: cashInfo,
    totalDays: prevState.player?.day || 0,
    totalEarned: prevState.resources?.totalEarned || 0,
    finalRank: prevState.corporate?.rank || null,
    victory: prevState.flags?.victory || false,
    narrative: generateInheritanceNarrative(prevState, badges, cashInfo),
  };

  return summary;
}

/** 生成继承叙事文案 */
function generateInheritanceNarrative(prevState, badges, cashInfo) {
  const days = prevState.player?.day || 0;
  const badgeCount = badges.length;

  if (badgeCount >= 5) {
    return (
      "上一世，你在这座城市留下了传奇。" +
      badgeCount +
      "枚声誉徽章见证你的足迹。带着这份荣耀，新的旅程开始了。"
    );
  } else if (badgeCount >= 3) {
    return (
      "上一世，你在这座城市留下了深刻的印记。" +
      badgeCount +
      "枚徽章是你的勋章。新的故事，从继承开始。"
    );
  } else if (badgeCount >= 1) {
    return "上一世，你获得了一枚声誉徽章。虽然不多，但足以让这座城市记住你的名字。";
  } else if (days >= 365) {
    return (
      "上一世，你在这座城市度过了" +
      days +
      "天。虽然没留下太多，但这段经历不会白费。"
    );
  } else {
    return "上一世匆匆而过，你带着一些经验和教训，重新开始。";
  }
}

/**
 * 应用继承到新游状态
 */
function applyInheritance(newState, prevState, inheritanceData) {
  // 应用声誉徽章加成
  if (inheritanceData.badges && inheritanceData.badges.length > 0) {
    for (const badgeId of inheritanceData.badges) {
      const badge = getReputationBadge(badgeId);
      if (badge && badge.apply) {
        badge.apply(newState);
      }
    }
  }

  // 应用继承的NPC关系
  if (inheritanceData.relationships) {
    newState.relationships = {
      ...newState.relationships,
      ...inheritanceData.relationships,
    };
  }

  // 应用继承的特殊物品
  if (inheritanceData.items && inheritanceData.items.length > 0) {
    newState.inventory = (newState.inventory || []).concat(
      inheritanceData.items,
    );
  }

  // 应用继承的梦想进度
  if (inheritanceData.dreamProgress) {
    newState.flags._dreamId = inheritanceData.dreamProgress.dreamId;
    newState.flags._dreamMilestone =
      inheritanceData.dreamProgress.completedMilestones;
  }

  // 应用继承的技能树
  if (inheritanceData.skillTree) {
    newState.skillBranches = inheritanceData.skillTree.branches;
    newState.talentNodes = inheritanceData.skillTree.nodes;
  }

  // 应用继承的现金
  if (inheritanceData.cashInfo) {
    newState.resources.cash = inheritanceData.cashInfo.total;
    newState.flags._inheritanceCashBonus = inheritanceData.cashInfo.bonus;
    newState.flags._inheritanceCashBase = inheritanceData.cashInfo.base;
  }

  // v3.0 P2-B-1：应用 35 岁路径继承（属性加成 + 职场/考试/恢复加成）
  if (inheritanceData.crisisPath && inheritanceData.crisisPath.statBonus) {
    var sb = inheritanceData.crisisPath.statBonus;
    for (var k in sb) {
      if (typeof newState.player[k] === "number") {
        newState.player[k] = Math.min(100, newState.player[k] + sb[k]);
      }
    }
    newState.flags._prevCrisis35Path = inheritanceData.crisisPath.path;
    // 职场/考试/恢复加成
    var bonus = inheritanceData.crisisPath.bonus;
    if (bonus) {
      newState.inheritanceBonuses = newState.inheritanceBonuses || {};
      if (bonus.promoChance) {
        newState.inheritanceBonuses.promoChance =
          (newState.inheritanceBonuses.promoChance || 0) + bonus.promoChance;
      }
      if (bonus.corpSalaryBonus) {
        newState.inheritanceBonuses.corpSalaryBonus =
          (newState.inheritanceBonuses.corpSalaryBonus || 0) +
          bonus.corpSalaryBonus;
      }
      if (bonus.examSuccessBonus) {
        newState.inheritanceBonuses.examSuccessBonus =
          (newState.inheritanceBonuses.examSuccessBonus || 0) +
          bonus.examSuccessBonus;
      }
      if (bonus.recoveryRateBonus) {
        newState.inheritanceBonuses.recoveryRate =
          (newState.inheritanceBonuses.recoveryRate || 0) +
          bonus.recoveryRateBonus;
      }
      if (bonus.stressReduction) {
        newState.inheritanceBonuses.stressReduction =
          (newState.inheritanceBonuses.stressReduction || 0) +
          bonus.stressReduction;
      }
    }
  }

  // v3.0 P2-B-1：应用道德分继承（幸运 + NPC 好感偏移 + 道德事件率）
  if (inheritanceData.moralScore) {
    var ms = inheritanceData.moralScore.score;
    var luckBonus = Math.max(-3, Math.min(5, Math.floor(ms / 5)));
    newState.inheritanceBonuses = newState.inheritanceBonuses || {};
    newState.inheritanceBonuses.luckBonus =
      (newState.inheritanceBonuses.luckBonus || 0) + luckBonus;
    if (inheritanceData.moralScore.npcAffinityAdjust) {
      newState.inheritanceBonuses.npcInitialAffinity =
        (newState.inheritanceBonuses.npcInitialAffinity || 0) +
        inheritanceData.moralScore.npcAffinityAdjust;
    }
    if (inheritanceData.moralScore.moralEventRateAdjust) {
      newState.inheritanceBonuses.moralEventRate =
        (newState.inheritanceBonuses.moralEventRate || 0) +
        inheritanceData.moralScore.moralEventRateAdjust;
    }
    newState.flags._prevMoralScore = ms;
  }

  // v3.0 P2-B-1：应用 NPC 巅峰好感（解锁老熟人信息）
  if (inheritanceData.peakAffinity && inheritanceData.peakAffinity.npcs) {
    newState.flags._prevPeakAffinity = inheritanceData.peakAffinity.npcs;
  }

  // === v3.8 P1-2: 差异化开局债务 ===
  // 上局欠债未还 → 新周目催收上门
  var prevDebt = prevState.resources?.villageDebt || 0;
  if (
    prevDebt > 0 &&
    inheritanceData.badges &&
    inheritanceData.badges.length >= 0
  ) {
    // 催收金额 = 上局债务的 5%~15%，上限 ¥2000
    var debtCollect = Math.min(
      2000,
      Math.max(
        500,
        Math.round(
          prevDebt *
            (0.05 +
              (typeof Random !== "undefined"
                ? Random.float(0, 0.1)
                : Math.random() * 0.1)),
        ),
      ),
    );
    newState.flags._inheritanceDebtCollection = debtCollect;
    newState.resources.cash = Math.max(
      0,
      (newState.resources.cash || 0) - debtCollect,
    );
    newState.flags._inheritanceDebtNote = "上局欠债未还，催收已上门";
  }

  // 上局违法多 → 新周目有案底
  var prevArrests = prevState.flags?._arrestCount || 0;
  if (prevArrests > 3) {
    newState.flags._criminalRecord = true;
    newState.flags._inheritanceCriminalRecord = true;
    // 有案底的话找工作受限，开局减益
    newState.player.fame = Math.max(0, (newState.player.fame || 0) - 5);
    newState.flags._inheritanceArrestNote = "上局多次违法，留下案底影响求职";
  }

  // 标记继承来源
  newState.flags._hasInheritance = true;
  newState.flags._inheritanceFromDay = prevState.player?.day || 0;
  newState.flags._inheritanceSummary = generateInheritanceSummary(
    prevState,
    inheritanceData.badges || [],
    inheritanceData.relationships || {},
    inheritanceData.items || [],
    inheritanceData.dreamProgress,
    inheritanceData.skillTree,
    inheritanceData.cashInfo,
  );
}

// 全局挂载
if (typeof window !== "undefined") {
  Object.assign(window, {
    calculateReputationBadges,
    inheritRelationships,
    inheritItems,
    inheritDreamProgress,
    inheritSkillTree,
    inheritCrisisPath,
    inheritMoralScore,
    inheritPeakAffinity,
    calculateInheritanceCash,
    generateInheritanceSummary,
    applyInheritance,
    getReputationBadge,
    getAllReputationBadges,
    REPUTATION_BADGES,
  });
}

/** 传承潜力评估（P2-5: 多周目衔接） */
function assessInheritancePotential(state) {
  var potential = {
    score: 0,
    badges: [],
    relationships: [],
    skills: [],
    cash: 0,
    notes: [],
  };

  // 声誉徽章
  potential.badges = calculateReputationBadges(state);
  potential.score += potential.badges.length * 10;

  // NPC关系（峰值好感）
  var relationships = state.player.relationships || {};
  for (var npcId in relationships) {
    var rel = relationships[npcId];
    if (rel && rel.affinity && rel.affinity > 50) {
      potential.relationships.push({
        npcId: npcId,
        affinity: rel.affinity,
      });
      potential.score += Math.floor(rel.affinity / 10);
    }
  }

  // 技能树
  var skills = state.player.skills || {};
  for (var skillKey in skills) {
    var skill = skills[skillKey];
    if (skill && skill.level && skill.level > 30) {
      potential.skills.push({
        skill: skillKey,
        level: skill.level,
      });
      potential.score += Math.floor(skill.level / 10);
    }
  }

  // 现金
  potential.cash = state.resources.cash || 0;
  potential.score += Math.floor(potential.cash / 10000);

  // 生成评估建议
  if (potential.score >= 100) {
    potential.notes.push("⭐ 高潜力传承：建议优先解锁核心增益");
  } else if (potential.score >= 50) {
    potential.notes.push("👍 中等潜力传承：建议解锁1-2项核心增益");
  } else {
    potential.notes.push("💡 基础潜力传承：建议解锁基础增益或积累更多经验");
  }

  return potential;
}

// 全局挂载
if (typeof window !== "undefined") {
  window.assessInheritancePotential = assessInheritancePotential;
}

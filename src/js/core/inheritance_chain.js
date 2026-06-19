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
    calculateInheritanceCash,
    generateInheritanceSummary,
    applyInheritance,
    getReputationBadge,
    getAllReputationBadges,
    REPUTATION_BADGES,
  });
}

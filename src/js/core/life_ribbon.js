/**
 * 人生缎带系统 — BitLife 风格结局分类
 *
 * 设计参考：BitLife Ribbons（40种缎带覆盖各种人生路线）
 *           《大多数》结局评价（基于玩家行为轨迹而非单一指标）
 *           Stardew Valley 祖父评价信（多维度综合评估）
 *
 * 核心理念：缎带不是玩家选择的，而是从人生轨迹中涌现的。
 * 每局结束（胜利或失败）时，系统根据玩家全周期的行为数据，
 * 自动判定最符合的人生缎带。缎带跨周目持久化到 localStorage，
 * 形成收集目标。
 *
 * 12 条缎带覆盖中国都市生活的典型人生路线：
 *   🏪 商海弄潮儿 | 💼 打工皇帝 | 🍵 躺平达人 | 🏗️ 街头生存者
 *   📚 考公上岸   | 🏠 房奴一生 | 🌊 归园田居 | ⚡ 内卷之王
 *   🎲 创业先锋   | 💊 病困交加 | 🌟 城市传奇 | 😔 默默无闻
 */

// ====== 缎带定义 ======
// 每条缎带含：检查条件函数 + 互斥优先级（数字越小越优先匹配）
var LIFE_RIBBONS = [
  {
    id: "city_legend",
    name: "城市传奇",
    icon: "🌟",
    desc: "你的故事在这座城市广为流传，成为一代传奇。",
    priority: 1,
    color: "#FFD700",
    check: function (st, stats) {
      return stats.victoryType === "celebrity" || stats.victoryType === "money";
    },
  },
  {
    id: "entrepreneur",
    name: "创业先锋",
    icon: "🎲",
    desc: "从零起步，你在创业的浪潮中搏出了自己的一片天。",
    priority: 2,
    color: "#FF6B35",
    check: function (st, stats) {
      return (
        st.startup &&
        st.startup.company &&
        (st.startup.company.stage >= 2 ||
          stats.victoryType === "merchant" ||
          (st.startup.company.fundingRound &&
            st.startup.company.fundingRound >= 2))
      );
    },
  },
  {
    id: "work_emperor",
    name: "打工皇帝",
    icon: "💼",
    desc: "你在职场上一路高歌，从底层爬到了金字塔的顶端。",
    priority: 3,
    color: "#4A90D9",
    check: function (st, stats) {
      return (
        st.corporate &&
        (st.corporate.rank === "P10" ||
          st.corporate.rank === "P9" ||
          stats.victoryType === "p10")
      );
    },
  },
  {
    id: "civil_service",
    name: "考公上岸",
    icon: "📚",
    desc: "你成功考上了公务员，端起了传说中的铁饭碗。",
    priority: 4,
    color: "#50C878",
    check: function (st, stats) {
      return st.flags._crisis35Path === "exam" || st.flags._passedCivilService;
    },
  },
  {
    id: "involution_king",
    name: "内卷之王",
    icon: "⚡",
    desc: "你把内卷做到了极致——996是常态，007也不在话下。",
    priority: 5,
    color: "#E74C3C",
    check: function (st, stats) {
      return (
        stats.totalWorkDays >= 500 &&
        stats.avgFatigue >= 60 &&
        st.flags._crisis35Path === "career"
      );
    },
  },
  {
    id: "mortgage_slave",
    name: "房奴一生",
    icon: "🏠",
    desc: "大半辈子都在还房贷，但你终于有了自己的家。",
    priority: 6,
    color: "#8B6914",
    check: function (st, stats) {
      var props = (st.investment && st.investment.properties) || [];
      return props.some(function (p) {
        return p.isSelfOccupied && p.mortgageRemaining > 0;
      });
    },
  },
  {
    id: "street_survivor",
    name: "街头生存者",
    icon: "🏗️",
    desc: "你在最底层摸爬滚打，靠双手在这座城市活了下来。",
    priority: 7,
    color: "#95A5A6",
    check: function (st, stats) {
      return (
        stats.victoryType === "master" ||
        (stats.daysSurvived >= 365 &&
          stats.maxCash < 50000 &&
          !stats.victoryType)
      );
    },
  },
  {
    id: "lying_flat",
    name: "躺平达人",
    icon: "🍵",
    desc: "不卷了。你选择了佛系人生，怡然自得。",
    priority: 8,
    color: "#27AE60",
    check: function (st, stats) {
      return (
        stats.daysSurvived >= 200 &&
        stats.avgFatigue <= 30 &&
        st.flags._crisis35Path === "lieflat"
      );
    },
  },
  {
    id: "returning_home",
    name: "归园田居",
    icon: "🌊",
    desc: "看遍城市繁华后，你选择回到故乡，过另一种生活。",
    priority: 9,
    color: "#2ECC71",
    check: function (st, stats) {
      return st.flags._returnedHometown || st.flags._crisis35Path === "lieflat";
    },
  },
  {
    id: "sick_and_broke",
    name: "病困交加",
    icon: "💊",
    desc: "身体垮了，钱也没了。这座城市终究没有善待你。",
    priority: 10,
    color: "#E67E22",
    check: function (st, stats) {
      return (
        !stats.victoryType &&
        (stats.finalHealth <= 20 ||
          (st.status && st.status.illness && st.status.illness.length >= 3))
      );
    },
  },
  {
    id: "skill_master",
    name: "百艺通",
    icon: "🎓",
    desc: "你花了大量时间精进各种技能，成为不可多得的通才。",
    priority: 11,
    color: "#9B59B6",
    check: function (st, stats) {
      var highSkills = 0;
      if (st.skills) {
        for (var k in st.skills) {
          if (st.skills[k] && st.skills[k].level >= 70) highSkills++;
        }
      }
      return highSkills >= 5;
    },
  },
  {
    id: "nobody",
    name: "默默无闻",
    icon: "😔",
    desc: "你来过这座城市，但没有留下太多痕迹。",
    priority: 99,
    color: "#7F8C8D",
    check: function () {
      return true; // 兜底：总是匹配
    },
  },
];

// ====== 统计数据收集 ======

/** 从 state 中提取用于缎带判定的统计数据 */
function collectLifeStats(state) {
  var inv = state.investment || {};
  var stockVal = 0;
  if (inv.stockHoldings && inv.stockMarket) {
    inv.stockHoldings.forEach(function (h) {
      var m = inv.stockMarket[h.symbol];
      stockVal += (m ? m.price : 0) * (h.shares || 0);
    });
  }
  var propVal = (inv.properties || []).reduce(function (s, p) {
    return s + (p.currentPrice || p.buyPrice || 0);
  }, 0);
  var btcVal = (inv.btcPrice || 0) * (inv.btcHoldings || 0);
  var totalAssets =
    (state.resources.cash || 0) +
    (state.resources.bankBalance || 0) +
    stockVal +
    propVal +
    btcVal;

  // 统计高好感NPC数量
  var highAffinityNPCs = 0;
  if (state.npcRelations) {
    for (var id in state.npcRelations) {
      if ((state.npcRelations[id].affinity || 0) >= 50) highAffinityNPCs++;
    }
  }

  // 统计高等级技能数量
  var highSkills = 0;
  if (state.skills) {
    for (var k in state.skills) {
      if (state.skills[k] && state.skills[k].level >= 60) highSkills++;
    }
  }

  // 交易总利润
  var tradeProfit = (state.trade && state.trade.totalProfit) || 0;

  // 工作天数估算（通过 flags 中的工作记录）
  var totalWorkDays =
    (state.flags._totalWorkDays || 0) + (state.player.day || 0);

  // 平均疲劳估算
  var avgFatigue = state.needs ? state.needs.fatigue || 0 : 0;

  return {
    victoryType: state.flags.victoryType || null,
    daysSurvived: state.player.day || 0,
    finalHealth: (state.status && state.status.health) || 100,
    finalCash: state.resources.cash || 0,
    maxCash: state.flags._maxCashEver || state.resources.cash || 0,
    totalAssets: totalAssets,
    tradeProfit: tradeProfit,
    totalWorkDays: totalWorkDays,
    avgFatigue: avgFatigue,
    highAffinityNPCs: highAffinityNPCs,
    highSkills: highSkills,
    playerAge: state.player.age || 20,
    playerFame: state.player.fame || 0,
    moralScore: state.flags._moralScore || 0,
    difficulty: state._difficulty || "normal",
  };
}

// ====== 缎带判定 ======

/** 在游戏结束时调用，返回匹配的缎带 */
function determineLifeRibbon(state) {
  var stats = collectLifeStats(state);
  // 按优先级排序
  var sorted = LIFE_RIBBONS.slice().sort(function (a, b) {
    return a.priority - b.priority;
  });
  for (var i = 0; i < sorted.length; i++) {
    try {
      if (sorted[i].check(state, stats)) {
        return { ribbon: sorted[i], stats: stats };
      }
    } catch (e) {
      // 条件检查出错则跳过
    }
  }
  return { ribbon: sorted[sorted.length - 1], stats: stats };
}

// ====== localStorage 持久化 ======

var RIBBON_KEY = "__lifeRibbons";

/** 获取已获得的缎带列表 */
function getEarnedRibbons() {
  try {
    var raw = localStorage.getItem(RIBBON_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/** 记录新获得的缎带（去重） */
function recordRibbon(ribbonId, stats) {
  var earned = getEarnedRibbons();
  var existing = earned.find(function (r) {
    return r.id === ribbonId;
  });
  if (!existing) {
    earned.push({
      id: ribbonId,
      earnedDate: Date.now(),
      playthroughs: 1,
    });
  } else {
    existing.playthroughs = (existing.playthroughs || 1) + 1;
    existing.earnedDate = Date.now();
  }
  try {
    localStorage.setItem(RIBBON_KEY, JSON.stringify(earned));
  } catch (e) {
    // 存储失败忽略
  }
  return !existing; // 返回 true 表示新获得
}

/** 获取缎带收集进度 */
function getRibbonProgress() {
  var earned = getEarnedRibbons();
  var earnedIds = earned.map(function (r) {
    return r.id;
  });
  return {
    total: LIFE_RIBBONS.length,
    earned: earned.length,
    unearned: LIFE_RIBBONS.filter(function (r) {
      return earnedIds.indexOf(r.id) === -1;
    }),
    earnedList: earned,
    allRibbons: LIFE_RIBBONS.map(function (r) {
      return {
        id: r.id,
        name: r.name,
        icon: r.icon,
        desc: r.desc,
        color: r.color,
        earned: earnedIds.indexOf(r.id) !== -1,
      };
    }),
  };
}

// ====== 全局挂载 ======
if (typeof window !== "undefined") {
  window.LIFE_RIBBONS = LIFE_RIBBONS;
  window.collectLifeStats = collectLifeStats;
  window.determineLifeRibbon = determineLifeRibbon;
  window.recordRibbon = recordRibbon;
  window.getEarnedRibbons = getEarnedRibbons;
  window.getRibbonProgress = getRibbonProgress;
}

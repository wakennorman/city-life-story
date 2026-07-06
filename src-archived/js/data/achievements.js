/**
 * 成就系统定义
 *
 * 成就类型：
 * - 生存类：存活天数、年龄
 * - 财富类：现金、总收入、净资产
 * - 职业类：工作次数、最高职位
 * - 社交类：婚姻、子女、NPC关系
 * - 健康类：疾病治愈、无病天数
 * - 交易类：交易次数、单件最高利润
 */

const ACHIEVEMENT_DEFS = [
  // === 生存类 ===
  {
    id: "survivor_7",
    name: "初来乍到",
    desc: "在这座城市存活7天",
    category: "survival",
    check: (state) => state.player.day >= 7,
  },
  {
    id: "survivor_30",
    name: "站稳脚跟",
    desc: "在这座城市存活30天",
    category: "survival",
    check: (state) => state.player.day >= 30,
  },
  {
    id: "survivor_100",
    name: "老江湖",
    desc: "在这座城市存活100天",
    category: "survival",
    check: (state) => state.player.day >= 100,
  },
  {
    id: "survivor_365",
    name: "城市传奇",
    desc: "在这座城市存活365天",
    category: "survival",
    check: (state) => state.player.day >= 365,
  },

  // === 财富类 ===
  {
    id: "cash_10k",
    name: "万元户",
    desc: "现金首次达到1万元",
    category: "wealth",
    check: (state) => state.resources.cash >= 10000,
  },
  {
    id: "cash_100k",
    name: "小富翁",
    desc: "现金首次达到10万元",
    category: "wealth",
    check: (state) => state.resources.cash >= 100000,
  },
  {
    id: "cash_1m",
    name: "百万富翁",
    desc: "现金首次达到100万元",
    category: "wealth",
    check: (state) => state.resources.cash >= 1000000,
  },
  {
    id: "total_earned_100k",
    name: "勤劳致富",
    desc: "累计总收入达到10万元",
    category: "wealth",
    check: (state) => state.resources.totalEarned >= 100000,
  },
  {
    id: "debt_free",
    name: "无债一身轻",
    desc: "还清所有债务",
    category: "wealth",
    check: (state) =>
      state.resources.debt <= 0 && state.resources.loanPrincipal > 0,
  },

  // === 职业类 ===
  {
    id: "first_job",
    name: "第一份工作",
    desc: "完成第一次工作",
    category: "career",
    check: (state) =>
      state.employment?.completedShifts &&
      Object.keys(state.employment.completedShifts).length >= 1,
  },
  {
    id: "jobs_50",
    name: "劳模",
    desc: "累计完成50次工作",
    category: "career",
    check: (state) => {
      const total = Object.values(
        state.employment?.completedShifts || {},
      ).reduce((s, v) => s + v, 0);
      return total >= 50;
    },
  },
  {
    id: "corp_join",
    name: "入职大厂",
    desc: "成功进入 corporate 阶段",
    category: "career",
    check: (state) => state.player.phase === "corporate",
  },
  {
    id: "rank_p7",
    name: "技术专家",
    desc: "晋升到 P7",
    category: "career",
    check: (state) => state.corporate?.rank === "P7",
  },
  {
    id: "rank_p9",
    name: "高级管理",
    desc: "晋升到 P9",
    category: "career",
    check: (state) => state.corporate?.rank === "P9",
  },
  {
    id: "rank_p10",
    name: "登顶巅峰",
    desc: "晋升到 P10",
    category: "career",
    check: (state) => state.corporate?.rank === "P10",
  },

  // === 社交类 ===
  {
    id: "first_date",
    name: "初恋",
    desc: "开始一段恋爱关系",
    category: "social",
    check: (state) => state.romance?.relationship === "dating",
  },
  {
    id: "married",
    name: "喜结连理",
    desc: "步入婚姻殿堂",
    category: "social",
    check: (state) => state.romance?.relationship === "married",
  },
  {
    id: "first_child",
    name: "喜得贵子",
    desc: "有了第一个孩子",
    category: "social",
    check: (state) =>
      state.romance?.children && state.romance.children.length >= 1,
  },
  {
    id: "chengguan_friend",
    name: "化敌为友",
    desc: "与城管关系达到50以上",
    category: "social",
    check: (state) => state.relationships?.chengguan?.affinity >= 50,
  },

  // === 健康类 ===
  {
    id: "healthy_30",
    name: "身强体壮",
    desc: "连续30天健康值保持100",
    category: "health",
    check: (state) => state.status?.health >= 100 && state.player.day >= 30,
  },
  {
    id: "heal_disease",
    name: "战胜病魔",
    desc: "治愈一种疾病",
    category: "health",
    check: (state) => state.achievements?.stats?.diseasesHealed >= 1,
  },

  // === 技能类 ===
  {
    id: "skill_master",
    name: "技艺精通",
    desc: "任一技能达到50级",
    category: "skill",
    check: (state) => Object.values(state.skills).some((s) => s.level >= 50),
  },
  {
    id: "skill_legend",
    name: "一代宗师",
    desc: "任一技能达到80级",
    category: "skill",
    check: (state) => Object.values(state.skills).some((s) => s.level >= 80),
  },
  {
    id: "all_skills_20",
    name: "多才多艺",
    desc: "所有技能都达到20级",
    category: "skill",
    check: (state) => Object.values(state.skills).every((s) => s.level >= 20),
  },

  // === 交易类 ===
  {
    id: "first_trade",
    name: "第一笔买卖",
    desc: "完成第一次商品交易",
    category: "trade",
    check: (state) => state.achievements?.stats?.itemsTraded >= 1,
  },
  {
    id: "trade_100",
    name: "商界精英",
    desc: "累计交易100件商品",
    category: "trade",
    check: (state) => state.achievements?.stats?.itemsTraded >= 100,
  },
  {
    id: "house_owner",
    name: "有房一族",
    desc: "购买第一套房产",
    category: "trade",
    check: (state) =>
      state.investment?.realEstate && state.investment.realEstate.length >= 1,
  },
];

const ACHIEVEMENT_CATEGORIES = {
  survival: { name: "生存", icon: "🏠" },
  wealth: { name: "财富", icon: "💰" },
  career: { name: "职业", icon: "💼" },
  social: { name: "社交", icon: "👥" },
  health: { name: "健康", icon: "💪" },
  skill: { name: "技能", icon: "📚" },
  trade: { name: "交易", icon: "📈" },
};

/** 检查并解锁成就 */
function checkAchievements(state) {
  const newlyUnlocked = [];

  for (const def of ACHIEVEMENT_DEFS) {
    // 已解锁的跳过
    if (state.achievements.unlocked.some((a) => a.id === def.id)) continue;

    try {
      if (def.check(state)) {
        state.achievements.unlocked.push({
          id: def.id,
          name: def.name,
          desc: def.desc,
          category: def.category,
          unlockedAt: state.player.day,
        });
        newlyUnlocked.push(def);
      }
    } catch (e) {
      // 检查函数可能因状态不完整而报错，静默忽略
    }
  }

  return newlyUnlocked;
}

/** 获取成就定义 */
function getAchievementById(id) {
  return ACHIEVEMENT_DEFS.find((a) => a.id === id);
}

/** 获取分类下的成就 */
function getAchievementsByCategory(category) {
  return ACHIEVEMENT_DEFS.filter((a) => a.category === category);
}

/** 获取玩家成就进度 */
function getAchievementProgress(state) {
  const total = ACHIEVEMENT_DEFS.length;
  const unlocked = state.achievements?.unlocked?.length || 0;
  return { total, unlocked, percentage: Math.round((unlocked / total) * 100) };
}

// 全局导出
if (typeof window !== "undefined") {
  Object.assign(window, {
    ACHIEVEMENT_DEFS,
    ACHIEVEMENT_CATEGORIES,
    checkAchievements,
    getAchievementById,
    getAchievementsByCategory,
    getAchievementProgress,
  });
}

/**
 * 成就系统 — 里程碑叙事记录
 *
 * 设计理念（参考 Papers Please 隐藏成就）：
 * - 成就是「记录」而非「奖励」——记录你走过的路
 * - 有趣的是隐藏成就：玩家做了某件事才知道这件事被记住了
 * - 成就文案有温度：不是"完成任务X"，而是"那天你选择了..."
 * - 分类：人生第一次 / 里程碑 / 道德档案 / 隐藏
 */

const ACHIEVEMENTS = [
  // === 人生第一次 ===
  {
    id: "first_earn",
    name: "第一桶金",
    desc: "你赚到了在这座城市的第一分钱。",
    story:
      "那天不管是捡废品还是唱歌，你把第一块钱攥在手心——那是你在这座城市证明自己存在的第一步。",
    icon: "💰",
    category: "人生第一次",
    hidden: false,
    check: function (st) {
      return (st.resources.totalEarned || 0) > 0;
    },
  },
  {
    id: "first_job",
    name: "第一份工作",
    desc: "你完成了在这座城市的第一次打工。",
    story: "汗流浃背，工钱不多，但你知道：这是靠自己双手挣的。",
    icon: "👷",
    category: "人生第一次",
    hidden: false,
    check: function (st) {
      return (
        st.employment &&
        st.employment.completedShifts &&
        Object.keys(st.employment.completedShifts).length > 0
      );
    },
  },
  {
    id: "first_trade",
    name: "第一次倒买倒卖",
    desc: "你完成了人生第一次商品买卖。",
    story: "买进卖出，薄薄的差价里藏着市场的逻辑。你开始懂了一点点。",
    icon: "🛒",
    category: "人生第一次",
    hidden: false,
    check: function (st) {
      return (
        (st.trade &&
          st.trade.totalProfit !== undefined &&
          st.trade.totalProfit > 0) ||
        (st.flags && st.flags._firstTradeDone)
      );
    },
  },
  {
    id: "first_bank",
    name: "第一次存钱",
    desc: "你把钱存进了银行，开始有了一点点安全感。",
    story:
      '银行账户里出现了第一个数字。不多，但那是你第一次把钱放到"安全"的地方。',
    icon: "🏦",
    category: "人生第一次",
    hidden: false,
    check: function (st) {
      return (st.resources.bankBalance || 0) > 0;
    },
  },
  {
    id: "first_injury",
    name: "第一次受伤",
    desc: "你在这座城市第一次流血或受伤。",
    story: "这座城市不是只有机会，也有代价。你用身体记住了这个教训。",
    icon: "🩹",
    category: "人生第一次",
    hidden: true,
    check: function (st) {
      return st.flags && st.flags._everInjured;
    },
  },
  {
    id: "first_upgrade_housing",
    name: "第一次搬家",
    desc: "你从最差的住所搬进了稍好一点的地方。",
    story: "新床垫，新钥匙。一点点向上，这就够了。",
    icon: "🏠",
    category: "人生第一次",
    hidden: false,
    check: function (st) {
      return (st.housing.tier || 0) >= 1;
    },
  },
  {
    id: "first_skill_level",
    name: "第一次技能升级",
    desc: "你的某项技能第一次提升了等级。",
    story: "那一刻你感到某种东西变了——不是运气，是实力。",
    icon: "⭐",
    category: "人生第一次",
    hidden: false,
    check: function (st) {
      return Object.values(st.skills).some(function (s) {
        return s.level >= 1;
      });
    },
  },

  // === 里程碑 ===
  {
    id: "earn_10k",
    name: "万元户",
    desc: "累计赚到¥10,000。",
    story: "一万块。听起来不多，但你知道每一块是怎么来的。",
    icon: "💵",
    category: "里程碑",
    hidden: false,
    check: function (st) {
      return (st.resources.totalEarned || 0) >= 10000;
    },
  },
  {
    id: "earn_100k",
    name: "十万打工人",
    desc: "累计赚到¥100,000。",
    story: "十万块的积累，花了多少个日夜。你数不清了，但你还在这座城市里站着。",
    icon: "💵",
    category: "里程碑",
    hidden: false,
    check: function (st) {
      return (st.resources.totalEarned || 0) >= 100000;
    },
  },
  {
    id: "survive_30_days",
    name: "一个月",
    desc: "在这座城市生存了30天。",
    story: "第一个月是最难的。但你撑过来了。",
    icon: "📅",
    category: "里程碑",
    hidden: false,
    check: function (st) {
      return (st.player.day || 0) >= 30;
    },
  },
  {
    id: "survive_100_days",
    name: "百日漂泊",
    desc: "在这座城市生存了100天。",
    story: "一百个日出日落，一百次晚上数着口袋里的钱。这座城市还没把你打倒。",
    icon: "📅",
    category: "里程碑",
    hidden: false,
    check: function (st) {
      return (st.player.day || 0) >= 100;
    },
  },
  {
    id: "repay_debt",
    name: "还清欠债",
    desc: "你还清了所有欠下的钱。",
    story: "那压着你的石头终于搬开了。那一刻，你深深地呼了口气。",
    icon: "🎉",
    category: "里程碑",
    hidden: false,
    check: function (st) {
      return (
        (st.resources.villageDebt || 0) <= 0 &&
        (st.resources.bankDebt || 0) <= 0
      );
    },
  },
  {
    id: "enter_corporate",
    name: "白领元年",
    desc: "你进入了职场，开始了人生的新篇章。",
    story: "西装或许还不合身，但工牌上有你的名字。你不再是街头小贩了。",
    icon: "🏢",
    category: "里程碑",
    hidden: false,
    check: function (st) {
      return st.player.phase === "corporate";
    },
  },
  {
    id: "reach_p8",
    name: "P8精英",
    desc: "在职场晋升到P8。",
    story: "同届进来的一半人都走了，你还在，而且往上走了。",
    icon: "🚀",
    category: "里程碑",
    hidden: false,
    check: function (st) {
      var rank = st.corporate && st.corporate.rank;
      return rank === "P8" || rank === "P9" || rank === "P10";
    },
  },
  {
    id: "all_skills_10",
    name: "全能打工人",
    desc: "所有技能都达到10级。",
    story:
      "电工、厨师、驾驶、销售……你什么都会一点，这座城市找不到你干不了的活。",
    icon: "🌟",
    category: "里程碑",
    hidden: false,
    check: function (st) {
      return Object.values(st.skills).every(function (s) {
        return s.level >= 10;
      });
    },
  },

  // === 道德档案（隐藏，记录重大道德选择）===
  {
    id: "moral_kept_wallet",
    name: "拾金不昧",
    desc: "你捡到钱包后选择上交。这件事没人知道，但你知道。",
    story: "那天你可以拿走那些钱，但你没有。有些事，记在良心账本里。",
    icon: "👛",
    category: "道德档案",
    hidden: true,
    check: function (st) {
      return st.flags && st.flags._keptWallet;
    },
  },
  {
    id: "moral_helped_coworker",
    name: "工友的守护者",
    desc: "你在工头压力下仍然为受伤工友叫了救护车。",
    story:
      "那天你可以拿200块走开，但你选择了打120。失去了工头的好感，但留下了良心。",
    icon: "🚑",
    category: "道德档案",
    hidden: true,
    check: function (st) {
      return st.flags && st.flags._helpedCoworker;
    },
  },
  {
    id: "moral_refused_fake",
    name: "诚信商人",
    desc: "你宁可认赔¥800，也不把假货卖给顾客。",
    story:
      "那批货扔掉的时候，你觉得亏了。但你在这座城市的名字，慢慢变得值钱了。",
    icon: "🗑️",
    category: "道德档案",
    hidden: true,
    check: function (st) {
      return st.flags && st.flags._refusedFakeGoods;
    },
  },
  {
    id: "moral_fought_wage_theft",
    name: "维权先锋",
    desc: "你去劳动局追回了被拖欠的工资。",
    story:
      "那段路走得不容易，但你为自己争了权益，也为那些没勇气去的人树了个榜样。",
    icon: "🏛️",
    category: "道德档案",
    hidden: true,
    check: function (st) {
      return st.flags && st.flags._foughtWageTheft;
    },
  },

  // === 隐藏成就 ===
  {
    id: "hidden_broke",
    name: "穷到骨子里",
    desc: "你的现金曾经归零。",
    story: "那一刻，口袋里一分不剩。你记住了这种感觉，然后爬起来了。",
    icon: "💸",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      return st.flags && st.flags._everBroke;
    },
  },
  {
    id: "hidden_starved",
    name: "饿过",
    desc: "你经历过饥饿值归零的时刻。",
    story: "肚子贴着背的感觉，你这辈子不会忘。",
    icon: "🍞",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      return st.flags && st.flags._everStarved;
    },
  },
  {
    id: "hidden_friend_all_npc",
    name: "人缘极好",
    desc: "你和每一个认识的NPC好感度都达到了60+。",
    story: "每个人都记得你，每个人都愿意帮你。人脉，是另一种形式的财富。",
    icon: "🤝",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      if (!st.relationships) return false;
      var npcIds = [
        "aunt_wang",
        "boss_li",
        "sister_zhang",
        "old_zhou",
        "xiao_mei",
        "chef_chen",
      ];
      return npcIds.every(function (id) {
        return st.relationships[id] && st.relationships[id].affinity >= 60;
      });
    },
  },
  {
    id: "hidden_no_beg",
    name: "从不低头",
    desc: "生存了100天，从未乞讨过。",
    story:
      "有些钱，弯腰低头才能捡到，你没有弯。不是因为你不缺，是因为你选择了别的方式。",
    icon: "💪",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      return st.player.day >= 100 && !(st.flags && st.flags._everBegged);
    },
  },

  // === 企业命运成就（P2#11）===
  {
    id: "witness_fall",
    name: "见证陨落",
    desc: "亲眼见证一家公司走向倒闭。",
    story: "你入职时那家充满希望的公司，如今人去楼空。商海浮沉，你亲眼见证了一个时代的结束。",
    icon: "💀",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      if (!st.enterpriseFate || !st.enterpriseFate.companies) return false;
      for (var cid in st.enterpriseFate.companies) {
        var h = st.enterpriseFate.companies[cid].fateEventHistory || [];
        for (var i = 0; i < h.length; i++) {
          if (h[i].eventType === "merger_acquire") return true;
        }
      }
      return false;
    },
  },
  {
    id: "investor_eye",
    name: "投资眼光",
    desc: "投资的公司成长为市场领导者。",
    story: "你在一家公司还不起眼的时候就看中了它。如今它站在行业之巅——你的眼光，没错。",
    icon: "🔮",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      if (!st.enterpriseFate || !st.enterpriseFate.companies) return false;
      for (var cid in st.enterpriseFate.companies) {
        var co = st.enterpriseFate.companies[cid];
        if (co && co.knownToPlayer && co.marketShare >= 30) return true;
      }
      return false;
    },
  },
  {
    id: "corp_killer",
    name: "行业颠覆者",
    desc: "你离开后，公司倒闭了。",
    story: "有人说你命硬，有人说你运气好。只有你知道——你走的那天，就已经预感到了结局。",
    icon: "⚡",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._formerCompanyCollapsed);
    },
  },
];

/**
 * 检查并解锁新成就，返回本次新解锁的成就列表
 */
function checkAchievements(state) {
  if (!state.flags._unlockedAchievements)
    state.flags._unlockedAchievements = [];
  var unlocked = state.flags._unlockedAchievements;
  var newlyUnlocked = [];
  ACHIEVEMENTS.forEach(function (ach) {
    if (unlocked.indexOf(ach.id) !== -1) return; // 已解锁
    try {
      if (ach.check(state)) {
        unlocked.push(ach.id);
        newlyUnlocked.push(ach);
      }
    } catch (e) {}
  });
  return newlyUnlocked;
}

/**
 * 在每日结算和关键行动后调用，展示新解锁成就
 */
function notifyNewAchievements(state) {
  var newOnes = checkAchievements(state);
  newOnes.forEach(function (ach) {
    StateManager.addMessage(
      "🏅 成就解锁：【" + ach.name + "】 — " + ach.story,
      "event",
    );
  });
  return newOnes.length;
}

/** 获取全部成就（含解锁状态） */
function getAchievementsWithStatus(state) {
  var unlocked = (state.flags && state.flags._unlockedAchievements) || [];
  return ACHIEVEMENTS.map(function (ach) {
    var isUnlocked = unlocked.indexOf(ach.id) !== -1;
    return {
      id: ach.id,
      name: isUnlocked || !ach.hidden ? ach.name : "???",
      desc: isUnlocked || !ach.hidden ? ach.desc : "达成特定条件解锁",
      story: isUnlocked ? ach.story : null,
      icon: isUnlocked || !ach.hidden ? ach.icon : "🔒",
      category: ach.category,
      hidden: ach.hidden,
      unlocked: isUnlocked,
    };
  });
}

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
    story:
      "你入职时那家充满希望的公司，如今人去楼空。商海浮沉，你亲眼见证了一个时代的结束。",
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
    story:
      "你在一家公司还不起眼的时候就看中了它。如今它站在行业之巅——你的眼光，没错。",
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
    story:
      "有人说你命硬，有人说你运气好。只有你知道——你走的那天，就已经预感到了结局。",
    icon: "⚡",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._formerCompanyCollapsed);
    },
  },

  // ============================================================
  // 新成就：事件链成就（追踪7条事件链的完成）
  // ============================================================
  {
    id: "chain_re_gamble",
    name: "拆迁赌局赢家",
    desc: "完成房地产赌局事件链——从买私房到拆迁拿钱。",
    story:
      "你赌了一把拆迁，在推土机到来之前拿到了钱。有时候，命运青睐敢下注的人。",
    icon: "🏗️",
    category: "里程碑",
    hidden: true,
    check: function (st) {
      return !!(
        st.flags &&
        (st.flags._reAccepted ||
          st.flags._reCoalitionAccepted ||
          st.flags._reFinalSettled)
      );
    },
  },
  {
    id: "chain_startup_win",
    name: "天使投资人",
    desc: "你投资的创业公司被成功收购，获得了回报。",
    story:
      "从咖啡馆里的一张名片开始，到收购协议上的签名。你学会了：风险最大的路，有时候回报也最大。",
    icon: "💎",
    category: "里程碑",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._startupWin);
    },
  },
  {
    id: "chain_startup_lose",
    name: "风险第一课",
    desc: "你投资的创业公司解散了，投资归零。",
    story:
      "钱没了，但你学到了一个道理：十个创业公司九个死——你用自己的钱包上了这一课。",
    icon: "🔥",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._startupLose);
    },
  },
  {
    id: "chain_gray_testified",
    name: "回头是岸",
    desc: "你参与了灰产但最终选择坦白，获得了从轻处理。",
    story: "那条路你走了一步，然后退了回来。不是每个人都有勇气回头的。",
    icon: "⚖️",
    category: "道德档案",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._grayTestified);
    },
  },
  {
    id: "chain_gray_reported",
    name: "正义举报",
    desc: "你拒绝了灰产诱惑并选择了举报。",
    story: "在所有人都沉默的时候，你说了出来。批发市场的老王头到现在还记得你。",
    icon: "📢",
    category: "道德档案",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._grayReported);
    },
  },
  {
    id: "chain_insider_caught",
    name: "内幕交易者",
    desc: "你因内幕交易被证监会处罚。",
    story: "那扇没关严的门、那份不该看的财报、那次不该下的单。你付出了代价。",
    icon: "🔒",
    category: "道德档案",
    hidden: true,
    check: function (st) {
      return !!(
        st.flags &&
        (st.flags._insiderCaught || st.flags._insiderConfessed)
      );
    },
  },
  {
    id: "chain_insider_resisted",
    name: "守住底线",
    desc: "你看到了内幕信息，但选择了关上那扇门。",
    story:
      "关上CFO办公室门的那一刻，你关上的还有一条不该走的路。没人知道你做了什么，但你知道。",
    icon: "🚪",
    category: "道德档案",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._insiderResisted);
    },
  },
  {
    id: "chain_edu_arbitrage",
    name: "政策套利者",
    desc: "你在教培风暴中抓住了捡漏机会。",
    story:
      "双减落地，别人在哭你在捡课桌椅。危机永远有两面——你学会了看清另一面。",
    icon: "📚",
    category: "里程碑",
    hidden: true,
    check: function (st) {
      return !!(
        st.flags &&
        (st.flags._eduBoughtAssets ||
          st.flags._eduStudyRoom ||
          st.flags._eduMiddleman)
      );
    },
  },
  {
    id: "chain_ev_recovery",
    name: "穿越牛熊",
    desc: "你在新能源泡沫中坚持下来并获利。",
    story:
      "补贴退坡时所有人都在逃离，你留了下来。当潮水重新涨起时，你还在船上。",
    icon: "📈",
    category: "里程碑",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._evRecoverySeen);
    },
  },
  {
    id: "chain_career_evidence",
    name: "职场赢家",
    desc: "你在职场陷阱中收集证据成功翻盘。",
    story:
      "当别人选择背锅或逃跑的时候，你选择了收集证据。在职场上，证据比情绪有用。",
    icon: "♟️",
    category: "里程碑",
    hidden: true,
    check: function (st) {
      return !!(
        st.flags &&
        (st.flags._careerNailed || st.flags._careerEvidencePayoffSeen)
      );
    },
  },
  {
    id: "chain_career_took_blame",
    name: "替罪羊",
    desc: "你替上级背了锅，但选择了沉默。",
    story: "你抗下了本不属于你的错误。有些人说你傻，也有人说你仗义。",
    icon: "😶",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._careerTookBlame);
    },
  },

  // ============================================================
  // 新成就：疾病与生存
  // ============================================================
  {
    id: "survive_first_sick",
    name: "病一场",
    desc: "你在这座城市第一次生病。",
    story:
      "身体垮了才知道健康有多贵。躺在出租屋里，你盯着天花板发誓要照顾好自己。",
    icon: "🤒",
    category: "人生第一次",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._everGotSick);
    },
  },
  {
    id: "survive_chronic",
    name: "慢性病缠身",
    desc: "你患上了慢性疾病，每月需要固定支出医药费。",
    story:
      "有些病好了就是好了，有些病会一直跟着你——像这座城市给你的一个永久印记。",
    icon: "💊",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      return !!(
        st.status &&
        st.status.illnesses &&
        st.status.illnesses.some(function (i) {
          return i.chronic;
        })
      );
    },
  },
  {
    id: "survive_hospitalized",
    name: "进过医院",
    desc: "你的健康值曾跌到危险水平，被送进医院。",
    story: "白色的天花板、消毒水的味道、缴费单上的数字——你不想再来第二次。",
    icon: "🏥",
    category: "人生第一次",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._everHospitalized);
    },
  },
  {
    id: "survive_collapsed",
    name: "撑不住了",
    desc: "你因极度疲劳晕倒过。",
    story:
      "身体到了极限，它替你做了决定。醒来的那一刻，你浑身酸痛，但至少还活着。",
    icon: "😵",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._everCollapsed);
    },
  },

  // ============================================================
  // 新成就：深度里程碑
  // ============================================================
  {
    id: "survive_365_days",
    name: "一年",
    desc: "在这座城市生存了整整一年。",
    story:
      "四季轮回，你熬过了第一个完整的年。这座城市没有赶你走，你也习惯了它的节奏。",
    icon: "🎂",
    category: "里程碑",
    hidden: false,
    check: function (st) {
      return (st.player.day || 0) >= 365;
    },
  },
  {
    id: "earn_1m",
    name: "百万征程",
    desc: "累计赚到了¥1,000,000。",
    story:
      "七位数。从第一天的¥1,500到今天的百万，你用了多久？只有你自己知道每一步的重量。",
    icon: "💰",
    category: "里程碑",
    hidden: false,
    check: function (st) {
      return (st.resources.totalEarned || 0) >= 1000000;
    },
  },
  {
    id: "all_skills_30",
    name: "终身学习者",
    desc: "所有技能都达到了30级。",
    story:
      "没有老师逼你学，没有考试要你过。你用时间证明了——你可以成为任何想成为的人。",
    icon: "📖",
    category: "里程碑",
    hidden: true,
    check: function (st) {
      return Object.values(st.skills).every(function (s) {
        return s.level >= 30;
      });
    },
  },
  {
    id: "all_skills_50",
    name: "技能大师",
    desc: "所有技能都达到了50级。",
    story:
      "从门外汉到行家里手，你用了无数次练习。现在的你，不论到哪都能靠手艺吃饭。",
    icon: "🏆",
    category: "里程碑",
    hidden: true,
    check: function (st) {
      return Object.values(st.skills).every(function (s) {
        return s.level >= 50;
      });
    },
  },
  {
    id: "max_fame",
    name: "城市名人",
    desc: "你的名气达到了100满值。",
    story: "在这座城市里，提起你的名字，每个人都知道是谁。你不再是无名之辈。",
    icon: "⭐",
    category: "里程碑",
    hidden: true,
    check: function (st) {
      return (st.player.fame || 0) >= 100;
    },
  },
  {
    id: "first_gamble_win",
    name: "赌狗一时爽",
    desc: "你在非法赌博中赢了一大笔钱。",
    story: "骰子落下的时候，你赢了。但你知道——赌场永远是最赢的那个。",
    icon: "🎲",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._everWonGamble);
    },
  },
  {
    id: "all_housing_max",
    name: "安得广厦",
    desc: "住上了最高级的住房。",
    story: "从桥洞到单间，从单间到一居室，再到今天——你终于有了一个像样的家。",
    icon: "🏡",
    category: "里程碑",
    hidden: true,
    check: function (st) {
      return (st.housing && st.housing.tier) >= 5;
    },
  },
  {
    id: "all_npc_80",
    name: "人脉王",
    desc: "所有NPC好感度都达到了80+。",
    story: "每个人都是你的朋友。这座城市虽然冷酷，但你把温暖留给了值得的人。",
    icon: "👥",
    category: "里程碑",
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
        return st.relationships[id] && st.relationships[id].affinity >= 80;
      });
    },
  },
  {
    id: "all_npc_hated",
    name: "孤家寡人",
    desc: "所有NPC好感度都跌到了负数。",
    story:
      "你得罪了这座城市的每一个人。可能是你的选择，也可能是你的性格。孤独是自由的另一种形式。",
    icon: "👻",
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
        return st.relationships[id] && st.relationships[id].affinity < 0;
      });
    },
  },
  {
    id: "visit_all_locations",
    name: "城市足迹",
    desc: "你踏遍了这座城市的每一个角落。",
    story:
      "每一个地方都有你的故事——你在工地搬过砖、在大学城学过习、在商业区摆过摊。这座城市的地图上，到处是你的脚印。",
    icon: "🗺️",
    category: "里程碑",
    hidden: true,
    check: function (st) {
      return !!(st.flags && st.flags._visitedAllLocations);
    },
  },
  {
    id: "achievement_hunter_25",
    name: "成就猎人",
    desc: "解锁了25个成就。",
    story:
      "你不是在玩游戏，你是在记录旅途。每一个成就都是这座城市在你身上留下的痕迹。",
    icon: "🎯",
    category: "隐藏",
    hidden: true,
    check: function (st) {
      return (st.flags._unlockedAchievements || []).length >= 25;
    },
  },

  // === 节日成就 ===
  // --- 春节 ---
  {
    id: "spring_fest_home",
    name: "除夕团圆",
    desc: "除夕夜选择买票回家，与家人团圆。",
    story:
      "除夕夜的火车票很贵，但你还是买了。推开家门的那一刻，你知道这¥300花得值。",
    icon: "🏠",
    category: "节日",
    hidden: false,
    check: function (st) {
      return !!(st.flags && st.flags._springFestivalAchieveHome);
    },
  },
  {
    id: "spring_fest_redpacket",
    name: "红包达人",
    desc: "大年初一去拜年，收到红包净赚。",
    story: "花¥100买礼物，回来时兜里多了¥200。人情往来，有时候也是门生意。",
    icon: "🧧",
    category: "节日",
    hidden: false,
    check: function (st) {
      return !!(st.flags && st.flags._springFestivalAchieveRedPacket);
    },
  },
  {
    id: "spring_fest_study",
    name: "赤狗日学霸",
    desc: "初三赤狗日选择在家学习技能。",
    story:
      "别人出门拜年，你在家啃书。赤狗日不宜外出，但宜学习。效率翻倍的感觉真好。",
    icon: "📚",
    category: "节日",
    hidden: false,
    check: function (st) {
      return !!(st.flags && st.flags._springFestivalAchieveStudy);
    },
  },
  {
    id: "spring_fest_worship",
    name: "迎财神",
    desc: "初四去庙里拜财神，求好运。",
    story: "香火钱¥50，心里默念着今年的愿望。虽然没捡到钱，但心里踏实了不少。",
    icon: "💰",
    category: "节日",
    hidden: false,
    check: function (st) {
      return !!(st.flags && st.flags._springFestivalAchieveWorship);
    },
  },
  {
    id: "spring_fest_work",
    name: "破五开工",
    desc: "初五破五选择找临时工开工。",
    story: "破五开工，第一桶金。别人还在睡懒觉，你已经去人才市场了。",
    icon: "🔨",
    category: "节日",
    hidden: false,
    check: function (st) {
      return !!(st.flags && st.flags._springFestivalAchieveWork);
    },
  },
  {
    id: "spring_fest_paydebt",
    name: "送穷神",
    desc: "初六选择还债，减轻财务负担。",
    story: "送穷神，先送掉一部分债务。¥3000还掉了，心里轻松了不少。",
    icon: "🗑️",
    category: "节日",
    hidden: false,
    check: function (st) {
      return !!(st.flags && st.flags._springFestivalAchievePayDebt);
    },
  },
  {
    id: "spring_fest_full",
    name: "春节全勤",
    desc: "春节7天全部参与事件。",
    story:
      "除夕到初六，七天七天，你一天都没落下。这座城市的新年，你完整地走过了一遍。",
    icon: "🧨",
    category: "节日",
    hidden: false,
    check: function (st) {
      return !!(st.flags && st.flags._springFestivalAchieveFullAttendance);
    },
  },

  // --- 剁手节 ---
  {
    id: "shopping_fest_stockup",
    name: "剁手节进货王",
    desc: "剁手节期间大量进货（累计购买超过¥5000）。",
    story:
      "剁手节清仓期，日用品-18%、服装-22%、电子-20%。你一口气进了¥5000的货，等着节日当天翻倍卖。",
    icon: "📦",
    category: "节日",
    hidden: false,
    check: function (st) {
      return !!(st.flags && st.flags._shoppingFestAchieveStockup);
    },
  },
  {
    id: "shopping_fest_profit",
    name: "剁手节清空购物车",
    desc: "剁手节期间通过摆摊赚取超过¥3000利润。",
    story:
      "剁手节商业区人流爆炸，你摆的摊位一天就赚了¥3000。这大概是全年最赚的两天。",
    icon: "🛒",
    category: "节日",
    hidden: false,
    check: function (st) {
      return !!(st.flags && st.flags._shoppingFestAchieveProfit);
    },
  },

  // --- 劳动节 ---
  {
    id: "labor_day_work",
    name: "劳动节加班王",
    desc: "劳动节当天选择工作。",
    story:
      "劳动节，别人在休息，你在干活。商场促销，你帮发传单摆摊台，赚了¥80。",
    icon: "🔨",
    category: "节日",
    hidden: false,
    check: function (st) {
      return !!(st.flags && st.flags._laborDayAchieveWork);
    },
  },

  // --- 中秋节 ---
  {
    id: "midautumn_gift",
    name: "月圆人团圆",
    desc: "中秋节当天给NPC送礼。",
    story: "中秋节，月饼香气弥漫街道。你给王阿姨他们送了个月饼，好感大涨。",
    icon: "🥮",
    category: "节日",
    hidden: false,
    check: function (st) {
      return !!(st.flags && st.flags._midAutumnAchieveGift);
    },
  },

  // --- 国庆节 ---
  {
    id: "national_day_work",
    name: "黄金周导游",
    desc: "国庆节当天在公园做导游志愿者工作。",
    story: "国庆黄金周游客多，你兼职景区向导，赚了¥120。",
    icon: "🎉",
    category: "节日",
    hidden: false,
    check: function (st) {
      return !!(st.flags && st.flags._nationalDayAchieveWork);
    },
  },

  // --- 节日综合 ---
  {
    id: "festival_master",
    name: "节日达人",
    desc: "参与过至少3个不同节日的活动。",
    story:
      "春节、劳动节、中秋节、国庆节、剁手节——你参与了这座城市的大部分节日。",
    icon: "🎭",
    category: "节日",
    hidden: false,
    check: function (st) {
      var count = 0;
      if (st.flags && st.flags._springFestivalAchieveHome) count++;
      if (st.flags && st.flags._laborDayAchieveWork) count++;
      if (st.flags && st.flags._midAutumnAchieveGift) count++;
      if (st.flags && st.flags._nationalDayAchieveWork) count++;
      if (st.flags && st.flags._shoppingFestAchieveStockup) count++;
      return count >= 3;
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

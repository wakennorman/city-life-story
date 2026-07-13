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
    triggers: { minTotalEarned: 1 },
  },
  {
    id: "first_job",
    name: "第一份工作",
    desc: "你完成了在这座城市的第一次打工。",
    story: "汗流浃背，工钱不多，但你知道：这是靠自己双手挣的。",
    icon: "👷",
    category: "人生第一次",
    hidden: false,
    triggers: { minCounter: { flag: "_completedShiftCount", min: 1 } },
  },
  {
    id: "first_trade",
    name: "第一次倒买倒卖",
    desc: "你完成了人生第一次商品买卖。",
    story: "买进卖出，薄薄的差价里藏着市场的逻辑。你开始懂了一点点。",
    icon: "🛒",
    category: "人生第一次",
    hidden: false,
    triggers: { flagMet: "_firstTradeDone" },
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
    triggers: { minDay: 3, minBankBalance: 1 },
  },
  {
    id: "first_injury",
    name: "第一次受伤",
    desc: "你在这座城市第一次流血或受伤。",
    story: "这座城市不是只有机会，也有代价。你用身体记住了这个教训。",
    icon: "🩹",
    category: "人生第一次",
    hidden: true,
    triggers: { flagMet: "_everInjured" },
  },
  {
    id: "first_upgrade_housing",
    name: "第一次搬家",
    desc: "你从最差的住所搬进了稍好一点的地方。",
    story: "新床垫，新钥匙。一点点向上，这就够了。",
    icon: "🏠",
    category: "人生第一次",
    hidden: false,
    triggers: { minDay: 5, minHousingTier: 1 },
  },
  {
    id: "first_skill_level",
    name: "第一次技能升级",
    desc: "你的某项技能第一次提升了等级。",
    story: "那一刻你感到某种东西变了——不是运气，是实力。",
    icon: "⭐",
    category: "人生第一次",
    hidden: false,
    triggers: { flagMet: "_firstSkillUpgraded" },
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
    triggers: { minTotalEarned: 10000 },
  },
  {
    id: "earn_100k",
    name: "十万打工人",
    desc: "累计赚到¥100,000。",
    story: "十万块的积累，花了多少个日夜。你数不清了，但你还在这座城市里站着。",
    icon: "💵",
    category: "里程碑",
    hidden: false,
    triggers: { minTotalEarned: 100000 },
  },
  {
    id: "survive_30_days",
    name: "一个月",
    desc: "在这座城市生存了30天。",
    story: "第一个月是最难的。但你撑过来了。",
    icon: "📅",
    category: "里程碑",
    hidden: false,
    triggers: { minDay: 30 },
  },
  {
    id: "survive_100_days",
    name: "百日漂泊",
    desc: "在这座城市生存了100天。",
    story: "一百个日出日落，一百次晚上数着口袋里的钱。这座城市还没把你打倒。",
    icon: "📅",
    category: "里程碑",
    hidden: false,
    triggers: { minDay: 100 },
  },
  {
    id: "repay_debt",
    name: "还清欠债",
    desc: "你还清了所有欠下的钱。",
    story: "那压着你的石头终于搬开了。那一刻，你深深地呼了口气。",
    icon: "🎉",
    category: "里程碑",
    hidden: false,
    triggers: { minDay: 15, flagMet: "_debtFree" },
  },
  {
    id: "enter_corporate",
    name: "白领元年",
    desc: "你进入了职场，开始了人生的新篇章。",
    story: "西装或许还不合身，但工牌上有你的名字。你不再是街头小贩了。",
    icon: "🏢",
    category: "里程碑",
    hidden: false,
    triggers: { phaseEquals: "corporate" },
  },
  {
    id: "reach_p8",
    name: "P8精英",
    desc: "在职场晋升到P8。",
    story: "同届进来的一半人都走了，你还在，而且往上走了。",
    icon: "🚀",
    category: "里程碑",
    hidden: false,
    triggers: { rankAtLeast: "P8" },
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
    triggers: { minAllSkillLevel: 10 },
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
    triggers: { flagMet: "_keptWallet" },
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
    triggers: { flagMet: "_helpedCoworker" },
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
    triggers: { flagMet: "_refusedFakeGoods" },
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
    triggers: { flagMet: "_foughtWageTheft" },
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
    triggers: { flagMet: "_everBroke" },
  },
  {
    id: "hidden_starved",
    name: "饿过",
    desc: "你经历过饥饿值归零的时刻。",
    story: "肚子贴着背的感觉，你这辈子不会忘。",
    icon: "🍞",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_everStarved" },
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
    triggers: { minDay: 100, flagNotMet: "_everBegged" },
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
    triggers: { enterpriseFateDeath: true },
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
    triggers: { enterpriseFateMarketShare: 30 },
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
    triggers: { flagMet: "_formerCompanyCollapsed" },
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
    triggers: { flagMet: "_reFinalSettled" },
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
    triggers: { flagMet: "_startupWin" },
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
    triggers: { flagMet: "_startupLose" },
  },
  {
    id: "chain_gray_testified",
    name: "回头是岸",
    desc: "你参与了灰产但最终选择坦白，获得了从轻处理。",
    story: "那条路你走了一步，然后退了回来。不是每个人都有勇气回头的。",
    icon: "⚖️",
    category: "道德档案",
    hidden: true,
    triggers: { flagMet: "_grayTestified" },
  },
  {
    id: "chain_gray_reported",
    name: "正义举报",
    desc: "你拒绝了灰产诱惑并选择了举报。",
    story: "在所有人都沉默的时候，你说了出来。批发市场的老王头到现在还记得你。",
    icon: "📢",
    category: "道德档案",
    hidden: true,
    triggers: { flagMet: "_grayReported" },
  },
  {
    id: "chain_insider_caught",
    name: "内幕交易者",
    desc: "你因内幕交易被证监会处罚。",
    story: "那扇没关严的门、那份不该看的财报、那次不该下的单。你付出了代价。",
    icon: "🔒",
    category: "道德档案",
    hidden: true,
    triggers: { flagMet: "_insiderCaught" },
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
    triggers: { flagMet: "_insiderResisted" },
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
    triggers: { flagMet: "_eduBoughtAssets" },
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
    triggers: { flagMet: "_evRecoverySeen" },
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
    triggers: { flagMet: "_careerNailed" },
  },
  {
    id: "chain_career_took_blame",
    name: "替罪羊",
    desc: "你替上级背了锅，但选择了沉默。",
    story: "你抗下了本不属于你的错误。有些人说你傻，也有人说你仗义。",
    icon: "😶",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_careerTookBlame" },
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
    triggers: { flagMet: "_everGotSick" },
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
    triggers: { chronicIllness: true },
  },
  {
    id: "survive_hospitalized",
    name: "进过医院",
    desc: "你的健康值曾跌到危险水平，被送进医院。",
    story: "白色的天花板、消毒水的味道、缴费单上的数字——你不想再来第二次。",
    icon: "🏥",
    category: "人生第一次",
    hidden: true,
    triggers: { flagMet: "_everHospitalized" },
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
    triggers: { flagMet: "_everCollapsed" },
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
    triggers: { minDay: 365 },
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
    triggers: { minTotalEarned: 1000000 },
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
    triggers: { minAllSkillLevel: 30 },
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
    triggers: { minAllSkillLevel: 50 },
  },
  {
    id: "max_fame",
    name: "城市名人",
    desc: "你的名气达到了100满值。",
    story: "在这座城市里，提起你的名字，每个人都知道是谁。你不再是无名之辈。",
    icon: "⭐",
    category: "里程碑",
    hidden: true,
    triggers: { minFame: 100 },
  },
  {
    id: "first_gamble_win",
    name: "赌狗一时爽",
    desc: "你在非法赌博中赢了一大笔钱。",
    story: "骰子落下的时候，你赢了。但你知道——赌场永远是最赢的那个。",
    icon: "🎲",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_everWonGamble" },
  },
  {
    id: "all_housing_max",
    name: "安得广厦",
    desc: "住上了最高级的住房。",
    story: "从桥洞到单间，从单间到一居室，再到今天——你终于有了一个像样的家。",
    icon: "🏡",
    category: "里程碑",
    hidden: true,
    triggers: { minHousingTier: 5 },
  },
  {
    id: "all_npc_80",
    name: "人脉王",
    desc: "所有NPC好感度都达到了80+。",
    story: "每个人都是你的朋友。这座城市虽然冷酷，但你把温暖留给了值得的人。",
    icon: "👥",
    category: "里程碑",
    hidden: true,
    triggers: {
      minAllNpcAffinity: {
        min: 80,
        ids: [
          "aunt_wang",
          "old_zhou",
          "boss_li",
          "sister_zhang",
          "xiao_mei",
          "chef_chen",
          "auntie_lin",
          "master_zhao",
          "xiaoli",
          "zhaojie",
          "chen_ge",
          "ajie",
          "xiaochen",
          "dr_wang",
        ],
      },
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
    triggers: {
      minAllNpcHated: [
        "aunt_wang",
        "old_zhou",
        "boss_li",
        "sister_zhang",
        "xiao_mei",
        "chef_chen",
        "auntie_lin",
        "master_zhao",
        "xiaoli",
        "zhaojie",
        "chen_ge",
        "ajie",
        "xiaochen",
        "dr_wang",
      ],
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
    triggers: { visitedAllLocations: true },
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
    triggers: { flagMet: "_achievementHunterUnlocked" },
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
    triggers: { flagMet: "_springFestivalAchieveHome" },
  },
  {
    id: "spring_fest_redpacket",
    name: "红包达人",
    desc: "大年初一去拜年，收到红包净赚。",
    story: "花¥100买礼物，回来时兜里多了¥200。人情往来，有时候也是门生意。",
    icon: "🧧",
    category: "节日",
    hidden: false,
    triggers: { flagMet: "_springFestivalAchieveRedPacket" },
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
    triggers: { flagMet: "_springFestivalAchieveStudy" },
  },
  {
    id: "spring_fest_worship",
    name: "迎财神",
    desc: "初四去庙里拜财神，求好运。",
    story: "香火钱¥50，心里默念着今年的愿望。虽然没捡到钱，但心里踏实了不少。",
    icon: "💰",
    category: "节日",
    hidden: false,
    triggers: { flagMet: "_springFestivalAchieveWorship" },
  },
  {
    id: "spring_fest_work",
    name: "破五开工",
    desc: "初五破五选择找临时工开工。",
    story: "破五开工，第一桶金。别人还在睡懒觉，你已经去人才市场了。",
    icon: "🔨",
    category: "节日",
    hidden: false,
    triggers: { flagMet: "_springFestivalAchieveWork" },
  },
  {
    id: "spring_fest_paydebt",
    name: "送穷神",
    desc: "初六选择还债，减轻财务负担。",
    story: "送穷神，先送掉一部分债务。¥3000还掉了，心里轻松了不少。",
    icon: "🗑️",
    category: "节日",
    hidden: false,
    triggers: { flagMet: "_springFestivalAchievePayDebt" },
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
    triggers: { flagMet: "_springFestivalAchieveFullAttendance" },
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
    triggers: { flagMet: "_shoppingFestAchieveStockup" },
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
    triggers: { flagMet: "_shoppingFestAchieveProfit" },
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
    triggers: { flagMet: "_laborDayAchieveWork" },
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
    triggers: { flagMet: "_midAutumnAchieveGift" },
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
    triggers: { flagMet: "_nationalDayAchieveWork" },
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
    triggers: { flagMet: "_festivalMasterDone" },
  },

  // ====== 创业成就 ======
  {
    id: "startup_first_company",
    name: "从零到一",
    desc: "注册了第一家公司。",
    story:
      "你迈出了创业的第一步，从打工者变成了老板。这条路不好走，但你开始了。",
    icon: "🚀",
    category: "创业",
    hidden: false,
    triggers: { startupFlag: "registered" },
  },
  {
    id: "startup_first_product",
    name: "产品上线",
    desc: "第一个产品成功发布。",
    story:
      "从0到1是最难的，但你做到了。第一个产品上线了，虽然可能不完美，但它是你的孩子。",
    icon: "📱",
    category: "创业",
    hidden: false,
    triggers: { startupFlag: "firstProductLaunched" },
  },
  {
    id: "startup_first_funding",
    name: "拿到投资",
    desc: "完成了第一次融资。",
    story: "投资人认可了你的项目，钱到账了。但别忘了，每一分钱都是股权换来的。",
    icon: "💰",
    category: "创业",
    hidden: false,
    triggers: { flagMet: "_gotFirstFunding" },
  },
  {
    id: "startup_series_a",
    name: "A轮玩家",
    desc: "完成了A轮融资。",
    story: "A轮意味着你的产品被市场验证了。现在你有钱扩张了，但压力也更大了。",
    icon: "📈",
    category: "创业",
    hidden: false,
    triggers: { startupFundingRound: "A" },
  },
  {
    id: "startup_series_b",
    name: "B轮大佬",
    desc: "完成了B轮融资。",
    story:
      "B轮意味着你已经是行业内的知名玩家了。估值过千万，但你离真正的成功还有距离。",
    icon: "🚀",
    category: "创业",
    hidden: false,
    triggers: { startupFundingRound: "B" },
  },
  {
    id: "startup_team_10",
    name: "十人团队",
    desc: "团队规模达到10人。",
    story: "从一个人到十个人，你开始真正管理一个团队了。管人比管事更难。",
    icon: "👥",
    category: "创业",
    hidden: false,
    triggers: { startupMinEmployees: 10 },
  },
  {
    id: "startup_team_50",
    name: "五十人公司",
    desc: "团队规模达到50人。",
    story: "五十人的公司，已经是一家正经的企业了。你需要建立制度、流程、文化。",
    icon: "🏢",
    category: "创业",
    hidden: false,
    triggers: { startupMinEmployees: 50 },
  },
  {
    id: "startup_profitable",
    name: "首次盈利",
    desc: "公司首次实现月度盈利（收入>支出）。",
    story: "终于盈利了！虽然可能只是微利，但这是从烧钱到自造血的关键一步。",
    icon: "💵",
    category: "创业",
    hidden: false,
    triggers: { startupProfitable: true },
  },
  {
    id: "startup_valuation_1m",
    name: "估值百万",
    desc: "公司估值达到100万。",
    story: "你的公司值100万了。虽然离独角兽还很远，但已经超过了90%的创业者。",
    icon: "📊",
    category: "创业",
    hidden: false,
    triggers: { startupMinValuation: 1000000 },
  },
  {
    id: "startup_valuation_10m",
    name: "估值千万",
    desc: "公司估值达到1000万。",
    story: "估值千万，你已经是一家有分量的公司了。投资人开始主动找你。",
    icon: "🏆",
    category: "创业",
    hidden: false,
    triggers: { startupMinValuation: 10000000 },
  },
  {
    id: "startup_valuation_100m",
    name: "估值过亿",
    desc: "公司估值达到1亿。",
    story: "估值过亿，你是真正的独角兽预备役了。但估值不等于现金，别高兴太早。",
    icon: "🦄",
    category: "创业",
    hidden: false,
    triggers: { startupMinValuation: 100000000 },
  },
  {
    id: "startup_ipo",
    name: "成功上市",
    desc: "公司成功IPO上市。",
    story:
      "你做到了！从0到IPO，这条路你走了很久。现在你站在敲钟台上，台下是闪光灯和掌声。",
    icon: "🔔",
    category: "创业",
    hidden: false,
    triggers: { startupExitType: "ipo" },
  },
  {
    id: "startup_acquired",
    name: "被收购",
    desc: "公司被大公司收购。",
    story:
      "收购不是失败，是另一种成功。你获得了现金回报，公司也获得了更大的平台。",
    icon: "🤝",
    category: "创业",
    hidden: false,
    triggers: { startupExitType: "acquired" },
  },
  {
    id: "startup_bankrupt",
    name: "创业失败",
    desc: "公司破产清算。",
    story:
      "创业九死一生，你经历了其中一次死亡。但失败不是终点，收拾心情，再来一次。",
    icon: "💀",
    category: "创业",
    hidden: true,
    triggers: { startupExitType: "bankrupt" },
  },
  {
    id: "startup_revenue_1m",
    name: "月入百万",
    desc: "月收入突破100万。",
    story: "月入百万，你已经是行业头部玩家了。但别忘了，收入不等于利润。",
    icon: "💎",
    category: "创业",
    hidden: false,
    triggers: { startupMinRevenue: 1000000 },
  },
  {
    id: "startup_user_1m",
    name: "用户破百万",
    desc: "产品用户数突破100万。",
    story: "100万用户，你的产品影响了这么多人。每一个用户都是一个故事。",
    icon: "👥",
    category: "创业",
    hidden: false,
    triggers: { startupMinUsers: 1000000 },
  },
  {
    id: "startup_exit_success",
    name: "成功退出",
    desc: "通过IPO或被收购成功退出（获得现金回报≥100万）。",
    story: "创业的最终目标不是把公司做大，而是获得回报。你做到了，恭喜。",
    icon: "🎯",
    category: "创业",
    hidden: false,
    triggers: { startupExitValue: 1000000 },
  },
  {
    id: "news_intel_collector",
    name: "消息灵通",
    desc: "从NPC处累计获取10条情报。消息就是财富。",
    story:
      "你通过和街坊邻居聊天，获得了一条又一条有价值的情报——在这个城市里，信息差就是钱。",
    icon: "📡",
    category: "新闻",
    hidden: false,
    triggers: { minCounter: { flag: "_intelReceivedCount", min: 10 } },
  },
  {
    id: "news_prophet",
    name: "先知先觉",
    desc: "依靠情报提前布局投资，累计获利超过¥10万。",
    story:
      "别人还在看新闻的时候，你已经提前布局好了一切。你是在正确的时间做正确的事。",
    icon: "🔮",
    category: "新闻",
    hidden: true,
    triggers: { minCounter: { flag: "_intelProfit", min: 100000 } },
  },
  {
    id: "news_commentator",
    name: "新闻评论员",
    desc: "累计触发20次NPC对新闻的评论。",
    story: "每条新闻你都能听到街坊们的看法——你越来越懂这个城市的脉动了。",
    icon: "🎙️",
    category: "新闻",
    hidden: false,
    triggers: { minCounter: { flag: "_npcNewsComments", min: 20 } },
  },

  // ============================================================
  // 生存线成就（城中村阶段）— 正式实现
  // ============================================================
  {
    id: "scrap_master",
    name: "废品大王",
    desc: "废品回收累计收入 ¥10,000",
    story:
      "从第一个塑料瓶到第一千个易拉罐，你把这些没人要的东西变成了真金白银。",
    icon: "♻️",
    category: "里程碑",
    hidden: false,
    triggers: { minCounter: { flag: "_scrapTotalIncome", min: 10000 } },
  },
  {
    id: "street_vendor",
    name: "街头小贩",
    desc: "摆摊累计收入 ¥5,000",
    story: "你的小摊从最初的烤串到后来的煎饼果子，一步步做大了。",
    icon: "🍢",
    category: "里程碑",
    hidden: false,
    triggers: { minCounter: { flag: "_vendingTotalIncome", min: 5000 } },
  },
  {
    id: "survival_30_healthy",
    name: "三十天无恙",
    desc: "生存满30天且从未生病",
    story: "这一个月你小心翼翼，没让自己病过一次。健康是最大的财富。",
    icon: "💪",
    category: "健康/生活线",
    hidden: true,
    triggers: { minDay: 30, flagNotMet: "_everGotSick" },
  },
  {
    id: "no_home_7days",
    name: "流浪者",
    desc: "露宿街头满7天",
    story: "天为被，地为床。那七天你明白了什么叫真正的底层。",
    icon: "🌃",
    category: "人生第一次",
    hidden: true,
    triggers: { minCounter: { flag: "_homelessDays", min: 7 } },
  },
  {
    id: "homeless_to_roof",
    name: "从街头到屋顶",
    desc: "从露宿升级到合租床位",
    story: "你终于有了属于自己的床——虽然只是别人家的一角。",
    icon: "🛏️",
    category: "里程碑",
    hidden: false,
    triggers: { flagMet: "_everHomeless", minHousingTier: 1 },
  },
  {
    id: "market_hawk",
    name: "市场猎手",
    desc: "单次交易利润超过 ¥500",
    story: "那笔买卖你赚了一整天的工钱。市场的逻辑，你摸到了一点门道。",
    icon: "📈",
    category: "里程碑",
    hidden: false,
    triggers: { minCounter: { flag: "_maxSingleTradeProfit", min: 500 } },
  },
  {
    id: "scavenge_king",
    name: "拾荒之王",
    desc: "单次拾荒获得物品总价值超 ¥200",
    story: "那天你运气爆棚，捡到的东西卖了一大笔。但好运不会每次都来。",
    icon: "🔍",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_maxSingleScavengeValue", min: 200 } },
  },
  {
    id: "rain_walker",
    name: "雨中行者",
    desc: "暴雨天出门工作3次",
    story: "雨再大你也得出去，因为家里的米缸不能空。",
    icon: "🌧️",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_rainyWorkCount", min: 3 } },
  },
  {
    id: "thrift_master",
    name: "节俭大师",
    desc: "连续7天不购买任何物品",
    story: "七天，你没花一分钱在购物上。省下的每一块钱都是赚到的。",
    icon: "💰",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_maxThriftDays", min: 7 } },
  },
  {
    id: "neighborly",
    name: "远亲不如近邻",
    desc: "王大婶好感达到30",
    story: "王大婶开始把你当自己人了。在城中村，有个好邻居比什么都重要。",
    icon: "👵",
    category: "社交线",
    hidden: false,
    triggers: { minNpcAffinity: { id: "aunt_wang", min: 30 } },
  },
  {
    id: "night_owl",
    name: "夜猫子",
    desc: "在晚上（22:00后）工作5次",
    story: "深夜的街道空无一人，只有你还在干活。夜越深，钱越难赚。",
    icon: "🌙",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_nightWorkCount", min: 5 } },
  },
  {
    id: "early_bird",
    name: "早起鸟",
    desc: "在早晨（6:00前）工作5次",
    story: "天还没亮你就起来了。早起的鸟儿有虫吃。",
    icon: "🌅",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_earlyWorkCount", min: 5 } },
  },
  {
    id: "hustle_7days",
    name: "七天无休",
    desc: "连续7天不休息（不睡觉/不躺平）",
    story: "七天你没给自己放一天假。身体在抗议，但你不能停。",
    icon: "⚡",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_maxHustleDays", min: 7 } },
  },
  {
    id: "first_1k",
    name: "千元户",
    desc: "累计赚到 ¥1,000",
    story: "一千块。不多，但这是你在这座城市站稳脚跟的第一步。",
    icon: "💵",
    category: "人生第一次",
    hidden: false,
    triggers: { minTotalEarned: 1000 },
  },
  {
    id: "first_homebuyer",
    name: "有房一族",
    desc: "购买了自己的自住房",
    story: "房产证上写着你的名字。这一刻，你觉得自己真正属于这座城市了。",
    icon: "🏠",
    category: "里程碑",
    hidden: false,
    triggers: { flagMet: "_ownedHome" },
  },

  // ============================================================
  // 职场线成就（打工→开公司）— 正式实现
  // ============================================================
  {
    id: "office_newbie_project",
    name: "职场新人·首战告捷",
    desc: "入职第一周完成首个项目",
    story: "你忐忑地接下了第一个需求，三天后交付了。领导说还行。",
    icon: "💻",
    category: "人生第一次",
    hidden: false,
    triggers: { flagMet: "_firstWeekProjectDone" },
  },
  {
    id: "first_promotion",
    name: "初露锋芒",
    desc: "第一次晋升（P5→P6）",
    story:
      "晋升邮件发下来的时候，你盯着屏幕看了很久。同届进来的人，有的走了，有的升了。",
    icon: "📈",
    category: "里程碑",
    hidden: false,
    triggers: { rankAtLeast: "P6", flagNotMet: "_everAtP7" },
  },
  {
    id: "team_leader",
    name: "团队领袖",
    desc: "晋升P7，首次管理团队",
    story:
      "你开始管人了。管人比管事难——有人想躺平，有人想出头，你要在中间找平衡。",
    icon: "👥",
    category: "里程碑",
    hidden: false,
    triggers: { flagMet: "_teamLeaderAchieved" },
  },
  {
    id: "expert_path",
    name: "技术专家",
    desc: "晋升P8",
    story: "P8。同届进来的一半人都走了，你还在，而且往上走了。",
    icon: "🚀",
    category: "里程碑",
    hidden: false,
    triggers: { rankAtLeast: "P8" },
  },
  {
    id: "partner",
    name: "合伙人",
    desc: "晋升P10",
    story: "你站在了金字塔尖。回头看，这条路走了多久？",
    icon: "👑",
    category: "里程碑",
    hidden: false,
    triggers: { rankAtLeast: "P10" },
  },
  {
    id: "overtime_warrior",
    name: "加班战神",
    desc: "累计加班100小时",
    story: "一百个小时的加班，换来了什么？钱？经验？还是透支的身体？",
    icon: "🌙",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_overtimeWarriorAchieved" },
  },
  {
    id: "kpi_king",
    name: "KPI之王",
    desc: "连续5次绩效考核S级",
    story: "五次S级。你成了部门的标杆，也成了其他人的靶子。",
    icon: "🏆",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_consecutiveSCount", min: 5 } },
  },
  {
    id: "networker",
    name: "社交达人",
    desc: "向上社交行动累计10次",
    story: "你学会了和领导吃饭、汇报、展示价值。职场不只是干活，还有人情世故。",
    icon: "🤝",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_upwardSocialCount", min: 10 } },
  },
  {
    id: "tech_geek",
    name: "技术极客",
    desc: "学习新技术累计20次",
    story: "你一直在学。新技术、新框架、新语言。技术人的路，永远在前方。",
    icon: "📚",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_techLearnCount", min: 20 } },
  },
  {
    id: "work_life",
    name: "工作生活平衡",
    desc: "摸鱼/休息行动累计30次",
    story: "你学会了在忙碌中偷闲。工作不是全部，生活也是。",
    icon: "🎮",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_restActionCount", min: 30 } },
  },
  {
    id: "stock_wizard",
    name: "股票巫师",
    desc: "公司股票投资累计盈利 ¥50,000",
    story: "你买的股票涨了。不是运气，是你看懂了这家公司。",
    icon: "📈",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_stockTotalProfit", min: 50000 } },
  },
  {
    id: "risk_taker",
    name: "风险承担者",
    desc: "走捷径/埋雷行动累计10次",
    story: "你选择了走捷径。短期有利，但你知道——埋下的雷迟早会炸。",
    icon: "💣",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_shortcutCount", min: 10 } },
  },
  {
    id: "risk_defuser",
    name: "风险化解者",
    desc: "排查风险行动累计10次",
    story: "你一次次排查风险、修bug、写测试。代码的质量，是你守住的底线。",
    icon: "🔍",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_riskDefuseCount", min: 10 } },
  },
  {
    id: "company_founder",
    name: "创业老板",
    desc: "成功开公司",
    story: "你从打工者变成了老板。这条路，你走了很久。",
    icon: "🚀",
    category: "里程碑",
    hidden: false,
    triggers: { startupFlag: "registered" },
  },
  {
    id: "ipo_dream",
    name: "IPO梦想",
    desc: "公司成功上市",
    story: "敲钟的那一刻，闪光灯刺眼。你做到了。",
    icon: "🔔",
    category: "里程碑",
    hidden: false,
    triggers: { startupExitType: "ipo" },
  },
  {
    id: "first_praise",
    name: "被看见",
    desc: "第一次被领导公开表扬",
    story: "会议上，领导提到了你的名字。那一刻，你觉得所有的加班都值了。",
    icon: "🌟",
    category: "人生第一次",
    hidden: true,
    triggers: { flagMet: "_firstPraise" },
  },
  {
    id: "first_criticism",
    name: "挨批",
    desc: "第一次被领导公开批评",
    story: "会议室里的空气凝固了。领导的话像刀子一样。你记住了这种感觉。",
    icon: "😓",
    category: "人生第一次",
    hidden: true,
    triggers: { flagMet: "_firstCriticism" },
  },
  {
    id: "first_mentor",
    name: "师父",
    desc: "第一次带新人",
    story: "新人怯生生地问你问题。你忽然想起了当年的自己。",
    icon: "👨‍🏫",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_firstMentored" },
  },
  {
    id: "first_no_overtime",
    name: "第一次说不",
    desc: "第一次拒绝加班",
    story: "你说'今天不加了'。领导愣了一下，同意了。你发现——天不会塌。",
    icon: "✋",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_firstRefusedOvertime" },
  },

  // ============================================================
  // 投资线成就 — 正式实现
  // ============================================================
  {
    id: "first_stock",
    name: "第一支股票",
    desc: "买入第一支股票",
    story: "你按下了买入键。那一刻，你不再是旁观者，你是参与者。",
    icon: "📈",
    category: "人生第一次",
    hidden: false,
    triggers: { flagMet: "_firstStockBought" },
  },
  {
    id: "bull_runner",
    name: "牛市跑者",
    desc: "在牛市中获利 ¥100,000",
    story: "牛市来了，你抓住了。十万块的利润，是趋势+眼光+运气。",
    icon: "🐂",
    category: "里程碑",
    hidden: false,
    triggers: { minCounter: { flag: "_bullMarketProfit", min: 100000 } },
  },
  {
    id: "bear_survivor",
    name: "熊市幸存者",
    desc: "在熊市中存活30天不爆仓",
    story: "熊市里，很多人割肉离场。你留了下来，因为你知道——冬天之后是春天。",
    icon: "🐻",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_bearSurvivalDays", min: 30 } },
  },
  {
    id: "btc_early",
    name: "比特币早期投资者",
    desc: "比特币<¥10,000时买入",
    story: "那时候没人相信比特币。你买了，不是因为懂，是因为相信未来。",
    icon: "₿",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_btcEarlyBuy" },
  },
  {
    id: "real_estate_baron",
    name: "房地产大亨",
    desc: "房产投资累计盈利 ¥500,000",
    story: "你买了房，涨了，卖了。再来一次。房地产是你的提款机。",
    icon: "🏠",
    category: "里程碑",
    hidden: false,
    triggers: { minCounter: { flag: "_propertyTotalProfit", min: 500000 } },
  },
  {
    id: "diversified",
    name: "资产配置大师",
    desc: "同时持有股票+房产+BTC+贵金属",
    story: "你不把鸡蛋放在一个篮子里。分散，是对不确定性的敬畏。",
    icon: "📊",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_hasAllAssetTypes" },
  },
  {
    id: "timing_master",
    name: "时机大师",
    desc: "单次低买高卖利润超 ¥50,000",
    story: "你买在最低点，卖在最高点。那一刻，你觉得自己是股神。",
    icon: "⏰",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_maxSingleInvestProfit", min: 50000 } },
  },
  {
    id: "long_term",
    name: "长期主义者",
    desc: "持有某支股票超过180天",
    story: "你没卖。涨涨跌跌，你看着它。180天后，你收获了复利。",
    icon: "⏳",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_maxHoldingDays", min: 180 } },
  },
  {
    id: "panic_seller_fixed",
    name: "克服恐慌",
    desc: "在恐慌性抛售时买入",
    story: "所有人都在卖，你在买。别人恐惧时你贪婪——这句话你做到了。",
    icon: "💪",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_boughtInPanic" },
  },
  {
    id: "millionaire_investor",
    name: "投资百万富翁",
    desc: "投资累计总盈利 ¥1,000,000",
    story: "一百万的投资利润。你不再是那个为几千块纠结的人了。",
    icon: "💰",
    category: "里程碑",
    hidden: false,
    triggers: { minCounter: { flag: "_totalInvestProfit", min: 1000000 } },
  },
  {
    id: "first_big_loss",
    name: "第一课",
    desc: "第一次投资亏损超过 ¥10,000",
    story: "那笔投资你亏了。十多万，没了。你记住了：市场永远是对的。",
    icon: "💸",
    category: "人生第一次",
    hidden: true,
    triggers: { minCounter: { flag: "_maxSingleInvestLoss", min: 10000 } },
  },
  {
    id: "all_in_sell",
    name: "清仓大师",
    desc: "一次性卖出所有持仓",
    story: "你清仓了。不是恐慌，是判断——你认为顶部来了。",
    icon: "📉",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_didFullSell" },
  },

  // ============================================================
  // 社交线成就 — 正式实现
  // ============================================================
  {
    id: "friend_circle",
    name: "朋友圈",
    desc: "与3个NPC好感达到30",
    story: "你有了朋友。这座城市不再那么冷了。",
    icon: "👥",
    category: "社交线",
    hidden: false,
    triggers: { flagMet: "_friendCircleAchieved" },
  },
  {
    id: "best_friend",
    name: "挚友",
    desc: "与任意NPC好感达到80",
    story: "你和某人成了真正的朋友。TA信任你，你也信任TA。",
    icon: "❤️",
    category: "社交线",
    hidden: false,
    triggers: { flagMet: "_bestFriendAchieved" },
  },
  {
    id: "gift_giver",
    name: "送礼达人",
    desc: "累计送礼10次",
    story: "你学会了送礼。不是讨好，是维护关系。人情往来，是一门学问。",
    icon: "🎁",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_giftCount", min: 10 } },
  },
  {
    id: "birthday_celebration",
    name: "生日庆祝者",
    desc: "给3个NPC过生日",
    story: "你记得他们的生日。被记住的感觉，很好。",
    icon: "🎂",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_birthdayCelebrateCount", min: 3 } },
  },
  {
    id: "favor_return",
    name: "互帮互助",
    desc: "完成5次NPC求助",
    story: "你帮了别人，别人也帮了你。这就是人情。",
    icon: "🤝",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_favorHelpCount", min: 5 } },
  },
  {
    id: "deep_connection",
    name: "深度连接",
    desc: "完成3个NPC深度任务",
    story: "你走进了他们的故事。那些藏在心底的话，你说出来了。",
    icon: "💬",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_deepTaskCompleteCount", min: 3 } },
  },
  {
    id: "social_butterfly",
    name: "社交蝴蝶",
    desc: "与所有NPC好感达到60",
    story: "每个人都记得你，每个人都愿意帮你。人脉，是另一种形式的财富。",
    icon: "🦋",
    category: "隐藏",
    hidden: true,
    triggers: {
      minAllNpcAffinity: {
        min: 60,
        ids: [
          "aunt_wang",
          "boss_li",
          "sister_zhang",
          "old_zhou",
          "xiao_mei",
          "chef_chen",
        ],
      },
    },
  },
  {
    id: "mentor_student",
    name: "师徒传承",
    desc: "小美好感80+并完成支教",
    story: "你陪小美去了支教。那群孩子的眼睛，让你想起了自己为什么来这座城市。",
    icon: "👩‍🏫",
    category: "社交线",
    hidden: false,
    triggers: { minNpcAffinity: { id: "xiao_mei", min: 80 }, flagMet: "_xiaomeiVolunteerDone" },
  },
  {
    id: "first_meal",
    name: "一起吃饭",
    desc: "第一次和NPC一起吃饭",
    story: "你们坐在路边的小馆里。饭菜不贵，但那一刻很温暖。",
    icon: "🍜",
    category: "人生第一次",
    hidden: true,
    triggers: { flagMet: "_firstMealWithNPC" },
  },
  {
    id: "first_gift_received",
    name: "被惦记",
    desc: "收到NPC的第一份礼物",
    story: "TA记得你喜欢什么。被惦记的感觉，比礼物本身更珍贵。",
    icon: "🎁",
    category: "人生第一次",
    hidden: true,
    triggers: { flagMet: "_firstGiftReceived" },
  },

  // ============================================================
  // 健康/生活线成就 — 正式实现
  // ============================================================
  {
    id: "healthy_living",
    name: "健康生活",
    desc: "健康值保持80+超过30天",
    story: "你学会了照顾自己。健康不是理所当然的，是需要经营的。",
    icon: "💪",
    category: "健康/生活线",
    hidden: false,
    triggers: { minCounter: { flag: "_healthyDaysStreak", min: 30 } },
  },
  {
    id: "disease_survivor",
    name: "疾病幸存者",
    desc: "患过任意疾病并治愈",
    story: "你生过病，也好了。那场病让你明白：健康是最大的财富。",
    icon: "💊",
    category: "人生第一次",
    hidden: true,
    triggers: { flagMet: "_everCuredIllness" },
  },
  {
    id: "fitness_freak",
    name: "健身狂人",
    desc: "体质达到80",
    story: "你练出了好身体。体力工作不再那么累，你也更有底气了。",
    icon: "💪",
    category: "隐藏",
    hidden: true,
    triggers: { minPhysique: 80 },
  },
  {
    id: "mindful",
    name: "正念大师",
    desc: "心智达到80",
    story: "你学会了控制情绪。这座城市再乱，你的心是静的。",
    icon: "🧘",
    category: "隐藏",
    hidden: true,
    triggers: { minMental: 80 },
  },
  {
    id: "cooking_master",
    name: "烹饪大师",
    desc: "烹饪技能达到50级",
    story: "你成了大厨。家常菜做得比餐馆还好。",
    icon: "🍳",
    category: "隐藏",
    hidden: true,
    triggers: { minSkillLevel: { cooking: 50 } },
  },
  {
    id: "perfect_diet",
    name: "完美饮食",
    desc: "连续7天自己做饭",
    story: "七天，你没点过一次外卖。自己做的饭，好吃又省钱。",
    icon: "🍲",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_maxCookingStreak", min: 7 } },
  },
  {
    id: "no_illness_100days",
    name: "百日无病",
    desc: "100天内不患任何疾病",
    story: "一百天，你没病过。你学会了：预防比治疗重要。",
    icon: "🛡️",
    category: "健康/生活线",
    hidden: true,
    triggers: { minCounter: { flag: "_maxIllnessFreeDays", min: 100 } },
  },
  {
    id: "first_checkup",
    name: "体检",
    desc: "第一次去做体检",
    story: "你去了医院体检。拿到报告的那一刻，你希望一切正常。",
    icon: "🩺",
    category: "人生第一次",
    hidden: true,
    triggers: { flagMet: "_firstCheckup" },
  },
  {
    id: "gym_member",
    name: "健身卡",
    desc: "购买了健身卡",
    story: "你办了健身卡。虽然不一定每次都去，但至少你开始了。",
    icon: "🏋️",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_gymMembership" },
  },

  // ============================================================
  // 隐藏成就（叙事向）— 正式实现
  // ============================================================
  {
    id: "share_when_poor",
    name: "雪中送炭",
    desc: "在饥荒日（现金<¥10且饥饿<20）选择分享食物给NPC",
    story:
      "你自己都快饿死了，但还是把食物分给了更需要的人。那一刻，你觉得自己还没被这座城市完全改变。",
    icon: "❤️",
    category: "道德档案",
    hidden: true,
    triggers: { flagMet: "_sharedFoodWhenPoor" },
  },
  {
    id: "persistent_giver",
    name: "持之以恒",
    desc: "连续30天每天给某个NPC送礼",
    story:
      "三十天，你没间断。TA说'不用这么麻烦'，但你坚持。有些关系，需要时间沉淀。",
    icon: "📅",
    category: "隐藏",
    hidden: true,
    triggers: { minCounter: { flag: "_maxGiftStreak", min: 30 } },
  },
  {
    id: "help_when_hated",
    name: "以德报怨",
    desc: "在NPC最困难时（好感<0）仍然帮助他",
    story:
      "TA讨厌你，但你还是帮了。不是因为期待回报，是因为你觉得——应该这么做。",
    icon: "🕊️",
    category: "道德档案",
    hidden: true,
    triggers: { flagMet: "_helpedHatedNPC" },
  },
  {
    id: "clean_record",
    name: "清白之身",
    desc: "在城市生活满30天，从未做过任何违法工作。",
    story:
      "这座城市有很多灰色的路。你没走。不是因为胆小，是因为你知道——有些线不能跨。",
    icon: "⚖️",
    category: "道德档案",
    hidden: true,
    triggers: { flagMet: "_cleanRecord" },
  },
  {
    id: "perfect_timing",
    name: "神之一手",
    desc: "在牛市顶峰时全部卖出，熊市谷底时全部买入",
    story:
      "你卖在了最高点，买在了最低点。那一刻，你觉得自己是股神。但你知道——运气成分很大。",
    icon: "🎯",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_perfectMarketTiming" },
  },
  {
    id: "never_fired",
    name: "仁厚老板",
    desc: "开公司后从未解雇过任何员工",
    story: "你开公司后，没解雇过任何人。员工有难，你扛了。",
    icon: "🤝",
    category: "道德档案",
    hidden: true,
    triggers: { startupFlag: "registered", flagNotMet: "_everFiredEmployee" },
  },
  {
    id: "hidden_friend_all_npc",
    name: "人缘极好",
    desc: "你和每一个认识的NPC好感度都达到了60+。",
    story: "每个人都记得你，每个人都愿意帮你。人脉，是另一种形式的财富。",
    icon: "🤝",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_allFriends60" },
  },
  {
    id: "last_money_donation",
    name: "最后的善良",
    desc: "把最后一笔钱（现金<¥50时）捐给慈善",
    story:
      "你只剩几十块了，但还是捐了。那一刻，你觉得自己还没被这座城市完全改变。",
    icon: "🙏",
    category: "道德档案",
    hidden: true,
    triggers: { flagMet: "_donatedLastMoney" },
  },
  {
    id: "refused_illegal_job",
    name: "底线",
    desc: "拒绝高薪但违法的工作",
    story: "¥5000一天，但你拒绝了。有些钱，不能赚。",
    icon: "✋",
    category: "道德档案",
    hidden: true,
    triggers: { flagMet: "_refusedIllegalJob" },
  },

  // ============================================================
  // 职业路径成就（v3.51 新增，对应 CAREER_PATHS 上班族系统）
  // 设计参考：BitLife 职业成就 / Papers Please 隐藏记录 / 大多数成长感
  // ============================================================
  {
    id: "career_first_promotion",
    name: "第一级台阶",
    desc: "在职业路径中第一次晋升。",
    story:
      "你递交了晋升申请，然后等待。邮件弹出来的那一刻，你意识到：这条路，你还能走得更远。",
    icon: "📈",
    category: "里程碑",
    hidden: false,
    triggers: { flagMet: "_careerFirstPromotion" },
  },
  {
    id: "career_hundred_days",
    name: "百日职场人",
    desc: "在同一职业路径岗位工作满100天。",
    story:
      "一百天。不是每个人都能在这座城市的格子间里撑过一百天——你做到了，而且你还打算继续。",
    icon: "💼",
    category: "里程碑",
    hidden: false,
    triggers: { flagMet: "_career100Days" },
  },
  {
    id: "career_cross_path",
    name: "职场变色龙",
    desc: "从一条职业路径跳槽到完全不同的另一条路径。",
    story:
      "IT码农去做了销售，财务助理转行做了厨师——你不把自己困在一个标签里。每次重新开始，你都比上次更清楚自己要什么。",
    icon: "🦎",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_crossPathJobhop" },
  },
  {
    id: "career_max_level",
    name: "路径巅峰",
    desc: "在某条职业路径达到最高级别。",
    story:
      "没有比这更高的台阶了。从第一天到今天，你用时间换来了最高的头衔——现在是做别的事情的时候了。",
    icon: "🏔️",
    category: "里程碑",
    hidden: false,
    triggers: { flagMet: "_careerMaxLevel" },
  },
  {
    id: "career_multipath",
    name: "职场探险家",
    desc: "尝试过3条或以上不同的职业路径。",
    story:
      "销售、IT、物流、餐饮……你每换一次，就多了一套对世界的理解。这个城市的每个行业，你都留下了脚印。",
    icon: "🗺️",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_careerMultiPath" },
  },
  {
    id: "career_burnout_survivor",
    name: "凤凰涅槃",
    desc: "从职业倦怠巅峰（≥70）完全恢复（≤20）。",
    story:
      "那段时间你几乎要崩溃了——每天上班像上刑场。但你撑过来了，给自己放了个假，然后重新站起来。这才是真正的职场韧性。",
    icon: "🔥",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_burnoutSurvivor" },
  },
  {
    id: "career_top_performer",
    name: "绩效之王",
    desc: "业绩值达到90分（隐藏成就）。",
    story:
      "年终绩效S+。你的名字出现在了公司优秀员工名单上——那种被看见的感觉，和薪资一样重要。",
    icon: "🏆",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_careerTopPerformer" },
  },
  {
    id: "career_occupational_disease",
    name: "职业的代价",
    desc: "因职业风险导致健康受损——每个行业都有自己的职业病。",
    story:
      "医生的感染风险、IT的颈椎病、物流的腰椎损伤……你用身体记住了这份工作的代价。但你还在坚持——因为这座城市的生存不允许你停下来。",
    icon: "⚕️",
    category: "隐藏",
    hidden: true,
    triggers: { flagMet: "_hasOccupationalDisease" },
  },
];

// ====== 成就触发调度表（约定式自动归类 v3.99c） ======
// 新增成就只需声明 triggers 字段，系统自动判定，无需手写 check 函数
// 复杂成就仍保留 check 函数作为兜底

var TRIGGER_DISPATCH = {
  // 简单flag检查
  flagMet: function (st, val) {
    return !!(st.flags && st.flags[val]);
  },
  flagNotMet: function (st, val) {
    return !(st.flags && st.flags[val]);
  },
  // 累计收入阈值
  minTotalEarned: function (st, val) {
    return (st.resources.totalEarned || 0) >= val;
  },
  // 天数阈值
  minDay: function (st, val) {
    return (st.player.day || 0) >= val;
  },
  // 银行存款阈值
  minBankBalance: function (st, val) {
    return (st.resources.bankBalance || 0) >= val;
  },
  // 全部技能达到指定等级
  minAllSkillLevel: function (st, val) {
    return Object.values(st.skills).every(function (s) {
      return s.level >= val;
    });
  },
  // 名气阈值
  minFame: function (st, val) {
    return (st.player.fame || 0) >= val;
  },
  // 体质阈值
  minPhysique: function (st, val) {
    return (st.player.physique || 0) >= val;
  },
  // 心智阈值
  minMental: function (st, val) {
    return (st.player.mental || 0) >= val;
  },
  // 住所等级阈值
  minHousingTier: function (st, val) {
    return ((st.housing && st.housing.tier) || 0) >= val;
  },
  // 游戏阶段检查
  phaseEquals: function (st, val) {
    return st.player.phase === val;
  },
  // 公司职级检查
  rankAtLeast: function (st, val) {
    return st.corporate && st.corporate.rank === val;
  },
  // 计数器阈值（st.flags 中的数字字段）
  minCounter: function (st, val) {
    return ((st.flags && st.flags[val.flag]) || 0) >= val.min;
  },
  // 单个NPC好感阈值
  minNpcAffinity: function (st, val) {
    return (
      st.relationships &&
      st.relationships[val.id] &&
      st.relationships[val.id].affinity >= val.min
    );
  },
  // 所有NPC好感阈值
  minAllNpcAffinity: function (st, val) {
    if (!st.relationships) return false;
    return val.ids.every(function (id) {
      return st.relationships[id] && st.relationships[id].affinity >= val.min;
    });
  },
  // 所有NPC好感负数
  minAllNpcHated: function (st, val) {
    if (!st.relationships) return false;
    return val.every(function (id) {
      return st.relationships[id] && st.relationships[id].affinity < 0;
    });
  },
  // 创业flag检查
  startupFlag: function (st, val) {
    return !!(st.startup && st.startup.flags && st.startup.flags[val]);
  },
  // 创业退出类型
  startupExitType: function (st, val) {
    return st.startup && st.startup.flags && st.startup.flags.exitType === val;
  },
  // 创业融资轮次
  startupFundingRound: function (st, val) {
    if (!st.startup || !st.startup.company || !st.startup.company.fundingRounds)
      return false;
    return st.startup.company.fundingRounds.some(function (r) {
      return r.round === val;
    });
  },
  // 创业团队人数
  startupMinEmployees: function (st, val) {
    if (!st.startup || !st.startup.company || !st.startup.company.employees)
      return false;
    return st.startup.company.employees.length >= val;
  },
  // 创业估值
  startupMinValuation: function (st, val) {
    return (
      st.startup &&
      st.startup.company &&
      (st.startup.company.valuation || 0) >= val
    );
  },
  // 创业月收入
  startupMinRevenue: function (st, val) {
    return (
      st.startup &&
      st.startup.company &&
      (st.startup.company.revenue || 0) >= val
    );
  },
  // 创业盈利检查
  startupProfitable: function (st, val) {
    if (!st.startup || !st.startup.company) return false;
    return st.startup.company.revenue > st.startup.company.expenses;
  },
  // 慢性病检查
  chronicIllness: function (st, val) {
    return (
      st.status &&
      st.status.illnesses &&
      st.status.illnesses.some(function (i) {
        return i.chronic;
      })
    );
  },
  // 企业命运倒闭检查
  enterpriseFateDeath: function (st, val) {
    if (!st.enterpriseFate || !st.enterpriseFate.companies) return false;
    for (var cid in st.enterpriseFate.companies) {
      var h = st.enterpriseFate.companies[cid].fateEventHistory || [];
      for (var i = 0; i < h.length; i++) {
        if (
          h[i].eventType === "company_death" ||
          h[i].eventType === "merger_acquire"
        )
          return true;
      }
    }
    return false;
  },
  // 企业命运市场份额
  enterpriseFateMarketShare: function (st, val) {
    if (!st.enterpriseFate || !st.enterpriseFate.companies) return false;
    for (var cid in st.enterpriseFate.companies) {
      if (
        st.enterpriseFate.companies[cid].knownToPlayer &&
        st.enterpriseFate.companies[cid].marketShare >= val
      )
        return true;
    }
    return false;
  },
  // 技能单技能等级检查
  minSkillLevel: function (st, val) {
    for (var key in val) {
      if (
        !st.skills ||
        !st.skills[key] ||
        (st.skills[key].level || 0) < val[key]
      )
        return false;
    }
    return true;
  },
  // 产品用户数
  startupMinUsers: function (st, val) {
    if (!st.startup || !st.startup.company || !st.startup.company.products)
      return false;
    for (var i = 0; i < st.startup.company.products.length; i++) {
      if ((st.startup.company.products[i].users || 0) >= val) return true;
    }
    return false;
  },
  // 已访问所有地点
  visitedAllLocations: function (st, val) {
    return !!(st.flags && st.flags._visitedAllLocations);
  },
  // 成功退出（创业获得现金回报）
  startupExitValue: function (st, val) {
    return (
      st.startup && st.startup.flags && (st.startup.flags.exitValue || 0) >= val
    );
  },
};

function evaluateTriggersDispatch(triggers, state) {
  for (var key in triggers) {
    var handler = TRIGGER_DISPATCH[key];
    if (!handler) continue;
    if (!handler(state, triggers[key])) return false;
  }
  return true;
}

/**
 * 检查并解锁新成就，返回本次新解锁的成就列表
 * 支持约定式 triggers: 字段自动判定 + check 函数兜底
 */
function checkAchievements(state) {
  if (!state.flags._unlockedAchievements)
    state.flags._unlockedAchievements = [];
  var unlocked = state.flags._unlockedAchievements;
  var newlyUnlocked = [];
  // ── CoC 前提条件标志统一更新（在成就遍历前计算） ──
  // 里程碑：从街头到屋顶（housing.tier>=1 + _everHomeless）
  // 此项恰好在 triggers 中直接组合，无需额外 flag
  // 成就猎人（25个成就）
  if ((state.flags._unlockedAchievements || []).length >= 25) {
    state.flags._achievementHunterUnlocked = true;
  }
  // 节日达人（至少3个节日参与）
  var festCount = 0;
  if (state.flags._springFestivalAchieveHome) festCount++;
  if (state.flags._laborDayAchieveWork) festCount++;
  if (state.flags._midAutumnAchieveGift) festCount++;
  if (state.flags._nationalDayAchieveWork) festCount++;
  if (state.flags._shoppingFestAchieveStockup) festCount++;
  if (festCount >= 3) state.flags._festivalMasterDone = true;
  // 首次融资
  if (
    state.startup &&
    state.startup.company &&
    state.startup.company.fundingRounds &&
    state.startup.company.fundingRounds.length >= 1
  ) {
    state.flags._gotFirstFunding = true;
  }
  // 加班战神（累计加班100小时）
  if ((state.corporate && state.corporate.totalOvertimeHours) || 0 >= 100) {
    state.flags._overtimeWarriorAchieved = true;
  }
  // 团队领袖（P7 + teamSize>=2）
  if (
    state.corporate &&
    state.corporate.rank === "P7" &&
    (state.corporate.teamSize || 0) >= 2
  ) {
    state.flags._teamLeaderAchieved = true;
  }
  // 朋友圈（6个NPC中>=3个好感>=30）
  if (state.relationships) {
    var friendCount = 0;
    var bestFriendCount = 0;
    ["aunt_wang","boss_li","sister_zhang","old_zhou","xiao_mei","chef_chen"].forEach(function(id) {
      if (state.relationships[id] && state.relationships[id].affinity >= 30) friendCount++;
      if (state.relationships[id] && state.relationships[id].affinity >= 80) bestFriendCount++;
    });
    if (friendCount >= 3) state.flags._friendCircleAchieved = true;
    if (bestFriendCount >= 1) state.flags._bestFriendAchieved = true;
  }
  // 人缘极好（所有已认识NPC好感>=60）
  if (state.relationships && (state.player.day || 0) >= 30) {
    var rels = state.relationships;
    var metAny = false;
    var allHigh = true;
    var metNpcs = Object.keys(rels).filter(function(k) {
      return rels[k] && typeof rels[k].affinity === "number" && rels[k].met;
    });
    for (var fi = 0; fi < metNpcs.length; fi++) {
      var r = rels[metNpcs[fi]];
      if (r && typeof r.affinity === "number" && r.affinity > 0) {
        metAny = true;
        if (r.affinity < 60) { allHigh = false; break; }
      }
    }
    if (metAny && allHigh) state.flags._allFriends60 = true;
  }
  // 百日职场人（workDays>=100）
  if (
    state.career &&
    state.career.currentJob &&
    (state.career.currentJob.workDays || 0) >= 100
  ) {
    state.flags._career100Days = true;
  }
  // 路径巅峰（最高级别）
  if (
    state.career &&
    state.career.currentJob &&
    typeof CAREER_PATHS !== "undefined"
  ) {
    var cJob = state.career.currentJob;
    var cPath = CAREER_PATHS[cJob.path];
    if (cPath && cPath.levels && cPath.levels.length > 0 && cJob.levelId === cPath.levels[cPath.levels.length - 1].id) {
      state.flags._careerMaxLevel = true;
    }
  }
  // 职场探险家（>=3条不同路径）
  if (state.flags && state.flags._careerPathsWorked && Object.keys(state.flags._careerPathsWorked).length >= 3) {
    state.flags._careerMultiPath = true;
  }
  // 绩效之王（perf>=90 && workDays>=30）
  if (
    state.career &&
    state.career.currentJob &&
    (state.career.currentJob.performance || 0) >= 90 &&
    (state.career.currentJob.workDays || 0) >= 30
  ) {
    state.flags._careerTopPerformer = true;
  }
  // ── 成就遍历 ──
  ACHIEVEMENTS.forEach(function (ach) {
    if (unlocked.indexOf(ach.id) !== -1) return; // 已解锁
    try {
      var met = false;
      if (ach.triggers) {
        met = evaluateTriggersDispatch(ach.triggers, state);
      } else if (typeof ach.check === "function") {
        met = ach.check(state);
      }
      if (met) {
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
    // 如果 showAchievementUnlockedPopup 已加载，显示飘窗通知
    if (typeof showAchievementUnlockedPopup === "function") {
      showAchievementUnlockedPopup(ach);
    }
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

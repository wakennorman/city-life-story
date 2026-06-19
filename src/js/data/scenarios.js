/**
 * 剧本模式 — 预设角色背景定义
 *
 * 每一类角色都是某个真实社会群体的缩影，有其生存逻辑与叙事弧线。
 * 新剧本只需在此数组中追加条目，无需改动其他文件。
 */

const SCENARIOS = [
  // ====== 默认/经典：城市务工者 ======
  {
    id: "classic",
    name: "城市务工者",
    icon: "🏘️",
    category: "default",
    brief: "从城中村收废品起步，技能积累与阶级流动的经典叙事",
    description:
      "你从农村来到城市，揣着仅有的1500元，还欠村长5500元。一切从零开始——城中村的废品回收、工地上的汗水和街头的小生意。这座城市既冷漠又充满机会，看你能否抓住命运的转折点。",
    startingMessage:
      "🏘️ 你揣着1500元来到这座城市。欠村长5500元，日息0.35%复利。活下去，混出个人样来！",
    difficulty: "★★☆",
    difficultyLabel: "适中",
    // 初始属性
    stats: { physique: 22, intelligence: 20, agility: 24, mental: 26 },
    // 初始资源
    resources: { cash: 1500, bankBalance: 0, villageDebt: 5500, bankDebt: 0 },
    // 初始年龄
    age: 20,
    // 初始技能（level, xp）
    skills: {
      cooking: { level: 0, xp: 0 },
      repair: { level: 0, xp: 0 },
      coding: { level: 0, xp: 0 },
      english: { level: 0, xp: 0 },
      driving: { level: 0, xp: 0 },
      sales: { level: 0, xp: 0 },
      management: { level: 0, xp: 0 },
      accounting: { level: 0, xp: 0 },
      electrician: { level: 0, xp: 0 },
      welding: { level: 0, xp: 0 },
    },
    // 初始学历 0=大专, 1=本科, 2=研究生
    education: 0,
    // 初始需求
    needs: { hunger: 70, fatigue: 15, hygiene: 75, happiness: 55 },
    // 初始健康
    health: 100,
    // 初始住所等级
    housingTier: 0, // 0=露宿
    // 初始名声
    fame: 0,
    // 场地
    startLocation: "slum",
    // 游戏阶段
    phase: "street",
    // 特殊标记
    tags: ["新手友好", "均衡发展"],
    // 叙事标签（用于游戏百科、成就统计等）
    narrativeTags: ["migrant_worker"],
    // 剧本专属起始事件（可选）
    startEvent: null,
  },

  // ====== 下岗再就业者 ======
  {
    id: "laid_off",
    name: "下岗再就业者",
    icon: "🏭",
    category: "scenario",
    brief: "前工厂工人转型摆摊/外卖，年龄焦虑与技能断层",
    description:
      "38岁，工厂倒闭了。你在这座城市干了十五年，一纸通知就让你下了岗。年龄尴尬，技能单一，但你不甘心就这样认命。街边摆摊、送外卖、做家政——只要能赚钱，什么都愿意干。你最大的武器是那双手磨出来的厚茧和这座城市二十年的人情冷暖。",
    startingMessage:
      "🏭 在工厂干了十五年，说不要就不要了。你攥着手里这点遣散费站在街头发愣。但你知道，这座城市不会可怜一个停下脚步的人。",
    difficulty: "★★★★",
    difficultyLabel: "困难",
    stats: { physique: 45, intelligence: 18, agility: 22, mental: 30 },
    resources: {
      cash: 8000,
      bankBalance: 2000,
      villageDebt: 0,
      bankDebt: 3000,
    },
    age: 38,
    skills: {
      cooking: { level: 5, xp: 0 },
      repair: { level: 25, xp: 0 },
      coding: { level: 0, xp: 0 },
      english: { level: 0, xp: 0 },
      driving: { level: 20, xp: 0 },
      sales: { level: 3, xp: 0 },
      management: { level: 5, xp: 0 },
      accounting: { level: 0, xp: 0 },
      electrician: { level: 20, xp: 0 },
      welding: { level: 25, xp: 0 },
    },
    education: 0,
    needs: { hunger: 50, fatigue: 30, hygiene: 60, happiness: 25 },
    health: 80,
    housingTier: 1,
    fame: 5,
    startLocation: "slum",
    phase: "street",
    tags: ["技能专精", "大龄开局", "体力优势"],
    narrativeTags: ["laid_off", "age_anxiety"],
    startEvent: {
      title: "🏭 工厂大门最后一眼",
      text: "你最后一次站在工厂门口。门卫老李跟你打了十几年招呼，这次他没说话，拍了拍你的肩膀。你攥着遣散费——8万块，刚好够还掉房贷尾款再撑几个月。你告诉自己：这个年纪，不能倒下。",
      effects: { mental: 5 },
    },
  },

  // ====== 小镇做题家 ======
  {
    id: "small_town_grinder",
    name: "小镇做题家",
    icon: "📚",
    category: "scenario",
    brief: "大学毕业进城，学历光环vs现实落差，白领→创业→失败→归零的弧线",
    description:
      "你是全村第一个考上大学的。毕业那天你觉得自己无所不能，但来到这座城市才发现，学历只是入场券，不是门票。投了三个月简历，面试了二十家公司，最后只能从科技园的数据录入员做起。你不怕吃苦，你怕的是让老家那些供你读书的人失望。",
    startingMessage:
      "📚 你拖着行李箱走出火车站，抬头看着这座城市的摩天大楼。手机震动——老家的父亲发来消息：「到了吗？好好干。」你深吸一口气，开始了在这座城市的漂流。",
    difficulty: "★★★",
    difficultyLabel: "中等",
    stats: { physique: 14, intelligence: 42, agility: 16, mental: 35 },
    resources: {
      cash: 3000,
      bankBalance: 500,
      villageDebt: 12000,
      bankDebt: 8000,
    },
    age: 23,
    skills: {
      cooking: { level: 2, xp: 0 },
      repair: { level: 1, xp: 0 },
      coding: { level: 10, xp: 0 },
      english: { level: 18, xp: 0 },
      driving: { level: 5, xp: 0 },
      sales: { level: 2, xp: 0 },
      management: { level: 0, xp: 0 },
      accounting: { level: 5, xp: 0 },
      electrician: { level: 0, xp: 0 },
      welding: { level: 0, xp: 0 },
    },
    education: 1, // 本科学历
    needs: { hunger: 60, fatigue: 25, hygiene: 80, happiness: 40 },
    health: 90,
    housingTier: 0,
    fame: 3,
    startLocation: "techPark",
    phase: "street",
    tags: ["高智力", "本科学历", "债务人开局"],
    narrativeTags: ["college_graduate", "student_debt"],
    startEvent: {
      title: "📚 火车站的清晨",
      text: "你坐在火车站外面的台阶上，手机连上免费WiFi，打开招聘App。本科文凭在学历栏里闪着光，但你心里清楚：这座城市里，跟你一样有本科学历的人，比你想象的多得多。",
      effects: { intelligence: 2 },
    },
  },

  // ====== 外来打工者 ======
  {
    id: "foreign_worker",
    name: "外来打工者",
    icon: "🌏",
    category: "scenario",
    brief: "跨国打工人，语言障碍与文化隔阂，聚居区生存",
    description:
      "你从东南亚老家来到这座城市打工。语言不通，但你知道在这里赚一个月够在老家赚半年。你跟老乡们挤在城郊的聚居区里，每天在工厂流水线上重复同样的动作。你想学会这里的语言，想不被欺负，想带着一技之长回家。",
    startingMessage:
      "🌏 飞机降落的那一刻，你感受到了一种从未有过的寒冷。老乡来接你，带你挤进了一间已经住了八个人的出租屋。明天开始，你要在流水线上站十二个小时。",
    difficulty: "★★★★★",
    difficultyLabel: "极难",
    stats: { physique: 30, intelligence: 12, agility: 28, mental: 32 },
    resources: { cash: 500, bankBalance: 0, villageDebt: 10000, bankDebt: 0 },
    age: 24,
    skills: {
      cooking: { level: 3, xp: 0 },
      repair: { level: 5, xp: 0 },
      coding: { level: 0, xp: 0 },
      english: { level: 15, xp: 0 }, // 英语作为第二语言
      driving: { level: 0, xp: 0 },
      sales: { level: 2, xp: 0 },
      management: { level: 0, xp: 0 },
      accounting: { level: 0, xp: 0 },
      electrician: { level: 3, xp: 0 },
      welding: { level: 8, xp: 0 },
    },
    education: 0,
    needs: { hunger: 55, fatigue: 40, hygiene: 40, happiness: 30 },
    health: 85,
    housingTier: 0,
    fame: 0,
    startLocation: "factoryZone",
    phase: "street",
    tags: ["挑战模式", "语言障碍", "高韧性"],
    narrativeTags: ["foreign_worker", "language_barrier"],
    startEvent: {
      title: "🌏 异乡的第一夜",
      text: "宿舍的铁架床吱呀作响。你看着手机里老家的照片，汇率换算了一遍又一遍——这里的日薪，够妈妈买一个月的菜。你决定：不管多难，都要留下来。",
      effects: { mental: 5 },
    },
  },

  // ====== 二代创业者 ======
  {
    id: "second_gen",
    name: "二代创业者",
    icon: "💎",
    category: "scenario",
    brief: "有资源背景但不懂操盘，需要从零学习商业逻辑",
    description:
      "家里给了你一笔启动资金，但你很清楚——那些钱不是你的本事赚来的。你知道怎么做生意才有面子，却不知道怎么做生意才能赚钱。你不想让别人说你是啃老的废物，想自己做出点什么来。这座城市最不缺的就是有想法的人，缺的是能把想法变现的人。",
    startingMessage:
      "💎 「拿着这笔钱，去做你想做的事。」父亲把银行卡推到你面前。你看着那串数字，心跳加速，但更多的是心虚。你不想让他失望——但你甚至不知道从哪开始。",
    difficulty: "★★☆",
    difficultyLabel: "偏易",
    stats: { physique: 18, intelligence: 25, agility: 15, mental: 22 },
    resources: {
      cash: 50000,
      bankBalance: 100000,
      villageDebt: 0,
      bankDebt: 0,
    },
    age: 22,
    skills: {
      cooking: { level: 0, xp: 0 },
      repair: { level: 0, xp: 0 },
      coding: { level: 5, xp: 0 },
      english: { level: 8, xp: 0 },
      driving: { level: 10, xp: 0 },
      sales: { level: 0, xp: 0 },
      management: { level: 0, xp: 0 },
      accounting: { level: 0, xp: 0 },
      electrician: { level: 0, xp: 0 },
      welding: { level: 0, xp: 0 },
    },
    education: 1,
    needs: { hunger: 75, fatigue: 10, hygiene: 85, happiness: 60 },
    health: 95,
    housingTier: 2, // 单间起步
    fame: 10,
    startLocation: "commercialDist",
    phase: "street",
    tags: ["资金充足", "技能匮乏", "压力开局"],
    narrativeTags: ["second_gen", "family_pressure"],
    startEvent: {
      title: "💎 银行账户里的数字",
      text: "你在商业区最好的咖啡馆坐着，手机银行显示余额六位数。隔壁桌的人在聊融资、风口、商业模式。你什么都听不懂。你第一次意识到：有钱和有能力，是两回事。",
      effects: { mental: -3, fame: 5 },
    },
  },

  // ====== 中年危机职场人 ======
  {
    id: "midlife_crisis",
    name: "中年危机职场人",
    icon: "👔",
    category: "scenario",
    brief: "35岁被裁，面对降薪还是创业的两难抉择",
    description:
      "35岁，P7职级，你以为自己至少还能再干五年。直到那天HR把你叫进会议室。公司优化调整，你是名单上的第一个。房贷还剩二十年，孩子下学期的学费要交，你坐在出租车上不知道该往哪儿开。降薪去小公司？还是拿赔偿金搏一把创业？这座城市第一次让你感到害怕。",
    startingMessage:
      "👔 你抱着纸箱走出写字楼。手机弹出一条房贷催缴通知。你深吸一口气，翻出通讯录里那几个说「随时欢迎你来」的猎头号码。也翻出了压在抽屉底的创业计划书。",
    difficulty: "★★★",
    difficultyLabel: "中等",
    stats: { physique: 16, intelligence: 38, agility: 14, mental: 28 },
    resources: {
      cash: 15000,
      bankBalance: 80000,
      villageDebt: 0,
      bankDebt: 50000,
    },
    age: 35,
    skills: {
      cooking: { level: 5, xp: 0 },
      repair: { level: 3, xp: 0 },
      coding: { level: 30, xp: 0 },
      english: { level: 22, xp: 0 },
      driving: { level: 15, xp: 0 },
      sales: { level: 15, xp: 0 },
      management: { level: 25, xp: 0 },
      accounting: { level: 10, xp: 0 },
      electrician: { level: 0, xp: 0 },
      welding: { level: 0, xp: 0 },
    },
    education: 1,
    needs: { hunger: 60, fatigue: 35, hygiene: 75, happiness: 20 },
    health: 75,
    housingTier: 2,
    fame: 15,
    startLocation: "techPark",
    phase: "street",
    tags: ["高技能起步", "高负债", "高压开局"],
    narrativeTags: ["laid_off_white_collar", "midlife"],
    startEvent: {
      title: "👔 走出写字楼的那一刻",
      text: "电梯门合上之前，你回头看了一眼那个坐了六年的工位。绿植还在，显示器还亮着。新来的实习生已经在收拾你对面的桌子。你突然觉得轻松了——这六年，你早就不属于那里了。",
      effects: { mental: 5, happiness: -5 },
    },
  },

  // ====== 应届毕业生（扩展剧本） ======
  {
    id: "fresh_grad",
    name: "应届毕业生",
    icon: "🎓",
    category: "scenario",
    brief: "职场新人，一腔热血但身无分文，从零积累职场资本",
    description:
      "刚走出大学校门，你带着一张文凭和满腔热血来到这座城市。没有经验、没有人脉、没有存款——你有的只是年轻和不怕输的劲头。你知道第一步很难，但你相信只要方向对，路就会越走越宽。",
    startingMessage:
      "🎓 毕业典礼的第二天你就坐上了来这座城市的火车。室友问你为什么这么急，你说：「因为我不想给家里添负担了。」",
    difficulty: "★★☆",
    difficultyLabel: "适中",
    stats: { physique: 18, intelligence: 32, agility: 20, mental: 30 },
    resources: {
      cash: 2000,
      bankBalance: 0,
      villageDebt: 8000,
      bankDebt: 15000,
    },
    age: 22,
    skills: {
      cooking: { level: 3, xp: 0 },
      repair: { level: 2, xp: 0 },
      coding: { level: 15, xp: 0 },
      english: { level: 20, xp: 0 },
      driving: { level: 5, xp: 0 },
      sales: { level: 3, xp: 0 },
      management: { level: 0, xp: 0 },
      accounting: { level: 8, xp: 0 },
      electrician: { level: 0, xp: 0 },
      welding: { level: 0, xp: 0 },
    },
    education: 1,
    needs: { hunger: 55, fatigue: 20, hygiene: 75, happiness: 50 },
    health: 95,
    housingTier: 0,
    fame: 0,
    startLocation: "school",
    phase: "street",
    tags: ["年轻", "学生贷款", "高潜力"],
    narrativeTags: ["fresh_grad", "student_debt"],
    startEvent: null,
  },
];

/**
 * 剧本分类
 * 用于在剧本选择界面分组展示
 */
const SCENARIO_CATEGORIES = [
  { id: "default", name: "🎯 默认模式", desc: "经典开局，推荐新玩家" },
  { id: "scenario", name: "📜 剧本模式", desc: "预设角色背景，体验不同人生" },
];

/**
 * 沙盒模式默认配置模板
 */
const SANDBOX_DEFAULTS = {
  name: "自定义",
  age: 20,
  gender: "male",
  cash: 5000,
  bankBalance: 0,
  villageDebt: 3000,
  bankDebt: 0,
  physique: 22,
  intelligence: 22,
  agility: 22,
  mental: 22,
  health: 100,
  education: 0,
  housingTier: 0,
  fame: 0,
  startLocation: "slum",
  cooking: 0,
  repair: 0,
  coding: 0,
  english: 0,
  driving: 0,
  sales: 0,
  management: 0,
  accounting: 0,
  electrician: 0,
  welding: 0,
};

/** 沙盒模式属性点上限 */
const SANDBOX_MAX_TOTAL_STAT_POINTS = 120; // 四项街头属性总和上限
const SANDBOX_MAX_SKILL_POINTS = 30; // 技能等级总和上限
const SANDBOX_STAT_PER_POINT = 10; // 每点属性消耗10"天赋点"
const SANDBOX_INITIAL_TALENT_POINTS = 40; // 初始天赋点（用于分配属性）

/** 根据ID获取剧本 */
function getScenarioById(id) {
  return SCENARIOS.find(function (s) {
    return s.id === id;
  });
}

// ====== 注册到游戏百科 ======
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.scenario_mode = {
    id: "scenario_mode",
    name: "剧本模式 & 沙盒模式",
    icon: "🎭",
    brief:
      "除了经典开局外，可选用预设角色背景（剧本模式）或自定义起始属性（沙盒模式）开始游戏",
    version: "1.0",
    related: ["mechanics:new_game_plus"],
    sections: [
      {
        subhead: "剧本模式",
        items: function () {
          return SCENARIOS.filter(function (s) {
            return s.category === "scenario";
          }).map(function (s) {
            return s.icon + " **" + s.name + "**：" + s.brief;
          });
        },
      },
      {
        subhead: "沙盒模式",
        desc: "自由分配初始属性点、资金、技能、年龄和负债，打造属于你自己的开局。四项街头属性总和不超过120点。",
      },
    ],
  };
}

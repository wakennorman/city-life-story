/**
 * 剧本模式 — 预设角色背景定义
 *
 * 每一类角色都是某个真实社会群体的缩影，有其生存逻辑与叙事弧线。
 * 新剧本只需在此数组中追加条目，无需改动其他文件。
 *
 * ⚠️ 新剧本开局设计铁律：
 *   具体数字 × 人物关系 × 道德困境 × 倒计时 × 情感温度
 *   参见 memory/opening-hook-design-prompt.md
 *
 * 🚗 驾照注意：
 *   新剧本需考虑角色是否合理拥有驾照，可在 skills.driving 中设置初始等级。
 *   - 已有驾照（driving≥10）：可直接从事驾驶类工作（批发配送、快递、网约车等）
 *   - 无驾照：需到培训中心考取（¥800，通过率60%）
 *   沙盒模式在"技能"区下方有"已有驾照"复选框。
 */

const SCENARIOS = [
  // ====== 默认/经典：城市务工者（v3.0 黑暗开局重做） ======
  {
    id: "classic",
    name: "城市务工者",
    icon: "🏚️",
    category: "default",
    brief:
      "弟弟的学费¥800、你口袋里的¥300、桥洞下的第一个清晨——3天内找到饭吃，是你唯一的任务",
    description:
      "你来自湘西一个小村子，揣着¥300——是你娘卖了两只鸡、攒了三个月才凑出来的盘缠。\n\n弟弟李明才12岁，下学期学费还差¥800。村里人说：如果你出去打工不成，就让他跟你一起退学回来种地。\n\n你现在睡在城中村桥洞下，旁边是一个来了八年还没攒够回家路费的四川大叔。三天没正经吃饭，胃在拧成绳，健康亮红灯。\n\n这座城市不会等你——弟弟更不会等。",
    startingMessage:
      "🏚️ 凌晨五点，城中村桥洞。潮湿地面渗上来股霉味，你睡在烂纸板上，口袋里还有¥300。弟弟李明昨晚发来语音，你没敢听——先活下去，3天内必须找到饭吃。",
    difficulty: "★★★★",
    difficultyLabel: "地狱",
    // 初始属性（v3.0：保留 mental 字段名避免破坏现有代码，UI 层显示为"能力"；新增 charm 颜值）
    stats: {
      physique: 18,
      intelligence: 15,
      agility: 22,
      mental: 18,
      charm: 20,
    },
    // 初始资源（v3.0 黑暗：¥300 起步，无村长债）
    resources: { cash: 300, bankBalance: 0, villageDebt: 0, bankDebt: 0 },
    // 初始年龄
    age: 20,
    // 初始技能
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
    // 初始学历
    education: 0,
    // 初始需求（v3.0 黑暗：饥饱见底、卫生差、心情崩、疲劳高）
    needs: { hunger: 25, fatigue: 50, hygiene: 30, happiness: 20 },
    // 初始健康（v3.0 黑暗：70 不是 100，逼玩家立刻处理）
    health: 70,
    // 初始道德（v3.0 新增，0-100，初始 50）
    morality: 50,
    // 初始住所等级
    housingTier: 0, // 0=露宿
    // 初始名声
    fame: 0,
    // 场地
    startLocation: "slum",
    // 游戏阶段
    phase: "street",
    // 特殊标记
    tags: ["地狱开局", "逼玩家集中赚钱", "道德考验"],
    // 叙事标签
    narrativeTags: ["migrant_worker", "dark_start"],
    // 剧本专属起始事件
    startEvent: {
      title: "🌅 桥洞里的第一个清晨",
      text: "天刚亮，你摸出手机——3%的电。弟弟昨晚发了条语音，你犹豫了三秒，点开。\n\n「哥……学校说下学期学费要提前交……¥800……妈说等你消息……」\n\n他在哭。你听完，把手机锁上。\n\n旁边的四川大叔没睁眼，翻了个身说：「工地六点招日工，去晚了就满了。」\n\n口袋里¥300，胃在绞着疼。你站起来，抖掉纸板上的灰。",
      effects: { mental: -5, happiness: -10 },
    },
    // 开局天赋池（随机抽，⚪普通/🔵优秀/🟡稀有三档权重 60/30/10）
    talents: [
      {
        id: "strong_back",
        name: "力大无穷",
        icon: "🦾",
        rarity: "common",
        desc: "天生力气大，体质+10，搬运和体力活更顺手",
        apply: function (s) {
          s.player.physique = Math.min(100, s.player.physique + 10);
        },
      },
      {
        id: "nimble_worker",
        name: "手脚麻利",
        icon: "⚡",
        rarity: "common",
        desc: "动作快人一步，敏捷+10，每天能多干一点",
        apply: function (s) {
          s.player.agility = Math.min(100, s.player.agility + 10);
        },
      },
      {
        id: "fellow_guide",
        name: "老乡指路",
        icon: "🤝",
        rarity: "common",
        desc: "有老乡介绍工头联系方式，魅力+5，心情+15",
        apply: function (s) {
          s.player.charm = Math.min(100, s.player.charm + 5);
          s.needs.happiness = Math.min(100, s.needs.happiness + 15);
        },
      },
      {
        id: "desperation_drive",
        name: "破釜沉舟",
        icon: "🔥",
        rarity: "common",
        desc: "没有退路反而激出韧性，能力+12，道德感+3",
        apply: function (s) {
          s.player.mental = Math.min(100, s.player.mental + 12);
          s.player.morality = Math.min(100, s.player.morality + 3);
        },
      },
      {
        id: "veteran_physique",
        name: "老练工人",
        icon: "🏗️",
        rarity: "uncommon",
        desc: "老家干过工地，体质+8敏捷+6双属性加成",
        apply: function (s) {
          s.player.physique = Math.min(100, s.player.physique + 8);
          s.player.agility = Math.min(100, s.player.agility + 6);
        },
      },
      {
        id: "steel_nerve",
        name: "钢铁意志",
        icon: "🧱",
        rarity: "uncommon",
        desc: "经历过更难的关口，能力+10，健康+8",
        apply: function (s) {
          s.player.mental = Math.min(100, s.player.mental + 10);
          s.status.health = Math.min(100, s.status.health + 8);
        },
      },
      {
        id: "destined_worker",
        name: "天选打工人",
        icon: "⭐",
        rarity: "rare",
        desc: "命运格外垂青，体质+15，敏捷+10，额外¥500",
        apply: function (s) {
          s.player.physique = Math.min(100, s.player.physique + 15);
          s.player.agility = Math.min(100, s.player.agility + 10);
          s.resources.cash = (s.resources.cash || 0) + 500; // [全系统自洽修复] 域G A类: cash NaN防御
        },
      },
    ],
  },

  // ====== 下岗再就业者 ======
  {
    id: "laid_off",
    name: "下岗再就业者",
    icon: "🏭",
    category: "scenario",
    brief:
      "十五年工龄换来一纸通知，老婆只说了一句话：孩子学费¥8500，下月15号截止",
    description:
      "三十八岁，工厂倒闭了。你在这座城市干了十五年，一纸通知就让你下了岗。\n\n老婆张梅没哭，当天晚上只说了一句话：「孩子下学期学费¥8500，你想想办法。」\n\n你攥着遣散费——够还掉银行¥3000的尾款，再撑三个月。焊接、电工、修理，这双手的本事你知道；但工厂不要四十岁的人，你也知道。\n\n同车间的陈师傅比你小两岁，已经去应聘物业管理了。他说：「老张，不丢人，先活着。」\n\n但你不甘心。这双茧子不该就这么废掉。",
    startingMessage:
      "🏭 遣散费到账，门卫老李把跟了你十五年的工牌装进信封递给你，一言不发。你攥着钱站在工厂门口——张梅昨晚说的那句「¥8500，下月15号」，比这寒风更冷。",
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
      text: "你最后一次从这扇铁门走出去。门卫老李没说话，拍了拍你的肩膀。那张蓝色工牌跟了你十五年，颜色都磨白了，现在装进信封里了。\n\n手机震：张梅发来消息——「学费的事记得，¥8500，下月15号截止」\n\n你存款够还贷、够撑三个月，但够不了你想要的那种活法。\n\n这双茧子，值多少钱——你自己定。",
      effects: { mental: -3, happiness: -8 },
    },
    talents: [
      {
        id: "veteran_craftsman",
        name: "老师傅",
        icon: "🔧",
        rarity: "common",
        desc: "手艺比同期工人都强，维修技能+12",
        apply: function (s) {
          if (s.skills.repair)
            s.skills.repair.level = Math.min(100, s.skills.repair.level + 12);
        },
      },
      {
        id: "wide_connections",
        name: "人脉广",
        icon: "🤝",
        rarity: "common",
        desc: "工厂里认识的人多，名声+10，魅力+5",
        apply: function (s) {
          s.player.fame = Math.min(100, s.player.fame + 10);
          s.player.charm = Math.min(100, s.player.charm + 5);
        },
      },
      {
        id: "resilient_spirit",
        name: "越挫越勇",
        icon: "💪",
        rarity: "common",
        desc: "人到中年历过风浪，能力+12，健康+5",
        apply: function (s) {
          s.player.mental = Math.min(100, s.player.mental + 12);
          s.status.health = Math.min(100, s.status.health + 5);
        },
      },
      {
        id: "skilled_electrician",
        name: "电工一把手",
        icon: "⚙️",
        rarity: "common",
        desc: "电工经验扎实，电工+10，体质+3",
        apply: function (s) {
          if (s.skills.electrician)
            s.skills.electrician.level = Math.min(
              100,
              s.skills.electrician.level + 10,
            );
          s.player.physique = Math.min(100, s.player.physique + 3);
        },
      },
      {
        id: "dual_trade",
        name: "焊修两手硬",
        icon: "🔩",
        rarity: "uncommon",
        desc: "焊接和维修都精通，焊接+10，维修+8",
        apply: function (s) {
          if (s.skills.welding)
            s.skills.welding.level = Math.min(100, s.skills.welding.level + 10);
          if (s.skills.repair)
            s.skills.repair.level = Math.min(100, s.skills.repair.level + 8);
        },
      },
      {
        id: "old_horse",
        name: "老骥伏枥",
        icon: "🏇",
        rarity: "uncommon",
        desc: "越老越硬，体质+5，能力+10，健康+5",
        apply: function (s) {
          s.player.physique = Math.min(100, s.player.physique + 5);
          s.player.mental = Math.min(100, s.player.mental + 10);
          s.status.health = Math.min(100, s.status.health + 5);
        },
      },
      {
        id: "gold_craftsman",
        name: "金牌工匠",
        icon: "🏅",
        rarity: "rare",
        desc: "厂里第一把好手，维修+15，焊接+15，名声+5",
        apply: function (s) {
          if (s.skills.repair)
            s.skills.repair.level = Math.min(100, s.skills.repair.level + 15);
          if (s.skills.welding)
            s.skills.welding.level = Math.min(100, s.skills.welding.level + 15);
          s.player.fame = Math.min(100, s.player.fame + 5);
        },
      },
    ],
  },

  // ====== 小镇做题家 ======
  {
    id: "small_town_grinder",
    name: "小镇做题家",
    icon: "📚",
    category: "scenario",
    brief:
      "全村第一个大学生，父亲替你借了¥12000，公示栏上贴着你的毕业证——你不能让他失望",
    description:
      "你是全村第一个考上大学的。毕业那天，村长给你拍了张照，贴到公示栏上。\n\n但你有个秘密：父亲李建国为了凑你四年学费，背着全家借了¥12000的村债，还办了¥8000的助学贷款。他不让你操心，你也没问过。\n\n你有本科文凭，但来这城市三个月，投了几十份简历，只拿到一个数据录入的offer——月薪¥3800，试用期三个月。\n\n助学贷款还款通知刚到：第一笔¥800，三个月后到期，共30期。你打开计算器，算了三遍，结果都一样：还款加房租，工资一分不剩。\n\n父亲今早又发来消息：「村里人都说你有出息，好好干，咱家的债你别操心。」",
    startingMessage:
      "📚 你坐在租来的6平米隔断房里，月租¥1200，手机刚收到助学贷款还款通知——第一笔¥800，三个月后到账。父亲刚发来村里公示栏的照片，上面贴着你的毕业证。",
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
      title: "📱 父亲的那条消息",
      text: "手机震动。父亲发来一张照片——村里公示栏，上面贴着你的毕业证复印件。配文：「村里人都说你有出息。好好干，咱家的债你别操心。」\n\n你盯着那张照片，打开计算器。¥12000村债+¥8000助学贷款，光利息每月¥300。你现在的工资扣掉房租，不够还利息。\n\n你给他回了两个字：「嗯嗯。」",
      effects: { happiness: -8, mental: 3 },
    },
    talents: [
      {
        id: "top_student",
        name: "全县第一",
        icon: "📚",
        rarity: "common",
        desc: "智力比同龄人高出一截，智力+10",
        apply: function (s) {
          s.player.intelligence = Math.min(100, s.player.intelligence + 10);
        },
      },
      {
        id: "competition_award",
        name: "竞赛获奖",
        icon: "🏆",
        rarity: "common",
        desc: "大学竞赛拿过奖，编程+12",
        apply: function (s) {
          if (s.skills.coding)
            s.skills.coding.level = Math.min(100, s.skills.coding.level + 12);
        },
      },
      {
        id: "scholarship_record",
        name: "奖学金记录",
        icon: "🎓",
        rarity: "common",
        desc: "大学拿过奖学金，银行+¥2000，等于还了部分债",
        apply: function (s) {
          s.resources.bankBalance = (s.resources.bankBalance || 0) + 2000;
        },
      },
      {
        id: "note_master",
        name: "笔记达人",
        icon: "📝",
        rarity: "common",
        desc: "学习方法好有条理，能力+8，会计+5",
        apply: function (s) {
          s.player.mental = Math.min(100, s.player.mental + 8);
          if (s.skills.accounting)
            s.skills.accounting.level = Math.min(
              100,
              s.skills.accounting.level + 5,
            );
        },
      },
      {
        id: "genius_boy",
        name: "天才少年",
        icon: "🧠",
        rarity: "uncommon",
        desc: "智力超群，智力+12，编程+8，学什么都快",
        apply: function (s) {
          s.player.intelligence = Math.min(100, s.player.intelligence + 12);
          if (s.skills.coding)
            s.skills.coding.level = Math.min(100, s.skills.coding.level + 8);
        },
      },
      {
        id: "language_gifted",
        name: "语言天赋",
        icon: "🌐",
        rarity: "uncommon",
        desc: "英语成绩拔尖，智力+8，英语+12，职场竞争力强",
        apply: function (s) {
          s.player.intelligence = Math.min(100, s.player.intelligence + 8);
          if (s.skills.english)
            s.skills.english.level = Math.min(100, s.skills.english.level + 12);
        },
      },
      {
        id: "scholar_aura",
        name: "学霸光环",
        icon: "🌟",
        rarity: "rare",
        desc: "全县状元，智力+15，乡债减少¥5000（县里补贴）",
        apply: function (s) {
          s.player.intelligence = Math.min(100, s.player.intelligence + 15);
          s.resources.villageDebt = Math.max(
            0,
            (s.resources.villageDebt || 0) - 5000,
          );
          s.resources.debt = Math.max(0, (s.resources.debt || 0) - 5000);
        },
      },
    ],
  },

  // ====== 外来打工者 ======
  {
    id: "foreign_worker",
    name: "外来打工者",
    icon: "🌏",
    category: "scenario",
    brief:
      "妈妈手术费¥18000、三个月后的手术日期、听不懂的骂声——忍一天比回家值钱",
    description:
      "你叫阮文越，从越南河内的小县城过来。\n\n妈妈检查出病要手术，费用折合人民币约¥18000。老乡说这座城市的工厂工资是老家的四倍——你把家里的钱凑了¥10000，借道中介来了，剩¥500。\n\n现在你住在八人出租屋，工头叫你「那个越南的」，有时候多扣你一天工钱，你不知道该不该反驳，因为汉语说不流利，说了也没人听。\n\n妈妈的手术日期订在三个月后。\n\n你已经给她汇率换算了无数次——这里每工作一天，她的手术费就少欠一点。",
    startingMessage:
      "🌏 飞机降落，老乡来接你，带你挤进住了八个人的出租屋。明天就要上流水线站十二个小时。口袋里¥500，妈妈的手术日期在三个月后，¥18000。",
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
      title: "🌙 异乡的第一夜",
      text: "铁架床吱呀响。你给妈妈发消息，她问：「儿子，那边冷不冷？」\n你打：「不冷，工资很高，你安心等手术，我很快凑到钱。」\n\n你没说的是：¥18000，按现在日薪算，要九十天不吃不喝才够。手术日期是三个月后。\n\n你数了数汇率，关灯，盯着天花板，算了一遍又一遍。",
      effects: { mental: 5, happiness: -8 },
    },
    talents: [
      {
        id: "tough_body",
        name: "苦出身",
        icon: "💪",
        rarity: "common",
        desc: "从小吃苦练就的体魄，体质+12",
        apply: function (s) {
          s.player.physique = Math.min(100, s.player.physique + 12);
        },
      },
      {
        id: "social_butterfly",
        name: "自来熟",
        icon: "🤝",
        rarity: "common",
        desc: "天生会和人打交道，魅力+10，心情+5",
        apply: function (s) {
          s.player.charm = Math.min(100, s.player.charm + 10);
          s.needs.happiness = Math.min(100, s.needs.happiness + 5);
        },
      },
      {
        id: "packed_extra",
        name: "多带了点",
        icon: "📦",
        rarity: "common",
        desc: "行李比别人装得多，背包容量+10",
        apply: function (s) {
          s.inventory.capacity = (s.inventory.capacity || 20) + 10;
        },
      },
      {
        id: "iron_will",
        name: "拼命三郎",
        icon: "🔥",
        rarity: "common",
        desc: "为了妈妈手术费什么苦都能吃，能力+10，敏捷+3",
        apply: function (s) {
          s.player.mental = Math.min(100, s.player.mental + 10);
          s.player.agility = Math.min(100, s.player.agility + 3);
        },
      },
      {
        id: "iron_physique",
        name: "铁打的身体",
        icon: "⚒️",
        rarity: "uncommon",
        desc: "从小劳作锻出来的，体质+10，健康+8，不容易病",
        apply: function (s) {
          s.player.physique = Math.min(100, s.player.physique + 10);
          s.status.health = Math.min(100, s.status.health + 8);
        },
      },
      {
        id: "pioneer_drive",
        name: "异乡闯劲",
        icon: "🌊",
        rarity: "uncommon",
        desc: "越在外越拼命，能力+12，魅力+5",
        apply: function (s) {
          s.player.mental = Math.min(100, s.player.mental + 12);
          s.player.charm = Math.min(100, s.player.charm + 5);
        },
      },
      {
        id: "family_mission",
        name: "家族使命",
        icon: "🏡",
        rarity: "rare",
        desc: "一家人指望你，体质+8，能力+8，额外启动金¥500",
        apply: function (s) {
          s.player.physique = Math.min(100, s.player.physique + 8);
          s.player.mental = Math.min(100, s.player.mental + 8);
          s.resources.cash = (s.resources.cash || 0) + 500; // [全系统自洽修复] 域G A类: cash NaN防御
        },
      },
    ],
  },

  // ====== 二代创业者 ======
  {
    id: "second_gen",
    name: "二代创业者",
    icon: "💎",
    category: "scenario",
    brief:
      "父亲给了¥150000，但他用的字是「败」不是「搏」——你必须证明这笔钱不是补偿",
    description:
      "父亲王立强白手起家，把一个五金厂做到年营收三千万。他今年五十八岁，从不问你喜不喜欢这件事，只说「你来接班」。\n\n你不想接班。你想自己做一件事，证明你不靠他。\n\n于是他给了你¥150000，说：「你去折腾吧，这钱够你败两年。」\n\n他说的是「败」，不是「搏」。\n\n你揣着这笔钱来到城市，租了个写字楼的工位，旁边的人都在谈融资、谈合伙人、谈市场规模。你什么都听不懂，但你知道——你绝对不能两年后灰溜溜地把钱原封不动送回去。",
    startingMessage:
      "💎 父亲把银行卡推过来，说：「你去折腾吧，够你败两年。」你注意到他说的是「败」，不是「搏」。你没有反驳，把卡装进口袋——现在账户里六位数，商业计划书是空白的。",
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
      title: "💰 父亲说的那个字",
      text: "你坐在共享工位上，手机银行显示¥150000。隔壁桌的人在谈融资轮次，你一个词都没听懂。\n\n你打开新文档，标题敲了三个字：商业计划——然后盯着光标闪了十分钟。\n\n你想起父亲那句话：「够你败两年。」\n\n他连「搏」都懒得说。",
      effects: { mental: -5, happiness: -5, fame: 8 },
    },
    talents: [
      {
        id: "elite_education",
        name: "名校光环",
        icon: "🎓",
        rarity: "common",
        desc: "一线名校出来的，智力+8，名声+8",
        apply: function (s) {
          s.player.intelligence = Math.min(100, s.player.intelligence + 8);
          s.player.fame = Math.min(100, s.player.fame + 8);
        },
      },
      {
        id: "secret_funds",
        name: "私藏零花",
        icon: "💰",
        rarity: "common",
        desc: "父亲给的是明账，还有自己藏着的¥8000",
        apply: function (s) {
          s.resources.cash = (s.resources.cash || 0) + 8000; // [全系统自洽修复] 域G A类: cash NaN防御
        },
      },
      {
        id: "drivers_network",
        name: "好车好人脉",
        icon: "🚗",
        rarity: "common",
        desc: "常年社交圈子好，驾驶+12，名声+5",
        apply: function (s) {
          if (s.skills.driving)
            s.skills.driving.level = Math.min(100, s.skills.driving.level + 12);
          s.player.fame = Math.min(100, s.player.fame + 5);
        },
      },
      {
        id: "business_sense",
        name: "商业眼光",
        icon: "👔",
        rarity: "common",
        desc: "从小耳濡目染，管理+12",
        apply: function (s) {
          if (s.skills.management)
            s.skills.management.level = Math.min(
              100,
              s.skills.management.level + 12,
            );
        },
      },
      {
        id: "network_capital",
        name: "人脉资本",
        icon: "🌐",
        rarity: "uncommon",
        desc: "朋友圈都是有资源的人，名声+15，魅力+8",
        apply: function (s) {
          s.player.fame = Math.min(100, s.player.fame + 15);
          s.player.charm = Math.min(100, s.player.charm + 8);
        },
      },
      {
        id: "fathers_wisdom",
        name: "父亲的智慧",
        icon: "📊",
        rarity: "uncommon",
        desc: "耳濡目染经商之道，管理+10，销售+8",
        apply: function (s) {
          if (s.skills.management)
            s.skills.management.level = Math.min(
              100,
              s.skills.management.level + 10,
            );
          if (s.skills.sales)
            s.skills.sales.level = Math.min(100, s.skills.sales.level + 8);
        },
      },
      {
        id: "hidden_fortune",
        name: "财富子弹",
        icon: "💎",
        rarity: "rare",
        desc: "父亲悄悄给的备用金，现金再+¥20000",
        apply: function (s) {
          s.resources.cash = (s.resources.cash || 0) + 20000; // [全系统自洽修复] 域G A类: cash NaN防御
        },
      },
    ],
  },

  // ====== 中年危机职场人 ======
  {
    id: "midlife_crisis",
    name: "中年危机职场人",
    icon: "👔",
    category: "scenario",
    brief:
      "P7被裁，房贷¥14500/月还剩19年，老婆发来一个月薪¥12000的职位链接——你沉默了",
    description:
      "三十五岁，P7，你以为自己至少还能再干五年。直到HR把你叫进会议室，说公司「优化调整」，你在名单上。\n\n老婆没哭，当天晚上搜了一夜招聘，早上把一个月薪¥12000的销售职位链接发给你，说：「你看看这个。」\n\n你的月供是¥14500，还有19年。孩子下学期学费¥9000，三个月后到账。你现在流动资金¥95000，理论上够撑六个月。\n\n问题不是钱——问题是你不知道，这辈子接下来到底要怎么活。\n\n降薪去小公司，还是拿赔偿金搏一把创业？",
    startingMessage:
      "👔 你抱着纸箱走出写字楼，手机弹出房贷扣款提醒：¥14500，明天到账。老婆发来一个职位链接——月薪¥12000。你在电梯里站了很久，没有按楼层。",
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
      title: "📦 纸箱和那条消息",
      text: "你抱着纸箱走出写字楼。电梯里有个实习生，礼貌地往旁边挪了一步。\n\n手机震：「招商银行：您本月房贷将于明日扣款¥14500，请确保余额充足。」\n\n卡里现在¥15300，扣完¥800。\n\n老婆又发来消息：「到楼下了吗？我接你。」\n\n你没动，盯着那条扣款提醒，想到今天面了三个猎头——工资都比现在低40%。\n\n不知道该不该告诉她。",
      effects: { mental: -8, happiness: -10 },
    },
    talents: [
      {
        id: "code_veteran",
        name: "代码老兵",
        icon: "💾",
        rarity: "common",
        desc: "十几年代码写下来，编程+12",
        apply: function (s) {
          if (s.skills.coding)
            s.skills.coding.level = Math.min(100, s.skills.coding.level + 12);
        },
      },
      {
        id: "office_fox",
        name: "职场老狐狸",
        icon: "🦊",
        rarity: "common",
        desc: "摸清了所有套路，管理+10，销售+5",
        apply: function (s) {
          if (s.skills.management)
            s.skills.management.level = Math.min(
              100,
              s.skills.management.level + 10,
            );
          if (s.skills.sales)
            s.skills.sales.level = Math.min(100, s.skills.sales.level + 5);
        },
      },
      {
        id: "emergency_fund",
        name: "私房钱",
        icon: "💰",
        rarity: "common",
        desc: "多年工作攒下的私人小金库，现金+¥8000",
        apply: function (s) {
          s.resources.cash = (s.resources.cash || 0) + 8000; // [全系统自洽修复] 域G A类: cash NaN防御
        },
      },
      {
        id: "weathered_wisdom",
        name: "见过大风浪",
        icon: "🧘",
        rarity: "common",
        desc: "职场沉浮过来的，能力+12，心情+10",
        apply: function (s) {
          s.player.mental = Math.min(100, s.player.mental + 12);
          s.needs.happiness = Math.min(100, s.needs.happiness + 10);
        },
      },
      {
        id: "decade_stack",
        name: "十年积累",
        icon: "📈",
        rarity: "uncommon",
        desc: "双修积累，编程+10，管理+8",
        apply: function (s) {
          if (s.skills.coding)
            s.skills.coding.level = Math.min(100, s.skills.coding.level + 10);
          if (s.skills.management)
            s.skills.management.level = Math.min(
              100,
              s.skills.management.level + 8,
            );
        },
      },
      {
        id: "midlife_defiance",
        name: "中年破釜",
        icon: "💥",
        rarity: "uncommon",
        desc: "越逼越猛，能力+15，道德感+5",
        apply: function (s) {
          s.player.mental = Math.min(100, s.player.mental + 15);
          s.player.morality = Math.min(100, s.player.morality + 5);
        },
      },
      {
        id: "industry_icon",
        name: "行业人脉王",
        icon: "👑",
        rarity: "rare",
        desc: "干了十几年攒的关系网，名声+20，管理+12",
        apply: function (s) {
          s.player.fame = Math.min(100, s.player.fame + 20);
          if (s.skills.management)
            s.skills.management.level = Math.min(
              100,
              s.skills.management.level + 12,
            );
        },
      },
    ],
  },

  // ====== 应届毕业生（扩展剧本） ======
  {
    id: "fresh_grad",
    name: "应届毕业生",
    icon: "🎓",
    category: "scenario",
    brief:
      "第一次打开租房App，发现月薪的60%要交房租——「独立」这两个字比你想象的要贵得多",
    description:
      "毕业那天，你以为最难的已经过去了。\n\n结果发现找工作才是开始：投了几十份简历，最终只拿到一个offer——月薪¥4200，试用期三个月，五险一金不全。\n\n父母在小城市，合计月收入¥5000，替你借了¥8000的人情债，说不催，但你知道。助学贷款¥15000，从明年1月起每月还¥680，共30期。\n\n租的地方月租¥1100，离公司要坐一小时地铁，6平米，上床下桌，洗澡要去公共浴室¥3一次。\n\n你在纸上算了一遍收支，算到第三行就停了。\n\n但你说过：你不要再伸手要了。",
    startingMessage:
      "🎓 你提着行李箱到达出租屋，打开备忘录，新建「每月收支」。月薪4200，到手约3600，扣掉房租1100、通勤300……算到第三行停了。还没算父母那¥8000，助学贷款还没开始还。",
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
    startEvent: {
      title: "🗒️ 第一个月第一天的账",
      text: "你在备忘录里新建文档：「每月收支」。\n月薪4200，扣五险到手约3600。\n房租1100，通勤约300，吃饭500……\n\n你算到第三行，停下来了。\n\n剩¥1700，但父母那¥8000还没算，助学贷款每月¥680还没开始还。\n\n你关掉备忘录，打开外卖App，看了看最便宜的¥9.9，关掉了——去便利店买了包榨菜。",
      effects: { mental: 3, happiness: -10 },
    },
    talents: [
      {
        id: "academic_excellence",
        name: "学霸",
        icon: "📚",
        rarity: "common",
        desc: "大学GPA拔尖，智力+10",
        apply: function (s) {
          s.player.intelligence = Math.min(100, s.player.intelligence + 10);
        },
      },
      {
        id: "social_butterfly_grad",
        name: "社牛",
        icon: "🎤",
        rarity: "common",
        desc: "大学人缘超好，魅力+10，心情+5",
        apply: function (s) {
          s.player.charm = Math.min(100, s.player.charm + 10);
          s.needs.happiness = Math.min(100, s.needs.happiness + 5);
        },
      },
      {
        id: "internet_native",
        name: "互联网原住民",
        icon: "💻",
        rarity: "common",
        desc: "从小玩电脑，编程+10",
        apply: function (s) {
          if (s.skills.coding)
            s.skills.coding.level = Math.min(100, s.skills.coding.level + 10);
        },
      },
      {
        id: "fearless_rookie",
        name: "初生牛犊",
        icon: "🔥",
        rarity: "common",
        desc: "什么都不怕，能力+10，敏捷+5",
        apply: function (s) {
          s.player.mental = Math.min(100, s.player.mental + 10);
          s.player.agility = Math.min(100, s.player.agility + 5);
        },
      },
      {
        id: "well_rounded",
        name: "全面发展",
        icon: "🌈",
        rarity: "uncommon",
        desc: "德智体全面，智力+7，魅力+7，敏捷+7",
        apply: function (s) {
          s.player.intelligence = Math.min(100, s.player.intelligence + 7);
          s.player.charm = Math.min(100, s.player.charm + 7);
          s.player.agility = Math.min(100, s.player.agility + 7);
        },
      },
      {
        id: "tech_specialist",
        name: "专业热门",
        icon: "🔬",
        rarity: "uncommon",
        desc: "所学专业就业好，编程+12，英语+8",
        apply: function (s) {
          if (s.skills.coding)
            s.skills.coding.level = Math.min(100, s.skills.coding.level + 12);
          if (s.skills.english)
            s.skills.english.level = Math.min(100, s.skills.english.level + 8);
        },
      },
      {
        id: "mentor_letter",
        name: "导师推荐信",
        icon: "📜",
        rarity: "rare",
        desc: "教授亲写推荐信，名声+15，编程+8，起步比别人高",
        apply: function (s) {
          s.player.fame = Math.min(100, s.player.fame + 15);
          if (s.skills.coding)
            s.skills.coding.level = Math.min(100, s.skills.coding.level + 8);
        },
      },
    ],
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
  villageDebt: 0,
  bankDebt: 0,
  physique: 22,
  intelligence: 22,
  agility: 22,
  mental: 22,
  health: 90,
  education: 0,
  housingTier: 0,
  fame: 0,
  hasLicense: false, // 开局是否有驾照
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

// P1-2 CLS 命名空间注册
if (typeof window.CLS !== 'undefined' && window.CLS.data) window.CLS.data.SCENARIOS = SCENARIOS;

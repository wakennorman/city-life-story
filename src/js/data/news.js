/**
 * 随机新闻事件 — 影响价格、工作收入、玩家状态、投资市场
 *
 * investmentEffect: 数组，每项 { industry, category, symbols, btc, allStocks, mul }
 *   industry  - 匹配 INV_STOCKS.industry（科技/新能源/消费/金融/房地产/医药）
 *   category  - 匹配 INV_STOCKS.category（股票/贵金属/期货/虚拟币）
 *   symbols   - 具体标的数组
 *   btc: true - 专门影响 btcPrice + btcFearGreed
 *   allStocks - 影响所有 INV_STOCKS 条目
 *   mul       - 价格乘数（>1 涨价，<1 跌价）
 */

const NEWS_EVENTS = [
  // === 价格影响事件 ===
  {
    id: "metal_boom",
    headline: "📈 国际金属价格暴涨！废品回收利润翻倍！",
    effects: {
      priceMod: { scrap_metal: 2.0, scrap_plastic: 1.5 },
      investmentEffect: [
        { category: "贵金属", mul: 1.2 },
        { symbols: ["COPPER", "NICKEL", "ALUM"], mul: 1.18 },
      ],
      duration: 5,
    },
    type: "price",
    followUpId: "metal_boom_echo",
    followUpDelay: 4,
  },
  {
    id: "heatwave",
    headline: "☀️ 高温来袭！瓶装水和饮料需求暴增",
    effects: {
      priceMod: { water: 1.8, beer: 1.5, snacks: 1.3 },
      investmentEffect: [
        { symbols: ["CL"], mul: 1.08 },
        { industry: "消费", mul: 1.05 },
      ],
      duration: 3,
    },
    type: "price",
  },
  {
    id: "crackdown",
    headline: "🚔 城管严查摆摊！商业区摆摊收入减半",
    effects: {
      jobPenalty: ["street_vending_food", "street_vending_goods", "food_stall"],
      jobMultiplier: 0.5,
      investmentEffect: [{ industry: "消费", mul: 0.9 }],
      duration: 4,
    },
    type: "job",
  },
  {
    id: "factory_boom",
    headline: "🏭 电子厂订单暴增！工厂加班工资翻倍",
    effects: {
      jobBonus: ["factory_work_assembly", "factory_overtime"],
      jobMultiplier: 1.6,
      investmentEffect: [
        { industry: "新能源", mul: 1.12 },
        { symbols: ["HUAW", "SMIC"], mul: 1.1 },
      ],
      duration: 5,
    },
    type: "job",
  },
  {
    id: "fruit_glut",
    headline: "🍎 水果大丰收！批发市场价格暴跌",
    effects: { priceMod: { fruits: 0.4, vegetables: 0.5 }, duration: 4 },
    type: "price",
  },
  {
    id: "construction_boom",
    headline: "🏗️ 新楼盘开工！工地大量招人，工资上涨",
    effects: {
      jobBonus: ["manual_labor_construction", "skilled_labor_construction"],
      jobMultiplier: 1.5,
      investmentEffect: [
        { symbols: ["ESTATE"], mul: 1.18 },
        { category: "贵金属", mul: 1.05 },
      ],
      duration: 6,
    },
    type: "job",
  },
  {
    id: "cigarette_ban",
    headline: "🚭 公共场所禁烟令升级！香烟滞销",
    effects: {
      priceMod: { cigarettes: 0.3, beer: 0.7 },
      investmentEffect: [
        { industry: "消费", mul: 0.92 },
        { industry: "医药", mul: 1.06 },
      ],
      duration: 5,
    },
    type: "price",
  },
  {
    id: "back_to_school",
    headline: "🎒 开学季！大学城快递和家教需求暴涨",
    effects: {
      jobBonus: ["package_delivery", "tutoring"],
      jobMultiplier: 1.8,
      investmentEffect: [
        { industry: "科技", mul: 1.08 },
        { industry: "消费", mul: 1.05 },
      ],
      duration: 7,
    },
    type: "job",
  },
  {
    id: "cold_wave",
    headline: "🥶 寒潮来袭！二手衣物和日用品涨价",
    effects: {
      priceMod: { clothing: 2.5, daily_use: 1.8 },
      investmentEffect: [
        { symbols: ["NG", "CL"], mul: 1.15 },
        { category: "贵金属", mul: 1.05 },
      ],
      duration: 4,
    },
    type: "price",
  },
  {
    id: "tech_fair",
    headline: "📱 科技展会举办！小电子产品价格飙升",
    effects: {
      priceMod: { electronics: 2.5 },
      investmentEffect: [
        { industry: "科技", mul: 1.22 },
        { symbols: ["NVDA", "HUAW", "SMIC"], mul: 1.3 },
      ],
      duration: 3,
    },
    type: "price",
    followUpId: "tech_fair_echo",
    followUpDelay: 3,
  },
  {
    id: "min_wage",
    headline: "📋 最低工资标准上调！所有工作收入+20%",
    effects: {
      allJobsBonus: 1.2,
      investmentEffect: [
        { industry: "消费", mul: 1.06 },
        { industry: "金融", mul: 0.96 },
      ],
      duration: 10,
    },
    type: "policy",
  },
  {
    id: "platform_subsidy_war",
    headline: "🛵 外卖平台补贴大战！骑手单价临时上调，商圈外卖订单爆炸",
    effects: {
      priceMod: { water: 1.12, snacks: 1.18, noodles: 1.12 },
      jobBonus: ["delivery_rider"],
      jobMultiplier: 1.45,
      investmentEffect: [
        { symbols: ["MEIT", "DIDI"], mul: 1.18 },
        { industry: "消费", mul: 1.06 },
      ],
      duration: 5,
    },
    type: "job",
    followUpId: "rider_winter",
    followUpDelay: 7,
  },
  {
    id: "urban_renewal_pilot",
    headline: "🏚️ 城中村旧改试点启动！装修、清运、工地短工需求明显增加",
    effects: {
      priceMod: { daily_use: 1.25, scrap_metal: 1.25, scrap_paper: 1.1 },
      jobBonus: [
        "manual_labor_construction",
        "skilled_labor_construction",
        "cleaning_service",
        "repair_service",
      ],
      jobMultiplier: 1.25,
      investmentEffect: [
        { symbols: ["ESTATE"], mul: 1.12 },
        { category: "贵金属", mul: 1.04 },
      ],
      duration: 8,
    },
    type: "policy",
  },
  {
    id: "flu_surge",
    headline: "🤒 流感高峰提前到来！医院陪诊护工紧缺，口罩和日用品走俏",
    effects: {
      priceMod: { daily_use: 1.3, water: 1.1, noodles: 1.08 },
      jobBonus: ["hospital_caregiver"],
      jobMultiplier: 1.6,
      investmentEffect: [
        { industry: "医药", mul: 1.14 },
        { industry: "消费", mul: 1.03 },
      ],
      duration: 6,
    },
    type: "job",
  },

  // === 玩家个人事件（互动版）===
  {
    id: "found_money",
    headline: "🍀 在路边捡到了一个钱包",
    story:
      "路边有个黑色钱包，打开一看里面有¥50现金和一张身份证。失主看起来住在附近。",
    choices: [
      {
        text: "💰 据为己有",
        hint: "拿钱走人",
        apply: (st) => {
          st.resources.cash += 50;
          st.needs.happiness = Math.max(0, st.needs.happiness - 3);
          st.flags._keptWallet = true;
          StateManager.addMessage(
            "💰 钱包里翻出了¥50，但心里有点虚...",
            "warning",
          );
        },
      },
      {
        text: "🏛️ 交给派出所",
        hint: "良心选择",
        apply: (st) => {
          st.needs.happiness = Math.min(100, st.needs.happiness + 5);
          st.player.fame = Math.min(100, st.player.fame + 2);
          st.flags._returnedWallet = true;
          StateManager.addMessage(
            "🏛️ 钱包交给了警察，警察夸你拾金不昧！",
            "success",
          );
        },
      },
      {
        text: "🚶 当作没看见",
        hint: "怕惹麻烦",
        apply: (st) => {
          StateManager.addMessage("🚶 你假装没看见走了过去。", "info");
        },
      },
    ],
    type: "personal",
  },
  {
    id: "pickpocket",
    headline: "👛 在公交车上被偷了",
    story:
      "挤公交车时感觉有人在摸你的口袋。下车一摸，钱包不见了！里面大概有¥100。",
    choices: [
      {
        text: "🚔 报警",
        hint: "走正规渠道",
        apply: (st) => {
          st.resources.cash = Math.max(0, st.resources.cash - 100);
          st.player.fame = Math.min(100, st.player.fame + 1);
          st.needs.happiness = Math.max(0, st.needs.happiness - 5);
          StateManager.addMessage(
            "🚔 报了警，但警察说这种小案子很难查。钱追不回来了。",
            "info",
          );
        },
      },
      {
        text: "😤 自认倒霉",
        hint: "长个教训",
        apply: (st) => {
          st.resources.cash = Math.max(0, st.resources.cash - 100);
          st.needs.happiness = Math.max(0, st.needs.happiness - 8);
          st.player.mental = Math.min(100, st.player.mental + 2);
          StateManager.addMessage(
            "😤 自认倒霉吧。下次坐公交要注意保管财物。",
            "warning",
          );
        },
      },
    ],
    type: "personal",
  },
  {
    id: "free_meal",
    headline: "🍱 社区免费午餐活动",
    story:
      "社区在广场办免费午餐活动，志愿者说今天有米饭和菜，免费吃。但你得排队半小时。",
    choices: [
      {
        text: "🍚 去排队吃",
        hint: "省饭钱但花时间",
        apply: (st) => {
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 8);
          st.needs.hunger = Math.min(100, st.needs.hunger + 30);
          st.needs.happiness = Math.min(100, st.needs.happiness + 2);
          StateManager.addMessage(
            "🍚 排了半小时队吃了顿饱饭。虽然简单，但省了钱。",
            "info",
          );
        },
      },
      {
        text: "🚶 没空，继续忙",
        hint: "省时间",
        apply: (st) => {
          StateManager.addMessage("🚶 你摇摇头继续忙自己的事了。", "info");
        },
      },
    ],
    type: "personal",
  },
  {
    id: "rain_storm",
    headline: "🌧️ 暴雨来袭",
    story: "天气预报说今天有暴雨。你本来计划去户外工作，但现在得重新考虑了。",
    choices: [
      {
        text: "🏠 在家休息",
        hint: "恢复疲劳",
        apply: (st) => {
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 10);
          st.needs.happiness = Math.min(100, st.needs.happiness + 3);
          StateManager.addMessage(
            "🏠 暴雨天在家休息，疲劳-10。雨天适合躺平。",
            "info",
          );
        },
      },
      {
        text: "🌂 冒雨出门工作",
        hint: "赚更多但健康风险",
        apply: (st) => {
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
          st.status.health = Math.max(0, st.status.health - 5);
          st.needs.happiness = Math.max(0, st.needs.happiness - 5);
          StateManager.addMessage(
            "🌂 冒雨出门了。虽然赚了钱，但淋得够呛，健康-5。",
            "warning",
          );
        },
      },
    ],
    type: "personal",
  },
  {
    id: "good_sleep",
    headline: "😴 昨晚睡得特别好",
    story: "昨晚睡得特别香，今天醒来精神焕发。你决定好好利用这一天。",
    choices: [
      {
        text: "💪 趁状态好去工作",
        hint: "效率加倍",
        apply: (st) => {
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
          st.needs.happiness = Math.min(100, st.needs.happiness + 5);
          // 标记今日效率加成
          st.flags._goodSleepToday = true;
          StateManager.addMessage(
            "💪 趁着精神好去工作，今天效率不错！",
            "success",
          );
        },
      },
      {
        text: "😴 再睡个回笼觉",
        hint: "进一步恢复",
        apply: (st) => {
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 10);
          st.needs.happiness = Math.min(100, st.needs.happiness + 2);
          StateManager.addMessage("😴 又睡了个回笼觉，疲劳再-10。", "info");
        },
      },
    ],
    type: "personal",
  },
  {
    id: "friendly_neighbor",
    headline: "👋 邻居送了些水果",
    story:
      "楼上的王大婶给你送了些自家种的水果，说是一点心意。你最近和她关系还不错。",
    choices: [
      {
        text: "🙏 收下并道谢",
        hint: "提升好感",
        apply: (st) => {
          st.needs.hunger = Math.min(100, st.needs.hunger + 10);
          st.needs.happiness = Math.min(100, st.needs.happiness + 8);
          if (st.relationships && st.relationships.auntWang) {
            st.relationships.auntWang.affinity = Math.min(
              100,
              (st.relationships.auntWang.affinity || 0) + 3,
            );
          }
          StateManager.addMessage(
            "🙏 收下了水果，王大婶很开心。好感+3，饥饱+10。",
            "success",
          );
        },
      },
      {
        text: "💝 回送点小礼物",
        hint: "花¥20维护关系",
        cost: 20,
        apply: (st) => {
          if (st.resources.cash < 20) {
            StateManager.addMessage("💝 钱不够买礼物！", "warning");
            return;
          }
          st.resources.cash -= 20;
          st.needs.happiness = Math.min(100, st.needs.happiness + 5);
          if (st.relationships && st.relationships.auntWang) {
            st.relationships.auntWang.affinity = Math.min(
              100,
              (st.relationships.auntWang.affinity || 0) + 5,
            );
          }
          StateManager.addMessage(
            "💝 回送了小礼物，王大婶更高兴了。好感+5。",
            "success",
          );
        },
      },
      {
        text: "🚶 礼貌拒绝",
        hint: "不想欠人情",
        apply: (st) => {
          st.needs.happiness = Math.max(0, st.needs.happiness - 2);
          if (st.relationships && st.relationships.auntWang) {
            st.relationships.auntWang.affinity = Math.max(
              0,
              (st.relationships.auntWang.affinity || 0) - 3,
            );
          }
          StateManager.addMessage(
            "🚶 礼貌拒绝了。王大婶有点失望地走了。",
            "info",
          );
        },
      },
    ],
    type: "personal",
  },
  {
    id: "skill_book",
    headline: "📖 二手书店淘到教材",
    story:
      "在城中村二手书店，老板说有一本技能教材便宜卖。你看了看，内容还挺有用。",
    choices: [
      {
        text: "📚 买下 (¥30)",
        hint: "花小钱学技能",
        cost: 30,
        apply: (st) => {
          if (st.resources.cash < 30) {
            StateManager.addMessage("📚 钱不够买！", "warning");
            return;
          }
          st.resources.cash -= 30;
          var skills = Object.keys(st.skills || {});
          if (skills.length > 0) {
            var key = Random.fromArray(skills);
            st.skills[key] = st.skills[key] || { level: 1, xp: 0 };
            st.skills[key].xp += 30;
            StateManager.addMessage(
              "📚 买到了教材，翻了几页，" + key + "技能经验+30。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "📚 买到了教材，但还没有技能可学。先收着吧。",
              "info",
            );
          }
        },
      },
      {
        text: "👀 先看看再说",
        hint: "不花钱",
        apply: (st) => {
          st.needs.intelligence = Math.min(
            100,
            (st.needs.intelligence || 0) + 2,
          );
          StateManager.addMessage("👀 翻了翻书，觉得还行，但先不买。", "info");
        },
      },
    ],
    type: "personal",
  },

  // === 政策事件 ===
  {
    id: "subsidy",
    headline: "🏛️ 政府推出职业技能培训补贴！培训费用减半",
    effects: { trainingDiscount: 0.5, duration: 8 },
    type: "policy",
  },

  // === 投资专项事件（10+）— 直接影响投资市场 ===
  {
    id: "rate_cut",
    headline: "📉 央行宣布降息25个基点！流动性宽松，资本市场全线上涨",
    effects: {
      investmentEffect: [
        { allStocks: true, mul: 1.08 },
        { btc: true, mul: 1.12 },
        { category: "贵金属", mul: 1.04 },
      ],
      duration: 7,
    },
    type: "investment",
    followUpId: "rate_cut_echo",
    followUpDelay: 3,
  },
  {
    id: "rate_hike",
    headline: "📈 美联储意外加息50基点！加密市场重挫，科技股承压",
    effects: {
      investmentEffect: [
        { allStocks: true, mul: 0.94 },
        { btc: true, mul: 0.78 },
        { industry: "科技", mul: 0.89 },
      ],
      duration: 6,
    },
    type: "investment",
    followUpId: "rate_hike_echo",
    followUpDelay: 2,
  },
  {
    id: "property_cooling",
    headline: "🏛️ 政府出台楼市调控新政！限购限贷升级，房价预期大跌",
    effects: {
      investmentEffect: [
        { symbols: ["ESTATE"], mul: 0.8 },
        { industry: "金融", mul: 0.95 },
        { category: "贵金属", mul: 1.05 },
      ],
      duration: 8,
    },
    type: "investment",
  },
  {
    id: "property_stimulus",
    headline: "🏠 政府发布楼市刺激政策！降首付、降利率，成交量暴增",
    effects: {
      investmentEffect: [
        { symbols: ["ESTATE"], mul: 1.25 },
        { industry: "金融", mul: 1.08 },
        { category: "贵金属", mul: 0.97 },
      ],
      duration: 7,
    },
    type: "investment",
  },
  {
    id: "geopolitical_crisis",
    headline: "⚔️ 中东局势骤然升温！原油期货暴涨，避险资产成香饽饽",
    effects: {
      investmentEffect: [
        { symbols: ["CL", "NG"], mul: 1.22 },
        { category: "贵金属", mul: 1.15 },
        { industry: "科技", mul: 0.94 },
        { btc: true, mul: 0.92 },
      ],
      duration: 5,
    },
    type: "investment",
    followUpId: "geo_crisis_echo",
    followUpDelay: 3,
  },
  {
    id: "trade_war_chip",
    headline: "🛡️ 中美芯片战升级！出口管制扩大，供应链承压",
    effects: {
      investmentEffect: [
        { symbols: ["SMIC", "HUAW", "NVDA", "TSMC"], mul: 0.85 },
        { category: "贵金属", mul: 1.08 },
        { symbols: ["LITH", "COPPER"], mul: 1.12 },
      ],
      duration: 6,
    },
    type: "investment",
    followUpId: "chip_domestic_rise",
    followUpDelay: 5,
  },
  {
    id: "ai_boom",
    headline: "🤖 国产AI大模型突破！发布会震惊硅谷，科技股全线飙升",
    effects: {
      investmentEffect: [
        { industry: "科技", mul: 1.2 },
        { symbols: ["NVDA", "BYTE", "BAID", "HUAW"], mul: 1.32 },
        { symbols: ["LITH", "COPPER"], mul: 1.1 },
      ],
      duration: 5,
    },
    type: "investment",
    followUpId: "ai_boom_echo",
    followUpDelay: 5,
  },
  {
    id: "crypto_bull",
    headline: "🚀 比特币突破历史新高！加密市场牛市来了",
    effects: {
      investmentEffect: [
        { btc: true, mul: 1.28 },
        { category: "虚拟币", mul: 1.18 },
      ],
      duration: 4,
    },
    type: "investment",
    followUpId: "crypto_bull_echo",
    followUpDelay: 4,
  },
  {
    id: "crypto_crash",
    headline: "💥 加密市场黑色星期一！比特币单日暴跌30%",
    effects: {
      investmentEffect: [
        { btc: true, mul: 0.7 },
        { category: "虚拟币", mul: 0.75 },
        { category: "贵金属", mul: 1.08 },
      ],
      duration: 3,
    },
    type: "investment",
    followUpId: "crypto_crash_echo",
    followUpDelay: 3,
  },
  {
    id: "energy_crisis",
    headline: "⚡ 全球能源危机！天然气断供引发连锁反应，新能源提速",
    effects: {
      investmentEffect: [
        { symbols: ["CL", "NG"], mul: 1.25 },
        { industry: "新能源", mul: 1.18 },
        { symbols: ["LITH", "NICKEL"], mul: 1.15 },
        { industry: "消费", mul: 0.94 },
      ],
      duration: 6,
    },
    type: "investment",
    followUpId: "energy_crisis_echo",
    followUpDelay: 4,
  },
  {
    id: "black_swan",
    headline: "🦢 黑天鹅事件！未知危机引发全球市场恐慌性抛售",
    effects: {
      investmentEffect: [
        { allStocks: true, mul: 0.87 },
        { btc: true, mul: 0.72 },
        { category: "贵金属", mul: 1.2 },
      ],
      duration: 4,
    },
    type: "investment",
    followUpId: "black_swan_echo",
    followUpDelay: 2,
  },
  {
    id: "ev_subsidy",
    headline: "🚗 国家加大新能源车补贴力度！比亚迪、蔚来订单暴增",
    effects: {
      investmentEffect: [
        { industry: "新能源", mul: 1.22 },
        { symbols: ["LITH", "NICKEL", "COPPER"], mul: 1.15 },
      ],
      duration: 5,
    },
    type: "investment",
  },
  {
    id: "antitrust_investigation",
    headline: "⚖️ 反垄断调查突袭！多家科技巨头收到传票",
    effects: {
      investmentEffect: [
        { symbols: ["ALIM", "TENC", "MEIT", "DIDI"], mul: 0.83 },
        { industry: "金融", mul: 0.96 },
      ],
      duration: 5,
    },
    type: "investment",
  },
];

/** 级联后续新闻（L2层：由L1大事件自动触发，N天后出现） */
var NEWS_FOLLOWUP = {
  metal_boom_echo: {
    headline: "🔩 大宗商品续涨！贵金属期货多头逼空，钢铁期货涨停",
    effects: {
      investmentEffect: [
        { category: "贵金属", mul: 1.06 },
        { symbols: ["COPPER", "NICKEL"], mul: 1.08 },
      ],
      duration: 3,
    },
  },
  tech_fair_echo: {
    headline: "📉 科技展热度消退，科技股获利回吐，散户警惕追高",
    effects: {
      investmentEffect: [
        { industry: "科技", mul: 0.95 },
        { symbols: ["NVDA", "HUAW"], mul: 0.93 },
      ],
      duration: 2,
    },
  },
  rate_cut_echo: {
    headline: "📊 降息效应持续扩散！资金流入股市，债市收益率创新低",
    effects: {
      investmentEffect: [
        { allStocks: true, mul: 1.04 },
        { category: "贵金属", mul: 1.02 },
      ],
      duration: 4,
    },
  },
  rate_hike_echo: {
    headline: "🏠 加息压力传导房贷！多地楼盘降价换量，刚需族机会窗口开启",
    effects: {
      investmentEffect: [
        { symbols: ["ESTATE"], mul: 0.92 },
        { industry: "金融", mul: 0.97 },
      ],
      duration: 3,
    },
  },
  geo_crisis_echo: {
    headline: "🥇 地缘风险未解！避险资金持续涌入黄金，金价续创年内新高",
    effects: {
      investmentEffect: [
        { category: "贵金属", mul: 1.08 },
        { symbols: ["CL"], mul: 1.05 },
      ],
      duration: 3,
    },
  },
  ai_boom_echo: {
    headline: "💻 AI热潮带动算力军备竞赛！显卡供不应求，云服务器订单爆满",
    effects: {
      investmentEffect: [
        { symbols: ["NVDA", "SMIC"], mul: 1.14 },
        { industry: "科技", mul: 1.07 },
      ],
      duration: 3,
    },
  },
  crypto_bull_echo: {
    headline: "🌊 加密牛市第二波！散户蜂拥入场，链上手续费创新高",
    effects: {
      investmentEffect: [
        { btc: true, mul: 1.11 },
        { category: "虚拟币", mul: 1.07 },
      ],
      duration: 2,
    },
  },
  crypto_crash_echo: {
    headline: "🕳️ 加密寒冬确认！多家交易所裁员，监管机构表态将加强管控",
    effects: {
      investmentEffect: [
        { btc: true, mul: 0.87 },
        { category: "虚拟币", mul: 0.84 },
      ],
      duration: 3,
    },
  },
  energy_crisis_echo: {
    headline: "📈 能源价格传导通胀！CPI超预期，央行被迫收紧流动性预期升温",
    effects: {
      investmentEffect: [
        { allStocks: true, mul: 0.96 },
        { category: "贵金属", mul: 1.09 },
      ],
      duration: 3,
    },
  },
  black_swan_echo: {
    headline: "🔻 黑天鹅余震持续！机构减仓速度加快，散户'抄底'变'接刀'",
    effects: {
      investmentEffect: [
        { allStocks: true, mul: 0.94 },
        { category: "贵金属", mul: 1.11 },
      ],
      duration: 2,
    },
  },
  chip_domestic_rise: {
    headline: "🇨🇳 国产替代加速崛起！国内芯片厂商订单爆满，多家宣布量产突破",
    effects: {
      investmentEffect: [
        { symbols: ["SMIC", "HUAW"], mul: 1.22 },
        { symbols: ["NVDA", "TSMC"], mul: 0.91 },
        { industry: "科技", mul: 1.08 },
      ],
      jobBonus: ["coding_freelance", "data_analyst"],
      jobMultiplier: 1.2,
      duration: 5,
    },
  },
  rider_winter: {
    headline: "🛵 外卖平台补贴战偃旗息鼓，骑手单价悄然回落，接单量萎缩",
    effects: {
      investmentEffect: [
        { symbols: ["MEIT", "DIDI"], mul: 0.93 },
        { industry: "消费", mul: 0.97 },
      ],
      jobBonus: ["delivery_rider"],
      jobMultiplier: 0.8,
      duration: 4,
    },
  },
};

/** NPC街头情报：好感换取提前数天的市场/工作/投资预判 */
var NPC_INTEL_RULES = {
  aunt_wang: [
    {
      newsId: "urban_renewal_pilot",
      delay: 2,
      text: "王大婶听房东群说，城中村旧改试点名单快下来了，装修和清运活可能会多。",
      confidence: 72,
    },
    {
      newsId: "property_stimulus",
      delay: 3,
      text: "王大婶说中介最近突然频繁约房东开会，像是楼市政策要松。",
      confidence: 66,
    },
    {
      newsId: "flu_surge",
      delay: 1,
      text: "王大婶说楼里好几户都发烧，医院和陪诊护工可能很快忙起来。",
      confidence: 78,
    },
  ],
  boss_li: [
    {
      newsId: "construction_boom",
      delay: 2,
      text: "李工头说隔壁地块钢筋已经进场，新楼盘开工八九不离十。",
      confidence: 80,
    },
    {
      newsId: "urban_renewal_pilot",
      delay: 2,
      text: "李工头接到几通清运队电话，像是城中村旧改要启动。",
      confidence: 74,
    },
    {
      newsId: "property_cooling",
      delay: 2,
      text: "李工头说几个工地突然停了招工，楼市风向可能不太对。",
      confidence: 70,
    },
  ],
  sister_zhang: [
    {
      newsId: "platform_subsidy_war",
      delay: 1,
      text: "张姐说平台HR最近在抢骑手和客服，像是补贴大战要开打。",
      confidence: 76,
    },
    {
      newsId: "min_wage",
      delay: 3,
      text: "张姐从人事群看到几家公司在重算薪资表，最低工资可能要调。",
      confidence: 68,
    },
    {
      newsId: "antitrust_investigation",
      delay: 2,
      text: "张姐提醒互联网大厂最近法务会特别多，平台股和科技岗位要谨慎。",
      confidence: 64,
    },
  ],
  old_zhou: [
    {
      newsId: "metal_boom",
      delay: 1,
      text: "老周说几个回收站忽然开始抢废铜废铝，金属行情像要动。",
      confidence: 82,
    },
    {
      newsId: "fruit_glut",
      delay: 2,
      text: "老周在批发市场听说外地水果车排队进城，水果价格可能要砸下来。",
      confidence: 70,
    },
    {
      newsId: "cold_wave",
      delay: 2,
      text: "老周说旧衣回收价抬头，北方寒潮可能快到。",
      confidence: 73,
    },
  ],
  xiao_mei: [
    {
      newsId: "ai_boom",
      delay: 2,
      text: "小美说实验室群里都在转国产大模型内测截图，AI板块可能有大新闻。",
      confidence: 78,
    },
    {
      newsId: "tech_fair",
      delay: 1,
      text: "小美提醒科技展马上开，数码和小电子产品需求会被拉起来。",
      confidence: 84,
    },
    {
      newsId: "trade_war_chip",
      delay: 3,
      text: "小美看到芯片圈都在聊出口管制，科技股短期可能会颠簸。",
      confidence: 69,
    },
    {
      newsId: "back_to_school",
      delay: 2,
      text: "小美说校园群里快递和家教信息暴增，开学季快到了。",
      confidence: 80,
    },
  ],
  chef_chen: [
    {
      newsId: "heatwave",
      delay: 1,
      text: "陈师傅说饮料供应商催他多囤水，天气可能要热起来。",
      confidence: 76,
    },
    {
      newsId: "flu_surge",
      delay: 1,
      text: "陈师傅说店里请假的客人和员工都多了，流感苗头很明显。",
      confidence: 74,
    },
    {
      newsId: "platform_subsidy_war",
      delay: 2,
      text: "陈师傅说外卖平台业务员突然上门谈补贴，骑手和餐饮都会被影响。",
      confidence: 72,
    },
  ],
};

function getNewsEventById(newsId) {
  for (var i = 0; i < NEWS_EVENTS.length; i++) {
    if (NEWS_EVENTS[i].id === newsId) return NEWS_EVENTS[i];
  }
  return null;
}

function getNpcIntelSourceName(npcId) {
  if (typeof getNpcById === "function") {
    var npc = getNpcById(npcId);
    if (npc) return npc.name;
  }
  var names = {
    aunt_wang: "王大婶",
    boss_li: "李工头",
    sister_zhang: "张姐",
    old_zhou: "老周",
    xiao_mei: "小美",
    chef_chen: "陈师傅",
  };
  return names[npcId] || "熟人";
}

function hasIntelNewsQueued(state, newsId) {
  var active = state.activeNews || [];
  for (var i = 0; i < active.length; i++) {
    if (active[i].id === newsId) return true;
  }
  var pending = state.flags._pendingIntelNews || [];
  for (var j = 0; j < pending.length; j++) {
    if (pending[j].newsId === newsId) return true;
  }
  return false;
}

function askNpcForIntel(npcId, state) {
  if (!state || !state.flags) return null;
  var rel = state.relationships && state.relationships[npcId];
  var affinity = rel ? rel.affinity || 0 : 0;
  if (affinity < 30) {
    return {
      ok: false,
      message:
        getNpcIntelSourceName(npcId) + "还没把你当熟人，暂时问不出可靠消息。",
    };
  }
  state.flags._npcIntelAskedDay = state.flags._npcIntelAskedDay || {};
  if (state.flags._npcIntelAskedDay[npcId] === state.player.day) {
    return {
      ok: false,
      message: "今天已经向" + getNpcIntelSourceName(npcId) + "打听过消息了。",
    };
  }

  var rules = NPC_INTEL_RULES[npcId] || [];
  var candidates = [];
  for (var i = 0; i < rules.length; i++) {
    if (
      getNewsEventById(rules[i].newsId) &&
      !hasIntelNewsQueued(state, rules[i].newsId)
    ) {
      candidates.push(rules[i]);
    }
  }
  if (!candidates.length) {
    state.flags._npcIntelAskedDay[npcId] = state.player.day;
    return {
      ok: false,
      message:
        getNpcIntelSourceName(npcId) + "想了想，说最近没有新的可靠风声。",
    };
  }

  var mental = (state.player && state.player.mental) || 0;
  var reliabilityBonus =
    Math.min(18, Math.floor(affinity / 8)) + Math.floor(mental / 12);
  var pickIndex = Random.int(0, candidates.length - 1);
  var intel = candidates[pickIndex];
  var confidence = Math.max(
    45,
    Math.min(95, (intel.confidence || 65) + reliabilityBonus),
  );
  var triggerDay = state.player.day + (intel.delay || 2);
  var sourceName = getNpcIntelSourceName(npcId);
  var id = npcId + "_" + intel.newsId + "_" + state.player.day;

  state.flags._pendingIntelNews = state.flags._pendingIntelNews || [];
  state.flags._activeIntel = state.flags._activeIntel || [];
  state.flags._pendingIntelNews.push({
    id: id,
    npcId: npcId,
    sourceName: sourceName,
    newsId: intel.newsId,
    triggerDay: triggerDay,
    confidence: confidence,
    text: intel.text,
  });
  state.flags._activeIntel.push({
    id: id,
    npcId: npcId,
    sourceName: sourceName,
    newsId: intel.newsId,
    createdDay: state.player.day,
    triggerDay: triggerDay,
    expireDay: triggerDay + 1,
    confidence: confidence,
    text: intel.text,
  });
  state.flags._npcIntelAskedDay[npcId] = state.player.day;

  return {
    ok: true,
    sourceName: sourceName,
    confidence: confidence,
    triggerDay: triggerDay,
    message:
      sourceName +
      "给了你一条风声：" +
      intel.text +
      "（约" +
      (triggerDay - state.player.day) +
      "天后见分晓）",
  };
}

function getActiveIntelTips(state, limit) {
  var list = (state.flags && state.flags._activeIntel) || [];
  var day = state.player ? state.player.day : 1;
  var mental = state.player ? state.player.mental || 0 : 0;
  var tips = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    if (item.expireDay < day) continue;
    var daysLeft = Math.max(0, item.triggerDay - day);
    var prefix =
      mental >= 70 ? "🗞️ 情报(" + item.confidence + "%)" : "🗞️ 街头风声";
    tips.push(
      prefix +
        "：" +
        item.text +
        (mental >= 50 ? "；约" + daysLeft + "天后兑现。" : "。"),
    );
  }
  return typeof limit === "number" ? tips.slice(0, limit) : tips;
}

/** 获取随机新闻事件 */
function getRandomNewsEvent() {
  // 按类型加权：价格35%，工作20%，个人20%，政策10%，投资15%
  var weights = {
    price: 35,
    job: 20,
    personal: 20,
    policy: 10,
    investment: 15,
  };
  var total = 0;
  for (var k in weights) total += weights[k];
  var roll = Math.random() * total;

  for (var type in weights) {
    roll -= weights[type];
    if (roll <= 0) {
      var typeEvents = NEWS_EVENTS.filter(function (e) {
        return e.type === type;
      });
      return typeEvents[Math.floor(Math.random() * typeEvents.length)];
    }
  }
  return NEWS_EVENTS[Math.floor(Math.random() * NEWS_EVENTS.length)];
}

/** 应用新闻效果 */
function applyNewsEffect(news, state) {
  var effects = news.effects;

  // 价格修正（商品市场）
  if (effects.priceMod) {
    for (var goodId in effects.priceMod) {
      var multiplier = effects.priceMod[goodId];
      for (var locKey in LOCATIONS) {
        var prices = state.trade.goodsPrices[locKey];
        if (prices && prices[goodId]) {
          prices[goodId] = Math.round(prices[goodId] * multiplier * 100) / 100;
        }
      }
    }
  }

  // 工作奖励/惩罚
  if (effects.jobBonus) {
    for (var i = 0; i < effects.jobBonus.length; i++) {
      var jobId = effects.jobBonus[i];
      state._jobMultipliers = state._jobMultipliers || {};
      state._jobMultipliers[jobId] =
        (state._jobMultipliers[jobId] || 1) * effects.jobMultiplier;
    }
  }
  if (effects.jobPenalty) {
    for (var j = 0; j < effects.jobPenalty.length; j++) {
      var penaltyId = effects.jobPenalty[j];
      state._jobMultipliers = state._jobMultipliers || {};
      state._jobMultipliers[penaltyId] =
        (state._jobMultipliers[penaltyId] || 1) * effects.jobMultiplier;
    }
  }
  if (effects.allJobsBonus) {
    state._allJobsBonus = (state._allJobsBonus || 1) * effects.allJobsBonus;
  }

  // 现金
  if (effects.cashBonus) {
    state.resources.cash += effects.cashBonus;
    state.resources.totalEarned += effects.cashBonus;
  }
  if (effects.cashLoss) {
    state.resources.cash = Math.max(0, state.resources.cash - effects.cashLoss);
  }

  // 需求
  if (effects.hungerBonus)
    state.needs.hunger = Math.min(
      100,
      state.needs.hunger + effects.hungerBonus,
    );
  if (effects.fatigueBonus)
    state.needs.fatigue = Math.max(
      0,
      state.needs.fatigue - effects.fatigueBonus,
    );
  if (effects.fatiguePenalty)
    state.needs.fatigue = Math.min(
      100,
      state.needs.fatigue + effects.fatiguePenalty,
    );
  if (effects.happinessBonus)
    state.needs.happiness = Math.min(
      100,
      state.needs.happiness + effects.happinessBonus,
    );

  // 技能经验
  if (effects.skillXp) {
    var skillKeys = Object.keys(state.skills);
    var key = skillKeys[Math.floor(Math.random() * skillKeys.length)];
    state.skills[key].xp += effects.skillXp;
  }

  // ── 投资市场联动 ──────────────────────────────────────────────
  if (effects.investmentEffect && state.investment) {
    var rules = effects.investmentEffect;
    var inv = state.investment;
    var hasInvStocks = typeof INV_STOCKS !== "undefined";

    for (var ri = 0; ri < rules.length; ri++) {
      var rule = rules[ri];
      var mul = rule.mul || rule.multiplier || 1.0;
      if (mul === 1.0) continue;

      // 比特币专项
      if (rule.btc) {
        if (inv.btcPrice) {
          inv.btcPrice = Math.max(1000, Math.round(inv.btcPrice * mul));
          inv.btcFearGreed = Math.max(
            5,
            Math.min(95, (inv.btcFearGreed || 50) + (mul > 1 ? 18 : -18)),
          );
        }
        continue;
      }

      if (!hasInvStocks || !inv.stockMarket) continue;

      for (var si = 0; si < INV_STOCKS.length; si++) {
        var stock = INV_STOCKS[si];
        var mkt = inv.stockMarket[stock.symbol];
        if (!mkt) continue;

        var hit = false;
        if (rule.allStocks) hit = true;
        if (rule.industry && stock.industry === rule.industry) hit = true;
        if (rule.category && stock.category === rule.category) hit = true;
        if (rule.symbols && rule.symbols.indexOf(stock.symbol) >= 0) hit = true;

        if (hit) {
          mkt.price = Math.max(0.000001, mkt.price * mul);
          // 按价格量级四舍五入，保持精度
          if (mkt.price >= 100) {
            mkt.price = Math.round(mkt.price * 100) / 100;
          } else if (mkt.price >= 0.1) {
            mkt.price = Math.round(mkt.price * 1000) / 1000;
          } else if (mkt.price >= 0.0001) {
            mkt.price = Math.round(mkt.price * 100000) / 100000;
          } else {
            mkt.price = Math.round(mkt.price * 10000000) / 10000000;
          }
        }
      }
    }
  }

  // 级联后续新闻调度（L1→L2）
  if (news.followUpId && NEWS_FOLLOWUP[news.followUpId] && !news._isFollowUp) {
    var delay = news.followUpDelay || 3;
    state.flags._pendingFollowUpNews = state.flags._pendingFollowUpNews || [];
    var alreadyPending = state.flags._pendingFollowUpNews.some(function (p) {
      return p.id === news.followUpId;
    });
    if (!alreadyPending) {
      state.flags._pendingFollowUpNews.push({
        id: news.followUpId,
        triggerDay: state.player.day + delay,
      });
    }
  }

  return effects;
}

/** 检查并触发待播级联新闻 */
function checkNewsFollowUp(state) {
  if (!state.flags) state.flags = {};
  var today = state.player.day;

  var intelPending = state.flags._pendingIntelNews || [];
  var intelRemaining = [];
  state.activeNews = state.activeNews || [];

  function hasActiveNews(newsId) {
    for (var ai = 0; ai < state.activeNews.length; ai++) {
      if (state.activeNews[ai].id === newsId) return true;
    }
    return false;
  }

  for (var ii = 0; ii < intelPending.length; ii++) {
    var intelItem = intelPending[ii];
    if (today >= intelItem.triggerDay) {
      var baseNews = getNewsEventById(intelItem.newsId);
      if (baseNews && !hasActiveNews(baseNews.id)) {
        var intelNewsEntry = {
          id: baseNews.id,
          headline: baseNews.headline,
          type: baseNews.type,
          effects: baseNews.effects,
          followUpId: baseNews.followUpId,
          followUpDelay: baseNews.followUpDelay,
          _appliedDay: today,
          _fromIntel: true,
          _sourceNpc: intelItem.sourceName,
        };
        state.activeNews.push(intelNewsEntry);
        applyNewsEffect(intelNewsEntry, state);
        StateManager.addMessage(
          "🗞️ " + intelItem.sourceName + "的情报兑现：" + baseNews.headline,
          "event",
        );
      }
    } else {
      intelRemaining.push(intelItem);
    }
  }
  state.flags._pendingIntelNews = intelRemaining;

  var pending = state.flags._pendingFollowUpNews || [];
  var remaining = [];
  for (var i = 0; i < pending.length; i++) {
    var item = pending[i];
    if (today >= item.triggerDay) {
      var followup = NEWS_FOLLOWUP[item.id];
      if (followup) {
        var newsEntry = {
          id: item.id,
          headline: followup.headline,
          effects: followup.effects,
          _appliedDay: today,
          _isFollowUp: true,
        };
        state.activeNews.push(newsEntry);
        applyNewsEffect(newsEntry, state);
        StateManager.addMessage("📰 [后续] " + followup.headline, "event");
      }
    } else {
      remaining.push(item);
    }
  }
  state.flags._pendingFollowUpNews = remaining;
}

/** 清除过期新闻效果 */
function cleanupExpiredNews(state) {
  state.activeNews = (state.activeNews || []).filter(function (news) {
    if (news._appliedDay === undefined) news._appliedDay = state.player.day;
    return state.player.day - news._appliedDay < (news.effects.duration || 5);
  });

  if (state.flags && state.flags._activeIntel) {
    state.flags._activeIntel = state.flags._activeIntel.filter(
      function (intel) {
        return intel.expireDay >= state.player.day;
      },
    );
  }
  if (state.flags && state.flags._pendingIntelNews) {
    state.flags._pendingIntelNews = state.flags._pendingIntelNews.filter(
      function (intel) {
        return intel.triggerDay >= state.player.day;
      },
    );
  }

  // 恢复工作倍率
  if (state.activeNews.length === 0) {
    state._jobMultipliers = {};
    state._allJobsBonus = 1;
  }
}

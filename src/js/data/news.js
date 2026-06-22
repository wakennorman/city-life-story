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

  // ============================================================
  // 新地点联动新闻（配套银行/公园/培训中心地点）
  // 参考来源：真实中国城市新闻 / 《大多数》新闻系统
  // ============================================================
  {
    id: "bank_fraud_alert",
    headline: "🚨 银行附近出现诈骗团伙！老人被骗光积蓄",
    desc: "警方提醒：近期有诈骗团伙在银行附近冒充工作人员，以"高息理财"为名骗取老人存款。",
    effects: {
      priceMod: { daily_use: 1.05 }, // 安全用品涨价
      jobBonus: ["bank_security"],
      jobMultiplier: 1.2, // 银行保安需求增加
      duration: 5,
    },
    type: "job",
    industry: "金融",
    followUpId: "bank_fraud_echo",
    followUpDelay: 4,
  },
  {
    id: "park_festival",
    headline: "🎉 公园文化节即将开幕！街头艺人报名火爆",
    desc: "市里将在公园举办为期一周的文化节，街头表演、手工艺品摊位报名火爆。",
    effects: {
      priceMod: { snacks: 1.3, fruits: 1.2, clothing: 1.1 },
      jobBonus: ["busking", "park_flower_vendor", "street_performer"],
      jobMultiplier: 1.5,
      duration: 3,
    },
    type: "job",
  },
  {
    id: "training_subsidy",
    headline: "📚 政府推出技能培训补贴！考证人数激增",
    desc: "人社局宣布：对考取电工证、会计证等职业资格证书的人员给予补贴，最高¥3000。",
    effects: {
      // 培训中心相关
      duration: 7,
    },
    type: "policy",
    followUpId: "training_subsidy_echo",
    followUpDelay: 5,
  },
  {
    id: "park_renovation",
    headline: "🔨 市中心公园启动改造！部分区域封闭施工",
    desc: "公园将从下月开始为期两个月的改造升级，部分区域暂时封闭，影响街头工作和卖花收入。",
    effects: {
      jobPenalty: ["park_cleaning", "park_guide", "park_flower_vendor", "busking"],
      jobMultiplier: 0.6,
      duration: 60, // 长期影响
    },
    type: "job",
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
        { industry: "房地产", mul: 0.8 },
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
        { industry: "房地产", mul: 1.25 },
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

  // ====== 房地产新闻（v2 波动系统） ======
  {
    id: "mortgage_rate_cut",
    headline: "🏦 央行下调房贷利率！首套利率降至3.5%，月供减少上千元",
    effects: {
      investmentEffect: [
        { industry: "房地产", mul: 1.15 },
        { industry: "金融", mul: 1.05 },
        { symbols: ["ESTATE"], mul: 1.15 },
      ],
      duration: 7,
    },
    type: "investment",
  },
  {
    id: "property_tax_pilot",
    headline: "📋 房产税试点扩围！多套房持有成本大幅上升，投资客抛售潮",
    effects: {
      investmentEffect: [
        { industry: "房地产", mul: 0.82 },
        { symbols: ["ESTATE"], mul: 0.82 },
      ],
      duration: 10,
    },
    type: "investment",
  },
  {
    id: "developer_default",
    headline: "🏗️ 某千亿房企债务违约！行业信用危机蔓延，楼市恐慌加剧",
    effects: {
      investmentEffect: [
        { industry: "房地产", mul: 0.78 },
        { symbols: ["ESTATE"], mul: 0.78 },
        { industry: "金融", mul: 0.93 },
        { category: "贵金属", mul: 1.08 },
      ],
      duration: 6,
    },
    type: "investment",
  },
  {
    id: "city_infrastructure",
    headline: "🚇 地铁新线路获批！沿线房价预期升温，土拍市场抢先反应",
    effects: {
      investmentEffect: [
        { industry: "房地产", mul: 1.08 },
        { symbols: ["ESTATE"], mul: 1.08 },
      ],
      duration: 5,
    },
    type: "investment",
  },
  {
    id: "population_inflow",
    headline: "🏙️ 一线城市人口净流入创新高！住房需求旺盛，租金持续上涨",
    effects: {
      investmentEffect: [
        { industry: "房地产", mul: 1.12 },
        { symbols: ["ESTATE"], mul: 1.12 },
        { industry: "消费", mul: 1.05 },
      ],
      duration: 8,
    },
    type: "investment",
  },
  {
    id: "vacant_housing_survey",
    headline: "🔍 全国空置房调查启动！存量房市场承压，二手房挂牌量激增",
    effects: {
      investmentEffect: [
        { industry: "房地产", mul: 0.88 },
        { symbols: ["ESTATE"], mul: 0.88 },
      ],
      duration: 4,
    },
    type: "investment",
  },
  {
    id: "relaxed_hukou",
    headline: "📜 二线城市全面放开落户！购房门槛降低，新市民购房需求释放",
    effects: {
      investmentEffect: [
        { industry: "房地产", mul: 1.1 },
        { symbols: ["ESTATE"], mul: 1.1 },
        { industry: "消费", mul: 1.03 },
      ],
      duration: 6,
    },
    type: "investment",
  },

  // ============================================================
  // 待完成：新增价格影响事件 — 参考真实新闻 + 《资本家模拟器》《大多数》
  // 实现提示：在 NEWS_EVENTS 数组中追加，注意 investmentEffect 格式与现有一致
  // 参考来源：真实中国经济新闻、《资本家模拟器》市场事件
  // ============================================================
  // TODO: 待实现 - 科技大厂裁员潮
  // {
  //   id: "tech_layoff",
  //   headline: "科技大厂裁员潮！二手电子产品价格暴跌",
  //   story: "某大厂宣布裁员30%，大量员工抛售电子产品回血。二手市场供过于求。",
  //   effects: {
  //     priceMod: { electronics: 0.5, daily_use: 0.8 },
  //     investmentEffect: [{ industry: "科技", mul: 0.85 }],
  //     duration: 7,
  //   },
  //   type: "price",
  // },
  // TODO: 待实现 - 食品安全事件
  // {
  //   id: "food_safety",
  //   headline: "食品安全事件曝光！外卖需求骤降，在家做饭需求上升",
  //   story: "某连锁餐厅被曝光使用过期食材。消费者转向自己做饭。",
  //   effects: {
  //     priceMod: { vegetables: 1.3, rice: 1.2, instant_noodles: 0.8 },
  //     jobMultiplier: 0.6,
  //     jobPenalty: ["delivery_rider", "food_stall"],
  //     duration: 5,
  //   },
  //   type: "price",
  // },
  // TODO: 待实现 - 国际油价暴涨
  // {
  //   id: "gas_price_surge",
  //   headline: "国际油价暴涨！打车/配送成本飙升",
  //   story: "中东局势紧张，油价单周上涨20%。打车费涨了，配送费也跟着涨。",
  //   effects: {
  //     priceMod: { water: 1.1, snacks: 1.15 },
  //     jobMultiplier: 0.85,
  //     jobPenalty: ["delivery_rider", "package_delivery"],
  //     investmentEffect: [{ symbols: ["CL", "NG"], mul: 1.3 }],
  //     duration: 6,
  //   },
  //   type: "price",
  // },
  // TODO: 待实现 - 富豪消费回暖
  // {
  //   id: "luxury_boom",
  //   headline: "富豪消费回暖！奢侈品/高端商品需求激增",
  //   story: "经济复苏，富人开始大手笔消费。奢侈品店排队，高端商品供不应求。",
  //   effects: {
  //     priceMod: { clothing: 1.8, electronics: 1.5 },
  //     duration: 5,
  //   },
  //   type: "price",
  // },
  // TODO: 待实现 - 双减政策加码
  // {
  //   id: "education_crackdown",
  //   headline: "\"双减\"政策加码！课外辅导行业受冲击",
  //   story: "教育部发布新规，周末和节假日禁止学科类培训。培训机构大规模裁员。",
  //   effects: {
  //     jobMultiplier: 0.5,
  //     jobPenalty: ["tutoring"],
  //     investmentEffect: [{ industry: "教育", mul: 0.7 }],
  //     duration: 10,
  //   },
  //   type: "policy",
  // },
  // TODO: 待实现 - 旅游市场复苏
  // {
  //   id: "tourism_revival",
  //   headline: "旅游市场复苏！景区/酒店/交通需求爆发",
  //   story: "疫情后首个长假，旅游人数创历史新高。景区爆满，酒店涨价。",
  //   effects: {
  //     priceMod: { clothing: 1.2, electronics: 1.1 },
  //     jobBonus: ["delivery_rider", "street_vending_goods"],
  //     jobMultiplier: 1.2,
  //     duration: 8,
  //   },
  //   type: "price",
  // },
  // TODO: 待实现 - 北方供暖需求激增
  // {
  //   id: "winter_heating",
  //   headline: "北方供暖需求激增！煤炭/暖气价格上涨",
  //   story: "寒潮来袭，北方提前供暖。煤炭需求暴增，价格跟着涨。",
  //   effects: {
  //     priceMod: { daily_use: 1.3 },
  //     investmentEffect: [{ symbols: ["CL", "NG"], mul: 1.4 }],
  //     duration: 4,
  //   },
  //   type: "price",
  // },
  // TODO: 待实现 - 电商大促节
  // {
  //   id: "e_commerce_festival",
  //   headline: "电商大促节！物流爆单，快递需求翻倍",
  //   story: "双11来了。商家疯狂备货，快递公司全员上岗，快递小哥日入过千。",
  //   effects: {
  //     jobBonus: ["delivery_rider", "package_delivery", "courier_gig"],
  //     jobMultiplier: 1.5,
  //     duration: 3,
  //   },
  //   type: "job",
  // },
  // TODO: 待实现 - 租房市场紧张
  // {
  //   id: "rental_crisis",
  //   headline: "租房市场紧张！租金全面上涨",
  //   story: "毕业季+就业回暖，租房需求暴增。房东集体涨价，城中村单间涨到¥800。",
  //   effects: {
  //     housingRentMod: 1.3,
  //     jobBonus: ["cleaning_service", "repair_service"],
  //     duration: 14,
  //   },
  //   type: "policy",
  // },
  // TODO: 待实现 - 二手经济爆发
  // {
  //   id: "second_hand_boom",
  //   headline: "二手经济爆发！闲鱼/转转交易量翻倍",
  //   story: "年轻人开始崇尚'断舍离'，二手交易平台日活破千万。",
  //   effects: {
  //     priceMod: { clothing: 1.5, electronics: 1.3, scrap_metal: 1.2, scrap_paper: 1.2 },
  //     duration: 6,
  //   },
  //   type: "price",
  // },
  // TODO: 待实现 - 农产品价格波动
  // {
  //   id: "veggie_price_surge",
  //   headline: "蔬菜价格暴涨！连续阴雨导致减产",
  //   story: "南方连续阴雨，蔬菜大面积减产。菜市场青菜涨到¥8/斤。",
  //   effects: {
  //     priceMod: { vegetables: 2.5, rice: 1.1 },
  //     jobBonus: ["street_vending_food"],
  //     duration: 5,
  //   },
  //   type: "price",
  // },
  // TODO: 待实现 - 电子产品涨价
  // {
  //   id: "chip_shortage",
  //   headline: "芯片短缺！电子产品全线涨价",
  //   story: "全球芯片短缺，手机、电脑、家电全线涨价。",
  //   effects: {
  //     priceMod: { electronics: 1.6 },
  //     investmentEffect: [{ industry: "科技", mul: 1.1 }],
  //     duration: 10,
  //   },
  //   type: "price",
  // },

  // ============================================================
  // 待完成：新增工作影响事件 — 目标 8 条
  // 参考来源：真实零工经济新闻、《大多数》工作事件
  // ============================================================
  // TODO: 待实现 - 外卖平台被封
  // {
  //   id: "platform_ban",
  //   headline: "某外卖平台被封！骑手大规模转行",
  //   story: "某外卖平台因违规被下架。十万骑手一夜失业，纷纷转行。",
  //   effects: {
  //     jobMultiplier: 0.4,
  //     jobPenalty: ["delivery_rider"],
  //     jobBonus: ["package_delivery", "courier_gig"],
  //     duration: 5,
  //   },
  //   type: "job",
  // },
  // TODO: 待实现 - 工厂用工荒
  // {
  //   id: "factory_shortage",
  //   headline: "工厂用工荒！加班费涨至平日3倍",
  //   story: "春节后工厂招工难。为了留住工人，加班费涨到3倍。",
  //   effects: {
  //     jobBonus: ["factory_work_assembly", "factory_overtime"],
  //     jobMultiplier: 3.0,
  //     fatigueMod: 1.5,
  //     duration: 4,
  //   },
  //   type: "job",
  // },
  // TODO: 待实现 - 双11物流爆仓
  // {
  //   id: "delivery_boom",
  //   headline: "双11物流爆仓！快递小哥日入过千",
  //   story: "双11当天，快递量破亿件。快递小哥累并快乐着。",
  //   effects: {
  //     jobBonus: ["delivery_rider", "package_delivery"],
  //     jobMultiplier: 2.5,
  //     apCostMod: 1.2,
  //     duration: 7,
  //   },
  //   type: "job",
  // },
  // TODO: 待实现 - 工地停工整顿
  // {
  //   id: "construction_delay",
  //   headline: "工地停工整顿！建筑工人临时失业",
  //   story: "某工地发生安全事故，全区工地停工整顿。工人暂时没活干。",
  //   effects: {
  //     jobPenalty: ["manual_labor_construction", "skilled_labor_construction"],
  //     jobMultiplier: 0,
  //     jobBonus: ["waste_recycling"],
  //     duration: 6,
  //   },
  //   type: "job",
  // },
  // TODO: 待实现 - 节假日零售旺季
  // {
  //   id: "retail_holiday",
  //   headline: "节假日零售旺季！商场招临时促销员",
  //   story: "五一黄金周，商场客流暴增。临时促销员日薪¥300。",
  //   effects: {
  //     jobBonus: ["street_vending_goods", "street_vending_food"],
  //     jobMultiplier: 1.8,
  //     duration: 5,
  //   },
  //   type: "job",
  // },
  // TODO: 待实现 - 零工经济爆发
  // {
  //   id: "gig_economy",
  //   headline: "零工经济爆发！自由职业机会激增",
  //   story: "平台经济蓬勃发展，自由职业者数量翻倍。设计、写作、翻译都有活。",
  //   effects: {
  //     jobBonus: ["freelance_coding", "freelance_design", "freelance_writing"],
  //     jobMultiplier: 1.5,
  //     duration: 10,
  //   },
  //   type: "job",
  // },
  // TODO: 待实现 - 医疗需求上升
  // {
  //   id: "healthcare_demand",
  //   headline: "医疗需求上升！护工/陪诊紧缺",
  //   story: "老龄化社会到来，护工需求暴增。有证的护工日薪¥500。",
  //   effects: {
  //     jobBonus: ["hospital_caregiver"],
  //     jobMultiplier: 1.6,
  //     investmentEffect: [{ industry: "医药", mul: 1.1 }],
  //     duration: 8,
  //   },
  //   type: "job",
  // },
  // TODO: 待实现 - 短视频风口
  // {
  //   id: "content_creator",
  //   headline: "短视频风口！内容创作者收入翻倍",
  //   story: "短视频平台日活破6亿。内容创作者成了新职业。",
  //   effects: {
  //     jobBonus: ["content_writing"],
  //     jobMultiplier: 2.0,
  //     competitionMod: 1.5,
  //     duration: 12,
  //   },
  //   type: "job",
  // },
  // TODO: 待实现 - 疫情封控
  // {
  //   id: "pandemic_lockdown",
  //   headline: "局部疫情爆发！部分区域封控管理",
  //   story: "某地发现确诊病例，周边区域封控。外卖、快递受限。",
  //   effects: {
  //     jobPenalty: ["street_vending_food", "street_vending_goods", "delivery_rider"],
  //     jobMultiplier: 0.3,
  //     jobBonus: ["online_tutoring", "freelance_writing"],
  //     duration: 7,
  //   },
  //   type: "job",
  // },

  // ============================================================
  // 待完成：新增个人互动事件（道德困境风格）— 参考《This War of Mine》《Papers Please》
  // 实现提示：type: "personal"，含 choices 数组，每个 choice 有 text/hint/apply/cost
  // 参考来源：《This War of Mine》道德困境、《Papers Please》选择系统
  // ============================================================
  // TODO: 待实现 - 捡到手机
  // {
  //   id: "lost_phone",
  //   headline: "捡到手机",
  //   story: "路边捡到一部手机，里面有联系人和支付软件。解锁后能看到余额¥2000。",
  //   choices: [
  //     { text: "归还（+幸福/+名声）", apply: function(st) { st.needs.happiness = Math.min(100, st.needs.happiness + 8); st.player.fame = Math.min(100, st.player.fame + 3); st.flags._returnedPhone = true; } },
  //     { text: "据为己有（+现金/-道德）", apply: function(st) { st.resources.cash += 2000; st.needs.happiness = Math.max(0, st.needs.happiness - 5); st.flags._keptPhone = true; } },
  //     { text: "卖掉（+现金/-名声）", apply: function(st) { st.resources.cash += 500; st.player.fame = Math.max(0, st.player.fame - 3); st.flags._soldPhone = true; } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 街头乞丐
  // {
  //   id: "beggar_encounter",
  //   headline: "街头乞丐",
  //   story: "一个老人坐在路边乞讨，面前摆着'生病没钱治'的牌子。",
  //   choices: [
  //     { text: "给钱（-¥10/+道德）", apply: function(st) { st.resources.cash = Math.max(0, st.resources.cash - 10); st.needs.happiness = Math.min(100, st.needs.happiness + 3); } },
  //     { text: "给食物（-食材/+道德）", apply: function(st) { /* 消耗一个食材 */ st.needs.happiness = Math.min(100, st.needs.happiness + 5); } },
  //     { text: "无视（无变化）", apply: function(st) { /* 无变化 */ } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 老板要求做假账
  // {
  //   id: "corrupt_boss",
  //   headline: "老板要求做假账",
  //   story: "老板找你：'把这个月的账做平，没人会知道的。' 你知道这是违法的。",
  //   choices: [
  //     { text: "拒绝（-KPI/+道德）", apply: function(st) { st.needs.happiness = Math.min(100, st.needs.happiness + 5); /* KPI受影响 */ } },
  //     { text: "照做（+KPI/-道德/-名声）", apply: function(st) { /* KPI+ */ st.flags._didFakeAccounts = true; } },
  //     { text: "举报（高风险）", apply: function(st) { /* 50%概率被报复 */ } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 朋友借钱不还
  // {
  //   id: "friend_borrow_money",
  //   headline: "朋友借钱不还",
  //   story: "老朋友找你借钱：'急用，下个月就还。' 但你记得他上次借的还没还。",
  //   choices: [
  //     { text: "再借一次（-现金/+关系）", apply: function(st) { st.resources.cash = Math.max(0, st.resources.cash - 200); } },
  //     { text: "拒绝（-关系）", apply: function(st) { /* 关系下降 */ } },
  //     { text: "讨债（-关系/+现金可能）", apply: function(st) { /* 50%概率要回旧债 */ } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 发现同事偷公司
  // {
  //   id: "colleague_steal",
  //   headline: "发现同事偷公司",
  //   story: "你发现同事在偷偷把公司的东西带回家。他没有看到你。",
  //   choices: [
  //     { text: "举报（+名声/-同事关系）", apply: function(st) { st.player.fame = Math.min(100, st.player.fame + 5); } },
  //     { text: "装没看见（无变化）", apply: function(st) { /* 无变化 */ } },
  //     { text: "私下劝告（+道德风险）", apply: function(st) { /* 可能被他报复 */ } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 路人突发疾病
  // {
  //   id: "medical_emergency",
  //   headline: "路人突发疾病",
  //   story: "路上有人突然倒地抽搐。周围人都在围观，没人上前。",
  //   choices: [
  //     { text: "帮忙叫救护车（-时间/+道德）", apply: function(st) { st.needs.fatigue = Math.min(100, st.needs.fatigue + 10); } },
  //     { text: "自己送医院（-时间/-疲劳/+道德）", apply: function(st) { st.needs.fatigue = Math.min(100, st.needs.fatigue + 20); } },
  //     { text: "离开（无变化）", apply: function(st) { /* 无变化 */ } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 涨价卖高价
  // {
  //   id: "price_gouging",
  //   headline: "涨价卖高价",
  //   story: "某商品缺货，你可以按原价卖，也可以涨价30%卖。",
  //   choices: [
  //     { text: "正常价卖（+道德/-利润）", apply: function(st) { /* 正常利润 */ } },
  //     { text: "涨价卖（+利润/-道德）", apply: function(st) { /* 利润+30% */ } },
  //     { text: "不卖了（无变化）", apply: function(st) { /* 无变化 */ } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 有人邀你举报公司
  // {
  //   id: "whistleblower",
  //   headline: "有人邀你举报公司",
  //   story: "有律师找你：'你们公司在违法排污，你有证据吗？举报有奖励。'",
  //   choices: [
  //     { text: "加入（高风险高回报）", apply: function(st) { /* 可能获得赔偿，也可能被公司报复 */ } },
  //     { text: "拒绝（安全）", apply: function(st) { /* 无变化 */ } },
  //     { text: "匿名举报（折中）", apply: function(st) { /* 中等风险 */ } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 有人卖来路不明的货
  // {
  //   id: "stolen_goods",
  //   headline: "有人卖来路不明的货",
  //   story: "有人低价卖给你一批电子产品，但你怀疑是偷来的。",
  //   choices: [
  //     { text: "不买（+道德）", apply: function(st) { /* 无变化 */ } },
  //     { text: "买了转卖（+利润/-道德）", apply: function(st) { /* 利润可观 */ } },
  //     { text: "举报（+名声/-潜在报复）", apply: function(st) { st.player.fame = Math.min(100, st.player.fame + 8); } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 发现项目数据造假
  // {
  //   id: "work_fraud",
  //   headline: "发现项目数据造假",
  //   story: "你发现项目数据有猫腻。上报可能被穿小鞋，沉默则良心不安。",
  //   choices: [
  //     { text: "上报（+道德/-团队关系）", apply: function(st) { /* 团队关系下降 */ } },
  //     { text: "沉默（无变化）", apply: function(st) { /* 无变化 */ } },
  //     { text: "自己修正（+道德/-时间）", apply: function(st) { /* 花时间修正 */ } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 慈善募捐
  // {
  //   id: "charity_donation",
  //   headline: "慈善募捐",
  //   story: "街头有慈善募捐箱，为贫困儿童筹款。",
  //   choices: [
  //     { text: "捐¥100（-现金/+道德）", apply: function(st) { st.resources.cash = Math.max(0, st.resources.cash - 100); } },
  //     { text: "捐物资（-物品/+道德）", apply: function(st) { /* 消耗一个物品 */ } },
  //     { text: "不捐（无变化）", apply: function(st) { /* 无变化 */ } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 家人生病需要钱
  // {
  //   id: "family_emergency",
  //   headline: "家人生病需要钱",
  //   story: "老家传来消息：母亲生病，需要¥5000手术费。",
  //   choices: [
  //     { text: "借高利贷（-现金风险/+家庭）", apply: function(st) { st.resources.cash += 5000; /* 后续有利息 */ } },
  //     { text: "向朋友借（-关系风险）", apply: function(st) { st.resources.cash += 5000; /* 关系受影响 */ } },
  //     { text: "放弃治疗（-道德/-家庭）", apply: function(st) { /* 道德和家庭双降 */ } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 加班还是回家
  // {
  //   id: "work_overtime_conflict",
  //   headline: "加班还是回家",
  //   story: "今天是你父母的生日，但公司要求加班。",
  //   choices: [
  //     { text: "加班（+KPI/-家庭）", apply: function(st) { /* KPI+，家庭关系- */ } },
  //     { text: "回家（-KPI/+家庭）", apply: function(st) { /* KPI-，家庭关系+ */ } },
  //     { text: "折中（各50%）", apply: function(st) { /* 各半 */ } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 不道德的工作机会
  // {
  //   id: "ethical_dilemma_job",
  //   headline: "不道德的工作机会",
  //   story: "有人给你介绍工作：帮他们发虚假广告，日薪¥500。",
  //   choices: [
  //     { text: "接（+现金/-道德）", apply: function(st) { st.resources.cash += 500; } },
  //     { text: "拒绝（-现金/+道德）", apply: function(st) { st.needs.happiness = Math.min(100, st.needs.happiness + 5); } },
  //   ],
  //   type: "personal",
  // },
  // TODO: 待实现 - 社区需要志愿者
  // {
  //   id: "community_help",
  //   headline: "社区需要志愿者",
  //   story: "社区组织清理垃圾活动，需要志愿者。",
  //   choices: [
  //     { text: "参加（-时间/+社区关系）", apply: function(st) { st.needs.fatigue = Math.min(100, st.needs.fatigue + 15); } },
  //     { text: "不参加（无变化）", apply: function(st) { /* 无变化 */ } },
  //   ],
  //   type: "personal",
  // },

  // ============================================================
  // 待完成：新增政策事件 — 目标 8 条
  // 参考来源：真实中国政策新闻
  // ============================================================
  // TODO: 待实现 - 户籍制度改革
  // {
  //   id: "hukou_reform",
  //   headline: "户籍制度改革！非本地户口享受同等公共服务",
  //   story: "新政：非本地户口也能享受本地教育、医疗等公共服务。",
  //   effects: {
  //     npcAffinityMod: 0.1,
  //     housingRestrictionRelaxed: true,
  //     duration: 999, // 永久
  //   },
  //   type: "policy",
  // },
  // TODO: 待实现 - 最低工资再上调
  // {
  //   id: "minimum_wage_raise",
  //   headline: "最低工资再上调至¥2500",
  //   story: "市政府宣布最低工资标准上调至¥2500/月。",
  //   effects: {
  //     allJobsBonus: 1.15,
  //     someJobsDisappear: true,
  //     duration: 999,
  //   },
  //   type: "policy",
  // },
  // TODO: 待实现 - 社保全覆盖
  // {
  //   id: "social_security",
  //   headline: "社保全覆盖！强制缴纳五险一金",
  //   story: "所有企业必须为员工缴纳五险一金。",
  //   effects: {
  //     incomeTaxMod: 0.9,
  //     illnessProtection: 0.3,
  //     unemploymentProtection: 0.3,
  //     duration: 999,
  //   },
  //   type: "policy",
  // },
  // TODO: 待实现 - 限购令升级
  // {
  //   id: "housing_restriction",
  //   headline: "限购令升级！每人限买一套房",
  //   story: "为抑制炒房，每人限买一套房。",
  //   effects: {
  //     investmentEffect: [{ industry: "房地产", mul: 0.6 }],
  //     priceMod: { clothing: 1.2 },
  //     duration: 999,
  //   },
  //   type: "policy",
  // },
  // TODO: 待实现 - 教育资源均衡化
  // {
  //   id: "education_equality",
  //   headline: "教育资源均衡化！免费职业教育推广",
  //   story: "政府推出免费职业教育计划，提升劳动者技能。",
  //   effects: {
  //     trainingDiscount: 0.5,
  //     skillXpBonus: 0.2,
  //     duration: 999,
  //   },
  //   type: "policy",
  // },
  // TODO: 待实现 - 个税减免
  // {
  //   id: "tax_cut",
  //   headline: "个人所得税减免！年收入<10万免税",
  //   story: "个税起征点上调，年收入10万以下免税。",
  //   effects: {
  //     incomeTaxFreeThreshold: 100000,
  //     duration: 30,
  //   },
  //   type: "policy",
  // },
  // TODO: 待实现 - 新能源补贴延续
  // {
  //   id: "green_energy",
  //   headline: "新能源补贴延续！电动车/光伏产业受益",
  //   story: "新能源车补贴再延长3年。",
  //   effects: {
  //     investmentEffect: [{ industry: "新能源", mul: 1.2 }],
  //     duration: 15,
  //   },
  //   type: "policy",
  // },
  // TODO: 待实现 - 反垄断二期
  // {
  //   id: "anti_monopoly_2",
  //   headline: "反垄断二期！平台经济监管加强",
  //   story: "平台经济反垄断进入二期，监管更严。",
  //   effects: {
  //     investmentEffect: [{ industry: "科技", mul: 0.75 }, { industry: "金融", mul: 1.1 }],
  //     duration: 20,
  //   },
  //   type: "policy",
  // },
  // TODO: 待实现 - 保障性住房
  // {
  //   id: "affordable_housing",
  //   headline: "保障性住房扩容！低收入家庭可申请",
  //   story: "政府加大保障性住房建设，低收入家庭可申请。",
  //   effects: {
  //     housingRentMod: 0.7,
  //     duration: 999,
  //   },
  //   type: "policy",
  // },

  // ============================================================
  // 待完成：新增投资专项事件 — 目标 12 条
  // 参考来源：《资本家模拟器》投资事件、真实金融新闻
  // ============================================================
  // TODO: 待实现 - 央行再次降息
  // {
  //   id: "interest_rate_cut_2",
  //   headline: "央行再次降息！流动性进一步宽松",
  //   story: "央行宣布降息25个基点，流动性进一步宽松。",
  //   effects: {
  //     investmentEffect: [
  //       { allStocks: true, mul: 1.06 },
  //       { btc: true, mul: 1.1 },
  //       { category: "贵金属", mul: 1.03 },
  //     ],
  //     duration: 7,
  //   },
  //   type: "investment",
  // },
  // TODO: 待实现 - 美国追加技术制裁
  // {
  //   id: "tech_sanction",
  //   headline: "美国追加技术制裁！半导体产业链受冲击",
  //   story: "美国追加半导体出口管制，国产替代加速。",
  //   effects: {
  //     investmentEffect: [
  //       { symbols: ["SMIC", "HUAW"], mul: 0.7 },
  //       { industry: "科技", mul: 0.85 },
  //     ],
  //     duration: 10,
  //   },
  //   type: "investment",
  // },
  // TODO: 待实现 - 房地产泡沫破裂预警
  // {
  //   id: "property_bubble",
  //   headline: "房地产泡沫破裂预警！多城房价下跌",
  //   story: "多城房价连续下跌，房地产泡沫破裂预警。",
  //   effects: {
  //     investmentEffect: [
  //       { symbols: ["ESTATE"], mul: 0.65 },
  //       { industry: "房地产", mul: 0.65 },
  //       { industry: "金融", mul: 0.85 },
  //     ],
  //     duration: 12,
  //   },
  //   type: "investment",
  // },
  // TODO: 待实现 - 加密货币监管收紧
  // {
  //   id: "crypto_regulation",
  //   headline: "加密货币监管收紧！交易所受限",
  //   story: "监管层宣布加强对加密货币的监管。",
  //   effects: {
  //     investmentEffect: [
  //       { btc: true, mul: 0.6 },
  //       { category: "虚拟币", mul: 0.5 },
  //     ],
  //     duration: 8,
  //   },
  //   type: "investment",
  // },
  // TODO: 待实现 - 油价暴跌
  // {
  //   id: "oil_price_crash",
  //   headline: "油价暴跌！OPEC+减产失败",
  //   story: "OPEC+减产谈判破裂，油价单日暴跌15%。",
  //   effects: {
  //     investmentEffect: [
  //       { symbols: ["CL", "NG"], mul: 0.6 },
  //       { industry: "新能源", mul: 1.15 },
  //     ],
  //     duration: 5,
  //   },
  //   type: "investment",
  // },
  // TODO: 待实现 - 黄金价格创新高
  // {
  //   id: "gold_rush",
  //   headline: "避险情绪升温！黄金价格创历史新高",
  //   story: "地缘政治紧张，资金涌入黄金避险。",
  //   effects: {
  //     investmentEffect: [
  //       { category: "贵金属", mul: 1.25 },
  //       { allStocks: true, mul: 0.9 },
  //     ],
  //     duration: 6,
  //   },
  //   type: "investment",
  // },
  // TODO: 待实现 - 全球AI投资热潮
  // {
  //   id: "ai_investment",
  //   headline: "全球AI投资热潮！算力/模型/应用全线爆发",
  //   story: "AI大模型投资热潮，算力、模型、应用全线爆发。",
  //   effects: {
  //     investmentEffect: [
  //       { industry: "科技", mul: 1.3 },
  //       { symbols: ["NVDA", "BYTE", "BAID"], mul: 1.5 },
  //     ],
  //     duration: 10,
  //   },
  //   type: "investment",
  // },
  // TODO: 待实现 - 生物医药突破
  // {
  //   id: "healthcare_boom",
  //   headline: "生物医药突破！创新药获批上市",
  //   story: "国产创新药获批上市，生物医药板块大涨。",
  //   effects: {
  //     investmentEffect: [
  //       { industry: "医药", mul: 1.2 },
  //     ],
  //     duration: 7,
  //   },
  //   type: "investment",
  // },
  // TODO: 待实现 - 消费升级
  // {
  //   id: "consumer_upgrade",
  //   headline: "消费升级趋势！高端消费品牌受益",
  //   story: "消费升级趋势明显，高端消费品牌受益。",
  //   effects: {
  //     investmentEffect: [
  //       { industry: "消费", mul: 1.15 },
  //     ],
  //     duration: 9,
  //   },
  //   type: "investment",
  // },
  // TODO: 待实现 - 万亿基建计划
  // {
  //   id: "infrastructure_plan",
  //   headline: "万亿基建计划！新基建投资启动",
  //   story: "政府宣布万亿新基建投资计划。",
  //   effects: {
  //     investmentEffect: [
  //       { symbols: ["ESTATE"], mul: 1.2 },
  //     ],
  //     duration: 14,
  //   },
  //   type: "investment",
  // },
  // TODO: 待实现 - 人民币贬值
  // {
  //   id: "currency_devaluation",
  //   headline: "人民币贬值！出口企业受益",
  //   story: "人民币对美元贬值5%，出口企业受益。",
  //   effects: {
  //     investmentEffect: [
  //       { industry: "科技", mul: 1.1 },
  //       { industry: "制造", mul: 1.05 },
  //     ],
  //     duration: 8,
  //   },
  //   type: "investment",
  // },
  // TODO: 待实现 - 股市系统性风险预警
  // {
  //   id: "market_crash_warning",
  //   headline: "股市系统性风险预警！监管层提示风险",
  //   story: "监管层发布股市风险提示，投资者需谨慎。",
  //   effects: {
  //     investmentEffect: [
  //       { allStocks: true, mul: 0.8 },
  //       { category: "贵金属", mul: 1.15 },
  //     ],
  //     duration: 5,
  //   },
  //   type: "investment",
  // },
  // TODO: 待实现 - 企业债违约潮
  // {
  //   id: "bond_default",
  //   headline: "企业债违约潮！多家房企债券违约",
  //   story: "多家房企债券违约，债市恐慌蔓延。",
  //   effects: {
  //     investmentEffect: [
  //       { industry: "房地产", mul: 0.6 },
  //       { industry: "金融", mul: 0.8 },
  //       { category: "贵金属", mul: 1.1 },
  //     ],
  //     duration: 10,
  //   },
  //   type: "investment",
  // },
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
    {
      newsId: "black_swan",
      delay: 2,
      text: "王大婶压低声音说小区里几个做生意的邻居都在抛东西变现，像是闻到什么风声了。",
      confidence: 60,
    },
    {
      newsId: "mortgage_rate_cut",
      delay: 3,
      text: "王大婶说银行那边有人放风，房贷利率很快要降，让她先别急着提前还贷。",
      confidence: 72,
    },
    {
      newsId: "property_tax_pilot",
      delay: 3,
      text: "王大婶说房东群里吵翻了，好像房产税试点真的要来了，好几个房东在盘算卖房。",
      confidence: 65,
    },
    {
      newsId: "developer_default",
      delay: 2,
      text: "王大婶说隔壁楼盘的承建商半年没发工资了，开发商怕是要出事。",
      confidence: 70,
    },
    {
      newsId: "vacant_housing_survey",
      delay: 2,
      text: "王大婶说社区居委会在统计空置房，不知道是不是要收房税。",
      confidence: 68,
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
    {
      newsId: "city_infrastructure",
      delay: 3,
      text: "李工头说市政那边有批道路翻新和管网改造工程要招标，工地活会多起来。",
      confidence: 76,
    },
    {
      newsId: "developer_default",
      delay: 2,
      text: "李工头压低声音说某大地产商欠了上游一堆材料款，好几个工地已经停了，千万别去那几家干。",
      confidence: 72,
    },
    {
      newsId: "factory_boom",
      delay: 2,
      text: "李工头说工业区那边劳务中介在疯狂招人，好几个厂都开出了加班翻倍的价。",
      confidence: 76,
    },
    {
      newsId: "ev_subsidy",
      delay: 3,
      text: "李工头说电池厂的活最近多了不少，像是国家又要出新能源车补贴政策了。",
      confidence: 68,
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
    {
      newsId: "population_inflow",
      delay: 3,
      text: "张姐说人才市场那边简历和岗位都多了，像是外地来打工的人在增加。",
      confidence: 74,
    },
    {
      newsId: "mortgage_rate_cut",
      delay: 2,
      text: "张姐说银行按揭部的朋友暗示房贷利率快了要降，让她先等等再签合同。",
      confidence: 68,
    },
    {
      newsId: "property_tax_pilot",
      delay: 3,
      text: "张姐说中介群在传房产税试点城市清单，几个大中介已经在做预案了。",
      confidence: 64,
    },
    {
      newsId: "rate_cut",
      delay: 2,
      text: "张姐说银行那边朋友透露上面在吹风降息，信贷可能要松。",
      confidence: 72,
    },
    {
      newsId: "rate_hike",
      delay: 2,
      text: "张姐说同行群在传贷款利率要涨，让她赶紧先办了几笔业务。",
      confidence: 70,
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
    {
      newsId: "geopolitical_crisis",
      delay: 3,
      text: "老周盯着手机新闻皱眉头：'中东一打仗，金属就涨价，废铁怕是也要跟。'",
      confidence: 75,
    },
    {
      newsId: "energy_crisis",
      delay: 2,
      text: "老周说塑料回收价最近波动大，像是能源价格在作怪。",
      confidence: 68,
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
    {
      newsId: "crypto_bull",
      delay: 2,
      text: "小美说室友最近在宿舍炒币赚了点，群里全在聊这一波能走多久。",
      confidence: 70,
    },
    {
      newsId: "crypto_crash",
      delay: 1,
      text: "小美紧张地发消息说币圈突然暴跌，好几个同学爆仓了，今天课都没去上。",
      confidence: 76,
    },
    {
      newsId: "skill_book",
      delay: 2,
      text: "小美说图书馆新进了一批自考教材和考证资料，准备去借来复印一份。",
      confidence: 78,
    },
    {
      newsId: "relaxed_hukou",
      delay: 3,
      text: "小美说她们导员在群里发了落户新政通知，好像外地人落户条件放宽了。",
      confidence: 66,
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
    {
      newsId: "crackdown",
      delay: 1,
      text: "陈师傅说街口几家小吃摊被查了，最近风头紧，摆摊的要小心。",
      confidence: 78,
    },
    {
      newsId: "cigarette_ban",
      delay: 2,
      text: "陈师傅说餐厅里抽烟的客人少了，但生意好像也淡了点，像是有风声说禁烟要加严。",
      confidence: 66,
    },
    {
      newsId: "energy_crisis",
      delay: 2,
      text: "陈师傅抱怨燃气和食用油进货价涨了，食材成本怕是撑不住。",
      confidence: 74,
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
  state.flags._intelReceivedCount = (state.flags._intelReceivedCount || 0) + 1;

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

/** 获取随机新闻事件（根据世界参数加权） */
function getRandomNewsEvent() {
  // 按类型加权：价格35%，工作20%，个人20%，政策10%，投资15%
  var weights = {
    price: 35,
    job: 20,
    personal: 20,
    policy: 10,
    investment: 15,
  };

  // 世界参数反馈环：市场情绪影响新闻类型概率
  if (typeof getMarketMood === "function") {
    var mood = getMarketMood();
    if (mood === "bullish" || mood === "bearish") {
      weights.investment += 10; // 牛/熊市 → 投资类新闻更活跃
      weights.price += 5;
      weights.policy -= 5;
      weights.personal -= 5;
    } else if (mood === "volatile") {
      weights.price += 10; // 震荡期 → 价格变动新闻多
      weights.investment += 5;
      weights.policy -= 3;
    }
  }

  // 保证各类型至少保留最低权重
  for (var _wt in weights) {
    weights[_wt] = Math.max(5, weights[_wt]);
  }

  var total = 0;
  for (var k in weights) total += weights[k];
  var roll = Random.float(0, total);

  for (var type in weights) {
    roll -= weights[type];
    if (roll <= 0) {
      var typeEvents = NEWS_EVENTS.filter(function (e) {
        return e.type === type;
      });
      return Random.fromArray(typeEvents);
    }
  }
  return Random.fromArray(NEWS_EVENTS);
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
    var key = Random.fromArray(skillKeys);
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

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
    // 约定式内联后续：4天后触发金属续涨新闻
    followUp: {
      delay: 4,
      headline: "🔩 大宗商品续涨！贵金属期货多头逼空，钢铁期货涨停",
      effects: {
        investmentEffect: [
          { category: "贵金属", mul: 1.06 },
          { symbols: ["COPPER", "NICKEL"], mul: 1.08 },
        ],
        duration: 3,
      },
    },
    // 无季节限制，全年可能发生
  },
  {
    id: "heatwave",
    headline: "☀️ 高温来袭！瓶装水和饮料需求暴增",
    seasons: ["summer"], // 仅夏季
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
    // 无季节限制，全年可能发生
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
      sectorHeat: { 科技: 0.06 },
      duration: 5,
    },
    type: "job",
    // 无季节限制，全年可能发生
  },
  {
    id: "fruit_glut",
    headline: "🍎 水果大丰收！批发市场价格暴跌",
    seasons: ["autumn"], // 秋季水果丰收
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
    desc: "警方提醒：近期有诈骗团伙在银行附近冒充工作人员，以「高息理财」为名骗取老人存款。",
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
    // 无季节限制，全年可能发生
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
    seasons: ["spring", "summer", "autumn"], // 文化节多在春/夏/秋季
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
    // 无季节限制，全年可能发生
  },
  // park_renovation 已删除 — 引用了不存在的工作（park_cleaning/park_guide/park_flower_vendor）
  // 如需公园相关事件，建议改用 busking 单一工作引用
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
      sectorHeat: { 房地产: 0.08 },
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
    seasons: ["autumn"], // 9月开学
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
    seasons: ["winter"], // 仅冬季
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
      sectorHeat: { 科技: 0.07 },
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
      jobBonus: ["hospital_companion"],
      jobMultiplier: 1.6,
      investmentEffect: [
        { industry: "医药", mul: 1.14 },
        { industry: "消费", mul: 1.03 },
      ],
      sectorHeat: { 医药: 0.08 },
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
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 2,
          );
          // [全系统自洽修复] 域B 修复:st.needs.intelligence→st.player.intelligence（needs系统无intelligence字段）
          StateManager.addMessage("👀 翻了翻书，觉得还行，但先不买。", "info");
        },
      },
    ],
    type: "personal",
  },

  // subsidy 已删除 — 与 training_subsidy (line 107) 重复，保留 training_subsidy（效果更完整）

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
      sectorHeat: { 房地产: -0.07, 金融: -0.03 },
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
      sectorHeat: { 房地产: 0.07, 金融: 0.03 },
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
      sectorHeat: { 科技: -0.04 },
      marketMoodShift: -0.03,
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
      sectorHeat: { 科技: 0.1, 新能源: 0.04 },
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
      sectorHeat: { 金融: 0.05 },
      marketMoodShift: 0.02,
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
      sectorHeat: { 金融: -0.05 },
      marketMoodShift: -0.02,
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
      sectorHeat: { 新能源: 0.06 },
      duration: 6,
    },
    type: "investment",
    followUpId: "energy_crisis_echo",
    followUpDelay: 4,
  },
  // black_swan 已删除 — 与 geopolitical_crisis 效果重叠（市场恐慌+避险资产上涨）
  // black_swan_echo 后续新闻也已删除
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
  // 批次D — 新增新闻（8条）
  // ============================================================
  {
    id: "tech_layoff",
    headline: "📉 科技大厂裁员潮！二手电子产品泛滥，价格暴跌",
    desc: "多家一线互联网公司开启新一轮裁员，大量程序员涌入求职市场。二手电子设备供应激增。",
    effects: {
      priceMod: { electronics: 0.5 },
      investmentEffect: [
        { industry: "科技", mul: 0.88 },
        { symbols: ["ALIM", "TENC", "MEIT", "BYTE"], mul: 0.83 },
        { industry: "消费", mul: 0.96 },
      ],
      sectorHeat: { 科技: -0.07 },
      duration: 7,
    },
    type: "price",
    followUpId: "tech_layoff_echo",
    followUpDelay: 5,
  },
  {
    id: "food_safety",
    headline: "🔬 食品安全事件曝光！外卖订单骤降，菜市场食材需求上升",
    desc: "媒体暗访曝光多家网红外卖店铺后厨卫生问题，市民纷纷转向自己做饭，食材价格小幅上涨。",
    effects: {
      jobPenalty: ["delivery_rider", "street_vending_food", "food_stall"],
      jobMultiplier: 0.6,
      priceMod: { vegetables: 1.3, fruits: 1.15, noodles: 1.1 },
      investmentEffect: [
        { industry: "消费", mul: 0.92 },
        { symbols: ["MEIT"], mul: 0.85 },
      ],
      duration: 5,
    },
    type: "job",
    followUpId: "food_safety_echo",
    followUpDelay: 4,
  },
  {
    id: "e_commerce_festival",
    headline: "📦 电商大促节来袭！物流爆仓，快递骑手日入翻倍",
    desc: "618/双11大促进入高峰期，全城快递量暴增300%。快递站点通宵运转，临时工日薪飙涨。",
    effects: {
      jobBonus: ["delivery_rider", "package_delivery"],
      jobMultiplier: 2.0,
      priceMod: { electronics: 0.8, clothing: 0.75, daily_use: 0.85 },
      investmentEffect: [
        { symbols: ["ALIM", "MEIT", "JD"], mul: 1.15 },
        { industry: "消费", mul: 1.08 },
      ],
      sectorHeat: { 消费: 0.06 },
      duration: 5,
    },
    type: "job",
    seasons: ["summer"],
    followUpId: "e_commerce_echo",
    followUpDelay: 4,
  },
  {
    id: "tourism_revival",
    headline: "✈️ 旅游市场全面复苏！景区爆满，服务业用工荒",
    desc: "长假期间旅游需求井喷式增长，景区周边酒店、餐饮、交通全线紧张，服务业时薪大涨。",
    effects: {
      jobBonus: ["cleaning_service", "hospitality"],
      jobMultiplier: 1.5,
      priceMod: { snacks: 1.4, water: 1.3, beer: 1.3 },
      investmentEffect: [
        { industry: "消费", mul: 1.1 },
        { symbols: ["MEIT", "DIDI"], mul: 1.08 },
      ],
      duration: 7,
    },
    type: "job",
    seasons: ["spring", "autumn"],
  },
  {
    id: "rental_crisis",
    headline: "🏠 租房市场全面紧张！租金飙涨，城中村床位一位难求",
    desc: "随着外来务工人员回流，城市租房需求暴增。城中村房东集体涨价，床位月租上涨三成。",
    effects: {
      investmentEffect: [
        { industry: "房地产", mul: 1.08 },
        { symbols: ["ESTATE"], mul: 1.06 },
        { industry: "消费", mul: 0.94 },
      ],
      duration: 10,
    },
    type: "price",
    followUpId: "rental_crisis_echo",
    followUpDelay: 6,
  },
  {
    id: "second_hand_boom",
    headline: "🔄 二手经济爆发！闲鱼转转交易量翻倍，废品回收价格飙升",
    desc: "年轻一代消费观念转变，二手交易平台活跃度创历史新高。废品回收站收都收不过来。",
    effects: {
      priceMod: { scrap_metal: 1.6, scrap_plastic: 1.4, scrap_paper: 1.3 },
      investmentEffect: [
        { symbols: ["ALIM"], mul: 1.06 },
        { industry: "消费", mul: 1.04 },
      ],
      duration: 6,
    },
    type: "price",
  },
  {
    id: "winter_heating",
    headline: "🔥 寒潮供暖季来临！煤炭天然气需求激增，保暖用品脱销",
    desc: "北方大面积寒潮来袭，供暖需求集中释放。煤炭价格创年内新高，羽绒服、电热毯卖断货。",
    effects: {
      priceMod: { clothing: 1.5, daily_use: 1.2 },
      investmentEffect: [
        { symbols: ["CL", "NG"], mul: 1.25 },
        { category: "贵金属", mul: 1.05 },
      ],
      duration: 5,
    },
    type: "price",
    seasons: ["winter"],
  },
  {
    id: "luxury_boom",
    headline: "💎 高端消费回暖！奢侈品卖场排起长队，二手奢侈品价格水涨船高",
    desc: "经济复苏信号明显，高端消费市场率先反弹。国际奢侈品牌在华销售额同比大涨30%。",
    effects: {
      priceMod: { electronics: 1.15, clothing: 1.2 },
      investmentEffect: [
        { industry: "消费", mul: 1.08 },
        { symbols: ["NVDA"], mul: 1.06 },
        { industry: "科技", mul: 1.04 },
      ],
      duration: 6,
    },
    type: "price",
  },
  {
    id: "scrap_price_surge",
    headline: "♻️ 废品回收价格全线上涨！纸皮金属一天一个价",
    desc: "环保督查趋严加上原材料紧缺，废品站收货价连续上调。收废品的老张说，最近纸皮和废铁特别抢手，一天一个价。",
    effects: {
      priceMod: { scrap_metal: 1.6, scrap_plastic: 1.4 },
      investmentEffect: [
        { category: "贵金属", mul: 1.12 },
        { symbols: ["COPPER", "ALUM"], mul: 1.1 },
      ],
      duration: 6,
    },
    type: "price",
    followUpId: "scrap_price_surge_echo",
    followUpDelay: 5,
  },
  {
    id: "night_market_revival",
    headline: "🌃 夜间经济回暖！夜市摊位招兼职，日结工钱涨了",
    desc: "城市重启夜间经济，夜市、地摊、大排档重新热闹起来。不少摊主贴出招兼职的纸牌，日结工资比上月高了三成。",
    effects: {
      jobMultiplier: 1.25,
      investmentEffect: [{ industry: "消费", mul: 1.06 }],
      duration: 8,
    },
    type: "job",
    seasons: ["spring", "summer", "autumn"],
  },
];

// ============================================================

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
  // black_swan_echo 已删除 — 对应 black_swan 已删除
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
  // 补充缺失的 follow-up 定义
  bank_fraud_echo: {
    headline: "🚨 诈骗案后续：警方抓获犯罪团伙，提醒市民警惕新型理财骗局",
    effects: {
      investmentEffect: [{ industry: "金融", mul: 1.02 }],
      duration: 3,
    },
  },
  training_subsidy_echo: {
    headline: "📚 培训补贴效应持续：职业技能考证热度不减，培训机构报名排队",
    effects: {
      effects: { trainingDiscount: 0.5, duration: 5 },
    },
  },
  // ====== 批次D后续新闻 ======
  tech_layoff_echo: {
    headline: "🔄 裁员潮催生创业潮！前大厂员工纷纷下场创业，共享办公空间爆满",
    effects: {
      jobBonus: ["coding_freelance"],
      jobMultiplier: 1.2,
      investmentEffect: [
        { industry: "科技", mul: 0.96 },
        { symbols: ["WEORK"], mul: 1.15 },
      ],
      duration: 4,
    },
  },
  food_safety_echo: {
    headline: "🧑‍🍳 食品安全整顿收尾！外卖平台推出明厨亮灶计划，合格商家订单回升",
    effects: {
      jobBonus: ["delivery_rider", "food_stall"],
      jobMultiplier: 1.1,
      investmentEffect: [
        { symbols: ["MEIT"], mul: 1.04 },
        { industry: "消费", mul: 1.02 },
      ],
      duration: 3,
    },
  },
  e_commerce_echo: {
    headline: "♻️ 大促过后退换货潮来袭！逆向物流爆单，包装废品回收量大增",
    effects: {
      priceMod: { scrap_paper: 1.3, scrap_plastic: 1.2 },
      investmentEffect: [{ symbols: ["ALIM", "JD"], mul: 0.96 }],
      duration: 3,
    },
  },
  rental_crisis_echo: {
    headline: "📋 住建部约谈多城！租金指导价政策酝酿出台，租房市场降温在即",
    effects: {
      investmentEffect: [
        { industry: "房地产", mul: 0.95 },
        { symbols: ["ESTATE"], mul: 0.95 },
      ],
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
      newsId: "cigarette_ban",
      delay: 2,
      text: "王大婶说小区门口小卖部香烟突然不卖了，听说是要出新的禁烟规定。",
      confidence: 65,
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
  auntie_lin: [
    {
      newsId: "food_safety",
      delay: 1,
      text: "林阿姨说今天菜场来了几拨穿制服的人，查农药残留，怕是又要严打了。",
      confidence: 80,
    },
    {
      newsId: "platform_subsidy_war",
      delay: 2,
      text: "林阿姨说美团优选的人来菜场谈供货价，补贴战要打到菜市场了。",
      confidence: 72,
    },
    {
      newsId: "second_hand_boom",
      delay: 3,
      text: "林阿姨说进口水果批发价松动了些，海运那边好像在恢复。",
      confidence: 68,
    },
  ],
  master_zhao: [
    {
      newsId: "ev_subsidy",
      delay: 2,
      text: "赵师傅说最近修车铺来了几辆新能源车，他都不会修——这行当要变天了。",
      confidence: 76,
    },
    {
      newsId: "crackdown",
      delay: 1,
      text: "赵师傅说隔壁汽修店被查了，没资质乱修新能源车，最近查得严。",
      confidence: 78,
    },
    {
      newsId: "construction_boom",
      delay: 2,
      text: "赵师傅说工地上的工程车最近修理单子翻倍了，基建项目好像都开了。",
      confidence: 72,
    },
  ],
  xiaochen: [
    {
      newsId: "platform_subsidy_war",
      delay: 1,
      text: "小陈说平台又开始撒补贴了，新人注册奖励¥500，但老骑手单价又被压了。",
      confidence: 82,
    },
    {
      newsId: "rain_storm",
      delay: 1,
      text: "小陈说天气预报不准，但经验告诉他风向变了，接下来雨水多、跑单要受罪。",
      confidence: 74,
    },
    {
      newsId: "crackdown",
      delay: 1,
      text: "小陈说昨晚好几个闯红灯的骑手被抓了，交警在路口蹲点，送餐得绕路。",
      confidence: 76,
    },
  ],
  dr_wang: [
    {
      newsId: "flu_surge",
      delay: 0,
      text: "王医生查房时说急诊这两天流感病人翻了两倍，药房连退烧药都开始限购了。",
      confidence: 88,
    },
    {
      newsId: "good_sleep",
      delay: 3,
      text: "王医生听到风声说医保目录要大改，有些常用药要调出自费，有些要限报。",
      confidence: 70,
    },
    {
      newsId: "food_safety",
      delay: 2,
      text: "王医生说卫生局马上要搞餐饮突击检查，听说不少小馆子怕罚款在突击整改。",
      confidence: 74,
    },
  ],
  zhaojie: [
    {
      newsId: "rental_crisis",
      delay: 2,
      text: "赵姐说商业区好几家店在转租，租金降了15%还没人要，实体店越来越难做。",
      confidence: 76,
    },
    {
      newsId: "property_stimulus",
      delay: 3,
      text: "赵姐说她认识的中介说贷款审批松了不少，有人已经批下来了。",
      confidence: 72,
    },
    {
      newsId: "e_commerce_festival",
      delay: 2,
      text: "赵姐说几个做电商的朋友都在备货，平台大促马上要开始了。",
      confidence: 70,
    },
  ],
  xiaoli: [
    {
      newsId: "tech_fair",
      delay: 2,
      text: "小丽刷到同行在科技展直播，流量爆了，说下周也要去蹭热度。",
      confidence: 72,
    },
    {
      newsId: "second_hand_boom",
      delay: 2,
      text: "小丽说最近二手奢侈品在小红书上特别火，她几个姐妹都在做。",
      confidence: 74,
    },
    {
      newsId: "tourism_revival",
      delay: 3,
      text: "小丽说好几个旅游博主这个月接单接到手软，出境游好像确实在恢复。",
      confidence: 68,
    },
  ],
  chen_ge: [
    {
      newsId: "construction_boom",
      delay: 1,
      text: "陈哥说工头们都在抢人，好几个工地同时开工，人手严重不够。",
      confidence: 78,
    },
    {
      newsId: "winter_heating",
      delay: 2,
      text: "陈哥说最近暖气管道维护的活多了，天水暖工日结¥350起。",
      confidence: 74,
    },
    {
      newsId: "urban_renewal_pilot",
      delay: 2,
      text: "陈哥说他待过的几个城中村都有人来量房了，旧改真要在年底前动。",
      confidence: 76,
    },
  ],
  ajie: [
    {
      newsId: "tech_layoff",
      delay: 2,
      text: "阿杰说他几个在大厂的同学收到裁员预警，互联网寒冬又要来了。",
      confidence: 70,
    },
    {
      newsId: "crypto_crash",
      delay: 1,
      text: "阿杰说他的币圈群全在哀嚎，一夜之间爆仓的过半。他说幸好早跑了。",
      confidence: 68,
    },
    {
      newsId: "ai_boom",
      delay: 3,
      text: "阿杰说有个同学转行做AI培训了，三个月赚了以前一年的钱。",
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
    auntie_lin: "林阿姨",
    master_zhao: "赵师傅",
    xiaochen: "小陈",
    dr_wang: "王医生",
    zhaojie: "赵姐",
    xiaoli: "小丽",
    chen_ge: "陈哥",
    ajie: "阿杰",
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
function getRandomNewsEvent(state) {
  // 获取当前季节（用于季节过滤）
  var seasonId = state && state.weather && state.weather.season;

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
        if (e.type !== type) return false;
        // 季节过滤：如果新闻有seasons字段，必须匹配当前季节
        if (seasonId && e.seasons && !e.seasons.includes(seasonId)) {
          return false;
        }
        return true;
      });
      if (typeEvents.length === 0) {
        // 如果该类型在当季没有新闻，回退到所有新闻
        typeEvents = NEWS_EVENTS.filter(function (e) {
          if (seasonId && e.seasons && !e.seasons.includes(seasonId)) {
            return false;
          }
          return true;
        });
      }
      return typeEvents.length > 0 ? Random.fromArray(typeEvents) : null;
    }
  }

  // 兜底：从所有季节匹配的新闻中随机选择
  var allEligible = NEWS_EVENTS.filter(function (e) {
    if (seasonId && e.seasons && !e.seasons.includes(seasonId)) {
      return false;
    }
    return true;
  });
  return allEligible.length > 0
    ? Random.fromArray(allEligible)
    : Random.fromArray(NEWS_EVENTS);
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

  // ── 世界参数联动（新闻→行业热度/市场情绪）────────────────────
  // 新闻是行业热度的主要外部驱动力（见 world_params.js 设计注释）。
  // sectorHeat: { 行业: delta } —— 直接叠加到 _worldParams.sectorHeat
  // marketMoodShift: number —— 情绪偏移（正=乐观/负=悲观），updateMarketMood 重算
  if (effects.sectorHeat || effects.marketMoodShift) {
    var wp = state._worldParams;
    if (!wp && typeof createDefaultWorldParams === "function") {
      wp = createDefaultWorldParams();
      state._worldParams = wp;
    }
    if (wp && wp.sectorHeat && effects.sectorHeat) {
      for (var sectorKey in effects.sectorHeat) {
        if (
          typeof WORLD_SECTORS !== "undefined" &&
          WORLD_SECTORS.indexOf(sectorKey) >= 0
        ) {
          wp.sectorHeat[sectorKey] =
            (wp.sectorHeat[sectorKey] || 1.0) + effects.sectorHeat[sectorKey];
        }
      }
    }
    if (wp && effects.marketMoodShift) {
      wp._newsMoodShift = (wp._newsMoodShift || 0) + effects.marketMoodShift;
    }
  }

  // 级联后续新闻调度（L1→L2）— 支持内联 followUp 对象（v3.99d 约定式自动归类）
  if (!news._isFollowUp) {
    if (news.followUp && typeof news.followUp === "object") {
      // 内联 followUp 对象（约定式）：news.followUp = { delay, headline, effects }
      var delay = news.followUp.delay || 3;
      state.flags._pendingFollowUpNews = state.flags._pendingFollowUpNews || [];
      var fuId = news.id + "_followup";
      var alreadyPending = state.flags._pendingFollowUpNews.some(function (p) {
        return p.id === fuId;
      });
      if (!alreadyPending) {
        state.flags._pendingFollowUpNews.push({
          id: fuId,
          triggerDay: state.player.day + delay,
          followUpData: {
            headline: news.followUp.headline,
            effects: news.followUp.effects,
          },
        });
      }
    } else if (news.followUpId && NEWS_FOLLOWUP[news.followUpId]) {
      // 旧式 followUpId 引用（向后兼容）
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
      // 支持内联 followUpData（约定式）和旧式 NEWS_FOLLOWUP 查找
      var followup = item.followUpData || NEWS_FOLLOWUP[item.id];
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

/** 清除过期新闻效果（v3.65 更新：移除 intro news 回滚机制）
 * v3.65 变更：
 *   - 不再在30天后回滚 intro news 效果（破坏沉浸感）
 *   - intro news 的 worldEffect/investmentEffect 通过 sectorHeat/marketMood 持久影响世界参数
 *   - 这些世界参数会被每日新闻持续修改，自然演变
 *   - intro news 条目本身仍然会在5天后从 activeNews 中过期（作为"播报"消失）
 *   - 但 sectorHeat/marketMood 等世界参数保持累积，不会回滚
 */
function cleanupExpiredNews(state) {
  var today = state.player.day;
  state.activeNews = (state.activeNews || []).filter(function (news) {
    if (news._appliedDay === undefined) news._appliedDay = today;
    var dur = news.effects;
    var durationVal =
      typeof dur === "number" ? dur : (dur && dur.duration) || 5;
    return today - news._appliedDay < durationVal;
  });

  if (state.flags && state.flags._activeIntel) {
    state.flags._activeIntel = state.flags._activeIntel.filter(
      function (intel) {
        return intel.expireDay >= today;
      },
    );
  }
  if (state.flags && state.flags._pendingIntelNews) {
    state.flags._pendingIntelNews = state.flags._pendingIntelNews.filter(
      function (intel) {
        return intel.triggerDay >= today;
      },
    );
  }

  // 线性衰减：每日从 activeNews 重算工作倍率
  // decay = max(0, 1 - elapsed/duration)，新闻第1天100%效果，到期时0%
  state._jobMultipliers = {};
  state._allJobsBonus = 1;
  for (var i = 0; i < state.activeNews.length; i++) {
    var n = state.activeNews[i];
    var eff = n.effects;
    if (!eff || typeof eff !== "object") continue;
    var dur = eff.duration || 5;
    var elapsed = today - (n._appliedDay || today);
    var decay = Math.max(0, 1 - elapsed / dur);
    if (decay <= 0) continue;

    if (eff.jobBonus && eff.jobMultiplier) {
      var bonusMul = 1 + (eff.jobMultiplier - 1) * decay;
      for (var j = 0; j < eff.jobBonus.length; j++) {
        var jid = eff.jobBonus[j];
        state._jobMultipliers[jid] =
          (state._jobMultipliers[jid] || 1) * bonusMul;
      }
    }
    if (eff.jobPenalty && eff.jobMultiplier) {
      var penMul = 1 + (eff.jobMultiplier - 1) * decay;
      for (var k = 0; k < eff.jobPenalty.length; k++) {
        var pid = eff.jobPenalty[k];
        state._jobMultipliers[pid] = (state._jobMultipliers[pid] || 1) * penMul;
      }
    }
    if (eff.allJobsBonus) {
      state._allJobsBonus =
        (state._allJobsBonus || 1) * (1 + (eff.allJobsBonus - 1) * decay);
    }
  }
}

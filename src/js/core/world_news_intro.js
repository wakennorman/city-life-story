/**
 * 世界新闻·开局氛围基调系统 v1.0
 *
 * 设计哲学（参考顶级游戏）：
 *   - Papers Please：每日报纸 3-4 条简短法令/新闻，瞬间建立世界感
 *   - Disco Elysium：开场独白充满世界观，文学性营造沉浸
 *   - 大多数：开局简短的年代背景文字"2001年，工厂开始大量裁员..."
 *   - Frostpunk：政策公告读报感，每条新闻都带压力
 *   - Cultist Simulator：碎片化叙事营造神秘感
 *
 * 核心机制：
 *   1. 根据现实日期（月份/星期）从新闻池智能选取 3-5 条
 *   2. 每条新闻有对应的世界参数影响（sectorHeat/marketMood 等）
 *   3. 营造"你踏上这座城市时，世界正在发生这些事"的沉浸感
 *   4. 支持 7 个剧本的差异化背景描述
 *   5. 离线完全可玩（全本地化，无网络依赖）
 */

// ============================================================
//  一、时代背景新闻数据库（按月份 + 主题分类）
//  背景设定：2024-2026年中国城市现实
// ============================================================

const WORLD_NEWS_DB = {
  // ======== 经济/就业 ========
  employment: [
    {
      id: "emp_grad_pressure",
      months: [3, 4, 5, 6, 7],
      icon: "🎓",
      tag: "就业",
      headline: "全国高校毕业生再破历史新高，就业压力延续",
      detail: "招聘季竞争白热化，技能证书和实习经历成为关键筹码。",
      worldEffect: {
        sectorHeat: { 科技: -0.05, 消费: 0.03 },
        marketMood: "bearish",
        note: "就业压力大，IT/金融岗位竞争激烈",
      },
      investmentEffect: [
        { industry: "科技", mul: 0.95 },
        { industry: "消费", mul: 0.97 },
      ],
      scenarioTags: ["fresh_grad", "small_town_grinder"],
    },
    {
      id: "emp_layoff_wave",
      months: [1, 2, 10, 11, 12],
      icon: "📉",
      tag: "就业",
      headline: "互联网大厂新一轮「优化」，裁员比例5%-15%",
      detail: "AI工具替代重复性岗位，高级研发和产品经理需求反增。",
      worldEffect: {
        sectorHeat: { 科技: -0.08 },
        marketMood: "bearish",
        note: "IT行业普通岗位薪资承压",
      },
      investmentEffect: [
        { industry: "科技", mul: 0.85 },
        { symbols: ["BABA", "TCEHY"], mul: 0.9 },
      ],
      scenarioTags: ["laid_off", "midlife_crisis"],
    },
    {
      id: "emp_blue_collar_rise",
      months: [3, 4, 9, 10],
      icon: "🔧",
      tag: "就业",
      headline: "新能源工厂用工荒！技工月薪突破1.2万",
      detail: "新能源产业链爆发，焊工、电工、数控等技工需求激增。",
      worldEffect: {
        sectorHeat: { 新能源: 0.12, 科技: 0.05 },
        marketMood: "bullish",
        note: "制造业/蓝领岗位收入提升",
      },
      investmentEffect: [
        { industry: "新能源", mul: 1.18 },
        { industry: "科技", mul: 1.05 },
      ],
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "emp_gig_economy",
      months: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12],
      icon: "🛵",
      tag: "就业",
      headline: "灵活就业人数破2亿，外卖骑手月均收入7800元",
      detail: "平台经济为「夹缝中的人」提供托底，但缺乏社保保障。",
      worldEffect: {
        sectorHeat: { 消费: 0.08 },
        marketMood: "neutral",
        note: "跑腿/外卖/零工收入稳定",
      },
      investmentEffect: [
        { industry: "消费", mul: 1.06 },
        { symbols: ["BABA", "TCEHY"], mul: 0.95 },
      ],
      scenarioTags: ["classic", "foreign_worker", "laid_off"],
    },
    {
      id: "emp_county_civil",
      months: [2, 3, 8, 9, 10],
      icon: "🏛️",
      tag: "就业",
      headline: "国考报名再破300万，「上岸」成年轻人首选",
      detail: "就业焦虑推动公务员热，县城编制竞争比高达300:1。",
      worldEffect: {
        sectorHeat: { 科技: -0.03, 金融: -0.02 },
        marketMood: "neutral",
        note: "稳定岗位溢价，创业/私企吸引力下滑",
      },
      investmentEffect: [
        { industry: "科技", mul: 0.95 },
        { industry: "金融", mul: 0.92 },
      ],
      scenarioTags: ["small_town_grinder", "fresh_grad"],
    },
    {
      id: "emp_ai_replace",
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      icon: "🤖",
      tag: "科技",
      headline: "AI大模型加速落地，客服/翻译/设计岗位首当其冲",
      detail: "会用AI是加分项，被AI替代是警报。掌握工具者吃肉，不进步者喝汤。",
      worldEffect: {
        sectorHeat: { 科技: 0.1 },
        marketMood: "volatile",
        note: "AI赋能岗位收入+15%，传统基础岗位薪资承压",
        jobBonus: [
          { id: "coding_freelance", mul: 1.15 },
          { id: "data_entry", mul: 0.9 }, // AI替代型岗位收入下降
        ],
        skillXp: { coding: 5, logic: 3 },
      },
      investmentEffect: [
        { industry: "科技", mul: 1.15 },
        { symbols: ["NVDA", "AMD"], mul: 1.2 },
      ],
      scenarioTags: ["classic", "laid_off", "midlife_crisis"],
    },
    {
      id: "emp_finance_hiring",
      months: [2, 3, 4, 8, 9, 10],
      icon: "🏦",
      tag: "就业",
      headline: "券商基金逆势扩招！投研、量化、风控岗位年薪百万抢人",
      detail:
        "虽然市场整体低迷，但头部金融机构为下一轮行情提前储备人才，CFA/FRM持证者优先。",
      worldEffect: {
        sectorHeat: { 金融: 0.1, 科技: 0.04 },
        marketMood: "bullish",
        note: "金融/投资岗位薪资走高，财会/金融类证书价值提升",
        jobBonus: [
          { id: "accounting", mul: 1.12 },
          { id: "financial_advisor", mul: 1.15 },
        ],
      },
      investmentEffect: [
        { industry: "金融", mul: 1.1 },
        { allStocks: true, mul: 1.03 },
      ],
      scenarioTags: ["fresh_grad", "second_gen"],
    },
    {
      id: "emp_logistics_recruit",
      months: [6, 7, 10, 11, 12],
      icon: "🚚",
      tag: "就业",
      headline: "快递物流旺季用工缺口80万，临时工日薪突破400元",
      detail: "双十一+年货节电商旺季到来，仓储分拣、快递配送、装卸工需求暴增。",
      worldEffect: {
        sectorHeat: { 消费: 0.08 },
        marketMood: "bullish",
        note: "物流/零工旺季收入可观，强度大但门槛低",
      },
      investmentEffect: [
        { industry: "消费", mul: 1.06 },
        { symbols: ["BABA"], mul: 1.04 },
      ],
      scenarioTags: ["classic", "foreign_worker", "laid_off"],
    },
    {
      id: "emp_healthcare_demand",
      months: [1, 3, 5, 7, 9, 11],
      icon: "🏥",
      tag: "就业",
      headline: "医疗健康行业人才缺口持续扩大，护理/康复/医技岗位供不应求",
      detail:
        "人口老龄化+基层医疗建设催生百万级岗位需求，护士、康复师起薪连年上涨。",
      worldEffect: {
        sectorHeat: { 医药: 0.1, 消费: 0.03 },
        marketMood: "bullish",
        note: "医疗/护理/养老行业就业机会增加，薪资稳步上涨",
      },
      investmentEffect: [
        { industry: "医药", mul: 1.1 },
        { industry: "消费", mul: 1.04 },
      ],
      scenarioTags: ["classic", "small_town_grinder", "laid_off"],
    },
  ],

  // ======== 经济/市场 ========
  economy: [
    {
      id: "eco_consumption_boost",
      months: [1, 5, 10, 11],
      icon: "🛒",
      tag: "消费",
      headline: "以旧换新政策落地，家电汽车消费旺季来袭",
      detail: "政府补贴刺激内需，家电、新能源车、手机换机潮并起。",
      worldEffect: {
        sectorHeat: { 消费: 0.1, 新能源: 0.08 },
        marketMood: "bullish",
        note: "消费行业景气，零售/服务收入有提升",
      },
      investmentEffect: [
        { industry: "消费", mul: 1.12 },
        { industry: "新能源", mul: 1.1 },
      ],
      scenarioTags: ["classic", "second_gen"],
    },
    {
      id: "eco_deflation_worry",
      months: [2, 3, 6, 7, 8, 9],
      icon: "💹",
      tag: "经济",
      headline: "CPI连续走低，通缩担忧引发价格战全面升级",
      detail: "商品降价对消费者是好事，但对小商贩和工厂利润冲击明显。",
      worldEffect: {
        sectorHeat: { 消费: -0.06, 金融: -0.04 },
        marketMood: "bearish",
        note: "物价下行，街头摊位/商品利润空间收窄",
      },
      investmentEffect: [
        { industry: "消费", mul: 0.9 },
        { industry: "金融", mul: 0.92 },
        { allStocks: true, mul: 0.95 },
      ],
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "eco_stock_bull",
      months: [3, 4, 9, 10, 11],
      icon: "📈",
      tag: "市场",
      headline: "A股政策利好频出，沪指单月涨幅超8%",
      detail: "险资入市、汇金增持，市场情绪由悲转喜，散户纷纷入场。",
      worldEffect: {
        sectorHeat: { 金融: 0.12, 科技: 0.08 },
        marketMood: "bullish",
        note: "股市投资机会，但风险同增",
      },
      investmentEffect: [
        { allStocks: true, mul: 1.08 },
        { industry: "金融", mul: 1.15 },
        { industry: "科技", mul: 1.1 },
      ],
      scenarioTags: ["second_gen", "midlife_crisis"],
    },
    {
      id: "eco_new_energy_export",
      months: [4, 5, 6, 7, 8],
      icon: "⚡",
      tag: "产业",
      headline: "中国新能源车出口创新高，全球份额超35%",
      detail: "比亚迪、奇瑞等品牌出海，带动整条产业链高景气。",
      worldEffect: {
        sectorHeat: { 新能源: 0.15, 科技: 0.06 },
        marketMood: "bullish",
        note: "新能源/制造业岗位需求旺盛",
      },
      investmentEffect: [
        { industry: "新能源", mul: 1.22 },
        { industry: "科技", mul: 1.08 },
      ],
      scenarioTags: ["classic", "second_gen"],
    },
    {
      id: "eco_small_biz_hard",
      months: [2, 3, 7, 8, 9],
      icon: "🏪",
      tag: "经济",
      headline: "小微企业生存调查：三成个体户营收不及去年七成",
      detail: "房租、人工成本居高，平台抽成压缩，街边小店关门潮蔓延。",
      worldEffect: {
        sectorHeat: { 消费: -0.08 },
        marketMood: "bearish",
        note: "实体店生意艰难，摆摊/外卖等低门槛谋生更重要",
      },
      investmentEffect: [
        { industry: "消费", mul: 0.88 },
        { industry: "金融", mul: 0.95 },
      ],
      scenarioTags: ["classic", "foreign_worker", "laid_off"],
    },
    {
      id: "eco_interest_cut",
      months: [1, 2, 6, 7, 10, 11],
      icon: "🏦",
      tag: "金融",
      headline: "央行再度降准降息，释放万亿流动性",
      detail: "贷款利率历史低位，购房、创业融资成本下行，储蓄收益缩水。",
      worldEffect: {
        sectorHeat: { 房地产: 0.08, 金融: -0.04 },
        marketMood: "bullish",
        note: "贷款/创业启动成本降低，存款收益下滑",
      },
      investmentEffect: [
        { industry: "房地产", mul: 1.12 },
        { industry: "金融", mul: 0.92 },
        { symbols: ["BTC"], mul: 1.1 },
      ],
      scenarioTags: ["second_gen", "midlife_crisis", "classic"],
    },
    {
      id: "eco_export_surge",
      months: [2, 3, 4, 5, 9, 10, 11],
      icon: "🚢",
      tag: "经济",
      headline: "出口订单激增！外贸企业产能拉满，海运价格再度攀升",
      detail:
        "海外库存回补叠加汇率优势，纺织、机械、电子出口全线回暖，外贸跟单员成抢手人才。",
      worldEffect: {
        sectorHeat: { 科技: 0.06, 新能源: 0.08, 消费: 0.05 },
        marketMood: "bullish",
        note: "外贸/物流/制造岗位需求上升，海运成本上涨传导至商品价格",
      },
      investmentEffect: [
        { industry: "科技", mul: 1.06 },
        { industry: "新能源", mul: 1.1 },
        { allStocks: true, mul: 1.03 },
      ],
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "eco_investment_cold",
      months: [1, 2, 6, 7, 8, 12],
      icon: "🧊",
      tag: "金融",
      headline: "一级市场募资寒冬：VC/PE出资额同比腰斩，创业公司艰难求生",
      detail:
        "LP出资意愿降至冰点，估值回调成为主旋律，烧钱模式彻底终结，盈利成为唯一标准。",
      worldEffect: {
        sectorHeat: { 科技: -0.08, 金融: -0.06 },
        marketMood: "bearish",
        note: "创业融资难度加大，但自带现金流的传统行业反而受青睐",
      },
      investmentEffect: [
        { industry: "科技", mul: 0.85 },
        { industry: "金融", mul: 0.9 },
      ],
      scenarioTags: ["second_gen", "classic"],
    },
    {
      id: "eco_consumption_downgrade",
      months: [2, 3, 4, 7, 8, 9],
      icon: "🥬",
      tag: "消费",
      headline: "消费降级趋势深化：「平替经济学」席卷年轻消费者",
      detail:
        "白牌商品、社区团购、二手交易平台流量暴增，消费者从「买贵的」转向「买对的」。",
      worldEffect: {
        sectorHeat: { 消费: 0.06 },
        marketMood: "bearish",
        note: "平价商品/二手交易有利可图，高端消费承压",
      },
      investmentEffect: [
        { industry: "消费", mul: 0.92 },
        { symbols: ["BABA", "TCEHY"], mul: 0.96 },
      ],
      scenarioTags: ["classic", "laid_off", "fresh_grad"],
    },
    {
      id: "eco_bond_yield",
      months: [3, 4, 5, 6, 9, 10],
      icon: "📜",
      tag: "金融",
      headline: "国债收益率持续走低，储蓄国债受追捧，「资产荒」蔓延",
      detail:
        "安全资产稀缺推动债市走牛，银行存款利率下调引发储蓄搬家，理财市场格局重塑。",
      worldEffect: {
        sectorHeat: { 金融: 0.07 },
        marketMood: "neutral",
        note: "银行存款收益降低，理财/基金产品吸引力上升",
      },
      investmentEffect: [
        { industry: "金融", mul: 1.05 },
        { allStocks: true, mul: 1.02 },
      ],
      scenarioTags: ["midlife_crisis", "second_gen", "classic"],
    },
    {
      id: "eco_real_estate_debt",
      months: [1, 3, 6, 7, 8, 11, 12],
      icon: "🏚️",
      tag: "金融",
      headline: "房企债务重组进程加速，银行不良率承压但系统性风险可控",
      detail:
        "头部房企化债方案陆续落地，银行股估值承压，但地方政府纾困基金托底预期明确。",
      worldEffect: {
        sectorHeat: { 房地产: -0.06, 金融: -0.04 },
        marketMood: "bearish",
        note: "地产相关投资风险上升，银行股面临回调压力",
      },
      investmentEffect: [
        { industry: "房地产", mul: 0.82 },
        { industry: "金融", mul: 0.9 },
      ],
      scenarioTags: ["classic", "midlife_crisis"],
    },
    {
      id: "eco_gold_rally",
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      icon: "🥇",
      tag: "市场",
      headline: "金价再创历史新高！全球央行持续增持黄金储备",
      detail:
        "地缘政治不确定性+去美元化趋势下，黄金成为最热门的避险资产，金店回收价同步飙升。",
      worldEffect: {
        sectorHeat: { 消费: 0.04, 金融: 0.06 },
        marketMood: "bullish",
        note: "黄金饰品/投资金条价格上涨，典当行回收价水涨船高",
      },
      investmentEffect: [
        { industry: "金融", mul: 1.06 },
        { symbols: ["BTC"], mul: 1.08 },
      ],
      scenarioTags: ["classic", "second_gen", "midlife_crisis"],
    },
    {
      id: "eco_logistics_boom",
      months: [3, 4, 5, 6, 9, 10, 11, 12],
      icon: "📦",
      tag: "产业",
      headline: "物流行业竞争白热化：顺丰京东入局下沉市场，运费价格战再起",
      detail:
        "快递单价跌破2元大关，末端网点利润微薄，快递员每票派送费降至0.7元。",
      worldEffect: {
        sectorHeat: { 消费: 0.06 },
        marketMood: "bearish",
        note: "物流/快递岗位工作量大但单价降，做得多不一定赚得多",
      },
      investmentEffect: [
        { industry: "消费", mul: 0.94 },
        { symbols: ["BABA"], mul: 0.92 },
      ],
      scenarioTags: ["classic", "foreign_worker", "laid_off"],
    },
    {
      id: "eco_semiconductor_cycle",
      months: [2, 4, 6, 8, 10, 12],
      icon: "💾",
      tag: "科技",
      headline: "全球半导体进入上行周期，存储芯片价格连续三个季度上涨",
      detail:
        "AI算力需求+消费电子回暖推动芯片需求复苏，国产替代进程加速，晶圆厂扩产招工。",
      worldEffect: {
        sectorHeat: { 科技: 0.12, 新能源: 0.05 },
        marketMood: "bullish",
        note: "芯片/半导体相关岗位薪资上涨，科技股行情看好",
      },
      investmentEffect: [
        { industry: "科技", mul: 1.15 },
        { symbols: ["NVDA", "AMD"], mul: 1.18 },
        { allStocks: true, mul: 1.04 },
      ],
      scenarioTags: ["classic", "second_gen"],
    },
  ],

  // ======== 房产/城市 ========
  housing: [
    {
      id: "house_price_down",
      months: [1, 2, 3, 7, 8, 9, 10, 11, 12],
      icon: "🏘️",
      tag: "房产",
      headline: "70城二手房价格连续下调，核心区亦现松动",
      detail: "购房门槛下移是机遇，但观望情绪让成交低迷，房东急于出手。",
      worldEffect: {
        sectorHeat: { 房地产: -0.1 },
        marketMood: "bearish",
        note: "租房成本相对稳定，购房可以议价",
      },
      investmentEffect: [
        { industry: "房地产", mul: 0.85 },
        { industry: "金融", mul: 0.92 },
      ],
      scenarioTags: ["classic", "midlife_crisis"],
    },
    {
      id: "house_keep_building",
      months: [3, 4, 5, 6, 9, 10],
      icon: "🏗️",
      tag: "房产",
      headline: "「保交楼」专项债落地，数十万套烂尾楼有望复工",
      detail: "购房者终于等来曙光，但施工队、钢材商迎来新一波需求。",
      worldEffect: {
        sectorHeat: { 房地产: 0.06, 新能源: 0.03 },
        marketMood: "neutral",
        note: "工程类工作需求上涨，房产市场预期回暖",
      },
      investmentEffect: [
        { industry: "房地产", mul: 1.08 },
        { symbols: ["COPPER"], mul: 1.1 },
      ],
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "house_city_renewal",
      months: [4, 5, 6, 7, 8, 9],
      icon: "🏙️",
      tag: "城市",
      headline: "城中村改造提速，城市核心区拆迁赔偿引争议",
      detail: "被纳入改造范围的居民喜忧参半：赔偿金丰厚，但去哪里住成难题。",
      worldEffect: {
        sectorHeat: { 房地产: 0.05 },
        marketMood: "volatile",
        note: "城中村附近租金上涨，部分地段居民被迫迁移",
      },
      investmentEffect: [{ industry: "房地产", mul: 1.06 }],
      scenarioTags: ["classic", "foreign_worker", "laid_off"],
    },
    {
      id: "house_rent_stable",
      months: [1, 2, 3, 6, 7, 8],
      icon: "🔑",
      tag: "租房",
      headline: "长租公寓扩张放缓，个人房东直租回归主流",
      detail: "中介费竞争加剧，租金议价空间扩大，押一付一渐成标准。",
      worldEffect: {
        sectorHeat: { 消费: 0.02 },
        marketMood: "neutral",
        note: "租房支出压力略减，村子/城郊租金更实惠",
      },
      scenarioTags: ["classic", "foreign_worker", "fresh_grad"],
    },
  ],

  // ======== 科技/AI ========
  tech: [
    {
      id: "tech_deepseek",
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      icon: "🧠",
      tag: "科技",
      headline: "DeepSeek等国产大模型震撼全球，AI能力追平甚至超越国际对手",
      detail: "中国AI自立能力浮现，芯片封锁效果打折，技术人才身价暴涨。",
      worldEffect: {
        sectorHeat: { 科技: 0.15 },
        marketMood: "bullish",
        note: "AI/科技相关岗位薪资+10-20%",
      },
      investmentEffect: [
        { industry: "科技", mul: 1.18 },
        { symbols: ["NVDA", "AMD"], mul: 1.25 },
      ],
      scenarioTags: ["classic", "second_gen", "fresh_grad"],
    },
    {
      id: "tech_robot_factory",
      months: [3, 4, 5, 9, 10, 11],
      icon: "🤖",
      tag: "科技",
      headline: "人形机器人量产进入倒计时，多地工厂启动试点",
      detail: "效率革命来临，但流水线工人的未来令人担忧，技能升级迫在眉睫。",
      worldEffect: {
        sectorHeat: { 科技: 0.12, 新能源: 0.08 },
        marketMood: "volatile",
        note: "高端制造/编程岗位热，普工岗位长期承压",
      },
      investmentEffect: [
        { industry: "科技", mul: 1.15 },
        { industry: "新能源", mul: 1.1 },
      ],
      scenarioTags: ["classic", "laid_off", "foreign_worker"],
    },
    {
      id: "tech_chip_breakthrough",
      months: [6, 7, 8, 9, 10],
      icon: "💿",
      tag: "科技",
      headline: "国产芯片制造工艺取得突破，7nm量产在望",
      detail: "「卡脖子」环节逐步松动，半导体全链条人才缺口巨大。",
      worldEffect: {
        sectorHeat: { 科技: 0.18 },
        marketMood: "bullish",
        note: "芯片/半导体相关岗位薪资水涨船高",
      },
      investmentEffect: [
        { industry: "科技", mul: 1.22 },
        { symbols: ["NVDA", "AMD"], mul: 1.3 },
      ],
      scenarioTags: ["classic", "second_gen"],
    },
    {
      id: "tech_live_streaming",
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      icon: "📱",
      tag: "新媒体",
      headline: "短视频直播经济规模破3万亿，主播已成新兴职业",
      detail: "流量变现已经有成熟路径，但头部垄断效应强，99%的人在内卷底层。",
      worldEffect: {
        sectorHeat: { 消费: 0.08, 科技: 0.05 },
        marketMood: "neutral",
        note: "社交网络/直播副业收入可观，但竞争激烈",
      },
      investmentEffect: [
        { industry: "消费", mul: 1.08 },
        { industry: "科技", mul: 1.04 },
      ],
      scenarioTags: ["classic", "fresh_grad", "second_gen"],
    },
  ],

  // ======== 社会/民生 ========
  social: [
    {
      id: "soc_birth_rate_low",
      months: [1, 2, 3, 10, 11, 12],
      icon: "👶",
      tag: "社会",
      headline: "出生率连续下降，养老金收支压力引发广泛讨论",
      detail: "少子老龄化加速，年轻人「躺平」背后是现实的重压。",
      worldEffect: {
        sectorHeat: { 医药: 0.08, 消费: -0.03 },
        marketMood: "bearish",
        note: "老龄产业/医疗岗位需求增，年轻消费市场收缩",
      },
      scenarioTags: ["midlife_crisis", "classic"],
    },
    {
      id: "soc_mental_health",
      months: [3, 4, 5, 6, 9, 10, 11],
      icon: "🧠",
      tag: "社会",
      headline: "职场心理健康报告：三成员工存在中高度焦虑",
      detail: "「35岁危机」「内卷」「躺平」成社会情绪主轴，心理咨询需求暴增。",
      worldEffect: {
        sectorHeat: { 医药: 0.06 },
        marketMood: "bearish",
        note: "心理健康相关行业兴起，职场压力影响生产力",
      },
      scenarioTags: ["midlife_crisis", "laid_off", "small_town_grinder"],
    },
    {
      id: "soc_new_poor",
      months: [2, 3, 6, 7, 8, 9],
      icon: "💸",
      tag: "社会",
      headline: "「新贫困陷阱」：月入过万却存不下钱的城市中产",
      detail: "房贷、娃的教育、父母赡养三座大山同压，中产悄悄滑向脆弱层。",
      worldEffect: {
        sectorHeat: { 消费: -0.05, 金融: -0.04 },
        marketMood: "bearish",
        note: "消费降级，精打细算成为城市生存主旋律",
      },
      scenarioTags: ["midlife_crisis", "second_gen"],
    },
    {
      id: "soc_village_youth",
      months: [1, 2, 6, 7, 8, 9, 10],
      icon: "🚂",
      tag: "社会",
      headline: "逆城市化初现：部分年轻人返乡创业，县城经济重启",
      detail: "「小镇做题家」的逆流者选择回头，但机会仍少于城市。",
      worldEffect: {
        sectorHeat: { 消费: 0.03 },
        marketMood: "neutral",
        note: "小镇/县城房价低、压力小，但上升通道窄",
      },
      scenarioTags: ["small_town_grinder", "classic"],
    },
    {
      id: "soc_silver_economy",
      months: [3, 4, 9, 10, 11],
      icon: "👴",
      tag: "社会",
      headline: "银发经济万亿赛道爆发，老年护理人才严重短缺",
      detail: "护工、老年康复师、上门服务成高需求蓝海，薪资超越白领。",
      worldEffect: {
        sectorHeat: { 医药: 0.1, 消费: 0.05 },
        marketMood: "bullish",
        note: "养老/医疗服务行业机会多，报酬不低",
      },
      investmentEffect: [
        { industry: "医药", mul: 1.12 },
        { industry: "消费", mul: 1.05 },
      ],
      scenarioTags: ["classic", "midlife_crisis", "foreign_worker"],
    },
    {
      id: "soc_education_reform",
      months: [4, 5, 6, 7, 8, 9],
      icon: "📚",
      tag: "教育",
      headline: "职业教育扶持力度加大，「工匠精神」重新被提倡",
      detail: "技能型人才补贴增加，职校毕业生就业率高于部分本科专业。",
      worldEffect: {
        sectorHeat: { 科技: 0.04, 新能源: 0.06 },
        marketMood: "neutral",
        note: "技能证书和职业技术的价值提升",
      },
      investmentEffect: [
        { industry: "科技", mul: 1.05 },
        { industry: "新能源", mul: 1.06 },
      ],
      scenarioTags: ["small_town_grinder", "foreign_worker", "classic"],
    },
  ],

  // ======== 政策/国际 ========
  policy: [
    {
      id: "pol_trade_war",
      months: [4, 5, 6, 7, 8, 9],
      icon: "🌏",
      tag: "国际",
      headline: "中美贸易摩擦持续，关税壁垒波及多个出口行业",
      detail: "出口企业压力剧增，但也倒逼产业链加速国内升级替代。",
      worldEffect: {
        sectorHeat: { 科技: -0.07, 新能源: 0.05 },
        marketMood: "volatile",
        note: "外贸相关岗位受冲击，内循环消费机会反增",
      },
      investmentEffect: [
        { industry: "科技", mul: 0.85 },
        { industry: "新能源", mul: 1.08 },
        { allStocks: true, mul: 0.92 },
      ],
      scenarioTags: ["classic", "second_gen"],
    },
    {
      id: "pol_platform_regulate",
      months: [3, 4, 5, 8, 9, 10],
      icon: "📋",
      tag: "政策",
      headline: "平台经济强监管持续，算法透明化和骑手权益保护落地",
      detail: "外卖、滴滴、主播等平台用工者待遇改善，但平台利润受压。",
      worldEffect: {
        sectorHeat: { 消费: 0.05, 科技: -0.04 },
        marketMood: "neutral",
        note: "外卖/跑腿/平台零工收入略有改善",
      },
      investmentEffect: [
        { industry: "科技", mul: 0.88 },
        { symbols: ["BABA", "TCEHY"], mul: 0.85 },
        { industry: "消费", mul: 1.06 },
      ],
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "pol_rural_revive",
      months: [2, 3, 4, 5, 9, 10],
      icon: "🌾",
      tag: "政策",
      headline: "乡村振兴专项基金到位，农村产业创业补贴最高达20万",
      detail: "回乡创业、农业科技改造获政策支持，但落地执行参差不齐。",
      worldEffect: {
        sectorHeat: { 消费: 0.04 },
        marketMood: "neutral",
        note: "小镇/乡镇创业门槛降低，补贴可观",
      },
      investmentEffect: [{ industry: "消费", mul: 1.05 }],
      scenarioTags: ["small_town_grinder", "laid_off"],
    },
    {
      id: "pol_digital_rmb",
      months: [1, 2, 6, 7, 11, 12],
      icon: "💰",
      tag: "金融",
      headline: "数字人民币试点城市扩展至50+，消费红包刺激效果显著",
      detail: "活动期间消费券使用率超预期，线下小商户获益明显。",
      worldEffect: {
        sectorHeat: { 消费: 0.07, 金融: 0.04 },
        marketMood: "bullish",
        note: "消费补贴期间实体经营收入有提升",
      },
      investmentEffect: [
        { industry: "消费", mul: 1.08 },
        { industry: "金融", mul: 1.06 },
        { allStocks: true, mul: 1.03 },
      ],
      scenarioTags: ["classic", "foreign_worker", "laid_off"],
    },
    {
      id: "pol_anti_996",
      months: [3, 4, 5, 6, 7, 8, 9, 10],
      icon: "⏰",
      tag: "劳工",
      headline: "劳动法执法趋严，多家大厂因加班违规被罚款",
      detail:
        "「打工人」权益意识抬升，但执法力度仍待观察，自我保护意识更重要。",
      worldEffect: {
        sectorHeat: { 科技: -0.03 },
        marketMood: "neutral",
        note: "职场权益保护增强，但短期内裁员阻力更大",
      },
      investmentEffect: [{ industry: "科技", mul: 0.92 }],
      scenarioTags: ["midlife_crisis", "laid_off"],
    },
  ],

  // ======== 季节性事件 ========
  seasonal: [
    {
      id: "sea_spring_festival",
      months: [1, 2],
      icon: "🧧",
      tag: "节日",
      headline: "春节消费旺季：返乡客流创历史峰值，零售业迎来黄金周",
      detail: "餐饮、礼品、出行全面爆发，一年中最能赚到钱的两周。",
      worldEffect: {
        sectorHeat: { 消费: 0.18, 科技: -0.05 },
        marketMood: "bullish",
        note: "春节黄金期！摆摊/餐饮/服务收入高峰",
      },
      investmentEffect: [
        { industry: "消费", mul: 1.2 },
        { allStocks: true, mul: 1.05 },
      ],
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "sea_golden_week_618",
      months: [6],
      icon: "🛍️",
      tag: "节日",
      headline: "618年中大促破纪录，直播间带货单日成交超3000亿",
      detail: "主播、仓储、物流全面动员，电商淡季过后迎来消费狂欢。",
      worldEffect: {
        sectorHeat: { 消费: 0.12, 科技: 0.06 },
        marketMood: "bullish",
        note: "618期间电商/物流/零工收入有额外奖励",
      },
      investmentEffect: [
        { industry: "消费", mul: 1.15 },
        { industry: "科技", mul: 1.06 },
      ],
      scenarioTags: ["classic", "second_gen", "fresh_grad"],
    },
    {
      id: "sea_graduation",
      months: [6, 7],
      icon: "🎓",
      tag: "毕业",
      headline: "毕业季来临！应届生大量涌入城市，租房市场骤然承压",
      detail: "简历洪流涌入招聘市场，但实习和应届的差距已经打开。",
      worldEffect: {
        sectorHeat: { 科技: -0.04, 消费: 0.04 },
        marketMood: "neutral",
        note: "应届生竞争激烈，租房需求拉升城区租金",
      },
      investmentEffect: [
        { industry: "房地产", mul: 0.95 },
        { industry: "科技", mul: 0.94 },
      ],
      scenarioTags: ["fresh_grad", "small_town_grinder"],
    },
    {
      id: "sea_double_11",
      months: [11],
      icon: "🛒",
      tag: "节日",
      headline: "双十一提前开门！物流业全员上阵，快递峰值破60亿单",
      detail:
        "全年最大消费节，物流、仓储、客服爆发式用工，计件工人单月收入翻倍。",
      worldEffect: {
        sectorHeat: { 消费: 0.2, 科技: 0.05 },
        marketMood: "bullish",
        note: "双十一期间物流/零工收入激增！",
      },
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "sea_new_year_job",
      months: [3, 4],
      icon: "🌸",
      tag: "招聘",
      headline: "金三银四招聘旺季开启！企业发力抢人，薪资谈判空间扩大",
      detail: "跳槽窗口期来临，有经验的打工人此时谈薪最有底气。",
      worldEffect: {
        sectorHeat: { 科技: 0.06, 金融: 0.05 },
        marketMood: "bullish",
        note: "招聘旺季，跳槽和求职成功率更高",
      },
      scenarioTags: ["classic", "laid_off", "midlife_crisis"],
    },
    {
      id: "sea_summer_heat",
      months: [7, 8],
      icon: "☀️",
      tag: "天气",
      headline: "极端高温天气持续！多地气温突破40℃，户外作业受限",
      detail: "室内工作成为抢手岗位，外卖和建筑工人收入挂高温补贴。",
      worldEffect: {
        sectorHeat: { 消费: 0.07, 新能源: 0.05 },
        marketMood: "neutral",
        note: "高温季节体力劳动收入有高温补贴，但消耗大",
      },
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "sea_autumn_harvest",
      months: [9, 10],
      icon: "🍂",
      tag: "季节",
      headline: "金秋消费旺季到来，国庆黄金周旅游、消费双旺",
      detail: "国庆+中秋双节叠加，景区爆满，线下消费加速复苏。",
      worldEffect: {
        sectorHeat: { 消费: 0.14 },
        marketMood: "bullish",
        note: "国庆旺季！餐饮/旅游/服务类收入高峰",
      },
      scenarioTags: ["classic", "second_gen", "foreign_worker"],
    },
    {
      id: "sea_winter_cold",
      months: [12, 1],
      icon: "❄️",
      tag: "冬季",
      headline: "寒潮来袭！南方多城市气温创10年最低，采暖需求爆发",
      detail: "能源需求激增、快递配送减速，但冬季保暖品价格上涨是商机。",
      worldEffect: {
        sectorHeat: { 新能源: 0.08, 消费: 0.05 },
        marketMood: "neutral",
        note: "冬季保暖品需求旺盛，户外劳动收入受天气影响",
      },
      scenarioTags: ["classic", "foreign_worker"],
    },
  ],
};

// ============================================================
//  六、实时新闻抓取系统 v2.0（2026-07-03 新增）
//  设计目标：开局时从互联网抓取当日真实新闻，营造"此时此刻"的氛围
//  设计参考：
//    - Papers Please：每天报纸建立世界感
//    - 现实新闻APP：今日头条式的信息流
//    - 3层降级：实时RSS → 天行数据API → 预存新闻（离线可用）
// ============================================================

// ——— 配置 ———
var REAL_TIME_NEWS_CONFIG = {
  enabled: true, // 全局开关
  timeout: 5000, // 单次抓取超时（ms）
  maxItems: 6, // 最多保留几条实时新闻
  displayCount: 4, // 弹窗展示几条
  sources: {
    // 源1：直接抓取 RSS XML（先直连，CORS失败自动回退到代理）
    rss_direct: {
      enabled: true,
      timeout: 6000,
      // CORS代理回退链：直连失败后按序尝试，encodeURIComponent拼接在代理后
      corsProxies: ["https://corsproxy.io/?"],
      feeds: [{ name: "36氪", url: "https://36kr.com/feed", category: "科技" }],
    },
    // 源2：rss2json.com 转换服务（CORS-enabled，免费1w次/天，最可靠）
    rss2json: {
      enabled: true,
      endpoint: "https://api.rss2json.com/v1/api.json",
      timeout: 7000,
      feeds: [
        { name: "36氪", url: "https://36kr.com/feed", category: "科技" },
        {
          name: "澎湃",
          url: "https://www.thepaper.cn/rss/channel/25434",
          category: "综合",
        },
      ],
    },
    // 源3：天行数据API（需注册免费Key，更稳定）
    // ═══════════════════════════════════════════════════════════════════
    //  🔑 如何获取：
    //     1. 浏览器打开 https://www.tianapi.com/ → 注册账号
    //     2. 登录后在控制台 → 「申请接口」→ 搜索「国内新闻」
    //     3. 申请通过后，在「我的接口」查看 API Key
    //     4. 把下方 apiKey 的值替换成你申请到的 key
    //     5. 把 enabled 改为 true
    // ═══════════════════════════════════════════════════════════════════
    tianapi: {
      enabled: true,
      apiKey: "cb2b289821c96231530dd050662ef0a9", // ← 你的天行数据 API Key
      endpoint: "https://api.tianapi.com/txapi/guonei/index",
      params: "num=10&rand=1", // 随机10条
    },
    // 源4：直连 CORS 代理（已禁用 — allorigins.win 返回 408/CORS）
    direct: {
      enabled: false,
      proxyUrl: "https://api.allorigins.win/raw?url=",
      sources: [
        {
          name: "百度热搜",
          url: "https://top.baidu.com/board?tab=realtime",
          parser: "baidu",
        },
      ],
    },
  },
};

// ——— 缓存 ———
var _cachedRealNews = null; // 缓存的最新实时新闻（数组）
var _cachedRealNewsTime = null; // 缓存时间戳
var _realNewsStatus = "idle"; // idle | loading | ready | failed | expired
var _realNewsError = null; // 最后一次错误信息

// ——— 关键词分类引擎 ———
// 将实时新闻标题/内容映射到游戏的 sectorHeat / marketMood / tag
var _NEWS_CLASSIFIER_RULES = [
  {
    id: "employment",
    patterns: [
      /裁员|失业|降薪|辞退|优化|毕业|就业|招聘|求职|岗位|打工|薪资|收入|工资|应届|找工作|offer/,
    ],
    sector: { 科技: -0.05, 消费: 0.03 },
    mood: "bearish",
    tag: "就业",
    getMood: function (text) {
      return /涨薪|加薪|抢人|扩招|补贴|上涨/.test(text) ? "bullish" : "bearish";
    },
    getSector: function (text) {
      return /涨薪|加薪|抢人|扩招/.test(text)
        ? { 科技: 0.06, 消费: 0.04 }
        : { 科技: -0.05, 消费: 0.03 };
    },
  },
  {
    id: "housing",
    patterns: [/房价|楼市|租房|房产|城中村|拆迁|房贷|地产|租金|购房|卖房/],
    sector: { 房地产: 0 },
    mood: "neutral",
    tag: "房产",
    getMood: function (text) {
      return /涨|升|回暖|复苏|反弹/.test(text)
        ? "bullish"
        : /跌|降|冷|下调|滞销/.test(text)
          ? "bearish"
          : "neutral";
    },
    getSector: function (text) {
      return /涨|升|回暖/.test(text)
        ? { 房地产: 0.08 }
        : /跌|降|冷|下调/.test(text)
          ? { 房地产: -0.08 }
          : { 房地产: 0.02 };
    },
  },
  {
    id: "tech",
    patterns: [
      /科技|AI|人工智能|芯片|互联网|数字化|5G|大数据|软件|程序员|算法|机器人|半导体|自动驾驶/,
    ],
    sector: { 科技: 0.1 },
    mood: "bullish",
    tag: "科技",
    getMood: function (text) {
      return /突破|超越|增长|上市|融资|热|爆/.test(text)
        ? "bullish"
        : /裁员|下滑|监管|限制/.test(text)
          ? "bearish"
          : "volatile";
    },
    getSector: function (text) {
      return /突破|超越|增长/.test(text)
        ? { 科技: 0.15 }
        : /裁员|下滑|限制/.test(text)
          ? { 科技: -0.05 }
          : { 科技: 0.08 };
    },
  },
  {
    id: "economy",
    // 经济/宏观类：覆盖宏观经济指标、政策、市场趋势等
    patterns: [
      /经济|GDP|通胀|通缩|CPI|PPI|PMI|利率|降准|降息|加息|流动性|货币|财政|赤字|国债|地方债|人民币|汇率|美元|美联储|央行|宏观|经济数据|增速|复苏|景气|衰退|萧条/,
    ],
    sector: { 金融: 0.05, 消费: 0.03 },
    mood: "bullish",
    tag: "经济",
    getMood: function (text) {
      return /涨|升|热|复苏|刺激|增长|扩张|回暖/.test(text)
        ? "bullish"
        : /跌|降|冷|萎缩|风险|危机|放缓|衰退|下行|通缩/.test(text)
          ? "bearish"
          : "neutral";
    },
    getSector: function (text) {
      return /涨|升|热|复苏|增长/.test(text)
        ? { 金融: 0.1, 消费: 0.05 }
        : /跌|降|冷|萎缩|放缓|衰退/.test(text)
          ? { 金融: -0.06, 消费: -0.04 }
          : { 金融: 0.03, 消费: 0.02 };
    },
  },
  {
    id: "finance",
    // 金融/投资类：覆盖股市、基金、理财、投融资等
    patterns: [
      /股市|A股|港股|美股|基金|ETF|理财|投资|股票|沪指|深指|创业板|科创板|外资|牛市|熊市|反弹|回调|震荡|涨停|跌停|IPO|上市|退市|分红|股息|回购|可转债|债券|收益率|净值/,
    ],
    sector: { 金融: 0.08, 科技: 0.03 },
    mood: "bullish",
    tag: "金融",
    getMood: function (text) {
      return /涨|升|牛|反弹|流入|增长|热|爆发/.test(text)
        ? "bullish"
        : /跌|降|熊|回调|流出|退市|风险|崩/.test(text)
          ? "bearish"
          : "volatile";
    },
    getSector: function (text) {
      return /涨|牛|反弹|流入/.test(text)
        ? { 金融: 0.12, 科技: 0.04 }
        : /跌|熊|回调|流出/.test(text)
          ? { 金融: -0.08, 科技: -0.03 }
          : { 金融: 0.05 };
    },
  },
  {
    id: "policy",
    patterns: [
      /政策|法规|监管|政府|税收|补贴|乡村振兴|改革|立法|新规|银保监|发改委|国务院/,
    ],
    sector: { 消费: 0.04, 金融: 0.03 },
    mood: "neutral",
    tag: "政策",
    getMood: function (text) {
      return /利好|支持|补贴|减税/.test(text)
        ? "bullish"
        : /监管|限制|罚款|整顿/.test(text)
          ? "bearish"
          : "neutral";
    },
    getSector: function (text) {
      return /利好|支持|补贴|减税/.test(text)
        ? { 消费: 0.08, 金融: 0.06 }
        : { 消费: 0.02 };
    },
  },
  {
    id: "consumption",
    // 消费/零售/电商类：覆盖消费市场、零售、电商、物价等
    patterns: [
      /消费|零售|电商|网购|购物|物价|涨价|降价|促销|打折|双十一|618|直播带货|外卖|餐饮|旅游|酒店|票房|客流量|销售额|商超|便利店|供销/,
    ],
    sector: { 消费: 0.08, 科技: 0.03 },
    mood: "bullish",
    tag: "消费",
    getMood: function (text) {
      return /涨|升|热|旺|爆发|增长|新高|复苏|反弹/.test(text)
        ? "bullish"
        : /跌|降|冷|萎缩|下滑|关闭|亏损|下降|疲软/.test(text)
          ? "bearish"
          : "neutral";
    },
    getSector: function (text) {
      return /涨|升|热|旺|增长|新高/.test(text)
        ? { 消费: 0.1, 科技: 0.04 }
        : /跌|降|冷|下滑|亏损/.test(text)
          ? { 消费: -0.07, 科技: -0.03 }
          : { 消费: 0.05 };
    },
  },
  {
    id: "social",
    // 社会/民生类：限制在真正社会话题而非泛化匹配
    patterns: [
      /养老|老龄化|社保|医保|退休|生育|出生率|人口|落户|户籍|低保|救助|慈善|公益|志愿者|社区|公共服务|入学|学区|摇号/,
    ],
    sector: { 医药: 0.05, 消费: 0.02 },
    mood: "neutral",
    tag: "社会",
    getMood: function (text) {
      return /改善|提升|利好|补贴/.test(text)
        ? "bullish"
        : /危机|焦虑|下滑|压力|问题/.test(text)
          ? "bearish"
          : "neutral";
    },
    getSector: function (text) {
      return /医疗|养老|健康/.test(text)
        ? { 医药: 0.08 }
        : { 医药: 0.03, 消费: 0.02 };
    },
  },
  {
    id: "seasonal",
    patterns: [
      /春节|中秋|国庆|端午|清明|五一|黄金周|寒潮|高温|台风|暴雨|雪灾|洪水/,
    ],
    sector: { 消费: 0.08 },
    mood: "bullish",
    tag: "节日",
    getMood: function (text) {
      return /消费|热|旺|爆发/.test(text)
        ? "bullish"
        : /灾|寒潮|暴雨|台风/.test(text)
          ? "bearish"
          : "neutral";
    },
    getSector: function (text) {
      return /消费|热|旺|爆发/.test(text)
        ? { 消费: 0.12 }
        : /灾|寒潮|暴雨/.test(text)
          ? { 消费: -0.05 }
          : { 消费: 0.05 };
    },
  },
  {
    id: "energy",
    patterns: [/新能源|光伏|风电|锂电池|电动车|充电桩|油价|电力|煤炭|天然气/],
    sector: { 新能源: 0.1, 科技: 0.05 },
    mood: "bullish",
    tag: "产业",
    getMood: function (text) {
      return /增长|突破|出口|热销/.test(text)
        ? "bullish"
        : /降价|过剩|下滑/.test(text)
          ? "bearish"
          : "volatile";
    },
    getSector: function (text) {
      return /增长|突破|出口/.test(text) ? { 新能源: 0.15 } : { 新能源: 0.06 };
    },
  },
];

/**
 * 实时新闻分类后的游戏影响说明（让玩家一眼看懂对自己的影响）
 * 按 ruleId → marketMood → 具体游戏影响说明
 */
var _REAL_NEWS_NOTES = {
  employment: {
    bullish: "招聘旺季！打工求职竞争力提升，薪资谈判空间扩大",
    bearish: "裁员降薪潮来袭，摆摊/零工比依赖稳定工作更灵活",
    neutral: "就业市场平稳，提升技能比频繁跳槽更划算",
    volatile: "就业两极分化：高技能人才抢手，普工岗位承压",
  },
  housing: {
    bullish: "租金/房价上涨趋势，尽早升级住所可锁定低成本",
    bearish: "楼市降温，租房可以议价，降低住所开销的好时机",
    neutral: "租房市场平稳，住所成本无明显变动",
    volatile: "住房市场波动，城中村租金可能受波及",
  },
  tech: {
    bullish: "科技/AI岗位薪资上涨，编程和数码技能更值钱",
    bearish: "IT行业裁员，基础技术岗竞争加剧，转型副业是出路",
    volatile: "科技板块震荡，相关投资需谨慎，把握高低点",
    neutral: "科技行业平稳，技术学习仍是长期投资",
  },
  economy: {
    bullish: "经济回暖！各行业收入预期改善，投资信心回升",
    bearish: "经济下行压力大，精打细算比冒险投资更重要",
    neutral: "宏观经济平稳，对日常打工生活影响有限",
    volatile: "经济不确定性高，保守储蓄比激进投资更安全",
  },
  finance: {
    bullish: "股市/投资市场走强！理财和股票有收益机会",
    bearish: "股市下跌，储蓄存银行比激进投资更安全",
    volatile: "市场震荡，有人赚有人赔，控制仓位为先",
    neutral: "金融市场平稳，存款/理财收益无明显变化",
  },
  policy: {
    bullish: "政策利好！部分行业享补贴，创业/就业窗口开启",
    bearish: "政策收紧，部分行业压力加大，灵活应对为上",
    neutral: "政策调整，短期影响有限，保持观望",
    volatile: "政策方向未明，避免重仓单一行业",
  },
  consumption: {
    bullish: "消费旺季来临！摆摊/零售/外卖/服务收入高峰期",
    bearish: "消费降级，街头生意难做，精简成本更关键",
    neutral: "消费市场平稳，日常摊位收入变化不大",
  },
  social: {
    bullish: "社会民生向好，就业机会增加，生活压力有所缓解",
    bearish: "社会压力上升，竞争更激烈，注重技能和人脉积累",
    neutral: "社会热点，对打工收入直接影响有限",
  },
  seasonal: {
    bullish: "节日/旺季来临！服务/零售/外卖收入即将激增",
    bearish: "恶劣天气/淡季，户外劳动受阻，考虑切换室内工作",
    neutral: "季节变化，适时调整打工策略",
  },
  energy: {
    bullish: "新能源/制造岗位需求旺盛，技能工匠薪资有溢价",
    bearish: "能源价格下调，相关岗位招聘放缓",
    volatile: "能源市场波动，相关行业收入不稳定",
  },
};

/**
 * 通过关键词将实时新闻标题分类，转化为游戏世界效果
 * @param {string} title - 新闻标题
 * @param {string} desc  - 新闻描述（可选）
 * @returns {Object} { tag, sectorHeat, marketMood, note }
 */
function classifyRealNews(title, desc) {
  var text = (title + " " + (desc || "")).toLowerCase();
  var result = {
    tag: "社会",
    sectorHeat: {},
    marketMood: "neutral",
    note: "",
  };

  for (var ri = 0; ri < _NEWS_CLASSIFIER_RULES.length; ri++) {
    var rule = _NEWS_CLASSIFIER_RULES[ri];
    for (var pi = 0; pi < rule.patterns.length; pi++) {
      if (rule.patterns[pi].test(text)) {
        // 命中规则
        result.tag = rule.tag;
        // 动态计算 mood 和 sector
        if (typeof rule.getMood === "function") {
          result.marketMood = rule.getMood(text);
        } else {
          result.marketMood = rule.mood;
        }
        if (typeof rule.getSector === "function") {
          result.sectorHeat = rule.getSector(text);
        } else {
          result.sectorHeat = rule.sector;
        }
        // 生成 note：优先用查找表中具体的游戏影响说明
        var noteGroup = _REAL_NEWS_NOTES[rule.id];
        result.note =
          noteGroup && noteGroup[result.marketMood]
            ? noteGroup[result.marketMood]
            : noteGroup && noteGroup["neutral"]
              ? noteGroup["neutral"]
              : "实时新闻·" +
                result.tag +
                "方向" +
                (result.marketMood === "bullish"
                  ? "向好"
                  : result.marketMood === "bearish"
                    ? "承压"
                    : "平稳");
        return result;
      }
    }
  }

  // ——— 无规则命中时的智能兜底 ———
  // 不再一刀切「社会综合」，而是根据文本特征智能推断
  // 参考 Bloomberg Terminal 的「其他新闻」归类逻辑：尽量找到最小共同类别

  // 1. 检查是否有数字 + 百分比 → 很可能含经济/市场数据
  if (/\d+\.?\d*%|百分点|增长率|增速/.test(text)) {
    result.tag = "经济";
    result.sectorHeat = { 金融: 0.03, 消费: 0.02 };
    result.marketMood = "neutral";
    result.note = "经济数据发布，消费和金融板块轻微波动，打工收入短期影响有限";
    return result;
  }

  // 2. 检查是否有金额/货币符号 → 很可能与商业/金融相关
  if (/[¥$￥]|亿元|万元|元\/|融资|营收|利润|成本|预算/.test(text)) {
    result.tag = "经济";
    result.sectorHeat = { 金融: 0.04, 消费: 0.02 };
    result.marketMood = "neutral";
    result.note = "商业资金流动，消费市场轻微影响，存款和消费决策可稍作留意";
    return result;
  }

  // 3. 检查是否有企业/机构/市场类词汇
  if (
    /公司|集团|企业|厂|市场|行业|业务|产能|产量|订单|合同|合作|签约|招标|投标/.test(
      text,
    )
  ) {
    result.tag = "产业";
    result.sectorHeat = { 科技: 0.03, 新能源: 0.02 };
    result.marketMood = "neutral";
    result.note = "产业动向，科技/新能源板块可能微调，关注相关岗位机会";
    return result;
  }

  // 4. 检查是否有城市/交通/基建类词汇
  if (
    /城市|地铁|公交|高铁|机场|公路|基建|工程|建设|规划|新区|开发区/.test(text)
  ) {
    result.tag = "城市";
    result.sectorHeat = { 房地产: 0.04, 消费: 0.02 };
    result.marketMood = "neutral";
    result.note = "城市基建加速，工程/建筑类岗位需求上升，周边租金可能微调";
    return result;
  }

  // 5. 真正无匹配 → 轻微消费影响，给出有用的通用建议
  result.sectorHeat = { 消费: 0.01 };
  result.marketMood = "neutral";
  result.note = "社会热点新闻，对打工生活的直接影响有限，保持日常节奏即可";
  return result;
}

/**
 * 根据分类标签和市场情绪生成 investmentEffect（让实时新闻也能影响投资市场）
 * v2.0 增强：覆盖更多行业标签，AI/科技新闻直接联动股票投资
 * @param {string} tag  - 分类标签
 * @param {string} mood - 市场情绪
 * @returns {Array} investmentEffect 数组
 */
function generateInvestmentEffectFromTag(tag, mood) {
  var isUp = mood === "bullish";
  var isDown = mood === "bearish";
  var map = {
    就业: { industry: "科技", up: 1.06, down: 0.92 },
    房产: { industry: "房地产", up: 1.08, down: 0.88 },
    科技: { industry: "科技", up: 1.12, down: 0.9 },
    经济: { industry: "金融", up: 1.06, down: 0.93 },
    金融: { industry: "金融", up: 1.1, down: 0.92 },
    消费: { industry: "消费", up: 1.08, down: 0.92 },
    产业: { industry: "新能源", up: 1.1, down: 0.92 },
    市场: { industry: "金融", up: 1.08, down: 0.94 },
    社会: { industry: "医药", up: 1.04, down: 0.97 },
    教育: { industry: "科技", up: 1.04, down: 0.97 },
    节日: { industry: "消费", up: 1.1, down: 0.98 },
    季节: { industry: "消费", up: 1.04, down: 0.97 },
    天气: { industry: "消费", up: 0.96, down: 0.95 },
    国际: { industry: "科技", up: 0.94, down: 0.88 },
    政策: { industry: "消费", up: 1.05, down: 0.94 },
    劳工: { industry: "科技", up: 0.96, down: 0.94 },
    新媒体: { industry: "科技", up: 1.06, down: 0.95 },
    租房: { industry: "房地产", up: 1.02, down: 0.96 },
    城市: { industry: "房地产", up: 1.04, down: 0.95 },
    // v2.0 新增：AI/芯片/大模型 → 科技行业投资联动
    AI: { industry: "科技", up: 1.15, down: 0.88 },
    芯片: { industry: "科技", up: 1.18, down: 0.85 },
    机器人: { industry: "科技", up: 1.12, down: 0.9 },
    大数据: { industry: "科技", up: 1.1, down: 0.92 },
    加密货币: { category: "虚拟币", up: 1.15, down: 0.8 },
    黄金: { category: "贵金属", up: 1.08, down: 0.95 },
    能源: { industry: "新能源", up: 1.12, down: 0.9 },
    医疗: { industry: "医药", up: 1.08, down: 0.94 },
  };
  var entry = map[tag];
  if (!entry) return [];
  var mul = isUp ? entry.up : isDown ? entry.down : 1.0;
  if (mul === 1.0) return [];
  return [
    {
      industry: entry.industry || null,
      category: entry.category || null,
      mul: mul,
    },
  ];
}

/**
 * 从 RSS XML 直接抓取并解析（不需要第三方转换服务）
 * 使用浏览器原生 DOMParser 解析 XML
 */
/** 解析 RSS XML 文本为游戏新闻格式（内部辅助） */
function _parseRSSXML(xmlText, feed) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlText, "text/xml");
  var parseError = xmlDoc.querySelector("parsererror");
  if (parseError) throw new Error("XML parse error for " + feed.name);

  var items = xmlDoc.querySelectorAll("item");
  if (!items || items.length === 0)
    throw new Error("No items in RSS feed: " + feed.name);

  var newsItems = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var titleEl = item.querySelector("title");
    var descEl = item.querySelector("description");
    var linkEl = item.querySelector("link");
    var title = titleEl ? titleEl.textContent : "";
    if (!title) continue;
    var description = descEl ? descEl.textContent : "";
    var link = linkEl ? linkEl.textContent : "";
    var classification = classifyRealNews(title, description);
    newsItems.push({
      id: "realtime_" + feed.name + "_" + i,
      icon: getNewsIconByTag(classification.tag),
      tag: classification.tag,
      headline: title
        .replace(/<[^>]+>/g, "")
        .trim()
        .substring(0, 80),
      detail: description
        .replace(/<[^>]+>/g, "")
        .trim()
        .substring(0, 120),
      worldEffect: {
        sectorHeat: classification.sectorHeat,
        marketMood: classification.marketMood,
        note: classification.note,
      },
      investmentEffect: generateInvestmentEffectFromTag(
        classification.tag,
        classification.marketMood,
      ),
      source: "实时·" + feed.name,
      url: link,
      _isRealTime: true,
    });
  }
  if (newsItems.length === 0)
    throw new Error("Empty items after parsing RSS: " + feed.name);
  return newsItems;
}

/** 从指定 URL 抓取 RSS XML 并解析（内部辅助，单URL单次） */
function _fetchRSSFromUrl(url, feed, timeout) {
  return new Promise(function (resolve, reject) {
    var timeoutId = setTimeout(function () {
      reject(new Error("RSS timeout: " + feed.name));
    }, timeout);

    fetch(url)
      .then(function (response) {
        clearTimeout(timeoutId);
        if (!response.ok)
          throw new Error("HTTP " + response.status + " for " + feed.name);
        return response.text();
      })
      .then(function (xmlText) {
        resolve(_parseRSSXML(xmlText, feed));
      })
      .catch(function (err) {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
}

/**
 * 从 RSS XML 直接抓取（先直连，CORS失败自动依次尝试corsProxies列表）
 */
function fetchFromRSSDirect(feed) {
  var rssDirectCfg = REAL_TIME_NEWS_CONFIG.sources.rss_direct;
  var timeout = rssDirectCfg.timeout || 6000;
  var proxies = rssDirectCfg.corsProxies || [];

  // 待尝试的URL列表：直连 → 各CORS代理
  var urlsToTry = [feed.url];
  for (var pi = 0; pi < proxies.length; pi++) {
    urlsToTry.push(proxies[pi] + encodeURIComponent(feed.url));
  }

  function tryNext(idx) {
    if (idx >= urlsToTry.length) {
      return Promise.reject(new Error("All URLs failed for " + feed.name));
    }
    return _fetchRSSFromUrl(urlsToTry[idx], feed, timeout).catch(
      function (err) {
        console.warn(
          "[实时新闻] " + feed.name + " 尝试#" + idx + " 失败:",
          err.message || err,
        );
        return tryNext(idx + 1);
      },
    );
  }

  return tryNext(0);
}

/** 尝试用指定的转换URL抓取RSS并转换为游戏新闻格式 */
function tryFetchRSS(converterUrl, feed) {
  var requestUrl = converterUrl + "?rss_url=" + encodeURIComponent(feed.url);

  return new Promise(function (resolve, reject) {
    var timeoutId = setTimeout(function () {
      reject(new Error("RSS timeout: " + feed.name));
    }, REAL_TIME_NEWS_CONFIG.timeout);

    fetch(requestUrl)
      .then(function (response) {
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error("HTTP " + response.status + " for " + feed.name);
        }
        return response.json();
      })
      .then(function (data) {
        // 兼容不同转换服务的响应格式
        var items = null;
        if (data && data.status === "ok" && data.items) {
          items = data.items; // rss2json 格式
        } else if (data && data.items && data.items.length > 0) {
          items = data.items; // 某些服务的直接格式
        } else if (data && data.feed && data.items) {
          items = data.items; // 另一种常见格式
        } else if (Array.isArray(data)) {
          items = data; // 直接返回数组
        }

        if (items && items.length > 0) {
          var newsItems = [];
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var title = item.title || item.headline || "";
            if (!title) continue;
            var description =
              item.description || item.content || item.contentSnippet || "";
            var classification = classifyRealNews(title, description);
            newsItems.push({
              id: "realtime_" + feed.name + "_" + i,
              icon: getNewsIconByTag(classification.tag),
              tag: classification.tag,
              headline: title
                .replace(/<[^>]+>/g, "")
                .trim()
                .substring(0, 80),
              detail: description
                .replace(/<[^>]+>/g, "")
                .trim()
                .substring(0, 120),
              worldEffect: {
                sectorHeat: classification.sectorHeat,
                marketMood: classification.marketMood,
                note: classification.note,
              },
              investmentEffect: generateInvestmentEffectFromTag(
                classification.tag,
                classification.marketMood,
              ),
              source: "实时·" + feed.name,
              url: item.link || item.url || "",
              _isRealTime: true,
            });
          }
          resolve(newsItems);
        } else {
          reject(new Error("Empty or invalid RSS response from " + feed.name));
        }
      })
      .catch(function (err) {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
}

/**
 * 通过 rss2json.com 将 RSS 转换为 JSON（绕过 CORS）
 */
function fetchFromRSS2JSON(feed) {
  var cfg = REAL_TIME_NEWS_CONFIG.sources.rss2json;
  if (!cfg || !cfg.enabled) {
    return Promise.reject(new Error("rss2json not configured"));
  }
  return tryFetchRSS(cfg.endpoint, feed);
}

/**
 * 从天行数据API抓取实时新闻
 * @returns {Promise<Array>} 新闻条目数组
 */
function fetchFromTianAPI() {
  var cfg = REAL_TIME_NEWS_CONFIG.sources.tianapi;
  if (!cfg.enabled || !cfg.apiKey) {
    return Promise.reject(new Error("TianAPI not configured"));
  }

  var url = cfg.endpoint + "?key=" + cfg.apiKey + "&" + cfg.params;

  return new Promise(function (resolve, reject) {
    var timeoutId = setTimeout(function () {
      reject(new Error("TianAPI timeout"));
    }, REAL_TIME_NEWS_CONFIG.timeout);

    fetch(url)
      .then(function (response) {
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (data) {
        if (
          data &&
          data.code === 200 &&
          data.newslist &&
          data.newslist.length > 0
        ) {
          var newsItems = [];
          for (var i = 0; i < data.newslist.length; i++) {
            var item = data.newslist[i];
            if (!item.title) continue;
            var classification = classifyRealNews(
              item.title,
              item.description || "",
            );
            newsItems.push({
              id: "tianapi_" + i,
              icon: getNewsIconByTag(classification.tag),
              tag: classification.tag,
              headline: item.title.substring(0, 80),
              detail: (item.description || "").substring(0, 120),
              worldEffect: {
                sectorHeat: classification.sectorHeat,
                marketMood: classification.marketMood,
                note: classification.note,
              },
              investmentEffect: generateInvestmentEffectFromTag(
                classification.tag,
                classification.marketMood,
              ),
              source: "实时·天行数据",
              url: item.url || "",
              _isRealTime: true,
            });
          }
          resolve(newsItems);
        } else {
          reject(
            new Error(
              "TianAPI response error: " + ((data && data.msg) || "unknown"),
            ),
          );
        }
      })
      .catch(function (err) {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
}

/**
 * 通过 CORS 代理直接抓取新闻页面（兜底方式，不需要第三方转换服务）
 * 当 rss2json 等转换服务不可用时使用
 * @returns {Promise<Array>} 新闻条目数组
 */
function fetchFromDirect() {
  var cfg = REAL_TIME_NEWS_CONFIG.sources.direct;
  if (!cfg.enabled || !cfg.sources || cfg.sources.length === 0) {
    return Promise.reject(new Error("Direct sources not configured"));
  }

  return new Promise(function (resolve, reject) {
    var promises = [];

    for (var di = 0; di < cfg.sources.length; di++) {
      var src = cfg.sources[di];
      var proxyUrl = cfg.proxyUrl + encodeURIComponent(src.url);

      // 根据解析器类型分发
      if (src.parser === "baidu") {
        promises.push(
          fetchBaiduHotSearch(proxyUrl, src.name)
            .then(function (items) {
              return items;
            })
            .catch(function () {
              return [];
            }),
        );
      }
    }

    if (promises.length === 0) {
      reject(new Error("No parsable direct sources"));
      return;
    }

    Promise.all(promises)
      .then(function (results) {
        var allNews = [];
        for (var ri = 0; ri < results.length; ri++) {
          if (results[ri] && results[ri].length > 0) {
            allNews = allNews.concat(results[ri]);
          }
        }
        if (allNews.length > 0) {
          resolve(allNews);
        } else {
          reject(new Error("All direct sources returned empty"));
        }
      })
      .catch(function () {
        reject(new Error("Direct fetch failed"));
      });
  });
}

/**
 * 抓取百度热搜榜（通过 CORS 代理）
 * 百度热搜的 HTML 结构：class="category-wrap_iQLoo" 下的标题
 */
function fetchBaiduHotSearch(proxyUrl, sourceName) {
  return new Promise(function (resolve, reject) {
    var timeoutId = setTimeout(function () {
      reject(new Error("Baidu hot search timeout"));
    }, REAL_TIME_NEWS_CONFIG.timeout);

    fetch(proxyUrl)
      .then(function (response) {
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.text();
      })
      .then(function (html) {
        // 从 HTML 中提取热搜标题
        var titles = [];
        // 尝试匹配百度热搜的标题结构
        var titleRegex =
          /<div[^>]*class="c-single-text-ellipsis"[^>]*>([^<]+)<\/div>/g;
        var match;
        while ((match = titleRegex.exec(html)) !== null) {
          var t = match[1].trim();
          if (t.length > 4 && titles.indexOf(t) === -1) {
            titles.push(t);
          }
        }
        // 如果上面的正则没匹配到，尝试备选结构
        if (titles.length === 0) {
          var altRegex = /class="title[^"]*"[^>]*>[\s]*<[^>]+>([^<]+)</g;
          while ((match = altRegex.exec(html)) !== null) {
            var t2 = match[1].trim();
            if (t2.length > 4 && titles.indexOf(t2) === -1) {
              titles.push(t2);
            }
          }
        }

        if (titles.length === 0) {
          reject(new Error("No titles found in Baidu hot search"));
          return;
        }

        // 转为游戏新闻格式
        var newsItems = [];
        for (var ti = 0; ti < Math.min(titles.length, 10); ti++) {
          var classification = classifyRealNews(titles[ti], "");
          newsItems.push({
            id: "direct_baidu_" + ti,
            icon: getNewsIconByTag(classification.tag),
            tag: classification.tag,
            headline: titles[ti],
            detail: "百度热搜" + (ti + 1) + "位",
            worldEffect: {
              sectorHeat: classification.sectorHeat,
              marketMood: classification.marketMood,
              note: classification.note,
            },
            investmentEffect: generateInvestmentEffectFromTag(
              classification.tag,
              classification.marketMood,
            ),
            source: "实时·" + sourceName,
            url: "",
            _isRealTime: true,
          });
        }
        resolve(newsItems);
      })
      .catch(function (err) {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
}

/**
 * 根据分类标签获取图标
 */
function getNewsIconByTag(tag) {
  var iconMap = {
    就业: "💼",
    房产: "🏘️",
    科技: "💻",
    经济: "📊",
    政策: "📋",
    社会: "👥",
    节日: "🎉",
    产业: "🏭",
    国际: "🌏",
    教育: "📚",
    金融: "🏦",
    消费: "🛒",
    市场: "📈",
    天气: "🌤️",
    季节: "🍂",
    招聘: "📢",
    新媒体: "📱",
    劳工: "⚖️",
    租房: "🔑",
    城市: "🏙️",
    // 兜底标签
    综合: "📰",
    毕业: "🎓",
    冬季: "❄️",
  };
  return iconMap[tag] || "📰";
}

/**
 * 主入口：从所有可用源抓取实时新闻，合并去重后缓存
 * @returns {Promise<Array>} 抓取到的新闻数组
 */
function fetchRealTimeNews() {
  if (!REAL_TIME_NEWS_CONFIG.enabled) {
    return Promise.reject(new Error("Real-time news disabled"));
  }

  _realNewsStatus = "loading";
  var promises = [];

  // 源1：RSS直连（含 CORS 代理回退）
  var rssDirectCfg = REAL_TIME_NEWS_CONFIG.sources.rss_direct;
  if (
    rssDirectCfg.enabled &&
    rssDirectCfg.feeds &&
    rssDirectCfg.feeds.length > 0
  ) {
    for (var fi = 0; fi < rssDirectCfg.feeds.length; fi++) {
      promises.push(fetchFromRSSDirect(rssDirectCfg.feeds[fi]));
    }
  }

  // 源2：rss2json 转换服务（CORS-enabled，最可靠）
  var rss2jsonCfg = REAL_TIME_NEWS_CONFIG.sources.rss2json;
  if (
    rss2jsonCfg &&
    rss2jsonCfg.enabled &&
    rss2jsonCfg.feeds &&
    rss2jsonCfg.feeds.length > 0
  ) {
    for (var rj = 0; rj < rss2jsonCfg.feeds.length; rj++) {
      promises.push(fetchFromRSS2JSON(rss2jsonCfg.feeds[rj]));
    }
  }

  // 源3：天行数据API
  if (
    REAL_TIME_NEWS_CONFIG.sources.tianapi.enabled &&
    REAL_TIME_NEWS_CONFIG.sources.tianapi.apiKey
  ) {
    promises.push(fetchFromTianAPI());
  }

  // 源4：直连兜底（已禁用）
  var directCfg = REAL_TIME_NEWS_CONFIG.sources.direct;
  if (directCfg.enabled && directCfg.sources && directCfg.sources.length > 0) {
    promises.push(fetchFromDirect());
  }

  if (promises.length === 0) {
    _realNewsStatus = "failed";
    _realNewsError = "No news sources configured";
    return Promise.reject(new Error("No news sources configured"));
  }

  // 使用 Promise.allSettled — 部分失败不影响整体
  return Promise.allSettled(promises)
    .then(function (results) {
      var allNews = [];
      var seenHeadlines = {};

      for (var ri = 0; ri < results.length; ri++) {
        var result = results[ri];
        if (
          result.status === "fulfilled" &&
          result.value &&
          result.value.length > 0
        ) {
          for (var ni = 0; ni < result.value.length; ni++) {
            var news = result.value[ni];
            // 去重（相同标题只保留一条）
            var dedupKey = news.headline.substring(0, 20);
            if (!seenHeadlines[dedupKey]) {
              seenHeadlines[dedupKey] = true;
              allNews.push(news);
            }
          }
        } else if (result.status === "rejected") {
          console.warn(
            "[实时新闻] 源失败:",
            result.reason && (result.reason.message || result.reason),
          );
        }
      }

      if (allNews.length === 0) {
        _realNewsStatus = "failed";
        _realNewsError = "All sources returned empty";
        throw new Error("All sources returned empty");
      }

      // 随机打乱以保证多样性
      var shuffled = deterministicShuffle(allNews, Date.now() % 100000);
      // 限制数量
      var limited = shuffled.slice(0, REAL_TIME_NEWS_CONFIG.maxItems || 6);

      // 缓存
      _cachedRealNews = limited;
      _cachedRealNewsTime = Date.now();
      _realNewsStatus = "ready";
      _realNewsError = null;

      return limited;
    })
    .catch(function (err) {
      _realNewsStatus = "failed";
      _realNewsError = err.message || "Unknown error";
      throw err;
    });
}

/**
 * 后台预加载实时新闻（在页面加载时自动调用）
 */
function fetchRealTimeNewsInBackground() {
  // 仅在浏览器环境且有fetch支持时执行
  if (typeof fetch !== "function" || typeof Promise === "undefined") {
    _realNewsStatus = "failed";
    _realNewsError = "Environment not supported";
    return;
  }

  _realNewsStatus = "loading";
  fetchRealTimeNews()
    .then(function (news) {
      console.log("[城市浮生记] ✅ 实时新闻获取成功，共" + news.length + "条");
    })
    .catch(function (err) {
      console.warn(
        "[城市浮生记] ⚠️ 实时新闻获取失败（" +
          (_realNewsError || err.message) +
          "），将使用离线新闻",
      );
    });
}

/**
 * 获取缓存的实时新闻，若无则返回 null
 * @param {number} maxAge - 缓存有效期（毫秒，默认30分钟）
 * @returns {Array|null}
 */
function getCachedRealNews(maxAge) {
  maxAge = maxAge || 30 * 60 * 1000; // 默认30分钟
  if (_realNewsStatus === "ready" && _cachedRealNews && _cachedRealNewsTime) {
    if (Date.now() - _cachedRealNewsTime < maxAge) {
      return _cachedRealNews;
    } else {
      _realNewsStatus = "expired";
    }
  }
  return null;
}

/**
 * 获取实时新闻状态描述文本
 */
function getRealNewsStatusText() {
  switch (_realNewsStatus) {
    case "idle":
      return "📡 新闻待获取";
    case "loading":
      return "📡 正在获取今日实时新闻...";
    case "ready":
      return "📰 今日实时新闻已就绪";
    case "failed":
      return "📰 使用本地新闻背景";
    case "expired":
      return "📡 新闻缓存已过期";
    default:
      return "📰 新闻系统就绪";
  }
}

// ——— 启动：页面加载时自动后台抓取 ———
(function () {
  // 延迟启动，让页面先渲染完成
  if (typeof setTimeout !== "undefined") {
    setTimeout(function () {
      fetchRealTimeNewsInBackground();
    }, 1000);
  }
})();

// ============================================================
//  二、按月份和剧本构建新闻候选池
// ============================================================

/**
 * 获取本局游戏的开场世界新闻（3-5条）
 * @param {string|null} scenarioId - 当前剧本ID（null = 经典/沙盒）
 * @returns {Array} 选中的新闻条目（3-5条）
 */
function selectWorldNewsForGame(scenarioId) {
  var now = new Date();
  var month = now.getMonth() + 1; // 1-12
  var day = now.getDate(); // 1-31

  // 用日期作为随机种子（同一天的玩家看到相似的新闻组合）
  var dateSeed = now.getFullYear() * 10000 + month * 100 + day;

  // 收集候选新闻（所有适合当前月份的）
  var allCategories = Object.keys(WORLD_NEWS_DB);
  var candidates = [];

  for (var ci = 0; ci < allCategories.length; ci++) {
    var cat = allCategories[ci];
    var newsArr = WORLD_NEWS_DB[cat];
    for (var ni = 0; ni < newsArr.length; ni++) {
      var news = newsArr[ni];
      // 检查月份匹配
      if (news.months.indexOf(month) !== -1) {
        // 剧本适配加权（匹配剧本的新闻权重更高）
        var weight = 1;
        if (
          scenarioId &&
          news.scenarioTags &&
          news.scenarioTags.indexOf(scenarioId) !== -1
        ) {
          weight = 2; // 剧本相关新闻出现概率翻倍
        }
        for (var w = 0; w < weight; w++) {
          candidates.push(news);
        }
      }
    }
  }

  // 用日期种子进行确定性随机洗牌（保证同天同剧本看到相近的新闻）
  var shuffled = deterministicShuffle(candidates, dateSeed);

  // 去重（按 id 去重）
  var seen = {};
  var deduped = [];
  for (var si = 0; si < shuffled.length; si++) {
    if (!seen[shuffled[si].id]) {
      seen[shuffled[si].id] = true;
      deduped.push(shuffled[si]);
    }
  }

  // 返回前4条（保证多样性：至少覆盖就业、经济、社会3类）
  var selected = ensureDiversity(deduped, month);
  return selected.slice(0, 4);
}

/**
 * 确定性洗牌（基于种子的 Fisher-Yates）
 */
function deterministicShuffle(arr, seed) {
  var result = arr.slice();
  var s = seed;
  for (var i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    var j = Math.abs(s) % (i + 1);
    var tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }
  return result;
}

/**
 * 确保新闻多样性：不同类别各出一条
 */
function ensureDiversity(shuffled, month) {
  var result = [];
  var usedCats = {};
  var leftover = [];

  // 第一遍：每个主类各选一条
  var PRIORITY_CATS = ["employment", "economy", "social"];
  for (var pi = 0; pi < PRIORITY_CATS.length; pi++) {
    var pcat = PRIORITY_CATS[pi];
    for (var si = 0; si < shuffled.length; si++) {
      var item = shuffled[si];
      // 用 tag 匹配类别
      var tagToCat = {
        就业: "employment",
        科技: "tech",
        市场: "economy",
        产业: "economy",
        金融: "economy",
        消费: "economy",
        房产: "housing",
        租房: "housing",
        城市: "housing",
        社会: "social",
        教育: "social",
        新媒体: "tech",
        政策: "policy",
        劳工: "policy",
        国际: "policy",
        节日: "seasonal",
        毕业: "seasonal",
        天气: "seasonal",
        季节: "seasonal",
        招聘: "seasonal",
      };
      var itemCat = tagToCat[item.tag] || "other";
      if (itemCat === pcat && !usedCats[pcat]) {
        usedCats[pcat] = true;
        result.push(item);
        break;
      }
    }
  }

  // 第二遍：添加季节性新闻（优先）
  for (var xi = 0; xi < shuffled.length; xi++) {
    var xitem = shuffled[xi];
    var alreadyIn = false;
    for (var ri = 0; ri < result.length; ri++) {
      if (result[ri].id === xitem.id) {
        alreadyIn = true;
        break;
      }
    }
    if (
      !alreadyIn &&
      (xitem.tag === "节日" ||
        xitem.tag === "季节" ||
        xitem.tag === "天气" ||
        xitem.tag === "毕业" ||
        xitem.tag === "招聘")
    ) {
      result.push(xitem);
      break;
    }
  }

  // 第三遍：填充到4条
  for (var yi = 0; yi < shuffled.length && result.length < 4; yi++) {
    var yitem = shuffled[yi];
    var alreadyIn2 = false;
    for (var rj = 0; rj < result.length; rj++) {
      if (result[rj].id === yitem.id) {
        alreadyIn2 = true;
        break;
      }
    }
    if (!alreadyIn2) {
      result.push(yitem);
    }
  }

  return result;
}

// ============================================================
//  三、世界参数应用（v2.0 — 深度联动增强）
//  设计目标：开局新闻不只是"背景板"，每条新闻都要实际影响游戏系统
//  联动维度：
//    1. sectorHeat → 投资波动率/事件权重（已有）
//    2. marketMood → 玩家初始心态/风险偏好（已有）
//    3. jobBonus/jobPenalty → 工作收入加成/惩罚（新增）
//    4. priceMod → 商品价格浮动（新增）
//    5. skillXp → 技能经验加成（新增）
//    6. cashBonus → 初始资金调整（新增）
//    7. investmentEffect → 投资市场开盘价（已有但需强化）
// ============================================================

/**
 * 将选中的新闻效果应用到世界参数
 * @param {Object} state - 游戏状态
 * @param {Array} selectedNews - 选中的新闻条目
 */
function applyWorldNewsToParams(state, selectedNews) {
  if (!state._worldParams) return;
  var wp = state._worldParams;

  var moodVotes = { bullish: 0, bearish: 0, neutral: 0, volatile: 0 };

  for (var ni = 0; ni < selectedNews.length; ni++) {
    var news = selectedNews[ni];
    var eff = news.worldEffect;
    if (!eff) continue;

    // 1. 应用行业热度（sectorHeat → 投资波动率 + 事件权重）
    if (eff.sectorHeat) {
      for (var sec in eff.sectorHeat) {
        if (eff.sectorHeat.hasOwnProperty(sec)) {
          if (wp.sectorHeat[sec] !== undefined) {
            wp.sectorHeat[sec] = Math.max(
              0.5,
              Math.min(2.0, wp.sectorHeat[sec] + eff.sectorHeat[sec]),
            );
            // [v3.76 修复] 不覆盖 initialSectorBias — 保留原始基线，让 decayWorldParams 自然回归
            // 开局新闻设置初始偏移，后续每日新闻叠加修改 + 每天2%向基线衰减
          }
        }
      }
    }

    // 2. 统计市场情绪投票
    if (eff.marketMood) {
      moodVotes[eff.marketMood] = (moodVotes[eff.marketMood] || 0) + 1;
    }

    // 3. 应用工作加成/惩罚（jobBonus/jobPenalty → 工作收入）
    if (eff.jobBonus && Array.isArray(eff.jobBonus)) {
      state._introJobBonuses = state._introJobBonuses || {};
      for (var ji = 0; ji < eff.jobBonus.length; ji++) {
        var jb = eff.jobBonus[ji];
        if (typeof jb === "string") {
          state._introJobBonuses[jb] = eff.jobMultiplier || 1.1;
        } else if (jb && jb.id) {
          state._introJobBonuses[jb.id] = jb.mul || eff.jobMultiplier || 1.1;
        }
      }
    }
    if (eff.jobPenalty && Array.isArray(eff.jobPenalty)) {
      state._introJobBonuses = state._introJobBonuses || {};
      for (var pj = 0; pj < eff.jobPenalty.length; pj++) {
        var jp = eff.jobPenalty[pj];
        if (typeof jp === "string") {
          state._introJobBonuses[jp] =
            (state._introJobBonuses[jp] || 1) * (eff.jobMultiplier || 0.7);
        } else if (jp && jp.id) {
          state._introJobBonuses[jp.id] =
            (state._introJobBonuses[jp.id] || 1) *
            (jp.mul || eff.jobMultiplier || 0.7);
        }
      }
    }

    // 4. 应用价格修正（priceMod → 商品市场）
    if (eff.priceMod) {
      state._introPriceMods = state._introPriceMods || {};
      for (var pm in eff.priceMod) {
        if (eff.priceMod.hasOwnProperty(pm)) {
          state._introPriceMods[pm] = eff.priceMod[pm];
        }
      }
    }

    // 5. 应用技能经验加成（skillXp → 技能XP）
    if (eff.skillXp) {
      state._introSkillXp = state._introSkillXp || {};
      for (var sk in eff.skillXp) {
        if (eff.skillXp.hasOwnProperty(sk)) {
          state._introSkillXp[sk] = eff.skillXp[sk];
        }
      }
    }

    // 6. 应用初始资金调整（cashBonus/cashLoss）
    if (eff.cashBonus) {
      state._introCashBonus = (state._introCashBonus || 0) + eff.cashBonus;
    }
    if (eff.cashLoss) {
      state._introCashBonus = (state._introCashBonus || 0) - eff.cashLoss;
    }
  }

  // 7. 决定最终市场情绪（多数投票）
  var winningMood = "neutral";
  var maxVotes = 0;
  for (var mood in moodVotes) {
    if (moodVotes.hasOwnProperty(mood) && moodVotes[mood] > maxVotes) {
      maxVotes = moodVotes[mood];
      winningMood = mood;
    }
  }
  wp.marketMood = winningMood;
  wp.seedSource = "world_news_intro";
}

/**
 * 开局新闻持久化时长（天）— 不是永久，而是"世界底色"
 * 后续每日新闻会覆盖/叠加/替换这些效果
 * v3.64 新增：开局新闻效果有时效性，模拟真实世界的新闻周期
 */
var INTRO_NEWS_DEFAULT_DURATION = 30; // 默认30天后被后续新闻覆盖

/**
 * 保存基准状态快照（v3.64 新增）
 * 在应用开局新闻效果之前保存，到期时可回滚
 * @param {Object} state - 游戏状态
 * @param {Array} selectedNews - 选中的新闻条目
 * @returns {Object} 基准快照
 */
function saveIntroNewsBaseline(state, selectedNews) {
  var baseline = {
    day: state.player ? state.player.day : 0,
    _jobMultipliers: {},
    _allJobsBonus: state._allJobsBonus || 1,
    goodsPricesSnapshot: {},
    cashBefore: state.resources ? state.resources.cash : 0,
    skillsSnapshot: {},
    investmentSnapshot: {},
  };

  // 保存 _jobMultipliers 快照
  if (state._jobMultipliers) {
    for (var kj in state._jobMultipliers) {
      if (state._jobMultipliers.hasOwnProperty(kj)) {
        baseline._jobMultipliers[kj] = state._jobMultipliers[kj];
      }
    }
  }

  // 保存 goodsPrices 快照（每个地点的每种商品价格）
  if (state.trade && state.trade.goodsPrices) {
    for (var loc in state.trade.goodsPrices) {
      if (state.trade.goodsPrices.hasOwnProperty(loc)) {
        baseline.goodsPricesSnapshot[loc] = {};
        for (var good in state.trade.goodsPrices[loc]) {
          if (state.trade.goodsPrices[loc].hasOwnProperty(good)) {
            baseline.goodsPricesSnapshot[loc][good] =
              state.trade.goodsPrices[loc][good];
          }
        }
      }
    }
  }

  // 保存 skills 快照
  if (state.skills) {
    for (var sk in state.skills) {
      if (state.skills.hasOwnProperty(sk)) {
        baseline.skillsSnapshot[sk] = {
          xp: state.skills[sk].xp || 0,
          level: state.skills[sk].level || 1,
        };
      }
    }
  }

  // 保存 investment 快照
  if (state.investment && state.investment.stockMarket) {
    for (var sym in state.investment.stockMarket) {
      if (state.investment.stockMarket.hasOwnProperty(sym)) {
        var sm = state.investment.stockMarket[sym];
        baseline.investmentSnapshot[sym] = {
          price: sm.price || 0,
          openPrice: sm.openPrice || sm.price || 0,
        };
      }
    }
    if (state.investment.btcPrice) {
      baseline.btcPriceBefore = state.investment.btcPrice;
      baseline.btcFearGreedBefore = state.investment.btcFearGreed || 50;
    }
  }

  return baseline;
}

/**
 * 回滚开局新闻效果（v3.64 新增）
 * 当 intro news 过期时，恢复到应用前的状态
 * @param {Object} state - 游戏状态
 * @param {Object} baseline - 基准快照
 */
function rollbackIntroNewsEffects(state, baseline) {
  if (!state || !baseline) return;

  // 恢复 _jobMultipliers
  if (state._jobMultipliers) {
    for (var kj in state._jobMultipliers) {
      if (state._jobMultipliers.hasOwnProperty(kj)) {
        // 如果 baseline 中没有这个键，说明是 intro news 加的，直接删除
        if (baseline._jobMultipliers[kj] === undefined) {
          delete state._jobMultipliers[kj];
        } else {
          // 否则恢复到 baseline 值
          state._jobMultipliers[kj] = baseline._jobMultipliers[kj];
        }
      }
    }
  }

  // 恢复 _allJobsBonus
  if (baseline._allJobsBonus !== undefined) {
    state._allJobsBonus = baseline._allJobsBonus;
  }

  // 恢复 goodsPrices
  if (baseline.goodsPricesSnapshot && state.trade && state.trade.goodsPrices) {
    for (var loc in baseline.goodsPricesSnapshot) {
      if (
        baseline.goodsPricesSnapshot.hasOwnProperty(loc) &&
        state.trade.goodsPrices[loc]
      ) {
        for (var good in baseline.goodsPricesSnapshot[loc]) {
          if (
            baseline.goodsPricesSnapshot[loc].hasOwnProperty(good) &&
            state.trade.goodsPrices[loc][good] !== undefined
          ) {
            state.trade.goodsPrices[loc][good] =
              baseline.goodsPricesSnapshot[loc][good];
          }
        }
      }
    }
  }

  // 恢复技能 XP（只回滚 intro news 增加的）
  if (baseline.skillsSnapshot && state.skills) {
    for (var sk in baseline.skillsSnapshot) {
      if (baseline.skillsSnapshot.hasOwnProperty(sk) && state.skills[sk]) {
        state.skills[sk].xp = baseline.skillsSnapshot[sk].xp;
      }
    }
  }

  // 恢复投资价格
  if (
    baseline.investmentSnapshot &&
    state.investment &&
    state.investment.stockMarket
  ) {
    for (var sym in baseline.investmentSnapshot) {
      if (
        baseline.investmentSnapshot.hasOwnProperty(sym) &&
        state.investment.stockMarket[sym]
      ) {
        state.investment.stockMarket[sym].price =
          baseline.investmentSnapshot[sym].price;
        state.investment.stockMarket[sym].openPrice =
          baseline.investmentSnapshot[sym].openPrice;
      }
    }
  }
  if (baseline.btcPriceBefore !== undefined && state.investment) {
    state.investment.btcPrice = baseline.btcPriceBefore;
    state.investment.btcFearGreed = baseline.btcFearGreedBefore;
  }
}

/**
 * v3.65 更新：开局新闻效果不再"锁死30天再回滚"
 * 新原则：
 *   1. 开局新闻只设置世界参数的初始值（sectorHeat / marketMood 的起点）
 *   2. 每日新闻持续在此基础上叠加/修改，世界状态自然演变
 *   3. 不再有"30天回滚"的概念——那会破坏沉浸感，让玩家感到世界突然"重置"
 *   4. intro news 的效果通过 _introNewsApplied 标记，确保只应用一次
 *   5. 后续每日新闻正常通过 cleanupExpiredNews 清理过期效果
 */

/**
 * 将开局新闻的直接影响应用到游戏状态（v3.65 更新：不设持久锁定）
 * 在 applyWorldNewsToParams 之后调用，确保所有效果都已生效
 * @param {Object} state - 游戏状态
 * @param {Array} selectedNews - 选中的新闻条目
 */
function applyIntroNewsDirectEffects(state, selectedNews) {
  if (!state || !selectedNews || selectedNews.length === 0) return;

  // --- 1. 应用工作加成（与 news.js 保持一致，使用 _jobMultipliers） ---
  if (state._introJobBonuses) {
    var jobBonusEntries = Object.keys(state._introJobBonuses);
    if (jobBonusEntries.length > 0) {
      state._jobMultipliers = state._jobMultipliers || {};
      for (var jbi = 0; jbi < jobBonusEntries.length; jbi++) {
        var jid = jobBonusEntries[jbi];
        state._jobMultipliers[jid] =
          (state._jobMultipliers[jid] || 1) * state._introJobBonuses[jid];
      }
    }
    delete state._introJobBonuses;
  }

  // --- 2. 应用价格修正（直接修改 goodsPrices，与 news.js applyNewsEffect 一致） ---
  if (state._introPriceMods) {
    var priceModEntries = Object.keys(state._introPriceMods);
    if (priceModEntries.length > 0 && state.trade && state.trade.goodsPrices) {
      for (var pmi = 0; pmi < priceModEntries.length; pmi++) {
        var goodId = priceModEntries[pmi];
        var mod = state._introPriceMods[goodId];
        if (mod !== 1.0) {
          for (var locKey in state.trade.goodsPrices) {
            var prices = state.trade.goodsPrices[locKey];
            if (prices && prices[goodId]) {
              prices[goodId] = Math.round(prices[goodId] * mod * 100) / 100;
            }
          }
        }
      }
    }
    delete state._introPriceMods;
  }

  // --- 3. 应用技能经验加成 ---
  if (state._introSkillXp) {
    var skillXpEntries = Object.keys(state._introSkillXp);
    if (skillXpEntries.length > 0 && state.skills) {
      for (var ski = 0; ski < skillXpEntries.length; ski++) {
        var sk = skillXpEntries[ski];
        if (state.skills[sk]) {
          state.skills[sk].xp =
            (state.skills[sk].xp || 0) + state._introSkillXp[sk];
        }
      }
    }
    delete state._introSkillXp;
  }

  // --- 4. 应用初始资金调整 ---
  if (state._introCashBonus) {
    state.resources.cash = (state.resources.cash || 0) + state._introCashBonus;
    delete state._introCashBonus;
  }

  // --- 5. 应用投资市场开盘价修正 ---
  if (state.investment && state.investment.stockMarket) {
    for (var ni = 0; ni < selectedNews.length; ni++) {
      var nn = selectedNews[ni];
      if (!nn.investmentEffect || !Array.isArray(nn.investmentEffect)) continue;
      var inv = state.investment;
      var hasInvStocks = typeof INV_STOCKS !== "undefined";
      if (!hasInvStocks) continue;

      for (var ei = 0; ei < nn.investmentEffect.length; ei++) {
        var rule = nn.investmentEffect[ei];
        var mul = rule.mul || 1.0;
        if (mul === 1.0) continue;

        // 比特币专项
        if (rule.btc && inv.btcPrice) {
          inv.btcPrice = Math.max(1000, Math.round(inv.btcPrice * mul));
          inv.btcFearGreed = Math.max(
            5,
            Math.min(95, (inv.btcFearGreed || 50) + (mul > 1 ? 15 : -15)),
          );
          continue;
        }

        for (var si = 0; si < INV_STOCKS.length; si++) {
          var stock = INV_STOCKS[si];
          var mkt = inv.stockMarket[stock.symbol];
          if (!mkt) continue;

          var hit = false;
          if (rule.allStocks) hit = true;
          if (rule.industry && stock.industry === rule.industry) hit = true;
          if (rule.category && stock.category === rule.category) hit = true;
          if (rule.symbols && rule.symbols.indexOf(stock.symbol) >= 0)
            hit = true;

          if (hit) {
            mkt.openPrice = mkt.price; // 记录开盘价
            mkt.price = Math.max(0.01, Math.round(mkt.price * mul * 100) / 100);
          }
        }
      }
    }
  }

  // --- 6. 标记 intro news 已应用（防止重复应用） ---
  state._introNewsApplied = true;
}

// ============================================================
//  四、UI 显示系统
// ============================================================

var _worldNewsSelected = null; // 存储本局选中的新闻
var _playerIntroChoice = null; // 存储玩家在开局的选择

/**
 * v3.76 重构：构建开局选择面板
 * 原则：
 *   1. 每条新闻最多产生 1 个选项，避免无关选项堆砌
 *   2. 每个选项直接引用该条新闻的具体内容，杜绝通用模板
 *   3. 最多 3 个选项（认知负荷原则）
 *   4. 如果新闻不涉及任何已知方向，只给中性建议，不强行凑
 */
function buildIntroChoicePanel(scenarioId, newsItems) {
  if (!newsItems || newsItems.length === 0) return "";

  var choices = [];
  var usedTypes = {}; // 防止同类选项重复

  /**
   * 取标题短摘要（用于选项文本中引用）
   */
  function _snip(headline, maxLen) {
    maxLen = maxLen || 14;
    if (!headline) return "";
    if (headline.length <= maxLen) return headline;
    return headline.slice(0, maxLen) + "…";
  }

  /**
   * 判断一条新闻的主要主题，返回主题ID + 置信度
   */
  function _classify(news) {
    var tag = news.tag || "";
    var headline = news.headline || "";
    var detail = news.detail || "";
    var note = (news.worldEffect && news.worldEffect.note) || "";
    var text = tag + " " + headline + " " + detail + " " + note;

    // 按优先级检查（得分高的优先）
    if (/裁员|失业|下岗|降薪/.test(text))
      return { id: "start_side_hustle", theme: "layoff" };
    if (/AI|编程|芯片|机器人|数字化|大模型|半导体/.test(text))
      return { id: "study_tech", theme: "tech" };
    if (/招聘|抢人|用工(荒|缺)|人力/.test(text))
      return { id: "find_work", theme: "hiring" };
    if (/房价|租房|租金|城中村|拆迁|保交楼|房产/.test(text))
      return { id: "secure_housing", theme: "housing" };
    if (/新能源|技工|焊工|电工|制造业|工厂/.test(text))
      return { id: "learn_trade", theme: "manufacturing" };
    if (/物价|通胀|涨价|降价|促销/.test(text))
      return { id: "save_money", theme: "price" };
    if (/股市|沪指|基金|理财|投资|牛市|加密/.test(text))
      return { id: "watch_market", theme: "market" };
    if (/补贴|扶持|政策|降准|降息/.test(text))
      return { id: "grab_opportunity", theme: "policy" };
    if (/养老|医疗|健康|心理|焦虑|抑郁/.test(text))
      return { id: "build_network", theme: "social" };
    if (/毕业|应届|高校|大学生/.test(text))
      return { id: "upgrade_skills", theme: "graduation" };
    if (/春节|618|双十一|黄金周|旺季|节日/.test(text))
      return { id: "catch_season", theme: "seasonal" };
    if (/寒潮|高温|暴雨|台风/.test(text))
      return { id: "prepare_weather", theme: "weather" };

    // 按 tag 兜底
    if (tag === "科技") return { id: "study_tech", theme: "tech" };
    if (tag === "就业") return { id: "find_work", theme: "hiring" };
    if (tag === "消费") return { id: "save_money", theme: "price" };
    if (tag === "房产") return { id: "secure_housing", theme: "housing" };
    if (tag === "政策") return { id: "grab_opportunity", theme: "policy" };
    if (tag === "社会") return { id: "build_network", theme: "social" };
    if (tag === "季节" || tag === "节日")
      return { id: "catch_season", theme: "seasonal" };
    if (tag === "天气") return { id: "prepare_weather", theme: "weather" };

    return null; // 无法归类
  }

  // ---- 逐条新闻分析，每条最多 1 个选项 ----
  for (var i = 0; i < newsItems.length && choices.length < 3; i++) {
    var news = newsItems[i];
    var classified = _classify(news);
    if (!classified) continue;
    if (usedTypes[classified.id]) continue; // 同类不重复
    usedTypes[classified.id] = true;

    var snippet = _snip(news.headline, 14);
    var choice = null;

    switch (classified.id) {
      case "study_tech":
        choice = {
          id: "study_tech",
          text: "💻 关注" + (snippet || "科技") + "趋势，学技能",
          hint: "技术迭代快，投资自己抗风险",
          cost: 200,
          effect: {
            cash: -200,
            skills: { coding: 10 },
            needs: { intelligence: 5 },
            flags: { _introStudyTech: true },
          },
        };
        break;

      case "start_side_hustle":
        choice = {
          id: "start_side_hustle",
          text: "🛒 市场承压，" + (snippet || "先搞零钱"),
          hint: "灵活就业快速入账，但体力消耗大",
          effect: {
            cash: 100,
            needs: { fatigue: 5 },
            flags: { _introSideHustle: true },
          },
        };
        break;

      case "find_work":
        choice = {
          id: "find_work",
          text: "💼 " + (snippet || "招聘季") + "，趁热找工作",
          hint: "岗位多的时候机会更好找",
          effect: {
            flags: { _introFoundWorkEarly: true },
          },
        };
        break;

      case "secure_housing":
        choice = {
          id: "secure_housing",
          text: "🏠 " + (snippet || "租房市场变化") + "，先落脚",
          hint: "稳定的住处是打工人的底气",
          effect: {
            flags: { _introSecureHousing: true },
          },
        };
        break;

      case "learn_trade":
        choice = {
          id: "learn_trade",
          text: "🔧 " + (snippet || "制造业") + "缺人，学门手艺",
          hint: "技术工越老越吃香，门槛低收入稳",
          cost: 100,
          effect: {
            cash: -100,
            flags: { _introLearnTrade: true },
          },
        };
        break;

      case "save_money":
        choice = {
          id: "save_money",
          text: "🏦 物价波动，" + (snippet || "先守住钱包"),
          hint: "把钱存定期，等形势明朗再动",
          effect: {
            cash: -50,
            flags: { _introSavedMoney: true },
          },
        };
        break;

      case "watch_market":
        choice = {
          id: "watch_market",
          text: "📊 市场有动静，" + (snippet || "先摸清行情"),
          hint: "花时间研究投资方向，不花钱但费精力",
          effect: {
            needs: { fatigue: 3 },
            flags: { _introWatchMarket: true },
          },
        };
        break;

      case "grab_opportunity":
        choice = {
          id: "grab_opportunity",
          text: "🎯 政策有变，" + (snippet || "顺势而为"),
          hint: "借着政策东风找出路",
          effect: {
            flags: { _introGrabOpportunity: true },
          },
        };
        break;

      case "build_network":
        choice = {
          id: "build_network",
          text: "🤝 " + (snippet || "社会民生") + "，多交朋友",
          hint: "在这座城市，人脉就是资源",
          effect: {
            needs: { happiness: 3 },
            flags: { _introBuildNetwork: true },
          },
        };
        break;

      case "upgrade_skills":
        choice = {
          id: "upgrade_skills",
          text: "📚 " + (snippet || "学历通胀") + "，给自己充电",
          hint: "技能和证书是硬通货",
          cost: 80,
          effect: {
            cash: -80,
            needs: { intelligence: 3 },
            flags: { _introUpgradeSkills: true },
          },
        };
        break;

      case "catch_season":
        choice = {
          id: "catch_season",
          text: "🎉 " + (snippet || "旺季来了") + "，趁机赚一笔",
          hint: "过了这个村就没这个店了",
          effect: {
            cash: 50,
            needs: { fatigue: 8 },
            flags: { _introCatchSeason: true },
          },
        };
        break;

      case "prepare_weather":
        choice = {
          id: "prepare_weather",
          text: "🌂 天气预警，" + (snippet || "注意防护"),
          hint: "安全第一，减少不必要外出",
          effect: {
            needs: { health: 3 },
            flags: { _introPrepareWeather: true },
          },
        };
        break;

      default:
        continue;
    }

    if (choice) choices.push(choice);
  }

  // --- 保底逻辑 ---
  if (choices.length === 0) {
    choices.push({
      id: "observe_world",
      text: "👀 先观察一段时间",
      hint: "不急，看看形势再行动",
      effect: {
        needs: { intelligence: 3 },
        flags: { _introObserveWorld: true },
      },
    });
  }

  if (choices.length === 0) return "";

  // 构建 HTML
  var html =
    '<div class="world-news-choice-section">' +
    '<div class="world-news-choice-title">🤔 面对这个世界的变化，你决定：</div>';

  for (var ci = 0; ci < choices.length; ci++) {
    var ch = choices[ci];
    html +=
      '<div class="world-news-choice-option" data-choice="' +
      ch.id +
      '">' +
      '<div class="world-news-choice-text">' +
      ch.text +
      "</div>" +
      '<div class="world-news-choice-hint">' +
      ch.hint +
      (ch.cost ? "（需要¥" + ch.cost + "）" : "") +
      "</div>" +
      "</div>";
  }

  html += "</div>";
  return html;
}

/**
 * 处理玩家在开局选择面板中的选择
 * @param {string} choiceId - 选择的 ID
 * @param {Object} state - 游戏状态
 */
function applyIntroChoice(choiceId, state) {
  if (!state || !choiceId) return;
  _playerIntroChoice = choiceId;

  var choicesMap = {
    study_tech: {
      apply: function (st) {
        st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
        st.skills = st.skills || {};
        st.skills.coding = st.skills.coding || { level: 1, xp: 0 };
        st.skills.coding.xp = (st.skills.coding.xp || 0) + 10;
        st.needs.intelligence = Math.min(100, (st.needs.intelligence || 0) + 5);
        st.flags._introStudyTech = true;
      },
      msg: "💻 你报名了编程培训班，花了¥200。编码技能经验+10，智力需求+5。",
    },
    start_side_hustle: {
      apply: function (st) {
        st.resources.cash = (st.resources.cash || 0) + 100;
        st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
        st.flags._introSideHustle = true;
      },
      msg: "🛒 你找了份零工过渡，赚了¥100。虽然辛苦，但先站稳脚跟。",
    },
    save_money: {
      apply: function (st) {
        st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
        st.flags._introSavedMoney = true;
      },
      msg: "🏦 你把¥50存进了定期。虽然收益不高，但心里踏实。",
    },
    find_work: {
      apply: function (st) {
        st.flags._introFoundWorkEarly = true;
      },
      msg: "💼 你决定立刻找工作。先站稳脚跟，再图发展。",
    },
    secure_housing: {
      apply: function (st) {
        st.flags._introSecureHousing = true;
      },
      msg: "🏠 你仔细研究了租房市场，找到了一个性价比不错的住处。在这个城市，稳定的住所就是底气。",
    },
    learn_trade: {
      apply: function (st) {
        st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100);
        st.flags._introLearnTrade = true;
      },
      msg: "🔧 你报了一个技工培训班，花了¥100。学一门手艺，走到哪里都不怕。",
    },
    build_network: {
      apply: function (st) {
        st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
        st.flags._introBuildNetwork = true;
      },
      msg: "🤝 你主动认识了几个老乡和新朋友。在这座城市，人脉就是资源。",
    },
    upgrade_skills: {
      apply: function (st) {
        st.resources.cash = Math.max(0, (st.resources.cash || 0) - 80);
        st.needs.intelligence = Math.min(100, (st.needs.intelligence || 0) + 3);
        st.flags._introUpgradeSkills = true;
      },
      msg: "📚 你买了一本技能教材，花了¥80。知识就是力量，慢慢学。",
    },
    catch_season: {
      apply: function (st) {
        st.resources.cash = (st.resources.cash || 0) + 50;
        st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);
        st.flags._introCatchSeason = true;
      },
      msg: "🎉 你抓住了旺季机会，虽然累了一些，但赚了¥50 extra。",
    },
    prepare_weather: {
      apply: function (st) {
        st.needs.health = Math.min(100, (st.needs.health || 0) + 3);
        st.flags._introPrepareWeather = true;
      },
      msg: "🌂 你做好了防护措施。天气虽恶劣，但平安就是最大的财富。",
    },
    observe_world: {
      apply: function (st) {
        st.needs.intelligence = Math.min(100, (st.needs.intelligence || 0) + 3);
        st.flags._introObserveWorld = true;
      },
      msg: "👀 你没有急着行动，而是花了一天时间观察这个世界。对形势有了更清晰的认识。",
    },
    explore_city: {
      apply: function (st) {
        st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
        st.flags._introExploredCity = true;
      },
      msg: "🚶 你花了半天逛了逛城市，心情好了不少。对这座城市有了初步了解。",
    },
  };

  var ch = choicesMap[choiceId];
  if (ch) {
    ch.apply(state);
    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      StateManager.addMessage(ch.msg, "info");
    }
  }
}

/**
 * 显示开局世界新闻弹窗
 * @param {string|null} scenarioId - 当前剧本ID
 * @param {Function} onConfirm - 点击确认后的回调
 * @param {Array|null} externalNews - 外部传入的新闻（如实时新闻），null则从预存库选取
 */
function showWorldNewsIntro(scenarioId, onConfirm, externalNews) {
  // 选择新闻：优先使用外部传入的实时新闻
  if (externalNews && externalNews.length > 0) {
    // 确保最多 displayCount 条
    var displayCount = REAL_TIME_NEWS_CONFIG.displayCount || 4;
    _worldNewsSelected = externalNews.slice(0, displayCount);
  } else {
    _worldNewsSelected = selectWorldNewsForGame(scenarioId);
  }

  // 构建时间描述
  var now = new Date();
  var months = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];
  var dateStr =
    now.getFullYear() + "年" + months[now.getMonth()] + now.getDate() + "日";

  // 构建新闻HTML
  var newsHtml = "";
  var newsItems = _worldNewsSelected;
  for (var i = 0; i < newsItems.length; i++) {
    var news = newsItems[i];
    var moodClass = "";
    if (news.worldEffect) {
      if (news.worldEffect.marketMood === "bullish")
        moodClass = "world-news-mood-up";
      else if (news.worldEffect.marketMood === "bearish")
        moodClass = "world-news-mood-down";
      else if (news.worldEffect.marketMood === "volatile")
        moodClass = "world-news-mood-volatile";
    }

    newsHtml +=
      '<div class="world-news-item ' +
      moodClass +
      '">' +
      '<div class="world-news-item-header">' +
      '<span class="world-news-icon">' +
      news.icon +
      "</span>" +
      '<span class="world-news-tag">' +
      news.tag +
      "</span>" +
      "</div>" +
      '<div class="world-news-headline">' +
      news.headline +
      "</div>" +
      '<div class="world-news-detail">' +
      news.detail +
      "</div>" +
      (news.worldEffect && news.worldEffect.note
        ? '<div class="world-news-effect">💡 ' +
          news.worldEffect.note +
          "</div>"
        : "") +
      "</div>";
  }

  // 剧本特色描述
  var scenarioIntro = getScenarioWorldContext(scenarioId);

  // v2.0 新增：开局选择面板 — 让玩家对世界新闻做出反应，影响初始状态
  var introChoicesHtml = buildIntroChoicePanel(scenarioId, _worldNewsSelected);

  // 构建完整HTML
  // 判断是否为实时新闻
  var isRealTime =
    externalNews && externalNews.length > 0 && externalNews[0]._isRealTime;
  var realTimeBadge = isRealTime
    ? '<span class="world-news-realtime-badge">🔴 实时</span>'
    : "";

  var html =
    '<div id="world-news-intro-overlay" class="world-news-overlay">' +
    '<div class="world-news-panel">' +
    // 顶部标题区
    '<div class="world-news-header">' +
    '<div class="world-news-title-row">' +
    '<span class="world-news-logo">📺</span>' +
    '<span class="world-news-title">今日头条</span>' +
    realTimeBadge +
    '<span class="world-news-date">' +
    dateStr +
    "</span>" +
    "</div>" +
    '<div class="world-news-subtitle">' +
    scenarioIntro +
    "</div>" +
    "</div>" +
    // 新闻列表
    '<div class="world-news-list">' +
    newsHtml +
    "</div>" +
    // v2.0 新增：开局选择面板
    introChoicesHtml +
    // 底部说明
    '<div class="world-news-footer">' +
    '<div class="world-news-footer-text">以上是你踏上这段旅程时，<strong>这个世界正在发生的事</strong>。<br>它将成为这局游戏世界的底色与初始基调。<br><em>做出你的第一个选择，改变这局游戏的起点。</em></div>' +
    '<button class="world-news-start-btn" id="world-news-start-btn">▶ 带着这个世界，出发</button>' +
    "</div>" +
    "</div>" +
    "</div>";

  // 注入DOM
  var container = document.createElement("div");
  container.id = "world-news-intro-container";
  container.innerHTML = html;
  document.body.appendChild(container);

  // 绑定选择面板事件
  var choiceOptions = container.querySelectorAll(".world-news-choice-option");
  for (var co = 0; co < choiceOptions.length; co++) {
    choiceOptions[co].addEventListener("click", function () {
      // 清除之前的选中状态
      for (var o = 0; o < choiceOptions.length; o++) {
        choiceOptions[o].classList.remove("selected");
      }
      this.classList.add("selected");
      _playerIntroChoice = this.getAttribute("data-choice");
    });
  }

  // 绑定按钮事件
  var startBtn = document.getElementById("world-news-start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      // 移除弹窗
      var c = document.getElementById("world-news-intro-container");
      if (c) {
        c.classList.add("world-news-fadeout");
        setTimeout(function () {
          if (c.parentNode) c.parentNode.removeChild(c);
        }, 400);
      }
      // 触发回调
      if (typeof onConfirm === "function") {
        onConfirm(_worldNewsSelected);
      }
    });
  }

  // 入场动画
  setTimeout(function () {
    var overlay = document.getElementById("world-news-intro-overlay");
    if (overlay) overlay.classList.add("world-news-visible");
  }, 50);
}

/**
 * 获取不同剧本的世界背景描述
 */
function getScenarioWorldContext(scenarioId) {
  var contexts = {
    classic: "你揣着几百块钱，第一次踏进这座没有给你留位置的城市。",
    laid_off: "厂子黄了，工牌交出去的那天，你知道必须找条新路。",
    small_town_grinder:
      "十几年寒窗，你带着全家的期望，来到这座比想象中更残酷的大城市。",
    foreign_worker: "语言不通，人脸不熟，但月月还要往老家汇钱——这是你的现实。",
    second_gen: "你不缺钱，但你缺少一件东西：证明自己的机会。",
    midlife_crisis: "四十岁，上有老下有小，公司突然把你叫进了HR办公室。",
    fresh_grad: "拿着一张文凭，对着陌生城市，你意识到学校没教你最重要的一课。",
  };
  return contexts[scenarioId] || "你站在城市的入口，准备开始这段旅程。";
}

// ============================================================
//  五、主入口 — 开局调用点
// ============================================================

/**
 * 开局世界新闻系统主入口
 * 在游戏状态初始化完成、进入游戏之前调用
 *
 * 流程：
 *   1. 优先使用缓存的实时新闻（从互联网抓取）
 *   2. 实时新闻不可用则使用预存数据库（按月份+剧本筛选）
 *   3. 显示弹窗 → 用户确认 → 应用世界参数 → 进入游戏
 *
 * @param {Object} state         - 已初始化的游戏状态
 * @param {string|null} scenarioId - 剧本ID
 * @param {Function} enterGame   - 进入游戏的回调（执行显示app、renderAll等）
 */
function startWithWorldNewsIntro(state, scenarioId, enterGame) {
  // 尝试获取缓存的实时新闻
  var realNews = getCachedRealNews();

  if (realNews && realNews.length >= 2) {
    // ── 有实时新闻，直接展示 ──
    showWorldNewsIntro(
      scenarioId,
      function (selectedNews) {
        applyNewsAndEnter(selectedNews, state, enterGame, scenarioId);
      },
      realNews,
    );
  } else if (_realNewsStatus === "loading") {
    // ── 实时新闻还在加载中，显示加载等待 ──
    showLoadingAndWaitForNews(scenarioId, state, enterGame);
  } else {
    // ── 实时新闻不可用，使用预存新闻 ──
    showWorldNewsIntro(
      scenarioId,
      function (selectedNews) {
        applyNewsAndEnter(selectedNews, state, enterGame, scenarioId);
      },
      null,
    );
  }
}

/**
 * 显示加载等待界面，等待实时新闻抓取完成
 */
function showLoadingAndWaitForNews(scenarioId, state, enterGame) {
  var now = new Date();
  var months = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];
  var dateStr =
    now.getFullYear() + "年" + months[now.getMonth()] + now.getDate() + "日";
  var scenarioIntro = getScenarioWorldContext(scenarioId);

  var html =
    '<div id="world-news-intro-overlay" class="world-news-overlay">' +
    '<div class="world-news-panel world-news-loading-panel">' +
    // 顶部标题区
    '<div class="world-news-header">' +
    '<div class="world-news-title-row">' +
    '<span class="world-news-logo">📡</span>' +
    '<span class="world-news-title">正在获取今日新闻</span>' +
    '<span class="world-news-date">' +
    dateStr +
    "</span>" +
    "</div>" +
    '<div class="world-news-subtitle">' +
    scenarioIntro +
    "</div>" +
    "</div>" +
    // 加载动画
    '<div class="world-news-loading">' +
    '<div class="world-news-loading-spinner"></div>' +
    '<div class="world-news-loading-text">正在从互联网获取今日实时新闻...</div>' +
    '<div class="world-news-loading-sub">这将成为你本局游戏的<strong>世界基调</strong></div>' +
    '<div class="world-news-loading-progress">' +
    '<div class="world-news-loading-bar" id="news-loading-bar"></div>' +
    "</div>" +
    "</div>" +
    // 底部按钮
    '<div class="world-news-footer">' +
    '<button class="world-news-skip-btn" id="world-news-skip-btn">跳过等待，使用本地新闻 →</button>' +
    "</div>" +
    "</div>" +
    "</div>";

  var container = document.createElement("div");
  container.id = "world-news-intro-container";
  container.innerHTML = html;
  document.body.appendChild(container);

  // 入场动画
  setTimeout(function () {
    var overlay = document.getElementById("world-news-intro-overlay");
    if (overlay) overlay.classList.add("world-news-visible");
  }, 50);

  // 加载进度条动画
  var progressBar = document.getElementById("news-loading-bar");
  if (progressBar) {
    // 3秒内逐步前进到 85%，然后等待完成或超时
    progressBar.style.transition = "width 2.5s ease-in-out";
    setTimeout(function () {
      progressBar.style.width = "85%";
    }, 100);
  }

  // 最大等待时间 — 3.5秒后如果还没加载完成，自动降级
  var fallbackTimer = setTimeout(function () {
    finishLoadingFallback(scenarioId, state, enterGame);
  }, 3500);

  // 轮询检查实时新闻是否加载完成
  var pollInterval = setInterval(function () {
    var cached = getCachedRealNews();
    if (cached && cached.length >= 2) {
      clearTimeout(fallbackTimer);
      clearInterval(pollInterval);
      // 加载完成，显示实时新闻
      replaceLoadingWithNews(scenarioId, state, enterGame, cached);
    }
  }, 200);

  // 绑定"跳过"按钮
  var skipBtn = document.getElementById("world-news-skip-btn");
  if (skipBtn) {
    skipBtn.addEventListener("click", function () {
      clearTimeout(fallbackTimer);
      clearInterval(pollInterval);
      finishLoadingFallback(scenarioId, state, enterGame);
    });
  }

  // 保存清理函数
  _loadingCleanup = function () {
    clearTimeout(fallbackTimer);
    clearInterval(pollInterval);
  };
}

var _loadingCleanup = null; // 加载等待页面清理函数

/**
 * 加载等待降级：使用预存新闻
 */
function finishLoadingFallback(scenarioId, state, enterGame) {
  if (_loadingCleanup) {
    _loadingCleanup();
    _loadingCleanup = null;
  }

  // 移除加载界面
  var container = document.getElementById("world-news-intro-container");
  if (container) {
    container.classList.add("world-news-fadeout");
    setTimeout(function () {
      if (container.parentNode) container.parentNode.removeChild(container);
      // 用预存新闻展示
      showWorldNewsIntro(
        scenarioId,
        function (selectedNews) {
          applyNewsAndEnter(selectedNews, state, enterGame, scenarioId);
        },
        null,
      );
    }, 300);
  } else {
    showWorldNewsIntro(
      scenarioId,
      function (selectedNews) {
        applyNewsAndEnter(selectedNews, state, enterGame, scenarioId);
      },
      null,
    );
  }
}

/**
 * 加载完成后，将加载界面替换为实时新闻展示
 */
function replaceLoadingWithNews(scenarioId, state, enterGame, realNews) {
  if (_loadingCleanup) {
    _loadingCleanup();
    _loadingCleanup = null;
  }

  // 移除加载界面
  var container = document.getElementById("world-news-intro-container");
  if (container) {
    if (container.parentNode) container.parentNode.removeChild(container);
  }

  // 用实时新闻展示
  showWorldNewsIntro(
    scenarioId,
    function (selectedNews) {
      applyNewsAndEnter(selectedNews, state, enterGame, scenarioId);
    },
    realNews,
  );
}

/**
 * 应用新闻效果并进入游戏（统一回调 v2.0 — 深度联动）
 * 流程：
 *   1. 应用世界参数偏差（sectorHeat + marketMood）
 *   2. 应用直接游戏效果（工作加成/价格修正/技能XP/资金调整/投资开盘价）
 *   3. 将开局新闻注入 activeNews（让投资/价格/事件等引擎读取）
 *   4. 在消息日志写入氛围背景 + 具体影响说明
 *   5. 进入游戏
 *
 * v2.0 改动：
 *   - 新闻的 investmentEffect/worldEffect/jobBonus/priceMod 全部实际生效
 *   - activeNews 同时保留原始ID和 "intro_" 前缀ID，确保 news_driven_events.js 能匹配
 *   - 每条新闻的影响都以消息形式告知玩家"这对你的打工生活意味着什么"
 */
function applyNewsAndEnter(selectedNews, state, enterGame, scenarioId) {
  if (selectedNews && selectedNews.length > 0) {
    // Step 1: 应用世界参数偏差
    applyWorldNewsToParams(state, selectedNews);

    // Step 2: 应用直接游戏效果（工作加成/价格修正/技能XP/资金/投资开盘价）
    applyIntroNewsDirectEffects(state, selectedNews);

    // Step 3: 将开局新闻注入 activeNews 队列
    // 关键：同时保留原始ID和 "intro_" 前缀ID，确保所有下游系统都能匹配
    state.activeNews = state.activeNews || [];
    var appliedNewsIds = [];

    for (var ai = 0; ai < selectedNews.length; ai++) {
      var nn = selectedNews[ai];

      // 构建完整的 effects 对象（合并 investmentEffect + worldEffect 中的 jobBonus/priceMod 等）
      var combinedEffects = {};

      // 投资市场联动
      if (nn.investmentEffect && nn.investmentEffect.length > 0) {
        combinedEffects.investmentEffect = nn.investmentEffect;
      }

      // 工作加成/惩罚
      if (nn.worldEffect) {
        if (nn.worldEffect.jobBonus) {
          combinedEffects.jobBonus = nn.worldEffect.jobBonus;
          combinedEffects.jobMultiplier = nn.worldEffect.jobMultiplier || 1.1;
        }
        if (nn.worldEffect.jobPenalty) {
          combinedEffects.jobPenalty = nn.worldEffect.jobPenalty;
          combinedEffects.jobMultiplier = nn.worldEffect.jobMultiplier || 0.7;
        }
        if (nn.worldEffect.allJobsBonus) {
          combinedEffects.allJobsBonus = nn.worldEffect.allJobsBonus;
        }
        if (nn.worldEffect.priceMod) {
          combinedEffects.priceMod = nn.worldEffect.priceMod;
        }
        if (nn.worldEffect.duration) {
          combinedEffects.duration = nn.worldEffect.duration;
        }
      }

      // 如果没有可应用的 effects，仍然注入 headline
      // v3.76: 改用完整 effects 对象，让 cleanupExpiredNews 能正确识别 jobMultiplier 并每日衰减
      combinedEffects.duration = combinedEffects.duration || 15; // 开局新闻持久15天，线性衰减
      var entry = {
        id: nn.id, // 使用原始ID — 让 news_driven_events.js 能直接匹配
        headline: nn.icon + nn.headline,
        effects: combinedEffects, // 完整 effects 对象，供 cleanupExpiredNews 重建 _jobMultipliers
        _appliedDay: state.player ? state.player.day : 0,
        _isIntroNews: true,
        _originalId: nn.id,
        _tag: nn.tag || "社会",
        _note: nn.worldEffect && nn.worldEffect.note ? nn.worldEffect.note : "",
      };

      state.activeNews.push(entry);
      appliedNewsIds.push(nn.id);

      // 也注入带前缀的版本（兼容旧代码）
      var prefixedId = "intro_" + nn.id;
      var alreadyExists = state.activeNews.some(function (an) {
        return an.id === prefixedId;
      });
      if (!alreadyExists) {
        state.activeNews.push({
          id: prefixedId,
          headline: "📌 " + nn.headline,
          effects: { duration: 15 },
          _appliedDay: state.player ? state.player.day : 0,
          _isIntroNews: true,
          _originalId: nn.id,
        });
      }
    }

    // Step 4: 在消息日志写入氛围背景 + 具体影响说明
    var headlineList = selectedNews.map(function (n) {
      return n.icon + n.headline;
    });

    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      var isRealTime = selectedNews[0] && selectedNews[0]._isRealTime;

      // 4a. 显示时代背景
      if (isRealTime) {
        StateManager.addMessage(
          "📺 实时头条·时代背景：" + headlineList.slice(0, 2).join(" | "),
          "event",
        );
      } else {
        StateManager.addMessage(
          "🌐 世界参数已随机初始化 | 📺 时代背景：" +
            headlineList.slice(0, 2).join(" | "),
          "event",
        );
      }

      // 4b. 显示每条新闻的具体游戏影响
      for (var mi = 0; mi < selectedNews.length; mi++) {
        var mn = selectedNews[mi];
        var impactLines = [];

        // 工作影响
        if (mn.worldEffect && mn.worldEffect.jobBonus) {
          impactLines.push(
            "💼 工作：[" +
              mn.worldEffect.jobBonus.join(", ") +
              "] 收入×" +
              (mn.worldEffect.jobMultiplier || 1.1).toFixed(2),
          );
        }
        if (mn.worldEffect && mn.worldEffect.jobPenalty) {
          impactLines.push(
            "💼 工作：[" +
              mn.worldEffect.jobPenalty.join(", ") +
              "] 收入×" +
              (mn.worldEffect.jobMultiplier || 0.7).toFixed(2),
          );
        }
        if (mn.worldEffect && mn.worldEffect.allJobsBonus) {
          impactLines.push(
            "💼 所有工作收入 ×" + mn.worldEffect.allJobsBonus.toFixed(2),
          );
        }
        // 价格影响
        if (mn.worldEffect && mn.worldEffect.priceMod) {
          var priceMods = [];
          for (var pk in mn.worldEffect.priceMod) {
            if (mn.worldEffect.priceMod.hasOwnProperty(pk)) {
              var p = mn.worldEffect.priceMod[pk];
              if (p > 1)
                priceMods.push(pk + " ↑" + ((p - 1) * 100).toFixed(0) + "%");
              else if (p < 1)
                priceMods.push(pk + " ↓" + ((1 - p) * 100).toFixed(0) + "%");
            }
          }
          if (priceMods.length > 0)
            impactLines.push("🛒 物价：" + priceMods.join(", "));
        }
        // 技能影响
        if (mn.worldEffect && mn.worldEffect.skillXp) {
          var skillXpLines = [];
          for (var sk in mn.worldEffect.skillXp) {
            if (mn.worldEffect.skillXp.hasOwnProperty(sk)) {
              skillXpLines.push(sk + " +" + mn.worldEffect.skillXp[sk]);
            }
          }
          if (skillXpLines.length > 0)
            impactLines.push("📚 技能：" + skillXpLines.join(", "));
        }
        // 资金影响
        if (mn.worldEffect && mn.worldEffect.cashBonus) {
          impactLines.push("💰 资金：+" + mn.worldEffect.cashBonus);
        }
        if (mn.worldEffect && mn.worldEffect.cashLoss) {
          impactLines.push("💰 资金：-" + mn.worldEffect.cashLoss);
        }
        // 投资影响
        if (mn.investmentEffect && mn.investmentEffect.length > 0) {
          var invLines = [];
          for (var ii = 0; ii < mn.investmentEffect.length; ii++) {
            var ie = mn.investmentEffect[ii];
            if (ie.industry)
              invLines.push(ie.industry + " ×" + (ie.mul || 1).toFixed(2));
            if (ie.category)
              invLines.push(ie.category + " ×" + (ie.mul || 1).toFixed(2));
            if (ie.symbols)
              invLines.push(
                ie.symbols.join(",") + " ×" + (ie.mul || 1).toFixed(2),
              );
            if (ie.allStocks)
              invLines.push("全市场 ×" + (ie.mul || 1).toFixed(2));
            if (ie.btc) invLines.push("比特币 ×" + (ie.mul || 1).toFixed(2));
          }
          if (invLines.length > 0)
            impactLines.push("📈 投资：" + invLines.join(" | "));
        }
        // 行业热度
        if (mn.worldEffect && mn.worldEffect.sectorHeat) {
          var sectorLines = [];
          for (var sec in mn.worldEffect.sectorHeat) {
            if (mn.worldEffect.sectorHeat.hasOwnProperty(sec)) {
              var sv = mn.worldEffect.sectorHeat[sec];
              if (sv > 0)
                sectorLines.push(sec + " ↑" + (sv * 100).toFixed(0) + "%");
              else sectorLines.push(sec + " ↓" + (sv * 100).toFixed(0) + "%");
            }
          }
          if (sectorLines.length > 0)
            impactLines.push("🌍 行业：" + sectorLines.join(", "));
        }

        if (impactLines.length > 0) {
          StateManager.addMessage(
            "📌 " +
              mn.icon +
              " " +
              mn.headline +
              " → " +
              impactLines.join("；"),
            "info",
          );
        }
      }
    }
  }

  // Step 5: 应用玩家开局选择的影响
  if (_playerIntroChoice && state) {
    applyIntroChoice(_playerIntroChoice, state);
  }

  if (typeof enterGame === "function") {
    enterGame();
  }
}

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
    // 源1：直接抓取 RSS XML 解析（无需第三方转换服务，DOMParser 原生支持）
    rss_direct: {
      enabled: true,
      timeout: 5000,
      feeds: [
        {
          name: "36氪",
          url: "https://36kr.com/feed",
          category: "科技",
        },
      ],
    },
    // 源2：天行数据API（需注册免费Key，更稳定）
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
    // 源3：通过 CORS 代理直接抓取新闻页面（无需API Key，兜底用）
    // 源3：直连 CORS 代理（2026-07-06 已禁用 — allorigins.win 返回 408/CORS）
    direct: {
      enabled: false,
      // 使用与 world_params.js 相同的 CORS 代理
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
      /\b(?:裁员|失业|降薪|辞退|优化|毕业|就业|招聘|求职|岗位|打工|薪资|收入|工资|应届|找工作|offer)\b/,
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
    patterns: [
      /\b(?:房价|楼市|租房|房产|城中村|拆迁|房贷|地产|租金|购房|卖房)\b/,
    ],
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
      /\b(?:科技|AI|人工智能|芯片|互联网|数字化|5G|大数据|软件|程序|算法|机器人|半导体|新能源|自动驾驶)\b/,
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
      /\b(?:经济|GDP|通胀|通缩|CPI|PPI|PMI|利率|降准|降息|加息|准备金率|流动性|货币|财政|赤字|国债|地方债|人民币|汇率|美元|美联储|央行|货币政策|宏观经济|经济数据|经济指标|经济增速|经济增长|放缓|复苏|景气|衰退|萧条)\b/,
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
      /\b(?:股市|A股|港股|美股|基金|ETF|理财|投资|股票|指数|沪指|深指|创业板|科创板|北向资金|南向资金|主力资金|外资|流入|流出|开户|交易量|成交额|牛市|熊市|反弹|回调|震荡|涨停|跌停|IPO|上市|退市|分红|股息|回购|融资|配股|可转债|债券|收益率|年化|净值)\b/,
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
      /\b(?:政策|法规|监管|政府|税收|补贴|乡村振兴|改革|立法|新规|央行|银保监)\b/,
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
      /\b(?:消费|零售|电商|网购|购物|商品|物价|涨价|降价|促销|打折|双十一|618|直播带货|外卖|餐饮|旅游|酒店|票房|客流量|营收|销售额|门店|商家|商超|便利店|供销)\b/,
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
      /\b(?:养老|老龄化|社保|医保|退休|生育|出生率|人口|落户|户籍|低保|救助|慈善|公益|志愿者|社区|居委会|公共服务|入学|学区|摇号)\b/,
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
      /\b(?:春节|中秋|国庆|端午|清明|五一|618|双十一|双11|黄金周|寒潮|高温|台风|暴雨|雪灾|洪水)\b/,
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
    patterns: [
      /\b(?:新能源|光伏|风电|锂电池|电动车|充电桩|能源|油价|电力|煤炭|天然气)\b/,
    ],
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
        // 生成 note
        var moodMap = {
          bullish: "利好",
          bearish: "利空",
          neutral: "中性",
          volatile: "波动",
        };
        result.note =
          "实时新闻·" +
          result.tag +
          "行业" +
          (moodMap[result.marketMood] || "中性");
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
    result.marketMood = /\d+\.?\d*%/.test(text) ? "neutral" : "neutral";
    result.note = "实时新闻·经济（含数据指标）";
    return result;
  }

  // 2. 检查是否有金额/货币符号 → 很可能与商业/金融相关
  if (/[¥$￥]|亿元|万元|元\/|融资|营收|利润|成本|预算/.test(text)) {
    result.tag = "经济";
    result.sectorHeat = { 金融: 0.04, 消费: 0.02 };
    result.marketMood = "neutral";
    result.note = "实时新闻·经济";
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
    result.note = "实时新闻·产业";
    return result;
  }

  // 4. 检查是否有城市/交通/基建类词汇
  if (
    /城市|地铁|公交|高铁|机场|公路|基建|工程|建设|规划|新区|开发区/.test(text)
  ) {
    result.tag = "城市";
    result.sectorHeat = { 房地产: 0.04, 消费: 0.02 };
    result.marketMood = "neutral";
    result.note = "实时新闻·城市发展";
    return result;
  }

  // 5. 真正无匹配 → 用「综合」而非「社会」，情绪中性，轻微正面影响
  //    设计理由：完全不相关的新闻对游戏世界的影响应该最小化而非负面化
  result.sectorHeat = { 消费: 0.01 };
  result.marketMood = "neutral";
  result.note = "实时新闻·综合";
  return result;
}

/**
 * 根据分类标签和市场情绪生成 investmentEffect（让实时新闻也能影响投资市场）
 * @param {string} tag  - 分类标签
 * @param {string} mood - 市场情绪
 * @returns {Array} investmentEffect 数组
 */
function generateInvestmentEffectFromTag(tag, mood) {
  var isUp = mood === "bullish";
  var isDown = mood === "bearish";
  // 按标签映射行业和乘数
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
  };
  var entry = map[tag];
  if (!entry) return [];
  var mul = isUp ? entry.up : isDown ? entry.down : 1.0;
  if (mul === 1.0) return [];
  return [{ industry: entry.industry, mul: mul }];
}

/**
 * 从 RSS XML 直接抓取并解析（不需要第三方转换服务）
 * 使用浏览器原生 DOMParser 解析 XML
 */
function fetchFromRSSDirect(feed) {
  var timeout = REAL_TIME_NEWS_CONFIG.sources.rss_direct.timeout || 5000;

  return new Promise(function (resolve, reject) {
    var timeoutId = setTimeout(function () {
      reject(new Error("RSS timeout: " + feed.name));
    }, timeout);

    fetch(feed.url)
      .then(function (response) {
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error("HTTP " + response.status + " for " + feed.name);
        }
        return response.text();
      })
      .then(function (xmlText) {
        // 使用 DOMParser 解析 XML
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xmlText, "text/xml");

        // 检查解析错误
        var parseError = xmlDoc.querySelector("parsererror");
        if (parseError) {
          throw new Error("XML parse error for " + feed.name);
        }

        var items = xmlDoc.querySelectorAll("item");
        if (!items || items.length === 0) {
          throw new Error("No items in RSS feed: " + feed.name);
        }

        var newsItems = [];
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var titleEl = item.querySelector("title");
          var descEl = item.querySelector("description");
          var linkEl = item.querySelector("link");
          var dateEl = item.querySelector("pubDate");

          var title = titleEl ? titleEl.textContent : "";
          if (!title) continue;

          var description = descEl ? descEl.textContent : "";
          var link = linkEl ? linkEl.textContent : "";
          var pubDate = dateEl ? dateEl.textContent : "";

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

        if (newsItems.length > 0) {
          resolve(newsItems);
        } else {
          reject(new Error("Empty items after parsing RSS: " + feed.name));
        }
      })
      .catch(function (err) {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
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

  // 添加RSS直接抓取源（直接解析XML，无需第三方转换）
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

  // 添加天行数据（如果配置了）
  if (
    REAL_TIME_NEWS_CONFIG.sources.tianapi.enabled &&
    REAL_TIME_NEWS_CONFIG.sources.tianapi.apiKey
  ) {
    promises.push(fetchFromTianAPI());
  }

  // 添加直连兜底源（通过 CORS 代理）
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
      // 成功 — 缓存已由 fetchRealTimeNews 设置
    })
    .catch(function (err) {
      // 失败 — 状态已由 fetchRealTimeNews 设置
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
//  三、世界参数应用
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

    // 应用行业热度
    if (eff.sectorHeat) {
      for (var sec in eff.sectorHeat) {
        if (eff.sectorHeat.hasOwnProperty(sec)) {
          if (wp.sectorHeat[sec] !== undefined) {
            wp.sectorHeat[sec] = Math.max(
              0.5,
              Math.min(2.0, wp.sectorHeat[sec] + eff.sectorHeat[sec]),
            );
            wp.initialSectorBias[sec] = wp.sectorHeat[sec];
          }
        }
      }
    }

    // 统计市场情绪投票
    if (eff.marketMood) {
      moodVotes[eff.marketMood] = (moodVotes[eff.marketMood] || 0) + 1;
    }
  }

  // 决定最终市场情绪（多数投票）
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

// ============================================================
//  四、UI 显示系统
// ============================================================

var _worldNewsSelected = null; // 存储本局选中的新闻

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
    // 底部说明
    '<div class="world-news-footer">' +
    '<div class="world-news-footer-text">以上是你踏上这段旅程时，<strong>这个世界正在发生的事</strong>。<br>它将成为这局游戏世界的底色与初始基调。</div>' +
    '<button class="world-news-start-btn" id="world-news-start-btn">▶ 带着这个世界，出发</button>' +
    "</div>" +
    "</div>" +
    "</div>";

  // 注入DOM
  var container = document.createElement("div");
  container.id = "world-news-intro-container";
  container.innerHTML = html;
  document.body.appendChild(container);

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
 * 应用新闻效果并进入游戏（统一回调）
 * 流程：
 *   1. 应用世界参数偏差（sectorHeat + marketMood）
 *   2. 将开局新闻注入 state.activeNews（让投资/价格/事件等引擎读取）
 *   3. 在消息日志写入氛围背景
 *   4. 进入游戏
 */
function applyNewsAndEnter(selectedNews, state, enterGame, scenarioId) {
  if (selectedNews && selectedNews.length > 0) {
    applyWorldNewsToParams(state, selectedNews);

    // ——— 将开局新闻注入 activeNews 队列 ———
    // 让 news_investment_bridge / news_event_bridge / tickInvestmentDaily 等都能读取
    state.activeNews = state.activeNews || [];
    for (var ai = 0; ai < selectedNews.length; ai++) {
      var nn = selectedNews[ai];
      // 只有在有 investmentEffect 时才注入
      if (!nn.investmentEffect || nn.investmentEffect.length === 0) continue;
      // 检查是否已存在（防止重复注入）
      var exists = false;
      for (var ei = 0; ei < state.activeNews.length; ei++) {
        if (state.activeNews[ei].id === "intro_" + nn.id) {
          exists = true;
          break;
        }
      }
      if (exists) continue;
      state.activeNews.push({
        id: "intro_" + nn.id,
        headline: nn.icon + nn.headline,
        effects: {
          investmentEffect: nn.investmentEffect,
          duration: 365,
        },
        _appliedDay: state.player ? state.player.day : 0,
        _isIntroNews: true,
      });
    }

    // 在消息日志里写入氛围背景
    // 设计：在线模式（有实时新闻）→ 只显示实时头条，营造"世界正在发生"的沉浸感
    //      离线模式（本地新闻）→ 显示世界参数初始化 + 时代背景，说明游戏世界已生成
    var headlineList = selectedNews.map(function (n) {
      return n.icon + n.headline;
    });
    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      var isRealTime = selectedNews[0]._isRealTime;
      if (isRealTime) {
        // 在线模式：实时新闻主导，不显示世界参数初始化消息
        StateManager.addMessage(
          "📺 实时头条·时代背景：" + headlineList.slice(0, 2).join(" | "),
          "event",
        );
      } else {
        // 离线模式：显示世界参数初始化 + 本地时代背景
        StateManager.addMessage(
          "🌐 世界参数已随机初始化 | 📺 时代背景：" +
            headlineList.slice(0, 2).join(" | "),
          "event",
        );
      }
    }
  }
  if (typeof enterGame === "function") {
    enterGame();
  }
}

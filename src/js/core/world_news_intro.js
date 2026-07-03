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
      worldEffect: { sectorHeat: { 科技: -0.05, 消费: 0.03 }, marketMood: "bearish", note: "就业压力大，IT/金融岗位竞争激烈" },
      scenarioTags: ["fresh_grad", "small_town_grinder"],
    },
    {
      id: "emp_layoff_wave",
      months: [1, 2, 10, 11, 12],
      icon: "📉",
      tag: "就业",
      headline: "互联网大厂新一轮「优化」，裁员比例5%-15%",
      detail: "AI工具替代重复性岗位，高级研发和产品经理需求反增。",
      worldEffect: { sectorHeat: { 科技: -0.08 }, marketMood: "bearish", note: "IT行业普通岗位薪资承压" },
      scenarioTags: ["laid_off", "midlife_crisis"],
    },
    {
      id: "emp_blue_collar_rise",
      months: [3, 4, 9, 10],
      icon: "🔧",
      tag: "就业",
      headline: "新能源工厂用工荒！技工月薪突破1.2万",
      detail: "新能源产业链爆发，焊工、电工、数控等技工需求激增。",
      worldEffect: { sectorHeat: { 新能源: 0.12, 科技: 0.05 }, marketMood: "bullish", note: "制造业/蓝领岗位收入提升" },
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "emp_gig_economy",
      months: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12],
      icon: "🛵",
      tag: "就业",
      headline: "灵活就业人数破2亿，外卖骑手月均收入7800元",
      detail: "平台经济为「夹缝中的人」提供托底，但缺乏社保保障。",
      worldEffect: { sectorHeat: { 消费: 0.08 }, marketMood: "neutral", note: "跑腿/外卖/零工收入稳定" },
      scenarioTags: ["classic", "foreign_worker", "laid_off"],
    },
    {
      id: "emp_county_civil",
      months: [2, 3, 8, 9, 10],
      icon: "🏛️",
      tag: "就业",
      headline: "国考报名再破300万，「上岸」成年轻人首选",
      detail: "就业焦虑推动公务员热，县城编制竞争比高达300:1。",
      worldEffect: { sectorHeat: { 科技: -0.03, 金融: -0.02 }, marketMood: "neutral", note: "稳定岗位溢价，创业/私企吸引力下滑" },
      scenarioTags: ["small_town_grinder", "fresh_grad"],
    },
    {
      id: "emp_ai_replace",
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      icon: "🤖",
      tag: "科技",
      headline: "AI大模型加速落地，客服/翻译/设计岗位首当其冲",
      detail: "会用AI是加分项，被AI替代是警报。掌握工具者吃肉，不进步者喝汤。",
      worldEffect: { sectorHeat: { 科技: 0.10 }, marketMood: "volatile", note: "AI赋能岗位收入+15%，传统基础岗位薪资承压" },
      scenarioTags: ["classic", "laid_off", "midlife_crisis"],
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
      worldEffect: { sectorHeat: { 消费: 0.10, 新能源: 0.08 }, marketMood: "bullish", note: "消费行业景气，零售/服务收入有提升" },
      scenarioTags: ["classic", "second_gen"],
    },
    {
      id: "eco_deflation_worry",
      months: [2, 3, 6, 7, 8, 9],
      icon: "💹",
      tag: "经济",
      headline: "CPI连续走低，通缩担忧引发价格战全面升级",
      detail: "商品降价对消费者是好事，但对小商贩和工厂利润冲击明显。",
      worldEffect: { sectorHeat: { 消费: -0.06, 金融: -0.04 }, marketMood: "bearish", note: "物价下行，街头摊位/商品利润空间收窄" },
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "eco_stock_bull",
      months: [3, 4, 9, 10, 11],
      icon: "📈",
      tag: "市场",
      headline: "A股政策利好频出，沪指单月涨幅超8%",
      detail: "险资入市、汇金增持，市场情绪由悲转喜，散户纷纷入场。",
      worldEffect: { sectorHeat: { 金融: 0.12, 科技: 0.08 }, marketMood: "bullish", note: "股市投资机会，但风险同增" },
      scenarioTags: ["second_gen", "midlife_crisis"],
    },
    {
      id: "eco_new_energy_export",
      months: [4, 5, 6, 7, 8],
      icon: "⚡",
      tag: "产业",
      headline: "中国新能源车出口创新高，全球份额超35%",
      detail: "比亚迪、奇瑞等品牌出海，带动整条产业链高景气。",
      worldEffect: { sectorHeat: { 新能源: 0.15, 科技: 0.06 }, marketMood: "bullish", note: "新能源/制造业岗位需求旺盛" },
      scenarioTags: ["classic", "second_gen"],
    },
    {
      id: "eco_small_biz_hard",
      months: [2, 3, 7, 8, 9],
      icon: "🏪",
      tag: "经济",
      headline: "小微企业生存调查：三成个体户营收不及去年七成",
      detail: "房租、人工成本居高，平台抽成压缩，街边小店关门潮蔓延。",
      worldEffect: { sectorHeat: { 消费: -0.08 }, marketMood: "bearish", note: "实体店生意艰难，摆摊/外卖等低门槛谋生更重要" },
      scenarioTags: ["classic", "foreign_worker", "laid_off"],
    },
    {
      id: "eco_interest_cut",
      months: [1, 2, 6, 7, 10, 11],
      icon: "🏦",
      tag: "金融",
      headline: "央行再度降准降息，释放万亿流动性",
      detail: "贷款利率历史低位，购房、创业融资成本下行，储蓄收益缩水。",
      worldEffect: { sectorHeat: { 房地产: 0.08, 金融: -0.04 }, marketMood: "bullish", note: "贷款/创业启动成本降低，存款收益下滑" },
      scenarioTags: ["second_gen", "midlife_crisis", "classic"],
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
      worldEffect: { sectorHeat: { 房地产: -0.10 }, marketMood: "bearish", note: "租房成本相对稳定，购房可以议价" },
      scenarioTags: ["classic", "midlife_crisis"],
    },
    {
      id: "house_keep_building",
      months: [3, 4, 5, 6, 9, 10],
      icon: "🏗️",
      tag: "房产",
      headline: "「保交楼」专项债落地，数十万套烂尾楼有望复工",
      detail: "购房者终于等来曙光，但施工队、钢材商迎来新一波需求。",
      worldEffect: { sectorHeat: { 房地产: 0.06, 新能源: 0.03 }, marketMood: "neutral", note: "工程类工作需求上涨，房产市场预期回暖" },
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "house_city_renewal",
      months: [4, 5, 6, 7, 8, 9],
      icon: "🏙️",
      tag: "城市",
      headline: "城中村改造提速，城市核心区拆迁赔偿引争议",
      detail: "被纳入改造范围的居民喜忧参半：赔偿金丰厚，但去哪里住成难题。",
      worldEffect: { sectorHeat: { 房地产: 0.05 }, marketMood: "volatile", note: "城中村附近租金上涨，部分地段居民被迫迁移" },
      scenarioTags: ["classic", "foreign_worker", "laid_off"],
    },
    {
      id: "house_rent_stable",
      months: [1, 2, 3, 6, 7, 8],
      icon: "🔑",
      tag: "租房",
      headline: "长租公寓扩张放缓，个人房东直租回归主流",
      detail: "中介费竞争加剧，租金议价空间扩大，押一付一渐成标准。",
      worldEffect: { sectorHeat: { 消费: 0.02 }, marketMood: "neutral", note: "租房支出压力略减，村子/城郊租金更实惠" },
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
      worldEffect: { sectorHeat: { 科技: 0.15 }, marketMood: "bullish", note: "AI/科技相关岗位薪资+10-20%" },
      scenarioTags: ["classic", "second_gen", "fresh_grad"],
    },
    {
      id: "tech_robot_factory",
      months: [3, 4, 5, 9, 10, 11],
      icon: "🤖",
      tag: "科技",
      headline: "人形机器人量产进入倒计时，多地工厂启动试点",
      detail: "效率革命来临，但流水线工人的未来令人担忧，技能升级迫在眉睫。",
      worldEffect: { sectorHeat: { 科技: 0.12, 新能源: 0.08 }, marketMood: "volatile", note: "高端制造/编程岗位热，普工岗位长期承压" },
      scenarioTags: ["classic", "laid_off", "foreign_worker"],
    },
    {
      id: "tech_chip_breakthrough",
      months: [6, 7, 8, 9, 10],
      icon: "💿",
      tag: "科技",
      headline: "国产芯片制造工艺取得突破，7nm量产在望",
      detail: "「卡脖子」环节逐步松动，半导体全链条人才缺口巨大。",
      worldEffect: { sectorHeat: { 科技: 0.18 }, marketMood: "bullish", note: "芯片/半导体相关岗位薪资水涨船高" },
      scenarioTags: ["classic", "second_gen"],
    },
    {
      id: "tech_live_streaming",
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      icon: "📱",
      tag: "新媒体",
      headline: "短视频直播经济规模破3万亿，主播已成新兴职业",
      detail: "流量变现已经有成熟路径，但头部垄断效应强，99%的人在内卷底层。",
      worldEffect: { sectorHeat: { 消费: 0.08, 科技: 0.05 }, marketMood: "neutral", note: "社交网络/直播副业收入可观，但竞争激烈" },
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
      worldEffect: { sectorHeat: { 医药: 0.08, 消费: -0.03 }, marketMood: "bearish", note: "老龄产业/医疗岗位需求增，年轻消费市场收缩" },
      scenarioTags: ["midlife_crisis", "classic"],
    },
    {
      id: "soc_mental_health",
      months: [3, 4, 5, 6, 9, 10, 11],
      icon: "🧠",
      tag: "社会",
      headline: "职场心理健康报告：三成员工存在中高度焦虑",
      detail: "「35岁危机」「内卷」「躺平」成社会情绪主轴，心理咨询需求暴增。",
      worldEffect: { sectorHeat: { 医药: 0.06 }, marketMood: "bearish", note: "心理健康相关行业兴起，职场压力影响生产力" },
      scenarioTags: ["midlife_crisis", "laid_off", "small_town_grinder"],
    },
    {
      id: "soc_new_poor",
      months: [2, 3, 6, 7, 8, 9],
      icon: "💸",
      tag: "社会",
      headline: "「新贫困陷阱」：月入过万却存不下钱的城市中产",
      detail: "房贷、娃的教育、父母赡养三座大山同压，中产悄悄滑向脆弱层。",
      worldEffect: { sectorHeat: { 消费: -0.05, 金融: -0.04 }, marketMood: "bearish", note: "消费降级，精打细算成为城市生存主旋律" },
      scenarioTags: ["midlife_crisis", "second_gen"],
    },
    {
      id: "soc_village_youth",
      months: [1, 2, 6, 7, 8, 9, 10],
      icon: "🚂",
      tag: "社会",
      headline: "逆城市化初现：部分年轻人返乡创业，县城经济重启",
      detail: "「小镇做题家」的逆流者选择回头，但机会仍少于城市。",
      worldEffect: { sectorHeat: { 消费: 0.03 }, marketMood: "neutral", note: "小镇/县城房价低、压力小，但上升通道窄" },
      scenarioTags: ["small_town_grinder", "classic"],
    },
    {
      id: "soc_silver_economy",
      months: [3, 4, 9, 10, 11],
      icon: "👴",
      tag: "社会",
      headline: "银发经济万亿赛道爆发，老年护理人才严重短缺",
      detail: "护工、老年康复师、上门服务成高需求蓝海，薪资超越白领。",
      worldEffect: { sectorHeat: { 医药: 0.10, 消费: 0.05 }, marketMood: "bullish", note: "养老/医疗服务行业机会多，报酬不低" },
      scenarioTags: ["classic", "midlife_crisis", "foreign_worker"],
    },
    {
      id: "soc_education_reform",
      months: [4, 5, 6, 7, 8, 9],
      icon: "📚",
      tag: "教育",
      headline: "职业教育扶持力度加大，「工匠精神」重新被提倡",
      detail: "技能型人才补贴增加，职校毕业生就业率高于部分本科专业。",
      worldEffect: { sectorHeat: { 科技: 0.04, 新能源: 0.06 }, marketMood: "neutral", note: "技能证书和职业技术的价值提升" },
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
      worldEffect: { sectorHeat: { 科技: -0.07, 新能源: 0.05 }, marketMood: "volatile", note: "外贸相关岗位受冲击，内循环消费机会反增" },
      scenarioTags: ["classic", "second_gen"],
    },
    {
      id: "pol_platform_regulate",
      months: [3, 4, 5, 8, 9, 10],
      icon: "📋",
      tag: "政策",
      headline: "平台经济强监管持续，算法透明化和骑手权益保护落地",
      detail: "外卖、滴滴、主播等平台用工者待遇改善，但平台利润受压。",
      worldEffect: { sectorHeat: { 消费: 0.05, 科技: -0.04 }, marketMood: "neutral", note: "外卖/跑腿/平台零工收入略有改善" },
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "pol_rural_revive",
      months: [2, 3, 4, 5, 9, 10],
      icon: "🌾",
      tag: "政策",
      headline: "乡村振兴专项基金到位，农村产业创业补贴最高达20万",
      detail: "回乡创业、农业科技改造获政策支持，但落地执行参差不齐。",
      worldEffect: { sectorHeat: { 消费: 0.04 }, marketMood: "neutral", note: "小镇/乡镇创业门槛降低，补贴可观" },
      scenarioTags: ["small_town_grinder", "laid_off"],
    },
    {
      id: "pol_digital_rmb",
      months: [1, 2, 6, 7, 11, 12],
      icon: "💰",
      tag: "金融",
      headline: "数字人民币试点城市扩展至50+，消费红包刺激效果显著",
      detail: "活动期间消费券使用率超预期，线下小商户获益明显。",
      worldEffect: { sectorHeat: { 消费: 0.07, 金融: 0.04 }, marketMood: "bullish", note: "消费补贴期间实体经营收入有提升" },
      scenarioTags: ["classic", "foreign_worker", "laid_off"],
    },
    {
      id: "pol_anti_996",
      months: [3, 4, 5, 6, 7, 8, 9, 10],
      icon: "⏰",
      tag: "劳工",
      headline: "劳动法执法趋严，多家大厂因加班违规被罚款",
      detail: "「打工人」权益意识抬升，但执法力度仍待观察，自我保护意识更重要。",
      worldEffect: { sectorHeat: { 科技: -0.03 }, marketMood: "neutral", note: "职场权益保护增强，但短期内裁员阻力更大" },
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
      worldEffect: { sectorHeat: { 消费: 0.18, 科技: -0.05 }, marketMood: "bullish", note: "春节黄金期！摆摊/餐饮/服务收入高峰" },
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "sea_golden_week_618",
      months: [6],
      icon: "🛍️",
      tag: "节日",
      headline: "618年中大促破纪录，直播间带货单日成交超3000亿",
      detail: "主播、仓储、物流全面动员，电商淡季过后迎来消费狂欢。",
      worldEffect: { sectorHeat: { 消费: 0.12, 科技: 0.06 }, marketMood: "bullish", note: "618期间电商/物流/零工收入有额外奖励" },
      scenarioTags: ["classic", "second_gen", "fresh_grad"],
    },
    {
      id: "sea_graduation",
      months: [6, 7],
      icon: "🎓",
      tag: "毕业",
      headline: "毕业季来临！应届生大量涌入城市，租房市场骤然承压",
      detail: "简历洪流涌入招聘市场，但实习和应届的差距已经打开。",
      worldEffect: { sectorHeat: { 科技: -0.04, 消费: 0.04 }, marketMood: "neutral", note: "应届生竞争激烈，租房需求拉升城区租金" },
      scenarioTags: ["fresh_grad", "small_town_grinder"],
    },
    {
      id: "sea_double_11",
      months: [11],
      icon: "🛒",
      tag: "节日",
      headline: "双十一提前开门！物流业全员上阵，快递峰值破60亿单",
      detail: "全年最大消费节，物流、仓储、客服爆发式用工，计件工人单月收入翻倍。",
      worldEffect: { sectorHeat: { 消费: 0.20, 科技: 0.05 }, marketMood: "bullish", note: "双十一期间物流/零工收入激增！" },
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "sea_new_year_job",
      months: [3, 4],
      icon: "🌸",
      tag: "招聘",
      headline: "金三银四招聘旺季开启！企业发力抢人，薪资谈判空间扩大",
      detail: "跳槽窗口期来临，有经验的打工人此时谈薪最有底气。",
      worldEffect: { sectorHeat: { 科技: 0.06, 金融: 0.05 }, marketMood: "bullish", note: "招聘旺季，跳槽和求职成功率更高" },
      scenarioTags: ["classic", "laid_off", "midlife_crisis"],
    },
    {
      id: "sea_summer_heat",
      months: [7, 8],
      icon: "☀️",
      tag: "天气",
      headline: "极端高温天气持续！多地气温突破40℃，户外作业受限",
      detail: "室内工作成为抢手岗位，外卖和建筑工人收入挂高温补贴。",
      worldEffect: { sectorHeat: { 消费: 0.07, 新能源: 0.05 }, marketMood: "neutral", note: "高温季节体力劳动收入有高温补贴，但消耗大" },
      scenarioTags: ["classic", "foreign_worker"],
    },
    {
      id: "sea_autumn_harvest",
      months: [9, 10],
      icon: "🍂",
      tag: "季节",
      headline: "金秋消费旺季到来，国庆黄金周旅游、消费双旺",
      detail: "国庆+中秋双节叠加，景区爆满，线下消费加速复苏。",
      worldEffect: { sectorHeat: { 消费: 0.14 }, marketMood: "bullish", note: "国庆旺季！餐饮/旅游/服务类收入高峰" },
      scenarioTags: ["classic", "second_gen", "foreign_worker"],
    },
    {
      id: "sea_winter_cold",
      months: [12, 1],
      icon: "❄️",
      tag: "冬季",
      headline: "寒潮来袭！南方多城市气温创10年最低，采暖需求爆发",
      detail: "能源需求激增、快递配送减速，但冬季保暖品价格上涨是商机。",
      worldEffect: { sectorHeat: { 新能源: 0.08, 消费: 0.05 }, marketMood: "neutral", note: "冬季保暖品需求旺盛，户外劳动收入受天气影响" },
      scenarioTags: ["classic", "foreign_worker"],
    },
  ],
};

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
        if (scenarioId && news.scenarioTags && news.scenarioTags.indexOf(scenarioId) !== -1) {
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
        "就业": "employment", "科技": "tech", "市场": "economy",
        "产业": "economy", "金融": "economy", "消费": "economy",
        "房产": "housing", "租房": "housing", "城市": "housing",
        "社会": "social", "教育": "social", "新媒体": "tech",
        "政策": "policy", "劳工": "policy", "国际": "policy",
        "节日": "seasonal", "毕业": "seasonal", "天气": "seasonal",
        "季节": "seasonal", "招聘": "seasonal",
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
      if (result[ri].id === xitem.id) { alreadyIn = true; break; }
    }
    if (!alreadyIn && (xitem.tag === "节日" || xitem.tag === "季节" || xitem.tag === "天气" || xitem.tag === "毕业" || xitem.tag === "招聘")) {
      result.push(xitem);
      break;
    }
  }

  // 第三遍：填充到4条
  for (var yi = 0; yi < shuffled.length && result.length < 4; yi++) {
    var yitem = shuffled[yi];
    var alreadyIn2 = false;
    for (var rj = 0; rj < result.length; rj++) {
      if (result[rj].id === yitem.id) { alreadyIn2 = true; break; }
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
            wp.sectorHeat[sec] = Math.max(0.5, Math.min(2.0, wp.sectorHeat[sec] + eff.sectorHeat[sec]));
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
 */
function showWorldNewsIntro(scenarioId, onConfirm) {
  // 选择新闻
  _worldNewsSelected = selectWorldNewsForGame(scenarioId);

  // 构建时间描述
  var now = new Date();
  var months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  var dateStr = now.getFullYear() + "年" + months[now.getMonth()] + now.getDate() + "日";

  // 构建新闻HTML
  var newsHtml = "";
  var newsItems = _worldNewsSelected;
  for (var i = 0; i < newsItems.length; i++) {
    var news = newsItems[i];
    var moodClass = "";
    if (news.worldEffect) {
      if (news.worldEffect.marketMood === "bullish") moodClass = "world-news-mood-up";
      else if (news.worldEffect.marketMood === "bearish") moodClass = "world-news-mood-down";
      else if (news.worldEffect.marketMood === "volatile") moodClass = "world-news-mood-volatile";
    }

    newsHtml +=
      '<div class="world-news-item ' + moodClass + '">' +
        '<div class="world-news-item-header">' +
          '<span class="world-news-icon">' + news.icon + '</span>' +
          '<span class="world-news-tag">' + news.tag + '</span>' +
        '</div>' +
        '<div class="world-news-headline">' + news.headline + '</div>' +
        '<div class="world-news-detail">' + news.detail + '</div>' +
        (news.worldEffect && news.worldEffect.note ?
          '<div class="world-news-effect">💡 ' + news.worldEffect.note + '</div>' : '') +
      '</div>';
  }

  // 剧本特色描述
  var scenarioIntro = getScenarioWorldContext(scenarioId);

  // 构建完整HTML
  var html =
    '<div id="world-news-intro-overlay" class="world-news-overlay">' +
      '<div class="world-news-panel">' +

        // 顶部标题区
        '<div class="world-news-header">' +
          '<div class="world-news-title-row">' +
            '<span class="world-news-logo">📺</span>' +
            '<span class="world-news-title">今日头条</span>' +
            '<span class="world-news-date">' + dateStr + '</span>' +
          '</div>' +
          '<div class="world-news-subtitle">' + scenarioIntro + '</div>' +
        '</div>' +

        // 新闻列表
        '<div class="world-news-list">' + newsHtml + '</div>' +

        // 底部说明
        '<div class="world-news-footer">' +
          '<div class="world-news-footer-text">以上是你踏上这段旅程时，<strong>这个世界正在发生的事</strong>。<br>它将成为这局游戏世界的底色与初始基调。</div>' +
          '<button class="world-news-start-btn" id="world-news-start-btn">▶ 带着这个世界，出发</button>' +
        '</div>' +

      '</div>' +
    '</div>';

  // 注入DOM
  var container = document.createElement("div");
  container.id = "world-news-intro-container";
  container.innerHTML = html;
  document.body.appendChild(container);

  // 绑定按钮事件
  var startBtn = document.getElementById("world-news-start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", function() {
      // 移除弹窗
      var c = document.getElementById("world-news-intro-container");
      if (c) {
        c.classList.add("world-news-fadeout");
        setTimeout(function() {
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
  setTimeout(function() {
    var overlay = document.getElementById("world-news-intro-overlay");
    if (overlay) overlay.classList.add("world-news-visible");
  }, 50);
}

/**
 * 获取不同剧本的世界背景描述
 */
function getScenarioWorldContext(scenarioId) {
  var contexts = {
    "classic":           "你揣着几百块钱，第一次踏进这座没有给你留位置的城市。",
    "laid_off":          "厂子黄了，工牌交出去的那天，你知道必须找条新路。",
    "small_town_grinder":"十几年寒窗，你带着全家的期望，来到这座比想象中更残酷的大城市。",
    "foreign_worker":    "语言不通，人脸不熟，但月月还要往老家汇钱——这是你的现实。",
    "second_gen":        "你不缺钱，但你缺少一件东西：证明自己的机会。",
    "midlife_crisis":    "四十岁，上有老下有小，公司突然把你叫进了HR办公室。",
    "fresh_grad":        "拿着一张文凭，对着陌生城市，你意识到学校没教你最重要的一课。",
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
 * @param {Object} state         - 已初始化的游戏状态
 * @param {string|null} scenarioId - 剧本ID
 * @param {Function} enterGame   - 进入游戏的回调（执行显示app、renderAll等）
 */
function startWithWorldNewsIntro(state, scenarioId, enterGame) {
  showWorldNewsIntro(scenarioId, function(selectedNews) {
    // 将新闻效果写入世界参数
    if (selectedNews && selectedNews.length > 0) {
      applyWorldNewsToParams(state, selectedNews);
      // 在消息日志里写入一条氛围背景
      var headlineList = selectedNews.map(function(n) { return n.icon + n.headline; });
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage(
          "📺 今日头条·时代背景：" + headlineList.slice(0, 2).join(" | "),
          "event"
        );
      }
    }
    // 进入游戏
    if (typeof enterGame === "function") {
      enterGame();
    }
  });
}

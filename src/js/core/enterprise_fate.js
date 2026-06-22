/**
 * 企业命运系统 — 动态商业生态变迁引擎
 *
 * P2#11：玩家投资/就职/竞争过的公司随时间成长、合并、倒闭，
 * 形成可观察的商业生态变迁。5家公司各自经历生命周期阶段，
 * 受自然漂移、命运事件、玩家行为三重影响。
 *
 * Phase 1 完善（2026-06-19）：
 * ① 零和博弈市场份额 ② 3个新命运事件(IPO/人才流失/专利战) ③ 真实合并系统
 * ④ 行业板块传导 ⑤ 季度企业报告
 *
 * 设计理念（参考《Dwarf Fortress》历史记忆 + 《CK3》关系网络）：
 * - 公司不是静态背景板，而是有生命周期的经济实体
 * - 玩家的选择和表现切实影响公司命运
 * - 命运事件生成新闻，新闻影响投资，投资反馈到公司
 */

// ====== 行业板块定义（Phase 1#4） ======
var INDUSTRY_SECTORS = {
  "AI/大模型": {
    name: "AI/大模型",
    icon: "🧠",
    color: "#7c3aed",
    contagionMod: 0.6,
    description: "人工智能与大模型研发",
  },
  "短视频/推荐": {
    name: "短视频/推荐",
    icon: "📱",
    color: "#ec4899",
    contagionMod: 0.5,
    description: "短视频与内容推荐平台",
  },
  "云计算/企业服务": {
    name: "云计算/企业服务",
    icon: "☁️",
    color: "#06b6d4",
    contagionMod: 0.7,
    description: "云计算与企业级服务",
  },
  "手游/出海": {
    name: "手游/出海",
    icon: "🎮",
    color: "#f59e0b",
    contagionMod: 0.4,
    description: "移动游戏与海外市场",
  },
  金融科技: {
    name: "金融科技",
    icon: "💳",
    color: "#10b981",
    contagionMod: 0.8,
    description: "金融科技与支付",
  },
};

// ====== CEO 特质模板（Phase 1#8 预留，已激活） ======
// 注意：此变量需在全局作用域，供 company_spawner.js 调用
var CEO_TRAITS = [
  {
    id: "aggressive",
    name: "激进型",
    icon: "⚔️",
    desc: "高风险高回报，增长事件权重+30%，风险事件权重+20%",
    fateWeightMod: { growth: 1.3, risk: 1.2 },
  },
  {
    id: "conservative",
    name: "保守型",
    icon: "🛡️",
    desc: "稳健经营，风险事件权重-40%，恢复事件权重+20%",
    fateWeightMod: { risk: 0.6, recovery: 1.2 },
  },
  {
    id: "tech_paranoic",
    name: "技术偏执",
    icon: "🔬",
    desc: "产品驱动，产品爆发事件权重+50%，市场份额增长+10%",
    fateWeightMod: { product: 1.5, market: 1.1 },
  },
  {
    id: "finance_oriented",
    name: "财务导向",
    icon: "📊",
    desc: "利润优先，丑闻事件权重-30%，资金链事件权重+10%",
    fateWeightMod: { scandal: 0.7, cash: 1.1 },
  },
  {
    id: "visionary",
    name: "愿景驱动",
    icon: "🌟",
    desc: "长期主义，衰退期恢复概率+40%，合并事件权重+25%",
    fateWeightMod: { recovery: 1.4, merger: 1.25 },
  },
];

// ====== CEO 人格化深化（Phase 2） ======
// 5 家公司的 CEO 详细传记与背景故事

var CEO_BIOS = {
  star_tech: {
    name: "林振宇",
    age: 38,
    background: "清华计算机博士，曾在硅谷大厂工作8年，2018年回国创业。",
    personality:
      "技术理想主义者，坚信AI能改变世界。性格内敛但执行力极强，对技术细节有近乎偏执的追求。",
    story:
      "林振宇的创业之路始于一次深夜的顿悟。2017年，他在斯坦福做访问学者时，目睹了AI在医疗影像诊断上的突破，决心回国做“中国版的医疗AI”。回国后他卖掉硅谷的别墅，在科技园租了个80平的办公室，带着3个同学开始了星辰科技的征程。第一年，他们连工资都发不出来，林振宇靠刷信用卡撑过最艰难的时刻。第三年，他们的医疗影像AI产品获得了首轮融资，如今星辰科技已成为国内AI大模型的领军企业。",
    quote: "技术没有捷径，只有死磕。",
    weakness: "不善管理，常常亲自写代码到凌晨；对商业变现不够敏感",
    relationshipWithPlayer:
      "如果玩家就职星辰科技且表现优异，林振宇会亲自带教，传授技术心得。",
  },
  byte_dragon: {
    name: "苏晴",
    age: 32,
    background: "北大中文系毕业，曾在字节跳动做内容运营3年，2020年离职创业。",
    personality:
      "敏锐的内容嗅觉，擅长捕捉用户情绪。性格外向、社交能力强，是典型的“内容疯子”。",
    story:
      "苏晴是内容界的“猎手”。在字节跳动期间，她主导的多个爆款视频播放量破10亿，被内部称为“爆款制造机”。2020年疫情爆发，她敏锐地察觉到短视频出海的机会，辞职创办字节龙，专注做东南亚市场的短视频平台。起步时只有5个人，靠给本地商家做短视频代运营养活团队。两年后，字节龙的日活突破5000万，成为东南亚最大的短视频平台之一。苏晴常说：“内容是有生命的，你得懂用户的心。”",
    quote: "流量是表象，人心才是本质。",
    weakness: "过度追求流量，有时忽视内容质量；对竞争对手过于激进",
    relationshipWithPlayer:
      "如果玩家在传媒/内容行业工作，苏晴可能会邀请你加入字节龙的内容团队。",
  },
  cloud_giant: {
    name: "陈建国",
    age: 52,
    background: "中科院计算所硕士，曾在华为工作15年，2015年创立云巨人。",
    personality:
      "稳健务实的企业家，信奉“慢就是快”。性格沉稳，做事有条不紊，是业界公认的“老派实干家”。",
    story:
      "陈建国是典型的“技术老兵”。在华为的15年里，他从一名普通工程师做到产品线总经理，亲历了中国通信产业的崛起。2015年，他看到云计算的浪潮，毅然离开华为创办云巨人。起步时，他选择了最“笨”的路——自建数据中心，而不是轻资产的云服务。这个决定当时被同行嘲笑“过时了”，但三年后，当多家云服务商因数据安全问题被监管调查时，云巨人凭借自有的基础设施赢得了大客户信任。如今，云巨人是国内最大的企业级云服务商之一。",
    quote: "做企业就像建房子，地基打牢了，楼才能盖高。",
    weakness: "过于保守，错失了一些创新机会；对年轻一代的需求理解不足",
    relationshipWithPlayer:
      "如果玩家在云计算/企业软件行业工作，陈建国可能会欣赏你的务实态度。",
  },
  game_fun: {
    name: "王浩然",
    age: 29,
    background:
      "浙大游戏设计专业，大学期间做过3款独立游戏，2021年创办好玩游戏。",
    personality:
      "创意爆棚的游戏狂热者，性格活泼、脑洞大开。对游戏有近乎痴迷的热爱，是“为游戏而生”的典型。",
    story:
      "王浩然是“游戏界的极客”。大学时他做的第一款独立游戏《逃离宿舍》在Steam上获得了10万销量，让他一举成名。毕业后他没有选择去大厂，而是和两个室友在宿舍里创办了好玩游戏。他们的第一款手游《像素大乱斗》凭借独特的像素风格和创新的玩法，在TapTap上获得了9.2的高分。如今，好玩游戏已成为国内知名的独立游戏发行商，代理了超过30款精品独立游戏。王浩然常说：“游戏是第九艺术，我们要让玩家感受到创作的灵魂。”",
    quote: "每一款游戏都是一个世界，我们要做的，是建造最有趣的那个。",
    weakness: "过度追求创意，有时忽视商业回报；团队管理较为松散",
    relationshipWithPlayer:
      "如果玩家对游戏行业感兴趣，王浩然会热情地和你聊游戏设计，甚至邀请你参与游戏测试。",
  },
  safe_fin: {
    name: "张敏",
    age: 41,
    background: "北大光华MBA，曾在支付宝工作10年，2019年创立安信金融科技。",
    personality:
      "精明的金融从业者，理性冷静，对风险有极高的敏感度。性格严谨，做事一丝不苟。",
    story:
      "张敏是“金融科技界的守门人”。在支付宝的10年里，她亲历了中国移动支付从0到1的全过程，负责过风控、合规、产品设计等多个核心岗位。2019年，她看到中小金融机构数字化转型的机会，创办安信金融科技，专注做智能风控系统。起步时，她选择了最“难”的路——为银行做定制化的风控方案，而不是标准化的SaaS产品。这个决定让安信科技在头两年收入增长缓慢，但积累了深厚的行业know-how。如今，安信科技已为超过200家金融机构提供了风控服务。",
    quote: "金融的本质是风险管理，技术只是工具。",
    weakness: "过于谨慎，错失了一些快速增长的机会；对新兴技术接受度较低",
    relationshipWithPlayer:
      "如果玩家在金融行业工作，张敏可能会给你一些风控方面的专业建议。",
  },
};

// ====== 10 种命运事件模板（Phase 1 新增3个） ======
var FATE_EVENTS = [
  {
    id: "market_erosion",
    label: "市场份额被蚕食",
    icon: "🦈",
    weight: 1.5,
    condition: function (st, co) {
      return co.trend === "down" && co.marketShare < 15;
    },
    apply: function (st, cid, co) {
      co.health = Math.max(5, co.health - (10 + Random.int(0, 10)));
      co.marketShare = Math.max(1, co.marketShare - (2 + Random.int(0, 3)));
      co.sentiment = Math.max(5, co.sentiment - (15 + Random.int(0, 10)));
      return { stockMul: 0.94, msg: "市场份额持续萎缩，被竞争对手蚕食" };
    },
  },
  {
    id: "product_breakout",
    label: "新产品爆发",
    icon: "🚀",
    weight: 1.2,
    condition: function (st, co) {
      return (
        co.productScore > 65 && co.phase !== "decline" && co.phase !== "dying"
      );
    },
    apply: function (st, cid, co) {
      co.health = Math.min(100, co.health + (10 + Random.int(0, 10)));
      co.marketShare = Math.min(40, co.marketShare + (3 + Random.int(0, 5)));
      co.sentiment = Math.min(100, co.sentiment + (20 + Random.int(0, 10)));
      if (co.phase === "mature") co.trend = "up";
      return { stockMul: 1.12, msg: "新产品引爆市场，订单暴增" };
    },
  },
  {
    id: "scandal",
    label: "丑闻曝光",
    icon: "📰",
    weight: 1.0,
    condition: function (st, co) {
      return co.sentiment < 45 || (co.trend === "down" && co.health < 60);
    },
    apply: function (st, cid, co) {
      co.health = Math.max(5, co.health - (15 + Random.int(0, 10)));
      co.sentiment = Math.max(5, co.sentiment - (25 + Random.int(0, 10)));
      co.talentScore = Math.max(5, co.talentScore - (10 + Random.int(0, 5)));
      return { stockMul: 0.9, msg: "管理层丑闻曝光，引发信任危机" };
    },
  },
  {
    id: "merger_acquire",
    label: "收购/合并",
    icon: "🤝",
    weight: 0.5,
    condition: function (st, co) {
      // 濒死或高市场占有率成熟公司
      return (
        co.phase === "dying" || (co.phase === "mature" && co.marketShare > 25)
      );
    },
    apply: function (st, cid, co) {
      if (co.phase === "dying") {
        // 濒死公司被收购——标记为已退出历史舞台
        co.ceasedExistence = true;
        co.ceasedAt = st.player.day;
        co.health = Math.max(1, co.health - 5);
        co.marketShare = Math.max(1, Math.floor(co.marketShare * 0.5));
        st.flags["_acquired_" + cid] = true;
        if (typeof recordCompanyDeath === "function") {
          recordCompanyDeath(
            cid,
            st,
            "经营不善，被竞争对手低价收购",
            "merger_acquire",
          );
        }
        // Phase 3: 生成倒闭遗产
        generateCompanyAftermath(st, cid, co);
        return { stockMul: 0.85, msg: "经营不善，被竞争对手低价收购" };
      } else {
        // 强势公司并购
        co.marketShare = Math.min(40, co.marketShare + 8);
        co.health = Math.min(100, co.health + 5);
        co.sentiment = Math.min(100, co.sentiment + 10);
        return { stockMul: 1.08, msg: "宣布收购同业公司，行业格局重塑" };
      }
    },
  },
  {
    id: "policy_tailwind",
    label: "行业政策利好",
    icon: "📋",
    weight: 0.8,
    condition: function (st, co) {
      return co.health > 20; // 任何健康的公司都可能受益
    },
    apply: function (st, cid, co) {
      co.health = Math.min(100, co.health + (5 + Random.int(0, 10)));
      co.sentiment = Math.min(100, co.sentiment + (15 + Random.int(0, 10)));
      co.trend = "up";
      return { stockMul: 1.08, msg: "所在行业获重大政策利好，板块集体走强" };
    },
  },
  {
    id: "founder_return",
    label: "创始人回归",
    icon: "👑",
    weight: 0.6,
    condition: function (st, co) {
      return co.phase === "decline" && co.sentiment < 35;
    },
    apply: function (st, cid, co) {
      co.sentiment = Math.min(100, co.sentiment + (10 + Random.int(0, 10)));
      co.talentScore = Math.min(100, co.talentScore + (5 + Random.int(0, 10)));
      co.health = Math.min(100, co.health + (5 + Random.int(0, 5)));
      co.productScore = Math.min(100, co.productScore + 5);
      if (co.health > 40) co.trend = "up";
      return { stockMul: 1.06, msg: "创始人回归，启动重大战略重组" };
    },
  },
  {
    id: "cash_crisis",
    label: "资金链断裂",
    icon: "💸",
    weight: 0.7,
    condition: function (st, co) {
      return co.phase === "decline" || co.phase === "dying";
    },
    apply: function (st, cid, co) {
      co.health = Math.max(3, co.health - (20 + Random.int(0, 10)));
      co.sentiment = Math.max(5, co.sentiment - 20);
      co.talentScore = Math.max(5, co.talentScore - (10 + Random.int(0, 10)));
      if (co.health < 10 && co.phase !== "dying") co.phase = "dying";
      return { stockMul: 0.85, msg: "资金链断裂，大规模裁员自救" };
    },
  },
  {
    id: "company_death",
    label: "公司倒闭",
    icon: "⚰️",
    weight: 0.3,
    condition: function (st, co) {
      return co.phase === "dying" && co.health < 5 && !co.ceasedExistence;
    },
    apply: function (st, cid, co) {
      co.ceasedExistence = true;
      co.ceasedAt = st.player.day;
      co.health = 0;
      // 记录到多周目记忆
      if (typeof recordCompanyDeath === "function") {
        var cause = "经营彻底失败，宣布破产清算";
        if (co.fateEventHistory && co.fateEventHistory.length > 0) {
          var last = co.fateEventHistory[co.fateEventHistory.length - 1];
          cause = last.description + "，最终无力回天";
        }
        recordCompanyDeath(cid, st, cause, "company_death");
      }
      // Phase 3: 生成倒闭遗产
      generateCompanyAftermath(st, cid, co);
      return { stockMul: 0.5, msg: "正式宣告破产，公司关闭清算" };
    },
  },
  // ===== Phase 1 新增事件 =====
  {
    id: "ipo_listing",
    label: "IPO上市",
    icon: "🔔",
    weight: 0.4,
    condition: function (st, co) {
      // 成长期或成熟期，健康度高，市场份额达标
      return (
        (co.phase === "growth" || co.phase === "mature") &&
        co.health > 75 &&
        co.marketShare > 12 &&
        !co.ceasedExistence &&
        !co.ipoed
      );
    },
    apply: function (st, cid, co) {
      co.ipoed = true;
      co.ipoDay = st.player.day;
      // 资本暴涨
      co.health = Math.min(100, co.health + 15);
      co.sentiment = Math.min(100, co.sentiment + 30);
      co.marketShare = Math.min(45, co.marketShare + 5);
      co.trend = "up";
      // 解锁股票交易（标记为IPO公司）
      if (st.flags) st.flags["_ipo_" + cid] = true;
      // 生成IPO新闻
      var companyName = getCompanyNameById(cid);
      var msg =
        "成功在港交所/纳斯达克挂牌上市，首日市值突破" +
        Random.int(100, 299) +
        "亿";
      return { stockMul: 1.25, msg: msg };
    },
  },
  {
    id: "talent_exodus",
    label: "人才流失",
    icon: "👋",
    weight: 0.5,
    condition: function (st, co) {
      // 衰退期或健康度下降趋势
      return (
        co.phase === "decline" ||
        (co.phase === "mature" && co.trend === "down" && co.health < 60)
      );
    },
    apply: function (st, cid, co) {
      // 人才流失：productScore和talentScore暴跌
      co.productScore = Math.max(
        10,
        co.productScore - (10 + Random.int(0, 10)),
      );
      co.talentScore = Math.max(5, co.talentScore - (15 + Random.int(0, 15)));
      co.sentiment = Math.max(10, co.sentiment - (10 + Random.int(0, 10)));
      // 可能引发连锁反应：健康度下降
      co.health = Math.max(5, co.health - (5 + Random.int(0, 5)));
      // 如果talentScore极低，可能加速进入衰退
      if (co.talentScore < 25 && co.phase === "mature") co.phase = "decline";
      return {
        stockMul: 0.92,
        msg: "核心研发团队集体离职，被竞品公司高薪挖角",
      };
    },
  },
  {
    id: "patent_war",
    label: "专利诉讼战",
    icon: "⚖️",
    weight: 0.4,
    condition: function (st, co) {
      // 高productScore的公司之间互相攻击
      return (
        co.productScore > 60 && co.phase !== "dying" && !co.ceasedExistence
      );
    },
    apply: function (st, cid, co) {
      // 选择另一个高productScore的公司作为对手
      var companies = st.enterpriseFate.companies;
      var targetCid = null;
      var maxProduct = 0;
      for (var otherCid in companies) {
        if (otherCid === cid) continue;
        var otherCo = companies[otherCid];
        if (!otherCo || otherCo.ceasedExistence) continue;
        if (otherCo.productScore > maxProduct) {
          maxProduct = otherCo.productScore;
          targetCid = otherCid;
        }
      }
      // 双方互相消耗
      co.productScore = Math.max(20, co.productScore - (5 + Random.int(0, 5)));
      co.health = Math.max(10, co.health - (8 + Random.int(0, 7)));
      co.sentiment = Math.max(10, co.sentiment - (10 + Random.int(0, 10)));
      if (targetCid && companies[targetCid]) {
        var targetCo = companies[targetCid];
        targetCo.productScore = Math.max(
          20,
          targetCo.productScore - (5 + Random.int(0, 5)),
        );
        targetCo.health = Math.max(
          10,
          targetCo.health - (5 + Random.int(0, 5)),
        );
        targetCo.sentiment = Math.max(
          10,
          targetCo.sentiment - (8 + Random.int(0, 8)),
        );
      }
      return {
        stockMul: 0.93,
        msg: "发起/卷入专利诉讼战，研发投入被迫转向法律费用",
      };
    },
  },
  // ===== Phase 2 新增命运事件 =====
  {
    id: "ceo_retirement",
    label: "CEO退休/卸任",
    icon: "👴",
    weight: 0.3,
    condition: function (st, co) {
      // 成熟期或衰退期，健康度较高但CEO年龄因素
      return co.phase === "mature" && co.health > 50 && Random.chance(0.15);
    },
    apply: function (st, cid, co) {
      varceoBio = CEO_BIOS && CEO_BIOS[cid];
      varceoName = ceoBio ? ceoBio.name : "CEO";

      co.sentiment = Math.min(100, co.sentiment + (5 + Random.int(0, 9)));
      co.health = Math.max(5, co.health - (3 + Random.int(0, 4)));

      // 可能引发管理层动荡
      if (Random.chance(0.4)) {
        co.talentScore = Math.max(10, co.talentScore - (5 + Random.int(0, 7)));
        co.productScore = Math.max(
          10,
          co.productScore - (3 + Random.int(0, 5)),
        );
      }

      var msg = CEO_BIOS
        ? ceoName + "宣布退休，公司进入管理层交接期"
        : "公司CEO宣布退休，引发管理层动荡";

      return { stockMul: 0.96, msg: msg };
    },
  },
  {
    id: "industry_shuffle",
    label: "行业洗牌",
    icon: "🌪️",
    weight: 0.35,
    condition: function (st, co) {
      // 行业政策变化或市场格局剧变
      return co.phase === "growth" || co.phase === "mature";
    },
    apply: function (st, cid, co) {
      // 行业洗牌：市场份额重新分配
      var impact = Random.float(0.5, 2.0);

      // 随机决定是受益还是受损
      if (Random.chance(0.5)) {
        // 受益：获得市场份额
        co.marketShare = Math.min(45, co.marketShare + impact);
        co.health = Math.min(100, co.health + (3 + Random.int(0, 4)));
        co.sentiment = Math.min(100, co.sentiment + (8 + Random.int(0, 11)));
        return { stockMul: 1.15, msg: "行业洗牌，公司趁势扩张市场份额" };
      } else {
        // 受损：失去市场份额
        co.marketShare = Math.max(1, co.marketShare - impact * 1.5);
        co.health = Math.max(10, co.health - (5 + Random.int(0, 7)));
        co.sentiment = Math.max(10, co.sentiment - (10 + Random.int(0, 14)));
        return { stockMul: 0.82, msg: "行业洗牌冲击，公司市场份额大幅流失" };
      }
    },
  },
  {
    id: "tech_revolution",
    label: "技术革命",
    icon: "🤖",
    weight: 0.3,
    condition: function (st, co) {
      // 高产品分数的公司可能迎来技术突破
      return (
        co.productScore > 70 && co.phase !== "dying" && !co.ceasedExistence
      );
    },
    apply: function (st, cid, co) {
      // 技术革命：产品分数大幅提升，可能引发行业变革
      co.productScore = Math.min(
        100,
        co.productScore + (8 + Random.int(0, 11)),
      );
      co.health = Math.min(100, co.health + (5 + Random.int(0, 7)));
      co.marketShare = Math.min(45, co.marketShare + (2 + Random.int(0, 3)));
      co.sentiment = Math.min(100, co.sentiment + (12 + Random.int(0, 17)));

      varceoBio = CEO_BIOS && CEO_BIOS[cid];
      varceoName = ceoBio ? ceoBio.name : "公司";

      var msg = CEO_BIOS
        ? ceoName + "团队取得重大技术突破，新产品引发行业震动"
        : "公司取得重大技术突破，新产品引发行业震动";

      return { stockMul: 1.22, msg: msg };
    },
  },
  {
    id: "regulatory_crackdown",
    label: "监管风暴",
    icon: "👮",
    weight: 0.4,
    condition: function (st, co) {
      // 高市场份额或高sentiment的公司更容易被监管盯上
      return (co.marketShare > 20 || co.sentiment > 70) && co.phase !== "dying";
    },
    apply: function (st, cid, co) {
      // 监管风暴：健康度、sentiment、市场份额都受损
      co.health = Math.max(10, co.health - (8 + Random.int(0, 11)));
      co.sentiment = Math.max(5, co.sentiment - (15 + Random.int(0, 19)));
      co.marketShare = Math.max(1, co.marketShare - (3 + Random.int(0, 4)));

      // 可能引发罚款
      if (Random.chance(0.6)) {
        co.talentScore = Math.max(5, co.talentScore - (5 + Random.int(0, 9)));
      }

      varceoBio = CEO_BIOS && CEO_BIOS[cid];
      varceoName = ceoBio ? ceoBio.name : "公司";

      var msg = CEO_BIOS
        ? ceoName + "遭遇监管调查，面临巨额罚款和整改要求"
        : "公司遭遇监管调查，面临巨额罚款和整改要求";

      return { stockMul: 0.75, msg: msg };
    },
  },
  {
    id: "strategic_partnership",
    label: "战略合作",
    icon: "🤝",
    weight: 0.35,
    condition: function (st, co) {
      // 健康度较高的公司可能寻求战略合作
      return co.health > 60 && co.phase !== "dying" && !co.ceasedExistence;
    },
    apply: function (st, cid, co) {
      // 战略合作：健康度和sentiment提升
      co.health = Math.min(100, co.health + (5 + Random.int(0, 7)));
      co.sentiment = Math.min(100, co.sentiment + (10 + Random.int(0, 14)));
      co.marketShare = Math.min(45, co.marketShare + (1 + Random.int(0, 2)));

      // 可能解锁新的产品线
      if (Random.chance(0.5)) {
        co.productScore = Math.min(
          100,
          co.productScore + (3 + Random.int(0, 5)),
        );
      }

      return { stockMul: 1.12, msg: "宣布重要战略合作，业务版图进一步扩展" };
    },
  },
  {
    id: "product_crisis",
    label: "产品危机",
    icon: "⚠️",
    weight: 0.35,
    condition: function (st, co) {
      // 任何公司都可能遭遇产品危机
      return co.phase !== "dying" && !co.ceasedExistence && Random.chance(0.25);
    },
    apply: function (st, cid, co) {
      // 产品危机：健康度、sentiment受损
      co.health = Math.max(10, co.health - (6 + Random.int(0, 9)));
      co.sentiment = Math.max(5, co.sentiment - (12 + Random.int(0, 17)));
      co.productScore = Math.max(15, co.productScore - (5 + Random.int(0, 7)));

      return {
        stockMul: 0.85,
        msg: "核心产品出现重大质量问题，引发用户信任危机",
      };
    },
  },
];

/**
 * 获取公司名称（根据公司ID）
 */
function getCompanyNameById(cid) {
  var names = {
    star_tech: "星辰科技",
    byte_dragon: "字节龙",
    cloud_giant: "云巨人",
    game_fun: "好玩游戏",
    safe_fin: "安信金融科技",
  };
  return names[cid] || cid;
}

/**
 * 获取公司行业标签
 */
function getCompanyIndustry(cid) {
  var industries = {
    star_tech: "AI/大模型",
    byte_dragon: "短视频/推荐",
    cloud_giant: "云计算/企业服务",
    game_fun: "手游/出海",
    safe_fin: "金融科技",
  };
  return industries[cid] || "";
}

/**
 * 获取公司详情（从COMPANIES数组查找）
 */
function getCompanyDef(cid) {
  if (typeof COMPANIES !== "undefined") {
    for (var i = 0; i < COMPANIES.length; i++) {
      if (COMPANIES[i].id === cid) return COMPANIES[i];
    }
  }
  return null;
}

// ====== 核心函数 ======

/**
 * 初始化企业命运状态
 * 基于各公司 growthRate 设定初始值
 */
function initEnterpriseFate(state) {
  if (!state.enterpriseFate) {
    // 兼容旧存档
    state.enterpriseFate = {
      companies: {},
      fateEventCooldown: {},
      lastFateTick: 0,
    };
  }
  var fate = state.enterpriseFate;
  if (!fate.companies) fate.companies = {};

  var defaults = {
    star_tech: {
      phase: "growth",
      health: 82,
      marketShare: 15,
      sentiment: 60,
      productScore: 72,
      talentScore: 68,
      trend: "up",
      knownToPlayer: false,
      fateEventHistory: [],
      ceasedExistence: false,
      ceasedAt: null,
    },
    byte_dragon: {
      phase: "growth",
      health: 88,
      marketShare: 22,
      sentiment: 70,
      productScore: 80,
      talentScore: 75,
      trend: "up",
      knownToPlayer: false,
      fateEventHistory: [],
      ceasedExistence: false,
      ceasedAt: null,
    },
    cloud_giant: {
      phase: "mature",
      health: 78,
      marketShare: 18,
      sentiment: 55,
      productScore: 65,
      talentScore: 60,
      trend: "stable",
      knownToPlayer: false,
      fateEventHistory: [],
      ceasedExistence: false,
      ceasedAt: null,
    },
    game_fun: {
      phase: "growth",
      health: 75,
      marketShare: 10,
      sentiment: 65,
      productScore: 70,
      talentScore: 55,
      trend: "up",
      knownToPlayer: false,
      fateEventHistory: [],
      ceasedExistence: false,
      ceasedAt: null,
    },
    safe_fin: {
      phase: "mature",
      health: 85,
      marketShare: 12,
      sentiment: 50,
      productScore: 60,
      talentScore: 70,
      trend: "stable",
      knownToPlayer: false,
      fateEventHistory: [],
      ceasedExistence: false,
      ceasedAt: null,
    },
  };

  for (var cid in defaults) {
    if (!fate.companies[cid]) {
      fate.companies[cid] = JSON.parse(JSON.stringify(defaults[cid]));
    }
  }
}

/**
 * 企业命运每日结算 — 由 daily_pipeline 调用
 */
function tickEnterpriseFate(state) {
  if (!state.enterpriseFate || !state.enterpriseFate.companies) return;

  var fate = state.enterpriseFate;
  var companies = fate.companies;
  var hasStocks =
    typeof INV_STOCKS !== "undefined" && typeof CORP_STOCK_MAP !== "undefined";
  var inv = state.investment;

  for (var cid in companies) {
    var co = companies[cid];
    if (!co) continue;

    // 1. 自然漂移
    var phaseDef =
      CORP_LIFECYCLE_PHASES[co.phase] || CORP_LIFECYCLE_PHASES.mature;

    // health: 缓慢向中间值收敛
    var healthDrift = Random.float(-1, 1) * (phaseDef.recoveryRate || 0.1);
    co.health = Math.max(1, Math.min(100, co.health + healthDrift));

    // marketShare: 受阶段影响
    var shareDrift =
      Random.float(-0.3, 0.3) +
      (co.trend === "up" ? 0.15 : co.trend === "down" ? -0.15 : 0);
    co.marketShare = Math.max(1, Math.min(45, co.marketShare + shareDrift));

    // sentiment: 随机波动
    co.sentiment = Math.max(
      5,
      Math.min(100, co.sentiment + Random.float(-2, 2)),
    );

    // 2. 阶段转换
    if (co.health < 20 && co.phase !== "dying") {
      co.phase = "dying";
      co.trend = "down";
    } else if (co.health < 45 && co.phase === "growth") {
      co.phase = "decline";
      co.trend = "down";
    } else if (co.health > 65 && co.phase === "decline") {
      co.phase = "mature";
      co.trend = "stable";
    } else if (co.health > 80 && co.phase === "startup") {
      co.phase = "growth";
      co.trend = "up";
    }

    // 更新trend
    if (co.trend === "stable" && co.health > 70) co.trend = "up";
    if (co.trend === "up" && co.health < 30) co.trend = "down";
    if (co.trend === "down" && co.health > 75) co.trend = "up";

    // 3.5 倒闭检测：濒死且健康度极低 → 公司倒闭
    if (co.phase === "dying" && co.health < 3 && !co.ceasedExistence) {
      co.ceasedExistence = true;
      co.ceasedAt = state.player.day;
      co.health = 0;
      var name = getCompanyNameById(cid);
      if (typeof recordCompanyDeath === "function") {
        recordCompanyDeath(
          cid,
          state,
          "健康度耗尽，在挣扎中彻底倒下",
          "natural_death",
        );
      }
      // Phase 3: 生成倒闭遗产
      generateCompanyAftermath(state, cid, co);
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "⚰️ 【" + name + "】正式倒闭，退出市场舞台",
          "danger",
        );
      }
    }
    if (!co.knownToPlayer) {
      if (state.corporate && state.corporate.company === cid) {
        co.knownToPlayer = true;
      }
      if (hasStocks && inv && inv.stockHoldings) {
        var stockSymbols = CORP_STOCK_MAP[cid] || [];
        for (var si = 0; si < inv.stockHoldings.length; si++) {
          if (stockSymbols.indexOf(inv.stockHoldings[si].symbol) >= 0) {
            co.knownToPlayer = true;
            break;
          }
        }
      }
    }
  }

  // 4. 股票价格牵引（温和拉向公司健康度方向）
  if (hasStocks && inv && inv.stockMarket) {
    for (var cid2 in CORP_STOCK_MAP) {
      var co2 = companies[cid2];
      if (!co2) continue;
      var symbols = CORP_STOCK_MAP[cid2];
      for (var si2 = 0; si2 < symbols.length; si2++) {
        var mkt = inv.stockMarket[symbols[si2]];
        if (!mkt) continue;
        // 计算目标乘数: health + sentiment + marketShare 综合
        var targetMul =
          0.7 +
          (co2.health / 100) * 0.15 +
          (co2.sentiment / 100) * 0.1 +
          (co2.marketShare / 30) * 0.05;
        // 温和牵引: 每次向目标移动0.5%
        mkt.price = mkt.price * (1 - 0.005) + mkt.price * targetMul * 0.005;
        mkt.price = Math.max(0.0001, Math.round(mkt.price * 10000) / 10000);
      }
    }
  }

  // 5. 风声 pending events 到期触发
  tickPendingEvents(state);

  // 6. 命运事件触发（生成风声，延迟3-5天实际生效）
  rollFateEvent(state);

  // 7. Phase 3: 半年新公司生成检查（从废墟中重生）
  if (typeof checkAndSpawnFromRuins === "function") {
    checkAndSpawnFromRuins(state);
  }

  fate.lastFateTick = state.player.day;
}

/**
 * 根据 CEO 特质调整命运事件权重
 * @param {Object} co - 公司对象
 * @param {Array} validEvents - 有效事件数组
 * @returns {Object} 调整后的事件权重映射
 */
function applyCeoTraitMods(co, validEvents) {
  if (!co || !co.ceoTrait) return {};

  var trait = null;
  for (var ti = 0; ti < CEO_TRAITS.length; ti++) {
    if (CEO_TRAITS[ti].id === co.ceoTrait) {
      trait = CEO_TRAITS[ti];
      break;
    }
  }
  if (!trait) return {};

  var mods = {};
  var weightMod = trait.fateWeightMod || {};

  for (var ei = 0; ei < validEvents.length; ei++) {
    var evt = validEvents[ei];
    var baseWeight = evt.weight || 1;
    var modWeight = baseWeight;

    // 根据事件类型应用特质修正
    if (
      weightMod.growth &&
      (evt.id === "product_breakout" || evt.id === "policy_tailwind")
    ) {
      modWeight *= weightMod.growth;
    }
    if (
      weightMod.risk &&
      (evt.id === "scandal" ||
        evt.id === "market_erosion" ||
        evt.id === "cash_crunch")
    ) {
      modWeight *= weightMod.risk;
    }
    if (
      weightMod.recovery &&
      (evt.id === "founder_return" || evt.id === "turnaround")
    ) {
      modWeight *= weightMod.recovery;
    }
    if (weightMod.product && evt.id === "product_breakout") {
      modWeight *= weightMod.product;
    }
    if (weightMod.market && evt.id === "merger_acquire") {
      modWeight *= weightMod.market;
    }
    if (weightMod.scandal && evt.id === "scandal") {
      modWeight *= weightMod.scandal;
    }
    if (weightMod.cash && evt.id === "cash_crunch") {
      modWeight *= weightMod.cash;
    }

    mods[evt.id] = modWeight;
  }

  return mods;
}

/**
 * 命运事件触发判定
 */
function rollFateEvent(state) {
  if (!state.enterpriseFate) return;
  var fate = state.enterpriseFate;
  var cooldown = fate.fateEventCooldown || {};
  var today = state.player.day;

  for (var cid in fate.companies) {
    var co = fate.companies[cid];
    if (!co) continue;

    // 冷却期：每个公司至少10天
    if (cooldown[cid] && today - cooldown[cid] < 10) continue;

    // 基准概率 ~3%，濒死期提高
    var baseProb = 0.03;
    if (co.phase === "dying") baseProb += 0.06;
    if (co.phase === "decline") baseProb += 0.03;
    if (co.health < 30) baseProb += 0.04;

    if (Random.chance(baseProb)) {
      // 筛选有效事件
      var validEvents = [];
      for (var ei = 0; ei < FATE_EVENTS.length; ei++) {
        if (FATE_EVENTS[ei].condition(state, co)) {
          validEvents.push(FATE_EVENTS[ei]);
        }
      }
      if (validEvents.length > 0) {
        // CEO 特质权重修正
        var ceoMods = applyCeoTraitMods(co, validEvents);

        // 按权重选取（含CEO修正）
        var totalWeight = 0;
        for (var vi = 0; vi < validEvents.length; vi++) {
          var evt = validEvents[vi];
          var weight =
            ceoMods[evt.id] !== undefined ? ceoMods[evt.id] : evt.weight || 1;
          totalWeight += weight;
          evt._effectiveWeight = weight;
        }
        var roll = Random.float(0, totalWeight);
        var picked = validEvents[0];
        for (var vi2 = 0; vi2 < validEvents.length; vi2++) {
          roll -= validEvents[vi2]._effectiveWeight || 1;
          if (roll <= 0) {
            picked = validEvents[vi2];
            break;
          }
        }

        // Phase 2：先生成风声，延迟3-5天实际触发
        var rumor = generateRumor(state, cid, picked.id);

        if (co.knownToPlayer && rumor) {
          cooldown[cid] = today;
        }
        return; // 每天最多一个命运事件
      }
    }
  }
}

/**
 * 应用命运事件效果
 */
function applyFateEvent(event, cid, state) {
  var co = state.enterpriseFate.companies[cid];
  if (!co) return null;

  var result = event.apply(state, cid, co);
  if (!result) return null;

  // 记录历史（最多20条）
  if (!co.fateEventHistory) co.fateEventHistory = [];
  co.fateEventHistory.push({
    day: state.player.day,
    eventType: event.id,
    icon: event.icon,
    label: event.label,
    description: result.msg,
  });
  if (co.fateEventHistory.length > 20) {
    co.fateEventHistory = co.fateEventHistory.slice(-20);
  }

  // 更新趋势
  if (result.stockMul > 1.05) co.trend = "up";
  if (result.stockMul < 0.95) co.trend = "down";

  // 生成新闻消息
  var companyName = getCompanyNameById(cid);
  var headline = event.icon + " 【" + companyName + "】" + result.msg;
  StateManager.addMessage("🏭 " + headline, "event");

  // 如果玩家已知该公司，应用股价冲击
  if (
    co.knownToPlayer &&
    state.investment &&
    state.investment.stockMarket &&
    typeof CORP_STOCK_MAP !== "undefined"
  ) {
    var symbols = CORP_STOCK_MAP[cid] || [];
    for (var si = 0; si < symbols.length; si++) {
      var mkt = state.investment.stockMarket[symbols[si]];
      if (mkt) {
        mkt.price = Math.max(
          0.0001,
          Math.round(mkt.price * result.stockMul * 10000) / 10000,
        );
      }
    }
    StateManager.addMessage("📊 关联股票价格已调整", "info");
  }

  return result;
}

/**
 * 获取公司命运摘要（用于UI显示）
 */
function getCompanyFateSummary(cid, state) {
  if (!state.enterpriseFate || !state.enterpriseFate.companies) return null;
  var co = state.enterpriseFate.companies[cid];
  if (!co) return null;
  var phaseDef =
    CORP_LIFECYCLE_PHASES[co.phase] || CORP_LIFECYCLE_PHASES.mature;
  return {
    name: getCompanyNameById(cid),
    industry: getCompanyIndustry(cid),
    phase: co.phase,
    phaseName: phaseDef.name,
    phaseIcon: phaseDef.icon,
    phaseColor: phaseDef.color,
    health: Math.round(co.health),
    marketShare: Math.round(co.marketShare),
    sentiment: Math.round(co.sentiment),
    productScore: Math.round(co.productScore || 50),
    talentScore: Math.round(co.talentScore || 50),
    trend: co.trend,
    knownToPlayer: co.knownToPlayer,
    history: co.fateEventHistory || [],
  };
}

/**
 * 获取玩家影响加成（工作表现/投资行为对公司健康度的影响）
 */
function getPlayerCompanyImpact(state) {
  var impacts = {};
  if (!state.enterpriseFate || !state.enterpriseFate.companies) return impacts;

  for (var cid in state.enterpriseFate.companies) {
    var co = state.enterpriseFate.companies[cid];
    if (!co || !co.knownToPlayer) continue;

    var impact = 0;

    // 玩家就职该公司：KPI/能力影响
    if (state.corporate && state.corporate.company === cid) {
      var ability = state.corporate.ability || 30;
      var kpi = state.corporate.kpi || 20;
      impact += (ability - 30) * 0.02 + (kpi - 20) * 0.01;
    }

    // 玩家持有股票
    if (state.investment && state.investment.stockHoldings) {
      var stockSymbols = CORP_STOCK_MAP[cid] || [];
      var totalShares = 0;
      for (var si = 0; si < state.investment.stockHoldings.length; si++) {
        if (
          stockSymbols.indexOf(state.investment.stockHoldings[si].symbol) >= 0
        ) {
          totalShares += state.investment.stockHoldings[si].shares || 0;
        }
      }
      // 大量持仓暗示看好，小幅提升sentiment
      if (totalShares > 50) impact += 0.05;
      if (totalShares > 200) impact += 0.05;
    }

    if (impact !== 0) {
      impacts[cid] = Math.round(impact * 100) / 100;
    }
  }
  return impacts;
}

/**
 * 获取命运事件历史文本（用于UI）
 */
function getFateHistoryText(cid, state) {
  var co =
    state.enterpriseFate &&
    state.enterpriseFate.companies &&
    state.enterpriseFate.companies[cid];
  if (!co || !co.fateEventHistory || !co.fateEventHistory.length) return [];
  return co.fateEventHistory.slice(-10).map(function (e) {
    return { day: e.day, text: e.icon + " " + e.label + "：" + e.description };
  });
}

// ====== Phase 1 核心函数 ======

/**
 * 零和博弈市场份额分配（Phase 1#1）
 * 修改自然漂移逻辑：总市场份额有上限，一家增长时从其他公司按比例抽取
 */
function applyZeroSumMarketShare(state, growingCid, growingAmount) {
  var fate = state.enterpriseFate;
  if (!fate || !fate.companies) return;

  var companies = fate.companies;
  var totalShare = 0;
  var shareMap = {};

  // 计算当前总市场份额
  for (var cid in companies) {
    var co = companies[cid];
    if (!co || co.ceasedExistence) continue;
    shareMap[cid] = co.marketShare || 0;
    totalShare += shareMap[cid];
  }

  if (totalShare <= 0) return;

  // 如果总份额超过上限（约80%），按比例从非增长公司抽取
  var MAX_TOTAL_SHARE = 80;
  if (totalShare + growingAmount > MAX_TOTAL_SHARE) {
    var excess = totalShare + growingAmount - MAX_TOTAL_SHARE;

    // 找出非增长公司，按市场份额比例分配损失
    var candidates = [];
    var candidateTotal = 0;
    for (var cId2 in shareMap) {
      if (cId2 === growingCid && growingAmount > 0) continue;
      if (shareMap[cId2] > 1) {
        candidates.push({ cid: cId2, share: shareMap[cId2] });
        candidateTotal += shareMap[cId2];
      }
    }

    if (candidates.length > 0) {
      for (var ci = 0; ci < candidates.length; ci++) {
        var c = candidates[ci];
        var loss = (excess * c.share) / candidateTotal;
        companies[c.cid].marketShare = Math.max(
          1,
          (companies[c.cid].marketShare || 0) - loss,
        );
      }
    }
  }

  // 应用增长
  if (growingCid && companies[growingCid]) {
    companies[growingCid].marketShare = Math.min(
      45,
      (companies[growingCid].marketShare || 0) + growingAmount,
    );
  }
}

/**
 * 真实合并系统（Phase 1#3）
 * 两家公司真正融合：市场叠加、品牌合并、产出新公司名
 */
function applyRealMerger(state, acquirerCid, targetCid) {
  var fate = state.enterpriseFate;
  if (!fate || !fate.companies) return null;

  var acquirer = fate.companies[acquirerCid];
  var target = fate.companies[targetCid];
  if (!acquirer || !target) return null;

  // 生成合并后新公司名称（品牌融合）
  var mergedName = generateMergedCompanyName(
    getCompanyNameById(acquirerCid),
    getCompanyNameById(targetCid),
  );

  // 市场份额叠加（但不超过上限）
  var newMarketShare = Math.min(
    45,
    acquirer.marketShare + target.marketShare * 0.7,
  );
  // 健康度取加权平均
  var newHealth =
    (acquirer.health * acquirer.marketShare +
      target.health * target.marketShare * 0.7) /
    (acquirer.marketShare + target.marketShare * 0.7);
  newHealth = Math.min(100, Math.max(50, newHealth + 5)); // 合并带来协同效应
  // 市场情绪提升
  var newSentiment = Math.min(
    100,
    acquirer.sentiment + (target.sentiment - acquirer.sentiment) * 0.3 + 10,
  );
  // 产品/人才分数保留较高者
  var newProductScore =
    Math.max(acquirer.productScore, target.productScore) + 3;
  var newTalentScore = Math.max(acquirer.talentScore, target.talentScore) + 2;

  // 更新收购方
  acquirer.marketShare = newMarketShare;
  acquirer.health = newHealth;
  acquirer.sentiment = newSentiment;
  acquirer.productScore = newProductScore;
  acquirer.talentScore = newTalentScore;
  acquirer.trend = "up";

  // 标记被收购方为已吸收
  target.ceasedExistence = true;
  target.ceasedAt = state.player.day;
  target.absorbedBy = acquirerCid;
  target.absorbedName = mergedName;

  // 记录到合并地图
  if (!fate.mergedCompaniesMap) fate.mergedCompaniesMap = {};
  fate.mergedCompaniesMap[targetCid] = {
    absorbedBy: acquirerCid,
    absorbedAt: state.player.day,
    mergedName: mergedName,
    originalHealth: target.health,
    originalMarketShare: target.marketShare,
  };

  // 生成新闻
  var msg =
    mergedName +
    "——" +
    getCompanyNameById(acquirerCid) +
    "与" +
    getCompanyNameById(targetCid) +
    "正式合并，行业格局重塑";

  return {
    acquirerCid: acquirerCid,
    targetCid: targetCid,
    mergedName: mergedName,
    msg: msg,
  };
}

/**
 * 生成合并公司名称
 */
function generateMergedCompanyName(nameA, nameB) {
  // 取两个名字的前缀/关键字组合
  var prefixes = {
    星辰科技: "星",
    字节龙: "字节",
    云巨人: "云",
    好玩游戏: "好玩",
    安信金融科技: "安信",
  };
  var a = prefixes[nameA] || nameA.charAt(0);
  var b = prefixes[nameB] || nameB.charAt(0);
  var suffixes = [
    "云智",
    "龙腾",
    "智创",
    "融合",
    "联盟",
    "生态",
    "联合",
    "合纵",
  ];
  var suffix = Random.fromArray(suffixes);
  return a + b + suffix;
}

/**
 * 行业板块传导效应（Phase 1#4）
 * 同板块公司一个出事时，其他受到温和影响
 */
function applyIndustryContagion(state, triggerCid, severity) {
  var fate = state.enterpriseFate;
  if (!fate || !fate.companies) return;

  // 获取触发公司的行业
  var triggerIndustry = getCompanyIndustryById(triggerCid);
  if (!triggerIndustry) return;

  var contagionMod = INDUSTRY_SECTORS[triggerIndustry]?.contagionMod || 0.5;
  var affectedCount = 0;

  for (var cid in fate.companies) {
    if (cid === triggerCid) continue;
    var co = fate.companies[cid];
    if (!co || co.ceasedExistence) continue;

    var coIndustry = getCompanyIndustryById(cid);
    if (coIndustry === triggerIndustry) {
      // 同板块公司：受到传导影响
      var impact = severity * contagionMod;
      co.health = Math.max(5, co.health - Math.floor(impact * 5));
      co.sentiment = Math.max(10, co.sentiment - Math.floor(impact * 8));
      affectedCount++;
    }
  }

  return affectedCount > 0 ? affectedCount : null;
}

/**
 * 获取公司行业（从COMPANIES数组或行业映射）
 */
function getCompanyIndustryById(cid) {
  if (typeof COMPANIES !== "undefined") {
    for (var i = 0; i < COMPANIES.length; i++) {
      if (COMPANIES[i].id === cid) return COMPANIES[i].industry;
    }
  }
  // 从CORP_STOCK_MAP反推
  if (typeof CORP_STOCK_MAP !== "undefined") {
    for (var ind in CORP_STOCK_MAP) {
      if (CORP_STOCK_MAP[ind].includes(cid)) return null; // 无法反推
    }
  }
  return null;
}

/**
 * 季度企业报告（Phase 1#5）
 * 每季度结束时生成已知公司的汇总报告
 */
function generateQuarterlyReport(state) {
  var fate = state.enterpriseFate;
  if (!fate || !fate.companies) return [];

  var reports = [];
  var companies = fate.companies;

  for (var cid in companies) {
    var co = companies[cid];
    if (!co || !co.knownToPlayer || co.ceasedExistence) continue;

    var phaseDef =
      CORP_LIFECYCLE_PHASES[co.phase] || CORP_LIFECYCLE_PHASES.mature;
    var name = getCompanyNameById(cid);

    // 计算本季度变化（简化：用当前值对比初始值）
    var healthLabel =
      co.health > 60 ? "稳健" : co.health > 30 ? "承压" : "危险";
    var trendLabel =
      co.trend === "up"
        ? "📈 上行"
        : co.trend === "down"
          ? "📉 下行"
          : "➡️ 持平";

    var report = {
      company: name,
      industry: getCompanyIndustryById(cid),
      phase: phaseDef.name,
      health: Math.round(co.health),
      healthLabel: healthLabel,
      trend: trendLabel,
      marketShare: Math.round(co.marketShare),
      sentiment: Math.round(co.sentiment),
      recentEvents: co.fateEventHistory
        ? co.fateEventHistory.slice(-2).length
        : 0,
    };
    reports.push(report);
  }

  return reports;
}

/**
 * 渲染季度报告（UI辅助函数）
 */
function renderQuarterlyReport(state, parent) {
  var reports = generateQuarterlyReport(state);
  if (!parent || reports.length === 0) return;

  var title = document.createElement("h4");
  title.textContent =
    "📋 季度企业报告（Q" + (state.player.corpQuarter || "?") + ")";
  title.style.cssText =
    "margin:12px 0 8px;font-size:14px;color:var(--text-primary);";
  parent.appendChild(title);

  for (var i = 0; i < reports.length; i++) {
    var r = reports[i];
    var card = document.createElement("div");
    card.style.cssText =
      "background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:10px;margin-bottom:6px;";
    card.innerHTML =
      "<strong>" +
      r.company +
      '</strong> <span style="color:' +
      (r.health > 60 ? "#4a9e5c" : r.health > 30 ? "#f39c12" : "#c4553d") +
      '">' +
      r.healthLabel +
      "</span> | " +
      r.trend +
      " | 份额:" +
      r.marketShare +
      "% | 情绪:" +
      r.sentiment +
      (r.recentEvents > 0 ? " | 本季度事件:" + r.recentEvents : "") +
      "";
    parent.appendChild(card);
  }
}

/**
 * 扩展 tickEnterpriseFate：加入零和博弈和合并逻辑
 */
var _originalTickEnterpriseFate = tickEnterpriseFate;
tickEnterpriseFate = function (state) {
  if (_originalTickEnterpriseFate) _originalTickEnterpriseFate(state);

  var fate = state.enterpriseFate;
  if (!fate || !fate.companies) return;

  // 零和博弈：检查是否有公司市场份额显著增长
  for (var cid in fate.companies) {
    var co = fate.companies[cid];
    if (!co || co.ceasedExistence) continue;
    // 健康度高且趋势上行的公司获得市场份额
    if (co.health > 70 && co.trend === "up" && Random.chance(0.15)) {
      var gain = Random.float(0.3, 0.8);
      applyZeroSumMarketShare(state, cid, gain);
    }
  }

  // 真实合并判定：濒死公司可能被强势公司收购
  for (var cid2 in fate.companies) {
    var co2 = fate.companies[cid2];
    if (!co2 || co2.ceasedExistence || co2.phase !== "dying") continue;
    if (Random.chance(0.08)) {
      // 找最强公司作为收购方
      var strongestCid = null;
      var maxHealth = 0;
      for (var cid3 in fate.companies) {
        if (cid3 === cid2) continue;
        var co3 = fate.companies[cid3];
        if (!co3 || co3.ceasedExistence) continue;
        if (co3.health > maxHealth) {
          maxHealth = co3.health;
          strongestCid = cid3;
        }
      }
      if (strongestCid && maxHealth > 60) {
        var mergerResult = applyRealMerger(state, strongestCid, cid2);
        if (mergerResult && mergerResult.msg) {
          StateManager.addMessage(
            "🤝 【" + mergerResult.mergedName + "】" + mergerResult.msg,
            "event",
          );
        }
      }
    }
  }

  // 行业传导：如果某公司触发重大负面事件，同板块公司受影响
  for (var cid4 in fate.companies) {
    var co4 = fate.companies[cid4];
    if (!co4 || !co4.fateEventHistory || co4.fateEventHistory.length === 0)
      continue;
    var lastEvent = co4.fateEventHistory[co4.fateEventHistory.length - 1];
    if (lastEvent && lastEvent.eventType === "scandal" && co4.knownToPlayer) {
      var affected = applyIndustryContagion(state, cid4, 0.5);
      if (affected && affected > 0) {
        StateManager.addMessage(
          "🔗 行业传导：" +
            getCompanyIndustryById(cid4) +
            "板块受牵连，" +
            affected +
            "家同板块公司受到波及",
          "warning",
        );
      }
    }
  }
};

// ====== Phase 2: 风声系统（内幕交易核心） ======

/**
 * 生成风声 — 在命运事件实际触发前3-5天发布模糊线索
 * 风声是"模糊信息"，可信度30-70%起步，需多渠道验证
 */
function generateRumor(state, companyId, eventType) {
  var fate = state.enterpriseFate;
  if (!fate) return null;

  var rumorId =
    "rumor_" +
    state.player.day +
    "_" +
    Random.float(0, 1).toString(36).substr(2, 9);
  var co = fate.companies[companyId];
  if (!co) return null;

  // 预估事件影响
  var estimatedImpact = 0.1; // 默认10%股价影响
  for (var ei = 0; ei < FATE_EVENTS.length; ei++) {
    if (FATE_EVENTS[ei].id === eventType) {
      // 根据事件类型估算影响
      if (
        eventType === "scandal" ||
        eventType === "cash_crisis" ||
        eventType === "talent_exodus"
      ) {
        estimatedImpact = Random.float(0.15, 0.25);
      } else if (
        eventType === "product_breakout" ||
        eventType === "ipo_listing"
      ) {
        estimatedImpact = Random.float(0.12, 0.25);
      } else if (eventType === "merger_acquire") {
        estimatedImpact = Random.float(0.08, 0.15);
      } else {
        estimatedImpact = Random.float(0.05, 0.13);
      }
      break;
    }
  }

  var rumor = {
    id: rumorId,
    companyId: companyId,
    eventType: eventType,
    detectedDay: state.player.day,
    confidence: Random.int(30, 69), // 30-70%
    channels: [], // 通过什么渠道感知
    estimatedImpact: estimatedImpact,
    resolvedDay: null,
    playerTraded: false,
    playerProfit: 0,
    triggerDay: state.player.day + Random.int(3, 5), // 3-5天后触发
  };

  // 存入 pendingEvents
  if (!fate.pendingEvents) fate.pendingEvents = [];
  fate.pendingEvents.push({
    companyId: companyId,
    eventType: eventType,
    triggerDay: rumor.triggerDay,
    rumorId: rumorId,
  });

  // 加入风声历史
  if (!state.insiderTrading)
    state.insiderTrading = {
      rumorHistory: [],
      tradeLog: [],
      audits: [],
      currentPenalty: {},
    };
  state.insiderTrading.rumorHistory.push(rumor);
  state.insiderTrading.activeRumor = rumor;

  return rumor;
}

/**
 * 风声可信度更新 — 通过多渠道获取新信息提升可信度
 */
function updateRumorConfidence(state, rumorId, channel, infoQuality) {
  // channel: 'work' | 'social' | 'npc' | 'news' | 'report'
  // infoQuality: 0.5-1.5
  var rumor = null;
  for (var i = 0; i < state.insiderTrading.rumorHistory.length; i++) {
    if (state.insiderTrading.rumorHistory[i].id === rumorId) {
      rumor = state.insiderTrading.rumorHistory[i];
      break;
    }
  }
  if (!rumor || rumor.resolvedDay) return null;

  var confidenceGain = 0;
  if (channel === "work") confidenceGain = Random.float(8, 20);
  else if (channel === "social") confidenceGain = Random.float(10, 25);
  else if (channel === "npc") confidenceGain = Random.float(8, 20);
  else if (channel === "news") confidenceGain = Random.float(4, 12);
  else if (channel === "report") confidenceGain = Random.float(3, 9);

  rumor.confidence = Math.min(
    100,
    rumor.confidence + confidenceGain * infoQuality,
  );
  if (rumor.channels.indexOf(channel) < 0) {
    rumor.channels.push(channel);
  }

  return { rumor: rumor, confidenceGain: confidenceGain };
}

/**
 * 风声可信度确认为100% — 事件确实发生了
 */
function updateRumorToConfirmed(state, rumorId) {
  var rumor = null;
  for (var i = 0; i < state.insiderTrading.rumorHistory.length; i++) {
    if (state.insiderTrading.rumorHistory[i].id === rumorId) {
      rumor = state.insiderTrading.rumorHistory[i];
      break;
    }
  }
  if (rumor) {
    rumor.confidence = 100;
  }
}

/**
 * 风声可信度归零 — 事件未发生（误报）
 */
function updateRumorToFalse(state, rumorId) {
  var rumor = null;
  for (var i = 0; i < state.insiderTrading.rumorHistory.length; i++) {
    if (state.insiderTrading.rumorHistory[i].id === rumorId) {
      rumor = state.insiderTrading.rumorHistory[i];
      break;
    }
  }
  if (rumor) {
    rumor.confidence = 0;
    rumor.resolvedDay = state.player.day;
  }
}

/**
 * 每日结算 pending events — 到期触发实际命运事件
 */
function tickPendingEvents(state) {
  var fate = state.enterpriseFate;
  if (!fate || !fate.pendingEvents || fate.pendingEvents.length === 0) return;

  var today = state.player.day;
  var newPending = [];

  for (var i = 0; i < fate.pendingEvents.length; i++) {
    var pending = fate.pendingEvents[i];
    if (today >= pending.triggerDay) {
      // 到期触发
      var co = fate.companies[pending.companyId];
      if (co && !co.ceasedExistence) {
        // Phase 2: 特殊处理玩家公司的 IPO 审核
        if (
          pending.eventType === "ipo_listing" &&
          state.startup &&
          state.startup.company &&
          state.startup.company.id === pending.companyId
        ) {
          // 玩家公司 IPO 审核：50% 通过率
          var approved = Random.chance(0.5);
          if (approved) {
            // IPO 成功：应用事件效果
            for (var ei = 0; ei < FATE_EVENTS.length; ei++) {
              if (
                FATE_EVENTS[ei].id === pending.eventType &&
                FATE_EVENTS[ei].condition(state, co)
              ) {
                applyFateEvent(FATE_EVENTS[ei], pending.companyId, state);
                break;
              }
            }
            // 更新创业状态
            if (state.startup) {
              state.startup.flags.exited = true;
              state.startup.flags.exitType = "ipo";
              state.startup.flags.exitDay = state.player.day;
              state.startup.flags.exitValue = Math.round(
                co.equity && co.equity.player
                  ? (co.equity.player / 100) * co.valuation
                  : 0,
              );
              state.startup.history.exitedDay = state.player.day;
              state.startup.history.exitType = "ipo";
              state.startup.history.exitValue = state.startup.flags.exitValue;
              // 玩家获得现金
              state.resources.cash += state.startup.flags.exitValue;
            }
            StateManager.addMessage(
              "🎉 IPO 审核通过！「" +
                (co.name || "公司") +
                "」成功上市，你获得 ¥" +
                (state.startup
                  ? Math.round(state.startup.flags.exitValue).toLocaleString()
                  : "0") +
                "！",
              "success",
            );
            // 弹出 IPO 结果窗口
            if (typeof showIPOResultModal === "function") {
              showIPOResultModal(state, true);
            }
          } else {
            // IPO 失败
            if (state.startup) {
              state.startup.status = "growth";
              state.startup.flags.ipoFiled = false;
            }
            StateManager.addMessage(
              "❌ IPO 审核未通过，「" + (co.name || "公司") + "」需要继续经营",
              "danger",
            );
            // 弹出 IPO 结果窗口
            if (typeof showIPOResultModal === "function") {
              showIPOResultModal(state, false);
            }
          }
        } else {
          // NPC 公司 IPO 或其他事件：正常处理
          for (var ei2 = 0; ei2 < FATE_EVENTS.length; ei2++) {
            if (
              FATE_EVENTS[ei2].id === pending.eventType &&
              FATE_EVENTS[ei2].condition(state, co)
            ) {
              applyFateEvent(FATE_EVENTS[ei2], pending.companyId, state);
              break;
            }
          }
        }
      }

      // 更新风声可信度
      if (co && !co.ceasedExistence) {
        updateRumorToConfirmed(state, pending.rumorId);
      } else {
        updateRumorToFalse(state, pending.rumorId);
      }
    } else {
      newPending.push(pending);
    }
  }

  fate.pendingEvents = newPending;
}

/**
 * 风声感知渠道 — 工作表现好时可能听到风声
 * 由 daily_pipeline 或工作执行时调用
 */
function checkRumorFromWork(state) {
  if (!state.insiderTrading || !state.insiderTrading.activeRumor) return;

  var rumor = state.insiderTrading.activeRumor;
  if (rumor.resolvedDay) return;

  var co = state.enterpriseFate?.companies?.[rumor.companyId];
  if (!co || !co.knownToPlayer) return;

  // 玩家就职该公司且表现好
  if (state.corporate && state.corporate.company === rumor.companyId) {
    var kpi = state.corporate.kpi || 0;
    var ability = state.corporate.ability || 0;
    if (kpi > 80 || ability > 70) {
      var result = updateRumorConfidence(state, rumor.id, "work", 1.0);
      if (result && result.confidenceGain > 0) {
        StateManager.addMessage(
          "👂 在公司听到风声：「" +
            getCompanyNameById(rumor.companyId) +
            "」可能有大事发生（可信度+" +
            Math.round(result.confidenceGain) +
            "%，当前" +
            Math.round(rumor.confidence) +
            "%）",
          "info",
        );
      }
    }
  }
}

/**
 * 风声感知渠道 — 向上社交行动
 */
function checkRumorFromSocial(state) {
  if (!state.insiderTrading || !state.insiderTrading.activeRumor) return;

  var rumor = state.insiderTrading.activeRumor;
  if (rumor.resolvedDay) return;

  var co = state.enterpriseFate?.companies?.[rumor.companyId];
  if (!co || !co.knownToPlayer) return;

  var result = updateRumorConfidence(state, rumor.id, "social", 1.2);
  if (result && result.confidenceGain > 0) {
    StateManager.addMessage(
      "🍵 向上社交获得线索：「" +
        getCompanyNameById(rumor.companyId) +
        "」可能有大事发生（可信度+" +
        Math.round(result.confidenceGain) +
        "%，当前" +
        Math.round(rumor.confidence) +
        "%）",
      "info",
    );
  }
}

/**
 * 记录交易日志（供内幕交易审查使用）
 */
function logTrade(state, symbol, action, shares, price, relatedRumorId) {
  if (!state.insiderTrading) state.insiderTrading = { tradeLog: [] };
  state.insiderTrading.tradeLog.push({
    day: state.player.day,
    symbol: symbol,
    action: action,
    shares: shares,
    price: price,
    relatedRumorId: relatedRumorId,
  });
}

/**
 * 季末合规审查 — 检查风声期+事件窗口的异常交易
 */
function auditInsiderTrading(state) {
  if (!state.insiderTrading) return;

  var auditResults = [];

  for (var i = 0; i < state.insiderTrading.rumorHistory.length; i++) {
    var rumor = state.insiderTrading.rumorHistory[i];
    if (!rumor.resolvedDay || rumor.resolvedDay === rumor.detectedDay + 999)
      continue; // 未实际发生或已处理

    // 检查交易窗口：风声期到事件发生
    var tradeWindowStart = rumor.detectedDay;
    var tradeWindowEnd = rumor.resolvedDay;

    // 找出相关交易
    var suspiciousTrades = [];
    for (var ti = 0; ti < state.insiderTrading.tradeLog.length; ti++) {
      var trade = state.insiderTrading.tradeLog[ti];
      if (trade.day >= tradeWindowStart && trade.day <= tradeWindowEnd) {
        // 检查是否与风声公司相关（通过股票代码映射）
        var co = state.enterpriseFate?.companies?.[rumor.companyId];
        if (co && CORP_STOCK_MAP) {
          var symbols = CORP_STOCK_MAP[rumor.companyId] || [];
          if (symbols.indexOf(trade.symbol) >= 0) {
            suspiciousTrades.push(trade);
          }
        }
      }
    }

    if (suspiciousTrades.length > 0) {
      // 计算获利
      var profit = 0;
      for (var si = 0; si < suspiciousTrades.length; si++) {
        var t = suspiciousTrades[si];
        // 简化：假设获利 = 交易金额 × 事件影响
        var tradeValue = t.shares * t.price;
        profit += tradeValue * rumor.estimatedImpact;
      }

      // 判定审查概率
      var auditProb = 0.1 + Math.min(0.6, profit / 500000);
      if (Random.chance(auditProb)) {
        // 触发处罚
        var penalty = profit * Random.float(1, 2); // 1-2倍罚款
        var bannedDays = Random.int(30, 89); // 30-90天

        var auditRecord = {
          day: state.player.day,
          companyId: rumor.companyId,
          companyName: getCompanyNameById(rumor.companyId),
          rumorId: rumor.id,
          eventType: rumor.eventType,
          trades: suspiciousTrades,
          profit: Math.round(profit),
          penalty: Math.round(penalty),
          bannedDays: bannedDays,
        };

        state.insiderTrading.audits.push(auditRecord);
        applyInsiderTradingPenalty(state, auditRecord);
        auditResults.push(auditRecord);
      }
    }
  }

  return auditResults;
}

/**
 * 应用内幕交易处罚
 */
function applyInsiderTradingPenalty(state, auditRecord) {
  state.insiderTrading.currentPenalty.tradingBanned = true;
  state.insiderTrading.currentPenalty.tradingBanEndDay =
    state.player.day + auditRecord.bannedDays;
  state.insiderTrading.currentPenalty.fine = auditRecord.penalty;
  state.insiderTrading.currentPenalty.reputationDamage = Random.int(10, 29);

  // 扣钱
  if (state.resources) {
    state.resources.cash = Math.max(
      0,
      state.resources.cash - auditRecord.penalty,
    );
  }

  StateManager.addMessage(
    "⚖️ 合规审查：你因内幕交易被处罚 ¥" +
      Math.round(auditRecord.penalty) +
      "，交易禁入 " +
      auditRecord.bannedDays +
      " 天",
    "danger",
  );
}

/**
 * 检查当前是否有交易处罚
 */
function checkTradingPenalty(state) {
  if (!state.insiderTrading || !state.insiderTrading.currentPenalty)
    return false;

  var penalty = state.insiderTrading.currentPenalty;
  if (penalty.tradingBanned && state.player.day >= penalty.tradingBanEndDay) {
    // 处罚结束
    penalty.tradingBanned = false;
    penalty.tradingBanEndDay = 0;
    StateManager.addMessage("✅ 交易禁入处罚已结束", "success");
    return false;
  }

  return penalty.tradingBanned;
}

/**
 * 获取风声摘要（用于UI显示）
 */
function getRumorSummary(state) {
  if (!state.insiderTrading || !state.insiderTrading.activeRumor) return null;

  var rumor = state.insiderTrading.activeRumor;
  if (rumor.resolvedDay) return null;

  var co = state.enterpriseFate?.companies?.[rumor.companyId];
  if (!co) return null;

  return {
    companyId: rumor.companyId,
    companyName: getCompanyNameById(rumor.companyId),
    eventType: rumor.eventType,
    confidence: Math.round(rumor.confidence),
    channels: rumor.channels,
    estimatedImpact: Math.round(rumor.estimatedImpact * 100),
    daysUntilTrigger: Math.max(0, rumor.triggerDay - state.player.day),
    detectedDay: rumor.detectedDay,
  };
}

// ====== 公司历史书系统 ======

/**
 * 获取公司完整历史（用于历史书展示）
 * @param {string} companyId - 公司ID
 * @returns {Object} 公司历史摘要
 */
function getCompanyHistory(companyId) {
  var companies = getCompanies();
  if (!companies || !companies[companyId]) return null;

  var co = companies[companyId];
  var history = co.fateEventHistory || [];
  var milestones = [];

  // 生成里程碑
  if (co.history && co.history.length > 0) {
    for (var i = 0; i < co.history.length; i++) {
      milestones.push(co.history[i]);
    }
  }

  // 添加关键事件作为里程碑
  if (co.ipoed) {
    milestones.push({
      day: co.ipoDay || 0,
      type: "ipo",
      icon: "📈",
      desc: "公司成功上市（IPO）",
    });
  }
  if (co.ceasedExistence) {
    milestones.push({
      day: co.ceasedAt || 0,
      type: "death",
      icon: "💀",
      desc: "公司退出历史舞台：" + (co.deathReason || "经营不善"),
    });
  }

  // 获取详细CEO信息
  varceoInfo = CEO_BIOS && CEO_BIOS[companyId];

  return {
    id: companyId,
    name: co.name,
    industry: co.industry,
    culture: co.culture,
    cultureIcon: co.cultureIcon,
    founder: ceoInfo ? ceoInfo.name : co.founder,
    ceoTrait: co.ceoTrait,
    ceoBio: ceoInfo ? ceoInfo.story : co.ceoBio,
    ceoName: ceoInfo ? ceoInfo.name : null,
    ceoAge: ceoInfo ? ceoInfo.age : null,
    ceoBackground: ceoInfo ? ceoInfo.background : null,
    ceoPersonality: ceoInfo ? ceoInfo.personality : null,
    ceoQuote: ceoInfo ? ceoInfo.quote : null,
    ceoWeakness: ceoInfo ? ceoInfo.weakness : null,
    currentPhase: co.phase,
    currentHealth: co.health,
    currentMarketShare: co.marketShare,
    currentStockPrice: co.stockPrice,
    ceasedExistence: co.ceasedExistence,
    ipoed: co.ipoed,
    fateEventHistory: history,
    milestones: milestones,
    totalEvents: history.length,
  };
}

/**
 * 获取所有已退出历史舞台的公司
 * @returns {Array} 已退出公司列表
 */
function getDeceasedCompanies() {
  var companies = getCompanies();
  if (!companies) return [];

  var deceased = [];
  for (var cid in companies) {
    var co = companies[cid];
    if (co && co.ceasedExistence) {
      deceased.push({
        id: cid,
        name: co.name,
        industry: co.industry,
        deathReason: co.deathReason || "经营不善",
        ceasedAt: co.ceasedAt,
        marketShareAtDeath: co.marketShare,
        fateEventHistory: co.fateEventHistory || [],
      });
    }
  }
  return deceased;
}

/**
 * 获取公司当前状态摘要（用于快速查看）
 */
function getCompanySummary(companyId) {
  var companies = getCompanies();
  if (!companies || !companies[companyId]) return null;

  var co = companies[companyId];
  return {
    id: companyId,
    name: co.name,
    industry: co.industry,
    phase: co.phase,
    health: co.health,
    marketShare: co.marketShare,
    stockPrice: co.stockPrice,
    trend: co.trend,
    ceasedExistence: co.ceasedExistence,
    ceoTrait: co.ceoTrait,
  };
}

/**
 * CEO 特质中文名称映射
 */
function getCeoTraitName(traitId) {
  for (var i = 0; i < CEO_TRAITS.length; i++) {
    if (CEO_TRAITS[i].id === traitId) {
      return CEO_TRAITS[i].name;
    }
  }
  return "未知";
}

/**
 * CEO 特质图标映射
 */
function getCeoTraitIcon(traitId) {
  for (var i = 0; i < CEO_TRAITS.length; i++) {
    if (CEO_TRAITS[i].id === traitId) {
      return CEO_TRAITS[i].icon;
    }
  }
  return "👤";
}

/**
 * 获取所有公司（兼容不同状态结构）
 */
function getCompanies() {
  var state = StateManager.getState();
  if (state && state.enterpriseFate && state.enterpriseFate.companies) {
    return state.enterpriseFate.companies;
  }
  return {};
}

// ====== Phase 3: 倒闭遗产链系统 ======

/**
 * 生成公司倒闭后的遗产事件
 * 倒闭不是终点，而是"遗产"的开始
 * @param {object} state 游戏状态
 * @param {string} deceasedCid 倒闭公司ID
 * @param {object} deceasedCo 倒闭公司数据
 * @returns {Array} 生成的遗产事件列表
 */
function generateCompanyAftermath(state, deceasedCid, deceasedCo) {
  if (!deceasedCo || !deceasedCo.name) return [];

  var name = deceasedCo.name;
  var industry = deceasedCo.industry || getCompanyIndustry(deceasedCid);
  var aftermaths = [];

  // 遗产节点数：基于公司规模决定（1-3个）
  var scale = deceasedCo.marketShare || 10;
  var eventCount;
  if (scale >= 25) eventCount = 3;
  else if (scale >= 15) eventCount = 2 + (Random.chance(0.5) ? 1 : 0);
  else eventCount = 1 + (Random.chance(0.3) ? 1 : 0);

  // 遗产类型池
  var availableTypes = [];
  // 高管开新公司
  availableTypes.push({ type: "exec_startup", weight: 40 });
  // 专利被收购
  availableTypes.push({ type: "patent_acquisition", weight: 35 });
  // 员工散布
  availableTypes.push({ type: "talent_dispersion", weight: 25 });

  // 按权重随机选择
  var selectedTypes = [];
  for (var i = 0; i < eventCount; i++) {
    var totalWeight = 0;
    for (var wi = 0; wi < availableTypes.length; wi++) {
      if (
        selectedTypes.indexOf(availableTypes[wi].type) === -1 ||
        eventCount > 2
      ) {
        totalWeight += availableTypes[wi].weight;
      }
    }
    if (totalWeight <= 0) break;

    var roll = Random.float(0, totalWeight);
    for (var ai = 0; ai < availableTypes.length; ai++) {
      var at = availableTypes[ai];
      if (selectedTypes.indexOf(at.type) !== -1 && eventCount <= 2) continue;
      roll -= at.weight;
      if (roll <= 0) {
        selectedTypes.push(at.type);
        break;
      }
    }
  }

  // 执行每个遗产类型
  for (var si = 0; si < selectedTypes.length; si++) {
    var eventType = selectedTypes[si];
    var result = null;

    if (eventType === "exec_startup") {
      result = _execStartupAftermath(state, deceasedCid, deceasedCo);
    } else if (eventType === "patent_acquisition") {
      result = _patentAcquisitionAftermath(state, deceasedCid, deceasedCo);
    } else if (eventType === "talent_dispersion") {
      result = _talentDispersionAftermath(state, deceasedCid, deceasedCo);
    }

    if (result) {
      aftermaths.push(result);
    }
  }

  // 记录到多周目记忆
  if (typeof recordLegacyEvent === "function") {
    for (var mi = 0; mi < aftermaths.length; mi++) {
      recordLegacyEvent(aftermaths[mi], state);
    }
  }

  return aftermaths;
}

/**
 * 遗产类型1：高管开新公司
 * 原公司高管/技术骨干带着经验/专利/人脉开新公司
 */
function _execStartupAftermath(state, deceasedCid, deceasedCo) {
  // 从公司_spawner获取生成函数
  if (typeof generateNewCompany !== "function") return null;

  var industry = deceasedCo.industry || getCompanyIndustry(deceasedCid);

  // 生成新公司
  var newCo = generateNewCompany(industry);
  if (!newCo) return null;

  // 继承原公司的产品分数（60% + 波动）
  var inheritedProductScore =
    (deceasedCo.productScore || 50) * 0.6 + Random.float(-10, 10);
  newCo.productScore = Math.max(
    30,
    Math.min(80, Math.round(inheritedProductScore)),
  );

  // 继承原公司的人才分数（50% + 波动）
  var inheritedTalentScore =
    (deceasedCo.talentScore || 50) * 0.5 + Random.float(-10, 10);
  newCo.talentScore = Math.max(
    25,
    Math.min(70, Math.round(inheritedTalentScore)),
  );

  // 健康度基于原公司最终健康度
  newCo.health = Math.max(
    45,
    Math.min(85, Math.round((deceasedCo.health || 50) * 0.4 + 40)),
  );

  // 市场份额：3-8%
  newCo.marketShare = Math.round(Random.float(3, 8) * 100) / 100;

  // 添加遗产标记
  newCo.fromAftermath = true;
  newCo.aftermathSource = deceasedCid;
  newCo.aftermathSourceName = deceasedCo.name;
  newCo.aftermathType = "exec_startup";
  newCo.aftermathDay = state.player.day;

  // 加入企业命运
  var fate = state.enterpriseFate;
  if (!fate)
    state.enterpriseFate = {
      companies: {},
      fateEventCooldown: {},
      lastFateTick: 0,
    };
  if (!fate.companies) fate.companies = {};
  fate.companies[newCo.id] = newCo;

  // 加入股票市场
  if (state.investment && state.investment.stockMarket) {
    state.investment.stockMarket[newCo.stockSymbol] = {
      price: newCo.stockPrice,
      company: newCo.id,
      history: [newCo.stockPrice],
    };
  }

  // 加入COMPANIES数组
  if (typeof COMPANIES !== "undefined") {
    COMPANIES.push({
      id: newCo.id,
      name: newCo.name,
      industry: industry,
      stockSymbol: newCo.stockSymbol,
    });
  }

  // 记录历史
  newCo.history = newCo.history || [];
  newCo.history.push({
    day: state.player.day,
    event: "aftermath_exec_startup",
    desc: "原公司" + deceasedCo.name + "倒闭后，高管团队带着核心技术创立新公司",
  });

  // 生成新闻
  var positions = ["CTO", "技术总监", "联合创始人", "首席科学家", "产品副总裁"];
  var position = Random.fromArray(positions);
  var execName = Random.fromArray(["李总", "王总", "张总", "陈总", "刘总"]);
  var msg =
    position +
    " " +
    execName +
    "宣布创立「" +
    newCo.name +
    "」，" +
    "带着原公司未公开的核心专利技术，目标在" +
    industry +
    "领域重起炉灶";

  StateManager.addMessage("🏭 " + msg, "event");

  // 更新行业格局
  if (typeof updateIndustryEvolution === "function") {
    updateIndustryEvolution(industry, "company_spawned");
  }

  return {
    type: "exec_startup",
    newCompanyId: newCo.id,
    newCompanyName: newCo.name,
    industry: industry,
    inheritedProductScore: newCo.productScore,
    inheritedTalentScore: newCo.talentScore,
    msg: msg,
  };
}

/**
 * 遗产类型2：专利被收购
 * 倒闭公司的专利/技术被竞品公司收购
 */
function _patentAcquisitionAftermath(state, deceasedCid, deceasedCo) {
  var companies = state.enterpriseFate && state.enterpriseFate.companies;
  if (!companies) return null;

  var deceasedIndustry = deceasedCo.industry || getCompanyIndustry(deceasedCid);

  // 找同/相关行业的公司
  var candidates = [];
  for (var cid in companies) {
    var co = companies[cid];
    if (!co || co.ceasedExistence || cid === deceasedCid) continue;
    // 同行业或相关行业
    var coIndustry = co.industry || getCompanyIndustry(cid);
    if (coIndustry === deceasedIndustry) {
      candidates.push({ cid: cid, co: co, affinity: 1.0 });
    } else if (_isRelatedIndustry(coIndustry, deceasedIndustry)) {
      candidates.push({ cid: cid, co: co, affinity: 0.6 });
    }
  }

  if (candidates.length === 0) return null;

  // 选一个（优先考虑productScore较高的）
  candidates.sort(function (a, b) {
    return (b.co.productScore || 0) - (a.co.productScore || 0);
  });
  var picked = Random.fromArray(candidates.slice(0, 3));
  var targetCo = picked.co;

  // 提升产品分数
  var productBoost = Random.int(5, 14);
  targetCo.productScore = Math.min(
    100,
    (targetCo.productScore || 50) + productBoost,
  );

  // 提升人才分数
  var talentBoost = Random.int(3, 9);
  targetCo.talentScore = Math.min(
    100,
    (targetCo.talentScore || 50) + talentBoost,
  );

  // 提升市场份额
  var shareBoost = Math.round(Random.float(1, 3) * 100) / 100;
  targetCo.marketShare = Math.min(45, (targetCo.marketShare || 0) + shareBoost);

  // 提升健康度
  targetCo.health = Math.min(100, (targetCo.health || 50) + 3);

  // 记录历史
  targetCo.history = targetCo.history || [];
  targetCo.history.push({
    day: state.player.day,
    event: "aftermath_patent_acquisition",
    desc: "收购了" + deceasedCo.name + "的核心专利，技术实力大幅增强",
  });

  var msg =
    "「" +
    targetCo.name +
    "」宣布以" +
    Math.round(Random.float(500, 2500)) +
    "万" +
    "收购" +
    deceasedCo.name +
    "的核心专利组合，技术实力跃升";

  StateManager.addMessage("💡 " + msg, "event");

  // 更新行业格局
  if (typeof updateIndustryEvolution === "function") {
    updateIndustryEvolution(deceasedIndustry, "patent_acquired");
  }

  return {
    type: "patent_acquisition",
    targetCompanyId: picked.cid,
    targetCompanyName: targetCo.name,
    productBoost: productBoost,
    talentBoost: talentBoost,
    shareBoost: shareBoost,
    msg: msg,
  };
}

/**
 * 判断两个行业是否相关
 */
function _isRelatedIndustry(indA, indB) {
  var relatedGroups = {
    "AI/大模型": ["云计算/企业服务", "生物医药"],
    "短视频/推荐": ["手游/出海", "AI/大模型"],
    "云计算/企业服务": ["AI/大模型", "金融科技"],
    "手游/出海": ["短视频/推荐", "AI/大模型"],
    金融科技: ["云计算/企业服务", "AI/大模型"],
    "新能源/智能车": ["AI/大模型", "云计算/企业服务"],
    生物医药: ["AI/大模型", "金融科技"],
    跨境电商: ["云计算/企业服务", "手游/出海"],
  };
  var related = relatedGroups[indA] || [];
  return related.indexOf(indB) !== -1;
}

/**
 * 遗产类型3：员工散布
 * 原公司员工散布到其他公司，增强人才
 */
function _talentDispersionAftermath(state, deceasedCid, deceasedCo) {
  var companies = state.enterpriseFate && state.enterpriseFate.companies;
  if (!companies) return null;

  var deceasedIndustry = deceasedCo.industry || getCompanyIndustry(deceasedCid);

  // 找2-3家公司接收员工
  var candidates = [];
  for (var cid in companies) {
    var co = companies[cid];
    if (!co || co.ceasedExistence || cid === deceasedCid) continue;
    // 同/相关行业优先
    var coIndustry = co.industry || getCompanyIndustry(cid);
    var affinity =
      coIndustry === deceasedIndustry
        ? 1.0
        : _isRelatedIndustry(coIndustry, deceasedIndustry)
          ? 0.6
          : 0.3;
    candidates.push({ cid: cid, co: co, affinity: affinity });
  }

  if (candidates.length === 0) return null;

  candidates.sort(function (a, b) {
    return b.affinity - a.affinity;
  });

  var numRecipients = Math.min(3, Math.max(2, candidates.length));
  var recipients = candidates.slice(0, numRecipients);
  var totalTalent = 0;

  for (var ri = 0; ri < recipients.length; ri++) {
    var rec = recipients[ri];
    var talentGain = Random.int(3, 8);
    rec.co.talentScore = Math.min(100, (rec.co.talentScore || 50) + talentGain);
    totalTalent += talentGain;

    // 少量产品分数提升
    var productGain = Random.int(0, 2);
    if (productGain > 0) {
      rec.co.productScore = Math.min(
        100,
        (rec.co.productScore || 50) + productGain,
      );
    }

    // 记录历史
    rec.co.history = rec.co.history || [];
    rec.co.history.push({
      day: state.player.day,
      event: "aftermath_talent_dispersion",
      desc: "吸纳了" + deceasedCo.name + "的资深员工团队，人才储备增强",
    });
  }

  var msg =
    deceasedCo.name +
    "解散后，" +
    recipients.length +
    "家公司吸纳了其资深员工团队，" +
    "共计" +
    totalTalent +
    "点人才经验流入行业";

  StateManager.addMessage("👥 " + msg, "info");

  // 更新行业格局
  if (typeof updateIndustryEvolution === "function") {
    updateIndustryEvolution(deceasedIndustry, "talent_dispersion");
  }

  return {
    type: "talent_dispersion",
    recipientCount: recipients.length,
    recipientCompanies: recipients.map(function (r) {
      return { id: r.cid, name: r.co.name, talentGain: r.co.talentScore };
    }),
    totalTalent: totalTalent,
    msg: msg,
  };
}

/**
 * 记录遗产事件到多周目记忆（由 multi_run_memory.js 提供）
 */
function recordLegacyEvent(aftermath, state) {
  if (typeof recordLegacyEventToMemory === "function") {
    recordLegacyEventToMemory(aftermath, state);
  }
}

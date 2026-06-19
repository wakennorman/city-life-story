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
      co.health = Math.max(
        5,
        co.health - (10 + Math.floor(Math.random() * 11)),
      );
      co.marketShare = Math.max(
        1,
        co.marketShare - (2 + Math.floor(Math.random() * 4)),
      );
      co.sentiment = Math.max(
        5,
        co.sentiment - (15 + Math.floor(Math.random() * 11)),
      );
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
      co.health = Math.min(
        100,
        co.health + (10 + Math.floor(Math.random() * 11)),
      );
      co.marketShare = Math.min(
        40,
        co.marketShare + (3 + Math.floor(Math.random() * 6)),
      );
      co.sentiment = Math.min(
        100,
        co.sentiment + (20 + Math.floor(Math.random() * 11)),
      );
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
      co.health = Math.max(
        5,
        co.health - (15 + Math.floor(Math.random() * 11)),
      );
      co.sentiment = Math.max(
        5,
        co.sentiment - (25 + Math.floor(Math.random() * 11)),
      );
      co.talentScore = Math.max(
        5,
        co.talentScore - (10 + Math.floor(Math.random() * 6)),
      );
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
      co.health = Math.min(
        100,
        co.health + (5 + Math.floor(Math.random() * 11)),
      );
      co.sentiment = Math.min(
        100,
        co.sentiment + (15 + Math.floor(Math.random() * 11)),
      );
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
      co.sentiment = Math.min(
        100,
        co.sentiment + (10 + Math.floor(Math.random() * 11)),
      );
      co.talentScore = Math.min(
        100,
        co.talentScore + (5 + Math.floor(Math.random() * 11)),
      );
      co.health = Math.min(
        100,
        co.health + (5 + Math.floor(Math.random() * 6)),
      );
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
      co.health = Math.max(
        3,
        co.health - (20 + Math.floor(Math.random() * 11)),
      );
      co.sentiment = Math.max(5, co.sentiment - 20);
      co.talentScore = Math.max(
        5,
        co.talentScore - (10 + Math.floor(Math.random() * 11)),
      );
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
        (100 + Math.floor(Math.random() * 200)) +
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
        co.productScore - (10 + Math.floor(Math.random() * 11)),
      );
      co.talentScore = Math.max(
        5,
        co.talentScore - (15 + Math.floor(Math.random() * 16)),
      );
      co.sentiment = Math.max(
        10,
        co.sentiment - (10 + Math.floor(Math.random() * 11)),
      );
      // 可能引发连锁反应：健康度下降
      co.health = Math.max(5, co.health - (5 + Math.floor(Math.random() * 6)));
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
      co.productScore = Math.max(
        20,
        co.productScore - (5 + Math.floor(Math.random() * 6)),
      );
      co.health = Math.max(10, co.health - (8 + Math.floor(Math.random() * 8)));
      co.sentiment = Math.max(
        10,
        co.sentiment - (10 + Math.floor(Math.random() * 11)),
      );
      if (targetCid && companies[targetCid]) {
        var targetCo = companies[targetCid];
        targetCo.productScore = Math.max(
          20,
          targetCo.productScore - (5 + Math.floor(Math.random() * 6)),
        );
        targetCo.health = Math.max(
          10,
          targetCo.health - (5 + Math.floor(Math.random() * 6)),
        );
        targetCo.sentiment = Math.max(
          10,
          targetCo.sentiment - (8 + Math.floor(Math.random() * 9)),
        );
      }
      return {
        stockMul: 0.93,
        msg: "发起/卷入专利诉讼战，研发投入被迫转向法律费用",
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
    var healthDrift =
      (Math.random() - 0.5) * 2 * (phaseDef.recoveryRate || 0.1);
    co.health = Math.max(1, Math.min(100, co.health + healthDrift));

    // marketShare: 受阶段影响
    var shareDrift =
      (Math.random() - 0.5) * 0.6 +
      (co.trend === "up" ? 0.15 : co.trend === "down" ? -0.15 : 0);
    co.marketShare = Math.max(1, Math.min(45, co.marketShare + shareDrift));

    // sentiment: 随机波动
    co.sentiment = Math.max(
      5,
      Math.min(100, co.sentiment + (Math.random() - 0.5) * 4),
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

    if (Math.random() < baseProb) {
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
        var roll = Math.random() * totalWeight;
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
  var suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
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
    if (co.health > 70 && co.trend === "up" && Math.random() < 0.15) {
      var gain = 0.3 + Math.random() * 0.5;
      applyZeroSumMarketShare(state, cid, gain);
    }
  }

  // 真实合并判定：濒死公司可能被强势公司收购
  for (var cid2 in fate.companies) {
    var co2 = fate.companies[cid2];
    if (!co2 || co2.ceasedExistence || co2.phase !== "dying") continue;
    if (Math.random() < 0.08) {
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
    "rumor_" + state.player.day + "_" + Math.random().toString(36).substr(2, 9);
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
        estimatedImpact = 0.15 + Math.random() * 0.1;
      } else if (
        eventType === "product_breakout" ||
        eventType === "ipo_listing"
      ) {
        estimatedImpact = 0.12 + Math.random() * 0.13;
      } else if (eventType === "merger_acquire") {
        estimatedImpact = 0.08 + Math.random() * 0.07;
      } else {
        estimatedImpact = 0.05 + Math.random() * 0.08;
      }
      break;
    }
  }

  var rumor = {
    id: rumorId,
    companyId: companyId,
    eventType: eventType,
    detectedDay: state.player.day,
    confidence: 30 + Math.floor(Math.random() * 40), // 30-70%
    channels: [], // 通过什么渠道感知
    estimatedImpact: estimatedImpact,
    resolvedDay: null,
    playerTraded: false,
    playerProfit: 0,
    triggerDay: state.player.day + 3 + Math.floor(Math.random() * 3), // 3-5天后触发
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
  if (channel === "work") confidenceGain = 8 + Math.random() * 12;
  else if (channel === "social") confidenceGain = 10 + Math.random() * 15;
  else if (channel === "npc") confidenceGain = 8 + Math.random() * 12;
  else if (channel === "news") confidenceGain = 4 + Math.random() * 8;
  else if (channel === "report") confidenceGain = 3 + Math.random() * 6;

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
          var approved = Math.random() < 0.5;
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
      if (Math.random() < auditProb) {
        // 触发处罚
        var penalty = profit * (1 + Math.random()); // 1-2倍罚款
        var bannedDays = 30 + Math.floor(Math.random() * 60); // 30-90天

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
  state.insiderTrading.currentPenalty.reputationDamage =
    10 + Math.floor(Math.random() * 20);

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

  return {
    id: companyId,
    name: co.name,
    industry: co.industry,
    culture: co.culture,
    cultureIcon: co.cultureIcon,
    founder: co.founder,
    ceoTrait: co.ceoTrait,
    ceoBio: co.ceoBio,
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

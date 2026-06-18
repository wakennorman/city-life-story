/**
 * 企业命运系统 — 动态商业生态变迁引擎
 *
 * P2#11：玩家投资/就职/竞争过的公司随时间成长、合并、倒闭，
 * 形成可观察的商业生态变迁。5家公司各自经历生命周期阶段，
 * 受自然漂移、命运事件、玩家行为三重影响。
 *
 * 设计理念（参考《Dwarf Fortress》历史记忆 + 《CK3》关系网络）：
 * - 公司不是静态背景板，而是有生命周期的经济实体
 * - 玩家的选择和表现切实影响公司命运
 * - 命运事件生成新闻，新闻影响投资，投资反馈到公司
 */

// ====== 7 种命运事件模板 ======
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
        // 濒死公司被收购——标记flag供事件系统使用
        co.phase = "dying";
        co.health = Math.max(3, co.health - 5);
        co.marketShare = Math.max(1, Math.floor(co.marketShare * 0.5));
        st.flags["_acquired_" + cid] = true;
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

    // 3. 标记 knownToPlayer（玩家已入职或持有股票）
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

  // 5. 命运事件触发
  rollFateEvent(state);

  fate.lastFateTick = state.player.day;
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
        // 按权重选取
        var totalWeight = 0;
        for (var vi = 0; vi < validEvents.length; vi++) {
          totalWeight += validEvents[vi].weight || 1;
        }
        var roll = Math.random() * totalWeight;
        var picked = validEvents[0];
        for (var vi2 = 0; vi2 < validEvents.length; vi2++) {
          roll -= validEvents[vi2].weight || 1;
          if (roll <= 0) {
            picked = validEvents[vi2];
            break;
          }
        }

        // 应用事件
        var result = applyFateEvent(picked, cid, state);
        if (result) {
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

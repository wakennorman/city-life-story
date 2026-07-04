/**
 * 世界参数反馈环 — 统一游戏内所有动态参数的反馈闭环
 *
 * █████████████████████████████████████████████████
 * █  核心理念：现实只决定开局方向，             █
 * █  之后这局世界就是一个封闭演化系统，          █
 * █  由玩家选择和随机性驱动。                   █
 * █  玩家行为改变世界参数，世界参数改变事件概率。 █
 * █████████████████████████████████████████████████
 *
 * ┌──────────────────────┐
 * │  seedWorldFromReality │ ← 开局拉取真实数据（非必须，离线可回退）
 * └──────────┬───────────┘
 *            ↓ 转化为初始参数
 * ┌──────────────────────┐
 * │    _worldParams       │ ← 统一状态管理
 * │  ├ sectorHeat         │    行业热度（玩家行为→反馈→事件）
 * │  ├ marketMood         │    市场情绪
 * │  ├ playerWealthLevel  │    玩家财富等级
 * │  ├ volatilityTrend    │    波动趋势
 * │  └ ...                │
 * └──────┬───────────────┘
 *        │ 每日管线 tickWorldParams
 *        ├ applyWealthFeedback    ← 玩家财富→世界
 *        ├ applySectorFeedback    ← 玩家行为→行业热度
 *        ├ applyMarketFeedback    ← 行业内部传导
 *        ├ decayWorldParams       ← 自然衰减回基线
 *        └ updateMarketMood       ← 重新计算情绪
 *        ↓
 * ┌───────────────────────────┐
 * │  反馈消费方（多方读取）       │
 * ├  investment.js → 股价趋势    │
 * ├  events.js    → 事件权重     │
 * ├  news.js      → 新闻概率     │
 * ├  npcs.js      → NPC对话     │
 * └  jobs.js      → 工作收入     │
 * └───────────────────────────┘
 */

// ====== 行业列表（与 investment.js INV_STOCKS 对齐） ======
const WORLD_SECTORS = ["科技", "消费", "金融", "房地产", "医药", "新能源"];

// ====== 默认世界参数（新游戏时生成） ======
function createDefaultWorldParams() {
  // 初始各行业热度均衡
  var sectors = {};
  for (var i = 0; i < WORLD_SECTORS.length; i++) {
    sectors[WORLD_SECTORS[i]] = 1.0;
  }

  return {
    // --- 开局种子（开局一次，不再变动） ---
    seedDate: null, // 现实日期（离线时为 null）
    seedSource: "random", // 'random' | 'realtime'
    baseVolatility: 1.0, // 基础波动率（影响所有随机游走幅度）
    initialSectorBias: JSON.parse(JSON.stringify(sectors)), // 开局时的行业初始偏移

    // --- 动态参数（每日更新） ---
    sectorHeat: JSON.parse(JSON.stringify(sectors)), // 当前行业热度（1.0 = 均衡）
    marketMood: "neutral", // 市场情绪: bullish / bearish / neutral / volatile
    volatilityTrend: 0, // 波动趋势方向 (-1~1, 累积后取 sign)

    // --- 玩家反馈累积 ---
    playerWealthLevel: 0, // 0~5: 玩家财富等级
    playerFameLevel: 0, // 0~5: 玩家名气等级
    sectorPlayerActivity: {}, // { "科技": 3, ... } 玩家近期在行业的活跃天数

    // --- 反馈衰减状态 ---
    lastUpdateDay: 0,
    decayRate: 0.02, // 每日向基线衰减 2%
  };
}

// ====== 开局种子：从现实拉取参数 ======

/**
 * 从现实世界获取当日市场情绪，seed 到游戏世界参数。
 * 纯前端实现，使用免费公开 API。
 * 网络失败则自动回退到随机参数。
 *
 * 设计原则：
 * - 网络不通时玩家完全无感（回退随机默认值）
 * - 只取「方向性」参数（涨/跌/震荡），不取具体新闻
 * - 不存储任何玩家数据到外部
 */
function seedWorldFromReality(state) {
  var params = state._worldParams || createDefaultWorldParams();
  params.seedDate = new Date().toISOString().slice(0, 10);

  // 尝试拉取真实市场数据（使用 Yahoo Finance 免费查询接口）
  // 中国A股：000001.SS（上证指数）
  var fetchUrl =
    "https://query1.finance.yahoo.com/v8/finance/chart/000001.SS?range=5d&interval=1d";

  // 浏览器环境：CORS 限制导致 Yahoo Finance 无法获取，跳过直接使用随机种子
  var isBrowser =
    typeof window !== "undefined" && typeof window.navigator !== "undefined";
  var success = false;

  try {
    if (isBrowser) throw new Error("skip: browser CORS");

    // 使用 XMLHttpRequest 的同步风格（保持脚本加载顺序兼容性）
    var xhr = new XMLHttpRequest();
    xhr.open("GET", fetchUrl, false); // 同步请求（开局时阻塞可接受）
    xhr.timeout = 5000;
    xhr.send(null);

    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      if (
        data &&
        data.chart &&
        data.chart.result &&
        data.chart.result.length > 0
      ) {
        var result = data.chart.result[0];
        var closes =
          result.indicators && result.indicators.quote
            ? result.indicators.quote[0].close
            : null;

        if (closes && closes.length >= 2) {
          // 计算最近两个交易日的涨跌幅
          var prevClose = closes[closes.length - 2];
          var latestClose = closes[closes.length - 1];
          var changePercent = (latestClose - prevClose) / prevClose;

          // 计算5日波动率（用最近5个close的标准差/均值）
          var n = Math.min(closes.length, 5);
          var sum = 0;
          for (var ci = closes.length - n; ci < closes.length; ci++) {
            sum += closes[ci];
          }
          var mean = sum / n;
          var variance = 0;
          for (var cj = closes.length - n; cj < closes.length; cj++) {
            variance += (closes[cj] - mean) * (closes[cj] - mean);
          }
          var stddev = Math.sqrt(variance / n);
          var cv = stddev / mean; // 变异系数（波动率指标）

          // 设置市场情绪
          if (changePercent > 0.015) {
            params.marketMood = "bullish";
          } else if (changePercent < -0.015) {
            params.marketMood = "bearish";
          } else if (cv > 0.02) {
            params.marketMood = "volatile";
          } else {
            params.marketMood = "neutral";
          }

          // 设置波动率
          params.baseVolatility = Math.max(0.5, Math.min(2.0, 1.0 + cv * 10));

          // 设置行业初始偏移（基于市场情绪）
          for (var si = 0; si < WORLD_SECTORS.length; si++) {
            var sec = WORLD_SECTORS[si];
            switch (sec) {
              case "科技":
                params.initialSectorBias[sec] =
                  params.marketMood === "bullish" ? 1.1 : 0.95;
                break;
              case "消费":
                params.initialSectorBias[sec] = 1.0;
                break;
              case "金融":
                params.initialSectorBias[sec] =
                  params.marketMood === "bearish" ? 0.9 : 1.05;
                break;
              case "房地产":
                // 房地产波动范围更宽（0.70-1.30），反映真实市场大起大落
                switch (params.marketMood) {
                  case "bullish":
                    params.initialSectorBias[sec] = Random.float(1.0, 1.3);
                    break;
                  case "bearish":
                    params.initialSectorBias[sec] = Random.float(0.7, 0.9);
                    break;
                  default:
                    params.initialSectorBias[sec] = Random.float(0.8, 1.2);
                }
                break;
              case "医药":
                params.initialSectorBias[sec] = 1.02;
                break;
              case "新能源":
                params.initialSectorBias[sec] = 1.08;
                break;
              default:
                params.initialSectorBias[sec] = 1.0;
            }
          }

          // 将 initialSectorBias 复制到 sectorHeat
          for (var sk in params.initialSectorBias) {
            params.sectorHeat[sk] = params.initialSectorBias[sk];
          }

          params.seedSource = "realtime";
          success = true;

          StateManager.addMessage(
            "🌐 世界参数已根据今日市场数据初始化（" +
              params.marketMood +
              "，波动率" +
              params.baseVolatility.toFixed(2) +
              "）",
            "info",
          );
        }
      }
    }
  } catch (e) {
    // 网络失败：静默回退，不报错
  }

  if (!success) {
    // ====== 离线/网络失败回退：随机种子 ======
    params.marketMood = ["bullish", "bearish", "neutral", "volatile"][
      Random.int(0, 3)
    ];
    params.baseVolatility = Random.float(0.8, 1.6);

    for (var si2 = 0; si2 < WORLD_SECTORS.length; si2++) {
      var sec2 = WORLD_SECTORS[si2];
      // 房地产行业波动范围更宽（0.70-1.30），其余行业范围较窄（0.85-1.15）
      if (sec2 === "房地产") {
        params.initialSectorBias[sec2] = Random.float(0.7, 1.3);
      } else {
        params.initialSectorBias[sec2] = Random.float(0.85, 1.15);
      }
      params.sectorHeat[sec2] = params.initialSectorBias[sec2];
    }

    params.seedSource = "random";
    params.seedDate = null;

    StateManager.addMessage(
      "🌐 世界参数已随机初始化（浏览器模式：使用本地随机种子）",
      "info",
    );
  }

  state._worldParams = params;
  return params;
  return params;
}

// ====== 每日参数更新 ======

/**
 * 每日世界参数更新（在 daily_pipeline 中调用）
 * 所有反馈逻辑汇聚于此，集中管理，避免各模块各自为政。
 */
function tickWorldParams(state) {
  var params = state._worldParams;
  if (!params) {
    params = createDefaultWorldParams();
    state._worldParams = params;
  }
  if (params.lastUpdateDay >= state.player.day) return;
  params.lastUpdateDay = state.player.day;

  // 1. 玩家财富反馈
  applyWealthFeedback(state);

  // 2. 玩家行为→行业热度
  applySectorFeedback(state);

  // 3. 行业间的内部传导（行业A热→关联行业B变热）
  applyMarketFeedback(state);

  // 4. 自然衰减（防止无限累积）
  decayWorldParams(state);

  // 5. 重新计算市场情绪
  updateMarketMood(state);
}

// ====== 反馈函数 ======

/**
 * Loop 1: 玩家财富 → 世界参数
 *
 * 玩家的总资产（现金+银行存款）映射到 wealthLevel，
 * 这会影响 NPC 态度、银行利率、购房选项等。
 *
 * 财富等级：
 *   0 = 破产边缘（< ¥100）
 *   1 = 勉强糊口（¥100~¥1k）
 *   2 = 生活稳定（¥1k~¥10k）
 *   3 = 小有积蓄（¥10k~¥50k）
 *   4 = 富裕阶层（¥50k~¥200k）
 *   5 = 财务自由（¥200k+）
 */
function applyWealthFeedback(state) {
  var params = state._worldParams;
  var cash = state.resources.cash || 0;
  var bank = state.resources.bankBalance || 0;
  var totalAssets = cash + bank;

  var newLevel;
  if (totalAssets >= 200000) newLevel = 5;
  else if (totalAssets >= 50000) newLevel = 4;
  else if (totalAssets >= 10000) newLevel = 3;
  else if (totalAssets >= 1000) newLevel = 2;
  else if (totalAssets >= 100) newLevel = 1;
  else newLevel = 0;

  // 财富等级变化时触发消息
  if (newLevel !== params.playerWealthLevel) {
    var wealthMessages = [
      "💸 你几乎身无分文...", // 0
      "🪙 手头有点紧，但还活着", // 1
      "💰 财务状况还算稳定", // 2
      "💵 攒了些钱，心里踏实多了", // 3
      "🧧 你已经是不折不扣的有钱人了", // 4
      "👑 财务自由！这座城市对你来说已经没有什么买不起的了", // 5
    ];
    // 只在升级时提醒（降级不打扰）
    if (newLevel > params.playerWealthLevel) {
      StateManager.addMessage(
        wealthMessages[Math.min(newLevel, wealthMessages.length - 1)],
        "success",
      );
    }
    params.playerWealthLevel = newLevel;
  }

  // 名气等级（从 player.fame 映射）
  var fame = state.player.fame || 0;
  var fameLevel;
  if (fame >= 80) fameLevel = 5;
  else if (fame >= 60) fameLevel = 4;
  else if (fame >= 40) fameLevel = 3;
  else if (fame >= 20) fameLevel = 2;
  else if (fame >= 5) fameLevel = 1;
  else fameLevel = 0;
  params.playerFameLevel = fameLevel;
}

/**
 * Loop 2: 行业热度驱动
 *
 * ⚠️ 设计原则：普通玩家的个人行为不改变行业热度。
 *   一个上班族在哪工作、散户买哪只股票——这些微观行为
 *   在宏观层面没有任何可测量的影响。
 *
 * 行业热度的真正驱动力（按影响力排序）：
 *   1. 随机日漂移 —— 市场自然的每日噪声（主力驱动）
 *   2. 行业关联传导 —— 上游行业热 → 下游升温（applyMarketFeedback）
 *   3. 重大新闻/事件 —— news.js 中已有投资影响（news_investment_bridge）
 *   4. 高影响力玩家 —— 财富/名气 ≥ 4 级时产生微弱边际影响
 *   5. CEO公司 —— 创业系统中有市场份额的大公司才有关联
 *
 * 参考游戏设计：
 *   - Capitalism Lab：员工不影响市场，CEO决策改变行业格局
 *   - Democracy 4：影响力通过系统杠杆传递，个人不直接影响宏观
 *   - 大多数：世界是独立环境，玩家在其中适应而非改变
 */
function applySectorFeedback(state) {
  var params = state._worldParams;
  if (!params) return;
  var vol = params.baseVolatility || 1.0;

  // ====== 1. 随机日漂移（主力行业波动来源） ======
  // 每个行业每日有微小随机波动，模拟市场自然噪声。
  // 漂移中心化偏正（0.4 偏移 → 约 60% 概率小幅上涨），
  // 模拟经济长期温和增长。漂移幅度受 baseVolatility 放大。
  // 日漂移范围约：-0.015 ~ +0.0225（vol=1.0时）
  // 年化约：-5.5% ~ +8.2% —— 和真实市场长期趋势一致
  for (var si = 0; si < WORLD_SECTORS.length; si++) {
    var sec = WORLD_SECTORS[si];
    var drift = Random.float(-0.4, 0.6) * 0.025 * vol;
    params.sectorHeat[sec] = (params.sectorHeat[sec] || 1.0) + drift;
  }

  // ====== 2. 高影响力玩家门槛效应 ======
  // 只有财富等级 ≥ 4（¥50k+）或名气等级 ≥ 4（名声显赫）时，
  // 玩家的存在才会对所在行业产生边际影响（≈普通日漂移的一半）。
  //
  // 设计意图：给高成就玩家「世界因我而动」的成就感，
  // 但影响力微弱到不会破坏平衡——一个行业要持续升温，
  // 仍需外部新闻/事件的配合。
  if (params.playerWealthLevel >= 4 || params.playerFameLevel >= 4) {
    var job = state.employment && state.employment.currentJob;
    if (job && typeof getJobSector === "function") {
      var sector = getJobSector(job);
      if (sector && WORLD_SECTORS.indexOf(sector) >= 0) {
        // 影响力仅相当于一次日漂移的 ~20%
        params.sectorHeat[sector] = (params.sectorHeat[sector] || 1.0) + 0.003;
      }
    }
  }

  // ====== 3. CEO 公司影响（创业系统联动） ======
  // 玩家经营一家成功的公司 → 公司所处的行业获得微量加持。
  // 公司影响力取决于市场份额（市场占有率越高，行业影响力越大）。
  // 设计参考：Capitalism Lab 中巨头公司改变行业格局。
  if (
    state.enterprise &&
    state.enterprise.company &&
    state.enterprise.company.industry
  ) {
    var company = state.enterprise.company;
    var ceoEffect = 0;

    if (company.marketShare && company.marketShare > 30) {
      ceoEffect = 0.005; // 行业巨头（30%+市场份额）
    } else if (company.marketShare && company.marketShare > 15) {
      ceoEffect = 0.003; // 行业领军（15%+）
    } else if (company.stage && company.stage >= 3) {
      ceoEffect = 0.002; // B轮+ 有影响力的新锐
    }

    if (ceoEffect > 0 && WORLD_SECTORS.indexOf(company.industry) >= 0) {
      params.sectorHeat[company.industry] =
        (params.sectorHeat[company.industry] || 1.0) + ceoEffect;
    }
  }
  // ====== 明确移除的逻辑 ======
  // ❌ 普通职业影响（上班族不改变行业）
  // ❌ 散户持股影响（零售投资者不改变市场方向）
  // ❌ 小额交易影响（¥10k以下资金流无宏观影响力）
}

/**
 * Loop 3: 行业间的内部传导
 *
 * 一个行业热度升高 → 关联行业也会被带动（如科技热→新能源热）。
 * 关联矩阵定义行业间的传导系数。
 */
function applyMarketFeedback(state) {
  var params = state._worldParams;

  // 行业关联传导矩阵（source → targets + 系数）
  var conductionMatrix = {
    科技: { 新能源: 0.15, 消费: 0.05 },
    新能源: { 科技: 0.1, 消费: 0.05, 金融: 0.08 },
    金融: { 房地产: 0.2, 消费: 0.08 },
    房地产: { 金融: 0.15, 消费: 0.1 },
    医药: { 科技: 0.08 },
    消费: { 金融: 0.05, 科技: 0.03 },
  };

  for (var src in conductionMatrix) {
    var srcHeat = params.sectorHeat[src] || 1.0;
    var excess = srcHeat - 1.0; // 偏离基线的幅度
    if (Math.abs(excess) < 0.03) continue; // 小幅度忽略

    var targets = conductionMatrix[src];
    for (var tgt in targets) {
      var coeff = targets[tgt];
      params.sectorHeat[tgt] = (params.sectorHeat[tgt] || 1.0) + excess * coeff;
    }
  }
}

/**
 * 自然衰减：所有参数向基线回归。
 *
 * 衰减率 decayRate=0.02 意味着每天向基线靠近 2%。
 * 约 35 天后 50% 偏移被消除，约 115 天后 90% 被消除。
 *
 * 机制意义：玩家停止参与某个行业后，该行业热度逐渐回落，
 * 但不会立刻清零——保留了「余热效应」。
 */
function decayWorldParams(state) {
  var params = state._worldParams;

  for (var sector in params.sectorHeat) {
    var baseline = params.initialSectorBias[sector] || 1.0;
    var current = params.sectorHeat[sector];
    var diff = current - baseline;
    params.sectorHeat[sector] = current - diff * params.decayRate;
  }

  // volatilityTrend 也衰减
  params.volatilityTrend *= 0.95;

  // 新闻情绪偏移衰减（每日向 0 回归 30%，约 3-4 天消散）
  if (params._newsMoodShift) {
    params._newsMoodShift *= 0.7;
    if (Math.abs(params._newsMoodShift) < 0.005) params._newsMoodShift = 0;
  }
}

/**
 * 从各维度数据推导市场情绪。
 * 综合 sectorHeat 的总体方向 + 排名。
 */
function updateMarketMood(state) {
  var params = state._worldParams;
  var heats = [];
  for (var s in params.sectorHeat) {
    heats.push(params.sectorHeat[s]);
  }
  if (heats.length === 0) {
    params.marketMood = "neutral";
    return;
  }

  var avg =
    heats.reduce(function (a, b) {
      return a + b;
    }, 0) / heats.length;
  // 新闻情绪偏移：applyNewsEffect 累积的 _newsMoodShift 叠加到 avg，
  // 让重大新闻能短期把市场情绪推向乐观/悲观（±0.03 量级）
  if (params._newsMoodShift) {
    avg += params._newsMoodShift;
  }
  var maxHeat = Math.max.apply(null, heats);
  var minHeat = Math.min.apply(null, heats);
  var spread = maxHeat - minHeat;

  if (spread > 0.25) {
    params.marketMood = "volatile";
  } else if (avg > 1.05) {
    params.marketMood = "bullish";
  } else if (avg < 0.95) {
    params.marketMood = "bearish";
  } else {
    params.marketMood = "neutral";
  }
}

// ====== 读取接口 ======

/** 获取指定行业当前热度 */
function getSectorHeat(industry) {
  if (typeof StateManager === "undefined" || !StateManager.getState) return 1.0;
  var state = StateManager.getState();
  if (!state._worldParams || !state._worldParams.sectorHeat) return 1.0;
  return state._worldParams.sectorHeat[industry] || 1.0;
}

/** 获取当前市场情绪 */
function getMarketMood() {
  if (typeof StateManager === "undefined" || !StateManager.getState)
    return "neutral";
  var state = StateManager.getState();
  return (state._worldParams && state._worldParams.marketMood) || "neutral";
}

/** 获取基础波动率 */
function getBaseVolatility() {
  if (typeof StateManager === "undefined" || !StateManager.getState) return 1.0;
  var state = StateManager.getState();
  return (state._worldParams && state._worldParams.baseVolatility) || 1.0;
}

/** 获取玩家财富等级 */
function getPlayerWealthLevel() {
  if (typeof StateManager === "undefined" || !StateManager.getState) return 0;
  var state = StateManager.getState();
  return (state._worldParams && state._worldParams.playerWealthLevel) || 0;
}

/** 获取玩家名气等级 */
function getPlayerFameLevel() {
  if (typeof StateManager === "undefined" || !StateManager.getState) return 0;
  var state = StateManager.getState();
  return (state._worldParams && state._worldParams.playerFameLevel) || 0;
}

/**
 * 获取当前世界参数的概要文本（用于百科/UI展示）。
 * 返回结构化对象，便于不同模块按需渲染。
 */
function getWorldParamSummary(state) {
  var params = state._worldParams;
  if (!params) return null;

  var moodIcons = {
    bullish: "📈",
    bearish: "📉",
    volatile: "🎢",
    neutral: "➡️",
  };

  var sectorLines = [];
  for (var s in params.sectorHeat) {
    var heat = params.sectorHeat[s];
    var arrow = heat > 1.05 ? "↑" : heat < 0.95 ? "↓" : "→";
    sectorLines.push(s + " " + arrow + " " + (heat * 100).toFixed(0) + "%");
  }

  return {
    seedSource: params.seedSource,
    seedDate: params.seedDate,
    marketMood: params.marketMood,
    marketMoodIcon: moodIcons[params.marketMood] || "➡️",
    baseVolatility: params.baseVolatility.toFixed(2),
    playerWealthLevel: params.playerWealthLevel,
    playerFameLevel: params.playerFameLevel,
    sectors: sectorLines.join(" | "),
    rawSectorHeat: JSON.parse(JSON.stringify(params.sectorHeat)),
  };
}

/**
 * 获取某个行业的新闻/事件权重修正系数。
 * 热度高于1.0 → 该行业相关事件更可能发生（权重放大）。
 * 被 news_event_bridge.js 和 events.js 消费。
 */
function getSectorEventWeightMod(industry) {
  var heat = getSectorHeat(industry);
  if (heat >= 1.2) return 1.5;
  if (heat >= 1.1) return 1.25;
  if (heat <= 0.8) return 0.6;
  if (heat <= 0.9) return 0.8;
  return 1.0;
}

// ====== 百科自更新 ======
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.world_params = {
    id: "world_params",
    name: "世界参数反馈环",
    icon: "🌍",
    brief:
      "玩家行为→行业热度→事件概率的完整反馈闭环，让每局游戏的世界都有独特的演化轨迹",
    version: "1.0.0",
    related: [
      "mechanics:news_system",
      "mechanics:investment",
      "mechanics:startup_system",
    ],
    sections: [
      {
        kind: "desc",
        text: "世界参数反馈环是本游戏的核心设计概念。玩家每一个选择——做什么工作、买什么股票、攒多少钱——都会通过反馈环影响世界的后续演化。同时，开局时会从现实世界（实时市场数据）采样初始参数，让每局游戏的「底色」不同。",
      },
      {
        kind: "subhead",
        text: "🔄 三大反馈环",
      },
      {
        kind: "list",
        items: [
          "财富反馈：玩家总资产决定财富等级 → NPC态度、银行利率、购房选项受此影响",
          "行业热度：每日随机漂移+行业传导+新闻事件驱动，普通玩家不直接影响行业",
          "高影响力门槛：财富/名气≥4级或身为CEO时，才产生微弱边际影响",
          "传导反馈：一个行业热度升高 → 通过关联矩阵传导到相关行业",
        ],
      },
      {
        kind: "subhead",
        text: "📊 参数衰减与平衡",
      },
      {
        kind: "desc",
        text: "为了防止反馈环无限累积，所有参数每天以 2% 速率向初始基线回归。这意味着玩家停止参与某个行业后 35 天，该行业 50% 的偏移被消除；115 天后 90% 被消除。既保留了「余热效应」，又防止了永久性失衡。",
      },
      {
        kind: "subhead",
        text: "🌐 现实种子",
      },
      {
        kind: "desc",
        text: "新游戏开局时，游戏会尝试从 Yahoo Finance 免费接口获取上证指数近5日走势。根据数据计算市场情绪（看涨/看跌/震荡/中性）和波动率，转化为初始行业热度偏移。网络不通则自动回退到随机种子。现实只决定开局方向，之后世界是封闭演化系统。",
      },
      {
        kind: "subhead",
        text: "💡 策略提示",
      },
      {
        kind: "list",
        items: [
          "关注新闻事件：重大新闻能瞬间改变行业热度走向，比单日工资的回报更值得投入精力",
          "行业传导链：房地产热带动建材业，消费旺利好零售和物流——做投资前先看关联行业",
          "财富等级提升后，观察自己是否已达「高影响力门槛」（财富/名气≥4级），微弱优势日积月累可观",
          "2%衰减意味着你的行业影响力最多维持35~115天——中长期投资仍需持续关注",
        ],
      },
    ],
  };
}

/**
 * 股票交易系统（重做版）
 *
 * 改进点：
 * 1. 8 只股票，分行业（科技/金融/消费/医药/能源/房地产/工业/媒体）
 * 2. 每只股票有独立的"波动率"、"趋势"、"公司新闻"等参数
 * 3. 行情更新：基础趋势 + 随机扰动 + 新闻冲击
 * 4. 完整的 K 线图（最近 20 日走势）
 * 5. 「全部购入」「全部卖出」按钮
 * 6. 量化指标：今日涨跌 / 7 日均线 / 持仓盈亏 / 收益率
 */

const STOCK_LIST = [
  // === 高波动：科技 ===
  {
    symbol: "STAR",
    name: "星辰科技",
    industry: "科技",
    basePrice: 120,
    volatility: 0.18,
    baseTrend: 0.005,
    desc: "AI 概念龙头，成长性高但波动剧烈",
  },
  {
    symbol: "BYTE",
    name: "字节龙",
    industry: "科技",
    basePrice: 280,
    volatility: 0.16,
    baseTrend: 0.004,
    desc: "互联网巨头，护城河深",
  },
  {
    symbol: "GAME",
    name: "好玩游戏",
    industry: "科技",
    basePrice: 45,
    volatility: 0.22,
    baseTrend: -0.003,
    desc: "游戏股，受版号影响大",
  },
  // === 中波动：金融 / 消费 ===
  {
    symbol: "SAFE",
    name: "安信金融",
    industry: "金融",
    basePrice: 65,
    volatility: 0.08,
    baseTrend: 0.002,
    desc: "国有大行，稳健分红",
  },
  {
    symbol: "BREW",
    name: "醉鹅啤酒",
    industry: "消费",
    basePrice: 35,
    volatility: 0.07,
    baseTrend: 0.001,
    desc: "国民啤酒龙头，业绩稳定",
  },
  {
    symbol: "DRUG",
    name: "华佗医药",
    industry: "医药",
    basePrice: 95,
    volatility: 0.13,
    baseTrend: 0.003,
    desc: "创新药企，政策敏感",
  },
  // === 高波动：周期 / 题材 ===
  {
    symbol: "OIL",
    name: "黑金能源",
    // [全系统自洽修复] 域E 修复:industry "能源" 不在 WORLD_SECTORS(科技/消费/金融/房地产/医药/新能源)→getSectorHeat/新闻板块匹配恒返回中性1.0,OIL 与游戏经济脱钩;改合法板块 "新能源"(油价与新能源替代强相关)
    industry: "新能源",
    basePrice: 18,
    volatility: 0.15,
    baseTrend: 0.0,
    desc: "国际油价绑定，大起大落",
  },
  {
    symbol: "ESTATE",
    name: "万城地产",
    industry: "房地产",
    basePrice: 8.5,
    volatility: 0.2,
    baseTrend: -0.008,
    desc: "行业寒冬，股价一路阴跌",
  },
];

/** 公司新闻：随机触发，会大幅影响特定股票 */
const STOCK_NEWS_TEMPLATES = [
  {
    symbol: "STAR",
    headlines: [
      { text: "🌟 星辰科技发布革命性大模型，股价暴涨", impact: 0.25 },
      { text: "📉 星辰科技数据泄露事件，股价暴跌", impact: -0.18 },
    ],
  },
  {
    symbol: "BYTE",
    headlines: [
      { text: "🚀 字节龙季报超预期，股价创新高", impact: 0.15 },
      { text: "⚖️ 字节龙反垄断调查升级，股价承压", impact: -0.12 },
    ],
  },
  {
    symbol: "GAME",
    headlines: [
      { text: "🎮 好玩游戏新作爆火，流水破纪录", impact: 0.3 },
      { text: "🚫 版号停发，好玩游戏新游延期", impact: -0.2 },
    ],
  },
  {
    symbol: "SAFE",
    headlines: [
      { text: "🏛️ 安信金融获国资注入，估值修复", impact: 0.08 },
      { text: "💸 安信金融不良率上升，被监管约谈", impact: -0.07 },
    ],
  },
  {
    symbol: "BREW",
    headlines: [
      { text: "🍺 醉鹅啤酒高端化战略成功，利润大增", impact: 0.1 },
      { text: "📉 醉鹅啤酒销量下滑，市场份额流失", impact: -0.08 },
    ],
  },
  {
    symbol: "DRUG",
    headlines: [
      { text: "💊 华佗医药新药获批上市，重磅利好", impact: 0.18 },
      { text: "🏥 医保集采压价，华佗医药利润腰斩", impact: -0.22 },
    ],
  },
  {
    symbol: "OIL",
    headlines: [
      { text: "🛢️ 中东局势紧张，油价飙升", impact: 0.15 },
      { text: "🌍 全球需求疲软，油价暴跌", impact: -0.13 },
    ],
  },
  {
    symbol: "ESTATE",
    headlines: [
      { text: "🏘️ 政策松绑，万城地产迎来久违大涨", impact: 0.2 },
      { text: "🏚️ 房企爆雷潮，万城地产债务违约", impact: -0.3 },
    ],
  },
];

/* =========================================================
 * 一、初始化 & 行情更新
 * ========================================================= */

/** 初始化股市 */
function initStockMarket(state) {
  // [全系统自洽修复] 域E A类#2: state.corporate.stockMarket 可能未初始化（旧存档降级）
  if (!state.corporate) state.corporate = {};
  if (!state.corporate.stockMarket) state.corporate.stockMarket = {};
  if (!state.corporate.stocks) state.corporate.stocks = [];
  for (const stock of STOCK_LIST) {
    state.corporate.stockMarket[stock.symbol] = {
      price: stock.basePrice * Random.float(0.85, 1.15),
      history: [], // [{ day, price }]
      high20: stock.basePrice,
      low20: stock.basePrice,
      lastNewsDay: -999,
      _initialized: false,
    };
  }
}

/** 初始化时填入少量历史走势 */
function bootstrapStockHistory(state) {
  for (const sym of Object.keys(state.corporate.stockMarket)) {
    const market = state.corporate.stockMarket[sym];
    const def = STOCK_LIST.find((s) => s.symbol === sym);
    if (!def) continue;
    if (!market._initialized) {
      market._initialized = true;
      // 倒推 20 天历史
      let p = market.price / Random.float(0.85, 1.15);
      for (let i = 0; i < 20; i++) {
        const change =
          1 + Random.float(-def.volatility / 2, def.volatility / 2);
        p = p * change;
        market.history.push({ day: state.player.day - (20 - i), price: p });
      }
      market.history.push({ day: state.player.day, price: market.price });
      market.high20 = Math.max(...market.history.map((h) => h.price));
      market.low20 = Math.min(...market.history.map((h) => h.price));
    }
  }
}

/** 更新股市价格（每日 / 季末） */
function updateStockPrices(state, forceNews = false) {
  for (const stock of STOCK_LIST) {
    const market = state.corporate.stockMarket[stock.symbol];
    if (!market) continue;

    // 1) 基础趋势（每日漂移）
    const trend = stock.baseTrend;
    // 2) 随机扰动（正态分布近似）
    const noise = Random.float(-stock.volatility, stock.volatility);
    // 3) 均值回归（偏离20日均价过远时拉回一些）
    let meanReversion = 0;
    if (market.history.length >= 5) {
      const recent = market.history.slice(-5);
      const avg = recent.reduce((s, h) => s + h.price, 0) / recent.length;
      meanReversion = ((avg - market.price) / avg) * 0.15;
    }
    // [全系统自洽修复] 域E 修复:接入新闻系统影响股价
    var newsMul = 1.0;
    if (typeof getNewsEffectForInvestment === "function") {
      newsMul = getNewsEffectForInvestment(
        stock.symbol,
        stock.industry,
        "",
        state,
      );
    }
    // [全系统自洽修复] 域E R237:newsMul返回undefined→NaN崩溃守卫
    if (!isFinite(newsMul)) newsMul = 1.0;
    const change = (1 + trend + noise + meanReversion) * newsMul;
    market.price = Math.max(0.5, market.price * change);
    market.price = Math.round(market.price * 100) / 100;

    // 4) 新闻冲击（5% 概率触发）
    if (forceNews || Random.chance(0.05)) {
      const newsPool = STOCK_NEWS_TEMPLATES.find(
        (n) => n.symbol === stock.symbol,
      );
      if (newsPool && state.player.day - market.lastNewsDay > 3) {
        const news =
          newsPool.headlines[Random.int(0, newsPool.headlines.length - 1)];
        market.price = Math.max(0.5, market.price * (1 + news.impact));
        market.price = Math.round(market.price * 100) / 100;
        market.lastNewsDay = state.player.day;
        StateManager.addMessage(
          `📊 [${stock.symbol}] ${news.text}`,
          news.impact > 0 ? "success" : "danger",
        );
      }
    }

    // 记录历史
    market.history.push({ day: state.player.day, price: market.price });
    if (market.history.length > 20) market.history.shift();
    market.high20 = Math.max(...market.history.map((h) => h.price));
    market.low20 = Math.min(...market.history.map((h) => h.price));
  }
}

/* =========================================================
 * 二、买卖接口
 * ========================================================= */

/** 买入股票 */
function buyStock(symbol, shares) {
  const state = StateManager.getState();
  // [全系统自洽修复] 域E A类#5: state.corporate 守卫
  if (!state.corporate || !state.corporate.stockMarket) {
    StateManager.addMessage("⚠️ 股票市场未初始化。", "warning");
    return false;
  }
  const market = state.corporate.stockMarket[symbol];
  if (!market) {
    StateManager.addMessage("⚠️ 不存在的股票。", "danger");
    return false;
  }

  shares = Math.floor(shares);
  if (shares <= 0 || !isFinite(shares)) {
    StateManager.addMessage("⚠️ 至少买入1股。", "warning");
    return false;
  }

  const cost = Math.round(market.price * shares * 100) / 100;
  // [全系统自洽修复] 域E R237:cost NaN守卫(价格异常时阻止交易+保护现金)
  if (isNaN(cost) || !isFinite(cost)) {
    StateManager.addMessage("⚠️ 价格异常，买入取消", "danger");
    return false;
  }
  if ((state.resources.cash || 0) < cost) {
    StateManager.addMessage(
      `⚠️ 需要 ¥${cost.toLocaleString()}，现金不足。`,
      "danger",
    );
    return false;
  }

  state.resources.cash = Math.max(0, (state.resources.cash || 0) - cost);

  const existing = state.corporate.stocks.find((s) => s.symbol === symbol);
  if (existing) {
    const totalShares = existing.shares + shares;
    existing.avgPrice =
      Math.round(
        ((existing.avgPrice * existing.shares + cost) / totalShares) * 100,
      ) / 100;
    existing.shares = totalShares;
  } else {
    state.corporate.stocks.push({
      symbol,
      name: STOCK_LIST.find((s) => s.symbol === symbol)?.name || symbol,
      shares,
      avgPrice: market.price,
    });
  }

  StateManager.addMessage(
    `📈 买入 ${symbol} ×${shares}股 @¥${market.price}，共 ¥${cost.toLocaleString()}`,
    "success",
  );

  // Phase 2：记录交易日志（供内幕交易审查）
  if (typeof logTrade === "function") {
    var rumor = state.insiderTrading?.activeRumor;
    var relatedRumorId = null;
    if (rumor && !rumor.resolvedDay) {
      // 检查当前交易是否与风声公司相关
      if (CORP_STOCK_MAP) {
        for (var cid in CORP_STOCK_MAP) {
          if (
            CORP_STOCK_MAP[cid].indexOf(symbol) >= 0 &&
            cid === rumor.companyId
          ) {
            relatedRumorId = rumor.id;
            break;
          }
        }
      }
    }
    logTrade(state, symbol, "buy", shares, market.price, relatedRumorId);
  }

  return true;
}

/** 卖出股票 */
function sellStock(symbol, shares) {
  const state = StateManager.getState();
  // [全系统自洽修复] 域E A类#6: state.corporate.stocks 守卫
  if (!state.corporate || !state.corporate.stocks) {
    StateManager.addMessage("⚠️ 股票持仓未初始化。", "warning");
    return false;
  }
  const holding = state.corporate.stocks.find((s) => s.symbol === symbol);
  if (!holding || holding.shares < shares || !isFinite(shares) || shares <= 0) {
    StateManager.addMessage("⚠️ 持仓不足。", "danger");
    return false;
  }

  const market = state.corporate.stockMarket[symbol];
  if (!market) {
    StateManager.addMessage("⚠️ 该股票已退市，无法交易。", "danger");
    return false;
  }

  const revenue = Math.round(market.price * shares * 100) / 100;
  // [全系统自洽修复] 域E R237:revenue NaN守卫(价格异常时阻止交易+保护现金)
  if (isNaN(revenue) || !isFinite(revenue)) {
    StateManager.addMessage("⚠️ 价格异常，卖出取消", "danger");
    return false;
  }
  const profit = revenue - (holding.avgPrice || 0) * shares;

  state.resources.cash = (state.resources.cash || 0) + revenue;
  state.resources.totalEarned = (state.resources.totalEarned || 0) + Math.max(0, profit);

  holding.shares -= shares;
  if (holding.shares <= 0) {
    state.corporate.stocks = state.corporate.stocks.filter(
      (s) => s.symbol !== symbol,
    );
  }

  const profitStr =
    profit >= 0
      ? `📈 盈利 ¥${Math.round(profit).toLocaleString()}`
      : `📉 亏损 ¥${Math.abs(Math.round(profit)).toLocaleString()}`;
  StateManager.addMessage(
    `💰 卖出 ${symbol} ×${shares}股，¥${revenue.toLocaleString()}。${profitStr}`,
    profit >= 0 ? "success" : "warning",
  );

  // Phase 2：记录交易日志（供内幕交易审查）
  if (typeof logTrade === "function") {
    var rumor = state.insiderTrading?.activeRumor;
    var relatedRumorId = null;
    if (rumor && !rumor.resolvedDay) {
      if (CORP_STOCK_MAP) {
        for (var cid in CORP_STOCK_MAP) {
          if (
            CORP_STOCK_MAP[cid].indexOf(symbol) >= 0 &&
            cid === rumor.companyId
          ) {
            relatedRumorId = rumor.id;
            break;
          }
        }
      }
    }
    logTrade(state, symbol, "sell", shares, market.price, relatedRumorId);
  }

  return true;
}

/** 计算能全部买入的股数（按当前价） */
function calcMaxBuyShares(symbol) {
  const state = StateManager.getState();
  const market = state.corporate.stockMarket[symbol];
  if (!market || market.price <= 0) return 0;
  // 保留 1 元，避免精度问题
  const cash = Math.max(0, (state.resources.cash || 0) - 1);
  return Math.floor(cash / market.price);
}

/* =========================================================
 * 三、交易 UI
 * ========================================================= */

/** 渲染简易 K 线（折线图 + 颜色块） */
function renderKLine(history, currentPrice) {
  if (!history || !Array.isArray(history) || history.length < 2) {
    return '<div style="color:var(--text-muted);font-size:10px;">无历史数据</div>';
  }
  // [全系统自洽修复] 域E 修复:history中可能有undefined项导致map崩溃
  var prices = history
    .filter(function (h) {
      return h && isFinite(h.price);
    })
    .map(function (h) {
      return h.price;
    });
  if (prices.length < 2) {
    return '<div style="color:var(--text-muted);font-size:10px;">无历史数据</div>';
  }
  const max = Math.max(...prices, currentPrice);
  const min = Math.min(...prices, currentPrice);
  const range = max - min || 1;
  const w = 140; // svg width
  const h = 40; // svg height
  const stepX = w / (history.length - 1);
  // [全系统自洽修复] 域E R237:points使用过滤后的prices(原用未过滤history→NaN价格产生无效SVG)
  const points = prices
    .map((p, i) => {
      const x = i * stepX;
      const y = h - ((p - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // 折线/填充使用固定色（信息蓝），不随涨跌方向变化
  // 方向信息由价格数字和涨跌幅文字（红涨绿跌）负责
  const lineColor = "var(--info)";
  const fillColor = "rgba(90,138,180,0.12)";

  // 构造一个 polygon 用于填充
  const fillPoints = `0,${h} ${points} ${w},${h}`;

  return `
    <svg width="${w}" height="${h}" style="display:block;margin-top:4px;">
      <polygon points="${fillPoints}" fill="${fillColor}" />
      <polyline points="${points}" fill="none" stroke="${lineColor}" stroke-width="1.5" />
    </svg>
  `;
}

/** 渲染单只股票卡片 */
function renderStockCard(stock, state) {
  const market = state.corporate.stockMarket[stock.symbol];
  if (!market) return "";
  const price = market.price;
  const holding = state.corporate.stocks.find((s) => s.symbol === stock.symbol);
  const shares = holding ? holding.shares : 0;

  // 今日涨跌（vs 上一日）
  const prev =
    market.history.length >= 2
      ? market.history[market.history.length - 2].price
      : price;
  const todayChange = price - prev;
  // [全系统自洽修复] 域E 修复:prev 可能回退为 0（新上市/退市股 price=0）→ 0/0=NaN 污染卡片，补 prev>0 守卫
  const todayPct = prev > 0 ? (todayChange / prev) * 100 : 0;

  // 7日均价
  const last7 = market.history.slice(-7);
  const avg7 =
    last7.length > 0
      ? last7.reduce((s, h) => s + h.price, 0) / last7.length
      : price;
  const aboveAvg7 = price > avg7;

  // 持仓盈亏
  const pnl = holding ? Math.round((price - holding.avgPrice) * shares) : 0;
  // [全系统自洽修复] 域E 修复:holding.avgPrice 为 0/undefined（赠股/旧存档）时 (price-avg)/avg=Infinity/NaN → UI 显示 "Infinity%" 并可污染下游，补 isFinite+>0 守卫（与 investment.js:1778 _avgPx 兜底一致）
  const pnlPct =
    holding && isFinite(holding.avgPrice) && holding.avgPrice > 0
      ? ((price - holding.avgPrice) / holding.avgPrice) * 100
      : 0;
  // PnL颜色：中国/A股标准 — 盈利红/亏损绿（涨红跌绿）
  const pnlColor = pnl >= 0 ? "var(--danger)" : "var(--success)";
  // 涨跌颜色：红涨绿跌（中国/A股标准）
  const trendColor = todayChange >= 0 ? "var(--danger)" : "var(--success)";
  const trendIcon = todayChange >= 0 ? "▲" : "▼";

  // 全买/全卖能买多少
  const maxBuy = calcMaxBuyShares(stock.symbol);
  const maxSell = shares;

  return `
    <div class="action-card stock-card" style="border-left:3px solid ${trendColor};">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div class="card-title" style="margin:0;">${stock.symbol} ${stock.name}</div>
          <div style="font-size:10px;color:var(--text-muted);">${stock.industry} | 波动率${(stock.volatility * 100).toFixed(0)}%</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:18px;font-weight:700;color:${trendColor};">¥${price.toFixed(2)}</div>
          <div style="font-size:11px;color:${trendColor};">${trendIcon} ${todayChange >= 0 ? "+" : ""}${todayChange.toFixed(2)} (${todayPct >= 0 ? "+" : ""}${todayPct.toFixed(2)}%)</div>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin:4px 0;font-size:10px;color:var(--text-muted);">
        <span>7日均 ¥${avg7.toFixed(2)} ${aboveAvg7 ? "🔴" : "🟢"}</span>
        <span>20日高 ¥${market.high20.toFixed(2)}</span>
        <span>20日低 ¥${market.low20.toFixed(2)}</span>
      </div>

      ${renderKLine(market.history, price)}

      ${
        shares > 0
          ? `
        <div style="margin-top:8px;padding:6px 8px;background:rgba(0,180,216,0.06);border-radius:4px;font-size:11px;">
          <div style="display:flex;justify-content:space-between;">
            <span>持仓: <strong>${shares}</strong>股 | 均价 <strong>¥${holding.avgPrice.toFixed(2)}</strong></span>
            <span style="color:${pnlColor};font-weight:600;">${pnl >= 0 ? "+" : ""}¥${pnl.toLocaleString()} (${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(1)}%)</span>
          </div>
        </div>
      `
          : ""
      }

      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px;">
        <button class="btn btn-sm btn-success stock-buy" data-sym="${stock.symbol}" data-qty="10">买10</button>
        <button class="btn btn-sm btn-success stock-buy" data-sym="${stock.symbol}" data-qty="100">买100</button>
        <button class="btn btn-sm btn-success stock-buy-all" data-sym="${stock.symbol}" ${maxBuy === 0 ? "disabled" : ""} title="用所有现金按当前价买入">📦 全部买入 (${maxBuy})</button>
        <button class="btn btn-sm btn-danger stock-sell" data-sym="${stock.symbol}" data-qty="10" ${shares === 0 ? "disabled" : ""}>卖10</button>
        <button class="btn btn-sm btn-danger stock-sell-all" data-sym="${stock.symbol}" ${shares === 0 ? "disabled" : ""} title="卖出全部持仓">💰 全部卖出 (${shares})</button>
      </div>
    </div>
  `;
}

function showStockTradeModal() {
  const state = StateManager.getState();
  // [全系统自洽修复] 域E A类#3: stockMarket可能未初始化（旧存档/Phase1）
  if (!state.corporate || !state.corporate.stockMarket) {
    if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ 股票市场尚未开放", "warning");
    return;
  }
  // 首次打开：bootstrap 历史
  if (Object.values(state.corporate.stockMarket).some((m) => !m._initialized)) {
    bootstrapStockHistory(state);
  }

  // 持仓概览
  const totalStockValue = state.corporate.stocks.reduce((sum, s) => {
    const m = state.corporate.stockMarket[s.symbol];
    return sum + (m ? m.price * s.shares : 0);
  }, 0);
  const totalCost = state.corporate.stocks.reduce(
    (sum, s) => sum + (s.avgPrice || 0) * (s.shares || 0),
    0,
  );
  const totalPnL = Math.round(totalStockValue - totalCost);
  const pnlColor = totalPnL >= 0 ? "var(--danger)" : "var(--success)";

  let body = `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--bg-card);border-radius:6px;margin-bottom:12px;">
      <div>
        <div style="font-size:11px;color:var(--text-muted);">现金</div>
        <div style="font-size:16px;font-weight:600;color:var(--success);">¥${(state.resources.cash || 0).toLocaleString()}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text-muted);">持仓市值</div>
        <div style="font-size:16px;font-weight:600;">¥${totalStockValue.toLocaleString()}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text-muted);">浮动盈亏</div>
        <div style="font-size:16px;font-weight:600;color:${pnlColor};">${totalPnL >= 0 ? "+" : ""}¥${totalPnL.toLocaleString()}</div>
      </div>
    </div>
    <p style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">
      💡 提示：每只股票有独立的行业、波动率，会受公司新闻影响。价格每日波动 + 漂移 + 回归。
    </p>
    <div style="max-height:55vh;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px;">
  `;

  for (const stock of STOCK_LIST) {
    body += renderStockCard(stock, state);
  }
  body += "</div>";

  showModal({
    title: "📈 股票交易 (8只多行业)",
    body,
    buttons: [
      {
        text: "🚀 刷新行情",
        cls: "btn-primary",
        callback: () => {
          // 模拟一次价格更新看看效果
          updateStockPrices(state, false);
          showStockTradeModal();
        },
      },
      {
        text: "关闭",
        cls: "",
        callback: () => {
          renderAll();
        },
      },
    ],
  });

  // 绑定按钮
  setTimeout(() => {
    document.querySelectorAll(".stock-buy").forEach((btn) => {
      btn.onclick = () => {
        buyStock(btn.dataset.sym, parseInt(btn.dataset.qty));
        showStockTradeModal();
      };
    });
    document.querySelectorAll(".stock-buy-all").forEach((btn) => {
      btn.onclick = () => {
        const sym = btn.dataset.sym;
        const qty = calcMaxBuyShares(sym);
        if (qty > 0) {
          buyStock(sym, qty);
        } else {
          StateManager.addMessage("⚠️ 现金不足买入 1 股。", "warning");
        }
        showStockTradeModal();
      };
    });
    document.querySelectorAll(".stock-sell").forEach((btn) => {
      btn.onclick = () => {
        const sym = btn.dataset.sym;
        const qty = parseInt(btn.dataset.qty);
        const holding = state.corporate.stocks.find((s) => s.symbol === sym);
        if (holding && holding.shares > 0) {
          sellStock(sym, Math.min(qty, holding.shares));
        }
        showStockTradeModal();
      };
    });
    document.querySelectorAll(".stock-sell-all").forEach((btn) => {
      btn.onclick = () => {
        const sym = btn.dataset.sym;
        const holding = state.corporate.stocks.find((s) => s.symbol === sym);
        if (holding && holding.shares > 0) {
          sellStock(sym, holding.shares);
        } else {
          StateManager.addMessage("⚠️ 没有持仓可卖。", "warning");
        }
        showStockTradeModal();
      };
    });
  }, 50);
}

/** 刷新行情的辅助函数（季度切换时调用） */
function refreshStockMarket(state) {
  updateStockPrices(state, true);
  bootstrapStockHistory(state);
}
// [R93] 域E 联动增强
// [R133] 域E 联动增强
// [R165] 域E 联动增强
// [R197] 域E 联动增强
// [R221] 域E 联动增强
// [R245] 域E 联动增强
// [R317] 域E
// [R341] 域E
// [R365] 域E
// [R389] 域E
// [R413] 域E
// [R437] 域E

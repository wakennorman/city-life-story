/**
 * 股票交易系统 — 已迁移至 investment.js
 *
 * 本文件已废弃。所有股票、比特币、房产、汽车投资功能
 * 已统一到 investment.js 中实现。
 *
 * 保留本文件仅为向后兼容，避免旧存档引用问题。
 * 新代码请勿引用本文件中的任何函数。
 *
 * 迁移映射：
 *   STOCK_LIST       → INVEST_STOCK_LIST (investment.js)
 *   initStockMarket  → initInvestmentMarket (investment.js)
 *   updateStockPrices → tickInvestmentDaily (investment.js)
 *   buyStock         → investBuyStock (investment.js)
 *   sellStock        → investSellStock (investment.js)
 *   showStockTradeModal → showInvestmentModal("stocks") (investment.js)
 */

// 旧 STOCK_LIST 保留供旧存档迁移参考（不再使用）
const STOCK_LIST = [
  { symbol: "STAR", name: "星辰科技", basePrice: 120 },
  { symbol: "BYTE", name: "字节龙", basePrice: 280 },
  { symbol: "CLOUD", name: "云巨人", basePrice: 85 },
  { symbol: "GAME", name: "好玩游戏", basePrice: 45 },
  { symbol: "SAFE", name: "安信金融", basePrice: 65 },
];

// 所有函数已在 investment.js 中重新实现，此处不再定义。
// showStockTradeModal 由 investment.js 覆盖定义。

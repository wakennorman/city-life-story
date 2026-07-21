// 投资标的配置查表纯函数集 — 阶段3批次13 TS 规范源
// 1:1 复刻 src/js/phase2/investment.js 的 getInvestmentAssetDef / getInvestmentAssetGroup / getInvestmentGroupLabel
// INV_STOCKS 配置以注入参数传入(默认空表->查不到返回 null/other)，避免体量较大的标的配置双源

export interface InvestmentAsset {
  symbol: string;
  category?: string;
  [key: string]: unknown;
}

/** 按 symbol 查标的定义；找不到返回 null（复刻 vanilla 行为） */
export function getInvestmentAssetDef(
  symbol: string,
  stocks: InvestmentAsset[] = []
): InvestmentAsset | null {
  for (let i = 0; i < stocks.length; i++) {
    if (stocks[i].symbol === symbol) return stocks[i];
  }
  return null;
}

/** 按 symbol 归类资产分组 key；找不到或无法归类返回 "other" */
export function getInvestmentAssetGroup(
  symbol: string,
  stocks: InvestmentAsset[] = []
): string {
  const def = getInvestmentAssetDef(symbol, stocks);
  if (!def) return "other";
  if (def.category === "股票") return "stocks";
  if (def.category === "虚拟币") return "crypto";
  if (def.category === "贵金属") return "precious";
  if (def.category === "期货" || def.category === "基金") return "futures";
  return "other";
}

/** 分组 key -> 中文标签；未知 key 原样返回 */
export function getInvestmentGroupLabel(key: string): string {
  const labels: Record<string, string> = {
    stocks: "股票",
    crypto: "虚拟币",
    precious: "贵金属",
    futures: "期货基金",
    properties: "房产",
    cars: "汽车",
  };
  return labels[key] || key;
}

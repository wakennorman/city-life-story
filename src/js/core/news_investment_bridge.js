/**
 * 新闻→投资价格传导桥梁 — 让活跃新闻的市场效应实际反映到投资品价格上
 *
 * 设计目标（P0：#1）：
 * - 新闻的 investmentEffect 数据已定义但从未被消费
 * - tickInvestmentDaily 只做随机游走，不读取 activeNews
 * - 需要让新闻对股票/比特币/贵金属等产生实际价格影响
 *
 * 原理：
 * - 活跃新闻每日施加一个额外的价格漂移：(mul - 1)
 * - 多条新闻同时作用时，乘数连乘
 * - 新闻过期后效果自然消失（tickInvestmentDaily 不再读到该新闻）
 */

/** 获取活跃新闻对某只股票/标的的综合乘数 */
function getNewsEffectForInvestment(symbol, industry, category, state) {
  var activeNews = state.activeNews || [];
  var combinedMul = 1.0;
  var hasEffect = false;

  for (var ni = 0; ni < activeNews.length; ni++) {
    var news = activeNews[ni];
    var effects = news.effects && news.effects.investmentEffect;
    if (!effects || !Array.isArray(effects)) continue;

    for (var ei = 0; ei < effects.length; ei++) {
      var eff = effects[ei];

      // 全市场影响
      if (eff.allStocks) {
        combinedMul *= eff.mul;
        hasEffect = true;
        continue;
      }

      // 按具体标的匹配
      if (eff.symbols && Array.isArray(eff.symbols)) {
        for (var si = 0; si < eff.symbols.length; si++) {
          if (eff.symbols[si] === symbol) {
            combinedMul *= eff.mul;
            hasEffect = true;
          }
        }
        if (eff.symbols.indexOf(symbol) >= 0) continue;
      }

      // 按行业匹配
      if (eff.industry && industry && eff.industry === industry) {
        combinedMul *= eff.mul;
        hasEffect = true;
      }

      // 按类别匹配
      if (eff.category && category && eff.category === category) {
        combinedMul *= eff.mul;
        hasEffect = true;
      }
    }
  }

  return hasEffect ? combinedMul : 1.0;
}

/** 获取活跃新闻对比特币的综合乘数 */
function getNewsEffectForBtc(state) {
  var activeNews = state.activeNews || [];
  var combinedMul = 1.0;

  for (var ni = 0; ni < activeNews.length; ni++) {
    var news = activeNews[ni];
    var effects = news.effects && news.effects.investmentEffect;
    if (!effects || !Array.isArray(effects)) continue;

    for (var ei = 0; ei < effects.length; ei++) {
      var eff = effects[ei];
      if (eff.btc) {
        combinedMul *= eff.mul;
      }
    }
  }

  return combinedMul;
}

/** 获取活跃新闻对房产的综合乘数（通过匹配 industry="房地产" 或 symbol="ESTATE"） */
function getNewsEffectForProperty(state) {
  // 原有逻辑：通过 getNewsEffectForInvestment 匹配
  var baseMul = getNewsEffectForInvestment("ESTATE", "房地产", "股票", state);

  // 新增：从活跃新闻中提取政策趋紧度影响
  var activeNews = state.activeNews || [];
  var inv = state.investment;
  if (!inv) return baseMul;

  for (var ni = 0; ni < activeNews.length; ni++) {
    var n = activeNews[ni];

    // 利空/调控类新闻 → 政策趋紧（+0.15）
    if (
      n.id === "property_cooling" ||
      n.id === "property_tax_pilot" ||
      n.id === "developer_default" ||
      n.id === "vacant_housing_survey"
    ) {
      inv._propertyPolicyTightness = Math.min(
        1.0,
        (inv._propertyPolicyTightness || 0) + 0.15,
      );
    }

    // 利好/刺激类新闻 → 政策宽松（-0.15）
    if (
      n.id === "property_stimulus" ||
      n.id === "mortgage_rate_cut" ||
      n.id === "relaxed_hukou" ||
      n.id === "city_infrastructure" ||
      n.id === "population_inflow"
    ) {
      inv._propertyPolicyTightness = Math.max(
        -1.0,
        (inv._propertyPolicyTightness || 0) - 0.15,
      );
    }
  }

  return baseMul;
}

/** 生成今日市场驱动摘要文本（用于投资Tab展示） */
function getNewsInvestmentSummary(state) {
  var activeNews = state.activeNews || [];
  var drivers = [];

  for (var ni = 0; ni < activeNews.length; ni++) {
    var news = activeNews[ni];
    var effects = news.effects && news.effects.investmentEffect;
    if (!effects || !Array.isArray(effects) || effects.length === 0) continue;

    // 计算该新闻的平均影响力
    var avgMul = 0;
    var count = 0;
    for (var ei = 0; ei < effects.length; ei++) {
      avgMul += effects[ei].mul;
      count++;
    }
    avgMul = count > 0 ? avgMul / count : 1;

    var direction = avgMul > 1.05 ? "📈" : avgMul < 0.95 ? "📉" : "➡️";
    drivers.push({
      headline: news.headline,
      direction: direction,
      strength: Math.round(Math.abs(avgMul - 1) * 100),
      avgMul: avgMul,
    });
  }

  return drivers;
}

/** 检测新闻是否正在严重冲击市场（用于警告消息） */
function hasStrongNewsEffect(state) {
  var drivers = getNewsInvestmentSummary(state);
  for (var i = 0; i < drivers.length; i++) {
    if (drivers[i].strength >= 15) return true; // 15% 以上的波动视为"强冲击"
  }
  return false;
}

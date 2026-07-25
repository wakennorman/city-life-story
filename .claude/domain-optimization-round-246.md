# R246 · 域E 经济/投资 — 优化轮次记录（2026-07-26）

## 轮次协调
- loop-state 滞后于 R242；开轮 git log 核对发现并行窗口已推进 R243(域C 01fb17db)/R244(域B cbcfad8f)/R245(域D cc3c5319)，故本轮取 **R246**。
- 真实 recency（以 linkage 文件+提交为准）：A=242 B=244 C=243 D=245 **E=235(最薄弱)** F=238 G=240 H=241 → 选域E。
- 工作树干净，HEAD=origin/main=cc3c5319，无并行在途改动，无需 stash。

## A类修复（3项）
| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/core/domain_e_linkage_r235.js:44 | 净资产计算引用公司股持仓不存在的 `.price`（stock.js:305 建仓仅 {symbol,name,shares,avgPrice}）→`&&_s.price` 恒假→公司股市值恒漏算，净资产系统性低估（E→G 生活品质/E→D 社交效应门槛全失真） | 改权威取法 `state.corporate.stockMarket[sym].price`（stock.js:570 持仓概览同源），市场缺失回退 avgPrice，isFinite 守卫 | A |
| src/js/core/domain_e_linkage_r235.js:88 | `_downPct` 声明(:89)前被读取→var 提升恒 undefined→`undefined>=0.7` 恒假→熊市 "bear" 分支永不可达；且 `_getMarketTrendR235` 全库零调用方（未挂 window）双料死函数 | 声明前置；导出 `window._getMarketTrendR235`/`window._calcNetWorthR235` 供 R246 事件消费复活 | A |
| src/index.html | 漏注册已提交的 domain_b_linkage_r244.js（悬空文件——build.py 严格按 script 序串接；当前 dist 中 R244 内容系提交者手改 dist 产物，任何一次 build.py 重建都会把 R244 三事件从 dist 静默剔除，必现回归） | 补 `<script src="js/core/domain_b_linkage_r244.js">` 注册（r242 之后） | A |

## 联动增强（3项，新建 src/js/core/domain_e_linkage_r246.js）
| 事件 | 联动 | 设计意图 |
|---|---|---|
| e246_bear_market_faces (street) | E→B | 熊市众生相——首个消费修复后可达的 `_getMarketTrendR235()==="bear"`，双重复活死函数+死分支；置 `_bearMarketWitness` 供后续叙事 |
| e246_wealth_treat_neighbors (street) | E→D | 宽裕请街坊——首个消费 R235 每日写入、全库零消费者的死flag `_wealthSocialBonus`(≥3门控)，写入→消费闭环；严守域D铁律(relationships只读/met守卫/applyAffinityChange) |
| e246_networth_backbone (corporate) | E→H | 身家底气——消费修复后首次含公司股市值的净资产(≥5万+在职)→接烫手项目 management XP+`player.corporate.upward` |

全部 IIFE 注入 RANDOM_EVENTS、显式 phase、全||防御、数值[PLACEHOLDER]、id 前缀 e246_ 不冲突。

## 验证
- node --check：domain_e_linkage_r246.js / domain_e_linkage_r235.js 通过
- build.py：dist app.js 9428.4KB（R244+R246 标志与事件 id 均确认入 bundle）
- MC：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`（结果见提交信息/MEMORY）

## 下轮
R247 → 域F（recency 238 最薄弱）。

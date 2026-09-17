# R190 域B（事件/叙事）优化记录

- 日期: 2026-07-24
- 域: B 事件/叙事（domainRecency 172，最薄弱）
- 提交: fix `df2e458a` + feat `83807d4e` + chore `ee0d2663` + chore `bf17ba8d`（均已推 main）
- MC: 6×400d，MC_EXIT=0，无 TypeError/ReferenceError/NaN/Infinity；构建 9022.6KB

## A类缺陷修复（10 处，均在 src/js/data/news.js）

新闻的 jobPenalty/jobBonus/investmentEffect 引用了**不存在的 id**，被消费链静默丢弃 → 新闻效果死数据。
用 `comm -23` 交叉比对 jobs.js 真实 57 个 job id + investment.js 的 INV_STOCKS symbol 确证。

无效 id → 真实 id 映射：
- street_vending_goods / food_stall → sister_zhang_vending / restaurant_assistant
- park_flower_vendor / street_performer → sister_zhang_vending
- skilled_labor_construction → steel_worker
- hospitality → restaurant_assistant
- coding_freelance / data_analyst → remote_dev / junior_analyst
- 股票 symbol WEORK（INV_STOCKS 无）→ ESTATE（房地产，契合"共享办公空间爆满"语义）

修复后 news.js 的求职加成/惩罚（存入 `state._introJobBonuses[jobId]`）与投资效果（symbols 匹配 INV_STOCKS）本轮起真正生效。

## 联动增强（3 项，新建 src/js/core/domain_b_linkage_r190.js）

IIFE 注入全局 RANDOM_EVENTS，守卫 `_domainBLinkageR190Loaded`，全字段 `||` 防御，显式 phase，数值标 [PLACEHOLDER]：
- news_r190_streettalk（B→D, street）：新闻成街坊闲聊话题→与首个已结识NPC涨好感；用 `firstMetNpc(st)` 遍历 `st.relationships` 取 `rel.met` 者，走 `applyAffinityChange`（避免硬编码未激活NPC致死事件）
- news_r190_trend_skill（B→C, street）：追热点潮流→english/sales 技能 addSkillXp + mental
- news_r190_market_sense（B→E, corporate）：现金≥15000 门槛，读新闻练市场嗅觉→置 `_dataInvestorMindset` 投资意识 flag + mental

## 关键事实（复用于后续轮）

- news.js 求职效果消费链：jobPenalty/jobBonus 的每个 id 须是 jobs.js 真实 job id，否则存入 `_introJobBonuses` 时静默失效。
- investmentEffect.symbols 须匹配 investment.js 的 INV_STOCKS symbol，否则投资效果死数据。
- 真实可用 job id 示例：sister_zhang_vending / restaurant_assistant / steel_worker / remote_dev / junior_analyst / delivery_rider / street_vending_food / busking / manual_labor_construction / cleaning_service。
- 下轮 R191 → 域C（职业/成长, recency 187）。

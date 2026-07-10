# P2-11~P2-15 实现计划

## P2-11 办公地点升级（已有数据，需集成）

- 数据：`OFFICE_LOCATIONS`（5级：shared→normal→techPark→headquarters→campus）
- 公司字段：`officeLocation`、`officeUpgradeHistory[]`、`nextOfficeUnlockDay`
- 核心逻辑：升级条件检查（资金/声誉/天数）、升级效果（招聘/忠诚度/技术/市场加成）、降级机制
- UI：办公地点管理面板、升级按钮、各等级对比

## P2-12 企业文化选择（已有数据，需集成）

- 数据：`COMPANY_CULTURES`（3种：狼性/工程师/家文化）
- 公司字段：`companyCulture`、`cultureChangeHistory[]`、`cultureAdoptionProgress`
- 核心逻辑：文化选择/切换、文化对员工忠诚度/流失率/生产力/创新的影响、文化冲突
- UI：企业文化面板、文化切换按钮、文化效果可视化

## P2-13 合作伙伴/渠道商（全新）

- 合作伙伴类型：技术伙伴/渠道商/战略投资/供应链伙伴/营销伙伴
- 公司字段：`partners[]`、`partnerHistory[]`、`partnerTrustLevel`
- 核心逻辑：伙伴招募、信任度演化、伙伴事件（背叛/深度合作/联合开发）、伙伴收益
- UI：合作伙伴管理面板、招募按钮、伙伴状态展示

## P2-14 产品定价策略（全新）

- 定价模式：固定价/动态价/订阅 tiers/免费增值
- 产品字段扩展：`pricingModel`、`basePrice`、`discountRate`、`priceHistory[]`
- 核心逻辑：价格弹性模型、竞品价格对比、促销/折扣机制、A/B测试定价
- UI：产品定价面板、价格调整按钮、价格弹性图表

## P2-15 供应链系统（全新，硬件专属）

- 供应商类型：元器件/原材料/代工厂/物流/质检
- 公司字段：`suppliers[]`、`inventory[]`、`supplyChainRisk`、`leadTime`
- 核心逻辑：供应商管理（质量/价格/交期）、库存管理、供应链中断事件、JIT vs 安全库存
- UI：供应链管理面板、库存看板、供应商评级

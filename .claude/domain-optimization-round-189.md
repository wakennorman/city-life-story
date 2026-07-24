# Round 189 — 域A 数据/数值平衡

日期: 2026-07-24 | 域A(recency 171 最薄弱) | 基线 HEAD 821ebeb9

## 修复清单（A类 2 项）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| src/js/data/locations.js（9地点） | specialties/priceMod 引用非 good.id 的 token（`luxury`/`food` 为 category 名，`sports_equipment`/`beverages`/`meat`/`seafood`/`pets` 不存在，`books` 应为 second_hand_book）→ getDailyGoodsForLocation 经 `getGoodById().filter(Boolean)` 静默丢弃招牌商品（本应100%必出）；`loc.priceMod[good.id]`（main.js/trade.js/pricing.js/wiki.js/weather.js 多处消费）永不命中→价格倍率死数据 | 全部改真实 good.id：luxury_community/auto_city→cigarettes；old_community→vegetables；gym→vitamins_item；internet_cafe→beer；logistics_park→instant_noodles；flower_bird_market→carnation/rose(+specialCategory 补 flowers)；flea_market→second_hand_book；vegetable_market→pork/fish。specialties 与 priceMod 键同步修正 | A |
| src/js/data/skills.js:getAvailableCertificates | 漏校验 `req.electrician`（electrician_cert 电工20级门槛=死门控，0级也能考）与 `req.ageMin/ageMax`（全库无消费者，超龄/未成年也能考驾照/厨师证等） | 补 electrician 技能门槛（镜像 repair/cooking 模式）+ 年龄门槛（读真实字段 `state.player.age`）。**cash 有意不加**——main.js:3787 已用 `disabled`+`需¥X` 提示处理，加 cash 会使证书从列表直接消失（更差 UX） | A |

- B/C 类：Explore 全域扫描 jobs/skills/items/goods/illnesses/trade/economy_v3.1/finance/skill_tree/skill_synergy 均确认健康（location→job id 对齐、payCalc 技能键真实、illness 演化链目标存在、现金数学均有 isFinite/||守卫、economy_v3.1 难度键已修）。无 B/C 类待办。

## 增强清单（联动 3 项，新建 domain_a_linkage_r189.js）

| 新增内容 | 联动域 | 设计意图（一句话） |
|---|---|---|
| data_a_r189_source_share（street） | A→D | 承接 specialties/priceMod 修复：摸清各地招牌好货/价格门道后把"省钱地图"分享给街坊 auntie_lin（applyAffinityChange 守 rel.met，域D铁律） |
| data_a_r189_haggle_mastery（street） | A→C | 常年跑市场低买高卖练出议价眼力→销售技能 addSkillXp("sales")（真实键），把交易数据积累转成职业能力 |
| data_a_r189_petty_capital（corporate） | A→E | 小本倒货攒下的现金第一次动了钱生钱的念头→复用 _dataInvestorMindset flag，衔接经济/投资域 |

- IIFE 注入 RANDOM_EVENTS，去重 `_dataLinkR189Loaded`，全字段 `||`/typeof 防御，数值标 [PLACEHOLDER]；显式 phase（引擎按 e.phase 过滤，无 phase 即死事件）。src/index.html 注册在 domain_h_linkage_r188.js 之后。

## 验证

- node --check：locations.js / skills.js / domain_a_linkage_r189.js 全通过。
- build.py→dist 9012.8KB（比源新）。
- MC 6×400d：MC_EXIT=0，grep 确认无 TypeError/ReferenceError/NaN/Infinity；前7天死亡率全 0.0%。存活率 balanced 66.7%/trader 50%/corporate 66.7% <80% 为既有 RNG 平衡阈值波动（历轮一致），social 100%、grinder/skiller ≥30% 高风险阈值达标，非本轮代码回归。

## 关键事实（供后续轮）

- 有效 good.id 全集（goods.js）：water/instant_noodles/snacks/daily_use/fruits/vegetables/beer/cigarettes/clothing/electronics/scrap_metal/scrap_paper/scrap_plastic/rice/flour/noodles/potato/bok_choy/cabbage/radish/tomato/cucumber/pork/beef/chicken/fish/salt/soy_sauce/cooking_oil/sugar/chili/egg/milk/second_hand_book/carnation/rose/cold_medicine/painkiller/vitamins_item/pen/notebook_item/tofu/mushroom/bamboo_shoot/lettuce/corn/onion/garlic/ginger/vinegar/starch/shrimp/duck。
- good.category ≠ good.id：category 有 books/clothing/daily/electronics/flowers/food/luxury/medicine/scrap/stationery。specialties/priceMod 键必须是 good.id 而非 category。
- locations.js `specialties` 由 phase1/trade_intel.js:getDailyGoodsForLocation 消费（100%必出招牌货，getGoodById 精确匹配）；`priceMod[good.id]` 由 main.js:2233/trade.js:495/pricing.js:142/wiki.js:1575,1894/weather.js:749/actions_extra.js:1917 消费。
- 证书门槛真实字段：技能走 `state.skills.<key>.level`，属性走 `state.player.<attr>`，年龄 `state.player.age`（初始20），现金 `state.resources.cash`。getAvailableCertificates 现校验 intelligence/physique/repair/agility/cooking/sales/electrician/mental/ageMin/ageMax；cash 由 main.js 的 disabled 标志处理（不在 available 里过滤）。

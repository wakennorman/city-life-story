# 域优化轮次 R426 — 域B 事件/叙事（第二十轮循环）

日期：2026-07-27 ｜ 域：B（recency=418 最薄弱，git log 实况重算）

## A类修复（3处缺陷 / 6个编辑点）

| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/core/domain_h_linkage_r170.js:39 | `st.needs.health` 死字段（state.needs 无 health）→ 高管犒劳事件健康+8 静默丢弃 | 改 `st.status.health`（加 st.status 守卫） | A |
| src/js/core/domain_h_linkage_r188.js:145/156/176 | 条件读 `st.needs.health`（永 undefined→\|\|100→健康分支永 false，创始人过劳事件触发闸门只剩 fatigue）+ 两处写入丢弃 | 条件改 `(st.status && st.status.health) \|\| 100`；写入改 `st.status.health` | A |
| src/js/phase2/personal_growth.js:688/1057 | `pg.image.appearance/grooming/charisma` 不在 state.js 默认 image 结构 {style,skincare,fitness,plastic} → `undefined+value=NaN` 污染 appearance 及 imageScore 均值 | 全部加 `\|\| 0` 守卫 | A |

## B/C类记录（不改）

- phase2/personal_growth.js 存在双结构分歧：state.js 默认 `health.physical={score}` 对象 vs phase2 惰性初始化的数字版（因默认结构已存在而永不生效）→ `pg.health.physical >= 70` 恒 false，healthStatus 恒"需要关注"。改动面大（涉及两套 schema 统一），记 B类待专轮处理。
- `pg.psychology.*`（phase2 惰性创建）与 `health.mental.*`（state.js 默认）双心理系统并存，phase2 写 psychology、事件读 mental——两套数据不互通。C类记录。

## 联动增强（3项，src/js/core/domain_b_linkage_r426.js，已挂 index.html）

| 事件 | 联动 | 设计意图 |
|---|---|---|
| b426_style_notice | B→D | image.style/skincare **全库首消费**：形象经营≥50 → 已met NPC 好感（applyAffinityChange 正规入口 + met 守卫）——禀赋效应：投入被看见 |
| b426_plastic_mirror | B→G | image.plastic **首消费**：整容后自我认同叙事，分支置 `_b426IdentityDoubt` 供生命节点读取——峰终定律的情绪谷底设计 |
| b426_gym_invest_chat | B→E | image.fitness × investment.stockHoldings 交叉：健身房投资闲聊，分支置 `_b426GymInvestInsight`/`_b426GymFomoUrge` 供投资域风险事件读取——损失厌恶×FOMO 心理钩子 |

全部：phase:"street" 显式、triggers.excludeFlags 冷却、conditions 全 false 时 text 返回 null 叙事自洽、数值 [PLACEHOLDER]、全字段 || 防御。

## 验证

- node --check ×4 通过；build.py 重建 dist（app.js 10891.0KB）
- MC：见提交信息（10×500d 或回退 6×400d，0 代码异常）

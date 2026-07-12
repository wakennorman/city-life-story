# 全系统优化·循环 R1 — Domain A（数据/数值平衡）

日期: 2026-07-12 | 分支: loop/auto | commit: `42528c0a`

## 指令一：A类缺陷审查

审计文件：jobs.js / skills.js / items.js / goods.js / illnesses.js / pricing.js / trade.js / economy_v3.1.js

方法：Python 静态提取 id 定义 + 跨文件引用比对；逐项核对 A类判定规则。

结论：**0 个 A类缺陷**。

- 跨文件 id 完整性：job(37)/item(55)/goods(53)/illness(25) 定义与引用 0 孤儿、0 悬空。
- 技能：`st.skills.*` 全部落在基础 10 技能；`st.skills.social` 4 处均有防御（可选技能）。
- 证书：18 个 cert id 引用全部有效。
- economy_v3.1.js：除零/NaN 守卫完备（`cityWealth || 10000000`）。
- pricing.js：`(toPrice-fromPrice)/fromPrice` 已有 `fromPrice===0` 守卫（早前担忧是误报）。

严守"不伪造修复"纪律，未做空提交。

## 指令二：联动增强（4项）

核心缺口：economy_v3.1（财富税/市场饱和/动态利率/连胜衰减）与 pricing.js 市场事件**均为"算而不显"**——grep 确认 0 事件引用，玩家无感。

| 事件 id                   | 阶段      | 联动                                   |
| ------------------------- | --------- | -------------------------------------- |
| econ_wealth_tax_tier      | street    | economy_v3.1 财富税阶梯 → 叙事决策     |
| econ_wealth_tax_tier_corp | corporate | 同上（职场覆盖）                       |
| econ_market_saturation    | street    | economy_v3.1 市场饱和 → 预警叙事       |
| price_market_event_alert  | street    | pricing.js marketEvents → 物价异动播报 |

防御：所有字段 `||` 守卫；数值标 `[PLACEHOLDER]` 待调参。

验证：node --check ✅ / build 7958.4KB ✅ / **MC 10×500d = 20000 评估 / 11367 触发 / 0 异常** ✅ / 674 事件 0 重复ID ✅。

## 下一步（R2 域 = B 事件/叙事）

轮换至 Domain B。关注：events_core 触发数据化迁移进度、corporate 阶段事件仍偏少（10 vs 655 street）、NPC 联动密度。

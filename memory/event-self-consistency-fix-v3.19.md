---
name: event-self-consistency-fix-v3.19
description: v3.19 事件叙事-触发自洽性全面审查+修复+3个新联动事件
metadata:
  type: project
  version: "3.19"
---

## 指令一：系统性审查（2026-07-05）

**审查范围**：5个事件文件（events_core.js / cross_system_events.js / events_street_life.js / events_street_survival.js / events_street_wealth.js / career_path_events.js）

### A类修复（8个事件）

所有 CROSS_EVENTS 中 `trigger` 字段统一为 `conditions`：

- `rain_opportunity`：暴雨商机事件
- `wang_tip_rental`：王大婶租房信息
- `park_skill_encounter`：公园老师傅
- `factory_zhang_layoff`：张姐工厂裁员
- `market_clearance_tech`：科技园地摊机会
- `seasonal_health_check`：换季健康检查
- `old_zhou_scrap_deal`：老周废品大单
- `xiao_mei_gig_economy`：小美副业机会

CAREER_EVENTS 4个事件同步统一。

### 已修复（之前轮次）

- `viral_harassment` ✅ 已加 delivery 检查
- `delivery_price_war` ✅ 已加 delivery 检查
- `rain_opportunity` ✅ 已加 weather 检查
- `sector_boom_startup_windfall` ✅ phase 已修

### B类/C类清单（仅记录，未自动修复）

B类：无发现
C类：无发现

## 指令二：联动空白区填充（3个新事件）

| 事件id                        | 触发条件                    | 联动系统       | 后续链式 |
| ----------------------------- | --------------------------- | -------------- | -------- |
| delivery_veteran_referral     | driving≥15 + 天数>30        | 技能+经济+社交 | 否       |
| repair_factory_emergency      | repair≥35 + 天数>20         | 技能+经济      | 否       |
| rain_market_umbrella_windfall | 暴雨天气+市场位置+现金≥¥200 | 天气+地点+经济 | 否       |

### 设计意图

- **跑腿老手→订单**：让长期配送的玩家感受到"城市开始认识你"的成长感
- **修理技能→抢修**：技能不再是面板数字，而是能在街头变现的实用能力
- **暴雨+市场→雨具**：天气×地点组合成商机，鼓励玩家注意环境联动

**验证**：node --check 全过 ✅ / python build.py (4754.0 KB) ✅ / commit 2e033b4 ✅

---
name: domain-b-optimization-round-15
description: 全系统优化R15 域B(事件/叙事) — 19个A类修复+5项修复+2项联动增强
metadata:
  type: project
  focus: "2026-07-14 loop R15(域B)"
---

# 全系统优化 R15 — 域B 事件/叙事（2026-07-14）

## 指令一：A类缺陷修复（19项 + 5项其他修复）

### 18处cost定义但apply未扣款（cross_system_events.js）

| #   | 行号  | 事件                   | cost   | 修复方式                       |
| --- | ----- | ---------------------- | ------ | ------------------------------ |
| 1   | 1024  | 台风废品（听老周多收） | ¥50    | 加入 `st.resources.cash -= 50` |
| 2   | 8066  | 科技园优先承租权       | ¥2,000 | 加入扣款                       |
| 3   | 8088  | 小仓位买入科技股       | ¥1,000 | 加入扣款                       |
| 4   | 9820  | 专业鉴定买假货试试     | ¥80    | 加入扣款                       |
| 5   | 15336 | 雪夜废品(¥800进货)     | ¥800   | 加入扣款                       |
| 6   | 15357 | 雪夜废品(¥300挑几样)   | ¥300   | 加入扣款                       |
| 7   | 15589 | 供需套利进货           | ¥200   | 加入扣款                       |
| 8   | 15924 | 夏天夜市烧烤           | ¥150   | 加入扣款                       |
| 9   | 16216 | 健康危机诊所           | ¥300   | 加入扣款                       |
| 10  | 16230 | 健康危机自己买药       | ¥50    | 加入扣款                       |
| 11  | 16600 | 秋收批水果             | ¥200   | 加入扣款                       |
| 12  | 16620 | 秋收买苹果吃           | ¥50    | 加入扣款                       |
| 13  | 17082 | 便利店等雨停买热饮     | ¥5     | 加入扣款                       |
| 14  | 44466 | 毕业请同学吃饭         | ¥200   | 加入扣款                       |
| 15  | 45542 | 春寒买外套             | ¥50    | 加入扣款                       |
| 16  | 45555 | 春寒喝热汤             | ¥15    | 加入扣款                       |
| 17  | 45765 | 冬炉买红薯             | ¥10    | 加入扣款                       |
| 18  | 48991 | 坚持付装备钱           | ¥200   | 加入扣款                       |

### 1处NPC met检查缺失（events_street_survival.js）

- `township_buddy`事件：叙事直呼"老周头"(old_zhou)但conditions未校验已结识，已修复

### 1处CROSS_EVENTS注册遗漏（cross_system_events.js）

- 其他窗口新增3事件通过CROSS_EVENTS.push追加但注册循环已执行完毕，导致事件未注册到RANDOM_EVENTS
- 修复：在文件末尾新增注册循环，遍历所有未注册CROSS_EVENTS条目

### 其他窗口遗留修复（5项B类）

- cross_system_events.js: st.morality→st.player.morality（裸根bug）
- cross_system_events.js: st.fame→st.player.fame（裸根bug）
- cross_system_events.js: st.needs.intelligence→st.player.intelligence
- cross_system_events.js: choices:[]→choices函数（dynamicApply引擎不调用）
- events_street_survival.js: market_crash_news h.shares=0 NaN除零崩溃

## 指令二：联动增强（2项）

| 新增事件                      | 文件                   | 联动域    | 设计意图                                  |
| ----------------------------- | ---------------------- | --------- | ----------------------------------------- |
| hard_mode_survival_reflection | cross_system_events.js | 域G(难度) | 困难/地狱模式健康<30+现金<100触发绝境回望 |
| investment_loss_anxiety       | cross_system_events.js | 域E(投资) | 累计投资亏损超¥10000触发心理事件          |

## 验证

- node --check 全部通过 ✅
- build.py 8307.8 KB ✅
- commit 48990235 ✅
- git push: ❌ 网络不可用

## 下一轮推荐

域C（职业/成长）或域F（UI/UX）—— cross_system_events.js仍有大量字符串拼接样式待统一

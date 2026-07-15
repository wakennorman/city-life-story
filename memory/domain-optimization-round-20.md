---
name: domain-optimization-round-20
description: 全系统优化R20 域B(事件/叙事) — 跨文件A类修复(upward→upwardMgmt 10文件)+2联动增强
metadata:
  type: project
  domain: "B"
  round: 20
---

# 全系统优化 R20 — 域B 事件/叙事（2026-07-15）

## 指令一：A类缺陷修复

### 跨文件 upward→upwardMgmt（10文件）

所有事件文件写 `st.player.corporate.upward`（wrong），但游戏引擎(`perf.js`)/UI(`render.js`)读 `st.player.corporate.upwardMgmt`。
10个文件修复：

| 文件 | 修复内容 | 影响 |
|------|---------|------|
| career_linkage_events.js | 3处 up→upwardMgmt | 职场事件效果对引擎生效 |
| company_linkage_events.js | 3处 up→upwardMgmt | 公司联动事件生效 |
| cross_system_events.js | ~10处 up→upwardMgmt | 跨系统事件生效 |
| data_linkage_events.js | 2处 up→upwardMgmt | 数据联动事件生效 |
| economy_invest_linkage_events.js | 2处 up→upwardMgmt | 投资联动事件生效 |
| economy_linkage_events.js | 4处 up→upwardMgmt | 经济联动事件生效 |
| lifecycle_linkage_events.js | 2处 up→upwardMgmt | 生命周期事件生效 |
| lifecycle_milestone_events.js | 1处 up→upwardMgmt + 守卫拆分 | 里程碑事件生效 |
| moral_events.js | 2处 up→upwardMgmt | 道德事件生效 |
| data_viz.js | 雷达图 state.corporate→player.corporate + upward→upwardMgmt | 雷达图首次展示正确属性值 |

### actions.js: st.morality 裸根 bug
- `actions.js:233-234`: 寺庙静心使用 `st.morality` → `st.player.morality`（道德+1从未生效）

## 指令二：联动增强（2项）

| 新增事件 | 文件 | 联动域 | 设计意图 |
|---------|------|--------|---------|
| stormy_corp_commute | cross_system_events.js | B→G/H(天气×职场) | 恶劣天气下corporate通勤抉择 |
| homeless_endurance_crisis | cross_system_events.js | B→A/G(住房×健康) | 长期露宿生存危机叙事 |

## 交付状态

- node --check 全部通过 ✅
- python build.py 8445.2KB ✅
- git commit 962aa45e ✅
- git push: ❌ 网络代理不可用

## 下一轮推荐

域C（职业/成长）— 检查 R24/R25 后新技能/新职业路径的事件覆盖

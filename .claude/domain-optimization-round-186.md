# 域优化 Round 186 — 域F（UI/UX）

日期：2026-07-24 · 自动化触发 · 基线 HEAD `d5fd7d65`

## 一、A类缺陷修复（2项）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| src/js/ui/daily_quest.js:158/177/233 | `state.certs` 死字段（全库无写入点；真实字段为 `state.certificates` 数组，main.js:3799 push cert.id）→ certGte 每日目标永不完成、「📜考下第一张证书」目标因 certCount 恒0 反复推入且永久卡死 | 三处改读 `state.certificates || []`，certGte 判定改 `certs.length >= q.t`，certCount 改 `certs.length` | A |
| src/js/ui/tutorial.js:1495 | 同款 `st.certs` 死字段 → `first_skill_cert` 首证引导提示永不弹出 | 改 `st.certificates || []` + `certs.length > 0` | A |
| src/js/ui/victory.js:171 | 流浪终老暗结局分支 `!state.career.currentJob` 无守卫（`state.career` 为动态字段，从未求职时 undefined → TypeError；同文件 104/152/184 行均有守卫，唯此处缺失） | 改 `!(state.career && state.career.currentJob)` | A |

排除的疑似项（Explore 全量核查后排除）：corp_ui/victory `corporate.rank`（phase 不变式保护）、side_hustle_ui 疲劳除法（max 恒 100）、daily_report streak 除法（外围守卫）、social_tab 除法（三元兜底）、onclick 全局函数（均可解析）。

## 二、联动增强（3项，新建 `src/js/core/domain_f_linkage_r186.js`）

| 新增内容 | 文件 | 联动域 | 设计意图 |
|---|---|---|---|
| `ui_r186_cert_wall` 证书上墙（certificates≥2，street） | domain_f_linkage_r186.js | F→C | 本轮修复让证书目标/引导真正生效，此事件给证书积累补「看得见的成就感」UI叙事，置 `_certConfidence` flag 供职业域消费 |
| `ui_r186_quest_ritual` 目标连击仪式（`flags._questStreak`≥7，street） | 同上 | F→G | 每日目标面板的连击数字第一次被叙事消费，转化为「生活被自己掌控」的自律节点，置 `_dailyRitualKeeper` flag |
| `ui_r186_progress_share` 复盘方法被同事看见（密友好感≥20，corporate） | 同上 | F→D/C | 数据可视化复盘习惯变成社交+职场资本：applyAffinityChange（守 rel.met 铁律）+ addSkillXp("management") |

注册：src/index.html 在 domain_c_linkage_r187.js 之后。IIFE 防重 `RANDOM_EVENTS._domainFLinkageR186`；全 `||` 防御；显式 phase；数值 [PLACEHOLDER] 常量集中标注。

## 三、验证

- node --check 4文件通过（daily_quest/tutorial/victory/domain_f_linkage_r186）
- build.py → dist 8992.2KB（比 src 新）
- MC：见提交记录（须 0 代码异常）

## 四、轮次协调备注

- 并行窗口已以 **R187** 落地域C（`397310d3` domain_c_linkage_r187.js），但未更新 loop-domain-state.json。本轮已代为回填：C recency=187，currentRound 取 max=187，下轮从 **R188** 开始。
- 更新后 recency：A:171 B:172 C:187 D:184 E:185 F:186 G:180 H:170 → 最薄弱 **H(170)** → nextDomain=H。

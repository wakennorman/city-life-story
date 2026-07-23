# 域优化 Round 188 — 域H (Phase2/公司/创业)

**日期**: 2026-07-24
**域**: H — Phase2/公司/创业
**基线 HEAD**: 5dd98d50（R186 chore push 后，树干净）
**选域依据**: loop-domain-state nextDomain=H，recency 170 为最薄弱域

## 一、A类缺陷修复清单

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| src/js/data/startup_events.js:244 | `seed_headhunted`「核心员工被挖角」用 `condition:`（单数）门控，但 `triggerStartupEvent` 只读 `evt.conditions`（复数，:1082）→ 死门控；且引用 `st.company`（全库无此字段，公司真实挂 `st.startup.company`）→ 零员工也弹"被挖角"叙事矛盾 | 键名 `condition→conditions` + `st.company→st.startup.company`（含 employees 链守卫） | A |
| src/js/data/startup_events.js:688 | `mature_team_left`「核心团队离职创业」同款死门控 + `st.company` 不存在字段 | 同上，员工数 `>=3` | A |
| src/js/data/startup_events.js:1104 | `_applyStartupEffects` 的 `STARTUP_FIELD_MAP` 遗漏 `revenue`，而 `mature_second_curve` 选项 `effect:{revenue:30000}` → 承诺营收被静默丢弃（`company.revenue` 是 KPI 评分真实字段 startup.js:1530/1754） | 映射表新增 `revenue:{clamp,min:0,max:Infinity}` | A |

**误报排除**（Explore 审 17 文件，仅上述 3 项确证）：corp_ops/team/promo/perf/startup_crisis/startup_data/workplace_social/corp_legacy_bonus/company_spawner/events_corp/workplace_social_events/corp.js/corporate_npc_events/corporate_team_events/startup_competition/startup.js 均具备既有守卫，干净。`events_corp.js` 无 `corporateorate` 拼写残留（R21 已修）。

## 二、联动增强清单（3 项）

新建 `src/js/core/domain_h_linkage_r188.js`（IIFE→RANDOM_EVENTS，防重 `_corpLinkR188Loaded`，全 `||`/`typeof` 防御，`phase:"corporate"`，数值标 [PLACEHOLDER]）。src/index.html 注册在 domain_f_linkage_r186.js 之后。

| 新增内容 | id | 联动域 | 设计意图（一句话） |
|---|---|---|---|
| 股权套现的诱惑 | corp_h_r188_equity_cashout | H→E | 创业/高职级资本沉淀套现转入个人投资账户，复用 `_dataInvestorMindset` flag 桥接投资域 |
| 并肩作战的夜晚 | corp_h_r188_cofounder_bond | H→D | 与职场伙伴 boss_li 共渡难关走 `applyAffinityChange`（守 rel.met 铁律）深化社交 |
| 深夜的自我盘问 | corp_h_r188_founder_burnout | H→G | 创业者身心透支触发人生反思，回填健康/心智 + 开启 `_founderHealthAwareness` 生命节点 flag |

## 三、验证

- `node --check`：startup_events.js / domain_h_linkage_r188.js 均通过。
- `python build.py`：dist/app.js 9002.5KB，dist/index.html 比 src 新。
- 蒙特卡洛 `6×400d`：**MC_EXIT=0 · 0 代码异常**（grep 确认无 TypeError/ReferenceError/NaN/Infinity；前7天死亡率全 0.0%）。存活率 balanced 66.7%/corporate 50% <80% 为既有 RNG 平衡阈值波动（历轮 corporate 在 50%~100% 间波动，6 trials 粒度粗，非代码回归）；trader 83.3%/social 100% 达标，grinder/skiller 50%≥30% 高风险路径达标。

## 四、提交

- fix: [域H] A类缺陷修复(3个) — startup_events.js
- feat: [域H] 联动增强(3项) — domain_h_linkage_r188.js + src/index.html
- chore: 回填 loop 状态 + 文档
- 提交前同步 `.claude/last_known_head`；`git pull --rebase origin main`（autoStash）后 `git push origin main`。

**下轮 → 域A（数据/数值平衡，recency 171 最薄弱）**

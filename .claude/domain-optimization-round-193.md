# 域优化 Round 193 — 域H (Phase2/公司/创业)

- 日期: 2026-07-25
- 轮次: R193（currentRound 192 → 193）
- 域: H（Phase2/公司），recency 188 最薄弱
- 起始 HEAD: `eac6055b`（并行窗口刚提交「域H A类修复8项 cash NaN守卫」，触及 personal_growth/family_life/side_hustle.js）
- 并行隔离: 工作区有并行窗口在途的 `src/js/phase2/investment.js`（域E 成交记录 tradeLog 特性,+71行）→ 本轮 `git stash push -- investment.js` 隔离后构建,提交完成再 `git stash pop` 无损还原；本轮全程不碰该文件。

## 一、A类缺陷修复（2项）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|------|---------|---------|------|
| src/js/data/startup_events.js | `_applyStartupEffects` 的 `STARTUP_FIELD_MAP` 遗漏 `revenue` 键 → mature_second_curve/consumer_viral 三事件承诺的 `effect.revenue`(+30000/+200000/+100000) 被 `if(!rule)continue` 静默丢弃；而 `company.revenue` 是 startup.js:1530/1753 KPI/融资读取的真实字段(startup.js:554 初始化 revenue:0)，营收增益本应落地 | 在映射表补 `revenue: { clamp: true, min: 0, max: Infinity }` → 三事件营收增益本轮起真正生效 | A |
| src/js/core/events_corp.js:1570 | 某真实可达职场事件 apply 内写 `st.skills.management.exp`，而技能经验规范字段全库统一为 `.xp`(如同文件 1104/1398 `st.skills.coding.xp`)→ 写入不存在属性,提示文案承诺的「管理技能XP+50」静默丢失 | `.exp` → `.xp` → 管理 XP 本轮起真正累积 | A |

> 说明：MEMORY.md 曾记「R188 已修 STARTUP_FIELD_MAP 遗漏 revenue」，但当前源码该表实无 revenue 键（疑回退或 R188 仅修了 condition单数/st.company 部分）。本轮以源码实况为准重新补入。

### 已识别但本轮未动（记录，避免高风险并行冲突）
- `workplace_social.js:503 triggerOfficePoliticsEvent` 全库零调用方 → 办公室政治事件子系统整体死代码。修复需将其接入随机事件管线/职场行动/每日 tick，改动面大且在并行高峰期有冲突风险，本轮仅记录，留待后续域H轮次专门处理（C类处理：记下不改）。

## 二、联动增强（3项）— 新建 domain_h_linkage_r193.js

IIFE 注入 RANDOM_EVENTS，全部 `phase:"corporate"`（创业/公司职业均在 corporate 阶段），全字段 `||` 防御，gameOver 闸门，数值标 [PLACEHOLDER]。承接本轮两处 A类修复的价值闭环。

| 新增事件 | 联动域 | 设计意图（一句话） |
|---------|-------|-----------------|
| corp_h_r193_revenue_windfall | H→E | 承接 revenue 修复——公司营收累积创里程碑(company.revenue≥100000 现在才可达)，把经营者的现金流敏感度迁移为个人理财意识(复用 _dataInvestorMindset flag)。 |
| corp_h_r193_team_reward | H→D | 年终给一路陪跑的核心团队发奖/请客 → firstMetNpc 好感 applyAffinityChange(守 rel.met 域D铁律)，把并肩情谊落到实处。 |
| corp_h_r193_leadership_growth | H→C | 承接 .xp 修复——复盘带团队一年的历练 → addSkillXp("management") 真实沉淀管理技能，管理成长首次真正入账。 |

辅助函数：`firstMetNpc(st)`（只读 relationships+rel.met，避免硬编码未激活 NPC 造死事件）/ `inCorp(st)`（corporate.rank 或 startup.company 判定阶段）。

## 三、验证
- `node --check`：startup_events.js / events_corp.js / domain_h_linkage_r193.js 全 OK。
- `python build.py`：dist/app.js 9095.5KB + index.html 134.1KB，均比 src 新；grep 确认 r193 已入 bundle(_corpLinkR193Loaded)。
- 蒙特卡洛 `--trials 6 --days 400`：**0 代码异常**（无 TypeError/ReferenceError/NaN/Infinity；末尾 RSS/36氪 timeout 为离线新闻网络回退,非代码异常）。存活率 grinder 0.0%/trader 66.7% 为既有 RNG 平衡阈值波动(6 试样噪声,本轮改动仅 corporate 阶段事件+字段映射+技能XP,与街头 grinder 路径无关,非代码回归)；balanced/skiller 100%、social/corporate 83.3% 达标。

## 四、提交
- 提交前同步 `.claude/last_known_head` = 当前 HEAD 过 pre-commit 漂移检查。
- 仅 add 本轮文件：startup_events.js / events_corp.js / domain_h_linkage_r193.js / src/index.html / src/DEVELOPMENT.md / CLAUDE.md / dist/app.js / dist/index.html / .claude/loop-domain-state.json / .claude/last_known_head / .claude/domain-optimization-round-193.md / memory。不 -A、不 --amend、不 force。
- `git pull --rebase origin main` 后 `git push origin main`。
- 完成后 `git stash pop` 还原并行窗口 investment.js。
- 下轮 → 域D（NPC/社交，recency 184 最薄弱）。

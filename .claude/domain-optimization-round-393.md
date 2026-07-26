# 域轮换优化 · 第 393 轮 · 域H（Phase2/公司）

> 日期：2026-07-27　|　起始 HEAD：4624982d（R392 域G 已 push）
> 真实 recency（git log 重算）：A=387 / B=389 / C=391 / D=389 / E=389 / F=390 / G=392 / H=386 → **H(386) 全局最薄弱** → 本轮域H

## 开轮核对
- 磁盘 loop-state 严重滞后（标 round390/next=G，落后 2 轮）——并行窗口已推进 R391(C)/R392(G) 但未维护 loop-state。据 git log 权威重算取域H。
- 开轮工作树发现并行窗口已 in-flight R393 域H：`domain_h_linkage_r393.js`（未追踪）+ `src/index.html:774` 已注册。按既定纪律不创建竞争文件，转为「审校并行联动 + A类定位修复 + MC 验证 + 权威 bookkeeping」。

## 一、A类缺陷修复（1 项，确证）

| # | 文件:行 | 缺陷 | 类别 | 修复 |
|---|---------|------|------|------|
| 1 | src/index.html:587 | 悬空脚本引用 `domain_b_linkage_r389.js`——该文件**不存在**（真实文件为 `domain_b_linkage_r389b.js`，由并行窗口创建但**未注册=孤儿**）。build.py 按 `<script>` 顺序串接、引用不存在文件时**静默跳过** → R389 域B 联动事件（Phase1→2 入职叙事/街头经验回响公司）从 bundle 中被剔除、永不发火；同时 r389b.js 孤儿从不加载。 | 悬空引用/未挂载（同 R392「未挂载联动文件」类） | index.html:587 引用改 `domain_b_linkage_r389.js` → `domain_b_linkage_r389b.js`。一处修复同时消除悬空引用 + 恢复孤儿文件加载 + 找回被静默剔除的 R389 域B 事件。注释 `// [全系统自洽修复] 域H R393 修复:...`。 |

- 验证：修复后 dist 重建，`grep domain_b_linkage_r389\.js src/index.html` = 空（悬空引用已消除）；bundle 内 r389b/h393 标志 count=3。

## 二、跨域联动增强（3 项，并行窗口 R393 提供，本窗口审校通过）

文件：`src/js/core/domain_h_linkage_r393.js`（IIFE→RANDOM_EVENTS，守卫 `_domainHLinkageR393Loaded`，全 `||` 防御，excludeFlags 冷却，StateManager 守卫，id 前缀 `h393_` 唯一）

| id | 桥接 | phase | 主题 |
|----|------|-------|------|
| h393_culture_dashboard | H→F | corporate | 公司文化仪表盘：消费 corporate.culture/perfHistory 数据，把抽象职场数字转化为「公司文化如何」UI 叙事，mental+3/happiness+4 |
| h393_milestone_anniversary | H→B | corporate | 在职里程碑周年：消费 daysInJob 数据，一年/半年/百天节点触发「又一年」回响，management XP+8/mental+4 |
| h393_corporate_invest_loop | H→E | corporate | 工资与投资良性循环：消费 corporate.salary+investment 数据，置 _dataInvestorMindset+_salaryInvestIntent，从打工人到投资者思维转变，accounting XP+5 |

- 审校：node --check OK；三 id 全库唯一；各事件 `phase:"corporate"` 显式设置（否则永不发火）；conditions 全守 `st.player.corporate` 空值；text() 全 `||` 兜底。

## 三、验证结果
- `node --check` domain_h_linkage_r393.js / domain_b_linkage_r389b.js 均通过。
- `python build.py` → dist/app.js **10646.8 KB**（比 src 新）；`_domainHLinkageR393Loaded` count=2、r389b/h393 标志 count=3 均入 bundle；无悬空 r389.js 引用。
- MC `6×400d` → **MC_EXIT=0 · 0 代码异常**（TypeError/ReferenceError/NaN/Infinity/Uncaught grep=空）；前7天死亡率**全 0.0%**（无早期死亡崩溃回归）。存活率 balanced/social 66.7%、corporate 16.7% <80% 为既有 RNG 平衡阈值（非 0%、耗时 115s → 非硬崩溃、非本轮回归）；trader 83.3% ≥80%、grinder/skiller ≥30% 高风险路径达标。

## 四、并发说明
- 域H 联动代码（r393.js + index.html:774 注册）由并行窗口 in-flight 提供，本窗口审校通过未改动。
- 本窗口 A类修复（index.html:587 悬空引用）+ 完成孤儿文件 r389b.js 挂载 + 重建 dist + 权威 bookkeeping。
- 提交仅 `git add` 本轮特定文件（src/index.html / domain_h_linkage_r393.js / domain_b_linkage_r389b.js / dist / loop-state / round-doc / last_known_head），绝不 `-A`/`--amend`/`--force`。

## 五、下轮
- recency（R393 后）：A=387 / B=389 / C=391 / D=389 / E=389 / F=390 / G=392 / H=393 → **A(387) 全局最薄弱** → 下轮域A。
- 开轮必 `git log` 重算真实 recency（并行窗口速度远快于本自动化）。

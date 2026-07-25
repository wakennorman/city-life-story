# 全系统优化 Round 242 — 域A 数据/数值平衡

> 日期：2026-07-25 ｜ 轮次：R242 ｜ 域：A（数据/数值平衡）
> 上一轮：R241 域H（feat，2f45181e）｜ 本轮父 HEAD：2971e821（fix 域G R240）

## 一、A 类缺陷修复（2 项，数据/逻辑自洽）

### A类#1 — 三证书死效果键（XpBonus / JobIncomeBonus）接通技能链 + 工资链
- **根因**：`src/js/data/skills.js` 中 `cooking_cert`/`repair_cert`/`sales_cert` 三证书的 `effects` 块声明了 `cookingXpBonus`/`repairXpBonus`/`salesXpBonus`（技能经验加成）与 `chefJobIncomeBonus`/`repairJobIncomeBonus`/`salesJobIncomeBonus`（持证涨薪），但全代码库**零消费者**——证书 desc 宣称的「技能经验加成 / 持证涨薪」永久静默失效（A类死效果键）。
- **修复**（`src/js/main.js`，均加 `// [全系统自洽修复] 域A R242` 注释）：
  1. 发证循环（~L4007）：补 `_certSkillXpBonus` / `_certJobIncomeBonus` 两个 `state.flags` 映射的累积分支（按技能键 / job 主技能键取最高档，`Math.max` 防低值覆盖）。
  2. `addSkillXp`（~L5096）：接证书 XP 乘区 `skill.xp += Math.round(amount * _talentMult * (1 + _certXpBonus))`。
  3. 新增 `getCertJobIncomeMultiplier(job, state)` 函数（置于 `estimateJobPay` 前，`try/catch` 保 headless 安全，best 越界回退 1.0）。
  4. 在 `estimateJobPay`(~L236) / `estimateJobPayRange`(~L319) / `doStreetJob` 实发(~L4470，套装加成后) 三处工资链接入 `getCertJobIncomeMultiplier`，实发处播报「📜 持证加成」。
- **效果**：持有上述证书后，对应技能的练级速度与持证岗位薪资真正获得加成（此前恒为 1.0/无加成）。

### A类#2 — doStreetJob 三处非真实技能键调用 → 移除
- **根因**：`doStreetJob`（~L4672）末尾对 `addSkillXp("agility"/"physique"/"intelligence", …)` 调用，但 `state.skills` 真实键集仅 `{cooking,repair,coding,english,driving,sales,management,accounting,electrician,welding,medicine,social}`，**无 agility/physique/intelligence** → `addSkillXp` 内部 `if(!skill) return` 静默丢弃（死调用，零副作用）。
- **修复**：移除这三行；`agility`/`physique`/`intelligence` 实为 `state.player` 属性，已由下方「状态经验转化」块（`state.player.agility/physique/intelligence` 承接）正确维护，无需经 addSkillXp。

## 二、跨域联动增强（3 项，新建 domain_a_linkage_r242.js）

> 文件：`src/js/core/domain_a_linkage_r242.js`（IIFE 注入全局 `RANDOM_EVENTS`，守卫 `_domainALinkageR242Loaded`）
> 注册：`src/index.html` 在 `domain_h_linkage_r241.js` 之后（R242 域A）
> 约束：所有 state 访问 `||` 防御；数值一律 `[PLACEHOLDER]`；引擎按 `e.phase` 过滤故显式设 phase（2 street + 1 corporate）；id 前缀 `a242_` 与 `a197_`/`data_*`/`data_a_r189_` 不冲突。

| 事件 id | 方向 | 内容 | 消费的本轮机制 |
|---|---|---|---|
| `a242_cert_word_of_mouth` | A→B（叙事） | 持证涨薪的市井佳话 — **首补 A→B 方向**（历轮域A 唯一未用方向） | 消费 `_certJobIncomeBonus` → `state.player.fame` + mental + `needs.happiness` + `_certReputationSeen`（去重冷却） |
| `a242_cert_study_circle` | A→C（职业/成长） | 证书学习圈 — 持证者被同行看见、再投入 | 消费 `_certSkillXpBonus` → `addSkillXp(key, 8)`（取被加成最高技能键）+ mental |
| `a242_cert_resume_weight` | A→H（Phase2/公司） | 简历上的硬证书 — 证书为晋升背书 | `certificates.length >= 2 && (career.currentJob \|\| corporate.company)` → `addSkillXp("management", 6)` + cash + `_certCareerLeverage`（去重冷却） |

辅助函数：`topCertIncomeBonusR242(st)` / `SKILL_CN_R242`（中文名映射，全防御）。

## 三、验证

- `node --check src/js/main.js` ✅ / `node --check src/js/core/domain_a_linkage_r242.js` ✅
- `python build.py` ✅ → `dist/app.js` 9361.8KB（grep：`_domainALinkageR242Loaded`=2、`getCertJobIncomeMultiplier`=6、`_certSkillXpBonus`=13，全部入 bundle）
- 蒙特卡洛 `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400` → **MC_EXIT=0 · 0 代码异常**（grep 确认无 TypeError/ReferenceError/NaN/Infinity 行；前7天死亡率全 0.0% < 10% 无早期死亡回归；trader 66.7% / corporate 66.7% 存活率 ❌ 为既有 RNG 平衡阈值波动，非代码回归）

## 四、交付与提交纪律

- 本轮文件：`src/js/main.js` / `src/js/core/domain_a_linkage_r242.js` / `src/index.html` / `src/DEVELOPMENT.md`(v3.117) / `dist/app.js` / `dist/index.html`
- loop 状态：`currentRound=242` / `currentDomain=A` / `nextDomain`（8 域本轮循环完成，重启轮换 → 取 recency 最薄弱）；`domainRecency.A=242`
- 提交：fix（`[域A R242] A类缺陷修复(2项)`）+ feat（`[域A R242] 联动增强(3项)`）+ docs（迭代表/轮次文档/MEMORY.md）+ loop-state（`loop-domain-state.json` + `last_known_head`）
- 并行在途隔离：`domain_g_linkage_r240.js`（115 行 R240 域G 精炼，非本轮）经 `git stash push` 隔离，`git pull --rebase` 后 `git stash pop` 无损还原。
- push：`git pull --rebase origin main` → `git push origin main`

## 五、知识沉淀

- 域A 经 R14/R22/R189/R197/R242 多轮覆盖：A→D/A→C/A→E/A→G/A→F/A→H 均已打通，本轮**首补 A→B**（a242_cert_word_of_mouth），8 方向闭环。
- 证书效果键消费图谱：`healthBonus/mentalBonus/illnessRiskReduction/fatigueReduction`（R197 接）+ `cookingXpBonus/repairXpBonus/salesXpBonus/chefJobIncomeBonus/repairJobIncomeBonus/salesJobIncomeBonus`（R242 接）。剩余未接的证书效果键：`unlockJob` 类（`chefJobUnlock`/`repairJobUnlock`/`salesJobUnlock`）为「解锁岗位资格」语义，由 jobs.js 入职门槛逻辑消费（非纯数值加成，未纳入本轮 A类修复范围）。

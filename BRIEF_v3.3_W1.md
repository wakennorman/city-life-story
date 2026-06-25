# 城市浮生记 — v3.3 Wave-1 BRIEF（关联度闭合优先）

> 主控：Hermes（GLM-latest）+ 游戏设计师角色  
> 执行：Claude Code 火山 GLM-5.2（你）  
> 触发：`v3.0 审查改进`，请同时遵守 `memory/review-improve-v3.0.md`  
> 日期：2026-06-24

---

## 0. 任务一句话

**在已有内容基础上深化、扩展，并把"已经埋下但没串完"的关联通路全部接上**，让玩家感觉系统不是孤立的，每个选择都有 5~60 天后的回响。

## 1. Token / 范围 硬护栏（Tier-1，不可违反）

| 规则                                                                                                                                                                    | 来源      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **禁止 cat 整文件**。`main.js` 4087 行 / `render.js` 5944 行 / `events_street.js` 9800+ 行 / `moral_events.js` 2000+ 行 — 只用 `grep -n` 定位 + `Read` 工具读 ≤80 行/次 | v3.0 SOP  |
| 每个 patch ≤20 行；新模块 ≤300 行；不许写测试（无测试框架）                                                                                                             | v3.0 SOP  |
| **不要反复 build**。所有 Wave-1 任务全做完后**最后一次** `python build.py`                                                                                              | v3.0 SOP  |
| 不删任何 `.js`/`.css`/`.html` 文件；不改 `build.py`；不改 `index.html` 中 `<script>` 加载顺序；不 `git push`                                                            | CLAUDE.md |
| 不引入任何 npm 包/外部库（纯 vanilla JS 项目）                                                                                                                          | CLAUDE.md |
| **最终汇报只输出 ≤30 行**：每个任务列 `状态/文件/grep 验证 keyword`，不要长篇汇报                                                                                       | 省 token  |
| 每完成一个独立任务 `git add -A && git commit -m "<v3.3-Wx-Tn>: ..."`，**禁止 push**                                                                                     | CLAUDE.md |

## 2. 现状盘点（你需要知道但不要重新审计）

主控已经替你 grep 过，以下都是**已经埋好但未闭合**的钩子：

| flag/字段                                                     | 写入位置                                                   | 是否有 follow-up                                                                                        | 缺口                                                                    |
| ------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `_crisis35Path = "exam" / "career" / "lieflat"`               | `review_improvements.js:345-376`                           | 部分（`life_ribbon.js` 读；`story_chapters.js` 第三章读；`inheritance_chain.js::inheritCrisisPath` 读） | **缺 30~90 天延伸事件链**，3 条路径各应有 2~3 个后续叙事/系统影响事件   |
| `_healthCheckAlert`                                           | `review_improvements.js:191`（高端体检异常）               | **0 后续**                                                                                              | 需"复查→真疾病确诊 / 虚惊一场"二阶事件，延迟 7~21 天                    |
| `_badDebtAmount`                                              | `review_improvements.js:147`（亲戚借钱坏账）               | **0 后续**                                                                                              | 需"亲戚跑路→催债律师函 / 一年后真还款（与 `_goodLoanReturn` 配对）"事件 |
| `_goodLoanReturn`                                             | `review_improvements.js:150`（好心借出还回）               | **0 后续**                                                                                              | 需声誉传播事件（NPC 听说→好感+/介绍工作）                               |
| `inheritCrisisPath / inheritMoralScore / inheritPeakAffinity` | `inheritance_chain.js:329-410` + `modal.js:202-207` 已读出 | **wiki 没有"前世回忆"渲染页**                                                                           | 需 wiki 新条目"前世记忆"，展示上一周目 35 岁选择/道德分/巅峰 NPC 好感   |
| `heritage_coin.js` 模块（6 项红/绿互斥永久解锁）              | 已建好但**主菜单无入口**                                   | localStorage 累计，但玩家看不到                                                                         | 主菜单"新游戏"前增加"传承商店"入口，渲染 6 项卡片+解锁状态              |
| `moral_events.js` 79 个 flag 中仍有 ~30 个无 followup         | 散落各处                                                   | 部分                                                                                                    | 本 Wave 不强求全补，选 **4 个高频缺口** 补即可                          |

## 3. Wave-1 任务清单（按依赖顺序，逐个 commit）

### T1 · 35 岁分水岭三路径延伸事件链（核心 — 解决"叙事链短"）

**目标**：让 `_crisis35Path` 在选定之后的 30~90 天内有 6 个**新事件**响应，3 条路径各 2 个。

**新文件**：`src/js/data/crisis35_followups.js`（≤220 行）

**字段规范**（贴近现有 `RANDOM_EVENTS` 写法，IIFE 注入 `window.RANDOM_EVENTS`）：

```js
{
  id: 'c35_exam_first_try',
  title: '第一次模考',
  conditions: function(state) {
    return state.flags._crisis35Path === 'exam'
      && (state.day - (state.flags._crisis35Day || 0)) >= 30
      && !state.flags.c35_exam_first_try;
  },
  weight: 12,
  text: '你报了申论模考...',
  choices: [...]
}
```

**3 路径各 2 事件**（你可自由起名，但必须覆盖以下情境锚点）：

1. **`exam` 备考公**：① 第30天首次模考（智力/疲劳定结果） ② 第90天笔试 OR 放弃（`_passedCivilService` 写入决定第三章评价）
2. **`career` 再卷职场**：① 第30天加班通宵（疲劳+体质换 KPI） ② 第60天裁员名单（社交关系/绩效决定保命，呼应已有 `cross_system_events.js` 裁员事件）
3. **`lieflat` 摆烂**：① 第30天家人电话施压（道德分/心情冲突） ② 第60天朋友圈晒成功（嫉妒 vs 释然，写入 `_returnedHometown` or 决定是否触发归园田居缎带）

**接线**：

- `index.html` 新增 `<script src="js/data/crisis35_followups.js"></script>`，位置紧跟 `moral_events.js` 之后
- 文件本身在末尾 IIFE：
  ```js
  if (typeof window !== "undefined" && window.RANDOM_EVENTS) {
    Array.prototype.push.apply(window.RANDOM_EVENTS, CRISIS35_FOLLOWUPS);
  }
  ```
- 在 `review_improvements.js::check35Crisis()` 内 3 路径写 flag 时**追加一行** `s.flags._crisis35Day = s.day;` 作为 30/60 计时起点（≤3 行 patch）

**验证 grep**：`c35_exam_first_try | c35_career_overtime | c35_lieflat_family_call` 应在 dist 中各命中

---

### T2 · 体检异常 → 二阶事件链（关联度 #1）

**目标**：补完 `_healthCheckAlert` 的下游。

**位置**：在新模块 `src/js/core/review_improvements_v2.js` 中（或追加到现有 `review_improvements.js` 末尾，但**不要超出文件原有 +120 行**）

**事件 2 条**（含选择）：

- `wt_recheck_diagnosis`：触发条件 `_healthCheckAlert >= 1 && (state.day - lastTrigger) in [7,21]`，3 选项：①去三甲复查（¥800，60% 确诊一种慢性病并加入 `state.diseases`，40% 虚惊）②忽视（30% 30 天后剧情线触发"晚期"）③偏方（¥200 玄学，幸福+5 道德-1）
- `wt_chronic_disease_lifestyle`：复查确诊后 7 天，提供"调整生活方式（疲劳上限-5 但每日健康+1）" vs "继续 996"二选一

**接线**：在 `daily_pipeline.js` 的 `review_improvements_tick` 步骤中调用（≤3 行）

**验证 grep**：`wt_recheck_diagnosis | wt_chronic_disease_lifestyle`

---

### T3 · 坏账后续 + 好心回报（关联度 #2，对称设计）

**目标**：闭合 `_badDebtAmount` / `_goodLoanReturn`。

**追加到 `crisis35_followups.js` 末尾的同一 IIFE 数组**（共用文件，省一次 script 注册）：

- `bad_debt_chase`：`_badDebtAmount > 0 && day_offset 14~30`，"亲戚消失了"事件 — 选 ①请律师催债（¥500，30% 拿回 50%）②自认倒霉（道德分+2 因为没动用司法）③朋友圈骂街（名气-10 道德-3）
- `good_loan_return`：`_goodLoanReturn > 0 && day_offset 30~60`，"听说你大义气"事件 — 自动结算 NPC 平均好感+5 + 30% 概率介绍一份**临时高薪工作**（随机生成 1 次性 ¥800~¥2000 任务），消耗 flag

**验证 grep**：`bad_debt_chase | good_loan_return`

---

### T4 · 道德事件 4 条 followup 缺口（关联度 #3）

**目标**：把 `moral_events.js` 中 4 个**高频但无 followup** 的 flag 接上（不要重写已有 followup 已在的）。

**先 grep 找出 4 个**：

```bash
grep -n "flag:" src/js/data/moral_events.js | head -40
# 与现有 followup 节（一般在文件下半部分的对象字面量）对比，找出 4 个没有同名 key 的
```

**追加到 `moral_events.js` 末尾的 followup 对象内**（不超过 +120 行）

**选 4 个原则**：触发率高（街头阶段就能遇到）+ 道德分跨度大（+/-≥2）

**验证 grep**：你新加的 4 个 followup id 在 dist 中命中

---

### T5 · 主菜单"传承商店"入口（50h 留存钩子）

**目标**：把 `heritage_coin.js` 的 6 项红/绿互斥永久解锁暴露给玩家。

**实现**（≤80 行 patch 跨 3 文件）：

- `src/js/ui/modal.js`：在 `showNewGameModal()` / 新游戏起步弹窗中，新增一个"🏛 传承商店"按钮，点开调用 `showHeritageStore()`
- 新文件 `src/js/ui/heritage_store.js`（≤180 行）：渲染 6 项卡片（图标 / 名称 / 描述 / 解锁成本 / 已解锁 ✓ / 红绿互斥提示），从 `localStorage.__heritageCoins` 读余额，点"解锁"扣币写入 `localStorage.__heritageUnlocks`
- `index.html` 注册新 script

**6 项参考**（已在 `heritage_coin.js` 中定义，**直接读不要新定义**）

**验证 grep**：`showHeritageStore | __heritageUnlocks`

---

### T6 · Wiki "前世记忆" 页（关联度 #4 — NG+ 显化）

**目标**：让玩家在百科里看见上一周目留下了什么（不只是 modal 一瞬间）。

**实现**（≤60 行 patch）：

- 在 `src/js/data/narratives_registry.js` 末尾追加：
  ```js
  if (typeof window !== "undefined") {
    window.NARRATIVES = window.NARRATIVES || {};
    NARRATIVES.past_life = {
      id: "past_life",
      name: "前世记忆",
      icon: "🕯",
      brief: "上一周目你留下的痕迹...",
      version: "v3.3",
      sections: [
        /* dynamic via () => functions */
      ],
    };
  }
  ```
- 渲染时通过 `() => { ... }` 函数动态从 `inheritance_chain.js` 读 `inheritCrisisPath / inheritMoralScore / inheritPeakAffinity` + 已解锁 ribbons + heritage coins，组合 3~5 段中文叙事

**验证 grep**：`past_life | 前世记忆`

---

## 4. 收尾步骤（你必须做）

按顺序：

1. 全部 6 个任务完成后**一次性** `python build.py`
2. 在 `src/DEVELOPMENT.md` **顶部**插入新段（紧贴现有 v3.2 段之上）：

   ```markdown
   ## 2026-06-24 — v3.3 Wave-1 关联度闭合（GLM-5.2 / 游戏设计师）

   执行 SOP：memory/review-improve-v3.0.md（v3.0 审查改进）

   - T1 35 岁三路径延伸 — `crisis35_followups.js` 新建（~200 行，6 事件）
   - T2 体检异常二阶 — `review_improvements.js` +N 行（2 事件）
   - T3 坏账/好心回报 — `crisis35_followups.js` 末尾追加（2 事件）
   - T4 道德 followup 补 4 — `moral_events.js` +N 行
   - T5 传承商店入口 — `heritage_store.js` 新建 + modal.js 接线
   - T6 前世记忆 wiki — `narratives_registry.js` +追加

   构建：dist/index.html = XXXX.X KB
   ```

3. `git add -A && git commit -m "v3.3 Wave-1: 关联度闭合（35岁链/体检/坏账/道德/传承UI/前世wiki）"`（**不 push**）

## 5. 最终汇报格式（**严格遵守，≤30 行**）

```
v3.3 Wave-1 COMPLETE
T1 ✅ crisis35_followups.js: 220 行, grep c35_exam_first_try ✓
T2 ✅ review_improvements.js: +85 行, grep wt_recheck_diagnosis ✓
T3 ✅ crisis35_followups.js +追加, grep bad_debt_chase ✓
T4 ✅ moral_events.js: +<id1>,<id2>,<id3>,<id4>, grep ✓
T5 ✅ heritage_store.js: 170 行 + modal.js +12行, grep showHeritageStore ✓
T6 ✅ narratives_registry.js: +30 行, grep past_life ✓
BUILD: dist/index.html = XXXX.X KB
COMMIT: <hash> v3.3 Wave-1: 关联度闭合
RISKS: <列任何遗留/绕过/降级，没有就写"无">
NEXT: 等待 Wave-2 BRIEF
```

如果任何任务卡住超过 4 turns，写下 RISK 并跳过，不要硬刚。

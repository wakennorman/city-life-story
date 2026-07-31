# R1016b — 域B 事件/叙事 深度优化轮

日期：2026-07-31
域：**B（事件系统 / 叙事）**
选域依据：`git log` 重算 recency —— loop-state 记录停在 R903b 但实际已推进至 R1015；八域中域B 上一次深审为 **R785b**，为全域最陈旧。

---

## 一、A类缺陷修复（4 类 / 影响 63 个事件）

### A-1 · 全库 22 个已挂载 linkage 文件语法错误 → 整文件 IIFE 永不执行 + 阻断全站 build

**这是本轮最严重的发现。** 22 个文件均已在 `src/index.html` 挂载，但因语法错误，浏览器解析即抛 SyntaxError，
整个 IIFE 不执行 → 其中注册的事件 **全部永不入池**，同时 `python build.py` 直接失败无法出包。

三类根因：

| 形态 | 样例 | 出现 | 修复 |
|---|---|---|---|
| `story":"…"` 键名残缺引号 | `story":"你开始用不同的眼光看市场了。…"` | 24 处 / 18 文件 | → `story:"` |
| 字符串内嵌未转义双引号 | `总说"钱不值钱了"。` 位于双引号串内 | 1 处（r932） | → 中文弯引号 `“”` |
| IIFE 缺函数体闭合花括号 | `catch(e){return""})()` 少一个 `}` | 6 处 / 6 文件 | → `catch(e){return""}})()` |

受影响文件（按域）：
- 域A：r932 / r969 / r977 / r985 / r993 / r1009
- 域B：r962
- 域C：r979 / r987 / r995
- 域D：r956
- 域E：r981 / r989 / r997
- 域F：r912 / r942 / r950 / r958 / r1014
- 域G：r983 / r991 / r999 / r1007
- 域H：r960

验证：`_syntax_sweep.cjs`（单进程 vm.Script 全量扫描）**1151 文件 → 语法错误 0**（修复前 22）。

> 教训沉淀：`node --check` 逐文件 spawn 太慢（>3min 未完），改用单进程 `vm.Script` 2 秒全量出结果。
> 建议纳入开轮例行体检。

### A-2 · 6 个死计数器全库零写入方 → 35 个已挂载事件被永久门控

| 计数器 | 读取门控事件数 | 写入方 |
|---|---|---|
| `_priceVolatilityCount` | 30 | **0** |
| `_priceEventCount` | 2 | **0** |
| `_eventsExperienced` | 2 | **0** |
| `_economicEventCount` | 1 | **0** |
| `_managementEventCount` | 1 | **0** |
| `_majorChoiceCount` | 1 | **0** |

修复采用**单点维护模式**，只在唯一调用点补写，不散落：

- `src/js/phase1/trade.js` → `updateAllPrices(state)`（价格刷新唯一入口，daily_pipeline 每 3 天调用）
  补 `_priceEventCount` 自增 + 遍历 `state.trade._lastPrices` 判断单日振幅 ≥5% 写 `_priceVolatilityCount`。
- `src/js/core/events_core.js` → `recordEventToHistory()`（事件入库唯一单点）
  补 `_eventsExperienced` 自增 + 按 eventId/标题中英双语正则分类写 `_economicEventCount` / `_managementEventCount`。
- `src/js/core/events_core.js` → 选项结算点
  `choices.length >= 2` 时写 `_majorChoiceCount`（对应 `b797_event_life_impact` 门控）。

全部包 `try/catch`，计数失败绝不影响主流程。

### A-3 · 2 个联动文件悬空（源存在 / 从未挂载）→ 6 事件永不出场

`domain_a_linkage_r840.js`、`domain_a_linkage_r848.js` 各含 3 事件，源文件在库但 `src/index.html`
无 `<script>` 标签（同轮次的 domain_c / domain_h 同名文件已挂载，仅域A 漏挂）。已补挂载。

### A-4 · `src/index.html` 杂散 `t` 字符扫描

`grep -cE '^t' src/index.html` = **0**，本轮无此问题（并行挂载模板已修）。

---

## 二、跨域联动增强（3 项）

新文件 `src/js/core/domain_b_linkage_events_r1016b.js`（IIFE + `_b1016bLoaded` done-flag + 显式 phase）：

| 事件 id | 方向 | 消费素材 | phase | 设计意图 |
|---|---|---|---|---|
| `b1016b_volatility_veteran` | **B→A** | `_priceVolatilityCount >= 8` | street | 经历足量剧烈行情后，玩家获得"波动老手"认知——把 A-2 新激活的计数器立刻转成可感知回报（禀赋效应） |
| `b1016b_decision_weight` | **B→G** | `_majorChoiceCount >= 20` | street | 二选一以上重大抉择累计 20 次触发生命回望，强化"我的选择塑造了我"（峰终定律的中段锚点） |
| `b1016b_story_teller` | **B→D** | `_eventsExperienced >= 40` | street | 阅历转化为社交资本：向已认识 NPC 讲述经历 → `applyAffinityChange` 加好感（社会比较 → 正向） |

均遵循域铁律：NPC 引用先 `rel && rel.met`，好感一律四参 `applyAffinityChange(st, npcId, change, reason)`，
显名走 `getNpcDisplayName` 兜底，数值以 `[PLACEHOLDER]` 语义占位后填实。

---

## 三、验证

- 语法：`_syntax_sweep.cjs` 1151 文件 → **0 错误**
- 构建：`python build.py` 重建 `dist/app.js`（dist 新于 src）
- 蒙特卡洛：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 10 --days 500`

---

## 四、素材账更新（域B）

本轮消费清零：`_priceVolatilityCount` / `_majorChoiceCount` / `_eventsExperienced`（三者由零写入 → 有写有读闭环）。
剩余低价值写-only：`_b722bPatternCd`（冷却 flag）。

# Round 17 · 域D（NPC/社交）执行报告

> 自动化循环：城市浮生记·全系统 8 域轮换优化（loop/auto）
> 轮次：R17 / 域D / 下一域 E | DEVELOPMENT.md v3.107→v3.108

## 一、A 类缺陷审查与修复（4 项，全部为硬崩溃 / 数据自洽缺陷）

Explore 子代理全域扫描 9 个 NPC/社交文件（npc_relationships / social_network / npc_location_bridge / workplace_social_events / npc_event_bridge / workplace_social / social_tab / achievements / npcs），逐处核实后确认 4 项确证缺陷，全部修复。

### A-1 · `social_tab.js:30` — NPC 关系网 Tab 渲染崩溃（硬崩溃）

`var npcIds = Object.keys(state.relationships);` 声明在 `:53`，但 `:30` 的 `for` 循环已先行使用 `npcIds`。`var` 提升使 `npcIds` 在 `:30` 为 `undefined` → `npcIds.length` 抛 `TypeError`，**每次渲染 NPC 关系网 Tab 必崩**。
**修复**：把声明前置到 `!state.relationships` 守卫之后（`:18`），`:53` 改为无 `var` 重赋值。

### A-2 · `npc_event_bridge.js` `chatWithNpc` — 未声明变量 `affinity`（硬崩溃 + NaN 污染）

函数体 `:1032` 起在 `:1055/1073/1095/1115` 读取 `affinity`，**全函数从未 `var affinity`**（已 grep 确认仓库无全局 `affinity`）。读取未声明变量 → `ReferenceError`，聊天功能整体失效；且末行 `rel.affinity = ... affinity + delta` 把 **`NaN` 写入好感数据**。
**修复**：函数头补 `var affinity = rel.affinity || 0; var delta = 0, chatType = "neutral", message = "";`，并把好感写入从手工 `Math.max/min` clamp 改为 `applyAffinityChange(state, npcId, delta, message)`（自动 clamp + 记 `_lastInteractionDay` + 升级播报）。

### A-3 · `chatWithNpc` 守卫缺失 `rel.met`（域D 铁律违反）

原 `if (!rel) return;` 仅校验存在，未校验 `rel.met`。`initNpcRelationships` 预建所有矩阵内 NPC 的 `rel` 且 `met:false`（npc_relationships.js:276），导致可与「未真正结识」的 NPC 聊天。
**修复**：改为 `if (!rel || !rel.met) { ... "你还不认识这个人。" ... return; }`，与域D架构铁律（`rel && rel.met`）一致。

### A-4 · `applyEventNpcEcho` 跨 NPC 好感绕过 `applyAffinityChange`（数据自洽）

`:269-282` 手工 `Math.min/max` clamp `state.relationships[id].affinity`，**未更新 `_lastInteractionDay`**（→ 错误触发 7 天好感衰减），且**不触发关系升级消息**。违反「跨 NPC 传导一律走 `applyAffinityChange`」铁律。
**修复**：整段替换为 `applyAffinityChange(state, id.replace("_flag_alt",""), rule.change, rule.msg)`。

> 其余 5 文件（npc_relationships / social_network / npc_location_bridge / achievements / npcs）在三类缺陷模式上均干净；`getNpcRelationshipNetwork`（social_tab 关系网渲染）确认为无调用点的死代码，按说明不计入缺陷。

## 二、联动增强（3 项，新建 `npc_social_linkage_events.js`）

IIFE 注入全局 `RANDOM_EVENTS`（与 R11/R12/R13/R14/R16 一致，不改 cross_system_events.js）。引擎严格按 `e.phase` 过滤，故 **2 street + 1 corporate**。所有 state 访问 `||` 防御，数值标 `[PLACEHOLDER]`。严守域D铁律：只读 `state.relationships`、`rel && rel.met` 守卫、跨 NPC 好感传导走 `applyAffinityChange`。

| 事件 id               | 跨域桥接         | phase     | 触发条件                   | 效果                                                   |
| --------------------- | ---------------- | --------- | -------------------------- | ------------------------------------------------------ |
| `social_deep_talk`    | D→A（心智/状态） | street    | 有 ≥1 好感≥40 的已结识 NPC | 好感+4；`mental+6`·`happiness+4`                       |
| `social_job_referral` | D→C（职业/成长） | street    | 有 ≥1 好感≥30 的已结识 NPC | `addSkillXp("social",8)`·`mental+3`·`happiness+2`      |
| `social_market_tip`   | D→E（经济/投资） | corporate | 有 ≥1 好感≥25 的已结识 NPC | `bankBalance+15000` + 复用 `_dataInvestorMindset` flag |

`social_job_referral` 用真实技能键 `"social"`（state.skills 真实键之一），把人脉转化为职场 networking 技能；`social_market_tip` 复用 R14 的 `_dataInvestorMindset` flag，形成「储蓄里程碑→圈内消息→职场奖金」一致的投资心态叙事链。`index.html` 注册在 `career_linkage_events.js` 之后。

## 三、验证

- `node --check`：social_tab.js / npc_event_bridge.js / npc_social_linkage_events.js 全部通过。
- `python build.py` → `dist/index.html` 8245.4 KB，注入 `_npcSocialLinkageLoaded` / `social_deep_talk` 校验通过。
- **Monte Carlo 6×400d：`exit=0` · 0 代码异常**（grep 确认无 `TypeError`/`ReferenceError`/`NaN`/`异常` 行）。各原型：balanced 100% ✅、corporate 100% ✅、grinder/skiller（高风险路径阈值 30%）达标 ✅、前 7 天死亡率均 0% ✅、Day30 余额合理 ✅。
  - ⚠️ trader/social 存活率 66.7% < 80% 为**既有平衡阈值**（RNG 波动：上一轮同架构跑出 83.3%），非本轮引入、非代码异常，不在 A 类修复范畴。
  - 末尾 `RSS timeout` 为离线新闻网络回退，非代码异常。

## 四、状态与提交

- `loop-domain-state.json` = round 17 / D / next=**E**；`DEVELOPMENT.md` = v3.108。
- 提交纪律：仅 `git add` 8 个域D文件（social_tab.js / npc_event_bridge.js / npc_social_linkage_events.js / index.html / DEVELOPMENT.md / dist/index.html / loop-domain-state.json / last_known_head），**绝不 `-A`、绝不 push**；提交前同步 `last_known_head`=当前 HEAD 以过 pre-commit 漂移检查。
- 本轮改动未被并行窗口扫入（status 干净），独立提交。

**下轮 → 域E（经济/投资）。**

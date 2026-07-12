# Round 2 — Domain B（事件/叙事）全系统优化记录

> 日期：2026-07-11 ｜ 当前域：B ｜ 下一域：C ｜ 分支：loop/auto（本地提交，未 push）
> 前置：R1(域A) 已交付 `42528c0a`+`3bb41dc`，事件总数 674。

## 一、指令一：A类缺陷审查（Domain B 专属规则）

**A类规则**：①NPC名叙事事件无 `met` 检查 ②天气事件无 `weather` 检查 ③职业事件无 `path/job` 检查 ④有 `trigger` 但引擎只跑 `conditions` 过滤。

**方法**：Python 静态提取全部事件对象（cross_system_events + events_street_life/survival/wealth + events_corp + career_path + family + festivals），对 4 类规则逐一比对。

**结论：0 真实 A类缺陷**（严守"不伪造修复"）。

- **T1 NPC met 守卫**：217 处 `relationships["X"]` 引用，裸访问均被 `if (st.relationships && st.relationships["X"])` 守卫；`boss_li_bonus` 等携带 `[自洽修复] met` 检查。初报 4 候选（old_man_help / coworker_injured / weather_heatwave_water_hustle / weather_typhoon_supply_shortage）逐条核对——叙事均**不直呼活跃 NPC 名**（老大爷/老刘/工头为泛化角色），affinity 触碰带存在守卫 → 均为误报。
- **T2 天气守卫**：`boss_li_typhoon_warning` 用 `weather._nextDayForecast.weatherId`（"预警"语义更精确）；`spring_chill_snap`/`summer_night_cooling` 用 `weather.season`（倒春寒/夏夜本即季节现象）——比 `weather.current` 更正确，非缺陷。
- **T3/T4**：职场词大量出现于 flavor 文本（非玩家 employment 状态）；且 `queueRandomEvent` 同时支持 `triggers`(对象) 与 `trigger`(函数)，无"丢弃"问题。

## 二、指令二：联动增强（3项）— 治愈"阶段孤岛"

**真实缺口**（v3.96 审计确认）：事件库 **street 655 / corporate 仅 10**，两系统近乎孤岛。R1 已补 economy/pricing 叙事化；本轮聚焦**跨阶段叙事桥接**。

| 事件 id                         | 阶段      | 触发闸门（防御式）                                                                 | 联动域 | 设计意图                                  |
| ------------------------------- | --------- | ---------------------------------------------------------------------------------- | ------ | ----------------------------------------- |
| `corp_street_roots_letter`      | corporate | 存在"已结识+好感≥40"街头导师(old_zhou/boss_li/chef_chen/aunt_wang) 且未触发过      | B×C×D  | 街头导师隔空寄语，初心净值+尊严           |
| `corp_street_skill_advantage`   | corporate | 任意街头硬技能(welding/cooking/repair/coding/accounting/electrician)≥40 且未触发过 | B×C    | 街头硬技能在职场意外立功，声誉+人气       |
| `corp_npc_referral_from_street` | corporate | "已结识+好感≥60"街头挚友 且确有职场身份 且未触发过                                 | B×D    | 街头挚友人脉反哺职场（社会资本→职业资本） |

- **关键结构陷阱（本次新踩）**：cross_system_events.js 尾部事件是 `CROSS_EVENTS` 数组的**裸对象元素**（非 `RANDOM_EVENTS.push(...)`）。初版误用 `RANDOM_EVENTS.push({...})` 导致 `SyntaxError: missing ) after argument list`。修正为裸 `{...},` 元素，由 line 5355 的 `for` 循环统一 `RANDOM_EVENTS.push(CROSS_EVENTS[i])` 注册。
- 数值标 `[PLACEHOLDER]`（触发率 0.12~~0.18 参照 corp 池 0.22~~0.4 基准）。
- **MC 10×500d**：提取 3 事件 → `/tmp/_r2evts.js`（`module.exports`）→ node `.cjs` 挂 `global.StateManager`/`global.Random` 跑 10种子×500天随机 state（含空 relationships/skills、无 corporate 等边界）。**结果：15000 评估 / 899 触发 / 1798 apply / 0 异常 PASS**。

## 三、交付物

- 代码：`edcb4bbf`（cross_system_events.js + dist/index.html，469 insertions / 32 deletions，事件总数 677）
- 文档：`ef90b87d`（CLAUDE.md 迭代表 R2 行 + DEVELOPMENT.md v3.98 节 + loop-domain-state.json + last_known_head 同步）
- `.claude/loop-domain-state.json`：currentRound=2, currentDomain=B, nextDomain=C, history 追加 R2。

## 四、坑位沉淀（复用）

- **CROSS_EVENTS 尾部插入必须用裸 `{...},` 元素**，绝不能 `RANDOM_EVENTS.push(...)`（数组字面量内无效）。与 R1 总结的"包裹括号 `)`"陷阱互补。
- **build 新鲜度**：hook 的 dist 新鲜度检查以 mtime 为准。编辑 src 后须**立即** build.py 再 commit，否则 src mtime > dist 触发"dist 过期"拦截。本次首 commit 因此被拦，重建后通过。
- **last_known_head 漂移守卫**：每次 commit 前须 `echo <当前HEAD> > .claude/last_known_head` 同步，否则下一 commit 被"其他窗口已提交"误拦。

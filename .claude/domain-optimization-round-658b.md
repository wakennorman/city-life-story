# R658b 域B（事件/叙事）优化记录 — 2026-07-28（本窗口，避让并行R658/R659）

## 开轮环境（竞态实录）
- git log 实测 recency：A=657/H=656/G=655/F=654/E=653/D=652/C=651/**B=650 最薄弱** → 本轮域B。
- 并行窗口极速在途：开轮时 `domain_b_linkage_r658.js` 为悬空半成品源（含中文引号嵌套 SyntaxError L97/L142，未提交未挂载）；本轮执行中并行自行修好并提交 b0d1964b（R651+R658），随后 `reset --hard` 冲掉本窗口已落盘的 news.js 修复。
- **新竞态形态：staged 接管**——并行窗口把本窗口重做前的 news.js A类修复（effBonusB658）与 dist 重建直接 `git add` 进它的 staging 区。核验 staged diff 含本窗口修复内容（IDENTICAL），按纪律闭合不重做。
- 并行另有在途 `domain_c_linkage_r659.js`（untracked 未挂载）——不碰，build 不含它。

## A类修复（1处，经并行staged接管落库）
| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/data/news.js:452 | good_sleep 事件选项 hint 承诺"效率加倍"，但 `_goodSleepToday` 全库唯一引用即写入点（零读者零兑现），且"今日"语义 flag 永不重置 | 保留兼容 flag + 新增 `_goodSleepDay=当日`（可判过期）+ 就地兑现：有工作时效率奖金 ¥30-80（Random.int）并计入 totalEarned，无工作走状态叙事分支 | A |

CRLF 坑复用 R599 教训：news.js 为 CRLF/LF 混合，用 Python `newline=''` 精准替换，diff 收敛至 23 行。

## 联动增强（3项，domain_b_linkage_r658b.js，均 street/repeatable:false/done-flag 防重）
| 事件 | 联动 | 素材 | 设计意图 |
|---|---|---|---|
| b658b_bulk_channel | B→E | `_bulkSupplier`（events_street_survival.js:3194 写-only死flag）首消费 | integrity_reward 承诺的"长期供货合作"真实兑现：渠道差价收益/介绍摊友攒人情，诚信→经济闭环 |
| b658b_liu_crew_callback | B→C | `_liuPartner`（:3400 写-only死flag）首消费 | 老刘"入伙"承诺兑现：工地技术活收入+repair技能XP15（真实键），叙事→职业闭环 |
| b658b_volunteer_echo | B→D | `_communityNetwork`（:3696 写-only死flag）首消费 | 志愿网络接入兑现：met NPC 好感+2（rel&&rel.met+applyAffinityChange 铁律，封顶4人），叙事→社交闭环 |

## 验证
- node --check：domain_b_linkage_r658b.js / news.js（staged版）通过；并行 r658.js HEAD 版工作区实测通过（早期 SyntaxError 已被并行自修）。
- build.py：dist/app.js 12006.1KB，b658b_=6、b658_/_goodSleepDay=9 全部入包。
- MC：见提交信息（10×500 或回退 6×400）。

## 素材账更新
- 域B events_street_survival 写-only flag 剩余：`_gratitudeLetterSent`（Phase1→2过渡感谢信，适合 B→H 跨阶段继承，留下轮）。
- `_goodSleepDay` 新增后可供未来"当日效率"机制读取（当前就地兑现已闭环）。

## 下轮
- git log 重算 recency；并行在途 R659 域C，若其落库则 C 不再薄弱。预计 D(652) 或依实测。

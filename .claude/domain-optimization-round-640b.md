# 域优化轮次 R640b — 域H (Phase2/公司)

> 执行窗口：自动化窗口 2026-07-28 15:0x ｜ 并行窗口同时在跑同轮号 R640 域H（其 r640.js 挂载先行、源在途），本窗口按纪律避让改用 **R640b** 后缀。

## 选域依据
git log 重算 recency（勿信 loop-state）：A=633/B=634/C=635/D=636/E=637/F=638/G=639/H=632 → 域H 最薄弱。

## A类修复清单

| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/index.html | **正向孤儿×4**：domain_h_linkage_r592/r601/r602/r623.js 源已提交（r592/r601 由 R586 提交）但从未挂载 index.html → **12个死事件**（h592_/h601_/h602_/h623_ 前缀 dist grep=0） | 挂载 r601/r602/r623（复活9事件）；r592 与 r601 内容 IDENTICAL（diff 仅轮号差异，并行重复生成）→ 不挂载 r592，避免双份近似事件 | A |
| （审计通过项） | startup_events.js effect 键全集 {cashReserve,reputation,marketScore,technologyScore,revenue} 全在 STARTUP_FIELD_MAP 白名单；域H 全文件 addSkillXp 假键=0；死字段黑名单=0；4孤儿文件字段核验全真实（conditions复数/phase显式/防御齐全） | 无需修复，诚实报告 | — |
| （B类记录） | r602/f631 写入 company.morale、r602 写入 company.efficiency，startup.js 无消费者（||兜底不崩溃） | morale 由本轮联动1消费闭环；efficiency 仍无读者，留待后轮 | B |

## 联动增强清单（domain_h_linkage_r640b.js，3项）

| 事件 | 联动 | 设计意图 |
|---|---|---|
| h640b_morale_dividend 士气红利 | H→G | **morale 字段闭环首读**（r602团建/f631庆祝只写不读→本事件 morale≥70 触发红利抉择：冲刺换技术分+营收 vs 放假保士气） |
| h640b_runway_alarm 跑道警报 | H→A | burnRate/cashReserve **事件层首引**：runway<2月触发三难（砍开支/自掏腰包/硬扛），isFinite+>0 除数守卫 |
| h640b_board_trust_dinner 董事晚宴 | H→D | P1-6 董事会系统（boardMembers/shareholderTrust/shareholderSatisfaction）**事件层首引**：Array.isArray 守卫，中国式饭局叙事 |

全部 typeof number 检查后才写 morale/trust 等惰性字段；maxRepeats+excludeFlags 双保险。

## 验证
- node --check：r640b + 4孤儿文件全过
- build：dist/app.js 12117.8KB，h640b_/h601_/h602_/h623_ 各 6 命中
- MC 6×400d：见提交信息（0 代码异常）

## 遗留风险（下轮注意）
- 并行窗口 index.html:1473 挂载 `domain_h_linkage_r640.js` 但源文件尚未落盘（挂载先行在途）。若并行最终未提交源→变逆向悬空，需按 R590 模式清理。
- company.efficiency 仍零消费；boardPressureLevel/mediaRelations/sentimentScore 大系统仍事件层零引用（富矿）。

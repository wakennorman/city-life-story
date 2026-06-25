# 城市浮生记 v3.0 审查改进与扩展：问题诊断

更新时间：2026-06-25

人生节点触发后只写入 `_pendingLifeNode`，全项目没有 UI 消费；且触发时先标记 done，玩家无法选择，节点效果不会执行 | 人生节点系统 | P0 | `life_nodes.js` 只在 `checkLifeNodes` 设置待处理，搜索仅 `daily_pipeline.js` 调用检查，无弹窗/消费逻辑，核心节点体验静默断裂
人生节点效果写错状态结构：把 `state.skills.intelligence/programming/charm` 当数字写入，但实际技能是 `{level,xp}` 对象且编码技能叫 `coding` | 人生节点系统 | P0 | `state.js` 中技能结构为对象；`life_nodes.js` 的 `applyNodeChoice` 会污染技能字段或写入不存在字段
旅行系统无玩家入口，且 `startTravel` 使用不存在的 `state.ap` 判断/扣除行动力 | 旅行系统 | P0 | 全项目只有 `travel.js` 定义 `startTravel`，没有调用者；真实 AP 字段是 `state.player.actionPoints`，当前即使接入口也会误判行动力不足
法律系统只有数据层和 `fileLawsuit/tickLegal`，没有任何 UI 或行动入口 | 法律系统 | P1 | 搜索仅 `legal.js` 自身使用 `state.legal/fileLawsuit`，玩家无法提起案件，诉讼系统无法自然进入
医疗深度模块与既有疾病治疗链路分离，医保/住院/康复信息没有玩家入口 | 医疗系统 | P1 | 旧 `illness.js/openClinicModal` 可看病，但 `buyMedicalInsurance/startTreatment` 只在 `medical.js` 内部定义，未接入医院行动或 UI
行动页 Phase 2 深度交互按钮跳转到未注册 Tab：`family` 与 `workplace_social` | UI/体验 | P1 | `render.js` 按钮调用 `switchTab('family')`/`switchTab('workplace_social')`，但 `TAB_RENDERERS` 与 `index.html` 只注册 `social`，点击后显示“开发中”
项目自带审计脚本仍读取旧事件文件路径，无法运行 | 工具链/代码质量 | P1 | `audit_connections.js` 查找 `src/js/core/events.js`，`audit_events.js` 查找 `js/core/events.js`；事件已拆成 `events_core/street/corp`
旅行系统注释写明“旅行期间暂停日常管线”，但 `daily_pipeline.js` 仍会完整执行日常需求、工作、事件等 | 旅行系统 | P2 | 当前旅行 tick 只是倒计时和随机事件，没有全局短路；若开放入口，旅行期间仍像正常在城里生活
主渲染、主入口、街头事件、创业系统仍是超大文件，继续扩展时全局耦合风险高 | 架构 | P2 | `render.js` 6024 行、`main.js` 4148 行、`events_street.js` 9827 行、`startup.js` 14277 行，SOP 已将拆分列为已知缺陷
状态文档口径不一致：`CLAUDE.md` 接力清单仍保留部分已完成项，`IMPLEMENTATION_PROGRESS.md` 显示已全部完成 | 文档/交接 | P2 | 后续 Agent 可能按过期清单重复实现，需要收工时统一当前状态

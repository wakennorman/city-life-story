# 城市浮生记 v3.0 审查改进与扩展：改进方案

更新时间：2026-06-25

人生节点触发后静默完成且没有选择 UI | `src/js/core/life_nodes.js` | 调整 `checkLifeNodes`：触发时写 pending 而不是 done；新增 `showLifeNodeModal` 用现有 `showModal` 展示选项；玩家选择后调用 `applyNodeChoice` 并清 pending/标记 done；不改 script 顺序 | 70-100 行 | 人生节点从后台标记变成玩家可见、可选择、可产生后果的核心事件
人生节点效果写错技能/属性结构 | `src/js/core/life_nodes.js` | 在同一改动中修正 `applyNodeChoice`：智力/颜值写 `state.player`，技能奖励通过 `addSkillXp` 或安全 fallback 写入 `{level,xp}`；`programming` 改为 `coding` | 20-35 行 | 避免污染技能对象，节点奖励能被现有技能 UI/成长逻辑识别
旅行系统无入口且 AP 字段错误 | `src/js/core/travel.js`、`src/js/phase1/actions_extra.js` | `startTravel` 改用 `state.player.actionPoints`；新增 `showTravelAgencyModal` 展示 5 个目的地并调用 `startTravel`；在商业区注入“长途旅行”行动入口 | 80-120 行 | 玩家能从城市行动流进入国内旅行，旅行费用/AP/纪念品链路可实际运转
法律系统没有玩家入口 | `src/js/core/legal.js`、`src/js/phase1/actions_extra.js` | 新增 `showLegalOfficeModal`，展示案件类型、律师档位、当前案件状态；在政府办事大厅注入“法律咨询/立案”行动入口，调用 `fileLawsuit` | 90-130 行 | 个人法律系统从后台 tick 变成可主动使用的诉讼玩法
医保/医疗深度无入口 | `src/js/core/medical.js`、`src/js/phase1/actions_extra.js` | 新增 `showMedicalInsuranceModal` 展示医保档位、当前治疗/康复摘要；医院行动列表补“医保咨询”入口，调用 `buyMedicalInsurance` | 60-90 行 | 医疗深度至少暴露保险和康复状态，不和旧看病弹窗冲突
行动页 Phase 2 按钮跳到未注册 Tab | `src/js/ui/render.js` | 把“职场社交/家庭”按钮改为设置 `state._socialSubTab` 后 `switchTab('social')`；个人成长继续 `switchTab('personal_growth')` | 10-20 行 | 用户点击入口后进入真实页面，不再看到“开发中”
审计脚本读取旧事件路径导致不可用 | `audit_connections.js`、`audit_events.js` | 增加事件聚合读取：合并 `src/js/core/events_core.js`、`events_street.js`、`events_corp.js`；`audit_events.js` 改用 `src/js/core/*` 路径 | 25-45 行 | 恢复内容连接/事件上下文审计能力，后续验证不再卡在旧文件路径

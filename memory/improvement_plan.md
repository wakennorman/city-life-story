# 2026-06-26 改进方案（第三轮 — P0/P1 可执行）

CSS 媒体查询结构修复 | `src/css/style.css` | CSS/移动端 | 删除 3907 行提前闭合的 `}` 或将 3909-3932 行投资持仓规则整体移回现有 `@media (max-width:480px)` 内，并删除 3933 行多余 `}`；保持手机端 CSS 只在文件末尾媒体查询追加/整理，不改桌面段 | ~5行 | 恢复 CSS 结构，避免构建或浏览器解析异常 | ≤480px 投资持仓防护真正只在手机端生效，无横向溢出
人生事务开发术语收口 | `src/js/ui/render.js`, `src/js/app_bridge/webapp_runtime_bridge.js` | legacy UI + bridge | 将“Web App 桥接/新架构/bridge”等玩家可见文案改为“城市公共服务/城市服务中心/跨部门服务”；保留内部函数名不改 | ~8行 | 正式入口不再暴露技术术语 | 纯文案，无布局风险
城市服务按钮灰显与条件提示 | `src/js/app_bridge/webapp_runtime_bridge.js` | bridge 桥接层 | 在 `showCityServiceModal()` 渲染每个服务时调用 `canPay(state, action)`，卡片显示费用、行动力和不足原因；buttons 中不足项使用非主按钮样式，callback 只提示原因并 `return false`，可用项保持原逻辑 | ~35行 | 玩家打开弹窗即可知道缺现金还是行动力，减少误点 | 按钮继续走 `modal.js`，不自建容器；文字换行自适应
医疗面板补“治疗/医保”双入口 | `src/js/core/medical.js`, `src/js/ui/render.js` | legacy 扩展系统 + UI | 新增 `showMedicalTreatmentModal()`：列出当前疾病或按 `state.status.sick/injured` 兜底给出轻症/中症/重症治疗按钮，调用既有 `startTreatment(state, grade)`；`_renderMedicalPanel()` 按钮组改为“就医治疗”和“医保咨询” | ~70行 | 生病时从人生事务能直接治疗，不再只有买保险入口 | 按钮组 flex-wrap，≤480px 单列或换行，触控高 44px
TS 内容目录首个事件 bridge | `src/js/app_bridge/webapp_runtime_bridge.js`, 可选 `src/index.html` 仅末尾追加但本方案不需要 | bridge 桥接层 | 在 bridge 中新增小型 `WEBAPP_TYPED_EVENTS`（从 TS events 选 3-5 条手工同步，不引入构建依赖），提供 `registerTypedEventBridge()` 在脚本加载后向 `RANDOM_EVENTS` push legacy 事件对象；使用既有 `showEventModal()` 选项格式，choice.apply 按 effects 路径更新 state | ~120行 | 证明 TS 事件目录不只是 catalog，首批城市生存事件能进入随机事件池 | 无新增 UI；复用现有 `.modal-box` 事件弹窗，移动端随原样式
事件日志稳态滚动 | `src/js/main.js` | legacy JS/移动端 | 抽 `scrollMessageLogToBottom(content, smooth)`，在 `renderMessageLog()` 展开时用 rAF + setTimeout 二次滚动；`toggleMessageLog()` 展开时调用同一函数并可用 `scrollTo({top:scrollHeight,behavior:'smooth'})` 兜底 | ~25行 | 连续每日消息后展开能稳定到最新记录 | 正向改善，无新增元素
城市服务推荐地点中文化 | `src/js/ui/render.js` | legacy UI | 新增 `_lifeSystemsLocationNames(ids)`，优先从 `LOCATIONS` 映射中文名，兜底 id；推荐卡片显示“政府办事大厅 / 公园”等 | ~20行 | 推荐入口对玩家可读 | 纯文本，自适应
事业创业减免明细 | `src/js/ui/career_dev.js` | legacy UI | 在 `getCareerDualPathHtml()` 创业卡片中追加四项明细：行业资源、客户线索、声誉、合伙人信任当前值/建议目标，并提示 burnout 会抵消减免 | ~35行 | 上班族到创业的资源转化更直观 | 列表单列/auto-fit，不横向溢出
人生事务移动端按钮触控高度 | `src/css/style.css` | CSS/移动端 | 在末尾 `@media (max-width:480px)` 内追加针对人生事务卡片按钮或通用 `.life-system-actions .btn` 的 `min-height:44px; width:100%`；若先改 HTML，可给按钮组加类名 | ~12行 | 新增常驻面板符合 44px 触控规则 | ≤480px 更易点按

## 建议执行顺序

1. P0 CSS 媒体查询结构修复（先保证样式/构建可解析）
2. P0 文案术语收口
3. P0 城市服务按钮灰显与条件提示
4. P0 医疗治疗入口补齐
5. P0 TS 事件 bridge 首批接入
6. P1 事件日志稳态滚动
7. P1 推荐地点中文化 + 创业减免明细 + 人生事务按钮触控
8. 更新 `IMPLEMENTATION_PROGRESS.md`、`CLAUDE.md`、`src/DEVELOPMENT.md`，运行 `npm run check:js` / `npm run typecheck` / `python build.py` / `npm run build`；若涉及数值概率，再补 Monte Carlo

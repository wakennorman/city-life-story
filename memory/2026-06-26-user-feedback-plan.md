# 2026-06-26 用户反馈修复计划

## 目标与完成标准

本轮不是继续做新架构壳，而是修复旧正式入口里玩家已经能碰到的体验断点。完成标准：`dist/index.html` 中可直接玩到修复后的逻辑；不重排 `src/index.html` 既有 script 顺序；修改后通过 `python build.py`、`npm run typecheck`、`npm run check:js`、`npm run build`。

## P0：会误导或阻断游玩的错误

1. 沙盒姓名输入只能打一字 | `src/js/main.js` | legacy UI | `updateSandboxConfig('name')` 触发整表重渲染导致 input 失焦；改为姓名输入只更新配置和摘要，不重渲染表单 | 输入可连续打字
2. 每日收支“收入46/支出46/净0”假平衡 | `src/js/ui/daily_report.js`、`src/js/phase1/daily_pipeline.js` | legacy 财务 | 取消把未记录现金差额强行补成“其他支出/收入”的默认展示，改为“未归类现金变动”单独提示；净收入按真实收入-真实支出显示，并把历史写入 `_incomeExpenseHistory` | 收支报告不再伪造平衡，曲线有持续数据
3. 总资产/收入支出曲线长期显示数据积累中 | `src/js/ui/data_viz.js`、`daily_report.js` | legacy 数据可视化 | 每日结算后追加资产/收支历史，限制最近 180 天，不随当天清空 | 曲线从第2天起逐步形成
4. 创业资金判断错误 | `src/js/phase2/startup.js` | legacy 创业 | 注册按钮和校验统一读取当前可支配现金，展示门槛与按钮状态一致 | 现金足够时可注册公司
5. 状态低下/饥饿弹窗按钮文字溢出 | `src/js/phase1/interaction.js`、`src/js/ui/modal.js`、`src/css/style.css` | legacy UI | 把长选项改成纵向卡片按钮，允许换行，移动端限制宽度 | 选项不再挤出弹窗
6. 背包英文 ID / undefined | `src/js/ui/render.js`、可能新增 `src/js/core/display_names.js` | legacy UI | 建立统一物品/商品/地点/职业显示名 helper，背包与装备耐久提示走 helper | `vitamins_item`、`electronics` 等不直接露出

## P1：体验明显提升

1. “确立人生目标”仍在行动里 | `src/js/phase1/actions_extra.js`、`src/js/phase2/personal_growth.js` | legacy 行动/个人成长 | 删除未选目标时的行动卡片，只保留开局强制弹窗；已有目标后的查看/更改入口放到个人成长目标区域 | 目标归个人成长，不占行动列表
2. 职业图标重复、晋升条件展示不完整 | `src/js/ui/career_dev.js`、`src/js/data/jobs.js` | legacy 职业 | 去重职业方向入口；晋升条件展示增加人脉、业绩、颜值、属性口径 | 职业方向信息可信
3. 属性增强 tab 需要排在个人成长第一位 | `src/js/ui/render.js`、`src/js/phase2/personal_growth.js` | legacy 个人成长 | 若当前已有属性增强实现，调整排序并命名；保留“数据”最后 | 玩家能先看到提升属性和整容入口
4. 新闻类事件只在下方记录 | `src/js/core/news_system.js` 或事件队列 | legacy 事件 | 重要新闻进入消息记录的同时弹出轻量新闻弹窗，避免阻塞过多 | 玩家不会错过关键宏观信息
5. 左侧信息过长、首屏滚动负担大 | `src/index.html`、`src/js/ui/render.js`、`src/css/style.css` | legacy UI | 把当前位置、天气、住所、仓库、处所升级提醒合并进顶部时间/现金卡或紧凑状态条，左栏保留属性/状态/目标/重点 | 首屏信息密度更合理
6. 天气准备买了伞/暖宝但物品栏空 | `src/js/core/weather_forecast.js`、`src/js/data/items.js` | legacy 天气/背包 | 天气准备应添加真实物品或明确写入天气准备状态；优先加入可显示物品 | 玩家看到花钱买到的东西

## 经验教训

- 任何“对账兜底”不能伪造成真实支出，否则会让玩家失去对经济系统的信任；未接线的现金变动应暴露为“未归类”并推动补埋点。
- 动态表单不要在每个字符输入时整块 `innerHTML` 重绘，尤其是姓名、文本框、搜索框；需要局部更新或失焦后重绘。
- 旧入口仍是玩家真实入口，TS 数据目录和 bridge 只能算来源与迁移通道；修复必须落到 legacy UI 或桥接到 legacy UI。
- 玩家可见文案必须走显示名 helper，不能让内部 id 直接进入 UI；这也是杜绝 `undefined` 的系统性办法。
- 强制开局选择已经存在后，行动列表里的首次设置入口会造成概念重复；入口归属要跟系统归属一致。

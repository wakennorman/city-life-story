# 2026-07-02 问题诊断（第八轮 · 事业发展Tab审查）

> 本轮聚焦「事业发展 Tab 完善」，参考 BitLife（职业深度+跳槽+退休）/《大多数》（中国职场写实+35岁危机）/中国式家长（升学链）/Stardew Valley（关系维护主动行动）/现实中国职场（考证/绩效/调薪/跳槽/副业冲突）。
> 行号基于 HEAD `00946e8`。

## P0 — 不做则核心体验断裂

### 系统/代码维度（断连）

职场社交每日tick函数名不匹配致演化全死 | 系统/代码 | P0 | daily_pipeline.js:462 调 `tickWorkplaceSocialDaily`，workplace_social.js:436 实际定义 `tickColleagueRelationships` → 关系衰减/导师指导/徒弟成长全部不执行。参考 Stardew Valley 每日关系衰减是社交活力的核心。

职场社交5个主动行动函数零调用者（死代码） | 代码 | P0 | `treatColleagueMeal`(597)/`chatWithColleague`(629)/`establishMentorship`(339)/`takeMentee`/`triggerOfficePoliticsEvent`(486) 全定义齐全但无 UI 按钮/无 actions hook。而 career_dev.js:914 高阶晋升需"职场人脉≥X人"——人脉只能靠这些行动维护，路径被堵。

`state.workplaceSocial.colleagues` vs `state.corporate.colleagues` 路径不一致 | 代码 | P0 | career_dev.js:944 优先读 `workplaceSocial.colleagues.network`，写入方 initColleagueNetwork 写 `corporate.colleagues.network` → 主路径永远空，靠 fallback 兜底但永无主动维护的增量。

退休节点不清空 currentJob / 不停发薪 | 系统 | P0 | life_nodes.js 退休选项只设 `_retirementType` flag，tickCareerJobDaily 照常发全额月薪 → "退休=继续上班"。参考 BitLife 退休后停止工资、发养老金。

### 内容/体验维度

业绩 performance 无主动提升途径 | 内容 | P0 | 玩家只能挂机每20天+5；career_dev.js:418 建议文案"优先做项目、补技能"是空头支票。参考《大多数》主动工作行为影响绩效。

职业倦怠 burnout 只增不减且无后果 | 系统 | P0 | 每日+0.04、每20天+2，无任何减少机制（无休假/调休/健身减压），且 burnout≥20 仅在创业折扣文案里抵消，对本职工作无负面后果 → 数字飘在那里无意义。参考现实职场过劳降绩效/降健康。

学历提升只支持 0→1，展示与实装不符 | 内容/代码 | P0 | getCareerEducationHtml 列 6 级（初中→博士），但 main.js 行动入口 edu≥1 后直接禁用，研究生/博士无入口。参考中国式家长完整升学链。

创业注册费口径三处不一致 | 数据 | P0 | career_dev 注册块写 ¥200k、startup.js 实际 `Math.max(20000, baseCash×(1-discount))`、wiki.js 硬编码页写 ¥50k；startup.js:2273 `|| 200000` 兜底永不命中。

## P1 — 做了体验明显提升

### 体验维度（含移动端）

事业发展Tab在手机端被挤到首屏外 | 体验/移动端 | P1 | 11个可见Tab，事业发展排第7（index.html:472），375px视口前6个已满屏，需左滑才见。参考大多数主Tab≤6个。

无主动跳槽机制 | 内容 | P1 | 只能晋升或辞职；cross_system 有猎头挖角随机事件但非玩家主动。现实中国职场跳槽是核心加薪手段（年均涨薪20-30%）。参考 BitLife 主动换工作。

职业历程颗粒度粗 | 内容 | P1 | 只记入职/晋升/辞职/跳槽4类；项目完成/年度考核/加薪无记录。tickCareerJobDaily:1179 项目完成只 addMessage 不写 history。

无年度调薪/薪资谈判 | 内容 | P1 | 月薪固定，只晋升时变。现实职场有年度调薪（5-15%）和绩效奖金。

副业与主业不冲突 | 系统 | P1 | side_hustle 不检查 career.currentJob，无"上班日不能跑副业/加班影响次日疲劳"逻辑，疲劳独立计数，副业收入不受职业资本影响。参考现实主业副业时间冲突。

无职称/证书加成 | 内容 | P1 | 证书系统（main.js:3047）只给技能 XP，不给职业薪资/晋升加成。现实"高级工程师/CPA/PMP"对薪资晋升有实质加成。

career_dev行内网格移动端无 !important 兜底 | 体验/移动端 | P1 | 5列资本条(career_dev.js:444 `repeat(5,minmax(0,1fr))`)在375px每列~60px偏挤；`1fr 1fr`路径选择卡勉强。其他网格(.action-cards/.inventory-grid)都有移动端 !important 覆盖，career_dev 没有。

总览页太单薄 | 体验 | P1 | 只有创业摘要+当前职业摘要+静态建议，无职业资本趋势/晋升进度条/同行对比/本周事件。

职业路径只6条 | 内容 | P1 | 缺医疗/教育/公务员/科研/制造/物流/餐饮/传媒等现实常见职业。参考 BitLife 150+职业。

## P2 — 锦上添花

career_dev.js 注释说22职位实际24 | 文档 | P2 | 文件头注释"6路径×3-4级≈22个职位"实际6×4=24；百科注册块 sections 职业路径列表也只列4条（漏设计创意/法律服务）。

tickCareerJobDaily 用 `state.player.day % 30 === 1` 发薪 | 代码 | P2 | 用日历日而非工作月，跨剧本/跳槽后发薪日不连续；建议改用 job.workDays 累计或专门 payCycle 计数。

职业资本5字段无溢出提示 | 体验 | P2 | clamp 到100但玩家不知道已满，可能浪费积累。

辞退/裁员无离职补偿 | 内容 | P2 | resignCareerJob 直接清空 currentJob，无 N+1/失业金（cross_system 裁员事件有 N+1 但主动辞职没有）。现实裁员有法定补偿。

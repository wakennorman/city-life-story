# 2026-07-02 改进方案（第八轮 · 事业发展Tab完善）

> 参考：BitLife（职业深度/跳槽/退休养老金）/《大多数》（中国职场写实+过劳降健康）/中国式家长（升学链）/Stardew Valley（主动维护关系）/现实中国职场（35岁危机/考证/年度调薪/主副业冲突）。
> 实装顺序见文末「互斥性与commit顺序」。行号基于 HEAD `00946e8`。

## P0 — 核心断连/断点

### P0-1 职场社交每日tick接通 + 路径修正

对应：社交tick函数名不匹配/路径不一致 | `daily_pipeline.js` + `workplace_social.js` + `career_dev.js` | legacy层 | workplace_social.js末尾导出别名 `window.tickWorkplaceSocialDaily=tickColleagueRelationships;`；career_dev.js:944 `getCareerTrustedNetworkCount` 主读路径改为 `state.corporate.colleagues.network`（与写入方一致），`state.workplaceSocial` 降为 fallback | ~12行 | 关系衰减/导师/徒弟每日演化生效，高阶晋升人脉数据再生 | 无UI变动

### P0-2 职场社交主动行动接入UI

对应：5个主动行动死代码 | `career_dev.js`(renderCareerJobs) + `workplace_social.js`(确认函数已导出) | legacy层 | 入职时(initColleagueNetwork在applyCareerJob调用)；上班族子面板"当前工作"下新增"🤝 职场社交"区块：列出同事(姓名/关系/信任) + 3按钮「请客吃饭(¥50,AP2,关系+8/trust+5)」「私下聊天(AP1,关系+3)」「拜师(需好感≥60,解锁mentee加成)」；调用已存在的treatColleagueMeal/chatWithColleague/establishMentorship | ~120行 | 玩家可主动维护人脉，打通高阶晋升路径 | 按钮44px高单列堆叠，复用现有.btn样式，375px不溢出

### P0-3 退休停薪 + 养老金

对应：退休不停发薪 | `life_nodes.js`(applyNodeChoice退休分支) + `career_dev.js`(tickCareerJobDaily) | legacy层 | 退休选项设 `state.flags._retired=true` 并记录最后薪资到 `state.career.pensionBase`；tickCareerJobDaily开头 `if(state.flags?._retired){发养老金=lastSalary×40%每月;return;}`；上班族子面板退休后显示"已退休·月养老金¥X" | ~45行 | 退休=停止全额工资+领40%养老金，参考BitLife | 无UI变动（状态文字）

### P0-4 业绩主动提升行动

对应：performance无主动提升 | `career_dev.js`(renderCareerJobs当前工作卡) | legacy层 | 新增3行动按钮「💼 做项目(AP3,perf+8,burnout+3,10%几率+客户线索3)」「🌙 加班(AP2,perf+5,cash+日薪/30,burnout+5,健康-2)」「🎯 冲刺KPI(AP4,perf+12,burnout+6,需perf≥40,完成给行业资源+5)」；执行后clamp+renderAll | ~85行 | 玩家可主动提升业绩，呼应建议文案，参考《大多数》主动工作行为 | 按钮44px单列

### P0-5 burnout减压机制+过劳后果

对应：burnout只增不减且无后果 | `career_dev.js`(tickCareerJobDaily+renderCareerJobs) | legacy层 | ①tickCareerJobDaily: burnout≥50时performance每日-1/健康-0.5；≥80强制触发"过劳病假"事件(健康-10,burnout-30)。②上班族子面板加「😴 调休(AP0,burnout-15,需workDays≥20,每月限1次)」按钮。③公园/健身房地点行动(actions_extra)追加 burnout-5 效果 | ~65行 | burnout有出口和后果闭环，参考现实过劳降绩效健康 | 调休按钮44px

### P0-6 学历补研究生/博士入口

对应：学历只支持0→1 | `main.js`(edu行动 edu≥1禁用→递增门槛) + `career_dev.js`(学历卡加按钮) | legacy层 | main.js edu行动去掉edu≥1禁用，按当前级递增studyPoints门槛(本科150/研究生300/博士500)、通过率随级递减；通过后education+1。career_dev学历卡加「去大学城备考」按钮(切换到school地点提示) | ~55行 | 6级学历全可达，展示与实装一致，参考中国式家长升学链 | 按钮44px

### P0-7 注册费口径统一

对应：注册费三处不一致 | `startup.js`(暴露getStartupRegisterFee) + `career_dev.js`(百科块) + `wiki.js`(删硬编码¥50k) | legacy层 | startup.js暴露 `window.getStartupRegisterFee=...`，删 `||200000` 兜底；career_dev百科块改"按剧本+职业资本动态计算"；wiki.js startup_system硬编码页删除(让注册表驱动career_dev页接管) | ~45行 | 三处口径一致 | 无UI变动

## P1 — 明显提升体验

### P1-1 事业发展Tab移动端可达性

对应：Tab被挤到首屏外 | `render.js`(renderTabBar街头阶段顺序) + `style.css`(@media480px) | legacy层 | renderTabBar街头阶段把"事业发展"排到第2位(行动之后，最常用)；style.css移动端给 `#tab-btn-career-dev` 加视觉强调(边框高亮) | ~25行 | 手机端首屏可见事业发展 | 核心移动端改动

### P1-2 主动跳槽机制

对应：无主动跳槽 | `career_dev.js`(renderCareerJobs当前工作卡) | legacy层 | 当前有工作时新增「🔍 跳槽」区：基于当前职级+careerCapital生成2-3个offer(薪资+10~30%，可跨路径同级或同路径高半级)，需clientLeads≥15或reputation≥30；跳槽后workDays重置/performance=50/salary涨/记history；30天冷却 | ~110行 | 主动跳槽加薪，参考BitLife+现实年均涨薪20-30% | offer卡单列44px

### P1-3 职业历程+年度考核调薪

对应：历程颗粒度粗+无年度调薪 | `career_dev.js`(tickCareerJobDaily) | legacy层 | ①每20天项目完成push history(项目+业绩+资本增量)。②每365天年度考核：perf≥70涨薪8%+history；≥85涨12%；<40警告+burnout+5。③跳槽/晋升已有history | ~50行 | 历程丰富+薪资动态，参考现实年度考核 | 无UI变动

### P1-4 副业主业冲突

对应：副业主业不冲突 | `side_hustle.js`(执行前检查) | legacy层 | 执行副业前检查 `state.career.currentJob && timeSlot∈[白天]` 拒绝(只能晚上/周末跑)；burnout≥60副业效率-30%；副业收入受reputation小幅加成(+0~5%) | ~35行 | 主副业冲突真实，参考现实时间冲突 | 无UI变动

### P1-5 证书职称加成

对应：无职称加成 | `career_dev.js`(晋升/薪资读证书) + `main.js`(证书考试写字段) | legacy层 | 考取证书后写 `state.career.certs=[...]`；career_dev晋升时持对应路径证书则技能门槛-1级或薪资+5%；上班族子面板显示"持有证书"徽章 | ~45行 | 证书有职业价值，参考现实CPA/PMP | 徽章小尺寸

### P1-6 移动端网格兜底

对应：行内网格无!important | `style.css`(@media480px末尾) | legacy层 | 追加 `.career-capital-bar{grid-template-columns:repeat(5,1fr)!important;gap:4px!important;font-size:10px}` `.career-path-grid{grid-template-columns:1fr!important}` | ~15行 | 375px资本条不挤、路径单列 | 核心移动端

### P1-7 总览页增强

对应：总览太单薄 | `career_dev.js`(renderCareerOverview) | legacy层 | 加"晋升进度条"(当前职级→下一级，技能/属性/人脉完成度)、"职业资本5维趋势条"、"本周事业事件"(history近7条)、"同行参考薪资"(当前职级行业均值) | ~70行 | 总览有信息量 | 375px单列堆叠

### P1-8 扩充职业路径(3-4条)

对应：职业路径只6条 | `career_dev.js`(CAREER_PATHS) | legacy层 | 新增：医疗(医技员→住院医师→主治医师→副主任医师)、教育(实习教师→教师→高级教师→特级教师)、公务员(科员→副科→正科→副处)、制造(技术员→工程师→高级工程师→总工程师) | ~200行 | 10路径覆盖现实主流，参考BitLife职业广度 | 路径选择卡1fr 1fr→移动端单列

## P2 — 锦上添花

### P2-1 注释/百科数据修正

对应：注释22实际24+百科只列4路径 | `career_dev.js` | legacy层 | 文件头注释改"6路径×4级=24职位"；百科sections职业路径列表补齐设计创意/法律服务2条 | ~6行 | 文档准确 | 无

### P2-2 发薪日改workDays累计

对应：用day%30不连续 | `career_dev.js`(tickCareerJobDaily) | legacy层 | 改用 `job.payCycle=(job.payCycle||0)+1; if(payCycle%30===0)发薪`，跨跳槽连续 | ~10行 | 发薪日连续 | 无

### P2-3 资本溢出提示

对应：clamp无提示 | `career_dev.js`(renderCareerJobs) | legacy层 | 资本条字段≥95时显示"⚠️已满"提示 | ~10行 | 避免浪费积累 | 无

### P2-4 辞退补偿

对应：主动辞职无补偿 | `career_dev.js`(resignCareerJob) | legacy层 | 主动辞职按workDays发15天工资补偿(N)；裁员事件已有N+1不动 | ~12行 | 呼应现实 | 无

## 互斥性与 commit 顺序

career_dev.js 是主战场，多方案改不同函数但需串行 commit 避免冲突。建议顺序：

1. **P0-1**（daily_pipeline+workplace_social+career_dev路径修正）— 先接通社交tick
2. **P0-2**（career_dev社交UI）— 社交主动行动可用
3. **P0-4**（career_dev业绩行动）— 业绩可主动提升
4. **P0-5**（career_dev burnout后果+调休）— burnout闭环
5. **P0-3**（life_nodes+career_dev退休）— 退休停薪
6. **P0-6**（main.js+career_dev学历）— 独立，可插队
7. **P0-7**（startup+career_dev+wiki注册费）— 独立
8. **P1-8**（career_dev扩充路径）— 数据扩充
9. **P1-2**（career_dev跳槽）— 依赖路径数据
10. **P1-3**（career_dev历程+调薪）
11. **P1-5**（main+career_dev证书）
12. **P1-4**（side_hustle独立）
13. **P1-7**（career_dev总览）
14. **P1-1+P1-6**（render+style移动端）— 最后打磨
15. **P2** 收尾

每步 commit 一次，跑 check:js/typecheck/build 验证。预计总改动 ~925行。

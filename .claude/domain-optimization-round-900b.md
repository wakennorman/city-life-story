# R900b 域D(NPC/社交) 深审轮 — 2026-07-30 11:3x-11:5x（本窗口自动化）

## 选域依据
git log 实测：并行小编号轨活跃至 R900（域F）；本窗口深审 recency D 最陈旧（R757b 只专审了 npcs.js 新NPC，social_network.js/social_tab.js 社交网络系统从未深审）。b 后缀避让。

## A类修复（3处互锁死链 = 社交网络系统整体死透）
| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/ui/social_tab.js:876 | "发朋友圈/刷新热搜"按钮被误包在 `舆论危机.active` 块内→永不可达；且 visibility='朋友' 非法枚举(非public不涨粉)双重锁死 | 按钮移出危机块无条件展示，visibility 改 'public'，接 pickMomentText 动态文案+失败反馈 | A |
| src/js/core/social_network.js | `triggerPublicOpinionCrisis` 全库零调用→危机永不激活→r455声援事件/危机UI全死；且危机期间无任何实际负面效果(网红恒赚无风险) | tick 接线：粉丝≥1000 每日1.5%概率触发(树大招风·损失厌恶)；危机期间粉丝每日流失(severity×3%封顶)+收入折损(最低3折) | A |
| src/js/core/social_network.js | `npcPostFeed` 全库零调用→npcFeeds 永空→NPC动态UI永显"暂无"、wiki承诺零兑现 | tick 接线：每日30%概率由已met NPC发日常动态(met铁律) | A |

死链全貌：粉丝唯一增长源=发朋友圈→按钮锁死→粉丝恒0→网红经济/等级/日收入/接广告承诺/r455两事件全部死透。396行系统只剩热搜展示活着。

**竞态**：三处源码修复在 11:40-41 被并行 R900(aa1c939d+bcd24193) 扫走提交（IDENTICAL 核验通过），本窗口闭合联动文件+挂载+dist。

## B类
- index.html r694 双挂载（1843+1863，R894b 去重过又被并行加回）→本轮再去重保留首挂。
- 开轮例行杂散 t 清扫：10处（r890-r899 挂载行全带病→9文件悬空 dist），本窗口清扫后被并行 aa1c939d 吸走。

## 联动增强（domain_d_linkage_events_r900b.js，3事件，street，done-flag）
| 事件 | 联动 | 设计意图 |
|---|---|---|
| d900b_crisis_pr | D→E | 危机机制复活后首个玩家决策点：花¥4000公关 vs 硬扛(心智-12/名气+3)，损失厌恶 |
| d900b_feed_resonance | D→B | npcFeeds 复活后首事件消费：动态流里的旧时光，评论深聊(好感+4)vs默默点赞，峰终定律 |
| d900b_fans_ad_offer | D→E/C | 兑现 wiki"粉丝≥1000可接广告"承诺：报价=粉丝×2；_d898/_d890SocialCapital 全库首读(+20%谈判溢价)；拒接涨路人缘 |

## 验证
- node --check ×3 过；build 见提交记录；MC 见提交记录。

## 下轮候选
A(R770b) > B(R785b) > C(R792b)。开轮必 git log 重算。

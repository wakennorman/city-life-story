# 子任务6：实装交付报告

## 修改文件清单（共17个文件）

| 文件                                         | 修改内容                                                                                                     | 类型      |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------- |
| `src/js/main.js`                             | `AP`→`行动力`（节日工作描述）                                                                                | 修复      |
| `src/js/ui/render.js`                        | 交通方式AP→行动力；header-context精简(移除位置/天气/背包重复)；学历移出sidebar；新增personal growth学历子Tab | 修复+新增 |
| `src/js/ui/social_tab.js`                    | NPC英文ID→中文名；围脖热搜改名；网红等级中文映射                                                             | 修复      |
| `src/js/core/social_network.js`              | 热搜话题池30条+联动新闻；粉丝多因子增长模型（内容长度+配图+名气）                                            | 改进      |
| `src/index.html`                             | "附近可前往"移到sidebar靠前位置                                                                              | 修复      |
| `src/js/ui/modal.js`                         | AP→行动力                                                                                                    | 修复      |
| `src/js/ui/wiki.js`                          | AP→行动力                                                                                                    | 修复      |
| `src/js/data/mechanics_registry.js`          | AP→行动力（百科条目）                                                                                        | 修复      |
| `src/js/core/travel.js`                      | AP→行动力                                                                                                    | 修复      |
| `src/js/phase1/actions_extra.js`             | AP→行动力                                                                                                    | 修复      |
| `src/js/phase1/critical.js`                  | AP→行动力                                                                                                    | 修复      |
| `src/js/core/skill_tree.js`                  | AP→行动力                                                                                                    | 修复      |
| `src/js/core/skill_intel.js`                 | AP→行动力                                                                                                    | 修复      |
| `src/js/core/events_street.js`               | AP→行动力（2处事件描述）                                                                                     | 修复      |
| `src/js/app_bridge/webapp_runtime_bridge.js` | AP→行动力                                                                                                    | 修复      |
| `src/js/data/era_events.js`                  | AP消耗→消耗行动力                                                                                            | 修复      |

## P0/P1修复完成情况

| 优先级 | 修复项                          | 状态      |
| ------ | ------------------------------- | --------- |
| P0     | "AP"英文→"行动力"（15+处）      | ✅        |
| P0     | NPC英文ID→中文名显示            | ✅        |
| P0     | 学历从侧边栏移入个人成长Tab     | ✅        |
| P1     | header-context精简（去重复）    | ✅        |
| P1     | 热搜话题30条真实内容+联动新闻   | ✅        |
| P1     | 围脖热搜改名+网红等级中文       | ✅        |
| P1     | 粉丝增长多因子模型（名气+内容） | ✅        |
| P1     | "附近可前往"首屏化              | ✅        |
| P1     | 债务显示条件化（已有实现）      | ✅ 无需改 |
| P2     | 网红收入多级化（已有实现）      | ✅ 无需改 |

## 未来待改进

- 地点×行动差异化（行动需按地点定制）
- 社交网络NPC点赞/评论朋友圈
- 地点×NPC特殊交易类型差异化

# 域B优化 Round 15

- **日期**: 2026-07-14
- **域**: B (事件/叙事)
- **A类修复**: 6项
- **联动增强**: 3项

## 指令一：A类缺陷修复清单

| #   | 文件                      | 事件ID                     | 缺陷                                                           | 修复                        |
| --- | ------------------------- | -------------------------- | -------------------------------------------------------------- | --------------------------- |
| 1   | career_path_events.js     | career_apex_peak           | 缺失 phase 字段→注入过滤永不触发                               | 加 phase:"street"           |
| 2   | career_path_events.js     | career_senior_bonus        | 同上                                                           | 加 phase:"street"           |
| 3   | career_path_events.js     | career_industry_dinner     | 同上                                                           | 加 phase:"street"           |
| 4   | cross_system_events.js    | seasonal_health_check      | 精确day===91/183/274/365+repeatable:true矛盾，错过窗口永不触发 | 改为周期性检查(day%90)      |
| 5   | personal_growth_events.js | pg_health_crisis×3         | health.physical是对象{score,...}但apply直接+25→NaN             | 加typeof对象检查+score回退  |
| 6   | family_events.js          | corporate_mother_surgery×6 | st.player.mood不存在(state.js无此字段)→运行时undefined         | 替换为st.needs.happiness    |
| 7   | career_path_events.js     | design_client_revision     | 设计事件addSkillXp("coding",10)→应该加design                   | 改为addSkillXp("design",10) |

## 指令二：联动增强清单

| #   | 新增内容                   | 文件                   | 联动域 | 设计意图                                                     |
| --- | -------------------------- | ---------------------- | ------ | ------------------------------------------------------------ |
| 1   | news_price_shock_personal  | cross_system_events.js | B→A    | 新闻系统中的涨价信息直接影响玩家消费决策，让新闻有"触感"     |
| 2   | heavy_rain_cooking_dilemma | cross_system_events.js | B→G    | 极端天气触发消费行为改变，暴雨天外卖vs泡面vs便利店的真实抉择 |
| 3   | moral_flag_npc_reaction    | cross_system_events.js | B→D    | 道德flag被NPC感知——抓小偷传开/流浪狗跟随/捡钱包的微妙眼神    |

## 验证

- node --check: ✅
- python build.py: 8225.3KB ✅
- git push: ❌ (网络不可达，代理问题)
- commits: 04b99545 (A类修复) + c00d48f0 (联动增强) + 21b166cd (状态更新)

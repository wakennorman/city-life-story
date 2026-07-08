# 约定式配置方法论

## [事件叙事-触发自洽性修复原则]

- **A 类缺陷定义**：事件故事文本中提及的具体地点、天气、职业或 NPC 名称，
  但在 conditions/triggers 中未检查对应的状态字段。
- **修复原则**：每个事件的 conditions/triggers 必须覆盖故事文本中提及的
  关键场景（地点 = st.trade.currentLocation、天气 = st.weather.current、
  职业 = st.career.currentJob / st.sideHustle、NPC = st.relationships）。
- **验证方法**：对事件文件的 story 字段做关键词扫描，匹配上下文状态检查。

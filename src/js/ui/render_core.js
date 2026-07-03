// ====== Tab 渲染函数注册表 ======
// 新增标签页只需在这里加一行，无需修改 renderCurrentTab
//
// ⚠️ 所有跨文件的渲染函数必须用 fnName 字符串 + 运行时 window[fnName] 动态查找。
//    渲染函数定义在 render.js（后加载）或 render_infra.js（后加载）中时，
//    const 创建时函数还不存在，直接引用/对象 fn 引用的值都是 undefined。
//    只有 main.js 同文件或更早加载的函数才可以用直接引用。
const TAB_RENDERERS = {
  actions: { fnName: "renderActionsTab", fallback: "⚡ 行动加载中..." },
  map: { fnName: "renderMapTab", fallback: "🗺️ 地图加载中..." },
  trade: { fnName: "renderTradeTab", fallback: "📦 交易加载中..." },
  inventory: { fnName: "renderInventoryTab", fallback: "🎒 物品加载中..." },
  skills: { fnName: "renderSkillsTab", fallback: "📚 技能系统加载中..." },
  corp: { fnName: "renderCorpTab", fallback: "🏢 职场加载中..." },
  // renderInvestmentTab 在 investment.js 中定义（跨文件）
  investment: { fnName: "renderInvestmentTab", fallback: "投资系统加载中..." },
  // renderStartupTab + career jobs 在 career_dev.js 中定义（跨文件）
  career_dev: {
    fnName: "renderCareerDevTab",
    fallback: "事业发展系统加载中...",
  },
  enterprise: {
    fnName: "renderEnterpriseFateTab",
    fallback: "企业生态加载中...",
  },
  // renderSideHustleTab 在 side_hustle_ui.js 中定义（跨文件）
  side_hustle: { fnName: "renderSideHustleTab", fallback: "副业系统加载中..." },
  achievements: {
    fnName: "renderAchievementsTab",
    fallback: "🏅 成就加载中...",
  },
  // 社交Tab：合并职场社交+家庭（跨文件）
  social: { fnName: "renderSocialTab", fallback: "社交系统加载中..." },
  life_systems: {
    fnName: "renderLifeSystemsTab",
    fallback: "人生事务系统加载中...",
  },
  // 个人成长Tab（合并了原成长数据可视化+原个人成长）
  personal_growth: {
    fnName: "renderMergedPersonalGrowthTab",
    fallback: "个人成长系统加载中...",
  },
  equipmentSuites: {
    fnName: "renderEquipmentSuitesTab",
    fallback: "装备套装加载中...",
  },
  wiki: { fnName: "renderWikiTab", fallback: "📖 百科系统加载中..." },
};

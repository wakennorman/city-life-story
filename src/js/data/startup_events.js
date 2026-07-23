/**
 * 创业专属事件系统 — 30+ 随机事件
 *
 * 按阶段分类：种子期 / 成长期 / 成熟期
 * 按行业分类：科技 / 消费 / 金融科技 / 医疗健康 / 教育 / 制造
 * 按类型分类：机遇 / 危机 / 人际 / 政策 / 市场
 */

// ====== 工具函数 ======

/** 转义 HTML 特殊字符 */
var _esc = _esc || function _esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

// ====== 种子期事件（注册后0-90天）======
const STARTUP_EVENTS_SEED = [
  // 1. 办公室选址
  {
    id: "seed_office_choice",
    name: "办公室选址",
    stage: "seed",
    triggerDayMin: 3,
    triggerDayMax: 30,
    industries: ["*"],
    title: "第一个办公室",
    desc: "公司需要个像样的地方办公。你有三个选择：共享办公空间（便宜但嘈杂）、普通写字楼（适中）、科技园（贵但有政策补贴）。",
    options: [
      {
        text: "共享办公空间 ¥3,000/月",
        effect: { cashReserve: -3000, reputation: -2, marketScore: -2 },
        msg: "选了共享办公，便宜但环境嘈杂，员工抱怨不断。",
      },
      {
        text: "普通写字楼 ¥8,000/月",
        effect: { cashReserve: -8000, reputation: 0, marketScore: 0 },
        msg: "中规中矩的选择，不出彩但也不出错。",
      },
      {
        text: "科技园 ¥15,000/月（有补贴）",
        effect: {
          cashReserve: -10000,
          reputation: 5,
          marketScore: 3,
          technologyScore: 2,
        },
        msg: "科技园入驻，虽然贵但有政策补贴，还提升了公司形象和技术氛围。",
      },
    ],
  },

  // 2. 第一个客户
  {
    id: "seed_first_customer",
    name: "第一个客户",
    stage: "seed",
    triggerDayMin: 5,
    triggerDayMax: 45,
    industries: ["*"],
    title: "第一单生意",
    desc: "一个潜在客户找到了你，但他们预算有限，要求很多。接还是不接？",
    options: [
      {
        text: "接！先积累案例",
        effect: { cashReserve: 5000, reputation: 3, marketScore: 2 },
        msg: "第一单虽然利润薄，但积累了宝贵案例和口碑。",
      },
      {
        text: "拒绝，等更好的",
        effect: { reputation: -2, marketScore: -1 },
        msg: "拒绝了，但几天后客户找了竞争对手，你错过了第一个案例。",
      },
      {
        text: "谈个折中方案",
        effect: { cashReserve: 3000, reputation: 2, marketScore: 1 },
        msg: "谈了个折中方案，利润一般但双方都满意。",
      },
    ],
  },

  // 3. 团队冲突
  {
    id: "seed_team_conflict",
    name: "团队冲突",
    stage: "seed",
    triggerDayMin: 10,
    triggerDayMax: 60,
    industries: ["*"],
    title: "联合创始人闹矛盾",
    desc: "你的联合创始人对你的决策不满，觉得你太保守/太激进。团队气氛紧张。",
    options: [
      {
        text: "妥协，听取对方意见",
        effect: { reputation: -1, marketScore: -1 },
        msg: "你妥协了，但决策效率下降，错过了一个机会。",
      },
      {
        text: "坚持己见",
        effect: { reputation: 2, marketScore: 1 },
        msg: "你坚持了自己的判断，事实证明是对的。但联合创始人有些不满。",
      },
      {
        text: "找中间人调解",
        effect: { cashReserve: -2000, reputation: 1 },
        msg: "找了行业前辈调解，双方各退一步，团队恢复和谐。",
      },
    ],
  },

  // 4. 产品延期
  {
    id: "seed_product_delay",
    name: "产品延期",
    stage: "seed",
    triggerDayMin: 15,
    triggerDayMax: 70,
    industries: ["*"],
    title: "产品延期风险",
    desc: "产品开发遇到技术难题，可能延期2-3周。客户已经催了。",
    options: [
      {
        text: "加班赶工",
        effect: { cashReserve: -3000, reputation: 1, marketScore: 1 },
        msg: "团队连续加班一周，勉强按时交付，但士气受损。",
      },
      {
        text: "如实告知客户延期",
        effect: { reputation: -2, marketScore: -1 },
        msg: "客户理解但有些失望，说下次会考虑竞争对手。",
      },
      {
        text: "先交个半成品",
        effect: { reputation: -3, marketScore: -2 },
        msg: "交了半成品，客户很不满意，要求退款一部分。",
      },
    ],
  },

  // 5. 创业比赛
  {
    id: "seed_startup_competition",
    name: "创业比赛邀请",
    stage: "seed",
    triggerDayMin: 20,
    triggerDayMax: 80,
    industries: ["*"],
    title: "创业大赛邀请",
    desc: "本地创业大赛邀请你们参赛。第一名¥50,000奖金 + 投资人关注。但需要准备1-2周。",
    options: [
      {
        text: "参加！搏一把",
        effect: { cashReserve: -1000 },
        msg: "准备了两周，获得了第三名，拿了¥5,000奖金。虽然没有拿到第一名，但获得了投资人关注。",
        additionalEffect: () => ({ cashReserve: 5000, reputation: 3 }),
      },
      {
        text: "不参加，专注产品",
        effect: { marketScore: 1 },
        msg: "拒绝了邀请，专心打磨产品。虽然没拿到奖金，但产品进度快了一周。",
      },
      {
        text: "请人代劳准备材料",
        effect: { cashReserve: -5000, reputation: 1 },
        msg: "花了¥5,000请专业团队帮忙准备材料，参赛效果不错。",
      },
    ],
  },

  // 6. 天使投资人接触
  {
    id: "seed_angel_contact",
    name: "天使投资人接触",
    stage: "seed",
    triggerDayMin: 25,
    triggerDayMax: 85,
    industries: ["*"],
    title: "天使投资人约见",
    desc: "一位天使投资人对你的项目感兴趣，约你见面。但他以苛刻著称。",
    options: [
      {
        text: "去见，争取融资",
        effect: { cashReserve: 100000, reputation: -2 },
        msg: "拿了¥10万天使投资，但出让了25%股权，有点贵。投资人要求董事会席位。",
      },
      {
        text: "拒绝，不想被控制",
        effect: { reputation: 2 },
        msg: "拒绝了投资，决定自力更生。虽然资金紧张，但保持了控制权。",
      },
      {
        text: "试探性接触，不表态",
        effect: { reputation: 0 },
        msg: "见了面但没谈拢，投资人觉得你们太保守，撤回了意向。",
      },
    ],
  },

  // 7. 技术突破
  {
    id: "seed_tech_breakthrough",
    name: "技术突破",
    stage: "seed",
    triggerDayMin: 30,
    triggerDayMax: 90,
    industries: ["tech", "manufacturing", "finance"],
    title: "技术突破",
    desc: "团队在核心技术上取得了突破，产品性能大幅提升！",
    options: [
      {
        text: "立即发布更新",
        effect: { technologyScore: 10, marketScore: 5, reputation: 3 },
        msg: "快速发布了更新，用户反响热烈，媒体也报道了。",
      },
      {
        text: "先申请专利再发布",
        effect: { cashReserve: -5000, technologyScore: 5, marketScore: 3 },
        msg: "花了¥5,000申请了专利，保护了核心技术，但发布晚了两周。",
      },
      {
        text: "保密，作为竞争壁垒",
        effect: { technologyScore: 3 },
        msg: "决定暂时保密，作为内部竞争优势。但员工有些失望。",
      },
    ],
  },

  // 8. 核心员工被挖
  {
    id: "seed_headhunted",
    name: "核心员工被挖角",
    stage: "seed",
    triggerDayMin: 35,
    triggerDayMax: 90,
    industries: ["*"],
    title: "核心员工收到offer",
    desc: "你的一名核心员工收到了大厂的offer，薪资比你高50%。他来找你谈话。",
    // [Layer3] 叙事说"你的一名核心员工收到了大厂的offer"，需玩家有员工
    // [全系统自洽修复] 域H 修复:门控键 condition→conditions(triggerStartupEvent 只读复数,原为死门控) + st.company→st.startup.company(公司真实挂在 state.startup.company,原引用不存在字段恒 undefined→零员工也弹"被挖角"叙事矛盾)
    conditions: function (st) { return st.startup && st.startup.company && st.startup.company.employees && st.startup.company.employees.length > 0; },
    options: [
      {
        text: "加薪留人",
        effect: { cashReserve: -15000, reputation: 2 },
        msg: "给他加了薪，留住了人才。但其他员工有些不满。",
      },
      {
        text: "给他期权",
        effect: { reputation: 1 },
        msg: "给了期权，他暂时留下了。但期权不是现金，他还在观望。",
      },
      {
        text: "放他走",
        effect: { reputation: -1, marketScore: -2 },
        msg: "尊重他的选择。他走了，但留下了交接文档，走得体面。",
      },
    ],
  },
];

// ====== 成长期事件（90天以上，团队5人以上）======
const STARTUP_EVENTS_GROWTH = [
  // 9. 竞品出现
  {
    id: "growth_competitor",
    name: "竞品出现",
    stage: "growth",
    triggerDayMin: 90,
    triggerDayMax: 180,
    industries: ["*"],
    title: "竞争对手出现了",
    desc: "市场上出现了一家直接竞争对手，产品和你很像，价格还比你低20%。",
    options: [
      {
        text: "降价应对",
        effect: { cashReserve: -20000, marketScore: -3 },
        msg: "被迫降价，利润空间被压缩。虽然保住了部分用户，但财务压力增大。",
      },
      {
        text: "提升产品差异化",
        effect: { cashReserve: -15000, technologyScore: 5, marketScore: 3 },
        msg: "投入资源做差异化功能，用户认可了你们的独特价值。",
      },
      {
        text: "收购对方",
        effect: { cashReserve: -200000, reputation: 5, marketScore: 10 },
        msg: "花了¥20万收购了竞争对手，消除了威胁。但整合需要时间。",
      },
    ],
  },

  // 10. A轮融资
  {
    id: "growth_series_a",
    name: "A轮融资机会",
    stage: "growth",
    triggerDayMin: 100,
    triggerDayMax: 200,
    industries: ["*"],
    title: "A轮融资窗口",
    desc: "一家VC机构对你们感兴趣，愿意投¥300-500万，但要求对赌条款。",
    options: [
      {
        text: "接受，签对赌",
        effect: { cashReserve: 400000, reputation: -2 },
        msg: "拿了¥40万A轮融资，但对赌条款压力很大：一年内营收要达到¥500万。",
      },
      {
        text: "拒绝对赌，谈正常条款",
        effect: { cashReserve: 200000, reputation: 2 },
        msg: "拒绝了苛刻的对赌，谈了正常条款，融了¥20万。虽然少一些，但更安心。",
      },
      {
        text: "再等等，看更好的投资人",
        effect: { marketScore: -2 },
        msg: "拒绝了这次机会，但几个月后市场变了，再想融资更难了。",
      },
    ],
  },

  // 11. 公关危机
  {
    id: "growth_pr_crisis",
    name: "公关危机",
    stage: "growth",
    triggerDayMin: 120,
    triggerDayMax: 220,
    industries: ["*"],
    title: "负面舆情爆发",
    desc: "社交媒体上有人爆料你们的产品有缺陷/服务有问题，舆论迅速发酵。",
    options: [
      {
        text: "公开道歉+赔偿",
        effect: { cashReserve: -30000, reputation: -5, marketScore: -3 },
        msg: "公开道歉并赔偿受影响用户，舆情逐渐平息。但声誉受到了重创。",
      },
      {
        text: "强硬回应，否认指控",
        effect: { reputation: -8, marketScore: -5 },
        msg: "强硬回应但被网友打脸，舆情进一步恶化。",
      },
      {
        text: "私下沟通，逐个解决",
        effect: { cashReserve: -15000, reputation: -2 },
        msg: "私下联系爆料者，解决了问题。舆情慢慢平息，但花了些钱。",
      },
    ],
  },

  // 12. 法律纠纷
  {
    id: "growth_legal",
    name: "法律纠纷",
    stage: "growth",
    triggerDayMin: 130,
    triggerDayMax: 230,
    industries: ["tech", "finance", "healthcare"],
    title: "知识产权纠纷",
    desc: "一家大公司起诉你们侵犯了他们的专利/商标，要求赔偿¥100万。",
    options: [
      {
        text: "打官司",
        effect: { cashReserve: -50000, reputation: 2 },
        msg: "请了律师应诉，花了¥5万。官司还在打，结果未知。",
      },
      {
        text: "和解，付赔偿",
        effect: { cashReserve: -300000, reputation: -3 },
        msg: "选择了和解，赔了¥30万。虽然贵但省去了漫长的官司。",
      },
      {
        text: "反诉对方恶意诉讼",
        effect: { cashReserve: -80000, reputation: 3 },
        msg: "反诉对方恶意诉讼，舆论支持你们。但法律费用高昂。",
      },
    ],
  },

  // 13. 数据泄露
  {
    id: "growth_data_breach",
    name: "数据泄露事件",
    stage: "growth",
    triggerDayMin: 140,
    triggerDayMax: 240,
    industries: ["tech", "finance"],
    title: "用户数据泄露",
    desc: "黑客攻击了你们的服务器，部分用户数据泄露。需要紧急处理。",
    options: [
      {
        text: "立即通知所有用户",
        effect: { cashReserve: -20000, reputation: -6, marketScore: -4 },
        msg: "通知了所有受影响用户，提供了免费信用监控服务。声誉受损但态度诚恳。",
      },
      {
        text: "悄悄修复，不声张",
        effect: { reputation: -10, marketScore: -8 },
        msg: "试图隐瞒，但被黑客公开了数据。舆论爆炸，用户大量流失。",
      },
      {
        text: "找专业安全公司处理",
        effect: { cashReserve: -40000, reputation: -3, marketScore: -2 },
        msg: "请了专业安全公司处理，通知了用户并提供了补偿。处理得当但花了钱。",
      },
    ],
  },

  // 14. 大客户签约
  {
    id: "growth_big_client",
    name: "大客户签约",
    stage: "growth",
    triggerDayMin: 150,
    triggerDayMax: 250,
    industries: ["*"],
    title: "大客户意向",
    desc: "一家行业头部公司表达了合作意向，但要求定制开发，周期3个月。",
    options: [
      {
        text: "接！¥50万合同",
        effect: { cashReserve: 50000, marketScore: 5, reputation: 3 },
        msg: "签了¥50万的大单，虽然定制开发很累，但收入和客户背书都拿到了。",
      },
      {
        text: "拒绝，专注标准产品",
        effect: { marketScore: -1 },
        msg: "拒绝了定制需求，坚持做标准产品。虽然错过了大单，但产品路线没偏。",
      },
      {
        text: "谈分成模式",
        effect: { cashReserve: 20000, marketScore: 3 },
        msg: "谈了分成模式，前期收入少但长期有分成。双方都满意。",
      },
    ],
  },

  // 15. 团队扩张困境
  {
    id: "growth_hiring_crisis",
    name: "招聘困境",
    stage: "growth",
    triggerDayMin: 160,
    triggerDayMax: 260,
    industries: ["*"],
    title: "招不到合适的人",
    desc: "业务快速发展，但招不到合适的人才。面试了20个人都不满意。",
    options: [
      {
        text: "降低标准先招着",
        effect: { marketScore: -2, reputation: -1 },
        msg: "降低了标准招了人，但入职后发现能力不足，培训成本很高。",
      },
      {
        text: "提高薪资抢人",
        effect: { cashReserve: -30000, marketScore: 3 },
        msg: "提高了薪资，终于招到了合适的人。但人力成本大幅上升。",
      },
      {
        text: "找猎头",
        effect: { cashReserve: -20000, marketScore: 2 },
        msg: "找了猎头，花了¥2万服务费，一个月内招到了3个合适的人。",
      },
    ],
  },

  // 16. 现金流危机
  {
    id: "growth_cash_crisis",
    name: "现金流危机",
    stage: "growth",
    triggerDayMin: 170,
    triggerDayMax: 270,
    industries: ["*"],
    title: "资金链告急",
    desc: "账面现金只够撑1个月了。收入增长不如预期，支出却在增加。",
    options: [
      {
        text: "紧急裁员降本",
        effect: { cashReserve: 10000, reputation: -5, marketScore: -3 },
        msg: "裁掉了20%的员工，节省了开支。但士气大挫，产品进度受影响。",
      },
      {
        text: "紧急融资",
        effect: { cashReserve: 150000, reputation: -3 },
        msg: "紧急联系了投资人，以较低估值融了¥15万。虽然贵但活下来了。",
      },
      {
        text: "创始人垫资",
        effect: { cashReserve: 50000, reputation: 2 },
        msg: "你自掏腰包垫了¥5万，暂时缓解了危机。但个人财务压力增大。",
      },
    ],
  },

  // 17. 政策变化
  {
    id: "growth_policy_change",
    name: "行业政策变化",
    stage: "growth",
    triggerDayMin: 180,
    triggerDayMax: 280,
    industries: ["finance", "healthcare", "education"],
    title: "行业监管收紧",
    desc: "政府出台了新的行业监管政策，你们的部分业务可能不合规。",
    options: [
      {
        text: "立即调整业务",
        effect: { cashReserve: -30000, marketScore: -2, reputation: 2 },
        msg: "主动调整业务符合新规，虽然短期收入下降，但合规了。",
      },
      {
        text: "游说政策放宽",
        effect: { cashReserve: -20000, reputation: 1 },
        msg: "花了钱请游说公司，政策有一定松动。但效果有限。",
      },
      {
        text: "观望，看同行怎么做",
        effect: { reputation: -3, marketScore: -2 },
        msg: "选择了观望，但监管先查了你们，罚款¥10万，业务暂停一个月。",
      },
    ],
  },

  // 18. 创始人健康问题
  {
    id: "growth_founder_health",
    name: "创始人健康问题",
    stage: "growth",
    triggerDayMin: 190,
    triggerDayMax: 290,
    industries: ["*"],
    conditions: function (st) { if (!st.needs || st.needs.fatigue < 60) return false; return true; }, // [Layer3]
    title: "你病倒了",
    desc: "长期高压工作让你病倒了。医生建议休息2-4周。但公司离不开你。",
    options: [
      {
        text: "请假休息",
        effect: { reputation: -2, marketScore: -3 },
        msg: "休息了3周，公司由联合创始人代管。虽然业务有些下滑，但你恢复了健康。",
      },
      {
        text: "边治疗边工作",
        effect: { reputation: -1 },
        msg: "边治疗边工作，效果一般。病情有所反复，但公司没出大问题。",
      },
      {
        text: "请职业经理人暂代",
        effect: { cashReserve: -20000, reputation: 1 },
        msg: "请了职业经理人暂代管理，你专心治疗。公司运转正常，但你有些担心控制权。",
      },
    ],
  },
];

// ====== 成熟期事件（B轮后/团队20人以上）======
const STARTUP_EVENTS_MATURE = [
  // 19. IPO辅导
  {
    id: "mature_ipo_prep",
    name: "IPO辅导",
    stage: "mature",
    triggerDayMin: 250,
    triggerDayMax: 400,
    industries: ["*"],
    title: "券商IPO辅导",
    desc: "一家头部券商表达了IPO辅导意向。上市需要1-2年准备，费用¥100万起步。",
    options: [
      {
        text: "启动IPO",
        effect: { cashReserve: -100000, reputation: 5 },
        msg: "启动了IPO辅导，花了¥10万首期费用。虽然路很长，但这是创业者的终极目标。",
      },
      {
        text: "再等等，估值还不够",
        effect: { marketScore: -1 },
        msg: "决定再积累一些业绩再启动IPO。但竞争对手抢先提交了申请。",
      },
      {
        text: "考虑港股/美股",
        effect: { cashReserve: -5000, reputation: 2 },
        msg: "研究了港股和美股的上市条件，各有优劣。决定再观察一段时间。",
      },
    ],
  },

  // 19. 并购邀约
  {
    id: "mature_acquisition",
    name: "巨头并购邀约",
    stage: "mature",
    triggerDayMin: 260,
    triggerDayMax: 420,
    industries: ["*"],
    title: "巨头想收购你们",
    desc: "一家行业巨头提出了并购邀约，估值是你们当前估值的1.5倍。接受意味着失去独立。",
    options: [
      {
        text: "接受收购",
        effect: { reputation: 2 },
        msg: "接受了收购，获得了巨额回报。但公司成为了巨头的一部分，不再独立。",
      },
      {
        text: "拒绝，独立发展",
        effect: { marketScore: 3, reputation: 3 },
        msg: "拒绝了收购，选择独立发展。员工们为你的决定感到骄傲。",
      },
      {
        text: "还价，谈战略合作",
        effect: { cashReserve: 100000, reputation: 1 },
        msg: "还价后达成了战略合作而非收购，巨头投资了你们，保留了独立性。",
      },
    ],
  },

  // 20. 反垄断调查
  {
    id: "mature_antitrust",
    name: "反垄断调查",
    stage: "mature",
    triggerDayMin: 280,
    triggerDayMax: 450,
    industries: ["tech", "finance"],
    title: "反垄断调查",
    desc: "监管部门对你们启动了反垄断调查，指控你们滥用市场支配地位。",
    options: [
      {
        text: "配合调查，整改",
        effect: { cashReserve: -50000, marketScore: -5, reputation: -2 },
        msg: "配合调查并进行了整改，支付了¥5万罚款。业务受到一定限制。",
      },
      {
        text: "强硬对抗",
        effect: { cashReserve: -100000, reputation: -5 },
        msg: "聘请律师团队对抗调查，花了¥10万。但最终败诉，罚款¥50万。",
      },
      {
        text: "和解，承诺不滥用",
        effect: { cashReserve: -20000, reputation: -1 },
        msg: "达成了和解，承诺不滥用市场地位。罚款¥2万，业务基本不受影响。",
      },
    ],
  },

  // 21. 第二增长曲线
  {
    id: "mature_second_curve",
    name: "第二增长曲线",
    stage: "mature",
    triggerDayMin: 300,
    triggerDayMax: 500,
    industries: ["*"],
    title: "寻找第二增长曲线",
    desc: "核心业务增长放缓，需要找到新的增长点。你有三个方向可选。",
    options: [
      {
        text: "横向扩展相关产品",
        effect: { cashReserve: -50000, marketScore: 5, revenue: 30000 },
        msg: "开发了相关产品，成功找到了第二增长曲线。收入开始多元化。",
      },
      {
        text: "纵向整合上下游",
        effect: { cashReserve: -100000, marketScore: 3 },
        msg: "投资了上下游企业，实现了纵向整合。但投资回收期较长。",
      },
      {
        text: "跨界进入新领域",
        effect: { cashReserve: -80000, marketScore: -2, reputation: -1 },
        msg: "跨界进入了一个新领域，但水土不服，初期亏损严重。",
      },
    ],
  },

  // 22. 核心团队成员离职创业
  {
    id: "mature_team_left",
    name: "核心团队离职创业",
    stage: "mature",
    triggerDayMin: 320,
    triggerDayMax: 520,
    industries: ["*"],
    title: "核心团队成员离职创业",
    desc: "你的CTO/COO决定离职创业，而且方向和你高度重合。他邀请你投资。",
    // [Layer3] 叙事说"你的CTO/COO决定离职创业"，但CTO/COO角色在系统中不存在，此为叙事超前问题，加条件防误触
    // [全系统自洽修复] 域H 修复:门控键 condition→conditions(triggerStartupEvent 只读复数,原为死门控) + st.company→st.startup.company(原引用不存在字段→无员工时也误触"核心团队离职"叙事矛盾)
    conditions: function (st) { return st.startup && st.startup.company && st.startup.company.employees && st.startup.company.employees.length >= 3; },
    options: [
      {
        text: "投资他，做战略投资",
        effect: { cashReserve: -30000, reputation: 2 },
        msg: "投资了¥3万，做了战略投资。虽然多了一个竞争对手，但也多了一个合作伙伴。",
      },
      {
        text: "挽留，给更多股权",
        effect: { cashReserve: -20000, reputation: 1 },
        msg: "给了他更多股权试图挽留，他暂时留下了。但你担心他迟早会走。",
      },
      {
        text: "祝福，好聚好散",
        effect: { reputation: -1, marketScore: -2 },
        msg: "祝福他创业成功。他走了，带走了几个核心员工，成立了一家竞争对手。",
      },
    ],
  },

  // 23. 行业黑天鹅
  {
    id: "mature_black_swan",
    name: "行业黑天鹅",
    stage: "mature",
    triggerDayMin: 350,
    triggerDayMax: 550,
    industries: ["*"],
    title: "行业突发重大变故",
    desc: "行业突发重大变故（政策突变/技术颠覆/经济危机），整个行业受到冲击。",
    options: [
      {
        text: "收缩防守",
        effect: { cashReserve: 50000, marketScore: -5, reputation: -2 },
        msg: "选择了收缩防守，裁掉了部分业务。虽然保住了现金，但市场份额下降。",
      },
      {
        text: "逆势扩张",
        effect: { cashReserve: -100000, marketScore: 8, reputation: 3 },
        msg: "逆势扩张，收购了陷入困境的竞争对手。风险很大，但机会也很大。",
      },
      {
        text: "转型新方向",
        effect: { cashReserve: -60000, marketScore: 2, reputation: 1 },
        msg: "快速转型到新方向，虽然短期阵痛，但找到了新的生存空间。",
      },
    ],
  },

  // 24. 员工持股计划
  {
    id: "mature_esop",
    name: "员工持股计划",
    stage: "mature",
    triggerDayMin: 360,
    triggerDayMax: 560,
    industries: ["*"],
    title: "实施员工持股计划",
    desc: "公司发展到一定阶段，需要考虑员工持股计划（ESOP）来激励和留住人才。",
    options: [
      {
        text: "设立15%期权池",
        effect: { cashReserve: -10000, reputation: 3, marketScore: 2 },
        msg: "设立了15%的期权池，员工士气大振。招聘也更容易了。",
      },
      {
        text: "设立5%期权池",
        effect: { reputation: 1 },
        msg: "设立了5%的期权池，规模较小但聊胜于无。部分员工觉得不够。",
      },
      {
        text: "暂不设立，用现金激励",
        effect: { cashReserve: -30000, marketScore: -1 },
        msg: "决定暂不设立ESOP，用现金奖金激励。短期有效但长期吸引力不足。",
      },
    ],
  },

  // 25. 社会责任
  {
    id: "mature_csr",
    name: "企业社会责任",
    stage: "mature",
    triggerDayMin: 380,
    triggerDayMax: 600,
    industries: ["*"],
    conditions: function (st) { if (!st.startup || !st.startup.company || st.startup.company.reputation < 20) return false; return true; }, // [Layer3]
    title: "企业社会责任",
    desc: "公司已经有一定规模和社会影响力，需要考虑承担更多社会责任。",
    options: [
      {
        text: "设立公益基金",
        effect: { cashReserve: -50000, reputation: 5, marketScore: 2 },
        msg: "设立了公益基金，每年投入¥5万做公益。社会声誉大幅提升。",
      },
      {
        text: "员工志愿服务",
        effect: { cashReserve: -5000, reputation: 2, marketScore: 1 },
        msg: "组织了员工志愿服务日，成本不高但效果不错。",
      },
      {
        text: "不做，专注商业",
        effect: { reputation: -1 },
        msg: "决定专注商业，不做公益。有媒体批评你们缺乏社会责任感。",
      },
    ],
  },
];

// ====== 行业专属事件 ======

// 科技行业
const STARTUP_EVENTS_TECH = [
  {
    id: "tech_open_source",
    name: "开源社区争议",
    stage: "seed",
    triggerDayMin: 40,
    triggerDayMax: 120,
    industries: ["tech"],
    title: "开源社区争议",
    desc: "你们的产品使用了某开源项目，但被社区指责没有遵守开源协议。",
    options: [
      {
        text: "遵守协议，公开代码",
        effect: { cashReserve: -5000, technologyScore: 3, reputation: 2 },
        msg: "遵守了开源协议，公开了相关代码。社区态度缓和，还贡献了一些改进。",
      },
      {
        text: "购买商业授权",
        effect: { cashReserve: -20000, reputation: 1 },
        msg: "花了¥2万购买了商业授权，解决了争议。但成本增加了。",
      },
      {
        text: "无视，继续用",
        effect: { reputation: -5, technologyScore: -2 },
        msg: "无视了社区指责，但后来被起诉，花了更多钱和解。",
      },
    ],
  },
  {
    id: "tech_ai_disruption",
    name: "AI技术颠覆",
    stage: "growth",
    triggerDayMin: 150,
    triggerDayMax: 300,
    industries: ["tech"],
    title: "AI技术颠覆",
    desc: "AI技术快速发展，你们的核心产品可能被AI替代。需要决定如何应对。",
    options: [
      {
        text: "拥抱AI，产品升级",
        effect: { cashReserve: -40000, technologyScore: 10, marketScore: 5 },
        msg: "投入资源将产品AI化，成功转型。产品竞争力大幅提升。",
      },
      {
        text: "观望，等技术成熟",
        effect: { marketScore: -3, reputation: -1 },
        msg: "选择了观望，但竞争对手抢先AI化了，你们落后了。",
      },
      {
        text: "收购AI初创公司",
        effect: { cashReserve: -150000, technologyScore: 8 },
        msg: "收购了一家AI初创公司，快速获得了AI能力。但整合需要时间。",
      },
    ],
  },
];

// 消费行业
const STARTUP_EVENTS_CONSUMER = [
  {
    id: "consumer_viral",
    name: "网红带货",
    stage: "growth",
    triggerDayMin: 120,
    triggerDayMax: 250,
    industries: ["consumer"],
    title: "网红想带货",
    desc: "一个拥有百万粉丝的网红想帮你们带货，佣金20% + ¥10万坑位费。",
    options: [
      {
        text: "合作！",
        effect: { cashReserve: -100000, marketScore: 10, revenue: 200000 },
        msg: "合作了，网红带货效果惊人，当天卖了¥20万。虽然成本高但值得。",
      },
      {
        text: "谈低佣金",
        effect: { cashReserve: -50000, marketScore: 5, revenue: 100000 },
        msg: "谈到了10%佣金 + ¥5万坑位费，效果不错但没原来那么好。",
      },
      {
        text: "拒绝，自己做内容",
        effect: { cashReserve: -10000, marketScore: 2 },
        msg: "拒绝了网红，自己做了内容营销。效果慢但成本低，长期有价值。",
      },
    ],
  },
  {
    id: "consumer_supply_chain",
    name: "供应链断裂",
    stage: "growth",
    triggerDayMin: 180,
    triggerDayMax: 350,
    industries: ["consumer"],
    title: "供应链断裂",
    desc: "主要供应商突然停产，你们的原材料供应中断。需要紧急寻找替代方案。",
    options: [
      {
        text: "找替代供应商",
        effect: { cashReserve: -30000, marketScore: -2 },
        msg: "找到了替代供应商，但成本更高、质量稍差。产品口碑有些下降。",
      },
      {
        text: "囤货，等恢复",
        effect: { cashReserve: -50000, marketScore: -3 },
        msg: "用现有库存撑了2个月，直到供应商恢复。但期间损失了部分客户。",
      },
      {
        text: "自建供应链",
        effect: { cashReserve: -150000, marketScore: 3 },
        msg: "决定自建供应链，虽然前期投入大，但长期可控性更强。",
      },
    ],
  },
];

// 金融科技
const STARTUP_EVENTS_FINTECH = [
  {
    id: "fintech_license",
    name: "牌照申请",
    stage: "growth",
    triggerDayMin: 150,
    triggerDayMax: 300,
    industries: ["finance"],
    title: "金融牌照申请",
    desc: "业务规模扩大，需要申请金融牌照才能合规运营。申请费¥20万，审批6-12个月。",
    options: [
      {
        text: "立即申请",
        effect: { cashReserve: -200000, reputation: 3 },
        msg: "提交了申请，花了¥20万。审批期间业务受限，但合规了。",
      },
      {
        text: "找持牌机构合作",
        effect: { cashReserve: -50000, reputation: -1 },
        msg: "找了持牌机构合作，业务可以继续进行。但利润需要分成。",
      },
      {
        text: "先不做，等政策明朗",
        effect: { marketScore: -3, reputation: -2 },
        msg: "选择了观望，但监管先查了你们，罚款¥30万，业务暂停。",
      },
    ],
  },
];

// 医疗健康
const STARTUP_EVENTS_HEALTHCARE = [
  {
    id: "healthcare_trial",
    name: "临床试验结果",
    stage: "growth",
    triggerDayMin: 200,
    triggerDayMax: 400,
    industries: ["healthcare"],
    title: "临床试验结果出炉",
    desc: "核心产品的临床试验结果出来了。结果可能很好，也可能一般。",
    options: [
      {
        text: "公布结果，推进上市",
        effect: { cashReserve: -50000, reputation: 3, marketScore: 5 },
        msg: "公布了积极的试验结果，推进产品上市审批。投资者信心大增。",
      },
      {
        text: "补充试验",
        effect: { cashReserve: -30000, marketScore: -1 },
        msg: "觉得结果不够好，决定补充试验。时间推迟了半年。",
      },
      {
        text: "私下找专家评估",
        effect: { cashReserve: -10000 },
        msg: "找了行业专家私下评估，得到了改进建议。花了钱但值得。",
      },
    ],
  },
];

// 教育行业
const STARTUP_EVENTS_EDUCATION = [
  {
    id: "education_policy",
    name: "教育政策变化",
    stage: "growth",
    triggerDayMin: 150,
    triggerDayMax: 300,
    industries: ["education"],
    title: "教育政策重大调整",
    desc: "教育部门出台了新政策，对在线教育/培训行业有重大影响。",
    options: [
      {
        text: "转型职业教育",
        effect: { cashReserve: -30000, marketScore: 2, reputation: 2 },
        msg: "快速转型到职业教育赛道，避开了政策冲击。新赛道有增长潜力。",
      },
      {
        text: "转向海外业务",
        effect: { cashReserve: -50000, marketScore: 1 },
        msg: "开始布局海外市场，但水土不服，初期进展缓慢。",
      },
      {
        text: "坚持原有业务",
        effect: { marketScore: -5, reputation: -3 },
        msg: "坚持原有业务，但被限缩范围，收入大幅下降。",
      },
    ],
  },
];

// 制造行业
const STARTUP_EVENTS_MANUFACTURING = [
  {
    id: "manufacturing_quality",
    name: "质量召回",
    stage: "growth",
    triggerDayMin: 180,
    triggerDayMax: 350,
    industries: ["manufacturing"],
    title: "产品质量问题",
    desc: "一批产品被发现存在质量缺陷，可能需要召回。",
    options: [
      {
        text: "主动召回",
        effect: { cashReserve: -80000, reputation: -3, marketScore: -2 },
        msg: "主动召回了有缺陷的产品，虽然损失了¥8万，但维护了品牌声誉。",
      },
      {
        text: "悄悄替换",
        effect: { cashReserve: -30000, reputation: -6 },
        msg: "试图悄悄替换问题产品，但被消费者发现了，舆论爆炸。",
      },
      {
        text: "改进工艺，不再生产",
        effect: { cashReserve: -40000, marketScore: -1 },
        msg: "改进了生产工艺，停止了问题产品的生产。但已经售出的产品还在市场上。",
      },
    ],
  },
];

// ====== 事件注册表 ======
const ALL_STARTUP_EVENTS = [
  ...STARTUP_EVENTS_SEED,
  ...STARTUP_EVENTS_GROWTH,
  ...STARTUP_EVENTS_MATURE,
  ...STARTUP_EVENTS_TECH,
  ...STARTUP_EVENTS_CONSUMER,
  ...STARTUP_EVENTS_FINTECH,
  ...STARTUP_EVENTS_HEALTHCARE,
  ...STARTUP_EVENTS_EDUCATION,
  ...STARTUP_EVENTS_MANUFACTURING,
];

// ====== 触发事件的主函数 ======
/**
 * 每日随机触发创业事件
 * @param {Object} state - 游戏状态
 */
function triggerStartupEvent(state) {
  const startup = state.startup;
  const company = startup.company;
  if (!company) return;

  // 确定当前阶段
  const phase = company.phase || "seed";
  const stage =
    phase === "seed" ? "seed" : phase === "growth" ? "growth" : "mature";
  const industry = company.industry;
  const day = state.player.day;

  // 筛选可用事件
  const candidates = ALL_STARTUP_EVENTS.filter((evt) => {
    // 阶段匹配
    if (evt.stage !== stage) return false;
    // 行业匹配
    if (evt.industries[0] !== "*" && !evt.industries.includes(industry))
      return false;
    // 天数范围
    if (day < evt.triggerDayMin || day > evt.triggerDayMax + 200) return false;
    // 检查是否已触发过（每个事件限一次）
    if (startup.flags._eventTriggered && startup.flags._eventTriggered[evt.id])
      return false;
    // [Layer3] conditions 门控
    if (typeof evt.conditions === "function" && !evt.conditions(state))
      return false;

    return true;
  });

  if (candidates.length === 0) return;

  // 随机选一个
  const event = Random.fromArray(candidates);

  // 标记已触发
  if (!startup.flags._eventTriggered) startup.flags._eventTriggered = {};
  startup.flags._eventTriggered[event.id] = true;

  // 显示事件弹窗
  showStartupEventModal(state, event);
}

// [CoC] 声明式效果映射 — 新增公司效果字段只需在此加一行，零代码修改
function _applyStartupEffects(company, effects) {
  if (!effects) return;
  var STARTUP_FIELD_MAP = {
    cashReserve: { clamp: true, min: -Infinity, max: Infinity },
    reputation: { clamp: true, min: 0, max: 100 },
    marketScore: { clamp: true, min: 0, max: 100 },
    technologyScore: { clamp: true, min: 0, max: 100 },
    // [全系统自洽修复] 域H 修复:revenue 是公司真实字段(startup.js:1530/1754 KPI 评分读取),但原映射表遗漏→mature_second_curve 选项承诺的 +30000 营收被静默丢弃(数据与描述不符)
    revenue: { clamp: true, min: 0, max: Infinity },
  };
  for (var key in effects) {
    if (!effects.hasOwnProperty(key) || key === "additionalEffect") continue;
    var rule = STARTUP_FIELD_MAP[key];
    if (!rule) continue;
    var delta = effects[key];
    if (!delta) continue;
    if (rule.clamp) {
      company[key] = Math.max(
        rule.min,
        Math.min(rule.max, (company[key] || 0) + delta),
      );
    } else {
      company[key] = (company[key] || 0) + delta;
    }
  }
}

/** 显示创业事件弹窗 */
function showStartupEventModal(state, event) {
  if (typeof showModal !== "function") return;

  const company = state.startup.company;

  // 构建选项HTML
  let optionsHtml = "";
  for (let i = 0; i < event.options.length; i++) {
    const opt = event.options[i];
    optionsHtml +=
      '<div class="startup-event-option" data-index="' +
      i +
      "\" style=\"padding:12px;margin:8px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;cursor:pointer;transition:all 0.2s;\" onmouseover=\"this.style.borderColor='var(--accent)';this.style.background='var(--bg-secondary)';\" onmouseout=\"this.style.borderColor='var(--border)';this.style.background='var(--bg-card)';\">" +
      '<div style="font-weight:bold;color:var(--text-primary);margin-bottom:6px;">' +
      _esc(opt.text) +
      "</div>" +
      '<div style="font-size:11px;color:var(--text-muted);">' +
      _esc(opt.msg) +
      "</div>" +
      "</div>";
  }

  const bodyHtml =
    '<div style="font-size:13px;">' +
    '<div style="padding:8px;background:rgba(0,0,0,0.15);border-radius:6px;margin-bottom:12px;font-size:11px;color:var(--text-muted);">' +
    "🏢 「" +
    _esc(company.name) +
    "」 · " +
    (company.phase === "seed"
      ? "种子期"
      : company.phase === "growth"
        ? "成长期"
        : "成熟期") +
    " · " +
    "第" +
    (state.player.day - company.foundedDay + 1) +
    "天" +
    "</div>" +
    '<h4 style="color:var(--accent);margin-bottom:8px;">📰 ' +
    _esc(event.title) +
    "</h4>" +
    '<p style="color:var(--text-secondary);margin-bottom:12px;">' +
    _esc(event.desc) +
    "</p>" +
    '<div style="margin-bottom:8px;font-size:12px;color:var(--text-muted);">选择你的应对策略：</div>' +
    optionsHtml +
    "</div>";

  showModal({
    title: "📰 创业事件",
    body: bodyHtml,
    buttons: [{ text: "关闭", cls: "", callback: function () {} }],
  });

  // 绑定选项点击
  setTimeout(function () {
    document
      .querySelectorAll(".startup-event-option")
      .forEach(function (el, idx) {
        el.addEventListener("click", function () {
          const opt = event.options[idx];
          // [CoC] 声明式效果自动应用 — 取代手写 if-else 链
          if (opt.effect) {
            _applyStartupEffects(company, opt.effect);
            if (opt.effect.additionalEffect) {
              _applyStartupEffects(company, opt.effect.additionalEffect());
            }
          }
          StateManager.addMessage(opt.msg, "event");
          document.querySelector(".modal-overlay")?.remove();
          if (typeof renderAll === "function") renderAll();
        });
      });
  }, 50);
}

// ====== 导出 ======
if (typeof window !== "undefined") {
  window.STARTUP_EVENTS_SEED = STARTUP_EVENTS_SEED;
  window.STARTUP_EVENTS_GROWTH = STARTUP_EVENTS_GROWTH;
  window.STARTUP_EVENTS_MATURE = STARTUP_EVENTS_MATURE;
  window.ALL_STARTUP_EVENTS = ALL_STARTUP_EVENTS;
  window.triggerStartupEvent = triggerStartupEvent;
  window.showStartupEventModal = showStartupEventModal;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ALL_STARTUP_EVENTS,
    triggerStartupEvent,
    showStartupEventModal,
  };
}
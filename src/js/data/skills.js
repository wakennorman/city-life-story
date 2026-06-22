/**
 * 证书/技能训练定义
 * 可在培训中心考取
 */

const CERTIFICATES = [
  {
    id: "construction_safety",
    name: "建筑安全证",
    desc: "进入建筑工地的必要条件，减少受伤风险50%",
    requirements: { cash: 300, intelligence: 20 },
    effects: { injuryReduction: 0.5 },
    examPassRate: 0.85,
  },
  {
    id: "coding_basic",
    name: "编程基础证书",
    desc: "证明你具备基本编程能力，进入职场的重要敲门砖",
    requirements: { cash: 500, intelligence: 35 },
    effects: { codingXp: 50, intelligence: 2 },
    examPassRate: 0.65,
  },
  {
    id: "accounting_cert",
    name: "会计从业证",
    desc: "可以做会计类工作，收入稳定",
    requirements: { cash: 400, intelligence: 30 },
    effects: { accountingXp: 40, intelligence: 1 },
    examPassRate: 0.7,
  },
  {
    id: "welding_cert",
    name: "焊工证",
    desc: "特种作业证书，焊工工资高",
    requirements: { cash: 600, physique: 35 },
    effects: { weldingXp: 50, physique: 2 },
    examPassRate: 0.75,
  },
  {
    id: "driver_license",
    name: "驾照",
    desc: "可以开车，解锁送货司机等高收入工作",
    requirements: { cash: 800, agility: 25 },
    effects: { drivingXp: 40, agility: 1 },
    examPassRate: 0.6,
  },
  {
    id: "english_cert",
    name: "英语四级证书",
    desc: "证明英语水平，对外企和家教有帮助",
    requirements: { cash: 350, intelligence: 40 },
    effects: { englishXp: 60, intelligence: 2 },
    examPassRate: 0.55,
  },
  {
    id: "electrician_cert",
    name: "电工证",
    desc: "家电维修和工业电工的必备证书",
    requirements: { cash: 500, repair: 20, intelligence: 25 },
    effects: { electricianXp: 50, repair: 3 },
    examPassRate: 0.7,
  },
  {
    id: "management_cert",
    name: "管理师证书",
    desc: "职场晋升的加分项",
    requirements: { cash: 800, intelligence: 45 },
    effects: { managementXp: 50, intelligence: 3 },
    examPassRate: 0.5,
  },

  // ============================================================
  // 待完成：新增证书 — 参考《大多数》证书系统 + 真实中国职业资格目录(2024版) + 《北京浮生记》
  // 实现提示：在 CERTIFICATES 数组中追加，注意 effects 字段与现有技能系统兼容
  // 参考来源：
  //   - 人社部《国家职业资格目录（2024年版）》：真实职业资格清单
  //   - 《大多数》证书系统：游戏化证书设计思路
  //   - 真实培训考证费用：参考各地培训市场价
  //   - 真实考试通过率：参考各职业资格官方公布数据
  // ============================================================
  //
  // 【证书设计原则】：
  // 1. 每个证书对应真实中国职业资格（参考人社部目录）
  // 2. 考试通过率反映真实难度（参考真实数据）
  // 3. 效果设计参考《大多数》装备/技能加成系统
  // 4. 价格参考真实培训考证费用（2024年市场价）
  //
  // === 医疗健康类 ===
  // TODO: 待实现 - 护理员证（参考真实护理员培训¥2000-4000，通过率约70%）
  // {
  //   id: "nursing_cert",
  //   name: "护理员证",
  //   desc: "经过专业培训取得护理员资格，可以从事护工/养老院护理工作。老龄化社会需求旺盛。",
  //   requirements: { cash: 400, mental: 25, ageMin: 18, ageMax: 55 },
  //   effects: { caregiverXp: 50, illnessRiskReduction: 0.1, hospitalJobIncomeBonus: 0.15 },
  //   examPassRate: 0.70,
  //   trainingDays: 7,
  // },
  // TODO: 待实现 - 健康管理师（新兴职业，参考真实培训费¥3000-5000）
  // {
  //   id: "health_manager_cert",
  //   name: "健康管理师",
  //   desc: "为个人或企业提供健康咨询和健康管理服务。新兴高收入职业。",
  //   requirements: { cash: 800, intelligence: 40, mental: 35 },
  //   effects: { healthConsultingXp: 40, intelligence: 2, healthJobIncomeBonus: 0.2 },
  //   examPassRate: 0.55,
  //   trainingDays: 14,
  // },
  // TODO: 待实现 - 康复理疗师（参考真实康复理疗师培训）
  // {
  //   id: "rehabilitation_cert",
  //   name: "康复理疗师",
  //   desc: "可以从事康复理疗/按摩推拿工作。老龄化+亚健康时代需求旺盛。",
  //   requirements: { cash: 700, mental: 30, physique: 25 },
  //   effects: { rehabilitationXp: 40, massageJobUnlock: true, healthJobIncomeBonus: 0.18 },
  //   examPassRate: 0.62,
  //   trainingDays: 10,
  // },
  //
  // === 安全生产类 ===
  // TODO: 待实现 - 食品健康证（真实费用¥100-200，体检+培训，通过率90%+）
  // {
  //   id: "food_health_cert",
  //   name: "食品健康证",
  //   desc: "从事餐饮/食品行业的法定必备证件。持有后食品安全事件免疫，餐饮工作收入+10%。",
  //   requirements: { cash: 200, hygiene: 15, ageMin: 16 },
  //   effects: { foodJobIncomeBonus: 0.1, foodSafetyImmune: true, illnessRiskReduction: 0.05 },
  //   examPassRate: 0.92,
  //   trainingDays: 1,
  // },
  // TODO: 待实现 - 消防证（参考真实消防设施操作员培训¥1500-3000）
  // {
  //   id: "fire_safety_cert",
  //   name: "消防证",
  //   desc: "工地/工厂/物业的消防安全证书。受伤概率-15%，消防类工作解锁。",
  //   requirements: { cash: 300, physique: 20, ageMin: 18, ageMax: 50 },
  //   effects: { injuryReduction: 0.15, fireJobUnlock: true },
  //   examPassRate: 0.78,
  //   trainingDays: 5,
  // },
  // TODO: 待实现 - 特种作业操作证（电工/焊工/高处作业，参考真实应急管理部规定）
  // {
  //   id: "special_ops_cert",
  //   name: "特种作业操作证",
  //   desc: "从事电工/焊工/高处作业的必备证件。解锁高收入特种工作，受伤概率-10%。",
  //   requirements: { cash: 600, physique: 25, intelligence: 20, ageMin: 18, ageMax: 55 },
  //   effects: { specialJobUnlock: true, injuryReduction: 0.1, specialJobIncomeBonus: 0.25 },
  //   examPassRate: 0.65,
  //   trainingDays: 10,
  // },
  // TODO: 待实现 - 高处作业证（参考真实高处安装/维护/拆除作业证）
  // {
  //   id: "height_work_cert",
  //   name: "高处作业证",
  //   desc: "可以从事高空安装/维护/拆除工作。解锁高空作业高薪工作。",
  //   requirements: { cash: 500, physique: 30, agility: 25, ageMin: 18, ageMax: 45 },
  //   effects: { heightWorkUnlock: true, heightWorkIncomeBonus: 0.35, injuryReduction: 0.08 },
  //   examPassRate: 0.58,
  //   trainingDays: 7,
  // },
  //
  // === IT/互联网类 ===
  // TODO: 待实现 - IT支持证（参考真实CompTIA A+认证思路）
  // {
  //   id: "it_support_cert",
  //   name: "IT支持证",
  //   desc: "可以从事IT客服/技术支持/网络维护工作。收入+20%，IT类工作XP获取+15%。",
  //   requirements: { cash: 600, intelligence: 30, coding: 10, ageMin: 18 },
  //   effects: { itJobIncomeBonus: 0.2, codingXp: 30, techJobUnlock: true },
  //   examPassRate: 0.58,
  //   trainingDays: 7,
  // },
  // TODO: 待实现 - 网络安全证（参考真实CISP认证思路，新兴热门）
  // {
  //   id: "security_cert",
  //   name: "网络安全证",
  //   desc: "可以从事网络安全/渗透测试/安全运维工作。新兴高薪职业。",
  //   requirements: { cash: 1000, intelligence: 45, coding: 25, ageMin: 20 },
  //   effects: { securityJobIncomeBonus: 0.3, codingXp: 50, hackingXp: 30 },
  //   examPassRate: 0.45,
  //   trainingDays: 21,
  // },
  // TODO: 待实现 - 数据分析师证（参考真实CDA认证）
  // {
  //   id: "data_analyst_cert",
  //   name: "数据分析师证",
  //   desc: "可以从事数据分析/市场调研/商业智能工作。收入+25%。",
  //   requirements: { cash: 800, intelligence: 40, accounting: 15, ageMin: 20 },
  //   effects: { analyticsJobIncomeBonus: 0.25, intelligence: 3, accountingXp: 40 },
  //   examPassRate: 0.50,
  //   trainingDays: 14,
  // },
  // TODO: 待实现 - 云计算工程师证（参考真实阿里云/华为云认证）
  // {
  //   id: "cloud_engineer_cert",
  //   name: "云计算工程师证",
  //   desc: "可以从事云计算/运维/架构工作。新兴高薪领域。",
  //   requirements: { cash: 1200, intelligence: 45, coding: 30, ageMin: 20 },
  //   effects: { cloudJobUnlock: true, cloudJobIncomeBonus: 0.3, codingXp: 60 },
  //   examPassRate: 0.40,
  //   trainingDays: 21,
  // },
  //
  // === 金融/财会类 ===
  // TODO: 待实现 - 理财顾问证（参考真实基金/证券从业资格）
  // {
  //   id: "financial_advisor_cert",
  //   name: "理财顾问证",
  //   desc: "可以从事理财咨询/基金销售/保险代理工作。投资收入+10%，金融工作解锁。",
  //   requirements: { cash: 800, intelligence: 40, accounting: 20, ageMin: 18 },
  //   effects: { investmentIncomeBonus: 0.1, accountingXp: 40, financeJobUnlock: true },
  //   examPassRate: 0.48,
  //   trainingDays: 10,
  // },
  // TODO: 待实现 - 会计职称（参考真实初级会计职称考试）
  // {
  //   id: "accounting_title",
  //   name: "初级会计职称",
  //   desc: "会计专业职称，可以从事更高级的财务工作。收入+15%，会计XP+30。",
  //   requirements: { cash: 500, intelligence: 35, accounting: 25, ageMin: 18 },
  //   effects: { accountingJobIncomeBonus: 0.15, accountingXp: 30, financeJobUnlock: true },
  //   examPassRate: 0.42,
  //   trainingDays: 14,
  // },
  // TODO: 待实现 - 注册会计师（CPA，参考真实CPA考试，通过率约10%）
  // {
  //   id: "cpa_cert",
  //   name: "注册会计师(CPA)",
  //   desc: "中国会计领域顶级证书。可以从事审计/财务顾问/高级财务工作。",
  //   requirements: { cash: 1500, intelligence: 55, accounting: 40, ageMin: 22, education: 2 },
  //   effects: { cpaJobUnlock: true, cpaJobIncomeBonus: 0.5, accountingXp: 100, intelligence: 5 },
  //   examPassRate: 0.10,
  //   trainingDays: 90,
  // },
  // TODO: 待实现 - 教师资格证（参考真实教资考试，通过率约30%）
  // {
  //   id: "teaching_cert",
  //   name: "教师资格证",
  //   desc: "可以从事家教/培训讲师/学校助教工作。收入+25%，教育类XP+20%。",
  //   requirements: { cash: 500, intelligence: 45, english: 25, ageMin: 18 },
  //   effects: { teachingJobIncomeBonus: 0.25, intelligence: 3, educationXpBonus: 0.2 },
  //   examPassRate: 0.35,
  //   trainingDays: 21,
  // },
  //
  // === 生活服务类 ===
  // TODO: 待实现 - 美容师证（参考真实美容师职业资格）
  // {
  //   id: "beautician_cert",
  //   name: "美容师证",
  //   desc: "可以从事美容/美甲/化妆工作。收入+20%，美容XP+30。",
  //   requirements: { cash: 600, agility: 20, ageMin: 18, ageMax: 45 },
  //   effects: { beautyJobIncomeBonus: 0.2, beautyXp: 30, beautyJobUnlock: true },
  //   examPassRate: 0.68,
  //   trainingDays: 10,
  // },
  // TODO: 待实现 - 健身教练证（参考真实国职健身教练认证）
  // {
  //   id: "fitness_coach_cert",
  //   name: "健身教练证",
  //   desc: "可以从事健身教练/私教工作。收入+30%，体质XP+20%。",
  //   requirements: { cash: 1000, physique: 40, ageMin: 18, ageMax: 45 },
  //   effects: { fitnessJobIncomeBonus: 0.3, physiqueXpBonus: 0.2, fitnessJobUnlock: true },
  //   examPassRate: 0.55,
  //   trainingDays: 14,
  // },
  // TODO: 待实现 - 快递员证/物流证（参考真实快递员职业技能）
  // {
  //   id: "logistics_cert",
  //   name: "物流从业证",
  //   desc: "可以从事快递/物流/仓储管理高级工作。配送收入+15%，路线规划效率+10%。",
  //   requirements: { cash: 300, agility: 20, ageMin: 18, ageMax: 50 },
  //   effects: { deliveryJobIncomeBonus: 0.15, routePlanningBonus: 0.1, logisticsXp: 20 },
  //   examPassRate: 0.80,
  //   trainingDays: 3,
  // },
  // TODO: 待实现 - 家政服务员证（参考真实家政服务员职业技能）
  // {
  //   id: "housekeeper_cert",
  //   name: "家政服务员证",
  //   desc: "可以从事高端家政/月嫂/育儿嫂工作。收入+25%，家政XP+30。",
  //   requirements: { cash: 400, mental: 25, ageMin: 20, ageMax: 50 },
  //   effects: { housekeepingJobIncomeBonus: 0.25, housekeepingXp: 30, housekeepingJobUnlock: true },
  //   examPassRate: 0.75,
  //   trainingDays: 7,
  // },
  // TODO: 待实现 - 宠物护理证（新兴职业，参考真实宠物行业）
  // {
  //   id: "pet_care_cert",
  //   name: "宠物护理证",
  //   desc: "可以从事宠物美容/寄养/遛狗服务。收入+20%，宠物相关事件好感+10%。",
  //   requirements: { cash: 500, mental: 20, ageMin: 18 },
  //   effects: { petCareJobIncomeBonus: 0.2, petEventAffinityBonus: 10, petCareXp: 25 },
  //   examPassRate: 0.72,
  //   trainingDays: 5,
  // },
  // TODO: 待实现 - 摄影师证（参考真实摄影师职业资格）
  // {
  //   id: "photographer_cert",
  //   name: "摄影师证",
  //   desc: "专业摄影资格证书。可以从事婚礼/商业摄影。收入+35%。",
  //   requirements: { cash: 1000, agility: 20, intelligence: 25, ageMin: 18 },
  //   effects: { photographyJobIncomeBonus: 0.35, photographyXp: 40, photographyJobUnlock: true },
  //   examPassRate: 0.45,
  //   trainingDays: 14,
  // },
  // TODO: 待实现 - 心理咨询师（参考真实中科院心理所证书）
  // {
  //   id: "psychology_cert",
  //   name: "心理咨询师证",
  //   desc: "心理咨询基础培训证书。可以从事心理咨询/心理疏导工作。",
  //   requirements: { cash: 1200, intelligence: 45, mental: 40, ageMin: 20 },
  //   effects: { psychologyJobUnlock: true, mentalJobIncomeBonus: 0.2, psychologyXp: 50 },
  //   examPassRate: 0.50,
  //   trainingDays: 21,
  // },
  // TODO: 待实现 - 社会工作师（参考真实助理社会工作师）
  // {
  //   id: "social_worker_cert",
  //   name: "助理社会工作师",
  //   desc: "社会工作专业资格。可以从事社区工作/公益组织/社工机构。",
  //   requirements: { cash: 500, intelligence: 30, mental: 30, ageMin: 18 },
  //   effects: { socialWorkJobUnlock: true, communityJobIncomeBonus: 0.15, socialWorkXp: 30 },
  //   examPassRate: 0.45,
  //   trainingDays: 10,
  // },
  //
  // === 驾驶/运输类 ===
  // TODO: 待实现 - A1/A2驾照（大货车/客车驾照，参考真实驾照分级）
  // {
  //   id: "heavy_driver_license",
  //   name: "A2牵引车驾照",
  //   desc: "可以驾驶大货车/牵引车。解锁长途货运工作，收入翻倍。",
  //   requirements: { cash: 1200, agility: 25, physique: 30, ageMin: 22, ageMax: 50, driving: 15 },
  //   effects: { heavyDrivingJobUnlock: true, drivingXp: 50, freightJobIncomeBonus: 0.5 },
  //   examPassRate: 0.35,
  //   trainingDays: 30,
  // },
  // TODO: 待实现 - 叉车证（特种设备作业人员证）
  // {
  //   id: "forklift_cert",
  //   name: "叉车操作证",
  //   desc: "可以操作叉车。解锁仓库叉车工工作，收入+40%。",
  //   requirements: { cash: 400, agility: 15, ageMin: 18, ageMax: 55 },
  //   effects: { forkliftJobUnlock: true, warehouseJobIncomeBonus: 0.4, agility: 1 },
  //   examPassRate: 0.75,
  //   trainingDays: 5,
  // },
  // TODO: 待实现 - 网约车驾驶员证（参考真实网约车从业资格证）
  // {
  //   id: "ride_hailing_cert",
  //   name: "网约车驾驶员证",
  //   desc: "可以从事网约车/专车服务。收入+30%，需要良好驾驶记录。",
  //   requirements: { cash: 500, driving: 20, ageMin: 21, ageMax: 60, cleanRecord: true },
  //   effects: { rideHailingUnlock: true, rideHailingIncomeBonus: 0.3, drivingXp: 30 },
  //   examPassRate: 0.65,
  //   trainingDays: 3,
  // },
  //
  // === 语言/翻译类 ===
  // TODO: 待实现 - 日语N2/N1（参考真实日语能力考）
  // {
  //   id: "japanese_n2",
  //   name: "日语N2证书",
  //   desc: "日语中级能力证明。可以从事日企/日语翻译工作。收入+20%。",
  //   requirements: { cash: 600, intelligence: 35, english: 15, ageMin: 16 },
  //   effects: { japaneseXp: 50, japaneseJobUnlock: true, translationJobIncomeBonus: 0.15 },
  //   examPassRate: 0.28,
  //   trainingDays: 30,
  // },
  // TODO: 待实现 - CET-6四级/六级（参考真实大学英语四六级）
  // {
  //   id: "cet_6",
  //   name: "大学英语六级",
  //   desc: "英语六级证书。外企/翻译/外贸工作敲门砖。收入+15%。",
  //   requirements: { cash: 200, intelligence: 30, english: 30, ageMin: 16, education: 1 },
  //   effects: { englishXp: 40, foreignJobUnlock: true, englishJobIncomeBonus: 0.15 },
  //   examPassRate: 0.40,
  //   trainingDays: 0,
  // },
  // TODO: 待实现 - 翻译资格证（参考真实CATTI翻译专业资格）
  // {
  //   id: "catti_cert",
  //   name: "CATTI翻译资格证",
  //   desc: "翻译专业职业资格。可以从事专业翻译/口译工作。收入+40%。",
  //   requirements: { cash: 800, intelligence: 45, english: 40, ageMin: 18 },
  //   effects: { translationJobUnlock: true, translationJobIncomeBonus: 0.4, englishXp: 60 },
  //   examPassRate: 0.25,
  //   trainingDays: 30,
  // },
  //
  // === 技能/手艺类 ===
  // TODO: 待实现 - 厨师证（参考真实中式烹调师职业资格）
  // {
  //   id: "chef_cert",
  //   name: "中式烹调师证",
  //   desc: "专业厨师资格证书。可以从事餐厅厨师/行政总厨工作。收入+30%。",
  //   requirements: { cash: 800, cooking: 30, ageMin: 18, ageMax: 50 },
  //   effects: { chefJobIncomeBonus: 0.3, cookingXpBonus: 0.2, chefJobUnlock: true },
  //   examPassRate: 0.55,
  //   trainingDays: 14,
  // },
  // TODO: 待实现 - 汽修证（参考真实汽车维修工职业资格）
  // {
  //   id: "auto_repair_cert",
  //   name: "汽车维修工证",
  //   desc: "专业汽修资格证书。可以从事4S店/高端汽修工作。收入+25%。",
  //   requirements: { cash: 600, repair: 25, physique: 20, ageMin: 18, ageMax: 50 },
  //   effects: { autoRepairJobIncomeBonus: 0.25, repairXpBonus: 0.15, autoRepairJobUnlock: true },
  //   examPassRate: 0.60,
  //   trainingDays: 10,
  // },
  // TODO: 待实现 - 法律职业资格（法考，参考真实法考通过率约15%）
  // {
  //   id: "legal_cert",
  //   name: "法律职业资格",
  //   desc: "法律职业资格证（法考）。可以从事律师/法务/公证工作。终极证书。",
  //   requirements: { cash: 2000, intelligence: 55, ageMin: 22, education: 2 },
  //   effects: { legalJobUnlock: true, legalJobIncomeBonus: 0.5, intelligence: 5, legalXp: 80 },
  //   examPassRate: 0.15,
  //   trainingDays: 60,
  // },
  //
  // === 新兴/特色类 ===
  // TODO: 待实现 - 直播主播证（参考真实网络主播规范）
  // {
  //   id: "streamer_cert",
  //   name: "网络主播资格证",
  //   desc: "可以从事直播/短视频创作工作。新兴职业，收入波动大但上限高。",
  //   requirements: { cash: 500, mental: 30, fame: 10, ageMin: 18 },
  //   effects: { streamerJobUnlock: true, streamerJobIncomeBonus: 0.25, fameGainBonus: 0.15 },
  //   examPassRate: 0.55,
  //   trainingDays: 7,
  // },
  // TODO: 待实现 - 无人机驾驶员（参考真实民航局无人机执照）
  // {
  //   id: "drone_cert",
  //   name: "无人机驾驶员",
  //   desc: "可以从事无人机航拍/巡检/农业喷洒工作。新兴高收入职业。",
  //   requirements: { cash: 1000, agility: 25, intelligence: 25, ageMin: 18, ageMax: 50 },
  //   effects: { droneJobUnlock: true, droneJobIncomeBonus: 0.35, agility: 2 },
  //   examPassRate: 0.50,
  //   trainingDays: 10,
  // },
  // TODO: 待实现 - 碳排放管理师（新兴职业，参考真实碳排放管理师培训）
  // {
  //   id: "carbon_manager_cert",
  //   name: "碳排放管理师",
  //   desc: "可以从事碳排放核算/咨询/管理工作。碳中和时代新兴职业。",
  //   requirements: { cash: 800, intelligence: 40, accounting: 15, ageMin: 20 },
  //   effects: { carbonJobUnlock: true, carbonJobIncomeBonus: 0.2, intelligence: 2 },
  //   examPassRate: 0.48,
  //   trainingDays: 14,
  // },
  // TODO: 待实现 - 整理收纳师（新兴职业，参考真实整理收纳师培训）
  // {
  //   id: "organizer_cert",
  //   name: "整理收纳师",
  //   desc: "可以从事家居整理/空间规划/收纳咨询服务。新兴高收入服务业。",
  //   requirements: { cash: 600, mental: 25, agility: 15, ageMin: 20, ageMax: 50 },
  //   effects: { organizerJobUnlock: true, organizerJobIncomeBonus: 0.25, mental: 2 },
  //   examPassRate: 0.65,
  //   trainingDays: 7,
  // },
];

/** 获取证书定义 */
function getCertificateById(certId) {
  return CERTIFICATES.find((c) => c.id === certId) || null;
}

/**
 * 获取某个技能的分支定义（委托至 skill_tree.js 的 SKILL_BRANCHES）
 * 如 SKILL_BRANCHES 未加载则返回空数组
 */
function getSkillBranches(skillKey) {
  if (typeof SKILL_BRANCHES !== "undefined") {
    return SKILL_BRANCHES[skillKey] || [];
  }
  return [];
}

/**
 * 获取某个技能的特定分支对象
 */
function getSkillBranchById(skillKey, branchId) {
  var branches = getSkillBranches(skillKey);
  for (var i = 0; i < branches.length; i++) {
    if (branches[i].id === branchId) return branches[i];
  }
  return null;
}

/** 获取玩家可考的证书 */
function getAvailableCertificates(state) {
  return CERTIFICATES.filter((cert) => {
    if (state.certificates.includes(cert.id)) return false; // 已拥有
    const p = state.player;
    const req = cert.requirements;
    if (req.intelligence && p.intelligence < req.intelligence) return false;
    if (req.physique && p.physique < req.physique) return false;
    if (req.repair && state.skills.repair.level < req.repair) return false;
    if (req.agility && p.agility < req.agility) return false;
    return true;
  });
}

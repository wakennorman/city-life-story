# 孤儿 flag 清理清单（2026-09-15）

> 数据源：`orphan-flags.json`（由 `scripts/audit-orphan-flags.mjs --json` 生成）
> 生成器：`scripts/build-orphan-worklist.mjs`
> 定义：**孤儿 flag = 有写入点、但全库没有任何读取点**（写入次数 == 名字出现总次数）。

## 总览

| 指标 | 数值 |
|------|------|
| 孤儿 flag 总数 | **1242** |
| 涉及域 | 7 个 |
| 未定位到写入文件 | 0 个 |

## 按建议动作分类

| 类 | 说明 | 数量 | 占比 |
|----|------|------|------|
| A | 信息/接触类（很可能「该接线」） | 40 | 3.2% |
| B | 结果/结局类（很可能「该接线」） | 13 | 1.0% |
| V | 值记录类（存了字符串/数字，删了会丢信息） | 30 | 2.4% |
| C1 | ★ 安全删除（`_` 前缀 + 纯布尔开关） | 880 | 70.9% |
| C2 | 私有动态值（`_` 前缀，赋的是表达式/函数返回值） | 228 | 18.4% |
| D | 一次性流程标记（写入 1 次） | 49 | 3.9% |
| E | 多次写入（可能是状态机残留） | 2 | 0.2% |

### A 类 · 信息/接触类（很可能「该接线」）（40 个）

**建议动作**：接线：这类 flag 语义上应当被 UI 或后续逻辑读取（解锁提示、已见过、已联系）。优先查是否漏了消费方

- `_careerNarrativeSeen` — 写 1 次 · core/career_linkage_events.js
- `_zhouWholesaleChannelKnown` — 写 1 次 · core/cross_system_events.js
- `_neighborMet` — 写 1 次 · core/cross_system_events.js
- `_libraryMentorContact` — 写 1 次 · core/cross_system_events.js
- `_quantContact` — 写 1 次 · core/cross_system_events.js
- `_remoteWorkUnlocked` — 写 1 次 · core/cross_system_events.js
- `_nightMarketInfo` — 写 1 次 · core/cross_system_events.js
- `walletOwnerMet` — 写 2 次 · core/cross_system_events_part1.js
- `_deliveryRegularContact` — 写 1 次 · core/cross_system_events_part1.js
- `zhaojieRentInfo` — 写 2 次 · core/cross_system_events_part1.js 等 2 文件
- `_bankVipLoanKnown` — 写 1 次 · core/cross_system_events_part2.js
- `_hasScoutContact` — 写 1 次 · core/cross_system_events_part2.js
- `_chenGeContact` — 写 1 次 · core/cross_system_events_part2.js
- `_secretChannelUnlocked` — 写 1 次 · core/cross_system_events_part2.js
- `_secretChannelKnown` — 写 1 次 · core/cross_system_events_part2.js
- `_recoveryContractorContact` — 写 1 次 · core/cross_system_events_part7.js
- `_moralNetworkUnlocked` — 写 1 次 · core/cross_system_events_part8.js
- `_tripleSkillContact` — 写 1 次 · core/cross_system_events_part8.js
- `_freeTrainingSeen` — 写 1 次 · core/cross_system_events_part8.js
- `_dataTaxAware` — 写 1 次 · core/data_linkage_events.js
- `_healthCostAware` — 写 1 次 · core/domain_a_linkage_r164.js
- `_marketSenseUnlocked` — 写 2 次 · core/domain_a_linkage_r171.js
- `_certReputationSeen` — 写 1 次 · core/domain_a_linkage_r242.js
- `_dataVisualizationAware` — 写 1 次 · core/domain_a_linkage_r363.js
- `_bankVipUnlocked` — 写 1 次 · core/domain_a_linkage_r76.js
- `_tradeIntelUnlocked` — 写 1 次 · core/domain_a_linkage_r92.js
- `_a923InflationAware` — 写 1 次 · core/domain_a_linkage_r923.js
- `_b1021CatalystUnlocked` — 写 1 次 · core/domain_b_linkage_events_r1021.js
- `_startupAnniversarySeen` — 写 1 次 · core/domain_b_linkage_r231.js
- `_moneyManagementAware` — 写 1 次 · core/domain_b_linkage_r372.js
- `_lifeTimelineAware` — 写 1 次 · core/domain_b_linkage_r372.js
- `_careerTaleSeen` — 写 1 次 · core/domain_c_linkage_r196.js
- `_socialCircleAware` — 写 1 次 · core/domain_d_linkage_r358.js
- `_e621BrokerContact` — 写 1 次 · core/domain_e_linkage_r621.js
- `_npcTotalMet` — 写 1 次 · core/domain_f_linkage_r238.js
- `_budgetAware` — 写 1 次 · core/domain_g_linkage_r169.js
- `_g967DataAware` — 写 1 次 · core/domain_g_linkage_r967.js
- `_sharingJobUnlocked` — 写 1 次 · core/events_street_life.js
- `_businessLessonLearned` — 写 1 次 · core/events_street_wealth.js
- `chenBankInfo` — 写 1 次 · data/npcs.js

### B 类 · 结果/结局类（很可能「该接线」）（13 个）

**建议动作**：接线或删除：这类 flag 记录某个分支结果，通常在结局/回顾界面应该被读取。查 victory / daily_focus / 回顾类 UI

- `_talentDepartureBlessing` — 写 1 次 · core/cross_system_events.js
- `_talentDepartureRetained` — 写 1 次 · core/cross_system_events.js
- `_talentDepartureLeft` — 写 1 次 · core/cross_system_events.js
- `pivotSuccess` — 写 1 次 · core/cross_system_events_part1.js
- `startupEpiphanyDone` — 写 1 次 · core/cross_system_events_part1.js
- `_mgmtCrisisResolved` — 写 2 次 · core/cross_system_events_part8.js
- `_workLifeBalanceAchieved` — 写 1 次 · core/domain_c_linkage_r369.js
- `_lifePlanningDone` — 写 1 次 · core/domain_f_linkage_r360.js
- `_lifeReflectionDone` — 写 1 次 · core/domain_g_linkage_r361.js
- `_volunteerDone` — 写 1 次 · core/events_street_life.js
- `_subsidyWarLeft` — 写 1 次 · core/events_street_wealth.js
- `boardCrisisResolved` — 写 1 次 · phase2/startup.js
- `_skillMasterVisitorDone` — 写 3 次 · ui/career_dev.js

### V 类 · 值记录类（存了字符串/数字，删了会丢信息）（30 个）

**建议动作**：先确认，别直接删：这类 flag 记录「发生过什么」（如 `_lifeDec_firstDeal = "lost"`），语义上多半该被回顾/结局界面读取。确认无用再删

- `_resumeReady` — 写 1 次 · app_bridge/webapp_runtime_bridge.js
- `_hasFan` — 写 1 次 · app_bridge/webapp_runtime_bridge.js
- `_scrapIncomeBonus` — 写 1 次 · core/cross_system_events.js
- `_forcedRestDays` — 写 2 次 · core/cross_system_events_part7.js
- `_burnoutRestDays` — 写 1 次 · core/domain_c_linkage_r187.js
- `_f747bPeakStyle` — 写 2 次 · core/domain_f_linkage_r747b.js
- `_f747bGatherStyle` — 写 2 次 · core/domain_f_linkage_r747b.js
- `_f747bStreakUsed` — 写 2 次 · core/domain_f_linkage_r747b.js
- `_weatherWorkBonus` — 写 1 次 · core/domain_g_linkage_r240.js
- `_g728AgeSocialBonus` — 写 3 次 · core/domain_g_linkage_r728.js
- `_g728AgeSkillBonus` — 写 3 次 · core/domain_g_linkage_r728.js
- `_g746bPensionStyle` — 写 2 次 · core/domain_g_linkage_r746b.js
- `_g770AgeSocialBonus` — 写 3 次 · core/domain_g_linkage_r770.js
- `_g770AgeSkillBonus` — 写 3 次 · core/domain_g_linkage_r770.js
- `_g786LifeStageCorp` — 写 3 次 · core/domain_g_linkage_r786.js
- `_g786SkillStrategy` — 写 3 次 · core/domain_g_linkage_r786.js
- `_h771SocialCircleTier` — 写 3 次 · core/domain_h_linkage_r771.js
- `_officeFactionJoined` — 写 1 次 · core/events_corp.js
- `_shoppingFestDeal` — 写 1 次 · core/events_street_life.js
- `_milestone30Path` — 写 3 次 · core/events_street_survival.js
- `_inheritanceDebtNote` — 写 1 次 · core/inheritance_chain.js
- `_inheritanceArrestNote` — 写 1 次 · core/inheritance_chain.js
- `_lifeDec_firstDeal` — 写 5 次 · core/life_decisions.js
- `_lifeDec_settle` — 写 3 次 · core/life_decisions.js
- `_corporateEntry` — 写 1 次 · core/life_decisions.js
- `_lifeDec_opportunity` — 写 4 次 · core/life_decisions.js
- `_lifeDec_warmth` — 写 3 次 · core/life_decisions.js
- `_lifeDec_halfYear` — 写 2 次 · core/life_decisions.js
- `_lifeDec_oneYear` — 写 3 次 · core/life_decisions.js
- `_npcMentorXpBonus` — 写 1 次 · core/npc_social_linkage_r66.js

### C1 类 · ★ 安全删除（`_` 前缀 + 纯布尔开关）（880 个）

**建议动作**：直接删除写入行：`_` 前缀是内部临时标记约定，且所有赋值都是 true/false 纯开关，无信息量、无消费方。这是 1242 条里最该先清的一批

- `_investmentCareerPrimed` — 写 1 次 · core/career_crosslink_r65.js
- `_skillMasterHasApprentice` — 写 1 次 · core/career_linkage_events.js
- `_skillMasterStartupBonus` — 写 1 次 · core/career_linkage_events.js
- `_skillMasterBookPublished` — 写 1 次 · core/career_linkage_events.js
- `_skillSynergyHintShown` — 写 2 次 · core/career_linkage_events.js
- `_medVolunteerHonor` — 写 1 次 · core/career_path_events.js
- `_passedMedLicense` — 写 2 次 · core/career_path_events.js
- `_hasBianzhi` — 写 1 次 · core/career_path_events.js
- `_seniorIncomeTier` — 写 1 次 · core/career_path_events.js
- `_seniorInvestReady` — 写 1 次 · core/career_path_events.js
- `_startupInvestorMindset` — 写 1 次 · core/company_linkage_events.js
- `_foggyMarketNoted` — 写 1 次 · core/cross_system_events.js
- `_knowsRentalKickback` — 写 1 次 · core/cross_system_events.js
- `_walletConfessed` — 写 1 次 · core/cross_system_events.js
- `_oldZhouWeatherTipNoted` — 写 1 次 · core/cross_system_events.js
- `_factoryRepairMan` — 写 1 次 · core/cross_system_events.js
- `_wangRentalDiscounted` — 写 1 次 · core/cross_system_events.js
- `_zhangReferral` — 写 2 次 · core/cross_system_events.js 等 2 文件
- `_techParkLead` — 写 2 次 · core/cross_system_events.js 等 2 文件
- `_checkupFoundIssue` — 写 1 次 · core/cross_system_events.js
- `_nightShiftJob` — 写 1 次 · core/cross_system_events.js
- `_zhangIntroduced` — 写 1 次 · core/cross_system_events.js
- `_regularClient` — 写 1 次 · core/cross_system_events.js
- `_comboCookingMgmt` — 写 1 次 · core/cross_system_events.js
- `_comboRepairSales` — 写 1 次 · core/cross_system_events.js
- `_logisticsJobReferral` — 写 2 次 · core/cross_system_events.js
- `_oldManTip` — 写 1 次 · core/cross_system_events.js
- `_techparkInspiration` — 写 1 次 · core/cross_system_events.js
- `_techparkInterview` — 写 1 次 · core/cross_system_events.js
- `_debterAngry` — 写 1 次 · core/cross_system_events.js
- `_zhangTrainingPending` — 写 2 次 · core/cross_system_events.js
- `_siteSafetyImproved` — 写 1 次 · core/cross_system_events.js
- `_groupBuyInformed` — 写 1 次 · core/cross_system_events.js
- `_skippedLibrary` — 写 1 次 · core/cross_system_events.js
- `_gamblerMode` — 写 1 次 · core/cross_system_events.js
- `_remoteWorkDeferred` — 写 1 次 · core/cross_system_events.js
- `_elderWageBonus` — 写 1 次 · core/cross_system_events_part1.js
- `_deliveryBanAppealing` — 写 1 次 · core/cross_system_events_part1.js
- `_fixedDeliveryRoute` — 写 1 次 · core/cross_system_events_part1.js
- `_knowsRentalMarket` — 写 1 次 · core/cross_system_events_part1.js
- `_knowsScrapPrice` — 写 1 次 · core/cross_system_events_part1.js
- `_knowsLaborMarket` — 写 1 次 · core/cross_system_events_part1.js
- `_npcGeneralSecret` — 写 1 次 · core/cross_system_events_part1.js
- `_starvedForFuture` — 写 1 次 · core/cross_system_events_part1.js
- `_reputationReferralActive` — 写 1 次 · core/cross_system_events_part1.js
- `_selfEmployedPending` — 写 1 次 · core/cross_system_events_part1.js
- `_debtHarassmentActive` — 写 1 次 · core/cross_system_events_part1.js
- `_gigPrivateOrders` — 写 1 次 · core/cross_system_events_part1.js
- `_hasJobOpportunity` — 写 1 次 · core/cross_system_events_part1.js
- `_medicalDebtInstallment` — 写 1 次 · core/cross_system_events_part1.js
- `_midlifeRetraining` — 写 1 次 · core/cross_system_events_part1.js
- `_deliveryHrInterview` — 写 1 次 · core/cross_system_events_part1.js
- `_deliveryHrPending` — 写 1 次 · core/cross_system_events_part1.js
- `_freeCourseLink` — 写 1 次 · core/cross_system_events_part1.js
- `_rainWholesaleBought` — 写 1 次 · core/cross_system_events_part1.js
- `_fameConnectionBonus` — 写 1 次 · core/cross_system_events_part1.js
- `_triedReachingOut` — 写 1 次 · core/cross_system_events_part1.js
- `_eduGraduationPhoto` — 写 1 次 · core/cross_system_events_part1.js
- `_eduGraduationJobHunt` — 写 1 次 · core/cross_system_events_part1.js
- `_eduGraduationHome` — 写 1 次 · core/cross_system_events_part1.js
- …还有 820 个（见 JSON）

### C2 类 · 私有动态值（`_` 前缀，赋的是表达式/函数返回值）（228 个）

**建议动作**：人工看一眼再删：赋值来自表达式，可能被别处间接依赖。批量前先抽查几个

- `_burnoutHardWorkDay` — 写 1 次 · core/cross_system_events.js
- `_oldStreetBonus` — 写 1 次 · core/cross_system_events_part1.js
- `_deliveryAppealDay` — 写 1 次 · core/cross_system_events_part1.js
- `_secretInfoFrom` — 写 1 次 · core/cross_system_events_part1.js
- `_skillMasterOfferSalary` — 写 1 次 · core/cross_system_events_part1.js
- `_skillMasterOfferSkill` — 写 1 次 · core/cross_system_events_part1.js
- `_selfEmployedFrom` — 写 1 次 · core/cross_system_events_part1.js
- `_extraClients` — 写 1 次 · core/cross_system_events_part1.js
- `_debtHarassmentStart` — 写 1 次 · core/cross_system_events_part1.js
- `_npcTempJobReferral` — 写 1 次 · core/cross_system_events_part1.js
- `_npcTempJobDay` — 写 1 次 · core/cross_system_events_part1.js
- `_priceWarningDay` — 写 1 次 · core/cross_system_events_part1.js
- `_scrapPriceAlert` — 写 1 次 · core/cross_system_events_part1.js
- `_scrapAlertDay` — 写 1 次 · core/cross_system_events_part1.js
- `_courseLinkDay` — 写 1 次 · core/cross_system_events_part1.js
- `_locationHintDay` — 写 1 次 · core/cross_system_events_part1.js
- `_rainCanvasDay` — 写 1 次 · core/cross_system_events_part1.js
- `_rainWholesaleDay` — 写 1 次 · core/cross_system_events_part1.js
- `_sideHustlePartner` — 写 1 次 · core/cross_system_events_part1.js
- `_skillSynergyPair` — 写 1 次 · core/cross_system_events_part1.js
- `_bankVipDay` — 写 1 次 · core/cross_system_events_part2.js
- `_regularCreditDay` — 写 1 次 · core/cross_system_events_part2.js
- `_skillMilestoneSkill` — 写 3 次 · core/cross_system_events_part2.js
- `_subsidyEndDay` — 写 1 次 · core/cross_system_events_part8.js
- `_dryGoodsDay` — 写 1 次 · core/cross_system_events_part8.js
- `_a775LastInflationCheck` — 写 1 次 · core/domain_a_linkage_r775.js
- `_a775LastCycleCheck` — 写 1 次 · core/domain_a_linkage_r775.js
- `_a775LastInflationForInvest` — 写 1 次 · core/domain_a_linkage_r775.js
- `_a788PriceAvg` — 写 1 次 · core/domain_a_linkage_r788.js
- `_a788PriceMax` — 写 1 次 · core/domain_a_linkage_r788.js
- `_a788PriceMin` — 写 1 次 · core/domain_a_linkage_r788.js
- `_a788SkillMarketValue` — 写 1 次 · core/domain_a_linkage_r788.js
- `_a788TopSkillLevel` — 写 1 次 · core/domain_a_linkage_r788.js
- `_a788FairPriceScore` — 写 1 次 · core/domain_a_linkage_r788.js
- `_a788FairInflation` — 写 1 次 · core/domain_a_linkage_r788.js
- `_a804DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r804.js
- `_a816DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r816.js
- `_a826DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r826.js
- `_a830DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r830.js
- `_a832DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r832.js
- `_a838DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r838.js
- `_a840DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r840.js
- `_a846DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r846.js
- `_a848DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r848.js
- `_a854DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r854.js
- `_a856DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r856.js
- `_a862DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r862.js
- `_a863DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r863.js
- `_a870DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r870.js
- `_a871DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r871.js
- `_a879DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r879.js
- `_a887DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r887.js
- `_a895DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r895.js
- `_a903DebtToAssetRatio` — 写 1 次 · core/domain_a_linkage_r903.js
- `_b777LastSocialRipple` — 写 1 次 · core/domain_b_linkage_r777.js
- `_b789EconLessonCash` — 写 1 次 · core/domain_b_linkage_r789.js
- `_b789EconLessonDebt` — 写 1 次 · core/domain_b_linkage_r789.js
- `_b789EconLessonNet` — 写 1 次 · core/domain_b_linkage_r789.js
- `_b789CareerSparkJob` — 写 1 次 · core/domain_b_linkage_r789.js
- `_b789CareerSparkDay` — 写 1 次 · core/domain_b_linkage_r789.js
- …还有 168 个（见 JSON）

### D 类 · 一次性流程标记（写入 1 次）（49 个）

**建议动作**：逐条判断：只写一次的流程开关。要么补消费方，要么删。建议按域批量过

- `elderSonIntro` — 写 1 次 · core/cross_system_events_part1.js
- `daigouPartnership` — 写 1 次 · core/cross_system_events_part1.js
- `tutorInstitutionPartner` — 写 1 次 · core/cross_system_events_part1.js
- `bubbleRecognizer` — 写 1 次 · core/cross_system_events_part1.js
- `smallBizDifferentiated` — 写 1 次 · core/cross_system_events_part1.js
- `chainStorePartner` — 写 1 次 · core/cross_system_events_part1.js
- `startupMentorBonus` — 写 1 次 · core/cross_system_events_part1.js
- `deliveryBanRecovered` — 写 1 次 · core/cross_system_events_part1.js
- `communityAdvisor` — 写 1 次 · core/cross_system_events_part1.js
- `moralWalletConfessed` — 写 1 次 · core/cross_system_events_part1.js
- `repLongTermGig` — 写 1 次 · core/cross_system_events_part2.js
- `indieDevLaunched` — 写 1 次 · core/cross_system_events_part2.js
- `oldZhouMingChannel` — 写 1 次 · core/cross_system_events_part2.js
- `oldZhouMingIntro` — 写 1 次 · core/cross_system_events_part2.js
- `hasPet` — 写 1 次 · core/events_street_survival.js
- `preciousConsumerBadge` — 写 1 次 · data/era_events.js
- `industryIntel` — 写 1 次 · data/era_events.js
- `reflectorBadge` — 写 1 次 · data/era_events.js
- `careerInspiration` — 写 1 次 · data/era_events.js
- `moralPushedCar` — 写 1 次 · data/moral_events.js
- `bossLiLoan` — 写 1 次 · data/npcs.js
- `zhangDeepReferred` — 写 1 次 · data/npcs.js
- `oldZhouBetterDeal` — 写 1 次 · data/npcs.js
- `xiaoMeiSupport` — 写 1 次 · data/npcs.js
- `chefChenWillOpen` — 写 1 次 · data/npcs.js
- `chenSideJob` — 写 1 次 · data/npcs.js
- `wuBeautyClients` — 写 1 次 · data/npcs.js
- `wuBeautyShop` — 写 1 次 · data/npcs.js
- `huangStationManager` — 写 1 次 · data/npcs.js
- `xiaochenNightDelivery` — 写 1 次 · data/npcs.js
- `xiaochenDispatcher` — 写 1 次 · data/npcs.js
- `linVegTips` — 写 1 次 · data/npcs.js
- `linVegStand` — 写 1 次 · data/npcs.js
- `zhaoFreeRepair` — 写 1 次 · data/npcs.js
- `zhaoApprentice` — 写 1 次 · data/npcs.js
- `xiaoliAssistant` — 写 1 次 · data/npcs.js
- `xiaoliOwnAccount` — 写 1 次 · data/npcs.js
- `wangPriority` — 写 1 次 · data/npcs.js
- `zhaojiePriorityViewing` — 写 1 次 · data/npcs.js
- `zhaojieWillOpenStore` — 写 1 次 · data/npcs.js
- `chenGeSearchingAjie` — 写 1 次 · data/npcs.js
- `ajieGivenExtension` — 写 1 次 · data/npcs.js
- `ajieMovedOn` — 写 1 次 · data/npcs.js
- `tutorAgencyOffer` — 写 1 次 · data/side_hustle_consequences.js
- `rideCaught` — 写 1 次 · data/side_hustle_events.js
- `mediaAppeal` — 写 1 次 · data/side_hustle_events.js
- `gaveUpSelfMedia` — 写 1 次 · data/side_hustle_events.js
- `forceRest` — 写 1 次 · phase2/personal_growth.js
- `ceoReplaced` — 写 1 次 · phase2/startup.js

### E 类 · 多次写入（可能是状态机残留）（2 个）

**建议动作**：优先排查：写入 ≥2 次说明有逻辑在维护它，更可能是「本该被读却漏了」。这类最有可能是真 bug

- `selfMediaMonetized` — 写 2 次 · core/cross_system_events_part1.js
- `chenScamWarning` — 写 2 次 · core/cross_system_events_part1.js 等 2 文件

## 按域分批（建议每次一个域，每批 ≤50 个单独提交）

| 域 | 孤儿数 | ★ 安全删除(C1) | 值记录(V) | 其中 `_` 前缀 | 其中写 ≥2 次 | 建议批次 |
|----|--------|---------------|-----------|--------------|--------------|----------|
| `core` | 1104 | **797** | 28 | 1083 | 61 | 23 批 |
| `data` | 112 | **75** | 0 | 79 | 35 | 3 批 |
| `phase1` | 11 | **6** | 0 | 11 | 0 | 1 批 |
| `phase2` | 9 | **1** | 0 | 6 | 0 | 1 批 |
| `ui` | 3 | **1** | 0 | 3 | 1 | 1 批 |
| `app_bridge` | 2 | **0** | 2 | 2 | 0 | 1 批 |
| `main.js` | 1 | **0** | 0 | 1 | 0 | 1 批 |

## 全部孤儿明细

| flag | 写入 | 出现 | 域 | 类 | 赋值形态(bool/lit/cnt/dyn) | 写入文件 |
|------|------|------|----|----|---------------------------|---------|
| `_lifeDec_firstDeal` | 5 | 5 | core | V | 0/5/0/0 | core/life_decisions.js |
| `_lifeDec_opportunity` | 4 | 4 | core | V | 0/4/0/0 | core/life_decisions.js |
| `_careerSurvivedLayoff` | 3 | 3 | data | C1 | 3/0/0/0 | data/crisis35_followups.js |
| `_g728AgeSkillBonus` | 3 | 3 | core | V | 0/3/0/0 | core/domain_g_linkage_r728.js |
| `_g728AgeSocialBonus` | 3 | 3 | core | V | 0/3/0/0 | core/domain_g_linkage_r728.js |
| `_g770AgeSkillBonus` | 3 | 3 | core | V | 0/3/0/0 | core/domain_g_linkage_r770.js |
| `_g770AgeSocialBonus` | 3 | 3 | core | V | 0/3/0/0 | core/domain_g_linkage_r770.js |
| `_g786LifeStageCorp` | 3 | 3 | core | V | 0/3/0/0 | core/domain_g_linkage_r786.js |
| `_g786SkillStrategy` | 3 | 3 | core | V | 0/3/0/0 | core/domain_g_linkage_r786.js |
| `_h771SocialCircleTier` | 3 | 3 | core | V | 0/3/0/0 | core/domain_h_linkage_r771.js |
| `_lifeDec_oneYear` | 3 | 3 | core | V | 0/3/0/0 | core/life_decisions.js |
| `_lifeDec_settle` | 3 | 3 | core | V | 0/3/0/0 | core/life_decisions.js |
| `_lifeDec_warmth` | 3 | 3 | core | V | 0/3/0/0 | core/life_decisions.js |
| `_lifeJournalKeeper` | 3 | 3 | core | C1 | 3/0/0/0 | core/domain_b_linkage_r259.js<br>core/domain_g_linkage_r264.js<br>core/domain_g_linkage_r278.js |
| `_milestone30Path` | 3 | 3 | core | V | 0/3/0/0 | core/events_street_survival.js |
| `_multiSkillProject` | 3 | 3 | core | C1 | 3/0/0/0 | core/cross_system_events_part7.js |
| `_npcDeepTask_ajie` | 3 | 3 | data | C1 | 3/0/0/0 | data/npcs.js |
| `_npcDeepTask_auntie_lin` | 3 | 3 | data | C1 | 3/0/0/0 | data/npcs.js |
| `_npcDeepTask_brother_huang` | 3 | 3 | data | C1 | 3/0/0/0 | data/npcs.js |
| `_npcDeepTask_chef_chen` | 3 | 3 | data | C1 | 3/0/0/0 | data/npcs.js |
| `_npcDeepTask_master_zhao` | 3 | 3 | data | C1 | 3/0/0/0 | data/npcs.js |
| `_npcDeepTask_old_zhou` | 3 | 3 | data | C1 | 3/0/0/0 | data/npcs.js |
| `_npcDeepTask_sister_wu` | 3 | 3 | data | C1 | 3/0/0/0 | data/npcs.js |
| `_npcDeepTask_xiaochen` | 3 | 3 | data | C1 | 3/0/0/0 | data/npcs.js |
| `_npcDeepTask_xiaoli` | 3 | 3 | data | C1 | 3/0/0/0 | data/npcs.js |
| `_npcDeepTask_zhaojie` | 3 | 3 | data | C1 | 3/0/0/0 | data/npcs.js |
| `_skillMasterVisitorDone` | 3 | 3 | ui | B | 3/0/0/0 | ui/career_dev.js |
| `_skillMilestoneSkill` | 3 | 3 | core | C2 | 0/0/0/3 | core/cross_system_events_part2.js |
| `_veteranRecognized` | 3 | 3 | core | C1 | 3/0/0/0 | core/cross_system_events_part7.js |
| `_ajieMetDay` | 2 | 2 | core | C2 | 0/0/0/2 | core/npc_activation_events.js |
| `_apprenticePaidOff` | 2 | 2 | core | C1 | 2/0/0/0 | core/cross_system_events_part8.js |
| `_auntieLinMetDay` | 2 | 2 | core | C2 | 0/0/0/2 | core/npc_activation_events.js |
| `_careerJournalKeeper` | 2 | 2 | core | C1 | 2/0/0/0 | core/domain_c_linkage_r252.js<br>core/domain_c_linkage_r282.js |
| `_certConfidence` | 2 | 2 | core | C1 | 2/0/0/0 | core/domain_f_linkage_r186.js |
| `_chefChenMetDay` | 2 | 2 | core | C2 | 0/0/0/2 | core/npc_activation_events.js |
| `_chenGeMetDay` | 2 | 2 | core | C2 | 0/0/0/2 | core/npc_activation_events.js |
| `_dataDrivenPrediction` | 2 | 2 | core | C1 | 2/0/0/0 | core/domain_a_linkage_r304.js<br>core/domain_a_linkage_r355.js |
| `_deepBondResource` | 2 | 2 | core | C1 | 2/0/0/0 | core/cross_system_events_part7.js |
| `_drWangMetDay` | 2 | 2 | core | C2 | 0/0/0/2 | core/npc_activation_events.js |
| `_eventTimelineUI` | 2 | 2 | core | C1 | 2/0/0/0 | core/domain_b_linkage_r266.js<br>core/domain_f_linkage_r293.js |
| `_f747bGatherStyle` | 2 | 2 | core | V | 0/2/0/0 | core/domain_f_linkage_r747b.js |
| `_f747bPeakStyle` | 2 | 2 | core | V | 0/2/0/0 | core/domain_f_linkage_r747b.js |
| `_f747bStreakUsed` | 2 | 2 | core | V | 0/2/0/0 | core/domain_f_linkage_r747b.js |
| `_financialSafetyNet` | 2 | 2 | core | C1 | 2/0/0/0 | core/domain_e_linkage_r185.js |
| `_forcedRestDays` | 2 | 2 | core | V | 0/2/0/0 | core/cross_system_events_part7.js |
| `_founderHealthAwareness` | 2 | 2 | core | C1 | 2/0/0/0 | core/domain_h_linkage_r188.js<br>core/domain_h_linkage_r257.js |
| `_g746bPensionStyle` | 2 | 2 | core | V | 0/2/0/0 | core/domain_g_linkage_r746b.js |
| `_healthAwareness` | 2 | 2 | core | C1 | 2/0/0/0 | core/domain_a_linkage_r245.js |
| `_healthBaselineKeeper` | 2 | 2 | core | C1 | 2/0/0/0 | core/domain_a_linkage_r197.js<br>core/domain_a_linkage_r267.js |
| `_lifeDataDashboardV2` | 2 | 2 | core | C1 | 2/0/0/0 | core/domain_a_linkage_r347.js<br>core/domain_g_linkage_r353.js |
| `_lifeDec_halfYear` | 2 | 2 | core | V | 0/2/0/0 | core/life_decisions.js |
| `_logisticsJobReferral` | 2 | 2 | core | C1 | 2/0/0/0 | core/cross_system_events.js |
| `_marketSenseUnlocked` | 2 | 2 | core | A | 2/0/0/0 | core/domain_a_linkage_r171.js |
| `_masterZhaoMetDay` | 2 | 2 | core | C2 | 0/0/0/2 | core/npc_activation_events.js |
| `_mgmtCrisisResolved` | 2 | 2 | core | B | 2/0/0/0 | core/cross_system_events_part8.js |
| `_mortgagePenalty` | 2 | 2 | core | C1 | 2/0/0/0 | core/family_events.js |
| `_npcDeepTask_aunt_wang` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcDeepTask_boss_li` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcDeepTask_chen_ge` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcDeepTask_dr_wang` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcDeepTask_sister_zhang` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcDeepTask_uncle_chen_bank` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcDeepTask_xiao_mei` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_ajie` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_aunt_wang` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_auntie_lin` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_boss_li` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_brother_huang` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_chef_chen` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_chen_ge` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_dr_wang` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_master_zhao` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_old_zhou` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_sister_wu` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_sister_zhang` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_uncle_chen_bank` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_xiao_mei` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_xiaochen` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_xiaoli` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_npcFavor_zhaojie` | 2 | 2 | data | C1 | 2/0/0/0 | data/npcs.js |
| `_passedMedLicense` | 2 | 2 | core | C1 | 2/0/0/0 | core/career_path_events.js |
| `_rentFullIncrease` | 2 | 2 | core | C1 | 2/0/0/0 | core/news_driven_events.js |
| `_skillSynergyHintShown` | 2 | 2 | core | C1 | 2/0/0/0 | core/career_linkage_events.js |
| `_socialDataAnalysis` | 2 | 2 | core | C1 | 2/0/0/0 | core/domain_d_linkage_r275.js<br>core/domain_d_linkage_r299.js |
| `_socialInvestmentIntelDay` | 2 | 2 | core | C2 | 0/0/0/2 | core/domain_d_linkage_r358.js<br>core/domain_d_linkage_r366.js |
| `_stockBoomDay` | 2 | 2 | core | C2 | 0/0/0/2 | core/events_street_life.js |
| `_techParkLead` | 2 | 2 | core | C1 | 2/0/0/0 | core/cross_system_events.js<br>data/actions.js |
| `_traderNetwork` | 2 | 2 | core | C1 | 2/0/0/0 | core/domain_a_linkage_r164.js |
| `_xiaochenMetDay` | 2 | 2 | core | C2 | 0/0/0/2 | core/npc_activation_events.js |
| `_xiaoliMetDay` | 2 | 2 | core | C2 | 0/0/0/2 | core/npc_activation_events.js |
| `_zhangReferral` | 2 | 2 | core | C1 | 2/0/0/0 | core/cross_system_events.js<br>core/cross_system_events_part8.js |
| `_zhangTrainingPending` | 2 | 2 | core | C1 | 2/0/0/0 | core/cross_system_events.js |
| `_zhaojieMetDay` | 2 | 2 | core | C2 | 0/0/0/2 | core/npc_activation_events.js |
| `chenScamWarning` | 2 | 2 | core | E | 2/0/0/0 | core/cross_system_events_part1.js<br>data/npcs.js |
| `selfMediaMonetized` | 2 | 2 | core | E | 2/0/0/0 | core/cross_system_events_part1.js |
| `walletOwnerMet` | 2 | 2 | core | A | 2/0/0/0 | core/cross_system_events_part1.js |
| `zhaojieRentInfo` | 2 | 2 | core | A | 2/0/0/0 | core/cross_system_events_part1.js<br>data/npcs.js |
| `_756Writer` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r756.js |
| `_a1001InvBegin` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r1001.js |
| `_a1001LifeQuality` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r1001.js |
| `_a1001Settle` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r1001.js |
| `_a1001TrendJudge` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r1001.js |
| `_a1001Waiter` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r1001.js |
| `_a1009InvUrge` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r1009.js |
| `_a1009MarketEye` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r1009.js |
| `_a1009Moonlight` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r1009.js |
| `_a1009Safe` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r1009.js |
| `_a1009SaveRate` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r1009.js |
| `_a775HighInflationWarning` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r775.js |
| `_a775LastCycleCheck` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r775.js |
| `_a775LastInflationCheck` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r775.js |
| `_a775LastInflationForInvest` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r775.js |
| `_a788FairInflation` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r788.js |
| `_a788FairPriceScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r788.js |
| `_a788PriceAvg` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r788.js |
| `_a788PriceMax` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r788.js |
| `_a788PriceMin` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r788.js |
| `_a788SkillMarketValue` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r788.js |
| `_a788TopSkillLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r788.js |
| `_a804DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r804.js |
| `_a816DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r816.js |
| `_a826DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r826.js |
| `_a830DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r830.js |
| `_a832DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r832.js |
| `_a838DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r838.js |
| `_a840DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r840.js |
| `_a846DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r846.js |
| `_a848DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r848.js |
| `_a854DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r854.js |
| `_a856DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r856.js |
| `_a862DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r862.js |
| `_a863DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r863.js |
| `_a870DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r870.js |
| `_a871DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r871.js |
| `_a879DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r879.js |
| `_a887DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r887.js |
| `_a895DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r895.js |
| `_a903DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_a_linkage_r903.js |
| `_a915FinanceHealthAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r915.js |
| `_a915PriceObserver` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r915.js |
| `_a915SkillMarketInsight` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r915.js |
| `_a923CompoundSkillAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r923.js |
| `_a923FinanceHealthPlan` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r923.js |
| `_a923InflationAware` | 1 | 1 | core | A | 1/0/0/0 | core/domain_a_linkage_r923.js |
| `_a932Conservative` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r932.js |
| `_a932Consumerist` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r932.js |
| `_a932InvestorAwake` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r932.js |
| `_a932MarketWatcher` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r932.js |
| `_a932Thrifty` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r932.js |
| `_a969AntiInflation` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r969.js |
| `_a969Conservative2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r969.js |
| `_a969Consumer` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r969.js |
| `_a969Follower` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r969.js |
| `_a969Investor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r969.js |
| `_a969Rational` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r969.js |
| `_a977BlindFollower` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r977.js |
| `_a977Conservative3` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r977.js |
| `_a977InfoDiscerner` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r977.js |
| `_a977InvAwake2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r977.js |
| `_a977Spender` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r977.js |
| `_a977Thrifty2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r977.js |
| `_a985Conservative4` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r985.js |
| `_a985Follower2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r985.js |
| `_a985LayFlat` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r985.js |
| `_a985MarketFeeler` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r985.js |
| `_a985PressureFighter` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r985.js |
| `_a993Drift` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r993.js |
| `_a993EconFighter` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r993.js |
| `_a993InvStart` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r993.js |
| `_a993MarketRhythm` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r993.js |
| `_a993Watcher` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r993.js |
| `_abandonedCompany` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_b_linkage_r174_part2.js |
| `_acquisitionTeaPassed` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_ageRiskMult` | 1 | 1 | phase1 | C2 | 0/0/0/1 | phase1/daily_pipeline.js |
| `_ageSocialWisdom` | 1 | 1 | phase1 | C2 | 0/0/0/1 | phase1/daily_pipeline.js |
| `_ajiePartnership` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_ajieReferred` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_annualReflectionKeeper` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r294.js |
| `_arbitrageTechparkSkipped` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_auditFlagged` | 1 | 1 | core | C1 | 1/0/0/0 | core/insider_trading_events.js |
| `_auntieLinOnlineClass` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_auntZhangPartnership` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_autumnGroceries` | 1 | 1 | phase1 | C1 | 1/0/0/0 | phase1/extra_events.js |
| `_b1010MoneyWise` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r1010.js |
| `_b1010StormGrown` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r1010.js |
| `_b1016bStoryShared` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_events_r1016b.js |
| `_b1021CatalystUnlocked` | 1 | 1 | core | A | 1/0/0/0 | core/domain_b_linkage_events_r1021.js |
| `_b1021EconEye` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_events_r1021.js |
| `_b1021RiskAssessor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_events_r1021.js |
| `_b1046EraEconomicEye` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_core.js |
| `_b1046EraResilient` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_core.js |
| `_b692StoryBook` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r692.js |
| `_b777LastSocialRipple` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_b_linkage_r777.js |
| `_b777NarrativeResilience` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r777.js |
| `_b789CareerSparkDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_b_linkage_r789.js |
| `_b789CareerSparkJob` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_b_linkage_r789.js |
| `_b789CorpStoryStage` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_b_linkage_r789.js |
| `_b789CorpStoryValuation` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_b_linkage_r789.js |
| `_b789EconLessonCash` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_b_linkage_r789.js |
| `_b789EconLessonDebt` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_b_linkage_r789.js |
| `_b789EconLessonNet` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_b_linkage_r789.js |
| `_b916EventAnalyst` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r916.js |
| `_b916LifeReflector` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r916.js |
| `_b916TrueFriendship` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r916.js |
| `_b924EventLearner` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r924.js |
| `_b924FriendshipValuer` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r924.js |
| `_b924GratefulPerson` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r924.js |
| `_b938CodingLearner` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r938.js |
| `_b938FinWise` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r938.js |
| `_b938MoneyMachine` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r938.js |
| `_b938Resilient` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r938.js |
| `_b946CareerChanger` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r946.js |
| `_b946CarpeDiem` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r946.js |
| `_b946EmergencyFund` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r946.js |
| `_b946GrowFromFailure` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r946.js |
| `_b946Stability` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r946.js |
| `_b954Content` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r954.js |
| `_b954FinMaster` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r954.js |
| `_b954TalentSeeker` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r954.js |
| `_b954Tenacious` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r954.js |
| `_b962CycleMaster` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r962.js |
| `_b962Phoenix` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r962.js |
| `_b962TalentAwake` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r962.js |
| `_bankVipDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part2.js |
| `_bankVipInvested` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_bankVipLoanKnown` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events_part2.js |
| `_bankVipUnlocked` | 1 | 1 | core | A | 1/0/0/0 | core/domain_a_linkage_r76.js |
| `_blameGameHonest` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_blameGameNeutral` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_blameGameTookIt` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_bossChenCooperation` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_boughtFakeMedicine` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_boughtFoodForHomeless` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_budgetAware` | 1 | 1 | core | A | 1/0/0/0 | core/domain_g_linkage_r169.js |
| `_budgetClarityKeeper` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r197.js |
| `_budgetSense` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r244.js |
| `_burnoutHardWorkDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events.js |
| `_burnoutRestDays` | 1 | 1 | core | V | 0/1/0/0 | core/domain_c_linkage_r187.js |
| `_businessLessonLearned` | 1 | 1 | core | A | 1/0/0/0 | core/events_street_wealth.js |
| `_buskingVenue` | 1 | 1 | data | C1 | 1/0/0/0 | data/job_milestone_events.js |
| `_c1003CompoundGrowth` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r1003.js |
| `_c1003Grinder` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r1003.js |
| `_c1003SkillBridge` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r1003.js |
| `_c1003WorkMeaning` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r1003.js |
| `_c1011DoorOpen` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r1011.js |
| `_c1011Grinder2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r1011.js |
| `_c1011HealthInvest` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r1011.js |
| `_c1025SkillInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r1025.js |
| `_c1025SkillMarketEye` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r1025.js |
| `_c1047CareerProud` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_core.js |
| `_c1047HasCareerPlan` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_core.js |
| `_c1047Monetized` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_core.js |
| `_c1047ResumeReady` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_core.js |
| `_c677bScaleDeclined` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r677b.js |
| `_c707DiscountChannel` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r707.js |
| `_c707ToughItOut` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r707.js |
| `_c768Analyst` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r768.js |
| `_c779HighFatigueWarning` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r779.js |
| `_c779LastJobNetwork` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r779.js |
| `_c779LastWorkFatigue` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r779.js |
| `_c779TopSkillName` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r779.js |
| `_c779TopSkillValue` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r779.js |
| `_c790CareerPath` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r790.js |
| `_c790ColleagueDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r790.js |
| `_c790ColleagueJob` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r790.js |
| `_c865AvgSkillLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r865.js |
| `_c873AvgSkillLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r873.js |
| `_c881AvgSkillLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r881.js |
| `_c889AvgSkillLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r889.js |
| `_c897AvgSkillLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r897.js |
| `_c905AvgSkillLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r905.js |
| `_c909AvgSkillLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r909.js |
| `_c909BurnoutRisk` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r909.js |
| `_c909CareerInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r909.js |
| `_c909HealthFirst` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r909.js |
| `_c909SkillMarketExpert` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r909.js |
| `_c917AvgSkillLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r917.js |
| `_c917RiskyPlayer` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r917.js |
| `_c917SkillCapitalizer` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r917.js |
| `_c917SkillForesight` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r917.js |
| `_c917WorkLifeBalance` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r917.js |
| `_c925AvgSkillLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r925.js |
| `_c925MandatoryRest` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r925.js |
| `_c925SkillInvestmentSystem` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r925.js |
| `_c925SkillPlanner` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r925.js |
| `_c925UltimateRiskTaker` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r925.js |
| `_c955GoodEnough` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r955.js |
| `_c955HealthFirst` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r955.js |
| `_c955Networker` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r955.js |
| `_c955OldFriends` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r955.js |
| `_c955SkillInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r955.js |
| `_c955WorkHard` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r955.js |
| `_c971Content2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r971.js |
| `_c971OldFriends2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r971.js |
| `_c971Rest` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r971.js |
| `_c971SkillCircle` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r971.js |
| `_c971SkillMonetize` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r971.js |
| `_c971Workaholic2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r971.js |
| `_c979CircleUpgrade` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r979.js |
| `_c979DeStress` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r979.js |
| `_c979Gritter` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r979.js |
| `_c979SkillInvestor2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r979.js |
| `_c987HighNetwork` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r987.js |
| `_c987Overworker` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r987.js |
| `_c987RestWell` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r987.js |
| `_c987SkillDeep` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r987.js |
| `_c995Chaser` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r995.js |
| `_c995LifeBalance` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r995.js |
| `_c995TribeJoin` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r995.js |
| `_calledHome` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_careerBalance` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r172.js |
| `_careerChapterNarrative` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r286.js |
| `_careerCompass` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r327.js |
| `_careerDashboardAnalyzed` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r675.js |
| `_careerDataAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r373.js |
| `_careerDataDashboard` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r315.js |
| `_careerDataDriven` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r282.js |
| `_careerDataPanelV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r333.js |
| `_careerDataPanelV3` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r341.js |
| `_careerDataVisualization` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r298.js |
| `_careerExploration` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r259.js |
| `_careerInsightFromEvents` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r364.js |
| `_careerInvestEdge` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r172.js |
| `_careerInvestmentConfidence` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r315.js |
| `_careerJobHunting` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_careerMarathonWisdom` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r391.js |
| `_careerMentorMindset` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r165.js |
| `_careerMilestoneFlag` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r369.js |
| `_careerMilestoneWall` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r285.js |
| `_careerNarrativeSeen` | 1 | 1 | core | A | 1/0/0/0 | core/career_linkage_events.js |
| `_careerNewGoalSet` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r675.js |
| `_careerOriginPride` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r296.js |
| `_careerPathExplorerV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r301.js |
| `_careerPathfinderV3` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r352.js |
| `_careerPush` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r172.js |
| `_careerReferral` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_d_linkage_r234.js |
| `_careerRoadmapMade` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r376.js |
| `_careerTaleSeen` | 1 | 1 | core | A | 1/0/0/0 | core/domain_c_linkage_r196.js |
| `_certCareerLeverage` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r242.js |
| `_certReputationSeen` | 1 | 1 | core | A | 1/0/0/0 | core/domain_a_linkage_r242.js |
| `_chapterEchoRegret` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_g_linkage_r177_part1.js |
| `_checkupFoundIssue` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_chefChenRecipe` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_d_linkage_r175_part1.js |
| `_chenBankJobLead` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_chenGeContact` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events_part2.js |
| `_chinaDelistBought` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_chinaDelistDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_chipFabJob` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_chipStockBought` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_chipStockDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_cityJournalWritten` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_cityMemoryJournal` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r368.js |
| `_cityResident` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_survival.js |
| `_clearanceStock` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_codingInterestPiqued` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_comboCookingMgmt` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_comboRepairSales` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_communityRooted` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r391.js |
| `_companyCultureManual` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r257.js |
| `_companyDataDashboard` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r273.js |
| `_comprehensiveDataHub` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r311.js |
| `_considerRelocate` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_constructionCertPath` | 1 | 1 | data | C1 | 1/0/0/0 | data/job_milestone_events.js |
| `_constructionExposed` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_constructionWhistleblower` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_consultedAgent` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_corpFinanceOptimized` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r681.js |
| `_corpHealthDashboard` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r679.js |
| `_corpLegendWritten` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r681.js |
| `_corpMgmtSynergy` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r681.js |
| `_corpMotherSurgeryDelay` | 1 | 1 | core | C1 | 1/0/0/0 | core/family_events.js |
| `_corporateEntry` | 1 | 1 | core | V | 0/1/0/0 | core/life_decisions.js |
| `_corpStoryBook` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r674.js |
| `_corpSummary` | 1 | 1 | phase2 | C2 | 0/0/0/1 | phase2/corp_ops.js |
| `_corpSupplyChainOptimized` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r673.js |
| `_courseLinkDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_craftReviewHabit` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r269.js |
| `_creditDamaged` | 1 | 1 | core | C1 | 1/0/0/0 | core/family_events.js |
| `_criminalRecord` | 1 | 1 | core | C1 | 1/0/0/0 | core/inheritance_chain.js |
| `_cryptoBought` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_cryptoDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_currentStoryChapter` | 1 | 1 | core | C2 | 0/0/0/1 | core/story_chapters.js |
| `_d1012Alone2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r1012.js |
| `_d1012Healed2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r1012.js |
| `_d1012InvestSense` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r1012.js |
| `_d1012OldFriend` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r1012.js |
| `_d1013ToughAlone` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r1013.js |
| `_d1026SocialInvestIntel` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r1026.js |
| `_d678ReachOut` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r678.js |
| `_d782InvestSocialCircle` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r782.js |
| `_d782SocialCapitalScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r782.js |
| `_d782SocialHealthFriends` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r782.js |
| `_d782SocialNetworkSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r782.js |
| `_d799SocialCapitalValue` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r799.js |
| `_d825SocialCapitalValue` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r825.js |
| `_d828HighAffinityCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r828.js |
| `_d828InvestmentHint` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r828.js |
| `_d828SocialNetworkSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r828.js |
| `_d835HighAffinityCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r835.js |
| `_d835InvestmentHint` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r835.js |
| `_d835SocialNetworkSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r835.js |
| `_d843HighAffinityCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r843.js |
| `_d843InvestmentHint` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r843.js |
| `_d843SocialNetworkSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r843.js |
| `_d851HighAffinityCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r851.js |
| `_d851InvestmentHint` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r851.js |
| `_d851SocialNetworkSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r851.js |
| `_d859HighAffinityCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r859.js |
| `_d859InvestmentHint` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r859.js |
| `_d859SocialNetworkSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r859.js |
| `_d866HighAffinityCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r866.js |
| `_d866InvestmentHint` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r866.js |
| `_d866SocialNetworkSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r866.js |
| `_d874HighAffinityCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r874.js |
| `_d874InvestmentHint` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r874.js |
| `_d874SocialNetworkSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r874.js |
| `_d882HighAffinityCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r882.js |
| `_d882InvestmentHint` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r882.js |
| `_d882SocialNetworkSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r882.js |
| `_d890HighAffinityCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r890.js |
| `_d890InvestmentHint` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r890.js |
| `_d890SocialNetworkSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r890.js |
| `_d898HighAffinityCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r898.js |
| `_d898InvestmentHint` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r898.js |
| `_d898SocialNetworkSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r898.js |
| `_d900bAdDealIncome` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_events_r900b.js |
| `_d900bAdRefused` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_events_r900b.js |
| `_d900bHiredPr` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_events_r900b.js |
| `_d900bToughedOut` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_events_r900b.js |
| `_d906HighAffinityCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r906.js |
| `_d906InvestmentHint` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r906.js |
| `_d906SocialNetworkSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_d_linkage_r906.js |
| `_d910SocialCapitalAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r910.js |
| `_d910SocialHealing` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r910.js |
| `_d910SocialInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r910.js |
| `_d918SocialCapitalizer` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r918.js |
| `_d918SocialInfoInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r918.js |
| `_d918SocialSupport` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r918.js |
| `_d940FriendCared` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r940.js |
| `_d940SocialIntel` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r940.js |
| `_d940ToughItOut` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r940.js |
| `_d940TreasureFriendship` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r940.js |
| `_d948BizPartner` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r948.js |
| `_d948HealedByFriend` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r948.js |
| `_d948Nostalgic` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r948.js |
| `_d948RejectHelp` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r948.js |
| `_d956Alone` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r956.js |
| `_d956Healed` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r956.js |
| `_d956InvestSense` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r956.js |
| `_d956OldFriendship` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r956.js |
| `_d964FriendHeal` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r964.js |
| `_d964InvestMindset` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r964.js |
| `_d964RejectCare` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r964.js |
| `_d964TreasureFriends` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r964.js |
| `_dailyGoalSet` | 1 | 1 | core | C1 | 1/0/0/0 | core/ui_linkage_r168.js |
| `_dailyRitualKeeper` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r186.js |
| `_dashboardCustomized` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r361.js |
| `_dataConsultant` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r685b.js |
| `_dataDiversifyMindset` | 1 | 1 | core | C1 | 1/0/0/0 | core/data_linkage_events.js |
| `_dataDrivenCompany` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r362.js |
| `_dataDrivenDecision` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r271.js |
| `_dataDrivenHealth` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r280.js |
| `_dataDrivenInvestment` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r313.js |
| `_dataDrivenInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r673.js |
| `_dataDrivenMindset` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r360.js |
| `_dataDrivenNarrative` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r280.js |
| `_dataHubV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r310.js |
| `_dataReviewCredibility` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r251.js |
| `_dataSelfAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r363.js |
| `_dataTaxAware` | 1 | 1 | core | A | 1/0/0/0 | core/data_linkage_events.js |
| `_dataVisualizationAware` | 1 | 1 | core | A | 1/0/0/0 | core/domain_a_linkage_r363.js |
| `_debterAngry` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_debtFreeExperience` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_debtHarassmentActive` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_debtHarassmentStart` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_deliveryAppealDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_deliveryBanAppealing` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_deliveryHrInterview` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_deliveryHrPending` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_deliveryRegularContact` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events_part1.js |
| `_demolitionDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_demolitionSupply` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_disruptionExited` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_diversifiedInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r678.js |
| `_divinationBuff` | 1 | 1 | phase1 | C2 | 0/0/0/1 | phase1/actions_extra.js |
| `_divinationExpireDay` | 1 | 1 | phase1 | C2 | 0/0/0/1 | phase1/actions_extra.js |
| `_divinationResult` | 1 | 1 | phase1 | C2 | 0/0/0/1 | phase1/actions_extra.js |
| `_donatedToVendor` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_dryGoodsDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part8.js |
| `_dryGoodsInvest` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_e1005InvGrowth` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r1005.js |
| `_e1005InvPeer` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r1005.js |
| `_e1005KnowledgeValue` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r1005.js |
| `_e621BrokerContact` | 1 | 1 | core | A | 1/0/0/0 | core/domain_e_linkage_r621.js |
| `_e621TradeDiscipline` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r621.js |
| `_e783InvestorSocialTier` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r783.js |
| `_e783LastPortfolioValue` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r783.js |
| `_e792AdvisorConsulted` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r792.js |
| `_e792LastReviewDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r792.js |
| `_e792LastReviewValue` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r792.js |
| `_e822PortfolioHealth` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r822.js |
| `_e826DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r826.js |
| `_e834DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r834.js |
| `_e836DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r836.js |
| `_e842DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r842.js |
| `_e844DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r844.js |
| `_e850DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r850.js |
| `_e852DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r852.js |
| `_e858DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r858.js |
| `_e860DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r860.js |
| `_e866DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r866.js |
| `_e867DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r867.js |
| `_e867TradeWinRate` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r867.js |
| `_e875DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r875.js |
| `_e875TradeWinRate` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r875.js |
| `_e883DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r883.js |
| `_e883TradeWinRate` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r883.js |
| `_e891DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r891.js |
| `_e891TradeWinRate` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r891.js |
| `_e899DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r899.js |
| `_e899TradeWinRate` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r899.js |
| `_e907DebtToAssetRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r907.js |
| `_e907TradeWinRate` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_e_linkage_r907.js |
| `_e911DataDrivenInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r911.js |
| `_e911HealthWealthBalance` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r911.js |
| `_e911StoryTeller` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r911.js |
| `_e911WorkOverHealth` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r911.js |
| `_e927InvestDecisionSystem` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r927.js |
| `_e927InvestSharer` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r927.js |
| `_e927LifeGoalRedefine` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r927.js |
| `_e927NeverSatisfied` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r927.js |
| `_e973InvCircle` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r973.js |
| `_e973InvLearner` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r973.js |
| `_e973InvWisdom` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r973.js |
| `_e981InvClub` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r981.js |
| `_e981InvJourney` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r981.js |
| `_e981KnowledgeInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r981.js |
| `_e989InvCircle2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r989.js |
| `_e989InvLesson` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r989.js |
| `_e989LearnCurve` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r989.js |
| `_e997InvDiscipline` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r997.js |
| `_e997InvTribe` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r997.js |
| `_e997SkillTreeInv` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r997.js |
| `_earlyAdopter` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_ecomSubcontractor` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_educationJobOffer` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_educationOfferDeferred` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_eduGraduationHome` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_eduGraduationJobHunt` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_eduGraduationPhoto` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_eduIgnored` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_eduMentorEnrolled` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part7.js |
| `_eduMiddleman` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_eduMovedOn` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_eduPanicSold` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_eduShorted` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_eduStudyRoom` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_elderWageBonus` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_elevatorMovingBiz` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_emergencyMindset` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_g_linkage_r177_part2.js |
| `_enterCorporateReady` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_b_linkage_r174_part2.js |
| `_equityGrantDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/economy_invest_linkage_events.js |
| `_equityTalkActive` | 1 | 1 | core | C1 | 1/0/0/0 | core/economy_linkage_events.js |
| `_evBoughtDip` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_evChargingJob` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_evChargingStockDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_eventCausalAnalysisV3` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r321.js |
| `_eventCausalAnalysisV4` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r332.js |
| `_eventCausalAnalysisV5` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r339.js |
| `_eventDatabaseV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r323.js |
| `_eventDatabaseV3` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r340.js |
| `_eventDatabaseV4` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r348.js |
| `_eventDatabaseV5` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r356.js |
| `_eventDrivenInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r674.js |
| `_eventEconomicPattern` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r297.js |
| `_eventEconWisdom` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r674.js |
| `_eventPatternAnalysis` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r274.js |
| `_everHelpedElderly` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_survival.js |
| `_everReturnedPhone` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_survival.js |
| `_evHeld` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_evPanicSold` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_evQuit` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_examRentalBiz` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_execLifestyleInflation` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r170.js |
| `_expandHustle` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_g_linkage_r177_part2.js |
| `_exRiderVendor` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_extendedNetwork` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part7.js |
| `_extraClients` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_f1014CycleMaster` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r1014.js |
| `_f1014KeepGoing` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r1014.js |
| `_f1014MemoryPath` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r1014.js |
| `_f1028PriceEye` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r1028.js |
| `_f784LastDataSnapshot` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r784.js |
| `_f784LastFinanceSnapshot` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r784.js |
| `_f868SaveRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r868.js |
| `_f876SaveRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r876.js |
| `_f884SaveRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r884.js |
| `_f892SaveRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r892.js |
| `_f900SaveRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r900.js |
| `_f908SaveRatio` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r908.js |
| `_f912DataVizAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r912.js |
| `_f912FinanceDashboard` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r912.js |
| `_f912MemoryCurator` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r912.js |
| `_f920DataLife` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r920.js |
| `_f920FinanceVisualizer` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r920.js |
| `_f920MemoryKeeper` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r920.js |
| `_f928DataVizOptimizer` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r928.js |
| `_f928FreedomPlanner` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r928.js |
| `_f928MemoryOrganizer` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r928.js |
| `_f934DataVizMaster` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r934.js |
| `_f934FinanceSteward` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r934.js |
| `_f934LifeChronicler` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r934.js |
| `_f942AchievementCollector` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r942.js |
| `_f942FinFreedomPlan` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r942.js |
| `_f942PricePredictor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r942.js |
| `_f942Saver` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r942.js |
| `_f950LifeAuthor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r950.js |
| `_f950MillionairePlan` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r950.js |
| `_f950Saver2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r950.js |
| `_f950SmartShopper` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r950.js |
| `_f958FinFree` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r958.js |
| `_f958PriceMapper` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r958.js |
| `_f958Saver3` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r958.js |
| `_f958TimelineKeeper` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r958.js |
| `_factoryFireHero` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_factoryrepairJob` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_survival.js |
| `_factoryRepairMan` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_factoryReskilling` | 1 | 1 | data | C1 | 1/0/0/0 | data/job_milestone_events.js |
| `_fameConnectionBonus` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_familyInCity` | 1 | 1 | core | C1 | 1/0/0/0 | core/family_events.js |
| `_familyStayedHometown` | 1 | 1 | core | C1 | 1/0/0/0 | core/family_events.js |
| `_fateBoomSafe` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_fateJobHunting` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_fateShieldReady` | 1 | 1 | core | C1 | 1/0/0/0 | core/heritage_coin.js |
| `_financeCommandCenter` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r327.js |
| `_financeDashboard` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r293.js |
| `_financialFreedomPlan` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r367.js |
| `_financialMilestone100k` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r271.js |
| `_firstBucketInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_fixedDeliveryRoute` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_fluProfiteer` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_fluVolunteer` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_focusedInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r678.js |
| `_foggyMarketNoted` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_forwardLooking` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_survival.js |
| `_founderDeclinedBuyback` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_founderExited` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_founderQuitInRage` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_founderRebelled` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_founderReclaimed` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_founderRetrospected` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r391.js |
| `_founderWellnessDay` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r279.js |
| `_freeCourseLink` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_freeTrainingSeen` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events_part8.js |
| `_friendCheatWarned` | 1 | 1 | data | C1 | 1/0/0/0 | data/moral_events.js |
| `_friendJobReferral` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r374.js |
| `_frugalMindset` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_b_linkage_r228.js |
| `_g1007CirclePure` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r1007.js |
| `_g1007InnerPeace` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r1007.js |
| `_g1007OnWay` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r1007.js |
| `_g1007SoloEnjoy` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r1007.js |
| `_g631EmergencyFund` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r631.js |
| `_g728HealthChecked` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r728.js |
| `_g770HealthChecked` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r770.js |
| `_g770HealthPlanner` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r770.js |
| `_g770Networker` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r770.js |
| `_g770SkillAnalyst` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r770.js |
| `_g770SkillFocused` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r770.js |
| `_g770SocialReflect` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r770.js |
| `_g786AvgSkillLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r786.js |
| `_g786MaxSkillLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r786.js |
| `_g786SkillCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r786.js |
| `_g786TotalAssets` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r786.js |
| `_g786WealthLevel` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r786.js |
| `_g830QualityScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r830.js |
| `_g838QualityScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r838.js |
| `_g846QualityScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r846.js |
| `_g854QualityScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r854.js |
| `_g869QualityScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r869.js |
| `_g877QualityScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r877.js |
| `_g885QualityScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r885.js |
| `_g893QualityScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r893.js |
| `_g901QualityScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r901.js |
| `_g909QualityScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_g_linkage_r909.js |
| `_g913LifeDataAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r913.js |
| `_g913LifeSecondHalf` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r913.js |
| `_g913MoneyAboveAll` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r913.js |
| `_g913SocialMaturity` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r913.js |
| `_g967DataAware` | 1 | 1 | core | A | 1/0/0/0 | core/domain_g_linkage_r967.js |
| `_g967LifePlanner` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r967.js |
| `_g967Lonely` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r967.js |
| `_g967SocialMature` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r967.js |
| `_g975ChapterReview` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r975.js |
| `_g975LifeRecorder` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r975.js |
| `_g975Lonely2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r975.js |
| `_g975TrueFriends` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r975.js |
| `_g983LifeRecorder` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r983.js |
| `_g983LifeWisdom` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r983.js |
| `_g983QualitySocial` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r983.js |
| `_g983Solo` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r983.js |
| `_g991DataLegacy` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r991.js |
| `_g991LifeReflect` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r991.js |
| `_g991SocialWise` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r991.js |
| `_g991SoloWise` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r991.js |
| `_g999DeepSocial` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r999.js |
| `_g999Introspect` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r999.js |
| `_g999LifeAccount` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r999.js |
| `_g999MeaningFound` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r999.js |
| `_g999Thinker` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r999.js |
| `_gamblerMode` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_gaokaoTutoring` | 1 | 1 | data | C1 | 1/0/0/0 | data/job_milestone_events.js |
| `_garmentJobApplied` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_gaveCoatToHomeless` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_gaveFoodToChild` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_gaveUmbrella` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_gigPrivateOrders` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_goldDiamondHands` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_goldSold` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_goldWatched` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_goodSleepDay` | 1 | 1 | data | C2 | 0/0/0/1 | data/news.js |
| `_gratitudeUnspoken` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_g_linkage_r179.js |
| `_grayHelpedOthers` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_grayLegitBiz` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_grayLied` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_grayQuit` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_grayRefused` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_grayRetired` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_groupBuyInformed` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_growthDataAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r371.js |
| `_guerrillaVendor` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_h1017bPersonalLedger` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_events_r1017b.js |
| `_h1017bStressIgnored` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_events_r1017b.js |
| `_h1017bStressManaged` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_events_r1017b.js |
| `_h690Pro` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r690.js |
| `_h771LastHealthCheck` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_h_linkage_r771.js |
| `_h787CorpHealthScore` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_h_linkage_r787.js |
| `_h787LastBurnRate` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_h_linkage_r787.js |
| `_h787LastHealthCheck` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_h_linkage_r787.js |
| `_h787LastRevenue` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_h_linkage_r787.js |
| `_h787LastTeamEvent` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_h_linkage_r787.js |
| `_h787TeamSize` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_h_linkage_r787.js |
| `_h914CompanyStoryTeller` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r914.js |
| `_h914DataDrivenEnterprise` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r914.js |
| `_h914FounderHealthAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r914.js |
| `_h914OverworkedFounder` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r914.js |
| `_h922BrandBuilder` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r922.js |
| `_h922DataAssetManager` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r922.js |
| `_h922FounderHealthPlan` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r922.js |
| `_h922OverworkedFounder2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r922.js |
| `_h931DataDriven` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r931.js |
| `_h931EntrepreneurStar` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r931.js |
| `_h931HealthFirst` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r931.js |
| `_h931ProductFocus` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r931.js |
| `_h931Workaholic` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r931.js |
| `_h936DataAssetOperator` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r936.js |
| `_h936HealthAwake` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r936.js |
| `_h936Phoenix` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r936.js |
| `_h936Pragmatist` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r936.js |
| `_h936RecklessFounder` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r936.js |
| `_h944DataStrategist` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r944.js |
| `_h944IndustryLeader` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r944.js |
| `_h944LifeBalance` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r944.js |
| `_h944Overworked3` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r944.js |
| `_h944ProductDeep` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r944.js |
| `_h952DataDriven` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r952.js |
| `_h952HealthAwake2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r952.js |
| `_h952LegacyWriter` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r952.js |
| `_h952Workaholic2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r952.js |
| `_h960Grinder` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r960.js |
| `_h960Mentor` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r960.js |
| `_h960WellnessPlan` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r960.js |
| `_hasBianzhi` | 1 | 1 | core | C1 | 1/0/0/0 | core/career_path_events.js |
| `_hasCheapMedicine` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_hasCorpEquity` | 1 | 1 | core | C1 | 1/0/0/0 | core/economy_invest_linkage_events.js |
| `_hasFan` | 1 | 1 | app_bridge | V | 0/1/0/0 | app_bridge/webapp_runtime_bridge.js |
| `_hasInheritance` | 1 | 1 | core | C1 | 1/0/0/0 | core/inheritance_chain.js |
| `_hasJobOpportunity` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_hasLostPropertyCollapse` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_hasMedicalDebt` | 1 | 1 | phase1 | C1 | 1/0/0/0 | phase1/extra_events.js |
| `_hasScoutContact` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events_part2.js |
| `_hasSkillApprentice` | 1 | 1 | ui | C1 | 1/0/0/0 | ui/career_dev.js |
| `_hasSocialSupport` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_d_linkage_r175_part1.js |
| `_hasStartupIntent` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r374.js |
| `_healthCheckAlertIgnoredDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/review_improvements.js |
| `_healthCostAware` | 1 | 1 | core | A | 1/0/0/0 | core/domain_a_linkage_r164.js |
| `_healthDashboard` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r277.js |
| `_healthDataManagement` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r363.js |
| `_healthTracker` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r285.js |
| `_healthTrackingActive` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r376.js |
| `_helpedElderTaxi` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_helpedFriendFindWork` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_helpedVendorGetCartBack` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_heritageFamilyRecipe` | 1 | 1 | core | C1 | 1/0/0/0 | core/heritage_coin.js |
| `_heritageFateDice` | 1 | 1 | core | C1 | 1/0/0/0 | core/heritage_coin.js |
| `_hint_first_hot_sector_name` | 1 | 1 | core | C2 | 0/0/0/1 | core/review_improvements.js |
| `_hkListJobChance` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_homeboundAfterPhd` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_huangDeliveryBonus` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_ignoredParentsCall` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_importGoodsStock` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_impressedHr` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_influencerSupply` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_inheritanceArrestNote` | 1 | 1 | core | V | 0/1/0/0 | core/inheritance_chain.js |
| `_inheritanceCashBase` | 1 | 1 | core | C2 | 0/0/0/1 | core/inheritance_chain.js |
| `_inheritanceCashBonus` | 1 | 1 | core | C2 | 0/0/0/1 | core/inheritance_chain.js |
| `_inheritanceCriminalRecord` | 1 | 1 | core | C1 | 1/0/0/0 | core/inheritance_chain.js |
| `_inheritanceDebtCollection` | 1 | 1 | core | C2 | 0/0/0/1 | core/inheritance_chain.js |
| `_inheritanceDebtNote` | 1 | 1 | core | V | 0/1/0/0 | core/inheritance_chain.js |
| `_inheritanceFromDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/inheritance_chain.js |
| `_inheritanceSummary` | 1 | 1 | core | C2 | 0/0/0/1 | core/inheritance_chain.js |
| `_insiderConfessed` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_insiderDenied` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_insiderRecord` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_insiderTradingRefused` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_investAwakening` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r172.js |
| `_investClubMember` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r629.js |
| `_investInSelf` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_g_linkage_r177_part2.js |
| `_investLesson_loss` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r244.js |
| `_investLesson_neutral` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r244.js |
| `_investLesson_win` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r244.js |
| `_investmentCareerMindset` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r375.js |
| `_investmentCareerPrimed` | 1 | 1 | core | C1 | 1/0/0/0 | core/career_crosslink_r65.js |
| `_investmentCircleJoined` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r367.js |
| `_investmentDashboardBuilt` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r383.js |
| `_investmentDashboardUI` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r276.js |
| `_investmentDataDrivenV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r343.js |
| `_investmentInsightActive` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r357.js |
| `_investmentInsightDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_c_linkage_r357.js |
| `_investmentJournalKeeper` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r276.js |
| `_investmentMentorMindset` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r167.js |
| `_investmentMilestone500k` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r300.js |
| `_investmentMindset` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r96.js |
| `_investmentPortfolioOptimized` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r359.js |
| `_investmentReviewHabit` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r359.js |
| `_investmentTimeLimit` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r276.js |
| `_investmentTrackerOptimized` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r368.js |
| `_investmentTrackerV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r310.js |
| `_investmentTrackerV3` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r336.js |
| `_investorNetworkJoined` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r383.js |
| `_investRebalanced` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_e_linkage_r176.js |
| `_joblessMotivation` | 1 | 1 | core | C1 | 1/0/0/0 | core/lifecycle_linkage_events.js |
| `_journalHabit` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r360.js |
| `_keptLotteryMoney` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_knowsLaborMarket` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_knowsRentalKickback` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_knowsRentalMarket` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_knowsScrapPrice` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_laborDayParticipated` | 1 | 1 | core | C1 | 1/0/0/0 | core/festivals.js |
| `_laoGuanFriend` | 1 | 1 | data | C1 | 1/0/0/0 | data/job_milestone_events.js |
| `_lastBatonWise` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_lastNegativeEventDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_core.js |
| `_lastQuarterRevenue` | 1 | 1 | phase2 | C2 | 0/0/0/1 | phase2/corp_ops.js |
| `_layoffAskedForReferral` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_layoffCheapGear` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_layoffChoseOldZhao` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_layoffChoseXiaoLin` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_layoffGearDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_layoffLetThemDecide` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_leadershipInsight` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_h_linkage_r362.js |
| `_learnedCodingFromLayoff` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_learnedNoodle` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_legacyRetroWritten` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r685b.js |
| `_legalStallPermit` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_lessonDiversification` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_e_linkage_r176.js |
| `_libraryMentorContact` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events.js |
| `_lieflatAtPeace` | 1 | 1 | data | C1 | 1/0/0/0 | data/crisis35_followups.js |
| `_lifeCommandCenterV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r336.js |
| `_lifecycleSavingsPlan` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r680.js |
| `_lifeDashboardV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r301.js |
| `_lifeDataAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r377.js |
| `_lifeDataVisualization` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r286.js |
| `_lifeGoalSet` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r632.js |
| `_lifeMilestoneKeeper` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r274.js |
| `_lifePlanningDone` | 1 | 1 | core | B | 1/0/0/0 | core/domain_f_linkage_r360.js |
| `_lifeQualityTracked` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r680.js |
| `_lifeReflectionDone` | 1 | 1 | core | B | 1/0/0/0 | core/domain_g_linkage_r361.js |
| `_lifeReviewHabit` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r390.js |
| `_lifeRhythmKeeper` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r263.js |
| `_lifeStageDataTracked` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r680.js |
| `_lifeTimelineAware` | 1 | 1 | core | A | 1/0/0/0 | core/domain_b_linkage_r372.js |
| `_liGuruInviteDeclined` | 1 | 1 | data | C1 | 1/0/0/0 | data/corporate_npc_events.js |
| `_locationHintDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_longTermStartupDiscount` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_g_linkage_r179.js |
| `_lookingForNewHome` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_lowPriceRoute` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_macroEconAnalyst` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r678.js |
| `_marketDataDriven` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r371.js |
| `_marketEnduranceMindset` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_e_linkage_r167.js |
| `_marketIntelligence` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r277.js |
| `_mcReturnedHome` | 1 | 1 | phase2 | C1 | 1/0/0/0 | phase2/life_crossroads.js |
| `_medicalDebtInstallment` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_medVolunteerHonor` | 1 | 1 | core | C1 | 1/0/0/0 | core/career_path_events.js |
| `_memoirSummary` | 1 | 1 | ui | C2 | 0/0/0/1 | ui/victory.js |
| `_memoryWallKeeper` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r250.js |
| `_mentorLearning` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_messageVisualEnhancement` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r238.js |
| `_mgmtCrisisHiddenRisk` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_midAutumnGift` | 1 | 1 | core | C1 | 1/0/0/0 | core/festivals.js |
| `_midAutumnParticipated` | 1 | 1 | core | C1 | 1/0/0/0 | core/festivals.js |
| `_midlifeRetraining` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_millionAmbition` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_minWageRaised` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_moneyManagementAware` | 1 | 1 | core | A | 1/0/0/0 | core/domain_b_linkage_r372.js |
| `_monthlySkilledGig` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_moralNetworkUnlocked` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events_part8.js |
| `_muscleMemoryNotes` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_nationalDayParticipated` | 1 | 1 | core | C1 | 1/0/0/0 | core/festivals.js |
| `_needBuyNewGear` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_neighborGoodwill` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r296.js |
| `_neighborHasIOU` | 1 | 1 | data | C1 | 1/0/0/0 | data/moral_events.js |
| `_neighborMet` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events.js |
| `_neighborRefused` | 1 | 1 | data | C1 | 1/0/0/0 | data/moral_events.js |
| `_newFriendIntroduced` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r621.js |
| `_newYearChefMeal` | 1 | 1 | core | C1 | 1/0/0/0 | core/festivals.js |
| `_nightMarketDecline` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_nightMarketInfo` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events.js |
| `_nightShiftJob` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_noSocialSecurity` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_npcBudgetSense` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r194.js |
| `_npcDecayingCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r238.js |
| `_npcGeneralSecret` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_npcIntroducedJob` | 1 | 1 | core | C1 | 1/0/0/0 | core/npc_relationships.js |
| `_npcInvestmentIntelV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r308.js |
| `_npcInvestTipSaved` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r175.js |
| `_npcInvestTipUsed` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r175.js |
| `_npcMentorId` | 1 | 1 | core | C2 | 0/0/0/1 | core/npc_social_linkage_r66.js |
| `_npcMentorXpBonus` | 1 | 1 | core | V | 0/1/0/0 | core/npc_social_linkage_r66.js |
| `_npcPriceDiscountActive` | 1 | 1 | core | C1 | 1/0/0/0 | core/npc_linkage_r167.js |
| `_npcRelationshipWebV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r352.js |
| `_npcTempJobDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_npcTempJobReferral` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_npcTotalMet` | 1 | 1 | core | A | 0/0/0/1 | core/domain_f_linkage_r238.js |
| `_npcVisitableCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r238.js |
| `_npcVisitables` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r238.js |
| `_officeFactionEvidence` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_officeFactionJoined` | 1 | 1 | core | V | 0/1/0/0 | core/events_corp.js |
| `_officeFactionNeutral` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_oldManTip` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_oldStreetBonus` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_oldzhouContactsGiven` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_oldzhouSelfManage` | 1 | 1 | data | C1 | 1/0/0/0 | data/corporate_npc_events.js |
| `_oldZhouTricycle` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_d_linkage_r175_part1.js |
| `_oldZhouWeatherTipNoted` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_p2pDebtDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_p2pHelped` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_p2pInvested` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_p2pWatched` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_pandemicProfiteer` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_pandemicVolunteer` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_passiveFree` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_e_linkage_r176.js |
| `_paySocialSecurity` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_phdNegotiateBonus` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_portfolioDiversity` | 1 | 1 | phase2 | C2 | 0/0/0/1 | phase2/investment.js |
| `_portfolioRebalanced` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r679.js |
| `_portfolioRiskRating` | 1 | 1 | phase2 | C2 | 0/0/0/1 | phase2/investment.js |
| `_portfolioSnapshotTaken` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r679.js |
| `_portfolioTotalValue` | 1 | 1 | phase2 | C2 | 0/0/0/1 | phase2/investment.js |
| `_pragmaticCoping` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_g_linkage_r177_part1.js |
| `_premadeStock` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_premiumRoute` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_priceAlertSystem` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r267.js |
| `_priceComparisonTool` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r258.js |
| `_priceWarningDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_promisedHome` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_promotionGiftGiven` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_promotionNoGift` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_promotionReported` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_quantContact` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events.js |
| `_quantFundBought` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_quantFundDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_quitEntrepreneurship` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_b_linkage_r174_part2.js |
| `_rainCanvasDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_rainWholesaleBought` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_rainWholesaleDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_rateCutInvestMode` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_realEstateGambleRefused` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_survival.js |
| `_realEstateStockBought` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_realEstateStockDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_reBoughtProperty` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_reCoalitionAccepted` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_recoveryContractorContact` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events_part7.js |
| `_recoveryDietHabit` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part7.js |
| `_recoveryHerbalAdvice` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part7.js |
| `_recoveryRunningHabit` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part7.js |
| `_recoverySleepHabit` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part7.js |
| `_referredFriend` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_regularClient` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_regularCreditDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part2.js |
| `_regularShopTip` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_reinvestFlag` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_e_linkage_r176.js |
| `_reLawyered` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_remoteWorkDeferred` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_remoteWorkUnlocked` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events.js |
| `_rentHalfIncrease` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_rentWillIncrease` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_repairShopPartner` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_rePassed` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_reportedFakeSeller` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_survival.js |
| `_reportedScam` | 1 | 1 | phase1 | C1 | 1/0/0/0 | phase1/extra_events.js |
| `_rePropertyDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_wealth.js |
| `_reputationReferralActive` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_reSaved` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_reStartedBusiness` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_restaurantPartner` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_resumeReady` | 1 | 1 | app_bridge | V | 0/1/0/0 | app_bridge/webapp_runtime_bridge.js |
| `_retailShortDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_retailShortSide` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_retailWsbBet` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_retailWsbDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_reviewAmbitious` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_reviewHonest` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_revMilestone100k` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r231.js |
| `_riderRightsAppealing` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_riskAverseInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_core.js |
| `_rollbackBoughtHouse` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_rollbackBurned` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_rollbackDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_rollbackSaved` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_rollbackStartedBiz` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_roommateNegotiated` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_sandboxChallenge` | 1 | 1 | main.js | C2 | 0/0/0/1 | main.js |
| `_savedCoworkerDoc` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_savingsDiscipline` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r250.js |
| `_scamSalesman` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_scamWhistleblower` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_schoolDistrictBought` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_schoolDistrictDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_scrapAlertDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_scrapeCheckCamera` | 1 | 1 | data | C1 | 1/0/0/0 | data/moral_events.js |
| `_scrapeLeftNote` | 1 | 1 | data | C1 | 1/0/0/0 | data/moral_events.js |
| `_scrapIncomeBonus` | 1 | 1 | core | V | 0/1/0/0 | core/cross_system_events.js |
| `_scrapPriceAlert` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_seasonNarrativeTriggered` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r192.js |
| `_seasonTransitionMsg` | 1 | 1 | data | C2 | 0/0/0/1 | data/domain_g_linkage_r180.js |
| `_secretChannelKnown` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events_part2.js |
| `_secretChannelUnlocked` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events_part2.js |
| `_secretInfoFrom` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_selfEmployedFrom` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_selfEmployedPending` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_seniorIncomeTier` | 1 | 1 | core | C1 | 1/0/0/0 | core/career_path_events.js |
| `_seniorInvestReady` | 1 | 1 | core | C1 | 1/0/0/0 | core/career_path_events.js |
| `_sharingJobUnlocked` | 1 | 1 | core | A | 1/0/0/0 | core/events_street_life.js |
| `_sheinFlipping` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_shelterVisited` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_shoppingFestDeal` | 1 | 1 | core | V | 0/1/0/0 | core/events_street_life.js |
| `_shoppingFestParticipated` | 1 | 1 | core | C1 | 1/0/0/0 | core/festivals.js |
| `_shoppingStockDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_shortDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_corp.js |
| `_shortedOwnCompany` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_shortReported` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_shortVideoWentViral` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_sideHustlePartner` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_sideWithChen` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_sideWithWang` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_siegeJobHunting` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_siegeKpiMode` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_siegeObserved` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_corp.js |
| `_siteSafetyImproved` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_skillAchievementWall` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r272.js |
| `_skillDashboard` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r272.js |
| `_skillDrivenMarketAnalysis` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r290.js |
| `_skillDrivenVenturePlan` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r675.js |
| `_skillInvestmentPlan` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r381.js |
| `_skillMasterBookPublished` | 1 | 1 | core | C1 | 1/0/0/0 | core/career_linkage_events.js |
| `_skillMasterHasApprentice` | 1 | 1 | core | C1 | 1/0/0/0 | core/career_linkage_events.js |
| `_skillMasterOfferSalary` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_skillMasterOfferSkill` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_skillMasterStartupBonus` | 1 | 1 | core | C1 | 1/0/0/0 | core/career_linkage_events.js |
| `_skillMasteryKeptCard` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_skillMasterySideJob` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_skillNeighborBond` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r251.js |
| `_skillPlanMade` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r373.js |
| `_skillRoadmapPlan` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r679.js |
| `_skillSynergyPair` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part1.js |
| `_skillTrainingMotivated` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r165.js |
| `_skillValueAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r379.js |
| `_skippedLibrary` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_socialCapitalAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r382.js |
| `_socialCapitalDashboardV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r325.js |
| `_socialCapitalSystemV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r291.js |
| `_socialCircleAware` | 1 | 1 | core | A | 1/0/0/0 | core/domain_d_linkage_r358.js |
| `_socialDataAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r371.js |
| `_socialInvestmentAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/npc_social_linkage_r66.js |
| `_socialMilestoneFlag` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r369.js |
| `_socialNetworkInsight` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r374.js |
| `_socialNetworkMapUI` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r293.js |
| `_socialNetworkMapV2` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r310.js |
| `_socialNetworkMapV3` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r344.js |
| `_socialNetworkVisualized` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r376.js |
| `_socialRelationshipMap` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_f_linkage_r270.js |
| `_springFestivalHome` | 1 | 1 | core | C1 | 1/0/0/0 | core/festivals.js |
| `_springJobFairApplied` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_springJobSearch` | 1 | 1 | phase1 | C1 | 1/0/0/0 | phase1/extra_events.js |
| `_springPlanBuff` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_stallShelf` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_starbucksDominant` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_startedExercise` | 1 | 1 | core | C1 | 1/0/0/0 | core/personal_growth_events.js |
| `_startedHustleWithFriend` | 1 | 1 | core | C1 | 1/0/0/0 | core/news_driven_events.js |
| `_startupAnniversarySeen` | 1 | 1 | core | A | 0/0/0/1 | core/domain_b_linkage_r231.js |
| `_startupExitedEarly` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_startupInvestorMindset` | 1 | 1 | core | C1 | 1/0/0/0 | core/company_linkage_events.js |
| `_startupNarrativeReady` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_g_linkage_r179.js |
| `_startupPassed` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_startupRenewed` | 1 | 1 | data | C1 | 1/0/0/0 | data/domain_b_linkage_r174_part2.js |
| `_starvedForFuture` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_statusAlertsCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r238.js |
| `_statusAlertsDangerCount` | 1 | 1 | core | C2 | 0/0/0/1 | core/domain_f_linkage_r238.js |
| `_stayNeutral` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_stockBoomHalfInvested` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_stockBoomInvested` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_storyCorpSeedRecorded` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_b_linkage_r700.js |
| `_streetReferralActive` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_studyingCivilExam` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_subsidyActive` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_subsidyEndDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/cross_system_events_part8.js |
| `_subsidyWarLeft` | 1 | 1 | core | B | 1/0/0/0 | core/events_street_wealth.js |
| `_subsidyWarWatched` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_sunkCostBailed` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_sunkCostStopped` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_supplyChainSavvy` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r164.js |
| `_synergyAwareness` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r269.js |
| `_synergyDualEventShown` | 1 | 1 | data | C2 | 0/0/0/1 | data/domain_c_linkage_r173.js |
| `_synergyTripleEventShown` | 1 | 1 | data | C2 | 0/0/0/1 | data/domain_c_linkage_r173.js |
| `_talentDepartureBlessing` | 1 | 1 | core | B | 1/0/0/0 | core/cross_system_events.js |
| `_talentDepartureLeft` | 1 | 1 | core | B | 1/0/0/0 | core/cross_system_events.js |
| `_talentDepartureRetained` | 1 | 1 | core | B | 1/0/0/0 | core/cross_system_events.js |
| `_targeting100m` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part7.js |
| `_taxAvoidanceMindset` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_a_linkage_r76.js |
| `_teaStoreUnderdog` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_techparkInspiration` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_techparkInterview` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_techWLBFactor` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_toldCoworkerDoc` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_toughMindset` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_tradeIntelUnlocked` | 1 | 1 | core | A | 1/0/0/0 | core/domain_a_linkage_r92.js |
| `_tradeJobChance` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_trainerReputation` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_c_linkage_r685b.js |
| `_travelFriendAdded` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_triedReachingOut` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_triedShortVideo` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_tripleSkillContact` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events_part8.js |
| `_trustDebtBought` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_trustDebtDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_tutoringReputation` | 1 | 1 | data | C1 | 1/0/0/0 | data/job_milestone_events.js |
| `_unfinishedInvestigated` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_usdHeldDay` | 1 | 1 | core | C2 | 0/0/0/1 | core/events_street_life.js |
| `_vendingLoyalty` | 1 | 1 | data | C1 | 1/0/0/0 | data/job_milestone_events.js |
| `_veteranNetwork` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part7.js |
| `_veteranReferral` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_volunteerDone` | 1 | 1 | core | B | 1/0/0/0 | core/events_street_life.js |
| `_volunteerSocial` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_wageNegotiation` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_waitedForLotteryOwner` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_wealth.js |
| `_walletConfessed` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_walletJobAccepted` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_survival.js |
| `_wangChenSupply` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_wangRentalDiscounted` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_wantFormalJob` | 1 | 1 | core | C1 | 1/0/0/0 | core/events_street_life.js |
| `_wantOwnShop` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_wasteRecyclingContract` | 1 | 1 | data | C1 | 1/0/0/0 | data/job_milestone_events.js |
| `_wealth1mFinanciallyPlanned` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part7.js |
| `_wealth500kHomeBuyer` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part7.js |
| `_wealth500kInvestor` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part7.js |
| `_wealthMilestone1M` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r319.js |
| `_wealthMilestone2M` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r337.js |
| `_wealthMilestone500k` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r311.js |
| `_wealthMilestoneFlag` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r361.js |
| `_wealthNarrative` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r286.js |
| `_weatherIndoorWork` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r240.js |
| `_weatherReader` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r296.js |
| `_weatherRestDay` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_g_linkage_r240.js |
| `_weatherWorkBonus` | 1 | 1 | core | V | 0/1/0/0 | core/domain_g_linkage_r240.js |
| `_westCityIntel` | 1 | 1 | core | C1 | 1/0/0/0 | core/domain_d_linkage_r166.js |
| `_whiteCollarEntry` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part1.js |
| `_wholesaleTipActive` | 1 | 1 | core | C1 | 1/0/0/0 | core/npc_relationships.js |
| `_windyJobLead` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_winterWorkerBadge` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part7.js |
| `_workLifeBalanceAchieved` | 1 | 1 | core | B | 1/0/0/0 | core/domain_c_linkage_r369.js |
| `_wroteClarity` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part8.js |
| `_xiaoliBrandDeal` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_xiaoliBrandTrial` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_xiaoWeiRecipe` | 1 | 1 | data | C1 | 1/0/0/0 | data/npcs.js |
| `_zhangIntroduced` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events.js |
| `_zhangLogisticsJob` | 1 | 1 | phase1 | C1 | 1/0/0/0 | phase1/extra_events.js |
| `_zhangOfferPending` | 1 | 1 | phase1 | C1 | 1/0/0/0 | phase1/extra_events.js |
| `_zhaojieJumpPassed` | 1 | 1 | data | C1 | 1/0/0/0 | data/corporate_npc_events.js |
| `_zhaojieJumpPrepared` | 1 | 1 | data | C1 | 1/0/0/0 | data/corporate_npc_events.js |
| `_zhaojieShopDeal` | 1 | 1 | core | C1 | 1/0/0/0 | core/cross_system_events_part2.js |
| `_zhouWholesaleChannelKnown` | 1 | 1 | core | A | 1/0/0/0 | core/cross_system_events.js |
| `ajieGivenExtension` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `ajieMovedOn` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `boardCrisisResolved` | 1 | 1 | phase2 | B | 1/0/0/0 | phase2/startup.js |
| `bossLiLoan` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `bubbleRecognizer` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part1.js |
| `careerInspiration` | 1 | 1 | data | D | 1/0/0/0 | data/era_events.js |
| `ceoReplaced` | 1 | 1 | phase2 | D | 1/0/0/0 | phase2/startup.js |
| `chainStorePartner` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part1.js |
| `chefChenWillOpen` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `chenBankInfo` | 1 | 1 | data | A | 1/0/0/0 | data/npcs.js |
| `chenGeSearchingAjie` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `chenSideJob` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `communityAdvisor` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part1.js |
| `daigouPartnership` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part1.js |
| `deliveryBanRecovered` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part1.js |
| `elderSonIntro` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part1.js |
| `forceRest` | 1 | 1 | phase2 | D | 1/0/0/0 | phase2/personal_growth.js |
| `gaveUpSelfMedia` | 1 | 1 | data | D | 1/0/0/0 | data/side_hustle_events.js |
| `hasPet` | 1 | 1 | core | D | 1/0/0/0 | core/events_street_survival.js |
| `huangStationManager` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `indieDevLaunched` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part2.js |
| `industryIntel` | 1 | 1 | data | D | 1/0/0/0 | data/era_events.js |
| `linVegStand` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `linVegTips` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `mediaAppeal` | 1 | 1 | data | D | 1/0/0/0 | data/side_hustle_events.js |
| `moralPushedCar` | 1 | 1 | data | D | 1/0/0/0 | data/moral_events.js |
| `moralWalletConfessed` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part1.js |
| `oldZhouBetterDeal` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `oldZhouMingChannel` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part2.js |
| `oldZhouMingIntro` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part2.js |
| `pivotSuccess` | 1 | 1 | core | B | 1/0/0/0 | core/cross_system_events_part1.js |
| `preciousConsumerBadge` | 1 | 1 | data | D | 1/0/0/0 | data/era_events.js |
| `reflectorBadge` | 1 | 1 | data | D | 1/0/0/0 | data/era_events.js |
| `repLongTermGig` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part2.js |
| `rideCaught` | 1 | 1 | data | D | 1/0/0/0 | data/side_hustle_events.js |
| `smallBizDifferentiated` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part1.js |
| `startupEpiphanyDone` | 1 | 1 | core | B | 1/0/0/0 | core/cross_system_events_part1.js |
| `startupMentorBonus` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part1.js |
| `tutorAgencyOffer` | 1 | 1 | data | D | 1/0/0/0 | data/side_hustle_consequences.js |
| `tutorInstitutionPartner` | 1 | 1 | core | D | 1/0/0/0 | core/cross_system_events_part1.js |
| `wangPriority` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `wuBeautyClients` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `wuBeautyShop` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `xiaochenDispatcher` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `xiaochenNightDelivery` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `xiaoliAssistant` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `xiaoliOwnAccount` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `xiaoMeiSupport` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `zhangDeepReferred` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `zhaoApprentice` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `zhaoFreeRepair` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `zhaojiePriorityViewing` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |
| `zhaojieWillOpenStore` | 1 | 1 | data | D | 1/0/0/0 | data/npcs.js |

---

## ✅ 安全性前置验证（已做，结论：可静态判定）

在建议批量删除前，已排查「是否存在对 flags 的动态读取」——若有，静态孤儿判定就不成立：

| 检查项 | 结果 |
|--------|------|
| `flags[变量]` 动态索引 | **0 处**（所有访问都是 `flags.名字` 静态形式） |
| `for (k in flags)` 遍历 | **0 处** |
| `Object.keys(flags)` 前缀扫描 | **1 处**：`daily_pipeline.js:2941` 扫 `_lifeWisdom_` 前缀 |
| 命中该前缀的孤儿 | **0 个** |

→ 当前孤儿列表**不存在动态读取造成的误报**，可放心按静态判定处理。

## ⚠️ 执行前提

清理孤儿 flag 需要改 `src/js/**`，而当前工作树已有他人未提交改动（`git status` 可见 13 个 src/js 文件）。
**在这些改动提交前，不要开始批量清理**，否则会与他人的修改混在一起、无法区分。

建议顺序：
1. 等他人改动落地 → 2. 从 **C1 类（`_` 前缀 + 纯布尔开关）** 开始，这是最安全的试水批次 → 3. 每域一批、单独 commit → 4. 再处理 V 类（值记录，需先确认是否该接线）

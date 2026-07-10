const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src", "js", "core", "news_system.js");
let content = fs.readFileSync(filePath, "utf8");

const batch = `
  // ====== 批次 11：军工/社交/创业/环保/文化/打工进阶（+45条） ======

  // ====== L1 国际新闻 ======
  {id:"defense_spending_surge",headline:"⚔️ 全球军费开支突破2.5万亿美元,军工股集体暴涨",level:"L1",type:"investment",effects:{investmentEffect:[{allStocks:true,mul:0.85},{symbols:["COPPER","ALUM"],mul:1.25}],priceMod:{scrap_metal:1.25,electronics:1.1},duration:12},conduit:{targetLevel:"L2",delayRange:[2,4],chance:0.5}},
  {id:"global_talent_war",headline:"🧠 全球人才争夺战白热化,AI工程师年薪突破¥500万",level:"L1",type:"job",effects:{jobBonus:["web_designer","server_ops","network_monitor"],jobMultiplier:1.3,jobPenalty:["factory_work_assembly","steel_worker"],jobMultiplier:0.85,investmentEffect:[{industry:"科技",mul:1.15}],duration:12},conduit:{targetLevel:"L2",delayRange:[2,4],chance:0.45}},
  {id:"global_influencer_tax",headline:"📸 多国联合打击网红逃税,头部主播补税金额超亿元",level:"L1",type:"policy",effects:{investmentEffect:[{industry:"消费",mul:0.88}],cashLoss:200,duration:10},conduit:{targetLevel:"L2",delayRange:[2,4],chance:0.4}},
  {id:"ocean_acidification_crisis",headline:"🌊 海洋酸化速度超预期,全球渔业产量预计下降30%",level:"L1",type:"price",effects:{priceMod:{fish:1.4,salt:1.2},jobPenalty:["restaurant_assistant","cafeteria_worker"],jobMultiplier:0.85,duration:14},conduit:{targetLevel:"L2",delayRange:[2,5],chance:0.4}},
  {id:"global_mental_health_week",headline:"🧠 WHO将心理健康纳入基本人权,多国增加心理援助投入",level:"L1",type:"social",effects:{happinessBonus:8,jobBonus:["hospital_companion","training_assistant"],jobMultiplier:1.1,duration:10},conduit:{targetLevel:"L2",delayRange:[2,4],chance:0.35}},
  {id:"fusion_energy_breakthrough",headline:"⚡ 核聚变商业化再提速,2030年首座商用堆有望发电",level:"L1",type:"investment",effects:{investmentEffect:[{industry:"新能源",mul:1.3},{symbols:["CL","NG"],mul:0.78}],duration:12},conduit:{targetLevel:"L2",delayRange:[2,4],chance:0.35}},

  // ====== L2 国内政策 ======
  {id:"startup_incubation_fund",headline:"🚀 国家创业孵化基金成立,大学生创业最高可获¥50万",level:"L2",type:"policy",effects:{cashBonus:2000,skillXp:15,jobBonus:["web_designer","content_writing"],jobMultiplier:1.15,duration:15},conduit:{targetLevel:"L3",delayRange:[1,3],chance:0.35}},
  {id:"ancient_village_protection",headline:"🏘️ 传统村落保护条例出台,1000个古村落获专项修缮资金",level:"L2",type:"policy",effects:{jobBonus:["manual_labor_construction"],jobMultiplier:1.15,duration:14},conduit:{targetLevel:"L3",delayRange:[1,3],chance:0.3}},
  {id:"civil_servant_salary_reform",headline:"📋 公务员薪酬改革:基层公务员工资上调15%,补贴透明化",level:"L2",type:"job",effects:{allJobsBonus:1.05,cashBonus:500,duration:14},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.4}},
  {id:"online_education_standard",headline:"💻 在线教育行业标准出台:AI课程须标注人工智能生成内容",level:"L2",type:"policy",effects:{jobBonus:["training_assistant","tutoring"],jobMultiplier:1.1,investmentEffect:[{industry:"科技",mul:0.92}],duration:10},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.35}},
  {id:"express_package_privacy",headline:"📦 快递面单隐私保护新规:手机号中间四位用*号代替",level:"L2",type:"policy",effects:{cashBonus:100,happinessBonus:5,duration:10},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.3}},
  {id:"community_volunteer_points",headline:"⭐ 志愿服务积分制度推行:满100分可兑换社保缴费补贴",level:"L2",type:"social",effects:{cashBonus:300,happinessBonus:8,jobBonus:["hospital_companion","cafeteria_worker"],jobMultiplier:1.1,duration:14},conduit:{targetLevel:"L3",delayRange:[1,3],chance:0.3}},
  {id:"national_reading_initiative",headline:"📚 全民阅读促进条例:社区图书馆藏书量纳入城市考核指标",level:"L2",type:"social",effects:{skillXp:10,happinessBonus:5,duration:12},conduit:{targetLevel:"L3",delayRange:[1,3],chance:0.3}},
  {id:"electric_bike_license",headline:"🛵 电动自行车新国标实施:超标车不得上路,置换补贴¥500",level:"L2",type:"policy",effects:{cashBonus:500,jobBonus:["delivery_rider","courier_gig"],jobMultiplier:0.85,duration:12},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.4}},

  // ====== L3 城市动态 ======
  {id:"creative_park_open",headline:"🎨 文创产业园开园,艺术家工作室租金首年全免",level:"L3",type:"job",effects:{jobBonus:["busking","content_writing","web_designer"],jobMultiplier:1.3,priceMod:{snacks:1.15,beer:1.2},duration:7},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.35}},
  {id:"city_charity_run",headline:"🏃 城市公益跑报名开启——每跑1公里企业捐¥10",level:"L3",type:"social",effects:{happinessBonus:10,cashBonus:100,duration:3},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.25}},
  {id:"pet_adoption_day",headline:"🐾 宠物领养日周末举行——200只流浪猫狗等待新家",level:"L3",type:"social",effects:{happinessBonus:10,cashBonus:50,duration:3},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.3}},
  {id:"city_silent_floor",headline:"🤫 地铁设静音车厢:手机外放和大声交谈将被罚款",level:"L3",type:"social",effects:{happinessBonus:5,fatigueBonus:3,duration:7},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.3}},
  {id:"outdoor_gym_renovation",headline:"💪 全市户外健身设施更新换代,智能健身器材扫码记录运动数据",level:"L3",type:"social",effects:{fatigueBonus:8,happinessBonus:5,duration:7},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.25}},
  {id:"farmers_market_relocate",headline:"🧺 早市搬迁至新建的标准化市场,商贩租金三年不变",level:"L3",type:"price",effects:{priceMod:{vegetables:0.85,fruits:0.8,pork:0.88},jobBonus:["shop_assistant","wholesale_sorting"],jobMultiplier:1.15,duration:7},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.35}},
  {id:"city_wifi_cover",headline:"📶 全市公共场所免费WiFi覆盖,公园广场车站均可连接",level:"L3",type:"social",effects:{happinessBonus:5,skillXp:5,duration:7},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.25}},
  {id:"tree_planting_day",headline:"🌳 植树节活动:市民可认领一棵树,挂在树上铭牌可写名字",level:"L3",type:"social",seasons:["spring"],effects:{happinessBonus:10,duration:2},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.25}},

  // ====== L4 街头见闻 ======
  {id:"workmate_side_hustle_success",headline:"💰 工友老刘业余做短视频——上个月赚了¥8000,比工资还高",level:"L4",type:"personal",effects:{cashBonus:100,happinessBonus:8,duration:1}},
  {id:"landlord_wifi_share",headline:"📶 房东说可以共用他的WiFi——每人每月¥30,不限速",level:"L4",type:"personal",effects:{cashLoss:30,duration:1}},
  {id:"community_barbecue_party",headline:"🍖 小区组织了烧烤晚会——每家带一道菜,啤酒免费",level:"L4",type:"personal",effects:{hungerBonus:15,happinessBonus:10,cashLoss:30,duration:1}},
  {id:"corner_lockpicker",headline:"🔑 钥匙锁屋里了——找了开锁师傅,¥80,两分钟搞定",level:"L4",type:"personal",effects:{cashLoss:80,duration:1}},
  {id:"street_hanfu_boom",headline:"👘 街上穿汉服的人越来越多了——大爷说这衣服好看",level:"L4",type:"personal",effects:{happinessBonus:3,duration:1}},
  {id:"workmate_marry_hometown",headline:"💒 工友老陈回老家相亲成功了——下个月就结婚,不回来了",level:"L4",type:"personal",effects:{happinessPenalty:5,cashLoss:200,duration:2}},
  {id:"community_vegetable_price_fall",headline:"🥬 小区团购的蔬菜比超市便宜一半——大妈们都在抢",level:"L4",type:"personal",effects:{cashBonus:30,hungerBonus:10,duration:1}},
  {id:"rainy_roof_leak_fixed",headline:"🔨 房东终于把漏水的屋顶修好了——花了三天,花了¥2000",level:"L4",type:"personal",effects:{happinessBonus:8,duration:1}},
  {id:"neighbor_new_baby",headline:"👶 隔壁生了二胎——整层楼都收到了红鸡蛋",level:"L4",type:"personal",effects:{happinessBonus:8,duration:1}},
  {id:"street_breakfast_new_shop",headline:"🥟 新开的早餐店¥3一碗粥,还送咸菜——生意好得排队",level:"L4",type:"personal",effects:{cashLoss:5,hungerBonus:8,duration:1}},
  {id:"scam_call_blocked",headline:"📞 接到诈骗电话说快递丢了——直接挂断,反手标记为诈骗",level:"L4",type:"personal",effects:{cashBonus:50,duration:1}},
  {id:"workmate_health_fear",headline:"😰 工友体检发现肺结节——吓得戒了烟,开始跑步",level:"L4",type:"personal",effects:{fatiguePenalty:5,happinessPenalty:5,duration:2}},
  {id:"winter_snow_fight",headline:"❄️ 下雪了——整条街的人都在打雪仗,外卖小哥也被砸了",level:"L4",type:"personal",seasons:["winter"],effects:{happinessBonus:10,duration:1}},
  {id:"spring_flower_photo",headline:"🌺 路边花坛开满了郁金香——阿姨们排队拍照",level:"L4",type:"personal",seasons:["spring"],effects:{happinessBonus:5,duration:1}},
  {id:"summer_aircon_repair",headline:"🔧 空调加氟¥200——师傅说今年夏天太热,加氟的活排到下周三了",level:"L4",type:"personal",seasons:["summer"],effects:{cashLoss:200,duration:1}},
`;

const idx = content.lastIndexOf("];");
content = content.slice(0, idx) + batch + "];" + content.slice(idx + 2);
fs.writeFileSync(filePath, content, "utf8");
console.log("✅ Batch 11 appended");

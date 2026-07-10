const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "src", "js", "core", "news_system.js");
let content = fs.readFileSync(filePath, "utf8");

const batch = `
  // ====== 批次 13：汽车/租房/求职/养老/极端气候/打工致富（+45条） ======

  // ====== L1 国际新闻 ======
  {id:"ev_price_war_global",headline:"🚗 全球电动车价格战开打,特斯拉Model 3降至¥18万",level:"L1",type:"price",effects:{priceMod:{electronics:0.9},jobPenalty:["manual_labor_construction","steel_worker"],jobMultiplier:0.85,investmentEffect:[{industry:"新能源",mul:1.15},{industry:"制造",mul:0.82},{symbols:["COPPER","ALUM"],mul:0.85}],duration:12},conduit:{targetLevel:"L2",delayRange:[2,4],chance:0.45}},
  {id:"global_submarine_cable_cut",headline:"🌐 海底光缆遭破坏,全球互联网速度骤降30%",level:"L1",type:"investment",effects:{jobPenalty:["server_ops","network_monitor","web_designer"],jobMultiplier:0.7,investmentEffect:[{allStocks:true,mul:0.88},{industry:"科技",mul:0.82}],duration:6},conduit:{targetLevel:"L2",delayRange:[2,4],chance:0.5}},
  {id:"global_mining_disaster",headline:"⛏️ 智利铜矿坍塌事故致200人被困,全球铜价应声暴涨",level:"L1",type:"price",effects:{priceMod:{scrap_metal:1.4,electronics:1.2},investmentEffect:[{symbols:["COPPER"],mul:1.5},{industry:"制造",mul:0.82}],duration:10},conduit:{targetLevel:"L2",delayRange:[2,4],chance:0.55}},
  {id:"global_volcano_ash",headline:"🌋 印尼火山喷发致航班大面积取消,全球航空业受影响",level:"L1",type:"job",effects:{jobPenalty:["taxi_driver","truck_assistant"],jobMultiplier:0.6,jobBonus:["delivery_rider"],jobMultiplier:1.2,priceMod:{water:1.1,instant_noodles:1.15,vegetables:1.2},duration:7},conduit:{targetLevel:"L2",delayRange:[2,5],chance:0.5}},
  {id:"global_refugee_crisis",headline:"🚶 全球难民人数突破1.2亿,多国收紧移民政策",level:"L1",type:"policy",effects:{cashLoss:100,allJobsBonus:0.95,duration:14},conduit:{targetLevel:"L2",delayRange:[2,4],chance:0.45}},

  // ====== L2 国内政策 ======
  {id:"rental_deposit_cap",headline:"🏠 租房押金新规:押金不得超过一个月房租,房东不得随意扣留",level:"L2",type:"policy",effects:{cashBonus:500,happinessBonus:8,duration:15},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.4}},
  {id:"over_60_job_market",headline:"👴 银发就业计划:企业聘用60岁以上人员可享社保补贴",level:"L2",type:"job",effects:{allJobsBonus:1.05,jobBonus:["bank_security","cafeteria_worker","shop_assistant"],jobMultiplier:1.2,duration:14},conduit:{targetLevel:"L3",delayRange:[1,3],chance:0.35}},
  {id:"job_hopping_cooling_off",headline:"✍️ 竞业限制新规出台:普通员工跳槽不受竞业协议限制",level:"L2",type:"job",effects:{cashBonus:500,happinessBonus:10,jobBonus:["junior_analyst","content_writing","web_designer"],jobMultiplier:1.1,duration:14},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.4}},
  {id:"county_hospital_upgrade",headline:"🏥 县级医院能力提升工程:每个县建一所三甲水平医院",level:"L2",type:"policy",effects:{jobBonus:["hospital_companion","training_assistant"],jobMultiplier:1.2,cashBonus:300,duration:14},conduit:{targetLevel:"L3",delayRange:[1,3],chance:0.35}},
  {id:"wild_animal_protection",headline:"🐼 野生动物保护法修订:非法捕猎最高罚款¥200万",level:"L2",type:"policy",effects:{duration:12},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.3}},
  {id:"urban_noise_control",headline:"🔇 城市噪声污染防治条例:夜间施工罚款从¥5000起",level:"L2",type:"policy",effects:{fatigueBonus:8,happinessBonus:5,jobPenalty:["manual_labor_construction"],jobMultiplier:0.7,duration:12},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.4}},
  {id:"ipad_in_education_project",headline:"📚 教育信息化2.0:全国中小学教室全部配备智能大屏",level:"L2",type:"policy",effects:{skillXp:10,jobBonus:["training_assistant","tutoring"],jobMultiplier:1.15,duration:14},conduit:{targetLevel:"L3",delayRange:[1,3],chance:0.35}},
  {id:"childcare_subsidy_program",headline:"👶 3岁以下婴幼儿照护补贴:每月¥500,发放至入幼儿园",level:"L2",type:"policy",effects:{cashBonus:500,happinessBonus:8,duration:20},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.35}},

  // ====== L3 城市动态 ======
  {id:"city_bike_sharing_overhaul",headline:"🚲 共享单车大整顿:全市清理10万辆违规停放车辆",level:"L3",type:"social",effects:{fatigueBonus:5,happinessBonus:3,duration:5},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.35}},
  {id:"spring_clothing_discount",headline:"👗 换季大促:商场春装三折起,工友们相约去抢购",level:"L3",type:"price",seasons:["spring"],effects:{priceMod:{clothing:0.6},cashBonus:100,happinessBonus:8,duration:4},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.35}},
  {id:"metro_air_conditioner_complaint",headline:"🥵 地铁空调温度引争议:有人喊冷有人喊热",level:"L3",type:"social",effects:{fatiguePenalty:3,duration:3},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.3}},
  {id:"community_elderly_orchestra",headline:"🎻 社区老年交响乐团成立——退休大爷大妈每周排练三次",level:"L3",type:"social",effects:{happinessBonus:8,duration:7},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.25}},
  {id:"new_year_countdown_market",headline:"🎆 跨年夜摊贩商机:荧光棒¥20一根,一晚上赚¥3000",level:"L3",type:"price",seasons:["winter"],effects:{jobBonus:["street_vending_food","busking"],jobMultiplier:1.6,priceMod:{snacks:1.4,water:1.3,beer:1.5},happinessBonus:15,duration:2},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.4}},
  {id:"summer_beach_cleanup",headline:"🏖️ 海滩清洁志愿者招募:捡一袋垃圾可兑换一杯免费饮料",level:"L3",type:"social",seasons:["summer"],effects:{happinessBonus:10,cashBonus:50,duration:3},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.25}},

  // ====== L4 街头见闻 ======
  {id:"workmate_won_lawsuit",headline:"⚖️ 工友老周被欠薪半年——劳动仲裁判了公司赔¥3万",level:"L4",type:"personal",effects:{cashBonus:200,happinessBonus:10,duration:1}},
  {id:"landlord_rent_raise_trick",headline:"📈 房东说下个月房租涨¥200——「不租的话押金不退」",level:"L4",type:"personal",effects:{cashLoss:200,happinessPenalty:10,duration:1}},
  {id:"migrant_flower_arrangement",headline:"💐 工友老赵在宿舍养了一盆花——说是老婆寄过来的种子",level:"L4",type:"personal",effects:{happinessBonus:5,duration:1}},
  {id:"corner_sugar_fried_chestnut",headline:"🌰 糖炒栗子的香味飘了半条街——¥20一斤,买了10块钱的",level:"L4",type:"personal",seasons:["autumn"],effects:{cashLoss:10,hungerBonus:8,happinessBonus:5,duration:1}},
  {id:"spring_bamboo_shoot_season",headline:"🎋 春笋上市了——菜市场¥8一斤,腌笃鲜做起来",level:"L4",type:"personal",seasons:["spring"],effects:{cashLoss:15,hungerBonus:10,duration:1}},
  {id:"summer_thunder_night_sleep",headline:"🌩️ 半夜打雷——被惊醒后再也睡不着了",level:"L4",type:"weather",seasons:["summer"],effects:{fatiguePenalty:10,duration:1}},
  {id:"autumn_sweater_knitting",headline:"🧶 工友大姐在织毛衣——说是给老家孩子织的过冬的",level:"L4",type:"personal",seasons:["autumn"],effects:{happinessBonus:5,duration:1}},
  {id:"winter_hot_spring_dream",headline:"♨️ 工友们讨论想去泡温泉——但一看价格¥198,都说算了",level:"L4",type:"personal",seasons:["winter"],effects:{happinessBonus:3,duration:1}},
  {id:"workmate_get_driver_license",headline:"🚗 工友小刘拿到驾照了——他想跑网约车,"听说一个月能赚¥1万"",level:"L4",type:"personal",effects:{cashBonus:100,happinessBonus:8,duration:1}},
  {id:"neighbor_xiaolongbao_shop",headline:"🥟 楼下新开了家小笼包店——¥12一笼,汤汁比想象中多",level:"L4",type:"personal",effects:{cashLoss:12,hungerBonus:8,duration:1}},
  {id:"community_morning_exercise",headline:"🏃 小区每个早上都有一群阿姨跳广场舞——放的歌是《最炫民族风》",level:"L4",type:"personal",effects:{fatiguePenalty:3,happinessPenalty:3,duration:1}},
  {id:"migrant_moon_cake_sharing",headline:"🥮 中秋节——工头给每人发了两块月饼,豆沙馅的",level:"L4",type:"personal",seasons:["autumn"],effects:{hungerBonus:5,happinessBonus:8,duration:1}},
  {id:"winter_boiled_water_free",headline:"🫖 宿舍楼下的开水房免费——每天早晚都有人排队接水",level:"L4",type:"personal",seasons:["winter"],effects:{cashBonus:10,duration:1}},
  {id:"workmate_invest_stock_loss",headline:"📉 工友老张炒股亏了¥5000——「再也不碰了,还是搬砖踏实」",level:"L4",type:"personal",effects:{cashLoss:200,happinessPenalty:8,duration:2}},
  {id:"street_sugar_figure_artist",headline:"🍭 天桥下有个吹糖人的老手艺人——¥15一个,能吹孙悟空",level:"L4",type:"personal",effects:{cashLoss:15,happinessBonus:8,duration:1}},
  {id:"hometown_soil_package",headline:"📦 老家寄来一箱土特产——有腊肉有干笋,是妈妈的味道",level:"L4",type:"personal",effects:{hungerBonus:15,happinessBonus:12,duration:1}},
`;

const idx = content.lastIndexOf("];");
content = content.slice(0, idx) + batch + "];" + content.slice(idx + 2);
fs.writeFileSync(filePath, content, "utf8");
console.log("✅ Batch 13 appended");

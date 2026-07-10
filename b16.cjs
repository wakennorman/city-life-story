const fs = require("fs"),
  p = require("path");
let f = p.join(__dirname, "src", "js", "core", "news_system.js"),
  c = fs.readFileSync(f, "utf8");
const b = `
  // ==== 批次16: 生物科技/海洋/快递/建筑/补习/生活百态(+45条) ====
  // L1
  {id:"bio_tech_dna_vaccine",headline:"🧬 mRNA通用疫苗研发成功:一针预防20种流感",level:"L1",type:"investment",effects:{investmentEffect:[{industry:"医药",mul:1.35}],jobBonus:["hospital_companion"],jobMultiplier:1.1,duration:12},conduit:{targetLevel:"L2",delayRange:[2,5],chance:0.4}},
  {id:"global_rare_earth_export",headline:"🧲 稀土出口管制升级,关键元素价格暴涨3倍",level:"L1",type:"price",effects:{priceMod:{scrap_metal:1.5,electronics:1.3},investmentEffect:[{symbols:["COPPER","ALUM"],mul:1.4},{industry:"科技",mul:0.85},{industry:"制造",mul:0.8}],duration:14},conduit:{targetLevel:"L2",delayRange:[2,4],chance:0.55}},
  {id:"global_autonomous_truck",headline:"🚛 自动驾驶卡车车队跨洲试运行成功,司机面临失业危机",level:"L1",type:"job",effects:{jobPenalty:["truck_assistant","taxi_driver"],jobMultiplier:0.5,jobBonus:["server_ops","network_monitor"],jobMultiplier:1.2,investmentEffect:[{industry:"科技",mul:1.25}],duration:12},conduit:{targetLevel:"L2",delayRange:[2,4],chance:0.5}},
  {id:"global_el_nino_warning",headline:"🌊 厄尔尼诺强势回归,多国面临极端天气考验",level:"L1",type:"weather",effects:{priceMod:{rice:1.2,vegetables:1.25,fruits:1.3},jobPenalty:["manual_labor_construction","delivery_rider"],jobMultiplier:0.7,duration:14},conduit:{targetLevel:"L2",delayRange:[2,5],chance:0.5}},
  {id:"global_anti_drone_system",headline:"🛸 无人机黑飞事件激增,反无人机系统市场爆发",level:"L1",type:"investment",effects:{investmentEffect:[{industry:"科技",mul:1.15},{symbols:["BABA","HUAW"],mul:1.1}],duration:8},conduit:{targetLevel:"L2",delayRange:[2,4],chance:0.35}},

  // L2
  {id:"express_delivery_peak_fee",headline:"📮 快递末端服务收费新规:二次投递可收取¥2服务费",level:"L2",type:"job",effects:{jobBonus:["delivery_rider","courier_gig"],jobMultiplier:1.15,cashLoss:50,duration:10},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.4}},
  {id:"construction_safety_helmet",headline:"⛑️ 建筑工地安全新规:不戴智能安全帽禁止进入施工现场",level:"L2",type:"policy",effects:{jobBonus:["manual_labor_construction","premium_engineering"],jobMultiplier:1.1,cashLoss:100,duration:14},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.4}},
  {id:"after_school_care_support",headline:"🏫 课后托管服务全覆盖:双职工家庭每月可获¥500补贴",level:"L2",type:"policy",effects:{cashBonus:500,happinessBonus:8,duration:15},conduit:{targetLevel:"L3",delayRange:[1,3],chance:0.35}},
  {id:"river_chief_system_reward",headline:"🏞️ 河长制奖励机制:举报排污最高奖励¥10万",level:"L2",type:"policy",effects:{cashBonus:200,duration:12},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.3}},
  {id:"rural_wifi_speed_up",headline:"📶 农村宽带提速降费:100M宽带降至¥30/月",level:"L2",type:"policy",effects:{cashBonus:100,skillXp:5,happinessBonus:5,duration:14},conduit:{targetLevel:"L3",delayRange:[1,3],chance:0.3}},
  {id:"food_delivery_rider_rank",headline:"🏅 外卖骑手星级评定:五星骑手优先派单,收入提升20%",level:"L2",type:"job",effects:{jobBonus:["delivery_rider","courier_gig"],jobMultiplier:1.2,duration:12},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.4}},
  {id:"plastic_bag_charge_hike",headline:"🛍️ 塑料袋收费提至¥1/个,可降解塑料袋全面推广",level:"L2",type:"price",effects:{priceMod:{daily_use:1.05},duration:12},conduit:{targetLevel:"L3",delayRange:[1,2],chance:0.35}},

  // L3
  {id:"city_swimming_pool_summer",headline:"🏊 游泳馆夏日爆满——¥25一次,下饺子一样",level:"L3",type:"price",seasons:["summer"],effects:{priceMod:{water:1.05,beer:1.1},happinessBonus:8,duration:4},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.35}},
  {id:"winter_noodle_soup",headline:"🍜 冬至全城吃饺子——饺子馆排队一小时起",level:"L3",type:"price",seasons:["winter"],effects:{priceMod:{pork:1.2,flour:1.15},jobBonus:["restaurant_assistant"],jobMultiplier:1.4,happinessBonus:10,duration:2},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.35}},
  {id:"spring_outing_bbq",headline:"🔥 春游烧烤季——公园烧烤区一座难求,提前三天预约",level:"L3",type:"price",seasons:["spring"],effects:{priceMod:{pork:1.15,beer:1.2,vegetables:1.1},jobBonus:["street_vending_food","shop_assistant"],jobMultiplier:1.25,happinessBonus:10,duration:4},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.35}},
  {id:"autumn_grape_picking",headline:"🍇 葡萄采摘园开园——¥30一斤,自己摘的特别甜",level:"L3",type:"price",seasons:["autumn"],effects:{priceMod:{fruits:0.9,snacks:1.1},jobBonus:["shop_assistant","restaurant_assistant"],jobMultiplier:1.2,happinessBonus:10,duration:4},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.35}},
  {id:"city_garbage_truck_music",headline:"🎵 垃圾车音乐换了——从《兰花草》改成《生日快乐》",level:"L3",type:"social",effects:{happinessBonus:3,duration:3},conduit:{targetLevel:"L4",delayRange:[1,2],chance:0.25}},

  // L4
  {id:"migrant_family_video",headline:"📹 工友跟老婆孩子视频——孩子说爸爸你什么时候回来",level:"L4",type:"personal",effects:{happinessBonus:5,happinessPenalty:5,duration:1}},
  {id:"workmate_itchy_food",headline:"🥜 工友吃了花生过敏——脸肿了一圈,去了急诊",level:"L4",type:"personal",effects:{cashLoss:200,fatiguePenalty:10,duration:2}},
  {id:"landlord_winter_heater_break",headline:"🔧 暖气片漏水了——房东说明天找人修,今晚先凑合",level:"L4",type:"personal",seasons:["winter"],effects:{fatiguePenalty:10,duration:1}},
  {id:"spring_rain_umbrella_break",headline:"☂️ 大风把伞吹翻了——修伞比买一把还贵,扔了",level:"L4",type:"weather",seasons:["spring"],effects:{cashLoss:30,duration:1}},
  {id:"summer_cicada_noise",headline:"🦗 蝉叫了一整夜——戴着耳机睡着的",level:"L4",type:"weather",seasons:["summer"],effects:{fatiguePenalty:5,happinessPenalty:3,duration:1}},
  {id:"autumn_lantern_riddle",headline:"🏮 小区中秋猜灯谜——答对送月饼,老王答对了8题",level:"L4",type:"personal",seasons:["autumn"],effects:{hungerBonus:5,happinessBonus:8,duration:1}},
  {id:"winter_dumpling_party",headline:"🥟 冬至包饺子——大家一起动手,有人包的像包子",level:"L4",type:"personal",seasons:["winter"],effects:{hungerBonus:15,happinessBonus:10,cashLoss:20,duration:1}},
  {id:"migrant_toolbox_gift",headline:"🧰 工头给每人发了套新工具——说是老板发的福利",level:"L4",type:"personal",effects:{cashBonus:100,happinessBonus:8,duration:1}},
  {id:"street_fruit_peel_art",headline:"🍊 水果摊老板刀工一流——雕的西瓜花像真的一样",level:"L4",type:"personal",effects:{happinessBonus:5,duration:1}},
  {id:"workmate_drunk_call",headline:"📞 工友喝醉了给老家的妈妈打电话——说想家了",level:"L4",type:"personal",effects:{happinessPenalty:5,happinessBonus:5,duration:1}},
  {id:"community_mosquito_net",headline:"🦟 夏天蚊子太多——大家合伙买了蚊帐,每人¥15",level:"L4",type:"personal",seasons:["summer"],effects:{cashLoss:15,fatigueBonus:8,duration:1}},
  {id:"migrant_watch_repair",headline:"⌚ 工友的手表停了——找了个修表摊,¥30换了个电池",level:"L4",type:"personal",effects:{cashLoss:30,duration:1}},
  {id:"street_old_photo_restore",headline:"🖼️ 路边有人帮修复老照片——¥50一张,工友把爸妈结婚照修了",level:"L4",type:"personal",effects:{cashLoss:50,happinessBonus:10,duration:1}},
  {id:"workmate_sleep_talking",headline:"💤 室友说梦话——喊了一晚上\"快点,要迟到了\"",level:"L4",type:"personal",effects:{happinessPenalty:3,duration:1}},
  {id:"spring_outing_photo",headline:"📸 春游拍了张合影——20个人挤在镜头里,有人只露了半张脸",level:"L4",type:"personal",seasons:["spring"],effects:{happinessBonus:8,duration:1}},
`;

let idx = c.lastIndexOf("];");
c = c.slice(0, idx) + b + "];" + c.slice(idx + 2);
fs.writeFileSync(f, c, "utf8");
console.log("OK b16");

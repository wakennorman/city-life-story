/**
 * 节日系统 — 中国传统节日价格波动与氛围效果
 *
 * 参考 Stardew Valley 节日设计：每个节日改变经济环境，
 * 创造"下个季节我要提前备货"的策略期待感。
 *
 * 节日日历（以 day % 365 计算年内日期）：
 *   春节   day 20-27  (8天)  食品/奢侈品涨价，心情大涨
 *   劳动节 day 120-122 (3天) 电子/服装打折促销
 *   端午节 day 162-164 (3天) 食品略涨，粽子飘香
 *   中秋节 day 256-258 (3天) 食品/礼品涨价，心情大涨
 *   国庆节 day 273-280 (8天) 电子/服装促销，出行高峰
 */

var FESTIVALS = [
  {
    id: "spring_festival",
    name: "春节",
    icon: "🧨",
    startDay: 20,
    duration: 8,
    desc: "阖家团圆，年味十足。年货、食品价格普遍上涨。",
    priceMods: { food: 1.25, luxury: 1.35, daily: 1.15 },
    moodBonus: 8,
    announceTxt:
      "🧨 春节到了！大街挂满红灯笼，鞭炮声此起彼伏。年货、食品价格上涨，但年味十足！提前囤点年货吧。",
  },
  {
    id: "labor_day",
    name: "劳动节",
    icon: "🔨",
    startDay: 120,
    duration: 3,
    desc: "劳动人民的节日，商场促销，人流量大增。",
    priceMods: { electronics: 0.88, clothing: 0.85 },
    moodBonus: 3,
    announceTxt:
      "🔨 劳动节到了！向辛勤劳动的自己致敬。商场促销，电子产品和衣服打折，是补货的好时机。",
  },
  {
    id: "dragon_boat",
    name: "端午节",
    icon: "🐉",
    startDay: 162,
    duration: 3,
    desc: "粽子飘香，龙舟竞渡。食品价格略涨。",
    priceMods: { food: 1.2, daily: 1.05 },
    moodBonus: 5,
    announceTxt:
      "🐉 端午节到了！街头粽子飘香，食品价格略涨。买两包粽子慰劳一下自己！",
  },
  {
    id: "mid_autumn",
    name: "中秋节",
    icon: "🥮",
    startDay: 256,
    duration: 3,
    desc: "月圆人团圆，走亲访友送礼高峰。",
    priceMods: { food: 1.3, luxury: 1.25, daily: 1.1 },
    moodBonus: 8,
    announceTxt:
      "🥮 中秋节到了！月饼香气弥漫街道，食品和奢侈品价格上涨。给王阿姨他们送个月饼，好感+大！",
  },
  {
    id: "national_day",
    name: "国庆节",
    icon: "🎉",
    startDay: 273,
    duration: 8,
    desc: "举国欢庆黄金周，购物旅游双高峰。",
    priceMods: { electronics: 0.88, clothing: 0.85, daily: 1.1 },
    moodBonus: 5,
    announceTxt:
      "🎉 国庆黄金周！全国欢庆，商场大促。电子产品和服装打折，但食品因人流量稍涨。",
  },
];

/** 根据游戏天数获取当前节日（无则返回null） */
function getCurrentFestival(day) {
  var doy = day % 365;
  for (var i = 0; i < FESTIVALS.length; i++) {
    var f = FESTIVALS[i];
    if (doy >= f.startDay && doy < f.startDay + f.duration) return f;
  }
  return null;
}

/** 获取节日对某商品分类的价格修正乘数（无节日=1.0） */
function getFestivalPriceMod(state, category) {
  var f = getCurrentFestival(state.player.day);
  if (!f || !f.priceMods || !f.priceMods[category]) return 1.0;
  return f.priceMods[category];
}

/** 节日分类中文名 */
function getFestivalCategoryName(cat) {
  var names = {
    food: "食品",
    daily: "日用品",
    luxury: "奢侈品",
    electronics: "电子",
    clothing: "服装",
    scrap: "废品",
  };
  return names[cat] || cat;
}

/**
 * 每日节日效果结算 — 加入 DAILY_PIPELINE
 * 节日第一天发布公告；节日期间每日心情加成
 */
function checkFestivalDailyEffects(state) {
  var f = getCurrentFestival(state.player.day);
  if (!f) return;

  var doy = state.player.day % 365;
  var year = Math.floor(state.player.day / 365);

  // 节日第一天公告（每年触发一次）
  if (doy === f.startDay) {
    var flagKey = "_festAnno_" + f.id + "_y" + year;
    if (!state.flags[flagKey]) {
      state.flags[flagKey] = true;
      StateManager.addMessage(f.announceTxt, "event");
    }
  }

  // 节日期间每日心情加成（最多+8）
  if (f.moodBonus > 0) {
    state.needs.happiness = Math.min(
      100,
      (state.needs.happiness || 50) + f.moodBonus,
    );
  }
}

/**
 * 节日中秋/春节送礼NPC好感加成
 * 在 showGiftModal 中调用 — 节日期间送礼额外+10好感
 */
function getFestivalGiftBonus() {
  var state = StateManager.getState();
  var f = getCurrentFestival(state.player.day);
  if (!f) return 0;
  if (f.id === "spring_festival" || f.id === "mid_autumn") return 10;
  if (f.id === "dragon_boat" || f.id === "national_day") return 5;
  return 0;
}

/** 获取节日价格修正说明文本（用于交易界面提示） */
function getFestivalPriceNote(state) {
  var f = getCurrentFestival(state.player.day);
  if (!f || !f.priceMods) return "";
  var doy = state.player.day % 365;
  var daysLeft = f.startDay + f.duration - doy;
  var parts = [];
  Object.keys(f.priceMods).forEach(function (cat) {
    var mod = f.priceMods[cat];
    var pct = Math.round((mod - 1) * 100);
    parts.push(getFestivalCategoryName(cat) + (pct > 0 ? "+" : "") + pct + "%");
  });
  return (
    f.icon + " " + f.name + "（还剩" + daysLeft + "天）：" + parts.join("，")
  );
}

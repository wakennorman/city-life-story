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
  {
    id: "shopping_festival",
    name: "全民剁手节",
    icon: "🛒",
    startDay: 315,
    duration: 2,
    desc: "电商年度最大促销，零售品需求暴增，商业区人流爆炸，摆摊收益翻倍。",
    priceMods: {
      daily: 2.0,
      clothing: 1.9,
      electronics: 1.85,
      food: 1.15,
      luxury: 1.5,
    },
    moodBonus: 6,
    announceTxt:
      "🛒 全民剁手节开始！商业区人山人海，日用品/服装/电子需求暴涨——这是今年摆摊最赚的两天！准备好货了吗？",
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

/** 判断是否处于剁手节余震清仓期（节日结束后3天） */
function isShoppingClearancePeriod(state) {
  return !!(
    state.flags._shoppingClearanceEndDay &&
    state.player.day <= state.flags._shoppingClearanceEndDay
  );
}

/** 获取节日对某商品分类的价格修正乘数（无节日=1.0，清仓期低于1.0） */
function getFestivalPriceMod(state, category) {
  var f = getCurrentFestival(state.player.day);
  if (f && f.priceMods && f.priceMods[category]) return f.priceMods[category];
  // 剁手节余震清仓期：日用品/服装/电子便宜15-25%（买货好时机）
  if (isShoppingClearancePeriod(state)) {
    var clearMods = { daily: 0.82, clothing: 0.78, electronics: 0.8 };
    if (clearMods[category]) return clearMods[category];
  }
  return 1.0;
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
 * 节日第一天发布公告；节日期间每日心情加成；
 * 剁手节额外：3天预热公告 + 节日结束后清仓期
 */
function checkFestivalDailyEffects(state) {
  var doy = state.player.day % 365;
  var year = Math.floor(state.player.day / 365);

  // === 剁手节专项：3天预热 + 余震清仓 ===
  var shoppingFest = null;
  for (var si = 0; si < FESTIVALS.length; si++) {
    if (FESTIVALS[si].id === "shopping_festival") {
      shoppingFest = FESTIVALS[si];
      break;
    }
  }
  if (shoppingFest) {
    var daysToFest = shoppingFest.startDay - doy;
    // 预热公告（3天前）
    if (daysToFest === 3) {
      var preKey = "_shopFestPre_y" + year;
      if (!state.flags[preKey]) {
        state.flags[preKey] = true;
        StateManager.addMessage(
          "📦【预热提醒】全民剁手节还有3天！现在去批发市场囤好日用品/服装，节日当天商业区摆摊收益可翻倍！早买早赚。",
          "hint",
        );
      }
    }
    // 节日结束第1天：开启余震清仓期3天
    if (doy === shoppingFest.startDay + shoppingFest.duration) {
      var clearKey = "_shopFestClear_y" + year;
      if (!state.flags[clearKey]) {
        state.flags[clearKey] = true;
        state.flags._shoppingClearanceEndDay = state.player.day + 3;
        StateManager.addMessage(
          "📉【剁手节余波】消费者买完了，日用品/服装/电子降价15-20%清仓中（还有3天），是囤货低吸的好时机！",
          "info",
        );
      }
    }
  }

  // === 普通节日效果 ===
  var f = getCurrentFestival(state.player.day);
  if (!f) return;

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

/** 获取当前季节 */
function getCurrentSeason(day) {
  var doy = ((day - 1) % 365) + 1;
  if (doy >= 60 && doy <= 151)
    return { id: "spring", name: "春季", icon: "🌸" };
  if (doy >= 152 && doy <= 243)
    return { id: "summer", name: "夏季", icon: "☀️" };
  if (doy >= 244 && doy <= 334)
    return { id: "autumn", name: "秋季", icon: "🍂" };
  return { id: "winter", name: "冬季", icon: "❄️" };
}

/**
 * 节日限定临时工作（节日期间在对应地点出现）
 * pay: 基础收入（每次行动）, apCost: 行动点消耗, intReq: 智力门槛
 */
var FESTIVAL_JOBS = {
  spring_festival: [
    {
      id: "fest_spring_promo",
      name: "年货节推广员",
      icon: "🧨",
      location: "commercialDist",
      pay: 100,
      apCost: 20,
      desc: "过年人流旺，帮年货店招揽顾客，节日加价！",
    },
  ],
  labor_day: [
    {
      id: "fest_labor_promo",
      name: "劳动节促销员",
      icon: "🔨",
      location: "commercialDist",
      pay: 80,
      apCost: 20,
      desc: "商场劳动节大促，协助发传单摆摊台",
    },
  ],
  dragon_boat: [
    {
      id: "fest_zongzi_deliver",
      name: "粽子配送员",
      icon: "🐉",
      location: "slum",
      pay: 70,
      apCost: 15,
      desc: "端午粽子销量大增，帮忙骑车配送",
    },
  ],
  mid_autumn: [
    {
      id: "fest_mooncake_deliver",
      name: "月饼礼盒配送",
      icon: "🥮",
      location: "commercialDist",
      pay: 90,
      apCost: 20,
      desc: "中秋月饼礼盒配送旺季，件数多奖金高",
    },
  ],
  national_day: [
    {
      id: "fest_guide",
      name: "景区导游志愿者",
      icon: "🎉",
      location: "park",
      pay: 120,
      apCost: 25,
      intReq: 20,
      desc: "黄金周游客多，兼职景区向导，需要一定的智力",
    },
  ],
  shopping_festival: [
    {
      id: "fest_shopping_vendor",
      name: "🛒 剁手节爆款摊位",
      icon: "🛒",
      location: "commercialDist",
      pay: 280,
      apCost: 25,
      desc: "剁手节商业区人流爆炸！摆摊卖热销品，收益是平时的5倍！",
    },
    {
      id: "fest_shopping_warehouse",
      name: "📦 节日仓库搬运",
      icon: "📦",
      location: "wholesaleMarket",
      pay: 160,
      apCost: 20,
      desc: "双节备货旺季，批发仓库搬运需求激增，轻松赚体力钱",
    },
  ],
};

/** 获取节日NPC专属台词（返回字符串或null） */
function getFestivalNpcLine(npcId, state) {
  var f = getCurrentFestival(state.player.day);
  if (!f) return null;
  if (typeof NPCS === "undefined") return null;
  for (var i = 0; i < NPCS.length; i++) {
    var npc = NPCS[i];
    if (npc.id !== npcId) continue;
    if (!npc.festivalLines) return null;
    var line = npc.festivalLines[f.id];
    return line || null;
  }
  return null;
}

/** 获取节日价格修正说明文本（用于交易界面提示） */
function getFestivalPriceNote(state) {
  // 余震清仓期提示
  if (isShoppingClearancePeriod(state)) {
    var daysLeft2 = state.flags._shoppingClearanceEndDay - state.player.day;
    return (
      "📉 剁手节清仓（还剩" +
      daysLeft2 +
      "天）：日用品-18%, 服装-22%, 电子-20%（进货好时机）"
    );
  }
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

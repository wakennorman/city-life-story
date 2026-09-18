/**
 * 约定式行动数据源（v3.99d CoC P1-4）
 *
 * 声明式行动定义：新增地点特色行动只需在 LOCATION_EXTRA_ACTIONS 添加一条数据，
 * 系统自动发现并接入行动列表，无需修改 addExtraActions 或任何渲染代码。
 */
var LOCATION_EXTRA_ACTIONS = [
  {
    id: "scrapyard_picking",
    name: "废品站淘货",
    desc: "在工地附近的废品站翻找，运气好能发现值钱物件。了解行情的人更容易捡到宝。",
    icon: "🔩",
    location: "construction",
    apCost: 20,
    condition: function (st) {
      return st.skills && st.skills.repair && st.skills.repair.level >= 30;
    },
    payEstimate: "50~300",
    handler: function (st) {
      var cost = 50;
      if ((st.resources.cash || 0) < cost) {
        StateManager.addMessage("💸 现金不够付¥50入场费。", "warning");
        return;
      }
      st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
      var findValue =
        Random.int(0, 100) + (st.skills.repair ? st.skills.repair.level : 0);
      var earn = 0;
      if (findValue > 120) earn = 250 + Random.int(0, 100);
      else if (findValue > 80) earn = 100 + Random.int(0, 80);
      else earn = 20 + Random.int(0, 30);
      st.resources.cash = (st.resources.cash || 0) + earn;
      StateManager.addMessage(
        "🔩 你在废品站翻了半天，" +
          (earn > 100
            ? "找到一件有价值的旧零件，卖了¥" + earn
            : "就找到些破铜烂铁，卖了¥" + earn),
        earn > 100 ? "success" : "info",
      );
    },
  },
  {
    id: "factory_parttime",
    name: "工厂兼职",
    desc: "在工业区的工厂做临时工，体力活但收入稳定。需要一定的体力基础。",
    icon: "🏭",
    location: "factoryZone",
    apCost: 25,
    condition: function (st) {
      return st.player.physique >= 40;
    },
    payEstimate: "80~120",
    handler: function (st) {
      var earn = 80 + Random.int(0, 40);
      st.resources.cash = (st.resources.cash || 0) + earn;
      st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
      StateManager.addMessage(
        "🏭 你在工厂干了一天体力活，赚了¥" +
          earn.toLocaleString() +
          "。累得腰酸背痛。",
        "info",
      );
    },
  },
  {
    id: "night_school_study",
    name: "夜校自习",
    desc: "在大学城找个自习室学习，效率比在住处高得多。需要交电费。",
    icon: "📚",
    location: "school",
    apCost: 25,
    condition: function (st) {
      return (st.resources.cash || 0) >= 10;
    },
    costEstimate: 10,
    effectEstimate: "技能XP+19",
    handler: function (st) {
      st.resources.cash = Math.max(0, (st.resources.cash || 0) - 10);
      if (st.skills) {
        for (var sk in st.skills) {
          if (st.skills[sk] && st.skills[sk].xp !== undefined) {
            st.skills[sk].xp += Math.round(15 * 1.3);
            break;
          }
        }
      }
      StateManager.addMessage(
        "📚 你在自习室学到很晚。虽然花了¥10电费，但学习效率比平时高出不少。",
        "info",
      );
    },
  },
  {
    id: "flyer_distribution",
    name: "商业区发传单",
    desc: "在商业区帮商家发传单，收入稳定但枯燥。",
    icon: "📄",
    location: "commercialDist",
    apCost: 20,
    condition: function (st) {
      return true;
    },
    payEstimate: "60~80",
    effectEstimate: "心情-10",
    handler: function (st) {
      var earn = 60 + Random.int(0, 20);
      st.resources.cash = (st.resources.cash || 0) + earn;
      st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
      StateManager.addMessage(
        "📄 你发了一天的传单，赚了¥" +
          earn.toLocaleString() +
          "。手都酸了，但看着商家满意的脸色，还算值得。",
        "info",
      );
    },
  },
  {
    id: "techpark_networking",
    name: "科技园找机会",
    desc: "在科技园里观察和接触创业公司的人，可能找到工作或创业机会。需要脑子灵活。",
    icon: "💡",
    location: "techPark",
    apCost: 20,
    condition: function (st) {
      return st.player.intelligence >= 60;
    },
    payEstimate: "0~∞",
    effectEstimate: "25%工作机会, 40%小费¥50",
    handler: function (st) {
      if (Random.chance(0.25)) {
        st.flags._techParkLead = true;
        StateManager.addMessage(
          "💡 你和一位创业者聊得很投机，他给了你一张名片：'有兴趣来我们公司聊聊！'",
          "success",
        );
      } else if (Random.chance(0.4)) {
        st.resources.cash = (st.resources.cash || 0) + 50;
        StateManager.addMessage(
          "💡 你帮一个创业团队跑腿买了咖啡和午饭，赚了¥50小费。",
          "info",
        );
      } else {
        StateManager.addMessage(
          "💡 你在科技园逛了一圈，被保安问了几次话，收获不大。",
          "info",
        );
      }
    },
  },
  {
    id: "hospital_donate",
    name: "医院献血",
    desc: "去医院献血，既能帮助他人又能赚营养补贴。要求身体健康。",
    icon: "🩸",
    location: "hospital",
    apCost: 15,
    condition: function (st) {
      return st.status && st.status.health >= 60;
    },
    payEstimate: "200",
    effectEstimate: "健康+10, 疲劳+5",
    handler: function (st) {
      st.resources.cash = (st.resources.cash || 0) + 200;
      st.status.health = Math.min(100, (st.status.health || 80) + 10);
      st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
      StateManager.addMessage(
        "🩸 你献了400ml全血，护士给你发了营养补贴¥200。虽然有点头晕，但心里暖暖的。",
        "success",
      );
    },
  },
  {
    id: "park_exercise",
    name: "公园晨练",
    desc: "在公园晨练，免费又健康，还能放松身心。",
    icon: "🏃",
    location: "park",
    apCost: 15,
    condition: function (st) {
      return true;
    },
    payEstimate: "0",
    effectEstimate: "体质+3, 疲劳-10",
    handler: function (st) {
      st.player.physique = Math.min(100, (st.player.physique || 50) + 3);
      st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
      StateManager.addMessage(
        "🏃 你在公园跑了三圈，打了套太极拳。浑身舒畅，精神焕发。",
        "success",
      );
    },
  },
  {
    id: "library_study",
    name: "图书馆啃书",
    desc: "在培训中心的图书馆看书，各种技能书都有，对提升技能很有帮助。只需交茶水费。",
    icon: "📖",
    location: "trainingCenter",
    apCost: 20,
    condition: function (st) {
      return (st.resources.cash || 0) >= 5;
    },
    costEstimate: 5,
    effectEstimate: "技能XP+9~20",
    handler: function (st) {
      st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5);
      var xpGain = Math.round(Random.int(8, 18) * 1.15);
      if (st.skills) {
        for (var sk in st.skills) {
          if (st.skills[sk] && st.skills[sk].xp !== undefined) {
            st.skills[sk].xp += xpGain;
            break;
          }
        }
      }
      StateManager.addMessage(
        "📖 你泡了一天的图书馆。交了¥5茶位费，收获不小，技能经验提升了。",
        "info",
      );
    },
  },
  {
    id: "temple_meditate_extra",
    name: "寺庙静心",
    desc: "在寺庙里打坐冥想，净化心灵。烧点香火，求个心安。",
    icon: "🧘",
    location: "temple",
    apCost: 15,
    condition: function (st) {
      return (st.resources.cash || 0) >= 10;
    },
    costEstimate: 10,
    effectEstimate: "心情+20, 道德+1",
    handler: function (st) {
      st.resources.cash = Math.max(0, (st.resources.cash || 0) - 10);
      st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
      if (st.player.morality !== undefined) {
        st.player.morality = Math.max(
          -100,
          Math.min(100, st.player.morality + 1),
        );
      }
      StateManager.addMessage(
        "🧘 你在寺庙里打坐了一个小时。听着钟声，心静了下来，感觉整个人都轻松了。",
        "success",
      );
    },
  },
  {
    id: "wholesale_flip",
    name: "批发市场倒货",
    desc: "在批发市场寻找低价商品，就地转卖给其他摊位。需要口才和眼力。",
    icon: "🔄",
    location: "wholesaleMarket",
    apCost: 20,
    condition: function (st) {
      return st.skills && st.skills.social && st.skills.social.level >= 20;
    },
    payEstimate: "100~300",
    effectEstimate: "社交XP+5",
    handler: function (st) {
      var earn = 100 + Random.int(0, 200);
      st.resources.cash = (st.resources.cash || 0) + earn;
      if (st.skills && st.skills.social) {
        st.skills.social.xp = (st.skills.social.xp || 0) + 5;
      }
      StateManager.addMessage(
        "🔄 你在批发市场倒腾了一批小商品，赚了¥" +
          earn.toLocaleString() +
          "。嘴皮子功夫又见长了。",
        "success",
      );
    },
  },
  // ============================================================
  // 2026-09-18 补：把 6 个"零行动"地点的玩法补上
  //
  // 背景：suburb / gov_office / court / job_market / flea_market 五个地点
  // 在 jobs.js、amenities.js、actions_extra.js、illegal_actions.js 里全都是空的，
  // vegetable_market 只有买卖没有行动 —— 结果是：3D 走进去只有「四处看看」，
  // 2D 切过去只有购物。玩家看到的是"这个地方没用"。
  //
  // 为什么加在这里而不是各写一个 add*Action：
  //   LOCATION_EXTRA_ACTIONS 是全项目唯一的**声明式地点行动表**，
  //   加一条数据就会被 addLocationExtraActions 自动发现，
  //   并被 scripts/extract-3d-data.mjs 自动抽进 gamedata → 3D 热点也自动出现。
  //   不需要改任何函数、任何渲染代码、任何 3D 代码 —— 一处定义，两端可达。
  // ============================================================
  {
    id: "gov_benefits_apply",
    name: "申请低保",
    desc: "在政务服务窗口咨询并申请最低生活保障。收入越低越容易通过，是走投无路时的最后一道网。",
    icon: "🏛️",
    location: "gov_office",
    apCost: 15,
    condition: function (st) {
      // 低保设定：现金见底 + 不是富裕阶层；已领过当日冷却
      var day = st.player.day || 0;
      var lastDay = st.flags._benefitsApplyDay;
      return (
        (st.resources.cash || 0) < 500 &&
        (st.flags._benefitsApproved !== true) &&
        (lastDay === undefined || day - lastDay >= 7)
      );
    },
    payEstimate: "0~800",
    effectEstimate: "心气-5",
    handler: function (st) {
      st.flags._benefitsApplyDay = st.player.day || 0;
      // 收入越低成功率越高；有过正经工作记录会降低通过率（审核更严）
      var cash = st.resources.cash || 0;
      var base = cash < 100 ? 0.7 : cash < 300 ? 0.5 : 0.25;
      if (st.flags._hadFormalJob) base -= 0.15;
      var ok = Random.chance(Math.max(0.1, base));
      if (ok) {
        var amount = 300 + Random.int(0, 500);
        st.resources.cash = cash + amount;
        st.flags._benefitsApproved = true;
        if (typeof addDailyTransaction === "function") {
          addDailyTransaction(st, "income", "welfare", amount, "低保补助");
        }
        // 低保是"体面受损"的钱：拿到手的那一刻心气会掉
        st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
        StateManager.addMessage(
          "🏛️ 社区把你纳入了低保名单。领到¥" +
            amount.toLocaleString() +
            "，够撑一阵子。走出大厅时你没敢抬头——但至少今晚不用饿着。",
          "success",
        );
      } else {
        StateManager.addMessage(
          "🏛️ 窗口工作人员翻了翻你的材料：「你还有劳动能力，先自己想办法吧。」申请没通过。",
          "warning",
        );
      }
    },
  },
  {
    id: "court_labor_arbitration",
    name: "申请劳动仲裁",
    desc: "被拖欠工资、违法辞退时，到法院立案窗口申请劳动仲裁。免费、不用律师也能办，但要等结果。",
    icon: "⚖️",
    location: "court",
    apCost: 20,
    condition: function (st) {
      var day = st.player.day || 0;
      // 有欠薪记录才能立案；一次仲裁结果出来后要等 30 天才能再申请
      var owed = st.flags._wageOwed || 0;
      var lastDay = st.flags._arbitrationDay;
      return (
        owed > 0 &&
        (lastDay === undefined || day - lastDay >= 30)
      );
    },
    payEstimate: "0~3000",
    effectEstimate: "心气+3",
    handler: function (st) {
      st.flags._arbitrationDay = st.player.day || 0;
      var owed = st.flags._wageOwed || 0;
      // 证据充分度：有劳动合同/工资条/同事证明则胜率高
      var evidence = 0;
      if (st.flags._hasContract) evidence += 0.3;
      if (st.flags._hasColleagueWitness) evidence += 0.25;
      if (st.player.intelligence >= 60) evidence += 0.15;
      var winRate = Math.min(0.9, 0.35 + evidence);
      if (Random.chance(winRate)) {
        // 胜诉：追回一部分欠薪（仲裁通常不会全额支持）
        var recovered = Math.floor(owed * (0.6 + Random.float(0, 0.3)));
        st.resources.cash = (st.resources.cash || 0) + recovered;
        st.flags._wageOwed = Math.max(0, owed - recovered);
        if (typeof addDailyTransaction === "function") {
          addDailyTransaction(st, "income", "legal", recovered, "劳动仲裁追回欠薪");
        }
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
        StateManager.addMessage(
          "⚖️ 仲裁庭支持了你的主张。虽然只追回¥" +
            recovered.toLocaleString() +
            "，但白纸黑字的那份裁决书，比钱更让人踏实。",
          "success",
        );
      } else {
        // 败诉：不是白忙，留下"维权经历"——后续同类案件胜率上升
        st.flags._arbitrationExperience = (st.flags._arbitrationExperience || 0) + 1;
        StateManager.addMessage(
          "⚖️ 因为证据不足，仲裁请求被驳回了。工作人员说：「下次记得留工资条。」你把这句记在了心里。",
          "warning",
        );
      }
    },
  },
  {
    id: "job_market_resume",
    name: "投简历",
    desc: "在人才市场的招聘信息栏前，把简历投给还在招人的摊位。比打零工体面，但要等回音。",
    icon: "📄",
    location: "job_market",
    apCost: 10,
    condition: function (st) {
      var day = st.player.day || 0;
      var lastDay = st.flags._resumeDay;
      return lastDay === undefined || day - lastDay >= 3;
    },
    effectEstimate: "职业机会",
    handler: function (st) {
      st.flags._resumeDay = st.player.day || 0;
      // 学历/技能/证书决定回音率
      var score = 0;
      var edu = (st.player.education || "").toString();
      if (/本科|硕士|博士|大学|大专/.test(edu)) score += 0.2;
      if (st.player.intelligence >= 55) score += 0.15;
      if (st.player.charm >= 55) score += 0.15;
      if (st.skills) {
        for (var k in st.skills) {
          if (st.skills[k] && (st.skills[k].level || 0) >= 40) { score += 0.1; break; }
        }
      }
      if (st.flags._hasCertificate) score += 0.15;
      var got = Random.chance(Math.min(0.85, 0.15 + score));
      if (got) {
        st.flags._jobMarketLead = true;
        st.flags._jobMarketLeadDay = st.player.day || 0;
        StateManager.addMessage(
          "📄 一家公司的 HR 收下了你的简历，让你「回去等通知」。这句客气话多半是客套——但这次他说得比别人认真。",
          "success",
        );
      } else {
        StateManager.addMessage(
          "📄 你投了七八份简历。对方翻了两眼就问：「有什么证？」你说没有。简历被压在了一摞纸的最下面。",
          "info",
        );
      }
    },
  },
  {
    id: "flea_market_haggle",
    name: "淘货砍价",
    desc: "在二手市场的地摊之间转悠，凭眼力捡漏、凭嘴皮子砍价。看走眼就亏，看准了就赚。",
    icon: "🏴",
    location: "flea_market",
    apCost: 15,
    condition: function (st) {
      return (st.resources.cash || 0) >= 30;
    },
    costEstimate: 30,
    payEstimate: "0~420",
    effectEstimate: "修理XP+3",
    handler: function (st) {
      var cost = 30;
      st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
      // 眼力 = 修理技能 + 智力；判断这类"是不是好东西"
      var eye = (st.skills && st.skills.repair ? st.skills.repair.level || 0 : 0);
      eye += Math.floor((st.player.intelligence || 0) / 2);
      var roll = Random.int(0, 100) + eye;
      var earn = 0;
      var msg = "";
      if (roll > 130) {
        earn = 300 + Random.int(0, 120);
        msg = "🏴 你在一堆杂物底下摸到一台老式收音机，拧开后盖一看——铜线圈完好，是停产的老货。转手卖了¥" + earn + "。";
      } else if (roll > 95) {
        earn = 120 + Random.int(0, 80);
        msg = "🏴 你花¥30买下一台旧风扇，回家擦干净、换了个电容，转手卖了¥" + earn + "。";
      } else if (roll > 60) {
        earn = 40 + Random.int(0, 40);
        msg = "🏴 挑了半天，淘到一件用得上还能小赚的东西，卖了¥" + earn + "。";
      } else {
        earn = 0;
        msg = "🏴 你看走眼了——那东西打开才发现里面的机芯被人换过。¥30 打了水漂。";
      }
      if (earn > 0) {
        st.resources.cash += earn;
        if (typeof addDailyTransaction === "function") {
          addDailyTransaction(st, "income", "side_job", earn, "二手市场淘货");
        }
      }
      if (st.skills && st.skills.repair) {
        st.skills.repair.xp = (st.skills.repair.xp || 0) + 3;
      }
      StateManager.addMessage(msg, earn > 100 ? "success" : "info");
    },
  },
  {
    id: "veg_market_bargain",
    name: "赶早市买菜",
    desc: "天没亮就去菜市场，跟摊主讨价还价买最新鲜也最便宜的菜。自己做饭比吃外卖省得多。",
    icon: "🥬",
    location: "vegetable_market",
    apCost: 10,
    condition: function (st) {
      var day = st.player.day || 0;
      var lastDay = st.flags._vegMarketDay;
      return (
        (st.resources.cash || 0) >= 15 &&
        (lastDay === undefined || day - lastDay >= 1)
      );
    },
    costEstimate: 15,
    effectEstimate: "饱腹+12 食物满足感+6",
    handler: function (st) {
      var day = st.player.day || 0;
      st.flags._vegMarketDay = day;
      var cost = 15;
      st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
      // 会砍价的（社交技能）能买到更多
      var socialLv = st.skills && st.skills.social ? st.skills.social.level || 0 : 0;
      var extra = Math.floor(socialLv / 20);
      var hungerGain = 12 + extra * 2;
      st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + hungerGain);
      st.needs.foodSatisfaction = Math.min(100, (st.needs.foodSatisfaction || 0) + 6 + extra);
      if (st.skills && st.skills.social) {
        st.skills.social.xp = (st.skills.social.xp || 0) + 2;
      }
      StateManager.addMessage(
        "🥬 你在菜市场转了一圈，¥" +
          cost +
          "买了满满一袋菜" +
          (extra > 0 ? "——砍价省下的钱又多添了两把青菜" : "") +
          "。今晚能自己开火了。",
        "success",
      );
    },
  },
  {
    id: "suburb_rest",
    name: "郊区静养",
    desc: "躲开城里的喧嚣，在郊区安静待一天。房租低、空气好，适合养病，也适合想清楚一些事。",
    icon: "🌆",
    location: "suburb",
    apCost: 30,
    condition: function (st) {
      var day = st.player.day || 0;
      var lastDay = st.flags._suburbRestDay;
      return lastDay === undefined || day - lastDay >= 7;
    },
    effectEstimate: "健康+6 心气+8 衣物整洁+5",
    handler: function (st) {
      var day = st.player.day || 0;
      st.flags._suburbRestDay = day;
      st.status.health = Math.min(100, (st.status.health || 70) + 6);
      st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
      st.needs.clothing = Math.min(100, (st.needs.clothing || 45) + 5);
      // 静养一天：不赚钱、但恢复得多
      st.needs.fatigue = Math.max(0, (st.needs.fatigue || 30) - 10);
      StateManager.addMessage(
        "🌆 你在郊区待了一整天。没有工地的轰鸣，没有催促的喇叭声，只有蝉鸣和远处传来的狗叫。傍晚回城时，你觉得身上轻了些。",
        "success",
      );
    },
  },
];

/**
 * 添加位置限定行动到 actions 列表
 * 系统自动扫描 LOCATION_EXTRA_ACTIONS 数组，自动匹配当前地点+条件。
 * 新增行动只需在数组中添加一条数据，无需修改此函数。
 */
function addLocationExtraActions(state, actions) {
  var curLoc = state.trade && state.trade.currentLocation;
  if (!curLoc) return;
  for (var i = 0; i < LOCATION_EXTRA_ACTIONS.length; i++) {
    var act = LOCATION_EXTRA_ACTIONS[i];
    if (act.location !== curLoc) continue;
    if (typeof act.condition === "function" && !act.condition(state)) continue;
    (function (a) {
      actions.push({
        id: a.id,
        name: a.name,
        desc: a.desc,
        icon: a.icon,
        apCost: a.apCost,
        payEstimate: a.payEstimate,
        handler: function () {
          var st = StateManager.getState();
          if (typeof consumeAP === "function") consumeAP(a.apCost || 20);
          a.handler(st);
        },
      });
    })(act);
  }
}

// ====== 导出 ======
if (typeof window !== "undefined") {
  window.LOCATION_EXTRA_ACTIONS = LOCATION_EXTRA_ACTIONS;
  window.addLocationExtraActions = addLocationExtraActions;

  // ====== 百科注册 ======
  window.MECHANICS = window.MECHANICS || {};
  MECHANICS.location_actions = {
    id: "location_actions",
    name: "地点特色行动",
    icon: "📍",
    brief:
      "在不同地点会触发的专属行动，系统自动扫描 LOCATION_EXTRA_ACTIONS 数据源。新增行动只需添加一条数据。",
    version: "1.0",
    related: [],
    sections: [
      {
        type: "desc",
        content:
          "地点特色行动是约定式自动归类（CoC）的示范系统——新行动只需在 data/actions.js 中添加一条数据条目，自动出现在对应地点的行动列表中。",
      },
      {
        type: "list",
        items: LOCATION_EXTRA_ACTIONS.map(function (a) {
          return (
            a.icon + " **" + a.name + "**（" + a.location + "）：" + a.desc
          );
        }),
      },
    ],
  };
}

// [R903 域A A类#1]: 导出函数到window
if (typeof window !== "undefined") {
  // [全系统自洽修复] 域H 修复:getAvailableActions 实际定义在 main.js(加载序在后),此处裸引用抛 ReferenceError → typeof 守卫,真实导出改由 main.js 承担
  if (typeof getAvailableActions !== "undefined") {
    window.getAvailableActions = getAvailableActions;
  }
}

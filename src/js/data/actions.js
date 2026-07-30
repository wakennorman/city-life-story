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
  window.getAvailableActions = getAvailableActions;
}

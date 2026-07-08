/**
 * 旅行系统（v3.7 Expansion v1）
 *
 * 离开当前城市去国内目的地旅行
 * - 5个国内目的地：北京/上海/成都/西安/大理
 * - 旅行需要AP+费用，触发专属事件
 * - 旅行期间暂停日常管线
 * - 带纪念品和特产回来
 *
 * 设计参考：BitLife旅行 / 模拟人生度假 / 真实中国城市风貌
 */

// ====== 目的地定义 ======
const TRAVEL_DESTINATIONS = {
  beijing: {
    id: "beijing",
    name: "北京",
    icon: "🏛️",
    cost: 800,
    apCost: 30,
    days: 3,
    desc: "帝都风情，故宫长城，胡同文化",
    souvenirs: ["北京烤鸭", "景泰蓝", "京剧脸谱"],
    events: [
      {
        desc: "在故宫里逛了一整天，被历史的厚重感击中",
        effect: "心情+10，智力+2",
      },
      {
        desc: "钻进胡同吃了碗炸酱面，老板跟你聊了半天",
        effect: "心情+8，名气+1",
      },
    ],
    localSpecials: ["烤鸭", "糖葫芦", "豆汁儿"],
    incomeMod: 0, // 旅行中无收入
  },
  shanghai: {
    id: "shanghai",
    name: "上海",
    icon: "🌃",
    cost: 1000,
    apCost: 30,
    days: 3,
    desc: "魔都繁华，外滩陆家嘴，弄堂风情",
    souvenirs: ["丝巾", "老字号糕点", "上海手表"],
    events: [
      {
        desc: "在外滩看陆家嘴天际线，感觉自己很渺小",
        effect: "心情+12，智力+3",
      },
      { desc: "在弄堂里迷路，被老奶奶请吃了碗馄饨", effect: "心情+10，道德+1" },
    ],
    localSpecials: ["生煎", "小笼包", "葱油拌面"],
    incomeMod: 0,
  },
  chengdu: {
    id: "chengdu",
    name: "成都",
    icon: "🐼",
    cost: 600,
    apCost: 25,
    days: 3,
    desc: "天府之国，熊猫基地，火锅串串",
    souvenirs: ["熊猫公仔", "蜀绣", "花椒油"],
    events: [
      {
        desc: "在熊猫基地看熊猫吃竹子，看了一下午",
        effect: "心情+15，疲劳-10",
      },
      {
        desc: "吃了一顿正宗火锅，辣到流泪但停不下来",
        effect: "心情+8，体质+1",
      },
    ],
    localSpecials: ["火锅", "串串", "担担面"],
    incomeMod: 0,
  },
  xian: {
    id: "xian",
    name: "西安",
    icon: "🏯",
    cost: 500,
    apCost: 25,
    days: 3,
    desc: "千年古都，兵马俑，古城墙",
    souvenirs: ["兵马俑仿品", "皮影", "碑林拓片"],
    events: [
      {
        desc: "站在兵马俑坑前，两千年的沉默压了下来",
        effect: "心情+10，能力+2",
      },
      {
        desc: "骑自行车在古城墙上转了一圈，风吹得很舒服",
        effect: "心情+8，体质+2",
      },
    ],
    localSpecials: ["肉夹馍", "凉皮", "羊肉泡馍"],
    incomeMod: 0,
  },
  dali: {
    id: "dali",
    name: "大理",
    icon: "🏔️",
    cost: 400,
    apCost: 20,
    days: 4,
    desc: "风花雪月，苍山洱海，慢生活",
    souvenirs: ["扎染布", "大理石摆件", "鲜花饼"],
    events: [
      {
        desc: "在洱海边骑了一天自行车，仿佛时间静止了",
        effect: "心情+20，疲劳-15",
      },
      { desc: "在古城小酒馆里听了一晚上民谣", effect: "心情+12，名气+2" },
    ],
    localSpecials: ["过桥米线", "乳扇", "鲜花饼"],
    incomeMod: 0,
  },
};

// ====== 旅行状态初始化 ======
function initTravelState(state) {
  if (!state.travel) {
    state.travel = {
      active: false,
      destination: null,
      daysRemaining: 0,
      visitedDestinations: [],
      souvenirs: [],
    };
  }
}

// ====== 开始旅行 ======
function startTravel(state, destId) {
  initTravelState(state);
  var dest = TRAVEL_DESTINATIONS[destId];
  if (!dest) return { ok: false, msg: "未知目的地" };
  if (state.travel && state.travel.active)
    return { ok: false, msg: "已经在旅行中" };
  if ((state.resources.cash || 0) < dest.cost)
    return {
      ok: false,
      msg: "现金不足，前往" + dest.name + "需要¥" + dest.cost,
    };
  var currentAp = (state.player && state.player.actionPoints) || 0;
  if (currentAp < dest.apCost)
    return { ok: false, msg: "行动力不足，需要" + dest.apCost + "行动力" };

  state.resources.cash -= dest.cost;
  state.player.actionPoints = Math.max(0, currentAp - dest.apCost);
  state.travel.active = true;
  state.travel.destination = destId;
  state.travel.daysRemaining = dest.days;
  if (state.travel.visitedDestinations.indexOf(destId) === -1) {
    state.travel.visitedDestinations.push(destId);
  }
  return {
    ok: true,
    msg:
      "出发去" +
      dest.name +
      "！花费¥" +
      dest.cost +
      "，" +
      dest.days +
      "天后回来。",
  };
}

// ====== 旅行每日 tick ======
function tickTravel(state) {
  initTravelState(state);
  if (!state.travel || !state.travel.active) return false;

  state.travel.daysRemaining--;
  var dest = TRAVEL_DESTINATIONS[state.travel.destination];
  if (dest) {
    // 随机旅行事件（使用种子化随机数）
    if (
      dest.events &&
      dest.events.length > 0 &&
      (typeof Random === "undefined" ? Math.random() < 0.4 : Random.chance(0.4))
    ) {
      var evtIdx =
        typeof Random !== "undefined"
          ? Random.int(0, dest.events.length - 1)
          : Math.floor(Math.random() * dest.events.length);
      var evt = dest.events[evtIdx];
      // 简单效果
      if (evt.effect.indexOf("心情+") !== -1) {
        var match = evt.effect.match(/心情\+(\d+)/);
        if (match)
          state.needs.happiness = Math.min(
            100,
            (state.needs.happiness || 50) + parseInt(match[1]),
          );
      }
      state._lastTravelEvent = evt.desc;
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "✈️ " + evt.desc + "（" + evt.effect + "）",
          "info",
        );
      }
    }
  }

  // 旅行中触发医疗/法律联动事件
  if (typeof checkTravelMedicalEvents === "function") {
    checkTravelMedicalEvents(state);
  }
  if (typeof checkTravelLegalEvents === "function") {
    checkTravelLegalEvents(state);
  }

  // 旅行结束
  if (state.travel.daysRemaining <= 0) {
    // 获得纪念品
    if (dest && dest.souvenirs && dest.souvenirs.length > 0) {
      var gift =
        dest.souvenirs[
          typeof Random !== "undefined"
            ? Random.int(0, dest.souvenirs.length - 1)
            : Math.floor(Math.random() * dest.souvenirs.length)
        ];
      if (!state.travel.souvenirs) state.travel.souvenirs = [];
      state.travel.souvenirs.push(gift);
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "🎁 旅行归来，带回了「" + gift + "」。",
          "success",
        );
      }
    }
    // 心情恢复
    state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 10);
    state.travel.active = false;
    state.travel.destination = null;
    // === v3.23: 触发槽 — after_travel ===
    if (typeof window.TriggerRegistry !== "undefined") {
      try {
        var afterTravelEvent = window.TriggerRegistry.triggerRandom(
          "after_travel",
          state,
        );
        if (afterTravelEvent) {
          setTimeout(function () {
            if (typeof showEventModal === "function")
              showEventModal(afterTravelEvent);
          }, 100);
        }
      } catch (e) {
        console.warn("TriggerRegistry after_travel 触发失败:", e);
      }
    }
    return true; // 旅行结束
  }
  return false;
}

function showTravelAgencyModal() {
  if (typeof showModal !== "function") return;
  var state = StateManager.getState();
  initTravelState(state);
  if (state.travel.active) {
    showModal({
      title: "✈️ 长途旅行",
      body: "<p>" + getTravelStatus(state).join("<br>") + "</p>",
      buttons: [{ text: "知道了", cls: "btn-primary" }],
    });
    return;
  }

  var body =
    '<div style="font-size:13px;line-height:1.7;">' +
    "<p>从商业区的长途客运站出发，去别的城市喘口气。</p>" +
    '<div style="display:grid;gap:8px;">';
  for (var key in TRAVEL_DESTINATIONS) {
    var d = TRAVEL_DESTINATIONS[key];
    body +=
      '<div style="padding:8px;border:1px solid var(--border);border-radius:6px;">' +
      "<strong>" +
      d.icon +
      " " +
      d.name +
      "</strong> · ¥" +
      d.cost.toLocaleString() +
      " · " +
      d.apCost +
      "行动力 · " +
      d.days +
      '天<br><span style="color:var(--text-secondary);">' +
      d.desc +
      "</span></div>";
  }
  body += "</div></div>";

  var buttons = Object.keys(TRAVEL_DESTINATIONS).map(function (destId) {
    var d = TRAVEL_DESTINATIONS[destId];
    return {
      text: d.icon + " " + d.name,
      cls: "btn-primary",
      callback: function () {
        var result = startTravel(StateManager.getState(), destId);
        StateManager.addMessage(result.msg, result.ok ? "success" : "warning");
        if (!result.ok) {
          var fb = document.querySelector(".modal-travel-feedback");
          if (fb) {
            fb.innerHTML =
              '<div style="margin-top:8px;padding:6px 10px;background:rgba(231,76,60,0.1);border-left:3px solid var(--danger);border-radius:4px;font-size:12px;color:var(--danger);">' +
              result.msg +
              "</div>";
          }
          return false;
        }
        if (typeof renderAll === "function") renderAll();
      },
    };
  });
  buttons.push({ text: "先不去了", cls: "" });
  showModal({ title: "✈️ 长途旅行", body: body, buttons: buttons });
}

// ====== 旅行状态查询 ======
function getTravelStatus(state) {
  initTravelState(state);
  var t = state.travel;
  var lines = [];
  if (t.active) {
    var dest = TRAVEL_DESTINATIONS[t.destination];
    lines.push(
      "✈️ 正在" +
        (dest ? dest.name : "旅行中") +
        "，剩余" +
        t.daysRemaining +
        "天",
    );
    if (state._lastTravelEvent) lines.push("📖 " + state._lastTravelEvent);
  } else {
    var visited = t.visitedDestinations || [];
    lines.push("🏠 当前不在地点 — 已去过 " + visited.length + "/5 个目的地");
  }
  if (t.souvenirs && t.souvenirs.length > 0)
    lines.push("🎁 纪念品：" + t.souvenirs.join("、"));
  return lines;
}

// ====== 全局挂载 ======
if (typeof window !== "undefined") {
  window.TRAVEL_DESTINATIONS = TRAVEL_DESTINATIONS;
  window.initTravelState = initTravelState;
  window.startTravel = startTravel;
  window.tickTravel = tickTravel;
  window.getTravelStatus = getTravelStatus;
  window.showTravelAgencyModal = showTravelAgencyModal;

  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.travel_system = {
    id: "travel_system",
    name: "旅行系统",
    icon: "✈️",
    brief:
      "离开城市去远方——5个国内目的地，专属事件+纪念品收集。旅行是放松也是花钱的好方式。",
    version: "v1",
    related: [],
    sections: [
      {
        type: "desc",
        content:
          "旅行系统让你可以在游戏中离开当前城市，前往中国5个知名目的地体验当地风情。",
      },
      {
        type: "table",
        title: "目的地",
        headers: ["城市", "费用", "天数", "特色"],
        rows: [
          ["🏛️ 北京", "¥800", "3天", "故宫/胡同/烤鸭"],
          ["🌃 上海", "¥1,000", "3天", "外滩/弄堂/小笼包"],
          ["🐼 成都", "¥600", "3天", "熊猫/火锅/慢生活"],
          ["🏯 西安", "¥500", "3天", "兵马俑/古城墙/肉夹馍"],
          ["🏔️ 大理", "¥400", "4天", "苍山洱海/民谣/扎染"],
        ],
      },
      {
        type: "tip",
        content:
          "旅行是快速恢复心情、收集纪念品的好方式，但费用不菲——穷游富游都是游。",
      },
    ],
  };

  window.NARRATIVES = window.NARRATIVES || {};
  window.NARRATIVES.travel_memories = {
    id: "travel_memories",
    name: "旅行回忆",
    category: "人生故事",
    title: "✈️ 旅行回忆",
    brief: "那些年去过的地方，见过的风景。",
    content: function () {
      var s = typeof StateManager !== "undefined" && StateManager.getState();
      if (
        !s ||
        !s.travel ||
        !s.travel.visitedDestinations ||
        s.travel.visitedDestinations.length === 0
      )
        return "🔒 你还没有去过任何地方。";
      var names = s.travel.visitedDestinations.map(function (id) {
        var d = TRAVEL_DESTINATIONS[id];
        return d ? d.icon + " " + d.name : id;
      });
      return (
        "你去过 " + names.join("、") + "，见过不同的风景，也见过不同的自己。"
      );
    },
    version: "v1",
  };
}

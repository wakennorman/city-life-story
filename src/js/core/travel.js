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
        effects: { happiness: 10, intelligence: 2 },
      },
      {
        desc: "钻进胡同吃了碗炸酱面，老板跟你聊了半天",
        effects: { happiness: 8, fame: 1 },
      },
    ],
    localSpecials: ["烤鸭", "糖葫芦", "豆汁儿"],
    incomeMod: 0, // 旅行中无收入
    decisionEvents: [
      {
        title: "胡同里的选择",
        story:
          "你钻进了一条老北京的胡同，深处有一位大爷在拉二胡。琴声苍凉，你想——",
        choices: [
          {
            text: "坐下来听一曲",
            hint: "心情+8，听懂大爷的故事",
            apply: function (st) {
              if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8,
              );
              st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
            },
            cost: 10,
          },
          {
            text: "给大爷捐点钱",
            hint: "道德+2，名气+1",
            apply: function (st) {
              st.player.morality = Math.min(100, (st.player.morality || 0) + 2);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            },
            cost: 50,
          },
          {
            text: "拍个短视频发网上",
            hint: "名气+3",
            apply: function (st) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            },
            cost: 0,
          },
        ],
      },
    ],
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
        effects: { happiness: 12, intelligence: 3 },
      },
      {
        desc: "在弄堂里迷路，被老奶奶请吃了碗馄饨",
        effects: { happiness: 10, morality: 1 },
      },
    ],
    localSpecials: ["生煎", "小笼包", "葱油拌面"],
    incomeMod: 0,
    decisionEvents: [
      {
        title: "陆家嘴的诱惑",
        story:
          "你在陆家嘴的高楼大厦间穿行，一个西装革履的人递给你一张名片：「小伙子，想赚大钱吗？」——",
        choices: [
          {
            text: "接下名片聊聊",
            hint: "也许是个机会",
            apply: function (st) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
              StateManager.addMessage(
                "📇 你收下了名片——上面写着某投资顾问公司的名字。不管真假，多认识个人总没错。",
                "info",
              );
            },
            cost: 0,
          },
          {
            text: "婉言谢绝",
            hint: "安全第一",
            apply: function (st) {
              st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
              StateManager.addMessage(
                "🛡️ 你礼貌地拒绝了。这座城市到处都是机会，也到处都是陷阱。",
                "info",
              );
            },
            cost: 0,
          },
          {
            text: "跟他去公司看看",
            hint: "冒险探索，可能有收获",
            apply: function (st) {
              var r = Random.int(0, 2);
              if (r === 0) {
                st.resources.cash = (st.resources.cash || 0) + 200;
                StateManager.addMessage(
                  "💰 原来是正规的理财公司，听了半天的投资讲座，赚了¥200出场费。",
                  "success",
                );
              } else {
                StateManager.addMessage(
                  "📉 是个坑。你找了个借口溜了，还好没损失。",
                  "warning",
                );
              }
            },
            cost: 0,
          },
        ],
      },
    ],
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
        effects: { happiness: 15, fatigue: -10 },
      },
      {
        desc: "吃了一顿正宗火锅，辣到流泪但停不下来",
        effects: { happiness: 8, physique: 1 },
      },
    ],
    localSpecials: ["火锅", "串串", "担担面"],
    incomeMod: 0,
    decisionEvents: [
      {
        title: "火锅店的奇遇",
        story:
          "你在成都找了一家苍蝇馆子吃火锅。老板看你一个人，端了盘毛肚过来说——「小伙子，一个人来成都？」——",
        choices: [
          {
            text: "跟老板聊聊天",
            hint: "了解成都生活，心情+5",
            apply: function (st) {
              if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5,
              );
              st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            },
            cost: 0,
          },
          {
            text: "请老板喝瓶酒",
            hint: "打好关系，可能有惊喜",
            apply: function (st) {
              st.resources.cash = (st.resources.cash || 0) - 20;
              st.player.charm = Math.min(100, (st.player.charm || 0) + 1);
              StateManager.addMessage(
                "🍶 老板高兴了，给你加了份脑花——免费的。",
                "success",
              );
            },
            cost: 20,
          },
        ],
      },
    ],
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
        effects: { happiness: 10, mental: 2 },
      },
      {
        desc: "骑自行车在古城墙上转了一圈，风吹得很舒服",
        effects: { happiness: 8, physique: 2 },
      },
    ],
    localSpecials: ["肉夹馍", "凉皮", "羊肉泡馍"],
    incomeMod: 0,
    decisionEvents: [
      {
        title: "古城墙上的对话",
        story:
          "你在古城墙上骑车时遇到一个外国背包客，他用蹩脚的中文问路。你想——",
        choices: [
          {
            text: "热情指路，还带他去目的地",
            hint: "魅力+2，英语技能提升",
            apply: function (st) {
              st.player.charm = Math.min(100, (st.player.charm || 0) + 2);
              if (st.skills && st.skills.english)
                st.skills.english.level = Math.min(
                  100,
                  (st.skills.english.level || 0) + 1,
                );
            },
            cost: 0,
          },
          {
            text: "用手机翻译软件帮他",
            hint: "智力+1",
            apply: function (st) {
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 0) + 1,
              );
            },
            cost: 0,
          },
          {
            text: "说自己也是游客，不太清楚",
            hint: "安全",
            apply: function (st) {
              st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
            },
            cost: 0,
          },
        ],
      },
    ],
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
        effects: { happiness: 20, fatigue: -15 },
      },
      {
        desc: "在古城小酒馆里听了一晚上民谣",
        effects: { happiness: 12, fame: 2 },
      },
    ],
    localSpecials: ["过桥米线", "乳扇", "鲜花饼"],
    incomeMod: 0,
    decisionEvents: [
      {
        title: "洱海边的选择",
        story:
          "你租了一辆自行车环洱海骑行。路边有个老奶奶在卖手工扎染，旁边还有个小伙子举着GoPro拍vlog。你停下脚步——",
        choices: [
          {
            text: "买一块扎染布做纪念",
            hint: "心情+5，道德+1",
            apply: function (st) {
              if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5,
              );
              st.player.morality = Math.min(100, (st.player.morality || 0) + 1);
            },
            cost: 60,
          },
          {
            text: "跟拍vlog的小哥聊聊天",
            hint: "魅力+2，社交积累",
            apply: function (st) {
              st.player.charm = Math.min(100, (st.player.charm || 0) + 2);
              StateManager.addMessage(
                "🎬 原来他是个旅游博主，正在做一期大理攻略。他说你的建议很有帮助。",
                "info",
              );
            },
            cost: 0,
          },
          {
            text: "继续骑行，不想被打扰",
            hint: "心情+8，安静享受",
            apply: function (st) {
              if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8,
              );
            },
            cost: 0,
          },
        ],
      },
    ],
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
  // [全系统自洽修复] 域G 联动增强: 极端天气阻断出行
  if (
    typeof isWeatherTravelBlocked === "function" &&
    isWeatherTravelBlocked(state)
  ) {
    return { ok: false, msg: "极端天气，不适合出行！" };
  }

  state.resources.cash = Math.max(0, (state.resources.cash || 0) - dest.cost);
  // [全系统自洽修复] 域G 联动增强: 天气影响旅行AP消耗（暴雨/台风/暴雪增加出行成本）
  var weatherApMod =
    typeof getWeatherTravelApMod === "function"
      ? getWeatherTravelApMod(state)
      : 1.0;
  var actualApCost = Math.round(dest.apCost * weatherApMod);
  state.player.actionPoints = Math.max(0, currentAp - actualApCost);
  if (weatherApMod > 1.0) {
    StateManager.addMessage(
      "🌧️ 受天气影响，出行成本增加了" +
        Math.round((weatherApMod - 1.0) * 100) +
        "%。",
      "warning",
    );
  }
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
      Random.chance(0.4)
    ) {
      // [全系统自洽修复] 域G A类: Random 始终已定义, 删除 Math.random 死代码兜底
      var evtIdx = Random.int(0, dest.events.length - 1);
      var evt = dest.events[evtIdx];
      // [CoC] 声明式 effects 对象优先（如 {happiness:10, intelligence:2}），向后兼容旧字符串
      if (evt.effects) {
        // 约定式效果路径映射 — 新增效果字段只需在此加一行，零代码修改
        var EFFECT_PATH_MAP = {
          happiness: { path: "needs.happiness", max: 100, invert: false },
          intelligence: {
            path: "player.intelligence",
            max: 100,
            invert: false,
          },
          physique: { path: "player.physique", max: 100, invert: false },
          fatigue: { path: "needs.fatigue", max: 100, invert: true },
          morality: { path: "player.morality", max: 100, invert: false },
          fame: { path: "player.fame", max: 100, invert: false },
          mental: { path: "player.mental", max: 100, invert: false },
        };
        for (var ek in evt.effects) {
          if (!evt.effects.hasOwnProperty(ek)) continue;
          var erule = EFFECT_PATH_MAP[ek];
          if (!erule) continue;
          var edelta = evt.effects[ek];
          var eparts = erule.path.split(".");
          var etarget = state;
          var pathBroken = false;
          for (var epi = 0; epi < eparts.length - 1; epi++) {
            // [全系统自洽修复] 域G A类修复: 中间路径对象不存在（如 state.needs 未定义）→ TypeError 崩溃
            if (etarget[eparts[epi]] == null) { pathBroken = true; break; }
            etarget = etarget[eparts[epi]];
          }
          if (pathBroken) continue;
          var ecur = etarget[eparts[eparts.length - 1]] || 0;
          if (erule.invert) {
            etarget[eparts[eparts.length - 1]] = Math.max(
              0,
              Math.min(erule.max, ecur - edelta),
            );
          } else {
            etarget[eparts[eparts.length - 1]] = Math.max(
              0,
              Math.min(erule.max, ecur + edelta),
            );
          }
        }
      } else if (evt.effect) {
        // 向后兼容：旧字符串格式
        [
          ["心情+", "needs.happiness", 100, 0],
          ["智力+", "player.intelligence", 100, 0],
          ["体质+", "player.physique", 100, 0],
          ["疲劳-", "needs.fatigue", 100, 1],
          ["道德+", "player.morality", 100, 0],
          ["名气+", "player.fame", 100, 0],
        ].forEach(function (rule) {
          var key = rule[0],
            path = rule[1],
            max = rule[2],
            isNeg = rule[3];
          if (evt.effect.indexOf(key) !== -1) {
            var m = evt.effect.match(
              new RegExp(
                key.replace("+", "\\+").replace("-", "\\-") + "(\\d+)",
              ),
            );
            if (m) {
              var parts = path.split(".");
              var target = state;
              for (var pi = 0; pi < parts.length; pi++)
                target = target[parts[pi]];
              var val = target || 0;
              var delta = parseInt(m[1]);
              if (isNeg) {
                target = Math.max(0, val - delta);
              } else {
                target = Math.min(max, val + delta);
              }
              var parent = state;
              for (var pi2 = 0; pi2 < parts.length - 1; pi2++)
                parent = parent[parts[pi2]];
              parent[parts[parts.length - 1]] = target;
            }
          }
        });
      }
      state._lastTravelEvent = evt.desc;
      if (typeof StateManager !== "undefined") {
        // [CoC] 支持声明式 effects 和旧 effect 字符串两种格式
        var effLabel = "";
        if (evt.effects) {
          var parts = [];
          for (var ek in evt.effects) {
            if (!evt.effects.hasOwnProperty(ek)) continue;
            var v = evt.effects[ek];
            parts.push((v >= 0 ? "+" : "") + v + ek);
          }
          effLabel = "（" + parts.join("，") + "）";
        } else if (evt.effect) {
          effLabel = "（" + evt.effect + "）";
        }
        StateManager.addMessage("✈️ " + evt.desc + effLabel, "info");
      }
    }

    // 带选择的大事件（每次旅行最多触发一次，50%概率）
    if (
      dest.decisionEvents &&
      dest.decisionEvents.length > 0 &&
      state.flags &&
      !state.flags._travelDecisionShown &&
      Random.chance(0.5)
    ) {
      var decIdx = Random.int(0, dest.decisionEvents.length - 1);
      var dec = dest.decisionEvents[decIdx];
      state.flags._travelDecisionShown = true;
      if (
        typeof dec.choices !== "undefined" &&
        typeof showEventModal === "function"
      ) {
        setTimeout(function () {
          showEventModal({
            icon: "✈️",
            title: dest.icon + " " + dest.name + "：" + dec.title,
            story: dec.story,
            choices: dec.choices.map(function (c) {
              return {
                text: c.text,
                hint: c.hint || "",
                cost: c.cost || 0,
                apply: function (st) {
                  c.apply(st);
                  st._lastTravelEvent = dec.title + " — " + c.text;
                },
              };
            }),
          });
        }, 50);
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
      var gift = dest.souvenirs[Random.int(0, dest.souvenirs.length - 1)];
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
    // [全系统自洽修复] 域G 联动增强: 旅行归来后额外疲劳+叙事消息（G→G 核心机制深度包装）
    state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 5);
    if (dest) {
      StateManager.addMessage(
        "🚶 " + dest.name + "之旅结束了，你带着行囊和回忆回到熟悉的城市。虽然有点累，但心里充实了不少。",
        "info"
      );
    }
    state.travel.active = false;
    state.travel.destination = null;
    state.travel.daysRemaining = 0;
    if (state.flags) state.flags._travelDecisionShown = false;
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

  window.NARRATIVES.travel_souvenirs = {
    id: "travel_souvenirs",
    name: "旅行纪念品",
    category: "人生故事",
    title: "🎁 旅行纪念品收藏",
    brief: "每一件纪念品都是一段旅行的回忆。",
    content: function () {
      var s = typeof StateManager !== "undefined" && StateManager.getState();
      if (
        !s ||
        !s.travel ||
        !s.travel.souvenirs ||
        s.travel.souvenirs.length === 0
      )
        return "🔒 你还没有收集过任何旅行纪念品。";
      var allSouvenirs = [];
      for (var key in TRAVEL_DESTINATIONS) {
        var d = TRAVEL_DESTINATIONS[key];
        if (d.souvenirs) {
          d.souvenirs.forEach(function (item) {
            allSouvenirs.push(item);
          });
        }
      }
      var collected = s.travel.souvenirs;
      var lines = ["🧳 你已经收集了 " + collected.length + " 件纪念品："];
      collected.forEach(function (item) {
        lines.push("  • " + item);
      });
      lines.push("");
      lines.push(
        "📊 收集进度：" + collected.length + "/" + allSouvenirs.length,
      );
      return lines.join("<br>");
    },
    version: "v1",
  };
}
// [R103] 域G 联动增强

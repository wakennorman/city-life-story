/**
 * 命运抉择卡系统（v3.1 新机制 · 游戏设计师提案）
 *
 * 设计意图：
 *  - 给玩家"周期性的高 stakes 选择"，打破日常 grind 的单调性（峰终定律 / 损失厌恶）
 *  - 提供对"健康死亡计时器"的反制抓手（回乡养病 / 躺平充电等回血选项）
 *  - 不同性格的 AI / 玩家会选不同选项 → 在蒙特卡洛中自然产生策略分化
 *
 * 接入方式（遵循 v3.1 SOP）：
 *  - 暴露 window.crossroadsTick / resolveCrossroads / drawCrossroadsCard / decideCrossroads
 *  - daily_pipeline 每 30 天调用一次 crossroadsTick
 *  - index.html 在 phase2 段后注册本脚本
 */

(function () {
  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }
  var R =
    typeof Random !== "undefined" && Random
      ? Random
      : {
          int: function (a, b) {
            return Math.floor(Math.random() * (b - a + 1)) + a;
          },
          chance: function (p) {
            return Math.random() < p;
          },
        };

  function msg(state, text) {
    if (typeof StateManager !== "undefined") StateManager.addMessage(text, "event");
  }

  // 把一次数值变动安全落地（记账 + 钳制），便于 MC 对账
  function applyDelta(state, d) {
    if (!d) return;
    if (typeof d.cash === "number" && d.cash !== 0) {
      state.resources.cash = (state.resources.cash || 0) + d.cash;
      state.resources.totalEarned =
        (state.resources.totalEarned || 0) + Math.max(0, d.cash);
      if (typeof addDailyTransaction === "function") {
        addDailyTransaction(
          state,
          d.cash > 0 ? "income" : "expense",
          d.cat || "crossroads",
          Math.abs(d.cash),
          d.label || "命运抉择",
        );
      }
    }
    if (typeof d.health === "number")
      state.status.health = clamp(
        (state.status.health || 100) + d.health,
        0,
        100,
      );
    if (typeof d.happiness === "number")
      state.needs.happiness = clamp(
        (state.needs.happiness || 50) + d.happiness,
        0,
        100,
      );
    if (typeof d.fatigue === "number")
      state.needs.fatigue = clamp(
        (state.needs.fatigue || 0) + d.fatigue,
        0,
        100,
      );
  }

  // ====== 抉择卡牌库 ======
  // 每张卡 2 个选项：risk="bold" 冒险 / risk="safe" 稳健
  var DECK = [
    {
      id: "startup",
      title: "朋友拉你合伙创业",
      icon: "🚀",
      desc: "一个看似风口的项目，但需要你 All-in。",
      options: [
        {
          label: "All-in 创业",
          risk: "bold",
          apply: function (s) {
            var roll = R.int(-2500, 9000);
            applyDelta(s, {
              cash: roll,
              health: -5,
              happiness: roll > 0 ? 8 : -6,
              cat: "crossroads",
              label: "创业回报",
            });
            return "创业结算：¥" + roll;
          },
        },
        {
          label: "婉拒，专注本职",
          risk: "safe",
          apply: function (s) {
            applyDelta(s, { cash: 200, happiness: 2, label: "稳妥收入" });
            return "安稳赚 ¥200";
          },
        },
      ],
    },
    {
      id: "health_alarm",
      title: "身体亮红灯，医生劝你休息",
      icon: "🩺",
      desc: "体检报告不太好，继续熬可能出事。",
      options: [
        {
          label: "请假回乡养病",
          risk: "safe",
          apply: function (s) {
            applyDelta(s, {
              cash: -500,
              health: 25,
              fatigue: -30,
              happiness: 5,
              label: "休养",
            });
            return "回乡休养，健康+25";
          },
        },
        {
          label: "硬撑，加班赶进度",
          risk: "bold",
          apply: function (s) {
            applyDelta(s, {
              cash: 400,
              health: -12,
              happiness: -4,
              label: "加班",
            });
            return "硬撑加班，健康-12";
          },
        },
      ],
    },
    {
      id: "promotion",
      title: "部门竞聘：躺平还是内卷",
      icon: "🪜",
      desc: "一个露脸的机会，代价是生活。",
      options: [
        {
          label: "躺平，准点下班",
          risk: "safe",
          apply: function (s) {
            applyDelta(s, {
              cash: -300,
              health: 12,
              happiness: 10,
              label: "躺平",
            });
            return "躺平充电，健康+12";
          },
        },
        {
          label: "内卷，抢重点项目",
          risk: "bold",
          apply: function (s) {
            applyDelta(s, {
              cash: 900,
              health: -8,
              happiness: -6,
              fatigue: 10,
              label: "内卷",
            });
            return "内卷抢功，现金+900";
          },
        },
      ],
    },
    {
      id: "wedding",
      title: "同事婚礼，要不要随份子",
      icon: "💍",
      desc: "关系投资还是捂紧钱包？",
      options: [
        {
          label: "去，随份子",
          risk: "safe",
          apply: function (s) {
            applyDelta(s, { cash: -400, happiness: 8, label: "人情" });
            s.flags._mcSocialCapital = (s.flags._mcSocialCapital || 0) + 1;
            return "人脉+1";
          },
        },
        {
          label: "借口不去",
          risk: "bold",
          apply: function (s) {
            applyDelta(s, { cash: 0, happiness: -3, label: "缺席" });
            return "省下份子钱";
          },
        },
      ],
    },
    {
      id: "sidegig",
      title: "下班后有人拉你搞副业",
      icon: "🌙",
      desc: "多一份收入，少一夜睡眠。",
      options: [
        {
          label: "接，搞副业",
          risk: "bold",
          apply: function (s) {
            var earn = R.int(50, 250);
            applyDelta(s, {
              cash: earn,
              fatigue: 15,
              health: -2,
              cat: "crossroads",
              label: "副业收入",
            });
            s._mcSideHustleEarned = (s._mcSideHustleEarned || 0) + earn;
            return "副业赚 ¥" + earn;
          },
        },
        {
          label: "拒绝，早点睡",
          risk: "safe",
          apply: function (s) {
            applyDelta(s, { fatigue: -12, health: 3, label: "早睡" });
            return "早睡回血";
          },
        },
      ],
    },
    {
      id: "hometown",
      title: "老家拆迁分红 vs 留城打拼",
      icon: "🏡",
      desc: "一笔钱能让你喘口气，但可能错过城里机会。",
      options: [
        {
          label: "拿分红回老家躺一阵",
          risk: "safe",
          apply: function (s) {
            applyDelta(s, {
              cash: 3000,
              happiness: 15,
              health: 10,
              label: "返乡分红",
            });
            s.flags._mcReturnedHome = true;
            return "返乡分红 ¥3000";
          },
        },
        {
          label: "留在城里继续卷",
          risk: "bold",
          apply: function (s) {
            applyDelta(s, { cash: 300, happiness: -2, label: "留守" });
            return "留守城里";
          },
        },
      ],
    },
  ];

  function getCardById(id) {
    for (var i = 0; i < DECK.length; i++) if (DECK[i].id === id) return DECK[i];
    return null;
  }

  // 每 30 天抽一张；避免与上次重复
  function drawCrossroadsCard(state) {
    var idx = R.int(0, DECK.length - 1);
    var card = DECK[idx];
    if (state._lastCrossroadsId && card.id === state._lastCrossroadsId) {
      idx = (idx + 1) % DECK.length;
      card = DECK[idx];
    }
    state._lastCrossroadsId = card.id;
    state._pendingCrossroads = { id: card.id, day: state.player.day };
    msg(state, "🎴 命运抉择：「" + card.title + "」等待你的选择");
  }

  // AI / 玩家决策：根据 bias 选 bold 或 safe 选项
  function decideCrossroads(state, bias) {
    var p = state._pendingCrossroads;
    if (!p) return -1;
    var card = getCardById(p.id);
    if (!card) return -1;
    for (var i = 0; i < card.options.length; i++) {
      if (card.options[i].risk === bias) return i;
    }
    return 0;
  }

  // 结算某选项
  function resolveCrossroads(state, cardId, optionIndex) {
    var card = getCardById(cardId);
    if (!card) return null;
    var opt = card.options[optionIndex];
    if (!opt) return null;
    var result = opt.apply(state);
    state._mcCrossroadsTaken = (state._mcCrossroadsTaken || 0) + 1;
    state._pendingCrossroads = null;
    msg(state, "🎴 抉择：" + card.title + " → " + opt.label + "（" + result + "）");
    return result;
  }

  // 每日 tick：抽卡 + 过期自动兜底（真实游戏无 UI 点击时 2 天后按稳健兜底）
  function crossroadsTick(state) {
    if (!state || !state.player) return;
    var day = state.player.day;
    if (state._pendingCrossroads) {
      if (state._pendingCrossroads.day < day - 2) {
        resolveCrossroads(state, state._pendingCrossroads.id, decideCrossroads(state, "safe"));
      }
      return;
    }
    if (day > 0 && day % 30 === 0) {
      drawCrossroadsCard(state);
    }
  }

  if (typeof window !== "undefined") {
    window.CROSSROADS_DECK = DECK;
    window.crossroadsTick = crossroadsTick;
    window.drawCrossroadsCard = drawCrossroadsCard;
    window.resolveCrossroads = resolveCrossroads;
    window.decideCrossroads = decideCrossroads;
  }
})();

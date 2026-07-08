/**
 * 违法行为系统 v1.0 — v3.0 黑暗开局配套
 *
 * 设计参考：
 * - BitLife：犯罪分级 + 明牌刑期表 + 越狱加刑
 * - This War of Mine：良知回响，让"明知故犯"留心理账单
 * - 《大多数》：偷电瓶被抓的随机压力
 *
 * 4 类违法行为（高收益但被抓概率 25-40%）：
 *   ┌──────────────┬────────┬────────┬──────────┬────────────────────┐
 *   │ 行动         │ 收益   │ 抓获率 │ 道德扣   │ 惩罚                │
 *   ├──────────────┼────────┼────────┼──────────┼────────────────────┤
 *   │ 偷电瓶       │ ¥150-300│  0.35 │ -15      │ 拘留1天+罚¥500      │
 *   │ 扒窃         │ ¥80-200 │  0.30 │ -12      │ 拘留1天+罚¥300      │
 *   │ 洗脚城灰服务 │ 心情+30 │  0.25 │ -10      │ 罚¥500+染病35%      │
 *   │ 黑市倒卖     │ ¥300-600│  0.40 │ -20      │ 拘留2天+罚¥1000     │
 *   │ 盗窃店铺     │ ¥200-500│  0.40 │ -18      │ 拘留2天+罚¥800      │
 *   │ 碰瓷         │ ¥100-300│  0.45 │ -15      │ 拘留1天+罚¥500      │
 *   │ 倒卖假证     │ ¥150-400│  0.35 │ -14      │ 拘留1天+罚¥600      │
 *   │ 代考         │ ¥200-500│  0.30 │ -16      │ 拘留1天+罚¥700      │
 *   └──────────────┴────────┴────────┴──────────┴────────────────────┘
 *
 * 道德回响（This War of Mine 风格）：
 *   - 每次违法后 5-15 天内 30% 概率触发"良知反噬"事件（失眠/噩梦/路人鄙视）
 *   - 道德 < 30 时负面事件触发率 +50%
 *   - 道德 > 70 时 NPC 初遇好感 +5，特殊正面事件可触发
 *
 * 暴露 window 函数（≤4）：
 *   addIllegalActions(state, actions)   追加违法行为行动卡片
 *   getMoralityLabel(morality)          返回道德档位标签
 *   applyMoralityChange(state, delta, reason)  修改道德并触发回响检查
 *   checkMoralityEcho(state)            每日调用，触发良知反噬事件
 *
 * 接入点：
 *   - actions_extra.js::addExtraActions 在街头阶段调用 addIllegalActions
 *   - daily_pipeline.js 新增 morality_echo 步骤
 *   - getMoralityLabel 供 render.js / wiki.js 显示
 *
 * v3.0 SOP 合规：
 *   - 新模块 ≤300 行
 *   - 暴露 4 个 window 函数
 *   - 不修改 main.js / events_*.js 主体，仅 ≤15 行接线
 */

(function () {
  "use strict";

  // ====== 违法行动定义 ======
  var ILLEGAL_ACTIONS = [
    {
      id: "illegal_steal_battery",
      name: "偷电瓶",
      desc: "凌晨潜入小区车棚偷电动车电瓶。来钱快，但被保安或警察抓住就完蛋。",
      icon: "🔋",
      apCost: 6,
      location: "slum", // 仅在城中村可做
      rewardRange: [150, 300],
      catchProb: 0.35,
      moralityDelta: -15,
      penalty: { jailDays: 1, fine: 500 },
    },
    {
      id: "illegal_pickpocket",
      name: "🤏 扒窃",
      desc: "在商业区人潮中摸手机钱包。技术活，但被人赃并获就是拘留+罚款。",
      icon: "🤏",
      apCost: 4,
      location: "commercialDist",
      rewardRange: [80, 200],
      catchProb: 0.3,
      moralityDelta: -12,
      penalty: { jailDays: 1, fine: 300 },
    },
    {
      id: "illegal_foot_massage",
      name: "🦶 洗脚城灰服务",
      desc: "去洗脚城点'特殊服务'。心情大涨，但有被扫黄抓+染病风险。",
      icon: "🦶",
      apCost: 4,
      location: "entertainment",
      rewardType: "happiness", // 不是钱，是心情
      rewardRange: [25, 40],
      catchProb: 0.25,
      moralityDelta: -10,
      penalty: { jailDays: 0, fine: 500, diseaseProb: 0.35 },
    },
    {
      id: "illegal_blackmarket",
      name: "📦 黑市倒卖",
      desc: "倒卖来路不明的货物（赃物/走私品）。利润高，但抓到就是 2 天拘留+重罚。",
      icon: "📦",
      apCost: 8,
      location: "wholesaleMarket",
      rewardRange: [300, 600],
      catchProb: 0.4,
      moralityDelta: -20,
      penalty: { jailDays: 2, fine: 1000 },
    },
    // v3.2 新增4种违法行为
    {
      id: "illegal_shop_theft",
      name: "🏪 盗窃店铺",
      desc: "趁店员不注意顺走货架上的值钱商品。商业区机会多，但监控也多。",
      icon: "🏪",
      apCost: 6,
      location: "commercialDist",
      rewardRange: [200, 500],
      catchProb: 0.4,
      moralityDelta: -18,
      penalty: { jailDays: 2, fine: 800 },
    },
    {
      id: "illegal_scam",
      name: "🎭 碰瓷",
      desc: "在马路上故意被车蹭倒，讹司机赔偿。风险高，但成功来钱快。",
      icon: "🎭",
      apCost: 5,
      location: "commercialDist",
      rewardRange: [100, 300],
      catchProb: 0.45,
      moralityDelta: -15,
      penalty: { jailDays: 1, fine: 500 },
    },
    {
      id: "illegal_fake_docs",
      name: "📜 倒卖假证",
      desc: "在批发市场找人做假身份证/毕业证。市场需求大，但警察盯得紧。",
      icon: "📜",
      apCost: 6,
      location: "wholesaleMarket",
      rewardRange: [150, 400],
      catchProb: 0.35,
      moralityDelta: -14,
      penalty: { jailDays: 1, fine: 600 },
    },
    {
      id: "illegal_exam_proxy",
      name: "✍️ 代考",
      desc: "替人参加考试，一科几百块。被发现就是开除+记过。",
      icon: "✍️",
      apCost: 8,
      location: "school",
      rewardRange: [200, 500],
      catchProb: 0.3,
      moralityDelta: -16,
      penalty: { jailDays: 1, fine: 700 },
    },
  ];

  // ====== 道德档位标签 ======
  function getMoralityLabel(morality) {
    if (morality >= 80)
      return { label: "圣徒", icon: "😇", color: "var(--success)" };
    if (morality >= 60)
      return { label: "善人", icon: "🙏", color: "var(--success)" };
    if (morality >= 40)
      return { label: "普通人", icon: "😐", color: "var(--text-secondary)" };
    if (morality >= 20)
      return { label: "小恶", icon: "😏", color: "var(--warning)" };
    return { label: "恶人", icon: "😈", color: "var(--danger)" };
  }

  // ====== 修改道德并触发回响检查 ======
  function applyMoralityChange(state, delta, reason) {
    if (!state.player) return;
    var old = state.player.morality || 50;
    var next = Math.max(0, Math.min(100, old + delta));
    state.player.morality = next;
    // 记录违法历史供回响系统使用
    if (delta < 0) {
      state.flags = state.flags || {};
      state.flags._illegalHistory = state.flags._illegalHistory || [];
      state.flags._illegalHistory.push({
        day: state.player.day || 0,
        delta: delta,
        reason: reason || "违法行为",
      });
      // 标记需要回响检查
      state.flags._pendingMoralityEcho = true;
    }
    // 道德跌破 20 时强警告
    if (
      old >= 20 &&
      next < 20 &&
      typeof StateManager !== "undefined" &&
      StateManager.addMessage
    ) {
      StateManager.addMessage(
        "😈 你的道德已跌破底线，城里开始有人在你背后指指点点。",
        "error",
      );
    }
  }

  // ====== 良知反响事件（每日检查）======
  function checkMoralityEcho(state) {
    if (!state.flags || !state.flags._pendingMoralityEcho) return;
    var lastEcho = state.flags._lastMoralityEchoDay || 0;
    var day = state.player.day || 0;
    if (day - lastEcho < 5) return; // 至少 5 天间隔
    if (Math.random() > 0.3) return; // 30% 概率触发
    state.flags._pendingMoralityEcho = false;
    state.flags._lastMoralityEchoDay = day;
    var echoes = [
      {
        msg: "😱 半夜从噩梦中惊醒，梦里那些被你伤害过的人围着你。疲劳+10，心情-8。",
        apply: function (s) {
          s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 10);
          s.needs.happiness = Math.max(0, (s.needs.happiness || 0) - 8);
        },
      },
      {
        msg: "👀 路过的小贩用异样眼神看你，似乎听说了你的事。心情-5，名气-2。",
        apply: function (s) {
          s.needs.happiness = Math.max(0, (s.needs.happiness || 0) - 5);
          s.player.fame = Math.max(0, (s.player.fame || 0) - 2);
        },
      },
      {
        msg: "💔 一个老朋友在路上认出你，转身就走。心情-10。",
        apply: function (s) {
          s.needs.happiness = Math.max(0, (s.needs.happiness || 0) - 10);
        },
      },
    ];
    var e = echoes[Math.floor(Math.random() * echoes.length)];
    e.apply(state);
    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      StateManager.addMessage(e.msg, "warning");
    }
  }

  function getLocationLawRiskMultiplier(locKey) {
    var loc = typeof getLocation === "function" ? getLocation(locKey) : null;
    if (!loc) return 1;
    var mult = 1;
    if (loc.type === "commercial" || loc.type === "institutional") mult += 0.25;
    if (loc.type === "corporate" || locKey === "techPark") mult += 0.2;
    if (loc.type === "industrial") mult -= 0.12;
    if (loc.type === "residential") mult -= 0.05;
    if (locKey === "slum") mult -= 0.08;
    if (locKey === "suburb") mult -= 0.18;
    if (locKey === "bank" || locKey === "gov_office" || locKey === "hospital")
      mult += 0.3;
    if (loc.footfall) {
      mult += Math.max(-0.1, Math.min(0.2, (loc.footfall - 1) * 0.12));
    }
    return Math.max(0.65, Math.min(1.6, mult));
  }

  function getEffectiveCatchProb(action, locKey) {
    return Math.max(
      0.05,
      Math.min(0.8, action.catchProb * getLocationLawRiskMultiplier(locKey)),
    );
  }

  // ====== 追加违法行为行动卡片 ======
  function addIllegalActions(state, actions) {
    if (state.player.phase !== "street") return;
    var loc = state.trade && state.trade.currentLocation;
    var day = state.player.day || 0;
    var flags = state.flags || (state.flags = {});
    // 拘留期间不能做违法
    if (flags._inJailUntil && day < flags._inJailUntil) return;

    ILLEGAL_ACTIONS.forEach(function (a) {
      if (a.location && a.location !== loc) return;
      var catchProb = getEffectiveCatchProb(a, loc);
      actions.push({
        id: a.id,
        name: a.name,
        desc:
          a.desc +
          "（道德-" +
          Math.abs(a.moralityDelta) +
          "，被抓率" +
          Math.round(catchProb * 100) +
          "%）",
        icon: a.icon,
        apCost: a.apCost,
        handler: function () {
          _executeIllegalAction(state, a, catchProb);
        },
      });
    });
  }

  // ====== 执行违法行为（内部）======
  function _executeIllegalAction(state, action, effectiveCatchProb) {
    var day = state.player.day || 0;
    // 判定是否被抓
    var caught = Math.random() < (effectiveCatchProb || action.catchProb);
    if (caught) {
      // 被抓：拘留+罚款+道德扣
      var p = action.penalty;
      if (p.jailDays > 0) {
        state.flags = state.flags || {};
        state.flags._inJailUntil = day + p.jailDays;
        StateManager.addMessage(
          "🚔 你被警察当场抓获！拘留 " +
            p.jailDays +
            " 天，罚款 ¥" +
            p.fine +
            "。" +
            "出来后状态全线崩溃，回去休息几天。",
          "error",
        );
      } else {
        StateManager.addMessage(
          "🚔 你被扫黄抓了！罚款 ¥" + p.fine + "。",
          "error",
        );
      }
      // 罚款（不够则扣到 0）
      var fineActual = Math.min(state.resources.cash, p.fine);
      state.resources.cash -= fineActual;
      if (typeof addDailyTransaction === "function" && fineActual > 0) {
        addDailyTransaction(
          state,
          "expense",
          "fine",
          fineActual,
          "违法行为罚款 - " + action.name,
        );
      }
      // 出狱后状态崩溃
      state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 40);
      state.needs.hunger = Math.max(0, (state.needs.hunger || 0) - 30);
      state.needs.hygiene = Math.max(0, (state.needs.hygiene || 0) - 30);
      state.needs.happiness = Math.max(0, (state.needs.happiness || 0) - 20);
      state.status.health = Math.max(20, (state.status.health || 100) - 15);
      // 染病判定
      if (p.diseaseProb && Math.random() < p.diseaseProb) {
        if (typeof addIllness === "function") {
          addIllness(state, "std_suspicion"); // 假设疾病系统支持
        }
        StateManager.addMessage(
          "🦠 你感觉身体不对劲，可能染上了什么...",
          "warning",
        );
      }
      // 道德扣（被抓更狠）
      applyMoralityChange(
        state,
        action.moralityDelta - 5,
        action.id + "_caught",
      );
      // 名气扣
      state.player.fame = Math.max(0, (state.player.fame || 0) - 5);
    } else {
      // 未被抓：拿到奖励
      if (action.rewardType === "happiness") {
        var happy =
          action.rewardRange[0] +
          Math.floor(
            Math.random() * (action.rewardRange[1] - action.rewardRange[0]),
          );
        state.needs.happiness = Math.min(
          100,
          (state.needs.happiness || 0) + happy,
        );
        StateManager.addMessage(
          action.icon +
            " 你" +
            action.name.replace(/^[^\s]+\s/, "") +
            "了，心情+" +
            happy +
            "。但心里有点不安...",
          "info",
        );
      } else {
        var reward =
          action.rewardRange[0] +
          Math.floor(
            Math.random() * (action.rewardRange[1] - action.rewardRange[0]),
          );
        state.resources.cash += reward;
        state.resources.totalEarned =
          (state.resources.totalEarned || 0) + reward;
        if (typeof addDailyTransaction === "function") {
          addDailyTransaction(
            state,
            "income",
            "side_job",
            reward,
            action.name + "所得",
          );
        }
        StateManager.addMessage(
          action.icon +
            " 你" +
            action.name.replace(/^[^\s]+\s/, "") +
            "成功，赚了 ¥" +
            reward +
            "。但心里发虚...",
          "success",
        );
      }
      applyMoralityChange(state, action.moralityDelta, action.id + "_success");
    }
    if (typeof consumeAP === "function") consumeAP(action.apCost);
    if (typeof renderAll === "function") renderAll();
  }

  // ====== 全局挂载 ======
  if (typeof window !== "undefined") {
    window.addIllegalActions = addIllegalActions;
    window.getMoralityLabel = getMoralityLabel;
    window.applyMoralityChange = applyMoralityChange;
    window.checkMoralityEcho = checkMoralityEcho;
    window.ILLEGAL_ACTIONS = ILLEGAL_ACTIONS;
  }
})();

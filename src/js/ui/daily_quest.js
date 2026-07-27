/**
 * 今日目标 + 人生旅程弧系统
 *
 * 解决"不知道干什么"和"没有玩下去的动力"两大留存痛点。
 * 设计参考：Stardew Valley 的任务板（简洁可达成）
 *           BitLife 的人生目标（阶段感）
 *           Papers Please 的信息优先级（最重要的在最前面）
 */
(function () {
  "use strict";

  // ─── 人生阶段定义 ─────────────────────────────────────────────
  var LIFE_STAGES = [
    {
      id: "survival",
      icon: "🌱",
      label: "初来乍到",
      nextDesc: "活过第一周，租个床位睡觉",
    },
    {
      id: "debt",
      icon: "💪",
      label: "站稳脚跟",
      nextDesc: "还清债务，攒到¥5000",
    },
    {
      id: "growth",
      icon: "🚀",
      label: "积累成长",
      nextDesc: "智力≥45，考下证书，进入职场",
    },
    {
      id: "corporate",
      icon: "🏢",
      label: "职场打拼",
      nextDesc: "月薪¥15000+，总资产¥50000",
    },
    {
      id: "advanced",
      icon: "🏆",
      label: "有头有脸",
      nextDesc: "财富自由，书写自己的传奇",
    },
  ];

  function _getLifeStage(state) {
    var p = state.player;
    var r = state.resources || {};
    var cash = (r.cash || 0) + (r.bankBalance || 0);
    var debt = (r.villageDebt || r.debt || 0) + (r.fineDebt || 0) + (r.bankDebt || 0);
    if (p.day <= 7) return "survival";
    if (debt > 0) return "debt";
    if (p.phase === "corporate")
      return cash >= 50000 ? "advanced" : "corporate";
    if ((p.intelligence || 0) >= 40 && p.day > 60) return "growth";
    return "growth";
  }

  function _getStageIdx(stage) {
    for (var i = 0; i < LIFE_STAGES.length; i++) {
      if (LIFE_STAGES[i].id === stage) return i;
    }
    return 0;
  }

  // 动态生成下一阶段提示文案（不同剧本/状态下文案不同）
  function _dynamicNextDesc(stage, state) {
    var p = state.player || {};
    if (stage.id === "debt") {
      var r = state.resources || {};
      var debt = (r.villageDebt || r.debt || 0) + (r.fineDebt || 0) + (r.bankDebt || 0);
      return debt > 0 ? "还清债务，攒到¥5000" : "攒下¥5000启动资金";
    }
    // 快到职场门槛时，提示玩家智力路线 → techPark
    if (
      stage.id === "growth" &&
      p.phase === "street" &&
      (p.intelligence || 0) >= 35 &&
      (p.intelligence || 0) < 45
    ) {
      return (
        "智力 " +
        (p.intelligence || 0) +
        " / 45 —— 再提升 " +
        (45 - (p.intelligence || 0)) +
        " 点就能去科技园应聘职场！前往培训中心自学"
      );
    }
    if (
      stage.id === "growth" &&
      p.phase === "street" &&
      (p.intelligence || 0) >= 45
    ) {
      return "智力已达 45，去科技园应聘互联网公司开启职场人生！";
    }

    // ─── 全剧本专属引导（v3.1 §四 峰终 + §五 留存）──────────────
    var scenarioId = state.flags && state.flags._scenarioId;
    var day = p.day || 1;
    var cash = (state.resources && state.resources.cash) || 0;
    if (stage.id === "growth" && p.phase === "street") {
      // 城市务工者 / 外来打工者：现金≥2000 仍租房引导（禀赋效应前置 — 有积蓄更珍惜住所）
      if (
        (scenarioId === "classic" || scenarioId === "foreign_worker") &&
        cash >= 2000
      ) {
        return (
          "🎯 现金已满¥2000——去租房中介看看，露宿街头生活质量太低！再撑 " +
          Math.max(1, 30 - day) +
          " 天就能签约"
        );
      }
      // 下岗再就业：再就业引导（损失厌恶 — 强调每待业一天都在损失工龄）
      if (scenarioId === "laid_off") {
        return (
          "🎯 失业 " +
          day +
          " 天了——去社区服务中心登记再就业培训，每天损失 ¥200+ 潜在收入"
        );
      }
      // 小镇做题家：培训/考证引导（禀赋效应 — 技能是你一辈子带不走的资本）
      if (scenarioId === "small_town_grinder") {
        return (
          "🎯 你的智力比 80% 乘客都高 —— 去培训中心自学，技能考到证书就是一辈子资本！再考 " +
          Math.max(1, 90 - day) +
          " 天拿第一证"
        );
      }
      // 二代创业者：家族资源引导（禀赋效应 — 人脉是你父辈留下的隐形资产）
      if (scenarioId === "second_gen") {
        return "🎯 家族积累是你的起跑线 —— 去认识父亲老同事，人脉关系能在创业时省 ¥50k 启动金";
      }
      // 中年危机：技能重塑引导（损失厌恶 — 不学就被年轻人淘汰）
      if (scenarioId === "midlife_crisis") {
        return "🎯 职场新人月薪 ¥8k 你的 ¥12k，技能不更新 5 年内被替代！立即报名夜校";
      }
      // 应届生：考证/培训入口（禀赋效应 — 每一本证书都让你离 offer 更近一步）
      if (scenarioId === "fresh_grad") {
        return (
          "🎯 毕业生起薪 ¥4500 起点太低——考一本职业资格证起薪能涨 ¥2000！再拼 " +
          Math.max(1, 60 - day) +
          " 天"
        );
      }
    }
    return stage.nextDesc;
  }

  // ─── 目标检查函数 ──────────────────────────────────────────────
  function _checkQuest(q, state) {
    var r = state.resources || {};
    var p = state.player || {};
    var cash = r.cash || 0;
    var bank = r.bankBalance || 0;
    var assets = cash + bank;
    var debt = (r.villageDebt || r.debt || 0) + (r.fineDebt || 0) + (r.bankDebt || 0);
    var rels = state.relationships || {};
    // [全系统自洽修复] 域F 修复:state.certs 为死字段(全库无写入点)，真实字段为 state.certificates 数组(main.js push cert.id)——原 certGte 目标永久无法完成
    var certs = state.certificates || [];

    switch (q.type) {
      case "cashGte":
        return cash >= q.t;
      case "assetsGte":
        return assets >= q.t;
      case "debtLte":
        return debt <= q.t;
      case "noDebt":
        return debt === 0;
      case "statGte":
        return (p[q.k] || 0) >= q.t;
      case "bankGte":
        return bank >= q.t;
      case "housingGte":
        return ((state.housing && state.housing.tier) || 0) >= q.t;
      case "corporate":
        return p.phase === "corporate";
      case "certGte": {
        // [全系统自洽修复] 域F 修复:certificates 为数组，直接取 length
        return certs.length >= q.t;
      }
      case "npcGte": {
        return Object.keys(rels).some(function (k) {
          return rels[k] && (rels[k].affinity || 0) >= q.t;
        });
      }
      case "npcMet": {
        var met = Object.keys(rels).filter(function (k) {
          return rels[k] && rels[k].met;
        }).length;
        return met >= q.t;
      }
      case "dayGte":
        return (p.day || 1) >= q.t;
      case "careerJobGte": {
        var job = state.career && state.career.currentJob;
        return job && (job.workDays || 0) >= q.t;
      }
      case "salaryGte": {
        var job2 = state.career && state.career.currentJob;
        return job2 && (job2.salary || 0) >= q.t;
      }
      case "corpRankGte": {
        var rank = (state.corporate && state.corporate.rank) || "";
        var rankMap = { P5: 5, P6: 6, P7: 7, P8: 8, P9: 9, P10: 10 };
        return (rankMap[rank] || 0) >= q.t;
      }
      // [全系统自洽修复] 域G 联动增强: 情绪状态目标检查
      case "emotionGte": {
        var _curEmo = state.status && state.status.emotionalState;
        if (!_curEmo) return false;
        if (q.t === "happy") return _curEmo === "happy" || _curEmo === "elated";
        if (q.t === "elated") return _curEmo === "elated";
        return false;
      }
    }
    return false;
  }

  // ─── 按阶段生成目标池 ──────────────────────────────────────────
  function _buildPool(state) {
    var p = state.player;
    var r = state.resources || {};
    var cash = r.cash || 0;
    var bank = r.bankBalance || 0;
    var assets = cash + bank;
    var debt = (r.villageDebt || r.debt || 0) + (r.fineDebt || 0) + (r.bankDebt || 0);
    var intel = p.intelligence || 0;
    var day = p.day;
    var housing = (state.housing && state.housing.tier) || 0;
    var rels = state.relationships || {};
    // [全系统自洽修复] 域F 修复:state.certs 死字段→state.certificates 数组；原 certCount 恒0 致「考下第一张证书」目标反复推入且永不完成
    var certs = state.certificates || [];
    var certCount = certs.length;
    var metNpcs = Object.keys(rels).filter(function (k) {
      return rels[k] && rels[k].met;
    }).length;
    var stage = _getLifeStage(state);
    var pool = [];

    // ── 生存期（前7天）──
    if (stage === "survival" || day <= 7) {
      if (cash < 200)
        pool.push({
          id: "s_cash200",
          icon: "💰",
          text: "手头现金达¥200",
          type: "cashGte",
          t: 200,
        });
      if (cash < 100)
        pool.push({
          id: "s_cash100",
          icon: "💵",
          text: "先赚到¥100再说",
          type: "cashGte",
          t: 100,
        });
      if (housing < 1)
        pool.push({
          id: "s_bed",
          icon: "🛏️",
          text: "租个床位睡个好觉",
          type: "housingGte",
          t: 1,
        });
      pool.push({
        id: "s_day3",
        icon: "🌙",
        text: "在城市活过3天",
        type: "dayGte",
        t: 3,
      });
      pool.push({
        id: "s_assets300",
        icon: "🪙",
        text: "总资产达¥300",
        type: "assetsGte",
        t: 300,
      });
    }

    // ── 还债期 ──
    if (debt > 0) {
      if (debt > 3000)
        pool.push({
          id: "d_repay3k",
          icon: "🏦",
          text: "债务降到¥3000以内",
          type: "debtLte",
          t: 3000,
        });
      else if (debt > 1000)
        pool.push({
          id: "d_repay1k",
          icon: "🏦",
          text: "债务降到¥1000以内",
          type: "debtLte",
          t: 1000,
        });
      else
        pool.push({
          id: "d_clear",
          icon: "🎉",
          text: "还清全部债务！一身轻松",
          type: "noDebt",
          t: 0,
        });
      if (assets < 1000)
        pool.push({
          id: "d_1k",
          icon: "💎",
          text: "总资产存到¥1000",
          type: "assetsGte",
          t: 1000,
        });
      if (assets < 3000)
        pool.push({
          id: "d_3k",
          icon: "💎",
          text: "总资产存到¥3000",
          type: "assetsGte",
          t: 3000,
        });
      if (bank < 500)
        pool.push({
          id: "d_bank",
          icon: "🏦",
          text: "银行存款达¥500",
          type: "bankGte",
          t: 500,
        });
    }

    // ── 成长期（街头，无债）──
    if (stage === "growth" || (p.phase === "street" && debt === 0)) {
      if (intel < 30)
        pool.push({
          id: "g_intel30",
          icon: "🧠",
          text: "智力提升到30（去夜校学习）",
          type: "statGte",
          k: "intelligence",
          t: 30,
        });
      if (intel >= 30 && intel < 45)
        pool.push({
          id: "g_intel45",
          icon: "🧠",
          text: "智力达到45（职场入门线！）",
          type: "statGte",
          k: "intelligence",
          t: 45,
        });
      if (assets < 5000)
        pool.push({
          id: "g_5k",
          icon: "🏦",
          text: "总资产达¥5000",
          type: "assetsGte",
          t: 5000,
        });
      if (assets < 10000)
        pool.push({
          id: "g_10k",
          icon: "💎",
          text: "总资产达¥10000",
          type: "assetsGte",
          t: 10000,
        });
      if (certCount < 1)
        pool.push({
          id: "g_cert1",
          icon: "📜",
          text: "考下第一张证书",
          type: "certGte",
          t: 1,
        });
      if (metNpcs < 3)
        pool.push({
          id: "g_npc3",
          icon: "🤝",
          text: "认识3个以上朋友",
          type: "npcMet",
          t: 3,
        });
      if (housing < 2)
        pool.push({
          id: "g_housing2",
          icon: "🏠",
          text: "搬进单间住（升级住所）",
          type: "housingGte",
          t: 2,
        });
      if (intel >= 40)
        pool.push({
          id: "g_apply",
          icon: "💼",
          text: "去科技园/职业中心应聘",
          type: "corporate",
          t: 0,
        });
    }

    // ── 职场期 ──
    if (p.phase === "corporate") {
      var job = state.career && state.career.currentJob;
      var salary = job ? job.salary || 0 : 0;
      var workDays = job ? job.workDays || 0 : 0;
      var rank = (state.corporate && state.corporate.rank) || "";
      var rankMap = { P5: 5, P6: 6, P7: 7, P8: 8, P9: 9, P10: 10 };
      var rankNum = rankMap[rank] || 0;

      if (salary > 0 && salary < 12000)
        pool.push({
          id: "c_sal12k",
          icon: "💰",
          text: "月薪升到¥12000",
          type: "salaryGte",
          t: 12000,
        });
      if (salary >= 12000 && salary < 20000)
        pool.push({
          id: "c_sal20k",
          icon: "💰",
          text: "月薪升到¥20000",
          type: "salaryGte",
          t: 20000,
        });
      if (salary >= 20000 && salary < 30000)
        pool.push({
          id: "c_sal30k",
          icon: "💰",
          text: "月薪升到¥30000",
          type: "salaryGte",
          t: 30000,
        });
      if (workDays < 365)
        pool.push({
          id: "c_yr1",
          icon: "📅",
          text: "在岗坚持满1年",
          type: "careerJobGte",
          t: 365,
        });
      if (assets < 30000)
        pool.push({
          id: "c_30k",
          icon: "💎",
          text: "总资产达¥30000",
          type: "assetsGte",
          t: 30000,
        });
      if (assets < 80000)
        pool.push({
          id: "c_80k",
          icon: "💎",
          text: "总资产达¥80000",
          type: "assetsGte",
          t: 80000,
        });
      if (rankNum > 0 && rankNum < 7)
        pool.push({
          id: "c_p7",
          icon: "🏆",
          text: "晋升到P7（团队骨干分水岭）",
          type: "corpRankGte",
          t: 7,
        });
      if (certCount < 2)
        pool.push({
          id: "c_cert2",
          icon: "📜",
          text: "拥有2张以上证书",
          type: "certGte",
          t: 2,
        });
      pool.push({
        id: "c_npc60",
        icon: "❤️",
        text: "某位朋友好感度达到60",
        type: "npcGte",
        t: 60,
      });
    }

    // ── 有头有脸（高级）──
    if (stage === "advanced") {
      if (assets < 200000)
        pool.push({
          id: "a_200k",
          icon: "🏆",
          text: "总资产达¥200000",
          type: "assetsGte",
          t: 200000,
        });
      pool.push({
        id: "a_npc80",
        icon: "❤️",
        text: "某位朋友好感度达到80",
        type: "npcGte",
        t: 80,
      });
      pool.push({
        id: "a_cert3",
        icon: "📜",
        text: "拥有3张以上证书",
        type: "certGte",
        t: 3,
      });
      if (assets >= 200000)
        pool.push({
          id: "a_500k",
          icon: "💎",
          text: "总资产达¥500000",
          type: "assetsGte",
          t: 500000,
        });
    }

    // [全系统自洽修复] 域G 联动增强: 情绪状态每日目标（G→F，引导玩家关注情绪管理）
    if (state.status && state.status.emotionalState) {
      var _emo = state.status.emotionalState;
      if (_emo === "depressed" || _emo === "sad") {
        pool.push({ id: "e_cheerup", icon: "😊", text: "心情好起来（去娱乐/找朋友聊天）", type: "emotionGte", t: "happy" });
      } else if (_emo === "happy") {
        pool.push({ id: "e_keep_happy", icon: "😊", text: "保持好心情", type: "emotionGte", t: "happy" });
      } else if (_emo === "stable") {
        pool.push({ id: "e_elated", icon: "🌟", text: "争取达到极佳状态", type: "emotionGte", t: "elated" });
      }
    }

    // ── 保底（池太少时补充通用目标）──
    if (pool.length < 3) {
      pool.push({
        id: "u_npc50",
        icon: "❤️",
        text: "某位朋友好感度达到50",
        type: "npcGte",
        t: 50,
      });
      if (certCount < 1)
        pool.push({
          id: "u_cert",
          icon: "📜",
          text: "考下一张证书",
          type: "certGte",
          t: 1,
        });
      pool.push({
        id: "u_housing3",
        icon: "🏠",
        text: "住所升级到独立公寓",
        type: "housingGte",
        t: 3,
      });
    }

    return pool;
  }

  // ─── 每日目标生成（缓存到 state.flags._dailyQuests）────────────
  function generateDailyQuests(state) {
    var day = state.player.day;
    var stored = state.flags && state.flags._dailyQuests;
    if (
      stored &&
      stored.day === day &&
      stored.quests &&
      stored.quests.length > 0
    ) {
      return stored.quests;
    }
    var pool = _buildPool(state);
    // 优先选未完成的目标（最多3个）
    var incomplete = pool.filter(function (q) {
      return !_checkQuest(q, state);
    });
    var picked = (incomplete.length >= 3 ? incomplete : pool).slice(0, 3);
    if (!state.flags) state.flags = {};
    state.flags._dailyQuests = { day: day, quests: picked };
    return picked;
  }

  // ─── 渲染：今日目标卡 ──────────────────────────────────────────
  function renderDailyQuestCard(state, parent) {
    if (!state || !state.player) return;
    var quests = generateDailyQuests(state);
    if (!quests || quests.length === 0) return;

    var doneCount = quests.filter(function (q) {
      return _checkQuest(q, state);
    }).length;
    var allDone = doneCount === quests.length;

    var card = document.createElement("div");
    card.id = "daily-quest-card";
    card.style.cssText = [
      "margin-bottom:12px;",
      "padding:10px 12px;",
      "background:linear-gradient(135deg,rgba(102,126,234,0.07),rgba(74,158,92,0.05));",
      "border:1px solid rgba(102,126,234,0.22);",
      "border-radius:10px;",
    ].join("");

    // 标题行
    var hdr = document.createElement("div");
    hdr.style.cssText =
      "display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;";
    var hdrLeft = document.createElement("span");
    hdrLeft.style.cssText =
      "font-size:11px;font-weight:700;color:var(--accent);letter-spacing:0.5px;";
    hdrLeft.textContent = "🎯 当前目标";
    var hdrRight = document.createElement("span");
    hdrRight.style.cssText = "font-size:10px;color:var(--text-muted);";
    hdrRight.textContent = doneCount + "/" + quests.length + " 达成";
    hdr.appendChild(hdrLeft);
    hdr.appendChild(hdrRight);
    card.appendChild(hdr);

    // === C→F 联动: 职场进度条（有工作时显示）===
    var _job = state.career && state.career.currentJob;
    if (_job) {
      var _pathData = typeof CAREER_PATHS !== "undefined" ? CAREER_PATHS[_job.path] : null;
      var _nextLevel = typeof getNextCareerLevel === "function" ? getNextCareerLevel(_job.path, _job.levelId) : null;
      if (_nextLevel) {
        var _progress = document.createElement("div");
        _progress.style.cssText = "margin-bottom:6px;padding:5px 8px;background:rgba(74,158,92,0.06);border-radius:6px;font-size:10px;color:var(--text-secondary);";
        _progress.innerHTML =
          "⬆️ " + (_pathData ? _pathData.icon + " " : "") + "下一级：" + _nextLevel.name +
          " ¥" + (_nextLevel.salary || 0).toLocaleString() + "/月" +
          " · 在职" + (_job.workDays || 0) + "天";
        card.appendChild(_progress);
      }
    }

    // === D→F 联动: 社交提醒（有好感度接近里程碑的NPC时显示）===
    if (state.relationships && typeof NPCS !== "undefined") {
      var _closeToTarget = null;
      var _bestAff = 0;
      for (var _nid in state.relationships) {
        var _rel = state.relationships[_nid];
        if (!_rel || !_rel.met) continue;
        var _aff = _rel.affinity || 0;
        if (_aff >= 30 && _aff < 40 && _aff > _bestAff) {
          _closeToTarget = { id: _nid, next: 40, cur: _aff };
          _bestAff = _aff;
        } else if (_aff >= 60 && _aff < 70 && _aff > _bestAff) {
          _closeToTarget = { id: _nid, next: 70, cur: _aff };
          _bestAff = _aff;
        }
      }
      if (_closeToTarget) {
        var _npc = NPCS.find(function (n) { return n.id === _closeToTarget.id; });
        if (_npc) {
          var _socialTip = document.createElement("div");
          _socialTip.style.cssText = "margin-bottom:6px;padding:5px 8px;background:rgba(196,154,58,0.06);border-radius:6px;font-size:10px;color:var(--text-secondary);";
          _socialTip.innerHTML = "💬 " + (_npc.icon || "👤") + " " + (_npc.name || _npc.id) + " 好感" + _closeToTarget.cur + "/" + _closeToTarget.next + "，再聊聊天就到下一阶了";
          card.appendChild(_socialTip);
        }
      }
    }

    // === E→F 联动: 投资快照（有持仓时显示市场概况）===
    var _inv = state.investment;
    if (_inv) {
      var _stockCount = (_inv.stockHoldings || []).length;
      var _propCount = (_inv.properties || []).length;
      var _fundCount = (_inv.mutualFunds || []).length;
      if (_stockCount > 0 || _propCount > 0 || _fundCount > 0) {
        var _invTip = document.createElement("div");
        _invTip.style.cssText = "margin-bottom:6px;padding:5px 8px;background:rgba(99,179,237,0.06);border-radius:6px;font-size:10px;color:var(--text-secondary);";
        var _parts = [];
        if (_stockCount > 0) _parts.push("📈 股票 " + _stockCount + "支");
        if (_fundCount > 0) _parts.push("📊 基金 " + _fundCount + "支");
        if (_propCount > 0) _parts.push("🏠 房产 " + _propCount + "处");
        _invTip.innerHTML = "💰 投资组合：" + _parts.join(" · ");
        card.appendChild(_invTip);
      }
    }

    // === G→F 联动: 天气简报+出行建议 ===
    if (state.weather && state.weather.current) {
      var _w = state.weather.current;
      var _weatherIcons = { sunny: "☀️", cloudy: "⛅", rainy: "🌧️", stormy: "⛈️", snowy: "❄️", foggy: "🌫️", hot: "🌞", cold_snap: "🥶", heatwave: "🔥", heavy_rain: "🌊", plum_rain: "🌦️" };
      var _weatherNames = { sunny: "晴", cloudy: "多云", rainy: "雨", stormy: "暴风雨", snowy: "雪", foggy: "雾", hot: "热", cold_snap: "寒潮", heatwave: "酷暑", heavy_rain: "暴雨", plum_rain: "梅雨" };
      var _wName = _weatherNames[_w] || _w;
      var _wIcon = _weatherIcons[_w] || "🌤️";
      var _weatherTip = document.createElement("div");
      _weatherTip.style.cssText = "margin-bottom:6px;padding:4px 8px;background:rgba(99,179,237,0.05);border-radius:6px;font-size:10px;color:var(--text-muted);";
      var _wd = typeof getWeatherWorkDesc === "function" ? getWeatherWorkDesc(state) : "";
      _weatherTip.textContent = _wIcon + " " + _wName + (_wd ? " · " + _wd : "");
      card.appendChild(_weatherTip);
    }
    // === G→F 联动: 时间/行动力状态 ===
    var _apPct = (state.player.actionPoints || 0) / (state.player.maxActionPoints || 100);
    var _timeSlotIcons = { morning: "🌅", afternoon: "☀️", evening: "🌆" };
    var _timeSlotNames = { morning: "上午", afternoon: "下午", evening: "傍晚" };
    var _tsIcon = _timeSlotIcons[state.player.timeSlot] || "⏰";
    var _tsName = _timeSlotNames[state.player.timeSlot] || state.player.timeSlot || "白天";
    if (state.player.actionPoints !== undefined) {
      var _apTip = document.createElement("div");
      _apTip.style.cssText = "margin-bottom:6px;padding:4px 8px;background:rgba(102,126,234,0.05);border-radius:6px;font-size:10px;color:var(--text-muted);";
      _apTip.textContent = _tsIcon + " " + _tsName + " · ⚡" + state.player.actionPoints + "/" + (state.player.maxActionPoints || 100);
      card.appendChild(_apTip);
    }

    // 目标列表
    quests.forEach(function (q, i) {
      var done = _checkQuest(q, state);
      var row = document.createElement("div");
      row.style.cssText = [
        "display:flex;align-items:center;gap:8px;",
        "padding:4px 0;",
        i < quests.length - 1
          ? "border-bottom:1px solid rgba(255,255,255,0.04);"
          : "",
        "font-size:12px;",
      ].join("");

      var icon = document.createElement("span");
      icon.style.cssText = "flex-shrink:0;font-size:13px;";
      icon.textContent = done ? "✅" : q.icon;

      var txt = document.createElement("span");
      txt.style.cssText = done
        ? "color:var(--text-muted);text-decoration:line-through;"
        : "color:var(--text-primary);";
      txt.textContent = q.text;

      row.appendChild(icon);
      row.appendChild(txt);
      card.appendChild(row);
    });

    // [全系统自洽修复] 域G 联动增强: 全达成奖励（G→F，激励玩家完成目标）
    if (allDone) {
      var celebrate = document.createElement("div");
      celebrate.style.cssText =
        "margin-top:7px;font-size:11px;color:var(--success);font-weight:600;";
      // 根据当前阶段给出更具体的引导
      var _stageAdvice = "";
      var _stage = _getLifeStage(state);
      if (_stage === "survival") {
        var _remaining = 7 - (state.player.day || 1);
        _stageAdvice = "第8天进入下一阶段，还有" + Math.max(0, _remaining) + "天，继续赚钱攒钱！";
      } else if (_stage === "debt") {
        _stageAdvice = "还清债务进入积累期，去培训中心提升智力！";
      } else if (_stage === "growth") {
        _stageAdvice = "智力达45后去科技园应聘，开启职场人生！";
      } else if (_stage === "corporate") {
        _stageAdvice = "努力晋升，争取月薪¥15000+！";
      } else {
        _stageAdvice = "继续前进，创造你的传奇！";
      }
      celebrate.textContent = "🎉 当前目标全部达成！" + _stageAdvice;
      card.appendChild(celebrate);
      // [全系统自洽修复] 域F 修复: 每日目标奖金改为按天发放（原flag终身只触发一次，导致后续天数有庆祝无奖励）
      if (!state.flags) state.flags = {};
	      if (state.flags._dailyQuestRewardCollectedDay !== state.player.day) {
        state.flags._dailyQuestRewardCollectedDay = state.player.day;
        var reward = 50 + quests.length * 10;
        state.resources.cash = (state.resources.cash || 0) + reward;
        if (typeof addDailyTransaction === "function") {
          addDailyTransaction(state, "income", "event_reward", reward, "每日目标奖金");
        }
        var rewardLine = document.createElement("div");
        rewardLine.style.cssText = "margin-top:3px;font-size:11px;color:var(--accent);";
        rewardLine.textContent = "💰 目标奖金 +¥" + reward;
        card.appendChild(rewardLine);
      }
    }

    // [全系统自洽修复] 域F联动: 每日目标完成连续天数追踪 (F→G 峰终定律·损失厌恶留存)
    // 每天首次渲染时更新连续记录: 全达成+1, 否则重置为0
    var _today = state.player.day;
    if (state.flags._questStreakUpdatedDay !== _today) {
      state.flags._questStreakUpdatedDay = _today;
      if (allDone) {
        state.flags._questStreak = (state.flags._questStreak || 0) + 1;
        // 连续里程碑奖励 (禀赋效应·珍惜记录)
        var _qs = state.flags._questStreak;
        if (_qs === 7 || _qs === 30 || _qs === 100) {
          var _bonus = _qs === 100 ? 5000 : _qs === 30 ? 1000 : 200;
          state.resources.cash = (state.resources.cash || 0) + _bonus;
          if (typeof StateManager !== "undefined" && StateManager.addMessage) {
            StateManager.addMessage(
              "🔥 连续" + _qs + "天完成所有目标！奖金 ¥" + _bonus,
              "success",
            );
          }
        }
      } else {
        state.flags._questStreak = 0;
      }
    }

    parent.appendChild(card);
  }

  // ─── 渲染：人生旅程弧 ─────────────────────────────────────────
  function renderLifeArcStrip(state, parent) {
    if (!state) return;
    var stage = _getLifeStage(state);
    var idx = _getStageIdx(stage);
    var cur = LIFE_STAGES[idx];
    var next = LIFE_STAGES[idx + 1];

    var wrap = document.createElement("div");
    wrap.id = "life-arc-wrap";
    wrap.style.cssText = "margin-bottom:8px;";

    // 阶段点阵
    var strip = document.createElement("div");
    strip.style.cssText = [
      "display:flex;align-items:center;gap:4px;flex-wrap:nowrap;",
      "padding:5px 10px;",
      "background:rgba(102,126,234,0.05);",
      "border-radius:8px;font-size:11px;",
      "overflow-x:auto;-webkit-overflow-scrolling:touch;",
    ].join("");

    LIFE_STAGES.forEach(function (s, i) {
      var isPast = i < idx;
      var isCur = i === idx;

      var dot = document.createElement("span");
      dot.style.cssText = [
        "white-space:nowrap;padding:2px 7px;border-radius:10px;flex-shrink:0;",
        isCur
          ? "background:var(--accent);color:#fff;font-weight:700;font-size:11px;"
          : isPast
            ? "color:var(--success);opacity:0.75;font-size:11px;"
            : "color:var(--text-muted);opacity:0.35;font-size:11px;",
      ].join("");
      dot.textContent = s.icon + " " + s.label;
      if (isCur) dot.dataset.stageCur = "1";
      strip.appendChild(dot);

      if (i < LIFE_STAGES.length - 1) {
        var arrow = document.createElement("span");
        arrow.style.cssText =
          "color:var(--text-muted);opacity:0.25;font-size:9px;flex-shrink:0;";
        arrow.textContent = "›";
        strip.appendChild(arrow);
      }
    });
    wrap.appendChild(strip);

    // 下一阶段提示（仅当还没到最后阶段）
    if (next) {
      var hint = document.createElement("div");
      hint.style.cssText =
        "font-size:10px;color:var(--text-secondary);padding:3px 4px 0;line-height:1.4;";
      hint.textContent =
        "▸ 下一阶段「" +
        next.icon +
        " " +
        next.label +
        "」：" +
        _dynamicNextDesc(next, state);
      wrap.appendChild(hint);
    }

    parent.appendChild(wrap);
  }

  // ─── 全局挂载 ─────────────────────────────────────────────────
  if (typeof window !== "undefined") {
    window.generateDailyQuests = generateDailyQuests;
    window.renderDailyQuestCard = renderDailyQuestCard;
    window.renderLifeArcStrip = renderLifeArcStrip;
  }
})();
// [R110] 域F 联动增强
// [R182] 域F 联动增强
// [R254] 域F
// [R350] 域F
// [R422] 域F
// [R494] 域F

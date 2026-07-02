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
    var debt = (r.villageDebt || r.debt || 0) + (r.bankDebt || 0);
    if (p.day <= 7) return "survival";
    if (debt > 0) return "debt";
    if (p.phase === "corporate") return cash >= 50000 ? "advanced" : "corporate";
    if ((p.intelligence || 0) >= 40 && p.day > 60) return "growth";
    return "growth";
  }

  function _getStageIdx(stage) {
    for (var i = 0; i < LIFE_STAGES.length; i++) {
      if (LIFE_STAGES[i].id === stage) return i;
    }
    return 0;
  }

  // ─── 目标检查函数 ──────────────────────────────────────────────
  function _checkQuest(q, state) {
    var r = state.resources || {};
    var p = state.player || {};
    var cash = r.cash || 0;
    var bank = r.bankBalance || 0;
    var assets = cash + bank;
    var debt = (r.villageDebt || r.debt || 0) + (r.bankDebt || 0);
    var rels = state.relationships || {};
    var certs = state.certs || {};

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
        var n = Object.keys(certs).filter(function (k) {
          return certs[k];
        }).length;
        return n >= q.t;
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
    var debt = (r.villageDebt || r.debt || 0) + (r.bankDebt || 0);
    var intel = p.intelligence || 0;
    var day = p.day;
    var housing = (state.housing && state.housing.tier) || 0;
    var rels = state.relationships || {};
    var certs = state.certs || {};
    var certCount = Object.keys(certs).filter(function (k) {
      return certs[k];
    }).length;
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
    if (stored && stored.day === day && stored.quests && stored.quests.length > 0) {
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

    // 全达成庆祝
    if (allDone) {
      var celebrate = document.createElement("div");
      celebrate.style.cssText =
        "margin-top:7px;font-size:11px;color:var(--success);font-weight:600;";
      celebrate.textContent = "🎉 当前目标全部达成！继续前进，等待下一阶段。";
      card.appendChild(celebrate);
    }

    parent.appendChild(card);
  }

  // ─── 渲染：人生旅程弧 ─────────────────────────────────────────
  function renderLifeArcStrip(state, parent) {
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
        "▸ 下一阶段「" + next.icon + " " + next.label + "」：" + next.nextDesc;
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

/**
 * 域C(职业/成长) 联动增强 R635
 * 桥接：
 *   C→F  c635_career_portfolio_ui  职业作品集UI → 消费 state.career+state.skills 数据,
 *     职业→"职场履历可视化"UI回响
 *   C→D  c635_career_peer_recognition  职业同行认可 → 消费 state.career+state.relationships 数据,
 *     职业→"同行敬重"社交回响
 *   C→H  c635_career_entrepreneur_seed  职业创业种子 → 消费 state.career+state.resources 数据,
 *     职业→"职场积累创业"公司回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR635Loaded) return;
  RANDOM_EVENTS._domainCLinkageR635Loaded = true;

  // 辅助：获取已结识NPC列表
  function metNpcsR635(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0 });
    }
    return out;
  }

  var EVENTS = [
    // ================================================================
    // C→F: 职业作品集UI — 职场履历回顾
    // ================================================================
    {
      id: "c635_career_portfolio_ui",
      phase: "street",
      _isChainEvent: false,
      icon: "📋",
      title: "职场履历",
      triggers: { minDay: 10 },
      text: function (st) {
        var career = st.career || {};
        var job = career.currentJob;
        var history = career.history || [];
        if (!job && history.length === 0) {
          return "你还没有职场履历。找一份固定工作，开始积累你的职业经历吧。" +
            "每一份工作都是人生履历上的一笔。";
        }
        var totalWorkDays = 0;
        if (job) totalWorkDays += job.workDays || 0;
        for (var hi = 0; hi < history.length; hi++) {
          totalWorkDays += history[hi].workDays || 0;
        }
        var pathName = job ? (typeof getCareerPathLabel === "function" ? getCareerPathLabel(job.path) : job.path) : "暂无";
        var salary = job ? (job.salary || 0) : 0;
        var totalJobs = history.length + (job ? 1 : 0);

        if (totalWorkDays >= 365) {
          return "你的职场履历已有一年以上的积累：在职" + totalWorkDays + "天，历经" + totalJobs + "个岗位。" +
            "当前「" + pathName + "」，月薪¥" + salary.toLocaleString() + "。" +
            "一年多的职场历练让你从新手变成了老手，是时候考虑更大的职业目标了。";
        }
        return "你的职场履历：在职" + totalWorkDays + "天，历经" + totalJobs + "个岗位。" +
          "当前「" + pathName + "」，月薪¥" + salary.toLocaleString() + "。" +
          "每一段经历都在为你的职业生涯添砖加瓦。";
      },
      choices: [
        { text: "📈 查看晋升路线", apply: function(st) {
          if (typeof switchCareerSubTab === "function") switchCareerSubTab("career_jobs");
          StateManager.addMessage("📈 前往「上班族」Tab查看晋升路线", "info");
        }},
        { text: "💪 继续积累", apply: function(st) {
          StateManager.addMessage("💪 继续在当前岗位上积累经验和业绩", "info");
        }},
      ],
      conditions: function (st) {
        return st.career && (st.career.currentJob || (st.career.history && st.career.history.length > 0));
      },
      weight: 1,
    },

    // ================================================================
    // C→D: 职业同行认可 — 职场成就影响社交关系
    // ================================================================
    {
      id: "c635_career_peer_recognition",
      phase: "street",
      _isChainEvent: false,
      icon: "🏆",
      title: "同行认可",
      triggers: { minDay: 20 },
      text: function (st) {
        var npcs = metNpcsR635(st);
        if (npcs.length === 0) return "你还没有结识什么同行朋友。多参加行业活动，认识一些志同道合的人。";
        if (!st.career || !st.career.currentJob) {
          return "你目前没有固定工作，但你的朋友们依然很关心你的职业发展。" +
            "他们觉得以你的能力，一定能找到适合的方向。";
        }
        var job = st.career.currentJob;
        var perf = job.performance || 50;
        var wd = job.workDays || 0;
        var highAff = 0;
        for (var i = 0; i < npcs.length; i++) {
          if (npcs[i].affinity >= 40) highAff++;
        }
        if (perf >= 70 && wd >= 90) {
          return "你在「" + (typeof getCareerPathLabel === "function" ? getCareerPathLabel(job.path) : job.path) + "」的表现有目共睹。" +
            "绩效" + perf + "分，在职" + wd + "天，身边有" + highAff + "位朋友对你的职业发展表示赞赏。" +
            "同行之间的认可，有时候比薪资涨幅更让人有成就感。";
        }
        return "你在职场上稳步前进，朋友们都看在眼里。" +
          "继续提升业绩和技能，同行认可度会越来越高。";
      },
      choices: [
        { text: "🤝 维护人脉", apply: function(st) {
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage("🤝 和行业朋友们保持联系，心情+3", "success");
        }},
        { text: "💼 专注工作", apply: function(st) {
          StateManager.addMessage("💼 把精力放在工作上，业绩才是硬道理", "info");
        }},
      ],
      conditions: function (st) {
        var npcs = metNpcsR635(st);
        return npcs.length >= 1;
      },
      weight: 1,
    },

    // ================================================================
    // C→H: 职业创业种子 — 职场积累为创业打基础
    // ================================================================
    {
      id: "c635_career_entrepreneur_seed",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🚀",
      title: "创业种子",
      triggers: { minDay: 30 },
      text: function (st) {
        var career = st.career || {};
        var job = career.currentJob;
        var cap = (typeof ensureCareerCapital === "function") ? ensureCareerCapital(st) : null;
        var industryRes = cap ? Math.round(cap.industryResources || 0) : 0;
        var clientLeads = cap ? Math.round(cap.clientLeads || 0) : 0;
        var cash = st.resources && st.resources.cash || 0;
        var startup = st.startup || {};

        if (startup.status && startup.status !== "none") {
          return "你已经开始了创业之旅。回想当初在职场积累的行业资源（" + industryRes + "点）和客户线索（" + clientLeads + "条），" +
            "都为你的创业打下了坚实的基础。继续加油！";
        }
        if (!job) {
          return "创业需要资本、经验和人脉。建议先找一份工作，在职场中积累行业资源和人脉。" +
            "当你的职业资本足够雄厚时，创业就是水到渠成的事。";
        }
        var wd = job.workDays || 0;
        if (industryRes >= 30 && clientLeads >= 15 && cash >= 30000) {
          return "你在职场积累了" + industryRes + "点行业资源、" + clientLeads + "条客户线索，现金¥" + cash.toLocaleString() + "。" +
            "各项创业条件已经基本成熟——行业资源可以帮你找到靠谱的供应商，客户线索意味着第一批客户，现金则是启动的燃料。" +
            "是时候认真考虑创业的事了。";
        }
        return "你在职场积累了" + industryRes + "点行业资源、" + clientLeads + "条客户线索。" +
          "继续积累，当行业资源≥30、客户线索≥15、现金≥¥30,000时，创业条件就基本成熟了。";
      },
      choices: [
        { text: "🚀 查看创业条件", apply: function(st) {
          if (typeof showStartupRegisterModal === "function") showStartupRegisterModal();
          else StateManager.addMessage("🚀 前往「事业发展」查看创业条件", "info");
        }},
        { text: "💼 继续积累", apply: function(st) {
          StateManager.addMessage("💼 继续在职场中积累经验和资本", "info");
        }},
      ],
      conditions: function (st) {
        return st.career && st.career.currentJob && (st.career.currentJob.workDays || 0) >= 30;
      },
      weight: 1,
    },
  ];

  // 注册事件
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
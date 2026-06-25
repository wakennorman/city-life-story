/**
 * 法律系统（v3.7 Expansion v1）
 *
 * 诉讼/律师/法律纠纷处理
 * - 民事诉讼（合同纠纷/侵权）
 * - 聘请律师（按小时/按案件收费）
 * - 诉讼流程：立案→举证→庭审→判决
 * - 法律风险意识（违法行为的法律后果）
 *
 * 设计参考：真实中国民事诉讼流程 / This War of Mine法律困境 / 模拟人生律师系统
 */

// ====== 案件类型 ======
const LEGAL_CASES = {
  contract_dispute: {
    id: "contract_dispute",
    name: "合同纠纷",
    icon: "📄",
    difficulty: 0.3,
    duration: 15,
    cost: 5000,
    rewardMin: 10000,
    rewardMax: 50000,
    desc: "对方违反合同约定，可通过诉讼索赔违约金。",
  },
  labor_dispute: {
    id: "labor_dispute",
    name: "劳动纠纷",
    icon: "⚖️",
    difficulty: 0.2,
    duration: 10,
    cost: 3000,
    rewardMin: 5000,
    rewardMax: 30000,
    desc: "公司欠薪/违法解除合同，维护劳动者权益。",
  },
  neighborhood_dispute: {
    id: "neighborhood_dispute",
    name: "邻里纠纷",
    icon: "🏠",
    difficulty: 0.1,
    duration: 7,
    cost: 2000,
    rewardMin: 2000,
    rewardMax: 10000,
    desc: "邻里间的物业/噪音/侵权纠纷，适合法律入门。",
  },
  debt_recovery: {
    id: "debt_recovery",
    name: "债务追讨",
    icon: "💰",
    difficulty: 0.25,
    duration: 12,
    cost: 4000,
    rewardMin: 8000,
    rewardMax: 40000,
    desc: "他人欠款不还，通过法律途径追讨。",
  },
};

// ====== 律师等级 ======
const LAWYER_LEVELS = [
  {
    id: "junior",
    name: "初级律师",
    icon: "📚",
    hourly: 200,
    caseFee: 3000,
    successBonus: 0.3,
  },
  {
    id: "mid",
    name: "中级律师",
    icon: "⚖️",
    hourly: 500,
    caseFee: 8000,
    successBonus: 0.4,
  },
  {
    id: "senior",
    name: "高级律师",
    icon: "🏛️",
    hourly: 1000,
    caseFee: 15000,
    successBonus: 0.5,
  },
  {
    id: "partner",
    name: "合伙人律师",
    icon: "👑",
    hourly: 2000,
    caseFee: 30000,
    successBonus: 0.6,
  },
];

// ====== 法律状态初始化 ======
function initLegalState(state) {
  if (!state.legal) {
    state.legal = {
      activeCase: null, // { caseId, lawyerId, daysRemaining, phase: 'filing'|'evidence'|'trial'|'verdict', totalCost, result: null }
      completedCases: [],
      totalLegalSpent: 0,
      totalLegalWon: 0,
      lawyerRetained: null, // 当前聘请的律师
    };
  }
}

// ====== 提起/加入诉讼 ======
function fileLawsuit(state, caseId, lawyerId) {
  initLegalState(state);
  var caseData = LEGAL_CASES[caseId];
  if (!caseData) return { ok: false, msg: "无效的案件类型" };
  if (state.legal.activeCase) return { ok: false, msg: "已有进行中的诉讼" };

  var lawyer =
    LAWYER_LEVELS.find(function (l) {
      return l.id === lawyerId;
    }) || LAWYER_LEVELS[0];
  var totalCost = caseData.cost + lawyer.caseFee;

  if ((state.resources.cash || 0) < totalCost)
    return { ok: false, msg: "现金不足，诉讼费+律师费共需¥" + totalCost };

  state.resources.cash -= totalCost;
  state.legal.totalLegalSpent = (state.legal.totalLegalSpent || 0) + totalCost;
  state.legal.activeCase = {
    caseId: caseId,
    lawyerId: lawyer.id,
    daysRemaining: caseData.duration,
    phase: "filing",
    totalCost: totalCost,
    result: null,
  };
  state.legal.lawyerRetained = lawyer.id;

  return {
    ok: true,
    msg:
      "已提起" +
      caseData.name +
      "，聘请" +
      lawyer.name +
      "，预计" +
      caseData.duration +
      "天有结果。",
  };
}

// ====== 每日法律 tick ======
function tickLegal(state) {
  initLegalState(state);
  var ac = state.legal && state.legal.activeCase;
  if (!ac) return;

  // 诉讼阶段推进
  var totalDays = LEGAL_CASES[ac.caseId] ? LEGAL_CASES[ac.caseId].duration : 15;
  var progress = 1 - ac.daysRemaining / totalDays;

  if (progress < 0.3) ac.phase = "filing";
  else if (progress < 0.6) ac.phase = "evidence";
  else if (progress < 0.9) ac.phase = "trial";
  else ac.phase = "verdict";

  ac.daysRemaining--;

  // 判决
  if (ac.daysRemaining <= 0) {
    var caseData = LEGAL_CASES[ac.caseId];
    var winChance = 0.5;

    if (caseData) {
      var lawyer = LAWYER_LEVELS.find(function (l) {
        return l.id === ac.lawyerId;
      });
      if (lawyer) winChance += lawyer.successBonus * 0.3;
      winChance = Math.min(
        0.95,
        Math.max(0.1, winChance - caseData.difficulty),
      );
    }

    var won = Math.random() < winChance;
    ac.result = won ? "won" : "lost";
    state.legal.completedCases.push({
      caseId: ac.caseId,
      result: ac.result,
      day: state.player.day,
    });

    if (won) {
      var reward = caseData
        ? Math.round(
            caseData.rewardMin +
              Math.random() * (caseData.rewardMax - caseData.rewardMin),
          )
        : 5000;
      state.resources.cash = (state.resources.cash || 0) + reward;
      state.legal.totalLegalWon = (state.legal.totalLegalWon || 0) + reward;
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 10);
      state._lastLegalResult = "胜诉，获得赔偿¥" + reward;
    } else {
      state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 10);
      state._lastLegalResult = "败诉，已支付的诉讼费无法追回。";
    }

    state.legal.activeCase = null;
    state.legal.lawyerRetained = null;
  }
}

// ====== 法律风险检查（与违法行为联动） ======
function checkLegalRisk(state) {
  var risk = 0;
  if (state.flags) {
    if (state.flags._illegalActionCount > 3) risk += 30;
    else if (state.flags._illegalActionCount > 1) risk += 10;
  }
  if (state.stats && state.stats._debtDefaultCount > 0) risk += 15;
  return risk;
}

// ====== 法律摘要 ======
function getLegalSummary(state) {
  initLegalState(state);
  var l = state.legal;
  var lines = [];
  if (l.activeCase) {
    var caseData = LEGAL_CASES[l.activeCase.caseId];
    lines.push(
      "⚖️ 诉讼中：" +
        (caseData ? caseData.name : "未知案件") +
        "（" +
        l.activeCase.phase +
        "阶段，剩余" +
        l.activeCase.daysRemaining +
        "天）",
    );
  }
  if (l.completedCases && l.completedCases.length > 0) {
    var won = l.completedCases.filter(function (c) {
      return c.result === "won";
    }).length;
    lines.push(
      "📋 累计案件：" + l.completedCases.length + "（胜诉" + won + "）",
    );
  }
  if (l.totalLegalSpent > 0)
    lines.push("💰 累计法律支出：¥" + l.totalLegalSpent);
  if (l.totalLegalWon > 0) lines.push("💰 累计获赔：¥" + l.totalLegalWon);
  var risk = checkLegalRisk(state);
  if (risk > 0) lines.push("⚠️ 法律风险：" + risk + "%");
  return lines;
}

function showLegalOfficeModal() {
  if (typeof showModal !== "function") return;
  var state = StateManager.getState();
  initLegalState(state);
  var summary = getLegalSummary(state);
  if (state.legal.activeCase) {
    showModal({
      title: "⚖️ 法律咨询",
      body:
        '<div style="font-size:13px;line-height:1.7;">' +
        summary.join("<br>") +
        "</div>",
      buttons: [{ text: "知道了", cls: "btn-primary" }],
    });
    return;
  }

  var caseOptions = "";
  for (var caseId in LEGAL_CASES) {
    var c = LEGAL_CASES[caseId];
    caseOptions +=
      '<option value="' +
      caseId +
      '">' +
      c.name +
      " · 约¥" +
      c.cost.toLocaleString() +
      " · " +
      c.duration +
      "天</option>";
  }
  var lawyerOptions = LAWYER_LEVELS.map(function (l) {
    return (
      '<option value="' +
      l.id +
      '">' +
      l.name +
      " · ¥" +
      l.caseFee.toLocaleString() +
      "</option>"
    );
  }).join("");
  var body =
    '<div style="font-size:13px;line-height:1.7;">' +
    "<p>在办事大厅旁边的法律服务窗口，可以咨询并提起民事诉讼。</p>" +
    '<label>案件类型</label><select id="legal-case-select" style="width:100%;margin:4px 0 10px;">' +
    caseOptions +
    "</select>" +
    '<label>律师档位</label><select id="legal-lawyer-select" style="width:100%;margin:4px 0 10px;">' +
    lawyerOptions +
    "</select>" +
    '<p style="color:var(--text-secondary);">当前现金：¥' +
    (state.resources.cash || 0).toLocaleString() +
    "</p></div>";

  showModal({
    title: "⚖️ 法律咨询",
    body: body,
    buttons: [
      {
        text: "立案",
        cls: "btn-primary",
        callback: function () {
          var caseEl = document.getElementById("legal-case-select");
          var lawyerEl = document.getElementById("legal-lawyer-select");
          var result = fileLawsuit(
            StateManager.getState(),
            caseEl && caseEl.value,
            lawyerEl && lawyerEl.value,
          );
          StateManager.addMessage(
            result.msg,
            result.ok ? "success" : "warning",
          );
          if (!result.ok) return false;
          if (typeof renderAll === "function") renderAll();
        },
      },
      { text: "再想想", cls: "" },
    ],
  });
}

// ====== 全局挂载 ======
if (typeof window !== "undefined") {
  window.LEGAL_CASES = LEGAL_CASES;
  window.LAWYER_LEVELS = LAWYER_LEVELS;
  window.initLegalState = initLegalState;
  window.fileLawsuit = fileLawsuit;
  window.tickLegal = tickLegal;
  window.checkLegalRisk = checkLegalRisk;
  window.getLegalSummary = getLegalSummary;
  window.showLegalOfficeModal = showLegalOfficeModal;

  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.legal_system = {
    id: "legal_system",
    name: "法律系统",
    icon: "⚖️",
    brief: "民事诉讼+律师聘请——在这个城市，法律是你的武器也可能是你的枷锁。",
    version: "v1",
    related: ["data:illegal_actions"],
    sections: [
      {
        type: "desc",
        content:
          "法律系统允许你通过诉讼解决纠纷。立案→举证→庭审→判决，全程7-30天。",
      },
      {
        type: "table",
        title: "案件类型",
        headers: ["案件", "耗时", "费用", "预期赔偿"],
        rows: [
          ["📄 合同纠纷", "15天", "¥5,000", "¥10K-50K"],
          ["⚖️ 劳动纠纷", "10天", "¥3,000", "¥5K-30K"],
          ["🏠 邻里纠纷", "7天", "¥2,000", "¥2K-10K"],
          ["💰 债务追讨", "12天", "¥4,000", "¥8K-40K"],
        ],
      },
      {
        type: "table",
        title: "律师等级",
        headers: ["律师", "案件费", "胜诉加成"],
        rows: [
          ["📚 初级律师", "¥3,000", "+30%"],
          ["⚖️ 中级律师", "¥8,000", "+40%"],
          ["🏛️ 高级律师", "¥15,000", "+50%"],
          ["👑 合伙人律师", "¥30,000", "+60%"],
        ],
      },
      { type: "tip", content: "违法行为会增加法律风险——出来混，迟早要还的。" },
    ],
  };
}

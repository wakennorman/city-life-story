/**
 * 医疗深度系统（v3.7 Expansion v1）
 *
 * 深化疾病处理：门诊/住院/手术/康复/保险
 * 与现有 illness.js 联动，增加治疗选择和医疗经济消耗
 *
 * 设计参考：《大多数》医疗系统 / This War of Mine伤病机制 / 真实中国医保体系
 */

// ====== 疾病分级 ======
const ILLNESS_GRADES = {
  mild: {
    name: "轻症",
    icon: "🩹",
    treatCost: 50,
    treatDays: 2,
    recoveryDays: 1,
  },
  moderate: {
    name: "中症",
    icon: "🏥",
    treatCost: 500,
    treatDays: 5,
    recoveryDays: 3,
  },
  severe: {
    name: "重症",
    icon: "🚑",
    treatCost: 5000,
    treatDays: 14,
    recoveryDays: 7,
  },
  critical: {
    name: "危重症",
    icon: "💀",
    treatCost: 50000,
    treatDays: 30,
    recoveryDays: 14,
  },
};

// ====== 保险计划 ======
const INSURANCE_PLANS = [
  {
    id: "basic",
    name: "基础医保",
    icon: "🪪",
    monthly: 200,
    coverage: 0.5,
    desc: "覆盖50%医疗费",
  },
  {
    id: "enhanced",
    name: "补充医保",
    icon: "🛡️",
    monthly: 500,
    coverage: 0.7,
    desc: "覆盖70%医疗费",
  },
  {
    id: "premium",
    name: "高端医保",
    icon: "💎",
    monthly: 1500,
    coverage: 0.9,
    desc: "覆盖90%医疗费，含VIP病房",
  },
];

// ====== 初始化医疗状态 ======
function initMedicalState(state) {
  if (!state.medical) {
    state.medical = {
      insurance: null,
      treatment: null, // { type, grade, daysRemaining, cost, hospital }
      hospitalized: false,
      recoveryDays: 0,
      totalMedicalSpent: 0,
    };
  }
}

// ====== 购买保险 ======
function buyMedicalInsurance(state, planId) {
  initMedicalState(state);
  var plan = INSURANCE_PLANS.find(function (p) {
    return p.id === planId;
  });
  if (!plan) return { ok: false, msg: "无效的保险计划" };
  if ((state.resources.cash || 0) < plan.monthly)
    return { ok: false, msg: "现金不足" };
  state.resources.cash -= plan.monthly;
  state.medical.insurance = planId;
  return {
    ok: true,
    msg: "已购买「" + plan.name + "」，每月保费¥" + plan.monthly,
  };
}

// ====== 开始治疗 ======
function startTreatment(state, grade) {
  initMedicalState(state);
  var gradeInfo = ILLNESS_GRADES[grade];
  if (!gradeInfo) return { ok: false, msg: "无效的治疗等级" };
  var cost = gradeInfo.treatCost;
  var coverage = 0;
  if (state.medical && state.medical.insurance) {
    var plan = INSURANCE_PLANS.find(function (p) {
      return p.id === state.medical.insurance;
    });
    if (plan) coverage = plan.coverage;
  }
  var actualCost = Math.round(cost * (1 - coverage));
  if ((state.resources.cash || 0) < actualCost)
    return { ok: false, msg: "现金不足，治疗费需¥" + actualCost };
  state.resources.cash -= actualCost;
  state.medical.totalMedicalSpent =
    (state.medical.totalMedicalSpent || 0) + actualCost;

  if (grade === "mild") {
    // 轻症门诊治疗，减部分AP
    state.ap = Math.max(0, (state.ap || 0) - 20);
    state.status.health = Math.min(100, (state.status.health || 100) + 15);
    return {
      ok: true,
      msg: "去药店买了药，花费¥" + actualCost + "。注意休息。",
    };
  }

  state.medical.treatment = {
    type: "treatment",
    grade: grade,
    daysRemaining: gradeInfo.treatDays,
    cost: actualCost,
  };
  state.medical.hospitalized = grade === "severe" || grade === "critical";
  return {
    ok: true,
    msg:
      (state.medical.hospitalized ? "办理了住院" : "接受门诊治疗") +
      "，花费¥" +
      actualCost +
      "，需要" +
      gradeInfo.treatDays +
      "天治疗期。",
  };
}

// ====== 每日医疗 tick（管线步骤） ======
function tickMedical(state) {
  initMedicalState(state);
  if (!state.medical || !state.medical.treatment) return;

  var tx = state.medical.treatment;
  tx.daysRemaining--;

  // 住院每日消耗
  if (state.medical.hospitalized) {
    var dailyCost = 200;
    if (state.medical.insurance) {
      var plan = INSURANCE_PLANS.find(function (p) {
        return p.id === state.medical.insurance;
      });
      if (plan) dailyCost = Math.round(dailyCost * (1 - plan.coverage));
    }
    state.resources.cash = (state.resources.cash || 0) - dailyCost;
    state.medical.totalMedicalSpent =
      (state.medical.totalMedicalSpent || 0) + dailyCost;
  }

  // 治疗完成
  if (tx.daysRemaining <= 0) {
    var gradeInfo = ILLNESS_GRADES[tx.grade] || ILLNESS_GRADES.mild;
    state.status.health = Math.min(100, (state.status.health || 50) + 20);
    state.medical.recoveryDays = gradeInfo.recoveryDays;
    state.medical.treatment = null;
    state.medical.hospitalized = false;
  }
}

// ====== 康复期处理（每日管线 recovery 步骤调用） ======
function tickRecovery(state) {
  if (!state.medical || !state.medical.recoveryDays) return;
  state.medical.recoveryDays--;
  if (state.medical.recoveryDays <= 0) {
    state.medical.recoveryDays = 0;
  }
}

// ====== 医疗摘要 ======
function getMedicalSummary(state) {
  if (!state.medical) initMedicalState(state);
  var m = state.medical;
  var lines = [];
  if (m.insurance) {
    var plan = INSURANCE_PLANS.find(function (p) {
      return p.id === m.insurance;
    });
    lines.push(
      (plan ? plan.icon : "🪪") + " 保险：" + (plan ? plan.name : "已购买"),
    );
  } else {
    lines.push("⚠️ 未购买医疗保险");
  }
  if (m.treatment) {
    var gi = ILLNESS_GRADES[m.treatment.grade] || null;
    lines.push(
      "🏥 治疗中：" +
        (gi ? gi.name : "治疗") +
        "，剩余" +
        m.treatment.daysRemaining +
        "天",
    );
  }
  if (m.hospitalized)
    lines.push("🛏️ 住院中，每日费用¥" + (m.insurance ? "200(保险后)" : "200"));
  if (m.recoveryDays > 0) lines.push("🌱 康复期：" + m.recoveryDays + "天");
  if (m.totalMedicalSpent > 0)
    lines.push("💰 累计医疗支出：¥" + m.totalMedicalSpent);
  return lines;
}

function showMedicalInsuranceModal() {
  if (typeof showModal !== "function") return;
  var state = StateManager.getState();
  initMedicalState(state);
  var summary = getMedicalSummary(state);
  var body =
    '<div style="font-size:13px;line-height:1.7;">' +
    '<p>医保会在深度治疗和住院费用中自动抵扣，适合长期生存。</p>' +
    '<div style="padding:8px;background:var(--bg-secondary);border-radius:6px;margin-bottom:10px;">' +
    summary.join("<br>") +
    "</div>" +
    '<div style="display:grid;gap:8px;">';
  for (var i = 0; i < INSURANCE_PLANS.length; i++) {
    var p = INSURANCE_PLANS[i];
    body +=
      '<div style="padding:8px;border:1px solid var(--border);border-radius:6px;">' +
      "<strong>" +
      p.icon +
      " " +
      p.name +
      "</strong> · ¥" +
      p.monthly.toLocaleString() +
      " / 次<br><span style=\"color:var(--text-secondary);\">" +
      p.desc +
      "</span></div>";
  }
  body += "</div></div>";

  var buttons = INSURANCE_PLANS.map(function (plan) {
    return {
      text: plan.icon + " " + plan.name,
      cls: "btn-primary",
      callback: function () {
        var result = buyMedicalInsurance(StateManager.getState(), plan.id);
        StateManager.addMessage(result.msg, result.ok ? "success" : "warning");
        if (!result.ok) return false;
        if (typeof renderAll === "function") renderAll();
      },
    };
  });
  buttons.push({ text: "暂不购买", cls: "" });
  showModal({ title: "🪪 医保咨询", body: body, buttons: buttons });
}

// ====== 全局挂载 ======
if (typeof window !== "undefined") {
  window.ILLNESS_GRADES = ILLNESS_GRADES;
  window.INSURANCE_PLANS = INSURANCE_PLANS;
  window.initMedicalState = initMedicalState;
  window.buyMedicalInsurance = buyMedicalInsurance;
  window.startTreatment = startTreatment;
  window.tickMedical = tickMedical;
  window.tickRecovery = tickRecovery;
  window.getMedicalSummary = getMedicalSummary;
  window.showMedicalInsuranceModal = showMedicalInsuranceModal;

  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.medical_system = {
    id: "medical_system",
    name: "医疗系统",
    icon: "🏥",
    brief:
      "轻症门诊、中症住院、重症手术——疾病分级治疗 + 医保报销。健康是1，其他是0。",
    version: "v1",
    related: ["data:diseases"],
    sections: [
      {
        type: "desc",
        content:
          "医疗系统将疾病分为4级，每级有不同的治疗费用和恢复期。购买保险可大幅降低医疗支出。",
      },
      {
        type: "table",
        title: "疾病分级",
        headers: ["分级", "治疗费", "恢复期", "举例"],
        rows: [
          ["🩹 轻症", "¥50", "1-2天", "感冒/擦伤/肠胃不适"],
          ["🏥 中症", "¥500", "3-5天", "肺炎/骨折/阑尾炎"],
          ["🚑 重症", "¥5,000", "7-14天", "心脏病/癌症/中风"],
          ["💀 危重症", "¥50,000", "14-30天", "器官衰竭/严重创伤"],
        ],
      },
      {
        type: "table",
        title: "保险计划",
        headers: ["计划", "月费", "报销比例"],
        rows: [
          ["🪪 基础医保", "¥200", "50%"],
          ["🛡️ 补充医保", "¥500", "70%"],
          ["💎 高端医保", "¥1,500", "90%"],
        ],
      },
      { type: "tip", content: "建议尽早购买医保——一次重病可能掏空积蓄。" },
    ],
  };
}

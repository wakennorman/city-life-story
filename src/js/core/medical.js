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
// v3.1：委托 illness.js::treatIllness 处理每个疾病实例，本函数负责保险折扣+汇总
function startTreatment(state, grade) {
  initMedicalState(state);
  var gradeInfo = ILLNESS_GRADES[grade];
  if (!gradeInfo) return { ok: false, msg: "无效的治疗等级" };

  var illnesses = state.status.illnesses || [];
  if (illnesses.length === 0 && grade === "mild") {
    // 无疾病记录时的轻症门诊：休息+小额花费
    var restCost = Math.round(gradeInfo.treatCost * 0.4);
    if (state.medical && state.medical.insurance) {
      var restPlan = INSURANCE_PLANS.find(function (p) {
        return p.id === state.medical.insurance;
      });
      if (restPlan) restCost = Math.round(restCost * (1 - restPlan.coverage));
    }
    if ((state.resources.cash || 0) < restCost)
      return { ok: false, msg: "现金不足，需¥" + restCost };
    state.resources.cash -= restCost;
    state.medical.totalMedicalSpent =
      (state.medical.totalMedicalSpent || 0) + restCost;
    if (state.player) {
      state.player.actionPoints = Math.max(
        0,
        (state.player.actionPoints || 0) - 3,
      );
    }
    state.status.health = Math.min(100, (state.status.health || 100) + 15);
    return { ok: true, msg: "去药店买了药，花费¥" + restCost + "。注意休息。" };
  }

  // 有疾病记录：按grade选tier，遍历治疗
  var tier = grade === "mild" ? "pharmacy" : "hospital";
  var coverage = 0;
  if (state.medical && state.medical.insurance) {
    var plan = INSURANCE_PLANS.find(function (p) {
      return p.id === state.medical.insurance;
    });
    if (plan) coverage = plan.coverage;
  }
  var careerDiscount = 0;
  if (typeof getCareerMedicalDiscount === "function") {
    careerDiscount = getCareerMedicalDiscount(state);
  }

  // 筛选本轮要治疗的疾病（有对应tier费用的）
  var toTreat = [];
  var totalBaseCost = 0;
  for (var i = 0; i < illnesses.length; i++) {
    var inst = illnesses[i];
    var def = typeof ILLNESSES !== "undefined" ? ILLNESSES[inst.id] : null;
    if (!def || !def.treatCost) continue;
    var baseCost = def.treatCost[tier];
    if (!baseCost && tier === "pharmacy") continue;
    if (!baseCost && tier === "hospital")
      baseCost = def.treatCost.pharmacy || 0;
    if (baseCost <= 0) continue;
    toTreat.push({ id: inst.id, tier: tier, baseCost: baseCost });
    totalBaseCost += baseCost;
  }
  if (toTreat.length === 0) {
    return {
      ok: false,
      msg: "当前没有适合该治疗强度的疾病。换个强度试试。",
    };
  }

  var actualCost = Math.round(
    totalBaseCost * (1 - coverage) * (1 - careerDiscount),
  );
  if ((state.resources.cash || 0) < actualCost)
    return { ok: false, msg: "现金不足，治疗费需¥" + actualCost };

  state.resources.cash -= actualCost;
  state.medical.totalMedicalSpent =
    (state.medical.totalMedicalSpent || 0) + actualCost;

  var curedCount = 0;
  for (var j = 0; j < toTreat.length; j++) {
    var tx2 = toTreat[j];
    // 设置state.currentTreatContext供treatIllness使用
    var before = state.status.illnesses.length;
    treatIllness(tx2.id, tx2.tier);
    var after = state.status.illnesses.length;
    if (tx2.tier === "hospital" && after < before) curedCount++;
  }

  var msg =
    "完成" +
    gradeInfo.name +
    "治疗 ¥" +
    actualCost +
    "（" +
    toTreat.length +
    "项疾病";
  if (coverage > 0) msg += "，医保报销" + Math.round(coverage * 100) + "%";
  msg += "）。";
  return { ok: true, msg: msg };
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
  var illnessCount =
    (state.status && state.status.illnesses && state.status.illnesses.length) ||
    0;
  if (illnessCount > 0) lines.push("🤒 当前疾病：" + illnessCount + " 种");
  if (m.totalMedicalSpent > 0)
    lines.push("💰 累计医疗支出：¥" + m.totalMedicalSpent);
  return lines;
}

function showMedicalTreatmentModal() {
  if (typeof showModal !== "function") return;
  var state = StateManager.getState();
  initMedicalState(state);
  var illnesses = state.status.illnesses || [];
  var body =
    '<div style="font-size:13px;line-height:1.7;">' +
    "<p>根据当前身体状况选择治疗强度。医保会自动抵扣治疗费。</p>" +
    '<div style="padding:8px;background:var(--bg-secondary);border-radius:6px;margin-bottom:10px;">' +
    getMedicalSummary(state).join("<br>");

  // 显示当前疾病明细
  if (illnesses.length > 0) {
    body += "<br><strong>当前疾病明细：</strong>";
    for (var i = 0; i < illnesses.length; i++) {
      var inst = illnesses[i];
      var def = typeof ILLNESSES !== "undefined" ? ILLNESSES[inst.id] : null;
      if (!def) continue;
      var pharCost = (def.treatCost && def.treatCost.pharmacy) || "-";
      var hospCost = (def.treatCost && def.treatCost.hospital) || "-";
      body +=
        "<br>• " +
        (def.icon || "🤒") +
        " " +
        def.name +
        "（药¥" +
        pharCost +
        " / 院¥" +
        hospCost +
        "）";
    }
  }
  body += "</div>" + '<div style="display:grid;gap:8px;">';

  Object.keys(ILLNESS_GRADES).forEach(function (gradeKey) {
    var grade = ILLNESS_GRADES[gradeKey];
    body +=
      '<div style="padding:8px;border:1px solid var(--border);border-radius:6px;">' +
      "<strong>" +
      grade.icon +
      " " +
      grade.name +
      "</strong><br>" +
      '<span style="color:var(--text-secondary);">适合' +
      (gradeKey === "mild"
        ? "轻症药店处理（标记治疗，康复加速）。"
        : gradeKey === "moderate"
          ? "中症医院治疗（立刻康复）。"
          : gradeKey === "severe"
            ? "重症立刻康复所有可治疾病。"
            : "危重症全力治疗。") +
      "</span></div>";
  });
  body += "</div></div>";

  var buttons = Object.keys(ILLNESS_GRADES).map(function (gradeKey) {
    var grade = ILLNESS_GRADES[gradeKey];
    return {
      text: grade.icon + " " + grade.name,
      cls: gradeKey === "mild" ? "btn-primary" : "btn-warning",
      callback: function () {
        var result = startTreatment(StateManager.getState(), gradeKey);
        StateManager.addMessage(result.msg, result.ok ? "success" : "warning");
        if (!result.ok) return false;
        if (typeof renderAll === "function") renderAll();
      },
    };
  });
  buttons.push({ text: "暂不治疗", cls: "" });
  showModal({ title: "🏥 就医治疗", body: body, buttons: buttons });
}
function showMedicalInsuranceModal() {
  if (typeof showModal !== "function") return;
  var state = StateManager.getState();
  initMedicalState(state);
  var summary = getMedicalSummary(state);
  var body =
    '<div style="font-size:13px;line-height:1.7;">' +
    "<p>医保会在深度治疗和住院费用中自动抵扣，适合长期生存。</p>" +
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
      ' / 次<br><span style="color:var(--text-secondary);">' +
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

// ====== 每日医疗tick（保险扣费+康复检测） ======
/**
 * 每日医疗结算：
 * - 每月初自动扣除医保保费
 * - 检测玩家疾病状态并提示就医
 * - 与旅行/法律系统的交叉事件触发
 */
function tickMedical(state) {
  initMedicalState(state);
  var day = state.player && state.player.day;

  // 每月1号（每30天）自动扣医保
  if (day && day > 0 && day % 30 === 1 && state.medical.insurance) {
    var plan = INSURANCE_PLANS.find(function (p) {
      return p.id === state.medical.insurance;
    });
    if (plan) {
      if ((state.resources.cash || 0) >= plan.monthly) {
        state.resources.cash -= plan.monthly;
        state.medical.totalMedicalSpent =
          (state.medical.totalMedicalSpent || 0) + plan.monthly;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage(
            "🪪 医保月费自动扣除：¥" + plan.monthly,
            "info",
          );
        }
      } else {
        // 现金不足，暂停医保
        state.medical.insurance = null;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage(
            "⚠️ 现金不足，医保已暂停。尽快续费！",
            "warning",
          );
        }
      }
    }
  }

  // 检测玩家是否有未治疗的疾病
  var illnesses = state.status && state.status.illnesses;
  if (illnesses && illnesses.length > 0) {
    // 检查是否正在治疗
    var underTreatment = false;
    for (var i = 0; i < illnesses.length; i++) {
      if (illnesses[i].treatmentDays && illnesses[i].treatmentDays > 0) {
        underTreatment = true;
        break;
      }
    }
    // 有疾病但未治疗 → 每3天提示一次
    if (!underTreatment && day && day % 3 === 0) {
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "🏥 你还有" +
            illnesses.length +
            "种疾病未治疗，去「人生事务」Tab就医！",
          "warning",
        );
      }
    }
  }

  // 旅行期间的健康风险
  if (state.travel && state.travel.active && day && day % 2 === 0) {
    if (typeof Random !== "undefined" && Random.chance(0.15)) {
      // 旅行中水土不服
      var healthDrop = Random.int(1, 3);
      state.status = state.status || {};
      state.status.health = Math.max(
        0,
        (state.status.health || 100) - healthDrop,
      );
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "✈️ 旅途奔波，健康 -" + healthDrop + "。注意休息！",
          "warning",
        );
      }
    }
  }
}

// ====== 全局挂载 ======
if (typeof window !== "undefined") {
  window.ILLNESS_GRADES = ILLNESS_GRADES;
  window.INSURANCE_PLANS = INSURANCE_PLANS;
  window.initMedicalState = initMedicalState;
  window.buyMedicalInsurance = buyMedicalInsurance;
  window.startTreatment = startTreatment;
  window.getMedicalSummary = getMedicalSummary;
  window.showMedicalTreatmentModal = showMedicalTreatmentModal;
  window.showMedicalInsuranceModal = showMedicalInsuranceModal;
  window.tickMedical = tickMedical;

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

/**
 * 事业发展Tab — 合并创业系统 + 固定工作/上班族职业路径
 *
 * 包含：
 * 1. 创业系统（原 startup 全部内容）
 * 2. 固定工作/上班族职业路径（v3.2 扩展为6路径×20+职位）
 * 3. 职业发展与职场社交联动（晋升需要关系）
 *
 * v3.2 升级：
 * - 4路径→6路径（新增设计创意+法律服务）
 * - 晋升条件增加：属性(体质/智力/敏捷/能力/颜值)+社交+业绩
 * - 图标去重（每个路径用不同emoji）
 */

// ====== 上班族/固定工作职业路径定义 ======
// v3.2 扩展为6路径×3-4级 ≈ 22个职位
const CAREER_PATHS = {
  tech: {
    name: "IT技术",
    icon: "💻",
    levels: [
      {
        id: "tech_junior",
        name: "初级程序员",
        minAge: 20,
        reqSkills: { coding: 15 },
        salary: 6000,
        reqEducation: 1,
        desc: "写业务代码、修Bug",
      },
      {
        id: "tech_mid",
        name: "中级开发工程师",
        minAge: 23,
        reqSkills: { coding: 30, english: 10 },
        reqAttrs: { intelligence: 30 },
        salary: 12000,
        reqEducation: 1,
        reqWorkDays: 365,
        desc: "独立负责模块开发",
      },
      {
        id: "tech_senior",
        name: "高级开发工程师",
        minAge: 26,
        reqSkills: { coding: 50, english: 20, management: 10 },
        reqAttrs: { intelligence: 45, mental: 30 },
        salary: 22000,
        reqEducation: 1,
        reqWorkDays: 1095,
        desc: "技术方案设计、带新人",
      },
      {
        id: "tech_lead",
        name: "技术架构师",
        minAge: 30,
        reqSkills: { coding: 65, management: 30, english: 25 },
        reqAttrs: { intelligence: 60, mental: 45 },
        salary: 35000,
        reqEducation: 1,
        reqWorkDays: 2190,
        desc: "架构设计、技术决策",
        reqSocial: 60,
      },
    ],
  },
  finance: {
    name: "金融财务",
    icon: "📈",
    levels: [
      {
        id: "fin_junior",
        name: "财务助理",
        minAge: 20,
        reqSkills: { accounting: 15 },
        reqAttrs: { intelligence: 20 },
        salary: 5500,
        reqEducation: 1,
        desc: "整理票据、录入凭证",
      },
      {
        id: "fin_mid",
        name: "会计/分析师",
        minAge: 23,
        reqSkills: { accounting: 30, english: 10 },
        reqAttrs: { intelligence: 35 },
        salary: 10000,
        reqEducation: 1,
        reqWorkDays: 365,
        desc: "做账、出报表、财务分析",
      },
      {
        id: "fin_senior",
        name: "高级分析师",
        minAge: 26,
        reqSkills: { accounting: 45, management: 15 },
        reqAttrs: { intelligence: 50, mental: 35 },
        salary: 18000,
        reqEducation: 1,
        reqWorkDays: 1095,
        desc: "财务分析、预算管控",
      },
      {
        id: "fin_manager",
        name: "财务经理",
        minAge: 30,
        reqSkills: { accounting: 55, management: 35 },
        reqAttrs: { intelligence: 60, mental: 45 },
        salary: 30000,
        reqEducation: 1,
        reqWorkDays: 2190,
        desc: "管团队、做决策",
        reqSocial: 60,
      },
    ],
  },
  sales: {
    name: "销售市场",
    icon: "🏪",
    levels: [
      {
        id: "sales_junior",
        name: "销售助理",
        minAge: 18,
        reqSkills: { sales: 15 },
        reqAttrs: { agility: 20, charm: 15 },
        salary: 4000,
        desc: "跟单、电话邀约",
      },
      {
        id: "sales_mid",
        name: "销售代表",
        minAge: 21,
        reqSkills: { sales: 30 },
        reqAttrs: { agility: 30, charm: 25, mental: 20 },
        salary: 8000,
        reqWorkDays: 365,
        desc: "独立谈客户、签单",
      },
      {
        id: "sales_senior",
        name: "高级销售",
        minAge: 25,
        reqSkills: { sales: 50, management: 15 },
        reqAttrs: { charm: 35, mental: 35 },
        salary: 15000,
        reqWorkDays: 1095,
        desc: "带客户资源、跟大单",
      },
      {
        id: "sales_manager",
        name: "销售经理",
        minAge: 28,
        reqSkills: { sales: 60, management: 35 },
        reqAttrs: { charm: 45, mental: 45, intelligence: 40 },
        salary: 25000,
        reqWorkDays: 2190,
        desc: "带销售团队、定策略",
        reqSocial: 60,
      },
    ],
  },
  operations: {
    name: "运营管理",
    icon: "⚙️",
    levels: [
      {
        id: "ops_junior",
        name: "运营助理",
        minAge: 18,
        reqSkills: { management: 10 },
        reqAttrs: { intelligence: 20 },
        salary: 4500,
        reqEducation: 1,
        desc: "数据录入、文档整理",
      },
      {
        id: "ops_mid",
        name: "运营专员",
        minAge: 21,
        reqSkills: { management: 25 },
        reqAttrs: { intelligence: 30, mental: 20 },
        salary: 8000,
        reqEducation: 1,
        reqWorkDays: 365,
        desc: "活动执行、数据分析",
      },
      {
        id: "ops_senior",
        name: "运营主管",
        minAge: 25,
        reqSkills: { management: 40, sales: 15 },
        reqAttrs: { intelligence: 40, mental: 35, agility: 25 },
        salary: 14000,
        reqEducation: 1,
        reqWorkDays: 1095,
        desc: "带项目、优化流程",
      },
      {
        id: "ops_manager",
        name: "运营经理",
        minAge: 28,
        reqSkills: { management: 55, sales: 25 },
        reqAttrs: { intelligence: 50, mental: 45 },
        salary: 22000,
        reqEducation: 1,
        reqWorkDays: 2190,
        desc: "部门管理、策略制定",
        reqSocial: 60,
      },
    ],
  },
  design: {
    name: "设计创意",
    icon: "🎨",
    levels: [
      {
        id: "des_junior",
        name: "初级设计师",
        minAge: 18,
        reqSkills: { coding: 10 },
        reqAttrs: { intelligence: 20, charm: 20 },
        salary: 5000,
        desc: "修图、做页面、跟需求",
      },
      {
        id: "des_mid",
        name: "资深设计师",
        minAge: 22,
        reqSkills: { coding: 20, english: 10 },
        reqAttrs: { intelligence: 30, charm: 30, mental: 20 },
        salary: 9000,
        reqWorkDays: 365,
        desc: "独立出设计方案",
      },
      {
        id: "des_senior",
        name: "设计主管",
        minAge: 26,
        reqSkills: { coding: 30, management: 15, english: 15 },
        reqAttrs: { intelligence: 40, charm: 40, mental: 30 },
        salary: 16000,
        reqWorkDays: 1095,
        desc: "带设计组、定设计规范",
      },
      {
        id: "des_director",
        name: "创意总监",
        minAge: 30,
        reqSkills: { management: 35, english: 20 },
        reqAttrs: { intelligence: 50, charm: 50, mental: 45 },
        salary: 28000,
        reqEducation: 1,
        reqWorkDays: 2190,
        desc: "品牌/产品创意决策",
        reqSocial: 50,
      },
    ],
  },
  legal: {
    name: "法律服务",
    icon: "⚖️",
    levels: [
      {
        id: "leg_junior",
        name: "法务助理",
        minAge: 20,
        reqSkills: { english: 15 },
        reqAttrs: { intelligence: 25, mental: 20 },
        salary: 5500,
        reqEducation: 1,
        desc: "合同整理、法规检索",
      },
      {
        id: "leg_mid",
        name: "法务专员",
        minAge: 23,
        reqSkills: { english: 25, management: 10 },
        reqAttrs: { intelligence: 35, mental: 30 },
        salary: 10000,
        reqEducation: 1,
        reqWorkDays: 365,
        desc: "合同审核、法律咨询",
      },
      {
        id: "leg_senior",
        name: "高级法务",
        minAge: 26,
        reqSkills: { english: 35, management: 20 },
        reqAttrs: { intelligence: 50, mental: 45, charm: 25 },
        salary: 18000,
        reqEducation: 1,
        reqWorkDays: 1095,
        desc: "重大合同谈判、合规管理",
      },
      {
        id: "leg_director",
        name: "法务总监",
        minAge: 30,
        reqSkills: { management: 40, english: 40 },
        reqAttrs: { intelligence: 60, mental: 55, charm: 35 },
        salary: 30000,
        reqEducation: 1,
        reqWorkDays: 2190,
        desc: "法务部门管理、风控决策",
        reqSocial: 50,
      },
    ],
  },
};

// ====== ======

function ensureCareerCapital(state) {
  if (!state.careerCapital) {
    state.careerCapital = {
      industryResources: 0,
      clientLeads: 0,
      reputation: 0,
      partnerTrust: 0,
      burnout: 0,
    };
  }
  return state.careerCapital;
}

function clampCareerCapital(cap) {
  [
    "industryResources",
    "clientLeads",
    "reputation",
    "partnerTrust",
    "burnout",
  ].forEach(function (key) {
    cap[key] = Math.max(0, Math.min(100, cap[key] || 0));
  });
}

function getCareerPathLabel(pathId) {
  var path = CAREER_PATHS[pathId];
  if (!path) return "未选择方向";
  return path.icon + " " + path.name;
}

function getCareerCapitalStartupDiscount(state) {
  var cap = ensureCareerCapital(state);
  var score =
    (cap.industryResources || 0) * 0.5 +
    (cap.clientLeads || 0) * 0.8 +
    (cap.reputation || 0) * 0.4 +
    (cap.partnerTrust || 0) * 0.3 -
    (cap.burnout || 0) * 0.25;
  return Math.max(0, Math.min(0.15, score / 1000));
}

function getStartupReadinessNote(state) {
  var cap = ensureCareerCapital(state);
  var discount = getCareerCapitalStartupDiscount(state);
  if (discount <= 0) {
    return (
      "暂无可转化的职场资源：裸辞创业成本更高，建议先积累行业资源、客户线索或合伙人信任。<br>" +
      '<span style="color:var(--text-secondary);font-size:11px;">' +
      "行业资源 " +
      Math.round(cap.industryResources || 0) +
      "/建议≥30 · " +
      "客户线索 " +
      Math.round(cap.clientLeads || 0) +
      "/建议≥20 · " +
      "合伙人信任 " +
      Math.round(cap.partnerTrust || 0) +
      "/建议≥15</span>"
    );
  }
  var burnoutWarning =
    (cap.burnout || 0) >= 20
      ? '<span style="color:var(--danger)"> ⚠️ 职业倦怠(' +
        Math.round(cap.burnout) +
        ")已抵消部分减免</span>"
      : "";
  return (
    "职场积累可转化为创业准备度：注册资金约 <strong>-" +
    Math.round(discount * 100) +
    "%</strong> 减免。<br>" +
    '<span style="font-size:11px;color:var(--text-secondary);">' +
    "行业资源 " +
    Math.round(cap.industryResources || 0) +
    "（×0.5） · " +
    "客户线索 " +
    Math.round(cap.clientLeads || 0) +
    "（×0.8） · " +
    "声誉 " +
    Math.round(cap.reputation || 0) +
    "（×0.4） · " +
    "合伙人信任 " +
    Math.round(cap.partnerTrust || 0) +
    "（×0.3）" +
    "</span>" +
    burnoutWarning
  );
}

function getCareerGuidanceHtml(state) {
  var cap = ensureCareerCapital(state);
  clampCareerCapital(cap);
  var career = state.career || {};
  var job = career.currentJob;
  var startup = state.startup || {};
  var dream =
    typeof getCurrentDream === "function" ? getCurrentDream(state) : null;
  var status = "待选择事业方向";
  var next = "先找一份稳定工作，或继续积累创业启动资金。";
  var action = "查看上班族路径 / 调研创业条件";
  if (job) {
    status = getCareerPathLabel(job.path) + " · " + (job.levelName || "在职");
    next =
      (job.performance || 50) >= 70
        ? "绩效不错，可以准备晋升或积累客户线索后创业。"
        : "优先做项目、补技能和维护同事关系，先把绩效拉上来。";
    action = "准备晋升 / 承接关键项目 / 维护职场人脉";
  } else if (startup && startup.status !== "none" && startup.company) {
    status = "创业中 · " + (startup.company.name || "未命名公司");
    next = "关注现金流、团队稳定和融资可信度，避免烧钱过快。";
    action = "看现金流 / 推进产品 / 处理团队风险";
  }
  return (
    '<div class="card" style="padding:12px;margin-bottom:10px;background:rgba(74,158,92,0.07);border:1px solid rgba(74,158,92,0.22);">' +
    '<div style="font-weight:700;color:var(--text-primary);margin-bottom:6px;">🧭 今日事业建议</div>' +
    '<div style="font-size:12px;color:var(--text-secondary);line-height:1.7;">' +
    "<div>当前事业：" +
    status +
    "</div><div>下一步：" +
    next +
    "</div><div>可做动作：" +
    action +
    "</div>" +
    (dream
      ? "<div>人生目标加成：" +
        (typeof getDreamBonusText === "function"
          ? getDreamBonusText(dream)
          : dream.name) +
        "</div>"
      : "<div>人生目标：未选择；开局目标可提供路线加成，当前仍可自由发展。</div>") +
    "</div>" +
    '<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin-top:8px;font-size:10px;color:var(--text-muted);">' +
    "<div>行业<br><b>" +
    Math.round(cap.industryResources || 0) +
    "</b></div><div>客户<br><b>" +
    Math.round(cap.clientLeads || 0) +
    "</b></div><div>声誉<br><b>" +
    Math.round(cap.reputation || 0) +
    "</b></div><div>信任<br><b>" +
    Math.round(cap.partnerTrust || 0) +
    "</b></div><div>消耗<br><b>" +
    Math.round(cap.burnout || 0) +
    "</b></div></div></div>"
  );
}

function getCareerRequirementText(level) {
  if (!level) return "已到达当前路径顶层";
  var parts = [];
  if (level.reqEducation) parts.push("学历本科+");
  if (level.reqWorkDays) parts.push("在职" + level.reqWorkDays + "天");
  if (level.reqSocial) parts.push("人脉" + level.reqSocial + "+");
  if (level.reqSkills) {
    Object.keys(level.reqSkills).forEach(function (k) {
      var skillLabel = typeof getSkillName === "function" ? getSkillName(k) : k;
      parts.push(skillLabel + "Lv." + level.reqSkills[k]);
    });
  }
  if (level.reqAttrs) {
    var attrNames = {
      physique: "体质",
      intelligence: "智力",
      agility: "敏捷",
      mental: "心智",
      charm: "魅力",
    };
    Object.keys(level.reqAttrs).forEach(function (k) {
      parts.push((attrNames[k] || k) + level.reqAttrs[k] + "+");
    });
  }
  return parts.length ? parts.join(" / ") : "无硬性门槛";
}

function getCareerDualPathHtml(state) {
  var career = state.career || {};
  var current = career.currentJob;
  var nextLevel = current
    ? getNextCareerLevel(current.path, current.levelId)
    : null;
  var cash = state.resources ? state.resources.cash || 0 : 0;
  var discount = getCareerCapitalStartupDiscount(state);
  var startupNeed = Math.max(0, Math.round(200000 * (1 - discount) - cash));
  var jobTitle = current
    ? (current.levelName || "当前职位") +
      (nextLevel ? " → " + nextLevel.name : " → 已到路径顶层")
    : "尚未入职 → 先选择一个职业路径";
  var jobReq = current
    ? getCareerRequirementText(nextLevel)
    : "查看“上班族”子页，选择当前最接近条件的岗位";
  return (
    '<div class="section"><h3>🧭 事业双路径</h3>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">' +
    '<div class="card" style="padding:12px;">' +
    '<div style="font-weight:700;color:var(--text-primary);">💼 上班族路径</div>' +
    '<div style="font-size:12px;color:var(--text-secondary);line-height:1.6;margin-top:6px;">' +
    "<div>" +
    jobTitle +
    "</div><div>下一门槛：" +
    jobReq +
    "</div></div></div>" +
    '<div class="card" style="padding:12px;">' +
    '<div style="font-weight:700;color:var(--text-primary);">🚀 创业路径</div>' +
    '<div style="font-size:12px;color:var(--text-secondary);line-height:1.6;margin-top:6px;">' +
    "<div>" +
    getStartupReadinessNote(state) +
    "</div><div>启动资金缺口：¥" +
    startupNeed.toLocaleString() +
    "</div></div></div>" +
    "</div></div>"
  );
}

function getCareerEducationHtml(state) {
  var p = state.player || {};
  var edu = p.education ?? state.education ?? 0;
  var eduNames = ["初中", "高中", "大专", "本科", "研究生", "博士"];
  var eduIcons = ["📗", "📘", "📙", "🎓", "🏛️", "👨‍🎓"];
  var eduThresholds = [0, 50, 100, 150, 300, 500];
  var sp = p.eduStudyPoints || 0;

  if (edu >= eduNames.length - 1) {
    // 已到顶
    return (
      '<div class="section"><h3>🎓 学历与考试</h3>' +
      '<div class="card" style="padding:12px;">' +
      '<div style="font-size:14px;font-weight:700;color:var(--text-primary);">' +
      eduIcons[edu] +
      " 当前学历：" +
      eduNames[edu] +
      "</div>" +
      '<div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">' +
      "学历已到顶级，后续更依赖项目、技能和人脉。" +
      "</div></div></div>"
    );
  }

  var nextLevel = edu + 1;
  var threshold = eduThresholds[nextLevel];
  var pct = Math.min(100, Math.round((sp / threshold) * 100));

  return (
    '<div class="section"><h3>🎓 学历与考试</h3>' +
    '<div class="card" style="padding:12px;">' +
    '<div style="font-size:14px;font-weight:700;color:var(--text-primary);">' +
    eduIcons[edu] +
    " 当前学历：" +
    eduNames[edu] +
    "</div>" +
    '<div style="margin-top:6px;font-size:12px;color:var(--text-secondary);">' +
    '目标：<strong>' +
    eduNames[nextLevel] +
    "</strong>（需" +
    threshold +
    "学习点）" +
    "</div>" +
    '<div style="margin-top:8px;height:8px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;">' +
    '<div style="height:100%;width:' +
    pct +
    '%;background:var(--accent);"></div></div>' +
    '<div style="font-size:12px;color:var(--text-secondary);line-height:1.6;margin-top:6px;">' +
    "学习点：" +
    sp +
    "/" +
    threshold +
    "<br>" +
    '<button class="btn btn-sm" style="margin-top:6px;min-height:44px;" ' +
        "onclick=\"document.querySelector('[data-tab=action]')?.click()\">🏛️ 去大学城备考</button>" +
    "</div></div></div>"
  );
}

/** 事业发展Tab主渲染函数 */
function renderCareerDevTab(state, parent) {
  parent.innerHTML = "";

  // 子Tab导航
  var subTabs = [
    { id: "career_startup", label: "🚀 创业", icon: "🚀" },
    { id: "career_jobs", label: "💼 上班族", icon: "💼" },
    { id: "career_overview", label: "📊 总览", icon: "📊" },
  ];
  var currentSubTab = state._careerSubTab || "career_overview";

  var nav = document.createElement("div");
  nav.style.cssText =
    "display:flex;gap:4px;padding:8px 12px;background:var(--bg-secondary);border-bottom:1px solid var(--border);overflow-x:auto;flex-shrink:0;";
  subTabs.forEach(function (st) {
    var btn = document.createElement("button");
    btn.className = "tab-btn" + (currentSubTab === st.id ? " active" : "");
    btn.style.cssText = "font-size:11px;padding:4px 10px;white-space:nowrap;";
    btn.textContent = st.label;
    btn.onclick = function () {
      state._careerSubTab = st.id;
      renderCareerDevTab(state, parent);
    };
    nav.appendChild(btn);
  });
  parent.appendChild(nav);

  var content = document.createElement("div");
  content.style.cssText = "flex:1;overflow-y:auto;padding:8px;";

  switch (currentSubTab) {
    case "career_startup":
      renderCareerStartup(state, content);
      break;
    case "career_jobs":
      renderCareerJobs(state, content);
      break;
    case "career_overview":
    default:
      renderCareerOverview(state, content);
      break;
  }

  parent.appendChild(content);
}

/** 创业子面板（委托到原 startup.js） */
function renderCareerStartup(state, parent) {
  if (typeof renderStartupTab === "function") {
    renderStartupTab(state, parent);
    parent.insertAdjacentHTML("afterbegin", getCareerGuidanceHtml(state));
  } else {
    parent.innerHTML =
      '<p style="color:var(--text-muted);padding:40px;text-align:center;">🚀 创业系统加载中...</p>';
  }
}

/** 职业路径子面板（上班族固定工作） */
function renderCareerJobs(state, parent) {
  var p = state.player;
  var career = state.career || {};
  var currentJob = career.currentJob || null;
  var careerHistory = career.history || [];

  var html = '<div class="tab-content">';
  html += getCareerGuidanceHtml(state);
  html += '<h2 style="font-size:15px;">💼 上班族职业路径</h2>';
  html +=
    '<p style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">v3.2：6条路径×22个职位。晋升需要技能+属性(体质/智力/敏捷/能力/颜值)+人脉。</p>';

  // ---- 当前工作状态 ----
  if (currentJob) {
    var path = CAREER_PATHS[currentJob.path];
    var levelData = null;
    if (path) {
      levelData = path.levels.find(function (l) {
        return l.id === currentJob.levelId;
      });
    }
    html += '<div class="section"><h3>📌 当前工作</h3>';
    html += '<div class="card" style="padding:12px;">';
    html +=
      '<div style="font-size:13px;font-weight:bold;">' +
      (path ? path.icon : "💼") +
      " " +
      (levelData ? levelData.name : currentJob.levelId || "未知") +
      "</div>";
    html +=
      '<div style="font-size:11px;color:var(--text-secondary);">' +
      (path ? path.name : "") +
      " · 第" +
      (currentJob.workDays || 0) +
      "天</div>";
    html +=
      '<div style="font-size:13px;color:var(--accent);font-weight:bold;margin:6px 0;">月薪 ¥' +
      (levelData ? levelData.salary.toLocaleString() : "?") +
      "</div>";
    html +=
      '<div style="font-size:11px;color:var(--text-secondary);">' +
      (levelData ? levelData.desc : "") +
      "</div>";

    // 晋升条件
    var nextLevel = getNextCareerLevel(currentJob.path, currentJob.levelId);
    if (nextLevel) {
      var canPromote = checkCareerPromotion(state, currentJob.path, nextLevel);
      html +=
        '<div style="margin-top:10px;padding:10px;background:var(--bg-secondary);border-radius:6px;">';
      html +=
        '<div style="font-size:11px;font-weight:bold;margin-bottom:4px;">⬆️ 晋升条件：' +
        nextLevel.name +
        "</div>";
      html +=
        '<div style="font-size:10px;color:var(--text-muted);">' +
        renderPromotionReqs(state, currentJob.path, nextLevel) +
        "</div>";
      if (canPromote) {
        html +=
          '<button class="btn btn-sm" style="margin-top:6px;" onclick="applyCareerPromotion(\'' +
          currentJob.path +
          "','" +
          nextLevel.id +
          "')\">⬆️ 申请晋升</button>";
      } else {
        html +=
          '<div style="font-size:10px;color:var(--warning);margin-top:4px;">⚠️ 条件不足，继续努力</div>';
      }
      html += "</div>";
    } else {
      html +=
        '<div style="margin-top:8px;font-size:11px;color:var(--accent);">🏆 已到达该路径最高级别！</div>';
    }

    // ---- 工作行动：业绩/调休（P0-4+P0-5） ----
    html += '<div style="margin-top:12px;"><h3 style="font-size:13px;">⚡ 工作行动</h3>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:4px;">';
    html += '<button class="btn btn-sm" style="min-height:44px;font-size:11px;" onclick="careerWorkAction(\'project\')">💼 做项目（AP3）</button>';
    html += '<button class="btn btn-sm" style="min-height:44px;font-size:11px;" onclick="careerWorkAction(\'overtime\')">🌙 加班（AP2）</button>';
    html += '<button class="btn btn-sm" style="min-height:44px;font-size:11px;" onclick="careerWorkAction(\'kpi\')">🎯 冲刺KPI（AP4）</button>';
    html += '<button class="btn btn-sm" style="min-height:44px;font-size:11px;" onclick="careerTakeBreak()">😴 调休（AP1）</button>';
    html += '</div></div>';

    // ---- 职场社交（P0-2：主动社交UI） ----
    var colleagues = state.corporate && state.corporate.colleagues && state.corporate.colleagues.network;
    html += '<div style="margin-top:12px;"><h3 style="font-size:13px;">🤝 职场社交</h3>';
    html += '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">与同事维护关系有助于晋升和获取内推</div>';
    if (colleagues && colleagues.length) {
      for (var ci = 0; ci < colleagues.length; ci++) {
        var co = colleagues[ci];
        html += '<div class="card" style="padding:6px 8px;margin:3px 0;font-size:11px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">';
        html += '<div><strong>' + (co.name || "同事") + '</strong> <span style="color:var(--text-muted);font-size:10px;">关系' + (co.relationship || 0) + ' 信任' + (co.trust || 0) + '</span></div>';
        html += '<div style="display:flex;gap:3px;flex-wrap:wrap;">';
        html += '<button class="btn btn-xs" style="min-height:44px;font-size:10px;padding:4px 8px;" onclick="careerSocialAction(\'meal\',\'' + co.id + '\')">🍚请客</button>';
        html += '<button class="btn btn-xs" style="min-height:44px;font-size:10px;padding:4px 8px;" onclick="careerSocialAction(\'chat\',\'' + co.id + '\')">💬闲聊</button>';
        if ((co.relationship || 0) >= 60 && co.role !== 'mentor') {
          html += '<button class="btn btn-xs" style="min-height:44px;font-size:10px;padding:4px 8px;" onclick="careerSocialAction(\'mentor\',\'' + co.id + '\')">👨‍🏫拜师</button>';
        }
        html += '</div></div>';
      }
    } else {
      html += '<div style="font-size:10px;color:var(--text-muted);padding:8px 0;">暂无同事数据，入职后自动生成</div>';
    }
    html += '</div>';

    // 离职按钮
    html +=
      '<button class="btn btn-sm btn-danger" style="margin-top:8px;" onclick="if(confirm(\'确定要辞职吗？\'))resignCareerJob()">🚪 辞职</button>';
    html += "</div></div>";
  } else {
    // 没有工作，显示可选职业路径
    html +=
      '<div class="card" style="padding:12px;background:var(--bg-warning);margin-bottom:12px;">';
    html +=
      '<p style="font-size:11px;">💡 你目前没有固定工作。选择一条职业路线投递简历，从基层做起。</p>';
    html += "</div>";
  }

  // ---- 职业路径选择（没有工作时显示） ----
  if (!currentJob) {
    html += '<div class="section"><h3>🔍 选择职业方向</h3>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';

    for (var pathKey in CAREER_PATHS) {
      var pData = CAREER_PATHS[pathKey];
      var entryLevel = pData.levels[0];

      // 检查是否满足最低要求
      var meetReqs = checkCareerPromotion(state, pathKey, entryLevel);
      var reqsHtml = renderPromotionReqs(state, pathKey, entryLevel);

      html +=
        '<div class="card" style="padding:10px;cursor:' +
        (meetReqs ? "pointer" : "default") +
        ";opacity:" +
        (meetReqs ? "1" : "0.6") +
        ';" onclick="' +
        (meetReqs
          ? "applyCareerJob('" + pathKey + "','" + entryLevel.id + "')"
          : "") +
        '">';
      html +=
        '<div style="font-size:13px;font-weight:bold;">' +
        pData.icon +
        " " +
        pData.name +
        "</div>";
      html +=
        '<div style="font-size:11px;color:var(--text-secondary);margin:4px 0;">' +
        entryLevel.name +
        " · 月薪¥" +
        entryLevel.salary.toLocaleString() +
        "</div>";
      html +=
        '<div style="font-size:10px;color:var(--text-muted);">' +
        entryLevel.desc +
        "</div>";
      html +=
        '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">' +
        reqsHtml +
        "</div>";
      if (meetReqs) {
        html +=
          '<button class="btn btn-sm" style="margin-top:6px;">📄 投递简历</button>';
      } else {
        html +=
          '<div style="font-size:9px;color:var(--warning);margin-top:4px;">⚠️ 条件不足</div>';
      }
      html += "</div>";
    }
    html += "</div></div>";
  }

  // ---- 晋升历史 ----
  if (careerHistory.length > 0) {
    html +=
      '<div class="section" style="margin-top:12px;"><h3>📜 职业历程</h3>';
    html += '<div style="max-height:200px;overflow-y:auto;">';
    // 按天倒序
    var sorted = careerHistory.slice().sort(function (a, b) {
      return b.day - a.day;
    });
    sorted.forEach(function (h) {
      html +=
        '<div class="card" style="padding:8px;margin:4px 0;font-size:11px;">';
      html += "第" + h.day + "天 · " + h.event;
      html += "</div>";
    });
    html += "</div></div>";
  }

  html += "</div>";
  parent.innerHTML = html;
}

/** 事业概览子面板 */
function renderCareerOverview(state, parent) {
  var html = '<div class="tab-content">';
  html += getCareerGuidanceHtml(state);
  html += getCareerDualPathHtml(state);
  html += getCareerEducationHtml(state);

  // 创业摘要
  var startup = state.startup;
  if (startup && startup.status !== "none" && startup.company) {
    html += '<div class="section"><h3>🚀 创业状态</h3>';
    html += '<div class="card" style="padding:12px;">';
    html += "<p>🏢 " + (startup.company.name || "未命名公司") + "</p>";
    html +=
      "<p>📊 估值：¥" +
      (startup.company.valuation || 0).toLocaleString() +
      "</p>";
    html +=
      "<p>💰 现金流：¥" + (startup.company.cash || 0).toLocaleString() + "</p>";
    html +=
      "<p>👥 团队：" + (startup.company.employees || []).length + "人</p>";
    html += "</div></div>";
  }

  // 固定工作摘要
  var career = state.career || {};
  if (career.currentJob) {
    html += '<div class="section"><h3>💼 当前职业</h3>';
    html += '<div class="card" style="padding:12px;">';
    html += "<p>" + (career.currentJob.levelName || "在职") + "</p>";
    html += "<p>📅 在职 " + (career.currentJob.workDays || 0) + " 天</p>";
    html += "</div></div>";
  }

  // 事业建议
  html +=
    '<div class="card" style="padding:12px;background:var(--bg-warning);margin-top:8px;">';
  html +=
    '<p style="font-size:11px;color:var(--text-muted);">💡 事业建议：</p>';
  html +=
    '<ul style="font-size:11px;color:var(--text-muted);margin:4px 0 0 16px;padding:0;">';
  if (!startup || startup.status === "none") {
    html += "<li>🚀 积累够¥200,000可以尝试创业</li>";
  }
  if (!career.currentJob) {
    html += "<li>💼 找一份固定工作，获得稳定月收入</li>";
  }
  html += "<li>🤝 职场社交关系会影响晋升——多维护同事关系</li>";
  html += "<li>📚 提升技能可以解锁更高级的职位</li>";
  html += "</ul>";
  html += "</div>";

  html += "</div>";
  parent.innerHTML = html;
}

// ====== 工具函数 ======

// ====== 事业主动行动（v3.9：社交/业绩/调休，激活同事网络数据流） ======

/** 入职时初始化同事网络（initColleagueNetwork 只建空壳，这里生成初始同事） */
function initCareerColleagues(state) {
  if (typeof initColleagueNetwork === "function") {
    initColleagueNetwork(state);
  } else {
    if (!state.corporate) state.corporate = {};
    if (!state.corporate.colleagues) {
      state.corporate.colleagues = { network: [], factions: [], mentees: [] };
    }
  }
  var net = state.corporate.colleagues.network;
  if (net.length) return;
  var names = ["老王", "小张", "小李", "小刘", "小陈", "小赵", "小周", "小吴", "小郑", "小孙", "小徐", "小高"];
  var traits = [
    { type: "热心肠", bonus: "愿意帮忙" },
    { type: "老油条", bonus: "经验丰富" },
    { type: "卷王", bonus: "工作能力强" },
    { type: "和事佬", bonus: "调解能力" },
    { type: "八卦王", bonus: "信息灵通" },
    { type: "老实人", bonus: "可靠" },
    { type: "社交达人", bonus: "人脉广" },
    { type: "技术宅", bonus: "技术强" },
  ];
  var n = 2 + Math.floor(Math.random() * 2);
  for (var i = 0; i < n; i++) {
    net.push({
      id: "colleague_" + state.player.day + "_" + i + "_" + Math.random().toString(36).slice(2, 8),
      name: names[Math.floor(Math.random() * names.length)],
      role: "neutral",
      personality: traits[Math.floor(Math.random() * traits.length)],
      relationship: 20 + Math.floor(Math.random() * 20),
      trust: 15 + Math.floor(Math.random() * 15),
      lastInteraction: state.player.day,
    });
  }
}

/** 职场社交行动（请客/闲聊/拜师），操作 state.corporate.colleagues.network */
function careerSocialAction(action, colleagueId) {
  var state = StateManager.getState();
  if (!state.career || !state.career.currentJob) {
    StateManager.addMessage("⚠️ 你目前没有工作", "warning");
    return;
  }
  var net = state.corporate && state.corporate.colleagues && state.corporate.colleagues.network;
  if (!net || !net.length) {
    StateManager.addMessage("⚠️ 同事网络未初始化", "warning");
    return;
  }
  var c = null;
  for (var i = 0; i < net.length; i++) {
    if (net[i].id === colleagueId) { c = net[i]; break; }
  }
  if (!c) { StateManager.addMessage("⚠️ 找不到该同事", "warning"); return; }
  var p = state.player;
  var cap = ensureCareerCapital(state);

  if (action === "meal") {
    if (state.resources.cash < 50) { StateManager.addMessage("⚠️ 现金不足¥50", "warning"); return; }
    if (p.actionPoints < 2) { StateManager.addMessage("⚠️ 行动力不足(需2)", "warning"); return; }
    state.resources.cash -= 50;
    p.actionPoints -= 2;
    var gain = Math.round(5 + c.relationship / 20);
    c.relationship = Math.min(100, (c.relationship || 0) + gain);
    c.trust = Math.min(100, (c.trust || 0) + 3);
    c.lastInteraction = p.day;
    cap.reputation = (cap.reputation || 0) + 0.5;
    clampCareerCapital(cap);
    StateManager.addMessage("🍚 请" + c.name + "吃饭，关系+" + gain + "，信任+3", "success");
  } else if (action === "chat") {
    if (p.actionPoints < 1) { StateManager.addMessage("⚠️ 行动力不足(需1)", "warning"); return; }
    p.actionPoints -= 1;
    var cg = 2 + Math.floor(Math.random() * 3);
    c.relationship = Math.min(100, (c.relationship || 0) + cg);
    c.lastInteraction = p.day;
    var lead = Math.random() < 0.3;
    if (lead) cap.clientLeads = (cap.clientLeads || 0) + 1;
    clampCareerCapital(cap);
    StateManager.addMessage("💬 和" + c.name + "闲聊，关系+" + cg + (lead ? "，获得客户线索+1" : ""), "info");
  } else if (action === "mentor") {
    if ((c.relationship || 0) < 60) { StateManager.addMessage("⚠️ 需与" + c.name + "关系≥60才能拜师", "warning"); return; }
    if (state.corporate.colleagues.mentorship) { StateManager.addMessage("⚠️ 你已有导师，先解除", "warning"); return; }
    if (p.actionPoints < 2) { StateManager.addMessage("⚠️ 行动力不足(需2)", "warning"); return; }
    p.actionPoints -= 2;
    state.corporate.colleagues.mentorship = { mentorId: c.id, mentorName: c.name, startedDay: p.day, level: 80 };
    c.role = "mentor";
    c.relationship = Math.min(100, (c.relationship || 0) + 5);
    cap.partnerTrust = (cap.partnerTrust || 0) + 5;
    clampCareerCapital(cap);
    StateManager.addMessage("👨‍🏫 拜" + c.name + "为师！晋升推荐与危机保护已解锁", "success");
  }
  if (typeof renderAll === "function") renderAll();
}

/** 业绩主动行动（做项目/加班/冲刺KPI） */
function careerWorkAction(type) {
  var state = StateManager.getState();
  if (!state.career || !state.career.currentJob) return;
  var job = state.career.currentJob;
  var p = state.player;
  var cap = ensureCareerCapital(state);

  if (type === "project") {
    if (p.actionPoints < 3) { StateManager.addMessage("⚠️ 行动力不足(需3)", "warning"); return; }
    p.actionPoints -= 3;
    job.performance = Math.min(100, (job.performance || 50) + 8);
    cap.burnout = (cap.burnout || 0) + 3;
    cap.industryResources = (cap.industryResources || 0) + 2;
    var leadP = Math.random() < 0.1;
    if (leadP) cap.clientLeads = (cap.clientLeads || 0) + 3;
    clampCareerCapital(cap);
    StateManager.addMessage("💼 完成项目：业绩+8，行业资源+2" + (leadP ? "，意外获得客户线索+3" : ""), "success");
  } else if (type === "overtime") {
    if (p.actionPoints < 2) { StateManager.addMessage("⚠️ 行动力不足(需2)", "warning"); return; }
    p.actionPoints -= 2;
    job.performance = Math.min(100, (job.performance || 50) + 5);
    var ot = Math.round((job.salary || 5000) / 30);
    state.resources.cash += ot;
    state.resources.totalEarned = (state.resources.totalEarned || 0) + ot;
    cap.burnout = (cap.burnout || 0) + 5;
    if (state.status) state.status.health = Math.max(0, (state.status.health || 100) - 2);
    clampCareerCapital(cap);
    StateManager.addMessage("🌙 加班：业绩+5，加班费¥" + ot + "，倦怠+5，健康-2", "info");
  } else if (type === "kpi") {
    if ((job.performance || 50) < 40) { StateManager.addMessage("⚠️ 业绩需≥40才能冲刺KPI", "warning"); return; }
    if (p.actionPoints < 4) { StateManager.addMessage("⚠️ 行动力不足(需4)", "warning"); return; }
    p.actionPoints -= 4;
    job.performance = Math.min(100, (job.performance || 50) + 12);
    cap.burnout = (cap.burnout || 0) + 6;
    cap.industryResources = (cap.industryResources || 0) + 5;
    cap.reputation = (cap.reputation || 0) + 3;
    clampCareerCapital(cap);
    StateManager.addMessage("🎯 冲刺KPI成功：业绩+12，行业资源+5，声誉+3", "success");
  }
  if (typeof renderAll === "function") renderAll();
}

/** 调休减压（每月1次，需在职≥20天） */
function careerTakeBreak() {
  var state = StateManager.getState();
  if (!state.career || !state.career.currentJob) return;
  var job = state.career.currentJob;
  var p = state.player;
  var cap = ensureCareerCapital(state);
  if ((job.workDays || 0) < 20) { StateManager.addMessage("⚠️ 需在职≥20天才能调休", "warning"); return; }
  var lastBreak = job._lastBreakDay || -999;
  if (p.day - lastBreak < 30) { StateManager.addMessage("⚠️ 每月只能调休1次（上次第" + lastBreak + "天）", "warning"); return; }
  if (p.actionPoints < 1) { StateManager.addMessage("⚠️ 行动力不足(需1)", "warning"); return; }
  p.actionPoints -= 1;
  cap.burnout = Math.max(0, (cap.burnout || 0) - 15);
  job.performance = Math.max(0, (job.performance || 50) - 2);
  job._lastBreakDay = p.day;
  if (state.needs) state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 5);
  clampCareerCapital(cap);
  StateManager.addMessage("😴 调休一天：倦怠-15，心情+5，业绩-2", "success");
  if (typeof renderAll === "function") renderAll();
}

/** 获取职业路径的下一级 */
function getNextCareerLevel(pathId, currentLevelId) {
  var path = CAREER_PATHS[pathId];
  if (!path) return null;
  for (var i = 0; i < path.levels.length - 1; i++) {
    if (path.levels[i].id === currentLevelId) {
      return path.levels[i + 1];
    }
  }
  return null;
}

/** 检查晋升条件（v3.2 新增：属性+颜值+社交检查） */
function checkCareerPromotion(state, pathId, level) {
  var p = state.player;

  // 年龄检查
  if (level.minAge && (state.player.age || 20) < level.minAge) return false;

  // 学历检查
  if (level.reqEducation && !p.education) return false;

  // 技能检查
  if (level.reqSkills) {
    for (var skill in level.reqSkills) {
      var required = level.reqSkills[skill];
      var actual = 0;
      if (skill === "intelligence") actual = p.intelligence || 0;
      else if (skill === "mental") actual = p.mental || 0;
      else if (skill === "physique") actual = p.physique || 0;
      else if (skill === "agility") actual = p.agility || 0;
      else if (skill === "charm") actual = p.charm || 0;
      else if (state.skills && state.skills[skill])
        actual = state.skills[skill].level || 0;
      else return false;
      if (actual < required) return false;
    }
  }

  // v3.2 属性要求检查（reqAttrs：体质/智力/敏捷/能力/颜值）
  if (level.reqAttrs) {
    for (var attr in level.reqAttrs) {
      var attrReq = level.reqAttrs[attr];
      var attrVal = 0;
      if (attr === "physique") attrVal = p.physique || 0;
      else if (attr === "intelligence") attrVal = p.intelligence || 0;
      else if (attr === "agility") attrVal = p.agility || 0;
      else if (attr === "mental") attrVal = p.mental || 0;
      else if (attr === "charm") attrVal = p.charm || 0;
      else if (attr === "fame") attrVal = p.fame || 0;
      else if (attr === "morality") attrVal = p.morality || 0;
      else return false;
      if (attrVal < attrReq) return false;
    }
  }

  // 工作天数检查
  var career = state.career || {};
  var workDays = career.currentJob ? career.currentJob.workDays || 0 : 0;
  if (level.reqWorkDays && workDays < level.reqWorkDays) return false;

  // 业绩检查：高阶职位不仅熬年限，还要有可见绩效。
  var performanceReq = getCareerPerformanceRequirement(level);
  if (performanceReq && getCareerPerformanceScore(state) < performanceReq) {
    return false;
  }

  // 社交关系检查（高阶职位需要）
  if (level.reqSocial) {
    if (
      getCareerTrustedNetworkCount(state) < Math.floor(level.reqSocial / 20)
    ) {
      return false;
    }
  }

  return true;
}

function getCareerPerformanceRequirement(level) {
  if (level.reqPerformance) return level.reqPerformance;
  if (!level.reqWorkDays) return 0;
  var years = Math.floor(level.reqWorkDays / 365);
  return Math.min(80, 25 + years * 12);
}

function getCareerPerformanceScore(state) {
  var career = state.career || {};
  var job = career.currentJob || {};
  if (typeof job.performance === "number") return job.performance;
  var corp = state.player && state.player.corporate;
  if (corp && typeof corp.kpi === "number") return corp.kpi;
  if (state.corporate && typeof state.corporate.kpi === "number") {
    return state.corporate.kpi;
  }
  return 50;
}

function getCareerTrustedNetworkCount(state) {
  // 主读路径与写入方(initColleagueNetwork→state.corporate.colleagues)一致
  var colleagues = [];
  if (
    state.corporate &&
    state.corporate.colleagues &&
    Array.isArray(state.corporate.colleagues.network)
  ) {
    colleagues = state.corporate.colleagues.network;
  }
  // fallback：兼容旧路径
  if (
    !colleagues.length &&
    state.workplaceSocial &&
    state.workplaceSocial.colleagues &&
    Array.isArray(state.workplaceSocial.colleagues.network)
  ) {
    colleagues = state.workplaceSocial.colleagues.network;
  }
  return colleagues.filter(function (c) {
    return (c.relationship || c.trust || c.affinity || 0) >= 60;
  }).length;
}

/** 渲染晋升条件文字（v3.2 更新：显示属性+颜值要求） */
function renderPromotionReqs(state, pathId, level) {
  var parts = [];
  if (level.salary) parts.push("月薪¥" + level.salary.toLocaleString());
  if (level.reqSkills) {
    for (var s in level.reqSkills) {
      var labels = {
        coding: "编程",
        english: "英语",
        accounting: "财务",
        management: "管理",
        sales: "销售",
        intelligence: "智力",
        mental: "能力",
        physique: "体质",
        agility: "敏捷",
        charm: "颜值",
      };
      parts.push((labels[s] || s) + "≥" + level.reqSkills[s]);
    }
  }
  // v3.2 属性要求显示
  if (level.reqAttrs) {
    for (var a in level.reqAttrs) {
      var attrLabels = {
        physique: "体质",
        intelligence: "智力",
        agility: "敏捷",
        mental: "能力",
        charm: "颜值",
        fame: "名气",
        morality: "道德",
      };
      parts.push((attrLabels[a] || a) + "≥" + level.reqAttrs[a]);
    }
  }
  if (level.minAge) parts.push("年龄≥" + level.minAge);
  if (level.reqEducation) parts.push("大专以上学历");
  if (level.reqWorkDays)
    parts.push("在职≥" + Math.floor(level.reqWorkDays / 365) + "年");
  var performanceReq = getCareerPerformanceRequirement(level);
  if (performanceReq) parts.push("业绩≥" + performanceReq);
  if (level.reqSocial)
    parts.push("职场人脉≥" + Math.floor(level.reqSocial / 20) + "人");
  return "要求：" + parts.join(" · ");
}

/** 投递简历（申请初级职位） */
function applyCareerJob(pathId, levelId) {
  var state = StateManager.getState();
  var path = CAREER_PATHS[pathId];
  if (!path) {
    StateManager.addMessage("⚠️ 该职业路径不存在", "warning");
    return;
  }

  var level = path.levels.find(function (l) {
    return l.id === levelId;
  });
  if (!level) return;

  if (!checkCareerPromotion(state, pathId, level)) {
    StateManager.addMessage("⚠️ 你不满足该职位的条件", "warning");
    return;
  }

  // 初始化 career 状态
  if (!state.career) state.career = { currentJob: null, history: [] };
  var cap = ensureCareerCapital(state);
  if (state.career.currentJob) {
    StateManager.addMessage(
      "⚠️ 你已经有工作了，先辞职才能投递新职位",
      "warning",
    );
    return;
  }

  state.career.currentJob = {
    path: pathId,
    levelId: levelId,
    levelName: level.name,
    salary: level.salary,
    workDays: 0,
    startDay: state.player.day,
    performance: 50,
  };
  // 初始化同事网络（P0-2：入职时生成初始同事）
  if (typeof initCareerColleagues === "function") {
    initCareerColleagues(state);
  }
  cap.reputation = (cap.reputation || 0) + 2;
  cap.industryResources = (cap.industryResources || 0) + 1;
  clampCareerCapital(cap);

  StateManager.addMessage(
    "✅ 入职成功！你成为了" +
      getCareerPathLabel(pathId) +
      "的" +
      level.name +
      "，月薪¥" +
      level.salary.toLocaleString(),
    "success",
  );

  if (typeof renderAll === "function") renderAll();
}

/** 申请晋升 */
function applyCareerPromotion(pathId, levelId) {
  var state = StateManager.getState();
  var path = CAREER_PATHS[pathId];
  var level = path.levels.find(function (l) {
    return l.id === levelId;
  });
  if (!level) return;

  if (!state.career || !state.career.currentJob) {
    StateManager.addMessage("⚠️ 你目前没有工作", "warning");
    return;
  }

  if (!checkCareerPromotion(state, pathId, level)) {
    StateManager.addMessage("⚠️ 晋升条件不足，查看具体要求", "warning");
    return;
  }

  // 晋升成功
  var oldJob = state.career.currentJob;
  var cap = ensureCareerCapital(state);
  state.career.history.push({
    day: state.player.day,
    event: "晋升：" + oldJob.levelName + " → " + level.name,
  });

  state.career.currentJob.levelId = levelId;
  state.career.currentJob.levelName = level.name;
  state.career.currentJob.salary = level.salary;
  state.career.currentJob.performance = Math.max(
    45,
    (state.career.currentJob.performance || 55) - 10,
  );
  cap.reputation = (cap.reputation || 0) + 8;
  cap.industryResources = (cap.industryResources || 0) + 4;
  cap.partnerTrust = (cap.partnerTrust || 0) + 2;
  clampCareerCapital(cap);

  StateManager.addMessage(
    "🎉 晋升成功！你成为了" +
      level.name +
      "，月薪涨至¥" +
      level.salary.toLocaleString(),
    "success",
  );

  if (typeof renderAll === "function") renderAll();
}

/** 辞职 */
function resignCareerJob() {
  var state = StateManager.getState();
  if (!state.career || !state.career.currentJob) return;

  state.career.history.push({
    day: state.player.day,
    event: "辞职：离开了" + state.career.currentJob.levelName + "岗位",
  });
  state.career.currentJob = null;

  StateManager.addMessage("👋 你已辞去当前工作", "info");
  if (typeof renderAll === "function") renderAll();
}

/** 每日固定工作结算 */
function tickCareerJobDaily(state) {
  // ----- 退休人员只发养老金（P0-3） -----
  if (state.flags && state.flags._retired) {
    var pension = (state.career && state.career.pensionBase) ? Math.round(state.career.pensionBase * 0.40) : 2000;
    var payCycle = state.career && (state.career._pensionPayCycle || 0);
    state.career = state.career || {};
    state.career._pensionPayCycle = (payCycle || 0) + 1;
    if (state.career._pensionPayCycle % 30 === 0) {
      state.resources.cash = (state.resources.cash || 0) + pension;
      StateManager.addMessage("🏖️ 收到养老金 ¥" + pension.toLocaleString(), "info");
    }
    return;
  }

  if (!state.career || !state.career.currentJob) return;

  var job = state.career.currentJob;
  var cap = ensureCareerCapital(state);
  job.workDays = (job.workDays || 0) + 1;
  job.performance = Math.max(0, Math.min(100, job.performance || 50));
  cap.reputation = (cap.reputation || 0) + 0.1;
  cap.burnout = Math.max(0, (cap.burnout || 0) + 0.04);

  // 每月1日发薪
  if (state.player.day % 30 === 1) {
    var salary = job.salary || 5000;
    if (typeof applyDreamIncomeBonus === "function") {
      salary = applyDreamIncomeBonus(state, salary, "salary");
    }
    state.resources.cash += salary;
    state.resources.totalEarned += salary;
    StateManager.addMessage(
      "💰 收到月薪 ¥" + salary.toLocaleString() + "（" + job.levelName + "）",
      "success",
    );

    // 高阶职位需要维持社交关系
    var path = CAREER_PATHS[job.path];
    if (path) {
      var level = path.levels.find(function (l) {
        return l.id === job.levelId;
      });
      if (level && level.reqSocial) {
        // 社交关系不足会有绩效警告
        var colleagues = state.corporate?.colleagues?.network || [];
        var highTrust = colleagues.filter(function (c) {
          return c.relationship >= 60;
        }).length;
        if (highTrust < Math.floor(level.reqSocial / 20)) {
          StateManager.addMessage(
            "⚠️ 你的社交关系网络不足以支撑当前职位，小心被取代！",
            "warning",
          );
        }
      }
    }
  }
  if (job.workDays > 0 && job.workDays % 20 === 0) {
    var projectGain = Math.max(2, Math.floor((job.performance || 50) / 20));
    job.performance = Math.min(100, job.performance + 5);
    cap.industryResources = (cap.industryResources || 0) + projectGain;
    cap.clientLeads = (cap.clientLeads || 0) + Math.max(1, projectGain - 1);
    cap.burnout = (cap.burnout || 0) + 2;
    clampCareerCapital(cap);
    StateManager.addMessage(
      "💼 完成了一个阶段项目：业绩+5，行业资源+" +
        projectGain +
        "，客户线索+" +
        Math.max(1, projectGain - 1) +
        "。这些积累未来可转化为跳槽或创业优势。",
      "success",
    );
  }

  // ----- burnout 过劳后果（P0-5） -----
  if (cap.burnout >= 80 && Math.random() < 0.15) {
    // 强制过劳病假
    state.status = state.status || {};
    state.status.health = Math.max(0, (state.status.health || 100) - 10);
    cap.burnout = Math.max(0, cap.burnout - 30);
    job.performance = Math.max(0, (job.performance || 50) - 5);
    clampCareerCapital(cap);
    StateManager.addMessage(
      "🏥 过度劳累导致病倒！被迫休养，健康-10，倦怠-30，业绩-5",
      "danger",
    );
  } else if (cap.burnout >= 50) {
    // 慢性过劳：每日降绩效+轻微掉健康
    job.performance = Math.max(0, (job.performance || 50) - 1);
    state.status = state.status || {};
    state.status.health = Math.max(0, (state.status.health || 100) - 0.5);
    if (Math.random() < 0.05) {
      StateManager.addMessage(
        "⚠️ 身体发出警告：长期高压工作正在消耗你的健康",
        "warning",
      );
    }
  }
}

// ====== 百科注册 ======
if (typeof window !== "undefined") {
  window.ensureCareerCapital = ensureCareerCapital;
  window.getCareerCapitalStartupDiscount = getCareerCapitalStartupDiscount;
  window.getStartupReadinessNote = getStartupReadinessNote;
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.career_dev = {
    id: "career_dev",
    name: "事业发展",
    icon: "🚀",
    brief: "创业系统 + 上班族职业路径，从基层到高管的完整职业生涯",
    version: "1.0.0",
    related: ["mechanics:startup_system", "mechanics:workplace_social"],
    sections: [
      {
        kind: "desc",
        text: "事业是人生的支柱。从街头打零工到成为上市公司CEO，事业系统让你体验不同职业路径的酸甜苦辣。",
      },
      {
        kind: "subhead",
        text: "💼 职业路径",
      },
      {
        kind: "list",
        items: [
          "💻 IT技术：初级程序员→中级开发→高级开发→技术Leader",
          "📊 金融财务：财务助理→会计/分析师→高级分析师→财务经理",
          "💼 销售市场：销售助理→销售代表→高级销售→销售经理",
          "⚙️ 运营管理：运营助理→运营专员→运营主管→运营经理",
        ],
      },
      {
        kind: "subhead",
        text: "🚀 创业路径",
      },
      {
        kind: "list",
        items: [
          "种子轮：验证想法，组建核心团队",
          "A轮：产品验证后规模化扩张",
          "B轮：市场扩张，建立壁垒",
          "C轮：准备IPO前的最后一轮",
        ],
      },
      {
        kind: "tip",
        text: "💡 提示：创业需要¥200,000启动资金和承担风险的能力；固定工作提供稳定收入但晋升需要技能+人脉；高级职位需要维护好同事关系才能顺利晋升。",
      },
    ],
  };
}

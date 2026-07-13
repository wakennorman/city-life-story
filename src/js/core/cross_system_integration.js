/**
 * 四大系统深度联动 — 人生节点/医疗/旅行/法律 交叉事件与反馈
 *
 * v3.13 (2026-07-04)
 * 设计参考：《This War of Mine》连锁事件 / 《模拟人生》交叉反馈 / 真实社会系统
 *
 * 四大联动维度：
 * 1. 人生节点 → 医疗（年龄健康危机、节点触发疾病）
 * 2. 旅行 → 医疗（水土不服、旅行疾病、保险联动）
 * 3. 医疗 → 法律（医疗纠纷、保险理赔诉讼）
 * 4. 旅行 → 法律（异地违法、旅行纠纷）
 * 5. 人生节点 → 旅行（退休旅行、毕业旅行）
 */

// ====== 1. 人生节点 → 医疗联动 ======

/**
 * 检查人生节点触发的医疗事件
 * 在每日管线 life_node_check 之后调用
 */
function checkLifeNodeMedicalEvents(state) {
  processLinkageRules(state);
}

// ====== 2. 旅行 → 医疗联动 ======

/**
 * 旅行过程中触发医疗事件（水土不服、意外伤害）
 * 在 tickTravel 中调用
 */
function checkTravelMedicalEvents(state) {
  processLinkageRules(state);
}

// ====== 3. 医疗 → 法律联动 ======

/**
 * 医疗纠纷：治疗失败或大病后可能触发法律纠纷
 * 在每日医疗tick后调用
 */
function checkMedicalLegalEvents(state) {
  processLinkageRules(state);
}

// ====== 4. 旅行 → 法律联动 ======

/**
 * 旅行中可能触发法律事件（纠纷、违规）
 * 在 tickTravel 中调用
 */
function checkTravelLegalEvents(state) {
  processLinkageRules(state);
}

// ====== 5. 人生节点 → 旅行联动 ======

/**
 * 关键人生节点后触发旅行建议/机会
 * 在 checkLifeNodes 后调用
 */
function checkLifeNodeTravelEvents(state) {
  processLinkageRules(state);
}

// ====== 5.5 人生节点 → 叙事反馈（消费 _career35Path / _retirementType 死flag） ======

/**
 * 消费 life_nodes.js 设置的 _career35Path 和 _retirementType 标志，
 * 提供叙事反馈（这些标志只被写入不被读取）
 */
function checkLifeNodeNarrativeFeedback(state) {
  processLinkageRules(state);
}

// ====== 约定式联动规则表（v3.99c 约定式自动归类） ======
// 每条规则声明：触发条件 → 状态检查 → 执行动作
// 新增联动只需在 LINKAGE_RULES 中添加条目，无需手写函数

var LINKAGE_RULES = [
  // === 1. 人生节点 → 医疗联动 ===
  {
    id: "midlife_health_warning",
    desc: "35岁危机后健康<60时发出预警",
    trigger: {
      flag: "_lifeNode_career35_done",
      notFlag: "_midlifeHealthWarning",
    },
    condition: { stat: "health", op: "<", value: 60 },
    action: {
      type: "message",
      level: "warning",
      textFn: function (st) {
        var health = st.status && st.status.health;
        return (
          "⚠️ 35岁之后身体大不如前，健康仅" + health + "，建议体检和买医保！"
        );
      },
    },
    onActivate: function (st) {
      st.flags._midlifeHealthWarning = true;
    },
  },
  {
    id: "retirement_health_check",
    desc: "退休节点强制健康检查",
    trigger: {
      flag: "_lifeNode_retirement_done",
      notFlag: "_retirementHealthCheck",
    },
    condition: { stat: "health", op: "<", value: 50 },
    action: {
      type: "message",
      level: "danger",
      textFn: function (st) {
        var h = st.status && st.status.health;
        return (
          "🏥 退休了，但身体已透支（健康仅" +
          h +
          "）。好好休养，别让晚年都在医院度过。"
        );
      },
    },
    onActivate: function (st) {
      st.flags._retirementHealthCheck = true;
    },
  },
  {
    id: "gaokao_recovery",
    desc: "高考结束 → 健康恢复+5",
    trigger: { flag: "_lifeNode_gaokao_done", notFlag: "_gaokaoRecovery" },
    action: {
      type: "message",
      level: "success",
      text: "🍃 高考结束，如释重负，健康+5。",
    },
    onActivate: function (st) {
      st.flags._gaokaoRecovery = true;
      st.status = st.status || {};
      st.status.health = Math.min(100, (st.status.health || 100) + 5);
    },
  },
  // === 2. 人生节点 → 旅行联动 ===
  {
    id: "retirement_travel_tip",
    desc: "退休后解锁旅行建议",
    trigger: {
      flag: "_lifeNode_retirement_done",
      notFlag: "_retirementTravelTip",
    },
    action: {
      type: "message",
      level: "info",
      text: "🌅 退休了！终于有时间去看看这个世界。去「人生事务」Tab规划一次长途旅行吧！",
    },
    onActivate: function (st) {
      st.flags._retirementTravelTip = true;
    },
  },
  {
    id: "grad_travel_tip",
    desc: "大学毕业后解锁更多旅行目的地",
    trigger: { flag: "_lifeNode_university_done", notFlag: "_gradTravelTip" },
    action: {
      type: "message",
      level: "info",
      text: "🎓 毕业旅行是青春的一部分！去「人生事务」Tab看看旅行目的地吧。",
    },
    onActivate: function (st) {
      st.flags._gradTravelTip = true;
    },
  },
  // === 3. 医疗 → 法律联动 ===
  {
    id: "medical_legal_advice",
    desc: "医疗花费超¥10000且未购保险→法律援助建议",
    trigger: {
      stat: "totalMedicalSpent",
      op: ">",
      value: 10000,
      notFlag: "_medicalLegalAdvice",
    },
    condition: { flagNot: "_hasInsurance" },
    action: {
      type: "message",
      level: "warning",
      textFn: function (st) {
        return (
          "⚖️ 医疗费用已累计¥" +
          (st.medical.totalMedicalSpent || 0) +
          "！没有医保的情况下，建议去「法律咨询」了解是否有减免政策。"
        );
      },
    },
    onActivate: function (st) {
      st.flags._medicalLegalAdvice = true;
    },
  },
  {
    id: "critical_health_warning",
    desc: "健康<30时发出危机预警",
    trigger: {
      stat: "health",
      op: "<",
      value: 30,
      notFlag: "_criticalHealthWarning",
    },
    action: {
      type: "message",
      level: "danger",
      textFn: function (st) {
        var health = st.status && st.status.health;
        return (
          "💀 健康已跌至" +
          health +
          "！若再恶化可能需要法律援助——生前预嘱/医疗授权。"
        );
      },
    },
    onActivate: function (st) {
      st.flags._criticalHealthWarning = true;
    },
  },
  // === 4. 人生节点 → 叙事反馈 ===
  {
    id: "career35_narrative",
    desc: "35岁危机路径叙事反馈",
    trigger: { flag: "_career35Path", notFlag: "_career35PathNarrated" },
    action: {
      type: "message",
      level: "story",
      textFn: function (st) {
        var map = {
          transform: "你选择了充电转型，开始学习新技能。这条路不容易，但值得。",
          hold: "你选择咬牙硬扛，靠资历撑过去。身体是革命的本钱。",
          newpath: "你决定寻找新赛道，人脉带来了新的机会。",
          lieflat: "躺平亦是一种选择。降低期望后，反而轻松了一些。",
        };
        return "⚡ " + (map[st.flags._career35Path] || "");
      },
    },
    onActivate: function (st) {
      st.flags._career35PathNarrated = true;
    },
  },
  {
    id: "retirement_narrative",
    desc: "退休类型叙事反馈",
    trigger: { flag: "_retirementType", notFlag: "_retirementTypeNarrated" },
    action: {
      type: "message",
      level: "story",
      textFn: function (st) {
        var map = {
          wealthy: "体面退休，手有余粮，心中不慌。",
          advisor: "退而不休，用自己的经验继续发光发热。",
          continue: "你还在继续工作，人生没有真正的退休。",
        };
        return "🏖️ " + (map[st.flags._retirementType] || "");
      },
    },
    onActivate: function (st) {
      st.flags._retirementTypeNarrated = true;
    },
  },
  // === 5. 旅行 → 医疗联动（带随机） ===
  {
    id: "travel_medical_risk",
    desc: "旅行途中每3天20%概率触发健康风险",
    trigger: { travelActive: true },
    chancePerDay: 0.2,
    dayInterval: 3,
    action: {
      type: "message",
      level: "warning",
      textFn: function (st) {
        var illnesses = [
          {
            name: "水土不服",
            effect: -3,
            msg: "🥴 水土不服，上吐下泻，健康-3。",
          },
          {
            name: "食物中毒",
            effect: -5,
            msg: "🤢 吃了不干净的路边摊，食物中毒，健康-5！",
          },
          { name: "旅途感冒", effect: -2, msg: "🤧 气候变化感冒了，健康-2。" },
        ];
        var evt = illnesses[Random.int(0, illnesses.length - 1)];
        st.status = st.status || {};
        st.status.health = Math.max(0, (st.status.health || 100) + evt.effect);
        if (st.medical && st.medical.insurance) {
          st.status.health = Math.min(100, st.status.health + 2);
          return evt.msg + "（医保报销了部分药费，伤害-2）";
        }
        return evt.msg;
      },
    },
  },
  // === 6. 旅行 → 法律联动（带随机） ===
  {
    id: "travel_legal_risk",
    desc: "旅行途中每5天10%概率触发法律事件",
    trigger: { travelActive: true },
    chancePerDay: 0.1,
    dayInterval: 5,
    action: {
      type: "message",
      level: "warning",
      textFn: function (st) {
        var events = [
          { msg: "🚔 在异地因不熟悉交通规则被罚款¥200。", fine: 200 },
          {
            msg: "📋 住宿纠纷：旅馆多收了费用，维权成功，退还¥150。",
            fine: -150,
          },
          { msg: "🗑️ 随地扔垃圾被市容处罚¥50。", fine: 50 },
        ];
        var evt = events[Random.int(0, events.length - 1)];
        if (evt.fine > 0) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - evt.fine);
        } else {
          st.resources.cash = (st.resources.cash || 0) + Math.abs(evt.fine);
        }
        return evt.msg;
      },
    },
  },
];

/**
 * 检查单条规则的触发条件和前置条件
 */
function _checkLinkageTrigger(st, rule) {
  var tr = rule.trigger;
  if (!tr) return false;
  if (tr.flag && !(st.flags && st.flags[tr.flag])) return false;
  if (tr.notFlag && st.flags && st.flags[tr.notFlag]) return false;
  if (tr.stat) {
    if (tr.stat === "health") {
      var h = st.status && st.status.health;
      if (h === undefined) return false;
      if (tr.op === "<" && !(h < tr.value)) return false;
      if (tr.op === ">" && !(h > tr.value)) return false;
    }
    if (tr.stat === "totalMedicalSpent") {
      if (!(st.medical && st.medical.totalMedicalSpent > tr.value))
        return false;
    }
  }
  if (rule.condition) {
    if (rule.condition.flagNot) {
      if (rule.condition.flagNot === "_hasInsurance") {
        if (st.medical && st.medical.insurance) return false;
      }
    }
    if (rule.condition.stat) {
      var cv =
        rule.condition.stat === "health" ? st.status && st.status.health : 0;
      if (cv === undefined) return false;
      if (rule.condition.op === "<" && !(cv < rule.condition.value))
        return false;
    }
  }
  if (tr.travelActive && !(st.travel && st.travel.active)) return false;
  return true;
}

/**
 * 执行联动规则 — 替代原有的 6 个硬编码 check 函数
 * 在每日管线中调用
 */
function processLinkageRules(st) {
  if (!st || !st.flags) return;
  for (var i = 0; i < LINKAGE_RULES.length; i++) {
    var rule = LINKAGE_RULES[i];
    try {
      if (!_checkLinkageTrigger(st, rule)) continue;
      if (rule.chancePerDay !== undefined) {
        var day = st.player && st.player.day;
        if (!day || day % rule.dayInterval !== 0) continue;
        if (typeof Random === "undefined" || !Random.chance(rule.chancePerDay))
          continue;
      }
      if (rule.onActivate) rule.onActivate(st);
      if (
        rule.action &&
        rule.action.type === "message" &&
        typeof StateManager !== "undefined"
      ) {
        var msgText =
          rule.action.text ||
          (rule.action.textFn ? rule.action.textFn(st) : "");
        if (msgText)
          StateManager.addMessage(msgText, rule.action.level || "info");
      }
    } catch (e) {
      console.warn("LINKAGE_RULE error:", rule.id, e);
    }
  }
}

// ====== 旧函数兼容包装（委托到 LINKAGE_RULES，保持外部调用不变） ======

/**
 * 四大系统综合每日检查 — 在每日管线中统一调用
 */
function checkCrossSystemEvents(state) {
  if (!state) return;
  processLinkageRules(state);
}

// ====== 全局挂载 ======
if (typeof window !== "undefined") {
  window.LINKAGE_RULES = LINKAGE_RULES;
  window.processLinkageRules = processLinkageRules;
  window.checkLifeNodeMedicalEvents = checkLifeNodeMedicalEvents;
  window.checkLifeNodeNarrativeFeedback = checkLifeNodeNarrativeFeedback;
  window.checkTravelMedicalEvents = checkTravelMedicalEvents;
  window.checkMedicalLegalEvents = checkMedicalLegalEvents;
  window.checkTravelLegalEvents = checkTravelLegalEvents;
  window.checkLifeNodeTravelEvents = checkLifeNodeTravelEvents;
  window.checkCrossSystemEvents = checkCrossSystemEvents;
}

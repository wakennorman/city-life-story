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
  if (!state || !state.flags) return;

  // 35岁危机 → 健康风险增加
  if (
    state.flags._lifeNode_midlife_crisis_done &&
    !state.flags._midlifeHealthWarning
  ) {
    var health = state.status && state.status.health;
    if (health !== undefined && health < 60) {
      state.flags._midlifeHealthWarning = true;
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "⚠️ 35岁之后身体大不如前，健康仅" + health + "，建议体检和买医保！",
          "warning",
        );
      }
    }
  }

  // 退休节点 → 强制健康检查
  if (
    state.flags._lifeNode_retirement_done &&
    !state.flags._retirementHealthCheck
  ) {
    state.flags._retirementHealthCheck = true;
    var h = state.status && state.status.health;
    if (h !== undefined && h < 50) {
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "🏥 退休了，但身体已透支（健康仅" +
            h +
            "）。好好休养，别让晚年都在医院度过。",
          "danger",
        );
      }
    }
  }

  // 高考/大学毕业 → 压力释放（健康微调）
  if (state.flags._lifeNode_gaokao_done && !state.flags._gaokaoRecovery) {
    state.flags._gaokaoRecovery = true;
    state.status = state.status || {};
    state.status.health = Math.min(100, (state.status.health || 100) + 5);
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage("🍃 高考结束，如释重负，健康+5。", "success");
    }
  }
}

// ====== 2. 旅行 → 医疗联动 ======

/**
 * 旅行过程中触发医疗事件（水土不服、意外伤害）
 * 在 tickTravel 中调用
 */
function checkTravelMedicalEvents(state) {
  if (!state || !state.travel || !state.travel.active) return;
  if (typeof Random === "undefined") return;

  // 每3天一次健康风险判定
  var day = state.player && state.player.day;
  if (day && day % 3 === 0 && Random.chance(0.2)) {
    var travelIllnesses = [
      {
        name: "水土不服",
        effect: "health-3",
        msg: "🥴 水土不服，上吐下泻，健康-3。",
      },
      {
        name: "食物中毒",
        effect: "health-5",
        msg: "🤢 吃了不干净的路边摊，食物中毒，健康-5！",
      },
      {
        name: "旅途感冒",
        effect: "health-2",
        msg: "🤧 气候变化感冒了，健康-2。",
      },
    ];
    var evt = travelIllnesses[Random.int(0, travelIllnesses.length - 1)];
    state.status = state.status || {};
    state.status.health = Math.max(
      0,
      (state.status.health || 100) -
        parseInt(evt.effect.replace("health-", "")),
    );

    // 有医保时减轻伤害
    if (state.medical && state.medical.insurance) {
      state.status.health = Math.min(100, state.status.health + 2);
      evt.msg += "（医保报销了部分药费，伤害-2）";
    }

    if (typeof StateManager !== "undefined") {
      StateManager.addMessage(evt.msg, "warning");
    }
  }
}

// ====== 3. 医疗 → 法律联动 ======

/**
 * 医疗纠纷：治疗失败或大病后可能触发法律纠纷
 * 在每日医疗tick后调用
 */
function checkMedicalLegalEvents(state) {
  if (!state || !state.medical) return;
  if (typeof Random === "undefined") return;

  // 医疗总花费超过¥10,000且未购买保险 → 可能寻求法律援助
  var totalSpent = state.medical.totalMedicalSpent || 0;
  if (
    totalSpent > 10000 &&
    !state.medical.insurance &&
    !state.flags._medicalLegalAdvice
  ) {
    state.flags._medicalLegalAdvice = true;
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage(
        "⚖️ 医疗费用已累计¥" +
          totalSpent +
          "！没有医保的情况下，建议去「法律咨询」了解是否有减免政策。",
        "warning",
      );
    }
  }

  // 大病后（健康<30）触发医疗费用焦虑
  var health = state.status && state.status.health;
  if (
    health !== undefined &&
    health < 30 &&
    !state.flags._criticalHealthWarning
  ) {
    state.flags._criticalHealthWarning = true;
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage(
        "💀 健康已跌至" +
          health +
          "！若再恶化可能需要法律援助——生前预嘱/医疗授权。",
        "danger",
      );
    }
  }
}

// ====== 4. 旅行 → 法律联动 ======

/**
 * 旅行中可能触发法律事件（纠纷、违规）
 * 在 tickTravel 中调用
 */
function checkTravelLegalEvents(state) {
  if (!state || !state.travel || !state.travel.active) return;
  if (typeof Random === "undefined") return;

  // 每5天一次法律风险判定
  var day = state.player && state.player.day;
  if (day && day % 5 === 0 && Random.chance(0.1)) {
    var travelLegalEvents = [
      { msg: "🚔 在异地因不熟悉交通规则被罚款¥200。", fine: 200 },
      { msg: "📋 住宿纠纷：旅馆多收了费用，维权成功，退还¥150。", fine: -150 },
      { msg: "🗑️ 随地扔垃圾被市容处罚¥50。", fine: 50 },
    ];
    var evt = travelLegalEvents[Random.int(0, travelLegalEvents.length - 1)];
    if (evt.fine > 0) {
      state.resources.cash = Math.max(
        0,
        (state.resources.cash || 0) - evt.fine,
      );
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(evt.msg, "warning");
      }
    } else {
      state.resources.cash = (state.resources.cash || 0) + Math.abs(evt.fine);
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(evt.msg, "success");
      }
    }
  }
}

// ====== 5. 人生节点 → 旅行联动 ======

/**
 * 关键人生节点后触发旅行建议/机会
 * 在 checkLifeNodes 后调用
 */
function checkLifeNodeTravelEvents(state) {
  if (!state || !state.flags) return;

  // 退休后解锁旅行机会
  if (
    state.flags._lifeNode_retirement_done &&
    !state.flags._retirementTravelTip
  ) {
    state.flags._retirementTravelTip = true;
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage(
        "🌅 退休了！终于有时间去看看这个世界。去「人生事务」Tab规划一次长途旅行吧！",
        "info",
      );
    }
  }

  // 大学毕业后（如果玩家有大学节点），解锁更多旅行目的地
  if (state.flags._lifeNode_university_done && !state.flags._gradTravelTip) {
    state.flags._gradTravelTip = true;
    if (typeof StateManager !== "undefined") {
      StateManager.addMessage(
        "🎓 毕业旅行是青春的一部分！去「人生事务」Tab看看旅行目的地吧。",
        "info",
      );
    }
  }
}

// ====== 6. 综合每日检查 ======

/**
 * 四大系统综合每日检查
 * 在每日管线中统一调用，避免每个系统独立遍历
 */
function checkCrossSystemEvents(state) {
  if (!state) return;
  checkLifeNodeMedicalEvents(state);
  checkTravelMedicalEvents(state);
  checkMedicalLegalEvents(state);
  checkTravelLegalEvents(state);
  checkLifeNodeTravelEvents(state);
}

// ====== 全局挂载 ======
if (typeof window !== "undefined") {
  window.checkLifeNodeMedicalEvents = checkLifeNodeMedicalEvents;
  window.checkTravelMedicalEvents = checkTravelMedicalEvents;
  window.checkMedicalLegalEvents = checkMedicalLegalEvents;
  window.checkTravelLegalEvents = checkTravelLegalEvents;
  window.checkLifeNodeTravelEvents = checkLifeNodeTravelEvents;
  window.checkCrossSystemEvents = checkCrossSystemEvents;
}

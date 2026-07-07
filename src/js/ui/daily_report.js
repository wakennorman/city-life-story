/**
 * 每日收支报告模块
 *
 * 在每天结束时展示收入/支出明细弹窗，玩家必须点击"继续"才能进入下一天。
 *
 * 设计参考：
 * - 《大多数》：收支持清晰分栏，净收入高亮
 * - 《北京浮生记》：债务/房租红色警示
 * - 《This War of Mine》：强制交互才能继续
 * - 《Stardew Valley》：图标+分类汇总
 */

// ====== 分类标签映射 ======
var CATEGORY_LABELS = {
  // 收入
  job_income: "外快",
  salary: "工资",
  trade_profit: "贸易",
  scavenge: "拾荒",
  side_job: "兼职",
  investment_income: "投资",
  bank_interest: "利息",
  event_reward: "事件",
  gift: "礼物",
  loan: "贷款",
  insurance: "保险",
  // 支出
  food: "饮食",
  rent: "房租",
  transport: "交通",
  shopping: "购物",
  training: "培训",
  healthcare: "医疗",
  debt_interest: "债息",
  fine: "罚款",
  entertainment: "娱乐",
  misc: "其他",
};

var CATEGORY_ICONS = {
  // 收入
  job_income: "💰",
  salary: "🏢",
  trade_profit: "📦",
  scavenge: "🔍",
  side_job: "💼",
  investment_income: "📈",
  bank_interest: "🏦",
  event_reward: "🏆",
  gift: "🎁",
  loan: "📝",
  insurance: "🛡️",
  // 支出
  food: "🍔",
  rent: "🏠",
  transport: "🚌",
  shopping: "🛒",
  training: "📚",
  healthcare: "🏥",
  debt_interest: "💸",
  fine: "⚠️",
  entertainment: "🎵",
  misc: "💬",
};

/** 获取分类的中文标签 */
function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}

/** 获取分类的图标 */
function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || "💰";
}

// ====== 对账兜底 ======
/**
 * 对比跟踪交易总额与实际现金变化，补充未记录条目。
 * 未接线的现金变动不再伪造成真实收入/支出，只作为对账提示展示。
 */
function reconcileTransactions(state) {
  var txs = state.flags._dailyTransactions || [];
  var trackedDelta = 0;
  for (var i = 0; i < txs.length; i++) {
    trackedDelta += txs[i].type === "income" ? txs[i].amount : -txs[i].amount;
  }

  var startCash = state.flags._dayStartCash || 0;
  var actualDelta = (state.resources.cash || 0) - startCash;
  var discrepancy = Math.round((actualDelta - trackedDelta) * 100) / 100;

  if (Math.abs(discrepancy) <= 1) {
    return null;
  }
  return {
    amount: Math.round(discrepancy),
    trackedDelta: Math.round(trackedDelta),
    actualDelta: Math.round(actualDelta),
  };
}

// ====== 构建报告 HTML ======
/**
 * 按类型分类交易并生成排序后的HTML
 */
function buildReportHTML(txs, state, reconcileInfo) {
  var incomes = [];
  var expenses = [];
  for (var i = 0; i < txs.length; i++) {
    var t = txs[i];
    if (t.type === "income") {
      incomes.push(t);
    } else {
      expenses.push(t);
    }
  }

  var incomeTotal = 0;
  var incomeHtml = "";
  for (var j = 0; j < incomes.length; j++) {
    var inc = incomes[j];
    incomeTotal += inc.amount;
    incomeHtml += buildItemRow(inc, "income");
  }

  var expenseTotal = 0;
  var expenseHtml = "";
  for (var k = 0; k < expenses.length; k++) {
    var exp = expenses[k];
    expenseTotal += exp.amount;
    expenseHtml += buildItemRow(exp, "expense");
  }

  var netAmount = incomeTotal - expenseTotal;
  var netClass =
    netAmount > 0 ? "positive" : netAmount < 0 ? "negative" : "zero";
  var netSign = netAmount >= 0 ? "+" : "";
  var netStr = netSign + "¥" + netAmount.toLocaleString();

  var reportDay = state.player.day - 1; // day_increment 已执行，减1得到实际报告日
  var cash = state.resources.cash || 0;
  var bank = state.resources.bankBalance || 0;

  // 生成今日总结
  var summaryText = generateDailyReportSummary(state, incomes, expenses);

  // 生成今日高光时刻 + 明日展望（峰终定律增强）
  var peakHTML = generatePeakMomentHTML(state, incomes, expenses);
  var tomorrowHTML = generateTomorrowPreviewHTML(state);

  // 如果没有交易记录
  var hasIncome = incomes.length > 0;
  var hasExpense = expenses.length > 0;

  var bodyHtml = "";

  // 标题
  bodyHtml += '<div style="text-align:center;margin-bottom:16px;">';
  bodyHtml +=
    '<div style="font-size:20px;font-weight:700;color:var(--text-primary);">📊 第' +
    reportDay +
    "天收支报告</div>";
  bodyHtml +=
    '<div style="font-size:12px;color:var(--text-muted);margin-top:4px;">● 收入 绿 · 支出 红 · 点击“继续”进入下一天</div>';
  bodyHtml += "</div>";

  // 收入区域
  bodyHtml += '<div class="daily-report-section" style="margin-bottom:14px;">';
  bodyHtml +=
    '<div class="daily-report-section-title income" style="font-size:14px;font-weight:700;margin-bottom:6px;padding-bottom:3px;border-bottom:2px solid var(--success);color:var(--success);">🟢 收入</div>';
  if (hasIncome) {
    bodyHtml +=
      '<div style="max-height:180px;overflow-y:auto;padding-right:4px;">';
    bodyHtml += incomeHtml;
    bodyHtml += "</div>";
  } else {
    bodyHtml +=
      '<div style="font-size:12px;color:var(--text-muted);padding:8px 0;text-align:center;">今天没有收入</div>';
  }
  bodyHtml +=
    '<div class="daily-report-section-total income" style="display:flex;justify-content:space-between;padding:5px 0 2px;margin-top:3px;border-top:1px dashed var(--border);font-weight:700;font-size:14px;color:var(--success);">';
  bodyHtml +=
    "<span>收入合计</span><span>+¥" + incomeTotal.toLocaleString() + "</span>";
  bodyHtml += "</div>";
  bodyHtml += "</div>";

  // 支出区域
  bodyHtml += '<div class="daily-report-section" style="margin-bottom:14px;">';
  bodyHtml +=
    '<div class="daily-report-section-title expense" style="font-size:14px;font-weight:700;margin-bottom:6px;padding-bottom:3px;border-bottom:2px solid var(--danger);color:var(--danger);">🔴 支出</div>';
  if (hasExpense) {
    bodyHtml +=
      '<div style="max-height:180px;overflow-y:auto;padding-right:4px;">';
    bodyHtml += expenseHtml;
    bodyHtml += "</div>";
  } else {
    bodyHtml +=
      '<div style="font-size:12px;color:var(--text-muted);padding:8px 0;text-align:center;">今天没有支出</div>';
  }
  bodyHtml +=
    '<div class="daily-report-section-total expense" style="display:flex;justify-content:space-between;padding:5px 0 2px;margin-top:3px;border-top:1px dashed var(--border);font-weight:700;font-size:14px;color:var(--danger);">';
  bodyHtml +=
    "<span>支出合计</span><span>-¥" + expenseTotal.toLocaleString() + "</span>";
  bodyHtml += "</div>";
  bodyHtml += "</div>";

  // 净收入
  bodyHtml +=
    '<div class="daily-report-net ' +
    netClass +
    '" style="text-align:center;padding:10px 0;margin:8px 0;border-top:2px solid var(--border);border-bottom:1px solid var(--border);font-size:18px;font-weight:700;">';
  bodyHtml +=
    '净收入: <span style="' +
    (netAmount >= 0 ? "color:var(--success)" : "color:var(--danger)") +
    '">' +
    netStr +
    "</span>";
  bodyHtml += "</div>";

  // 财富摘要
  bodyHtml +=
    '<div class="daily-report-wealth" style="display:flex;justify-content:center;gap:20px;font-size:13px;color:var(--text-secondary);margin-top:4px;margin-bottom:8px;">';
  bodyHtml +=
    '<span>💰 现金: <strong style="color:var(--text-primary);">¥' +
    cash.toLocaleString() +
    "</strong></span>";
  bodyHtml +=
    '<span>🏦 储蓄: <strong style="color:var(--text-primary);">¥' +
    bank.toLocaleString() +
    "</strong></span>";
  bodyHtml += "</div>";

  // 今日高光时刻（峰终定律 — 凸显今日最难忘瞬间）
  bodyHtml +=
    '<div class="daily-report-peak" style="text-align:center;padding:8px 0;margin:4px 0;border-top:1px solid var(--border);font-size:13px;line-height:1.6;">';
  bodyHtml += peakHTML;
  bodyHtml += "</div>";

  // 明日展望（留存钩子 — 让玩家期待明天）
  if (tomorrowHTML) {
    bodyHtml +=
      '<div class="daily-report-tomorrow" style="padding:6px 0;margin:2px 0 4px;border-top:1px solid var(--border);font-size:12px;line-height:1.5;">';
    bodyHtml += tomorrowHTML;
    bodyHtml += "</div>";
  }

  // 今日总结
  bodyHtml +=
    '<div class="daily-report-summary" style="font-size:12px;color:var(--text-secondary);text-align:center;padding:6px 0;font-style:italic;border-top:1px solid var(--border);">';
  bodyHtml += summaryText;
  bodyHtml += "</div>";

  if (reconcileInfo) {
    // 调试信息：仅 console 记录，不展示给玩家
    console.log(
      "[daily_report] 现金流水偏差 ¥" +
        reconcileInfo.amount +
        "（跟踪:" +
        reconcileInfo.trackedDelta +
        " 实际:" +
        reconcileInfo.actualDelta +
        "）— 已自动修正。",
    );
  }

  return bodyHtml;
}

/** 构建单条收支记录行 */
function buildItemRow(tx, type) {
  var sign = type === "income" ? "+" : "-";
  var color = type === "income" ? "var(--success)" : "var(--danger)";
  var icon = getCategoryIcon(tx.category);
  var label = getCategoryLabel(tx.category);

  return (
    '<div class="daily-report-item" style="display:flex;align-items:center;padding:3px 0;font-size:13px;">' +
    '<span class="daily-report-item-icon" style="width:20px;text-align:center;flex-shrink:0;">' +
    icon +
    "</span>" +
    '<span class="daily-report-item-cat" style="font-size:10px;color:var(--text-muted);min-width:32px;text-align:center;flex-shrink:0;background:var(--bg-card);padding:1px 4px;border-radius:3px;margin:0 6px;">' +
    label +
    "</span>" +
    '<span class="daily-report-item-desc" style="flex:1;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;">' +
    escapeHtml(tx.description) +
    "</span>" +
    '<span class="daily-report-item-amount" style="font-weight:700;white-space:nowrap;text-align:right;min-width:70px;color:' +
    color +
    ';">' +
    sign +
    "¥" +
    tx.amount.toLocaleString() +
    "</span>" +
    "</div>"
  );
}

/** 简单的HTML转义 */
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ====== 峰终定律增强：今日高光时刻 ======
/**
 * 生成"今日高光"叙事HTML — 提炼每日最值得记住的瞬间
 *
 * 设计参考：峰终定律 — 人们体验评价主要取决于峰值和终点。
 * 本函数锚定"今天最高兴/最难忘的事"作为当日之峰。
 */
function generatePeakMomentHTML(state, incomes, expenses) {
  var day = state.player.day - 1; // day_increment 已执行
  var highlights = [];

  // 1. 收入高峰 — 单笔最大收入
  var maxIncome = 0,
    maxIncomeDesc = "";
  for (var i = 0; i < incomes.length; i++) {
    if (incomes[i].amount > maxIncome) {
      maxIncome = incomes[i].amount;
      maxIncomeDesc = incomes[i].description || "";
    }
  }
  if (maxIncome >= 500) {
    highlights.push({
      icon: "💰",
      text:
        "今天最大一笔收入 <strong>¥" +
        maxIncome.toLocaleString() +
        "</strong>" +
        (maxIncomeDesc ? "（" + escapeHtml(maxIncomeDesc) + "）" : ""),
      type: "positive",
    });
  } else if (maxIncome >= 100) {
    highlights.push({
      icon: "💵",
      text:
        "今天收入了 <strong>¥" +
        maxIncome.toLocaleString() +
        "</strong>" +
        (maxIncomeDesc ? "（" + escapeHtml(maxIncomeDesc) + "）" : ""),
      type: "positive",
    });
  }

  // 1b. 连续工作天数展示（禀赋效应 — 让玩家珍惜连续记录）
  var streak = state.flags._workStreak || 0;
  if (streak >= 3) {
    var streakIcon =
      streak >= 100 ? "👑" : streak >= 30 ? "💪" : streak >= 10 ? "🔥" : "📋";
    var streakText =
      streak >= 100
        ? "劳动模范 · 连续工作 <strong>" + streak + "</strong> 天！"
        : "已连续工作 <strong>" + streak + "</strong> 天";
    highlights.push({ icon: streakIcon, text: streakText, type: "positive" });
  }

  // 2. 里程碑检测
  if (day === 7) {
    highlights.push({
      icon: "🏫",
      text: "来这座城市整整一周了！",
      type: "milestone",
    });
  } else if (day === 30) {
    highlights.push({
      icon: "🎉",
      text: "整整一个月，你还在这里！",
      type: "milestone",
    });
  } else if (day === 100) {
    highlights.push({
      icon: "💪",
      text: "百天不倒！城市没有把你打倒！",
      type: "milestone",
    });
  } else if (day === 365) {
    highlights.push({
      icon: "🌟",
      text: "一年了！从零到今天，你走了很远！",
      type: "milestone",
    });
  }

  // 3. 累计收入里程碑
  var totalEarned = (state.resources && state.resources.totalEarned) || 0;
  if (totalEarned >= 100000 && !state.flags._peakNoted100k) {
    highlights.push({
      icon: "🏆",
      text: "累计收入突破 <strong>¥100,000</strong>！真正的城市人了！",
      type: "milestone",
    });
    state.flags._peakNoted100k = true;
  } else if (totalEarned >= 10000 && !state.flags._peakNoted10k) {
    highlights.push({
      icon: "💎",
      text: "累计收入突破 <strong>¥10,000</strong>！已不是当初的穷光蛋！",
      type: "milestone",
    });
    state.flags._peakNoted10k = true;
  } else if (totalEarned >= 5000 && !state.flags._peakNoted5k) {
    highlights.push({
      icon: "💪",
      text: "累计收入 ¥5,000！站稳了脚跟！",
      type: "milestone",
    });
    state.flags._peakNoted5k = true;
  } else if (totalEarned >= 1000 && !state.flags._peakNoted1k) {
    highlights.push({
      icon: "🎯",
      text: "赚到了人生的第一个 <strong>¥1,000</strong>！",
      type: "milestone",
    });
    state.flags._peakNoted1k = true;
  }

  // 4. 健康/债务预警（损失厌恶）
  var health = (state.status && state.status.health) || 100;
  if (health < 20) {
    highlights.push({
      icon: "🚑",
      text: "健康严重下滑！明天必须去医院！",
      type: "danger",
    });
  } else if (health < 40) {
    highlights.push({
      icon: "😷",
      text: "身体不太舒服，明天注意休息。",
      type: "warning",
    });
  }
  var debt = state.resources.villageDebt || 0;
  if (debt > 0 && day % 10 === 0) {
    highlights.push({
      icon: "📝",
      text:
        "村长那 <strong>¥" + debt.toLocaleString() + "</strong> 的债还在...",
      type: "neutral",
    });
  }

  // 5. 情感收尾 — 如果没有任何高光，给一个温暖的平凡日描述
  if (highlights.length === 0) {
    highlights.push({
      icon: "🌙",
      text: "平凡的一天，但你依然在努力活着。",
      type: "neutral",
    });
  }

  // 选1-2条展示（优先级：milestone > positive > danger > warning > neutral）
  var sorted = highlights.sort(function (a, b) {
    var rank = { milestone: 0, positive: 1, danger: 2, warning: 3, neutral: 4 };
    return (rank[a.type] || 9) - (rank[b.type] || 9);
  });
  var shown = sorted.slice(0, Math.min(2, sorted.length));

  return (
    '<div style="font-weight:600;color:var(--text-primary);margin-bottom:4px;">🏆 今日高光</div>' +
    shown
      .map(function (h) {
        var color =
          h.type === "positive"
            ? "var(--success)"
            : h.type === "danger"
              ? "var(--danger)"
              : h.type === "warning"
                ? "var(--warning)"
                : h.type === "milestone"
                  ? "var(--accent)"
                  : "var(--text-secondary)";
        return (
          '<div style="color:' +
          color +
          ';padding:1px 0;">' +
          h.icon +
          " " +
          h.text +
          "</div>"
        );
      })
      .join("")
  );
}

/**
 * 生成"明日展望"HTML — 天气预报 + 生存建议（留存钩子）
 *
 * 设计参考：
 * - 峰终定律：在"终"处给出积极期待，让玩家愿意明天回来
 * - Stardew Valley：每天播报明日天气
 * - 大多数：任务预告系统
 */
function generateTomorrowPreviewHTML(state) {
  var parts = [];

  // 1. 天气预报（如果有）
  var forecastHTML = "";
  if (typeof getForecastHTML === "function") {
    forecastHTML = getForecastHTML(state);
  }
  if (forecastHTML) {
    parts.push(forecastHTML);
  }

  // 2. 基于状态的最低需求建议（损失厌恶 — 提醒玩家避免惩罚）
  var needs = state.needs || {};
  var suggestions = [];
  if (needs.hunger !== undefined && needs.hunger < 25) {
    suggestions.push(
      "🍚 饿了一天了，明天先去吃个饱饭（饥饿" + needs.hunger + "/100）",
    );
  }
  if (needs.fatigue !== undefined && needs.fatigue > 70) {
    suggestions.push(
      "😴 太累了！明天少跑点，优先睡一觉（疲劳" + needs.fatigue + "/100）",
    );
  }
  if (needs.health !== undefined && needs.health < 35) {
    suggestions.push("🏥 身体快扛不住了！明天去医院看看吧！");
  }
  if (needs.hygiene !== undefined && needs.hygiene < 20) {
    suggestions.push("🚿 卫生太差了，去澡堂洗个澡吧。");
  }

  if (suggestions.length > 0) {
    // 最多显示1条最紧急的
    parts.push(
      '<div style="color:var(--warning);margin-top:4px;font-size:11px;">💡 ' +
        suggestions[0] +
        "</div>",
    );
  }

  // 3. 持续天数情感锚点
  var day = state.player.day || 1;
  var streakEmoji =
    day <= 7 ? "🌱" : day <= 30 ? "🌿" : day <= 100 ? "🌳" : "🌲";
  parts.push(
    '<div style="color:var(--text-muted);margin-top:4px;font-size:11px;text-align:center;">' +
      streakEmoji +
      " 第 <strong>" +
      day +
      "</strong> 天 · 明天继续加油 💪</div>",
  );

  // 4. 阶段收尾情感句
  if (day === 1) {
    parts.push(
      '<div style="color:var(--accent);margin-top:2px;font-size:11px;font-style:italic;text-align:center;">这是你在城市的第一步，明天会更好。</div>',
    );
  } else if (day === 30) {
    parts.push(
      '<div style="color:var(--accent);margin-top:2px;font-size:11px;font-style:italic;text-align:center;">一个月了，这座城市开始认识你了。</div>',
    );
  } else if (day === 100) {
    parts.push(
      '<div style="color:var(--accent);margin-top:2px;font-size:11px;font-style:italic;text-align:center;">一百天，你已经不是当初来时的你了。</div>',
    );
  }

  return parts.join("");
}

// ====== 今日总结 ======
/**
 * 沿用现有 generateDailySummary 的叙事风格，
 * 从已记录的交易中提炼一句话总结。
 */
function generateDailyReportSummary(state, incomes, expenses) {
  var incomeTotal = 0;
  var expenseTotal = 0;
  for (var i = 0; i < incomes.length; i++) {
    incomeTotal += incomes[i].amount;
  }
  for (var j = 0; j < expenses.length; j++) {
    expenseTotal += expenses[j].amount;
  }

  var net = incomeTotal - expenseTotal;
  var reportDay = state.player.day - 1; // day_increment 已执行，减1得到实际报告日

  var highlights = [];

  if (net >= 1000) {
    highlights.push("🎉 今天是个好日子，净赚了¥" + net.toLocaleString());
  } else if (net >= 300) {
    highlights.push("😊 今天赚了¥" + net.toLocaleString() + "，还不错");
  } else if (net >= 50) {
    highlights.push("😊 今天净入¥" + net.toLocaleString() + "，比昨天强点");
  } else if (net >= 0) {
    highlights.push("🧐 今天收支基本持平，活下来了");
  } else if (net < -500) {
    highlights.push(
      "😭 今天支出不少，净亏了¥" + Math.abs(net).toLocaleString(),
    );
  } else if (net < 0) {
    highlights.push(
      "😅 今天支出略多，口袋瘦了¥" + Math.abs(net).toLocaleString(),
    );
  }

  // 里程碑
  if (reportDay === 7) highlights.push("🏫 来这座城市整整一周了");
  else if (reportDay === 30) highlights.push("🎉 整整一个月，你还在");
  else if (reportDay === 100) highlights.push("💪 百天了，城市没把你打倒");
  else if (reportDay === 365) highlights.push("🌟 一年了，从头到今天");

  var totalEarned = (state.resources && state.resources.totalEarned) || 0;
  var maxEarned = state.flags._maxEarnedMilestone || 0;
  if (totalEarned >= 10000 && maxEarned < 10000) {
    highlights.push("💰 累计收入破万！你已经不是穷光蛋了");
    state.flags._maxEarnedMilestone = 10000;
  } else if (totalEarned >= 5000 && maxEarned < 5000) {
    highlights.push("💵 累计收入五千，站稳了脚跟");
    state.flags._maxEarnedMilestone = 5000;
  } else if (totalEarned >= 1000 && maxEarned < 1000) {
    highlights.push("💴 赚到第一个一千块");
    state.flags._maxEarnedMilestone = 1000;
  }
  if (state.player && state.player.phase === "corporate") {
    if (!state.flags._corpMilestoneReached) {
      highlights.push("🏢 进入职场！新的人生阶段开始了");
      state.flags._corpMilestoneReached = true;
    }
  }

  // 30天回顾
  if (reportDay > 0 && reportDay % 30 === 0 && state.flags._cashHistory) {
    var history = state.flags._cashHistory;
    var prevCash = 0;
    for (var h = history.length - 1; h >= 0; h--) {
      if (history[h].day === reportDay - 30) {
        prevCash = history[h].value || history[h].cash || 0;
        break;
      }
    }
    var diff =
      state.resources.cash + (state.resources.bankBalance || 0) - prevCash;
    if (diff > 0) {
      highlights.push("📈 过去30天财富增长 ¥" + diff.toLocaleString());
    } else if (diff < 0) {
      highlights.push(
        "📉 过去30天财富缩水 ¥" + Math.abs(diff).toLocaleString(),
      );
    }
  }

  if (!highlights.length) highlights.push("🌛 平凡的一天，活着就是赢了");

  var summary = highlights.slice(0, 2).join("，") + "。";
  return "📋 " + summary;
}

function recordDailyReportHistory(state, txs) {
  if (!state.history) state.history = {};
  if (!Array.isArray(state.history.income)) state.history.income = [];
  if (!Array.isArray(state.history.expense)) state.history.expense = [];
  if (!state.flags._cashHistory) state.flags._cashHistory = [];

  var income = 0;
  var expense = 0;
  for (var i = 0; i < txs.length; i++) {
    var t = txs[i];
    if (t.type === "income") income += t.amount || 0;
    else if (t.type === "expense") expense += t.amount || 0;
  }

  var reportDay = Math.max(1, (state.player.day || 1) - 1);
  var index = reportDay - 1;
  state.history.income[index] = income;
  state.history.expense[index] = expense;
  if (state.history.income.length > 180) {
    state.history.income = state.history.income.slice(-180);
    state.history.expense = state.history.expense.slice(-180);
  }

  var totalAsset =
    (state.resources.cash || 0) + (state.resources.bankBalance || 0);
  var cashHistory = state.flags._cashHistory;
  var last = cashHistory[cashHistory.length - 1];
  if (last && last.day === reportDay) {
    last.value = totalAsset;
  } else {
    cashHistory.push({ day: reportDay, value: totalAsset });
  }
  if (cashHistory.length > 180) {
    state.flags._cashHistory = cashHistory.slice(-180);
  }
}

// ====== 主入口 ======
/**
 * 显示每日收支报告弹窗（阻塞式 — 必须点击"继续"才能关闭）
 * 在 pipeline 的 daily_report 步骤中调用
 */
function showDailyReport(state) {
  // 游戏结束/胜利时不显示（对应 modal 优先）
  if (state.flags.gameOver || state.flags.victory) return;

  var reconcileInfo = reconcileTransactions(state);

  // 保存当日交易记录快照，然后清除（为下一天做准备）
  var txs = (state.flags._dailyTransactions || []).slice();
  recordDailyReportHistory(state, txs);
  state.flags._dailyTransactions = [];
  state.flags._dayStartCash = state.resources.cash || 0;

  var bodyHtml = buildReportHTML(txs, state, reconcileInfo);

  var overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.style.zIndex = "2000";

  var box = document.createElement("div");
  box.className = "modal-box daily-report-box";
  box.style.maxWidth = "460px";

  // 内容
  var content = document.createElement("div");
  content.innerHTML = bodyHtml;
  box.appendChild(content);

  // 按钮区
  var btnRow = document.createElement("div");
  btnRow.style.cssText =
    "display:flex;justify-content:center;margin-top:14px;padding-top:10px;border-top:1px solid var(--border);";

  var continueBtn = document.createElement("button");
  continueBtn.className = "btn btn-primary btn-lg";
  continueBtn.textContent = "📋 继续";
  continueBtn.style.cssText =
    "min-width:180px;font-size:15px;padding:10px 24px;";
  continueBtn.addEventListener("click", function () {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  });
  btnRow.appendChild(continueBtn);
  box.appendChild(btnRow);

  overlay.appendChild(box);

  // 阻止点击背景关闭
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      // 轻微抖动提示必须点击按钮
      box.style.animation = "shake 0.3s ease";
      setTimeout(function () {
        box.style.animation = "";
      }, 300);
    }
  });

  // 键盘支持：回车键继续
  continueBtn.focus();
  overlay.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      continueBtn.click();
    }
  });

  document.body.appendChild(overlay);
}

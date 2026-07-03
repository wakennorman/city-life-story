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

  // 今日总结
  bodyHtml +=
    '<div class="daily-report-summary" style="font-size:12px;color:var(--text-secondary);text-align:center;padding:6px 0;font-style:italic;border-top:1px solid var(--border);">';
  bodyHtml += summaryText;
  bodyHtml += "</div>";

  if (reconcileInfo) {
    var diff = reconcileInfo.amount;
    var diffText =
      diff > 0
        ? "现金比已记录流水多 ¥" + Math.abs(diff).toLocaleString()
        : "现金比已记录流水少 ¥" + Math.abs(diff).toLocaleString();
    bodyHtml +=
      '<div class="daily-report-reconcile" style="margin-top:8px;padding:8px 10px;border:1px dashed var(--warning);border-radius:6px;background:var(--warning-bg);font-size:11px;color:var(--text-secondary);line-height:1.45;">' +
      "⚠️ " +
      diffText +
      "。这不是自动计入的收入或支出，而是仍未接入收支流水的现金变化，后续需要继续补埋点。" +
      "</div>";
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

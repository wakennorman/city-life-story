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
 * 确保收支报告永远平衡。
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

  // 允许 ¥1 以内浮点误差
  if (discrepancy > 1) {
    txs.push({
      type: "income",
      category: "misc",
      amount: Math.round(discrepancy),
      description: "其他收入",
    });
  } else if (discrepancy < -1) {
    txs.push({
      type: "expense",
      category: "misc",
      amount: Math.round(Math.abs(discrepancy)),
      description: "其他支出",
    });
  }
}

// ====== 构建报告 HTML ======
/**
 * 按类型分类交易并生成排序后的HTML
 */
function buildReportHTML(txs, state) {
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

  if (!highlights.length) highlights.push("🌛 平凡的一天，活着就是赢了");

  var summary = highlights.slice(0, 2).join("，") + "。";
  return "📋 " + summary;
}

// ====== 主入口 ======
/**
 * 显示每日收支报告弹窗（阻塞式 — 必须点击"继续"才能关闭）
 * 在 pipeline 的 daily_report 步骤中调用
 */
function showDailyReport(state) {
  // 游戏结束/胜利时不显示（对应 modal 优先）
  if (state.flags.gameOver || state.flags.victory) return;

  // 对账：确保收支平衡（会在 _dailyTransactions 中追加对账条目）
  reconcileTransactions(state);

  // 保存当日交易记录快照，然后清除（为下一天做准备）
  var txs = (state.flags._dailyTransactions || []).slice();
  state.flags._dailyTransactions = [];

  var bodyHtml = buildReportHTML(txs, state);

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

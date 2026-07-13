/**
 * 副业UI（v3.6 P0-3）
 *
 * 副业Tab界面 + 副业状态卡片
 */

// ====== 副业Tab渲染 ======
function renderSideHustleTab(state, parent) {
  if (!parent) return;
  parent.innerHTML = "";

  // 获取副业数据
  const hustleList = typeof SIDE_HUSTLES !== "undefined" ? SIDE_HUSTLES : {};
  const fatigue =
    typeof sideHustle !== "undefined"
      ? sideHustle.getFatigue(state)
      : { fatigue: 0, max: 100, status: "normal" };

  // 标题
  const header = document.createElement("div");
  header.innerHTML = "<h3>💼 副业</h3>";
  header.style.cssText =
    "padding:12px;background:var(--bg-secondary);border-bottom:1px solid var(--border);";
  parent.appendChild(header);

  // 疲劳度状态
  const fatigueBar = document.createElement("div");
  fatigueBar.style.cssText =
    "padding:12px;background:var(--bg-secondary);margin:12px;border-radius:6px;";
  const fatigueColor =
    fatigue.status === "exhausted"
      ? "var(--danger)"
      : fatigue.status === "warning"
        ? "var(--warning)"
        : "var(--success)";
  const fatigueIcon =
    fatigue.status === "exhausted"
      ? "😫"
      : fatigue.status === "warning"
        ? "⚠️"
        : "💪";
  fatigueBar.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <span style="font-size:14px;">${fatigueIcon} 副业疲劳度</span>
      <span style="font-size:12px;color:var(--text-muted);">
        ${fatigue.fatigue}/${fatigue.max}${fatigue.penalty > 0 ? `（惩罚-${Math.round(fatigue.penalty * 100)}%）` : ""}
      </span>
    </div>
    <div style="height:8px;background:var(--bg-dark);border-radius:4px;overflow:hidden;">
      <div style="height:100%;width:${(fatigue.fatigue / fatigue.max) * 100}%;background:${fatigueColor};transition:width 0.3s;"></div>
    </div>
    <p style="font-size:11px;color:var(--text-muted);margin-top:8px;">
      每天自然恢复10点。疲劳度过高会影响副业收入。
    </p>
  `;
  parent.appendChild(fatigueBar);

  // 副业列表
  const list = document.createElement("div");
  list.className = "hustle-grid";

  for (let hustleId in hustleList) {
    const hustle = hustleList[hustleId];
    const check =
      typeof sideHustle !== "undefined"
        ? sideHustle.check(hustleId, state)
        : { ok: false, reason: "系统未加载" };
    const details =
      typeof sideHustle !== "undefined" &&
      typeof sideHustle.checkDetailed === "function"
        ? sideHustle.checkDetailed(hustleId, state)
        : [];

    const card = document.createElement("div");
    card.className = "hustle-card" + (check.ok ? "" : " unavailable");

    // 检查是否可用
    const availableColor = check.ok ? "var(--accent)" : "var(--text-muted)";

    const headerDiv = document.createElement("div");
    headerDiv.className = "hustle-header";
    headerDiv.innerHTML = `
      <span class="hustle-icon">${hustle.icon}</span>
      <span class="hustle-name" style="color:${availableColor};">${hustle.name}</span>
    `;
    card.appendChild(headerDiv);

    const descDiv = document.createElement("div");
    descDiv.className = "hustle-desc";
    descDiv.textContent = hustle.desc;
    card.appendChild(descDiv);

    const metaDiv = document.createElement("div");
    metaDiv.className = "hustle-meta";
    metaDiv.innerHTML = `
      <div>💰 基础收入：¥${hustle.baseIncome}</div>
      <div>💪 疲劳消耗：${hustle.fatigueCost}</div>
      <div>⏰ ${hustle.timeSlot.map((s) => (s === "morning" ? "上午" : s === "afternoon" ? "下午" : s === "evening" ? "晚上" : "深夜")).join("、")}</div>
    `;
    card.appendChild(metaDiv);

    // 详细条件（所有条件 ✅/❌）— 使用约定式条件系统
    if (details.length > 0) {
      const reqDiv = document.createElement("div");
      reqDiv.className = "hustle-reqs";
      var reqHtml =
        typeof ConditionSystem !== "undefined" && ConditionSystem.renderRows
          ? ConditionSystem.renderRows(details)
          : (function () {
              var html =
                '<div style="font-size:10px;display:flex;flex-direction:column;gap:2px;padding:4px 0;">';
              for (var di = 0; di < details.length; di++) {
                var d = details[di];
                html +=
                  '<div style="display:flex;justify-content:space-between;align-items:center;padding:1px 4px;border-radius:2px;background:' +
                  (d.ok ? "rgba(46,204,113,0.06);" : "rgba(231,76,60,0.06);") +
                  '">' +
                  "<span>" +
                  (d.ok ? "✅" : "❌") +
                  " " +
                  d.label +
                  "</span>" +
                  '<span style="font-size:9px;color:' +
                  (d.ok ? "var(--success)" : "var(--danger)") +
                  ';">当前' +
                  d.current +
                  "</span></div>";
              }
              html += "</div>";
              return html;
            })();
      reqDiv.innerHTML = reqHtml;
      card.appendChild(reqDiv);
    }

    // 按钮
    const btn = document.createElement("button");
    btn.className = "btn btn-sm hustle-btn";
    btn.textContent = check.ok ? "开始副业" : "不可进行";
    btn.disabled = !check.ok;

    if (check.ok) {
      btn.onclick = function () {
        performHustleAction(hustleId, state);
      };
    } else {
      btn.title = check.reason;
    }

    card.appendChild(btn);
    list.appendChild(card);
  }

  parent.appendChild(list);
}

// ====== 执行副业动作 ======
function performHustleAction(hustleId, state) {
  if (typeof sideHustle === "undefined") {
    StateManager.addMessage("❌ 副业系统未加载", "danger");
    return;
  }

  const result = sideHustle.perform(hustleId, state);
  if (result.success) {
    StateManager.addMessage(result.message, "success");
    renderAll();
  } else {
    StateManager.addMessage("❌ " + result.error, "warning");
  }
}

// ====== 注册到窗口 ======
if (typeof window !== "undefined") {
  window.renderSideHustleTab = renderSideHustleTab;
  window.performHustleAction = performHustleAction;
}

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
  list.style.cssText = "padding:8px;display:flex;flex-wrap:wrap;gap:12px;";

  for (let hustleId in hustleList) {
    const hustle = hustleList[hustleId];
    const check =
      typeof sideHustle !== "undefined"
        ? sideHustle.check(hustleId, state)
        : { ok: false, reason: "系统未加载" };

    const card = document.createElement("div");
    card.style.cssText =
      "flex:1;min-width:200px;max-width:280px;padding:12px;background:var(--bg-secondary);border-radius:8px;border:1px solid var(--border);";

    // 检查是否可用
    const available = check.ok;
    const cardColor = available ? "var(--primary)" : "var(--text-muted)";

    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="font-size:20px;">${hustle.icon}</span>
        <span style="font-weight:bold;color:${cardColor};">${hustle.name}</span>
      </div>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${hustle.desc}</p>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">
        <div>💰 基础收入：¥${hustle.baseIncome}</div>
        <div>💪 疲劳消耗：${hustle.fatigueCost}</div>
        <div>⏰ 可接时间：${hustle.timeSlot.map((s) => (s === "morning" ? "上午" : s === "afternoon" ? "下午" : s === "evening" ? "晚上" : "深夜")).join("、")}</div>
      </div>
    `;

    // 属性要求
    if (hustle.minAttr) {
      const reqText = Object.entries(hustle.minAttr)
        .map(([attr, val]) => {
          const current = state.player[attr] || 0;
          const met = current >= val;
          return `${met ? "✅" : "❌"} ${attr === "agility" ? "敏捷" : attr === "intelligence" ? "智力" : attr === "charm" ? "颜值" : attr} ${current}/${val}`;
        })
        .join(", ");
      card.innerHTML += `<div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;">${reqText}</div>`;
    }

    // 按钮
    const btn = document.createElement("button");
    btn.className = "btn btn-sm";
    btn.style.cssText = "width:100%;margin-top:8px;";
    btn.textContent = available ? "开始副业" : "不可进行";
    btn.disabled = !available;

    if (available) {
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

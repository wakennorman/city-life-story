/**
 * 数据可视化系统 — 收入曲线图 + 属性成长雷达图
 *
 * 在Growth Tab中展示：
 * 1. 收入/支出/净收入曲线图（折线图）
 * 2. 属性成长雷达图（4维/7维属性对比）
 * 3. 技能成长曲线（可选）
 */

/**
 * 绘制收入/支出曲线图
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} state - 游戏状态
 * @param {number} x - 绘图区域左上角x
 * @param {number} y - 绘图区域左上角y
 * @param {number} w - 宽度
 * @param {number} h - 高度
 */
function drawIncomeChart(ctx, state, x, y, w, h) {
  const history = state.history || {};
  const incomeHistory = history.income || [];
  const expenseHistory = history.expense || [];

  // 清空背景
  ctx.fillStyle = "#faf7f0";
  ctx.fillRect(x, y, w, h);

  // 边框
  ctx.strokeStyle = "#d8d5c8";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  // 标题
  ctx.fillStyle = "#3d3a35";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("💰 收入/支出曲线", x + 8, y + 16);

  if (incomeHistory.length < 2) {
    ctx.fillStyle = "#99958e";
    ctx.font = "12px sans-serif";
    ctx.fillText("数据不足，继续游戏以积累数据", x + w / 2 - 80, y + h / 2);
    return;
  }

  // 计算数据范围
  const maxVal = Math.max(
    ...incomeHistory.map((v) => Math.abs(v || 0)),
    ...expenseHistory.map((v) => Math.abs(v || 0)),
    100,
  );

  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // 绘制网格线
  ctx.strokeStyle = "#e8e5d8";
  ctx.lineWidth = 0.5;
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const lineY = y + padding.top + (chartH / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(x + padding.left, lineY);
    ctx.lineTo(x + w - padding.right, lineY);
    ctx.stroke();

    // Y轴标签
    const val = Math.round(maxVal * (1 - i / gridLines));
    ctx.fillStyle = "#99958e";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("¥" + val, x + padding.left - 5, lineY + 4);
  }

  // X轴标签（天数）
  const daysShown = Math.min(incomeHistory.length, 20);
  const step = Math.max(1, Math.floor(incomeHistory.length / daysShown));
  for (let i = 0; i < incomeHistory.length; i += step) {
    const xPos = x + padding.left + (i / (incomeHistory.length - 1)) * chartW;
    ctx.fillStyle = "#99958e";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("第" + (i + 1) + "天", xPos, y + h - padding.bottom + 18);
  }

  // 绘制收入线（绿色）
  ctx.strokeStyle = "#4a9e5c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < incomeHistory.length; i++) {
    const xPos =
      x + padding.left + (i / Math.max(incomeHistory.length - 1, 1)) * chartW;
    const val = Math.max(0, incomeHistory[i] || 0);
    const yPos = y + padding.top + chartH - (val / maxVal) * chartH;
    if (i === 0) ctx.moveTo(xPos, yPos);
    else ctx.lineTo(xPos, yPos);
  }
  ctx.stroke();

  // 收入填充
  ctx.fillStyle = "rgba(74, 158, 92, 0.1)";
  ctx.beginPath();
  for (let i = 0; i < incomeHistory.length; i++) {
    const xPos =
      x + padding.left + (i / Math.max(incomeHistory.length - 1, 1)) * chartW;
    const val = Math.max(0, incomeHistory[i] || 0);
    const yPos = y + padding.top + chartH - (val / maxVal) * chartH;
    if (i === 0) ctx.moveTo(xPos, yPos);
    else ctx.lineTo(xPos, yPos);
  }
  ctx.lineTo(x + w - padding.right, y + padding.top + chartH);
  ctx.lineTo(x + padding.left, y + padding.top + chartH);
  ctx.closePath();
  ctx.fill();

  // 绘制支出线（红色）
  ctx.strokeStyle = "#c4553d";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  for (let i = 0; i < expenseHistory.length; i++) {
    const xPos =
      x + padding.left + (i / Math.max(expenseHistory.length - 1, 1)) * chartW;
    const val = Math.max(0, expenseHistory[i] || 0);
    const yPos = y + padding.top + chartH - (val / maxVal) * chartH;
    if (i === 0) ctx.moveTo(xPos, yPos);
    else ctx.lineTo(xPos, yPos);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // 图例
  ctx.font = "11px sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = "#4a9e5c";
  ctx.fillRect(x + padding.left, y + h - 18, 12, 8);
  ctx.fillText("收入", x + padding.left + 16, y + h - 11);

  ctx.fillStyle = "#c4553d";
  ctx.fillRect(x + padding.left + 60, y + h - 18, 12, 8);
  ctx.fillText("支出", x + padding.left + 76, y + h - 11);

  // 净收入标注
  const totalIncome = incomeHistory.reduce((a, b) => a + (b || 0), 0);
  const totalExpense = expenseHistory.reduce((a, b) => a + (b || 0), 0);
  const netIncome = totalIncome - totalExpense;

  ctx.fillStyle = netIncome >= 0 ? "#4a9e5c" : "#c4553d";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(
    "净收入: ¥" + netIncome.toLocaleString(),
    x + w - padding.right,
    y + h - 18,
  );
}

/**
 * 绘制属性成长雷达图
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} state - 游戏状态
 * @param {number} x - 绘图区域左上角x
 * @param {number} y - 绘图区域左上角y
 * @param {number} w - 宽度
 * @param {number} h - 高度
 * @param {string} mode - 'street' 或 'corp'
 */
function drawRadarChart(ctx, state, x, y, w, h, mode) {
  const padding = { top: 30, right: 20, bottom: 20, left: 20 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const centerX = x + padding.left + chartW / 2;
  const centerY = y + padding.top + chartH / 2;
  const radius = Math.min(chartW, chartH) / 2 - 10;

  // 清空背景
  ctx.fillStyle = "#faf7f0";
  ctx.fillRect(x, y, w, h);

  // 边框
  ctx.strokeStyle = "#d8d5c8";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  // 标题
  ctx.fillStyle = "#3d3a35";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    mode === "street" ? "💪 基础属性" : "🏢 职场属性",
    centerX,
    y + 16,
  );
  ctx.textAlign = "left";

  // 属性数据
  let attrs = [];
  if (mode === "street") {
    const p = state.player || {};
    attrs = [
      { label: "体质", value: p.physique || 0, color: "#c48e4a" },
      { label: "智力", value: p.intelligence || 0, color: "#5a94ba" },
      { label: "敏捷", value: p.agility || 0, color: "#56a64e" },
      { label: "心智", value: p.mental || 0, color: "#9672b4" },
    ];
  } else {
    const c = state.corporate || {};
    attrs = [
      { label: "发量", value: c.hair || 0, color: "#6b9cbe" },
      { label: "尊严", value: c.dignity || 0, color: "#a48aca" },
      { label: "KPI", value: Math.min(100, c.kpi || 0), color: "#c9a442" },
      { label: "能力", value: c.ability || 0, color: "#5a94ba" },
      { label: "向上", value: c.upward || 0, color: "#c48e4a" },
      { label: "人缘", value: c.popularity || 0, color: "#cc7868" },
      { label: "风险", value: Math.min(100, c.risk || 0), color: "#c87062" },
    ];
  }

  const numAttrs = attrs.length;
  const angleStep = (2 * Math.PI) / numAttrs;
  const startAngle = -Math.PI / 2; // 从顶部开始

  // 绘制雷达网格（同心多边形）
  const levels = 5;
  for (let level = 1; level <= levels; level++) {
    const r = (radius / levels) * level;
    ctx.beginPath();
    for (let i = 0; i <= numAttrs; i++) {
      const angle = startAngle + angleStep * (i % numAttrs);
      const px = centerX + r * Math.cos(angle);
      const py = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = "#e8e5d8";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // 绘制属性值多边形
  ctx.beginPath();
  for (let i = 0; i <= numAttrs; i++) {
    const attr = attrs[i % numAttrs];
    const value = Math.min(100, Math.max(0, attr.value));
    const r = (value / 100) * radius;
    const angle = startAngle + angleStep * i;
    const px = centerX + r * Math.cos(angle);
    const py = centerY + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  // 填充
  ctx.fillStyle = "rgba(74, 158, 92, 0.2)";
  ctx.fill();

  // 描边
  ctx.strokeStyle = "#4a9e5c";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 绘制顶点圆点和标签
  for (let i = 0; i < numAttrs; i++) {
    const attr = attrs[i];
    const value = Math.min(100, Math.max(0, attr.value));
    const r = (value / 100) * radius;
    const angle = startAngle + angleStep * i;
    const px = centerX + r * Math.cos(angle);
    const py = centerY + r * Math.sin(angle);

    // 顶点圆点
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, 2 * Math.PI);
    ctx.fillStyle = attr.color;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 标签位置（多边形外）
    const labelR = radius + 20;
    const labelX = centerX + labelR * Math.cos(angle);
    const labelY = centerY + labelR * Math.sin(angle);

    ctx.fillStyle = "#3d3a35";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 标签文本
    let label = attr.label + ":";
    if (labelX < centerX) {
      ctx.textAlign = "right";
      ctx.fillText(label, labelX - 5, labelY);
    } else if (labelX > centerX) {
      ctx.textAlign = "left";
      ctx.fillText(label, labelX + 5, labelY);
    } else {
      if (labelY < centerY) {
        ctx.fillText(label, labelX, labelY - 10);
      } else {
        ctx.fillText(label, labelX, labelY + 16);
      }
    }

    // 数值
    ctx.fillStyle = "#6b6760";
    ctx.font = "bold 10px sans-serif";
    const valText = value + "%";
    if (labelX < centerX) {
      ctx.textAlign = "right";
      ctx.fillText(valText, labelX - 5, labelY + 12);
    } else if (labelX > centerX) {
      ctx.textAlign = "left";
      ctx.fillText(valText, labelX + 5, labelY + 12);
    } else {
      if (labelY < centerY) {
        ctx.fillText(valText, labelX, labelY + 2);
      } else {
        ctx.fillText(valText, labelX, labelY + 28);
      }
    }
  }

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

/**
 * 绘制技能成长曲线
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} state - 游戏状态
 * @param {number} x - 绘图区域左上角x
 * @param {number} y - 绘图区域左上角y
 * @param {number} w - 宽度
 * @param {number} h - 高度
 * @param {string} skillKey - 技能键名
 */
function drawSkillGrowthChart(ctx, state, x, y, w, h, skillKey) {
  const skill = state.skills?.[skillKey];
  if (!skill) return;

  const history = skill.history || [];

  ctx.fillStyle = "#faf7f0";
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = "#d8d5c8";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  // 技能中文名
  const skillNames = {
    cooking: "烹饪",
    repair: "维修",
    coding: "编程",
    english: "英语",
    driving: "驾驶",
    sales: "销售",
    management: "管理",
    accounting: "会计",
    electrician: "电工",
    welding: "焊接",
  };
  const skillName = skillNames[skillKey] || skillKey;

  ctx.fillStyle = "#3d3a35";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("📚 " + skillName + "成长曲线", x + 8, y + 16);

  if (history.length < 2) {
    ctx.fillStyle = "#99958e";
    ctx.font = "12px sans-serif";
    ctx.fillText("数据不足，继续训练以积累数据", x + w / 2 - 70, y + h / 2);
    return;
  }

  const padding = { top: 25, right: 20, bottom: 35, left: 50 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // 最大等级
  const maxLevel = Math.max(
    ...history.map((h) => h.level || 0),
    skill.level || 1,
  );

  // 网格线
  ctx.strokeStyle = "#e8e5d8";
  ctx.lineWidth = 0.5;
  const levels = 5;
  for (let i = 0; i <= levels; i++) {
    const lineY = y + padding.top + (chartH / levels) * i;
    ctx.beginPath();
    ctx.moveTo(x + padding.left, lineY);
    ctx.lineTo(x + w - padding.right, lineY);
    ctx.stroke();

    const val = Math.round(maxLevel * (1 - i / levels));
    ctx.fillStyle = "#99958e";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("Lv." + val, x + padding.left - 5, lineY + 4);
  }

  // X轴：天数
  const daysShown = Math.min(history.length, 15);
  const step = Math.max(1, Math.floor(history.length / daysShown));
  for (let i = 0; i < history.length; i += step) {
    const xPos =
      x + padding.left + (i / Math.max(history.length - 1, 1)) * chartW;
    ctx.fillStyle = "#99958e";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("D" + history[i].day, xPos, y + h - padding.bottom + 18);
  }

  // 绘制成长线
  ctx.strokeStyle = "#4a9e5c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < history.length; i++) {
    const xPos =
      x + padding.left + (i / Math.max(history.length - 1, 1)) * chartW;
    const val = history[i].level || 0;
    const yPos = y + padding.top + chartH - (val / maxLevel) * chartH;
    if (i === 0) ctx.moveTo(xPos, yPos);
    else ctx.lineTo(xPos, yPos);
  }
  ctx.stroke();

  // 填充
  ctx.fillStyle = "rgba(74, 158, 92, 0.08)";
  ctx.beginPath();
  for (let i = 0; i < history.length; i++) {
    const xPos =
      x + padding.left + (i / Math.max(history.length - 1, 1)) * chartW;
    const val = history[i].level || 0;
    const yPos = y + padding.top + chartH - (val / maxLevel) * chartH;
    if (i === 0) ctx.moveTo(xPos, yPos);
    else ctx.lineTo(xPos, yPos);
  }
  ctx.lineTo(x + w - padding.right, y + padding.top + chartH);
  ctx.lineTo(x + padding.left, y + padding.top + chartH);
  ctx.closePath();
  ctx.fill();

  // 当前等级标注
  ctx.fillStyle = "#4a9e5c";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(
    "Lv." + (skill.level || 0) + " (XP: " + (skill.xp || 0) + ")",
    x + w - padding.right,
    y + h - 16,
  );
}

/**
 * 渲染Growth Tab内容
 * @param {object} state - 游戏状态
 * @param {HTMLElement} container - 容器元素
 */
function renderGrowthTab(state, container) {
  container.innerHTML = "";

  // 标题
  const title = document.createElement("h2");
  title.textContent = "📈 成长数据";
  title.style.cssText =
    "margin:0 0 16px;font-size:18px;color:var(--text-primary);";
  container.appendChild(title);

  // 收入曲线图
  const incomeSection = document.createElement("div");
  incomeSection.style.cssText =
    "background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px;";
  const incomeCanvas = document.createElement("canvas");
  incomeCanvas.width = 600;
  incomeCanvas.height = 250;
  incomeCanvas.style.cssText = "width:100%;max-width:600px;border-radius:8px;";
  incomeSection.appendChild(incomeCanvas);
  container.appendChild(incomeSection);

  // 渲染收入图
  setTimeout(() => {
    const ctx = incomeCanvas.getContext("2d");
    ctx.clearRect(0, 0, incomeCanvas.width, incomeCanvas.height);
    drawIncomeChart(ctx, state, 0, 0, incomeCanvas.width, incomeCanvas.height);
  }, 0);

  // 属性雷达图（分街头/职场）
  const radarSection = document.createElement("div");
  radarSection.style.cssText =
    "background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px;";

  const radarTitle = document.createElement("h3");
  radarTitle.textContent =
    state.player.phase === "corporate" ? "🏢 职场属性雷达" : "💪 基础属性雷达";
  radarTitle.style.cssText =
    "margin:0 0 12px;font-size:15px;color:var(--text-primary);";
  radarSection.appendChild(radarTitle);

  const radarCanvas = document.createElement("canvas");
  radarCanvas.width = 350;
  radarCanvas.height = 300;
  radarCanvas.style.cssText = "max-width:100%;border-radius:8px;";
  radarSection.appendChild(radarCanvas);
  container.appendChild(radarSection);

  // 渲染雷达图
  setTimeout(() => {
    const ctx = radarCanvas.getContext("2d");
    ctx.clearRect(0, 0, radarCanvas.width, radarCanvas.height);
    drawRadarChart(
      ctx,
      state,
      0,
      0,
      radarCanvas.width,
      radarCanvas.height,
      state.player.phase,
    );
  }, 0);

  // 技能成长（如果有技能）
  const skills = state.skills || {};
  const skillKeys = Object.keys(skills);
  if (skillKeys.length > 0) {
    const skillSection = document.createElement("div");
    skillSection.style.cssText =
      "background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px;";

    const skillTitle = document.createElement("h3");
    skillTitle.textContent = "📚 技能成长";
    skillTitle.style.cssText =
      "margin:0 0 12px;font-size:15px;color:var(--text-primary);";
    skillSection.appendChild(skillTitle);

    // 显示有历史数据的技能
    const skillsWithHistory = skillKeys.filter(
      (k) => skills[k].history && skills[k].history.length > 0,
    );
    if (skillsWithHistory.length > 0) {
      const skillSelect = document.createElement("select");
      skillSelect.style.cssText =
        "margin-bottom:12px;padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-size:13px;background:var(--bg-primary);";
      skillsWithHistory.forEach((k) => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent =
          k === "cooking"
            ? "烹饪"
            : k === "repair"
              ? "维修"
              : k === "coding"
                ? "编程"
                : k === "english"
                  ? "英语"
                  : k === "driving"
                    ? "驾驶"
                    : k === "sales"
                      ? "销售"
                      : k === "management"
                        ? "管理"
                        : k === "accounting"
                          ? "会计"
                          : k === "electrician"
                            ? "电工"
                            : k === "welding"
                              ? "焊接"
                              : k;
        opt.selected = k === skillsWithHistory[0];
        skillSelect.appendChild(opt);
      });
      skillSection.appendChild(skillSelect);

      const skillCanvas = document.createElement("canvas");
      skillCanvas.width = 500;
      skillCanvas.height = 220;
      skillCanvas.style.cssText = "max-width:100%;border-radius:8px;";
      skillSection.appendChild(skillCanvas);

      // 渲染初始技能图
      setTimeout(() => {
        const ctx = skillCanvas.getContext("2d");
        ctx.clearRect(0, 0, skillCanvas.width, skillCanvas.height);
        drawSkillGrowthChart(
          ctx,
          state,
          0,
          0,
          skillCanvas.width,
          skillCanvas.height,
          skillSelect.value,
        );
      }, 0);

      // 切换技能时重绘
      skillSelect.addEventListener("change", () => {
        const ctx = skillCanvas.getContext("2d");
        ctx.clearRect(0, 0, skillCanvas.width, skillCanvas.height);
        drawSkillGrowthChart(
          ctx,
          state,
          0,
          0,
          skillCanvas.width,
          skillCanvas.height,
          skillSelect.value,
        );
      });
    } else {
      const empty = document.createElement("p");
      empty.textContent = "暂无技能成长数据，去培训中心学习技能吧！";
      empty.style.cssText =
        "color:var(--text-muted);font-size:13px;margin:16px 0;";
      skillSection.appendChild(empty);
    }

    container.appendChild(skillSection);
  }

  // 统计数据摘要
  const statsSection = document.createElement("div");
  statsSection.style.cssText =
    "background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px;";

  const statsTitle = document.createElement("h3");
  statsTitle.textContent = "📊 数据摘要";
  statsTitle.style.cssText =
    "margin:0 0 12px;font-size:15px;color:var(--text-primary);";
  statsSection.appendChild(statsTitle);

  const totalEarned = state.resources?.totalEarned || 0;
  const totalDays = state.player?.day || 0;
  const avgIncome = totalDays > 0 ? Math.round(totalEarned / totalDays) : 0;

  const statsData = [
    { label: "游戏天数", value: totalDays, icon: "📅" },
    {
      label: "终身总收入",
      value: "¥" + totalEarned.toLocaleString(),
      icon: "💰",
    },
    { label: "日均收入", value: "¥" + avgIncome, icon: "📈" },
    {
      label: "当前现金",
      value: "¥" + (state.resources?.cash || 0).toLocaleString(),
      icon: "💵",
    },
    {
      label: "银行存款",
      value: "¥" + (state.resources?.bankBalance || 0).toLocaleString(),
      icon: "🏦",
    },
    {
      label: "当前职级",
      value:
        state.player.phase === "corporate"
          ? state.corporate?.rank || "P5"
          : "街头",
      icon: "🏢",
    },
  ];

  const statsGrid = document.createElement("div");
  statsGrid.style.cssText =
    "display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;";

  statsData.forEach((stat) => {
    const div = document.createElement("div");
    div.style.cssText =
      "background:var(--bg-secondary);border-radius:8px;padding:12px;text-align:center;";
    div.innerHTML =
      '<div style="font-size:20px;margin-bottom:4px;">' +
      stat.icon +
      '</div><div style="font-size:11px;color:var(--text-muted);margin-bottom:2px;">' +
      stat.label +
      '</div><div style="font-size:14px;font-weight:600;color:var(--text-primary);">' +
      stat.value +
      "</div>";
    statsGrid.appendChild(div);
  });

  statsSection.appendChild(statsGrid);
  container.appendChild(statsSection);
}

// 全局挂载
if (typeof window !== "undefined") {
  Object.assign(window, {
    drawIncomeChart,
    drawRadarChart,
    drawSkillGrowthChart,
    renderGrowthTab,
  });
}

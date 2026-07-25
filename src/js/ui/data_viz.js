/**
 * 数据可视化系统 — 收入曲线图 + 总资产曲线 + 属性成长雷达图
 *
 * 参考同类游戏（《大多数》、《中国式家长》、Stardew Valley）的成长可视化设计：
 * - 收入/支出曲线 + 净收入标注
 * - 总资产曲线（平滑 + 变化率）
 * - 属性雷达图（街头4维 / 职场7维，可选历史对比）
 * - 技能成长曲线（下拉切换）
 * - Retina 高清支持
 */

"use strict";

/**
 * 设置 Retina 高清 Canvas
 * @param {HTMLCanvasElement} canvas
 * @param {number} w - CSS 像素宽
 * @param {number} h - CSS 像素高
 * @returns {CanvasRenderingContext2D}
 */
function setupCanvas(canvas, w, h) {
  var dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.cssText =
    "width:" +
    w +
    "px;height:" +
    h +
    "px;display:block;max-width:100%;border-radius:8px;";
  var ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.fillStyle = "#faf8f5";
  ctx.fillRect(0, 0, w, h);
  return ctx;
}

/**
 * 平滑路径绘制（二次贝塞尔插值）
 * 比直线折线更接近《大多数》等的图表质感
 */
function drawSmoothPath(ctx, points, xFn, yFn) {
  var n = points.length;
  if (n < 2) return;
  ctx.beginPath();
  ctx.moveTo(xFn(0, points[0]), yFn(0, points[0]));
  for (var i = 0; i < n - 1; i++) {
    var x0 = xFn(i, points[i]),
      y0 = yFn(i, points[i]);
    var x1 = xFn(i + 1, points[i + 1]),
      y1 = yFn(i + 1, points[i + 1]);
    var cpX = (x0 + x1) / 2;
    var cpY = (y0 + y1) / 2;
    ctx.quadraticCurveTo(x0, y0, cpX, cpY);
  }
  ctx.lineTo(xFn(n - 1, points[n - 1]), yFn(n - 1, points[n - 1]));
}

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
  var history = state.history || {};
  var incomeHistory = history.income || [];
  var expenseHistory = history.expense || [];

  // 清空背景 + 边框
  ctx.fillStyle = "#faf7f0";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#d8d5c8";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = "#3d3a35";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("💰 收入/支出曲线", x + 8, y + 16);

  if (incomeHistory.length < 2) {
    ctx.fillStyle = "#99958e";
    ctx.font = "12px sans-serif";
    ctx.fillText("数据不足，继续游戏以积累数据", x + w / 2 - 80, y + h / 2);
    return;
  }

  // 计算数据范围（取最大绝对值 * 1.15 留白）
  var maxVal = 100;
  var allVals = [];
  incomeHistory.forEach(function (v) {
    allVals.push(Math.abs(v || 0));
  });
  expenseHistory.forEach(function (v) {
    allVals.push(Math.abs(v || 0));
  });
  if (allVals.length > 0) maxVal = Math.max.apply(null, allVals) * 1.15;

  var padding = { top: 30, right: 20, bottom: 40, left: 55 };
  var chartW = w - padding.left - padding.right;
  var chartH = h - padding.top - padding.bottom;
  var len = incomeHistory.length;
  var maxIdx = Math.max(len - 1, 1);

  // 绘制网格线
  ctx.strokeStyle = "#e8e5d8";
  ctx.lineWidth = 0.5;
  for (var gi = 0; gi <= 5; gi++) {
    var lineY = y + padding.top + (chartH / 5) * gi;
    ctx.beginPath();
    ctx.moveTo(x + padding.left, lineY);
    ctx.lineTo(x + w - padding.right, lineY);
    ctx.stroke();
    var val = Math.round(maxVal * (1 - gi / 5));
    ctx.fillStyle = "#99958e";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("¥" + val.toLocaleString(), x + padding.left - 5, lineY + 4);
  }

  // X轴标签（最多15个）
  ctx.textAlign = "center";
  ctx.fillStyle = "#99958e";
  ctx.font = "10px sans-serif";
  var daysShown = Math.min(len, 15);
  var step = Math.max(1, Math.floor(len / daysShown));
  for (var si = 0; si < len; si += step) {
    var xPos = x + padding.left + (si / maxIdx) * chartW;
    ctx.fillText("第" + (si + 1) + "天", xPos, y + h - padding.bottom + 18);
  }

  // 坐标转换函数
  function incX(i) {
    return x + padding.left + (i / maxIdx) * chartW;
  }
  function incY(i) {
    return (
      y +
      padding.top +
      chartH -
      (Math.max(0, incomeHistory[i] || 0) / maxVal) * chartH
    );
  }
  function expY(i) {
    return (
      y +
      padding.top +
      chartH -
      (Math.max(0, expenseHistory[i] || 0) / maxVal) * chartH
    );
  }

  // 绘制收入线（绿色平滑曲线）
  ctx.strokeStyle = "#4a9e5c";
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  drawSmoothPath(
    ctx,
    incomeHistory,
    function (i) {
      return incX(i);
    },
    function (i) {
      return incY(i);
    },
  );
  ctx.stroke();

  // 收入填充
  ctx.fillStyle = "rgba(74,158,92,0.1)";
  ctx.beginPath();
  ctx.moveTo(incX(0), y + padding.top + chartH);
  for (var fi = 0; fi < len; fi++) ctx.lineTo(incX(fi), incY(fi));
  ctx.lineTo(incX(len - 1), y + padding.top + chartH);
  ctx.closePath();
  ctx.fill();

  // 绘制支出线（红色虚线平滑）
  ctx.strokeStyle = "#c4553d";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  drawSmoothPath(
    ctx,
    expenseHistory,
    function (i) {
      return incX(i);
    },
    function (i) {
      return expY(i);
    },
  );
  ctx.stroke();

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
  var totalIncome = 0,
    totalExpense = 0;
  incomeHistory.forEach(function (v) {
    totalIncome += v || 0;
  });
  expenseHistory.forEach(function (v) {
    totalExpense += v || 0;
  });
  var netIncome = totalIncome - totalExpense;

  ctx.fillStyle = netIncome >= 0 ? "#4a9e5c" : "#c4553d";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(
    "净收入: ¥" + netIncome.toLocaleString(),
    x + w - padding.right,
    y + h - 18,
  );
}

// ====== 2. 总资产曲线图 ======

/**
 * 绘制总资产曲线图（从 _cashHistory 读取）
 * 合并自 render.js 旧版 drawAssetLineChart，新增平滑曲线 + 变化率
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} state
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function drawAssetLineChart(ctx, state, x, y, w, h) {
  var data = (state.flags && state.flags._cashHistory) || [];

  ctx.fillStyle = "#faf7f0";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#d8d5c8";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = "#3d3a35";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("🏦 总资产曲线", x + 8, y + 16);

  if (!data || data.length < 2) {
    ctx.fillStyle = "#99958e";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("数据积累中（每天结束后记录一次）", x + w / 2, y + h / 2);
    ctx.textAlign = "left";
    return;
  }

  var padding = { top: 25, right: 20, bottom: 35, left: 55 };
  var cw = w - padding.left - padding.right;
  var ch = h - padding.top - padding.bottom;

  var values = data.map(function (d) {
    return d.value;
  });
  var maxV = Math.max.apply(null, values) * 1.15 || 1000;
  var minV = Math.min(0, Math.min.apply(null, values) * 0.9);

  function tx(i) {
    return x + padding.left + (i / Math.max(data.length - 1, 1)) * cw;
  }
  function ty(v) {
    return y + padding.top + (1 - (v - minV) / (maxV - minV)) * ch;
  }

  // 网格 & Y轴标签
  ctx.strokeStyle = "#e8e5d8";
  ctx.lineWidth = 0.5;
  ctx.font = "10px sans-serif";
  for (var gi = 0; gi <= 4; gi++) {
    var gy = y + padding.top + (gi / 4) * ch;
    ctx.beginPath();
    ctx.moveTo(x + padding.left, gy);
    ctx.lineTo(x + w - padding.right, gy);
    ctx.stroke();
    var lv = maxV - (gi / 4) * (maxV - minV);
    ctx.fillStyle = "#99958e";
    ctx.textAlign = "right";
    var label;
    if (lv >= 10000) label = "¥" + (lv / 10000).toFixed(1) + "w";
    else if (lv >= 1000) label = "¥" + (lv / 1000).toFixed(1) + "k";
    else label = "¥" + Math.round(lv);
    ctx.fillText(label, x + padding.left - 5, gy + 4);
  }

  // X轴标签（天数）
  ctx.textAlign = "center";
  ctx.fillStyle = "#99958e";
  var dayStep = Math.max(1, Math.ceil(data.length / 7));
  data.forEach(function (d, i) {
    if (i % dayStep === 0 || i === data.length - 1) {
      ctx.fillText("D" + d.day, tx(i), y + h - 12);
    }
  });

  // 面积填充
  ctx.fillStyle = "rgba(74,158,92,0.12)";
  ctx.beginPath();
  ctx.moveTo(tx(0), y + padding.top + ch);
  for (var pi = 0; pi < data.length; pi++)
    ctx.lineTo(tx(pi), ty(data[pi].value));
  ctx.lineTo(tx(data.length - 1), y + padding.top + ch);
  ctx.closePath();
  ctx.fill();

  // 平滑曲线
  ctx.strokeStyle = "#4a9e5c";
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  var sp = data.map(function (d) {
    return d.value;
  });
  drawSmoothPath(
    ctx,
    sp,
    function (i) {
      return tx(i);
    },
    function (i) {
      return ty(sp[i]);
    },
  );
  ctx.stroke();

  // 最后数据点圆点
  var last = data[data.length - 1];
  ctx.beginPath();
  ctx.arc(tx(data.length - 1), ty(last.value), 4, 0, Math.PI * 2);
  ctx.fillStyle = "#4a9e5c";
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 数值标注
  ctx.fillStyle = "#3d3a35";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(
    "¥" + last.value.toLocaleString(),
    tx(data.length - 1) - 8,
    ty(last.value) - 8,
  );

  // 图例 + 变化率
  ctx.textAlign = "left";
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#4a9e5c";
  ctx.fillRect(x + padding.left, y + h - 18, 12, 8);
  ctx.fillText("总资产", x + padding.left + 16, y + h - 11);

  if (data.length >= 2) {
    var change = last.value - data[0].value;
    ctx.fillStyle = change >= 0 ? "#4a9e5c" : "#c4553d";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(
      (change >= 0 ? "+" : "") + "¥" + change.toLocaleString(),
      x + w - padding.right,
      y + h - 18,
    );
  }
}

// ====== 3. 雷达图 ======

/**
 * 绘制属性成长雷达图
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} state - 游戏状态
 * @param {number} x - 绘图区域左上角x
 * @param {number} y - 绘图区域左上角y
 * @param {number} w - 宽度
 * @param {number} h - 高度
 * @param {string} mode - 'street' 或 'corp'
 * @param {Array|null} overlayAttrs - 可选历史对比属性 [{label, value, color}]
 */
function drawRadarChart(ctx, state, x, y, w, h, mode, overlayAttrs) {
  var padding = { top: 30, right: 20, bottom: 20, left: 20 };
  var chartW = w - padding.left - padding.right;
  var chartH = h - padding.top - padding.bottom;
  var centerX = x + padding.left + chartW / 2;
  var centerY = y + padding.top + chartH / 2;
  var radius = Math.min(chartW, chartH) / 2 - 10;

  // 清空背景 + 边框
  ctx.strokeRect(x, y, w, h);

  // 标题
  ctx.fillStyle = "#3d3a35";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(mode === "street" ? "💪 属性" : "🏢 职场属性", centerX, y + 16);
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
      { label: "名气", value: p.fame || 0, color: "#d4a017" },
    ];
  } else {
    const c = state.player.corporate || {};
    attrs = [
      { label: "发量", value: c.hair || 0, color: "#6b9cbe" },
      { label: "尊严", value: c.dignity || 0, color: "#a48aca" },
      { label: "KPI", value: Math.min(100, c.kpi || 0), color: "#c9a442" },
      { label: "能力", value: c.ability || 0, color: "#5a94ba" },
      { label: "向上", value: c.upwardMgmt || 0, color: "#c48e4a" },
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

  // 历史对比叠加（灰色虚线多边形，如30天前的属性快照）
  if (overlayAttrs && overlayAttrs.length === numAttrs) {
    ctx.beginPath();
    for (var oa = 0; oa <= numAttrs; oa++) {
      var oaAttr = overlayAttrs[oa % numAttrs];
      var oaVal = Math.min(100, Math.max(0, oaAttr.value));
      var oaR = (oaVal / 100) * radius;
      var oaAngle = startAngle + angleStep * oa;
      var oaPx = centerX + oaR * Math.cos(oaAngle);
      var oaPy = centerY + oaR * Math.sin(oaAngle);
      if (oa === 0) ctx.moveTo(oaPx, oaPy);
      else ctx.lineTo(oaPx, oaPy);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(150,150,150,0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(150,150,150,0.06)";
    ctx.fill();
  }

  // 绘制当前属性值多边形
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
 * 渲染Growth Tab内容（整合版）
 * 整合了 render.js 和 data_viz.js 的所有功能：
 * 1. 收入/支出曲线图
 * 2. 属性雷达图（街头/职场）
 * 3. 属性条形图侧边栏
 * 4. 技能成长曲线
 * 5. NPC 人际关系面板
 * 6. 数据摘要
 *
 * @param {object} state - 游戏状态
 * @param {HTMLElement} container - 容器元素
 */
if(typeof renderGrowthTab==="undefined"){
function renderGrowthTab(state, container) {
  container.innerHTML = "";
  var p = state.player || {};
  var isCorporate = p.phase === "corporate";

  // ---- 辅助函数 ----
  function makeCard(html, opts) {
    opts = opts || {};
    var div = document.createElement("div");
    div.style.cssText =
      "background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px;";
    if (opts.noMargin) div.style.marginBottom = "0";
    div.innerHTML = html;
    return div;
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;");
  }

  // ---- 1. 总资产曲线图 ----
  var assetSection = makeCard(
    '<h3 style="margin:0 0 10px;font-size:14px;color:var(--text-primary);">🏦 总资产曲线</h3>',
  );
  var assetCanvas = document.createElement("canvas");
  assetSection.appendChild(assetCanvas);
  container.appendChild(assetSection);

  // ---- 2. 收入/支出曲线图 ----
  var incomeSection = makeCard(
    '<h3 style="margin:0 0 10px;font-size:14px;color:var(--text-primary);">💰 收入/支出曲线</h3>',
  );
  var incomeCanvas = document.createElement("canvas");
  incomeSection.appendChild(incomeCanvas);
  container.appendChild(incomeSection);

  // ---- 3. 属性雷达图 + 条形图侧边栏 ----
  var radarSection = makeCard(
    '<h3 style="margin:0 0 12px;font-size:14px;color:var(--text-primary);">' +
      (isCorporate ? "🏢 职场属性雷达" : "💪 属性雷达") +
      "</h3>",
    { noMargin: true },
  );
  radarSection.style.display = "flex";
  radarSection.style.gap = "16px";
  radarSection.style.alignItems = "flex-start";

  var radarWrap = document.createElement("div");
  radarWrap.style.cssText =
    "flex:1;min-width:0;display:flex;justify-content:center;";
  var radarCanvas = document.createElement("canvas");
  radarWrap.appendChild(radarCanvas);
  radarSection.appendChild(radarWrap);

  // 条形图侧边栏
  var statSummary = document.createElement("div");
  statSummary.style.cssText = "flex:1;min-width:0;padding-top:8px;";

  var stats = [];
  if (isCorporate) {
    var c = state.player.corporate || {};
    stats = [
      { label: "发量", value: c.hair || 0, color: "#6b9cbe" },
      { label: "尊严", value: c.dignity || 0, color: "#a48aca" },
      { label: "KPI", value: Math.min(100, c.kpi || 0), color: "#c9a442" },
      { label: "能力", value: c.ability || 0, color: "#5a94ba" },
      { label: "向上", value: c.upwardMgmt || 0, color: "#c48e4a" },
      { label: "人缘", value: c.popularity || 0, color: "#cc7868" },
      { label: "风险", value: Math.min(100, c.risk || 0), color: "#c87062" },
    ];
  } else {
    stats = [
      { label: "体质", value: p.physique || 0, color: "#c48e4a" },
      { label: "智力", value: p.intelligence || 0, color: "#5a94ba" },
      { label: "敏捷", value: p.agility || 0, color: "#56a64e" },
      { label: "心智", value: p.mental || 0, color: "#9672b4" },
      { label: "名气", value: (p && p.fame) || 0, color: "#d4a017" },
    ];
  }

  stats.forEach(function (s) {
    var row = document.createElement("div");
    row.style.cssText =
      "display:flex;align-items:center;gap:6px;margin-bottom:8px;";
    row.innerHTML =
      '<span style="width:32px;font-size:11px;color:var(--text-muted);">' +
      esc(s.label) +
      "</span>" +
      '<div style="flex:1;height:5px;background:var(--bg-input);border-radius:3px;overflow:hidden;">' +
      '<div style="width:' +
      Math.min(100, s.value) +
      "%;height:100%;background:" +
      s.color +
      ';border-radius:3px;"></div>' +
      "</div>" +
      '<span style="width:24px;font-size:11px;color:var(--text-secondary);text-align:right;">' +
      s.value +
      "</span>";
    statSummary.appendChild(row);
  });
  radarSection.appendChild(statSummary);
  container.appendChild(radarSection);

  // ---- 4. 技能成长曲线 ----
  var skills = state.skills || {};
  var skillKeys = Object.keys(skills);
  if (skillKeys.length > 0) {
    var skillsWithHistory = skillKeys.filter(function (k) {
      return skills[k].history && skills[k].history.length > 0;
    });
    if (skillsWithHistory.length > 0) {
      var skillSection = makeCard("", { noMargin: true });
      skillSection.innerHTML =
        '<h3 style="margin:0 0 10px;font-size:14px;color:var(--text-primary);">📚 技能成长</h3>';

      var skillSelect = document.createElement("select");
      skillSelect.style.cssText =
        "margin-bottom:12px;padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-size:13px;background:var(--bg-primary);";
      var skillNames = {
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
      skillsWithHistory.forEach(function (k, idx) {
        var opt = document.createElement("option");
        opt.value = k;
        opt.textContent =
          (skillNames[k] || k) + " (Lv." + (skills[k].level || 0) + ")";
        if (idx === 0) opt.selected = true;
        skillSelect.appendChild(opt);
      });
      skillSection.appendChild(skillSelect);

      var skillCanvas = document.createElement("canvas");
      skillSection.appendChild(skillCanvas);
      container.appendChild(skillSection);

      function renderSkillChart(sk) {
        var sCtx = setupCanvas(skillCanvas, 500, 200);
        sCtx.clearRect(0, 0, 500, 200);
        drawSkillGrowthChart(sCtx, state, 0, 0, 500, 200, sk);
      }

      renderSkillChart(skillsWithHistory[0]);
      skillSelect.addEventListener("change", function () {
        renderSkillChart(skillSelect.value);
      });
    }
  }

  // ---- 5. NPC 人际关系 ----
  if (typeof NPCS !== "undefined" && state.relationships) {
    var npcSection = makeCard("", { noMargin: true });
    var npcHtml =
      '<h3 style="margin:0 0 10px;font-size:14px;color:var(--text-primary);">🤝 人际关系</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;">';

    NPCS.forEach(function (npc) {
      var rel = state.relationships[npc.id];
      if (!rel || !rel.met) return;
      var aff = rel.affinity || 0;
      var affLabel =
        typeof getAffinityLabel === "function" ? getAffinityLabel(aff) : "";
      var deepDone = !!(state.flags && state.flags["_npcDeepTask_" + npc.id]);
      var favorDone = !!(state.flags && state.flags["_npcFavor_" + npc.id]);
      var bar = Math.min(100, Math.max(0, aff));
      var barColor = aff >= 70 ? "#4caf50" : aff >= 40 ? "#ff9800" : "#2196f3";

      npcHtml +=
        '<div style="background:var(--bg-input);border-radius:6px;padding:8px;border:1px solid var(--border);">' +
        '<div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:4px;">' +
        esc(npc.name) +
        " " +
        esc(affLabel) +
        "</div>" +
        '<div style="background:var(--bg-card);border-radius:3px;height:4px;overflow:hidden;margin-bottom:4px;">' +
        '<div style="width:' +
        bar +
        "%;height:100%;background:" +
        barColor +
        ';transition:width 0.3s;"></div>' +
        "</div>" +
        '<div style="font-size:10px;color:var(--text-muted);">' +
        (favorDone ? "✅ 委托完成 " : "⬜ 委托未完 ") +
        (deepDone ? "💌 深度对话" : aff >= 70 ? "💌 可对话" : "") +
        "</div></div>";
    });
    npcHtml += "</div>";
    npcSection.innerHTML = npcHtml;
    container.appendChild(npcSection);
  }

  // ---- 6. 数据摘要 ----
  var totalEarned = state.resources ? state.resources.totalEarned || 0 : 0;
  var totalDays = p.day || 0;
  var avgIncome = totalDays > 0 ? Math.round(totalEarned / totalDays) : 0;
  var assetSnapshot =
    typeof getInvestmentAssetSnapshot === "function"
      ? getInvestmentAssetSnapshot(state)
      : null;
  var totalAsset = assetSnapshot
    ? Math.round(assetSnapshot.totalAssets)
    : state.resources
      ? (state.resources.cash || 0) + (state.resources.bankBalance || 0)
      : 0;
  var debt = state.resources
    ? (state.resources.villageDebt || 0) + (state.resources.fineDebt || 0) + (state.resources.bankDebt || 0)
    : 0;
  var cash = state.resources ? state.resources.cash || 0 : 0;
  var bank = state.resources ? state.resources.bankBalance || 0 : 0;

  var statsData = [
    { label: "游戏天数", value: "第" + totalDays + "天", icon: "📅" },
    { label: "当前年龄", value: (p.age || 0) + "岁", icon: "🎂" },
    { label: "总资产", value: "¥" + totalAsset.toLocaleString(), icon: "💰" },
    { label: "当前现金", value: "¥" + cash.toLocaleString(), icon: "💵" },
    { label: "银行存款", value: "¥" + bank.toLocaleString(), icon: "🏦" },
    { label: "日均收入", value: "¥" + avgIncome, icon: "📈" },
    {
      label: "终身总收入",
      value: "¥" + totalEarned.toLocaleString(),
      icon: "💎",
    },
    debt > 0
      ? {
          label: "总负债",
          value: "¥" + debt.toLocaleString(),
          icon: "💸",
          color: "#c4553d",
        }
      : null,
    {
      label: "当前职级",
      value:
        isCorporate && state.corporate ? state.corporate.rank || "P5" : "街头",
      icon: "🏢",
    },
    {
      label: "成就数",
      value:
        ((state.flags && state.flags._unlockedAchievements) || []).length +
        "个",
      icon: "🏅",
    },
    typeof getDreamProgress === "function"
      ? { label: "梦想进度", value: getDreamProgress(state) + "%", icon: "🌟" }
      : null,
    state.trade && state.trade.totalProfit
      ? {
          label: "贸易总利润",
          value: "¥" + (state.trade.totalProfit || 0).toLocaleString(),
          icon: "📦",
        }
      : null,
  ].filter(Boolean);

  var statsSection = makeCard("", { noMargin: true });
  statsSection.innerHTML =
    '<h3 style="margin:0 0 8px;font-size:13px;color:var(--text-primary);">📊 数据摘要</h3>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:6px;max-height:280px;overflow-y:auto;">';

  statsData.forEach(function (stat) {
    statsSection.innerHTML +=
      '<div style="background:' +
      (stat.color ? "rgba(196,85,51,0.08)" : "var(--bg-secondary)") +
      ";border-radius:6px;padding:8px 6px;text-align:center;" +
      (stat.color ? "border:1px solid rgba(196,85,51,0.2);" : "") +
      '">' +
      '<div style="font-size:16px;margin-bottom:2px;">' +
      stat.icon +
      "</div>" +
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:1px;">' +
      stat.label +
      "</div>" +
      '<div style="font-size:12px;font-weight:600;color:' +
      (stat.color || "var(--text-primary)") +
      ';">' +
      stat.value +
      "</div></div>";
  });
  statsSection.innerHTML += "</div>";
  container.appendChild(statsSection);

  // ---- 异步绘制图表（Retina 高清） ----
  requestAnimationFrame(function () {
    try {
      // 总资产曲线（560x180）
      var ctxAsset = setupCanvas(assetCanvas, 560, 180);
      drawAssetLineChart(ctxAsset, state, 0, 0, 560, 180);

      // 收入/支出曲线（560x220）
      var ctxIncome = setupCanvas(incomeCanvas, 560, 220);
      drawIncomeChart(ctxIncome, state, 0, 0, 560, 220);

      // 雷达图（280x260）
      var ctxRadar = setupCanvas(radarCanvas, 280, 260);
      // 历史属性对比：取最近一次快照（约7天前）
      var historyStats = (state.history && state.history.stats) || [];
      var overlayAttrs = null;
      if (historyStats.length >= 2 && !isCorporate) {
        var oldSnapshot = historyStats[Math.max(0, historyStats.length - 2)];
        if (oldSnapshot && oldSnapshot.day < (p.day || 0)) {
          overlayAttrs = [
            {
              label: "体质",
              value: oldSnapshot.physique || 0,
              color: "#c48e4a",
            },
            {
              label: "智力",
              value: oldSnapshot.intelligence || 0,
              color: "#5a94ba",
            },
            {
              label: "敏捷",
              value: oldSnapshot.agility || 0,
              color: "#56a64e",
            },
            { label: "心智", value: oldSnapshot.mental || 0, color: "#9672b4" },
            { label: "名气", value: oldSnapshot.fame || 0, color: "#d4a017" },
          ];
        }
      }
      drawRadarChart(
        ctxRadar,
        state,
        0,
        0,
        280,
        260,
        isCorporate ? "corp" : "street",
        overlayAttrs,
      );
    } catch (e) {
      console.warn("[data_viz] 图表绘制错误（不影响游戏）:", e);
    }
  });
}
}

// 全局挂载
if (typeof window !== "undefined") {
  window.setupCanvas = setupCanvas;
  window.drawIncomeChart = drawIncomeChart;
  window.drawAssetLineChart = drawAssetLineChart;
  window.drawRadarChart = drawRadarChart;
  window.drawSkillGrowthChart = drawSkillGrowthChart;
  // [全系统自洽修复] 域F 修复:renderGrowthTab 在 Node headless 加载时因块级函数声明不可见而缺失→守卫式挂载，顺序无关，避免整文件加载崩溃
  window.renderGrowthTab = (typeof renderGrowthTab !== "undefined") ? renderGrowthTab : function(){ /* headless fallback */ };
  window._dataVizRenderGrowthTab = window.renderGrowthTab;
}

/**
 * 职场专用 UI 组件
 *
 * 新增：renderCompanyHistory() — 公司历史书面板
 * 显示入职以来的完整履历：时间线、绩效、项目、团队、统计
 */

/** 渲染职场面板（替代街头行动面板） */
function renderCorporateActions(state) {
  const area = document.getElementById("content-area");
  area.innerHTML = "";

  // 季度信息
  const qDiv = document.createElement("div");
  qDiv.id = "time-slot-indicator";
  const rankData = CORP_RANKS[state.corporate.rank] || {};
  qDiv.innerHTML = `
    <span>🏢 <strong>${state.corporate.company?.name || "公司"}</strong></span>
    <span>|</span>
    <span>📅 第${state.player.corpYear}年 Q${state.player.corpQuarter}</span>
    <span>|</span>
    <span>🏷️ <strong style="color:var(--accent)">${state.corporate.rank}</strong></span>
    <span style="margin-left:auto;font-size:11px;color:var(--text-muted);">
      行动 ${state.corporate.actionsUsed}/${rankData.maxActions || 3}
    </span>
  `;
  area.appendChild(qDiv);

  // 晋升进度条 (Q3前显示)
  if (state.player.corpQuarter === 3 && state.corporate.rank !== "P10") {
    const progress = getPromotionProgress(state);
    const progDiv = document.createElement("div");
    progDiv.style.cssText =
      "padding:10px;margin:8px 0;background:var(--bg-card);border-radius:6px;";
    progDiv.innerHTML = `<div style="font-size:12px;color:var(--accent);margin-bottom:6px;">🎯 晋升进度 (→${progress.nextRank || "P10"})</div>`;
    if (progress.checks) {
      for (const ch of progress.checks) {
        const pct = Math.min(100, Math.round((ch.current / ch.target) * 100));
        const met = ch.current >= ch.target;
        progDiv.innerHTML += `
          <div style="display:flex;align-items:center;gap:8px;margin:3px 0;font-size:11px;">
            <span style="width:70px;color:var(--text-muted);">${ch.label}</span>
            <div style="flex:1;height:8px;background:rgba(255,255,255,0.05);border-radius:4px;">
              <div style="width:${pct}%;height:100%;background:${met ? "var(--success)" : "var(--accent)"};border-radius:4px;"></div>
            </div>
            <span style="color:${met ? "var(--success)" : "var(--text-muted)"};width:60px;text-align:right;">${ch.current}/${ch.target}</span>
          </div>`;
      }
    }
    area.appendChild(progDiv);
  }

  // 公司历史书按钮 + 面板
  const histBtnDiv = document.createElement("div");
  histBtnDiv.style.cssText = "margin:12px 0;display:flex;gap:8px;";
  histBtnDiv.innerHTML = `
    <button id="btn-toggle-history" class="btn btn-sm" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:var(--text);">
      📖 公司历史书
    </button>
  `;
  area.appendChild(histBtnDiv);

  // 公司历史书面板（展开时显示）
  if (showHistoryPanel) {
    const histPanel = renderCompanyHistory(state);
    area.appendChild(histPanel);
  }

  // 绑定按钮事件
  setTimeout(() => {
    const btn = document.getElementById("btn-toggle-history");
    if (btn) {
      btn.addEventListener("click", () => {
        showHistoryPanel = !showHistoryPanel;
        renderAll();
      });
    }
  }, 0);

  // 职场行动卡片
  const cards = document.createElement("div");
  cards.className = "action-cards";

  for (const action of CORP_ACTIONS) {
    const card = document.createElement("div");
    card.className = "action-card";

    // 检查职级要求
    let disabled = false;
    let reqText = "";
    if (action.requiresRank) {
      const rankIdx = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(
        state.corporate.rank,
      );
      const reqIdx = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(
        action.requiresRank,
      );
      if (rankIdx < reqIdx) {
        disabled = true;
        reqText = `需 ${action.requiresRank}+`;
      }
    }
    if (action.cost && state.resources.cash < action.cost) {
      disabled = true;
      reqText = `需 ¥${action.cost}`;
    }

    // 效果预览
    const eff = action.effects;
    const previews = [];
    if (eff.kpi > 0) previews.push(`KPI+${eff.kpi}`);
    if (eff.kpi < 0) previews.push(`KPI${eff.kpi}`);
    if (eff.ability > 0) previews.push(`能力+${eff.ability}`);
    if (eff.hair < 0) previews.push(`发量${eff.hair}`);
    if (eff.risk > 0) previews.push(`风险+${eff.risk}`);
    if (eff.risk < 0) previews.push(`风险${eff.risk}`);
    if (eff.upwardMgmt > 0) previews.push(`向上+${eff.upwardMgmt}`);
    if (eff.popularity > 0) previews.push(`人缘+${eff.popularity}`);

    card.innerHTML = `
      <div class="card-icon">${action.icon}</div>
      <div class="card-title">${action.name}</div>
      <div class="card-desc">${action.desc}</div>
      <div class="card-meta">
        <span style="font-size:10px;color:var(--text-muted);">${previews.join(" | ")}</span>
        ${action.cost ? `<span class="cost-estimate">💸 ¥${action.cost}</span>` : ""}
        ${reqText ? `<span class="req-fail">⚠ ${reqText}</span>` : ""}
      </div>
    `;

    if (!disabled) {
      card.addEventListener("click", () => {
        doCorporateAction(action.id);
        renderAll();
      });
    } else {
      card.classList.add("disabled");
    }

    cards.appendChild(card);
  }

  area.appendChild(cards);

  // 团队信息 (P7+)
  if (
    state.corporate.team.length > 0 ||
    CORP_RANKS[state.corporate.rank]?.canManageTeam
  ) {
    const teamDiv = document.createElement("div");
    teamDiv.style.marginTop = "12px";
    teamDiv.innerHTML = `<h4 style="color:var(--text-muted);margin-bottom:8px;">👥 团队 (${state.corporate.team.length}人) | 产出系数: ${getTeamProductivity(state).toFixed(2)}x</h4>`;

    const teamGrid = document.createElement("div");
    teamGrid.className = "action-cards";
    teamGrid.style.gridTemplateColumns =
      "repeat(auto-fill, minmax(160px, 1fr))";

    for (let i = 0; i < state.corporate.team.length; i++) {
      const m = state.corporate.team[i];
      const card = document.createElement("div");
      card.className = "action-card";
      card.innerHTML = `
        <div class="card-title">${m.name}</div>
        <div class="card-desc">${m.role} | 产出:${m.productivity} 忠诚:${m.loyalty}</div>
        <button class="btn btn-sm btn-danger mt-2 fire-member" data-idx="${i}">解雇</button>
      `;
      teamGrid.appendChild(card);
    }

    teamDiv.appendChild(teamGrid);

    // 招聘按钮
    if (state.player.corpQuarter === 2) {
      // Q2 招聘季
      const hireDiv = document.createElement("div");
      hireDiv.style.marginTop = "8px";
      hireDiv.innerHTML =
        '<p style="font-size:11px;color:var(--accent);margin-bottom:4px;">🎯 Q2招聘季 — 可招聘新成员 (¥10,000/人)</p>';
      const hireGrid = document.createElement("div");
      hireGrid.className = "action-cards";
      hireGrid.style.gridTemplateColumns =
        "repeat(auto-fill, minmax(160px, 1fr))";

      for (const tmpl of TEAM_MEMBERS) {
        const hCard = document.createElement("div");
        hCard.className = "action-card";
        hCard.innerHTML = `
          <div class="card-title">${tmpl.name}</div>
          <div class="card-desc">${tmpl.role} — ${tmpl.desc}</div>
          <div style="font-size:10px;color:var(--text-muted);">产出:${tmpl.productivity} | 薪资:¥${tmpl.salary.toLocaleString()}</div>
          <button class="btn btn-sm btn-success mt-2 hire-member" data-type="${tmpl.id}">招聘 ¥10,000</button>
        `;
        hireGrid.appendChild(hCard);
      }
      hireDiv.appendChild(hireGrid);
      teamDiv.appendChild(hireDiv);

      setTimeout(() => {
        teamDiv.querySelectorAll(".hire-member").forEach((btn) => {
          btn.onclick = () => {
            hireTeamMember(btn.dataset.type);
            renderAll();
          };
        });
      }, 0);
    }

    area.appendChild(teamDiv);

    setTimeout(() => {
      area.querySelectorAll(".fire-member").forEach((btn) => {
        btn.onclick = () => {
          fireTeamMember(parseInt(btn.dataset.idx));
          renderAll();
        };
      });
    }, 0);
  }
}

/** 渲染胜败条件检查 */
function checkCorpWinConditions(state) {
  if (state.corporate.rank === "P10") {
    state.flags.victory = true;
    state.flags.victoryType = "p10";
    state.flags.gameOver = true;
    showVictoryModal();
    return true;
  }
  if (state.resources.cash + state.resources.bankBalance >= 20000000) {
    state.flags.victory = true;
    state.flags.victoryType = "money";
    state.flags.gameOver = true;
    showVictoryModal();
    return true;
  }
  return false;
}

function checkCorpLoseConditions(state) {
  const c = state.player.corporate;
  const corp = state.corporate;

  if (c.hair <= 0) {
    state.flags.gameOver = true;
    state.flags.gameOverReason =
      "发量为零——过劳导致身体崩溃，你倒在了工位上...";
    showGameOverModal();
    return true;
  }
  if (c.dignity <= 0) {
    state.flags.gameOver = true;
    state.flags.gameOverReason =
      "尊严耗尽——长期的精神压力让你选择了离开这个世界...";
    showGameOverModal();
    return true;
  }
  if (corp.consecutiveC >= 8) {
    // 连续2年(8季度)C
    state.flags.gameOver = true;
    state.flags.gameOverReason = "连续2年绩效为C，被公司末位淘汰。";
    showGameOverModal();
    return true;
  }
  if (c.risk >= 100) {
    state.flags.gameOver = true;
    state.flags.gameOverReason = "风险值爆表——触碰合规红线，被开除并追究责任。";
    showGameOverModal();
    return true;
  }
  if (state.player.age >= 35) {
    const rankIdx = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(
      state.corporate.rank,
    );
    if (rankIdx < 3) {
      // P5/P6/P7
      state.flags.gameOver = true;
      state.flags.gameOverReason = `35岁危机——${state.player.age}岁了还只是${state.corporate.rank}，被公司优化了...`;
      showGameOverModal();
      return true;
    }
  }
  return false;
}

function showVictoryModal() {
  const state = StateManager.getState();
  const title =
    state.flags.victoryType === "p10" ? "🏆 登峰造极！" : "💰 财务自由！";
  const desc =
    state.flags.victoryType === "p10"
      ? "你成功晋升到了P10合伙人级别，站在了职场金字塔的顶端！"
      : "你积累了2000万财富，实现了财务自由。不再为钱发愁的人生，开始了！";

  showModal({
    title,
    body: `
      <div class="end-screen victory">
        <div class="end-icon">${state.flags.victoryType === "p10" ? "🏆" : "💰"}</div>
        <div class="end-title">${title}</div>
        <div class="end-subtitle">${desc}</div>
        <table class="stats-summary">
          <tr><td>总天数</td><td>${state.player.day} 天</td></tr>
          <tr><td>年龄</td><td>${state.player.age} 岁</td></tr>
          <tr><td>职级</td><td>${state.corporate.rank}</td></tr>
          <tr><td>现金</td><td>¥${state.resources.cash.toLocaleString()}</td></tr>
          <tr><td>总收入</td><td>¥${state.resources.totalEarned.toLocaleString()}</td></tr>
        </table>
      </div>`,
    buttons: [
      {
        text: "🔄 再来一局",
        cls: "btn-primary",
        callback: () => {
          location.reload();
        },
      },
      {
        text: "📂 保存成就",
        cls: "btn-success",
        callback: () => {
          saveGame(1);
          location.reload();
        },
      },
    ],
  });
}

// ====== 公司历史书 UI ======

/** 公司历史书展开/折叠状态 */
let showHistoryPanel = false;

/**
 * 渲染公司历史书面板
 * 显示入职以来的完整履历：时间线、绩效、项目、团队变动、统计
 * @param {Object} state - 当前游戏状态
 * @returns {HTMLElement} 历史书面板容器
 */
function renderCompanyHistory(state) {
  const c = state.corporate;
  const p = state.player;

  // 计算统计
  const totalDays = p.day - c.joinedDay;
  const perfCount = c.perfHistory.length;
  const gradeDist = {};
  for (const perf of c.perfHistory) {
    gradeDist[perf.grade] = (gradeDist[perf.grade] || 0) + 1;
  }
  const projectCount = (c.completedProjects || []).length;
  const teamChanges = c.team.length; // 当前团队人数（简化统计）

  // 构建时间线事件
  const events = [];

  // 入职事件
  events.push({
    day: c.joinedDay,
    label: "入职",
    desc: `加入 ${c.company?.name || "公司"}，从 P5 起步`,
    icon: "🏢",
    type: "join",
  });

  // 晋升事件
  const rankOrder = ["P5", "P6", "P7", "P8", "P9", "P10"];
  let prevRank = "P5";
  for (const proj of c.perfHistory || []) {
    // 晋升信息需要从 promo.js 的 promotion 记录中获取
    // 这里用绩效历史中的 grade 变化来标记
  }

  // 绩效里程碑事件
  for (const perf of c.perfHistory) {
    if (perf.grade === "S+" || perf.grade === "S") {
      events.push({
        day: p.day - (perfCount - c.perfHistory.indexOf(perf)) * 90, // 估算天数
        label: `绩效${perf.grade}`,
        desc: `Q${perf.quarter} 绩效 ${perf.grade}（${perf.score?.toFixed(1) || "?"}分）`,
        icon: perf.grade === "S+" ? "🏆" : "⭐",
        type: "perf",
      });
    } else if (perf.grade === "C") {
      events.push({
        day: p.day - (perfCount - c.perfHistory.indexOf(perf)) * 90,
        label: `绩效C`,
        desc: `Q${perf.quarter} 绩效 C，需警惕`,
        icon: "⚠️",
        type: "warning",
      });
    }
  }

  // 按天数排序
  events.sort((a, b) => a.day - b.day);

  // 渲染面板
  const panel = document.createElement("div");
  panel.id = "company-history-panel";
  panel.style.cssText =
    "margin-top:16px;padding:16px;background:var(--bg-card);border-radius:8px;border:1px solid rgba(255,255,255,0.05);";

  let gradeDistHtml = "";
  for (const [grade, count] of Object.entries(gradeDist)) {
    gradeDistHtml += `<span style="display:inline-block;margin-right:12px;font-size:11px;">${grade}: ${count}次</span>`;
  }

  let timelineHtml = "";
  for (const ev of events) {
    const dayNum = ev.day;
    timelineHtml += `
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;font-size:12px;">
        <div style="width:24px;text-align:center;">${ev.icon}</div>
        <div style="flex:1;">
          <div style="font-weight:bold;color:var(--text);">${ev.label} <span style="color:var(--text-muted);font-weight:normal;">(第${dayNum}天)</span></div>
          <div style="color:var(--text-muted);font-size:11px;">${ev.desc}</div>
        </div>
      </div>`;
  }

  if (!timelineHtml) {
    timelineHtml =
      '<div style="color:var(--text-muted);font-size:12px;padding:10px;">暂无事件记录</div>';
  }

  // 绩效历史表格
  let perfTableHtml = "";
  if (c.perfHistory.length > 0) {
    perfTableHtml = `
      <table style="width:100%;font-size:11px;border-collapse:collapse;margin-top:8px;">
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
            <th style="text-align:left;padding:4px 8px;">年份</th>
            <th style="text-align:left;padding:4px 8px;">季度</th>
            <th style="text-align:left;padding:4px 8px;">等级</th>
            <th style="text-align:left;padding:4px 8px;">分数</th>
          </tr>
        </thead>
        <tbody>
          ${c.perfHistory
            .map(
              (perf) => `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:4px 8px;">Y${perf.year}</td>
              <td style="padding:4px 8px;">Q${perf.quarter}</td>
              <td style="padding:4px 8px;color:${
                perf.grade === "S+"
                  ? "var(--success)"
                  : perf.grade === "S"
                    ? "#4ade80"
                    : perf.grade === "A"
                      ? "#86efac"
                      : perf.grade === "B"
                        ? "#94a3b8"
                        : perf.grade === "C"
                          ? "var(--danger)"
                          : "var(--text)"
              }">${perf.grade}</td>
              <td style="padding:4px 8px;color:var(--text-muted);">${perf.score?.toFixed(1) || "—"}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>`;
  } else {
    perfTableHtml =
      '<div style="color:var(--text-muted);font-size:11px;padding:8px;">尚未进行绩效评审</div>';
  }

  // 完成项目列表
  let projectHtml = "";
  if (c.completedProjects && c.completedProjects.length > 0) {
    projectHtml = c.completedProjects
      .map(
        (proj) => `
      <div style="display:flex;align-items:center;gap:8px;font-size:11px;margin-bottom:4px;">
        <span>📦</span>
        <span>${proj.name || "项目"}</span>
        <span style="color:var(--text-muted);">(${proj.completedDay ? `第${proj.completedDay}天` : ""})</span>
      </div>
    `,
      )
      .join("");
  } else {
    projectHtml =
      '<div style="color:var(--text-muted);font-size:11px;padding:8px;">暂无完成项目</div>';
  }

  // 团队成员列表
  let teamHtml = "";
  if (c.team && c.team.length > 0) {
    teamHtml = c.team
      .map(
        (m, i) => `
      <div style="display:flex;align-items:center;gap:8px;font-size:11px;margin-bottom:4px;">
        <span>👤</span>
        <span>${m.name}</span>
        <span style="color:var(--text-muted);">${m.role}</span>
        <span style="color:var(--text-muted);font-size:10px;">产出:${m.productivity} 忠诚:${m.loyalty}</span>
      </div>
    `,
      )
      .join("");
  } else {
    teamHtml =
      '<div style="color:var(--text-muted);font-size:11px;padding:8px;">暂无团队成员</div>';
  }

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <h4 style="margin:0;color:var(--accent);font-size:14px;">📖 公司历史书</h4>
      <span style="font-size:10px;color:var(--text-muted);">入职 ${totalDays} 天</span>
    </div>

    <!-- 统计概览 -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px;">
      <div style="background:rgba(255,255,255,0.03);padding:8px;border-radius:4px;text-align:center;">
        <div style="font-size:18px;font-weight:bold;color:var(--accent);">${totalDays}</div>
        <div style="font-size:10px;color:var(--text-muted);">在职天数</div>
      </div>
      <div style="background:rgba(255,255,255,0.03);padding:8px;border-radius:4px;text-align:center;">
        <div style="font-size:18px;font-weight:bold;color:var(--accent);">${c.rank}</div>
        <div style="font-size:10px;color:var(--text-muted);">当前职级</div>
      </div>
      <div style="background:rgba(255,255,255,0.03);padding:8px;border-radius:4px;text-align:center;">
        <div style="font-size:18px;font-weight:bold;color:var(--accent);">${perfCount}</div>
        <div style="font-size:10px;color:var(--text-muted);">绩效评审</div>
      </div>
      <div style="background:rgba(255,255,255,0.03);padding:8px;border-radius:4px;text-align:center;">
        <div style="font-size:18px;font-weight:bold;color:var(--accent);">${projectCount}</div>
        <div style="font-size:10px;color:var(--text-muted);">完成项目</div>
      </div>
    </div>

    <!-- 绩效等级分布 -->
    <div style="margin-bottom:12px;">
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">📊 绩效等级分布</div>
      <div>${gradeDistHtml || '<span style="color:var(--text-muted);font-size:11px;">无数据</span>'}</div>
    </div>

    <!-- 时间线 -->
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;color:var(--accent);margin-bottom:6px;">⏱️ 关键事件时间线</div>
      <div style="background:rgba(255,255,255,0.02);padding:8px 12px;border-radius:4px;">${timelineHtml}</div>
    </div>

    <!-- 绩效历史 -->
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;color:var(--accent);margin-bottom:6px;">📋 绩效评审记录</div>
      <div style="background:rgba(255,255,255,0.02);padding:8px 12px;border-radius:4px;">${perfTableHtml}</div>
    </div>

    <!-- 完成项目 -->
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;color:var(--accent);margin-bottom:6px;">📦 完成项目</div>
      <div style="background:rgba(255,255,255,0.02);padding:8px 12px;border-radius:4px;">${projectHtml}</div>
    </div>

    <!-- 团队成员 -->
    <div>
      <div style="font-size:12px;color:var(--accent);margin-bottom:6px;">👥 当前团队 (${c.team?.length || 0}人)</div>
      <div style="background:rgba(255,255,255,0.02);padding:8px 12px;border-radius:4px;">${teamHtml}</div>
    </div>
  `;

  return panel;
}

/**
 * 切换公司历史书面板的显示/隐藏
 */
function toggleCompanyHistory() {
  showHistoryPanel = !showHistoryPanel;
  const state = StateManager.getState();
  renderAll();
}

// ====== 全局导出 ======
if (typeof window !== "undefined") {
  Object.assign(window, {
    renderCompanyHistory,
    toggleCompanyHistory,
    getCompanyHistoryPanel: (state) => renderCompanyHistory(state),
  });
}

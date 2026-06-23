/**
 * 职场专用 UI 组件
 */

// [已清理] _fateTag 已合并到 render.js 统一版本（含 IPO 标记），此处删除死代码

/**
 * 获取公司行业（从COMPANIES数组或行业映射）
 */
function getCompanyIndustryById(cid) {
  if (typeof COMPANIES !== "undefined") {
    for (var i = 0; i < COMPANIES.length; i++) {
      if (COMPANIES[i].id === cid) return COMPANIES[i].industry;
    }
  }
  return null;
}

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

  // 尊严归零 -> 精神崩溃（不可逆，Game Over）
  if (c.dignity <= 0) {
    state.flags.gameOver = true;
    state.flags.gameOverReason =
      "尊严耗尽——长期的精神压力让你选择了离开这个世界...";
    showGameOverModal();
    return true;
  }

  // 35岁危机 -> P8以下不可逆淘汰
  if (state.player.age >= 35) {
    const rankIdx = ["P5", "P6", "P7", "P8", "P9", "P10"].indexOf(
      state.corporate.rank,
    );
    if (rankIdx < 3) {
      state.flags.gameOver = true;
      state.flags.gameOverReason = `35岁危机——${state.player.age}岁了还只是${state.corporate.rank}，被公司优化了...`;
      showGameOverModal();
      return true;
    }
  }

  // 以下情况触发「被开除回街头」降级而非 Game Over
  let downgradeReason = null;

  if (c.hair <= 0) {
    downgradeReason =
      "过劳到发量归零，被公司劝退休养。你回到了城中村重新开始。";
  }
  if (c.risk >= 100) {
    downgradeReason = "风险值爆表——触碰合规红线，被公司开除。你回到了街头。";
  }
  if (corp.consecutiveC >= 8) {
    downgradeReason = "连续2年绩效为C，被末位淘汰。你带着简历回到了城中村。";
  }

  if (downgradeReason) {
    downgradeToStreet(state, downgradeReason);
    return true;
  }

  return false;
}

/**
 * 降级：从职场阶段回到街头
 * 保留部分资产和技能，重置职场属性
 */
function downgradeToStreet(state, reason) {
  const rankData = CORP_RANKS[state.corporate.rank] || CORP_RANKS.P5;

  // 保留遣散费：季度工资的1-3倍
  const severance = rankData.baseSalary * 3 * (1 + Random.int(0, 2));
  state.resources.cash += severance;

  // 保留职场期间累积的投资
  // 重置职场状态
  state.player.phase = "street";
  state.corporate.rank = "P5";
  state.corporate.actionsUsed = 0;
  state.corporate.consecutiveC = 0;
  state.corporate.perfHistory = [];
  state.corporate.completedProjects = [];
  state.corporate.team = [];
  state.player.corpYear = 0;
  state.player.corpQuarter = 1;
  state.trade.currentLocation = "slum";

  // 重置职场7维属性（保留部分能力作为积累）
  state.player.intelligence = Math.min(100, state.player.intelligence + 5);
  state.player.corporate.hair = 100;
  state.player.corporate.dignity = Math.min(
    100,
    Math.round(state.player.mental * 1.2),
  );
  state.player.corporate.upwardMgmt = 20;
  state.player.corporate.kpi = 20;
  state.player.corporate.ability = Math.min(
    100,
    Math.round(state.player.intelligence * 0.8 + 10),
  );
  state.player.corporate.risk = 0;
  state.player.corporate.popularity = 25;

  // 回到城中村
  state.housing.tier = Math.max(0, state.housing.tier - 2);
  const baseCap = [20, 50, 100, 200][state.housing.tier] || 20;
  state.inventory.capacity = baseCap + (state.housing.storageCapacity || 0);

  StateManager.addMessage(
    `🔄 你被开除，回到了街头。遣散费 ¥${severance.toLocaleString()}。`,
    "warning",
  );
  StateManager.addMessage(`📋 ${reason}`, "danger");
  StateManager.addMessage(
    "💡 但你在职场积累的技能和部分金钱还在。可以从街头商机中寻找新机会，或休整后再战职场。",
    "info",
  );

  // 关闭弹窗
  document.querySelector(".modal-overlay")?.remove();
  currentTab = "actions";
  renderAll();
}

function showVictoryModal() {
  const state = StateManager.getState();

  // Phase 3: 记录多周目记忆 + 生成遗产数据
  if (typeof recordPlaythroughEndEnhanced === "function") {
    recordPlaythroughEndEnhanced(state);
  }

  // 计算声誉徽章
  var badges = [];
  if (typeof calculateReputationBadges === "function") {
    badges = calculateReputationBadges(state);
  }

  // 构建遗产数据
  var inheritanceData = {
    badges: badges,
    badgeCount: badges.length,
    relationshipCount: Object.keys(state.relationships || {}).filter(
      function (npcId) {
        var r = state.relationships[npcId];
        return r && r.met && (r.affinity || 0) >= 30;
      },
    ).length,
    itemCount: (state.inventory || []).filter(function (item) {
      return item.legendary || item.achievement || item.unique;
    }).length,
    dreamProgress: state.flags?._dreamId
      ? {
          dreamId: state.flags._dreamId,
          completedMilestones: state.flags._dreamMilestone || 0,
        }
      : null,
    skillTree: {
      branches: state.skillBranches || {},
      nodes: state.talentNodes || {},
    },
    cashInfo: null,
    narrative: "",
    prevState: state,
    victory: true,
    victoryType: state.flags.victoryType || "normal",
  };

  // 计算继承现金
  if (typeof calculateInheritanceCash === "function") {
    inheritanceData.cashInfo = calculateInheritanceCash(state, badges);
  }

  // 生成叙事文案
  if (typeof generateInheritanceNarrative === "function") {
    inheritanceData.narrative = generateInheritanceNarrative(
      state,
      badges,
      inheritanceData.cashInfo,
    );
  }

  // 保存到 localStorage
  try {
    localStorage.setItem(
      "_lastGameInheritance",
      JSON.stringify(inheritanceData),
    );
  } catch (e) {
    console.error("保存遗产数据失败:", e);
  }

  // 优先使用新的胜利字段
  const title =
    state.flags.victoryTitle ||
    (state.flags.victoryType === "p10" ? "🏆 登峰造极！" : "💰 财务自由！");
  const desc =
    state.flags.victoryDesc ||
    (state.flags.victoryType === "p10"
      ? "你成功晋升到了P10合伙人级别，站在了职场金字塔的顶端！"
      : "你积累了2000万财富，实现了财务自由。不再为钱发愁的人生，开始了！");

  // 构建徽章文本
  var badgeText =
    badges.length > 0
      ? '<p style="margin-top:10px;color:var(--text-secondary);font-size:13px;">🏅 获得 ' +
        badges.length +
        " 枚声誉徽章，下局可继承加成</p>"
      : "";

  // v3.1：人生缎带展示
  var ribbonText = "";
  if (state.flags._lifeRibbonName) {
    var ribbonProgress =
      typeof getRibbonProgress === "function" ? getRibbonProgress() : null;
    var newBadge = state.flags._newRibbonEarned ? " ✨新获得！" : "";
    ribbonText =
      '<div style="margin-top:15px;padding:10px 15px;background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(255,215,0,0.05));border:1px solid rgba(255,215,0,0.3);border-radius:8px;text-align:center;">' +
      '<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">🎖️ 人生缎带' +
      newBadge +
      "</div>" +
      '<div style="font-size:18px;font-weight:bold;color:#FFD700;">' +
      state.flags._lifeRibbonName +
      "</div>" +
      (ribbonProgress
        ? '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">已收集 ' +
          ribbonProgress.earned +
          "/" +
          ribbonProgress.total +
          " 条缎带</div>"
        : "") +
      "</div>";
  }

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
        ${badgeText}
        ${ribbonText}
      </div>`,
    buttons: [
      {
        text: "🔄 新游戏+ (继承加成)",
        cls: "btn-primary",
        callback: () => {
          location.reload();
        },
      },
      {
        text: "🔄 全新开始",
        cls: "btn-secondary",
        callback: () => {
          localStorage.removeItem("_lastGameInheritance");
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

/**
 * 玩家个人职场历史书（P0 - 公司历史书 UI）
 *
 * 显示：入职时间线、绩效历史表格、完成项目列表、团队成员变动、历史统计
 * 可折叠/展开，职场Tab有「查看公司历史」按钮
 */
function renderCompanyHistory(state) {
  var area = document.getElementById("content-area");
  if (!area) return;

  var corp = state.corporate || {};
  var p = state.player || {};
  var rankData = CORP_RANKS[corp.rank] || {};

  // ====== 头部信息 ======
  var headerHtml = "";
  if (corp.company) {
    headerHtml =
      '<div style="padding:16px;margin-bottom:16px;background:var(--bg-card);border-radius:8px;border-left:4px solid var(--accent);">' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">' +
      '<span style="font-size:32px;">🏢</span>' +
      "<div>" +
      '<h2 style="margin:0;font-size:18px;color:var(--text-primary);">' +
      _esc(corp.company.name || "未知公司") +
      "</h2>" +
      '<div style="font-size:12px;color:var(--text-secondary);">' +
      (corp.company.industry || "未知行业") +
      " · " +
      (corp.company.culture || "") +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div style="display:flex;gap:24px;font-size:11px;color:var(--text-muted);">' +
      "<span>📅 入职第 " +
      (p.corpYear || 0) +
      "年 Q" +
      (p.corpQuarter || 1) +
      "</span>" +
      '<span>🏷️ 当前职级 <strong style="color:var(--accent);">' +
      (corp.rank || "P5") +
      "</strong></span>" +
      "<span>💼 行动力 " +
      (corp.actionsUsed || 0) +
      "/" +
      (rankData.maxActions || 3) +
      "</span>" +
      "</div>" +
      "</div>";
  }

  // ====== 入职时间线 ======
  var timelineHtml = "";
  var milestones = [];

  // 入职
  milestones.push({
    day: p.day - (p.corpYear * 365 + (p.corpQuarter - 1) * 90) + 1 || 1,
    label: "入职",
    desc: "第一天进入 " + (corp.company?.name || "公司"),
    icon: "🚪",
    color: "ch-milestone-normal",
  });

  // 晋升历史
  if (corp.promotionHistory && corp.promotionHistory.length > 0) {
    for (var i = 0; i < corp.promotionHistory.length; i++) {
      var prom = corp.promotionHistory[i];
      milestones.push({
        day: prom.day,
        label: "晋升 " + prom.toRank,
        desc: "从 " + (prom.fromRank || "?") + " 晋升到 " + prom.toRank,
        icon: "🚀",
        color: "ch-milestone-ipo",
      });
    }
  }

  // IPO（如果公司上市了）
  if (corp.company?.ipoed) {
    milestones.push({
      day: corp.company.ipoDay || p.day,
      label: "公司IPO",
      desc: corp.company.name + " 成功上市！",
      icon: "📈",
      color: "ch-milestone-ipo",
    });
  }

  // 当前
  milestones.push({
    day: p.day,
    label: "当前",
    desc: "在职中 · " + (corp.rank || "P5"),
    icon: "📍",
    color: "ch-milestone-normal",
  });

  timelineHtml =
    '<div style="padding:16px;margin-bottom:16px;background:var(--bg-card);border-radius:8px;">' +
    '<h3 style="margin:0 0 12px;font-size:14px;color:var(--text-primary);">📅 入职时间线</h3>' +
    '<div class="ch-timeline" style="position:relative;padding-left:20px;">' +
    '<div style="position:absolute;left:8px;top:0;bottom:0;width:2px;background:var(--border);"></div>';

  for (var j = 0; j < milestones.length; j++) {
    var m = milestones[j];
    timelineHtml +=
      '<div class="ch-timeline-item ' +
      (m.color || "ch-milestone-normal") +
      '" style="position:relative;padding-left:16px;margin-bottom:12px;">' +
      '<div class="ch-timeline-dot" style="position:absolute;left:-16px;top:2px;width:16px;height:16px;border-radius:50%;background:var(--accent);border:2px solid var(--bg-card);z-index:1;">' +
      (m.icon || "📍") +
      "</div>" +
      '<div class="ch-timeline-day" style="font-size:10px;color:var(--text-muted);margin-bottom:2px;">第' +
      (m.day || 0) +
      "天 · " +
      (m.label || "") +
      "</div>" +
      '<div class="ch-timeline-desc" style="font-size:12px;color:var(--text-secondary);">' +
      (m.desc || "") +
      "</div>" +
      "</div>";
  }

  timelineHtml += "</div></div>";

  // ====== 绩效历史表格 ======
  var perfHtml = "";
  if (corp.perfHistory && corp.perfHistory.length > 0) {
    var perfTable =
      '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
      '<thead><tr style="background:var(--bg-secondary);">' +
      '<th style="padding:8px;text-align:left;border-bottom:1px solid var(--border);">季度</th>' +
      '<th style="padding:8px;text-align:left;border-bottom:1px solid var(--border);">绩效</th>' +
      '<th style="padding:8px;text-align:left;border-bottom:1px solid var(--border);">KPI</th>' +
      '<th style="padding:8px;text-align:left;border-bottom:1px solid var(--border);">能力</th>' +
      '<th style="padding:8px;text-align:left;border-bottom:1px solid var(--border);">备注</th>' +
      "</tr></thead><tbody>";

    for (var k = 0; k < corp.perfHistory.length; k++) {
      var perf = corp.perfHistory[k];
      var perfColor =
        perf.grade === "S+"
          ? "#2ecc71"
          : perf.grade === "S"
            ? "#27ae60"
            : perf.grade === "A"
              ? "#3498db"
              : perf.grade === "B"
                ? "#f39c12"
                : "#e74c3c";
      perfTable +=
        '<tr style="border-bottom:1px solid var(--border);">' +
        '<td style="padding:8px;">Q' +
        (perf.quarter || "?") +
        "</td>" +
        '<td style="padding:8px;"><span style="font-weight:bold;color:' +
        perfColor +
        ';">' +
        (perf.grade || "?") +
        "</span></td>" +
        '<td style="padding:8px;">' +
        (perf.kpi || 0) +
        "</td>" +
        '<td style="padding:8px;">' +
        (perf.ability || 0) +
        "</td>" +
        '<td style="padding:8px;color:var(--text-muted);">' +
        (perf.note || "") +
        "</td>" +
        "</tr>";
    }

    perfTable += "</tbody></table>";
    perfHtml =
      '<div style="padding:16px;margin-bottom:16px;background:var(--bg-card);border-radius:8px;">' +
      '<h3 style="margin:0 0 12px;font-size:14px;color:var(--text-primary);">📊 绩效历史</h3>' +
      '<div style="overflow-x:auto;">' +
      perfTable +
      "</div>" +
      "</div>";
  }

  // ====== 完成项目列表 ======
  var projectHtml = "";
  if (corp.completedProjects && corp.completedProjects.length > 0) {
    var projList =
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;">';
    for (var l = 0; l < corp.completedProjects.length; l++) {
      var proj = corp.completedProjects[l];
      projList +=
        '<div style="padding:12px;background:var(--bg-secondary);border-radius:6px;">' +
        '<div style="font-size:13px;font-weight:bold;color:var(--text-primary);margin-bottom:4px;">' +
        (proj.name || "未知项目") +
        "</div>" +
        '<div style="font-size:11px;color:var(--text-secondary);">' +
        (proj.desc || "") +
        "</div>" +
        '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">' +
        "完成于第" +
        (proj.day || "?") +
        "天 · 贡献度" +
        (proj.contribution || 0) +
        "</div>" +
        "</div>";
    }
    projList += "</div>";

    projectHtml =
      '<div style="padding:16px;margin-bottom:16px;background:var(--bg-card);border-radius:8px;">' +
      '<h3 style="margin:0 0 12px;font-size:14px;color:var(--text-primary);">✅ 完成项目</h3>' +
      projList +
      "</div>";
  }

  // ====== 团队成员变动 ======
  var teamHtml = "";
  if (corp.teamHistory && corp.teamHistory.length > 0) {
    var teamList = "";
    for (var m_idx = 0; m_idx < corp.teamHistory.length; m_idx++) {
      var th = corp.teamHistory[m_idx];
      var actionIcon =
        th.action === "hire" ? "👤" : th.action === "fire" ? "🚪" : "🔄";
      teamList +=
        '<div style="padding:8px;margin-bottom:4px;background:var(--bg-secondary);border-radius:4px;font-size:12px;">' +
        '<span style="color:var(--text-muted);font-size:10px;">第' +
        (th.day || "?") +
        "天</span> " +
        actionIcon +
        " <strong>" +
        _esc(th.name || "未知") +
        "</strong> " +
        (th.action === "hire"
          ? "加入团队"
          : th.action === "fire"
            ? "被解雇"
            : "变动") +
        " · " +
        (th.role || "") +
        (th.reason ? " · " + _esc(th.reason) : "") +
        "</div>";
    }

    teamHtml =
      '<div style="padding:16px;margin-bottom:16px;background:var(--bg-card);border-radius:8px;">' +
      '<h3 style="margin:0 0 12px;font-size:14px;color:var(--text-primary);">👥 团队成员变动</h3>' +
      teamList +
      "</div>";
  }

  // ====== 历史统计 ======
  var statsHtml = "";
  var totalProjects = (corp.completedProjects || []).length;
  var totalPerf = (corp.perfHistory || []).length;
  var totalTeam = (corp.team || []).length;
  var avgKpi = 0;
  if (corp.perfHistory && corp.perfHistory.length > 0) {
    var sumKpi = 0;
    for (var n = 0; n < corp.perfHistory.length; n++) {
      sumKpi += corp.perfHistory[n].kpi || 0;
    }
    avgKpi = Math.round(sumKpi / corp.perfHistory.length);
  }

  statsHtml =
    '<div style="padding:16px;background:var(--bg-card);border-radius:8px;">' +
    '<h3 style="margin:0 0 12px;font-size:14px;color:var(--text-primary);">📈 职场统计</h3>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;">' +
    '<div style="text-align:center;padding:12px;background:var(--bg-secondary);border-radius:8px;">' +
    '<div style="font-size:24px;font-weight:bold;color:var(--accent);">' +
    (p.corpYear || 0) +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-muted);">在职年数</div>' +
    "</div>" +
    '<div style="text-align:center;padding:12px;background:var(--bg-secondary);border-radius:8px;">' +
    '<div style="font-size:24px;font-weight:bold;color:var(--accent);">' +
    totalPerf +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-muted);">绩效评审次数</div>' +
    "</div>" +
    '<div style="text-align:center;padding:12px;background:var(--bg-secondary);border-radius:8px;">' +
    '<div style="font-size:24px;font-weight:bold;color:var(--accent);">' +
    totalProjects +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-muted);">完成项目</div>' +
    "</div>" +
    '<div style="text-align:center;padding:12px;background:var(--bg-secondary);border-radius:8px;">' +
    '<div style="font-size:24px;font-weight:bold;color:var(--accent);">' +
    avgKpi +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-muted);">平均KPI</div>' +
    "</div>" +
    '<div style="text-align:center;padding:12px;background:var(--bg-secondary);border-radius:8px;">' +
    '<div style="font-size:24px;font-weight:bold;color:var(--accent);">' +
    (corp.rank || "P5") +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-muted);">当前职级</div>' +
    "</div>" +
    '<div style="text-align:center;padding:12px;background:var(--bg-secondary);border-radius:8px;">' +
    '<div style="font-size:24px;font-weight:bold;color:var(--accent);">' +
    totalTeam +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-muted);">当前团队</div>' +
    "</div>" +
    "</div>" +
    "</div>";

  // ====== 组合输出 ======
  area.innerHTML =
    '<div class="company-history-page">' +
    headerHtml +
    timelineHtml +
    statsHtml +
    perfHtml +
    projectHtml +
    teamHtml +
    "</div>";
}

/** P2.11 计算新游戏+继承内容 */
function buildNgPlusData(state) {
  var data = { version: 1, victoryType: state.flags.victoryType || "normal" };
  // 起始现金奖励（基于上局总收入的1%，上限5000）
  var totalEarned = state.resources.totalEarned || 0;
  data.startCash = Math.min(5000, Math.floor(totalEarned * 0.01));
  // 继承最高技能（在新游戏中从20级开始）
  var topSkill = null,
    topLvl = 0;
  var skills = state.skills || {};
  for (var sk in skills) {
    if (skills[sk] && (skills[sk].level || 0) > topLvl) {
      topLvl = skills[sk].level;
      topSkill = sk;
    }
  }
  data.inheritSkill = topSkill;
  data.inheritSkillLevel = Math.min(20, Math.floor(topLvl * 0.2));
  // 继承声誉（如果有历史声誉标签）
  if (typeof getHistoryModifiers === "function") {
    var rep = getHistoryModifiers(state).reputationLabel;
    if (rep) data.reputationLabel = rep;
  }
  // 属性小头部奖励（上局最高属性的10%加成，最多+5）
  var p = state.player;
  var maxStat = Math.max(
    p.intelligence || 0,
    p.physique || 0,
    p.agility || 0,
    p.mental || 0,
  );
  data.statBonus = Math.min(5, Math.floor(maxStat * 0.1));
  return data;
}

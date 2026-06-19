/**
 * 职场专用 UI 组件
 */

/**
 * 企业命运标签 — 在职场Tab公司名旁显示健康度+阶段
 */
function _fateTag(state, companyId) {
  if (!state.enterpriseFate || !state.enterpriseFate.companies || !companyId)
    return "";
  var co = state.enterpriseFate.companies[companyId];
  if (!co) return "";
  var phaseDef = CORP_LIFECYCLE_PHASES[co.phase];
  if (!phaseDef) return "";
  var healthColor =
    co.health > 60 ? "#4a9e5c" : co.health > 30 ? "#f39c12" : "#c4553d";
  var tag =
    '<span style="margin-left:8px;font-size:10px;color:' +
    phaseDef.color +
    ';">' +
    phaseDef.icon +
    " " +
    phaseDef.name +
    ' · 健康度<span style="color:' +
    healthColor +
    ';">' +
    Math.round(co.health) +
    "</span></span>";

  // Phase 1#5：如果已IPO，添加上市标记
  if (co.ipoed) {
    tag +=
      '<span style="margin-left:4px;font-size:9px;color:#f59e0b;">🔔 IPO</span>';
  }

  // Phase 1#4：如果同板块有公司出事，显示行业预警
  if (co.knownToPlayer && state.enterpriseFate.industryIndex) {
    var industry = getCompanyIndustryById && getCompanyIndustryById(companyId);
    if (industry) {
      // 检查同板块是否有危险公司
      // (简化：在render中动态判断)
    }
  }

  return tag;
}

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
  const severance =
    rankData.baseSalary * 3 * (1 + Math.floor(Math.random() * 3));
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
  // 优先使用新的胜利字段
  const title =
    state.flags.victoryTitle ||
    (state.flags.victoryType === "p10" ? "🏆 登峰造极！" : "💰 财务自由！");
  const desc =
    state.flags.victoryDesc ||
    (state.flags.victoryType === "p10"
      ? "你成功晋升到了P10合伙人级别，站在了职场金字塔的顶端！"
      : "你积累了2000万财富，实现了财务自由。不再为钱发愁的人生，开始了！");

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
        text: "🔄 新游戏+ (继承加成)",
        cls: "btn-primary",
        callback: () => {
          // P2.11 新游戏+：保存继承数据到 localStorage
          var ngData = buildNgPlusData(state);
          try {
            localStorage.setItem("_ngPlusData", JSON.stringify(ngData));
          } catch (e) {}
          location.reload();
        },
      },
      {
        text: "🔄 全新开始",
        cls: "btn-secondary",
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

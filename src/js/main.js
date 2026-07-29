/**
 * 城市浮生记 — 主入口
 *
 * 初始化游戏、管理渲染循环、绑定事件。
 */

// ====== 全局游戏实例 ======
let gameStarted = false;

// ====== 工具函数 ======

/** 设置属性条 */
function setStatBar(id, value, cssClass) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  // [全系统自洽修复] 域G A类修复: NaN/undefined 无防御，Math.max(0,Math.min(100,undefined))=NaN → DOM 显示"NaN"
  if (typeof value !== "number" || !isFinite(value)) value = 0;
  const bar = wrap.querySelector(".stat-bar");
  const valEl = wrap.querySelector(".stat-value");
  if (bar) {
    bar.style.width = Math.max(0, Math.min(100, value)) + "%";
    bar.className = "stat-bar " + cssClass;
  }
  if (valEl) {
    valEl.textContent = Math.round(value);
  }
}

/** 描述装备效果 */
function describeItemEffects(itemDef) {
  if (!itemDef || !itemDef.effects) return "";
  const parts = [];
  for (const [key, val] of Object.entries(itemDef.effects)) {
    if (key === "capacity") parts.push(`容量+${val}`);
    else if (key === "injury") parts.push(`受伤率${val < 0 ? val : "+" + val}`);
    else if (key === "illness")
      parts.push(`生病率${val < 0 ? val : "+" + val}`);
    else if (key === "fatigue") parts.push(`疲劳${val < 0 ? val : "+" + val}`);
    else if (typeof val === "number")
      parts.push(`${key}${val > 0 ? "+" + val : val}`);
  }
  return parts.join(", ");
}

/**
 * 约定式语境对话 — 从NPC数据的contextDialogue数组中读取语境台词
 * 替代getInvestmentContextLine硬编码if-else链
 * 规则：从上到下匹配第一个条件满足的条目，返回其line；无匹配返回null
 */
function getNpcContextDialogue(npcId, state) {
  if (!state || !npcId) return null;
  var npc = null;
  if (typeof NPCS !== "undefined") {
    for (var i = 0; i < NPCS.length; i++) {
      if (NPCS[i].id === npcId) {
        npc = NPCS[i];
        break;
      }
    }
  }
  if (!npc || !npc.contextDialogue || !Array.isArray(npc.contextDialogue))
    return null;
  for (var j = 0; j < npc.contextDialogue.length; j++) {
    var entry = npc.contextDialogue[j];
    if (typeof entry.condition === "function") {
      try {
        if (entry.condition(state)) return entry.line;
      } catch (e) {
        continue;
      }
    }
  }
  return null;
}

/** 检查工作需求是否满足 */
function checkJobRequirements(job, state) {
  const reqs = job.requirements || {};
  const p = state.player;
  const s = state.skills;

  if (reqs.minAge && p.age < reqs.minAge) return `需要年满${reqs.minAge}岁`;
  if (reqs.maxAge && p.age > reqs.maxAge) return `年龄超过${reqs.maxAge}岁限制`;
  if (reqs.physique && p.physique < reqs.physique)
    return `体质不足 (需要${reqs.physique})`;
  if (reqs.intelligence && p.intelligence < reqs.intelligence)
    return `智力不足 (需要${reqs.intelligence})`;
  if (reqs.agility && p.agility < reqs.agility)
    return `敏捷不足 (需要${reqs.agility})`;
  if (reqs.mental && p.mental < reqs.mental)
    return `心智不足 (需要${reqs.mental})`;
  if (reqs.cooking && s.cooking.level < reqs.cooking)
    return `烹饪技能不足 (需要${reqs.cooking})`;
  if (reqs.repair && s.repair.level < reqs.repair)
    return `维修技能不足 (需要${reqs.repair})`;
  if (reqs.sales && s.sales.level < reqs.sales)
    return `销售技能不足 (需要${reqs.sales})`;
  if (reqs.english && s.english.level < reqs.english)
    return `英语技能不足 (需要${reqs.english})`;
  if (reqs.driving && s.driving.level < reqs.driving)
    return `驾驶技能不足，需要驾照 (需要${reqs.driving})`;
  // [全系统自洽修复] 域C 修复:补全5项缺失技能检查(原仅查cooking/repair/sales/english/driving)
  if (reqs.welding && s.welding.level < reqs.welding)
    return `焊接技能不足 (需要${reqs.welding})`;
  if (reqs.electrician && s.electrician.level < reqs.electrician)
    return `电工技能不足 (需要${reqs.electrician})`;
  if (reqs.coding && s.coding.level < reqs.coding)
    return `编程技能不足 (需要${reqs.coding})`;
  if (reqs.management && s.management.level < reqs.management)
    return `管理技能不足 (需要${reqs.management})`;
  if (reqs.accounting && s.accounting.level < reqs.accounting)
    return `会计技能不足 (需要${reqs.accounting})`;
  if (job.requiredFlag && (!state.flags || !state.flags[job.requiredFlag]))
    return "尚未解锁（需要NPC好感度）";
  if (job.educationRequired && (p.education || 0) < job.educationRequired) {
    const eduNames = ["大专", "本科", "研究生"];
    return `需要${eduNames[job.educationRequired] || "本科"}学历（大学城自考获取）`;
  }

  // 分支要求检查（P2#12 技能天赋树）
  if (job.branchRequirement) {
    var br = job.branchRequirement;
    var branchId = state.skillBranches && state.skillBranches[br.skill];
    if (!branchId)
      return "需要选择" + getSkillChineseName(br.skill) + "的特定发展方向";
    if (branchId !== br.branch) {
      var branch = null;
      if (typeof getBranchById === "function") {
        branch = getBranchById(br.skill, br.branch);
      }
      return "需要选择" + (branch ? branch.name : br.branch) + "发展方向";
    }
  }

  return null; // 通过
}

/** 绑定顶栏按钮（存档/读档/新游戏/帮助/移动端菜单）— 事件委托+onclick双保险 */
function bindHeaderButtons() {
  // 方案A: onclick 直接绑定（保留原始方式，但清除 _bound 标记后重绑）
  var btnPairs = [
    {
      id: "btn-save",
      fn: function () {
        if (typeof showSaveMenu === "function") showSaveMenu();
        else StateManager.addMessage("⚠️ 存档功能不可用", "warning");
      },
    },
    {
      id: "btn-load",
      fn: function () {
        if (typeof showLoadMenu === "function") showLoadMenu();
        else StateManager.addMessage("⚠️ 读档功能不可用", "warning");
      },
    },
    {
      id: "btn-new-game-header",
      fn: function () {
        if (typeof showModal === "function") {
          showModal({
            title: "🆕 重新开始",
            body: '<p style="text-align:center;font-size:14px;line-height:1.8;">确定要放弃当前游戏吗？<br><span style="font-size:12px;color:var(--warning);">⚠️ 未保存的进度将丢失</span></p>',
            buttons: [
              {
                text: "取消",
                cls: "btn-secondary",
                callback: function () {
                  return true;
                },
              },
              {
                text: "确定重开",
                cls: "btn-danger",
                callback: function () {
                  location.reload();
                  return true;
                },
              },
            ],
          });
        }
      },
    },
    {
      id: "btn-help",
      fn: function () {
        if (typeof showHelpModal === "function") showHelpModal();
      },
    },
    {
      id: "mobile-menu-btn",
      fn: function () {
        var sidebar = document.getElementById("sidebar");
        var backdrop = document.getElementById("sidebar-backdrop");
        if (sidebar) {
          var opened = !sidebar.classList.contains("open");
          sidebar.classList.toggle("open");
          sidebar.style.left = opened ? "0" : "";
          sidebar.style.visibility = opened ? "visible" : "";
          if (backdrop) backdrop.classList.toggle("visible", opened);
        }
      },
    },
  ];
  btnPairs.forEach(function (pair) {
    var el = document.getElementById(pair.id);
    if (el) {
      el.onclick = pair.fn;
      el.style.cursor = "pointer";
      el.dataset.bound = "1"; // 标记已被方案A绑定，避免方案B双击
    }
  });

  // 方案B: 事件委托（兜底：监听 header 上的冒泡，即使 onclick 被覆盖）
  var header = document.getElementById("header");
  if (header && !header._delegateBound) {
    header.addEventListener("click", function (e) {
      var target = e.target.closest("button");
      if (!target) return;
      // 已被方案A直接绑定onclick的按钮，跳过事件委托避免双击
      if (target.dataset.bound) return;
      var id = target.id;
      var pair = btnPairs.find(function (p) {
        return p.id === id;
      });
      if (pair) {
        e.preventDefault();
        pair.fn();
      }
    });
    header._delegateBound = true;
  }
}

/** 估算工作收入 */
// [全系统自洽修复] 域A R242: 证书职业收入加成 — chefJobIncomeBonus/repairJobIncomeBonus/salesJobIncomeBonus
// 此前全库零消费者(desc宣称"餐饮收入+20%/维修收入+25%/销售收入+20%"静默失效)。
// 按 job.effects 主技能XP键匹配 _certJobIncomeBonus 映射,取最高一档,工资链乘性生效。
function getCertJobIncomeMultiplier(job, state) {
  try {
    var m = state && state.flags && state.flags._certJobIncomeBonus;
    if (!m || !job || !job.effects) return 1.0;
    var best = 0;
    if ((job.effects.cookingXp || 0) > 0 && m.cooking)
      best = Math.max(best, m.cooking);
    if ((job.effects.repairXp || 0) > 0 && m.repair)
      best = Math.max(best, m.repair);
    if ((job.effects.salesXp || 0) > 0 && m.sales)
      best = Math.max(best, m.sales);
    if (!isFinite(best) || best < 0) return 1.0;
    return 1 + Math.min(best, 0.5);
  } catch (e) {
    return 1.0;
  }
}

function estimateJobPay(job, state) {
  // 模拟3次取平均
  let total = 0;
  for (let i = 0; i < 10; i++) {
    if (typeof job.payCalc !== "function") return 0;
    let pay = job.payCalc(state);
    if (state._jobMultipliers && state._jobMultipliers[job.id]) {
      pay = Math.floor(pay * state._jobMultipliers[job.id]);
    }
    if (state._allJobsBonus && state._allJobsBonus !== 1) {
      pay = Math.floor(pay * state._allJobsBonus);
    }
    if (typeof getItemJobBonus === "function") {
      var equipMulti = getItemJobBonus(job.id, state);
      if (equipMulti !== 1.0) {
        pay = Math.floor(pay * equipMulti);
      }
    }
    if (typeof getSuiteJobBonus === "function") {
      var suiteMulti = getSuiteJobBonus(job.id, state);
      if (suiteMulti !== 1.0) {
        pay = Math.floor(pay * suiteMulti);
      }
    }
    if (typeof getNewsJobMultiplier === "function") {
      pay = Math.floor(pay * getNewsJobMultiplier(job.id, state));
    }
    // [全系统自洽修复] 域A R242: 证书职业收入加成(估算与实发一致)
    var certMultEst = getCertJobIncomeMultiplier(job, state);
    if (certMultEst !== 1.0) pay = Math.floor(pay * certMultEst);
    // v3.1: 难度工资乘数
    if (typeof getDifficultyMultiplier === "function") {
      var wageMult = getDifficultyMultiplier(state, "wage");
      if (wageMult !== 1.0) pay = Math.floor(pay * wageMult);
    }
    total += pay;
  }
  return Math.floor(total / 10);
}

/** 估算工作收入范围（20次模拟取 min/max/avg，含各项加成）
 *  用于在卡片上显示"当前状态下实际能赚到的区间"，而非固定的 payCalc 裸区间 */
function estimateJobPayRange(job, state) {
  var results = [];
  for (var i = 0; i < 20; i++) {
    if (typeof job.payCalc !== "function") return { min: 0, max: 0, avg: 0 };
    var pay = job.payCalc(state);
    if (state._jobMultipliers && state._jobMultipliers[job.id])
      pay = Math.floor(pay * state._jobMultipliers[job.id]);
    if (state._allJobsBonus && state._allJobsBonus !== 1)
      pay = Math.floor(pay * state._allJobsBonus);
    if (typeof getItemJobBonus === "function") {
      var equipMulti = getItemJobBonus(job.id, state);
      if (equipMulti !== 1.0) pay = Math.floor(pay * equipMulti);
    }
    if (typeof getSuiteJobBonus === "function") {
      var suiteMulti = getSuiteJobBonus(job.id, state);
      if (suiteMulti !== 1.0) pay = Math.floor(pay * suiteMulti);
    }
    if (typeof getNewsJobMultiplier === "function")
      pay = Math.floor(pay * getNewsJobMultiplier(job.id, state));
    // [全系统自洽修复] 域A R242: 证书职业收入加成(区间估算与实发一致)
    var certMultRange = getCertJobIncomeMultiplier(job, state);
    if (certMultRange !== 1.0) pay = Math.floor(pay * certMultRange);
    if (typeof getDifficultyMultiplier === "function") {
      var wageMult = getDifficultyMultiplier(state, "wage");
      if (wageMult !== 1.0) pay = Math.floor(pay * wageMult);
    }
    results.push(pay);
  }
  var min = Math.min.apply(null, results);
  var max = Math.max.apply(null, results);
  var total = 0;
  for (var j = 0; j < results.length; j++) total += results[j];
  return { min: min, max: max, avg: Math.floor(total / results.length) };
}

/** 估算工作收入并返回加成明细（P3.5）*/
function estimateJobPayDetailed(job, state) {
  var base = Math.floor(job.payCalc(state));
  var tags = [];

  // 新闻+工作倍率
  if (state._jobMultipliers && state._jobMultipliers[job.id]) {
    var m = state._jobMultipliers[job.id];
    if (m > 1) tags.push("📰+" + Math.round((m - 1) * 100) + "%");
    else if (m < 1) tags.push("📰" + Math.round((m - 1) * 100) + "%");
    base = Math.floor(base * m);
  }
  if (state._allJobsBonus && state._allJobsBonus !== 1) {
    var ab = state._allJobsBonus;
    tags.push("📋+" + Math.round((ab - 1) * 100) + "%");
    base = Math.floor(base * ab);
  }
  // 城市脉搏
  if (typeof getNewsJobMultiplier === "function") {
    var nm = getNewsJobMultiplier(job.id, state);
    if (nm !== 1.0) {
      tags.push("🌆" + (nm > 1 ? "+" : "") + Math.round((nm - 1) * 100) + "%");
      base = Math.floor(base * nm);
    }
  }
  // 技能加成
  if (typeof getSkillPayBonus === "function") {
    var sb = getSkillPayBonus(job.id, state);
    if (sb > 1.0) {
      tags.push("📚+" + Math.round((sb - 1) * 100) + "%");
      base = Math.floor(base * sb);
    }
  }
  // 技能协同
  if (typeof getSkillSynergyBonus === "function") {
    var syn = getSkillSynergyBonus(job.id, state);
    if (syn > 0) {
      tags.push("✨+" + Math.round(syn * 100) + "%");
      base = Math.floor(base * (1 + syn));
    }
  }
  // NPC在场
  if (typeof getNpcPresenceBonus === "function") {
    var np = getNpcPresenceBonus(state.trade.currentLocation, job.id, state);
    if (np > 1.0) {
      tags.push("👥+" + Math.round((np - 1) * 100) + "%");
      base = Math.floor(base * np);
    }
  }
  // 历史声誉
  if (typeof getHistoryModifiers === "function") {
    var hm = getHistoryModifiers(state);
    if (hm.earningsBonus > 1.0) {
      tags.push("🏅+" + Math.round((hm.earningsBonus - 1) * 100) + "%");
      base = Math.floor(base * hm.earningsBonus);
    }
  }
  // 装备加成
  if (typeof getItemJobBonus === "function") {
    var equipMulti = getItemJobBonus(job.id, state);
    if (equipMulti !== 1.0) {
      tags.push("🎒+" + Math.round((equipMulti - 1) * 100) + "%");
      base = Math.floor(base * equipMulti);
    }
  }
  // 套装加成
  if (typeof getSuiteJobBonus === "function") {
    var suiteMulti = getSuiteJobBonus(job.id, state);
    if (suiteMulti !== 1.0) {
      tags.push("🎯+" + Math.round((suiteMulti - 1) * 100) + "%");
      base = Math.floor(base * suiteMulti);
    }
  }
  // 连击加成
  var streakData =
    state.flags && state.flags._jobStreaks && state.flags._jobStreaks[job.id];
  if (
    streakData &&
    streakData.count >= 3 &&
    streakData.lastDay === state.player.day - 1
  ) {
    var streakRate =
      streakData.count >= 7 ? 0.15 : streakData.count >= 5 ? 0.1 : 0.05;
    tags.push("🔥+" + Math.round(streakRate * 100) + "%");
    base = Math.floor(base * (1 + streakRate));
  }
  // 职业称号加成
  if (state.flags && state.flags._jobTitles && state.flags._jobTitles[job.id]) {
    var titleTier = state.flags._jobTitles[job.id];
    if (titleTier >= 3) {
      tags.push("👑+15%");
      base = Math.floor(base * 1.15);
    } else if (titleTier >= 2) {
      tags.push("🎖️+8%");
      base = Math.floor(base * 1.08);
    }
  }

  // 计算实际收入区间（含全部加成后的 min/max）
  var range = typeof estimateJobPayRange === "function"
    ? estimateJobPayRange(job, state)
    : { min: base, max: Math.floor(base * 1.3) };

  return { estimated: base, tags: tags, min: range.min, max: range.max };
}

// ====== 欢迎界面 ======
// ====== 模式选择 ======

/** 返回欢迎界面 */
function showWelcome() {
  var screen = document.getElementById("welcome-screen");
  var modeSelect = document.getElementById("mode-select-screen");
  var scenarioSelect = document.getElementById("scenario-select-screen");
  var sandboxScreen = document.getElementById("sandbox-screen");
  var app = document.getElementById("app");
  [modeSelect, scenarioSelect, sandboxScreen, app].forEach(function (el) {
    if (el) el.style.display = "none";
  });
  if (screen) {
    screen.style.display = "flex";
    // 重置游戏状态标记，回到欢迎界面
    gameStarted = false;
    // 刷新存档信息
    var loadSection = document.getElementById("load-section");
    if (loadSection) {
      var allSlots = getAllSlots();
      if (allSlots.length > 0) {
        allSlots.sort(function (a, b) {
          return (b.savedAt || 0) - (a.savedAt || 0);
        });
        var latest = allSlots[0];
        loadSection.style.display = "";
        var modeTag = latest.mode ? " " + latest.mode : "";
        var isAuto = latest.slot === "_auto";
        loadSection.innerHTML =
          '<button id="btn-load-latest" class="btn btn-lg">' +
          (isAuto ? "🤖 " : "📂 ") +
          "继续游戏" +
          modeTag +
          " (第" +
          latest.day +
          "天, ¥" +
          (latest.cash ? latest.cash.toLocaleString() : 0) +
          ")" +
          (isAuto
            ? '<span style="display:block;font-size:10px;color:var(--text-muted);margin-top:2px;">自动存档 · 每日自动保存</span>'
            : "") +
          "</button>" +
          '<button id="btn-load-menu" class="btn btn-sm" style="margin-top:8px;">📋 选择存档...</button>';
        document.getElementById("btn-load-latest").onclick = function () {
          console.log("[btn-load-latest] clicked, slot=", latest.slot, "latest=", JSON.stringify(latest));
          loadExistingGame(latest.slot);
        };
        document.getElementById("btn-load-menu").onclick = function () {
          console.log("[btn-load-menu] clicked");
          showLoadMenuOnWelcome();
        };
      } else {
        loadSection.style.display = "none";
      }
    }
    document.getElementById("btn-new-game").onclick = showModeSelect;
    document.getElementById("btn-skip-tutorial").onclick = showModeSelect;
  }
}

/** 显示模式选择界面 */
function showModeSelect() {
  ["welcome-screen", "scenario-select-screen", "sandbox-screen"].forEach(
    function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = "none";
      el && id === "welcome-screen" && (el.style.display = "none");
    },
  );
  var screen = document.getElementById("mode-select-screen");
  if (screen) {
    screen.style.display = "flex";
    screen.style.flexDirection = "column";
    screen.style.alignItems = "center";
    screen.style.justifyContent = "center";
    screen.style.minHeight = "100vh";
  }
}

/** 显示剧本选择界面 */
function showScenarioSelect() {
  var modeScreen = document.getElementById("mode-select-screen");
  if (modeScreen) modeScreen.style.display = "none";
  var sandboxScreen = document.getElementById("sandbox-screen");
  if (sandboxScreen) sandboxScreen.style.display = "none";
  var scenarioScreen = document.getElementById("scenario-select-screen");
  if (!scenarioScreen) return;
  scenarioScreen.style.display = "flex";
  scenarioScreen.style.flexDirection = "column";
  scenarioScreen.style.alignItems = "center";
  scenarioScreen.style.justifyContent = "center";
  scenarioScreen.style.minHeight = "100vh";

  // 渲染剧本列表
  var listEl = document.getElementById("scenario-list");
  if (!listEl) return;
  var html = "";

  // v3.0 P2-B-2：难度选择器（顶部）
  if (typeof renderDifficultyPicker === "function") {
    html += renderDifficultyPicker(function (level) {
      window._selectedDifficulty = level;
    });
    // 默认选中标准
    if (!window._selectedDifficulty) window._selectedDifficulty = "normal";
    setTimeout(function () {
      if (window.__difficultyPickerSelect) {
        window.__difficultyPickerSelect(window._selectedDifficulty);
      }
    }, 0);
  }

  // 默认模式单独显示
  var defaultScenario = getScenarioById("classic");
  if (defaultScenario) {
    html += buildScenarioCard(defaultScenario, true);
  }
  html +=
    '<div style="font-size:11px;color:var(--text-muted);padding:4px 0 2px 6px;font-weight:600;">📜 剧本模式</div>';
  var scenarioScenarios = SCENARIOS.filter(function (s) {
    return s.category === "scenario";
  });
  for (var i = 0; i < scenarioScenarios.length; i++) {
    html += buildScenarioCard(scenarioScenarios[i], false);
  }
  listEl.innerHTML = html;
}

/** 构建单个剧本卡片 HTML */
function buildScenarioCard(scenario, isDefault) {
  var tagsHtml = "";
  if (scenario.tags) {
    for (var t = 0; t < scenario.tags.length; t++) {
      tagsHtml +=
        '<span class="scenario-card-tag">' + scenario.tags[t] + "</span>";
    }
  }
  var modeLabel = isDefault ? "（默认）" : "";
  return (
    '<div class="scenario-card" onclick="selectScenario(\'' +
    scenario.id +
    "')\">" +
    '<div class="scenario-card-icon">' +
    scenario.icon +
    "</div>" +
    '<div class="scenario-card-body">' +
    '<div class="scenario-card-title">' +
    scenario.name +
    ' <span style="font-size:11px;color:var(--text-muted)">' +
    scenario.difficultyLabel +
    " " +
    scenario.difficulty +
    modeLabel +
    "</span></div>" +
    '<div class="scenario-card-brief">' +
    scenario.brief +
    "</div>" +
    '<div class="scenario-card-tags">' +
    tagsHtml +
    "</div>" +
    "</div>" +
    "</div>"
  );
}

/** 选择剧本 */
function selectScenario(scenarioId) {
  showScenarioDetail(scenarioId);
}

/** 显示剧本详情弹窗 */
function showScenarioDetail(scenarioId) {
  var s = getScenarioById(scenarioId);
  if (!s) return;

  var statNames = {
    physique: "体质",
    intelligence: "智力",
    agility: "敏捷",
    mental: "心智",
  };
  var statsHtml = "";
  for (var key in s.stats) {
    if (s.stats.hasOwnProperty(key)) {
      var val = s.stats[key];
      var color =
        val >= 35 ? "var(--success)" : val >= 20 ? "" : "var(--danger)";
      statsHtml +=
        '<div class="scenario-detail-stat">' +
        '<span class="scenario-detail-stat-label">' +
        (statNames[key] || key) +
        "</span>" +
        '<span class="scenario-detail-stat-val" style="color:' +
        color +
        '">' +
        val +
        "</span>" +
        "</div>";
    }
  }

  var resourceLines = "";
  resourceLines +=
    '<div class="scenario-detail-stat"><span class="scenario-detail-stat-label">💰 现金</span><span class="scenario-detail-stat-val" style="color:' +
    ((s.resources.cash || 0) >= 5000 ? "var(--success)" : "") +
    '">¥' +
    (s.resources.cash || 0).toLocaleString() +
    "</span></div>";
  if (s.resources.bankBalance > 0) {
    resourceLines +=
      '<div class="scenario-detail-stat"><span class="scenario-detail-stat-label">🏦 存款</span><span class="scenario-detail-stat-val" style="color:var(--success)">¥' +
      s.resources.bankBalance.toLocaleString() +
      "</span></div>";
  }
  if ((s.resources.villageDebt || 0) + (s.resources.fineDebt || 0) + (s.resources.bankDebt || 0) > 0) {
    resourceLines +=
      '<div class="scenario-detail-stat"><span class="scenario-detail-stat-label">💸 负债</span><span class="scenario-detail-stat-val" style="color:var(--danger)">¥' +
      (
        (s.resources.villageDebt || 0) + (s.resources.fineDebt || 0) + (s.resources.bankDebt || 0)
      ).toLocaleString() +
      "</span></div>";
  }
  resourceLines +=
    '<div class="scenario-detail-stat"><span class="scenario-detail-stat-label">🎂 年龄</span><span class="scenario-detail-stat-val">' +
    s.age +
    "岁</span></div>";
  resourceLines +=
    '<div class="scenario-detail-stat"><span class="scenario-detail-stat-label">🎓 学历</span><span class="scenario-detail-stat-val">' +
    (s.education >= 1 ? "本科" : "大专") +
    "</span></div>";

  var body =
    '<div class="scenario-detail-icon">' +
    s.icon +
    "</div>" +
    '<div class="scenario-detail-name">' +
    s.name +
    "</div>" +
    '<div class="scenario-detail-diff">' +
    s.difficulty +
    " " +
    s.difficultyLabel +
    "</div>" +
    '<div class="scenario-detail-desc">' +
    s.description +
    "</div>" +
    '<div class="scenario-detail-stats">' +
    statsHtml +
    resourceLines +
    "</div>";

  if (s.startEvent) {
    body +=
      '<div class="scenario-detail-start">📖 ' +
      s.startEvent.title +
      "：" +
      s.startEvent.text.slice(0, 60) +
      "…</div>";
  }

  showModal({
    title: "📜 确认选择",
    body: body,
    buttons: [
      {
        text: "← 返回",
        cls: "",
        callback: function () {},
      },
      {
        text: "🚀 开始这个剧本",
        cls: "btn-primary",
        callback: function () {
          startScenarioGame(scenarioId);
        },
      },
    ],
  });
}

/** 经典模式（原版开局） */
function startClassicGame() {
  startNewGame();
}

/**
 * v3.57 天赋随机抽签
 * 稀有度权重：common=60, uncommon=30, rare=10
 * 抽签数量：10%=0个(命运弄人) / 70%=1个 / 20%=2个
 * 返回 [] | [t] | [t1, t2]
 */
function rollTalents(scenario) {
  var pool = scenario.talents || [];
  if (!pool.length) return [];

  // 按稀有度权重构建加权池
  var rarityWeights = { common: 60, uncommon: 30, rare: 10 };
  var weightedPool = [];
  for (var wi = 0; wi < pool.length; wi++) {
    var tw = rarityWeights[pool[wi].rarity] || 60;
    for (var wj = 0; wj < tw; wj++) weightedPool.push(pool[wi]);
  }

  function pickOne(exclude) {
    var available = exclude
      ? weightedPool.filter(function (t) {
          return t.id !== exclude;
        })
      : weightedPool;
    if (!available.length) return null;
    return Random.fromArray(available);
  }

  // [全系统自洽修复] 域G A类: Math.random→Random.float 种子化RNG
  var roll = Random.float(0, 1);
  if (roll < 0.1) {
    return []; // 10% 命运弄人——无天赋
  } else if (roll < 0.8) {
    var t1 = pickOne(null);
    return t1 ? [t1] : []; // 70% 单天赋
  } else {
    var ta = pickOne(null);
    var tb = ta ? pickOne(ta.id) : null;
    return [ta, tb].filter(Boolean); // 20% 双天赋
  }
}

/**
 * v3.57 天赋揭示弹窗（随机已抽好，展示结果供接受/放弃）
 * 修复：z-index 10000（高于 modal-overlay 的 9999）
 */
function showTalentRevealModal(rolledTalents, onAccept, onDecline) {
  var rarityLabel = { common: "⚪ 普通", uncommon: "🔵 优秀", rare: "🟡 稀有" };
  var rarityColor = { common: "#888", uncommon: "#4a7c59", rare: "#b8860b" };

  var overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.72);z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;";

  var card = document.createElement("div");
  card.style.cssText =
    "background:var(--bg-primary,#fff);border-radius:14px;padding:24px 20px;max-width:440px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 10px 40px rgba(0,0,0,0.32);";

  var html = "";

  if (!rolledTalents.length) {
    // 0天赋——命运弄人
    html +=
      '<div style="text-align:center;font-size:2rem;margin-bottom:8px;">😶</div>';
    html +=
      '<div style="font-size:1.05rem;font-weight:700;text-align:center;margin-bottom:6px;">命运弄人</div>';
    html +=
      '<div style="color:var(--text-muted,#888);font-size:0.85rem;text-align:center;margin-bottom:20px;">这一局，命运没有给你任何天赋加成。<br>但有些人，就是靠自己走出来的。</div>';
    html +=
      '<button id="_talent_ok" style="width:100%;padding:11px;background:var(--accent-text,#4a7c59);color:#fff;border:none;border-radius:8px;font-size:0.95rem;cursor:pointer;font-weight:600;">好，靠自己</button>';
  } else {
    // 1-2天赋——揭晓结果
    var hasRare = rolledTalents.some(function (t) {
      return t.rarity === "rare";
    });
    var titleEmoji =
      rolledTalents.length === 2 ? "🎲 双重天赋" : "✨ 本次人生天赋";
    html +=
      '<div style="font-size:1.08rem;font-weight:700;margin-bottom:4px;">' +
      titleEmoji +
      "</div>";
    html +=
      '<div style="color:var(--text-muted,#888);font-size:0.82rem;margin-bottom:16px;">命运为你选好了，接受还是放弃？</div>';

    for (var ri = 0; ri < rolledTalents.length; ri++) {
      var t = rolledTalents[ri];
      var rColor = rarityColor[t.rarity] || "#888";
      var rLabel = rarityLabel[t.rarity] || "⚪ 普通";
      html +=
        '<div style="border:2px solid ' +
        rColor +
        ';border-radius:10px;padding:13px 14px;margin-bottom:12px;">';
      html +=
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">';
      html +=
        '<span style="font-weight:700;font-size:0.96rem;">' +
        t.icon +
        " " +
        t.name +
        "</span>";
      html +=
        '<span style="font-size:0.75rem;color:' +
        rColor +
        ';font-weight:600;">' +
        rLabel +
        "</span>";
      html += "</div>";
      html +=
        '<div style="color:var(--text-secondary,#555);font-size:0.82rem;">' +
        t.desc +
        "</div>";
      html += "</div>";
    }

    html += '<div style="display:flex;gap:10px;margin-top:4px;">';
    html +=
      '<button id="_talent_decline" style="flex:1;padding:10px;background:transparent;color:var(--text-muted,#888);border:1.5px solid var(--border,#ddd);border-radius:8px;font-size:0.88rem;cursor:pointer;">放弃，靠自己</button>';
    html +=
      '<button id="_talent_accept" style="flex:2;padding:10px;background:var(--accent-text,#4a7c59);color:#fff;border:none;border-radius:8px;font-size:0.92rem;cursor:pointer;font-weight:700;">✨ 接受天赋</button>';
    html += "</div>";
  }

  card.innerHTML = html;
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  function close() {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  var acceptBtn = card.querySelector("#_talent_accept");
  var declineBtn = card.querySelector("#_talent_decline");
  var okBtn = card.querySelector("#_talent_ok");

  if (acceptBtn)
    acceptBtn.addEventListener("click", function () {
      close();
      onAccept(rolledTalents);
    });
  if (declineBtn)
    declineBtn.addEventListener("click", function () {
      close();
      onDecline();
    });
  if (okBtn)
    okBtn.addEventListener("click", function () {
      close();
      onDecline();
    });
}

/** 剧本模式开局 */
function startScenarioGame(scenarioId) {
  var scenario = getScenarioById(scenarioId);
  if (!scenario) {
    startNewGame();
    return;
  }
  StateManager.newGame();
  initializePrices();

  // 应用剧本配置
  var state = StateManager.getState();

  // --- 基础属性（v3.0 新增 charm 颜值 + morality 道德）---
  state.player.physique = scenario.stats.physique || 22;
  state.player.intelligence = scenario.stats.intelligence || 20;
  state.player.agility = scenario.stats.agility || 24;
  state.player.mental = scenario.stats.mental || 26;
  state.player.charm = scenario.stats.charm || 20; // v3.0 颜值
  state.player.morality =
    scenario.morality !== undefined ? scenario.morality : 50; // v3.0 道德
  state.player.age = scenario.age || 20;
  state.player.fame = scenario.fame || 0;
  state.player.education = scenario.education || 0;
  state.player.eduProgress =
    scenario.education >= 1
      ? { studyPoints: 0, examsPassed: 6, totalExams: 6 }
      : { studyPoints: 0, examsPassed: 0, totalExams: 6 };

  // --- 资源 ---
  state.resources.cash = scenario.resources.cash || 1500;
  state.resources.bankBalance = scenario.resources.bankBalance || 0;
  state.resources.villageDebt = scenario.resources.villageDebt || 0;
  state.resources.bankDebt = scenario.resources.bankDebt || 0;
  state.resources.debt =
    (scenario.resources.villageDebt || 0) + (scenario.resources.fineDebt || 0) + (scenario.resources.bankDebt || 0);
  state.resources.loanPrincipal = scenario.resources.villageDebt || 0;
  state.resources.loanDay = 0;

  // --- 技能 ---
  if (scenario.skills) {
    for (var skillKey in scenario.skills) {
      if (scenario.skills.hasOwnProperty(skillKey) && state.skills[skillKey]) {
        state.skills[skillKey].level = scenario.skills[skillKey].level || 0;
        state.skills[skillKey].xp = scenario.skills[skillKey].xp || 0;
      }
    }
  }

  // --- 需求 ---
  if (scenario.needs) {
    if (!state.needs) state.needs = {};
    state.needs.hunger = scenario.needs.hunger || 70;
    state.needs.fatigue = scenario.needs.fatigue || 15;
    state.needs.hygiene = scenario.needs.hygiene || 75;
    state.needs.happiness = scenario.needs.happiness || 55;
  }

  // --- 健康 ---
  if (!state.status) state.status = {};
  state.status.health = scenario.health || 100;

  // --- 住所 ---
  state.housing.tier = scenario.housingTier || 0;
  state.housing.rentedDay = state.player.day;
  // [全系统自洽修复] 域G A类修复: housing.tier 支持 0-6（详见 state.js:145），原数组仅 4 元素导致 tier≥4 时 capacity=undefined → 物品容量检查永久失效
  state.inventory.capacity =
    [20, 50, 100, 200, 500, 1000, 2000][state.housing.tier] || 20;

  // --- 起始地点 ---
  if (scenario.startLocation) {
    state.trade.currentLocation = scenario.startLocation;
  }

  // --- v3.54 命运浮动：属性 ±15%、现金 ±15%（底线70%基础值）---
  // [全系统自洽修复] 域G A类: Math.random→Random.float 种子化RNG(开局浮动也应确定性)
  var _svKeys = ["physique", "intelligence", "agility", "mental", "charm"];
  for (var _svi = 0; _svi < _svKeys.length; _svi++) {
    var _svk = _svKeys[_svi];
    if (typeof state.player[_svk] === "number") {
      var _svf = 1 + (Random.float(0, 1) * 2 - 1) * 0.15;
      state.player[_svk] = Math.round(
        Math.max(1, Math.min(100, state.player[_svk] * _svf)),
      );
    }
  }
  var _cashBase = state.resources.cash || 0;
  var _cashF = 1 + (Random.float(0, 1) * 2 - 1) * 0.15;
  state.resources.cash = Math.round(
    Math.max(Math.floor(_cashBase * 0.7), _cashBase * _cashF),
  );
  // 健康 ±5
  state.status.health = Math.round(
    Math.max(1, Math.min(99, state.status.health + (Random.float(0, 1) * 10 - 5))),
  );

  // --- 剧本标记 ---
  state.flags._scenarioId = scenarioId;
  state.flags._currentScenario = scenarioId; // v3.3 W2-T3: 开局链用
  state.flags._scenarioName = scenario.name;
  state.flags._scenarioTags = scenario.narrativeTags || [];
  state.flags._isScenarioMode = true;

  // --- 初始化企业命运系统 ---
  if (typeof initEnterpriseFate === "function") {
    initEnterpriseFate(state);
  }

  // --- 开场消息 ---
  var msg = scenario.startingMessage;
  if (!msg) {
    msg = "📜 剧本模式「" + scenario.name + "」开始。祝你好运！";
  }
  StateManager.addMessage(msg, "event");
  StateManager.addMessage('💡 提示：点击"🗺️ 地图"标签可查看城市全景。', "info");
  StateManager.addMessage(
    '🚶 点击行动页的"前往 XX"卡片或地图上的地点即可出行。',
    "info",
  );

  // --- 开场特殊事件 ---
  if (scenario.startEvent) {
    var evt = scenario.startEvent;
    StateManager.addMessage("📖 " + evt.title + " " + evt.text, "event");
    if (evt.effects) {
      // [全系统自洽修复] 域G A类#1: 效果键路径映射 — happiness/fatigue/hunger/hygiene 在 state.needs 而非 state.player
      var EFFECT_ROUTES = {
        happiness: { target: "needs", max: 100 },
        fatigue: { target: "needs", max: 100 },
        hunger: { target: "needs", max: 100 },
        hygiene: { target: "needs", max: 100 },
        mental: { target: "player", max: 100 },
        fame: { target: "player", max: 100 },
        charm: { target: "player", max: 100 },
        physique: { target: "player", max: 100 },
        intelligence: { target: "player", max: 100 },
        agility: { target: "player", max: 100 },
        morality: { target: "player", max: 100 },
        health: { target: "status", max: 100 },
      };
      for (var effKey in evt.effects) {
        if (!evt.effects.hasOwnProperty(effKey)) continue;
        var route = EFFECT_ROUTES[effKey];
        if (!route) continue;
        var container = state[route.target];
        if (!container || typeof container[effKey] !== "number") continue;
        container[effKey] = Math.max(
          0,
          Math.min(route.max, container[effKey] + evt.effects[effKey]),
        );
      }
    }
  }

  // --- v3.57 天赋接受回调：接受数组 [] | [t] | [t1,t2] ---
  var _afterTalentSelected = function (acceptedTalents) {
    if (acceptedTalents && acceptedTalents.length > 0) {
      state.flags._talent = [];
      for (var _ti = 0; _ti < acceptedTalents.length; _ti++) {
        var _pt = acceptedTalents[_ti];
        if (typeof _pt.apply === "function") _pt.apply(state);
        state.flags._talent.push({
          id: _pt.id,
          name: _pt.name,
          icon: _pt.icon,
          desc: _pt.desc,
        });
      }
      var _talentNames = acceptedTalents
        .map(function (t) {
          return t.icon + " " + t.name;
        })
        .join("、");
      StateManager.addMessage("✨ 接受天赋：" + _talentNames, "event");
    } else {
      state.flags._talent = null;
      StateManager.addMessage("🎯 放弃天赋，靠自己打拼。", "event");
    }

    // === 难度系统 + 传承币解锁 ===
    if (
      typeof applyDifficultyToState === "function" &&
      window._selectedDifficulty
    ) {
      applyDifficultyToState(state, window._selectedDifficulty);
    }
    if (typeof applyHeritageUnlocks === "function") applyHeritageUnlocks(state);

    // v3.2 修复: 记录第1天日初现金
    state.flags._dayStartCash = state.resources.cash || 0;

    // 隐藏选择界面
    document.getElementById("mode-select-screen").style.display = "none";
    document.getElementById("scenario-select-screen").style.display = "none";
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("sandbox-screen").style.display = "none";

    var _enterScenarioGame = function () {
      document.getElementById("app").style.display = "";
      gameStarted = true;
      renderAll();
      if (typeof initCashCarousel === "function") initCashCarousel();
      bindHeaderButtons();
      setTimeout(function () {
        if (typeof showForcedDreamModal === "function") showForcedDreamModal();
      }, 300);
    };

    if (typeof startWithWorldNewsIntro === "function") {
      startWithWorldNewsIntro(state, scenarioId, _enterScenarioGame);
    } else {
      _enterScenarioGame();
    }
    setTimeout(function () {
      var appEl = document.getElementById("app");
      if (appEl && appEl.style.display === "none") {
        console.warn("[DIAG] app 仍 display:none，强制显示");
        appEl.style.display = "";
        if (typeof renderAll === "function") renderAll();
      }
    }, 3000);
  };
  if (scenario.talents && scenario.talents.length > 0) {
    var _rolled = rollTalents(scenario);
    showTalentRevealModal(
      _rolled,
      function (accepted) {
        _afterTalentSelected(accepted);
      },
      function () {
        _afterTalentSelected([]);
      },
    );
  } else {
    _afterTalentSelected([]);
  }
}

// ====== 沙盒模式 ======

/** 沙盒模式当前配置数据 */
var _sandboxConfig = null;

/** 显示沙盒配置界面 */
function showSandboxConfig() {
  var modeScreen = document.getElementById("mode-select-screen");
  if (modeScreen) modeScreen.style.display = "none";
  var scenarioScreen = document.getElementById("scenario-select-screen");
  if (scenarioScreen) scenarioScreen.style.display = "none";
  var sbScreen = document.getElementById("sandbox-screen");
  if (!sbScreen) return;
  sbScreen.style.display = "flex";
  sbScreen.style.flexDirection = "column";
  sbScreen.style.alignItems = "center";
  sbScreen.style.justifyContent = "center";
  sbScreen.style.minHeight = "100vh";

  // 初始化默认配置
  _sandboxConfig = JSON.parse(JSON.stringify(SANDBOX_DEFAULTS));

  renderSandboxConfig();
}

/** 渲染沙盒配置表单 */
function renderSandboxConfig() {
  var sbScreen = document.getElementById("sandbox-config");
  if (!sbScreen || !_sandboxConfig) return;
  var cfg = _sandboxConfig;

  // 计算剩余"天赋点"
  var totalStatPoints =
    cfg.physique + cfg.intelligence + cfg.agility + cfg.mental;
  var remaining = SANDBOX_MAX_TOTAL_STAT_POINTS - totalStatPoints;
  var statPointsUsed =
    (cfg.physique - 10 > 0 ? cfg.physique - 10 : 0) +
    (cfg.intelligence - 10 > 0 ? cfg.intelligence - 10 : 0) +
    (cfg.agility - 10 > 0 ? cfg.agility - 10 : 0) +
    (cfg.mental - 10 > 0 ? cfg.mental - 10 : 0);
  var talentRemaining = SANDBOX_INITIAL_TALENT_POINTS - statPointsUsed;

  // 称号
  var title = "⚪ 初来乍到";
  if (totalStatPoints >= 100) title = "🟣 天选之人";
  else if (totalStatPoints >= 80) title = "🟠 城市精英";
  else if (totalStatPoints >= 60) title = "🟢 潜力新星";

  var html =
    '<div class="sandbox-section">' +
    '<div class="sandbox-section-title">📋 基本信息</div>' +
    '<div class="sandbox-row">' +
    "<label>姓名</label>" +
    '<input type="text" id="sandbox-name" value="' +
    cfg.name +
    '" maxlength="6" style="flex:1;padding:4px 8px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text-primary);font-size:12px;outline:none;" oninput="updateSandboxConfig(\'name\', this.value)">' +
    "</div>" +
    '<div class="sandbox-row">' +
    "<label>年龄</label>" +
    '<input type="range" min="16" max="50" value="' +
    cfg.age +
    "\" oninput=\"updateSandboxConfig('age', parseInt(this.value));document.getElementById('sandbox-age-val').textContent=this.value\">" +
    '<span class="sandbox-val" id="sandbox-age-val">' +
    cfg.age +
    '</span><span style="font-size:11px;color:var(--text-muted)">岁</span>' +
    "</div>" +
    '<div class="sandbox-row">' +
    "<label>性别</label>" +
    '<select class="sandbox-select" onchange="updateSandboxConfig(\'gender\', this.value)">' +
    '<option value="male"' +
    (cfg.gender === "male" ? " selected" : "") +
    ">男</option>" +
    '<option value="female"' +
    (cfg.gender === "female" ? " selected" : "") +
    ">女</option>" +
    "</select>" +
    "</div>" +
    '<div class="sandbox-row">' +
    "<label>学历</label>" +
    '<select class="sandbox-select" onchange="updateSandboxConfig(\'education\', parseInt(this.value))">' +
    '<option value="0"' +
    (cfg.education === 0 ? " selected" : "") +
    ">大专</option>" +
    '<option value="1"' +
    (cfg.education === 1 ? " selected" : "") +
    ">本科</option>" +
    "</select>" +
    "</div>" +
    '<div class="sandbox-row">' +
    "<label>起始地点</label>" +
    '<select class="sandbox-select" onchange="updateSandboxConfig(\'startLocation\', this.value)">' +
    '<option value="slum"' +
    (cfg.startLocation === "slum" ? " selected" : "") +
    ">城中村</option>" +
    '<option value="commercialDist"' +
    (cfg.startLocation === "commercialDist" ? " selected" : "") +
    ">商业区</option>" +
    '<option value="techPark"' +
    (cfg.startLocation === "techPark" ? " selected" : "") +
    ">科技园</option>" +
    '<option value="school"' +
    (cfg.startLocation === "school" ? " selected" : "") +
    ">大学城</option>" +
    '<option value="factoryZone"' +
    (cfg.startLocation === "factoryZone" ? " selected" : "") +
    ">工业区</option>" +
    "</select>" +
    "</div>" +
    '<div class="sandbox-row">' +
    "<label>住所</label>" +
    '<select class="sandbox-select" onchange="updateSandboxConfig(\'housingTier\', parseInt(this.value))">' +
    '<option value="0"' +
    (cfg.housingTier === 0 ? " selected" : "") +
    ">露宿街头</option>" +
    '<option value="1"' +
    (cfg.housingTier === 1 ? " selected" : "") +
    ">合租床位</option>" +
    '<option value="2"' +
    (cfg.housingTier === 2 ? " selected" : "") +
    ">单间</option>" +
    "</select>" +
    "</div>" +
    "</div>" +
    // 属性
    '<div class="sandbox-section">' +
    '<div class="sandbox-section-title">💪 属性 <span class="sandbox-points-left" id="sandbox-talent-pts">天赋点剩余：' +
    talentRemaining +
    "</span></div>" +
    '<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">四项总和上限' +
    SANDBOX_MAX_TOTAL_STAT_POINTS +
    "，当前" +
    totalStatPoints +
    "，余" +
    remaining +
    "。每项最低10，超出部分消耗天赋点。</div>" +
    createSandboxStatSlider("physique", "💪 体质", cfg.physique, remaining) +
    createSandboxStatSlider(
      "intelligence",
      "🧠 智力",
      cfg.intelligence,
      remaining,
    ) +
    createSandboxStatSlider("agility", "🏃 敏捷", cfg.agility, remaining) +
    createSandboxStatSlider("mental", "🧘 心智", cfg.mental, remaining) +
    '<div style="font-size:13px;font-weight:600;margin-top:4px;">称号：' +
    title +
    "</div>" +
    "</div>" +
    // 资金
    '<div class="sandbox-section">' +
    '<div class="sandbox-section-title">💰 资金</div>' +
    '<div class="sandbox-row">' +
    "<label>现金</label>" +
    '<input type="range" min="0" max="100000" step="500" value="' +
    cfg.cash +
    "\" oninput=\"updateSandboxConfig('cash', parseInt(this.value));document.getElementById('sandbox-cash-val').textContent='¥'+parseInt(this.value).toLocaleString()\">" +
    '<span class="sandbox-val" id="sandbox-cash-val">¥' +
    cfg.cash.toLocaleString() +
    "</span>" +
    "</div>" +
    '<div class="sandbox-row">' +
    "<label>存款</label>" +
    '<input type="range" min="0" max="200000" step="1000" value="' +
    cfg.bankBalance +
    "\" oninput=\"updateSandboxConfig('bankBalance', parseInt(this.value));document.getElementById('sandbox-bank-val').textContent='¥'+parseInt(this.value).toLocaleString()\">" +
    '<span class="sandbox-val" id="sandbox-bank-val">¥' +
    cfg.bankBalance.toLocaleString() +
    "</span>" +
    "</div>" +
    '<div class="sandbox-row">' +
    "<label>欠村长</label>" +
    '<input type="range" min="0" max="50000" step="500" value="' +
    cfg.villageDebt +
    "\" oninput=\"updateSandboxConfig('villageDebt', parseInt(this.value));document.getElementById('sandbox-debt-val').textContent='¥'+parseInt(this.value).toLocaleString()\">" +
    '<span class="sandbox-val" id="sandbox-debt-val">¥' +
    cfg.villageDebt.toLocaleString() +
    "</span>" +
    "</div>" +
    '<div class="sandbox-row">' +
    "<label>欠银行</label>" +
    '<input type="range" min="0" max="50000" step="1000" value="' +
    cfg.bankDebt +
    "\" oninput=\"updateSandboxConfig('bankDebt', parseInt(this.value));document.getElementById('sandbox-bankdebt-val').textContent='¥'+parseInt(this.value).toLocaleString()\">" +
    '<span class="sandbox-val" id="sandbox-bankdebt-val">¥' +
    cfg.bankDebt.toLocaleString() +
    "</span>" +
    "</div>" +
    "</div>" +
    // 健康/名气
    '<div class="sandbox-section">' +
    '<div class="sandbox-section-title">📊 其他状态</div>' +
    '<div class="sandbox-row">' +
    "<label>健康</label>" +
    '<input type="range" min="30" max="100" value="' +
    cfg.health +
    "\" oninput=\"updateSandboxConfig('health', parseInt(this.value));document.getElementById('sandbox-health-val').textContent=this.value\">" +
    '<span class="sandbox-val" id="sandbox-health-val">' +
    cfg.health +
    "</span>" +
    "</div>" +
    '<div class="sandbox-row">' +
    "<label>名气</label>" +
    '<input type="range" min="0" max="50" value="' +
    cfg.fame +
    "\" oninput=\"updateSandboxConfig('fame', parseInt(this.value));document.getElementById('sandbox-fame-val').textContent=this.value\">" +
    '<span class="sandbox-val" id="sandbox-fame-val">' +
    cfg.fame +
    "</span>" +
    "</div>" +
    "</div>";

  // 技能
  var skillNames = {
    cooking: "🍳 烹饪",
    repair: "🔧 维修",
    coding: "💻 编程",
    english: "📖 英语",
    driving: "🚗 驾驶",
    sales: "📋 销售",
    management: "👥 管理",
    accounting: "📊 会计",
    electrician: "⚡ 电工",
    welding: "🔥 焊接",
  };
  html += '<div class="sandbox-section">';
  html +=
    '<div class="sandbox-section-title">📚 技能 <span style="font-size:11px;color:var(--text-muted);font-weight:400;">（等级0-20，消耗有限不宜过高）</span></div>';
  for (var sk in skillNames) {
    if (skillNames.hasOwnProperty(sk)) {
      var skVal = cfg[sk] || 0;
      html +=
        '<div class="sandbox-row">' +
        "<label>" +
        skillNames[sk] +
        "</label>" +
        '<input type="range" min="0" max="20" value="' +
        skVal +
        '" oninput="updateSandboxConfig(\'' +
        sk +
        "', parseInt(this.value));document.getElementById('sandbox-" +
        sk +
        "-val').textContent=this.value\">" +
        '<span class="sandbox-val" id="sandbox-' +
        sk +
        '-val">' +
        skVal +
        "</span>" +
        "</div>";
    }
  }
  html += "</div>";

  // 驾照选项
  var _hasLicenseChecked = cfg.hasLicense ? "checked" : "";
  html +=
    '<div class="sandbox-section" style="padding-top:0;">' +
    '<div class="sandbox-row" style="justify-content:flex-start;gap:8px;">' +
    '<input type="checkbox" id="sandbox-has-license" ' +
    _hasLicenseChecked +
    ' onchange="updateSandboxConfig(\'hasLicense\', this.checked)" style="width:16px;height:16px;accent-color:var(--accent-text,#4a7c59);">' +
    '<label for="sandbox-has-license" style="font-size:13px;cursor:pointer;">🚗 已有驾照（可直接从事驾驶类工作）</label>' +
    "</div>" +
    "</div>";

  // 快速预设
  html +=
    '<div class="sandbox-section">' +
    '<div class="sandbox-section-title">⚡ 快速预设</div>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
    '<button class="btn btn-sm" onclick="applySandboxPreset(\'balanced\')">⚖️ 均衡型</button> ' +
    '<button class="btn btn-sm" onclick="applySandboxPreset(\'strong\')">💪 体力型</button> ' +
    '<button class="btn btn-sm" onclick="applySandboxPreset(\'smart\')">🧠 智力型</button> ' +
    '<button class="btn btn-sm" onclick="applySandboxPreset(\'rich\')">💰 富裕型</button>' +
    "</div>" +
    "</div>" +
    // 摘要信息
    '<div class="sandbox-summary" id="sandbox-summary">' +
    "📋 " +
    cfg.name +
    "，" +
    cfg.age +
    "岁 · 现金¥" +
    cfg.cash.toLocaleString() +
    " · 属性" +
    totalStatPoints +
    "点 · 称号：" +
    title +
    "</div>";

  sbScreen.innerHTML = html;
}

/** 创建属性滑条 */
function createSandboxStatSlider(key, label, value, remaining) {
  var min = 10;
  var max = Math.min(50, min + 10 + Math.max(0, remaining));
  var color =
    value >= 35 ? "var(--success)" : value >= 20 ? "" : "var(--danger)";
  return (
    '<div class="sandbox-row">' +
    "<label>" +
    label +
    "</label>" +
    '<input type="range" min="' +
    min +
    '" max="' +
    max +
    '" value="' +
    value +
    '" oninput="updateSandboxConfig(\'' +
    key +
    "', parseInt(this.value))\">" +
    '<span class="sandbox-val" style="color:' +
    color +
    '" id="sandbox-stat-' +
    key +
    '-val">' +
    value +
    "</span>" +
    "</div>"
  );
}

/** 更新沙盒配置字段 */
function updateSandboxConfig(key, value) {
  if (!_sandboxConfig) return;
  _sandboxConfig[key] = value;
  renderSandboxConfig();
}

/** 应用沙盒预设 */
function applySandboxPreset(preset) {
  if (!_sandboxConfig)
    _sandboxConfig = JSON.parse(JSON.stringify(SANDBOX_DEFAULTS));
  switch (preset) {
    case "balanced":
      _sandboxConfig.physique = 22;
      _sandboxConfig.intelligence = 22;
      _sandboxConfig.agility = 22;
      _sandboxConfig.mental = 22;
      _sandboxConfig.cash = 5000;
      _sandboxConfig.villageDebt = 3000;
      _sandboxConfig.bankDebt = 0;
      break;
    case "strong":
      _sandboxConfig.physique = 40;
      _sandboxConfig.intelligence = 15;
      _sandboxConfig.agility = 25;
      _sandboxConfig.mental = 18;
      _sandboxConfig.cash = 3000;
      _sandboxConfig.villageDebt = 5000;
      _sandboxConfig.bankDebt = 0;
      break;
    case "smart":
      _sandboxConfig.physique = 12;
      _sandboxConfig.intelligence = 45;
      _sandboxConfig.agility = 15;
      _sandboxConfig.mental = 28;
      _sandboxConfig.cash = 4000;
      _sandboxConfig.villageDebt = 8000;
      _sandboxConfig.bankDebt = 5000;
      _sandboxConfig.education = 1;
      break;
    case "rich":
      _sandboxConfig.physique = 18;
      _sandboxConfig.intelligence = 22;
      _sandboxConfig.agility = 16;
      _sandboxConfig.mental = 20;
      _sandboxConfig.cash = 50000;
      _sandboxConfig.bankBalance = 80000;
      _sandboxConfig.villageDebt = 0;
      _sandboxConfig.bankDebt = 0;
      _sandboxConfig.housingTier = 2;
      break;
  }
  renderSandboxConfig();
}

/** 启动沙盒模式 */
function startSandboxGame() {
  if (!_sandboxConfig) {
    startNewGame();
    return;
  }
  var cfg = _sandboxConfig;

  // ——— 先展示"命运定锚"弹窗，让玩家选定挑战目标，再初始化游戏 ———
  var _sbDebt = (cfg.villageDebt || 0) + (cfg.fineDebt || 0) + (cfg.bankDebt || 0);
  var _sbAssets = (cfg.cash || 0) + (cfg.bankBalance || 0);
  var _sbIntroBody =
    "你在城市里找了一张椅子坐下，把自己的账列了出来：<br><br>" +
    "家底 <b>¥" +
    _sbAssets.toLocaleString() +
    "</b>" +
    (_sbDebt > 0
      ? "，背负 <b>¥" + _sbDebt.toLocaleString() + "</b> 的债"
      : "，零债出发") +
    "，今年 <b>" +
    (cfg.age || 20) +
    "</b> 岁。<br><br>" +
    "城市不知道你从哪儿来，也不在乎你的计划。<br><br>" +
    "这段人生，你想证明什么？";

  function _doStartSandbox(challengeLabel) {
    StateManager.newGame();
    initializePrices();

    var state = StateManager.getState();

    // --- 身份 ---
    state.player.name = cfg.name || "无名";
    state.player.gender = cfg.gender || "male";
    state.player.age = cfg.age || 20;
    state.player.fame = cfg.fame || 0;

    // --- 属性 ---
    state.player.physique = Math.max(10, Math.min(100, cfg.physique || 22));
    state.player.intelligence = Math.max(
      10,
      Math.min(100, cfg.intelligence || 22),
    );
    state.player.agility = Math.max(10, Math.min(100, cfg.agility || 22));
    state.player.mental = Math.max(10, Math.min(100, cfg.mental || 22));

    // --- 资源 ---
    state.resources.cash = cfg.cash || 5000;
    state.resources.bankBalance = cfg.bankBalance || 0;
    state.resources.villageDebt = cfg.villageDebt || 0;
    state.resources.bankDebt = cfg.bankDebt || 0;
    state.resources.debt = (cfg.villageDebt || 0) + (cfg.fineDebt || 0) + (cfg.bankDebt || 0);
    state.resources.loanPrincipal = cfg.villageDebt || 0;
    state.resources.loanDay = 0;

    // --- 学历 ---
    state.player.education = cfg.education || 0;
    state.education = cfg.education || 0;
    state.player.eduProgress =
      cfg.education >= 1
        ? { studyPoints: 0, examsPassed: 6, totalExams: 6 }
        : { studyPoints: 0, examsPassed: 0, totalExams: 6 };

    // --- 技能 ---
    var skillKeys = [
      "cooking",
      "repair",
      "coding",
      "english",
      "driving",
      "sales",
      "management",
      "accounting",
      "electrician",
      "welding",
    ];
    for (var i = 0; i < skillKeys.length; i++) {
      var sk = skillKeys[i];
      if (state.skills[sk]) {
        var lvl = Math.max(0, Math.min(100, cfg[sk] || 0));
        state.skills[sk].level = lvl;
        state.skills[sk].xp = 0;
      }
    }

    // --- 驾照 ---
    if (cfg.hasLicense) {
      if (!state.certificates.includes("driver_license")) {
        state.certificates.push("driver_license");
      }
      if (state.skills.driving && state.skills.driving.level < 10) {
        state.skills.driving.level = Math.min(100, state.skills.driving.level + 10);
      }
    }

    // --- 健康 ---
    state.status.health = cfg.health || 100;

    // --- 住所 ---
    state.housing.tier = Math.max(0, Math.min(3, cfg.housingTier || 0));
    state.housing.rentedDay = state.player.day;
    // [全系统自洽修复] 域G A类修复: housing.tier 上限扩容至 6（与 state.js:145 一致，tier≥4 时 capacity 不再为 undefined）
    state.inventory.capacity =
      [20, 50, 100, 200, 500, 1000, 2000][state.housing.tier] || 20;

    // --- 起始地点 ---
    if (cfg.startLocation) {
      state.trade.currentLocation = cfg.startLocation;
    }

    // --- 需求 ---
    state.needs.hunger = 70;
    state.needs.fatigue = 15;
    state.needs.hygiene = 75;
    state.needs.happiness = 55;

    // --- 沙盒标记 & 挑战 ---
    state.flags._isSandboxMode = true;
    if (challengeLabel) {
      state.flags._sandboxChallenge = challengeLabel;
    }

    // --- 企业命运 ---
    if (typeof initEnterpriseFate === "function") {
      initEnterpriseFate(state);
    }

    // --- 开场消息 ---
    if (challengeLabel) {
      StateManager.addMessage(
        "📐 你给自己定下了挑战：" + challengeLabel + "。从第1天开始。",
        "event",
      );
    } else {
      StateManager.addMessage(
        "⚙️ 沙盒模式开始" +
          (cfg.villageDebt > 0
            ? "，欠村长¥" +
              cfg.villageDebt.toLocaleString() +
              "，日息" +
              (cfg.difficulty === "casual"
                ? 0.2
                : cfg.difficulty === "hard"
                  ? 0.5
                  : cfg.difficulty === "nightmare"
                    ? 0.7
                    : 0.35
              ).toFixed(2) +
              "%。"
            : "，自由探索。"),
        "event",
      );
    }
    StateManager.addMessage(
      '💡 提示：点击"🗺️ 地图"标签可查看城市全景。',
      "info",
    );
    StateManager.addMessage(
      '🚶 点击行动页的"前往 XX"卡片或地图上的地点即可出行。',
      "info",
    );

    // === v3.0 P2-B-2 + P2-E-1：沙盒模式也接入难度 + 传承币 ===
    if (
      typeof applyDifficultyToState === "function" &&
      window._selectedDifficulty
    ) {
      applyDifficultyToState(state, window._selectedDifficulty);
    }
    if (typeof applyHeritageUnlocks === "function") {
      applyHeritageUnlocks(state);
    }

    // v3.2 修复: 记录第1天日初现金
    state.flags._dayStartCash = state.resources.cash || 0;

    document.getElementById("sandbox-screen").style.display = "none";
    document.getElementById("mode-select-screen").style.display = "none";
    document.getElementById("welcome-screen").style.display = "none";

    var _enterSandboxGame = function () {
      document.getElementById("app").style.display = "";
      gameStarted = true;
      renderAll();
      if (typeof initCashCarousel === "function") initCashCarousel();
      // ---- 绑定顶栏按钮 ----
      bindHeaderButtons();
      setTimeout(function () {
        if (typeof showForcedDreamModal === "function") {
          showForcedDreamModal();
        }
      }, 300);
    };

    if (typeof startWithWorldNewsIntro === "function") {
      startWithWorldNewsIntro(state, null, _enterSandboxGame);
    } else {
      _enterSandboxGame();
    }
  }

  showModal({
    title: "📐 你设计了自己的命运",
    body: _sbIntroBody,
    buttons: [
      {
        text: "💰 百日攒够¥50,000",
        cls: "",
        callback: function () {
          _doStartSandbox("100天内攒到¥50,000");
        },
      },
      {
        text: "📈 打工人逆袭开公司",
        cls: "",
        callback: function () {
          _doStartSandbox("从打工人到开公司当老板");
        },
      },
      {
        text: "🚀 自由探索，随心而走",
        cls: "btn-primary",
        callback: function () {
          _doStartSandbox(null);
        },
      },
    ],
  });
}

function startNewGame() {
  StateManager.newGame();
  initializePrices();

  // v3.99 初始化约定式条件系统（自动注册所有检查函数）
  if (typeof ConditionSystem !== "undefined" && ConditionSystem.init) {
    ConditionSystem.init();
  }

  // v3.2 修复: 记录第1天日初现金（后续日由 day_increment 管线步骤管理）
  StateManager.getState().flags._dayStartCash =
    StateManager.getState().resources.cash || 0;

  // 初始化企业命运系统

  // 初始化企业命运系统
  if (typeof initEnterpriseFate === "function") {
    initEnterpriseFate(StateManager.getState());
  }

  // 初始化天气系统（随机开局季节）
  if (typeof initWeather === "function") {
    initWeather(StateManager.getState());
  }

  // [全系统自洽修复] 域D 修复:接入initNpcRelationships(原定义但未调用,NPC初始好感基于体质/魅力)
  if (typeof initNpcRelationships === "function") {
    initNpcRelationships(StateManager.getState());
  }

  // 初始化装备耐久度
  if (typeof initEquipmentDurability === "function") {
    initEquipmentDurability(StateManager.getState());
  }

  // v3.1 第39轮：初始化街坊声望系统
  if (typeof initReputation === "function") {
    initReputation(StateManager.getState());
  }

  // v3.1 第41轮：初始化人生抉择系统
  if (typeof initLifeDecisions === "function") {
    initLifeDecisions(StateManager.getState());
  }

  // v3.99 (loop R3)：技能注册表补全 — 旧存档兼容
  ensureSkillRegistry(StateManager.getState());

  // v3.1: 初始化社交网络系统
  if (typeof ensureSocialNetworkState === "function") {
    ensureSocialNetworkState(StateManager.getState());
  }

  // 世界参数反馈环：开局种子（尝试拉取真实市场数据，失败则随机）
  if (typeof seedWorldFromReality === "function") {
    seedWorldFromReality(StateManager.getState());
  }

  // Phase 3: 多周目继承系统 — 检查并应用上局遗产
  var inheritanceApplied = false;
  try {
    // 读取上局遗产数据（从 localStorage 的 _lastGameInheritance 键）
    var inheritanceRaw = localStorage.getItem("_lastGameInheritance");
    if (inheritanceRaw) {
      var inheritanceData = JSON.parse(inheritanceRaw);
      var state = StateManager.getState();

      // 应用继承数据
      if (typeof applyInheritance === "function") {
        applyInheritance(state, inheritanceData.prevState, inheritanceData);
        inheritanceApplied = true;

        // 显示继承摘要弹窗
        if (typeof showInheritanceSummaryModal === "function") {
          setTimeout(function () {
            showInheritanceSummaryModal(inheritanceData);
          }, 500);
        }

        // 清除遗产数据（只继承一次）
        localStorage.removeItem("_lastGameInheritance");
      }
    }
  } catch (e) {
    console.error("继承系统错误:", e);
  }

  if (!inheritanceApplied) {
    StateManager.addMessage(
      "🏚️ 你揣着仅剩的¥300来到这座城市。没有退路，没有靠山。饥饱见底，健康亮红灯。3天内必须找到饭吃，否则这座城市会把你吞掉。",
      "event",
    );
  } else {
    StateManager.addMessage(
      "🔄 带着上局的遗产重新出发。城市依然在等你，但有些东西已经不一样了。",
      "event",
    );
  }
  StateManager.addMessage(
    '💡 提示：点击"🗺️ 地图"标签可查看城市全景。在城中村可以租房子、收废品。有了本钱可以去批发市场进货，再到商业区摆摊。',
    "info",
  );
  StateManager.addMessage(
    '🚶 点击行动页的"前往 XX"卡片或地图上的地点即可出行。左侧栏也有附近可前往的地点列表。',
    "info",
  );

  // === v3.57 经典模式天赋系统 ===
  var classicScenario = getScenarioById("classic");
  var _classicAfterTalent = function (acceptedTalents) {
    // 记录天赋
    var state = StateManager.getState();
    if (acceptedTalents && acceptedTalents.length > 0) {
      state.flags._talent = [];
      for (var _ti = 0; _ti < acceptedTalents.length; _ti++) {
        var _pt = acceptedTalents[_ti];
        if (typeof _pt.apply === "function") _pt.apply(state);
        state.flags._talent.push({
          id: _pt.id,
          name: _pt.name,
          icon: _pt.icon,
          desc: _pt.desc,
        });
      }
      var _talentNames = acceptedTalents
        .map(function (t) {
          return t.icon + " " + t.name;
        })
        .join("、");
      StateManager.addMessage("✨ 接受天赋：" + _talentNames, "event");
    } else {
      state.flags._talent = null;
      StateManager.addMessage("🎯 放弃天赋，靠自己打拼。", "event");
    }

    // === 难度系统 + 传承币解锁 ===
    if (
      typeof applyDifficultyToState === "function" &&
      window._selectedDifficulty
    ) {
      applyDifficultyToState(state, window._selectedDifficulty);
    }
    if (typeof applyHeritageUnlocks === "function") applyHeritageUnlocks(state);

    // 隐藏选择界面
    document.getElementById("mode-select-screen").style.display = "none";
    document.getElementById("scenario-select-screen").style.display = "none";
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("sandbox-screen").style.display = "none";

    var _enterClassicGame = function () {
      document.getElementById("app").style.display = "";
      gameStarted = true;
      renderAll();
      if (typeof initCashCarousel === "function") initCashCarousel();
      bindHeaderButtons();
      setTimeout(function () {
        if (typeof showForcedDreamModal === "function") showForcedDreamModal();
      }, 300);
    };

    if (typeof startWithWorldNewsIntro === "function") {
      startWithWorldNewsIntro(state, "classic", _enterClassicGame);
    } else {
      _enterClassicGame();
    }
    setTimeout(function () {
      var appEl = document.getElementById("app");
      if (appEl && appEl.style.display === "none") {
        console.warn("[DIAG] app 仍 display:none，强制显示");
        appEl.style.display = "";
        if (typeof renderAll === "function") renderAll();
      }
    }, 3000);
  };

  // 经典模式也有天赋池
  if (
    classicScenario &&
    classicScenario.talents &&
    classicScenario.talents.length > 0
  ) {
    var _rolled = rollTalents(classicScenario);
    showTalentRevealModal(
      _rolled,
      function (accepted) {
        _classicAfterTalent(accepted);
      },
      function () {
        _classicAfterTalent([]);
      },
    );
  } else {
    _classicAfterTalent([]);
  }
}

function loadExistingGame(slot) {
  try {
    console.log("[loadExistingGame] 尝试读档 slot=", slot, "type=", typeof slot);
    var saveData = loadGame(slot);
    console.log("[loadExistingGame] loadGame 结果:", saveData ? "找到存档" : "null");
    if (!saveData) {
      // 兜底：尝试用数字格式重新加载
      if (typeof slot === "string" && /^\d+$/.test(slot)) {
        saveData = loadGame(Number(slot));
        console.log("[loadExistingGame] 数字格式重试:", saveData ? "找到" : "仍null");
      }
    }
    if (!saveData && typeof slot === "number") {
      // 兜底：尝试用字符串格式重新加载
      saveData = loadGame(String(slot));
      console.log("[loadExistingGame] 字符串格式重试:", saveData ? "找到" : "仍null");
    }
    if (!saveData) {
      console.error("[loadExistingGame] 存档数据不存在, slot=", slot);
      if (typeof showModal === "function") {
        showModal({
          title: "⚠️ 读档失败",
          body: '<p style="color:var(--danger);">存档数据不存在，请检查或重新开始游戏。</p>',
          buttons: [{ text: "知道了", cls: "btn-primary" }],
        });
      }
      return;
    }
    StateManager.importState(saveData);
    // [全系统自洽修复] 域G R240 A类修复: 剧本标记传递（旧存档/早期存档可能缺失剧本flag，导致getNextGoals等场景分支静默失效）
    if (saveData.flags && saveData.flags._scenarioId) {
      var _st = StateManager.getState();
      if (!_st.flags._isScenarioMode) _st.flags._isScenarioMode = true;
      if (!_st.flags._scenarioId) _st.flags._scenarioId = saveData.flags._scenarioId;
      if (!_st.flags._currentScenario) _st.flags._currentScenario = saveData.flags._currentScenario || saveData.flags._scenarioId;
      if (!_st.flags._scenarioName) _st.flags._scenarioName = saveData.flags._scenarioName || "";
      if (!_st.flags._scenarioTags) _st.flags._scenarioTags = saveData.flags._scenarioTags || [];
    }
    // 显示读档回忆文案（P1 - 存档快照）— 必须在 importState 之后，否则 StateManager 未初始化
    if (saveData._snapshot && typeof getLoadMemoryText === "function") {
      var memoryText = getLoadMemoryText(saveData._snapshot);
      if (memoryText) {
        StateManager.addMessage("📖 读档记忆：" + memoryText, "event");
      }
    }
    // 兼容旧存档：初始化企业命运系统
    if (typeof initEnterpriseFate === "function") {
      initEnterpriseFate(StateManager.getState());
    }
    // 兼容旧存档：初始化装备耐久度
    if (typeof initEquipmentDurability === "function") {
      initEquipmentDurability(StateManager.getState());
    }
    // v3.54h：兼容旧存档：初始化社交网络状态
    if (typeof ensureSocialNetworkState === "function") {
      ensureSocialNetworkState(StateManager.getState());
    }
    // 兼容旧存档：初始化地点声望系统（避免读档后 st.reputation 为 undefined 导致声誉事件崩溃）
    if (typeof initReputation === "function") {
      initReputation(StateManager.getState());
    }
    // v3.99 (loop R3)：技能注册表补全（旧存档无 medicine/social）
    ensureSkillRegistry(StateManager.getState());
    StateManager.addMessage("📂 存档已加载，欢迎回来！", "info");
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("app").style.display = "";
    gameStarted = true;
    renderAll();
    if (typeof initCashCarousel === "function") initCashCarousel();
    // 绑定顶栏按钮（同 startNewGame）
    bindHeaderButtons();
  } catch (e) {
    console.error("[loadExistingGame] 异常:", e);
    if (typeof showModal === "function") {
      showModal({
        title: "⚠️ 读档异常",
        body: '<p style="color:var(--danger);">读档时发生错误：' + (e.message || "未知错误") + '</p>',
        buttons: [{ text: "知道了", cls: "btn-primary" }],
      });
    }
  }
}

/** 存档对比模式状态 */
var _compareMode = false;
var _compareSelected = [];

/** 切换存档对比模式 */
function toggleCompareMode() {
  _compareMode = !_compareMode;
  _compareSelected = [];
  showLoadMenuOnWelcome();
}

/** 选择存档进行对比 */
function selectForCompare(slot) {
  if (_compareSelected.includes(slot)) {
    _compareSelected = _compareSelected.filter(function (s) {
      return s !== slot;
    });
  } else {
    if (_compareSelected.length < 2) {
      _compareSelected.push(slot);
    }
  }
  if (_compareSelected.length === 2) {
    showCompareResult();
  } else {
    showLoadMenuOnWelcome();
  }
}

/** 显示存档对比结果 */
function showCompareResult() {
  var saves = [];
  for (var i = 0; i < _compareSelected.length; i++) {
    var data = loadGame(_compareSelected[i]);
    if (data) saves.push(data);
  }

  if (saves.length < 2) return;

  var s1 = saves[0];
  var s2 = saves[1];

  function diffVal(label, v1, v2, fmt) {
    if (v1 === v2) {
      return (
        '<div class="compare-row"><span class="compare-label">' +
        label +
        '</span><span class="compare-same">' +
        (fmt ? fmt(v1) : v1) +
        "</span></div>"
      );
    }
    var cls = v2 > v1 ? "compare-gain" : "compare-loss";
    var arrow = v2 > v1 ? "↑" : "↓";
    var diff = v2 - v1;
    return (
      '<div class="compare-row"><span class="compare-label">' +
      label +
      '</span><span class="compare-val old">' +
      (fmt ? fmt(v1) : v1) +
      '</span><span class="compare-arrow">' +
      arrow +
      '</span><span class="compare-val new ' +
      cls +
      '">' +
      (fmt ? fmt(v2) : v2) +
      '</span><span class="compare-diff ' +
      cls +
      '">(' +
      (diff > 0 ? "+" : "") +
      diff +
      ")</span></div>"
    );
  }

  function diffPct(label, v1, v2) {
    if (v1 === v2) {
      return (
        '<div class="compare-row"><span class="compare-label">' +
        label +
        '</span><span class="compare-same">' +
        v1 +
        "%</span></div>"
      );
    }
    var cls = v2 > v1 ? "compare-gain" : "compare-loss";
    var arrow = v2 > v1 ? "↑" : "↓";
    return (
      '<div class="compare-row"><span class="compare-label">' +
      label +
      '</span><span class="compare-val old">' +
      v1 +
      '%</span><span class="compare-arrow">' +
      arrow +
      '</span><span class="compare-val new ' +
      cls +
      '">' +
      v2 +
      "%</span></div>"
    );
  }

  var bodyHtml =
    '<div class="compare-container">' +
    '<div class="compare-header">' +
    '<div class="compare-col"><strong>存档1</strong><br><small>' +
    _compareSelected[0] +
    "</small></div>" +
    '<div class="compare-col"><strong>存档2</strong><br><small>' +
    _compareSelected[1] +
    "</small></div>" +
    "</div>";

  // 基本信息对比
  bodyHtml +=
    '<h4 style="margin:16px 0 8px;color:var(--text-muted);">📋 基本信息</h4>' +
    diffVal("天数", s1.player.day, s2.player.day, function (v) {
      return "第" + v + "天";
    }) +
    diffVal("年龄", s1.player.age, s2.player.age, function (v) {
      return v + "岁";
    }) +
    diffVal(
      "现金",
      s1.resources.cash || 0,
      s2.resources.cash || 0,
      function (v) {
        return "¥" + v.toLocaleString();
      },
    ) +
    diffVal(
      "银行存款",
      s1.resources.bankBalance || 0,
      s2.resources.bankBalance || 0,
      function (v) {
        return "¥" + v.toLocaleString();
      },
    ) +
    diffVal(
      "总债务",
      (s1.resources.villageDebt || 0) + (s1.resources.fineDebt || 0) + (s1.resources.bankDebt || 0),
      (s2.resources.villageDebt || 0) + (s2.resources.fineDebt || 0) + (s2.resources.bankDebt || 0),
      function (v) {
        return "¥" + v.toLocaleString();
      },
    ) +
    diffVal(
      "总收入",
      s1.resources.totalEarned || 0,
      s2.resources.totalEarned || 0,
      function (v) {
        return "¥" + v.toLocaleString();
      },
    );

  // 阶段对比
  bodyHtml +=
    '<h4 style="margin:16px 0 8px;color:var(--text-muted);">📍 当前阶段</h4>';
  var phase1 = s1.player.phase === "corporate" ? "🏢 职场" : "🏘️ 街头";
  var phase2 = s2.player.phase === "corporate" ? "🏢 职场" : "🏘️ 街头";
  if (phase1 === phase2) {
    bodyHtml +=
      '<div class="compare-row"><span class="compare-label">阶段</span><span class="compare-same">' +
      phase1 +
      "</span></div>";
  } else {
    bodyHtml +=
      '<div class="compare-row"><span class="compare-label">阶段</span><span class="compare-val old">' +
      phase1 +
      '</span><span class="compare-arrow">→</span><span class="compare-val new ' +
      (s2.player.phase === "corporate" ? "compare-gain" : "") +
      '">' +
      phase2 +
      "</span></div>";
  }

  // 职场信息对比（如果都是职场阶段）
  if (s1.player.phase === "corporate" && s2.player.phase === "corporate") {
    bodyHtml +=
      '<h4 style="margin:16px 0 8px;color:var(--text-muted);">🏢 职场状态</h4>' +
      diffVal("职级", s1.corporate?.rank || "P5", s2.corporate?.rank || "P5") +
      // [全系统自洽修复] 域G A类修复: kpi/ability/dignity/popularity/upwardMgmt/risk/hair 在 state.player.corporate 而非 state.corporate（state.corporate 存的是 company/rank/department 等企业信息），导致所有职场属性对比值恒为0
      diffVal("KPI", s1.player.corporate?.kpi || 0, s2.player.corporate?.kpi || 0) +
      diffVal("能力", s1.player.corporate?.ability || 0, s2.player.corporate?.ability || 0) +
      diffVal("尊严", s1.player.corporate?.dignity || 0, s2.player.corporate?.dignity || 0) +
      diffVal(
        "人缘",
        s1.player.corporate?.popularity || 0,
        s2.player.corporate?.popularity || 0,
      ) +
      diffVal(
        "向上管理",
        s1.player.corporate?.upwardMgmt || 0,
        s2.player.corporate?.upwardMgmt || 0,
      ) +
      diffVal("风险", s1.player.corporate?.risk || 0, s2.player.corporate?.risk || 0) +
      diffVal("发量", s1.player.corporate?.hair || 100, s2.player.corporate?.hair || 100);
  }

  // 属性对比
  bodyHtml +=
    '<h4 style="margin:16px 0 8px;color:var(--text-muted);">💪 属性</h4>' +
    diffVal("体质", s1.player.physique || 0, s2.player.physique || 0) +
    diffVal("智力", s1.player.intelligence || 0, s2.player.intelligence || 0) +
    diffVal("敏捷", s1.player.agility || 0, s2.player.agility || 0) +
    diffVal("能力", s1.player.mental || 0, s2.player.mental || 0) +
    diffVal("名气", s1.player.fame || 0, s2.player.fame || 0);

  // 需求状态对比
  bodyHtml +=
    '<h4 style="margin:16px 0 8px;color:var(--text-muted);">📊 状态</h4>' +
    diffPct("饥饱", s1.needs?.hunger || 0, s2.needs?.hunger || 0) +
    diffPct("疲劳", s1.needs?.fatigue || 0, s2.needs?.fatigue || 0) +
    diffPct("卫生", s1.needs?.hygiene || 0, s2.needs?.hygiene || 0) +
    diffPct("心情", s1.needs?.happiness || 0, s2.needs?.happiness || 0) +
    diffPct("健康", s1.status?.health || 100, s2.status?.health || 100);

  bodyHtml += "</div>";

  var buttons = [
    { text: "关闭", cls: "", callback: function () {} },
    {
      text: "加载存档1",
      cls: "btn-primary",
      callback: function () {
        loadExistingGame(_compareSelected[0]);
      },
    },
    {
      text: "加载存档2",
      cls: "btn-primary",
      callback: function () {
        loadExistingGame(_compareSelected[1]);
      },
    },
  ];

  showModal({
    title: "📊 存档对比",
    body: bodyHtml,
    buttons: buttons,
  });
}

/** 欢迎界面上显示存档选择 */
function showLoadMenuOnWelcome() {
  var allSlots = getAllSlotsWithEmpty();
  var bodyHtml = "";

  // 对比模式头部
  if (_compareMode) {
    bodyHtml +=
      '<div style="padding:10px;margin-bottom:12px;background:rgba(102,126,234,0.1);border:1px solid rgba(102,126,234,0.3);border-radius:6px;text-align:center;">' +
      '<div style="font-size:13px;color:var(--accent);margin-bottom:8px;">📊 对比模式：选择两个存档</div>' +
      '<div style="font-size:11px;color:var(--text-muted);">已选：<strong style="color:var(--accent)">' +
      _compareSelected.length +
      "/2</strong></div>" +
      "</div>";
  }

  bodyHtml += '<div style="max-height:400px;overflow-y:auto;">';
  for (var i = 0; i < allSlots.length; i++) {
    var s = allSlots[i];
    if (s.empty) {
      bodyHtml +=
        '<div style="padding:8px;margin:4px 0;background:var(--bg-card);border-radius:4px;opacity:0.4;font-size:12px;color:var(--text-muted);">' +
        s.label +
        " — 空</div>";
    } else {
      var phaseLabel = s.phase === "corporate" ? "🏢" : "🏘️";
      var isSelected = _compareSelected.includes(s.slot);
      var borderStyle = isSelected
        ? "border:2px solid var(--accent);"
        : "border:1px solid var(--border);";

      bodyHtml +=
        '<div class="welcome-slot-card" data-slot="' + s.slot + '" data-compare="' + (_compareMode ? "1" : "0") + '" style="padding:10px;margin:4px 0;background:var(--bg-card);border-radius:4px;cursor:pointer;transition:all 0.2s;' +
        borderStyle +
        '">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
        "<strong>" +
        s.label +
        (isSelected ? " ✅" : "") +
        "</strong>" +
        '<span style="font-size:11px;color:var(--text-muted)">' +
        s.date +
        "</span>" +
        "</div>" +
        '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">' +
        phaseLabel +
        " 第" +
        s.day +
        "天 | 年龄" +
        s.age +
        " | 💰 ¥" +
        (s.cash?.toLocaleString() || 0) +
        (s.rank ? " | 🏢 " + s.rank : "") +
        (s.debt > 0 ? " | ⚠️ 欠款 ¥" + s.debt.toLocaleString() : "") +
        "</div>" +
        "</div>";
    }
  }
  bodyHtml += "</div>";

  var buttons = [
    {
      text: "取消",
      cls: "",
      callback: function () {
        _compareMode = false;
        _compareSelected = [];
      },
    },
  ];
  if (_compareMode) {
    buttons.push({
      text: "完成对比",
      cls: "btn-primary",
      callback: function () {
        if (_compareSelected.length === 2) {
          showCompareResult();
        }
      },
    });
  } else {
    buttons.push({
      text: "📊 对比模式",
      cls: "",
      callback: toggleCompareMode,
    });
  }

  showModal({
    title: "📂 读取存档",
    body: bodyHtml,
    buttons: buttons,
  });

  // 绑定存档槽位点击（替代不稳定的 inline onclick）
  setTimeout(function () {
    var cards = document.querySelectorAll(".welcome-slot-card");
    console.log("[welcome-slot] 找到卡片数:", cards.length);
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var slot = card.dataset.slot;
        console.log("[welcome-slot] 点击 slot=", slot);
        var isCompare = card.dataset.compare === "1";
        if (isCompare) {
          selectForCompare(slot);
        } else {
          var overlay = document.querySelector(".modal-overlay");
          if (overlay) {
            if (overlay._escHandler) document.removeEventListener("keydown", overlay._escHandler);
            if (overlay._clickHandler) overlay.removeEventListener("click", overlay._clickHandler);
            overlay.parentNode?.removeChild(overlay);
          }
          loadExistingGame(slot);
        }
      });
    });
  }, 50);
}

/** 初始化各地商品价格 */
function initializePrices() {
  const state = StateManager.getState();
  for (const locKey of Object.keys(LOCATIONS)) {
    state.trade.goodsPrices[locKey] = {};
    const loc = LOCATIONS[locKey];
    for (const good of GOODS) {
      let price = good.basePrice;
      if (loc.priceMod && loc.priceMod[good.id]) {
        price *= loc.priceMod[good.id];
      }
      // 随机波动 ±6%（现实级初始差价）
      price *= Random.float(0.94, 1.06);
      price = Math.round(price * 100) / 100;
      state.trade.goodsPrices[locKey][good.id] = price;
    }
  }
  state.trade.lastPriceUpdate = state.player.day;
}

// ====== 为交易 action card 生成价格预览文本 ======
/**
 * 根据销售技能和位置信息，为交易卡片生成一行价格预览
 * @param {object} state - 游戏状态
 * @param {string} locKey - 地点 ID
 * @param {boolean} isWholesale - 是否为批发市场
 * @returns {string} 预览文本（可能为空字符串）
 */
function buildTradePricePreview(state, locKey, isWholesale) {
  if (!state.trade.goodsPrices[locKey]) return "";
  var goodsList =
    typeof getAvailableGoodsAtLocation === "function"
      ? getAvailableGoodsAtLocation(locKey, state)
      : typeof GOODS !== "undefined"
        ? GOODS
        : [];
  if (!goodsList || goodsList.length === 0) return "";

  // 实际有价格的商品数量
  var priceKeys = Object.keys(state.trade.goodsPrices[locKey]).filter(
    function (k) {
      return typeof state.trade.goodsPrices[locKey][k] === "number";
    },
  );
  var count = priceKeys.length;
  if (count === 0) return "";

  var parts = [];
  parts.push("📊 " + count + "种商品");

  // 批发市场固定折扣
  if (isWholesale) {
    parts.push("🚚 批发价");
  }

  // 销售技能 >= 20：显示红绿对比
  if (typeof canSeePriceMarkers === "function" && canSeePriceMarkers(state)) {
    var visited = state.trade.visitedToday || {};
    var lowCount = 0,
      highCount = 0;

    for (var _ii = 0; _ii < goodsList.length; _ii++) {
      var g = goodsList[_ii];
      if (!g) continue;
      var p = state.trade.goodsPrices[locKey][g.id];
      if (!p || typeof p !== "number") continue;

      // 收集已访问区域中该商品的价格
      var comparePrices = [];
      for (var _v in visited) {
        if (!visited.hasOwnProperty(_v)) continue;
        if (_v === locKey) continue;
        var snap = visited[_v].prices;
        if (snap && typeof snap[g.id] === "number") {
          comparePrices.push(snap[g.id]);
        }
      }
      if (comparePrices.length === 0) continue;

      var avg =
        comparePrices.reduce(function (a, b) {
          return a + b;
        }, 0) / comparePrices.length;
      if (p < avg * 0.98) lowCount++;
      else if (p > avg * 1.02) highCount++;
    }

    if (lowCount > 0) parts.push("🟢" + lowCount + "个好价");
    if (highCount > 0) parts.push("🔴" + highCount + "个高价");

    // 销售技能 >= 40：显示一个极端例子
    if (
      typeof canSeeVisitedExtremes === "function" &&
      canSeeVisitedExtremes(state)
    ) {
      for (var _ij = 0; _ij < goodsList.length; _ij++) {
        var g2 = goodsList[_ij];
        if (!g2) continue;
        var p2 = state.trade.goodsPrices[locKey][g2.id];
        if (!p2 || typeof p2 !== "number") continue;
        if (typeof getVisitedExtreme !== "function") break;
        var ext = getVisitedExtreme(state, locKey, g2.id);
        if (ext.isVisitedLowest) {
          parts.push("⬇️" + g2.name + "¥" + p2);
          break;
        }
      }
    }

    // 销售技能 >= 60：全城极端
    if (
      typeof canSeeCityExtremes === "function" &&
      canSeeCityExtremes(state) &&
      typeof getCityExtreme === "function"
    ) {
      for (var _ik = 0; _ik < goodsList.length; _ik++) {
        var g3 = goodsList[_ik];
        if (!g3) continue;
        var p3 = state.trade.goodsPrices[locKey][g3.id];
        if (!p3 || typeof p3 !== "number") continue;
        var cityExt = getCityExtreme(state, locKey, g3.id);
        if (cityExt.isCityLowest) {
          parts.push("🏆" + g3.name + "全城最低");
          break;
        }
      }
    }
  }

  return parts.join(" · ");
}

// ====== 可用行动列表 ======
function getAvailableActions(state) {
  const actions = [];
  // 防御 state.trade/state.player 未初始化
  if (!state || !state.trade || !state.trade.currentLocation || !state.player) return actions;

  // 提升为函数级变量（用 let，块内可重新指向用 const）
  const locKey = state.trade.currentLocation;

  if (state.player.phase === "street") {
    // --- 街头阶段行动 ---

    // 1. 工作
    const jobIds = getJobsAtLocation(locKey);
    for (const jobId of jobIds) {
      const job = getJobById(jobId);
      if (!job) continue;
      const reqFail = checkJobRequirements(job, state);
      var payDetail = null;
      var payEstimate = null;
      if (!reqFail && typeof estimateJobPayDetailed === "function") {
        payDetail = estimateJobPayDetailed(job, state);
        payEstimate = payDetail.estimated;
      } else if (!reqFail) {
        payEstimate = estimateJobPay(job, state);
      }

      // 摆摊类工作添加客流量提示
      const isVending = [
        "street_vending_food",
        "street_vending_goods",
        "food_stall",
      ].includes(jobId);
      let footfallLabel = "";
      if (
        isVending &&
        typeof getVendingFootfallMod === "function" &&
        typeof getFootfallStars === "function"
      ) {
        const mod = getVendingFootfallMod(locKey, state);
        footfallLabel = " | " + getFootfallStars(mod);
      }

      actions.push({
        id: "job_" + jobId,
        category: "work",
        name: job.name,
        desc: job.desc + footfallLabel,
        icon: job.icon,
        apCost: 33,
        payEstimate:
          payDetail && payDetail.min != null
            ? `${payDetail.min}~${payDetail.max}`
            : payEstimate
              ? `${payEstimate - (job.startupCost || 0)}~${payEstimate + Math.floor(payEstimate * 0.3)}`
              : null,
        payTags:
          payDetail && payDetail.tags && payDetail.tags.length > 0
            ? payDetail.tags
            : null,
        costEstimate: job.startupCost || null,
        reqFail,
        disabled:
          !!reqFail ||
          (job.startupCost && (state.resources.cash || 0) < job.startupCost
            ? `启动资金不足(需¥${job.startupCost})`
            : null) ||
          ((state.player.actionPoints || 0) < 33
            ? `行动力不足(需33点,当前${state.player.actionPoints || 0}点)`
            : null) ||
          null,
        handler: () => {
          const finalReq = checkJobRequirements(job, state);
          if (finalReq) {
            StateManager.addMessage(`⚠️ ${finalReq}`, "warning");
            return;
          }
          if (job.startupCost && (state.resources.cash || 0) < job.startupCost) {
            StateManager.addMessage(
              `⚠️ 启动资金不足，需要 ¥${job.startupCost}`,
              "warning",
            );
            return;
          }
          if ((state.player.actionPoints || 0) < 33) {
            StateManager.addMessage(
              `⚠️ 行动力不足，需要33点，当前仅${state.player.actionPoints || 0}点。`,
              "warning",
            );
            return;
          }
          doStreetJob(job);
        },
      });
    }

    // 如果没有可用工作
    if (jobIds.length === 0) {
      actions.push({
        id: "no_jobs",
        category: "other",
        name: "当前地点没有工作机会",
        desc: "尝试旅行到其他地点寻找工作。",
        icon: "🚫",
        disabled: true,
      });
    }

    // 批发市场 — 批发进货
    if (locKey === "wholesaleMarket") {
      actions.push({
        id: "wholesale_header",
        category: "work",
        name: "批发进货",
        desc: "在批发市场以折扣价批量购入商品，转手到商业区卖出赚差价！点击后自动切换到交易Tab进行采购。",
        icon: "📦",
        pricePreview: buildTradePricePreview(state, locKey, true),
        handler: () => {
          state._citySubTab = "city_trade";
          switchTab("city");
        },
      });
    }

    // 零售买卖 — 在任何有价格数据的地点都可以买卖
    if (
      state.trade.goodsPrices[locKey] &&
      Object.keys(state.trade.goodsPrices[locKey]).length > 0
    ) {
      actions.push({
        id: "trade_header",
        category: "work",
        name: "买卖商品",
        desc: "查看当前市场价格，低买高卖赚取差价。点击后自动切换到城市Tab查看行情。",
        icon: "🛒",
        pricePreview: buildTradePricePreview(state, locKey, false),
        handler: () => {
          state._citySubTab = "city_trade";
          switchTab("city");
        },
      });
    }

    // === 住所系统（地点感知：不同地点可升级不同档位） ===
    var currentTier = state.housing ? state.housing.tier || 0 : 0;
    var curHouse = HOUSING_TIERS[currentTier];
    // 显示当前住所（所有地点都显示）
    actions.push({
      id: "housing_current",
      category: "survival",
      name: "当前住所：" + curHouse.name,
      desc:
        "容量+" +
        curHouse.capacity +
        " | 睡眠恢复疲劳-" +
        curHouse.fatigueRecovery +
        " | " +
        curHouse.desc +
        (curHouse.rent > 0 ? " | 日租¥" + curHouse.rent + "/天" : ""),
      icon: curHouse.icon,
      disabled: true,
    });
    // 获取当前地点可升级的住所
    var availableTiers =
      typeof getAvailableHousingTiersAtLocation === "function"
        ? getAvailableHousingTiersAtLocation(locKey)
        : [1, 2, 3];
    for (var i = 0; i < availableTiers.length; i++) {
      var t = availableTiers[i];
      if (t <= currentTier) continue;
      var house = HOUSING_TIERS[t];
      if (!house) continue;
      var canAfford = (state.resources.cash || 0) >= house.cost;
      actions.push({
        id: "housing_upgrade_" + t,
        category: "survival",
        name: "升级到" + house.name,
        desc:
          house.desc +
          " 一次性付¥" +
          house.cost +
          " + 日租¥" +
          house.rent +
          "/天",
        icon: house.icon,
        costEstimate: house.cost,
        disabled: !canAfford,
        reqFail: !canAfford ? "需 ¥" + house.cost : null,
        handler: (function (tier, h) {
          return function () {
            state.resources.cash = Math.max(0, (state.resources.cash || 0) - h.cost);
            state.housing.tier = tier;
            state.housing.rentedDay = state.player.day;
            state.inventory.capacity =
              h.capacity + (state.housing.storageCapacity || 0);
            StateManager.addMessage(
              "🏠 搬进了" +
                h.name +
                "！容量提升至" +
                state.inventory.capacity +
                "。",
              "success",
            );
            // 里程碑：搬家/升级住所
            if (typeof autoSave === "function") autoSave("milestone");
          };
        })(t, house),
      });
    }

    // === 仓库租赁（批发市场）===
    if (locKey === "wholesaleMarket") {
      const hasStorage = state.housing?.storageRented;
      const STORAGE_OPTIONS = [
        {
          id: "small",
          name: "小仓库",
          cost: 500,
          rent: 20,
          capacity: 150,
          icon: "📦",
        },
        {
          id: "big",
          name: "大仓库",
          cost: 1500,
          rent: 50,
          capacity: 500,
          icon: "🏗️",
        },
      ];

      if (hasStorage) {
        actions.push({
          id: "storage_current",
          category: "survival",
          name: `已租仓库 (额外+${state.housing.storageCapacity || 0}容量)`,
          desc: `日租¥${STORAGE_OPTIONS.find((s) => s.capacity === state.housing.storageCapacity)?.rent || "?"}/天`,
          icon: "📦",
          disabled: true,
        });
      } else {
        for (const opt of STORAGE_OPTIONS) {
          const canAfford = (state.resources.cash || 0) >= opt.cost;
          actions.push({
            id: "storage_rent_" + opt.id,
            category: "survival",
            name: `租用${opt.name}`,
            desc: `额外+${opt.capacity}商品存储容量。一次性¥${opt.cost} + 日租¥${opt.rent}/天`,
            icon: opt.icon,
            costEstimate: opt.cost,
            disabled: !canAfford,
            reqFail: !canAfford ? `需 ¥${opt.cost}` : null,
            handler: () => {
              state.resources.cash = Math.max(0, (state.resources.cash || 0) - opt.cost);
              state.housing.storageRented = true;
              state.housing.storageCapacity = opt.capacity;
              // [全系统自洽修复] 域G A类修复: housing.tier 上限扩容至 6
              const baseCap =
                [20, 50, 100, 200, 500, 1000, 2000][state.housing.tier] || 20;
              state.inventory.capacity = baseCap + opt.capacity;
              StateManager.addMessage(
                `📦 租下了${opt.name}！总容量提升至${state.inventory.capacity}。`,
                "success",
              );
            },
          });
        }
      }
    }

    // === 背包升级（商业区）===
    if (locKey === "commercialDist") {
      const BACKPACKS = [
        {
          id: "backpack_basic",
          name: "帆布背包",
          cost: 50,
          capacity: 5,
          icon: "🎒",
        },
        {
          id: "backpack_large",
          name: "大号旅行包",
          cost: 150,
          capacity: 15,
          icon: "🎒",
        },
        {
          id: "backpack_pro",
          name: "专业登山包",
          cost: 400,
          capacity: 30,
          icon: "🎒",
        },
      ];
      // 只显示未购买的
      const ownedPacks = (
        (state.inventory && state.inventory.items) ||
        []
      ).filter((i) => i.id.startsWith("backpack_"));
      for (const pack of BACKPACKS) {
        if (ownedPacks.find((p) => p.id === pack.id)) continue;
        const canAfford = (state.resources.cash || 0) >= pack.cost;
        actions.push({
          id: "buy_" + pack.id,
          category: "shopping",
          name: `购买${pack.name}`,
          desc: `随身容量+${pack.capacity}。一次性购买，永久拥有。`,
          icon: pack.icon,
          costEstimate: pack.cost,
          disabled: !canAfford,
          handler: () => {
            state.resources.cash = Math.max(0, (state.resources.cash || 0) - pack.cost);
            state.inventory.items.push({ id: pack.id, qty: 1 });
            state.inventory.capacity += pack.capacity;
            StateManager.addMessage(
              `🎒 购买了${pack.name}，随身容量+${pack.capacity}！`,
              "success",
            );
          },
        });
      }
    }

    // === 装备商店（有装备可买的地点显示入口）===
    {
      const shopItems = (typeof ITEMS !== "undefined" ? ITEMS : []).filter(
        function (item) {
          return item.buyLocations && item.buyLocations.indexOf(locKey) !== -1;
        },
      );
      if (shopItems.length > 0) {
        const shopNames = {
          slum: "城中村小摊",
          wholesaleMarket: "批发市场装备区",
          construction: "工地劳保店",
          school: "大学城书店",
          commercialDist: "商业区装备店",
          techPark: "科技园数码店",
        };
        actions.push({
          id: "item_shop_" + locKey,
          category: "shopping",
          name: shopNames[locKey] || "装备商店",
          desc: "共" + shopItems.length + "件装备可选，含服装/工具/道具",
          icon: "🛍️",
          costEstimate: 0,
          handler: function () {
            if (typeof showItemShopModal === "function")
              showItemShopModal(locKey);
          },
        });
      }
    }

    // === 学历系统（大学城）===
    if (locKey === "school") {
      const edu = state.player.education ?? state.education ?? 0;
      const ep = state.player.eduProgress ||
        state.eduProgress || {
          studyPoints: 0,
          examsPassed: 0,
          totalExams: 6,
        };
      state.player.education = edu;
      state.player.eduProgress = ep;
      if (edu < 1) {
        // 备考行动
        const studyReady = ep.examsPassed < ep.totalExams;
        if (studyReady) {
          actions.push({
            id: "edu_study",
            category: "education",
            name: "自考备考",
            desc: `消耗20AP，+5学习点（当前${ep.studyPoints}点，本门需150点）。有10%概率智力+1。`,
            icon: "📖",
            apCost: 20,
            handler: () => {
              if (!state.player.eduProgress)
                state.player.eduProgress = {
                  studyPoints: 0,
                  examsPassed: 0,
                  totalExams: 6,
                };
              // 小美在场加成：学习点额外+2
              var studyAdd = 5;
              if (typeof NPCS !== "undefined" && state.relationships) {
                var xiaoMei = NPCS.find(function (n) {
                  return n.id === "xiao_mei";
                });
                if (xiaoMei && xiaoMei.studyPresenceBonus) {
                  var xmRel = state.relationships.xiao_mei;
                  var xmAff = xmRel ? xmRel.affinity || 0 : 0;
                  if (xmAff >= xiaoMei.studyPresenceBonus.minAffinity) {
                    studyAdd += xiaoMei.studyPresenceBonus.studyPointBonus;
                  }
                }
              }
              state.player.eduProgress.studyPoints =
                (state.player.eduProgress.studyPoints || 0) + studyAdd;
              consumeAP(20);
              if (Random.chance(0.1)) {
                state.player.intelligence = Math.min(
                  100,
                  (state.player.intelligence || 0) + 1,
                );
                StateManager.addMessage("📚 备考中顿悟！智力+1。", "success");
              } else {
                StateManager.addMessage(
                  `📖 备考中…学习点+${studyAdd}（${state.player.eduProgress.studyPoints}/150）`,
                  "info",
                );
              }
            },
          });
        }
        // 参加考试
        const canExam =
          (ep.studyPoints || 0) >= 150 && ep.examsPassed < ep.totalExams;
        const examPassRate = Math.min(
          85,
          40 +
            (state.player.mental || 0) * 0.4 +
            (state.player.intelligence || 0) * 0.1,
        );
        actions.push({
          id: "edu_exam",
          category: "education",
          name: "参加考试",
          desc: `消耗30AP，需学习点≥150（当前${ep.studyPoints}）。通过率${examPassRate.toFixed(0)}%（第${ep.examsPassed + 1}/6门）。`,
          icon: "📝",
          apCost: 30,
          reqFail: !canExam
            ? ep.studyPoints < 150
              ? `学习点不足（${ep.studyPoints}/150）`
              : "全部考试已通过"
            : null,
          handler: () => {
            if (!state.player.eduProgress)
              state.player.eduProgress = {
                studyPoints: 0,
                examsPassed: 0,
                totalExams: 6,
              };
            consumeAP(30);
            const rate = Math.min(
              85,
              40 +
                (state.player.mental || 0) * 0.4 +
                (state.player.intelligence || 0) * 0.1,
            );
            if (Random.chance(rate / 100)) {
              state.player.eduProgress.examsPassed =
                (state.player.eduProgress.examsPassed || 0) + 1;
              state.player.eduProgress.studyPoints = 0;
              StateManager.addMessage(
                `🎉 第${state.player.eduProgress.examsPassed}门科目通过！还差${6 - state.player.eduProgress.examsPassed}门。`,
                "success",
              );
            } else {
              StateManager.addMessage(
                "😞 考试未通过，继续备考再战！",
                "danger",
              );
            }
          },
        });
        // 申请学历认证
        if (ep.examsPassed >= ep.totalExams) {
          actions.push({
            id: "edu_cert",
            category: "education",
            name: "申请本科学历认证",
            desc: "6门科目全部通过！提交认证，获得本科学历，解锁更多工作机会。",
            apCost: 0,
            handler: () => {
              state.player.education = 1;
              state.education = 1;
              StateManager.addMessage(
                "🎓 恭喜！你已取得本科学历，人生新起点！",
                "success",
              );
              renderAll();
            },
          });
        }
      } else if (edu === 1) {
        // 研究生路径（edu=1→2，需day≥180+智力≥30）
        if (state.player.day >= 180 && (state.player.intelligence || 0) >= 30) {
          var gradEp = ep;
          var gradStudyReady = gradEp.examsPassed < gradEp.totalExams;
          if (gradStudyReady) {
            actions.push({
              id: "edu_grad_study",
              category: "education",
              name: "📚 研究生备考",
              desc:
                "消耗25AP，+6学习点（当前" +
                gradEp.studyPoints +
                "点，本门需200点）。需智力≥30。",
              apCost: 25,
              handler: function () {
                if (!state.player.eduProgress)
                  state.player.eduProgress = {
                    studyPoints: 0,
                    examsPassed: 0,
                    totalExams: 6,
                  };
                state.player.eduProgress.studyPoints =
                  (state.player.eduProgress.studyPoints || 0) + 6;
                consumeAP(25);
                if (Random.chance(0.08)) {
                  state.player.intelligence = Math.min(
                    100,
                    (state.player.intelligence || 0) + 1,
                  );
                  StateManager.addMessage(
                    "📚 研究生备考中的顿悟！智力+1。",
                    "success",
                  );
                } else {
                  StateManager.addMessage(
                    "📖 研究生备考中…学习点+6（" +
                      state.player.eduProgress.studyPoints +
                      "/200）",
                    "info",
                  );
                }
              },
            });
          }
          var gradCanExam =
            (gradEp.studyPoints || 0) >= 200 &&
            gradEp.examsPassed < gradEp.totalExams;
          var gradPassRate = Math.min(
            70,
            30 +
              (state.player.mental || 0) * 0.3 +
              (state.player.intelligence || 0) * 0.15,
          );
          actions.push({
            id: "edu_grad_exam",
            category: "education",
            name: "参加研究生考试",
            desc:
              "消耗30AP，需学习点≥200（当前" +
              (gradEp.studyPoints || 0) +
              "）。通过率" +
              gradPassRate.toFixed(0) +
              "%（第" +
              (gradEp.examsPassed + 1) +
              "/6门）。",
            apCost: 30,
            reqFail: !gradCanExam
              ? gradEp.studyPoints < 200
                ? "学习点不足（" + (gradEp.studyPoints || 0) + "/200）"
                : "全部考试已通过"
              : null,
            handler: function () {
              if (!state.player.eduProgress)
                state.player.eduProgress = {
                  studyPoints: 0,
                  examsPassed: 0,
                  totalExams: 6,
                };
              consumeAP(30);
              if (Random.chance(gradPassRate / 100)) {
                state.player.eduProgress.examsPassed =
                  (state.player.eduProgress.examsPassed || 0) + 1;
                state.player.eduProgress.studyPoints = 0;
                StateManager.addMessage(
                  "🎉 研究生考试第" +
                    state.player.eduProgress.examsPassed +
                    "门通过！还差" +
                    (6 - state.player.eduProgress.examsPassed) +
                    "门。",
                  "success",
                );
              } else {
                StateManager.addMessage(
                  "😞 研究生考试未通过，继续备考再战！",
                  "danger",
                );
              }
            },
          });
          if (gradEp.examsPassed >= gradEp.totalExams) {
            actions.push({
              id: "edu_grad_cert",
              category: "education",
              name: "🎓 申请研究生学历认证",
              desc: "6门科目全部通过！提交认证，获得研究生学历，解锁高级职位和高薪机会。",
              apCost: 0,
              handler: function () {
                state.player.education = 2;
                state.education = 2;
                StateManager.addMessage(
                  "🎓 恭喜！你已取得研究生学历！知识改变命运！",
                  "success",
                );
                renderAll();
              },
            });
          }
        } else {
          actions.push({
            id: "edu_grad_requirement",
            category: "education",
            name: "🔒 研究生（未满足条件）",
            desc:
              "需day≥180、智力≥30才能开始研究生课程。当前day=" +
              state.player.day +
              "、智力=" +
              (state.player.intelligence || 0),
            disabled: true,
          });
        }
      } else if (edu === 2) {
        // 博士路径（edu=2→3，需day≥540+智力≥50+发表研究论文）
        if (state.player.day >= 540 && (state.player.intelligence || 0) >= 50) {
          var currResearch = state.player.research || 0;
          actions.push({
            id: "edu_phd_research",
            category: "education",
            name: "🔬 博士研究",
            desc:
              "消耗20AP，推进研究工作。已发表论文" +
              currResearch +
              "篇（需≥3篇毕业）。",
            apCost: 20,
            handler: function () {
              consumeAP(20);
              var progress = Random.int(5, 15);
              if (!state.flags._phdResearchProgress)
                state.flags._phdResearchProgress = 0;
              state.flags._phdResearchProgress =
                (state.flags._phdResearchProgress || 0) + progress;
              StateManager.addMessage(
                "🔬 博士研究推进+" +
                  progress +
                  "%（总" +
                  (state.flags._phdResearchProgress || 0) +
                  "%）。",
                "info",
              );
              if ((state.flags._phdResearchProgress || 0) >= 100) {
                state.player.research = (state.player.research || 0) + 1;
                state.flags._phdResearchProgress = 0;
                StateManager.addMessage(
                  "🎉 论文发表！已发表" + state.player.research + "篇论文。",
                  "success",
                );
              }
              if (Random.chance(0.05)) {
                state.player.intelligence = Math.min(
                  100,
                  (state.player.intelligence || 0) + 1,
                );
                StateManager.addMessage(
                  "💡 研究中的突破性发现！智力+1。",
                  "success",
                );
              }
            },
          });
          if (currResearch >= 3) {
            actions.push({
              id: "edu_phd_graduate",
              category: "education",
              name: "🎓 申请博士学位",
              desc:
                "已发表" +
                currResearch +
                "篇论文！提交博士论文答辩，获得博士学位。解锁学术路线。",
              apCost: 0,
              handler: function () {
                state.player.education = 3;
                state.education = 3;
                state.player.intelligence = Math.min(
                  100,
                  (state.player.intelligence || 0) + 5,
                );
                StateManager.addMessage(
                  "🎉 恭喜博士毕业！智力永久+5，学术之路就此开启！",
                  "success",
                );
                renderAll();
              },
            });
          }
        } else {
          actions.push({
            id: "edu_phd_requirement",
            category: "education",
            name: "🔒 博士（未满足条件）",
            desc:
              "需day≥540、智力≥50才能开始博士研究。当前day=" +
              state.player.day +
              "、智力=" +
              (state.player.intelligence || 0),
            disabled: true,
          });
        }
      } else if (edu >= 3) {
        actions.push({
          id: "edu_phd_done",
          category: "education",
          name: "🎓 博士学历持有者",
          desc: "你已是最高学历！学术路线完全解锁，智力永久加成已生效。",
          disabled: true,
        });
      }
    }

    // === 节日限定临时工作（P1.8）===
    if (
      typeof FESTIVAL_JOBS !== "undefined" &&
      typeof getCurrentFestival === "function"
    ) {
      var curFest = getCurrentFestival(state.player.day);
      if (curFest) {
        var festJobs = FESTIVAL_JOBS[curFest.id] || [];
        for (var fji = 0; fji < festJobs.length; fji++) {
          var fj = festJobs[fji];
          if (fj.location && fj.location !== loc) continue;
          if (fj.intReq && (state.player.intelligence || 0) < fj.intReq)
            continue;
          if ((state.player.actionPoints || 0) < (fj.apCost || 20)) continue;
          var fjId = fj.id;
          (function (fjob) {
            actions.push({
              id: fjob.id,
              category: "work",
              label: fjob.icon + " [节日] " + fjob.name + " ¥" + fjob.pay,
              apCost: fjob.apCost || 20,
              desc: fjob.desc + "（消耗" + (fjob.apCost || 20) + "AP）",
              handler: function () {
                var pay = fjob.pay + Random.int(0, 29);
                state.resources.cash = (state.resources.cash || 0) + pay;
                state.resources.totalEarned = (state.resources.totalEarned || 0) + pay;
                addDailyTransaction(
                  state,
                  "income",
                  "job_income",
                  pay,
                  "节日打工 - " + fjob.name,
                );
                consumeAP(fjob.apCost || 20);

                // 节日成就追踪
                if (curFest.id === "labor_day") {
                  state.flags._laborDayAchieveWork = true;
                } else if (curFest.id === "national_day") {
                  state.flags._nationalDayAchieveWork = true;
                }

                StateManager.addMessage(
                  curFest.icon +
                    " 节日打工「" +
                    fjob.name +
                    "」完成！获得¥" +
                    pay,
                  "success",
                );
              },
            });
          })(fj);
        }
      }
    }

    // === 名气VIP行动（fame达到阈值后各地点解锁特殊选项）===
    {
      const fame = (state.status && state.player.fame) || 0;
      const fameFlag = state.flags._fameVipUsedToday || {};

      // 商业区 fame≥25：商家主动拉你代言/站台
      if (
        locKey === "commercialDist" &&
        fame >= 25 &&
        !fameFlag.commercialVip
      ) {
        actions.push({
          id: "fame_commercial_vip",
          category: "appliance",
          name: "本地名人效应",
          desc: `名气${fame}点，商家请你站台推广，收现金并涨粉。(每天一次)`,
          apCost: 15,
          handler: () => {
            var earn = 50 + Math.floor(fame * 1.2) + Random.int(0, 79);
            state.resources.cash = (state.resources.cash || 0) + earn;
            state.resources.totalEarned = (state.resources.totalEarned || 0) + earn;
            addDailyTransaction(
              state,
              "income",
              "side_job",
              earn,
              "本地名人效应",
            );
            state.player.fame = Math.min(100, (state.player.fame || 0) + 3);
            state.flags._fameVipUsedToday = state.flags._fameVipUsedToday || {};
            state.flags._fameVipUsedToday.commercialVip = true;
            consumeAP(15);
            StateManager.addMessage(
              "🌟 你在商业街露了个脸，路人纷纷拍照！获得¥" +
                earn +
                "，名气+3。",
              "success",
            );
          },
        });
      }

      // 公园 fame≥20：粉丝偶遇，心情大涨
      if (locKey === "park" && fame >= 20 && !fameFlag.parkFan) {
        actions.push({
          id: "fame_park_fan",
          category: "appliance",
          name: "粉丝认出你了",
          desc: `有人认出你（名气${fame}），主动来搭话聊天，心情好极了。(每天一次)`,
          apCost: 5,
          handler: () => {
            state.needs.happiness = Math.min(100, state.needs.happiness + 20);
            state.player.mental = Math.min(100, (state.player.mental || 0) + 2);
            state.player.fame = Math.min(100, (state.player.fame || 0) + 2);
            state.flags._fameVipUsedToday = state.flags._fameVipUsedToday || {};
            state.flags._fameVipUsedToday.parkFan = true;
            consumeAP(5);
            StateManager.addMessage(
              "👋 有人说「我认识你！」——被认出的感觉真的很好。心情+20，心智+2，名气+2。",
              "success",
            );
          },
        });
      }

      // 培训中心 fame≥40：教练主动免费指导
      if (
        (locKey === "trainingCenter" || locKey === "school") &&
        fame >= 40 &&
        !fameFlag.trainingVip
      ) {
        actions.push({
          id: "fame_training_vip",
          category: "appliance",
          name: "名人专属指导课",
          desc: `名气${fame}点，教练/老师主动找你，提供一次免费专项训练。(每天一次)`,
          apCost: 20,
          handler: () => {
            // 随机提升一项属性或技能
            var targets = ["physique", "intelligence", "agility", "mental"];
            var attr = Random.fromArray(targets);
            state.player[attr] = Math.min(100, (state.player[attr] || 0) + 3);
            state.flags._fameVipUsedToday = state.flags._fameVipUsedToday || {};
            state.flags._fameVipUsedToday.trainingVip = true;
            consumeAP(20);
            var attrNames = {
              physique: "体质",
              intelligence: "智力",
              agility: "敏捷",
              mental: "心智",
            };
            StateManager.addMessage(
              "🎓 名师亲自指导了你！" +
                (attrNames[attr] || attr) +
                "+3，这种机会很难得。",
              "success",
            );
          },
        });
      }

      // 医院 fame≥35：VIP诊疗通道，就医更省AP
      if (locKey === "hospital" && fame >= 35 && !fameFlag.hospitalVip) {
        actions.push({
          id: "fame_hospital_vip",
          category: "appliance",
          name: "VIP就诊通道",
          desc: `名气${fame}点，护士认出你直接带去优先诊室，挂号费减半。(每天一次)`,
          apCost: 10,
          handler: () => {
            var healAmt = 25 + Math.floor(fame * 0.3);
            state.status.health = Math.min(
              100,
              (state.status.health || 100) + healAmt,
            );
            state.needs.happiness = Math.min(100, state.needs.happiness + 10);
            state.flags._fameVipUsedToday = state.flags._fameVipUsedToday || {};
            state.flags._fameVipUsedToday.hospitalVip = true;
            consumeAP(10);
            StateManager.addMessage(
              "⭐ 护士悄悄领你走VIP通道！健康+" +
                healAmt +
                "，心情+10，比普通看诊省了一半AP。",
              "success",
            );
          },
        });
      }

      // 科技园 fame≥50：受邀参加论坛演讲，名气+现金
      if (locKey === "techPark" && fame >= 50 && !fameFlag.techTalkVip) {
        actions.push({
          id: "fame_tech_talk",
          category: "appliance",
          name: "科技论坛演讲嘉宾",
          desc: `名气${fame}点，主办方邀请你做嘉宾分享，演讲费+名气暴增。(每天一次)`,
          apCost: 25,
          handler: () => {
            var earn = 200 + Math.floor(fame * 2.5) + Random.int(0, 149);
            state.resources.cash = (state.resources.cash || 0) + earn;
            state.resources.totalEarned = (state.resources.totalEarned || 0) + earn;
            addDailyTransaction(
              state,
              "income",
              "side_job",
              earn,
              "科技论坛演讲嘉宾",
            );
            state.player.fame = Math.min(100, (state.player.fame || 0) + 8);
            state.player.mental = Math.min(100, (state.player.mental || 0) + 2);
            state.flags._fameVipUsedToday = state.flags._fameVipUsedToday || {};
            state.flags._fameVipUsedToday.techTalkVip = true;
            consumeAP(25);
            StateManager.addMessage(
              "🎤 台下掌声热烈！你讲了30分钟，拿了¥" +
                earn +
                "出场费，名气+8，心智+2。",
              "success",
            );
          },
        });
      }
    }

    // 2. 旅行
    const reachable = getReachableLocations(locKey);
    for (const destKey of reachable) {
      const dest = getLocation(destKey);
      if (!dest) continue;
      const travelApCost = (() => {
        const st = StateManager.getState();
        if (typeof getTravelApCost === "function") {
          return getTravelApCost(locKey, destKey, st);
        }
        // 兜底：旧逻辑
        const reduction =
          typeof getTravelApReduction === "function"
            ? getTravelApReduction(st.skills.driving.level || 0)
            : 0;
        const tricycleBonus = st.flags.oldZhouTricycle ? 2 : 0;
        return Math.max(5, 15 - reduction - tricycleBonus);
      })();
      actions.push({
        id: "travel_" + destKey,
        category: "other",
        name: `前往 ${dest.name}`,
        desc: dest.desc,
        icon: "🚶",
        apCost: travelApCost,
        pricePreview:
          typeof buildDrivingPreview === "function"
            ? buildDrivingPreview(state, locKey, destKey, travelApCost)
            : "",
        handler: () => {
          const st = StateManager.getState();
          const ap =
            typeof getTravelApCost === "function"
              ? getTravelApCost(locKey, destKey, st)
              : 15;
          StateManager.update("trade.currentLocation", destKey);
          // 地点访问追踪（成就用）
          if (st.flags) {
            st.flags._visitedLocations = st.flags._visitedLocations || [];
            if (st.flags._visitedLocations.indexOf(destKey) === -1) {
              st.flags._visitedLocations.push(destKey);
              if (
                Object.keys(LOCATIONS).every(function (l) {
                  return st.flags._visitedLocations.indexOf(l) !== -1;
                })
              ) {
                st.flags._visitedAllLocations = true;
              }
            }
          }
          var hops =
            typeof getLocationHops === "function"
              ? getLocationHops(locKey, destKey)
              : 1;
          var hint = hops > 1 ? `（跨${hops}个地段）` : "";
          StateManager.addMessage(`🚶 你来到了${dest.name}。${hint}`, "info");
          // 到达新地点触发NPC互动（信息发现+社交）
          if (typeof rollNpcEncounterOnArrival === "function") {
            rollNpcEncounterOnArrival(st, destKey);
          }
          consumeAP(ap);
        },
      });
    }

    // 3. 通用行动
    actions.push({
      id: "rest",
      category: "survival",
      name: "休息一会",
      desc: "找个地方坐坐，恢复一些疲劳。",
      icon: "😴",
      apCost: 15,
      effectEstimate: "疲劳-18~33, 心情+5",
      handler: () => {
        const state = StateManager.getState();
        const isNewbie = state.player.day <= 10;
        const baseRecovery = isNewbie ? 22 : 18;
        const recovery = baseRecovery + Random.int(0, 11);
        state.needs.fatigue = Math.max(0, state.needs.fatigue - recovery);
        state.needs.happiness = Math.min(100, state.needs.happiness + 5);
        StateManager.addMessage(`😴 你休息了一会，疲劳-${recovery}。`, "info");
        consumeAP(15);
      },
    });

    // 还村长钱 — 随时可还（不限定地点）
    // 仅经典/有 villageDebt 的剧本显示此选项
    if ((state.resources.villageDebt || 0) > 0) {
      actions.push({
        id: "repay_village",
        category: "finance",
        name: "还村长钱",
        desc: "随时还一部分或全部村长的账，无债一身轻。",
        icon: "🏘️",
        disabled: (state.resources.cash || 0) <= 0 ? true : false,
        handler: () => {
          showRepayVillageModal();
        },
      });
    }

    // 缴纳罚单 — 有未缴罚单时显示（放在生存必需分类，确保醒目）
    if ((state.resources.fineDebt || 0) > 0) {
      actions.push({
        id: "pay_fine",
        category: "survival",
        priority: 1,
        name: "📋 缴纳罚单",
        desc: "未缴罚单每天2%滞纳金，赶紧交了吧！",
        icon: "📋",
        disabled: (state.resources.cash || 0) <= 0 ? true : false,
        handler: () => {
          showPayFineModal();
        },
      });
    }

    // 银行相关行动
    if (locKey === "bank") {
      actions.push({
        id: "deposit",
        category: "finance",
        name: "存款",
        desc: "把钱存入银行，吃利息也更安全。",
        icon: "🏦",
        disabled: (state.resources.cash || 0) <= 0 ? true : false,
        handler: () => {
          showDepositModal();
        },
      });
      actions.push({
        id: "withdraw",
        category: "finance",
        name: "取款",
        desc: "从银行取出存款。",
        icon: "💰",
        disabled: state.resources.bankBalance <= 0 ? true : false,
        handler: () => {
          showWithdrawModal();
        },
      });
      actions.push({
        id: "loan",
        category: "finance",
        name: "贷款",
        desc: "向银行贷款（动态额度评估，日息0.3%复利），解燃眉之急。",
        icon: "📝",
        handler: () => {
          showLoanModal();
        },
      });
      actions.push({
        id: "repay",
        category: "finance",
        name: "还银行贷款",
        desc: "偿还银行贷款。",
        icon: "💸",
        disabled:
          (state.resources.bankDebt || 0) <= 0 && (state.resources.cash || 0) <= 0
            ? true
            : false,
        handler: () => {
          showRepayModal();
        },
      });
    }

    // 医院
    if (locKey === "hospital") {
      var hasIllnesses =
        state.status.illnesses && state.status.illnesses.length > 0;
      actions.push({
        id: "heal",
        category: "survival",
        name: "看病治疗",
        desc: hasIllnesses
          ? "花50元做基础诊疗，恢复健康。具体疾病需分别治疗。"
          : "花50元看病，恢复健康、治疗伤病。",
        icon: "🏥",
        apCost: 20,
        costEstimate: 50,
        effectEstimate: hasIllnesses
          ? "健康+40（疾病需分别治疗）"
          : "健康+40, 伤病清除",
        disabled: (state.resources.cash || 0) < 50 ? true : false,
        handler: () => {
          const st = StateManager.getState();
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
          st.status.health = Math.min(100, st.status.health + 40);
          st.status.injured = false;
          // 不再一键清除所有疾病！具体疾病需通过"看病"选项分症治疗
          if (st.status.illnesses && st.status.illnesses.length > 0) {
            StateManager.addMessage(
              "🏥 做了基础诊疗，健康恢复了一些。但你的具体疾病需要分别治疗（使用「看病」选项）。",
              "warning",
            );
          } else {
            st.status.sick = false;
            StateManager.addMessage(
              "🏥 看了医生，健康恢复了不少。",
              "success",
            );
          }
          consumeAP(20);
        },
      });
    }

    // 培训中心
    if (locKey === "trainingCenter") {
      actions.push({
        id: "study",
        category: "education",
        name: "自学提升",
        desc: "花时间看书学习，提升技能等级。",
        icon: "📚",
        apCost: 15,
        effectEstimate: "技能XP+20~49, 10%智力+1",
        handler: () => {
          const st = StateManager.getState();
          // 随机提升一个技能
          const skillKeys = Object.keys(st.skills);
          const key = Random.fromArray(skillKeys);
          st.skills[key].xp += 20 + Random.int(0, 29);
          // 检查升级
          const skill = st.skills[key];
          const xpNeeded = (skill.level + 1) * 100;
          if (skill.xp >= xpNeeded && skill.level < 100) {
            skill.level++;
            skill.xp -= xpNeeded;
            st.flags._firstSkillUpgraded = true; // 成就：第一次技能升级
            StateManager.addMessage(
              `📚 你的${getSkillName(key)}提升到了等级 ${skill.level}！`,
              "success",
            );
          }
          if(st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue||0) + 8);
          if (Random.chance(0.1) && st.player.intelligence < 100) {
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 20) + 1,
            );
            StateManager.addMessage("🧠 你的智力提升了！", "success");
          }
          StateManager.addMessage(
            `📚 你花时间学习了${getSkillName(key)}。`,
            "info",
          );
          consumeAP(15);
        },
      });
    }

    // 公园
    if (locKey === "park") {
      actions.push({
        id: "relax_park",
        category: "survival",
        name: "公园放松",
        desc: "在公园散步、看风景，放松身心。心情+20，疲劳-10。",
        icon: "🌳",
        effectEstimate: "心情+20, 疲劳-10",
        handler: () => {
          const st = StateManager.getState();
          if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness||0) + 20);
          if(st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue||0) - 10);
          StateManager.addMessage(
            "🌳 在公园散了会步，心情舒畅多了。",
            "success",
          );
        },
      });
    }

    // 科技园 — 触发职场阶段入口
    if (locKey === "techPark" && state.player.phase === "street") {
      const intelligent = state.player.intelligence >= 45;
      const experienced =
        state.player.day >= 200 && (state.resources.totalEarned || 0) > 5000;
      const canTransition = intelligent || experienced;
      actions.push({
        id: "apply_job",
        category: "work",
        name: "应聘互联网公司",
        desc: canTransition
          ? intelligent
            ? "你的能力已经足够，可以去试试看！"
            : "200天街头经验证明了你。去试试？"
          : "需要智力 ≥ 45 或街头经验 ≥ 200天。",
        icon: "💼",
        disabled: !canTransition,
        reqFail: canTransition ? null : "智力不足45/经验不足200天",
        handler: () => {
          if (canTransition) {
            showInterviewModal();
          }
        },
      });
    }
  }

  // --- 职场阶段行动 ---
  if (state.player.phase === "corporate") {
    const rankData = CORP_RANKS[state.corporate.rank] || CORP_RANKS.P5;
    for (const action of CORP_ACTIONS) {
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
      if (action.cost && (state.resources.cash || 0) < action.cost) {
        disabled = true;
        reqText = `需 ¥${action.cost}`;
      }

      const effPreview = [];
      if (action.effects.kpi)
        effPreview.push(
          `KPI${action.effects.kpi > 0 ? "+" + action.effects.kpi : action.effects.kpi}`,
        );
      if (action.effects.hair)
        effPreview.push(
          `发量${action.effects.hair > 0 ? "+" + action.effects.hair : action.effects.hair}`,
        );
      if (action.effects.risk)
        effPreview.push(
          `风险${action.effects.risk > 0 ? "+" + action.effects.risk : action.effects.risk}`,
        );

      actions.push({
        id: "corp_" + action.id,
        category: "career",
        name: action.name,
        desc: action.desc,
        icon: action.icon,
        costEstimate: action.cost || null,
        reqFail: reqText || null,
        disabled,
        handler: () => {
          if (typeof doCorporateAction === "function")
            doCorporateAction(action.id);
        },
      });
    }

    // 团队管理入口
    if (state.corporate.team.length > 0 || rankData.canManageTeam) {
      actions.push({
        id: "corp_team_view",
        category: "career",
        name: "查看团队详情",
        desc: `管理你的${state.corporate.team.length}名团队成员。Q2可招聘。`,
        icon: "👥",
        handler: () => {
          renderCorporateActions(StateManager.getState());
          renderSidebar(StateManager.getState());
        },
      });
    }
  }

  // --- 创业阶段行动 (Phase 2)：仅在公司相关地点显示，避免与创业Tab重复 ---
  if (
    state.startup &&
    state.startup.status &&
    state.startup.status !== "none" &&
    state.startup.status !== "exited" &&
    (locKey === "techPark" || locKey === "startupOffice")
  ) {
    // 创业状态提示
    var startupSummary = null;
    if (typeof getStartupSummary === "function") {
      startupSummary = getStartupSummary(state);
    }
    if (startupSummary) {
      actions.push({
        id: "startup_header",
        category: "career",
        name: "「" + startupSummary.name + "」创业中",
        desc:
          "阶段：" +
          startupSummary.phase +
          " | 估值：¥" +
          startupSummary.valuation.toLocaleString() +
          " | 团队：" +
          startupSummary.employeeCount +
          "人 | 现金：¥" +
          startupSummary.cashReserve.toLocaleString(),
        icon: STARTUP_INDUSTRIES?.[startupSummary.industry]?.icon || "💼",
        disabled: true,
      });

      // 获取可执行行动
      var startupActions = [];
      if (typeof getAvailableStartupActions === "function") {
        startupActions = getAvailableStartupActions(state);
      }
      startupActions.forEach(function (sa) {
        var actionId = sa.id;
        var actionApCost = sa.apCost;
        actions.push({
          id: "startup_" + actionId,
          category: "career",
          name: sa.name,
          desc: sa.desc + (sa.meta ? "（可选：" + sa.meta + "）" : ""),
          icon: sa.icon,
          apCost: actionApCost,
          costEstimate: null,
          disabled: !sa.available,
          handler: function () {
            if (typeof executeStartupAction === "function") {
              var result = executeStartupAction(state, actionId, {});
              if (result && result.success) {
                consumeAP(actionApCost);
              }
              if (!result || !result.success) {
                StateManager.addMessage(
                  result && result.message ? result.message : "操作失败",
                  "warning",
                );
              }
              renderAll();
            }
          },
        });
      });
    }
  }

  // --- 培训中心：证书考试 ---
  if (locKey === "trainingCenter" && typeof CERTIFICATES !== "undefined") {
    const available =
      typeof getAvailableCertificates === "function"
        ? getAvailableCertificates(state)
        : [];
    for (const cert of available) {
      if (state.certificates.includes(cert.id)) continue;
      const canAfford = (state.resources.cash || 0) >= (cert.requirements.cash || 0);
      actions.push({
        id: "cert_" + cert.id,
        category: "education",
        name: `考取${cert.name}`,
        desc: `${cert.desc} 费用:¥${cert.requirements.cash} 通过率:${Math.round(cert.examPassRate * 100)}%`,
        icon: "📜",
        apCost: 33,
        costEstimate: cert.requirements.cash,
        disabled: !canAfford || ((state.player.actionPoints || 0) < 33 ? `行动力不足(需33点,当前${state.player.actionPoints || 0}点)` : null),
        reqFail: !canAfford ? `需 ¥${cert.requirements.cash}` : null,
        handler: () => {
          // [全系统AP守卫] 先消耗AP再考试
          if (consumeAP(33) === false) return;
          if (Random.chance(cert.examPassRate)) {
            state.certificates.push(cert.id);
            state.resources.cash = Math.max(0, (state.resources.cash || 0) - cert.requirements.cash);
            if (cert.effects.codingXp)
              addSkillXp("coding", cert.effects.codingXp);
            if (cert.effects.englishXp)
              addSkillXp("english", cert.effects.englishXp);
            if (cert.effects.weldingXp)
              addSkillXp("welding", cert.effects.weldingXp);
            if (cert.effects.electricianXp)
              addSkillXp("electrician", cert.effects.electricianXp);
            if (cert.effects.accountingXp)
              addSkillXp("accounting", cert.effects.accountingXp);
            if (cert.effects.managementXp)
              addSkillXp("management", cert.effects.managementXp);
            if (cert.effects.drivingXp)
              addSkillXp("driving", cert.effects.drivingXp);
            if (cert.effects.intelligence)
              state.player.intelligence = Math.min(
                100,
                (state.player.intelligence || 0) + cert.effects.intelligence,
              );
            if (cert.effects.physique)
              state.player.physique = Math.min(
                100,
                (state.player.physique || 0) + cert.effects.physique,
              );
            if (cert.effects.repair) addSkillXp("repair", cert.effects.repair);
            if (cert.effects.medicineXp)
              addSkillXp("medicine", cert.effects.medicineXp);
            // [全系统自洽修复] 域C 修复:A2 证书技能XP孤儿key映射到真实技能分支
            if (cert.effects.caregiverXp)
              addSkillXp("medicine", cert.effects.caregiverXp); // 护理→医学
            if (cert.effects.physiotherapyXp)
              addSkillXp("medicine", cert.effects.physiotherapyXp); // 康复→医学
            if (cert.effects.foodHandlingXp)
              addSkillXp("cooking", cert.effects.foodHandlingXp); // 食安→烹饪
            if (cert.effects.psychologyXp)
              addSkillXp("social", cert.effects.psychologyXp); // 心理→社交
            // [全系统自洽修复] 域A R197 修复:证书 healthBonus/mentalBonus/illnessRiskReduction/fatigueReduction 效果键全库无消费者→证书宣称的"健康+/心智+/降低患病风险/疲劳-"静默失效,此处补齐消费分支
            if (cert.effects.healthBonus)
              state.status.health = Math.min(
                100,
                (state.status.health || 0) + cert.effects.healthBonus,
              );
            if (cert.effects.mentalBonus)
              state.player.mental = Math.min(
                100,
                (state.player.mental || 0) + cert.effects.mentalBonus,
              );
            if (cert.effects.illnessRiskReduction)
              state.flags._illnessRiskReduction = Math.min(
                0.8,
                (state.flags._illnessRiskReduction || 0) +
                  cert.effects.illnessRiskReduction,
              );
            if (cert.effects.fatigueReduction)
              state.flags._certFatigueReduction =
                (state.flags._certFatigueReduction || 0) +
                cert.effects.fatigueReduction;
            // [全系统自洽修复] 域A R242 修复:cooking_cert/repair_cert/sales_cert 三证书 effects 块
            // (cookingXpBonus/repairXpBonus/salesXpBonus + chefJobIncomeBonus/repairJobIncomeBonus/salesJobIncomeBonus)
            // 全库零消费者→desc宣称的"XP加成/收入+20~25%"静默失效。此处补消费:累积到 flags 映射,
            // 由 addSkillXp(_certSkillXpBonus)与工资链(getCertJobIncomeMultiplier→_certJobIncomeBonus)真正生效。
            // (*JobUnlock 三键语义由技能树Lv30分支/技能门槛承担,记C类不接线)
            if (
              cert.effects.cookingXpBonus ||
              cert.effects.repairXpBonus ||
              cert.effects.salesXpBonus
            ) {
              state.flags._certSkillXpBonus =
                state.flags._certSkillXpBonus || {};
              var _xpbMap = state.flags._certSkillXpBonus;
              if (cert.effects.cookingXpBonus)
                _xpbMap.cooking = Math.max(
                  _xpbMap.cooking || 0,
                  cert.effects.cookingXpBonus,
                );
              if (cert.effects.repairXpBonus)
                _xpbMap.repair = Math.max(
                  _xpbMap.repair || 0,
                  cert.effects.repairXpBonus,
                );
              if (cert.effects.salesXpBonus)
                _xpbMap.sales = Math.max(
                  _xpbMap.sales || 0,
                  cert.effects.salesXpBonus,
                );
            }
            if (
              cert.effects.chefJobIncomeBonus ||
              cert.effects.repairJobIncomeBonus ||
              cert.effects.salesJobIncomeBonus
            ) {
              state.flags._certJobIncomeBonus =
                state.flags._certJobIncomeBonus || {};
              var _incMap = state.flags._certJobIncomeBonus;
              if (cert.effects.chefJobIncomeBonus)
                _incMap.cooking = Math.max(
                  _incMap.cooking || 0,
                  cert.effects.chefJobIncomeBonus,
                );
              if (cert.effects.repairJobIncomeBonus)
                _incMap.repair = Math.max(
                  _incMap.repair || 0,
                  cert.effects.repairJobIncomeBonus,
                );
              if (cert.effects.salesJobIncomeBonus)
                _incMap.sales = Math.max(
                  _incMap.sales || 0,
                  cert.effects.salesJobIncomeBonus,
                );
            }
            StateManager.addMessage(
              `📜 恭喜！成功考取${cert.name}！`,
              "success",
            );
          } else {
            state.resources.cash = Math.max(0, (state.resources.cash || 0) - Math.floor(cert.requirements.cash / 2));
            StateManager.addMessage(
              `📜 ${cert.name}考试未通过，报名费损失一半。下次再努力！`,
              "warning",
            );
          }
        },
      });
    }
  }

  // --- NPC 互动 ---
  if (typeof NPCS !== "undefined") {
    const npcsHere = getNpcsAtLocation(locKey);
    for (const npc of npcsHere) {
      const rel = state.relationships[npc.id] || { affinity: 0, met: false };
      const affLabel =
        typeof getAffinityLabel === "function"
          ? getAffinityLabel(rel.affinity)
          : "";
      actions.push({
        id: "npc_" + npc.id,
        category: "social",
        name: `与${npc.name}交谈`,
        desc: `${npc.role} — ${affLabel}`,
        icon: "💬",
        apCost: 10,
        handler: () => {
          if (!state.relationships[npc.id])
            state.relationships[npc.id] = { affinity: 0, met: true };
          const r = state.relationships[npc.id];
          r.met = true;
          const isBirthday = !!state.flags["_birthdayToday_" + npc.id];
          // 历史声誉额外好感（P2.9）
          var _histNpcBonus = 0;
          if (typeof getHistoryModifiers === "function") {
            _histNpcBonus = getHistoryModifiers(state).npcAffinityBonus || 0;
          }
          const affinityGain =
            (isBirthday ? 10 + Random.int(0, 4) : 5 + Random.int(0, 4)) +
            _histNpcBonus;
          r.affinity = Math.min(100, r.affinity + affinityGain);
          // 节日专属台词（P1.8）：节日期间65%概率触发
          var festLine = null;
          if (!isBirthday && typeof getFestivalNpcLine === "function") {
            var candidate = getFestivalNpcLine(npc.id, state);
            if (candidate && Random.chance(0.65)) festLine = candidate;
          }
          // 约定式语境对话：非节日/生日时35%概率触发（数据在NPC的contextDialogue字段）
          var contextLine = null;
          if (!isBirthday && !festLine && Random.chance(0.35)) {
            contextLine = getNpcContextDialogue(npc.id, state);
          }
          // [全系统自洽修复] 域E 联动增强2: 市场活跃时NPC主动提及投资话题（E→D）
          if (!contextLine && !isBirthday && !festLine && Random.chance(0.08)) {
            if (state.investment && state.investment._marketMood === "bullish") {
              contextLine = "最近股市不错，你买股票了吗？听说好多人赚了！";
            } else if (state.investment && state.investment._marketMood === "bearish") {
              contextLine = "最近行情不好，投资要谨慎啊，别把钱都扔进去。";
            }
          }
          // [全系统自洽修复] 域G 联动增强: NPC对玩家健康状态的反应（G→D 健康-社交联动）
          if (!contextLine && !isBirthday && !festLine && state.status && state.status.health < 30 && Random.chance(0.12)) {
            contextLine = "你脸色不太好，要不要去医院看看？别硬撑。";
          }
          const line =
            isBirthday && npc.birthdayLine
              ? npc.birthdayLine
              : festLine || contextLine || Random.fromArray(npc.talkLines);
          const bdTag = isBirthday ? " 🎂" : "";
          // [全系统自洽修复] 域C 联动增强2: 技能等级影响NPC对话收获(C→D)
          var _skillBonus = "";
          if (!isBirthday && Random.chance(0.15)) {
            var _highSkills = Object.keys(state.skills).filter(function(k) {
              return state.skills[k] && state.skills[k].level >= 50;
            });
            if (_highSkills.length > 0) {
              var _sk = Random.fromArray(_highSkills);
              affinityGain += 1;
              _skillBonus = "（" + _sk + "技能引人注目，好感额外+1）";
            }
          }
          StateManager.addMessage(
            `💬${bdTag} ${npc.name}：${line} (好感+${affinityGain})${_skillBonus}`,
            isBirthday ? "success" : "info",
          );
          state.needs.happiness = Math.min(
            100,
            state.needs.happiness + (isBirthday ? 8 : 3),
          );
          // 检查好感阈值奖励
          if (typeof checkNpcAffinityRewards === "function") {
            checkNpcAffinityRewards(npc.id, state);
          }
          // 信息发现：聊天中可能解锁隐藏信息（生日/喜好）
          if (typeof tryRevealNpcInfo === "function") {
            tryRevealNpcInfo(npc.id, state, "chat");
          }
          // [全系统自洽修复] 域D 联动增强: 高好感NPC分享投资心得（D→E 社交-经济联动）
          if (!isBirthday && !festLine && contextLine && (rel.affinity || 0) >= 60 && state.player && state.player.day >= 30 && Random.chance(0.05)) {
            var _investTips = ["最近关注下房产市场，听说有波动", "股市好像有动静，你可以留意下", "听说批发市场最近有套利机会", "有闲钱可以考虑存银行，利息还不错"];
            StateManager.addMessage("💡 " + npc.name + "分享投资心得：" + Random.fromArray(_investTips), "hint");
          }
          // v3.30: 互惠原理 — 12%概率NPC回赠小礼物
          if (!isBirthday && Random.chance(0.12) && rel.affinity >= 5) {
            var giftRoll = Random.int(0, 3);
            var giftMsg = "";
            switch (giftRoll) {
              case 0: // 食物
                var foodGain = 10 + Random.int(0, 10);
                state.needs.hunger = Math.min(
                  100,
                  (state.needs.hunger || 50) + foodGain,
                );
                giftMsg = "塞给你一些吃的，饥饱+" + foodGain;
                break;
              case 1: // 小钱
                var cashGift = 5 + Random.int(0, 25);
                state.resources.cash = (state.resources.cash || 0) + cashGift;
                giftMsg = "硬塞给你¥" + cashGift + "，说「年轻人别客气」";
                break;
              case 2: // 心情
                var happyGift = 3 + Random.int(0, 4);
                state.needs.happiness = Math.min(
                  100,
                  (state.needs.happiness || 50) + happyGift,
                );
                giftMsg = "说了句暖心的话，心情+" + happyGift;
                break;
              case 3: // 技能经验
                var skillGift = 2 + Random.int(0, 3);
                if (typeof addSkillXp === "function") {
                  addSkillXp("cooking", skillGift);
                }
                giftMsg = "分享了一些生活经验，烹饪经验+" + skillGift;
                break;
            }
            if (giftMsg) {
              StateManager.addMessage(
                "🎁 " + npc.name + giftMsg + "。",
                "success",
              );
            }
          }
          consumeAP(10);
        },
      });

      if (rel.met || (rel.affinity || 0) >= 30) {
        if ((rel.affinity || 0) >= 30) {
          actions.push({
            id: "intel_" + npc.id,
            category: "social",
            name: "向" + npc.name + "打听消息",
            desc: "消耗10AP换取一条可能提前兑现的街头情报；好感和心智越高，判断越可靠。",
            icon: "🗞️",
            apCost: 10,
            handler: (function (capturedNpc) {
              return function () {
                if (typeof askNpcForIntel !== "function") {
                  StateManager.addMessage("🗞️ 暂时没有可打听的消息。", "info");
                  return;
                }
                var result = askNpcForIntel(capturedNpc.id, state);
                if (result && result.ok) {
                  StateManager.addMessage("🗞️ " + result.message, "hint");
                  consumeAP(10);
                } else {
                  var msg = result ? result.message : "没有打听到新消息。";
                  StateManager.addMessage("🗞️ " + msg, "info");
                  if (msg.indexOf("没有新的可靠风声") >= 0) consumeAP(10);
                }
              };
            })(npc),
          });
        } else {
          actions.push({
            id: "intel_locked_" + npc.id,
            category: "social",
            name: "打听消息（好感30解锁）",
            desc: npc.name + "还不够信任你，多交谈几次再来问可靠风声。",
            icon: "🗞️",
            apCost: 0,
            disabled: true,
          });
        }
      }

      // NPC 委托任务（好感≥30且任务未完成）
      if (npc.favor) {
        var favorKey = "_npcFavor_" + npc.id;
        var rel2 = state.relationships[npc.id] || {};
        if (!state.flags[favorKey] && (rel2.affinity || 0) >= 30) {
          actions.push({
            id: "favor_" + npc.id,
            category: "social",
            name: npc.name + "有个请求",
            desc: npc.favor.story.slice(0, 40) + "...",
            icon: "❤️",
            apCost: 15,
            handler: (function (capturedNpc) {
              return function () {
                var choicesHtml = capturedNpc.favor.choices
                  .map(function (ch, ci) {
                    return (
                      '<button class="event-choice" data-idx="' +
                      ci +
                      '">' +
                      '<div class="choice-main">' +
                      ch.text +
                      "</div>" +
                      "</button>"
                    );
                  })
                  .join("");
                showModal({
                  title: "❤️ " + capturedNpc.name + " 的请求",
                  body:
                    '<p style="color:var(--text-secondary);font-size:13px;line-height:1.6;">' +
                    capturedNpc.favor.story +
                    "</p>" +
                    '<div style="margin-top:12px;">' +
                    choicesHtml +
                    "</div>",
                  buttons: [
                    { text: "取消", cls: "", callback: function () {} },
                  ],
                });
                setTimeout(function () {
                  var overlay = document.querySelector(".modal-overlay");
                  if (!overlay) return;
                  overlay
                    .querySelectorAll(".event-choice")
                    .forEach(function (btn) {
                      btn.addEventListener("click", function () {
                        var idx = parseInt(btn.getAttribute("data-idx"), 10);
                        var ch = capturedNpc.favor.choices[idx];
                        if (ch) {
                          var st2 = StateManager.getState();
                          ch.apply(st2);
                          consumeAP(15);
                          overlay.remove();
                          if (typeof renderAll === "function") renderAll();
                        }
                      });
                    });
                }, 30);
              };
            })(npc),
          });
        }
      }

      // NPC 深度任务（好感≥70且深度任务未完成）
      if (npc.deepTask) {
        var deepKey = "_npcDeepTask_" + npc.id;
        var relDeep = state.relationships[npc.id] || {};
        var deepReqAff = npc.deepTask.requiredAffinity || 70;
        if (!state.flags[deepKey] && (relDeep.affinity || 0) >= deepReqAff) {
          actions.push({
            id: "deeptask_" + npc.id,
            category: "social",
            name: npc.name + "想聊个重要的事",
            desc: npc.deepTask.story.slice(0, 45) + "...",
            icon: "💌",
            apCost: 20,
            handler: (function (capturedNpc) {
              return function () {
                var choicesHtml = capturedNpc.deepTask.choices
                  .map(function (ch, ci) {
                    return (
                      '<button class="event-choice" data-idx="' +
                      ci +
                      '">' +
                      '<div class="choice-main">' +
                      ch.text +
                      "</div>" +
                      (ch.hint
                        ? '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">' +
                          ch.hint +
                          "</div>"
                        : "") +
                      "</button>"
                    );
                  })
                  .join("");
                showModal({
                  title: "💌 " + capturedNpc.name + " 的心里话",
                  body:
                    '<p style="color:var(--text-secondary);font-size:13px;line-height:1.6;">' +
                    capturedNpc.deepTask.story +
                    "</p>" +
                    '<div style="margin-top:12px;">' +
                    choicesHtml +
                    "</div>",
                  buttons: [
                    { text: "取消", cls: "", callback: function () {} },
                  ],
                });
                setTimeout(function () {
                  var overlay = document.querySelector(".modal-overlay");
                  if (!overlay) return;
                  overlay
                    .querySelectorAll(".event-choice")
                    .forEach(function (btn) {
                      btn.addEventListener("click", function () {
                        var idx = parseInt(btn.getAttribute("data-idx"), 10);
                        var ch = capturedNpc.deepTask.choices[idx];
                        if (ch) {
                          var st2 = StateManager.getState();
                          ch.apply(st2);
                          st2.flags._todayDeepTaskDone = true;
                          consumeAP(20);
                          overlay.remove();
                          if (typeof renderAll === "function") renderAll();
                        }
                      });
                    });
                }, 30);
              };
            })(npc),
          });
        }
      }
    }
  }

  // 结束今天 — 所有地点/阶段均可用
  if ((state.player.actionPoints || 0) > 0) {
    actions.push({
      id: "end_day",
      category: "survival",
      priority: 0,
      name: "🛑 结束今天",
      desc: "行动力不足以继续活动时，直接结束这一天，进入下一天。",
      icon: "🛑",
      apCost: 0,
      handler: () => {
        if (typeof endDay === "function") {
          endDay();
        } else {
          StateManager.addMessage("⚠️ 无法结束今天，请刷新页面。", "error");
        }
      },
    });
  }

  // 吃顿饭 — 所有地点/阶段均可用（基本生存需求）
  actions.push({
    id: "eat",
    category: "survival",
    name: "吃顿饭",
    desc: "填饱肚子，补充体力。烹饪技能越高越省钱。",
    icon: "🍚",
    apCost: 10,
    costEstimate: 15,
    effectEstimate: "饥饱+35, 心情+8",
    disabled: (state.resources.cash || 0) < 8 ? true : false,
    handler: () => {
      const st = StateManager.getState();
      const isNewbie = st.player.day <= 10;
      // 烹饪技能减折扣：cooking 0→全价15, 50→9折, 100→3折（保底5元）
      const cookingLvl = st.skills.cooking.level || 0;
      const discount =
        typeof getCookingDiscount === "function"
          ? getCookingDiscount(cookingLvl)
          : 0;
      const baseCost = isNewbie ? 8 : 15;
      // 陈师傅好感80解锁秘方：额外-20%食费
      const recipeDiscount = st.flags.chefChenRecipe ? 0.2 : 0;
      const totalDiscount = Math.min(0.85, discount + recipeDiscount);
      const foodCost = Math.max(
        5,
        Math.round(baseCost * (1 - totalDiscount)),
      );
      if ((st.resources.cash || 0) < foodCost) {
        StateManager.addMessage("⚠️ 钱不够吃饭了！", "danger");
        return;
      }
      var saved = baseCost - foodCost;
      var cookHint = "";
      if (recipeDiscount > 0 && discount > 0) {
        cookHint = `（烹饪Lv${cookingLvl}+陈师傅秘方共省¥${saved}）`;
      } else if (recipeDiscount > 0) {
        cookHint = `（陈师傅秘方省¥${saved}）`;
      } else if (discount > 0) {
        cookHint = `（烹饪Lv${cookingLvl}省了¥${saved}）`;
      }

      st.resources.cash = Math.max(0, (st.resources.cash || 0) - foodCost);
      addDailyTransaction(
        st,
        "expense",
        "food",
        foodCost,
        "吃饭" + (cookHint || ""),
      );
      st.needs.hunger = Math.min(100, st.needs.hunger + 35);
      if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness||0) + 8);
      StateManager.addMessage(
        `🍚 你花¥${foodCost}吃了顿饭，肚子饱了。${cookHint}`,
        "success",
      );
      consumeAP(10);
    },
  });

  // 洗澡 — 所有地点/阶段均可用（基本卫生需求）
  actions.push({
    id: "shower",
    category: "survival",
    name: "洗澡",
    desc: "花8元洗个澡，保持个人卫生。",
    icon: "🚿",
    apCost: 10,
    costEstimate: 8,
    effectEstimate: "卫生+40",
    disabled: (state.resources.cash || 0) < 8 ? true : false,
    handler: () => {
      const st = StateManager.getState();
      if ((st.resources.cash || 0) < 8) {
        StateManager.addMessage("⚠️ 不够钱洗澡。", "danger");
        return;
      }
      st.resources.cash = Math.max(0, (st.resources.cash || 0) - 8);
      st.needs.hygiene = Math.min(100, st.needs.hygiene + 40);
      StateManager.addMessage("🚿 洗了个澡，神清气爽。", "success");
      consumeAP(10);
    },
  });

  // --- 注入扩展行动库（生存/社交/学习/生活/投资/梦想）---
  if (typeof addExtraActions === "function") {
    addExtraActions(state, actions);
  }

  return actions;
}

/** 执行街头工作 */
// v3.70 收益浮动数字动效
function showEarnFloat(amount, sourceEl) {
  if (!amount || amount <= 0) return;
  var el = document.createElement("div");
  el.className = "earn-float" + (amount >= 500 ? " earn-big" : "");
  el.textContent = "+¥" + amount;
  // 定位：优先跟随来源元素，否则屏幕中央偏上
  var x = window.innerWidth / 2 - 30;
  var y = window.innerHeight * 0.38;
  if (sourceEl) {
    var rect = sourceEl.getBoundingClientRect();
    x = rect.left + rect.width / 2 - 20;
    y = rect.top - 8;
  }
  el.style.left = Math.max(8, Math.min(x, window.innerWidth - 80)) + "px";
  el.style.top = y + "px";
  document.body.appendChild(el);
  el.addEventListener("animationend", function () {
    el.remove();
  });
}

function doStreetJob(job) {
  const state = StateManager.getState();

  // [全系统AP守卫] 行动力不足时直接拒绝（防御性编程，防止disabled漏掉或绕过）
  if ((state.player.actionPoints || 0) < 33) {
    StateManager.addMessage(
      `⚠️ 行动力不足，无法继续工作。需要33点，当前仅${state.player.actionPoints || 0}点。`,
      "warning",
    );
    return;
  }

  // [全系统AP守卫] 先消耗行动力再干活（防止极端状态检查提前返回导致AP不扣、可无限白嫖）
  if (consumeAP(33) === false) {
    return; // 极端状态（饿晕/过劳/病危）触发，跳过本次行动
  }

  // [全系统自洽修复] 跟踪唯一街头工作天数（用于显示和经验计算）
  if (!state.flags._workedToday) {
    state.flags._totalStreetDays = (state.flags._totalStreetDays || 0) + 1;
  }

  // 扣除启动资金
  if (job.startupCost) {
    // [全系统自洽修复] 域G A类修复: cash NaN 守卫（防止旧存档/极端值导致现金永久损坏）
    if (typeof state.resources.cash !== "number" || !isFinite(state.resources.cash)) {
      state.resources.cash = 0;
    }
    state.resources.cash = Math.max(0, (state.resources.cash || 0) - job.startupCost);
  }

  // 计算收入（含新闻+装备+情绪修正）
  // [全系统自洽修复] 域G A类#2: payCalc 返回 NaN/undefined 时防御
  let pay = job.payCalc(state);
  if (typeof pay !== "number" || !isFinite(pay) || pay < 0) pay = 0;
  if (state._jobMultipliers && state._jobMultipliers[job.id]) {
    pay = Math.floor(pay * state._jobMultipliers[job.id]);
  }
  if (state._allJobsBonus && state._allJobsBonus !== 1) {
    pay = Math.floor(pay * state._allJobsBonus);
  }
  // 装备加成（getItemJobBonus 遍历已装备物品的 jobBonuses）
  if (typeof getItemJobBonus === "function") {
    var equipMulti = getItemJobBonus(job.id, state);
    if (equipMulti !== 1.0) {
      var oldPay = pay;
      pay = Math.floor(pay * equipMulti);
      StateManager.addMessage(
        "🎒 装备加成：+" + Math.round((equipMulti - 1) * 100) + "%",
        "success",
      );
    }
  }
  // 套装加成
  if (typeof getSuiteJobBonus === "function") {
    var suiteMulti = getSuiteJobBonus(job.id, state);
    if (suiteMulti !== 1.0) {
      pay = Math.floor(pay * suiteMulti);
      StateManager.addMessage(
        "🎯 套装加成：+" + Math.round((suiteMulti - 1) * 100) + "%",
        "success",
      );
    }
  }

  // [全系统自洽修复] 域A R242: 证书职业收入加成(chefJobIncomeBonus等键此前全库零消费者)
  if (typeof getCertJobIncomeMultiplier === "function") {
    var certIncMulti = getCertJobIncomeMultiplier(job, state);
    if (certIncMulti !== 1.0) {
      pay = Math.floor(pay * certIncMulti);
      StateManager.addMessage(
        "📜 持证加成：+" + Math.round((certIncMulti - 1) * 100) + "%",
        "success",
      );
    }
  }

  // v3.1 第39轮：街坊声望收入加成
  if (typeof getRepPayMultiplier === "function") {
    var locKey =
      state.trade && state.trade.currentLocation
        ? state.trade.currentLocation
        : null;
    if (locKey) {
      var repMulti = getRepPayMultiplier(state, locKey);
      if (repMulti > 1.0) {
        pay = Math.floor(pay * repMulti);
      }
    }
  }
  // v3.1 第41轮：人生抉择收入加成（专注/耐心/深耕/雄心/进取）
  if (typeof getFocusBonus === "function") {
    var focusM = getFocusBonus(state);
    if (focusM > 1.0) pay = Math.floor(pay * focusM);
  }
  if (typeof getPatientBonus === "function") {
    var patientM = getPatientBonus(state);
    if (patientM > 1.0) pay = Math.floor(pay * patientM);
  }
  if (typeof getLocalFocusBonus === "function") {
    var localM = getLocalFocusBonus(state);
    if (localM > 1.0) pay = Math.floor(pay * localM);
  }
  if (typeof getAmbitionBonus === "function") {
    var ambitM = getAmbitionBonus(state);
    if (ambitM > 1.0) pay = Math.floor(pay * ambitM);
  }
  if (typeof getDrivenBonus === "function") {
    var drivenM = getDrivenBonus(state);
    if (drivenM > 1.0) pay = Math.floor(pay * drivenM);
  }
  if (typeof getNewsJobMultiplier === "function") {
    var newsJobMult = getNewsJobMultiplier(job.id, state);
    if (newsJobMult !== 1.0) {
      pay = Math.floor(pay * newsJobMult);
      if (typeof getNewsJobMultiplierDesc === "function") {
        var newsJobDesc = getNewsJobMultiplierDesc(job.id, state);
        if (newsJobDesc) {
          StateManager.addMessage("📰 城市脉搏：" + newsJobDesc, "hint");
        }
      }
    }
  }
  const emoMod =
    typeof getEmotionWorkModifier === "function"
      ? getEmotionWorkModifier(state)
      : null;
  if (emoMod) {
    pay = Math.floor(pay * (emoMod.pay || 1));
  }
  // 天气→户外工作收入修正：晴天100%，暴雨60%，暴雪40%，台风0%
  // （getWeatherWorkMod 在 weather.js 中定义，返回 outdoorMod）
  if (typeof getWeatherWorkMod === "function") {
    var weatherMult = getWeatherWorkMod(state);
    if (weatherMult < 1.0) {
      var oldWeatherPay = pay;
      pay = Math.floor(pay * weatherMult);
      if (weatherMult <= 0.5) {
        StateManager.addMessage(
          "🌧️ 恶劣天气，户外工作收入降至 " +
            Math.round(weatherMult * 100) +
            "%",
          "warning",
        );
      }
    }
  }
  // ===技能加权收入：减少纯RNG依赖，技能越高中位收入越高 ===
  const skillBonus = getSkillPayBonus(job.id, state);
  if (skillBonus > 1.0) {
    pay = Math.floor(pay * skillBonus);
  }
  // NPC在场加成：熟识的NPC在同地点时提升收入（参考《星露谷》村民合作系统）
  if (typeof getNpcPresenceBonus === "function") {
    var npcMult = getNpcPresenceBonus(
      state.trade.currentLocation,
      job.id,
      state,
    );
    if (npcMult > 1.0) {
      pay = Math.floor(pay * npcMult);
      // 偶尔显示提示
      if (
        Random.chance(0.25) &&
        typeof getNpcPresenceBonusDesc === "function"
      ) {
        var npcDesc = getNpcPresenceBonusDesc(
          state.trade.currentLocation,
          job.id,
          state,
        );
        if (npcDesc)
          StateManager.addMessage(
            "💡 " + npcDesc + "，今日收入有加成！",
            "hint",
          );
      }
    }
  }
  // 行业热度反馈：sectorHeat → 街头工作收入（review P0-3）
  if (typeof getSectorJobIncomeMultiplier === "function") {
    var secMult = getSectorJobIncomeMultiplier(job.id, state);
    if (secMult !== 1.0) {
      pay = Math.floor(pay * secMult);
      if (Random.chance(0.2) && typeof getSectorJobIncomeDesc === "function") {
        var secDesc = getSectorJobIncomeDesc(job.id, state);
        if (secDesc) StateManager.addMessage("📊 " + secDesc, "hint");
      }
    }
  }
  // 图书馆城市生存指南加成：来自旧书的知识永久提升街头收入
  if (state.flags && state.flags._citySurvivalGuide) {
    pay = Math.floor(pay * 1.08);
  }
  // 玩家历史声誉加成（P2.9）：过去道德选择的持续影响
  if (typeof getHistoryModifiers === "function") {
    var histMods = getHistoryModifiers(state);
    if (histMods.earningsBonus > 1.0) {
      pay = Math.floor(pay * histMods.earningsBonus);
    }
  }
  // 技能协同加成（P3.3）：多技能组合达到门槛时额外收入
  if (typeof getSkillSynergyBonus === "function") {
    var synBonus = getSkillSynergyBonus(job.id, state);
    if (synBonus > 0) {
      var synPay = Math.floor(pay * synBonus);
      if (synPay > 0) {
        pay += synPay;
        if (Random.chance(0.3)) {
          StateManager.addMessage(
            "✨ 技能协同加成 +" + synPay + "（技能组合效果）",
            "info",
          );
        }
      }
    }
  }
  // 连续工作奖励（P3.4）：同一工作连续N天，熟练度加成
  if (!state.flags._jobStreaks) state.flags._jobStreaks = {};
  var streakData = state.flags._jobStreaks[job.id] || { count: 0, lastDay: 0 };
  var yesterday = state.player.day - 1;
  if (streakData.lastDay === yesterday) {
    streakData.count = (streakData.count || 0) + 1;
  } else if (streakData.lastDay !== state.player.day) {
    streakData.count = 1;
  }
  streakData.lastDay = state.player.day;
  state.flags._jobStreaks[job.id] = streakData;
  var streakBonus = 0;
  var streakLabel = "";
  if (streakData.count >= 7) {
    streakBonus = 0.15;
    streakLabel = "🔥×7连";
  } else if (streakData.count >= 5) {
    streakBonus = 0.1;
    streakLabel = "🔥×5连";
  } else if (streakData.count >= 3) {
    streakBonus = 0.05;
    streakLabel = "🔥×3连";
  }
  if (streakBonus > 0) {
    var streakPay = Math.floor(pay * streakBonus);
    pay += streakPay;
    if (
      streakData.count === 3 ||
      streakData.count === 5 ||
      streakData.count === 7
    ) {
      StateManager.addMessage(
        streakLabel +
          " 熟练度加成+" +
          streakPay +
          "！连续干" +
          streakData.count +
          "天" +
          job.name,
        "hint",
      );
    }
  }
  // 新人保护：前15天全职业收入+20%（帮助渡过初期生存期）
  if (state.player.day <= 15) {
    var newbieBonus = Math.floor(pay * 0.2);
    if (newbieBonus > 0) {
      pay += newbieBonus;
      state.flags._newbieBonusTotal =
        (state.flags._newbieBonusTotal || 0) + newbieBonus;
    }
  }
  // [全系统自洽修复] 域G R240 A类修复: employment 守卫前置（原守卫在4616行，晚于4573/4580两处解引用，旧存档崩溃）
  if (!state.employment) {
    state.employment = { currentJob: null, jobStartDay: 0, completedShifts: {} };
  }
  state.employment.completedShifts[job.id] =
    (state.employment.completedShifts[job.id] || 0) + 1;
  state.flags._completedShiftCount =
    (state.flags._completedShiftCount || 0) + 1; // 成就：第一份工作

  // 职业称号系统：同一工作累计天数解锁称号加成
  if (!state.flags._jobTitles) state.flags._jobTitles = {};
  var totalShifts = state.employment.completedShifts[job.id];
  var currentTitle = state.flags._jobTitles[job.id] || 0;
  if (totalShifts >= 100 && currentTitle < 3) {
    state.flags._jobTitles[job.id] = 3;
    pay = Math.floor(pay * 1.15);
    StateManager.addMessage(
      "👑 职业大师！" + job.name + "累计100天，收入永久+15%！",
      "success",
    );
    if (typeof checkJobMilestoneEvent === "function")
      checkJobMilestoneEvent(job.id, 3, state);
  } else if (totalShifts >= 30 && currentTitle < 2) {
    state.flags._jobTitles[job.id] = 2;
    pay = Math.floor(pay * 1.08);
    StateManager.addMessage(
      "🎖️ 熟练老手！" + job.name + "累计30天，收入永久+8%！",
      "success",
    );
    if (typeof checkJobMilestoneEvent === "function")
      checkJobMilestoneEvent(job.id, 2, state);
  } else if (totalShifts >= 7 && currentTitle < 1) {
    state.flags._jobTitles[job.id] = 1;
    StateManager.addMessage(
      "📋 入门新人期已过，" + job.name + "工作已上手。",
      "hint",
    );
    if (typeof checkJobMilestoneEvent === "function")
      checkJobMilestoneEvent(job.id, 1, state);
  }
  // 已获称号加成持续生效
  var titleBonus = state.flags._jobTitles[job.id] || 0;
  if (titleBonus === 2) pay = Math.floor(pay * 1.08);
  else if (titleBonus === 3) pay = Math.floor(pay * 1.15);

  // 应用效果（employment 守卫已前置到函数顶部，见 R240 A类修复）
  if (job.effects) {
    // [全系统自洽修复] 域C 联动增强1: 技能等级降低同领域工作疲劳(熟能生巧)
    var fatigueReduction = 0;
    if (typeof getSkillFatigueReduction === "function") {
      fatigueReduction = getSkillFatigueReduction(job.id, state);
    }
    // [全系统自洽修复] 域A R197 修复:接入证书 fatigueReduction 常驻效果(如康复治疗师证书承诺"疲劳-3",此前 flag 无消费者)
    fatigueReduction += (state.flags && state.flags._certFatigueReduction) || 0;
    var fatigueAmount = job.effects.fatigue || 0;
    if (fatigueReduction > 0 && fatigueAmount > 0) {
      fatigueAmount = Math.max(0, fatigueAmount - fatigueReduction);
      if (Random.chance(0.3)) {
        StateManager.addMessage(
          "💪 熟能生巧，技能降低了劳动强度，疲劳-" + fatigueReduction + "！",
          "hint",
        );
      }
    }
    if (fatigueAmount > 0)
      state.needs.fatigue = Math.min(100, state.needs.fatigue + fatigueAmount);
    else if (job.effects.fatigue)
      state.needs.fatigue = Math.min(
        100,
        state.needs.fatigue + job.effects.fatigue,
      );
    if (job.effects.hygiene)
      state.needs.hygiene = Math.max(
        0,
        Math.min(100, state.needs.hygiene + job.effects.hygiene),
      );
    if (job.effects.happiness)
      state.needs.happiness = Math.max(
        0,
        Math.min(100, state.needs.happiness + job.effects.happiness),
      );
    if (job.effects.mental)
      state.player.mental = Math.max(
        0,
        Math.min(100, (state.player.mental || 0) + job.effects.mental),
      );
    if (job.effects.fame)
      state.player.fame = Math.max(
        0,
        Math.min(100, (state.player.fame || 0) + job.effects.fame),
      );

    // 技能经验
    addSkillXp("cooking", job.effects.cookingXp || 0);
    addSkillXp("repair", job.effects.repairXp || 0);
    // [全系统自洽修复] 域A R242 修复:agility/physique/intelligence 非真实技能键
    // (state.skills 仅 cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social),
    // addSkillXp 内部 state.skills[key] 未命中即静默 return→三行死调用移除。
    // 三者的成长收益由下方「属性经验转化」块以 state.player.agility/physique/intelligence 属性承接(真实字段)。
    addSkillXp("sales", job.effects.salesXp || 0);
    addSkillXp("english", job.effects.englishXp || 0);
    addSkillXp("welding", job.effects.weldingXp || 0);
    addSkillXp("medicine", job.effects.medicineXp || 0);
    addSkillXp("social", job.effects.socialXp || 0);
    // [全系统自洽修复] 域C 修复:caregiverXp原doStreetJob未消费(孤儿effect),映射到medicine技能
    addSkillXp("medicine", job.effects.caregiverXp || 0);
    // [全系统自洽修复] 域C 修复:A2 street-job skill XP单key别名统一(codingXp→coding等已在别处)
    if (job.effects.codingXp) addSkillXp("coding", job.effects.codingXp);
    if (job.effects.managementXp)
      addSkillXp("management", job.effects.managementXp);
    if (job.effects.accountingXp)
      addSkillXp("accounting", job.effects.accountingXp);
    if (job.effects.electricianXp)
      addSkillXp("electrician", job.effects.electricianXp);
    if (job.effects.drivingXp) addSkillXp("driving", job.effects.drivingXp);
  }

  // 属性经验转化
  if (job.effects) {
    if (job.effects.agilityXp)
      state.player.agility = Math.min(
        100,
        (state.player.agility || 0) + job.effects.agilityXp * 0.1,
      );
    if (job.effects.physiqueXp)
      state.player.physique = Math.min(
        100,
        (state.player.physique || 0) + job.effects.physiqueXp * 0.1,
      );
    if (job.effects.intelligenceXp)
      state.player.intelligence = Math.min(
        100,
        (state.player.intelligence || 0) + job.effects.intelligenceXp * 0.1,
      );
  }

  // === 天气修正（户外工作）===
  const outdoorJobs = [
    "waste_recycling",
    "manual_labor_construction",
    "skilled_labor_construction",
    "street_vending_food",
    "street_vending_goods",
    "food_stall",
    "delivery_rider",
    "package_delivery",
    "warehouse_worker",
    "street_performer",
    "security_guard",
  ];
  if (outdoorJobs.includes(job.id)) {
    const weatherMod =
      typeof getWeatherWorkMod === "function" ? getWeatherWorkMod(state) : 1;
    const extraFatigue =
      typeof getWeatherFatigue === "function" ? getWeatherFatigue(state) : 0;
    const weatherHappiness =
      typeof getWeatherHappiness === "function"
        ? getWeatherHappiness(state)
        : 0;
    if (weatherMod !== 1) {
      pay = Math.floor(pay * weatherMod);
      StateManager.addMessage(
        `🌤️ 天气影响：收入×${weatherMod.toFixed(1)}。`,
        "info",
      );
    }
    if (extraFatigue > 0) {
      state.needs.fatigue = Math.min(100, state.needs.fatigue + extraFatigue);
    }
    if (weatherHappiness !== 0) {
      state.needs.happiness = Math.max(
        0,
        Math.min(100, state.needs.happiness + weatherHappiness),
      );
    }
  }

  // v3.1: 难度工资乘数（休闲档+15%，地狱档-30%）
  if (typeof getDifficultyMultiplier === "function") {
    var wageMult = getDifficultyMultiplier(state, "wage");
    if (wageMult !== 1.0) pay = Math.floor(pay * wageMult);
  }

  // v3.27: 每日热招加成（稀缺性 — 限时高薪机会）
  if (
    state.flags &&
    state.flags._dailyHotJob &&
    state.flags._dailyHotJob.jobId === job.id
  ) {
    var hotMult = state.flags._dailyHotJob.bonusMult || 1.0;
    if (hotMult > 1.0) {
      var hotBonus = Math.floor(pay * (hotMult - 1));
      if (hotBonus > 0) {
        pay += hotBonus;
        StateManager.addMessage(
          "🔥 今日热招加成 +¥" + hotBonus + "！",
          "success",
        );
      }
    }
  }

  // [全系统自洽修复] 域G A类修复: totalEarned NaN 传播守卫（旧存档/极端值导致现金永久损坏）
  if (typeof state.resources.totalEarned !== "number" || !isFinite(state.resources.totalEarned)) {
    state.resources.totalEarned = 0;
  }

  // === 废品回收·街坊情报网络（4号楼林老师废纸箱 / 5号楼废铜管）===
  // 玩家在里程碑事件选择"谢谢大妈，以后常过来"后激活 _wasteRecyclingNetwork
  // 大妈的情报变成真实可交互的游戏机制：
  //   - 每周二（weekDay===2）：4号楼林老师放废纸箱 → 额外收入+15%
  //   - 每月初（day%30∈[1,3]）：5号楼废铜管 → 额外收入+25%
  if (job.id === "waste_recycling" && state.flags && state.flags._wasteRecyclingNetwork) {
    var wd = ((state.player.day - 1) % 7) + 1; // 1=周一 ... 7=周日
    var dom = state.player.day % 30; // 模拟月内天数
    if (wd === 2) {
      var paperBonus = Math.floor(pay * 0.15) + 5;
      pay += paperBonus;
      if (Random.chance(0.5)) {
        StateManager.addMessage("📦 4号楼林老师的废纸箱！情报准，多赚¥" + paperBonus, "success");
      }
    }
    if (dom >= 1 && dom <= 3) {
      var copperBonus = Math.floor(pay * 0.25) + 10;
      pay += copperBonus;
      StateManager.addMessage("🔩 5号楼废铜管！月初果然有货，多赚¥" + copperBonus, "success");
    }
  }

  state.resources.cash = (state.resources.cash || 0) + pay;
  state.resources.totalEarned = (state.resources.totalEarned || 0) + pay;
  addDailyTransaction(
    state,
    "income",
    "job_income",
    pay,
    "工作收入 - " + (job.name || "临时工"),
  );

  // v3.70 收益浮动数字
  var _hotCardEl = document.querySelector(
    '[data-action-id="job_' + job.id + '"]',
  );
  showEarnFloat(pay, _hotCardEl);

  // === 城管检查（摆摊类工作）===
  const vendingJobs = [
    "street_vending_food",
    "street_vending_goods",
    "food_stall",
  ];
  if (vendingJobs.includes(job.id)) {
    // === 🌤️ 天气→客流量→摆摊收益闭环 ===
    if (typeof getWeatherFootTrafficMod === "function") {
      const trafficMod = getWeatherFootTrafficMod(state);
      if (trafficMod < 1.0) {
        // 下雨/下雪天客流量下降
        const lost = Math.floor(pay * (1 - trafficMod));
        // 需求商品可部分抵消客流损失
        let demandComp = 1.0;
        if (typeof getWeatherDemandBonus === "function") {
          const wId = state.weather?.current;
          const inventory = state.inventory?.items || [];
          let bonusCount = 0;
          let bonusTotal = 0;
          for (const item of inventory) {
            const db = getWeatherDemandBonus(wId, item.id);
            if (db > 1.0) {
              bonusTotal += db;
              bonusCount++;
            }
          }
          if (bonusCount > 0) demandComp = bonusTotal / bonusCount;
        }
        const effective = Math.min(1.0, trafficMod + (demandComp - 1.0) * 0.5);
        const actualLoss = Math.floor(pay * (1 - effective));
        if (actualLoss > 5) {
          pay -= actualLoss;
          // 检查是否有高需求商品
          let demandNames = [];
          if (typeof getWeatherDemandBonus === "function") {
            const inventory = state.inventory?.items || [];
            for (const item of inventory) {
              const db = getWeatherDemandBonus(state.weather?.current, item.id);
              if (db > 1.0 && typeof getGoodById === "function") {
                const g = getGoodById(item.id);
                if (g) demandNames.push(g.name);
              }
            }
          }
          if (demandNames.length > 0 && trafficMod < 0.7) {
            StateManager.addMessage(
              `🌤️ 客流偏少(↓${Math.round((1 - effective) * 100)}%)，但${demandNames.slice(0, 2).join("、")}还算好卖。`,
              "event",
            );
          } else {
            StateManager.addMessage(
              `🌧️ 天气影响客流(↓${Math.round((1 - effective) * 100)}%)，摆摊少赚约¥${actualLoss}。`,
              "warning",
            );
          }
        }
      } else if (trafficMod > 1.0) {
        const bonus = Math.floor(pay * (trafficMod - 1.0));
        if (bonus > 0) {
          pay += bonus;
          if (Random.chance(0.3)) {
            StateManager.addMessage(
              "☀️ 天气好客流量大，多赚了¥" + bonus + "！",
              "success",
            );
          }
        }
      }
    }

    // 城管检查
    state.chengguan = state.chengguan || {
      heat: 0,
      warnings: 0,
      relationship: 0,
      lastRaid: 0,
    };
    state.chengguan.heat = Math.min(
      100,
      state.chengguan.heat + 3 + Random.int(0, 4),
    );
    const raidChance = (state.chengguan.heat / 100) * 0.35;
    if (Random.chance(raidChance)) {
      state.chengguan.lastRaid = state.player.day;
      state.chengguan.heat = Math.max(0, state.chengguan.heat - 25);
      if (state.chengguan.warnings >= 2 || state.chengguan.relationship < -30) {
        // 没收货物+罚款
        const fine = 80 + Random.int(0, 199);
        state.resources.cash = Math.max(0, (state.resources.cash || 0) - fine);
        state.chengguan.warnings = 0;
        StateManager.addMessage(
          `🚔 城管突击检查！货物被没收，罚款 ¥${fine}！`,
          "danger",
        );
      } else {
        state.chengguan.warnings++;
        StateManager.addMessage(
          `🚔 城管来巡查了！给了你第${state.chengguan.warnings}次警告。`,
          "warning",
        );
      }
    }
  }

  // 受伤/生病风险（情绪影响风险倍率）
  if (job.risk) {
    const riskMod =
      typeof getEmotionWorkModifier === "function"
        ? getEmotionWorkModifier(state).injury || 1
        : 1;
    const certReduction =
      state.certificates && state.certificates.includes("construction_safety")
        ? 0.5
        : 1.0;
    // [全系统自洽修复] 域C R306 A类: injuryReduction 效果键(items.js 护膝0.08/equipment_suites 4处0.05-0.2,wiki 明示"受伤概率×(1-x)")全库零消费方→装备减伤宣称静默失效,此处接入掷骰
    var gearInjuryCut = 0;
    try {
      if (typeof getEquippedInstance === "function" && typeof getItemById === "function") {
        var _slots = ["head", "body", "feet", "hand", "accessory"];
        for (var _gi = 0; _gi < _slots.length; _gi++) {
          var _inst = getEquippedInstance(state, _slots[_gi]);
          var _def = _inst && _inst.itemId ? getItemById(_inst.itemId) : null;
          if (_def && _def.effects && isFinite(_def.effects.injuryReduction))
            gearInjuryCut += _def.effects.injuryReduction;
        }
      }
      if (state.equipmentSuites) {
        for (var _sid in state.equipmentSuites) {
          var _sr = state.equipmentSuites[_sid];
          var _se = _sr && _sr.achievedTier && _sr.achievedTier.effects;
          if (_se && isFinite(_se.injuryReduction))
            gearInjuryCut += _se.injuryReduction;
        }
      }
    } catch (e) { gearInjuryCut = 0; }
    gearInjuryCut = Math.min(0.8, Math.max(0, gearInjuryCut)); // cap 80%，保底仍有风险
    if (
      job.risk.injury &&
      Random.chance(Math.min(1, job.risk.injury * riskMod * certReduction * (1 - gearInjuryCut)))
    ) {
      state.status.injured = true;
      state.status.health = Math.max(0, state.status.health - 15);
      state.flags._everInjured = true; // 成就追踪
      StateManager.addMessage(
        "🤕 工作中受伤了！健康-15。建议去医院看看。",
        "danger",
      );
    }
    if (
      job.risk.illness &&
      Random.chance(Math.min(1, (job.risk.illness || 0) * riskMod))
    ) {
      state.status.health = Math.max(0, state.status.health - 10);
      // v3.1：工作环境致病走illness.js疾病系统（不再直接设sick=true）
      if (typeof triggerIllness === "function") {
        triggerIllness(state, "cold", "job");
      } else {
        state.status.sick = true;
      }
      StateManager.addMessage(
        "🤒 你生病了！健康-10。注意休息或去医院。",
        "danger",
      );
    }
  }

  // === 工作后技能经验分发（技能→行动联动） ===
  var skillXpMsg = "";
  if (typeof grantJobSkillXp === "function") {
    skillXpMsg = grantJobSkillXp(job.id, state);
  }
  // === 工作后微量属性增长 ===
  var statGainMsg = "";
  if (typeof grantActionStatGain === "function") {
    statGainMsg = grantActionStatGain(job.id, state);
  }

  StateManager.addMessage(
    `💰 ${job.name}完成，赚了 ¥${pay}。` +
      (skillXpMsg ? " " + skillXpMsg : "") +
      (statGainMsg ? " " + statGainMsg : ""),
    "success",
  );

  // ====== v3.25: 打工人情境叙事 ======
  if (typeof generateWorkFlavorText === "function") {
    var flavorText = generateWorkFlavorText(state, job);
    if (flavorText) {
      StateManager.addMessage(flavorText, "info");
    }
  }

  // ====== Phase 2: 工作后风声感知 ======
  if (typeof checkRumorFromWork === "function") {
    checkRumorFromWork(state);
  }

  // 疾病-工作交互：跟踪工作对疾病风险的影响
  if (typeof trackJobDiseaseRisk === "function") {
    trackJobDiseaseRisk(job.id, state);
  }

  // === v3.5 装备耐久消耗（工作消耗耐久）===
  if (typeof consumeEquipmentDurability === "function") {
    // 街头工作消耗较多，职场工作消耗较少
    var actionType = "street_job";
    consumeEquipmentDurability(state, actionType, 1.0);
  }

  // v3.1 第39轮：工作后获取街坊声望
  gainRepFromWork(state, job);

  // v3.6: 约定式触发槽（after_work 时机）
  if (window.TriggerRegistry && state.player && state.player.day >= 7) {
    try {
      var workEvent = window.TriggerRegistry.triggerRandom("after_work", state);
      if (workEvent) {
        state._pendingEvent = workEvent;
        state._pendingEventId = workEvent.id;
        setTimeout(function () {
          var s = StateManager.getState();
          if (s._pendingEvent && s._pendingEventId === workEvent.id) {
            if (typeof showEventModal === "function") showEventModal(workEvent);
          }
        }, 50);
      }
    } catch (e) {
      console.warn("TriggerRegistry after_work 触发失败:", e);
    }
  }

  // ====== 连续工作天数追踪（全局 Work Streak）======
  // 在 doStreetJob 末尾记录，用于 daily_pipeline 的连续工作奖励判断
  if (!state.flags._workStreak) state.flags._workStreak = 0;
  if (!state.flags._lastWorkDay) state.flags._lastWorkDay = 0;
  if (state.flags._lastWorkDay === state.player.day - 1) {
    state.flags._workStreak = (state.flags._workStreak || 0) + 1;
  } else if (state.flags._lastWorkDay !== state.player.day) {
    state.flags._workStreak = 1;
  }
  state.flags._lastWorkDay = state.player.day;
  state.flags._workedToday = true; // 标记今日已工作，供 pipeline 检测
  // [全系统自洽修复] 域A A类#5: 记录最近一次街头工作ID（供 tickManualLaborDays 判断体力劳动）
  if (job && job.id) state.flags._lastStreetJobId = job.id;
}

/**
 * 在 doStreetJob 工作后获取声望增益
 * 在 doStreetJob 末尾调用，根据当前工作地点增加声望
 */
function gainRepFromWork(state, job) {
  if (typeof gainReputation !== "function") return;
  var locKey = state.trade && state.trade.currentLocation;
  if (!locKey) return;
  if (!job || !job.location) return;
  // 给当前地点 +1 声望
  gainReputation(state, locKey, 1, "工作");
  // 如果工作地点与当前地点一致，额外 +0.5
  if (job.location === locKey) {
    gainReputation(state, locKey, 0.5, "本行工作");
  }
}

// [全系统自洽修复] 域C 联动: 天赋XP倍率接入addSkillXp(使skill_tree定义的cookingXpMult/codingXpMult等真正生效)
function getTalentXpMultiplier(skillKey, state) {
  if (!state || !state.talentNodes || typeof getSkillBranchDef === "undefined") return 1.0;
  var _mult = 1.0;
  var _branches = getSkillBranchDef(skillKey);
  for (var bi = 0; bi < _branches.length; bi++) {
    var _nodes = _branches[bi].talentNodes || [];
    for (var ni = 0; ni < _nodes.length; ni++) {
      var _n = _nodes[ni];
      if (!state.talentNodes[_n.id] || !_n.effects) continue;
      // 兼容旧字段名: cookingXpMult / codingXpMult 等 → 统一读取
      var _xpMult = _n.effects.xpMult || _n.effects[skillKey + "XpMult"];
      if (typeof _xpMult === "number" && _xpMult > 0) {
        _mult *= _xpMult;
      }
    }
  }
  return _mult;
}

function addSkillXp(skillKey, amount) {
  if (!amount || amount <= 0) return;
  const state = StateManager.getState();
  const skill = state.skills[skillKey];
  if (!skill) return;
  // [域C联动] 天赋XP倍率生效
  var _talentMult = getTalentXpMultiplier(skillKey, state);
  // [全系统自洽修复] 域A R242: 证书技能XP加成生效(_certSkillXpBonus 由考证时写入,此前 cookingXpBonus 等键全库零消费者)
  var _certXpBonus =
    (state.flags &&
      state.flags._certSkillXpBonus &&
      state.flags._certSkillXpBonus[skillKey]) ||
    0;
  // [R712 域G 联动增强 G→C]: 年龄阶段技能效率变化
  // 青年(≤25)体力技能快,中年(26-40)均衡,中老年(41-50)脑力快,老年(>50)经验类加成
  var _age = (state.player && state.player.age) || 20;
  var _ageSkillMult = 1.0;
  var _physicalSkills = ["welding", "repair", "electrician", "driving"];
  var _mentalSkills = ["coding", "accounting", "management", "english", "sales"];
  if (_age <= 25) {
    // 青年: 体力技能+15%, 脑力技能-5%
    if (_physicalSkills.indexOf(skillKey) !== -1) _ageSkillMult = 1.15;
    else if (_mentalSkills.indexOf(skillKey) !== -1) _ageSkillMult = 0.95;
  } else if (_age <= 40) {
    // 中年: 均衡期, 所有技能+5%
    _ageSkillMult = 1.05;
  } else if (_age <= 55) {
    // 中老年: 脑力技能+15%, 体力技能-10%
    if (_mentalSkills.indexOf(skillKey) !== -1) _ageSkillMult = 1.15;
    else if (_physicalSkills.indexOf(skillKey) !== -1) _ageSkillMult = 0.90;
  } else {
    // 老年: 经验类(管理/会计/销售)+20%, 体力-20%
    if (skillKey === "management" || skillKey === "accounting" || skillKey === "sales") _ageSkillMult = 1.20;
    else if (_physicalSkills.indexOf(skillKey) !== -1) _ageSkillMult = 0.80;
  }
  // [全系统自洽修复] 域A R770b 修复: HOUSING_TIERS tier5/6 effects.skillStudyBonus(别墅+10%/豪宅+20%书房学习加成)全库零应用器,¥50000/¥200000高价住房承诺静默失效→单点接线
  var _housingStudyMult = 1.0;
  try {
    if (typeof getCurrentHousing === "function") {
      var _house = getCurrentHousing(state);
      if (_house && _house.effects && typeof _house.effects.skillStudyBonus === "number" && isFinite(_house.effects.skillStudyBonus)) {
        _housingStudyMult = 1 + Math.max(0, Math.min(0.5, _house.effects.skillStudyBonus));
      }
    }
  } catch (e) {}
  skill.xp += Math.round(amount * _talentMult * (1 + _certXpBonus) * _ageSkillMult * _housingStudyMult);
  // v3.1 审查改进：XP 需求从线性改为指数，level 0=120 → level 50≈10,000（之前 6,120）
  // 让玩家在高级别感受更有意义的成长压力，同时保留早期快速升级的爽快感
  var xpNeeded = Math.floor(
    (skill.level + 1) * 120 * Math.pow(1.01, skill.level),
  );
  // 支持连续升级
  while (skill.xp >= xpNeeded && skill.level < 100) {
    skill.level++;
    skill.xp -= xpNeeded;
    state.flags._firstSkillUpgraded = true; // 成就：第一次技能升级
    xpNeeded = Math.floor(
      (skill.level + 1) * 120 * Math.pow(1.01, skill.level),
    );
    // 升级时提升关联属性
    if (typeof applySkillLevelUpBonus === "function") {
      applySkillLevelUpBonus(skillKey, state);
    }
    StateManager.addMessage(
      "⭐ " + getSkillName(skillKey) + "升级到 Lv." + skill.level + "！",
      "success",
    );
  }
}

function getSkillName(key) {
  const names = {
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
    medicine: "医学",
    social: "社交",
  };
  return names[key] || key;
}

/** v3.99 (loop R3)：技能注册表补全 — 旧存档/读档后缺失 medicine/social 时自动补 */
function ensureSkillRegistry(state) {
  if (!state || !state.skills) return;
  var required = ["medicine", "social"];
  for (var i = 0; i < required.length; i++) {
    var key = required[i];
    if (!state.skills[key]) {
      state.skills[key] = { level: 0, xp: 0 };
    }
  }
}

/**
 * 技能加权收入倍率
 * 根据工作类型，玩家相关技能等级会提升收入。
 * 每10级技能提升约5%收入，上限+50%（Lv.100）。
 * 减少纯RNG依赖，奖励技能投资。
 */
function getSkillPayBonus(jobId, state) {
  const s = state.skills;
  const skillMap = {
    // 维修类 -> repair 技能
    repair_service: { key: "repair", weight: 1.0 },
    skilled_labor_construction: { key: "repair", weight: 0.6 },
    // 摆摊/销售类 -> sales 技能
    street_vending_food: { key: "sales", weight: 0.8 },
    street_vending_goods: { key: "sales", weight: 1.0 },
    food_stall: { key: "cooking", weight: 0.9 },
    // 配送类 -> agility
    delivery_rider: { key: "agility", weight: 0.7 },
    package_delivery: { key: "agility", weight: 0.6 },
    // 仓库/体力类 -> physique
    warehouse_worker: { key: "physique", weight: 0.5 },
    manual_labor_construction: { key: "physique", weight: 0.6 },
    factory_work_assembly: { key: "physique", weight: 0.5 },
    // 保安 -> physique
    security_guard: { key: "physique", weight: 0.3 },
    // 理发 -> repair(手艺)
    barber: { key: "repair", weight: 0.5 },
    // 清洁 -> physique
    cleaning_service: { key: "physique", weight: 0.3 },
    // 家教 -> intelligence
    tutoring: { key: "intelligence", weight: 0.8 },
    // 表演 -> sales(吸引打赏)
    street_performer: { key: "sales", weight: 0.5 },
  };

  const mapping = skillMap[jobId];
  if (!mapping) return 1.0;

  // 兼容属性键和技能键
  let effectiveLevel = 0;
  const attrKeys = ["physique", "intelligence", "agility", "mental"];
  if (attrKeys.includes(mapping.key)) {
    effectiveLevel = state.player[mapping.key] || 0;
  } else if (s[mapping.key]) {
    effectiveLevel = s[mapping.key].level || 0;
  }

  // 每10级 +5%收入，权重调节
  const bonus = (effectiveLevel / 10) * 0.05 * mapping.weight;
  return 1.0 + Math.max(0, Math.min(0.35, bonus));
}

// ====== 时间推进 (AP 行动力系统) ======

/** 消耗行动力，推进时间。每次行动调用此函数替代旧的 advanceTimeSlot() */
function consumeAP(cost) {
  const state = StateManager.getState();
  // === 极端状态检测（健康归零等，在任何 AP 消耗之前）===
  if (typeof checkExtremeConditions === "function") {
    var extremeResult = checkExtremeConditions(state);
    if (extremeResult === "game_over" || extremeResult === "skip_day") {
      renderAll();
      return false;
    }
  }
  // === 临界状态强制选择窗（在任何 AP 消耗之前）===
  // 弹窗后中断本次行动，玩家选完会重新点击行动按钮
  if (typeof checkCriticalNeeds === "function" && checkCriticalNeeds(state)) {
    return false;
  }
  // 应用状态互联AP消耗倍率（饥饿/疲劳/伤病→效率降低→多耗AP）
  var actualCost = cost;
  if (typeof getApCostMultiplier === "function") {
    actualCost = Math.round(cost * getApCostMultiplier(state));
  }
  // [全系统自洽修复] 域G R240 A类修复: 防止NaN传播导致游戏软锁（AP=NaN → endDay永不触发）
  if (isNaN(actualCost) || !isFinite(actualCost) || actualCost < 0) {
    actualCost = cost;
  }
  // [全系统自洽修复] 域G R240 A类修复: actionPoints 自身也需守卫（旧存档/损坏状态→NaN→永久软锁）
  var _ap = (typeof state.player.actionPoints === "number" && isFinite(state.player.actionPoints)) ? state.player.actionPoints : 0;
  state.player.actionPoints = Math.max(0, _ap - actualCost);

  // 更新显示用的时段
  // [全系统自洽修复] 域G A类#3: maxActionPoints 可能为0/NaN（旧存档/数据异常），兜底防除零
  var _maxAp = (typeof state.player.maxActionPoints === "number" && isFinite(state.player.maxActionPoints) && state.player.maxActionPoints > 0) ? state.player.maxActionPoints : 100;
  const pct = state.player.actionPoints / _maxAp;
  if (pct > 0.66) state.player.timeSlot = "morning";
  else if (pct > 0.33) state.player.timeSlot = "afternoon";
  else state.player.timeSlot = "evening";

  // Per-action 随机事件判定 (4%基础概率，v3.1 审查：降低通知疲劳)
  if (!state._pendingEvent) {
    const phase = state.player.phase === "corporate" ? "corporate" : "street";
    if (Random.chance(0.04)) {
      if (typeof queueRandomEvent === "function")
        queueRandomEvent(state, phase);
    }
  }

  // 道德事件判定（基础5% + NG+ 道德罗盘/业力加成）
  if (!state._pendingEvent && typeof triggerMoralEvent === "function") {
    var moralRate = 0.05;
    moralRate +=
      (state.inheritanceBonuses && state.inheritanceBonuses.moralEventRate) ||
      0;
    if (Random.chance(moralRate)) {
      triggerMoralEvent(state);
    }
  }

  // 低行动力警告（≤20 且 > 0）
  if (state.player.actionPoints > 0 && state.player.actionPoints <= 20) {
    StateManager.addMessage(
      `⚠️ 仅剩 ${state.player.actionPoints} 点行动力！即将结束今天。`,
      "warning",
    );
  }

  // 行动力耗尽 → 结束一天
  if (state.player.actionPoints <= 0) {
    endDay();
  }
}

/** 旧API兼容别名 */
function advanceTimeSlot() {
  consumeAP(33); // 保持旧的3时段行为
}

/**
 * 约定式自动归类：消耗格式化
 * 任何消耗资源的操作，在 StateManager.addMessage 中必须附加此函数的结果。
 * 约定：所有消耗 ⚡AP / 💰现金 / 📦物品 的操作，消息末尾必须包含 (-⚡N -💰¥N) 格式。
 *
 * 用法：
 *   StateManager.addMessage("🚶 步行前往XX" + costStr({ap: 15}), "info");
 *   StateManager.addMessage("🚕 打车前往XX" + costStr({ap: 3, cash: 25}), "info");
 *
 * 扩展：如需新增消耗类型，在 parts.push 中添加对应分支即可。
 */
function costStr(costs) {
  if (!costs) return "";
  var parts = [];
  if (typeof costs.ap === "number" && costs.ap > 0) parts.push("-⚡" + costs.ap);
  if (typeof costs.cash === "number" && costs.cash > 0) parts.push("-💰¥" + costs.cash);
  return parts.length > 0 ? "（" + parts.join(" ") + "）" : "";
}

// endDay 和 settleDailyFinance 已迁移至 js/phase1/daily_pipeline.js
// 管线声明式架构：新增结算步骤只需 push {name, fn} 到 DAILY_PIPELINE 数组

// ============================================================
// "下一步目标" 系统 — P0 玩家方向感 (v3.1 审查改进)
// 设计参考：《大多数》"下一步" / 《星露谷》小电视 / 《大多数》进度条
// ============================================================

/** 获取当前最相关的 1-3 个短期目标 */
function getNextGoals(state) {
  const goals = [];
  const r = state.resources || {};
  const n = state.needs || {};
  const sk = state.skills || {};
  const p = state.player || {};
  const s = state.startup || {};
  const day = p.day || 1;

  // 紧急：生存需求
  if (n.hunger < 15)
    goals.push({ title: "🍚 吃饭", desc: "快饿死了", priority: 100 });
  if (n.fatigue > 95)
    goals.push({ title: "😴 休息", desc: "极度疲惫", priority: 100 });
  if (n.hygiene < 10)
    goals.push({ title: "🚿 洗澡", desc: "太脏了", priority: 100 });

  const cash = r.cash || 0;
  const debt = (r.villageDebt || 0) + (r.fineDebt || 0) + (r.bankDebt || 0);
  const hasInvestment = !!state.investment?.stockHoldings?.length;

  // 街头阶段
  if (p.phase === "street") {
    if (cash < 100)
      goals.push({
        title: "💰 第一桶金",
        desc: "先赚¥200活下去",
        priority: 90,
      });
    else if (cash < 300)
      goals.push({
        title: "💼 找稳定工作",
        desc: `攒¥${300 - cash}`,
        priority: 85,
      });
    if (debt > 500)
      goals.push({
        title: "💸 还债",
        desc: `债¥${debt.toLocaleString()}（日息0.35%）`,
        priority: 80,
      });
    if (state.housing?.tier === 0)
      goals.push({
        title: "🏠 找个住处",
        desc: "去城中村租个床位",
        priority: 80,
      });

    if (cash >= 1000 && !hasInvestment)
      goals.push({ title: "📈 试试投资", desc: "去科技园投资", priority: 50 });

    // 最高技能
    let best = { key: "cooking", level: 0 };
    for (const k in sk)
      if (sk[k]?.level > best.level) best = { key: k, level: sk[k].level };
    if (best.level < 30)
      goals.push({
        title: `📚 ${getSkillName(best.key)}`,
        desc: `Lv.${best.level}→30`,
        priority: 60,
      });
    else if (best.level < 50)
      goals.push({
        title: `📚 ${getSkillName(best.key)}`,
        desc: `Lv.${best.level}→50`,
        priority: 55,
      });

    const intel = p.intelligence || 20;
    const earned = r.totalEarned || 0;
    if (
      (intel >= 45 || (day >= 200 && earned > 5000)) &&
      !state.flags?._corpPhaseUnlocked
    ) {
      goals.push({
        title: "💼 准备进职场",
        desc: "去科技园应聘",
        priority: 70,
      });
    }
    // [全系统自洽修复] 域G A类修复: 原条件 `!s.status && s.status !== "none"` 逻辑矛盾（createDefaultState 默认值 "none" 永假）→ 创业目标从未触发
    if (cash + r.bankBalance >= 30000 && (!s.status || s.status === "none")) {
      goals.push({ title: "🚀 考虑创业", desc: "去科技园注册", priority: 60 });
    }
  }

  // 职场阶段
  if (p.phase === "corporate") {
    goals.push({
      title: "📈 职级晋升",
      desc: `当前${state.corporate?.rank || "P5"}`,
      priority: 60,
    });
    if (cash + r.bankBalance < 50000)
      goals.push({
        title: "💰 存钱",
        desc: `攒¥${50000 - (cash + r.bankBalance)}`,
        priority: 55,
      });
    if (cash + r.bankBalance >= 50000 && (!s.status || s.status === "none")) {
      goals.push({ title: "🚀 创业", desc: "注册自己的公司", priority: 55 });
    }
  }

  // 全局
  if (hasInvestment) {
    const v =
      state.investment?.stockHoldings?.reduce((a, h) => {
        const m = state.investment?.stockMarket?.[h.symbol];
        return a + (m ? m.price * h.shares : 0);
      }, 0) || 0;
    if (v > 0)
      goals.push({
        title: "📊 投资表现",
        desc: `持仓¥${v.toLocaleString()}`,
        priority: 40,
      });
  }
  if (s.status && s.status !== "none" && s.status !== "exited") {
    goals.push({ title: "🏢 公司发展", desc: `${s.status}阶段`, priority: 50 });
  }

  // 场景专属
  const sc = state.flags?._currentScenario;
  if (sc === "laid_off" && p.phase === "street")
    goals.push({ title: "📋 重新就业", desc: "找到新工作", priority: 95 });
  else if (sc === "small_town_grinder" && p.phase === "street")
    goals.push({ title: "📚 投资大脑", desc: "提升技能", priority: 80 });
  else if (sc === "foreign_worker" && p.phase === "street")
    goals.push({ title: "💪 站稳脚跟", desc: "熟悉城市", priority: 80 });
  else if (sc === "second_gen" && p.phase === "street")
    goals.push({ title: "🎯 证明自己", desc: "靠本事", priority: 80 });
  else if (sc === "midlife_crisis" && p.phase === "street")
    goals.push({ title: "🔄 技能重塑", desc: "不被年轻人替代", priority: 85 });
  else if (sc === "fresh_grad" && p.phase === "street")
    goals.push({ title: "📋 职场起步", desc: "第一份正式工作", priority: 85 });

  return goals.sort((a, b) => b.priority - a.priority).slice(0, 3);
}

function renderWhatsNext(state) {
  const goals = getNextGoals(state);
  const container = document.getElementById("whats-next-panel");
  if (!container) return;
  if (!goals.length) {
    container.innerHTML = "";
    return;
  }
  container.innerHTML = goals
    .map(
      (
        g,
      ) => `<div class="whats-next-item" style="padding:3px 0;font-size:11px;">
        <span style="font-weight:600;">${g.title}</span>
        <span style="color:var(--text-muted);">${g.desc}</span>
      </div>`,
    )
    .join("");
}

function checkDebtCeiling(state) {
  const debt =
    (state.resources?.villageDebt || 0) + (state.resources?.fineDebt || 0) + (state.resources?.bankDebt || 0);
  if (debt < 2000) return;
  const history = state.history?.income || [];
  const recent = history.slice(-7);
  const avg =
    recent.length > 0 ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
  const ratio = avg > 0 ? debt / (avg * 30) : Infinity;
  if (ratio > 2 && !state.flags._debtCeilingWarned) {
    StateManager.addMessage(
      `⚠️ 债务已达月收入的${ratio.toFixed(1)}倍，利滚利正在吞噬现金流。建议优先还债。`,
      "danger",
    );
    state.flags._debtCeilingWarned = true;
    state.flags._debtCeilingWarnedDay = state.player.day;
  }
  if (
    ratio > 5 &&
    state.player.day - (state.flags._debtCeilingWarnedDay || 0) > 7
  ) {
    StateManager.addMessage("⚠️ 债务滚雪球失控！必须立刻还债。", "danger");
    state.flags._debtCeilingWarnedDay = state.player.day;
  }
}

function triggerRandomEvent(state) {
  const events = [
    { text: "街头有人发传单，给了你一张优惠券", type: "info" },
    { text: "路边有人在摆摊，生意好像不错", type: "info" },
    { text: "天气突然变冷，街上的行人少了", type: "info" },
    { text: "邻居抱怨最近废品价格又跌了", type: "warning" },
  ];
  const evt = Random.fromArray(events);
  StateManager.addMessage(`📰 ${evt.text}`, evt.type);
}

// === v3.4: 约定式触发注册表初始化 ===
(function () {
  if (
    typeof window.TriggerRegistry !== "undefined" &&
    typeof RANDOM_EVENTS !== "undefined"
  ) {
    window.TriggerRegistry.loadAll();
    console.log(
      "[TriggerRegistry] 已加载 " +
        RANDOM_EVENTS.filter(function (e) {
          return Array.isArray(e.triggers);
        }).length +
        " 个约定式事件",
    );
  }
})();

// P1-1 注册 MORAL_EVENTS 和 NEWS_EVENTS 到 RANDOM_EVENTS 统一池
if (typeof registerMoralEventsToPool === "function") registerMoralEventsToPool();
if (typeof registerNewsEventsToPool === "function") registerNewsEventsToPool();
// [R135] 域G 联动增强
// [R167] 域G 联动增强
// [R199] 域G 联动增强
// [R223] 域G 联动增强
// [R247] 域G 联动增强
// [R271] 域G
// [R295] 域G
// [R319] 域G
// [R343] 域G
// [R367] 域G
// [R391] 域G
// [R415] 域G
// [R439] 域G
// [R463] 域G
// [R487] 域G
// [R511] 域G
// [R535] 域G
// [R559] 域G
// [R583] 域G
// [R607] 域G

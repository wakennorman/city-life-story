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
 * 投资持仓→NPC态度语境对话（P1.6）
 * 根据玩家当前的财富/投资状况，为特定NPC生成对应的台词。
 * 返回string时替换随机talkLine；返回null时使用默认台词。
 */
function getInvestmentContextLine(npcId, state) {
  var inv = state.investment || {};
  var cash = (state.resources && state.resources.cash) || 0;
  var bank = (state.resources && state.resources.bankBalance) || 0;
  var holdings = inv.stockHoldings || [];
  var props = inv.properties || [];
  var btc = inv.btcHoldings || 0;
  var totalStockValue = 0;
  if (holdings.length && inv.stockMarket) {
    holdings.forEach(function (h) {
      var m = inv.stockMarket[h.symbol];
      totalStockValue += (m ? m.price : 0) * h.shares;
    });
  }

  if (npcId === "aunt_wang") {
    // 王大婶关注租房/房产
    if (props.length > 0)
      return "哎哟，你还买了房子出租啊！现在年轻人真厉害，比我家那口子强多了。";
    if (cash + bank > 50000)
      return "看你最近出手大方，是不是发财了？别光顾着存钱，也要注意身体！";
    if (cash < 500)
      return "小伙子，这个月房租先缓缓？看你最近有点难，王大婶不是那种人。";
    return null;
  }

  if (npcId === "old_zhou") {
    // 老周关注废品/金属市场
    var hasMetals =
      inv.stockMarket &&
      (inv.stockMarket["COPPER"] || inv.stockMarket["NICKEL"]);
    if (
      hasMetals &&
      inv.stockMarket["COPPER"] &&
      inv.stockMarket["COPPER"].price > 0.07
    ) {
      return "铜价最近涨了不少！你知道不？废铜现在比废铁值钱，多留意！";
    }
    if (totalStockValue > 10000)
      return "哟，你也玩股票？比我聪明多了，我那些钱都压在废品站了。";
    return null;
  }

  if (npcId === "sister_zhang") {
    // 张姐关注职业发展/收入
    if (totalStockValue > 50000)
      return "我听说你在股市里赚了不少？早点财务自由，别浪费你这个脑子。";
    if (bank > 20000)
      return "有存款在银行，说明你有规划！这样的人进职场肯定吃香，我帮你留意着呢。";
    if (props.length > 0)
      return "有房有产，还来这里打工？你是想体验生活还是真需要这份收入？";
    return null;
  }

  if (npcId === "boss_li") {
    // 李工头关注体力/施工
    if (cash + bank > 100000)
      return "你现在有钱了，怎么还来工地干活？闲不住还是真喜欢？";
    if (props.length > 0)
      return "买了房子？现在工地上买房的工人可少了，你算一个有出息的！";
    return null;
  }

  if (npcId === "xiao_mei") {
    // 小美关注科技/编程/学习
    if (inv.stockMarket && inv.stockMarket["NVDA"]) {
      var nvdaPrice = inv.stockMarket["NVDA"].price;
      if (nvdaPrice > 1000)
        return "恩威达又创新高了！搞AI的都赚翻了，我都后悔没早买股票。";
    }
    if (btc > 0.01) return "你也持有比特币？！跌的时候心态好吗，我看着就害怕……";
    if (bank > 30000)
      return "哇你存款好多！我毕业两年了才存了不到两万，差距好大……";
    return null;
  }

  if (npcId === "chef_chen") {
    // 陈师傅关注饮食/餐饮行业
    if (props.length > 0)
      return "有房产出租？以后考虑开个餐厅，比租房子利润高多了！";
    if (cash > 30000) return "你手里有钱，有没有想过投资餐饮？我这里有个店面……";
    return null;
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
  if (job.requiredFlag && !state.flags[job.requiredFlag])
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

/** 估算工作收入 */
function estimateJobPay(job, state) {
  // 模拟3次取平均
  let total = 0;
  for (let i = 0; i < 10; i++) {
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
    if (typeof getNewsJobMultiplier === "function") {
      pay = Math.floor(pay * getNewsJobMultiplier(job.id, state));
    }
    total += pay;
  }
  return Math.floor(total / 10);
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

  return { estimated: base, tags: tags };
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
        loadSection.innerHTML =
          '<button id="btn-load-latest" class="btn btn-lg">📂 继续游戏' +
          modeTag +
          " (第" +
          latest.day +
          "天, ¥" +
          (latest.cash ? latest.cash.toLocaleString() : 0) +
          ")</button>" +
          '<button id="btn-load-menu" class="btn btn-sm" style="margin-top:8px;">📋 选择存档...</button>';
        document.getElementById("btn-load-latest").onclick = function () {
          loadExistingGame(latest.slot);
        };
        document.getElementById("btn-load-menu").onclick = function () {
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
    (s.resources.cash >= 5000 ? "var(--success)" : "") +
    '">¥' +
    s.resources.cash.toLocaleString() +
    "</span></div>";
  if (s.resources.bankBalance > 0) {
    resourceLines +=
      '<div class="scenario-detail-stat"><span class="scenario-detail-stat-label">🏦 存款</span><span class="scenario-detail-stat-val" style="color:var(--success)">¥' +
      s.resources.bankBalance.toLocaleString() +
      "</span></div>";
  }
  if ((s.resources.villageDebt || 0) + (s.resources.bankDebt || 0) > 0) {
    resourceLines +=
      '<div class="scenario-detail-stat"><span class="scenario-detail-stat-label">💸 负债</span><span class="scenario-detail-stat-val" style="color:var(--danger)">¥' +
      (
        (s.resources.villageDebt || 0) + (s.resources.bankDebt || 0)
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
    (scenario.resources.villageDebt || 0) + (scenario.resources.bankDebt || 0);
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
    state.needs.hunger = scenario.needs.hunger || 70;
    state.needs.fatigue = scenario.needs.fatigue || 15;
    state.needs.hygiene = scenario.needs.hygiene || 75;
    state.needs.happiness = scenario.needs.happiness || 55;
  }

  // --- 健康 ---
  state.status.health = scenario.health || 100;

  // --- 住所 ---
  state.housing.tier = scenario.housingTier || 0;
  state.housing.rentedDay = state.player.day;
  state.inventory.capacity = [20, 50, 100, 200][state.housing.tier || 0];

  // --- 起始地点 ---
  if (scenario.startLocation) {
    state.trade.currentLocation = scenario.startLocation;
  }

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
      for (var effKey in evt.effects) {
        if (
          evt.effects.hasOwnProperty(effKey) &&
          typeof state.player[effKey] === "number"
        ) {
          state.player[effKey] = Math.max(
            0,
            Math.min(100, state.player[effKey] + evt.effects[effKey]),
          );
        }
      }
    }
  }

  // === v3.0 P2-B-2 + P2-E-1：难度系统 + 传承币解锁（仅在玩家选择后生效）===
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

  // --- 进入游戏 ---
  document.getElementById("mode-select-screen").style.display = "none";
  document.getElementById("scenario-select-screen").style.display = "none";
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("sandbox-screen").style.display = "none";
  document.getElementById("app").style.display = "";
  gameStarted = true;
  renderAll();
  if (typeof initCashCarousel === "function") initCashCarousel();
  if (typeof startTutorial === "function") {
    setTimeout(function () {
      startTutorial();
    }, 300);
  }

  // v3.2: 强制选择人生目标（不可跳过）
  setTimeout(function () {
    if (typeof showForcedDreamModal === "function") {
      showForcedDreamModal();
    }
  }, 500);
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
  state.resources.debt = (cfg.villageDebt || 0) + (cfg.bankDebt || 0);
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

  // --- 健康 ---
  state.status.health = cfg.health || 100;

  // --- 住所 ---
  state.housing.tier = Math.max(0, Math.min(3, cfg.housingTier || 0));
  state.housing.rentedDay = state.player.day;
  state.inventory.capacity = [20, 50, 100, 200][state.housing.tier || 0];

  // --- 起始地点 ---
  if (cfg.startLocation) {
    state.trade.currentLocation = cfg.startLocation;
  }

  // --- 需求 ---
  state.needs.hunger = 70;
  state.needs.fatigue = 15;
  state.needs.hygiene = 75;
  state.needs.happiness = 55;

  // --- 沙盒标记 ---
  state.flags._isSandboxMode = true;

  // --- 企业命运 ---
  if (typeof initEnterpriseFate === "function") {
    initEnterpriseFate(state);
  }

  StateManager.addMessage(
    "⚙️ 沙盒模式开始！你自定义了开局条件。" +
      (cfg.villageDebt > 0
        ? "欠村长¥" + cfg.villageDebt.toLocaleString() + "，日息0.35%。"
        : ""),
    "event",
  );
  StateManager.addMessage('💡 提示：点击"🗺️ 地图"标签可查看城市全景。', "info");

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
  document.getElementById("app").style.display = "";
  gameStarted = true;
  renderAll();
  if (typeof initCashCarousel === "function") initCashCarousel();
  if (typeof startTutorial === "function") {
    setTimeout(function () {
      startTutorial();
    }, 300);
  }

  // v3.2: 强制选择人生目标（不可跳过）
  setTimeout(function () {
    if (typeof showForcedDreamModal === "function") {
      showForcedDreamModal();
    }
  }, 500);
}

function startNewGame() {
  StateManager.newGame();
  initializePrices();

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

  // 初始化装备耐久度
  if (typeof initEquipmentDurability === "function") {
    initEquipmentDurability(StateManager.getState());
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
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("mode-select-screen").style.display = "none";
  document.getElementById("scenario-select-screen").style.display = "none";
  document.getElementById("sandbox-screen").style.display = "none";
  document.getElementById("app").style.display = "";
  gameStarted = true;
  renderAll();
  if (typeof initCashCarousel === "function") initCashCarousel();

  // 新手引导（首次游戏）
  if (typeof startTutorial === "function") {
    setTimeout(() => startTutorial(), 300);
  }

  // v3.2: 强制选择人生目标（不可跳过）
  setTimeout(function () {
    if (typeof showForcedDreamModal === "function") {
      showForcedDreamModal();
    }
  }, 500);
}

function loadExistingGame(slot) {
  const saveData = loadGame(slot);
  if (saveData) {
    // 显示读档回忆文案（P1 - 存档快照）
    if (saveData._snapshot && typeof getLoadMemoryText === "function") {
      var memoryText = getLoadMemoryText(saveData._snapshot);
      if (memoryText) {
        StateManager.addMessage("📖 读档记忆：" + memoryText, "event");
      }
    }
    StateManager.importState(saveData);
    // 兼容旧存档：初始化企业命运系统
    if (typeof initEnterpriseFate === "function") {
      initEnterpriseFate(StateManager.getState());
    }
    // 兼容旧存档：初始化装备耐久度
    if (typeof initEquipmentDurability === "function") {
      initEquipmentDurability(StateManager.getState());
    }
    StateManager.addMessage("📂 存档已加载，欢迎回来！", "info");
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("app").style.display = "";
    gameStarted = true;
    renderAll();
    if (typeof initCashCarousel === "function") initCashCarousel();
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
      (s1.resources.villageDebt || 0) + (s1.resources.bankDebt || 0),
      (s2.resources.villageDebt || 0) + (s2.resources.bankDebt || 0),
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
      diffVal("KPI", s1.corporate?.kpi || 0, s2.corporate?.kpi || 0) +
      diffVal("能力", s1.corporate?.ability || 0, s2.corporate?.ability || 0) +
      diffVal("尊严", s1.corporate?.dignity || 0, s2.corporate?.dignity || 0) +
      diffVal(
        "人缘",
        s1.corporate?.popularity || 0,
        s2.corporate?.popularity || 0,
      ) +
      diffVal(
        "向上管理",
        s1.corporate?.upwardMgmt || 0,
        s2.corporate?.upwardMgmt || 0,
      ) +
      diffVal("风险", s1.corporate?.risk || 0, s2.corporate?.risk || 0) +
      diffVal("发量", s1.corporate?.hair || 100, s2.corporate?.hair || 100);
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
      var clickHandler = _compareMode
        ? "selectForCompare('" + s.slot + "')"
        : "document.querySelector('.modal-overlay')?.remove();loadExistingGame('" +
          s.slot +
          "')";
      var borderStyle = isSelected
        ? "border:2px solid var(--accent);"
        : "border:1px solid var(--border);";

      bodyHtml +=
        '<div style="padding:10px;margin:4px 0;background:var(--bg-card);border-radius:4px;cursor:pointer;transition:all 0.2s;' +
        borderStyle +
        '"' +
        " onmouseover=\"this.style.borderColor='var(--accent)'\" onmouseout=\"this.style.borderColor='" +
        (_compareMode ? "var(--accent)" : "var(--border)") +
        "'\"" +
        ' onclick="' +
        clickHandler +
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
        name: job.name,
        desc: job.desc + footfallLabel,
        icon: job.icon,
        payEstimate: payEstimate
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
          (job.startupCost && state.resources.cash < job.startupCost
            ? `启动资金不足(需¥${job.startupCost})`
            : null) ||
          null,
        handler: () => {
          const finalReq = checkJobRequirements(job, state);
          if (finalReq) {
            StateManager.addMessage(`⚠️ ${finalReq}`, "warning");
            return;
          }
          if (job.startupCost && state.resources.cash < job.startupCost) {
            StateManager.addMessage(
              `⚠️ 启动资金不足，需要 ¥${job.startupCost}`,
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
        name: "批发进货",
        desc: "在批发市场以折扣价批量购入商品，转手到商业区卖出赚差价！点击后自动切换到交易Tab进行采购。",
        icon: "📦",
        pricePreview: buildTradePricePreview(state, locKey, true),
        handler: () => {
          switchTab("trade");
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
        name: "买卖商品",
        desc: "查看当前市场价格，低买高卖赚取差价。点击后自动切换到交易Tab。",
        icon: "🛒",
        pricePreview: buildTradePricePreview(state, locKey, false),
        handler: () => {
          switchTab("trade");
        },
      });
    }

    // === 住所系统 ===
    if (locKey === "slum") {
      const currentTier = state.housing?.tier || 0;
      // HOUSING_TIERS 定义在 data/items.js 中（全局常量）

      // 显示当前住所
      const curHouse = HOUSING_TIERS[currentTier];
      actions.push({
        id: "housing_current",
        name: `当前住所：${curHouse.name}`,
        desc: `容量+${curHouse.capacity} | 睡眠恢复疲劳-${curHouse.fatigueRecovery} | ${curHouse.desc}${curHouse.rent > 0 ? ` | 日租¥${curHouse.rent}/天` : ""}`,
        icon: curHouse.icon,
        disabled: true,
      });

      // 可升级的住所
      for (let t = currentTier + 1; t < HOUSING_TIERS.length; t++) {
        const house = HOUSING_TIERS[t];
        const canAfford = state.resources.cash >= house.cost;
        actions.push({
          id: "housing_upgrade_" + t,
          name: `升级到${house.name}`,
          desc: `${house.desc} 一次性付¥${house.cost} + 日租¥${house.rent}/天`,
          icon: house.icon,
          costEstimate: house.cost,
          disabled: !canAfford,
          reqFail: !canAfford ? `需 ¥${house.cost}` : null,
          handler: () => {
            state.resources.cash -= house.cost;
            state.housing.tier = t;
            state.housing.rentedDay = state.player.day;
            state.inventory.capacity =
              house.capacity + (state.housing.storageCapacity || 0);
            StateManager.addMessage(
              `🏠 搬进了${house.name}！容量提升至${state.inventory.capacity}。`,
              "success",
            );
          },
        });
      }
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
          name: `已租仓库 (额外+${state.housing.storageCapacity || 0}容量)`,
          desc: `日租¥${STORAGE_OPTIONS.find((s) => s.capacity === state.housing.storageCapacity)?.rent || "?"}/天`,
          icon: "📦",
          disabled: true,
        });
      } else {
        for (const opt of STORAGE_OPTIONS) {
          const canAfford = state.resources.cash >= opt.cost;
          actions.push({
            id: "storage_rent_" + opt.id,
            name: `租用${opt.name}`,
            desc: `额外+${opt.capacity}商品存储容量。一次性¥${opt.cost} + 日租¥${opt.rent}/天`,
            icon: opt.icon,
            costEstimate: opt.cost,
            disabled: !canAfford,
            reqFail: !canAfford ? `需 ¥${opt.cost}` : null,
            handler: () => {
              state.resources.cash -= opt.cost;
              state.housing.storageRented = true;
              state.housing.storageCapacity = opt.capacity;
              const baseCap = [20, 50, 100, 200][state.housing.tier || 0];
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
      const ownedPacks = state.inventory.items.filter((i) =>
        i.id.startsWith("backpack_"),
      );
      for (const pack of BACKPACKS) {
        if (ownedPacks.find((p) => p.id === pack.id)) continue;
        const canAfford = state.resources.cash >= pack.cost;
        actions.push({
          id: "buy_" + pack.id,
          name: `购买${pack.name}`,
          desc: `随身容量+${pack.capacity}。一次性购买，永久拥有。`,
          icon: pack.icon,
          costEstimate: pack.cost,
          disabled: !canAfford,
          handler: () => {
            state.resources.cash -= pack.cost;
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
            name: "自考备考",
            desc: `消耗20AP，+5学习点（当前${ep.studyPoints}点，本门需150点）。有10%概率智力+1。`,
            ap: 20,
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
          name: "参加考试",
          desc: `消耗30AP，需学习点≥150（当前${ep.studyPoints}）。通过率${examPassRate.toFixed(0)}%（第${ep.examsPassed + 1}/6门）。`,
          ap: 30,
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
            name: "申请本科学历认证",
            desc: "6门科目全部通过！提交认证，获得本科学历，解锁更多工作机会。",
            ap: 0,
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
        actions.push({
          id: "edu_done",
          name: "本科学历持有者",
          desc: "你已是本科学历，享受更多工作和技能解锁。研究生课程敬请期待。",
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
              label: fjob.icon + " [节日] " + fjob.name + " ¥" + fjob.pay,
              desc: fjob.desc + "（消耗" + (fjob.apCost || 20) + "AP）",
              handler: function () {
                var pay = fjob.pay + Random.int(0, 29);
                state.resources.cash += pay;
                state.resources.totalEarned += pay;
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
          name: "本地名人效应",
          desc: `名气${fame}点，商家请你站台推广，收现金并涨粉。(每天一次)`,
          ap: 15,
          handler: () => {
            var earn = 50 + Math.floor(fame * 1.2) + Random.int(0, 79);
            state.resources.cash += earn;
            state.resources.totalEarned += earn;
            addDailyTransaction(
              state,
              "income",
              "side_job",
              earn,
              "本地名人效应",
            );
            state.player.fame = Math.min(100, state.player.fame + 3);
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
          name: "粉丝认出你了",
          desc: `有人认出你（名气${fame}），主动来搭话聊天，心情好极了。(每天一次)`,
          ap: 5,
          handler: () => {
            state.needs.happiness = Math.min(100, state.needs.happiness + 20);
            state.player.mental = Math.min(100, state.player.mental + 2);
            state.player.fame = Math.min(100, state.player.fame + 2);
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
          name: "名人专属指导课",
          desc: `名气${fame}点，教练/老师主动找你，提供一次免费专项训练。(每天一次)`,
          ap: 20,
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
          name: "VIP就诊通道",
          desc: `名气${fame}点，护士认出你直接带去优先诊室，挂号费减半。(每天一次)`,
          ap: 10,
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
          name: "科技论坛演讲嘉宾",
          desc: `名气${fame}点，主办方邀请你做嘉宾分享，演讲费+名气暴增。(每天一次)`,
          ap: 25,
          handler: () => {
            var earn = 200 + Math.floor(fame * 2.5) + Random.int(0, 149);
            state.resources.cash += earn;
            state.resources.totalEarned += earn;
            addDailyTransaction(
              state,
              "income",
              "side_job",
              earn,
              "科技论坛演讲嘉宾",
            );
            state.player.fame = Math.min(100, state.player.fame + 8);
            state.player.mental = Math.min(100, state.player.mental + 2);
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
      name: "休息一会",
      desc: "找个地方坐坐，恢复一些疲劳。",
      icon: "😴",
      apCost: 15,
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
        name: "还村长钱",
        desc: "随时还一部分或全部村长的账，无债一身轻。",
        icon: "🏘️",
        disabled: state.resources.cash <= 0 ? true : false,
        handler: () => {
          showRepayVillageModal();
        },
      });
    }

    actions.push({
      id: "eat",
      name: "吃顿饭",
      desc: "在路边摊吃个快餐，填饱肚子。烹饪技能越高自己做越省钱。",
      icon: "🍚",
      apCost: 10,
      costEstimate: 15,
      disabled: state.resources.cash < 8 ? true : false,
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
        if (st.resources.cash < foodCost) {
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

        st.resources.cash -= foodCost;
        addDailyTransaction(
          st,
          "expense",
          "food",
          foodCost,
          "吃饭" + (cookHint || ""),
        );
        st.needs.hunger = Math.min(100, st.needs.hunger + 35);
        st.needs.happiness = Math.min(100, st.needs.happiness + 8);
        StateManager.addMessage(
          `🍚 你花¥${foodCost}吃了顿饭，肚子饱了。${cookHint}`,
          "success",
        );
        consumeAP(10);
      },
    });

    actions.push({
      id: "shower",
      name: "洗澡",
      desc: "花8元去公共澡堂洗个澡。",
      apCost: 10,
      icon: "🚿",
      costEstimate: 8,
      disabled: state.resources.cash < 8 ? true : false,
      handler: () => {
        const st = StateManager.getState();
        if (st.resources.cash < 8) {
          StateManager.addMessage("⚠️ 不够钱洗澡。", "danger");
          return;
        }
        st.resources.cash -= 8;
        st.needs.hygiene = Math.min(100, st.needs.hygiene + 40);
        StateManager.addMessage("🚿 洗了个澡，神清气爽。", "success");
        consumeAP(10);
      },
    });

    // 银行相关行动
    if (locKey === "bank") {
      actions.push({
        id: "deposit",
        name: "存款",
        desc: "把钱存入银行，吃利息也更安全。",
        icon: "🏦",
        disabled: state.resources.cash <= 0 ? true : false,
        handler: () => {
          showDepositModal();
        },
      });
      actions.push({
        id: "withdraw",
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
        name: "贷款",
        desc: "向银行贷款（动态额度评估，日息0.3%复利），解燃眉之急。",
        icon: "📝",
        handler: () => {
          showLoanModal();
        },
      });
      actions.push({
        id: "repay",
        name: "还银行贷款",
        desc: "偿还银行贷款。",
        icon: "💸",
        disabled:
          (state.resources.bankDebt || 0) <= 0 && state.resources.cash <= 0
            ? true
            : false,
        handler: () => {
          showRepayModal();
        },
      });
    }

    // 医院
    if (locKey === "hospital") {
      actions.push({
        id: "heal",
        name: "看病治疗",
        desc: "花50元看病，恢复健康、治疗伤病。",
        icon: "🏥",
        apCost: 20,
        costEstimate: 50,
        disabled: state.resources.cash < 50 ? true : false,
        handler: () => {
          const st = StateManager.getState();
          st.resources.cash -= 50;
          st.status.health = Math.min(100, st.status.health + 40);
          st.status.sick = false;
          st.status.injured = false;
          StateManager.addMessage("🏥 看了医生，健康恢复了不少。", "success");
          consumeAP(20);
        },
      });
    }

    // 培训中心
    if (locKey === "trainingCenter") {
      actions.push({
        id: "study",
        name: "自学提升",
        desc: "花时间看书学习，提升技能等级。",
        icon: "📚",
        apCost: 15,
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
            StateManager.addMessage(
              `📚 你的${getSkillName(key)}提升到了等级 ${skill.level}！`,
              "success",
            );
          }
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 8);
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
        name: "公园放松",
        desc: "在公园散步、看风景，放松身心。",
        icon: "🌳",
        handler: () => {
          const st = StateManager.getState();
          st.needs.happiness = Math.min(100, st.needs.happiness + 20);
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 10);
          StateManager.addMessage(
            "🌳 在公园散了会步，心情舒畅多了。",
            "success",
          );
        },
      });
    }

    // 科技园 — 触发职场阶段入口
    if (locKey === "techPark" && state.player.phase === "street") {
      const canTransition = state.player.intelligence >= 45;
      actions.push({
        id: "apply_job",
        name: "应聘互联网公司",
        desc: canTransition
          ? "你的能力已经足够，可以去试试看！"
          : "需要智力 ≥ 45 才能获得面试机会。",
        icon: "💼",
        disabled: !canTransition,
        reqFail: canTransition ? null : "智力不足45",
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
      if (action.cost && state.resources.cash < action.cost) {
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
      const canAfford = state.resources.cash >= cert.requirements.cash;
      actions.push({
        id: "cert_" + cert.id,
        name: `考取${cert.name}`,
        desc: `${cert.desc} 费用:¥${cert.requirements.cash} 通过率:${Math.round(cert.examPassRate * 100)}%`,
        icon: "📜",
        costEstimate: cert.requirements.cash,
        disabled: !canAfford,
        reqFail: !canAfford ? `需 ¥${cert.requirements.cash}` : null,
        handler: () => {
          if (Random.chance(cert.examPassRate)) {
            state.certificates.push(cert.id);
            state.resources.cash -= cert.requirements.cash;
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
                state.player.intelligence + cert.effects.intelligence,
              );
            if (cert.effects.physique)
              state.player.physique = Math.min(
                100,
                state.player.physique + cert.effects.physique,
              );
            if (cert.effects.repair) addSkillXp("repair", cert.effects.repair);
            StateManager.addMessage(
              `📜 恭喜！成功考取${cert.name}！`,
              "success",
            );
          } else {
            state.resources.cash -= Math.floor(cert.requirements.cash / 2);
            StateManager.addMessage(
              `📜 ${cert.name}考试未通过，报名费损失一半。下次再努力！`,
              "warning",
            );
          }
          advanceTimeSlot();
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
          // 投资持仓态度变化（P1.6）：非节日/生日时35%概率触发
          var investLine = null;
          if (!isBirthday && !festLine && Random.chance(0.35)) {
            investLine = getInvestmentContextLine(npc.id, state);
          }
          const line =
            isBirthday && npc.birthdayLine
              ? npc.birthdayLine
              : festLine || investLine || Random.fromArray(npc.talkLines);
          const bdTag = isBirthday ? " 🎂" : "";
          StateManager.addMessage(
            `💬${bdTag} ${npc.name}：${line} (好感+${affinityGain})`,
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
          consumeAP(10);
        },
      });

      if (rel.met || (rel.affinity || 0) >= 30) {
        if ((rel.affinity || 0) >= 30) {
          actions.push({
            id: "intel_" + npc.id,
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
                  buttons: [],
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
                  buttons: [],
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

  // --- 注入扩展行动库（生存/社交/学习/生活/投资/梦想）---
  if (typeof addExtraActions === "function") {
    addExtraActions(state, actions);
  }

  return actions;
}

/** 执行街头工作 */
function doStreetJob(job) {
  const state = StateManager.getState();

  // 扣除启动资金
  if (job.startupCost) {
    state.resources.cash -= job.startupCost;
  }

  // 计算收入（含新闻+装备+情绪修正）
  let pay = job.payCalc(state);
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
  // 新人保护：前15天废品回收+5，苦力类+3
  if (state.player.day <= 15) {
    const boostedJobs = [
      "waste_recycling",
      "manual_labor_construction",
      "warehouse_worker",
      "factory_work_assembly",
    ];
    if (boostedJobs.includes(job.id)) {
      const newbieBonus = job.id === "waste_recycling" ? 2 : 2;
      pay += newbieBonus;
    }
  }
  state.employment.completedShifts[job.id] =
    (state.employment.completedShifts[job.id] || 0) + 1;

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
  } else if (totalShifts >= 30 && currentTitle < 2) {
    state.flags._jobTitles[job.id] = 2;
    pay = Math.floor(pay * 1.08);
    StateManager.addMessage(
      "🎖️ 熟练老手！" + job.name + "累计30天，收入永久+8%！",
      "success",
    );
  } else if (totalShifts >= 7 && currentTitle < 1) {
    state.flags._jobTitles[job.id] = 1;
    StateManager.addMessage(
      "📋 入门新人期已过，" + job.name + "工作已上手。",
      "hint",
    );
  }
  // 已获称号加成持续生效
  var titleBonus = state.flags._jobTitles[job.id] || 0;
  if (titleBonus === 2) pay = Math.floor(pay * 1.08);
  else if (titleBonus === 3) pay = Math.floor(pay * 1.15);

  // 应用效果
  if (job.effects) {
    if (job.effects.fatigue)
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
        Math.min(100, state.player.mental + job.effects.mental),
      );
    if (job.effects.fame)
      state.player.fame = Math.max(
        0,
        Math.min(100, state.player.fame + job.effects.fame),
      );

    // 技能经验
    addSkillXp("cooking", job.effects.cookingXp || 0);
    addSkillXp("repair", job.effects.repairXp || 0);
    addSkillXp("agility", job.effects.agilityXp || 0);
    addSkillXp("sales", job.effects.salesXp || 0);
    addSkillXp("physique", job.effects.physiqueXp || 0);
    addSkillXp("intelligence", job.effects.intelligenceXp || 0);
    addSkillXp("english", job.effects.englishXp || 0);
    addSkillXp("welding", job.effects.weldingXp || 0);
  }

  // 属性经验转化
  if (job.effects) {
    if (job.effects.agilityXp)
      state.player.agility = Math.min(
        100,
        state.player.agility + job.effects.agilityXp * 0.1,
      );
    if (job.effects.physiqueXp)
      state.player.physique = Math.min(
        100,
        state.player.physique + job.effects.physiqueXp * 0.1,
      );
    if (job.effects.intelligenceXp)
      state.player.intelligence = Math.min(
        100,
        state.player.intelligence + job.effects.intelligenceXp * 0.1,
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

  state.resources.cash += pay;
  state.resources.totalEarned += pay;
  addDailyTransaction(
    state,
    "income",
    "job_income",
    pay,
    "工作收入 - " + (job.name || "临时工"),
  );

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
        state.resources.cash = Math.max(0, state.resources.cash - fine);
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
    if (
      job.risk.injury &&
      Random.chance(Math.min(1, job.risk.injury * riskMod * certReduction))
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
      state.status.sick = true;
      state.status.health = Math.max(0, state.status.health - 10);
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

  // 推进时间
  advanceTimeSlot();
}

function addSkillXp(skillKey, amount) {
  if (!amount || amount <= 0) return;
  const state = StateManager.getState();
  const skill = state.skills[skillKey];
  if (!skill) return;
  skill.xp += amount;
  var xpNeeded = (skill.level + 1) * 120;
  // 支持连续升级
  while (skill.xp >= xpNeeded && skill.level < 100) {
    skill.level++;
    skill.xp -= xpNeeded;
    // 升级时提升关联属性
    if (typeof applySkillLevelUpBonus === "function") {
      applySkillLevelUpBonus(skillKey, state);
    }
    StateManager.addMessage(
      "⭐ " + getSkillName(skillKey) + "升级到 Lv." + skill.level + "！",
      "success",
    );
    xpNeeded = (skill.level + 1) * 120;
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
  };
  return names[key] || key;
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
  state.player.actionPoints = Math.max(
    0,
    state.player.actionPoints - actualCost,
  );

  // 更新显示用的时段
  const pct = state.player.actionPoints / state.player.maxActionPoints;
  if (pct > 0.66) state.player.timeSlot = "morning";
  else if (pct > 0.33) state.player.timeSlot = "afternoon";
  else state.player.timeSlot = "evening";

  // Per-action 随机事件判定 (6%基础概率)
  if (!state._pendingEvent) {
    const phase = state.player.phase === "corporate" ? "corporate" : "street";
    if (Random.chance(0.06)) {
      if (typeof queueRandomEvent === "function")
        queueRandomEvent(state, phase);
    }
  }

  // 道德事件判定（8%概率，每日最多一次，用showModal展示选择）
  if (!state._pendingEvent && typeof triggerMoralEvent === "function") {
    if (Random.chance(0.08)) {
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

// endDay 和 settleDailyFinance 已迁移至 js/phase1/daily_pipeline.js
// 管线声明式架构：新增结算步骤只需 push {name, fn} 到 DAILY_PIPELINE 数组

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

function checkLoseConditions(state) {
  if (state.status.health <= 0) {
    state.flags.gameOver = true;
    state.flags.gameOverReason = "健康耗尽，你倒在了这座城市的街头...";
    showGameOverModal();
    return;
  }
  if (state.resources.debt > 50000) {
    state.flags.gameOver = true;
    state.flags.gameOverReason = "利滚利债务超过5万元，讨债的人堵住了你的门...";
    showGameOverModal();
    return;
  }
  // 职场失败条件
  if (
    state.player.phase === "corporate" &&
    typeof checkCorpLoseConditions === "function"
  ) {
    if (checkCorpLoseConditions(state)) return;
  }
}

// ====== 消息日志渲染 ======
function renderMessageLog(state) {
  const log = document.getElementById("message-log");
  if (!log) return;

  const content = log.querySelector(".log-content");
  if (!content) return;

  const messages = state.messageLog.slice(-50); // 最近50条
  content.innerHTML = messages
    .map(
      (m) => `
    <div class="log-entry ${m.type}">
      <span class="log-day">[第${m.day}天]</span>${m.text}
    </div>
  `,
    )
    .join("");

  // 滚动到底部
  content.scrollTop = content.scrollHeight;
}

// ====== 初始化 ======
function init() {
  // 检查是否有存档
  if (hasSave()) {
    // 显示欢迎界面
  }

  // 注册状态变更回调
  StateManager.onChange(() => {
    if (gameStarted) {
      // 函数节流：每 100ms 最多渲染一次
      if (!init._renderTimeout) {
        init._renderTimeout = setTimeout(() => {
          renderAll();
          init._renderTimeout = null;
        }, 100);
      }
    }
  });

  // 显示欢迎界面
  showWelcome();

  // 全局点击事件委托（Tab 切换）
  document.getElementById("tab-bar").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (btn && btn.dataset.tab) {
      switchTab(btn.dataset.tab);
    }
  });

  // 存档按钮
  // 帮助按钮
  document.getElementById("btn-help").addEventListener("click", () => {
    showHelpModal();
  });

  // 存档按钮
  document.getElementById("btn-save").addEventListener("click", () => {
    if (gameStarted) showSaveMenu();
  });

  // 读档按钮
  document.getElementById("btn-load").addEventListener("click", () => {
    showLoadMenu();
  });

  // 新游戏按钮（Header）
  document
    .getElementById("btn-new-game-header")
    .addEventListener("click", () => {
      if (gameStarted) {
        showModal({
          title: "开始新游戏？",
          body: "<p>当前进度将会丢失。建议先存档。</p>",
          buttons: [
            { text: "取消", cls: "", callback: () => {} },
            {
              text: "确认新游戏",
              cls: "btn-danger",
              callback: () => showWelcome(),
            },
          ],
        });
      }
    });

  // 移动端菜单按钮
  document.getElementById("mobile-menu-btn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });

  console.log("🏙️ 城市浮生记 initialized.");
}

// ====== P2#12 技能树分支/节点事件处理 ======

/**
 * 处理技能分支选择（从弹窗回调调用）
 * @param {string} skillKey - 技能ID
 * @param {string} branchId - 分支ID
 */
function handleChooseBranch(skillKey, branchId) {
  var st = StateManager.getState();
  if (!st) {
    StateManager.addMessage("⚠️ 存档异常", "warning");
    return;
  }
  if (typeof chooseSkillBranch === "function") {
    chooseSkillBranch(skillKey, branchId, st);
    if (typeof renderAll === "function") renderAll(st);
  }
}

/**
 * 处理天赋节点激活（从技能卡片圆点点击调用）
 * @param {string} skillKey - 技能ID
 * @param {string} nodeId - 天赋节点ID
 */
function handleActivateTalentNode(skillKey, nodeId) {
  var st = StateManager.getState();
  if (!st) {
    StateManager.addMessage("⚠️ 存档异常", "warning");
    return;
  }

  // 检查资源并确认
  var branchId = st.skillBranches && st.skillBranches[skillKey];
  if (!branchId) {
    StateManager.addMessage("⚠️ 请先选择发展方向", "warning");
    return;
  }

  if (typeof activateTalentNode === "function") {
    var result = activateTalentNode(skillKey, nodeId, st);
    if (result && typeof renderAll === "function") renderAll(st);
  }
}

/**
 * 处理分支切换（从技能卡片的切换按钮调用）
 * @param {string} skillKey - 技能ID
 * @param {string} newBranchId - 新分支ID
 */
function handleSwitchBranch(skillKey, newBranchId) {
  var st = StateManager.getState();
  if (!st) return;
  if (typeof switchSkillBranch === "function") {
    switchSkillBranch(skillKey, newBranchId, st);
    if (typeof renderAll === "function") renderAll(st);
  }
}

// ====== 启动 ======
document.addEventListener("DOMContentLoaded", function () {
  init();
  // 百科自检：列出未命中的引用、缺字段等
  if (typeof runMechanicsAudit === "function") {
    try {
      runMechanicsAudit();
    } catch (e) {
      console.warn("[mechanics-audit] 异常：", e);
    }
  }
});

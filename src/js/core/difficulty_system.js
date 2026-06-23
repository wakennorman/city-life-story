/**
 * 难度分层系统 v1.0 — review-improve-v3.0 P2-B-2
 *
 * 设计参考：
 * - 《大多数》：心态值分级（0/20/40/60/80/100）做硬失败指标，难度只调衰减速率
 * - 《中国式家长》：用经济复利成本曲线隐性加压
 * - 《This War of Mine》：用角色组合与士气分级做隐性难度
 *
 * 三档难度（玩家在剧本选择时选）：
 *   休闲 easy    — 适合 1-10h 玩家，先体验叙事
 *   标准 normal  — 默认值，v3.0 审查前的所有数值
 *   困难 hard    — 适合 50h+ 玩家，反向闸门全开
 *
 * 影响的 4 个参数（仅调衰减/惩罚，不调收益曲线）：
 *   dailyInterestBase      村长债日利率   0.20% / 0.35% / 0.50%
 *   wealthTaxProbability   中产税触发概率 0.20  / 0.35  / 0.50
 *   eventPenaltyMultiplier 事件惩罚倍率   0.70  / 1.00  / 1.30
 *   needsDecayMultiplier   需求衰减倍率   0.85  / 1.00  / 1.15
 *
 * 暴露 window 函数（≤4）：
 *   getDifficultyConfig(level)            返回该档完整配置
 *   applyDifficultyToState(state, level)  把难度写入 state 并初始化相关字段
 *   getDifficultyMultiplier(state, key)   读取当前难度某参数的乘数（hot path 用）
 *   renderDifficultyPicker(onChange)      返回剧本选择界面的难度选择 HTML
 *
 * 接入点：
 *   - main.js::startNewGame / startScenarioGame 调用 applyDifficultyToState
 *   - skill_bonuses.js::settleDailyFinance 读取 dailyInterestBase 计算村长债复利
 *   - review_improvements.js::checkWealthTaxTick 读取 wealthTaxProbability
 *   - daily_pipeline.js::applyNeedsDecay 读取 needsDecayMultiplier
 *
 * v3.0 SOP 合规：
 *   - 不删文件，新模块 ≤300 行
 *   - 不改 main.js / events_*.js 主体，仅 ≤15 行接线
 *   - 暴露 4 个 window 函数
 *   - 数据兼容：旧存档无 _difficulty 字段 → 视为 "normal"
 */

(function () {
  "use strict";

  // ====== 难度配置（数值参考调研结论）======
  var DIFFICULTY_LEVELS = {
    easy: {
      level: "easy",
      name: "休闲",
      icon: "🍵",
      desc: "压力更小，叙事优先。村长债日息 0.20%，反向闸门较弱。",
      color: "var(--success)",
      dailyInterestBase: 0.002, // 0.20% / 日
      wealthTaxProbability: 0.2,
      eventPenaltyMultiplier: 0.7,
      needsDecayMultiplier: 0.85,
      startingCashBonus: 500, // 休闲档给一点启动资金缓冲
    },
    normal: {
      level: "normal",
      name: "标准",
      icon: "⚖️",
      desc: "经典体验，所有 v3.0 审查前数值不变。",
      color: "var(--text-secondary)",
      dailyInterestBase: 0.0035, // 0.35% / 日（与旧版一致）
      wealthTaxProbability: 0.35,
      eventPenaltyMultiplier: 1.0,
      needsDecayMultiplier: 1.0,
      startingCashBonus: 0,
    },
    hard: {
      level: "hard",
      name: "困难",
      icon: "🔥",
      desc: "为老玩家准备。村长债日息 0.50%，反向闸门全开，需求衰减更快。",
      color: "var(--danger)",
      dailyInterestBase: 0.005, // 0.50% / 日
      wealthTaxProbability: 0.5,
      eventPenaltyMultiplier: 1.3,
      needsDecayMultiplier: 1.15,
      startingCashBonus: 0,
    },
  };

  var DEFAULT_LEVEL = "normal";
  var _pickerChangeCb = null;

  // ====== 读取配置 ======
  function getDifficultyConfig(level) {
    if (!level || !DIFFICULTY_LEVELS[level]) {
      return DIFFICULTY_LEVELS[DEFAULT_LEVEL];
    }
    return DIFFICULTY_LEVELS[level];
  }

  // ====== 写入 state ======
  function applyDifficultyToState(state, level) {
    var cfg = getDifficultyConfig(level);
    state._difficulty = cfg.level;
    // 同步初始化村长债日利率（修复 v3.0 BUG：旧版从未实际生效）
    if (state.resources) {
      state.resources.dailyInterest = cfg.dailyInterestBase;
    }
    // 启动资金缓冲（仅休闲档）
    if (cfg.startingCashBonus > 0 && state.resources) {
      state.resources.cash = (state.resources.cash || 0) + cfg.startingCashBonus;
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage(
          "🍵 休闲档启动金 +¥" + cfg.startingCashBonus + "，慢慢享受故事。",
          "info"
        );
      }
    }
    return cfg;
  }

  // ====== 热路径读取乘数 ======
  function getDifficultyMultiplier(state, key) {
    var level = (state && state._difficulty) || DEFAULT_LEVEL;
    var cfg = getDifficultyConfig(level);
    if (key === "eventPenalty") return cfg.eventPenaltyMultiplier;
    if (key === "needsDecay") return cfg.needsDecayMultiplier;
    if (key === "wealthTaxProb") return cfg.wealthTaxProbability;
    if (key === "dailyInterest") return cfg.dailyInterestBase;
    return 1.0;
  }

  // ====== 剧本选择界面 UI ======
  function renderDifficultyPicker(onChange) {
    _pickerChangeCb = onChange;
    var html =
      '<div class="difficulty-picker" style="margin:12px 0 8px;padding:10px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;">' +
      '<div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px;">⚙️ 难度选择（影响利率/反向闸门/事件惩罚，不影响收益曲线）</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    Object.keys(DIFFICULTY_LEVELS).forEach(function (k) {
      var d = DIFFICULTY_LEVELS[k];
      html +=
        '<button type="button" class="difficulty-btn" data-level="' +
        k +
        '" onclick="window.__difficultyPickerSelect(\'' +
        k +
        '\')" ' +
        'style="flex:1;min-width:90px;padding:8px 6px;background:var(--bg-input);border:1px solid var(--border);color:var(--text-primary);border-radius:6px;cursor:pointer;font-size:13px;">' +
        '<div style="font-size:18px;">' + d.icon + '</div>' +
        '<div style="font-weight:600;margin-top:2px;">' + d.name + '</div>' +
        '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">日息 ' +
        (d.dailyInterestBase * 100).toFixed(2) + '%</div>' +
        "</button>";
    });
    html += "</div></div>";
    return html;
  }

  // ====== 内部选择回调（暴露给 onclick）======
  window.__difficultyPickerSelect = function (level) {
    var cfg = getDifficultyConfig(level);
    // 视觉反馈
    var btns = document.querySelectorAll(".difficulty-btn");
    btns.forEach(function (b) {
      var isSelected = b.getAttribute("data-level") === level;
      b.style.borderColor = isSelected ? cfg.color : "var(--border)";
      b.style.background = isSelected
        ? "color-mix(in srgb, " + cfg.color + " 15%, var(--bg-input))"
        : "var(--bg-input)";
      b.style.fontWeight = isSelected ? "700" : "400";
    });
    if (typeof _pickerChangeCb === "function") _pickerChangeCb(level);
  };

  // ====== 全局挂载 ======
  if (typeof window !== "undefined") {
    window.getDifficultyConfig = getDifficultyConfig;
    window.applyDifficultyToState = applyDifficultyToState;
    window.getDifficultyMultiplier = getDifficultyMultiplier;
    window.renderDifficultyPicker = renderDifficultyPicker;
    window.DIFFICULTY_LEVELS = DIFFICULTY_LEVELS;
  }
})();

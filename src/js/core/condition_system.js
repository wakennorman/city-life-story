/**
 * 约定式自动归类条件系统 (Condition System v1)
 *
 * 设计原则：约定式自动归类（CoC）
 * 1. 条件检查函数遵循统一返回格式 {label, ok, current, required}[]
 * 2. 通过 ConditionSystem.register() 注册 → 自动发现
 * 3. 通过 ConditionSystem.renderRows() / showModal() 统一渲染
 * 4. 新增任何系统只需注册检查函数，无需写渲染代码
 *
 * 返回格式约定（每项条件）：
 *   { label: "体质≥50", ok: true/false, current: 42, required: 50 }
 *
 * 设计参考：城市浮生记 v3.4 约定式自动归类方法论
 *   数据声明优先：条件数据自己描述自己
 *   系统自动发现：注册后自动处理渲染
 *   渐进式增强：纯数据驱动80%，函数覆盖20%
 */
(function () {
  "use strict";

  var _registry = {};

  /**
   * 注册条件检查器
   * @param {string} context - 上下文唯一ID（如 "career.promotion"）
   * @param {Function} checkFn - (state, ...args) => {label, ok, current, required}[]
   */
  function register(context, checkFn) {
    _registry[context] = { checkFn: checkFn };
  }

  /**
   * 获取注册器
   */
  function get(context) {
    return _registry[context] || null;
  }

  /**
   * 执行条件检查
   * @param {string} context - 注册时的上下文ID
   * @param {Object} state - 游戏状态
   * @param {...*} args - 额外参数透传给检查函数
   * @returns {Array|null}
   */
  function check(context, state) {
    var entry = _registry[context];
    if (!entry) return null;
    var args = Array.prototype.slice.call(arguments, 2);
    return entry.checkFn.apply(null, [state].concat(args));
  }

  /**
   * 渲染单条条件行 — 紧凑布局
   * ✅ 体质≥50  ✔ 42
   * ❌ 智力≥60  ✘ 35
   */
  function renderRow(r) {
    return (
      '<div class="cond-row ' +
      (r.ok ? "cond-ok" : "cond-fail") +
      '">' +
      '<span class="cond-icon">' +
      (r.ok ? "✅" : "❌") +
      "</span>" +
      '<span class="cond-label">' +
      r.label +
      "</span>" +
      '<span class="cond-value">' +
      (r.ok ? "✔" : "✘") +
      " " +
      r.current +
      "</span>" +
      "</div>"
    );
  }

  /**
   * 批量渲染条件列表
   * @param {Array} results - 条件结果数组
   * @returns {string} HTML
   */
  function renderRows(results) {
    if (!results || results.length === 0) return "";
    var html = '<div class="cond-rows">';
    for (var i = 0; i < results.length; i++) {
      html += renderRow(results[i]);
    }
    html += "</div>";
    return html;
  }

  /**
   * 紧凑缺失摘要（供卡片状态行用）
   * 例：缺体质 智力 敏捷 等5项
   * @param {Array} results - 条件结果数组
   * @returns {string} 纯文本摘要
   */
  function renderMissingSummary(results) {
    if (!results) return "";
    var missing = [];
    for (var i = 0; i < results.length; i++) {
      if (!results[i].ok) missing.push(results[i].label.replace(/\≥.*$/, ""));
    }
    if (missing.length === 0) return "";
    return (
      "缺" +
      missing.slice(0, 3).join(" ") +
      (missing.length > 3 ? " 等" + missing.length + "项" : "")
    );
  }

  /** 检查是否全部满足 */
  function allMet(results) {
    if (!results) return true;
    for (var i = 0; i < results.length; i++) {
      if (!results[i].ok) return false;
    }
    return true;
  }

  /** 统计满足数 */
  function metCount(results) {
    if (!results) return 0;
    var count = 0;
    for (var i = 0; i < results.length; i++) {
      if (results[i].ok) count++;
    }
    return count;
  }

  /**
   * 显示条件弹窗 — 统一入口
   * @param {Array} results - 条件结果数组
   * @param {Object} [options]
   * @param {string} [options.title] - 弹窗标题（默认自动）
   * @param {string} [options.icon] - 图标
   * @param {string} [options.subtitle] - 副标题
   * @param {string} [options.passText] - 全部满足时文案
   * @param {string} [options.failText] - 未满足时文案
   * @param {Array} [options.buttons] - 按钮数组
   */
  function showModal(results, options) {
    if (typeof showModal !== "function") return;
    options = options || {};
    var title =
      options.title || (allMet(results) ? "✅ 条件检查" : "❌ 条件不足");
    var met = metCount(results);
    var total = results.length;
    var allOk = allMet(results);

    var body = '<div class="cond-modal-body">';

    // 副标题行（若有）
    if (options.subtitle) {
      body +=
        '<div class="cond-modal-header">' +
        (options.icon
          ? '<span class="cond-modal-icon">' + options.icon + "</span>"
          : "") +
        "<div>" +
        '<div class="cond-modal-title">' +
        options.subtitle +
        "</div>" +
        '<div class="cond-modal-meta">' +
        met +
        "/" +
        total +
        " 条件已满足</div></div></div>";
    } else {
      body +=
        '<div class="cond-modal-meta" style="margin-bottom:6px;">' +
        met +
        "/" +
        total +
        " 条件已满足</div>";
    }

    body += renderRows(results);

    // 底部总结
    if (allOk) {
      body +=
        '<div class="cond-modal-allmet">🎉 ' +
        (options.passText || "全部条件满足！") +
        "</div>";
    } else {
      body +=
        '<div class="cond-modal-hint">💡 ' +
        (options.failText || "红色项需要优先提升，满足所有条件后再来") +
        "</div>";
    }

    body += "</div>";

    showModal({
      title: title,
      body: body,
      buttons: options.buttons || [
        {
          text: "知道了",
          cls: "btn-primary",
          callback: function () {
            return true;
          },
        },
      ],
    });
  }

  /**
   * 注册所有约定式检查函数（自动发现）
   * 在游戏初始化时调用一次
   */
  function init() {
    // 职业路径晋升条件 — career_dev.js 提供
    if (typeof checkCareerPromotionDetailed === "function") {
      register("career.promotion", checkCareerPromotionDetailed);
    }

    // 副业执行条件 — side_hustle.js 提供
    if (
      typeof sideHustle !== "undefined" &&
      typeof sideHustle.checkDetailed === "function"
    ) {
      register("side_hustle.perform", function (state, hustleId) {
        return sideHustle.checkDetailed(hustleId, state);
      });
    }

    // 创业注册条件 — startup.js 提供
    if (typeof canStartStartupDetailed === "function") {
      register("startup.register", canStartStartupDetailed);
    }

    // 人生节点条件 — life_nodes.js 提供
    if (typeof checkLifeNodeRequirementDetailed === "function") {
      register("life_node.choose", checkLifeNodeRequirementDetailed);
    }
  }

  // ====== 导出 ======
  window.ConditionSystem = {
    register: register,
    get: get,
    check: check,
    renderRow: renderRow,
    renderRows: renderRows,
    renderMissingSummary: renderMissingSummary,
    allMet: allMet,
    metCount: metCount,
    showModal: showModal,
    init: init,
  };
})();

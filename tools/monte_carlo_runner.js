/**
 * Monte Carlo 浏览器端自动跑分工具（P2 缺口最小补丁）
 *
 * 用途：批量推进游戏天数，采样每日状态与事件频率，用于平衡验收
 *       （文档原意见 IMPLEMENTATION_PROGRESS.md「Monte Carlo 浏览器验收」行）。
 *
 * 用法：
 *   1) 先正常开局进入游戏（选好模式/剧本/沙盒，确保 StateManager 已有 state）。
 *   2) 在浏览器 Console 执行：
 *        mc.run(365)        // 跑 365 天
 *        mc.report()        // 重新打印统计
 *        mc.export()        // 导出 snapshots JSON 到控制台
 *   3) 或访问页面时带 ?mc=365，1 秒后自动开跑。
 *
 * 限制（重要，使用前必读）：
 *   - showModal 拦截为 noop：不显示弹窗、不执行按钮 callback。
 *     → 跳过事件选择的 effects、每日报告的"继续"逻辑；endDay 管线自推进。
 *     → 因此本工具不模拟玩家主动行动（不工作/不消费/不选事件），只测被动演化：
 *       事件触发频率、新闻→世界参数传导、财务利息/维持成本、疾病触发、状态自然衰减。
 *   - 不调用玩家行动 handler（避免 DOM 依赖与链式弹窗）。
 *   - 智能行动模拟、多策略对比留作后续增强（见 TODO）。
 *
 * 字段防御访问，跑分中任何单日异常不会中断整体（try-catch 兜底）。
 */
(function () {
  if (window.__MC_LOADED) return;
  window.__MC_LOADED = true;

  var MC = (window.mc = {});

  var snapshots = [];
  var msgCounts = {}; // type -> count
  var msgSamples = {}; // 关键词分类 -> count
  var _origShowModal = null;
  var _origAddMessage = null;
  var _running = false;

  // ===== 字段防御访问 =====
  function g(obj, k, dflt) {
    return obj && obj[k] != null ? obj[k] : dflt;
  }
  function totalAssets(st) {
    var r = st.resources || {};
    var cash = g(r, "cash", 0);
    var bank = g(r, "bankDeposit", 0) || g(r, "bank", 0);
    var debt = g(r, "debt", 0) + g(r, "bankDebt", 0) + g(r, "villageDebt", 0);
    return Math.round(cash + bank - debt);
  }
  function snapshot(day, st) {
    var n = st.needs || {};
    var p = st.player || {};
    var wp = st._worldParams || {};
    return {
      day: day,
      cash: g(st.resources, "cash", 0),
      totalAssets: totalAssets(st),
      health: g(n, "health", 0),
      happiness: g(n, "happiness", 0),
      fatigue: g(n, "fatigue", 0),
      phase: g(p, "phase", ""),
      fame: g(p, "fame", 0),
      sectorHeat: JSON.parse(JSON.stringify(wp.sectorHeat || {})),
    };
  }

  // ===== Hook：拦截 showModal + 计数 addMessage =====
  function _installHooks() {
    _origShowModal = window.showModal;
    window.showModal = function () {
      /* noop: 不阻塞管线 */
    };

    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      _origAddMessage = StateManager.addMessage;
      StateManager.addMessage = function (msg, type) {
        try {
          var t = type || "info";
          msgCounts[t] = (msgCounts[t] || 0) + 1;
          var m = String(msg || "");
          var cat = _classify(m);
          if (cat) msgSamples[cat] = (msgSamples[cat] || 0) + 1;
        } catch (e) {}
        return _origAddMessage.apply(StateManager, arguments);
      };
    }
  }
  function _restoreHooks() {
    if (_origShowModal) window.showModal = _origShowModal;
    if (_origAddMessage && typeof StateManager !== "undefined")
      StateManager.addMessage = _origAddMessage;
  }
  function _classify(m) {
    if (/新闻|报道|头条|热搜/.test(m)) return "新闻";
    if (/病|诊|医|症|住院/.test(m)) return "医疗";
    if (/事件|遇到|发生|抉择/.test(m)) return "事件";
    if (/警告|危险|危机|破产|Game Over/.test(m)) return "危机";
    return null;
  }

  // ===== 主循环 =====
  MC.run = function (days) {
    if (_running) {
      console.warn("[MC] 已在运行中");
      return;
    }
    if (typeof endDay !== "function" || typeof StateManager === "undefined") {
      console.error(
        "[MC] 游戏未加载或未开局（StateManager/endDay 缺失）。请先正常进入游戏。",
      );
      return;
    }
    days = days || 365;
    snapshots = [];
    msgCounts = {};
    msgSamples = {};
    _running = true;
    _installHooks();
    var state = StateManager.getState();
    var startDay = g(state.player, "day", 0);
    var lastDay = startDay;
    var iters = 0;
    console.log(
      "[MC] 开始跑分：从第 " +
        startDay +
        " 天起，目标 " +
        days +
        " 天（showModal 已静默）",
    );
    var t0 = Date.now();
    for (var i = 0; i < days; i++) {
      try {
        endDay();
      } catch (e) {
        console.error("[MC] endDay 异常 @iter " + i, e);
        break;
      }
      state = StateManager.getState();
      var d = g(state.player, "day", startDay + i + 1);
      snapshots.push(snapshot(d, state));
      iters++;
      // 游戏结束检测：天数不再增长或显式标志
      if (d <= lastDay && i > 0) {
        console.warn(
          "[MC] 天数未增长（第 " + d + " 天），疑似 Game Over，停止",
        );
        break;
      }
      lastDay = d;
      if (state._gameOver || state.gameOver) break;
    }
    _restoreHooks();
    _running = false;
    var dt = Date.now() - t0;
    console.log("[MC] 完成：实际推进 " + iters + " 天，耗时 " + dt + "ms");
    MC.report();
    return snapshots;
  };

  // ===== 统计输出 =====
  MC.report = function () {
    if (!snapshots.length) {
      console.warn("[MC] 无快照，先 mc.run(N)");
      return;
    }
    var first = snapshots[0];
    var last = snapshots[snapshots.length - 1];
    var assets = snapshots.map(function (s) {
      return s.totalAssets;
    });
    var minA = Math.min.apply(null, assets);
    var maxA = Math.max.apply(null, assets);
    console.log("===== Monte Carlo 报告（" + snapshots.length + " 天）=====");
    console.log(
      "总资产：起 ¥" +
        first.totalAssets +
        " → 末 ¥" +
        last.totalAssets +
        " | 区间 ¥" +
        minA +
        " ~ ¥" +
        maxA,
    );
    console.log("现金：起 ¥" + first.cash + " → 末 ¥" + last.cash);
    console.log(
      "状态：健康 " +
        first.health +
        "→" +
        last.health +
        " | 心情 " +
        first.happiness +
        "→" +
        last.happiness +
        " | 疲劳 " +
        first.fatigue +
        "→" +
        last.fatigue +
        " | 阶段 " +
        first.phase +
        "→" +
        last.phase,
    );
    console.log("行业热度（末值）：", last.sectorHeat);
    console.log("消息计数（按 type）：", msgCounts);
    console.log("消息分类计数：", msgSamples);
    console.log("提示：mc.export() 导出完整 snapshots JSON");
  };

  MC.export = function () {
    var json = JSON.stringify({
      snapshots: snapshots,
      msgCounts: msgCounts,
      msgSamples: msgSamples,
    });
    console.log(json);
    return json;
  };

  MC.getSnapshots = function () {
    return snapshots;
  };

  // ===== ?mc=N 自动触发 =====
  try {
    var m = location.search.match(/[?&]mc=(\d+)/);
    if (m) {
      var d = parseInt(m[1], 10);
      console.log("[MC] 检测到 ?mc=" + d + "，1 秒后自动开跑（请确保已开局）");
      setTimeout(function () {
        MC.run(d);
      }, 1000);
    }
  } catch (e) {}

  console.log(
    "[MC] Monte Carlo runner 已加载。用法：mc.run(365) / mc.report() / mc.export()",
  );
})();

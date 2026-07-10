/**
 * Monte Carlo 浏览器端自动跑分工具（P2 缺口最小补丁）
 *
 * 用途：批量推进游戏天数，采样每日状态与事件频率，用于平衡验收
 *       （文档原意见 IMPLEMENTATION_PROGRESS.md「Monte Carlo 浏览器验收」行）。
 *
 * 用法：
 *   1) 先正常开局进入游戏（选好模式/剧本/沙盒，确保 StateManager 已有 state）。
 *   2) 在浏览器 Console 执行：
 *        mc.run(365)                // 跑 365 天（增量写盘到 localStorage）
 *        mc.report()                // 打印最近 trial 聚合统计
 *        mc.exportAll([runId])      // 流式打印全部/指定 run 的快照
 *        mc.listRuns()              // 列出历史 run 元数据
 *        mc.clearRuns()             // 清理所有 localStorage MC 数据
 *   3) 或访问页面时带 ?mc=365，1 秒后自动开跑。
 *   4) 多 trial 30 次 × 1000 天回归用法：
 *        for (var i=0;i<30;i++) mc.run(1000);
 *        mc.exportAll();
 *
 * 限制（重要，使用前必读）：
 *   - showModal 拦截为 noop：不显示弹窗、不执行按钮 callback。
 *     → 跳过事件选择的 effects、每日报告的"继续"逻辑；endDay 管线自推进。
 *     → 因此本工具不模拟玩家主动行动（不工作/不消费/不选事件），只测被动演化：
 *       事件触发频率、新闻→世界参数传导、财务利息/维持成本、疾病触发、状态自然衰减。
 *   - 不调用玩家行动 handler（避免 DOM 依赖与链式弹窗）。
 *   - 智能行动模拟、多策略对比留作后续增强（见 TODO）。
 *
 * v3.1 OOM 修复说明（2026-07-06）：
 *   - 旧实现把 365~1000 天快照全部撑在内存（var snapshots = []），
 *     1000 天 × ~200 字节/条 + 深拷贝扇区热度 → 约 200KB~2MB，
 *     多 trial 累积触发浏览器 GC 抖动甚至 OOM。
 *   - 新实现：每 trial 完成后把快照 append 进 localStorage 分片
 *     （key = mc_ss_<runId>_<chunkIdx>，每 chunk 250 天），
 *     内存只保留该 trial 的**聚合**（首末值 + 资产区间 + 消息计数）。
 *     单 trial 内存占用 ~O(10) 条记录，不再随天数线性增长。
 *
 * 字段防御访问，跑分中任何单日异常不会中断整体（try-catch 兜底）。
 */
(function () {
  if (window.__MC_LOADED) return;
  window.__MC_LOADED = true;

  var MC = (window.mc = {});

  // --- 内存聚合（每个 trial 只保留 O(1) 条） ---
  var _aggFirst = null;
  var _aggLast = null;
  var _assetsMin = Infinity;
  var _assetsMax = -Infinity;
  var _runIndex = 0; // multi-trial 时累计

  // localStorage 配置
  var LS_PREFIX = "mc_ss_";
  var LS_RUNS = "mc_runs";
  var CHUNK = 250; // 每个分片存储 250 天

  var msgCounts = {}; // type -> count
  var msgSamples = {}; // 关键词分类 -> count
  var _origShowModal = null;
  var _origAddMessage = null;
  var _running = false;

  // --- localStorage 辅助 ---
  function _lsKey(runId, chunkIdx) {
    return LS_PREFIX + runId + "_" + chunkIdx;
  }
  function _lsGC(runId) {
    // 仅清理当前 runId 之前旧 run 的所有分片
    if (!window.localStorage) return;
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (
        k &&
        k.indexOf(LS_PREFIX) === 0 &&
        k.indexOf(LS_PREFIX + runId + "_") !== 0
      ) {
        keys.push(k);
      }
    }
    for (var j = 0; j < keys.length; j++) {
      try {
        localStorage.removeItem(keys[j]);
      } catch (e) {}
    }
  }

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

  // ===== 主循环（增量写盘版，v3.1 OOM 修复）=====
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
    _runIndex++;
    var runId = "r" + _runIndex + "_" + Math.floor(Date.now() / 1000);

    // 仅内存保留聚合；每日快照追加到 localStorage 分片
    _aggFirst = null;
    _aggLast = null;
    _assetsMin = Infinity;
    _assetsMax = -Infinity;
    _lsGC(runId); // 清理过往 run 的分片

    var chunkBuf = [];
    var chunkIdx = 0;

    msgCounts = {};
    msgSamples = {};
    _running = true;
    _installHooks();
    var state = StateManager.getState();
    var startDay = g(state.player, "day", 0);
    var lastDay = startDay;
    var iters = 0;
    console.log(
      "[MC] 开始跑分 #" +
        _runIndex +
        "：从第 " +
        startDay +
        " 天起，目标 " +
        days +
        " 天（showModal 已静默；增量写盘 key=" +
        LS_PREFIX +
        runId +
        "_*）",
    );
    var t0 = Date.now();
    for (var i = 0; i < days; i++) {
      try {
        endDay();
      } catch (e) {
        console.error("[MC] endDay 异常 @iter " + i, e);
        // 分片落盘后退出，不丢已跑数据
        if (chunkBuf.length > 0) {
          try {
            localStorage.setItem(
              _lsKey(runId, chunkIdx),
              JSON.stringify(chunkBuf),
            );
          } catch (e2) {}
          chunkBuf = [];
          chunkIdx++;
        }
        break;
      }
      state = StateManager.getState();
      var d = g(state.player, "day", startDay + i + 1);
      var snap = snapshot(d, state);
      iters++;
      // 聚合到内存
      if (_aggFirst === null) _aggFirst = snap;
      _aggLast = snap;
      if (snap.totalAssets < _assetsMin) _assetsMin = snap.totalAssets;
      if (snap.totalAssets > _assetsMax) _assetsMax = snap.totalAssets;
      chunkBuf.push(snap);
      // chunk 满则写盘并释放
      if (chunkBuf.length >= CHUNK) {
        try {
          localStorage.setItem(
            _lsKey(runId, chunkIdx),
            JSON.stringify(chunkBuf),
          );
        } catch (e) {
          console.warn(
            "[MC] localStorage 写分片失败（配额？），改用内存兜底",
            e,
          );
        }
        chunkBuf = null;
        chunkBuf = [];
        chunkIdx++;
      }
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
    // 尾分片落盘
    if (chunkBuf.length > 0) {
      try {
        localStorage.setItem(_lsKey(runId, chunkIdx), JSON.stringify(chunkBuf));
      } catch (e) {}
    }
    chunkBuf = null;

    // 注册 run 元数据
    var meta = {
      runId: runId,
      iters: iters,
      startDay: startDay,
      first: _aggFirst,
      last: _aggLast,
      assetsMin: _assetsMin === Infinity ? 0 : _assetsMin,
      assetsMax: _assetsMax === -Infinity ? 0 : _assetsMax,
      chunks: chunkIdx + (chunkBuf ? 1 : 0),
      date: new Date().toISOString(),
    };
    try {
      var runsRaw = localStorage.getItem(LS_RUNS);
      var runs = runsRaw ? JSON.parse(runsRaw) : [];
      runs.push(meta);
      localStorage.setItem(LS_RUNS, JSON.stringify(runs));
    } catch (e) {}

    _restoreHooks();
    _running = false;
    var dt = Date.now() - t0;
    console.log(
      "[MC] 完成 #" +
        _runIndex +
        "：实际推进 " +
        iters +
        " 天，耗时 " +
        dt +
        "ms，写入 " +
        meta.chunks +
        " 个分片（localStorage key=" +
        LS_PREFIX +
        runId +
        "_0.." +
        (meta.chunks - 1) +
        "）",
    );
    MC.report();
    return meta;
  };

  // ===== 聚合统计输出（O(1) 内存，仅用 in-memory 聚合 + msgCounts）=====
  MC.report = function () {
    if (_aggLast === null) {
      console.warn("[MC] 无快照，先 mc.run(N)");
      return;
    }
    var first = _aggFirst,
      last = _aggLast;
    console.log("===== Monte Carlo 报告（最近 1 次 trial）=====");
    console.log(
      "总资产：起 ¥" +
        (first ? first.totalAssets : 0) +
        " → 末 ¥" +
        last.totalAssets +
        " | 区间 ¥" +
        (Number.isFinite(_assetsMin) ? _assetsMin : 0) +
        " ~ " +
        (Number.isFinite(_assetsMax) ? _assetsMax : 0),
    );
    console.log(
      "现金：起 ¥" + (first ? first.cash : 0) + " → 末 ¥" + last.cash,
    );
    console.log(
      "状态：健康 " +
        (first ? first.health : 0) +
        "→" +
        last.health +
        " | 心情 " +
        (first ? first.happiness : 0) +
        "→" +
        last.happiness +
        " | 疲劳 " +
        (first ? first.fatigue : 0) +
        "→" +
        last.fatigue +
        " | 阶段 " +
        (first ? first.phase : "") +
        "→" +
        last.phase,
    );
    console.log("行业热度（末值）：", last.sectorHeat);
    console.log("消息计数（按 type）：", msgCounts);
    console.log("消息分类计数：", msgSamples);
    console.log(
      "提示：mc.exportAll() 流式导出全部 run 到 console；mc.listRuns() 列出历史",
    );
  };

  // ===== 流式导出（不把全部数据加载到单一数组）=====
  MC.exportAll = function (runId) {
    if (!window.localStorage) {
      console.warn("[MC] 非浏览器环境，无 localStorage");
      return null;
    }
    // 先列出要导出的 run 元
    var runsRaw = localStorage.getItem(LS_RUNS);
    var runs = runsRaw ? JSON.parse(runsRaw) : [];
    if (runId)
      runs = runs.filter(function (r) {
        return r.runId === runId;
      });
    if (!runs.length) {
      console.warn("[MC] 无历史 run 数据");
      return null;
    }
    console.log(
      "[MC] 流式导出 " +
        runs.length +
        " 个 run（为避免 OMD，每个 run 分片逐块打印）",
    );
    for (var ri = 0; ri < runs.length; ri++) {
      var meta = runs[ri];
      console.log(
        "[MC] === Run: " + meta.runId + " (" + meta.iters + " 天) ===",
      );
      for (var ci = 0; ci < meta.chunks; ci++) {
        var raw = localStorage.getItem(_lsKey(meta.runId, ci));
        if (!raw) continue;
        // 流式打印每块（块 size ≤ CHUNK = 250 条）
        console.log("[MC]  -- chunk " + ci + " -- " + raw.length + " bytes");
        console.log(raw);
      }
    }
    // 同时返回聚合元数据（轻量）
    var out = { runs: runs, msgCounts: msgCounts, msgSamples: msgSamples };
    console.log("[MC] == 聚合元 ==", JSON.stringify(out));
    return out;
  };

  MC.listRuns = function () {
    if (!window.localStorage) return [];
    var runsRaw = localStorage.getItem(LS_RUNS);
    return runsRaw ? JSON.parse(runsRaw) : [];
  };

  MC.clearRuns = function () {
    if (!window.localStorage) return;
    var runsRaw = localStorage.getItem(LS_RUNS);
    var runs = runsRaw ? JSON.parse(runsRaw) : [];
    for (var i = 0; i < runs.length; i++) {
      var meta = runs[i];
      for (var ci = 0; ci < meta.chunks; ci++) {
        try {
          localStorage.removeItem(_lsKey(meta.runId, ci));
        } catch (e) {}
      }
    }
    try {
      localStorage.removeItem(LS_RUNS);
    } catch (e) {}
    _runIndex = 0;
    _aggFirst = _aggLast = null;
    _assetsMin = Infinity;
    _assetsMax = -Infinity;
    console.log("[MC] 已清理所有 MChrome run 数据");
  };

  // 兼容旧 API：getSnapshots 返回 null（不再全量加载到内存）
  MC.getSnapshots = function () {
    console.warn(
      "[MC] 已改为增量写盘模式，不再支持 mc.getSnapshots() 全量读取；使用 mc.listRuns() + mc.exportAll(runId)",
    );
    return null;
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
    "[MC] Monte Carlo runner 已加载（v3.1 增量写盘模式）。用法：" +
      "mc.run(365) / mc.report() / mc.exportAll([runId]) / mc.listRuns() / mc.clearRuns()",
  );
})();

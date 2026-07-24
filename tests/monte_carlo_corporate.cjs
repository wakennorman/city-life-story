/**
 * 城市浮生记 · Phase2 公司阶段压力测试
 * 驱动真实引擎，重点覆盖此前 1000 天 MC 完全未触及的 域H 运行态：
 *   - 创业路径：registerStartup → startup_tick 每日 tickStartup / triggerStartupEvent
 *              / startup_competition / startup_crisis / enterprise_fate
 *   - 创业事件全量覆盖：强制 seed/growth/mature 三阶段，变化 day 反复触发，
 *             跑遍 ALL_STARTUP_EVENTS(34个) 的 effect 应用分支，抓 NaN/抛错
 *   - 员工路径(上班进公司)：enterCorporatePhase → corporate 阶段每日行为（best-effort，
 *             因该路径强耦合 StateManager 单例 + DOM，headless 下做 shim 兜底）
 *
 * 捕获：runDailyPipeline 内部吞掉的异常(console.error) + 全状态递归 NaN/Infinity 扫描。
 * 注意：员工路径的 DOM 类错误(headless 缺 DOM 节点)单独归类为 "dom-limited"，不计入真 bug。
 *
 * 用法: node tests/monte_carlo_corporate.cjs --trials 10 --days 400 --output bug_report_corporate.json --seed 1337
 */
'use strict';
const path = require('path');
const runner = require(path.join(__dirname, 'headless_runner.cjs'));

function parseArgs(argv) {
  const a = { trials: 10, days: 400, output: null, seed: 1337, verbose: false };
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--trials') a.trials = parseInt(argv[++i], 10) || a.trials;
    else if (t === '--days') a.days = parseInt(argv[++i], 10) || a.days;
    else if (t === '--output') a.output = argv[++i];
    else if (t === '--seed') a.seed = parseInt(argv[++i], 10) || a.seed;
    else if (t === '--verbose') a.verbose = true;
  }
  return a;
}

// 递归扫描 NaN/Infinity，返回 [{path, value}]
function scanNaN(obj, maxHits) {
  const hits = [];
  const seen = new WeakSet();
  (function walk(node, p) {
    if (hits.length >= (maxHits || 200)) return;
    if (node === null || node === undefined) return;
    if (typeof node === 'number') {
      if (!isFinite(node)) hits.push({ path: p, value: node });
      return;
    }
    if (typeof node !== 'object') return;
    if (node instanceof Date) return;
    if (seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) walk(node[i], p + '[' + i + ']');
    } else {
      for (const k of Object.keys(node)) {
        if (hits.length >= (maxHits || 200)) return;
        walk(node[k], p + '.' + k);
      }
    }
  })(obj, 'state');
  return hits;
}

// headless 的 document shim 对未注册 id 返回 null → 员工路径 `.textContent` 崩溃。
// 这里给 getElementById 打补丁：未找到也返回假元素，模拟"DOM 节点存在"，
// 让真实游戏逻辑能跑起来、暴露真正的逻辑 bug（而非测试环境限制）。
function patchDocumentShim() {
  try {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const orig = document.getElementById.bind(document);
    const cache = {};
    const make = () => ({
      _tc: '',
      get textContent() { return this._tc; },
      set textContent(v) { this._tc = String(v); },
      style: {},
      classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
      appendChild() {}, removeChild() {}, remove() {},
      addEventListener() {}, removeEventListener() {},
      setAttribute() {}, getAttribute() { return null; },
      innerHTML: '', value: '', children: [],
      querySelector() { return null; }, querySelectorAll() { return []; },
    });
    document.getElementById = function (id) {
      const el = orig(id);
      if (el) return el;
      return cache[id] || (cache[id] = make());
    };
  } catch (e) { /* ignore */ }
}

function setupFounderState(st) {
  st.player.day = 61; // Day >= 60
  st.skills = st.skills || {};
  st.skills.coding = { level: 20, xp: 200 };
  st.skills.sales = { level: 20, xp: 200 };
  st.skills.management = { level: 14, xp: 100 };
  st.relationships = st.relationships || {};
  st.relationships.npc_test_a = { affinity: 55, met: true };
  st.relationships.npc_test_b = { affinity: 55, met: true };
  st.resources = st.resources || {};
  st.resources.cash = 5000000; // 充足启动资金
  return st;
}

// DOM 类错误 = headless 测试环境限制（浏览器里节点存在），不计入真 bug
function isDomError(msg) {
  return /textContent|getElementById|document\.|querySelector|appendChild|addEventListener|\.remove\(\)|\.style\b|classList/.test(msg);
}

function makeCapturer() {
  const origErr = console.error;
  const captured = [];
  console.error = function () {
    try { captured.push(Array.prototype.slice.call(arguments).map(String).join(' ')); } catch (e) {}
  };
  return {
    captured,
    restore() { console.error = origErr; },
  };
}

function aggregateErrors(captured, trialRec, summary) {
  captured.forEach((msg) => {
    if (/runDailyPipeline 错误|advanceDay throw|trial fatal|employee fatal|未定义|is not a function|Cannot read|Cannot set|TypeError|ReferenceError|triggerStartupEvent\(.*\) throw/.test(msg)) {
      const isDom = isDomError(msg);
      trialRec.errors.push({ msg: msg.slice(0, 400), domLimited: isDom });
      if (!isDom) {
        if (!trialRec.realErrors) trialRec.realErrors = 0;
        trialRec.realErrors++;
      }
    }
  });
  if (trialRec.realErrors) {
    summary.trialsWithError++;
    summary.totalErrors += trialRec.realErrors;
  }
  if (trialRec.errors.some((e) => e.domLimited)) summary.trialsWithDomLimited++;
}

function run() {
  const args = parseArgs(process.argv);
  patchDocumentShim();
  runner.init({ strict: false });
  const loadErrs = runner.getLoadErrors();
  const bugReport = {
    generatedAt: new Date().toISOString(),
    config: args,
    loadErrorsAtStart: loadErrs.length,
    loadErrorFiles: loadErrs.map((e) => e.file + ': ' + e.error).slice(0, 10),
    summary: {
      trials: 0, trialsWithError: 0, trialsWithNaN: 0, trialsWithDomLimited: 0,
      totalErrors: 0, totalNaN: 0,
      founderSuccess: 0, founderFail: 0,
      reachedGrowth: 0, reachedMature: 0,
      eventSweepCalls: 0,
      employeeEntered: 0,
      errorByType: {}, nanByPath: {},
    },
    trials: [],
  };

  const INDUSTRIES = ['tech', 'consumer', 'finance', 'healthcare', 'education', 'manufacturing', 'engineer', 'designer'];

  // ====== 第一段：创业自然推进（每日 startup_tick 真实跑 tickStartup/triggerStartupEvent）======
  for (let t = 0; t < args.trials; t++) {
    const seed = args.seed + t * 7919;
    const trialRec = {
      trial: t, seed, mode: 'founder', days: args.days,
      registered: false, registerMsg: '', finalStatus: null, finalPhase: null,
      reachedGrowth: false, reachedMature: false,
      maxCompetitors: 0, errors: [], nanPoints: [], realErrors: 0, survived: true,
    };
    const cap = makeCapturer();
    try {
      const st = runner.createState({ seed, scenario: 'classic' });
      setupFounderState(st);
      let reg = null;
      if (typeof registerStartup === 'function') {
        reg = registerStartup(st, '压测科技_' + t, INDUSTRIES[t % INDUSTRIES.length], 'corporate stress test');
      } else {
        cap.captured.push('[TEST] registerStartup 未定义');
      }
      trialRec.registered = !!(reg && reg.success) || !!(st.startup && st.startup.company);
      trialRec.registerMsg = reg ? (reg.message || (reg.success ? 'OK' : 'FAIL')) : 'no-fn';
      if (!trialRec.registered) bugReport.summary.founderFail++;
      else bugReport.summary.founderSuccess++;

      for (let d = 0; d < args.days; d++) {
        try {
          runner.advanceDay(st, null);
        } catch (e) {
          cap.captured.push('[TEST] advanceDay throw D' + (d + 1) + ': ' + e.message);
        }
        const status = st.startup && st.startup.status;
        const phase = st.startup && st.startup.company && st.startup.company.phase;
        if (status === 'growth' || phase === 'growth') trialRec.reachedGrowth = true;
        if (status === 'mature' || phase === 'mature') trialRec.reachedMature = true;
        const comp = st.startup && st.startup.competitors;
        if (Array.isArray(comp)) trialRec.maxCompetitors = Math.max(trialRec.maxCompetitors, comp.length);
        // 强制推进阶段以覆盖 growth/mature 的每日 tick 与事件分支
        if (d === Math.floor(args.days * 0.34) && st.startup) {
          st.startup.status = 'growth';
          if (st.startup.company) st.startup.company.phase = 'growth';
        }
        if (d === Math.floor(args.days * 0.67) && st.startup) {
          st.startup.status = 'mature';
          if (st.startup.company) st.startup.company.phase = 'mature';
        }
        const nan = scanNaN(st, 5);
        if (nan.length) trialRec.nanPoints.push({ day: d + 1, hits: nan.slice(0, 5) });
      }
      trialRec.finalStatus = st.startup ? st.startup.status : null;
      trialRec.finalPhase = st.startup && st.startup.company ? st.startup.company.phase : null;
      if (trialRec.reachedGrowth) bugReport.summary.reachedGrowth++;
      if (trialRec.reachedMature) bugReport.summary.reachedMature++;
    } catch (e) {
      cap.captured.push('[TEST] trial fatal: ' + e.message + '\n' + (e.stack || ''));
      trialRec.survived = false;
    }
    cap.restore();
    aggregateErrors(cap.captured, trialRec, bugReport.summary);
    let nanCount = 0; trialRec.nanPoints.forEach((p) => { nanCount += (p.hits || []).length; });
    trialRec.nanCount = nanCount;
    if (nanCount) bugReport.summary.trialsWithNaN++;
    bugReport.summary.totalNaN += nanCount;
    if (nanCount) bugReport.summary.nanByPath['(founder)'] = (bugReport.summary.nanByPath['(founder)'] || 0) + nanCount;
    bugReport.trials.push(trialRec);
    process.stdout.write('.');
  }

  // ====== 第二段：创业事件全量强制触发扫描（覆盖 34 个事件的 effect 应用分支）======
  const sweepTrials = 2;
  for (let t = 0; t < sweepTrials; t++) {
    const seed = args.seed + 50021 + t * 7919;
    const trialRec = {
      trial: t, seed, mode: 'event-sweep', days: null,
      registered: false, finalStatus: null, reachedGrowth: false, reachedMature: false,
      maxCompetitors: 0, errors: [], nanPoints: [], realErrors: 0, survived: true,
      calls: 0,
    };
    const cap = makeCapturer();
    try {
      const st = runner.createState({ seed, scenario: 'classic' });
      setupFounderState(st);
      if (typeof registerStartup === 'function') {
        const reg = registerStartup(st, 'sweep_' + t, 'tech', 'event coverage');
        trialRec.registered = !!(reg && reg.success) || !!(st.startup && st.startup.company);
      }
      if (!trialRec.registered) {
        cap.captured.push('[TEST] sweep registerStartup 失败');
      } else if (typeof triggerStartupEvent === 'function') {
        const phases = ['seed', 'growth', 'mature'];
        for (const ph of phases) {
          st.startup.status = ph;
          if (st.startup.company) st.startup.company.phase = ph;
          // 每个阶段反复触发，变化 day 以满足 triggerDayMin/Max 门控，跑遍该阶段全部事件
          for (let k = 0; k < 400; k++) {
            st.player.day = 30 + ((t * 400 + k) % 900); // 30..929 间循环，覆盖各事件日期门控
            try {
              triggerStartupEvent(st);
            } catch (e) {
              cap.captured.push('[TEST] triggerStartupEvent(' + ph + ') throw: ' + e.message);
            }
            trialRec.calls++;
            bugReport.summary.eventSweepCalls++;
            const nan = scanNaN(st, 3);
            if (nan.length) trialRec.nanPoints.push({ phase: ph, call: k, hits: nan.slice(0, 3) });
          }
        }
      } else {
        cap.captured.push('[TEST] triggerStartupEvent 未定义');
      }
    } catch (e) {
      cap.captured.push('[TEST] sweep fatal: ' + e.message + '\n' + (e.stack || ''));
      trialRec.survived = false;
    }
    cap.restore();
    aggregateErrors(cap.captured, trialRec, bugReport.summary);
    let nanCount = 0; trialRec.nanPoints.forEach((p) => { nanCount += (p.hits || []).length; });
    trialRec.nanCount = nanCount;
    if (nanCount) { bugReport.summary.trialsWithNaN++; bugReport.summary.totalNaN += nanCount; }
    bugReport.trials.push(trialRec);
    process.stdout.write('S');
  }

  // ====== 第三段：员工路径(上班进公司) best-effort ======
  const empTrials = Math.max(1, Math.floor(args.trials / 3));
  for (let t = 0; t < empTrials; t++) {
    const seed = args.seed + 90077 + t * 7919;
    const trialRec = {
      trial: t, seed, mode: 'employee', days: Math.min(args.days, 200),
      enteredCorporate: false, finalRank: null, errors: [], nanPoints: [], realErrors: 0, survived: true,
    };
    const cap = makeCapturer();
    try {
      const st = runner.createState({ seed, scenario: 'classic' });
      st.player.day = 61;
      st.resources = st.resources || {};
      st.resources.cash = 5000000;
      // 接线 StateManager 单例到本状态（enterCorporatePhase 读 StateManager.getState()）
      if (typeof StateManager !== 'undefined') { try { StateManager._state = st; } catch (e) {} }
      if (typeof enterCorporatePhase === 'function') {
        let companyId = undefined;
        try {
          if (typeof getAvailableCompanies === 'function') {
            const avail = getAvailableCompanies();
            if (Array.isArray(avail) && avail.length) companyId = avail[0].id;
          }
        } catch (e) {}
        try { enterCorporatePhase(companyId); } catch (e) { cap.captured.push('[TEST] enterCorporatePhase throw: ' + e.message); }
        trialRec.enteredCorporate = (st.player.phase === 'corporate');
        if (trialRec.enteredCorporate) bugReport.summary.employeeEntered++;
      } else {
        cap.captured.push('[TEST] enterCorporatePhase 未定义');
      }
      for (let d = 0; d < trialRec.days; d++) {
        try { runner.advanceDay(st, null); } catch (e) { cap.captured.push('[TEST] employee advanceDay throw D' + (d + 1) + ': ' + e.message); }
        const nan = scanNaN(st, 5);
        if (nan.length) trialRec.nanPoints.push({ day: d + 1, hits: nan.slice(0, 5) });
      }
      trialRec.finalRank = st.corporate ? st.corporate.rank : null;
    } catch (e) {
      cap.captured.push('[TEST] employee fatal: ' + e.message);
      trialRec.survived = false;
    }
    cap.restore();
    aggregateErrors(cap.captured, trialRec, bugReport.summary);
    let nanCount = 0; trialRec.nanPoints.forEach((p) => { nanCount += (p.hits || []).length; });
    trialRec.nanCount = nanCount;
    if (nanCount) { bugReport.summary.trialsWithNaN++; bugReport.summary.totalNaN += nanCount; }
    bugReport.trials.push(trialRec);
    process.stdout.write('E');
  }

  bugReport.summary.trials = bugReport.trials.length;

  if (args.output) {
    const fs = require('fs');
    fs.writeFileSync(args.output, JSON.stringify(bugReport, null, 1));
  }
  console.log('\n===== Phase2 公司阶段压测摘要 =====');
  console.log('加载错误(启动):', bugReport.loadErrorsAtStart);
  console.log('试次总数:', bugReport.summary.trials);
  console.log('创业注册成功:', bugReport.summary.founderSuccess, '| 失败:', bugReport.summary.founderFail);
  console.log('到达 growth:', bugReport.summary.reachedGrowth, '| 到达 mature:', bugReport.summary.reachedMature);
  console.log('事件强制触发调用数:', bugReport.summary.eventSweepCalls);
  console.log('员工路径进入 corporate:', bugReport.summary.employeeEntered);
  console.log('含真实异常试次:', bugReport.summary.trialsWithError, '| 总真实异常:', bugReport.summary.totalErrors);
  console.log('含 DOM 限制(环境)试次:', bugReport.summary.trialsWithDomLimited);
  console.log('含 NaN 试次:', bugReport.summary.trialsWithNaN, '| 总 NaN 点:', bugReport.summary.totalNaN);
  console.log('异常类型:', JSON.stringify(bugReport.summary.errorByType));
  if (args.output) console.log('报告已写出:', args.output);
}

run();

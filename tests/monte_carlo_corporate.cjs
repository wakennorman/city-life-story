/**
 * 城市浮生记 · Phase2 公司阶段压力测试
 * 驱动真实引擎，重点覆盖此前 1000 天 MC 完全未触及的 域H 运行态：
 *   - 创业路径：registerStartup → startup_tick 每日 tickStartup / triggerStartupEvent
 *              / startup_competition / startup_crisis / enterprise_fate
 *   - 员工路径：enterCorporatePhase → 管线在 corporate 阶段的行为
 * 捕获：被 runDailyPipeline 内部吞掉的异常(console.error) + 全状态递归 NaN/Infinity 扫描。
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

// 用真实前置条件搭出可创业状态
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

function countLoadErrors() {
  try { return runner.getLoadErrors().length; } catch (e) { return -1; }
}

function run() {
  const args = parseArgs(process.argv);
  runner.init({ strict: false });
  const loadErrs = runner.getLoadErrors();
  const bugReport = {
    generatedAt: new Date().toISOString(),
    config: args,
    loadErrorsAtStart: loadErrs.length,
    loadErrorFiles: loadErrs.map((e) => e.file + ': ' + e.error).slice(0, 10),
    summary: {
      trials: 0, trialsWithError: 0, trialsWithNaN: 0,
      totalErrors: 0, totalNaN: 0,
      founderSuccess: 0, founderFail: 0,
      reachedGrowth: 0, reachedMature: 0,
      employeeEntered: 0,
      errorByType: {}, nanByPath: {},
    },
    trials: [],
  };

  const INDUSTRIES = ['tech', 'consumer', 'finance', 'healthcare', 'education', 'manufacturing', 'engineer', 'designer'];

  for (let t = 0; t < args.trials; t++) {
    const seed = args.seed + t * 7919;
    const trialRec = {
      trial: t, seed, mode: 'founder', days: args.days,
      registered: false, registerMsg: '', finalStatus: null,
      reachedGrowth: false, reachedMature: false,
      maxCompetitors: 0, errors: [], nanPoints: [],
      survived: true,
    };

    // ---- 捕获被管线内部吞掉的异常 ----
    const origErr = console.error;
    const captured = [];
    console.error = function () {
      try { captured.push(Array.prototype.slice.call(arguments).map(String).join(' ')); } catch (e) {}
    };

    try {
      const st = runner.createState({ seed, scenario: 'classic' });
      setupFounderState(st);
      // 注册公司（真实路径）
      let reg = null;
      if (typeof registerStartup === 'function') {
        reg = registerStartup(st, '压测科技_' + t, INDUSTRIES[t % INDUSTRIES.length], 'corporate stress test');
      } else {
        captured.push('[TEST] registerStartup 未定义');
      }
      trialRec.registered = !!(reg && reg.success) || !!(st.startup && st.startup.company);
      trialRec.registerMsg = reg ? (reg.message || (reg.success ? 'OK' : 'FAIL')) : 'no-fn';
      if (!trialRec.registered) {
        bugReport.summary.founderFail++;
        // 仍记录并继续（至少测了注册前置/失败分支）
      } else {
        bugReport.summary.founderSuccess++;
      }

      // 自然推进：每天 advanceDay 跑 startup_tick
      for (let d = 0; d < args.days; d++) {
        try {
          runner.advanceDay(st, null);
        } catch (e) {
          captured.push('[TEST] advanceDay throw D' + (d + 1) + ': ' + e.message);
        }
        const status = st.startup && st.startup.status;
        if (status === 'growth') trialRec.reachedGrowth = true;
        if (status === 'mature') trialRec.reachedMature = true;
        const comp = st.startup && st.startup.competitors;
        if (Array.isArray(comp)) trialRec.maxCompetitors = Math.max(trialRec.maxCompetitors, comp.length);
        // 若长期停在 seed，手动推进阶段以覆盖 growth/mature 事件分支
        if (d === Math.floor(args.days * 0.33) && status === 'seed') { if (st.startup) st.startup.status = 'growth'; }
        if (d === Math.floor(args.days * 0.66) && status === 'seed') { if (st.startup) st.startup.status = 'mature'; }
        // 每日 NaN 扫描（轻量，只在命中时记录）
        const nan = scanNaN(st, 5);
        if (nan.length) { trialRec.nanPoints.push({ day: d + 1, hits: nan.slice(0, 5) }); }
      }
      trialRec.finalStatus = st.startup ? st.startup.status : null;
      if (trialRec.reachedGrowth) bugReport.summary.reachedGrowth++;
      if (trialRec.reachedMature) bugReport.summary.reachedMature++;
    } catch (e) {
      captured.push('[TEST] trial fatal: ' + e.message + '\n' + (e.stack || ''));
      trialRec.survived = false;
    }

    console.error = origErr;

    // 归并异常
    captured.forEach((msg) => {
      if (/runDailyPipeline 错误|advanceDay throw|trial fatal|未定义|is not a function|Cannot read/.test(msg)) {
        trialRec.errors.push({ msg: msg.slice(0, 400) });
      }
    });
    const nanAll = scanNaN(trialRec.nanPoints.length ? { _p: trialRec.nanPoints } : {}, 1); // 已在循环内采
    // 汇总 nanPoints 数量
    let nanCount = 0;
    trialRec.nanPoints.forEach((p) => { nanCount += (p.hits || []).length; });
    trialRec.nanCount = nanCount;

    if (trialRec.errors.length) bugReport.summary.trialsWithError++;
    if (nanCount) bugReport.summary.trialsWithNaN++;
    bugReport.summary.totalErrors += trialRec.errors.length;
    bugReport.summary.totalNaN += nanCount;
    trialRec.errors.forEach((e) => {
      const key = (e.msg.match(/is not a function|Cannot read|undefined|NaN|ReferenceError|TypeError/) || ['other'])[0];
      bugReport.summary.errorByType[key] = (bugReport.summary.errorByType[key] || 0) + 1;
    });
    bugReport.trials.push(trialRec);
    process.stdout.write('.');
  }

  // ---- 员工路径冒烟（独立试次）----
  for (let t = 0; t < Math.max(1, Math.floor(args.trials / 2)); t++) {
    const seed = args.seed + 99991 + t * 7919;
    const trialRec = {
      trial: t, seed, mode: 'employee', days: Math.min(args.days, 200),
      enteredCorporate: false, finalRank: null, errors: [], nanPoints: [],
      survived: true,
    };
    const origErr = console.error;
    const captured = [];
    console.error = function () { try { captured.push(Array.prototype.slice.call(arguments).map(String).join(' ')); } catch (e) {} };
    try {
      const st = runner.createState({ seed, scenario: 'classic' });
      st.player.day = 61;
      st.resources = st.resources || {};
      st.resources.cash = 5000000;
      if (typeof enterCorporatePhase === 'function') {
        enterCorporatePhase(); // 默认公司
        trialRec.enteredCorporate = (st.player.phase === 'corporate');
        if (trialRec.enteredCorporate) bugReport.summary.employeeEntered++;
      } else {
        captured.push('[TEST] enterCorporatePhase 未定义');
      }
      for (let d = 0; d < trialRec.days; d++) {
        try { runner.advanceDay(st, null); } catch (e) { captured.push('[TEST] employee advanceDay throw D' + (d + 1) + ': ' + e.message); }
        const nan = scanNaN(st, 5);
        if (nan.length) trialRec.nanPoints.push({ day: d + 1, hits: nan.slice(0, 5) });
      }
      trialRec.finalRank = st.corporate ? st.corporate.rank : null;
    } catch (e) {
      captured.push('[TEST] employee fatal: ' + e.message);
      trialRec.survived = false;
    }
    console.error = origErr;
    captured.forEach((msg) => { if (/runDailyPipeline 错误|advanceDay throw|fatal|未定义|is not a function|Cannot read/.test(msg)) trialRec.errors.push({ msg: msg.slice(0, 400) }); });
    let nanCount = 0; trialRec.nanPoints.forEach((p) => { nanCount += (p.hits || []).length; });
    trialRec.nanCount = nanCount;
    if (trialRec.errors.length) bugReport.summary.trialsWithError++;
    if (nanCount) bugReport.summary.trialsWithNaN++;
    bugReport.summary.totalErrors += trialRec.errors.length;
    bugReport.summary.totalNaN += nanCount;
    bugReport.trials.push(trialRec);
    process.stdout.write('E');
  }

  bugReport.summary.trials = bugReport.trials.length;

  if (args.output) {
    const fs = require('fs');
    fs.writeFileSync(args.output, JSON.stringify(bugReport, null, 1));
  }
  // 终端摘要
  console.log('\n===== Phase2 公司阶段压测摘要 =====');
  console.log('加载错误(启动):', bugReport.loadErrorsAtStart);
  console.log('试次总数:', bugReport.summary.trials);
  console.log('创业注册成功:', bugReport.summary.founderSuccess, '| 失败:', bugReport.summary.founderFail);
  console.log('到达 growth:', bugReport.summary.reachedGrowth, '| 到达 mature:', bugReport.summary.reachedMature);
  console.log('员工路径进入 corporate:', bugReport.summary.employeeEntered);
  console.log('含异常试次:', bugReport.summary.trialsWithError, '| 总异常:', bugReport.summary.totalErrors);
  console.log('含 NaN 试次:', bugReport.summary.trialsWithNaN, '| 总 NaN 点:', bugReport.summary.totalNaN);
  console.log('异常类型:', JSON.stringify(bugReport.summary.errorByType));
  if (args.output) console.log('报告已写出:', args.output);
}

run();

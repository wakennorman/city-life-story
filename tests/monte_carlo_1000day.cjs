'use strict';
// 城市浮生记 · 1000天蒙特卡洛压测（驱动真实游戏引擎）
// 通过 headless_runner 真跑 runDailyPipeline，多策略覆盖，
// 捕获任意一天的代码异常 + 全状态递归扫描 NaN/Infinity，输出结构化 bug 报告。
const fs = require('fs');
const runner = require('./headless_runner.cjs');

function parseArgs(argv) {
  const o = { trials: 20, days: 1000, output: null, seed: 1337 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--trials') o.trials = parseInt(argv[++i], 10) || o.trials;
    else if (a === '--days') o.days = parseInt(argv[++i], 10) || o.days;
    else if (a === '--output') o.output = argv[++i];
    else if (a === '--seed') o.seed = parseInt(argv[++i], 10) || o.seed;
  }
  return o;
}
const args = parseArgs(process.argv);

runner.init({ strict: false });
const loadErrors = runner.getLoadErrors();

const POLICIES = ['balanced', 'grinder', 'social', 'trader', 'corporate', 'skiller'];
const SCENARIOS = ['classic'];
const LIMIT_NAN = 50;

// 递归扫描任意状态的 NaN / Infinity
function scanNaN(obj, path, found, limit) {
  if (!obj || found.length >= limit) return;
  if (typeof obj === 'number') {
    if (!isFinite(obj)) found.push({ path: path, value: obj });
    return;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length && found.length < limit; i++) {
      scanNaN(obj[i], path + '[' + i + ']', found, limit);
    }
  } else if (typeof obj === 'object') {
    for (const k in obj) {
      if (found.length >= limit) break;
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        scanNaN(obj[k], path ? path + '.' + k : String(k), found, limit);
      }
    }
  }
}

function readPhase(state) {
  return state.phase ||
    (state.player && state.player.phase) ||
    (state.flags && state.flags.phase) ||
    (state.gamePhase) || 'street';
}

const bugReport = {
  generatedAt: new Date().toISOString(),
  args: args,
  loadErrors: loadErrors,
  summary: {
    trials: 0,
    trialsWithError: 0,
    trialsWithNaN: 0,
    totalErrors: 0,
    totalNaN: 0,
    trialsReachingCorporate: 0,
    errorByType: {},
    nanByPath: {},
  },
  trials: [],
};

for (let t = 0; t < args.trials; t++) {
  const strategy = POLICIES[t % POLICIES.length];
  const seed = args.seed + t * 7919;
  const scenario = SCENARIOS[t % SCENARIOS.length];
  const trialRec = {
    trial: t, strategy: strategy, seed: seed, scenario: scenario,
    error: null, nanFirstDay: null, nanExamples: [],
    lastDay: 0, survived: true, maxPhase: 'street',
  };

  let state;
  try {
    state = runner.createState({ seed: seed, scenario: scenario });
  } catch (e) {
    trialRec.error = 'createState: ' + e.message;
    bugReport.summary.trialsWithError++;
    bugReport.summary.totalErrors++;
    bugReport.trials.push(trialRec);
    continue;
  }

  const policy = runner.getStrategy(strategy);
  let reachedCorp = false;

  for (let day = 1; day <= args.days; day++) {
    try {
      if (policy) policy(state);
    } catch (e) {
      trialRec.error = 'policy D' + day + ': ' + e.message;
      break;
    }
    let alive;
    try {
      alive = runner.advanceDay(state, null);
    } catch (e) {
      trialRec.error = 'advanceDay D' + day + ': ' + e.message;
      break;
    }

    const ph = readPhase(state);
    if (ph === 'corporate') {
      reachedCorp = true;
      trialRec.maxPhase = 'corporate';
    }

    const found = [];
    scanNaN(state, 'state', found, LIMIT_NAN);
    if (found.length) {
      if (trialRec.nanFirstDay === null) trialRec.nanFirstDay = day;
      for (const f of found.slice(0, 5)) {
        trialRec.nanExamples.push({ day: day, path: f.path, value: f.value });
      }
      bugReport.summary.totalNaN += found.length;
      bugReport.summary.nanByPath[f.path] = (bugReport.summary.nanByPath[f.path] || 0) + 1;
    }

    trialRec.lastDay = day;
    if (alive === false) {
      trialRec.survived = false;
      break;
    }
  }

  if (reachedCorp) bugReport.summary.trialsReachingCorporate++;
  if (trialRec.error) bugReport.summary.trialsWithError++;
  bugReport.trials.push(trialRec);
}

bugReport.summary.trials = bugReport.trials.length;
bugReport.summary.trialsWithNaN = bugReport.trials.filter(function (x) { return x.nanFirstDay !== null; }).length;
bugReport.trials.forEach(function (tr) {
  if (tr.error) {
    const key = tr.error.split(':')[0];
    bugReport.summary.errorByType[key] = (bugReport.summary.errorByType[key] || 0) + 1;
  }
});

if (args.output) {
  fs.writeFileSync(args.output, JSON.stringify(bugReport, null, 1));
  console.log('报告已写入: ' + args.output);
}
console.log('=== 1000天蒙特卡洛压测摘要 ===');
console.log('试次:', bugReport.summary.trials, '| 天数/试:', args.days);
console.log('加载错误:', loadErrors.length);
console.log('含异常的试次:', bugReport.summary.trialsWithError, '| 总异常:', bugReport.summary.totalErrors);
console.log('含 NaN/Infinity 试次:', bugReport.summary.trialsWithNaN, '| 总污染点:', bugReport.summary.totalNaN);
console.log('进入公司阶段试次:', bugReport.summary.trialsReachingCorporate);
process.exit(0);

#!/usr/bin/env node
/**
 * 行人行为验证（确定性守卫）。
 *
 * ── 为什么需要这个脚本（与 verify-actors.cjs ③ 的分工）────────────────────
 *   verify-actors 的「过半行人在走动」是**单点抽样**：预热 2.5s → 取一次样 →
 *   推进 1.8s → 再取一次样。它有牙齿，但**天然会抖** ——
 *     · 行人本来就有设计内的停顿（进街 entryPause ≤1.6s、逛摊位挑东西 2~5s）；
 *     · 预热 2.5s 是**墙钟/仿真混合口径**，机器慢时角色自己的时钟落在后面；
 *     · 观察窗一旦与"集体停顿段"重叠，就会读到 0/17 或 4/17。
 *   实测同一份代码连跑：17/17 · 10/17 · 6/17 · 4/17 · 1/17 · 0/17 全出现过。
 *
 *   ★ 本脚本把判据从「单点」改成「整段连续断言」，因此**不抖、也不放水**：
 *     不是"某一刻 ≥50% 在走"，而是"t≥2s 之后的每一个采样点都 ≥50% 在走"。
 *     要求反而更严 —— 整条街同时站桩会立刻红，而单次抽样的偶然错位不再误报。
 *
 *   ★ 第二条牙齿是「无卡死」：每个行人都必须在 8 秒内产生过位移，
 *     且连续零位移时长有上限。这条抓的是"任务系统没被泵起来"这类静默僵死
 *     —— 那种情况下位移与判据会**同时**冻住。
 *
 * ── 取证手法 ─────────────────────────────────────────────────────────────
 *   给 `window.Scene3D.ActorSystem.prototype.update` 打桩，从而拿到**活的实例**
 *   （bridge.js 里的实例由 bundle 内同一个类构造，改 prototype 即可生效），
 *   于是能读到 `this.actors` / 任务链 / 位置 —— 全部只读，不写游戏状态。
 *
 * 用法：
 *   npm run verify:peds            # 3 轮重复，每轮独立开页
 *   node scripts/verify-peds.cjs --rounds=5 --sec=12
 */

const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');
const { EDGE, attachErrorSink } = require('./_boot.cjs');
const { ensureServer } = require('./lib/serve.cjs');

const PORT = Number(process.env.PORT || 8987);
const ROOT = path.resolve(__dirname, '..');
const DOC = '/dev/_3dtest/shell.html';
const PROBE = 'dev/_3dtest/bundle-probe.js';

const argv = process.argv.slice(2);
const rounds = Number((argv.find((a) => a.startsWith('--rounds=')) || '--rounds=3').split('=')[1]);
const SEC = Number((argv.find((a) => a.startsWith('--sec=')) || '--sec=12').split('=')[1]);

/* ── 判据常量（改动前请读上面的说明）────────────────────────────────────
   WIN        : 滑窗长度，与 verify-actors 的观察窗一致（1.8 仿真秒）
   WARM_SKIP  : 前若干秒不参与"连续 ≥50%"断言 —— 这一段是设计内的进街错峰停顿
   RATE_MIN   : 每个采样点要求的最低移动率
   STILL_MAX  : 单人连续零位移上限，超过即判"卡死"而非"停顿"
   MOVE_DEAD  : 位移判定阈值，低于它分不清"在走"和"抖动" */
const WIN = 1.8;
const WARM_SKIP = 2.0;
const RATE_MIN = 0.5;
const STILL_MAX = 6.0;
const MOVE_DEAD = 0.05;

let pass = 0, fail = 0;
function check(name, ok, detail) {
  ok ? pass++ : fail++;
  console.log(`  ${ok ? '✅' : '❌'} ${name}${detail ? `  — ${detail}` : ''}`);
}

/* 每轮结果汇总，用于最后的跨轮断言 */
const roundResults = [];

async function runRound(browser, round) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = attachErrorSink(page);
  await page.goto(`http://127.0.0.1:${PORT}${DOC}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => !!window.Scene3D && window.__shellReady === true, { timeout: 60000 });

  /* ── 打桩。★ 打不上就直接判红：那说明 ActorSystem 没有被挂到 Scene3D 上，
     或者 update 不再走 prototype（两种都会让本脚本失去取证能力）。
     ★ WIN / MOVE_DEAD 必须**显式传进来**：page.evaluate 的函数体在浏览器里执行，
       读不到本文件顶部的 Node 常量（漏传的失败形态是"打桩体每次调用都抛错、
       样本恒为空"，非常容易被误读成"游戏没跑"）。 ── */
  const patched = await page.evaluate(({ WIN, MOVE_DEAD }) => {
    const A = window.Scene3D && window.Scene3D.ActorSystem;
    if (!A || !A.prototype || typeof A.prototype.update !== 'function') return 'no ActorSystem.update';
    const D = { calls: 0, t: 0, series: [], peds: 0, tasks: {}, hits: 0 };
    window.__P = D;
    const origU = A.prototype.update;
    const origS = A.prototype._slide;
    if (typeof origS === 'function') {
      A.prototype._slide = function () {
        const o = origS.apply(this, arguments);
        if (o && o.hit) D.hits++;
        return o;
      };
    }
    A.prototype.update = function (dt, pp) {
      /* ★ 打桩体必须自带 try/catch：它挂在游戏的主循环上，
         一旦抛出会**吞掉该帧主循环剩余部分**，而且失败形态是
         "series 为空"这种**无声**的空数组 —— 排查起来极费时间。
         捕获后把首条错误留在 D.err 上，让它可见。 */
      try {
      D.calls++; D.t += dt;
      const acts = this.actors || [];
      const peds = [];
      for (const a of acts) if (a.kind === 'ped') peds.push(a);
      D.peds = peds.length;
      /* 任务链快照：这是"任务系统真的在跑"的直接证据。
         ★ 3 / 1 是 TASK_SLOT.PRIMARY / EVENT_TEMP 的数值（见 actors.js::TASK_SLOT）。
           这里刻意写字面量：verify-peds 是**外部观测者**，不该 import 被测实现的常量
           —— 否则实现里槽位编号一改，探针会跟着改，就失去了独立校验的意义。 */
      const PRIMARY = 3, EVENT_TEMP = 1;
      const hist = {};
      let pauseN = 0, evN = 0;
      const amb = [];
      for (const a of peds) {
        const T = a.tasks;
        const m = T ? T[PRIMARY] : null;
        const sub = m && m.sub;
        const nm = sub ? (sub.name || '?') : (T ? 'idle' : 'noTask');
        hist[nm] = (hist[nm] || 0) + 1;
        if (sub && sub.pauseT > 0) pauseN++;
        if (T && T[EVENT_TEMP]) evN++;
        amb.push(a);
      }
      D.tasks = hist;
      const before = amb.map((a) => [a.obj.position.x, a.obj.position.z]);
      /* ★ 用 var 而不是 const：一旦上面的代码抛错，const 会处于 TDZ，
         末尾 `return ret` 会再抛一次 ReferenceError，把真实错误盖掉。 */
      var ret = origU.call(this, dt, pp);
      D.hitsFrame = D.hits; D.hits = 0;
      /* 滑窗：环形缓冲只留最近 WIN 仿真秒的样本，按**对象索引**对齐
         （同一批引用，不存在下标错位）。 */
      const buf = D.buf || (D.buf = []);
      buf.push({ t: D.t, pos: amb.map((a) => [a.obj.position.x, a.obj.position.z]) });
      while (buf.length > 2 && D.t - buf[0].t > WIN) buf.shift();
      let moved = 0, n = 0;
      if (buf.length >= 2) {
        const old = buf[0], cur = buf[buf.length - 1];
        const cnt = Math.min(cur.pos.length, old.pos.length);
        for (let i = 0; i < cnt; i++) {
          if (!old.pos[i] || !cur.pos[i]) continue;
          n++;
          if (Math.hypot(cur.pos[i][0] - old.pos[i][0], cur.pos[i][1] - old.pos[i][1]) > MOVE_DEAD) moved++;
        }
      }
      /* 逐人：累计位移 与 连续零位移时长。
         ★ 人数变化时 tr 要跟着长：tr[i] 不存在会让整段打桩静默失效。
         ★ 「零位移」的判据必须是**浮点噪声级**（1e-4），不能拿 MOVE_DEAD(0.05)
           去缩放：60fps 下单帧行走量 = speed×dt ≈ 1.0×0.007 = 0.007m，
           用 0.01m 做阈值会把**正常行走**也判成站定 —— 实测这会凭空造出
           10~12s 的"站点"，把这条断言变成"永远红"。位移是逐帧精确累加的：
           没动就是 0，动了就是 speed×dt，"是否移动"用不着物理尺度。 */
      const EPS = 1e-4;
      const tr = D.tr || (D.tr = []);
      while (tr.length < amb.length) tr.push({ disp: 0, still: 0, maxStill: 0 });
      for (let i = 0; i < amb.length; i++) {
        const d = Math.hypot(amb[i].obj.position.x - before[i][0], amb[i].obj.position.z - before[i][1]);
        tr[i].disp += d;
        if (d > EPS) tr[i].still = 0; else tr[i].still += dt;
        if (tr[i].still > tr[i].maxStill) tr[i].maxStill = tr[i].still;
      }
      if (D.series.length < 4000) {
        D.series.push({
          t: +D.t.toFixed(2), dt: +dt.toFixed(4), rate: n ? +(moved / n).toFixed(2) : -1,
          moved, n, pauseN, evN, hist: JSON.stringify(hist), hits: D.hitsFrame,
        });
      }
      } catch (e) {
        D.errCount = (D.errCount || 0) + 1;
        if (!D.err) D.err = String((e && e.message) || e) + ' @' + String(((e && e.stack) || '').split('\n')[1] || '');
      }
      return ret;
    };
    return 'ok';
  }, { WIN, MOVE_DEAD });

  const out = await page.evaluate(({ SEC }) => new Promise((resolve) => {
    const D = window.__P;
    let sim = 0, prev = performance.now();
    const t0 = prev;
    const f = () => {
      const now = performance.now();
      sim += Math.min(0.05, (now - prev) / 1000); prev = now;
      if (sim >= SEC || D.series.length > 5000) {
        return resolve({
          series: D.series, calls: D.calls, peds: D.peds,
          err: D.err || null, errCount: D.errCount || 0,
          tr: (D.tr || []).map((x) => ({ disp: +x.disp.toFixed(2), maxStill: +x.maxStill.toFixed(2) })),
        });
      }
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }), { SEC });

  await page.close();
  return { ...out, errors: errors.length };
}

(async () => {
  console.log('行人行为验证（确定性守卫）\n');
  console.log('重建探针包（避免用旧代码验证新代码）…');
  execFileSync(process.execPath, [path.join(__dirname, 'build-3d-bundle.cjs'), '--out', PROBE],
    { cwd: ROOT, stdio: 'pipe' });
  await ensureServer({ root: ROOT, port: PORT, label: '行人行为验证' });
  const browser = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });

  for (let r = 1; r <= rounds; r++) {
    console.log(`\n──── 第 ${r}/${rounds} 轮（观察 ${SEC}s 仿真）────`);
    const res = await runRound(browser, r);

    check('任务系统被挂进主循环（update 真的在跑）', res.calls > 0, `update 调用 ${res.calls} 次`);
    check('街上有人流可测', res.peds >= 2, `${res.peds} 个行人`);
    /* ★ 先查打桩体有没有抛错。它抛了就一定取不到样本，而"0 个采样点"
       这种报法会把人引向"游戏没跑"，实际原因却在探针自己身上。 */
    check('打桩体自身没有抛错', res.errCount === 0,
      res.errCount ? `${res.errCount} 次：${res.err}` : '0 次');
    check('无页面报错', res.errors === 0, res.errors ? `${res.errors} 条` : '0 条');
    if (!res.series.length) { check('取到滑窗样本', false, '0 个采样点'); roundResults.push(null); continue; }

    const s = res.series;
    const withRate = s.filter((x) => x.rate >= 0);
    check('取到滑窗样本', withRate.length > 0, `${withRate.length} 个采样点`);

    /* ── ① 无卡死：每个人 8s 内必须动过 ── */
    const idle = res.tr.filter((x) => x.disp <= MOVE_DEAD);
    check('★ 没有行人卡死（每个人都动过）', idle.length === 0,
      idle.length ? `${idle.length}/${res.tr.length} 人零位移` : `${res.tr.length} 人全部有位移`);

    /* ── ② 单人连续零位移时长上限 ── */
    const worstStill = res.tr.reduce((m, x) => Math.max(m, x.maxStill), 0);
    check('★ 最长连续站定不超过上限（区分"停顿"与"卡死"）', worstStill <= STILL_MAX,
      `最长 ${worstStill}s（上限 ${STILL_MAX}s）`);

    /* ── ③ 整段连续断言：预热之后，每个采样点都要 ≥50% 在走 ── */
    const steady = withRate.filter((x) => x.t >= WARM_SKIP);
    const bad = steady.filter((x) => x.rate < RATE_MIN);
    check(`★ t≥${WARM_SKIP}s 之后每个滑窗都 ≥${RATE_MIN * 100}% 行人在走（连续断言，不是单点抽样）`,
      steady.length > 0 && bad.length === 0,
      bad.length
        ? `${bad.length}/${steady.length} 个窗不达标，最低 ${Math.min(...bad.map((x) => x.rate))} @ t=${bad[0].t}s`
        : `${steady.length} 个窗全部达标，最低 ${steady.length ? Math.min(...steady.map((x) => x.rate)) : '-'}`);

    /* ── ④ 任务系统在承压（不是"全都在走同一支兜底任务"）── */
    const taskKinds = new Set();
    for (const x of s) { try { Object.keys(JSON.parse(x.hist)).forEach((k) => taskKinds.add(k)); } catch (e) { /* ignore */ } }
    check('任务链有内容（不是空槽在裸奔）', taskKinds.size > 0 && !taskKinds.has('noTask'),
      `出现过的任务：${[...taskKinds].join(' / ')}`);

    /* 打印一段序列，失败时能直接看到现场 */
    const sample = withRate.filter((_, i) => i % Math.max(1, Math.floor(withRate.length / 24)) === 0);
    console.log('     t(s) |  dt   | rate | 移动/样本 | pause | EV | 任务分布');
    for (const x of sample) {
      console.log(`    ${String(x.t).padStart(5)} | ${String(x.dt).padStart(6)} | `
        + `${String(x.rate).padStart(4)} | ${String(x.moved).padStart(4)}/${String(x.n).padEnd(4)} | `
        + `${String(x.pauseN).padStart(5)} | ${String(x.evN).padStart(2)} | ${x.hist}`);
    }
    roundResults.push({
      minRate: steady.length ? Math.min(...steady.map((x) => x.rate)) : -1,
      worstStill, idle: idle.length, ok: bad.length === 0 && idle.length === 0,
    });
  }

  /* ── 跨轮一致性：这是本脚本存在的理由（单点抽样的抖动）── */
  const okRounds = roundResults.filter((x) => x && x.ok).length;
  console.log(`\n──── 跨轮一致性 ────`);
  for (let i = 0; i < roundResults.length; i++) {
    const x = roundResults[i];
    console.log(`  第 ${i + 1} 轮：${x ? (x.ok ? '通过' : '未通过') : '无样本'}`
      + `  · 最低滑窗移动率 ${x ? x.minRate : '-'} · 最长站定 ${x ? x.worstStill : '-'}s`
      + ` · 卡死 ${x ? x.idle : '-'} 人`);
  }
  check(`★ ${rounds} 轮全部通过（抖动已被"连续断言"消除）`, okRounds === rounds,
    `${okRounds}/${rounds} 轮通过`);

  await browser.close();
  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

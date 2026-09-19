/**
 * 任务系统验证（`src/app/3d/actors.js` 的 Task / ComplexTask / 5 槽位）。
 *
 * ── 为什么必须单独一个脚本 ────────────────────────────────────────────────
 * 这次改造**唯一的目的**是让"被事件打断"这件事有地方放，
 * 也就是"高优先级槽能抢占主任务、且被抢占的主任务会恢复"。
 * 这个性质无法靠截图或统计看出（画面上只是"行人停了一下"），
 * 只能靠**可执行断言**证明。没有断言，等于改造没做。
 *
 * ── 为什么不开第二个浏览器页而是自己造场景 ──────────────────────────────
 * 断言要读 `actor.tasks`、要塞自定义任务、要精确控制推进的秒数。
 * 走真实主循环的话，dt 随帧率抖动、事件层会随机插任务、玩家位置不可控 ——
 * 那样的断言会变成"偶发假红"，正是本项目最忌讳的东西。
 * 这里直接 `new Scene3D.ActorSystem({ add(){} })`（假场景，不渲染、不干扰主循环），
 * 用一个合成世界 `setWorld(...)`，然后**手动按固定 dt 推进** —— 完全确定性。
 *
 * 用法：npm run verify:tasks
 */
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');
const { EDGE, attachErrorSink } = require('./_boot.cjs');
const { ensureServer, closeServer } = require('./lib/serve.cjs');

const PORT = Number(process.env.PORT || 8987);
const ROOT = path.resolve(__dirname, '..');
const DOC = '/dev/_3dtest/shell.html';
const PROBE = 'dev/_3dtest/bundle-probe.js';

let pass = 0, fail = 0;
function check(name, ok, detail) {
  (ok ? pass++ : fail++);
  console.log(`  ${ok ? '✅' : '❌'} ${name}${detail ? `  — ${detail}` : ''}`);
}

(async () => {
  console.log('重建探针包（避免用旧代码验证新代码）…');
  execFileSync(process.execPath, [path.join(__dirname, 'build-3d-bundle.cjs'), '--out', PROBE],
    { cwd: ROOT, stdio: 'pipe' });

  const own = await ensureServer({ root: ROOT, port: PORT, label: '任务系统验证' });
  const browser = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1024, height: 700 } });
  const errors = attachErrorSink(page);
  await page.goto(`http://127.0.0.1:${PORT}${DOC}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => !!window.Scene3D && window.__shellReady === true, { timeout: 60000 });

  console.log('\n任务系统验证（Task / ComplexTask / 5 槽位）\n');

  /* ── ⓪ 合成世界：把任务系统拿出来单独驱动 ── */
  const setup = await page.evaluate(() => {
    const S = window.Scene3D;
    if (!S.TASK_SLOT) return { err: '入口未导出 TASK_SLOT —— 检查 index.js 是否转出' };
    /* ★ 假场景：ActorSystem 构造里只用 `scene.add(group)` 一次。
       传假对象 → 不渲染、不进真实场景树、不影响主循环。 */
    const sys = new S.ActorSystem({ add() {} });
    sys.setWorld({
      id: 'task-probe', layout: 'lane', streetLen: 60, roadW: 9.5, laneHalf: 4.75,
      tier: 1, colliders: [], anchors: [], footfall: 0.6,
    });
    /* 玩家丢到很远处：让行事件层不会插手（要测的是任务机制本身）。 */
    window.__T = {
      sys,
      far: { x: 999, z: 999 },
      step(n, dt) { for (let i = 0; i < n; i++) sys.update(dt, this.far); },
    };
    /* 先推 0.5s：主任务是惰性装子任务的（见 PedAmbientTask.tick），
       不先跑几帧，下面的"引用不变"断言会拿到 null。 */
    window.__T.step(30, 1 / 60);
    return {
      kinds: sys.stats,
      slotCount: S.TASK_SLOT_COUNT,
      slots: S.TASK_SLOT,
      hasWait: typeof S.WaitTask === 'function',
      hasComplex: typeof S.ComplexTask === 'function',
      hasShop: typeof S.ShopVisitTask === 'function',
    };
  });
  if (setup.err) { console.log('  ❌ ' + setup.err); await browser.close(); await closeServer(own); process.exit(1); }
  check('任务系统已导出到入口（验证脚本能构造任务）',
    setup.hasWait && setup.hasComplex && setup.hasShop && setup.slotCount === 5,
    `槽位 ${setup.slotCount} 个 · WaitTask/ComplexTask/ShopVisitTask ${setup.hasWait ? '有' : '缺'}`);
  check('合成世界生成了行人', (setup.kinds.ped || 0) >= 3, `${setup.kinds.ped} 个行人`);

  /* ── ① 状态工厂：没有 undefined 字段 ──
     ★ 这条直接对应改造前那三个 `a.x === undefined ? ... : a.x` 懒初始化。
       失败形态是静默 NaN，所以必须断言"没有任何字段是 undefined"。 */
  const undef = await page.evaluate(() => {
    const bad = [];
    for (const a of window.__T.sys.actors) {
      for (const k of Object.keys(a)) {
        if (a[k] === undefined) bad.push(`${a.kind}.${k}`);
      }
    }
    return bad;
  });
  check('★ 没有角色的状态字段是 undefined（工厂统一初始化）', undef.length === 0,
    undef.length ? `发现 ${undef.length} 个：${undef.slice(0, 6).join(', ')}` : '全部已赋初值');

  /* ── ② 死字段已删除 ──
     moving / act / offX / offZ 全库只有写入、没有读取，本次审计一并删掉。
     留着它们的代价是**误导**：下一个人会以为 `act` 决定行为。 */
  const dead = await page.evaluate(() => {
    const names = ['moving', 'act', 'offX', 'offZ'];
    const found = [];
    for (const a of window.__T.sys.actors) {
      for (const n of names) if (Object.prototype.hasOwnProperty.call(a, n)) found.push(`${a.kind}.${n}`);
    }
    return found;
  });
  check('★ 四个死字段（moving/act/offX/offZ）已删除', dead.length === 0,
    dead.length ? `仍存在：${[...new Set(dead)].join(', ')}` : '全库零残留');

  /* ── ③ 槽位结构：主任务常驻、兜底就位 ── */
  const slots = await page.evaluate(() => {
    const S = window.Scene3D;
    const peds = window.__T.sys.actors.filter((a) => a.kind === 'ped');
    let okAll = true, sample = null;
    for (const a of peds) {
      const T = a.tasks;
      const ok = T && T.length === S.TASK_SLOT_COUNT
        && T[S.TASK_SLOT.PRIMARY] && T[S.TASK_SLOT.DEFAULT];
      if (!ok) okAll = false;
      if (!sample) sample = { primary: T[S.TASK_SLOT.PRIMARY].name, def: T[S.TASK_SLOT.DEFAULT].name };
    }
    return { okAll, sample, n: peds.length };
  });
  check('主任务（PRIMARY）与兜底（DEFAULT）都就位', slots.okAll,
    `${slots.n} 个行人 · PRIMARY=${slots.sample && slots.sample.primary} · DEFAULT=${slots.sample && slots.sample.def}`);

  /* ── ④ ★ 高槽抢占：EVENT_TEMP 里塞任务 → 行人立刻停下 ── */
  const preempt = await page.evaluate(() => {
    const S = window.Scene3D;
    const a = window.__T.sys.actors.find((x) =>
      x.kind === 'ped' && x.tasks && x.tasks[S.TASK_SLOT.PRIMARY] && x.tasks[S.TASK_SLOT.PRIMARY].sub);
    if (!a) return { err: '没有已装好子任务的行人（步进后应当有）' };
    const primaryRef = a.tasks[S.TASK_SLOT.PRIMARY];
    const subRef = primaryRef.sub;
    const before = { x: a.obj.position.x, z: a.obj.position.z };
    const ok = window.__T.sys.pushTask(a, S.TASK_SLOT.EVENT_TEMP, new S.WaitTask(1.0));
    /* 推进 0.4s（小于 1.0s，任务还在跑） */
    window.__T.step(24, 1 / 60);
    const after = { x: a.obj.position.x, z: a.obj.position.z };
    return {
      ok,
      moved: Math.hypot(after.x - before.x, after.z - before.z),
      primaryUntouched: a.tasks[S.TASK_SLOT.PRIMARY] === primaryRef,
      subUntouched: primaryRef.sub === subRef,
      evtAlive: !!a.tasks[S.TASK_SLOT.EVENT_TEMP],
      name: a.tasks[S.TASK_SLOT.EVENT_TEMP] && a.tasks[S.TASK_SLOT.EVENT_TEMP].name,
    };
  });
  check('★ 高槽任务能装进去（EVENT_TEMP ← WaitTask）', preempt.ok === true,
    preempt.err || `${preempt.name} · 期间位移 ${(preempt.moved || 0).toFixed(3)}m`);
  check('低槽主任务**没有被销毁**（引用不变）',
    preempt.primaryUntouched === true && preempt.subUntouched === true,
    `PRIMARY 引用不变=${preempt.primaryUntouched} · 子任务引用不变=${preempt.subUntouched}`);

  /* 行人此时可能在"停顿期"里本来就站着，所以位移≈0 这条要连着 ⑤ 一起看。 */
  const resume = await page.evaluate(() => {
    const S = window.Scene3D;
    const target = window.__T.sys.actors.find((x) => x.tasks && x.tasks[S.TASK_SLOT.EVENT_TEMP]);
    if (!target) return { err: '抢占任务已不存在（不该发生）' };
    const primaryRef = target.tasks[S.TASK_SLOT.PRIMARY];
    const subRef = primaryRef && primaryRef.sub;
    /* 推进到 WaitTask(1.0s) 结束之后 */
    window.__T.step(60, 1 / 60);
    const evtGone = !target.tasks[S.TASK_SLOT.EVENT_TEMP];
    const samePrimary = target.tasks[S.TASK_SLOT.PRIMARY] === primaryRef;
    const sameSub = primaryRef.sub === subRef;
    /* ★ 怎么断言"主任务真的在跑"而不被"他恰好处于停顿期 / 恰好切去逛店"污染：
       —— 停顿期会让位移为 0，切去逛店会把子任务换掉。
       这两件事都**不属于"恢复失败"**，但都会让朴素断言假红。
       所以先把这两个干扰源钉死：取消当前停顿、禁用逛店冷却，
       然后要求"走路相位必须前进"（走路分支每帧必做这件事）。
       ★ `phase` 在**角色身上**而不是任务身上 —— 这是本次改造的字段归属规则：
         "属于身体的"（speed/dir/phase/lane/x/z）留在角色，
         "属于当前这件事的"（停顿/冷却/阶段）搬进任务。
         探针一开始写成 `subRef.phase` 拿到 undefined，就是踩了这条规则的边。 */
    subRef.pauseT = 0;
    target.shop = null;
    target.shopCd = 1e9;
    const b = { phase: target.phase };
    const p0 = { x: target.obj.position.x, z: target.obj.position.z };
    window.__T.step(60, 1 / 60);
    const stillSame = target.tasks[S.TASK_SLOT.PRIMARY].sub === subRef;
    const ticking = stillSame && target.phase > b.phase;
    const moved = Math.hypot(target.obj.position.x - p0.x, target.obj.position.z - p0.z);
    return { evtGone, samePrimary, sameSub, ticking, moved, name: subRef.name };
  });
  check('★ 任务到期后自动退出 EVENT_TEMP 槽', resume.evtGone === true, resume.err || '槽已清空');
  check('★★ 被抢占的主任务**恢复了同一个实例**（不是重造）',
    resume.samePrimary === true && resume.sameSub === true,
    `PRIMARY 同一实例=${resume.samePrimary} · 子任务（${resume.name}）同一实例=${resume.sameSub}`);
  check('★★ 恢复后主任务重新开始推进（走路相位前进）',
    resume.ticking === true, `恢复后 1s：位移 ${(resume.moved || 0).toFixed(3)}m`);

  /* ── ⑤ pushTask 的两个语义：replace=false 与不可抢占 ── */
  const api = await page.evaluate(() => {
    const S = window.Scene3D;
    const sys = window.__T.sys;
    const a = sys.actors.find((x) => x.kind === 'ped');
    /* replace=false：槽已占用 → 不覆盖 */
    sys.pushTask(a, S.TASK_SLOT.EVENT_LONG, new S.WaitTask(1));
    const second = sys.pushTask(a, S.TASK_SLOT.EVENT_LONG, new S.WaitTask(2), false);
    const kept = a.tasks[S.TASK_SLOT.EVENT_LONG].t;
    /* interruptible=false：不可被抢占 */
    sys.clearTask(a, S.TASK_SLOT.EVENT_LONG);
    const lock = new S.WaitTask(1);
    lock.interruptible = false;
    lock.name = 'locked';
    sys.pushTask(a, S.TASK_SLOT.EVENT_LONG, lock);
    const replaced = sys.pushTask(a, S.TASK_SLOT.EVENT_LONG, new S.WaitTask(9));
    const stillLocked = a.tasks[S.TASK_SLOT.EVENT_LONG] === lock;
    sys.clearTask(a, S.TASK_SLOT.EVENT_LONG);
    return { second, kept, replaced, stillLocked, cleared: a.tasks[S.TASK_SLOT.EVENT_LONG] === null };
  });
  check('replace=false 时不覆盖已有任务', api.second === false, `返回 ${api.second}`);
  check('interruptible=false 的任务不能被抢占', api.replaced === false && api.stillLocked === true,
    `push 返回 ${api.replaced} · 原任务仍在槽里=${api.stillLocked}`);
  check('clearTask 能清空指定的槽', api.cleared === true);

  /* ── ⑥ ComplexTask 按序列串子任务（逛店的 go → hold）── */
  const cx = await page.evaluate(() => {
    const S = window.Scene3D;
    const sys = window.__T.sys;
    const a = sys.actors.find((x) => x.kind === 'ped');
    /* 把行人变成一个"顾客"：目的地放在正前方 3m，冷却立即到期。 */
    a.shop = { x: a.obj.position.x, z: a.obj.position.z + 3 * (a.dir > 0 ? 1 : -1) };
    a.shopCd = 0;
    const seen = { goto: false, stand: false, shopTask: false, stages: [] };
    for (let i = 0; i < 900; i++) {
      window.__T.step(1, 1 / 60);
      /* ★ 层级要看对：PRIMARY 槽上是 PedAmbientTask（决策者），
         逛店任务挂在它的 `.sub`，再下一层才是 goto / stand。
         写成 `tasks[PRIMARY].name === 'shop'` 是**永远为假**的断言。 */
      const ambient = a.tasks[S.TASK_SLOT.PRIMARY];
      const shop = ambient && ambient.sub;
      if (shop && shop.name === 'shop') {
        seen.shopTask = true;
        if (seen.stages[seen.stages.length - 1] !== shop.stage) seen.stages.push(shop.stage);
        const inner = shop.sub;
        if (inner && inner.name === 'goto') seen.goto = true;
        if (inner && inner.name === 'stand') seen.stand = true;
      }
    }
    return { seen, z: +a.obj.position.z.toFixed(2), shopZ: +a.shop.z.toFixed(2) };
  });
  check('★ ComplexTask 按序列串起子任务（goto → stand）',
    cx.seen.shopTask && cx.seen.goto && cx.seen.stand,
    `见到 shop=${cx.seen.shopTask} · goto=${cx.seen.goto} · stand=${cx.seen.stand} · stage 走位 ${cx.seen.stages.join('→')}`);

  /* ── ⑦ 性能：任务层没有引入每帧分配 —— 推进 600 帧后角色数不变、无报错 ── */
  const perf = await page.evaluate(() => {
    const n0 = window.__T.sys.actors.length;
    const t0 = performance.now();
    window.__T.step(600, 1 / 60);
    const ms = performance.now() - t0;
    return { n0, n1: window.__T.sys.actors.length, ms: +(ms).toFixed(1) };
  });
  check('推进 600 帧后角色数不变（任务层没有泄漏/重造角色）', perf.n0 === perf.n1,
    `${perf.n0} → ${perf.n1} · 耗时 ${perf.ms}ms（10s 仿真）`);
  /* 10 秒仿真 × 33 个角色；超过 1500ms 说明每帧在分配大对象。 */
  check('任务层推进开销合理（10s 仿真 < 1500ms）', perf.ms < 1500, `${perf.ms}ms`);

  console.log('\n=== 页面报错 ===');
  console.log(errors.length ? `  ❌ ${errors.length} 条：${errors.slice(0, 3).join(' | ')}` : '   （无）');
  check('无页面报错', errors.length === 0, `${errors.length} 条`);

  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════`);
  await browser.close();
  await closeServer(own);
  process.exit(fail ? 1 : 0);
})();

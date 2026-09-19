#!/usr/bin/env node
/**
 * 命名 NPC 验证（熟人在 3D 街上）。
 *
 * ── 为什么这个脚本必须存在 ────────────────────────────────────────────────
 *   这一族功能的失败方式全部是**静默**的：
 *     · 名单没接线   → 街上永远只有匿名流人，画面完全正常，零报错
 *                      （这正是它此前几十轮都没被发现的原因）
 *     · 名字条没挂上 → 只是"少了几个字"，不截图近看不出来
 *     · 外观吃了场景 rng → 同一个人每次进场长得都不一样，
 *                      而"持久且独特的个体"正是这套系统存在的唯一理由
 *     · 换人走了 setWorld → 整条街的行人/车流重置，**看起来像 bug**，
 *                      但没有任何断言会红
 *     · 锚点没预留   → 命名 NPC 与匿名摊主站在同一个点上（穿模）
 *
 *   所以这里断言的是五件事：
 *     ① 名单 → 场景：给几个就出现几个，且**是那几个**（按 id 核对，不是只数个数）
 *     ② 每人带 `__actorKind='npc'` + `__actorId` + 头顶名字条（**查世界坐标**）
 *     ③ 外观由 npcId 决定：同一 id 两次载入，材质配色完全一致
 *     ④ ★ 软刷新是"换人不换街"：行人/车/摊主/动物计数逐个不变
 *     ⑤ 锚点预留生效：命名 NPC 之间、以及和摊主之间不重叠
 *
 * 用法：node scripts/verify-named-npcs.cjs
 */

const path = require('path');
const fs = require('fs');
const vm = require('vm');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');
const { EDGE, attachErrorSink } = require('./_boot.cjs');
const { ensureServer, closeServer } = require('./lib/serve.cjs');

const PORT = Number(process.env.PORT || 8983);
const ROOT = path.resolve(__dirname, '..');
const DOC = '/dev/_3dtest/shell.html';
const PROBE = 'dev/_3dtest/bundle-probe.js';

let pass = 0, fail = 0;
function check(name, ok, detail) {
  (ok ? pass++ : fail++);
  console.log(`  ${ok ? '✅' : '❌'} ${name}${detail ? `  — ${detail}` : ''}`);
}

/* ★ 探针页加载的是构建产物，不是源码。改了 actors.js 却不重建 → 测的是旧代码。 */
function rebuild() {
  console.log('重建探针包（避免用旧代码验证新代码）…');
  execFileSync(process.execPath, [path.join(__dirname, 'build-3d-bundle.cjs'), '--out', PROBE],
    { cwd: ROOT, stdio: 'pipe' });
}

/* ── 静态检查：游戏侧到底有没有把名单交出去 ────────────────────────────────
   ★ 为什么单独查这一条：3D 侧写得再对，只要游戏侧没接线，
     街上的熟人就是 0 个 —— 而那种情况**不会红任何 3D 断言**。 */
function staticChecks() {
  console.log('① 游戏侧接线（静态）');
  const src = fs.readFileSync(path.join(ROOT, 'src/js/scene3d_bridge.js'), 'utf8');
  check('存在 npcsAt() 解算函数', /function npcsAt\s*\(/.test(src));
  check('readHUD 返回 npcs 字段', /npcs:\s*npcsAt\(locId\)/.test(src));
  const calls = (src.match(/loadLocation\([^)]*npcs:\s*npcsAt\(/g) || []).length;
  check('三处 loadLocation 都带上了名单（缩略景/浮层/首帧）', calls >= 3, `实测 ${calls} 处`);

  /* 名单解算到底能不能得出非空结果 —— 用**同一批数据与同一个函数**在 node 侧复算。
     只查"函数存在"是不够的：日程数据全空、或 _mapTimeSlot 映射错，
     函数照样"存在"但恒返回空。 */
  const ctx = { console, window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'src/js/data/npcs.js'), 'utf8')
    + '\nglobalThis.__NPCS = NPCS;', ctx);
  /* npc_location_bridge 是 IIFE，把 getNpcCurrentLocation 挂在 window 上 */
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'src/js/core/npc_location_bridge.js'), 'utf8'), ctx);
  const NPCS = ctx.__NPCS;
  check('NPC 数据可加载', Array.isArray(NPCS) && NPCS.length > 0, `${NPCS ? NPCS.length : 0} 个`);
  const withSched = NPCS.filter((n) => n && n.schedule).length;
  check('全部 NPC 都带日程', withSched === NPCS.length, `${withSched}/${NPCS.length}`);

  /* 复算"某个时段某个地点有几个人"，取下午的商业区（实测最多的一档）。 */
  const counts = {};
  for (const n of NPCS) {
    const s = n.schedule || {};
    const at = s.afternoon || s.evening || n.location;
    if (at) counts[at] = (counts[at] || 0) + 1;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || ['', 0];
  check('名单解算能得出非空结果（下午档）', top[1] >= 3, `最多 ${top[0]} 有 ${top[1]} 人`);
  return NPCS;
}

(async () => {
  rebuild();
  const NPCS = staticChecks();

  const own = await ensureServer({ root: ROOT, port: PORT, label: '命名NPC验证' });
  const browser = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = attachErrorSink(page);

  await page.goto(`http://127.0.0.1:${PORT}${DOC}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => !!window.Scene3D && window.__shellReady === true, { timeout: 60000 });

  /* 用真实存在的 3 个 NPC（城中村早/晚档的人），断言才有意义 —— 
     编一个不存在的 id 也能"生成成功"，但那是假验证。 */
  const sample = NPCS.filter((n) => (n.schedule && (n.schedule.morning === 'slum' || n.schedule.evening === 'slum')))
    .slice(0, 3)
    .map((n) => ({ id: n.id, name: n.name, role: n.role || '' }));
  console.log(`\n② 名单 → 场景（城中村 · ${sample.length} 位熟人：${sample.map((s) => s.name).join('、')}）`);

  const r = await page.evaluate(({ list }) => {
    const v = window.__shell.view3d;
    v.loadLocation('slum', { npcs: list });
    const grp = v.scene.children.find((g) => g.name === 'actors');
    const Y = (o) => {
      const e = o.matrixWorld.elements;
      return { x: e[12], y: e[13], z: e[14] };
    };
    grp.updateMatrixWorld(true);
    const named = [];
    grp.traverse((o) => {
      if (!o.userData || o.userData.__actorKind !== 'npc') return;
      let sprite = null;
      o.traverse((c) => { if (c.isSprite && !sprite) sprite = c; });
      named.push({
        id: o.userData.__actorId,
        kind: o.userData.__actorKind,
        pos: Y(o),
        spriteY: sprite ? Y(sprite).y : null,
        hasSprite: !!sprite,
        look: (() => {
          const out = [];
          o.traverse((c) => {
            if (c.isMesh && c.material && c.material.color) out.push(c.material.color.getHexString());
          });
          return out.sort().join(',');
        })(),
      });
    });
    const nums = {};
    grp.traverse((o) => {
      const k = o.userData && o.userData.__actorKind;
      if (k) nums[k] = (nums[k] || 0) + 1;
    });
    return { named, counts: v.actors.counts, namedIds: v.namedIds, walk: nums };
  }, { list: sample });

  check('命名 NPC 数量 == 名单长度', r.named.length === sample.length,
    `场景 ${r.named.length} · 名单 ${sample.length}`);
  const gotIds = r.named.map((n) => n.id).sort().join(',');
  const wantIds = sample.map((s) => s.id).sort().join(',');
  /* ★ 断言"是那几个"而不是"有几个" —— 只数个数的话，随机撒几个匿名人也照样过。 */
  check('★ 站着的正是名单上那几个人（按 id 核对）', gotIds === wantIds, gotIds || '(空)');
  check('counts.npc 与场景内一致', r.counts.npc === sample.length, `counts.npc=${r.counts.npc}`);
  check('namedIds 与名单一致', (r.namedIds || []).join(',') === sample.map((s) => s.id).join(','));

  console.log('\n③ 每人带标记与头顶名字条');
  check('每个命名 NPC 都写了 __actorId', r.named.every((n) => !!n.id));
  check('每人头顶都挂到了名字条', r.named.every((n) => n.hasSprite),
    `缺 ${r.named.filter((n) => !n.hasSprite).length} 个`);
  /* ★ 查**世界坐标**：名字条是 obj 的子节点，而 obj 有 scale～
     只看 position.y 会把缩放漏掉（本项目在"手掌挂手臂下"上吃过一次同款亏）。 */
  const yOk = r.named.every((n) => n.spriteY !== null && n.spriteY > 1.7 && n.spriteY < 2.2);
  check('名字条在头顶高度（1.7~2.2m，世界坐标）', yOk,
    r.named.map((n) => n.spriteY === null ? 'null' : n.spriteY.toFixed(2)).join(' / '));
  const finite = r.named.every((n) => Number.isFinite(n.pos.x) && Number.isFinite(n.pos.z));
  check('命名 NPC 坐标是有限数（没有 NaN）', finite);

  console.log('\n④ 锚点预留：命名 NPC 之间、以及和摊主之间不重叠');
  const r2 = await page.evaluate(() => {
    const v = window.__shell.view3d;
    const grp = v.scene.children.find((g) => g.name === 'actors');
    grp.updateMatrixWorld(true);
    const all = [];
    grp.traverse((o) => {
      const k = o.userData && o.userData.__actorKind;
      if (k !== 'npc' && k !== 'keeper') return;
      const e = o.matrixWorld.elements;
      all.push({ k, x: e[12], z: e[14] });
    });
    let worst = Infinity, pair = null;
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const d = Math.hypot(all[i].x - all[j].x, all[i].z - all[j].z);
        if (d < worst) { worst = d; pair = `${all[i].k}↔${all[j].k}`; }
      }
    }
    return { n: all.length, worst: Number.isFinite(worst) ? worst : null, pair };
  });
  /* 0.6m = 两个人形的肩宽量级。比这更近就已经穿模了。 */
  check('站位的最近间距 > 0.6m（无穿模）', r2.worst !== null && r2.worst > 0.6,
    `最近 ${r2.worst === null ? 'n/a' : r2.worst.toFixed(2)}m（${r2.pair}）· 共 ${r2.n} 个站位角色`);

  console.log('\n⑤ ★ 软刷新：换人不换街');
  const r3 = await page.evaluate(({ other }) => {
    const v = window.__shell.view3d;
    const before = { ...v.actors.counts };
    const beforeIds = v.namedIds.join(',');
    v.setNamedNpcs(other);
    const after = { ...v.actors.counts };
    v.setNamedNpcs(other);            // 再来一次：名单没变应当完全无副作用
    const again = { ...v.actors.counts };
    return { before, after, again, beforeIds, afterIds: v.namedIds.join(',') };
  }, { other: [{ id: '__other__', name: '另一个人' }] });

  const streetKeys = ['ped', 'car', 'bike', 'dog', 'cat', 'bird', 'insect', 'keeper'];
  const drifted = streetKeys.filter((k) => (r3.before[k] || 0) !== (r3.after[k] || 0));
  /* ★★ 这是本脚本最值钱的一条断言。
     换人若走了 setWorld()，整条街会被重建 —— 行人和车辆全部重置，
     玩家在场景里看到的是一次"瞬移+清空"。画面照常渲染、控制台不报错，
     只有这条断言能守住它。 */
  check('★★ 换人不换街（行人/车/摊主/动物计数逐个不变）', drifted.length === 0,
    drifted.length ? `漂移：${drifted.map((k) => `${k} ${r3.before[k]}→${r3.after[k]}`).join(' · ')}`
      : `ped ${r3.before.ped || 0} · car ${r3.before.car || 0} · keeper ${r3.before.keeper || 0} 全部保持一致`);
  check('名单真的换掉了', r3.afterIds !== r3.beforeIds, `${r3.beforeIds} → ${r3.afterIds}`);
  check('counts.npc 跟着名单走', r3.after.npc === 1, `npc=${r3.after.npc}`);
  check('名单没变时是幂等的（不重建）',
    JSON.stringify(r3.after) === JSON.stringify(r3.again));

  console.log('\n⑥ 匿名摊主可被统计（KIND 表缺 KEEPER 键的回归守卫）');
  /* 原表里没有 KEEPER 键 → userData.__actorKind 恒为 undefined，
     摊主在 stats 里全归到 "undefined" 那一类，**按种类数不到任何摊主**。 */
  check('摊主归到了 keeper 这一类（不是 undefined）', typeof r.walk.keeper === 'number' && r.walk.keeper > 0,
    `keeper=${r.walk.keeper} · undefined=${r.walk.undefined || 0}`);
  check('没有任何角色落在 undefined 类里', !r.walk.undefined, `undefined=${r.walk.undefined || 0}`);

  console.log('\n⑦ 外观由 npcId 决定（跨载入稳定）');
  const look1 = r.named.map((n) => `${n.id}:${n.look}`).sort().join('|');
  const look2 = await page.evaluate(({ list }) => {
    const v = window.__shell.view3d;
    v.loadLocation('slum', { npcs: list });
    const grp = v.scene.children.find((g) => g.name === 'actors');
    const out = [];
    grp.traverse((o) => {
      if (!o.userData || o.userData.__actorKind !== 'npc') return;
      const m = [];
      o.traverse((c) => { if (c.isMesh && c.material && c.material.color) m.push(c.material.color.getHexString()); });
      out.push(`${o.userData.__actorId}:${m.sort().join(',')}`);
    });
    return out.sort().join('|');
  }, { list: sample });
  /* ★ 若外观吃了场景 rng，同一个人第二次进场就会换脸 —— 那"这是同一个人"就不成立了。 */
  check('★ 同一 npcId 两次载入外观完全一致', look1 === look2,
    look1 === look2 ? '配色指纹相同' : `\n      第一次 ${look1.slice(0, 90)}\n      第二次 ${look2.slice(0, 90)}`);

  console.log('\n⑧ 空名单是合法状态（多数地点多数时段本来就没有熟人）');
  const r4 = await page.evaluate(() => {
    const v = window.__shell.view3d;
    const before = { ...v.actors.counts };
    v.setNamedNpcs([]);
    const after = { ...v.actors.counts };
    return { before, after };
  });
  check('空名单后 npc 归零', !r4.after.npc, `npc=${r4.after.npc || 0}`);
  check('空名单不影响街道其他角色',
    streetKeys.every((k) => (r4.before[k] || 0) === (r4.after[k] || 0)));

  console.log('\n=== 页面报错 ===');
  if (errors.length) errors.slice(0, 6).forEach((e) => console.log('   ❌ ' + e.slice(0, 150)));
  else console.log('   （无）');
  check('无页面报错', errors.length === 0, errors.length ? `${errors.length} 条` : '0 条');

  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════`);
  await browser.close();
  await closeServer(own);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

#!/usr/bin/env node
/**
 * NPC 立绘对话框门禁 + 实物取证（2026-09-19）
 *
 * ── 为什么必须有这个脚本 ─────────────────────────────────────────────────
 * 恒稳要求"完全复刻《大多数》的方法"：模型通用、靠对话框立绘区分人。
 * 17 个 NPC 的立绘早就生成好了（src/images/avatars/），但从未有任何 UI
 * 渲染它 —— 本门禁守的是"立绘真的出现在对话框里"这件事，断言全是数：
 *   ① 资产完整性：npc.avatar 字段 ↔ 磁盘文件一一对应（src 与 dist 两边）
 *   ② 打开对话 → img 真实解码成功（naturalWidth>0，杀掉"裂图图标"）
 *   ③ 立绘 404 → canvas 降级真的顶上（.npc-talk-fallback 存在）
 *   ④ 「继续」真的能关（npcTalkOpen()===false）
 *   ⑤ 3D-first 皮肤下：z-index ≥9500 且按钮 pointer-events=auto（能点）
 *   ⑥ 页面无 JS 错误
 * ⚠ 不得与其它浏览器脚本并行运行（会留下成片僵尸 msedge，见 memory）。
 *
 * 用法：node scripts/verify-npc-dialog.cjs
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');
const { EDGE, attachErrorSink } = require('./_boot.cjs');
const { ensureServer, closeServer } = require('./lib/serve.cjs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dev/_3dtest/shots-npcdialog');
const PORT = Number(process.env.PORT || 8993);

const results = [];
function ok(name, pass, detail) {
  results.push({ name, pass: !!pass, detail });
  console.log(`  ${pass ? '✓' : '✗'} ${name}${detail ? '　→ ' + detail : ''}`);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  /* ── ① 资产完整性（node 侧，纯文件系统） ── */
  console.log('\n── ① 资产完整性：npc.avatar ↔ 磁盘文件 ──');
  const npcsSrc = fs.readFileSync(path.join(ROOT, 'src/js/data/npcs.js'), 'utf8');
  const avatarRefs = [...npcsSrc.matchAll(/avatar:\s*"([^"]+)"/g)].map((m) => m[1]);
  ok('NPC 数据声明了 avatar 字段（≥12 个）', avatarRefs.length >= 12, `${avatarRefs.length} 个`);
  const missSrc = avatarRefs.filter((p) => !fs.existsSync(path.join(ROOT, 'src', p)));
  ok('src/ 下立绘文件全部存在', missSrc.length === 0,
    missSrc.length ? '缺 ' + missSrc.join(',') : `${avatarRefs.length} 个全在`);
  const missDist = avatarRefs.filter((p) => !fs.existsSync(path.join(ROOT, 'dist', p)));
  ok('dist/ 下立绘文件全部存在（build 会拷贝）', missDist.length === 0,
    missDist.length ? '缺 ' + missDist.join(',') : `${avatarRefs.length} 个全在`);

  /* ── 浏览器侧 ── */
  console.log('\n重建浏览器环境…');
  const own = await ensureServer({ root: path.join(ROOT, 'src'), port: PORT, label: 'NPC立绘对话取证' });
  const browser = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const pageErrs = attachErrorSink(page);
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(
    () => typeof window.NPCS !== 'undefined' && typeof window.showNpcTalk === 'function',
    { timeout: 60000 },
  );
  const settle = (frames = 25) => page.evaluate((n) => new Promise((r) => {
    let i = 0;
    const f = () => (++i >= n ? r(i) : requestAnimationFrame(f));
    requestAnimationFrame(f);
  }), frames);
  const shot = async (name) => {
    await settle(12);
    await page.screenshot({ path: path.join(OUT, name) });
    console.log(`  · ${name}`);
  };

  /* ── ② 打开真实 NPC 对话：立绘真的解码 ── */
  console.log('\n── ② 王大婶对话：立绘真实加载 ──');
  await page.evaluate(() => {
    const npc = window.NPCS.find((n) => n.id === 'aunt_wang') || window.NPCS[0];
    window.showNpcTalk({ npc, line: '小伙子，这个月房租该交了啊！', affinity: 32, gain: 6 });
  });
  await settle();
  const st = await page.evaluate(() => {
    const box = document.querySelector('.npc-talk-modal.is-open');
    if (!box) return { open: false };
    const img = box.querySelector('img.npc-talk-portrait');
    return {
      open: true,
      imgLoaded: !!img && img.complete && img.naturalWidth > 0,
      imgSrc: img && img.getAttribute('src'),
      name: (box.querySelector('.npc-talk-name') || {}).textContent,
      lineHas: ((box.querySelector('.npc-talk-line') || {}).textContent || '').includes('房租'),
      affShown: ((box.querySelector('.npc-talk-affinity') || {}).textContent || '').includes('32'),
      portraitPx: img ? [img.naturalWidth, img.naturalHeight] : null,
    };
  });
  ok('对话框打开', st.open === true);
  ok('立绘 img 真实解码（naturalWidth>0）', st.imgLoaded === true,
    st.portraitPx ? `${st.portraitPx[0]}×${st.portraitPx[1]} · ${st.imgSrc}` : '未解码');
  ok('名牌显示 NPC 名字', st.name === '王大婶', st.name);
  ok('台词进入对话框', st.lineHas === true);
  ok('好感度显示', st.affShown === true);
  await shot('npcdialog-auntwang.png');

  /* ── ③ 降级：404 立绘 → canvas 兜底 ── */
  console.log('\n── ③ 降级：立绘缺失 → 程序化 canvas ──');
  await page.evaluate(() => {
    window.showNpcTalk({
      npc: { id: 'test_fallback', name: '测试仔', role: '路人', avatar: 'images/avatars/__nope__.png' },
      line: '这张立绘是故意 404 的。',
    });
  });
  await page.waitForFunction(() => {
    const w = document.querySelector('.npc-talk-portrait-wrap');
    return !!w && !!w.querySelector('canvas.npc-talk-fallback');
  }, { timeout: 8000 }).catch(() => {});
  const fb = await page.evaluate(() => {
    const cv = document.querySelector('.npc-talk-portrait-wrap canvas.npc-talk-fallback');
    return { has: !!cv, w: cv && cv.width, h: cv && cv.height, name: (document.querySelector('.npc-talk-name') || {}).textContent };
  });
  ok('404 立绘降级为 canvas（不空白、不抛）', fb.has === true, fb.has ? `${fb.w}×${fb.h}` : '未降级');
  ok('降级后名牌仍更新', fb.name === '测试仔', fb.name);
  await shot('npcdialog-fallback.png');

  /* ── ④ 「继续」真的能关 ── */
  console.log('\n── ④ 关闭路径 ──');
  await page.evaluate(() => document.querySelector('.npc-talk-btn.is-primary').click());
  await page.waitForFunction(() => window.npcTalkOpen() === false, { timeout: 4000 }).catch(() => {});
  const closed = await page.evaluate(() => window.npcTalkOpen());
  ok('「继续」关闭对话框', closed === false);

  /* ── ⑤ 3D-first 皮肤下可用 ── */
  console.log('\n── ⑤ 3D-first 皮肤兜底 ──');
  await page.evaluate(() => {
    document.body.classList.add('s3-first-mode');
    const npc = window.NPCS.find((n) => n.id === 'boss_li') || window.NPCS[1];
    window.showNpcTalk({ npc, line: '做生意讲究和气，懂吧？', affinity: 10 });
  });
  await settle();
  const skin = await page.evaluate(() => {
    const box = document.querySelector('.npc-talk-modal');
    if (!box) return { exists: false };
    const cs = getComputedStyle(box);
    const btn = box.querySelector('.npc-talk-btn');
    const bs = btn ? getComputedStyle(btn) : null;
    return {
      exists: true,
      z: parseInt(cs.zIndex, 10) || 0,
      display: cs.display,
      btnPointer: bs ? bs.pointerEvents : null,
      imgLoaded: (() => { const i = box.querySelector('img.npc-talk-portrait'); return !!i && i.complete && i.naturalWidth > 0; })(),
    };
  });
  ok('3D 皮肤下对话框可见', skin.exists && skin.display === 'flex', `display=${skin.display}`);
  ok('z-index 被 3D 兜底抬到 ≥9500', skin.z >= 9500, `z=${skin.z}`);
  ok('按钮可点击（pointer-events=auto）', skin.btnPointer === 'auto', skin.btnPointer);
  ok('3D 模式下立绘同样加载', skin.imgLoaded === true);
  await shot('npcdialog-3dskin.png');
  await page.evaluate(() => {
    document.body.classList.remove('s3-first-mode');
    window.hideNpcTalk();
  });

  /* ── ⑥ 页面健康 ── */
  console.log('\n── ⑥ 页面健康 ──');
  ok('页面无 JS 错误', pageErrs.length === 0, `${pageErrs.length} 条${pageErrs.length ? '：' + pageErrs[0] : ''}`);

  const fail = results.filter((r) => !r.pass).length;
  console.log(`\n═══ NPC 立绘对话框：${results.length - fail} / ${results.length} 通过 ═══`);
  console.log(`截图 → dev/_3dtest/shots-npcdialog`);

  await browser.close();
  if (own) await closeServer();
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

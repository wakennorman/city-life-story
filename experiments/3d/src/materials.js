import * as THREE from 'three';

/* ── Canvas 程序化纹理 ─────────────────────────────────────────────────────
   全部在运行时生成，无外部图片依赖。这样 29 个地点可以参数化扩展，
   不需要为每栋楼单独出图，风格也不会散。
   ──────────────────────────────────────────────────────────────────────── */

const W = 256;

function canvas(w = W, h = W) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function toTexture(c, rx = 1, ry = 1) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 8;
  return t;
}

function grain(ctx, w, h, amount) {
  const img = ctx.getImageData(0, 0, w, h), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function blotch(ctx, w, h, count, color, maxR = 26) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = color(Math.random());
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, 4 + Math.random() * maxR, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* 瓷砖外墙：城中村最常见的白瓷砖，发霉发黑 */
export function tileWallTex(opt = {}) {
  const { base = '#c9c6bc', grout = '#9c9a90', tile = 22, water = 16 } = opt;
  const c = canvas(), ctx = c.getContext('2d');
  ctx.fillStyle = base; ctx.fillRect(0, 0, W, W);
  ctx.strokeStyle = grout; ctx.lineWidth = 1.1;
  for (let x = 0; x <= W; x += tile) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, W); ctx.stroke(); }
  for (let y = 0; y <= W; y += tile) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  for (let i = 0; i < water; i++) {
    const x = Math.random() * W;
    const g = ctx.createLinearGradient(x, 0, x, W);
    g.addColorStop(0, `rgba(74,78,68,${0.10 + Math.random() * 0.18})`);
    g.addColorStop(1, 'rgba(74,78,68,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, 4 + Math.random() * 12, W);
  }
  blotch(ctx, W, W, 34, a => `rgba(62,66,58,${0.03 + a * 0.07})`);
  grain(ctx, W, W, 20);
  const g = ctx.createLinearGradient(0, W * 0.7, 0, W);
  g.addColorStop(0, 'rgba(56,60,50,0)');
  g.addColorStop(1, 'rgba(56,60,50,0.40)');
  ctx.fillStyle = g; ctx.fillRect(0, W * 0.7, W, W * 0.3);
  return toTexture(c);
}

/* 水泥 / 地面：湿、脏、有裂缝 */
export function concreteTex(opt = {}) {
  const { base = '#7e8078', crack = 18, wet = 0.35 } = opt;
  const c = canvas(), ctx = c.getContext('2d');
  ctx.fillStyle = base; ctx.fillRect(0, 0, W, W);
  blotch(ctx, W, W, 60, a => `rgba(52,55,50,${0.02 + a * 0.06})`, 34);
  blotch(ctx, W, W, 30, a => `rgba(150,150,142,${0.015 + a * 0.04})`, 22);
  ctx.strokeStyle = 'rgba(42,45,40,0.5)';
  for (let i = 0; i < crack; i++) {
    ctx.lineWidth = 0.6 + Math.random() * 1.3;
    ctx.beginPath();
    let x = Math.random() * W, y = Math.random() * W;
    ctx.moveTo(x, y);
    for (let s = 0; s < 5; s++) {
      x += (Math.random() - 0.5) * 46;
      y += (Math.random() - 0.5) * 46;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  if (wet > 0) {
    for (let i = 0; i < 10; i++) {
      const g = ctx.createRadialGradient(
        Math.random() * W, Math.random() * W, 2,
        Math.random() * W, Math.random() * W, 30 + Math.random() * 50);
      g.addColorStop(0, `rgba(38,44,46,${wet * 0.5})`);
      g.addColorStop(1, 'rgba(38,44,46,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, W);
    }
  }
  grain(ctx, W, W, 26);
  return toTexture(c);
}

/* 卷帘门：横向条纹 */
export function shutterTex() {
  const c = canvas(128, W), ctx = c.getContext('2d');
  ctx.fillStyle = '#6b6f6a'; ctx.fillRect(0, 0, 128, W);
  for (let y = 0; y < W; y += 9) {
    ctx.fillStyle = 'rgba(30,34,32,0.42)'; ctx.fillRect(0, y, 128, 3);
    ctx.fillStyle = 'rgba(150,154,146,0.16)'; ctx.fillRect(0, y + 3, 128, 1.5);
  }
  blotch(ctx, 128, W, 24, a => `rgba(120,80,50,${0.05 + a * 0.14})`, 18);
  grain(ctx, 128, W, 16);
  return toTexture(c);
}

/* 招牌：红底白字 */
export function signTex(text, opt = {}) {
  const { bg = '#b0342a', fg = '#f2efe6', w = 512, h = 128 } = opt;
  const c = canvas(w, h), ctx = c.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;
  const size = Math.min(h * 0.62, (w * 0.86) / Math.max(text.length, 1));
  ctx.font = `700 ${size}px "Microsoft YaHei","PingFang SC",sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h * 0.54);
  ctx.strokeStyle = 'rgba(30,26,22,0.5)'; ctx.lineWidth = 5;
  ctx.strokeRect(2.5, 2.5, w - 5, h - 5);
  blotch(ctx, w, h, 16, a => `rgba(40,34,28,${0.04 + a * 0.12})`, 26);
  grain(ctx, w, h, 14);
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/* 屋顶：铁皮 / 防水油毡 */
export function roofTex() {
  const c = canvas(), ctx = c.getContext('2d');
  ctx.fillStyle = '#5c6058'; ctx.fillRect(0, 0, W, W);
  for (let x = 0; x < W; x += 32) {
    ctx.fillStyle = `rgba(28,32,30,${0.2 + Math.random() * 0.2})`;
    ctx.fillRect(x, 0, 2, W);
  }
  blotch(ctx, W, W, 40, a => `rgba(92,64,40,${0.05 + a * 0.18})`, 30);
  grain(ctx, W, W, 22);
  return toTexture(c);
}

/* 窗玻璃：暗、脏、映天光 */
export function glassTex() {
  const c = canvas(64, 64), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, '#4a5560');
  g.addColorStop(0.5, '#333b44');
  g.addColorStop(1, '#242a31');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  grain(ctx, 64, 64, 12);
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/* ── 共享材质 ─────────────────────────────────────────────────────────────
   窗口/空调是复用率最高的构件（一栋楼几十个）。如果每次调用都 new 一个材质，
   全场景会产生上千个材质实例，后面的静态几何合并就彻底失效——
   合并是按材质分组的，材质不共享 = 合并不了 = draw call 爆炸。
   所以这里把它们提到模块级，惰性创建一次。
   ──────────────────────────────────────────────────────────────────────── */
let _winFrameMat = null, _winBarMat = null, _acBodyMat = null, _acFanMat = null;

/* 立面：窗框、铁栅 */
export function makeWindow(w = 0.9, h = 1.2) {
  if (!_winFrameMat) {
    _winFrameMat = new THREE.MeshStandardMaterial({ color: 0x8e9288, roughness: 0.85, metalness: 0.15 });
    _winBarMat = new THREE.MeshStandardMaterial({ color: 0x4a4d48, roughness: 0.6, metalness: 0.6 });
  }
  const g = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.08), _winFrameMat);
  g.add(frame);
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.82, h * 0.82),
    _glassMat());
  glass.position.z = 0.045;
  g.add(glass);
  for (let i = 1; i <= 4; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.025, h * 0.94, 0.025), _winBarMat);
    b.position.set(-w / 2 + (w * i) / 5, 0, 0.06);
    g.add(b);
  }
  const b2 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.94, 0.025, 0.025), _winBarMat);
  b2.position.set(0, 0, 0.06);
  g.add(b2);
  return g;
}

let _glass = null;
function _glassMat() {
  if (!_glassMat._m) {
    _glassMat._m = new THREE.MeshStandardMaterial({ map: _glass, roughness: 0.35, metalness: 0.25 });
  }
  return _glassMat._m;
}

export function initMaterials() {
  _glass = glassTex();
}

/* ── 以下为「全量地点」扩展所需的材质 ─────────────────────────────────────
   29 个地点跨越住宅/商业/工业/教育/政务/园林，只有瓷砖一种外墙撑不住。
   每种材质都保持低饱和，避免破坏晦暗调。
   ──────────────────────────────────────────────────────────────────────── */

/* 红砖墙：老旧小区 / 厂房 / 围墙 */
export function brickTex(opt = {}) {
  const { base = '#8a5f4a', mortar = '#6f6a60', rowH = 16, brickW = 34 } = opt;
  const c = canvas(), ctx = c.getContext('2d');
  ctx.fillStyle = mortar; ctx.fillRect(0, 0, W, W);
  for (let r = 0, y = 0; y < W; y += rowH, r++) {
    const off = (r % 2) * (brickW / 2);
    for (let x = -brickW; x < W + brickW; x += brickW) {
      const v = 0.82 + Math.random() * 0.36;
      const rr = Math.round(138 * v), gg = Math.round(95 * v), bb = Math.round(74 * v);
      ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
      ctx.fillRect(x + off + 1.2, y + 1.2, brickW - 2.4, rowH - 2.4);
    }
  }
  blotch(ctx, W, W, 40, a => `rgba(40,36,32,${0.03 + a * 0.10})`, 30);
  grain(ctx, W, W, 22);
  void base;
  return toTexture(c);
}

/* 彩钢板 / 波纹铁皮：厂房、围挡、集装箱 */
export function metalPanelTex(opt = {}) {
  const { base = '#6d7370', period = 14, vertical = false } = opt;
  const c = canvas(), ctx = c.getContext('2d');
  ctx.fillStyle = base; ctx.fillRect(0, 0, W, W);
  for (let i = 0; i < W; i += period) {
    const g = ctx.createLinearGradient(i, 0, i + period, 0);
    g.addColorStop(0, 'rgba(255,255,255,0.13)');
    g.addColorStop(0.5, 'rgba(0,0,0,0.20)');
    g.addColorStop(1, 'rgba(255,255,255,0.06)');
    ctx.fillStyle = g;
    if (vertical) ctx.fillRect(i, 0, period, W); else ctx.fillRect(0, i, W, period);
  }
  blotch(ctx, W, W, 34, a => `rgba(96,64,40,${0.04 + a * 0.16})`, 26);
  grain(ctx, W, W, 18);
  return toTexture(c);
}

/* 玻璃幕墙：写字楼 / 科技园 / 商场 */
export function curtainWallTex(opt = {}) {
  const { base = '#46525c', mullion = '#2c3238', cell = 32 } = opt;
  const c = canvas(), ctx = c.getContext('2d');
  ctx.fillStyle = base; ctx.fillRect(0, 0, W, W);
  // 每格玻璃有轻微明暗差，模拟反射天空的不同角度
  for (let y = 0; y < W; y += cell) {
    for (let x = 0; x < W; x += cell) {
      const v = 0.78 + Math.random() * 0.5;
      ctx.fillStyle = `rgba(${Math.round(96 * v)},${Math.round(112 * v)},${Math.round(124 * v)},0.85)`;
      ctx.fillRect(x + 1.5, y + 1.5, cell - 3, cell - 3);
      const g = ctx.createLinearGradient(x, y, x + cell, y + cell);
      g.addColorStop(0, 'rgba(190,205,215,0.16)');
      g.addColorStop(0.5, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(20,26,30,0.22)');
      ctx.fillStyle = g;
      ctx.fillRect(x + 1.5, y + 1.5, cell - 3, cell - 3);
    }
  }
  ctx.strokeStyle = mullion; ctx.lineWidth = 3;
  for (let i = 0; i <= W; i += cell) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, W); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
  }
  grain(ctx, W, W, 10);
  return toTexture(c);
}

/* 沥青路面 */
export function asphaltTex() {
  const c = canvas(), ctx = c.getContext('2d');
  ctx.fillStyle = '#4a4c4a'; ctx.fillRect(0, 0, W, W);
  blotch(ctx, W, W, 70, a => `rgba(30,32,33,${0.05 + a * 0.14})`, 40);
  blotch(ctx, W, W, 40, a => `rgba(120,122,118,${0.02 + a * 0.05})`, 18);
  for (let i = 0; i < 6; i++) {   // 裂缝
    ctx.strokeStyle = 'rgba(26,28,28,0.6)'; ctx.lineWidth = 1 + Math.random();
    ctx.beginPath();
    let x = Math.random() * W, y = Math.random() * W;
    ctx.moveTo(x, y);
    for (let s = 0; s < 6; s++) { x += (Math.random() - 0.5) * 60; y += (Math.random() - 0.5) * 60; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  grain(ctx, W, W, 30);
  return toTexture(c);
}

/* 人行道铺装：方砖 */
export function paverTex(opt = {}) {
  const { base = '#8b8a82', gap = '#706f68', tile = 42 } = opt;
  const c = canvas(), ctx = c.getContext('2d');
  ctx.fillStyle = gap; ctx.fillRect(0, 0, W, W);
  for (let y = 0; y < W; y += tile) {
    for (let x = 0; x < W; x += tile) {
      const v = 0.86 + Math.random() * 0.28;
      ctx.fillStyle = `rgb(${Math.round(155 * v)},${Math.round(154 * v)},${Math.round(146 * v)})`;
      ctx.fillRect(x + 1.5, y + 1.5, tile - 3, tile - 3);
    }
  }
  blotch(ctx, W, W, 30, a => `rgba(60,62,58,${0.03 + a * 0.08})`, 26);
  grain(ctx, W, W, 16);
  void base;
  return toTexture(c);
}

/* 草地：公园 / 高档小区 / 校园
   刻意做得很"灰绿"——饱和的草绿在晦暗调里会像贴纸一样跳出来。 */
export function grassTex(opt = {}) {
  const { base = '#454b3e' } = opt;
  const c = canvas(), ctx = c.getContext('2d');
  ctx.fillStyle = base; ctx.fillRect(0, 0, W, W);
  for (let i = 0; i < 2600; i++) {
    const v = 0.6 + Math.random() * 0.9;
    ctx.strokeStyle = `rgba(${Math.round(72 * v)},${Math.round(80 * v)},${Math.round(58 * v)},0.8)`;
    ctx.lineWidth = 1;
    const x = Math.random() * W, y = Math.random() * W;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (Math.random() - 0.5) * 4, y - 3 - Math.random() * 5); ctx.stroke();
  }
  blotch(ctx, W, W, 30, a => `rgba(38,42,32,${0.05 + a * 0.14})`, 34);
  grain(ctx, W, W, 14);
  return toTexture(c);
}

/* 大理石 / 花岗岩：政务、银行、高档场所的台阶与地面 */
export function stoneTex(opt = {}) {
  const { base = '#8f8b84' } = opt;
  const c = canvas(), ctx = c.getContext('2d');
  ctx.fillStyle = base; ctx.fillRect(0, 0, W, W);
  for (let i = 0; i < 30; i++) {
    ctx.strokeStyle = `rgba(60,56,52,${0.06 + Math.random() * 0.12})`;
    ctx.lineWidth = 0.6 + Math.random() * 1.6;
    ctx.beginPath();
    let x = Math.random() * W, y = Math.random() * W;
    ctx.moveTo(x, y);
    for (let s = 0; s < 4; s++) { x += (Math.random() - 0.5) * 110; y += (Math.random() - 0.5) * 40; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  blotch(ctx, W, W, 20, a => `rgba(160,156,148,${0.03 + a * 0.07})`, 40);
  grain(ctx, W, W, 12);
  return toTexture(c);
}

/* 木纹：寺庙、图书馆、客栈的门窗与梁柱 */
export function woodTex(opt = {}) {
  const { base = '#6b4f38' } = opt;
  const c = canvas(), ctx = c.getContext('2d');
  ctx.fillStyle = base; ctx.fillRect(0, 0, W, W);
  for (let i = 0; i < 90; i++) {
    ctx.strokeStyle = `rgba(${40 + Math.random() * 60},${28 + Math.random() * 40},${18 + Math.random() * 30},${0.12 + Math.random() * 0.22})`;
    ctx.lineWidth = 0.7 + Math.random() * 2.4;
    ctx.beginPath();
    let y = Math.random() * W;
    ctx.moveTo(0, y);
    for (let x = 0; x <= W; x += 32) { y += (Math.random() - 0.5) * 5; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  grain(ctx, W, W, 16);
  return toTexture(c);
}

/* 空调外机 */
export function makeACUnit() {
  if (!_acBodyMat) {
    _acBodyMat = new THREE.MeshStandardMaterial({ color: 0xa8a89e, roughness: 0.8, metalness: 0.1 });
    _acFanMat = new THREE.MeshStandardMaterial({ color: 0x5a5c56, roughness: 0.7, metalness: 0.3 });
  }
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.54, 0.32), _acBodyMat);
  g.add(body);
  const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 16), _acFanMat);
  fan.rotation.x = Math.PI / 2;
  fan.position.z = 0.17;
  g.add(fan);
  return g;
}

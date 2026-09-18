import * as THREE from 'three';
import { initMaterials } from './materials.js';
import { buildPalette } from './palette.js';
import { buildLocation, SPECS, LAYOUT_KIND } from './world.js';
import { mergeStatics, countScene } from './merge.js';
import { Player, IsoCamera } from './player.js';

/* ══ 渲染器 ═══════════════════════════════════════════════════════════════ */
const canvas = document.getElementById('view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.30;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();

/* ── 晦暗调：低饱和灰绿，阴天散射光 ──────────────────────────────────────
   1) 主光低角度斜射，拉长阴影制造压迫感
   2) 天光冷、地面反射暖，形成脏旧的城市色
   3) 雾把远景溶掉——这也让政务楼/医院这类大体量在广场远处"从雾里浮出来"
   ──────────────────────────────────────────────────────────────────────── */
const SKY = 0x59615a;
scene.background = new THREE.Color(SKY);
scene.fog = new THREE.FogExp2(0x555c55, 0.0155);

const hemi = new THREE.HemisphereLight(0x7d8d96, 0x42443c, 1.50);
scene.add(hemi);

/* 主光偏弱、环境光抬起来：晦暗调靠"整体灰度偏低 + 阴影软而深"，
   不是靠"直接曝黑"。暗到看不清细节就变成技术故障了。 */
const sun = new THREE.DirectionalLight(0xd8caa8, 2.15);
sun.position.set(16, 20, -14);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 110;
const S = 40;
sun.shadow.camera.left = -S; sun.shadow.camera.right = S;
sun.shadow.camera.top = S; sun.shadow.camera.bottom = -S;
sun.shadow.bias = -0.0009;
sun.shadow.normalBias = 0.022;
scene.add(sun);
scene.add(sun.target);

const amb = new THREE.AmbientLight(0x515861, 0.90);
scene.add(amb);

/* ══ 资源与状态 ═════════════════════════════════════════════════════════ */
initMaterials();
buildPalette();

const player = new Player(scene, [], new THREE.Vector3(0, 0, 10));
const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 0.1, 400);
const cam = new IsoCamera(camera, player.pos, []);

let world = null;
let gamedata = null;
let currentId = null;
let focused = null;      // 当前锁定的交互点

/* ══ 输入 ═══════════════════════════════════════════════════════════════ */
const keys = new Set();
const ui = {
  name: document.getElementById('loc-name'),
  desc: document.getElementById('loc-desc'),
  flavor: document.getElementById('flavor'),
  fps: document.getElementById('fps'),
  pos: document.getElementById('pos'),
  prompt: document.getElementById('prompt'),
  panel: document.getElementById('panel'),
  list: document.getElementById('loc-items'),      // 列表项容器
  listPanel: document.getElementById('loc-list'),  // 整个侧栏（控制展开）
  search: document.getElementById('loc-search'),
  badge: document.getElementById('badge'),
  loading: document.getElementById('loading'),
};

addEventListener('keydown', (e) => {
  if (e.target === ui.search) return;
  keys.add(e.code);
  if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
  if (e.code === 'KeyE') interact();
  if (e.code === 'Tab') { e.preventDefault(); toggleList(); }
  if (e.code === 'Escape') { ui.panel.classList.remove('on'); ui.listPanel.classList.remove('on'); }
});
addEventListener('keyup', (e) => keys.delete(e.code));
addEventListener('blur', () => keys.clear());
addEventListener('wheel', (e) => cam.zoom(e.deltaY * 0.012), { passive: true });
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* ══ 地点切换 ═══════════════════════════════════════════════════════════ */

function disposeLocation(w) {
  if (!w) return;
  w.group.traverse((o) => {
    if (o.isMesh && o.geometry) o.geometry.dispose();
  });
  scene.remove(w.group);
}

function loadLocation(id) {
  if (!gamedata) return;
  const t0 = performance.now();
  disposeLocation(world);

  world = buildLocation(scene, gamedata, id);
  const mergeStat = mergeStatics(world.group);
  const counts = countScene(world.group);

  player.setWorld({ colliders: world.colliders, spawn: world.spawn, bounds: world.bounds });
  cam.setWorld({ colliders: world.blockers, target: world.spawn, ...world.camera });
  cam.cur.copy(world.spawn);
  cam.apply(cam.cur);

  /* 出生点体检：直接判断出生点是否落在碰撞盒里。
     这比"走一段看位移多少"可靠得多——位移还受帧率影响，
     帧率一低就分不清是"被卡住"还是"跑得慢"。 */
  const sp = world.spawn, r = player.radius;
  const blockedBy = world.colliders.filter(c =>
    sp.x > c.minX - r && sp.x < c.maxX + r && sp.z > c.minZ - r && sp.z < c.maxZ + r).length;

  focused = null;
  ui.prompt.classList.remove('on');
  ui.panel.classList.remove('on');
  currentId = id;

  const m = world.meta;
  ui.name.textContent = `${m.icon || ''} ${m.name}`.trim();
  ui.desc.textContent = m.desc || '';
  ui.badge.textContent = `${world.stats.layoutName} · ${world.stats.tier}档 · ${LAYOUT_KIND[world.stats.layout] || ''}`;
  ui.badge.textContent = `${world.stats.layoutName} · 财富${world.stats.tier}档`;
  ui.flavor.textContent = pickFlavor(m.flavor);

  markActive(id);

  const ms = Math.round(performance.now() - t0);
  console.log(`[loc] ${m.name} ${ms}ms  网格 ${mergeStat.before}→${mergeStat.after}  三角面 ${counts.tris}  出生点遮挡 ${blockedBy}`);
  window.__lastBuild = { id, ms, ...mergeStat, tris: counts.tris, spawnBlocked: blockedBy };
}

/** 当天氛围文案：按日期 + 地点 id 选一条，和游戏内规则一致（稳定不刷新） */
function pickFlavor(list) {
  if (!list || !list.length) return '';
  const day = Math.floor(Date.now() / 86400000);
  const seed = (String(currentId || '').length * 7 + day) % list.length;
  return list[seed];
}

/* ══ 交互 ═══════════════════════════════════════════════════════════════ */

function nearestHotspot() {
  if (!world) return null;
  let best = null, bestD = Infinity;
  for (const h of world.hotspots) {
    const d = Math.hypot(player.pos.x - h.x, player.pos.z - h.z);
    if (d < h.radius && d < bestD) { bestD = d; best = h; }
  }
  return best;
}

function interact() {
  const h = focused;
  if (!h) return;
  const d = h.data || {};

  const KIND_LABEL = {
    work: '街头工作', action: '地点行动', extra: '扩展行动',
    service: '服务设施', trade: '买卖交易', risk: '违法行为', look: '环境',
  };
  const rows = [];

  if (h.kind === 'work') {
    const pay = d.payHint ? `¥${Math.round(d.payHint.min)} – ¥${Math.round(d.payHint.max)}` : '收入随能力浮动';
    rows.push(['单次收入', pay, true]);
    rows.push(['启动资金', d.startupCost ? '¥' + d.startupCost : '无', false]);
    /* jobs.js 里 risk 对象经常只给一半字段（有的只写 illness，不写 injury）。
       直接读 injury 会得到 undefined → "受伤 NaN%"。逐项判类型再拼。 */
    const rk = d.risk || {};
    const rkParts = [];
    if (typeof rk.injury === 'number') rkParts.push(`受伤 ${(rk.injury * 100).toFixed(1)}%`);
    if (typeof rk.illness === 'number') rkParts.push(`生病 ${(rk.illness * 100).toFixed(1)}%`);
    rows.push(['风险', rkParts.length ? rkParts.join(' · ') : '—', false]);
    rows.push(['数据来源', 'jobs.js', false]);
  } else if (h.kind === 'action') {
    rows.push(['消耗行动力', `AP ${d.apCost || 0}`, true]);
    rows.push(['收益区间', d.payEstimate ? '¥' + d.payEstimate : '不确定', false]);
    rows.push(['数据来源', 'actions.js', false]);
  } else if (h.kind === 'extra') {
    rows.push(['消耗行动力', `AP ${d.apCost || 0}`, true]);
    if (d.payEstimate) rows.push(['效果', d.payEstimate, false]);
    if (d.costEstimate) rows.push(['花费', `¥${d.costEstimate}`, false]);
    if (d.hint) rows.push(['地点范围', d.hint, false]);
    rows.push(['数据来源', 'phase1/actions_extra.js', false]);
  } else if (h.kind === 'risk') {
    const rg = d.rewardRange;
    rows.push(['收益区间', rg ? `¥${rg[0]} – ¥${rg[1]}` : '不确定', true]);
    rows.push(['消耗行动力', `AP ${d.apCost || 0}`, false]);
    rows.push(['被抓概率', d.catchProb != null ? `${(d.catchProb * 100).toFixed(0)}%` : '未知', false]);
    rows.push(['道德代价', d.moralityDelta != null ? `${d.moralityDelta}` : '—', false]);
    const p = d.penalty || {};
    const pen = [p.jailDays ? `拘留 ${p.jailDays} 天` : '', p.fine ? `罚款 ¥${p.fine}` : ''].filter(Boolean).join(' · ');
    if (pen) rows.push(['抓获处罚', pen, false]);
    rows.push(['数据来源', 'core/illegal_actions.js', false]);
  } else if (h.kind === 'service') {
    const prim = Object.entries(d.primary || {}).map(([k, v]) => `${STAT_CN[k] || k} +${v}`).join(' · ') || '—';
    rows.push(['消费', `¥${d.cost || 0}`, true]);
    rows.push(['消耗行动力', `AP ${d.ap || 0}`, false]);
    rows.push(['恢复效果', prim, false]);
    rows.push(['设施档次', `${d.tier || 2} 档`, false]);
    if (d.junkFood) rows.push(['标签', '垃圾食品（累计多会闹肠胃）', false]);
    if (d.lateNight) rows.push(['标签', '夜生活（累计多会失眠）', false]);
    rows.push(['数据来源', 'amenities.js', false]);
  } else if (h.kind === 'trade') {
    const buy = (d.buy || []).slice(0, 6).map(g => `${g.name} ¥${g.price}/${g.unit}`).join('　');
    const sell = (d.sell || []).slice(0, 6).map(g => `${g.name} ¥${g.price}/${g.unit}`).join('　');
    if (buy) rows.push(['这里能买', buy, true]);
    if (sell) rows.push(['这里好卖', sell, true]);
    if ((d.specialties || []).length) rows.push(['区域特产', d.specialties.join('　'), false]);
    if (d.vendingNote) rows.push(['摆摊提示', d.vendingNote, false]);
    rows.push(['数据来源', 'goods.js × priceMod', false]);
  } else {
    rows.push(['说明', d.desc || '这里暂时没有可交互的内容。', false]);
    if (d.type) rows.push(['功能区划', TYPE_CN[d.type] || d.type, false]);
    if (d.footfall != null) rows.push(['人流热度', `${Math.round(d.footfall * 100)}%`, false]);
    if (d.dailyProbability != null) rows.push(['事件概率', `${Math.round(d.dailyProbability * 100)}%`, false]);
    if ((d.specialties || []).length) rows.push(['区域特产', d.specialties.join('　'), false]);
    if ((d.priceMod || []).length) {
      rows.push(['价格系数', d.priceMod.map((p) => `${p.label} ×${p.value}`).join('　'), false]);
    }
    if (d.vendingNote) rows.push(['摆摊提示', d.vendingNote, false]);
    rows.push(['数据体检', '对过 jobs.js / amenities.js / actions.js / actions_extra.js / illegal_actions.js / goods.js 六个源，本地点均无条目', false]);
  }
  ui.panel.innerHTML = `
    <button class="close" id="panel-close">×</button>
    <div class="p-head">
      <span class="p-icon">${h.icon || '❓'}</span>
      <div>
        <h3>${h.label}</h3>
        <div class="p-sub">${h.place} · ${KIND_LABEL[h.kind] || ''}</div>
      </div>
    </div>
    ${d.desc ? `<p class="p-desc">${d.desc}</p>` : ''}
    <dl class="p-grid">
      ${rows.map(([k, v, hl]) => `<div><dt>${k}</dt><dd class="${hl ? 'hl' : ''}">${v}</dd></div>`).join('')}
    </dl>
    <div class="p-note">内容读取自游戏本体数据文件，3D 场景不自行编造。</div>
  `;
  ui.panel.classList.add('on');
  document.getElementById('panel-close').onclick = () => ui.panel.classList.remove('on');
  window.__panel = { kind: h.kind, id: h.id, label: h.label, rows };
}

const STAT_CN = {
  hunger: '饱腹', energy: '精力', hygiene: '卫生', happiness: '心情',
  health: '健康', physique: '体质', fatigue: '疲劳',
};

/* 游戏 locations.js 的 type 字段是英文键，界面上要给人看中文 */
const TYPE_CN = {
  residential: '居住区', commercial: '商业区', industrial: '工业区',
  institutional: '公共事业', corporate: '商务办公', service: '公共服务',
  recreation: '休闲娱乐', public: '公共空间', education: '教育',
};

/* ══ 地点列表 ═══════════════════════════════════════════════════════════ */

function groupOf(loc) {
  const k = (SPECS[loc.id] || {}).layout || 'plaza';
  return LAYOUT_KIND[k] || '其他';
}

function contentCount(l) {
  return (l.jobs || []).length + (l.amenities || []).length + (l.actions || []).length +
    (l.actionsExtra || []).length + (l.illegal || []).length +
    (((l.buy || []).length || (l.sell || []).length) ? 1 : 0);
}

function buildList(filter = '') {
  if (!gamedata) return;
  const f = filter.trim().toLowerCase();
  const groups = {};
  for (const loc of Object.values(gamedata.locations)) {
    const label = `${loc.name} ${loc.desc} ${loc.type} ${groupOf(loc)}`.toLowerCase();
    if (f && !label.includes(f)) continue;
    (groups[groupOf(loc)] ||= []).push(loc);
  }
  ui.list.innerHTML = Object.entries(groups).map(([g, locs]) => `
    <div class="g">
      <div class="g-title">${g} <span>${locs.length}</span></div>
      <div class="g-items">
        ${locs.map(l => `
          <button class="loc" data-id="${l.id}">
            <span class="i">${l.icon || ''}</span>
            <span class="n">${l.name}</span>
            <span class="t">${'●'.repeat(l.wealthTier)}</span>
            <span class="j">${contentCount(l)} 项</span>
          </button>`).join('')}
      </div>
    </div>`).join('') || '<div class="empty">没有匹配的地点</div>';

  ui.list.querySelectorAll('.loc').forEach(b => {
    b.onclick = () => { loadLocation(b.dataset.id); };
  });
  markActive(currentId);
}

function markActive(id) {
  ui.list.querySelectorAll('.loc').forEach(b => b.classList.toggle('on', b.dataset.id === id));
}

function toggleList() {
  ui.listPanel.classList.toggle('on');
  if (ui.listPanel.classList.contains('on')) ui.search.focus();
}

ui.search.addEventListener('input', () => buildList(ui.search.value));

/* ══ 主循环 ═════════════════════════════════════════════════════════════ */
let fps = 0, fpsFrames = 0, fpsT0 = performance.now();
let last = performance.now();

function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  player.update(dt, keys, cam.yaw);
  cam.update(dt, player.pos);

  sun.position.set(player.pos.x + 16, 22, player.pos.z - 14);
  sun.target.position.copy(player.pos);
  sun.target.updateMatrixWorld();

  // 交互点：靠近提示，离开收起
  const near = nearestHotspot();
  if (near !== focused) {
    focused = near;
    if (focused) {
      ui.prompt.innerHTML = `<kbd>E</kbd> ${focused.icon || ''} ${focused.label}`;
      ui.prompt.classList.add('on');
      if (ui.panel.classList.contains('on')) ui.panel.classList.remove('on');
    } else {
      ui.prompt.classList.remove('on');
    }
  }
  // 交互点呼吸动画
  if (world) {
    const t = now * 0.0016;
    for (const h of world.hotspots) {
      const hu = h.object.userData.hotspot;
      if (!hu) continue;
      const isFocus = h === focused;
      const s = (isFocus ? 1.18 : 1) + Math.sin(t * 2 + h.x) * 0.05;
      hu.ring.scale.setScalar(s);
      hu.sprite.position.y = 2.15 + Math.sin(t * 1.7 + h.z) * 0.09;
      hu.sprite.material.opacity = isFocus ? 1 : 0.72;
    }
  }

  renderer.render(scene, camera);

  /* FPS 必须用真实流逝时间算。
     之前用 dt 累加是错的：dt 被钳制在 0.05，帧率掉到 3 帧/秒时
     它还会报"20 FPS"——数字好看，实际完全不是那回事。 */
  fpsFrames++;
  const elapsed = (now - fpsT0) / 1000;
  if (elapsed >= 0.5) {
    fps = Math.round(fpsFrames / elapsed);
    fpsT0 = now; fpsFrames = 0;
    ui.fps.textContent = `${fps} FPS · ${renderer.info.render.calls} draw calls`;
    ui.pos.textContent = `x ${player.pos.x.toFixed(1)}  z ${player.pos.z.toFixed(1)}`;
  }
  requestAnimationFrame(loop);
}

/* ══ 启动 ═══════════════════════════════════════════════════════════════ */
(async function boot() {
  try {
    const res = await fetch('./src/gamedata.json');
    gamedata = await res.json();
  } catch (e) {
    ui.loading.textContent = '数据加载失败：' + e.message;
    return;
  }
  ui.loading.style.display = 'none';
  buildList();
  loadLocation('slum');
  requestAnimationFrame(loop);

  // 供截图脚本驱动
  window.__probe = () => ({
    fps,
    calls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
    geometries: renderer.info.memory.geometries,
    textures: renderer.info.memory.textures,
    colliders: world ? world.colliders.length : 0,
    hotspots: world ? world.hotspots.length : 0,
    pos: { x: +player.pos.x.toFixed(2), z: +player.pos.z.toFixed(2) },
    loc: currentId,
    build: window.__lastBuild,
  });
  window.__goto = (id) => loadLocation(id);
  window.__teleport = (x, z) => { player.pos.set(x, 0, z); cam.cur.set(x, 0, z); };
  window.__key = (code, down = true) => { down ? keys.add(code) : keys.delete(code); };
  window.__near = () => (focused ? `${focused.kind}:${focused.label}` : null);
  window.__board = () => (world ? world.hotspots.map(h => `${h.kind}:${h.label}`) : []);
  /* 面板巡检用：把每个交互点的坐标交出去，脚本可以直接瞬移过去按 E。
     走过去的做法在软渲染下要等几十帧，逐个点巡检慢到没法用。 */
  window.__spots = () => (world ? world.hotspots.map(h => ({ x: h.x, z: h.z, kind: h.kind, label: h.label })) : []);
  window.__spotAt = (k) => {
    const h = world && world.hotspots[k];
    return h ? { x: h.x, z: h.z, kind: h.kind, label: h.label } : null;
  };
  window.__interact = () => interact();
  /* 巡检时直接指定热点并开面板。
     走 real 流程（瞬移 → 等 focused 在下一帧被算出 → 按 E）在软渲染下
     一帧要 250ms，逐个巡检会慢到没法用；这里把 focused 直接赋值，跳过等待。 */
  window.__openPanel = (k) => {
    const h = world && world.hotspots[k];
    if (!h) return null;
    focused = h;
    interact();
    return window.__panel || null;
  };
  window.__list = () => Object.keys(gamedata.locations);
  // 性能归因用：让探针脚本能在同场景下切换分辨率/阴影做对照
  window.__renderer = renderer;
  window.__scene = scene;
  window.__ready = true;
})();

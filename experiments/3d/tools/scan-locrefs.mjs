/**
 * 地点引用扫描器 —— 回答一个问题：那 7 个"空地"到底是游戏本来没内容，还是抽取器漏了源？
 *
 * 做法：不猜。把整个 src/js 里所有"跟地点挂钩"的字段扫一遍，按地点聚合，出证据。
 *
 * 关键认知（踩过的坑）：
 *   1. location 字段有四种写法 —— 单值 "slum"、数组 ["a","b"]、
 *      成对 buyLocations/sellLocations、以及"以地点为键的对象"（如 LOCATION_FLAVOR）。
 *      只匹配一种写法必然漏，所以键名一律放宽到"含 location 字样"，
 *      再把候选值跟权威地点表求交集。
 *   2. 词边界必须卡死：slum 会命中 slumber，court 会命中 courtesy，
 *      所以用 ["']id["'] 精确匹配带引号的字符串字面量，不做裸词匹配。
 *   3. "地点为键的对象"靠 location 字段是抓不到的（LOCATION_EXTRA_ACTIONS 就是这种）。
 *      单独补一趟：把每个数据模块里"键名与地点表重合"的对象的成员数统计出来。
 *
 * 用法: node tools/scan-locrefs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAME = path.resolve(__dirname, '../../../src/js');
const gamedata = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/gamedata.json'), 'utf8'));

/** 权威地点表（唯一真源：locations.js，经抽取器落成 gamedata.json） */
const LOCS = gamedata.locations;
const IDLIST = Object.keys(LOCS);

/* ── 1. 递归收集 .js 文件 ──────────────────────────────────────────── */
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.js')) files.push(p);
  }
})(GAME);

/* ── 2. 逐文件抓「带引号的地点 id 出现在 location 类键附近」 ────────── */
const KEY = /["']?([A-Za-z_]*(?:[Ll]oc|LOC)[A-Za-z_]*)["']?\s*:\s*/g;
const QID = new Map(IDLIST.map((id) => [id, new RegExp(`["']${id}["']`)]));

function refsIn(src) {
  const hit = new Map();
  KEY.lastIndex = 0;
  let m;
  let guard = 0;
  while ((m = KEY.exec(src)) && guard++ < 20000) {
    // 冒号后 240 字符窗口：足够覆盖数组字面量与"成对键"的写法
    const tail = src.slice(KEY.lastIndex, KEY.lastIndex + 240);
    for (const id of IDLIST) {
      const n = (tail.match(QID.get(id)) || []).length;
      if (n) hit.set(id, (hit.get(id) || 0) + n);
    }
  }
  return hit;
}

const perLoc = new Map();   // id -> Map(fileRel -> count)
const perFile = new Map();  // fileRel -> total
for (const f of files) {
  const rel = path.relative(GAME, f).replace(/\\/g, '/');
  const hit = refsIn(fs.readFileSync(f, 'utf8'));
  if (!hit.size) continue;
  let tot = 0;
  for (const [id, n] of hit) {
    tot += n;
    if (!perLoc.has(id)) perLoc.set(id, new Map());
    perLoc.get(id).set(rel, n);
  }
  perFile.set(rel, tot);
}

/* ── 3. 已抽取四个源的实际覆盖（对照用） ───────────────────────────── */
const src = new Map(IDLIST.map((i) => [i, { work: 0, service: 0, action: 0, trade: 0, flavor: 0 }]));
for (const [id, L] of Object.entries(LOCS)) {
  const s = src.get(id);
  s.work = L.jobs.length;
  s.service = L.amenities.length;
  s.action = L.actions.length;
  s.trade = L.buy.length + L.sell.length;
  s.flavor = L.flavor.length;
}

/* ── 4. 输出 ───────────────────────────────────────────────────────── */
const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);

console.log(`\n地点引用扫描 — ${IDLIST.length} 个地点 / ${files.length} 个 .js 文件\n`);
console.log(
  pad('id', 19) + pad('地点名', 13) + num('工作', 5) + num('服务', 5) + num('行动', 5) +
  num('交易', 5) + num('氛围', 5) + '  ' + num('代码', 5) + '  主要引用文件'
);
console.log('─'.repeat(126));

const empties = [];
for (const id of IDLIST) {
  const L = LOCS[id];
  const s = src.get(id);
  const m = perLoc.get(id);
  const n = m ? [...m.values()].reduce((a, b) => a + b, 0) : 0;
  const main = m
    ? [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([f, c]) => `${f}×${c}`).join(', ')
    : '—';

  const noData = s.work + s.service + s.action + s.trade === 0;
  const flag = noData ? (n === 0 ? '  ❌ 数据/代码全无' : '  ⚠ 仅代码引用') : '';
  if (noData) empties.push({ id, name: L.name, code: n, main });

  console.log(
    pad(id, 19) + pad(L.name, 13) +
    num(s.work, 5) + num(s.service, 5) + num(s.action, 5) + num(s.trade, 5) + num(s.flavor, 5) +
    '  ' + num(n, 5) + '  ' + main.slice(0, 46) + flag
  );
}

console.log('\n无玩法内容的地点 (%d 个)', empties.length);
console.log('─'.repeat(126));
for (const e of empties) console.log(`  ${pad(e.id, 19)} ${pad(e.name, 12)} 代码引用 ${num(e.code, 4)}  ${e.main.slice(0, 60)}`);

console.log('\n引用密度 Top 15 文件');
console.log('─'.repeat(126));
[...perFile.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)
  .forEach(([f, n]) => console.log(num(n, 6) + '  ' + f));
console.log();

/** 一次性核对：locations.js 的 specialties / priceMod 键到底是货品 id 还是分类名。
 *  结论会决定 3D 面板上该显示货品名还是分类名。 */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../../..');
const g = require('../src/gamedata.json');

const src = fs.readFileSync(path.join(root, 'src/js/data/goods.js'), 'utf8');
const goodIds = new Set([...src.matchAll(/id:\s*["']([a-z_0-9]+)["']/g)].map((m) => m[1]));

const keys = new Set();
for (const l of Object.values(g.locations)) {
  for (const s of l.specialties) keys.add(s);
  for (const k of Object.keys(l.priceMod)) keys.add(k);
}

console.log('分类中文表:', JSON.stringify(g.categoryLabels));
console.log();
console.log('键'.padEnd(20), '判定');
console.log('-'.repeat(46));
let both = 0, onlyCat = 0, onlyGood = 0;
for (const k of [...keys].sort()) {
  const isGood = goodIds.has(k);
  const isCat = Object.prototype.hasOwnProperty.call(g.categoryLabels, k);
  let verdict;
  if (isGood && isCat) { verdict = '⚠ 既是货品 id 又是分类名（歧义）'; both++; }
  else if (isGood) { verdict = '货品 id'; onlyGood++; }
  else if (isCat) { verdict = '分类名'; onlyCat++; }
  else verdict = '✘ 两者都不是（死键）';
  console.log(k.padEnd(20), verdict);
}
console.log('-'.repeat(46));
console.log(`货品 id 唯一: ${onlyGood}　分类唯一: ${onlyCat}　歧义: ${both}`);

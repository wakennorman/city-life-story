/**
 * P1-3: 将 _rNN 碎片文件按领域合并到对应的基文件
 *
 * 策略：
 *   1. 读取碎片文件内容（IIFE 包裹，含防重复加载的 guard flag）
 *   2. 追加到对应的基文件末尾
 *   3. 从 index.html 删除对应的 <script src> 行
 *   4. 删除碎片文件
 *
 * 映射表：
 *   career_linkage_events_r24.js  → career_linkage_events.js
 *   company_linkage_events_r21.js → company_linkage_events.js
 *   data_linkage_events_r22.js    → data_linkage_events.js
 *   data_linkage_events_r23.js    → data_linkage_events.js
 *   economy_linkage_events_r27.js → economy_linkage_events.js
 *   npc_linkage_events_r26.js     → npc_social_linkage_events.js
 */
const fs = require('fs');
const path = require('path');

const CORE_DIR = 'src/js/core';

// 读取 index.html
const indexPath = 'src/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// 映射表：{ 碎片文件: 基文件 }
const MERGE_MAP = {
  'career_linkage_events_r24.js': 'career_linkage_events.js',
  'company_linkage_events_r21.js': 'company_linkage_events.js',
  'data_linkage_events_r22.js': 'data_linkage_events.js',
  'data_linkage_events_r23.js': 'data_linkage_events.js',
  'economy_linkage_events_r27.js': 'economy_linkage_events.js',
  'npc_linkage_events_r26.js': 'npc_social_linkage_events.js',
};

Object.keys(MERGE_MAP).forEach(function(fragment) {
  var base = MERGE_MAP[fragment];
  var fragmentPath = path.join(CORE_DIR, fragment);
  var basePath = path.join(CORE_DIR, base);

  // 1. 读取碎片文件内容
  var fragmentContent = fs.readFileSync(fragmentPath, 'utf8');
  console.log('Read ' + fragment + ' (' + (fragmentContent.length / 1024).toFixed(1) + ' KB)');

  // 2. 追加到基文件末尾（加空行分隔）
  var baseContent = fs.readFileSync(basePath, 'utf8');
  // 如果基文件末尾已经有换行，直接追加；否则先加换行
  var separator = baseContent.endsWith('\n') ? '\n' : '\n\n';
  fs.writeFileSync(basePath, baseContent + separator + fragmentContent, 'utf8');
  console.log('  Appended to ' + base + ' (' + ( (baseContent.length + fragmentContent.length) / 1024).toFixed(1) + ' KB)');

  // 3. 从 index.html 删除对应的 <script src>
  var scriptTag = '<script src="js/core/' + fragment + '"></script>';
  var idx = html.indexOf(scriptTag);
  if (idx !== -1) {
    html = html.substring(0, idx) + html.substring(idx + scriptTag.length);
    console.log('  Removed <script src="' + fragment + '"> from index.html');
  } else {
    console.log('  WARNING: ' + scriptTag + ' not found in index.html');
  }

  // 4. 删除碎片文件
  fs.unlinkSync(fragmentPath);
  console.log('  Deleted ' + fragment);
});

// 写回 index.html
fs.writeFileSync(indexPath, html, 'utf8');
console.log('\nUpdated index.html');
console.log('Done. All 6 fragments merged.');
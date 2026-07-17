/**
 * 删除 2 组 body 完全一致的重复函数定义：
 * 1. getAffinityLabel 从 npcs.js（规范版在 npc_relationships.js）
 * 2. getSkillChineseName 从 skill_bonuses.js（规范版在 skill_tree.js）
 */
const fs = require('fs');

function removeFunction(src, funcName) {
  var searchStr = 'function ' + funcName + '(';
  var idx = src.indexOf(searchStr);
  while (idx !== -1) {
    if (idx === 0 || src[idx - 1] === '\n') {
      // 找闭合 }
      var braceDepth = 0;
      var inStr = false;
      var strChar = '';
      var i = idx;
      // 找到第一个 {
      while (i < src.length && src[i] !== '{') { i++; }
      if (i >= src.length) { idx = src.indexOf(searchStr, idx + 1); continue; }
      braceDepth = 1; i++;
      while (i < src.length && braceDepth > 0) {
        var ch = src[i];
        if (ch === '"' || ch === "'" || ch === '`') {
          if (!inStr) { inStr = true; strChar = ch; }
          else if (ch === strChar && src[i-1] !== '\\') { inStr = false; }
        } else if (!inStr) {
          if (ch === '{') braceDepth++;
          else if (ch === '}') braceDepth--;
        }
        i++;
      }
      return src.substring(0, idx) + src.substring(i);
    }
    idx = src.indexOf(searchStr, idx + 1);
  }
  return src; // not found
}

// 1. getAffinityLabel from npcs.js
var npcs = fs.readFileSync('src/js/data/npcs.js', 'utf8');
var npcsNew = removeFunction(npcs, 'getAffinityLabel');
if (npcsNew !== npcs) {
  fs.writeFileSync('src/js/data/npcs.js', npcsNew, 'utf8');
  console.log('Removed getAffinityLabel from npcs.js (' + (npcs.length - npcsNew.length) + ' bytes)');
} else {
  console.log('getAffinityLabel not found in npcs.js');
}

// 2. getSkillChineseName from skill_bonuses.js
var sb = fs.readFileSync('src/js/phase1/skill_bonuses.js', 'utf8');
var sbNew = removeFunction(sb, 'getSkillChineseName');
if (sbNew !== sb) {
  fs.writeFileSync('src/js/phase1/skill_bonuses.js', sbNew, 'utf8');
  console.log('Removed getSkillChineseName from skill_bonuses.js (' + (sb.length - sbNew.length) + ' bytes)');
} else {
  console.log('getSkillChineseName not found in skill_bonuses.js');
}

console.log('Done.');
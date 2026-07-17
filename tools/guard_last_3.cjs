/**
 * Guard remaining 3 standalone duplicate function declarations.
 * Guard the FIRST occurrence (loaded earlier), so the SECOND (loaded later, which should win) is the only unguarded one.
 */
const fs = require('fs');

function guardFunction(filePath, funcName) {
  var src = fs.readFileSync(filePath, 'utf8');
  var search = 'function ' + funcName + '(';
  var idx = src.indexOf(search);
  if (idx === -1) { console.log(funcName + ' not found in ' + filePath); return; }
  if (idx > 0 && src[idx-1] !== '\n') { console.log(funcName + ' not at line start'); return; }

  var braceDepth = 0, inStr = false, strChar = '';
  var i = idx;
  while (i < src.length && src[i] !== '{') i++;
  if (i >= src.length) { console.log(funcName + ' no brace'); return; }
  braceDepth = 1; i++;
  while (i < src.length && braceDepth > 0) {
    var ch = src[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      if (!inStr) { inStr = true; strChar = ch; }
      else if (ch === strChar && src[i-1] !== '\\') inStr = false;
    } else if (!inStr) {
      if (ch === '{') braceDepth++;
      else if (ch === '}') braceDepth--;
    }
    i++;
  }
  var func = src.substring(idx, i);
  var guarded = 'if(typeof ' + funcName + '==="undefined"){\n' + func + '\n}';
  var result = src.substring(0, idx) + guarded + src.substring(i);
  fs.writeFileSync(filePath, result, 'utf8');
  console.log('Guarded ' + funcName + ' in ' + filePath + ' (' + func.length + 'B)');
}

var pairs = [
  ['src/js/core/durability.js', 'repairEquipment'],
  ['src/js/data/startup_competition.js', 'getAvailableCrisisResponses'],
  ['src/js/phase2/startup.js', 'showAcquisitionModal'],
];
pairs.forEach(function(p) { guardFunction(p[0], p[1]); });
console.log('Done.');
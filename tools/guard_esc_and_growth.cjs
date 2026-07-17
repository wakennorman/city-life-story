/**
 * Guard remaining _esc and renderGrowthTab duplicates.
 * Render.js versions should win (loaded last).
 */
const fs = require('fs');

function guardFunction(filePath, funcName) {
  var src = fs.readFileSync(filePath, 'utf8');
  var search = 'function ' + funcName + '(';
  var idx = src.indexOf(search);
  if (idx === -1) { console.log('  ' + funcName + ' not found in ' + filePath); return false; }
  if (idx > 0 && src[idx-1] !== '\n') { console.log('  ' + funcName + ' not at line start in ' + filePath); return false; }

  var braceDepth = 0, inStr = false, strChar = '';
  var i = idx;
  while (i < src.length && src[i] !== '{') i++;
  if (i >= src.length) { console.log('  no brace'); return false; }
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
  console.log('  Guarded ' + funcName + ' in ' + filePath + ' (' + func.length + 'B)');
  return true;
}

// _esc: guard all except render.js
var escFiles = [
  'src/js/components/companyHistory.js',
  'src/js/data/startup_competition.js',
  'src/js/data/startup_events.js',
  'src/js/phase2/startup_data.js',
  'src/js/ui/modal.js',
];
console.log('Guarding _esc in non-render.js files:');
escFiles.forEach(function(f) { guardFunction(f, '_esc'); });

// renderGrowthTab: guard data_viz.js (render.js loaded later, should win)
console.log('Guarding renderGrowthTab in data_viz.js:');
guardFunction('src/js/ui/data_viz.js', 'renderGrowthTab');

console.log('Done.');
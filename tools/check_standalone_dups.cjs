/**
 * 检查 6 组非 render.js 的重复函数定义
 */
const fs = require('fs');

var pairs = [
  ['getDeceasedCompanies', 'src/js/core/enterprise_fate.js', 'src/js/core/multi_run_memory.js'],
  ['getAffinityLabel', 'src/js/core/npc_relationships.js', 'src/js/data/npcs.js'],
  ['getCategoryLabel', 'src/js/ui/career_dev.js', 'src/js/ui/daily_report.js'],
  ['getCompanyIndustryById', 'src/js/core/enterprise_fate.js', 'src/js/ui/corp_ui.js'],
  ['getCrisisSummary', 'src/js/data/startup_competition.js', 'src/js/phase2/startup_crisis.js'],
  ['getSkillChineseName', 'src/js/core/skill_tree.js', 'src/js/phase1/skill_bonuses.js'],
];

function extractFuncBody(src, braceIdx) {
  var depth = 1, i = braceIdx + 1;
  var inStr = false, strChar = '';
  while (i < src.length && depth > 0) {
    var ch = src[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      if (!inStr) { inStr = true; strChar = ch; }
      else if (ch === strChar && src[i-1] !== '\\') { inStr = false; }
    } else if (!inStr) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    i++;
  }
  return src.substring(braceIdx, i);
}

pairs.forEach(function(p) {
  var name = p[0], f1 = p[1], f2 = p[2];
  var src1 = fs.readFileSync(f1, 'utf8');
  var src2 = fs.readFileSync(f2, 'utf8');

  var idx1 = src1.indexOf('function ' + name + '(');
  var idx2 = src2.indexOf('function ' + name + '(');
  if (idx1 === -1 || idx2 === -1) {
    console.log(name + ': MISSING in one file');
    return;
  }

  var brace1 = src1.indexOf('{', idx1);
  var brace2 = src2.indexOf('{', idx2);
  if (brace1 === -1 || brace2 === -1) {
    console.log(name + ': no brace found');
    return;
  }

  var body1 = extractFuncBody(src1, brace1);
  var body2 = extractFuncBody(src2, brace2);
  var match = body1 === body2 ? 'IDENTICAL' : 'DIFFERENT';
  console.log(name + ': ' + match + ' (' + body1.length + 'B vs ' + body2.length + 'B)');
  if (match === 'DIFFERENT') {
    // Show first differing line
    var l1 = body1.split('\n');
    var l2 = body2.split('\n');
    for (var i = 0; i < Math.min(l1.length, l2.length); i++) {
      if (l1[i] !== l2[i]) {
        console.log('  Line ' + (i+1) + ' diff:');
        console.log('  [' + f1 + '] ' + l1[i].trim().substring(0, 80));
        console.log('  [' + f2 + '] ' + l2[i].trim().substring(0, 80));
        break;
      }
    }
  }
});
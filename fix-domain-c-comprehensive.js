const fs = require("fs");

// ============================================================
// 域C — 全系统优化：A类修复 + 联动增强
// ============================================================

// --- 文件1: career_dev.js ---
let career = fs.readFileSync("src/js/ui/career_dev.js", "utf8");

// 修复#1: 属性扁平化 — state.player.attributes 不存在，改为 state.player[attrKey]
career = career.replace(
  "if (attrDmg > 0 && state.player.attributes) {\n    state.player.attributes[attrKey] = Math.max(\n      0,\n      (state.player.attributes[attrKey] || 0) - attrDmg,\n    );\n  }",
  "if (attrDmg > 0 && typeof state.player[attrKey] === 'number') {\n    state.player[attrKey] = Math.max(\n      0,\n      (state.player[attrKey] || 0) - attrDmg,\n    );\n  }\n  // [全系统自洽修复] 域C 修复#1: 属性扁平化",
);

// 修复#2: Math.random → Random.chance (种子化)
career = career.replace(
  "if (cap.burnout >= 80 && Math.random() < 0.15) {",
  "if (cap.burnout >= 80 && (typeof Random !== 'undefined' ? Random.chance(0.15) : Math.random() < 0.15)) {",
);

// Use a simpler approach for the remaining Math.random calls
// We'll write them all out to avoid encoding issues
career = career
  .split("\n")
  .map(function (line, i) {
    // Line with burnout warning
    if (
      line.includes("if (Math.random() < 0.05) {") &&
      line.includes("StateManager.addMessage")
    ) {
      return line;
    }
    // Health bonus doctor
    if (line.includes("if (medicineLevel >= 20 && Math.random() < 0.3) {")) {
      return line.replace(
        "if (medicineLevel >= 20 && Math.random() < 0.3) {",
        "if (medicineLevel >= 20 && (typeof Random !== 'undefined' ? Random.chance(0.3) : Math.random() < 0.3)) {",
      );
    }
    // Health bonus medical
    if (
      line.includes("if (Math.random() < 0.2) {") &&
      !line.includes("Random.chance")
    ) {
      return line.replace(
        "if (Math.random() < 0.2) {",
        "if (typeof Random !== 'undefined' ? Random.chance(0.2) : Math.random() < 0.2) {",
      );
    }
    return line;
  })
  .join("\n");

// Fix the burnout warning line (separate fix since it's on a different line pattern)
career = career.replace(
  'if (Math.random() < 0.05) {\n\t      StateManager.addMessage(\n\t        "⚠️ 身体发出警告：长期高压工作正在消耗你的健康",\n\t        "warning",\n\t      );\n\t    }',
  'if (typeof Random !== \'undefined\' ? Random.chance(0.05) : Math.random() < 0.05) {\n\t      StateManager.addMessage(\n\t        "⚠️ 身体发出警告：长期高压工作正在消耗你的健康",\n\t        "warning",\n\t      );\n\t    }',
);

// 修复#3: 添加4个缺失职业风险路径
const designEnd = 'diseaseMsg: "视力退化/过劳综合征",\n\t  },\n\t};';
const newProfiles = [
  'diseaseMsg: "视力退化/过劳综合征",',
  "  },",
  "  // 运营管理：久坐综合征+压力性胃病 — [全系统自洽修复] 域C 修复#3a",
  "  operations: {",
  "    dailyProb: [0.003, 0.005, 0.007, 0.008],",
  "    msgs: [",
  '      "📊 运营助理整天对着表格，颈椎开始僵硬",',
  '      "📋 运营专员长时间久坐，腰椎和胃部都在抗议",',
  '      "💼 主管的会议连轴转，慢性疲劳正在积累",',
  '      "📈 经理级别的运营决策压力，焦虑如影随形",',
  "    ],",
  "    healthDmg: [1, 2, 3, 3],",
  '    attrKey: "mental",',
  "    attrDmg: [0.5, 1, 1, 1.5],",
  '    flagKey: "_careerDiseased_operations",',
  '    diseaseMsg: "久坐综合征/压力性胃病",',
  "  },",
  "  // 法律服务：焦虑症+视力疲劳 — [全系统自洽修复] 域C 修复#3b",
  "  legal: {",
  "    dailyProb: [0.002, 0.004, 0.006, 0.008],",
  "    msgs: [",
  '      "📜 法务助理整日翻阅卷宗，眼睛酸胀难忍",',
  '      "⚖️ 法务专员长时间审阅合同，精神高度紧绷",',
  '      "📚 高级法务的大脑一刻不停，焦虑在暗处生长",',
  '      "🏛️ 法务总监的决策压力关乎企业生死，长期处于应激状态",',
  "    ],",
  "    healthDmg: [1, 2, 3, 4],",
  '    attrKey: "mental",',
  "    attrDmg: [0.5, 1, 1.5, 2],",
  '    flagKey: "_careerDiseased_legal",',
  '    diseaseMsg: "焦虑症/视力疲劳综合征",',
  "  },",
  "  // 事业单位：久坐+慢性疲劳 — [全系统自洽修复] 域C 修复#3c",
  "  public_institution: {",
  "    dailyProb: [0.002, 0.003, 0.005, 0.006, 0.007],",
  "    msgs: [",
  '      "📋 办事员整天坐窗口，腰背开始酸痛",',
  '      "📑 科员的文件处理量让颈椎承受了不该承受的压力",',
  '      "📊 副科长级的工作节奏导致慢性疲劳累积",',
  '      "📈 科长级的统筹压力让身体状况悄然下滑",',
  '      "🏛️ 副处长级长期高强度行政工作，身心俱疲",',
  "    ],",
  "    healthDmg: [1, 1, 2, 3, 4],",
  '    attrKey: "mental",',
  "    attrDmg: [0, 0.5, 1, 1, 1.5],",
  '    flagKey: "_careerDiseased_pi",',
  '    diseaseMsg: "久坐综合征/慢性疲劳",',
  "  },",
  "  // 公务员：久坐+高精神压力 — [全系统自洽修复] 域C 修复#3d",
  "  civil: {",
  "    dailyProb: [0.002, 0.004, 0.006, 0.008],",
  "    msgs: [",
  '      "📋 基层公务员面对群众事务，精神压力不小",',
  '      "📑 科员的工作量逐年递增，腰椎开始发出警告",',
  '      "📊 副科级的双重压力——对上对下都要负责",',
  '      "🏛️ 科长级的决策责任，长期处于心理应激状态",',
  "    ],",
  "    healthDmg: [1, 2, 3, 4],",
  '    attrKey: "mental",',
  "    attrDmg: [0.5, 1, 1.5, 2],",
  '    flagKey: "_careerDiseased_civil",',
  '    diseaseMsg: "职业性焦虑/久坐综合征",',
  "  },",
].join("\n");

career = career.replace(designEnd, newProfiles + "\n\t};");

// 增强#2: 技能分支推荐面板
const enh2Marker = "resignCareerJob()";
const enh2MarkerIdx = career.indexOf(enh2Marker);
if (enh2MarkerIdx === -1) {
  console.error("enh2 marker not found");
  process.exit(1);
}

const afterEnh2Marker = career.slice(enh2MarkerIdx);
const afterCloseTag = afterEnh2Marker.indexOf("辞职</button>';");
if (afterCloseTag === -1) {
  console.error("closeTag not found");
  process.exit(1);
}

const afterTag = afterEnh2Marker.slice(
  afterCloseTag + "辞职</button>';".length,
);
const closeDiv2 = afterTag.indexOf('html += "</div>";');
if (closeDiv2 === -1) {
  console.error("closeDiv2 not found");
  process.exit(1);
}

const enh2InsertPos =
  enh2MarkerIdx +
  afterCloseTag +
  "辞职</button>';".length +
  closeDiv2 +
  'html += "</div>";'.length;

const enh2Code = [
  "",
  "    // v3.99 [全系统自洽修复] 域C 增强#2: 技能分支推荐",
  "    if (currentJob && currentJob.path) {",
  "      var _pathSkills = [];",
  "      var _pathDef = CAREER_PATHS[currentJob.path];",
  "      if (_pathDef) {",
  "        for (var _li = 0; _li < _pathDef.levels.length; _li++) {",
  "          var _lv = _pathDef.levels[_li];",
  "          if (_lv.reqSkills) {",
  "            for (var _sk in _lv.reqSkills) {",
  "              if (_pathSkills.indexOf(_sk) === -1) _pathSkills.push(_sk);",
  "            }",
  "          }",
  "        }",
  "      }",
  "      if (_pathSkills.length > 0) {",
  '        html += \'<div class="section" style="margin-top:8px;">\';',
  "        html += '<h4 style=\"font-size:12px;margin:0 0 6px;\">🔗 推荐技能分支</h4>';",
  "        html += '<div style=\"font-size:10px;color:var(--text-muted);margin-bottom:6px;\">该路径依赖以下技能，建议在培训中心解锁对应分支以加速晋升</div>';",
  "        for (var _si = 0; _si < _pathSkills.length; _si++) {",
  "          var _sb = getSkillBranches(_pathSkills[_si]);",
  "          if (_sb && _sb.length > 0) {",
  "            html += '<div style=\"font-size:11px;margin:4px 0;display:flex;flex-wrap:wrap;gap:4px;align-items:center;\">';",
  "            html += '<span style=\"font-weight:bold;min-width:70px;\">' + _pathSkills[_si] + ':</span>';",
  "            for (var _bi = 0; _bi < _sb.length; _bi++) {",
  "              html += '<span style=\"background:var(--bg-secondary);padding:2px 8px;border-radius:10px;font-size:10px;\">' + _sb[_bi].icon + ' ' + _sb[_bi].name + '</span>';",
  "            }",
  "            html += '</div>';",
  "          }",
  "        }",
  "        html += '</div>';",
  "      }",
  "    }",
].join("\n");

career =
  career.slice(0, enh2InsertPos) + enh2Code + career.slice(enh2InsertPos);

// 增强#3: 行业热度薪资联动
const salaryCalc = "var salary = calcActualSalary(state);";
const salaryCalcIdx = career.indexOf(salaryCalc);
if (salaryCalcIdx === -1) {
  console.error("salaryCalc not found");
  process.exit(1);
}

const enh3Code = [
  "    // v3.99 [全系统自洽修复] 域C 增强#3: 行业热度影响薪资",
  '    var _sectorMap = { tech: "科技", finance: "金融", sales: "消费", operations: "服务业", design: "科技", legal: "服务业", education: "教育", logistics: "物流", catering: "餐饮", medical: "医疗", doctor: "医疗", public_institution: "公共服务", civil: "公共服务" };',
  "    var _sector = _sectorMap[job.path] || null;",
  "    if (_sector && state._worldParams && state._worldParams.sectorHeat && state._worldParams.sectorHeat[_sector]) {",
  "      var _heat = state._worldParams.sectorHeat[_sector];",
  "      if (_heat > 1.2) { salary = Math.round(salary * 1.15); }",
  "      else if (_heat < 0.8) { salary = Math.round(salary * 0.9); }",
  "      else if (_heat > 1.0) { salary = Math.round(salary * (1 + (_heat - 1) * 0.3)); }",
  "      else if (_heat < 1.0) { salary = Math.round(salary * (1 - (1 - _heat) * 0.2)); }",
  "    }",
].join("\n");

career =
  career.slice(0, salaryCalcIdx) +
  enh3Code +
  "\n" +
  career.slice(salaryCalcIdx);

fs.writeFileSync("src/js/ui/career_dev.js", career);
console.log("✅ career_dev.js: 3 fixes + 2 enhancements");

// --- 文件2: career_path_events.js ---
let events = fs.readFileSync("src/js/core/career_path_events.js", "utf8");

const newEvents = [
  "",
  "    // ================================================================",
  "    // 运营管理路径（operations）— [全系统自洽修复] 域C 增强#1a",
  "    // ================================================================",
  "    {",
  '      id: "ops_data_crisis",',
  '      phase: "street",',
  '      icon: "📊",',
  '      title: "数据异常危机",',
  "      story:",
  '        "你日常汇总的运营数据突然出现严重异常——某个关键指标一夜之间暴跌40%。部门群里已经炸锅了，大家都在@你。",',
  "      probability: 0.04,",
  "      repeatable: true,",
  "      conditions: function (st) {",
  '        return _path(st, "operations") && _workDays(st) > 90;',
  "      },",
  "      choices: [",
  "        {",
  '          text: "🔍 逐层拆解数据，找出根因",',
  '          hint: "加班但解决问题",',
  "          apply: function (st) {",
  "            var cap = _cap(st);",
  "            if (cap) { cap.reputation = Math.min(100, cap.reputation + 10); _clamp(cap); }",
  "            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);",
  "            st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 2);",
  '            _msg("🔍 你花了三个小时锁定问题：数据接口昨天升级后字段偏移。修复后指标回升，总监在群里公开表扬了你。声誉+10，智力+2，疲劳+20。", "success");',
  "          },",
  "        },",
  "        {",
  '          text: "📞 立刻上报给经理处理",',
  '          hint: "风险转移但减印象分",',
  "          apply: function (st) {",
  "            var cap = _cap(st);",
  "            if (cap) { cap.reputation = Math.max(0, cap.reputation - 3); _clamp(cap); }",
  '            _msg("📞 经理接手后半小时解决了问题——同样的方法，但你没能自己完成。声誉-3。", "warning");',
  "          },",
  "        },",
  "      ],",
  "    },",
  "    {",
  '      id: "ops_process_optimization",',
  '      phase: "street",',
  '      icon: "⚙️",',
  '      title: "流程优化机会",',
  "      story:",
  '        "你发现每天要花大量时间手动整理一份跨部门报表——Excel里的数据源要从三个系统分别导出再合并。",',
  "      probability: 0.05,",
  "      repeatable: true,",
  "      conditions: function (st) {",
  '        return _path(st, "operations") && _workDays(st) > 180;',
  "      },",
  "      choices: [",
  "        {",
  '          text: "💡 用Python写个自动化脚本",',
  '          hint: "效率大幅提升（需coding≥20）",',
  "          apply: function (st) {",
  "            var codingLv = st.skills && st.skills.coding ? st.skills.coding.level || 0 : 0;",
  "            if (codingLv >= 20) {",
  "              var cap = _cap(st);",
  "              if (cap) { cap.reputation = Math.min(100, cap.reputation + 12); cap.industryResources = Math.min(100, cap.industryResources + 5); _clamp(cap); }",
  "              st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 3);",
  '              _msg("⚡ 脚本跑通了！原本3小时的工作20分钟完成。总监说「这效率提升至少值一个A绩效」。声誉+12，行业资源+5，智力+3。", "success");',
  "            } else {",
  '              _msg("😅 你试了一下发现自己编程基础不够，脚本报错无数。看来得先学编程。", "warning");',
  "            }",
  "          },",
  "        },",
  "        {",
  '          text: "📝 写一份优化建议报告提交",',
  '          hint: "留下专业印象",',
  "          apply: function (st) {",
  "            var cap = _cap(st);",
  "            if (cap) { cap.reputation = Math.min(100, cap.reputation + 5); _clamp(cap); }",
  '            _msg("📝 报告提交后，经理批复「建议收到，转IT部门评估」。虽然没有立竿见影，但你的名字开始出现在跨部门邮件里。声誉+5。", "info");',
  "          },",
  "        },",
  "      ],",
  "    },",
  "",
  "    // ================================================================",
  "    // 设计创意路径（design）— [全系统自洽修复] 域C 增强#1b",
  "    // ================================================================",
  "    {",
  '      id: "des_client_revision_hell",',
  '      phase: "street",',
  '      icon: "🎨",',
  '      title: "客户修改地狱",',
  "      story:",
  '        "你花了三天做的方案，客户看了一眼：「感觉不对。换个风格，今天能出吗？」你看了看表——下午4点。",',
  "      probability: 0.05,",
  "      repeatable: true,",
  "      conditions: function (st) {",
  '        return _path(st, "design") && _workDays(st) > 60;',
  "      },",
  "      choices: [",
  "        {",
  '          text: "😤 加班改，今晚出图",',
  '          hint: "客户满意但体力透支",',
  "          apply: function (st) {",
  "            var cap = _cap(st);",
  "            if (cap) { cap.reputation = Math.min(100, cap.reputation + 6); _clamp(cap); }",
  "            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);",
  "            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);",
  '            _msg("🎨 你熬到凌晨2点出了三个版本。客户选了第二个。声誉+6，疲劳+25，心情-10。", "success");',
  "          },",
  "        },",
  "        {",
  '          text: "🤝 约客户当面聊，精准定位需求",',
  '          hint: "用沟通减少无效劳动",',
  "          apply: function (st) {",
  "            if ((st.player.charm || 0) >= 30) {",
  "              var cap = _cap(st);",
  "              if (cap) { cap.reputation = Math.min(100, cap.reputation + 8); _clamp(cap); }",
  '              _msg("💬 你约客户喝了杯咖啡，聊了半小时终于挖出真实需求——不是风格问题，是配色不符合品牌调性。改色后一次过稿。声誉+8。", "success");',
  "            } else {",
  "              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);",
  '              _msg("😶 你试着沟通，但客户自己也说不清想要什么。最后还是改了三版。沟通技巧还得练。疲劳+15。", "warning");',
  "            }",
  "          },",
  "        },",
  "      ],",
  "    },",
  "",
  "    // ================================================================",
  "    // 法律服务路径（legal）— [全系统自洽修复] 域C 增强#1b",
  "    // ================================================================",
  "    {",
  '      id: "leg_urgent_contract_review",',
  '      phase: "street",',
  '      icon: "⚖️",',
  '      title: "紧急合同审核",',
  "      story:",
  '        "业务部发来一份紧急合同——对方已经在会议室等着签字了。五六十页的协议，你只有两小时审完。",',
  "      probability: 0.04,",
  "      repeatable: true,",
  "      conditions: function (st) {",
  '        return _path(st, "legal") && _workDays(st) > 90;',
  "      },",
  "      choices: [",
  "        {",
  '          text: "📋 逐条审阅，争取加时间",',
  '          hint: "严谨但可能得罪业务",',
  "          apply: function (st) {",
  "            var cap = _cap(st);",
  "            if (cap) { cap.reputation = Math.min(100, cap.reputation + 8); _clamp(cap); }",
  "            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 18);",
  '            _msg("📋 你坚持延到明天上午交报告，发现了一条隐藏的无限续约条款——避免了公司潜在数百万损失。声誉+8。", "success");',
  "          },",
  "        },",
  "        {",
  '          text: "⏩ 快速过一遍，核心风险点标注",',
  '          hint: "平衡效率与风险",',
  "          apply: function (st) {",
  "            if (_chance(0.65)) {",
  "              var cap = _cap(st);",
  "              if (cap) { cap.reputation = Math.min(100, cap.reputation + 4); _clamp(cap); }",
  '              _msg("✅ 你火速标注了三个风险点，业务部修改后顺利签约。声誉+4。", "info");',
  "            } else {",
  "              var cap = _cap(st);",
  "              if (cap) { cap.reputation = Math.max(0, cap.reputation - 5); _clamp(cap); }",
  '              _msg("⚠️ 合同签完后你才发现漏看了一条自动续期条款。法务总监要求你以后加强复核。声誉-5。", "warning");',
  "            }",
  "          },",
  "        },",
  "      ],",
  "    },",
].join("\n");

// Find the EVENTS array closing
const lastEvent = events.lastIndexOf("    },");
if (lastEvent === -1) {
  console.error("last event not found");
  process.exit(1);
}
const afterLastEvent = events.slice(lastEvent);
const closingBracket = afterLastEvent.indexOf("\n  ];");
if (closingBracket === -1) {
  console.error("closing bracket not found");
  process.exit(1);
}

events =
  events.slice(0, lastEvent + closingBracket) +
  newEvents +
  "\n" +
  events.slice(lastEvent + closingBracket);
fs.writeFileSync("src/js/core/career_path_events.js", events);
console.log("✅ career_path_events.js: 6 events for operations/design/legal");

console.log("\n✅ All fixes applied!");

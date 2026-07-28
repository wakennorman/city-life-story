# -*- coding: utf-8 -*-
"""R694b 域E 审计脚本：悬空挂载 / 孤儿文件 / story占位符泄漏 / 假技能键 / 死字段"""
import re, os, glob, io

os.chdir(os.path.dirname(os.path.abspath(__file__)))

html = io.open('src/index.html', encoding='utf-8', errors='replace').read()
mounted = set(re.findall(r'src="(js/[^"]+\.js)"', html))

print('=== 1. 悬空挂载（挂了但源不存在） ===')
for m in sorted(mounted):
    p = os.path.join('src', *m.split('/'))
    if not os.path.exists(p):
        print('DANGLING:', m)

print('=== 2. 域E孤儿（源存在但未挂载） ===')
files = glob.glob('src/js/core/domain_e_linkage_*.js') + [
    'src/js/core/economy_invest_linkage_events.js',
    'src/js/core/news_investment_bridge.js',
    'src/js/core/startup_competition.js',
    'src/js/core/economy_linkage_events.js']
for f in files:
    rel = f.replace('\\', '/')[4:]  # strip 'src/'
    if rel not in mounted:
        print('ORPHAN:', f)

print('=== 3. story占位符泄漏（story含{xx}但事件无text函数） ===')
REAL_SKILLS = {'cooking','repair','coding','english','driving','sales','management',
               'accounting','electrician','welding','medicine','social'}
for f in sorted(glob.glob('src/js/core/domain_e_linkage_*.js')):
    src = io.open(f, encoding='utf-8', errors='replace').read()
    # 按事件块粗切
    for m in re.finditer(r'id:\s*"([^"]+)"', src):
        pass
    # story 占位符
    for m in re.finditer(r'story:\s*"([^"]*\{[a-zA-Z_]+\}[^"]*)"', src):
        # 检查该文件是否有 text: 函数
        seg_start = max(0, m.start()-2000)
        seg = src[seg_start:m.start()+2000]
        if 'text:' not in seg:
            print('STORY_PLACEHOLDER:', f, '->', m.group(1)[:60])
    # 假技能键
    for m in re.finditer(r'addSkillXp\(\s*"([a-zA-Z_]+)"', src):
        if m.group(1) not in REAL_SKILLS:
            print('FAKE_SKILL:', f, '->', m.group(1))
    # 死字段
    for pat in [r'player\.happiness', r'needs\.health\b', r'player\.health\b', r'state\.certs\b']:
        for m in re.finditer(pat, src):
            print('DEAD_FIELD:', f, '->', m.group(0))

print('=== 4. 域E核心文件同样检查 ===')
for f in ['src/js/core/finance.js','src/js/core/economy_invest_linkage_events.js',
          'src/js/core/news_investment_bridge.js','src/js/core/startup_competition.js',
          'src/js/core/startup_events.js','src/js/core/economy_linkage_events.js']:
    if not os.path.exists(f): print('MISSING:', f); continue
    src = io.open(f, encoding='utf-8', errors='replace').read()
    for m in re.finditer(r'addSkillXp\(\s*"([a-zA-Z_]+)"', src):
        if m.group(1) not in REAL_SKILLS:
            print('FAKE_SKILL:', f, '->', m.group(1))
    for pat in [r'player\.happiness', r'needs\.health\b', r'player\.health\b']:
        for m in re.finditer(pat, src):
            print('DEAD_FIELD:', f, '->', m.group(0))

print('=== 5. 最近3个域E文件的 WORLD_SECTORS industry 检查 ===')
SECTORS = {'科技','新能源','消费','金融','房地产','医药'}
for f in sorted(glob.glob('src/js/core/domain_e_linkage_*.js'))[-8:]:
    src = io.open(f, encoding='utf-8', errors='replace').read()
    for m in re.finditer(r'industry:\s*"([^"]+)"', src):
        if m.group(1) not in SECTORS:
            print('BAD_SECTOR:', f, '->', m.group(1))
print('AUDIT DONE')

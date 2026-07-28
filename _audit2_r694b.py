# -*- coding: utf-8 -*-
"""R694b 深度审计：hint承诺flag但apply未写 / conditions引用不存在字段 / 写-only flag盘点"""
import re, io, glob, os, collections

os.chdir(os.path.dirname(os.path.abspath(__file__)))

efiles = sorted(glob.glob('src/js/core/domain_e_linkage_*.js'))
core_e = ['src/js/core/finance.js','src/js/core/economy_invest_linkage_events.js',
          'src/js/core/news_investment_bridge.js','src/js/data/startup_competition.js',
          'src/js/data/startup_events.js','src/js/core/economy_linkage_events.js',
          'src/js/phase2/investment.js']
allfiles = efiles + [f for f in core_e if os.path.exists(f)]

# 全库文本（用于flag读写交叉）
lib = {}
for f in glob.glob('src/js/**/*.js', recursive=True):
    try: lib[f] = io.open(f, encoding='utf-8', errors='replace').read()
    except: pass
alltext = '\n'.join(lib.values())

print('=== 1. hint承诺"置_flagX"但同choice的apply未写该flag ===')
for f in allfiles:
    src = lib.get(f) or io.open(f, encoding='utf-8', errors='replace').read()
    # 逐choice粗块: hint:"...置_XXX" 在其后1500字符内找 _XXX
    for m in re.finditer(r'hint:\s*"[^"]*置(_[A-Za-z0-9_]+)', src):
        flag = m.group(1)
        seg = src[m.end(): m.end()+2000]
        if flag not in seg:
            print('HINT_NO_DELIVERY:', f, '->', flag)

print('=== 2. 域E文件写入的flag全库读取次数（写-only素材/断链） ===')
writes = collections.Counter()
for f in efiles[-12:]:
    src = lib[f]
    for m in re.finditer(r'st\.flags\.(_[A-Za-z0-9_]+)\s*=', src):
        writes[m.group(1)] += 1
for flag, n in sorted(writes.items()):
    # 统计全库读取（排除赋值行）
    reads = len(re.findall(r'flags\.' + flag + r'\b(?!\s*=[^=])', alltext)) + len(re.findall(r'flags\["' + flag + r'"\]', alltext))
    wr = len(re.findall(r'flags\.' + flag + r'\s*=[^=]', alltext))
    if reads - wr <= 0 and not flag.endswith('Cd'):
        print('WRITE_ONLY:', flag, 'writes=', wr)

print('=== 3. stopLossOrders 相关基础设施现状 ===')
for f, src in lib.items():
    if 'stopLossOrders' in src:
        cnt = src.count('stopLossOrders')
        print(' ', f, cnt)

print('=== 4. 域E conditions 引用的investment子字段合法性 ===')
REAL_INV = {'tradeLog','stockMarket','stockHoldings','btcPrice','btcHoldings','btcHistory',
            'btcFearGreed','btcHalvingDay','properties','selfLivePropertyId','cars','lastTickDay',
            'propertyMarketPhase','propertyPhaseStartDay','propertyPhaseDuration',
            '_propertyPolicyTightness','_propertySystemV2','stopLossOrders'}
for f in efiles[-12:]:
    src = lib[f]
    for m in re.finditer(r'\.investment\.([A-Za-z_][A-Za-z0-9_]*)', src):
        if m.group(1) not in REAL_INV:
            print('UNKNOWN_INV_FIELD:', f, '->', m.group(1))
print('DONE')

import io, os
p = "CLAUDE.md"
with open(p, "rb") as f:
    data = f.read()
nl = b"\r\n" if data.rstrip().endswith(b"|") and b"\r\n" in data else (b"\r\n" if b"\r\n" in data else b"\n")
row = (
    "| R1017b | 2026-07-31 | H Phase2/公司（git log重算recency·八域深审最陈旧H=R798b·b后缀避让并行） | "
    "A类4项：①corp_ops.js:477/479写入的_corpPerfStockBoost/_corpPerfStockDrag（注释明写「绩效影响股价(H→E)」）全库零消费方，"
    "且corp.js COMPANIES与STOCK_LIST从无任何映射→新增_employerStockSymbolR1017b三级映射（全名/前缀互含/行业兜底），"
    "在唯一股价刷新入口updateStockPrices消费并清标记（利好×1.06/利空×0.95）；"
    "②events_corp.js:1455 founder_oust主门控_acceptedVCFunding全库零写入方（真拿过融资的创始人反而进不去主路径，只靠kpi>70模拟兜底）"
    "→startup.js唯一融资成功点补写；③TEAM_MEMBERS[].salary（8000~28000，3.5倍差价）零消费、招聘面板展示薪资却一律实收¥10,000"
    "→新增getTeamHireCost单点定价（月薪×0.6，下限8000），team.js与corp_ui.js共用口径杜绝显示价≠实收价；"
    "④TEAM_MEMBERS[].skill（coding/politics/endurance/learning/general）全库零消费方，6种成员desc承诺的差异化能力毫无兑现"
    "→endQuarter按专长差异化季度结算（每种专长每季度只结一次） | "
    "联动3(domain_h_linkage_events_r1017b.js,3 corporate：h1017b_founder_stress_checkup H→G体检报告·_founderStressLevel首消费且写回源flag/"
    "h1017b_quarter_ledger_review H→E公司账vs自己账·七个季度快照flag首消费·置_dataInvestorMindset/"
    "h1017b_headhunter_pricing H→C承接A类#3招聘定价·禀赋效应自我标价重估) |"
).encode("utf-8")
if not data.endswith(nl):
    data += nl
data += row + nl
with open(p, "wb") as f:
    f.write(data)
print("appended, newline=", repr(nl))

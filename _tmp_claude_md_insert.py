# -*- coding: utf-8 -*-
p = 'CLAUDE.md'
data = open(p, 'rb').read()
anchor = b'| R900b | 2026-07-30 | D NPC/'
assert anchor in data, "R900b anchor not found in CLAUDE.md"
nl = data.find(b'\r\n', data.find(anchor))
newrow = ('\r\n| R903b | 2026-07-30 | A 数据/数值平衡（git log重算recency最陈旧R770b·b后缀避让并行R903域A在途） | '
          'A类3处数据承诺静默失效（①driver_license cert.effects.agility:1 考证allowlist漏分支→补cert.effects.agility；'
          '②bicycle effects.fatigue_reduction:10 零消费者→daily_pipeline每日恢复双源接线；'
          '③warm_coat effects.comfort:5 零消费者→每日幸福感接线；construction_safety.injuryReduction:0.5 主应用硬编码已兑现非误报） | '
          '联动3(domain_a_linkage_events_r903b.js,3street: a903b_portfolio_first_seed A→E _portfolioMilestone_10000首消费/'
          'a903b_portfolio_steady_growth A→E _portfolioMilestone_50000首消费/'
          'a903b_portfolio_half_million A→E _portfolioMilestone_500000首消费) |')
data2 = data[:nl] + newrow.encode('utf-8') + data[nl:]
open(p, 'wb').write(data2)
print('inserted R903b row; new len', len(data2))

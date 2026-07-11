import re, os

files = [
    'src/js/core/events_street_life.js',
    'src/js/core/events_street_survival.js', 
    'src/js/core/events_street_wealth.js',
    'src/js/core/career_path_events.js',
    'src/js/core/cross_system_events.js',
]

# Find events with probability > 0.15 (B-class)
for fpath in files:
    if not os.path.exists(fpath):
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    event_pattern = re.compile(r'(?:id|\'id\')\s*:\s*(?:"([^"]+)"|\'([^\']+)\'|`([^`]+)`)')
    matches = list(event_pattern.finditer(content))
    
    for idx, m in enumerate(matches):
        eid = m.group(1) or m.group(2) or m.group(3)
        start = m.start()
        end = matches[idx+1].start() if idx+1 < len(matches) else len(content)
        block = content[start:end]
        
        prob_match = re.search(r'(?:probability|prob)\s*:\s*([\d.]+)', block)
        if prob_match:
            prob = float(prob_match.group(1))
            if prob > 0.15:
                print(f'  B类: {eid} - probability={prob} 过高')


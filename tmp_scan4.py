import re, os

files = [
    'src/js/core/events_street_life.js',
    'src/js/core/events_street_survival.js', 
    'src/js/core/events_street_wealth.js',
    'src/js/core/career_path_events.js',
]

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
        
        # Extract choices with text and hint
        choice_pattern = re.compile(r'\{\s*(?:text|\'text\')\s*:\s*["\x60]([^"\x60]+)["\x60]\s*,\s*(?:hint|\'hint\')\s*:\s*["\x60]([^"\x60]*)["\x60]')
        choices = list(choice_pattern.finditer(block))
        
        for cm in choices:
            opt_text = cm.group(1)
            opt_start = cm.start()
            
            # Find apply function for this choice
            apply_start = block.index('apply', opt_start)
            apply_end = block.rindex('}', apply_start)
            apply_block = block[apply_start:apply_end+1]
            
            # Look for addMessage
            msg_pattern = re.compile(r'addMessage\(["\x60]([^"\x60]+)["\x60]')
            msgs = msg_pattern.findall(apply_block)
            
            for msg in msgs:
                # Check for obvious contradictions
                if '赚' in opt_text and '赔' in msg:
                    print(f'  B类: {eid} - 选项"{opt_text[:25]}"与消息"{msg[:30]}"矛盾')
                if '成功' in opt_text and '失败' in msg:
                    print(f'  B类: {eid} - 选项"{opt_text[:25]}"与消息"{msg[:30]}"矛盾')

print("Done scanning.")

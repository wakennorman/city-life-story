import re, os

# Final check: events mentioning specific NPC names in story without relationship conditions
npc_names = ['王大婶', '老周', '小美', '阿珍', '小李', '小张', '小王', '赵叔', '刘哥', '陈姐', '吴姐', '黄哥', '周伯', '孙姨', '马大爷']

files = [
    'src/js/core/events_street_life.js',
    'src/js/core/events_street_survival.js', 
    'src/js/core/events_street_wealth.js',
    'src/js/core/career_path_events.js',
    'src/js/core/cross_system_events.js',
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
        
        story_match = re.search(r'(?:story|\'story\')\s*:\s*`([^`]+)`', block)
        if not story_match:
            story_match = re.search(r'(?:story|\'story\')\s*:\s*"([^"]+)"', block)
        if not story_match:
            continue
        story_text = story_match.group(1)
        
        has_conditions = ('conditions' in block and 'function' in block)
        has_relationship_check = 'relationships' in block
        
        for name in npc_names:
            if name in story_text:
                if not has_relationship_check and not has_conditions:
                    print(f'C类: {eid} - story提到"{name}"但未检查relationships')
                elif has_conditions and not has_relationship_check:
                    # Check if conditions check relationships
                    cond_start = block.index('conditions')
                    cond_end = block.index('choices', cond_start) if 'choices' in block else block.index('probability', cond_start)
                    cond_text = block[cond_start:cond_end]
                    if 'relationships' not in cond_text:
                        print(f'C类(可疑): {eid} - story提到"{name}"但conditions未检查relationships')
                break


import re, os

# Search for events where the STORY specifically mentions the player doing a career activity
# but no conditions check that career

files_to_check = [
    'src/js/core/events_street_life.js',
    'src/js/core/events_street_survival.js', 
    'src/js/core/events_street_wealth.js',
]

# Patterns that imply player's career in story text
career_patterns = [
    (r'送外卖', 'delivery'),
    (r'骑手', 'rider'),
    (r'快递', 'express'),
    (r'搬砖', 'labor'),
    (r'摆摊', 'stall'),
    (r'直播', 'streaming'),
    (r'跑腿', 'errand'),
    (r'代驾', 'designated_drive'),
    (r'网约车', 'ride_hailing'),
    (r'货运', 'freight'),
]

weather_patterns = [
    (r'暴雨', 'stormy'),
    (r'大雨', 'rainy'),
    (r'雨中', 'rainy'),
    (r'寒风', 'cold'),
    (r'酷暑', 'hot'),
    (r'烈日', 'sunny_hot'),
    (r'下雪', 'snowy'),
    (r'暴雪', 'snowy'),
]

for fpath in files_to_check:
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
        
        # Get story text
        story_match = re.search(r'(?:story|\'story\')\s*:\s*`([^`]+)`', block)
        if not story_match:
            story_match = re.search(r'(?:story|\'story\')\s*:\s*"([^"]+)"', block)
        if not story_match:
            continue
        story_text = story_match.group(1)
        
        # Check if story has conditions
        has_conditions = ('conditions' in block and 'function' in block)
        has_triggers = 'triggers' in block
        
        # Check career keywords in story
        for kw, cat in career_patterns:
            if re.search(kw, story_text):
                if not has_conditions and not has_triggers:
                    print(f'A类: {eid} - story提到"{kw}"但无条件/triggers检查')
                elif has_conditions:
                    # Verify conditions actually check for this career
                    cond_block = block[block.index('conditions'):block.index('choices')]
                    if kw not in cond_block and 'career' not in cond_block and 'sideHustle' not in cond_block and 'actionFreq' not in cond_block:
                        # Check if triggers covers it
                        if not has_triggers:
                            print(f'A类(可疑): {eid} - story提到"{kw}"但conditions未直接检查该职业')
        
        # Check weather keywords in story
        for kw, cat in weather_patterns:
            if re.search(kw, story_text):
                if not has_conditions and not has_triggers:
                    print(f'A类: {eid} - story提到"{kw}"但无条件/triggers检查')
                elif has_triggers and 'weather' not in block[block.index('triggers'):block.index('conditions' if 'conditions' in block else 'choices')]:
                    print(f'A类(可疑): {eid} - story提到"{kw}"但triggers无weather检查')


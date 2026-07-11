import re, os

files = [
    'src/js/core/events_street_life.js',
    'src/js/core/events_street_survival.js', 
    'src/js/core/events_street_wealth.js',
    'src/js/core/career_path_events.js',
    'src/js/core/cross_system_events.js',
]

career_keywords = ['送外卖', '送快递', '快递员', '搬砖', '驾驶员', '司机', '摆摊', '直播', '主播', '跑腿', '骑手', '驾驶', '开网约车', '代驾', '货运', '外卖', '快递站', '跑单', '送餐', '货车', '开车', '驾驶']
weather_keywords = ['暴雨', '大雨', '雨中', '下雨', '寒冷', '酷暑', '高温', '冬天', '寒风', '烈日', '冰雹', '雷鸣', '下雪', '暴雪', '寒潮', '降温', '暖春', '秋凉', '雪天', '大雪', '冰天雪地']

for fpath in files:
    if not os.path.exists(fpath):
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Try different quote styles for id
    event_pattern = re.compile(r'(?:id|\'id\')\s*:\s*(?:"([^"]+)"|\'([^\']+)\'|`([^`]+)`)')
    
    matches = list(event_pattern.finditer(content))
    print(f'=== {fpath} ({len(matches)} events) ===')
    
    for idx, m in enumerate(matches):
        eid = m.group(1) or m.group(2) or m.group(3)
        start = m.start()
        end = matches[idx+1].start() if idx+1 < len(matches) else len(content)
        block = content[start:end]
        
        # Find story text
        story_match = re.search(r'(?:story|\'story\')\s*:\s*`([^`]+)`', block)
        if not story_match:
            story_match = re.search(r'(?:story|\'story\')\s*:\s*"([^"]+)"', block)
        if not story_match:
            continue
        story_text = story_match.group(1)
        
        has_career = any(kw in story_text for kw in career_keywords)
        has_weather = any(kw in story_text for kw in weather_keywords)
        has_conditions = ('conditions' in block and 'function' in block)
        
        if has_career and not has_conditions:
            print(f'  A类: {eid} - story提到职业但无条件检查')
        if has_weather and not has_conditions:
            print(f'  A类: {eid} - story提到天气但无条件检查')


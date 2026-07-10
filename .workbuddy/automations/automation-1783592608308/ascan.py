# -*- coding: utf-8 -*-
"""
城市浮生记 自洽审计 v3.1（指令一）
扫描 6 个目标 core 文件中的所有事件对象，检测：
  A类: 职业/天气/NPC 叙述无 conditions/triggers 守卫
  B类: 单数 trigger: function (绕过声明式过滤器)
  C类: 跨文件事件 id 重复
输出候选，供人工复核（不自动修复）。
"""
import re, os, json

TARGETS = [
    "src/js/core/events_core.js",
    "src/js/core/cross_system_events.js",
    "src/js/core/events_street_life.js",
    "src/js/core/events_street_survival.js",
    "src/js/core/events_street_wealth.js",
    "src/js/core/career_path_events.js",
]
ROOT = "D:/Claude Code+DeepSeekV4/city-life-story"

# 叙述关键词（A类启发式）
CAREER_KW = ["上班", "公司", "老板", "升职", "同事", "入职", "职场", "单位", "领导", "部门", "经理", "甲方", "客户"]
WEATHER_KW = ["下雨", "暴雨", "暴雪", "台风", "雷", "冰雹", "高温", "寒潮", "雪", "阴雨", "刮风", "酷暑", "严寒", "淋"]
NPC_KW = ["张姐", "李婶", "老王", "陈师傅", "林阿姨", "小赵", "老周", "阿强", "大壮", "秀英", "小敏", "春燕", "赵叔", "刘婶", "孙姨"]

def find_event_blocks(text):
    """返回 [(id, block_text, start, end)]，通过括号匹配定位每个事件对象。"""
    blocks = []
    for m in re.finditer(r'id:\s*["\']([^"\']+)["\']', text):
        # 向后找对象开口 {
        i = m.start()
        # 向前找到最近的 '(' 或 '{' 作为推入点
        j = i
        open_idx = -1
        while j >= 0:
            c = text[j]
            if c == '{':
                open_idx = j
                break
            if c == ')' or c == ']':
                # 可能是 push({ 中的 ({ —— 但 { 一定在更近处；这里只找 {
                pass
            j -= 1
        if open_idx < 0:
            continue
        # 从 open_idx 做括号匹配
        depth = 0
        k = open_idx
        end = -1
        while k < len(text):
            c = text[k]
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    end = k
                    break
            k += 1
        if end < 0:
            continue
        block = text[open_idx:end+1]
        blocks.append((m.group(1), block, open_idx, end))
    return blocks

def has_top_guard(block):
    # 顶层 conditions / triggers（缩进<=4空格，且后接 function / {）
    if re.search(r'\n\s{0,4}conditions:\s*function', block):
        return True
    if re.search(r'\n\s{0,4}triggers:\s*\{', block):
        return True
    # 顶层 trigger 单数（也算守卫，但记为 B 类）
    return False

def has_singular_trigger(block):
    return bool(re.search(r'\n\s{0,4}trigger:\s*function', block))

def phase_of(block):
    mm = re.search(r'\n\s{0,4}phase:\s*["\']([^"\']+)["\']', block)
    return mm.group(1) if mm else None

def story_of(block):
    # 取 story: 后的字符串（可能多行拼接）
    mm = re.search(r'\n\s{0,4}story:\s*(.+)', block)
    if not mm:
        return ""
    # 收集该属性表达式直到下一个顶层属性；简化：收集引号内及 + 拼接
    rest = block[mm.end():]
    # 找到下一个顶层属性行（缩进<=4 的 xxx:）
    nxt = re.search(r'\n\s{0,4}[a-zA-Z_][a-zA-Z0-9_]*:\s', rest)
    seg = rest[:nxt.start()] if nxt else rest
    # 抽取所有双引号字符串
    parts = re.findall(r'"((?:[^"\\]|\\.)*)"', seg)
    return " ".join(parts)

def scan_file(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    return find_event_blocks(text)

def main():
    all_events = {}  # id -> list of (file, phase)
    file_candidates = {}
    b_class = []
    summary = {}
    for rel in TARGETS:
        path = os.path.join(ROOT, rel)
        blocks = scan_file(path)
        summary[rel] = len(blocks)
        cands = []
        for eid, block, s, e in blocks:
            all_events.setdefault(eid, []).append((rel, phase_of(block)))
            if has_singular_trigger(block):
                b_class.append((rel, eid))
            # A类启发式
            story = story_of(block)
            guarded = has_top_guard(block) or has_singular_trigger(block)
            reasons = []
            if any(k in story for k in CAREER_KW) and not guarded:
                reasons.append("职业")
            if any(k in story for k in WEATHER_KW) and not guarded:
                reasons.append("天气")
            if any(k in story for k in NPC_KW) and not guarded:
                reasons.append("NPC")
            if reasons:
                cands.append((eid, phase_of(block), reasons, story[:80]))
        file_candidates[rel] = cands

    # C类：跨文件重复 id
    dup = {eid: locs for eid, locs in all_events.items() if len(locs) > 1}

    print("="*70)
    print("审计结果汇总")
    print("="*70)
    print("各文件事件数:")
    for rel, n in summary.items():
        print(f"  {rel}: {n}")
    tot = sum(summary.values())
    print(f"  合计: {tot} 事件对象（含跨文件重复计数）")
    print()
    print(f"B类（单数 trigger: 绕过过滤）: {len(b_class)} 个")
    for rel, eid in b_class:
        print(f"  - [{rel}] {eid}")
    print()
    print("A类候选（叙述含职业/天气/NPC 且顶层无 guards）— 需人工复核是否真缺陷:")
    total_a = 0
    for rel, cands in file_candidates.items():
        if cands:
            print(f"  == {rel} ({len(cands)} 候选) ==")
            for eid, ph, reasons, snip in cands:
                total_a += 1
                print(f"    - {eid} [{ph}] 标记={reasons}")
                print(f"        story: {snip}")
    print()
    print(f"A类候选总数(未复核): {total_a}")
    print()
    print(f"C类（跨文件 id 重复）: {len(dup)} 个")
    for eid, locs in dup.items():
        print(f"  - {eid}: {locs}")

if __name__ == "__main__":
    main()

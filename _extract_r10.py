import subprocess, re, os

REPO = r'D:/Claude Code+DeepSeekV4/city-life-story'

def blob(ref, path):
    return subprocess.check_output(['git', 'show', f'{ref}:{path}'], cwd=REPO).decode('utf-8')

def ids(src):
    return set(re.findall(r'id:\s*"([^"]+)"', src))

ce_r10 = blob('78f6da20', 'src/js/core/cross_system_events.js')
ce_main = blob('main', 'src/js/core/cross_system_events.js')
ce_r20 = blob('loop/r20-r119', 'src/js/core/cross_system_events.js')

r10_ids = ids(ce_r10)
main_ids = ids(ce_main)
r20_ids = ids(ce_r20)

missing = (r10_ids - main_ids)  # r10-r19 events NOT in main
# sanity: also confirm they're absent from r20-r119
missing = missing - r20_ids
missing = sorted(missing)
print(f"r10-r19 total ids: {len(r10_ids)}")
print(f"main ids: {len(main_ids)}  r20-r119 ids: {len(r20_ids)}")
print(f"missing (r10-only, absent from both main & r20): {len(missing)}")
print("MISSING IDS:")
for m in missing:
    print("  ", m)

# --- extract full event blocks for missing ids via brace matcher ---
def extract_blocks(src):
    blocks = {}
    i = 0
    n = len(src)
    while i < n:
        idx = src.find('RANDOM_EVENTS.push(', i)
        if idx == -1:
            break
        j = src.find('{', idx)
        if j == -1:
            break
        depth = 0
        k = j
        instr = None
        esc = False
        while k < n:
            c = src[k]
            if instr:
                if esc:
                    esc = False
                elif c == '\\':
                    esc = True
                elif c == instr:
                    instr = None
            else:
                if c == '"' or c == "'" or c == '`':
                    instr = c
                elif c == '{':
                    depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0:
                        k += 1
                        break
            k += 1
        block = src[idx:k]
        m = re.search(r'id:\s*"([^"]+)"', block)
        if m:
            blocks[m.group(1)] = block.rstrip()
        i = k
    return blocks

blocks = extract_blocks(ce_r10)
frag = []
notfound = []
for mid in missing:
    if mid in blocks:
        frag.append(blocks[mid] + ");\n")
    else:
        notfound.append(mid)
print(f"\nextracted blocks: {len(frag)}  notfound: {notfound}")

with open(os.path.join(REPO, '_r10_fragment.js'), 'w', encoding='utf-8') as f:
    f.write("\n".join(frag))

# --- GDD coverage check: does r20-r119's linkage GDD mention these? ---
try:
    gdd_r20 = blob('loop/r20-r119', 'memory/linkage-events-gdd.md')
except Exception:
    gdd_r20 = ""
covered = [m for m in missing if m in gdd_r20]
print(f"\nof 30 missing, mentioned in r20-r119 GDD: {len(covered)} / {len(missing)}")

# --- marker line in main's event file ---
marker = [ln for ln in ce_main.splitlines() if '注册结束' in ln or '注册' in ln and '====' in ln]
print("\nmain marker lines:", marker[:3])

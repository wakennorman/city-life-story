import re, sys

path = "src/js/core/cross_system_events.js"
with open(path, encoding="utf-8") as f:
    text = f.read()

# Extract id: "..." and title: "..."
id_pat = re.compile(r'^\s*id:\s*"([^"]+)"', re.M)
title_pat = re.compile(r'^\s*title:\s*"([^"]+)"', re.M)

ids = id_pat.findall(text)
titles = title_pat.findall(text)

print(f"Total id: {len(ids)}")
print(f"Total title: {len(titles)}")

# Duplicate IDs (CRITICAL)
from collections import Counter
id_counts = Counter(ids)
dup_ids = {k: v for k, v in id_counts.items() if v > 1}
print(f"\n=== DUPLICATE IDS (CRITICAL): {len(dup_ids)} ===")
for k, v in dup_ids.items():
    print(f"  {k} x{v}")

# Duplicate titles (redundancy candidate)
title_counts = Counter(titles)
dup_titles = {k: v for k, v in title_counts.items() if v > 1}
print(f"\n=== DUPLICATE TITLES: {len(dup_titles)} ===")
for k, v in sorted(dup_titles.items(), key=lambda x: -x[1])[:40]:
    print(f"  [{v}] {k}")

# Unique id count
print(f"\nUnique ids: {len(id_counts)}")
print(f"Unique titles: {len(title_counts)}")

# Heuristic: very short titles or empty
empties = [t for t in titles if len(t.strip()) < 2]
print(f"Empty/too-short titles: {len(empties)}")

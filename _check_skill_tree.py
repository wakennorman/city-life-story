import re, os
os.chdir('city-life-story')

# Check skill_tree for dead job references
with open('src/js/core/skill_tree.js', 'r', encoding='utf-8-sig') as f:
    st = f.read()

jobs = re.findall(r'jobBonuses:\s*\[([^\]]*)\]', st)
all_refs = []
for j in jobs:
    if j.strip():
        all_refs.extend(re.findall(r'\x22([^"]+)\x22', j))

# Remove duplicates for display
unique_refs = sorted(set(all_refs))
print("Skill tree jobBonuses references:", len(unique_refs))
for r in unique_refs:
    print(f"  - {r}")

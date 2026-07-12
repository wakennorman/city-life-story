import re
from collections import Counter

path = "src/js/core/cross_system_events.js"
with open(path, encoding="utf-8") as f:
    text = f.read()

# Active NPCs
npcs = ["aunt_wang","boss_li","sister_zhang","old_zhou","xiao_mei","chef_chen",
        "uncle_chen_bank","sister_wu","brother_huang","xiaochen","zhaojie"]
npc_counter = Counter()
for npc in npcs:
    # count occurrences of relationships["npc"] or npc id strings
    c = len(re.findall(r'relationships\["' + re.escape(npc) + r'"\]', text))
    npc_counter[npc] = c

print("=== NPC linkage density (relationships[...] refs) ===")
for npc, c in npc_counter.most_common():
    print(f"  {npc:18} {c}")

# Skills referenced in conditions
skills = ["cooking","repair","coding","english","driving","sales","management",
          "accounting","electrician","welding"]
skill_counter = Counter()
for sk in skills:
    c = len(re.findall(r'skills\.' + re.escape(sk) + r'\b', text))
    skill_counter[sk] = c

print("\n=== Skill linkage density (skills.X refs) ===")
for sk, c in skill_counter.most_common():
    print(f"  {sk:12} {c}")

# Phase distribution
phase_street = len(re.findall(r'phase:\s*"street"', text))
phase_corp = len(re.findall(r'phase:\s*"corporate"', text))
print(f"\n=== Phase: street={phase_street} corporate={phase_corp} ===")

# probability stats
probs = re.findall(r'probability:\s*([0-9.]+)', text)
probs = [float(p) for p in probs]
if probs:
    print(f"=== Probability: count={len(probs)} min={min(probs)} max={max(probs)} ===")

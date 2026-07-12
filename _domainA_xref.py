import re, os, glob

ROOT = "src/js"
def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()

# 1) Extract id keys from array-style data files
def extract_ids_array(text):
    ids = []
    # match lines like:  id: "something",
    for m in re.finditer(r'^\s*id:\s*"([^"]+)"', text, re.M):
        ids.append(m.group(1))
    return ids

jobs_text = read("src/js/data/jobs.js")
items_text = read("src/js/data/items.js")
goods_text = read("src/js/data/goods.js")
ill_text = read("src/js/data/illnesses.js")

job_ids = extract_ids_array(jobs_text)
item_ids = extract_ids_array(items_text)
goods_ids = extract_ids_array(goods_text)
ill_ids = extract_ids_array(ill_text)

print("JOB_IDS(%d): %s" % (len(job_ids), job_ids[:30]))
print("ITEM_IDS(%d): %s" % (len(item_ids), item_ids[:40]))
print("GOODS_IDS(%d): %s" % (len(goods_ids), goods_ids[:20]))
print("ILL_IDS(%d): %s" % (len(ill_ids), ill_ids[:20]))

# 2) Gather all consumer source (exclude the data files themselves)
consumers = []
for p in glob.glob("src/js/**/*.js", recursive=True):
    if p in ("src/js/data/jobs.js","src/js/data/items.js","src/js/data/goods.js","src/js/data/illnesses.js"):
        continue
    consumers.append((p, read(p)))

def refs_in_consumers(idset, label):
    found = {}
    for p, txt in consumers:
        for mid in idset:
            # find literal string usages of the id
            cnt = txt.count('"%s"' % mid) + txt.count("'%s'" % mid)
            if cnt:
                found.setdefault(mid, []).append((p, cnt))
    return found

# Orphan detection: defined but never referenced anywhere as a literal string
all_src_ids = set()
for p, txt in consumers:
    all_src_ids.add(p)

job_refs = refs_in_consumers(set(job_ids), "job")
item_refs = refs_in_consumers(set(item_ids), "item")
goods_refs = refs_in_consumers(set(goods_ids), "goods")
ill_refs = refs_in_consumers(set(ill_ids), "ill")

def orphans(idlist, refs):
    return [i for i in idlist if i not in refs]

print("\n=== ORPHAN JOBS (defined, never referenced) ===")
print(orphans(job_ids, job_refs)[:50])
print("\n=== ORPHAN ITEMS (defined, never referenced) ===")
oitems = orphans(item_ids, item_refs)
print("count=%d : %s" % (len(oitems), oitems[:60]))
print("\n=== ORPHAN GOODS ===")
print(orphans(goods_ids, goods_refs)[:30])
print("\n=== ORPHAN ILLNESSES ===")
print(orphans(ill_ids, ill_refs)[:30])

# 3) Reverse: referenced ids that are NOT defined (A-class: referenced id doesn't exist)
def undefined_refs(idlist, refs, label):
    bad = []
    for mid in refs:
        if mid not in idlist:
            bad.append(mid)
    return bad

print("\n=== UNDEFINED JOB REFS (A-class) ===", undefined_refs(job_ids, job_refs, "job"))
print("=== UNDEFINED ITEM REFS (A-class) ===", undefined_refs(item_ids, item_refs, "item"))
print("=== UNDEFINED GOODS REFS (A-class) ===", undefined_refs(goods_ids, goods_refs, "goods"))
print("=== UNDEFINED ILLNESS REFS (A-class) ===", undefined_refs(ill_ids, ill_refs, "ill"))

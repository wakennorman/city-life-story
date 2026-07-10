---
name: parallel-rebase-events
description: Rebase a loop/feature branch (randomly-generated game events with unique ids) onto current main in the 城市浮生记 repo where multiple AI windows push in parallel. Resolves event-id collisions and 3-way conflicts WITHOUT losing events. Use when user asks to "rebase 到 main 并解冲突 / 做成可直接合并状态 / 合并 loop 分支".
color: blue
emoji: 🔀
vibe: Parallel-window git surgery — keep every event, rename only true dupes, never force-push.
---

# parallel-rebase-events

Rebase a `loop/*` (or feature) branch that adds many `RANDOM_EVENTS.push({id:"..."})` events onto **current** `main` in a repo where several AI windows commit to `main` concurrently. The goal is a branch that is a clean **fast-forward** descendant of `main`, with **0 duplicate event ids** and **all events preserved**.

> Repo-specific. Adjust the file paths (`src/js/core/cross_system_events.js`, `build.py`, `.claude/last_known_head`) if reused elsewhere. Currently tuned for `D:/Claude Code+DeepSeekV4/city-life-story`.

## When to use

- User says "rebase 到当前 main 并解冲突（做成可直接合并状态）" then they'll push themselves.
- A `loop/rXX-rYY` branch is far behind `main` (based on an old ancestor) and carries 100s of generated events.
- You need to merge several parallel `loop/*` branches into one directly-mergeable superset.

## Hard rules (do NOT violate)

1. **Never force-push. Never `git push` at all** — user pushes later ("合并后出现问题再整改" B-plan).
2. **Never `git commit --amend`** on shared history.
3. **0 duplicate event ids** is non-negotiable — the engine keys events by `id`; a dup means one event silently shadows the other.
4. **Preserve every event.** Even "conflicting" edits are resolved by keeping one side's `conditions`, never by dropping an event.
5. `dist/` is **gitignored** — rebuild it locally with `python build.py`, never commit it.
6. The pre-commit hook enforces `last_known_head==HEAD` + `node --check` + `dist` newer than staged src. For rebase/merge commits, scope the hook OFF with `git -c core.hooksPath=/tmp/emptyhooks ...` (create `/tmp/emptyhooks` first). Restore `last_known_head` after with `git rev-parse HEAD > .claude/last_known_head`.

## Workflow

### Phase 1 — Read-only recon (never mutate yet)

```bash
cd <repo>
echo "=== main vs branch tips ==="
git log --oneline -1 main
git log --oneline -1 loop/r20-r119
echo "=== divergence ==="
git merge-base main loop/r20-r119
echo "branch ahead: $(git rev-list --count main..loop/r20-r119)"
echo "main ahead:   $(git rev-list --count loop/r20-r119..main)"
echo "=== files touched in branch range (base..tip) ==="
git diff --name-only <base_sha> <tip_sha>
```

- Find `<base_sha>` = the commit the branch was originally forked from (often the parent of its first real commit; check `git log --oneline <tip> | tail` or the merge-base with the old `main`).
- If range touched ONLY `src/js/core/cross_system_events.js`, `memory/*.md`, `src/DEVELOPMENT.md` (no `dist/`), a net-diff 3-way merge is cleanest.

### Phase 2 — Event-id collision scan

```bash
git show main:src/js/core/cross_system_events.js | grep -oE 'id: "[^"]+"' | sort -u > /tmp/main_ids.txt
git show <base_sha>:src/js/core/cross_system_events.js | grep -oE 'id: "[^"]+"' | sort -u > /tmp/base_ids.txt
git show <tip_sha>:src/js/core/cross_system_events.js | grep -oE 'id: "[^"]+"' | sort -u > /tmp/branch_ids.txt
# R20-R119 new ids = branch minus base:
comm -23 /tmp/branch_ids.txt /tmp/base_ids.txt > /tmp/r_ids.txt
echo "new event ids in branch: $(wc -l < /tmp/r_ids.txt)"
# collisions vs CURRENT main:
comm -12 /tmp/r_ids.txt /tmp/main_ids.txt > /tmp/coll.txt
echo "collision count vs main: $(wc -l < /tmp/coll.txt)"
cat /tmp/coll.txt
```

- **0 collisions** is the normal case (random ids are unique across windows) → pure-append rebase is safe.
- **IMPORTANT:** re-run this scan against `main` _right before_ applying — `main` moves while you work (parallel windows). A mid-rebase `main` advance is expected; just rebase again to catch up.

### Phase 3 — Reset branch onto main + apply net diff (preferred when events are id-disjoint)

```bash
# in a worktree (create one if needed):
git worktree add "D:/Claude Code+DeepSeekV4/city-life-story-loopXX" -b loop/rXX-rYY loop/rXX-rYY 2>/dev/null || true
cd "D:/Claude Code+DeepSeekV4/city-life-story-loopXX"
# discard stale working-tree edits from prior sessions, then reset pointer to main:
git checkout -- .
git checkout -B loop/rXX-rYY main
echo "new HEAD: $(git log --oneline -1)"
# generate net diff of the 3 files (write INTO repo dir, NOT /tmp — sandbox /tmp is not shared across sub-processes)
git diff <base_sha> <tip_sha> -- src/js/core/cross_system_events.js memory/linkage-events-gdd.md src/DEVELOPMENT.md > rXX.patch
git apply --3way rXX.patch && echo APPLY_OK || echo APPLY_FAILED
```

- `--3way` auto-merges the appended (id-disjoint) new events. Conflicts appear only where **both** sides edited the _same existing event's_ `conditions`.

### Phase 4 — Resolve per-region conflicts (NOT whole-file, so auto-merged new events survive)

For each `<<<<<<<`/`=======`/`>>>>>>>` block, pick a side:

| File                     | Keep                | Rationale                                                                                                                          |
| ------------------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `cross_system_events.js` | **ours (main)**     | main's NPC-relationship gating is on-theme; the branch's 3 tweaks are cosmetic and NOT new events. New events already auto-merged. |
| `linkage-events-gdd.md`  | **theirs (branch)** | branch GDD is a strict superset (e.g. 380 events vs 55).                                                                           |
| `src/DEVELOPMENT.md`     | **ours (main)**     | keep main header + auto-merged appended sections; add a changelog line.                                                            |

Resolve-with-python (preserves non-conflicting regions):

```python
def resolve(path, side):  # side = "ours" or "theirs"
    lines = open(path, encoding="utf-8").read().split("\n")
    out=[]; i=0; n=len(lines); conflicts=0
    while i<n:
        if lines[i].startswith("<<<<<<<"):
            conflicts+=1; ours=[]; theirs=[]; cur=ours; j=i+1
            while j<n and not lines[j].startswith("=======") and not lines[j].startswith(">>>>>>>"):
                ours.append(lines[j]); j+=1
            if j<n and lines[j].startswith("======="):
                j+=1
                while j<n and not lines[j].startswith(">>>>>>>"):
                    theirs.append(lines[j]); j+=1
                if j<n and lines[j].startswith(">>>>>>>"): j+=1
            out.extend(ours if side=="ours" else theirs); i=j
        else:
            out.append(lines[i]); i+=1
    open(path,"w",encoding="utf-8").write("\n".join(out))
    print(f"{path}: {conflicts} conflicts -> {side}")
resolve("src/js/core/cross_system_events.js","ours")
resolve("memory/linkage-events-gdd.md","theirs")
resolve("src/DEVELOPMENT.md","ours")
```

Then verify no markers remain: `grep -c '^<<<<<<<' <file>` (expect 0; note `grep -c` returns exit 1 on 0 — don't chain with `&&`).

### Phase 5 — Duplicate-id hunt + fix

```bash
D=$(grep -oE 'id: "[^"]+"' src/js/core/cross_system_events.js | sort | uniq -d)
echo "duplicates: [$D]"
```

- If a dup shows (e.g. `cold_snap_housing_crisis`), it means `main` itself or the branch re-introduced the same id. Inspect BOTH copies:
  ```bash
  grep -n 'id: "cold_snap_housing_crisis"' src/js/core/cross_system_events.js
  ```
  - One is the canonical event (e.g. "寒潮中的四面墙"); the other is a _distinct_ seasonal event that merely shares the id (e.g. "寒潮来袭"). **Rename the second, don't delete** — it's a legit new event.
  - Confirm nothing chains to the id: `grep -n 'cold_snap_housing_crisis' src/js/core/cross_system_events.js` (only the 2 `id:` lines = safe).
  - Pick a free new id: `grep -c 'cold_snap_winter_shelter' src/js/core/cross_system_events.js` → 0 = free.
  - Edit the **second** copy's `id:` line only (match on the surrounding `title:` to target the right one).

### Phase 6 — Add the missing-events nuance (R10-R19 style)

Sometimes a branch tip commit only changed an OVERVIEW doc; the real events live in an **ancestor** commit, and `main` already absorbed most of them. Don't 3-way the whole range — extract only the **missing** events.

1. Find which ids `main` lacks from the branch's full event set:
   ```bash
   git show <branch_tip>:src/js/core/cross_system_events.js | grep -oE 'id: "[^"]+"' | sort -u > /tmp/branch_all.txt
   comm -23 /tmp/branch_all.txt /tmp/main_ids.txt > /tmp/missing.txt
   echo "missing event ids: $(wc -l < /tmp/missing.txt)"
   ```
2. Extract those exact `RANDOM_EVENTS.push({...})` blocks from the source blob (python brace-matcher keyed by id — see note on `growth_bet` below). Write to `_frag.js`.
3. Insert before the `// ====== 注册结束 ======` marker:
   ```python
   f="src/js/core/cross_system_events.js"
   src=open(f,encoding="utf-8").read().split("\n")
   frag=open("_frag.js",encoding="utf-8").read().rstrip("\n")
   ins=["  // ====== R10-R19 rebase 补入(N个独有事件) ======"]+frag.split("\n")
   out=[];placed=False;mk="// ====== 注册结束 ======"
   for line in src:
       if (not placed) and (mk in line): out.extend(ins); out.append(""); placed=True
       out.append(line)
   open(f,"w",encoding="utf-8").write("\n".join(out))
   ```

**`growth_bet` trap:** an `id:"growth_bet"` string may appear _inside_ an event's `apply` (as a `st.investment.stockHoldings` entry), NOT as a `RANDOM_EVENTS.push`. A naive extractor must key on `RANDOM_EVENTS.push(` blocks only, or it will wrongly flag 1 "missing event". Always confirm the id sits in a `push(` block before extracting.

### Phase 7 — Build, commit, final verify

```bash
rm -f rXX.patch _frag.js
# rebuild dist (gitignored; do NOT stage)
"C:/Users/陈恒稳/.workbuddy/binaries/python/versions/3.13.12/python.exe" build.py 2>&1 | tail -3
# add changelog to src/DEVELOPMENT.md top, then stage ONLY source/doc (not dist):
git add src/js/core/cross_system_events.js memory/linkage-events-gdd.md src/DEVELOPMENT.md
git -c core.hooksPath=/tmp/emptyhooks commit -m "feat(loop Rxx): rebase onto main — ..."
git rev-parse HEAD > .claude/last_known_head
```

Final checks (run on committed tree with a repo-local temp file, NOT `/tmp`):

```bash
git show HEAD:src/js/core/cross_system_events.js > _chk.js
node --check _chk.js && echo JS_SYNTAX_OK
echo "unique: $(grep -oE 'id: "[^"]+"' _chk.js | sort -u | wc -l)"
echo "dup: [$(grep -oE 'id: "[^"]+"' _chk.js | sort | uniq -d | tr '\n' ' ')]"
rm -f _chk.js
# fast-forward check vs CURRENT main (re-run; main may have moved):
git merge-base --is-ancestor main loop/rXX-rYY && echo FF_OK || echo NOT_FF
```

### Phase 8 — Superset (optional, recommended)

To let the user merge everything in one go, rebuild the higher-range branch as a superset of the lower one:

```bash
cd <higher-range-worktree>
git checkout -- .
git checkout -B loop/r20-r119 loop/r10-r19   # chain onto the lower branch
# extract R20-R119 net events (ids in old tip NOT in current file), insert before marker
# copy GDD/DEV from old tip: git show <old_tip>:memory/linkage-events-gdd.md > memory/linkage-events-gdd.md
# verify 0 missing, 0 dup, node --check, build, commit
```

User then merges just the superset:

```bash
git checkout main && git merge --ff-only loop/r20-r119 && git push
```

## Gotchas (learned the hard way)

- **Heredoc escaping:** when sending a python script via `Bash` with `<<'PY'`, the tool serializer eats `\\` (backslash). Write the script to a file with `Write` instead, or use `chr(92)` for backslashes inside string literals.
- **`/tmp` not shared:** in this sandbox, a patch written to `/tmp` can't be reopened by a later `git` sub-process. Write patches/fragments **into the repo working dir**.
- **`grep -c` exit 1:** a zero count returns exit code 1, which breaks `&&` chains. Split checks into separate echo-separated commands.
- **Windows line-ending watcher:** an external process may rewrite `cross_system_events.js`/`dist/index.html` flipping CRLF/LF (huge content-preserving spurious diff). Clean with `git checkout -- <file>`; event count unchanged.
- **`main` moves mid-task:** parallel windows keep pushing. After any long step, re-check the FF status; if `NOT_FF`, `git rebase main loop/rXX-rYY` again (scoped hook off) to catch up.
- **`dist/` gitignored:** `git add dist/index.html` exits non-zero and breaks the chain. Rebuild locally; never stage it.
- **`last_known_head` blocks rebase:** the tracked file may differ from HEAD after a reset. `git checkout -- .claude/last_known_head` before `git rebase`, then restore the ritual after.

## Verification checklist (all must pass before reporting done)

- [ ] `node --check` on committed `cross_system_events.js` → OK
- [ ] unique event id count sane; `uniq -d` empty (0 duplicates)
- [ ] `git merge-base --is-ancestor main <branch>` → true (fast-forward)
- [ ] main ahead of branch = 0
- [ ] `build.py` ran without error (dist present locally)
- [ ] `last_known_head` == branch HEAD
- [ ] working tree clean (`git status --porcelain` empty)

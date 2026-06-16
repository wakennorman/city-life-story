#!/usr/bin/env python3
"""Find English UI text in JS files that should be translated to Chinese.
Targets only user-facing strings: addMessage(), innerHTML, textContent, button text, modal titles.
"""

import re
import os

SRC_DIR = 'D:/Claude Code+DeepSeekV4/city-life-story/src/js'

def has_chinese(s):
    for ch in s:
        if ord(ch) >= 0x4E00 and ord(ch) <= 0x9FFF:
            return True
    return False

def is_code_identifier(s):
    """Check if string looks like a code identifier or predefined value."""
    if re.match(r'^[a-z_][a-z0-9_]*$', s, re.I): return True
    if re.match(r'^[.#]?[a-zA-Z][a-zA-Z0-9_-]*$', s, re.I): return True
    if re.match(r'^var\(', s): return True
    if re.match(r'^#[0-9a-fA-F]{3,8}$', s): return True
    if re.match(r'^rgba?\(', s): return True
    if re.match(r'^https?://', s): return True
    if re.match(r'^data-[a-z]+', s, re.I): return True
    if s in ('success', 'danger', 'warning', 'info', 'event'): return True
    if s in ('street', 'corporate', 'actions', 'text', 'callback', 'title', 'body', 'name'): return True
    if re.match(r'^[a-z]+-[a-z]+(-[a-z]+)*$', s): return True  # CSS classes
    return False

def scan_file(filepath):
    rel = os.path.relpath(filepath, SRC_DIR)
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    changes = []

    for i, line in enumerate(lines, 1):
        # Find double-quoted strings
        for m in re.finditer(r'"([^"]*)"', line):
            s = m.group(1)
            if not s or len(s) < 3: continue
            if has_chinese(s): continue
            if not re.search(r'[A-Za-z]{3,}', s): continue
            if is_code_identifier(s): continue
            # Check context: is it in addMessage?
            before = line[:m.start()]
            if 'addMessage' in before:
                changes.append((i, 'addMessage', s[:80]))
                continue
            # Check context: textContent / innerHTML assignment
            if re.search(r'(textContent|innerHTML)\s*[=+]', before):
                changes.append((i, 'innerHTML/textContent', s[:80]))
                continue
            # Check context: showModal or button text
            if re.search(r'(title|text|body):', before):
                changes.append((i, 'modal/button', s[:80]))
                continue

        # Find template literals (backtick strings)
        for m in re.finditer(r'`([^`]*)`', line):
            s = m.group(1)
            if has_chinese(s): continue
            parts = re.split(r'\$\{[^}]+\}', s)
            static = ''.join(parts).strip()
            if not static: continue
            if not re.search(r'[A-Za-z]{3,}', static): continue
            if is_code_identifier(static.strip()): continue

            before = line[:m.start()]
            if 'addMessage' in before:
                changes.append((i, 'addMessage`', static[:80]))
                continue
            if re.search(r'(innerHTML)\s*[=+]', before):
                changes.append((i, 'innerHTML`', static[:80]))
                continue
            if re.search(r'(title|text|body):', before):
                changes.append((i, 'modal/button`', static[:80]))
                continue

    return changes

def main():
    total_by_file = {}
    all_count = 0
    for root, dirs, files in os.walk(SRC_DIR):
        for f in sorted(files):
            if not f.endswith('.js'): continue
            path = os.path.join(root, f)
            changes = scan_file(path)
            if changes:
                rel = os.path.relpath(path, SRC_DIR)
                total_by_file[rel] = changes
                all_count += len(changes)
                print(f"\n=== {rel} ({len(changes)} issues) ===")
                for line_no, kind, text in changes:
                    print(f"  L{line_no} [{kind}] {text}".encode('utf-8', errors='replace').decode('utf-8'))

    print(f"\n\nSummary: {len(total_by_file)} files, {all_count} total issues")
    for f, changes in sorted(total_by_file.items()):
        print(f"  {f}: {len(changes)}")

if __name__ == '__main__':
    main()
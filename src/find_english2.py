#!/usr/bin/env python3
"""More thorough English UI text finder, handles multi-line strings."""

import re
import os

SRC_DIR = 'D:/Claude Code+DeepSeekV4/city-life-story/src/js'

def has_chinese(s):
    for ch in s:
        if ord(ch) >= 0x4E00 and ord(ch) <= 0x9FFF:
            return True
    return False

def extract_addmessage_args(text):
    """Extract first argument of addMessage() and addMessage template literal."""
    results = []
    # Match addMessage( "..." , ... ) or addMessage( `...` , ... )
    # Simple approach: find all addMessage( ... ) calls and extract first string
    idx = 0
    while True:
        pos = text.find('addMessage(', idx)
        if pos == -1:
            break
        # Find the opening quote/backtick
        start = pos + len('addMessage(')
        # Skip whitespace
        while start < len(text) and text[start] in ' \n\r\t':
            start += 1
        if start >= len(text):
            break
        quote = text[start]
        if quote not in '"\'`':
            idx = pos + 1
            continue
        # Find closing quote
        end = start + 1
        while end < len(text):
            if text[end] == '\\':
                end += 2
                continue
            if text[end] == quote:
                # Found the closing quote
                content = text[start+1:end]
                # Check if the next char after quote is comma (addMessage arg)
                rest = text[end+1:].strip()
                if rest and rest[0] == ',':
                    if has_chinese(content):
                        idx = end + 1
                        continue
                    if re.search(r'[A-Za-z]{4,}', content):
                        results.append((pos, content[:100]))
                idx = end + 1
                break
            end += 1
        else:
            # No closing quote found, move forward
            idx = pos + 1
    return results

def scan_file_addmessages(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    return extract_addmessage_args(content)

def scan_file_other_ui_text(filepath):
    """Find other UI text patterns: showModal title/text, string-only innerHTML/textContent."""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    results = []
    for i, line in enumerate(lines, 1):
        # textContent = "..."
        for m in re.finditer(r'textContent\s*=\s*"([^"]*)"', line):
            s = m.group(1)
            if s and not has_chinese(s) and re.search(r'[A-Za-z]{4,}', s) and not re.match(r'^[a-z_][a-z0-9_]*$', s, re.I):
                results.append((i, 'textContent', s[:80]))
        # textContent = `...` (simple, no embeds)
        for m in re.finditer(r'textContent\s*=\s*`([^`]*)`', line):
            s = m.group(1)
            if not s or has_chinese(s): continue
            parts = re.split(r'\$\{[^}]+\}', s)
            static = ''.join(parts).strip()
            if static and re.search(r'[A-Za-z]{4,}', static):
                results.append((i, 'textContent`', static[:80]))
        # ShowModal / Modal button texts
        for m in re.finditer(r'(?:text|title)\s*:\s*"([^"]*)"', line):
            s = m.group(1)
            if s and not has_chinese(s) and re.search(r'[A-Za-z]{3,}', s) and not re.match(r'^[a-z_][a-z0-9_]*$', s, re.I):
                # Check context: is it in modal buttons?
                if 'showModal' in line or 'buttons' in line:
                    results.append((i, 'modal_btn', s[:80]))
        # Button text in innerHTML (like 'data-qty="10">Buy</button>')
        for m in re.finditer(r'>([A-Za-z][A-Za-z ]+)<', line):
            s = m.group(1).strip()
            if s and not has_chinese(s) and re.search(r'[A-Za-z]{4,}', s) and len(s) > 2:
                before = line[:m.start()]
                if 'btn' in before or 'button' in before:
                    results.append((i, 'btn_HTML', s[:80]))
    return results

def main():
    all_issues = []
    for root, dirs, files in os.walk(SRC_DIR):
        for f in sorted(files):
            if not f.endswith('.js'): continue
            if f.endswith('.bak.js'): continue  # Skip backup files
            path = os.path.join(root, f)
            rel = os.path.relpath(path, SRC_DIR)

            issues = []

            # Check addMessage calls
            for pos, content in scan_file_addmessages(path):
                # Find line number (approximate)
                with open(path, 'r', encoding='utf-8') as fh:
                    before = fh.read()[:pos]
                    line_no = before.count('\n') + 1
                issues.append((line_no, 'addMessage', content))

            # Check other UI text
            for line_no, kind, text in scan_file_other_ui_text(path):
                issues.append((line_no, kind, text))

            if issues:
                all_issues.append((rel, issues))
                print(f"\n=== {rel} ({len(issues)} issues) ===")
                for line_no, kind, text in issues:
                    print(f"  L{line_no} [{kind}] {text}")

    print(f"\n\n=== SUMMARY ===")
    total = sum(len(issues) for _, issues in all_issues)
    print(f"{len(all_issues)} files, {total} total issues")
    for rel, issues in all_issues:
        print(f"  {rel}: {len(issues)}")

if __name__ == '__main__':
    main()
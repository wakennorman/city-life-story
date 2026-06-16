#!/usr/bin/env python3
"""
构建脚本：将 src/ 下的所有 CSS/JS 内联到单个 index.html 中
输出到 dist/index.html（可独立部署的单文件）
"""

import re
import os

SRC_DIR = 'src'
DIST_DIR = 'dist'
OUTPUT_FILE = os.path.join(DIST_DIR, 'index.html')

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def inline_css(html):
    """内联 <link rel="stylesheet"> """
    def replace_css(match):
        href = match.group(1)
        path = os.path.join(SRC_DIR, href)
        if os.path.exists(path):
            css = read_file(path)
            # 压缩CSS（简单版）
            css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
            css = re.sub(r'\s+', ' ', css)
            return f'<style>{css}</style>'
        return match.group(0)

    return re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"[^>]*>', replace_css, html)

def inline_js(html):
    """内联 <script src="..."> """
    def replace_js(match):
        attrs = match.group(0)
        src_match = re.search(r'src="([^"]+)"', attrs)
        if not src_match:
            return match.group(0)
        src = src_match.group(1)
        path = os.path.join(SRC_DIR, src)
        if os.path.exists(path):
            js = read_file(path)
            return f'<script>{js}</script>'
        return match.group(0)

    return re.sub(r'<script\s+src="([^"]+)"[^>]*></script>', replace_js, html)

def main():
    os.makedirs(DIST_DIR, exist_ok=True)

    html = read_file(os.path.join(SRC_DIR, 'index.html'))

    # 移除开发阶段的注释
    html = re.sub(r'<!-- =+\s*Scripts.*?-->', '', html, flags=re.DOTALL)

    # 内联 CSS
    html = inline_css(html)

    # 内联 JS（按顺序）
    html = inline_js(html)

    # 写入
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    size_kb = os.path.getsize(OUTPUT_FILE) / 1024
    print(f'Build complete: {OUTPUT_FILE} ({size_kb:.1f} KB)')

if __name__ == '__main__':
    main()

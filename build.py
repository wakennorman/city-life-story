#!/usr/bin/env python3
"""
构建脚本：将 src/ 下的所有 CSS/JS 内联到单个 index.html 中
复制非内联资源（images/）到 dist/，输出到 dist/index.html（可独立部署）
"""

import re
import os
import subprocess
import sys
import shutil

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
            # JS语法检查
            try:
                subprocess.run(
                    ['node', '--check', path],
                    capture_output=True, text=True, check=True
                )
            except subprocess.CalledProcessError as e:
                err_msg = e.stderr.strip() if e.stderr else '语法错误'
                # 避免GBK终端炸emoji
                print('\n[JS语法错误] %s' % path)
                print(err_msg)
                sys.exit(1)
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

    # 复制静态资源（images/）
    src_images = os.path.join(SRC_DIR, 'images')
    dst_images = os.path.join(DIST_DIR, 'images')
    if os.path.isdir(src_images):
        if os.path.exists(dst_images):
            # Avoid trash issues on Windows: incremental copy instead of full delete+copy
            import filecmp
            for root, dirs, files_list in os.walk(src_images):
                for fname in files_list:
                    src_file = os.path.join(root, fname)
                    rel = os.path.relpath(src_file, src_images)
                    dst_file = os.path.join(dst_images, rel)
                    os.makedirs(os.path.dirname(dst_file), exist_ok=True)
                    if not os.path.exists(dst_file) or filecmp.cmp(src_file, dst_file, shallow=False):
                        shutil.copy2(src_file, dst_file)
        else:
            shutil.copytree(src_images, dst_images)

    # 写入
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    size_kb = os.path.getsize(OUTPUT_FILE) / 1024
    print(f'Build complete: {OUTPUT_FILE} ({size_kb:.1f} KB)')

if __name__ == '__main__':
    main()

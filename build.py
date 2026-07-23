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

def bundle_js(html):
    """
    P0-1 首屏外部化：把所有 <script src="..."> 按出现顺序串接进单个外部
    dist/app.js（而非逐个内联），HTML 中首个 src 标签替换为
    <script defer src="app.js">，其余删除。

    这样浏览器可先解析并渲染欢迎壳（内联关键 CSS），app.js 走 defer 在
    解析后加载，不再阻塞首屏；GitHub Pages 对 app.js 自动 gzip。

    返回 (new_html, bundle_code)。串接必须严格按 index.html 出现序——
    全局加载序敏感（288 个 window.* 顶层声明依赖顺序）。
    行内 <script>（错误边界 / boot）无 src 属性，不被匹配，保持内联。
    """
    chunks = []      # 串接后的 JS 片段
    state = {'first': True}

    def replace_js(match):
        attrs = match.group(0)
        src_match = re.search(r'src="([^"]+)"', attrs)
        if not src_match:
            return match.group(0)
        src = src_match.group(1)
        path = os.path.join(SRC_DIR, src)
        if not os.path.exists(path):
            # 缺失文件：保持原标签（与旧行为一致，暴露问题）
            return match.group(0)
        # JS语法检查（保留原有构建期门禁）
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
        # 文件间用 \n;\n 分隔防 ASI 粘连；注释标出源路径便于线上排错
        chunks.append('\n;\n// ==== %s ====\n%s' % (src, js))
        if state['first']:
            state['first'] = False
            return '<script defer src="app.js"></script>'
        return ''  # 其余 src 标签删除，全部并入 app.js

    new_html = re.sub(r'<script\s+src="([^"]+)"[^>]*></script>', replace_js, html)
    bundle_code = ''.join(chunks)
    return new_html, bundle_code

def main():
    os.makedirs(DIST_DIR, exist_ok=True)

    html = read_file(os.path.join(SRC_DIR, 'index.html'))

    # 移除开发阶段的注释
    html = re.sub(r'<!-- =+\s*Scripts.*?-->', '', html, flags=re.DOTALL)

    # 内联 CSS
    html = inline_css(html)

    # P0-1: JS 外部化（defer bundle）
    html, bundle_code = bundle_js(html)

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

    # 复制 favicon 文件到 dist/
    for fname in os.listdir(SRC_DIR):
        if fname.startswith('favicon') or fname.startswith('apple-touch-icon'):
            src_file = os.path.join(SRC_DIR, fname)
            if os.path.isfile(src_file):
                shutil.copy2(src_file, os.path.join(DIST_DIR, fname))
                print(f"  📦 favicon: {fname}")

    # 复制 _headers 到 dist/（GitHub Pages CSP 配置）
    headers_src = os.path.join(SRC_DIR, '_headers')
    if os.path.isfile(headers_src):
        shutil.copy2(headers_src, os.path.join(DIST_DIR, '_headers'))
        print(f"  📦 _headers")

    # 写入 index.html（瘦壳，只含内联 CSS + boot 脚本 + defer app.js）
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    # 写入外部 JS bundle（app.js）
    app_js_path = os.path.join(DIST_DIR, 'app.js')
    with open(app_js_path, 'w', encoding='utf-8') as f:
        f.write(bundle_code)
    raw_kb = os.path.getsize(app_js_path) / 1024

    # P2-2: esbuild 压缩已禁用 — 源文件有重复 function 声明与 esbuild 的 use strict 不兼容
    # 待修复所有重复声明后重新启用：npx esbuild app.js --minify --outfile=app.js

    html_kb = os.path.getsize(OUTPUT_FILE) / 1024
    app_kb = os.path.getsize(app_js_path) / 1024
    print(f'Build complete: {OUTPUT_FILE} ({html_kb:.1f} KB) + app.js ({app_kb:.1f} KB)')

if __name__ == '__main__':
    main()

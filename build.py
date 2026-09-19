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
    js_files = []    # 待语法检查的文件（收集后再批量检查，见下）
    missing = []     # 被 <script src> 引用但磁盘上不存在的文件（见下方硬失败）
    state = {'first': True}

    def replace_js(match):
        attrs = match.group(0)
        src_match = re.search(r'src="([^"]+)"', attrs)
        if not src_match:
            return match.group(0)
        src = src_match.group(1)
        path = os.path.join(SRC_DIR, src)
        if not os.path.exists(path):
            # 缺失文件：**收集起来，构建结束时硬失败**（见 bundle_js 末尾）。
            #
            # ★ 此前这里是「保持原标签后静默返回」，注释写着"暴露问题"，
            #   但实际后果恰恰相反 —— 它是**隐瞒**问题：
            #     · 构建照常成功，打印 "Build complete"
            #     · 产物里少了一段代码，其中注册的事件永不发火
            #     · 只有浏览器打开时才会有 404，CI 完全看不到
            #
            #   真实事故（.claude/domain-optimization-round-393.md）：
            #     src/index.html:587 引用 domain_b_linkage_r389.js（不存在，
            #     真实文件是 r389b.js）→ build.py 静默跳过 →
            #     R389 域B 联动事件从 bundle 中被剔除、永不发火。
            #     该问题由人工审查发现，而非任何门禁。
            #
            #   保持原标签的行为予以保留（使 404 在浏览器中可见），
            #   但同时记录到 missing 列表，让构建**立即失败**。
            missing.append(src)
            return match.group(0)
        # 仅收集，暂不检查 —— 见下方「批量语法检查」说明
        js_files.append(path)
        js = read_file(path)
        # 文件间用 \n;\n 分隔防 ASI 粘连；注释标出源路径便于线上排错
        chunks.append('\n;\n// ==== %s ====\n%s' % (src, js))
        if state['first']:
            state['first'] = False
            return '<script defer src="app.js"></script>'
        return ''  # 其余 src 标签删除，全部并入 app.js

    new_html = re.sub(r'<script\s+src="([^"]+)"[^>]*></script>', replace_js, html)
    bundle_code = ''.join(chunks)

    # ── 批量语法检查（原为逐个 spawn，见报告第 41 节）────────────────────────
    #
    # 【旧实现】在 replace_js 回调里对每个文件执行：
    #       subprocess.run(['node', '--check', path], ...)
    #   在 1174 个被引用文件的规模下，进程启动开销成为绝对瓶颈：
    #       单次 spawn 平均 344ms × 1174 ≈ **405 秒**
    #   而构建本身的全部工作（读 1177 文件 + 拼接 + 写出 16MB）实测仅 0.63 秒。
    #   即：构建耗时的 99.8% 花在进程启动上，而非构建。
    #
    #   这与 scripts/check-js-syntax.mjs 修掉的是同一个问题
    #   （1177 文件 255s → 1.5s，见报告第 37 节）。当时只修了 CI 那一份。
    #
    # 【新实现】把文件列表交给 scripts/check-js-batch.mjs，
    #   单个 node 进程内用 vm.Script 逐个编译（只编译、不执行，
    #   与 `node --check` 语义等价）：1174 文件 ≈ **1.1 秒**。
    #
    # 【为何不直接复用 check-js-syntax.mjs】
    #   那个脚本固定扫描 src/js/**（1177 个），而 build 只应检查**被
    #   src/index.html 实际引用**的文件（1174 个）。src/js 下有 3 个文件
    #   未被任何 <script src> 引用（app_bridge/webapp_runtime_bridge.js、
    #   core/gate_registry.js、phase1/weather.js，属已知悬空文件），
    #   全量扫描会把它们纳入，超出 build 的职责。故此处传显式列表。
    #
    # 【语义等价性验证】见报告第 41 节：构造样例（3 错 + 1 对）两方案判定
    #   逐一致；60 个真实文件采样 + 全量 1174 个，两方案结论一致（0 失败）。
    if js_files:
        checker = os.path.join('scripts', 'check-js-batch.mjs')
        if os.path.exists(checker):
            proc = subprocess.run(
                ['node', checker],
                input='\n'.join(js_files),
                capture_output=True, text=True, encoding='utf-8',
            )
            if proc.returncode != 0:
                # 避免 GBK 终端炸 emoji
                print('\n[JS语法错误] 检查未通过：')
                print(proc.stderr.strip() if proc.stderr else proc.stdout.strip())
                sys.exit(1)
        else:
            # 兜底：批量检查脚本缺失时，回退到逐个检查（慢但可用）
            print('⚠️  未找到 %s，回退到逐个语法检查（较慢）' % checker)
            for path in js_files:
                try:
                    subprocess.run(
                        ['node', '--check', path],
                        capture_output=True, text=True, check=True,
                    )
                except subprocess.CalledProcessError as e:
                    print('\n[JS语法错误] %s' % path)
                    print(e.stderr.strip() if e.stderr else '语法错误')
                    sys.exit(1)

    # ── 悬空引用硬失败 ──────────────────────────────────────────────────────
    #
    # 这是本函数唯一一处「不产出即可宣布失败」的检查，因为缺失是**结构性**的：
    # 少一个文件，其后所有注册的事件都不会进入 bundle，而构建看起来完全正常。
    #
    # 历史上这类故障至少发生 8 次（R196 / R393 / R397 / R411 / R418 / R431 /
    # R554 / R590），其中 R393 造成「R389 域B 联动事件从 bundle 中被剔除、
    # 永不发火」，且是靠人工审查发现的。
    #
    # 门禁 scripts/audit-dangling-refs.mjs 也能拦（在 CI 中运行），
    # 但那是**事后**；此处是**构建当场**失败，反馈更早、定位更准。
    if missing:
        print('\n[悬空引用] 以下文件被 <script src> 引用，但磁盘上不存在：')
        for src in missing:
            print('    ✗ %s   (期望路径: %s)' % (src, os.path.join(SRC_DIR, src)))
        print('\n  这些引用已保留在产物 HTML 中（浏览器打开会 404 可见），')
        print('  但它们对应的代码**不会**进入 dist/app.js —— 其中的事件注册')
        print('  将全部失效，且构建过程不会察觉。')
        print('\n  处置：')
        print('    · 若文件应为其他名字 → 修正 src/index.html 的引用')
        print('    · 若文件被误删       → 从 git 历史恢复')
        print('    · 若引用应被删除     → 删掉该 <script> 标签')
        sys.exit(1)

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

    # ── 3D 外部资产（Kenney CC0 GLB）自托管 ────────────────────────────────
    # 为什么必须复制而不能内联：
    #   三套 Kenney kit 的 GLB 各自引用同名的 Textures/colormap.png，
    #   而三份 colormap 内容互不相同（见 src/assets/kenney/LICENSE.md）。
    #   GLTFLoader 按 GLB 内部记录的相对 URI 解析贴图，所以必须保持
    #   「每个 GLB 与它自己 kit 的 Textures/ 同目录」这一结构。
    #   基64内联会破坏这个相对关系，且 8.5MB 资产膨胀 33% 不可接受 —— 故选路线 B。
    # CSP 侧只需 connect-src 'self'（见 src/_headers），因为都是同源请求。
    src_assets = os.path.join(SRC_DIR, 'assets')
    dst_assets = os.path.join(DIST_DIR, 'assets')
    if os.path.isdir(src_assets):
        copied = 0
        import filecmp
        for root, dirs, files_list in os.walk(src_assets):
            for fname in files_list:
                src_file = os.path.join(root, fname)
                rel = os.path.relpath(src_file, src_assets)
                dst_file = os.path.join(dst_assets, rel)
                os.makedirs(os.path.dirname(dst_file), exist_ok=True)
                if not os.path.exists(dst_file) or not filecmp.cmp(src_file, dst_file, shallow=False):
                    shutil.copy2(src_file, dst_file)
                    copied += 1
        total = sum(len(f) for _, _, f in os.walk(dst_assets))
        print(f"  📦 3D assets: {total} 个文件（本次新增/更新 {copied}）")

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
    #
    # ★ newline='\n' 不可省略：Python 文本模式默认做平台换行转换，
    #   在 Windows 上会把 \n 写成 \r\n，而 Linux CI 上仍是 \n。
    #   结果是同一个 src/ 在不同平台产出**不同字节**的 dist/——
    #   本地 216554 字节（2534 个 CRLF）对线上 214020 字节（2534 个 LF），
    #   内容逐字相同、仅行尾不同（用 diff --strip-trailing-cr 验证为 0 差异）。
    #   这会污染提交历史：任何 Windows 侧跑完 build 后 dist/ 都显示为已修改。
    #   显式指定 newline 后，产物跨平台逐字节一致。
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='\n') as f:
        f.write(html)

    # 写入外部 JS bundle（app.js）—— newline 理由同上
    app_js_path = os.path.join(DIST_DIR, 'app.js')
    with open(app_js_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(bundle_code)
    raw_kb = os.path.getsize(app_js_path) / 1024

    # P2-2: esbuild 压缩已禁用 — 源文件有重复 function 声明与 esbuild 的 use strict 不兼容
    # 待修复所有重复声明后重新启用：npx esbuild app.js --minify --outfile=app.js

    html_kb = os.path.getsize(OUTPUT_FILE) / 1024
    app_kb = os.path.getsize(app_js_path) / 1024
    print(f'Build complete: {OUTPUT_FILE} ({html_kb:.1f} KB) + app.js ({app_kb:.1f} KB)')

if __name__ == '__main__':
    main()

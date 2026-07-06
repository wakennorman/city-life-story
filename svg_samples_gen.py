#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""试做 5 张 SVG 样例图，让用户看风格。"""
import os

SAMPLES_DIR = r"D:\Claude Code+DeepSeekV4\svg_samples"
os.makedirs(SAMPLES_DIR, exist_ok=True)

# 通用样式：暗红主色（呼应「选岗参谋」的视觉），米色底
BG = "#f4eee2"
INK = "#2b2b2b"
RED = "#a93226"
GOLD = "#b58a3c"

def svg(content, w=400, h=400, word="", root=""):
    """SVG 模板。底部带词形 + 词根注释。"""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <rect width="{w}" height="{h}" fill="{BG}"/>
  <g>{content}</g>
  <text x="{w/2}" y="{h-28}" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="{INK}" font-weight="bold">{word}</text>
  <text x="{w/2}" y="{h-10}" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="{RED}" font-style="italic">{root}</text>
</svg>'''

samples = {}

# act：人 + 动作线（举手起跑姿势）
samples["act"] = svg(f'''
  <circle cx="200" cy="120" r="22" fill="{INK}"/>
  <line x1="200" y1="142" x2="200" y2="230" stroke="{INK}" stroke-width="6"/>
  <line x1="200" y1="180" x2="155" y2="140" stroke="{INK}" stroke-width="6"/>
  <line x1="200" y1="180" x2="245" y2="155" stroke="{INK}" stroke-width="6"/>
  <line x1="200" y1="230" x2="170" y2="290" stroke="{INK}" stroke-width="6"/>
  <line x1="200" y1="230" x2="240" y2="295" stroke="{INK}" stroke-width="6"/>
  <path d="M260 130 q15 0 15 15" stroke="{RED}" stroke-width="3" fill="none"/>
  <path d="M275 145 l-5 -10 l15 5" fill="{RED}"/>
  <path d="M280 165 q15 0 15 15" stroke="{RED}" stroke-width="2" fill="none" opacity="0.6"/>
''', word="act", root="ACT  do")

# react：act + 反向箭头（前缀 re- 表"回"）
samples["react"] = svg(f'''
  <circle cx="200" cy="120" r="22" fill="{INK}"/>
  <line x1="200" y1="142" x2="200" y2="230" stroke="{INK}" stroke-width="6"/>
  <line x1="200" y1="180" x2="155" y2="160" stroke="{INK}" stroke-width="6"/>
  <line x1="200" y1="180" x2="245" y2="200" stroke="{INK}" stroke-width="6"/>
  <line x1="200" y1="230" x2="170" y2="290" stroke="{INK}" stroke-width="6"/>
  <line x1="200" y1="230" x2="240" y2="295" stroke="{INK}" stroke-width="6"/>
  <!-- 入射箭头（红） -->
  <path d="M60 120 L130 120" stroke="{RED}" stroke-width="4" fill="none"/>
  <path d="M130 120 L120 113 L120 127 Z" fill="{RED}"/>
  <!-- 反射箭头（金） -->
  <path d="M270 120 L340 120" stroke="{GOLD}" stroke-width="4" fill="none"/>
  <path d="M270 120 L280 113 L280 127 Z" fill="{GOLD}"/>
''', word="react", root="re-  back")

# dict：嘴 + 话泡（说）
samples["dict"] = svg(f'''
  <ellipse cx="200" cy="200" rx="55" ry="35" fill="none" stroke="{INK}" stroke-width="4"/>
  <line x1="160" y1="200" x2="240" y2="200" stroke="{INK}" stroke-width="3"/>
  <path d="M260 180 L320 150 L310 180 L335 170 L320 200 L290 220 Z"
        fill="none" stroke="{RED}" stroke-width="3"/>
  <text x="305" y="190" font-family="serif" font-size="20" fill="{RED}">!</text>
''', word="dict", root="DICT  say")

# fluctuate：波浪线 + 上下箭头
samples["fluctuate"] = svg(f'''
  <path d="M50 200 Q100 130 150 200 T250 200 T350 200" stroke="{INK}" stroke-width="5" fill="none"/>
  <path d="M75 160 L75 130 L65 145 M75 130 L85 145" stroke="{RED}" stroke-width="3" fill="none"/>
  <path d="M175 240 L175 270 L165 255 M175 270 L185 255" stroke="{RED}" stroke-width="3" fill="none"/>
  <path d="M275 160 L275 130 L265 145 M275 130 L285 145" stroke="{RED}" stroke-width="3" fill="none"/>
''', word="fluctuate", root="FLU  flow")

# exclude：圆圈 + 一个人在圈外 + 箭头推开
samples["exclude"] = svg(f'''
  <circle cx="170" cy="200" r="70" fill="none" stroke="{INK}" stroke-width="4"/>
  <circle cx="170" cy="200" r="5" fill="{INK}"/>
  <circle cx="170" cy="200" r="40" fill="none" stroke="{INK}" stroke-width="2" opacity="0.4"/>
  <!-- 圈外小人 -->
  <circle cx="305" cy="180" r="12" fill="{INK}"/>
  <line x1="305" y1="192" x2="305" y2="230" stroke="{INK}" stroke-width="4"/>
  <line x1="305" y1="205" x2="285" y2="220" stroke="{INK}" stroke-width="4"/>
  <line x1="305" y1="205" x2="325" y2="220" stroke="{INK}" stroke-width="4"/>
  <!-- 推开的箭头 -->
  <path d="M250 200 L290 200" stroke="{RED}" stroke-width="4" fill="none"/>
  <path d="M290 200 L280 193 L280 207 Z" fill="{RED}"/>
''', word="exclude", root="ex-  out  +  CLUD  close")

for word, content in samples.items():
    path = os.path.join(SAMPLES_DIR, f"{word}.svg")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"写：{path}")

print(f"\n共 {len(samples)} 个样例")
print(f"目录：{SAMPLES_DIR}")
print("你打开看看（浏览器/Anki 都能渲染 SVG）")

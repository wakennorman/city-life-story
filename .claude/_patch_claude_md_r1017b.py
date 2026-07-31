# -*- coding: utf-8 -*-
# R1017b: 将 CLAUDE.md 中 R1017b 迭代行的 A类4项 补正为 A类7项（新增 A5-A7 全站型导出裸引用修复）
import io

PATH = r"D:\Claude Code+DeepSeekV4\city-life-story\CLAUDE.md"

with open(PATH, "rb") as f:
    raw = f.read()

text = raw.decode("utf-8")

old_marker = "A类4项：①corp_ops.js:477/479"
new_marker = "A类7项：①corp_ops.js:477/479"
assert text.count(old_marker) == 1, "marker count != 1: %d" % text.count(old_marker)
text = text.replace(old_marker, new_marker)

anchor = "→endQuarter按专长差异化季度结算（每种专长每季度只结一次）"
addition = (
    "；⑤【全站级·跨域】career_dev.js:5488 `window.getSkillHealthBonus=getSkillHealthBonus`"
    "引用全库不存在的函数，顶层求值抛ReferenceError直接吃掉该文件之后1172行代码与16个window导出"
    "（showCareerNavModal/showLocationNavModal/switchCareerSubTab/enhancedApplyCareerJob/clampCareerCapital等）"
    "→typeof守卫（同文件getSkillMarketPricingInsight同型一并守卫）；"
    "⑥festivals.js:1395 getFestivalWorkMod同型裸引用→typeof守卫；"
    "⑦actions.js:342 getAvailableActions导出误位（真实定义在main.js:2501，加载序在后致ReferenceError且该函数从未真正挂上window）"
    "→actions.js加守卫+main.js导出块补真实导出。⑤⑥⑦由MC harness `[HEADLESS] LOAD ERROR`暴露，加载错误3→0，"
    "审计脚本沉淀 .claude/_export_audit_r1017b.cjs（全库扫 window.X=X 中本文件未定义的裸引用），建议纳入开轮例行体检"
)
assert text.count(anchor) == 1, "anchor count != 1: %d" % text.count(anchor)
text = text.replace(anchor, anchor + addition)

with open(PATH, "wb") as f:
    f.write(text.encode("utf-8"))

print("CLAUDE.md patched OK, total chars:", len(text))

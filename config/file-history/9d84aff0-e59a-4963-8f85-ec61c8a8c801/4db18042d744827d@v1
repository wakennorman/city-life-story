/**
 * 新手引导系统
 *
 * 首次进入游戏时弹出逐步教程，引导玩家了解基本 UI 和操作。
 * 用 localStorage 标记已完成引导，不会再次出现。
 * 可随时在帮助菜单中重新触发。
 */

const TUTORIAL_KEY = "city_life_tutorial_done";

/** 检查教程是否已完成 */
function isTutorialDone() {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === "1";
  } catch (e) {
    return false;
  }
}

/** 标记教程完成 */
function markTutorialDone() {
  try {
    localStorage.setItem(TUTORIAL_KEY, "1");
  } catch (e) {
    /* 静默 */
  }
}

/** 重置教程（允许重新触发） */
function resetTutorial() {
  try {
    localStorage.removeItem(TUTORIAL_KEY);
  } catch (e) {
    /* 静默 */
  }
}

/**
 * 启动新手引导
 * 在 startNewGame() 之后调用。
 */
function startTutorial() {
  if (isTutorialDone()) return;

  const steps = [
    {
      title: "🏙️ 欢迎来到城市浮生记！",
      body: `
        <p>你带着仅有的 <strong style="color:var(--accent);">¥2,000</strong> 来到这座城市，
        还欠村长 <strong style="color:var(--danger);">¥5,500</strong>（日息0.3%）。</p>
        <p>目标：<strong>活下去，活出个人样来！</strong></p>
        <p style="color:var(--text-secondary);font-size:11px;">🗑️ 废品回收 → 🛒 进货倒卖 → 💼 应聘职场 → 🏆 P10合伙人</p>
        <p style="color:var(--success);">接下来用30秒带你快速上手 ⬇️</p>
      `,
      highlight: null,
    },
    {
      title: "📊 左侧是你的状态面板",
      body: `
        <p><strong>4维属性</strong>：体质、智力、敏捷、心智 — 影响工作和学习效率</p>
        <p><strong>4项需求</strong>：饥饱、疲劳、卫生、心情 — 低于30会触发危险提示</p>
        <p style="color:var(--text-secondary);font-size:11px;">💡 属性靠技能和工作提升，需求靠吃饭/休息/洗澡维持</p>
      `,
      highlight: "#sidebar",
    },
    {
      title: "🏘️ 你在城中村，这是你的起点",
      body: `
        <p>每个地点有不同的 <strong>工作机会</strong> 和 <strong>商品价格</strong></p>
        <p>点击行动卡片上的 <strong>"前往 XX"</strong> 可移动到其他地点</p>
        <p style="color:var(--text-secondary);font-size:11px;">💡 可到达的地点也列在左侧栏「附近可前往」中</p>
      `,
      highlight: "#content-area",
    },
    {
      title: "🗑️ 试试第一次赚钱",
      body: `
        <p>点击下方的 <strong>"废品回收"</strong> 行动卡片开始工作</p>
        <p>每次行动消耗行动力（AP），耗尽后结束一天</p>
        <p style="color:var(--text-secondary);font-size:11px;">💡 前15天废品回收有新人加成+¥5</p>
      `,
      highlight: "#content-area",
    },
    {
      title: "🍚 吃饱了才有力气干活",
      body: `
        <p>赚到钱后点 <strong>"吃顿饭"</strong> 补充饥饱</p>
        <p style="color:var(--success);font-size:11px;">💡 新人福利：前10天吃饭只要¥5（平时¥10）</p>
        <p style="color:var(--text-secondary);font-size:11px;">每天结束会自动扣房租、算利息、更新天气</p>
      `,
      highlight: "#content-area",
    },
    {
      title: "🗺️ 查看地图探索城市",
      body: `
        <p>点击顶部 <strong>"🗺️ 地图"</strong> 标签查看城市全景</p>
        <p>地图显示所有地点、旅行路线和当前所在位置</p>
        <p style="color:var(--accent);font-size:11px;">💡 最快赚钱路线：批发市场进货 → 商业区卖出赚差价！</p>
      `,
      highlight: "#tab-bar",
    },
    {
      title: "🎯 你准备好了！",
      body: `
        <p><strong>生存路线</strong>：废品回收 → 本钱够了去批发市场进货 → 商业区摆摊</p>
        <p><strong>进阶路线</strong>：提升智力到45+ → 去科技园应聘 → 职场P5→P10</p>
        <p><strong>关键地点</strong>：</p>
        <ul style="font-size:11px;color:var(--text-secondary);margin-left:16px;">
          <li>🏘️ 城中村 — 租房子升级住所</li>
          <li>📦 批发市场 — 低价进货 + 租仓库</li>
          <li>🏪 商业区 — 高价卖出 + 多种工作</li>
          <li>🏥 医院 — 看病治疗伤病</li>
          <li>📚 培训中心 — 学习技能考证书</li>
          <li>💻 科技园 — 应聘进入职场</li>
        </ul>
        <p style="color:var(--success);">祝你在这座城市混出名堂！🏆</p>
      `,
      highlight: null,
    },
  ];

  showTutorialStep(steps, 0);
}

/** 逐步展示引导 */
function showTutorialStep(steps, index) {
  if (index >= steps.length) {
    // 全部完成
    cleanupHighlight();
    markTutorialDone();
    StateManager.addMessage(
      "✅ 新手引导完成！点击 ❓ 帮助按钮可随时回顾。",
      "success",
    );
    return;
  }

  const step = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  // 高亮目标区域
  if (step.highlight) {
    highlightElement(step.highlight);
  } else {
    cleanupHighlight();
  }

  const buttons = [
    {
      text: isFirst ? "跳过引导" : "← 上一步",
      cls: isFirst ? "" : "",
      callback: () => {
        if (isFirst) {
          cleanupHighlight();
          markTutorialDone();
          StateManager.addMessage(
            "💡 可以随时点击 ❓ 帮助按钮查看游戏指南。",
            "info",
          );
        } else {
          showTutorialStep(steps, index - 1);
        }
      },
    },
    {
      text: isLast ? "🎯 开始游戏！" : "下一步 →",
      cls: "btn-primary",
      callback: () => {
        showTutorialStep(steps, index + 1);
      },
    },
  ];

  showModal({
    title: `${index + 1}/${steps.length} ${step.title}`,
    body: step.body,
    buttons,
  });

  // 为引导弹窗添加特殊样式
  setTimeout(() => {
    const overlay = document.querySelector(".modal-overlay");
    if (overlay) {
      overlay.classList.add("tutorial-overlay");
      const box = overlay.querySelector(".modal-box");
      if (box) box.classList.add("tutorial-box");
    }
  }, 10);
}

/** 高亮页面元素 */
function highlightElement(selector) {
  cleanupHighlight();
  const el = document.querySelector(selector);
  if (!el) return;

  const hl = document.createElement("div");
  hl.className = "tutorial-highlight";
  hl.id = "tutorial-highlight";

  const rect = el.getBoundingClientRect();
  hl.style.cssText = `
    position: fixed;
    top: ${rect.top - 6}px;
    left: ${rect.left - 6}px;
    width: ${rect.width + 12}px;
    height: ${rect.height + 12}px;
    border: 3px solid var(--accent);
    border-radius: 10px;
    pointer-events: none;
    z-index: 999;
    box-shadow: 0 0 25px rgba(102,126,234,0.5), inset 0 0 25px rgba(102,126,234,0.08);
    animation: tutorial-pulse 1.5s ease-in-out infinite;
  `;
  document.body.appendChild(hl);
}

/** 清除高亮 */
function cleanupHighlight() {
  const existing = document.getElementById("tutorial-highlight");
  if (existing) existing.remove();
  // 同时清除其他可能的残留
  document.querySelectorAll(".tutorial-highlight").forEach((e) => e.remove());
}

// 全局挂载
if (typeof window !== "undefined") {
  Object.assign(window, {
    startTutorial,
    isTutorialDone,
    markTutorialDone,
    resetTutorial,
    showTutorialStep,
    highlightElement,
    cleanupHighlight,
    TUTORIAL_KEY,
  });
}

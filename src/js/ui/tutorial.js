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
 *
 * v3.0 重写：
 * - 引导步骤可绑定 waitForClick 目标（CSS 选择器）
 * - 玩家必须点击高亮元素才推进下一步（不再点哪都行）
 * - tutorial overlay 不允许点击空白关闭（在 modal.js 中处理）
 * - 完成或跳过都强制 cleanupHighlight，避免高亮框残留闪烁
 * - 第一次玩才显示（localStorage TUTORIAL_KEY 检查，清除浏览器算第一次）
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
        <p style="color:var(--success);">点「开始引导」进入下一步 ⬇️</p>
      `,
      highlight: null,
      waitForClick: null,
    },
    {
      title: "📊 左侧是你的状态面板",
      body: `
        <p><strong>4维属性</strong>：体质、智力、敏捷、心智 — 影响工作和学习效率</p>
        <p><strong>4项需求</strong>：饥饱、疲劳、卫生、心情 — 低于30会触发危险提示</p>
        <p style="color:var(--success);font-size:12px;">👉 请点击左侧 <strong>状态面板</strong> 任意位置继续</p>
      `,
      highlight: "#sidebar",
      waitForClick: "#sidebar",
    },
    {
      title: "🏘️ 你在城中村，这是你的起点",
      body: `
        <p>每个地点有不同的 <strong>工作机会</strong> 和 <strong>商品价格</strong></p>
        <p>点击行动卡片上的 <strong>"前往 XX"</strong> 可移动到其他地点</p>
        <p style="color:var(--success);font-size:12px;">👉 请点击下方 <strong>行动区</strong> 任意位置继续</p>
      `,
      highlight: "#content-area",
      waitForClick: "#content-area",
    },
    {
      title: "🗑️ 试试第一次赚钱",
      body: `
        <p>点击下方的 <strong>"废品回收"</strong> 行动卡片开始工作</p>
        <p>每次行动消耗行动力（AP），耗尽后结束一天</p>
        <p style="color:var(--success);font-size:12px;">👉 请点击 <strong>废品回收</strong> 行动卡片（高亮处）继续</p>
        <p style="color:var(--text-secondary);font-size:11px;">💡 前15天废品回收有新人加成+¥5</p>
      `,
      highlight: '[data-action-id="waste_recycling"]',
      waitForClick: '[data-action-id="waste_recycling"]',
      hint: "找不到？废品回收是街头的入门工作，应该在行动卡片列表里。",
    },
    {
      title: "🍚 吃饱了才有力气干活",
      body: `
        <p>赚到钱后点 <strong>"吃顿饭"</strong> 补充饥饱</p>
        <p style="color:var(--success);font-size:11px;">💡 新人福利：前10天吃饭只要¥5（平时¥10）</p>
        <p style="color:var(--success);font-size:12px;">👉 请点击 <strong>吃顿饭</strong> 行动卡片继续</p>
        <p style="color:var(--text-secondary);font-size:11px;">每天结束会自动扣房租、算利息、更新天气</p>
      `,
      highlight: '[data-action-id="eat"]',
      waitForClick: '[data-action-id="eat"]',
      hint: "吃顿饭通常和废品回收一样在行动卡片列表里。",
    },
    {
      title: "🗺️ 查看地图探索城市",
      body: `
        <p>点击顶部 <strong>"🗺️ 地图"</strong> 标签查看城市全景</p>
        <p>地图显示所有地点、旅行路线和当前所在位置</p>
        <p style="color:var(--accent);font-size:11px;">💡 最快赚钱路线：批发市场进货 → 商业区卖出赚差价！</p>
        <p style="color:var(--success);font-size:12px;">👉 请点击顶部 <strong>🗺️ 地图</strong> 标签按钮继续</p>
      `,
      highlight: '[data-tab="map"]',
      waitForClick: '[data-tab="map"]',
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
          <li>🛕 寺庙 — 祈福/冥想/求签（v3.0新增）</li>
        </ul>
        <p style="color:var(--success);">祝你在这座城市混出名堂！🏆</p>
      `,
      highlight: null,
      waitForClick: null,
    },
  ];

  showTutorialStep(steps, 0);
}

/** 逐步展示引导 — v3.0 重写支持 waitForClick 模式 */
function showTutorialStep(steps, index) {
  // 任何步骤切换前都先清理高亮，避免残留
  cleanupHighlight();
  // 同时清理旧的 waitForClick 监听
  _clearWaitForClickListeners();

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
  _currentTutorialSteps = steps;
  _currentTutorialIndex = index;

  // 高亮目标区域
  if (step.highlight) {
    highlightElement(step.highlight);
  }

  // 决定按钮：如果 step.waitForClick 存在，不显示"下一步"按钮
  // 改为在目标元素上挂监听，点击后推进
  const buttons = [];
  if (isFirst) {
    buttons.push({
      text: "跳过引导",
      cls: "",
      callback: () => {
        _confirmSkip(steps);
      },
    });
    buttons.push({
      text: "开始引导 →",
      cls: "btn-primary",
      callback: () => {
        // 第一步无 waitForClick，直接推进
        showTutorialStep(steps, index + 1);
      },
    });
  } else if (isLast) {
    buttons.push({
      text: "🎯 开始游戏！",
      cls: "btn-primary",
      callback: () => {
        cleanupHighlight();
        markTutorialDone();
        StateManager.addMessage(
          "✅ 新手引导完成！点击 ❓ 帮助按钮可随时回顾。",
          "success",
        );
      },
    });
  } else if (step.waitForClick) {
    // 中间步骤且需要点击目标：不显示"下一步"按钮
    // 只显示"返回上一步"和"跳过引导"
    buttons.push({
      text: "← 上一步",
      cls: "",
      callback: () => {
        showTutorialStep(steps, index - 1);
      },
    });
    buttons.push({
      text: "跳过引导",
      cls: "",
      callback: () => {
        _confirmSkip(steps);
      },
    });
  } else {
    // 中间步骤但不需点击目标：保留"下一步"按钮
    buttons.push({
      text: "← 上一步",
      cls: "",
      callback: () => {
        showTutorialStep(steps, index - 1);
      },
    });
    buttons.push({
      text: "下一步 →",
      cls: "btn-primary",
      callback: () => {
        showTutorialStep(steps, index + 1);
      },
    });
  }

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

  // 如果该步骤需要等玩家点击目标，挂监听
  if (step.waitForClick) {
    _attachWaitForClick(step.waitForClick, steps, index, step.hint);
  }
}

/** v3.0 新增：等待玩家点击目标元素才推进 */
var _currentTutorialSteps = null;
var _currentTutorialIndex = 0;
var _waitForClickListeners = []; // 记录所有监听以便清理

function _attachWaitForClick(selector, steps, index, hint) {
  // 等待 DOM 渲染完成（renderAll 是同步的，但保险起见用 setTimeout）
  setTimeout(() => {
    const targets = document.querySelectorAll(selector);
    if (targets.length === 0) {
      // 目标不在 DOM 中（例如行动卡片还没渲染），5 秒后重试一次
      console.warn("[tutorial] 目标未找到:", selector, "5 秒后重试");
      setTimeout(() => _attachWaitForClick(selector, steps, index, hint), 5000);
      return;
    }
    targets.forEach((target) => {
      const handler = function (e) {
        // 阻止冒泡，避免触发原 handler 之前先推进引导
        // 实际上我们让原 handler 继续执行，引导推进是异步的
        e.stopPropagation();
        // 移除所有监听
        _clearWaitForClickListeners();
        cleanupHighlight();
        // 关闭当前 tutorial modal（如果有）
        const overlay = document.querySelector(".tutorial-overlay");
        if (overlay) {
          try {
            overlay.parentNode.removeChild(overlay);
          } catch (err) {}
        }
        // 推进下一步
        setTimeout(() => {
          showTutorialStep(steps, index + 1);
        }, 100);
      };
      // 使用 capture 阶段，确保在原 handler 之前捕获
      target.addEventListener("click", handler, { capture: true, once: true });
      _waitForClickListeners.push({ target, handler });
    });
  }, 100);
}

function _clearWaitForClickListeners() {
  _waitForClickListeners.forEach(({ target, handler }) => {
    try {
      target.removeEventListener("click", handler, { capture: true });
    } catch (e) {}
  });
  _waitForClickListeners = [];
}

/** v3.0 新增：跳过引导二次确认 */
function _confirmSkip(steps) {
  showModal({
    title: "确定跳过引导？",
    body: `
      <p>跳过后将不再自动出现新手引导。</p>
      <p style="color:var(--text-secondary);font-size:12px;">💡 你可以随时点击右上角 <strong>❓ 帮助</strong> 按钮回顾。</p>
    `,
    buttons: [
      {
        text: "继续引导",
        cls: "btn-primary",
        callback: () => {
          // 重新显示当前步骤
          if (_currentTutorialSteps) {
            showTutorialStep(_currentTutorialSteps, _currentTutorialIndex);
          }
        },
      },
      {
        text: "确认跳过",
        cls: "",
        callback: () => {
          cleanupHighlight();
          _clearWaitForClickListeners();
          markTutorialDone();
          StateManager.addMessage(
            "💡 已跳过新手引导。点击 ❓ 帮助按钮可随时查看。",
            "info",
          );
        },
      },
    ],
  });
}

/** 高亮页面元素 — v3.0 增强：让高亮框本身可点击穿透 */
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

  // 监听窗口大小变化，重新定位高亮框
  if (!window._tutorialResizeHandler) {
    window._tutorialResizeHandler = () => {
      const cur = document.getElementById("tutorial-highlight");
      if (cur) {
        const targetEl = document.querySelector(selector);
        if (targetEl) {
          const r = targetEl.getBoundingClientRect();
          cur.style.top = r.top - 6 + "px";
          cur.style.left = r.left - 6 + "px";
          cur.style.width = r.width + 12 + "px";
          cur.style.height = r.height + 12 + "px";
        }
      }
    };
    window.addEventListener("resize", window._tutorialResizeHandler);
  }
}

/** 清除高亮 — v3.0 增强：同时移除 resize 监听 */
function cleanupHighlight() {
  const existing = document.getElementById("tutorial-highlight");
  if (existing) existing.remove();
  // 同时清除其他可能的残留
  document.querySelectorAll(".tutorial-highlight").forEach((e) => e.remove());
  // 清理 resize 监听
  if (window._tutorialResizeHandler) {
    window.removeEventListener("resize", window._tutorialResizeHandler);
    window._tutorialResizeHandler = null;
  }
}

// ====== 动态教程提示系统 ======
/**
 * 基于游戏状态触发的一次性情境提示。
 * 存储于 state.flags._hint_<id>，每条只触发一次。
 * 参考《Stardew Valley》的新手引导理念：在玩家自然遇到问题时给出实用建议。
 */

var DYNAMIC_HINTS = [
  // ===== 早期生存提示 =====
  {
    id: "first_hundred",
    trigger: function (st) {
      return (st.resources.cash || 0) >= 100 && !st.flags._hint_first_hundred;
    },
    message:
      "💡 提示：攒到100元了！建议去🏦银行存钱，存款有利息，还能抵御突发支出。",
  },
  {
    id: "first_low_cash",
    trigger: function (st) {
      return (
        (st.resources.cash || 0) < 80 &&
        st.player.day > 5 &&
        !st.flags._hint_first_low_cash
      );
    },
    message:
      "💡 提示：现金不多了！废品回收是最稳定的收入，城中村和工厂区都能做，不挑天气。",
  },
  {
    id: "first_earn_500",
    trigger: function (st) {
      return (
        (st.resources.totalEarned || 0) >= 500 && !st.flags._hint_first_earn_500
      );
    },
    message: "🎉 恭喜你！总收入突破500元！你已经找到了赚钱的门路，继续加油！",
  },
  {
    id: "first_earn_1000",
    trigger: function (st) {
      return (
        (st.resources.totalEarned || 0) >= 1000 &&
        !st.flags._hint_first_earn_1000
      );
    },
    message: "🎉 里程碑！总收入突破1000元！你在这座城市站稳了脚跟。",
  },
  {
    id: "first_injury",
    trigger: function (st) {
      return st.status && st.status.health < 70 && !st.flags._hint_first_injury;
    },
    message:
      "💡 提示：健康在下降！去🏥医院看病，也可以考虑买意外保险，防止突发大额医疗支出。",
  },
  {
    id: "first_sick",
    trigger: function (st) {
      return st.status && st.status.illness && !st.flags._hint_first_sick;
    },
    message:
      "🤒 你生病了！生病期间工作效率会降低，快去🏥医院治疗，或者在家休息几天。",
  },
  {
    id: "first_fatigue_high",
    trigger: function (st) {
      return (
        st.needs && st.needs.fatigue >= 75 && !st.flags._hint_first_fatigue_high
      );
    },
    message:
      "💡 提示：疲劳过高！工作效率会降低。升级住所能加快每晚恢复速度，花¥500就能搬到单间。",
  },
  {
    id: "first_happy_low",
    trigger: function (st) {
      return (
        st.needs &&
        st.needs.happiness < 25 &&
        st.player.day > 3 &&
        !st.flags._hint_first_happy_low
      );
    },
    message:
      "💡 提示：心情低落！去公园散步、找NPC聊天，或者喝杯奶茶都能改善心情，心情好干活效率更高。",
  },
  {
    id: "first_hungry",
    trigger: function (st) {
      return st.needs && st.needs.hunger < 30 && !st.flags._hint_first_hungry;
    },
    message: "🍚 肚子饿了！去吃点东西吧，不吃饭会影响健康和工作效率。",
  },
  {
    id: "day10_tip",
    trigger: function (st) {
      return st.player.day >= 10 && !st.flags._hint_day10_tip;
    },
    message:
      "💡 提示：第10天了！如果手头有¥500，可以在城中村租个单间，改善睡眠质量，每晚多恢复疲劳。",
  },
  {
    id: "first_repay_ready",
    trigger: function (st) {
      var debt = st.resources.villageDebt || 0;
      return (
        debt > 0 &&
        (st.resources.cash || 0) >= debt &&
        !st.flags._hint_first_repay_ready
      );
    },
    message:
      "💡 提示：现金够还村长的债了！日息0.3%每天都在涨，尽快还清能省不少利息。",
  },
  {
    id: "first_debt_paid",
    trigger: function (st) {
      return (
        !st.resources.villageDebt &&
        !st.resources.debt &&
        (st.resources.totalEarned || 0) >= 5500 &&
        !st.flags._hint_first_debt_paid
      );
    },
    message: "🎉 无债一身轻！你还清了所有债务，终于可以自由地为自己赚钱了！",
  },

  // ===== 中期发展提示 =====
  {
    id: "first_5000",
    trigger: function (st) {
      return (
        (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 5000 &&
        !st.flags._hint_first_5000
      );
    },
    message:
      "💡 提示：资产超5000元！可以去🎓培训中心学技能考证书，智力≥45后还能去科技园应聘职场。",
  },
  {
    id: "first_trade_tip",
    trigger: function (st) {
      return (
        st.trade &&
        (st.trade.totalProfit || 0) >= 200 &&
        !st.flags._hint_first_trade_tip
      );
    },
    message:
      "💡 提示：交易赚了200元！去📦批发市场可以租仓库增加库存量，更多商品→更大利润空间。",
  },
  {
    id: "first_trade_profit_1000",
    trigger: function (st) {
      return (
        st.trade &&
        (st.trade.totalProfit || 0) >= 1000 &&
        !st.flags._hint_first_trade_profit_1000
      );
    },
    message: "💰 交易大师！你的累计交易利润突破1000元！倒买倒卖是一门好生意。",
  },
  {
    id: "first_intel_tip",
    trigger: function (st) {
      return st.player.intelligence >= 35 && !st.flags._hint_first_intel_tip;
    },
    message:
      "💡 提示：智力达到35！培训中心的课程学得更快了，再提升到45就能应聘互联网职场。",
  },
  {
    id: "first_skill_30",
    trigger: function (st) {
      var skills = st.skills || {};
      var reached30 = false;
      for (var k in skills) {
        if (skills[k] && skills[k].level >= 30) {
          reached30 = true;
          break;
        }
      }
      return reached30 && !st.flags._hint_first_skill_30;
    },
    message:
      "🎓 技能突破！某项技能达到30级！可以去培训中心选择专业发展方向，解锁更强力的天赋。",
  },
  {
    id: "first_npc_tip",
    trigger: function (st) {
      var rels = st.relationships || {};
      var met = Object.values(rels).filter(function (r) {
        return r && r.met;
      }).length;
      return met >= 1 && !st.flags._hint_first_npc_tip;
    },
    message:
      "💡 提示：认识了NPC！多送礼提升好感度，好感度高的NPC会提供特殊帮助和奖励。",
  },
  {
    id: "first_npc_50_affinity",
    trigger: function (st) {
      var rels = st.relationships || {};
      var high = Object.values(rels).filter(function (r) {
        return r && r.affinity >= 50;
      }).length;
      return high >= 1 && !st.flags._hint_first_npc_50_affinity;
    },
    message: "❤️ 你和一个NPC建立了深厚关系！好感度50+会解锁特殊对话和任务。",
  },
  {
    id: "first_skill_cert",
    trigger: function (st) {
      var certs = st.certs || {};
      var hasCert = false;
      for (var c in certs) {
        if (certs[c]) {
          hasCert = true;
          break;
        }
      }
      return hasCert && !st.flags._hint_first_skill_cert;
    },
    message: "📜 你考到了第一张证书！证书能提升求职竞争力和收入。",
  },
  {
    id: "day30_dream_tip",
    trigger: function (st) {
      return (
        st.player.day >= 30 &&
        !st.flags._dreamId &&
        !st.flags._hint_day30_dream_tip
      );
    },
    message:
      "💡 提示：在城市打拼一个月了！去公园或城中村可以「确立人生目标」，设定梦想让努力更有方向感。",
  },

  // ===== 职场阶段提示 =====
  {
    id: "corporate_ready_tip",
    trigger: function (st) {
      return (
        st.player.day >= 60 &&
        st.player.intelligence >= 40 &&
        st.player.phase === "street" &&
        !st.flags._hint_corporate_ready_tip
      );
    },
    message:
      "🏢 智力已达40，在城市打拼60天了！你已具备进入互联网职场的条件。去培训中心可以申请入职，开始新的人生阶段。",
  },
  {
    id: "first_corp_day",
    trigger: function (st) {
      return (
        st.player.phase === "corporate" &&
        st.player.day >= 1 &&
        !st.flags._hint_first_corp_day
      );
    },
    message:
      "🎉 欢迎来到互联网大厂！从今往后，你的战场从街头转移到了写字楼。KPI、加班、晋升——准备好了吗？",
  },
  {
    id: "first_corp_kpi_a",
    trigger: function (st) {
      return (
        st.corporate &&
        st.corporate.lastPerfRating === "A" &&
        !st.flags._hint_first_corp_kpi_a
      );
    },
    message: "🌟 第一次拿到A绩效！老板对你刮目相看，晋升之路打开了。",
  },
  {
    id: "first_corp_promo",
    trigger: function (st) {
      return (
        st.corporate &&
        st.corporate.rank === "P6" &&
        !st.flags._hint_first_corp_promo
      );
    },
    message: "🎉 恭喜晋升P6！你不再是新人了，开始承担更多责任吧。",
  },
  {
    id: "first_corp_promo_p7",
    trigger: function (st) {
      return (
        st.corporate &&
        st.corporate.rank === "P7" &&
        !st.flags._hint_first_corp_promo_p7
      );
    },
    message: "🏆 P7了！分水岭已过，你现在是团队骨干，开始带人、做项目了。",
  },
  {
    id: "first_corp_team",
    trigger: function (st) {
      return (
        st.corporate &&
        (st.corporate.teamSize || 0) >= 2 &&
        !st.flags._hint_first_corp_team
      );
    },
    message:
      "👥 你开始带团队了！管理是一门新学问：如何分配任务、激励下属、向上汇报。",
  },
  {
    id: "first_corp_stock",
    trigger: function (st) {
      return (
        st.investment &&
        st.investment.stockHoldings &&
        st.investment.stockHoldings.length > 0 &&
        !st.flags._hint_first_corp_stock
      );
    },
    message: "📈 你开始投资股票了！钱生钱的游戏开始了，但要注意风险。",
  },
  {
    id: "first_corp_overtime",
    trigger: function (st) {
      return (
        st.needs &&
        st.needs.fatigue >= 90 &&
        st.player.phase === "corporate" &&
        !st.flags._hint_first_corp_overtime
      );
    },
    message: "😴 疲劳爆表！你在公司拼得太狠了。记得：发量是革命的本钱。",
  },
  {
    id: "first_corp_dignity_low",
    trigger: function (st) {
      return (
        st.corporate &&
        st.corporate.dignity < 30 &&
        !st.flags._hint_first_corp_dignity_low
      );
    },
    message:
      "⚠️ 尊严告急！被PUA太多次了。去公园放松、找朋友倾诉，或者考虑跳槽。",
  },
  {
    id: "first_corp_risk_high",
    trigger: function (st) {
      return (
        st.corporate &&
        st.corporate.risk >= 50 &&
        !st.flags._hint_first_corp_risk_high
      );
    },
    message: "💣 风险值过高！你埋的雷快爆发了。建议排查风险，否则可能被开除。",
  },

  // ===== 节日与特殊事件 =====
  {
    id: "festival_job_tip",
    trigger: function (st) {
      return (
        typeof getCurrentFestival === "function" &&
        getCurrentFestival(st.player.day) !== null &&
        !st.flags._hint_festival_job_tip
      );
    },
    message:
      "🎉 节日来了！节日期间各地点会出现限定临时工作（收入比平时高），在行动页找找看！还有NPC会说节日专属的话。",
  },
  {
    id: "reputation_earned_tip",
    trigger: function (st) {
      return (
        typeof getHistoryModifiers === "function" &&
        getHistoryModifiers(st).reputationLabel !== null &&
        !st.flags._hint_reputation_earned_tip
      );
    },
    message:
      "🏅 你的道德选择已经积累成一种声誉！侧边栏会显示你的「声誉徽章」，正直的行为会带来持续的收入加成。",
  },
  {
    id: "investment_first_tip",
    trigger: function (st) {
      return (
        (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 20000 &&
        !(st.investment && (st.investment.stockHoldings || []).length > 0) &&
        !st.flags._hint_investment_first_tip
      );
    },
    message:
      "💰 你已经攒下2万块！是时候考虑投资了。行动页「投资中心」可以购买股票、比特币、贵金属，让钱为你打工！",
  },
  {
    id: "first_company_fate",
    trigger: function (st) {
      return (
        st.enterpriseFate &&
        st.enterpriseFate.fateEventHistory &&
        st.enterpriseFate.fateEventHistory.length > 0 &&
        !st.flags._hint_first_company_fate
      );
    },
    message:
      "🏭 公司命运事件发生了！你所在的公司正在经历变化，关注新闻，把握机会。",
  },
  {
    id: "first_insider_rumor",
    trigger: function (st) {
      return (
        st.insiderTrading &&
        st.insiderTrading.activeRumor &&
        !st.flags._hint_first_insider_rumor
      );
    },
    message:
      "👂 你听到了一条风声！某家公司可能有大事发生。去多渠道验证可信度，再决定是否投资。",
  },
  {
    id: "first_skill_tree",
    trigger: function (st) {
      return (
        st.skillBranches &&
        Object.keys(st.skillBranches).length > 0 &&
        !st.flags._hint_first_skill_tree
      );
    },
    message:
      "🌳 你选择了技能发展方向！天赋树系统已激活，激活天赋节点能获得永久加成。",
  },
];

/** 每日检查动态提示，触发后标记防重复 */
function checkDynamicHints(state) {
  for (var i = 0; i < DYNAMIC_HINTS.length; i++) {
    var hint = DYNAMIC_HINTS[i];
    try {
      if (hint.trigger(state)) {
        state.flags["_hint_" + hint.id] = true;
        StateManager.addMessage(hint.message, "hint");
      }
    } catch (e) {
      /* 防止单条hint出错影响全局 */
    }
  }
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
    DYNAMIC_HINTS,
    checkDynamicHints,
  });
}

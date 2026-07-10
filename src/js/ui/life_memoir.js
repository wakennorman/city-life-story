/**
 * 人生回忆录系统（v3.6 P1-4）
 *
 * 8类回忆录：童年/求学/初恋/职场/创业/家庭/疾病/旅行
 * localStorage.__lifeMemoirs存储
 * 每类最多10条回忆
 *
 * 设计参考：BitLife人生回顾 / This War of Mine记忆片段
 */

(function () {
  // ====== 回忆录类别定义 ======
  const MEMOIR_CATEGORIES = {
    childhood: {
      id: "childhood",
      name: "童年",
      icon: "🧸",
      color: "var(--warning)",
    },
    education: {
      id: "education",
      name: "求学",
      icon: "📚",
      color: "var(--primary)",
    },
    love: {
      id: "love",
      name: "初恋",
      icon: "💕",
      color: "#e91e63",
    },
    career: {
      id: "career",
      name: "职场",
      icon: "🏢",
      color: "var(--info)",
    },
    startup: {
      id: "startup",
      name: "创业",
      icon: "🚀",
      color: "var(--success)",
    },
    family: {
      id: "family",
      name: "家庭",
      icon: "👨‍👩‍👧",
      color: "#9c27b0",
    },
    illness: {
      id: "illness",
      name: "疾病",
      icon: "🏥",
      color: "var(--danger)",
    },
    travel: {
      id: "travel",
      name: "旅行",
      icon: "✈️",
      color: "#00bcd4",
    },
  };

  const MAX_MEMOIRS_PER_CATEGORY = 10;
  const STORAGE_KEY = "__lifeMemoirs";

  /**
   * 获取所有回忆录
   * @returns {Object} 回忆录数据
   */
  function getMemoirs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("读取回忆录失败:", e);
    }
    return {};
  }

  /**
   * 保存回忆录
   * @param {Object} memoirs - 回忆录数据
   */
  function saveMemoirs(memoirs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoirs));
    } catch (e) {
      console.error("保存回忆录失败:", e);
    }
  }

  /**
   * 添加回忆录
   * @param {string} category - 类别ID
   * @param {Object} memoir - 回忆录内容
   * @returns {boolean} 是否成功
   */
  function addMemoir(category, memoir) {
    const memoirs = getMemoirs();
    if (!memoirs[category]) {
      memoirs[category] = [];
    }

    // 检查是否超过上限
    if (memoirs[category].length >= MAX_MEMOIRS_PER_CATEGORY) {
      // 移除最早的
      memoirs[category].shift();
    }

    // 添加时间戳
    memoir.addedAt = Date.now();
    memoir.day =
      memoir.day ||
      (typeof StateManager !== "undefined"
        ? StateManager.getState().player.day
        : 0);

    memoirs[category].push(memoir);
    saveMemoirs(memoirs);
    return true;
  }

  /**
   * 获取某类别的回忆录
   * @param {string} category - 类别ID
   * @returns {Array} 回忆录列表
   */
  function getMemoirsByCategory(category) {
    const memoirs = getMemoirs();
    return memoirs[category] || [];
  }

  /**
   * 获取所有回忆录统计
   * @returns {Object} 统计信息
   */
  function getMemoirStats() {
    const memoirs = getMemoirs();
    const stats = {};
    let total = 0;
    for (let cat in MEMOIR_CATEGORIES) {
      const count = (memoirs[cat] || []).length;
      stats[cat] = count;
      total += count;
    }
    stats.total = total;
    return stats;
  }

  /**
   * 生成结局回忆录摘要
   * @param {Object} state - 游戏状态
   * @returns {string} 回忆录摘要
   */
  function generateEndingMemoir(state) {
    const stats = getMemoirStats();
    const day = state.player.day;
    const age = state.player.age;

    let summary = `📖 人生回忆录摘要\n`;
    summary += `─────────────────\n`;
    summary += `游戏天数：${day}天\n`;
    summary += `年龄：${age}岁\n`;
    summary += `记录片段：${stats.total}个\n\n`;

    for (let cat in MEMOIR_CATEGORIES) {
      const count = stats[cat];
      if (count > 0) {
        const icon = MEMOIR_CATEGORIES[cat].icon;
        const name = MEMOIR_CATEGORIES[cat].name;
        summary += `${icon} ${name}：${count}个片段\n`;
      }
    }

    return summary;
  }

  /**
   * 渲染回忆录查看弹窗
   * @param {Object} state - 游戏状态
   */
  function showMemoirModal(state) {
    if (typeof showModal !== "function") {
      console.warn("showModal未定义，无法打开回忆录弹窗");
      return;
    }

    const stats = getMemoirStats();
    const statsText = Object.entries(MEMOIR_CATEGORIES)
      .map(([cat, def]) => {
        const count = stats[cat] || 0;
        return `${def.icon} ${def.name}：${count}`;
      })
      .join(" · ");

    const content = document.createElement("div");
    content.innerHTML = `
      <div style="padding:12px;">
        <h4 style="margin-top:0;">📖 人生回忆录</h4>
        <p style="color:var(--text-muted);font-size:12px;">${statsText}</p>
        <div style="max-height:400px;overflow-y:auto;">
          ${Object.entries(MEMOIR_CATEGORIES)
            .map(([cat, def]) => {
              const memoirs = getMemoirsByCategory(cat);
              if (memoirs.length === 0) {
                return `<div style="padding:8px;color:var(--text-muted);font-size:12px;">${def.icon} ${def.name}：暂无记录</div>`;
              }
              return memoirs
                .slice(-5)
                .reverse()
                .map(
                  (m, i) => `
                  <div style="padding:8px;margin-bottom:4px;background:var(--bg-secondary);border-radius:4px;font-size:12px;">
                    <div style="color:${def.color};font-weight:bold;">${def.icon} ${m.title || "未命名"}</div>
                    <div style="color:var(--text-muted);">${m.content || m.desc || ""}</div>
                    <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">第${m.day || "?"}天</div>
                  </div>
                `,
                )
                .join("");
            })
            .join("")}
        </div>
      </div>
    `;

    showModal("人生回忆录", content, "large");
  }

  /**
   * 自动记录关键事件
   * @param {string} category - 类别
   * @param {string} title - 标题
   * @param {string} content - 内容
   */
  function autoRecord(category, title, content) {
    if (!MEMOIR_CATEGORIES[category]) {
      console.warn("未知回忆录类别:", category);
      return;
    }
    addMemoir(category, {
      title,
      content,
      day:
        typeof StateManager !== "undefined"
          ? StateManager.getState().player.day
          : 0,
    });
  }

  // ====== 导出 ======
  if (typeof window !== "undefined") {
    window.MEMOIR_CATEGORIES = MEMOIR_CATEGORIES;
    window.lifeMemoir = {
      add: addMemoir,
      get: getMemoirsByCategory,
      getAll: getMemoirs,
      getStats: getMemoirStats,
      generateEnding: generateEndingMemoir,
      show: showMemoirModal,
      autoRecord,
      categories: MEMOIR_CATEGORIES,
      maxPerCategory: MAX_MEMOIRS_PER_CATEGORY,
    };
  }
})();

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
      autoRecord: autoRecord,
      categories: MEMOIR_CATEGORIES,
      maxPerCategory: MAX_MEMOIRS_PER_CATEGORY,
      generateCityStory: generateCityStory,
    };
  }

  // ====== P3-1 城市故事生成 ======
  function generateCityStory(state) {
    if (!state) return "";
    var p = state.player || {};
    var s = state.status || {};
    var r = state.resources || {};
    var day = p.day || 1;
    var ribbon = "";
    var ribbonDesc = "";
    if (typeof determineLifeRibbon === "function") {
      var stats = typeof collectLifeStats === "function" ? collectLifeStats(state) : {};
      var rib = determineLifeRibbon(state, stats);
      if (rib) { ribbon = (rib.icon || "🌟") + " " + (rib.name || ""); ribbonDesc = rib.desc || ""; }
    }
    if (!ribbon) { ribbon = "🌆 城市过客"; ribbonDesc = "你在这座城市留下了自己的足迹。"; }
    var cash = r.cash || 0;
    var bank = r.bankBalance || 0;
    var totalAssets = cash + bank;
    var health = s.health || 0;
    var illnessCount = (s.illnesses || []).length;
    var fame = p.fame || 0;
    var morality = p.morality || 50;
    var phase = p.phase === "corporate" ? "🏢 职场人" : "🏘️ 街头打拼";
    var memoirStats = typeof getMemoirStats === "function" ? getMemoirStats() : {};
    var memoirCount = 0;
    for (var mk in memoirStats) memoirCount += memoirStats[mk] || 0;

    var html = '<div style="text-align:center;padding:8px;">';
    html += '<div style="font-size:48px;margin-bottom:8px;">🏙️</div>';
    html += '<h2 style="margin:4px 0;">你的城市故事</h2>';
    html += '<div style="font-size:18px;font-weight:bold;color:var(--accent);margin:8px 0;">' + ribbon + '</div>';
    html += '<div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">' + ribbonDesc + '</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;text-align:left;font-size:12px;">';
    html += '<div style="background:var(--bg-secondary);padding:8px;border-radius:6px;">📅 存活 <strong>' + day + '</strong> 天</div>';
    html += '<div style="background:var(--bg-secondary);padding:8px;border-radius:6px;">💰 总资产 <strong>¥' + totalAssets.toLocaleString() + '</strong></div>';
    html += '<div style="background:var(--bg-secondary);padding:8px;border-radius:6px;">❤️ 最终健康 <strong>' + health + '</strong></div>';
    html += '<div style="background:var(--bg-secondary);padding:8px;border-radius:6px;">' + phase + '</div>';
    if (fame > 0) html += '<div style="background:var(--bg-secondary);padding:8px;border-radius:6px;">⭐ 名气 <strong>' + fame + '</strong></div>';
    if (illnessCount > 0) html += '<div style="background:var(--bg-secondary);padding:8px;border-radius:6px;">🏥 患病 <strong>' + illnessCount + '</strong> 次</div>';
    if (morality >= 70) html += '<div style="background:var(--bg-secondary);padding:8px;border-radius:6px;">😇 道德高尚</div>';
    else if (morality <= 30) html += '<div style="background:var(--bg-secondary);padding:8px;border-radius:6px;">😈 道德沦丧</div>';
    html += '</div>';
    html += '<div style="margin-top:12px;padding:10px;background:var(--bg-secondary);border-radius:8px;text-align:left;font-size:12px;line-height:1.6;">';
    html += '<strong>📜 人生轨迹</strong><br>';
    if (day < 30) html += '你在这座城市没能站稳脚跟，<strong>' + ribbon + '</strong>——一段短暂而深刻的经历。';
    else if (day < 100) html += '你在这座城市挣扎了近百天，最终<strong>' + ribbon + '</strong>。这段日子教会了你生存。';
    else if (day < 365) html += '你在这座城市坚持了近一年，从陌生到熟悉，最终<strong>' + ribbon + '</strong>。';
    else html += '你在这座城市扎根了整整' + Math.floor(day / 365) + '年，经历了风风雨雨，最终<strong>' + ribbon + '</strong>。你的故事成为了这座城市的一部分。';
    html += '</div>';
    html += '<button class="btn btn-sm" style="margin-top:12px;" onclick="alert(\'📋 请截图分享你的城市故事！\')">📸 分享</button>';
    html += '</div>';
    return html;
  }
})();

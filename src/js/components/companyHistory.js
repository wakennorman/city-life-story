/**
 * 公司历史书组件（P1 企业命运系统 Phase 2）
 *
 * 弹窗式展示公司完整历史：基本信息 + 里程碑时间线 + 命运事件记录
 * 数据接口：getCompanyHistory(companyId)
 *
 * 里程碑颜色标记：
 *   🟢 IPO/成长 - 绿色
 *   🔴 倒闭/危机 - 红色
 *   🟡 并购/转型 - 黄色
 *   🔵 常规事件 - 蓝色
 */

/**
 * 渲染公司历史书弹窗
 * @param {string} companyId - 公司 ID
 * @param {Object} state - 游戏状态（可选，用于降级）
 */
function showCompanyHistory(companyId, state) {
  // 先卸掉任何旧弹窗
  document.querySelector(".modal-overlay.company-history-modal")?.remove();

  // 获取数据
  var historyData = null;
  if (typeof getCompanyHistory === "function") {
    historyData = getCompanyHistory(companyId);
  }

  // 降级：如果数据接口不可用，尝试从 state 直接读取
  if (
    !historyData &&
    state &&
    state.enterpriseFate &&
    state.enterpriseFate.companies
  ) {
    var co = state.enterpriseFate.companies[companyId];
    if (co) {
      historyData = {
        id: companyId,
        name: co.name || "未知公司",
        industry: co.industry || "未知",
        culture: co.culture || "",
        cultureIcon: co.cultureIcon || "🏢",
        founder: co.founder || "未知",
        ceoTrait: co.ceoTrait || "",
        ceoBio: co.ceoBio || "",
        currentPhase: co.phase || "unknown",
        currentHealth: co.health || 50,
        currentMarketShare: co.marketShare || 0,
        currentStockPrice: co.stockPrice || 0,
        ceasedExistence: co.ceasedExistence || false,
        ipoed: co.ipoed || false,
        fateEventHistory: co.fateEventHistory || [],
        milestones: [],
        totalEvents: (co.fateEventHistory || []).length,
      };
    }
  }

  if (!historyData) {
    StateManager.addMessage("❌ 无法获取公司历史数据", "danger");
    return;
  }

  // ====== 渲染内容 ======
  var overlay = document.createElement("div");
  overlay.className = "modal-overlay company-history-modal";
  overlay.innerHTML = `
    <div class="modal-box company-history-box">
      <div class="company-history-header">
        <div class="ch-title-area">
          <div class="ch-icon">${historyData.cultureIcon || "🏢"}</div>
          <div class="ch-titles">
            <h2 class="ch-name">${_esc(historyData.name)}</h2>
            <div class="ch-meta">
              <span class="ch-industry">${historyData.industry || "未知行业"}</span>
              ${historyData.ceasedExistence ? '<span class="ch-status ceased">💀 已退出历史舞台</span>' : ""}
              ${historyData.ipoed ? '<span class="ch-status ipo">📈 已上市</span>' : ""}
            </div>
          </div>
        </div>
        <button class="ch-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>

      <!-- CEO 人格化卡片 -->
      ${
        historyData.ceoName
          ? `
      <div class="ch-section ch-ceo-profile">
        <h3 class="ch-section-title">👤 CEO档案：${_esc(historyData.ceoName)}</h3>
        <div class="ch-ceo-grid">
          <div class="ch-ceo-main">
            <div class="ch-ceo-header">
              <div class="ch-ceo-avatar">${historyData.ceoAge ? '<span class="ch-ceo-age">' + historyData.ceoAge + "岁</span>" : ""}</div>
              <div class="ch-ceo-info">
                ${historyData.ceoBackground ? '<div class="ch-ceo-bg">' + _esc(historyData.ceoBackground) + "</div>" : ""}
                ${historyData.ceoPersonality ? '<div class="ch-ceo-personality">' + _esc(historyData.ceoPersonality) + "</div>" : ""}
              </div>
            </div>
            ${historyData.ceoBio ? '<div class="ch-ceo-story">' + _esc(historyData.ceoBio) + "</div>" : ""}
            ${historyData.ceoQuote ? '<div class="ch-ceo-quote">" ' + _esc(historyData.ceoQuote) + ' "</div>' : ""}
          </div>
          ${historyData.ceoWeakness ? '<div class="ch-ceo-weakness"><strong>⚠️ 性格弱点</strong><p>' + _esc(historyData.ceoWeakness) + "</p></div>" : ""}
        </div>
      </div>
      `
          : ""
      }

      <!-- 基本信息卡片 -->
      <div class="ch-section ch-basic-info">
        ${historyData.founder ? '<div class="ch-info-row"><span class="ch-label">🏢 创始人</span><span class="ch-value">' + _esc(historyData.founder) + "</span></div>" : ""}
        ${historyData.ceoTrait ? '<div class="ch-info-row"><span class="ch-label">💼 CEO特质</span><span class="ch-value">' + _esc(historyData.ceoTrait) + "</span></div>" : ""}
        ${historyData.culture ? '<div class="ch-info-row"><span class="ch-label">🌟 企业文化</span><span class="ch-value">' + _esc(historyData.culture) + "</span></div>" : ""}
      </div>

      <!-- 当前状态 -->
      <div class="ch-section ch-current-status">
        <h3 class="ch-section-title">📊 当前状态</h3>
        <div class="ch-status-grid">
          <div class="ch-stat">
            <div class="ch-stat-label">健康度</div>
            <div class="ch-stat-bar"><div class="ch-stat-fill" style="width:${Math.max(5, Math.min(100, historyData.currentHealth || 50))}%"></div></div>
          </div>
          <div class="ch-stat">
            <div class="ch-stat-label">市场份额</div>
            <div class="ch-stat-bar"><div class="ch-stat-fill" style="width:${Math.max(0, Math.min(100, historyData.currentMarketShare || 0))}%"></div></div>
          </div>
          <div class="ch-stat">
            <div class="ch-stat-label">股价</div>
            <div class="ch-stat-value">¥${(historyData.currentStockPrice || 0).toLocaleString()}</div>
          </div>
          <div class="ch-stat">
            <div class="ch-stat-label">事件总数</div>
            <div class="ch-stat-value">${historyData.totalEvents || 0}个</div>
          </div>
        </div>
      </div>

      <!-- 里程碑时间线 -->
      <div class="ch-section ch-milestones">
        <h3 class="ch-section-title">📈 里程碑时间线</h3>
        <div class="ch-timeline">
          ${
            historyData.milestones && historyData.milestones.length > 0
              ? historyData.milestones
                  .sort((a, b) => (a.day || 0) - (b.day || 0))
                  .map(function (m) {
                    var colorClass = "ch-milestone-normal";
                    var icon = m.icon || "📍";
                    if (m.type === "ipo" || m.type === "growth")
                      colorClass = "ch-milestone-ipo";
                    else if (m.type === "death" || m.type === "crisis")
                      colorClass = "ch-milestone-death";
                    else if (m.type === "merge" || m.type === "transform")
                      colorClass = "ch-milestone-merge";
                    return (
                      '<div class="ch-timeline-item ' +
                      colorClass +
                      '">' +
                      '<div class="ch-timeline-dot">' +
                      icon +
                      "</div>" +
                      '<div class="ch-timeline-content">' +
                      '<div class="ch-timeline-day">第' +
                      (m.day || 0) +
                      "天</div>" +
                      '<div class="ch-timeline-desc">' +
                      _esc(m.desc) +
                      "</div>" +
                      "</div>" +
                      "</div>"
                    );
                  })
                  .join("")
              : '<div class="ch-empty">暂无里程碑记录</div>'
          }
        </div>
      </div>

      <!-- 命运事件记录 -->
      <div class="ch-section ch-events">
        <h3 class="ch-section-title">📜 命运事件记录</h3>
        <div class="ch-events-list">
          ${
            historyData.fateEventHistory &&
            historyData.fateEventHistory.length > 0
              ? historyData.fateEventHistory
                  .sort((a, b) => (a.day || 0) - (b.day || 0))
                  .map(function (e) {
                    var eventTypeClass = "ch-event-normal";
                    if (e.type === "ipo" || e.type === "launch")
                      eventTypeClass = "ch-event-ipo";
                    else if (
                      e.type === "crisis" ||
                      e.type === "layoff" ||
                      e.type === "death"
                    )
                      eventTypeClass = "ch-event-crisis";
                    else if (e.type === "merge" || e.type === "acquire")
                      eventTypeClass = "ch-event-merge";
                    return (
                      '<div class="ch-event-item ' +
                      eventTypeClass +
                      '">' +
                      '<span class="ch-event-day">D' +
                      (e.day || 0) +
                      "</span>" +
                      '<span class="ch-event-icon">' +
                      (e.icon || "📰") +
                      "</span>" +
                      '<span class="ch-event-desc">' +
                      _esc(e.desc || e.title || "未知事件") +
                      "</span>" +
                      "</div>"
                    );
                  })
                  .join("")
              : '<div class="ch-empty">暂无事件记录</div>'
          }
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // 点击遮罩关闭
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

/** 转义 HTML 特殊字符 */
function _esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

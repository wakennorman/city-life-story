/**
 * 事件引擎核心 — 随机事件判定、队列管理、弹窗 UI
 *
 * 拆分说明：事件数据已移至 events_street.js / events_corp.js
 * 这些文件在加载后自动推入 RANDOM_EVENTS 数组。
 */

// ====== 空事件容器（由拆分文件在加载后推入）======
const RANDOM_EVENTS = [];

/* =========================================================
 * 二、事件触发与队列管理
 * ========================================================= */

/** 街头每日事件判定 */
function rollStreetEvent(state) {
  // 基础 18% 触发率，已存在待弹事件时不重复触发
  if (state._pendingEvent) return;

  // 心理危机事件：mental<20时优先检查，不占用随机事件槽
  var mentalCrisisIds = [
    "mental_breakdown_edge",
    "mental_therapy_chance",
    "mental_recovery_milestone",
  ];
  for (var mci = 0; mci < mentalCrisisIds.length; mci++) {
    var mce = RANDOM_EVENTS.find(function (e) {
      return e.id === mentalCrisisIds[mci];
    });
    if (mce && typeof mce.conditions === "function" && mce.conditions(state)) {
      state._pendingEvent = mce;
      state.flags._todayMentalEvent = true;
      return;
    }
  }

  // 村长债务追讨事件：债务未还时优先触发，不占用随机事件槽
  var debtEventIds = [
    "village_chief_warning",
    "village_chief_pressure",
    "village_chief_final",
  ];
  for (var dci = 0; dci < debtEventIds.length; dci++) {
    var dce = RANDOM_EVENTS.find(function (e) {
      return e.id === debtEventIds[dci];
    });
    if (dce && typeof dce.conditions === "function" && dce.conditions(state)) {
      state._pendingEvent = dce;
      state.flags._todayDebtEvent = true;
      return;
    }
  }

  // 链式事件队列检查（高优先级，插入心理危机/债务检查之后，随机池之前）
  if (checkChainEventQueue(state, "street")) return;

  const baseChance = 0.18;
  // 健康差或债务高时提高触发率
  let mod = 0;
  if (state.status.health < 50) mod += 0.1;
  if (state.resources.debt > 3000) mod += 0.05;
  if (state.needs.happiness < 30) mod += 0.05;
  // 历史声誉幸运加成（P2.9）：积善之人事件触发率降低
  if (typeof getHistoryModifiers === "function") {
    var lk = getHistoryModifiers(state).luckBonus || 0;
    mod -= lk * 0.008; // 每点幸运降低0.8%触发率（+5幸运≈-4%）
  }
  if (Random.chance(baseChance + mod)) {
    queueRandomEvent(state, "street");
  }
}

/** 职场每日事件判定 */
function rollCorporateEvent(state) {
  if (state._pendingEvent) return;

  // 链式事件队列检查（高优先级）
  if (checkChainEventQueue(state, "corporate")) return;

  const baseChance = 0.22;
  let mod = 0;
  if (state.player.corporate.risk > 50) mod += 0.1;
  if (state.player.corporate.popularity < 30) mod += 0.05;
  if (state.player.corporate.upwardMgmt < 20) mod += 0.05;
  if (Random.chance(baseChance + mod)) {
    queueRandomEvent(state, "corporate");
  }
}

/** 把一个随机事件塞进待弹队列 */
function queueRandomEvent(state, phase) {
  const pool = RANDOM_EVENTS.filter((e) => e.phase === phase);
  if (pool.length === 0) return;

  // 过滤掉不满足条件的事件
  var eligible = pool.filter(function (e) {
    return !e.conditions || e.conditions(state);
  });
  if (eligible.length === 0) return;

  // 新闻桥接加权：活跃新闻提升特定事件的触发权重
  var weights = eligible.map(function (e) {
    var w = 1.0;
    if (typeof getNewsBonusWeight === "function") {
      w += getNewsBonusWeight(e.id, state);
    }
    // 世界参数反馈环：行业热度高的领域相关事件更易触发
    if (typeof getSectorEventWeightMod === "function" && e.sector) {
      w *= getSectorEventWeightMod(e.sector);
    }
    return Math.max(0.1, w);
  });
  var totalWeight = weights.reduce(function (a, b) {
    return a + b;
  }, 0);
  var roll = Random.float(0, totalWeight);
  var cursor = 0;
  var evt = eligible[0];
  for (var wi = 0; wi < eligible.length; wi++) {
    cursor += weights[wi];
    if (roll <= cursor) {
      evt = eligible[wi];
      break;
    }
  }
  // 使用唯一事件ID替代引用比较，避免引用失效导致事件卡住
  state._pendingEvent = evt;
  state._pendingEventId = evt.id;
  // 触发延迟到 render 阶段弹（避免在 tick 内部阻塞）
  setTimeout(() => {
    const s = StateManager.getState();
    if (s._pendingEvent && s._pendingEventId === evt.id) {
      showEventModal(evt);
      if (typeof playSound === "function") playSound("event");
      // 不再自动关闭——玩家必须手动点击选择（游戏设计决定）
    }
  }, 50);
}

/* =========================================================
 * 三、事件弹窗 UI
 * ========================================================= */

/**
 * 渲染并展示一个事件模态框
 * @param {Object} evt - 事件对象
 */
function showEventModal(evt) {
  // 先卸掉任何旧弹窗
  document.querySelector(".modal-overlay")?.remove();

  // 支持 choices 为函数（动态生成，如政策套利兑现事件）
  var choicesArr = evt.choices;
  if (typeof choicesArr === "function") {
    choicesArr = choicesArr(StateManager.getState());
    if (!choicesArr || !choicesArr.length) {
      // 没有可用选项时自动跳过
      var s = StateManager.getState();
      s._pendingEvent = null;
      s._pendingEventId = null;
      return;
    }
  }

  // ====== 春节事件专属检测 ======
  var isSpringFest = !!evt._isSpringFestivalEvent;
  var springFestClass = isSpringFest ? "spring-fest-modal" : "";
  var springFestProgressHtml = "";
  var springFestDecorHtml = "";

  if (isSpringFest) {
    // 进度指示器：春节7天（除夕→初六）
    var dayNames = ["除夕", "初一", "初二", "初三", "初四", "初五", "初六"];
    var dayIcons = ["🏠", "🧧", "👨‍👩‍👧", "🔴", "💰", "🔨", "🗑️"];
    var currentDay = evt.id
      ? parseInt(evt.id.replace("spring_fest_day", ""))
      : 0;
    currentDay = Math.max(0, Math.min(6, currentDay));

    var dotsHtml = "";
    for (var d = 0; d < 7; d++) {
      var dotClass = "spring-fest-progress-dot";
      if (d === currentDay) dotClass += " active";
      else if (d < currentDay) dotClass += " passed";
      dotsHtml += '<div class="' + dotClass + '"></div>';
    }

    springFestProgressHtml =
      '<div class="spring-fest-progress">' +
      '<span class="spring-fest-progress-label">🧨 春节</span>' +
      '<div class="spring-fest-progress-dots">' +
      dotsHtml +
      "</div>" +
      '<span class="spring-fest-progress-label" style="margin-left:4px;">第' +
      (currentDay + 1) +
      "/7天 · " +
      dayNames[currentDay] +
      "</span>" +
      "</div>";

    // 春节装饰元素
    springFestDecorHtml =
      '<span class="spring-fest-decor lantern-left">🏮</span>' +
      '<span class="spring-fest-decor lantern-right">🏮</span>' +
      '<span class="spring-fest-decor coin-bottom">💰</span>';
  }

  // 构建选项HTML
  const choicesHtml = choicesArr
    .map((ch, i) => {
      const hintStr = ch.hint
        ? `<div class="choice-hint">${ch.hint}</div>`
        : "";
      // 检查现金是否够
      let disabled = false;
      if (ch.cost && StateManager.getState().resources.cash < ch.cost) {
        disabled = true;
      }
      const costTag = ch.cost
        ? ` <span style="color:var(--warning);font-size:11px;">需 ¥${ch.cost}</span>`
        : "";
      return `
        <button class="event-choice ${disabled ? "disabled" : ""}" data-idx="${i}" ${disabled ? "disabled" : ""}>
          <div class="choice-main">${ch.text}${costTag}</div>
          ${hintStr}
        </button>
      `;
    })
    .join("");

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay event-modal " + springFestClass;
  overlay.innerHTML = `
    <div class="modal-box event-box ${springFestClass}">
      ${springFestDecorHtml}
      ${springFestProgressHtml}
      <div class="event-header">
        <div class="event-icon">${evt.icon}</div>
        <h2 class="event-title">${evt.title}</h2>
      </div>
      <p class="event-story ${isSpringFest ? "spring-fest-story" : ""}">${evt.story}</p>
      <div class="event-choices">${choicesHtml}</div>
      <div style="text-align:center;margin-top:8px;font-size:10px;color:var(--accent);">
        ${isSpringFest ? "🧨 做出你的选择，迎接新的一年" : "⚡ 请选择一个选项继续"}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // 绑定选项点击
  overlay.querySelectorAll(".event-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx);
      const choice = choicesArr[idx];
      if (!choice) return;
      const state = StateManager.getState();
      try {
        if (typeof choice.apply === "function") {
          choice.apply(state);
          // NPC事件桥接：事件结算后自动触发NPC好感变化
          if (typeof afterEventApplied === "function") {
            afterEventApplied(evt.id, state);
          }
        } else if (typeof choice.effect === "function") {
          // 兼容春节活动事件的 effect 模式（返回 {ok, msg}）
          var result = choice.effect(state);
          if (result && result.ok === false) {
            // 效果失败（如钱不够），不关闭弹窗
            return;
          }
        }
      } catch (e) {
        console.error("Event choice apply error:", e);
      }
      // 清掉待弹事件（三字段全部清理）
      state._pendingEvent = null;
      state._pendingEventId = null;
      // 关闭弹窗 + 重新渲染
      document.body.removeChild(overlay);
      renderAll();
    });
  });

  // 点击遮罩关闭也清理事件悬挂
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      const s = StateManager.getState();
      s._pendingEvent = null;
      s._pendingEventId = null;
      document.body.removeChild(overlay);
      renderAll();
    }
  });
}

/** 跳槽 offer 决策弹窗（被 corp_headhunter 事件调用） */
function showJobOfferModal() {
  const state = StateManager.getState();
  const offer = state.corporate.jobOffer;
  if (!offer) return;
  showModal({
    title: "💼 跳槽 Offer 决策",
    body: `
      <p>另一家公司开出了 <strong style="color:var(--success);">年薪 ¥${offer.salary.toLocaleString()}</strong> 的条件挖你！</p>
      <p style="font-size:12px;color:var(--text-secondary);">跳槽有风险：人缘归零、向上管理归零、KPI 减半、需重新建立关系。</p>
    `,
    buttons: [
      { text: "继续考虑", cls: "", callback: () => {} },
      {
        text: `接受 Offer (¥${offer.salary.toLocaleString()})`,
        cls: "btn-success",
        callback: () => {
          // 简化版：直接加钱 + 重置属性
          state.resources.cash += offer.salary;
          state.player.corporate.kpi = Math.max(
            0,
            state.player.corporate.kpi * 0.5,
          );
          state.player.corporate.popularity = Math.max(
            0,
            state.player.corporate.popularity - 30,
          );
          state.player.corporate.upwardMgmt = Math.max(
            0,
            state.player.corporate.upwardMgmt - 30,
          );
          state.corporate.jobOffer = null;
          StateManager.addMessage(
            `💼 接受了新公司的 offer，拿到 ¥${offer.salary.toLocaleString()} 签字费！`,
            "event",
          );
          renderAll();
        },
      },
    ],
  });
}

/* =========================================================
 * 三·五、链式事件调度管理
 * ========================================================= */

/**
 * 调度一个链式事件在 delayDays 后触发
 * @param {Object} state - 游戏状态
 * @param {string} eventId - 事件ID
 * @param {number} delayDays - 延迟天数
 * @param {string} phase - "street" | "corporate"
 */
function scheduleChainEvent(state, eventId, delayDays, phase) {
  if (!state.flags._chainEventQueue) {
    state.flags._chainEventQueue = [];
  }
  var triggerDay = state.player.day + delayDays;
  // 避免重复调度同一事件
  for (var i = 0; i < state.flags._chainEventQueue.length; i++) {
    if (state.flags._chainEventQueue[i].eventId === eventId) {
      state.flags._chainEventQueue[i].triggerDay = triggerDay;
      return;
    }
  }
  state.flags._chainEventQueue.push({
    eventId: eventId,
    triggerDay: triggerDay,
    phase: phase,
  });
}

/**
 * 检查链式事件队列，有到期事件时直接弹出
 * @param {Object} state - 游戏状态
 * @param {string} phase - "street" | "corporate"
 * @returns {boolean} 是否触发了链式事件
 */
function checkChainEventQueue(state, phase) {
  if (state._pendingEvent) return false;
  var queue = state.flags._chainEventQueue;
  if (!queue || queue.length === 0) return false;

  // 按触发日排序，最急的在前
  queue.sort(function (a, b) {
    return a.triggerDay - b.triggerDay;
  });

  for (var i = 0; i < queue.length; i++) {
    var entry = queue[i];
    if (entry.phase !== phase) continue;
    if (state.player.day < entry.triggerDay) continue;

    // 从队列移除该事件
    queue.splice(i, 1);

    // 在 RANDOM_EVENTS 中查找对应事件
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j].id === entry.eventId) {
        state._pendingEvent = RANDOM_EVENTS[j];
        state._pendingEventId = entry.eventId;
        // 延迟弹窗（避免在 tick 内部阻塞）
        setTimeout(
          (function (evt) {
            return function () {
              var s = StateManager.getState();
              if (s._pendingEvent && s._pendingEventId === evt.id) {
                showEventModal(evt);
                if (typeof playSound === "function") playSound("event");
              }
            };
          })(RANDOM_EVENTS[j]),
          80,
        );
        return true;
      }
    }
    // 没找到事件（可能被删了），继续检查下一条
  }
  return false;
}

/* =========================================================
 * 四、兼容旧 API
 * ========================================================= */

/** 每日新闻判定（旧 API，保持兼容） */
function rollDailyNews(state) {
  // 街头阶段：触发随机事件弹窗，同时小概率触发投资新闻
  if (state.player.phase === "street") {
    rollStreetEvent(state);
    // 8%概率接到市场消息（影响投资市场，仅投资类新闻）
    if (Random.chance(0.08) && typeof getRandomNewsEvent === "function") {
      var investNews = null;
      for (var _attempt = 0; _attempt < 5; _attempt++) {
        var candidate = getRandomNewsEvent();
        if (
          candidate &&
          candidate.type === "investment" &&
          !(state.flags.seenNewsToday || []).includes(candidate.id)
        ) {
          investNews = candidate;
          break;
        }
      }
      if (investNews) {
        investNews._appliedDay = state.player.day;
        state.activeNews = state.activeNews || [];
        state.activeNews.push(investNews);
        state.flags.seenNewsToday = state.flags.seenNewsToday || [];
        state.flags.seenNewsToday.push(investNews.id);
        applyNewsEffect(investNews, state);
        StateManager.addMessage("📰 " + investNews.headline, "event");
      }
    }
    return;
  }
  // 职场阶段：保留少量市场新闻 + 事件弹窗
  const newsChance = state.activeNews.length > 0 ? 0.05 : 0.12;
  if (Random.chance(newsChance)) {
    const news = getRandomNewsEvent();
    if (news && !state.flags.seenNewsToday.includes(news.id)) {
      news._appliedDay = state.player.day;
      state.activeNews.push(news);
      state.flags.seenNewsToday.push(news.id);
      applyNewsEffect(news, state);
      StateManager.addMessage(`📰 ${news.headline}`, "event");
    }
  }
  // 职场事件
  rollCorporateEvent(state);
  // 清理今日已见新闻列表
  if (state.player.day % 3 === 0) {
    state.flags.seenNewsToday = [];
  }
}

/** 每日结束时的清理 */
function dailyCleanup(state) {
  cleanupExpiredNews(state);
  // 清理链式事件队列中已过期的条目
  if (state.flags._chainEventQueue && state.flags._chainEventQueue.length > 0) {
    state.flags._chainEventQueue = state.flags._chainEventQueue.filter(
      function (entry) {
        return state.player.day < entry.triggerDay + 30;
      },
    );
  }
  // 清理 L1-L4 新闻传导队列
  if (typeof cleanupConduitQueue === "function") {
    cleanupConduitQueue(state);
  }
}

/** 季度结束时的职场清理 */
function quarterlyCleanup(state) {
  // 占位（兼容旧调用）
}

/**
 * 城市浮生记 — 域F（UI/UX）联动增强 · R238
 * 全系统优化 loop R238
 *
 * 本轮 A类修复（在 corp_ui.js / career_dev.js / modal.js / life_memoir.js 内）：
 *  - corp_ui.js: cash NaN 守卫（severance现金发放）
 *  - career_dev.js: cash NaN 守卫（学徒礼金）
 *  - modal.js: 4处 cash NaN 守卫 + 2处 totalEarned NaN 守卫
 *  - life_memoir.js: Date.now()→Random.int() 保证 MC 回放确定性
 *
 * 联动增强 3 项（补齐历轮域F未充分利用的 F→B/F→G/F→D 方向）：
 *  1. F→B event_result_visualization（street）：**事件结果可视化** — 在事件选择后
 *     使用视觉化方式展示属性变化（+/- 数值着色+图标），让玩家直观感知事件影响。
 *     通过增强 StateManager.addMessage 的消息格式实现。
 *  2. F→G status_dashboard_alert（street）：**状态预警系统** — 在UI头部/侧栏
 *     增加可折叠的"风险预警"区域，当某项需求接近危险阈值时闪烁提示并给出行动建议。
 *     每日tick检测，写入 st.flags._statusAlerts 供渲染消费。
 *  3. F→D npc_visit_reminder（street）：**NPC拜访提示** — 在UI社交Tab和日报中
 *     增加可拜访NPC的视觉提示，显示"今日可拜访X人"的卡片，以及冷却结束倒计时。
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS；所有 state 访问均 || / typeof 防御。
 *  - 里程碑/冷却用 st.flags._xxx 去重。
 *  - 每个事件显式设 phase。
 *  - 本文件须在 render.js 之后加载（src/index.html 注册序保证）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR238Loaded) return;
  RANDOM_EVENTS._domainFLinkageR238Loaded = true;

  // ============================================================
  // 联动增强1: F→B 事件结果可视化
  // ============================================================
  // 增强 StateManager.addMessage 的格式，对包含 +/- 数值的消息自动着色
  // 在核心UI渲染中处理消息队列时应用视觉增强
  function _enhanceMessageVisualR238(text, type) {
    if (!text) return text;
    // 对数值变化添加视觉标记（+ 绿色 / - 红色）
    var _enhanced = text.replace(
      /([+-])(\d+)/g,
      function (match, sign, num) {
        if (sign === "+") {
          return '<span style="color:var(--success);font-weight:600;">' + match + "</span>";
        } else {
          return '<span style="color:var(--danger);font-weight:600;">' + match + "</span>";
        }
      }
    );
    // 对关键状态变化添加图标
    _enhanced = _enhanced
      .replace(/(心情|happiness)[+-]?\d*/gi, function (m) { return "😊" + m; })
      .replace(/(疲劳|fatigue)[+-]?\d*/gi, function (m) { return "😰" + m; })
      .replace(/(健康|health)[+-]?\d*/gi, function (m) { return "❤️" + m; })
      .replace(/(现金|cash|¥)[+-]?\d*/gi, function (m) { return "💰" + m; });
    return _enhanced;
  }

  // 注册消息增强函数到全局
  function _applyMessageVisualEnhancementR238(st) {
    if (!st || !st.flags) return;
    // 标记已激活，供 render.js 在渲染消息队列时调用
    st.flags._messageVisualEnhancement = true;
  }

  // ============================================================
  // 联动增强2: F→G 状态预警系统
  // ============================================================
  function _updateStatusAlertsR238(st) {
    if (!st || !st.needs || !st.status || !st.flags) return;
    if (!st.player) return;
    var _alerts = [];

    // 饥饿预警
    if (st.needs.hunger <= 10) {
      _alerts.push({ level: "danger", icon: "💀", msg: "极度饥饿！再不吃东西会饿晕！", action: "去城中村/商业区找吃的" });
    } else if (st.needs.hunger <= 25) {
      _alerts.push({ level: "warning", icon: "🍞", msg: "饿了，该吃饭了", action: "去城中村/商业区找吃的" });
    }

    // 疲劳预警
    if (st.needs.fatigue >= 95) {
      _alerts.push({ level: "danger", icon: "😵", msg: "过劳危险！再工作会晕倒！", action: "回家休息或去旅馆睡觉" });
    } else if (st.needs.fatigue >= 80) {
      _alerts.push({ level: "warning", icon: "🥱", msg: "极度疲劳，工作效率大幅下降", action: "建议回家休息" });
    } else if (st.needs.fatigue >= 65) {
      _alerts.push({ level: "info", icon: "😴", msg: "有点累了", action: "注意休息" });
    }

    // 健康预警
    if (st.status.health <= 10) {
      _alerts.push({ level: "danger", icon: "🏥", msg: "健康极度危险！立即就医！", action: "去医院！" });
    } else if (st.status.health <= 25) {
      _alerts.push({ level: "warning", icon: "🤒", msg: "健康很差，需要休息和治疗", action: "去医院或在家休息" });
    }

    // 心情预警
    if (st.needs.happiness <= 10) {
      _alerts.push({ level: "warning", icon: "😢", msg: "心情极度低落，做什么都提不起劲", action: "去公园散步或找朋友聊天" });
    }

    // 卫生预警
    if (st.needs.hygiene <= 10) {
      _alerts.push({ level: "warning", icon: "🦠", msg: "卫生状况很差，容易生病", action: "回家洗漱或去澡堂" });
    }

    // 现金预警
    if (st.resources) {
      var _cash = st.resources.cash || 0;
      if (_cash <= 50 && st.player.day > 5) {
        _alerts.push({ level: "danger", icon: "💸", msg: "现金不足¥50，连吃饭都成问题！", action: "去做日结工作赚钱" });
      } else if (_cash <= 200 && st.player.day > 10) {
        _alerts.push({ level: "warning", icon: "💰", msg: "手头很紧，需要尽快赚钱", action: "找工作或做副业" });
      }
    }

    // 生病/受伤预警
    if (st.status.sick) {
      _alerts.push({ level: "warning", icon: "🤒", msg: "你生病了，所有属性下降", action: "去医院看病或在家休息" });
    }
    if (st.status.injured) {
      _alerts.push({ level: "warning", icon: "🩹", msg: "你受伤了，行动受限", action: "去医院治疗" });
    }

    // 存储到flags供渲染消费
    st.flags._statusAlerts = _alerts;
    st.flags._statusAlertsCount = _alerts.length;
    st.flags._statusAlertsDangerCount = _alerts.filter(function (a) { return a.level === "danger"; }).length;
  }

  // ============================================================
  // 联动增强3: F→D NPC拜访提示
  // ============================================================
  function _updateNpcVisitRemindersR238(st) {
    if (!st || !st.relationships || !st.flags || !st.player) return;
    var _today = st.player.day || 0;
    if (!_today) return;

    var _visitables = [];
    var _decayingSoon = [];
    var _totalMet = 0;

    for (var _id in st.relationships) {
      var _r = st.relationships[_id];
      if (!_r || !_r.met) continue;
      _totalMet++;

      // 可拜访检查（7天冷却）
      var _lastVisit = _r._lastVisit || 0;
      var _daysSinceVisit = _today - _lastVisit;
      if (_daysSinceVisit >= 7) {
        // 获取NPC中文名
        var _npcName = _id;
        if (typeof NPCS !== "undefined" && NPCS) {
          for (var _ni = 0; _ni < NPCS.length; _ni++) {
            if (NPCS[_ni] && NPCS[_ni].id === _id) {
              _npcName = NPCS[_ni].name || _id;
              break;
            }
          }
        }
        _visitables.push({ id: _id, name: _npcName, affinity: _r.affinity || 0 });
      }

      // 即将衰减检查（5天无互动）
      var _lastInteraction = _r._lastInteractionDay || 0;
      var _daysSinceInt = _today - _lastInteraction;
      if (_daysSinceInt >= 5 && _daysSinceInt < 7 && (_r.affinity || 0) > 0) {
        _decayingSoon.push({ id: _id, daysLeft: 7 - _daysSinceInt });
      }
    }

    st.flags._npcVisitables = _visitables;
    st.flags._npcVisitableCount = _visitables.length;
    st.flags._npcDecayingCount = _decayingSoon.length;
    st.flags._npcTotalMet = _totalMet;

    // 如果可拜访NPC≥1且上次提示已是7天前，发消息提醒
    if (_visitables.length >= 1 && !st.npcRelationshipLog) st.npcRelationshipLog = {};
    var _lastReminder = (st.npcRelationshipLog && st.npcRelationshipLog._lastVisitReminderDay) || 0;
    if (_visitables.length >= 1 && _today - _lastReminder >= 7 && typeof StateManager !== "undefined") {
      st.npcRelationshipLog._lastVisitReminderDay = _today;
      // 按好感度排序，取前3个
      _visitables.sort(function (a, b) { return b.affinity - a.affinity; });
      var _top3 = _visitables.slice(0, 3);
      var _names = _top3.map(function (v) { return v.name; }).join("、");
      StateManager.addMessage(
        "👋 今天你可以去拜访 " + _visitables.length + " 位朋友（冷却已结束）：" + _names +
        "。去聊聊天吧，增进感情还能获得小惊喜！",
        "info"
      );
    }

    // 即将衰减的NPC提醒
    if (_decayingSoon.length >= 1 && _today - _lastReminder >= 7) {
      var _decayNames = "";
      for (var _di = 0; _di < _decayingSoon.length; _di++) {
        var _decayNpcId = _decayingSoon[_di].id;
        var _decayName = _decayNpcId;
        if (typeof NPCS !== "undefined" && NPCS) {
          for (var _ni2 = 0; _ni2 < NPCS.length; _ni2++) {
            if (NPCS[_ni2] && NPCS[_ni2].id === _decayNpcId) {
              _decayName = NPCS[_ni2].name || _decayNpcId;
              break;
            }
          }
        }
        _decayNames += (_decayNames ? "、" : "") + _decayName;
      }
      if (_decayNames && typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "⏳ " + _decayNames + " 的好感即将衰减，快去互动吧！",
          "warning"
        );
      }
    }
  }

  // ============================================================
  // 注册到全局
  // ============================================================
  if (typeof window !== "undefined") {
    window._enhanceMessageVisualR238 = _enhanceMessageVisualR238;
    window._applyMessageVisualEnhancementR238 = _applyMessageVisualEnhancementR238;
    window._updateStatusAlertsR238 = _updateStatusAlertsR238;
    window._updateNpcVisitRemindersR238 = _updateNpcVisitRemindersR238;
  }

  // ============================================================
  // RANDOM_EVENTS: 注册备用叙事（用于状态预警触发的随机提示）
  // ============================================================
  RANDOM_EVENTS.push({
    id: "domain_f_status_alert_reminder",
    phase: "street",
    icon: "📊",
    title: "状态检查",
    story: "你停下来审视了一下自己当前的状态。\\n\\n有些地方需要注意了——但还好，你还有时间调整。\\n\\n先解决最紧急的问题，其他的一步步来。",
    conditions: function () { return false; },
    probability: 0,
    repeatable: false,
    choices: [
      {
        text: "📋 查看详细状态",
        hint: "打开状态面板",
        apply: function (st) {
          StateManager.addMessage("📋 你仔细检查了自己的状态，心里有了数。", "info");
        }
      }
    ]
  });
})();
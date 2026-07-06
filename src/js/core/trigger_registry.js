// ========================================
// src/js/core/trigger_registry.js — 事件触发数据化系统（v3.4）
// ========================================
// 约定式编程：事件声明 triggers 数组，系统自动匹配触发时机
// 替代手写 conditions() 函数 + 手写在 main.js/daily_pipeline.js 的触发位置
// ========================================

(function () {
  "use strict";

  /**
   * TRIGGER_SLOTS — 定义全部触发时机的标准名称
   * 每个 slot 有：name（系统内名）/ label（调试标签）/ timing（何时触发）
   */
  var TRIGGER_SLOTS = {
    daily_start:     { label: "每日开始",     timing: "day_tick_before" },
    after_work:      { label: "工作后",       timing: "after_street_job" },
    after_travel:    { label: "旅行后",       timing: "after_travel" },
    after_trade:     { label: "交易后",       timing: "after_trade" },
    after_heal:      { label: "治疗后",       timing: "after_heal" },
    daily_mid:       { label: "每日结算中",   timing: "day_tick_mid" },
    daily_end:       { label: "每日结算后",   timing: "day_tick_after" },
    monthly:         { label: "每月",         timing: "month_tick" },
    weekly:          { label: "每周",         timing: "week_tick" },
    career_promo:    { label: "职业晋升",     timing: "after_career_promo" },
    corp_startup:    { label: "创业注册",     timing: "after_startup_register" },
    random_encounter:{ label: "随机遭遇",     timing: "random" },
  };

  /**
   * TRIGGER_TEMPLATES — 通用触发条件模板
   * 事件可以引用模板名称，系统自动应用
   * 事件也可以自定义 conditions() 函数（渐进式增强）
   */
  var TRIGGER_TEMPLATES = {
    has_debt:        function (state) { return state.debt && state.debt > 0; },
    cash_above_100:  function (state) { return state.cash >= 100; },
    day_above_7:     function (state) { return state.day >= 7; },
    day_above_30:    function (state) { return state.day >= 30; },
    has_health_issue:function (state) { return state.health < 50; },
    has_debt_urgent: function (state) { return state.debt && state.debt > 5000; },
    in_company:      function (state) { return state.phase && state.phase > 1; },
    low_cash:        function (state) { return state.cash < 500; },
  };

  /**
   * 触发注册表：{ [slot]: [{ event, cooldown, weight, template }] }
   */
  var TRIGGER_REGISTRY = {};
  for (var k in TRIGGER_SLOTS) {
    TRIGGER_REGISTRY[k] = [];
  }

  /**
   * 注册事件到触发注册表
   * event 必须有 id/name/icon/choices/effect 字段
   * 支持两种写法：
   *   1. triggers: ["daily_start", "after_work"]  — 自动匹配
   *   2. conditions: function(state) { ... }      — 自定义（保留向后兼容）
   */
  function registerTriggeredEvent(event) {
    if (!event || !event.id) return;

    // 情况1：有 triggers 数组 — 约定式（新增推荐写法）
    if (Array.isArray(event.triggers)) {
      for (var t = 0; t < event.triggers.length; t++) {
        var slot = event.triggers[t];
        if (TRIGGER_REGISTRY[slot]) {
          TRIGGER_REGISTRY[slot].push({
            event: event,
            weight: event.triggerWeight || 1,
            minDay: event.minDay || 0,
            cooldown: event.triggerCooldown || 30,
          });
        }
      }
      return;
    }

    // 情况2：有 conditions 函数 — 向后兼容
    if (typeof event.conditions === "function") {
      // 暂不自动注册，保持原有触发逻辑（由 main.js/daily_pipeline.js 调用）
      // 待后续迁移时再逐步改造成 triggers 写法
      return;
    }
  }

  /**
   * 批量注册事件（在 RANDOM_EVENTS 加载后调用）
   */
  function loadAllTriggers() {
    if (!window.RANDOM_EVENTS) return;
    for (var i = 0; i < window.RANDOM_EVENTS.length; i++) {
      registerTriggeredEvent(window.RANDOM_EVENTS[i]);
    }
  }

  /**
   * 获取某触发时机的所有已注册事件
   */
  function getEventsForSlot(slot) {
    return TRIGGER_REGISTRY[slot] || [];
  }

  /**
   * 检查事件是否满足触发条件（模板 + 自定义 conditions）
   */
  function checkEventTrigger(eventDef, state) {
    var event = eventDef.event;
    if (!event) return false;

    // 最小天数检查
    if (eventDef.minDay && state.day < eventDef.minDay) return false;

    // 自定义 conditions（向后兼容）
    if (typeof event.conditions === "function") {
      return event.conditions(state);
    }
    if (typeof event.condition === "function") {
      return event.condition(state);
    }

    // 模板条件（约定式：通过 template 字段引用）
    if (event.template && TRIGGER_TEMPLATES[event.template]) {
      return TRIGGER_TEMPLATES[event.template](state);
    }

    // 无特殊条件 → 可直接触发
    return true;
  }

  /**
   * 触发某 slot 的所有事件（返回匹配的事件列表）
   */
  function fireTrigger(slot, state) {
    var candidates = getEventsForSlot(slot);
    var matched = [];
    for (var i = 0; i < candidates.length; i++) {
      var ev = candidates[i];
      if (checkEventTrigger(ev, state)) {
        matched.push(ev);
      }
    }
    return matched;
  }

  /**
   * 事件冷却管理
   */
  var _eventCooldowns = {};
  function getCooldownRemaining(eventId, state) {
    if (!state._eventCooldowns) state._eventCooldowns = {};
    var day = state.day || 0;
    return Math.max(0, _eventCooldowns[eventId] - day);
  }
  function setCooldown(eventId, state, days) {
    if (!state._eventCooldowns) state._eventCooldowns = {};
    state._eventCooldowns[eventId] = (state.day || 0) + days;
  }
  function canTrigger(eventId, state, defaultCooldown) {
    if (!state._eventCooldowns) return true;
    var remaining = getCooldownRemaining(eventId, state);
    return remaining <= 0;
  }

  /**
   * 从指定 slot 随机触发一个事件（带冷却管理）
   */
  function triggerRandomEvent(slot, state) {
    var matched = fireTrigger(slot, state);
    if (matched.length === 0) return null;

    // 过滤冷却中的事件
    var available = [];
    for (var i = 0; i < matched.length; i++) {
      var ev = matched[i];
      if (canTrigger(ev.event.id, state, ev.cooldown)) {
        available.push(ev);
      }
    }
    if (available.length === 0) return null;

    // 按权重随机选择
    var totalWeight = 0;
    for (var j = 0; j < available.length; j++) {
      totalWeight += available[j].weight;
    }
    var r = Math.random() * totalWeight;
    var acc = 0;
    for (var k = 0; k < available.length; k++) {
      acc += available[k].weight;
      if (r <= acc) {
        var chosen = available[k];
        setCooldown(chosen.event.id, state, chosen.cooldown);
        return chosen.event;
      }
    }
    return null;
  }

  // 导出全局接口
  window.TriggerRegistry = {
    SLOTS: TRIGGER_SLOTS,
    TEMPLATES: TRIGGER_TEMPLATES,
    register: registerTriggeredEvent,
    loadAll: loadAllTriggers,
    getEventsForSlot: getEventsForSlot,
    checkTrigger: checkEventTrigger,
    fire: fireTrigger,
    triggerRandom: triggerRandomEvent,
    canTrigger: canTrigger,
    setCooldown: setCooldown,
  };
})();
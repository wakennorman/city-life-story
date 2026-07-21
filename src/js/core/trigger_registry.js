/**
 * 约定式触发 —— 双轨统一说明（v3.6）
 * 主路径：events_core.evaluateTriggers ({minDay, minCash, ...} 数据对象)，已接入 queueRandomEvent 主流程。
 * 本文件（trigger_registry）保留：槽位注册、冷却管理、权重随机；用于"时机驱动"型事件（after_work/monthly/...）。
 * 两者通过 checkEventTrigger 兼容 —— 事件可任选一种声明式，勿混用。
 */
// ========================================
// src/js/core/trigger_registry.js — 事件触发数据化系统（v3.4）
// ========================================
// 约定式编程：事件声明 triggers 数组，系统自动匹配触发时机
// 替代手写 conditions() 函数 + 手写在 main.js/daily_pipeline.js 的触发位置
// ========================================
//
// ⚠️ 双轨统一决策（v3.6）：
//   主路径 = events_core.evaluateTriggers（数据对象式，已接入 queueRandomEvent 主循环）
//   本文件 保留 注册/冷却/权重 功能，作为"时机驱动型"事件的注册入口（槽位调度）
//   两者通过 checkEventTrigger 兼容：数组式 triggers:["daily_start"] 与数据对象式
//   triggers:{minDay:4} 分别走不同路径，互不冲突；新事件优先用数据对象式。

(function () {
  "use strict";

  /**
   * TRIGGER_SLOTS — 定义全部触发时机的标准名称
   * 每个 slot 有：name（系统内名）/ label（调试标签）/ timing（何时触发）
   */
  var TRIGGER_SLOTS = {
    daily_start: { label: "每日开始", timing: "day_tick_before" },
    after_work: { label: "工作后", timing: "after_street_job" },
    after_travel: { label: "旅行后", timing: "after_travel" },
    after_trade: { label: "交易后", timing: "after_trade" },
    after_heal: { label: "治疗后", timing: "after_heal" },
    daily_mid: { label: "每日结算中", timing: "day_tick_mid" },
    daily_end: { label: "每日结算后", timing: "day_tick_after" },
    monthly: { label: "每月", timing: "month_tick" },
    weekly: { label: "每周", timing: "week_tick" },
    career_promo: { label: "职业晋升", timing: "after_career_promo" },
    corp_startup: { label: "创业注册", timing: "after_startup_register" },
    random_encounter: { label: "随机遭遇", timing: "random" },
  };

  /**
   * TRIGGER_TEMPLATES — 通用触发条件模板
   * 事件可以引用模板名称，系统自动应用
   * 事件也可以自定义 conditions() 函数（渐进式增强）
   */
  var TRIGGER_TEMPLATES = {
    has_debt: function (state) {
      return (
        (state.resources && state.resources.debt && state.resources.debt > 0) ||
        false
      );
    },
    cash_above_100: function (state) {
      return (state.resources && state.resources.cash) >= 100;
    },
    day_above_7: function (state) {
      return (state.player && state.player.day) >= 7;
    },
    day_above_30: function (state) {
      return (state.player && state.player.day) >= 30;
    },
    day_above_60: function (state) {
      return (state.player && state.player.day) >= 60;
    },
    day_above_100: function (state) {
      return (state.player && state.player.day) >= 100;
    },
    day_above_200: function (state) {
      return (state.player && state.player.day) >= 200;
    },
    day_above_365: function (state) {
      return (state.player && state.player.day) >= 365;
    },
    has_health_issue: function (state) {
      return (state.status && state.status.health) < 50;
    },
    has_high_health: function (state) {
      return (state.status && state.status.health) >= 80;
    },
    has_debt_urgent: function (state) {
      var d = (state.resources && state.resources.debt) || 0;
      return d > 5000;
    },
    in_corporate: function (state) {
      return state.player && state.player.phase === "corporate";
    },
    low_cash: function (state) {
      return (state.resources && state.resources.cash) < 500;
    },
    very_low_cash: function (state) {
      return (state.resources && state.resources.cash) < 100;
    },
    has_skill: function (state) {
      return state.skills && Object.keys(state.skills).length > 0;
    },
    has_relationship: function (state) {
      return state.relationships && Object.keys(state.relationships).length > 0;
    },
    has_job: function (state) {
      return state.employment && state.employment.currentJob;
    },
    unemployed: function (state) {
      return state.employment && !state.employment.currentJob;
    },
    has_company: function (state) {
      return (
        state.startup &&
        state.startup.companies &&
        state.startup.companies.length > 0
      );
    },
    night_phase: function (state) {
      return state.player && state.player.timeSlot === "night";
    },
    morning_phase: function (state) {
      return state.player && state.player.timeSlot === "morning";
    },
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
    if (eventDef.minDay && (state.player && state.player.day) < eventDef.minDay)
      return false;

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
    var day = (state.player && state.player.day) || 0;
    var lastFire = state._eventCooldowns[eventId];
    if (!lastFire) return 0;
    return Math.max(0, lastFire - day);
  }
  function setCooldown(eventId, state, days) {
    if (!state._eventCooldowns) state._eventCooldowns = {};
    state._eventCooldowns[eventId] =
      ((state.player && state.player.day) || 0) + days;
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
    // [全系统自洽修复] 域G A类: Random 始终已定义, 删除 Math.random 死代码兜底
    var r = Random.float(0, totalWeight);
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

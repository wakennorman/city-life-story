/**
 * 域G联动增强 R180 — 核心机制/生命周期 × 跨域桥接
 * [全系统自洽修复] 域G R180: lifecycle → 经济(E)/叙事(B)/UI(F) 联动
 *
 * 3个新功能：
 *   ① G→E: 需求极端状态影响交易价格（饥饿/疲劳极端时价格吃亏）
 *   ② G→B: 季节更替深度叙事（季节转换触发情感叙事）
 *   ③ G→F: 日报情绪趋势提示（展示近7天情绪变化趋势）
 */
(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  // ===== ① G→E: 需求极端状态影响交易价格 =====
  // 当饥饿<20或疲劳>80时，玩家在交易中处于弱势，价格更苛刻
  // 挂载到 pricing.js 的 getBuyPrice/getSellPrice 调用链
  // 通过覆盖全局函数实现非侵入式注入

  var _origGetBuyPrice = typeof window.getBuyPrice === 'function' ? window.getBuyPrice : null;
  if (_origGetBuyPrice) {
    window.getBuyPrice = function (goodId, state, locKey) {
      var base = _origGetBuyPrice(goodId, state, locKey);
      if (!state) return base;
      var hunger = (state.needs && state.needs.hunger) || 100;
      var fatigue = (state.needs && state.needs.fatigue) || 0;
      // 极度饥饿：买价+15%（急需品溢价）
      if (hunger < 20) {
        base = Math.round(base * 1.15);
      }
      // 极度疲劳：买价+8%（判断力下降）
      if (fatigue > 80) {
        base = Math.round(base * 1.08);
      }
      return base;
    };
  }

  var _origGetSellPrice = typeof window.getSellPrice === 'function' ? window.getSellPrice : null;
  if (_origGetSellPrice) {
    window.getSellPrice = function (goodId, state, locKey) {
      var base = _origGetSellPrice(goodId, state, locKey);
      if (!state) return base;
      var hunger = (state.needs && state.needs.hunger) || 100;
      var fatigue = (state.needs && state.needs.fatigue) || 0;
      // 极度饥饿：卖价-12%（急于变现）
      if (hunger < 20) {
        base = Math.round(base * 0.88);
      }
      // 极度疲劳：卖价-5%（议价能力下降）
      if (fatigue > 80) {
        base = Math.round(base * 0.95);
      }
      return base;
    };
  }

  // ===== ② G→B: 季节更替深度叙事 =====
  // 季节转换时（春夏秋冬交替）触发叙事事件，体现时间流逝感
  // 挂载到 weather.js 的 rollWeather 调用链后

  var SEASON_TRANSITION_MSGS = {
    spring_to_summer: {
      icon: '☀️',
      text: '春天过去了，夏天来了。天气一天天热起来，街上的短袖多了，你想起刚来这座城市时也是这样一个闷热的下午。\n\n时间过得真快。',
      effect: function (st) {
        if (!st.player) return;
        st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
      }
    },
    summer_to_autumn: {
      icon: '🍂',
      text: '蝉鸣渐渐稀了，梧桐叶开始泛黄。这座城市从燥热中慢慢安静下来，像是终于喘了口气。\n\n你站在路口，风里已经有了秋天的味道。',
      effect: function (st) {
        if (!st.player) return;
        st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
      }
    },
    autumn_to_winter: {
      icon: '❄️',
      text: '最后一片梧桐叶落下的时候，你意识到冬天来了。空气变得干冷，呼出的白气在路灯下清晰可见。\n\n你裹紧了外套。这座城市又要经历一个冬天，你也是。',
      effect: function (st) {
        if (!st.player) return;
        st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
      }
    },
    winter_to_spring: {
      icon: '🌸',
      text: '冰雪消融，墙角的迎春花开了。你发现自己在某个早晨不再需要哆嗦着穿外套——春天来了。\n\n这座城市又活了过来，你也一样。',
      effect: function (st) {
        if (!st.player) return;
        st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
      }
    },
  };

  // 记录上一季节，在 daily_pipeline 的 weather 步骤后检查
  // 通过覆盖 _origRollWeather 实现
  var _origCheckSeasonTransition = null;

  function checkSeasonTransition(state) {
    if (!state || !state.weather || !state.player) return;
    var currentSeason = state.weather.season;
    var prevSeason = state.flags._prevSeason;
    if (!prevSeason) {
      // 首次运行，记录当前季节
      state.flags._prevSeason = currentSeason;
      return;
    }
    if (prevSeason === currentSeason) return;
    // 节流：每90天最多一次（避免回跳）
    var lastTransition = state.flags._lastSeasonTransitionDay || 0;
    if (state.player.day - lastTransition < 60) {
      state.flags._prevSeason = currentSeason;
      return;
    }

    // 确定转换方向
    var transitionKey = prevSeason + '_to_' + currentSeason;
    var msg = SEASON_TRANSITION_MSGS[transitionKey];
    if (!msg) {
      // 非标准转换（如游戏初始化时），仅更新记录
      state.flags._prevSeason = currentSeason;
      return;
    }

    state.flags._lastSeasonTransitionDay = state.player.day;
    state.flags._prevSeason = currentSeason;
    state.flags._seasonTransitionMsg = transitionKey;

    // 应用效果
    if (typeof msg.effect === 'function') {
      try { msg.effect(state); } catch (e) { /* 静默 */ }
    }

    // 弹出叙事弹窗（使用事件系统）
    if (typeof showEventModal === 'function') {
      var evt = {
        id: 'season_transition_' + transitionKey,
        icon: msg.icon,
        title: '季节更替',
        story: msg.text,
        choices: [{
          text: '继续前行',
          hint: '迎接新的季节',
          apply: function () { /* 纯叙事，无副作用 */ }
        }],
      };
      state._pendingChapterEvent = evt;
      state._pendingChapterEventId = evt.id;
      setTimeout(function () {
        var s = StateManager.getState();
        if (s._pendingChapterEvent && s._pendingChapterEventId === evt.id) {
          showEventModal(s._pendingChapterEvent);
        }
      }, 60);
    } else if (typeof StateManager !== 'undefined') {
      StateManager.addMessage(msg.icon + ' ' + msg.text.substring(0, 40) + '…', 'story');
    }
  }

  // 挂接到 daily_pipeline 的 weather 步骤后（通过包装函数）
  var _origCheckSeason = typeof window.checkSeasonTransition === 'function' ? window.checkSeasonTransition : null;
  window.checkSeasonTransition = checkSeasonTransition;

  // ===== ③ G→F: 日报情绪趋势提示 =====
  // 在 daily_report.js 的 showDailyReport 中注入情绪趋势分析
  // 通过挂载后处理函数实现

  function injectEmotionTrendToReport(state) {
    if (!state || !state.status) return;
    // 收集近7天情绪记录
    if (!state.flags._emotionHistory) state.flags._emotionHistory = [];
    var currentEmo = state.status.emotionalState || 'stable';
    state.flags._emotionHistory.push({
      day: state.player.day,
      emotion: currentEmo,
    });
    // 仅保留最近14天记录
    if (state.flags._emotionHistory.length > 14) {
      state.flags._emotionHistory = state.flags._emotionHistory.slice(-14);
    }

    // 仅每7天在日报中推送一次趋势（避免刷屏）
    if (state.player.day % 7 !== 0) return;
    if (state.flags._lastEmotionTrendDay === state.player.day) return;
    state.flags._lastEmotionTrendDay = state.player.day;

    var history = state.flags._emotionHistory;
    if (history.length < 3) return; // 数据不足

    // 分析趋势：最近3天 vs 之前3天
    var recent = history.slice(-3);
    var earlier = history.slice(-6, -3);
    if (earlier.length === 0) return;

    var emoScore = { depressed: 1, sad: 2, stressed: 3, stable: 4, happy: 5, elated: 6 };
    var recentAvg = recent.reduce(function (s, e) { return s + (emoScore[e.emotion] || 4); }, 0) / recent.length;
    var earlierAvg = earlier.reduce(function (s, e) { return s + (emoScore[e.emotion] || 4); }, 0) / earlier.length;

    var diff = recentAvg - earlierAvg;
    var trendMsg = '';
    if (diff > 0.8) {
      trendMsg = '📈 情绪持续向好，最近几天状态明显提升。继续保持！';
    } else if (diff > 0.3) {
      trendMsg = '📈 情绪在慢慢好转，日子一天比一天有盼头。';
    } else if (diff < -0.8) {
      trendMsg = '📉 最近情绪波动较大，注意休息和调节。';
    } else if (diff < -0.3) {
      trendMsg = '📉 情绪有所下滑，记得找点让自己开心的事。';
    } else {
      trendMsg = '➡️ 情绪基本稳定，这是好事。';
    }

    if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
      StateManager.addMessage('🧠 情绪趋势：' + trendMsg, 'hint');
    }
  }

  // 挂载情绪趋势到日报后处理
  window._injectEmotionTrend = injectEmotionTrendToReport;

  // ===== 注册到全局 =====
  // 季节更替检查由 daily_pipeline 的 weather 步骤后调用
  // 通过包装实现：在 rollWeather 后自动调用 checkSeasonTransition
  var _origRollWeather = typeof window.rollWeather === 'function' ? window.rollWeather : null;
  if (_origRollWeather) {
    window.rollWeather = function (state) {
      _origRollWeather(state);
      // 天气判定后检查季节更替
      if (typeof checkSeasonTransition === 'function') {
        try { checkSeasonTransition(state); } catch (e) { /* 静默 */ }
      }
    };
  }

  // 情绪趋势由 daily_pipeline 的 end_log 步骤后调用
  // 通过向 DAILY_PIPELINE 追加步骤实现
  if (typeof DAILY_PIPELINE !== 'undefined' && Array.isArray(DAILY_PIPELINE)) {
    DAILY_PIPELINE.push({
      name: 'emotion_trend_check',
      fn: function (state) {
        if (typeof _injectEmotionTrend === 'function') {
          try { _injectEmotionTrend(state); } catch (e) { /* 静默 */ }
        }
      },
    });
  }

  // 注册到百科
  if (typeof window.MECHANICS !== 'undefined') {
    window.MECHANICS.season_transition = {
      id: 'season_transition',
      name: '季节更替',
      icon: '🌸',
      brief: '春夏秋冬，四季轮回——每个季节的更替都会触发一段叙事，记录时间在你身上留下的痕迹。',
      version: '1.0.0',
      related: ['mechanics:weather_system', 'mechanics:emotion_system'],
      sections: [
        { kind: 'desc', text: '季节更替系统在春→夏、夏→秋、秋→冬、冬→春四个转换节点触发叙事弹窗，并给予心智+1~2的成长奖励。' },
        { kind: 'subhead', text: '🍂 四季叙事' },
        {
          kind: 'list',
          items: [
            '☀️ 春→夏：炎热将至，心智+1',
            '🍂 夏→秋：凉意渐起，心智+1，心情+3',
            '❄️ 秋→冬：寒冬来临，心智+2',
            '🌸 冬→春：万物复苏，心智+2，心情+5',
          ],
        },
        { kind: 'tip', text: '季节更替每60天最多触发一次，避免重复刷屏。' },
      ],
    };
  }
})();
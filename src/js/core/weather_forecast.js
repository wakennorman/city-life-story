/**
 * 气象预报系统 — Weather Forecast
 *
 * 让玩家在当天结束时查看明天天气并做准备。
 * 准确率：季节规律(70%) + 随机偏差(30%)，晴天准确率>雨天
 *
 * 接线：
 *   daily_pipeline.js weather 步骤后调用 updateNextDayForecast(state)
 *   weather_daily_effects 步骤中检查 _weatherPrep 减免惩罚
 *   render.js 侧边栏展示明日预报 + 准备状态
 *   actions_extra.js 提供"准备应对天气"行动
 */

(function () {
  "use strict";

  // ====== 生成明日预报 ======

  /**
   * 在每日天气确定后调用，计算明日预报。
   * 预报存储在 state.weather._nextDayForecast
   */
  function updateNextDayForecast(state) {
    if (!state.weather) return;

    var season = typeof getSeason === "function" ? getSeason(state.player.day) : null;
    if (!season) return;

    var currentWid = state.weather.current || "sunny";
    var weights = season.weatherWeights;

    // 70% 基于季节规律，30% 随机偏差
    var sunnyAccuracy = 0.82; // 晴天准确率更高
    var rainyAccuracy = 0.65; // 雨天准确率略低

    var forecastId, confidence;
    var useSeasonal = Random.chance(0.7);

    if (useSeasonal) {
      // 从季节权重选最可能的天气（加权随机，与当前天气相关）
      var weighted = {};
      var total = 0;
      for (var wid in weights) {
        if (!weights.hasOwnProperty(wid)) continue;
        // 偏向维持当前天气（天气持续性）
        var bias = wid === currentWid ? 1.5 : 1.0;
        var w = weights[wid] * bias;
        weighted[wid] = w;
        total += w;
      }
      var roll = Random.float(0, total);
      for (var wid2 in weighted) {
        if (!weighted.hasOwnProperty(wid2)) continue;
        roll -= weighted[wid2];
        if (roll <= 0) {
          forecastId = wid2;
          break;
        }
      }
      if (!forecastId) forecastId = "sunny";
      confidence = forecastId === "sunny" ? sunnyAccuracy : rainyAccuracy;
    } else {
      // 30% 随机偏差：完全随机选一个
      var keys = Object.keys(weights);
      forecastId = keys[Random.int(0, keys.length - 1)];
      confidence = 0.4 + Random.float(0, 0.3);
    }

    // 确定预报温度（简单估算）
    var tempForecast = state.weather.temperature || 22;
    tempForecast += Random.int(-3, 3);

    state.weather._nextDayForecast = {
      weatherId: forecastId,
      temperature: tempForecast,
      confidence: Math.round(confidence * 100),
    };
  }

  // ====== 天气预报UI文本 ======

  /**
   * 获取明日预报的展示 HTML（供 render.js 调用）
   */
  function getForecastHTML(state) {
    if (!state.weather || !state.weather._nextDayForecast) return "";
    var f = state.weather._nextDayForecast;
    var wDef = typeof WEATHER_TYPES !== "undefined"
      ? WEATHER_TYPES.find(function (wt) { return wt.id === f.weatherId; })
      : null;
    var icon = wDef ? wDef.icon : "🌤️";
    var name = wDef ? wDef.name : "未知";
    var prep = state.flags && state.flags._weatherPrep;
    var prepIcon = "";
    if (prep && prep.umbrella) prepIcon += "☂️";
    if (prep && prep.warmPack) prepIcon += "🧣";

    var html = '<div style="margin-top:4px;padding-top:4px;border-top:1px solid var(--border);font-size:10px;">';
    html += '<span style="color:var(--text-muted);">📡 明日天气：</span>';
    html += '<span style="font-weight:600;">' + icon + " " + name + " " + Math.round(f.temperature) + "°C</span>";
    html += '<span style="color:var(--text-muted);margin-left:4px;">(' + f.confidence + "%)</span>";

    // 建议提示
    var isRainy = ["rainy", "stormy", "plum_rain"].indexOf(f.weatherId) >= 0;
    var isCold = ["snowy", "cold_snap", "foggy"].indexOf(f.weatherId) >= 0;
    if (isRainy && !(prep && prep.umbrella)) {
      html += '<div style="color:var(--warning);margin-top:2px;">💡 明日有雨，建议买伞（¥20）</div>';
    } else if (isRainy && prep && prep.umbrella) {
      html += '<div style="color:var(--success);margin-top:2px;">✅ 已备伞，雨天出行无忧</div>';
    }
    if (isCold && !(prep && prep.warmPack)) {
      html += '<div style="color:var(--warning);margin-top:2px;">💡 明日寒冷，建议买暖宝（¥50）</div>';
    } else if (isCold && prep && prep.warmPack) {
      html += '<div style="color:var(--success);margin-top:2px;">✅ 已备暖宝，寒冷无惧</div>';
    }
    if (prepIcon) {
      html += '<div style="margin-top:2px;">🎒 已准备：' + prepIcon + "</div>";
    }
    html += "</div>";
    return html;
  }

  // ====== 天气准备行动 ======

  /**
   * 玩家准备应对天气 — 供 actions_extra.js 调用
   */
  function prepareForWeather(state) {
    if (!state.flags) state.flags = {};
    if (!state.flags._weatherPrep) state.flags._weatherPrep = {};

    var prep = state.flags._weatherPrep;
    var cash = state.resources.cash || 0;
    var results = [];

    // 买伞（雨天疲劳惩罚减半）
    if (!prep.umbrella) {
      if (cash >= 20) {
        state.resources.cash -= 20;
        prep.umbrella = true;
        results.push("☂️ 买了伞（¥20）");
      } else {
        results.push("⚠️ 钱不够买伞（需¥20）");
      }
    } else {
      results.push("☂️ 已有伞");
    }

    // 买暖宝（雪天/寒潮健康损失减半）
    if (!prep.warmPack) {
      if (cash >= 50) {
        state.resources.cash -= 50;
        prep.warmPack = true;
        results.push("🧣 买了暖宝（¥50）");
      } else {
        results.push("⚠️ 钱不够买暖宝（需¥50）");
      }
    } else {
      results.push("🧣 已有暖宝");
    }

    StateManager.addMessage("🌤️ 天气准备：" + results.join("，"), "info");
  }

  // ====== 获取准备状态（供 UI 展示）=====
  function hasWeatherPrep(state, type) {
    if (!state.flags || !state.flags._weatherPrep) return false;
    return !!state.flags._weatherPrep[type];
  }

  // ====== 全局挂载 ======
  if (typeof window !== "undefined") {
    window.updateNextDayForecast = updateNextDayForecast;
    window.getForecastHTML = getForecastHTML;
    window.prepareForWeather = prepareForWeather;
    window.hasWeatherPrep = hasWeatherPrep;
  }
})();
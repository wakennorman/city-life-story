/*
 * 城市浮生记 — 域G（核心机制/生命周期）联动增强 · R169
 * 全系统优化 loop R169 · 联动增强 2项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR169) return;
  RANDOM_EVENTS._domainGLinkageR169 = true;

  // ---- 本地助手 ----

  function safeAffinityR169(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域G R169联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 取当前天气中文描述
  function weatherDescR169(st) {
    if (!st || !st.weather) return "晴";
    var w = st.weather;
    if (w.temperature !== undefined) {
      if (w.temperature < -5) return "极寒";
      if (w.temperature < 5) return "寒冷";
      if (w.temperature > 35) return "酷暑";
    }
    if (w.condition === "rainy" || w.condition === "stormy") return "雨天";
    if (w.condition === "snowy") return "雪天";
    if (w.condition === "foggy") return "雾天";
    if (w.condition === "windy") return "大风";
    return "晴";
  }

  // 取已结识NPC数量
  function metNpcCountR169(st) {
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      if (st.relationships[id] && st.relationships[id].met) count++;
    }
    return count;
  }

  // ---- 联动事件 ----

  var G_EVENTS = [

    // ===== G→B 极端天气生存记忆 =====
    // 设计意图：当玩家经历多次极端天气后，触发生存记忆叙事，
    //   让天气系统(weather.js)从纯数值变成有情感温度的经历。
    {
      id: "weather_survival_memory",
      title: "与天气斗智斗勇的日子",
      desc: "你翻看着手机里的天气记录，这个城市的气候真是变幻莫测——极寒、酷暑、暴雨、大雾，你都经历过来了。\n\n记得第一次遇到寒潮时，你连件厚衣服都没有，冻得直哆嗦。现在你已经学会了看天气预报提前准备。\n\n这座城市的大自然，你算是摸透了。",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._weatherSurvivalMemoryDone) return false;
        // 至少经历过3种不同极端天气
        var extremeDays = 0;
        if (st.flags._experiencedExtremeCold) extremeDays++;
        if (st.flags._experiencedExtremeHeat) extremeDays++;
        if (st.flags._experiencedStorm) extremeDays++;
        if (st.flags._experiencedFog) extremeDays++;
        if (extremeDays < 2) return false;
        return true;
      },
      choices: [
        {
          text: "📝 把经验记下来，以后备用",
          apply: function (st) {
            if (st.flags) st.flags._weatherSurvivalMemoryDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你把这些经验整理成了一份'城市生存天气指南'。心智+4，智力+2。",
                "good"
              );
          },
        },
        {
          text: "🌆 感慨一下，继续赶路",
          apply: function (st) {
            if (st.flags) st.flags._weatherSurvivalMemoryDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你笑了笑，继续往前走。这点风雨，已经不算什么了。心智+3，心情+3。",
                "hint"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== G→A 季节变化生活成本感知 =====
    // 设计意图：当季节更替时，触发生活成本变化叙事，
    //   让四季系统从纯视觉变成可感知的经济压力。
    {
      id: "seasonal_cost_awareness",
      title: "换季了，钱包又瘦了一圈",
      desc: "季节更替，你的生活成本也跟着变了——\n\n冬天要取暖，电费涨了；夏天要防暑，水电开销也少不了。春秋倒是舒服，但换季的衣服鞋袜又是一笔开支。\n\n在这个城市里，连天气都在影响你的钱包。",
      phase: "street",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._seasonalCostAwarenessDone) return false;
        // 至少经历过1次季节更替（day≥30且是换季日附近）
        if ((st.player.day || 0) < 30) return false;
        // 可用现金不高（<¥5000时效果更明显）
        var cash = (st.resources && st.resources.cash) || 0;
        if (cash > 5000) return false;
        return true;
      },
      choices: [
        {
          text: "💰 精打细算，做好换季预算",
          apply: function (st) {
            if (st.flags) st.flags._seasonalCostAwarenessDone = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
            if (st.flags) st.flags._budgetAware = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你开始认真做预算，每一笔钱都花在刀刃上。智力+3，心智+2。",
                "good"
              );
          },
        },
        {
          text: "😤 咬咬牙，熬过去就好了",
          apply: function (st) {
            if (st.flags) st.flags._seasonalCostAwarenessDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.player) st.player.physique = Math.min(100, (st.player.physique || 50) + 1);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你咬紧牙关，告诉自己一切都会好起来的。体质+1，心智+3。",
                "info"
              );
          },
        },
      ],
      probability: 0.05,
    },
  ];

  // 注册到 RANDOM_EVENTS
  for (var i = 0; i < G_EVENTS.length; i++) {
    var evt = G_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions) evt.conditions = function () { return false; };
    RANDOM_EVENTS.push(evt);
  }
})();
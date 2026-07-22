/*
 * 城市浮生记 — 域B（事件/叙事）联动增强 · R172
 * 全系统优化 loop R172 · 联动增强 2项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR172) return;
  RANDOM_EVENTS._domainBLinkageR172 = true;

  var B_EVENTS = [

    // ===== 联动1: B→A 极端天气·物价波动叙事 =====
    // 设计意图：恶劣天气（台风/暴雨/寒潮）时，菜市场商品价格上涨，
    //   让天气系统对经济系统产生可感知的影响，同时触发叙事事件。
    {
      id: "weather_price_surge_awareness",
      title: "菜价又涨了",
      desc: "菜市场里转了一圈，你发现今天的菜价比平时贵了不少。卖菜的大姐无奈地说：'天气不好，进货价就涨了，我们也没办法。'\\n\\n你看了看自己的钱包，决定今天是不是该省着点吃。",
      phase: "street",
      triggers: { minDay: 10 },
      conditions: function (st) {
        if (!st || !st.weather || !st.flags) return false;
        if (st.flags._weatherPriceSurgeDone) return false;
        // 极端天气触发
        var weather = st.weather.current || st.weather.condition || "";
        var extremeWeather = ["typhoon", "heavy_rain", "stormy", "heavy_snow", "cold_wave", "heat_wave"];
        if (extremeWeather.indexOf(weather) === -1) return false;
        return true;
      },
      choices: [
        {
          text: "🛒 少买点，将就一顿",
          apply: function (st) {
            if (st.flags) st.flags._weatherPriceSurgeDone = true;
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + 20; // 省了20块
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你将就了一顿，省了大概¥20。虽然没吃饱，但心里觉得省了一笔。",
                "info"
              );
          },
        },
        {
          text: "🍜 该吃吃，不差这点钱",
          apply: function (st) {
            if (st.flags) st.flags._weatherPriceSurgeDone = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你照常买了不少菜，吃饱了才有力气挣钱。心情+3。",
                "success"
              );
          },
        },
      ],
      probability: 0.06,
    },

    // ===== 联动2: B→G 健康恶化·雪上加霜 =====
    // 设计意图：当玩家健康值偏低时，触发更多负面事件，
    //   制造"倒霉时喝凉水都塞牙"的叙事体验，强化健康管理的重要性。
    {
      id: "health_decline_chain",
      title: "身体在抗议",
      desc: "你最近总觉得浑身不对劲。早上起来头晕，走路有点飘，连上楼都喘。\\n\\n你知道这是身体在抗议——长期营养不良、睡眠不足、压力大。再不注意，可能真要倒下了。",
      phase: "street",
      triggers: { minDay: 20 },
      conditions: function (st) {
        if (!st || !st.status || !st.flags) return false;
        if (st.flags._healthDeclineChainDone) return false;
        // 健康值低于40触发
        var health = (st.status.health || 100);
        if (health >= 40) return false;
        return true;
      },
      choices: [
        {
          text: "🏥 去医院检查一下",
          hint: "花费¥200",
          apply: function (st) {
            if (st.flags) st.flags._healthDeclineChainDone = true;
            var cost = 200;
            if (st.resources && (st.resources.cash || 0) >= cost) {
              st.resources.cash = (st.resources.cash || 0) - cost;
              if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 15);
              if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
              if (typeof StateManager !== "undefined" && StateManager.addMessage)
                StateManager.addMessage(
                  "🏥 去医院检查了一下，医生说没什么大问题，但要注意休息和营养。开了点药，健康+15，心智+5。花费¥200。",
                  "success"
                );
            } else {
              if (typeof StateManager !== "undefined" && StateManager.addMessage)
                StateManager.addMessage(
                  "🏥 你去了医院，但挂号费就要¥200...你摸了摸口袋，转身走了。",
                  "warning"
                );
            }
          },
        },
        {
          text: "😤 扛一扛，年轻没事",
          apply: function (st) {
            if (st.flags) st.flags._healthDeclineChainDone = true;
            if (st.status) st.status.health = Math.max(0, (st.status.health || 50) - 5);
            if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你决定扛一扛。但身体不会骗人——第二天你起来时浑身酸痛，感觉更糟糕了。健康-5，疲劳+10。",
                "danger"
              );
          },
        },
      ],
      probability: 0.05,
    },
  ];

  // 注册事件
  for (var i = 0; i < B_EVENTS.length; i++) {
    RANDOM_EVENTS.push(B_EVENTS[i]);
  }

  if (typeof window !== "undefined") {
    window._domainBLinkageR172 = true;
  }
})();
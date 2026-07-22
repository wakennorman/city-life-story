/*
 * 城市浮生记 — 域B（事件/叙事）联动增强 · R172
 * 全系统优化 loop R172 · 联动增强 4项
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

    // ===== 联动3: B→C 技能突破·职业觉醒叙事 =====
    // 设计意图：当玩家某项技能达到Lv.70时，触发技能突破叙事事件，
    //   让技能成长有仪式感，同时奖励技能XP形成正向循环。
    {
      id: "skill_breakthrough_narrative",
      title: "技艺突破",
      desc: "你日复一日的练习终于有了回报。今天干活时，你突然发现以前觉得困难的动作变得流畅自如，那些曾经看不懂的诀窍现在一目了然。\\n\\n你意识到——自己的技能已经突破了某个瓶颈，进入了一个新的层次。",
      phase: "street",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.skills || !st.flags) return false;
        if (st.flags._skillBreakthroughNarrativeDone) return false;
        // 检查是否有任何技能达到Lv.70
        var skillKeys = ["cooking", "repair", "coding", "driving", "sales", "management", "accounting", "electrician", "welding", "english"];
        for (var si = 0; si < skillKeys.length; si++) {
          var sk = st.skills[skillKeys[si]];
          if (sk && sk.level >= 70) return true;
        }
        return false;
      },
      choices: [
        {
          text: "🔥 趁热打铁，继续精进",
          apply: function (st) {
            if (st.flags) st.flags._skillBreakthroughNarrativeDone = true;
            // 找到最高技能并奖励XP
            if (st.skills) {
              var bestSkill = null;
              var bestLevel = 0;
              for (var sk2 in st.skills) {
                if (st.skills[sk2] && st.skills[sk2].level > bestLevel) {
                  bestLevel = st.skills[sk2].level;
                  bestSkill = sk2;
                }
              }
              if (bestSkill && st.skills[bestSkill]) {
                st.skills[bestSkill].xp = (st.skills[bestSkill].xp || 0) + 120;
              }
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你乘胜追击，继续钻研技艺。技能经验+120，心智+3。",
                "good"
              );
          },
        },
        {
          text: "🎓 收个徒弟，传授经验",
          apply: function (st) {
            if (st.flags) st.flags._skillBreakthroughNarrativeDone = true;
            if (st.flags) st.flags._hasApprentice = true;
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你开始带徒弟了。教别人的过程让你对技艺有了更深的理解，名气+5，心智+2。",
                "success"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动4: B→E 市场波动·投资意识觉醒 =====
    // 设计意图：当玩家经历多次市场事件后，触发投资意识觉醒叙事，
    //   让经济系统与事件系统产生联动，为玩家开启投资路径。
    {
      id: "market_volatility_invest_awakening",
      title: "波动中的机会",
      desc: "你最近注意到市场上的商品价格经常上蹿下跳。有时候一天一个价，有时候一周翻倍又跌回原样。\\n\\n街口的投资顾问递给你一张传单：'行情波动大，正是理财好时机！'你看着传单上的收益率，陷入了沉思。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.trade || !st.flags) return false;
        if (st.flags._marketVolatilityInvestAwakeningDone) return false;
        // 经历至少2次市场事件（或交易次数≥20）
        var marketEvents = (st.trade.marketEvents && st.trade.marketEvents.length) || 0;
        var totalBuys = st.trade.totalBuys || 0;
        var totalSells = st.trade.totalSells || 0;
        if (marketEvents >= 2 || (totalBuys + totalSells) >= 20) return true;
        return false;
      },
      choices: [
        {
          text: "📈 开始学习投资理财",
          apply: function (st) {
            if (st.flags) st.flags._marketVolatilityInvestAwakeningDone = true;
            if (st.flags) st.flags._investAwakening = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            }
            if (st.skills && st.skills.accounting) {
              st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 60;
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你买了几本投资入门书，开始研究理财知识。智力+3，会计经验+60。",
                "good"
              );
          },
        },
        {
          text: "💼 先存钱，等机会再出手",
          apply: function (st) {
            if (st.flags) st.flags._marketVolatilityInvestAwakeningDone = true;
            var saveAmt = 0;
            if (st.resources) {
              saveAmt = Math.min(500, st.resources.cash || 0);
              st.resources.cash = (st.resources.cash || 0) - saveAmt;
              st.resources.bankBalance = (st.resources.bankBalance || 0) + saveAmt;
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你决定先存钱，等市场稳定了再出手。存了¥" + saveAmt + "到银行，心智+2。",
                "info"
              );
          },
        },
      ],
      probability: 0.035,
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
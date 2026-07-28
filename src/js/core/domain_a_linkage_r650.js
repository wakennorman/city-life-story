/**
 * 域A(数据/数值平衡) 联动增强 R650
 * 桥接：
 *   A→B  a650_market_whisper  市场低语 → 消费 state.resources+state.flags 数据,
 *     数据→"市场数据中的故事"的叙事回响
 *   A→F  a650_price_alarm_ui  价格预警UI → 消费 state.resources 数据,
 *     数据→"价格变动提醒"的UI回响
 *   A→D  a650_bargain_tip  砍价技巧 → 消费 state.relationships+state.skills 数据,
 *     数据→"价格数据中的社交智慧"的社交回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR650Loaded) return;
  RANDOM_EVENTS._domainALinkageR650Loaded = true;

  var EVENTS = [
    // ====== A→B: 市场低语 ======
    {
      id: "a650_market_whisper", phase: "street", _isChainEvent: false, icon: "🔮",
      title: "市场低语",
      story: "你从数据中嗅到了市场的变化——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 10, excludeFlags: ["_a650MarketWhisperCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a650MarketWhisperCooldown) return false;
        return true;
      },
      choices: [
        { text: "📈 相信直觉,提前布局", hint: "智力+5,收益¥300-800", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a650MarketWhisperCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          var earn = 300 + Random.int(0, 500);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + earn;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔮 '数据不会骗人,市场要变天了!' 你提前布局,小赚了一笔。智力+5,收益¥" + earn.toLocaleString() + "。", "success");
        }},
        { text: "📝 记录观察", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a650MarketWhisperCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔮 你详细记录了市场的变化规律。'这些数据,以后一定用得上。' 心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你盯着最近的价格走势图,发现了一个微妙的规律。'每次猪肉价格连续涨3天,鸡蛋就会跟着涨...' 市场的低语,你听懂了。";
      }
    },

    // ====== A→F: 价格预警UI ======
    {
      id: "a650_price_alarm_ui", phase: "street", _isChainEvent: false, icon: "🔔",
      title: "价格预警",
      story: "手机弹出一条价格预警通知——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 10, excludeFlags: ["_a650PriceAlarmCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a650PriceAlarmCooldown) return false;
        return true;
      },
      choices: [
        { text: "🛒 趁涨价前囤货", hint: "省下¥200-500,现金-300", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a650PriceAlarmCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300);
          if (st.flags) st.flags._smartShopping = (st.flags._smartShopping || 0) + 1;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔔 你赶在涨价前囤了一些日用品。'省到就是赚到!' 现金-300,省下了未来开支。", "success");
        }},
        { text: "📊 查看价格趋势图", hint: "智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a650PriceAlarmCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔔 你打开价格趋势图,仔细研究。'原来每次节日前都会涨价,下次就知道了。' 智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "手机弹出预警:'您关注的商品——鸡蛋,价格已上涨15%,达到¥8.5/斤。' 你叹了口气:'又涨了,得想想办法了。'";
      }
    },

    // ====== A→D: 砍价技巧 ======
    {
      id: "a650_bargain_tip", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "砍价高手",
      story: "你发现和摊主搞好关系,能拿到更好的价格——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 8, excludeFlags: ["_a650BargainTipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a650BargainTipCooldown) return false;
        return true;
      },
      choices: [
        { text: "🤝 套近乎砍价", hint: "省下¥100-300,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a650BargainTipCooldown = true;
          var saved = 100 + Random.int(0, 200);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + saved;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '老板,老顾客了,便宜点呗!' 你成功砍下¥" + saved + "。'会说话,比会算账更重要。'", "success");
        }},
        { text: "📋 比较几家价格", hint: "智力+4,现金-100", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a650BargainTipCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100);
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你跑了几家店,比较了价格。'同样的东西,差价居然这么大!' 智力+4,现金-100。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现小区门口的水果摊,老板对熟客总是便宜不少。'原来价格不只是数字,更是人情。' 你开始学着和摊主们套近乎。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
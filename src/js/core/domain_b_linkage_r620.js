/**
 * 域B(事件/叙事) 联动增强 R620
 * 桥接：
 *   B→H  b620_industry_news_impact  行业新闻冲击 → 消费 state.activeNews+state.startup 数据,
 *     事件→"行业新闻影响公司决策"的公司回响
 *   B→F  b620_event_diary_ui  事件日记UI → 消费 state.flags+state.player 数据,
 *     事件→"事件记录可视化"的UI回响
 *   B→A  b620_market_story_data  市场故事数据 → 消费 state.flags 数据,
 *     事件→"故事中的市场数据"的数值回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR620Loaded) return;
  RANDOM_EVENTS._domainBLinkageR620Loaded = true;

  var EVENTS = [
    // ====== B→H: 行业新闻冲击 ======
    {
      id: "b620_industry_news_impact", phase: "corporate", _isChainEvent: false, icon: "📡",
      title: "行业地震",
      story: "一条行业新闻震动了整个市场——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 5, excludeFlags: ["_b620IndustryNewsCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b620IndustryNewsCooldown) return false;
        return st.startup && st.startup.company && (st.startup.company.valuation || 0) >= 50000;
      },
      choices: [
        { text: "🔄 调整战略方向", hint: "公司效率+10,心智+5,现金-1000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b620IndustryNewsCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.startup && st.startup.company) {
            st.startup.company.efficiency = Math.min(100, (st.startup.company.efficiency || 50) + 10);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📡 '行业风向变了,我们必须跟着变!' 你果断调整了公司战略。公司效率+10,心智+5,现金-1000。", "success");
        }},
        { text: "📊 分析市场影响", hint: "智力+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b620IndustryNewsCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📡 你花了几天时间分析这条新闻对行业的深远影响。'信息就是竞争力。' 智力+5,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你看到了一条行业新闻——'XX领域出台新政策,行业面临重新洗牌。' 你的公司也在这个行业中,这个新闻可能带来机遇,也可能带来挑战。";
      }
    },

    // ====== B→F: 事件日记UI ======
    {
      id: "b620_event_diary_ui", phase: "street", _isChainEvent: false, icon: "📖",
      title: "事件日记",
      story: "你翻开日记,回顾最近发生的大事——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 8, excludeFlags: ["_b620EventDiaryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b620EventDiaryCooldown) return false;
        return true;
      },
      choices: [
        { text: "📝 写下感悟", hint: "心智+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b620EventDiaryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你写下最近的感悟。'记录生活,才能看清自己走过的路。' 心智+5,心情+3。", "success");
        }},
        { text: "📸 拍张照片留念", hint: "心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b620EventDiaryCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你拍了一张照片,记录下这个瞬间。'以后回头看,一定很有意思。' 心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var day = st.player.day || 0;
        return "你翻开日记本,已经记录到第" + day + "天了。'这座城市每天都在发生故事,而我是故事的一部分。' 你决定记录下今天的心情。";
      }
    },

    // ====== B→A: 市场故事数据 ======
    {
      id: "b620_market_story_data", phase: "street", _isChainEvent: false, icon: "📈",
      title: "市场故事",
      story: "你从一件小事中发现了市场的规律——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 10, excludeFlags: ["_b620MarketStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b620MarketStoryCooldown) return false;
        return true;
      },
      choices: [
        { text: "📊 记录数据规律", hint: "智力+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b620MarketStoryCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '原来市场的规律就在这些日常小事里。' 你学到了宝贵的一课。智力+4,心智+2。", "success");
        }},
        { text: "💰 运用规律小赚一笔", hint: "收益¥300-800,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b620MarketStoryCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          var earn = 300 + Random.int(0, 500);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + earn;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你运用发现的规律,做了一笔小买卖,赚了¥" + earn.toLocaleString() + "。'知识就是财富!' 智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你注意到小区门口的水果摊,每天傍晚都会打折。'原来卖水果也有规律。' 你开始思考:生活中还有哪些隐藏的市场规律?";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
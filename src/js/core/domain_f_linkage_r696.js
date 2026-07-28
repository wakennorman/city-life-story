/**
 * 域F(UI/UX) 联动增强 R696
 * 桥接：
 *   F→A  f696_ui_price_trend_dash  价格趋势仪表盘 → 消费 state.trade.goodsPrices 数据,
 *     UI→价格趋势可视化展示
 *   F→G  f696_ui_life_rhythm       生活节奏UI → 消费 state.needs+state.player 数据,
 *     UI→生活节奏与作息可视化
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR696Loaded) return;
  RANDOM_EVENTS._domainFLinkageR696Loaded = true;

  var EVENTS = [
    {
      id: "f696_ui_price_trend_dash", phase: "street", _isChainEvent: false, icon: "📈",
      title: "价格趋势仪表盘",
      story: "你制作了一个价格趋势仪表盘,市场变化一目了然——{desc}",
      triggers: { minDay: 100, interval: 180, maxRepeats: 2, excludeFlags: ["_f696PriceTrendCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f696PriceTrendCooldown) return false;
        return st.trade && st.trade.goodsPrices;
      },
      choices: [
        { text: "📊 分析趋势", hint: "会计XP+5,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f696PriceTrendCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '趋势是市场的语言。' 你分析了价格趋势。会计XP+5,智力+3。", "success");
        }},
        { text: "🛒 抓住机会", hint: "销售XP+4,现金+1000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f696PriceTrendCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1000;
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛒 '抓住价格趋势,就是抓住机会。' 销售XP+4,现金+¥1000。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你制作了一个价格趋势仪表盘——'价格趋势仪表盘,市场变化一目了然。'";
      }
    },
    {
      id: "f696_ui_life_rhythm", phase: "street", _isChainEvent: false, icon: "🕰️",
      title: "生活节奏可视化",
      story: "你开始关注自己的生活节奏——{desc}",
      triggers: { minDay: 80, interval: 150, maxRepeats: 3, excludeFlags: ["_f696RhythmCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f696RhythmCooldown) return false;
        return st.player && (st.player.day || 0) >= 80;
      },
      choices: [
        { text: "📋 优化作息", hint: "心智+5,健康+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f696RhythmCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 '好的作息,是好的开始。' 心智+5,健康+3。", "success");
        }},
        { text: "📊 记录时间", hint: "管理XP+4,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f696RhythmCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '记录时间,就是管理人生。' 管理XP+4,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        return "你开始关注自己的生活节奏——'第" + day + "天,生活节奏可视化,让每一天都更有意义。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

/**
 * 域F(UI/UX) 联动增强 R704
 * 桥接：
 *   F→H  f704_corp_health_gauge     公司健康仪 → 消费 state.startup+state.corporate 数据,
 *     UI→公司健康度可视化仪表
 *   F→A  f704_price_heatmap          价格热力图 → 消费 state.trade.goodsPrices 数据,
 *     UI→商品价格热力图展示
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR704Loaded) return;
  RANDOM_EVENTS._domainFLinkageR704Loaded = true;

  var EVENTS = [
    {
      id: "f704_corp_health_gauge", phase: "corporate", _isChainEvent: false, icon: "❤️‍🔥",
      title: "公司健康度可视化",
      story: "你制作了一个公司健康度仪表盘——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_f704HealthGaugeDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f704HealthGaugeDone) return false;
        return st.startup && st.startup.company;
      },
      choices: [
        { text: "📊 全面体检", hint: "管理XP+7,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f704HealthGaugeDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 7); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '健康度可视化,问题早发现。' 管理XP+7,智力+3。", "success");
        }},
        { text: "🔧 针对性改善", hint: "心智+5,效率+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f704HealthGaugeDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.startup && st.startup.company) {
            st.startup.company.efficiency = Math.min(100, (st.startup.company.efficiency || 0) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔧 '针对性改善,效率提升。' 心智+5,公司效率+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你制作了一个公司健康度仪表盘——'公司健康度可视化,一目了然。'";
      }
    },
    {
      id: "f704_price_heatmap", phase: "street", _isChainEvent: false, icon: "🗺️",
      title: "商品价格热力图",
      story: "你把各地的价格数据做成了热力图——{desc}",
      triggers: { minDay: 100, interval: 180, maxRepeats: 2, excludeFlags: ["_f704HeatmapCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f704HeatmapCooldown) return false;
        return st.trade && st.trade.goodsPrices;
      },
      choices: [
        { text: "📈 分析热力图", hint: "会计XP+5,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f704HeatmapCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '热力图揭示市场真相。' 会计XP+5,智力+3。", "success");
        }},
        { text: "🛒 按图索骥", hint: "销售XP+4,现金+1200", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f704HeatmapCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1200;
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛒 '按图索骥,精准交易。' 销售XP+4,现金+¥1200。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你把各地的价格数据做成了热力图——'商品价格热力图,商机一目了然。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

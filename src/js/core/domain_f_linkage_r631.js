/**
 * 域F(UI/UX) 联动增强 R631
 * 桥接：
 *   F→B  f631_ui_event_timeline  UI事件时间线 → 消费 state.flags+state.player 数据,
 *     UI→"事件可视化时间线"的叙事回响
 *   F→A  f631_ui_price_tracker  UI价格追踪 → 消费 state.resources 数据,
 *     UI→"价格变动可视化追踪"的数值回响
 *   F→H  f631_ui_company_dashboard  UI公司仪表盘 → 消费 state.startup 数据,
 *     UI→"公司运营数据可视化"的公司回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR631Loaded) return;
  RANDOM_EVENTS._domainFLinkageR631Loaded = true;

  var EVENTS = [
    // ====== F→B: UI事件时间线 ======
    {
      id: "f631_ui_event_timeline", phase: "street", _isChainEvent: false, icon: "📅",
      title: "时间线",
      story: "你打开手机,看到一张照片让你想起了过去——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 8, excludeFlags: ["_f631EventTimelineCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f631EventTimelineCooldown) return false;
        return true;
      },
      choices: [
        { text: "📖 回忆那段时光", hint: "心情+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f631EventTimelineCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📅 '那时候虽然苦,但真的很充实。' 你看着照片,嘴角泛起微笑。心情+5,心智+2。", "success");
        }},
        { text: "🗑️ 清理旧照片", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f631EventTimelineCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📅 你清理了手机里的旧照片和文件。'该放下的就放下,轻装前行。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var day = st.player.day || 0;
        return "手机弹出"第" + day + "天回忆"——你第一天来到这座城市的照片。'时间过得真快,已经在这里生活了这么久。' 你感慨万千。";
      }
    },

    // ====== F→A: UI价格追踪 ======
    {
      id: "f631_ui_price_tracker", phase: "street", _isChainEvent: false, icon: "🏷️",
      title: "价格追踪",
      story: "你注意到最近有些商品的价格波动很大——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 10, excludeFlags: ["_f631PriceTrackerCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f631PriceTrackerCooldown) return false;
        return true;
      },
      choices: [
        { text: "📊 记录价格走势", hint: "智力+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f631PriceTrackerCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏷️ 你开始记录各种商品的价格波动。'掌握了价格的规律,就掌握了省钱的门道。' 智力+4,心智+2。", "success");
        }},
        { text: "💰 趁低价囤货", hint: "现金-500,省下未来开支", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f631PriceTrackerCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          if (st.flags) st.flags._bulkPurchase = (st.flags._bulkPurchase || 0) + 1;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏷️ '趁便宜多囤点,省得以后涨价心疼。' 你买了一些日用品囤着。现金-500。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你注意到鸡蛋的价格从¥5涨到了¥8,猪肉也从¥25涨到了¥35。'最近物价涨得厉害,得精打细算过日子了。'";
      }
    },

    // ====== F→H: UI公司仪表盘 ======
    {
      id: "f631_ui_company_dashboard", phase: "corporate", _isChainEvent: false, icon: "📋",
      title: "公司看板",
      story: "你打开公司运营看板,查看各项数据——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 8, excludeFlags: ["_f631CompanyDashboardCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f631CompanyDashboardCooldown) return false;
        return st.startup && st.startup.company;
      },
      choices: [
        { text: "📈 分析运营数据", hint: "智力+5,公司效率+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f631CompanyDashboardCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.startup && st.startup.company) {
            st.startup.company.efficiency = Math.min(100, (st.startup.company.efficiency || 50) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 你仔细分析了公司的各项数据。'数据会说话,关键是要听懂。' 智力+5,公司效率+5。", "success");
        }},
        { text: "📊 制定下季度目标", hint: "心智+5,公司士气+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f631CompanyDashboardCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.startup && st.startup.company) {
            st.startup.company.morale = Math.min(100, (st.startup.company.morale || 50) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 '有了清晰的目标,团队才有方向。' 你制定了明确的季度OKR。心智+5,团队士气+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.startup || !st.startup.company) return null;
        var val = st.startup.company.valuation || 0;
        var rev = st.startup.company.revenue || 0;
        return "公司看板显示:估值¥" + val.toLocaleString() + ",月收入¥" + rev.toLocaleString() + "。'数据是公司健康的晴雨表,该认真看看了。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
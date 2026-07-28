/**
 * 域H(Phase2/公司) 联动增强 R665
 * 桥接：
 *   H→A  h665_company_data_insight  公司数据洞察 → 消费 state.startup 数据,
 *     公司→"运营数据驱动决策"的数值回响
 *   H→D  h665_team_social_events  团队社交活动 → 消费 state.corporate+state.relationships 数据,
 *     公司→"团队即社交圈"的社交回响
 *   H→B  h665_company_legend  公司传奇 → 消费 state.startup 数据,
 *     公司→"公司发展历程中的故事"的叙事回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR665Loaded) return;
  RANDOM_EVENTS._domainHLinkageR665Loaded = true;

  var EVENTS = [
    // ====== H→A: 公司数据洞察 ======
    {
      id: "h665_company_data_insight", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "数据洞察",
      story: "你仔细分析了公司的各项运营数据——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 8, excludeFlags: ["_h665DataInsightCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h665DataInsightCooldown) return false;
        return st.startup && st.startup.company && (st.startup.company.valuation || 0) >= 50000;
      },
      choices: [
        { text: "📈 优化业务方向", hint: "公司效率+10,智力+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h665DataInsightCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.startup && st.startup.company) {
            st.startup.company.efficiency = Math.min(100, (st.startup.company.efficiency || 50) + 10);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据告诉我们,这个方向是对的!' 你根据数据调整了业务策略。公司效率+10,智力+5,心智+3。", "success");
        }},
        { text: "📉 裁撤亏损业务", hint: "公司利润+15%,心智+5,现金-2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h665DataInsightCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.startup && st.startup.company) {
            st.startup.company.valuation = Math.round((st.startup.company.valuation || 0) * 1.15);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '壮士断腕,该砍的就得砍。' 你裁撤了亏损业务,公司财务状况好转。公司利润+15%,心智+5,现金-2000。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.startup || !st.startup.company) return null;
        var val = st.startup.company.valuation || 0;
        var eff = st.startup.company.efficiency || 0;
        return "公司估值¥" + val.toLocaleString() + ",运营效率" + eff + "%。'数据不会说谎,每个数字背后都是一个决策。' 你开始认真研究这些数据。";
      }
    },

    // ====== H→D: 团队社交活动 ======
    {
      id: "h665_team_social_events", phase: "corporate", _isChainEvent: false, icon: "🎳",
      title: "团队社交",
      story: "同事们提议下班后一起活动——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 10, excludeFlags: ["_h665TeamSocialCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h665TeamSocialCooldown) return false;
        return st.corporate && st.corporate.colleagues && st.corporate.colleagues.length >= 2;
      },
      choices: [
        { text: "🎮 一起去玩桌游", hint: "团队关系+8,心情+10,现金-800", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h665TeamSocialCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 800);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          if (st.corporate && st.corporate.colleagues) {
            for (var ci = 0; ci < st.corporate.colleagues.length; ci++) {
              if (st.corporate.colleagues[ci]) {
                st.corporate.colleagues[ci].relationship = Math.min(100, (st.corporate.colleagues[ci].relationship || 50) + 8);
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎳 '哈哈哈,你又输了!' 桌游之夜让大家笑成一团。团队关系+8,心情+10,现金-800。", "success");
        }},
        { text: "🍻 一起聚餐", hint: "团队关系+5,心情+8,现金-1500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h665TeamSocialCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1500);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.corporate && st.corporate.colleagues) {
            for (var ci = 0; ci < st.corporate.colleagues.length; ci++) {
              if (st.corporate.colleagues[ci]) {
                st.corporate.colleagues[ci].relationship = Math.min(100, (st.corporate.colleagues[ci].relationship || 50) + 5);
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍻 '老板,敬您一杯!' 聚餐让大家的关系更近了。团队关系+5,心情+8,现金-1500。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "下班后,同事们聚在一起讨论:'要不咱们今晚一起去玩?' 你看着这些平时一起奋斗的伙伴,觉得是该好好放松一下了。";
      }
    },

    // ====== H→B: 公司传奇 ======
    {
      id: "h665_company_legend", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司传奇",
      story: "你的公司在行业里已经有了一些传奇故事——{desc}",
      triggers: { minDay: 80, interval: 180, maxRepeats: 3, excludeFlags: ["_h665CompanyLegendCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h665CompanyLegendCooldown) return false;
        return st.startup && st.startup.company && (st.startup.company.valuation || 0) >= 200000;
      },
      choices: [
        { text: "📰 接受采访", hint: "名气+10,公司声誉+10,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h665CompanyLegendCooldown = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.startup && st.startup.company) {
            st.startup.company.reputation = Math.min(100, (st.startup.company.reputation || 50) + 10);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 你接受了行业媒体的采访,分享了创业故事。'从0到¥" + ((st.startup && st.startup.company && st.startup.company.valuation) || 0).toLocaleString() + ",我们只用了不到一年。' 名气+10,公司声誉+10,心智+3。", "success");
        }},
        { text: "📝 写进公司文化", hint: "团队士气+10,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h665CompanyLegendCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.startup && st.startup.company) {
            st.startup.company.morale = Math.min(100, (st.startup.company.morale || 50) + 10);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 你把公司的传奇故事写进了新员工培训手册。'每个新人都要知道,我们是怎么走到今天的。' 团队士气+10,心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.startup || !st.startup.company) return null;
        var name = st.startup.company.name || "你的公司";
        var val = st.startup.company.valuation || 0;
        return name + "的估值已经达到¥" + val.toLocaleString() + "。行业里开始流传你的创业故事。'那家小公司,居然做到了。' 你听着这些议论,心中百感交集。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
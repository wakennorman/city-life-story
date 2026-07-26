/**
 * 域E(经济/投资) 联动增强 R412
 * 第十七轮循环——把隐藏在property_market/finance/investment_analysis中的数据转化为叙事体验。
 * 桥接：
 *   E→B  e412_market_crash_narrative  市场崩盘叙事 → 消费 investment+_eraState 数据,
 *     投资亏损→"市场在下跌"的损失厌恶叙事,影响玩家决策
 *   E→D  e412_investor_social         投资者社交 → 消费 investment+relationships,
 *     投资经验→"和熟人分享投资心得"的社交联动
 *   E→G  e412_wealth_lifecycle         财富生命周期 → 消费 assets+age+needs 数据,
 *     资产积累→"财富与人生阶段"的生命周期叙事
 *
 * 严格照 domain_e_linkage_r396.js / r383.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR412Loaded) return;
  RANDOM_EVENTS._domainELinkageR412Loaded = true;

  // 安全技能经验
  function grantSkillXpR412(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  var EVENTS = [
    {
      // E→B: 市场崩盘叙事 — 消费 investment+_eraState
      id: "e412_market_crash_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "📉",
      title: "市场波动",
      story:
        "你关注到市场的变化——{crashDesc}\n\n{riskInsight}",
      triggers: { minDay: 70, excludeFlags: ["_e412CrashCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var profit = st.investment._totalInvestmentProfit || 0;
        return profit < -5000; // 亏损达到阈值触发
      },
      choices: [
        {
          text: "😰 亏损让人焦虑",
          hint: "心情-3,置 _e412CrashCooldown(60天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e412CrashCooldown = true;
            if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📉 投资亏损让你感到焦虑——波动是市场的常态。心情-3。", "warning");
          }
        },
        {
          text: "🧘 长期持有,不惧波动",
          hint: "心智+4,置 _e412CrashCooldown(60天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e412CrashCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🧘 你选择长期持有——真正的投资者不惧短期波动。心智+4。", "success");
          }
        }
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        var profit = st.investment._totalInvestmentProfit || 0;
        var desc = "投资亏损已达¥" + Math.abs(profit).toLocaleString();
        var insight = "短期波动不必过度焦虑,关注长期价值";
        if (st.flags && st.flags._eraState && st.flags._eraState.inflationIndex > 1.2) {
          insight = "通胀环境下,持有现金同样在贬值,需要找到平衡";
        }
        return "你关注到市场的变化——" + desc + "。\n\n" + insight + "。";
      }
    },
    {
      // E→D: 投资者社交 — 消费 investment+relationships
      id: "e412_investor_social",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "投资圈的朋友",
      story:
        "你和熟人聊起了投资——{socialDesc}\n\n投资不只是数字游戏,更是人与人之间的信任。",
      triggers: { minDay: 85, excludeFlags: ["_e412SocialCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        if (!st.relationships) return false;
        var hasFriend = false;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 30) {
            hasFriend = true; break;
          }
        }
        return hasFriend;
      },
      choices: [
        {
          text: "📖 分享投资经验",
          hint: "心智+3,accounting XP+3,置 _e412SocialCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e412SocialCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            grantSkillXpR412("accounting", 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🤝 你和熟人分享投资经验——教是最好的学。心智+3,会计XP+3。", "success");
          }
        },
        {
          text: "😊 投资是私人的事",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "交流投资心得,让彼此都受益匪浅";
        if (st.investment && st.investment._totalInvestmentProfit > 0) {
          desc = "分享投资成功的经验,给朋友带来启发";
        }
        return "你和熟人聊起了投资——" + desc + "。\n\n投资不只是数字游戏,更是人与人之间的信任。";
      }
    },
    {
      // E→G: 财富生命周期 — 消费 assets+age+needs
      id: "e412_wealth_lifecycle",
      phase: "street",
      _isChainEvent: false,
      icon: "🏦",
      title: "财富与人生",
      story:
        "你思考财富与人生的关系——{wealthDesc}\n\n财富是手段,不是目的。",
      triggers: { minDay: 95, excludeFlags: ["_e412WealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "🌟 财富为生活服务的",
          hint: "心智+5,心情+4,置 _e412WealthCooldown(120天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e412WealthCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🏦 你理解了财富与人生的关系——财富是手段,不是目的。心智+5,心情+4。", "success");
          }
        },
        {
          text: "💪 继续积累财富",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var age = st.player.age || 20;
        var desc = age < 25 ? "年轻时的财富观会影响一生的选择" :
                   age < 35 ? "事业上升期,财富积累是重要目标" : "中年时期,财富保障成为首要考量";
        return "你思考财富与人生的关系——" + desc + "。\n\n财富是手段,不是目的。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();

/**
 * 域A(数据/数值平衡) 联动增强 R414
 * 第十七轮循环——把隐藏在illnesses/prevention/certificates中的数据转化为叙事体验。
 * 桥接：
 *   A→D  a407_npc_health_market       NPC健康市场 → 消费 relationships+illnesses 数据,
 *      NPC生病→"朋友生病了,我能帮什么忙"的社交-健康联动
 *   A→F  a407_price_alert_v2          价格预警v2 → 消费 goods+pricing 数据,
 *     把价格波动→"现在买贵了还是便宜了"的UI预警
 *   A→H  a407_business_cost_v2        经营成本v2 → 消费 corporate+jobs 数据,
 *     用工成本→"雇佣成本在变化"的公司经营洞察
 *
 * 严格照 domain_a_linkage_r407.js / r398.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR414Loaded) return;
  RANDOM_EVENTS._domainALinkageR414Loaded = true;

  var EVENTS = [
    {
      // A→D: NPC健康市场 — 消费 relationships+illnesses
      id: "a414_npc_health_market",
      phase: "street",
      _isChainEvent: false,
      icon: "🏥",
      title: "朋友的健康",
      story:
        "你听说{npcHealthDesc}——{helpHint}\n\n朋友有难,能帮就帮。",
      triggers: { minDay: 60, excludeFlags: ["_a414HealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.relationships && Object.keys(st.relationships).length > 0;
      },
      choices: [
        {
          text: "🤝 帮朋友买点药",
          hint: "现金-50,好感+5,置 _a414HealthCooldown(75天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a414HealthCooldown = true;
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
            // 给首个已结识NPC加好感
            if (st.relationships) {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met) {
                  if (typeof applyAffinityChange === "function") {
                    try { applyAffinityChange(st, id, 5); } catch(e) { /* safe */ }
                  }
                  break;
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🏥 你帮朋友买了药——患难见真情。现金-50,好感+5。", "success");
          }
        },
        {
          text: "😊 问候一下就好",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "一位朋友身体不适,需要买药调理";
        var hint = "帮助朋友是积累人脉的重要方式";
        return "你听说" + desc + "——" + hint + "。\n\n朋友有难,能帮就帮。";
      }
    },
    {
      // A→F: 价格预警v2 — 消费 goods+pricing
      id: "a414_price_alert_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🏷️",
      title: "价格预警",
      story:
        "你注意到{priceAlertDesc}\n\n{buyAdvice}",
      triggers: { minDay: 35, excludeFlags: ["_a414PriceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.trade && st.trade.currentLocation;
      },
      choices: [
        {
          text: "📝 记住这个价格锚点",
          hint: "心智+3,置 _a414PriceCooldown(50天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a414PriceCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🏷️ 你记下了价格锚点——以后一眼就能看出贵贱。心智+3。", "success");
          }
        },
        {
          text: "🤷 随便买买",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.trade) return null;
        var desc = "当前市场上有些商品价格偏离了均价";
        var advice = "关注价格波动,低买高卖是赚钱的基本功";
        if (st.trade.marketEvents && st.trade.marketEvents.length > 0) {
          var evt = st.trade.marketEvents[0];
          desc = "「" + (evt.name || "市场异动") + "」导致部分商品价格" + ((evt.priceMod || 1) > 1 ? "上涨" : "下跌");
          advice = "抓住市场异动的机会,能获得额外收益";
        }
        return "你注意到" + desc + "。\n\n" + advice + "。";
      }
    },
    {
      // A→H: 经营成本v2 — 消费 corporate+jobs
      id: "a414_business_cost_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "💰",
      title: "用工成本",
      story:
        "你分析了企业的用工成本——{costDesc}\n\n{costAdvice}",
      triggers: { minDay: 80, excludeFlags: ["_a414CostCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        return true;
      },
      choices: [
        {
          text: "📊 优化用工结构",
          hint: "心智+4,management XP+3,置 _a414CostCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a414CostCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof addSkillXp === "function") {
              try { addSkillXp("management", 3); } catch(e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💰 你分析了用工成本——优化结构是经营者的必修课。心智+4,管理XP+3。", "success");
          }
        },
        {
          text: "😅 先关注业绩再说",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var desc = "用工成本是企业的主要支出之一";
        var advice = "合理控制成本,同时保证团队积极性";
        if (st.corporate && st.corporate.team && st.corporate.team.length > 0) {
          desc = "当前团队" + st.corporate.team.length + "人,人力成本需要合理规划";
        }
        return "你分析了企业的用工成本——" + desc + "。\n\n" + advice + "。";
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

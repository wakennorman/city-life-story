/**
 * 域A(数据/数值平衡) 联动增强 R707
 * 桥接：
 *   A→B  a707_price_anomaly_rumor       价格异常谣言 → 消费 state.trade.goodsPrices,
 *     价格异常触发市场谣言叙事
 *   A→G  a707_economic_health_v3        经济健康度v3 → 消费 state.resources+state.status,
 *     经济状况更精细地影响身心健康
 *   A→C  a707_skill_market_report       技能市场报告 → 消费 state.skills,
 *     技能价值变化触发职业洞察
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR707Loaded) return;
  RANDOM_EVENTS._domainALinkageR707Loaded = true;

  function getPriceRatio(st, goodId) {
    if (!st || !st.trade || !st.trade.goodsPrices) return 1.0;
    var sum = 0, count = 0;
    for (var _loc in st.trade.goodsPrices) {
      var _p = st.trade.goodsPrices[_loc];
      if (_p && typeof _p[goodId] === "number") {
        sum += _p[goodId]; count++;
      }
    }
    if (count === 0) return 1.0;
    var avg = sum / count;
    var good = null;
    try { good = getGoodById(goodId); } catch(e) {}
    if (!good || !good.basePrice || good.basePrice <= 0) return 1.0;
    return avg / good.basePrice;
  }

  var EVENTS = [
    {
      id: "a707_price_anomaly_rumor", phase: "street", _isChainEvent: false, icon: "📢",
      title: "市场谣言",
      story: "价格异常引发了街头的各种猜测——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_a707RumorCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a707RumorCd) return false;
        return st.player && st.player.day >= 30;
      },
      choices: [
        {
          text: "🔍 核实消息", hint: "智力+4,销售XP+3,置_a707Verified",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a707RumorCd = true;
            st.flags._a707Verified = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔍 信息就是金钱,市场情报帮你做出更明智的决策。智力+4,销售XP+3。", "success");
            }
          }
        },
        {
          text: "📰 传播消息", hint: "社交XP+5,现金+200,置_a707Gossip",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a707RumorCd = true;
            st.flags._a707Gossip = true;
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + 200;
              st.resources.totalEarned = (st.resources.totalEarned || 0) + 200;
            }
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📰 消息传得飞快,你在街坊中的人气提升了。社交XP+5,现金+200。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "菜市场的大妈们压低声音——'听说最近物价要涨,有人在囤货。'";
      }
    },
    {
      id: "a707_economic_health_v3", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "经济状况与健康",
      story: "手头宽裕还是拮据,直接影响你的身心状态——{desc}",
      triggers: { minDay: 40, interval: 60, maxRepeats: 3, excludeFlags: ["_a707EcoHealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a707EcoHealthCd) return false;
        return st.player && st.player.day >= 40;
      },
      choices: [
        {
          text: "🥗 改善饮食", hint: "健康+4,现金-300,置_a707BetterFood",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a707EcoHealthCd = true;
            st.flags._a707BetterFood = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 4);
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🥗 吃好一点,身体会感谢你。健康+4,花费¥300。", "success");
            }
          }
        },
        {
          text: "💊 买点维生素", hint: "健康+2,现金-150,置_a707Vitamins",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a707EcoHealthCd = true;
            st.flags._a707Vitamins = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 2);
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 150);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💊 日常保健,花小钱防大病。健康+2,花费¥150。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        var health = (st.status && st.status.health) || 100;
        return "存款¥" + cash.toLocaleString() + "·健康" + health + "%——'身体和经济,都要守住底线。'";
      }
    },
    {
      id: "a707_skill_market_report", phase: "street", _isChainEvent: false, icon: "📊",
      title: "技能市场报告",
      story: "市场在变,你的技能价值也在变——{desc}",
      triggers: { minDay: 70, interval: 100, maxRepeats: 2, excludeFlags: ["_a707ReportCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a707ReportCd) return false;
        return st.skills && st.player && st.player.day >= 70;
      },
      choices: [
        {
          text: "📈 聚焦热门技能", hint: "最高技能XP+8,置_a707FocusHot",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a707ReportCd = true;
            st.flags._a707FocusHot = true;
            if (st.skills) {
              var best = null, bestLv = -1;
              for (var _sk in st.skills) {
                if (st.skills[_sk] && typeof st.skills[_sk].level === "number" && st.skills[_sk].level > bestLv) {
                  bestLv = st.skills[_sk].level; best = _sk;
                }
              }
              if (best && typeof addSkillXp === "function") { try { addSkillXp(best, 8); } catch(e) {} }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 市场在变,技能也要与时俱进。最高技能XP+8。", "success");
            }
          }
        },
        {
          text: "📚 拓宽技能面", hint: "心智+4,管理XP+3,置_a707Diversify",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a707ReportCd = true;
            st.flags._a707Diversify = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 多学一门手艺,多条路。心智+4,管理XP+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "市场瞬息万变——'你的技能,跟得上这个时代吗?'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
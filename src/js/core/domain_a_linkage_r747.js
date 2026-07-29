/**
 * 域A(数据/数值平衡) 联动增强 R747 (第六轮循环)
 * 桥接：
 *   A→B  a747_market_whisper_v8      市场低语v8 → 消费 state.trade,
 *     价格波动持续影响市井叙事
 *   A→G  a747_economic_wellbeing_v5   经济幸福感v5 → 消费 state.resources+state.status,
 *     经济状况更精细地影响身心健康
 *   A→C  a747_skill_premium_v5        技能溢价v5 → 消费 state.skills,
 *     技能价值变化持续触发职业洞察
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR747Loaded) return;
  RANDOM_EVENTS._domainALinkageR747Loaded = true;

  var EVENTS = [
    {
      id: "a747_market_whisper_v8", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "市场低语",
      story: "价格波动总能引起街坊热议——{desc}",
      triggers: { minDay: 30, interval: 80, maxRepeats: 3, excludeFlags: ["_a747WhisperCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a747WhisperCd) return false;
        return st.player && st.player.day >= 30;
      },
      choices: [
        {
          text: "📊 记录价格规律", hint: "销售XP+5,智力+2,置_a747Tracker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a747WhisperCd = true;
            st.flags._a747Tracker = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 市场的声音,藏着最真实的情报。销售XP+5,智力+2。", "success");
            }
          }
        },
        {
          text: "🛒 趁机买卖", hint: "销售XP+4,现金+400,置_a747Trader",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a747WhisperCd = true;
            st.flags._a747Trader = true;
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + 400;
              st.resources.totalEarned = (st.resources.totalEarned || 0) + 400;
            }
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🛒 信息就是金钱,赚¥400!销售XP+4。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "菜市场里,大妈们又在议论价格——'懂得听市场的人,不会饿着。'";
      }
    },
    {
      id: "a747_economic_wellbeing_v5", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "经济与健康",
      story: "手头宽裕与否,直接影响身心状态——{desc}",
      triggers: { minDay: 40, interval: 60, maxRepeats: 3, excludeFlags: ["_a747HealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a747HealthCd) return false;
        return st.player && st.player.day >= 40;
      },
      choices: [
        {
          text: "🥗 改善饮食", hint: "健康+4,现金-300,置_a747BetterFood",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a747HealthCd = true;
            st.flags._a747BetterFood = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 4);
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🥗 吃好一点,身体会感谢你。健康+4,花费¥300。", "success");
            }
          }
        },
        {
          text: "💊 买点维生素", hint: "健康+2,现金-150,置_a747Vitamins",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a747HealthCd = true;
            st.flags._a747Vitamins = true;
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
      id: "a747_skill_premium_v5", phase: "street", _isChainEvent: false, icon: "📈",
      title: "技能溢价",
      story: "市场在变,你的技能价值也在变——{desc}",
      triggers: { minDay: 70, interval: 100, maxRepeats: 2, excludeFlags: ["_a747SkillCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a747SkillCd) return false;
        return st.skills && st.player && st.player.day >= 70;
      },
      choices: [
        {
          text: "📈 聚焦热门技能", hint: "最高技能XP+8,置_a747FocusHot",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a747SkillCd = true;
            st.flags._a747FocusHot = true;
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
              StateManager.addMessage("📈 市场需要什么,就学什么。最高技能XP+8。", "success");
            }
          }
        },
        {
          text: "📚 拓宽技能面", hint: "心智+4,管理XP+3,置_a747Diversify",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a747SkillCd = true;
            st.flags._a747Diversify = true;
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
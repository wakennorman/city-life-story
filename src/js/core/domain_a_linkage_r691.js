/**
 * 域A(数据/数值平衡) 联动增强 R691
 * 桥接：
 *   A→B  a691_price_narrative_v2      价格叙事v2 → 消费 state.trade+state.flags,
 *     价格波动成为市井故事
 *   A→C  a691_skill_value_market      技能价值市场 → 消费 state.skills,
 *     技能等级与市场定价
 *   A→G  a691_economic_health         经济健康度 → 消费 state.resources+state.needs,
 *     经济状况影响生活质量
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR691Loaded) return;
  RANDOM_EVENTS._domainALinkageR691Loaded = true;

  function topSkill(st) {
    if (!st || !st.skills) return null;
    var best = null, bestLv = -1;
    for (var k in st.skills) {
      var s = st.skills[k];
      if (s && typeof s.level === "number" && s.level > bestLv) {
        bestLv = s.level; best = k;
      }
    }
    return best;
  }

  var EVENTS = [
    {
      id: "a691_price_narrative_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "价格里的故事",
      story: "每一次价格波动都有原因",
      triggers: { minDay: 70, interval: 90, maxRepeats: 3, excludeFlags: ["_a691PriceCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a691PriceCd) return false;
        return st.player && st.player.day >= 70;
      },
      choices: [
        {
          text: "🔍 探究背后原因",
          hint: "智力+4,销售XP+4,置_a691Detective",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a691PriceCd = true;
            st.flags._a691Detective = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔍 价格背后是供需,供需背后是人性。智力+4,销售XP+4。", "success");
            }
          }
        },
        {
          text: "📊 记录价格走势",
          hint: "会计XP+5,置_a691Tracker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a691PriceCd = true;
            st.flags._a691Tracker = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据是发现规律的眼睛。会计XP+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "菜市场的价格又变了——'每一次涨跌,都是供需博弈的故事。'";
      }
    },
    {
      id: "a691_skill_value_market",
      phase: "street",
      _isChainEvent: false,
      icon: "💎",
      title: "技能的市场定价",
      story: "你的技能在市场上值多少钱",
      triggers: { minDay: 80, interval: 100, maxRepeats: 2, excludeFlags: ["_a691SkillCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a691SkillCd) return false;
        return topSkill(st) && st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "💰 技能变现",
          hint: "销售XP+6,现金+600,置_a691Monetize",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a691SkillCd = true;
            st.flags._a691Monetize = true;
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + 600;
              st.resources.totalEarned = (st.resources.totalEarned || 0) + 600;
            }
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 技能变现,收入¥600!销售XP+6。", "success");
            }
          }
        },
        {
          text: "📚 继续投资自己",
          hint: "心智+5,置_a691Invest",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a691SkillCd = true;
            st.flags._a691Invest = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 最好的投资是自己。心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "技能'" + (topSkill(st) || "无") + "'等级提升——'这门手艺,在市场上到底值多少?'";
      }
    },
    {
      id: "a691_economic_health",
      phase: "street",
      _isChainEvent: false,
      icon: "❤️",
      title: "经济与健康",
      story: "钱不是全部,健康才是",
      triggers: { minDay: 60, interval: 80, maxRepeats: 3, excludeFlags: ["_a691HealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a691HealthCd) return false;
        return st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "🏥 花钱体检",
          hint: "健康+5,心智+3,置_a691Checkup",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a691HealthCd = true;
            st.flags._a691Checkup = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏥 身体是革命的本钱,体检花¥500值了。健康+5,心智+3。", "success");
            }
          }
        },
        {
          text: "😴 好好休息",
          hint: "健康+3,心情+6,置_a691Rest",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a691HealthCd = true;
            st.flags._a691Rest = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 休息好,一切都好。健康+3,心情+6。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        return "存款¥" + cash + ",健康多少分?'——'钱赚不完,但身体会先垮。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

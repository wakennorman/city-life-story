/**
 * 域A(数据/数值平衡) 联动增强 R699
 * 桥接：
 *   A→B  a699_market_whisper          市场低语 → 消费 state.trade,
 *     价格波动成为市井谣言
 *   A→C  a699_skill_price_index       技能价格指数 → 消费 state.skills,
 *     技能等级与市场定价指数
 *   A→G  a699_economic_health_v2       经济健康度v2 → 消费 state.resources+state.status,
 *     经济状况影响身心健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR699Loaded) return;
  RANDOM_EVENTS._domainALinkageR699Loaded = true;

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
      id: "a699_market_whisper",
      phase: "street",
      _isChainEvent: false,
      icon: "🗣️",
      title: "市场低语",
      story: "菜市场的价格波动成了街坊闲聊的话题",
      triggers: { minDay: 60, interval: 80, maxRepeats: 3, excludeFlags: ["_a699WhisperCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a699WhisperCd) return false;
        return st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "📊 记录价格规律",
          hint: "销售XP+5,智力+2,置_a699Tracker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a699WhisperCd = true;
            st.flags._a699Tracker = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 大妈的情报网,比新闻还准。销售XP+5,智力+2。", "success");
            }
          }
        },
        {
          text: "🛒 趁机低买高卖",
          hint: "销售XP+4,现金+400,置_a699Arbitrage",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a699WhisperCd = true;
            st.flags._a699Arbitrage = true;
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
        return "菜市场的大妈们又在聊价格了——'猪肉要涨,蔬菜要跌,这是信号。'";
      }
    },
    {
      id: "a699_skill_price_index",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "技能价格指数",
      story: "你的技能在市场上值多少钱",
      triggers: { minDay: 80, interval: 100, maxRepeats: 2, excludeFlags: ["_a699PriceCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a699PriceCd) return false;
        return topSkill(st) && st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "💰 技能变现",
          hint: "销售XP+6,现金+700,置_a699Monetize",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a699PriceCd = true;
            st.flags._a699Monetize = true;
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + 700;
              st.resources.totalEarned = (st.resources.totalEarned || 0) + 700;
            }
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 技能变现,收入¥700!销售XP+6。", "success");
            }
          }
        },
        {
          text: "📚 继续深造",
          hint: "心智+5,置_a699Study",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a699PriceCd = true;
            st.flags._a699Study = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 磨刀不误砍柴工。心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "技能'" + (topSkill(st) || "无") + "'等级提升——'这门手艺,在市场上越来越值钱了。'";
      }
    },
    {
      id: "a699_economic_health_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "❤️",
      title: "经济与健康",
      story: "钱不是全部,健康才是",
      triggers: { minDay: 50, interval: 70, maxRepeats: 3, excludeFlags: ["_a699HealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._a699HealthCd) return false;
        return st.player && st.player.day >= 50;
      },
      choices: [
        {
          text: "🏥 花钱体检",
          hint: "健康+5,心智+3,置_a699Checkup",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a699HealthCd = true;
            st.flags._a699Checkup = true;
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
          hint: "健康+3,心情+6,置_a699Rest",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a699HealthCd = true;
            st.flags._a699Rest = true;
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
        return "存款¥" + cash + "——'钱赚不完,但身体会先垮。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

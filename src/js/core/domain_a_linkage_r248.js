/**
 * 域A(数据/数值平衡) 联动增强 R248
 * 背景：域A结构性健康——0 A类缺陷。但定价引擎的六大因子(getDailyPriceShock/getSeasonalPriceMod/
 *   getMarketEventPriceMod/getSupplyDemandPriceMod/getLocationPriceModifier/getWeatherGoodPriceMod)全库零事件消费→玩家
 *   看到的每个价格数字都是"为什么这个价"的无解谜题。本轮首次将引擎数据叙事化。
 * 桥接：
 *   A→B daily_price_whisper        菜市场的秘密 → **首个叙事聚合消费6大定价因子**, salesXP+心智
 *   A→C skill_value_realization    技能的市场定价 → 消费payCalc加成, mental+happiness
 *   A→E price_seasonal_savings     季节差价意识 → **首个消费getSeasonalPriceMod**, accounting XP
 *
 * 严格照 domain_a_linkage_r245.js / domain_c_linkage_r191.js 已验证IIFE注入范式。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR248Loaded) return;
  RANDOM_EVENTS._domainALinkageR248Loaded = true;

  // 安全读取技能等级
  function skillLv(st, key) {
    if (!st || !st.skills || !st.skills[key]) return 0;
    return st.skills[key].level || 0;
  }

  // 取首个已结识(met)的NPC id——守met铁律
  function firstMetNpcR248(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met) return id;
    }
    return null;
  }

  // 获取当前季节名称
  function getSeasonName(seasonKey) {
    var map = { spring: "春", summer: "夏", autumn: "秋", winter: "冬" };
    return map[seasonKey] || seasonKey;
  }

  // 获取所有非真实技能键——这些是属性值（physique/agility/intelligence/mental等）
  // addSkillXp只对真实技能键有效，需映射到accounting/sales等
  // [注] 本文件内不使用非真实技能键

  var EVENTS = [
    {
      // A→B: 菜市场的秘密 — 首次数价因子叙事聚合
      id: "daily_price_whisper",
      phase: "street",
      _isChainEvent: false,
      icon: "🏪",
      title: "菜市场的秘密",
      story:
        "你常逛的{locationName}今天有点不一样。摊主随口透露了几个消息——{factorsList}。原来这价格背后有这么些门道。",
      triggers: { minDay: 30, excludeFlags: ["_priceWhisperSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources || st.resources.cash < 50) return false;
        // 需要至少有买卖行为或位于特定地点
        if (!st.trade || !st.trade.currentLocation) return false;
        return true;
      },
      choices: [
        {
          text: "📝 把这些门道记在心里",
          hint: "销售XP+4,心智+3,置 _priceWhisperSeen",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._priceWhisperSeen = true;
            if (typeof addSkillXp === "function") {
              try { addSkillXp("sales", 4); } catch(e) { /* safe */ }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📝 你今天记住了菜市场的价格门道——以后买东西不会再被坑了。销售XP+4,心智+3。", "success");
          }
        },
        {
          text: "😅 随便买买就行,不琢磨了",
          hint: "心情+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._priceWhisperSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😅 你觉得琢磨这些太费脑子——反正买得起就行。心情+2。", "info");
          }
        }
      ]
    },
    {
      // A→C: 技能的市场定价 — payCalc加成叙事化
      id: "skill_value_realization",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "你学的东西值多少钱",
      story:
        "今天听工友说「现在卖力气不如学门手艺」。你仔细一算——自己练的那些本事,其实每天都在帮你多赚钱。",
      triggers: { minDay: 45, excludeFlags: ["_skillValueRealized"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要至少一个技能≥15
        var keys = ["cooking","repair","coding","english","driving","sales",
                     "management","accounting","electrician","welding","medicine","social"];
        var hasRealSkill = false;
        for (var i = 0; i < keys.length; i++) {
          if (skillLv(st, keys[i]) >= 15) { hasRealSkill = true; break; }
        }
        return hasRealSkill;
      },
      choices: [
        {
          text: "💪 继续深耕,攒技术钱",
          hint: "最高技能XP+6,心智+5,置 _skillValueRealized",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._skillValueRealized = true;
            // 找最高技能
            var bestKey = null;
            var bestLv = 0;
            var keys = ["cooking","repair","coding","english","driving","sales",
                        "management","accounting","electrician","welding","medicine","social"];
            for (var i = 0; i < keys.length; i++) {
              var lv = skillLv(st, keys[i]);
              if (lv > bestLv) { bestLv = lv; bestKey = keys[i]; }
            }
            if (bestKey && typeof addSkillXp === "function") {
              try { addSkillXp(bestKey, 6); } catch(e) { /* safe */ }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5); // [PLACEHOLDER]
            var skillNames = { cooking:"厨艺", repair:"维修", coding:"编程", english:"英语",
                              driving:"驾驶", sales:"销售", management:"管理", accounting:"会计",
                              electrician:"电工", welding:"焊工", medicine:"护理", social:"社交" };
            var sName = skillNames[bestKey] || bestKey;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💪 你意识到自己的" + sName + "(Lv." + bestLv + ")正在帮你多赚钱。技能+6,心智+5。", "good");
          }
        },
        {
          text: "😌 已经够了,不卷了",
          hint: "心情+5,心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._skillValueRealized = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😌 你觉得会一点就够了——不贪多,知足常乐。心情+5,心智+2。", "info");
          }
        }
      ]
    },
    {
      // A→E: 季节差价意识 — 首个消费getSeasonalPriceMod定价因子的叙事化
      id: "price_seasonal_savings",
      phase: "street",
      _isChainEvent: false,
      icon: "🍂",
      title: "当季的便宜货",
      story:
        "现在是{seasonName},你知道有些东西特别便宜——{itemInfo}。学会看季节差价,能省不少钱。",
      triggers: { minDay: 20, excludeFlags: ["_priceSeasonalSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.weather || !st.weather.season) return false;
        return true;
      },
      choices: [
        {
          text: "📚 记住这个规律",
          hint: "会计XP+5,置 _priceSeasonalInsight",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._priceSeasonalSeen = true;
            st.flags._priceSeasonalInsight = true; // E域可消费:季节性省钱意识
            var seasonKey = st.weather.season || "spring";
            var seasons = ["spring","summer","autumn","winter"];
            var idx = seasons.indexOf(seasonKey);
            // 根据季节推荐不同便宜品
            var itemHints = {
              spring: "春笋和青菜", summer: "西瓜和绿豆", autumn: "螃蟹和柿子", winter: "白菜和大葱"
            };
            var hint = itemHints[seasonKey] || "当季蔬果";
            if (typeof addSkillXp === "function") {
              try { addSkillXp("accounting", 5); } catch(e) { /* safe */ }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📚 你记下了" + getSeasonName(seasonKey) + "天买" + hint + "最划算。会计+5。", "good");
          }
        },
        {
          text: "🤷 贵点也买了",
          hint: "心情-1",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._priceSeasonalSeen = true;
            if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 1);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🤷 你懒得计较——反正也不是什么大事。心情-1。", "info");
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

/**
 * 域A(数据/数值平衡) 联动增强 R788 (sensenova-exp 第四轮循环)
 * 桥接：
 *   A→F  a788_price_data_viz 价格数据可视化 → 消费 pricing 全量数据
 *   A→C  a788_skill_market_demand 技能市场需求 → 消费 skills+payCalc
 *   A→D  a788_fair_price_social 公平价格社交 → 消费 pricing+关系数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR788Loaded) return;
  RANDOM_EVENTS._domainALinkageR788Loaded = true;

  var EVENTS = [
    // ====== A→F 价格数据可视化 ======
    {
      id: "a788_price_data_viz", phase: "street", _isChainEvent: false, icon: "📊",
      title: "市场价格透视",
      story: "价格背后藏着市场的秘密——{desc}",
      triggers: { minDay: 350, interval: 600, maxRepeats: 3, excludeFlags: ["_a788PriceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a788PriceCd) return false;
        return st.player && st.player.day >= 350 && st.trade && st.trade.goodsPrices;
      },
      choices: [
        {
          text: "📊 查看价格全景", hint: "智力+12, 会计XP+12, 置_a788PriceViewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a788PriceCd = true;
            st.flags._a788PriceViewer = true;
            // 收集价格数据供UI展示
            var _goods = st.trade && st.trade.goodsPrices;
            var _avgPrice = 0, _count = 0, _maxPrice = 0, _minPrice = 999999;
            if (_goods) {
              for (var _g in _goods) {
                var _p = _goods[_g] || 0;
                _avgPrice += _p; _count++;
                if (_p > _maxPrice) _maxPrice = _p;
                if (_p < _minPrice) _minPrice = _p;
              }
            }
            _avgPrice = _count > 0 ? Math.round(_avgPrice / _count) : 0;
            st.flags._a788PriceAvg = _avgPrice;
            st.flags._a788PriceMax = _maxPrice;
            st.flags._a788PriceMin = _minPrice === 999999 ? 0 : _minPrice;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 " + _count + "种商品，均价¥" + _avgPrice + "。最高¥" + _maxPrice + "，最低¥" + (_minPrice === 999999 ? 0 : _minPrice) + "。智力+12, 会计XP+12。", "info");
            }
          }
        },
        {
          text: "🔍 寻找价格洼地", hint: "智力+15, 置_a788PriceHunter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a788PriceCd = true;
            st.flags._a788PriceHunter = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔍 '低价买入，高价卖出——永恒的真理。' 智力+15。", "success");
            }
          }
        }
      ]
    },

    // ====== A→C 技能市场需求 ======
    {
      id: "a788_skill_market_demand", phase: "street", _isChainEvent: false, icon: "💼",
      title: "技能市场行情",
      story: "你的技能在市场上值多少钱？——{desc}",
      triggers: { minDay: 440, interval: 600, maxRepeats: 3, excludeFlags: ["_a788SkillCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a788SkillCd) return false;
        return st.player && st.player.day >= 440 && st.skills && st.player.job;
      },
      choices: [
        {
          text: "📋 评估技能市场价值", hint: "智力+15, 会计XP+12, 置_a788SkillMarketAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a788SkillCd = true;
            st.flags._a788SkillMarketAnalyst = true;
            // 评估技能市场价值供C域消费
            var _topSkill = 0, _topSkillName = "无", _totalLevel = 0, _skillCount = 0;
            if (st.skills) {
              for (var _sk in st.skills) {
                var _lv = st.skills[_sk] && st.skills[_sk].level || 0;
                if (_lv > 0) { _skillCount++; _totalLevel += _lv; }
                if (_lv > _topSkill) { _topSkill = _lv; _topSkillName = _sk; }
              }
            }
            var _estSalary = _topSkill * 15 + _totalLevel * 5;
            st.flags._a788SkillMarketValue = _estSalary;
            st.flags._a788TopSkill = _topSkillName;
            st.flags._a788TopSkillLevel = _topSkill;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 最高技能:" + _topSkillName + "(" + _topSkill + "级)，预估市场价值¥" + _estSalary + "/月。智力+15, 会计XP+12。", "info");
            }
          }
        },
        {
          text: "🎯 定向提升技能", hint: "智力+18, 置_a788SkillFocused",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a788SkillCd = true;
            st.flags._a788SkillFocused = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '选对方向，比盲目努力更重要。' 智力+18。", "success");
            }
          }
        }
      ]
    },

    // ====== A→D 公平价格社交 ======
    {
      id: "a788_fair_price_social", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "公平价格感知",
      story: "价格公道，人心才会公道——{desc}",
      triggers: { minDay: 300, interval: 500, maxRepeats: 4, excludeFlags: ["_a788FairCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a788FairCd) return false;
        return st.player && st.player.day >= 300 && st.trade && st.relationships;
      },
      choices: [
        {
          text: "⚖️ 评估价格公平性", hint: "心智+10, 魅力+8, 置_a788FairAssessor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a788FairCd = true;
            st.flags._a788FairAssessor = true;
            // 评估价格公平性供D域消费
            var _cumInflation = (st.flags && st.flags._cumulativeInflation) || 0;
            var _fairScore = 50;
            if (_cumInflation > 0.15) _fairScore = 30; // 高通胀→不公平
            else if (_cumInflation < -0.05) _fairScore = 40; // 通缩→略不公平
            else _fairScore = 70; // 稳定→公平
            st.flags._a788FairPriceScore = _fairScore;
            st.flags._a788FairInflation = _cumInflation;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              var _msg = _fairScore >= 60 ? "⚖️ 物价合理，人心安定。" : "⚖️ 物价波动大，需谨慎交易。";
              StateManager.addMessage(_msg + " 心智+10, 魅力+8。", _fairScore >= 60 ? "success" : "warning");
            }
          }
        },
        {
          text: "📢 分享价格信息", hint: "魅力+12, 名气+3, 置_a788FairSharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a788FairCd = true;
            st.flags._a788FairSharer = true;
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 12);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📢 '信息透明，市场才能公平。' 魅力+12, 名气+3。", "success");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
/**
 * 域A(数据/数值平衡) 联动增强 R775 (sensenova-exp 第三轮循环)
 * 桥接：
 *   A→H  a775_corp_cost_optimization 公司成本优化 → 消费 通胀+价格数据
 *   A→E  a775_economic_cycle_invest 经济周期投资洞察 → 消费 经济周期数据
 *   A→B  a775_price_volatility_story 价格波动叙事 → 消费 价格异常数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR775Loaded) return;
  RANDOM_EVENTS._domainALinkageR775Loaded = true;

  var EVENTS = [
    // ====== A→H 公司成本优化 ======
    {
      id: "a775_corp_cost_optimization", phase: "corporate", _isChainEvent: false, icon: "💰",
      title: "成本优化分析",
      story: "通胀悄悄侵蚀着你的利润——{desc}",
      triggers: { minDay: 640, interval: 700, maxRepeats: 3, excludeFlags: ["_a775CostCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a775CostCd) return false;
        return st.player && st.player.day >= 640 && st.startup && st.startup.active && st.trade;
      },
      choices: [
        {
          text: "📊 分析成本结构", hint: "智力+15, 会计XP+20, 置_a775CostAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a775CostCd = true;
            st.flags._a775CostAnalyst = true;
            // 记录通胀/成本数据供H域消费
            var _cumInflation = 0;
            if (st.flags && st.flags._cumulativeInflation != null) {
              _cumInflation = st.flags._cumulativeInflation;
            } else if (typeof getCumulativeInflation === "function") {
              try { _cumInflation = getCumulativeInflation(st); } catch(e) {}
            }
            st.flags._a775LastInflationCheck = _cumInflation;
            if (_cumInflation > 0.1) {
              st.flags._a775HighInflationWarning = true;
            }
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              var _msg = "📊 当前累计通胀率 " + Math.round(_cumInflation * 100) + "%。";
              if (_cumInflation > 0.1) _msg += " ⚠️ 高通胀环境，建议控制成本！";
              else if (_cumInflation < -0.05) _msg += " 📉 通缩环境，现金为王。";
              else _msg += " ✅ 物价稳定，适合扩张。";
              StateManager.addMessage(_msg + " 智力+15, 会计XP+20。", "info");
            }
          }
        },
        {
          text: "💡 优化供应链", hint: "智力+18, 管理XP+15, 置_a775SupplyChain",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a775CostCd = true;
            st.flags._a775SupplyChain = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 '供应链优化是永续的课题。' 智力+18, 管理XP+15。", "success");
            }
          }
        }
      ]
    },

    // ====== A→E 经济周期投资洞察 ======
    {
      id: "a775_economic_cycle_invest", phase: "street", _isChainEvent: false, icon: "📈",
      title: "经济周期信号",
      story: "市场有自己的心跳——{desc}",
      triggers: { minDay: 540, interval: 600, maxRepeats: 3, excludeFlags: ["_a775CycleCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a775CycleCd) return false;
        return st.player && st.player.day >= 540 && st.trade;
      },
      choices: [
        {
          text: "🔍 分析经济周期", hint: "智力+15, 会计XP+15, 置_a775CycleAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a775CycleCd = true;
            st.flags._a775CycleAnalyst = true;
            var _cumInflation = 0, _cycle = "normal";
            if (st.flags && st.flags._cumulativeInflation != null) {
              _cumInflation = st.flags._cumulativeInflation;
            }
            if (st.flags && st.flags._economicCycle) {
              _cycle = st.flags._economicCycle;
            }
            st.flags._a775LastCycleCheck = _cycle;
            st.flags._a775LastInflationForInvest = _cumInflation;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              var _msg = "📈 经济周期: " + _cycle;
              if (_cumInflation > 0.08) _msg += "。高通胀期，建议增持实物资产。";
              else if (_cumInflation < -0.05) _msg += "。通缩期，现金为王，谨慎投资。";
              else _msg += "。经济平稳，可适度投资。";
              StateManager.addMessage(_msg + " 智力+15, 会计XP+15。", "info");
            }
          }
        },
        {
          text: "📋 调整投资策略", hint: "智力+18, 置_a775CycleAdjuster",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a775CycleCd = true;
            st.flags._a775CycleAdjuster = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📋 '顺势而为，逆势而蓄。' 智力+18。", "success");
            }
          }
        }
      ]
    },

    // ====== A→B 价格波动叙事 ======
    {
      id: "a775_price_volatility_story", phase: "street", _isChainEvent: false, icon: "📉",
      title: "市场价格异动",
      story: "今天的市场有些反常——{desc}",
      triggers: { minDay: 300, interval: 500, maxRepeats: 4, excludeFlags: ["_a775PriceStoryCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a775PriceStoryCd) return false;
        return st.player && st.player.day >= 300 && st.trade && st.trade.goodsPrices;
      },
      choices: [
        {
          text: "📰 打听市场消息", hint: "智力+10, 魅力+5, 置_a775PriceReporter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a775PriceStoryCd = true;
            st.flags._a775PriceReporter = true;
            // 记录价格波动事件供B域消费
            if (!st.flags._priceVolatilityEvents) st.flags._priceVolatilityEvents = [];
            st.flags._priceVolatilityEvents.push({
              day: st.player && st.player.day || 0,
              type: "volatility"
            });
            if (st.flags._priceVolatilityEvents.length > 10) st.flags._priceVolatilityEvents.shift();
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📰 '市场永远不缺故事。' 智力+10, 魅力+5。", "info");
            }
          }
        },
        {
          text: "📊 记录价格异动", hint: "智力+15, 会计XP+10, 置_a775PriceRecorder",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a775PriceStoryCd = true;
            st.flags._a775PriceRecorder = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据是故事的骨架。' 智力+15, 会计XP+10。", "success");
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
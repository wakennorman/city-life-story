/**
 * 域E(经济/投资) 联动增强 R453
 * 三个"写入但零叙事消费"字段的首次叙事消费：
 *   E→G  e453_property_phase_transition — 消费 propertyMarketPhase，房产阶段叙事
 *   E→G  e453_btc_halving_anniversary  — 消费 btcHalvingDay，减半周年纪念
 *   E→G  e453_profit_milestone        — 消费 _totalInvestmentProfit，盈利里程碑
 *
 * 严格遵循 IIFE 注入范式，全 || 防御，[PLACEHOLDER] 数值标记。
 * Commit: R453 E-Domain Linkage Enhancement
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainERelayLinkageR453Loaded) return;
  RANDOM_EVENTS._domainERelayLinkageR453Loaded = true;

  function grantSkillXp(key, amt) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amt); } catch (e) {}
    }
  }

  function safeMsg(text, tone) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      try { StateManager.addMessage(text, tone || "info"); } catch (e) {}
    }
  }

  var EVENTS = [
    {
      // E→G: 房产市场阶段叙事 — 首个叙事消费 propertyMarketPhase
      // propertyMarketPhase 此前仅用于价格计算和简单消息，无完整叙事事件
      id: "e453_property_phase_transition",
      phase: "street",
      _isChainEvent: false,
      icon: "🏠",
      title: "房产市场的时节",
      story: "你看着房产行情，房价涨跌和市场阶段的潮起潮落，让你想起老辈人的话：买卖房产，七分看天时。",
      triggers: { minDay: 60, excludeFlags: ["_e453PhaseTransitionSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        var inv = st.investment;
        if (!inv) return false;
        var phase = inv.propertyMarketPhase;
        if (typeof phase !== "string") return false;
        return ["boom", "stable", "cooling", "bust"].includes(phase);
      },
      choices: [
        {
          text: "📈 趁火热赶紧加仓",
          hint: "冒险: 现金-5000, 房产+1套(预期)",
          apply: function (st) {
            if (!st) return;
            st.flags._e453PhaseTransitionSeen = true;
            if (st.resources && (st.resources.cash || 0) >= 5000) {
              st.resources.cash -= 5000;
              safeMsg("📈 你咬牙加仓了一套房产，希望借着热度赚更多。现金-5000。", "warning");
            } else {
              safeMsg("📈 你想加仓但现金不足，只能观望。", "info");
            }
          }
        },
        {
          text: "🤐 持币观望",
          hint: "稳健: 无变动",
          apply: function (st) {
            if (!st) return;
            st.flags._e453PhaseTransitionSeen = true;
            safeMsg("🤐 你选择持币观望，不想在市场过热时冒险。", "info");
          }
        },
        {
          text: "📉 逢高卖出套现",
          hint: "落袋: 现金+3000, 房产-1套",
          apply: function (st) {
            if (!st) return;
            st.flags._e453PhaseTransitionSeen = true;
            if (st.investment && st.investment.properties && st.investment.properties.length > 0) {
              st.resources.cash = (st.resources.cash || 0) + 3000;
              safeMsg("📉 你卖了一套房产落袋为安，现金+3000。", "success");
            } else {
              safeMsg("📉 你没有房产可卖，只能放弃。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        var phase = st.investment.propertyMarketPhase || "stable";
        var phaseName = {
          boom: "火爆",
          stable: "平稳",
          cooling: "降温",
          bust: "萧条"
        }[phase] || "平稳";
        return "房产市场当前处于" + phaseName + "阶段。你看着手中的房产，心里有了些主意。";
      }
    },
    {
      // E→G: 比特币减半周年纪念 — 首个叙事消费 btcHalvingDay
      // btcHalvingDay 此前仅在 UI 中显示，无叙事事件
      id: "e453_btc_halving_anniversary",
      phase: "street",
      _isChainEvent: false,
      icon: "⛓️",
      title: "比特币减半纪念日",
      story: "今天是比特币减半的纪念日。群里有人在狂欢，有人在回忆上一次减半时的行情。你握着手里的BTC，忽然意识到这个数字背后，是密码学共识的壮丽实验。",
      triggers: { minDay: 100, excludeFlags: ["_e453HalvingSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        var inv = st.investment;
        if (!inv) return false;
        if (!inv.btcHalvingDay) return false;
        var halvingDay = inv.btcHalvingDay;
        // 判断是否接近减半纪念日（±3天内）
        var dayDiff = Math.abs(st.player.day - halvingDay);
        return dayDiff <= 3;
      },
      choices: [
        {
          text: "🎉 在群里发个庆祝消息",
          hint: "名气+5, 心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags._e453HalvingSeen = true;
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            }
            safeMsg("🎉 你在群里发了条庆祝减半的消息，获得了一些点赞和关注。名气+5, 心情+3。", "success");
          }
        },
        {
          text: "📚 研究减半的历史数据",
          hint: "会计XP+5, 心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags._e453HalvingSeen = true;
            grantSkillXp("accounting", 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            safeMsg("📚 你研究了历史上几次减半的数据，发现了些规律。会计经验+5, 心智+3。", "info");
          }
        },
        {
          text: "🤷 静静看着",
          hint: "无",
          apply: function (st) {
            if (!st) return;
            st.flags._e453HalvingSeen = true;
            safeMsg("🤷 你默默看着减半纪念日，什么也没做。", "info");
          }
        }
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        var halvingDay = st.investment.btcHalvingDay || 0;
        var daysDiff = Math.abs(st.player.day - halvingDay);
        return "今天是比特币减半的纪念日（距离上次减半还有" + daysDiff + "天）。群里气氛不错，有人兴奋，有人沉思。";
      }
    },
    {
      // E→G: 投资盈利里程碑 — 首个叙事消费 _totalInvestmentProfit
      // _totalInvestmentProfit 此前仅在 UI 和内部计算中使用，无叙事里程碑事件
      id: "e453_profit_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "投资盈利里程碑",
      story: "你翻看着投资账户的总盈利数字，一个里程碑悄然达成。这不是简单的数字增长，而是你财务人生的一个重要节点。",
      triggers: { minDay: 50, excludeFlags: ["_e453ProfitMilestoneSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        var inv = st.investment;
        if (!inv) return false;
        var profit = inv._totalInvestmentProfit || 0;
        return profit >= 10000; // 至少盈利1万元
      },
      applyMilestone: function (st, profit) {
        st.flags._e453ProfitMilestoneSeen = true;
        var msg = "";
        if (profit >= 1000000) {
          msg = "🎉 你的投资总盈利突破¥100万！你已经成为真正的投资高手，财富自由的大门似乎就在眼前。";
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
          grantSkillXp("accounting", 10);
        } else if (profit >= 500000) {
          msg = "🎉 你的投资总盈利突破¥50万！这可不是小数目，你的投资能力已经得到了市场的认可。";
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          grantSkillXp("accounting", 8);
        } else if (profit >= 100000) {
          msg = "🎉 你的投资总盈利突破¥10万！从最初的懵懂到如今的盈利，你完成了投资之路的第一次飞跃。";
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          grantSkillXp("accounting", 5);
        } else if (profit >= 10000) {
          msg = "🎉 你的投资总盈利突破¥1万！第一桶金终于赚到了，这是你投资生涯的重要里程碑。";
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          grantSkillXp("accounting", 3);
        }
        safeMsg(msg, "success");
      },
      choices: [
        {
          text: "📊 继续投资",
          hint: "再赚一笔",
          apply: function (st) {
            if (!st) return;
            st.flags._e453ProfitMilestoneSeen = true;
            safeMsg("📊 你决定继续投资，让盈利滚雪球。", "info");
          }
        },
        {
          text: "🎉 庆祝一下",
          hint: "现金+5000, 心情+10",
          apply: function (st) {
            if (!st) return;
            st.flags._e453ProfitMilestoneSeen = true;
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + 5000;
              if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            }
            safeMsg("🎉 你给自己放了个大假，庆祝里程碑达成。现金+5000, 心情+10。", "success");
          }
        },
        {
          text: "💰 转入银行",
          hint: "银行理财+盈利额",
          apply: function (st) {
            if (!st) return;
            st.flags._e453ProfitMilestoneSeen = true;
            var profit = st.investment._totalInvestmentProfit || 0;
            if (st.resources && st.resources.bankBalance) {
              st.resources.bankBalance = (st.resources.bankBalance || 0) + profit;
              st.resources.cash = (st.resources.cash || 0) - profit;
            }
            safeMsg("💰 你把盈利转入银行理财，开始让钱继续睡得更安全。", "info");
          }
        }
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        var profit = st.investment._totalInvestmentProfit || 0;
        if (profit < 10000) return null;
        var milestoneText = "";
        if (profit >= 1000000) milestoneText = "百万元盈利里程碑";
        else if (profit >= 500000) milestoneText = "五十万元盈利里程碑";
        else if (profit >= 100000) milestoneText = "十万元盈利里程碑";
        else if (profit >= 10000) milestoneText = "万元盈利里程碑";
        return "你的投资总盈利已经达到¥" + profit.toLocaleString() + "，触发了" + milestoneText + "。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS (id 去重防御)
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (!RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) {
      RANDOM_EVENTS.push(_e);
    }
  }
})();

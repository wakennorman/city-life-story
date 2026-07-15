/**
 * 内幕交易事件 — 接入 state.insiderTrading 子系统
 *
 * 设计意图：state.js 中的 insiderTrading { activeRumor, rumorHistory,
 * tradeLog, audits, currentPenalty } 字段目前**没有任何随机事件读取或写入**。
 * "风声"——股票内幕信息的道德抉择——是整个游戏最具道德张力的空白系统。
 *
 * 本文件用 5 个事件填补：
 *   1. rumor_stock_tip        — 同事透露某股即将大涨/大跌
 *   2. rumor_earnings_leak    — 财报泄密，开盘前做决策
 *   3. rumor_audit_suspicion  — 交易异常被标记调查
 *   4. rumor_pump_dumpp       — 有人拉你入伙"内幕群"
 *   5. rumor_insider_network  — 建立稳定消息渠道
 *
 * 接入方式：与 cross_system_events.js 相同的 IIFE 注入模式
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._insiderTradingEventsLoaded) return;
  RANDOM_EVENTS._insiderTradingEventsLoaded = true;

  var INSIDER_EVENTS = [
    // ===== 事件1：风声——同事透露股票消息（内幕交易道德抉择）=====
    // 联动：insiderTrading.activeRumor + investment + 道德 + 股票持仓
    {
      id: "rumor_stock_tip",
      phase: "street",
      icon: "🤫",
      title: "深夜一条语音",
      story:
        "凌晨1点，手机亮了。是一个做投行朋友发的语音，声音压得极低：「明天某科技股开盘前会有个大消息……你看着办，我什么都没说。」\\n\\n你没有回复。翻开了股票账户，盯着那几只熟悉的代码。",
      // [conditions→triggers]
      triggers: {
        minDay: 60,
        excludeFlags: ["_stockTipActive"],
      },
      conditions: function (st) {
        if (
          !st.investment ||
          !st.investment.stockHoldings ||
          st.investment.stockHoldings.length === 0
        )
          return false;
        return Random.chance(0.025);
      },
      probability: 0.03,
      repeatable: true,
      choices: [
        {
          text: "📈 连夜买入相关股票",
          hint: "可能大赚，也可能被反查",
          apply: function (st) {
            st.flags._stockTipActive = true;
            // 随机选一只科技股买入
            var techSymbols = [
              "ALIM",
              "TENC",
              "BAID",
              "JD",
              "PDD",
              "XIAO",
              "MEIT",
              "BYTE",
            ];
            var sym = techSymbols[Random.int(0, techSymbols.length - 1)];
            var m = st.investment.stockMarket[sym];
            if (!m) {
              sym = "ALIM";
              m = st.investment.stockMarket[sym];
            }
            var buyAmount = Math.min(5000, st.resources.cash);
            if (buyAmount <= 100) {
              StateManager.addMessage(
                "📈 你想追风口，但手里现金太少，只买了" +
                  sym +
                  " ¥100做记录。道德-3。",
                "info",
              );
              st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
              st.investment.stockHoldings.push({
                symbol: sym,
                shares: 0.1,
                avgPrice: m.price,
              });
              return;
            }
            var shares = Math.floor(buyAmount / m.price);
            st.resources.cash -= shares * m.price; // [全系统自洽修复] 域B: 用实际成交价而非buyAmount(避免多扣款)
            var h = st.investment.stockHoldings.find(function (s) {
              return s.symbol === sym;
            });
            if (h) {
              h.shares += shares;
            } else {
              st.investment.stockHoldings.push({
                symbol: sym,
                shares: shares,
                avgPrice: m.price,
              });
            }
            // 记录到内幕交易日志
            if (!st.insiderTrading) st.insiderTrading = {};
            if (!st.insiderTrading.tradeLog) st.insiderTrading.tradeLog = [];
            st.insiderTrading.tradeLog.push({
              day: st.player.day,
              symbol: sym,
              action: "buy",
              shares: shares,
              price: m.price,
              relatedRumorId: "rumor_stock_tip",
            });
            st.player.morality = Math.max(0, (st.player.morality || 50) - 5);
            StateManager.addMessage(
              "📈 你连夜买了" +
                sym +
                " " +
                shares +
                "股。如果消息是真的……道德-5。你明白自己在赌什么。",
              "warning",
            );
            // 第二天：随机结果（涨跌）
            setTimeout(function () {
              var profit = Random.chance(0.55);
              if (profit) {
                var gain = Random.int(800, 3000);
                st.resources.cash += gain;
                StateManager.addMessage(
                  "📈 第二天开盘，" +
                    sym +
                    "果然涨了！你果断出货，净赚¥" +
                    gain +
                    "。但心里五味杂陈。",
                  "success",
                );
              } else {
                var loss = Random.int(400, 2000);
                st.resources.cash = Math.max(0, st.resources.cash - loss);
                StateManager.addMessage(
                  "📉 消息是假的，" +
                    sym +
                    "开盘就跌。你亏了¥" +
                    loss +
                    "。消息靠不住，人心更靠不住。",
                  "warning",
                );
              }
              st.flags._stockTipActive = false;
            }, 100);
          },
        },
        {
          text: "📉 反向操作，清仓离场",
          hint: "避险，但可能错过机会",
          apply: function (st) {
            st.flags._stockTipActive = true;
            var soldTotal = 0;
            for (var i = st.investment.stockHoldings.length - 1; i >= 0; i--) {
              var h = st.investment.stockHoldings[i];
              var m = st.investment.stockMarket[h.symbol];
              if (!m) continue;
              var revenue = Math.round(m.price * h.shares * 100) / 100;
              st.resources.cash += revenue;
              soldTotal += revenue;
              st.investment.stockHoldings.splice(i, 1);
            }
            st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
            StateManager.addMessage(
              "📉 你清仓了所有股票，落袋为安。虽然可能错过机会，但睡得安稳。道德+2。",
              "info",
            );
            setTimeout(function () {
              st.flags._stockTipActive = false;
            }, 100);
          },
        },
        {
          text: "🚫 无视消息，按自己的节奏来",
          hint: "道德+5，但错失机会",
          apply: function (st) {
            st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
            StateManager.addMessage(
              "🚫 你把手机扣过去，继续刷自己的盘面。内幕消息不碰，自己挣的钱才踏实。道德+5。",
              "success",
            );
          },
        },
      ],
    },

    // ===== 事件2：财报泄密（提前知道某公司业绩）=====
    // 联动：insiderTrading.activeRumor + investment + 道德
    {
      id: "rumor_earnings_leak",
      phase: "street",
      icon: "📊",
      title: "一份没公开的财报",
      story:
        "你在一家咖啡馆等朋友，旁边坐着一个西装革履的中年人，低声讲电话：「……对，这次业绩比预期好了三倍，但还没公告……」\\n\\n你端着咖啡的手停住了。他说的代码你正好持有——是一家新能源公司。\\n\\n距离正式公告还有三天。",
      // [conditions→triggers]
      triggers: {
        minDay: 150,
        excludeFlags: ["_earningsLeakActive"],
      },
      conditions: function (st) {
        if (!st.investment || !st.investment.stockHoldings) return false;
        var hasRelevant = st.investment.stockHoldings.some(function (h) {
          return (
            ["TSLA", "BYD", "CATL", "NIO", "XPEV", "LI"].indexOf(h.symbol) >= 0
          );
        });
        return hasRelevant && Random.chance(0.015);
      },
      probability: 0.02,
      repeatable: true,
      choices: [
        {
          text: "💰 立刻加仓到顶",
          hint: "可能大赚，违法风险",
          apply: function (st) {
            st.flags._earningsLeakActive = true;
            var target = Random.fromArray(["BYD", "CATL", "NIO", "XPEV", "LI"]);
            var m = st.investment.stockMarket[target];
            if (!m) {
              StateManager.addMessage("⚠️ 目标股票不存在。", "warning");
              return;
            }
            var buyAmount = Math.min(
              8000,
              st.resources.cash * 0.5,
              st.resources.cash - 500,
            );
            if (buyAmount <= 100) {
              StateManager.addMessage("⚠️ 现金不足，无法加仓。", "warning");
              return;
            }
            var shares = Math.floor(buyAmount / m.price);
            st.resources.cash -= shares * m.price; // [全系统自洽修复] 域B: 用实际成交价而非buyAmount(避免多扣款)
            var h = st.investment.stockHoldings.find(function (s) {
              return s.symbol === target;
            });
            if (h) {
              h.shares += shares;
            } else {
              st.investment.stockHoldings.push({
                symbol: target,
                shares: shares,
                avgPrice: m.price,
              });
            }
            if (!st.insiderTrading) st.insiderTrading = {};
            if (!st.insiderTrading.tradeLog) st.insiderTrading.tradeLog = [];
            st.insiderTrading.tradeLog.push({
              day: st.player.day,
              symbol: target,
              action: "buy",
              shares: shares,
              price: m.price,
              relatedRumorId: "rumor_earnings_leak",
            });
            st.player.morality = Math.max(0, (st.player.morality || 50) - 8);
            StateManager.addMessage(
              "💰 你加仓了" +
                target +
                " " +
                shares +
                "股。如果财报是真的……道德-8。这笔钱来得不太干净。",
              "danger",
            );
            // 3天后回报
            setTimeout(function () {
              var success = Random.chance(0.6);
              if (success) {
                var gain = Random.int(2000, 8000);
                st.resources.cash += gain;
                StateManager.addMessage(
                  "💰 三天后公告出炉，" +
                    target +
                    "暴涨！你及时出货，净赚¥" +
                    gain +
                    "。钱是赚了，但每次花都觉得烫手。",
                  "success",
                );
              } else {
                var loss = Random.int(1000, 5000);
                st.resources.cash = Math.max(0, st.resources.cash - loss);
                StateManager.addMessage(
                  "💰 公告是利好，但你判断错方向亏了¥" +
                    loss +
                    "。偷鸡不成蚀把米。",
                  "warning",
                );
              }
              st.flags._earningsLeakActive = false;
            }, 100);
          },
        },
        {
          text: "🤐 假装什么都没听见",
          hint: "道德+3，保持初心",
          apply: function (st) {
            st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
            StateManager.addMessage(
              "🤐 你低头看手机，直到那人挂了电话。三天后公告出来，涨了15%。你没赚，但睡得香。道德+3。",
              "info",
            );
          },
        },
        {
          text: "📝 记下来但不动手，只观察",
          hint: "中性选择",
          apply: function (st) {
            if (!st.insiderTrading) st.insiderTrading = {};
            if (!st.insiderTrading.rumorHistory)
              st.insiderTrading.rumorHistory = [];
            st.insiderTrading.rumorHistory.push({
              day: st.player.day,
              source: "eavesdrop",
              symbol: "新能源",
              action: "none",
              note: "财报泄密但未操作",
            });
            StateManager.addMessage(
              "📝 你记下了这件事，但不打算行动。有些钱不是自己挣的。",
              "info",
            );
          },
        },
      ],
    },

    // ===== 事件3：交易异常被调查（监管审计风险）=====
    // 联动：insiderTrading.audits + currentPenalty + 投资持仓
    {
      id: "rumor_audit_suspicion",
      phase: "street",
      icon: "🔍",
      title: "一封匿名邮件",
      story:
        "电脑里收到一封没有发件人的邮件，标题只有两个字：「警告」。\\n\\n内容是一段你的交易记录截图——最近三天，你买入的三只股票在交易后全部大涨，买入时机精准得不像巧合。\\n\\n最后一行字：「我们知道你在玩什么。收手。」",
      // [conditions→triggers]
      triggers: {
        minDay: 200,
        excludeFlags: ["_auditWarned"],
      },
      conditions: function (st) {
        if (
          !st.insiderTrading ||
          !st.insiderTrading.tradeLog ||
          st.insiderTrading.tradeLog.length === 0
        )
          return false;
        return Random.chance(0.02);
      },
      probability: 0.02,
      repeatable: false,
      choices: [
        {
          text: "🛑 立即清仓所有股票",
          hint: "止损 + 自保",
          apply: function (st) {
            st.flags._auditWarned = true;
            var soldTotal = 0;
            for (var i = st.investment.stockHoldings.length - 1; i >= 0; i--) {
              var h = st.investment.stockHoldings[i];
              var m = st.investment.stockMarket[h.symbol];
              if (!m) continue;
              var revenue = Math.round(m.price * h.shares * 100) / 100;
              st.resources.cash += revenue;
              soldTotal += revenue;
              st.investment.stockHoldings.splice(i, 1);
            }
            StateManager.addMessage(
              "🛑 你当夜清仓了所有股票，共套现¥" +
                soldTotal +
                "。从今以后只赚看得见的钱。",
              "warning",
            );
          },
        },
        {
          text: "🔧 删掉邮件，继续操作",
          hint: "高风险高回报",
          apply: function (st) {
            st.player.morality = Math.max(0, (st.player.morality || 50) - 5);
            StateManager.addMessage(
              "🔧 你删了邮件，关掉窗口。下次操作会更小心一点……但还是会继续。道德-5。",
              "warning",
            );
          },
        },
        {
          text: "📧 回复邮件：我只是运气好",
          hint: "智勇双全，但不保证有用",
          apply: function (st) {
            if ((st.player.mental || 0) >= 40) {
              StateManager.addMessage(
                "📧 你回了一封措辞谨慎的邮件：「只是普通投资者而已。」之后再也没有收到回复。可能是碰巧，也可能对方相信了。",
                "info",
              );
            } else {
              st.flags._auditFlagged = true;
              if (!st.insiderTrading) st.insiderTrading = {};
              if (!st.insiderTrading.currentPenalty)
                st.insiderTrading.currentPenalty = {};
              st.insiderTrading.currentPenalty.tradingBanned = true;
              st.insiderTrading.currentPenalty.tradingBanEndDay =
                st.player.day + 60;
              StateManager.addMessage(
                "📧 你回复说自己只是运气好，但对方显然不信。一个月后收到通知——账户被限制交易。道德-3，交易冻结60天。",
                "danger",
              );
              st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
            }
          },
        },
      ],
    },

    // ===== 事件4：内幕群——有人拉你入群=====
    // 联动：insiderTrading.rumorHistory + 道德 + 投资经验
    {
      id: "rumor_pump_dumpp",
      phase: "street",
      icon: "🎣",
      title: "一个陌生人的好友申请",
      story:
        "微信弹出一条新的好友申请：「兄弟，我这里有独家消息群，每天推荐几只股，跟着赚。」\\n\\n你点了通过。对方立刻发了一个群链接，附言：「先交¥500进群费，群里有老师带路，一个月回本。」\\n\\n你看了看群简介：「XX投资交流群（仅限内部人士）」",
      // [conditions→triggers]
      triggers: {
        minDay: 100,
        excludeFlags: ["_joinedInsiderGroup"],
      },
      conditions: function (st) {
        return (
          st.investment &&
          st.investment.stockHoldings &&
          st.investment.stockHoldings.length > 0 &&
          Random.chance(0.015)
        );
      },
      probability: 0.02,
      repeatable: false,
      choices: [
        {
          text: "💰 交¥500入群试试",
          hint: "90%是骗局，10%可能赚点",
          apply: function (st) {
            st.flags._joinedInsiderGroup = true;
            st.resources.cash = Math.max(0, st.resources.cash - 500);
            if (Random.chance(0.1)) {
              // 10%幸运
              var gain = Random.int(200, 1000);
              st.resources.cash += gain;
              StateManager.addMessage(
                "💰 你交了¥500进群。没想到群里推荐的几只股真的涨了，你小赚¥" +
                  gain +
                  "。运气好是运气好，但这种运气不长久。",
                "info",
              );
            } else {
              StateManager.addMessage(
                "💰 你交了¥500进群。群里每天发一堆消息，推荐的股涨跌随机。一周后你发现——群主删了你，跑路了。¥500打了水漂。",
                "warning",
              );
            }
            st.player.morality = Math.max(0, (st.player.morality || 50) - 2);
          },
        },
        {
          text: "🚫 拒绝并拉黑",
          hint: "道德+2",
          apply: function (st) {
            st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
            StateManager.addMessage(
              "🚫 你拒绝了申请，拉黑了对方。有些钱想赚的人，通常不是想帮你赚钱。道德+2。",
              "info",
            );
          },
        },
        {
          text: "🤔 加好友但不交钱，先观望",
          hint: "安全但可能错过",
          apply: function (st) {
            StateManager.addMessage(
              "🤔 你通过了申请，但不交钱。对方发了几条消息推销，你沉默着不回复。三天后对方主动退群了。",
              "info",
            );
          },
        },
      ],
    },

    // ===== 事件5：建立稳定消息渠道（长期主义内幕交易）=====
    // 联动：insiderTrading.rumorHistory + 人脉 + 投资 + 道德
    {
      id: "rumor_insider_network",
      phase: "street",
      icon: "🕸️",
      title: "一个做金融的老同学",
      story:
        "初中同学群里突然热闹了。一个叫王浩的同学晒了张合照——背景是陆家嘴某栋写字楼。\\n\\n他私聊你：「好久不见了。我现在做投行，手上有些项目提前知道。我们可以合作——我提供信息，你负责操作。」\\n\\n「当然，有风险，也有规矩。分成按四六来。」",
      // [conditions→triggers]
      triggers: {
        minDay: 200,
        excludeFlags: ["_insiderNetwork"],
      },
      conditions: function (st) {
        if (
          !st.investment ||
          !st.investment.stockHoldings ||
          st.investment.stockHoldings.length === 0
        )
          return false;
        return (st.resources.totalEarned || 0) >= 20000 && Random.chance(0.01);
      },
      probability: 0.01,
      repeatable: false,
      choices: [
        {
          text: "🤝 合作，按四六分成",
          hint: "长期回报，道德-10",
          apply: function (st) {
            st.flags._insiderNetwork = true;
            st.player.morality = Math.max(0, (st.player.morality || 50) - 10);
            if (!st.insiderTrading) st.insiderTrading = {};
            st.insiderTrading.activeRumor = {
              id: "rumor_insider_network",
              confidence: 0.7,
              channels: "investor_banking",
              playerTraded: true,
              startedDay: st.player.day,
            };
            StateManager.addMessage(
              "🤝 你答应了合作。王浩发来第一份资料——一家即将重组的科技公司。道德-10。你知道自己正在走一条不归路。",
              "warning",
            );
            // 后续回报：20天后
            setTimeout(function () {
              var profit = Random.int(5000, 15000);
              st.resources.cash += profit;
              StateManager.addMessage(
                "🤝 一个月后，第一笔内幕交易落地——净赚¥" +
                  profit +
                  "。王浩拿到了他的四成。钱是干净的，路却不是。",
                "warning",
              );
            }, 100);
          },
        },
        {
          text: "🚫 拒绝：不做违法的事",
          hint: "道德+8",
          apply: function (st) {
            st.player.morality = Math.min(100, (st.player.morality || 50) + 8);
            StateManager.addMessage(
              "🚫 你拒绝了王浩。他说：「你想清楚了，这条路错过就没了。」你回答：「我走不了。」道德+8。",
              "success",
            );
          },
        },
        {
          text: "🤔 答应但只观看不操作",
          hint: "折中，道德-3",
          apply: function (st) {
            st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
            if (!st.insiderTrading) st.insiderTrading = {};
            if (!st.insiderTrading.rumorHistory)
              st.insiderTrading.rumorHistory = [];
            st.insiderTrading.rumorHistory.push({
              day: st.player.day,
              source: "classmate",
              symbol: "未知",
              action: "observe",
              note: "建立了消息渠道但未操作",
            });
            StateManager.addMessage(
              "🤔 你答应了合作，但声明只观看不操作。王浩没多问。道德-3。看和做，有时只差一步。",
              "info",
            );
          },
        },
      ],
    },
  ];

  // 注入到 RANDOM_EVENTS
  for (var i = 0; i < INSIDER_EVENTS.length; i++) {
    RANDOM_EVENTS.push(INSIDER_EVENTS[i]);
  }
})();

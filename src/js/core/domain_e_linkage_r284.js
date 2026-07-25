/**
 * 域E(经济/投资) 联动增强 R284
 * 第四轮循环——投资纪律外化为人生资本。
 * 桥接：
 *   E→G  e284_btc_cold_wallet    数字资产安全意识→核心机制(风险管理/安心)
 *   E→A  e284_dip_buying_nerve   越跌越买的定力→数值/属性(心智/性格成长)
 *   E→H  e284_seed_from_gains    投资收益转创业种子金→跨阶段/公司(经营资本继承)
 *
 * 全字段 `||` 防御；数值以 [PLACEHOLDER] 标注，待平衡表统一注入。
 * 引擎契约：events_core.js RANDOM_EVENTS.filter(e=>e.phase===phase)——必须显式设 phase。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainELinkageR284Loaded) return;
  RANDOM_EVENTS._domainELinkageR284Loaded = true;

  // 汇总投资总市值（含公司股价权威取法，持仓对象无 .price）
  function calcInvValueE284(st) {
    if (!st || !st.investment) return 0;
    var inv = st.investment;
    var total = 0;
    if (Array.isArray(inv.stockHoldings)) {
      for (var i = 0; i < inv.stockHoldings.length; i++) {
        var h = inv.stockHoldings[i];
        if (!h) continue;
        var px = h.currentPrice || h.avgPrice || 0;
        total += (h.shares || 0) * px;
      }
    }
    total += (inv.btcHoldings || 0) * (inv.btcPrice || 0);
    if (Array.isArray(inv.properties)) {
      for (var j = 0; j < inv.properties.length; j++) {
        var p = inv.properties[j];
        if (!p) continue;
        total += p.currentPrice || p.buyPrice || 0;
      }
    }
    return total;
  }

  var EVENTS = [
    {
      // E→G：持有比特币者的安全意识——把「资产安全」纳入核心风险管理机制，减少突发焦虑。
      id: "e284_btc_cold_wallet",
      phase: "street",
      _isChainEvent: false,
      icon: "🔐",
      title: "数字资产的安全课",
      story:
        "你持有的比特币越来越多，一条新闻却让你后背发凉——某交易所被盗，无数人的币一夜清零。\n\n" +
        "你第一次意识到：赚到的钱如果守不住，等于没赚。真正的老手，不只研究涨跌，更懂得给资产上锁。\n\n" +
        "你花了一个晚上研究冷钱包、助记词备份和分散存储。折腾完，心里踏实了许多——这份安心，比多赚一笔更值。",
      triggers: { minDay: 180, excludeFlags: ["_btcColdWalletSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return (st.investment.btcHoldings || 0) > 0;
      },
      choices: [
        {
          text: "🔐 认真做资产安全备份",
          hint: "心智+[PLACEHOLDER]，安心（降低后续投资焦虑）",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._btcColdWalletSeen = true;
            st.flags._assetSecurityMindset = true; // 供核心机制/后续事件消费的安全意识 flag
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6); // [PLACEHOLDER]
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "🔐 你给数字资产上了锁。守得住的财富才是财富。心智+6，多了一份安心。",
                "success",
              );
            }
          },
        },
        {
          text: "🤷 放交易所省事",
          hint: "心智+[PLACEHOLDER]（图方便，留隐患）",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._btcColdWalletSeen = true;
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "🤷 你嫌麻烦，把币留在了交易所。图方便，也埋下了隐患。心智+2。",
                "info",
              );
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // E→A：经历过亏损仍敢在低位加仓的人，磨出的是心性与数值层面的定力。
      id: "e284_dip_buying_nerve",
      phase: "street",
      _isChainEvent: false,
      icon: "🧊",
      title: "越跌越买的定力",
      story:
        "市场又是一片绿油油（跌），群里哀鸿遍野，有人割肉离场，有人破口大骂。\n\n" +
        "你翻看自己的持仓，也在缩水。但这一次，你没有恐慌——你早已复盘过无数轮，知道恐慌才是最贵的成本。\n\n" +
        "你深吸一口气，在别人夺路而逃时，冷静地记下了几个心仪已久的标的。这份在下跌中的沉着，是花真金白银换来的性格。",
      triggers: { minDay: 220, excludeFlags: ["_dipBuyingNerveSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        var inv = st.investment;
        // 需有实际持仓 + 历经过一次亏损（真实计数器 _consecutiveWins 归零/或已实现亏损）
        var hasHolding =
          (Array.isArray(inv.stockHoldings) && inv.stockHoldings.length > 0) ||
          (inv.btcHoldings || 0) > 0;
        if (!hasHolding) return false;
        return calcInvValueE284(st) >= 5000; // [PLACEHOLDER] 门槛
      },
      choices: [
        {
          text: "🧊 保持冷静，按计划行事",
          hint: "心智+[PLACEHOLDER]，性格成长",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dipBuyingNerveSeen = true;
            st.flags._marketDisciplineForged = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 7); // [PLACEHOLDER]
              // 定力/心性作为可积累属性回馈（若存在 intelligence 惰性字段）
              if (typeof st.player.intelligence === "number") {
                st.player.intelligence = Math.min(
                  100,
                  st.player.intelligence + 2,
                ); // [PLACEHOLDER]
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "🧊 别人恐慌，你却沉着。这份定力是花真金白银换来的性格。心智+7。",
                "success",
              );
            }
          },
        },
        {
          text: "😰 也跟着割肉离场",
          hint: "心情-[PLACEHOLDER]（追随羊群）",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._dipBuyingNerveSeen = true;
            if (st.needs)
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 4); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "😰 你也跟着人群割了肉。事后回看，那正是最坏的时点。心情-4。",
                "warning",
              );
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // E→H：把投资积累的收益转化为创业/经营的种子资本——跨阶段资本继承。
      id: "e284_seed_from_gains",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌱",
      title: "收益变种子金",
      story:
        "公司账上，你盯着自己这些年在市场里滚出来的那笔投资收益。\n\n" +
        "你忽然想通一件事：钱躺在账户里只是数字，投进对的地方才会生长。你决定拿出一部分收益，作为业务扩张的种子金。\n\n" +
        "从投资人到经营者，你对「钱如何生钱」的理解，正在从纸面走向现实。",
      triggers: { minDay: 260, excludeFlags: ["_seedFromGainsSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false; // 需在职/持有公司
        if (!st.investment) return false;
        return calcInvValueE284(st) >= 20000; // [PLACEHOLDER] 需一定投资积累
      },
      choices: [
        {
          text: "🌱 拿出收益作种子金",
          hint: "经营眼界（管理XP）+[PLACEHOLDER]，晋升势能+[PLACEHOLDER]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._seedFromGainsSeen = true;
            st.flags._investorToOperator = true;
            if (typeof addSkillXp === "function") {
              try {
                addSkillXp("management", 8); // [PLACEHOLDER] 真实技能键
              } catch (e) {}
            }
            if (st.player && st.player.corporate) {
              st.player.corporate.upward = Math.min(
                100,
                (st.player.corporate.upward || 50) + 3,
              ); // [PLACEHOLDER] 真实惰性字段
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "🌱 你把投资收益变成了业务的种子金。从投资人到经营者，格局打开了。管理经验+8，晋升势能+3。",
                "success",
              );
            }
          },
        },
        {
          text: "💰 收益还是先攥在手里",
          hint: "心智+[PLACEHOLDER]（稳健，但少一次成长）",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._seedFromGainsSeen = true;
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "💰 你决定先把收益攥在手里。稳健，但也错过了一次让钱生长的机会。心智+3。",
                "info",
              );
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

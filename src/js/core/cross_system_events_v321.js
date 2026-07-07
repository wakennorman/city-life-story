/**
 * v3.21 跨系统联动事件扩充 — 填补5个设计空白
 *
 * 与 src/js/core/cross_system_events.js 相同的 IIFE 模式：
 *   在 RANDOM_EVENTS 数组上 push 新事件，加载顺序在之后即可。
 *
 * 5个事件覆盖的空白区域：
 *   1. 天气+位置组合（foggy_market_arbitrage）
 *   2. 连续状态积累爆发（starvation_body_alarm）
 *   3. NPC意外发现（aunt_wang_secret_ledger）
 *   4. 老手特遇（veteran_city_welcome）
 *   5. 道德分叉（moral_wallet_camera_twist）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._crossSystemV321Loaded) return;
  RANDOM_EVENTS._crossSystemV321Loaded = true;

  var NEW_EVENTS = [
    // ===== 事件1：天气+位置组合 — 雾霾天的批发市场捡漏 =====
    // 联动：weather.current + trade.currentLocation + intelligence
    {
      id: "foggy_market_arbitrage",
      phase: "street",
      icon: "🌫️",
      title: "雾里的价签",
      story:
        "今早雾霾特别重，批发市场的电子价牌都看不清。你走近才发现好几家的标价还停留在昨天的低价——商户自己也看不清新价格该挂多少。\\n\\n四下里来进货的人不多，机会窗口可能只有这一小会儿。",
      conditions: function (st) {
        var curLoc = st.trade && st.trade.currentLocation;
        var w = st.weather && st.weather.current;
        return (
          st.player.phase === "street" &&
          curLoc === "wholesaleMarket" &&
          (w === "foggy" || w === "heavy_smog") &&
          st.player.day >= 20
        );
      },
      probability: 0.06,
      repeatable: true,
      choices: [
        {
          text: "🧠 利用价差扫货，转手赚一笔",
          hint: "智力≥40可识别最佳套利品",
          apply: function (st) {
            var int = st.player.intelligence || 0;
            if (int >= 40) {
              var profit = Random.int(150, 350);
              st.resources.cash += profit;
              st.resources.totalEarned =
                (st.resources.totalEarned || 0) + profit;
              st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
              StateManager.addMessage(
                "🧠 你快速扫了几家低价摊位，转手高价出手，套利¥" +
                  profit +
                  "。市场恢复清晰之前你就收手了。心智+2。",
                "success",
              );
            } else {
              var small = Random.int(40, 100);
              st.resources.cash += small;
              StateManager.addMessage(
                "🧠 你凭直觉买了几样便宜货，小赚¥" +
                  small +
                  "。要是智力更高就能发现更多机会了。",
                "info",
              );
            }
          },
        },
        {
          text: "👀 默默记下，等天亮再来",
          hint: "稳健，无收益无风险",
          apply: function (st) {
            st.flags._foggyMarketNoted = true;
            StateManager.addMessage(
              "👀 你记下了几家低价摊位的位置。等雾散了价格也会恢复，这个秘密先烂在肚子里。",
              "info",
            );
          },
        },
        {
          text: "🚶 雾太大，空气差，走了",
          hint: "健康优先",
          apply: function (st) {
            StateManager.addMessage(
              "🌫️ 你捂着鼻子离开了批发市场。这种天气出来打工本身就不太明智。",
              "info",
            );
          },
        },
      ],
    },

    // ===== 事件2：连续状态积累爆发 — 长期饥饿后的身体警报 =====
    // 联动：flags._habits.lowHungerStreak + status.health + needs.hunger
    {
      id: "starvation_body_alarm",
      phase: "street",
      icon: "🤢",
      title: "胃在抗议",
      story:
        "你在街边突然感到一阵强烈的眩晕，蹲下来才发觉已经记不清上次好好吃饭是什么时候了。\\n\\n旁边小卖部老板看你脸色发白，皱着眉说：「小伙子，你这脸色不对劲啊。」",
      conditions: function (st) {
        var habits = st.flags && st.flags._habits;
        // 连续3天以上饥饿值低于25 或 健康低于30
        return (
          st.player.phase === "street" &&
          ((habits && habits.lowHungerStreak >= 3) ||
            (st.status && st.status.health < 30))
        );
      },
      probability: 0.12,
      repeatable: false,
      choices: [
        {
          text: "🍜 听劝，吃碗面（¥15）",
          hint: "恢复饥饿，健康+3",
          apply: function (st) {
            if (st.resources.cash < 15) {
              StateManager.addMessage(
                "😅 你翻了翻口袋，连¥15的面钱都掏不出来……只好咽了咽口水。",
                "warning",
              );
              return;
            }
            st.resources.cash -= 15;
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 35);
            st.status.health = Math.min(100, (st.status.health || 0) + 3);
            if (st.flags._habits) st.flags._habits.lowHungerStreak = 0;
            StateManager.addMessage(
              "🍜 一碗热汤面下肚，整个人都缓过来了。脸色不再那么难看了。饥饿恢复，健康+3。",
              "success",
            );
          },
        },
        {
          text: "💊 买点止晕药扛过去（¥8）",
          hint: "临时缓解，不治本",
          apply: function (st) {
            if (st.resources.cash < 8) {
              StateManager.addMessage(
                "😵 你连药都买不起，只好在路边蹲着等这阵晕过去。",
                "warning",
              );
              return;
            }
            st.resources.cash -= 8;
            st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 5);
            StateManager.addMessage(
              "💊 止晕药压住了症状，但胃还在隐隐作痛。这只是缓兵之计。",
              "warning",
            );
          },
        },
        {
          text: "🚶 没事，老毛病了",
          hint: "健康-8，可能埋下疾病隐患",
          apply: function (st) {
            st.status.health = Math.max(0, (st.status.health || 0) - 8);
            if (!st.flags._habits) st.flags._habits = {};
            st.flags._habits.stomach_inflammationCount =
              (st.flags._habits.stomach_inflammationCount || 0) + 1;
            StateManager.addMessage(
              "🚶 你摆摆手站起来走了。小卖部老板在背后摇头。健康-8，肠胃负担加重了。",
              "warning",
            );
          },
        },
      ],
    },

    // ===== 事件3：NPC意外发现 — 发现王大婶偷偷记账的秘密 =====
    // 联动：relationships.aunt_wang.discovered + trade.priceMemory
    {
      id: "aunt_wang_secret_ledger",
      phase: "street",
      icon: "📒",
      title: "王大婶的账本",
      story:
        "你帮王大婶搬柜子时，她那个黑皮账本不小心散开了——里面不仅记着每家的房租，还密密麻麻记着这些年每个商户给她的「推荐费」和「茶水钱」。\\n\\n她慌忙收起来，脸色不太自然：「这个……你看错了。」",
      conditions: function (st) {
        var rel = st.relationships && st.relationships.aunt_wang;
        return (
          st.player.phase === "street" &&
          rel &&
          rel.met &&
          (rel.affinity || 0) >= 50 &&
          rel.discovered &&
          !rel.discovered._ledgerSecret &&
          st.player.day >= 60
        );
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🤫 王婶放心，我不说",
          hint: "好感+12，解锁隐藏'人情世故'视野",
          apply: function (st) {
            st.relationships.aunt_wang.affinity = Math.min(
              100,
              (st.relationships.aunt_wang.affinity || 0) + 12,
            );
            st.relationships.aunt_wang.discovered._ledgerSecret = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            StateManager.addMessage(
              "🤫 你压低声音：「我什么也没看见。」王大婶的脸一下子松了，以后看你的眼神多了几分真情实意。好感+12，心智+3。你只是没想到，这座城市里每个人都有第二本账。",
              "success",
            );
          },
        },
        {
          text: "🤔 问了句：推荐费是什么行情？",
          hint: "得到租客市场行情信息，好感-5",
          apply: function (st) {
            st.relationships.aunt_wang.affinity = Math.max(
              0,
              (st.relationships.aunt_wang.affinity || 0) - 5,
            );
            st.relationships.aunt_wang.discovered._ledgerSecret = true;
            // 解锁房租谈判永久信息
            st.flags._knowsRentalKickback = true;
            StateManager.addMessage(
              "🤔 王大婶脸色变了变，压低声音：「行情是半个月租金，懂的都懂。」她显然没想到你会直接问。好感-5，但你以后租房/谈租时心里有底了。",
              "info",
            );
          },
        },
        {
          text: "😬 尴尬，我不该看的",
          hint: "好感+3，安全但错失机会",
          apply: function (st) {
            st.relationships.aunt_wang.affinity = Math.min(
              100,
              (st.relationships.aunt_wang.affinity || 0) + 3,
            );
            st.relationships.aunt_wang.discovered._ledgerSecret = true;
            StateManager.addMessage(
              "😬 你赶紧帮她把账本收好。王大婶叹了口气，没再说什么。好感+3。",
              "info",
            );
          },
        },
      ],
    },

    // ===== 事件4：老手特遇 — 城市对"长期生存者"的认可 =====
    // 联动：totalEarned累计 + fame + day（长期生存者）
    {
      id: "veteran_city_welcome",
      phase: "street",
      icon: "🏙️",
      title: "城里的老面孔",
      story:
        "你在常去的早餐摊排队，老板笑着多给你加了一勺：「老熟人了吧？我看你从这条街摆到那边，挺不容易的。」\\n\\n旁边新来的打工仔打量着你，那种眼神你很熟悉——两年前你也是这样看别人的。\\n\\n这座城市开始记住你了。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.resources.totalEarned || 0) >= 20000 &&
          st.player.day >= 100 &&
          st.player.fame >= 15 &&
          !st.flags._veteranWelcomeSeen
        );
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🍜 请那个新来的吃碗面",
          hint: "名气+6，心情+8",
          apply: function (st) {
            st.flags._veteranWelcomeSeen = true;
            var cost = 15;
            if (st.resources.cash >= cost) {
              st.resources.cash -= cost;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
              StateManager.addMessage(
                "🍜 你给那个一脸迷茫的新来的点了一碗面。他想说不用，你已经付了。名气+6，心情+8。你在他眼里看到了两年前的自己。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🍜 你想请客，但口袋里只剩几个硬币。那个新来的自己买了最便宜的馒头。",
                "warning",
              );
            }
          },
        },
        {
          text: "💬 跟他聊聊这座城市",
          hint: "心智+5，解锁新人引导记忆",
          apply: function (st) {
            st.flags._veteranWelcomeSeen = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
            StateManager.addMessage(
              "💬 你跟他说了哪些工靠谱、哪个摊的饭实惠、下雨天哪条街不涝。他听得很认真。心智+5，心情+5。把当年别人告诉你的那些，传下去了。",
              "success",
            );
          },
        },
        {
          text: "😶 默默吃完走自己的路",
          hint: "独自前行",
          apply: function (st) {
            st.flags._veteranWelcomeSeen = true;
            StateManager.addMessage(
              "😶 你低下头吃完面就走了。每个人都有自己的路要操心。",
              "info",
            );
          },
        },
      ],
    },

    // ===== 事件5：道德分叉 — 捡到钱包后监控的死角 =====
    // 联动：morality值 + flags._keptFoundMoney（道德历史分支）
    {
      id: "moral_wallet_camera_twist",
      phase: "street",
      icon: "📹",
      title: "转角处的摄像头",
      story:
        "上次捡到的钱已经花完了。今天你在同一个街区走着，偶然注意到墙角有一个新装的摄像头——角度刚好覆盖那个ATM机。\\n\\n你突然有点不确定：那个摄像头是什么时候装的？",
      conditions: function (st) {
        // 必须有过"捡到钱"的经历（两种可能）
        var hasWalletHistory =
          st.flags._foundATMCash || st.flags._keptFoundMoney;
        return (
          st.player.phase === "street" &&
          hasWalletHistory &&
          st.player.day >= (st.flags._foundMoneyDay || 0) + 14 &&
          !st.flags._walletCameraSeen
        );
      },
      probability: 0.08,
      repeatable: false,
      choices: [
        {
          text: "😰 匿名联系失主，把剩下的钱退了",
          hint: "仅当你曾私吞时可用；道德+8",
          apply: function (st) {
            st.flags._walletCameraSeen = true;
            st.flags._walletConfessed = true;
            // 退还一部分（象征性）
            var refund = Math.min(st.resources.cash, 200);
            st.resources.cash -= refund;
            st.player.morality = Math.min(100, (st.player.morality || 50) + 8);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
            StateManager.addMessage(
              "😰 你匿名把剩下的¥" +
                refund +
                "退给了失主。走出几步后回头看了眼那摄像头——不知道是刚装的还是一直都在。道德+8，心情+10。至少今晚睡得着了。",
              "success",
            );
          },
        },
        {
          text: "🧠 去查查那摄像头是什么时候装的",
          hint: "心智+3，揭开真相",
          apply: function (st) {
            st.flags._walletCameraSeen = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            // 根据道德值给出不同的叙事（无论条件如何，消息都有效）
            if ((st.player.morality || 50) >= 50) {
              StateManager.addMessage(
                "🧠 你打听了一下——那摄像头三天前才装的。也就是说当初捡钱时没有监控。心智+3。你松了口气，但同时意识到：那一刻的抉择是纯粹的。",
                "info",
              );
            } else {
              StateManager.addMessage(
                "🧠 你打听了一下——那摄像头三天前才装的。也就是说当初捡钱时没有监控。心智+3。但你知道，不管有没有摄像头，那一刻的选择已经定义了你是谁。",
                "info",
              );
            }
          },
        },
        {
          text: "🚶 装没看见，快步走开",
          hint: "把秘密藏好",
          apply: function (st) {
            st.flags._walletCameraSeen = true;
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
            StateManager.addMessage(
              "🚶 你加快了步伐，不敢回头看。有些事情不查清楚反而更好。心情-5。",
              "warning",
            );
          },
        },
      ],
    },
  ];

  // 注入到 RANDOM_EVENTS
  for (var i = 0; i < NEW_EVENTS.length; i++) {
    RANDOM_EVENTS.push(NEW_EVENTS[i]);
  }
})();

/**
 * 跨系统联动事件 — 提升游戏内容关联度
 *
 * 设计参考：
 *   - This War of Mine：NPC角色互动影响事件
 *   - 《大多数》：行业热度影响街头生存
 *   - Capitalism Lab：经济系统交叉反馈
 *   - Stardew Valley：NPC关系解锁特殊事件
 *
 * 核心理念：让玩家感觉各系统不是孤立的——
 *   NPC关系影响事件选项、行业热度影响街头收益、
 *   世界状态影响可用事件、道德选择产生长期回响。
 *
 * 接入方式：通过 setTimeout 在所有脚本加载后注入到 RANDOM_EVENTS
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._crossSystemLoaded) return;
  RANDOM_EVENTS._crossSystemLoaded = true;

  var CROSS_EVENTS = [
    // === NPC关系联动事件 ===
    {
      id: "npc_rescue_aunt_wang",
      phase: "street",
      icon: "🏠",
      title: "王大婶的救急",
      story: `收工时王大婶急匆匆跑来："孩子，我家水管爆了，满屋子水！你能不能帮忙修修？"\n你看了看她焦急的样子，想起她平日里对你的照顾。`,
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.aunt_wang &&
          (st.relationships.aunt_wang.affinity || 0) >= 30 &&
          st.player.day > 10
        );
      },
      choices: [
        {
          text: "🔧 帮她修水管",
          hint: "花1点行动力，好感+10",
          apply: function (st) {
            if (st.skills && st.skills.repair) {
              var level = st.skills.repair.level || 0;
              if (level >= 20) {
                st.relationships.aunt_wang.affinity = Math.min(
                  100,
                  (st.relationships.aunt_wang.affinity || 0) + 12,
                );
                st.skills.repair.xp = (st.skills.repair.xp || 0) + 30;
                StateManager.addMessage(
                  "🔧 你三两下就修好了水管。王大婶感激得不行，好感+12。",
                  "success",
                );
              } else {
                st.relationships.aunt_wang.affinity = Math.min(
                  100,
                  (st.relationships.aunt_wang.affinity || 0) + 8,
                );
                StateManager.addMessage(
                  "🔧 你笨手笨脚修好了，虽然弄了一身水。王大婶还是谢谢你，好感+8。",
                  "success",
                );
              }
            } else {
              st.relationships.aunt_wang.affinity = Math.min(
                100,
                (st.relationships.aunt_wang.affinity || 0) + 5,
              );
              StateManager.addMessage(
                "🔧 你不太会修，但帮着递工具也帮上忙了。好感+5。",
                "info",
              );
            }
          },
        },
        {
          text: "💰 给她¥100找修水工",
          hint: "花钱省事",
          cost: 100,
          apply: function (st) {
            st.resources.cash -= 100;
            st.relationships.aunt_wang.affinity = Math.min(
              100,
              (st.relationships.aunt_wang.affinity || 0) + 5,
            );
            StateManager.addMessage(
              "💰 你掏了¥100让她找专业修水工。王大婶嘴上说不用，心里记着你的好。",
              "info",
            );
          },
        },
        {
          text: "🚶 我自己都顾不上",
          hint: "关系可能变差",
          apply: function (st) {
            st.relationships.aunt_wang.affinity = Math.max(
              0,
              (st.relationships.aunt_wang.affinity || 0) - 8,
            );
            StateManager.addMessage(
              "🚶 你说实在没空。王大婶脸上的笑僵了一下，转身走了。好感-8。",
              "warning",
            );
          },
        },
      ],
    },
    // === 行业热度联动事件 ===
    {
      id: "sector_heat_temp_job",
      phase: "street",
      icon: "📊",
      title: "风口来了",
      story: `手机弹了条推送："XX行业人才缺口巨大，日薪涨了50%！"\n你看了看，心跳加速——这不就是你一直在干的活吗？`,
      conditions: function (st) {
        if (!st._worldParams || !st._worldParams.sectorHeat) return false;
        for (var sector in st._worldParams.sectorHeat) {
          if (st._worldParams.sectorHeat[sector] > 1.2) return true;
        }
        return false;
      },
      choices: [
        {
          text: "🔥 抓住风口，多接活",
          hint: "体力消耗大，但收入翻倍",
          apply: function (st) {
            var bonus = Random.int(80, 200);
            st.resources.cash += bonus;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
            st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 15);
            StateManager.addMessage(
              "🔥 你趁热打铁多干了一轮，多赚¥" + bonus + "。但累得够呛。",
              "success",
            );
          },
        },
        {
          text: "📈 研究一下哪个行业最热",
          hint: "心智+2，获得投资灵感",
          apply: function (st) {
            st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
            StateManager.addMessage(
              "📈 你仔细研究了行业趋势，发现科技和新能源都在升温。也许该关注下股票？",
              "hint",
            );
          },
        },
        {
          text: "😴 风口关我什么事",
          hint: "佛系",
          apply: function (st) {
            StateManager.addMessage(
              "😴 你把手机扔一边，翻了个身。风口吹不到你的出租屋。",
              "info",
            );
          },
        },
      ],
    },
    // === 行业寒冬联动事件（负向，sectorHeat < 0.85 触发）===
    {
      id: "sector_cold_layoff_risk",
      phase: "street",
      icon: "🥶",
      title: "行业寒冬",
      story: `新闻里铺天盖地都是"XX行业遇冷""企业缩编"的消息。你认识几个同行，已经在抱怨活越来越少、价钱越压越低。\n风口过了，日子得重新算计。`,
      conditions: function (st) {
        if (!st._worldParams || !st._worldParams.sectorHeat) return false;
        if (st.player.day < 15) return false;
        if (
          st.flags._sectorColdLastDay &&
          st.player.day - st.flags._sectorColdLastDay < 7
        )
          return false;
        for (var sector in st._worldParams.sectorHeat) {
          if (st._worldParams.sectorHeat[sector] < 0.85) return true;
        }
        return false;
      },
      choices: [
        {
          text: "🛠️ 转行试试别的活",
          hint: "花2行动力，心智+3，可能找到新方向",
          cost: 2,
          apply: function (st) {
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);
            if (Random.chance(0.5)) {
              var tip = Random.int(20, 60);
              st.resources.cash += tip;
              StateManager.addMessage(
                "🛠️ 你试了试别的行当，赚了¥" + tip + "，似乎能糊口。心智+3。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🛠️ 转行不易，跑了半天没接到活。但至少拓宽了思路，心智+3。",
                "info",
              );
            }
            st.flags._sectorColdLastDay = st.player.day;
          },
        },
        {
          text: "💰 硬扛，降价接活",
          hint: "现金-30，保住客源",
          apply: function (st) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 6);
            StateManager.addMessage(
              "💰 行情差，你咬咬牙降价接活。少赚了¥30，但保住了几个老主顾。",
              "warning",
            );
            st.flags._sectorColdLastDay = st.player.day;
          },
        },
        {
          text: "📚 趁闲充电学技能",
          hint: "心智+4，疲劳+8，为下一波风口做准备",
          apply: function (st) {
            st.player.mental = Math.min(100, (st.player.mental || 0) + 4);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);
            if (st.skills) {
              var keys = Object.keys(st.skills);
              if (keys.length > 0) {
                var k = Random.fromArray(keys);
                if (st.skills[k] && typeof st.skills[k].xp !== "undefined") {
                  st.skills[k].xp = (st.skills[k].xp || 0) + 25;
                  StateManager.addMessage(
                    "📚 你趁着淡季自学充电，" +
                      k +
                      " 经验+25，心智+4。寒冬里攒的本事，春天会用上。",
                    "hint",
                  );
                }
              }
            }
            if (!st.skills || Object.keys(st.skills || {}).length === 0) {
              StateManager.addMessage(
                "📚 你趁着淡季自学充电，心智+4。寒冬里攒的本事，春天会用上。",
                "hint",
              );
            }
            st.flags._sectorColdLastDay = st.player.day;
          },
        },
      ],
    },
    // === 行业红利期·创业侧反馈（sectorHeat > 1.15 且玩家有公司）===
    {
      id: "sector_boom_startup_windfall",
      // [自洽修复] phase "corp" 不是合法值（合法值为 "street"/"corporate"），改为 "street"
      phase: "street",
      icon: "🚀",
      title: "行业红利期",
      story: `你所在的行业正处在风口上——订单暴增、客户主动找上门、媒体都在报道赛道火爆。\n公司的财务跑来兴奋地说："这个月营收比预期高了不止一成！"`,
      // [自洽修复] conditions 新增：st.startup.company 检查（原用 st.enterprise，字段不存在于 state.js）
      conditions: function (st) {
        if (!st._worldParams || !st._worldParams.sectorHeat) return false;
        if (!st.startup || !st.startup.company || !st.startup.company.industry)
          return false;
        if (
          st.flags._sectorBoomLastDay &&
          st.player.day - st.flags._sectorBoomLastDay < 14
        )
          return false;
        var heat = st._worldParams.sectorHeat[st.startup.company.industry];
        return typeof heat === "number" && heat > 1.15;
      },
      choices: [
        {
          text: "📈 乘势扩张，吞下红利",
          hint: "营收红利入账，声誉+，心智+",
          apply: function (st) {
            var company = st.startup.company;
            var base = 800;
            var share = company.marketShare || 0;
            var scale = 1 + share / 50;
            var windfall = Math.round(
              base * scale * (0.8 + Random.float(0, 0.6)),
            );
            st.resources.cash += windfall;
            st.resources.totalEarned =
              (st.resources.totalEarned || 0) + windfall;
            company.reputation = Math.min(100, (company.reputation || 0) + 4);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            StateManager.addMessage(
              "🚀 风口红利入账 ¥" +
                windfall +
                "！公司声誉+4。趁势扩张，把红利吃进肚里。",
              "success",
            );
            st.flags._sectorBoomLastDay = st.player.day;
          },
        },
        {
          text: "🏦 落袋为安，存进公司账户",
          hint: "稳健：红利较少但无风险",
          apply: function (st) {
            var windfall = Math.round(500 * (0.8 + Random.float(0, 0.4)));
            st.resources.cash += windfall;
            st.resources.totalEarned =
              (st.resources.totalEarned || 0) + windfall;
            StateManager.addMessage(
              "🏦 你把 ¥" + windfall + " 红利稳妥入账，不贪不冒，细水长流。",
              "info",
            );
            st.flags._sectorBoomLastDay = st.player.day;
          },
        },
        {
          text: "📢 投品牌营销，把红利变长期资产",
          hint: "现金少入账，但声誉显著提升",
          apply: function (st) {
            var company = st.startup.company;
            company.reputation = Math.min(100, (company.reputation || 0) + 10);
            company.brand = Math.min(100, (company.brand || 0) + 6);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "📢 你把红利投进了品牌营销。短期少赚，但公司声誉+10、品牌+6，长远看更值。",
              "hint",
            );
            st.flags._sectorBoomLastDay = st.player.day;
          },
        },
      ],
    },
    // === 世界状态联动事件 ===
    {
      id: "market_crash_opportunity",
      phase: "street",
      icon: "📉",
      title: "暴跌中的机会",
      story:
        "股市暴跌的新闻铺天盖地。你路过证券营业部，看到大爷大妈们一脸愁容。\n但你想起来有人说过：'别人恐惧时我贪婪'。",
      conditions: function (st) {
        if (!st._worldParams) return false;
        if (!st.trade) return false;
        return (
          st._worldParams.marketMood === "bearish" &&
          st.player.day > 20 &&
          st.trade.currentLocation === "commercialDist"
        );
      },
      choices: [
        {
          text: "💰 凑点钱抄底",
          hint: "高风险高回报",
          cost: 50,
          apply: function (st) {
            st.resources.cash -= 50;
            var result = Random.int(0, 3);
            if (result === 0) {
              var profit = Random.int(100, 500);
              st.resources.cash += profit;
              StateManager.addMessage(
                `💰 抄底成功！你低买高卖赚了¥" + profit + "！`,
                "success",
              );
            } else if (result === 1) {
              StateManager.addMessage(
                "📉 又跌了。你的¥50打了水漂。但至少学到了教训。",
                "warning",
              );
            } else {
              st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
              StateManager.addMessage(
                "📊 你研究了一番市场走势，虽然没赚到钱，但学到了不少。心智+3",
                "hint",
              );
            }
          },
        },
        {
          text: "🛡️ 观望再说",
          hint: "保本第一",
          apply: function (st) {
            st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
            StateManager.addMessage("🛡️ 你选择观望。不亏就是赚。", "info");
          },
        },
        {
          text: "🤝 安慰旁边的大爷",
          hint: "善有善报",
          apply: function (st) {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
            st.flags._moralScore = (st.flags._moralScore || 0) + 1;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            StateManager.addMessage(
              `🤝 你拍了拍旁边大爷的肩："别急，市场总会好起来的。"大爷感激地看着你。`,
              "success",
            );
          },
        },
      ],
    },
    // === 道德选择联动事件 ===
    {
      id: "moral_finding_money",
      phase: "street",
      icon: "💵",
      title: "地上有一沓钱",
      story:
        "路过ATM机时，你注意到地上有一沓现金——目测至少¥500。四下无人，监控似乎也坏了。\n你心跳加速。",
      conditions: function (st) {
        return (
          st.player.day > 5 &&
          !st.flags._foundATMCash &&
          st.trade &&
          st.trade.currentLocation === "commercialDist"
        );
      },
      choices: [
        {
          text: "💸 捡了就走",
          hint: "¥500，但良心不安",
          apply: function (st) {
            st.flags._foundATMCash = true;
            var amount = Random.int(300, 800);
            st.resources.cash += amount;
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 10);
            st.flags._moralScore = (st.flags._moralScore || 0) - 3;
            st.flags._keptFoundMoney = true;
            StateManager.addMessage(
              `💸 你捡起钱快步走了。¥" + amount + "到手，但心里有点虚...`,
              "warning",
            );
            // 后续埋点：10天后可能遇到失主
            st.flags._foundMoneyDay = st.player.day;
          },
        },
        {
          text: "🏪 交给银行",
          hint: "品德高尚",
          apply: function (st) {
            st.flags._foundATMCash = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            st.flags._moralScore = (st.flags._moralScore || 0) + 3;
            st.flags._returnedFoundMoney = true;
            StateManager.addMessage(
              "🏪 你把钱交给了银行。工作人员登记后夸你品德高尚。名气+5，心情+15。",
              "success",
            );
          },
        },
        {
          text: "📸 发到业主群问问",
          hint: "中间路线",
          apply: function (st) {
            st.flags._foundATMCash = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
            st.flags._moralScore = (st.flags._moralScore || 0) + 1;
            StateManager.addMessage(
              "📸 你拍了照发到业主群。半天后有人来认领，给了你¥50感谢费。心情+5。",
              "success",
            );
            st.resources.cash += 50;
          },
        },
      ],
    },
    // === NPC协同事件 ===
    {
      id: "npc_synergy_old_zhou_deal",
      phase: "street",
      icon: "🤝",
      title: "老周的废品渠道",
      story: `老周神秘兮兮地拉你到一边："我有个门路，一个工地的废铜废铁没人收。你要是能拉走，咱俩分。"\n你看了看老周认真的表情，这不像是开玩笑。`,
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.old_zhou &&
          (st.relationships.old_zhou.affinity || 0) >= 40 &&
          st.player.day > 15
        );
      },
      choices: [
        {
          text: "🚶 去工地拉废品",
          hint: "需要体力，但利润可观",
          apply: function (st) {
            var profit = Random.int(150, 400);
            var zhouShare = Math.floor(profit * 0.3);
            st.resources.cash += profit - zhouShare;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
            st.relationships.old_zhou.affinity = Math.min(
              100,
              (st.relationships.old_zhou.affinity || 0) + 8,
            );
            StateManager.addMessage(
              "🤝 你拉了一车废铜回来，卖了¥" +
                (profit - zhouShare) +
                "。老周那份¥" +
                zhouShare +
                "也给了他。好感+8。",
              "success",
            );
          },
        },
        {
          text: "💰 出¥100入伙费",
          hint: "花钱但省力",
          cost: 100,
          apply: function (st) {
            st.resources.cash -= 100;
            var profit = Random.int(100, 250);
            st.resources.cash += profit;
            st.relationships.old_zhou.affinity = Math.min(
              100,
              (st.relationships.old_zhou.affinity || 0) + 5,
            );
            StateManager.addMessage(
              `💰 你出了¥100入伙费，分到¥" + profit + "。老周拍了拍你的肩。`,
              "success",
            );
          },
        },
        {
          text: "🤔 这个不太合规吧",
          hint: "谨慎行事",
          apply: function (st) {
            st.relationships.old_zhou.affinity = Math.max(
              0,
              (st.relationships.old_zhou.affinity || 0) - 3,
            );
            StateManager.addMessage(
              `🤔 你犹豫了一下没接。老周叹了口气："也是，你比我想得多。"好感-3。`,
              "info",
            );
          },
        },
      ],
    },
  ];

  // ====== v3.21 跨系统联动事件（已合并自 cross_system_events_v321.js） ======
  // 5个事件覆盖：天气+位置 / 连续状态积累 / NPC意外发现 / 老手特遇 / 道德分叉
  CROSS_EVENTS.push(
    // ===== 事件1：天气+位置组合 — 雾霾天的批发市场捡漏 =====
    {
      id: "foggy_market_arbitrage",
      phase: "street",
      icon: "🌫️",
      title: "雾里的价签",
      story:
        "今早雾霾特别重，批发市场的电子价牌都看不清。你走近才发现好几家的标价还停留在昨天的低价——商户自己也看不清新价格该挂多少。\n\n四下里来进货的人不多，机会窗口可能只有这一小会儿。",
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
    {
      id: "starvation_body_alarm",
      phase: "street",
      icon: "🤢",
      title: "胃在抗议",
      story:
        "你在街边突然感到一阵强烈的眩晕，蹲下来才发觉已经记不清上次好好吃饭是什么时候了。\n\n旁边小卖部老板看你脸色发白，皱着眉说：「小伙子，你这脸色不对劲啊。」",
      conditions: function (st) {
        var habits = st.flags && st.flags._habits;
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
              "🍜 一碗热汤面下肚，整个人都缓过来了。饥饿恢复，健康+3。",
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
              "🚶 你摆摆手站起来走了。健康-8，肠胃负担加重了。",
              "warning",
            );
          },
        },
      ],
    },

    // ===== 事件3：NPC意外发现 — 王大婶的账本秘密 =====
    {
      id: "aunt_wang_secret_ledger",
      phase: "street",
      icon: "📒",
      title: "王大婶的账本",
      story:
        "你帮王大婶搬柜子时，她那个黑皮账本不小心散开了——里面不仅记着每家的房租，还密密麻麻记着这些年每个商户给她的「推荐费」和「茶水钱」。\n\n她慌忙收起来，脸色不太自然：「这个……你看错了。」",
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
              "🤫 你压低声音：「我什么也没看见。」王大婶的脸色一下子松了，以后看你的眼神多了几分真情实意。好感+12，心智+3。",
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
            st.flags._knowsRentalKickback = true;
            StateManager.addMessage(
              "🤔 王大婶压低声音：「行情是半个月租金，懂的都懂。」你以后租房/谈租时心里有底了。",
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
    {
      id: "veteran_city_welcome",
      phase: "street",
      icon: "🏙️",
      title: "城里的老面孔",
      story:
        "你在常去的早餐摊排队，老板笑着多给你加了一勺：「老熟人了吧？我看你从这条街摆到那边，挺不容易的。」\n\n旁边新来的打工仔打量着你，那种眼神你很熟悉——两年前你也是这样看别人的。\n\n这座城市开始记住你了。",
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
                "🍜 你给那个一脸迷茫的新来的点了一碗面。名气+6，心情+8。你在他眼里看到了两年前的自己。",
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
              "💬 你跟他说了哪些工靠谱、哪个摊的饭实惠、下雨天哪条街不涝。他听得很认真。心智+5，心情+5。",
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
    {
      id: "moral_wallet_camera_twist",
      phase: "street",
      icon: "📹",
      title: "转角处的摄像头",
      story:
        "上次捡到的钱已经花完了。今天你在同一个街区走着，偶然注意到墙角有一个新装的摄像头——角度刚好覆盖那个ATM机。\n\n你突然有点不确定：那个摄像头是什么时候装的？",
      conditions: function (st) {
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
            var refund = Math.min(st.resources.cash, 200);
            st.resources.cash -= refund;
            st.player.morality = Math.min(100, (st.player.morality || 50) + 8);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
            StateManager.addMessage(
              "😰 你匿名把剩下的¥" +
                refund +
                "退给了失主。道德+8，心情+10。至少今晚睡得着了。",
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
            if ((st.player.morality || 50) >= 50) {
              StateManager.addMessage(
                "🧠 你打听了一下——那摄像头三天前才装的。那一刻的抉择是纯粹的。心智+3。",
                "info",
              );
            } else {
              StateManager.addMessage(
                "🧠 你打听了一下——那摄像头三天前才装的。不管有没有摄像头，那一刻的选择已经定义了你是谁。心智+3。",
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
              "🚶 你加快了步伐，不敢回头看。心情-5。",
              "warning",
            );
          },
        },
      ],
    },
  );

  // ====== v3.22 天气×工作/NPC/消费深度联动（已合并自 cross_system_events_v322.js） ======
  // 5个事件覆盖：天气×工作 / NPC×天气 / 天气×NPC / 工作×NPC / 天气×消费
  CROSS_EVENTS.push(
    // ===== 事件1：天气×工作联动 — 高温天户外工作选择 =====
    {
      id: "heatwave_outdoor_worker",
      phase: "street",
      icon: "🥵",
      title: "高温预警，干还是不干",
      story:
        "气象台发出高温红色预警，室外温度超过40度。\\n" +
        "工地的工友说：「今天这天气，干一小时累得跟驴一样。」\\n" +
        "但包工头说工期紧，今天必须赶进度。",
      conditions: function (st) {
        var w = st.weather && st.weather.current;
        var isOutdoor =
          st.employment &&
          st.employment.currentJob &&
          [
            "manual_labor_construction",
            "waste_recycling",
            "old_zhou_recycling",
            "street_vending_food",
            "sister_zhang_vending",
          ].includes(st.employment.currentJob.id);
        return (
          st.player.phase === "street" &&
          w === "heatwave" &&
          isOutdoor &&
          st.player.day >= 30
        );
      },
      probability: 0.1,
      repeatable: false,
      choices: [
        {
          text: "💧 买冰水防暑，继续干（¥15）",
          hint: "健康+3，疲劳+5",
          apply: function (st) {
            if (st.resources.cash >= 15) {
              st.resources.cash -= 15;
              st.status.health = Math.min(100, (st.status.health || 0) + 3);
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
              var pay = st.employment.currentJob.payCalc(st);
              st.resources.cash += Math.floor(pay * 0.8);
              st.resources.totalEarned =
                (st.resources.totalEarned || 0) + Math.floor(pay * 0.8);
              StateManager.addMessage(
                "💧 买了冰水，顶着烈日干了一下午。收入打八折，但健康+3。拿到¥" +
                  Math.floor(pay * 0.8),
                "success",
              );
            } else {
              StateManager.addMessage(
                "😅 连¥15的冰水都买不起，只能在烈日下硬扛。",
                "warning",
              );
              st.status.health = Math.max(0, (st.status.health || 0) - 5);
            }
          },
        },
        {
          text: "🌳 找阴凉处躲一躲，下午再去",
          hint: "收入×0.6，但健康+5",
          apply: function (st) {
            var pay = st.employment.currentJob.payCalc(st);
            st.resources.cash += Math.floor(pay * 0.6);
            st.resources.totalEarned =
              (st.resources.totalEarned || 0) + Math.floor(pay * 0.6);
            st.status.health = Math.min(100, (st.status.health || 0) + 5);
            StateManager.addMessage(
              "🌳 你在树荫下躲到下午才开工，收入打了六折，但身体没出事。拿到¥" +
                Math.floor(pay * 0.6) +
                "，健康+5。",
              "info",
            );
          },
        },
        {
          text: "🏠 今天实在没法干了，休息吧",
          hint: "零收入，健康+8，疲劳-10",
          apply: function (st) {
            st.status.health = Math.min(100, (st.status.health || 0) + 8);
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            StateManager.addMessage(
              "🏠 你决定今天休息。身体是革命的本钱，健康+8。",
              "info",
            );
          },
        },
      ],
    },

    // ===== 事件2：NPC×天气联动 — 老周根据天气推荐废品出售时机 =====
    {
      id: "old_zhou_weather_tip",
      phase: "street",
      icon: "♻️",
      title: "老周的气象情报",
      story:
        "老周在废品站门口指着天说：\\n" +
        "「小伙子，明天台风来了，这几天废品价格会上涨——大家清理家里杂物，废品多呢。\\n" +
        "「要干就这两天赶紧收，别等台风过了。」",
      conditions: function (st) {
        var w = st.weather && st.weather.current;
        var nextDayForecast = st.weather && st.weather._nextDayForecast;
        var isTyphoonComing =
          nextDayForecast && nextDayForecast.weatherId === "typhoon";
        var isHeavyRainComing =
          nextDayForecast &&
          ["rainy", "stormy", "typhoon"].includes(nextDayForecast.weatherId);
        return (
          st.relationships &&
          st.relationships.old_zhou &&
          st.relationships.old_zhou.met &&
          st.trade &&
          st.trade.currentLocation === "wholesaleMarket" &&
          (st.player.day >= 15 || st.stats.actionFreq.waste_recycling > 0) &&
          (isTyphoonComing || isHeavyRainComing)
        );
      },
      probability: 0.08,
      repeatable: true,
      choices: [
        {
          text: "📦 听老周的，多收废品（需¥50进货）",
          hint: "台风前废品价格涨，但需资本",
          cost: 50,
          apply: function (st) {
            var profit = Random.int(80, 180);
            st.resources.cash += profit;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
            if (!st.relationships.old_zhou.affinity)
              st.relationships.old_zhou.affinity = 0;
            st.relationships.old_zhou.affinity = Math.min(
              100,
              st.relationships.old_zhou.affinity + 5,
            );
            StateManager.addMessage(
              "📦 听老周的，台风前多收了一批废品。转手赚了¥" +
                profit +
                "，老周对你更信任了。",
              "success",
            );
          },
        },
        {
          text: "🤔 记在心里，明天去问问",
          hint: "无收益，但老周记性好感+3",
          apply: function (st) {
            if (!st.relationships.old_zhou.affinity)
              st.relationships.old_zhou.affinity = 0;
            st.relationships.old_zhou.affinity = Math.min(
              100,
              st.relationships.old_zhou.affinity + 3,
            );
            st.flags._oldZhouWeatherTipNoted = true;
            StateManager.addMessage(
              "🤔 你把老周的话记在心里。台风来了，废品价格确实涨了。",
              "info",
            );
          },
        },
        {
          text: "😒 老周也就嘴上说说",
          hint: "好感-3",
          apply: function (st) {
            st.relationships.old_zhou.affinity = Math.max(
              -100,
              (st.relationships.old_zhou.affinity || 0) - 3,
            );
            StateManager.addMessage(
              "😒 你觉得老周又在吹牛，不以为然。",
              "warning",
            );
          },
        },
      ],
    },

    // ===== 事件3：天气×NPC联动 — 李工头台风安全警告 =====
    {
      id: "boss_li_typhoon_warning",
      phase: "street",
      icon: "🌀",
      title: "台风来了，工地停工",
      story:
        "李工头急匆匆跑到你面前：\\n" +
        "「台风预警了，明天工地必须停工！所有工人明天不要来！\\n" +
        "「不过……我有个私活，台风天送材料到偏远仓库，敢不敢接？」",
      // [自洽修复] 新增：boss_li affinity≥30（提供高风险私活需最低信任门槛）
      conditions: function (st) {
        var nextDayForecast = st.weather && st.weather._nextDayForecast;
        var isTyphoon =
          nextDayForecast && nextDayForecast.weatherId === "typhoon";
        var isHeavyRain =
          nextDayForecast &&
          ["rainy", "stormy", "typhoon"].includes(nextDayForecast.weatherId);
        // [自洽修复] 检查 met + affinity≥30（高风险私活需要最低信任）
        var rel = st.relationships && st.relationships.boss_li;
        if (!rel || !rel.met) return false;
        return (
          rel.affinity >= 30 &&
          (isTyphoon || isHeavyRain) &&
          st.player.day >= 20
        );
      },
      probability: 0.08,
      repeatable: true,
      choices: [
        {
          text: "💪 接私活，风险高但钱多",
          hint: "收入×2，但疲劳+20，可能受伤",
          apply: function (st) {
            var pay = st.employment.currentJob
              ? st.employment.currentJob.payCalc(st)
              : 100;
            var bonus = Math.floor(pay * 1.5);
            st.resources.cash += bonus;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + bonus;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
            if (Random.chance(0.3)) {
              st.status.health = Math.max(0, (st.status.health || 0) - 10);
              StateManager.addMessage(
                "💪 你在台风天送完材料，拿了¥" +
                  bonus +
                  "。但路上摔了一跤，健康-10。",
                "warning",
              );
            } else {
              StateManager.addMessage(
                "💪 你在台风天送完材料，顺利拿到¥" +
                  bonus +
                  "。虽然累但平安无事。",
                "success",
              );
            }
          },
        },
        {
          text: "🏠 不接，安全第一",
          hint: "零收入，但健康+5",
          apply: function (st) {
            st.status.health = Math.min(100, (st.status.health || 0) + 5);
            StateManager.addMessage(
              "🏠 你拒绝了李工头，决定在家休息。健康+5。",
              "info",
            );
          },
        },
        {
          text: "💬 问李工头有没有更稳妥的活",
          hint: "好感+5，可能获得室内工作",
          apply: function (st) {
            st.relationships.boss_li.affinity = Math.min(
              100,
              (st.relationships.boss_li.affinity || 0) + 5,
            );
            var indoorPay = Random.int(80, 150);
            st.resources.cash += indoorPay;
            st.resources.totalEarned =
              (st.resources.totalEarned || 0) + indoorPay;
            StateManager.addMessage(
              "💬 李工头说让你帮忙整理仓库材料，不用出去。拿到¥" +
                indoorPay +
                "，安全又稳定。",
              "success",
            );
          },
        },
      ],
    },

    // ===== 事件4：工作×NPC联动 — 张姐发现你的技能，提供晋升机会 =====
    {
      id: "zhang_factory_skill_offer",
      phase: "street",
      icon: "🏭",
      title: "张姐的升迁提议",
      story:
        "下班时张姐把你叫到一边：\\n" +
        "「你技术不错啊，能不能帮忙修一下产线的设备？\\n" +
        "「如果修得好，以后厂里的维修工长职位就留给你。」\\n" +
        "她递给你一个工具箱：「试试？」",
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.sister_zhang &&
          st.relationships.sister_zhang.met &&
          st.employment &&
          st.employment.currentJob &&
          st.employment.currentJob.id === "factory_work_assembly" &&
          ((st.skills.repair && st.skills.repair.level >= 20) ||
            (st.skills.electrician && st.skills.electrician.level >= 20)) &&
          st.player.day >= 40
        );
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🔧 修设备，展示技术（需维修≥20级）",
          hint: "成功晋升，失败受伤",
          apply: function (st) {
            var skill = st.skills.repair || st.skills.electrician;
            var success = skill && skill.level >= 20 && Random.chance(0.7);
            if (success) {
              st.flags._factoryRepairMan = true;
              st.skills.repair.xp += 50;
              var bonus = Random.int(200, 400);
              st.resources.cash += bonus;
              st.resources.totalEarned =
                (st.resources.totalEarned || 0) + bonus;
              StateManager.addMessage(
                "🔧 你修好了设备，张姐非常满意！晋升维修工长，月薪+¥500，现金奖励¥" +
                  bonus +
                  "。",
                "success",
              );
            } else {
              st.status.health = Math.max(0, (st.status.health || 0) - 8);
              StateManager.addMessage(
                "🔧 你试了半天没修好，还被机器烫了一下。健康-8。",
                "warning",
              );
            }
          },
        },
        {
          text: "🤔 谦虚一下，先观察",
          hint: "好感+5，后续再试",
          apply: function (st) {
            st.relationships.sister_zhang.affinity = Math.min(
              100,
              (st.relationships.sister_zhang.affinity || 0) + 5,
            );
            StateManager.addMessage(
              "🤔 你说：「张姐，我还需锻炼。」张姐点点头，等你准备好了再试。",
              "info",
            );
          },
        },
        {
          text: "🙅 拒绝，不想管设备",
          hint: "好感-5",
          apply: function (st) {
            st.relationships.sister_zhang.affinity = Math.max(
              -100,
              (st.relationships.sister_zhang.affinity || 0) - 5,
            );
            StateManager.addMessage(
              "🙅 你婉拒了张姐，表示只想干流水线。",
              "info",
            );
          },
        },
      ],
    },

    // ===== 事件5：天气×消费联动 — 重度雾霾口罩涨价 =====
    {
      id: "heavy_smog_price_surge",
      phase: "street",
      icon: "😷",
      title: "口罩涨价了",
      story:
        "重度雾霾天，街边小卖部口罩价格从¥2涨到了¥5。\\n" +
        "老板说：「雾霾天口罩需求大，进货价也涨了，不涨价我亏本啊。」\\n" +
        "你看了看空气质量指数，又摸了摸口袋……",
      conditions: function (st) {
        var w = st.weather && st.weather.current;
        return (
          st.player.phase === "street" &&
          w === "heavy_smog" &&
          st.player.day >= 10 &&
          st.status.health < 70
        );
      },
      probability: 0.08,
      repeatable: true,
      choices: [
        {
          text: "😷 买口罩，防护健康（¥10）",
          hint: "健康+5，雾霾伤害减免",
          cost: 10,
          apply: function (st) {
            st.resources.cash -= 10;
            st.status.health = Math.min(100, (st.status.health || 0) + 5);
            StateManager.addMessage(
              "😷 你买了口罩，虽然贵了点，但雾霾天保护自己很重要。健康+5。",
              "success",
            );
          },
        },
        {
          text: "👕 用湿毛巾捂住口鼻",
          hint: "免费，效果差",
          apply: function (st) {
            st.status.health = Math.max(0, (st.status.health || 0) - 2);
            StateManager.addMessage(
              "👕 你用湿毛巾捂住口鼻，效果差但免费。健康-2。",
              "warning",
            );
          },
        },
        {
          text: "🏠 今天不出门了",
          hint: "健康+3，零收入",
          apply: function (st) {
            st.status.health = Math.min(100, (st.status.health || 0) + 3);
            StateManager.addMessage(
              "🏠 你决定今天不出门，躲在家里。健康+3，但没收入。",
              "info",
            );
          },
        },
      ],
    },
  );

  var CAREER_EVENTS = [
    // ====== 职业生涯事件 ======
    {
      id: "career_promo_offer",
      name: "猎头挖角",
      icon: "📞",
      phase: "street",
      conditions: function (st) {
        return (
          st.career &&
          st.career.currentJob &&
          st.career.currentJob.workDays > 180
        );
      },
      probability: 0.03,
      repeatable: true,
      text: function (st) {
        var job = st.career.currentJob;
        return (
          "你在一家咖啡厅面试时，一个自称「某某科技」的猎头凑过来递名片。「以你的资历，在" +
          (job.levelName || "这岗位") +
          "上屈才了。来我们这，薪资翻倍+期权。」"
        );
      },
      choices: [
        {
          text: "💼 接offer，跳槽！",
          hint: "薪资×1.35，但人脉清零+30天试用期薪资80%",
          apply: function (st) {
            if (!st.career || !st.career.currentJob) return;
            st.career.history.push({
              day: st.player.day,
              event:
                "跳槽：从" + st.career.currentJob.levelName + "跳槽到新公司",
            });
            st.career.currentJob.salary = Math.round(
              st.career.currentJob.salary * 1.35,
            );
            st.career.currentJob.workDays = 0;
            // v3.1 修复：跳槽增加代价——人脉清零 + 30 天试用期薪资 80%
            if (
              st.corporate &&
              st.corporate.colleagues &&
              st.corporate.colleagues.network
            ) {
              st.corporate.colleagues.network.forEach(function (c) {
                c.relationship = Math.max(0, c.relationship - 30);
              });
            }
            st.career.currentJob._probationDays = 30;
            StateManager.addMessage(
              "💼 你接受了猎头的offer！薪资涨35%至¥" +
                st.career.currentJob.salary.toLocaleString() +
                "/月。但人脉-30，30天试用期薪资打八折",
              "warning",
            );
          },
        },
        {
          text: "❌ 婉拒，当前工作挺好",
          hint: "稳定为主",
          apply: function (st) {
            StateManager.addMessage(
              "🤝 你礼貌地拒绝了猎头。他留下名片说「改主意了随时找我」。",
              "info",
            );
          },
        },
        {
          text: "📄 拿着offer找老板谈涨薪",
          hint: "需要社交关系≥50",
          apply: function (st) {
            var colleagues = st.corporate?.colleagues?.network || [];
            var hasHighRel = colleagues.some(function (c) {
              return c.relationship >= 50;
            });
            if (hasHighRel) {
              st.career.currentJob.salary = Math.round(
                st.career.currentJob.salary * 1.4,
              );
              StateManager.addMessage(
                "💰 老板看到竞品offer，当场给你涨薪40%！月薪涨至¥" +
                  st.career.currentJob.salary.toLocaleString(),
                "success",
              );
            } else {
              StateManager.addMessage(
                "😤 老板不买账，反而觉得你在威胁他。和同事的关系也不够帮你说话。",
                "warning",
              );
            }
          },
        },
      ],
    },
    {
      id: "career_layoff",
      name: "公司裁员风波",
      icon: "📉",
      phase: "street",
      conditions: function (st) {
        return st.career && st.career.currentJob && st.player.day > 90;
      },
      probability: 0.015,
      repeatable: true,
      text: "公司突然宣布裁员！听说HR手里有一份名单，业务线要砍掉30%的人。茶水间的气氛比殡仪馆还沉重。",
      choices: [
        {
          text: "😰 找关系好的同事打听消息",
          hint: "需要社交关系≥40",
          apply: function (st) {
            var colleagues = st.corporate?.colleagues?.network || [];
            var allies = colleagues.filter(function (c) {
              return c.relationship >= 40;
            });
            if (allies.length > 0) {
              StateManager.addMessage(
                "🤫 " +
                  allies[0].name +
                  "悄悄告诉你：「名单上没有你，但最近别摸鱼。」",
                "success",
              );
            } else {
              StateManager.addMessage(
                "😶 没人愿意告诉你任何消息，你感觉自己在公司很孤立。",
                "warning",
              );
            }
          },
        },
        {
          text: "📊 主动提交业绩报告自保",
          hint: "需要技能达标",
          apply: function (st) {
            var survived = st.career.currentJob.workDays > 365;
            if (survived) {
              StateManager.addMessage(
                "📈 领导看了你的业绩报告很满意，明确表示你不在裁员名单上。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "😰 你在公司的资历太浅，虽然努力但效果不大...最终被优化了。",
                "warning",
              );
              st.career.currentJob = null;
            }
          },
        },
        {
          text: "💪 申请主动离职拿N+1补偿",
          hint: "拿补偿金走人",
          apply: function (st) {
            if (!st.career || !st.career.currentJob) return;
            var compensation = Math.round(
              (st.career.currentJob.salary || 5000) * 1.5,
            );
            st.resources.cash += compensation;
            st.career.history.push({
              day: st.player.day,
              event:
                "裁员风波中主动离职，拿到¥" +
                compensation.toLocaleString() +
                "补偿",
            });
            st.career.currentJob = null;
            StateManager.addMessage(
              "📄 你签了离职协议。拿到¥" +
                compensation.toLocaleString() +
                "补偿金，走出了办公楼。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 中后期经济压力事件 ======
    {
      id: "economic_downturn",
      name: "经济下行周期",
      icon: "📉",
      phase: "street",
      conditions: function (st) {
        return st.player.day > 200 && st.resources.cash > 50000;
      },
      probability: 0.02,
      repeatable: false,
      text: "新闻里铺天盖地地报道经济下行周期来临。分析师说可能持续6-12个月，各行各业都在收缩。你的投资组合和收入可能受到影响。",
      choices: [
        {
          text: "🛡️ 抛售部分资产换现金",
          hint: "减少损失（按当前市值70%返还现金）",
          apply: function (st) {
            var inv = st.investment || {};
            if (inv.stockHoldings && inv.stockHoldings.length > 0) {
              var totalCashBack = 0;
              for (var i = inv.stockHoldings.length - 1; i >= 0; i--) {
                var h = inv.stockHoldings[i];
                var curPrice =
                  inv.stockPrices && inv.stockPrices[h.symbol]
                    ? inv.stockPrices[h.symbol].price
                    : h.buyPrice || 0;
                totalCashBack += Math.round(curPrice * (h.shares || 1) * 0.7);
              }
              var soldCount = inv.stockHoldings.length;
              inv.stockHoldings = [];
              st.resources.cash = (st.resources.cash || 0) + totalCashBack;
              StateManager.addMessage(
                "💼 你清仓了" +
                  soldCount +
                  "只股票，按市值70%回笼¥" +
                  totalCashBack.toLocaleString() +
                  "。虽然亏了一些，但现金为王。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🏦 你的资产主要是现金，暂时影响不大。",
                "info",
              );
            }
          },
        },
        {
          text: "💼 加倍努力工作保住饭碗",
          hint: "提前做好职业防御",
          apply: function (st) {
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            StateManager.addMessage(
              "😤 你开始主动加班、多做汇报。虽然累，但领导对你印象更深了。",
              "info",
            );
          },
        },
        {
          text: "📉 趁低吸纳，逆向投资",
          hint: "高风险高回报",
          apply: function (st) {
            if (st.resources.cash < 10000) {
              StateManager.addMessage("你的现金太少，不适合逆向投资。", "hint");
              return;
            }
            var invest = Math.min(st.resources.cash * 0.3, 50000);
            st.resources.cash -= invest;
            st._pendingDownturnReturn = {
              amount: invest,
              day: st.player.day + 180,
            };
            StateManager.addMessage(
              "📈 你在市场恐慌时投入¥" +
                invest.toLocaleString() +
                "抄底。如果6个月后回暖，就能大赚一笔。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "wealth_tax",
      name: "资产核查通知",
      icon: "🏛️",
      phase: "street",
      conditions: function (st) {
        return (
          st.player.day > 300 &&
          st.resources.cash + (st.resources.bankBalance || 0) > 500000
        );
      },
      probability: 0.04,
      repeatable: true,
      text: "你收到一封税务局的通知信。信中暗示你的资产状况引起了注意，建议你主动申报资产并进行税务规划。",
      choices: [
        {
          text: "📋 主动申报，依法纳税",
          hint: "交税保平安",
          apply: function (st) {
            var tax = Math.round(st.resources.cash * 0.08);
            st.resources.cash -= tax;
            StateManager.addMessage(
              "📋 你主动申报并缴纳了¥" +
                tax.toLocaleString() +
                "的税款。虽然肉疼，但心里踏实了。",
              "success",
            );
          },
        },
        {
          text: "🏦 咨询会计师做税务规划",
          hint: "花费¥10,000，30%概率审计更严",
          apply: function (st) {
            if (st.resources.cash < 10000) {
              StateManager.addMessage(
                "会计师咨询费¥10,000，你付不起。",
                "warning",
              );
              return;
            }
            st.resources.cash -= 10000;
            // v3.1：30% 概率审计更严，补税至6%（而非4%）
            var rate =
              Random && Random.float
                ? Random.float(0, 1) < 0.3
                  ? 0.06
                  : 0.04
                : 0.04;
            var tax = Math.round(st.resources.cash * rate);
            st.resources.cash -= tax;
            StateManager.addMessage(
              "👔 会计师帮你做了税务规划" +
                (rate > 0.04 ? "，但遇到严格审计" : "") +
                "，最终交了¥" +
                tax.toLocaleString() +
                "。",
              rate > 0.04 ? "warning" : "success",
            );
          },
        },
        {
          text: "😰 当作没看到",
          hint: "有风险",
          apply: function (st) {
            StateManager.addMessage(
              "😰 你把信塞进抽屉里。但你知道这不是长久之计...",
              "warning",
            );
          },
        },
      ],
    },

    // ====== v3.4 C3D-T2: 跨系统联动事件 ×8 ======

    // 1. 暴雨中的商机
    {
      id: "rain_opportunity",
      name: "暴雨中的商机",
      icon: "🌧️",
      phase: "street",
      // [自洽修复] trigger→conditions 统一 + weather 字段名修复
      conditions: function (st) {
        return (
          st.weather &&
          (st.weather.current === "rainy" || st.weather.current === "stormy") &&
          st.resources.cash < 10000
        );
      },
      probability: 0.03,
      repeatable: true,
      text: "暴雨如注，街上行人稀少。你躲在屋檐下躲雨，心里盘算着今天该做什么。这时候你看到环卫工人撑着垃圾袋艰难前行，有人在暴雨中打车打不到。",
      choices: [
        {
          text: "☔ 冒雨摆摊，雨天人少但单价高",
          hint: "收入×1.5，健康-5",
          apply: function (st) {
            var earn = 80 + Random.int(0, 120);
            st.resources.cash += Math.round(earn * 1.5);
            st.status.health = Math.max(0, (st.status.health || 100) - 5);
            StateManager.addMessage(
              "☔ 你在暴雨中摆摊，虽然淋得浑身湿透，但赚了¥" +
                Math.round(earn * 1.5).toLocaleString() +
                "。",
              "success",
            );
          },
        },
        {
          text: "🏃 冒雨跑腿帮人送东西，雨天人少单多",
          hint: "¥200 + 可能有好人缘",
          apply: function (st) {
            st.resources.cash += 200;
            if (Random.chance(0.3)) {
              StateManager.addMessage(
                "🏃 客户看你冒雨跑腿，多给了¥50小费。",
                "success",
              );
              st.resources.cash += 50;
            } else {
              StateManager.addMessage(
                "🏃 你顶着暴雨跑了几趟，浑身湿透赚了¥200。",
                "info",
              );
            }
          },
        },
        {
          text: "🚶 找个地方避雨发呆",
          hint: "安全但没收益",
          apply: function (st) {
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "🚶 你找了个屋檐蹲着等雨停，看着雨幕发呆。",
              "info",
            );
          },
        },
      ],
    },

    // 2. 王大婶的租房信息
    {
      id: "wang_tip_rental",
      name: "王大婶的租房信息",
      icon: "🏠",
      phase: "street",
      conditions: function (st) {
        var rel = st.relationships && st.relationships.aunt_wang;
        return (
          rel &&
          rel.met &&
          rel.affinity >= 40 &&
          st.player.day >= 30 &&
          st.player.day <= 90
        );
      },
      probability: 0.03,
      repeatable: false,
      text: "王大婶在楼道里叫住你：'我一个亲戚在城中村有个单间空着，¥500一个月押一付三，条件一般但能遮风挡雨，要不要去看看？'",
      choices: [
        {
          text: "🏠 去看看（押一付三¥2000）",
          hint: "租到单间，不再露宿",
          apply: function (st) {
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              if (!st.housing) st.housing = {};
              var newTier = Math.max(st.housing.tier || 0, 1);
              st.housing.tier = newTier;
              st.flags._wangRental = true;
              StateManager.addMessage(
                "🏠 你租下了城中村的单间。虽然不大，但总算有个遮风挡雨的地方了。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "😅 你摸了摸口袋，¥2000押一付三拿不出来。",
                "warning",
              );
            }
          },
        },
        {
          text: "🙅 嫌贵先不要",
          hint: "继续住桥洞",
          apply: function (st) {
            StateManager.addMessage(
              "🙅 你摆摆手说再等等。王大婶叹了口气：'有需要随时找我。'",
              "info",
            );
          },
        },
        {
          text: "🤔 问问有没有更便宜的",
          hint: "好感≥60可¥300/月",
          apply: function (st) {
            var rel = st.relationships && st.relationships.aunt_wang;
            if (rel && rel.affinity >= 60) {
              if (st.resources.cash >= 1200) {
                st.resources.cash -= 1200;
                if (!st.housing) st.housing = {};
                st.housing.tier = Math.max(st.housing.tier || 0, 1);
                st.flags._wangRentalDiscounted = true;
                StateManager.addMessage(
                  "🏠 王大婶看你确实困难，'行吧，我亲戚那还有个储物间，¥300一个月。'你搬了进去，虽然小但总算有了个落脚处。",
                  "success",
                );
              } else {
                StateManager.addMessage(
                  "😅 连¥1200你都拿不出来，王大婶叹了口气。",
                  "warning",
                );
              }
            } else {
              StateManager.addMessage(
                "🤔 王大婶摇头：'这已经是全城最便宜的价了，再低就得找桥洞了。'",
                "info",
              );
            }
          },
        },
      ],
    },

    // 3. 公园里的老师傅
    {
      id: "park_skill_encounter",
      name: "公园里的老师傅",
      icon: "🌳",
      phase: "street",
      conditions: function (st) {
        var curLoc = st.trade && st.trade.currentLocation;
        if (curLoc !== "park") return false;
        var hasHighSkill = false;
        if (st.skills) {
          for (var sk in st.skills) {
            if (st.skills[sk] && st.skills[sk].level >= 50) {
              hasHighSkill = true;
              break;
            }
          }
        }
        return hasHighSkill;
      },
      probability: 0.04,
      repeatable: false,
      text: "在公园的长椅上，你遇到了一位白发老师傅。他看到你手中的工具/书籍，眼睛一亮：'年轻人，你也在学这个？我干这个四十多年了，有些心得可以聊聊。'",
      choices: [
        {
          text: "🙏 虚心请教",
          hint: "技能+2%，突破当前上限",
          apply: function (st) {
            var skillBoosted = false;
            if (st.skills) {
              for (var sk in st.skills) {
                if (st.skills[sk] && st.skills[sk].level >= 50) {
                  st.skills[sk].level = Math.min(100, st.skills[sk].level + 2);
                  skillBoosted = true;
                  break;
                }
              }
            }
            if (skillBoosted) {
              StateManager.addMessage(
                "🙏 老师傅一席话让你豁然开朗。技能提升了！",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🙏 老师傅聊了很多，但你没找到完全对口的点。",
                "info",
              );
            }
          },
        },
        {
          text: "💬 搭讪聊天",
          hint: "心情+10",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage(
              "💬 你陪老师傅聊了一下午，听他讲了几十年的见闻，心情大好。",
              "info",
            );
          },
        },
        {
          text: "🚶 无视走过",
          hint: "什么也不发生",
          apply: function (st) {
            StateManager.addMessage(
              "🚶 你点了点头，继续往前走。老师傅叹了口气，继续看他的报纸。",
              "info",
            );
          },
        },
      ],
    },

    // 4. 张姐工厂裁员
    {
      id: "factory_zhang_layoff",
      name: "张姐工厂裁员",
      icon: "🏭",
      phase: "street",
      conditions: function (st) {
        var rel = st.relationships && st.relationships.sister_zhang;
        var heat = st._worldParams && st._worldParams.sectorHeat;
        var mfgHeat = heat && heat["制造"];
        return (
          rel &&
          rel.met &&
          rel.affinity >= 30 &&
          mfgHeat !== undefined &&
          mfgHeat < 0.9 &&
          st.player.day > 60
        );
      },
      probability: 0.03,
      repeatable: false,
      text: "张姐神色疲惫地找到你：'厂里效益不行了，今天通知裁一批人……我可能也在名单上。'她的眼眶有些红。",
      choices: [
        {
          text: "🤗 安慰张姐",
          hint: "好感+15",
          apply: function (st) {
            if (!st.relationships.sister_zhang) {
              st.relationships.sister_zhang = { affinity: 0, met: true };
            }
            st.relationships.sister_zhang.affinity = Math.min(
              100,
              st.relationships.sister_zhang.affinity + 15,
            );
            StateManager.addMessage(
              "🤗 你安慰张姐：'车到山前必有路，你技术好不怕找不到下家。'张姐擦了擦眼睛，勉强笑了笑。",
              "info",
            );
          },
        },
        {
          text: "🤝 帮忙介绍工作",
          hint: "社交≥50可成功，好感+30",
          apply: function (st) {
            var social =
              (st.skills && st.skills.social && st.skills.social.level) || 0;
            if (social >= 50) {
              if (!st.relationships.sister_zhang) {
                st.relationships.sister_zhang = { affinity: 0, met: true };
              }
              st.relationships.sister_zhang.affinity = Math.min(
                100,
                st.relationships.sister_zhang.affinity + 30,
              );
              StateManager.addMessage(
                "🤝 你动用人脉帮张姐找到了一家新工厂的面试机会。张姐感激得不知道该说什么。",
                "success",
              );
              st.flags._zhangReferral = true;
            } else {
              StateManager.addMessage(
                "😅 你想帮忙但认识的人有限。张姐说：'没事，你有这份心就够了。'",
                "warning",
              );
            }
          },
        },
        {
          text: "😐 自顾不暇",
          hint: "什么也不做",
          apply: function (st) {
            if (!st.relationships.sister_zhang) {
              st.relationships.sister_zhang = { affinity: 0, met: true };
            }
            st.relationships.sister_zhang.affinity = Math.max(
              -100,
              st.relationships.sister_zhang.affinity - 5,
            );
            StateManager.addMessage(
              "😐 你低头说自己也在艰难维持。张姐失望地转身走了。",
              "warning",
            );
          },
        },
      ],
    },

    // 5. 科技园地摊机会
    {
      id: "market_clearance_tech",
      name: "科技园地摊机会",
      icon: "📱",
      phase: "street",
      conditions: function (st) {
        var curLoc = st.trade && st.trade.currentLocation;
        var heat = st._worldParams && st._worldParams.sectorHeat;
        var techHeat = heat && heat["科技"];
        return (
          curLoc === "techPark" &&
          techHeat !== undefined &&
          techHeat > 1.15 &&
          st.flags.hasSmartphone
        );
      },
      probability: 0.04,
      repeatable: true,
      text: "科技园门口聚集了一大堆白领在刷手机等下班。你注意到有人在摆摊卖手机配件，生意火爆。你摸了摸口袋里的智能手机，心想自己要不要也试试。",
      choices: [
        {
          text: "📱 卖手机配件（高风险高收益）",
          hint: "收入×1.8，但可能被抓",
          apply: function (st) {
            var earn = 100 + Random.int(0, 200);
            st.resources.cash += Math.round(earn * 1.8);
            if (Random.chance(0.25)) {
              st.resources.cash -= 200;
              StateManager.addMessage(
                "🚔 城管来了！你收起摊位就跑，但还是被罚了¥200。净赚¥" +
                  Math.round(earn * 1.8 - 200).toLocaleString() +
                  "。",
                "danger",
              );
            } else {
              StateManager.addMessage(
                "📱 科技园的白领们对手机配件很感兴趣，你赚了¥" +
                  Math.round(earn * 1.8).toLocaleString() +
                  "。",
                "success",
              );
            }
          },
        },
        {
          text: "📄 发传单",
          hint: "¥80，稳定收入",
          apply: function (st) {
            st.resources.cash += 80;
            StateManager.addMessage(
              "📄 你在科技园门口发了一下午传单，赚了¥80。",
              "info",
            );
          },
        },
        {
          text: "🔍 找园区工作机会",
          hint: "概率触发创业/工作线索",
          apply: function (st) {
            if (Random.chance(0.3)) {
              st.flags._techParkLead = true;
              StateManager.addMessage(
                "🔍 你在科技园逛了一圈，和几个创业者聊了聊，拿到了一个不错的商业线索！",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🔍 你在科技园转了转，保安问你是哪家公司的。你默默离开了。",
                "info",
              );
            }
          },
        },
      ],
    },

    // 6. 换季时节
    {
      id: "seasonal_health_check",
      name: "换季时节",
      icon: "🍂",
      phase: "street",
      conditions: function (st) {
        var day = st.player.day;
        var seasonEdgeDays = [91, 183, 274, 365];
        for (var si = 0; si < seasonEdgeDays.length; si++) {
          if (day === seasonEdgeDays[si]) {
            return st.status && st.status.health < 60;
          }
        }
        return false;
      },
      probability: 0.4,
      repeatable: true,
      text: "换季了，天气忽冷忽热。你感觉有点不对劲，周围不少人在咳嗽。你的身体底子本来就不算好，这个季节得格外注意。",
      choices: [
        {
          text: "🏥 去医院体检",
          hint: "¥200，发现隐藏健康问题",
          apply: function (st) {
            if (st.resources.cash >= 200) {
              st.resources.cash -= 200;
              var foundIssue = Random.chance(0.3);
              if (foundIssue) {
                st.flags._checkupFoundIssue = true;
                StateManager.addMessage(
                  "🏥 医生说你有些指标偏高，给你开了一些药。幸好发现得早！",
                  "warning",
                );
                st.status.health = Math.min(100, (st.status.health || 80) + 8);
              } else {
                st.status.health = Math.min(100, (st.status.health || 80) + 5);
                StateManager.addMessage(
                  "🏥 体检结果还行，就是有点小毛病，医生建议多休息。",
                  "info",
                );
              }
            } else {
              StateManager.addMessage(
                "🏥 检查费¥200，你掏了掏口袋，钱不够。",
                "warning",
              );
            }
          },
        },
        {
          text: "💪 自己扛着",
          hint: "健康-5",
          apply: function (st) {
            st.status.health = Math.max(0, (st.status.health || 80) - 5);
            StateManager.addMessage(
              "💪 你觉得自己挺一挺就过去了。但身体似乎不太同意。",
              "warning",
            );
          },
        },
        {
          text: "💊 买点保健品",
          hint: "¥50，健康+3%",
          apply: function (st) {
            if (st.resources.cash >= 50) {
              st.resources.cash -= 50;
              st.status.health = Math.min(100, (st.status.health || 80) + 3);
              StateManager.addMessage(
                "💊 你在药店买了些维生素，至少心理上感觉好多了。",
                "info",
              );
            } else {
              StateManager.addMessage("😅 连¥50的保健品都买不起……", "warning");
            }
          },
        },
      ],
    },

    // 7. 老周的废品大单
    {
      id: "old_zhou_scrap_deal",
      name: "老周的废品大单",
      icon: "♻️",
      phase: "street",
      conditions: function (st) {
        var rel = st.relationships && st.relationships.old_zhou;
        return rel && rel.met && rel.affinity >= 60 && st.player.day > 120;
      },
      probability: 0.03,
      repeatable: false,
      text: "老周兴冲冲地找到你：'小子，有个大活儿！工业区那边有一批废金属要处理，量很大，我一个人忙不过来。要是干得好，够咱们吃一个月！'",
      choices: [
        {
          text: "💪 帮他一起干",
          hint: "体力活，收入¥500-800 + 修理+5",
          apply: function (st) {
            var earn = 500 + Random.int(0, 300);
            st.resources.cash += earn;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 20);
            if (st.skills && st.skills.repair) {
              st.skills.repair.level = Math.min(
                100,
                st.skills.repair.level + 5,
              );
            }
            if (!st.relationships.old_zhou) {
              st.relationships.old_zhou = { affinity: 0, met: true };
            }
            st.relationships.old_zhou.affinity = Math.min(
              100,
              st.relationships.old_zhou.affinity + 10,
            );
            StateManager.addMessage(
              "♻️ 你和老周干了一整天，把废金属分类打包。虽然累得腰都直不起来，但分到了¥" +
                earn.toLocaleString() +
                "。老周拍了拍你的背：'好小子！'",
              "success",
            );
          },
        },
        {
          text: "📞 介绍客户",
          hint: "社交能力检查",
          apply: function (st) {
            var social =
              (st.skills && st.skills.social && st.skills.social.level) || 0;
            if (social >= 40) {
              st.resources.cash += 200;
              if (!st.relationships.old_zhou) {
                st.relationships.old_zhou = { affinity: 0, met: true };
              }
              st.relationships.old_zhou.affinity = Math.min(
                100,
                st.relationships.old_zhou.affinity + 15,
              );
              StateManager.addMessage(
                "📞 你给老周介绍了一家回收站，他谈成了长期合作。老周眉开眼笑：'还是你们年轻人会来事！'",
                "success",
              );
            } else {
              StateManager.addMessage(
                "📞 你想帮忙但认识的人不够。老周说：'没事，我另外想办法。'",
                "info",
              );
            }
          },
        },
        {
          text: "🙅 婉拒",
          hint: "不参与",
          apply: function (st) {
            StateManager.addMessage(
              "🙅 你说自己最近太忙了。老周有些失望：'那算了，我再找人。'",
              "info",
            );
          },
        },
      ],
    },

    // 8. 小美的副业机会
    {
      id: "xiao_mei_gig_economy",
      name: "小美的副业机会",
      icon: "💼",
      phase: "street",
      conditions: function (st) {
        var rel = st.relationships && st.relationships.xiao_mei;
        return (
          rel &&
          rel.met &&
          rel.affinity >= 30 &&
          st.player.day > 45 &&
          st.resources.cash < 50000
        );
      },
      probability: 0.03,
      repeatable: false,
      text: "小美兴冲冲地给你看手机：'我在一个APP上接单，帮人做PPT和表格，一单能赚几十块！要不要一起干？我可以教你。'",
      choices: [
        {
          text: "🤝 一起接单",
          hint: "时薪¥15-20，分享收入",
          apply: function (st) {
            var earn = 60 + Random.int(0, 40);
            st.resources.cash += Math.round(earn * 1.5);
            if (!st.relationships.xiao_mei) {
              st.relationships.xiao_mei = { affinity: 0, met: true };
            }
            st.relationships.xiao_mei.affinity = Math.min(
              100,
              st.relationships.xiao_mei.affinity + 10,
            );
            StateManager.addMessage(
              "🤝 你们一起接了几单，分工合作效率很高。小美很开心：'搭档愉快！赚了¥" +
                Math.round(earn * 1.5).toLocaleString() +
                "!'",
              "success",
            );
          },
        },
        {
          text: "💪 自己单干",
          hint: "时薪¥25-30，不带她",
          apply: function (st) {
            var earn = 100 + Random.int(0, 50);
            st.resources.cash += earn;
            if (!st.relationships.xiao_mei) {
              st.relationships.xiao_mei = { affinity: 0, met: true };
            }
            st.relationships.xiao_mei.affinity = Math.max(
              -100,
              st.relationships.xiao_mei.affinity - 5,
            );
            if (st.morality !== undefined) {
              st.morality = Math.max(-100, st.morality - 1);
            }
            StateManager.addMessage(
              "💪 你自己研究了一下APP，开始接单。小美看你没带她，有点失落。你赚了¥" +
                earn.toLocaleString() +
                "。",
              "warning",
            );
          },
        },
        {
          text: "🙅 看不上这点钱",
          hint: "错失机会",
          apply: function (st) {
            StateManager.addMessage(
              "🙅 你摆摆手：'这点钱不够费事的。'小美撇了撇嘴：'看不起我们打工人啊。'",
              "info",
            );
          },
        },
      ],
    },
    // === old_zhou 好感≥60 → 传授废品分类技巧 ===
    {
      id: "npc_zhou_scrap_tips",
      phase: "street",
      icon: "♻️",
      title: "老周的废品经",
      story:
        "老周看你每天翻垃圾桶，叹了口气：'小子，你这样翻法挣不了几个钱。来，我教你看货。'",
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.old_zhou &&
          (st.relationships.old_zhou.affinity || 0) >= 60 &&
          st.player.day > 20 &&
          !st.flags._zhouTaughtScrapSkill
        );
      },
      choices: [
        {
          text: "📖 仔细听讲",
          hint: "学习废品分类，永久提升废品收入",
          apply: function (st) {
            st.flags._zhouTaughtScrapSkill = true;
            if (st.skills && st.skills.sales) {
              st.skills.sales.xp = (st.skills.sales.xp || 0) + 50;
            }
            st.flags._scrapIncomeBonus = 1.2;
            st.relationships.old_zhou.affinity = Math.min(
              100,
              (st.relationships.old_zhou.affinity || 0) + 5,
            );
            StateManager.addMessage(
              "♻️ 老周的废品经让你大开眼界，以后废品收入 +20%！",
              "success",
            );
          },
        },
        {
          text: "🙏 谢谢周叔，改天请你吃饭",
          hint: "好感+3，安慰老周",
          apply: function (st) {
            st.flags._zhouTaughtScrapSkill = true;
            st.relationships.old_zhou.affinity = Math.min(
              100,
              (st.relationships.old_zhou.affinity || 0) + 8,
            );
            StateManager.addMessage(
              "🙏 老周摆摆手：'年轻人肯学就行，请你吃饭就免了。' 老周好感+8。",
              "info",
            );
          },
        },
      ],
    },
    // === sister_zhang 好感≥80 → 介绍便利店兼职 ===
    {
      id: "npc_zhang_parttime",
      phase: "street",
      icon: "🏪",
      title: "张姐的兼职机会",
      story:
        "张姐拦住你：'我表姐的便利店缺个夜班，工资日结，比你在外面风吹日晒强。去不去？'",
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.sister_zhang &&
          (st.relationships.sister_zhang.affinity || 0) >= 80 &&
          st.player.day > 30 &&
          !st.flags._zhangIntroParttime
        );
      },
      choices: [
        {
          text: "✅ 太好了，谢谢张姐！",
          hint: "解锁固定夜班，日薪¥150+",
          apply: function (st) {
            st.flags._zhangIntroParttime = true;
            st.flags._nightShiftJob = true;
            st.relationships.sister_zhang.affinity = Math.min(
              100,
              (st.relationships.sister_zhang.affinity || 0) + 10,
            );
            StateManager.addMessage(
              "🏪 张姐带你去了便利店，交代了注意事项。以后每晚可做夜班兼职（+¥150/天）！",
              "success",
            );
          },
        },
        {
          text: "🤔 我考虑考虑",
          hint: "推迟决定",
          apply: function (st) {
            st.flags._zhangIntroduced = true;
            st.relationships.sister_zhang.affinity = Math.min(
              100,
              (st.relationships.sister_zhang.affinity || 0) + 2,
            );
            StateManager.addMessage(
              "🤔 张姐说：'行，你慢慢考虑，机会不等人。'",
              "info",
            );
          },
        },
      ],
    },
    // ====== 事件1：老手特遇——跑腿老主顾的谢礼 ======
    // 设计意图：玩家长期跑腿/配送后遇到回头客，体现"城市开始认识你"的成长感
    {
      id: "delivery_regular_treat",
      phase: "street",
      icon: "🎁",
      title: "老主顾的问候",
      story:
        "你正在街上走着，一个中年男人快步迎上来——你认出来了，这是你一个月前帮忙送过紧急文件的那位客户。\n\n他笑着说：「可算碰上你了！上次你帮我送的那份标书中了！一直想谢谢你。」说着递过来一个袋子。",
      conditions: function (st) {
        // 检查玩家是否具备长期跑腿/配送的特征：driving技能≥15 或 agility≥28（经常行动）
        // 且游戏天数>30说明有足够时间积累客户
        if (st.player.day < 30) return false;
        if (st.skills && st.skills.driving && st.skills.driving.level >= 15)
          return true;
        if (
          st.player &&
          typeof st.player.agility === "number" &&
          st.player.agility >= 28
        )
          return true;
        // 如果totalEarned > 2000说明活跃，也可触发
        if (
          st.resources &&
          st.resources.totalEarned &&
          st.resources.totalEarned > 2000
        )
          return true;
        return false;
      },
      probability: 0.035,
      repeatable: false,
      choices: [
        {
          text: "🙏 谢谢！太客气了",
          hint: "心情+12，获得实用礼物",
          apply: function (st) {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            // 礼物：一些食品，帮助缓解饥饿
            st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 15);
            // 随机给一点感谢费
            var tip = Random.int(30, 80);
            st.resources.cash += tip;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + tip;
            StateManager.addMessage(
              "🎁 袋子里有一盒点心和¥" +
                tip +
                "。他说：「以后有需要还找你！」这座城市的某个角落，有人记住了你的好。",
              "success",
            );
          },
        },
        {
          text: "😊 举手之劳，不用破费",
          hint: "名气+3，给人留下好印象",
          apply: function (st) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            StateManager.addMessage(
              "😊 他坚持把点心塞给你：「拿着，别客气。现在像你这样认真做事的人不多了。」名气+3，心情+8。",
              "success",
            );
          },
        },
        {
          text: "📱 加个微信，以后有活直接找我",
          hint: "解锁长期客户，未来偶尔有额外收入",
          apply: function (st) {
            st.flags._regularClient = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "📱 你加了微信。他说：「好！我公司经常要送文件，以后优先找你。」名气+2，心情+5。未来可能偶尔有额外配送单。",
              "success",
            );
          },
        },
      ],
    },

    // ====== 事件2：专业人士视角——火眼金睛识假货 ======
    // 设计意图：高修理/电工技能的玩家在市场上能识别假冒工具，让技能在日常生活中有实际用处
    {
      id: "skilled_eye_fake_goods",
      phase: "street",
      icon: "🔍",
      title: "一眼识假",
      story:
        "路边有人摆摊卖「名牌电动工具」，价格只有商场的三分之一。电钻、角磨机堆了一地，摊主吆喝着「厂家直销，保修一年」。\n\n旁边有人掏钱要买，但你扫了一眼那做工——焊缝粗糙、标牌印刷模糊。你心里有了数。",
      conditions: function (st) {
        // 检查玩家是否具备识别假货的专业技能
        if (st.player.day < 15) return false;
        var repLevel =
          st.skills && st.skills.repair ? st.skills.repair.level || 0 : 0;
        var elecLevel =
          st.skills && st.skills.electrician
            ? st.skills.electrician.level || 0
            : 0;
        // 修理≥40 或 电工≥35 能识别
        return repLevel >= 40 || elecLevel >= 35;
      },
      probability: 0.03,
      repeatable: true,
      choices: [
        {
          text: "🚨 当场揭穿卖假货",
          hint: "名气+5，但可能被记恨",
          apply: function (st) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            // 小概率被摊主找麻烦
            if (Random.chance(0.2)) {
              st.status.health = Math.max(0, (st.status.health || 70) - 3);
              StateManager.addMessage(
                "🚨 你指出焊接缝粗糙、标牌有重影，摊主脸色大变骂骂咧咧收摊走了。旁边想买的人感激地朝你点头。名气+5，心情+10。刚才推搡中被蹭了一下，健康-3。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🚨 你指出几处明显造假痕迹，摊主嘴硬了几句，但围观的人渐渐散了。有人悄悄跟你道谢。名气+5，心情+10。",
                "success",
              );
            }
          },
        },
        {
          text: "🔧 买一个拆开研究",
          hint: "维修XP+40，损失¥50",
          apply: function (st) {
            if (st.resources.cash < 50) {
              StateManager.addMessage(
                "😅 你摸了摸口袋，连¥50的假货都买不起……",
                "warning",
              );
              return;
            }
            st.resources.cash -= 50;
            if (st.skills && st.skills.repair) {
              st.skills.repair.xp = (st.skills.repair.xp || 0) + 40;
            }
            st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
            StateManager.addMessage(
              "🔧 你买了一个假电钻，回去拆开一看——里面电机是劣质品，线圈缠绕也不规范，怪不得便宜。不过倒是学到了不少，维修XP+40，心智+2。",
              "info",
            );
          },
        },
        {
          text: "🚶 不关我事，走开",
          hint: "什么也不发生",
          apply: function (st) {
            StateManager.addMessage(
              "🚶 你摇了摇头走开了。这种事在这座城市每天都有，管不过来。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 事件3：NPC好感秘密——老周的批发市场渠道 ======
    // 设计意图：老周好感≥60后在批发市场透露私家渠道，NPC好感积累的实质性回报
    {
      id: "old_zhou_wholesale_tip",
      phase: "street",
      icon: "🤫",
      title: "老周的暗线",
      story:
        "你正在批发市场闲逛，突然有人拉了你一把——是老周。他压低声音说：「别出声，跟我来。」\n\n他带你拐进一条窄巷，七拐八拐到了一个不起眼的铁皮棚前：「这家回收站不对外，但关系到位的话收货价比外面高三成——我带你认个门。」",
      conditions: function (st) {
        // 老周好感≥60 + 在批发市场 + 天数>40
        if (st.player.day < 40) return false;
        if (
          !st.relationships ||
          !st.relationships.old_zhou ||
          (st.relationships.old_zhou.affinity || 0) < 60
        )
          return false;
        // 检查是否在批发市场
        var curLoc = st.trade && st.trade.currentLocation;
        return curLoc === "wholesaleMarket";
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "🤝 跟着认门！谢谢周叔",
          hint: "解锁废品高价渠道+30%，老周好感+8",
          apply: function (st) {
            st.flags._zhouWholesaleChannel = true;
            st.flags.zhouScrapBonus = true; // 叠加废品加成
            st.relationships.old_zhou.affinity = Math.min(
              100,
              (st.relationships.old_zhou.affinity || 0) + 8,
            );
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "🤝 老周跟铁皮棚里的人打了声招呼：「这是我小兄弟，以后他的货按内部价走。」你记下了地址，以后废品回收收入永久+30%。老周好感+8。",
              "success",
            );
            // 3天后渠道正式派上用场——第一笔高价回收
            if (typeof queueChainEvent === "function") {
              queueChainEvent(st, "zhou_channel_first_deal", 3, {});
            }
          },
        },
        {
          text: "📝 记下地址，改天再来",
          hint: "以后再说，好感+3",
          apply: function (st) {
            st.flags._zhouWholesaleChannelKnown = true;
            st.relationships.old_zhou.affinity = Math.min(
              100,
              (st.relationships.old_zhou.affinity || 0) + 3,
            );
            StateManager.addMessage(
              "📝 你记下了地址。老周说：「随时来，报我名字就行。」好感+3。",
              "success",
            );
          },
        },
        {
          text: "🤷 先不去了，不方便",
          hint: "好感-3，错过机会",
          apply: function (st) {
            st.relationships.old_zhou.affinity = Math.max(
              0,
              (st.relationships.old_zhou.affinity || 0) - 3,
            );
            StateManager.addMessage(
              "🤷 老周有点失望：「也行，以后有机会再说。」他独自走进了巷子深处。好感-3。",
              "warning",
            );
          },
        },
      ],
    },

    // ====== 事件4：道德分叉——路遇扒手 ======
    // 设计意图：相同的「看到扒手」场景，高道德和低道德玩家有截然不同的选择和后果
    {
      id: "moral_pickpocket_split",
      phase: "street",
      icon: "👤",
      title: "街头的暗影",
      story:
        "你在商业区的人群中看到一个人正鬼鬼祟祟地贴近前面背包的姑娘——他的手已经伸进了她的背包拉链缝隙。\n\n周围的人都忙着赶路，没人注意到。你只有几秒钟时间决定怎么做。",
      conditions: function (st) {
        // 天数>10，不重复
        if (st.player.day < 10) return false;
        if (st.flags._moralPickpocketSeen) return false;
        return true;
      },
      probability: 0.025,
      repeatable: false,
      choices: function (st) {
        var morality =
          st.player && st.player.morality !== undefined
            ? st.player.morality
            : 50;
        // 高道德（≥60）
        if (morality >= 60) {
          return [
            {
              text: "💪 冲上去抓住他的手！",
              hint: "见义勇为，但可能受伤",
              apply: function (s) {
                s.flags._moralPickpocketSeen = true;
                s.flags._moralScore = (s.flags._moralScore || 0) + 3;
                s.player.fame = Math.min(100, (s.player.fame || 0) + 8);
                s.player.morality = Math.min(
                  100,
                  (s.player.morality || 50) + 3,
                );
                s.needs.happiness = Math.min(
                  100,
                  (s.needs.happiness || 50) + 15,
                );
                // 随机受伤风险
                if (Random.chance(0.3)) {
                  s.status.health = Math.max(0, (s.status.health || 70) - 6);
                  StateManager.addMessage(
                    "💪 你一把抓住那只手！扒手挣扎中给了你一拳，但被旁边的人按住。姑娘的钱包保住了，她连连道谢。围观的人把你围住鼓掌。名气+8，道德+3，心情+15。挨了一拳健康-6。",
                    "success",
                  );
                } else {
                  StateManager.addMessage(
                    "💪 你大喝一声抓住那只手！扒手吓了一跳想跑，被你和路人一起拦住。姑娘的钱包保住了，她眼眶红红地不停道谢。名气+8，道德+3，心情+15。",
                    "success",
                  );
                }
                // 后续：3天后可能收到感谢信（链式）
                if (typeof queueChainEvent === "function") {
                  queueChainEvent(
                    s,
                    "moral_pickpocket_followup_kindness",
                    3,
                    {},
                  );
                }
              },
            },
            {
              text: "🗣️ 大声喊「有小偷！」",
              hint: "安全地提醒，扒手会跑",
              apply: function (s) {
                s.flags._moralPickpocketSeen = true;
                s.flags._moralScore = (s.flags._moralScore || 0) + 2;
                s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
                s.player.morality = Math.min(
                  100,
                  (s.player.morality || 50) + 1,
                );
                StateManager.addMessage(
                  "🗣️ 你一声大喊，扒手缩回手挤进人群跑了。姑娘赶紧捂住背包，感激地朝声音方向看了一眼。名气+3，道德+1。",
                  "success",
                );
              },
            },
            {
              text: "📸 拍下证据报警",
              hint: "理智处理，警方记录",
              apply: function (s) {
                s.flags._moralPickpocketSeen = true;
                s.flags._moralScore = (s.flags._moralScore || 0) + 2;
                s.player.intelligence = Math.min(
                  100,
                  (s.player.intelligence || 0) + 1,
                );
                StateManager.addMessage(
                  "📸 你悄悄拍了照片，走到远处打电话报警。警方说会调取监控。虽然没有当场制止，但留下了证据。智力+1。",
                  "info",
                );
              },
            },
          ];
        }
        // 低道德（≤35）
        if (morality <= 35) {
          return [
            {
              text: "💰 等扒手得手后跟上他",
              hint: "黑吃黑，道德-5，可能获利",
              apply: function (s) {
                s.flags._moralPickpocketSeen = true;
                s.flags._moralScore = (s.flags._moralScore || 0) - 5;
                s.player.morality = Math.max(0, (s.player.morality || 50) - 5);
                s.needs.happiness = Math.min(
                  100,
                  (s.needs.happiness || 50) - 5,
                );
                // 可能获利
                var loot = Random.int(80, 200);
                s.resources.cash += loot;
                s.resources.totalEarned = (s.resources.totalEarned || 0) + loot;
                StateManager.addMessage(
                  "💰 你尾随扒手到角落，压低声音：「见面分一半。」他愣了愣，不情愿地扔出¥" +
                    loot +
                    "。你拿着钱走了，心里说不上是什么滋味。道德-5，心情-5。",
                  "warning",
                );
              },
            },
            {
              text: "👀 假装没看见走开",
              hint: "什么也不做，但内心不安",
              apply: function (s) {
                s.flags._moralPickpocketSeen = true;
                s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 8);
                StateManager.addMessage(
                  "👀 你低下头快步走开。身后传来一声惊呼——姑娘发现钱包没了。你加快脚步，不想让自己卷入其中。心情-8。",
                  "warning",
                );
              },
            },
          ];
        }
        // 中间道德（36-59）：中性选择
        return [
          {
            text: "👀 假装没看见走开",
            hint: "不惹事，但良心不安",
            apply: function (s) {
              s.flags._moralPickpocketSeen = true;
              s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 5);
              StateManager.addMessage(
                "👀 你转过头走了。这座城市每天都有人在丢失东西，你不想惹麻烦。心情-5。",
                "warning",
              );
            },
          },
          {
            text: "🗣️ 远远喊一声「注意背包！」",
            hint: "不直接冲突，模糊提醒",
            apply: function (s) {
              s.flags._moralPickpocketSeen = true;
              s.flags._moralScore = (s.flags._moralScore || 0) + 1;
              s.player.fame = Math.min(100, (s.player.fame || 0) + 1);
              StateManager.addMessage(
                "🗣️ 你远远喊了一声。姑娘警觉地捂住背包，扒手装作路人走开了。虽然没抓到人，但至少没让她损失。名气+1。",
                "info",
              );
            },
          },
        ];
      },
    },

    // ====== 事件5：积累爆发——连续饥饿后的健康危机 ======
    // 设计意图：连续多天饥饿值<20的玩家会触发健康崩溃事件，让需求系统不再只是数字
    {
      id: "hunger_streak_collapse",
      phase: "street",
      icon: "💫",
      title: "撑不住了",
      story:
        "你走在路上，眼前突然一阵发黑。天旋地转，你赶紧扶住旁边的墙壁，但腿已经软了。\n\n路人的声音变得模糊而遥远——你已经记不清上次好好吃一顿饭是什么时候了。身体的忍耐到了极限。",
      conditions: function (st) {
        // 连续饥饿爆发：lowHungerStreak≥3（连续3天饥饿<25）
        // 且当前健康较差
        if (st.player.day < 10) return false;
        if (
          !st.flags ||
          !st.flags._habits ||
          (st.flags._habits.lowHungerStreak || 0) < 3
        )
          return false;
        if (!st.status || (st.status.health || 70) >= 50) return false;
        return true;
      },
      probability: 0.15, // 条件严格，满足后高概率触发
      repeatable: true, // 只要满足条件可能再次发生
      choices: [
        {
          text: "🏥 去医院看看",
          hint: "强制的，¥150-300，健康恢复+15",
          apply: function (st) {
            var cost = Random.int(150, 300);
            if (st.resources.cash < cost) {
              // 钱不够也要去，欠费
              var actualCost = st.resources.cash;
              st.resources.cash = 0;
              st.resources.debt =
                (st.resources.debt || 0) + (cost - actualCost);
              StateManager.addMessage(
                "🏥 你被路人送进了医院。医生说你严重营养不良加低血糖。打了一针开了药，花了¥" +
                  actualCost +
                  "，还欠了¥" +
                  (cost - actualCost) +
                  "。",
                "warning",
              );
            } else {
              st.resources.cash -= cost;
            }
            st.status.health = Math.min(100, (st.status.health || 50) + 15);
            // 重置饥饿积累
            if (st.flags && st.flags._habits) {
              st.flags._habits.lowHungerStreak = 0;
            }
            // 强制补充一些饥饿
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 30);
            StateManager.addMessage(
              "🏥 医生说：「年轻人，再这样下去会出大事的。饭一定要吃，再穷也得吃。」你躺在病床上，盯着天花板发呆。健康+15。",
              "info",
            );
          },
        },
        {
          text: "🤝 找朋友帮忙",
          hint: "需要NPC好感≥40，免费吃饭恢复",
          apply: function (st) {
            var hasHelp = false;
            // 检查是否有好感≥40的NPC
            if (st.relationships) {
              for (var nid in st.relationships) {
                if (
                  st.relationships[nid] &&
                  (st.relationships[nid].affinity || 0) >= 40
                ) {
                  hasHelp = true;
                  // 找其中好感最高的
                  var bestNpc = nid;
                  var maxAff = st.relationships[nid].affinity;
                  for (var nid2 in st.relationships) {
                    if (
                      st.relationships[nid2] &&
                      (st.relationships[nid2].affinity || 0) > maxAff
                    ) {
                      bestNpc = nid2;
                      maxAff = st.relationships[nid2].affinity;
                    }
                  }
                  if (bestNpc === "aunt_wang") {
                    st.needs.hunger = Math.min(
                      100,
                      (st.needs.hunger || 0) + 40,
                    );
                    st.status.health = Math.min(
                      100,
                      (st.status.health || 50) + 8,
                    );
                    st.relationships.aunt_wang.affinity = Math.min(
                      100,
                      (st.relationships.aunt_wang.affinity || 0) + 3,
                    );
                    StateManager.addMessage(
                      "🤝 你找到王大婶。她一看到你的脸色就骂开了：「作死啊！不吃饭省钱省到医院去了？」然后端出一大碗热腾腾的面条。王大婶好感+3，饥饿+40，健康+8。",
                      "success",
                    );
                  } else if (bestNpc === "chef_chen") {
                    st.needs.hunger = Math.min(
                      100,
                      (st.needs.hunger || 0) + 45,
                    );
                    st.status.health = Math.min(
                      100,
                      (st.status.health || 50) + 10,
                    );
                    st.relationships.chef_chen.affinity = Math.min(
                      100,
                      (st.relationships.chef_chen.affinity || 0) + 3,
                    );
                    StateManager.addMessage(
                      "🤝 陈师傅看你脸色不对，二话不说给你炒了一大盘炒饭。「吃！不收你钱。人吃饱了才有力气活。」饥饿+45，健康+10。",
                      "success",
                    );
                  } else {
                    // 通用处理
                    st.needs.hunger = Math.min(
                      100,
                      (st.needs.hunger || 0) + 35,
                    );
                    st.status.health = Math.min(
                      100,
                      (st.status.health || 50) + 8,
                    );
                    StateManager.addMessage(
                      "🤝 你找到了一位朋友，他们一看你的样子就拉你去吃饭。虽然不好意思，但你还是吃了。饥饿+35，健康+8。",
                      "success",
                    );
                  }
                  break;
                }
              }
            }
            if (!hasHelp) {
              StateManager.addMessage(
                "😅 你想找个人帮忙，掏出手机翻了一遍通讯录，好像跟谁也没熟到那个份上……",
                "warning",
              );
              // fallback: 钱减半
              StateManager.addMessage(
                "你咬着牙在路边小摊买了俩包子，花了¥8。饥饿+15。",
                "info",
              );
              if (st.resources.cash >= 8) {
                st.resources.cash -= 8;
              }
              st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 15);
            }
            // 重置饥饿积累
            if (st.flags && st.flags._habits) {
              st.flags._habits.lowHungerStreak = 0;
            }
          },
        },
        {
          text: "😤 咬牙硬撑",
          hint: "不花钱，但健康-10，可能真的出事",
          apply: function (st) {
            st.status.health = Math.max(0, (st.status.health || 50) - 10);
            // 小概率真的昏倒被送医院（强制更高费用）
            if (Random.chance(0.3)) {
              var forcedCost = Random.int(200, 400);
              if (st.resources.cash >= forcedCost) {
                st.resources.cash -= forcedCost;
              } else {
                st.resources.debt =
                  (st.resources.debt || 0) +
                  forcedCost -
                  (st.resources.cash || 0);
                st.resources.cash = 0;
              }
              st.status.health = Math.min(
                100,
                Math.max(0, (st.status.health || 50) + 5),
              );
              st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 20);
              if (st.flags && st.flags._habits) {
                st.flags._habits.lowHungerStreak = 0;
              }
              StateManager.addMessage(
                "😤 你硬撑着走了几步，眼前一黑倒在了地上。醒来时已经在医院，手上扎着点滴。护士说：「低血糖昏迷，再晚送来就危险了。」花了¥" +
                  forcedCost +
                  "，欠了债。健康+5，饥饿+20。",
                "danger",
              );
            } else {
              StateManager.addMessage(
                "😤 你咬着牙挺过来了。但身体在强烈抗议，你知道这样下去不是办法。健康-10。",
                "warning",
              );
            }
          },
        },
      ],
    },

    // ====== 事件6：积累爆发——连续疲劳后的过劳危机 ======
    // 设计意图：与 hunger_streak_collapse 对称，但针对疲劳系统。
    // 连续3天疲劳>80的玩家会触发过劳危机，让"疲劳"不只是个数字，
    // 而是真正有后果的游戏机制。同时给"休息"行动赋予战略价值。
    {
      id: "fatigue_streak_collapse",
      phase: "street",
      icon: "😵",
      title: "身体被掏空",
      story:
        "你走在路上，脚步越来越沉，视线开始模糊。这几天你几乎没怎么休息，身体已经到了极限。\n\n你扶着墙喘气，心跳快得像要从嗓子眼蹦出来。路过的行人看了你一眼，又匆匆走开——这座城市的每个人都忙着赶自己的路。",
      conditions: function (st) {
        // 连续3天疲劳>80
        if (st.player.day < 10) return false;
        if (
          !st.flags ||
          !st.flags._habits ||
          (st.flags._habits.highFatigueStreak || 0) < 3
        )
          return false;
        // 当前也要疲劳高
        if (!st.needs || (st.needs.fatigue || 0) < 75) return false;
        return true;
      },
      probability: 0.15,
      repeatable: true,
      choices: [
        {
          text: "🏥 去诊所挂水",
          hint: "强制的，¥200-400，疲劳-30，健康+10",
          apply: function (st) {
            var cost = Random.int(200, 400);
            if (st.resources.cash < cost) {
              var actualCost = st.resources.cash;
              st.resources.cash = 0;
              st.resources.debt =
                (st.resources.debt || 0) + (cost - actualCost);
              StateManager.addMessage(
                "🏥 你被送到诊所，医生说你这是严重过劳。打了点滴开了药，花了¥" +
                  actualCost +
                  "，还欠了¥" +
                  (cost - actualCost) +
                  "。",
                "warning",
              );
            } else {
              st.resources.cash -= cost;
              StateManager.addMessage(
                "🏥 你到诊所挂了两瓶水，医生说：「年轻人，再这样下去心脏会出问题。」花了¥" +
                  cost +
                  "。",
                "info",
              );
            }
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 30);
            st.status.health = Math.min(100, (st.status.health || 70) + 10);
            // 重置疲劳积累
            if (st.flags && st.flags._habits) {
              st.flags._habits.highFatigueStreak = 0;
            }
            StateManager.addMessage(
              "🏥 休息了半天，疲劳-30，健康+10。你躺在病床上，盯着天花板，决定不能再这样透支了。",
              "info",
            );
          },
        },
        {
          text: "😴 找个地方睡一觉",
          hint: "免费，恢复慢，疲劳-15",
          apply: function (st) {
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            st.status.health = Math.min(100, (st.status.health || 70) + 3);
            // 小概率被驱赶（露宿街头时）
            if ((!st.housing || st.housing.tier === 0) && Random.chance(0.3)) {
              StateManager.addMessage(
                "😴 你在桥洞下找了个角落眯了一会儿，但被路过的保安赶走了。只睡了不到一小时，疲劳-15，健康+3。",
                "warning",
              );
            } else {
              if (st.flags && st.flags._habits) {
                st.flags._habits.highFatigueStreak = 0;
              }
              StateManager.addMessage(
                "😴 你找了个能遮风挡雨的地方，蜷缩着睡了一觉。醒来时感觉好了一些，虽然还远远不够。疲劳-15，健康+3。",
                "info",
              );
            }
          },
        },
        {
          text: "💊 买瓶功能饮料硬撑",
          hint: "¥15，疲劳-8，但治标不治本",
          apply: function (st) {
            if (st.resources.cash < 15) {
              StateManager.addMessage(
                "😅 你摸了摸口袋，连¥15的功能饮料都买不起……",
                "warning",
              );
              return;
            }
            st.resources.cash -= 15;
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 8);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            st.status.health = Math.max(0, (st.status.health || 70) - 3);
            StateManager.addMessage(
              "💊 你灌了一瓶功能饮料，苦涩的液体滑过喉咙。心跳又加速了，但你告诉自己还能撑。疲劳-8，健康-3，心情-3。你知道这只是在透支明天。",
              "warning",
            );
          },
        },
      ],
    },

    // ====== 事件7：技能组合——跨界商业洞察 ======
    // 设计意图：当玩家同时拥有多个技能且达到一定水平后，
    // 解锁纯靠单一技能无法获得的跨界洞察。
    // 鼓励玩家全面发展，而不是只刷一个技能。
    // 联动：烹饪+管理→餐饮创业灵感，修理+销售→二手翻新商机
    {
      id: "skill_combo_insight",
      phase: "street",
      icon: "💡",
      title: "一通百通",
      story:
        "你蹲在路边吃盒饭的时候，脑子里突然闪过一个念头——你会的这几样本事，好像可以串起来。\n\n你见过太多人只会一门手艺，但很少有人能把两样本事结合起来。也许……这就是你的机会？",
      conditions: function (st) {
        if (st.player.day < 30) return false;
        if (st.flags._skillComboInsightTriggered) return false;
        // 检查技能组合：两项技能都≥20/30
        if (!st.skills) return false;
        var cooking = st.skills.cooking ? st.skills.cooking.level || 0 : 0;
        var management = st.skills.management
          ? st.skills.management.level || 0
          : 0;
        var repair = st.skills.repair ? st.skills.repair.level || 0 : 0;
        var sales = st.skills.sales ? st.skills.sales.level || 0 : 0;
        // 烹饪+管理 (餐饮创业线)
        if (cooking >= 30 && management >= 20) return true;
        // 修理+销售 (翻新转卖线)
        if (repair >= 30 && sales >= 20) return true;
        return false;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "💡 认真琢磨这个想法",
          hint: "心智+5，获得商业灵感buff",
          apply: function (st) {
            st.flags._skillComboInsightTriggered = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            // 判断哪种组合触发
            var cooking = st.skills.cooking ? st.skills.cooking.level || 0 : 0;
            var management = st.skills.management
              ? st.skills.management.level || 0
              : 0;
            var repair = st.skills.repair ? st.skills.repair.level || 0 : 0;
            var sales = st.skills.sales ? st.skills.sales.level || 0 : 0;
            if (cooking >= 30 && management >= 20) {
              st.flags._comboCookingMgmt = true;
              StateManager.addMessage(
                "💡 你突然想通了：你既懂做菜又懂管理，完全可以先从小吃摊做起，积累资金再开正式餐厅。这条路可行！心智+5，心情+10。解锁了「餐饮创业」的思路。",
                "success",
              );
            } else if (repair >= 30 && sales >= 20) {
              st.flags._comboRepairSales = true;
              StateManager.addMessage(
                "💡 你灵光一闪：你既会修东西又会卖东西，可以低价回收旧家具家电，翻新后高价转卖！这门生意几乎零成本起步。心智+5，心情+10。解锁了「翻新转卖」的思路。",
                "success",
              );
            }
          },
        },
        {
          text: "📝 记下来，以后再说",
          hint: "保留想法，心智+2",
          apply: function (st) {
            st.flags._skillComboInsightTriggered = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
            StateManager.addMessage(
              "📝 你在手机备忘录里记下了这个想法。也许以后会用到，也许不会。但至少证明你的脑子还在转。心智+2。",
              "info",
            );
          },
        },
        {
          text: "🍚 先把饭吃完再说",
          hint: "什么也不发生",
          apply: function (st) {
            st.flags._skillComboInsightTriggered = true;
            StateManager.addMessage(
              "🍚 你摇了摇头，专心把盒饭吃完。想法太多也没用，先把眼前的日子过好再说。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 事件8：双NPC好感联动——王婶和老周的联手推荐 ======
    // 设计意图：当玩家和两个NPC都有深度关系时，NPC之间会互相联动，
    // 产生1+1>2的效果。让玩家感觉经营多人际关系有回报，
    // 而不是只跟一个NPC搞好关系就够了。
    {
      id: "npc_duo_referral",
      phase: "street",
      icon: "🤝",
      title: "两位老熟人的心意",
      story:
        "你刚回到城中村，就看到王大婶和老周站在巷口说话，看到你一起招手。\n\n王大婶先开口：「我跟老周商量了一下，你在这城里也混了这么久了，踏实肯干，我们俩想给你牵个线——」\\n老周接话：「城西物流园在招固定工，包吃住，月薪¥3500起。我侄子在那边当主管，你跟他说是我介绍的就行。」",
      conditions: function (st) {
        // 王大婶好感≥50 且 老周好感≥50
        if (st.player.day < 40) return false;
        if (
          !st.relationships ||
          !st.relationships.aunt_wang ||
          !st.relationships.old_zhou
        )
          return false;
        var wangAff = st.relationships.aunt_wang.affinity || 0;
        var zhouAff = st.relationships.old_zhou.affinity || 0;
        if (wangAff < 50 || zhouAff < 50) return false;
        if (st.flags._npcDuoReferralDone) return false;
        return true;
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "🙏 太感谢了！我一定去",
          hint: "获得稳定工作机会，月薪¥3500+",
          apply: function (st) {
            st.flags._npcDuoReferralDone = true;
            st.flags._logisticsJobReferral = true;
            st.relationships.aunt_wang.affinity = Math.min(
              100,
              (st.relationships.aunt_wang.affinity || 0) + 5,
            );
            st.relationships.old_zhou.affinity = Math.min(
              100,
              (st.relationships.old_zhou.affinity || 0) + 5,
            );
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            StateManager.addMessage(
              "🙏 你连声道谢。王大婶笑着说：「好好干，别给我们丢脸。」老周拍了拍你的肩膀：「物流园里活不重，比你在外面风吹日晒强。」心情+15，王大婶好感+5，老周好感+5。解锁了物流园固定工作机会。",
              "success",
            );
          },
        },
        {
          text: "😊 谢谢两位，我考虑一下",
          hint: "好感+3，保留机会",
          apply: function (st) {
            st.flags._npcDuoReferralDone = true;
            st.flags._logisticsJobReferral = true;
            st.relationships.aunt_wang.affinity = Math.min(
              100,
              (st.relationships.aunt_wang.affinity || 0) + 3,
            );
            st.relationships.old_zhou.affinity = Math.min(
              100,
              (st.relationships.old_zhou.affinity || 0) + 3,
            );
            StateManager.addMessage(
              "😊 你说想考虑一下。王大婶说：「行，你想好了跟我们说，位置给你留着。」好感各+3。",
              "info",
            );
          },
        },
        {
          text: "🤷 我暂时还不想固定下来",
          hint: "婉拒，但好感不变",
          apply: function (st) {
            st.flags._npcDuoReferralDone = true;
            StateManager.addMessage(
              "🤷 你说现在还不想定下来。王大婶和老周对视一眼，老周说：「也行，年轻人想多闯闯是好事。有需要随时说。」",
              "info",
            );
          },
        },
      ],
    },

    // ====== 事件9：道德积累——善有善报 ======
    // 设计意图：道德系统不只是惩罚，也要有正向激励。
    // 累计道德分≥15后，触发路人回报事件，让玩家感受到"好人好报"。
    // 与moral_pickpocket事件不同，这不是单次选择，而是长期积累的回馈。
    {
      id: "moral_good_karma",
      phase: "street",
      icon: "🌟",
      title: "陌生的善意",
      story:
        "你在街上走着，一个中年女人突然叫住你。你愣了一下——你不认识她。\n\n她笑着说：「你不记得我了？上个月在菜市场，我钱包被偷了，是你帮我报警还垫了车费让我回家。我一直想找机会谢谢你！」\n\n你这才想起来，确实有这么回事。当时你也没多想，顺手帮了一把。",
      conditions: function (st) {
        // 道德累计分≥15（多次善行的积累）
        if (st.player.day < 20) return false;
        if (!st.flags || !st.flags.moral) return false;
        var moralScore = st.flags.moral.score || 0;
        if (moralScore < 15) return false;
        // 30天冷却
        if (
          st.flags._moralKarmaDay &&
          st.player.day - st.flags._moralKarmaDay < 30
        )
          return false;
        return true;
      },
      probability: 0.03,
      repeatable: true,
      choices: [
        {
          text: "😊 举手之劳，不用放心上",
          hint: "道德+3，名气+5，对方坚持答谢",
          apply: function (st) {
            st.flags._moralKarmaDay = st.player.day;
            st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            if (st.flags.moral) {
              st.flags.moral.score = Math.min(
                100,
                (st.flags.moral.score || 0) + 2,
              );
            }
            // 对方坚持给答谢
            var reward = Random.int(50, 150);
            st.resources.cash += reward;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + reward;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            StateManager.addMessage(
              "😊 你摆摆手说不用。她硬是塞给你一袋水果和¥" +
                reward +
                "：「你这样的人不多了，拿着吧，别客气。」道德+3，名气+5，心情+20，收到¥" +
                reward +
                "。你发现做好事的感觉，比赚钱更让人开心。",
              "success",
            );
          },
        },
        {
          text: "🙏 谢谢，有心了",
          hint: "接受感谢，心情+15",
          apply: function (st) {
            st.flags._moralKarmaDay = st.player.day;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            // 对方给答谢
            var reward = Random.int(30, 100);
            st.resources.cash += reward;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + reward;
            StateManager.addMessage(
              "🙏 你笑了笑说：「谁都有困难的时候。」她感动地点点头，塞给你¥" +
                reward +
                "。心情+15。这座城市虽然冷漠，但善意总会以某种方式回到你身边。",
              "success",
            );
          },
        },
        {
          text: "😅 其实我那天也是碰巧",
          hint: "诚实，道德+1，心智+1",
          apply: function (st) {
            st.flags._moralKarmaDay = st.player.day;
            st.player.morality = Math.min(100, (st.player.morality || 50) + 1);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            StateManager.addMessage(
              "😅 你挠了挠头说：「那天也是碰巧遇到，换了谁都会帮忙的。」她说：「但帮了就是帮了，我记在心里。」道德+1，心智+1，心情+10。",
              "success",
            );
          },
        },
      ],
    },

    // ====== 事件10：低卫生社交后果——被嫌弃的一天 ======
    // 设计意图：卫生系统长期被忽略，因为"不洗澡"没有即时后果。
    // 连续低卫生让玩家在社交场合遭遇尴尬，
    // 使卫生维护成为一个有意义的战略决策。
    {
      id: "hygiene_social_awkward",
      phase: "street",
      icon: "😰",
      title: "一身汗味",
      story:
        "你走进一家小面馆，刚坐下，旁边的大姐就皱了皱眉，往旁边挪了挪。\n\n老板端着面过来，放下碗的时候也偏过头去。你低头闻了闻自己——一股酸臭味。你记不清上次洗澡是什么时候了。",
      conditions: function (st) {
        // 连续2天卫生<30
        if (st.player.day < 5) return false;
        if (
          !st.flags ||
          !st.flags._habits ||
          (st.flags._habits.lowHygieneStreak || 0) < 2
        )
          return false;
        if (!st.needs || (st.needs.hygiene || 100) >= 30) return false;
        return true;
      },
      probability: 0.12,
      repeatable: true,
      choices: [
        {
          text: "😅 尴尬地快速吃完离开",
          hint: "心情-8，但省钱",
          apply: function (st) {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
            st.player.mental = Math.max(0, (st.player.mental || 0) + 1);
            StateManager.addMessage(
              "😅 你低着头快速吃完面，放下钱就走了。走到门口你深吸一口气——下次一定记得洗澡。心情-8，但这段尴尬让你长了记性，心智+1。",
              "warning",
            );
          },
        },
        {
          text: "💪 自嘲一下，跟老板道歉",
          hint: "心智+2，可能获得理解",
          apply: function (st) {
            st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            // 小概率获得理解
            if (Random.chance(0.4)) {
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 5,
              );
              StateManager.addMessage(
                "💪 你自嘲地笑了笑说：「老板，不好意思，最近忙得连澡都没洗。」老板愣了一下，反而笑了：「没事，年轻人谁没狼狈过。来，送你个荷包蛋。」心情-3，心智+2，但老板的善意让你稍微好受了些。",
                "info",
              );
            } else {
              StateManager.addMessage(
                "💪 你自嘲地笑了笑，老板没说什么，但也没再皱眉。你快速吃完离开。心智+2，心情-3。",
                "info",
              );
            }
          },
        },
        {
          text: "🏃 赶紧去澡堂洗个澡",
          hint: "¥15，卫生+30，但可能耽误事",
          apply: function (st) {
            if (st.resources.cash < 15) {
              StateManager.addMessage(
                "😅 你摸了摸口袋，连¥15的澡堂钱都没有……只好尴尬地离开。",
                "warning",
              );
              return;
            }
            st.resources.cash -= 15;
            st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 30);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            // 重置卫生积累
            if (st.flags && st.flags._habits) {
              st.flags._habits.lowHygieneStreak = 0;
            }
            StateManager.addMessage(
              "🏃 你冲出面馆，直奔附近的公共澡堂。热水冲刷下来的时候，你感觉整个人都活过来了。卫生+30，心情+8。花了¥15，但这一身清爽，值了。",
              "success",
            );
          },
        },
      ],
    },

    // ====== 事件11：天气社交——暴雨中的临时避难点 ======
    // 设计意图：暴雨/台风天露宿玩家被迫找避雨处，遇到其他处境相似的人
    // 突发天气+底层社交+信息交换
    {
      id: "storm_shelter_meet",
      phase: "street",
      icon: "🏚️",
      title: "同一屋檐下",
      story:
        "暴雨突然倾盆而下，你浑身湿透地冲进一座废弃楼的屋檐下。里面已经蹲着两个人——一个裹着军大衣的老人，一个抱着书包的学生。\n\n老人抬头看了你一眼，往旁边挪了挪：「挤挤，雨大。」学生也往旁边让了让。",
      conditions: function (st) {
        // 暴雨/台风天气 + 露宿或低档住所
        if (st.player.day < 5) return false;
        if (
          !st.weather ||
          (st.weather.current !== "stormy" && st.weather.current !== "typhoon")
        )
          return false;
        if (!st.housing || st.housing.tier === undefined || st.housing.tier > 1)
          return false;
        if (
          st.flags._stormShelterDay &&
          st.player.day - st.flags._stormShelterDay < 15
        )
          return false;
        return true;
      },
      probability: 0.06,
      repeatable: true,
      choices: [
        {
          text: "🤝 跟老人聊聊天",
          hint: "获得城市生存技巧，心智+2",
          apply: function (st) {
            st.flags._stormShelterDay = st.player.day;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (Random.chance(0.3)) {
              st.flags._oldManTip = true;
              StateManager.addMessage(
                "🤝 老人自称老刘，在这座城市流浪了十几年。他指了指远处的天桥：「那边晚上暖和，冬天我都在那过夜。」又塞给你一张皱巴巴的纸条，上面写着一个施粥点的地址。心智+2，心情+8，获得流浪者生存指点。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🤝 老人讲起他在城里的经历——年轻时在工地干活，后来干不动了就在街上晃荡。他说话很慢，但每句话都带着日子磨出来的味道。心智+2，心情+8。",
                "info",
              );
            }
          },
        },
        {
          text: "📚 跟学生聊聊",
          hint: "智力+1，获得免费学习资料",
          apply: function (st) {
            st.flags._stormShelterDay = st.player.day;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 1,
            );
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (st.skills && st.skills.english) {
              st.skills.english.xp = (st.skills.english.xp || 0) + 25;
            }
            StateManager.addMessage(
              "📚 学生叫小张，在城东技校上学。他掏出手机说：「我在学英语，这个APP免费的，你要不要试试？」他教了你几个常用的商务英语短语。智力+1，英语XP+25，心情+5。",
              "success",
            );
          },
        },
        {
          text: "😐 缩在角落不说话",
          hint: "什么也不发生",
          apply: function (st) {
            st.flags._stormShelterDay = st.player.day;
            StateManager.addMessage(
              "😐 你缩在墙角，抱着膝盖等雨停。老人和学生也各自沉默。雨打在屋檐上的声音填满了整个空间。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 事件12：NPC联动——陈师傅教新菜 ======
    // 设计意图：陈师傅好感≥40时在商业区触发，教玩家一道新菜
    // NPC+技能+心情，让烹饪成为有温度的互动
    {
      id: "chef_chen_teaching",
      phase: "street",
      icon: "🍳",
      title: "陈师傅的新菜",
      story:
        "你路过陈师傅的摊子时，他正在捣鼓一个新酱料，满手都是红彤彤的辣椒碎。\n\n看到你，他眼睛一亮：「来得正好！我新研制了个麻辣配方，你帮我尝尝咸淡——别光尝，来来来，我教你怎么调。」",
      conditions: function (st) {
        if (st.player.day < 20) return false;
        if (!st.relationships || !st.relationships.chef_chen) return false;
        if ((st.relationships.chef_chen.affinity || 0) < 40) return false;
        var curLoc = st.trade && st.trade.currentLocation;
        if (curLoc !== "commercialDist") return false;
        if (
          st.flags._chefChenTaughtRecipeDay &&
          st.player.day - st.flags._chefChenTaughtRecipeDay < 20
        )
          return false;
        return true;
      },
      probability: 0.035,
      repeatable: true,
      choices: [
        {
          text: "🙏 好！正好学一手",
          hint: "烹饪XP+80，心情+10，陈师傅好感+5",
          apply: function (st) {
            st.flags._chefChenTaughtRecipeDay = st.player.day;
            if (st.skills && st.skills.cooking) {
              st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 80;
            }
            st.relationships.chef_chen.affinity = Math.min(
              100,
              (st.relationships.chef_chen.affinity || 0) + 5,
            );
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            StateManager.addMessage(
              "🙏 陈师傅手把手教你调酱：「辣椒先焙一下出香味，蒜末最后放才不苦。」你学了一手地道的麻辣调料配方，以后做饭效果更好了！烹饪XP+80，心情+10，陈师傅好感+5。",
              "success",
            );
          },
        },
        {
          text: "😋 尝一口给意见",
          hint: "心情+8，陈师傅好感+3",
          apply: function (st) {
            st.flags._chefChenTaughtRecipeDay = st.player.day;
            st.relationships.chef_chen.affinity = Math.min(
              100,
              (st.relationships.chef_chen.affinity || 0) + 3,
            );
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 10);
            StateManager.addMessage(
              "😋 你尝了一口——辣得直呼气但确实香！陈师傅得意地笑了：「是吧？我琢磨了一礼拜。」心情+8，好感+3，饥饿+10。",
              "success",
            );
          },
        },
        {
          text: "🚶 今天没空，改天吧",
          hint: "什么也不发生",
          apply: function (st) {
            StateManager.addMessage(
              "🚶 你说赶时间。陈师傅摆摆手：「行，有空再来，这酱我给你留着。」",
              "info",
            );
          },
        },
      ],
    },

    // ====== 事件13：装备联动——装备突然损坏 ======
    // 设计意图：装备系统联动，低耐久装备在关键时刻掉链子
    // 装备+经济+心情，让维护装备成为必要
    {
      id: "equipment_break_alert",
      phase: "street",
      icon: "🔧",
      title: "家伙事儿不行了",
      story:
        "你正准备干活，手里的工具突然发出一声不妙的响动——把手松了，刀刃钝了，或者带子断了。\n\n这套装备跟了你有一阵子了，一直在将就用，但今天它终于扛不住了。",
      conditions: function (st) {
        if (st.player.day < 10) return false;
        // 检查是否有任何装备实例耐久≤20
        if (!st.inventory || !st.inventory.equipmentInstances) return false;
        var equip = st.inventory.equipmentInstances;
        var hasLowDurability = false;
        for (var slot in equip) {
          if (
            equip[slot] &&
            equip[slot].durability !== undefined &&
            equip[slot].durability <= 20
          ) {
            hasLowDurability = true;
            break;
          }
        }
        if (!hasLowDurability) return false;
        if (
          st.flags._equipBreakDay &&
          st.player.day - st.flags._equipBreakDay < 10
        )
          return false;
        return true;
      },
      probability: 0.05,
      repeatable: true,
      choices: [
        {
          text: "🔧 自己修一下继续用",
          hint: "需修理技能≥15，恢复耐久+25",
          apply: function (st) {
            st.flags._equipBreakDay = st.player.day;
            var repLevel =
              st.skills && st.skills.repair ? st.skills.repair.level || 0 : 0;
            if (repLevel >= 15) {
              // 找到耐久最低的装备维修
              var equip = st.inventory.equipmentInstances;
              var worstSlot = null;
              var worstDur = 999;
              for (var slot in equip) {
                if (
                  equip[slot] &&
                  equip[slot].durability !== undefined &&
                  equip[slot].durability < worstDur
                ) {
                  worstDur = equip[slot].durability;
                  worstSlot = slot;
                }
              }
              if (worstSlot) {
                equip[worstSlot].durability = Math.min(
                  100,
                  (equip[worstSlot].durability || 0) + 25,
                );
                if (st.skills && st.skills.repair) {
                  st.skills.repair.xp = (st.skills.repair.xp || 0) + 15;
                }
              }
              StateManager.addMessage(
                "🔧 你拆开检查了一下——还好问题不大，螺丝紧一紧、油上一点就好了。修理XP+15，装备耐久+25。手艺在身，省了一笔维修费。",
                "success",
              );
            } else {
              // 修理技能不够，修不好
              if (st.skills && st.skills.repair) {
                st.skills.repair.xp = (st.skills.repair.xp || 0) + 5;
              }
              st.player.mental = Math.max(0, (st.player.mental || 0) - 2);
              StateManager.addMessage(
                "🔧 你试着修了一下，但手艺不到家，越弄越糟。放弃。修理XP+5（至少学了点），心智-2。看来得找专业师傅或者买新的了。",
                "warning",
              );
            }
          },
        },
        {
          text: "💰 买新的替换",
          hint: "¥100-300，换上新装备",
          apply: function (st) {
            st.flags._equipBreakDay = st.player.day;
            var cost = Random.int(100, 300);
            if (st.resources.cash < cost) {
              StateManager.addMessage(
                "😅 你摸了摸口袋，连¥" +
                  cost +
                  "都拿不出来……只好凑合着用坏掉的装备。",
                "warning",
              );
              return;
            }
            st.resources.cash -= cost;
            // 修复所有装备耐久
            var equip = st.inventory.equipmentInstances;
            for (var slot in equip) {
              if (equip[slot] && equip[slot].durability !== undefined) {
                equip[slot].durability = Math.min(
                  100,
                  (equip[slot].durability || 0) + 40,
                );
              }
            }
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) - 5);
            StateManager.addMessage(
              "💰 你花了¥" +
                cost +
                "买了新的替换件装上。肉疼是肉疼，但工具顺了干活才顺。心情-5。",
              "info",
            );
          },
        },
        {
          text: "😤 将就用，等彻底坏了再说",
          hint: "免费，但效率降低",
          apply: function (st) {
            st.flags._equipBreakDay = st.player.day;
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
            StateManager.addMessage(
              "😤 你用胶带缠了缠勉强继续用。干活时总有点使不上劲，心里也烦躁。心情-5。你知道这样撑不了多久。",
              "warning",
            );
          },
        },
      ],
    },

    // ====== 事件14：职业倦怠——长期同工后的疲软 ======
    // 设计意图：连续多天干同一类工作触发倦怠事件，防止"无脑刷"
    // 工作+健康+心智，鼓励工作多样性
    {
      id: "job_burnout_warning",
      phase: "street",
      icon: "😩",
      title: "干腻了",
      story:
        "你今天照常去干活，但一到地方就觉得胸口发闷。同样的动作、同样的路线、同样的吆喝——你已经重复了不知道多少遍。\n\n你坐在路沿石上，看着别的摊位发呆。脑子里有个声音在说：「还要这样干多久？」",
      conditions: function (st) {
        if (st.player.day < 20) return false;
        // 通过高疲劳和低心情间接判断倦怠
        if (!st.needs) return false;
        if ((st.needs.happiness || 50) > 30) return false;
        if ((st.needs.fatigue || 0) < 60) return false;
        if (
          st.flags._jobBurnoutDay &&
          st.player.day - st.flags._jobBurnoutDay < 14
        )
          return false;
        return true;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "💪 换个活干几天",
          hint: "心智+3，疲劳-10，可能找到新方向",
          apply: function (st) {
            st.flags._jobBurnoutDay = st.player.day;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "💪 你决定换个活法。去批发市场转了转，发现有个摊位在招临时搬运工。虽然也是体力活，但新鲜感让精神好了不少。心智+3，疲劳-10，心情+5。有时候换个环境比硬撑有用。",
              "success",
            );
          },
        },
        {
          text: "📚 请半天假去学习充电",
          hint: "心智+4，疲劳+5，技能XP+30",
          apply: function (st) {
            st.flags._jobBurnoutDay = st.player.day;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 4);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
            if (st.skills) {
              var keys = Object.keys(st.skills);
              if (keys.length > 0) {
                var k = Random.fromArray(keys);
                if (st.skills[k] && typeof st.skills[k].xp !== "undefined") {
                  st.skills[k].xp = (st.skills[k].xp || 0) + 30;
                  StateManager.addMessage(
                    "📚 你跑到图书馆窝了半天，随手翻了一本关于" +
                      k +
                      "的书。虽然没看完，但学到了一些新东西。" +
                      k +
                      " XP+30，心智+4。",
                    "success",
                  );
                }
              }
            } else {
              StateManager.addMessage(
                "📚 你跑到图书馆窝了半天，翻了翻书。虽然没完全看进去，但脑子总算换了个频道。心智+4。",
                "info",
              );
            }
          },
        },
        {
          text: "😤 咬咬牙接着干",
          hint: "心情-8，但今天收入+20%",
          apply: function (st) {
            st.flags._jobBurnoutDay = st.player.day;
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
            st.flags._burnoutHardWorkDay = st.player.day;
            StateManager.addMessage(
              "😤 你咬咬牙站起来接着干。虽然心里一万个不情愿，但手没停。今天比平时多干了一些——但你知道这样撑不了太久。心情-8。",
              "warning",
            );
          },
        },
      ],
    },

    // ====== 事件15：带病工作的代价 ======
    // 设计意图：疾病系统联动，让生病不再是"带着也无所谓"的状态
    // 疾病+工作+社交，工友/顾客会注意到你状态不对
    {
      id: "sick_work_notice",
      phase: "street",
      icon: "🤒",
      title: "被看出来了",
      story:
        "你强撑着去干活，但手上的动作明显比平时慢。咳嗽压不住，额头烫得厉害。\n\n旁边的老主顾看了你一眼：「小伙子，你这脸色不对啊，发烧了吧？别干了，回去歇着。」",
      conditions: function (st) {
        if (st.player.day < 10) return false;
        if (
          !st.status ||
          !st.status.illnesses ||
          st.status.illnesses.length === 0
        )
          return false;
        if ((st.status.health || 70) > 50) return false;
        if (st.flags._sickWorkDay && st.player.day - st.flags._sickWorkDay < 20)
          return false;
        return true;
      },
      probability: 0.06,
      repeatable: true,
      choices: [
        {
          text: "🏥 听劝，去诊所看看",
          hint: "¥100-200，健康+15，但耽误半天活",
          apply: function (st) {
            st.flags._sickWorkDay = st.player.day;
            var cost = Random.int(100, 200);
            if (st.resources.cash < cost) {
              var charged = st.resources.cash;
              st.resources.cash = 0;
              st.resources.debt = (st.resources.debt || 0) + (cost - charged);
              StateManager.addMessage(
                "🏥 你到了诊所，医生量了体温说烧到38度5。开了药打了针，花了¥" +
                  charged +
                  "，欠了¥" +
                  (cost - charged) +
                  "。健康+15。虽然花了不少钱，但至少不是硬扛到倒下。",
                "warning",
              );
            } else {
              st.resources.cash -= cost;
              StateManager.addMessage(
                "🏥 你去了诊所，医生量了体温说烧到38度5。打了一针开了药，花了¥" +
                  cost +
                  "。健康+15。躺在病床上你心想：早该来的。",
                "info",
              );
            }
            st.status.health = Math.min(100, (st.status.health || 70) + 15);
          },
        },
        {
          text: "😤 谢谢关心，我还能撑",
          hint: "健康-5，但留下勤恳印象",
          apply: function (st) {
            st.flags._sickWorkDay = st.player.day;
            st.status.health = Math.max(0, (st.status.health || 70) - 5);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "😤 你挤出笑容说没事。老主顾摇了摇头，多给了你¥20小费：「拿着买点药吃。」你收下钱，心里有点酸。健康-5，名气+2。",
              "warning",
            );
            st.resources.cash += 20;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + 20;
          },
        },
        {
          text: "😅 回去休息半天",
          hint: "健康+5，但不干活没收入",
          apply: function (st) {
            st.flags._sickWorkDay = st.player.day;
            st.status.health = Math.min(100, (st.status.health || 70) + 5);
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            StateManager.addMessage(
              "😅 你收了摊往回走。虽然今天没赚到钱，但身体是革命的本钱——你把这句话想了三遍才安心躺下。健康+5，疲劳-15。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 事件16：低心情情绪危机 ======
    // 设计意图：长期低心情不止是数字，而是触发"一切都没意义"的自我怀疑
    // 心情+心智+道德，三岔口：积极自救/佛系躺平/迁怒他人
    {
      id: "low_mood_despair",
      phase: "street",
      icon: "🌧️",
      title: "一切都没意义",
      story:
        "你今天醒来就不想动。不是身体累，是心里空了一块。\n\n你盯着天花板想：每天醒来→干活→吃饭→睡觉→再醒来，到底图什么？这座城市有千万人，但没有一个人真的在意你。\n\n你翻了个身，把脸埋进枕头里。",
      conditions: function (st) {
        if (st.player.day < 15) return false;
        if (!st.needs || (st.needs.happiness || 50) >= 20) return false;
        if (!st.status || (st.status.health || 70) < 20) return false;
        if (st.flags._lowMoodDay && st.player.day - st.flags._lowMoodDay < 20)
          return false;
        return true;
      },
      probability: 0.05,
      repeatable: true,
      choices: [
        {
          text: "💪 强迫自己出门走走",
          hint: "心智+4，心情+10，可能遇到好事",
          apply: function (st) {
            st.flags._lowMoodDay = st.player.day;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 4);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (Random.chance(0.35)) {
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 8,
              );
              StateManager.addMessage(
                "💪 你逼自己出了门，在街上漫无目的地走。路过公园时，一个追球跑的小女孩撞到你腿上摔倒了，她抬头看了看你，递给你半块饼干：「哥哥，给你吃。」你愣在原地，突然笑了出来。心智+4，心情+18。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "💪 你逼自己出了门，在街上走了一圈。阳光晒在肩膀上，虽然问题没解决，但至少动起来了。心智+4，心情+10。",
                "info",
              );
            }
          },
        },
        {
          text: "😐 躺着发呆，等情绪过去",
          hint: "心情-3，但不会更糟",
          apply: function (st) {
            st.flags._lowMoodDay = st.player.day;
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            st.player.mental = Math.max(0, (st.player.mental || 0) + 1);
            StateManager.addMessage(
              "😐 你躺着盯着天花板，什么都不想干。迷迷糊糊睡了一觉，醒来时天已经暗了。虽然状态没变好，但至少休息了一下。心智+1，心情-3。有些日子，熬过去就是胜利。",
              "info",
            );
          },
        },
        {
          text: "😠 心里憋屈，找人吵架",
          hint: "道德-3，后果不确定",
          apply: function (st) {
            st.flags._lowMoodDay = st.player.day;
            st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
            if (st.flags.moral) {
              st.flags.moral.score = Math.max(
                -100,
                (st.flags.moral.score || 0) - 3,
              );
            }
            if (Random.chance(0.4)) {
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 5,
              );
              StateManager.addMessage(
                "😠 你跑到小卖部跟老板吵了一架——因为一个¥2的打火机。老板被你吼懵了，反而给你递了根烟：「小伙子，有啥过不去的？来，抽根烟缓缓。」你突然觉得自己很可笑。道德-3，心情+5。",
                "warning",
              );
            } else {
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
              st.player.fame = Math.max(0, (st.player.fame || 0) - 2);
              StateManager.addMessage(
                "😠 你莫名其妙对着路边发传单的人吼了一通。那人愣愣地看着你走开，什么都没说。走远了你才觉得自己像个混蛋。道德-3，心情-5，名气-2。",
                "danger",
              );
            }
          },
        },
      ],
    },

    // ====== 事件17：小美学习小组 ======
    // 设计意图：小美好感+智力门槛解锁共同学习机会
    // NPC+学习+技能，社交型学习
    {
      id: "xiao_mei_study_group",
      phase: "street",
      icon: "📖",
      title: "一起学习吧",
      story:
        "小美在信息栏上贴了张纸条：「周末自习小组，互相督促，免费入场。」\n\n她看到你在看纸条，凑过来小声说：「我拉了几个同学一起复习考证，你也来吧！别怕跟不上，我从基础讲起。」",
      conditions: function (st) {
        if (st.player.day < 20) return false;
        if (!st.relationships || !st.relationships.xiao_mei) return false;
        if ((st.relationships.xiao_mei.affinity || 0) < 40) return false;
        if ((st.player.intelligence || 0) < 25) return false;
        if (st.flags._xiaoMeiStudyDone) return false;
        return true;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "📚 去！正好想学点东西",
          hint: "智力+3，英语/编程XP各+40，心情+10",
          apply: function (st) {
            st.flags._xiaoMeiStudyDone = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 3,
            );
            if (st.skills && st.skills.english) {
              st.skills.english.xp = (st.skills.english.xp || 0) + 40;
            }
            if (st.skills && st.skills.coding) {
              st.skills.coding.xp = (st.skills.coding.xp || 0) + 40;
            }
            st.relationships.xiao_mei.affinity = Math.min(
              100,
              (st.relationships.xiao_mei.affinity || 0) + 8,
            );
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            StateManager.addMessage(
              "📚 你跟着小美和她的同学在图书馆泡了一下午。虽然一开始有点跟不上，但小美很有耐心地给你讲解。临走时她还借了你一本英语语法书。智力+3，英语XP+40，编程XP+40，心情+10。有同伴一起学，感觉没那么难了。",
              "success",
            );
          },
        },
        {
          text: "😅 我怕跟不上，下次吧",
          hint: "保留机会",
          apply: function (st) {
            st.relationships.xiao_mei.affinity = Math.min(
              100,
              (st.relationships.xiao_mei.affinity || 0) + 2,
            );
            StateManager.addMessage(
              "😅 你说自己基础太差怕拖后腿。小美笑了：「没事，谁不是从零开始的。你想来随时找我。」好感+2。",
              "info",
            );
          },
        },
        {
          text: "🙅 学习不适合我",
          hint: "什么也不发生",
          apply: function (st) {
            st.flags._xiaoMeiStudyDone = true;
            StateManager.addMessage(
              "🙅 你摇了摇头。小美有点失望，但也没强求：「好吧，有需要再找我。」",
              "info",
            );
          },
        },
      ],
    },

    // ====== 事件18：科技园——创业灵光一现 ======
    // 设计意图：玩家在科技园且有一定编程基础时，触发技术创业思绪
    // 地点+技能+cash门槛→创业铺垫
    {
      id: "techpark_startup_idea",
      phase: "street",
      icon: "💻",
      title: "科技园的诱惑",
      story:
        "你在科技园门口看到一群年轻人在拍合影，胸前挂着工牌——上面印着各种互联网公司的logo。\n\n你低头看了看自己满是灰尘的衣服，又看了看他们。一个念头冒出来：你也会写代码，为什么不能像他们一样？",
      conditions: function (st) {
        if (st.player.day < 30) return false;
        var curLoc = st.trade && st.trade.currentLocation;
        if (curLoc !== "techPark") return false;
        if (
          !st.skills ||
          !st.skills.coding ||
          (st.skills.coding.level || 0) < 20
        )
          return false;
        if (st.flags._techparkIdeaDone) return false;
        return true;
      },
      probability: 0.035,
      repeatable: false,
      choices: [
        {
          text: "💡 认真思考创业方向",
          hint: "心智+5，获得创业灵感flag",
          apply: function (st) {
            st.flags._techparkIdeaDone = true;
            st.flags._techparkInspiration = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            StateManager.addMessage(
              "💡 你找了个角落坐下，掏出手机记下了几个想法：帮小商家做外卖小程序、写一个二手物品交易工具……你越写越兴奋。心智+5，心情+10。获得创业灵感储备——以后创业项目选择时多一个选项。",
              "success",
            );
          },
        },
        {
          text: "📄 去科技园里面问问招不招人",
          hint: "智力+2，可能获得面试机会",
          apply: function (st) {
            st.flags._techparkIdeaDone = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 2,
            );
            if (Random.chance(0.3)) {
              st.flags._techparkInterview = true;
              StateManager.addMessage(
                "📄 你鼓起勇气走进一栋写字楼，在前台问有没有招人。前台给了你一个二维码让你投简历——是一家做AI数据标注的公司。智力+2，获得面试机会。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "📄 你在科技园转了一圈，保安问你是哪家公司的。你说找工作，保安指了指门口的招聘栏：「都在那呢。」智力+2。",
                "info",
              );
            }
          },
        },
        {
          text: "🚶 跟我不相干，走了",
          hint: "什么也不发生",
          apply: function (st) {
            st.flags._techparkIdeaDone = true;
            StateManager.addMessage(
              "🚶 你拉紧了外套，低头走开了。科技园的世界和你的世界，中间隔着一道玻璃门。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 事件19：社交孤独——连续独处的代价 ======
    // 设计意图：社交系统联动，长期不与NPC互动触发孤独感
    // 社交+心情+心智，让玩家有动力维持社交联系
    {
      id: "social_loneliness",
      phase: "street",
      icon: "🕊️",
      title: "一个人的城市",
      story:
        "晚上你回到住处，打开手机——没有消息，没有未接来电。你翻了一遍通讯录，发现不知道该打给谁。\n\n窗外万家灯火，街上有情侣在笑，有朋友在打闹。你拉上窗帘，把热闹关在外面。",
      conditions: function (st) {
        if (st.player.day < 20) return false;
        // 判断是否长期独处：没有任何NPC好感>20
        if (!st.relationships) return false;
        var hasFriend = false;
        for (var nid in st.relationships) {
          if (
            st.relationships[nid] &&
            (st.relationships[nid].affinity || 0) >= 20
          ) {
            hasFriend = true;
            break;
          }
        }
        if (hasFriend) return false;
        if (
          st.flags._lonelinessDay &&
          st.player.day - st.flags._lonelinessDay < 25
        )
          return false;
        return true;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "📱 主动联系一个认识的人",
          hint: "心情+10，可能增进关系",
          apply: function (st) {
            st.flags._lonelinessDay = st.player.day;
            // 找好感最高的NPC（即使<20）
            var bestNpc = null;
            var bestAff = -100;
            if (st.relationships) {
              for (var nid in st.relationships) {
                if (
                  st.relationships[nid] &&
                  (st.relationships[nid].affinity || 0) > bestAff
                ) {
                  bestAff = st.relationships[nid].affinity;
                  bestNpc = nid;
                }
              }
            }
            if (bestNpc && bestAff > -50) {
              st.relationships[bestNpc].affinity = Math.min(
                100,
                (st.relationships[bestNpc].affinity || 0) + 5,
              );
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 10,
              );
              StateManager.addMessage(
                "📱 你鼓起勇气发了一条消息。对方居然很快回复了——虽然只是寒暄了几句，但有人回应的感觉真好。心情+10，好感+5。",
                "success",
              );
            } else {
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 5,
              );
              StateManager.addMessage(
                "📱 你翻了半天通讯录，最后给家里打了个电话。妈妈接了，问吃过饭没有。你说吃了，她说那就好。挂了电话，心里暖了一点。心情+5。",
                "info",
              );
            }
          },
        },
        {
          text: "🏪 去楼下便利店跟老板聊两句",
          hint: "心情+5，可能遇到邻居",
          apply: function (st) {
            st.flags._lonelinessDay = st.player.day;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (Random.chance(0.3)) {
              st.flags._neighborMet = true;
              StateManager.addMessage(
                "🏪 你去便利店买水，跟老板多聊了几句。原来他也是外地人，在这开了八年店。临走时他说：「没事来坐坐，晚上人少，我也想有人说说话。」心情+5，认识了邻居。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🏪 你去便利店买了瓶水，和老板有一搭没一搭聊了几句。虽然都是废话，但有人说说话总是好的。心情+5。",
                "info",
              );
            }
          },
        },
        {
          text: "🎵 戴上耳机，自己待着",
          hint: "什么也不发生",
          apply: function (st) {
            st.flags._lonelinessDay = st.player.day;
            StateManager.addMessage(
              "🎵 你戴上耳机，随便放了首歌。歌词唱的是关于离开和远方。你闭着眼睛，跟着旋律轻轻哼。至少，还有音乐陪你。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 事件20：负债压力——偶遇债主 ======
    // 设计意图：债务系统联动，有债时可能在市场上遇到债主
    // 经济+道德+剧情，让债务不只是数字
    {
      id: "debt_meet_creditor",
      phase: "street",
      icon: "😰",
      title: "躲不掉的债",
      story:
        "你在市场上买东西时，一抬头——对面站着的人有点眼熟。\n\n那人也看到了你，脸色变了变，大步走过来。你想起他是谁了——上个月借你钱的工地工头。他说这几天老家急用钱，问你能不能先还一部分。",
      conditions: function (st) {
        if (st.player.day < 15) return false;
        var totalDebt =
          (st.resources.debt || 0) + (st.resources.villageDebt || 0);
        if (totalDebt < 500) return false;
        if (st.flags._debtMeetDay && st.player.day - st.flags._debtMeetDay < 30)
          return false;
        return true;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "🙏 先还一部分",
          hint: "还¥200-500，信誉+，心情不稳",
          apply: function (st) {
            st.flags._debtMeetDay = st.player.day;
            var repay = Math.min(
              500,
              Math.max(200, Math.floor((st.resources.cash || 0) * 0.3)),
            );
            if (st.resources.cash >= repay) {
              st.resources.cash -= repay;
              st.resources.debt = Math.max(0, (st.resources.debt || 0) - repay);
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
              StateManager.addMessage(
                "🙏 你数了¥" +
                  repay +
                  "递过去：「先还这些，剩下的下个月再给。」他接过钱数了数叹了口气：「行吧，知道你也不容易。」心情-5，债务减少¥" +
                  repay +
                  "。",
                "warning",
              );
            } else {
              st.resources.cash = 0;
              st.resources.debt = Math.max(
                0,
                (st.resources.debt || 0) - st.resources.cash,
              );
              StateManager.addMessage(
                "🙏 你翻遍口袋，只有¥" +
                  (st.resources.cash || 0) +
                  "。全部给了他。他接过去，一句话没说就走了。",
                "warning",
              );
            }
          },
        },
        {
          text: "😓 再宽限几天，一定还",
          hint: "道德-2，但保住现金",
          apply: function (st) {
            st.flags._debtMeetDay = st.player.day;
            st.player.morality = Math.max(0, (st.player.morality || 50) - 2);
            if (st.flags.moral) {
              st.flags.moral.score = Math.max(
                -100,
                (st.flags.moral.score || 0) - 2,
              );
            }
            if (Random.chance(0.5)) {
              StateManager.addMessage(
                "😓 你说了困难，他沉默了一会儿说：「一周，最多一周。我老婆还在医院等着。」道德-2。你躲过了一次，但压力更大了。",
                "warning",
              );
            } else {
              st.flags._debterAngry = true;
              StateManager.addMessage(
                "😓 他听了你的话脸色铁青：「上次你也是这么说的。一周，再不还我只能找别的办法了。」道德-2。你感觉事情在往不好的方向发展。",
                "danger",
              );
            }
          },
        },
        {
          text: "🏃 假装没看见，转头就走",
          hint: "道德-5，可能后果严重",
          apply: function (st) {
            st.flags._debtMeetDay = st.player.day;
            st.player.morality = Math.max(0, (st.player.morality || 50) - 5);
            if (st.flags.moral) {
              st.flags.moral.score = Math.max(
                -100,
                (st.flags.moral.score || 0) - 5,
              );
            }
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
            StateManager.addMessage(
              "🏃 你低头转身挤进人群。背后传来一声喊：「喂！我看到你了！」你加快脚步，直到听不见那个声音才停下来。道德-5，心情-8。你觉得自己像个逃犯。",
              "danger",
            );
          },
        },
      ],
    },

    // ====== 事件21：张姐的培训推荐 ======
    // 设计意图：张姐好感≥50时提供技能培训机会
    // NPC+教育+工作，社交型成长路径
    {
      id: "zhang_training_tip",
      phase: "street",
      icon: "📋",
      title: "张姐的培训消息",
      story:
        "张姐发来一条消息：「市里有政府补贴的技能培训班，电工、焊工、护理都有，学费减免一半。我手上有几个名额，要不要帮你报一个？」",
      conditions: function (st) {
        if (st.player.day < 30) return false;
        if (!st.relationships || !st.relationships.sister_zhang) return false;
        if ((st.relationships.sister_zhang.affinity || 0) < 50) return false;
        if (st.flags._zhangTrainingDone) return false;
        return true;
      },
      probability: 0.035,
      repeatable: false,
      choices: [
        {
          text: "📚 报电工班！实用",
          hint: "电工XP+80，智力+2，学费¥300",
          apply: function (st) {
            st.flags._zhangTrainingDone = true;
            var cost = 300;
            if (st.resources.cash >= cost) {
              st.resources.cash -= cost;
              if (st.skills && st.skills.electrician) {
                st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 80;
                st.skills.electrician.level = Math.min(
                  100,
                  (st.skills.electrician.level || 0) + 2,
                );
              }
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 0) + 2,
              );
              st.relationships.sister_zhang.affinity = Math.min(
                100,
                (st.relationships.sister_zhang.affinity || 0) + 8,
              );
              StateManager.addMessage(
                "📚 你报了电工培训班。课程持续两周，每天晚上两小时。虽然累，但老师讲得很实用——从家庭电路到工厂配电都涉及。电工XP+80，电工等级+2，智力+2，张姐好感+8。技能在手，心里踏实多了。",
                "success",
              );
            } else {
              st.flags._zhangTrainingPending = true;
              st.relationships.sister_zhang.affinity = Math.min(
                100,
                (st.relationships.sister_zhang.affinity || 0) + 3,
              );
              StateManager.addMessage(
                "😅 学费¥300，你摸了摸口袋不够。张姐说：「名额我给你留一周，你凑够了跟我说。」好感+3。",
                "info",
              );
            }
          },
        },
        {
          text: "🔧 报焊工班！手艺活",
          hint: "焊接XP+80，心智+2，学费¥300",
          apply: function (st) {
            st.flags._zhangTrainingDone = true;
            var cost = 300;
            if (st.resources.cash >= cost) {
              st.resources.cash -= cost;
              if (st.skills && st.skills.welding) {
                st.skills.welding.xp = (st.skills.welding.xp || 0) + 80;
                st.skills.welding.level = Math.min(
                  100,
                  (st.skills.welding.level || 0) + 2,
                );
              }
              st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
              st.relationships.sister_zhang.affinity = Math.min(
                100,
                (st.relationships.sister_zhang.affinity || 0) + 8,
              );
              StateManager.addMessage(
                "📚 你报了焊工培训班。老师说焊工是越老越吃香的手艺——第一个月练平焊，第二个月练立焊。焊接XP+80，焊接等级+2，心智+2，张姐好感+8。",
                "success",
              );
            } else {
              st.flags._zhangTrainingPending = true;
              st.relationships.sister_zhang.affinity = Math.min(
                100,
                (st.relationships.sister_zhang.affinity || 0) + 3,
              );
              StateManager.addMessage(
                "😅 学费¥300，你暂时拿不出来。张姐说：「名额我给你留一周，你凑够了跟我说。」好感+3。",
                "info",
              );
            }
          },
        },
        {
          text: "🙅 暂时不需要",
          hint: "什么也不发生",
          apply: function (st) {
            st.flags._zhangTrainingDone = true;
            StateManager.addMessage(
              "🙅 你说现在太忙了。张姐说：「行，有需要随时找我，这政策不是天天有。」",
              "info",
            );
          },
        },
      ],
    },

    // ====== 事件22：公园健身习惯 ======
    // 设计意图：连续在公园活动的玩家触发健康正向循环
    // 地点+健康+体质，正向激励机制
    {
      id: "park_exercise_habit",
      phase: "street",
      icon: "🏋️",
      title: "公园里的坚持",
      story:
        "你又来到了公园——这几天你都在这里活动，已经混了个脸熟。\n\n一个打太极的大爷朝你点了点头：「小伙子，我看你天天来，挺能坚持啊。来，跟我练两招，比你瞎跑强。」",
      conditions: function (st) {
        if (st.player.day < 15) return false;
        var curLoc = st.trade && st.trade.currentLocation;
        if (curLoc !== "park") return false;
        if (
          st.flags._parkHabitDay &&
          st.player.day - st.flags._parkHabitDay < 20
        )
          return false;
        if (st.flags._parkVisitCount < 5) return false;
        return true;
      },
      probability: 0.05,
      repeatable: true,
      choices: [
        {
          text: "🙏 跟大爷学太极",
          hint: "体质+3，心智+3，健康+8",
          apply: function (st) {
            st.flags._parkHabitDay = st.player.day;
            st.player.physique = Math.min(100, (st.player.physique || 0) + 3);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            st.status.health = Math.min(100, (st.status.health || 70) + 8);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            StateManager.addMessage(
              "🙏 大爷教你几招太极拳——野马分鬃、白鹤亮翅。一开始你手脚不协调，但大爷说你「筋骨不错」。打完一套，你感觉浑身舒畅。体质+3，心智+3，健康+8，心情+10。",
              "success",
            );
          },
        },
        {
          text: "💪 自己跑几圈",
          hint: "体质+2，健康+5",
          apply: function (st) {
            st.flags._parkHabitDay = st.player.day;
            st.player.physique = Math.min(100, (st.player.physique || 0) + 2);
            st.status.health = Math.min(100, (st.status.health || 70) + 5);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "💪 你在公园跑了四圈。虽然没有大爷的太极那么有门道，但出了一身汗的感觉也不错。体质+2，健康+5，心情+5。",
              "success",
            );
          },
        },
        {
          text: "😮‍💨 今天太累了，歇一天",
          hint: "什么也不发生",
          apply: function (st) {
            st.flags._parkHabitDay = st.player.day;
            StateManager.addMessage(
              "😮‍💨 你跟大爷打了声招呼说今天不练了。大爷摆摆手：「歇一天也好，练功不在一天。」",
              "info",
            );
          },
        },
      ],
    },

    // ====== 事件23：工地小事故 ======
    // 设计意图：工地地点专属事件，李工头好感影响后果
    // 地点+工作+NPC+健康
    {
      id: "construction_minor_accident",
      phase: "street",
      icon: "⚠️",
      title: "工地上出了点事",
      story:
        "你在工地上干活时，突然听到一声喊——上面掉下来一捆钢管！虽然没砸到人，但碎砖块溅到了你这边。\n\n工头跑过来看了一圈：「没事没事，散了吧。」但你的手臂被划了一道口子，血渗了出来。",
      conditions: function (st) {
        if (st.player.day < 20) return false;
        var curLoc = st.trade && st.trade.currentLocation;
        if (curLoc !== "construction") return false;
        if (
          st.flags._constructionAccidentDay &&
          st.player.day - st.flags._constructionAccidentDay < 20
        )
          return false;
        return true;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "🏥 去处理一下伤口",
          hint: "¥50-100，健康+5，不影响后续工作",
          apply: function (st) {
            st.flags._constructionAccidentDay = st.player.day;
            var cost = Random.int(50, 100);
            if (st.resources.cash >= cost) {
              st.resources.cash -= cost;
              st.status.health = Math.min(100, (st.status.health || 70) + 5);
              StateManager.addMessage(
                "🏥 你到附近诊所清洗了伤口，缝了两针。花了¥" +
                  cost +
                  "，健康+5。护士说运气好，再深一点就得打破伤风针了。",
                "info",
              );
            } else {
              st.status.health = Math.max(0, (st.status.health || 70) - 3);
              StateManager.addMessage(
                "🏥 你去了诊所，但是¥" +
                  cost +
                  "的处置费拿不出来。护士只好简单包扎了一下说：「注意别感染。」健康-3。",
                "warning",
              );
            }
            // 检查李工头好感
            if (
              st.relationships &&
              st.relationships.boss_li &&
              (st.relationships.boss_li.affinity || 0) >= 30
            ) {
              st.resources.cash += 80;
              st.relationships.boss_li.affinity = Math.min(
                100,
                (st.relationships.boss_li.affinity || 0) + 3,
              );
              StateManager.addMessage(
                "👷 李工头知道你受伤了，走过来塞了¥80：「去买点营养品。以后小心点。」好感+3。",
                "success",
              );
            }
          },
        },
        {
          text: "💪 没事，擦擦继续干",
          hint: "健康-5，但显得硬气",
          apply: function (st) {
            st.flags._constructionAccidentDay = st.player.day;
            st.status.health = Math.max(0, (st.status.health || 70) - 5);
            st.player.physique = Math.min(100, (st.player.physique || 0) + 1);
            StateManager.addMessage(
              "💪 你撕了块布条包扎了一下继续干。工友们看了你一眼，没说什么。体质+1，健康-5。你的硬气在这个工地上被记住了。",
              "warning",
            );
          },
        },
        {
          text: "😤 找工头理论：安全措施不到位",
          hint: "需要李工头好感≥40或社交能力",
          apply: function (st) {
            st.flags._constructionAccidentDay = st.player.day;
            var hasPull = false;
            if (
              st.relationships &&
              st.relationships.boss_li &&
              (st.relationships.boss_li.affinity || 0) >= 40
            )
              hasPull = true;
            if (
              st.skills &&
              st.skills.sales &&
              (st.skills.sales.level || 0) >= 20
            )
              hasPull = true;
            if (hasPull) {
              st.flags._siteSafetyImproved = true;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 8,
              );
              StateManager.addMessage(
                "😤 你去找工头说了安全问题。他本来想打发你走，但看你态度坚决，加上认识你，同意了加强安全措施。工友们对你刮目相看。名气+5，心情+8，工地安全改善了。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
              StateManager.addMessage(
                "😤 你去找工头反映，他没当回事：「干这行哪有不擦破皮的？不想干可以走。」心情-5。你站了一会儿，转身回去继续干活。",
                "warning",
              );
            }
          },
        },
      ],
    },

    // ====== 事件24：技能被路人认出 ======
    // 设计意图：高技能不是白练的——在街上可能被有需要的人认出来
    // 技能+社交+经济，能力转化为机会
    {
      id: "skill_noticed_stranger",
      phase: "street",
      icon: "🎯",
      title: "行家一出手",
      story:
        "你在街上走着，路边一个修电动车的人正在对着一堆零件发愁。\n\n他抬头看了看你——也许是看你手上常年干活留下的茧子和工具痕迹——试探着问：「兄弟，你懂这个不？我这车拆了装不回去了。」",
      conditions: function (st) {
        if (st.player.day < 30) return false;
        if (!st.skills) return false;
        // 任意技能≥50
        var hasHighSkill = false;
        for (var sk in st.skills) {
          if (st.skills[sk] && (st.skills[sk].level || 0) >= 50) {
            hasHighSkill = true;
            break;
          }
        }
        if (!hasHighSkill) return false;
        if (
          st.flags._skillNoticedDay &&
          st.player.day - st.flags._skillNoticedDay < 20
        )
          return false;
        return true;
      },
      probability: 0.035,
      repeatable: true,
      choices: [
        {
          text: "🔧 帮忙看看，举手之劳",
          hint: "相关技能XP+30，现金¥50-150，名气+3",
          apply: function (st) {
            st.flags._skillNoticedDay = st.player.day;
            // 找到最高技能加XP
            var bestSkill = null;
            var bestLvl = 0;
            for (var sk in st.skills) {
              if (st.skills[sk] && (st.skills[sk].level || 0) > bestLvl) {
                bestLvl = st.skills[sk].level;
                bestSkill = sk;
              }
            }
            if (bestSkill && st.skills[bestSkill]) {
              st.skills[bestSkill].xp = (st.skills[bestSkill].xp || 0) + 30;
            }
            var tip = Random.int(50, 150);
            st.resources.cash += tip;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + tip;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            StateManager.addMessage(
              "🔧 你蹲下看了看，三两下就帮他装好了。他惊讶地说：「高手啊！比修车铺还快。」非要塞给你¥" +
                tip +
                "。技能XP+30，名气+3，心情+10。你的手艺不会说谎。",
              "success",
            );
          },
        },
        {
          text: "👀 告诉他附近哪能修",
          hint: "好人好事，名气+1",
          apply: function (st) {
            st.flags._skillNoticedDay = st.player.day;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage(
              "👀 你说自己也不太会，指了前面修车铺的位置给他。他道了谢推着车走了。名气+1，心情+3。",
              "info",
            );
          },
        },
        {
          text: "🚶 假装没听见走过去",
          hint: "什么也不发生",
          apply: function (st) {
            st.flags._skillNoticedDay = st.player.day;
            StateManager.addMessage(
              "🚶 你低着头走过去了。不是不想帮忙，只是今天实在没心情。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 事件25：图书馆指路人 ======
    // 设计意图：学习遇瓶颈时在图书馆遇到热心人指点
    // 教育+心智+社交，给自学玩家一个"导师"
    {
      id: "library_mentor_meet",
      phase: "street",
      icon: "📚",
      title: "遇见了老师",
      story:
        "你在图书馆的自习区埋头苦读，但一道题卡了你半小时。你咬着笔帽，盯着书页上的公式发呆。\n\n对面一个戴眼镜的中年人合上自己的书，看了你一眼：「卡住了？来，我看看。」",
      conditions: function (st) {
        if (st.player.day < 25) return false;
        if ((st.player.intelligence || 0) < 35) return false;
        // 得有一定的学历提升意愿（学过习或用过学习类行动）
        if (st.flags._libraryMentorDone) return false;
        return true;
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "🙏 太好了，这个公式弄不懂",
          hint: "智力+4，心智+3，获得持续指导机会",
          apply: function (st) {
            st.flags._libraryMentorDone = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 4,
            );
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            st.flags._libraryMentorContact = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            StateManager.addMessage(
              "🙏 中年人姓方，是退休的大学老师。他花了半小时用最浅显的方式给你讲清楚了那个公式，还顺手帮你梳理了一章的知识框架。临走时他给了你一个微信号：「有问题可以问我，反正退休了没事。」智力+4，心智+3，心情+12。免费的导师，比黄金还珍贵。",
              "success",
            );
          },
        },
        {
          text: "😅 谢谢，我自己再琢磨琢磨",
          hint: "心智+1，独立解决",
          apply: function (st) {
            st.flags._libraryMentorDone = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
            StateManager.addMessage(
              "😅 你说想自己先试试。他笑了笑：「也好，自己悟出来的记得更牢。我就在那边，实在不行再叫我。」心智+1。",
              "info",
            );
          },
        },
        {
          text: "🙅 不用，我不需要",
          hint: "什么也不发生",
          apply: function (st) {
            st.flags._libraryMentorDone = true;
            StateManager.addMessage(
              "🙅 你冷淡地回了一句。他点点头，戴上眼镜继续看自己的书。",
              "info",
            );
          },
        },
      ],
    },

    // ====== v3.20 新增事件（已补全 conditions + apply，修复死代码）======

    // v3.20-1: 极端天气+户外工作（高温）
    {
      id: "heatwave_outdoor_crunch",
      phase: "street",
      icon: "🦵",
      title: "高温下的苦工",
      story:
        "今天天气预报发布了高温预警，气温预计超过40度。你本打算去户外干活，但太阳毒辣得让人睁不开眼。\n\n你看了看手机上的账户余额，又抬头看了看天。\n\n工地和街边小摊都需要人。",
      // [自洽修复] v3.20 原始提交缺 conditions/apply → 补全
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.weather &&
          st.weather.current === "heatwave" &&
          st.player.day >= 15
        );
      },
      probability: 0.08,
      repeatable: true,
      choices: [
        {
          text: "🔥 硬扛！高温补贴也赚了",
          hint: "户外收入×1.2但疲劳激增，健康下降",
          apply: function (st) {
            var earn = Random.int(80, 160);
            st.resources.cash += Math.round(earn * 1.2);
            st.resources.totalEarned =
              (st.resources.totalEarned || 0) + Math.round(earn * 1.2);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
            st.status.health = Math.max(0, (st.status.health || 70) - 6);
            StateManager.addMessage(
              "🔥 你顶着太阳干了一整天，赚了¥" +
                Math.round(earn * 1.2) +
                "。但夜里头疼欲裂，疲劳+25，健康-6。这钱是拿命换的。",
              "warning",
            );
          },
        },
        {
          text: "🏪 买西瓜解暑，找阴凉处做点活",
          hint: "花小钱保健康，少量收入",
          apply: function (st) {
            if (st.resources.cash < 10) {
              StateManager.addMessage(
                "😅 你连¥10的西瓜都买不起，只好找了个树荫干坐着。",
                "warning",
              );
              return;
            }
            st.resources.cash -= 10;
            var earn = Random.int(30, 80);
            st.resources.cash += earn;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
            StateManager.addMessage(
              "🏪 你花¥10买了个西瓜，边吃边找阴凉处做了点零活，赚了¥" +
                earn +
                "。不算多，但至少没中暑。",
              "info",
            );
          },
        },
        {
          text: "💪 今天休息，在家避暑",
          hint: "保护身体，0收入",
          apply: function (st) {
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            StateManager.addMessage(
              "💪 你选择在家里歇着。身体是革命的本钱，今天不进账也不亏。疲劳-10。",
              "info",
            );
          },
        },
      ],
    },

    // v3.20-2: 社区团购生态联动
    {
      id: "community_group_buy_expand",
      phase: "street",
      icon: "📦",
      title: "团长邀请你当分单员",
      story:
        "你之前帮社区团购砍价，团长（楼下便利店老板）对你有印象。这次她主动找你，说现在团购规模变大了，想招几个分单员——每天去批发市场取货再送到居民区，每单赚5块钱。",
      // [自洽修复] v3.20 原始提交缺 conditions/apply → 补全
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          (st.skills.driving ? st.skills.driving.level : 0) >= 10 &&
          !st.flags._groupBuyCourier
        );
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "📦 接！帮送分单",
          hint: "每天稳定赚 ¥30-60",
          apply: function (st) {
            st.flags._groupBuyCourier = true;
            var earn = Random.int(30, 60);
            st.resources.cash += earn;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
            StateManager.addMessage(
              "📦 你接了第一单调货单，跑了一下午赚了¥" +
                earn +
                "。团长说「明天继续！」这是稳定的新活路。",
              "success",
            );
          },
        },
        {
          text: "🤔 了解一下，不急着决定",
          hint: "获取信息，不绑定",
          apply: function (st) {
            st.flags._groupBuyInformed = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
            StateManager.addMessage(
              "🤔 你问了问具体情况：每单5块、每天6-8单、包午饭。心里有底了，但还没答应。心智+1。",
              "info",
            );
          },
        },
        {
          text: "🙋‍♂️ 婉拒，自己忙",
          hint: "放弃机会",
          apply: function (st) {
            StateManager.addMessage(
              "🙋‍♂️ 你说现在腾不出手。团长笑着说「想通了随时来。」机会先记着。",
              "info",
            );
          },
        },
      ],
    },

    // v3.20-3: 量化基金邀请（金融路径彩蛋）
    {
      id: "quant_fund_invite",
      phase: "street",
      icon: "📈",
      title: "量化私募的电话",
      story:
        "你之前关注过量化交易的事——现在收到一个陌生号码的微信：「你好，我们在做量化策略研发，看到你在金融论坛的讨论，觉得你有一定分析能力。有兴趣聊聊吗？」\n\n对方自称是一家小型量化私募的合伙人，工作室就在科技园附近。",
      // [自洽修复] v3.20 原始提交缺 conditions/apply → 补全
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.intelligence >= 45 &&
          st.player.day >= 90 &&
          (st.resources.cash >= 5000 || st.player.fame >= 10) &&
          !st.flags._quantInviteSeen
        );
      },
      probability: 0.025,
      repeatable: false,
      choices: [
        {
          text: "📈 去见一面，了解一下",
          hint: "高风险高回报的社交",
          apply: function (st) {
            st.flags._quantInviteSeen = true;
            if (Random.chance(0.5)) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
              st.flags._quantContact = true;
              StateManager.addMessage(
                "📈 聊得不错！对方觉得你有潜力，留了联系方式。名气+3，以后可能还有合作机会。",
                "success",
              );
            } else {
              st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
              StateManager.addMessage(
                "📈 见面后发现对方只是拉资金的，不太靠谱。但你了解了量化圈的一些门道，心智+2。",
                "info",
              );
            }
          },
        },
        {
          text: "🔒 先验证对方身份",
          hint: "谨慎为妙",
          apply: function (st) {
            st.flags._quantInviteSeen = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
            StateManager.addMessage(
              "🔒 你查了查对方公司——确实注册过，但规模很小。你决定再观察观察。心智+2。",
              "info",
            );
          },
        },
        {
          text: "🙋‍♂️ 直接忽略",
          hint: "不冒险",
          apply: function (st) {
            st.flags._quantInviteSeen = true;
            StateManager.addMessage(
              "🙋‍♂️ 你删除了消息。天上不会掉馅饼，这种来路不明的邀约不碰为妙。",
              "info",
            );
          },
        },
      ],
    },

    // v3.20-4: [自洽修复] 直呼"老周"→conditions 必须校验 old_zhou.met
    {
      id: "zhou_deep_bond",
      phase: "street",
      icon: "🍺",
      title: "老周的难题",
      story:
        "老周在夜市收摊时找到你，表情难得严肃：「兄弟，有件事只有你能帮我。我那个儿子……最近跟着不三不四的人混，欠了高利贷。你能不能帮我劝劝他？」\n\n你知道这是他第一次对你开口求助。",
      // [自洽修复] 叙事直呼"老周"→门控 old_zhou.met + 好感≥70（深度信托）
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.relationships &&
          st.relationships.old_zhou &&
          st.relationships.old_zhou.met === true &&
          (st.relationships.old_zhou.affinity || 0) >= 70 &&
          st.player.day >= 80 &&
          !st.flags._zhouDeepBond
        );
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "💥 走！去找那个不三不四的人",
          hint: "高风险，高回报",
          apply: function (st) {
            st.flags._zhouDeepBond = true;
            if (Random.chance(0.5)) {
              st.relationships.old_zhou.affinity = Math.min(
                100,
                (st.relationships.old_zhou.affinity || 0) + 20,
              );
              st.status.health = Math.max(0, (st.status.health || 70) - 10);
              StateManager.addMessage(
                "💥 你去找那帮人交涉，虽然挨了几下但把事情谈妥了。老周握着手半天说不出话，好感+20。你淤青了几天，健康-10。",
                "success",
              );
            } else {
              st.status.health = Math.max(0, (st.status.health || 70) - 15);
              StateManager.addMessage(
                "💥 对方人多，你挨了一顿。好在事情算是暂时压下去了。老周心疼地帮你擦药。健康-15。",
                "warning",
              );
            }
          },
        },
        {
          text: "🗣️ 我先去跟他谈谈",
          hint: "以理服人，需要心智",
          apply: function (st) {
            st.flags._zhouDeepBond = true;
            var mental = st.player.mental || 0;
            if (mental >= 50) {
              st.relationships.old_zhou.affinity = Math.min(
                100,
                (st.relationships.old_zhou.affinity || 0) + 15,
              );
              StateManager.addMessage(
                "🗣️ 你找到老周的儿子，跟他长谈了两个小时。他答应远离那些人。老周知道后老泪纵横，好感+15。",
                "success",
              );
            } else {
              st.relationships.old_zhou.affinity = Math.min(
                100,
                (st.relationships.old_zhou.affinity || 0) + 5,
              );
              StateManager.addMessage(
                "🗣️ 你试着劝了劝，但说服力不够，对方只是敷衍。老周说你尽力了，好感+5。也许你该提升心智再来。",
                "info",
              );
            }
          },
        },
        {
          text: "🙋‍♂️ 我帮不了这个忙",
          hint: "自保为先",
          apply: function (st) {
            st.flags._zhouDeepBond = true;
            st.relationships.old_zhou.affinity = Math.max(
              0,
              (st.relationships.old_zhou.affinity || 0) - 10,
            );
            StateManager.addMessage(
              "🙋‍♂️ 你说这事帮不了。老周沉默半晌：「也行，我自己想办法。」好感-10。有些人情一旦开口被拒，就回不到从前了。",
              "warning",
            );
          },
        },
      ],
    },
  ];

  for (var i = 0; i < CROSS_EVENTS.length; i++) {
    // 防御性兜底：无 conditions 的事件默认放行（避免死代码），与 CAREER_EVENTS 一致
    if (!CROSS_EVENTS[i].conditions && !CROSS_EVENTS[i].triggers) {
      CROSS_EVENTS[i].conditions = function () {
        return true;
      };
    }
    RANDOM_EVENTS.push(CROSS_EVENTS[i]);
  }

  for (var j = 0; j < CAREER_EVENTS.length; j++) {
    var careerEvent = CAREER_EVENTS[j];
    RANDOM_EVENTS.push({
      id: careerEvent.id,
      phase: careerEvent.phase || "street",
      icon: careerEvent.icon || "💼",
      title: careerEvent.title || careerEvent.name,
      story: careerEvent.story || careerEvent.text,
      conditions:
        careerEvent.conditions ||
        careerEvent.trigger ||
        function () {
          return true;
        },
      choices: careerEvent.choices || careerEvent.options || [],
      probability: careerEvent.probability,
      repeatable: careerEvent.repeatable,
    });
  }

  // ====== 链式后续事件（仅通过 queueChainEvent 触发）======
  // 链式事件1：老周渠道首单高价回收（Event 3 后续）
  RANDOM_EVENTS.push({
    id: "zhou_channel_first_deal",
    _isChainEvent: true,
    phase: "street",
    icon: "♻️",
    title: "内部渠道开张",
    story:
      "几天前老周带你认的铁皮棚回收站，今天你试着拖了一车废品过去。那人看了一眼说：「老周打过招呼了，称重点，按内部价算。」\n\n你看着称上的数字，感觉比平时沉了不少。",
    choices: [
      {
        text: "♻️ 称重结账",
        hint: "第一笔高价回收！",
        apply: function (st) {
          var bonus = Random.int(200, 400);
          st.resources.cash += bonus;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + bonus;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "♻️ 废品称重完，老板拍给你¥" +
              bonus +
              "——比外面多卖了将近一倍！「老周介绍的人，我信得过，以后有货尽管来。」心情+10。",
            "success",
          );
        },
      },
    ],
  });

  // ====================================================================
  // v3.18 — 跨系统联动扩展（20个事件，5大主题）
  // 设计理念：让玩家感受到每一个选择都有"尾巴"——
  //   道德行为→3-7天后现实回响；
  //   副业成败→转化为主线职业/创业机遇；
  //   时代里程碑→触发后续世界变化；
  //   副业负面→逼玩家转型；
  //   跨阶段积累→职业⇄创业双向桥接。
  // ====================================================================

  // ========== 主题A：道德行为的长尾 (5个) ==========

  // A1：失主感谢——归还钱包3天后的惊喜
  RANDOM_EVENTS.push({
    id: "moral_wallet_return_reward",
    phase: "street",
    icon: "💌",
    title: "失主找来了",
    story:
      "你刚出门，一个气喘吁吁的年轻人追上来：\n「是你前几天在派出所帮忙登记的那位吗？我终于找到你了！那个钱包是我的，里面有我妈妈的住院押金，谢谢你……」\n他眼眶有些红。",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.moralWalletReturner &&
        !st.flags._walletReturnRewarded &&
        st.player.day >= (st.flags._walletReturnDay || 0) + 3
      );
    },
    probability: 0.6,
    repeatable: false,
    choices: [
      {
        text: "🤝 接受他的感谢，随便聊了聊",
        hint: "名气+5，认识新朋友",
        apply: function (st) {
          st.flags._walletReturnRewarded = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          // 记录这段相遇，为后续NPC关系提供可能
          st.flags.walletOwnerMet = true;
          StateManager.addMessage(
            "🤝 你们聊了很久。他叫小林，刚来这座城市，在找工作。你说有消息会告诉他。名气+5，心情+12。",
            "success",
          );
        },
      },
      {
        text: "💰 说不用了，顺手帮了而已",
        hint: "道德+3，对方留下联系方式",
        apply: function (st) {
          st.flags._walletReturnRewarded = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          st.flags.walletOwnerMet = true;
          StateManager.addMessage(
            "💰 你摆摆手说没事，对方还是硬塞给你一张写了号码的纸条：「以后有什么需要帮忙的，说一声。」道德+3，心情+15。",
            "success",
          );
        },
      },
    ],
  });

  // A2：老人家属联系你——帮扶老人一周后的意外惊喜
  RANDOM_EVENTS.push({
    id: "moral_elder_connection",
    phase: "street",
    icon: "📞",
    title: "老人的儿子打来电话",
    story:
      "你的手机响了，是个陌生号码。\n「我是上次你在路上扶起来的老头的儿子，在上海做工程。听我爸说了你的事，我联系了好多人才打听到你号码……」\n停顿了一下。「你手头有没有在找活干的朋友？我这边工地要人，待遇不错。」",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.moralHelpedElder &&
        !st.flags._elderConnectionDone &&
        st.player.day >= (st.flags._elderHelpDay || 0) + 5
      );
    },
    probability: 0.5,
    repeatable: false,
    choices: [
      {
        text: "🔨 推荐自己过去",
        hint: "获得工地日薪+30%的特别优待",
        apply: function (st) {
          st.flags._elderConnectionDone = true;
          st.flags.elderSonIntro = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          // 解锁工资加成标记
          st.flags._elderWageBonus = true;
          StateManager.addMessage(
            "🔨 你说自己正好在找活。对方爽快地说：「来吧，就说是老刘介绍的，日薪多¥50。」好事多磨，没想到扶了一把能有这回报。心情+10。",
            "success",
          );
        },
      },
      {
        text: "👥 推荐认识的人过去",
        hint: "名气+8，积累人情网络",
        apply: function (st) {
          st.flags._elderConnectionDone = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "👥 你想了想，把认识的老周介绍了过去。对方很感激，说你这个人靠谱。名气+8，心情+8。你的口碑在工友圈里悄悄传开。",
            "success",
          );
        },
      },
    ],
  });

  // A3：流浪狗再次出现——雨天里的小重逢
  RANDOM_EVENTS.push({
    id: "moral_dog_reunion",
    phase: "street",
    icon: "🐕",
    title: "那只狗又来了",
    story:
      "下雨了。你路过上次的屋檐，那只流浪狗又蜷缩在那里——它抬起头，尾巴微微摆了摆，像是认出了你。",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.moralFedDog &&
        !st.flags._dogFollowing &&
        st.weather &&
        (st.weather.current === "rainy" || st.weather.current === "stormy")
      );
    },
    probability: 0.45,
    repeatable: false,
    choices: [
      {
        text: "🍖 再买根火腿肠给它",
        hint: "花¥3，心情+10，狗狗成为你的小跟班",
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 3);
          st.flags._dogFollowing = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "🐕 小狗吃完抬起头，竟然站起来跟着你走了。你想赶它走，但它那双湿漉漉的眼睛让你开不了口。心情+10，心智+3。它好像认定了你是它的人。",
            "success",
          );
        },
      },
      {
        text: "😔 叹口气继续走",
        hint: "什么也不做",
        apply: function (st) {
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          StateManager.addMessage(
            "😔 你低头继续走。雨声盖过了它轻轻的叫声，你没有回头。心情-3。",
            "info",
          );
        },
      },
    ],
  });

  // A4：乞丐的情报——施舍后的意外回报
  RANDOM_EVENTS.push({
    id: "moral_beggar_tip",
    phase: "street",
    icon: "🧓",
    title: "老头认出了你",
    story:
      "你路过菜市场，那个乞丐老人主动开口：\n「你，就是上次给我买盒饭的那个后生。我记得你。」\n他压低声音：「我在这街上混了二十年，哪块地方今天收摊早、哪里客商多，我都清楚。你要不要听？」",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.moralFedBeggar &&
        !st.flags._beggarTipGiven &&
        st.player.day >= 3
      );
    },
    probability: 0.55,
    repeatable: false,
    choices: [
      {
        text: "👂 认真听他说",
        hint: "获得「老街市」情报，摆摊收益+15%持续3天",
        apply: function (st) {
          st.flags._beggarTipGiven = true;
          st.flags._oldStreetBonus = st.player.day + 3;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "👂 老人说了几个你从没注意过的时机和地点。你试了一天，发现真的好使——摊位附近人流明显多了。摆摊收益+15%，持续3天。心情+8。",
            "success",
          );
        },
      },
      {
        text: "😌 随手给他几块钱道谢",
        hint: "花¥5，道德+2",
        apply: function (st) {
          st.flags._beggarTipGiven = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "😌 你掏了¥5给他，说「谢谢你。」老人收下，点了点头。道德+2，心情+5。",
            "success",
          );
        },
      },
    ],
  });

  // A5：善行积累的共鸣——道德分高时的城市回响
  RANDOM_EVENTS.push({
    id: "moral_karma_windfall",
    phase: "street",
    icon: "🌟",
    title: "这座城市记得你",
    story:
      "今天不知怎么就顺——陌生人主动让路，摊位旁边有人帮你搭手，甚至有个大爷专门拉着你问路聊了半小时，临走留下一句：「后生，好好干，会有出路的。」\n你说不清楚这些偶然背后是什么，但你知道，你平日里的那些小善意在这座城市里留下了痕迹。",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags._moralGoodDeedDone &&
        (st.player.morality || 50) >= 65 &&
        (st.player.fame || 0) >= 15 &&
        !st.flags._karmaWindfallDone
      );
    },
    probability: 0.3,
    repeatable: false,
    choices: [
      {
        text: "🙏 静静感受这一刻",
        hint: "心情+20，心智+3，名气+5",
        apply: function (st) {
          st.flags._karmaWindfallDone = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          StateManager.addMessage(
            "🌟 你停下来，深吸一口气。这座城市冷漠吗？不全是。只要你先伸出手，它也会在某个时刻轻轻托着你。心情+20，心智+3，名气+5。",
            "success",
          );
        },
      },
    ],
  });

  // ========== 主题B：副业→职业/创业进化 (4个) ==========

  // B1：代购口碑带来商业合作机会
  RANDOM_EVENTS.push({
    id: "hustle_daigou_biz_idea",
    phase: "street",
    icon: "🛍️",
    title: "代购客户提议合伙",
    story:
      "那个你全额退款的客户又来找你了。这次她带来了个女伴：\n「这是我姐，她说你处事公道，想和你合伙——做个小规模的进货直卖，不用你出钱，主要用你的渠道和诚信度……」",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.daigouHonestService &&
        !st.flags._daigouBizProposed &&
        st.player.day >= 20
      );
    },
    probability: 0.4,
    repeatable: false,
    choices: [
      {
        text: "🤝 试试看，先小规模合作",
        hint: "每周额外¥200-¥500收入，信誉系统开启",
        apply: function (st) {
          st.flags._daigouBizProposed = true;
          st.flags.daigouPartnership = true;
          var income = Random.int(200, 500);
          st.resources.cash += income;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + income;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "🤝 你们谈妥了。第一批货进来你净赚了¥" +
              income +
              "。口碑变成了资本——这是比技术更难复制的东西。心情+10。",
            "success",
          );
        },
      },
      {
        text: "🙅 谢了，现在还不想分心",
        hint: "拒绝，但对方留下联系方式",
        apply: function (st) {
          st.flags._daigouBizProposed = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "🙅 你说暂时不想，对方把微信留了下来：「想好了随时找我。」心情+3。",
            "info",
          );
        },
      },
    ],
  });

  // B2：换平台后品牌方主动联系
  RANDOM_EVENTS.push({
    id: "hustle_media_brand_deal",
    phase: "street",
    icon: "📱",
    title: "品牌方私信你了",
    story:
      "你的新平台账号涨了一些粉，突然收到一条私信：\n「您好，我是某某品牌的市场专员，我们在寻找生活类达人合作推广，看了您的内容，调性很符合……」\n合作费用¥300。你盯着这条消息，有点不敢相信。",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.selfMediaPivoted &&
        !st.flags._mediaBrandDeal &&
        st.player.day >= 14
      );
    },
    probability: 0.45,
    repeatable: false,
    choices: [
      {
        text: "✅ 接！先开这个口",
        hint: "获得¥300，粉丝+200，开启自媒体收入轨道",
        apply: function (st) {
          st.flags._mediaBrandDeal = true;
          st.flags.selfMediaMonetized = true;
          st.resources.cash += 300;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + 300;
          if (st._sideHustleData && st._sideHustleData.selfMedia) {
            st._sideHustleData.selfMedia.followers =
              (st._sideHustleData.selfMedia.followers || 0) + 200;
          }
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          StateManager.addMessage(
            "✅ 你发了条测评视频，收到了¥300和一批新粉丝。那个「换平台」的决定，或许是对的。心情+15，粉丝+200。",
            "success",
          );
        },
      },
      {
        text: "🤔 先问清楚条件再说",
        hint: "可能谈成更高价格，也可能吹了",
        apply: function (st) {
          st.flags._mediaBrandDeal = true;
          if (Random.chance(0.5)) {
            var deal = Random.int(400, 600);
            st.resources.cash += deal;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + deal;
            st.flags.selfMediaMonetized = true;
            StateManager.addMessage(
              "🤔 你谈到了¥" + deal + "。会谈条件的人，不吃亏。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🤔 你提了些条件，对方说「那不合适」，沉默了。这单黄了。",
              "info",
            );
          }
        },
      },
    ],
  });

  // B3：抄底成功后被人请教投资
  RANDOM_EVENTS.push({
    id: "hustle_invest_guru",
    phase: "street",
    icon: "📈",
    title: "「你上次说的真准」",
    story:
      "工友老赵今天特意来找你：\n「上次听你说那个股跌到底了可以抄底，我试了，真的涨回来了！你是怎么判断的？」\n他掏出手机，把他的账户截图给你看——确实赚了不少。",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.investBottomed &&
        !st.flags._investGuruDone &&
        st.player.day >= 7
      );
    },
    probability: 0.5,
    repeatable: false,
    choices: [
      {
        text: "📚 认真给他讲逻辑",
        hint: "智力+3，名气+5，建立工友信任",
        apply: function (st) {
          st.flags._investGuruDone = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 3,
          );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "📚 你说了一些基本的判断逻辑，老赵听得入神。有时候能把复杂的事说清楚，比赚钱本身更值钱。智力+3，名气+5，心情+8。",
            "success",
          );
        },
      },
      {
        text: "😅 运气好而已，别太当真",
        hint: "谦虚处理，但对方以后会更信任你",
        apply: function (st) {
          st.flags._investGuruDone = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 1);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "😅 你说纯属运气，老赵半信半疑，但对你的印象好了不少——不吹牛，踏实。心情+5。",
            "success",
          );
        },
      },
    ],
  });

  // B4：创新教法被教育机构看中
  RANDOM_EVENTS.push({
    id: "hustle_tutor_institution",
    phase: "street",
    icon: "🏫",
    title: "培训机构找上门",
    story:
      "那个家长和另一位家长聊起了你的「游戏教学法」，消息传到了附近一家小培训机构的老板耳朵里。\n「我想请你来试讲一次——如果效果好，可以长期合作，课时费比市面上高30%。」",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.tutorInnovative &&
        !st.flags._tutorInstitutionOffer &&
        st.player.day >= 10
      );
    },
    probability: 0.4,
    repeatable: false,
    choices: [
      {
        text: "🎓 去试讲！",
        hint: "获得机构长期合作，家教收入稳定化",
        apply: function (st) {
          st.flags._tutorInstitutionOffer = true;
          st.flags.tutorInstitutionPartner = true;
          var income = Random.int(300, 500);
          st.resources.cash += income;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + income;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          StateManager.addMessage(
            "🎓 试讲很成功！孩子们一直追着你问问题。老板当场拍板：每周3课时，课时费¥" +
              Math.round(income / 3) +
              "，到手¥" +
              income +
              "。心情+12，名气+6。",
            "success",
          );
        },
      },
      {
        text: "🤔 考虑一下，先保持灵活",
        hint: "不绑定，但错失稳定收入",
        apply: function (st) {
          st.flags._tutorInstitutionOffer = true;
          StateManager.addMessage(
            "🤔 你说再想想，机构老板点点头：「随时欢迎。」稳定未必是最好，但机会就在这里。",
            "info",
          );
        },
      },
    ],
  });

  // ========== 主题C：时代里程碑的后续 (4个) ==========

  // C1：风口泡沫破裂——Day 270+ 后对「抓住风口」的玩家
  RANDOM_EVENTS.push({
    id: "era_trend_bubble_pop",
    phase: "street",
    icon: "💥",
    title: "风口没了",
    story:
      "新闻说那个「行业蓝海」其实早就被资本玩烂了——一大批做这行的人被裁员，日薪回到了原来的水平，甚至更低。\n张姐来找你：「你还记得当初你来那个风口行业的日子吗？我早就觉得不对劲。」",
    // [自洽修复] 叙事中直接称呼"张姐"，conditions 必须校验 sister_zhang 是否已结识
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.trendJobUnlocked &&
        !st.flags._trendBubblePop &&
        st.player.day >= 270 &&
        st.relationships &&
        st.relationships.sister_zhang &&
        st.relationships.sister_zhang.met === true
      );
    },
    probability: 0.5,
    repeatable: false,
    choices: [
      {
        text: "📊 反思：这次学到了什么？",
        hint: "智力+5，心智+3，获得「泡沫识别者」经验",
        apply: function (st) {
          st.flags._trendBubblePop = true;
          st.flags.bubbleRecognizer = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 5,
          );
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
          StateManager.addMessage(
            "📊 你冷静复盘了整件事——进入时机的判断、行业周期的规律、人群跟风的心理。学费交了，但这些认知以后不会再买单。智力+5，心智+3，心情-5。",
            "success",
          );
        },
      },
      {
        text: "😔 随风而逝，再找下一个出路",
        hint: "接受，继续前行",
        apply: function (st) {
          st.flags._trendBubblePop = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
          StateManager.addMessage(
            "😔 你叹了口气。能怎么办呢？只能再找活干。心情-10。但也许，这次你会看得更清楚。",
            "warning",
          );
        },
      },
    ],
  });

  // C2：转行后的阶段性结果
  RANDOM_EVENTS.push({
    id: "era_career_pivot_result",
    phase: "street",
    icon: "🔄",
    title: "转行满半年了",
    story:
      "你算了算，转行到新领域已经快半年了。老周问你：「换了行当，比之前强吗？」\n你认真想了想……",
    // [自洽修复] 叙事中直接称呼"老周"，conditions 必须校验 old_zhou 是否已结识
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.careerShift &&
        !st.flags._careerPivotResult &&
        st.player.day >= 540 &&
        st.relationships &&
        st.relationships.old_zhou &&
        st.relationships.old_zhou.met === true
      );
    },
    probability: 0.6,
    repeatable: false,
    choices: [
      {
        text: "💪 「强多了，虽然开始很难」",
        hint: "心智+5，智力+3，解锁「转型成功者」路径",
        apply: function (st) {
          st.flags._careerPivotResult = true;
          st.flags.pivotSuccess = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 3,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "💪 你列举了这半年赚到的、学到的和认识的人。老周竖起大拇指：「你比我强，我当年没勇气转。」心智+5，智力+3，心情+10。",
            "success",
          );
        },
      },
      {
        text: "😔 「说不清楚，还在摸索」",
        hint: "真实的答案——继续积累",
        apply: function (st) {
          st.flags._careerPivotResult = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
          StateManager.addMessage(
            "😔 「还在适应。」老周拍拍你肩膀：「正常，哪有那么快。」他说他自己都摸索了两年。心智+2。慢慢来。",
            "info",
          );
        },
      },
    ],
  });

  // C3：小店遭遇连锁竞争
  RANDOM_EVENTS.push({
    id: "era_small_biz_rival",
    phase: "street",
    icon: "🏪",
    title: "旁边开了家连锁",
    story:
      "你的小店刚开起来没多久，旁边的铺子突然换了块牌子——一家大连锁便利店入驻了。\n第一天，你的客流量少了三分之一。",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.smallBusinessUnlocked &&
        !st.flags._smallBizRival &&
        st.player.day >= 560
      );
    },
    probability: 0.55,
    repeatable: false,
    choices: [
      {
        text: "🎯 做差异化，主打熟客服务",
        hint: "智力+4，长期留住老客，小店存活率提升",
        apply: function (st) {
          st.flags._smallBizRival = true;
          st.flags.smallBizDifferentiated = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 4,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "🎯 你开始记老客的口味、存货帮他们留着、电话通知到货——连锁店做不到这些。客流慢慢回来了一些。智力+4，心情+8。",
            "success",
          );
        },
      },
      {
        text: "💸 打价格战",
        hint: "短期有效，但伤血本",
        apply: function (st) {
          st.flags._smallBizRival = true;
          var loss = Random.int(200, 500);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - loss);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
          StateManager.addMessage(
            "💸 你跟着降价，赢回了部分客流，但亏了¥" +
              loss +
              "。打价格战对小商家来说从来不是好路子。心情-8。",
            "warning",
          );
        },
      },
      {
        text: "🤝 和连锁店老板聊聊",
        hint: "可能找到合作机会",
        apply: function (st) {
          st.flags._smallBizRival = true;
          if (Random.chance(0.4)) {
            st.flags.chainStorePartner = true;
            var income = Random.int(300, 600);
            st.resources.cash += income;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "🤝 连锁店的负责人很年轻，愿意转介绍特殊商品客户给你。当月多了¥" +
                income +
                "的营业额。心情+5。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🤝 对方客气但拒绝了合作，说公司有规定。你只好各自为战。",
              "info",
            );
          }
        },
      },
    ],
  });

  // C4：创业道路上的导师相遇
  RANDOM_EVENTS.push({
    id: "era_startup_mentor_chance",
    phase: "street",
    icon: "🧑‍💼",
    title: "楼道里遇到的人",
    story:
      "你去工商局办手续，在等号的时候旁边坐了个五十多岁的中年人，西装但不扎领带，看着像创业老手。\n他主动说：「第一次注册公司？」\n你点点头。他笑了笑，开始讲一段故事。",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.startupUnlocked &&
        !st.flags._startupMentorMet &&
        st.player.day >= 730
      );
    },
    probability: 0.5,
    repeatable: false,
    choices: [
      {
        text: "👂 认真听他说",
        hint: "智力+5，心智+5，获得「导师指点」创业加速效果",
        apply: function (st) {
          st.flags._startupMentorMet = true;
          st.flags.startupMentorBonus = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 5,
          );
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          StateManager.addMessage(
            "👂 他讲了三件事：找合伙人比找客户重要；第一年的现金流比利润重要；做你真正懂的行业。号叫到了，他起身，只留下一张名片。「有问题打我。」智力+5，心智+5，心情+12。",
            "success",
          );
        },
      },
      {
        text: "😌 礼貌回应，各办各的",
        hint: "错过一次机缘",
        apply: function (st) {
          st.flags._startupMentorMet = true;
          StateManager.addMessage(
            "😌 你礼貌点头，各自低头看手机。号叫到了，他先走了。你想想，其实可以多聊两句的。",
            "info",
          );
        },
      },
    ],
  });

  // ========== 主题D：副业负面反噬 (3个) ==========

  // D1：外卖封号后找新出路
  RANDOM_EVENTS.push({
    id: "hustle_ban_recovery",
    phase: "street",
    icon: "🛵",
    title: "封号了怎么办",
    story:
      "外卖平台真的停了你的接单权限，消息提示「已暂停，请联系客服」。\n你坐在车上，计算了一下：如果接下来三天没收入，房租就要缺口了。",
    conditions: function (st) {
      return st.flags && st.flags.deliveryBan && !st.flags._deliveryBanRecovery;
    },
    probability: 0.75,
    repeatable: false,
    choices: [
      {
        text: "📦 临时转做包裹快递",
        hint: "收入-30%，但不断档，健康-5",
        apply: function (st) {
          st.flags._deliveryBanRecovery = true;
          st.flags.deliveryBanRecovered = true;
          var income = Random.int(60, 120);
          st.resources.cash += income;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + income;
          st.status.health = Math.max(0, (st.status.health || 70) - 5);
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
          StateManager.addMessage(
            "📦 你联系了附近的快递站，临时接了几单手工分拣+派件。比外卖累，赚了¥" +
              income +
              "。封号三天内，先把这个撑过去。健康-5，疲劳+15。",
            "warning",
          );
        },
      },
      {
        text: "🏪 临时摆摊补收入",
        hint: "灵活适应，行动力-20",
        apply: function (st) {
          st.flags._deliveryBanRecovery = true;
          st.player.actionPoints = Math.max(
            0,
            (st.player.actionPoints || 100) - 20,
          );
          var income = Random.int(40, 100);
          st.resources.cash += income;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + income;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "🏪 你在路口摆了个小摊，卖点小零食。赚了¥" +
              income +
              "，不多，但够应急。心情+5，行动力-20。",
            "info",
          );
        },
      },
      {
        text: "🙏 申诉，争取早点解封",
        hint: "等待结果，3天后可能恢复",
        apply: function (st) {
          st.flags._deliveryBanRecovery = true;
          st.flags._deliveryBanAppealing = true;
          st.flags._deliveryAppealDay = st.player.day;
          StateManager.addMessage(
            "🙏 你提交了申诉材料，客服说3个工作日处理。这三天没有收入，你在计算手头的余额。",
            "info",
          );
        },
      },
    ],
  });

  // D2：代购差评发酵——社交网络扩散
  RANDOM_EVENTS.push({
    id: "hustle_daigou_review_crisis",
    phase: "street",
    icon: "😡",
    title: "差评在群里传开了",
    story:
      "那个给你差评的客户，把对话记录截图发到了三个微信群里。你在不同的群里收到了同样的消息：\n「大家注意，这个代购有问题……」",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.daigouBadReview &&
        !st.flags._daigouCrisis &&
        st.player.day >= 5
      );
    },
    probability: 0.6,
    repeatable: false,
    choices: [
      {
        text: "📢 公开道歉并说明情况",
        hint: "损失部分名气，但止血",
        apply: function (st) {
          st.flags._daigouCrisis = true;
          st.player.fame = Math.max(0, (st.player.fame || 0) - 5);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          StateManager.addMessage(
            "📢 你在每个群里都发了说明，承认了商品的问题，并表示会改进。大多数人认可你的态度，事件逐渐平息。名气-5，道德+3，心情-8。",
            "success",
          );
        },
      },
      {
        text: "🤐 沉默处理，不公开回应",
        hint: "短期平静，但信誉受损",
        apply: function (st) {
          st.flags._daigouCrisis = true;
          st.player.fame = Math.max(0, (st.player.fame || 0) - 12);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
          StateManager.addMessage(
            "🤐 你选择沉默。几天后事情热度消散，但你的代购订单少了两成——口碑圈子就这么大。名气-12，心情-5。",
            "warning",
          );
        },
      },
    ],
  });

  // D3：观望的投资终于到了关键节点
  RANDOM_EVENTS.push({
    id: "hustle_invest_hold_result",
    phase: "street",
    icon: "📊",
    title: "你之前持有的那个仓位……",
    story:
      "两周前你选择「持有观望」的那笔投资，今天突然有了动静——价格涨回来了，而且超过了买入价5%。\n你盯着屏幕上的绿色数字，手指悬在「卖出」按钮上。",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.investHold &&
        !st.flags._investHoldResult &&
        st.player.day >= 14
      );
    },
    probability: 0.55,
    repeatable: false,
    choices: [
      {
        text: "💰 止盈卖出，落袋为安",
        hint: "获得¥200-¥600盈利",
        apply: function (st) {
          st.flags._investHoldResult = true;
          var profit = Random.int(200, 600);
          st.resources.cash += profit;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
          st.flags.investBottomed = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          StateManager.addMessage(
            "💰 你卖出了，获利¥" +
              profit +
              "。坚持等待的人，有时候是对的。心情+12。",
            "success",
          );
        },
      },
      {
        text: "📈 继续拿，相信它还能涨",
        hint: "40%概率再赚，60%概率震荡回落",
        apply: function (st) {
          st.flags._investHoldResult = true;
          if (Random.chance(0.4)) {
            var bonus = Random.int(300, 800);
            st.resources.cash += bonus;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + bonus;
            st.flags.investBottomed = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            StateManager.addMessage(
              "📈 你继续持有，三天后又涨了！最终获利¥" +
                bonus +
                "。贪心有时候是对的。心情+15。",
              "success",
            );
          } else {
            var loss = Random.int(50, 200);
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - loss);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
            StateManager.addMessage(
              "📉 你没卖，结果又跌回去了，还亏了¥" +
                loss +
                "。不落袋的利润，不算利润。心情-10。",
              "warning",
            );
          }
        },
      },
    ],
  });

  // ========== 主题E：跨阶段综合桥接 (4个) ==========

  // E1：职场道德声誉的长期回报
  RANDOM_EVENTS.push({
    id: "corp_integrity_recognition",
    phase: "corporate",
    icon: "🏅",
    title: "主管找你谈话",
    story:
      "主管今天专门过来找你，关上了办公室的门：\n「公司在筛选一批诚信档案，你的名字在名单里。这不是奖励，是考察——我想知道你是否愿意承担更多责任？」",
    conditions: function (st) {
      return (
        st.player &&
        st.player.phase === "corporate" &&
        st.flags &&
        (st.flags.moralWalletReturner || st.flags.moralRefusedFraud) &&
        !st.flags._corpIntegrityRecognized
      );
    },
    probability: 0.4,
    repeatable: false,
    choices: [
      {
        text: "💼 「我愿意。」",
        hint: "职场声誉+15，提前解锁晋升机会",
        apply: function (st) {
          st.flags._corpIntegrityRecognized = true;
          if (st.player.corporate) {
            st.player.corporate.dignity = Math.min(
              100,
              (st.player.corporate.dignity || 60) + 15,
            );
            st.player.corporate.upward = Math.min(
              100,
              (st.player.corporate.upward || 50) + 10,
            );
          }
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          StateManager.addMessage(
            "💼 主管点了点头，在某个表格上打了钩。你不知道这会带来什么，但你选择了说真话。职场尊严+15，晋升意向+10，心情+12。",
            "success",
          );
        },
      },
      {
        text: "🤔 「我需要了解更多才能决定」",
        hint: "谨慎，维持现状",
        apply: function (st) {
          st.flags._corpIntegrityRecognized = true;
          StateManager.addMessage(
            "🤔 主管说：「没关系，这个机会一直在。」他起身开门，谈话结束了。",
            "info",
          );
        },
      },
    ],
  });

  // E2：多年职场积累触发创业灵感
  RANDOM_EVENTS.push({
    id: "career_startup_epiphany",
    phase: "corporate",
    icon: "💡",
    title: "那个一直放在心里的想法",
    story:
      "你在一次客户会议上，听到对方吐槽一个行业痛点——那个问题你工作以来见过不知道多少次，你甚至知道怎么解决。\n坐地铁回公司的路上，你把方案思路写满了备忘录，关掉屏幕，看着车窗外，心里某个东西动了一下。",
    conditions: function (st) {
      var workDays =
        st.career && st.career.currentJob && st.career.currentJob.workDays;
      return (
        st.player &&
        st.player.phase === "corporate" &&
        (workDays || 0) >= 300 &&
        !(st.startup && st.startup.company) &&
        !st.flags._startupEpiphany
      );
    },
    probability: 0.35,
    repeatable: false,
    choices: [
      {
        text: "📓 整理成完整方案，认真研究可行性",
        hint: "智力+5，解锁「创业可行性研究」任务链",
        apply: function (st) {
          st.flags._startupEpiphany = true;
          st.flags.startupEpiphanyDone = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 5,
          );
          st.player.mental = Math.min(100, (st.player.mental || 0) + 4);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "📓 你花了两周把这个想法梳理成了一份可行性文档。越写越兴奋，越写越害怕——但你知道，这个想法值得认真对待。智力+5，心智+4，心情+10。",
            "success",
          );
        },
      },
      {
        text: "😔 算了，做好眼前的工作",
        hint: "理性压制，但想法还在",
        apply: function (st) {
          st.flags._startupEpiphany = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
          StateManager.addMessage(
            "😔 你锁上手机，回去加班。那个备忘录一直没删——你知道你还会打开它的。心情-5。",
            "warning",
          );
        },
      },
    ],
  });

  // E3：城市影响者被人拉拢
  RANDOM_EVENTS.push({
    id: "city_influence_leverage",
    phase: "street",
    icon: "🌆",
    title: "有人专门找到你",
    story:
      "一个年轻人自我介绍说是某个社区组织的负责人：\n「我们听说过你，在这片区域你的口碑很高。我们希望你能加入社区顾问委员会——这是义务的，但有些资源我们可以帮你对接。」",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.cityInfluencer &&
        !st.flags._cityInfluenceLeveraged &&
        st.player.day >= 910
      );
    },
    probability: 0.55,
    repeatable: false,
    choices: [
      {
        text: "🏙️ 加入，扩展人脉网络",
        hint: "名气+10，解锁「社区资源」每周固定事件",
        apply: function (st) {
          st.flags._cityInfluenceLeveraged = true;
          st.flags.communityAdvisor = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          StateManager.addMessage(
            "🏙️ 你答应了。第一次会议上你认识了十来个在各行业小有名气的人。这些人脉，某一天会派上用场。名气+10，心情+15。",
            "success",
          );
        },
      },
      {
        text: "🙅 谢谢，我更想低调做事",
        hint: "拒绝，但影响力自然积累",
        apply: function (st) {
          st.flags._cityInfluenceLeveraged = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "🙅 你礼貌地拒绝了。有些人不需要标签，影响力自然会在的。心情+5。",
            "info",
          );
        },
      },
    ],
  });

  // E4：昧下钱包后的心理阴影
  RANDOM_EVENTS.push({
    id: "moral_wallet_stolen_shadow",
    phase: "street",
    icon: "😰",
    title: "那个钱包的主人……",
    story:
      "你经过派出所门口，看到一张寻找失物的告示——一个钱包，描述和你那次捡到的几乎一模一样。联系人是个女学生。\n你停下脚步，盯着那张纸看了很久。",
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.moralWalletStolen &&
        !st.flags._walletShadowDone &&
        (st.player.morality || 50) < 50
      );
    },
    probability: 0.5,
    repeatable: false,
    choices: [
      {
        text: "😔 主动去派出所说明情况",
        hint: "道德+8，心情-5，心智+3（做了一件难但正确的事）",
        apply: function (st) {
          st.flags._walletShadowDone = true;
          st.flags.moralWalletConfessed = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 8);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
          StateManager.addMessage(
            "😔 你推开了警局的门。告诉了警察真相。警察很意外，你被批评了一顿，但那个学生后来打来电话道了谢——钱已经还不回来，但她说「至少你说了真话」。道德+8，心智+3，心情-5。",
            "success",
          );
        },
      },
      {
        text: "🚶 快步离开，假装没看见",
        hint: "道德-3，这件事会在某个地方积压着",
        apply: function (st) {
          st.flags._walletShadowDone = true;
          st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
          StateManager.addMessage(
            "🚶 你低着头走开了。那张告示的内容，很长时间里你都记得清清楚楚。道德-3，心情-8。",
            "warning",
          );
        },
      },
    ],
  });

  // 链式事件2：见义勇为后续——被救姑娘送来感谢信（Event 4 后续）
  RANDOM_EVENTS.push({
    id: "moral_pickpocket_followup_kindness",
    _isChainEvent: true,
    phase: "street",
    icon: "💌",
    title: "迟来的感谢",
    story:
      "有人托王大婶带了个信封给你——打开一看，是几天前那个差点被偷的姑娘写的。\n\n字迹有些歪扭，但很认真：「那天太慌乱了没当面向你道谢，问了旁边的人才打听到你住这片。一点心意，请一定收下。」",
    choices: [
      {
        text: "💌 收下信和礼物",
        hint: "心情+15，收到感谢费¥100",
        apply: function (st) {
          st.resources.cash += 100;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + 100;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.flags._moralGoodDeedDone = true;
          StateManager.addMessage(
            "💌 信封里除了感谢信还有¥100。你看了两遍那封信，虽然只有短短几行字，但在这座冷漠的城市里，它比一百块钱更暖。好心情+15，名气+3，收到¥100。",
            "success",
          );
        },
      },
      {
        text: "📬 回一封信，不收她的钱",
        hint: "真正的善意，道德+2，名气+5",
        apply: function (st) {
          st.resources.cash += 100; // 信里夹的钱
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          st.flags._moralGoodDeedDone = true;
          StateManager.addMessage(
            "📬 你回了一封短信：「不用谢，下次小心就好。」把¥100夹在信里托王大婶带回去。你不知道她收到后会怎么想，但你心里很踏实。道德+2，名气+5，心情+20。",
            "success",
          );
        },
      },
    ],
  });
  // ====================================================================
  // v3.19 — 联动空白区填充（3个事件）
  // 设计理念：让"长期积累"和"环境组合"产生有意义的叙事交汇
  // ====================================================================

  // 主题1：跑腿老手→客户转介绍商机
  // 设计意图：玩家长期配送/驾驶后遇到回头客，口头推荐变成稳定订单来源
  RANDOM_EVENTS.push({
    id: "delivery_veteran_referral",
    phase: "street",
    icon: "📋",
    title: "老客户的推荐",
    story:
      "你正在路边歇脚，一个穿格子衫的中年男人快步走过来——有点眼熟。\n\n「你不就是上次帮我们公司送标书那位吗？我同事上次也找你跑了一趟，说你效率高。」\\n他递来一张名片：「有个长期合作——每周三趟固定配送，价格好商量。你接不接？」",
    conditions: function (st) {
      // 有配送/驾驶经历且天数>30（有足够积累）
      if (st.player.day < 30) return false;
      var driveLvl =
        st.skills && st.skills.driving ? st.skills.driving.level || 0 : 0;
      if (driveLvl < 15) return false;
      if (
        st.flags._deliveryReferralDay &&
        st.player.day - st.flags._deliveryReferralDay < 40
      )
        return false;
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🤝 接！长期合作稳当",
        hint: "解锁固定配送收入+心智",
        apply: function (st) {
          st.flags._deliveryReferralDay = st.player.day;
          st.flags._fixedDeliveryRoute = true;
          var income = Random.int(200, 400);
          st.resources.cash += income;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + income;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "🤝 你接下了这份长期订单。每周三趟配送，比跑散单稳定多了。对方拍板说「就按¥" +
              income +
              "一周先试跑」。心智+2，心情+8，解锁固定配送收入。",
            "success",
          );
        },
      },
      {
        text: "📱 加微信，有需要再联系",
        hint: "保留机会，不绑定",
        apply: function (st) {
          st.flags._deliveryReferralDay = st.player.day;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          StateManager.addMessage(
            "📱 你加了微信。对方说「行，随时联系。」名气+2。在这座城市，多一个朋友就是多一条路。",
            "info",
          );
        },
      },
      {
        text: "😅 最近太忙了，下次吧",
        hint: "拒绝",
        apply: function (st) {
          st.flags._deliveryReferralDay = st.player.day;
          StateManager.addMessage(
            "😅 你婉拒了。他点点头走开了。名片你没丢——也许下次打过去还有用。",
            "info",
          );
        },
      },
    ],
  });

  // 主题2：修理技能→工厂设备抢修
  // 设计意图：高修理技能的玩家在街头被工厂主管看中，临时抢修设备——技能不再是"数据"
  RANDOM_EVENTS.push({
    id: "repair_factory_emergency",
    phase: "street",
    icon: "⚙️",
    title: "机器坏了",
    story:
      "你路过一家小加工厂门口，一个满手机油的人冲出来，看到你手里拎着的工具袋眼前一亮。\n\n「兄弟！你会修机器不？我这台冲床坏了，今天不修好明天交不了货。修好了给你这个数——」他比了个手势。",
    conditions: function (st) {
      if (st.player.day < 20) return false;
      var repLevel =
        st.skills && st.skills.repair ? st.skills.repair.level || 0 : 0;
      if (repLevel < 35) return false;
      if (
        st.flags._repairFactoryDay &&
        st.player.day - st.flags._repairFactoryDay < 30
      )
        return false;
      return true;
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      {
        text: "🔧 看看去！能修就修",
        hint: "修理技能实战，报酬丰厚",
        apply: function (st) {
          st.flags._repairFactoryDay = st.player.day;
          var repLevel =
            st.skills && st.skills.repair ? st.skills.repair.level || 0 : 0;
          var fee = 150 + Math.floor(repLevel * 3);
          st.resources.cash += fee;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + fee;
          if (st.skills && st.skills.repair) {
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 50;
          }
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "🔧 你蹲下来检查了半小时——传动皮带断了，齿轮卡死。你拆开、清理、换上备件，一气呵成。机器重新轰鸣的那一刻，主管冲你竖起了大拇指。拿着¥" +
              fee +
              "走出厂门时，你觉得这门手艺没白学。修理XP+50，心情+10。",
            "success",
          );
        },
      },
      {
        text: "😅 我就是个半吊子，怕耽误你",
        hint: "谦虚，不接",
        apply: function (st) {
          st.flags._repairFactoryDay = st.player.day;
          StateManager.addMessage(
            "😅 你摆摆手走了。他失望地打电话找别人。下次再有这样的机会，你会更有把握吗？",
            "info",
          );
        },
      },
    ],
  });

  // 主题3：暴雨+市场→雨具紧急需求
  // 设计意图：天气+当前位置组合产生即时商机，让玩家学会利用环境
  RANDOM_EVENTS.push({
    id: "rain_market_umbrella_windfall",
    phase: "street",
    icon: "🌂",
    title: "暴雨天的雨伞生意",
    story:
      "你正在批发市场附近，天突然暗了下来——暴雨说来就来。\n\n周围的人开始狂奔躲雨，但菜市场门口有个小贩在卖雨伞——¥25一把，3分钟卖了20把。你看了看旁边的批发店，门口堆着一箱箱的库存折叠伞。",
    conditions: function (st) {
      if (st.player.day < 10) return false;
      if (!st.weather) return false;
      if (st.weather.current !== "rainy" && st.weather.current !== "stormy")
        return false;
      var curLoc = st.trade && st.trade.currentLocation;
      if (curLoc !== "wholesaleMarket") return false;
      if (
        st.flags._rainMarketUmbrellaDay &&
        st.player.day - st.flags._rainMarketUmbrellaDay < 30
      )
        return false;
      return true;
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "💰 进一批伞就地卖！",
        hint: "¥200进货，可赚¥300-¥500",
        apply: function (st) {
          st.flags._rainMarketUmbrellaDay = st.player.day;
          if (st.resources.cash >= 200) {
            st.resources.cash -= 200;
            var profit = Random.int(300, 500);
            st.resources.cash += profit;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
            StateManager.addMessage(
              "💰 你冲进批发店¥200拿了20把折叠伞，在市场门口就地摆摊。雨越大人越好卖——不到一小时全卖光了！净赚¥" +
                profit +
                "。有的人甚至不要找零就跑了。心情+12，疲劳+10。暴雨天对有些人来说是麻烦，对你是生意。",
              "success",
            );
          } else {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
            StateManager.addMessage(
              "💰 你看了看口袋——连¥200的进货钱都没有。只能看着别人赚钱。心情-5。",
              "warning",
            );
          }
        },
      },
      {
        text: "🏪 躲雨，顺便帮旁边小店理货",
        hint: "好人缘，可能被记住",
        apply: function (st) {
          st.flags._rainMarketUmbrellaDay = st.player.day;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "🏪 你躲进旁边的小店，顺手帮老板把门口的货搬进了里面。老板连声道谢，塞了瓶水给你。名气+3，心情+3。有时候举手之劳也能积攒人情。",
            "info",
          );
        },
      },
      {
        text: "😤 淋着雨走，不管了",
        hint: "健康可能下降",
        apply: function (st) {
          st.flags._rainMarketUmbrellaDay = st.player.day;
          st.status.health = Math.max(0, (st.status.health || 70) - 5);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          StateManager.addMessage(
            "😤 你冒雨走回住处，浑身湿透。打了几个喷嚏——可别感冒了。健康-5，心情-3。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== v3.28 新增联动事件（空白区填充） ======

  // 1. 连续多天高强度工作后的「身体崩溃」特遇
  // 联动：flags._habits.highFatigueStreak + employment + health
  RANDOM_EVENTS.push(
    {
      id: "overwork_body_crash",
      phase: "street",
      icon: "🫨",
      title: "身体亮红灯了",
      story:
        "你连续加班了一周，今天站在操作台前突然眼前一黑，差点摔倒。同事一把扶住你说：「你是不是没睡觉？」\n\n你摸了摸额头，烫得吓人。身体已经不是累的问题了——它在抗议。",
      conditions: function (st) {
        var habits = st.flags && st.flags._habits;
        // 连续3天以上高疲劳 或 健康已低于35
        return (
          st.player.phase === "street" &&
          ((habits && habits.highFatigueStreak >= 3) ||
            (st.status && st.status.health != null && st.status.health < 35))
        );
      },
      probability: 0.08,
      repeatable: false,
      choices: [
        {
          text: "🏥 请假看病（¥100）",
          hint: "花钱买命，健康+15",
          apply: function (st) {
            if (st.resources.cash >= 100) {
              st.resources.cash -= 100;
              st.status.health = Math.min(100, (st.status.health || 50) + 15);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 30);
              if (st.flags._habits) st.flags._habits.highFatigueStreak = 0;
              StateManager.addMessage(
                "🏥 你请了一天病假去医院，医生说是过度劳累。打了针吃了药，舒服了不少。健康+15，疲劳-30。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "😰 你想去看病，但连¥100都凑不齐。只能硬着头皮回去上班。",
                "warning",
              );
              st.status.health = Math.max(0, (st.status.health || 50) - 10);
            }
          },
        },
        {
          text: "💊 买药扛过去（¥30）",
          hint: "临时缓解，不治本",
          apply: function (st) {
            if (st.resources.cash >= 30) {
              st.resources.cash -= 30;
              st.status.health = Math.min(100, (st.status.health || 50) + 5);
              StateManager.addMessage(
                "💊 你买了些退烧药和板蓝根，灌了两大杯水。好点了，但你知道这只是缓兵之计。",
                "info",
              );
            } else {
              StateManager.addMessage(
                "😵 连¥30的药都买不起。你靠在墙上喘了口气。",
                "warning",
              );
              st.status.health = Math.max(0, (st.status.health || 50) - 8);
            }
          },
        },
        {
          text: "💪 没事，年轻人扛得住",
          hint: "健康-15，可能触发疾病",
          apply: function (st) {
            st.status.health = Math.max(0, (st.status.health || 50) - 15);
            if (!st.flags._habits) st.flags._habits = {};
            st.flags._habits.overworkDenialCount =
              (st.flags._habits.overworkDenialCount || 0) + 1;
            StateManager.addMessage(
              "💪 你摇了摇头继续干活。但身体的账迟早要还。健康-15。",
              "danger",
            );
          },
        },
      ],
    },

    // 2. 技能≥50解锁的「专业人士视角」事件
    // 联动：skills.*.level >= 50 + trade.currentLocation
    {
      id: "pro_insight_quality_check",
      phase: "street",
      icon: "🔍",
      title: "行家一眼看出问题",
      story:
        "你在批发市场挑货，旁边两个商贩在争论一批货的质量。外行人看不出区别，但你凭经验一眼就看出这批货里掺了次品。\n\n你犹豫了一下——是说还是不说？",
      conditions: function (st) {
        // 检查是否有任何技能≥50
        var hasExpertSkill = false;
        if (st.skills) {
          for (var sk in st.skills) {
            if (st.skills[sk] && st.skills[sk].level >= 50) {
              hasExpertSkill = true;
              break;
            }
          }
        }
        return (
          st.player.phase === "street" &&
          hasExpertSkill &&
          st.trade &&
          st.trade.currentLocation === "wholesaleMarket" &&
          !st.flags._proInsightSeen
        );
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🗣️ 指出问题，帮他们辨别",
          hint: "名气+5，商贩好感",
          apply: function (st) {
            st.flags._proInsightSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            // 随机选择一个≥50的技能加经验
            if (st.skills) {
              for (var sk2 in st.skills) {
                if (st.skills[sk2] && st.skills[sk2].level >= 50) {
                  st.skills[sk2].xp = (st.skills[sk2].xp || 0) + 30;
                  break;
                }
              }
            }
            StateManager.addMessage(
              "🔍 你一眼看出问题所在，两个商贩都惊了：「行家啊！」名气+5，技能经验+30。专业的事还得专业的人来看。",
              "success",
            );
          },
        },
        {
          text: "🤐 看热闹不说话",
          hint: "安全但错失机会",
          apply: function (st) {
            st.flags._proInsightSeen = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage(
              "🤐 你看了看热闹。他们吵了半天最后还是买错了——但你没开口。心情+3。",
              "info",
            );
          },
        },
      ],
    },
  );

  // 3. NPC好感≥70的「意外信息」事件
  // 联动：relationships.*.affinity >= 70 + discovered
  RANDOM_EVENTS.push({
    id: "npc_secret_info",
    phase: "street",
    icon: "🤫",
    title: "密友的秘密情报",
    story: "",
    conditions: function (st) {
      // 检查是否有任何NPC好感≥70且已解锁deepTask
      if (!st.relationships) return false;
      for (var nid in st.relationships) {
        var rel = st.relationships[nid];
        if (rel && rel.met && (rel.affinity || 0) >= 70) {
          return true;
        }
      }
      return false;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "👂 认真听TA说",
        hint: "获得隐藏信息，可能有用",
        apply: function (st) {
          // 找出好感最高的NPC
          var bestNpc = null;
          var bestAff = -200;
          for (var nid2 in st.relationships) {
            var rel2 = st.relationships[nid2];
            if (rel2 && rel2.met && (rel2.affinity || 0) > bestAff) {
              bestAff = rel2.affinity || 0;
              bestNpc = nid2;
            }
          }
          if (bestNpc) {
            st.flags._secretInfoFrom = bestNpc;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            // 根据NPC类型给出不同情报
            if (bestNpc === "aunt_wang") {
              st.flags._knowsRentalMarket = true;
              StateManager.addMessage(
                "🤫 王大婶拉着你说：「最近城中村要改造，房租可能要涨，你提前做好准备。」——这可是花钱都买不到的情报。智力+2。",
                "success",
              );
            } else if (bestNpc === "old_zhou") {
              st.flags._knowsScrapPrice = true;
              StateManager.addMessage(
                "🤫 老周凑过来说：「下个月废品回收站涨价，现在多囤点能多赚。」——你记在了心里。智力+2。",
                "success",
              );
            } else if (bestNpc === "boss_li") {
              st.flags._knowsLaborMarket = true;
              StateManager.addMessage(
                "🤫 李工头低声说：「下个工地招工，工资比现在高30%，但我先留个位置给你。」——机会来了。智力+2。",
                "success",
              );
            } else {
              st.flags._npcGeneralSecret = true;
              StateManager.addMessage(
                "🤫 " +
                  (st.npcNames && st.npcNames[bestNpc]
                    ? st.npcNames[bestNpc]
                    : "这位朋友") +
                  "告诉你一个你可能用得上消息。你认真听着，心里记下了。智力+2。",
                "success",
              );
            }
          }
        },
      },
      {
        text: "🙏 谢谢TA惦记",
        hint: "好感+5，安全",
        apply: function (st) {
          // 找出好感最高的NPC
          var bestNpc2 = null;
          var bestAff2 = -200;
          for (var nid3 in st.relationships) {
            var rel3 = st.relationships[nid3];
            if (rel3 && rel3.met && (rel3.affinity || 0) > bestAff2) {
              bestAff2 = rel3.affinity || 0;
              bestNpc2 = nid3;
            }
          }
          if (bestNpc2 && st.relationships[bestNpc2]) {
            st.relationships[bestNpc2].affinity = Math.min(
              100,
              (st.relationships[bestNpc2].affinity || 0) + 5,
            );
          }
          StateManager.addMessage(
            "🙏 你谢谢对方的关心。有些人愿意把秘密告诉你，本身就是一种信任。",
            "success",
          );
        },
      },
    ],
  });

  // 4. 道德值极端时的「人设分叉」事件
  // 联动：morality >= 80(高道德) / morality <= 20(低道德)
  RANDOM_EVENTS.push({
    id: "moral_extreme_echo",
    phase: "street",
    icon: "⚖️",
    title: "城市记住了你的样子",
    story: "",
    conditions: function (st) {
      var mor = st.player.morality || 50;
      return (
        st.player.phase === "street" &&
        st.player.day >= 60 &&
        !st.flags._moralEchoSeen &&
        (mor >= 80 || mor <= 20)
      );
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "🤔 继续做选择",
        hint: "根据你的道德值触发不同叙事",
        apply: function (st) {
          st.flags._moralEchoSeen = true;
          var mor = st.player.morality || 50;
          if (mor >= 80) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            StateManager.addMessage(
              "⚖️ 你做的每一件小事都被这座城市记住了——帮过的老人给你留了碗面，还过钱的人逢人就夸你。名气+8，心情+10。好人缘是攒出来的。",
              "success",
            );
          } else if (mor <= 20) {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
            st.player.mental = Math.max(0, (st.player.mental || 50) - 5);
            StateManager.addMessage(
              "⚖️ 你发现身边的人开始对你客气了——那种客气里带着距离。你做了很多选择，但没人再完全信任你。心情-10，心智-5。",
              "warning",
            );
          }
        },
      },
    ],
  });

  // 5. 连续3天饥饿后的「社会比较」事件
  // 联动：flags._habits.lowHungerStreak + needs.happiness
  RANDOM_EVENTS.push({
    id: "hunger_social_comparison",
    phase: "street",
    icon: "🍱",
    title: "饭桌上的差距",
    story:
      "午休时工友们聚在一起吃盒饭，香味飘过来，你肚子咕咕叫。你看了看他们的菜——有荤有素，而你今天只啃了两个馒头。\n\n有人注意到你，问：「咋不吃好的？钱不够？」",
    conditions: function (st) {
      var habits = st.flags && st.flags._habits;
      return (
        st.player.phase === "street" &&
        habits &&
        habits.lowHungerStreak >= 3 &&
        !st.flags._hungerComparisonSeen
      );
    },
    probability: 0.1,
    repeatable: false,
    choices: [
      {
        text: "😊 笑着说「习惯了」",
        hint: "保全面子，心情+5",
        apply: function (st) {
          st.flags._hungerComparisonSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "🍱 你笑了笑说习惯了。有人往你盒饭里夹了块肉。面子保住了，但胃还在叫。心情+5，心智+3。",
            "info",
          );
        },
      },
      {
        text: "😤 不吃了，攒钱干大事",
        hint: "短期忍饥，长期投资",
        apply: function (st) {
          st.flags._hungerComparisonSeen = true;
          st.flags._starvedForFuture = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          StateManager.addMessage(
            "🍱 你推开盒饭走了。有人说你倔，但你知道——现在的每一分省下来的钱，都是为了以后能挺直腰板吃饭。心情-8，心智+5。",
            "warning",
          );
        },
      },
      {
        text: "😢 说实话，能不能借¥20",
        hint: "坦诚面对，可能获得帮助",
        apply: function (st) {
          st.flags._hungerComparisonSeen = true;
          if (Random.chance(0.7)) {
            var help = Random.int(20, 80);
            st.resources.cash += help;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            StateManager.addMessage(
              "🍱 你说了实话，工友们凑了¥" +
                help +
                "给你。有人拍拍你的肩：「谁还没个难处。」心情+15。",
              "success",
            );
          } else {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
            StateManager.addMessage(
              "🍱 你说实话了，但没人接话。你端着馒头走了。心情-5。",
              "warning",
            );
          }
        },
      },
    ],
  });

  // ====================================================================
  // v3.23 — 新增5个联动事件（空白区填充）
  // ====================================================================

  // E1：长期道德积累 → 口碑效应（NPC主动推荐工作/机会）
  // 设计意图：让道德系统不只是被动惩罚/奖励，而是主动创造机会
  // 联动：道德值≥70 + 多个NPC关系 + 天数门槛
  RANDOM_EVENTS.push({
    id: "moral_reputation_referral",
    phase: "street",
    icon: "🌟",
    title: "有人推荐了你",
    story:
      "你今天到一个新地方干活，刚进门就有人认出了你：「你就是那个帮过老王的小伙子？老王说你人特别好，非让我一定要找你。」\n\n你愣了一下——你不记得自己做过什么特别的事，但对方语气里的信任让你心里一暖。",
    conditions: function (st) {
      // 检查道德值≥70（长期善意积累）
      if ((st.player.morality || 50) < 70) return false;
      // 检查至少有2个不同NPC已结识（口碑传播需要关系网）
      if (!st.relationships) return false;
      var metCount = 0;
      for (var nid in st.relationships) {
        if (st.relationships[nid] && st.relationships[nid].met) metCount++;
      }
      if (metCount < 2) return false;
      // 游戏进行至少60天（有足够时间积累口碑）
      if (st.player.day < 60) return false;
      // 不重复触发
      if (st.flags._moralReputationReferral) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "😊 谢谢老王抬举",
        hint: "获得工作机会，口碑+名声",
        apply: function (st) {
          st.flags._moralReputationReferral = true;
          // 找出推荐人（好感最高的已结识NPC）
          var bestNpc = null;
          var bestAff = -200;
          for (var nid in st.relationships) {
            var rel = st.relationships[nid];
            if (rel && rel.met && (rel.affinity || 0) > bestAff) {
              bestAff = rel.affinity || 0;
              bestNpc = nid;
            }
          }
          var npcName =
            bestNpc === "aunt_wang"
              ? "王大婶"
              : bestNpc === "old_zhou"
                ? "老周"
                : bestNpc === "sister_zhang"
                  ? "张姐"
                  : bestNpc === "chef_chen"
                    ? "陈师傅"
                    : "那位朋友";
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          // 推荐人好感提升
          if (bestNpc && st.relationships[bestNpc]) {
            st.relationships[bestNpc].affinity = Math.min(
              100,
              (st.relationships[bestNpc].affinity || 0) + 5,
            );
          }
          // 解锁长期口碑buff
          st.flags._reputationReferralActive = true;
          StateManager.addMessage(
            "🌟 " +
              npcName +
              "把你推荐给了这里。老板说「" +
              npcName +
              "推荐的人不会差」，当场给了比市场价高15%的日薪。名气+5，心情+12，" +
              npcName +
              "好感+5。你的好名声在这座城市里开始流转了。",
            "success",
          );
        },
      },
      {
        text: "😅 我真没做什么",
        hint: "谦虚，但口碑仍在传播",
        apply: function (st) {
          st.flags._moralReputationReferral = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "🌟 你摆摆手说「真没做什么」。但老板笑着说：「能被人主动推荐的，都不是普通人。」你心里有点不自在，但更多的是温暖。道德+2，心情+8。",
            "info",
          );
        },
      },
    ],
  });

  // E2：技能满级后的「行业声望」事件
  // 设计意图：单一技能达到80+时解锁隐藏的职业机会
  // 联动：skills.*.level >= 80 + 对应地点
  RANDOM_EVENTS.push({
    id: "skill_master_opportunity",
    phase: "street",
    icon: "🏆",
    title: "行家找上门",
    story:
      "你在街上走着，一个穿着得体的人拦住了你。他递过来一张名片：「我在这座城市做了二十年" +
      "——听说过你的名字。我们正在找一个技术过硬的人，薪资你开。」\n\n名片上印着一家公司，规模不小。你没想到自己的手艺已经出了名。",
    conditions: function (st) {
      // 检查是否有任何技能≥80
      if (!st.skills) return false;
      var masterSkill = null;
      var masterSkillName = "";
      var skillNames = {
        cooking: "餐饮",
        repair: "维修",
        electrician: "电工",
        welding: "焊接",
        coding: "编程",
        sales: "销售",
        management: "管理",
        accounting: "会计",
        driving: "驾驶",
      };
      for (var sk in st.skills) {
        if (st.skills[sk] && (st.skills[sk].level || 0) >= 80) {
          masterSkill = sk;
          masterSkillName = skillNames[sk] || "相关领域";
          break;
        }
      }
      if (!masterSkill) return false;
      // 游戏进行至少120天（有足够时间积累名声）
      if (st.player.day < 120) return false;
      // 不重复触发同一技能
      if (st.flags["_skillMaster_" + masterSkill]) return false;
      return true;
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      {
        text: "📋 详细聊聊待遇",
        hint: "可能获得全职工作机会",
        apply: function (st) {
          // 找出最高技能
          var bestSkill = null;
          var bestLvl = 0;
          for (var sk in st.skills) {
            if (st.skills[sk] && (st.skills[sk].level || 0) > bestLvl) {
              bestLvl = st.skills[sk].level;
              bestSkill = sk;
            }
          }
          if (!bestSkill) return;
          st.flags["_skillMaster_" + bestSkill] = true;
          // 根据技能类型给出不同结果
          var salary = 0;
          if (bestSkill === "cooking") salary = Random.int(8000, 15000);
          else if (
            bestSkill === "repair" ||
            bestSkill === "electrician" ||
            bestSkill === "welding"
          )
            salary = Random.int(6000, 12000);
          else if (bestSkill === "coding") salary = Random.int(12000, 25000);
          else if (bestSkill === "sales") salary = Random.int(5000, 10000);
          else if (bestSkill === "management") salary = Random.int(8000, 18000);
          else salary = Random.int(4000, 8000);

          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          st.flags._skillMasterOfferSalary = salary;
          st.flags._skillMasterOfferSkill = bestSkill;
          StateManager.addMessage(
            "🏆 对方开出了月薪¥" +
              salary.toLocaleString() +
              "的条件——对于街头起步的人来说是一笔巨款。你的手艺终于被看见了。名气+8，心情+15。",
            "success",
          );
        },
      },
      {
        text: "🤝 保持联系，再想想",
        hint: "保留机会，心智+3",
        apply: function (st) {
          var bestSkill = null;
          var bestLvl = 0;
          for (var sk in st.skills) {
            if (st.skills[sk] && (st.skills[sk].level || 0) > bestLvl) {
              bestLvl = st.skills[sk].level;
              bestSkill = sk;
            }
          }
          if (!bestSkill) return;
          st.flags["_skillMaster_" + bestSkill] = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "🤝 你收下名片说「让我考虑一下」。对方笑了：「不着急，好机会不等人但也跑不掉。」心智+3，心情+5。",
            "info",
          );
        },
      },
      {
        text: "🚶 谢谢，但我现在挺好的",
        hint: "婉拒，名声不变",
        apply: function (st) {
          var bestSkill = null;
          var bestLvl = 0;
          for (var sk in st.skills) {
            if (st.skills[sk] && (st.skills[sk].level || 0) > bestLvl) {
              bestLvl = st.skills[sk].level;
              bestSkill = sk;
            }
          }
          if (!bestSkill) return;
          st.flags["_skillMaster_" + bestSkill] = true;
          StateManager.addMessage(
            "🚶 你摇了摇头。对方有些意外，但还是礼貌地离开了。有时候安于现状也是一种选择。",
            "info",
          );
        },
      },
    ],
  });

  // E3：天气+地点组合事件——台风天的不同遭遇
  // 设计意图：同样的台风天，在市场/公园/工地/桥洞有不同的体验和后果
  // 联动：weather.current === "typhoon" + trade.currentLocation
  RANDOM_EVENTS.push({
    id: "typhoon_location_experience",
    phase: "street",
    icon: "🌀",
    title: "台风过境",
    story:
      "台风来了。天空变成诡异的黄绿色，风大到走路需要弯腰。街上的广告牌被吹得哐哐响，塑料袋像幽灵一样在半空中飘。",
    conditions: function (st) {
      // 检查台风天气
      if (!st.weather || st.weather.current !== "typhoon") return false;
      // 检查是否已在台风事件中
      if (st.flags._typhoonSeenToday) return false;
      // 游戏至少进行10天
      if (st.player.day < 10) return false;
      return true;
    },
    probability: 0.08,
    repeatable: true,
    choices: function (st) {
      var curLoc = st.trade && st.trade.currentLocation;
      var housingTier =
        st.housing && st.housing.tier !== undefined ? st.housing.tier : 0;

      // 在市场：货物可能被吹走
      if (curLoc === "wholesaleMarket") {
        return [
          {
            text: "🛡️ 赶紧加固摊位",
            hint: "体力消耗大，但保住货物",
            apply: function (s) {
              s.flags._typhoonSeenToday = true;
              s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 20);
              s.needs.hunger = Math.max(0, (s.needs.hunger || 0) - 10);
              if (Random.chance(0.7)) {
                s.needs.happiness = Math.min(
                  100,
                  (s.needs.happiness || 50) + 5,
                );
                StateManager.addMessage(
                  "🛡️ 你用绳子和砖头把摊位固定好了。风刮了一夜，天亮时货还在。虽然累得腰酸背痛，但没损失。心情+5。",
                  "success",
                );
              } else {
                s.resources.cash = Math.max(0, (s.resources.cash || 0) - 100);
                StateManager.addMessage(
                  "🛡️ 你拼尽全力固定，但一阵狂风还是掀翻了几个箱子。损失了约¥100的货。",
                  "warning",
                );
              }
            },
          },
          {
            text: "🏃 撤了，安全第一",
            hint: "放弃货物，保全自己",
            apply: function (s) {
              s.flags._typhoonSeenToday = true;
              s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 5);
              StateManager.addMessage(
                "🏃 你收拾好东西赶紧往回跑。回头看了一眼——摊位已经被风吹得东倒西歪。心情-5。至少人没事。",
                "info",
              );
            },
          },
        ];
      }

      // 在公园：树木可能被吹倒
      if (curLoc === "park") {
        return [
          {
            text: "🏃 赶紧离开公园",
            hint: "远离大树，安全撤离",
            apply: function (s) {
              s.flags._typhoonSeenToday = true;
              s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
              StateManager.addMessage(
                "🏃 你猫着腰穿过公园。身后传来一声巨响——一棵老树被连根拔起了。你后背发凉，心智+2。",
                "info",
              );
            },
          },
          {
            text: "📸 拍几张照发朋友圈",
            hint: "可能出名，也可能后悔",
            apply: function (s) {
              s.flags._typhoonSeenToday = true;
              s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 8);
              // 小概率被风吹倒受伤
              if (Random.chance(0.2)) {
                s.status.health = Math.max(0, (s.status.health || 70) - 5);
                StateManager.addMessage(
                  "📸 你拍了几张台风中的公园发到了网上，没想到火了。但拍照时一阵狂风差点把你吹倒，健康-5。名气+3，心情+8。",
                  "warning",
                );
              } else {
                StateManager.addMessage(
                  "📸 你拍了几张台风中的公园发到了网上。朋友圈一片点赞。名气+3，心情+8。",
                  "success",
                );
              }
            },
          },
        ];
      }

      // 在工地：最危险的地方
      if (curLoc === "construction") {
        return [
          {
            text: "🏗️ 赶紧回工棚",
            hint: "避开高空坠物",
            apply: function (s) {
              s.flags._typhoonSeenToday = true;
              s.status.health = Math.max(0, (s.status.health || 70) - 3);
              StateManager.addMessage(
                "🏗️ 你一路小跑回工棚。回头看了一眼——工地上几块模板被风吹飞了，砸在地上碎成一团。健康-3。",
                "warning",
              );
            },
          },
          {
            text: "😰 帮忙加固脚手架",
            hint: "义气，但危险",
            apply: function (s) {
              s.flags._typhoonSeenToday = true;
              s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 15);
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 10);
              if (Random.chance(0.3)) {
                s.status.health = Math.max(0, (s.status.health || 70) - 8);
                StateManager.addMessage(
                  "🏗️ 你帮工友们加固了脚手架。但一阵大风把你刮倒了，磕破了膝盖。健康-8，心情+10。工友们说下次请你喝酒。",
                  "warning",
                );
              } else {
                StateManager.addMessage(
                  "🏗️ 你帮工友们加固了脚手架。大家对你说「谢了兄弟」。虽然累，但心里踏实。疲劳+15，心情+10。",
                  "success",
                );
              }
            },
          },
        ];
      }

      // 在桥洞/露宿：最惨的情况
      if (!st.housing || st.housing.tier === 0) {
        return [
          {
            text: "🏃 找地方躲躲",
            hint: "找地下通道或商店",
            apply: function (s) {
              s.flags._typhoonSeenToday = true;
              if (Random.chance(0.5)) {
                s.needs.happiness = Math.min(
                  100,
                  (s.needs.happiness || 50) + 5,
                );
                StateManager.addMessage(
                  "🏃 你跑进了一家24小时便利店。老板看你可怜，让你在后仓躲了一夜。虽然条件差，但至少安全。心情+5。",
                  "success",
                );
              } else {
                s.status.health = Math.max(0, (s.status.health || 70) - 10);
                StateManager.addMessage(
                  "🏃 你找了个地下通道躲着。但风太大，雨水倒灌进来，整个通道都快淹了。你不得不继续跑，健康-10。",
                  "danger",
                );
              }
            },
          },
          {
            text: "😰 赌一把，回桥洞",
            hint: "桥洞可能塌，健康-15",
            apply: function (s) {
              s.flags._typhoonSeenToday = true;
              s.status.health = Math.max(0, (s.status.health || 70) - 15);
              s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 10);
              StateManager.addMessage(
                "😰 你冒着台风跑回桥洞。一夜风雨交加，你的栖身之所被水泡得不成样子。健康-15，心情-10。明天得找个更好的地方了。",
                "danger",
              );
            },
          },
        ];
      }

      // 默认（有其他住所或在路上）：中性事件
      return [
        {
          text: "🏠 在家待着",
          hint: "安全，但可能停电",
          apply: function (s) {
            s.flags._typhoonSeenToday = true;
            if (Random.chance(0.3)) {
              s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 5);
              StateManager.addMessage(
                "🏠 你待在家里。半夜停电了，蜡烛很快就烧完了。你听着窗外的风声，一夜没睡好。心情-5。",
                "warning",
              );
            } else {
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 3);
              StateManager.addMessage(
                "🏠 你待在家里，煮了碗面看台风新闻。窗外狂风呼啸，屋里温暖安静。难得的安宁。心情+3。",
                "info",
              );
            }
          },
        },
        {
          text: "🚶 出去看看",
          hint: "冒险，可能有意外收获",
          apply: function (s) {
            s.flags._typhoonSeenToday = true;
            s.status.health = Math.max(0, (s.status.health || 70) - 5);
            if (Random.chance(0.4)) {
              var earn = Random.int(50, 150);
              s.resources.cash += earn;
              s.resources.totalEarned = (s.resources.totalEarned || 0) + earn;
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 8);
              StateManager.addMessage(
                "🚶 你冒雨出门，发现很多店关门了，但也有人趁机卖高价物资。你倒卖了一批雨衣，赚了¥" +
                  earn +
                  "。健康-5，心情+8。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🚶 你走在空荡荡的街上，台风天整座城市像被按了暂停键。健康-5。",
                "info",
              );
            }
          },
        },
      ];
    },
  });

  // E4：副业长期积累 → 主业转化事件
  // 设计意图：连续做副业≥30天后，出现将副业转正的机会
  // 联动：sideHustle + stats.actionFreq + career
  RANDOM_EVENTS.push({
    id: "sidehustle_to_main_career",
    phase: "street",
    icon: "🔄",
    title: "副业变主业",
    story:
      "你做" +
      "（副业）已经一段时间了。今天一个老客户拉住你说：「你做得这么好，要不要自己单干？我可以帮你介绍客户。」\n\n你想了想——这确实是个机会，但也意味着要承担更多风险。",
    conditions: function (st) {
      // 检查是否有活跃的副业或足够的副业行动记录
      if (!st.sideHustle) return false;
      if (!st.sideHustle.active && (!st.stats || !st.stats.actionFreq))
        return false;
      // 检查副业类型和行动频次
      var hustleType = st.sideHustle.type || "";
      var totalHustleActions = 0;
      if (st.sideHustle.active && hustleType) {
        // 统计该副业类型的行动次数
        var actionKeyMap = {
          stall: "stall",
          driving: "driving",
          freelance: "freelance",
          content: "content",
          sharing: "sharing",
          community: "community",
        };
        var ak = actionKeyMap[hustleType];
        if (ak && st.stats.actionFreq[ak]) {
          totalHustleActions = st.stats.actionFreq[ak];
        }
      }
      // 至少30次副业行动
      if (totalHustleActions < 30) return false;
      // 游戏进行至少45天
      if (st.player.day < 45) return false;
      // 不重复
      if (st.flags._sideHustleToMain) return false;
      return true;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "💼 好！我自己干",
        hint: "启动创业，需要¥1000启动资金",
        apply: function (st) {
          st.flags._sideHustleToMain = true;
          if (st.resources.cash >= 1000) {
            st.resources.cash -= 1000;
            st.flags._selfEmployed = true;
            st.flags._selfEmployedFrom = st.sideHustle.type || "unknown";
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            StateManager.addMessage(
              "💼 你决定自己单干！花了¥1000置办了设备，注册了个体户。虽然风险大了，但每一分钱都是自己挣的。心情+15，心智+5，名气+5。",
              "success",
            );
          } else {
            st.flags._selfEmployedPending = true;
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
            StateManager.addMessage(
              "💼 你想自己干，但摸了摸口袋——¥1000启动资金不够。客户说「没关系，凑够了再来找我。」心情-5。",
              "warning",
            );
          }
        },
      },
      {
        text: "🤝 先帮介绍客户，保持现状",
        hint: "获得客户资源，不冒险",
        apply: function (st) {
          st.flags._sideHustleToMain = true;
          var newClients = Random.int(2, 5);
          st.flags._extraClients = newClients;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "🤝 你让客户帮你介绍了" +
              newClients +
              "个新客户。虽然还是打工，但客源多了。心情+8，名气+3。",
            "info",
          );
        },
      },
      {
        text: "🙅 算了，安稳点好",
        hint: "维持现状，错失机会",
        apply: function (st) {
          st.flags._sideHustleToMain = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          StateManager.addMessage(
            "🙅 你说想再等等。客户点点头：「也行，机会总有。」但你心里知道，有些机会错过了就没了。心情-3。",
            "warning",
          );
        },
      },
    ],
  });

  // E5：高债务累积 → 信用崩塌事件
  // 设计意图：债务超过一定阈值后触发系统性后果，不只是数字变化
  // 联动：resources.debt + relationships（催收可能骚扰NPC）
  RANDOM_EVENTS.push({
    id: "debt_credit_collapse",
    phase: "street",
    icon: "💔",
    title: "催收电话打到了朋友那",
    story:
      "今天你收到一条短信，不是你的——是某个朋友的。短信内容让你心头一紧：\n\n「请问是" +
      "（你的名字）的朋友吗？他欠了我们一笔钱，现在已经逾期很久了。麻烦你转告他尽快联系我们，否则我们将采取法律措施。」\n\n你的第一个反应不是愤怒，而是羞愧。",
    conditions: function (st) {
      // 检查总债务≥5000
      var totalDebt = 0;
      if (st.resources) {
        totalDebt += st.resources.debt || 0;
        totalDebt += st.resources.villageDebt || 0;
        totalDebt += st.resources.bankDebt || 0;
      }
      if (totalDebt < 5000) return false;
      // 检查至少有1个已结识的NPC（催收会骚扰到熟人）
      if (!st.relationships) return false;
      var hasMetNpc = false;
      for (var nid in st.relationships) {
        if (st.relationships[nid] && st.relationships[nid].met) {
          hasMetNpc = true;
          break;
        }
      }
      if (!hasMetNpc) return false;
      // 游戏进行至少30天
      if (st.player.day < 30) return false;
      // 不重复
      if (st.flags._debtCreditCollapse) return false;
      return true;
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "📞 主动联系催收方",
        hint: "协商分期，道德+2",
        apply: function (st) {
          st.flags._debtCreditCollapse = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          // 减少部分债务作为和解
          var reduction = Math.round((st.resources.debt || 0) * 0.1);
          st.resources.debt = Math.max(0, (st.resources.debt || 0) - reduction);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📞 你主动打了电话过去，说明了困难情况。对方同意给你三个月分期付款。虽然还是压力大，但至少不用躲了。道德+2，债务减少¥" +
              reduction +
              "，心情+5。",
            "success",
          );
        },
      },
      {
        text: "😰 躲着不接电话",
        hint: "暂时逃避，后果严重",
        apply: function (st) {
          st.flags._debtCreditCollapse = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 15);
          st.player.mental = Math.max(0, (st.player.mental || 0) - 5);
          // 标记催收骚扰开始
          st.flags._debtHarassmentActive = true;
          st.flags._debtHarassmentStart = st.player.day;
          // 可能影响NPC关系
          for (var nid in st.relationships) {
            if (
              st.relationships[nid] &&
              st.relationships[nid].met &&
              Random.chance(0.3)
            ) {
              st.relationships[nid].affinity = Math.max(
                -100,
                (st.relationships[nid].affinity || 0) - 5,
              );
              StateManager.addMessage(
                "💔 催收电话打到了" +
                  (nid === "aunt_wang"
                    ? "王大婶"
                    : nid === "old_zhou"
                      ? "老周"
                      : nid === "sister_zhang"
                        ? "张姐"
                        : "你的一位朋友") +
                  "那里。TA很担心你，但也被打扰得不轻。好感-5。",
                "danger",
              );
              break;
            }
          }
          StateManager.addMessage(
            "😰 你挂了电话，换了号码。但你知道催收不会停止。躲是躲不掉的。心情-15，心智-5。",
            "danger",
          );
        },
      },
      {
        text: "🙏 找朋友借钱一次性还清",
        hint: "需要NPC好感≥50，面子+关系",
        apply: function (st) {
          st.flags._debtCreditCollapse = true;
          // 找有足够好感的NPC
          var bestNpc = null;
          var bestAff = -200;
          for (var nid in st.relationships) {
            var rel = st.relationships[nid];
            if (
              rel &&
              rel.met &&
              (rel.affinity || 0) >= 50 &&
              (rel.affinity || 0) > bestAff
            ) {
              bestAff = rel.affinity || 0;
              bestNpc = nid;
            }
          }
          if (bestNpc) {
            var borrowAmount = Math.min(
              3000,
              Math.round((st.resources.debt || 0) * 0.5),
            );
            if (borrowAmount > 0) {
              st.resources.cash += borrowAmount;
              st.resources.debt = Math.max(
                0,
                (st.resources.debt || 0) - borrowAmount,
              );
              st.relationships[bestNpc].affinity = Math.min(
                100,
                (st.relationships[bestNpc].affinity || 0) + 10,
              );
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 10,
              );
              var npcName =
                bestNpc === "aunt_wang"
                  ? "王大婶"
                  : bestNpc === "old_zhou"
                    ? "老周"
                    : bestNpc === "sister_zhang"
                      ? "张姐"
                      : bestNpc === "chef_chen"
                        ? "陈师傅"
                        : bestNpc;
              StateManager.addMessage(
                "🙏 你鼓起勇气找了" +
                  npcName +
                  "，说明了情况。TA二话没说借了你¥" +
                  borrowAmount +
                  "。你还清了部分债务。" +
                  npcName +
                  "好感+10，心情+10。",
                "success",
              );
            }
          } else {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
            StateManager.addMessage(
              "🙏 你翻遍了通讯录，好像没有一个关系好到能开口借钱的人。你放下了手机。心情-8。",
              "warning",
            );
          }
        },
      },
    ],
  });

  // ============================================================
  // v3.34 新增联动事件（5个）— 空白区填充
  // 设计意图：长期行为累积触发、技能门槛解锁、NPC好感溢出、天气×位置情境、道德极端分叉
  // ============================================================
  // [自洽修复] CROSS_EVENTS → RANDOM_EVENTS 直推（原写法在循环结束后才push，变成死代码）
  RANDOM_EVENTS.push(
    // 1. 长期跑腿后的老手特遇 — 连续跑腿≥30天，老主顾回头
    {
      id: "gig_regular_customer",
      title: "回头客",
      name: "回头客",
      icon: "🤝",
      phase: "street",
      // [自洽修复] conditions 新增：sideHustle.type === 'freelance' 检查（跑腿副业）
      conditions: function (st) {
        // 检查玩家是否在做跑腿副业（累计≥30次 courier_gig 行动）
        var isFreelance =
          (st.sideHustle && st.sideHustle.type === "freelance") ||
          (st.stats &&
            st.stats.actionFreq &&
            st.stats.actionFreq["courier_gig"] >= 30);
        return (
          st.player.phase === "street" &&
          isFreelance &&
          !st.flags._gigRegularCustomerSeen
        );
      },
      probability: 0.03,
      repeatable: false,
      text: "你在一个街区跑了快一个月了。今天送完一单，收件人追出来塞给你一杯奶茶：'你每次都准时，以后我的东西都交给你送吧。'他递来一张名片——是一家小型电商公司。",
      choices: [
        {
          text: "📱 加联系方式，接私单",
          hint: "额外收入来源",
          apply: function (st) {
            st.flags._gigRegularCustomerSeen = true;
            st.flags._gigPrivateOrders = true;
            var bonus = Random.int(200, 500);
            st.resources.cash += bonus;
            st.resources.totalEarned += bonus;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
            StateManager.addMessage(
              "🤝 加了名片，以后每个月能多赚¥" +
                bonus +
                "的私单。这城市里人情就是钱。心情+8。",
              "success",
            );
          },
        },
        {
          text: "🤔 先观望，不急",
          hint: "保持节奏",
          apply: function (st) {
            st.flags._gigRegularCustomerSeen = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
            StateManager.addMessage(
              "🤝 你礼貌地收下了名片，说考虑一下。不急，慢慢来。心情+3。",
              "info",
            );
          },
        },
      ],
    },

    // 2. 修理技能≥40的专业人士视角 — 能识别假冒伪劣商品
    {
      id: "repair_expert_inspection",
      title: "行家眼光",
      name: "行家眼光",
      icon: "🔍",
      phase: "street",
      // [自洽修复] conditions 新增：修理技能≥40 检查
      conditions: function (st) {
        // 检查玩家修理技能是否达到专业门槛
        var repairLvl =
          (st.skills && st.skills.repair && st.skills.repair.level) || 0;
        return (
          st.player.phase === "street" &&
          repairLvl >= 40 &&
          !st.flags._repairExpertSeen
        );
      },
      probability: 0.02,
      repeatable: false,
      text: "你在批发市场帮朋友挑货时，一眼看出这批'原装'配件全是高仿——做工粗糙，螺丝孔位都对不上。摊主看你一眼，换了副面孔：'行家啊，要真的吗？'",
      choices: [
        {
          text: "✅ 拿真的，贵点也值",
          hint: "多花¥200，品质有保障",
          apply: function (st) {
            st.flags._repairExpertSeen = true;
            if (st.resources.cash >= 200) {
              st.resources.cash -= 200;
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 0) + 10,
              );
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 0) + 2,
              );
              StateManager.addMessage(
                "🔍 你拿到了正品配件，质量远超那些仿品。摊主看你的眼神都变了——从此你在这行有了口碑。心情+10，智力+2。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🔍 你想拿真的但钱不够，只能作罢。行家也有穷的时候。",
                "warning",
              );
            }
          },
        },
        {
          text: "📸 拍下来当证据，以后防坑",
          hint: "学到经验",
          apply: function (st) {
            st.flags._repairExpertSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 3,
            );
            StateManager.addMessage(
              "🔍 你拍了照片留证，以后看到类似的就知道怎么辨别了。知识就是力量。智力+3。",
              "success",
            );
          },
        },
      ],
    },

    // 3. NPC好感≥60的意外发现 — 小美透露科技园扩建内幕
    {
      id: "xiao_mei_techpark_tip",
      title: "小美的消息",
      name: "小美的消息",
      icon: "📐",
      phase: "street",
      // [自洽修复] conditions 新增：小美关系好感≥60 + met 检查
      conditions: function (st) {
        // 检查玩家与小美的好感关系是否达到深度交流门槛
        var rel = st.relationships && st.relationships.xiao_mei;
        var aff = rel ? rel.affinity || 0 : 0;
        var met = rel ? !!rel.met : false;
        return (
          st.player.phase === "street" &&
          aff >= 60 &&
          met &&
          !st.flags._xiaoMeiTechparkTipSeen
        );
      },
      probability: 0.02,
      repeatable: false,
      text: "小美在图书馆角落里拉你，压低声音说：'我导师在规划局有熟人——科技园东边那片旧厂房要被收储了，规划是扩建三期。消息还没公开，你懂的。'她把一张名片推过来。",
      choices: [
        {
          text: "📐 联系二手房东，谈优先承租权",
          hint: "¥2000定金，赌扩建",
          cost: 2000,
          apply: function (st) {
            st.flags._xiaoMeiTechparkTipSeen = true;
            st.flags._xiaoMeiTipActed = st.player.day;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            st.relationships.xiao_mei.affinity = Math.min(
              100,
              (st.relationships.xiao_mei.affinity || 0) + 5,
            );
            StateManager.addMessage(
              "📐 你付了¥2000定金，以租代持谈下了旧厂房仓库的优先承租权。小美消息灵通，你欠她一个人情。心智+3，好感+5。",
              "event",
            );
            // 链式后续：12天后看结果
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "xiao_mei_techpark_payoff", 12, "street");
            }
          },
        },
        {
          text: "📈 小仓位买入科技股",
          hint: "温和布局，¥1000",
          cost: 1000,
          apply: function (st) {
            st.flags._xiaoMeiTechparkTipSeen = true;
            st.flags._xiaoMeiTipModerate = st.player.day;
            st.flags._xiaoMeiTipInvest =
              (st.flags._xiaoMeiTipInvest || 0) + 1000;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
            StateManager.addMessage(
              "📐 你不敢all-in，但买了¥1000科技股。小美说'消息靠谱'，但你决定留条后路。",
              "info",
            );
          },
        },
        {
          text: "🤨 内幕交易违法，当没听过",
          hint: "安全但可能错过机会",
          apply: function (st) {
            st.flags._xiaoMeiTechparkTipSeen = true;
            st.flags._xiaoMeiTipSkipped = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
            StateManager.addMessage(
              "🤨 你谢过小美，但没碰那张名片。有些钱烫手，你知道。心智+3，心情+5。",
              "info",
            );
          },
        },
      ],
    },

    // 4. 天气×位置组合情境 — 暴雨时在批发市场
    {
      id: "storm_market_dilemma",
      title: "暴雨中的市场",
      name: "暴雨中的市场",
      icon: "🌧️",
      phase: "street",
      // [自洽修复] conditions 新增：暴雨天气 + 批发市场位置 双重检查
      conditions: function (st) {
        // 检查当前是否为暴雨天气
        var isStorm =
          st.weather &&
          (st.weather.current === "stormy" ||
            st.weather.current === "heavy_rain");
        // 检查玩家是否在批发市场
        var atMarket =
          st.trade && st.trade.currentLocation === "wholesaleMarket";
        return (
          st.player.phase === "street" &&
          isStorm &&
          atMarket &&
          !st.flags._stormMarketSeen
        );
      },
      probability: 0.04,
      repeatable: true,
      text: "暴雨倾盆而下，批发市场瞬间变成了小河。你的摊位刚摆出去的货眼看就要被淹，但生意正做到一半——撤了亏钱，不撤也亏钱。",
      choices: [
        {
          text: "🏃 拼命抢收货物",
          hint: "损失一半但保住部分",
          apply: function (st) {
            st.flags._stormMarketSeen = true;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
            st.needs.hygiene = Math.max(0, (st.needs.hygiene || 0) - 10);
            var saved = Random.int(100, 300);
            st.resources.cash += saved;
            StateManager.addMessage(
              "🌧️ 你冒着暴雨抢收回一半货物。浑身湿透，但好歹保住了¥" +
                saved +
                "的货。疲劳+20，卫生-10。",
              "warning",
            );
          },
        },
        {
          text: "🤝 帮隔壁林阿姨也收",
          hint: "花时间帮人，好感+10",
          apply: function (st) {
            st.flags._stormMarketSeen = true;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
            if (st.relationships && st.relationships.auntie_lin) {
              st.relationships.auntie_lin.affinity = Math.min(
                100,
                (st.relationships.auntie_lin.affinity || 0) + 10,
              );
            }
            StateManager.addMessage(
              "🌧️ 你帮林阿姨也抢收了一部分。她感动得直说谢谢，以后进货给你便宜。好感+10。",
              "success",
            );
          },
        },
        {
          text: "🏠 先找地方躲雨",
          hint: "保命要紧",
          apply: function (st) {
            st.flags._stormMarketSeen = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 2);
            StateManager.addMessage(
              "🌧️ 你躲进了一家便利店里。雨太大了，货物保不住了。但至少人没事。",
              "info",
            );
          },
        },
      ],
    },

    // 5. 道德值极端分叉 — 高道德 vs 低道德面对同一事件
    {
      id: "moral_extreme_pickpocket",
      title: "道德的岔路",
      name: "道德的岔路",
      icon: "⚖️",
      phase: "street",
      // [自洽修复] conditions 新增：道德值极端检查（高道德≥70 或 低道德≤30）
      conditions: function (st) {
        // 检查玩家道德值是否处于极端区间
        var morality = st.player.morality || 50;
        return (
          st.player.phase === "street" &&
          st.player.day >= 20 &&
          !st.flags._moralExtremSeen &&
          (morality >= 70 || morality <= 30)
        );
      },
      probability: 0.025,
      repeatable: false,
      text: "地铁上，你看到一个小偷正在扒一个学生的包。学生戴着耳机没察觉。周围人都在看手机，仿佛什么都没发生。",
      choices: function (st) {
        var morality = st.player.morality || 50;
        var choices = [];
        if (morality >= 70) {
          // 高道德玩家：倾向于正义
          choices.push({
            text: "📢 大声制止——有人偷东西！",
            hint: "英雄行为，可能有风险",
            apply: function (s) {
              s.flags._moralExtremSeen = true;
              if (Random.chance(0.7)) {
                s.player.fame = Math.min(100, (s.player.fame || 0) + 8);
                s.needs.happiness = Math.min(
                  100,
                  (s.needs.happiness || 0) + 15,
                );
                StateManager.addMessage(
                  "📢 你一声大喝，小偷慌了神跑了。学生感激地握住你的手：'谢谢你！'周围人纷纷鼓掌。名气+8，心情+15。",
                  "success",
                );
              } else {
                s.status.health = Math.max(0, (s.status.health || 100) - 10);
                s.needs.happiness = Math.max(0, (s.needs.happiness || 0) - 10);
                StateManager.addMessage(
                  "📢 小偷恼羞成怒动手了。你受了点伤，但学生没事。名气+3，健康-10，心情-10。",
                  "warning",
                );
              }
            },
          });
          choices.push({
            text: "📱 悄悄报警",
            hint: "稳妥但效果有限",
            apply: function (s) {
              s.flags._moralExtremSeen = true;
              s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
              StateManager.addMessage(
                "📱 你悄悄报了警。警察赶到时小偷已经跑了。至少你做了该做的事。心智+2。",
                "info",
              );
            },
          });
        } else if (morality <= 30) {
          // 低道德玩家：倾向于利益
          choices.push({
            text: "👀 看好戏，不插手",
            hint: "旁观者心态",
            apply: function (s) {
              s.flags._moralExtremSeen = true;
              s.needs.happiness = Math.min(100, (s.needs.happiness || 0) + 2);
              StateManager.addMessage(
                "👀 你选择了旁观。这城市里每个人都在为自己活。心情+2。",
                "info",
              );
            },
          });
          choices.push({
            text: "💰 跟小偷说——'哥们，分我一份'",
            hint: "道德-5，但可能赚钱",
            apply: function (s) {
              s.flags._moralExtremSeen = true;
              s.player.morality = Math.max(0, (s.player.morality || 50) - 5);
              if (Random.chance(0.4)) {
                var steal = Random.int(200, 500);
                s.resources.cash += steal;
                StateManager.addMessage(
                  "💰 你和小偷联手扒了那个学生，分了¥" +
                    steal +
                    "。心里有点不舒服，但钱是真的。道德-5。",
                  "warning",
                );
              } else {
                StateManager.addMessage(
                  "💰 小偷嫌你碍事，抢了你的钱跑了。自作孽。",
                  "danger",
                );
                s.resources.cash = Math.max(0, (s.resources.cash || 0) - 100);
              }
            },
          });
        } else {
          // 理论上不会到这里，但防御性兜底
          choices.push({
            text: "📢 出声制止",
            hint: "做正确的事",
            apply: function (s) {
              s.flags._moralExtremSeen = true;
              s.needs.happiness = Math.min(100, (s.needs.happiness || 0) + 5);
              StateManager.addMessage(
                "📢 你出声了。小偷跑了。学生说了声谢谢。小事一桩。",
                "info",
              );
            },
          });
        }
        return choices;
      },
    },

    // 链式后续：小美科技园消息兑现
    {
      id: "xiao_mei_techpark_payoff",
      title: "科技园官宣了！",
      name: "科技园官宣了！",
      icon: "🏗️",
      phase: "street",
      // [自洽修复] conditions 新增：链式事件触发条件检查
      conditions: function (st) {
        return (
          (!!st.flags._xiaoMeiTipActed || !!st.flags._xiaoMeiTipModerate) &&
          !st.flags._xiaoMeiPayoffSeen &&
          st.player.day >=
            (st.flags._xiaoMeiTipActed || st.flags._xiaoMeiTipModerate || 0) +
              12
        );
      },
      probability: 0.05,
      repeatable: false,
      text: "新闻推送弹出来：市政府正式公告科技园东区旧厂房改造项目立项，总投资80亿。你记得小美说的那番话——现在，到了看选择的时候了。",
      choices: function (st) {
        var choices = [];
        if (st.flags._xiaoMeiTipActed) {
          choices.push({
            text: "💰 把优先承租权转手（溢价300%！）",
            hint: "净赚¥5000~8000",
            apply: function (s) {
              s.flags._xiaoMeiPayoffSeen = true;
              var profit = Random.int(5000, 7999);
              s.resources.cash += profit;
              s.resources.totalEarned += profit;
              s.player.fame = Math.min(100, (s.player.fame || 0) + 8);
              StateManager.addMessage(
                "🏗️ 你把优先承租权转手给了一家连锁品牌，净赚¥" +
                  profit +
                  "！小美的消息比黄金还值钱。名气+8。",
                "success",
              );
            },
          });
        }
        if (st.flags._xiaoMeiTipModerate) {
          choices.push({
            text: "📉 卖出科技股（获利+40%）",
            hint: "见好就收",
            apply: function (s) {
              s.flags._xiaoMeiPayoffSeen = true;
              var invest = s.flags._xiaoMeiTipInvest || 1000;
              var ret = Math.round(invest * 1.4);
              s.resources.cash += ret;
              s.resources.totalEarned += ret;
              StateManager.addMessage(
                "📉 你卖掉了科技股，到手¥" +
                  ret +
                  "，收益¥" +
                  (ret - invest) +
                  "（+40%）。",
                "success",
              );
            },
          });
        }
        if (st.flags._xiaoMeiTipSkipped) {
          choices.push({
            text: "😌 庆幸自己没冒险",
            hint: "省下的就是赚到的",
            apply: function (s) {
              s.flags._xiaoMeiPayoffSeen = true;
              s.player.mental = Math.min(100, (s.player.mental || 0) + 3);
              s.needs.happiness = Math.min(100, (s.needs.happiness || 0) + 5);
              StateManager.addMessage(
                "😌 你看着新闻，庆幸自己没有冲动。有些钱不该赚。心智+3，心情+5。",
                "info",
              );
            },
          });
        }
        return choices;
      },
    },
  );
  // ====== 职业系统深度联动事件（v3.37 新增）======
  // 设计原则：填补职业系统情感深度空白，让"工作"不再只是数值循环
  // 涵盖：第一次收入/工友感情/技能突破/职业迷茫/职场机遇

  // E1：第一次赚到有意义的钱 → 财务意识萌芽
  // 设计意图：玩家第一次靠劳动赚到"真金白银"时的情感冲击，教玩家理财意识
  // 联动：totalEarned + 道德 + 心情
  RANDOM_EVENTS.push({
    id: "first_earn_milestone",
    phase: "street",
    icon: "💰",
    title: "第一笔钱",
    story:
      "你数着手里这些天攒下的钱——虽然不算多，但每一分都是自己挣来的。\n\n街边小卖部的电视里正播着理财节目，主持人说「年轻人第一桶金，存下来比花掉更重要」。你捏着钞票，心里盘算着这笔钱该怎么用。",
    conditions: function (st) {
      // 总赚取≥500元触发（第一次有意义的经济积累）
      if (!st.resources) return false;
      if ((st.resources.totalEarned || 0) < 500) return false;
      if (st.player.day < 5) return false;
      // 防止重复触发
      if (st.flags && st.flags._firstEarnSeen) return false;
      return true;
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "🏦 存进银行，利息也是钱",
        hint: "现金→存款，财务+1",
        apply: function (s) {
          s.flags._firstEarnSeen = true;
          var saveAmt = Math.min(200, s.resources.cash || 0);
          s.resources.cash -= saveAmt;
          s.resources.bankBalance = (s.resources.bankBalance || 0) + saveAmt;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
          StateManager.addMessage(
            "🏦 你走进银行，把¥" +
              saveAmt +
              "存进账户。看着存折上的数字，心里踏实了不少。心智+2。",
            "success",
          );
        },
      },
      {
        text: "🍜 好好吃一顿犒劳自己",
        hint: "心情+15，健康+3",
        apply: function (s) {
          s.flags._firstEarnSeen = true;
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 15);
          s.needs.hunger = Math.min(100, (s.needs.hunger || 50) + 20);
          s.status.health = Math.min(100, (s.status.health || 70) + 3);
          StateManager.addMessage(
            "🍜 你找了家小馆子，点了两个硬菜。热气腾腾的饭菜下肚，整个人都活过来了。心情+15，健康+3。",
            "success",
          );
        },
      },
      {
        text: "📚 买本书学点新东西",
        hint: "随机技能XP+50",
        apply: function (s) {
          s.flags._firstEarnSeen = true;
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - 30);
          var skillKeys = Object.keys(s.skills || {});
          if (skillKeys.length > 0) {
            var pick = Random.fromArray(skillKeys);
            if (s.skills[pick]) {
              s.skills[pick].xp = (s.skills[pick].xp || 0) + 50;
            }
            StateManager.addMessage(
              "📚 你在旧书摊淘了一本《" +
                pick +
                "入门到精通》，虽然印刷粗糙，但内容实在。花了¥30，" +
                pick +
                " XP+50。",
              "success",
            );
          }
        },
      },
    ],
  });

  // E2：工友感情——长期同岗建立的人际纽带
  // 设计意图：让工作不仅是数字循环，有真实的社交温度
  // 联动：employment + relationships + 心情
  RANDOM_EVENTS.push({
    id: "workmate_bonding",
    phase: "street",
    icon: "🍻",
    title: "工友的邀请",
    story:
      "收工后，一个经常跟你搭班的工友搓着手走过来：「兄弟，今晚搞点烧烤喝两杯？我请客。」\n\n你看了看他真诚的脸，又看了看自己疲惫的身体。确实好久没跟人好好聊过天了。",
    conditions: function (st) {
      // 连续工作20天以上触发
      if (!st.career || !st.career.currentJob) return false;
      if ((st.career.currentJob.workDays || 0) < 20) return false;
      if (st.player.day < 15) return false;
      // 30天冷却
      if (
        st.flags._workmateBondDay &&
        st.player.day - st.flags._workmateBondDay < 30
      )
        return false;
      return true;
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "🍺 去！难得有人请客",
        hint: "心情+12，疲劳-8",
        apply: function (s) {
          s.flags._workmateBondDay = s.player.day;
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 12);
          s.needs.fatigue = Math.max(0, (s.needs.fatigue || 0) - 8);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 2);
          StateManager.addMessage(
            "🍻 你和工友在路边摊撸串喝到半夜。他跟你讲了他来这座城市的故事，你也说了自己的。原来每个人都不容易。心情+12，疲劳-8，名气+2。",
            "success",
          );
        },
      },
      {
        text: "🙏 婉拒，太累了想休息",
        hint: "疲劳-5，但关系没拉近",
        apply: function (s) {
          s.flags._workmateBondDay = s.player.day;
          s.needs.fatigue = Math.max(0, (s.needs.fatigue || 0) - 5);
          StateManager.addMessage(
            "🙏 你婉拒了工友的好意。他拍了拍你肩膀说「下次啊！」。你回到住处倒头就睡。疲劳-5。",
            "info",
          );
        },
      },
      {
        text: "🎸 带点小吃过去一起聊",
        hint: "心情+8，工友情谊+",
        apply: function (s) {
          s.flags._workmateBondDay = s.player.day;
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - 15);
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 8);
          s.needs.fatigue = Math.max(0, (s.needs.fatigue || 0) - 5);
          s.player.mental = Math.min(100, (s.player.mental || 0) + 3);
          StateManager.addMessage(
            "🎸 你买了点花生毛豆过去，工友眼睛一亮：「还是你讲究！」你们聊到深夜，他教了你一些干活省力的窍门。心情+8，疲劳-5，心智+3。",
            "success",
          );
        },
      },
    ],
  });

  // E3：技能突破——熟能生巧的顿悟时刻
  // 设计意图：重复劳动中突然"开窍"的成就感，激励玩家深耕单一技能
  // 联动：stats.actionFreq + skills + 心智
  RANDOM_EVENTS.push({
    id: "job_skill_breakthrough",
    phase: "street",
    icon: "💡",
    title: "熟能生巧",
    story:
      "你今天跟往常一样干着同样的活，但手上的动作突然变得流畅了起来。\n\n那些以前需要刻意去想的技术要领，现在身体自己就记住了。你意识到——自己在这件事上，已经跟刚来时不一样了。",
    conditions: function (st) {
      // 做同一类工作≥30次触发技能突破
      if (!st.stats || !st.stats.actionFreq) return false;
      if (!st.career || !st.career.currentJob) return false;
      if (st.player.day < 20) return false;
      // 检查是否有足够的行动频次
      var jobId = st.career.currentJob.id || "";
      var freq = st.stats.actionFreq[jobId] || 0;
      if (freq < 30) return false;
      // 60天冷却
      if (
        st.flags._skillBreakthroughDay &&
        st.player.day - st.flags._skillBreakthroughDay < 60
      )
        return false;
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "⚡ 追求速度，干得更快",
        hint: "敏捷+2，体力消耗+",
        apply: function (s) {
          s.flags._skillBreakthroughDay = s.player.day;
          s.player.agility = Math.min(100, (s.player.agility || 0) + 2);
          s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
          StateManager.addMessage(
            "⚡ 你找到了节奏感，同样的活现在能干得更快了。敏捷+2，心智+2。你发现自己开始享受这种「顺手」的感觉。",
            "success",
          );
        },
      },
      {
        text: "📖 琢磨技巧，精进手艺",
        hint: "关联技能XP+80",
        apply: function (s) {
          s.flags._skillBreakthroughDay = s.player.day;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 3);
          // 根据当前工作提升关联技能
          var jobId = s.career.currentJob.id || "";
          var skillMap = {
            waste_recycling: "repair",
            old_zhou_recycling: "repair",
            manual_labor_construction: "welding",
            premium_engineering: "welding",
            factory_work_assembly: "electrician",
            street_vending_food: "cooking",
            delivery_rider: "driving",
            restaurant_assistant: "cooking",
            content_writing: "coding",
            junior_analyst: "accounting",
            web_designer: "coding",
            server_ops: "coding",
            network_monitor: "coding",
            foreign_trade_assistant: "english",
            document_translator: "english",
            taxi_driver: "driving",
            truck_assistant: "driving",
            shop_assistant: "sales",
            procurement_clerk: "sales",
            audit_assistant: "accounting",
            factory_electrician: "electrician",
            steel_worker: "welding",
            courier_gig: "driving",
            wholesale_delivery: "driving",
            wholesale_sorting: "repair",
          };
          var skillKey = skillMap[jobId] || "repair";
          if (s.skills && s.skills[skillKey]) {
            s.skills[skillKey].xp = (s.skills[skillKey].xp || 0) + 80;
          }
          StateManager.addMessage(
            "📖 你一边干活一边琢磨技巧，竟然悟出了不少门道。心智+3，" +
              skillKey +
              " XP+80。老师傅说得对：什么活干久了都是学问。",
            "success",
          );
        },
      },
    ],
  });

  // E4：职业迷茫——长期打工后的方向思考
  // 设计意图：触发玩家对"为什么工作"的思考，引导向职业规划发展
  // 联动：workDays + 心智 + 心情 + 职业规划
  RANDOM_EVENTS.push({
    id: "career_doubt_moment",
    phase: "street",
    icon: "🤔",
    title: "路在何方",
    story:
      "你已经在这座城市干了很久的活了。\n\n今晚加班回来，你坐在路边的台阶上，看着人来人往的街道。每个人都在赶路，都有自己的方向。而你——你翻着手机通讯录，发现除了工友和房东，居然没几个能说上话的人。\n\n「我到底要在这里过什么样的生活？」",
    conditions: function (st) {
      // 连续工作60天触发
      if (!st.career || !st.career.currentJob) return false;
      if ((st.career.currentJob.workDays || 0) < 60) return false;
      if (st.player.day < 45) return false;
      // 90天冷却
      if (
        st.flags._careerDoubtDay &&
        st.player.day - st.flags._careerDoubtDay < 90
      )
        return false;
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "📝 列个计划，攒钱学门手艺",
        hint: "心智+5，目标感+",
        apply: function (s) {
          s.flags._careerDoubtDay = s.player.day;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 5);
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📝 你掏出手机，在备忘录里写了几个字：『三个月，学一门手艺，换一条路。』写完之后，心里好像没那么慌了。心智+5，心情+5。",
            "success",
          );
        },
      },
      {
        text: "📞 给家里打个电话",
        hint: "心情+8，亲情+",
        apply: function (s) {
          s.flags._careerDoubtDay = s.player.day;
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 8);
          s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
          // 触发父母好感
          if (s.family && s.family.parents) {
            if (s.family.parents.father)
              s.family.parents.father.companionship = Math.min(
                100,
                (s.family.parents.father.companionship || 0) + 5,
              );
            if (s.family.parents.mother)
              s.family.parents.mother.companionship = Math.min(
                100,
                (s.family.parents.mother.companionship || 0) + 5,
              );
          }
          StateManager.addMessage(
            "📞 你给家里打了个电话。妈接的，絮絮叨叨说了半天家长里短。挂了电话，你觉得这条街的灯光好像没那么冷了。心情+8，心智+2，父母陪伴+5。",
            "success",
          );
        },
      },
      {
        text: "😤 不想了，睡一觉明天继续",
        hint: "疲劳-10，但问题还在",
        apply: function (s) {
          s.flags._careerDoubtDay = s.player.day;
          s.needs.fatigue = Math.max(0, (s.needs.fatigue || 0) - 10);
          s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 2);
          StateManager.addMessage(
            "😤 你甩了甩头，把胡思乱想赶出脑子。洗把脸，倒头就睡。明天还要早起干活。疲劳-10，但心情微微低落。",
            "warning",
          );
        },
      },
    ],
  });

  // E5：职场机遇——客户/老板给你一个改变的机会
  // 设计意图：让玩家感受到"被看见"的惊喜，建立职场正向反馈循环
  // 联动：employment + skills + charm + 道德
  RANDOM_EVENTS.push({
    id: "workplace_opportunity",
    phase: "street",
    icon: "⭐",
    title: "被看见了",
    story:
      "一个经常光顾的老客户今天多看了你几眼，然后递过来一张名片。\n\n「小伙子/小姑娘干活挺利索的，我朋友那边正缺你这样靠谱的人。工资比你现在高，要不要去试试？」\n\n你接过名片看了看——上面印着一个你没听说过的公司名字，但地址在市中心。",
    conditions: function (st) {
      // 30天以上工作经验 + 有相关技能
      if (!st.career || !st.career.currentJob) return false;
      if ((st.career.currentJob.workDays || 0) < 30) return false;
      if (st.player.day < 25) return false;
      // 60天冷却
      if (
        st.flags._workplaceOppDay &&
        st.player.day - st.flags._workplaceOppDay < 60
      )
        return false;
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "📋 接下名片，去看看",
        hint: "可能找到更好的工作",
        apply: function (s) {
          s.flags._workplaceOppDay = s.player.day;
          s.flags._hasJobOpportunity = true;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 3);
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📋 你接下名片，对方笑着说「随时欢迎来看看」。你把名片小心收好，觉得这城市好像也没那么冷漠。心智+3，心情+5。去市中心看看或许会有新机会。",
            "success",
          );
        },
      },
      {
        text: "💬 问问具体做什么的",
        hint: "魅力+2，信息+",
        apply: function (s) {
          s.flags._workplaceOppDay = s.player.day;
          s.player.charm = Math.min(100, (s.player.charm || 0) + 2);
          s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
          StateManager.addMessage(
            "💬 你详细问了问工作内容和待遇。对方一一解答，末了说「你考虑好了打名片上电话就行」。聊完你觉得这城市还是有机会的。魅力+2，心智+2。",
            "success",
          );
        },
      },
      {
        text: "🤝 婉拒，但表示感谢",
        hint: "道德+2，留个好印象",
        apply: function (s) {
          s.flags._workplaceOppDay = s.player.day;
          s.player.morality = Math.min(100, (s.player.morality || 50) + 2);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
          StateManager.addMessage(
            "🤝 你礼貌地婉拒了，说现在的工作还想再坚持一下。对方点点头：「靠谱，以后有需要可以找我。」你觉得自己做对了。道德+2，名气+3。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 状态积累爆发事件（v3.38 新增）======
  // 设计原则：_habits 追踪字段有6个指标但只有2个有事件覆盖，
  // 填补 lowHappinessStreak / junkFoodMeals / lateNightActions 的叙事空白

  // E6：连续心情低落积累 → 被陌生人关心的温暖
  RANDOM_EVENTS.push({
    id: "low_mood_crisis_encounter",
    phase: "street",
    icon: "🌈",
    title: "陌生人的善意",
    story:
      "这几天你一直心情低落，对什么事都提不起劲。\n\n今天在街边发呆时，一个卖花的老奶奶突然递给你一朵快要蔫了的栀子花：「小伙子/姑娘，花快谢了，送给你吧。人生嘛，跟花一样，蔫了还会再开的。」\n\n你接过花，一时说不出话。",
    conditions: function (st) {
      // 连续3天心情<20触发
      if (!st.flags || !st.flags._habits) return false;
      if ((st.flags._habits.lowHappinessStreak || 0) < 3) return false;
      if (st.player.day < 10) return false;
      // 30天冷却
      if (
        st.flags._moodCrisisDay &&
        st.player.day - st.flags._moodCrisisDay < 30
      )
        return false;
      return true;
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "🌸 收下花，道谢",
        hint: "心情+15，心智+3",
        apply: function (s) {
          s.flags._moodCrisisDay = s.player.day;
          s.flags._habits.lowHappinessStreak = 0;
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 15);
          s.player.mental = Math.min(100, (s.player.mental || 0) + 3);
          s.player.morality = Math.min(100, (s.player.morality || 50) + 2);
          StateManager.addMessage(
            "🌸 你接过花，闻了闻那一丝香气。老奶奶笑着摆摆手走了。你把花带回住处插在瓶子里，心情+15，心智+3，道德+2。",
            "success",
          );
        },
      },
      {
        text: "😞 婉拒，不想说话",
        hint: "心情-2，但独处",
        apply: function (s) {
          s.flags._moodCrisisDay = s.player.day;
          s.flags._habits.lowHappinessStreak = 0;
          s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 2);
          StateManager.addMessage(
            "😞 你摇摇头没说话。老奶奶叹了口气，把花放在了旁边的台阶上。你走出去几步，又回头看了一眼——那朵花还在那儿，安安静静的。心情-2。",
            "warning",
          );
        },
      },
    ],
  });

  // E7：垃圾食品积累 → 身体的抗议信号
  RANDOM_EVENTS.push({
    id: "junk_food_body_warning",
    phase: "street",
    icon: "🤢",
    title: "身体的抗议",
    story:
      "半夜你被一阵胃痛惊醒。\n\n最近天天吃泡面、路边摊、速食便当——胃终于受不了了。你蜷缩在床上，额头冒冷汗，翻来覆去睡不着。\n\n隔壁的大姐敲了敲门：「你没事吧？要不要帮你叫个救护车？」",
    conditions: function (st) {
      // 垃圾食品累计≥10次触发
      if (!st.flags || !st.flags._habits) return false;
      if ((st.flags._habits.junkFoodMeals || 0) < 10) return false;
      if (st.player.day < 15) return false;
      // 60天冷却
      if (st.flags._junkFoodDay && st.player.day - st.flags._junkFoodDay < 60)
        return false;
      return true;
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "🏥 去药店买胃药（¥20）",
        hint: "健康+8，胃疼缓解",
        apply: function (s) {
          s.flags._junkFoodDay = s.player.day;
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - 20);
          s.status.health = Math.min(100, (s.status.health || 0) + 8);
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "🏥 你半夜敲开了药店的窗，买了胃药和暖宝宝。花了¥20，但胃总算舒服了。健康+8，心情+3。你决定以后少吃点泡面。",
            "success",
          );
        },
      },
      {
        text: "😣 硬扛着，睡一觉就好了",
        hint: "健康-5，省钱",
        apply: function (s) {
          s.flags._junkFoodDay = s.player.day;
          s.status.health = Math.max(0, (s.status.health || 0) - 5);
          s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 10);
          StateManager.addMessage(
            "😣 你跟隔壁大姐说没事，又躺了回去。一晚上翻来覆去，天亮时才好一点。健康-5，疲劳+10。",
            "danger",
          );
        },
      },
      {
        text: "🥣 熬点粥养胃（需有住所）",
        hint: "健康+5，需求食材",
        apply: function (s) {
          s.flags._junkFoodDay = s.player.day;
          s.status.health = Math.min(100, (s.status.health || 0) + 5);
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 5);
          s.needs.hunger = Math.min(100, (s.needs.hunger || 50) + 10);
          StateManager.addMessage(
            "🥣 你爬起来熬了点白粥。热粥下肚，胃暖和了，人也跟着暖和了。健康+5，心情+5。",
            "success",
          );
        },
      },
    ],
  });

  // E8：深夜行动积累 → 夜归人的意外邂逅
  RANDOM_EVENTS.push({
    id: "night_owl_encounter",
    phase: "street",
    icon: "🌙",
    title: "夜归人",
    story:
      "深夜的街道空荡荡的，只有路灯和偶尔经过的出租车。\n\n你刚从外面回来，发现便利店门口坐着一个跟自己差不多年纪的人，正在看手机。\n\n他/她抬头看见你，笑了笑：「也刚下班？」\n\n那笑容里有一种同类人的默契——在这个城市，深夜还在外面晃的，各有各的故事。",
    conditions: function (st) {
      // 累计夜生活≥5次触发
      if (!st.flags || !st.flags._habits) return false;
      if ((st.flags._habits.lateNightActions || 0) < 5) return false;
      if (st.player.day < 20) return false;
      // 90天冷却
      if (st.flags._nightOwlDay && st.player.day - st.flags._nightOwlDay < 90)
        return false;
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "☕ 坐下来聊两句",
        hint: "心情+8，社交+",
        apply: function (s) {
          s.flags._nightOwlDay = s.player.day;
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 8);
          s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 2);
          StateManager.addMessage(
            "☕ 你们在便利店门口聊了半小时。对方是附近咖啡店的夜班店员，也是刚来这个城市不久。走的时候互相留了个微信——「有空来喝咖啡，我请客。」心情+8，心智+2，名气+2。",
            "success",
          );
        },
      },
      {
        text: "🙂 点点头，继续赶路",
        hint: "独处，心情+2",
        apply: function (s) {
          s.flags._nightOwlDay = s.player.day;
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 2);
          StateManager.addMessage(
            "🙂 你点点头，对方也点点头。两个夜归人的默契——不需要多说。你回到住处，洗洗睡了。心情+2。",
            "info",
          );
        },
      },
      {
        text: "🍜 请对方吃个夜宵（¥25）",
        hint: "心情+12，可能交个朋友",
        apply: function (s) {
          s.flags._nightOwlDay = s.player.day;
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - 25);
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 12);
          s.needs.hunger = Math.min(100, (s.needs.hunger || 50) + 15);
          s.player.charm = Math.min(100, (s.player.charm || 0) + 2);
          StateManager.addMessage(
            "🍜 你请对方去旁边还在营业的面馆吃了碗面。聊天中知道对方叫小林，也在为生活打拼。你们交换了联系方式——这座城市的夜，好像没那么冷了。心情+12，魅力+2。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 专业技能视角事件（v3.39 新增）======
  // 设计原则：技能达到门槛后提供"专业人士视角"，让玩家感受到成长带来的世界观变化

  // E9：修理技能≥40 → 识别建筑安全隐患
  RANDOM_EVENTS.push({
    id: "repair_pro_insight",
    phase: "street",
    icon: "🔍",
    title: "内行看门道",
    story:
      "你今天路过一栋老旧居民楼，习惯性地扫了一眼外墙。\n\n突然你停下脚步——二楼阳台的支撑架有明显裂纹，雨水沿着裂缝渗进去，墙体已经鼓包了。\n\n以前你走过一百次也不会注意到这些，但现在不一样了。",
    conditions: function (st) {
      // 修理技能≥40触发专业视角
      if (!st.skills || !st.skills.repair) return false;
      if ((st.skills.repair.level || 0) < 40) return false;
      if (st.player.day < 30) return false;
      // 90天冷却
      if (
        st.flags._repairInsightDay &&
        st.player.day - st.flags._repairInsightDay < 90
      )
        return false;
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "📢 告诉居委会，让找人来修",
        hint: "道德+5，可能赚点报酬",
        apply: function (s) {
          s.flags._repairInsightDay = s.player.day;
          s.player.morality = Math.min(100, (s.player.morality || 50) + 5);
          s.skills.repair.xp = (s.skills.repair.xp || 0) + 30;
          var reward = Random.int(50, 150);
          s.resources.cash += reward;
          s.resources.totalEarned = (s.resources.totalEarned || 0) + reward;
          s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
          StateManager.addMessage(
            "📢 你找到居委会大姐，指着裂缝说了你的判断。她叫来物业一看——果然！你帮大家避免了一场事故。道德+5，修理XP+30，报酬¥" +
              reward +
              "。有手艺的人，走到哪都被人高看一眼。",
            "success",
          );
        },
      },
      {
        text: "🤐 多一事不如少一事",
        hint: "没事发生",
        apply: function (s) {
          s.flags._repairInsightDay = s.player.day;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 1);
          StateManager.addMessage(
            "🤐 你犹豫了一下，还是走开了。那不是你该管的事。但你知道那堵墙迟早要出事。心智+1。",
            "info",
          );
        },
      },
      {
        text: "🔧 自己带上工具去修（需在城中村）",
        hint: "技能+XP，但可能惹麻烦",
        apply: function (s) {
          s.flags._repairInsightDay = s.player.day;
          s.skills.repair.xp = (s.skills.repair.xp || 0) + 80;
          s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 10);
          s.player.mental = Math.min(100, (s.player.mental || 0) + 3);
          if (Random.chance(0.3)) {
            s.status.health = Math.max(0, (s.status.health || 0) - 3);
            StateManager.addMessage(
              "🔧 你借了工具自己修，但操作不熟练划伤了手。修理XP+80，心智+3，健康-3。手艺还没到能独当一面的程度。",
              "warning",
            );
          } else {
            StateManager.addMessage(
              "🔧 你花了半天时间把支撑架加固了。活干得漂亮——你在下面仰头看了看，心里很踏实。修理XP+80，心智+3。有时候本事就是胆量。",
              "success",
            );
          }
        },
      },
    ],
  });

  // E10：编程技能≥30 → 发现数字世界的套利机会
  RANDOM_EVENTS.push({
    id: "coding_digital_edge",
    phase: "street",
    icon: "🖥️",
    title: "数字嗅觉",
    story:
      "你在网吧查资料时，注意到一个二手交易平台有个价格漏洞——某款热门电子产品在不同城市间的价差高达30%。\n\n你会写爬虫，能自动化抓取这些价差信息。普通人看到的是网页，你看到的是机会。\n\n但利用这个漏洞需要花时间研究，也可能引起平台注意。",
    conditions: function (st) {
      // 编程技能≥30触发
      if (!st.skills || !st.skills.coding) return false;
      if ((st.skills.coding.level || 0) < 30) return false;
      if (st.player.day < 40) return false;
      // 120天冷却
      if (
        st.flags._codingEdgeDay &&
        st.player.day - st.flags._codingEdgeDay < 120
      )
        return false;
      return true;
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      {
        text: "💻 写爬虫套利，赚差价",
        hint: "净赚¥800-1500但引注意",
        apply: function (s) {
          s.flags._codingEdgeDay = s.player.day;
          s.skills.coding.xp = (s.skills.coding.xp || 0) + 50;
          var profit = Random.int(800, 1500);
          s.resources.cash += profit;
          s.resources.totalEarned = (s.resources.totalEarned || 0) + profit;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 3);
          StateManager.addMessage(
            "💻 你花了两天写了个脚本，全自动监控价差。一周下来净赚¥" +
              profit +
              "！编程XP+50，心智+3。技术就是生产力——这句话你第一次真切体会到了。",
            "success",
          );
        },
      },
      {
        text: "📝 记下这个思路，以后做正经项目",
        hint: "编程XP+30，心智+3",
        apply: function (s) {
          s.flags._codingEdgeDay = s.player.day;
          s.skills.coding.xp = (s.skills.coding.xp || 0) + 30;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 3);
          s.player.morality = Math.min(100, (s.player.morality || 50) + 3);
          StateManager.addMessage(
            "📝 你在笔记本上记下了这个思路，但决定不去钻空子。能用技术赚钱的机会以后还有很多——不必走捷径。编程XP+30，心智+3，道德+3。",
            "success",
          );
        },
      },
      {
        text: "😅 我就一普通人，当没看见",
        hint: "无事发生",
        apply: function (s) {
          s.flags._codingEdgeDay = s.player.day;
          StateManager.addMessage(
            "😅 你关掉了网页，继续刷视频。会写代码的人看到的世界确实不一样——但你今天不想动脑子。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 四大扩展系统深度联动事件（v3.40 新增）======
  RANDOM_EVENTS.push({
    id: "medical_debt_crisis",
    phase: "street",
    icon: "💊",
    title: "医药费催收单",
    story:
      "你收到一封挂号信——是医院寄来的医疗费用催收通知。\n\n你之前看病欠下的费用加上滞纳金，已经累计到一个让你手心冒汗的数字。\n\n信上写着：「请在15日内结清，否则将移交法务部门处理。」你的手微微发抖——这不是玩笑。",
    conditions: function (st) {
      if (!st.medical) return false;
      if ((st.medical.totalMedicalSpent || 0) < 5000) return false;
      if (st.medical.insurance) return false;
      if (st.player.day < 30) return false;
      if (st.flags._medicalDebtSeen) return false;
      return true;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "💸 咬牙还清",
        hint: "还清债务，心情-5",
        apply: function (s) {
          s.flags._medicalDebtSeen = true;
          var debt = Math.min(
            s.medical.totalMedicalSpent || 5000,
            s.resources.cash || 0,
          );
          s.resources.cash -= debt;
          s.medical.totalMedicalSpent = 0;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 3);
          s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 5);
          StateManager.addMessage(
            "💸 你取出了存款，把医疗费结清了。走出医院大门时，手里攥着缴费单，心里说不上是轻松还是沉重。心智+3，心情-5。",
            "warning",
          );
        },
      },
      {
        text: "⚖️ 申请医疗救助",
        hint: "需智力≥40，可减免60%",
        apply: function (s) {
          s.flags._medicalDebtSeen = true;
          if ((s.player.intelligence || 0) >= 40) {
            var reduced = Math.floor(
              (s.medical.totalMedicalSpent || 5000) * 0.4,
            );
            s.medical.totalMedicalSpent = reduced;
            s.player.mental = Math.min(100, (s.player.mental || 0) + 5);
            s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
            StateManager.addMessage(
              "⚖️ 你跑了三趟街道办和民政局，终于申请到医疗救助。欠款减到¥" +
                reduced +
                "。心智+5，名气+3。",
              "success",
            );
          } else {
            s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 8);
            StateManager.addMessage(
              "⚖️ 你去了街道办，但听不太懂政策条款，空手而归。心情-8。",
              "warning",
            );
          }
        },
      },
      {
        text: "📞 商量分期付款",
        hint: "每月¥500，免利息",
        apply: function (s) {
          s.flags._medicalDebtSeen = true;
          s.flags._medicalDebtInstallment = true;
          s.medical.totalMedicalSpent = Math.max(
            0,
            (s.medical.totalMedicalSpent || 5000) - 500,
          );
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - 500);
          s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
          StateManager.addMessage(
            "📞 你跟医院磨了半天，对方同意分期。每月¥500，免利息。心智+2。",
            "info",
          );
        },
      },
    ],
  });

  // E12：旅行+医疗 — 异乡突发疾病
  RANDOM_EVENTS.push({
    id: "travel_health_emergency",
    phase: "street",
    icon: "🚑",
    title: "异乡急诊",
    story:
      "你正在外地，突然腹部剧烈绞痛，冷汗直冒。\n\n你蹲在陌生的街边，看着手机上显示的「最近的医院：1.2公里」。\n\n这里没有认识的人，没有熟悉的医保网络，你甚至不确定身上的钱够不够挂急诊。",
    conditions: function (st) {
      if (!st.travel || !st.travel.active) return false;
      if (!st.status || (st.status.health || 70) >= 50) return false;
      if (st.player.day < 30) return false;
      if (st.flags._travelHealthSeen) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🏥 去最近医院",
        hint: "花¥300-800，健康+15",
        apply: function (s) {
          s.flags._travelHealthSeen = true;
          var cost = Math.min(300 + Random.int(0, 500), s.resources.cash || 0);
          s.resources.cash -= cost;
          s.status.health = Math.min(100, (s.status.health || 0) + 15);
          s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
          StateManager.addMessage(
            "🏥 你硬撑着走到医院，急诊医生说是急性肠胃炎。花了¥" +
              cost +
              "，健康+15。一个人在外地生病，最想家。",
            "success",
          );
        },
      },
      {
        text: "💊 买药扛一扛",
        hint: "花¥50-150，效果差",
        apply: function (s) {
          s.flags._travelHealthSeen = true;
          var cost = Math.min(50 + Random.int(0, 100), s.resources.cash || 0);
          s.resources.cash -= cost;
          s.status.health = Math.min(100, (s.status.health || 0) + 5);
          s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 5);
          StateManager.addMessage(
            "💊 你在药店买了止痛药和胃药。花了¥" + cost + "，健康+5，心情-5。",
            "warning",
          );
        },
      },
      {
        text: "🏠 取消行程回家",
        hint: "旅行取消，健康+8",
        apply: function (s) {
          s.flags._travelHealthSeen = true;
          s.travel.active = false;
          s.status.health = Math.min(100, (s.status.health || 0) + 8);
          s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 10);
          StateManager.addMessage(
            "🏠 你买了最近一班车票回家。回到熟悉的城市时，心里踏实了。健康+8，心情-10，旅行取消。",
            "info",
          );
        },
      },
    ],
  });

  // E13：人生节点+职业 — 35岁后的重塑
  RANDOM_EVENTS.push({
    id: "life_midcareer_reinvent",
    phase: "street",
    icon: "🔄",
    title: "三十五岁之后",
    story:
      "你最近总是失眠。\n\n白天干着同样的活，晚上躺在床上算账。\n\n你也刷到过那些「35岁职场危机」的文章，以前觉得是贩卖焦虑，现在发现自己已经在那个年纪了。\n\n同乡老周上个月回老家了，走之前说了一句话：「这城市终究是年轻人的。」你当时没接话——但这句话一直卡在喉咙里。",
    conditions: function (st) {
      if (!st.flags || !st.flags._lifeNode_midlife_crisis_done) return false;
      if (st.player.age < 35) return false;
      if (st.flags._midlifeCareerSeen) return false;
      if (st.career && st.career.currentJob && st.career.currentJob.level >= 3)
        return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "📚 报培训班转行",
        hint: "花¥2000，开启新可能",
        apply: function (s) {
          s.flags._midlifeCareerSeen = true;
          var cost = Math.min(2000, s.resources.cash || 0);
          s.resources.cash -= cost;
          s.flags._midlifeRetraining = true;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 5);
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📚 你报了一个职业技能培训班，花¥" +
              cost +
              "。第一天上课，教室里坐着的都是比你年轻的人——但开始永远不晚。心智+5，心情+5。",
            "success",
          );
        },
      },
      {
        text: "💪 深耕现有工作",
        hint: "技能XP+100",
        apply: function (s) {
          s.flags._midlifeCareerSeen = true;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 5);
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 3);
          if (s.skills) {
            var keys = Object.keys(s.skills);
            if (keys.length > 0) {
              s.skills[keys[0]].xp = (s.skills[keys[0]].xp || 0) + 100;
            }
          }
          StateManager.addMessage(
            "💪 你决定在现有路上跑得更快、学得更深。技能XP+100，心智+5，心情+3。你不是在下坡——你是在换挡。",
            "success",
          );
        },
      },
      {
        text: "😮‍💨 走一步看一步",
        hint: "维持现状，心情-5",
        apply: function (s) {
          s.flags._midlifeCareerSeen = true;
          s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 5);
          StateManager.addMessage(
            "😮‍💨 你翻了个身，把手机扣在床头。明天的事明天再说。但有些问题不会自己消失。心情-5。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== 更多专业技能视角事件（v3.41 新增）======
  // 为cooking/driving/sales/english等技能补充视角事件

  // E14：烹饪技能≥50 → 能分辨食材优劣
  RANDOM_EVENTS.push({
    id: "cooking_pro_insight",
    phase: "street",
    icon: "👨‍🍳",
    title: "舌尖上的判断力",
    story:
      "你去小餐馆吃饭，一口汤喝下去就觉得不对。\n\n不是坏了——是食材不新鲜，而且厨师用味精和辣椒盖住了味道。\n\n以前的你绝对喝不出来，但现在的舌头骗不了自己。你看着菜单上「新鲜食材」的广告语，忽然觉得讽刺。",
    conditions: function (st) {
      if (!st.skills || !st.skills.cooking) return false;
      if ((st.skills.cooking.level || 0) < 50) return false;
      if (st.player.day < 35) return false;
      if (
        st.flags._cookingInsightDay &&
        st.player.day - st.flags._cookingInsightDay < 100
      )
        return false;
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "📢 跟老板提意见",
        hint: "道德+3，可能被赶",
        apply: function (s) {
          s.flags._cookingInsightDay = s.player.day;
          s.player.morality = Math.min(100, (s.player.morality || 50) + 3);
          s.skills.cooking.xp = (s.skills.cooking.xp || 0) + 20;
          if (Random.chance(0.5)) {
            StateManager.addMessage(
              "📢 你跟老板反映了食材问题。老板愣了一下，说「你是行家啊，下次给你用新鲜的」。道德+3，烹饪XP+20。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "📢 老板不耐烦地说「我们一直用新鲜的」。你不再多说，但心里清楚。道德+3。懂行的人，吃点亏也认了。",
              "info",
            );
          }
        },
      },
      {
        text: "😅 算了，吃完走人",
        hint: "省事，无事发生",
        apply: function (s) {
          s.flags._cookingInsightDay = s.player.day;
          StateManager.addMessage(
            "😅 你默默吃完走了。有些事，看破不说破也是一种成熟。",
            "info",
          );
        },
      },
      {
        text: "🥘 回家自己做一顿好的",
        hint: "烹饪XP+40，心情+8",
        apply: function (s) {
          s.flags._cookingInsightDay = s.player.day;
          s.skills.cooking.xp = (s.skills.cooking.xp || 0) + 40;
          s.needs.hunger = Math.min(100, (s.needs.hunger || 50) + 25);
          s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "🥘 你去菜市场挑了新鲜的食材，回家用心做了一顿。自己做的就是比外面的好吃。烹饪XP+40，心情+8。",
            "success",
          );
        },
      },
    ],
  });

  // E15：驾驶技能≥40 → 规划最优出行路线
  RANDOM_EVENTS.push({
    id: "driving_route_insight",
    phase: "street",
    icon: "🗺️",
    title: "老司机的眼光",
    story:
      "你站在公交站台，看着路线图。\n\n旁边的人都在等那趟挤满人的车，但你发现了一条小众换乘路线——多走400米换另一趟车，不仅能坐到座位，还能省15分钟。\n\n你以前从没注意过这种细节。但现在，整座城市的交通脉络在你眼里越来越清晰。",
    conditions: function (st) {
      if (!st.skills || !st.skills.driving) return false;
      if ((st.skills.driving.level || 0) < 40) return false;
      if (st.player.day < 30) return false;
      if (
        st.flags._drivingInsightDay &&
        st.player.day - st.flags._drivingInsightDay < 90
      )
        return false;
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🗺️ 走小众路线，省时间",
        hint: "行动力+5，省¥10",
        apply: function (s) {
          s.flags._drivingInsightDay = s.player.day;
          s.player.maxActionPoints = Math.min(
            100,
            (s.player.maxActionPoints || 100) + 2,
          );
          s.player.agility = Math.min(100, (s.player.agility || 0) + 2);
          s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
          StateManager.addMessage(
            "🗺️ 你走了那条小众路线，果然人少车快。不但有座位，还比预计早到了！敏捷+2，心智+2。会认路的人，在哪个城市都不慌。",
            "success",
          );
        },
      },
      {
        text: "📝 记下来，以后用得着",
        hint: "心智+3",
        apply: function (s) {
          s.flags._drivingInsightDay = s.player.day;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 3);
          s.skills.driving.xp = (s.skills.driving.xp || 0) + 20;
          StateManager.addMessage(
            "📝 你在手机备忘录里记下了这条路线。在这个城市待久了，你越来越懂它的脾性。心智+3，驾驶XP+20。",
            "success",
          );
        },
      },
      {
        text: "🚶 不急，跟别人一起等",
        hint: "无事发生",
        apply: function (s) {
          s.flags._drivingInsightDay = s.player.day;
          StateManager.addMessage(
            "🚶 你跟着人群上了那辆拥挤的车。虽然你有更好的选择，但今天就随大流吧。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 更多技能视角事件（v3.42 新增）======
  // 为sales和english补充视角事件，完成常用技能视角覆盖

  // E16：销售技能≥50 → 看穿谈判对手的心理价位
  RANDOM_EVENTS.push({
    id: "sales_pro_insight",
    phase: "street",
    icon: "🤝",
    title: "读心术",
    story:
      "你在二手市场看中一件东西，摊主开价¥200。\n\n他嘴上说「最低价了，再低要亏本」，但手指在桌面上敲了三下——你注意到这个细节。\n\n在销售行业待久了，你发现人在说谎或心虚时，总有些藏不住的小动作。面前这个人，他的底价最多¥120。",
    conditions: function (st) {
      if (!st.skills || !st.skills.sales) return false;
      if ((st.skills.sales.level || 0) < 50) return false;
      if (st.player.day < 35) return false;
      if (
        st.flags._salesInsightDay &&
        st.player.day - st.flags._salesInsightDay < 90
      )
        return false;
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "💰 砍到¥120，成交",
        hint: "省¥80，销售XP+30",
        apply: function (s) {
          s.flags._salesInsightDay = s.player.day;
          s.resources.cash -= 120;
          s.skills.sales.xp = (s.skills.sales.xp || 0) + 30;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
          StateManager.addMessage(
            "💰 你报出¥120，摊主愣了一下，然后苦笑着点头。你心里清楚——他还有得赚，但你也没亏。销售XP+30，心智+2。",
            "success",
          );
        },
      },
      {
        text: "😅 不砍价，直接买",
        hint: "多花¥80，省事",
        apply: function (s) {
          s.flags._salesInsightDay = s.player.day;
          s.resources.cash -= 200;
          StateManager.addMessage(
            "😅 你付了¥200。虽然知道被宰了，但有时候不想把生活过成一场谈判。",
            "info",
          );
        },
      },
      {
        text: "🤝 跟摊主聊聊，交个朋友",
        hint: "魅力+2，可能拿到更好价",
        apply: function (s) {
          s.flags._salesInsightDay = s.player.day;
          s.player.charm = Math.min(100, (s.player.charm || 0) + 2);
          s.skills.sales.xp = (s.skills.sales.xp || 0) + 20;
          s.resources.cash -= 100;
          StateManager.addMessage(
            "🤝 你跟摊主聊了会儿，夸他选货眼光好。他心情好了，主动降价到¥100。销售XP+20，魅力+2。有时候真诚比技巧更管用。",
            "success",
          );
        },
      },
    ],
  });

  // E17：英语技能≥40 → 看懂外文信息，获得独特机会
  RANDOM_EVENTS.push({
    id: "english_pro_insight",
    phase: "street",
    icon: "🌐",
    title: "另一扇窗",
    story:
      "你在网吧浏览网页时，无意中打开了一个英文自由职业平台。\n\n上面有大量的远程工作机会——翻译、数据标注、内容写作——报价比国内平台高出3-5倍。\n\n你以前从没想过自己能用英语赚钱。但现在，那些曾经陌生的单词，越来越多地变成了看得懂的信息。",
    conditions: function (st) {
      if (!st.skills || !st.skills.english) return false;
      if ((st.skills.english.level || 0) < 40) return false;
      if (st.player.day < 40) return false;
      if (
        st.flags._englishInsightDay &&
        st.player.day - st.flags._englishInsightDay < 100
      )
        return false;
      return true;
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      {
        text: "💻 注册接单，赚美金",
        hint: "英语XP+50，赚¥500-1500",
        apply: function (s) {
          s.flags._englishInsightDay = s.player.day;
          s.skills.english.xp = (s.skills.english.xp || 0) + 50;
          var earn = Random.int(500, 1500);
          s.resources.cash += earn;
          s.resources.totalEarned = (s.resources.totalEarned || 0) + earn;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 3);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 2);
          StateManager.addMessage(
            "💻 你注册了平台，接了一个翻译单。花了三天完成，赚了¥" +
              earn +
              "。英语XP+50，心智+3，名气+2。多一门语言，就是多一条路。",
            "success",
          );
        },
      },
      {
        text: "📝 收藏起来，以后再说",
        hint: "心智+2",
        apply: function (s) {
          s.flags._englishInsightDay = s.player.day;
          s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
          StateManager.addMessage(
            "📝 你收藏了网址。在这个城市，信息就是机会——而英语，就是打开那扇门的钥匙。心智+2。",
            "info",
          );
        },
      },
      {
        text: "😶 跟我没关系",
        hint: "无事发生",
        apply: function (s) {
          s.flags._englishInsightDay = s.player.day;
          StateManager.addMessage(
            "😶 你关掉了页面，继续刷短视频。那些英文看着就头疼——还是中文舒服。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 联动事件44：老手特遇——配送老主顾的谢礼 ======
  // 设计意图：玩家长期做配送/跑腿类工作后，遇到回头客的主动推荐，体现"城市开始认识你"
  // [自洽修复] CROSS_EVENTS → RANDOM_EVENTS 直推（原为死代码）
  RANDOM_EVENTS.push({
    id: "delivery_regular_customer",
    phase: "street",
    icon: "📦",
    title: "老主顾的推荐",
    story:
      "今天送快递时，收件人认出你了——'你上次给我送过包裹对吧？我朋友公司正好在招配送主管，月薪8000起，你要不要试试？'\n\n对方递来一张名片，上面印着'顺达物流·招聘部'。你看了看手机里的配送记录，这月已经跑了150单了。",
    // [自洽新增] conditions：检查配送类副业活跃 或 物流路径工作 或 累计配送行动≥30
    conditions: function (st) {
      var hasDrivingSideHustle =
        st.sideHustle &&
        st.sideHustle.type === "driving" &&
        st.sideHustle.active;
      var hasLogisticsJob =
        st.career &&
        st.career.currentJob &&
        st.career.currentJob.path === "logistics";
      var hasDeliveryFreq =
        st.stats &&
        st.stats.actionFreq &&
        (st.stats.actionFreq["delivery_rider"] || 0) +
          (st.stats.actionFreq["courier_gig"] || 0) +
          (st.stats.actionFreq["package_delivery"] || 0) >=
          30;
      var hasDrivingSkill =
        st.skills && st.skills.driving && st.skills.driving.level >= 10;
      return (
        st.player.phase === "street" &&
        st.player.day >= 30 &&
        (hasDrivingSideHustle || hasLogisticsJob || hasDeliveryFreq) &&
        hasDrivingSkill &&
        !st.flags._deliveryRegularSeen
      );
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "📋 投递简历，试试管理岗",
        hint: "开启物流管理路线",
        apply: function (st) {
          st.flags._deliveryRegularSeen = true;
          st.flags._deliveryRegularReferred = st.player.day;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          StateManager.addMessage(
            "📋 你把简历发了过去。对方说'明天会有HR联系你'。你心里有点忐忑——从底层骑手到管理岗，这是第一次有人主动给你机会。名气+3，心情+8。",
            "success",
          );
          // 后续链式：HR联系
          if (typeof scheduleChainEvent === "function") {
            scheduleChainEvent(st, "hr_call_delivery", 2, "street");
          }
        },
      },
      {
        text: "📱 先要个联系方式，慢慢了解",
        hint: "保留机会",
        apply: function (st) {
          st.flags._deliveryRegularSeen = true;
          st.flags._deliveryRegularContact = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 4);
          StateManager.addMessage(
            "📱 你加了对方微信。他说'有需要随时找我'。虽然不急，但多一个选项总是好的。心情+4。",
            "info",
          );
        },
      },
      {
        text: "🚶 算了，配送挺好的",
        hint: "拒绝机会",
        apply: function (st) {
          st.flags._deliveryRegularSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 2);
          StateManager.addMessage(
            "🚶 你笑着谢绝了。送快递虽然累，但至少自由。今天多跑了20单，赚了¥300。心情+2。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 联动事件45：专业人士视角——识别假冒伪劣电动工具 ======
  // 设计意图：修理技能到达门槛后解锁"专业人士视角"事件，体现技能积累的价值
  // [自洽修复] CROSS_EVENTS → RANDOM_EVENTS 直推（原为死代码）
  RANDOM_EVENTS.push({
    id: "pro_identify_fake_tools",
    phase: "street",
    icon: "🔧",
    title: "假货识破眼",
    story:
      "路边有人摆摊卖「名牌电动工具」，价格只有商场的三分之一。电钻、角磨机堆了一地，摊主吆喝着「厂家直销，保修一年」。\n\n旁边有人掏钱要买，但你扫了一眼那做工——焊缝粗糙、标牌印刷模糊。你心里有了数。",
    // [自洽新增] conditions：修理技能≥40（专业门槛）
    conditions: function (st) {
      var repairLevel =
        (st.skills && st.skills.repair && st.skills.repair.level) || 0;
      return (
        st.player.phase === "street" &&
        st.player.day >= 20 &&
        repairLevel >= 40 &&
        !st.flags._proIdentifyFakeSeen
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🗣️ 提醒想买的人别上当",
        hint: "名声+3，道德+1",
        apply: function (st) {
          st.flags._proIdentifyFakeSeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          StateManager.addMessage(
            "🗣️ 你走过去对正要买的摊主说：「这焊点是砂轮机磨的，不是机器焊的，假货。」那人愣了一下，把东西放下了。摊主瞪了你一眼。你帮了别人，也得罪了人。名气+3，道德+2，心情+5。",
            "success",
          );
        },
      },
      {
        text: "🔍 自己也买一把试试真假",
        hint: "花¥80验证，修理XP+20",
        cost: 80,
        apply: function (st) {
          st.flags._proIdentifyFakeSeen = true;
          st.skills.repair.xp = Math.min(1000, (st.skills.repair.xp || 0) + 20);
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 10) + 1,
          );
          StateManager.addMessage(
            "🔍 你花¥80买了一把，拆开一看——电机是二手翻新的，电路板是手工焊的。你笑了：「果然是假的。」但验证过程让你对仿造工艺有了更深的理解。修理XP+20，智力+1。",
            "info",
          );
        },
      },
      {
        text: "🤐 不关我事，走人",
        hint: "无事发生",
        apply: function (st) {
          st.flags._proIdentifyFakeSeen = true;
          st.player.morality = Math.max(0, (st.player.morality || 50) - 1);
          StateManager.addMessage(
            "🤐 你转身走了。虽然知道那是假货，但多一事不如少一事。只是心里有点过意不去。道德-1。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== 联动事件46：NPC好感积累——意外的信息泄露 ======
  // 设计意图：NPC好感达到阈值后，对方无意中透露一个隐藏信息/机会
  // [自洽修复] CROSS_EVENTS → RANDOM_EVENTS 直推（原为死代码）
  RANDOM_EVENTS.push({
    id: "npc_affinity_info_leak",
    phase: "street",
    icon: "🤫",
    title: "无心之言藏玄机",
    story: "",
    // [自洽新增] conditions：任意NPC好感≥60时触发
    conditions: function (st) {
      if (!st.relationships) return false;
      for (var nid in st.relationships) {
        var rel = st.relationships[nid];
        if (rel && rel.affinity >= 60 && rel.met) {
          // 排除已触发过此类型事件的NPC
          if (st.flags["_npcInfoLeaked_" + nid]) continue;
          return true;
        }
      }
      return false;
    },
    probability: 0.02,
    repeatable: true,
    choices: [], // 动态生成
    // [自洽新增] 动态生成选项：基于最高好感NPC
    dynamicApply: function (st) {
      // 找到最高好感NPC
      var bestNid = null;
      var bestAff = -200;
      for (var nid in st.relationships) {
        var rel = st.relationships[nid];
        if (rel && rel.affinity > bestAff) {
          bestAff = rel.affinity;
          bestNid = nid;
        }
      }
      if (!bestNid) return null;

      var npcDef = null;
      if (typeof NPCS !== "undefined") {
        for (var ni = 0; ni < NPCS.length; ni++) {
          if (NPCS[ni].id === bestNid) {
            npcDef = NPCS[ni];
            break;
          }
        }
      }
      if (!npcDef) return null;

      st.flags["_npcInfoLeaked_" + bestNid] = true;

      // 根据NPC角色提供不同类型的信息
      var infoType = "";
      var infoText = "";
      var reward = {};
      switch (bestNid) {
        case "aunt_wang":
          infoType = "房租信息";
          infoText =
            "王大婶随口说：「下个月老城区要改造，你那片房租可能要涨30%。趁现在赶紧找新地方。」";
          reward = { rentWarning: true };
          break;
        case "boss_li":
          infoType = "工程情报";
          infoText =
            "李工头喝多了说漏嘴：「下周城东那块地要开拍了，缺人手，一天¥300起。想去的明天来找我。」";
          reward = { tempJobChance: true };
          break;
        case "chef_chen":
          infoType = "食材行情";
          infoText =
            "陈师傅一边颠勺一边说：「下个月海鲜要涨价，批发市场的鱼贵一倍。你如果有存货赶紧出手。」";
          reward = { priceWarning: "seafood" };
          break;
        case "old_zhou":
          infoType = "废品行情";
          infoText =
            "老周说：「最近铜价涨疯了，你家里有啥旧铜线赶紧翻出来。我明天去回收站问问价。」";
          reward = { scrapBonus: "copper" };
          break;
        case "sister_zhang":
          infoType = "招聘内推";
          infoText =
            "张姐说：「我这边有个大厂外包的活，日结¥400，干一个月。你要不要试试？不用面试，我直接推。」";
          reward = { tempJobChance: true };
          break;
        case "xiao_mei":
          infoType = "学习资源";
          infoText =
            "小美说：「我导师那边有个免费的线上编程课，结业发证书。你要不要报一个？对你找工作有帮助。」";
          reward = { courseOpportunity: true };
          break;
        default:
          infoType = "城市情报";
          infoText =
            npcDef.name +
            "随口说：「对了，我听说最近" +
            npcDef.location +
            "那边有好事，你没事可以去转转。」";
          reward = { locationHint: npcDef.location };
      }

      return {
        story:
          "你正在和" +
          npcDef.name +
          "闲聊，" +
          infoText +
          "\n\n你心里一动——这可能是个机会。",
        choices: [
          {
            text: "📝 记下来，以后留意",
            hint: "获得情报价值",
            apply: function (s) {
              if (reward.rentWarning) {
                s.flags.zhaojieRentInfo = true;
                StateManager.addMessage(
                  "📝 你把王大婶的提醒记在了手机备忘录里。下个月如果房东真要涨租，你就有准备了。",
                  "success",
                );
              }
              if (reward.tempJobChance) {
                s.flags._npcTempJobReferral = bestNid;
                s.flags._npcTempJobDay = s.player.day;
                StateManager.addMessage(
                  "📝 你记住了这个信息。" +
                    npcDef.name +
                    "的推荐比海投简历靠谱多了。",
                  "success",
                );
              }
              if (reward.priceWarning) {
                s.flags._priceWarning = reward.priceWarning;
                s.flags._priceWarningDay = s.player.day;
                StateManager.addMessage(
                  "📝 你记下了" +
                    npcDef.name +
                    "的提醒。如果" +
                    reward.priceWarning +
                    "真的要涨价，你提前囤货就能赚差价。",
                  "info",
                );
              }
              if (reward.scrapBonus) {
                s.flags._scrapPriceAlert = reward.scrapBonus;
                s.flags._scrapAlertDay = s.player.day;
                StateManager.addMessage(
                  "📝 你赶紧回家翻了翻——还真有一些旧铜线！明天拿去卖能多赚不少。",
                  "success",
                );
              }
              if (reward.courseOpportunity) {
                s.flags._freeCourseLink = true;
                s.flags._courseLinkDay = s.player.day;
                s.player.intelligence = Math.min(
                  100,
                  (s.player.intelligence || 10) + 1,
                );
                StateManager.addMessage(
                  "📝 你让小美把链接发你了。免费课程+证书，这对找工作确实有帮助。智力+1。",
                  "info",
                );
              }
              if (reward.locationHint) {
                s.flags._locationHint = reward.locationHint;
                s.flags._locationHintDay = s.player.day;
                StateManager.addMessage(
                  "📝 你记下了" +
                    npcDef.name +
                    "的话。" +
                    reward.locationHint +
                    "——也许那里真的有好事。",
                  "info",
                );
              }
            },
          },
          {
            text: "🤷 随口一说，不算数",
            hint: "忽略情报",
            apply: function (s) {
              StateManager.addMessage(
                "🤷 你笑了笑没当真。城市里每天流传各种消息，真正有用的没几个。",
                "info",
              );
            },
          },
        ],
      };
    },
  });

  // ====== 联动事件47：天气×位置组合——暴雨中的批发市场 ======
  // 设计意图：暴雨天气 + 批发市场 = 独特情境事件，体现环境与地点的交叉影响
  // [自洽修复] CROSS_EVENTS → RANDOM_EVENTS 直推（原为死代码）
  RANDOM_EVENTS.push({
    id: "rain_wholesale_opportunity",
    phase: "street",
    icon: "🌧️",
    title: "雨中的批发市场",
    story:
      "暴雨突至，你被困在批发市场的一个大棚下。周围都是忙着收摊的商贩，但你也注意到——雨越大，越多人急着出货。\n\n一个卖防水布的老板冲你喊：「小伙子，下雨天买防水布便宜！平时¥50一捆，今天¥30！」",
    // [自洽新增] conditions：暴雨天气 + 在批发市场
    conditions: function (st) {
      var isStormy =
        st.weather &&
        (st.weather.current === "stormy" || st.weather.current === "rainy");
      var inWholesale =
        st.trade && st.trade.currentLocation === "wholesaleMarket";
      return st.player.phase === "street" && isStormy && inWholesale;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "🛒 买一捆防水布（¥30）",
        hint: "摆摊/露宿都用得上",
        apply: function (st) {
          st.resources.cash = Math.max(0, st.resources.cash - 30);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
          // 给防水布物品
          if (!st.flags._boughtRainCanvas) {
            st.flags._boughtRainCanvas = true;
            st.flags._rainCanvasDay = st.player.day;
          }
          StateManager.addMessage(
            "🛒 你花¥30买了一捆防水布。老板说「这雨还得下两天，你早点收摊」——看来暴雨还会持续。心情+3。",
            "info",
          );
        },
      },
      {
        text: "📦 趁机低价收一批货",
        hint: "雨天没人来买，批发价更低",
        cost: 500,
        apply: function (st) {
          if (st.resources.cash >= 500) {
            st.resources.cash -= 500;
            st.flags._rainWholesaleBought = true;
            st.flags._rainWholesaleDay = st.player.day;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            StateManager.addMessage(
              "📦 你趁雨天收了¥500的货。老板们急着清仓，价格比平时低了40%。等雨停了转手卖能赚不少。智力+2。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "📦 你想趁雨天收便宜货，但现金不够。只能看看别人忙活。",
              "warning",
            );
          }
        },
      },
      {
        text: "🏠 赶紧回家，雨天不安全",
        hint: "安全回家",
        apply: function (st) {
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 2);
          StateManager.addMessage(
            "🏠 你冒雨跑回了住处。虽然淋湿了，但安全第一。明天雨停了再继续。心情+2。",
            "info",
          );
        },
      },
    ],
  });
  // ====== v3.52 联动事件扩充（5个新增）======
  // 设计意图：填补5个联动空白区——寒潮住所危机/名气社交回响/健康孤立支持/学历白领瓶颈/副业规模化

  // ----- 事件48：天气×住所情境 — 寒潮中住所不达标的危机 -----
  // 联动：weather.cold_snap + housing.tier ≤ 1 + health < 65
  // [自洽修复] CROSS_EVENTS → RANDOM_EVENTS 直推（原为死代码）
  RANDOM_EVENTS.push({
    id: "cold_snap_housing_crisis",
    phase: "street",
    icon: "🥶",
    title: "寒潮中的四面墙",
    story:
      "寒潮来袭，夜间气温骤降到零下。你住所的墙壁薄得能听见风在缝隙里尖叫。\n\n被冻醒第四次时，你看了看手机：今晚还有6级北风。薄被已经不够了，哈出的气在黑暗里凝成白雾。",
    // [自洽新增] conditions：寒潮天气 + 住所 tier≤1 + 健康<65
    conditions: function (st) {
      var isColdSnap = st.weather && st.weather.current === "cold_snap";
      var isPoorHousing = ((st.housing && st.housing.tier) || 0) <= 1;
      var isWeak = ((st.status && st.status.health) || 70) < 65;
      return (
        st.player.phase === "street" &&
        isColdSnap &&
        isPoorHousing &&
        isWeak &&
        st.player.day >= 15 &&
        !st.flags._coldSnapHousingSeen
      );
    },
    probability: 0.07,
    repeatable: false,
    choices: [
      {
        text: "🏠 借住朋友家（需NPC好感≥40）",
        hint: "求助有代价",
        apply: function (st) {
          st.flags._coldSnapHousingSeen = true;
          var helper = null;
          for (var nid in st.relationships) {
            var r = st.relationships[nid];
            if (r && r.met && r.affinity >= 40) {
              helper = nid;
              break;
            }
          }
          if (helper) {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            st.relationships[helper].affinity = Math.max(
              -100,
              st.relationships[helper].affinity - 3,
            );
            StateManager.addMessage(
              "🥶 你在" +
                helper +
                "家借住了一晚——人情冷暖，欠下的总要还。心情+8，疲劳-10，对方好感-3。",
              "success",
            );
          } else {
            st.status.health = Math.max(0, (st.status.health || 70) - 3);
            StateManager.addMessage(
              "🥶 你想找人借住，翻了翻通讯录竟没有能开口的人。在寒夜中又熬了一晚。健康-3。",
              "warning",
            );
          }
        },
      },
      {
        text: "🛒 花¥80买床厚被",
        hint: "咬牙御寒",
        apply: function (st) {
          st.flags._coldSnapHousingSeen = true;
          if (st.resources.cash >= 80) {
            st.resources.cash -= 80;
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 8);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage(
              "🛒 花¥80在二手店买了床厚被。沉甸甸压在身上，终于睡了个整觉。疲劳-8，心情+3。",
              "success",
            );
          } else {
            st.status.health = Math.max(0, (st.status.health || 70) - 5);
            StateManager.addMessage(
              "🛒 想买被子但差了几块钱。这一夜格外漫长。健康-5。",
              "warning",
            );
          }
        },
      },
      {
        text: "🔥 硬扛过去",
        hint: "消耗健康",
        apply: function (st) {
          st.flags._coldSnapHousingSeen = true;
          st.status.health = Math.max(0, (st.status.health || 70) - 8);
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
          StateManager.addMessage(
            "🔥 你裹紧薄被硬扛了一夜。凌晨全身都在发抖——下次一定提前准备。健康-8，疲劳+15。",
            "warning",
          );
        },
      },
    ],
  });

  // ----- 事件49：名气积累×社交网络的"被认出" -----
  // 联动：player.fame ≥ 60 + day ≥ 80
  // [自洽修复] CROSS_EVENTS → RANDOM_EVENTS 直推（原为死代码）
  RANDOM_EVENTS.push({
    id: "fame_recognized_encounter",
    phase: "street",
    icon: "⭐",
    title: "这个人我见过",
    story:
      '你在街边小店吃饭，邻桌一个中年男人盯着你看了好一会儿，突然走过来说："你是不是就是那个……我好像在短视频里刷到过你？"\n\n他表情真诚，不像是坏人。但「被人认出」这件事，让你既意外又有点微妙的不安。',
    // [自洽新增] conditions：名气≥60 + day≥80
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.player.day >= 80 &&
        (st.player.fame || 0) >= 60 &&
        !st.flags._fameRecognizedSeen
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "😊 客气回应，留个好印象",
        hint: "名气+3，心情+5",
        apply: function (st) {
          st.flags._fameRecognizedSeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "😊 你笑着聊了几句。对方加了你的联系方式，说'以后多走动'。名气+3，心情+5。",
            "success",
          );
        },
      },
      {
        text: "😅 谦虚否认，低调做人",
        hint: "安稳但错失机会",
        apply: function (st) {
          st.flags._fameRecognizedSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "😅 你摆手说认错人了。保持低调有低调的好处——至少没那么多麻烦。心情+2，心智+3。",
            "info",
          );
        },
      },
      {
        text: "🤔 跟他聊，看有没有合作机会",
        hint: "需魅力≥40，可触发人脉",
        apply: function (st) {
          st.flags._fameRecognizedSeen = true;
          if ((st.player.charm || 0) >= 40) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            st.flags._fameConnectionBonus = true;
            StateManager.addMessage(
              "🤔 聊了半小时，发现他做的是跟你名气相关的行业。一笔小合作谈成了。名气+5，人脉机会开启。",
              "success",
            );
          } else {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            StateManager.addMessage(
              "🤔 你试着聊合作，但话不投机。尴尬喝了杯茶就散了。心情-3。",
              "warning",
            );
          }
        },
      },
    ],
  });

  // ----- 事件50：健康连续恶化×社会支持缺失的"孤立危机" -----
  // 联动：health < 40 + lowHealthStreak ≥ 5 + 无NPC好感≥50
  // [自洽修复] CROSS_EVENTS → RANDOM_EVENTS 直推（原为死代码）
  RANDOM_EVENTS.push({
    id: "health_alone_trough",
    phase: "street",
    icon: "💔",
    title: "没人知道的痛",
    story:
      "身体已经不舒服整整五天了。今天走在路上，突然觉得腿软，蹲在路边缓了好一会儿。\n\n看着来来往往的人，你突然意识到——这座城市这么大，竟然没有一个你可以打电话说'我不舒服'的人。",
    // [自洽新增] conditions：health<40 + lowHealthStreak≥5 + 无NPC好友
    conditions: function (st) {
      var habits = st.flags && st.flags._habits;
      var lowHealthStreak = habits ? habits.lowHealthStreak || 0 : 0;
      var noCloseFriend = true;
      for (var nid in st.relationships) {
        var r = st.relationships[nid];
        if (r && r.met && r.affinity >= 50) {
          noCloseFriend = false;
          break;
        }
      }
      return (
        st.player.phase === "street" &&
        (st.status.health || 70) < 40 &&
        lowHealthStreak >= 5 &&
        noCloseFriend &&
        st.player.day >= 30 &&
        !st.flags._healthAloneSeen
      );
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "🏥 咬牙去医院（需¥200+）",
        hint: "治愈但花费大",
        apply: function (st) {
          st.flags._healthAloneSeen = true;
          var cost = Math.min(200 + Random.int(0, 200), st.resources.cash || 0);
          st.resources.cash -= cost;
          st.status.health = Math.min(100, (st.status.health || 0) + 18);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          StateManager.addMessage(
            "🏥 你独自在医院排队挂号。拿到药走出医院时，阳光特别刺眼。花了¥" +
              cost +
              "，健康+18，心智+5。",
            "success",
          );
        },
      },
      {
        text: "🍜 吃碗热面，给自己打气",
        hint: "小幅恢复，心情+",
        apply: function (st) {
          st.flags._healthAloneSeen = true;
          if (st.resources.cash >= 15) {
            st.resources.cash -= 15;
            st.status.health = Math.min(100, (st.status.health || 0) + 5);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            StateManager.addMessage(
              "🍜 路边小店吃了碗热汤面。热气从胃里暖上来，眼泪差点掉进碗里。健康+5，心情+8。",
              "info",
            );
          } else {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage(
              "🍜 兜里只剩几个硬币，喝了口热水胃里暖了点。心情+3。",
              "info",
            );
          }
        },
      },
      {
        text: "🤝 试着找个人聊聊",
        hint: "尝试经营NPC关系",
        apply: function (st) {
          st.flags._healthAloneSeen = true;
          st.flags._triedReachingOut = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "🤝 你决定放下自尊，去找一个认识但不熟的人说说话。这城市里，孤立是慢慢攒出来的——靠近别人也是。心情+5，心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件51：学历完成后×白领世界的"入世门槛" -----
  // 联动：education ≥ 2 + 无职业状态 → 第一次面试挫败
  // [自洽修复] CROSS_EVENTS → RANDOM_EVENTS 直推（原为死代码）
  RANDOM_EVENTS.push({
    id: "edu_white_collar_threshold",
    phase: "street",
    icon: "🎓",
    title: "学历拿到了，然后呢",
    story:
      '本科毕业证的快递到了。你撕开信封，看着自己的名字烫在证书上。\n\n当天下午你信心满满地去写字楼面试前台——HR翻了翻你的简历，抬头问："你有什么工作经验?"\n\n你愣住了。',
    // [自洽新增] conditions：education≥2 + 无职业 + day≥30
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.player.education >= 2 &&
        st.player.day >= 30 &&
        !(st.career && st.career.currentJob) &&
        !st.flags._eduWhiteCollarSeen
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "💪 强调街头工作经验也是经验",
        hint: "需魅力≥35",
        apply: function (st) {
          st.flags._eduWhiteCollarSeen = true;
          if ((st.player.charm || 0) >= 35) {
            st.flags._impressedHr = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            StateManager.addMessage(
              "💪 你用亲身经历打动了HR。她说'你的抗压能力很稀缺'——让你下周来复试。心情+10，心智+5。",
              "success",
            );
          } else {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
            StateManager.addMessage(
              "💪 你努力描述街头经验，但HR礼貌地说'回去等消息'。结果你知道——不会有了。心情-5。",
              "warning",
            );
          }
        },
      },
      {
        text: "📋 投基层岗位，从零开始",
        hint: "白白领薪起点，但稳定",
        apply: function (st) {
          st.flags._eduWhiteCollarSeen = true;
          st.flags._whiteCollarEntry = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📋 你降低身段投了基层岗位。HR说'学历不错，下一轮面试'。踏进白领世界的第一步！心情+5。",
            "success",
          );
        },
      },
      {
        text: "🚶 算了，还是做熟悉的",
        hint: "白领路暂缓",
        apply: function (st) {
          st.flags._eduWhiteCollarSeen = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "🚶 你走出了写字楼。熟悉的街头才是你的主场——但有些门推开过就不会后悔。心情-5，心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件52：副业持续经营×"规模化瓶颈" -----
  // 联动：sideHustle.active + lastActiveDay≥30 + totalEarned≥3000
  // [自洽修复] CROSS_EVENTS → RANDOM_EVENTS 直推（原为死代码）
  RANDOM_EVENTS.push({
    id: "side_hustle_scaling_crisis",
    phase: "street",
    icon: "📈",
    title: "一个人干到头了",
    story:
      "你一个人干了整整一个月，从采购到销售到售后全部自己包。\n\n生意确实在增长，但已经接近极限——你不可能同时出现在两个地方，也不可能每天只睡4小时。\n\n要么招人合伙，要么停在这条线。",
    // [自洽新增] conditions：副业活跃 + 同副业连续做≥30天 + 累计副业收入≥3000
    conditions: function (st) {
      var isActive = st.sideHustle && st.sideHustle.active;
      var isVeteran =
        ((st.sideHustle && st.sideHustle.lastActiveDay) || 0) >= 30;
      var hasEarned =
        ((st.sideHustle && st.sideHustle.totalEarned) || 0) >= 3000;
      return (
        st.player.phase === "street" &&
        isActive &&
        isVeteran &&
        hasEarned &&
        st.player.day >= 60 &&
        !st.flags._sideHustleScalingSeen
      );
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "🤝 找搭档分成合伙",
        hint: "需NPC好感≥50，长期收益×1.3",
        apply: function (st) {
          st.flags._sideHustleScalingSeen = true;
          var partner = null;
          for (var nid in st.relationships) {
            var r = st.relationships[nid];
            if (r && r.met && r.affinity >= 50) {
              partner = nid;
              break;
            }
          }
          if (partner) {
            st.flags._sideHustlePartner = partner;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            StateManager.addMessage(
              "🤝 你和" +
                partner +
                "正式开始合伙！分工经营，轻松多了。心情+10，心智+5。",
              "success",
            );
          } else {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
            StateManager.addMessage(
              "🤝 想找人合伙，但信任到能一起做生意的人还找不到。心情-5。",
              "warning",
            );
          }
        },
      },
      {
        text: "📉 稳在现有规模，挺住",
        hint: "守住果实，提升效率",
        apply: function (st) {
          st.flags._sideHustleScalingSeen = true;
          st.sideHustle.reputation = Math.min(
            100,
            (st.sideHustle.reputation || 0) + 8,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📉 你决定稳住，把现有流程做得更精细。口碑+8，心情+5。成功不一定是做大——也可以是做稳。",
            "success",
          );
        },
      },
      {
        text: "💰 硬性扩量（借¥1000加投）",
        hint: "高风险高回报",
        apply: function (st) {
          st.flags._sideHustleScalingSeen = true;
          if (Random.chance(0.6)) {
            var profit = Random.int(800, 2000);
            st.resources.cash += profit - 1000;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            StateManager.addMessage(
              "💰 赌赢了！加投¥1000入货，三天净赚¥" + profit + "。心情+8。",
              "success",
            );
          } else {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
            StateManager.addMessage(
              "💰 扩量失败，¥1000货砸在手里。心情-8。",
              "warning",
            );
          }
        },
      },
    ],
  });
  // ====== v3.52 烹饪×市场×NPC联动事件（填补cooking技能/林阿姨/陈师傅集成空白） ======

  // === 事件1：cooking技能→食材识别 ===
  // 【设计意图】cooking技能达到门槛后获得「识货」能力，让玩家感受技能成长的实用价值
  RANDOM_EVENTS.push({
    id: "cooking_market_insight",
    phase: "street",
    icon: "🔍",
    title: "菜市场的识货眼力",
    story:
      "你在菜市场闲逛，看到一个摊位的小青菜品相不错。" +
      "凭着多年的下厨经验，你发现这批菜叶梗饱满、虫眼极少，应该是今早刚摘的本地菜。\n" +
      "旁边一位大妈正在砍价：「两块五？太贵了，两块！」\n" +
      "摊主犹豫了一下——你知道这批菜值这个价。",
    conditions: function (st) {
      // 检查cooking技能≥15
      return (
        st.player &&
        st.player.day > 5 &&
        st.skills &&
        st.skills.cooking &&
        st.skills.cooking.level >= 15
      );
    },
    probability: 0.03,
    repeatable: false,
    // [自洽修复] options→choices（events_core.js 只识别 choices 字段）
    choices: [
      {
        text: "🛒 提醒大妈这菜值这个价",
        hint: "帮人识货，好感+",
        apply: function (st) {
          StateManager.addMessage(
            "🗣️ 你跟大妈说这菜是本地今早摘的，值这价。大妈半信半疑买了两斤。\n摊主冲你笑了笑——「老懂的。」社会声望+3。",
            "success",
          );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          if (st.skills.cooking) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 15;
          }
        },
      },
      {
        text: "💰 自己囤一批倒手卖",
        hint: "¥50进货，看行情",
        apply: function (st) {
          var cost = 50;
          if (st.resources.cash >= cost) {
            st.resources.cash -= cost;
            // 行情波动：60%赚，40%亏
            if (Random.chance(0.6)) {
              var profit = Random.int(30, 80);
              st.resources.cash += profit + cost;
              st.resources.totalEarned =
                (st.resources.totalEarned || 0) + profit;
              addDailyTransaction(
                st,
                "income",
                "market_flip",
                profit,
                "蔬菜倒手利润",
              );
              StateManager.addMessage(
                "🛒 你果断入手一批小青菜，转手卖给餐馆赚了¥" +
                  profit +
                  "。厨艺不仅能做饭，还能赚钱。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🛒 行情不好，小青菜砸手里了——只能自己吃掉。亏了¥" +
                  cost +
                  "，下次得看准再出手。",
                "warning",
              );
              st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 10);
            }
          } else {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            StateManager.addMessage(
              "😞 你看了看钱包，¥50都拿不出来。还是先把肚子填饱再说吧。",
              "warning",
            );
          }
        },
      },
      {
        text: "👀 看看就走，长个见识",
        hint: "无消耗，学经验",
        apply: function (st) {
          if (st.skills.cooking) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 10;
          }
          StateManager.addMessage(
            "👀 你默默记住了辨别青菜的小技巧。烹饪经验+10。好厨子都是从会买菜开始的。",
            "info",
          );
        },
      },
    ],
  });

  // === 事件2：auntie_lin好感→烹饪配方 ===
  // 【设计意图】林阿姨是菜市场摊主，cooking技能玩家与她建立关系能学到街头厨艺秘方
  RANDOM_EVENTS.push({
    id: "auntie_lin_secret_recipe",
    phase: "street",
    icon: "📜",
    title: "林阿姨的秘方",
    story:
      "收摊时分，林阿姨叫住你：「小伙子/姑娘，我看你经常自己做饭？」\n" +
      "她从围裙兜里掏出一张皱巴巴的纸：「这是我婆婆传下来的红烧肉秘方，外面吃不到这个味。」\n" +
      "你闻了闻纸上残留的香料味——八角、桂皮、还有一味说不出的香气。",
    conditions: function (st) {
      // [自洽修复] conditions 新增 auntie_lin.met + 好感≥30 + cooking≥10 检查
      return (
        st.player &&
        st.player.day > 15 &&
        st.relationships &&
        st.relationships.auntie_lin &&
        st.relationships.auntie_lin.met &&
        (st.relationships.auntie_lin.affinity || 0) >= 30 &&
        st.skills &&
        st.skills.cooking &&
        st.skills.cooking.level >= 10
      );
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "🙏 郑重收下，认真学习",
        hint: "好感+8，厨艺+30xp",
        apply: function (st) {
          st.relationships.auntie_lin.affinity = Math.min(
            100,
            (st.relationships.auntie_lin.affinity || 0) + 8,
          );
          if (st.skills.cooking) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 30;
          }
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📜 你郑重收下秘方，当天晚上就试做了。味道确实不一样——有一丝陈皮香，服了。好感+8，烹饪经验+30。",
            "success",
          );
        },
      },
      {
        text: "💡 建议林阿姨开网课教做菜",
        hint: "帮林阿姨增收",
        apply: function (st) {
          st.relationships.auntie_lin.affinity = Math.min(
            100,
            (st.relationships.auntie_lin.affinity || 0) + 5,
          );
          if (st.skills.cooking) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 15;
          }
          // 标记林阿姨的网课生意
          st.flags._auntieLinOnlineClass = true;
          // 魅力≥30时建议更有效
          var charm = st.player ? st.player.charm || 0 : 0;
          if (charm >= 30) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            StateManager.addMessage(
              "💡 林阿姨眼睛一亮：「这主意好！我女儿正好会拍视频。」\n她觉得你脑子活络，好感+5，声望+5。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "💡 林阿姨将信将疑：「网课？我年纪大了搞不懂这些……」\n但她还是把秘方给了你一份。好感+5。",
              "info",
            );
          }
        },
      },
    ],
  });

  // === 事件3：chef_chen紧急后厨——cooking技能+工作联动 ===
  // 【设计意图】chef_chen是餐馆厨师，cooking技能的玩家可以在餐馆突发需求时获得临时工作机会
  RANDOM_EVENTS.push({
    id: "chef_chen_kitchen_crisis",
    phase: "street",
    icon: "🔥",
    title: "后厨告急",
    story:
      "你路过陈师傅的餐馆，门帘一掀，陈师傅探头出来：「哎！你来得正好！」\n" +
      "他一脸焦头烂额：「今天帮厨急性肠胃炎请假了，晚上还有三桌预订。你平时不是自己做菜吗？能不能江湖救急？」\n" +
      "厨房里传来锅铲碰撞的声响和切菜声。",
    conditions: function (st) {
      // [自洽修复] conditions 新增 chef_chen.met + cooking≥15 检查
      return (
        st.player &&
        st.player.day > 20 &&
        st.relationships &&
        st.relationships.chef_chen &&
        st.relationships.chef_chen.met &&
        (st.relationships.chef_chen.affinity || 0) >= 40 &&
        st.skills &&
        st.skills.cooking &&
        st.skills.cooking.level >= 15
      );
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🔥 系上围裙上灶台",
        hint: "临时工收入+好感",
        apply: function (st) {
          var pay = Random.int(80, 150);
          var cookingLevel = st.skills.cooking
            ? st.skills.cooking.level || 0
            : 0;
          // 烹饪技能越高，陈师傅越满意
          var bonus = cookingLevel >= 30 ? Random.int(30, 60) : 0;
          st.resources.cash += pay + bonus;
          st.resources.totalEarned =
            (st.resources.totalEarned || 0) + pay + bonus;
          addDailyTransaction(
            st,
            "income",
            "temp_kitchen",
            pay + bonus,
            "陈师傅后厨帮工",
          );
          st.relationships.chef_chen.affinity = Math.min(
            100,
            (st.relationships.chef_chen.affinity || 0) + 5,
          );
          if (st.skills.cooking) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 20;
          }
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "🔥 你系上围裙，在陈师傅的指点下撑过了晚高峰。\n酬劳¥" +
              (pay + bonus) +
              "，陈师傅夸你「有点底子」。好感+5，烹饪经验+20。",
            "success",
          );
        },
      },
      {
        text: "🙅 抱歉，今晚有事来不了",
        hint: "不伤好感",
        apply: function (st) {
          st.relationships.chef_chen.affinity = Math.min(
            100,
            Math.max(0, (st.relationships.chef_chen.affinity || 0) - 1),
          );
          StateManager.addMessage(
            "🙅 陈师傅摆摆手：「没事没事，我再想想办法。」\n他转身掏出手机打给另一个朋友。你心里过意不去，但确实有事走不开。好感-1（轻微）。",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.53 联动事件扩充（3个新增）======
  // 设计意图：填补3个联动空白区——住所升级里程碑/技能协同爆发/债务危机干预

  // ----- 事件53：居住升级里程碑 — 从贫民窟到体面住所 -----
  // 联动：housing.tier 从≤2跳升到≥3 + day≥20（第一次显著改善居住条件）
  RANDOM_EVENTS.push({
    id: "housing_upgrade_milestone",
    phase: "street",
    icon: "🏠",
    title: "终于像个家了",
    story:
      "你搬进了新住处——虽然算不上豪宅，但比起之前那个四面漏风的地方，这里已经算是天堂了。\n\n有独立的卫生间、能正常锁上的门、窗户不漏风。你坐在床沿上环顾四周，忽然意识到——这是你在这座城市里第一次有了真正意义上的'住所'。",
    // [自洽新增] conditions：housing.tier从旧的低等级跳到≥3（已记录旧等级）
    conditions: function (st) {
      if (st.player.day < 20) return false;
      if (st.flags._housingUpgradeMilestoneSeen) return false;
      var curTier = (st.housing && st.housing.tier) || 0;
      var prevTier = st.flags._housingPrevTier || 0;
      // 旧等级≤2 且 新等级≥3 → 显著跳跃
      return curTier >= 3 && prevTier <= 2;
    },
    probability: 0.5, // 条件已精确，触发比例高
    repeatable: false,
    choices: [
      {
        text: "🏪 去楼下买点日用品布置房间",
        hint: "心情+12，归属感提升",
        apply: function (st) {
          st.flags._housingUpgradeMilestoneSeen = true;
          if (st.resources.cash >= 50) {
            st.resources.cash -= 50;
          }
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          StateManager.addMessage(
            "🏪 你花¥50买了拖鞋、毛巾和一盆绿植。房间虽然简陋，但布置之后有了'家'的味道。心情+12，心智+5。",
            "success",
          );
        },
      },
      {
        text: "📞 给家里打个电话说说新住处",
        hint: "精神充电，归属感",
        apply: function (st) {
          st.flags._housingUpgradeMilestoneSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "📞 你拨通了老家的电话。妈说'找了新住处就好，别老睡不好的地方'。挂了电话，你在新房间里坐了很久。心情+15，心智+3。",
            "success",
          );
        },
      },
      {
        text: "😴 洗个热水澡早点睡",
        hint: "休息恢复",
        apply: function (st) {
          st.flags._housingUpgradeMilestoneSeen = true;
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 50) + 20);
          StateManager.addMessage(
            "😴 你洗了进城以来最舒服的一个热水澡。躺在不那么硬的床上，很快就睡着了。疲劳-20，心情+8，卫生+20。",
            "success",
          );
        },
      },
    ],
  });

  // ----- 事件54：技能协同爆发 — 双技能≥40解锁复合能力 -----
  // 联动：两门关联技能同时≥40（如 repair+electrician / coding+math / cooking+sales）
  RANDOM_EVENTS.push({
    id: "skill_dual_synergy",
    phase: "street",
    icon: "⚡",
    title: "融会贯通",
    story:
      "你正在干活时突然愣了一下——刚才那个难题，你发现可以用两种方法来解决。\n\n以前你只懂其中一种，但现在两种技能在你脑子里同时浮现，互补不足。你意识到：会一门手艺是本事，会两门就是境界了。",
    // [自洽新增] conditions：任意两门关联技能同时≥40
    conditions: function (st) {
      if (st.player.day < 30) return false;
      if (st.flags._skillDualSynergySeen) return false;
      if (!st.skills) return false;
      // 定义技能协同对：repair+electrician / coding+math / cooking+sales / driving+repair
      var pairs = [
        ["repair", "electrician"],
        ["coding", "math"],
        ["cooking", "sales"],
        ["driving", "repair"],
        ["medicine", "social"],
        ["english", "coding"],
      ];
      for (var i = 0; i < pairs.length; i++) {
        var a = st.skills[pairs[i][0]];
        var b = st.skills[pairs[i][1]];
        if (a && b && a.level >= 40 && b.level >= 40) {
          st.flags._skillSynergyPair = pairs[i][0] + "_" + pairs[i][1];
          return true;
        }
      }
      return false;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🧠 认真思考两种方法结合的新可能",
        hint: "智力+2，心智+3，可能解锁新技能",
        apply: function (st) {
          st.flags._skillDualSynergySeen = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 10) + 2,
          );
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "🧠 你坐下来把两种方法对比了一遍，找到了结合点。智力+2，心智+3。有些东西不是1+1=2这么简单——它是乘法。",
            "success",
          );
        },
      },
      {
        text: "📝 把新方法记录下来",
        hint: "智力+3，以后可以教别人",
        apply: function (st) {
          st.flags._skillDualSynergySeen = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 10) + 3,
          );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "📝 你花了半小时写下心得。智力+3，名气+3。以后有人请教时，你可以直接把这个方法讲给他们。",
            "success",
          );
        },
      },
      {
        text: "😅 先把手头的活干完",
        hint: "务实，不浪费时间",
        apply: function (st) {
          st.flags._skillDualSynergySeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          StateManager.addMessage(
            "😅 你没多想，继续干活。有些顿悟不需要记在本子上——脑子已经记住了。心情+4。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件55：债务危机干预 — 长期高负债后的转折点 -----
  // 联动：debt > 15000 + day > 90 + 未处理债务标记
  RANDOM_EVENTS.push({
    id: "debt_crisis_intervention",
    phase: "street",
    icon: "💰",
    title: "债务的尽头",
    story:
      "你坐在出租屋里算了一笔账——负债已经超过¥" +
      (15000).toLocaleString() +
      "了。利息每天都在滚，催收电话一天比一天多。\n\n你翻了翻通讯录，突然想到一个人。或者在楼下贴着的社区援助公告上看到了什么。窗外这座灯火通明的城市，似乎并不在意一个人的绝望。",
    // [自洽新增] conditions：债务>15000 + day>90 + 有明确的债务标志
    conditions: function (st) {
      if (st.player.day < 90) return false;
      if (st.flags._debtCrisisSeen) return false;
      var totalDebt = (st.resources && st.resources.debt) || 0;
      return totalDebt > 15000;
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "📞 给老家打电话求助",
        hint: "得开口，但有人会帮你",
        apply: function (st) {
          st.flags._debtCrisisSeen = true;
          if (st.resources.cash >= 5000) {
            st.resources.cash -= 5000;
          }
          if (st.resources.debt) {
            st.resources.debt = Math.max(0, st.resources.debt - 8000);
          }
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          StateManager.addMessage(
            "📞 你终于拨通了家里的电话。妈沉默了很久，然后说「还差多少？家里给你想办法。」你突然就哭了——不是因为有了希望，而是因为在这个世界上还是有人在乎你的死活。债务减免¥8000，心情+5，心智+2。",
            "success",
          );
        },
      },
      {
        text: "🏛️ 去社区咨询债务重组",
        hint: "正规途径，利息减免",
        apply: function (st) {
          st.flags._debtCrisisSeen = true;
          if (st.resources.cash >= 200) {
            st.resources.cash -= 200;
          }
          if (st.resources.debt) {
            st.resources.debt = Math.max(
              0,
              Math.round(st.resources.debt * 0.7),
            );
          }
          st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          StateManager.addMessage(
            "🏛️ 你去了社区法律援助中心。一个戴眼镜的年轻人帮你梳理了债务，打电话跟三家平台谈了分期方案。利息砍掉了30%。心智+8。有困难的时候，不要觉得是自己一个人的事。",
            "success",
          );
        },
      },
      {
        text: "😤 咬牙再多打一份工",
        hint: "健康-10，心力交瘁",
        apply: function (st) {
          st.flags._debtCrisisSeen = true;
          var earn = Random.int(300, 600);
          st.resources.cash += earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          st.status.health = Math.max(0, (st.status.health || 50) - 10);
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
          StateManager.addMessage(
            "😤 你接了一份夜班兼职，连续干了一周。赚了¥" +
              earn +
              "，但身体被掏空。健康-10，疲劳+25。这不是长久之计，但至少先把眼前这关过了。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== v3.54 新激活NPC相遇事件（3个）======
  // 设计意图：为uncle_chen_bank(老陈)/sister_wu(吴姐)/brother_huang(阿黄)
  // 分别创建初始相遇事件，让这些NPC从数据定义走入玩法

  // ----- 事件56：老陈的防骗提醒（银行门前相遇）-----
  // 设计意图：在银行附近触发，建立老陈「防诈骗顾问」的人设
  RANDOM_EVENTS.push({
    id: "npc_uncle_chen_first_meet",
    phase: "street",
    icon: "👮",
    title: "银行门口的老陈",
    story:
      "你路过银行门口，一个穿保安服的大叔看了你一眼，叫住你：\n\n「小伙子，办业务呢？我看你年纪轻轻，提醒你一句——最近银行门口老有人推销高息理财，年化12%以上那种，别信，全是坑。」\n\n他指了指胸前的工牌：「我在这站了八年了，见过的套路比你吃过的盐多。」",
    // [自洽新增] conditions：在银行附近 + day≥5 + 未结识老陈
    conditions: function (st) {
      var curLoc = st.trade && st.trade.currentLocation;
      return (
        st.player.phase === "street" &&
        st.player.day >= 5 &&
        (curLoc === "bank" || curLoc === "commercialDist") &&
        (!st.relationships ||
          !st.relationships.uncle_chen_bank ||
          !st.relationships.uncle_chen_bank.met)
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🙏 谢谢叔，记下了",
        hint: "结识老陈，好感+10",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.uncle_chen_bank) {
            st.relationships.uncle_chen_bank = { affinity: 0, met: true };
          }
          st.relationships.uncle_chen_bank.met = true;
          st.relationships.uncle_chen_bank.affinity = Math.min(
            100,
            (st.relationships.uncle_chen_bank.affinity || 0) + 10,
          );
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 10) + 1,
          );
          st.flags.chenScamWarning = true;
          st.flags._uncleChenMetDay = st.player.day;
          StateManager.addMessage(
            "🙏 老陈摆摆手：「不客气，防人之心不可无。」你记住了他的忠告。结识老陈（银行保安），好感+10，智力+1。",
            "success",
          );
        },
      },
      {
        text: "😅 我哪有钱被人骗",
        hint: "自嘲，好感+3",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.uncle_chen_bank) {
            st.relationships.uncle_chen_bank = { affinity: 0, met: true };
          }
          st.relationships.uncle_chen_bank.met = true;
          st.relationships.uncle_chen_bank.affinity = Math.min(
            100,
            (st.relationships.uncle_chen_bank.affinity || 0) + 3,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          st.flags._uncleChenMetDay = st.player.day;
          StateManager.addMessage(
            "😅 老陈笑了：「也是，骗子也得挑人下手。但多个心眼总没错。」结识老陈，好感+3，心情+5。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件57：吴姐的理发店邀约（商业区相遇）-----
  // 设计意图：在商业区触发，建立吴姐「美容时尚人脉」的人设
  RANDOM_EVENTS.push({
    id: "npc_sister_wu_first_meet",
    phase: "street",
    icon: "💇",
    title: "美容院的吴姐",
    story:
      "你在商业区闲逛，经过一家美容院时，一个打扮精致的中年女人推门出来，上下打量了你一眼：\n\n「小伙子/小姑娘，找工作不？我看你形象不错，我店里正缺个前台兼助理，工资日结，包培训。要不要进来聊聊？」\n\n她递过来一张名片——「吴姐美容·形象设计」。",
    // [自洽新增] conditions：在商业区 + day≥10 + 未结识吴姐
    conditions: function (st) {
      var curLoc = st.trade && st.trade.currentLocation;
      return (
        st.player.phase === "street" &&
        st.player.day >= 10 &&
        curLoc === "commercialDist" &&
        (!st.relationships ||
          !st.relationships.sister_wu ||
          !st.relationships.sister_wu.met)
      );
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "📋 进去聊聊工作机会",
        hint: "结识吴姐，好感+8",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.sister_wu) {
            st.relationships.sister_wu = { affinity: 0, met: true };
          }
          st.relationships.sister_wu.met = true;
          st.relationships.sister_wu.affinity = Math.min(
            100,
            (st.relationships.sister_wu.affinity || 0) + 8,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          st.flags._sisterWuMetDay = st.player.day;
          StateManager.addMessage(
            "💇 你跟着吴姐进了美容院。店里装修不错，吴姐说前台月薪¥2800+提成。结识吴姐（美容院老板），好感+8，心情+6。",
            "success",
          );
        },
      },
      {
        text: "😊 收下名片，以后有需要再来",
        hint: "结识吴姐，好感+5",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.sister_wu) {
            st.relationships.sister_wu = { affinity: 0, met: true };
          }
          st.relationships.sister_wu.met = true;
          st.relationships.sister_wu.affinity = Math.min(
            100,
            (st.relationships.sister_wu.affinity || 0) + 5,
          );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          st.flags._sisterWuMetDay = st.player.day;
          StateManager.addMessage(
            "😊 你收下名片。吴姐笑着说「随时来找我」。结识吴姐，好感+5，名气+2。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件58：阿黄的急招配送员（快递站相遇）-----
  // 设计意图：在商业区/科技园触发，建立阿黄「配送站长」的人设
  RANDOM_EVENTS.push({
    id: "npc_brother_huang_first_meet",
    phase: "street",
    icon: "📦",
    title: "快递站缺人手",
    story:
      "你经过一个快递站点，门口堆满了包裹。一个满头大汗的中年男人冲出来叫住你：\n\n「兄弟！你是不是来找工作的？我这边今天爆仓了，缺人分拣和配送，日结¥200，干到晚上八点，管一顿饭！会骑电动车就行！」\n\n他指了指旁边的电动车：「不会骑也没事，我让人带你跑一单试试。」",
    // [自洽新增] conditions：在商业区 + day≥15 + 未结识阿黄
    conditions: function (st) {
      var curLoc = st.trade && st.trade.currentLocation;
      return (
        st.player.phase === "street" &&
        st.player.day >= 15 &&
        (curLoc === "commercialDist" || curLoc === "techPark") &&
        (!st.relationships ||
          !st.relationships.brother_huang ||
          !st.relationships.brother_huang.met)
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🏃 干！今天就开始",
        hint: "日结¥200，结识阿黄",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.brother_huang) {
            st.relationships.brother_huang = { affinity: 0, met: true };
          }
          st.relationships.brother_huang.met = true;
          st.relationships.brother_huang.affinity = Math.min(
            100,
            (st.relationships.brother_huang.affinity || 0) + 10,
          );
          st.resources.cash += 200;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + 200;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
          st.flags._brotherHuangMetDay = st.player.day;
          StateManager.addMessage(
            "📦 你换上工服开始分拣包裹，干到晚上八点腰酸背痛。但¥200到手，阿黄拍拍你的肩说「明天继续来！」结识阿黄（快递站长），好感+10。",
            "success",
          );
        },
      },
      {
        text: "📱 加个微信，改天来",
        hint: "结识阿黄，好感+5",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.brother_huang) {
            st.relationships.brother_huang = { affinity: 0, met: true };
          }
          st.relationships.brother_huang.met = true;
          st.relationships.brother_huang.affinity = Math.min(
            100,
            (st.relationships.brother_huang.affinity || 0) + 5,
          );
          st.flags._brotherHuangMetDay = st.player.day;
          StateManager.addMessage(
            "📱 你加了阿黄微信。他说「缺人手的时候我给你发消息」。结识阿黄，好感+5。",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.54b NPC链式后续事件（吴姐回访/阿黄内部消息）======

  // ----- 事件59：吴姐的美容展代班机会（相遇4天后）-----
  // 设计意图：让吴姐的相识不止于名片交换，产生实际工作机会
  RANDOM_EVENTS.push({
    id: "npc_sister_wu_followup",
    _isChainEvent: false,
    phase: "street",
    icon: "💄",
    title: "吴姐的邀请",
    story:
      "手机响了，是上次在美容院遇到的吴姐打来的：\n\n「喂，小XX吗？我这边周末有个美容展，我店里忙不过来，想请你来帮忙站台发传单和引导客人。一天¥180，管午饭，你要是能来我教你点美容知识。来不来？」\n\n旁边传来美容院仪器的嗡嗡声，听起来确实忙。",
    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_wu;
      return (
        st.player.phase === "street" &&
        rel &&
        rel.met &&
        !st.flags._sisterWuFollowupSeen &&
        st.player.day >= (st.flags._sisterWuMetDay || 0) + 4
      );
    },
    probability: 0.5, // 条件精确触发
    repeatable: false,
    choices: [
      {
        text: "✅ 去！发传单我也会",
        hint: "日薪¥180，结识展会人脉",
        apply: function (st) {
          st.flags._sisterWuFollowupSeen = true;
          st.resources.cash += 180;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + 180;
          addDailyTransaction(st, "income", "temp_job", 180, "吴姐美容展代班");
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          st.relationships.sister_wu.affinity = Math.min(
            100,
            (st.relationships.sister_wu.affinity || 0) + 8,
          );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "💄 你在美容展站了一天，发了几百张传单。吴姐教你认了几种美容仪器，还介绍了个客户给你认识。日薪¥180到账，名气+3，吴姐好感+8。",
            "success",
          );
        },
      },
      {
        text: "🙅 周末有安排了，下次吧",
        hint: "婉拒，好感不减",
        apply: function (st) {
          st.flags._sisterWuFollowupSeen = true;
          st.relationships.sister_wu.affinity = Math.min(
            100,
            (st.relationships.sister_wu.affinity || 0) + 2,
          );
          StateManager.addMessage(
            "🙅 你说周末有事去不了。吴姐说「没关系，下次有机会再叫你」。好感+2。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件60：阿黄的内部派件消息（结识3天后）-----
  // 设计意图：阿黄给玩家提供内部消息，建立信任关系
  RANDOM_EVENTS.push({
    id: "npc_brother_huang_followup",
    _isChainEvent: false,
    phase: "street",
    icon: "📬",
    title: "阿黄的内部消息",
    story:
      "阿黄突然给你发了条微信：「兄弟，跟你透个底——下个月平台要调整配送费规则，听说单价会涨，但考核更严了。趁现在还没变，多跑几单把数据做漂亮，到时候你评级高，单价涨得更多。」\n\n这个信息说明阿黄是真的把你当自己人了。",
    conditions: function (st) {
      var rel = st.relationships && st.relationships.brother_huang;
      return (
        st.player.phase === "street" &&
        rel &&
        rel.met &&
        (rel.affinity || 0) >= 5 &&
        !st.flags._brotherHuangTipSeen &&
        st.player.day >= (st.flags._brotherHuangMetDay || 0) + 3
      );
    },
    probability: 0.5,
    repeatable: false,
    choices: [
      {
        text: "👍 谢谢黄哥！这几天多跑几单",
        hint: "未来配送收入+15%",
        apply: function (st) {
          st.flags._brotherHuangTipSeen = true;
          st.flags._huangDeliveryBonus = true;
          st.relationships.brother_huang.affinity = Math.min(
            100,
            (st.relationships.brother_huang.affinity || 0) + 8,
          );
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 10) + 2,
          );
          StateManager.addMessage(
            "👍 你回了个「收到」，然后这几天每天多跑了几单。月底一看评级果然上去了，配送单价+15%。阿黄好感+8，智力+2。",
            "success",
          );
        },
      },
      {
        text: "📝 记下来了，改天请你吃饭",
        hint: "好感+5，信息已收到",
        apply: function (st) {
          st.flags._brotherHuangTipSeen = true;
          st.relationships.brother_huang.affinity = Math.min(
            100,
            (st.relationships.brother_huang.affinity || 0) + 5,
          );
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 10) + 1,
          );
          StateManager.addMessage(
            "📝 你把这事记在心里。阿黄说「好，记着你欠我一顿饭」。好感+5，智力+1。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件61：老陈的内部消息（结识5天后）-----
  // 设计意图：老陈给玩家透露银行招聘信息，建立长期人脉价值
  RANDOM_EVENTS.push({
    id: "npc_uncle_chen_followup",
    phase: "street",
    icon: "🏦",
    title: "老陈的消息",
    story:
      "你路过银行时，老陈冲你招了招手，压低声音说：\n\n「我听说下个月分行要招两个大堂助理，工资¥3500起步，五险一金齐全。我看你人实在，要是感兴趣我帮你递份简历进去。」\n\n他拍了拍你的肩膀：「这机会难得，内部招聘，外面不挂网。」",
    conditions: function (st) {
      var rel = st.relationships && st.relationships.uncle_chen_bank;
      return (
        st.player.phase === "street" &&
        rel &&
        rel.met &&
        (rel.affinity || 0) >= 5 &&
        !st.flags._uncleChenFollowupSeen &&
        st.player.day >= (st.flags._uncleChenMetDay || 0) + 5
      );
    },
    probability: 0.5,
    repeatable: false,
    choices: [
      {
        text: "📋 太谢谢了！我准备简历",
        hint: "未来银行职位候选资格",
        apply: function (st) {
          st.flags._uncleChenFollowupSeen = true;
          st.flags._chenBankJobLead = true;
          st.relationships.uncle_chen_bank.affinity = Math.min(
            100,
            (st.relationships.uncle_chen_bank.affinity || 0) + 10,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "📋 老陈摆摆手：「简历给我就行，我帮你递到人事科。能不能成看你自己了，但至少能进面试。」老陈好感+10，心情+8，名气+3。",
            "success",
          );
        },
      },
      {
        text: "🙏 谢谢陈叔，我暂时还不考虑",
        hint: "婉拒，好感+5",
        apply: function (st) {
          st.flags._uncleChenFollowupSeen = true;
          st.relationships.uncle_chen_bank.affinity = Math.min(
            100,
            (st.relationships.uncle_chen_bank.affinity || 0) + 5,
          );
          StateManager.addMessage(
            "🙏 老陈点点头：「行，那等你想来了跟我说一声就行。」老陈好感+5。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件62：下雪天的温暖（snowy 天气事件）-----
  // 设计意图：填补 snowy 天气的零事件覆盖，让每种天气都有对应的叙事回响
  RANDOM_EVENTS.push({
    id: "snowy_day_warmth",
    phase: "street",
    icon: "❄️",
    title: "下雪了",
    story:
      "窗外飘起了雪花，街上行人匆匆。你呼出一口白气，看着雪花落在手心里融化。\n\n街角卖红薯的大爷今天早早就收摊了，他走之前冲你喊了一声：\n\n「小伙子，天冷别在外面晃了，早点回去吧！」",
    // [自洽新增] conditions：下雪天气 + day≥5
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.weather &&
        st.weather.current === "snowy" &&
        st.player.day >= 5 &&
        !st.flags._snowyDaySeen
      );
    },
    probability: 0.08,
    repeatable: false,
    choices: [
      {
        text: "🍠 买个烤红薯暖暖手（¥10）",
        hint: "心情+8，饥饱+10",
        apply: function (st) {
          st.flags._snowyDaySeen = true;
          if (st.resources.cash >= 10) {
            st.resources.cash -= 10;
          }
          st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 10);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "🍠 红薯又甜又烫，捂在手里整个人都暖和了。心情+8，饥饱+10。",
            "success",
          );
        },
      },
      {
        text: "📸 拍张雪景发朋友圈",
        hint: "名气+3，记录这一刻",
        apply: function (st) {
          st.flags._snowyDaySeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📸 你拍了张雪景发到朋友圈。老家的朋友留言说「真好看」，城里的朋友说「冻死了」。名气+3，心情+5。",
            "info",
          );
        },
      },
      {
        text: "🏃 趁人少赶紧出门干活",
        hint: "体力活收入稍高，耗更多体力",
        apply: function (st) {
          st.flags._snowyDaySeen = true;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          StateManager.addMessage(
            "🏃 你裹紧外套出了门。雪天路上人少，但活还是要干。疲劳+5，心情-3。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件63：大风天的意外收获（windy 天气事件）-----
  // 设计意图：填补 windy 天气的零事件覆盖，完成全部天气类型的叙事闭环
  RANDOM_EVENTS.push({
    id: "windy_day_finding",
    phase: "street",
    icon: "🌬️",
    title: "大风天",
    story:
      "今天风特别大，街上的塑料袋和纸屑在空中乱飞。你眯着眼睛走在路上，突然看到一张废纸被吹到脚边——上面印着什么。\n\n捡起来一看，是一张被风吹散的招聘传单，地址就在附近。风太大，你差点没抓住它。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.weather &&
        st.weather.current === "windy" &&
        st.player.day >= 3 &&
        !st.flags._windyDaySeen
      );
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "📋 看看传单上的招聘信息",
        hint: "可能发现工作机会",
        apply: function (st) {
          st.flags._windyDaySeen = true;
          st.flags._windyJobLead = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.resources.cash < 500) {
            st.resources.cash += 50;
            addDailyTransaction(
              st,
              "income",
              "job_income",
              50,
              "大风天的意外发现",
            );
          }
          StateManager.addMessage(
            "🌬️ 传单上写着附近一家餐馆招杂工，工资日结。你拍了张照记下地址。心情+5。也许这阵风是来给你送机会的。",
            "success",
          );
        },
      },
      {
        text: "🏃 赶紧找个地方躲风",
        hint: "保护健康",
        apply: function (st) {
          st.flags._windyDaySeen = true;
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "🏃 你躲进一家便利店避风。买了瓶热饮，隔着玻璃看外面的落叶被吹得打转。疲劳-5，心情+3。",
            "info",
          );
        },
      },
      {
        text: "😤 顶着风继续干活",
        hint: "收入略低但坚持",
        apply: function (st) {
          st.flags._windyDaySeen = true;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          StateManager.addMessage(
            "😤 你裹紧了外套继续干活。风大到有时候站不稳，但今天不能白过。疲劳+8，心情-3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.53: 休眠NPC激活事件 — 王医生/赵师傅（填补0事件空白） ======

  // === 事件1：dr_wang — 医院的超出诊疗费帮扶 ===
  // 【设计意图】王医生是医院NPC但零事件。让他在玩家健康垂危时提供医疗帮扶
  RANDOM_EVENTS.push({
    id: "dr_wang_free_clinic",
    phase: "street",
    icon: "🩺",
    title: "王医生的免费门诊",
    story:
      "你到医院做检查，发现挂号窗口前排着长队。" +
      "正在这时，一个穿白大褂的中年医生推门出来看到你：「脸色不太好，进来我看看。」\n" +
      "他把你领进诊室，仔细问了你的症状，眉头皱了皱：" +
      "「你是不是很久没吃过像样的饭了？肝火旺，脾胃虚。」",
    conditions: function (st) {
      // [自洽修复] st.needs.health 不存在（state.needs 无 health 字段），改为 st.status.health
      var health = st.status ? st.status.health || 100 : 100;
      var fatigue = st.needs ? st.needs.fatigue || 0 : 0;
      return st.player && st.player.day > 10 && health < 60 && fatigue > 40;
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      {
        text: "🙏 谢谢医生，听您的建议",
        hint: "健康+10，开便宜药",
        apply: function (st) {
          // [自洽修复] st.needs.health → st.status.health
          var health = st.status.health || 50;
          st.status.health = Math.min(100, health + 10);
          if (st.resources.cash >= 30) {
            st.resources.cash -= 30;
            // 温和消炎+调理，健康再加5
            st.status.health = Math.min(100, (st.status.health || 50) + 5);
            addDailyTransaction(
              st,
              "expense",
              "medical",
              30,
              "王医生开的便宜药",
            );
          }
          // 建立王医生关系
          if (!st.relationships.dr_wang)
            st.relationships.dr_wang = { affinity: 0, met: true };
          st.relationships.dr_wang.affinity = Math.min(
            100,
            (st.relationships.dr_wang.affinity || 0) + 5,
          );
          st.relationships.dr_wang.met = true;
          StateManager.addMessage(
            "🩺 王医生给你开了¥30的药，叮嘱你注意饮食规律。健康+15。医者仁心。",
            "success",
          );
        },
      },
      {
        text: "😅 我没事，就是没钱看病",
        hint: "只说实情，好感+3",
        apply: function (st) {
          if (!st.relationships.dr_wang)
            st.relationships.dr_wang = { affinity: 0, met: true };
          st.relationships.dr_wang.affinity = Math.min(
            100,
            (st.relationships.dr_wang.affinity || 0) + 3,
          );
          st.relationships.dr_wang.met = true;
          st.status.health = Math.min(100, (st.status.health || 50) + 3);
          StateManager.addMessage(
            "😅 王医生笑了笑：「没钱更要保重身体，生病更烧钱。」\n他给你倒了杯热水，「免费热水总能喝。」健康+3。",
            "info",
          );
        },
      },
    ],
  });

  // === 事件2：master_zhao — 工厂区修车铺的招工 ===
  // 【设计意图】赵师傅是工厂区修车铺但零事件。让有修理技能的玩家获得工作线索
  RANDOM_EVENTS.push({
    id: "master_zhao_tool_help",
    phase: "street",
    icon: "🔧",
    title: "赵师傅的维修摊",
    story:
      "路过工厂区修车铺时，你看见一个满手油污的中年师傅正在对着一台发动机发愁。" +
      "他抬头看见你：「小伙子/姑娘，你会不会修车？这发动机异响，我耳朵不行了听不出来。」\n" +
      "铺子门口摆着几辆修了一半的电动车，地上散落着扳手和螺丝。",
    conditions: function (st) {
      // [自洽修复] conditions 新增 repair.skill 检查，赵师傅是修车铺老板
      return (
        st.player &&
        st.player.day > 15 &&
        st.skills &&
        st.skills.repair &&
        st.skills.repair.level >= 5
      );
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🔧 我来听听——好像是轴承问题",
        hint: "修理≥20效果最佳",
        apply: function (st) {
          if (!st.relationships.master_zhao)
            st.relationships.master_zhao = { affinity: 0, met: true };
          st.relationships.master_zhao.affinity = Math.min(
            100,
            (st.relationships.master_zhao.affinity || 0) + 8,
          );
          st.relationships.master_zhao.met = true;
          var repairLevel = st.skills.repair ? st.skills.repair.level || 0 : 0;
          if (repairLevel >= 20) {
            st.resources.cash += 80;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + 80;
            addDailyTransaction(
              st,
              "income",
              "repair_help",
              80,
              "赵师傅修车帮工",
            );
            if (st.skills.repair)
              st.skills.repair.xp = (st.skills.repair.xp || 0) + 40;
            StateManager.addMessage(
              "🔧 你听出发动机异响来自左轴承。赵师傅一拍大腿：「对上了！」\n他塞给你¥80，说以后有空来帮忙。好感+8，修理经验+40。",
              "success",
            );
          } else {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (st.skills.repair)
              st.skills.repair.xp = (st.skills.repair.xp || 0) + 15;
            StateManager.addMessage(
              "🔧 你不太确定是哪里的问题，但赵师傅说你愿意帮忙的心意不错。\n他简单教了你几个听异响的技巧。好感+8，修理经验+15。",
              "info",
            );
          }
        },
      },
      {
        text: "🔩 帮您递工具打下手",
        hint: "修理XP+15",
        apply: function (st) {
          if (!st.relationships.master_zhao)
            st.relationships.master_zhao = { affinity: 0, met: true };
          st.relationships.master_zhao.affinity = Math.min(
            100,
            (st.relationships.master_zhao.affinity || 0) + 5,
          );
          st.relationships.master_zhao.met = true;
          if (st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 15;
          StateManager.addMessage(
            "🔩 你帮赵师傅递工具、扶发动机，虽然没直接上手修，但也学到了不少。\n修理经验+15。赵师傅说：「下次有空再来！」",
            "info",
          );
        },
      },
      {
        text: "🙅 不好意思，我赶时间",
        hint: "无变化",
        apply: function (st) {
          StateManager.addMessage(
            "🙅 赵师傅摆摆手：「没事，我自己再研究研究。」\n你继续赶路，心里想着下次有空再帮忙。",
            "info",
          );
        },
      },
    ],
  });

  // === 事件3：xiaoli — 科技园网红的内容合作邀请 ===
  // 【设计意图】小丽是科技园网红但事件引用为0。连接fame+名气系统+sideHustle
  RANDOM_EVENTS.push({
    id: "xiaoli_content_collab",
    phase: "street",
    icon: "📱",
    title: "小丽的合作邀请",
    story:
      "小丽急匆匆跑来找你：「救命！我接了个品牌合作，今天要拍一条探店视频。" +
      "但我一个人搞不定——需要个人帮忙举打光灯和提词！」\n" +
      "她递给你一台便携补光灯：「就两小时，完事请你吃饭！」",
    conditions: function (st) {
      // 小丽NPC已触发过或玩家fame≥5有一定社交影响力
      return (
        st.player &&
        st.player.day > 20 &&
        ((st.player.fame || 0) >= 5 ||
          (st.skills && st.skills.sales && st.skills.sales.level >= 10))
      );
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "📱 帮你拍！我正好有空",
        hint: "收入+名气+社交",
        apply: function (st) {
          if (!st.relationships.xiaoli)
            st.relationships.xiaoli = { affinity: 0, met: true };
          st.relationships.xiaoli.affinity = Math.min(
            100,
            (st.relationships.xiaoli.affinity || 0) + 8,
          );
          st.relationships.xiaoli.met = true;
          var pay = Random.int(60, 120);
          st.resources.cash += pay;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + pay;
          addDailyTransaction(
            st,
            "income",
            "content_collab",
            pay,
            "小丽拍摄帮工",
          );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "📱 你帮小丽举了两小时补光灯，视频拍得很顺利。\n小丽请你吃了碗牛肉面，还把你介绍给她的粉丝群。收入¥" +
              pay +
              "，声望+3。",
            "success",
          );
        },
      },
      {
        text: "💡 我帮你联系专业摄影师",
        hint: "好感+5",
        apply: function (st) {
          if (!st.relationships.xiaoli)
            st.relationships.xiaoli = { affinity: 0, met: true };
          st.relationships.xiaoli.affinity = Math.min(
            100,
            (st.relationships.xiaoli.affinity || 0) + 5,
          );
          st.relationships.xiaoli.met = true;
          if (st.skills && st.skills.sales) {
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 15;
          }
          StateManager.addMessage(
            "💡 你帮小丽联系到业余摄影爱好者群里的一个人。\n小丽感激地说「谢啦！下次请你喝奶茶！」好感+5。",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.54 新增：连续工作社区认可 ======
  // 【设计意图】填补工作连击系统（v3.25）的叙事空白——50天连续工作应产生叙事回响
  RANDOM_EVENTS.push({
    id: "work_streak_community_recognition",
    phase: "street",
    icon: "🏅",
    title: "老面孔",
    story:
      "你回过头想想，已经连续在这座城市里忙了快两个月没断过。" +
      "早餐摊大姐往你碗里多加了勺肉：「天天看你准时来，比闹钟还准。」" +
      "旁边的大爷接话：「年轻人能吃苦，这城里就有你一口饭。」" +
      "你不知道该说什么，低头扒完了那碗面。",
    conditions: function (st) {
      var streaks = st.flags && st.flags._jobStreaks;
      var maxStreak = 0;
      if (streaks) {
        for (var k in streaks) {
          var rec = streaks[k];
          var c =
            rec && typeof rec === "object"
              ? rec.count || 0
              : typeof rec === "number"
                ? rec
                : 0;
          if (c > maxStreak) maxStreak = c;
        }
      }
      return (
        st.player.phase === "street" &&
        maxStreak >= 50 &&
        !st.flags._workStreakRecognitionSeen
      );
    },
    probability: 0.1,
    repeatable: false,
    choices: [
      {
        text: "😌 心里一暖——坚持是值得的",
        hint: "心情+12，心智+3",
        apply: function (st) {
          st.flags._workStreakRecognitionSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "🏅 你吃完那碗面，觉得今天的活格外有劲。心情+12，心智+3。这座城市开始认识你了。",
            "success",
          );
        },
      },
      {
        text: "💪 这才哪到哪，我还要往上走",
        hint: "心智+5，激励",
        apply: function (st) {
          st.flags._workStreakRecognitionSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "💪 你谢过大姐，心里默默定了个小目标。心智+5，名气+3。这座城市会记住你的名字的。",
            "success",
          );
        },
      },
      {
        text: "😐 习惯了，没什么特别的",
        hint: "适应也是一种成长",
        apply: function (st) {
          st.flags._workStreakRecognitionSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
          StateManager.addMessage(
            "😐 你摆摆手，照常吃完去干活。适应意味着成长——你已经在不知不觉中变强了。心智+2。",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.54 新增：技能组合精通 ======
  // 【设计意图】填补多技能协同的叙事空白——修理+电工都≥20级的玩家应获得"双料师傅"认可
  RANDOM_EVENTS.push({
    id: "skill_mastery_side_opportunity",
    phase: "street",
    icon: "⚡",
    title: "双料师傅",
    story:
      "你在工厂区帮人修好了一台机器，旁边一个设备商老板看了全程。" +
      "他递了根烟：「小伙子，你不仅会修，还懂电路——这种双料师傅我们正缺。」" +
      "他掏出名片：「我们有个小区水电维护的兼职，月结¥1200，每周去两次就够。有空来试试？」",
    conditions: function (st) {
      var rep = st.skills && st.skills.repair ? st.skills.repair.level || 0 : 0;
      var elec =
        st.skills && st.skills.electrician
          ? st.skills.electrician.level || 0
          : 0;
      return (
        st.player.phase === "street" &&
        rep >= 20 &&
        elec >= 20 &&
        st.player.day >= 40 &&
        !st.flags._skillMasteryOppSeen
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "✅ 接下兼职！技多不压身",
        hint: "月入¥1200固定副业",
        apply: function (st) {
          st.flags._skillMasteryOppSeen = true;
          st.flags._skillMasterySideJob = true;
          if (!st.sideHustle) st.sideHustle = {};
          st.sideHustle.type = "freelance";
          st.resources.cash += 600;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + 600;
          if (st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 30;
          if (st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 30;
          StateManager.addMessage(
            "⚡ 你接了小区水电维护的活。双料师傅走到哪里都有人要，预付¥600到手！修理和电工经验各+30。",
            "success",
          );
        },
      },
      {
        text: "🤔 先留下名片，考虑考虑",
        hint: "保留机会",
        apply: function (st) {
          st.flags._skillMasteryOppSeen = true;
          st.flags._skillMasteryKeptCard = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "⚡ 你收好名片。双料师傅不愁没活干——你知道自己值什么价。心智+3。",
            "info",
          );
        },
      },
      {
        text: "🙏 婉拒了，我现在够忙了",
        hint: "专注现有工作",
        apply: function (st) {
          st.flags._skillMasteryOppSeen = true;
          StateManager.addMessage(
            "🙏 你谢过老板，说现在手上的活已经够忙了。他点头：「有技术的人，什么时候想干都行。」",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.54 新增：住房升级里程碑叙事 ======
  // 【设计意图】填补住所升级的叙事空白——从露宿→合租或合租→单间应有情感回响
  RANDOM_EVENTS.push({
    id: "housing_tier_milestone_reflection",
    phase: "street",
    icon: "🏠",
    title: "一扇属于自己的门",
    story:
      "搬进新住处好几天了，你才真正有时间打量这间屋子。" +
      "墙上有上一任租客留下的贴纸，窗外能看到街道。" +
      "最重要的是——这扇门可以从里面锁上。" +
      "你坐在床沿上，突然意识到自己在这座城市里，终于有了一小块属于自己的地方。",
    conditions: function (st) {
      var tier = st.housing && st.housing.tier;
      return (
        st.player.phase === "street" &&
        tier >= 2 &&
        st.player.day >= 20 &&
        !st.flags._housingMilestoneSeen
      );
    },
    probability: 0.15,
    repeatable: false,
    choices: [
      {
        text: "🏠 给家里打个电话报平安",
        hint: "心情+15，家庭关系+",
        apply: function (st) {
          st.flags._housingMilestoneSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "🏠 电话那头，妈妈说「找个稳定的住处就好，别太亏待自己」。心情+15，心智+5。不管走多远，家永远是后盾。",
            "success",
          );
        },
      },
      {
        text: "📝 拍张照发朋友圈",
        hint: "记录这一刻",
        apply: function (st) {
          st.flags._housingMilestoneSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          StateManager.addMessage(
            "📝 你拍了张窗外的街景发出去。老家的朋友点了赞，城里的工友调侃你「混好了」。心情+8，名气+2。",
            "success",
          );
        },
      },
      {
        text: "😶 没什么了不起的，继续赶路",
        hint: "不骄不躁，心智+",
        apply: function (st) {
          st.flags._housingMilestoneSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 4);
          StateManager.addMessage(
            "😶 你收起感概，把钥匙挂好。这才哪到哪——你要的远不止一个单间。心智+4。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 联动事件恢复（v3.59/v3.60 自洽审计 + 联动事件，从重构中还原）======
  RANDOM_EVENTS.push({
    id: "morality_wallet_honest",
    phase: "street",
    icon: "👛",
    title: "捡到钱包",
    story:
      "你在巷口捡到一个钱包，里面夹着¥800现金和一张写满字迹的身份证。\n" +
      "失主大概急疯了——你摸出手机，犹豫了一瞬。",
    // conditions：高道德玩家（人设分叉·诚信侧），与 low 侧互斥
    conditions: function (st) {
      // 检查玩家道德值是否达到诚信门槛
      var m = st.player && st.player.morality;
      return typeof m === "number" && m >= 70;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "📞 按身份证地址找失主",
        hint: "道德+，声望+",
        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          StateManager.addMessage(
            "📞 你辗转联系上失主，是个外地打工的姑娘。她红着眼眶要塞给你¥100谢礼，你没收。道德+5，声望+4。",
            "success",
          );
        },
      },
      {
        text: "🏢 交到派出所",
        hint: "稳妥，道德+",
        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          StateManager.addMessage(
            "🏢 你把钱包交到辖区派出所，民警登记时多看了你一眼：「现在这样的人不多了。」道德+3。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "morality_wallet_keep",
    phase: "street",
    icon: "💰",
    title: "捡到钱包",
    story:
      "你在巷口捡到一个钱包，里面夹着¥800现金和一张身份证。\n" +
      "四下无人——这钱够你撑过这个月了。你心跳加快，手指攥紧了皮夹。",
    // conditions：低道德玩家（人设分叉·利己侧），与 high 侧互斥
    conditions: function (st) {
      // 检查玩家道德值是否跌破利己门槛
      var m = st.player && st.player.morality;
      return typeof m === "number" && m <= 30;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "😏 现金拿走，证件扔了",
        hint: "现金+，道德-",
        apply: function (st) {
          st.resources.cash += 800;
          st.resources.totalEarned += 800;
          st.player.morality = Math.max(0, (st.player.morality || 50) - 8);
          StateManager.addMessage(
            "😏 你抽走¥800，把空钱包连同身份证扔进垃圾桶。当晚睡得不太踏实。现金+¥800，道德-8。",
            "warning",
          );
        },
      },
      {
        text: "🤔 留着，但有点不安",
        hint: "折中，道德微-",
        apply: function (st) {
          st.resources.cash += 800;
          st.resources.totalEarned += 800;
          st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
          StateManager.addMessage(
            "🤔 你留下了钱，却总想起那张身份证。现金+¥800，但心里堵得慌，心情-5，道德-3。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "hunger_streak_neighbor_meal",
    phase: "street",
    icon: "🍚",
    title: "邻居的一碗饭",
    story:
      "你连着几天没正经吃过饭，在路边蹲着时眼前一阵发黑。\n" +
      "卖煎饼的摊主老姐头探出头：「小伙子，看你脸色不对，这俩煎饼叔请了。」",
    // conditions：低饥饿连续天数达到爆发阈值（flags._habits.lowHungerStreak）
    conditions: function (st) {
      // 检查连续饥饿天数是否≥3
      var streak =
        st.flags && st.flags._habits && st.flags._habits.lowHungerStreak;
      return (streak || 0) >= 3 && st.player.phase === "street";
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🍚 接过煎饼，道谢",
        hint: "饱食+，心情+",
        apply: function (st) {
          st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 40);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          StateManager.addMessage(
            "🍚 你接过还烫手的煎饼，狼吞虎咽。一股暖意从胃里升起来。饱食+40，心情+8。",
            "success",
          );
        },
      },
      {
        text: "🙅 倔强推辞",
        hint: "自尊，但更虚",
        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
          StateManager.addMessage(
            "🙅 你逞强推了，转身却腿一软。有些尊严，是空肚子撑不起的。心情+3，疲劳+5。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "coding_scam_spot",
    phase: "street",
    icon: "💻",
    title: "刷单短信",
    story:
      "手机弹出一条短信：「亲，刷单返利轻松日入500，加微信xxx领任务」。\n" +
      "你扫了一眼那个仿冒得拙劣的链接结构——跳转域名、伪造备案号——立刻断定是钓鱼。",
    // conditions：编程技能达到专业视角门槛（能识别骗局）
    conditions: function (st) {
      // 检查 coding 技能等级是否解锁「识骗」视角
      var lvl = st.skills && st.skills.coding && st.skills.coding.level;
      return (lvl || 0) >= 40;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🚫 举报并拉黑",
        hint: "道德+，技能+",
        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 50) + 4);
          if (st.skills && st.skills.coding) {
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 20;
          }
          StateManager.addMessage(
            "🚫 你顺手把号码举报到反诈平台，顺带给家里群发了提醒。技能+20xp，道德+4。",
            "success",
          );
        },
      },
      {
        text: "🕵️ 反向试探骗子",
        hint: "冒险，可能反被坑",
        apply: function (st) {
          if (Random.chance(0.5)) {
            st.resources.cash += 100;
            if (st.skills && st.skills.coding) {
              st.skills.coding.xp = (st.skills.coding.xp || 0) + 30;
            }
            StateManager.addMessage(
              "🕵️ 你用脚本反查到骗子服务器漏洞，顺手薅了¥100「学费」。技能+30xp，现金+¥100。",
              "event",
            );
          } else {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
            StateManager.addMessage(
              "🕵️ 你刚试探两下就被对方拉黑，还差点中了木马。没赚到，反而后怕。心情-5。",
              "warning",
            );
          }
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "xiaoli_brand_deal",
    phase: "street",
    icon: "🤝",
    title: "小丽的品牌单",
    story:
      "小丽发来语音：「有个国货护肤品牌找长期代运营，我推荐了你。\n" +
      "他们要的不只是剪辑，是懂内容的人。报酬按月¥3000-5000，你接不接？」",
    // conditions：已结识小丽且好感达到深度合作门槛（联动 relationships 系统）
    conditions: function (st) {
      // 检查是否已结识小丽且好感≥60
      var rel = st.relationships && st.relationships.xiaoli;
      return !!(rel && rel.met && (rel.affinity || 0) >= 60);
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "✅ 接下长期代运营",
        hint: "稳定月入+声望",
        apply: function (st) {
          st.flags._xiaoliBrandDeal = true;
          var pay = Random.int(3000, 5000);
          st.resources.cash += pay;
          st.resources.totalEarned += pay;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          if (st.relationships.xiaoli) {
            st.relationships.xiaoli.affinity = Math.min(
              100,
              st.relationships.xiaoli.affinity + 5,
            );
          }
          StateManager.addMessage(
            "✅ 你和品牌签了月框。第一笔¥" +
              pay +
              "到账，小丽在群里@你：「靠谱！」声望+6，好感+5。",
            "success",
          );
        },
      },
      {
        text: "🤝 先接一单试试",
        hint: "低风险试探",
        apply: function (st) {
          st.flags._xiaoliBrandTrial = true;
          var pay2 = Random.int(800, 1500);
          st.resources.cash += pay2;
          st.resources.totalEarned += pay2;
          StateManager.addMessage(
            "🤝 你接了试单，交付后品牌方挺满意。先赚¥" + pay2 + "，看看后续。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "bank_vip_treatment",
    phase: "street",
    icon: "🏦",
    title: "VIP客户室",
    story:
      "你走进银行办业务，大堂经理看了一眼你的叫号单，忽然压低声音：\n" +
      "「先生/女士，您在我们行的日均存款已超过¥5000，可以进VIP室办理。」\n" +
      "你被请进一间有沙发和饮水机的小房间。客户经理递上一张名片：\n" +
      "「我们有一款新出的VIP理财，年化4.2%，额度有限。另外您的信用记录可以申请¥30,000以内的消费贷，利率优惠。」",
    conditions: function (st) {
      // 在银行且存款≥5000（达标VIP门槛）
      var bankBalance = st.resources && st.resources.bankBalance;
      return (
        st.player &&
        st.player.phase === "street" &&
        st.player.day >= 20 &&
        (bankBalance || 0) >= 5000 &&
        !st.flags._bankVipSeen
      );
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "💰 买¥5000理财（年化4.2%）",
        hint: "30天后增值，中风险",
        cost: 5000,
        apply: function (st) {
          st.flags._bankVipSeen = true;
          st.flags._bankVipInvested = true;
          st.flags._bankVipDay = st.player.day;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5000);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          StateManager.addMessage(
            "💰 你买了¥5000的VIP理财，30天后本息共计¥5210到账。\n" +
              "客户经理笑着说：「有眼光。」心情+5。",
            "success",
          );
        },
      },
      {
        text: "📋 了解一下贷款额度",
        hint: "信用记录+，了解贷款条件",
        apply: function (st) {
          st.flags._bankVipSeen = true;
          st.flags._bankVipLoanKnown = true;
          st.player.mental = Math.min(100, (st.player.mental || 20) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
          StateManager.addMessage(
            "📋 客户经理详细解释了贷款条件：¥30,000以内，月息0.45%，随借随还。\n" +
              "你心里有底了——缺钱的时候知道该找谁。心智+2，心情+3。",
            "info",
          );
        },
      },
      {
        text: "🚶 存钱只是为了安全，不搞这些",
        hint: "保守，但心里踏实",
        apply: function (st) {
          st.flags._bankVipSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
          StateManager.addMessage(
            "🚶 你谢过经理，在普通窗口办完业务就走了。\n" +
              "VIP室里的沙发确实舒服——但你知道，真正的安全感来自于卡里的数字，而不是理财产品的承诺。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "regular_customer_discount",
    phase: "street",
    icon: "🛒",
    title: "老主顾的优待",
    story:
      "你走进那家经常光顾的小店，老板抬头看见你，熟稔地招呼：\n" +
      "「又来啦？今天新到了一批好货，我给你留着呢。」\n" +
      "他压低声音：「其他人我卖¥15，你给¥10就行——老主顾了。」\n" +
      "你经常来这儿买东西，老板都认得你了。",
    conditions: function (st) {
      // 检查 trade 行动频次是否≥10（在任何地点累计购买）
      var freq = st.stats && st.stats.actionFreq;
      var totalTrade = 0;
      if (freq) {
        for (var k in freq) {
          // 累加所有交易类行动（buy/start_business/food_stall等）
          if (k.indexOf("buy") >= 0 || k.indexOf("trade") >= 0) {
            totalTrade += freq[k] || 0;
          }
        }
      }
      return (
        st.player &&
        st.player.phase === "street" &&
        st.player.day >= 15 &&
        totalTrade >= 10 &&
        !st.flags._regularDiscountSeen
      );
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "👍 谢了老板！那我多买点",
        hint: "打折购物，好感+",
        apply: function (st) {
          st.flags._regularDiscountSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          if (st.skills && st.skills.sales) {
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 10;
          }
          StateManager.addMessage(
            "👍 你多挑了几样东西，老板果然按¥10算了。\n" +
              "走的时候他还塞了一把葱：「拿回去下面吃！」声望+2，心情+8，销售经验+10。",
            "success",
          );
        },
      },
      {
        text: "🙏 老板记着账，月底一起结",
        hint: "赊账，月底自动扣",
        apply: function (st) {
          st.flags._regularDiscountSeen = true;
          st.flags._regularCredit = true;
          st.flags._regularCreditDay = st.player.day;
          StateManager.addMessage(
            "🙏 老板爽快答应：「行，月底再说。你常来，我信得过。」\n" +
              "在这座城市，能被一个人信任的感觉真好。",
            "info",
          );
        },
      },
      {
        text: "😊 跟老板聊几句再走",
        hint: "好感+，可能获得情报",
        apply: function (st) {
          st.flags._regularDiscountSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 20) + 1);
          if (Random.chance(0.3)) {
            st.flags._regularShopTip = true;
            StateManager.addMessage(
              "😊 你跟老板聊了会儿天，他无意中透露：「听说对面那条街要开夜市了，\n" +
                "摊位费前三个月免费。」这可能是个机会！心情+5，心智+1。",
              "event",
            );
          } else {
            StateManager.addMessage(
              "😊 你跟老板聊了会儿天，才知道他也是外地来的，在这条街干了八年。\n" +
                "他说：「这城市啊，待久了就是家了。」心情+5。",
              "info",
            );
          }
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "skill_synergy_restaurant_offer",
    phase: "street",
    icon: "🍳",
    title: "老板想合伙",
    story:
      "你常去的那家小炒店里，老板老黄端着两杯茶坐下来。\n" +
      "「我观察你很久了——你懂吃，又会跟客人聊天。我这家店生意一直不错，但一个人撑太累了。」\n" +
      "他压低声音：「我在对面街看中一个铺面，想开分店。你出手艺+管店，我出钱+供应链，五五分。」",
    conditions: function (st) {
      // 烹饪≥20 且 销售≥10 → 双重门槛协同
      var cooking = st.skills && st.skills.cooking && st.skills.cooking.level;
      var sales = st.skills && st.skills.sales && st.skills.sales.level;
      return (
        st.player &&
        st.player.phase === "street" &&
        st.player.day >= 30 &&
        (cooking || 0) >= 20 &&
        (sales || 0) >= 10 &&
        !st.flags._skillSynergyRestaurantSeen
      );
    },
    probability: 0.015,
    repeatable: false,
    choices: [
      {
        text: "🤝 接受合伙！我来管店",
        hint: "获得稳定分红+技能成长",
        apply: function (st) {
          st.flags._skillSynergyRestaurantSeen = true;
          st.flags._restaurantPartner = true;
          var invest = 3000;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - invest);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          st.player.mental = Math.min(100, (st.player.mental || 20) + 5);
          // 烹饪和销售技能同步成长
          if (st.skills && st.skills.cooking) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 40;
          }
          if (st.skills && st.skills.sales) {
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 30;
          }
          StateManager.addMessage(
            "🤝 你出了¥" +
              invest +
              "当押金，正式成为合伙人。\n" +
              "老黄拍着你肩膀：「我看人不会错。」声望+8，心智+5，烹饪经验+40，销售经验+30。",
            "success",
          );
        },
      },
      {
        text: "😅 我经验还不够，怕拖累你",
        hint: "婉拒，技能仍获认可",
        apply: function (st) {
          st.flags._skillSynergyRestaurantSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          st.player.mental = Math.min(100, (st.player.mental || 20) + 3);
          if (st.skills && st.skills.cooking) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 15;
          }
          StateManager.addMessage(
            "😅 你诚实地说自己还欠火候。老黄点点头：「有自知之明的人，迟早能成事。」\n烹饪经验+15，心情+8，心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 工业区事件 ======
  RANDOM_EVENTS.push({
    id: "factory_night_shift_offer",
    phase: "street",
    icon: "🏭",
    title: "夜班加急单",
    story:
      "工业区的一家电子厂接了个大单，工头在路边招临时夜班工。「一晚¥300，干到天亮，明天休息——但今晚不能走神，出了次品扣钱。」你远远看到厂里灯火通明，流水线已经开动了。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "factoryZone" &&
        st.player.day >= 5 &&
        !st.flags._factoryNightShiftSeen
      );
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "💪 接下夜班",
        hint: "¥300，但疲劳+20",
        apply: function (st) {
          st.flags._factoryNightShiftSeen = true;
          st.resources.cash += 300;
          st.resources.totalEarned += 300;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
          var bonus = Random.chance(0.3);
          if (bonus) {
            st.resources.cash += 100;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "🏭 一晚上没出次品，工头多给了¥100奖金！但天亮了，你累得眼皮打架。\n+¥400，疲劳+20。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🏭 熬了一整夜，腰酸背痛，挣了¥300。回家的路上腿都在抖。\n+¥300，疲劳+20，心情-5。",
              "warning",
            );
          }
        },
      },
      {
        text: "🏃 算了，不冒这个险",
        hint: "保重身体",
        apply: function (st) {
          st.flags._factoryNightShiftSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          StateManager.addMessage(
            "🏃 你摆摆手走了。身体是革命的本钱，不差这一晚。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 医院事件 ======
  RANDOM_EVENTS.push({
    id: "hospital_cheap_medicine_offer",
    phase: "street",
    icon: "💊",
    title: "药贩子推销",
    story:
      "医院门口，一个穿白大褂的中年男人拦住你，压低声音说：「医院里同款药，外面卖一半价。消炎药、降压药、感冒药——要什么有什么，保证正品。」他掀开手里的塑料袋一角，露出几盒药。你注意到包装上的字有些模糊。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "hospital" &&
        st.player.day >= 10 &&
        !st.flags._hospitalCheapMedicineSeen
      );
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🛒 买几盒备着",
        hint: "¥50，但可能是假药",
        apply: function (st) {
          st.flags._hospitalCheapMedicineSeen = true;
          if (st.resources.cash >= 50) {
            st.resources.cash -= 50;
            var fake = Random.chance(0.4);
            if (fake) {
              st.flags._boughtFakeMedicine = true;
              st.needs.health = Math.max(0, (st.needs.health || 50) - 5);
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
              StateManager.addMessage(
                "💊 回家打开一看，药片颜色不对，闻着有股怪味——假药！\n健康-5，心情-8。¥50打了水漂。",
                "danger",
              );
            } else {
              st.flags._hasCheapMedicine = true;
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 3,
              );
              StateManager.addMessage(
                "💊 药看样子是真的，比医院便宜一半。省了钱，心里踏实了点。\n心情+3。",
                "success",
              );
            }
          } else {
            StateManager.addMessage(
              "💊 翻遍口袋，连¥50都凑不齐。你尴尬地走开了。",
              "warning",
            );
          }
        },
      },
      {
        text: "🚫 不买，举报他",
        hint: "正义感+卫生",
        apply: function (st) {
          st.flags._hospitalCheapMedicineSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "🚫 你瞪了他一眼：「再卖假药我报警了。」他缩了缩脖子，快步溜走了。\n道德+5，心情+5。",
            "success",
          );
        },
      },
      {
        text: "😞 我连¥50都拿不出来",
        hint: "自嘲",
        apply: function (st) {
          st.flags._hospitalCheapMedicineSeen = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          StateManager.addMessage(
            "😞 你苦笑了一下，连假药都买不起的感觉，真不好受。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== 娱乐城事件 ======
  RANDOM_EVENTS.push({
    id: "entertainment_talent_scout",
    phase: "street",
    icon: "🎤",
    title: "星探搭讪",
    story:
      "娱乐城三楼KTV走廊里，一个戴着金链子的男人叫住你：「小姑娘/小伙子，形象不错啊！我是天娱传媒的经纪人，最近在找新人拍短视频。签约就有保底¥5000，火了还能分红。要不要试试？」他递过来一张名片，公司名字你从没听说过。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "entertainment" &&
        st.player.day >= 15 &&
        (st.player.charm || 0) >= 30 &&
        !st.flags._entertainmentScoutSeen
      );
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      {
        text: "🎭 签了试试",
        hint: "有机会但风险高",
        apply: function (st) {
          st.flags._entertainmentScoutSeen = true;
          var success = Random.chance(0.3 + (st.player.charm || 0) * 0.005);
          if (success) {
            st.resources.cash += 5000;
            st.resources.totalEarned += 5000;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            StateManager.addMessage(
              "🎭 居然真的火了！一条短视频播放量破百万，公司立马给了签约费。\n+¥5000，名气+10，心情+15！",
              "success",
            );
          } else {
            st.resources.cash -= 500;
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
            st.player.mental = Math.max(0, (st.player.mental || 20) - 5);
            StateManager.addMessage(
              "🎭 拍了三条视频，数据惨淡。公司说你不适合，扣了¥500'培训费'。\n-¥500，心情-10，心智-5。果然是个坑。",
              "danger",
            );
          }
        },
      },
      {
        text: "🤔 先加个微信观望",
        hint: "留条后路",
        apply: function (st) {
          st.flags._entertainmentScoutSeen = true;
          st.flags._hasScoutContact = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "🤔 你加了微信。名片上写着'天娱传媒——让每个人发光'。先看看吧，不急着跳坑。",
            "info",
          );
        },
      },
      {
        text: "🚶 不了，骗子太多",
        hint: "谨慎",
        apply: function (st) {
          st.flags._entertainmentScoutSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 20) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          StateManager.addMessage(
            "🚶 你摆摆手走了。娱乐城里的星探，十个有九个是骗子，不赌这个运气。\n心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 菜市场事件 ======
  RANDOM_EVENTS.push({
    id: "vegetable_market_clearance_deal",
    phase: "street",
    icon: "🥬",
    title: "收摊大甩卖",
    story:
      "菜市场快收摊了，一个菜贩子喊住你：「剩下的菜便宜卖了，这一堆¥20全拿走！都是早上刚到的，放一晚上明天就不新鲜了。」你看了看，一堆菜够吃三四天，但有些叶子已经蔫了。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "vegetable_market" &&
        st.player.day >= 5 &&
        !st.flags._vegeClearanceSeen
      );
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "🛍️ 买了！省一笔是一笔",
        hint: "¥20，可能不新鲜",
        apply: function (st) {
          st.flags._vegeClearanceSeen = true;
          if (st.resources.cash >= 20) {
            st.resources.cash -= 20;
            st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 25);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            var bad = Random.chance(0.25);
            if (bad) {
              st.needs.health = Math.max(0, (st.needs.health || 50) - 3);
              StateManager.addMessage(
                "🥬 回去发现蔫了的叶子不能吃，扔了一半。不过剩下的还算划算。\n饥饿+25，健康-3（吃了不新鲜的），心情+5。",
                "warning",
              );
            } else {
              StateManager.addMessage(
                "🥬 挑拣了一下，大部分都还能吃！够顶三四天了。\n饥饿+25，心情+5。绝对值！",
                "success",
              );
            }
          } else {
            StateManager.addMessage(
              "🥬 翻遍口袋只有几块钱，连¥20都拿不出来……",
              "warning",
            );
          }
        },
      },
      {
        text: "🚫 不买了，不新鲜",
        hint: "健康第一",
        apply: function (st) {
          st.flags._vegeClearanceSeen = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
          if (st.player.morality) {
            st.player.morality = Math.min(100, st.player.morality + 2);
          }
          StateManager.addMessage(
            "🚫 你摇了摇头。省钱是省钱，吃坏肚子不值当。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 郊区事件 ======
  RANDOM_EVENTS.push({
    id: "suburb_storm_shelter",
    phase: "street",
    icon: "🌆",
    title: "暴雨中的庇护",
    story:
      "郊区的小路上，天色突然暗了下来。豆大的雨点砸下来，你环顾四周，最近的公交站还在几百米外。不远处一户人家的门开着，门廊下一位老奶奶朝你招手：「快进来躲躲，这雨一时半会儿停不了。」屋里飘出热茶的香气。",
    // [自洽修复] conditions 新增：天气=雨/暴雨才触发（叙事为暴雨庇护，晴天触发不合理）
    conditions: function (st) {
      if (
        !st.weather ||
        (st.weather.current !== "rainy" && st.weather.current !== "stormy")
      )
        return false;
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "suburb" &&
        st.player.day >= 3 &&
        !st.flags._suburbStormShelterSeen
      );
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "🏠 进屋躲雨，谢谢老人家",
        hint: "健康+2，心情+3，休息恢复",
        apply: function (st) {
          st.flags._suburbStormShelterSeen = true;
          st.needs.health = Math.min(100, (st.needs.health || 50) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 1);
          StateManager.addMessage(
            "🌆 老奶奶给你倒了杯热茶，还拿出自家腌的萝卜干。「年轻人一个人在城里不容易，注意身体啊。」雨停后你道谢离开，心里暖暖的。\n健康+2，心情+3，疲劳-5。",
            "success",
          );
        },
      },
      {
        text: "🌳 在树下躲到雨小",
        hint: "免费，但淋湿了",
        apply: function (st) {
          st.flags._suburbStormShelterSeen = true;
          st.needs.health = Math.max(0, (st.needs.health || 50) - 1);
          st.needs.hygiene = Math.max(0, (st.needs.hygiene || 50) - 5);
          StateManager.addMessage(
            "🌳 你在树下缩着身子等雨小，衣服湿了大半。风一吹，冷得直哆嗦。\n健康-1，卫生-5。",
            "warning",
          );
        },
      },
      {
        text: "🚶 冒雨跑回公交站",
        hint: "省时间，但全身湿透",
        apply: function (st) {
          st.flags._suburbStormShelterSeen = true;
          st.needs.health = Math.max(0, (st.needs.health || 50) - 3);
          st.needs.hygiene = Math.max(0, (st.needs.hygiene || 50) - 10);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          StateManager.addMessage(
            "🚶 你冒雨跑到公交站，全身湿透了。车上的人都不自觉地离你远了一点。\n健康-3，卫生-10，心情-3。",
            "danger",
          );
        },
      },
    ],
  });

  // ====== 政府办事大厅事件 ======
  RANDOM_EVENTS.push({
    id: "gov_office_tout_encounter",
    phase: "street",
    icon: "🏛️",
    title: "办证黄牛",
    story:
      "政府办事大厅门口，一个穿花衬衫的中年女人凑过来，压低声音说：「办身份证？社保？护照？我认识里面的主任，半天就能出证。你自己排队至少三天，还得跑好几趟。」她晃了晃手机，屏幕上显示着几张办证成功的照片。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "gov_office" &&
        st.player.day >= 5 &&
        !st.flags._govOfficeToutSeen
      );
    },
    probability: 0.035,
    repeatable: true,
    choices: [
      {
        text: "💸 花¥100找黄牛",
        hint: "快捷方便，但助长不正之风",
        apply: function (st) {
          st.flags._govOfficeToutSeen = true;
          if (st.resources.cash >= 100) {
            st.resources.cash -= 100;
            st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage(
              "💸 你给了¥100，中年女人打了个电话，半小时后果然有人带你办完了。虽然方便，但总觉得哪里不对。\n现金-¥100，道德-3，心情+3。",
              "warning",
            );
          } else {
            StateManager.addMessage(
              "💸 你翻了翻口袋——¥100都拿不出来。女人翻了个白眼走开了。",
              "warning",
            );
          }
        },
      },
      {
        text: "📋 自己排队办理",
        hint: "免费，但耗费时间",
        apply: function (st) {
          st.flags._govOfficeToutSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
          StateManager.addMessage(
            "📋 你排了一上午队，终于办完了。虽然折腾，但省下了¥100，心里踏实。\n道德+2，心情-2。",
            "info",
          );
        },
      },
      {
        text: "📱 偷偷拍下证据举报",
        hint: "维护正义，但有风险",
        apply: function (st) {
          st.flags._govOfficeToutSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📱 你偷偷拍了照片，走到大厅内找到值班人员举报。不一会儿，保安出来把那个女人带走了。周围几个办事的人朝你投来赞许的目光。\n道德+5，心情+5。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 培训中心事件 ======
  RANDOM_EVENTS.push({
    id: "training_cert_scam",
    phase: "street",
    icon: "📚",
    title: "包就业培训班",
    story:
      "培训中心大厅里，一个穿西装的销售热情地拦住你：「小伙子来得正好！我们和政府合作的'IT就业班'，三个月包教会，结业推荐就业，月薪起步¥8000！现在报名只要¥2000，下个月就涨价了。」他手里拿着一叠宣传单，上面印着几个所谓成功学员的案例。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "trainingCenter" &&
        st.player.day >= 10 &&
        !st.flags._trainingCertScamSeen
      );
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🔍 要求查看政府认证文件",
        hint: "谨慎核实，避免上当",
        apply: function (st) {
          st.flags._trainingCertScamSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          st.player.ability = Math.min(100, (st.player.ability || 50) + 1);
          StateManager.addMessage(
            "🔍 你要求看政府批文和认证资质。销售支支吾吾，翻了半天只拿出一张过期的培训许可证。你明白了——这班根本不正规。\n道德+2，心智+1。",
            "success",
          );
        },
      },
      {
        text: "💰 报名试试",
        hint: "¥2000，可能学到东西，也可能被骗",
        apply: function (st) {
          st.flags._trainingCertScamSeen = true;
          if (st.resources.cash >= 2000) {
            st.resources.cash -= 2000;
            var legit = Random.chance(0.3);
            if (legit) {
              st.player.ability = Math.min(100, (st.player.ability || 50) + 5);
              st.player.knowledge = Math.min(
                100,
                (st.player.knowledge || 50) + 5,
              );
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 8,
              );
              StateManager.addMessage(
                "💰 培训了三个月，虽然不像宣传的那么神，但确实学到了一些基础技能。\n现金-¥2000，能力+5，知识+5，心情+8。",
                "success",
              );
            } else {
              st.player.morality = Math.max(0, (st.player.morality || 50) - 2);
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
              StateManager.addMessage(
                "💰 上了几节课才发现，教的都是网上免费的公开课内容，所谓的'包就业'也只是一份月薪¥3000的销售岗位名单。\n现金-¥2000，道德-2，心情-10。",
                "danger",
              );
            }
          } else {
            StateManager.addMessage(
              "💰 你看了看钱包——¥2000可不是小数目。还是先攒够钱再说吧。",
              "warning",
            );
          }
        },
      },
      {
        text: "🚶 礼貌拒绝，转身离开",
        hint: "省钱省心",
        apply: function (st) {
          st.flags._trainingCertScamSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 1);
          StateManager.addMessage(
            "🚶 「我再考虑考虑。」你走出培训中心，外面的空气新鲜多了。\n道德+1。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "talent_cook_management_class",
    phase: "street",
    icon: "🍳",
    title: "社区厨艺课邀约",
    story:
      "你拿手的那几道家常菜在街坊间早有口碑。\n" +
      "社区活动中心的干事找上门：「周末能不能来带一节厨艺体验课？按课时结算。」",
    // conditions：已点亮「厨艺管理」天赋节点，连接天赋系统 → 社区副业经济
    conditions: function (st) {
      return !!(st.talentNodes && st.talentNodes["cook_management"]);
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      {
        text: "🍳 接下厨艺体验课",
        hint: "现金+，心情+，名声+",
        apply: function (st) {
          var pay = 600;
          st.resources.cash = (st.resources.cash || 0) + pay;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "🍳 你带了一节「家常红烧肉」体验课，十几个邻居边学边尝。结课费¥" +
              pay +
              "，心情+8，名声+3。",
            "success",
          );
        },
      },
      {
        text: "📅 先排到下个月",
        hint: "留余地",
        apply: function (st) {
          StateManager.addMessage(
            "📅 你答应下个月再排课，干事留了联系方式。天赋没白点。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    // [自洽修复] 原 skill_writing_column 引用了不存在的 skills.writing（state.js 技能表无 writing）
    // → 改为 skills.english（真实存在），双语内容创作角度，仍连接 技能→名声/稿费经济
    id: "skill_english_column",
    phase: "street",
    icon: "✍️",
    title: "双语专栏约稿",
    story:
      "你常把城市里的小人物写进随笔，英语底子让你能翻些外刊对照着写。\n" +
      "一家本地生活号编辑私信你：「想不想开个双语专栏？按篇付稿费，涉外稿另加¥300。」",
    // conditions：英语技能达到一定等级，连接技能系统 → 名声 / 稿费经济
    conditions: function (st) {
      var lvl = st.skills && st.skills.english && st.skills.english.level;
      return typeof lvl === "number" && lvl >= 30;
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      {
        text: "✍️ 开专栏，先写一篇",
        hint: "现金+，名声+",
        apply: function (st) {
          var pay = 800;
          st.resources.cash = (st.resources.cash || 0) + pay;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          StateManager.addMessage(
            "✍️ 你写了篇《城中村理发师的老剃刀》（中英对照），发出去一夜破万阅读。稿费¥" +
              pay +
              "，名声+6。",
            "success",
          );
        },
      },
      {
        text: "🤔 婉拒，保持自由",
        hint: "不绑定",
        apply: function (st) {
          StateManager.addMessage(
            "🤔 你回绝了专栏，但留了编辑联系方式——写作仍是你的私人出口。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "npc_oldzhou_toolloan",
    phase: "street",
    icon: "🔧",
    title: "老周的私藏工具",
    story:
      "老周看你总在鼓捣些小修小补，某天拍拍你肩：\n" +
      "「这套德国扳手我年轻时用，你拿去使。别跟我客气。」",
    // conditions：老周已结识且好感足够高，连接 NPC 深度好感 → 实物资源（A类守卫）
    conditions: function (st) {
      var rel = st.relationships && st.relationships.old_zhou;
      return !!(rel && rel.met && (rel.affinity || 0) >= 55);
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🔧 收下，记在心里",
        hint: "好感+，心情+",
        apply: function (st) {
          var rel = st.relationships && st.relationships.old_zhou;
          if (rel) rel.affinity = Math.min(100, (rel.affinity || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          StateManager.addMessage(
            "🔧 你接过了那套沉甸甸的扳手。老周咧嘴一笑，好感+3，心情+4。",
            "success",
          );
        },
      },
      {
        text: "🙏 先借急用就还",
        hint: "灵活",
        apply: function (st) {
          var rel = st.relationships && st.relationships.old_zhou;
          if (rel) rel.affinity = Math.min(100, (rel.affinity || 0) + 1);
          StateManager.addMessage(
            "🙏 你说「急用就借，用完就还」，老周爽快应了。手头多了套趁手工具，好感+1。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "morality_extreme_blacklist",
    phase: "street",
    icon: "⚠️",
    title: "旧账找上门",
    story:
      "你早年耍过的那些心眼，终于有了回响。\n" +
      "一个你坑过的熟人托人放话：「这人办事不地道，以后活儿别给他。」",
    // conditions：道德跌破极低门槛，极端利己的长期回响（与 high 侧形成闭环）
    conditions: function (st) {
      var m = st.player && st.player.morality;
      return typeof m === "number" && m <= 15;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🕊️ 主动登门道歉赔钱",
        hint: "现金-，道德+，但声誉难回",
        apply: function (st) {
          var cost = 1500;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 8);
          st.player.fame = Math.max(0, (st.player.fame || 0) - 5);
          StateManager.addMessage(
            "🕊️ 你上门赔了¥" +
              cost +
              "，对方冷笑收下。道德+8，但名声-5——信用的裂痕没那么好补。",
            "danger",
          );
        },
      },
      {
        text: "🙈 装作没事",
        hint: "躲一时",
        apply: function (st) {
          st.player.fame = Math.max(0, (st.player.fame || 0) - 3);
          StateManager.addMessage(
            "🙈 你假装没听见风声。名声-3，有些门从此对你关上了。",
            "warning",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "weather_rainy_umbrella",
    phase: "street",
    icon: "🌧️",
    title: "雨里的一把伞",
    story:
      "突如其来的雨把整条街浇透。你缩在屋檐下，旁边也有人正发愁。\n" +
      "对方递来半边伞：「顺路，一起走？」",
    // conditions：当前天气为雨天，连接天气系统 → 偶遇 / 心情
    conditions: function (st) {
      return !!(st.weather && st.weather.current === "rainy");
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🌂 接下半边伞",
        hint: "心情+，可能结识",
        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          StateManager.addMessage(
            "🌂 你们挤在一把伞下走了两条街，聊得意外投机。心情+6。",
            "success",
          );
        },
      },
      {
        text: "🏃 冒雨冲回去",
        hint: "省事但狼狈",
        apply: function (st) {
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
          StateManager.addMessage(
            "🏃 你摆摆手冲进雨里，到家时浑身湿透。心情-2。",
            "warning",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "fame_high_interview",
    phase: "street",
    icon: "🎤",
    title: "本地媒体的采访",
    story:
      "你在街坊里攒下的好名声，引来了城里生活周刊的记者。\n" +
      "「我们想做个『普通人的城市故事』专栏，能聊聊你吗？」",
    // conditions：名声达到较高门槛，累积状态爆发 → 曝光机会
    conditions: function (st) {
      var f = st.player && st.player.fame;
      return typeof f === "number" && f >= 60;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🎤 答应采访",
        hint: "名声+，现金+",
        apply: function (st) {
          var pay = 1000;
          st.resources.cash = (st.resources.cash || 0) + pay;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          StateManager.addMessage(
            "🎤 采访登出来，配了张你在巷口笑的照片。稿费¥" +
              pay +
              "，名声+8，连菜市场阿姨都认得你了。",
            "success",
          );
        },
      },
      {
        text: "🤫 婉拒出镜",
        hint: "低调",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          StateManager.addMessage(
            "🤫 你谢绝了出镜，但记者写了篇匿名小稿。名声+2。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    // [联动] 声望系统 ↔ 职业/收入：副业口碑达阈值后，老客户主动回头
    id: "reputation_high_callup",
    phase: "street",
    icon: "🌟",
    title: "口碑带来的回头客",
    story:
      "你在这一带做了不少活，街坊都认得你这个人。\n" +
      "今天一家小超市老板专门找上门：「听说你靠谱，以后我店的杂活都包给你，长期算。」",
    // conditions：副业口碑（按地点）达到阈值，连接 reputation 系统 → 稳定收入机会
    conditions: function (st) {
      var rep = st.reputation;
      if (!rep) return false;
      // 任一常去地点口碑≥50 即视为积累了可信度
      var ok =
        (rep.slum || 0) >= 50 ||
        (rep.commercialDist || 0) >= 50 ||
        (rep.bank || 0) >= 50 ||
        (rep.wholesaleMarket || 0) >= 50;
      return !!ok;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🤝 接下长期活",
        hint: "解锁稳定副业收入",
        apply: function (st) {
          st.flags.repLongTermGig = true;
          var bonus = 400 + Random.int(0, 199);
          st.resources.cash = (st.resources.cash || 0) + bonus;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + bonus;
          StateManager.addMessage(
            "🤝 你和超市签了长期杂活合同，首月预支¥" +
              bonus +
              "。口碑终于变成了真金白银。",
            "success",
          );
        },
      },
      {
        text: "🙇 先试一单看看",
        hint: "低风险",
        apply: function (st) {
          var bonus = 150 + Random.int(0, 99);
          st.resources.cash = (st.resources.cash || 0) + bonus;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + bonus;
          StateManager.addMessage(
            "🙇 你接了第一单，老板挺满意，塞给你¥" + bonus + "。口碑路还能走。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    // [联动] 技能协同：编程 + 英语 → 独立开发副业（技能系统内部交叉）
    id: "indie_dev_side_project",
    phase: "street",
    icon: "💻",
    title: "独立开发的小项目",
    story:
      "你既会写代码，英语也还过得去，能直接读英文文档和海外教程。\n" +
      "一个想法在脑子里转了很久——做个小工具，放到海外平台上去卖。",
    // conditions：编程与英语双门槛，连接 skills 系统 → 被动收入 / 名声
    conditions: function (st) {
      var codeLv = st.skills && st.skills.coding && st.skills.coding.level;
      var engLv = st.skills && st.skills.english && st.skills.english.level;
      return (
        typeof codeLv === "number" &&
        codeLv >= 30 &&
        typeof engLv === "number" &&
        engLv >= 25
      );
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🚀 花两周做出来上架",
        hint: "前期投入，潜在被动收入",
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 600);
          st.flags.indieDevLaunched = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          StateManager.addMessage(
            "🚀 你熬了两周把小工具做出来，挂上平台。头月分成不多，但这是第一条睡后收入。现金-¥600，名声+5。",
            "success",
          );
        },
      },
      {
        text: "📝 先写个免费版试水",
        hint: "零成本攒口碑",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "📝 你先发了个免费版，几天攒了几十个用户。口碑比钱重要，名声+3。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    // [联动] NPC 深层好感（挚友级 ≥80）：老周把更私密的人脉托付给你
    id: "oldzhou_80_legacy",
    phase: "street",
    icon: "🤝",
    title: "老周的托付",
    story:
      "老周把你当自家后生看。这天他神秘兮兮把你拉到一边：\n" +
      "「我干废品这行，有些门道外人进不来。我信你，带你认识城西回收站的老周明——他手里有正经渠道。」",
    // conditions：老周 old_zhou 已结识且好感达挚友级（≥80），连接 relationships 系统 → 高价回收渠道
    conditions: function (st) {
      var rel = st.relationships && st.relationships.old_zhou;
      return !!(rel && rel.met && (rel.affinity || 0) >= 80);
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🏭 跟他去见老周明",
        hint: "解锁高价回收渠道",
        apply: function (st) {
          st.flags.oldZhouMingChannel = true;
          var bonus = 300 + Random.int(0, 199);
          st.resources.cash = (st.resources.cash || 0) + bonus;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + bonus;
          StateManager.addMessage(
            "🏭 老周明是个爽快人，当场让你走他的渠道，废铁价每斤多三毛。临走塞你¥" +
              bonus +
              "「拿去喝茶」。废品回收收益永久提升。",
            "success",
          );
        },
      },
      {
        text: "🙏 先记在心里",
        hint: "稳一手",
        apply: function (st) {
          st.flags.oldZhouMingIntro = true;
          StateManager.addMessage(
            "🙏 你谢过老周，把这份人情记在心里。以后随时能去找老周明。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "repair_mgmt_outsource",
    phase: "street",
    icon: "🔧",
    title: "维修外包队",
    story:
      "你修活利索，又懂点排班记账，街角几家小店老板合计着：\n" +
      "「要不你牵头，接周边的零散维修？我们帮你派单。」",
    // conditions：维修技能 + 管理技能 双门槛，连接技能系统 → 副业/团队经济
    conditions: function (st) {
      var repair = st.skills && st.skills.repair && st.skills.repair.level; // 维修技能等级
      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 管理技能等级
      return (
        typeof repair === "number" &&
        repair >= 25 &&
        typeof mgmt === "number" &&
        mgmt >= 15
      );
    },
    probability: 0.02,
    repeatable: true,
    choices: [
      {
        text: "🔧 牵头接单",
        hint: "稳定副业+",
        apply: function (st) {
          var cut = 1200;
          st.resources.cash = (st.resources.cash || 0) + cut;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          StateManager.addMessage(
            "🔧 你拉起一支三人的社区维修小队，当月净分账¥" + cut + "，名声+4。",
            "success",
          );
        },
      },
      {
        text: "🤔 先不揽活",
        hint: "不绑定",
        apply: function (st) {
          StateManager.addMessage(
            "🤔 你谢过老板们，觉得现在一个人接单更自由。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "weld_elec_retrofit",
    phase: "street",
    icon: "⚡",
    title: "设备改造单",
    story:
      "一家小厂的旧生产线总出故障，厂长听说你既会焊又会电工：\n" +
      "「能不能给咱们做个自动化小改造？预算好说。」",
    // conditions：焊接技能 + 电工技能 双门槛，连接技能系统 → 高客单改造
    conditions: function (st) {
      var weld = st.skills && st.skills.welding && st.skills.welding.level; // 焊接技能等级
      var elec =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 电工技能等级
      return (
        typeof weld === "number" &&
        weld >= 20 &&
        typeof elec === "number" &&
        elec >= 15
      );
    },
    probability: 0.018,
    repeatable: false,
    choices: [
      {
        text: "⚡ 接下改造",
        hint: "大额现金+",
        apply: function (st) {
          var fee = 3500;
          st.resources.cash = (st.resources.cash || 0) + fee;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          StateManager.addMessage(
            "⚡ 改造一次调试成功，厂长很满意，当场结了¥" + fee + "，名声+8。",
            "success",
          );
        },
      },
      {
        text: "🤔 量力而行",
        hint: "风险规避",
        apply: function (st) {
          StateManager.addMessage(
            "🤔 你评估后接了个小模块，没贪大——稳妥落袋。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "account_sales_invoice",
    phase: "street",
    icon: "🧾",
    title: "代记账客户",
    story:
      "你帮朋友理过几次账，口碑传开，几个摆摊和开小店的找上门：\n" +
      "「我们不懂报税，你代记账不？按月付。」",
    // conditions：会计技能 + 销售技能 双门槛，连接技能系统 → 稳定代账客户
    conditions: function (st) {
      var acc = st.skills && st.skills.accounting && st.skills.accounting.level; // 会计技能等级
      var sales = st.skills && st.skills.sales && st.skills.sales.level; // 销售技能等级（懂客户）
      return (
        typeof acc === "number" &&
        acc >= 20 &&
        typeof sales === "number" &&
        sales >= 10
      );
    },
    probability: 0.022,
    repeatable: true,
    choices: [
      {
        text: "🧾 接代账",
        hint: "月入稳定+",
        apply: function (st) {
          var monthly = 900;
          st.resources.cash = (st.resources.cash || 0) + monthly;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "🧾 你接下 3 家代账，当月入账¥" + monthly + "，名声+3。",
            "success",
          );
        },
      },
      {
        text: "🤔 先试一家",
        hint: "低风险",
        apply: function (st) {
          StateManager.addMessage(
            "🤔 你先接了一家练手，口碑稳了再扩。",
            "info",
          );
        },
      },
    ],
  });

  // [联动 R7] 需求阈值爆发：现金濒临枯竭 → 社区零工互助
  RANDOM_EVENTS.push({
    id: "cash_low_community_gig",
    phase: "street",
    icon: "🪙",
    title: "邻里零工",
    story:
      "房租和饭钱快见底了，你在业主群里随口问了句有没有零活。\n" +
      "楼下的便利店老板和快递驿站先后找来：『有空帮个忙不？按次结。』",
    // conditions：现金阈值触发——危机转化为互助契机，连接 经济系统 → 社区互助/微收入
    conditions: function (st) {
      var cash = st.resources && st.resources.cash; // 现金（元）
      return typeof cash === "number" && cash <= 200;
    },
    probability: 0.05,
    repeatable: true,
    choices: [
      {
        text: "🪙 接零工",
        hint: "现金+（小额）",
        apply: function (st) {
          var pay = 260;
          st.resources.cash = (st.resources.cash || 0) + pay;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          StateManager.addMessage(
            "🪙 你帮便利店理了两小时货、替驿站分了趟件，当天进账¥" +
              pay +
              "，名声+2。",
            "success",
          );
        },
      },
      {
        text: "😶 先缓缓",
        hint: "不接活",
        apply: function (st) {
          StateManager.addMessage("你婉拒了，想先缓口气。", "info");
        },
      },
    ],
  });

  // [联动 R7] 双技能协同：销售 + 英语 → 外贸跟单/选品顾问
  RANDOM_EVENTS.push({
    id: "sales_english_trade",
    phase: "street",
    icon: "🌐",
    title: "外贸跟单",
    story:
      "一家做跨境小商品的公司缺个既懂客户又过得硬英语的跟单。\n" +
      "猎头刷到你的履历：「能不能兼着帮我们跟几票单？」",
    // conditions：销售技能 + 英语技能 双门槛，连接 技能系统 → 跨境副业
    conditions: function (st) {
      var sales = st.skills && st.skills.sales && st.skills.sales.level; // 销售技能等级
      var eng = st.skills && st.skills.english && st.skills.english.level; // 英语技能等级
      return (
        typeof sales === "number" &&
        sales >= 15 &&
        typeof eng === "number" &&
        eng >= 25
      );
    },
    probability: 0.02,
    repeatable: true,
    choices: [
      {
        text: "🌐 接跟单",
        hint: "现金+（佣金）/名声+",
        apply: function (st) {
          var fee = 1100;
          st.resources.cash = (st.resources.cash || 0) + fee;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          StateManager.addMessage(
            "🌐 你跟下了两票小单，拿到佣金¥" + fee + "，名声+4。",
            "success",
          );
        },
      },
      {
        text: "🙅 暂时不接",
        hint: "不接",
        apply: function (st) {
          StateManager.addMessage("你婉拒了，手头事够多了。", "info");
        },
      },
    ],
  });

  // [联动 R7] 天赋系统扩展：sales_management 天赋节点 → 大客户资源
  RANDOM_EVENTS.push({
    id: "talent_sales_management_client",
    phase: "street",
    icon: "💼",
    title: "大客户介绍",
    story:
      "你拿下「销售管理」天赋后，圈子里开始有人把你当能扛盘的人。\n" +
      "一位老客户牵线：「有个大单，我觉得你能接，要不要聊聊？」",
    // conditions：天赋节点 sales_management 已激活，连接 天赋系统 → 高价值客户
    conditions: function (st) {
      return !!(st.talentNodes && st.talentNodes["sales_management"]);
    },
    probability: 0.018,
    repeatable: true,
    choices: [
      {
        text: "💼 接大单",
        hint: "现金+（大额）/名声+",
        apply: function (st) {
          var retainer = 2600;
          st.resources.cash = (st.resources.cash || 0) + retainer;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 7);
          StateManager.addMessage(
            "💼 你谈下了这笔年框，预付¥" + retainer + "，名声+7。",
            "success",
          );
        },
      },
      {
        text: "🤝 先认识人",
        hint: "只建联不接单",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "你先吃了顿饭认识人，暂未接单，名声+3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== R8 联动事件（指令二：空白区填充）======
  RANDOM_EVENTS.push({
    id: "mood_low_letter_home",
    phase: "street",
    icon: "📞",
    title: "夜里的家",
    story:
      "出租屋的灯坏了半边，你躺在漆黑里刷到老家同学的动态——人家孩子都会叫爸爸了。胃里空空的，不是饿，是想家。手机相册自动弹出去年过年的全家福。",
    // conditions：极低心情阈值爆发（除饥饿外的 needs 阈值空白区）
    conditions: function (st) {
      if (!st.needs) return false; // 检查 needs 系统存在
      if ((st.needs.happiness || 100) >= 15) return false; // 检查 心情值<15（极低）
      if (st.player.phase !== "street") return false; // 检查 仅在街头阶段
      if (st.player.day < 7) return false; // 检查 开局几天后
      if (
        st.flags &&
        st.flags._moodLowLetterDay && // 检查 30天冷却
        st.player.day - st.flags._moodLowLetterDay < 30
      )
        return false;
      return true;
    },
    probability: 0.05,
    repeatable: true,
    choices: [
      {
        text: "📞 给家里打个电话",
        hint: "心情+,花钱-",
        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          st.resources.cash -= 30;
          st.flags._moodLowLetterDay = st.player.day;
          StateManager.addMessage(
            "📞 你拨通了家里的电话，妈在那头絮叨，你鼻头一酸，但胸口松了。",
          );
        },
      },
      {
        text: "✍️ 写一封长信",
        hint: "心情+,省钱",
        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);
          st.flags._moodLowLetterDay = st.player.day;
          StateManager.addMessage(
            "✍️ 你打开备忘录写了很久，没发出去，但写完后睡得比往常沉。",
          );
        },
      },
      {
        text: "🌃 一个人闷着",
        hint: "省钱,心情-",
        apply: function (st) {
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 2);
          if (st.player.health && st.player.health.mental)
            st.player.health.mental.stress =
              (st.player.health.mental.stress || 0) + 3;
          StateManager.addMessage(
            "🌃 你把手机扣在桌上，盯着天花板。有些情绪，只能自己消化。",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "cooking_accounting_catering",
    phase: "street",
    icon: "🍱",
    title: "盒饭生意",
    story:
      "楼下便利店老板娘尝了你带的午饭，眼睛一亮：「你这手艺能开店了！我店门口让你摆个盒饭摊行不？」你脑子立刻算起毛利、损耗和人手——这你熟。",
    // conditions：cooking + accounting 双技能协同（餐饮记账空白区）
    conditions: function (st) {
      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 烹饪技能
      var acc = st.skills && st.skills.accounting && st.skills.accounting.level; // 检查 会计技能
      if (typeof cook !== "number" || cook < 30) return false; // 检查 烹饪≥30
      if (typeof acc !== "number" || acc < 20) return false; // 检查 会计≥20
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 20) return false; // 检查 中后期
      if (st.flags && st.flags._cateringBizOn) return false; // 检查 未已开启
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "🍱 接下长期盒饭单",
        hint: "稳定收入+,耗时+",
        apply: function (st) {
          var earn = Random.int(180, 320);
          st.resources.cash += earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.flags._cateringBizOn = true;
          StateManager.addMessage(
            "🍱 你算清每盒饭毛利后接下了单，便利店门口多了你的保温箱。",
          );
        },
      },
      {
        text: "🤝 只偶尔帮衬",
        hint: "轻量练手",
        apply: function (st) {
          var earn = Random.int(40, 90);
          st.resources.cash += earn;
          StateManager.addMessage("🤝 你偶尔帮老板娘做几顿，权当练手赚零花。");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "coding_management_product",
    phase: "street",
    icon: "👥",
    title: "组队接外包",
    story:
      "前同事发来一单外包：一个小程序，工期紧、预算还行。你技术够啃下来，但一个人熬不起。忽然想到——你不是也能张罗人吗？",
    // conditions：coding + management 双技能协同（带小团队接单空白区）
    conditions: function (st) {
      var code = st.skills && st.skills.coding && st.skills.coding.level; // 检查 编程技能
      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 检查 管理技能
      if (typeof code !== "number" || code < 30) return false; // 检查 编程≥30
      if (typeof mgmt !== "number" || mgmt < 15) return false; // 检查 管理≥15
      if (st.player.day < 25) return false; // 检查 中后期
      if (st.flags && st.flags._codingTeamDone) return false; // 检查 未做过
      return true;
    },
    probability: 0.022,
    repeatable: false,
    choices: [
      {
        text: "👥 拉小队接下",
        hint: "大收入+,压力+",
        apply: function (st) {
          var earn = Random.int(900, 1600);
          st.resources.cash += earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          if (st.player.health && st.player.health.mental)
            st.player.health.mental.stress =
              (st.player.health.mental.stress || 0) + 10;
          st.flags._codingTeamDone = true;
          StateManager.addMessage(
            "👥 你拉了两个靠谱朋友组队，把外包单啃下来了，账户厚了一截。",
          );
        },
      },
      {
        text: "💻 自己 solo 做",
        hint: "收入中,压力小",
        apply: function (st) {
          var earn = Random.int(350, 600);
          st.resources.cash += earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          StateManager.addMessage(
            "💻 你一个人熬了几个通宵把外包做完了，钱不多但落袋为安。",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "stress_high_breakdown",
    phase: "street",
    icon: "⚡",
    title: "临界点",
    story:
      "连续的高压把人磨钝了。你开始在地铁上走神，对同事一点就着，半夜睁眼到三点。镜子里的自己，眼窝深得吓人。身体在拉警报。",
    // conditions：stress 心理健康阈值（health.mental.stress 空白区）
    conditions: function (st) {
      var stress =
        st.player && st.player.health && st.player.health.mental
          ? st.player.health.mental.stress
          : 0; // 检查 心理压力值
      if (stress < 80) return false; // 检查 压力≥80（临界）
      if (st.player.day < 15) return false; // 检查 中后期
      if (
        st.flags &&
        st.flags._stressBreakdownDay && // 检查 60天冷却
        st.player.day - st.flags._stressBreakdownDay < 60
      )
        return false;
      return true;
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "🏖️ 请几天假缓一缓",
        hint: "压力-,收入-",
        apply: function (st) {
          if (st.player.health && st.player.health.mental)
            st.player.health.mental.stress = Math.max(
              0,
              st.player.health.mental.stress - 25,
            );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.flags._stressBreakdownDay = st.player.day;
          StateManager.addMessage(
            "🏖️ 你关掉手机睡了两天，醒来觉得世界没那么糟。",
          );
        },
      },
      {
        text: "⚡ 硬扛过去",
        hint: "收入保,健康-",
        apply: function (st) {
          if (st.player.health && st.player.health.mental)
            st.player.health.mental.stress =
              (st.player.health.mental.stress || 0) + 5;
          if (st.player.health && st.player.health.physical)
            st.player.health.physical.score = Math.max(
              0,
              st.player.health.physical.score - 8,
            );
          st.flags._stressBreakdownDay = st.player.day;
          StateManager.addMessage(
            "⚡ 你继续连轴转，直到某天在地铁上眼前一黑。",
          );
        },
      },
    ],
  });
  // ====== R9 联动事件（空白区填充：时代变迁/NPCD深度好感/双技能/声望高阶）======
  RANDOM_EVENTS.push({
    id: "era_inflation_rent_hike",
    phase: "street",
    icon: "📈",
    title: "通胀下的涨租",
    story:
      "物价一年比一年高。房东贴出通知：下月房租上调一成。菜场大妈念叨「钱越来越不经花了」，你捏着钱包发愁。",
    // conditions：时代变迁进入中后期（物价/工资明显变化），联动 era_transform 系统
    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态是否已初始化
      if (!era) return false;
      return era.stageId === "mature" || era.stageId === "decline"; // 检查 中后期阶段（约1.5年后）
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "💰 咬牙续租",
        hint: "现金- 安稳+",
        apply: function (st) {
          var hike = Math.round((st.resources.cash || 0) * 0.06); // 涨租差价
          st.resources.cash = Math.max(0, st.resources.cash - hike);
          StateManager.addMessage(
            "你补齐了涨租的差价，总算没流落街头。",
            "info",
          );
        },
      },
      {
        text: "📦 搬去城郊",
        hint: "现金+ 通勤累",
        apply: function (st) {
          st.resources.cash += 80; // 省下月租
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          StateManager.addMessage(
            "你搬到城郊更便宜的床位，每月省下一笔，但通勤更累了。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "sister_zhang_market_tip",
    phase: "street",
    icon: "🤝",
    title: "张姐的内推",
    story:
      "张姐神秘兮兮把你拉到一边：「商业区有个黄金摊位空出来了，我帮你递个话？」她眼里是真心想拉你一把。",
    // conditions：张姐好感积累后的意外发现（NPC 关系空白区）
    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_zhang; // 检查 张姐关系对象
      if (!rel || !rel.met) return false; // 检查 已结识
      return (rel.affinity || 0) >= 60; // 检查 好感≥60
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🙌 接下人情",
        hint: "声望+ 现金+",
        apply: function (st) {
          st.resources.cash += 200;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          var rel = st.relationships.sister_zhang;
          rel.affinity = Math.min(100, rel.affinity + 5);
          StateManager.addMessage(
            "张姐真帮你递了话，你拿到商业区临时摊位资格，名声也涨了。",
            "info",
          );
        },
      },
      {
        text: "🙏 先记着",
        hint: "好感+ 无消耗",
        apply: function (st) {
          var rel = st.relationships.sister_zhang;
          rel.affinity = Math.min(100, rel.affinity + 8);
          StateManager.addMessage(
            "你婉拒了，说等站稳再说。张姐反倒更欣赏你的稳重。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "electrician_coding_smart_home",
    phase: "street",
    icon: "💡",
    title: "智能家居改装",
    story:
      "邻居看你既懂电路又玩得转代码，凑过来问：「能不能帮我把老房子改成手机遥控灯？给你算工钱。」",
    // conditions：电工+编程双技能协同（技能系统空白区）
    conditions: function (st) {
      var elec =
        st.skills && st.skills.electrician ? st.skills.electrician.level : 0; // 检查 电工等级
      var code = st.skills && st.skills.coding ? st.skills.coding.level : 0; // 检查 编程等级
      return elec >= 20 && code >= 20; // 检查 双技能均≥20
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🔧 接单改装",
        hint: "现金+ 电工xp+",
        apply: function (st) {
          st.resources.cash += 150;
          if (st.skills.electrician) st.skills.electrician.xp += 25;
          StateManager.addMessage(
            "你用继电器加单片机把灯连进手机，邻居直呼神奇，工钱到手。",
            "info",
          );
        },
      },
      {
        text: "📚 教他自己弄",
        hint: "声望+ 无消耗",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          StateManager.addMessage(
            "你甩给他一份教程和零件清单，他后来真鼓捣出来了，逢人夸你。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "reputation_top_influencer",
    phase: "street",
    icon: "🌟",
    title: "商圈红人",
    story:
      "商业区里越来越多的人认得你——店员喊你「常客」，摊主留你最爱的位置。你成了这片街区隐形的「自己人」。",
    // conditions：声望系统高阶分叉（reputation 按地点 key 存，非标量）
    conditions: function (st) {
      var rep = st.reputation && st.reputation.commercialDist; // 检查 商业区声望
      return (rep || 0) >= 80; // 检查 声望≥80（顶阶）
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🤝 牵头邻里互助",
        hint: "声望+ 好感扩散",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,
              (st.reputation.commercialDist || 0) + 3,
            );
          StateManager.addMessage(
            "你张罗起邻里互助群，整片街区的商家都买你的账。",
            "info",
          );
        },
      },
      {
        text: "🙂 低调保持",
        hint: "无消耗 稳",
        apply: function (st) {
          StateManager.addMessage(
            "你笑着摆摆手，继续做个被记得脸熟的人。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 空白区填充：4个新联动事件（v3.20 新增）======
  // 场景1：技能成长兑现 — 修理技能≥40 → 修理铺合作邀请
  RANDOM_EVENTS.push({
    id: "repair_workshop_offer",
    phase: "street",
    icon: "🔧",
    title: "修理铺的邀请",
    story:
      "你在街边修了一个下午的小物件，手法越来越熟练。这时，街角的“老王修理铺”老板老王走过来拍了拍你的肩：“小伙子，手艺不错啊。我这铺子最近忙不过来，缺个帮手——你要是愿意，我给你固定工价，还能学老本行。”\n\n老王把铺子里的账本翻给你看：活不缺，就是人手不够。",
    conditions: function (st) {
      if (!st.skills) return false;
      var repair = st.skills.repair || 0;
      if (repair < 40) return false;
      if (st.flags._repairWorkshopSeen) return false;
      if (st.player.day < 10) return false;
      return true;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "🔧 答应合作，每周固定三天",
        hint: "稳定收入 + 技能提升",
        apply: function (st) {
          st.flags._repairWorkshopSeen = true;
          var baseIncome = Random.int(200, 400);
          st.resources.cash += baseIncome;
          st.resources.totalEarned += baseIncome;
          st.skills.repair = Math.min(100, (st.skills.repair || 40) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          StateManager.addMessage(
            "🔧 你每周帮老王修三天物件，周入¥" +
              baseIncome +
              "，修理技能+5。手艺有了去处。",
            "success",
          );
        },
      },
      {
        text: "💰 谈更高的工价",
        hint: "风险：可能谈崩",
        apply: function (st) {
          st.flags._repairWorkshopSeen = true;
          if (Random.chance(0.4)) {
            var highIncome = Random.int(300, 600);
            st.resources.cash += highIncome;
            st.resources.totalEarned += highIncome;
            StateManager.addMessage(
              "💰 你开口要价高一些，老王犹豫了一下答应了。周入¥" +
                highIncome +
                "，比预期更好。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "💰 你报的价老王摇头了，说再想想。合作暂时搁置了。",
              "info",
            );
          }
        },
      },
      {
        text: "🙋 婉拒，想自己单干",
        hint: "维持现状",
        apply: function (st) {
          st.flags._repairWorkshopSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
          StateManager.addMessage(
            "🙋 你说想自己干。老王点点头，给了你张名片：「有需要了再来。」",
            "info",
          );
        },
      },
    ],
  });

  // 场景2：状态积累爆发 — 饥饿≥3天 → 好心人请喝热汤
  RANDOM_EVENTS.push({
    id: "hunger_warm_meal_kindness",
    phase: "street",
    icon: "🍲",
    title: "一碗热汤",
    story:
      "你已经三天没好好吃顿饭了，肚子咕咕叫，浑身发冷。路过一家小面馆，老板娘看你面色不好，二话不说盛了一碗热汤推到你面前：「先暖暖身子，这顿算我的。」\n\n热汤下肚，你感觉胃里终于有了温度。这种被人照顾的感觉，太久没体会过了。",
    conditions: function (st) {
      if (!st.needs) return false;
      var hungerStreak = st.needs._hungerStreak || 0;
      var hunger = st.needs.hunger || 0;
      if (hunger < 70 && hungerStreak < 3) return false;
      if (st.flags._hungerMealSeen) return false;
      if (st.player.day < 5) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🙏 收下热汤，真诚道谢",
        hint: "心情+15，饥饿大幅缓解",
        apply: function (st) {
          st.flags._hungerMealSeen = true;
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 60);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
          StateManager.addMessage(
            "🙏 你端起碗，热汤顺着喉咙流下去。好久没被人这样照顾过了。饥饿-60，心情+15。",
            "success",
          );
        },
      },
      {
        text: "😢 默默吃完，留句话",
        hint: "心情+10，留下温暖",
        apply: function (st) {
          st.flags._hungerMealSeen = true;
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 50);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
          StateManager.addMessage(
            "😢 你安静地吃完，在桌上留了张纸条：「谢谢，等我发财了一定还。」老板娘笑着收下了。",
            "info",
          );
        },
      },
      {
        text: "😔 不好意思，还是不要",
        hint: "保持尊严，但状态依旧",
        apply: function (st) {
          st.flags._hungerMealSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 2);
          StateManager.addMessage(
            "😔 你摇摇头，不想欠人情。老板娘看着你走远，眼里有担忧。",
            "info",
          );
        },
      },
    ],
  });

  // 场景3：天气×位置组合 — 暴雨/大雾 + 批发市场 → 雨中同行
  RANDOM_EVENTS.push({
    id: "rainy_wholesale_umbrella",
    phase: "street",
    icon: "☂️",
    title: "同撑一把伞",
    story:
      "雨突然大了起来，你刚走进批发市场的顶棚避雨，迎面走来一个提着大包小包的中年男人，浑身湿透。他看了看你，递过手里唯一的伞：「兄弟，一起走？路不远，前面路口就到家了。」\n\n这把伞只够遮两个人。",
    conditions: function (st) {
      var isBadWeather =
        st.weather &&
        (st.weather.current === "stormy" ||
          st.weather.current === "heavy_rain" ||
          st.weather.current === "foggy");
      var atMarket = st.trade && st.trade.currentLocation === "wholesaleMarket";
      if (!isBadWeather || !atMarket) return false;
      if (st.flags._rainyUmbrellaSeen) return false;
      if (st.player.day < 10) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🤝 同撑一把伞同行",
        hint: "心情+12，陌生人的温暖",
        apply: function (st) {
          st.flags._rainyUmbrellaSeen = true;
          st.needs.hygiene = Math.max(0, (st.needs.hygiene || 0) - 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          StateManager.addMessage(
            "🤝 你们并肩走在雨里，聊了几句闲天。到路口时他摆摆手就走了，你才发现自己不知道他姓什么。心情+12。",
            "success",
          );
        },
      },
      {
        text: "🏠 自己找个地方躲雨",
        hint: "不欠人情",
        apply: function (st) {
          st.flags._rainyUmbrellaSeen = true;
          st.needs.hygiene = Math.max(0, (st.needs.hygiene || 0) - 8);
          StateManager.addMessage(
            "🏠 你婉拒了，自己找个屋檐下躲雨。雨下了好久，浑身还是湿了大半。卫生-8。",
            "info",
          );
        },
      },
    ],
  });

  // 场景4：道德×债务极端分叉 — 高额债务 + 道德<30 → 借钱困境
  RANDOM_EVENTS.push({
    id: "moral_debt_dilemma",
    phase: "street",
    icon: "💸",
    title: "借还是不借",
    story:
      "街头巷尾的债务压力越来越大，你手头紧得发颤。这时你遇到一个老熟人——曾经帮过你的张师傅，他现在生意不行了，开口向你借钱：「兄弟，就借我500，我下个月一定还。」\n\n可是你自己欠债如山，根本没有多余的钱。张师傅的眼里满是焦急。",
    conditions: function (st) {
      var morality = st.player.morality || 50;
      var debt = st.resources.totalDebt || 0;
      if (morality >= 30) return false;
      if (debt < 1000) return false;
      if (st.flags._moralDebtSeen) return false;
      if (st.player.day < 15) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "💰 硬凑出500借给他",
        hint: "借钱给别人，自己更紧",
        apply: function (st) {
          st.flags._moralDebtSeen = true;
          var borrow = Math.min(500, st.resources.cash || 0);
          st.resources.cash -= borrow;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.player.morality = Math.max(0, (st.player.morality || 30) + 3);
          StateManager.addMessage(
            "💰 你把¥" +
              borrow +
              "塞给张师傅，自己剩下的钱只够撑两天。但看着他松了一口气的样子，你心里也不好受。道德+3。",
            "warning",
          );
        },
      },
      {
        text: "😒 直接拒绝——我没钱",
        hint: "现实选择，无消耗",
        apply: function (st) {
          st.flags._moralDebtSeen = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
          StateManager.addMessage(
            "😒 你实话实说：「兄弟，我比你更惨。」张师傅沉默了一下，拍拍你肩膀走了。心情-5。",
            "info",
          );
        },
      },
      {
        text: "🤔 帮他想别的办法",
        hint: "推荐工作，两全其美",
        apply: function (st) {
          st.flags._moralDebtSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "🤔 你说：「我认识个工地招人，明天可以去试试。」张师傅眼睛亮了，握了握你的手。心智+3，心情+8。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 医疗系统联动：王医生相关事件 ======
  RANDOM_EVENTS.push({
    id: "dr_wang_health_warning",
    phase: "street",
    icon: "🏥",
    title: "医生的忠告",
    story:
      "你捂着肚子从医院走廊出来，正好碰上王医生。他看你脸色发青，皱了皱眉：「又没好好吃饭？跟你说过多少次了，胃病不是闹着玩的。过来，我给你开点药，别再拖了。」",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.dr_wang) return false;
      if (!st.relationships.dr_wang.met) return false;
      if (!st.needs) return false;
      var health = st.needs.health || 100;
      if (health > 50) return false;
      if (st.flags._drWangWarningSeen) return false;
      if (st.player.day < 10) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🙏 谢谢医生，我注意",
        hint: "health+10",
        apply: function (st) {
          st.flags._drWangWarningSeen = true;
          st.needs.health = Math.min(100, (st.needs.health || 0) + 10);
          st.relationships.dr_wang.affinity = Math.min(
            100,
            st.relationships.dr_wang.affinity + 3,
          );
          StateManager.addMessage(
            "🙏 王医生给你开了一周的胃药，叮嘱按时吃。健康+10。",
            "success",
          );
        },
      },
      {
        text: "💰 我没事，不用开药",
        hint: "省药费，没效果",
        apply: function (st) {
          st.flags._drWangWarningSeen = true;
          st.relationships.dr_wang.affinity = Math.max(
            -100,
            st.relationships.dr_wang.affinity - 2,
          );
          StateManager.addMessage(
            "💰 你说没事，王医生摇摇头走开了。好感-2。",
            "warning",
          );
        },
      },
    ],
  });

  // 王医生的医疗人脉 — 好感≥40时推荐便宜诊所
  RANDOM_EVENTS.push({
    id: "dr_wang_clinic_referral",
    phase: "street",
    icon: "📋",
    title: "便宜诊所推荐",
    story:
      "王医生下班时叫住你：「城东新开了家社区诊所，收费便宜设备也新。我跟那边主任打过招呼了，你去报我名字能打八折。」\n\n他把地址写在处方笺上递过来，又补充道：「小病去那看就行，别动不动往大医院跑，贵。」",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.dr_wang) return false;
      if (!st.relationships.dr_wang.met) return false;
      if ((st.relationships.dr_wang.affinity || 0) < 40) return false;
      if (st.flags._drWangClinicReferral) return false;
      if (st.player.day < 15) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🙏 谢谢，我去看看",
        hint: "医疗费用-20%持续30天",
        apply: function (st) {
          st.flags._drWangClinicReferral = true;
          st.flags.wangClinicDiscount = true;
          if (!st._clinicDiscountDays) st._clinicDiscountDays = 0;
          st._clinicDiscountDays = Math.max(st._clinicDiscountDays, 30);
          StateManager.addMessage(
            "📋 你收下地址，下次看病可以省一笔。医疗费用-20%，持续30天。",
            "success",
          );
        },
      },
      {
        text: "📱 记下来，以后再说",
        hint: "保留机会",
        apply: function (st) {
          st.flags._drWangClinicReferral = true;
          StateManager.addMessage(
            "📱 你把地址拍下来存好。王医生拍拍你：「别硬扛，该看就看。」",
            "info",
          );
        },
      },
    ],
  });

  // ================================================================
  // 空白区填充 Batch 2：5个新联动事件（v3.21 新增）
  // 场景5：债务清零 → 轻装上阵（重大人生转折）
  // 场景6：技能50+ 职业尊严 → 社会认可事件
  // 场景7：季节×住所×天气三重联动 → 寒冬庇护
  // 场景8：连续多天同一行动 → 肌肉记忆/习惯事件
  // 场景9：父母生日/节日关怀 → 家庭系统联动
  // ================================================================

  // 场景5：债务清零 — 轻装上阵
  // 设计意图：还清债务是游戏中最重要的里程碑之一，但目前缺少庆祝/反思事件
  RANDOM_EVENTS.push({
    id: "debt_freed_light_step",
    phase: "street",
    icon: "🎉",
    title: "终于还清了",
    story:
      "你打开手机银行，看到最后一个还款通知：「您的贷款已全部结清。」\n\n你站在路边愣了很久。从第一天被催债短信吓醒，到现在终于一身轻松——这笔钱花掉了你整整大半年的收入。\n\n街边的早餐摊飘来香味，你忽然觉得今天的阳光格外好。",
    // [自洽新增] conditions：债务清零 + 之前有还款记录 + 游戏≥30天
    conditions: function (st) {
      var debt = st.resources.debt || 0;
      if (debt > 0) return false;
      if (!st.flags._paidOffAnyDebt) return false;
      if (st.flags._debtFreedSeen) return false;
      if (st.player.day < 30) return false;
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🍜 吃顿好的庆祝一下",
        hint: "花¥200犒劳自己",
        apply: function (st) {
          st.flags._debtFreedSeen = true;
          st.flags._paidOffAnyDebt = true;
          if (st.resources.cash >= 200) {
            st.resources.cash -= 200;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 20);
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            StateManager.addMessage(
              "🍜 你走进一家平时舍不得去的餐馆，点了两个菜一瓶饮料。吃饱喝足走出门，感觉整个人都轻了。心情+20，疲劳-10。",
              "success",
            );
          } else {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
            StateManager.addMessage(
              "🍜 你想吃顿好的庆祝，但口袋里只剩几十块。算了，明天再补。心情+8。",
              "info",
            );
          }
        },
      },
      {
        text: "📞 给家里打个电话",
        hint: "报喜不报忧",
        apply: function (st) {
          st.flags._debtFreedSeen = true;
          st.flags._paidOffAnyDebt = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "📞 你拨通了家里的电话。妈问最近怎么样，你说「挺好的，一切都好」——这是你第一次可以说这句真话。心情+15，心智+5。",
            "success",
          );
        },
      },
      {
        text: "💪 继续攒钱，目标更远",
        hint: "稳扎稳打",
        apply: function (st) {
          st.flags._debtFreedSeen = true;
          st.flags._paidOffAnyDebt = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "💪 你深吸一口气，把手机放回口袋。没有庆祝，没有停顿——下一步是攒第一笔存款。心态稳了，路就长了。心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // 场景6：技能50+ → 职业尊严（社会认可）
  // 设计意图：玩家在某技能上投入大量时间后，获得来自社会的正向反馈
  // 这是禀赋效应的叙事体现——玩家对自己培养的技能产生情感依附
  RANDOM_EVENTS.push({
    id: "skill_milestone_recognition",
    phase: "street",
    icon: "⭐",
    title: "高手的名号",
    story:
      "你在街上修东西的事传开了。今天有个穿西装的人走过来，递上一张名片：「听说你这儿什么都能修？我公司设备老坏，能不能请你去看看？一个月¥3000，兼职。」\n\n你看了看名片上的公司名——居然是个正经企业。",
    // [自洽新增] conditions：任一技能≥50 且 街头阶段
    conditions: function (st) {
      if (st.player.phase !== "street") return false;
      if (st.flags._skillMilestoneSeen) return false;
      if (st.player.day < 40) return false;
      if (!st.skills) return false;
      var skilledSkills = [];
      for (var sk in st.skills) {
        if (st.skills[sk] && st.skills[sk].level >= 50) {
          skilledSkills.push(sk);
        }
      }
      if (skilledSkills.length === 0) return false;
      st._skillMilestoneTrigger = skilledSkills[0];
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🤝 接了这份兼职",
        hint: "月收入+3000",
        apply: function (st) {
          st.flags._skillMilestoneSeen = true;
          st.flags._skillMilestoneSkill = st._skillMilestoneTrigger || "repair";
          st.flags._monthlySkilledGig = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          StateManager.addMessage(
            "⭐ 你接下了这份兼职。技能" +
              (st._skillMilestoneTrigger || "修理") +
              "达到专业水平，开始获得市场认可。名气+5，心情+12。",
            "success",
          );
        },
      },
      {
        text: "📋 先了解工作内容再决定",
        hint: "谨慎起见",
        apply: function (st) {
          st.flags._skillMilestoneSeen = true;
          st.flags._skillMilestoneSkill = st._skillMilestoneTrigger || "repair";
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "📋 你接过名片仔细看了看。技能" +
              (st._skillMilestoneTrigger || "修理") +
              "确实练出来了，但兼职也得看合不合适。心智+3。",
            "info",
          );
        },
      },
      {
        text: "🙋 谢谢，但想自己开店",
        hint: "志向更大",
        apply: function (st) {
          st.flags._skillMilestoneSeen = true;
          st.flags._skillMilestoneSkill = st._skillMilestoneTrigger || "repair";
          st.flags._wantOwnShop = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "🙋 你说想自己开店。西装男愣了一下，笑了：「有野心是好事。」技能" +
              (st._skillMilestoneTrigger || "修理") +
              "的自信在你心里种下了种子。心智+5。",
            "success",
          );
        },
      },
    ],
  });

  // 场景7：季节×住所×天气三重联动 → 寒冬庇护
  // 设计意图：寒冬天气下，不同住所条件的玩家体验完全不同
  // 露宿=生死考验，合租=勉强过关，独居以上=舒适享受
  RANDOM_EVENTS.push({
    id: "cold_snap_housing_crisis",
    phase: "street",
    icon: "🥶",
    title: "寒潮来袭",
    story:
      "气象台发布了寒潮蓝色预警：未来三天最低气温降至零下10度。寒风像刀子一样割在脸上，街上的行人都裹紧了衣服。\n\n你看了看自己住的地方——",
    // [自洽新增] conditions：雪天/暴雨天气 + 住所≤豪华公寓以下
    conditions: function (st) {
      if (st.weather && st.weather.current === "heatwave") return false;
      var isColdWeather =
        st.weather &&
        (st.weather.current === "snowy" || st.weather.current === "stormy");
      if (!isColdWeather) return false;
      if (st.player.day < 5) return false;
      var housingTier =
        st.housing && st.housing.tier !== undefined ? st.housing.tier : 0;
      if (housingTier > 4) return false;
      if (st.flags._coldSnapHousingSeen) return false;
      return true;
    },
    probability: 0.06,
    repeatable: true,
    choices: function (st) {
      var housingTier =
        st.housing && st.housing.tier !== undefined ? st.housing.tier : 0;

      if (housingTier === 0) {
        return [
          {
            text: "🏚️ 找个桥洞凑合一晚",
            hint: "健康-12，但免费",
            apply: function (s) {
              s.flags._coldSnapHousingSeen = true;
              s.status.health = Math.max(0, (s.status.health || 70) - 12);
              s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 15);
              StateManager.addMessage(
                "🏚️ 桥洞里的风像冰锥一样扎人。你裹着所有衣服蜷缩了一夜，早上起来浑身僵硬。健康-12，疲劳+15。",
                "danger",
              );
            },
          },
          {
            text: "🏪 24小时便利店熬一晚",
            hint: "花¥30买咖啡，健康-3",
            cost: 30,
            apply: function (s) {
              s.flags._coldSnapHousingSeen = true;
              if (s.resources.cash >= 30) {
                s.resources.cash -= 30;
                s.status.health = Math.max(0, (s.status.health || 70) - 3);
                s.needs.happiness = Math.min(
                  100,
                  (s.needs.happiness || 50) + 5,
                );
                StateManager.addMessage(
                  "🏪 你买了杯热咖啡在便利店坐到天亮。虽然被保安赶了两次，但至少没冻着。健康-3，心情+5。",
                  "info",
                );
              } else {
                s.status.health = Math.max(0, (s.status.health || 70) - 8);
                StateManager.addMessage(
                  "🏪 你没钱买咖啡，只能在便利店门口站着。店员看你可怜，给了你半杯剩咖啡。健康-8。",
                  "warning",
                );
              }
            },
          },
        ];
      }

      if (housingTier === 1 || housingTier === 2) {
        return [
          {
            text: "🔥 把暖气开到最大",
            hint: "花¥50电费，但温暖",
            cost: 50,
            apply: function (s) {
              s.flags._coldSnapHousingSeen = true;
              if (s.resources.cash >= 50) {
                s.resources.cash -= 50;
                s.needs.happiness = Math.min(
                  100,
                  (s.needs.happiness || 50) + 10,
                );
                s.status.health = Math.min(100, (s.status.health || 70) + 5);
                StateManager.addMessage(
                  "🔥 你把暖气开到最大，房间里终于有了温度。虽然电费账单会让人心痛，但今晚能睡个好觉了。心情+10，健康+5。",
                  "success",
                );
              } else {
                s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 5);
                StateManager.addMessage(
                  "🔥 你想开暖气，但余额不够交电费。只能多盖一层被子。心情-5。",
                  "warning",
                );
              }
            },
          },
          {
            text: "🛏️ 裹紧被子硬扛",
            hint: "免费，但睡眠差",
            apply: function (s) {
              s.flags._coldSnapHousingSeen = true;
              s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 8);
              s.status.health = Math.max(0, (s.status.health || 70) - 3);
              StateManager.addMessage(
                "🛏️ 你裹紧被子，但寒气还是从墙壁渗进来。一夜没睡踏实，早上起来浑身酸痛。健康-3，疲劳+8。",
                "info",
              );
            },
          },
        ];
      }

      // 一居室及以上
      return [
        {
          text: "🍲 煮碗热汤面犒劳自己",
          hint: "花¥20，心情+10",
          cost: 20,
          apply: function (s) {
            s.flags._coldSnapHousingSeen = true;
            if (s.resources.cash >= 20) {
              s.resources.cash -= 20;
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 10);
              s.needs.hunger = Math.min(100, (s.needs.hunger || 50) + 15);
              StateManager.addMessage(
                "🍲 你煮了一碗热腾腾的汤面，加了鸡蛋和青菜。窗外的寒风和你碗里的热气形成两个世界。心情+10。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🍲 你想煮碗面，但连面条的钱都没有了。泡了杯热水凑合。",
                "warning",
              );
            }
          },
        },
        {
          text: "📱 给老家打个电话问候",
          hint: "亲情温暖，心情+8",
          apply: function (s) {
            s.flags._coldSnapHousingSeen = true;
            s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 8);
            s.player.mental = Math.min(100, (s.player.mental || 0) + 4);
            StateManager.addMessage(
              "📱 你拨通了家里的电话。妈妈说「天冷了多穿点」，你鼻子一酸。挂了电话后，房间好像没那么冷了。心情+8，心智+4。",
              "success",
            );
          },
        },
      ];
    },
  });

  // 场景8：连续多天同一行动 → 肌肉记忆/习惯事件
  // 设计意图：玩家反复做同一件事后，系统给予叙事反馈
  // 这是对"刻意练习"概念的 gamification 体现
  RANDOM_EVENTS.push({
    id: "muscle_memory_breakthrough",
    phase: "street",
    icon: "💪",
    title: "肌肉记住了",
    story:
      "你已经连续一周做同样的事了。今天，你突然发现——不用思考，手自己就知道该怎么做了。\n\n就像骑自行车一样，某些动作已经刻进了肌肉记忆里。你低头看了看自己的手，它们好像有了自己的意志。",
    // [自洽新增] conditions：任一行动类型累计≥50次
    conditions: function (st) {
      if (st.flags._muscleMemorySeen) return false;
      if (st.player.day < 20) return false;
      if (!st.stats || !st.stats.actionFreq) return false;
      var maxFreq = 0;
      var maxAction = "";
      for (var act in st.stats.actionFreq) {
        if (st.stats.actionFreq[act] > maxFreq) {
          maxFreq = st.stats.actionFreq[act];
          maxAction = act;
        }
      }
      if (maxFreq < 50) return false;
      st._muscleMemoryAction = maxAction;
      st._muscleMemoryFreq = maxFreq;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🧠 趁热打铁，继续练",
        hint: "相关技能+25XP",
        apply: function (st) {
          st.flags._muscleMemorySeen = true;
          var action = st._muscleMemoryAction || "unknown";
          var skillMap = {
            manual_labor_construction: "physique",
            waste_recycling: "physique",
            food_stall: "cooking",
            street_vending_goods: "sales",
            delivery_rider: "driving",
            courier_gig: "agility",
          };
          var skillName = skillMap[action] || "physique";
          if (st.skills && st.skills[skillName]) {
            st.skills[skillName].xp = Math.min(
              1000,
              (st.skills[skillName].xp || 0) + 25,
            );
            StateManager.addMessage(
              "💪 你决定继续练。" +
                action +
                "你已经做了" +
                (st._muscleMemoryFreq || 0) +
                "次——肌肉记住了。" +
                skillName +
                "经验+25。",
              "success",
            );
          } else {
            st.player.physique = Math.min(100, (st.player.physique || 20) + 2);
            StateManager.addMessage(
              "💪 你继续练。" +
                action +
                "你已经做了" +
                (st._muscleMemoryFreq || 0) +
                "次——肌肉记住了。体质+2。",
              "success",
            );
          }
        },
      },
      {
        text: "🔄 换个新活试试",
        hint: "探索新方向",
        apply: function (st) {
          st.flags._muscleMemorySeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "🔄 你觉得该换个口味了。" +
              (st._muscleMemoryAction || "之前的活") +
              "练得够多了，是时候看看别的可能。心情+5，心智+3。",
            "info",
          );
        },
      },
      {
        text: "📝 记录心得，总结经验",
        hint: "智力+2，获得长期buff",
        apply: function (st) {
          st.flags._muscleMemorySeen = true;
          st.flags._muscleMemoryNotes = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 20) + 2,
          );
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "📝 你坐下来把这段时间的经验写成笔记。" +
              (st._muscleMemoryAction || "这份工作") +
              "的门道你摸透了。智力+2，心智+5。",
            "success",
          );
        },
      },
    ],
  });

  // 场景9：父母生日关怀 → 家庭系统联动
  // 设计意图：父母的生日/节日是游戏中少有的情感锚点，缺少叙事反馈
  // 连接"家庭系统"与"情感需求系统"的桥梁事件
  RANDOM_EVENTS.push({
    id: "parent_birthday_call",
    phase: "street",
    icon: "📞",
    title: "爸妈的电话",
    story:
      "手机响了。屏幕上跳动着「爸」两个字。\n\n你接起来，那边传来父亲熟悉的声音：「最近怎么样啊？吃得好不好？天冷了多穿点。」\n\n你看了看日历——今天是他们的结婚纪念日，也是母亲的生日。你差点忘了。",
    // [自洽新增] conditions：家庭系统存在 + 周末触发
    conditions: function (st) {
      if (!st.family) return false;
      if (st.flags._parentBirthdayCallSeen) return false;
      if (st.player.day < 15) return false;
      var isWeekend = st.player.day % 7 === 0 || st.player.day % 7 === 6;
      return isWeekend;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🎂 订个蛋糕寄回去",
        hint: "花¥150，家人陪伴↑",
        cost: 150,
        apply: function (st) {
          st.flags._parentBirthdayCallSeen = true;
          if (st.resources.cash >= 150) {
            st.resources.cash -= 150;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            if (st.family && st.family.parents) {
              st.family.parents.father.companionship = Math.min(
                100,
                (st.family.parents.father.companionship || 10) + 15,
              );
              st.family.parents.mother.companionship = Math.min(
                100,
                (st.family.parents.mother.companionship || 10) + 15,
              );
            }
            StateManager.addMessage(
              "🎂 你订了一个蛋糕寄回老家。妈妈打来电话说爸爸感动得不得了。你听着电话那头的笑声，觉得¥150花得值。心情+15，家人陪伴+15。",
              "success",
            );
          } else {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
            StateManager.addMessage(
              "🎂 你想订个蛋糕，但算了算余额不够。只能打电话祝生日快乐。心情-5。",
              "warning",
            );
          }
        },
      },
      {
        text: "📞 陪他们聊久一点",
        hint: "免费，但情感满足",
        apply: function (st) {
          st.flags._parentBirthdayCallSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 8);
          if (st.family && st.family.parents) {
            st.family.parents.father.companionship = Math.min(
              100,
              (st.family.parents.father.companionship || 10) + 8,
            );
            st.family.parents.mother.companionship = Math.min(
              100,
              (st.family.parents.mother.companionship || 10) + 8,
            );
          }
          StateManager.addMessage(
            "📞 你和爸妈聊了一个小时。从工作聊到邻居家的小事，最后爸爸说「累了就回家」。你挂断电话，眼眶有点热。心情+12，心智+8。",
            "success",
          );
        },
      },
      {
        text: "😶 随便聊几句就挂了",
        hint: "匆忙，省时间",
        apply: function (st) {
          st.flags._parentBirthdayCallSeen = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 3);
          StateManager.addMessage(
            "😶 你说「还行，忙呢」就挂了电话。妈妈还想说什么，你已经把手机塞回了口袋。明天可能会后悔。心情-3。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== NPC事件空白区填充：小陈/赵姐相关事件 ======
  // 小陈的夜宵局 — 好感≥30时邀请宵夜，社交+副业两不误
  RANDOM_EVENTS.push({
    id: "xiaochen_night_market",
    phase: "street",
    icon: "🍜",
    title: "骑手的深夜食堂",
    story:
      "晚上十一点，你看到小陈蹲在路边的电瓶车上扒拉盒饭。他看到你，扬了扬手里的筷子：「跑完了？来，这条街有家通宵面馆，老板手艺不错，我请你。」\n\n他的电瓶车灯在夜色里一闪一闪的。",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.xiaochen) return false;
      if (!st.relationships.xiaochen.met) return false;
      if ((st.relationships.xiaochen.affinity || 0) < 30) return false;
      if (st.flags._xiaochenNightMarketSeen) return false;
      if (st.player.day < 5) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🍜 一起去，聊聊",
        hint: "心情+ 好感+ 副业灵感",
        apply: function (st) {
          st.flags._xiaochenNightMarketSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 25);
          st.relationships.xiaochen.affinity = Math.min(
            100,
            st.relationships.xiaochen.affinity + 5,
          );
          if (st.skills && st.skills.driving) {
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 15;
          }
          StateManager.addMessage(
            "🍜 你们边吃边聊，小陈说了几个跑单窍门。心情+12，饱食-25，好感+5。",
            "success",
          );
        },
      },
      {
        text: "😅 太累了，回去睡了",
        hint: "保留体力",
        apply: function (st) {
          st.flags._xiaochenNightMarketSeen = true;
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
          StateManager.addMessage(
            "😅 你说改天吧，小陈也没勉强：「早点休息，明天还要跑呢。」",
            "info",
          );
        },
      },
    ],
  });

  // 赵姐的商业情报 — 好感≥50时分享商业区铺面信息
  RANDOM_EVENTS.push({
    id: "zhaojie_shop_tip",
    phase: "street",
    icon: "🏪",
    title: "赵姐的内幕消息",
    story:
      "赵姐神神秘秘地把你拉到一边，压低声音说：「商业区有家奶茶店要转让，老板娘怀孕回老家了，设备都是九成新。我跟她熟，你要是想干，十万块就能盘下来——正常价至少十五万。」\n\n她拍了拍你的肩：「机会难得，自己琢磨琢磨。」",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.zhaojie) return false;
      if (!st.relationships.zhaojie.met) return false;
      if ((st.relationships.zhaojie.affinity || 0) < 50) return false;
      if (st.flags._zhaojieShopTipSeen) return false;
      if (st.player.day < 30) return false;
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "💰 盘下来！",
        hint: "现金-100000 解锁店面",
        apply: function (st) {
          st.flags._zhaojieShopTipSeen = true;
          if ((st.resources.cash || 0) >= 100000) {
            st.resources.cash -= 100000;
            st.flags._hasShop = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
            st.relationships.zhaojie.affinity = Math.min(
              100,
              st.relationships.zhaojie.affinity + 8,
            );
            StateManager.addMessage(
              "💰 你盘下了奶茶店！设备齐全，位置也不错。赵姐替你高兴：「好好干！」名气+10。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "💸 你算了算存款，差了八万。赵姐看出你的窘迫：「差多少姐帮你垫点？」但你不想欠太多人情。",
              "warning",
            );
          }
        },
      },
      {
        text: "📝 先看看，钱不够",
        hint: "保留机会，记下信息",
        apply: function (st) {
          st.flags._zhaojieShopTipSeen = true;
          st.flags._zhaojieShopDeal = true;
          StateManager.addMessage(
            "📝 你记下赵姐说的联系方式，说等凑够钱再联系。她点点头：「别太久，好铺子不等人。」",
            "info",
          );
        },
      },
    ],
  });

  // 陈哥的经验之谈 — 好感≥35时分享工地/工厂人脉
  RANDOM_EVENTS.push({
    id: "chen_ge_connections",
    phase: "street",
    icon: "🤝",
    title: "陈哥的人脉",
    story:
      "陈哥叼着烟在街角蹲着，看到你过来招了招手：「小子，听说你最近在找活？我认识城东一个工头，最近缺人，一天¥280管一顿饭。你去了报我名字，他不敢压你价。」\n\n他把烟头摁灭，又补了一句：「别跟人说是我介绍的，我不想欠他人情。」",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.chen_ge) return false;
      if (!st.relationships.chen_ge.met) return false;
      if ((st.relationships.chen_ge.affinity || 0) < 35) return false;
      if (st.flags._chenGeConnectionsSeen) return false;
      if (st.player.day < 15) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🙏 谢谢陈哥，我去",
        hint: "现金+280 名声+",
        apply: function (st) {
          st.flags._chenGeConnectionsSeen = true;
          st.resources.cash = (st.resources.cash || 0) + 280;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + 280;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.relationships.chen_ge.affinity = Math.min(
            100,
            st.relationships.chen_ge.affinity + 5,
          );
          StateManager.addMessage(
            "🤝 你按陈哥说的去了工地，果然缺人。工头听说你是陈哥介绍的，多给了你¥30。现金+280，名声+3。",
            "success",
          );
        },
      },
      {
        text: "📱 记下联系方式",
        hint: "保留机会",
        apply: function (st) {
          st.flags._chenGeConnectionsSeen = true;
          st.flags._chenGeContact = true;
          StateManager.addMessage(
            "📱 你说改天去，陈哥把号码发给你了：「别拖太久，活不等人。」",
            "info",
          );
        },
      },
    ],
  });

  // 阿杰的创业邀约 — 好感≥40时邀请一起搞副业
  RANDOM_EVENTS.push({
    id: "ajie_side_project",
    phase: "street",
    icon: "💡",
    title: "阿杰的点子",
    story:
      "阿杰突然在微信上找你，发了一长串语音。你点开听，他声音里带着兴奋：「老同学，我最近在搞一个二手手机翻新的项目，利润空间很大。一台手机收过来¥200，翻新一下能卖¥500。你要不要一起干？你出人手我出渠道，五五分成。」\n\n他发来几张翻新后的手机照片，看起来确实不错。",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.ajie) return false;
      if (!st.relationships.ajie.met) return false;
      if ((st.relationships.ajie.affinity || 0) < 40) return false;
      if (st.flags._ajieSideProjectSeen) return false;
      if (st.player.day < 20) return false;
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "💪 一起干！",
        hint: "现金+ 技能+ 启动副业",
        apply: function (st) {
          st.flags._ajieSideProjectSeen = true;
          st.flags._ajiePartnership = true;
          var profit = Random.int(200, 500);
          st.resources.cash = (st.resources.cash || 0) + profit;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
          st.relationships.ajie.affinity = Math.min(
            100,
            st.relationships.ajie.affinity + 8,
          );
          if (st.skills && st.skills.repair) {
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 20;
          }
          StateManager.addMessage(
            "💪 你和阿杰合伙干了一周，翻新了5台手机，净赚¥" +
              profit +
              "！维修XP+20，阿杰好感+8。",
            "success",
          );
        },
      },
      {
        text: "🤔 我先看看",
        hint: "观望，保留机会",
        apply: function (st) {
          st.flags._ajieSideProjectSeen = true;
          StateManager.addMessage(
            "🤔 你说先看看市场。阿杰也不急：「行，你想好了跟我说。」",
            "info",
          );
        },
      },
    ],
  });

  // ====== 注册结束 ======
})();

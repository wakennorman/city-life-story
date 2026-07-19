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
      // [conditions→triggers]
      triggers: {
        relationshipMet: "aunt_wang",
        relationshipAffinityMin: [{ id: "aunt_wang", min: 30 }],
        minDay: 11,
      },
      // conditions removed — fully migrated to triggers
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
      // [conditions→triggers] 部分迁移：day 移入 triggers，_worldParams/location 保留
      triggers: { minDay: 21 },
      conditions: function (st) {
        if (!st._worldParams) return false;
        if (!st.trade) return false;
        return (
          st._worldParams.marketMood === "bearish" &&
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
                `💰 抄底成功！你低买高卖赚了¥${profit}！`,
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
      // [conditions→triggers] 部分迁移：day+flag 移入 triggers，location 检查保留
      triggers: { minDay: 6, excludeFlags: ["_foundATMCash"] },
      conditions: function (st) {
        return st.trade && st.trade.currentLocation === "commercialDist";
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
              `💸 你捡起钱快步走了。¥${amount}到手，但心里有点虚...`,
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
      // [conditions→triggers] 全量迁移
      triggers: {
        relationshipMet: "old_zhou",
        relationshipAffinityMin: [{ id: "old_zhou", min: 40 }],
        minDay: 16,
      },
      // [删除] conditions 全量迁移至 triggers
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
              `💰 你出了¥100入伙费，分到¥${profit}。老周拍了拍你的肩。`,
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
      // [conditions→triggers] 部分迁移：phase+weather+day 移入 triggers，location 保留
      triggers: {
        phase: "street",
        weather: ["foggy", "heavy_smog"],
        minDay: 20,
      },
      conditions: function (st) {
        var curLoc = st.trade && st.trade.currentLocation;
        return curLoc === "wholesaleMarket";
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
      // [conditions→triggers] 部分迁移：phase+relationship+day 移入 triggers，discovered 保留
      triggers: {
        phase: "street",
        relationshipMet: "aunt_wang",
        relationshipAffinityMin: [{ id: "aunt_wang", min: 50 }],
        minDay: 60,
      },
      conditions: function (st) {
        var rel = st.relationships && st.relationships.aunt_wang;
        return rel && rel.discovered && !rel.discovered._ledgerSecret;
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
      // [conditions→triggers] 部分迁移：phase+day+flag 移入 triggers，totalEarned/fame 保留
      triggers: {
        phase: "street",
        minDay: 100,
        excludeFlags: ["_veteranWelcomeSeen"],
      },
      conditions: function (st) {
        return (st.resources.totalEarned || 0) >= 20000 && st.player.fame >= 15;
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
      // [conditions→triggers] 部分迁移：phase+weather+day 移入 triggers，employment 检查保留
      triggers: { phase: "street", weather: "heatwave", minDay: 30 },
      conditions: function (st) {
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
        return isOutdoor;
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
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50); // [全系统自洽修复] 域B 修复:cost扣款缺失
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
      phase: "corporate",
      conditions: function (st) {
        return (
          st.career &&
          st.career.currentJob &&
          st.career.currentJob.workDays > 180
        );
      },
      probability: 0.03,
      repeatable: true,
      story:
        "你在一家咖啡厅面试时，一个自称「某某科技」的猎头凑过来递名片。「以你的资历，在现在的岗位上屈才了。来我们这，薪资翻倍+期权。」",
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
      phase: "corporate",
      // [conditions→triggers] 部分迁移：day 移入 triggers，career 检查保留
      triggers: { minDay: 91 },
      conditions: function (st) {
        return st.career && st.career.currentJob;
      },
      probability: 0.015,
      repeatable: true,
      story:
        "公司突然宣布裁员！听说HR手里有一份名单，业务线要砍掉30%的人。茶水间的气氛比殡仪馆还沉重。",
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
      // [conditions→triggers] 全量迁移
      triggers: { minDay: 201, minCash: 50001 },
      // [删除] conditions 全量迁移至 triggers
      probability: 0.02,
      repeatable: false,
      story:
        "新闻里铺天盖地地报道经济下行周期来临。分析师说可能持续6-12个月，各行各业都在收缩。你的投资组合和收入可能受到影响。",
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
                  inv.stockMarket && inv.stockMarket[h.symbol]
                    ? inv.stockMarket[h.symbol].price
                    : h.avgPrice || 0;
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
      // [conditions→triggers] 全量迁移
      triggers: { minDay: 301, minCash: 500001 },
      // [删除] conditions 全量迁移至 triggers
      probability: 0.04,
      repeatable: true,
      story:
        "你收到一封税务局的通知信。信中暗示你的资产状况引起了注意，建议你主动申报资产并进行税务规划。",
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
      story:
        "暴雨如注，街上行人稀少。你躲在屋檐下躲雨，心里盘算着今天该做什么。这时候你看到环卫工人撑着垃圾袋艰难前行，有人在暴雨中打车打不到。",
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
      // [conditions→triggers] 全量迁移
      triggers: {
        relationshipMet: "aunt_wang",
        relationshipAffinityMin: [{ id: "aunt_wang", min: 40 }],
        minDay: 30,
        maxDay: 90,
      },
      // [删除] conditions 全量迁移至 triggers
      probability: 0.03,
      repeatable: false,
      story:
        "王大婶在楼道里叫住你：'我一个亲戚在城中村有个单间空着，¥500一个月押一付三，条件一般但能遮风挡雨，要不要去看看？'",
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
      story:
        "在公园的长椅上，你遇到了一位白发老师傅。他看到你手中的工具/书籍，眼睛一亮：'年轻人，你也在学这个？我干这个四十多年了，有些心得可以聊聊。'",
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
      story:
        "张姐神色疲惫地找到你：'厂里效益不行了，今天通知裁一批人……我可能也在名单上。'她的眼眶有些红。",
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
            if (social >= 30) {
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
      story:
        "科技园门口聚集了一大堆白领在刷手机等下班。你注意到有人在摆摊卖手机配件，生意火爆。你摸了摸口袋里的智能手机，心想自己要不要也试试。",
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
      story:
        "换季了，天气忽冷忽热。你感觉有点不对劲，周围不少人在咳嗽。你的身体底子本来就不算好，这个季节得格外注意。",
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
      // [conditions→triggers] 全量迁移
      triggers: {
        relationshipMet: "old_zhou",
        relationshipAffinityMin: [{ id: "old_zhou", min: 60 }],
        minDay: 121,
      },
      // [删除] conditions 全量迁移至 triggers
      probability: 0.03,
      repeatable: false,
      story:
        "老周兴冲冲地找到你：'小子，有个大活儿！工业区那边有一批废金属要处理，量很大，我一个人忙不过来。要是干得好，够咱们吃一个月！'",
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
            if (social >= 25) {
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
      story:
        "小美兴冲冲地给你看手机：'我在一个APP上接单，帮人做PPT和表格，一单能赚几十块！要不要一起干？我可以教你。'",
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
            // [全系统自洽修复] 域B 修复: st.morality 应为 st.player.morality（裸根导致道德-1失效）
            if (st.player.morality !== undefined) {
              st.player.morality = Math.max(-100, st.player.morality - 1);
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

    // ====== 图书馆联动事件 ======
    // 事件：图书馆首访发现
    // 设计意图：玩家第一次到达图书馆时触发，建立图书馆作为「知识圣地」的认知锚点
    {
      id: "library_first_discovery",
      phase: "street",
      icon: "📖",
      title: "图书馆的静谧角落",
      story: `推开门，一股旧纸墨香扑面而来。图书馆不大，但很安静——几个学生在角落里写作业，一个老人在报刊区戴着老花镜看报。\n\n你沿着书架慢慢走，指尖划过书脊。有些书名你听说过，有些完全陌生。在「实用技能」区域，你发现了一本翻得很旧的书，封面贴着好几张补丁胶带。\n\n管理员大姐抬头看了你一眼：「新来的？办个读者证吧，免费的。」`,
      conditions: function (st) {
        var curLoc = st.trade && st.trade.currentLocation;
        return (
          st.player.phase === "street" &&
          st.player.day >= 3 &&
          curLoc === "library" &&
          !st.flags._libraryDiscovered
        );
      },
      probability: 0.08,
      repeatable: false,
      choices: [
        {
          text: "📋 办读者证（免费）",
          hint: "解锁自学效率+15%",
          apply: function (st) {
            st.flags._libraryDiscovered = true;
            st.flags._libraryCard = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            StateManager.addMessage(
              "📖 办了读者证！以后可以免费借书了。智力+1，图书馆学习效率提升。",
              "success",
            );
          },
        },
        {
          text: "🔍 先随便逛逛",
          hint: "熟悉环境",
          apply: function (st) {
            st.flags._libraryDiscovered = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "🔍 你在图书馆里逛了一圈，记住了各类书籍的位置。以后有需要可以来找资料。心情+5。",
              "info",
            );
          },
        },
        {
          text: "🙅 还是走吧，没心情",
          hint: "放弃，不来电",
          apply: function (st) {
            st.flags._libraryDiscovered = true;
            st.flags._skippedLibrary = true;
            StateManager.addMessage(
              "你转身走出图书馆。外面车水马龙，和里面的安静仿佛两个世界。",
              "info",
            );
          },
        },
      ],
    },

    // 事件：图书馆旧书发现
    // 设计意图：老玩家的偶然发现——在图书馆找到一本绝版旧书，既升级技能又收获情感价值
    {
      id: "library_rare_book_find",
      phase: "street",
      icon: "📕",
      title: "旧书堆里的宝藏",
      story: `你在图书馆角落的「待处理旧书」堆里翻找，手指碰到一本沾了灰的旧书。\n\n擦掉灰尘，书名是《城市生存手册（2008年版）》。翻了翻，里面密密麻麻写满了前主人的批注——哪些工地招工不坑人、哪条街的包子便宜又实在、冬天在哪过夜不会被城管撵……\n\n书页间还夹着一张泛黄的纸条：「致下一个需要帮助的人——这座城市很难，但你比它想象的更硬。」`,
      conditions: function (st) {
        var curLoc = st.trade && st.trade.currentLocation;
        return (
          st.player.phase === "street" &&
          st.player.day >= 15 &&
          curLoc === "library" &&
          st.flags._libraryDiscovered &&
          !st.flags._libraryRareBookFound
        );
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "📕 仔细阅读，记笔记",
          hint: "生存经验+工作收入永久+8%",
          apply: function (st) {
            st.flags._libraryRareBookFound = true;
            st.flags._citySurvivalGuide = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            StateManager.addMessage(
              "📕 你花了整个下午抄写笔记。这本旧书里全是真·生存智慧。智力+2，心情+8。获得了「城市生存指南」——街头工作收入+8%！",
              "success",
            );
          },
        },
        {
          text: "🔖 收好纸条，书放回去",
          hint: "收获心灵安慰",
          apply: function (st) {
            st.flags._libraryRareBookFound = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            st.status.health = Math.min(100, (st.status.health || 50) + 3);
            StateManager.addMessage(
              "🔖 你把纸条小心折好放进口袋。那句「你比它想象的更硬」让你心里一暖。心情+15，健康+3。",
              "success",
            );
          },
        },
        {
          text: "📱 拍照发朋友圈",
          hint: "社交分享，小有名气",
          apply: function (st) {
            st.flags._libraryRareBookFound = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            StateManager.addMessage(
              "📱 你把旧书和纸条拍了照发到网上，配文「来自2008年的城市生存指南」。收获了不少点赞和共鸣。名声+3，心情+6。",
              "success",
            );
          },
        },
      ],
    },

    // 事件：图书馆管理员的好意
    // 设计意图：持续光顾图书馆后与管理员的社交互动，体现NPC关系网扩展
    {
      id: "library_librarian_friendship",
      phase: "street",
      icon: "👩‍💼",
      title: "管理员的悄悄话",
      story: `你来图书馆次数多了，管理员大姐已经认得你。\n\n这天她趁没人时悄悄塞给你一张纸条：「下周市里有个免费的职业技能培训班，就在图书馆三楼报告厅。我帮你留了个名额。」\n\n她眨眨眼：「我看你是真在认真学，不像有些人来蹭空调睡觉的。」`,
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          st.flags._libraryDiscovered &&
          st.flags._libraryCard &&
          !st.flags._libraryTrainingOffer &&
          st.player.intelligence >= 25
        );
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🎓 太好了，我一定去",
          hint: "参加培训，双技能+50XP",
          apply: function (st) {
            st.flags._libraryTrainingOffer = true;
            var skills = Object.keys(st.skills);
            var k1 = Random.fromArray(skills);
            var k2 = Random.fromArray(
              skills.filter(function (s) {
                return s !== k1;
              }),
            );
            if (k2) {
              st.skills[k1].xp += 50;
              st.skills[k2].xp += 50;
              StateManager.addMessage(
                "🎓 培训课太值了！" +
                  k1 +
                  " XP+50，" +
                  k2 +
                  " XP+50。管理员大姐看到你认真学习的样子，满意地点了点头。好感+5。",
                "success",
              );
            } else {
              st.skills[k1].xp += 50;
              StateManager.addMessage(
                "🎓 培训课收获满满，" + k1 + " XP+50！管理员大姐点头微笑。",
                "success",
              );
            }
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
          },
        },
        {
          text: "🙏 谢谢姐，但我时间紧",
          hint: "婉拒但留个人情",
          apply: function (st) {
            st.flags._libraryTrainingOffer = true;
            StateManager.addMessage(
              "管理员大姐摆摆手：「没事，机会以后还有。你要是有空随时来找我。」人情留下了。",
              "info",
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
  CROSS_EVENTS.push(
    // ===== 事件1：新闻×消费联动 — 新闻提到的涨价你正好要买 =====
    {
      id: "news_price_shock_personal",
      phase: "street",
      icon: "📰",
      title: "新闻里的涨价，今天就来",
      story:
        "早上刷到新闻说「近期蔬菜价格大幅上涨，部分品类涨幅超20%」。\n\n你正要去菜市场买菜——看来今天的菜篮子又要重了。\n\n旁边几个大妈也在议论纷纷，有人说要囤货，有人说改吃便宜的。",
      // [conditions→triggers] 部分迁移：phase+day 移入 triggers，新闻+位置保留
      triggers: {
        phase: "street",
        minDay: 15,
      },
      conditions: function (st) {
        // 检查是否有活跃新闻中包含价格上涨相关
        if (!st.activeNews || st.activeNews.length === 0) return false;
        for (var i = 0; i < st.activeNews.length; i++) {
          var n = st.activeNews[i];
          if (
            n.headline &&
            (n.headline.indexOf("涨") >= 0 || n.headline.indexOf("物价") >= 0)
          ) {
            return true;
          }
        }
        return false;
      },
      probability: 0.08,
      repeatable: true,
      choices: [
        {
          text: "🛒 去批发市场批量采购",
          hint: "批发价更低，但需要跑远路",
          apply: function (st) {
            var saved = Random.int(10, 30);
            st.resources.cash -= saved; // 交通费
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 20);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);
            StateManager.addMessage(
              "🛒 你跑到批发市场批了一堆菜，虽然路费花了¥" +
                saved +
                "，但单价便宜了不少。冰箱塞得满满当当。",
              "success",
            );
          },
        },
        {
          text: "🥬 改吃便宜替代品",
          hint: "省钱，营养一般",
          apply: function (st) {
            var cheap = Random.int(3, 8);
            st.resources.cash -= cheap;
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 12);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            StateManager.addMessage(
              "🥬 白菜豆腐对付一顿了。花了¥" +
                cheap +
                "，肚子是饱了，但味道一般。心情-3。",
              "info",
            );
          },
        },
        {
          text: "📊 趁机囤点耐储存的",
          hint: "心智+2，长期省钱",
          apply: function (st) {
            var spend = Random.int(50, 150);
            st.resources.cash -= spend;
            st.flags._hoardedFood = (st.flags._hoardedFood || 0) + spend;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
            StateManager.addMessage(
              "📊 你趁现在多囤了些米面油。花了¥" +
                spend +
                "，但接下来几天买菜钱能省下来。心智+2。",
              "hint",
            );
          },
        },
      ],
    },

    // ===== 事件2：极端天气×消费行为 — 暴雨天外卖vs自己煮 =====
    {
      id: "heavy_rain_cooking_dilemma",
      phase: "street",
      icon: "🌧️",
      title: "暴雨天的晚餐",
      story:
        "暴雨倾盆，你被困在了写字楼里。下班时间到了，但雨大到根本出不去。\n\n手机弹出一条消息：「暴雨橙色预警，部分路段积水严重。」\n\n外卖配送费涨到了¥15，而且预计送达时间40分钟起步。你自己带了泡面在包里。",
      // [conditions→triggers] 全量迁移
      triggers: {
        phase: "street",
        weather: ["heavy_rain", "stormy", "typhoon"],
        minDay: 5,
      },
      probability: 0.1,
      repeatable: true,
      choices: [
        {
          text: "🍜 吃自带泡面，省钱又踏实",
          hint: "疲劳+5，心情-2，但省¥20+",
          apply: function (st) {
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
            StateManager.addMessage(
              "🍜 泡面泡了3分钟，虽然简单但热乎。雨天能安稳吃口热的就不错了。",
              "info",
            );
          },
        },
        {
          text: "📱 点外卖，贵就贵吧",
          hint: "心情+5，花¥25-40（含配送费）",
          apply: function (st) {
            var foodCost = Random.int(15, 25);
            var deliveryCost = Random.int(10, 20);
            var total = foodCost + deliveryCost;
            if (st.resources.cash >= total) {
              st.resources.cash -= total;
              st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 35);
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 5,
              );
              StateManager.addMessage(
                "📱 热腾腾的外卖到了！花了¥" +
                  total +
                  "，但暴雨天能坐在工位上吃口热饭，值了。心情+5。",
                "success",
              );
            } else {
              st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 10);
              StateManager.addMessage(
                "😅 钱不够点外卖，只能饿着肚子等雨小。饥饿+10。",
                "warning",
              );
            }
          },
        },
        {
          text: "🏪 冒雨去买楼下便利店",
          hint: "省钱但有健康风险",
          apply: function (st) {
            if (Random.chance(0.4)) {
              st.status.health = Math.max(0, (st.status.health || 80) - 5);
              st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 20);
              StateManager.addMessage(
                "🏪 你冲进雨里买了关东煮。花了¥12，但淋了暴雨，健康-5。有点得不偿失。",
                "warning",
              );
            } else {
              st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 20);
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
              StateManager.addMessage(
                "🏪 你冒雨跑到了便利店，买了碗热汤面。虽然累但没生病。疲劳+10。",
                "info",
              );
            }
          },
        },
      ],
    },

    // ===== 事件3：道德flag→NPC反应 — 你的善行/恶行被NPC知道了 =====
    {
      id: "moral_flag_npc_reaction",
      phase: "street",
      icon: "👀",
      title: "你做的事，有人看在眼里",
      story: "你的行为在邻里间传开了——有人议论纷纷，有人默默记在心里。",
      // [全系统自洽修复] 域B 修复:storyFn不被events_core支持→改为静态缺省story
      storyFn: function (st) {
        var parts = [];
        if (st.flags && st.flags.moralStoppedThiefPublic) {
          parts.push(
            "你在街上抓小偷的事传开了，现在好几个人见到你都点头打招呼。",
          );
        }
        if (st.flags && st.flags.moralFedDog) {
          parts.push(
            "那只雨天的流浪狗居然跟了你两条街，最后蹭了蹭你的裤腿跑了。",
          );
        }
        if (st.flags && st.flags._keptWallet) {
          parts.push("你捡钱包的事不知道被谁看见了，看你的眼神有些微妙。");
        }
        if (parts.length === 0) {
          parts.push("城市很大，但你做的每一件事都可能被人看见。");
        }
        return parts.join("\\n\\n");
      },
      triggers: {
        phase: "street",
        minDay: 10,
      },
      conditions: function (st) {
        // 至少有一个道德flag
        var flags = st.flags || {};
        return (
          flags.moralStoppedThiefPublic ||
          flags.moralFedDog ||
          flags.moralFedBeggar ||
          flags._keptWallet ||
          flags.moralHelpedElder ||
          flags.moral_returnedFoundMoney ||
          flags._foundATMCash
        );
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "😊 继续做自己认为对的事",
          hint: "心情+5，道德flag回声",
          apply: function (st) {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            StateManager.addMessage(
              "😊 你笑了笑，继续往前走。不管别人怎么看，你知道自己做对了。心情+5，心智+2。",
              "success",
            );
          },
        },
        {
          text: "🤔 想想刚才的事，有点后怕",
          hint: "心智+3，可能触发自我反省",
          apply: function (st) {
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            StateManager.addMessage(
              "🤔 你停下来想了想刚才的事。有些选择看起来很小，但定义了你是什么样的人。心智+3。",
              "hint",
            );
          },
        },
      ],
    },
  );

  // ====== 注册 CROSS_EVENTS 遗漏条目 ======
  // [全系统自洽修复] 域B 修复: CROSS_EVENTS.push在注册循环(5348行)之后执行导致事件未注册到RANDOM_EVENTS
  for (var _ci = 0; _ci < CROSS_EVENTS.length; _ci++) {
    var _ce = CROSS_EVENTS[_ci];
    if (_ce && !_ce._registered) {
      if (!_ce.conditions && !_ce.triggers) {
        _ce.conditions = function () {
          return true;
        };
      }
      _ce._registered = true;
      RANDOM_EVENTS.push(_ce);
    }
  }

  // ====== 联动增强：高难度生存压力「绝境回望」 ======
  // 【设计意图】与v3.1 difficulty系统联动，困难/地狱模式下健康+金钱双低时触发
  RANDOM_EVENTS.push({
    id: "hard_mode_survival_reflection",
    phase: "street",
    icon: "🌆",
    title: "绝境回望",
    story:
      "你蹲在路边的台阶上，兜里只剩不到一百块，身体也快扛不住了。" +
      "旁边商场的大屏幕放着城市宣传片——'梦想之城，等你来闯'。" +
      "你记得刚来那天也是这么个傍晚，天也是这种颜色。" +
      "那时候你觉得，凭着一双手总能活下去。" +
      "现在你还信这个吗？",
    conditions: function (st) {
      if (st.player.phase !== "street") return false;
      if (st.flags._hardModeSurvivalReflectionSeen) return false;
      var diff = st.flags && st.flags._difficulty;
      if (diff !== "hard" && diff !== "hell") return false;
      var health = st.status && st.status.health;
      if (typeof health !== "number" || health >= 30) return false;
      var cash = st.resources && st.resources.cash;
      if (typeof cash !== "number" || cash >= 100) return false;
      if (!st.player || st.player.day < 30) return false;
      return true;
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "💪 信。走到今天不是为了倒在这里",
        hint: "心智+8，疲劳+10，咬牙坚持",
        apply: function (st) {
          st.flags._hardModeSurvivalReflectionSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 8);
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          StateManager.addMessage(
            "🌆 你站起来拍了拍裤子上的灰。旁边卖烤红薯的大爷看了你一眼，递过来一个：「拿着，不要钱。年轻人，别轻易说不信了。」你鼻子一酸，咬了口红薯，甜的。\n心智+8，疲劳+10，心情+5。",
            "success",
          );
        },
      },
      {
        text: "📞 给家里打个电话",
        hint: "亲情回血，心情+15",
        apply: function (st) {
          st.flags._hardModeSurvivalReflectionSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 10);
          StateManager.addMessage(
            "📞 电话通了，妈妈的声音传过来：「吃饭了吗？钱够不够？别太累。」你说都挺好的，挂了电话发了会儿呆。¥10话费换来的这两句唠叨，比什么都管用。\n心情+15，心智+3。",
            "info",
          );
        },
      },
      {
        text: "😞 先找地方睡一觉，明天再说",
        hint: "疲劳-20，心智-5，先活下来",
        apply: function (st) {
          st.flags._hardModeSurvivalReflectionSeen = true;
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
          st.player.mental = Math.max(0, (st.player.mental || 0) - 5);
          StateManager.addMessage(
            "😞 你找了个桥洞下面的避风处，把外套裹紧了些。今晚先活过去，明天的事明天想。\n疲劳-20，心智-5。活着才有翻盘的机会。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== 联动增强：投资亏损心理「熊市阴影」 ======
  // 【设计意图】与investment系统联动，当玩家累计投资亏损超¥10000时触发心理事件
  RANDOM_EVENTS.push({
    id: "investment_loss_anxiety",
    phase: "street",
    icon: "📉",
    title: "熊市阴影",
    story:
      "你算了一下账，这段时间在股市里亏进去的钱已经超过一万了。" +
      "夜里翻来覆去睡不着，闭上眼就是K线图。" +
      "你开始怀疑自己——是不是根本不适合搞投资？" +
      "还是说，只是运气不好？",
    conditions: function (st) {
      if (st.flags._investmentLossAnxietySeen) return false;
      if (!st.player || st.player.day < 60) return false;
      // [全系统自洽修复] 域B A类#1: 原读 _tradeLog/inv.totalLoss（均永未写入=死代码）
      // → 改为实时计算持仓浮亏（stockHoldings.avgPrice vs 现价），真实可触发
      var totalLoss = 0;
      var inv = st.investment;
      var holdings = inv && inv.stockHoldings ? inv.stockHoldings : [];
      for (var i = 0; i < holdings.length; i++) {
        var h = holdings[i];
        if (!h || !h.avgPrice || !h.qty) continue;
        var cur =
          (inv.stockMarket &&
            inv.stockMarket[h.symbol] &&
            inv.stockMarket[h.symbol].price) ||
          0;
        if (!isFinite(cur)) continue;
        if (cur < h.avgPrice) totalLoss += (h.avgPrice - cur) * h.qty;
      }
      if (totalLoss < 10000) return false;
      return true;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "📚 买几本书系统学习投资知识",
        hint: "智力+5，但花¥200",
        cost: 200,
        apply: function (st) {
          st.flags._investmentLossAnxietySeen = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 5,
          );
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "📚 你买了《聪明的投资者》和《周期》，连着几个晚上认真看完了。虽然亏了钱，但学到了东西——下次不会再犯同样的错误了。\n智力+5，心智+3。花了¥200买书。",
            "success",
          );
        },
      },
      {
        text: "🧘 出去走走，放空自己",
        hint: "心情+15，心智+5",
        apply: function (st) {
          st.flags._investmentLossAnxietySeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
          StateManager.addMessage(
            "🧘 你沿着江边走了两个小时。风吹在脸上，慢慢把脑子里的K线吹散了。想明白一件事：只要人还在，钱可以再赚。\n心情+15，心智+5，疲劳+5。",
            "info",
          );
        },
      },
      {
        text: "😤 不甘心！下次加倍押注翻本",
        hint: "心智-5，但下次投资回报+20%",
        apply: function (st) {
          st.flags._investmentLossAnxietySeen = true;
          st.player.mental = Math.max(0, (st.player.mental || 0) - 5);
          st.flags._gamblerMode = true;
          StateManager.addMessage(
            "😤 你盯着账户余额，牙咬得咯咯响。「我就不信了。」你知道这种心态很危险，但你控制不住。\n心智-5，下次投资收益+20%（但风险更高）。",
            "warning",
          );
        },
      },
    ],
  });

  // ==== [域B 联动增强 R15] 技能复合→跨界机会（B→C→E 桥接）====
  // 联动：coding≥20 + english≥15 触发跨境远程工作线索
  // 设计意图：技能组合创造新机会——填补"复合技能→职业跃迁"的叙事空白
  {
    var _skillBridgeEvent = {
      id: "skill_bridge_remote_opp",
      phase: "street",
      icon: "🌐",
      title: "远程工作的邀请",
      story:
        "你在技术论坛上收到一条私信：\\n\\n「你好，我在Upwork上看到你的作品集。我们是一家新加坡的科技公司，正在找一个能独立完成全栈开发的远程工程师。\\n\\n要求英语读写流利，能参加英文会议。\\n\\n如果你感兴趣，我们可以先做一个付费测试项目，工时按U.S.时薪结算。」\\n\\n你盯着屏幕——这是一条通往海外市场的路。",
      triggers: {
        minDay: 60,
        excludeFlags: ["_skillBridgeRemoteSeen"],
      },
      conditions: function (st) {
        var coding =
          st.skills && st.skills.coding ? st.skills.coding.level || 0 : 0;
        var english =
          st.skills && st.skills.english ? st.skills.english.level || 0 : 0;
        return coding >= 20 && english >= 15;
      },
      probability: 0.035,
      repeatable: false,
      choices: [
        {
          text: "🌐 接受测试项目，拼一把",
          hint: "需要熬夜完成，但收入+¥5000，解锁海外接单通道",
          apply: function (st) {
            st.flags._skillBridgeRemoteSeen = true;
            st.flags._remoteWorkUnlocked = true;
            st.resources.cash = (st.resources.cash || 0) + 5000;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            if (st.skills && st.skills.coding)
              st.skills.coding.xp = (st.skills.coding.xp || 0) + 50;
            if (st.skills && st.skills.english)
              st.skills.english.xp = (st.skills.english.xp || 0) + 30;
            StateManager.addMessage(
              "🌐 你熬夜三天完成了测试项目！新加坡那边很满意，付了¥5,000测试费，说下个月有正式项目会再联系。\n海外远程通道已解锁！编程XP+50，英语XP+30，心情+12。技能终于变成了跨越国界的门票。",
              "success",
            );
          },
        },
        {
          text: "📋 先收藏，等准备好了再联系",
          hint: "保留机会，不急于一时",
          apply: function (st) {
            st.flags._skillBridgeRemoteSeen = true;
            st.flags._remoteWorkDeferred = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
            StateManager.addMessage(
              "📋 你收藏了那条私信，准备等英语再好一些再回复。机会在那里，不会自己跑掉。心情+3。",
              "info",
            );
          },
        },
        {
          text: "😅 水平还不够，再练练",
          hint: "自知之明，无变化",
          apply: function (st) {
            st.flags._skillBridgeRemoteSeen = true;
            StateManager.addMessage(
              "😅 你诚实评估了自己的水平——英语开会有时还是会卡壳。先踏踏实实把基本功打牢，机会以后还会有的。",
              "info",
            );
          },
        },
      ],
    };
    RANDOM_EVENTS.push(_skillBridgeEvent);
  }
})();

// ===== 联动增强1：高负债心理压力事件（负债≥¥10,000触发）=====
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  RANDOM_EVENTS.push({
    id: "debt_anxiety_night",
    _isChainEvent: false,
    phase: "street",
    icon: "😰",
    title: "债务压得喘不过气",
    story:
      "夜深了，你翻来覆去睡不着。手机屏幕上银行的还款提醒数字格外刺眼。你算了一笔账——按现在的收入，不吃不喝也要好几个月才能还清。窗外灯火通明，你却觉得这座城市的夜晚格外冷。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.player.day >= 15 &&
        (st.resources.debt || 0) >= 10000
      );
    },
    excludeFlags: ["_debtAnxietyDone"],
    choices: [
      {
        text: "📝 制定还款计划，分期还",
        hint: "心智+2，压力-5",
        apply: function (st) {
          st.flags._debtAnxietyDone = true;
          st.skills.mental = st.skills.mental || { level: 0, xp: 0 };
          st.skills.mental.xp = (st.skills.mental.xp || 0) + 20;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📝 你打开Excel，把债务拆分成12期。虽然数字还是那么大，但至少有了方向。心情+5，心智经验+20。",
            "success",
          );
        },
      },
      {
        text: "💪 明天开始多打一份工",
        hint: "疲劳+10，决心+3",
        apply: function (st) {
          st.flags._debtAnxietyDone = true;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "💪 你咬着牙关掉手机，定了个五点的闹钟。多干一份活，就多还一份钱。疲劳+10，心情+3。",
            "info",
          );
        },
      },
      {
        text: "🍺 借酒消愁，不想了",
        hint: "健康-3，心情短暂+2",
        apply: function (st) {
          st.flags._debtAnxietyDone = true;
          st.status.health = Math.max(0, (st.status.health || 100) - 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          StateManager.addMessage(
            "🍺 你买了瓶啤酒坐在路边喝。酒劲上来时，那些数字暂时模糊了。但明天醒来，它们还在。健康-3，心情+2。",
            "warning",
          );
        },
      },
    ],
  });
})();

// ===== 联动增强2：连续3天恶劣天气情绪事件 =====
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  var CONSECUTIVE_BAD_WEATHER = [
    "rainy",
    "heavy_rain",
    "stormy",
    "snowy",
    "heavy_snow",
    "foggy",
    "heavy_smog",
  ];
  RANDOM_EVENTS.push({
    id: "bad_weather_blues",
    _isChainEvent: false,
    phase: "street",
    icon: "🌧️",
    title: "连绵阴雨让人沮丧",
    story:
      "雨已经连续下了好几天。空气里全是潮湿的霉味，衣服晾不干，鞋子进水了，连床单都带着一股潮气。你站在窗前，看着灰蒙蒙的天，感觉自己也快发霉了。",
    conditions: function (st) {
      if (st.player.phase !== "street" || st.player.day < 7) return false;
      if (!st.weather || !st.weather.current) return false;
      var isBad = false;
      for (var i = 0; i < CONSECUTIVE_BAD_WEATHER.length; i++) {
        if (st.weather.current === CONSECUTIVE_BAD_WEATHER[i]) {
          isBad = true;
          break;
        }
      }
      if (!isBad) return false;
      // 检查连续天数（需要weatherHistory或类似机制，降级为简单门槛）
      return st.player.day >= 7;
    },
    excludeFlags: ["_badWeatherBluesDone"],
    choices: [
      {
        text: "☕ 去便利店买杯热饮暖暖身子",
        hint: "花费¥10，心情+5",
        apply: function (st) {
          st.flags._badWeatherBluesDone = true;
          st.resources.cash = (st.resources.cash || 0) - 10;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "☕ 便利店的暖光灯下，一杯热奶茶下肚，整个人都活过来了。花费¥10，心情+5。",
            "success",
          );
        },
      },
      {
        text: "🏪 去批发市场囤点货，雨天生意好做",
        hint: "利用雨天商机",
        apply: function (st) {
          st.flags._badWeatherBluesDone = true;
          st.flags._rainMarketUmbrellaDay = st.player.day;
          StateManager.addMessage(
            "🏪 你想起老周说过——雨天批发市场雨具和防潮用品卖得特别好。你披上雨衣出了门。",
            "info",
          );
        },
      },
      {
        text: "😴 躺平，等天气好转",
        hint: "疲劳-5，心情-3",
        apply: function (st) {
          st.flags._badWeatherBluesDone = true;
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          StateManager.addMessage(
            "😴 你裹着被子听着雨声发呆。虽然状态恢复了一些，但心里总觉得在浪费时间。",
            "info",
          );
        },
      },
    ],
  });
})();

// ===== 联动增强3：恶劣天气通勤（职场人暴风雨通勤）B→G/H =====
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  var BAD_COMMUTE_WEATHER = ["stormy", "heavy_rain", "heavy_snow", "snowy"];
  RANDOM_EVENTS.push({
    id: "stormy_corp_commute",
    phase: "corporate",
    _isChainEvent: false,
    icon: "🌊",
    title: "暴雨中的通勤路",
    story:
      "窗外的雨泼得像天漏了一样。你站在公司附近的十字路口，伞被风吹得翻了过去，裤腿湿到大腿。还有十分钟打卡，但面前这条积水已经漫过脚踝的路让你犹豫了——冲过去，还是一身湿透地进办公室？\n\n这场暴雨似乎在提醒你：这座城市从不因为你的狼狈而放缓它的节奏。",
    conditions: function (st) {
      if (!st || !st.player || !st.weather || !st.weather.current) return false;
      if (st.player.phase !== "corporate" || st.player.day < 30) return false;
      if (st.flags && st.flags._stormyCommuteDone) return false;
      var w = st.weather.current;
      var isBad = false;
      for (var i = 0; i < BAD_COMMUTE_WEATHER.length; i++) {
        if (w === BAD_COMMUTE_WEATHER[i]) {
          isBad = true;
          break;
        }
      }
      return isBad;
    },
    excludeFlags: ["_stormyCommuteDone"],
    choices: [
      {
        text: "💼 咬牙冲过去，不能迟到",
        hint: "健康-，全勤+",
        apply: function (st) {
          st.flags._stormyCommuteDone = true;
          st.status.health = Math.max(0, (st.status.health || 100) - 5);
          if (st.player && st.player.corporate) {
            st.player.corporate.kpi = Math.min(
              100,
              (st.player.corporate.kpi || 20) + 2,
            );
          }
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "💼 你踩着积水冲进公司，刚好赶上打卡。同事递来一条干毛巾，主管看在眼里。KPI+2，心智+3，健康-5。",
            "info",
          );
        },
      },
      {
        text: "☕ 进便利店躲雨，等小了再走",
        hint: "心情+，但会迟到",
        apply: function (st) {
          st.flags._stormyCommuteDone = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          st.resources.cash = (st.resources.cash || 0) - 8;
          StateManager.addMessage(
            "☕ 你在便利店买了杯热咖啡，看着窗外雨幕发呆。迟到了十五分钟，但至少人是干的。心情+5，花费¥8。",
            "success",
          );
        },
      },
      {
        text: "🏠 请半天假，远程办公",
        hint: "健康不减，但职场存在感-",
        apply: function (st) {
          st.flags._stormyCommuteDone = true;
          if (st.player && st.player.corporate) {
            st.player.corporate.popularity = Math.max(
              0,
              (st.player.corporate.popularity || 30) - 3,
            );
          }
          StateManager.addMessage(
            "🏠 你发消息请了半天假。虽然人在家，但总觉得少了点什么。职场存在感-3。",
            "warning",
          );
        },
      },
    ],
    probability: 0.06,
  });
})();

// ===== 联动增强4：长期露宿生存危机（街头韧性考验）B→A/G =====
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  RANDOM_EVENTS.push({
    id: "homeless_endurance_crisis",
    phase: "street",
    _isChainEvent: false,
    icon: "🏚️",
    title: "天桥下的第N个夜晚",
    story:
      "你把硬纸板铺得再平整一些，裹紧身上那件已经看不出颜色的外套。天桥上车流轰鸣，震得骨头发麻。你已经记不清在这座城市睡了多久露宿了——只知道身体的每一声咳嗽都在提醒你，这样撑不了太久。\n\n风声里，你隐约听到远处传来夜市的喧闹。这座城市有千万种活法，而你正卡在最硬的那一种里。",
    conditions: function (st) {
      if (!st || !st.player || !st.housing) return false;
      if (st.player.day < 45) return false;
      if (st.housing.tier >= 1) return false; // 只要有住处就触发不了
      if (st.flags && st.flags._homelessCrisisDone) return false;
      if ((st.status.health || 100) < 40) return true;
      if ((st.needs.happiness || 50) < 15) return true;
      if ((st.player.mental || 50) < 15) return true;
      return false;
    },
    excludeFlags: ["_homelessCrisisDone"],
    choices: [
      {
        text: "💪 振作起来，今天多干几份活",
        hint: "决心+，疲劳+",
        apply: function (st) {
          st.flags._homelessCrisisDone = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 50) + 15);
          StateManager.addMessage(
            "💪 你使劲搓了搓脸，迎着晨光走向劳务市场。不能再这样下去了——今天必须多赚点。心智+5，疲劳+15。",
            "info",
          );
        },
      },
      {
        text: "🏪 去救助站看看有没有临时工",
        hint: "有机会获得物资或工作",
        apply: function (st) {
          st.flags._homelessCrisisDone = true;
          st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 20);
          st.resources.cash = (st.resources.cash || 0) + 30;
          StateManager.addMessage(
            "🏪 救助站发了一碗热粥和两个馒头，还贴着一张小广告：招夜班保安，包住。你小心地把号码存进手机。饥饿+20，现金+30。",
            "success",
          );
        },
      },
      {
        text: "😞 在墙角缩成一团，熬过这一晚",
        hint: "健康-，情绪触底",
        apply: function (st) {
          st.flags._homelessCrisisDone = true;
          st.status.health = Math.max(0, (st.status.health || 100) - 8);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
          StateManager.addMessage(
            "😞 你把报纸盖在脸上，假装什么都感觉不到。半夜被冻醒了一次，雨从桥缝漏下来打在脸上。天亮了，你还活着，但好像也没完全活着。健康-8，心情-10。",
            "danger",
          );
        },
      },
    ],
    probability: 0.04,
  });

  // ============================================================
  // [全系统自洽修复] 域C 联动增强: 技能天赋树叙事事件
  // 填补空白: SKILL_BRANCHES 选择/激活/满级零事件覆盖
  // 联动: C(职业/成长)→D(社交)/G(核心机制) — 天赋树首次被事件消费
  // ============================================================
  (function () {
    // 事件1: 天赋树选择 — 技能Lv.30时选择发展方向
    var ev_branch_choice = {
      id: "skill_branch_choice_moment",
      phase: "street",
      icon: "🌳",
      title: "技能发展方向",
      story: function (st) {
        var skillName =
          typeof getSkillChineseName === "function"
            ? getSkillChineseName(st._branchSkillKey)
            : st._branchSkillKey;
        return (
          "你的" +
          skillName +
          "终于练到了Lv.30，是时候选择发展方向了。\n" +
          "一个老前辈拍了拍你：\"这行水深，选对了路能少走很多弯路。\""
        );
      },
      triggers: {
        minDay: 15,
      },
      conditions: function (st) {
        if (st.flags && st.flags._skillBranchChoiceDone) return false;
        if (!st.skills) return false;
        for (var sk in st.skills) {
          if (st.skills[sk] && st.skills[sk].level >= 30) {
            if (
              typeof getSkillBranchDef === "function" &&
              getSkillBranchDef(sk).length > 0
            ) {
              if (!st.skillBranches || !st.skillBranches[sk]) {
                st._branchSkillKey = sk;
                return true;
              }
            }
          }
        }
        return false;
      },
      apply: function (st) {
        st.flags._skillBranchChoiceDone = true;
      },
      probability: 0.12,
      choices: [
        {
          text: function (st) {
            return "🌳 选择" + (st._branchSkillKey || "该技能") + "发展方向";
          },
          hint: "开启天赋树系统",
          callback: function (st) {
            if (typeof showModal === "function") {
              showModal({
                title: "🌳 选择发展方向",
                body:
                  '<div style="padding:8px 12px;"><p style="font-size:14px;font-weight:bold;margin-bottom:8px;">' +
                  (typeof getSkillChineseName === "function"
                    ? getSkillChineseName(st._branchSkillKey)
                    : st._branchSkillKey) +
                  ' 已达到Lv.30，请选择发展方向</p><p style="font-size:12px;color:var(--text-muted);">天赋树将在技能Tab中显示，选择后不可逆（切换需消耗30AP+¥500）。</p></div>',
                buttons: [
                  {
                    text: "去技能Tab选择",
                    cls: "btn-primary",
                    callback: function () {
                      if (typeof switchTab === "function")
                        switchTab("skills");
                      return true;
                    },
                  },
                ],
              });
            }
          },
        },
        {
          text: "💤 先放着，不急",
          hint: "暂时不选，下次触发",
          apply: function (st) {
            StateManager.addMessage(
              "💤 你决定先放着，等攒够了经验再说。",
              "hint",
            );
          },
        },
      ],
    };

    // 事件2: 天赋节点激活 — 首个天赋点亮
    var ev_talent_light = {
      id: "skill_talent_first_light",
      phase: "street",
      icon: "⭐",
      title: "天赋点亮",
      story: function (st) {
        return (
          "你终于攒够了资源，激活了天赋节点。\n" +
          "一股力量涌入体内——不，是技能感悟加深了。"
        );
      },
      triggers: {
        minDay: 30,
      },
      conditions: function (st) {
        if (st.flags && st.flags._skillTalentFirstLightDone) return false;
        if (!st.talentNodes) return false;
        var activatedCount = 0;
        for (var k in st.talentNodes) {
          if (st.talentNodes[k]) activatedCount++;
        }
        return activatedCount >= 1;
      },
      apply: function (st) {
        st.flags._skillTalentFirstLightDone = true;
        st.player.happiness = Math.min(
          100,
          (st.player.happiness || 50) + 5,
        );
        st.player.mental = Math.min(
          100,
          (st.player.mental || 30) + 3,
        );
        StateManager.addMessage(
          "⭐ 天赋节点点亮！你的技能树又多了一层力量。心情+5，心智+3。",
          "success",
        );
      },
      probability: 0.06,
      choices: [
        {
          text: "🌟 继续挖掘潜能",
          hint: "前往技能Tab查看可激活节点",
          callback: function (st) {
            if (typeof switchTab === "function") switchTab("skills");
          },
        },
      ],
    };

    // 事件3: 技能树满级 — 100级里程碑
    var ev_mastery = {
      id: "skill_tree_mastery_celebration",
      phase: "street",
      icon: "🏆",
      title: "技能大成",
      story: function (st) {
        var skillName =
          typeof getSkillChineseName === "function"
            ? getSkillChineseName(st._masterSkillKey)
            : st._masterSkillKey;
        return (
          "你的" +
          skillName +
          "终于达到了Lv.100！\n" +
          "街上的人都传开了——你是这条街上最有本事的人。"
        );
      },
      triggers: {
        minDay: 100,
      },
      conditions: function (st) {
        if (st.flags && st.flags._skillMasteryDone) return false;
        if (!st.skills) return false;
        for (var sk in st.skills) {
          if (st.skills[sk] && st.skills[sk].level >= 100) {
            st._masterSkillKey = sk;
            return true;
          }
        }
        return false;
      },
      apply: function (st) {
        st.flags._skillMasteryDone = true;
        st.player.fame = (st.player.fame || 0) + 10;
        st.player.happiness = Math.min(
          100,
          (st.player.happiness || 50) + 15,
        );
        st.player.mental = Math.min(
          100,
          (st.player.mental || 30) + 10,
        );
        StateManager.addMessage(
          "🏆 " +
            (typeof getSkillChineseName === "function"
              ? getSkillChineseName(st._masterSkillKey)
              : st._masterSkillKey) +
            " 达到Lv.100！你已成为这条街的传奇！名气+10，心情+15，心智+10。",
          "success",
        );
      },
      probability: 0.02,
      choices: [
        {
          text: "🎉 请全街吃饭庆祝",
          hint: "花费¥500，所有NPC好感+3",
          apply: function (st) {
            if (st.resources.cash >= 500) {
              st.resources.cash -= 500;
              var rels = st.relationships || {};
              for (var rid in rels) {
                if (rels[rid] && rels[rid].met) {
                  rels[rid].affinity = Math.min(
                    100,
                    (rels[rid].affinity || 0) + 3,
                  );
                }
              }
              StateManager.addMessage(
                "🎉 你请全街吃了顿大餐！大家伙都高兴坏了，所有已结识NPC好感+3。",
                "success",
              );
            }
          },
        },
        {
          text: "📚 把钱投到学习中",
          hint: "现金-¥300，所有技能+100XP",
          apply: function (st) {
            if (st.resources.cash >= 300) {
              st.resources.cash -= 300;
              if (st.skills) {
                for (var s in st.skills) {
                  if (st.skills[s]) {
                    st.skills[s].xp = (st.skills[s].xp || 0) + 100;
                  }
                }
              }
              StateManager.addMessage(
                "📚 你用庆祝的钱报了个进修班，所有技能各获得100XP！",
                "success",
              );
            }
          },
        },
      ],
    };

    RANDOM_EVENTS.push(ev_branch_choice);
    RANDOM_EVENTS.push(ev_talent_light);
    RANDOM_EVENTS.push(ev_mastery);

    // [全系统自洽修复] 域D 联动增强1: 夜市情报交换 — 陈哥&老周双NPC好感联动事件
    (function () {
      RANDOM_EVENTS.push({
        id: "night_market_info_swap",
        phase: "street",
        icon: "🌙",
        title: "夜市情报交换",
        story: "夜市收摊时分，陈哥和老周难得坐在一起喝啤酒。陈哥朝你招手：「过来过来，正说起你呢！」\n老周咧嘴一笑：「这小子在废品站学到不少门道，现在可精了。」\n陈哥眯起眼：「那正好，我手头有条消息，老周的人脉加上你的脑子，能搞点事情。」",
        triggers: {
          minDay: 30,
          relationshipMet: "chen_ge",
          relationshipAffinityMin: [{ id: "chen_ge", min: 50 }, { id: "old_zhou", min: 50 }],
          excludeFlags: ["_npcInfoSwapDone"],
        },
        choices: [
          {
            text: "🤝 掺一脚，听听是什么消息",
            hint: "智力+2，现金+200，解锁隐藏情报",
            apply: function (st) {
              st.flags._npcInfoSwapDone = true;
              st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + 2);
              st.resources.cash += 200;
              st.resources.totalEarned += 200;
              st.flags._nightMarketInfo = true;
              if (st.relationships.chen_ge) st.relationships.chen_ge.affinity = Math.min(100, (st.relationships.chen_ge.affinity || 0) + 3);
              if (st.relationships.old_zhou) st.relationships.old_zhou.affinity = Math.min(100, (st.relationships.old_zhou.affinity || 0) + 3);
              StateManager.addMessage("🌙 陈哥说的消息是：城西要建新物流园，附近的废品站和批发市场都会受益。你提前锁定了这个信息！智力+2，现金+200，陈哥和老周好感各+3。", "success");
            },
          },
          {
            text: "🍺 坐下一起喝一杯",
            hint: "心情+10，好感各+5",
            apply: function (st) {
              st.flags._npcInfoSwapDone = true;
              st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
              if (st.relationships.chen_ge) st.relationships.chen_ge.affinity = Math.min(100, (st.relationships.chen_ge.affinity || 0) + 5);
              if (st.relationships.old_zhou) st.relationships.old_zhou.affinity = Math.min(100, (st.relationships.old_zhou.affinity || 0) + 5);
              StateManager.addMessage("🍺 你坐下来，听两人聊城里的旧事和新鲜事。老周说他年轻时候也做过情报，陈哥哈哈大笑。夜市的灯火里，你觉得自己终于融入了这座城市的角落。心情+10，好感各+5。", "info");
            },
          },
          {
            text: "🚶 不凑这个热闹",
            hint: "无效果",
            apply: function (st) {
              st.flags._npcInfoSwapDone = true;
              StateManager.addMessage("🚶 你摆摆手走了。身后传来陈哥的声音：「这小子，还是这么独。」", "info");
            },
          },
        ],
      });
    })();
  })();
})();

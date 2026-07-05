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
        return st._worldParams.marketMood === "bearish" && st.player.day > 20;
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
        return st.player.day > 5 && !st.flags._foundATMCash;
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
      options: [
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
      options: [
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
      options: [
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
      options: [
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
      options: [
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
      options: [
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
      options: [
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
      options: [
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
      options: [
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
      options: [
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
      options: [
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
      options: [
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
        "你正在街上走着，一个中年男人快步迎上来——你认出来了，这是你一个月前帮忙送过紧急文件的那位客户。\\n\\n他笑着说：「可算碰上你了！上次你帮我送的那份标书中了！一直想谢谢你。」说着递过来一个袋子。",
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
        "路边有人摆摊卖「名牌电动工具」，价格只有商场的三分之一。电钻、角磨机堆了一地，摊主吆喝着「厂家直销，保修一年」。\\n\\n旁边有人掏钱要买，但你扫了一眼那做工——焊缝粗糙、标牌印刷模糊。你心里有了数。",
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
        "你正在批发市场闲逛，突然有人拉了你一把——是老周。他压低声音说：「别出声，跟我来。」\\n\\n他带你拐进一条窄巷，七拐八拐到了一个不起眼的铁皮棚前：「这家回收站不对外，但关系到位的话收货价比外面高三成——我带你认个门。」",
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
        "你在商业区的人群中看到一个人正鬼鬼祟祟地贴近前面背包的姑娘——他的手已经伸进了她的背包拉链缝隙。\\n\\n周围的人都忙着赶路，没人注意到。你只有几秒钟时间决定怎么做。",
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
        "你走在路上，眼前突然一阵发黑。天旋地转，你赶紧扶住旁边的墙壁，但腿已经软了。\\n\\n路人的声音变得模糊而遥远——你已经记不清上次好好吃一顿饭是什么时候了。身体的忍耐到了极限。",
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
        "你走在路上，脚步越来越沉，视线开始模糊。这几天你几乎没怎么休息，身体已经到了极限。\\n\\n你扶着墙喘气，心跳快得像要从嗓子眼蹦出来。路过的行人看了你一眼，又匆匆走开——这座城市的每个人都忙着赶自己的路。",
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
        "你蹲在路边吃盒饭的时候，脑子里突然闪过一个念头——你会的这几样本事，好像可以串起来。\\n\\n你见过太多人只会一门手艺，但很少有人能把两样本事结合起来。也许……这就是你的机会？",
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
        "你刚回到城中村，就看到王大婶和老周站在巷口说话，看到你一起招手。\\n\\n王大婶先开口：「我跟老周商量了一下，你在这城里也混了这么久了，踏实肯干，我们俩想给你牵个线——」\\n老周接话：「城西物流园在招固定工，包吃住，月薪¥3500起。我侄子在那边当主管，你跟他说是我介绍的就行。」",
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
        "你在街上走着，一个中年女人突然叫住你。你愣了一下——你不认识她。\\n\\n她笑着说：「你不记得我了？上个月在菜市场，我钱包被偷了，是你帮我报警还垫了车费让我回家。我一直想找机会谢谢你！」\\n\\n你这才想起来，确实有这么回事。当时你也没多想，顺手帮了一把。",
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
        "你走进一家小面馆，刚坐下，旁边的大姐就皱了皱眉，往旁边挪了挪。\\n\\n老板端着面过来，放下碗的时候也偏过头去。你低头闻了闻自己——一股酸臭味。你记不清上次洗澡是什么时候了。",
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
        "暴雨突然倾盆而下，你浑身湿透地冲进一座废弃楼的屋檐下。里面已经蹲着两个人——一个裹着军大衣的老人，一个抱着书包的学生。\\n\\n老人抬头看了你一眼，往旁边挪了挪：「挤挤，雨大。」学生也往旁边让了让。",
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
        "你路过陈师傅的摊子时，他正在捣鼓一个新酱料，满手都是红彤彤的辣椒碎。\\n\\n看到你，他眼睛一亮：「来得正好！我新研制了个麻辣配方，你帮我尝尝咸淡——别光尝，来来来，我教你怎么调。」",
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
        "你正准备干活，手里的工具突然发出一声不妙的响动——把手松了，刀刃钝了，或者带子断了。\\n\\n这套装备跟了你有一阵子了，一直在将就用，但今天它终于扛不住了。",
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
        "你今天照常去干活，但一到地方就觉得胸口发闷。同样的动作、同样的路线、同样的吆喝——你已经重复了不知道多少遍。\\n\\n你坐在路沿石上，看着别的摊位发呆。脑子里有个声音在说：「还要这样干多久？」",
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
        "你强撑着去干活，但手上的动作明显比平时慢。咳嗽压不住，额头烫得厉害。\\n\\n旁边的老主顾看了你一眼：「小伙子，你这脸色不对啊，发烧了吧？别干了，回去歇着。」",
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
        "你今天醒来就不想动。不是身体累，是心里空了一块。\\n\\n你盯着天花板想：每天醒来→干活→吃饭→睡觉→再醒来，到底图什么？这座城市有千万人，但没有一个人真的在意你。\\n\\n你翻了个身，把脸埋进枕头里。",
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
        "小美在信息栏上贴了张纸条：「周末自习小组，互相督促，免费入场。」\\n\\n她看到你在看纸条，凑过来小声说：「我拉了几个同学一起复习考证，你也来吧！别怕跟不上，我从基础讲起。」",
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
        "你在科技园门口看到一群年轻人在拍合影，胸前挂着工牌——上面印着各种互联网公司的logo。\\n\\n你低头看了看自己满是灰尘的衣服，又看了看他们。一个念头冒出来：你也会写代码，为什么不能像他们一样？",
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
        "晚上你回到住处，打开手机——没有消息，没有未接来电。你翻了一遍通讯录，发现不知道该打给谁。\\n\\n窗外万家灯火，街上有情侣在笑，有朋友在打闹。你拉上窗帘，把热闹关在外面。",
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
        "你在市场上买东西时，一抬头——对面站着的人有点眼熟。\\n\\n那人也看到了你，脸色变了变，大步走过来。你想起他是谁了——上个月借你钱的工地工头。他说这几天老家急用钱，问你能不能先还一部分。",
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
        "你又来到了公园——这几天你都在这里活动，已经混了个脸熟。\\n\\n一个打太极的大爷朝你点了点头：「小伙子，我看你天天来，挺能坚持啊。来，跟我练两招，比你瞎跑强。」",
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
        "你在工地上干活时，突然听到一声喊——上面掉下来一捆钢管！虽然没砸到人，但碎砖块溅到了你这边。\\n\\n工头跑过来看了一圈：「没事没事，散了吧。」但你的手臂被划了一道口子，血渗了出来。",
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
        "你在街上走着，路边一个修电动车的人正在对着一堆零件发愁。\\n\\n他抬头看了看你——也许是看你手上常年干活留下的茧子和工具痕迹——试探着问：「兄弟，你懂这个不？我这车拆了装不回去了。」",
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
        "你在图书馆的自习区埋头苦读，但一道题卡了你半小时。你咬着笔帽，盯着书页上的公式发呆。\\n\\n对面一个戴眼镜的中年人合上自己的书，看了你一眼：「卡住了？来，我看看。」",
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
  ];

  for (var i = 0; i < CROSS_EVENTS.length; i++) {
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
      "几天前老周带你认的铁皮棚回收站，今天你试着拖了一车废品过去。那人看了一眼说：「老周打过招呼了，称重点，按内部价算。」\\n\\n你看着称上的数字，感觉比平时沉了不少。",
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
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.trendJobUnlocked &&
        !st.flags._trendBubblePop &&
        st.player.day >= 270
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
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.careerShift &&
        !st.flags._careerPivotResult &&
        st.player.day >= 540
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
      "有人托王大婶带了个信封给你——打开一看，是几天前那个差点被偷的姑娘写的。\\n\\n字迹有些歪扭，但很认真：「那天太慌乱了没当面向你道谢，问了旁边的人才打听到你住这片。一点心意，请一定收下。」",
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
      "你正在路边歇脚，一个穿格子衫的中年男人快步走过来——有点眼熟。\\n\\n「你不就是上次帮我们公司送标书那位吗？我同事上次也找你跑了一趟，说你效率高。」\\n他递来一张名片：「有个长期合作——每周三趟固定配送，价格好商量。你接不接？」",
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
      "你路过一家小加工厂门口，一个满手机油的人冲出来，看到你手里拎着的工具袋眼前一亮。\\n\\n「兄弟！你会修机器不？我这台冲床坏了，今天不修好明天交不了货。修好了给你这个数——」他比了个手势。",
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
      "你正在批发市场附近，天突然暗了下来——暴雨说来就来。\\n\\n周围的人开始狂奔躲雨，但菜市场门口有个小贩在卖雨伞——¥25一把，3分钟卖了20把。你看了看旁边的批发店，门口堆着一箱箱的库存折叠伞。",
    conditions: function (st) {
      if (st.player.day < 10) return false;
      if (!st.weather) return false;
      if (st.weather.current !== "rainy" && st.weather.current !== "stormy")
        return false;
      var curLoc = st.trade && st.trade.currentLocation;
      if (curLoc !== "wholesaleMarket" && curLoc !== "market") return false;
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
})();

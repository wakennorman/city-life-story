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
      trigger: function (st) {
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
      trigger: function (st) {
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
      trigger: function (st) {
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
      trigger: function (st) {
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
      // [自洽修复] conditions 新增：st.weather.current 天气检查（原用 st.weather.weather，字段不存在）
      trigger: function (st) {
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
      trigger: function (st) {
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
      trigger: function (st) {
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
      trigger: function (st) {
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
      trigger: function (st) {
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
      trigger: function (st) {
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
      trigger: function (st) {
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
      trigger: function (st) {
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
})();

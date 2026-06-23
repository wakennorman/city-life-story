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
          st.npcRelations &&
          st.npcRelations.aunt_wang &&
          (st.npcRelations.aunt_wang.affinity || 0) >= 30 &&
          st.player.day > 10
        );
      },
      choices: [
        {
          text: "🔧 帮她修水管",
          hint: "花1个AP，好感+10",
          apply: function (st) {
            if (st.skills && st.skills.repair) {
              var level = st.skills.repair.level || 0;
              if (level >= 20) {
                st.npcRelations.aunt_wang.affinity = Math.min(
                  100,
                  (st.npcRelations.aunt_wang.affinity || 0) + 12,
                );
                st.skills.repair.xp = (st.skills.repair.xp || 0) + 30;
                StateManager.addMessage(
                  "🔧 你三两下就修好了水管。王大婶感激得不行，好感+12。",
                  "success",
                );
              } else {
                st.npcRelations.aunt_wang.affinity = Math.min(
                  100,
                  (st.npcRelations.aunt_wang.affinity || 0) + 8,
                );
                StateManager.addMessage(
                  "🔧 你笨手笨脚修好了，虽然弄了一身水。王大婶还是谢谢你，好感+8。",
                  "success",
                );
              }
            } else {
              st.npcRelations.aunt_wang.affinity = Math.min(
                100,
                (st.npcRelations.aunt_wang.affinity || 0) + 5,
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
            st.npcRelations.aunt_wang.affinity = Math.min(
              100,
              (st.npcRelations.aunt_wang.affinity || 0) + 5,
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
            st.npcRelations.aunt_wang.affinity = Math.max(
              0,
              (st.npcRelations.aunt_wang.affinity || 0) - 8,
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
          st.npcRelations &&
          st.npcRelations.old_zhou &&
          (st.npcRelations.old_zhou.affinity || 0) >= 40 &&
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
            st.npcRelations.old_zhou.affinity = Math.min(
              100,
              (st.npcRelations.old_zhou.affinity || 0) + 8,
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
            st.npcRelations.old_zhou.affinity = Math.min(
              100,
              (st.npcRelations.old_zhou.affinity || 0) + 5,
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
            st.npcRelations.old_zhou.affinity = Math.max(
              0,
              (st.npcRelations.old_zhou.affinity || 0) - 3,
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
          hint: "薪资翻倍，但需重新积累人脉",
          apply: function (st) {
            if (!st.career || !st.career.currentJob) return;
            st.career.history.push({
              day: st.player.day,
              event:
                "跳槽：从" + st.career.currentJob.levelName + "跳槽到新公司",
            });
            st.career.currentJob.salary = Math.round(
              st.career.currentJob.salary * 2,
            );
            st.career.currentJob.workDays = 0;
            StateManager.addMessage(
              "💼 你接受了猎头的offer！薪资翻倍至¥" +
                st.career.currentJob.salary.toLocaleString() +
                "/月",
              "success",
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
          hint: "减少损失",
          apply: function (st) {
            var inv = st.investment || {};
            if (inv.stockHoldings && inv.stockHoldings.length > 0) {
              var totalSold = 0;
              for (var i = inv.stockHoldings.length - 1; i >= 0; i--) {
                totalSold += 1;
              }
              inv.stockHoldings = [];
              StateManager.addMessage(
                "💼 你清仓了所有股票，回笼现金。虽然亏了一些，但现金为王。",
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
          hint: "花费¥10,000，减少税款",
          apply: function (st) {
            if (st.resources.cash < 10000) {
              StateManager.addMessage(
                "会计师咨询费¥10,000，你付不起。",
                "warning",
              );
              return;
            }
            st.resources.cash -= 10000;
            var tax = Math.round(st.resources.cash * 0.04);
            st.resources.cash -= tax;
            StateManager.addMessage(
              "👔 会计师帮你做了税务规划，最终只交了¥" +
                tax.toLocaleString() +
                "。",
              "success",
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
  ];
  for (var ci = 0; ci < CAREER_EVENTS.length; ci++) {
    RANDOM_EVENTS.push(CAREER_EVENTS[ci]);
  }

  for (var i = 0; i < CROSS_EVENTS.length; i++) {
    RANDOM_EVENTS.push(CROSS_EVENTS[i]);
  }
})();

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
    // === NPC关系网事件：送礼传导效应 ===
    {
      id: "npc_gift_propagation",
      phase: "street",
      icon: "🎁",
      title: "礼尚往来",
      story: `你给王大婶送了一份水果。她特别高兴："哎呀这孩子真懂事！我侄女张姐最近也在找礼物送人，你有心了！"\n你突然意识到——对一个人的好，可能会影响到她身边的人。`,
      conditions: function (st) {
        return (
          st.player.day > 12 &&
          st.resources &&
          st.resources.cash >= 30 &&
          st.npcRelations &&
          st.npcRelations.aunt_wang &&
          (st.npcRelations.aunt_wang.affinity || 0) >= 20
        );
      },
      choices: [
        {
          text: "🎁 送王大婶水果",
          hint: "花费¥30，好感+5，张姐好感+2",
          cost: 30,
          apply: function (st) {
            st.resources.cash -= 30;
            // 直接好感提升
            if (!st.npcRelations.aunt_wang) st.npcRelations.aunt_wang = { affinity: 0 };
            st.npcRelations.aunt_wang.affinity = Math.min(100, (st.npcRelations.aunt_wang.affinity || 0) + 5);
            // 传导效应：张姐是王大婶的远房侄女
            if (!st.npcRelations.sister_zhang) st.npcRelations.sister_zhang = { affinity: 0 };
            st.npcRelations.sister_zhang.affinity = Math.min(100, (st.npcRelations.sister_zhang.affinity || 0) + 2);
            StateManager.addMessage(
              "🎁 王大婶收到水果很开心，还夸你有心了。好感+5。张姐听说后也对你印象更好了，好感+2。",
              "success"
            );
            // 记录互动历史
            if (!st.npcRelations.aunt_wang.interactionHistory) st.npcRelations.aunt_wang.interactionHistory = [];
            st.npcRelations.aunt_wang.interactionHistory.push({ day: st.player.day, type: "gift", target: "sister_zhang" });
          }
        },
        {
          text: "🤔 算了，下次再说",
          hint: "保留现金",
          apply: function (st) {
            StateManager.addMessage("🤔 你犹豫了一下，没送。", "info");
          }
        }
      ]
    },
    // === NPC关系网事件：口碑传播 ===
    {
      id: "npc_reputation_spread",
      phase: "street",
      icon: "📣",
      title: "口碑的力量",
      story: `你在城中村帮老周修好了三轮车。这事不知怎么传到了李工头耳朵里。\n第二天，李工头在工地喊你："听说你修车有一手？我这边有个设备坏了，能帮我看看吗？"`,
      conditions: function (st) {
        return (
          st.player.day > 18 &&
          st.npcRelations &&
          st.npcRelations.old_zhou &&
          (st.npcRelations.old_zhou.affinity || 0) >= 30 &&
          st.npcRelations &&
          st.npcRelations.boss_li &&
          (st.npcRelations.boss_li.affinity || 0) < 40
        );
      },
      choices: [
        {
          text: "🔧 帮李工头修设备",
          hint: "体力消耗，但李工头好感+8",
          apply: function (st) {
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
            if (!st.npcRelations.boss_li) st.npcRelations.boss_li = { affinity: 0 };
            st.npcRelations.boss_li.affinity = Math.min(100, (st.npcRelations.boss_li.affinity || 0) + 8);
            StateManager.addMessage(
              "🔧 你花了一小时修好了设备。李工头很满意，说以后有技术活都找你。好感+8。",
              "success"
            );
          }
        },
        {
          text: "😅 我修不了这个",
          hint: "诚实但错失机会",
          apply: function (st) {
            if (!st.npcRelations.boss_li) st.npcRelations.boss_li = { affinity: 0 };
            st.npcRelations.boss_li.affinity = Math.max(0, (st.npcRelations.boss_li.affinity || 0) - 2);
            StateManager.addMessage(
              "😅 你坦白说自己不会。李工头点点头："也是，术业有专攻。"好感-2。",
              "info"
            );
          }
        }
      ]
    },
    // === NPC关系网事件：前同事引荐 ===
    {
      id: "npc_former_colleague_referral",
      phase: "street",
      icon: "💼",
      title: "张姐的内推",
      story: `张姐找你聊天："我有个客户公司招临时工，日结¥200。不过他们比较看重人品，我得先问问你。"\n你想起张姐和李工头以前是同事——她可能把你的事跟李工头提过。`,
      conditions: function (st) {
        return (
          st.player.day > 25 &&
          st.npcRelations &&
          st.npcRelations.sister_zhang &&
          (st.npcRelations.sister_zhang.affinity || 0) >= 35 &&
          st.npcRelations &&
          st.npcRelations.boss_li &&
          (st.npcRelations.boss_li.affinity || 0) >= 20
        );
      },
      choices: [
        {
          text: "💼 接受内推",
          hint: "日薪¥200，张姐好感+5",
          apply: function (st) {
            var days = Random.int(2, 5);
            var total = days * 200;
            st.resources.cash += total;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + total;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + days * 8);
            if (!st.npcRelations.sister_zhang) st.npcRelations.sister_zhang = { affinity: 0 };
            st.npcRelations.sister_zhang.affinity = Math.min(100, (st.npcRelations.sister_zhang.affinity || 0) + 5);
            StateManager.addMessage(
              "💼 你去了那家公司做了" + days + "天临时工，赚了¥" + total + "。张姐说客户很满意，以后有活还找你。",
              "success"
            );
          }
        },
        {
          text: "🙏 谢谢但最近没空",
          hint: "礼貌拒绝",
          apply: function (st) {
            if (!st.npcRelations.sister_zhang) st.npcRelations.sister_zhang = { affinity: 0 };
            st.npcRelations.sister_zhang.affinity = Math.max(0, (st.npcRelations.sister_zhang.affinity || 0) - 1);
            StateManager.addMessage(
              "🙏 你婉拒了。张姐理解地点点头："行，有合适的再联系你。"好感-1。",
              "info"
            );
          }
        }
      ]
    },
    // === NPC关系网事件：亲戚帮衬 ===
    {
      id: "npc_family_help",
      phase: "street",
      icon: "🏠",
      title: "远亲不如近邻",
      story: `王大婶来找你："我侄女张姐最近工作不顺，想在她那租个房子过渡下。你认识她不？"\n你想起张姐是王大婶的远房侄女，而且你们关系还不错。`,
      conditions: function (st) {
        return (
          st.player.day > 30 &&
          st.npcRelations &&
          st.npcRelations.aunt_wang &&
          (st.npcRelations.aunt_wang.affinity || 0) >= 25 &&
          st.npcRelations &&
          st.npcRelations.sister_zhang &&
          (st.npcRelations.sister_zhang.affinity || 0) >= 15
        );
      },
      choices: [
        {
          text: "🏠 帮张姐介绍租房",
          hint: "王大婶好感+8，张姐好感+5",
          apply: function (st) {
            if (!st.npcRelations.aunt_wang) st.npcRelations.aunt_wang = { affinity: 0 };
            st.npcRelations.aunt_wang.affinity = Math.min(100, (st.npcRelations.aunt_wang.affinity || 0) + 8);
            if (!st.npcRelations.sister_zhang) st.npcRelations.sister_zhang = { affinity: 0 };
            st.npcRelations.sister_zhang.affinity = Math.min(100, (st.npcRelations.sister_zhang.affinity || 0) + 5);
            StateManager.addMessage(
              "🏠 你帮张姐介绍了个便宜的房子。王大婶直夸你懂事，张姐也松了口气。两人好感都提升了。",
              "success"
            );
          }
        },
        {
          text: "🤷 我这边也不太熟",
          hint: "推脱",
          apply: function (st) {
            if (!st.npcRelations.aunt_wang) st.npcRelations.aunt_wang = { affinity: 0 };
            st.npcRelations.aunt_wang.affinity = Math.max(0, (st.npcRelations.aunt_wang.affinity || 0) - 3);
            StateManager.addMessage(
              "🤷 你说自己也不太熟。王大婶有些失望："也是，你们刚认识不久。"好感-3。",
              "warning"
            );
          }
        }
      ]
    },
    // === NPC关系网事件：竞争对手嫉妒 ===
    {
      id: "npc_rival_jealousy",
      phase: "street",
      icon: "😒",
      title: "同行眼红",
      story: `李工头最近接了个大活，工期紧人手不够。\n老周在旁边嘀咕："工头接了好活，废料价格也得涨涨。"\n你意识到——李工头和老周虽然是同行，但关系一般。`,
      conditions: function (st) {
        return (
          st.player.day > 35 &&
          st.npcRelations &&
          st.npcRelations.boss_li &&
          (st.npcRelations.boss_li.affinity || 0) >= 30 &&
          st.npcRelations &&
          st.npcRelations.old_zhou &&
          (st.npcRelations.old_zhou.affinity || 0) >= 20
        );
      },
      choices: [
        {
          text: "🤝 两边都帮",
          hint: "体力消耗大，但两边好感都提升",
          apply: function (st) {
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
            if (!st.npcRelations.boss_li) st.npcRelations.boss_li = { affinity: 0 };
            st.npcRelations.boss_li.affinity = Math.min(100, (st.npcRelations.boss_li.affinity || 0) + 6);
            if (!st.npcRelations.old_zhou) st.npcRelations.old_zhou = { affinity: 0 };
            st.npcRelations.old_zhou.affinity = Math.min(100, (st.npcRelations.old_zhou.affinity || 0) + 4);
            StateManager.addMessage(
              "🤝 你帮李工头干了活，又帮老周收了废料。两边都挺满意，但你也累得够呛。",
              "success"
            );
          }
        },
        {
          text: "👉 帮李工头（收入高）",
          hint: "李工头好感+8，老周好感-3",
          apply: function (st) {
            var bonus = Random.int(80, 150);
            st.resources.cash += bonus;
            if (!st.npcRelations.boss_li) st.npcRelations.boss_li = { affinity: 0 };
            st.npcRelations.boss_li.affinity = Math.min(100, (st.npcRelations.boss_li.affinity || 0) + 8);
            if (!st.npcRelations.old_zhou) st.npcRelations.old_zhou = { affinity: 0 };
            st.npcRelations.old_zhou.affinity = Math.max(-100, (st.npcRelations.old_zhou.affinity || 0) - 3);
            StateManager.addMessage(
              "👉 你帮李工头干了活，赚了¥" + bonus + "。老周在旁边没吭声，但你能感觉到他不太高兴。",
              "success"
            );
          }
        },
        {
          text: "👈 帮老周（关系好）",
          hint: "老周好感+6，李工头好感-2",
          apply: function (st) {
            if (!st.npcRelations.old_zhou) st.npcRelations.old_zhou = { affinity: 0 };
            st.npcRelations.old_zhou.affinity = Math.min(100, (st.npcRelations.old_zhou.affinity || 0) + 6);
            if (!st.npcRelations.boss_li) st.npcRelations.boss_li = { affinity: 0 };
            st.npcRelations.boss_li.affinity = Math.max(0, (st.npcRelations.boss_li.affinity || 0) - 2);
            StateManager.addMessage(
              "👈 你帮老周收了废料。李工头那边没帮上，他有些失望。",
              "info"
            );
          }
        }
      ]
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

    // ====== v3.4 C3D-T2: 跨系统联动事件 ×8 ======

    // 1. 暴雨中的商机
    {
      id: "rain_opportunity",
      name: "暴雨中的商机",
      icon: "🌧️",
      phase: "street",
      trigger: function (st) {
        return (
          st.weather &&
          (st.weather.weather === "rainy" || st.weather.weather === "stormy") &&
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
          text: "🏃 帮人送货跑腿，雨天人少单多",
          hint: "¥200 + 可能有好人缘",
          apply: function (st) {
            st.resources.cash += 200;
            if (Random.chance(0.3)) {
              StateManager.addMessage(
                "🏃 客户看你冒雨送货，多给了¥50小费。",
                "success",
              );
              st.resources.cash += 50;
            } else {
              StateManager.addMessage(
                "🏃 你顶着暴雨跑了三趟，浑身湿透赚了¥200。",
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
            var social = (st.skills && st.skills.social && st.skills.social.level) || 0;
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
            return (st.status && st.status.health < 60);
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
              StateManager.addMessage(
                "😅 连¥50的保健品都买不起……",
                "warning",
              );
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
        return (
          rel &&
          rel.met &&
          rel.affinity >= 60 &&
          st.player.day > 120
        );
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
              st.skills.repair.level = Math.min(100, st.skills.repair.level + 5);
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
            var social = (st.skills && st.skills.social && st.skills.social.level) || 0;
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
      story: "老周看你每天翻垃圾桶，叹了口气：'小子，你这样翻法挣不了几个钱。来，我教你看货。'",
      conditions: function (st) {
        return (
          st.npcRelations &&
          st.npcRelations.old_zhou &&
          (st.npcRelations.old_zhou.affinity || 0) >= 60 &&
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
            st.npcRelations.old_zhou.affinity = Math.min(
              100,
              (st.npcRelations.old_zhou.affinity || 0) + 5,
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
            st.npcRelations.old_zhou.affinity = Math.min(
              100,
              (st.npcRelations.old_zhou.affinity || 0) + 8,
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
      story: "张姐拦住你：'我表姐的便利店缺个夜班，工资日结，比你在外面风吹日晒强。去不去？'",
      conditions: function (st) {
        return (
          st.npcRelations &&
          st.npcRelations.sister_zhang &&
          (st.npcRelations.sister_zhang.affinity || 0) >= 80 &&
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
            st.npcRelations.sister_zhang.affinity = Math.min(
              100,
              (st.npcRelations.sister_zhang.affinity || 0) + 10,
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
            st.npcRelations.sister_zhang.affinity = Math.min(
              100,
              (st.npcRelations.sister_zhang.affinity || 0) + 2,
            );
            StateManager.addMessage(
              "🤔 张姐说：'行，你慢慢考虑，机会不等人。'",
              "info",
            );
          },
        },
      ],
    },
    // ============================================================
    // v3.6 新增：NPC关系链联动事件（人情江湖）
    // ============================================================

    // === 三角选择：李工头 vs 张姐（竞争关系）===
    {
      id: "triangular_boss_zhang",
      phase: "street",
      icon: "⚖️",
      title: "工头与中介的拉锯",
      story: "李工头找你：「张姐那边抢了我几个工人，你帮我劝劝她别挖角。」\n转头张姐也说：「李工头克扣工资，你得站在道理这边。」\n两边都是熟面孔，怎么选？",
      conditions: function (st) {
        if (!st.relationships) return false;
        var affLi = (st.relationships.boss_li && st.relationships.boss_li.affinity) || 0;
        var affZhang = (st.relationships.sister_zhang && st.relationships.sister_zhang.affinity) || 0;
        return affLi >= 50 && affZhang >= 30 && st.player.day > 20 && !st.flags._triangularChosen;
      },
      choices: [
        {
          text: "👷 帮李工头（劝张姐别挖角）",
          hint: "李工头好感+8，张姐好感-5，获得建筑类工作加成",
          apply: function (st) {
            st.flags._triangularChosen = "boss_li";
            if (st.relationships.boss_li) {
              st.relationships.boss_li.affinity = Math.min(100, (st.relationships.boss_li.affinity || 0) + 8);
            }
            if (st.relationships.sister_zhang) {
              st.relationships.sister_zhang.affinity = Math.max(-100, (st.relationships.sister_zhang.affinity || 0) - 5);
            }
            st.flags.bossLiAlly = true;
            StateManager.addMessage("👷 你站在李工头这边，张姐有些不高兴。李工头给你安排了更好的活。", "success");
          },
        },
        {
          text: "💼 帮张姐（支持工人权益）",
          hint: "张姐好感+8，李工头好感-5，获得销售类工作加成",
          apply: function (st) {
            st.flags._triangularChosen = "sister_zhang";
            if (st.relationships.sister_zhang) {
              st.relationships.sister_zhang.affinity = Math.min(100, (st.relationships.sister_zhang.affinity || 0) + 8);
            }
            if (st.relationships.boss_li) {
              st.relationships.boss_li.affinity = Math.max(-100, (st.relationships.boss_li.affinity || 0) - 5);
            }
            st.flags.sisterZhangAlly = true;
            StateManager.addMessage("💼 你支持张姐，李工头对你有了看法。但张姐给你介绍了更多销售机会。", "success");
          },
        },
        {
          text: "🤷 两边都不帮，各打五十大板",
          hint: "双方好感各-3，但获得"和事佬"名声",
          apply: function (st) {
            st.flags._triangularChosen = "neutral";
            if (st.relationships.boss_li) {
              st.relationships.boss_li.affinity = Math.max(-100, (st.relationships.boss_li.affinity || 0) - 3);
            }
            if (st.relationships.sister_zhang) {
              st.relationships.sister_zhang.affinity = Math.max(-100, (st.relationships.sister_zhang.affinity || 0) - 3);
            }
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            StateManager.addMessage("🤷 你把两边都说了一通，他们各自散了。你成了"和事佬"，名气+5。", "info");
          },
        },
      ],
    },

    // === 旧识反应：帮老周→王大婶知情 ===
    {
      id: "old_zhou_aunt_reaction",
      phase: "street",
      icon: "👵",
      title: "王大婶的"闲话"",
      story: "你在城中村帮老周推了一车废品，王大婶在楼道里看见了。\n第二天她找你：「听说你帮老周干活了？那老头子欠我房租，你帮我问问他啥时候能还？」",
      conditions: function (st) {
        if (!st.relationships) return false;
        var affZhou = (st.relationships.old_zhou && st.relationships.old_zhou.affinity) || 0;
        var affWang = (st.relationships.aunt_wang && st.relationships.aunt_wang.affinity) || 0;
        return affZhou >= 30 && affWang >= 20 && st.player.day > 15 && !st.flags._auntZhouAsked;
      },
      choices: [
        {
          text: "👵 帮王大婶问老周",
          hint: "王大婶好感+5，老周好感-3",
          apply: function (st) {
            st.flags._auntZhouAsked = true;
            if (st.relationships.aunt_wang) {
              st.relationships.aunt_wang.affinity = Math.min(100, (st.relationships.aunt_wang.affinity || 0) + 5);
            }
            if (st.relationships.old_zhou) {
              st.relationships.old_zhou.affinity = Math.max(-100, (st.relationships.old_zhou.affinity || 0) - 3);
            }
            StateManager.addMessage("👵 你问了老周，他叹口气说最近手头紧。王大婶说理解，但还是要催。", "info");
          },
        },
        {
          text: "👴 帮老周说情",
          hint: "老周好感+5，王大婶好感-3",
          apply: function (st) {
            st.flags._auntZhouAsked = "zhou";
            if (st.relationships.old_zhou) {
              st.relationships.old_zhou.affinity = Math.min(100, (st.relationships.old_zhou.affinity || 0) + 5);
            }
            if (st.relationships.aunt_wang) {
              st.relationships.aunt_wang.affinity = Math.max(-100, (st.relationships.aunt_wang.affinity || 0) - 3);
            }
            StateManager.addMessage("👴 你跟王大婶说老周不容易，她叹口气说：「行吧，再宽限几天。」", "info");
          },
        },
        {
          text: "🤷 这事我不掺和",
          hint: "双方好感不变",
          apply: function (st) {
            st.flags._auntZhouAsked = "neutral";
            StateManager.addMessage("🤷 你说这事你不好管。王大婶没再说什么。", "info");
          },
        },
      ],
    },

    // === 赵姐情报：城市改造预警 ===
    {
      id: "zhaojie_urban_renewal",
      phase: "street",
      icon: "🏗️",
      title: "老城区要改造",
      story: "赵姐把你拉到一边：「有个内部消息——下个月老城区要改造，你住的那片可能要涨房租甚至拆迁。提前告诉你一声，算是感谢之前帮我带客户。」\n她递给你一张纸条，上面写着几个备选住处。",
      conditions: function (st) {
        if (!st.relationships) return false;
        var affZhao = (st.relationships.zhaojie && st.relationships.zhaojie.affinity) || 0;
        return affZhao >= 50 && st.player.day > 25 && !st.flags._urbanRenewalWarned;
      },
      choices: [
        {
          text: "🏠 提前找新住处",
          hint: "避免被动涨租，获得搬家补贴¥200",
          apply: function (st) {
            st.flags._urbanRenewalWarned = true;
            st.resources.cash += 200;
            st.flags.preparedForUrbanRenewal = true;
            if (st.relationships.zhaojie) {
              st.relationships.zhaojie.affinity = Math.min(100, (st.relationships.zhaojie.affinity || 0) + 10);
            }
            StateManager.addMessage("🏠 你提前找了新住处，房东看你诚心，给了搬家补贴¥200。赵姐的情报救了你！", "success");
          },
        },
        {
          text: "🤔 先看看再说",
          hint: "暂时不行动，后续可能被动涨租",
          apply: function (st) {
            st.flags._urbanRenewalWarned = "wait";
            StateManager.addMessage("🤔 你觉得先住着也行，到时候再说。赵姐摇摇头没说话。", "info");
          },
        },
      ],
    },

    // === 陈哥独家情报：隐藏商机 ===
    {
      id: "chen_ge_secret_opportunity",
      phase: "street",
      icon: "💎",
      title: "陈哥的独家消息",
      story: "陈哥递给你一支烟：「最近夜市对面那块空地，市政要修路，但还没正式公告。现在租下来做临时摊位，等路修好就是黄金位置。」\n「租金便宜，但得自己冒险——万一修路计划改了，钱就打水漂了。」",
      conditions: function (st) {
        if (!st.relationships) return false;
        var affChen = (st.relationships.chen_ge && st.relationships.chen_ge.affinity) || 0;
        return affChen >= 40 && st.player.day > 30 && !st.flags._chenSecretOpportunity;
      },
      choices: [
        {
          text: "💰 冒险租下空地（¥500）",
          hint: "70%概率赚¥800+，30%概率血本无归",
          cost: 500,
          apply: function (st) {
            st.flags._chenSecretOpportunity = true;
            if (Random.int(1, 10) <= 7) {
              var profit = 800 + Random.int(0, 400);
              st.resources.cash += profit;
              StateManager.addMessage("💰 市政果然修了路，你的摊位成了黄金位置！赚了¥" + profit + "。陈哥消息真灵通。", "success");
            } else {
              StateManager.addMessage("💰 市政改计划了，空地没修路，你的摊位没人光顾。¥500打水漂了。", "warning");
            }
          },
        },
        {
          text: "🤔 太冒险了，不投",
          hint: "错过机会，但保住本金",
          apply: function (st) {
            st.flags._chenSecretOpportunity = "passed";
            StateManager.addMessage("🤔 你觉得风险太大，拒绝了。陈哥说：「行，下次有好消息再告诉你。」", "info");
          },
        },
      ],
    },

    // === 老同学阿杰：借钱还钱事件链 ===
    {
      id: "ajie_debt_chain",
      phase: "street",
      icon: "💸",
      title: "老同学的债",
      story: "阿杰在夜市摊前拦住你：「兄弟，上次借的钱……我现在能还一部分了。」\n他掏出一叠皱巴巴的钞票，数了数：「这是200，剩下的等我找到稳定工作再还。」\n你想起陈哥说过，阿杰当年是为了给老婆治病才借的钱。",
      conditions: function (st) {
        if (!st.relationships) return false;
        var affAjie = (st.relationships.ajie && st.relationships.ajie.affinity) || 0;
        return affAjie >= 20 && st.player.day > 35 && !st.flags._ajieDebtStarted;
      },
      choices: [
        {
          text: "💪 收下钱，鼓励他",
          hint: "阿杰好感+8，获得¥200",
          apply: function (st) {
            st.flags._ajieDebtStarted = true;
            st.resources.cash += 200;
            if (st.relationships.ajie) {
              st.relationships.ajie.affinity = Math.min(100, (st.relationships.ajie.affinity || 0) + 8);
            }
            st.flags.ajiePayingBack = true;
            StateManager.addMessage("💪 你收下200块：「慢慢来，能还就行。」阿杰眼眶红了：「多谢兄弟。」", "success");
          },
        },
        {
          text: "🤲 不用还了，当作我请你的",
          hint: "阿杰好感+15，但损失¥200",
          apply: function (st) {
            st.flags._ajieDebtStarted = "forgiven";
            st.resources.cash -= 200;
            if (st.relationships.ajie) {
              st.relationships.ajie.affinity = Math.min(100, (st.relationships.ajie.affinity || 0) + 15);
            }
            st.flags.ajieDebtForgiven = true;
            StateManager.addMessage("🤲 你把钱推回去：「不用还了，当作我请你的。」阿杰眼泪下来了：「这辈子我忘不了你。」", "success");
          },
        },
        {
          text: "😕 先还一点也行，剩下的尽快",
          hint: "阿杰好感+3，获得¥200",
          apply: function (st) {
            st.flags._ajieDebtStarted = "partial";
            st.resources.cash += 200;
            if (st.relationships.ajie) {
              st.relationships.ajie.affinity = Math.min(100, (st.relationships.ajie.affinity || 0) + 3);
            }
            StateManager.addMessage("😕 你说先还一点也行。阿杰点点头：「我会尽快还剩下的。」", "info");
          },
        },
      ],
    },

    // === 赵姐 vs 张姐：同行竞争 ===
    {
      id: "zhaojie_zhang_rivalry",
      phase: "street",
      icon: "🏢",
      title: "两家中介的较量",
      story: "张姐告诉你：「赵姐最近在抢我的客户，她给房东更低佣金。」\n赵姐也来找你：「张姐那边服务质量不行，我给你介绍客户，佣金减半。」\n两边都想拉你站队。",
      conditions: function (st) {
        if (!st.relationships) return false;
        var affZhao = (st.relationships.zhaojie && st.relationships.zhaojie.affinity) || 0;
        var affZhang = (st.relationships.sister_zhang && st.relationships.sister_zhang.affinity) || 0;
        return affZhao >= 30 && affZhang >= 30 && st.player.day > 40 && !st.flags._agencyRivalryChosen;
      },
      choices: [
        {
          text: "🏢 帮赵姐（佣金减半）",
          hint: "赵姐好感+8，张姐好感-5，短期省钱",
          apply: function (st) {
            st.flags._agencyRivalryChosen = "zhaojie";
            if (st.relationships.zhaojie) {
              st.relationships.zhaojie.affinity = Math.min(100, (st.relationships.zhaojie.affinity || 0) + 8);
            }
            if (st.relationships.sister_zhang) {
              st.relationships.sister_zhang.affinity = Math.max(-100, (st.relationships.sister_zhang.affinity || 0) - 5);
            }
            st.flags.zhaojieCommissionDiscount = true;
            StateManager.addMessage("🏢 你选了赵姐，佣金减半。张姐知道了不太高兴。", "success");
          },
        },
        {
          text: "🏪 帮张姐（老客户情谊）",
          hint: "张姐好感+8，赵姐好感-5，获得长期信任",
          apply: function (st) {
            st.flags._agencyRivalryChosen = "sister_zhang";
            if (st.relationships.sister_zhang) {
              st.relationships.sister_zhang.affinity = Math.min(100, (st.relationships.sister_zhang.affinity || 0) + 8);
            }
            if (st.relationships.zhaojie) {
              st.relationships.zhaojie.affinity = Math.max(-100, (st.relationships.zhaojie.affinity || 0) - 5);
            }
            st.flags.sisterZhangLongTermTrust = true;
            StateManager.addMessage("🏪 你选了张姐，她说：「还是你靠谱。」赵姐那边有点意见。", "success");
          },
        },
        {
          text: "🤷 两边都不选，自己找房源",
          hint: "双方好感各-2，但保持独立",
          apply: function (st) {
            st.flags._agencyRivalryChosen = "neutral";
            if (st.relationships.zhaojie) {
              st.relationships.zhaojie.affinity = Math.max(-100, (st.relationships.zhaojie.affinity || 0) - 2);
            }
            if (st.relationships.sister_zhang) {
              st.relationships.sister_zhang.affinity = Math.max(-100, (st.relationships.sister_zhang.affinity || 0) - 2);
            }
            StateManager.addMessage("🤷 你说你自己找房源，两边都拒绝了。她们各自散了。", "info");
          },
        },
      ],
    },

    // === 陈哥找阿杰：老同学重逢 ===
    {
      id: "chen_ge_ajie_reunion",
      phase: "street",
      icon: "👬",
      title: "老同学重逢",
      story: "陈哥告诉你：「我打听到阿杰在城郊工地干活，今天休息，要不要一起去看看他？」\n你想起阿杰当年借了钱就消失，现在他过得怎么样？",
      conditions: function (st) {
        if (!st.relationships) return false;
        var affChen = (st.relationships.chen_ge && st.relationships.chen_ge.affinity) || 0;
        var affAjie = (st.relationships.ajie && st.relationships.ajie.affinity) || 0;
        return affChen >= 50 && st.flags.chenGeSearchingAjie && st.player.day > 45 && !st.flags._ajieReunionDone;
      },
      choices: [
        {
          text: "👬 一起去看看阿杰",
          hint: "触发老同学重逢事件，阿杰好感+10",
          apply: function (st) {
            st.flags._ajieReunionDone = true;
            if (st.relationships.ajie) {
              st.relationships.ajie.affinity = Math.min(100, (st.relationships.ajie.affinity || 0) + 10);
            }
            if (st.relationships.chen_ge) {
              st.relationships.chen_ge.affinity = Math.min(100, (st.relationships.chen_ge.affinity || 0) + 5);
            }
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            StateManager.addMessage("👬 你们找到阿杰，他正在工地搬砖。看到你们，他愣住了，然后笑了：「好久不见。」陈哥拍了拍他肩膀。你心里五味杂陈。心智+3。", "success");
          },
        },
        {
          text: "🤷 我不想见他",
          hint: "陈哥好感-3，阿杰不知情",
          apply: function (st) {
            st.flags._ajieReunionDone = "refused";
            if (st.relationships.chen_ge) {
              st.relationships.chen_ge.affinity = Math.max(-100, (st.relationships.chen_ge.affinity || 0) - 3);
            }
            StateManager.addMessage("🤷 你说你不想见他。陈哥叹了口气：「行吧，那我自己去。」", "info");
          },
        },
      ],
    },

    // === 关系和解：李工头与张姐 ===
    {
      id: "boss_zhang_reconciliation",
      phase: "street",
      icon: "🤝",
      title: "恩怨化解",
      story: "几个月后，李工头来找你：「张姐那边……我想跟她和解。以前是我不对，不该抢她客户。」\n他说想请你当中间人，约张姐吃顿饭。",
      conditions: function (st) {
        if (!st.relationships) return false;
        var affLi = (st.relationships.boss_li && st.relationships.boss_li.affinity) || 0;
        var affZhang = (st.relationships.sister_zhang && st.relationships.sister_zhang.affinity) || 0;
        var chosen = st.flags._triangularChosen;
        return affLi >= 60 && affZhang >= 40 && chosen && st.player.day > 60 && !st.flags._reconciliationDone;
      },
      choices: [
        {
          text: "🤝 当中间人，促成和解",
          hint: "双方好感各+10，解锁合作事件",
          apply: function (st) {
            st.flags._reconciliationDone = true;
            if (st.relationships.boss_li) {
              st.relationships.boss_li.affinity = Math.min(100, (st.relationships.boss_li.affinity || 0) + 10);
            }
            if (st.relationships.sister_zhang) {
              st.relationships.sister_zhang.affinity = Math.min(100, (st.relationships.sister_zhang.affinity || 0) + 10);
            }
            st.flags.bossZhangCooperate = true;
            StateManager.addMessage("🤝 你约了两人吃饭，几杯酒下肚，他们握手言和。李工头说以后有活一起干，张姐说以后有工人介绍给他。", "success");
          },
        },
        {
          text: "🤷 你们自己解决吧",
          hint: "双方好感各+3",
          apply: function (st) {
            st.flags._reconciliationDone = "passed";
            if (st.relationships.boss_li) {
              st.relationships.boss_li.affinity = Math.min(100, (st.relationships.boss_li.affinity || 0) + 3);
            }
            if (st.relationships.sister_zhang) {
              st.relationships.sister_zhang.affinity = Math.min(100, (st.relationships.sister_zhang.affinity || 0) + 3);
            }
            StateManager.addMessage("🤷 你说这事你不好掺和。李工头说：「也行，我自己找她谈。」", "info");
          },
        },
      ],
    },
  ];
})();

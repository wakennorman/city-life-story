/**
 * 街头随机事件数据 — 社会/人生篇
 * 从 events_street.js 拆分。社会关系/人生选择事件。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  var EVENTS = [
    {
      id: "community_group_buy",
      phase: "street",
      icon: "🥬",
      title: "团购大军杀到",
      story:
        "菜市场冷清了很多。王婶的菜被社区团购冲击——美团优选土豆¥0.99，进货价都不止。批发菜价跌了20%。等平台烧完钱会涨回来的。",
      // [自洽修复] conditions 新增：王婶关系检查
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.aunt_wang &&
          st.relationships.aunt_wang.met
        );
      },
      triggers: { minDay: 25, excludeFlags: ["_communityGroupBuySeen"] },
      choices: [
        {
          text: "💰 趁低价囤菜等涨价",
          hint: "投机",
          apply: function (st) {
            st.flags._communityGroupBuySeen = true;
            st.resources.cash -= 2000;
            StateManager.addMessage("💰 你囤了一批土豆白菜。", "event");
          },
        },
        {
          text: "🛵 加入团购平台配送",
          hint: "打不过就加入",
          apply: function (st) {
            st.flags._communityGroupBuySeen = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
            st.resources.cash += 300;
            StateManager.addMessage(
              "🛵 注册了众包配送。钱不多但稳定。",
              "info",
            );
          },
        },
        {
          text: "😞 帮王婶卖菜抽成10%",
          hint: "帮人帮己",
          apply: function (st) {
            st.flags._communityGroupBuySeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            var earn = Random.int(200, 299);
            st.resources.cash += earn;
            StateManager.addMessage(
              "😞 帮王婶拉微信群配送，抽成¥" + earn.toLocaleString() + "。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "bike_share_boom",
      phase: "street",
      icon: "🚲",
      title: "满街的共享单车",
      story:
        "一夜之间三家共享公司投了上万辆车。运维员¥200/天，把乱停的车搬回去。",
      triggers: { minDay: 20, excludeFlags: ["_bikeShareSeen"] },
      choices: [
        {
          text: "🚲 去做运维赚快钱",
          hint: "¥200/天",
          apply: function (st) {
            st.flags._bikeShareSeen = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            st.resources.cash += 600;
            st.player.physique = Math.min(100, (st.player.physique || 20) + 1);
            StateManager.addMessage("🚲 干了一周到手¥600。", "event");
          },
        },
        {
          text: "🔧 拆废弃单车零件卖",
          hint: "灰色路线",
          apply: function (st) {
            st.flags._bikeShareSeen = true;
            st.resources.cash += 400;
            st.player.fame = Math.max(0, (st.player.fame || 0) - 2);
            StateManager.addMessage("🔧 拆零件卖废品赚了¥400。", "warning");
          },
        },
      ],
    },
    {
      id: "live_stream_rush",
      phase: "street",
      icon: "📱",
      title: "直播带货风口",
      story:
        "隔壁小哥一个月流水几十万——批发市场¥20的衣直播卖¥99。你知道这是风口。",
      triggers: { minDay: 35, excludeFlags: ["_liveStreamSeen"] },
      choices: [
        {
          text: "📱 试播三天",
          hint: "低成本",
          apply: function (st) {
            st.flags._liveStreamSeen = true;
            st.resources.cash -= 200;
            if (Random.chance(0.3)) {
              st.resources.cash += 800;
              StateManager.addMessage("📱 第三天卖了¥800！有搞头。", "success");
            } else {
              StateManager.addMessage("📱 最多5个观众。99%是炮灰。", "warning");
            }
          },
        },
        {
          text: "💼 给主播打包发货",
          hint: "确定性收入",
          apply: function (st) {
            st.flags._liveStreamSeen = true;
            var earn = Random.int(400, 599);
            st.resources.cash += earn;
            StateManager.addMessage(
              "💼 日结¥" + earn.toLocaleString() + "。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "ai_replace_jobs",
      phase: "street",
      icon: "🤖",
      title: "AI冲击打工人",
      story:
        "AI客服替代了300人团队。翻译老李两个月没接到单。但编程技能突然值钱了。",
      triggers: { minDay: 30, excludeFlags: ["_aiReplaceSeen"] },
      choices: [
        {
          text: "📚 报名学编程（¥1,000）",
          hint: "投资未来",
          cost: 1000,
          apply: function (st) {
            st.flags._aiReplaceSeen = true;
            if (st.skills && st.skills.coding)
              st.skills.coding.xp = (st.skills.coding.xp || 0) + 80;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 3,
            );
            StateManager.addMessage("📚 报名Python入门。不想被替代。", "event");
          },
        },
        {
          text: "😤 继续干体力活",
          hint: "AI搬不了砖",
          apply: function (st) {
            st.flags._aiReplaceSeen = true;
            StateManager.addMessage("😤 AI能搬砖吗？有些活替代不了。", "info");
          },
        },
      ],
    },
    {
      id: "stall_location_war",
      phase: "street",
      icon: "📍",
      title: "黄金摊位争夺战",
      story: "夜市街口位置空出来了。有人出¥3,000租一个月。那位置客流量是三倍。",
      triggers: { minDay: 30, excludeFlags: ["_stallLocationSeen"] },
      choices: [
        {
          text: "💰 砸¥3,000抢下",
          hint: "先下手为强",
          cost: 3000,
          apply: function (st) {
            st.flags._stallLocationSeen = true;
            var earn = Random.int(3000, 4999);
            st.resources.cash += earn;
            st.resources.totalEarned += earn;
            StateManager.addMessage(
              "💰 抢到位置！第一晚流水¥" + earn.toLocaleString() + "。",
              "event",
            );
          },
        },
        {
          text: "🤝 联合摊贩轮换",
          hint: "合作",
          apply: function (st) {
            st.flags._stallLocationSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            StateManager.addMessage("🤝 轮流用好位置，不用死抢。", "success");
          },
        },
        {
          text: "🚶 不争了",
          hint: "退一步",
          apply: function (st) {
            st.flags._stallLocationSeen = true;
            StateManager.addMessage("🚶 抢到了也得天天防着别人来抢。", "info");
          },
        },
      ],
    },
    {
      id: "temple_economy",
      phase: "street",
      icon: "🪫",
      title: "寺庙经济",
      story: "灵隐寺排队比商场还多。卖香烛的大妈一天¥3,000。年轻人全来上香了。",
      triggers: { minDay: 40, excludeFlags: ["_templeEconomySeen"] },
      choices: [
        {
          text: "🩧 进手串去卖（¥800）",
          hint: "高毛利",
          cost: 800,
          apply: function (st) {
            st.flags._templeEconomySeen = true;
            var earn = Random.int(1200, 1999);
            st.resources.cash += earn;
            StateManager.addMessage(
              "🩧 开光手串赚了¥" + earn.toLocaleString() + "。",
              "event",
            );
          },
        },
        {
          text: "\u2615 摆咖啡摊",
          hint: "年轻人喜欢",
          apply: function (st) {
            st.flags._templeEconomySeen = true;
            var earn2 = Random.int(800, 1199);
            st.resources.cash += earn2;
            StateManager.addMessage(
              "\u2615 三轮车咖啡摊赚了¥" + earn2.toLocaleString() + "。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "viral_harassment",
      phase: "street",
      icon: "📵",
      title: "一条视频惹的祸",
      story:
        "送外卖时被网红蹭到，她直播说你撞人想跑。3万人围观，你的照片被贴了出来。",
      // [自洽修复] conditions 新增：送外卖职业检查（story 明确"送外卖时"，需 sideHustle driving 或 logistics 路径）
      conditions: function (st) {
        var isDelivery =
          (st.sideHustle && st.sideHustle.type === "driving") ||
          (st.career &&
            st.career.currentJob &&
            st.career.currentJob.path === "logistics");
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          isDelivery &&
          !st.flags._viralHarassmentSeen
        );
      },
      choices: [
        {
          text: "📱 拍视频解释",
          hint: "用证据反击",
          apply: function (st) {
            st.flags._viralHarassmentSeen = true;
            if (Random.chance(0.5)) {
              st.resources.cash += 2000;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
              StateManager.addMessage("📱 舆论反转！你涨了2,000粉。", "event");
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 15);
              StateManager.addMessage(
                "📱 澄清视频没人看。先发声才重要。",
                "warning",
              );
            }
          },
        },
        {
          text: "😤 忍了不回应",
          hint: "等热度过去",
          apply: function (st) {
            st.flags._viralHarassmentSeen = true;
            StateManager.addMessage(
              "😤 你卸载了抖音。三天后没人记得了。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "delivery_price_war",
      phase: "street",
      icon: "🛵",
      title: "配送费又降了",
      story: "单价从¥7.5降到¥5.8。有人号召罢工——但总有人愿意跑。",
      // [自洽修复] conditions 新增：送外卖职业检查（story/options 提及骑手服，需 sideHustle driving 或 logistics 路径）
      conditions: function (st) {
        var isDelivery =
          (st.sideHustle && st.sideHustle.type === "driving") ||
          (st.career &&
            st.career.currentJob &&
            st.career.currentJob.path === "logistics");
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          isDelivery &&
          !st.flags._deliveryPriceSeen
        );
      },
      choices: [
        {
          text: "😤 参加罢工",
          hint: "团结",
          apply: function (st) {
            st.flags._deliveryPriceSeen = true;
            st.resources.cash -= 200;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
            StateManager.addMessage("😤 罢工三天，单价涨回¥7.0。", "event");
          },
        },
        {
          text: "\u26a1 专接高价跑腿单",
          hint: "质胜量",
          apply: function (st) {
            st.flags._deliveryPriceSeen = true;
            var earn = Random.int(300, 599);
            st.resources.cash += earn;
            StateManager.addMessage(
              "\u26a1 跑腿高价单多赚¥" + earn.toLocaleString() + "。",
              "event",
            );
          },
        },
        {
          text: "😞 换行",
          hint: "此处不留爷",
          apply: function (st) {
            st.flags._deliveryPriceSeen = true;
            StateManager.addMessage(
              "😞 你把骑手服收起来了。明天重新开始。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "ev_used_car_crash",
      phase: "street",
      icon: "🚗",
      title: "新能源二手崩了",
      story:
        "去年¥120,000的新能源车，二手¥48,000。做二手车的陈哥仓库压了十几台。",
      triggers: { minDay: 50, excludeFlags: ["_evUsedCarSeen"] },
      choices: [
        {
          text: "💰 抄底收一台",
          hint: "赌反弹",
          apply: function (st) {
            st.flags._evUsedCarSeen = true;
            st.resources.cash -= 30000;
            StateManager.addMessage(
              "💰 花¥30,000收了一台。陈哥说你胆子真大。",
              "event",
            );
          },
        },
        {
          text: "🚫 不碰",
          hint: "不熟不做",
          apply: function (st) {
            st.flags._evUsedCarSeen = true;
            StateManager.addMessage(
              "🚫 知道自己不懂比什么都懂更重要。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "near_expiry_wholesale",
      phase: "street",
      icon: "🥫",
      title: "临期食品生意",
      story:
        "临期食品仓库——¥10一箱进口饼干¥5一瓶橄榄油。¥1,000进货能卖¥2,500。",
      triggers: {
        minDay: 20,
        excludeFlags: ["_nearExpirySeen"],
        minCash: 1000,
      },
      choices: [
        {
          text: "📦 进¥1,000的货去卖",
          hint: "小本生意",
          cost: 1000,
          apply: function (st) {
            st.flags._nearExpirySeen = true;
            var earn = Random.int(1500, 2299);
            st.resources.cash += earn;
            StateManager.addMessage(
              "📦 夜市赚了¥" + earn.toLocaleString() + "。",
              "event",
            );
          },
        },
        {
          text: "🤝 长期合作",
          hint: "做大",
          apply: function (st) {
            st.flags._nearExpirySeen = true;
            st.resources.cash -= 5000;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            StateManager.addMessage("🤝 成了临期食品专营户。", "event");
          },
        },
      ],
    },
    {
      id: "gig_economy_trap",
      phase: "street",
      icon: "📋",
      title: "社保交还是不交",
      story:
        "灵活就业社保每月¥900。一个月才赚¥4,000~¥6,000。隔壁老周胆囊炎花了¥30,000全自费。",
      // [自洽修复] conditions 新增：老周关系检查
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.old_zhou &&
          st.relationships.old_zhou.met
        );
      },
      triggers: { minDay: 45, excludeFlags: ["_gigSocialSeen"] },
      choices: [
        {
          text: "\u2705 交",
          hint: "每月¥900",
          apply: function (st) {
            st.flags._gigSocialSeen = true;
            st.resources.cash -= 900;
            st.player.mental = Math.min(100, (st.player.mental || 20) + 5);
            StateManager.addMessage(
              "\u2705 每月扣¥900，但心里踏实了。",
              "event",
            );
          },
        },
        {
          text: "\u274c 不交存钱",
          hint: "现金为王",
          apply: function (st) {
            st.flags._gigSocialSeen = true;
            StateManager.addMessage(
              "\u274c 省钱当医保基金。祈祷别生病。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "knowledge_pay_bubble",
      phase: "street",
      icon: "🎓",
      title: "¥9,999财富自由课",
      story:
        "短视频导师讲普通人如何财富自由。课程¥9,999。评论分两派——真的有用还是割韭菜。",
      triggers: { minDay: 30, excludeFlags: ["_knowledgePaySeen"] },
      choices: [
        {
          text: "🎣 买了试试（¥9,999）",
          hint: "万一呢",
          cost: 9999,
          apply: function (st) {
            st.flags._knowledgePaySeen = true;
            if (Random.chance(0.15)) {
              st.resources.cash += 30000;
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 10) + 5,
              );
              StateManager.addMessage(
                "🎣 居然不是骗子！你赚回了学费。",
                "event",
              );
            } else {
              st.resources.cash -= 9999;
              StateManager.addMessage(
                "🎣 全是百度货。退款时被拉黑。所有教你快速致富的人都在靠你致富。",
                "warning",
              );
            }
          },
        },
        {
          text: "📚 自己买书学（¥200）",
          hint: "便宜但慢",
          apply: function (st) {
            st.flags._knowledgePaySeen = true;
            st.resources.cash -= 200;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            StateManager.addMessage("📚 学得慢但没人拉黑你。", "success");
          },
        },
        {
          text: "📵 刷走不看",
          hint: "清净",
          apply: function (st) {
            st.flags._knowledgePaySeen = true;
            StateManager.addMessage("📵 屏蔽垃圾信息和赚钱一样重要。", "info");
          },
        },
      ],
    },
    {
      id: "shopping_festival",
      phase: "street",
      icon: "🎉",
      title: "购物狂欢节来了",
      story:
        "铺天盖地的广告：「双11狂欢，全场五折！」批发市场里进货的人跟不要钱一样疯抢。但快递站贴出了急招临时工的大字报——日结¥280，干到凌晨两点。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 10 &&
          !st.flags._shoppingFestSeen &&
          st.player.day % 30 >= 8 &&
          st.player.day % 30 <= 12
        );
      },
      choices: [
        {
          text: "💰 进货囤货等涨价",
          hint: "¥3000进货，7天后卖出预计赚40%",
          apply: function (st) {
            st.flags._shoppingFestSeen = true;
            st.flags._shoppingFestDeal = "stock";
            st.resources.cash -= 3000;
            st.flags._shoppingStockDay = st.player.day;
            StateManager.addMessage(
              "🎉 囤了一批货，等节后涨价卖。存货价值¥4200。",
              "event",
            );
          },
        },
        {
          text: "📦 去快递站做临时工",
          hint: "¥280/天，消耗15行动力",
          apply: function (st) {
            st.flags._shoppingFestSeen = true;
            st.resources.cash += 280;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            st.needs.hunger = Math.max(0, st.needs.hunger - 8);
            StateManager.addMessage(
              "📦 干到凌晨两点，腰快断了。但钱是真的。",
              "info",
            );
          },
        },
        {
          text: "🛒 趁打折给自己买点好的",
          hint: "犒劳自己一下就对了",
          apply: function (st) {
            st.flags._shoppingFestSeen = true;
            st.resources.cash -= 200;
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            StateManager.addMessage(
              "🛒 买了一套新衣服和一双鞋。好久没这么开心了。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "p2p_crash",
      phase: "street",
      icon: "💸",
      title: "全民贷跑路了",
      story:
        "你刷到一条新闻——「全民贷」爆雷，涉及金额¥80亿，线下门店被愤怒的老年人围得水泄不通。有人在门口拉横幅，有人蹲在地上哭。群里有人说内部消息：实际控制人已经飞加拿大。",
      triggers: { minDay: 30, excludeFlags: ["_p2pCrashSeen"], minCash: 500 },
      choices: [
        {
          text: "😰 去现场看看能不能低价收购债权",
          hint: "¥5000收¥30000债权，可能打水漂",
          apply: function (st) {
            st.flags._p2pCrashSeen = true;
            if (st.resources.cash >= 5000) {
              st.flags._p2pInvested = true;
              st.resources.cash -= 5000;
              st.flags._p2pDebtDay = st.player.day;
              StateManager.addMessage(
                "💸 你用¥5000收了一张¥30000的债权。也许能要回来，也许打了水漂。",
                "event",
              );
            } else {
              st.flags._p2pWatched = true;
              StateManager.addMessage(
                "👀 你围观了一天，什么都没做。有个大妈哭得站不住。",
                "info",
              );
            }
          },
        },
        {
          text: "📢 帮维权群众写联名信",
          hint: "帮助别人，让大家记住你",
          apply: function (st) {
            st.flags._p2pCrashSeen = true;
            st.flags._p2pHelped = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            st.player.actionPoints -= 15;
            StateManager.addMessage(
              "📢 你帮老人们写了投诉信。有人拉着你的手说谢谢。",
              "event",
            );
          },
        },
        {
          text: "🚶 看一眼就走了",
          hint: "事不关己",
          apply: function (st) {
            st.flags._p2pCrashSeen = true;
            StateManager.addMessage(
              "💸 不是你的事。但回家的路上心里堵得慌。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "sharing_economy_bubble",
      phase: "street",
      icon: "🚲",
      title: "共享单车坟场",
      story:
        "城郊的空地上堆满了五颜六色的共享单车——橙色、黄色、蓝色，层层叠叠像一座钢铁坟场。押金退了三个月还没到账。但有人在回收这些废铁，一辆¥15。",
      triggers: { minDay: 20, excludeFlags: ["_sharingEconomySeen"] },
      choices: [
        {
          text: "♻️ 回收废铁赚差价",
          hint: "15点行动力，预计赚¥200-400",
          apply: function (st) {
            st.flags._sharingEconomySeen = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 12);
            var earn = Random.int(200, 399);
            st.resources.cash += earn;
            st.needs.hygiene = Math.max(0, st.needs.hygiene - 5);
            StateManager.addMessage(
              "♻️ 拆了一下午单车，卖了¥" + earn + "。手上全是铁锈味。",
              "info",
            );
          },
        },
        {
          text: "📱 注册运维兼职",
          hint: "巡逻摆放单车，日薪¥150",
          apply: function (st) {
            st.flags._sharingEconomySeen = true;
            st.flags._sharingJobUnlocked = true;
            StateManager.addMessage(
              "📱 注册了共享单车运维。把这当作全职也行，月入¥3500。",
              "event",
            );
          },
        },
        {
          text: "😤 在群里骂押金不退",
          hint: "爽但不解决问题",
          apply: function (st) {
            st.flags._sharingEconomySeen = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage("😤 骂完了，押金还是没退。", "info");
          },
        },
      ],
    },
    {
      id: "big_tech_layoff",
      phase: "street",
      icon: "🏢",
      title: "大厂毕业季",
      story:
        "你刷到一篇推送——「辰光网络Q2财报不及预期，裁员30%」。写字楼门口有抱着纸箱出来的人，有人西装革履站在路边抽烟发呆。二手平台上突然多了一批99新的MacBook Pro和人体工学椅。",
      triggers: { minDay: 40, excludeFlags: ["_bigTechLayoffSeen"] },
      choices: [
        {
          text: "💻 低价收购被裁员工的设备",
          hint: "¥3000收MacBook，转手可卖¥5000",
          apply: function (st) {
            st.flags._bigTechLayoffSeen = true;
            if (st.resources.cash >= 3000) {
              st.resources.cash -= 3000;
              st.flags._layoffGear = true;
              st.flags._layoffGearDay = st.player.day;
              StateManager.addMessage(
                "💻 收到一台99新的MacBook Pro和一把赫曼米勒。转手能赚¥2000。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "💻 看了一圈好东西但买不起。有个大哥问你要不要他的显示器，¥200。",
                "info",
              );
              if (st.resources.cash >= 200) {
                st.resources.cash -= 200;
                st.flags._layoffCheapGear = true;
                StateManager.addMessage(
                  "🖥️ 捡漏了一台27寸显示器，自己用也行卖了也行。",
                  "info",
                );
              }
            }
          },
        },
        {
          text: "📞 问有没有内推机会",
          hint: "高风险高回报",
          apply: function (st) {
            st.flags._bigTechLayoffSeen = true;
            st.flags._layoffAskedForReferral = true;
            StateManager.addMessage(
              "📞 被裁的人苦笑着：「我自己都没着落呢。」给了你一张名片：「下个月我可能在新公司。」",
              "event",
            );
          },
        },
        {
          text: "🏪 去写字楼门口卖盒饭",
          hint: "总得吃饭",
          apply: function (st) {
            st.flags._bigTechLayoffSeen = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 8);
            st.resources.cash += 180;
            StateManager.addMessage(
              "🏪 你推着小车过去。被裁的人买盒饭不还价——他们没心情。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "tech_996_debate",
      phase: "street",
      icon: "⏰",
      title: "取消大小周",
      story:
        "新闻炸了——「橙象集团取消大小周，员工月薪普降15%」。群里吵翻了：有人说时薪没变爽啊，有人说降薪了房贷怎么办。楼下便利店老板叹气：「大厂不加班了，夜里没人买夜宵了。」",
      triggers: { minDay: 35, excludeFlags: ["_tech996Seen"] },
      choices: [
        {
          text: "🎉 高兴——可以找正常下班的朋友玩",
          hint: "下班后的小确幸",
          apply: function (st) {
            st.flags._tech996Seen = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage(
              "🎉 你发消息给在大厂的同学：「以后能约晚饭了！」他回了个苦笑表情。",
              "success",
            );
          },
        },
        {
          text: "📦 以后少进点夜宵货",
          hint: "便利店夜宵需求下降",
          apply: function (st) {
            st.flags._tech996Seen = true;
            st.flags._nightMarketDecline = true;
            StateManager.addMessage(
              "📦 你减少了夜宵进货。这附近的夜经济要冷一阵了。",
              "info",
            );
          },
        },
        {
          text: "💼 投简历——大厂现在WLB了",
          hint: "开启一条新路线",
          apply: function (st) {
            st.flags._tech996Seen = true;
            st.flags._techWLBFactor = true;
            StateManager.addMessage(
              "💼 你更新了简历。也许这是个进大厂的好时机。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "china_stock_delist",
      phase: "street",
      icon: "📉",
      title: "中概股退市风暴",
      story:
        "「审计底稿」争端升级，美股市场的中国公司集体面临退市。新闻里专家的嘴一张一合：「对业务没有实质影响。」但股价已经跌了70%。有朋友说他老板之前套现了¥3000万——现在人在新加坡。",
      triggers: { minDay: 50, excludeFlags: ["_chinaDelistSeen"] },
      choices: [
        {
          text: "📈 抄底中概股ETF",
          hint: "高风险投资，¥2000起",
          apply: function (st) {
            st.flags._chinaDelistSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._chinaDelistBought = true;
              st.flags._chinaDelistDay = st.player.day;
              StateManager.addMessage(
                "📈 你在最低点买了中概ETF。可能是抄底，可能是接飞刀。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📈 想抄底但没钱。你第一次感受到：「机会来了没钱也是一种痛苦。」",
                "info",
              );
            }
          },
        },
        {
          text: "💼 找机会进回港上市的公司",
          hint: "有些公司回港二次上市在招人",
          apply: function (st) {
            st.flags._chinaDelistSeen = true;
            st.flags._hkListJobChance = true;
            StateManager.addMessage(
              "💼 有猎头在群里发了几个香港职位。你不一定够格，但值得一试。",
              "event",
            );
          },
        },
        {
          text: "🧽 吃瓜看戏",
          hint: "什么都不做",
          apply: function (st) {
            st.flags._chinaDelistSeen = true;
            StateManager.addMessage(
              "📉 你关了新闻。这些离你太远了——你今天的晚饭还没着落。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "demolition_fortune",
      phase: "street",
      icon: "🏚️",
      title: "拆迁公告",
      story:
        "村口的公告栏贴了一张红头文件——「新城街道旧改项目征收公告」。20年的老房子，按补偿方案能赔¥120万或一套安置房。老李头拿着公告手在抖：「等了15年，终于等到了。」但旁边有人悄悄说：「现在签字亏了，等多三个月至少多赔30%。」",
      triggers: { minDay: 60, excludeFlags: ["_demolitionSeen"] },
      choices: [
        {
          text: "🏡 劝邻居早签早拿钱",
          hint: "稳妥派，邻居感谢你得人情",
          apply: function (st) {
            st.flags._demolitionSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            StateManager.addMessage(
              "🏡 你劝老李签字。他请你吃了顿饭：「小伙子实在人。」",
              "event",
            );
          },
        },
        {
          text: "💰 赌一把——借钱买公告范围内的老房子",
          hint: "高风险投机，需要¥5万首付",
          apply: function (st) {
            st.flags._demolitionSeen = true;
            if (st.resources.cash >= 50000) {
              st.resources.cash -= 50000;
              st.flags._demolitionGambled = true;
              st.flags._demolitionDay = st.player.day;
              StateManager.addMessage(
                "💰 你签了合同买下一间20平的老房。赌拆迁——要么翻倍，要么砸手里。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "💰 你算了算存款，不够首付。拆迁暴富的梦破灭了。",
                "info",
              );
            }
          },
        },
        {
          text: "🏪 进一批装修材料来卖",
          hint: "拆迁片区装修需求大",
          apply: function (st) {
            st.flags._demolitionSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._demolitionSupply = true;
              StateManager.addMessage(
                "🏪 你进了水泥和瓷砖。拆迁户装修总得买东西吧。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🏪 连进货的钱都没有。你蹲在路边看别人忙活。",
                "info",
              );
            }
          },
        },
      ],
    },
    {
      id: "unfinished_building",
      phase: "street",
      icon: "🏗️",
      title: "烂尾楼前",
      story:
        "一栋封顶的大楼矗立在雨中——脚手架还在，但工地上已经没人了。开发商资金链断裂，300多户业主交了首付却拿不到房。有人在楼顶拉横幅，有人在售楼处门口搭了帐篷。七个业主凑钱请了律师，每人摊¥3000。",
      // [自洽修复] conditions 新增：雨天检查（story 明确"矗立在雨中"，需天气为 rainy/stormy/foggy）
      conditions: function (st) {
        var isRainy =
          st.weather &&
          (st.weather.current === "rainy" ||
            st.weather.current === "stormy" ||
            st.weather.current === "foggy");
        return (
          st.player.phase === "street" &&
          st.player.day >= 45 &&
          !st.flags._unfinishedSeen &&
          isRainy
        );
      },
      choices: [
        {
          text: "⚖️ 捐¥300支持业主打官司",
          hint: "名声+2，用良心投票",
          apply: function (st) {
            st.flags._unfinishedSeen = true;
            if (st.resources.cash >= 300) {
              st.resources.cash -= 300;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
              StateManager.addMessage(
                "⚖️ 你捐了¥300。业主群把你拉进去发了三个鲜花表情。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "⚖️ 你想帮忙，但口袋比脸还干净。",
                "info",
              );
            }
          },
        },
        {
          text: "🔍 打听烂尾楼有没有收购方",
          hint: "也许有投资机会",
          apply: function (st) {
            st.flags._unfinishedSeen = true;
            st.flags._unfinishedInvestigated = true;
            StateManager.addMessage(
              "🔍 听说有家AMC在谈收购。如果成了，房价能涨30%。如果谈不成……",
              "event",
            );
          },
        },
        {
          text: "🚶 绕路走",
          hint: "不关我事",
          apply: function (st) {
            st.flags._unfinishedSeen = true;
            StateManager.addMessage(
              "🏗️ 你绕过了那栋楼。雨里的钢筋混凝土像一座墓碑。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "rental_apartment_crash",
      phase: "street",
      icon: "🏠",
      title: "长租公寓爆雷",
      story:
        "「城客公寓」爆雷了。房东没收到租金要赶人，租客一次性交了半年房租却被物业贴了催缴单。你住的城中村虽然没有长租公寓，但好几个工友都在群里问：「有没有便宜的单间转租？」",
      triggers: { minDay: 15, excludeFlags: ["_rentalCrashSeen"] },
      choices: [
        {
          text: "🏠 帮忙转介绍靠谱房东",
          hint: "人情+2，介绍成功有红包",
          apply: function (st) {
            st.flags._rentalCrashSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            // [自洽修复] 补王婶关系初始化与红包逻辑
            if (!st.relationships.aunt_wang) {
              st.relationships.aunt_wang = { affinity: 0, met: true };
            }
            st.resources.cash += 100;
            StateManager.addMessage(
              "🏠 你介绍了王婶的空房给工友。王婶给了你¥100红包。",
              "success",
            );
          },
        },
        {
          text: "📢 提醒大家租房选月付",
          hint: "虽然贵点但安全",
          apply: function (st) {
            st.flags._rentalCrashSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            StateManager.addMessage(
              "📢 你在群里发了条消息：「租房别付超过一个月的押金。」有人回了个大拇指。",
              "info",
            );
          },
        },
        {
          text: "😴 跟自己没关系",
          hint: "你连房租都快交不起了",
          apply: function (st) {
            st.flags._rentalCrashSeen = true;
            StateManager.addMessage(
              "🏠 你连房租都快交不起了，管不了别人。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "purchase_restriction_relax",
      phase: "street",
      icon: "📋",
      title: "限购松绑了",
      story:
        "新政出台：社保满一年即可购房，二套房首付从60%降到40%。中介的朋友圈集体沸腾：「上车好时机！」你算了一下自己的存款——距离首付还差一个零。",
      triggers: { minDay: 70, excludeFlags: ["_purchaseRelaxSeen"] },
      choices: [
        {
          text: "🏦 找中介咨询低首付购房",
          hint: "也许有路子，但可能踩坑",
          apply: function (st) {
            st.flags._purchaseRelaxSeen = true;
            st.flags._consultedAgent = true;
            StateManager.addMessage(
              "🏦 中介热情得很：「首付贷我们帮你搞定！」利率没说。你没敢签。",
              "event",
            );
          },
        },
        {
          text: "📈 买房地产板块股票",
          hint: "政策利好，¥2000尝试",
          apply: function (st) {
            st.flags._purchaseRelaxSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._realEstateStockBought = true;
              st.flags._realEstateStockDay = st.player.day;
              StateManager.addMessage(
                "📈 买了两手地产股。希望这波行情能带带你。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📈 没钱买股票。你连二手都算不上。",
                "info",
              );
            }
          },
        },
        {
          text: "📱 刷过去当没看见",
          hint: "看了也买不起",
          apply: function (st) {
            st.flags._purchaseRelaxSeen = true;
            StateManager.addMessage("📱 你划走了。看多了容易心态崩。", "info");
          },
        },
      ],
    },
    {
      id: "old_community_elevator",
      phase: "street",
      icon: "🛗",
      title: "加装电梯风波",
      story:
        "你路过一个老旧小区，看到一楼住户和六楼老太太在吵架——加装电梯，一楼说挡了采光房子贬值，六楼说腿脚不便三年没下楼了。社区调解员两边赔笑脸，手里的本子记满了双方的意见。",
      triggers: { minDay: 25, excludeFlags: ["_elevatorSeen"] },
      choices: [
        {
          text: "🤝 帮忙调解",
          hint: "做和事佬，名声+3，花10行动力",
          apply: function (st) {
            st.flags._elevatorSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            StateManager.addMessage(
              "🤝 你花了一下午调解。最后六楼阿姨哭了，一楼大叔沉默了。调解书上签了字。",
              "event",
            );
          },
        },
        {
          text: "🏪 推销搬家服务",
          hint: "如果他们谈不拢可能有人要搬家",
          apply: function (st) {
            st.flags._elevatorSeen = true;
            st.flags._elevatorMovingBiz = true;
            StateManager.addMessage(
              "🏪 你给六楼阿姨留了张名片：「需要搬家找我。」她收下了。",
              "info",
            );
          },
        },
        {
          text: "🚶 看热闹",
          hint: "不关你事",
          apply: function (st) {
            st.flags._elevatorSeen = true;
            StateManager.addMessage(
              "🛗 你站在旁边看了十分钟。这城市里每个人都有自己的难处。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "school_district_policy",
      phase: "street",
      icon: "📚",
      title: "学区房变天",
      story:
        "「多校划片」政策出台，实验小学的学区房一夜跌了40%。群里有个人三天前刚签了合同，多花¥80万买的学区房——现在和隔壁老破小一个学校。中介的电话被打爆了，全是骂人的。",
      triggers: { minDay: 55, excludeFlags: ["_schoolDistrictSeen"] },
      choices: [
        {
          text: "👍 正好——以后孩子上学不拼房子了",
          hint: "对你这种没房的人反而是利好",
          apply: function (st) {
            st.flags._schoolDistrictSeen = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            StateManager.addMessage(
              "👍 你一直觉得学区房是扯淡。公平起见，挺好。",
              "success",
            );
          },
        },
        {
          text: "💰 看有没有急售的学区房可以捡漏",
          hint: "有些房东急出手，打七折",
          apply: function (st) {
            st.flags._schoolDistrictSeen = true;
            if (st.resources.cash >= 100000) {
              st.resources.cash -= 100000;
              st.flags._schoolDistrictBought = true;
              st.flags._schoolDistrictDay = st.player.day;
              StateManager.addMessage(
                "💰 你捡漏了一套打折学区房。政策会变，但房子是实的。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "💰 你连首付零头都不够。学区房再跌你也买不起。",
                "info",
              );
            }
          },
        },
        {
          text: "🧽 吃瓜",
          hint: "看有钱人打架",
          apply: function (st) {
            st.flags._schoolDistrictSeen = true;
            StateManager.addMessage(
              "🧽 你在群里潜水看人吵架。有人@你：「你笑什么？」你没回。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "talent_introduction_war",
      phase: "street",
      icon: "🎓",
      title: "抢人大战",
      story:
        "二线城市又来抢人了：大专以上学历直接落户，给¥5万生活补贴，人才公寓租金打五折。你算了一下——自己好像符合条件。但要去一个陌生的城市重新开始。",
      triggers: {
        minDay: 35,
        excludeFlags: ["_talentWarSeen"],
        minStat: { intelligence: 25 },
      },
      choices: [
        {
          text: "✈️ 认真考虑去二线城市发展",
          hint: "开启新城市线，但需要重新积累",
          apply: function (st) {
            st.flags._talentWarSeen = true;
            st.flags._considerRelocate = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 12);
            StateManager.addMessage(
              "✈️ 你认真查了那个城市的信息。房租¥800一居室，房价¥1万/平。有点心动。",
              "event",
            );
          },
        },
        {
          text: "📞 假装高端人才拿offer再拒绝",
          hint: "不太道德但能了解行情",
          apply: function (st) {
            st.flags._talentWarSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            StateManager.addMessage(
              "📞 你跟人才热线聊了20分钟。对方很热情。你觉得有点愧疚。",
              "info",
            );
          },
        },
        {
          text: "🚶 大城市还没混明白呢",
          hint: "不走",
          apply: function (st) {
            st.flags._talentWarSeen = true;
            StateManager.addMessage(
              "🚶 你还没在这座城市站稳脚跟。等混出头了再说吧。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "stock_market_boom",
      phase: "street",
      icon: "📈",
      title: "A股疯了",
      story:
        "大盘连续涨了15天，从2800点冲到了4200点。食堂里、公交上、厕所隔间——所有人都在看手机上的K线。卖菜的老刘把攒了五年的¥20万全扔进去了。你攥着口袋里的几千块，心跳加速。",
      triggers: { minDay: 30, excludeFlags: ["_stockBoomSeen"], minCash: 1000 },
      choices: [
        {
          text: "🔥 跟进去——全仓买入",
          hint: "高风险高回报，可能翻倍也可能腰斩",
          apply: function (st) {
            st.flags._stockBoomSeen = true;
            var invest = Math.min(st.resources.cash, 10000);
            st.resources.cash -= invest;
            st.flags._stockBoomInvested = invest;
            st.flags._stockBoomDay = st.player.day;
            StateManager.addMessage(
              "🔥 你全仓买入！看着红彤彤的K线，手心都是汗。",
              "event",
            );
          },
        },
        {
          text: "🤔 买一半留一半",
          hint: "稳健",
          apply: function (st) {
            st.flags._stockBoomSeen = true;
            var invest = Math.min(Math.floor(st.resources.cash / 2), 5000);
            st.resources.cash -= invest;
            st.flags._stockBoomHalfInvested = invest;
            st.flags._stockBoomDay = st.player.day;
            StateManager.addMessage(
              "🤔 你买了¥" + invest + "。留了一半现金——万一崩了还能吃饭。",
              "info",
            );
          },
        },
        {
          text: "🧊 不碰——都是泡沫",
          hint: "理智，但不赚钱",
          apply: function (st) {
            st.flags._stockBoomSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            StateManager.addMessage(
              "🧊 你忍住了。老刘在边上说：「你不买就是踏空啊！」你笑笑没说话。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "crypto_cycle",
      phase: "street",
      icon: "₿",
      title: "比特币又减半了",
      story:
        "比特币第四次减半完成，价格从¥25万冲到¥60万。群里有人说他2018年花¥3000买了0.5个BTC忘了，现在值¥30万。二手电脑城里有人开始攒显卡挖矿，电费¥1.2/度也拦不住。",
      triggers: { minDay: 50, excludeFlags: ["_cryptoCycleSeen"] },
      choices: [
        {
          text: "₿ 买一点比特币试试",
          hint: "¥2000起，可能暴富可能归零",
          apply: function (st) {
            st.flags._cryptoCycleSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._cryptoBought = true;
              st.flags._cryptoDay = st.player.day;
              StateManager.addMessage(
                "₿ 你买了¥2000的比特币。私钥抄在本子上，藏在枕头底下。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "₿ 连¥2000都拿不出来。你第一次觉得穷限制了对风险的想象。",
                "info",
              );
            }
          },
        },
        {
          text: "⚡ 去电脑城帮人装矿机",
          hint: "体力活，一天赚¥300",
          apply: function (st) {
            st.flags._cryptoCycleSeen = true;
            st.resources.cash += 300;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 12);
            StateManager.addMessage(
              "⚡ 装了一天显卡。老板问你要不要工资折成ETH——你没敢。",
              "info",
            );
          },
        },
        {
          text: "📚 学习区块链知识",
          hint: "增长见识，开阔视野",
          apply: function (st) {
            st.flags._cryptoCycleSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 3,
            );
            StateManager.addMessage(
              "📚 你花了一周搞懂了什么是共识机制。虽然还是买不起。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "retail_vs_wallstreet",
      phase: "street",
      icon: "🐂",
      title: "散户大战华尔街",
      story:
        "「柠檬汽水」被知名做空机构发布17页做空报告，股价暴跌20%。但REDDIT上的散户们不干了——「YOLO！ALL IN！」群里的中文翻译比原文还热闹：「机构做空200%，逼空要爆了！」",
      triggers: {
        minDay: 40,
        excludeFlags: ["_retailVsWallSeen"],
        minCash: 500,
      },
      choices: [
        {
          text: "🐂 跟散户一起冲",
          hint: "买¥2000，可能会翻倍也可能血本无归",
          apply: function (st) {
            st.flags._retailVsWallSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._retailWsbBet = true;
              st.flags._retailWsbDay = st.player.day;
              StateManager.addMessage(
                "🐂 你跟着群里的翻译一起买入了。群里在喊「DIAMOND HANDS！」你其实不知道什么意思。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🐂 你连¥2000都没有。只能在群里看别人暴富或跳楼。",
                "info",
              );
            }
          },
        },
        {
          text: "🏦 跟着机构做空",
          hint: "需要¥5000保证金，有大机构背书",
          apply: function (st) {
            st.flags._retailVsWallSeen = true;
            if (st.resources.cash >= 5000) {
              st.resources.cash -= 5000;
              st.flags._retailShortSide = true;
              st.flags._retailShortDay = st.player.day;
              StateManager.addMessage(
                "🏦 你跟机构站在一边。理性上是对的，但心里有点不舒服。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🏦 机构的门槛你都够不着。也许这就是散户的命。",
                "info",
              );
            }
          },
        },
        {
          text: "🍿 吃瓜看戏",
          hint: "什么都不做最安全",
          apply: function (st) {
            st.flags._retailVsWallSeen = true;
            StateManager.addMessage(
              "🍿 你搬了小板凳看群里的战况。今天不亏就是赚。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "quant_fund_harvest",
      phase: "street",
      icon: "🤖",
      title: "量化基金收割",
      story:
        "「幻方量化」去年收益43%，今年前三个月已经亏了15%。有人说量化基金就是高频割韭菜——散户的每一笔交易都被算法预测。你想起上周自己买了就跌、卖了就涨的股票，后背一凉。",
      triggers: { minDay: 55, excludeFlags: ["_quantFundSeen"] },
      choices: [
        {
          text: "🤖 买量化基金——打不过就加入",
          hint: "¥10000起购，年化预期12%",
          apply: function (st) {
            st.flags._quantFundSeen = true;
            if (st.resources.cash >= 10000) {
              st.resources.cash -= 10000;
              st.flags._quantFundBought = true;
              st.flags._quantFundDay = st.player.day;
              StateManager.addMessage(
                "🤖 你买了量化基金。AI帮你炒股，你在出租屋里等收益。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🤖 门槛¥10000，你差了¥" +
                  (10000 - st.resources.cash) +
                  "。想在城里活着真不容易。",
                "info",
              );
            }
          },
        },
        {
          text: "📖 学习量化交易知识",
          hint: "学习量化交易知识",
          apply: function (st) {
            st.flags._quantFundSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            StateManager.addMessage(
              "📖 你看了三篇量化的文章。90%没看懂，但感觉很高端。",
              "success",
            );
          },
        },
        {
          text: "🚶 不碰——我就是那个被割的韭菜",
          hint: "有自知之明",
          apply: function (st) {
            st.flags._quantFundSeen = true;
            StateManager.addMessage(
              "🚶 你承认了自己就是韭菜。不丢人——至少今天没亏钱。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "deposit_rate_cut",
      phase: "street",
      icon: "🏦",
      title: "存款利率又降了",
      story:
        "银行又降息了——一年期存款利率从1.5%降到1.0%。余额宝的收益跌到1.8%，创历史新低。你算了算：存¥10000在银行，一年利息¥100，够吃两顿沙县。房东说下个月涨房租¥150。",
      triggers: { minDay: 20, excludeFlags: ["_depositRateCutSeen"] },
      choices: [
        {
          text: "📈 把钱从银行取出来投资",
          hint: "被迫承担更高风险",
          apply: function (st) {
            st.flags._depositRateCutSeen = true;
            st.flags._rateCutInvestMode = true;
            StateManager.addMessage(
              "📈 你把存款取了出来。存银行是等死，投资是找死——但找死还有一线生机。",
              "event",
            );
          },
        },
        {
          text: "🏠 跟房东谈年付打折",
          hint: "锁定一年租金，省下涨幅",
          apply: function (st) {
            st.flags._depositRateCutSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            StateManager.addMessage(
              "🏠 你找房东谈了年付。房东同意了——打95折。省下的钱够吃一个月沙县。",
              "success",
            );
          },
        },
        {
          text: "😤 存着吧，至少不会亏本",
          hint: "稳妥但购买力在缩水",
          apply: function (st) {
            st.flags._depositRateCutSeen = true;
            StateManager.addMessage(
              "😤 你看着账户里的数字。不增加就是减少，这道理你懂。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "exchange_rate_break7",
      phase: "street",
      icon: "💱",
      title: "汇率破7了",
      story:
        "美元兑人民币汇率突破7.2。做外贸的李哥最近订单接到手软——「人民币贬值了，老外觉得我们的货跟白送一样。」但进口商的脸色很难看——电脑配件进货价涨了15%，整条街的装机店都在调价。",
      triggers: { minDay: 40, excludeFlags: ["_exchangeRateSeen"] },
      choices: [
        {
          text: "💵 换点美元避险",
          hint: "¥5000换美元，保值但占用资金",
          apply: function (st) {
            st.flags._exchangeRateSeen = true;
            if (st.resources.cash >= 5000) {
              st.resources.cash -= 5000;
              st.flags._usdHeld = true;
              st.flags._usdHeldDay = st.player.day;
              StateManager.addMessage(
                "💵 你换了$700美元。握着绿色的票子，感觉确实不一样。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "💵 想换汇但钱太少。银行柜员看了你的余额没说啥——但你从她眼神里读到了。",
                "info",
              );
            }
          },
        },
        {
          text: "📦 趁电脑配件涨价前进一批货",
          hint: "进货成本增加前囤货",
          apply: function (st) {
            st.flags._exchangeRateSeen = true;
            if (st.resources.cash >= 3000) {
              st.resources.cash -= 3000;
              st.flags._importGoodsStock = true;
              StateManager.addMessage(
                "📦 你在涨价前进了一批硬盘和内存。过两周能卖个好价钱。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📦 连囤货的钱都没有。你感觉自己被通胀和贫穷两头夹击。",
                "info",
              );
            }
          },
        },
        {
          text: "💼 问问李哥那边缺不缺人",
          hint: "外贸业务扩张，可能需要人手",
          apply: function (st) {
            st.flags._exchangeRateSeen = true;
            st.flags._tradeJobChance = true;
            StateManager.addMessage(
              "💼 李哥说缺个跟单的，工资不高但能学东西。你留了电话。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "trust_crash",
      phase: "street",
      icon: "🧾",
      title: "信托暴雷",
      story:
        "「中诚信托·XX号」逾期了——涉及金额¥300亿，投资者在总部楼下拉起了横幅。你看到新闻里一个穿西装的中年男人对着镜头说：「这是我妈的养老钱，¥200万。」那个人的表情比哭还难看。",
      triggers: { minDay: 60, excludeFlags: ["_trustCrashSeen"] },
      choices: [
        {
          text: "🔍 打听有没有打折转让的信托份额",
          hint: "¥5000收¥50000份额，可能血本无归也可能翻盘",
          apply: function (st) {
            st.flags._trustCrashSeen = true;
            if (st.resources.cash >= 5000) {
              st.resources.cash -= 5000;
              st.flags._trustDebtBought = true;
              st.flags._trustDebtDay = st.player.day;
              StateManager.addMessage(
                "🔍 你从一个急着用钱的人手里收了¥50000的信托债权。他谢谢你——你是来接盘的。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🔍 收债权的机会摆在眼前，但你连¥5000都没有。",
                "info",
              );
            }
          },
        },
        {
          text: "📞 安慰一下那个上新闻的人",
          hint: "虽然不认识，但人心都是肉长的",
          apply: function (st) {
            st.flags._trustCrashSeen = true;
            st.needs.happiness = Math.min(100, st.needs.happiness - 3);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            StateManager.addMessage(
              "📞 你搜到了他的微博，留了条私信：「大哥，挺住。」已读，没回。",
              "info",
            );
          },
        },
        {
          text: "📵 关掉新闻",
          hint: "眼不见心不烦",
          apply: function (st) {
            st.flags._trustCrashSeen = true;
            StateManager.addMessage(
              "📵 你划走了。¥300亿离你很远——你今天的烦恼是午饭吃¥8还是¥12。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "pandemic_black_swan",
      phase: "street",
      icon: "🦠",
      title: "突发公共卫生事件",
      story:
        "新闻弹窗：某区发现新型流感病例，全市进入三级响应。药店的口罩10分钟被抢光，超市的泡面和矿泉水货架空了一半。社区在招志愿者——包三餐，每天¥100补贴。",
      triggers: { minDay: 15, maxDay: 200, excludeFlags: ["_pandemicSeen"] },
      choices: [
        {
          text: "😷 报名社区志愿者",
          hint: "包三餐+¥100/天，但有一定健康风险",
          apply: function (st) {
            st.flags._pandemicSeen = true;
            st.flags._pandemicVolunteer = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            st.resources.cash += 300;
            StateManager.addMessage(
              "😷 你穿了三天防护服。社区大妈给你竖了大拇指。累，但值。",
              "event",
            );
          },
        },
        {
          text: "📦 进一批口罩和消毒液来卖",
          hint: "倒卖防疫物资，收益高但有争议",
          apply: function (st) {
            st.flags._pandemicSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._pandemicProfiteer = true;
              StateManager.addMessage(
                "📦 你进了一批口罩按进价3倍卖。赚钱了——但你妈知道了会怎么说？",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📦 想发财连本钱都没有。你第一次感谢贫穷让你保住了道德。",
                "info",
              );
            }
          },
        },
        {
          text: "🏠 在家囤粮减少外出",
          hint: "安全第一",
          apply: function (st) {
            st.flags._pandemicSeen = true;
            st.resources.cash -= 200;
            StateManager.addMessage(
              "🏠 你买了半个月的粮食和水。待在屋里最安全。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "chip_localization",
      phase: "street",
      icon: "🔬",
      title: "芯片国产化浪潮",
      story:
        "美国又升级了对华芯片出口管制。但新闻里说国产芯片良率突破了70%——虽然跟台积电还有差距，但够用了。工业园区的封装厂到处贴招聘广告：「芯片测试员，月薪¥6000起，包吃住。」",
      triggers: { minDay: 45, excludeFlags: ["_chipLocalSeen"] },
      choices: [
        {
          text: "🏭 去芯片厂面试",
          hint: "月薪¥6000，技能要求智力≥25",
          apply: function (st) {
            st.flags._chipLocalSeen = true;
            if ((st.player.intelligence || 0) >= 25) {
              st.flags._chipFabJob = true;
              StateManager.addMessage(
                "🏭 你面试过了。穿上无尘服的那一刻，感觉自己像个科学家。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🏭 你连笔试都没过。基础电路图看不懂——城里的知识门槛比想象的高。",
                "warning",
              );
            }
          },
        },
        {
          text: "📈 买国产芯片概念股",
          hint: "¥2000，赌国运",
          apply: function (st) {
            st.flags._chipLocalSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._chipStockBought = true;
              st.flags._chipStockDay = st.player.day;
              StateManager.addMessage(
                "📈 你买了国产芯片股。这是情怀还是投资——你分不清。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📈 连¥2000的股票都买不起。芯片国产化和你的钱包没什么关系。",
                "info",
              );
            }
          },
        },
        {
          text: "📖 报名夜校学电路基础",
          hint: "花笔学费学习实用技能",
          apply: function (st) {
            st.flags._chipLocalSeen = true;
            if (st.resources.cash >= 500) {
              st.resources.cash -= 500;
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 10) + 3,
              );
              StateManager.addMessage(
                "📖 你在夜校学了两个月电路。老师说你有天赋——你第一次被人夸。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "📖 ¥500的学费都掏不出来。你恨自己为什么以前不好好学习。",
                "info",
              );
            }
          },
        },
      ],
    },
    {
      id: "pre_made_food_trend",
      phase: "street",
      icon: "🍱",
      title: "预制菜入侵",
      story:
        "那条街上的三家小饭馆有两家换上了「预制菜」的招牌——料理包加热3分钟，成本¥3.5，卖¥18。王婶的面馆还在坚持手工拉面——但客人少了四成。冷冻批发市场多了好多卖料理包的摊位。",
      // [自洽修复] conditions 新增：王婶关系检查（story 明确提到"王婶的面馆"，需已结识）
      conditions: function (st) {
        var hasAuntWang =
          st.relationships &&
          st.relationships.aunt_wang &&
          st.relationships.aunt_wang.met === true;
        return (
          st.player.phase === "street" &&
          st.player.day >= 20 &&
          hasAuntWang &&
          !st.flags._preMadeFoodSeen
        );
      },
      choices: [
        {
          text: "📦 批发料理包来卖",
          hint: "门槛低利润薄，¥1000进货",
          apply: function (st) {
            st.flags._preMadeFoodSeen = true;
            if (st.resources.cash >= 1000) {
              st.resources.cash -= 1000;
              st.flags._premadeStock = true;
              StateManager.addMessage(
                "📦 你进了200包鱼香肉丝料理包。¥3.5进价卖¥6——薄利多销。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📦 连¥1000批发本钱都没有。你先把自己喂饱再说吧。",
                "info",
              );
            }
          },
        },
        {
          text: "🍜 支持王婶——帮她宣传手工面",
          hint: "名声+2，也许能帮她拉回客流",
          apply: function (st) {
            st.flags._preMadeFoodSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "🍜 你帮王婶在群里打了广告。来了几个新客——但不够。",
              "success",
            );
          },
        },
        {
          text: "🥟 跟王婶学手工拉面手艺",
          hint: "学一门手艺总是好的",
          apply: function (st) {
            st.flags._preMadeFoodSeen = true;
            st.flags._learnedNoodle = true;
            StateManager.addMessage(
              "🥟 王婶教你拉面。面和水的比例、醒面的时间——里面全是学问。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "consumption_downgrade",
      phase: "street",
      icon: "💰",
      title: "平替风暴",
      story:
        "拼多多的市值超过了阿里。街头到处都是「9.9包邮」的广告——隔壁小张在拼多多上进了一样的货，价格只有你的一半。品牌店的老板说：「现在的人只买对的，不买贵的——但对的是指最便宜的。」",
      triggers: { minDay: 25, excludeFlags: ["_consumptionDownSeen"] },
      choices: [
        {
          text: "📦 调整进货策略——走低价路线",
          hint: "薄利多销，¥2000进货",
          apply: function (st) {
            st.flags._consumptionDownSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._lowPriceRoute = true;
              StateManager.addMessage(
                "📦 你进了便宜货。利润薄但走量大——¥10一件一天能卖30件。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📦 连薄利多销的启动资金都不够。",
                "info",
              );
            }
          },
        },
        {
          text: "✨ 坚持卖品质货——走高端路线",
          hint: "利润高但客流少，做口碑",
          apply: function (st) {
            st.flags._consumptionDownSeen = true;
            st.flags._premiumRoute = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "✨ 你决定不降价。贵有贵的道理——你相信识货的人。",
              "event",
            );
          },
        },
        {
          text: "🛵 帮拼多多商家送货",
          hint: "跑腿一天赚¥150",
          apply: function (st) {
            st.flags._consumptionDownSeen = true;
            st.resources.cash += 150;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
            StateManager.addMessage(
              "🛵 你跑了一天配送。9.9包邮的商品，配送费¥2.5——跑得腿抽筋。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "going_global_trend",
      phase: "street",
      icon: "🌍",
      title: "出海浪潮",
      story:
        "SHEIN在北美杀疯了——一件裙子$9.9，美国年轻人疯抢。国内供应商跟着吃肉——张老板的服装厂以前接国内订单¥25/件，现在接SHEIN的订单¥35/件，只要质量达标。他满世界找熟练车工。",
      triggers: { minDay: 50, excludeFlags: ["_goingGlobalSeen"] },
      choices: [
        {
          text: "🧵 去服装厂上班",
          hint: "月薪¥5000，要求缝纫技能≥15",
          apply: function (st) {
            st.flags._goingGlobalSeen = true;
            st.flags._garmentJobApplied = true;
            StateManager.addMessage(
              "🧵 张老板看了你的手：「没干过车工吧？——学三个月就能上手。」",
              "event",
            );
          },
        },
        {
          text: "📦 倒卖SHEIN尾单货",
          hint: "¥1500进货，在夜市卖",
          apply: function (st) {
            st.flags._goingGlobalSeen = true;
            if (st.resources.cash >= 1500) {
              st.resources.cash -= 1500;
              st.flags._sheinFlipping = true;
              StateManager.addMessage(
                "📦 你进了一批SHEIN尾单。质量不错，夜市上一晚上卖了¥400。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📦 尾单货也进不起。你摸了摸那些衣服——料子确实好。",
                "info",
              );
            }
          },
        },
        {
          text: "📖 学英语准备做出海运营",
          hint: "花钱买教材，为将来铺路",
          apply: function (st) {
            st.flags._goingGlobalSeen = true;
            if (st.resources.cash >= 300) {
              st.resources.cash -= 300;
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 10) + 2,
              );
              StateManager.addMessage(
                "📖 买了一套英语教材。你从「How are you」开始复习。",
                "success",
              );
            }
          },
        },
      ],
    },
    {
      id: "traditional_retail_collapse",
      phase: "street",
      icon: "🏪",
      title: "超市关门潮",
      story:
        "沃尔玛这个月关了第三家店。家乐福的货架越来越空——供应商说账期从30天拖到了120天。关店大清仓：货架¥50一个，冷柜¥200一台，整箱的方便面¥10一箱。",
      triggers: { minDay: 35, excludeFlags: ["_retailCollapseSeen"] },
      choices: [
        {
          text: "🛒 去扫货——低价囤日用品",
          hint: "¥500扫货，转手能卖¥1000",
          apply: function (st) {
            st.flags._retailCollapseSeen = true;
            if (st.resources.cash >= 500) {
              st.resources.cash -= 500;
              st.flags._clearanceStock = true;
              StateManager.addMessage(
                "🛒 你扫了一堆日用品——洗衣液¥5一瓶，纸巾¥2一条。赚了。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🛒 连¥500的便宜都占不起。你蹲在清仓区看别人抢购。",
                "info",
              );
            }
          },
        },
        {
          text: "🛋️ 买个便宜的货架自己摆摊用",
          hint: "投资固定资产，¥50一个货架",
          apply: function (st) {
            st.flags._retailCollapseSeen = true;
            st.resources.cash -= 50;
            st.flags._stallShelf = true;
            StateManager.addMessage(
              "🛋️ 你买了一个超市货架。以后摆摊东西终于可以摆放整齐了。",
              "event",
            );
          },
        },
        {
          text: "😔 在门口看了一会儿",
          hint: "感慨",
          apply: function (st) {
            st.flags._retailCollapseSeen = true;
            StateManager.addMessage(
              "🏪 你站在关门的超市门口。时代抛弃你的时候，连招呼都不打。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "ev_price_war",
      phase: "street",
      icon: "🚗",
      title: "新能源价格战",
      story:
        "特斯拉降价¥3万，比亚迪跟进降价¥2万，小鹏汽车直接推出了¥10万的车型。二手车商的朋友圈在哀嚎——「2022年的Model 3，收车价从¥18万跌到¥12万。」充电桩公司倒是笑开了花——车卖得多，桩不够用了。",
      triggers: { minDay: 30, excludeFlags: ["_evPriceWarSeen"] },
      choices: [
        {
          text: "⚡ 问充电桩公司需不需要人",
          hint: "安装充电桩，体力活但前景好",
          apply: function (st) {
            st.flags._evPriceWarSeen = true;
            st.flags._evChargingJob = true;
            StateManager.addMessage(
              "⚡ 充电桩公司缺安装工——日结¥350，就是晒。",
              "event",
            );
          },
        },
        {
          text: "📈 买充电桩公司的股票",
          hint: "电动汽车越多，充电桩越赚",
          apply: function (st) {
            st.flags._evPriceWarSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._evChargingStock = true;
              st.flags._evChargingStockDay = st.player.day;
              StateManager.addMessage(
                "📈 你买了充电桩公司的股票。卖铲子的人比挖金矿的人更稳。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📈 想投资但没钱。你连两轮电动车都只有一辆旧的。",
                "info",
              );
            }
          },
        },
        {
          text: "🚶 跟你没关系——你坐公交",
          hint: "地铁月卡¥200",
          apply: function (st) {
            st.flags._evPriceWarSeen = true;
            StateManager.addMessage(
              "🚶 你连电动自行车都还没骑上。价格战是别人的烟火。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "street_vendor_crackdown",
      phase: "street",
      icon: "🚨",
      title: "城管来了",
      story:
        "区里创文创卫检查，城管突然严打——三轮车被没收了五辆。老赵的车被抬上卡车时他差点哭了：「我贷款买的车啊……」但街角那个有固定摊位的人照样做生意——有关系和没关系，就是不一样。",
      triggers: { minDay: 10, excludeFlags: ["_vendorCrackdownSeen"] },
      choices: [
        {
          text: "🏪 花钱办个固定摊位证",
          hint: "花¥2000办证，以后合法经营",
          apply: function (st) {
            st.flags._vendorCrackdownSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._legalStallPermit = true;
              StateManager.addMessage(
                "🏪 你办了摊位证。贵，但再也不用躲城管了。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🏪 连办证的钱都没有。你推着车躲了一天。",
                "warning",
              );
            }
          },
        },
        {
          text: "🚶 转做流动摊贩——打游击",
          hint: "低成本，但可能被没收装备",
          apply: function (st) {
            st.flags._vendorCrackdownSeen = true;
            st.flags._guerrillaVendor = true;
            StateManager.addMessage(
              "🚶 你学会了看风使舵——听到风声就收摊跑。生存技能+1。",
              "info",
            );
          },
        },
        {
          text: "📢 帮被没收车的人去要车",
          hint: "跑腿费¥100/次，需要关系",
          apply: function (st) {
            st.flags._vendorCrackdownSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            st.resources.cash += 100;
            StateManager.addMessage(
              "📢 你帮老赵要回了三轮车。他千恩万谢。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "minimum_wage_hike",
      phase: "street",
      icon: "🏃",
      title: "最低工资上调",
      story:
        "市人社局发公告了：最低工资从¥2200调到¥2480。餐馆门口贴出了新菜单——「因人工成本上涨，部分菜品价格上调5%~10%」。王婶说：「涨工资是好事——但物价涨得比工资快。」",
      triggers: { minDay: 30, excludeFlags: ["_minWageHikeSeen"] },
      choices: [
        {
          text: "💰 这是好事——你的收入会涨",
          hint: "部分工作收入+10%",
          apply: function (st) {
            st.flags._minWageHikeSeen = true;
            st.flags._minWageRaised = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            StateManager.addMessage(
              "💰 你的日结工资确实涨了——虽然不多，但够每天加个蛋。",
              "success",
            );
          },
        },
        {
          text: "🏠 担心房东要涨房租",
          hint: "物价上涨后房租通常跟着涨",
          apply: function (st) {
            st.flags._minWageHikeSeen = true;
            st.flags._rentWillIncrease = true;
            StateManager.addMessage(
              "🏠 房东果然在群里暗示了。涨¥100——不多，但工资涨的那点全填进去了。",
              "info",
            );
          },
        },
        {
          text: "💭 跟工友讨论要不要找老板谈加薪",
          hint: "人多力量大，但也可能被开除",
          apply: function (st) {
            st.flags._minWageHikeSeen = true;
            st.flags._wageNegotiation = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "💭 大家商量好了——一起去找老板。你被推选为代表。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "social_security_reform",
      phase: "street",
      icon: "🏛️",
      title: "社保改革来了",
      story:
        "社保入税新政实施——以前最低基数交社保，现在必须按实际工资足额缴纳。灵活就业群里炸了锅：「自己交社保，一个月¥1500——我一个月才赚¥5000！」有人说不交了，有人说老了怎么办。",
      triggers: { minDay: 40, excludeFlags: ["_socialSecuritySeen"] },
      choices: [
        {
          text: "💰 咬咬牙按最低档交社保",
          hint: "¥800/月，长远看是保障",
          apply: function (st) {
            st.flags._socialSecuritySeen = true;
            st.flags._paySocialSecurity = true;
            if (st.resources.cash >= 800) {
              st.resources.cash -= 800;
              StateManager.addMessage(
                "💰 你交了¥800社保。心疼——但想到老了至少有个依靠。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "💰 连¥800都掏不出来。你第一次真切感受到什么是「生存大于生活」。",
                "info",
              );
            }
          },
        },
        {
          text: "💼 找个正规公司上班——让公司交",
          hint: "有稳定工作才能有社保",
          apply: function (st) {
            st.flags._socialSecuritySeen = true;
            st.flags._wantFormalJob = true;
            StateManager.addMessage(
              "💼 你开始认真找工作了——不为别的，就为那五险一金。",
              "event",
            );
          },
        },
        {
          text: "🤟 赌自己不会生病——不交了",
          hint: "省钱但高风险",
          apply: function (st) {
            st.flags._socialSecuritySeen = true;
            st.flags._noSocialSecurity = true;
            StateManager.addMessage(
              "🤟 你赌自己年轻不会出事。年轻是你唯一的资本。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "garbage_classification",
      phase: "street",
      icon: "🗑️",
      title: "垃圾分类来了",
      story:
        "小区楼下多了四个颜色的垃圾桶。居委会大妈每天早晚站在垃圾桶边：「你这是什么垃圾？」有个人因为没分类被罚了¥50。但有人发现了商机——「代扔垃圾，¥5一次」。",
      triggers: { minDay: 15, excludeFlags: ["_garbageClassSeen"] },
      choices: [
        {
          text: "👨‍🏫 报名做垃圾分类指导员",
          hint: "收入不高但有名气加成",
          apply: function (st) {
            st.flags._garbageClassSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.resources.cash += 50;
            StateManager.addMessage(
              "👨‍🏫 你穿上了志愿者马甲。站了一天——比打工轻松。",
              "info",
            );
          },
        },
        {
          text: "🚶 帮人代扔垃圾",
          hint: "¥5/次，靠勤劳赚钱",
          apply: function (st) {
            st.flags._garbageClassSeen = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
            st.resources.cash += 60;
            StateManager.addMessage(
              "🚶 你帮几户老年人扔了垃圾。¥5不多，但积少成多。",
              "info",
            );
          },
        },
        {
          text: "📖 认真学习分类规则",
          hint: "不被罚款就是赚",
          apply: function (st) {
            st.flags._garbageClassSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            StateManager.addMessage(
              "📖 你背了分类口诀。「猪能吃的是湿垃圾」——记住了。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "short_video_fever",
      phase: "street",
      icon: "🎥",
      title: "短视频风口",
      story:
        "这条街上出了个网红——卖炒粉的阿珍，一个「炒粉翻锅」视频涨了10万粉。现在她直播炒粉，一晚流水¥3000。你也掏出手机试了试——拍了三条，播放量分别是12、3、0。",
      triggers: { minDay: 25, excludeFlags: ["_shortVideoSeen"] },
      choices: [
        {
          text: "🎥 认真做短视频——记录城市打工生活",
          hint: "投入精力不一定有回报",
          apply: function (st) {
            st.flags._shortVideoSeen = true;
            st.flags._triedShortVideo = true;
            var luck = Random.float(0, 1);
            if (luck < 0.15) {
              st.flags._shortVideoWentViral = true;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 20);
              st.resources.cash += 5000;
              StateManager.addMessage(
                "🎥 你拍的一条「城中村早餐摊」突然爆了！播放量200万！后台私信炸了。",
                "event",
              );
            } else if (luck < 0.5) {
              st.resources.cash += 200;
              st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
              StateManager.addMessage(
                "🎥 你坚持发了一个月。有了500个粉丝——不多，但有人在看。",
                "info",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 5);
              StateManager.addMessage(
                "🎥 你拍了30条视频，平均播放量不到50。这行不是谁都能干的。",
                "info",
              );
            }
          },
        },
        {
          text: "📦 给阿珍供货——她带货需要货源",
          hint: "做供应链赚钱稳",
          apply: function (st) {
            st.flags._shortVideoSeen = true;
            if (st.resources.cash >= 1000) {
              st.resources.cash -= 1000;
              st.flags._influencerSupply = true;
              StateManager.addMessage(
                "📦 你跟阿珍谈了合作——她卖货你供货。靠谱的生意。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📦 想供货但没本钱。阿珍说：「下次吧。」",
                "info",
              );
            }
          },
        },
        {
          text: "📱 刷短视频消磨时间",
          hint: "啥也不干",
          apply: function (st) {
            st.flags._shortVideoSeen = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            StateManager.addMessage(
              "📱 刷了一晚上短视频。时间就这么过去了。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "exam_competition",
      phase: "street",
      icon: "📝",
      title: "考公大军",
      story:
        "大学城旁边的书店里，考研和考公的资料占了整整两面墙。今年国考报名人数突破300万——一个岗位招1个，17000人报名。辅导班的广告说：「不过全退。」但学费¥49800。有人在大学城旁边开了钟点房——考试那周暴涨到¥500一晚。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 35 &&
          !st.flags._examCompetitionSeen &&
          (st.player.intelligence || 0) >= 20
        );
      },
      choices: [
        {
          text: "📚 买套考公资料自己学",
          hint: "花点钱换一个全新的方向",
          apply: function (st) {
            st.flags._examCompetitionSeen = true;
            if (st.resources.cash >= 300) {
              st.resources.cash -= 300;
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 10) + 2,
              );
              st.flags._studyingCivilExam = true;
              StateManager.addMessage(
                "📚 你买了行测和申论。翻开第一页——15年前的知识好像在脑子里还没丢完。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📚 连¥300的书都买不起。你心想——算了吧，搬砖更适合我。",
                "info",
              );
            }
          },
        },
        {
          text: "🏠 在大学城附近租间房做日租",
          hint: "考试期间需求暴涨",
          apply: function (st) {
            st.flags._examCompetitionSeen = true;
            if (st.resources.cash >= 3000) {
              st.resources.cash -= 3000;
              st.flags._examRentalBiz = true;
              StateManager.addMessage(
                "🏠 你租了一间房做日租。考试那几天赚了¥2000。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🏠 想做日租生意但没启动资金。机会是给有准备的人的。",
                "info",
              );
            }
          },
        },
        {
          text: "🏪 去辅导班发传单",
          hint: "日结¥120",
          apply: function (st) {
            st.flags._examCompetitionSeen = true;
            st.resources.cash += 120;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
            StateManager.addMessage(
              "🏪 你发了一天传单。每一个接过传单的人脸上都写着焦虑。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "health_scam",
      phase: "street",
      icon: "🧬",
      title: "免费体检陷阱",
      story:
        "街口新开了一家「健康理疗中心」，门口写着「免费测血压、测血糖、送鸡蛋一斤」。一群老年人排着队进去了。两个小时后每个人出来都提着一袋¥2980的「纳米磁疗被」。你知道是骗局——但那些老人笑得挺开心。",
      triggers: { minDay: 20, excludeFlags: ["_healthScamSeen"] },
      choices: [
        {
          text: "📢 去揭穿骗局——告诉那些老人",
          hint: "名声+5，但可能被威胁",
          apply: function (st) {
            st.flags._healthScamSeen = true;
            st.flags._scamWhistleblower = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            var danger = Random.float(0, 1);
            if (danger < 0.3) {
              st.status.health = Math.max(0, st.status.health - 5);
              StateManager.addMessage(
                "📢 你被理疗中心的人威胁了。「多管闲事的下场你知道吧？」你说知道了。",
                "warning",
              );
            } else {
              StateManager.addMessage(
                "📢 你成功劝住了三个老人。他们的子女打电话来感谢你。",
                "event",
              );
            }
          },
        },
        {
          text: "💰 去应聘做推销员——拿提成",
          hint: "灰色收入，卖一单提成¥500",
          apply: function (st) {
            st.flags._healthScamSeen = true;
            st.flags._scamSalesman = true;
            st.resources.cash += 500;
            st.player.fame = Math.max(0, (st.player.fame || 0) - 3);
            StateManager.addMessage(
              "💰 你卖出了一床被子。¥500提成拿到手——但那老太太说「小伙子你是个好人」的时候你不敢看她的眼睛。",
              "event",
            );
          },
        },
        {
          text: "🚶 领了鸡蛋就走",
          hint: "免费鸡蛋不拿白不拿",
          apply: function (st) {
            st.flags._healthScamSeen = true;
            st.needs.hunger = Math.min(100, st.needs.hunger + 3);
            StateManager.addMessage(
              "🚶 你领了一斤鸡蛋，听完推销就走了。销售在背后骂骂咧咧。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "last_baton",
      phase: "street",
      icon: "🎵",
      title: "最后一棒",
      story:
        "这条街上掀起了一股网红脆皮五花肉的热潮——第一家店门口排了30米长队。第二家在对面开张。现在这条街上有8家同款。第一家店的老板已经开始贴转让广告了。",
      triggers: { minDay: 30, excludeFlags: ["_lastBatonSeen"] },
      choices: [
        {
          text: "🥠 趁现在还赚钱开一家",
          hint: "¥5000投入，可能血本无归",
          apply: function (st) {
            st.flags._lastBatonSeen = true;
            if (st.resources.cash >= 5000) {
              st.resources.cash -= 5000;
              var luck = Random.float(0, 1);
              if (luck < 0.25) {
                st.resources.cash += 12000;
                StateManager.addMessage(
                  "生意火爆赚了¥12000！但满街模仿者让你不安。",
                  "event",
                );
              } else if (luck < 0.6) {
                st.resources.cash += 2000;
                StateManager.addMessage(
                  "不赚不亏。风口来得快去得也快。",
                  "info",
                );
              } else {
                StateManager.addMessage(
                  "开业太晚，整条街在打折甩卖。打水漂了。",
                  "warning",
                );
              }
            } else {
              StateManager.addMessage("连启动资金都不够。", "info");
            }
          },
        },
        {
          text: "💲 给第一家店供货",
          hint: "赚快钱，¥2000进货",
          apply: function (st) {
            st.flags._lastBatonSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.resources.cash += 3500;
              StateManager.addMessage("供了三天货，赚了¥1500。", "success");
            } else {
              StateManager.addMessage("想供货连本钱都没有。", "info");
            }
          },
        },
        {
          text: "🔍 什么都不做",
          hint: "等待泡沫破裂",
          apply: function (st) {
            st.flags._lastBatonSeen = true;
            st.flags._lastBatonWise = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 3,
            );
            StateManager.addMessage(
              "你看着这条街从风口变成闹剧。三个月后8家关了6家。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "sunk_cost_trap",
      phase: "street",
      icon: "🎰",
      title: "沉没成本",
      story:
        "你之前投了一笔生意——¥50万砸进去了，项目半死不活。合伙人电话来了：「再投¥10万就能撑到下一轮——已经走到这一步了。」你握着手机，手心全是汗。",
      triggers: { minDay: 60, excludeFlags: ["_sunkCostSeen"], minCash: 50000 },
      choices: [
        {
          text: "💰 追加投资",
          hint: "投¥10万，50%可能翻盘",
          apply: function (st) {
            st.flags._sunkCostSeen = true;
            if (st.resources.cash >= 100000) {
              st.resources.cash -= 100000;
              var luck = Random.float(0, 1);
              if (luck < 0.45) {
                st.resources.cash += 300000;
                StateManager.addMessage(
                  "赌对了！项目被收购，拿回¥30万。",
                  "event",
                );
              } else {
                StateManager.addMessage(
                  "又赔了。合伙人联系不上了。总共亏了¥15万。",
                  "danger",
                );
              }
            } else {
              StateManager.addMessage("想追加但钱不够。也许是好事。", "info");
            }
          },
        },
        {
          text: "✋ 止损",
          hint: "认了",
          apply: function (st) {
            st.flags._sunkCostSeen = true;
            st.flags._sunkCostStopped = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            StateManager.addMessage(
              "你说不。合伙人在电话里骂了你。但挂了电话反而轻松了。",
              "success",
            );
          },
        },
        {
          text: "🤝 找其他投资人接盘",
          hint: "名声≥30才能脱身",
          apply: function (st) {
            st.flags._sunkCostSeen = true;
            if ((st.player.fame || 0) >= 30) {
              st.flags._sunkCostBailed = true;
              st.resources.cash -= 5000;
              StateManager.addMessage(
                "通过关系找到接盘侠。亏了¥5万中介费——比全亏好。",
                "event",
              );
            } else {
              StateManager.addMessage("没人愿意接——你名声不够。", "warning");
            }
          },
        },
      ],
    },
    {
      id: "gray_to_legit",
      phase: "street",
      icon: "📄",
      title: "灰色地带合法化",
      story:
        "以前你靠灰色手段赚了第一桶金——倒卖发票、刷单。现在行业正规化了——政府发了牌照。当年的灰色技能突然变成了合规经验。以前的污点成了先发优势。",
      triggers: { minDay: 90, excludeFlags: ["_grayToLegitSeen"] },
      choices: [
        {
          text: "💼 申请正规牌照",
          hint: "¥20000办牌照，合法经营",
          apply: function (st) {
            st.flags._grayToLegitSeen = true;
            if (st.resources.cash >= 20000) {
              st.resources.cash -= 20000;
              st.flags._grayLegitBiz = true;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
              StateManager.addMessage(
                "拿到牌照。以前偷偷摸摸的事现在光明正大了。",
                "event",
              );
            } else {
              StateManager.addMessage("连办牌照的钱都不够。", "info");
            }
          },
        },
        {
          text: "🏠 低调退出",
          hint: "功成身退",
          apply: function (st) {
            st.flags._grayToLegitSeen = true;
            st.flags._grayRetired = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            StateManager.addMessage(
              "清空了灰色历史。以前的路不正——但你出来了。",
              "event",
            );
          },
        },
        {
          text: "👤 帮同行转正",
          hint: "名声+5",
          apply: function (st) {
            st.flags._grayToLegitSeen = true;
            st.flags._grayHelpedOthers = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
            StateManager.addMessage(
              "帮三个朋友办了正规手续。第一次干干净净吃饭。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "class_rollback",
      phase: "street",
      icon: "💨",
      title: "从天而降",
      story:
        "你中彩票了——或者拆迁款到账了——反正一夜之间有了¥200万。你搬进高档公寓，请工友吃了¥5000的饭。三个月后，钱花了一半。没有新的收入来源。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 50 &&
          !st.flags._classRollbackSeen &&
          (st.flags._demolitionGambled || st.resources.cash >= 50000)
        );
      },
      choices: [
        {
          text: "🏦 买房变资产",
          hint: "¥150万买房，月供¥5000",
          apply: function (st) {
            st.flags._classRollbackSeen = true;
            st.flags._rollbackBoughtHouse = true;
            st.resources.cash -= 1500000;
            if (st.housing) st.housing.tier = Math.max(st.housing.tier || 0, 5);
            StateManager.addMessage(
              "买了市中心两居室。月供¥5000——不叫财富自由，叫换种活法。",
              "event",
            );
          },
        },
        {
          text: "💰 存银行吃利息",
          hint: "¥200万大额存单3.5%",
          apply: function (st) {
            st.flags._classRollbackSeen = true;
            st.flags._rollbackSaved = true;
            st.resources.cash -= 2000000;
            st.flags._rollbackDay = st.player.day;
            StateManager.addMessage(
              "存了¥200万。月利息¥5800——比打工强，但越来越不值钱。",
              "event",
            );
          },
        },
        {
          text: "🎓 投资自己开公司",
          hint: "花¥50万学技能+注册",
          apply: function (st) {
            st.flags._classRollbackSeen = true;
            st.flags._rollbackStartedBiz = true;
            st.resources.cash -= 500000;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 10,
            );
            StateManager.addMessage(
              "报了MBA，注册了公司。有人笑你是暴发户——你没理。",
              "event",
            );
          },
        },
        {
          text: "🍺 继续高消费",
          hint: "爽一时，钱会花完",
          apply: function (st) {
            st.flags._classRollbackSeen = true;
            st.flags._rollbackBurned = true;
            st.resources.cash -= 50000;
            st.needs.happiness = Math.min(100, st.needs.happiness + 25);
            StateManager.addMessage(
              "租奔驰请全城喝了三天。卡里少了¥50000——最快乐72小时。",
              "event",
            );
          },
        },
      ],
    },
    // ============================================================
    // 批次D — 新增叙事事件（5个）
    // ============================================================
    {
      id: "roommate_conflict",
      phase: "street",
      icon: "🏠",
      title: "合租室友的矛盾",
      story:
        "你回到住处发现室友把你的洗衣液用完了，厕所纸也用光了没补。这不是第一次了。你开门时他正在你的椅子上坐着刷手机。",
      triggers: { minDay: 5, excludeFlags: ["_roommateConflictSeen"] },
      choices: [
        {
          text: "😤 当面跟他说清楚",
          hint: "立规矩",
          apply: function (st) {
            st.flags._roommateConflictSeen = true;
            st.needs.happiness = Math.max(0, st.needs.happiness - 7);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            StateManager.addMessage(
              "😤 你跟他吵了一架。他承诺以后会注意，但气氛很尴尬。",
              "warning",
            );
          },
        },
        {
          text: "🤝 心平气和地商量分摊规则",
          hint: "情商路线",
          apply: function (st) {
            st.flags._roommateConflictSeen = true;
            st.flags._roommateNegotiated = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            StateManager.addMessage(
              "🤝 你们商量好了公共用品轮流买。关系反而更好了。",
              "success",
            );
          },
        },
        {
          text: "😶 忍了，自己又买了新的",
          hint: "多一事不如少一事",
          apply: function (st) {
            st.flags._roommateConflictSeen = true;
            st.resources.cash -= 15;
            st.needs.happiness = Math.max(0, st.needs.happiness - 3);
            StateManager.addMessage(
              "😶 你默默去楼下超市买了新的。花¥15买个清净。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "skill_mentor",
      phase: "street",
      icon: "👨‍🏫",
      title: "偶遇热心老师傅",
      story:
        "你在街角修自行车的摊位前看了一会儿，修车师傅看出你对机械有兴趣，说小伙子想不想学点手艺？不收学费，有空来搭把手就行。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 10 &&
          !st.flags._skillMentorSeen &&
          (st.player.mental || 50) >= 20
        );
      },
      choices: [
        {
          text: "🙏 答应跟师傅学手艺",
          hint: "花时间但不花钱",
          apply: function (st) {
            st.flags._skillMentorSeen = true;
            st.flags._mentorLearning = true;
            if (st.skills && st.skills.repair) {
              st.skills.repair.xp = Math.min(
                1000,
                (st.skills.repair.xp || 0) + 80,
              );
            }
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
            st.needs.happiness = Math.min(100, st.needs.happiness + 6);
            StateManager.addMessage(
              "🔧 师傅教你认工具、调刹车。你感觉自己多了一门手艺。维修技能经验+80。",
              "success",
            );
          },
        },
        {
          text: "😅 谢谢好意，但没时间",
          hint: "礼貌拒绝",
          apply: function (st) {
            st.flags._skillMentorSeen = true;
            StateManager.addMessage("😅 师傅说没事，想学随时来找他。", "info");
          },
        },
        {
          text: "💡 介绍朋友来跟师傅学",
          hint: "人品+1",
          apply: function (st) {
            st.flags._skillMentorSeen = true;
            st.flags._referredFriend = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            StateManager.addMessage(
              "💡 你介绍了想学技术的朋友过来。师傅夸你心眼好。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "rain_shelter_chat",
      phase: "street",
      icon: "☔",
      title: "躲雨时的闲聊",
      story:
        "突如其来的暴雨把你困在便利店门口的屋檐下。旁边有个同样躲雨的中年人，他看着雨叹口气说「这雨下得人心烦。」",
      triggers: {
        excludeFlags: ["_rainChatSeen"],
        weather: ["rainy", "stormy"],
      },
      choices: [
        {
          text: "🗣️ 跟他聊两句，说不定有收获",
          hint: "社交破冰",
          apply: function (st) {
            st.flags._rainChatSeen = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 4);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (Random.chance(0.3)) {
              st.resources.cash += 20;
              StateManager.addMessage(
                "☔ 聊开了！他原来是个小包工头，给了你一张名片说明天来找他干活。¥20预付款。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "☔ 聊了半小时，雨小了他先走了。虽然没什么实质收获，但心情好了些。",
                "info",
              );
            }
          },
        },
        {
          text: "🎵 戴上耳机听歌，等雨停",
          hint: "独处时间",
          apply: function (st) {
            st.flags._rainChatSeen = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            StateManager.addMessage("🎵 雨声配音乐，倒也挺惬意。", "info");
          },
        },
        {
          text: "🏃 不等了，冒雨跑回去",
          hint: "赶时间但会淋湿",
          apply: function (st) {
            st.flags._rainChatSeen = true;
            st.status.health = Math.max(0, st.status.health - 3);
            st.needs.happiness = Math.max(0, st.needs.happiness - 2);
            StateManager.addMessage(
              "🏃 你跑到家了，淋成了落汤鸡。健康-3。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "community_volunteer",
      phase: "street",
      icon: "🧹",
      title: "社区招募志愿者",
      story:
        "居委会大妈在楼下贴了告示：周末社区大扫除+独居老人慰问活动，招募8名志愿者。包一顿午饭，还发一张「优秀志愿者」证书。",
      triggers: { minDay: 6, excludeFlags: ["_communityVolunteerSeen"] },
      choices: [
        {
          text: "📋 报名参加志愿者",
          hint: "名声+，花一天时间",
          apply: function (st) {
            st.flags._communityVolunteerSeen = true;
            st.flags._volunteerDone = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            st.needs.hunger = Math.min(100, st.needs.hunger + 20);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            StateManager.addMessage(
              "🧹 你干了一天活，帮三位独居老人打扫了卫生。居委会大妈非要给你写表扬信。名声+5。",
              "success",
            );
          },
        },
        {
          text: "📸 帮忙拍照片发社区公众号",
          hint: "轻量参与",
          apply: function (st) {
            st.flags._communityVolunteerSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            st.needs.happiness = Math.min(100, st.needs.happiness + 2);
            StateManager.addMessage(
              "📸 你拍了几张照片，社区公众号发推文时署了你的名。",
              "hint",
            );
          },
        },
        {
          text: "😅 下次再说吧",
          hint: "没空",
          apply: function (st) {
            st.flags._communityVolunteerSeen = true;
            StateManager.addMessage("😅 你看了看告示，转身走了。", "info");
          },
        },
      ],
    },
    {
      id: "market_clearance_bargain",
      phase: "street",
      icon: "🏪",
      title: "菜市场收摊大甩卖",
      story:
        "傍晚菜市场快收摊了，卖菜的大姐冲你喊：「小伙子，剩的这些全给你，¥10拿走！」一堆蔬菜加起来得有四五斤，平时要¥25以上。",
      triggers: {
        minDay: 3,
        excludeFlags: ["_clearanceBargainSeen"],
        minCash: 10,
      },
      choices: [
        {
          text: "💰 ¥10全买了！",
          hint: "够吃好几天",
          apply: function (st) {
            st.flags._clearanceBargainSeen = true;
            st.resources.cash -= 10;
            st.needs.hunger = Math.min(100, st.needs.hunger + 15);
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage(
              "💰 你拎了一大袋菜回去，够吃四五天了！省了至少¥15。",
              "success",
            );
          },
        },
        {
          text: "🤝 跟大姐砍到¥8",
          hint: "省钱但大姐脸色不好",
          apply: function (st) {
            st.flags._clearanceBargainSeen = true;
            st.resources.cash -= 8;
            st.needs.hunger = Math.min(100, st.needs.hunger + 15);
            st.needs.happiness = Math.max(0, st.needs.happiness - 1);
            StateManager.addMessage(
              "🤝 大姐撇了撇嘴还是卖你了。省了¥2，但感觉不太对。",
              "info",
            );
          },
        },
        {
          text: "🚶 家里还有菜，不买了",
          hint: "按需消费",
          apply: function (st) {
            st.flags._clearanceBargainSeen = true;
            StateManager.addMessage(
              "🚶 你摆了摆手。确实不需要的东西再便宜也是浪费。",
              "hint",
            );
          },
        },
      ],
    },

    // ====== v3.20 新增事件（已补全 conditions + apply，修复死代码）======

    // v3.20-5: 30岁人生转折（年龄里程碑）
    {
      id: "age_30_reflection",
      phase: "street",
      icon: "🕰",
      title: "三十而立？",
      story:
        '你今天过了30岁生日。站在镜子前，看着自己——发际线后移了，眼角有了细纹。你在这座城市已经待了这么多年，但说不上来自己到底有没有"站稳脚跟"。\\n\\n手机响了，是老家打来的。你犹豫了一下，接了。',
      // [自洽修复] v3.20 原始提交缺 conditions/apply → 补全
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.age >= 30 &&
          st.player.day >= 365 &&
          !st.flags._age30Reflection
        );
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📱 跟家人聊聊近况",
          hint: "精神充电",
          apply: function (st) {
            st.flags._age30Reflection = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
            StateManager.addMessage(
              "📱 妈妈在电话里说「别太拼了，身体要紧」。你鼻子一酸。心情+15。不管走多远，总有人在家等你。",
              "success",
            );
          },
        },
        {
          text: "📊 认真审视自己的财务状况",
          hint: "理性规划",
          apply: function (st) {
            st.flags._age30Reflection = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            var total =
              (st.resources.cash || 0) + (st.resources.bankBalance || 0);
            StateManager.addMessage(
              "📊 你算了一下全部身家：¥" +
                total.toLocaleString() +
                "。三十岁，存款是这个数字。你把它写在本子上，心智+5。数字不会骗人，但也不会告诉你值不值得。",
              "info",
            );
          },
        },
        {
          text: "🍺 叫上几个老朋友聚一聚",
          hint: "社交放松",
          apply: function (st) {
            st.flags._age30Reflection = true;
            if (st.resources.cash < 50) {
              StateManager.addMessage(
                "🍺 你想请客，但摸了摸口袋——连顿像样的饭都请不起。只好说改天。",
                "warning",
              );
              return;
            }
            st.resources.cash -= 50;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "🍺 老朋友们喝了一晚上，聊起当年的傻事笑得前仰后合。花¥50买了个痛快。心情+12，名气+2。",
              "success",
            );
          },
        },
      ],
    },

    // v3.20-6: 合租矛盾升级（消费陷阱警示）
    {
      id: "rent_mercedes_escalation",
      phase: "street",
      icon: "🚨",
      title: "室友的奔驰梦",
      story:
        '你最近发现室友小杨最近变了。他频繁借钱，朋友圈全是豪车和美女，但你从未见过他开什么好车。今天他找你开口："借我五千吧，下个月发工资就还。"',
      // [自洽修复] v3.20 原始提交缺 conditions/apply → 补全
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.housing &&
          st.housing.tier >= 1 &&
          st.player.day >= 45 &&
          !st.flags._mercedesRoommate
        );
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "💰 借给他",
          hint: "花钱买清净",
          apply: function (st) {
            st.flags._mercedesRoommate = true;
            var loan = Math.min(5000, st.resources.cash);
            st.resources.cash -= loan;
            // 大概率不还
            if (Random.chance(0.7)) {
              StateManager.addMessage(
                "💰 你借了¥" +
                  loan +
                  "。下个月小杨消失了，朋友圈还在发豪车。你当交了学费。",
                "warning",
              );
            } else {
              st.resources.cash += loan;
              StateManager.addMessage(
                "💰 你借了¥" +
                  loan +
                  "。没想到下个月真还了，还多给了¥200利息。算你运气好。",
                "success",
              );
              st.resources.cash += 200;
            }
          },
        },
        {
          text: "🛡️ 委婉拒绝",
          hint: "保持边界",
          apply: function (st) {
            st.flags._mercedesRoommate = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
            StateManager.addMessage(
              "🛡️ 你说手头也紧。小杨脸色有点不好看，但也没再说什么。心智+2。有些边界一旦退了就收不回来。",
              "info",
            );
          },
        },
        {
          text: "💡 劝他别被欲望绑架",
          hint: "尝试点醒他",
          apply: function (st) {
            st.flags._mercedesRoommate = true;
            if ((st.player.mental || 0) >= 45) {
              StateManager.addMessage(
                "💡 你跟他聊了聊消费贷的陷阱和复利的力量。他沉默了很久，最后说「也许你说得对」。不管听没听进，至少种了颗种子。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "💡 你试着劝他，但他笑你「不懂生活」。话不投机半句多。也许你的心智还不够说服别人。",
                "info",
              );
            }
          },
        },
      ],
    },
  ];
  for (var i = 0; i < EVENTS.length; i++) {
    // 防御性兜底：无 conditions 的事件默认放行（避免死代码），与 CAREER_EVENTS 一致
    if (!EVENTS[i].conditions && !EVENTS[i].triggers) {
      EVENTS[i].conditions = function () {
        return true;
      };
    }
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

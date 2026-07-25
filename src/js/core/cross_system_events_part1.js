/**
 * 跨系统联动事件 — 拆分片段 1/8（原 cross_system_events.js 机械拆分，行为不变）
 * 仅含自包含的 RANDOM_EVENTS.push 语句；顺序无关（事件选择走 phase 过滤+概率）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._crossPart1Loaded) return;
  RANDOM_EVENTS._crossPart1Loaded = true;

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
          st.resources.cash = (st.resources.cash || 0) + bonus;
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
    // [B类修复] probability: 0.6→0.15 — 稀有回报事件不应高频触发
    conditions: function (st) {
      return (
        st.flags &&
        st.flags.moralWalletReturner &&
        !st.flags._walletReturnRewarded &&
        st.player.day >= (st.flags._walletReturnDay || 0) + 3
      );
    },
    probability: 0.15, // [B类修复] moral_wallet_return_reward
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
          st.resources.cash = (st.resources.cash || 0) + income;
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
          st.resources.cash = (st.resources.cash || 0) + 300;
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
            st.resources.cash = (st.resources.cash || 0) + deal;
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
          st.resources.cash = (st.resources.cash || 0) + income;
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
            st.resources.cash = (st.resources.cash || 0) + income;
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
    probability: 0.12, // [B类修复] era_startup_mentor_chance: 0.5→0.12
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
          st.resources.cash = (st.resources.cash || 0) + income;
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
          st.resources.cash = (st.resources.cash || 0) + income;
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
          st.resources.cash = (st.resources.cash || 0) + profit;
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
            st.resources.cash = (st.resources.cash || 0) + bonus;
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
            st.player.corporate.upwardMgmt = Math.min(
              100,
              (st.player.corporate.upwardMgmt || 50) + 10,
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
          st.resources.cash = (st.resources.cash || 0) + 100;
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
          st.resources.cash = (st.resources.cash || 0) + 100; // 信里夹的钱
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
          st.resources.cash = (st.resources.cash || 0) + income;
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
          st.resources.cash = (st.resources.cash || 0) + fee;
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
          if ((st.resources.cash || 0) >= 200) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
            var profit = Random.int(300, 500);
            st.resources.cash = (st.resources.cash || 0) + profit;
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
            if ((st.resources.cash || 0) >= 100) {
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100);
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
            if ((st.resources.cash || 0) >= 30) {
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);
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
    story:
      "常去的那家小卖部门口，老板今天神神秘秘地招呼你过去。「我跟你说个事——你是我老主顾我才告诉你。隔壁那条街要修路了，一修三个月，那边几家的租金要跌。」\n\n他压低声音又补了一句：「这事我就跟你说了，你心里有个数。」",
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
    story:
      "这座城市有你不知道的眼睛。\n\n楼下保安今天多看了你一眼，没说话，但点了点头。卖早餐的大妈照常递给你豆浆，但这次多加了个茶叶蛋，「吃吧，不要钱。」\n\n你做的事，有人记得。",
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
            st.resources.cash = (st.resources.cash || 0) + help;
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
          if ((st.resources.cash || 0) >= 1000) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
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
        totalDebt += st.resources.fineDebt || 0;
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
              st.resources.cash = (st.resources.cash || 0) + borrowAmount;
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
      story:
        "你在一个街区跑了快一个月了。今天送完一单，收件人追出来塞给你一杯奶茶：'你每次都准时，以后我的东西都交给你送吧。'他递来一张名片——是一家小型电商公司。",
      choices: [
        {
          text: "📱 加联系方式，接私单",
          hint: "额外收入来源",
          apply: function (st) {
            st.flags._gigRegularCustomerSeen = true;
            st.flags._gigPrivateOrders = true;
            var bonus = Random.int(200, 500);
            st.resources.cash = (st.resources.cash || 0) + bonus;
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
        // [Layer3] 叙事说"在批发市场挑货"，需玩家在批发市场
        if (!st.trade || st.trade.currentLocation !== "wholesaleMarket") return false;
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
      story:
        "你在批发市场帮朋友挑货时，一眼看出这批'原装'配件全是高仿——做工粗糙，螺丝孔位都对不上。摊主看你一眼，换了副面孔：'行家啊，要真的吗？'",
      choices: [
        {
          text: "✅ 拿真的，贵点也值",
          hint: "多花¥200，品质有保障",
          apply: function (st) {
            st.flags._repairExpertSeen = true;
            if ((st.resources.cash || 0) >= 200) {
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
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
      story:
        "小美在图书馆角落里拉你，压低声音说：'我导师在规划局有熟人——科技园东边那片旧厂房要被收储了，规划是扩建三期。消息还没公开，你懂的。'她把一张名片推过来。",
      choices: [
        {
          text: "📐 联系二手房东，谈优先承租权",
          hint: "¥2000定金，赌扩建",
          cost: 2000,
          apply: function (st) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000); // [全系统自洽修复] 域B 修复:cost扣款缺失
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
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000); // [全系统自洽修复] 域B 修复:cost扣款缺失
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
      story:
        "暴雨倾盆而下，批发市场瞬间变成了小河。你的摊位刚摆出去的货眼看就要被淹，但生意正做到一半——撤了亏钱，不撤也亏钱。",
      choices: [
        {
          text: "🏃 拼命抢收货物",
          hint: "损失一半但保住部分",
          apply: function (st) {
            st.flags._stormMarketSeen = true;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
            st.needs.hygiene = Math.max(0, (st.needs.hygiene || 0) - 10);
            var saved = Random.int(100, 300);
            st.resources.cash = (st.resources.cash || 0) + saved;
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
      story:
        "地铁上，你看到一个小偷正在扒一个学生的包。学生戴着耳机没察觉。周围人都在看手机，仿佛什么都没发生。",
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
      _isChainEvent: true,
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
      story:
        "新闻推送弹出来：市政府正式公告科技园东区旧厂房改造项目立项，总投资80亿。你记得小美说的那番话——现在，到了看选择的时候了。",
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
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - saveAmt);
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
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - debt);
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
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - cost);
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
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - cost);
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
        // [Layer3] 叙事直接称呼"老周"，需已结识老周
        if (!st.relationships || !st.relationships.old_zhou || !st.relationships.old_zhou.met) return false;
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
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - cost);
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
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - 120);
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
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - 200);
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
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - 100);
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

  // 链式后续：HR联系面试（delivery_regular 2天后触发）
  RANDOM_EVENTS.push({
    id: "hr_call_delivery",
    phase: "street",
    _isChainEvent: true,
    icon: "📞",
    title: "HR来电",
    story:
      "两天后，你的电话响了——是那家本地生活平台的HR。「你好，我是昨天联系你的张经理的同事。我们看了你发过来的个人情况，想约你当面聊聊，看看有没有适合你的岗位。」\n\n你没想到他们真的会打电话来。从骑手到坐办公室——你知道这是个机会。",
    conditions: function (st) {
      return (
        !!st.flags._deliveryRegularReferred &&
        !st.flags._hrCallDeliverySeen &&
        st.player.day <= (st.flags._deliveryRegularReferred || 999) + 5
      );
    },
    choices: [
      {
        text: "✅ 答应去面试",
        hint: "可能开启物流管理路径",
        apply: function (st) {
          st.flags._hrCallDeliverySeen = true;
          st.flags._deliveryHrInterview = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
          StateManager.addMessage(
            "📞 你答应了面试时间。挂掉电话后你深吸一口气——人生第一次正经面试。心情+10。",
            "success",
          );
        },
      },
      {
        text: "🤔 先问问待遇再决定",
        hint: "谨慎行事",
        apply: function (st) {
          st.flags._hrCallDeliverySeen = true;
          st.flags._deliveryHrPending = true;
          StateManager.addMessage(
            "📞 你在电话里问了些基本情况。HR说详情面谈，但你心里有点底了。",
            "info",
          );
        },
      },
      {
        text: "❌ 婉拒",
        hint: "还是喜欢自由",
        apply: function (st) {
          st.flags._hrCallDeliverySeen = true;
          StateManager.addMessage(
            "📞 你谢绝了邀约。不是不领情，只是还没准备好走出舒适区。",
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
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 80); // [全系统自洽修复] 域B 修复:cost扣款缺失
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
    story:
      "几个工友一起吃饭，有人聊起最近的拆迁消息。老张喝多了两杯，压低声音：「其实我知道内幕消息——那一片的补偿方案已经定了，有人提前拿到了通知。」\n\n他意识到说漏了嘴，赶紧转移话题，但你心里已经记下了。",
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
    // [全系统自洽修复] 域B A类#8: choices:[] → choices函数（dynamicApply从未被引擎调用）
    choices: function (st) {
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
      if (!bestNid) return [];

      var npcDef = null;
      if (typeof NPCS !== "undefined") {
        for (var ni = 0; ni < NPCS.length; ni++) {
          if (NPCS[ni].id === bestNid) {
            npcDef = NPCS[ni];
            break;
          }
        }
      }
      if (!npcDef) return [];

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

      return [
        {
          text: "📝 记下来，以后留意",
          hint: "获得" + infoType,
          apply: function (s) {
            s.flags["_npcInfoLeaked_" + bestNid] = true;
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
      ];
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
          if ((st.resources.cash || 0) >= 500) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
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
          if ((st.resources.cash || 0) >= 80) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 80);
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
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
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
          if ((st.resources.cash || 0) >= 15) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 15);
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

  // ----- 事件50：学历 0→1 毕业典礼仪式 -----
  // 联动：education 从 0 升级到 1 后首次触发（一次性）
  // 设计心理学：峰终定律·人生里程碑·仪式感奖励
  // 触发方式：在 edu_cert 动作完成后由 daily_pipeline 手动检查触发
  // [自洽修复] story 字段缺失修复 + phase 取值修正（原为 desc 函数 + 非法数组 phase）
  RANDOM_EVENTS.push({
    id: "edu_graduation_ceremony",
    icon: "🎓",
    title: "毕业典礼",
    phase: "street",
    conditions: function (state) {
      return state.player.education >= 1 && !state.flags._eduGraduationShown;
    },
    story:
      "数年寒窗终于结束了。今天你站在教室里，接过那张薄薄的学历证书。一起拿证的人里有三十多岁的老哥，有带着孩子的家长——大家都熬过来了。\n\n你想起刚进城时连公交车都坐不起的日子。这张纸不能立刻改变什么，但它是你给自己的一份交代。\n\n老师说：「拿了证，记住——路是自己走的。」",
    choices: [
      {
        text: "📸 合影留念（+2 心情，+1 智力）",
        apply: function (state) {
          // [全系统自洽修复] 域B A类#5: state.player.intellect→intelligence, player.mood→needs.happiness
          state.needs.happiness = Math.min(
            100,
            (state.needs.happiness || 50) + 2,
          );
          state.player.intelligence = Math.min(
            100,
            (state.player.intelligence || 30) + 1,
          );
          state.flags._eduGraduationShown = true;
          state.flags._eduGraduationPhoto = true;
          return "和同学们合影留念，把这一刻定格。老周说：「好好混，以后同学会别缺席。」";
        },
      },
      {
        text: "👔 立刻投简历（解锁白领求职）",
        apply: function (state) {
          state.flags._eduGraduationShown = true;
          state.flags._eduGraduationJobHunt = true;
          // [全系统自洽修复] 域B A类#5: state.player.mood→needs.happiness
          state.needs.happiness = Math.min(
            100,
            (state.needs.happiness || 50) + 1,
          );
          return "你当场打开手机，把简历投给了三家本地公司。学历是敲门砖，但门后的路还得自己跑。";
        },
      },
      {
        text: "🍲 回家吃顿好的（+5 饥饿恢复）",
        apply: function (state) {
          state.flags._eduGraduationShown = true;
          state.flags._eduGraduationHome = true;
          // [全系统自洽修复] 域B A类#5: state.player.hunger→needs.hunger
          state.needs.hunger = Math.min(100, (state.needs.hunger || 50) + 5);
          return "你买了瓶二锅头，回家炖了个白菜豆腐。妈在电话那头说：「回来吃饭就行，别省钱。」";
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
            st.resources.cash = (st.resources.cash || 0) + profit - 1000;
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
        // [Layer3] 叙事说"在菜市场闲逛"，需玩家在市场区域
        if (!st.trade || (st.trade.currentLocation !== "wholesaleMarket" && st.trade.currentLocation !== "commercialDist")) return false;
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
          if ((st.resources.cash || 0) >= cost) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
            // 行情波动：60%赚，40%亏
            if (Random.chance(0.6)) {
              var profit = Random.int(30, 80);
              st.resources.cash = (st.resources.cash || 0) + profit + cost;
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
          st.resources.cash = (st.resources.cash || 0) + pay + bonus;
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
    probability: 0.08, // [B类修复] housing_upgrade_milestone: 0.5→0.08，条件已精确不需高概率
    repeatable: false,
    choices: [
      {
        text: "🏪 去楼下买点日用品布置房间",
        hint: "心情+12，归属感提升",
        apply: function (st) {
          st.flags._housingUpgradeMilestoneSeen = true;
          if ((st.resources.cash || 0) >= 50) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
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
          if ((st.resources.cash || 0) >= 5000) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5000);
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
          if ((st.resources.cash || 0) >= 200) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
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
          st.resources.cash = (st.resources.cash || 0) + earn;
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
})();

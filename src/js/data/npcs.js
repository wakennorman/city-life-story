/**
 * NPC 定义 — 街头生活中遇到的各色人物
 */

/**
 * NPC好感阈值奖励设计（参考Stardew Valley Heart Events）：
 * 30好感=熟人：解锁特殊对话+小福利
 * 60好感=好友：解锁独家资源/折扣
 * 80好感=挚友：解锁稀有机会/重要帮助
 */
const NPCS = [
  {
    id: "aunt_wang",
    name: "王大婶",
    role: "房东",
    avatar: "images/avatars/aunt_wang.png",
    location: "slum",
    // v3.4 C3D-T1: NPC 每日活动日程（地点关联系统用）
    schedule: {
      morning: "commercialDist",
      afternoon: "park",
      evening: "slum",
      night: "slum",
    },
    birthday: 45,
    desc: "城中村的房东，说话嗓门大但心地不坏。偶尔会介绍些零活。",
    birthdayLine: "哎呀今天是我生日，没想到你还记得！来来来，坐下吃块蛋糕！",
    festivalLines: {
      spring_festival:
        "过年好！你有没有给家里打电话？大城市过年冷清，还是老家暖和啊。",
      mid_autumn: "中秋节我做了几个月饼，你来尝尝！今晚月亮大得很，想家了吧？",
      dragon_boat: "端午节我包了粽子，咸蛋黄馅的，要不要尝一个？",
      labor_day: "劳动节快乐！咱们劳动人民天天都是劳动节，也该歇歇了。",
      national_day: "黄金周人多消费旺，多跑几趟，节后结账！",
    },
    talkLines: [
      "小伙子，这个月房租该交了啊！",
      "看你挺勤快的，工地上缺人要不要去试试？",
      "年轻人要有志气，别一辈子收废品。",
    ],
    // 新加：在场概率（固定位置NPC概率高）
    presenceChance: 0.85,
    // 新加：地点触发专用对话
    encounterLines: [
      "王大婶在楼道里浇花，看到你笑了笑。",
      "王大婶提着一袋菜回来，说今天菜价又涨了。",
      "王大婶在门口择菜，抬头用袖子擦了把汗。",
    ],
    // 新加：对话中可透露的信息线索
    infoHints: {
      giftHint:
        "王大婶念叨着：「今年的水果比去年贵了不少，还是买点日用品实惠。」",
      birthdayHint:
        "王大婶今天好像特别高兴，哼着小曲在打扫，或许是什么特别的日子？",
    },
    giftPrefers: ["fruits", "daily_use"],
    // v3.4 C3D-T4: 好感×技能双门槛解锁
    skillThresholds: [
      {
        skill: "cooking",
        minSkill: 40,
        minAffinity: 80,
        id: "auntWangRecipe",
        desc: "学做拿手菜，获得1个食谱",
        effect: function (st) {
          if (st.flags._auntWangRecipe) return;
          st.flags._auntWangRecipe = true;
          if (st.skills.cooking)
            st.skills.cooking.xp = Math.min(
              1000,
              (st.skills.cooking.xp || 0) + 200,
            );
          StateManager.addMessage(
            "🧑‍🍳 王大婶手把手教你做了她的拿手菜——红烧肉！家常菜烹饪灵感大涨。",
            "success",
          );
        },
      },
    ],
    // v3.6 P0-1: 关系网系统字段
    locationPreference: {
      commercialDist: 0.5,
      slum: 0.3,
      park: 0.2,
    },
    relationshipWeight: {
      family: 1.2,
      neighbor: 1.0,
      mentor: 0.8,
    },
    interactionHistory: [],
    // 交易情报：专业领域和好感门控信息
    tradeInfo: {
      expertise: ["daily", "food"],
      infoTypes: {
        price_level: { label: "日用品价格水平", threshold: 30, cost: 50 },
        category_lowest: {
          label: "全城日用品哪最便宜",
          threshold: 60,
          cost: 20,
        },
      },
    },
    // 在场加成：王大婶在城中村时，废品回收/送餐/跑腿效率提升
    presenceBonus: [
      {
        minAffinity: 30,
        jobs: ["waste_recycling", "courier_gig", "parcel_sorting"],
        multiplier: 1.1,
      },
      { minAffinity: 60, jobs: null, multiplier: 1.05 },
    ],
    // 好感阈值奖励
    affinityRewards: [
      {
        threshold: 30,
        id: "aunt_wang_30",
        desc: "王大婶开始偶尔带你一份饭（每天吃饭省¥3）",
        effect: function (st) {
          st.flags.auntWangMeal = true;
          StateManager.addMessage(
            "💕 王大婶：「你是个好孩子，以后你来我家蹭饭！」好感到30，每天多带一份饭给你。",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "aunt_wang_60",
        desc: "王大婶为你降租¥50/天",
        effect: function (st) {
          st.flags.auntWangRentDiscount = true;
          StateManager.addMessage(
            "💕 王大婶悄悄说：「你帮了我不少，房租就按250算吧，别告诉别人。」",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "aunt_wang_80",
        desc: "王大婶介绍可靠工作，每月额外收入",
        effect: function (st) {
          const bonus = 500 + Random.int(0, 299);
          st.resources.cash += bonus;
          st.resources.totalEarned += bonus;
          StateManager.addMessage(
            "❤️ 王大婶：「我侄子开了家公司，特别推荐了你，给了你¥" +
              bonus +
              " 的介绍奖金！」",
            "success",
          );
        },
      },
    ],
    favor: {
      story:
        "王大婶愁眉苦脸：「楼道水管漏水，修理工开价¥300！你懂修理不？帮大婶看看？」",
      choices: [
        {
          text: "🔧 自己动手修（需维修≥5级）",
          apply: function (st) {
            st.flags._npcFavor_aunt_wang = true;
            if (st.skills.repair && st.skills.repair.level >= 5) {
              st.flags.auntWangRentDiscount = true;
              st.skills.repair.xp += 30;
              StateManager.addMessage(
                "🔧 不到一小时修好了！王大婶感动得直抹眼泪，以后房租悄悄给你打折了。维修XP+30。",
                "success",
              );
            } else {
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
              StateManager.addMessage(
                "🔧 自己修不了，帮大婶联系了师傅还垫付了¥50。大婶记在心里了。",
                "info",
              );
            }
            if (!st.relationships.aunt_wang)
              st.relationships.aunt_wang = { affinity: 0, met: true };
            st.relationships.aunt_wang.affinity = Math.min(
              100,
              st.relationships.aunt_wang.affinity + 15,
            );
          },
        },
        {
          text: "📞 帮联系专业修理工",
          apply: function (st) {
            st.flags._npcFavor_aunt_wang = true;
            if (!st.relationships.aunt_wang)
              st.relationships.aunt_wang = { affinity: 0, met: true };
            st.relationships.aunt_wang.affinity = Math.min(
              100,
              st.relationships.aunt_wang.affinity + 8,
            );
            StateManager.addMessage(
              "📞 帮大婶联系了靠谱师傅，省了她不少麻烦，好感+8。",
              "success",
            );
          },
        },
        {
          text: "🙅 现在太忙",
          apply: function (st) {
            if (!st.relationships.aunt_wang)
              st.relationships.aunt_wang = { affinity: 0, met: true };
            st.relationships.aunt_wang.affinity = Math.max(
              -100,
              st.relationships.aunt_wang.affinity - 3,
            );
            StateManager.addMessage("🙅 推掉了，王大婶有点失望。", "warning");
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 70,
      story:
        "王大婶眼圈红了：「我儿子在外地，今年过年又没回来。我想给他写封信，但我文化不高，你……能帮我写吗？」",
      choices: [
        {
          text: "✍️ 帮她认认真真写一封",
          hint: "好感+10，心情大涨，获得王大婶传家腌菜配方",
          apply: function (st) {
            st.flags._npcDeepTask_aunt_wang = true;
            if (!st.relationships.aunt_wang)
              st.relationships.aunt_wang = { affinity: 0, met: true };
            st.relationships.aunt_wang.affinity = Math.min(
              100,
              st.relationships.aunt_wang.affinity + 10,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 20);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 8);
            st.flags.auntWangRecipe = true;
            StateManager.addMessage(
              "✍️ 你坐在她家小桌前，把她断断续续说的话拼成一封信。写完她抹了抹眼泪说：「这比我自己写的好多了。」她把压箱底的腌菜配方告诉了你。心情+20，心智+8，好感+10，获得腌菜配方（每天做饭恢复+5饥饱）。",
              "success",
            );
          },
        },
        {
          text: "🤷 自己的事自己写，我不太会这个",
          hint: "好感不变，但王大婶有些落寞",
          apply: function (st) {
            st.flags._npcDeepTask_aunt_wang = true;
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "🤷 「没事，我就随便问问。」王大婶转身去厨房，你看到她擦了擦眼角。心情-5。",
              "warning",
            );
          },
        },
      ],
    },
  },
  {
    id: "boss_li",
    name: "李工头",
    role: "包工头",
    avatar: "images/avatars/boss_li.png",
    location: "construction",
    // v3.4 C3D-T1: NPC 每日活动日程
    schedule: {
      morning: "wholesaleMarket",
      afternoon: "commercialDist",
      evening: "entertainment",
      night: "suburb",
    },
    birthday: 98,
    desc: "建筑工地的包工头，手上活多。关系好了会给好活。",
    birthdayLine: "哈哈，我今天生日，难得碰上你，请你喝瓶啤酒！",
    festivalLines: {
      spring_festival:
        "过年工地停工，工人都回老家了，你也歇两天吧，过完十五再说。",
      national_day: "黄金周工程也要赶工期，加班工资三倍，有没有兴趣加个班？",
      labor_day: "劳动节到了，建筑工人才是真正的劳动者！今天我请喝酒。",
    },
    talkLines: ["今天活多，加紧干！", "小心点，安全第一。", "干得好有奖金。"],
    // 新加：在场概率（半固定NPC）
    presenceChance: 0.75,
    // v3.1 ⑥：社会比较心理抓手（月薪，用于关系卡收入对比行）
    monthlyIncome: 18000,
    // 新加：地点触发专用对话
    encounterLines: [
      "李工头在工地图纸前比划着，抬头朝你点点头。",
      "李工头叼着烟蹲在钢筋堆上，眯眼看着吊车。",
      "李工头正跟材料商吵架，看到你摆摆手。",
    ],
    // 新加：信息线索
    infoHints: {
      giftHint: "李工头从口袋里掏出一包烟，抽出一根点上，看起来烟不离手。",
      birthdayHint:
        "李工头今天心情不错，哼着歌在工地上转悠，似乎忘了什么重要的事。",
    },
    giftPrefers: ["cigarettes", "beer"],
    // v3.4 C3D-T4: 好感×技能双门槛解锁
    skillThresholds: [
      {
        skill: "sales",
        minSkill: 50,
        minAffinity: 80,
        id: "bossLiStallBonus",
        desc: "学做生意技巧，摆摊收入+10%",
        effect: function (st) {
          if (st.flags.bossLiStallBonus) return;
          st.flags.bossLiStallBonus = true;
          StateManager.addMessage(
            "📈 李工头教了你几手生意经：「进货砍价看这三样就够了！」摆摊收入永久+10%。",
            "success",
          );
        },
      },
    ],
    // v3.6 P0-1: 关系网系统字段
    locationPreference: {
      commercialDist: 0.4,
      construction: 0.35,
      entertainment: 0.25,
    },
    relationshipWeight: {
      former_colleague: 1.3,
      neighbor: 0.9,
    },
    interactionHistory: [],
    // 交易情报
    tradeInfo: {
      expertise: ["scrap"],
      infoTypes: {
        price_level: { label: "废品行情走势", threshold: 30, cost: 50 },
        good_highest: { label: "哪收废品价最高", threshold: 60, cost: 30 },
      },
    },
    // 在场加成：李工头在工地时，建筑类工作工资提升
    presenceBonus: [
      {
        minAffinity: 30,
        jobs: ["manual_labor_construction", "skilled_labor_construction"],
        multiplier: 1.15,
      },
      {
        minAffinity: 60,
        jobs: [
          "manual_labor_construction",
          "skilled_labor_construction",
          "bricklaying",
        ],
        multiplier: 1.1,
      },
    ],
    affinityRewards: [
      {
        threshold: 30,
        id: "boss_li_30",
        desc: "李工头开始安排你做技术活（工资+20%）",
        effect: function (st) {
          st.flags.bossLiSkillJob = true;
          StateManager.addMessage(
            "💕 李工头：「你这小伙子踏实，以后跟着我干技术活，工钱多给你两成。」",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "boss_li_60",
        desc: "李工头借给你¥500应急（无息）",
        effect: function (st) {
          st.resources.cash += 500;
          st.flags.bossLiLoan = true;
          StateManager.addMessage(
            "💕 李工头拍着你肩膀：「手头紧？先拿500，不急还。」",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "boss_li_80",
        desc: "李工头推荐你去正规工程队，解锁更高收入工作",
        effect: function (st) {
          st.flags.bossLiReferred = true;
          StateManager.addMessage(
            "❤️ 李工头：「我认识个正规工程队的老板，把你推荐过去了，工资是这里两倍！」",
            "success",
          );
        },
      },
    ],
    favor: {
      story:
        "李工头压低声音：「我明天有事不来，但工地不能没人，你能顶半天班帮我挡着不？有好处。」",
      choices: [
        {
          text: "💪 行，我来顶",
          apply: function (st) {
            st.flags._npcFavor_boss_li = true;
            var reward = 150 + Random.int(0, 99);
            st.resources.cash += reward;
            st.resources.totalEarned += reward;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 20);
            st.player.physique = Math.min(100, st.player.physique + 1);
            if (!st.relationships.boss_li)
              st.relationships.boss_li = { affinity: 0, met: true };
            st.relationships.boss_li.affinity = Math.min(
              100,
              st.relationships.boss_li.affinity + 15,
            );
            StateManager.addMessage(
              "💪 顶了半天班，工人们听你的！李工头事后塞给你¥" +
                reward +
                "，体质+1。",
              "success",
            );
          },
        },
        {
          text: "😅 我也有事，帮不上",
          apply: function (st) {
            st.flags._npcFavor_boss_li = true;
            if (!st.relationships.boss_li)
              st.relationships.boss_li = { affinity: 0, met: true };
            st.relationships.boss_li.affinity = Math.max(
              -100,
              st.relationships.boss_li.affinity - 5,
            );
            StateManager.addMessage(
              "😅 推掉了。李工头皱眉，有点不高兴。",
              "warning",
            );
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 70,
      story:
        "李工头难得一脸认真：「我儿子高考完打算出来打工，但我不想他走我这条路。你在城里见过些世面，能不能跟他聊聊，讲讲该怎么学技术、往哪个方向发展？」",
      choices: [
        {
          text: "🎓 认真给他讲，把自己的经历全说了",
          hint: "好感+10，名气+8，智力+2，收到李工头一笔感谢钱",
          apply: function (st) {
            st.flags._npcDeepTask_boss_li = true;
            if (!st.relationships.boss_li)
              st.relationships.boss_li = { affinity: 0, met: true };
            st.relationships.boss_li.affinity = Math.min(
              100,
              st.relationships.boss_li.affinity + 10,
            );
            var reward = 300 + Random.int(0, 199);
            st.resources.cash += reward;
            st.resources.totalEarned += reward;
            st.player.fame = Math.min(100, st.player.fame + 8);
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 2,
            );
            StateManager.addMessage(
              "🎓 你和李工头的儿子谈了一个下午，把你来城里的弯路和经验全说了。两天后李工头悄悄给你发来¥" +
                reward +
                "，说「孩子回去想明白了，谢谢你」。现金+¥" +
                reward +
                "，名气+8，智力+2，好感+10。",
              "success",
            );
          },
        },
        {
          text: "😅 我自己都还没想明白，没法给人讲",
          hint: "无惩罚，但错过一次深度互动",
          apply: function (st) {
            st.flags._npcDeepTask_boss_li = true;
            StateManager.addMessage(
              "😅 李工头点点头：「那算了，你自己也在摸索。」他拍了拍你肩膀，走了。",
              "info",
            );
          },
        },
      ],
    },
  },
  {
    id: "sister_zhang",
    name: "张姐",
    role: "中介",
    avatar: "images/avatars/zijie.png",
    location: "commercialDist",
    // v3.4 C3D-T1: NPC 每日活动日程
    schedule: {
      morning: "factoryZone",
      afternoon: "factoryZone",
      evening: "school",
      night: "slum",
    },
    birthday: 155,
    desc: "人力资源中介，认识各行各业的人。帮她跑腿可以提升关系。",
    birthdayLine:
      "今天我生日！你记得？哎，平时太忙了，难得有人想着我，谢谢你啊！",
    festivalLines: {
      spring_festival: "年货节推广工资高，我帮你报了名，明天去商场门口发传单！",
      mid_autumn: "中秋礼品市场最旺，我手头有个月饼礼盒配送的活，你做不做？",
      labor_day: "劳动节促销季，商场招了一批临时促销员，你要不要去试试？",
      national_day: "黄金周旅游旺季，景区向导缺人，说不定比打工赚得多。",
    },
    talkLines: [
      "我这边有几个好工作，你要不要看看？",
      "做服务业态度最重要。",
      "多考几个证，好工作不愁。",
    ],
    // 新加：在场概率（流动性高的NPC）
    presenceChance: 0.65,
    // 新加：地点触发专用对话
    encounterLines: [
      "张姐在路边发传单，抽空朝你挥了挥手。",
      "张姐在咖啡店门口刷手机，抬头冲你笑了笑。",
      "张姐手里拎着一袋新衣服，脚步匆匆地走过。",
    ],
    // 新加：信息线索
    infoHints: {
      giftHint: "张姐路过服装店橱窗，停下来看了看那件新款外套，眼神有些向往。",
      birthdayHint:
        "张姐今天特意打扮了一番，说是跟朋友约好了，但嘴角一直带着笑意。",
    },
    giftPrefers: ["clothing", "snacks"],
    // v3.4 C3D-T4: 好感×技能双门槛解锁
    skillThresholds: [
      {
        attr: "physique",
        minAttr: 60,
        minAffinity: 80,
        id: "zhangFactoryBonus",
        desc: "一起做计件工，factoryZone收入+15%",
        effect: function (st) {
          if (st.flags.zhangFactoryBonus) return;
          st.flags.zhangFactoryBonus = true;
          StateManager.addMessage(
            "💪 张姐介绍你进工厂做计件工，多劳多得！工厂工作收入永久+15%。",
            "success",
          );
        },
      },
    ],
    // v3.6 P0-1: 关系网系统字段
    locationPreference: {
      commercialDist: 0.5,
      factoryZone: 0.3,
      school: 0.2,
    },
    relationshipWeight: {
      family: 1.2,
      former_colleague: 1.1,
      mentor: 0.85,
    },
    interactionHistory: [],
    // 交易情报
    tradeInfo: {
      expertise: ["clothing", "electronics", "luxury"],
      infoTypes: {
        price_level: { label: "商业区价格资讯", threshold: 30, cost: 60 },
        category_highest: {
          label: "哪卖服装电子最贵",
          threshold: 60,
          cost: 30,
        },
      },
    },
    // 在场加成：张姐在商业区时，摆摊和销售类收入提升
    presenceBonus: [
      {
        minAffinity: 30,
        jobs: [
          "street_vending_goods",
          "street_vending_food",
          "food_stall",
          "sales_promotion",
        ],
        multiplier: 1.12,
      },
      { minAffinity: 60, jobs: null, multiplier: 1.05 },
    ],
    affinityRewards: [
      {
        threshold: 30,
        id: "sister_zhang_30",
        desc: "张姐透露内部招聘信息",
        effect: function (st) {
          const bonus = 200 + Random.int(0, 299);
          st.resources.cash += bonus;
          st.resources.totalEarned += bonus;
          StateManager.addMessage(
            "💕 张姐悄悄发来一个内推机会，接了个短单赚了 ¥" + bonus + "。",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "sister_zhang_60",
        desc: "张姐帮你免费考证书辅导资料",
        effect: function (st) {
          var skills = Object.keys(st.skills);
          skills.forEach(function (k) {
            st.skills[k].xp += 50;
          });
          StateManager.addMessage(
            "💕 张姐送了你一套证书备考资料，所有技能XP+50！",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "sister_zhang_80",
        desc: "张姐帮你找到商业区黄金摊位+内推初级职场",
        effect: function (st) {
          st.flags.zhangReferred = true;
          st.flags.sisterZhangReferred = true;
          StateManager.addMessage(
            "❤️ 张姐：「我帮你在步行街口弄了个好摊位，客流量大得很！另外我还认识个猎头，帮你递了简历。」",
            "success",
          );
        },
      },
    ],
    favor: {
      story:
        "张姐有些不好意思：「我这边有个招聘会，能不能帮我发100份传单？跑腿费我给你。」",
      choices: [
        {
          text: "📋 帮忙！正好认识更多人",
          apply: function (st) {
            st.flags._npcFavor_sister_zhang = true;
            var pay = 80 + Random.int(0, 59);
            st.resources.cash += pay;
            st.resources.totalEarned += pay;
            st.player.fame = Math.min(100, st.player.fame + 5);
            st.skills.sales && (st.skills.sales.xp += 20);
            if (!st.relationships.sister_zhang)
              st.relationships.sister_zhang = { affinity: 0, met: true };
            st.relationships.sister_zhang.affinity = Math.min(
              100,
              st.relationships.sister_zhang.affinity + 15,
            );
            StateManager.addMessage(
              "📋 发完了传单还认识了好几个HR！拿了¥" +
                pay +
                " 跑腿费，名气+5，销售XP+20。",
              "success",
            );
          },
        },
        {
          text: "🚶 不干，太累了",
          apply: function (st) {
            st.flags._npcFavor_sister_zhang = true;
            if (!st.relationships.sister_zhang)
              st.relationships.sister_zhang = { affinity: 0, met: true };
            st.relationships.sister_zhang.affinity = Math.max(
              -100,
              st.relationships.sister_zhang.affinity - 3,
            );
            StateManager.addMessage("🚶 推掉了，张姐只好自己找人。", "info");
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 70,
      story:
        "张姐推开你坐的茶室门，神情有点复杂：「我认识个创业公司，需要一个有城市生存经验的人去做用户访谈，一天¥600。但他们想要的是你这种…真实经历过底层的人。你愿不愿意去讲讲你自己的故事？」",
      choices: [
        {
          text: "🎤 去，讲出来未必是丢脸的事",
          hint: "获得¥600+名气+10+心智+5，且张姐的内推成功率提升",
          apply: function (st) {
            st.flags._npcDeepTask_sister_zhang = true;
            if (!st.relationships.sister_zhang)
              st.relationships.sister_zhang = { affinity: 0, met: true };
            st.relationships.sister_zhang.affinity = Math.min(
              100,
              st.relationships.sister_zhang.affinity + 10,
            );
            st.resources.cash += 600;
            st.resources.totalEarned += 600;
            st.player.fame = Math.min(100, st.player.fame + 10);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            st.flags.zhangDeepReferred = true;
            StateManager.addMessage(
              "🎤 你坐在那家公司的会议室里，把来这座城市的第一天、第一次饿肚子、第一次看到希望，都说了出来。那群大学生记者听得很认真。张姐事后说：「你说的比我想的好得多。」现金+¥600，名气+10，心智+5，好感+10，张姐的内推资源进一步开放。",
              "success",
            );
          },
        },
        {
          text: "🙅 这些不想对陌生人说",
          hint: "好感不变，张姐理解，内推不受影响",
          apply: function (st) {
            st.flags._npcDeepTask_sister_zhang = true;
            StateManager.addMessage(
              "🙅 「没关系，我懂，不是每个人都愿意把过去当故事讲。」张姐点了点头，没再提起。",
              "info",
            );
          },
        },
      ],
    },
  },
  {
    id: "old_zhou",
    name: "老周",
    role: "收废品老人",
    avatar: "images/avatars/old_zhou.png",
    location: "slum",
    // v3.4 C3D-T1: NPC 每日活动日程
    schedule: {
      morning: "slum",
      afternoon: "construction",
      evening: "wholesaleMarket",
      night: "slum",
    },
    birthday: 210,
    desc: "在城中村收了几十年废品的老前辈。知道废品行情的门道。",
    birthdayLine:
      "嗐，还是你记性好，我自己都忘了今天是我生日。岁数大了，每年过一年少一年呐。",
    festivalLines: {
      spring_festival: "过年废品站不收废，我也歇几天，你也好好过个年吧。",
      national_day: "国庆黄金周景区的空瓶废铁最多，我去捡几天，比平时强多了。",
      dragon_boat: "端午节粽子叶是好东西，很多人扔掉，我悄悄攒了一袋能卖。",
      mid_autumn: "中秋月饼盒子铁皮的那种最值钱，人家当垃圾扔，我当宝贝捡。",
    },
    talkLines: [
      "废金属最近涨了，赶紧多收点。",
      "收废品虽然脏，但也是一门生意经。",
      "年轻人脑子活，学学怎么挑好货。",
    ],
    // 新加：在场概率（半固定NPC）
    presenceChance: 0.8,
    // 新加：地点触发专用对话
    encounterLines: [
      "老周在三轮车旁整理废纸板，看到你咧嘴笑了笑。",
      "老周正跟人讲价，声音不小。",
      "老周用袖子擦着汗，坐在废品堆旁歇脚。",
    ],
    // 新加：信息线索
    infoHints: {
      giftHint: "老周歇下来时，从兜里掏出一瓶啤酒，咕咚咕咚喝了几口。",
      birthdayHint:
        "老周今天没出来收废品，废品站说他难得歇了一天，可能是日子特殊。",
    },
    giftPrefers: ["beer", "instant_noodles"],
    // v3.1 ⑥：社会比较心理抓手（月薪，用于关系卡收入对比行）
    monthlyIncome: 5200,
    // v3.4 C3D-T4: 好感×技能双门槛解锁
    skillThresholds: [
      {
        skill: "repair",
        minSkill: 30,
        minAffinity: 80,
        id: "zhouScrapBonus",
        desc: "废品行家指点，construction拾荒效率+20%",
        effect: function (st) {
          if (st.flags.zhouScrapBonus) return;
          st.flags.zhouScrapBonus = true;
          StateManager.addMessage(
            "🔧 老周指点了你几手废品鉴别的诀窍：「看这里，这是铜不是铁！」废品回收效率永久+20%。",
            "success",
          );
        },
      },
    ],
    // v3.6 P0-1: 关系网系统字段
    locationPreference: {
      slum: 0.5,
      construction: 0.3,
      wholesaleMarket: 0.2,
    },
    relationshipWeight: {
      neighbor: 1.1,
      rival: 0.7,
    },
    interactionHistory: [],
    // 交易情报
    tradeInfo: {
      expertise: ["scrap"],
      infoTypes: {
        good_highest: { label: "废品全城最高价", threshold: 30, cost: 40 },
        category_lowest: { label: "全城废品回收比价", threshold: 60, cost: 20 },
      },
    },
    // 在场加成：老周分享经验，废品回收效率大幅提升
    presenceBonus: [
      {
        minAffinity: 30,
        jobs: ["waste_recycling", "junk_sorting"],
        multiplier: 1.2,
      },
      {
        minAffinity: 60,
        jobs: ["waste_recycling", "junk_sorting"],
        multiplier: 1.1,
      },
    ],
    affinityRewards: [
      {
        threshold: 30,
        id: "old_zhou_30",
        desc: "老周分享废品行情密报（每日收废品+¥15）",
        effect: function (st) {
          st.flags.oldZhouTips = true;
          StateManager.addMessage(
            "💕 老周：「我告诉你，最近钢铁价格要涨，多囤点废铁。」废品回收效率大增！",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "old_zhou_60",
        desc: "老周借给你一辆三轮车（扩大废品回收范围）",
        effect: function (st) {
          st.flags.oldZhouTricycle = true;
          StateManager.addMessage(
            "💕 老周把他的旧三轮车借给你，收废品的范围广了，效率提升！",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "old_zhou_80",
        desc: "老周把废品站关系介绍给你（解锁高价收购渠道+正规回收站工作）",
        effect: function (st) {
          st.flags.oldZhouChannel = true;
          st.flags.oldZhouReferred = true;
          StateManager.addMessage(
            "❤️ 老周：「我干了三十年了，以后废品直接走我的渠道，价格比外面高三成。城西回收站也在招人，我跟他们打过招呼了。」",
            "success",
          );
        },
      },
    ],
    favor: {
      story:
        "老周叹气：「我老腰不好，今天这批废铁实在搬不动，你年轻力壮，帮老头子推到站里去？」",
      choices: [
        {
          text: "💪 帮！搬就搬",
          apply: function (st) {
            st.flags._npcFavor_old_zhou = true;
            st.player.physique = Math.min(100, st.player.physique + 2);
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            st.flags.oldZhouTips = true;
            if (!st.relationships.old_zhou)
              st.relationships.old_zhou = { affinity: 0, met: true };
            st.relationships.old_zhou.affinity = Math.min(
              100,
              st.relationships.old_zhou.affinity + 15,
            );
            StateManager.addMessage(
              "💪 推着三轮车去了废品站，累是累，体质+2！老周悄悄告诉你废品行情诀窍。",
              "success",
            );
          },
        },
        {
          text: "🚶 今天实在没时间",
          apply: function (st) {
            st.flags._npcFavor_old_zhou = true;
            if (!st.relationships.old_zhou)
              st.relationships.old_zhou = { affinity: 0, met: true };
            st.relationships.old_zhou.affinity = Math.max(
              -100,
              st.relationships.old_zhou.affinity - 3,
            );
            StateManager.addMessage(
              "🚶 推掉了，老周叹了口气独自推车走了。",
              "warning",
            );
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 70,
      story:
        "老周靠在墙边，沉默了好一会儿才开口：「我干了三十多年，手里攒了点小钱，不多，六七万吧。我不懂理财，怕钱放着就贬值了……你帮我想想，怎么搞比较稳？」",
      choices: [
        {
          text: "🏦 建议存银行定期，稳一点",
          hint: "老周感激，好感+8，获得废品站内部进货价优惠",
          apply: function (st) {
            st.flags._npcDeepTask_old_zhou = true;
            if (!st.relationships.old_zhou)
              st.relationships.old_zhou = { affinity: 0, met: true };
            st.relationships.old_zhou.affinity = Math.min(
              100,
              st.relationships.old_zhou.affinity + 8,
            );
            st.flags.oldZhouBetterDeal = true;
            StateManager.addMessage(
              "🏦 你建议老周把钱分成两份，一份存三年定期，一份放着应急。他听完点头：「就这样！」过了几天，他说废品站的老关系帮你再压了一成收价。好感+8，废品回收收益小幅再提升。",
              "success",
            );
          },
        },
        {
          text: "📈 建议买点低风险基金，收益比定存高",
          hint: "老周有点犹豫，但还是感谢你，好感+5",
          apply: function (st) {
            st.flags._npcDeepTask_old_zhou = true;
            if (!st.relationships.old_zhou)
              st.relationships.old_zhou = { affinity: 0, met: true };
            st.relationships.old_zhou.affinity = Math.min(
              100,
              st.relationships.old_zhou.affinity + 5,
            );
            StateManager.addMessage(
              "📈 你解释了货币基金和低风险债基的逻辑。老周听完皱眉：「我不太懂这些……但我信你。」他买了一点，三个月后找你汇报说涨了一点。好感+5。",
              "info",
            );
          },
        },
        {
          text: "🤷 我也不懂，别乱建议你",
          hint: "老周叹气，好感不变",
          apply: function (st) {
            st.flags._npcDeepTask_old_zhou = true;
            StateManager.addMessage(
              "🤷 「算了，你年轻也不懂这个，我再想想。」老周拍了拍袋子，推车走了。",
              "info",
            );
          },
        },
      ],
    },
  },
  {
    id: "xiao_mei",
    name: "小美",
    role: "大学生",
    avatar: "images/avatars/xiao_mei.png",
    location: "school",
    // v3.4 C3D-T1: NPC 每日活动日程
    schedule: {
      morning: "trainingCenter",
      afternoon: "commercialDist",
      evening: "commercialDist",
      night: "entertainment",
    },
    birthday: 280,
    desc: "大学城的贫困生，周末做家教赚生活费。",
    birthdayLine:
      "哇你怎么知道今天是我生日？！室友们都忘了，就你记得，好感动呀～",
    festivalLines: {
      spring_festival:
        "新年快乐！你有没有立下新年愿望？我今年的目标是把英语四级过了！",
      mid_autumn: "中秋节，想起家乡的月亮好大好圆，你有没有想家啊？",
      dragon_boat:
        "端午节假期最适合备考，你在学习什么吗？我整理了笔记，要分享给你！",
      labor_day: "劳动节假期家教需求旺，好多学生要补课，我这几天忙坏了！",
    },
    talkLines: [
      "你知道哪里还有家教的机会吗？",
      "我英语还不错，可以教初中生。",
      "毕业后想去大厂，得先积累经验。",
    ],
    // 新加：在场概率（半固定NPC）
    presenceChance: 0.7,
    // 新加：地点触发专用对话
    encounterLines: [
      "小美抱着书本从图书馆出来，笑着冲你点头。",
      "小美在食堂门口排着队，看到你招了招手。",
      "小美在自习室窗边看书，阳光洒在桌面上。",
    ],
    // 新加：信息线索
    infoHints: {
      giftHint: "小美从书包里掏出一个苹果啃了起来，说是同学给的，又红又甜。",
      birthdayHint: "小美今天收到一束花，不好意思地说是一个朋友送的。",
    },
    giftPrefers: ["fruits", "snacks"],
    // v3.4 C3D-T4: 好感×技能双门槛解锁
    skillThresholds: [
      {
        attr: "charm",
        minAttr: 70,
        minAffinity: 80,
        id: "xiaomeiModelJob",
        desc: "介绍高端兼职，解锁商业区模特工作",
        effect: function (st) {
          if (st.flags.xiaomeiModelJob) return;
          st.flags.xiaomeiModelJob = true;
          StateManager.addMessage(
            "🌟 小美兴奋地说：「我学姐在商业区做平面模特，正缺人呢！以你的形象绝对合适！」解锁了商业区模特工作。",
            "success",
          );
        },
      },
    ],
    // v3.6 P0-1: 关系网系统字段
    locationPreference: {
      commercialDist: 0.4,
      school: 0.35,
      trainingCenter: 0.25,
    },
    relationshipWeight: {
      mentor: 1.0,
      friend: 1.0,
    },
    interactionHistory: [],
    // 交易情报
    tradeInfo: {
      expertise: ["daily", "food", "clothing"],
      infoTypes: {
        price_level: { label: "平价商品情报", threshold: 30, cost: 30 },
        category_lowest: { label: "哪买东西最便宜", threshold: 60, cost: 10 },
      },
    },
    // 在场加成：小美在大学城时，学习效率提升（通过studyBonus标志）
    presenceBonus: [
      {
        minAffinity: 30,
        jobs: ["tutoring", "package_delivery"],
        multiplier: 1.15,
      },
      { minAffinity: 60, jobs: ["tutoring"], multiplier: 1.1 },
    ],
    // 特殊：小美在场时自考备考额外+2学习点（由main.js检测studyPresenceBonus标志）
    studyPresenceBonus: { minAffinity: 30, studyPointBonus: 2 },
    affinityRewards: [
      {
        threshold: 30,
        id: "xiao_mei_30",
        desc: "小美每周分享一道英语/编程练习题（+XP）",
        effect: function (st) {
          st.skills.english.xp += 60;
          st.skills.coding.xp += 60;
          StateManager.addMessage(
            "💕 小美每周给你发习题，英语和编程XP各+60！学习不孤单了。",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "xiao_mei_60",
        desc: "小美介绍图书馆内部学习资源（训练效率+30%）",
        effect: function (st) {
          st.flags.xiaomeiLibrary = true;
          StateManager.addMessage(
            "💕 小美给了你图书馆的内部学习账号，自习效率大增！",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "xiao_mei_80",
        desc: "小美帮你联系大厂实习+精英家教机会",
        effect: function (st) {
          st.flags.xiaomeiInternship = true;
          st.flags.xiaoMeiReferred = true;
          StateManager.addMessage(
            "❤️ 小美：「我室友在字节做了实习，我把你推荐给她了！另外我导师的补习机构也在招家教，时薪很高的～」",
            "success",
          );
        },
      },
    ],
    favor: {
      story:
        "小美焦急地说：「我妈从老家寄来的包裹卡在快递站了，我有课走不开，能不能帮我去取一下？」",
      choices: [
        {
          text: "🚚 帮你去取",
          apply: function (st) {
            st.flags._npcFavor_xiao_mei = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            st.skills.english && (st.skills.english.xp += 40);
            st.skills.coding && (st.skills.coding.xp += 40);
            if (!st.relationships.xiao_mei)
              st.relationships.xiao_mei = { affinity: 0, met: true };
            st.relationships.xiao_mei.affinity = Math.min(
              100,
              st.relationships.xiao_mei.affinity + 15,
            );
            StateManager.addMessage(
              "🚚 取到了！小美开心地打开包裹——有妈妈腌的咸菜，分了你一罐。她感谢你，给你补了英语和编程各+40XP。",
              "success",
            );
          },
        },
        {
          text: "😅 对不起，今天没空",
          apply: function (st) {
            st.flags._npcFavor_xiao_mei = true;
            if (!st.relationships.xiao_mei)
              st.relationships.xiao_mei = { affinity: 0, met: true };
            st.relationships.xiao_mei.affinity = Math.max(
              -100,
              st.relationships.xiao_mei.affinity - 3,
            );
            StateManager.addMessage(
              "😅 推掉了，小美失望地点点头，只好请室友去了。",
              "info",
            );
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 70,
      story:
        "小美发来消息：「我申请了一个支教项目，周末去城郊给留守儿童上数学和英语课。但我一个人有点怕，你能不能陪我去一次？」",
      choices: [
        {
          text: "🏫 去，正好也想看看那边的情况",
          hint: "心情+15，名气+12，心智+5，好感+10，解锁小美最终任务链",
          apply: function (st) {
            st.flags._npcDeepTask_xiao_mei = true;
            if (!st.relationships.xiao_mei)
              st.relationships.xiao_mei = { affinity: 0, met: true };
            st.relationships.xiao_mei.affinity = Math.min(
              100,
              st.relationships.xiao_mei.affinity + 10,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            st.player.fame = Math.min(100, st.player.fame + 12);
            st.flags.xiaoMeiSupport = true;
            StateManager.addMessage(
              "🏫 你们坐了两小时公交到城郊，十几个孩子在破旧教室等着。你帮小美维持秩序，给孩子们讲了一些城市里的事情。回来的路上，小美说：「谢谢你陪我。这比我想的重要很多。」心情+15，心智+5，名气+12，好感+10。",
              "success",
            );
          },
        },
        {
          text: "😅 那边太远了，今天走不开",
          hint: "小美理解，好感不变",
          apply: function (st) {
            st.flags._npcDeepTask_xiao_mei = true;
            StateManager.addMessage(
              "😅 「没关系，我叫同学陪我去。」小美还是笑着，你觉得稍微有点亏欠。",
              "info",
            );
          },
        },
      ],
    },
  },
  {
    id: "chef_chen",
    name: "陈师傅",
    role: "大厨",
    avatar: "images/avatars/chef_chen.png",
    location: "commercialDist",
    birthday: 325,
    desc: "商业区小有名气的厨师，手艺了得。想学烹饪可以找他。",
    birthdayLine: "哟，今天我生日，我刚做了个大蛋糕。来，切一块尝尝！",
    festivalLines: {
      spring_festival:
        "大年夜年夜饭档期最贵！我打算撑到初三，这几天每天净赚五千不是梦！",
      mid_autumn: "中秋不如学学做月饼？冰皮的、烤的我都会，今晚教你一种。",
      national_day:
        "黄金周客流翻倍，我这摊忙不过来，你来帮我打下手？工钱不会少你。",
      dragon_boat: "端午粽子我年年自己包，今年包了五十个，帮我卖几个？",
      labor_day: "劳动节食堂放假，路边摊反而人多，今天来搭把手收益分你三成。",
    },
    talkLines: [
      "做菜讲究火候，做人讲究分寸。",
      "来尝尝我新研制的配方。",
      "你有点天分，要不要学两手？",
    ],
    // 新加：在场概率（半固定NPC）
    presenceChance: 0.75,
    // v3.1 ⑥：社会比较心理抓手（月薪，用于关系卡收入对比行）
    monthlyIncome: 9500,
    // 新加：地点触发专用对话
    encounterLines: [
      "陈师傅在灶台前颠勺，火光映红了脸。",
      "陈师傅正在切菜，刀工干净利落，看到你笑了笑。",
      "陈师傅摘下围裙，擦了擦手，准备歇会儿。",
    ],
    // 新加：信息线索
    infoHints: {
      giftHint:
        "陈师傅炒菜时从箱底拿出一瓶好酒，喃喃说：「这个配我的葱爆牛肉绝了。」",
      birthdayHint: "陈师傅今天做了几道拿手菜请熟客尝，看起来特别高兴。",
    },
    giftPrefers: ["beer", "vegetables"],
    // v3.6 P0-1: 关系网系统字段
    locationPreference: {
      commercialDist: 0.6,
      wholesaleMarket: 0.25,
      slum: 0.15,
    },
    relationshipWeight: {
      neighbor: 1.0,
      mentor: 0.9,
    },
    interactionHistory: [],
    // 交易情报
    tradeInfo: {
      expertise: ["food"],
      infoTypes: {
        price_level: { label: "食材价格行情", threshold: 30, cost: 40 },
        category_lowest: { label: "哪买菜最便宜", threshold: 60, cost: 15 },
      },
    },
    // 在场加成：陈师傅在场时，餐饮/食品摊位收入提升
    presenceBonus: [
      {
        minAffinity: 30,
        jobs: ["food_stall", "street_vending_food", "kitchen_helper"],
        multiplier: 1.18,
      },
      {
        minAffinity: 60,
        jobs: ["food_stall", "street_vending_food", "kitchen_helper"],
        multiplier: 1.1,
      },
    ],
    affinityRewards: [
      {
        threshold: 30,
        id: "chef_chen_30",
        desc: "陈师傅教你一道菜（烹饪XP+80）",
        effect: function (st) {
          st.skills.cooking.xp += 80;
          StateManager.addMessage(
            "💕 陈师傅手把手教了你一道特色菜，烹饪XP+80！",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "chef_chen_60",
        desc: "陈师傅让你做帮厨打下手（每次+¥50+烹饪XP）",
        effect: function (st) {
          st.flags.chefChenAssistant = true;
          st.resources.cash += 50;
          st.skills.cooking.xp += 40;
          StateManager.addMessage(
            "💕 陈师傅：「你来帮我打下手吧，一次50块，还能学手艺。」",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "chef_chen_80",
        desc: "陈师傅传授独门秘方（吃饭费用永久-20%）",
        effect: function (st) {
          st.flags.chefChenRecipe = true;
          StateManager.addMessage(
            "❤️ 陈师傅拿出了压箱底的食谱：「这是我师父传给我的，今天传给你。」自己做饭省20%。",
            "success",
          );
        },
      },
    ],
    favor: {
      story:
        "陈师傅拦住你：「我今天缺新鲜蔬菜，批发市场你熟不熟？帮我带两斤萝卜和一斤香菇，我多给你工钱。」",
      choices: [
        {
          text: "🥕 帮你买！我正好去批发市场",
          apply: function (st) {
            st.flags._npcFavor_chef_chen = true;
            var pay = 60 + Random.int(0, 39);
            st.resources.cash += pay;
            st.resources.totalEarned += pay;
            st.skills.cooking && (st.skills.cooking.xp += 50);
            if (!st.relationships.chef_chen)
              st.relationships.chef_chen = { affinity: 0, met: true };
            st.relationships.chef_chen.affinity = Math.min(
              100,
              st.relationships.chef_chen.affinity + 15,
            );
            StateManager.addMessage(
              "🥕 买回来了！陈师傅做菜时顺便教了你几招刀工，拿了¥" +
                pay +
                " 跑腿费，烹饪XP+50。",
              "success",
            );
          },
        },
        {
          text: "🙅 不顺路",
          apply: function (st) {
            st.flags._npcFavor_chef_chen = true;
            if (!st.relationships.chef_chen)
              st.relationships.chef_chen = { affinity: 0, met: true };
            st.relationships.chef_chen.affinity = Math.max(
              -100,
              st.relationships.chef_chen.affinity - 3,
            );
            StateManager.addMessage(
              "🙅 推掉了，陈师傅只好自己跑一趟。",
              "info",
            );
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 70,
      story:
        "陈师傅坐下来，罕见地沉默了很久：「我干厨师干了二十年了。我老婆说，趁现在还走得动，开一家属于自己的小馆子。但我一辈子给人打工，不知道怎么开始。你跟着我学了这么久……你觉得，我行吗？」",
      choices: [
        {
          text: "💪 行！你的手艺这条街上没人比得了",
          hint: "好感+10，陈师傅获得开店信念，后续解锁陈师傅餐馆事件链",
          apply: function (st) {
            st.flags._npcDeepTask_chef_chen = true;
            if (!st.relationships.chef_chen)
              st.relationships.chef_chen = { affinity: 0, met: true };
            st.relationships.chef_chen.affinity = Math.min(
              100,
              st.relationships.chef_chen.affinity + 10,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 12);
            st.flags.chefChenWillOpen = true;
            StateManager.addMessage(
              "💪 「我行吗？」「你行。」陈师傅沉默了一会儿，然后点头：「好。那我试试。」你不知道他是否真的会去做，但那个眼神里有什么东西亮了一下。好感+10，心情+12。未来某天，也许你会路过一家新开的小馆子。",
              "success",
            );
          },
        },
        {
          text: "⚠️ 开店风险很大，先想清楚再说",
          hint: "陈师傅冷静下来，好感+3",
          apply: function (st) {
            st.flags._npcDeepTask_chef_chen = true;
            if (!st.relationships.chef_chen)
              st.relationships.chef_chen = { affinity: 0, met: true };
            st.relationships.chef_chen.affinity = Math.min(
              100,
              st.relationships.chef_chen.affinity + 3,
            );
            StateManager.addMessage(
              "⚠️ 你认真讲了开店的成本、租金和竞争。陈师傅点头：「你说的对，我再想想。」他没失望，只是更冷静了。好感+3。",
              "info",
            );
          },
        },
        {
          text: "🤷 这个我说不准，你自己决定",
          hint: "陈师傅有点失落，但理解",
          apply: function (st) {
            st.flags._npcDeepTask_chef_chen = true;
            StateManager.addMessage(
              "🤷 「也对，这种事只能自己想。」陈师傅收起那包烟，起身去摊子上忙了。",
              "info",
            );
          },
        },
      ],
    },
  },

  // ============================================================
  // 待完成：新增 NPC — 完整配置（参考《Stardew Valley》《动物森友会》《大多数》）
  // 实现提示：每个 NPC 需要完整配置（生日/节日/对话/礼物/情报/在场加成/好感奖励/求助/深度任务）
  // 参考来源：
  //   - 《Stardew Valley》NPC系统：岛民性格、喜好、任务链设计
  //   - 《动物森友会》：岛民对话风格、节日互动
  //   - 《大多数》NPC系统：好感度、求助、深度任务
  // ============================================================
  //
  // ============================================================
  // 银行地点 NPC（精简版 — 每个行业只保留1个代表）
  // 参考来源：《大多数》NPC系统 / 真实中国银行从业者画像（2024年）
  // 联动：银行地点 jobs 数组已更新，需配套添加事件
  // ============================================================
  // TODO: 待实现 - 老陈（银行保安，参考真实银行保安工作生活）
  // {
  //   id: "uncle_chen_bank",
  //   name: "老陈",
  //   role: "银行保安",
  //   location: "bank",
  //   birthday: 200,
  //   desc: "银行门口站了八年的保安，见过形形色色的人。退休前在部队干过，说话直但心善。",
  //   birthdayLine: "今天是我生日？哈哈，你还记得！来，进屋坐坐，喝杯茶。",
  //   festivalLines: {
  //     spring_festival: "过年银行开门三天，取钱的人排长队，忙死了！",
  //     mid_autumn: "中秋节银行不放假，客户来办业务的不少。",
  //     labor_day: "劳动节放假三天，银行关门，我在家陪老伴。",
  //     national_day: "黄金周理财到期的人多，大厅挤满了。",
  //   },
  //   talkLines: [
  //     "存取款记得带身份证。",
  //     "别信那些高息理财，都是坑。",
  //     "年轻人，多存点钱，以备不时之需。",
  //   ],
  //   giftPrefers: ["cigarettes", "beer"],
  //   tradeInfo: {
  //     expertise: ["daily", "food"],
  //     infoTypes: {
  //       price_level: { label: "银行周边消费水平", threshold: 30, cost: 20 },
  //       category_lowest: { label: "附近吃饭哪里便宜", threshold: 60, cost: 10 },
  //     },
  //   },
  //   presenceBonus: [
  //     {
  //       minAffinity: 30,
  //       jobs: ["bank_security"],
  //       multiplier: 1.08,
  //     },
  //   ],
  //   affinityRewards: [
  //     { threshold: 30, id: "chen_bank_30", desc: "老陈提醒你防诈骗（降低被骗风险）", effect: function(st) { st.flags.chenScamWarning = true; StateManager.addMessage("💕 老陈悄悄说：「最近骗子多，有人冒充银行工作人员打电话，你小心点。」防诈骗提示已开启。", "success"); } },
  //     { threshold: 60, id: "chen_bank_60", desc: "老陈介绍银行周边兼职（解锁银行附近临时工作）", effect: function(st) { st.flags.chenSideJob = true; StateManager.addMessage("💕 老陈说：「我认识银行对面便利店老板，缺个临时工，你要不要试试？」", "success"); } },
  //     { threshold: 80, id: "chen_bank_80", desc: "老陈帮你留意银行正式招聘信息", effect: function(st) { st.flags.chenBankInfo = true; StateManager.addMessage("❤️ 老陈说：「银行偶尔招正式员工，我帮你留意着，有消息第一时间告诉你。」", "success"); } },
  //   ],
  //   favor: {
  //     story: "老陈有些为难：「我老母亲今天住院了，我得去陪护。你能不能帮我顶半天班？就站在门口，有人进出打个招呼就行。」",
  //     choices: [
  //       { text: "💪 行，我来顶半天", apply: function(st) { st.flags._npcFavor_uncle_chen_bank = true; st.resources.cash += 50 + Random.int(0, 30); st.needs.fatigue = Math.min(100, st.needs.fatigue + 5); if (!st.relationships.uncle_chen_bank) st.relationships.uncle_chen_bank = { affinity: 0, met: true }; st.relationships.uncle_chen_bank.affinity = Math.min(100, st.relationships.uncle_chen_bank.affinity + 12); StateManager.addMessage("💪 站了半天班，没啥事，赚了¥" + (50 + Random.int(0, 30)) + "！老陈欠你一个人情。", "success"); } },
  //       { text: "😅 今天没空", apply: function(st) { st.flags._npcFavor_uncle_chen_bank = true; if (!st.relationships.uncle_chen_bank) st.relationships.uncle_chen_bank = { affinity: 0, met: true }; st.relationships.uncle_chen_bank.affinity = Math.max(-100, st.relationships.uncle_chen_bank.affinity - 3); StateManager.addMessage("😅 老陈点点头：「没事，我再想想办法。」", "info"); } },
  //     ],
  //   },
  //   deepTask: {
  //     requiredAffinity: 70,
  //     story: "老陈叹了口气：「干了这么多年保安，攒了点钱。儿子说让我退休，但我不知道能干啥……你给个建议？」",
  //     choices: [
  //       { text: "💪 退休也好，陪陪家人", hint: "好感+8", apply: function(st) { st.flags._npcDeepTask_uncle_chen_bank = true; st.relationships.uncle_chen_bank.affinity = Math.min(100, st.relationships.uncle_chen_bank.affinity + 8); StateManager.addMessage("💕 老陈点点头：「你说得对，我也该歇歇了。」", "success"); } },
  //       { text: "🤷 你自己决定", hint: "好感不变", apply: function(st) { st.flags._npcDeepTask_uncle_chen_bank = true; StateManager.addMessage("🤷 老陈点点头：「我再想想。」", "info"); } },
  //     ],
  //   },
  // },

  // ============================================================
  // === 商业区 NPC ===
  // TODO: 待实现 - 吴姐（美容院老板，参考《模拟人生》NPC）
  // {
  //   id: "sister_wu",
  //   name: "吴姐",
  //   role: "美容院老板",
  //   location: "commercialDist",
  //   birthday: 200,
  //   desc: "美容院老板娘，认识各种人，能介绍美容/时尚相关工作。",
  //   birthdayLine: "今天是我生日！你记得？哎，平时太忙了，难得有人想着我，谢谢你啊！",
  //   festivalLines: {
  //     spring_festival: "过年好！美容院初五开门，你来做个脸？给你打八折！",
  //     mid_autumn: "中秋节送月饼不如送美丽，来做个护理吧！",
  //     labor_day: "劳动节美容师也要休息，但你可以预约节后。",
  //     national_day: "黄金周美容预约爆满，提前一个月约！",
  //   },
  //   talkLines: [
  //     "女人要爱自己，定期做个护理。",
  //     "最近流行医美，你要不要试试？",
  //     "我认识几个网红，你要不要认识认识？",
  //   ],
  //   giftPrefers: ["clothing", "snacks", "luxury"],
  //   tradeInfo: {
  //     expertise: ["clothing", "luxury"],
  //     infoTypes: {
  //       price_level: { label: "服装价格水平", threshold: 30, cost: 40 },
  //       category_highest: { label: "哪买衣服最贵", threshold: 60, cost: 20 },
  //     },
  //   },
  //   presenceBonus: [
  //     {
  //       minAffinity: 30,
  //       jobs: ["beauty_salon", "nail_artist"],
  //       multiplier: 1.1,
  //     },
  //   ],
  //   affinityRewards: [
  //     { threshold: 30, id: "sister_wu_30", desc: "吴姐给你免费做护理（美容XP+30）", effect: function(st) { st.skills.beauty = st.skills.beauty || { level: 0, xp: 0 }; st.skills.beauty.xp += 30; StateManager.addMessage("💕 吴姐说'今天送你做个护理'，美容XP+30！", "success"); } },
  //     { threshold: 60, id: "sister_wu_60", desc: "吴姐介绍美容客户（美容工作收入+15%）", effect: function(st) { st.flags.wuBeautyClients = true; StateManager.addMessage("💕 吴姐说'我介绍几个客户给你'，美容工作收入+15%！", "success"); } },
  //     { threshold: 80, id: "sister_wu_80", desc: "吴姐帮你开美容院（解锁美容院工作）", effect: function(st) { st.flags.wuBeautyShop = true; StateManager.addMessage("❤️ 吴姐说'我入股，你当店长'，解锁美容院高级工作！", "success"); } },
  //   ],
  //   favor: {
  //     story: "吴姐有些为难：「最近有个大客户要办卡，但她说要认识人才给折扣……你能不能帮我牵个线？」",
  //     choices: [
  //       { text: "💁 帮你牵线（需要认识富裕NPC）", apply: function(st) { st.flags._npcFavor_sister_wu = true; st.relationships.sister_wu.affinity = Math.min(100, st.relationships.sister_wu.affinity + 12); StateManager.addMessage("💕 你牵线成功了，吴姐很开心！", "success"); } },
  //       { text: "😅 我不认识这样的人", apply: function(st) { st.flags._npcFavor_sister_wu = true; st.relationships.sister_wu.affinity = Math.max(-100, st.relationships.sister_wu.affinity - 3); StateManager.addMessage("😅 吴姐有点失望。", "info"); } },
  //     ],
  //   },
  //   deepTask: {
  //     requiredAffinity: 70,
  //     story: "吴姐叹了口气：「开了十年美容院，累了。想转行做医美，但不知道行不行……你觉得呢？」",
  //     choices: [
  //       { text: "💪 医美是趋势，值得投入", hint: "好感+8，吴姐获得转型信心", apply: function(st) { st.flags._npcDeepTask_sister_wu = true; st.relationships.sister_wu.affinity = Math.min(100, st.relationships.sister_wu.affinity + 8); st.needs.happiness = Math.min(100, st.needs.happiness + 8); StateManager.addMessage("💕 吴姐说'你说得对，我试试'。", "success"); } },
  //       { text: "⚠️ 医美风险大，先调研", hint: "好感+3，吴姐冷静下来", apply: function(st) { st.flags._npcDeepTask_sister_wu = true; st.relationships.sister_wu.affinity = Math.min(100, st.relationships.sister_wu.affinity + 3); StateManager.addMessage("⚠️ 吴姐点点头：「你说得对，我先调研一下。」", "info"); } },
  //       { text: "🤷 你自己决定", hint: "好感不变", apply: function(st) { st.flags._npcDeepTask_sister_wu = true; StateManager.addMessage("🤷 吴姐点点头：「也是，我自己想想。」", "info"); } },
  //     ],
  //   },
  // },
  // TODO: 待实现 - 阿黄（快递站长，参考《快递小哥模拟器》）
  // {
  //   id: "brother_huang",
  //   name: "阿黄",
  //   role: "快递站长",
  //   location: "commercialDist",
  //   birthday: 250,
  //   desc: "快递站点站长，管理几十个骑手，能介绍配送工作。",
  //   birthdayLine: "今天生日？巧了，我手下一个小哥也是今天生日，你们有缘！",
  //   festivalLines: {
  //     spring_festival: "过年快递不停，初一初二三倍工资，要不要来？",
  //     mid_autumn: "中秋节月饼礼盒配送爆单，你来帮忙？",
  //     labor_day: "劳动节快递最忙，一天能赚¥500！",
  //     national_day: "黄金周快递量翻倍，全员上岗！",
  //   },
  //   talkLines: [
  //     "这行干久了，腿都跑细了。",
  //     "快递这行，拼的是速度和态度。",
  //     "平台抽成越来越高，我们赚的是辛苦钱。",
  //   ],
  //   giftPrefers: ["beer", "cigarettes", "daily_use"],
  //   tradeInfo: {
  //     expertise: ["daily", "food"],
  //     infoTypes: {
  //       price_level: { label: "配送员消费水平", threshold: 30, cost: 30 },
  //       category_lowest: { label: "哪吃饭最便宜", threshold: 60, cost: 15 },
  //     },
  //   },
  //   presenceBonus: [
  //     {
  //       minAffinity: 30,
  //       jobs: ["delivery_rider", "package_delivery"],
  //       multiplier: 1.12,
  //     },
  //   ],
  //   affinityRewards: [
  //     { threshold: 30, id: "brother_huang_30", desc: "阿黄给你优先派单（配送收入+10%）", effect: function(st) { st.flags.huangPriorityOrders = true; StateManager.addMessage("💕 阿黄说'以后给你派好单'，配送收入+10%！", "success"); } },
  //     { threshold: 60, id: "brother_huang_60", desc: "阿黄借你电动车（配送效率+15%）", effect: function(st) { st.flags.huangEbike = true; StateManager.addMessage("💕 阿黄把他的备用电动车借给你！", "success"); } },
  //     { threshold: 80, id: "brother_huang_80", desc: "阿黄让你当片区站长（解锁管理岗位）", effect: function(st) { st.flags.huangStationManager = true; StateManager.addMessage("❤️ 阿黄说'这个片区交给你管'，解锁站长岗位！", "success"); } },
  //   ],
  //   favor: {
  //     story: "阿黄有些着急：「有个小哥病了，今天单太多送不完。你能不能帮我顶半天？」",
  //     choices: [
  //       { text: "🚴 帮你顶半天", apply: function(st) { st.flags._npcFavor_brother_huang = true; st.resources.cash += 80 + Random.int(0, 40); st.needs.fatigue = Math.min(100, st.needs.fatigue + 15); st.relationships.brother_huang.affinity = Math.min(100, st.relationships.brother_huang.affinity + 12); StateManager.addMessage("🚴 送了30单，赚了¥" + (80 + Random.int(0, 40)) + "！", "success"); } },
  //       { text: "😅 今天没空", apply: function(st) { st.flags._npcFavor_brother_huang = true; st.relationships.brother_huang.affinity = Math.max(-100, st.relationships.brother_huang.affinity - 3); StateManager.addMessage("😅 阿黄叹了口气。", "info"); } },
  //     ],
  //   },
  //   deepTask: {
  //     requiredAffinity: 70,
  //     story: "阿黄点了根烟：「干了五年站长，累得要死。平台越来越抠，小哥越来越难管……我在想，要不要转行。」",
  //     choices: [
  //       { text: "💪 转行做什么？", hint: "好感+5，阿黄分享想法", apply: function(st) { st.flags._npcDeepTask_brother_huang = true; st.relationships.brother_huang.affinity = Math.min(100, st.relationships.brother_huang.affinity + 5); StateManager.addMessage("💕 阿黄说'我想开个便利店'。", "info"); } },
  //       { text: "⚠️ 现在转行风险大", hint: "好感+3", apply: function(st) { st.flags._npcDeepTask_brother_huang = true; st.relationships.brother_huang.affinity = Math.min(100, st.relationships.brother_huang.affinity + 3); StateManager.addMessage("⚠️ 阿黄点点头：「你说得对，我再想想。」", "info"); } },
  //       { text: "🤷 你自己决定", hint: "好感不变", apply: function(st) { st.flags._npcDeepTask_brother_huang = true; StateManager.addMessage("🤷 阿黄叹了口气：「也是。」", "info"); } },
  //     ],
  //   },
  // },
  //
  // === 批发市场/工业区 NPC ===
  // TODO: 待实现 - 林阿姨（菜市场摊主，参考《菜市场模拟器》）
  // {
  //   id: "auntie_lin",
  //   name: "林阿姨",
  //   role: "菜市场摊主",
  //   location: "wholesaleMarket",
  //   birthday: 150,
  //   desc: "菜市场卖菜的老摊主，知道食材价格门道，能介绍餐饮工作。",
  //   birthdayLine: "今天是我生日？哎呀，我都不记得了。来来，送你一把青菜！",
  //   festivalLines: {
  //     spring_festival: "过年菜价贵，但我家菜新鲜，你来买点？",
  //     mid_autumn: "中秋节家里做月饼，要不要买点鲜肉？",
  //     dragon_boat: "端午节粽子叶我这里有，新鲜的！",
  //     labor_day: "劳动节菜场最忙，我从天不亮就起来了。",
  //   },
  //   talkLines: [
  //     "今天的青菜特别新鲜，刚从地里摘的。",
  //     "猪肉价格又涨了，猪周期来了。",
  //     "我在这卖了二十年菜，什么价没见过？",
  //   ],
  //   giftPrefers: ["fruits", "daily_use", "snacks"],
  //   tradeInfo: {
  //     expertise: ["food", "vegetables"],
  //     infoTypes: {
  //       price_level: { label: "菜市场价格水平", threshold: 30, cost: 20 },
  //       category_lowest: { label: "哪买菜最便宜", threshold: 60, cost: 10 },
  //     },
  //   },
  //   presenceBonus: [
  //     {
  //       minAffinity: 30,
  //       jobs: ["street_vending_food", "food_stall"],
  //       multiplier: 1.08,
  //     },
  //   ],
  //   affinityRewards: [
  //     { threshold: 30, id: "auntie_lin_30", desc: "林阿姨给你便宜菜（食材价格-10%）", effect: function(st) { st.flags.linCheapVeg = true; StateManager.addMessage("💕 林阿姨说'来我这买菜便宜点'，食材价格-10%！", "success"); } },
  //     { threshold: 60, id: "auntie_lin_60", desc: "林阿姨教你挑菜（食材质量判断）", effect: function(st) { st.flags.linVegTips = true; StateManager.addMessage("💕 林阿姨教你怎么挑新鲜菜！", "success"); } },
  //     { threshold: 80, id: "auntie_lin_80", desc: "林阿姨让你帮卖菜（解锁菜摊工作）", effect: function(st) { st.flags.linVegStand = true; StateManager.addMessage("❤️ 林阿姨说'帮我看看摊子'，解锁菜摊工作！", "success"); } },
  //   ],
  //   favor: {
  //     story: "林阿姨有些为难：「今天腰疼得厉害，能不能帮我照看半天摊子？」",
  //     choices: [
  //       { text: "💁 帮你照看摊子", apply: function(st) { st.flags._npcFavor_auntie_lin = true; st.resources.cash += 50 + Random.int(0, 30); st.relationships.auntie_lin.affinity = Math.min(100, st.relationships.auntie_lin.affinity + 12); StateManager.addMessage("💁 卖了¥" + (50 + Random.int(0, 30)) + "，林阿姨给你分成！", "success"); } },
  //       { text: "😅 今天没空", apply: function(st) { st.flags._npcFavor_auntie_lin = true; st.relationships.auntie_lin.affinity = Math.max(-100, st.relationships.auntie_lin.affinity - 3); StateManager.addMessage("😅 林阿姨点点头：「没事。」", "info"); } },
  //     ],
  //   },
  //   deepTask: {
  //     requiredAffinity: 70,
  //     story: "林阿姨叹了口气：「卖了二十年菜，腰也弯了，眼睛也花了。儿子说让我退休，但我不舍得这个摊子……」",
  //     choices: [
  //       { text: "💪 退休也好，享享福", hint: "好感+5", apply: function(st) { st.flags._npcDeepTask_auntie_lin = true; st.relationships.auntie_lin.affinity = Math.min(100, st.relationships.auntie_lin.affinity + 5); StateManager.addMessage("💕 林阿姨说「你说得对，我也该歇歇了。」", "info"); } },
  //       { text: "💰 可以传给儿子", hint: "好感+3", apply: function(st) { st.flags._npcDeepTask_auntie_lin = true; st.relationships.auntie_lin.affinity = Math.min(100, st.relationships.auntie_lin.affinity + 3); StateManager.addMessage("💰 林阿姨说「儿子不愿意干这个……」", "info"); } },
  //       { text: "🤷 你自己决定", hint: "好感不变", apply: function(st) { st.flags._npcDeepTask_auntie_lin = true; StateManager.addMessage("🤷 林阿姨点点头：「我再想想。」", "info"); } },
  //     ],
  //   },
  // },
  // TODO: 待实现 - 赵师傅（修车师傅，参考《修车模拟器》）
  // {
  //   id: "master_zhao",
  //   name: "赵师傅",
  //   role: "修车师傅",
  //   location: "factoryZone",
  //   birthday: 280,
  //   desc: "修车铺老板，懂机械维修，能介绍维修/驾驶相关工作。",
  //   birthdayLine: "今天生日？难得！来，给你免费检查下车子！",
  //   festivalLines: {
  //     spring_festival: "过年修车不停，初一初二加急费翻倍！",
  //     mid_autumn: "中秋节回家路上车子坏了？找我！",
  //     labor_day: "劳动节路上车多，修车排长队！",
  //     national_day: "黄金周自驾游多，我24小时待命！",
  //   },
  //   talkLines: [
  //     "车子就像人，定期保养不出问题。",
  //     "现在新能源车多了，修车也得学新东西。",
  //     "我干了二十年修车，什么车没见过？",
  //   ],
  //   giftPrefers: ["beer", "cigarettes", "daily_use"],
  //   tradeInfo: {
  //     expertise: ["electronics", "daily"],
  //     infoTypes: {
  //       price_level: { label: "汽配价格水平", threshold: 30, cost: 30 },
  //       category_highest: { label: "哪买配件最贵", threshold: 60, cost: 15 },
  //     },
  //   },
  //   presenceBonus: [
  //     {
  //       minAffinity: 30,
  //       jobs: ["repair_service", "auto_repair"],
  //       multiplier: 1.1,
  //     },
  //   ],
  //   affinityRewards: [
  //     { threshold: 30, id: "master_zhao_30", desc: "赵师傅免费帮你修车（节省修车费）", effect: function(st) { st.flags.zhaoFreeRepair = true; StateManager.addMessage("💕 赵师傅说'帮你免费看看'，省了修车费！", "success"); } },
  //     { threshold: 60, id: "master_zhao_60", desc: "赵师傅教你修车（维修XP+50）", effect: function(st) { st.skills.repair = st.skills.repair || { level: 0, xp: 0 }; st.skills.repair.xp += 50; StateManager.addMessage("💕 赵师傅手把手教你修车，维修XP+50！", "success"); } },
  //     { threshold: 80, id: "master_zhao_80", desc: "赵师傅让你当学徒（解锁汽修工作）", effect: function(st) { st.flags.zhaoApprentice = true; StateManager.addMessage("❤️ 赵师傅说'跟我学修车吧'，解锁汽修工作！", "success"); } },
  //   ],
  //   favor: {
  //     story: "赵师傅擦了擦手：「今天活多，一个人忙不过来。你能不能帮我打下手？」",
  //     choices: [
  //       { text: "🔧 帮你打下手", apply: function(st) { st.flags._npcFavor_master_zhao = true; st.resources.cash += 60 + Random.int(0, 40); st.skills.repair = st.skills.repair || { level: 0, xp: 0 }; st.skills.repair.xp += 20; st.relationships.master_zhao.affinity = Math.min(100, st.relationships.master_zhao.affinity + 12); StateManager.addMessage("🔧 干了半天，赚了¥" + (60 + Random.int(0, 40)) + "，维修XP+20！", "success"); } },
  //       { text: "😅 今天没空", apply: function(st) { st.flags._npcFavor_master_zhao = true; st.relationships.master_zhao.affinity = Math.max(-100, st.relationships.master_zhao.affinity - 3); StateManager.addMessage("😅 赵师傅点点头：「没事。」", "info"); } },
  //     ],
  //   },
  //   deepTask: {
  //     requiredAffinity: 70,
  //     story: "赵师傅点了根烟：「干了二十年修车，腰也弯了。儿子说让我退休，但我不舍得这个铺子……」",
  //     choices: [
  //       { text: "💪 退休也好，享享福", hint: "好感+5", apply: function(st) { st.flags._npcDeepTask_master_zhao = true; st.relationships.master_zhao.affinity = Math.min(100, st.relationships.master_zhao.affinity + 5); StateManager.addMessage("💕 赵师傅说「你说得对，我也该歇歇了。」", "info"); } },
  //       { text: "💰 可以传给儿子", hint: "好感+3", apply: function(st) { st.flags._npcDeepTask_master_zhao = true; st.relationships.master_zhao.affinity = Math.min(100, st.relationships.master_zhao.affinity + 3); StateManager.addMessage("💰 赵师傅说「儿子不愿意干这个……」", "info"); } },
  //       { text: "🤷 你自己决定", hint: "好感不变", apply: function(st) { st.flags._npcDeepTask_master_zhao = true; StateManager.addMessage("🤷 赵师傅点点头：「我再想想。」", "info"); } },
  //     ],
  //   },
  // },
  //
  // === 科技园/商业区 NPC ===
  // TODO: 待实现 - 小丽（网红/主播，参考《网红模拟器》）
  // {
  //   id: "xiaoli",
  //   name: "小丽",
  //   role: "网红/主播",
  //   location: "techPark",
  //   birthday: 300,
  //   desc: "短视频主播，粉丝几万，能介绍内容创作/直播相关工作。",
  //   birthdayLine: "哇你居然记得我生日！你是我的铁粉吗？爱你！",
  //   festivalLines: {
  //     spring_festival: "过年直播七天，粉丝福利大放送！",
  //     mid_autumn: "中秋节直播赏月，来我直播间！",
  //     labor_day: "劳动节出去旅游直播，粉丝点我！",
  //     national_day: "黄金周直播vlog，关注不迷路！",
  //   },
  //   talkLines: [
  //     "今天直播数据不错，涨粉500！",
  //     "平台抽成太高，我想自己建站。",
  //     "网红这行吃青春饭，我得想后路。",
  //   ],
  //   giftPrefers: ["clothing", "electronics", "luxury"],
  //   tradeInfo: {
  //     expertise: ["electronics", "luxury"],
  //     infoTypes: {
  //       price_level: { label: "网红消费水平", threshold: 30, cost: 50 },
  //       category_highest: { label: "哪买化妆品最贵", threshold: 60, cost: 20 },
  //     },
  //   },
  //   presenceBonus: [
  //     {
  //       minAffinity: 30,
  //       jobs: ["content_writing", "streamer"],
  //       multiplier: 1.1,
  //     },
  //   ],
  //   affinityRewards: [
  //     { threshold: 30, id: "xiaoli_30", desc: "小丽推荐你做直播助理（解锁直播工作）", effect: function(st) { st.flags.xiaoliAssistant = true; StateManager.addMessage("💕 小丽说'你来帮我吧'，解锁直播助理工作！", "success"); } },
  //     { threshold: 60, id: "xiaoli_60", desc: "小丽教你做内容（内容创作XP+50）", effect: function(st) { st.skills.content = st.skills.content || { level: 0, xp: 0 }; st.skills.content.xp += 50; StateManager.addMessage("💕 小丽教你怎么做内容，内容创作XP+50！", "success"); } },
  //     { threshold: 80, id: "xiaoli_80", desc: "小丽让你开小号（解锁主播工作）", effect: function(st) { st.flags.xiaoliOwnAccount = true; StateManager.addMessage("❤️ 小丽说'我帮你开个号'，解锁主播工作！", "success"); } },
  //   ],
  //   favor: {
  //     story: "小丽有些着急：「今天直播设备坏了，你能不能帮我修一下？」",
  //     choices: [
  //       { text: "🔧 帮你修设备", apply: function(st) { st.flags._npcFavor_xiaoli = true; st.resources.cash += 100 + Random.int(0, 50); st.relationships.xiaoli.affinity = Math.min(100, st.relationships.xiaoli.affinity + 12); StateManager.addMessage("🔧 修好了，小丽给你¥" + (100 + Random.int(0, 50)) + "！", "success"); } },
  //       { text: "😅 我不会这个", apply: function(st) { st.flags._npcFavor_xiaoli = true; st.relationships.xiaoli.affinity = Math.max(-100, st.relationships.xiaoli.affinity - 3); StateManager.addMessage("😅 小丽失望地点点头。", "info"); } },
  //     ],
  //   },
  //   deepTask: {
  //     requiredAffinity: 70,
  //     story: "小丽有些疲惫：「做了三年主播，粉丝十万，但身体累垮了。我在想，要不要转行……」",
  //     choices: [
  //       { text: "💪 转行做什么？", hint: "好感+5", apply: function(st) { st.flags._npcDeepTask_xiaoli = true; st.relationships.xiaoli.affinity = Math.min(100, st.relationships.xiaoli.affinity + 5); StateManager.addMessage("💕 小丽说「我想做美妆博主。」", "info"); } },
  //       { text: "⚠️ 先养好身体", hint: "好感+3", apply: function(st) { st.flags._npcDeepTask_xiaoli = true; st.relationships.xiaoli.affinity = Math.min(100, st.relationships.xiaoli.affinity + 3); StateManager.addMessage("⚠️ 小丽点点头：「你说得对。」", "info"); } },
  //       { text: "🤷 你自己决定", hint: "好感不变", apply: function(st) { st.flags._npcDeepTask_xiaoli = true; StateManager.addMessage("🤷 小丽叹了口气：「我再想想。」", "info"); } },
  //     ],
  //   },
  // },
  //
  // === 医院/服务类 NPC ===
  // TODO: 待实现 - 王医生（医院医生，参考真实医患关系）
  // {
  //   id: "dr_wang",
  //   name: "王医生",
  //   role: "医院医生",
  //   location: "hospital",
  //   birthday: 120,
  //   desc: "医院内科医生，工作辛苦但收入稳定。能给你健康建议。",
  //   birthdayLine: "今天生日？难得有人记得。送你一句：健康最重要。",
  //   festivalLines: {
  //     spring_festival: "过年医院最忙，急诊人爆满。",
  //     mid_autumn: "中秋节医院也不休息，病人不会放假。",
  //     labor_day: "劳动节我值班，病人不会因为你放假就不生病。",
  //     national_day: "黄金周急诊最多，喝酒吃坏肚子的全是。",
  //   },
  //   talkLines: [
  //     "健康是革命的本钱，别透支。",
  //     "现在年轻人亚健康太普遍了。",
  //     "我干了二十年医生，见多了。",
  //   ],
  //   giftPrefers: ["fruits", "daily_use"],
  //   tradeInfo: {
  //     expertise: ["daily", "food"],
  //     infoTypes: {
  //       price_level: { label: "医疗价格水平", threshold: 30, cost: 40 },
  //       category_lowest: { label: "哪看病最便宜", threshold: 60, cost: 20 },
  //     },
  //   },
  //   presenceBonus: [
  //     {
  //       minAffinity: 30,
  //       jobs: ["hospital_caregiver"],
  //       multiplier: 1.1,
  //     },
  //   ],
  //   affinityRewards: [
  //     { threshold: 30, id: "dr_wang_30", desc: "王医生给你健康建议（生病概率-5%）", effect: function(st) { st.flags.wangHealthTips = true; StateManager.addMessage("💕 王医生给你一些健康建议，生病概率-5%！", "success"); } },
  //     { threshold: 60, id: "dr_wang_60", desc: "王医生给你优先挂号（医院AP-2）", effect: function(st) { st.flags.wangPriority = true; StateManager.addMessage("💕 王医生说'找我直接进'，医院AP-2！", "success"); } },
  //     { threshold: 80, id: "dr_wang_80", desc: "王医生给你免费体检（健康检查）", effect: function(st) { st.flags.wangFreeCheckup = true; StateManager.addMessage("❤️ 王医生说'给你做个全面检查'，免费体检！", "success"); } },
  //   ],
  //   favor: {
  //     story: "王医生有些疲惫：「今天连续看了30个病人，累死了。你能不能帮我倒杯咖啡？」",
  //     choices: [
  //       { text: "☕ 帮你买咖啡", apply: function(st) { st.flags._npcFavor_dr_wang = true; st.resources.cash -= 15; st.relationships.dr_wang.affinity = Math.min(100, st.relationships.dr_wang.affinity + 8); StateManager.addMessage("☕ 王医生喝了咖啡，精神好多了！", "success"); } },
  //       { text: "😅 我没带钱", apply: function(st) { st.flags._npcFavor_dr_wang = true; st.relationships.dr_wang.affinity = Math.max(-100, st.relationships.dr_wang.affinity - 2); StateManager.addMessage("😅 王医生点点头：「没事。」", "info"); } },
  //     ],
  //   },
  //   deepTask: {
  //     requiredAffinity: 70,
  //     story: "王医生叹了口气：「干了二十年医生，见多了生死。有时候觉得，自己也在消耗生命……」",
  //     choices: [
  //       { text: "💪 你是救死扶伤的英雄", hint: "好感+8", apply: function(st) { st.flags._npcDeepTask_dr_wang = true; st.relationships.dr_wang.affinity = Math.min(100, st.relationships.dr_wang.affinity + 8); st.needs.happiness = Math.min(100, st.needs.happiness + 10); StateManager.addMessage("💕 王医生笑了笑：「谢谢你。」", "success"); } },
  //       { text: "⚠️ 注意休息", hint: "好感+5", apply: function(st) { st.flags._npcDeepTask_dr_wang = true; st.relationships.dr_wang.affinity = Math.min(100, st.relationships.dr_wang.affinity + 5); StateManager.addMessage("⚠️ 王医生点点头：「我会注意的。」", "info"); } },
  //       { text: "🤷 你自己决定", hint: "好感不变", apply: function(st) { st.flags._npcDeepTask_dr_wang = true; StateManager.addMessage("🤷 王医生点点头：「我再想想。」", "info"); } },
  //     ],
  //   },
  // },
  //
  // === 其他特色 NPC ===
  // TODO: 待实现 - 老张（拾荒者，参考真实拾荒者生活）
  // {
  //   id: "old_zhang",
  //   name: "老张",
  //   role: "拾荒者",
  //   location: "slum",
  //   birthday: 200,
  //   desc: "在城中村拾荒的老人，知道很多城中村的秘密。",
  //   // ... 完整配置
  // },
  // TODO: 待实现 - 小陈（外卖骑手，参考真实外卖骑手生活）
  // {
  //   id: "xiaochen",
  //   name: "小陈",
  //   role: "外卖骑手",
  //   location: "commercialDist",
  //   birthday: 180,
  //   desc: "年轻的外卖骑手，每天跑几十单。能介绍配送工作。",
  //   // ... 完整配置
  // },
  // TODO: 待实现 - 李姐（保洁阿姨，参考真实保洁阿姨生活）
  // {
  //   id: "sister_li",
  //   name: "李姐",
  //   role: "保洁阿姨",
  //   location: "commercialDist",
  //   birthday: 150,
  //   desc: "在商业区做保洁的阿姨，认识很多公司。",
  //   // ... 完整配置
  // },
  // TODO: 待实现 - 大刘（保安，参考真实保安生活）
  // {
  //   id: "da_liu",
  //   name: "大刘",
  //   role: "保安",
  //   location: "factoryZone",
  //   birthday: 200,
  //   desc: "工厂保安，工作轻松但工资不高。",
  //   // ... 完整配置
  // },
  // ============================================================
  // 批发市场 NPC（行业代表 — 林阿姨）
  // ============================================================
  {
    id: "auntie_lin",
    name: "林阿姨",
    role: "菜市场摊主",
    avatar: "images/avatars/auntie_lin.png",
    location: "wholesaleMarket",
    birthday: 150,
    desc: "菜市场卖菜的老摊主，知道食材价格门道，能介绍餐饮工作。",
    birthdayLine: "今天是我生日？哎呀，我都不记得了。来来，送你一把青菜！",
    festivalLines: {
      spring_festival: "过年菜价贵，但我家菜新鲜，你来买点？",
      mid_autumn: "中秋节家里做月饼，要不要买点鲜肉？",
      dragon_boat: "端午节粽子叶我这里有，新鲜的！",
      labor_day: "劳动节菜场最忙，我从天不亮就起来了。",
    },
    talkLines: [
      "今天的青菜特别新鲜，刚从地里摘的。",
      "猪肉价格又涨了，猪周期来了。",
      "我在这卖了二十年菜，什么价没见过？",
    ],
    // 新加：在场概率（固定位置NPC）
    presenceChance: 0.85,
    // 新加：地点触发专用对话
    encounterLines: [
      "林阿姨正在摆菜，嫩绿的青菜码得整整齐齐。",
      "林阿姨在称重，抽空抬头问了句「要点什么？」",
      "林阿姨边算账边跟隔壁摊聊天，看到你来了笑着招手。",
    ],
    // 新加：信息线索
    infoHints: {
      giftHint: "林阿姨收摊时拎了袋水果回家，说家里孩子爱吃。",
      birthdayHint: "林阿姨今天收摊比往常早，笑着说过节去。",
    },
    giftPrefers: ["fruits", "daily_use", "snacks"],
    // v3.6 P0-1: 关系网系统字段
    locationPreference: {
      wholesaleMarket: 0.7,
      commercialDist: 0.2,
      slum: 0.1,
    },
    relationshipWeight: {
      neighbor: 1.0,
    },
    interactionHistory: [],
    tradeInfo: {
      expertise: ["food", "vegetables"],
      infoTypes: {
        price_level: { label: "菜市场价格水平", threshold: 30, cost: 20 },
        category_lowest: { label: "哪买菜最便宜", threshold: 60, cost: 10 },
      },
    },
    presenceBonus: [
      {
        minAffinity: 30,
        jobs: ["wholesale_delivery"],
        multiplier: 1.08,
      },
    ],
    affinityRewards: [
      {
        threshold: 30,
        id: "auntie_lin_30",
        desc: "林阿姨给你便宜菜（食材价格-10%）",
        effect: function (st) {
          st.flags.linCheapVeg = true;
          StateManager.addMessage(
            "💕 林阿姨说'来我这买菜便宜点'，食材价格-10%！",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "auntie_lin_60",
        desc: "林阿姨教你挑菜（食材质量判断）",
        effect: function (st) {
          st.flags.linVegTips = true;
          StateManager.addMessage("💕 林阿姨教你怎么挑新鲜菜！", "success");
        },
      },
      {
        threshold: 80,
        id: "auntie_lin_80",
        desc: "林阿姨让你帮卖菜（解锁菜摊工作）",
        effect: function (st) {
          st.flags.linVegStand = true;
          StateManager.addMessage(
            "❤️ 林阿姨说'帮我看看摊子'，解锁菜摊工作！",
            "success",
          );
        },
      },
    ],
    favor: {
      story: "林阿姨有些为难：「今天腰疼得厉害，能不能帮我照看半天摊子？」",
      choices: [
        {
          text: "💁 帮你照看摊子",
          apply: function (st) {
            st.flags._npcFavor_auntie_lin = true;
            st.resources.cash += 50 + Random.int(0, 30);
            st.relationships.auntie_lin.affinity = Math.min(
              100,
              st.relationships.auntie_lin.affinity + 12,
            );
            StateManager.addMessage(
              "💁 卖了¥" + (50 + Random.int(0, 30)) + "，林阿姨给你分成！",
              "success",
            );
          },
        },
        {
          text: "😅 今天没空",
          apply: function (st) {
            st.flags._npcFavor_auntie_lin = true;
            st.relationships.auntie_lin.affinity = Math.max(
              -100,
              st.relationships.auntie_lin.affinity - 3,
            );
            StateManager.addMessage("😅 林阿姨点点头：「没事。」", "info");
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 70,
      story:
        "林阿姨叹了口气：「卖了二十年菜，腰也弯了，眼睛也花了。儿子说让我退休，但我不舍得这个摊子……」",
      choices: [
        {
          text: "💪 退休也好，享享福",
          hint: "好感+5",
          apply: function (st) {
            st.relationships.auntie_lin.affinity = Math.min(
              100,
              st.relationships.auntie_lin.affinity + 5,
            );
            StateManager.addMessage(
              "💕 林阿姨说「你说得对，我也该歇歇了。」",
              "info",
            );
          },
        },
        {
          text: "💰 可以传给儿子",
          hint: "好感+3",
          apply: function (st) {
            st.relationships.auntie_lin.affinity = Math.min(
              100,
              st.relationships.auntie_lin.affinity + 3,
            );
            StateManager.addMessage(
              "💰 林阿姨说「儿子不愿意干这个……」",
              "info",
            );
          },
        },
        {
          text: "🤷 你自己决定",
          hint: "好感不变",
          apply: function (st) {
            st.relationships.auntie_lin.affinity = Math.min(
              100,
              st.relationships.auntie_lin.affinity + 0,
            );
            StateManager.addMessage("🤷 林阿姨点点头：「我再想想。」", "info");
          },
        },
      ],
    },
  },
  // ============================================================
  // 工业区 NPC（行业代表 — 赵师傅）
  // ============================================================
  {
    id: "master_zhao",
    name: "赵师傅",
    role: "修车师傅",
    avatar: "images/avatars/master_zhao.png",
    location: "factoryZone",
    birthday: 280,
    desc: "修车铺老板，懂机械维修，能介绍维修/驾驶相关工作。",
    birthdayLine: "今天生日？难得！来，给你免费检查下车子！",
    festivalLines: {
      spring_festival: "过年修车不停，初一初二加急费翻倍！",
      mid_autumn: "中秋节回家路上车子坏了？找我！",
      labor_day: "劳动节路上车多，修车排长队！",
      national_day: "黄金周自驾游多，我24小时待命！",
    },
    talkLines: [
      "车子就像人，定期保养不出问题。",
      "现在新能源车多了，修车也得学新东西。",
      "我干了二十年修车，什么车没见过？",
    ],
    // 新加：在场概率（固定位置NPC）
    presenceChance: 0.85,
    // v3.1 ⑥：社会比较心理抓手（月薪，用于关系卡收入对比行）
    monthlyIncome: 12000,
    // 新加：地点触发专用对话
    encounterLines: [
      "赵师傅趴在车底下，只露出一双沾满油污的鞋子。",
      "赵师傅擦着手上的机油，站起来伸了个懒腰。",
      "赵师傅对着发动机皱眉，一手拿着扳手琢磨。",
    ],
    // 新加：信息线索
    infoHints: {
      giftHint:
        "赵师傅干完活从工具箱下面摸出一瓶啤酒，用满是油污的手撬开瓶盖。",
      birthdayHint: "赵师傅今天没开门，门上贴着「今日休息，家有喜事」的纸条。",
    },
    giftPrefers: ["beer", "cigarettes", "daily_use"],
    // v3.6 P0-1: 关系网系统字段
    locationPreference: {
      factoryZone: 0.75,
      commercialDist: 0.15,
      suburb: 0.1,
    },
    relationshipWeight: {
      neighbor: 0.9,
    },
    interactionHistory: [],
    tradeInfo: {
      expertise: ["electronics", "daily"],
      infoTypes: {
        price_level: { label: "汽配价格水平", threshold: 30, cost: 30 },
        category_highest: { label: "哪买配件最贵", threshold: 60, cost: 15 },
      },
    },
    presenceBonus: [
      {
        minAffinity: 30,
        jobs: ["factory_overtime"],
        multiplier: 1.1,
      },
    ],
    affinityRewards: [
      {
        threshold: 30,
        id: "master_zhao_30",
        desc: "赵师傅免费帮你修车（节省修车费）",
        effect: function (st) {
          st.flags.zhaoFreeRepair = true;
          StateManager.addMessage(
            "💕 赵师傅说'帮你免费看看'，省了修车费！",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "master_zhao_60",
        desc: "赵师傅教你修车（维修XP+50）",
        effect: function (st) {
          st.skills.repair = st.skills.repair || { level: 0, xp: 0 };
          st.skills.repair.xp += 50;
          StateManager.addMessage(
            "💕 赵师傅手把手教你修车，维修XP+50！",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "master_zhao_80",
        desc: "赵师傅让你当学徒（解锁汽修工作）",
        effect: function (st) {
          st.flags.zhaoApprentice = true;
          StateManager.addMessage(
            "❤️ 赵师傅说'跟我学修车吧'，解锁汽修工作！",
            "success",
          );
        },
      },
    ],
    favor: {
      story:
        "赵师傅擦了擦手：「今天活多，一个人忙不过来。你能不能帮我打下手？」",
      choices: [
        {
          text: "🔧 帮你打下手",
          apply: function (st) {
            st.flags._npcFavor_master_zhao = true;
            st.resources.cash += 60 + Random.int(0, 40);
            st.skills.repair = st.skills.repair || { level: 0, xp: 0 };
            st.skills.repair.xp += 20;
            st.relationships.master_zhao.affinity = Math.min(
              100,
              st.relationships.master_zhao.affinity + 12,
            );
            StateManager.addMessage(
              "🔧 干了半天，赚了¥" + (60 + Random.int(0, 40)) + "，维修XP+20！",
              "success",
            );
          },
        },
        {
          text: "😅 今天没空",
          apply: function (st) {
            st.flags._npcFavor_master_zhao = true;
            st.relationships.master_zhao.affinity = Math.max(
              -100,
              st.relationships.master_zhao.affinity - 3,
            );
            StateManager.addMessage("😅 赵师傅点点头：「没事。」", "info");
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 70,
      story:
        "赵师傅点了根烟：「干了二十年修车，腰也弯了。儿子说让我退休，但我不舍得这个铺子……」",
      choices: [
        {
          text: "💪 退休也好，享享福",
          hint: "好感+5",
          apply: function (st) {
            st.relationships.master_zhao.affinity = Math.min(
              100,
              st.relationships.master_zhao.affinity + 5,
            );
            StateManager.addMessage(
              "💕 赵师傅说「你说得对，我也该歇歇了。」",
              "info",
            );
          },
        },
        {
          text: "💰 可以传给儿子",
          hint: "好感+3",
          apply: function (st) {
            st.relationships.master_zhao.affinity = Math.min(
              100,
              st.relationships.master_zhao.affinity + 3,
            );
            StateManager.addMessage(
              "💰 赵师傅说「儿子不愿意干这个……」",
              "info",
            );
          },
        },
        {
          text: "🤷 你自己决定",
          hint: "好感不变",
          apply: function (st) {
            StateManager.addMessage("🤷 赵师傅点点头：「我再想想。」", "info");
          },
        },
      ],
    },
  },
  // ============================================================
  // 科技园 NPC（行业代表 — 小丽）
  // ============================================================
  {
    id: "xiaoli",
    name: "小丽",
    role: "网红/主播",
    avatar: "images/avatars/xiaoli.png",
    location: "techPark",
    birthday: 300,
    desc: "短视频主播，粉丝几万，能介绍内容创作/直播相关工作。",
    birthdayLine: "哇你居然记得我生日！你是我的铁粉吗？爱你！",
    festivalLines: {
      spring_festival: "过年直播七天，粉丝福利大放送！",
      mid_autumn: "中秋节直播赏月，来我直播间！",
      labor_day: "劳动节出去旅游直播，粉丝点我！",
      national_day: "黄金周直播vlog，关注不迷路！",
    },
    talkLines: [
      "今天直播数据不错，涨粉500！",
      "平台抽成太高，我想自己建站。",
      "网红这行吃青春饭，我得想后路。",
    ],
    // 新加：在场概率（流动性高的NPC）
    presenceChance: 0.65,
    // 新加：地点触发专用对话
    encounterLines: [
      "小丽在草坪上对着手机自拍，看到你挥了挥手。",
      "小丽刚结束直播，靠在椅子上刷着弹幕。",
      "小丽在咖啡厅写拍摄脚本，旁边放着三台设备。",
    ],
    // 新加：信息线索
    infoHints: {
      giftHint: "小丽拆开一个快递，是一件新衣服，对着镜头比划说「今天开箱！」",
      birthdayHint: "小丽今天直播间特别热闹，说在抽奖庆祝。",
    },
    giftPrefers: ["clothing", "electronics", "luxury"],
    // v3.6 P0-1: 关系网系统字段
    locationPreference: {
      techPark: 0.5,
      commercialDist: 0.35,
      entertainment: 0.15,
    },
    relationshipWeight: {
      mentor: 0.8,
    },
    interactionHistory: [],
    tradeInfo: {
      expertise: ["electronics", "luxury"],
      infoTypes: {
        price_level: { label: "网红消费水平", threshold: 30, cost: 50 },
        category_highest: { label: "哪买化妆品最贵", threshold: 60, cost: 20 },
      },
    },
    presenceBonus: [
      {
        minAffinity: 30,
        jobs: ["content_writing"],
        multiplier: 1.1,
      },
    ],
    affinityRewards: [
      {
        threshold: 30,
        id: "xiaoli_30",
        desc: "小丽推荐你做直播助理",
        effect: function (st) {
          st.flags.xiaoliAssistant = true;
          StateManager.addMessage(
            "💕 小丽说'你来帮我吧'，解锁直播助理工作！",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "xiaoli_60",
        desc: "小丽教你做内容（内容创作XP+50）",
        effect: function (st) {
          st.skills.content = st.skills.content || { level: 0, xp: 0 };
          st.skills.content.xp += 50;
          StateManager.addMessage(
            "💕 小丽教你怎么做内容，内容创作XP+50！",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "xiaoli_80",
        desc: "小丽让你开小号（解锁主播工作）",
        effect: function (st) {
          st.flags.xiaoliOwnAccount = true;
          StateManager.addMessage(
            "❤️ 小丽说'我帮你开个号'，解锁主播工作！",
            "success",
          );
        },
      },
    ],
    favor: {
      story: "小丽有些着急：「今天直播设备坏了，你能不能帮我修一下？」",
      choices: [
        {
          text: "🔧 帮你修设备",
          apply: function (st) {
            st.flags._npcFavor_xiaoli = true;
            st.resources.cash += 100 + Random.int(0, 50);
            st.relationships.xiaoli.affinity = Math.min(
              100,
              st.relationships.xiaoli.affinity + 12,
            );
            StateManager.addMessage(
              "🔧 修好了，小丽给你¥" + (100 + Random.int(0, 50)) + "！",
              "success",
            );
          },
        },
        {
          text: "😅 我不会这个",
          apply: function (st) {
            st.flags._npcFavor_xiaoli = true;
            st.relationships.xiaoli.affinity = Math.max(
              -100,
              st.relationships.xiaoli.affinity - 3,
            );
            StateManager.addMessage("😅 小丽失望地点点头。", "info");
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 70,
      story:
        "小丽有些疲惫：「做了三年主播，粉丝十万，但身体累垮了。我在想，要不要转行……」",
      choices: [
        {
          text: "💪 转行做什么？",
          hint: "好感+5",
          apply: function (st) {
            st.relationships.xiaoli.affinity = Math.min(
              100,
              st.relationships.xiaoli.affinity + 5,
            );
            StateManager.addMessage("💕 小丽说「我想做美妆博主。」", "info");
          },
        },
        {
          text: "⚠️ 先养好身体",
          hint: "好感+3",
          apply: function (st) {
            st.relationships.xiaoli.affinity = Math.min(
              100,
              st.relationships.xiaoli.affinity + 3,
            );
            StateManager.addMessage("⚠️ 小丽点点头：「你说得对。」", "info");
          },
        },
        {
          text: "🤷 你自己决定",
          hint: "好感不变",
          apply: function (st) {
            StateManager.addMessage("🤷 小丽叹了口气：「我再想想。」", "info");
          },
        },
      ],
    },
  },
  // ============================================================
  // 医院 NPC（行业代表 — 王医生）
  // ============================================================
  {
    id: "dr_wang",
    name: "王医生",
    role: "医院医生",
    avatar: "images/avatars/dr_wang.png",
    location: "hospital",
    birthday: 120,
    desc: "医院内科医生，工作辛苦但收入稳定。能给你健康建议。",
    birthdayLine: "今天生日？难得有人记得。送你一句：健康最重要。",
    festivalLines: {
      spring_festival: "过年医院最忙，急诊人爆满。",
      mid_autumn: "中秋节医院也不休息，病人不会放假。",
      labor_day: "劳动节我值班，病人不会因为你放假就不生病。",
      national_day: "黄金周急诊最多，喝酒吃坏肚子的全是。",
    },
    talkLines: [
      "健康是革命的本钱，别透支。",
      "现在年轻人亚健康太普遍了。",
      "我干了二十年医生，见多了。",
    ],
    // 新加：在场概率（固定位置NPC）
    presenceChance: 0.8,
    // v3.1 ⑥：社会比较心理抓手（月薪，用于关系卡收入对比行）
    monthlyIncome: 22000,
    // 新加：地点触发专用对话
    encounterLines: [
      "王医生在走廊匆匆走过，白大褂衣角翻飞。",
      "王医生在护士站查病历，抬头看了一眼。",
      "王医生正在给实习生讲解，语温和又坚定。",
    ],
    // 新加：信息线索
    infoHints: {
      giftHint: "王医生桌上放着一篮水果，说是患者送的，分了一个给你。",
      birthdayHint:
        "值班表上贴着张贺卡，护士说今天是王医生的生日，但他还在查房。",
    },
    giftPrefers: ["fruits", "daily_use"],
    // v3.6 P0-1: 关系网系统字段
    locationPreference: {
      hospital: 0.7,
      commercialDist: 0.2,
      park: 0.1,
    },
    relationshipWeight: {
      mentor: 0.7,
    },
    interactionHistory: [],
    tradeInfo: {
      expertise: ["daily", "food"],
      infoTypes: {
        price_level: { label: "医疗价格水平", threshold: 30, cost: 40 },
        category_lowest: { label: "哪看病最便宜", threshold: 60, cost: 20 },
      },
    },
    presenceBonus: [
      {
        minAffinity: 30,
        jobs: ["hospital_caregiver", "hospital_companion"],
        multiplier: 1.1,
      },
    ],
    affinityRewards: [
      {
        threshold: 30,
        id: "dr_wang_30",
        desc: "王医生给你健康建议（生病概率-5%）",
        effect: function (st) {
          st.flags.wangHealthTips = true;
          StateManager.addMessage(
            "💕 王医生给你一些健康建议，生病概率-5%！",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "dr_wang_60",
        desc: "王医生给你优先挂号（医院AP-2）",
        effect: function (st) {
          st.flags.wangPriority = true;
          StateManager.addMessage(
            "💕 王医生说'找我直接进'，医院AP-2！",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "dr_wang_80",
        desc: "王医生给你免费体检",
        effect: function (st) {
          st.flags.wangFreeCheckup = true;
          StateManager.addMessage(
            "❤️ 王医生说'给你做个全面检查'，免费体检！",
            "success",
          );
        },
      },
    ],
    favor: {
      story:
        "王医生有些疲惫：「今天连续看了30个病人，累死了。你能不能帮我倒杯咖啡？」",
      choices: [
        {
          text: "☕ 帮你买咖啡",
          apply: function (st) {
            st.flags._npcFavor_dr_wang = true;
            st.resources.cash -= 15;
            st.relationships.dr_wang.affinity = Math.min(
              100,
              st.relationships.dr_wang.affinity + 8,
            );
            StateManager.addMessage(
              "☕ 王医生喝了咖啡，精神好多了！",
              "success",
            );
          },
        },
        {
          text: "😅 我没带钱",
          apply: function (st) {
            st.flags._npcFavor_dr_wang = true;
            st.relationships.dr_wang.affinity = Math.max(
              -100,
              st.relationships.dr_wang.affinity - 2,
            );
            StateManager.addMessage("😅 王医生点点头：「没事。」", "info");
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 70,
      story:
        "王医生叹了口气：「干了二十年医生，见多了生死。有时候觉得，自己也在消耗生命……」",
      choices: [
        {
          text: "💪 你是救死扶伤的英雄",
          hint: "好感+8",
          apply: function (st) {
            st.relationships.dr_wang.affinity = Math.min(
              100,
              st.relationships.dr_wang.affinity + 8,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage("💕 王医生笑了笑：「谢谢你。」", "success");
          },
        },
        {
          text: "⚠️ 注意休息",
          hint: "好感+5",
          apply: function (st) {
            st.relationships.dr_wang.affinity = Math.min(
              100,
              st.relationships.dr_wang.affinity + 5,
            );
            StateManager.addMessage(
              "⚠️ 王医生点点头：「我会注意的。」",
              "info",
            );
          },
        },
        {
          text: "🤷 你自己决定",
          hint: "好感不变",
          apply: function (st) {
            StateManager.addMessage("🤷 王医生点点头：「我再想想。」", "info");
          },
        },
      ],
    },
  },
  // ============================================================
  // v3.6 新增NPC — 赵姐（中介）
  // ============================================================
  {
    id: "zhaojie",
    name: "赵姐",
    role: "房产中介",
    avatar: "images/avatars/zhaojie.png",
    location: "commercialDist",
    schedule: {
      morning: "commercialDist",
      afternoon: "commercialDist",
      evening: "entertainment",
      night: "commercialDist",
    },
    birthday: 188,
    desc: "房产中介门店店长，消息灵通。城市改造、房租涨跌她都知道。",
    birthdayLine: "哎呀你居然记得我生日！来，姐请你喝奶茶，今天不谈工作！",
    festivalLines: {
      spring_festival: "过年买房的人少，但年后开工第一波客户多，得提前准备！",
      mid_autumn: "中秋节不少客户想看房，说是团圆节买房吉利。",
      labor_day: "黄金周看房的人爆满，房价又要涨一波！",
      national_day: "国庆七天我基本都在门店，有客户随时找我。",
    },
    talkLines: [
      "最近老城区要改造，你住的那片可能涉及拆迁。",
      "房租下个月要涨，房东都托我涨价。",
      "想买房趁现在，明年政策可能要收紧。",
    ],
    presenceChance: 0.7,
    encounterLines: [
      "赵姐在门店门口打电话，语气很专业。",
      "赵姐拿着楼盘宣传册，跟客户介绍户型。",
      "赵姐坐在门店里刷手机，看到你来抬起头。",
    ],
    infoHints: {
      giftHint: "赵姐说最近房价又要涨，看来她在关注楼市动态。",
      birthdayHint: "赵姐今天穿得比较正式，可能是有重要客户。",
    },
    giftPrefers: ["cigarettes", "beer", "daily_use"],
    skillThresholds: [
      {
        attr: "intelligence",
        minAttr: 40,
        minAffinity: 60,
        id: "zhaojieCityInfo",
        desc: "提前获知城市改造信息，避免房租暴涨",
        effect: function (st) {
          if (st.flags.zhaojieCityInfo) return;
          st.flags.zhaojieCityInfo = true;
          StateManager.addMessage(
            "🏠 赵姐悄悄告诉你：「下个月老城区要改造，你住的片区房租可能要涨30%。趁现在赶紧找新地方！」提前获知城市改造信息。",
            "success",
          );
        },
      },
    ],
    tradeInfo: {
      expertise: ["housing", "commercialDist"],
      infoTypes: {
        price_level: { label: "商业区房租行情", threshold: 30, cost: 50 },
        category_highest: {
          label: "哪租房最划算",
          threshold: 60,
          cost: 30,
        },
      },
    },
    presenceBonus: [
      {
        minAffinity: 30,
        jobs: null,
        multiplier: 1.05,
      },
      { minAffinity: 60, jobs: null, multiplier: 1.1 },
    ],
    affinityRewards: [
      {
        threshold: 30,
        id: "zhaojie_30",
        desc: "赵姐给你内部租房信息（房租-10%）",
        effect: function (st) {
          st.flags.zhaojieRentInfo = true;
          StateManager.addMessage(
            "💕 赵姐：「我手上有几个房东的房源，比外面便宜10%。」",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "zhaojie_60",
        desc: "赵姐提前告知城市改造消息（避免被动涨租）",
        effect: function (st) {
          st.flags.zhaojieUrbanRenewal = true;
          StateManager.addMessage(
            "💕 赵姐悄悄说：「下个月老城区要改造，你那片房租要涨。趁现在赶紧找新地方，我帮你留意。」",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "zhaojie_80",
        desc: "赵姐给你优先看房权+中介费打折",
        effect: function (st) {
          st.flags.zhaojiePriorityViewing = true;
          StateManager.addMessage(
            "❤️ 赵姐：「以后有新房源我先通知你，中介费给你打八折。」",
            "success",
          );
        },
      },
    ],
    favor: {
      story:
        "赵姐有些为难：「今天有个大客户要看三套房，我一个人跑不过来，你能不能帮我带一套？佣金分你一半。」",
      choices: [
        {
          text: "💪 帮忙！正好熟悉下城市",
          apply: function (st) {
            st.flags._npcFavor_zhaojie = true;
            var pay = 100 + Random.int(0, 99);
            st.resources.cash += pay;
            st.resources.totalEarned += pay;
            st.player.fame = Math.min(100, st.player.fame + 3);
            if (!st.relationships.zhaojie)
              st.relationships.zhaojie = { affinity: 0, met: true };
            st.relationships.zhaojie.affinity = Math.min(
              100,
              st.relationships.zhaojie.affinity + 12,
            );
            StateManager.addMessage(
              "💪 带看完房赚了¥" + pay + "，还熟悉了商业区！好感+12。",
              "success",
            );
          },
        },
        {
          text: "😅 今天没空",
          apply: function (st) {
            st.flags._npcFavor_zhaojie = true;
            if (!st.relationships.zhaojie)
              st.relationships.zhaojie = { affinity: 0, met: true };
            st.relationships.zhaojie.affinity = Math.max(
              -100,
              st.relationships.zhaojie.affinity - 2,
            );
            StateManager.addMessage(
              "😅 赵姐点点头：「没事，我自己跑吧。」",
              "info",
            );
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 70,
      story:
        "赵姐叹了口气：「干了八年中介，见过太多人在这座城市起起落落。我攒了点钱想自己开个店，但不知道行不行……你觉得呢？」",
      choices: [
        {
          text: "💪 行！你经验丰富，客户资源也多",
          hint: "好感+10，赵姐获得开店信念",
          apply: function (st) {
            st.flags._npcDeepTask_zhaojie = true;
            if (!st.relationships.zhaojie)
              st.relationships.zhaojie = { affinity: 0, met: true };
            st.relationships.zhaojie.affinity = Math.min(
              100,
              st.relationships.zhaojie.affinity + 10,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            st.flags.zhaojieWillOpenStore = true;
            StateManager.addMessage(
              "💪 「你觉得我行吗？」「行。」赵姐沉默了一会儿，然后笑了：「你说得对，我试试。」好感+10，心情+10。也许某天，你会看到一家新开的中介门店，招牌上写着她的名字。",
              "success",
            );
          },
        },
        {
          text: "⚠️ 开店风险大，先攒更多钱再说",
          hint: "好感+3，赵姐冷静下来",
          apply: function (st) {
            st.flags._npcDeepTask_zhaojie = true;
            if (!st.relationships.zhaojie)
              st.relationships.zhaojie = { affinity: 0, met: true };
            st.relationships.zhaojie.affinity = Math.min(
              100,
              st.relationships.zhaojie.affinity + 3,
            );
            StateManager.addMessage(
              "⚠️ 你讲了开店的成本和风险。赵姐点点头：「你说得对，我再攒攒。」好感+3。",
              "info",
            );
          },
        },
        {
          text: "🤷 你自己决定",
          hint: "好感不变",
          apply: function (st) {
            st.flags._npcDeepTask_zhaojie = true;
            StateManager.addMessage(
              "🤷 「也是，这种事只能自己想。」赵姐笑了笑，没再提。",
              "info",
            );
          },
        },
      ],
    },
  },
  // ============================================================
  // v3.6 新增NPC — 陈哥（情报贩子）
  // ============================================================
  {
    id: "chen_ge",
    name: "陈哥",
    role: "情报贩子",
    avatar: "images/avatars/chen_ge.png",
    location: "nightMarket",
    schedule: {
      morning: "slum",
      afternoon: "commercialDist",
      evening: "nightMarket",
      night: "nightMarket",
    },
    birthday: 245,
    desc: "夜市摊主兼情报贩子，什么都知道。用钱或者人情换消息。",
    birthdayLine: "哟你还记得我生日！今天不收你钱，这桌算我请的！",
    festivalLines: {
      spring_festival: "过年夜市照常开，初一初二客人最多，生意好得很！",
      mid_autumn: "中秋节大家出来赏月，夜市生意翻倍。",
      labor_day: "劳动节放假三天，夜市人挤人，我忙得脚不沾地。",
      national_day: "黄金周七天我基本不歇，每天赚得比平时一周还多。",
    },
    talkLines: [
      "想打听啥？有钱好说话。",
      "城里的事，没有我不知道的。",
      "人情比钱好用，帮过我的人，消息免费。",
    ],
    presenceChance: 0.6,
    encounterLines: [
      "陈哥坐在夜市摊前抽烟，眯眼看着来往的人。",
      "陈哥正跟客人低声说话，看到你点点头。",
      "陈哥在收摊，把最后一张折叠桌叠好。",
    ],
    infoHints: {
      giftHint: "陈哥说最近城里出了几件大事，看来他消息确实灵通。",
      birthdayHint: "陈哥今天摊位上摆了一瓶白酒，说是有人送的。",
    },
    giftPrefers: ["cigarettes", "beer", "snacks"],
    skillThresholds: [
      {
        attr: "intelligence",
        minAttr: 30,
        minAffinity: 60,
        id: "chenGeInfoBonus",
        desc: "获取独家情报，触发隐藏事件",
        effect: function (st) {
          if (st.flags.chenGeInfoBonus) return;
          st.flags.chenGeInfoBonus = true;
          StateManager.addMessage(
            "🕵️ 陈哥把你当自己人了：「有消息我第一个告诉你。」触发隐藏情报事件。",
            "success",
          );
        },
      },
    ],
    tradeInfo: {
      expertise: ["info", "nightMarket"],
      infoTypes: {
        price_level: { label: "隐藏商机", threshold: 40, cost: 80 },
        category_highest: {
          label: "城里最近出了啥大事",
          threshold: 60,
          cost: 50,
        },
      },
    },
    presenceBonus: [
      {
        minAffinity: 30,
        jobs: null,
        multiplier: 1.05,
      },
      { minAffinity: 60, jobs: null, multiplier: 1.1 },
    ],
    affinityRewards: [
      {
        threshold: 30,
        id: "chen_ge_30",
        desc: "陈哥给你内部消息（随机获得一条有用情报）",
        effect: function (st) {
          st.flags.chenGeInfoAccess = true;
          StateManager.addMessage(
            "💕 陈哥：「最近城里出了件事，你可能感兴趣……」告诉你一条情报。",
            "info",
          );
        },
      },
      {
        threshold: 60,
        id: "chen_ge_60",
        desc: "陈哥给你独家情报（触发隐藏事件）",
        effect: function (st) {
          st.flags.chenGeExclusiveInfo = true;
          StateManager.addMessage(
            "💕 陈哥：「这条消息只告诉你，别到处说。」解锁隐藏情报事件。",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "chen_ge_80",
        desc: "陈哥把你当自己人（情报免费+双倍收益）",
        effect: function (st) {
          st.flags.chenGeTrusted = true;
          StateManager.addMessage(
            "❤️ 陈哥：「以后有消息我第一个告诉你，不收你钱。」情报免费，相关事件收益翻倍。",
            "success",
          );
        },
      },
    ],
    favor: {
      story:
        "陈哥压低声音：「最近城里出了件事，我得确认下细节。你能不能帮我去打听一下？有好处。」",
      choices: [
        {
          text: "🕵️ 帮忙！正好赚点情报费",
          apply: function (st) {
            st.flags._npcFavor_chen_ge = true;
            var pay = 80 + Random.int(0, 79);
            st.resources.cash += pay;
            st.resources.totalEarned += pay;
            st.player.fame = Math.min(100, st.player.fame + 2);
            if (!st.relationships.chen_ge)
              st.relationships.chen_ge = { affinity: 0, met: true };
            st.relationships.chen_ge.affinity = Math.min(
              100,
              st.relationships.chen_ge.affinity + 10,
            );
            StateManager.addMessage(
              "🕵️ 打听完消息赚了¥" + pay + "，还获得一条情报！好感+10。",
              "success",
            );
          },
        },
        {
          text: "😅 这我不方便",
          apply: function (st) {
            st.flags._npcFavor_chen_ge = true;
            if (!st.relationships.chen_ge)
              st.relationships.chen_ge = { affinity: 0, met: true };
            st.relationships.chen_ge.affinity = Math.max(
              -100,
              st.relationships.chen_ge.affinity - 3,
            );
            StateManager.addMessage(
              "😅 陈哥点点头：「没事，我找别人。」",
              "info",
            );
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 70,
      story:
        "陈哥喝了口酒：「干了这行十年，见过太多人为了消息铤而走险。我有个老同学，失踪好几年了，最近听说在这座城市出现过……你能不能帮我找找？」",
      choices: [
        {
          text: "💪 帮你找！正好锻炼下情报能力",
          hint: "好感+10，触发寻找老同学事件链",
          apply: function (st) {
            st.flags._npcDeepTask_chen_ge = true;
            if (!st.relationships.chen_ge)
              st.relationships.chen_ge = { affinity: 0, met: true };
            st.relationships.chen_ge.affinity = Math.min(
              100,
              st.relationships.chen_ge.affinity + 10,
            );
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 2,
            );
            st.flags.chenGeSearchingAjie = true;
            StateManager.addMessage(
              "💪 陈哥：「多谢兄弟。」他告诉你老同学叫阿杰，以前在城郊工地干过活。好感+10，智力+2。寻找老同学阿杰的事件链已触发。",
              "success",
            );
          },
        },
        {
          text: "🤷 这种事我帮不上",
          hint: "好感不变",
          apply: function (st) {
            st.flags._npcDeepTask_chen_ge = true;
            StateManager.addMessage(
              "🤷 陈哥叹了口气：「也是，这确实不是谁都能管的。」",
              "info",
            );
          },
        },
      ],
    },
  },
  // ============================================================
  // v3.6 新增NPC — 老同学阿杰（随机出现）
  // ============================================================
  {
    id: "ajie",
    name: "阿杰",
    role: "老同学",
    avatar: "images/avatars/ajie.png",
    location: "random", // 随机出现
    schedule: {
      morning: "random",
      afternoon: "random",
      evening: "random",
      night: "random",
    },
    birthday: 310,
    desc: "陈哥的老同学，多年前失踪后突然出现。欠了钱没还，又消失了。",
    birthdayLine: "哎呀今天是我生日？我自己都忘了！你记得，够意思！",
    festivalLines: {
      spring_festival: "过年回老家了，今年不走了，打算在这安定下来。",
      mid_autumn: "中秋节一个人在城市里过，挺想家的。",
      labor_day: "劳动节我找了个新活，在工地搬砖。",
      national_day: "黄金周我打算回老家看看，好久没回去了。",
    },
    talkLines: [
      "当年不是故意不还钱的，真的遇到难处了。",
      "我现在稳定了，慢慢还你，行不？",
      "陈哥还好吗？好久没见他了。",
    ],
    presenceChance: 0.4, // 出现概率低
    encounterLines: [
      "阿杰坐在公园长椅上发呆，看到你愣了一下。",
      "阿杰在路边摊吃面，抬头朝你点点头。",
      "阿杰匆匆走过，看到你转身想躲。",
    ],
    infoHints: {
      giftHint: "阿杰说他在工地干活，看来生活还算稳定。",
      birthdayHint: "阿杰今天穿得比较整洁，似乎心情不错。",
    },
    giftPrefers: ["beer", "snacks"],
    skillThresholds: [],
    tradeInfo: {
      expertise: [],
      infoTypes: {},
    },
    presenceBonus: [],
    affinityRewards: [
      {
        threshold: 30,
        id: "ajie_30",
        desc: "阿杰还你一部分钱（¥100）",
        effect: function (st) {
          if (st.flags.ajiePaid) return;
          st.resources.cash += 100;
          st.flags.ajiePaid = true;
          StateManager.addMessage(
            "💕 阿杰：「先还你100，剩下的慢慢还。」收到¥100。",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "ajie_60",
        desc: "阿杰还你全部欠款（¥300）并介绍工作",
        effect: function (st) {
          if (st.flags.ajiePaidFull) return;
          st.resources.cash += 300;
          st.flags.ajiePaidFull = true;
          st.flags.ajieReferred = true;
          StateManager.addMessage(
            "💕 阿杰：「这是剩下的300，多谢你没逼我。」又介绍你一份临时工作。",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "ajie_80",
        desc: "阿杰彻底还钱+成为固定联系人",
        effect: function (st) {
          if (st.flags.ajieTrusted) return;
          st.flags.ajieTrusted = true;
          st.flags.ajieReferred = true;
          StateManager.addMessage(
            "❤️ 阿杰：「兄弟，钱还清了。以后有活我第一个找你。」阿杰成为固定联系人，偶尔会给你介绍临时工作。",
            "success",
          );
        },
      },
    ],
    favor: {
      story:
        "阿杰有些尴尬：「那个……之前借的钱，我现在手头有点紧，能不能再宽限几天？」",
      choices: [
        {
          text: "💪 行，宽限你一周",
          apply: function (st) {
            st.flags._npcFavor_ajie = true;
            if (!st.relationships.ajie)
              st.relationships.ajie = { affinity: 0, met: true };
            st.relationships.ajie.affinity = Math.min(
              100,
              st.relationships.ajie.affinity + 8,
            );
            st.flags.ajieGivenExtension = true;
            StateManager.addMessage(
              "💪 阿杰：「多谢兄弟，一周后一定还。」好感+8。",
              "success",
            );
          },
        },
        {
          text: "😅 我现在也需要钱",
          apply: function (st) {
            st.flags._npcFavor_ajie = true;
            if (!st.relationships.ajie)
              st.relationships.ajie = { affinity: 0, met: true };
            st.relationships.ajie.affinity = Math.max(
              -100,
              st.relationships.ajie.affinity - 5,
            );
            StateManager.addMessage(
              "😅 阿杰低下头：「对不起……」好感-5。",
              "warning",
            );
          },
        },
      ],
    },
    deepTask: {
      requiredAffinity: 50,
      story:
        "阿杰眼圈红了：「当年我欠钱跑路，不是故意躲着你们的。我老婆生病了，得钱治病……现在她走了，我也想重新开始。」",
      choices: [
        {
          text: "💪 我理解，重新开始吧",
          hint: "好感+15，阿杰彻底放下过去",
          apply: function (st) {
            st.flags._npcDeepTask_ajie = true;
            if (!st.relationships.ajie)
              st.relationships.ajie = { affinity: 0, met: true };
            st.relationships.ajie.affinity = Math.min(
              100,
              st.relationships.ajie.affinity + 15,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            st.flags.ajieMovedOn = true;
            StateManager.addMessage(
              "💪 阿杰眼眶红了：「多谢你……我会重新开始。」好感+15，心情+10。阿杰似乎终于放下了过去。",
              "success",
            );
          },
        },
        {
          text: "⚠️ 理解，但钱还是要还",
          hint: "好感+5",
          apply: function (st) {
            st.flags._npcDeepTask_ajie = true;
            if (!st.relationships.ajie)
              st.relationships.ajie = { affinity: 0, met: true };
            st.relationships.ajie.affinity = Math.min(
              100,
              st.relationships.ajie.affinity + 5,
            );
            StateManager.addMessage(
              "⚠️ 阿杰点点头：「你说得对，我会还。」好感+5。",
              "info",
            );
          },
        },
        {
          text: "🤷 你自己决定",
          hint: "好感不变",
          apply: function (st) {
            st.flags._npcDeepTask_ajie = true;
            StateManager.addMessage("🤷 阿杰沉默了一会儿，没说话。", "info");
          },
        },
      ],
    },
  },
];

/** 获取NPC */
function getNpcById(npcId) {
  return NPCS.find((n) => n.id === npcId) || null;
}

/** 获取当前地点的NPC */
function getNpcsAtLocation(locKey) {
  return NPCS.filter((n) => n.location === locKey);
}

/** 获取好感度描述 */
function getAffinityLabel(affinity) {
  if (affinity >= 80) return "❤️ 挚友";
  if (affinity >= 60) return "😊 好友";
  if (affinity >= 30) return "🙂 熟人";
  if (affinity >= 0) return "👤 初识";
  if (affinity >= -30) return "😐 冷淡";
  return "😠 厌恶";
}

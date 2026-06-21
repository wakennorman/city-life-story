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
    location: "slum",
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
    giftPrefers: ["fruits", "daily_use"],
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
    location: "construction",
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
    giftPrefers: ["cigarettes", "beer"],
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
    location: "commercialDist",
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
    giftPrefers: ["clothing", "snacks"],
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
    location: "slum",
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
    giftPrefers: ["beer", "instant_noodles"],
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
    location: "school",
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
    giftPrefers: ["fruits", "snacks"],
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
    giftPrefers: ["beer", "vegetables"],
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

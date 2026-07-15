/**
 * 道德选择事件 — 随机遭遇 + 后续后果链
 *
 * 声明式编排：事件定义 + 后果定义
 * 触发：main.js 每日随机触发
 * 后果：daily_pipeline.js moral_后果 步骤
 */

const MORAL_EVENTS = [
  {
    id: "found_wallet",
    title: "👛 路边捡到一个钱包",
    desc: "你在地上发现一个鼓鼓的钱包，里面有身份证、银行卡和一厚叠现金（约¥500）。四周无人注意到你。",
    minDay: 3,
    dailyChance: 0.04,
    choices: [
      {
        text: "📩 送到最近的派出所归还失主",
        flag: "moral_wallet_return",
        score: 12,
        immediate: function (s) {
          // [联动flag] 触发"失主感谢"后续事件
          s.flags.moralWalletReturner = true;
          s.player.fame = Math.min(100, (s.player.fame || 0) + 2);
          s.needs.happiness = Math.min(100, s.needs.happiness + 5);
          StateManager.addMessage(
            "👮 警察登记了你的信息，说失主会联系你。",
            "success",
          );
        },
      },
      {
        text: "💰 看看四周没人，收进自己口袋",
        flag: "moral_wallet_keep",
        score: -15,
        immediate: function (s) {
          // [联动flag] 触发"昧下钱包的阴影"后续事件
          s.flags.moralWalletStolen = true;
          s.resources.cash += 500;
          s.needs.happiness = Math.min(100, s.needs.happiness + 8);
          StateManager.addMessage(
            "💵 你快速把钱塞进口袋，心跳加速地离开了。",
            "warning",
          );
        },
      },
      {
        text: "📸 拍照发朋友圈炫耀",
        flag: "moral_wallet_flaunt",
        score: -10,
        immediate: function (s) {
          s.resources.cash += 500;
          s.player.fame = Math.min(100, (s.player.fame || 0) + 5);
          s.needs.happiness = Math.min(100, s.needs.happiness + 10);
          StateManager.addMessage(
            "📱 朋友圈炸了，但你隐约觉得不太妥当...",
            "event",
          );
        },
      },
    ],
  },
  {
    id: "beggar_ask",
    title: "🧓 路边的老乞丐",
    desc: "一个衣衫褴褛的老人坐在路边，面前放着破碗，颤抖着向你伸出手。他已经一整天没吃东西了。",
    minDay: 5,
    dailyChance: 0.05,
    choices: [
      {
        text: "🍞 去旁边买份盒饭给他",
        flag: "moral_beggar_feed",
        score: 8,
        immediate: function (s) {
          // [联动flag] 触发"乞丐的线报"后续事件
          s.flags.moralFedBeggar = true;
          s.resources.cash -= 15;
          s.needs.happiness = Math.min(100, s.needs.happiness + 6);
          StateManager.addMessage("🎭 老人眼眶湿润，连声道谢。", "success");
        },
      },
      {
        text: "🪙 扔几个硬币打发一下",
        flag: "moral_beggar_coin",
        score: 3,
        immediate: function (s) {
          s.resources.cash -= 2;
          s.needs.happiness = Math.max(0, s.needs.happiness - 1);
          StateManager.addMessage(
            "🪙 硬币叮当落入碗中，你没有多看一眼。",
            "info",
          );
        },
      },
      {
        text: "🚶 装作没看见快步走过",
        flag: "moral_beggar_ignore",
        score: -3,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 2);
          StateManager.addMessage(
            "😐 你低下头走开了，但心里有些不舒服。",
            "info",
          );
        },
      },
      {
        text: "👎 嫌恶地绕到马路对面",
        flag: "moral_beggar_despise",
        score: -8,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 4);
          StateManager.addMessage(
            "😤 老人看到你的反应，默默地收回了手。",
            "warning",
          );
        },
      },
    ],
  },
  {
    id: "change_overpaid",
    title: "🧾 商店多找了钱",
    desc: "在小卖部买东西时，老板多找了¥20。他正忙着招呼其它顾客，完全没注意到。",
    minDay: 2,
    dailyChance: 0.04,
    choices: [
      {
        text: "✅ 立刻退还多找的钱",
        flag: "moral_change_return",
        score: 8,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 3);
          StateManager.addMessage(
            "👴 老板愣了一下，感激地对你笑了笑。",
            "success",
          );
        },
      },
      {
        text: "😶 默不作声地收进口袋",
        flag: "moral_change_keep",
        score: -8,
        immediate: function (s) {
          s.resources.cash += 20;
          s.needs.happiness = Math.max(0, s.needs.happiness - 1);
          StateManager.addMessage("💵 你快速离开小店，¥20到手。", "info");
        },
      },
    ],
  },
  {
    id: "see_pickpocket",
    title: "👀 目击扒手行窃",
    desc: "你在人群中发现一个扒手正在悄悄拉开前面女士的背包拉链！他的眼神凶狠，似乎是个惯犯。",
    minDay: 7,
    dailyChance: 0.03,
    choices: [
      {
        text: "🔔 大声提醒「有小偷！」",
        flag: "moral_stop_thief",
        score: 15,
        immediate: function (s) {
          // [联动flag] 触发"被路人认出英雄"后续事件
          s.flags.moralStoppedThiefPublic = true;
          s.player.fame = Math.min(100, (s.player.fame || 0) + 5);
          s.needs.happiness = Math.min(100, s.needs.happiness + 8);
          s.status.health = Math.max(0, s.status.health - 2);
          StateManager.addMessage(
            "🗣️ 女士反应过来，扒手瞪了你一眼后混入人群跑了。",
            "success",
          );
        },
      },
      {
        text: "📱 偷偷拍下照片事后交给警察",
        flag: "moral_thief_photo",
        score: 10,
        immediate: function (s) {
          s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
          StateManager.addMessage(
            "📸 你拍到了扒手的正脸，快步走向附近的派出所。",
            "info",
          );
        },
      },
      {
        text: "🙈 假装没看见，低头玩手机",
        flag: "moral_thief_ignore",
        score: -10,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 5);
          StateManager.addMessage(
            "😰 你听到身后传来「我的手机呢！」的惊呼，心里一阵愧疚。",
            "warning",
          );
        },
      },
    ],
  },
  {
    id: "scam_customers",
    title: "⚖️ 秤上做手脚？",
    desc: "摆摊时，隔壁摊主悄悄告诉你一个「秘诀」：把电子秤调偏5%，一天能多赚好几十块。今天生意不太好的话...",
    minDay: 10,
    dailyChance: 0.03,
    condition: function (s) {
      // [自洽修复] 叙事"摆摊时"需检查玩家确实在摆摊（职业/副业/行动频次），避免随机弹出与场景不符
      var hasStall =
        (s.employment &&
          s.employment.currentJob &&
          [
            "food_stall",
            "street_vending_food",
            "street_vending_goods",
          ].includes(s.employment.currentJob.id)) ||
        (s.sideHustle && s.sideHustle.type === "stall") ||
        (s.stats &&
          s.stats.actionFreq &&
          (s.stats.actionFreq["food_stall"] > 0 ||
            s.stats.actionFreq["start_business"] > 0));
      return s.trade.currentLocation === "commercialDist" && hasStall;
    },
    choices: [
      {
        text: "✅ 堂堂正正做生意，拒绝调秤",
        flag: "moral_honest_scale",
        score: 10,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 2);
          StateManager.addMessage(
            "⚖️ 你坚持给了足斤足两。顾客露出满意的笑容。",
            "success",
          );
        },
      },
      {
        text: "⚙️ 偷偷调偏5%，多赚一点是一点",
        flag: "moral_rig_scale",
        score: -12,
        immediate: function (s) {
          // [全系统自洽修复] 域B A类#5: 叙事说"多赚了"但从未加钱
          var rigProfit = Random.int(30, 80);
          s.resources.cash = (s.resources.cash || 0) + rigProfit;
          StateManager.addMessage(
            "🔧 你调了秤...今天确实多赚了¥" +
              rigProfit +
              "，但总觉得有人在盯着你。",
            "warning",
          );
        },
      },
    ],
  },
  {
    id: "found_phone",
    title: "📱 捡到一部最新款手机",
    desc: "公共厕所的洗手台上放着一部崭新的最新款手机，价值至少¥3000，没有锁屏密码。",
    minDay: 8,
    dailyChance: 0.03,
    choices: [
      {
        text: "📞 翻通讯录联系失主家人归还",
        flag: "moral_phone_return",
        score: 12,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 5);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
          StateManager.addMessage(
            "📞 失主是个学生，差点哭出来，非要请你吃饭。",
            "success",
          );
        },
      },
      {
        text: "💸 拿去二手店卖掉换钱",
        flag: "moral_phone_sell",
        score: -12,
        immediate: function (s) {
          s.resources.cash += 1500;
          s.needs.happiness = Math.min(100, s.needs.happiness + 5);
          StateManager.addMessage(
            "💰 二手店老板狐疑地看了你一眼，还是收了。",
            "warning",
          );
        },
      },
    ],
  },
  {
    id: "stray_dog_rain",
    title: "🐕 雨中的流浪狗",
    desc: "大雨中，一只瑟瑟发抖的流浪狗蜷缩在屋檐下，用湿漉漉的眼睛看着你。它看起来很虚弱。",
    // 约定式触发（v3.6 统一为数据对象式，走 evaluateTriggers 主路径）
    triggers: { minDay: 4, weather: ["rainy", "stormy"] },
    triggerWeight: 1,
    triggerCooldown: 14,
    choices: [
      {
        text: "🍖 买根火腿肠喂它，引到避雨处",
        flag: "moral_dog_feed",
        score: 8,
        immediate: function (s) {
          // [联动flag] 触发"流浪狗再次相遇"后续事件
          s.flags.moralFedDog = true;
          s.resources.cash -= 3;
          s.needs.happiness = Math.min(100, s.needs.happiness + 8);
          StateManager.addMessage(
            "🐕 小狗狼吞虎咽地吃完，舔了舔你的手。",
            "success",
          );
        },
      },
      {
        text: "😔 叹息一声，转身走了",
        flag: "moral_dog_ignore",
        score: 0,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 2);
          StateManager.addMessage(
            "🌧️ 身后传来低低的呜咽声，被雨声盖过了。",
            "info",
          );
        },
      },
    ],
  },
  {
    id: "old_fall",
    title: "👴 老人摔倒了",
    desc: "前面一个老人突然踉跄了一下，摔倒在路边。他挣扎着想爬起来，但似乎扭伤了脚。周围人都在看，没人上前。",
    minDay: 10,
    dailyChance: 0.025,
    choices: [
      {
        text: "🏃 快步上前扶起老人",
        flag: "moral_help_fallen",
        score: 15,
        immediate: function (s) {
          // [联动flag] 触发"老人家属联系你"后续事件
          s.flags.moralHelpedElder = true;
          s.needs.happiness = Math.min(100, s.needs.happiness + 6);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 4);
          StateManager.addMessage(
            "👴 老人连声道谢，说自己有儿女在国外。",
            "success",
          );
        },
      },
      {
        text: "📹 站远点拍视频发到网上",
        flag: "moral_fall_video",
        score: -2,
        immediate: function (s) {
          s.player.fame = Math.min(100, (s.player.fame || 0) + 8);
          s.needs.happiness = Math.max(0, s.needs.happiness - 1);
          StateManager.addMessage(
            "📱 视频获得不少点赞，但你知道自己没真的帮忙。",
            "event",
          );
        },
      },
      {
        text: "😰 怕被讹诈，低头快步走开",
        flag: "moral_fall_ignore",
        score: -10,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 6);
          StateManager.addMessage(
            "😞 你走出几步，回头看到另一个路人上前帮忙了。",
            "warning",
          );
        },
      },
    ],
  },
  {
    id: "bike_broken",
    title: "🚲 路边损坏的共享单车",
    desc: "你在路边看到一辆共享单车的二维码被刮花了，车锁也被撬坏。四周无人。",
    minDay: 6,
    dailyChance: 0.035,
    choices: [
      {
        text: "🔧 花点时间修好并上报",
        flag: "moral_bike_fix",
        score: 6,
        immediate: function (s) {
          if (s.skills.repair)
            s.skills.repair.xp = Math.min(1000, (s.skills.repair.xp || 0) + 20);
          s.needs.happiness = Math.min(100, s.needs.happiness + 3);
          StateManager.addMessage(
            "🔧 修好后又骑到指定停放点，感觉不错。",
            "success",
          );
        },
      },
      {
        text: "🤷 又不是我弄坏的，换一辆",
        flag: "moral_bike_ignore",
        score: 0,
        immediate: function (s) {
          StateManager.addMessage("🚲 你换了一辆好的骑走了。", "info");
        },
      },
      {
        text: "💀 顺手把车推走当废品卖",
        flag: "moral_bike_steal",
        score: -15,
        immediate: function (s) {
          s.resources.cash += Random.int(20, 40);
          s.needs.happiness = Math.min(100, Math.max(0, s.needs.happiness + 2));
          StateManager.addMessage(
            "💀 把车推到废品站卖了¥30，但你心里隐约觉得不太对。",
            "warning",
          );
        },
      },
    ],
  },
  {
    id: "stranger_help",
    title: "🙏 路边求助的陌生人",
    desc: "一个背着孩子的年轻妈妈焦急地站在路边，她的电动车没电了，离最近的充电站还有2公里。她想请你帮忙推一段。",
    minDay: 6,
    dailyChance: 0.03,
    choices: [
      {
        text: "🤝 帮忙推车到充电站",
        flag: "moral_push_car",
        score: 10,
        immediate: function (s) {
          // [联动flag] 触发"年轻妈妈再次相遇"后续事件
          s.flags.moralPushedCar = true;
          s.needs.fatigue = Math.min(100, s.needs.fatigue + 8);
          s.needs.happiness = Math.min(100, s.needs.happiness + 8);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 2);
          StateManager.addMessage(
            "👩 孩子冲你笑了笑，妈妈不停道谢。",
            "success",
          );
        },
      },
      {
        text: "📞 帮她打电话叫救援，然后离开",
        flag: "moral_help_call",
        score: 5,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 2);
          StateManager.addMessage("📞 救援说15分钟到。她感激地点头。", "info");
        },
      },
      {
        text: "⏩ 忙，没空",
        flag: "moral_help_refuse",
        score: -5,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 2);
          StateManager.addMessage(
            "🚶 你快步走过，余光看到她的表情暗了下去。",
            "info",
          );
        },
      },
    ],
  },
  {
    id: "see_cruelty",
    title: "😾 巷子里传来惨叫声",
    desc: "你路过一条小巷，看到几个小混混在用石子砸一只流浪猫。猫的后腿似乎已经受伤，躲在水管下瑟瑟发抖。",
    minDay: 12,
    dailyChance: 0.02,
    choices: [
      {
        text: "🚨 大声喝止他们，上前保护流浪猫",
        flag: "moral_save_cat",
        score: 15,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 10);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
          s.status.health = Math.max(0, s.status.health - 1);
          StateManager.addMessage(
            "😾 混混被你的气势吓跑了。猫舔了舔你的手。",
            "success",
          );
        },
      },
      {
        text: "📷 拍照发到宠物救助群",
        flag: "moral_cat_report",
        score: 8,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 1);
          StateManager.addMessage(
            "📱 救助群说马上来人。希望还来得及...",
            "info",
          );
        },
      },
      {
        text: "😞 不忍心看，低头绕道走",
        flag: "moral_cat_ignore",
        score: -5,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 5);
          StateManager.addMessage(
            "🐈 那惨叫声在你脑海里回荡了很久。",
            "warning",
          );
        },
      },
    ],
  },
  {
    id: "expense_fraud",
    title: "🧾 报销单上的「小动作」",
    desc: "同事神秘兮兮地告诉你：打车票写¥80实际花了¥50，多报的部分可以自己留着。他每个月靠这个多挣几百块，叫你一起。",
    minDay: 20,
    dailyChance: 0.025,
    condition: function (s) {
      return s.player.phase === "corporate";
    },
    choices: [
      {
        text: "❌ 拒绝，并劝同事也别这么做",
        flag: "moral_refuse_fraud",
        score: 12,
        immediate: function (s) {
          s.player.corporate.dignity = Math.min(
            100,
            (s.player.corporate.dignity || 60) + 10,
          );
          s.needs.happiness = Math.min(100, s.needs.happiness + 3);
          StateManager.addMessage(
            "🔒 同事撇了撇嘴走开了。你坚持了自己的原则。",
            "success",
          );
        },
      },
      {
        text: "🙊 不参与但也不举报，装不知道",
        flag: "moral_fraud_ignore",
        score: -3,
        immediate: function (s) {
          StateManager.addMessage(
            "🤐 你含糊地应付过去，但办公室里的事谁知道呢...",
            "info",
          );
        },
      },
      {
        text: "✅ 跟着做，能多赚点是点",
        flag: "moral_fraud_join",
        score: -15,
        immediate: function (s) {
          s.resources.cash += 200;
          s.player.corporate.risk = Math.min(
            100,
            (s.player.corporate.risk || 0) + 15,
          );
          s.player.corporate.dignity = Math.max(
            0,
            (s.player.corporate.dignity || 60) - 10,
          );
          StateManager.addMessage(
            "📄 你在报销单上多写了¥60，心跳加速地提交了。",
            "warning",
          );
        },
      },
    ],
  },
  // ============================================================
  // 新增道德事件（v2 — 8个新场景）
  // ============================================================
  {
    id: "found_atm_card",
    title: "🏧 ATM机的遗忘银行卡",
    desc: "你在ATM机前排队时，发现插卡口里插着一张别人遗忘的银行卡，屏幕上显示着余额查询结果：¥8,325.40。后面还没人注意到。",
    minDay: 4,
    dailyChance: 0.04,
    choices: [
      {
        text: "🏦 取出来交给银行保安",
        flag: "moral_atm_report",
        score: 10,
        immediate: function (s) {
          s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
          s.needs.happiness = Math.min(100, s.needs.happiness + 4);
          StateManager.addMessage(
            "🏦 保安登记了你的信息，说会联系银行处理。",
            "success",
          );
        },
      },
      {
        text: "💳 试试能不能取点钱出来",
        flag: "moral_atm_take",
        score: -18,
        immediate: function (s) {
          var taken = Random.int(200, 500);
          s.resources.cash += taken;
          s.needs.happiness = Math.min(100, s.needs.happiness + 5);
          StateManager.addMessage(
            "💸 你的手在发抖，取了¥" + taken + "赶紧离开了。",
            "warning",
          );
        },
      },
      {
        text: "📱 发朋友圈提醒大家注意财产安全",
        flag: "moral_atm_warn",
        score: 5,
        immediate: function (s) {
          s.player.fame = Math.min(100, (s.player.fame || 0) + 4);
          s.needs.happiness = Math.min(100, s.needs.happiness + 3);
          StateManager.addMessage(
            "📱 你发了条提醒，朋友们纷纷点赞转发。",
            "hint",
          );
        },
      },
    ],
  },
  {
    id: "cashier_overpaid",
    title: "🛒 超市收银员多找了钱",
    desc: "你在超市买了一堆日用品，结账后走出门口发现收银员多找了你¥30。你手里攥着多出来的钱，回头看了一眼收银台前排着的长队。",
    minDay: 3,
    dailyChance: 0.05,
    choices: [
      {
        text: "↩️ 回去退还多余的钱",
        flag: "moral_cashier_return",
        score: 8,
        immediate: function (s) {
          s.resources.cash -= 30;
          s.needs.happiness = Math.min(100, s.needs.happiness + 5);
          StateManager.addMessage(
            "😊 收银员感激地说「你真是个好人！」",
            "success",
          );
        },
      },
      {
        text: "👛 算了，她自己会发现的",
        flag: "moral_cashier_keep",
        score: -5,
        immediate: function (s) {
          s.resources.cash += 30;
          s.needs.happiness = Math.max(0, s.needs.happiness - 2);
          StateManager.addMessage(
            "😐 你安慰自己说「算了，就当是超市的失误。」",
            "info",
          );
        },
      },
    ],
  },
  {
    id: "shared_bike_unlocked",
    title: "🚲 路边一辆没锁的共享单车",
    desc: "你看到路边停着一辆共享单车，车锁没扣上，也没人扫码。骑走就能省下一笔交通费，但这样做不太对。",
    minDay: 2,
    dailyChance: 0.05,
    choices: [
      {
        text: "🔒 帮它锁上，拍张照报修",
        flag: "moral_bike_lock",
        score: 6,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 3);
          StateManager.addMessage(
            "🚲 你帮锁了车，报了故障——心里踏实多了。",
            "success",
          );
        },
      },
      {
        text: "🏍️ 骑走用用，反正没人知道",
        flag: "moral_bike_steal",
        score: -8,
        immediate: function (s) {
          StateManager.addMessage(
            "🚲 你骑了几条街，总觉得有人在看你。",
            "warning",
          );
        },
      },
      {
        text: "📷 拍照发到群里提醒大家注意",
        flag: "moral_bike_report",
        score: 4,
        immediate: function (s) {
          s.player.fame = Math.min(100, (s.player.fame || 0) + 2);
          StateManager.addMessage("📱 群里有人感谢你提醒！", "hint");
        },
      },
    ],
  },
  {
    id: "colleague_slack",
    title: "👔 同事在摸鱼被你看到",
    desc: "你路过茶水间，看到同事老张正躲在角落里刷短视频。最近公司业绩不好，总监正在抓典型。他看到你，尴尬地笑了笑。你点头示意，继续走自己的路。",
    minDay: 60,
    dailyChance: 0.03,
    condition: function (s) {
      return s.player.phase === "corporate";
    },
    choices: [
      {
        text: "🤫 假装没看见，默默走开",
        flag: "moral_colleague_ignore",
        score: 3,
        immediate: function (s) {
          s.flags._colleagueFavor = (s.flags._colleagueFavor || 0) + 1;
          StateManager.addMessage("🤫 你低头走开了，老张松了口气。", "info");
        },
      },
      {
        text: "📋 委婉提醒他注意影响",
        flag: "moral_colleague_warn",
        score: 5,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 2);
          StateManager.addMessage(
            "📋 你说「最近风声紧，注意点」，老张感激地点点头。",
            "hint",
          );
        },
      },
      {
        text: "📞 匿名向总监举报",
        flag: "moral_colleague_snitch",
        score: -10,
        immediate: function (s) {
          s.player.corporate.upwardMgmt = Math.min(
            100,
            (s.player.corporate.upwardMgmt || 0) + 3,
          ); // [全系统自洽修复] 域B 修复: upward→upwardMgmt
          s.needs.happiness = Math.max(0, s.needs.happiness - 5);
          s.flags._colleagueFavor = (s.flags._colleagueFavor || 0) - 2;
          StateManager.addMessage(
            "📞 你匿名举报了。下午老张被叫到办公室谈话，你不敢看他的眼睛。",
            "warning",
          );
        },
      },
    ],
  },
  {
    id: "injured_animal",
    title: "🐱 路边发现受伤的小猫",
    desc: "你在巷口发现一只脏兮兮的小猫，后腿似乎受了伤，蜷缩在角落瑟瑟发抖。它看到你，发出微弱的叫声。",
    minDay: 3,
    dailyChance: 0.04,
    choices: [
      {
        text: "🏥 送去附近的宠物医院",
        flag: "moral_cat_rescue",
        score: 12,
        immediate: function (s) {
          s.resources.cash -= Random.int(80, 150);
          s.needs.happiness = Math.min(100, s.needs.happiness + 10);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
          StateManager.addMessage(
            "🏥 宠物医生说小猫能救活，你心里暖暖的。",
            "success",
          );
        },
      },
      {
        text: "🍞 留点吃的，然后就走吧",
        flag: "moral_cat_feed",
        score: 4,
        immediate: function (s) {
          s.resources.cash -= 5;
          s.needs.happiness = Math.min(100, s.needs.happiness + 2);
          StateManager.addMessage(
            "🐱 你放下吃的，小猫狼吞虎咽地吃起来。",
            "info",
          );
        },
      },
      {
        text: "🚶 自己都养不活，管不了它",
        flag: "moral_cat_ignore",
        score: -4,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 3);
          StateManager.addMessage(
            "😞 你转身走了，身后传来微弱的叫声。",
            "info",
          );
        },
      },
    ],
  },
  {
    id: "help_carry",
    title: "📦 路人在搬重物",
    desc: "一个快递员正在满头大汗地把大件包裹往三轮车上搬。他看见你，犹豫了一下，欲言又止。他看起来很需要帮助。",
    minDay: 5,
    dailyChance: 0.05,
    choices: [
      {
        text: "💪 主动上去搭把手",
        flag: "moral_help_carry",
        score: 6,
        immediate: function (s) {
          s.needs.fatigue = Math.min(100, s.needs.fatigue + 5);
          s.needs.happiness = Math.min(100, s.needs.happiness + 5);
          StateManager.addMessage(
            "💪 快递员连声道谢，非要塞给你一瓶水。",
            "success",
          );
        },
      },
      {
        text: "💰 问他出不出钱找人帮忙",
        flag: "moral_help_charge",
        score: -2,
        immediate: function (s) {
          var earned = Random.int(10, 20);
          s.resources.cash += earned;
          s.needs.fatigue = Math.min(100, s.needs.fatigue + 3);
          StateManager.addMessage(
            "💰 他犹豫了一下，给了你¥" + earned + "。",
            "info",
          );
        },
      },
      {
        text: "👀 只是看了一眼，继续赶路",
        flag: "moral_help_pass",
        score: -1,
        immediate: function (s) {
          StateManager.addMessage(
            "😐 你确实很忙，但心里有点过意不去。",
            "info",
          );
        },
      },
    ],
  },
  {
    id: "crosswalk_dilemma",
    title: "🚦 深夜空无一人的红灯",
    desc: "深夜两点，你走在空无一人的大街上，前方是红灯。四周一辆车都没有，最近的人影在几百米之外。等红灯要两分钟。",
    minDay: 6,
    dailyChance: 0.04,
    choices: [
      {
        text: "🚶 虽然没人，但还是等绿灯",
        flag: "moral_crosswalk_wait",
        score: 5,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 2);
          StateManager.addMessage(
            "🚦 你站在空荡荡的路口等了两分钟——原则就是原则。",
            "hint",
          );
        },
      },
      {
        text: "🏃 左右看看没车，赶紧跑过去",
        flag: "moral_crosswalk_run",
        score: -3,
        immediate: function (s) {
          s.player.agility = Math.min(100, (s.player.agility || 0) + 0.3);
          StateManager.addMessage(
            "🏃 你快步跑过马路，什么事都没发生。",
            "info",
          );
        },
      },
    ],
  },
  {
    id: "lost_child",
    title: "👶 商城里走丢的小孩",
    desc: "你在商场里看到一个四五岁的小男孩在走廊中间哭着喊妈妈，周围的大人行色匆匆，没人停下来。",
    minDay: 7,
    dailyChance: 0.03,
    choices: [
      {
        text: "🤝 蹲下来安慰他，带他去服务台广播",
        flag: "moral_child_help",
        score: 14,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 10);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 5);
          StateManager.addMessage(
            "👶 广播响了三次后，一位焦急的母亲冲到了服务台，抱着孩子哭了。她不停向你道谢。",
            "success",
          );
        },
      },
      {
        text: "📱 拍个照发到商场群让管理员处理",
        flag: "moral_child_report",
        score: 7,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 3);
          StateManager.addMessage("📱 管理员很快赶到，把孩子带走了。", "info");
        },
      },
      {
        text: "🚶 商场有保安，用不着我管",
        flag: "moral_child_ignore",
        score: -6,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 4);
          StateManager.addMessage(
            "😞 你走远了，还能听到后面隐约的哭声。",
            "info",
          );
        },
      },
    ],
  },

  // ============================================================
  // 新增道德事件（批次D — 8个新场景）
  // ============================================================
  {
    id: "supermarket_temptation",
    title: "🛒 自助结账的诱惑",
    desc: "超市自助结账机上，你扫完所有商品后，发现购物车底部还有一盒¥48的进口巧克力没扫码。周围没有工作人员注意你，后面也没人排队。",
    minDay: 5,
    dailyChance: 0.045,
    choices: [
      {
        text: "✅ 拿起来扫码付款，不能因小失大",
        flag: "moral_scan_honest",
        score: 6,
        immediate: function (s) {
          s.resources.cash -= 48;
          s.needs.happiness = Math.min(100, s.needs.happiness + 3);
          StateManager.addMessage(
            "🛒 你扫码付了巧克力的钱。诚信值+1。",
            "success",
          );
        },
      },
      {
        text: "👀 假装没看见，塞进购物袋带走",
        flag: "moral_scan_steal",
        score: -10,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 2);
          StateManager.addMessage(
            "👀 你心跳加速地走出超市，手里紧握着那盒巧克力。",
            "warning",
          );
        },
      },
      {
        text: "🤷 放回货架，不买了",
        flag: "moral_scan_return",
        score: 4,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 1);
          StateManager.addMessage(
            "🤷 你走回货架放下了巧克力。虽然没吃到，但心里踏实。",
            "info",
          );
        },
      },
    ],
  },
  {
    id: "taxi_overpaid",
    title: "🚕 打车少付了钱",
    desc: "你打车到了目的地，计价器显示¥32。你递给司机¥50，他看了一眼计价器说「找您¥28」。你接过钱一愣——计价器其实跳到了¥34，他少算了¥2。他显然记错了。",
    minDay: 4,
    dailyChance: 0.04,
    choices: [
      {
        text: "👍 主动补上差额¥2",
        flag: "moral_taxi_fix",
        score: 6,
        immediate: function (s) {
          s.resources.cash -= 2;
          s.needs.happiness = Math.min(100, s.needs.happiness + 4);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 1);
          StateManager.addMessage(
            "🚕 司机愣了一下，笑着说「好人啊，谢谢了！」",
            "success",
          );
        },
      },
      {
        text: "🤐 接过钱默默下车",
        flag: "moral_taxi_keep",
        score: -3,
        immediate: function (s) {
          s.resources.cash += 2;
          s.needs.happiness = Math.max(0, s.needs.happiness - 1);
          StateManager.addMessage(
            "🤐 你接过钱下了车。¥2而已，司机不会在意的...吧。",
            "info",
          );
        },
      },
      {
        text: "💰 多给¥10当小费",
        flag: "moral_taxi_tip",
        score: 8,
        immediate: function (s) {
          s.resources.cash -= 10;
          s.needs.happiness = Math.min(100, s.needs.happiness + 6);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 2);
          StateManager.addMessage(
            "🚕 司机惊喜地接过钱，「小伙子以后打车找我，给你打折！」",
            "success",
          );
        },
      },
    ],
  },
  {
    id: "friend_cheating",
    title: "📝 发现朋友考试作弊",
    desc: "你和朋友一起参加职业资格考试。你无意中看到他在用手机搜答案，监考老师正往这边走。他向你投来求助的眼神。",
    minDay: 15,
    dailyChance: 0.025,
    choices: [
      {
        text: "🗣️ 轻咳一声提醒他收手机",
        flag: "moral_cheat_warn",
        score: 5,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 2);
          s.flags._friendCheatWarned = true;
          StateManager.addMessage(
            "🗣️ 你轻咳了一声，他赶紧收起手机。监考老师看了一眼，走过去了。",
            "hint",
          );
        },
      },
      {
        text: "🙈 装作没看见，管好自己",
        flag: "moral_cheat_ignore",
        score: -4,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 3);
          StateManager.addMessage(
            "🙈 你低下头专心答题。后来听到他被请出考场的动静。",
            "warning",
          );
        },
      },
      {
        text: "📋 举手报告监考老师",
        flag: "moral_cheat_report",
        score: -5,
        immediate: function (s) {
          s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
          s.needs.happiness = Math.max(0, s.needs.happiness - 6);
          StateManager.addMessage(
            "📋 你举手报告了。朋友被没收了试卷，他回头时眼神让你难受了一整天。",
            "warning",
          );
        },
      },
    ],
  },
  {
    id: "library_book_damage",
    title: "📚 图书馆的书被弄湿了",
    desc: "你借的图书馆书不小心被水杯打翻淋湿了，好几页黏在一起。书是刚出版的新书，定价¥68。还回去肯定会被发现。",
    minDay: 3,
    dailyChance: 0.04,
    choices: [
      {
        text: "🏪 主动去图书馆说明情况并赔偿",
        flag: "moral_book_pay",
        score: 8,
        immediate: function (s) {
          if (s.resources.cash >= 68) {
            s.resources.cash -= 68;
            s.needs.happiness = Math.min(100, s.needs.happiness + 3);
            s.player.fame = Math.min(100, (s.player.fame || 0) + 2);
            StateManager.addMessage(
              "📚 管理员说「诚实的学生不多了」，只收了¥34（半价）。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "📚 钱不够赔全款，管理员让你写了份检讨分期付款。",
              "info",
            );
          }
        },
      },
      {
        text: "💨 悄悄放进还书箱当无事发生",
        flag: "moral_book_hide",
        score: -8,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 3);
          StateManager.addMessage(
            "💨 你还了书，但图书馆有监控...希望不会被查到。",
            "warning",
          );
        },
      },
      {
        text: "📖 买一本新的还回去",
        flag: "moral_book_replace",
        score: 6,
        immediate: function (s) {
          if (s.resources.cash >= 68) {
            s.resources.cash -= 68;
            s.needs.happiness = Math.min(100, s.needs.happiness + 4);
            StateManager.addMessage(
              "📖 你买了新书还回去，管理员没发现区别——但你知道。",
              "info",
            );
          } else {
            StateManager.addMessage("📖 不够钱买新的...", "warning");
          }
        },
      },
    ],
  },
  {
    id: "parking_scrape",
    title: "🚗 不小心刮了别人的车",
    desc: "你在狭窄的巷子里走，手里拎着东西转身时，背包拉链刮到了一辆停在路边的白色私家车，留下了一道明显的划痕。周围没有人看到。",
    minDay: 8,
    dailyChance: 0.03,
    choices: [
      {
        text: "📝 留张纸条写上你的电话",
        flag: "moral_scrape_note",
        score: 12,
        immediate: function (s) {
          s.needs.fatigue = Math.min(100, s.needs.fatigue + 2);
          s.needs.happiness = Math.max(0, s.needs.happiness - 3);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
          s.flags._scrapeLeftNote = true;
          StateManager.addMessage(
            "📝 你写了张纸条夹在雨刮器下。虽然可能要赔钱，但至少睡得着觉。",
            "hint",
          );
        },
      },
      {
        text: "👀 四下无人，赶紧走",
        flag: "moral_scrape_flee",
        score: -12,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 5);
          StateManager.addMessage(
            "👀 你快步离开现场，走出两条街才敢回头。",
            "warning",
          );
        },
      },
      {
        text: "📸 拍下划痕和周围环境，先看看监控再说",
        flag: "moral_scrape_check",
        score: 3,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 1);
          s.flags._scrapeCheckCamera = true;
          StateManager.addMessage(
            "📸 你发现巷子里没有监控——但你知道自己做了什么。",
            "info",
          );
        },
      },
    ],
  },
  {
    id: "elderly_scam_alert",
    title: "📞 正在被诈骗的老人",
    desc: "你在银行ATM区排队，前面一个老奶奶正在边打电话边操作ATM。她神色慌张，电话那头隐约传来「安全账户」「洗钱」「不要告诉任何人」等字眼。",
    minDay: 10,
    dailyChance: 0.025,
    choices: [
      {
        text: "🚨 上前打断她，提醒可能是诈骗",
        flag: "moral_scam_stop",
        score: 15,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 8);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 5);
          s.flags._stoppedScam = true;
          StateManager.addMessage(
            "🚨 老奶奶半信半疑地挂了电话。银行保安也过来帮忙确认是诈骗，她差点转了¥30,000！",
            "success",
          );
        },
      },
      {
        text: "🔔 悄悄告诉银行保安或大堂经理",
        flag: "moral_scam_report",
        score: 10,
        immediate: function (s) {
          s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
          s.needs.happiness = Math.min(100, s.needs.happiness + 4);
          StateManager.addMessage(
            "🔔 保安立刻过去询问情况，中止了转账操作。",
            "success",
          );
        },
      },
      {
        text: "😞 多一事不如少一事，办完自己的事就走",
        flag: "moral_scam_ignore",
        score: -10,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 5);
          StateManager.addMessage(
            "😞 你办完业务离开时，老奶奶还在打电话...你希望她运气好吧。",
            "warning",
          );
        },
      },
    ],
  },
  {
    id: "vending_machine_error",
    title: "🥤 售货机多掉出一瓶饮料",
    desc: "你在自助售货机买了一瓶¥4的矿泉水，扫码付款后，机器「哐当」一声掉出来两瓶——一瓶你买的矿泉水，外加一瓶¥8的果汁。机器屏幕没有任何异常提示。",
    minDay: 2,
    dailyChance: 0.05,
    choices: [
      {
        text: "📞 按机器上的报修电话说明情况",
        flag: "moral_vending_report",
        score: 6,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 3);
          s.player.fame = Math.min(100, (s.player.fame || 1) + 1);
          StateManager.addMessage(
            "📞 客服说「下次来免费补给您一瓶」，你放下果汁和多出的水离开了。",
            "success",
          );
        },
      },
      {
        text: "🎉 赚到了！两瓶都拿走",
        flag: "moral_vending_take",
        score: -5,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 3);
          StateManager.addMessage(
            "🥤 你拿了两瓶饮料离开。走了几步忍不住回头看了一眼机器。",
            "info",
          );
        },
      },
      {
        text: "💪 只拿自己买的，把多出的放回取物口",
        flag: "moral_vending_leave",
        score: 4,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 2);
          StateManager.addMessage(
            "💪 你只拿了自己的水。下一个人来取货时会发现的。",
            "hint",
          );
        },
      },
    ],
  },
  {
    id: "neighbor_borrow_debt",
    title: "🏠 邻居又来借钱了",
    desc: "合租公寓的邻居敲你的门，一脸尴尬地说这个月房租还差¥200，想再借点。「上次借的¥150实在对不住，下个月发工资一定一起还。」你记得他上个月也是这么说的。",
    minDay: 10,
    dailyChance: 0.03,
    condition: function (s) {
      return s.resources.cash >= 200;
    },
    choices: [
      {
        text: "💰 再借他¥200，希望这次能还",
        flag: "moral_borrow_again",
        score: 5,
        immediate: function (s) {
          s.resources.cash -= 200;
          s.needs.happiness = Math.max(0, s.needs.happiness - 2);
          s.flags._neighborDebt = (s.flags._neighborDebt || 150) + 200;
          StateManager.addMessage(
            "💰 你借了¥200。他感激涕零，但你心里清楚这钱大概率回不来了。",
            "warning",
          );
        },
      },
      {
        text: "😅 抱歉说自己也没钱了",
        flag: "moral_borrow_refuse",
        score: -3,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, s.needs.happiness - 3);
          s.flags._neighborRefused = true;
          StateManager.addMessage(
            "😅 你找了个借口拒绝了。他失望地走了，你有点不忍心。",
            "info",
          );
        },
      },
      {
        text: "📋 让他写个借条，约定分期还",
        flag: "moral_borrow_iou",
        score: 8,
        immediate: function (s) {
          s.resources.cash -= 200;
          s.flags._neighborIOU = (s.flags._neighborIOU || 150) + 200;
          s.flags._neighborHasIOU = true;
          s.player.fame = Math.min(100, (s.player.fame || 0) + 2);
          StateManager.addMessage(
            "📋 他犹豫了一下还是写了借条。你收好纸条——至少有个凭证。",
            "hint",
          );
        },
      },
    ],
  },

  // === v3.6: 工作后触发事件（after_work 触发槽）===
  {
    id: "after_work_find_coin",
    title: "🪙 工友留下的硬币",
    desc: "下班收工时，你在工具堆里摸到几枚散落的硬币，一共¥3。不知道是哪个粗心工友落下的。",
    minDay: 5,
    triggers: ["after_work"],
    triggerWeight: 5,
    triggerCooldown: 25,
    choices: [
      {
        text: "🎒 收进口袋，积少成多",
        flag: "moral_find_coin_keep",
        score: 2,
        immediate: function (s) {
          s.resources.cash += 3;
          s.needs.happiness = Math.min(100, s.needs.happiness + 2);
          StateManager.addMessage("口袋里多了¥3，虽然不多但聊胜于无。", "info");
        },
      },
      {
        text: '📢 喊一声"谁掉了硬币"',
        flag: "moral_find_coin_return",
        score: 6,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 5);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 1);
          StateManager.addMessage("工友们投来赞许的目光。", "success");
        },
      },
      {
        text: "🤷 无所谓，走自己的路",
        flag: "moral_find_coin_ignore",
        score: 0,
        immediate: function (s) {
          StateManager.addMessage("你没理会，继续收拾工具。", "hint");
        },
      },
    ],
  },
  {
    id: "after_work_rain_shelter",
    title: "☔ 暴雨突至",
    desc: "刚干完活走出工地，天空突然下起暴雨。你浑身湿透，得赶紧找个地方避雨。",
    minDay: 8,
    triggers: ["after_work"],
    triggerWeight: 3,
    triggerCooldown: 40,
    condition: function (s) {
      return (
        s.weather &&
        (s.weather.current === "rainy" || s.weather.current === "stormy")
      );
    },
    choices: [
      {
        text: "🏪 进附近便利店躲雨，买瓶热饮暖身",
        flag: "moral_rain_shelter_cafe",
        score: 3,
        immediate: function (s) {
          if (s.resources.cash >= 5) {
            s.resources.cash -= 5;
            s.needs.fatigue = Math.max(0, s.needs.fatigue - 10);
            s.needs.happiness = Math.min(100, s.needs.happiness + 5);
            StateManager.addMessage(
              "热饮下肚，身上暖和多了。疲劳感也消了些。",
              "success",
            );
          } else {
            s.needs.fatigue = Math.max(0, s.needs.fatigue - 5);
            StateManager.addMessage(
              "店员让你进去躲雨，虽然没买饮料但也算避了。",
              "info",
            );
          }
        },
      },
      {
        text: "🏃 硬着头皮跑回家",
        flag: "moral_rain_shelter_run",
        score: 0,
        immediate: function (s) {
          s.needs.fatigue = Math.min(100, s.needs.fatigue + 15);
          s.status.health = Math.max(0, (s.status.health || 100) - 5);
          StateManager.addMessage(
            "淋成落汤鸡，但总算到家了。注意别感冒。",
            "warning",
          );
        },
      },
      {
        text: "🚇 等到雨小点再走",
        flag: "moral_rain_shelter_wait",
        score: 1,
        immediate: function (s) {
          s.needs.fatigue = Math.min(100, s.needs.fatigue + 5);
          s.needs.happiness = Math.min(100, s.needs.happiness + 3);
          StateManager.addMessage("在屋檐下等了半小时，雨终于小了。", "info");
        },
      },
    ],
  },
  {
    id: "after_work_fellow_story",
    title: "🍺 工友的酒话",
    desc: "收工后，一个老工友请你喝瓶啤酒。他絮絮叨叨地说起自己年轻时的经历——也曾满怀梦想，后来却在这座城市混得并不如意。",
    minDay: 15,
    triggers: ["after_work"],
    triggerWeight: 2,
    triggerCooldown: 60,
    choices: [
      {
        text: "👂 认真听他说，偶尔应和两句",
        flag: "moral_fellow_listen",
        score: 3,
        immediate: function (s) {
          s.needs.happiness = Math.min(100, s.needs.happiness + 5);
          s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
          StateManager.addMessage(
            "听了别人的故事，你似乎对自己的人生有了新的理解。",
            "hint",
          );
        },
      },
      {
        text: "🍺 陪他喝一瓶，聊聊自己",
        flag: "moral_fellow_drink",
        score: 1,
        immediate: function (s) {
          s.resources.cash = Math.max(0, s.resources.cash - 3);
          s.needs.fatigue = Math.min(100, s.needs.fatigue + 8);
          s.needs.happiness = Math.min(100, s.needs.happiness + 8);
          StateManager.addMessage("两瓶啤酒下肚，心里那点疲惫都散了。", "info");
        },
      },
      {
        text: "🚶 笑笑点点头，借口有事先走",
        flag: "moral_fellow_leave",
        score: 0,
        immediate: function (s) {
          StateManager.addMessage(
            "你找了个借口脱身。回家路上心情有点复杂。",
            "hint",
          );
        },
      },
    ],
  },
  {
    id: "moral_elder_assist",
    title: "🧓 独居老人搬重物下楼",
    desc: "楼道里一位独居老人正吃力地往下搬一袋米和一箱旧书，电梯坏了。他喘着粗气，额头上全是汗，走两步就要歇一下。",
    minDay: 5,
    dailyChance: 0.025,
    choices: [
      {
        text: "🤝 上前帮他把东西搬下楼",
        flag: "moral_elder_helped",
        score: 10,
        immediate: function (s) {
          if (!s.relationships) s.relationships = {};
          var r = s.relationships.elderNeighbor;
          if (!r) r = s.relationships.elderNeighbor = {};
          r.met = true;
          r.affinity = Math.min(100, (r.affinity || 0) + 18);
          s.needs.happiness = Math.min(100, (s.needs.happiness || 0) + 6);
          s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
          StateManager.addMessage(
            "🧓 老人连声道谢，硬塞给你两个橘子。你们成了点头之交。",
            "success",
          );
        },
      },
      {
        text: "⏩ 赶时间，绕开走了",
        flag: "moral_elder_ignored",
        score: -4,
        immediate: function (s) {
          s.needs.happiness = Math.max(0, (s.needs.happiness || 0) - 2);
          StateManager.addMessage(
            "你快步走开，身后传来重物落地的闷响和一声闷哼。",
            "warning",
          );
        },
      },
    ],
  },
];

// v3.22: 修复 after_work 道德事件死代码
// 这 3 个事件使用 triggers:["after_work"] 但被困在 MORAL_EVENTS 中。
// triggerMoralEvent 通过 Random.chance(evt.dailyChance) 判定 → undefined → 永不被选中。
// loadAllTriggers 只扫描 RANDOM_EVENTS → 它们从未注册到 after_work 槽。
// 解决：翻译为 RANDOM_EVENTS 标准格式后注入，让 loadAll 注册到 after_work 槽。
// 注意：不设置 phase 字段 → 不会被 queueRandomEvent 重复抽取（避免双触发）。
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._moralAfterWorkLoaded) return;
  RANDOM_EVENTS._moralAfterWorkLoaded = true;

  for (var i = 0; i < MORAL_EVENTS.length; i++) {
    var m = MORAL_EVENTS[i];
    if (
      !m ||
      !Array.isArray(m.triggers) ||
      m.triggers.indexOf("after_work") < 0
    )
      continue;

    // 翻译 choices: immediate → apply, 保留 flag/score 供后续扩展
    var translatedChoices = (m.choices || []).map(function (c) {
      return {
        text: c.text,
        hint: c.hint || "",
        cost: c.cost,
        apply: c.immediate, // showEventModal 回调调用 choice.apply(state)
      };
    });

    // 从标题提取首 emoji 作为图标（标题格式为 "🪙 工友留下的硬币"）
    var iconMatch = (m.title || "").match(/^(\p{Emoji}️?\s*)/u);
    var icon = m.icon || (iconMatch ? iconMatch[1].trim() : "⚖️");

    RANDOM_EVENTS.push({
      id: m.id,
      // 故意不设 phase → 不进入 queueRandomEvent 每日随机池，仅走 after_work 槽
      icon: icon,
      title: m.title,
      story: m.desc, // showEventModal 读取 evt.story
      conditions: m.condition, // 自定义门控（如雨天）
      probability: 1, // 槽位触发不受此字段影响
      repeatable: false,
      triggers: m.triggers, // 让 loadAll 注册到 after_work 槽
      triggerWeight: m.triggerWeight,
      triggerCooldown: m.triggerCooldown,
      minDay: m.minDay,
      choices: translatedChoices,
    });
  }
})();

const EXTREME_MORAL_EVENTS = [
  {
    id: "extreme_steal_medicine",
    title: "💊 药店柜台后的救命药",
    desc: "深夜药店只剩一个店员打盹。柜台后有一盒儿童退烧药，刚好是邻居孩子急需的那种，但你身上钱不够。",
    minDay: 18,
    choices: [
      {
        text: "🧾 留下欠条，先拿药救人",
        flag: "moral_med_iou",
        score: 6,
        cash: -80,
        happiness: 3,
        msg: "你留下姓名和欠条拿走了药。孩子退烧了，店员第二天也没有报警。",
        type: "success",
      },
      {
        text: "🕳️ 趁店员睡着直接拿走",
        flag: "moral_med_steal",
        score: -12,
        cash: 0,
        happiness: -5,
        msg: "你把药塞进怀里。孩子得救了，但你一整夜都听见自己的心跳。",
        type: "warning",
      },
      {
        text: "🚪 转身离开，别惹麻烦",
        flag: "moral_med_leave",
        score: -8,
        happiness: -10,
        msg: "你离开了药店。楼道里的哭声一直没停。",
        type: "danger",
      },
    ],
  },
  {
    id: "extreme_food_queue",
    title: "🍚 救济餐排到最后一份",
    desc: "社区救济餐只剩最后一盒。你排了一小时，身后还有一个抱着孩子的女人。",
    minDay: 16,
    choices: [
      {
        text: "🍱 自己拿走，今天你也饿坏了",
        flag: "moral_food_keep",
        score: -5,
        hunger: 25,
        happiness: -3,
        msg: "热饭进了肚子，但你没敢回头看。",
        type: "warning",
      },
      {
        text: "👩‍👧 让给她和孩子",
        flag: "moral_food_give",
        score: 10,
        hunger: -10,
        happiness: 6,
        msg: "她不停道谢。你饿着肚子回去，却觉得心里没那么冷。",
        type: "success",
      },
      {
        text: "🤝 提议一人一半",
        flag: "moral_food_share",
        score: 7,
        hunger: 8,
        happiness: 3,
        msg: "一盒饭分成两半，谁都没吃饱，但谁都撑过了今天。",
        type: "info",
      },
    ],
  },
  {
    id: "extreme_report_coworker",
    title: "📋 同事伪造工时",
    desc: "你发现临时工同事虚报了三天工时。他说家里老人住院，求你别举报。举报有奖金，不举报你也可能被牵连。",
    minDay: 25,
    choices: [
      {
        text: "📣 举报，拿制度说话",
        flag: "moral_work_report",
        score: 4,
        cash: 300,
        fame: -2,
        msg: "你拿到奖金，但工友们看你的眼神变了。",
        type: "info",
      },
      {
        text: "🤐 替他保密一次",
        flag: "moral_work_cover",
        score: -3,
        happiness: -2,
        msg: "你替他保密了，但开始担心事情败露。",
        type: "warning",
      },
      {
        text: "🧾 劝他主动补签说明",
        flag: "moral_work_confess",
        score: 9,
        fame: 2,
        msg: "他红着脸去找领班说明。奖金没了，但事情没有闹大。",
        type: "success",
      },
    ],
  },
  {
    id: "extreme_eviction_neighbor",
    title: "🏚️ 邻居被赶出门",
    desc: "隔壁一家今晚交不上房租，房东把行李扔到走廊。你刚攒下几百块，明天也要交自己的房租。",
    minDay: 20,
    choices: [
      {
        text: "💸 借他们¥300先过夜",
        flag: "moral_evict_lend",
        score: 10,
        cash: -300,
        happiness: 4,
        msg: "孩子终于停止哭泣。你开始盘算明天怎么办。",
        type: "success",
      },
      {
        text: "🧍 帮忙和房东谈判",
        flag: "moral_evict_talk",
        score: 7,
        fame: 2,
        happiness: 2,
        msg: "你磨了半小时嘴皮子，房东答应宽限两天。",
        type: "success",
      },
      {
        text: "🚪 关上门，别把麻烦带进来",
        flag: "moral_evict_close",
        score: -8,
        happiness: -4,
        msg: "走廊安静下去之后，你发现自己睡不着。",
        type: "warning",
      },
    ],
  },
  {
    id: "extreme_expired_food",
    title: "🥫 快过期的临期食品",
    desc: "仓库主管让你把一批快过期的罐头贴上新日期，说卖出去就能给你分成。",
    minDay: 22,
    choices: [
      {
        text: "🏷️ 照做，拿分成",
        flag: "moral_expired_relabel",
        score: -15,
        cash: 500,
        happiness: -6,
        msg: "钱到手了。你却总想起买走罐头的老人。",
        type: "danger",
      },
      {
        text: "🗑️ 拒绝并要求下架",
        flag: "moral_expired_refuse",
        score: 12,
        fame: 2,
        msg: "主管骂你死脑筋，但这批货没有流出去。",
        type: "success",
      },
      {
        text: "🍲 标明临期，低价卖给愿意的人",
        flag: "moral_expired_discount",
        score: 6,
        cash: 80,
        msg: "大家知道风险后按需购买，浪费少了，心里也踏实些。",
        type: "info",
      },
    ],
  },
  {
    id: "extreme_hospital_queue",
    title: "🏥 急诊队伍里的红包",
    desc: "医院急诊排队很长。有人悄悄告诉你，塞个红包可以提前进去。你的朋友正疼得发抖。",
    minDay: 28,
    choices: [
      {
        text: "🧧 塞红包插队",
        flag: "moral_queue_bribe",
        score: -10,
        cash: -500,
        happiness: -2,
        msg: "朋友先看上病了。后面的人沉默地看着你。",
        type: "warning",
      },
      {
        text: "📢 找护士说明真实紧急情况",
        flag: "moral_queue_explain",
        score: 8,
        happiness: 2,
        msg: "护士重新分诊，朋友被提前处理，没有人需要被挤掉。",
        type: "success",
      },
      {
        text: "🪑 继续排队",
        flag: "moral_queue_wait",
        score: 3,
        health: -3,
        msg: "你们等了很久。规则还在，但疼痛也是真的。",
        type: "info",
      },
    ],
  },
  {
    id: "extreme_wage_evidence",
    title: "📱 欠薪证据",
    desc: "你拿到了包工头拖欠工人工资的聊天记录。公开会得罪人，私下卖给包工头可以换一笔封口费。",
    minDay: 30,
    choices: [
      {
        text: "⚖️ 交给劳动监察",
        flag: "moral_wage_report",
        score: 15,
        fame: 5,
        msg: "调查开始了。工友们第一次觉得钱可能拿得回来。",
        type: "success",
      },
      {
        text: "💰 卖给包工头封口",
        flag: "moral_wage_sellout",
        score: -18,
        cash: 1500,
        fame: -8,
        happiness: -10,
        msg: "封口费很厚。工友们还在等一个不会来的结果。",
        type: "danger",
      },
      {
        text: "🕊️ 匿名发给工友代表",
        flag: "moral_wage_anonymous",
        score: 10,
        happiness: 2,
        msg: "你没有站到台前，但证据开始流动。",
        type: "success",
      },
    ],
  },
  {
    id: "extreme_shelter_bed",
    title: "🛏️ 救助站最后一张床",
    desc: "寒潮夜里，救助站只剩最后一张床位。你冻得发抖，门外还有一个更老的人。",
    minDay: 24,
    choices: [
      {
        text: "🛏️ 自己睡床，活过今晚最重要",
        flag: "moral_shelter_keep",
        score: -4,
        health: 8,
        happiness: -2,
        msg: "被子很暖。你把脸埋进去，假装没听见门外的咳嗽。",
        type: "warning",
      },
      {
        text: "🧥 把床让给老人，自己坐一夜",
        flag: "moral_shelter_give",
        score: 12,
        health: -6,
        happiness: 6,
        msg: "老人睡下了。你坐到天亮，手脚冻得发麻。",
        type: "success",
      },
      {
        text: "🤝 和管理员商量加铺纸板",
        flag: "moral_shelter_share",
        score: 8,
        health: 2,
        msg: "你们挤出一个角落。没人睡好，但没人被留在外面。",
        type: "info",
      },
    ],
  },
  {
    id: "extreme_insulin",
    title: "🧊 冰袋里的胰岛素",
    desc: "外卖箱里有一份误送的胰岛素。平台说找不到客户地址，超时会罚你钱。",
    minDay: 26,
    choices: [
      {
        text: "🏃 自己查电话送回去",
        flag: "moral_insulin_return",
        score: 14,
        cash: -80,
        fame: 4,
        msg: "你多跑了半座城。对方家属握着你的手说谢谢。",
        type: "success",
      },
      {
        text: "🧾 交回站点，按流程走",
        flag: "moral_insulin_station",
        score: 5,
        msg: "站点登记了。你不知道药最后有没有按时送到。",
        type: "info",
      },
      {
        text: "🗑️ 当异常单处理，保住时效",
        flag: "moral_insulin_discard",
        score: -16,
        cash: 120,
        happiness: -8,
        msg: "系统显示准时。你却记住了冰袋上的患者姓名。",
        type: "danger",
      },
    ],
  },
  {
    id: "extreme_fake_charity",
    title: "📦 假慈善募捐",
    desc: "有人拉你一起做街头募捐，海报上的病人是真的，但钱大多进组织者口袋。你只要站半天就有提成。",
    minDay: 18,
    choices: [
      {
        text: "🙋 参与募捐，拿提成",
        flag: "moral_charity_fake",
        score: -14,
        cash: 400,
        fame: -4,
        msg: "路人把零钱投进箱子，你低头说谢谢。",
        type: "danger",
      },
      {
        text: "📣 当场拆穿",
        flag: "moral_charity_expose",
        score: 12,
        fame: 3,
        health: -2,
        msg: "组织者推搡了你几下，但路人开始散开。",
        type: "success",
      },
      {
        text: "📞 悄悄举报",
        flag: "moral_charity_report",
        score: 8,
        msg: "你没有正面冲突。下午那群人被城管带走了。",
        type: "info",
      },
    ],
  },
  {
    id: "extreme_school_fee",
    title: "🎒 借学费的孩子",
    desc: "楼下孩子拿着缴费单，说妈妈电话打不通，明天不交就不能参加春游。你知道这可能只是大人教他的借口。",
    minDay: 20,
    choices: [
      {
        text: "💳 帮他垫¥180",
        flag: "moral_school_pay",
        score: 9,
        cash: -180,
        happiness: 4,
        msg: "孩子攥着收据跑远。你希望钱真的去了学校。",
        type: "success",
      },
      {
        text: "🏫 陪他去学校核实",
        flag: "moral_school_verify",
        score: 12,
        fame: 2,
        msg: "老师确认了情况，还联系上了孩子母亲。",
        type: "success",
      },
      {
        text: "🙅 不管，别被骗",
        flag: "moral_school_refuse",
        score: -5,
        happiness: -2,
        msg: "孩子低着头走了。你告诉自己谨慎没错。",
        type: "warning",
      },
    ],
  },
  {
    id: "extreme_elevator_elder",
    title: "🛗 停电楼梯间",
    desc: "老楼停电，电梯停运。一个老人拎着氧气瓶，想请你帮忙抬上六楼。你已经累得腿发软。",
    minDay: 15,
    choices: [
      {
        text: "💪 咬牙帮忙抬上去",
        flag: "moral_elevator_help",
        score: 12,
        fatigue: 18,
        health: -2,
        msg: "六层楼像六十层。老人家属给你倒了杯热水。",
        type: "success",
      },
      {
        text: "📞 帮忙联系物业和邻居",
        flag: "moral_elevator_call",
        score: 7,
        fatigue: 4,
        msg: "你叫来两个人一起抬，没人逞英雄，事情解决了。",
        type: "info",
      },
      {
        text: "🏃 推说赶时间离开",
        flag: "moral_elevator_leave",
        score: -7,
        happiness: -4,
        msg: "你下楼很快，心却沉得很慢。",
        type: "warning",
      },
    ],
  },
  {
    id: "extreme_blood_donation",
    title: "🩸 血库告急",
    desc: "医院门口贴着急需献血的通知，血型刚好和你一样。你今天还要干体力活，献血可能影响收入。",
    minDay: 25,
    choices: [
      {
        text: "🩸 献血救急",
        flag: "moral_blood_donate",
        score: 13,
        health: -5,
        fatigue: 12,
        fame: 3,
        msg: "护士说这袋血会马上送进手术室。你坐了很久才缓过来。",
        type: "success",
      },
      {
        text: "📢 转发求助，自己不献",
        flag: "moral_blood_share",
        score: 4,
        msg: "你把消息发到几个群里。也许会有人看到。",
        type: "info",
      },
      {
        text: "🚶 假装没看见",
        flag: "moral_blood_ignore",
        score: -4,
        msg: "你走过通知栏，脚步没有停。",
        type: "warning",
      },
    ],
  },
  {
    id: "extreme_overdose_stranger",
    title: "🚑 昏倒的陌生人",
    desc: "巷口有人倒在地上，旁边散着药瓶。围观的人都怕惹麻烦，只拿手机拍。",
    minDay: 24,
    choices: [
      {
        text: "📞 立刻报警叫救护车",
        flag: "moral_overdose_call",
        score: 12,
        fame: 2,
        msg: "救护车很快来了。医生说再晚一点就危险了。",
        type: "success",
      },
      {
        text: "🧍 留在旁边等专业人员",
        flag: "moral_overdose_wait",
        score: 8,
        happiness: 2,
        msg: "你没有乱动他，只一直确认他还在呼吸。",
        type: "success",
      },
      {
        text: "📱 拍视频发网上求助",
        flag: "moral_overdose_film",
        score: -8,
        fame: 6,
        happiness: -4,
        msg: "视频火了。评论里有人问：为什么不先打120？",
        type: "danger",
      },
    ],
  },
  {
    id: "extreme_delivery_crash",
    title: "🛵 外卖骑手撞倒孩子",
    desc: "一个外卖骑手为了赶时效撞倒了孩子。他求你帮忙作证说孩子突然冲出来，否则平台会扣光他这个月的钱。",
    minDay: 22,
    choices: [
      {
        text: "👁️ 如实作证",
        flag: "moral_delivery_truth",
        score: 10,
        fame: 2,
        msg: "交警记录了你的证词。骑手沉默地蹲在路边。",
        type: "success",
      },
      {
        text: "🛵 帮骑手圆谎",
        flag: "moral_delivery_lie",
        score: -12,
        happiness: -5,
        msg: "孩子家长哭着争辩。你避开了他们的眼睛。",
        type: "danger",
      },
      {
        text: "🤝 劝骑手承担责任，帮他联系众筹",
        flag: "moral_delivery_crowd",
        score: 12,
        fame: 3,
        msg: "他最后承认了责任。你帮他写了求助说明。",
        type: "success",
      },
    ],
  },
  {
    id: "extreme_safety_coverup",
    title: "🏗️ 工地安全事故",
    desc: "工地脚手架松动差点砸到人。负责人让你别说出去，今天给你双倍工资。",
    minDay: 30,
    choices: [
      {
        text: "💰 拿双倍工资闭嘴",
        flag: "moral_safety_silence",
        score: -15,
        cash: 600,
        happiness: -6,
        msg: "钱很快到账。你路过脚手架时不敢抬头。",
        type: "danger",
      },
      {
        text: "🚧 要求停工检修",
        flag: "moral_safety_stop",
        score: 13,
        fame: 4,
        msg: "工友们骂骂咧咧停了工，但下午真的查出断裂扣件。",
        type: "success",
      },
      {
        text: "📷 拍照匿名举报",
        flag: "moral_safety_report",
        score: 10,
        msg: "监管电话打到项目部，负责人脸色很难看。",
        type: "success",
      },
    ],
  },
  {
    id: "extreme_winter_child",
    title: "🧒 冬夜里的走失孩子",
    desc: "寒风里，一个孩子在公交站哭着找妈妈。你手机只剩5%电，今天最后一班车马上就到。",
    minDay: 18,
    choices: [
      {
        text: "👮 带孩子去派出所",
        flag: "moral_winter_child_help",
        score: 14,
        fatigue: 10,
        happiness: 5,
        msg: "末班车走了。孩子的母亲赶到派出所时几乎跪下来谢你。",
        type: "success",
      },
      {
        text: "📞 借路人手机报警后离开",
        flag: "moral_winter_child_call",
        score: 6,
        msg: "你看见警察接到孩子后才上车。手机彻底没电了。",
        type: "info",
      },
      {
        text: "🚌 赶末班车，让别人处理",
        flag: "moral_winter_child_leave",
        score: -10,
        happiness: -6,
        msg: "车窗上起了雾。那个小小的身影越来越远。",
        type: "warning",
      },
    ],
  },
  {
    id: "extreme_privacy_leak",
    title: "💾 一份客户名单",
    desc: "兼职公司把客户手机号和住址表发错给了你。有人愿意花¥1000买这份名单。",
    minDay: 26,
    choices: [
      {
        text: "🧹 删除文件并提醒公司",
        flag: "moral_privacy_delete",
        score: 12,
        fame: 2,
        msg: "负责人吓出一身冷汗，承诺补上数据权限。",
        type: "success",
      },
      {
        text: "💸 卖掉名单",
        flag: "moral_privacy_sell",
        score: -18,
        cash: 1000,
        happiness: -8,
        msg: "钱到账了。接下来几天你不断接到陌生推销电话。",
        type: "danger",
      },
      {
        text: "🕵️ 留着名单，以后也许有用",
        flag: "moral_privacy_keep",
        score: -10,
        happiness: -3,
        msg: "文件躺在手机里，像一颗没拆的雷。",
        type: "warning",
      },
    ],
  },
];

function applyExtremeMoralDelta(state, choice) {
  if (typeof choice.cash === "number") {
    state.resources.cash = Math.max(
      0,
      (state.resources.cash || 0) + choice.cash,
    );
  }
  if (typeof choice.happiness === "number") {
    state.needs.happiness = Math.max(
      0,
      Math.min(100, (state.needs.happiness || 0) + choice.happiness),
    );
  }
  if (typeof choice.hunger === "number") {
    state.needs.hunger = Math.max(
      0,
      Math.min(100, (state.needs.hunger || 0) + choice.hunger),
    );
  }
  if (typeof choice.fatigue === "number") {
    state.needs.fatigue = Math.max(
      0,
      Math.min(100, (state.needs.fatigue || 0) + choice.fatigue),
    );
  }
  if (typeof choice.health === "number") {
    state.status.health = Math.max(
      0,
      Math.min(100, (state.status.health || 0) + choice.health),
    );
  }
  if (typeof choice.fame === "number") {
    state.player.fame = Math.max(
      0,
      Math.min(100, (state.player.fame || 0) + choice.fame),
    );
  }
  StateManager.addMessage(choice.msg, choice.type || "info");
}

for (var emi = 0; emi < EXTREME_MORAL_EVENTS.length; emi++) {
  (function (eventDef) {
    MORAL_EVENTS.push({
      id: eventDef.id,
      title: eventDef.title,
      desc: eventDef.desc,
      minDay: eventDef.minDay || 10,
      dailyChance: eventDef.dailyChance || 0.025,
      choices: eventDef.choices.map(function (choiceDef) {
        return {
          text: choiceDef.text,
          flag: choiceDef.flag,
          score: choiceDef.score,
          immediate: function (state) {
            applyExtremeMoralDelta(state, choiceDef);
          },
        };
      }),
    });
  })(EXTREME_MORAL_EVENTS[emi]);
}

const MORAL_CONSEQUENCES = {
  moral_elder_helped: {
    id: "consequence_elder_helped",
    title: "🍊 老人带来的消息",
    delay: [4, 10],
    desc: function (s) {
      return "前些天你帮过的独居老人敲开门，说小区门口那家面馆在招夜班帮工，时薪比别处高两块，问你要不要去。";
    },
    apply: function (s) {
      if (!s.relationships) s.relationships = {};
      var r = s.relationships.elderNeighbor;
      if (!r) r = s.relationships.elderNeighbor = {};
      r.met = true;
      r.affinity = Math.min(100, (r.affinity || 0) + 6);
      s.flags._elderJobLead = true; // [联动flag] 求职/职业系统可消费（B→C 桥接）
      s.needs.happiness = Math.min(100, (s.needs.happiness || 0) + 4);
      StateManager.addMessage(
        "🍜 老人递来一张写着面馆地址的纸条。多了一条兼职线索。",
        "success",
      );
    },
  },
  moral_wallet_return: {
    id: "consequence_wallet_return",
    title: "📬 收到一封感谢信",
    delay: [5, 10],
    desc: function (s) {
      return "你收到了一封信：失主通过派出所联系到你，原来他是一家科技公司的HR，附了一张¥200购物卡和一张名片。";
    },
    apply: function (s) {
      s.resources.cash += 200;
      s.needs.happiness = Math.min(100, s.needs.happiness + 10);
      s.player.fame = Math.min(100, (s.player.fame || 0) + 5);
      StateManager.addMessage(
        "💌 失主寄来了感谢信和¥200购物卡！好人有好报。",
        "success",
      );
    },
  },
  moral_wallet_keep: {
    id: "consequence_wallet_keep",
    title: "😰 不安的梦",
    delay: [3, 6],
    desc: function (s) {
      return "你开始做噩梦，梦见警察敲你的门。虽然没人发现，但花那笔钱时总觉得不踏实。";
    },
    apply: function (s) {
      s.needs.happiness = Math.max(0, s.needs.happiness - 8);
      StateManager.addMessage(
        "😰 你连续几天睡不好，捡来的钱花着也不安心。",
        "warning",
      );
    },
  },
  moral_wallet_flaunt: {
    id: "consequence_wallet_flaunt",
    title: "🤳 朋友圈暴露了",
    delay: [2, 5],
    desc: function (s) {
      return "一个朋友认出了那个钱包！他跟失主有共同朋友。有人开始在背后议论你。";
    },
    apply: function (s) {
      s.player.fame = Math.max(0, (s.player.fame || 0) - 8);
      s.needs.happiness = Math.max(0, s.needs.happiness - 10);
      StateManager.addMessage(
        "🤳 朋友圈截图传开了，有人说你人品有问题...",
        "danger",
      );
    },
  },
  moral_beggar_feed: {
    id: "consequence_beggar_feed",
    title: "🎭 街角的惊喜",
    delay: [7, 14],
    desc: function (s) {
      return "几天后，那个老乞丐在街角叫住了你。他从破布袋里拿出一幅字画，说是年轻时收藏的，送给你当谢礼。";
    },
    apply: function (s) {
      var val = Random.int(100, 300);
      s.needs.happiness = Math.min(100, s.needs.happiness + 8);
      s.resources.cash += val;
      StateManager.addMessage(
        "🎨 老乞丐送你的字画卖了¥" + val + "！他说「好人会有好报」。",
        "success",
      );
    },
  },
  moral_change_return: {
    id: "consequence_change_return",
    title: "🛒 老主顾待遇",
    delay: [3, 7],
    desc: function (s) {
      return "再去那家小卖部时，老板对你特别热情，说你是少见的老实人。以后来买东西都给你抹零。";
    },
    apply: function (s) {
      s.resources.cash += 30;
      StateManager.addMessage(
        "🏪 老板塞给你一包零食：「你这样的年轻人不多了。」",
        "success",
      );
    },
  },
  moral_stop_thief: {
    id: "consequence_stop_thief",
    title: "📞 被救女士的谢礼",
    delay: [5, 8],
    desc: function (s) {
      return "被偷的那位女士辗转找到你，带了水果和¥200现金来感谢你的见义勇为。";
    },
    apply: function (s) {
      s.resources.cash += 200;
      s.player.fame = Math.min(100, (s.player.fame || 0) + 8);
      s.needs.happiness = Math.min(100, s.needs.happiness + 8);
      StateManager.addMessage(
        "🍎 那位女士带来了水果和¥200现金谢礼！",
        "success",
      );
    },
  },
  moral_thief_photo: {
    id: "consequence_thief_photo",
    title: "🏅 警方的感谢",
    delay: [4, 7],
    desc: function (s) {
      return "你用照片协助警方抓住了那个扒手！警方在社区公告上表扬了你（匿名）。";
    },
    apply: function (s) {
      s.player.fame = Math.min(100, (s.player.fame || 0) + 6);
      s.needs.happiness = Math.min(100, s.needs.happiness + 6);
      StateManager.addMessage("🏅 警方根据你提供的照片抓住了扒手。", "success");
    },
  },
  moral_honest_scale: {
    id: "consequence_honest_scale",
    title: "🔄 老顾客回头",
    delay: [3, 5],
    desc: function (s) {
      return "你的摊位因为有几位老顾客推荐，回头客越来越多。足斤足两的口碑开始传开。";
    },
    apply: function (s) {
      s.player.fame = Math.min(100, (s.player.fame || 0) + 5);
      s.needs.happiness = Math.min(100, s.needs.happiness + 5);
      StateManager.addMessage("📈 好口碑传开了，摆摊生意越来越好！", "success");
    },
  },
  moral_rig_scale: {
    id: "consequence_rig_scale",
    title: "🔍 有人举报了你",
    delay: [4, 8],
    desc: function (s) {
      return "市场监督来了！有人举报你缺斤短两。你被罚款并且被要求整改。";
    },
    apply: function (s) {
      s.resources.cash -= 200;
      s.player.fame = Math.max(0, (s.player.fame || 0) - 10);
      s.needs.happiness = Math.max(0, s.needs.happiness - 10);
      StateManager.addMessage("⚠️ 市监局突检！被罚¥200。", "danger");
    },
  },
  moral_phone_return: {
    id: "consequence_phone_return",
    title: "🎓 意外的帮助",
    delay: [7, 12],
    desc: function (s) {
      return "那个学生原来是计算机系的学霸。为了感谢你，他主动提出可以教你一些基础的编程技能。";
    },
    apply: function (s) {
      s.skills.coding.xp = Math.min(1000, (s.skills.coding.xp || 0) + 150);
      s.needs.happiness = Math.min(100, s.needs.happiness + 5);
      StateManager.addMessage("💻 学生教你编程！编程技能经验+150。", "success");
    },
  },
  moral_save_cat: {
    id: "consequence_save_cat",
    title: "🐈 新朋友",
    delay: [2, 4],
    desc: function (s) {
      return "那只流浪猫居然一路跟着你回了住处！它蹲在你门口，喵喵叫着不肯走。";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 12);
      StateManager.addMessage(
        "🐈 猫在你门口安了家！每天回来它都蹭你腿。",
        "success",
      );
    },
  },
  moral_push_car: {
    id: "consequence_push_car",
    title: "🛵 路边的巧遇",
    delay: [6, 10],
    desc: function (s) {
      return "有一天你走在路上，那个妈妈认出了你。她老公给了你一些进货渠道的建议。";
    },
    apply: function (s) {
      if (s.relationships && s.relationships.wholesaler) {
        s.relationships.wholesaler.affinity = Math.min(
          100,
          (s.relationships.wholesaler.affinity || 0) + 15,
        );
        s.relationships.wholesaler.met = true;
      }
      s.needs.happiness = Math.min(100, s.needs.happiness + 5);
      StateManager.addMessage(
        "🤝 她老公给了你一些进货建议，批发商关系+15。",
        "success",
      );
    },
  },
  moral_help_fallen: {
    id: "consequence_help_fallen",
    title: "📦 来自远方的礼物",
    delay: [6, 10],
    desc: function (s) {
      return "老人的儿女从国外寄来了感谢信和一盒进口巧克力。老人在社区里也逢人就夸你。";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 8);
      s.player.fame = Math.min(100, (s.player.fame || 0) + 6);
      StateManager.addMessage(
        "🍫 收到了巧克力！老人在社区夸你是个好孩子。",
        "success",
      );
    },
  },
  moral_fall_video: {
    id: "consequence_fall_video",
    title: "📱 翻车的评论区",
    delay: [2, 4],
    desc: function (s) {
      return "虽然视频有热度，但评论区不少人说你「光拍不帮」，让你很难受。";
    },
    apply: function (s) {
      s.needs.happiness = Math.max(0, s.needs.happiness - 8);
      StateManager.addMessage(
        "💬 评论区翻车了：「拍视频不救人，就为了流量？」",
        "warning",
      );
    },
  },
  moral_dog_feed: {
    id: "consequence_dog_feed",
    title: "🦴 忠诚的回报",
    delay: [3, 6],
    desc: function (s) {
      return "几天后的一个晚上，你回家路上被两个小混混拦住。那只流浪狗突然冲出来吠叫赶走了他们！";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 10);
      StateManager.addMessage("🐕 那只流浪狗保护了你！狗狗的报恩。", "success");
    },
  },
  moral_fraud_join: {
    id: "consequence_fraud_join",
    title: "🔎 财务审计来了",
    delay: [8, 15],
    desc: function (s) {
      return "公司突然开始抽查报销单！你心虚得不行。虽然这次没查到你的头上，但风险值和压力飙升。";
    },
    apply: function (s) {
      s.player.corporate.risk = Math.min(
        100,
        (s.player.corporate.risk || 0) + 10,
      );
      s.player.corporate.dignity = Math.max(
        0,
        (s.player.corporate.dignity || 60) - 10,
      );
      s.needs.happiness = Math.max(0, s.needs.happiness - 8);
      s.status.emotionalState = "stressed";
      StateManager.addMessage("🔎 财务抽查开始了！你提心吊胆...", "danger");
    },
  },
  moral_refuse_fraud: {
    id: "consequence_refuse_fraud",
    title: "📈 上司的注意",
    delay: [5, 10],
    desc: function (s) {
      return "你的正直被部门经理知道了。经理在周会上不点名地表扬了「某些同事坚持原则」。";
    },
    apply: function (s) {
      s.player.corporate.upwardMgmt = Math.min(
        100,
        (s.player.corporate.upwardMgmt || 20) + 10,
      );
      s.player.corporate.dignity = Math.min(
        100,
        (s.player.corporate.dignity || 60) + 5,
      );
      s.needs.happiness = Math.min(100, s.needs.happiness + 5);
      StateManager.addMessage("📈 经理在会上表扬了坚持原则的行为。", "success");
    },
  },
  // 新事件后果（v2）
  moral_atm_report: {
    id: "consequence_atm_report",
    title: "📞 失主打来的感谢电话",
    delay: [3, 7],
    desc: function (s) {
      return "银行通过预留信息联系到了失主，失主打来电话说那些钱是给孩子交学费的，感激不尽。";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 8);
      s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
      StateManager.addMessage(
        "📞 失主在电话里声音哽咽，说你是大恩人。",
        "success",
      );
    },
  },
  moral_atm_take: {
    id: "consequence_atm_guilt",
    title: "😰 银行调查的风声",
    delay: [4, 8],
    desc: function (s) {
      return "你听说那台ATM机的监控录像被调取了，虽然不确定会不会找到你，但每天都提心吊胆。";
    },
    apply: function (s) {
      s.needs.happiness = Math.max(0, s.needs.happiness - 10);
      StateManager.addMessage(
        "😰 你总是疑神疑鬼，听到警笛声就心跳加速。",
        "danger",
      );
    },
  },
  moral_cashier_return: {
    id: "consequence_cashier_return",
    title: "🥐 超市的善意小回馈",
    delay: [6, 12],
    desc: function (s) {
      return "今天再去那家超市时，那个收银员认出了你，笑着多给了你一盒牛奶。";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 5);
      StateManager.addMessage(
        "🥛 收银员冲你笑了笑，把一盒牛奶塞进了你的袋子。",
        "success",
      );
    },
  },
  moral_cat_rescue: {
    id: "consequence_cat_rescue",
    title: "🐱 小猫康复了",
    delay: [7, 14],
    desc: function (s) {
      return "宠物医院打来电话，说那只小猫的腿保住了，已经有人愿意领养。医院说你是它的大恩人。";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 12);
      s.player.fame = Math.min(100, (s.player.fame || 0) + 2);
      StateManager.addMessage(
        "🐱 听到小猫康复的消息，你整整开心了一天。",
        "success",
      );
    },
  },
  moral_child_help: {
    id: "consequence_child_help",
    title: "🎁 意外的感谢",
    delay: [5, 12],
    desc: function (s) {
      return "那位母亲通过商场监控找到了你的联系方式，邀请你去她家开的餐馆免费吃一顿。";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 8);
      s.player.fame = Math.min(100, (s.player.fame || 0) + 4);
      StateManager.addMessage(
        "🎫 她盛情难却，你在她家餐馆吃了一顿大餐，分文不收。",
        "success",
      );
    },
  },
  moral_crosswalk_wait: {
    id: "consequence_crosswalk_wait",
    title: "🚔 意外的考察",
    delay: [3, 5],
    desc: function (s) {
      return "深夜那个路口，路边一辆不起眼的车里坐着一位下班的交警，他看到了你等红灯的全过程。";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 3);
      StateManager.addMessage(
        "👮 交警摇下车窗给你竖了个大拇指：「好样的！」",
        "success",
      );
    },
  },
  // ====== 批次D后果链（8个新事件） ======
  moral_scan_honest: {
    id: "consequence_scan_honest",
    title: "⭐ 收银员的信任",
    delay: [4, 8],
    desc: function (s) {
      return "几天后你再去那家超市，自助结账区的员工认出了你。她笑着说上次监控看到你多拿了巧克力回来扫码，说像你这样的人不多了。";
    },
    apply: function (s) {
      s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
      s.needs.happiness = Math.min(100, s.needs.happiness + 5);
      StateManager.addMessage(
        "⭐ 被超市员工记住了！她说以后有内部优惠会通知你。",
        "success",
      );
    },
  },
  moral_scan_steal: {
    id: "consequence_scan_steal",
    title: "😰 超市的黑名单",
    delay: [5, 10],
    desc: function (s) {
      return "你再去那家超市时，发现入口处多了一个摄像头。你总觉得有人在盯着你，那盒巧克力吃在嘴里也不香。";
    },
    apply: function (s) {
      s.needs.happiness = Math.max(0, s.needs.happiness - 6);
      StateManager.addMessage(
        "😰 每次路过那家超市你都绕着走，心虚得很。",
        "warning",
      );
    },
  },
  moral_taxi_fix: {
    id: "consequence_taxi_fix",
    title: "🚕 司机的老主顾待遇",
    delay: [5, 10],
    desc: function (s) {
      return "有次你在路边等车，上次那个出租车司机正好经过，认出了你，主动停下说「顺路带你一程，免费的！」";
    },
    apply: function (s) {
      s.resources.cash += 20;
      s.needs.happiness = Math.min(100, s.needs.happiness + 5);
      StateManager.addMessage(
        "🚕 司机正好顺路，免费捎了你一段！省了¥20。",
        "success",
      );
    },
  },
  moral_taxi_tip: {
    id: "consequence_taxi_tip",
    title: "🗺️ 司机的城市攻略",
    delay: [3, 7],
    desc: function (s) {
      return "那位出租车司机对这座城市了如指掌。他告诉你几个城中村附近最便宜的菜市场时段和隐藏的免费饮水点。";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 4);
      s.player.intelligence = Math.min(100, (s.player.intelligence || 0) + 2);
      StateManager.addMessage(
        "🗺️ 司机的攻略很有用！以后日用品支出略有降低。",
        "hint",
      );
    },
  },
  moral_cheat_warn: {
    id: "consequence_cheat_warn",
    title: "🤝 朋友的感谢",
    delay: [3, 6],
    desc: function (s) {
      return "考试结束后，朋友找到你，说还好你提醒了。他请你吃了顿饭，说以后有什么需要帮忙的尽管开口。";
    },
    apply: function (s) {
      s.needs.hunger = Math.min(100, (s.needs.hunger || 50) + 25);
      s.needs.happiness = Math.min(100, s.needs.happiness + 5);
      StateManager.addMessage("🍜 朋友请吃了顿饭，两人关系更好了。", "success");
    },
  },
  moral_cheat_report: {
    id: "consequence_cheat_report",
    title: "🏷️ 告密者的标签",
    delay: [5, 10],
    desc: function (s) {
      return "考场那件事传开了。虽然老师表扬了你，但其他同学开始疏远你。有人在背后叫你「举报侠」。";
    },
    apply: function (s) {
      s.needs.happiness = Math.max(0, s.needs.happiness - 8);
      s.player.fame = Math.max(0, (s.player.fame || 0) - 3);
      StateManager.addMessage("🏷️ 同学群里的聊天开始避开你了。", "warning");
    },
  },
  moral_book_pay: {
    id: "consequence_book_pay",
    title: "📚 图书馆特别借阅权",
    delay: [6, 12],
    desc: function (s) {
      return "图书馆管理员记住了你的诚实，给了你一张「特别借阅卡」，可以借阅教师参考区的书籍。";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 4);
      s.player.intelligence = Math.min(100, (s.player.intelligence || 0) + 3);
      StateManager.addMessage(
        "📚 有了特别借阅卡！学习效率小幅提升。",
        "success",
      );
    },
  },
  moral_book_hide: {
    id: "consequence_book_hide",
    title: "📬 图书馆的催赔通知",
    delay: [3, 7],
    desc: function (s) {
      return "图书馆发来短信：您归还的图书有严重污损，请尽快到馆处理赔偿事宜。逾期将影响信用记录。";
    },
    apply: function (s) {
      s.resources.cash -= 68;
      s.needs.happiness = Math.max(0, s.needs.happiness - 6);
      s.player.fame = Math.max(0, (s.player.fame || 0) - 2);
      StateManager.addMessage(
        "📬 终于还是被发现了，赔了¥68还得写检讨。早知道当初主动承认就好了。",
        "danger",
      );
    },
  },
  moral_scrape_note: {
    id: "consequence_scrape_note",
    title: "🤝 不打不相识",
    delay: [4, 8],
    desc: function (s) {
      return "车主打电话来了！你做好了大吵一架的准备，没想到对方说「刮得不算深，你留了纸条说明人品好，算了不用赔了。」";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 12);
      s.player.fame = Math.min(100, (s.player.fame || 0) + 5);
      StateManager.addMessage(
        "🤝 车主竟然说算了！「现在诚实的人太少，你这朋友我交了。」",
        "success",
      );
    },
  },
  moral_scrape_flee: {
    id: "consequence_scrape_flee",
    title: "🚔 监控找上门",
    delay: [5, 10],
    desc: function (s) {
      return "几天后两个穿制服的人敲了你的门——巷子里有监控。车主报了警，监控拍到了你的背影。";
    },
    apply: function (s) {
      s.resources.cash -= 300;
      s.player.fame = Math.max(0, (s.player.fame || 0) - 5);
      s.needs.happiness = Math.max(0, s.needs.happiness - 10);
      StateManager.addMessage(
        "🚔 被找到了！赔了¥300。不但花了钱，脸也丢光了。",
        "danger",
      );
    },
  },
  moral_scam_stop: {
    id: "consequence_scam_stop",
    title: "📰 上了社区好人榜",
    delay: [7, 14],
    desc: function (s) {
      return "银行把你的见义勇为上报了社区。居委会在公告栏贴了表扬信，还给了你一面「防诈骗先锋」的小锦旗。";
    },
    apply: function (s) {
      s.player.fame = Math.min(100, (s.player.fame || 0) + 8);
      s.needs.happiness = Math.min(100, s.needs.happiness + 10);
      s.resources.cash += 100;
      StateManager.addMessage(
        "📰 社区给了¥100奖励和一面锦旗！老奶奶的家人也打来电话道谢。",
        "success",
      );
    },
  },
  moral_scam_ignore: {
    id: "consequence_scam_ignore",
    title: "😔 后悔的新闻",
    delay: [7, 14],
    desc: function (s) {
      return "几天后你看到本地新闻：一位老人被冒充公检法的诈骗团伙骗走了毕生积蓄¥30多万。新闻画面里那个银行门口很眼熟。";
    },
    apply: function (s) {
      s.needs.happiness = Math.max(0, s.needs.happiness - 12);
      StateManager.addMessage(
        "😔 新闻里的老人和那天在ATM机前的老人很像。你后悔了很久。",
        "danger",
      );
    },
  },
  moral_borrow_again: {
    id: "consequence_borrow_again",
    title: "💸 邻居终于还钱了",
    delay: [12, 20],
    desc: function (s) {
      return "过了很久，久到你都忘了这件事。邻居突然敲你的门，把一叠现金塞到你手里：「兄弟对不住，拖了这么久。」";
    },
    apply: function (s) {
      var total = s.flags._neighborDebt || 350;
      s.resources.cash += total;
      s.needs.happiness = Math.min(100, s.needs.happiness + 8);
      StateManager.addMessage(
        "💸 邻居还了¥" + total + "！他找了份新工作，说谢谢你当时的信任。",
        "success",
      );
    },
  },
  moral_vending_report: {
    id: "consequence_vending_report",
    title: "🥤 售货机公司的答谢",
    delay: [3, 5],
    desc: function (s) {
      return "维修人员检查后发现是机器故障。公司在系统里给你的账户充了¥10余额作为诚信奖励。";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 4);
      StateManager.addMessage(
        "🥤 账户多了¥10余额。客服说「像您这样的用户是我们的财富。」",
        "success",
      );
    },
  },

  // === Review 扩展（2026-06-23）：补足缺失的 6 个后续 ===
  moral_beggar_coin: {
    id: "consequence_beggar_coin",
    title: "🥡 路边的回响",
    delay: [4, 9],
    desc: function () {
      return "路过那个十字路口，乞讨的老人对你笑了笑——他记住了那枚硬币。旁边小卖部老板说：「这老头其实是失独的，每周固定来这儿。」";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 3);
      StateManager.addMessage("🌿 那一枚硬币，让你心里暖了一下。", "info");
    },
  },
  moral_beggar_ignore: {
    id: "consequence_beggar_ignore",
    title: "🌧️ 路过的犹豫",
    delay: [3, 7],
    desc: function () {
      return "你又一次路过那个角落，乞讨的位置空了——也许搬走了，也许更糟。你说不清自己心里的那点不安从何而来。";
    },
    apply: function (s) {
      s.needs.happiness = Math.max(0, s.needs.happiness - 3);
      s.player.mental = Math.max(1, (s.player.mental || 0) - 1);
      StateManager.addMessage("☁️ 一阵说不清的情绪压过来。", "warning");
    },
  },
  moral_change_keep: {
    id: "consequence_change_keep",
    title: "📲 收款码的提醒",
    delay: [5, 10],
    desc: function () {
      return "你扫小店买东西时，收银员盯了你两秒：「上次你少给了几块钱吧？」语气没什么火药味，但你脸有点烫。";
    },
    apply: function (s) {
      s.player.fame = Math.max(0, (s.player.fame || 0) - 2);
      s.needs.happiness = Math.max(0, s.needs.happiness - 4);
      StateManager.addMessage(
        "😳 你赶紧补给了对方，但小店从此再没去过。",
        "warning",
      );
    },
  },
  moral_cat_feed: {
    id: "consequence_cat_feed",
    title: "🐈 楼下小常客",
    delay: [6, 12],
    desc: function () {
      return "那只你喂过的橘猫现在会蹲在你回家的路上。邻居看见你蹲下抚摸它，开始和你打招呼。";
    },
    apply: function (s) {
      s.needs.happiness = Math.min(100, s.needs.happiness + 6);
      s.player.mental = Math.min(100, (s.player.mental || 0) + 2);
      StateManager.addMessage(
        "🐱 有个小生命在等你回家，疲惫减轻了一点。",
        "success",
      );
    },
  },
  moral_borrow_iou: {
    id: "consequence_borrow_iou",
    title: "🧾 那张借条",
    delay: [20, 45],
    desc: function () {
      return "你抽屉里那张借条——对方主动联系，把钱还给了你，还多塞了一盒水果。「写借条这事让我重新审视了自己。」他说。";
    },
    apply: function (s) {
      s.resources.cash += 500;
      s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
      s.needs.happiness = Math.min(100, s.needs.happiness + 5);
      StateManager.addMessage("💰 朋友还了¥500，还多了一份信任。", "success");
    },
  },
  moral_colleague_snitch: {
    id: "consequence_colleague_snitch",
    title: "🥶 办公室的冷空气",
    delay: [5, 12],
    desc: function () {
      return "你打小报告这件事不知怎么传开了。几个原本和你聊得来的同事开始绕着走，连茶水间都安静了。";
    },
    apply: function (s) {
      s.player.fame = Math.max(0, (s.player.fame || 0) - 5);
      s.needs.happiness = Math.max(0, s.needs.happiness - 8);
      s.player.mental = Math.max(1, (s.player.mental || 0) - 2);
      StateManager.addMessage(
        "🧊 同事关系冻住了，孤立感慢慢爬上来。",
        "warning",
      );
    },
  },

  // ====== [v3.3 W1-T4] 4 条新 followup ======
  moral_phone_sell: {
    id: "consequence_phone_sell",
    title: "📱 二手贩子追上门",
    delay: [4, 9],
    desc: function (s) {
      return "你卖手机的二手贩子被警察盯上了，他供出了几个上家。一个警察在你常去的街口蹲了两天。";
    },
    apply: function (s) {
      s.player.fame = Math.max(0, (s.player.fame || 0) - 10);
      s.needs.happiness = Math.max(0, s.needs.happiness - 12);
      s.flags.moral = s.flags.moral || {};
      s.flags.moral.score = Math.max(-100, (s.flags.moral.score || 0) - 2);
      s.flags._policeWatch = (s.flags._policeWatch || 0) + 1;
      StateManager.addMessage(
        "🚓 警察打听过你的事。你慌得几晚没睡好。",
        "danger",
      );
    },
  },
  moral_thief_ignore: {
    id: "consequence_thief_ignore",
    title: "👀 被偷的是熟人",
    delay: [3, 7],
    desc: function (s) {
      return "你后来才听说，那天被偷的人是隔壁摊主家的弟弟。摊主隐约知道你当时在场。";
    },
    apply: function (s) {
      s.player.fame = Math.max(0, (s.player.fame || 0) - 5);
      s.needs.happiness = Math.max(0, s.needs.happiness - 6);
      s.flags.moral = s.flags.moral || {};
      s.flags.moral.score = Math.max(-100, (s.flags.moral.score || 0) - 1);
      StateManager.addMessage(
        "😶 摊主见你时眼神奇怪了一下，没多说。",
        "warning",
      );
    },
  },
  moral_fall_ignore: {
    id: "consequence_fall_ignore",
    title: "📹 监控调出来了",
    delay: [5, 11],
    desc: function (s) {
      return "那位摔倒的老人后来住院了。家属调监控时，看见你从旁边绕过去——视频被传到了社区群。";
    },
    apply: function (s) {
      s.player.fame = Math.max(0, (s.player.fame || 0) - 12);
      s.needs.happiness = Math.max(0, s.needs.happiness - 10);
      s.flags.moral = s.flags.moral || {};
      s.flags.moral.score = Math.max(-100, (s.flags.moral.score || 0) - 3);
      StateManager.addMessage(
        "📵 你出门时听见有人窃窃私语。社区群有你的截图。",
        "danger",
      );
    },
  },
  moral_atm_warn: {
    id: "consequence_atm_warn",
    title: "🙏 被救者上门致谢",
    delay: [6, 12],
    desc: function (s) {
      return "你发的那条朋友圈被转发了上百次，有人私信感谢你说她母亲差点被骗，多亏看到提醒才没转账。";
    },
    apply: function (s) {
      s.resources.cash += 100;
      s.needs.happiness = Math.min(100, s.needs.happiness + 12);
      s.player.fame = Math.min(100, (s.player.fame || 0) + 6);
      s.flags.moral = s.flags.moral || {};
      s.flags.moral.score = Math.min(100, (s.flags.moral.score || 0) + 2);
      StateManager.addMessage(
        "🍎 阿姨塞给你¥100红包+两盒水果。社区有人开始记住你的名字。",
        "success",
      );
    },
  },
};

// ====== 触发逻辑 ======

/** 随机触发一个道德事件（在consumeAP中调用）。返回true表示触发了 */
function triggerMoralEvent(state) {
  // 每日最多一次
  var todayActions = (state.flags.moral.actions || []).filter(function (a) {
    return a.day === state.player.day;
  });
  if (todayActions.length > 0) return false;

  var hasWalletAction = (state.flags.moral.actions || []).some(function (a) {
    return a.id === "found_wallet";
  });

  var eligible = [];
  for (var i = 0; i < MORAL_EVENTS.length; i++) {
    var evt = MORAL_EVENTS[i];
    if (evt.minDay && state.player.day < evt.minDay) continue;
    if (evt.condition && !evt.condition(state)) continue;
    if (
      (state.flags.moral.actions || []).some(function (a) {
        return a.id === evt.id;
      })
    )
      continue;
    if (
      hasWalletAction &&
      (evt.id === "found_phone" || evt.id === "found_wallet")
    )
      continue;
    eligible.push(evt);
  }
  if (eligible.length === 0) return false;

  var evt = Random.fromArray(eligible);
  if (!Random.chance(evt.dailyChance)) return false;

  // 构建选择按钮
  var buttons = evt.choices.map(function (choice) {
    return {
      text: choice.text,
      cls: "btn-primary",
      callback: function () {
        var s = StateManager.getState();
        if (!s.flags.moral.actions) s.flags.moral.actions = [];
        s.flags.moral.actions.push({
          id: evt.id,
          choice: choice.flag,
          score: choice.score,
          day: s.player.day,
        });
        s.flags.moral.score = Math.max(
          -100,
          Math.min(100, (s.flags.moral.score || 0) + choice.score),
        );
        if (choice.immediate) choice.immediate(s);
        var consequenceDef = MORAL_CONSEQUENCES[choice.flag];
        if (consequenceDef) {
          if (!s.flags.moral.pendingConsequences)
            s.flags.moral.pendingConsequences = [];
          var delay = Random.int(
            consequenceDef.delay[0],
            consequenceDef.delay[1],
          );
          s.flags.moral.pendingConsequences.push({
            eventId: consequenceDef.id,
            actionId: choice.flag,
            dueDay: s.player.day + delay,
          });
        }
        renderAll();
      },
    };
  });

  showModal({
    title: evt.title,
    body: '<p style="line-height:1.7;">' + evt.desc + "</p>",
    buttons: buttons,
  });
  return true;
}

/** 每日检查并触发待处理的道德后果（在 daily_pipeline 中调用） */
function checkMoralConsequences(state) {
  var pending = state.flags.moral.pendingConsequences;
  if (!pending || pending.length === 0) return;

  var due = [],
    remaining = [];
  for (var i = 0; i < pending.length; i++) {
    if (pending[i].dueDay <= state.player.day) due.push(pending[i]);
    else remaining.push(pending[i]);
  }
  state.flags.moral.pendingConsequences = remaining;

  for (var di = 0; di < due.length; di++) {
    var con = due[di];
    var action = (state.flags.moral.actions || []).find(function (a) {
      return a.choice === con.actionId;
    });
    if (!action) continue;
    var consequenceDef = MORAL_CONSEQUENCES[con.actionId];
    if (!consequenceDef) continue;

    var descText =
      typeof consequenceDef.desc === "function"
        ? consequenceDef.desc(state)
        : consequenceDef.desc;
    showModal({
      title: consequenceDef.title,
      body: '<p style="line-height:1.7;">' + descText + "</p>",
      buttons: [
        {
          text: "知道了",
          cls: "btn-primary",
          callback: function () {
            var s2 = StateManager.getState();
            consequenceDef.apply(s2);
            renderAll();
          },
        },
      ],
    });
  }
}

function getMoralLevelName(score) {
  if (score >= 80) return "圣贤";
  if (score >= 50) return "善良";
  if (score >= 20) return "正直";
  if (score >= -10) return "普通人";
  if (score >= -40) return "自私";
  if (score >= -70) return "冷漠";
  return "堕入黑暗";
}

function getMoralEmoji(score) {
  if (score >= 50) return "😇";
  if (score >= 20) return "👍";
  if (score >= -10) return "😐";
  if (score >= -40) return "😒";
  return "👿";
}

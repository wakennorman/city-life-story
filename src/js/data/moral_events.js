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
      return s.trade.currentLocation === "commercialDist";
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
          StateManager.addMessage(
            "🔧 你调了秤...今天确实多赚了，但总觉得有人在盯着你。",
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
    minDay: 4,
    dailyChance: 0.04,
    condition: function (s) {
      return (
        s.weather &&
        (s.weather.current === "rainy" || s.weather.current === "stormy")
      );
    },
    choices: [
      {
        text: "🍖 买根火腿肠喂它，引到避雨处",
        flag: "moral_dog_feed",
        score: 8,
        immediate: function (s) {
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
    desc: "你路过茶水间，看到同事老张正躲在角落里刷短视频。最近公司业绩不好，总监正在抓典型。他看到你，尴尬地笑了笑。你", // 后续在desc中
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
          s.player.corporate.upward = Math.min(
            100,
            (s.player.corporate.upward || 0) + 3,
          );
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
          s.resources.cash += Random.int(10, 20);
          s.needs.fatigue = Math.min(100, s.needs.fatigue + 3);
          StateManager.addMessage(
            "💰 他犹豫了一下，给了你¥" + ((s.resources.cash % 20) + 10) + "。",
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
];

const MORAL_CONSEQUENCES = {
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

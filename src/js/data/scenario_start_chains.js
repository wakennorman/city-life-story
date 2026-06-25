/**
 * 剧本专属开局事件链 — Scenario Start Chains
 *
 * 每个剧本定义 3-5 天专属开局剧情链，在游戏前几日逐天触发，
 * 引导玩家进入角色叙事弧线。每个事件含多个选择项，影响后续发展。
 *
 * 设计参考：《This War of Mine》开场叙事 / 极乐迪斯科 角色背景
 *
 * 接线：
 *   main.js startScenarioGame 设置 state.flags._currentScenario
 *   daily_pipeline.js 新增 scenario_start_chain 步骤
 *   index.html 在 scenarios.js 后注册
 */

(function () {
  "use strict";

  // ====== 开局事件链定义 ======
  // key: scenarioId, value: 按天索引的事件数组（dayOffset: 1/2/3/4）
  var CHAINS = {
    // ====== 1) 经典模式·城市务工者（3天） ======
    classic: [
      {
        dayOffset: 1,
        icon: "🏚️",
        title: "桥洞下的第一夜",
        story:
          "城中村的桥洞下，你裹着捡来的纸板勉强睡了第一夜。凌晨四点被冻醒，胃里空荡荡的。这座城市看起来很大，却没有你的容身之处。\n\n天快亮了，你得决定今天做什么。",
        choices: [
          {
            text: "早起找工",
            hint: "早点出门机会多",
            apply: function (st) {
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
              StateManager.addMessage(
                "🌅 天还没亮你就出发了。这座城市不会等睡懒觉的人。",
                "info",
              );
            },
          },
          {
            text: "去工地碰运气",
            hint: "体力活，来钱快",
            apply: function (st) {
              st.player.physique = Math.min(100, (st.player.physique || 0) + 1);
              StateManager.addMessage(
                "🏗️ 工地上的工头看了看你的身板，点了点头。",
                "info",
              );
            },
          },
          {
            text: "找老乡帮忙",
            hint: "看看有没有熟人",
            apply: function (st) {
              if (st.relationships && st.relationships.aunt_wang) {
                st.relationships.aunt_wang.affinity = Math.min(
                  100,
                  (st.relationships.aunt_wang.affinity || 0) + 5,
                );
              }
              StateManager.addMessage(
                "💬 老乡说这几天没什么好活，但给你指了条路——去批发市场看看。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 2,
        icon: "🍜",
        title: "第一份零工",
        story:
          "你找到了今天的活——帮一家小餐馆搬货。老板看你年轻力壮，给了你一份日结的搬运活。\n\n干完活，你捏着几张皱巴巴的钞票，开始想接下来怎么办。",
        choices: [
          {
            text: "体力考验",
            hint: "搬完货体质+1，但疲劳+15",
            apply: function (st) {
              st.player.physique = Math.min(100, (st.player.physique || 0) + 1);
              var earn = Random.int(60, 120);
              st.resources.cash = (st.resources.cash || 0) + earn;
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
              st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 10);
              StateManager.addMessage(
                "💪 搬了一天货，腰酸背痛，但赚了 ¥" +
                  earn +
                  "。第一笔靠自己挣的钱。",
                "success",
              );
            },
          },
          {
            text: "问老板有没有长期工",
            hint: "稳定比什么都重要",
            apply: function (st) {
              st.flags._restaurantConnection = true;
              StateManager.addMessage(
                "🍜 老板说下周可能缺个帮厨，让你到时候再来问问。有希望。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 3,
        icon: "🏠",
        title: "找到落脚处",
        story:
          "两天下来，你认识到露宿街头不是长久之计。城中村有间出租屋，¥15/天，虽然条件差但至少有张床。\n\n可如果租了房，手里的钱就更紧了。",
        choices: [
          {
            text: "租房",
            hint: "¥15/天，安全有保障",
            apply: function (st) {
              st.housing.tier = 1;
              st.inventory.capacity = Math.max(st.inventory.capacity || 20, 50);
              if (st.resources.cash >= 15) st.resources.cash -= 15;
              StateManager.addMessage(
                "🏠 虽然只是间不到10平米的隔间，但至少有个能遮风挡雨的地方了。",
                "info",
              );
            },
          },
          {
            text: "继续露宿省钱",
            hint: "省下的钱可以干别的",
            apply: function (st) {
              st.flags._sleptRoughThreeDays = true;
              StateManager.addMessage(
                "😤 你咬咬牙，决定再撑几天。省下的每一分钱都有用。",
                "info",
              );
            },
          },
        ],
      },
    ],

    // ====== 2) 下岗再就业（4天） ======
    laid_off: [
      {
        dayOffset: 1,
        icon: "💰",
        title: "遣散费怎么花",
        story:
          "工厂关了。你领到了最后一笔遣散费，站在工厂门口，看着十五年青春换来的这台旧机器被拆走。\n\n这笔钱是你在这座城市最后的底气，得精打细算。",
        choices: [
          {
            text: "存银行",
            hint: "安全，有点利息",
            apply: function (st) {
              st.resources.bankBalance = (st.resources.bankBalance || 0) + 2000;
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
              StateManager.addMessage(
                "🏦 存了¥2000到银行。虽然利息不高，但至少安全。",
                "info",
              );
            },
          },
          {
            text: "买工具",
            hint: "工具在手，活路不愁",
            apply: function (st) {
              st.flags._hasToolkit = true;
              StateManager.addMessage(
                "🔧 买了套二手工具。技术工人的家伙不能丢。",
                "info",
              );
            },
          },
          {
            text: "付房租",
            hint: "先把住的地方稳住",
            apply: function (st) {
              st.housing.tier = Math.max(st.housing.tier || 0, 1);
              StateManager.addMessage(
                "🏠 把房租交了，至少这个月不用睡大街。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 2,
        icon: "📋",
        title: "技能摸底",
        story:
          "在工厂干了十五年，你突然发现自己除了那台机器，好像什么都不会。但仔细想想——你其实会很多。\n\n你开始整理自己这些年积累的本事。",
        choices: [
          {
            text: "发挥动手能力",
            hint: "修理技能+5",
            apply: function (st) {
              if (st.skills && st.skills.repair)
                st.skills.repair.xp = (st.skills.repair.xp || 0) + 50;
              StateManager.addMessage(
                "🔩 你想起自己修过无数台机器，手艺还在。",
                "info",
              );
            },
          },
          {
            text: "学新东西",
            hint: "智力+2",
            apply: function (st) {
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 0) + 2,
              );
              StateManager.addMessage(
                "📖 时代变了，你得学点新东西才能活下去。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 3,
        icon: "🔄",
        title: "转型尝试",
        story:
          "你站在街头，看着外卖骑手和摆摊的小贩来来往往。这些活你以前从没想过要干，但现在，活下来比面子重要。",
        choices: [
          {
            text: "试试摆摊",
            hint: "小本生意，自由",
            apply: function (st) {
              st.flags._triedStall = true;
              StateManager.addMessage(
                "📦 在路边支了个小摊，虽然只卖出去几样东西，但至少开了张。",
                "info",
              );
            },
          },
          {
            text: "注册外卖骑手",
            hint: "多劳多得",
            apply: function (st) {
              var earn = Random.int(80, 150);
              st.resources.cash = (st.resources.cash || 0) + earn;
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
              StateManager.addMessage(
                "🛵 跑了一天外卖，挣了 ¥" + earn + "。腿都快断了，但心里踏实。",
                "info",
              );
            },
          },
          {
            text: "做家政",
            hint: "稳定，不挑人",
            apply: function (st) {
              var earn = Random.int(50, 100);
              st.resources.cash = (st.resources.cash || 0) + earn;
              StateManager.addMessage(
                "🧹 帮人打扫了一天的卫生，挣了 ¥" +
                  earn +
                  "。虽然不体面，但靠自己。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 4,
        icon: "🌱",
        title: "适应期",
        story:
          "几天下来，你多少摸到了这座城市的脉搏。新生活虽然不容易，但也不是过不下去。\n\n接下来的路，你打算怎么走？",
        choices: [
          {
            text: "坚持这个方向",
            hint: "熟能生巧",
            apply: function (st) {
              st.flags._stickToNewPath = true;
              StateManager.addMessage(
                "💪 你决定坚持下去。万事开头难，但你已经开了头。",
                "info",
              );
            },
          },
          {
            text: "换方向试试",
            hint: "多试试，总能找到合适的",
            apply: function (st) {
              st.player.agility = Math.min(100, (st.player.agility || 0) + 2);
              StateManager.addMessage(
                "🔄 转行不丢人，死磕才丢人。你觉得自己更适合干别的。",
                "info",
              );
            },
          },
        ],
      },
    ],

    // ====== 3) 小镇做题家（4天） ======
    small_town_grinder: [
      {
        dayOffset: 1,
        icon: "🏙️",
        title: "出租屋的第一夜",
        story:
          "你拖着行李箱走进了那间在网上找到的合租房。室友是个做销售的小哥，屋里堆满了外卖盒。\n\n这就是大城市的生活——¥800一个月，隔音极差，隔壁的呼噜声清晰可闻。",
        choices: [
          {
            text: "和室友套近乎",
            hint: "打好关系，了解城市",
            apply: function () {
              StateManager.addMessage(
                "🗣️ 室友说在这城市混了三年，换了五份工作。「这里机会多，但也吃人。」",
                "info",
              );
            },
          },
          {
            text: "收拾房间，开始学习",
            hint: "明天就要投简历了",
            apply: function (st) {
              st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
              StateManager.addMessage(
                "📚 你把桌子擦干净，摆好电脑。明天开始，要拼命了。",
                "info",
              );
            },
          },
          {
            text: "出门逛逛",
            hint: "熟悉周边环境",
            apply: function () {
              StateManager.addMessage(
                "🚶 楼下有家24小时便利店，隔壁是房产中介，再走五百米是地铁站。这座城市从今晚开始就是你的战场。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 2,
        icon: "📝",
        title: "投简历",
        story:
          "你打开招聘软件，发现自己的学历在简历海里根本不起眼。那些要求「985/211」的岗位，你连投递的勇气都没有。\n\n但总得试试。",
        choices: [
          {
            text: "海投",
            hint: "广撒网，总有一个回音",
            apply: function () {
              StateManager.addMessage(
                "📤 投了三十多份简历，回复的寥寥无几。这就是现实的重量。",
                "info",
              );
            },
          },
          {
            text: "精准投递",
            hint: "针对目标公司做功课",
            apply: function (st) {
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 0) + 1,
              );
              StateManager.addMessage(
                "🎯 你挑了几家有前景的小公司，认真改了简历发出去。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 3,
        icon: "👔",
        title: "面试",
        story:
          "终于有公司约你面试了。你换上唯一一件像样的衬衫，挤了四十分钟地铁赶到写字楼。\n\n面试官比你想象中年轻，问题比你想象中尖锐。",
        choices: [
          {
            text: "自信回答",
            hint: "展现真实水平",
            apply: function (st) {
              if (Random.chance(0.5)) {
                st.flags._interviewPassed = true;
                StateManager.addMessage(
                  "🎉 面试官对你的表现表示满意，让你等二面通知。",
                  "success",
                );
              } else {
                StateManager.addMessage(
                  "😔 有些问题答不上来，你意识到学校里学的东西和现实差距很大。",
                  "warning",
                );
              }
            },
          },
          {
            text: "坦诚不足，表达学习意愿",
            hint: "态度也很重要",
            apply: function (st) {
              st.flags._interviewPassed = true;
              st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
              StateManager.addMessage(
                "🙏 你坦诚自己经验不足但愿意学。面试官点头说「态度很重要」。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 4,
        icon: "💼",
        title: "第一份工作",
        story:
          "不管面试结果如何，你找到了在这个城市的第一份工作——虽然不是理想中的大厂，但至少是个开始。\n\n你明白了一件事：罗马不是一天建成的，你也一样。",
        choices: [
          {
            text: "先做再说",
            hint: "积累经验最重要",
            apply: function (st) {
              st.flags._firstJobFound = true;
              StateManager.addMessage(
                "🏢 虽然工资不高，但这第一步，你终于踏出去了。",
                "info",
              );
            },
          },
          {
            text: "边做边找更好的",
            hint: "骑驴找马",
            apply: function (st) {
              st.player.agility = Math.min(100, (st.player.agility || 0) + 1);
              StateManager.addMessage(
                "🔍 你决定先干着，但简历继续投。不能在一棵树上吊死。",
                "info",
              );
            },
          },
        ],
      },
    ],

    // ====== 4) 外来打工者（4天） ======
    foreign_worker: [
      {
        dayOffset: 1,
        icon: "🏢",
        title: "宿舍里的老乡们",
        story:
          "工厂宿舍八人间，上铺下铺挤得满满当当。室友们说着你听不太懂的方言，有人递过来一支烟。\n\n你第一次离开家这么远，心里有点慌，但更多的是对未来的模糊期待。",
        choices: [
          {
            text: "和老乡聊天",
            hint: "了解工厂情况",
            apply: function () {
              StateManager.addMessage(
                "🗣️ 老乡说这厂子虽然累，但加班费给得实在。一个月能攒下三四千。",
                "info",
              );
            },
          },
          {
            text: "给家里打电话",
            hint: "报个平安",
            apply: function (st) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
              StateManager.addMessage(
                "📞 电话那头妈妈的声音有点哽咽。你说一切都好，挂了电话偷偷抹了把眼泪。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 2,
        icon: "⚙️",
        title: "流水线第一天",
        story:
          "早上六点半的闹钟，你跟着人流涌进车间。流水线不会等你，你的手必须跟上机器的节奏。\n\n一天站下来，脚底板生疼。你算了算：时薪¥18，今天做了12个小时。",
        choices: [
          {
            text: "咬牙坚持",
            hint: "体质+1，赚钱",
            apply: function (st) {
              var earn = Random.int(150, 220);
              st.resources.cash = (st.resources.cash || 0) + earn;
              st.player.physique = Math.min(100, (st.player.physique || 0) + 1);
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
              StateManager.addMessage(
                "🏭 一天流水线干下来，挣了 ¥" +
                  earn +
                  "。手酸得抬不起来，但钱是真的。",
                "success",
              );
            },
          },
          {
            text: "偷懒摸鱼",
            hint: "少赚点但轻松",
            apply: function (st) {
              var earn = Random.int(80, 120);
              st.resources.cash = (st.resources.cash || 0) + earn;
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
              StateManager.addMessage(
                "😅 趁组长不在的时候偷了会儿懒，今天挣了 ¥" +
                  earn +
                  "。不多但人也轻松。",
                "warning",
              );
            },
          },
        ],
      },
      {
        dayOffset: 3,
        icon: "🗣️",
        title: "学语言",
        story:
          "在这座城市，听不懂本地话让你吃了不少亏。买菜被坑，问路没人理。你决定学点本地话。",
        choices: [
          {
            text: "找培训班",
            hint: "¥200，系统学习",
            apply: function (st) {
              if ((st.resources.cash || 0) >= 200) {
                st.resources.cash -= 200;
                st.flags._tookLanguageClass = true;
                StateManager.addMessage(
                  "📚 报了夜校的普通话班。钱花得心疼，但学会了就是自己的。",
                  "info",
                );
              } else {
                StateManager.addMessage(
                  "⚠️ 钱不够，¥200的学费拿不出来。",
                  "danger",
                );
              }
            },
          },
          {
            text: "跟工友学",
            hint: "省钱，但学得慢",
            apply: function () {
              StateManager.addMessage(
                "💬 工友们七嘴八舌地教你。虽然不标准，但日常够用了。",
                "info",
              );
            },
          },
          {
            text: "自己练",
            hint: "看电视听广播",
            apply: function (st) {
              st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
              StateManager.addMessage(
                "📺 晚上躺在床上看本地新闻，跟着播一句一句学。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 4,
        icon: "🛤️",
        title: "选择",
        story:
          "一周过去了。你开始熟悉这座城市的生活节奏。流水线的工作枯燥但稳定，可你心里隐约觉得——也许有别的可能。",
        choices: [
          {
            text: "继续工厂",
            hint: "稳定，存钱",
            apply: function (st) {
              st.flags._stickToFactory = true;
              StateManager.addMessage(
                "🏭 你决定先干着，攒够了钱再做打算。",
                "info",
              );
            },
          },
          {
            text: "尝试新方向",
            hint: "趁着年轻，多试试",
            apply: function (st) {
              st.player.agility = Math.min(100, (st.player.agility || 0) + 2);
              StateManager.addMessage(
                "🌟 你还年轻，不想一辈子待在流水线上。这座城市有太多可能。",
                "info",
              );
            },
          },
        ],
      },
    ],

    // ====== 5) 二代创业者（3天） ======
    second_gen: [
      {
        dayOffset: 1,
        icon: "💎",
        title: "资金的重量",
        story:
          "家里给了你一笔启动资金。不算多，但足够让你开始做点什么。你第一次感受到——钱，既是机会，也是责任。\n\n这笔钱如果亏了，你对得起家里吗？",
        choices: [
          {
            text: "直接创业",
            hint: "趁热打铁",
            apply: function (st) {
              st.flags._familyFundUsed = true;
              st.resources.cash = (st.resources.cash || 0) + 50000;
              StateManager.addMessage(
                "🚀 你决定现在就干。钱放在银行里不会生钱，只有动起来才算数。",
                "info",
              );
            },
          },
          {
            text: "先学习",
            hint: "上创业课程，打基础",
            apply: function (st) {
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 0) + 3,
              );
              StateManager.addMessage(
                "📖 你报了几个创业课程。磨刀不误砍柴工。",
                "info",
              );
            },
          },
          {
            text: "先体验社会",
            hint: "打工了解市场",
            apply: function (st) {
              st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
              StateManager.addMessage(
                "🏪 你决定先去别人店里打打工，看看生意是怎么做的。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 2,
        icon: "🔬",
        title: "创业启蒙",
        story:
          "你开始认真研究创业这件事。科技园区里那些初创公司的故事让你热血沸腾，但你也看到了一半以上的公司撑不过一年。",
        choices: [
          {
            text: "去科技园考察",
            hint: "看看别人怎么做的",
            apply: function () {
              StateManager.addMessage(
                "🏢 在科技园转了一天，看到不少有趣的初创公司。一个做AI的团队只有三个人，但已经拿了天使轮。",
                "info",
              );
            },
          },
          {
            text: "研究本地市场",
            hint: "了解需求在哪里",
            apply: function (st) {
              st.flags._marketResearchDone = true;
              StateManager.addMessage(
                "📊 你花了一天在街边观察。发现写字楼附近的快餐和咖啡生意最好。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 3,
        icon: "🧭",
        title: "方向选择",
        story:
          "研究了几天，你面前摆着三条路。每一条都有机会，每一条都有风险。你不可能什么都做，得选一个。",
        choices: [
          {
            text: "科技创业",
            hint: "高增长高风险",
            apply: function (st) {
              st.flags._startupDirection = "tech";
              if (st.skills && st.skills.coding)
                st.skills.coding.xp = (st.skills.coding.xp || 0) + 30;
              StateManager.addMessage(
                "💻 你选择了科技方向。这个时代，代码就是力量。",
                "info",
              );
            },
          },
          {
            text: "消费创业",
            hint: "贴近生活，稳扎稳打",
            apply: function (st) {
              st.flags._startupDirection = "consumer";
              if (st.skills && st.skills.sales)
                st.skills.sales.xp = (st.skills.sales.xp || 0) + 30;
              StateManager.addMessage(
                "🏪 你选择了消费领域。民以食为天，这个永远不会过时。",
                "info",
              );
            },
          },
          {
            text: "金融创业",
            hint: "钱生钱的游戏",
            apply: function (st) {
              st.flags._startupDirection = "finance";
              if (st.skills && st.skills.accounting)
                st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 30;
              StateManager.addMessage(
                "💰 你选择了金融方向。风险和收益永远成正比。",
                "info",
              );
            },
          },
        ],
      },
    ],

    // ====== 6) 中年危机职场人（3天） ======
    midlife_crisis: [
      {
        dayOffset: 1,
        icon: "📄",
        title: "被裁的后续",
        story:
          "「公司业务调整，很遗憾……」——你听到这句话的时候，脑子嗡嗡作响。十五年工龄，一张纸就打发了。\n\n你坐在工位上收拾东西，隔壁工位的小年轻偷偷给你塞了包烟。",
        choices: [
          {
            text: "拿N+1走人",
            hint: "实际，拿钱走人",
            apply: function (st) {
              var severance = Random.int(80000, 150000);
              st.resources.cash = (st.resources.cash || 0) + severance;
              StateManager.addMessage(
                "💵 谈好了赔偿金 ¥" +
                  severance +
                  "。签了字，走出写字楼的那一刻，你感到一种奇怪的轻松。",
                "info",
              );
            },
          },
          {
            text: "跟公司谈",
            hint: "争取更好的条件",
            apply: function (st) {
              var severance = Random.int(100000, 200000);
              st.resources.cash = (st.resources.cash || 0) + severance;
              st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
              StateManager.addMessage(
                "💼 你据理力争，最终拿到了 ¥" +
                  severance +
                  " 的赔偿。尊严不只是面子，更是应得的权利。",
                "success",
              );
            },
          },
          {
            text: "找律师",
            hint: "法律途径维权",
            apply: function (st) {
              st.flags._consultedLawyer = true;
              if ((st.resources.cash || 0) >= 5000) st.resources.cash -= 5000;
              StateManager.addMessage(
                "⚖️ 律师说公司裁员程序有问题，你有机会争取更多赔偿。但需要时间。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 2,
        icon: "🚶",
        title: "下一站",
        story:
          "大专学历、35岁、没有亮眼的技能更新——你的简历在招聘软件上像块石头沉入了海底。\n\n你突然发现，自己以为的经验，在HR眼里叫「过时」。",
        choices: [
          {
            text: "降薪去小公司",
            hint: "先有个收入",
            apply: function () {
              StateManager.addMessage(
                "🏢 小公司老板看了你的简历，说「经验丰富，但我们只能给到之前三分之二」。你咽了口气，点了点头。",
                "info",
              );
            },
          },
          {
            text: "自己创业",
            hint: "把命运握在自己手里",
            apply: function (st) {
              st.flags._decidedToStartup = true;
              StateManager.addMessage(
                "🚀 你决定不再给别人打工了。这辈子总要为自己拼一次。",
                "info",
              );
            },
          },
          {
            text: "开滴滴过渡",
            hint: "灵活，不挑年龄",
            apply: function (st) {
              var earn = Random.int(200, 400);
              st.resources.cash = (st.resources.cash || 0) + earn;
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
              StateManager.addMessage(
                "🚗 注册了网约车，第一天跑了 ¥" +
                  earn +
                  "。虽然比不上以前的工资，但至少能糊口。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 3,
        icon: "👨‍👩‍👧",
        title: "家庭压力",
        story:
          "老婆小心翼翼地问你工作找得怎么样了。孩子下学期的补习费该交了。房贷还有二十八年。\n\n你第一次感到，中年人的崩溃是从缺钱开始的。",
        choices: [
          {
            text: "跟家人坦白",
            hint: "一起想办法",
            apply: function (st) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
              StateManager.addMessage(
                "❤️ 你如实说了情况。老婆沉默了一会儿说「没关系，家里还有存款」。你的眼眶湿了。",
                "info",
              );
            },
          },
          {
            text: "瞒着家人扛",
            hint: "不想让他们担心",
            apply: function (st) {
              st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
              StateManager.addMessage(
                "😤 你说「公司挺好的」，然后把自己关在阳台抽了很久的烟。",
                "info",
              );
            },
          },
          {
            text: "计算家庭开支",
            hint: "精打细算",
            apply: function (st) {
              st.flags._familyBudgetDone = true;
              StateManager.addMessage(
                "📋 你算了算：每月至少需要¥8000才能维持基本开销。不能再等了。",
                "info",
              );
            },
          },
        ],
      },
    ],

    // ====== 7) 应届毕业生（3天） ======
    fresh_grad: [
      {
        dayOffset: 1,
        icon: "🔑",
        title: "租房陷阱",
        story:
          "你在网上看中了一间房，照片上窗明几净。到了实地才发现——照片是五年前拍的，墙皮脱落，空调漏水，中介还在旁边不停催你签合同。",
        choices: [
          {
            text: "识破中介",
            hint: "不签，再找",
            apply: function (st) {
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 0) + 1,
              );
              StateManager.addMessage(
                "🔍 你识破了中介的把戏，转身离开。押金差点被骗，还好多个心眼。",
                "info",
              );
            },
          },
          {
            text: "认了，先住下",
            hint: "凑合住，再慢慢找",
            apply: function (st) {
              if ((st.resources.cash || 0) >= 3000) st.resources.cash -= 3000;
              st.housing.tier = Math.max(st.housing.tier || 0, 1);
              StateManager.addMessage(
                "😩 交了三个月房租和押金，¥3000没了。这房间虽然差，但至少有个地方睡。",
                "warning",
              );
            },
          },
          {
            text: "找合租",
            hint: "省钱，还能有室友",
            apply: function (st) {
              if ((st.resources.cash || 0) >= 1500) st.resources.cash -= 1500;
              StateManager.addMessage(
                "🏠 在豆瓣上找到了一个合租帖，室友是个程序员。房租¥1500/月，便宜不少。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 2,
        icon: "🎓",
        title: "职场第一课",
        story:
          "终于入职了。你穿上新买的廉价西装，满怀期待走进办公室。\n\n然而现实给了你一巴掌——同事甩锅，领导画饼，你连打印机都不会用。",
        choices: [
          {
            text: "忍气吞声",
            hint: "先积累经验",
            apply: function (st) {
              st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
              StateManager.addMessage(
                "😔 老员工把不想干的活都推给你，你在工位上加班到十点。这就是职场吗？",
                "warning",
              );
            },
          },
          {
            text: "主动学习",
            hint: "不抱怨，先提升自己",
            apply: function (st) {
              if (st.skills && st.skills.coding)
                st.skills.coding.xp = (st.skills.coding.xp || 0) + 40;
              StateManager.addMessage(
                "💻 你不会用Excel，就偷偷学了三天。不会写报告，就套模板改。你不会的东西，学就是了。",
                "info",
              );
            },
          },
          {
            text: "搞好人缘",
            hint: "请同事喝奶茶",
            apply: function (st) {
              if ((st.resources.cash || 0) >= 50) st.resources.cash -= 50;
              StateManager.addMessage(
                "🧋 请同事喝了杯奶茶，关系拉近了不少。职场不光靠能力，也靠人情世故。",
                "info",
              );
            },
          },
        ],
      },
      {
        dayOffset: 3,
        icon: "💳",
        title: "第一个工资",
        story:
          "手机震了一下——¥4500到账。你盯着银行短信看了很久，这是你人生中第一笔自己挣的钱。\n\n¥4500，扣除房租¥1500、吃饭¥1000、交通¥200，还剩¥1800。你想了半天怎么花。",
        choices: [
          {
            text: "存起来",
            hint: "开始攒钱",
            apply: function (st) {
              if ((st.resources.cash || 0) >= 1000) {
                st.resources.bankBalance =
                  (st.resources.bankBalance || 0) + 1000;
                st.resources.cash -= 1000;
              }
              StateManager.addMessage(
                "🏦 你存了¥1000到银行。虽然不多，但这是攒钱的开始。",
                "info",
              );
            },
          },
          {
            text: "给爸妈买礼物",
            hint: "孝顺一下",
            apply: function (st) {
              if ((st.resources.cash || 0) >= 500) st.resources.cash -= 500;
              st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
              StateManager.addMessage(
                "🎁 给爸妈各买了件衣服。电话里妈妈说「长大了」，你鼻子一酸。",
                "info",
              );
            },
          },
          {
            text: "投资自己",
            hint: "报个课学新技能",
            apply: function (st) {
              if ((st.resources.cash || 0) >= 800) {
                st.resources.cash -= 800;
                st.player.intelligence = Math.min(
                  100,
                  (st.player.intelligence || 0) + 2,
                );
              }
              StateManager.addMessage(
                "📚 报了个线上课程。第一份工资投资自己，永远不亏。",
                "info",
              );
            },
          },
        ],
      },
    ],
  };

  // ====== 每日检查：是否触发当前剧本的当天事件 ======

  /**
   * daily_pipeline 步骤：在 day_increment 之后尽早调用
   * 检查当前设定的剧本事件链，若今日有未触发的事件则弹窗
   * 事件通过 showEventModal() 展示多选弹窗
   */
  function checkScenarioStartChain(state) {
    if (!state || !state.player) return;

    // 仅在剧本模式下生效
    var scenarioId = state.flags && state.flags._currentScenario;
    if (!scenarioId || !CHAINS[scenarioId]) return;

    var currentDay = state.player.day;
    var chain = CHAINS[scenarioId];
    var maxDays = chain.length;

    // 超出事件链天数范围则不再触发
    if (currentDay > maxDays) return;

    // 查找当天是否有事件定义
    var eventDef = null;
    for (var i = 0; i < chain.length; i++) {
      if (chain[i].dayOffset === currentDay) {
        eventDef = chain[i];
        break;
      }
    }
    if (!eventDef) return;

    // 检查当天是否已触发（避免重复）
    var triggered = state.flags._scenarioChainDays || {};
    if (triggered[currentDay]) return;

    // 标记当天已触发
    if (!state.flags._scenarioChainDays) state.flags._scenarioChainDays = {};
    state.flags._scenarioChainDays[currentDay] = true;

    // 弹窗展示含多选的开局事件
    if (typeof showEventModal === "function") {
      state._pendingEvent = {
        id: "scenario_chain_" + scenarioId + "_day" + currentDay,
        icon: eventDef.icon,
        title: eventDef.title,
        story: eventDef.story,
        choices: eventDef.choices,
      };
      setTimeout(function () {
        showEventModal(state._pendingEvent);
      }, 100);
    } else {
      StateManager.addMessage(
        eventDef.icon + " " + eventDef.title + " — " + eventDef.story,
        "event",
      );
    }
  }

  // ====== 全局挂载 ======
  if (typeof window !== "undefined") {
    window.SCENARIO_START_CHAINS = CHAINS;
    window.checkScenarioStartChain = checkScenarioStartChain;
  }
})();

/**
 * 剧本专属开局事件链 — Scenario Start Chains
 *
 * 每个剧本定义 3-4 天开局事件链，在游戏前几日逐天触发，
 * 引导玩家进入角色叙事弧线。
 *
 * 设计参考：《This War of Mine》开场叙事 / 极乐迪斯科 角色背景
 *
 * 接线：
 *   main.js startScenarioGame 设置 state.flags._currentScenario
 *   daily_pipeline.js 新增 scenario_start_chain 步骤
 */

(function () {
  "use strict";

  // ====== 开局事件链定义 ======
  // key: scenarioId, value: 按天索引的事件数组（day: 1/2/3/4）
  var CHAINS = {
    classic: [
      {
        day: 1,
        icon: "🏚️",
        title: "桥洞下的第一夜",
        story: "你找到城中村边缘一个桥洞。纸板铺地，背包当枕。远处传来狗叫声和夜市嘈杂。你摸了摸兜里仅剩的¥300，肚子咕咕叫。明天必须找到活干。",
        effect: function (st) {
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 5);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 3);
          StateManager.addMessage("🌃 桥洞下凑合了一夜。明天会更好——你对自己说。", "info");
        },
      },
      {
        day: 2,
        icon: "🍜",
        title: "一碗面的尊严",
        story: "你站在一家沙县小吃门口。一碗最便宜的拌面¥6。你犹豫了很久——不是买不起，是怕花完这顿就没下顿。店老板探出头：「小伙子，进来吧，第一碗算你半价。」",
        effect: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 3);
          st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 15);
          StateManager.addMessage("🍜 热腾腾的拌面下肚，你觉得这座城市也没那么冷。", "info");
        },
      },
      {
        day: 3,
        icon: "💪",
        title: "第一份活",
        story: "城中村公告栏上贴着一张招工启事：工地搬砖，日结¥150。你撕下纸条就去了。工头看了你一眼：「瘦了点，但年轻，行。」你领到了第一顶安全帽。",
        effect: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 150;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
          StateManager.addMessage("💪 日结¥150到手。你握着那几张钞票看了很久。", "success");
        },
      },
    ],
    laid_off: [
      {
        day: 1,
        icon: "🏭",
        title: "最后一张打卡单",
        story: "你从工厂宿舍醒来，习惯性地往车间走。走到门口才想起——你已经被辞退了。口袋里有遣散费，但心里空落落的。厂门口的电线杆上贴着外卖骑手招聘：月入过万不是梦。",
        effect: function (st) {
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
          StateManager.addMessage("🏭 十五年工龄，换一张遣散通知单。你苦笑。", "warning");
        },
      },
      {
        day: 2,
        icon: "🛵",
        title: "熟悉陌生的城市",
        story: "你去面试了外卖骑手。站长看你年纪大有点犹豫，但你说了一片街区的路名——十五年了，这块地的每一条巷子你都熟。站长说：「行，跑两天试试。」",
        effect: function (st) {
          st.player.agility = Math.min(100, (st.player.agility || 0) + 1);
          StateManager.addMessage("🛵 你领了头盔和工服。这条路，你比导航还熟。", "info");
        },
      },
      {
        day: 3,
        icon: "📞",
        title: "家里的电话",
        story: "老婆打来电话，问工作找到了没。你说在跑外卖，先干着。电话那头沉默了一下，说「注意安全」。你蹲在路边扒了几口盒饭，突然觉得外卖这份活——至少还能站着挣钱。",
        effect: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
          StateManager.addMessage("📞 家人的一句「注意安全」，比什么都暖。", "info");
        },
      },
    ],
    small_town_grinder: [
      {
        day: 1,
        icon: "📄",
        title: "面试穿什么",
        story: "明天有一个数据录入员的面试。你翻遍了行李箱，唯一一件白衬衫皱得像咸菜。你借了室友的熨斗，折腾到半夜。在手机备忘录里反复练习自我介绍——尽管只是录入员岗位。",
        effect: function (st) {
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
          st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + 1);
          StateManager.addMessage("📄 你对着镜子练了三遍。你告诉自己：第一份工作不分高低。", "info");
        },
      },
      {
        day: 2,
        icon: "🏢",
        title: "科技园的第一天",
        story: "面试通过了。数据录入员，月薪¥4000，单休。你坐在工位上，左边是茶水间，右边是打印机，头顶是白炽灯管。这和你想的「白领生活」不太一样，但你知道——这是起点。",
        effect: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) + 500);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) + 5);
          StateManager.addMessage("💼 第一份薪水¥500预付。你拍了工牌照片发给家里。", "success");
        },
      },
      {
        day: 3,
        icon: "🏠",
        title: "合租日常",
        story: "你搬进了科技园附近的合租房。四室一厅，你分到最小的那间，放下一张床和一张桌子就满了。但窗外能看到科技园的霓虹灯牌——那个方向，是你在的地方。",
        effect: function (st) {
          st.housing.tier = Math.max(st.housing.tier || 0, 1);
          StateManager.addMessage("🏠 最小的房间，最大的希望。你躺在床上看着窗外发呆。", "info");
        },
      },
    ],
    foreign_worker: [
      {
        day: 1,
        icon: "🌏",
        title: "八个人一间房",
        story: "你被老乡接到宿舍。八个人挤在二十平米的房间里，上下铺铁架床。有人打鼾，有人磨牙，有人半夜打电话回家。你缩在下铺，把护照压在枕头底下——那是你最重要的东西。",
        effect: function (st) {
          st.needs.hygiene = Math.max(0, (st.needs.hygiene || 0) - 10);
          StateManager.addMessage("🌏 你给家里发了条消息：到了，一切都好。——其实并不好。", "info");
        },
      },
      {
        day: 2,
        icon: "🏭",
        title: "流水线的节奏",
        story: "第一次上流水线。传送带的速度比你想的快得多。手忙脚乱了半天，被线长训了一顿。旁边的工友偷偷教了你几个技巧——用脚顶住工作台、旋转零件的手法。你默默记在心里。",
        effect: function (st) {
          st.player.agility = Math.min(100, (st.player.agility || 0) + 1);
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          StateManager.addMessage("🏭 流水线不会等人。你开始适应这座城市的节奏。", "info");
        },
      },
      {
        day: 3,
        icon: "💵",
        title: "第一笔汇款",
        story: "发了第一周的工资。你留了最低生活费，剩下的全部换成汇款寄回家。手机银行弹出的那一刻，你算了算——这里干一个月，够家里用半年。值了。",
        effect: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage("💵 钱汇出去的那一刻，你笑了。妈妈收到会高兴的吧。", "success");
        },
      },
    ],
    second_gen: [
      {
        day: 1,
        icon: "💎",
        title: "富二代的焦虑",
        story: "你坐在商业区的共享办公空间里，对着空白的创业计划书发呆。你知道自己做生意才有面子，却不知道怎么做生意才能赚钱。隔壁团队在激情洋溢地讨论融资方案，你连BP是什么都要百度。",
        effect: function (st) {
          st.player.mental = Math.max(0, (st.player.mental || 0) - 3);
          StateManager.addMessage("💎 有钱和有能力，确实是两回事。——你今天终于懂了。", "warning");
        },
      },
      {
        day: 2,
        icon: "☕",
        title: "咖啡厅的生意经",
        story: "你在咖啡馆偶遇了一个连续创业者。对方听说你有启动资金，眼睛亮了。给你讲了两个小时的商业模式。你听不太懂，但你记住了那句：「别想着颠覆行业，先想着怎么赚钱。」",
        effect: function (st) {
          st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + 2);
          StateManager.addMessage("☕ 你买单的时候偷偷把名片收好了。——这人以后也许用得着。", "info");
        },
      },
      {
        day: 3,
        icon: "📊",
        title: "第一次市场调研",
        story: "你决定亲自去看看市场。从写字楼走到夜市，从商场走到城中村。你发现城市的分层比你想的严重——同一座城市，有人一餐花¥500，有人一顿¥5。你要做谁的生意？",
        effect: function (st) {
          st.player.fame = (st.player.fame || 0) + 3;
          StateManager.addMessage("📊 你第一次认真观察这座城市。机会藏在每一个街角。", "info");
        },
      },
    ],
    midlife_crisis: [
      {
        day: 1,
        icon: "📋",
        title: "简历的尴尬",
        story: "你打开招聘App，更新简历。写着写着就停住了——工作经验那里，最长的一段写了六年。你突然意识到，自己这辈子只做过一份工作。除了这个行业的技能，你好像什么都不会。",
        effect: function (st) {
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 8);
          StateManager.addMessage("📋 你把最后一份工作经历的日期改成了『至今』。——至今结束了。", "danger");
        },
      },
      {
        day: 2,
        icon: "🏦",
        title: "房贷不会等你",
        story: "银行短信准时到了：「您的房贷已逾期3天，请尽快还款。」你看着银行卡余额，还有¥80,000。够还半年房贷。半年内如果找不到工作……你没有往下想。",
        effect: function (st) {
          st.player.mental = Math.max(0, (st.player.mental || 0) + 2);
          StateManager.addMessage("🏦 压力是最好的清醒剂。你打开招聘App，投了二十份简历。", "info");
        },
      },
      {
        day: 3,
        icon: "🎯",
        title: "猎头的电话",
        story: "一个猎头打来电话，说有个小公司CTO岗位，薪资降30%，但有期权。你挂了电话，在窗前站了很久。降薪去小公司，还是拿剩下的钱创业？三十五岁这道坎，你终于走到了。",
        effect: function (st) {
          st.flags._midlifeChoiceReady = true;
          StateManager.addMessage("🎯 人生的岔路口在面前展开。你选了哪条？还不知道。", "story");
        },
      },
    ],
    fresh_grad: [
      {
        day: 1,
        icon: "🎓",
        title: "毕业生的第一站",
        story: "你拖着行李箱走进地铁站。这座城市的地铁比你老家的整个市区还大。你迷路了两次，问了三个人，终于找到了提前订好的青旅。六人间，¥50一晚。你在上铺打开电脑，开始海投简历。",
        effect: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
          st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + 1);
          StateManager.addMessage("🎓 投了三十份简历。虽然一封回复都没有，但你告诉自己：明天会有的。", "info");
        },
      },
      {
        day: 2,
        icon: "🤝",
        title: "第一次面试",
        story: "一家创业公司约你面试。你穿了借来的西装，提前一小时就到了。面试官比你大不了几岁，问了你一堆技术问题。你答上来一半。面完出来你松了口气——原来面试也没有那么可怕。",
        effect: function (st) {
          st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          StateManager.addMessage("🤝 不管结果如何，你迈出了第一步。——这是今天最大的意义。", "info");
        },
      },
      {
        day: 3,
        icon: "🏙️",
        title: "城市夜游",
        story: "你一个人去了市中心。站在天桥上看着车流灯光，耳机里放着喜欢的歌。你掏出手机拍了张照片，想发朋友圈，又删了——怕家里人觉得你在瞎逛浪费时间。但你心里清楚，你需要这样一个晚上，确认自己选择来这座城市是对的。",
        effect: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          StateManager.addMessage("🏙️ 这座城市很大，但你在其中。——这就够了。", "info");
        },
      },
    ],
  };

  // ====== 每日检查：是否触发当前剧本的当天事件 ======

  /**
   * daily_pipeline 步骤：在 day_increment 之后尽早调用
   * 检查当前设定的剧本事件链，若今日有未触发的事件则弹窗
   */
  function checkScenarioStartChain(state) {
    if (!state || !state.player) return;

    // 仅在剧本模式下生效
    var scenarioId = state.flags && state.flags._currentScenario;
    if (!scenarioId || !CHAINS[scenarioId]) return;

    // 检查事件链标记
    var chainFlag = "_scenarioChainDay";
    var currentDay = state.player.day;

    // 最大事件天数为该剧本链长度
    var chain = CHAINS[scenarioId];
    var maxDays = chain.length;

    // 超出事件链天数范围则不再触发
    if (currentDay > maxDays) return;

    // 查找当天是否有事件定义
    var eventDef = null;
    for (var i = 0; i < chain.length; i++) {
      if (chain[i].day === currentDay) {
        eventDef = chain[i];
        break;
      }
    }
    if (!eventDef) return;

    // 检查当天是否已触发（避免重复）
    var triggered = state.flags[chainFlag] || {};
    if (triggered[currentDay]) return;

    // 标记当天已触发
    if (!state.flags[chainFlag]) state.flags[chainFlag] = {};
    state.flags[chainFlag][currentDay] = true;

    // 执行效果
    if (typeof eventDef.effect === "function") {
      eventDef.effect(state);
    }

    // 弹窗展示
    if (typeof showEventModal === "function") {
      state._pendingEvent = {
        id: "scenario_chain_" + scenarioId + "_day" + currentDay,
        icon: eventDef.icon,
        title: eventDef.title,
        story: eventDef.story,
        choices: [
          {
            text: "继续",
            hint: "新的一天开始了",
            apply: function () {},
          },
        ],
      };
      setTimeout(function () {
        showEventModal();
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

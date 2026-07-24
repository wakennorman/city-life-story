/**
 * 域B联动增强 Part 1：失业叙事/道德回声/副业失败复苏
 * [全系统自洽修复] 域B R174: layoff/moral/sideHustle数据首次被事件消费
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== A组: 裁员通知 + 14天回访 =====
  var layoff_notification = {
    id: "layoff_notification",
    title: "裁员通知",
    phase: "street",
    repeatable: false,
    priority: 90,
    conditions: function (st) {
      if (!st || !st.career || !st.career.currentJob) return false;
      if ((st.career.currentJob.tenure || 0) < 90) return false;
      if ((st.resources && st.resources.cash) > 5000) return false;
      if (st.flags && st.flags._layoffSeen) return false;
      return true;
    },
    probability: 0.025,
    getStory: function (st) {
      var salary = (st.career.currentJob && st.career.currentJob.pay) || 3000;
      return "HR在下午三点叫你进会议室，门一关，氛围就不对了。\n公司情势不容乐观。你的位置被优化了。\n补偿方案是" + Math.round(salary * 1.5) + "，但你这个月的房租还没着落。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (choiceId === "handover") {
        st.resources.cash = (st.resources.cash || 0) + 3000;
        st.flags._layoffHandled = true;
        StateManager.addMessage("正常交接走人，补偿金3000到账。至少不丢人。", "success");
      } else if (choiceId === "argue") {
        if ((st.player && st.player.charm) >= 35) {
          st.resources.cash = (st.resources.cash || 0) + 5000;
          st.player.happiness = Math.min(100, (st.player.happiness || 50) + 5);
          StateManager.addMessage("能说会的人吃馆。你多要了2000。", "success");
        } else {
          st.player.happiness = Math.max(0, (st.player.happiness || 50) - 5);
          StateManager.addMessage("你想争一下，但HR一脸冷漠。", "warning");
        }
      } else {
        st.player.morality = Math.max(0, (st.player.morality || 50) - 5);
        st.flags._layoffAngry = true;
        StateManager.addMessage("你拍桌子走了——补偿金也没拿到。", "warning");
      }
      st.flags._layoffSeen = true;
      st.flags._layoffDay = st.player.day;
      if (typeof scheduleChainEvent === "function") {
        scheduleChainEvent(st, "layoff_recovery_visit", 14, "street");
      }
    },
    choices: [
      { text: "正常交接拿补偿", id: "handover" },
      { text: "争取多2000(需魅力>=35)", id: "argue" },
      { text: "翻脸走人", id: "walk_away" },
    ],
    icons: ["裁员", "离职"],
  };

  var layoff_recovery_visit = {
    id: "layoff_recovery_visit",
    title: "被裁两周后的回望",
    phase: "street",
    repeatable: false,
    _isChainEvent: true,
    chainId: "layoff_recovery",
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (!st.flags._layoffHandled && !st.flags._layoffAngry) return false;
      var lastLayoff = st.flags._layoffDay || 0;
      if (lastLayoff <= 0) return false;
      return (st.player.day || 0) - lastLayoff >= 14;
    },
    probability: 1.0,
    getStory: function (st) {
      var cash = (st.resources && st.resources.cash) || 0;
      return "被裁两周了。纸袋还堆在床头——里面是工位上那盆快枯死的绿萝。\n\n" + (cash > 3000 ? "好在还有一些储备。" : "钱花得差不多了。");
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (choiceId === "start_over") {
        st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 12);
        StateManager.addMessage("重新开始。至少还有勇气。", "success");
      } else {
        st.player.fatigue = Math.min(100, (st.player.fatigue || 50) + 10);
        StateManager.addMessage("先缓几天。", "info");
      }
    },
    choices: [
      { text: "再找份活共干再说", id: "start_over" },
      { text: "还需要时间消化", id: "need_time" },
    ],
    icons: ["回望", "迷茫"],
  };

  // ===== B组: 道德回声(3个链式回访) =====

  var moral_echo_wallet_return = {
    id: "moral_echo_wallet_return",
    title: "失主找到了你",
    phase: "street",
    repeatable: false,
    _isChainEvent: true,
    chainId: "moral_echo",
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (!st.flags.moralWalletReturner) return false;
      if (st.flags._moralEchoResponded) return false;
      return true;
    },
    probability: 1.0,
    getStory: function (st) {
      return "三天前你在ATM旁捡到一个钱包，原封不动交给了警察。\n今天一个中年男人跑到你面前，眼眶泛红：谢谢你！里面有我女儿的救命钱！\n他非要塞给你500表示感谢。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (choiceId === "accept") {
        st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 15);
        st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
        st.resources.cash = (st.resources.cash || 0) + 500;
        StateManager.addMessage("你摆了摆手说不用谢，但他执意塞了钱。走在路上，你觉得今天的太阳格外暖。", "success");
      } else {
        st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
        StateManager.addMessage("微笑摆摆手走了。内心的平静比任何报酬都珍贵。", "hint");
      }
      st.flags._moralEchoResponded = true;
    },
    choices: [
      { text: "接受感谢，心里暖暖的", id: "accept" },
      { text: "婉拒了，做好事就完了", id: "decline" },
    ],
    icons: ["感谢", "善意"],
  };

  var moral_echo_wallet_keep = {
    id: "moral_echo_wallet_keep",
    title: "街角重逢",
    phase: "street",
    repeatable: false,
    _isChainEvent: true,
    chainId: "moral_echo_stolen",
    conditions: function (st) {
      if (!st || !st.flags) return false;
      if (!st.flags.moralWalletStolen) return false;
      if (st.flags._moralEchoResponded) return false;
      return true;
    },
    probability: 1.0,
    getStory: function (st) {
      return "那天你昧下了钱包里的500，花得很痛快。\n但现在走在路上，对面走来一个头发花白的老人，背影和钱包里的身份证照片一样。\n他正在找什么——也许是公交卡。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (choiceId === "return_redeem") {
        var haveCash = (st.resources && st.resources.cash) || 0;
        var toPay = Math.min(1000, haveCash);
        st.resources.cash = Math.max(0, (st.resources.cash || 0) - toPay);
        st.player.morality = Math.min(100, (st.player.morality || 50) + 12);
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 10);
        st.flags.moralWalletStolen = false;
        st.flags.moralWalletReturner = true;
        StateManager.addMessage("你喊住了老人，把钱和他身份证一起递回去。心跳如鼓——但心里那块石头落地了。", "success");
      } else if (choiceId === "run") {
        st.player.happiness = Math.max(0, (st.player.happiness || 50) - 8);
        st.player.mental = Math.max(0, (st.player.mental || 50) - 5);
        StateManager.addMessage("你心跳加速地绕开了。那双颤抖的手让你想起了什么。", "warning");
      } else {
        st.player.mental = Math.max(0, (st.player.mental || 50) - 3);
        StateManager.addMessage("你站在原地看着他的背影消失。那天的风有点冷。", "info");
      }
      st.flags._moralEchoResponded = true;
    },
    choices: [
      { text: "加快脚步绕开他", id: "run" },
      { text: "追上他还钱(连带利息1000)", id: "return_redeem" },
      { text: "站着不动发一会呆", id: "freeze" },
    ],
    icons: ["重逢", "天平"],
  };

  // ===== C组: 副业失败 + 朋友打气 =====

  var side_hustle_setback = {
    id: "side_hustle_setback",
    title: "货砸手上了",
    phase: "street",
    repeatable: false,
    priority: 80,
    conditions: function (st) {
      if (!st) return false;
      var hustle = st.sideHustle || null;
      if (!hustle || !hustle.active) return false;
      if (st.flags && st.flags._sideHustleSetbackShown) return false;
      if ((st.resources && st.resources.cash) > 3000) return false;
      return true;
    },
    probability: 0.04,
    getStory: function (st) {
      return "你昨天才进货的那批货今天早上发现全砸在手上了！\n周转商打来电话说故意赔偿——但那点钱连本金都不够。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (choiceId === "quit_all") {
        st.player.happiness = Math.max(0, (st.player.happiness || 50) - 15);
        st.sideHustle = null;
        StateManager.addMessage("关掉了副业页面。心很累。", "warning");
      } else {
        st.resources.cash = Math.max(0, (st.resources.cash || 0) - Random.int(50, 200));
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 5);
        st.flags._recentSideLoss = true;
        StateManager.addMessage("再试一次。", "info");
      }
      if (typeof scheduleChainEvent === "function") {
        scheduleChainEvent(st, "side_hustle_bounce_back", 3, "street");
      }
    },
    choices: [
      { text: "再进货试试", id: "retry_another" },
      { text: "算了，不干了", id: "quit_all" },
      { text: "找朋友倒倒苦水", id: "talk_friend" },
    ],
    icons: ["货", "沮丧"],
  };

  var side_hustle_bounce_back = {
    id: "side_hustle_bounce_back",
    title: "豆浆大妈的茶叶蛋",
    phase: "street",
    repeatable: false,
    priority: 65,
    _isChainEvent: true,
    chainId: "bounce_back",
    conditions: function (st) {
      if (!st || !st.flags || !st.flags._recentSideLoss) return false;
      if ((st.player && st.player.day) < 30) return false;
      return true;
    },
    probability: 0.5,
    getStory: function (st) {
      return "连续几天的低迷后，今天你去批发市场，路边卖豆浆的大妈多塞给你一个茶叶蛋。\n不容易吧？我做这行十年了，谁家没个难处。多吃点，扛过去就好了。\n那颗蛋很香。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._recentSideLoss = false;
      if (choiceId === "library") {
        st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
        StateManager.addMessage("坐在图书馆里翻了一下午书。知识不会背叛你。", "success");
      } else if (choiceId === "walk_city") {
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 8);
        StateManager.addMessage("你沿着街道走了一圈。城市的烟火气好像没那么糟糕了。", "hint");
      } else {
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 5);
        StateManager.addMessage("茶叶蛋下肚，你有了点力气。也许该认真看看工作了。", "info");
      }
    },
    choices: [
      { text: "去人才市场转转", id: "job_market" },
      { text: "在城市里走一走", id: "walk_city" },
      { text: "去大学城图书馆看书", id: "library" },
    ],
    icons: ["豆浆", "茶叶蛋"],
  };

  // ===== IIFE注入 =====
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(layoff_notification, layoff_recovery_visit, moral_echo_wallet_return, moral_echo_wallet_keep, side_hustle_setback, side_hustle_bounce_back);
  }
})();

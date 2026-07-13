/**
 * 城管联动事件 — 街头摊贩的"猫鼠游戏"
 *
 * 设计意图：state.chengguan { heat, lastRaid, warnings, relationship } 长期只有
 * main.js:3986 的自动巡逻系统在读写（纯消息、无玩家选择）。街头生存的核心张力
 * ——"城管来了"的惊魂一刻——缺少一个让玩家做选择的互动事件。
 *
 * 本文件新增 1 个高张力事件：热度 ≥ 60 时触发"远处出现城管执法车"，
 * 玩家必须在几秒内做出选择（跑/求情/塞钱/原地赌一把）。
 *
 * 接入方式：与 cross_system_events.js 相同的 IIFE 注入模式
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._chengguanEventsLoaded) return;
  RANDOM_EVENTS._chengguanEventsLoaded = true;

  var CHENGGUAN_EVENTS = [
    // ===== 事件：城管来了（高热度触发·街头摊贩惊魂）=====
    // 联动：chengguan.heat + relationship + 魅力 + 经济 + 道德
    {
      id: "chengguan_raid_panic",
      phase: "street",
      icon: "🚔",
      title: "城管来了！",
      story:
        "你正低头给客人找余钱，旁边卖水果的老李突然脸色一变，朝你使了个眼色。\\n\\n你顺着他的目光看过去——一辆城管的执法车正缓缓从街角拐过来。\\n\\n周围的小贩开始手忙脚乱地收摊。你心跳加速，脑子里飞速盘算。",
      // [conditions→triggers]
      triggers: {
        minDay: 20,
        excludeFlags: ["_chengguanRaidPanicSeen"],
      },
      conditions: function (st) {
        return st.chengguan && (st.chengguan.heat || 0) >= 60;
      },
      probability: 0.15,
      repeatable: false,
      choices: [
        {
          text: "🏃 卷起摊子就跑",
          hint: "保住货物，但累+心情差",
          apply: function (st) {
            st.flags._chengguanRaidPanicSeen = true;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 8);
            // 逃跑成功，热度略降（城管没抓到现行）
            st.chengguan.heat = Math.max(0, (st.chengguan.heat || 0) - 10);
            StateManager.addMessage(
              "🏃 你一把卷起摊子钻进了小巷。身后传来喇叭声，但你已经消失在人流里。货物保住了，但累得够呛，心情-8。",
              "warning",
            );
          },
        },
        {
          text: "🗣️ 上前求情说好话",
          hint: "魅力≥30可打动对方",
          apply: function (st) {
            st.flags._chengguanRaidPanicSeen = true;
            var charm = st.player.charm || 0;
            if (charm >= 30) {
              st.chengguan.relationship = Math.min(
                100,
                (st.chengguan.relationship || 0) + 8,
              );
              st.chengguan.heat = Math.max(0, (st.chengguan.heat || 0) - 20);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
              StateManager.addMessage(
                "🗣️ 你硬着头皮上前递烟、说好话。对方看你态度诚恳，摆摆手：「下次注意点，别摆外面！」魅力够用，化险为夷。城管关系+8，热度-20，心情+3。",
                "success",
              );
            } else {
              // 求情失败，被警告
              st.chengguan.warnings = (st.chengguan.warnings || 0) + 1;
              st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
              StateManager.addMessage(
                "🗣️ 你上前求情，但对方不为所动：「求情没用，下次再摆就收东西。」给了你一次警告。警告+1，心情-5。魅力不够，说话没底气。",
                "warning",
              );
            }
          },
        },
        {
          text: "💰 塞个红包了事",
          hint: "花¥200-400，直接摆平",
          apply: function (st) {
            st.flags._chengguanRaidPanicSeen = true;
            var bribe = Math.min(st.resources.cash, 200 + Random.int(0, 200));
            st.resources.cash -= bribe;
            st.chengguan.relationship = Math.min(
              100,
              (st.chengguan.relationship || 0) + 5,
            );
            st.chengguan.heat = Math.max(0, (st.chengguan.heat || 0) - 30);
            st.player.morality = Math.max(0, (st.player.morality || 50) - 2);
            StateManager.addMessage(
              "💰 你趁人不注意塞了¥" +
                bribe +
                "过去。对方愣了一下，揣进兜里，转身走了。热度-30，城管关系+5，道德-2。钱能解决的事都不算事，但你心里不太舒服。",
              "info",
            );
          },
        },
        {
          text: "🫥 原地不动，赌他没看见",
          hint: "50%没事 / 50%货物被没收+罚款",
          apply: function (st) {
            st.flags._chengguanRaidPanicSeen = true;
            if (Random.chance(0.5)) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
              StateManager.addMessage(
                "🫥 你低着头假装整理货物，心跳如雷。执法车慢慢开过去了——没停。运气好，躲过一劫。心情+5。",
                "success",
              );
            } else {
              var fine = 80 + Random.int(0, 220);
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - fine);
              st.chengguan.warnings = (st.chengguan.warnings || 0) + 1;
              st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 12);
              StateManager.addMessage(
                "🫥 你站在原地祈祷，但执法车还是停了下来。货物被没收，罚款¥" +
                  fine +
                  "，警告+1。心情-12。赌输了。",
                "danger",
              );
            }
          },
        },
      ],
    },
  ];

  // 注入到 RANDOM_EVENTS
  for (var i = 0; i < CHENGGUAN_EVENTS.length; i++) {
    RANDOM_EVENTS.push(CHENGGUAN_EVENTS[i]);
  }
})();

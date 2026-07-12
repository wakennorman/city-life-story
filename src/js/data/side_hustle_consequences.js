/**
 * 副业链式后续事件（v3.1 ② events_core.js 链式事件迭代）
 *
 * 设计理念：副业选择不只有一次性后果，还应在 5-60 天后产生回响——
 *   诚信退款 → 口碑传播 → 推荐新客户；
 *   创新教学法 → 教育机构挖角 → 主线新机遇。
 *
 * 接入方式：与 cross_system_events.js 同 pattern —
 *   IIFE 直接推入全局 RANDOM_EVENTS 数组（const RANDOM_EVENTS 在
 *   events_core.js page/script 作用域，本文件通过浏览器 script 标签
 *   同链加载可直接访问）。
 *
 * 触发方式：父事件 choice.apply() 在决策时调用：
 *     scheduleChainEvent(st, "<followup_id>", <delayDays>, "street")
 *   events_core.js::checkChainEventQueue() 到期弹出。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !Array.isArray(RANDOM_EVENTS))
    return;
  if (RANDOM_EVENTS._sideHustleConsequencesLoaded) return;
  RANDOM_EVENTS._sideHustleConsequencesLoaded = true;

  var _isBrowser = typeof window !== "undefined";

  // ====== 后续事件 1：代购口碑传播（诚信退款 7 天后）======
  RANDOM_EVENTS.push({
    id: "side_daigou_referral",
    phase: "street",
    icon: "🤝",
    _isChainEvent: true,
    title: "老客户推荐了新客",
    story:
      "一周前你全额退款的那位客户，今天发来微信：\n「我朋友也想代购，我把你推荐给她了，说你靠谱。」\n新客户直接发来了购物清单，金额还不小。",
    probability: 0.5,
    repeatable: false,
    choices: [
      {
        text: "🎯 好好服务新客户",
        hint: "赚钱+150~300，名气+3",
        apply: function (st) {
          var profit = Random.int(150, 300);
          st.resources.cash = (st.resources.cash || 0) + profit;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (_isBrowser) {
            StateManager.addMessage(
              "🤝 老客户推荐新客！诚信带来了转介绍，+¥" + profit + "，名气+3。",
              "success",
            );
          }
        },
      },
      {
        text: "💰 稍微加点价",
        hint: "多赚 50，但名气-2",
        apply: function (st) {
          var extra = Random.int(30, 70);
          st.resources.cash = (st.resources.cash || 0) + extra;
          st.player.fame = Math.max(0, (st.player.fame || 0) - 2);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
          if (_isBrowser) {
            StateManager.addMessage(
              "💰 你多报了¥" + extra + "。「好像被看出来了...」名气-2。",
              "warning",
            );
          }
        },
      },
    ],
  });

  // ====== 后续事件 2：教育机构挖角（创新教学法 12 天后）======
  RANDOM_EVENTS.push({
    id: "side_tutor_recruit",
    phase: "street",
    icon: "🎓",
    _isChainEvent: true,
    title: "教育机构找上门",
    story:
      "那个学生的家长是某培训机构的主管。她托话过来：\n「你的游戏教法很新颖，我们暑期班缺老师，一节课¥200，每周 3 节，来试试吗？」\n这比家教收入低一点，但胜在稳定、体面。",
    probability: 0.6,
    repeatable: false,
    choices: [
      {
        text: "✅ 接受邀约",
        hint: "稳定收入 ¥600/周，心智+5",
        apply: function (st) {
          st.flags.tutorAgencyOffer = true;
          st.resources.cash = (st.resources.cash || 0) + 600;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          if (_isBrowser) {
            StateManager.addMessage(
              "🎓 你接了机构邀约！月入稳定多¥2400，心智+5，心情+6。",
              "success",
            );
          }
        },
      },
      {
        text: "🚶 婉拒，继续自由职业",
        hint: "自由更值钱，道德+3",
        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (_isBrowser) {
            StateManager.addMessage(
              "🚶 你婉拒了，说自己更适合自由职业。道德+3，心情+3。",
              "info",
            );
          }
        },
      },
    ],
  });
})();

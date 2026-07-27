/**
 * 副业随机事件（v3.6 P0-3）
 *
 * 副业事件：客户投诉/交通事故/平台封号等
 */

const SIDE_HUSTLE_EVENTS = [
  // 代购：客户投诉
  {
    id: "side_daigou_complaint",
    hustle: "daigou",
    title: "客户投诉",
    icon: "😠",
    story:
      "你帮客户代购的商品有瑕疵，客户很不满意，要求退款并赔偿。\n「我花了这么多钱，就买到这个？」",
    choices: [
      {
        text: "💰 全额退款+赔偿¥50",
        hint: "损失¥130+，但保住信誉（7天后可能推荐新客）",
        cost: 130,
        apply: function (st) {
          // [联动flag] 触发"口碑传播"后续事件（v3.1 链式回响）
          if (!st.flags) st.flags = {};
          st.flags.daigouHonestService = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 130);
          if (typeof scheduleChainEvent === "function") {
            scheduleChainEvent(st, "side_daigou_referral", 7, "street");
          }
          StateManager.addMessage(
            "💰 你全额退款并赔偿了¥50。客户说会推荐朋友来——7 天后验证。",
            "warning",
          );
        },
      },
      {
        text: "🤝 协商部分退款",
        hint: "损失¥50，信誉小幅下降",
        cost: 50,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
          StateManager.addMessage(
            "🤝 你和客户协商后，退了¥50。客户勉强接受，但说下次要考虑清楚。",
            "info",
          );
        },
      },
      {
        text: "😤 拒绝赔偿",
        hint: "信誉下降，可能失去客户",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags.daigouBadReview = true;
          StateManager.addMessage(
            "😤 你拒绝赔偿。客户很生气，说再也不找你代购了。",
            "warning",
          );
        },
      },
    ],
  },

  // 网约车：交通事故
  {
    id: "side_ride_accident",
    hustle: "ride_hailing",
    title: "小剐蹭",
    icon: "🚗",
    story:
      "你在接单时不小心剐蹭了别人的车。对方下车查看，表情不太高兴。\n「你怎么开车的？」",
    choices: [
      {
        text: "🙏 道歉并私了",
        hint: "花费¥200-¥500",
        apply: function (st) {
          var cost = Random.int(200, 500);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
          StateManager.addMessage(
            "🙏 你道歉并赔了¥" + cost + "私了。对方拿了钱走了。",
            "warning",
          );
        },
      },
      {
        text: "📞 走保险",
        hint: "不影响现金，但保险记录+1",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags.rideInsuranceClaim = (st.flags.rideInsuranceClaim || 0) + 1;
          StateManager.addMessage(
            "📞 你走了保险。虽然不用自己赔钱，但保险记录多了1次，明年保费会上涨。",
            "info",
          );
        },
      },
      {
        text: "😰 跑",
        hint: "高风险：可能被举报",
        apply: function (st) {
          if (Random.chance(0.3)) {
            if (!st.flags) st.flags = {};
            st.flags.rideCaught = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
            StateManager.addMessage(
              "😰 你跑了，但被对方记下车牌举报了。罚款¥1000，驾照扣分。",
              "danger",
            );
          } else {
            StateManager.addMessage(
              "😰 你跑了，侥幸没被追上。但心里一直忐忑。",
              "info",
            );
          }
        },
      },
    ],
  },

  // 外卖：超时投诉
  {
    id: "side_delivery_late",
    hustle: "food_delivery",
    title: "超时了",
    icon: "⏰",
    story:
      "今天单太多，你送晚了。客户开门时一脸不高兴：「怎么这么慢？我都饿了！」\n而且餐有点洒了。",
    choices: [
      {
        text: "🙏 道歉并退部分钱",
        hint: "损失¥20-¥50",
        apply: function (st) {
          var refund = Random.int(20, 50);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - refund);
          StateManager.addMessage(
            "🙏 你道歉并退了¥" + refund + "。客户勉强接受了。",
            "info",
          );
        },
      },
      {
        text: "💪 解释路况",
        hint: "可能成功也可能失败",
        apply: function (st) {
          if (Random.chance(0.5)) {
            StateManager.addMessage(
              "💪 你解释了路况，客户理解了你。没扣钱。",
              "success",
            );
          } else {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);
            StateManager.addMessage(
              "💪 客户不听解释，还是扣了¥30。",
              "warning",
            );
          }
        },
      },
      {
        text: "😤 不服",
        hint: "可能被平台处罚",
        apply: function (st) {
          if (Random.chance(0.4)) {
            if (!st.flags) st.flags = {};
            st.flags.deliveryBan = true;
            StateManager.addMessage(
              "😤 你和客户吵了起来。平台收到投诉，暂停了你接单权限。",
              "danger",
            );
          } else {
            StateManager.addMessage(
              "😤 你坚持说自己没错。客户给了差评，但你没被处罚。",
              "warning",
            );
          }
        },
      },
    ],
  },

  // 自媒体：平台封号
  {
    id: "side_media_ban",
    hustle: "self_media",
    title: "账号被封",
    icon: "🚫",
    story:
      "你的自媒体账号被平台封了——可能是内容违规，也可能是被举报。\n「您的账号因违反社区规范，已被暂时封禁。」\n几千粉丝瞬间看不到了。",
    choices: [
      {
        text: "📝 申诉",
        hint: "需要等待，可能解封也可能维持",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags.mediaAppeal = true;
          StateManager.addMessage(
            "📝 你提交了申诉。平台说会在3个工作日内回复。这段时间无法更新内容。",
            "info",
          );
        },
      },
      {
        text: "🔄 换平台重新起步",
        hint: "粉丝清零，但获得新平台经验",
        apply: function (st) {
          // [联动flag] 触发"新平台品牌合作"后续事件
          if (!st.flags) st.flags = {};
          st.flags.selfMediaPivoted = true;
          if (st._sideHustleData && st._sideHustleData.selfMedia) {
            st._sideHustleData.selfMedia.followers = 0;
          }
          if (!st.player) st.player = {};
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "🔄 你决定换平台重新起步。虽然粉丝清零，但你学到了教训。心智+5。",
            "warning",
          );
        },
      },
      {
        text: "😞 放弃自媒体",
        hint: "失去自媒体副业",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags.gaveUpSelfMedia = true;
          StateManager.addMessage("😞 你觉得太累了，决定放弃自媒体。", "info");
        },
      },
    ],
  },

  // 投资理财：市场暴跌
  {
    id: "side_invest_crash",
    hustle: "investment_side",
    title: "市场暴跌",
    icon: "📉",
    story:
      "你投资的标的突然暴跌——新闻说是政策变化/黑天鹅事件。\n「您持有的资产今日下跌15%。」\n你有点慌。",
    choices: [
      {
        text: "💰 割肉离场",
        hint: "确认亏损，但止损",
        apply: function (st) {
          var loss = Random.int(100, 500);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - loss);
          StateManager.addMessage(
            "💰 你割肉离场，亏损¥" + loss + "。虽然心疼，但及时止损了。",
            "warning",
          );
        },
      },
      {
        text: "📈 持有观望",
        hint: "等待反弹，可能回本也可能继续跌",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags.investHold = true;
          StateManager.addMessage(
            "📈 你选择持有观望。投资需要耐心，希望明天会好起来。",
            "info",
          );
        },
      },
      {
        text: "🔥 抄底",
        hint: "高风险高回报，需要额外资金",
        cost: 200,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200); // [全系统自洽修复] 域B A类:cash NaN守卫
          if (Random.chance(0.4)) {
            var profit = Random.int(300, 800);
            // [联动flag] 触发"被人请教投资"后续事件
            if (!st.flags) st.flags = {};
            st.flags.investBottomed = true;
            st.resources.cash = (st.resources.cash || 0) + profit; // [全系统自洽修复] 域B A类:cash NaN守卫
            StateManager.addMessage(
              "🔥 你抄底成功了！赚了¥" + profit + "。胆子大的人运气好。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🔥 抄底抄在半山腰。又亏了¥200。",
              "danger",
            );
          }
        },
      },
    ],
  },

  // 家教：学生不听话
  {
    id: "side_tutor_difficult",
    hustle: "tutoring",
    title: "学生不听话",
    icon: "👦",
    story:
      "你辅导的学生今天特别不听话，一直在玩手机。\n「我不想学了，太无聊了。」\n家长在旁边很尴尬。",
    choices: [
      {
        text: "📱 没收手机",
        hint: "学生可能更反抗",
        apply: function (st) {
          if (Random.chance(0.3)) {
            StateManager.addMessage(
              "📱 你没收了手机，学生安静下来开始学习。家长很满意。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "📱 学生大闹一场，家长很尴尬，说下次不找你教了。",
              "warning",
            );
          }
        },
      },
      {
        text: "🎮 用游戏教学法",
        hint: "需要创意（成功后 12 天机构挖角）",
        apply: function (st) {
          if (Random.chance(0.6)) {
            // [联动flag] 触发"教育机构挖角"后续事件（v3.1 链式回响）
            if (!st.flags) st.flags = {};
            st.flags.tutorInnovative = true;
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "side_tutor_recruit", 12, "street");
            }
            StateManager.addMessage(
              "🎮 你用游戏的方式教学，学生突然感兴趣了。家长很惊喜——她说要推荐你给机构，12 天后联系你。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🎮 游戏教学法没奏效，学生还是不想学。",
              "info",
            );
          }
        },
      },
      {
        text: "👋 结束课程",
        hint: "损失部分收入",
        cost: 30,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);
          StateManager.addMessage(
            "👋 你提前结束了课程。虽然损失了点钱，但没必要浪费时间。",
            "info",
          );
        },
      },
    ],
  },
];

/**
 * 随机触发一个副业事件（v3.1 链式事件 ② 新增）
 *
 * 被 performHustle 在副业执行后以 ~8% 概率调用。
 * 仅当玩家当前拥有对应副业 hustle 且当日未触发过同类事件时才弹出。
 *
 * @param {Object} state - 游戏状态
 * @param {string} currentHustleId - 当前刚执行完的副业ID（仅触发相关事件）
 */
function triggerSideHustleEvent(state, currentHustleId) {
  if (!state || !state.player || state._pendingEvent) return false;
  if (!state.flags) state.flags = {};

  // 当日最多触发一次
  var todayKey = "side_hustle_event_" + state.player.day;
  if (state.flags[todayKey]) return false;

  // 候选：与当前 hustle 匹配 + 未在本周重复
  var week = Math.floor(state.player.day / 7);
  var eligible = [];
  for (var i = 0; i < SIDE_HUSTLE_EVENTS.length; i++) {
    var evt = SIDE_HUSTLE_EVENTS[i];
    if (evt.hustle && evt.hustle !== currentHustleId) continue;
    if (!evt.hustle && currentHustleId) continue;
    // 本周去重
    var lastKey = "side_hustle_last_" + evt.id;
    if (state.flags[lastKey] && state.flags[lastKey] === week) continue;
    eligible.push(evt);
  }
  if (eligible.length === 0) return false;

  var evt = eligible[Math.floor(Random.next() * eligible.length)];
  state.flags[todayKey] = true;
  state.flags["side_hustle_last_" + evt.id] = week;

  // 构造弹窗按钮
  var buttons = evt.choices.map(function (choice) {
    return {
      text: choice.text,
      cls: choice.cost > 0 ? "btn-warning" : "btn-primary",
      callback: function () {
        var s = StateManager.getState();
        if (choice.apply) choice.apply(s);
        renderAll();
      },
    };
  });

  showModal({
    title: (evt.icon ? evt.icon + " " : "") + evt.title,
    body: '<p style="line-height:1.7;">' + evt.story + "</p>",
    buttons: buttons,
  });
  return true;
}

// 导出
if (typeof window !== "undefined") {
  window.SIDE_HUSTLE_EVENTS = SIDE_HUSTLE_EVENTS;
  window.triggerSideHustleEvent = triggerSideHustleEvent;
}
// [R314] 域B
// [R402] 域B
// [R482] 域B
// [R570] 域B

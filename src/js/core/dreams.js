/**
 * 梦想追踪系统 — 人生目标与里程碑叙事
 *
 * 参考《大多数》阶级跃升感：给玩家一个清晰的长期方向，
 * 分阶段里程碑配合叙事消息，让"努力"有具体回报的感知。
 *
 * 5种梦想 × 5个里程碑，每个里程碑条件达成后触发一次性叙事。
 * 状态存储在 state.flags._dreamId / _dreamMilestone / _dreamStartDay
 */

var DREAMS = [
  {
    id: "restaurant",
    name: "开一家餐馆",
    icon: "🍜",
    desc: "用双手和手艺，在这座城市撑起一片天地",
    milestones: [
      {
        id: "rest_1",
        title: "初显厨艺",
        condition: function (st) {
          return st.skills.cooking && st.skills.cooking.level >= 15;
        },
        story:
          '你开始有模有样地做菜了。街坊邻居说你的手艺越来越好，叫你"小厨师"。那个餐馆的梦想，不再只是幻想。',
      },
      {
        id: "rest_2",
        title: "积累本金",
        condition: function (st) {
          return (
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 5000
          );
        },
        story:
          "存款第一次突破五千元。你默默算着：再存多少，才够租一个小店面？目标清晰了，脚步也更坚定。",
      },
      {
        id: "rest_3",
        title: "手艺精进",
        condition: function (st) {
          return st.skills.cooking && st.skills.cooking.level >= 40;
        },
        story:
          '烹饪技能已达40级。有人开始找你帮忙做宴席，说你做的菜"有大厨的水准"。你心里清楚，这距离真正的餐馆还有距离——但方向对了。',
      },
      {
        id: "rest_4",
        title: "原始积累",
        condition: function (st) {
          return (
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 30000
          );
        },
        story:
          "三万元！你深夜翻着存折，想起刚来这座城市时兜里只有1500块。一个属于自己的小餐馆，真的可以实现了。",
      },
      {
        id: "rest_5",
        title: "圆梦开业",
        condition: function (st) {
          return (
            st.skills.cooking &&
            st.skills.cooking.level >= 60 &&
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 80000
          );
        },
        story:
          "🎉 你做到了！技艺精湛，本金充足。属于你自己的餐馆正式开业，红布拆下的那一刻，你忍不住红了眼眶。这一切，都值了。",
      },
    ],
  },

  {
    id: "apartment",
    name: "在城里安个家",
    icon: "🏠",
    desc: "有一天，在这座城市拥有一套属于自己的房子",
    milestones: [
      {
        id: "apt_1",
        title: "告别城中村",
        condition: function (st) {
          return st.housing && st.housing.tier >= 2;
        },
        story:
          "终于搬出了城中村。新住所虽然不大，但那扇不漏风的窗户让你睡得特别踏实。这是第一步。",
      },
      {
        id: "apt_2",
        title: "首付幻想",
        condition: function (st) {
          return (
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 10000
          );
        },
        story:
          "存款突破一万。你开始关注房产App，在那些标价百万的楼盘里研究地段。还差得远，但你第一次觉得，那不是遥不可及的事。",
      },
      {
        id: "apt_3",
        title: "努力方向",
        condition: function (st) {
          return (
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 50000
          );
        },
        story:
          "五万元入账的那一刻，你重新看了看那套小户型。首付还差一半，但距离缩短了。你更拼了。",
      },
      {
        id: "apt_4",
        title: "凑够首付",
        condition: function (st) {
          return (
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 150000
          );
        },
        story:
          '十五万了。够了，首付够了！你激动得打电话给家里，说"妈，我在城里要买房了"。电话那头沉默片刻，然后是一声哽咽的"好"。',
      },
      {
        id: "apt_5",
        title: "安家落户",
        condition: function (st) {
          return (
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 300000
          );
        },
        story:
          "🎉 三十万！你把钥匙握在手心，站在那套小两室里，阳光透过窗户照进来。你叫它：家。",
      },
    ],
  },

  {
    id: "abroad",
    name: "出国留学深造",
    icon: "🎓",
    desc: "有一天走出国门，用知识改变命运",
    milestones: [
      {
        id: "abroadd_1",
        title: "英语入门",
        condition: function (st) {
          return st.skills.english && st.skills.english.level >= 15;
        },
        story:
          '英语15级。你第一次看懂了一段英文新闻。那个遥远的"出国"梦，突然有了具体的颜色。',
      },
      {
        id: "abroad_2",
        title: "坚持学习",
        condition: function (st) {
          return (
            (st.flags._nightSchoolCount || 0) >= 20 ||
            (st.skills.english && st.skills.english.level >= 30)
          );
        },
        story:
          '你坚持夜校学英语已经二十多次了。工友笑你"瞎折腾"，你笑了笑，没解释。',
      },
      {
        id: "abroad_3",
        title: "语言能力",
        condition: function (st) {
          return st.skills.english && st.skills.english.level >= 50;
        },
        story:
          "英语50级！你用英语完整地跟外国人对话了一次。那种自信，是任何钱都买不来的。",
      },
      {
        id: "abroad_4",
        title: "学费到位",
        condition: function (st) {
          return (
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 50000
          );
        },
        story:
          "五万元，学费和生活费基本够了。你在电脑前填写了人生第一份海外大学申请表单。",
      },
      {
        id: "abroad_5",
        title: "扬帆出海",
        condition: function (st) {
          return (
            st.skills.english &&
            st.skills.english.level >= 70 &&
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 80000
          );
        },
        story:
          "🎉 英语70级+8万存款——你做到了！录取通知书到手的那一天，你在城中村的小街上走了很久，把每一块砖都记在了心里。再见，这里。",
      },
    ],
  },

  {
    id: "investor",
    name: "成为投资大亨",
    icon: "💰",
    desc: "用钱生钱，让资产替自己工作",
    milestones: [
      {
        id: "inv_1",
        title: "第一桶金",
        condition: function (st) {
          return (
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 5000
          );
        },
        story:
          '五千元！你第一次感受到手里有"本金"是什么感觉。真正的投资，从这里开始。',
      },
      {
        id: "inv_2",
        title: "初入市场",
        condition: function (st) {
          return (
            (st.trade && st.trade.totalProfit >= 500) ||
            st.resources.bankBalance >= 3000
          );
        },
        story:
          '通过倒卖差价赚了五百元纯利润。你开始理解"低买高卖"不只是口号，而是真实可操作的逻辑。',
      },
      {
        id: "inv_3",
        title: "资本积累",
        condition: function (st) {
          return (
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 30000
          );
        },
        story:
          '三万！你开始认真研究投资，问老周打听有没有"内部消息"。老周摇摇头笑了："小伙子，先学会守住钱，再谈赚大钱。"',
      },
      {
        id: "inv_4",
        title: "财富渐丰",
        condition: function (st) {
          return (
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 100000
          );
        },
        story:
          "一百万……不，是十万。但这感觉，已经离那个梦想很近了。你打开投资软件，开始把一部分钱投入收益更高的项目。",
      },
      {
        id: "inv_5",
        title: "财务自由",
        condition: function (st) {
          return (
            (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 500000
          );
        },
        story:
          "🎉 五十万！光靠存款利息每个月就能有一两千的被动收入了。你慢慢喝着早茶，不再算工时——你赢了这场游戏。",
      },
    ],
  },

  {
    id: "celebrity",
    name: "成为城市名人",
    icon: "⭐",
    desc: "靠才华和魅力，在这座城市留下自己的名字",
    milestones: [
      {
        id: "cel_1",
        title: "街头初秀",
        condition: function (st) {
          return st.status && st.status.fame >= 10;
        },
        story:
          "名气达到10点。路过的人开始回头看你表演，有人还拍了段视频发朋友圈。微末之始，不过如此。",
      },
      {
        id: "cel_2",
        title: "小有名气",
        condition: function (st) {
          return st.status && st.status.fame >= 30;
        },
        story:
          '名气30点。有人认出了你："哎，你就是那个经常在商业区唱歌的吧？"你笑着点头，心里暖洋洋的。',
      },
      {
        id: "cel_3",
        title: "人脉广结",
        condition: function (st) {
          var rels = st.relationships || {};
          var highAffinity = Object.values(rels).filter(function (r) {
            return r && r.affinity >= 50;
          }).length;
          return highAffinity >= 4;
        },
        story:
          '和4位NPC好感度都超过50了。王阿姨说你是"孩子里最有出息的"，老板李说要给你"开个后门"。你笑着谢过，心里更踏实了。',
      },
      {
        id: "cel_4",
        title: "城区明星",
        condition: function (st) {
          return st.status && st.status.fame >= 60;
        },
        story:
          '名气60点。当地小报居然采访了你，问你"怎么在这座城市闯出名堂"。你想了想，说：靠的是认真。',
      },
      {
        id: "cel_5",
        title: "一方名人",
        condition: function (st) {
          return st.status && st.status.fame >= 85;
        },
        story:
          "🎉 名气85点！你的名字，已经在这座城市的某个角落留了下来。不管明天如何，这段经历将永远属于你。",
      },
    ],
  },
];

/** 获取当前梦想定义 */
function getCurrentDream(state) {
  var id = state.flags && state.flags._dreamId;
  if (!id) return null;
  return (
    DREAMS.find(function (d) {
      return d.id === id;
    }) || null
  );
}

/** 每日检查梦想里程碑进度 */
function checkDreamProgress(state) {
  var dream = getCurrentDream(state);
  if (!dream) return;

  var currentMilestone = state.flags._dreamMilestone || 0;
  if (currentMilestone >= dream.milestones.length) return; // 已全部完成

  var milestone = dream.milestones[currentMilestone];
  if (!milestone) return;

  // 检查条件
  if (milestone.condition(state)) {
    state.flags._dreamMilestone = currentMilestone + 1;
    // 防重复触发
    var flagKey = "_dreamMilestoneShown_" + milestone.id;
    if (!state.flags[flagKey]) {
      state.flags[flagKey] = true;
      StateManager.addMessage(
        dream.icon +
          " 【梦想里程碑：" +
          milestone.title +
          "】\n" +
          milestone.story,
        "event",
      );
    }
  }
}

/** 获取梦想进度百分比 */
function getDreamProgress(state) {
  var dream = getCurrentDream(state);
  if (!dream) return 0;
  var done = state.flags._dreamMilestone || 0;
  return Math.min(100, Math.round((done / dream.milestones.length) * 100));
}

/** 获取当前里程碑标题（用于UI显示） */
function getDreamCurrentTitle(state) {
  var dream = getCurrentDream(state);
  if (!dream) return "";
  var idx = state.flags._dreamMilestone || 0;
  if (idx >= dream.milestones.length) return "圆梦！ 🎉";
  return dream.milestones[idx].title;
}

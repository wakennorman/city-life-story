/**
 * 职场社交事件 — 接入 state.workplaceSocial 子系统
 *
 * 设计意图：state.js 中的 workplaceSocial { colleagues, mentorship,
 * officePoliticsLog, network } 字段目前**没有任何随机事件读取或写入**。
 * 职场生态——甩锅、抢功、站队、八卦、团建——是 Phase2 玩家每天面对的
 * 核心体验，但目前完全缺失。
 *
 * 本文件用 5 个事件填补：
 *   1. ws_blame_shifting     — 甩锅危机（有人想把失败推给你）
 *   2. ws_mentor_request     — 新人拜师（有人想成为你的徒弟）
 *   3. ws_gossip_backlash    — 八卦反噬（你传播的八卦传回自己）
 *   4. ws_team_building      — 团建抉择（强制参加 vs 找借口逃避）
 *   5. ws_credit_stealing    — 抢功（同事把成果说成他的）
 *
 * 接入方式：与 cross_system_events.js 相同的 IIFE 注入模式
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._workplaceSocialEventsLoaded) return;
  RANDOM_EVENTS._workplaceSocialEventsLoaded = true;

  var WS_EVENTS = [
    // ===== 事件1：甩锅危机=====
    // 联动：workplaceSocial.colleagues + 项目失败 + 道德
    {
      id: "ws_blame_shifting",
      icon: "🍠",
      title: "甩锅大会",
      story:
        "周会上，老板拍了一下桌子：「这个项目为什么延期了？！」\\n\\n所有人的目光都往你这边扫。你知道这是小赵负责的部分，但他正一脸无辜地看着老板——而你上周帮他改了那个bug。\\n\\n空气安静了两秒。\\n\\n你必须开口。",
      conditions: function (st) {
        // 有同事关系 + 在职 + 天数足够
        var cols =
          st.corporate && st.corporate.colleagues
            ? st.corporate.colleagues.network
            : [];
        return (
          st.player.phase === "corporate" &&
          cols.length > 0 &&
          st.player.day >= 60 &&
          !st.flags._blameSeen &&
          Random.chance(0.02)
        );
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "🛡️ 直接指出：是小赵负责的",
          hint: "得罪同事，但保住自己",
          apply: function (st) {
            st.flags._blameSeen = true;
            var cols = st.corporate.colleagues.network;
            var target = cols[Random.int(0, cols.length - 1)];
            target.relationship = Math.max(0, target.relationship - 15);
            target.trust = Math.max(0, target.trust - 20);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
            if (!st.workplaceSocial) st.workplaceSocial = {};
            if (!st.workplaceSocial.officePoliticsLog)
              st.workplaceSocial.officePoliticsLog = [];
            st.workplaceSocial.officePoliticsLog.push({
              day: st.player.day,
              eventType: "blame_shifting",
              outcome: "confront",
              target: target.name,
              note: "公开对抗",
            });
            StateManager.addMessage(
              "🛡️ 你说出了实情。小赵脸涨得通红。老板点了点头，没再追问。但你被孤立了——下午路过小赵工位，他拉上了椅子。好感-15。",
              "warning",
            );
          },
        },
        {
          text: "🤐 沉默不语，自己扛下来",
          hint: "关系维护，但背锅",
          apply: function (st) {
            st.flags._blameSeen = true;
            var cols = st.corporate.colleagues.network;
            var target = cols[Random.int(0, cols.length - 1)];
            target.relationship = Math.min(100, target.relationship + 8);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 10);
            if (!st.workplaceSocial) st.workplaceSocial = {};
            if (!st.workplaceSocial.officePoliticsLog)
              st.workplaceSocial.officePoliticsLog = [];
            st.workplaceSocial.officePoliticsLog.push({
              day: st.player.day,
              eventType: "blame_shifting",
              outcome: "absorb",
              target: target.name,
              note: "默默背锅",
            });
            StateManager.addMessage(
              "🤐 你什么也没说。散会时小赵拍了一下你的肩：「兄弟，谢了。」你笑了笑。心情-10，关系+8。有时候忍一忍能换来长期的东西。",
              "warning",
            );
          },
        },
        {
          text: "🧠 反将一军：提出解决方案",
          hint: "需要智力≥50",
          apply: function (st) {
            st.flags._blameSeen = true;
            if ((st.player.intelligence || 0) >= 50) {
              var cols = st.corporate.colleagues.network;
              var target = cols[Random.int(0, cols.length - 1)];
              target.relationship = Math.max(0, target.relationship - 5);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 0) + 1,
              );
              StateManager.addMessage(
                "🧠 你没急着辩解，而是拿出一份方案：「问题出在这里，我已经修复了，这是后续防线的建议。」老板满意了，小赵也没话说。智力+1，名声+5。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 8);
              StateManager.addMessage(
                "🧠 你想提出解决方案，但卡壳了。话到嘴边说不出来。大家等了几秒，你只能讪讪地坐下。心情-8。",
                "warning",
              );
            }
            if (!st.workplaceSocial) st.workplaceSocial = {};
            if (!st.workplaceSocial.officePoliticsLog)
              st.workplaceSocial.officePoliticsLog = [];
            st.workplaceSocial.officePoliticsLog.push({
              day: st.player.day,
              eventType: "blame_shifting",
              outcome: "solve",
              note:
                (st.player.intelligence || 0) >= 50 ? "成功化解" : "表达失败",
            });
          },
        },
      ],
    },

    // ===== 事件2：新人拜师=====
    // 联动：workplaceSocial.colleagues + mentorship + 人脉
    {
      id: "ws_mentor_request",
      icon: "🙏",
      title: "一个年轻人的请求",
      story:
        "午休时，新来的实习生小李端着两杯咖啡找到你。\\n\\n「哥，我入行不久，很多东西不懂。我看你技术挺好的……能不能带我一下？我可以学东西，也可以帮你干活。」\\n\\n他眼睛亮亮的，像刚毕业时的你。",
      conditions: function (st) {
        // 在职 + 有同事网络 + 天数足够
        var cols =
          st.corporate && st.corporate.colleagues
            ? st.corporate.colleagues.network
            : [];
        return (
          st.player.phase === "corporate" &&
          cols.length > 0 &&
          st.player.day >= 120 &&
          !st.flags._mentorRequestSeen &&
          Random.chance(0.015)
        );
      },
      probability: 0.02,
      repeatable: false,
      choices: [
        {
          text: "👨‍🏫 收他为徒",
          hint: "长期投资，但消耗时间",
          apply: function (st) {
            st.flags._mentorRequestSeen = true;
            var cols = st.corporate.colleagues.network;
            var mentee = cols[Random.int(0, cols.length - 1)];
            mentee.role = "subordinate";
            mentee.relationship = Math.min(100, mentee.relationship + 10);
            if (!st.corporate.colleagues.mentees)
              st.corporate.colleagues.mentees = [];
            st.corporate.colleagues.mentees.push({
              menteeId: mentee.id,
              menteeName: mentee.name,
              startedDay: st.player.day,
              progress: 0,
            });
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
            StateManager.addMessage(
              "👨‍🏫 你收下了小李。他每天提前到公司，跟着你学东西。有时候你挺烦的——又要教人。但看到他的进度，又觉得还行。",
              "info",
            );
          },
        },
        {
          text: "🙂 口头指导，不当正式导师",
          hint: "轻投入，关系稳定",
          apply: function (st) {
            st.flags._mentorRequestSeen = true;
            var cols = st.corporate.colleagues.network;
            var mentee = cols[Random.int(0, cols.length - 1)];
            mentee.relationship = Math.min(100, mentee.relationship + 5);
            StateManager.addMessage(
              "🙂 你说：「有问题随时来问。」小李很高兴。关系+5。",
              "info",
            );
          },
        },
        {
          text: "🚫 拒绝：我没空",
          hint: "省事但关系破裂",
          apply: function (st) {
            st.flags._mentorRequestSeen = true;
            var cols = st.corporate.colleagues.network;
            var mentee = cols[Random.int(0, cols.length - 1)];
            mentee.relationship = Math.max(0, mentee.relationship - 10);
            StateManager.addMessage(
              "🚫 你说：「我最近挺忙的。」小李脸垮了一下，说：「好吧。」关系-10。有些机会就这样错过了。",
              "warning",
            );
          },
        },
      ],
    },

    // ===== 事件3：八卦反噬=====
    // 联动：workplaceSocial.officePoliticsLog + 关系 + 声望
    {
      id: "ws_gossip_backlash",
      icon: "👂",
      title: "八卦回锅",
      story:
        "你以前传过一些话——关于某个同事的八卦、关于某个领导的流言。\\n\\n你以为这些事烂在了肚子里。\\n\\n但今天午休，你听到茶水间里有人在讲你的事——原来是你以前传的那些话，经过几个人的嘴，最后传成了关于你的版本。\\n\\n而且版本越来越离谱。",
      conditions: function (st) {
        // 在职 + 有过办公室政治记录 + 天数足够
        var logs =
          st.workplaceSocial && st.workplaceSocial.officePoliticsLog
            ? st.workplaceSocial.officePoliticsLog
            : [];
        return (
          st.player.phase === "corporate" &&
          st.player.day >= 150 &&
          (logs.length > 0 || st.player.day >= 200) &&
          !st.flags._gossipBacklashSeen &&
          Random.chance(0.015)
        );
      },
      probability: 0.02,
      repeatable: false,
      choices: [
        {
          text: "😤 找源头对质",
          hint: "可能成功，也可能更糟",
          apply: function (st) {
            st.flags._gossipBacklashSeen = true;
            if ((st.player.charm || 0) >= 30) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
              StateManager.addMessage(
                "😤 你找到了传播源头，据理力争。对方不好意思地道歉了，八卦被澄清了。名声+3。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 8);
              st.player.fame = Math.max(0, (st.player.fame || 0) - 3);
              StateManager.addMessage(
                "😤 你去找对方理论，但他一脸无辜：「不是我说的啊！」你无话可说。名声-3，心情-8。",
                "warning",
              );
            }
          },
        },
        {
          text: "🧘 冷处理，时间会证明",
          hint: "等待，需要耐心",
          apply: function (st) {
            st.flags._gossipBacklashSeen = true;
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
            st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
            StateManager.addMessage(
              "🧘 你什么也没说。几天后，新的八卦来了，旧的就被人们淡忘了。心情-5，道德+3。",
              "info",
            );
          },
        },
        {
          text: "🔥 以牙还牙，散布对方的八卦",
          hint: "报复，道德-5",
          apply: function (st) {
            st.flags._gossipBacklashSeen = true;
            st.player.morality = Math.max(0, (st.player.morality || 50) - 5);
            st.player.fame = Math.max(0, (st.player.fame || 0) - 5);
            StateManager.addMessage(
              "🔥 你找到了对方的小秘密，悄悄放了出去。但你知道，这并不能解决问题——只是让大家都变得更脏。道德-5，名声-5。",
              "danger",
            );
          },
        },
      ],
    },

    // ===== 事件4：团建抉择=====
    // 联动：workplaceSocial.colleagues + 现金 + 疲劳
    {
      id: "ws_team_building",
      icon: "🎉",
      title: "今晚团建，你去吗？",
      story:
        "群里@了所有人：「今晚7点XX餐厅团建，K歌+火锅，全员参加！」\\n\\n你看了看时间：今晚你本来打算回去打游戏、早点休息。\\n\\n不去？老板看着，同事也看着。去了？又是吃吃喝喝到半夜。\\n\\n但你发现——这次团建，是和小赵一起。上次甩锅之后，你还没和他正式说过话。",
      conditions: function (st) {
        // 在职 + 有同事网络 + 天数足够
        var cols =
          st.corporate && st.corporate.colleagues
            ? st.corporate.colleagues.network
            : [];
        return (
          st.player.phase === "corporate" &&
          cols.length > 0 &&
          st.player.day >= 90 &&
          !st.flags._teamBuildingSeen &&
          Random.chance(0.02)
        );
      },
      probability: 0.02,
      repeatable: false,
      choices: [
        {
          text: "🍻 去，和所有人好好喝一杯",
          hint: "关系+5，但花钱+累",
          apply: function (st) {
            st.flags._teamBuildingSeen = true;
            var cost = Math.min(300, st.resources.cash);
            st.resources.cash -= cost;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
            var cols = st.corporate.colleagues.network;
            for (var i = 0; i < Math.min(cols.length, 3); i++) {
              cols[i].relationship = Math.min(100, cols[i].relationship + 3);
            }
            StateManager.addMessage(
              "🍻 你去了。喝酒、唱歌、聊天，一直到凌晨1点。和小赵也聊了几句，关系缓和了不少。花了¥" +
                cost +
                "，累但不后悔。",
              "info",
            );
          },
        },
        {
          text: "🙏 找借口推掉",
          hint: "省事但关系-5",
          apply: function (st) {
            st.flags._teamBuildingSeen = true;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
            var cols = st.corporate.colleagues.network;
            for (var i = 0; i < Math.min(cols.length, 2); i++) {
              cols[i].relationship = Math.max(0, cols[i].relationship - 3);
            }
            StateManager.addMessage(
              "🙏 你说身体不舒服。老板没说什么，但你看得到他眼里的不悦。关系-5。",
              "warning",
            );
          },
        },
        {
          text: "😌 只去一会儿，点个卯就走",
          hint: "折中",
          apply: function (st) {
            st.flags._teamBuildingSeen = true;
            var cost = Math.min(50, st.resources.cash);
            st.resources.cash -= cost;
            var cols = st.corporate.colleagues.network;
            for (var i = 0; i < Math.min(cols.length, 2); i++) {
              cols[i].relationship = Math.min(100, cols[i].relationship + 1);
            }
            StateManager.addMessage(
              "😌 你去了两小时，吃了几口就找了个理由走了。老板没注意到，同事也没说什么。花了¥" +
                cost +
                "，关系微升。",
              "info",
            );
          },
        },
      ],
    },

    // ===== 事件5：抢功=====
    // 联动：workplaceSocial.colleagues + 声望 + 智力
    {
      id: "ws_credit_stealing",
      icon: "💼",
      title: "会议室里的「我的想法」",
      story:
        "下午的产品评审会上，老张指着你的方案说：「这个思路我之前提过，你们可以参考一下。」\\n\\n但你清楚记得——这个方案是你上周熬夜做的，邮件抄送了全组。\\n\\n全组看着你，等着你的反应。\\n\\n你深吸了一口气。",
      conditions: function (st) {
        // 在职 + 有同事网络 + 天数足够
        var cols =
          st.corporate && st.corporate.colleagues
            ? st.corporate.colleagues.network
            : [];
        return (
          st.player.phase === "corporate" &&
          cols.length > 0 &&
          st.player.day >= 120 &&
          !st.flags._creditStealingSeen &&
          Random.chance(0.015)
        );
      },
      probability: 0.02,
      repeatable: false,
      choices: [
        {
          text: "📧 当场拿出邮件记录",
          hint: "需要证据链，智力≥40",
          apply: function (st) {
            st.flags._creditStealingSeen = true;
            if ((st.player.intelligence || 0) >= 40) {
              var cols = st.corporate.colleagues.network;
              var target = cols[Random.int(0, cols.length - 1)];
              target.relationship = Math.max(0, target.relationship - 20);
              target.trust = Math.max(0, target.trust - 15);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
              StateManager.addMessage(
                "📧 你打开邮箱，把上周的邮件投屏了。老张脸红了，会议继续。你赢了，但也树了一个敌人。名声+5。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 8);
              StateManager.addMessage(
                "📧 你想找邮件，但翻了一会儿没找到。尴尬了。老张笑笑：「没事没事。」你灰溜溜地坐下。心情-8。",
                "warning",
              );
            }
          },
        },
        {
          text: "😌 算了，不争了",
          hint: "短期吃亏，长期观察",
          apply: function (st) {
            st.flags._creditStealingSeen = true;
            var cols = st.corporate.colleagues.network;
            var target = cols[Random.int(0, cols.length - 1)];
            target.relationship = Math.max(0, target.relationship - 5);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
            StateManager.addMessage(
              "😌 你笑了笑：「哈哈，老张记得真清楚。」散会时你心里不舒服，但面上没表现出来。心情-5。有些仗不值得打。",
              "warning",
            );
          },
        },
        {
          text: "🤔 下次提前留痕",
          hint: "学习经验，长期有益",
          apply: function (st) {
            st.flags._creditStealingSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 1,
            );
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
            StateManager.addMessage(
              "🤔 你决定从此以后所有方案都留备份、抄送、截屏。职场不是学校，规则不一样。智力+1，心情+3。",
              "info",
            );
          },
        },
      ],
    },
  ];

  // 注入到 RANDOM_EVENTS
  for (var i = 0; i < WS_EVENTS.length; i++) {
    RANDOM_EVENTS.push(WS_EVENTS[i]);
  }
})();

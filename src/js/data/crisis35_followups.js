/**
 * v3.3 W1-T1: 35 岁分水岭三路径延伸事件链
 *
 * 让 `_crisis35Path` 选定后 30~90 天内有响应，3 条路径各 2 个事件，
 * 外加 T3 的坏账/好心借出回响事件 2 条，共 8 条事件。
 *
 * 注入方式：在 RANDOM_EVENTS 已加载后通过 IIFE 追加。
 * 计时起点：`_crisis35Day`（在 review_improvements.js::check35Crisis 写入）。
 * 一次性事件：使用 `state.flags.<id>` 标记防重。
 */

(function () {
  if (typeof window === "undefined") return;
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._crisis35FollowupsLoaded) return;
  RANDOM_EVENTS._crisis35FollowupsLoaded = true;

  function _dayOffset(state) {
    var base = (state.flags && state.flags._crisis35Day) || 0;
    return (state.player.day || 0) - base;
  }

  var CRISIS35_FOLLOWUPS = [
    // ============================================================
    // EXAM 路径：备考公
    // ============================================================
    {
      id: "c35_exam_first_try",
      phase: "street",
      icon: "📝",
      title: "第一次模考",
      story:
        "公考论坛报了一场全真模考。考场里全是熟悉的中年面孔——大家都揣着同样的赌注。",
      conditions: function (st) {
        return (
          st.flags &&
          st.flags._crisis35Path === "exam" &&
          _dayOffset(st) >= 30 &&
          _dayOffset(st) <= 60 &&
          !st.flags.c35_exam_first_try
        );
      },
      choices: [
        {
          text: "🧠 全力以赴",
          apply: function (st) {
            st.flags.c35_exam_first_try = true;
            var iq = st.player.intelligence || 0;
            var fatigue = st.needs.fatigue || 0;
            var score = iq * 0.8 - fatigue * 0.3 + Random.int(-10, 10);
            if (score >= 55) {
              st.flags._examModelScorePass = true;
              st.needs.happiness = Math.min(100, st.needs.happiness + 12);
              StateManager.addMessage(
                "📊 模考成绩出来：行测78、申论65。你看到了上岸的希望。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 12);
              StateManager.addMessage(
                "📊 模考分数惨不忍睹。你盯着错题册发呆，怀疑自己是不是真的考不上。",
                "warning",
              );
            }
            st.needs.fatigue = Math.min(100, fatigue + 15);
          },
        },
        {
          text: "🛑 跳过这次（先复习）",
          apply: function (st) {
            st.flags.c35_exam_first_try = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 2,
            );
            StateManager.addMessage(
              "📚 你决定再多看一周书。机会还在后头。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "c35_exam_decision",
      phase: "street",
      icon: "🎯",
      title: "笔试日 OR 放弃",
      story:
        "真正的笔试报名表摆在面前。你考虑了一夜：是赌上半年的辛苦，还是趁早转身？",
      conditions: function (st) {
        return (
          st.flags &&
          st.flags._crisis35Path === "exam" &&
          _dayOffset(st) >= 90 &&
          _dayOffset(st) <= 130 &&
          !st.flags.c35_exam_decision
        );
      },
      choices: [
        {
          text: "✊ 报名上考场",
          apply: function (st) {
            st.flags.c35_exam_decision = "tried";
            var iq = st.player.intelligence || 0;
            var prevPass = st.flags._examModelScorePass ? 15 : 0;
            var chance = iq + prevPass - 60;
            if (Random.chance(Math.max(0.1, Math.min(0.85, chance / 100)))) {
              st.flags._passedCivilService = true;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 25);
              st.resources.cash = (st.resources.cash || 0) + scaleAmount(5000, st.resources && st.resources.totalEarned);
              StateManager.addMessage(
                "🎉 笔试通过！进入面试名单。亲戚朋友都打来祝贺电话，奖¥5000。",
                "success",
              );
            } else {
              st.flags._passedCivilService = false;
              st.needs.happiness = Math.max(0, st.needs.happiness - 18);
              StateManager.addMessage(
                "📉 笔试差了两分。你坐在考点门口的台阶上坐了半小时。",
                "warning",
              );
            }
          },
        },
        {
          text: "🍃 放弃，承认自己不适合",
          apply: function (st) {
            st.flags.c35_exam_decision = "gaveup";
            st.flags._passedCivilService = false;
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            st.player.fame = Math.max(0, (st.player.fame || 0) - 5);
            StateManager.addMessage(
              "🚪 你把所有教材打包卖了二手。心情反而轻松了一些。",
              "info",
            );
          },
        },
      ],
    },

    // ============================================================
    // CAREER 路径：再卷职场
    // ============================================================
    {
      id: "c35_career_overtime",
      phase: "street",
      icon: "💼",
      title: "加班通宵的KPI",
      story:
        "新公司给你压了一个 deadline：今晚必须出方案。\n你看着办公室空荡荡的椅子，喝了今天第四杯咖啡。",
      conditions: function (st) {
        return (
          st.flags &&
          st.flags._crisis35Path === "career" &&
          _dayOffset(st) >= 30 &&
          _dayOffset(st) <= 60 &&
          !st.flags.c35_career_overtime
        );
      },
      choices: [
        {
          text: "🔥 硬扛通宵",
          apply: function (st) {
            st.flags.c35_career_overtime = true;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 35);
            st.player.physique = Math.max(1, (st.player.physique || 0) - 2);
            st.resources.cash = (st.resources.cash || 0) + 2500;
            st.flags._careerKpiGood = (st.flags._careerKpiGood || 0) + 1;
            StateManager.addMessage(
              "☕ 你顶过去了。早上 6 点交了方案，老板回了个👍。月底拿到¥2500绩效。",
              "success",
            );
          },
        },
        {
          text: "🚶 摸鱼应付，明天再改",
          apply: function (st) {
            st.flags.c35_career_overtime = true;
            st.flags._careerKpiBad = (st.flags._careerKpiBad || 0) + 1;
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "😴 你早早回家睡了。第二天被老板叫到办公室单独谈话。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "c35_career_layoff_list",
      phase: "street",
      icon: "⚠️",
      title: "裁员名单",
      story:
        "HR 群里流传出一份名单。你的名字赫然在列。\n是直接走人，还是去找老板申诉？",
      conditions: function (st) {
        return (
          st.flags &&
          st.flags._crisis35Path === "career" &&
          _dayOffset(st) >= 60 &&
          _dayOffset(st) <= 100 &&
          !st.flags.c35_career_layoff_list
        );
      },
      choices: [
        {
          text: "🤝 找老板/同事帮忙",
          apply: function (st) {
            st.flags.c35_career_layoff_list = true;
            // 社交关系判定：NPC 关系 >=50 计 1 票，KPI 好 +1，KPI 坏 -1
            var support = 0;
            var rels = st.relationships || st.npcRelations || {};
            for (var k in rels) {
              if ((rels[k].affinity || 0) >= 50) support++;
            }
            support += st.flags._careerKpiGood || 0;
            support -= st.flags._careerKpiBad || 0;
            if (support >= 2) {
              st.flags._careerSurvivedLayoff = true;
              st.needs.happiness = Math.min(100, st.needs.happiness + 10);
              StateManager.addMessage(
                "🛡️ 你的人脉关键时刻发挥了作用。名单改了，你留下了。",
                "success",
              );
            } else {
              st.flags._careerSurvivedLayoff = false;
              st.resources.cash = (st.resources.cash || 0) + scaleAmount(8000, st.resources && st.resources.totalEarned);
              StateManager.addMessage(
                "💔 没人替你说话。HR 给了¥8000的 N+1 让你走人。",
                "warning",
              );
            }
          },
        },
        {
          text: "🚪 接受 N+1，主动离开",
          apply: function (st) {
            st.flags.c35_career_layoff_list = true;
            st.flags._careerSurvivedLayoff = false;
            st.resources.cash = (st.resources.cash || 0) + scaleAmount(12000, st.resources && st.resources.totalEarned);
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage(
              "📃 你签了 N+1.5 的协议，¥12000到账。回家路上忽然觉得轻松。",
              "info",
            );
          },
        },
      ],
    },

    // ============================================================
    // LIEFLAT 路径：摆烂
    // ============================================================
    {
      id: "c35_lieflat_family_call",
      phase: "street",
      icon: "📞",
      title: "家人的电话",
      story:
        "妈妈打来电话，说听亲戚说你最近「什么都不干」。她在那头沉默了好久。",
      conditions: function (st) {
        return (
          st.flags &&
          st.flags._crisis35Path === "lieflat" &&
          _dayOffset(st) >= 30 &&
          _dayOffset(st) <= 60 &&
          !st.flags.c35_lieflat_family_call
        );
      },
      choices: [
        {
          text: "🛡️ 坚持自己的选择",
          apply: function (st) {
            st.flags.c35_lieflat_family_call = true;
            st.flags.moral = st.flags.moral || {};
            st.flags.moral.score = Math.max(
              -100,
              (st.flags.moral.score || 0) - 2,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage(
              "🍵 你解释了半天。挂电话时你和家人的距离又远了一点。",
              "info",
            );
          },
        },
        {
          text: "🙏 哄她说自己在努力",
          apply: function (st) {
            st.flags.c35_lieflat_family_call = true;
            st.needs.happiness = Math.max(0, st.needs.happiness - 8);
            StateManager.addMessage(
              "😶 你撒了个善意的谎。挂了电话盯着天花板，没什么感觉。",
              "warning",
            );
          },
        },
        {
          text: "🚆 收拾东西，准备回老家",
          apply: function (st) {
            st.flags.c35_lieflat_family_call = true;
            st.flags._returnedHometown = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 12);
            StateManager.addMessage(
              "🏡 你订了周末的车票。也许小县城才是你该回去的地方。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "c35_lieflat_friend_circle",
      phase: "street",
      icon: "📱",
      title: "朋友圈的成功学",
      story:
        "翻朋友圈：前同事晒了升职CFO，老同学晒了三娃别墅。\n你盯着自己的二手手机，手指停在评论框上。",
      conditions: function (st) {
        return (
          st.flags &&
          st.flags._crisis35Path === "lieflat" &&
          _dayOffset(st) >= 60 &&
          _dayOffset(st) <= 100 &&
          !st.flags.c35_lieflat_friend_circle
        );
      },
      choices: [
        {
          text: "😤 嫉妒+发泄性消费",
          apply: function (st) {
            st.flags.c35_lieflat_friend_circle = "envy";
            // [全系统自洽修复] 域B A类#4: c35_lieflat envy cash无守卫
            var _spend = Math.min(st.resources.cash || 0, 300);
            st.resources.cash = (st.resources.cash || 0) - _spend;
            st.needs.happiness = Math.max(0, st.needs.happiness - 6);
            StateManager.addMessage(
              "🛒 你花¥" + spend + "买了一堆没用的东西。报复性消费没带来快乐。",
              "warning",
            );
          },
        },
        {
          text: "🍃 默默点赞，关掉手机",
          apply: function (st) {
            st.flags.c35_lieflat_friend_circle = "release";
            st.player.mental = Math.min(100, (st.player.mental || 0) + 4);
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            // 触发归园田居线索（life_ribbon 读取）
            st.flags._lieflatAtPeace = true;
            StateManager.addMessage(
              "🌿 你给所有人点了赞。窗外起风了，你拿起了一本书。",
              "success",
            );
          },
        },
      ],
    },

    // ============================================================
    // T3: 坏账后续 + 好心回报
    // ============================================================
    {
      id: "bad_debt_chase",
      phase: "street",
      icon: "💸",
      title: "亲戚消失了",
      story:
        "你给老同学/远房亲戚借出的那笔钱，到了约定日子没还。\n打电话——关机。微信——拉黑。",
      conditions: function (st) {
        var amt = (st.flags && st.flags._badDebtAmount) || 0;
        return (
          amt > 0 &&
          !st.flags.bad_debt_chase &&
          (st.flags._badDebtSeed === undefined ||
            (st.player.day || 0) - st.flags._badDebtSeed >= 14)
        );
      },
      choices: [
        {
          text: "⚖️ 请律师催债（¥500）",
            apply: function (st) {
            // [全系统自洽修复] 域B A类#4: bad_debt_chase cash无守卫
            var _cash = (st.resources && st.resources.cash) || 0;
            st.flags.bad_debt_chase = "lawyer";
            if (_cash < 500) {
              StateManager.addMessage("💸 你连律师费都掏不起。", "warning");
              return;
            }
            st.resources.cash = _cash - 500;
            var amt = st.flags._badDebtAmount || 0;
            if (Random.chance(0.3)) {
              var rec = Math.floor(amt * 0.5);
              st.resources.cash = (st.resources.cash || 0) + rec;
              StateManager.addMessage(
                "📑 律师函生效，对方还了¥" + rec + "（一半）。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "📃 律师函石沉大海。¥500白扔了。",
                "warning",
              );
            }
            st.flags._badDebtAmount = 0;
          },
        },
        {
          text: "🍵 自认倒霉",
          apply: function (st) {
            st.flags.bad_debt_chase = "letgo";
            st.flags.moral = st.flags.moral || {};
            st.flags.moral.score = Math.min(
              100,
              (st.flags.moral.score || 0) + 2,
            );
            st.flags._badDebtAmount = 0;
            StateManager.addMessage(
              "🧘 你删掉了那个号码。算是花钱买教训。",
              "info",
            );
          },
        },
        {
          text: "📢 朋友圈骂街",
          apply: function (st) {
            st.flags.bad_debt_chase = "shame";
            st.player.fame = Math.max(0, (st.player.fame || 0) - 10);
            st.flags.moral = st.flags.moral || {};
            st.flags.moral.score = Math.max(
              -100,
              (st.flags.moral.score || 0) - 3,
            );
            st.flags._badDebtAmount = 0;
            StateManager.addMessage(
              "📱 你发了长篇控诉。共同朋友圈炸了，但你的名声也跟着掉了。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "good_loan_return",
      phase: "street",
      icon: "💌",
      title: "听说你大气",
      story:
        "一年前你借出去的那笔钱，对方真还回来了。\n更没想到的是，他在朋友圈夸你「够意思」，几个熟人都看见了。",
      conditions: function (st) {
        var amt = (st.flags && st.flags._goodLoanReturn) || 0;
        return (
          amt > 0 &&
          !st.flags.good_loan_return &&
          (st.flags._goodLoanSeed === undefined ||
            (st.player.day || 0) - st.flags._goodLoanSeed >= 365)
        );
      },
      choices: [
        {
          text: "🤝 收下，谢谢对方",
          apply: function (st) {
            st.flags.good_loan_return = true;
            var amt = st.flags._goodLoanReturn || 0;
            st.resources.cash = (st.resources.cash || 0) + amt;
            // NPC 平均好感+5
            var rels = st.relationships || st.npcRelations || {};
            var bumped = 0;
            for (var k in rels) {
              if (rels[k].met || rels[k].affinity >= 0) {
                rels[k].affinity = Math.min(100, (rels[k].affinity || 0) + 5);
                bumped++;
              }
            }
            st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            // 30% 概率引荐高薪一次性工作
            if (Random.chance(0.3)) {
              var pay = Random.int(800, 2000);
              st.resources.cash = (st.resources.cash || 0) + pay;
              StateManager.addMessage(
                "🎁 对方还把你介绍给一个老板，临时项目结款¥" + pay + "。",
                "success",
              );
            }
            st.flags._goodLoanReturn = 0;
            StateManager.addMessage(
              "💰 ¥" +
                amt +
                "原数到账。" +
                (bumped > 0 ? "顺带 " + bumped + " 位熟人好感+5。" : "") +
                "名声+8。",
              "success",
            );
          },
        },
      ],
    },
  ];

  Array.prototype.push.apply(RANDOM_EVENTS, CRISIS35_FOLLOWUPS);
})();
// [R146] 域B 联动增强
// [R242] 域B 联动增强
// [R330] 域B
// [R498] 域B

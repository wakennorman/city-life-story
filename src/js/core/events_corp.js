/**
 * 职场随机事件数据（从 events.js 拆分）
 *
 * 自动推入 RANDOM_EVENTS 数组。
 * 必须在 events_core.js 之后加载。
 */

(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._corpLoaded) return;
  RANDOM_EVENTS._corpLoaded = true;
  var EVENTS = [
    {
      id: "insider_rumor_start",
      phase: "corporate",
      _isChainEvent: true,
      icon: "👂",
      title: "投资圈风声",
      story:
        "公司茶水间里，几个同事在低声讨论一家叫'智远科技'的创业公司，说他们拿到了一家大机构的战略投资，估值翻了五倍。有人暗示说这个消息还没公开，但内部人士已经在悄悄买入。",
      choices: [
        {
          text: "📱 找朋友打听",
          hint: "验证消息",
          apply: (st) => {
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
            if (st.resources.cash >= 100) {
              st.resources.cash -= 100;
              // 调度后续：验证结果
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(st, "insider_verify", 2, "corporate");
              }
              StateManager.addMessage(
                "📱 花¥100请一个在投行工作的朋友吃饭，他透露：智远科技确实在谈融资，但具体条款还没定。",
                "info",
              );
            } else {
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(st, "insider_verify", 3, "corporate");
              }
              StateManager.addMessage(
                "📱 朋友说智远科技确实在融资，但具体细节不清楚。",
                "info",
              );
            }
          },
        },
        {
          text: "📊 自己研究一下",
          hint: "看智力",
          apply: (st) => {
            const found = Random.chance(
              0.4 + (st.player.intelligence - 30) * 0.02,
            );
            if (found) {
              // 调度后续：验证成功
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(st, "insider_verify", 1, "corporate");
              }
              StateManager.addMessage(
                "📊 查了公开资料，发现智远科技确实刚宣布和某大厂合作，消息靠谱！",
                "success",
              );
            } else {
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(st, "insider_verify", 3, "corporate");
              }
              StateManager.addMessage(
                "📊 查了一圈没查到啥有用的，消息真假难辨。",
                "info",
              );
            }
          },
        },
        {
          text: "🚫 不听八卦，继续干活",
          hint: "专注本职",
          apply: (st) => {
            st.player.corporate.kpi = Math.min(
              150,
              st.player.corporate.kpi + 5,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 2);
            StateManager.addMessage(
              "🚫 你摇摇头继续干活。八卦听听就好，不耽误正事。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "insider_verify",
      phase: "corporate",
      _isChainEvent: true,
      icon: "🔍",
      title: "消息验证结果",
      story:
        "经过多方打听，你基本确认了：智远科技下周会宣布和'字节'级别的巨头达成战略合作，股价预计会大涨30%-50%。现在有个渠道可以让你通过场外期权间接参与，最低投入¥3000，一周后结算。但问题是——这是灰色地带，如果被发现，可能有法律风险。",
      choices: [
        {
          text: "💰 全仓参与 (¥3000)",
          hint: "高风险高回报",
          cost: 3000,
          apply: (st) => {
            if (st.resources.cash < 3000) {
              StateManager.addMessage("💰 钱不够！", "warning");
              return;
            }
            st.resources.cash -= 3000;
            const success = Random.chance(0.7);
            if (success) {
              const profit = Random.int(4000, 5999);
              st.resources.cash += profit;
              st.needs.happiness = Math.min(100, st.needs.happiness + 12);
              st.flags._insiderTradingWon = true;
              StateManager.addMessage(
                `💰 合作如期宣布，股价大涨！你赚了 ¥${profit - 3000}！`,
                "success",
              );
              // 调度后续：监管调查
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(
                  st,
                  "insider_aftermath_success",
                  8,
                  "corporate",
                );
              }
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 15);
              st.player.mental = Math.max(0, st.player.mental - 10);
              st.flags._insiderTradingLost = true;
              StateManager.addMessage(
                "💰 合作泡汤了！消息是假的，3000块全没了。",
                "danger",
              );
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(
                  st,
                  "insider_aftermath_fail",
                  5,
                  "corporate",
                );
              }
            }
          },
        },
        {
          text: "💵 小仓位试水 (¥1000)",
          hint: "留条后路",
          cost: 1000,
          apply: (st) => {
            if (st.resources.cash < 1000) {
              StateManager.addMessage("💵 钱不够！", "warning");
              return;
            }
            st.resources.cash -= 1000;
            const success = Random.chance(0.7);
            if (success) {
              const profit = Random.int(1300, 1899);
              st.resources.cash += profit;
              st.needs.happiness = Math.min(100, st.needs.happiness + 6);
              StateManager.addMessage(
                `💰 赌对了，小赚 ¥${profit - 1000}。`,
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 6);
              StateManager.addMessage(
                "💰 消息是假的，1000块打了水漂。",
                "warning",
              );
            }
          },
        },
        {
          text: "🚫 不参与，太危险",
          hint: "远离灰色地带",
          apply: (st) => {
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            st.player.mental = Math.min(100, st.player.mental + 5);
            st.flags._insiderTradingRefused = true;
            StateManager.addMessage(
              "🚫 你拒绝了。内幕交易是违法的，不值得冒这个险。",
              "success",
            );
            if (typeof calculateReputationBadges === "function") {
              st._reputationPendingRecompute = true;
            }
          },
        },
      ],
    },
    {
      id: "insider_aftermath_success",
      phase: "corporate",
      _isChainEvent: true,
      icon: "⚖️",
      title: "监管调查来了",
      story:
        "智远科技的合作消息公布后，股价确实大涨。但没过多久，证监会宣布对一起内幕交易案展开调查，涉及几家创业公司的融资信息泄露。你突然意识到——你参与的那个'渠道'可能正是被调查的对象。",
      choices: [
        {
          text: "😰 赶紧撤，销毁记录",
          hint: "逃避",
          apply: (st) => {
            st.needs.happiness = Math.max(0, st.needs.happiness - 10);
            st.player.mental = Math.max(0, st.player.mental - 8);
            // 80% 概率没事，20% 被盯上
            const safe = Random.chance(0.8);
            if (safe) {
              StateManager.addMessage(
                "😰 你赶紧撤了所有记录。目前来看没事，但心里一直悬着...",
                "warning",
              );
            } else {
              st.player.corporate.risk = Math.min(
                100,
                st.player.corporate.risk + 20,
              );
              StateManager.addMessage(
                "😰 还是被盯上了！调查组找你谈话，虽然没查出啥，但公司知道了...",
                "danger",
              );
            }
          },
        },
        {
          text: "🙋 主动说明情况",
          hint: "坦白从宽",
          apply: (st) => {
            st.player.mental = Math.min(100, st.player.mental + 5);
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            // 60% 没事，40% 被警告
            const ok = Random.chance(0.6);
            if (ok) {
              StateManager.addMessage(
                "🙋 你主动说明了情况，调查组说你只是小角色，不予追究。心里石头落地。",
                "success",
              );
            } else {
              st.player.corporate.risk = Math.min(
                100,
                st.player.corporate.risk + 15,
              );
              StateManager.addMessage(
                "🙋 虽然主动说明，但还是被警告了。公司知道了这件事...",
                "warning",
              );
            }
          },
        },
        {
          text: "😤 装不知道",
          hint: "赌运气",
          apply: (st) => {
            const safe = Random.chance(0.5);
            if (safe) {
              StateManager.addMessage(
                "😤 你装作不知道。目前来看平安无事。",
                "info",
              );
            } else {
              st.player.corporate.risk = Math.min(
                100,
                st.player.corporate.risk + 25,
              );
              st.needs.happiness = Math.max(0, st.needs.happiness - 15);
              StateManager.addMessage(
                "😤 被调查组点名了！虽然没被起诉，但心里一直悬着...",
                "danger",
              );
            }
          },
        },
      ],
    },
    {
      id: "insider_aftermath_fail",
      phase: "corporate",
      _isChainEvent: true,
      icon: "😰",
      title: "投资失败后的麻烦",
      story:
        "那笔投资血本无归。更糟糕的是，提供渠道的那个人消失了，你发现自己可能卷入了一场骗局。对方留下的联系方式全是假的。",
      choices: [
        {
          text: "🚔 报警",
          hint: "走法律途径",
          apply: (st) => {
            st.player.fame = Math.min(100, st.player.fame + 2);
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            const recovered = Random.chance(0.15);
            if (recovered) {
              const back = Random.int(300, 499);
              st.resources.cash += back;
              StateManager.addMessage(
                `🚔 警察立案了！居然追回了 ¥${back}，真是意外之喜。`,
                "success",
              );
            } else {
              StateManager.addMessage(
                "🚔 警察立案了，但嫌疑人已经失联，钱追不回来。",
                "info",
              );
            }
          },
        },
        {
          text: "💪 加倍努力工作补回来",
          hint: "勤劳致富",
          apply: (st) => {
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            st.player.corporate.kpi = Math.min(
              150,
              st.player.corporate.kpi + 10,
            );
            st.player.corporate.upwardMgmt = Math.min(
              100,
              st.player.corporate.upwardMgmt + 3,
            );
            st.player.corporate.risk = Math.min(
              100,
              st.player.corporate.risk + 5,
            );
            const extra = Random.int(50, 99);
            st.resources.cash += extra;
            st.resources.totalEarned += extra;
            StateManager.addMessage(
              `💪 加班加了一周，KPI+10，赚了 ¥${extra}。慢慢补回来。`,
              "info",
            );
          },
        },
        {
          text: "😞 自认倒霉，长个教训",
          hint: "接受现实",
          apply: (st) => {
            st.needs.happiness = Math.max(0, st.needs.happiness - 8);
            st.player.mental = Math.min(100, st.player.mental + 3);
            StateManager.addMessage(
              "😞 自认倒霉吧。吃一堑长一智，下次再也不碰这种事了。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "corp_overtime",
      phase: "corporate",
      icon: "🌙",
      title: "老板要求周末加班",
      story:
        "领导突然在群里说：项目紧急，周末全员加班！完成有奖励，但确实很累。",
      choices: [
        {
          text: "💪 咬牙加班",
          hint: "高风险高回报",
          apply: (st) => {
            st.player.corporate.ability = Math.min(
              100,
              st.player.corporate.ability + 3,
            );
            st.player.corporate.kpi = Math.min(
              150,
              st.player.corporate.kpi + 12,
            );
            st.player.corporate.upwardMgmt = Math.min(
              100,
              st.player.corporate.upwardMgmt + 5,
            );
            st.player.corporate.hair = Math.max(
              0,
              st.player.corporate.hair - 8,
            );
            st.player.corporate.risk = Math.min(
              100,
              st.player.corporate.risk + 3,
            );
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 20);
            StateManager.addMessage(
              "💪 周末连续加班！KPI+12，能力+3，发量-8，疲劳+20。",
              "event",
            );
          },
        },
        {
          text: "😴 装病请假",
          hint: "需要演技",
          apply: (st) => {
            if (Random.chance(0.5)) {
              st.player.corporate.upwardMgmt = Math.max(
                0,
                st.player.corporate.upwardMgmt - 8,
              );
              StateManager.addMessage(
                "😴 装病被识破！领导在群里阴阳怪气，向上管理-8。",
                "warning",
              );
            } else {
              st.needs.fatigue = Math.max(0, st.needs.fatigue - 15);
              st.needs.happiness = Math.min(100, st.needs.happiness + 8);
              StateManager.addMessage(
                "😴 成功装病！在家睡了一天，疲劳-15。",
                "success",
              );
            }
          },
        },
        {
          text: "💬 提议平摊工作量",
          hint: "考验管理能力",
          apply: (st) => {
            if (st.corporate.team.length > 0) {
              st.player.corporate.popularity = Math.min(
                100,
                st.player.corporate.popularity + 4,
              );
              st.player.corporate.kpi = Math.min(
                150,
                st.player.corporate.kpi + 6,
              );
              st.needs.fatigue = Math.min(100, st.needs.fatigue + 8);
              StateManager.addMessage(
                "💬 提议平摊工作！团队协作，效率还不错，KPI+6，疲劳+8。",
                "success",
              );
            } else {
              st.player.corporate.upwardMgmt = Math.max(
                0,
                st.player.corporate.upwardMgmt - 3,
              );
              StateManager.addMessage(
                "💬 一个人提议平摊？被领导婉拒，向上管理-3。",
                "warning",
              );
            }
          },
        },
      ],
    },
    {
      id: "corp_credit",
      phase: "corporate",
      icon: "🏆",
      title: "同事让你挂名项目",
      story:
        "一个关系不错的同事私下找你：他的项目快黄了，想把你的名字加进去当共同负责人，救他一命。",
      choices: [
        {
          text: "🤝 帮一把",
          hint: "维护关系",
          apply: (st) => {
            st.player.corporate.popularity = Math.min(
              100,
              st.player.corporate.popularity + 8,
            );
            st.player.corporate.kpi = Math.min(
              150,
              st.player.corporate.kpi + 5,
            );
            st.player.corporate.risk = Math.min(
              100,
              st.player.corporate.risk + 4,
            );
            StateManager.addMessage(
              "🤝 帮同事挂名！人缘+8，KPI+5，但万一项目出事你也有连带责任，风险+4。",
              "event",
            );
          },
        },
        {
          text: "🚫 婉言拒绝",
          hint: "自保",
          apply: (st) => {
            st.player.corporate.popularity = Math.max(
              0,
              st.player.corporate.popularity - 5,
            );
            StateManager.addMessage(
              "🚫 婉拒了同事。人缘-5，但保住了自己的羽毛。",
              "info",
            );
          },
        },
        {
          text: "💰 谈条件 (要分成)",
          hint: "考验向上管理",
          apply: (st) => {
            if (st.player.corporate.upwardMgmt >= 40) {
              st.resources.cash += 200;
              st.player.corporate.popularity = Math.max(
                0,
                st.player.corporate.popularity - 2,
              );
              st.player.corporate.upwardMgmt = Math.min(
                100,
                st.player.corporate.upwardMgmt + 3,
              );
              StateManager.addMessage(
                "💰 谈下条件拿到 ¥200 分成！向上管理+3，但同事有点不爽。",
                "success",
              );
            } else {
              st.player.corporate.popularity = Math.max(
                0,
                st.player.corporate.popularity - 8,
              );
              StateManager.addMessage(
                "💰 谈崩了。同事觉得你太势利，人缘-8。",
                "warning",
              );
            }
          },
        },
      ],
    },
    {
      id: "corp_complaint",
      phase: "corporate",
      icon: "😡",
      title: "客户无理投诉",
      story:
        "客户打电话过来骂了 20 分钟，其实根本不是你的错，但他指名要投诉到你头上。",
      choices: [
        {
          text: "🙏 忍气吞声道歉",
          hint: "保住 KPI",
          apply: (st) => {
            st.player.corporate.kpi = Math.max(0, st.player.corporate.kpi - 5);
            st.player.corporate.dignity = Math.max(
              0,
              st.player.corporate.dignity - 8,
            );
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "🙏 忍了。KPI-5，尊严-8，心里憋屈。",
              "warning",
            );
          },
        },
        {
          text: "📋 摆事实讲道理",
          hint: "考验智力",
          apply: (st) => {
            if (Random.chance(0.4 + (st.player.intelligence - 20) * 0.02)) {
              st.player.corporate.kpi = Math.min(
                150,
                st.player.corporate.kpi + 3,
              );
              st.player.corporate.dignity = Math.min(
                100,
                st.player.corporate.dignity + 5,
              );
              st.needs.happiness = Math.min(100, st.needs.happiness + 8);
              StateManager.addMessage(
                "📋 讲得清清楚楚！客户心服口服道歉了，尊严+5，KPI+3。",
                "success",
              );
            } else {
              st.player.corporate.kpi = Math.max(
                0,
                st.player.corporate.kpi - 8,
              );
              StateManager.addMessage(
                "📋 讲道理被骂得更惨，KPI-8，还得听领导训话。",
                "warning",
              );
            }
          },
        },
        {
          text: "😡 直接挂电话",
          hint: "爽但有后果",
          apply: (st) => {
            st.player.corporate.dignity = Math.min(
              100,
              st.player.corporate.dignity + 10,
            );
            st.player.corporate.kpi = Math.max(0, st.player.corporate.kpi - 10);
            st.player.corporate.risk = Math.min(
              100,
              st.player.corporate.risk + 5,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 12);
            StateManager.addMessage(
              "😡 直接挂了电话！爽是爽了，KPI-10，风险+5，尊严+10。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "corp_headhunter",
      phase: "corporate",
      icon: "📞",
      title: "猎头联系你",
      story: "一个猎头打电话来：另一家公司开出 50% 涨幅挖你，让你去面试。",
      choices: [
        {
          text: "💼 去面试看看",
          hint: "了解一下行情",
          apply: (st) => {
            if (Random.chance(0.5)) {
              const offer = Math.round(
                (st.resources.totalEarned /
                  Math.max(1, st.player.corpYear * 4)) *
                  1.5,
              );
              st.corporate.jobOffer = { salary: offer, company: "新公司" };
              st.needs.happiness = Math.min(100, st.needs.happiness + 10);
              st.player.corporate.upwardMgmt = Math.max(
                0,
                st.player.corporate.upwardMgmt - 5,
              );
              StateManager.addMessage(
                `📞 面试拿了 offer：年薪 ¥${offer.toLocaleString()}，诱惑很大！`,
                "event",
              );
              // 弹跳槽决策框
              setTimeout(() => showJobOfferModal(), 200);
            } else {
              st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
              st.player.corporate.upwardMgmt = Math.max(
                0,
                st.player.corporate.upwardMgmt - 3,
              );
              StateManager.addMessage(
                "📞 面试没成。领导听说你去面试了，脸色不太好看，向上管理-3。",
                "warning",
              );
            }
          },
        },
        {
          text: "📵 礼貌拒绝",
          hint: "保持忠诚",
          apply: (st) => {
            st.player.corporate.upwardMgmt = Math.min(
              100,
              st.player.corporate.upwardMgmt + 3,
            );
            StateManager.addMessage(
              "📵 拒了猎头。领导不知怎么知道了，对你更器重了，向上管理+3。",
              "success",
            );
          },
        },
        {
          text: "💬 把联系方式给同事",
          hint: "卖人情",
          apply: (st) => {
            st.player.corporate.popularity = Math.min(
              100,
              st.player.corporate.popularity + 8,
            );
            StateManager.addMessage(
              "💬 把猎头介绍给了同事，人缘+8。这小子请你吃了顿大餐！",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "corp_ppt",
      phase: "corporate",
      icon: "📊",
      title: "紧急汇报PPT",
      story:
        "VP明天要来部门听汇报，Leader让你今晚赶一份PPT出来。这东西做好了能加分，做砸了就尴尬了。",
      choices: [
        {
          text: "🌙 熬夜做好",
          hint: "能力+向上管理",
          apply: (st) => {
            st.player.corporate.ability = Math.min(
              100,
              st.player.corporate.ability + 4,
            );
            st.player.corporate.upwardMgmt = Math.min(
              100,
              st.player.corporate.upwardMgmt + 8,
            );
            st.player.corporate.hair = Math.max(
              0,
              st.player.corporate.hair - 6,
            );
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 18);
            StateManager.addMessage(
              "📊 连夜赶完PPT，领导表示很满意！向上管理+8，发量-6。",
              "success",
            );
          },
        },
        {
          text: "🤖 用AI生成",
          hint: "省力但有风险",
          apply: (st) => {
            if (Random.chance(0.55)) {
              st.player.corporate.ability = Math.min(
                100,
                st.player.corporate.ability + 2,
              );
              st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
              StateManager.addMessage(
                "🤖 AI生成的PPT还不错，加点修改就交差了。",
                "success",
              );
            } else {
              st.player.corporate.upwardMgmt = Math.max(
                0,
                st.player.corporate.upwardMgmt - 6,
              );
              st.player.corporate.risk = Math.min(
                100,
                st.player.corporate.risk + 5,
              );
              StateManager.addMessage(
                "🤖 AI生成的内容有明显错误，被VP当场指出。向上管理-6。",
                "warning",
              );
            }
          },
        },
        {
          text: "🙏 推给同事",
          hint: "耍小聪明",
          apply: (st) => {
            st.player.corporate.popularity = Math.max(
              0,
              st.player.corporate.popularity - 10,
            );
            st.player.corporate.upwardMgmt = Math.min(
              100,
              st.player.corporate.upwardMgmt - 3,
            );
            StateManager.addMessage(
              "🙏 推给同事了。大家都看在眼里，人缘-10。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "corp_leak",
      phase: "corporate",
      icon: "💧",
      title: "线上事故追责",
      story:
        "生产环境出了个P0故障，影响了几万用户。现在在排查责任人...结果发现是你三个月前提交的代码导致的。",
      choices: [
        {
          text: "🛠️ 主动认错并修复",
          hint: "诚实且专业",
          apply: (st) => {
            st.player.corporate.ability = Math.min(
              100,
              st.player.corporate.ability + 3,
            );
            st.player.corporate.dignity = Math.max(
              0,
              st.player.corporate.dignity - 5,
            );
            st.player.corporate.upwardMgmt = Math.max(
              0,
              st.player.corporate.upwardMgmt - 3,
            );
            st.player.corporate.risk = Math.max(
              0,
              st.player.corporate.risk - 10,
            );
            StateManager.addMessage(
              "🛠️ 坦白从宽！主动认错并给出了改进方案，风险-10。",
              "success",
            );
          },
        },
        {
          text: "🫥 假装不知道",
          hint: "看运气",
          apply: (st) => {
            if (Random.chance(0.4)) {
              st.player.corporate.upwardMgmt = Math.max(
                0,
                st.player.corporate.upwardMgmt - 15,
              );
              st.player.corporate.risk = Math.min(
                100,
                st.player.corporate.risk + 25,
              );
              st.player.corporate.dignity = Math.max(
                0,
                st.player.corporate.dignity - 10,
              );
              StateManager.addMessage(
                "🫥 被发现了！领导暴怒，向上管理-15，风险+25！",
                "danger",
              );
            } else {
              st.player.corporate.risk = Math.min(
                100,
                st.player.corporate.risk + 8,
              );
              StateManager.addMessage(
                "🫥 侥幸没被追到，但心里不安。风险+8。",
                "warning",
              );
            }
          },
        },
        {
          text: "🤝 找人分担责任",
          hint: "考验人缘",
          apply: (st) => {
            if (st.player.corporate.popularity >= 50) {
              st.player.corporate.risk = Math.max(
                0,
                st.player.corporate.risk - 5,
              );
              st.player.corporate.popularity = Math.max(
                0,
                st.player.corporate.popularity - 8,
              );
              StateManager.addMessage(
                "🤝 团队帮忙扛了一部分责任，风险仅-5，但人缘-8。",
                "info",
              );
            } else {
              st.player.corporate.risk = Math.min(
                100,
                st.player.corporate.risk + 12,
              );
              st.player.corporate.popularity = Math.max(
                0,
                st.player.corporate.popularity - 5,
              );
              StateManager.addMessage(
                "🤝 没人愿意帮你！人缘太低，自食其果。",
                "danger",
              );
            }
          },
        },
      ],
    },
    {
      id: "corp_year_end",
      phase: "corporate",
      icon: "🎉",
      title: "公司年会",
      story:
        "又到了公司年会。今年抽奖环节据说有大奖，但更重要的是和同事领导社交的机会。",
      choices: [
        {
          text: "🍻 主动社交敬酒",
          hint: "提升社交属性",
          apply: (st) => {
            st.player.corporate.upwardMgmt = Math.min(
              100,
              st.player.corporate.upwardMgmt + 8,
            );
            st.player.corporate.popularity = Math.min(
              100,
              st.player.corporate.popularity + 12,
            );
            st.player.corporate.hair = Math.max(
              0,
              st.player.corporate.hair - 2,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage(
              "🍻 和各路大佬喝了一圈！向上管理+8，人缘+12。",
              "success",
            );
          },
        },
        {
          text: "🎰 就等着抽奖",
          hint: "碰运气",
          apply: (st) => {
            const roll = Random.float(0, 1);
            if (roll < 0.05) {
              st.resources.cash += 10000;
              st.needs.happiness = Math.min(100, st.needs.happiness + 20);
              StateManager.addMessage(
                "🎰 中了大奖 ¥10,000！全场欢呼！",
                "success",
              );
            } else if (roll < 0.3) {
              st.resources.cash += 500;
              StateManager.addMessage("🎰 中了小奖 ¥500。聊胜于无。", "info");
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 3);
              StateManager.addMessage("🎰 啥也没中。", "info");
            }
          },
        },
        {
          text: "😴 请假不去",
          hint: "省事但减分",
          apply: (st) => {
            st.player.corporate.popularity = Math.max(
              0,
              st.player.corporate.popularity - 8,
            );
            st.player.corporate.upwardMgmt = Math.max(
              0,
              st.player.corporate.upwardMgmt - 3,
            );
            st.needs.fatigue = Math.max(0, st.needs.fatigue - 10);
            StateManager.addMessage(
              "😴 在家躺平一晚。疲劳-10，但同事都觉得你不合群。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "corp_mentor",
      phase: "corporate",
      icon: "🧑‍🏫",
      title: "新人请你当导师",
      story:
        "部门来了个实习生，Leader安排你当他 mentor。带新人费时间，但也是培养领导力的机会。",
      choices: [
        {
          text: "📖 认真带教",
          hint: "培养管理能力",
          apply: (st) => {
            st.player.corporate.ability = Math.min(
              100,
              st.player.corporate.ability + 2,
            );
            st.player.corporate.popularity = Math.min(
              100,
              st.player.corporate.popularity + 10,
            );
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 8);
            st.player.corporate.kpi = Math.min(
              150,
              st.player.corporate.kpi + 5,
            );
            StateManager.addMessage(
              "📖 带出来的实习生进步神速！人缘+10，能力+2。",
              "success",
            );
          },
        },
        {
          text: "📋 丢给他杂活",
          hint: "省心省力",
          apply: (st) => {
            st.player.corporate.kpi = Math.min(
              150,
              st.player.corporate.kpi + 3,
            );
            st.player.corporate.popularity = Math.max(
              0,
              st.player.corporate.popularity - 3,
            );
            StateManager.addMessage(
              "📋 杂活交给实习生，自己轻松了但实习生暗自不满。",
              "info",
            );
          },
        },
        {
          text: "🙅 拒绝带人",
          hint: "得罪领导",
          apply: (st) => {
            st.player.corporate.upwardMgmt = Math.max(
              0,
              st.player.corporate.upwardMgmt - 8,
            );
            StateManager.addMessage(
              "🙅 拒绝了领导安排，领导不太高兴。向上管理-8。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "crypto_fomo",
      phase: "corporate",
      icon: "🚀",
      title: "同事都在聊虚拟币",
      story:
        "茶水间里同事热火朝天：隔壁组的张三投了5万买狗狗币，上个月赚了20万！要不要也试试？",
      choices: [
        {
          text: "🚀 跟风买(¥5000)",
          hint: "FOMO了",
          cost: 5000,
          apply: function (st) {
            if (st.resources.cash >= 5000) {
              st.resources.cash -= 5000;
              if (Random.chance(0.3)) {
                st.resources.cash += Random.int(8000, 22999);
                st.needs.happiness = Math.min(100, st.needs.happiness + 20);
                StateManager.addMessage(
                  "🚀 运气爆棚追涨成功！大赚了一笔！",
                  "success",
                );
              } else if (Random.chance(0.5)) {
                st.resources.cash += Random.int(3000, 6999);
                StateManager.addMessage("🚀 小赚一点就跑了，还行。", "info");
              } else {
                st.needs.happiness = Math.max(0, st.needs.happiness - 25);
                StateManager.addMessage(
                  "🚀 追在山顶！亏惨了，¥5000打水漂大半。",
                  "danger",
                );
              }
            } else {
              StateManager.addMessage(
                "🚀 想梭哈但发现余额不够，尴尬。",
                "warning",
              );
            }
          },
        },
        {
          text: "📚 先学习区块链知识",
          hint: "理性",
          apply: function (st) {
            st.skills.coding.xp += 30;
            st.player.intelligence = Math.min(100, st.player.intelligence + 1);
            StateManager.addMessage(
              "📚 买了一本区块链入门书自学，编程EXP+30。",
              "success",
            );
          },
        },
        {
          text: "🚶 不碰这种赌博",
          hint: "稳健",
          apply: function (st) {
            st.player.mental = Math.min(100, st.player.mental + 2);
            StateManager.addMessage("🚶 理性克制，心智+2。", "info");
          },
        },
      ],
    },
    {
      id: "corp_stock_ipo",
      phase: "corporate",
      icon: "🔔",
      title: "公司发内部股",
      story:
        "HR发全员邮件：公司即将IPO！老员工可按内部价认购员工股，每人最多认购500股。",
      choices: [
        {
          text: "🔔 认购500股(¥4000)",
          hint: "员工福利",
          cost: 4000,
          apply: function (st) {
            if (st.resources.cash >= 4000) {
              st.resources.cash -= 4000;
              var inv = st.investment || {};
              inv.stockHoldings = inv.stockHoldings || [];
              inv.stockHoldings.push({
                symbol: "BYTE",
                shares: 500,
                avgPrice: 8,
              });
              st.needs.happiness = Math.min(100, st.needs.happiness + 10);
              StateManager.addMessage(
                "🔔 认购了500股内部员工股，发行价¥8！期待IPO...",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🔔 没¥4000认购，错过了暴富机会。",
                "warning",
              );
            }
          },
        },
        {
          text: "🔔 只认购100股(¥800)",
          hint: "试一试",
          cost: 800,
          apply: function (st) {
            if (st.resources.cash >= 800) {
              st.resources.cash -= 800;
              var inv = st.investment || {};
              inv.stockHoldings = inv.stockHoldings || [];
              inv.stockHoldings.push({
                symbol: "BYTE",
                shares: 100,
                avgPrice: 8,
              });
              StateManager.addMessage("🔔 谨慎认购100股。", "success");
            } else {
              StateManager.addMessage("🔔 100股也买不起。", "warning");
            }
          },
        },
        {
          text: "🚫 不参与",
          hint: "怕亏",
          apply: function (st) {
            StateManager.addMessage("🚫 不参与员工股。万一破发呢？", "info");
          },
        },
      ],
    },
    {
      id: "trade_war_news",
      phase: "corporate",
      icon: "⚔️",
      title: "贸易摩擦升级",
      story:
        "新闻：贸易摩擦升级，芯片出口管制加码。芯原半导体和华威电子暴跌，但国产替代概念可能要起飞。",
      choices: [
        {
          text: "📉 赶紧卖掉科技股",
          hint: "避险",
          apply: function (st) {
            var inv = st.investment || {};
            if (!inv.stockHoldings) return;
            var total = 0;
            for (var i = inv.stockHoldings.length - 1; i >= 0; i--) {
              var h = inv.stockHoldings[i];
              var def = INV_STOCKS.find(function (x) {
                return x.symbol === h.symbol;
              });
              if (
                def &&
                (def.industry === "科技" || def.industry === "新能源")
              ) {
                var m = inv.stockMarket[h.symbol];
                if (m) {
                  total += m.price * h.shares;
                }
                inv.stockHoldings.splice(i, 1);
              }
            }
            st.resources.cash += total;
            StateManager.addMessage(
              "📉 清仓科技股变现¥" + Math.round(total).toLocaleString() + "。",
              "warning",
            );
          },
        },
        {
          text: "💎 抄底国产替代",
          hint: "逆势布局",
          apply: function (st) {
            var inv = st.investment || {};
            var cost = Random.int(1000, 3999);
            if (st.resources.cash >= cost) {
              st.resources.cash -= cost;
              inv.stockHoldings = inv.stockHoldings || [];
              var smic = inv.stockHoldings.find(function (x) {
                return x.symbol === "SMIC";
              });
              if (smic) {
                smic.shares += 50;
                smic.avgPrice =
                  Math.round(
                    ((smic.avgPrice * smic.shares + cost) /
                      (smic.shares + 50)) *
                      100,
                  ) / 100;
              } else {
                inv.stockHoldings.push({
                  symbol: "SMIC",
                  shares: 50,
                  avgPrice: inv.stockMarket.SMIC
                    ? inv.stockMarket.SMIC.price
                    : 28,
                });
              }
              StateManager.addMessage(
                "💎 逆势抄底SMIC国产替代！赌国运。",
                "success",
              );
            } else {
              StateManager.addMessage("💎 想抄底但钱不够。", "warning");
            }
          },
        },
      ],
    },
    {
      id: "tesla_recall",
      phase: "corporate",
      icon: "⚡",
      title: "哥斯拉大规模召回",
      story:
        "突发：哥斯拉因刹车缺陷全球召回所有Model3/Y！股价瞬间跌15%。抄底还是逃命？",
      choices: [
        {
          text: "📉 逃命卖出哥斯拉",
          hint: "避雷",
          apply: function (st) {
            var inv = st.investment || {};
            if (!inv.stockHoldings) return;
            var total = 0;
            for (var i = inv.stockHoldings.length - 1; i >= 0; i--) {
              if (inv.stockHoldings[i].symbol === "TSLA") {
                var m = inv.stockMarket.TSLA;
                if (m) {
                  total += m.price * inv.stockHoldings[i].shares;
                }
                inv.stockHoldings.splice(i, 1);
              }
            }
            st.resources.cash += total;
            StateManager.addMessage(
              "📉 趁跌停前跑了，变现¥" +
                Math.round(total).toLocaleString() +
                "。",
              "warning",
            );
          },
        },
        {
          text: "💪 抄底买入！",
          hint: "信仰充值",
          apply: function (st) {
            var inv = st.investment || {};
            var cost = 2000;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              inv.stockHoldings = inv.stockHoldings || [];
              var h = inv.stockHoldings.find(function (x) {
                return x.symbol === "TSLA";
              });
              if (h) {
                h.shares += 10;
                h.avgPrice =
                  Math.round(
                    ((h.avgPrice * h.shares + 2000) / (h.shares + 10)) * 100,
                  ) / 100;
              } else {
                inv.stockHoldings.push({
                  symbol: "TSLA",
                  shares: 10,
                  avgPrice: inv.stockMarket.TSLA
                    ? inv.stockMarket.TSLA.price
                    : 250,
                });
              }
              StateManager.addMessage(
                "💪 别人恐惧我贪婪！抄底哥斯拉。",
                "success",
              );
            } else {
              StateManager.addMessage("💪 没钱抄底...", "warning");
            }
          },
        },
        {
          text: "🚶 不关我事",
          hint: "吃瓜",
          apply: function (st) {
            StateManager.addMessage("🚶 反正没买哥斯拉，安心吃瓜。", "info");
          },
        },
      ],
    },
    {
      id: "btc_halving_event",
      phase: "corporate",
      icon: "₿",
      title: "比特币减半倒计时",
      story:
        "全网都在讨论：距离下一次比特币减半只剩3天了！历史上每次减半后BTC都大涨。你的策略？",
      choices: [
        {
          text: "₿ 减半前买入",
          hint: "赌历史重演",
          apply: function (st) {
            var inv = st.investment || {};
            var cost = 3000;
            if (st.resources.cash >= cost) {
              st.resources.cash -= cost;
              inv.btcHoldings = (inv.btcHoldings || 0) + 0.003;
              inv.btcAvgCost =
                inv.btcHoldings > 0
                  ? Math.round(
                      (((inv.btcAvgCost || 0) * (inv.btcHoldings - 0.003) +
                        cost) /
                        inv.btcHoldings) *
                        100,
                    ) / 100
                  : 0;
              StateManager.addMessage(
                "₿ 减半前囤了0.003个BTC，期待减半行情！",
                "success",
              );
            } else {
              StateManager.addMessage("₿ 没钱投资比特币...", "warning");
            }
          },
        },
        {
          text: "📚 学习什么是减半",
          hint: "先搞懂",
          apply: function (st) {
            st.skills.coding.xp += 40;
            st.player.intelligence = Math.min(100, st.player.intelligence + 2);
            StateManager.addMessage(
              "📚 研究了比特币白皮书和减半机制，编程EXP+40。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "founder_oust",
      phase: "corporate",
      icon: "🪑",
      title: "投资人要换团队",
      story:
        "VC 召开闭门会议。新来的投资人代表语气客气但措辞冰冷：“业绩没达预期，我们要换打法——核心团队全部重组。” 你一愣——你是创始人之一啊。“我知道您的贡献，但下一个阶段需要更专业的运营。给您三个选择：留下来当核心员工、签离职协议拿遣散费、或者…我们也不强求。”",
      conditions: function (st) {
        var lvOk =
          st.player.phase === "corporate" &&
          st.corp &&
          st.corp.level &&
          st.corp.level >= 7;
        // 模拟"接受过 VC 投资"：玩家有公司股份或高 KPI 期间发生
        var vcCond =
          !!st.flags._acceptedVCFunding ||
          (st.corp &&
            (st.player.corporate.kpi || 0) > 70 &&
            st.player.day > 200);
        return lvOk && vcCond && !st.flags._founderOustSeen;
      },
      choices: [
        {
          text: "🪑 留下来当核心员工（屈辱但留有翻身机会）",
          hint: "30 天后看后续",
          apply: function (st) {
            st.flags._founderOustSeen = true;
            st.flags._founderStayed = st.player.day;
            if (st.player && st.player.corporate) {
              st.player.corporate.dignity = Math.max(
                0,
                (st.player.corporate.dignity || 50) - 25,
              );
              st.player.corporate.hair = Math.max(
                0,
                (st.player.corporate.hair || 80) - 15,
              );
              st.player.corporate.upwardMgmt = Math.max(
                0,
                (st.player.corporate.upwardMgmt || 50) - 10,
              );
            }
            StateManager.addMessage(
              "🪑 签了新合同，从联合创始人变成“产品总监”。尊严-25，发量-15，向上管理-10。但你想留着观察机会——也许还能东山再起。",
              "warning",
            );
          },
        },
        {
          text: "💼 拿遣散费走人（¥150,000）",
          hint: "干净离场，永久放弃公司",
          apply: function (st) {
            st.flags._founderOustSeen = true;
            st.flags._founderExited = true;
            st.resources.cash += 150000;
            st.resources.totalEarned += 150000;
            if (st.player && st.player.corporate) {
              st.player.corporate.dignity = Math.min(
                100,
                (st.player.corporate.dignity || 50) + 10,
              );
            }
            st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
            StateManager.addMessage(
              "💼 签字拿钱走人，到手¥150,000遣散费。尊严+10（你保住了体面），名气+6（业内都知道你是被资本清洗的创始人）。下一站去哪，再说。",
              "event",
            );
          },
        },
        {
          text: "💥 当场翻脸，公开抗议",
          hint: "尊严+30，但 KPI 暴跌",
          apply: function (st) {
            st.flags._founderOustSeen = true;
            st.flags._founderRebelled = true;
            if (st.player && st.player.corporate) {
              st.player.corporate.dignity = Math.min(
                100,
                (st.player.corporate.dignity || 50) + 30,
              );
              st.player.corporate.kpi = Math.max(
                0,
                (st.player.corporate.kpi || 50) - 30,
              );
              st.player.corporate.risk = Math.min(
                100,
                (st.player.corporate.risk || 0) + 25,
              );
              st.player.corporate.popularity = Math.min(
                100,
                (st.player.corporate.popularity || 50) + 10,
              );
            }
            st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
            StateManager.addMessage(
              "💥 当场拍桌子：“这公司是我们一砖一瓦盖起来的，凭什么由你们说了算？”——尊严+30，名气+10，人缘+10（同事敬你是条汉子）。代价：KPI-30，埋雷+25（你被打上了“麻烦制造者”标签）。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "founder_humiliation",
      phase: "corporate",
      icon: "📉",
      title: "新 CEO 让你写 PPT",
      story:
        "新 CEO 上任一个月，你这位“前创始人”被分配的工作是——给一群空降高管讲解你当年定的产品逻辑，然后做成 PPT 让他们“参考”。你看着会议室里那些一年前还没听说过这家公司的人，对你的产品指指点点，心里冷笑：他们连用户名字都念不准。但下班路上，你还是去打了点酒。",
      conditions: function (st) {
        return (
          !!st.flags._founderStayed &&
          st.player.day >= (st.flags._founderStayed || 0) + 30 &&
          !st.flags._founderHumiliationSeen
        );
      },
      choices: [
        {
          text: "🎭 假装配合，暗中观察",
          hint: "尊严-3，但保留 buyback 机会",
          apply: function (st) {
            st.flags._founderHumiliationSeen = true;
            st.flags._founderObserving = true;
            if (st.player && st.player.corporate) {
              st.player.corporate.dignity = Math.max(
                0,
                (st.player.corporate.dignity || 30) - 3,
              );
              st.player.corporate.upwardMgmt = Math.min(
                100,
                (st.player.corporate.upwardMgmt || 40) + 8,
              );
              st.player.corporate.ability = Math.min(
                100,
                (st.player.corporate.ability || 50) + 3,
              );
            }
            StateManager.addMessage(
              "🎭 戴上面具，每天笑着开会。尊严-3（你恨自己），但向上管理+8、能力+3——你确实学到了一些“如何在不属于自己的局里生存”的东西。",
              "info",
            );
          },
        },
        {
          text: "📚 业余时间学新东西，攒下家私积蓄",
          hint: "智力+8、能力+5，攒钱通道",
          apply: function (st) {
            st.flags._founderHumiliationSeen = true;
            st.flags._founderRebuilding = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 8,
            );
            if (st.player && st.player.corporate) {
              st.player.corporate.ability = Math.min(
                100,
                (st.player.corporate.ability || 50) + 5,
              );
            }
            if (st.skills && st.skills.management) {
              st.skills.management.exp = (st.skills.management.exp || 0) + 50;
            }
            StateManager.addMessage(
              "📚 上班划水，下班修炼。智力+8、能力+5，管理技能XP+50。你心里有了清晰的目标：等机会回来，把这地方再赢一次。",
              "event",
            );
          },
        },
        {
          text: "💢 受不了了，直接辞职",
          hint: "失去回购机会，但解脱",
          apply: function (st) {
            st.flags._founderHumiliationSeen = true;
            st.flags._founderQuitInRage = true;
            st.flags._founderStayed = null; // 关闭后续 buyback
            if (st.player && st.player.corporate) {
              st.player.corporate.dignity = Math.min(
                100,
                (st.player.corporate.dignity || 30) + 25,
              );
              st.player.corporate.hair = Math.min(
                100,
                (st.player.corporate.hair || 50) + 10,
              );
            }
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            StateManager.addMessage(
              "💢 在工位上摔了键盘走人。尊严+25、发量+10、心情+15——这一刻你觉得自己又活过来了。回购的可能性永远关闭了，但有些东西比公司重要。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "founder_buyback",
      phase: "corporate",
      icon: "♟️",
      title: "老朋友凑钱要帮你买回来",
      story:
        "深夜接到当年合伙人老陈的电话：“新 CEO 一年烧了 3 个亿，下个季度要不到融资就完蛋。投资人现在愿意 4 折出售他们手里的股份——总价 ¥800,000。我和老张能凑¥500,000，差¥300,000。如果你能掏出来，我们三个人就能拿回这家公司。” 你看着对面墙上自己当年挂的那张“再创业”的字，握着手机的手在抖。",
      conditions: function (st) {
        var hasObserved =
          !!st.flags._founderObserving || !!st.flags._founderRebuilding;
        var triggerDay = st.flags._founderStayed
          ? st.flags._founderStayed + 75
          : 99999;
        return (
          hasObserved &&
          st.player.day >= triggerDay &&
          st.resources.cash >= 100000 &&
          !st.flags._founderBuybackSeen
        );
      },
      choices: [
        {
          text: "♟️ 砸¥300,000买回来！",
          hint: "重新做 CEO，恢复属性",
          cost: 300000,
          apply: function (st) {
            st.flags._founderBuybackSeen = true;
            st.flags._founderReclaimed = true;
            st.resources.cash -= 300000;
            if (st.player && st.player.corporate) {
              st.player.corporate.dignity = Math.min(
                100,
                (st.player.corporate.dignity || 30) + 40,
              );
              st.player.corporate.hair = Math.min(
                100,
                (st.player.corporate.hair || 40) + 25,
              );
              st.player.corporate.ability = Math.min(
                100,
                (st.player.corporate.ability || 60) + 10,
              );
              st.player.corporate.kpi = Math.min(
                100,
                (st.player.corporate.kpi || 50) + 20,
              );
              st.player.corporate.upwardMgmt = Math.min(
                100,
                (st.player.corporate.upwardMgmt || 40) + 30,
              );
              st.player.corporate.popularity = Math.min(
                100,
                (st.player.corporate.popularity || 50) + 15,
              );
            }
            st.player.fame = Math.min(100, (st.player.fame || 0) + 20);
            st.player.mental = Math.min(100, st.player.mental + 20);
            StateManager.addMessage(
              "♟️ 砸下¥300,000——你回来了。尊严+40、发量+25、能力+10、KPI+20、向上管理+30、人缘+15、名气+20、心智+20。这次你知道：公司不是属于资本的，是属于愿意为它流血的人的。",
              "success",
            );
          },
        },
        {
          text: "🤝 谢绝老陈，安心当员工",
          hint: "心理松一口气",
          apply: function (st) {
            st.flags._founderBuybackSeen = true;
            st.flags._founderDeclinedBuyback = true;
            if (st.player && st.player.corporate) {
              st.player.corporate.dignity = Math.max(
                0,
                (st.player.corporate.dignity || 30) - 5,
              );
              st.player.corporate.kpi = Math.min(
                100,
                (st.player.corporate.kpi || 50) + 10,
              );
            }
            st.player.mental = Math.min(100, st.player.mental + 10);
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage(
              "🤝 跟老陈说：“我已经不是当年的我了。” 尊严-5（不是没有遗憾），KPI+10（你彻底接受了员工身份），心智+10、心情+10——放下，也是一种力量。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "fate_company_collapse",
      phase: "corporate",
      icon: "💀",
      title: "公司快不行了，你的选择是？",
      story:
        "公司上下弥漫着不安的气氛。茶水间的讨论从'Q3目标'变成了'要不要开始刷简历'。你收到了HR的约谈通知——公司现金流紧张，正在评估各部门的去留。你在这里干了这么久，现在走还是留？",
      conditions: function (st) {
        if (st.player.phase !== "corporate" || !st.corporate.company)
          return false;
        var cid = st.corporate.company.id;
        var co =
          st.enterpriseFate &&
          st.enterpriseFate.companies &&
          st.enterpriseFate.companies[cid];
        return co && co.phase === "dying" && !st.flags._fateCollapseSeen;
      },
      choices: [
        {
          text: "📄 接受N+1赔偿走人（¥50,000+）",
          hint: "拿钱走，安全退出",
          apply: function (st) {
            st.flags._fateCollapseSeen = true;
            st.flags._formerCompanyCollapsed = true;
            var severance = Random.int(50000, 69999);
            st.resources.cash += severance;
            st.resources.totalEarned += severance;
            st.player.mental = Math.max(0, st.player.mental - 5);
            StateManager.addMessage(
              "💀 你签了离职协议，拿了¥" +
                severance.toLocaleString() +
                "赔偿金。离开公司的那一刻，你回头看了一眼——那里曾经是你的全部。心智-5。",
              "warning",
            );
          },
        },
        {
          text: "💪 坚守岗位，跟公司共进退",
          hint: "如果公司挺过去，你的忠诚会得到回报",
          apply: function (st) {
            st.flags._fateCollapseSeen = true;
            st.player.mental = Math.min(100, st.player.mental + 5);
            StateManager.addMessage(
              "💪 你拒绝了HR的约谈，告诉总监你要留下。他愣了一下，拍了拍你的肩膀。心智+5。",
              "event",
            );
          },
        },
        {
          text: "🚪 请假面试其他公司",
          hint: "骑驴找马，留一手",
          apply: function (st) {
            st.flags._fateCollapseSeen = true;
            st.player.mental = Math.min(100, st.player.mental + 2);
            st.flags._fateJobHunting = true;
            StateManager.addMessage(
              "🚪 你请了三天假，偷偷去了字节龙面试。不管公司能不能活，你得为自己留条后路。心智+2。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "workplace_scapegoat",
      phase: "corporate",
      icon: "😡",
      title: "项目出问题了",
      story:
        "你负责的项目上线后出现了一个严重bug，导致客户投诉。老板在会议上点名批评了你，说这是你的疏忽。但你清楚——这个bug的根源是另一个团队提供的接口文档有问题，你当时还邮件提醒过他们。",
      choices: [
        {
          text: "📧 拿出邮件证据",
          hint: "据理力争",
          apply: (st) => {
            const success = Random.chance(
              0.3 +
                (st.player.corporate.upwardMgmt - 20) * 0.015 +
                (st.player.corporate.ability - 30) * 0.01,
            );
            if (success) {
              st.player.corporate.dignity = Math.min(
                100,
                st.player.corporate.dignity + 10,
              );
              st.player.corporate.upwardMgmt = Math.max(
                0,
                st.player.corporate.upwardMgmt - 5,
              );
              st.player.corporate.popularity = Math.min(
                100,
                st.player.corporate.popularity + 5,
              );
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(st, "workplace_boss_grudge", 3, "corporate");
              }
              StateManager.addMessage(
                "📧 你拿出邮件记录，老板无法反驳，只能说是'沟通问题'。但你知道，老板已经记恨上了。",
                "success",
              );
            } else {
              st.player.corporate.dignity = Math.max(
                0,
                st.player.corporate.dignity - 10,
              );
              st.player.corporate.kpi = Math.max(
                0,
                st.player.corporate.kpi - 15,
              );
              st.needs.happiness = Math.max(0, st.needs.happiness - 10);
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(st, "workplace_boss_grudge", 2, "corporate");
              }
              StateManager.addMessage(
                "📧 邮件证据被说成'事后补的'，老板更加不满了。KPI-15，尊严-10。",
                "danger",
              );
            }
          },
        },
        {
          text: "😔 默默接受批评",
          hint: "忍气吞声",
          apply: (st) => {
            st.player.corporate.dignity = Math.max(
              0,
              st.player.corporate.dignity - 15,
            );
            st.player.corporate.kpi = Math.max(0, st.player.corporate.kpi - 10);
            st.needs.happiness = Math.max(0, st.needs.happiness - 12);
            st.player.corporate.upwardMgmt = Math.min(
              100,
              st.player.corporate.upwardMgmt + 5,
            );
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "workplace_rumors", 3, "corporate");
            }
            StateManager.addMessage(
              "😔 你低头接受了批评。尊严-15，但老板觉得你'有担当'。",
              "warning",
            );
          },
        },
        {
          text: "💬 当场反驳",
          hint: "硬刚",
          apply: (st) => {
            const success = Random.chance(
              0.25 + (st.player.corporate.ability - 30) * 0.02,
            );
            if (success) {
              st.player.corporate.dignity = Math.min(
                100,
                st.player.corporate.dignity + 8,
              );
              st.player.corporate.popularity = Math.min(
                100,
                st.player.corporate.popularity + 6,
              );
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(st, "workplace_boss_grudge", 2, "corporate");
              }
              StateManager.addMessage(
                "💬 你当场指出问题所在，同事们都点头。但老板脸色很难看。",
                "success",
              );
            } else {
              st.player.corporate.dignity = Math.max(
                0,
                st.player.corporate.dignity - 12,
              );
              st.player.corporate.kpi = Math.max(
                0,
                st.player.corporate.kpi - 20,
              );
              st.player.corporate.risk = Math.min(
                100,
                st.player.corporate.risk + 15,
              );
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(st, "workplace_boss_grudge", 1, "corporate");
              }
              StateManager.addMessage(
                "💬 当场反驳被说成'不服管理'，老板非常不满。KPI-20，风险+15。",
                "danger",
              );
            }
          },
        },
      ],
    },
    {
      id: "workplace_boss_grudge",
      phase: "corporate",
      icon: "😈",
      title: "老板开始穿小鞋",
      story:
        "自从那次会议之后，老板对你的态度明显变了。原本属于你的核心项目被转给了别人，现在让你负责一个边缘的'优化'任务——做好了没功劳，做坏了全是你的问题。同时，你发现你的绩效考核标准也被调高了。",
      choices: [
        {
          text: "💪 把边缘项目做出彩",
          hint: "用实力说话",
          apply: (st) => {
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            const success = Random.chance(
              0.3 +
                (st.player.corporate.ability - 30) * 0.02 +
                (st.player.intelligence - 30) * 0.01,
            );
            if (success) {
              st.player.corporate.ability = Math.min(
                100,
                st.player.corporate.ability + 5,
              );
              st.player.corporate.kpi = Math.min(
                150,
                st.player.corporate.kpi + 15,
              );
              st.player.corporate.dignity = Math.min(
                100,
                st.player.corporate.dignity + 8,
              );
              st.player.corporate.upwardMgmt = Math.min(
                100,
                st.player.corporate.upwardMgmt + 3,
              );
              StateManager.addMessage(
                "💪 你把边缘项目做出了亮点，老板不得不公开表扬。能力+5，KPI+15。",
                "success",
              );
            } else {
              st.player.corporate.kpi = Math.max(
                0,
                st.player.corporate.kpi - 5,
              );
              st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
              StateManager.addMessage(
                "💪 虽然很努力，但项目本身没什么价值，老板还是不满意。",
                "warning",
              );
            }
          },
        },
        {
          text: "📱 找HR聊聊",
          hint: "寻求保护",
          apply: (st) => {
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
            const success = Random.chance(
              0.4 + (st.player.corporate.popularity - 30) * 0.01,
            );
            if (success) {
              st.player.corporate.dignity = Math.min(
                100,
                st.player.corporate.dignity + 5,
              );
              StateManager.addMessage(
                "📱 HR约谈了老板，说要注意管理方式。老板暂时收敛了一些。",
                "success",
              );
            } else {
              st.player.corporate.dignity = Math.max(
                0,
                st.player.corporate.dignity - 5,
              );
              st.player.corporate.risk = Math.min(
                100,
                st.player.corporate.risk + 10,
              );
              StateManager.addMessage(
                "📱 HR和稀泥，说'都是为公司好'。老板知道后更不爽了。",
                "warning",
              );
            }
          },
        },
        {
          text: "🚪 准备跳槽",
          hint: "另谋出路",
          apply: (st) => {
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 8);
            st.player.corporate.dignity = Math.min(
              100,
              st.player.corporate.dignity + 3,
            );
            if (st.resources.cash >= 200) {
              st.resources.cash -= 200;
            }
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "workplace_headhunter", 5, "corporate");
            }
            StateManager.addMessage(
              "🚪 你开始更新简历，悄悄面试。花¥200做了个职业咨询。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "workplace_rumors",
      phase: "corporate",
      icon: "🗣️",
      title: "办公室谣言四起",
      story:
        "自从你默默接受了那次批评后，办公室里的流言蜚语越来越多。有人说你能力不行，有人说你在老板面前表现懦弱。几个平时关系不错的同事也开始疏远你。",
      choices: [
        {
          text: "🗣️ 公开澄清",
          hint: "正面应对",
          apply: (st) => {
            const success = Random.chance(
              0.35 + (st.player.corporate.popularity - 20) * 0.015,
            );
            if (success) {
              st.player.corporate.popularity = Math.min(
                100,
                st.player.corporate.popularity + 8,
              );
              st.player.corporate.dignity = Math.min(
                100,
                st.player.corporate.dignity + 5,
              );
              StateManager.addMessage(
                "🗣️ 你在群里澄清了事实，大家开始理解你的处境。人缘+8。",
                "success",
              );
            } else {
              st.player.corporate.popularity = Math.max(
                0,
                st.player.corporate.popularity - 5,
              );
              StateManager.addMessage(
                "🗣️ 澄清被说成'狡辩'，情况更糟了。",
                "warning",
              );
            }
          },
        },
        {
          text: "💪 用业绩证明自己",
          hint: "实力碾压",
          apply: (st) => {
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 12);
            st.player.corporate.kpi = Math.min(
              150,
              st.player.corporate.kpi + 10,
            );
            st.player.corporate.ability = Math.min(
              100,
              st.player.corporate.ability + 3,
            );
            st.player.corporate.popularity = Math.min(
              100,
              st.player.corporate.popularity + 4,
            );
            StateManager.addMessage(
              "💪 你用一个漂亮的交付让大家闭嘴。KPI+10，人缘+4。",
              "success",
            );
          },
        },
        {
          text: "😔 保持沉默",
          hint: "忍",
          apply: (st) => {
            st.player.corporate.dignity = Math.max(
              0,
              st.player.corporate.dignity - 8,
            );
            st.needs.happiness = Math.max(0, st.needs.happiness - 10);
            st.player.corporate.popularity = Math.max(
              0,
              st.player.corporate.popularity - 5,
            );
            StateManager.addMessage(
              "😔 你选择沉默。尊严-8，心情-10，人缘-5。",
              "danger",
            );
          },
        },
      ],
    },
    {
      id: "workplace_headhunter",
      phase: "corporate",
      icon: "💼",
      title: "猎头主动联系",
      story:
        "一家创业公司通过猎头联系你，开出了比你现在高40%的薪资，职位是'高级技术负责人'。他们欣赏你的技术能力，但公司规模小、风险大。与此同时，你现在的公司刚好有一个晋升机会——但需要你先'证明自己的忠诚度'。",
      choices: [
        {
          text: "🚀 接受猎头offer跳槽",
          hint: "高薪但高风险",
          apply: (st) => {
            st.player.corporate.rank = "P6";
            st.player.corporate.kpi = 30;
            st.player.corporate.upwardMgmt = 10;
            st.player.corporate.popularity = 20;
            st.player.corporate.dignity = Math.min(
              100,
              st.player.corporate.dignity + 10,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            st.needs.fatigue = Math.max(0, st.needs.fatigue - 10);
            st.player.corporate.risk = 15;
            StateManager.addMessage(
              "🚀 你跳槽了！新公司薪资高40%，职位也提升了。但一切从零开始，风险也不小。",
              "success",
            );
            if (st.corporate) {
              st.corporate.team = [];
              st.corporate.jobOffer = null;
            }
          },
        },
        {
          text: "💼 接受晋升，留下",
          hint: "稳定但委屈",
          apply: (st) => {
            st.player.corporate.rank = "P6";
            st.player.corporate.kpi = 50;
            st.player.corporate.upwardMgmt = Math.min(
              100,
              st.player.corporate.upwardMgmt + 15,
            );
            st.player.corporate.dignity = Math.max(
              0,
              st.player.corporate.dignity - 5,
            );
            st.player.corporate.risk = Math.min(
              100,
              st.player.corporate.risk + 5,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            StateManager.addMessage(
              "💼 你接受了晋升。职位上去了，但你知道这是用尊严换来的。",
              "warning",
            );
          },
        },
        {
          text: "🤔 两边都再考虑下",
          hint: "拖延决策",
          apply: (st) => {
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            st.player.mental = Math.max(0, st.player.mental - 3);
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "workplace_deadline", 3, "corporate");
            }
            StateManager.addMessage(
              "🤔 你决定再想想。两边都在等你的答复...",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "workplace_deadline",
      phase: "corporate",
      icon: "⏰",
      title: "最后通牒",
      story:
        "猎头说offer只能保留3天，现在的老板也暗示如果你不表态就当作放弃晋升。你必须在有限时间内做出决定。",
      choices: [
        {
          text: "🚀 接受猎头offer",
          hint: "搏一把",
          apply: (st) => {
            st.player.corporate.rank = "P6";
            st.player.corporate.kpi = 30;
            st.player.corporate.upwardMgmt = 10;
            st.player.corporate.popularity = 20;
            st.player.corporate.dignity = Math.min(
              100,
              st.player.corporate.dignity + 10,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            st.player.corporate.risk = 15;
            if (st.corporate) {
              st.corporate.team = [];
            }
            StateManager.addMessage(
              "🚀 你接受了猎头offer！高薪新起点，但一切从零开始。",
              "success",
            );
          },
        },
        {
          text: "💼 留下接受晋升",
          hint: "求稳",
          apply: (st) => {
            st.player.corporate.rank = "P6";
            st.player.corporate.kpi = 50;
            st.player.corporate.upwardMgmt = Math.min(
              100,
              st.player.corporate.upwardMgmt + 15,
            );
            st.player.corporate.dignity = Math.max(
              0,
              st.player.corporate.dignity - 5,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 2);
            StateManager.addMessage(
              "💼 你选择留下。晋升了，但你知道这只是开始。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "insider_report",
      phase: "corporate",
      icon: "📋",
      title: "你不该看到的那份报告",
      story:
        "周五晚上你在公司加班，路过CFO办公室时门没关严，桌上一份Q3财报初稿摊开着——净利润同比增长320%，远超预期。报告正式发布在三天后。你站在门口，四周空无一人。",
      conditions: function (st) {
        return (
          st.player.phase === "corporate" &&
          st.corp &&
          st.corp.level >= 6 &&
          !st.flags._insiderReportSeen
        );
      },
      choices: [
        {
          text: "📈 悄悄买入公司股票",
          hint: "利用内幕信息",
          apply: function (st) {
            st.flags._insiderReportSeen = true;
            st.flags._insiderTraded = st.player.day;
            st.player.mental = Math.max(0, (st.player.mental || 50) - 5);
            StateManager.addMessage(
              "📈 你下单买了¥500,000自己公司的股票。手在抖——你知道这是违法的。",
              "warning",
            );
            scheduleChainEvent(st, "insider_cashout", 3, "corporate");
          },
        },
        {
          text: "🧘 关上门当没看见",
          hint: "遵守规则",
          apply: function (st) {
            st.flags._insiderReportSeen = true;
            st.flags._insiderResisted = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            StateManager.addMessage(
              "🧘 你轻轻带上CFO的门。有些门进去了就出不来。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "insider_cashout",
      phase: "corporate",
      icon: "💰",
      title: "财报发布股价涨停",
      story:
        "三天后财报发布，股价涨停，你的¥500,000变成了¥660,000。现在卖出太明显——大数据监控系统会看到你的交易时间点。",
      conditions: function (st) {
        return !!st.flags._insiderTraded && !st.flags._insiderCashoutSeen;
      },
      choices: [
        {
          text: "💸 立刻卖出锁定利润",
          hint: "赚¥160,000风险高",
          apply: function (st) {
            st.flags._insiderCashoutSeen = true;
            st.flags._insiderQuickSell = true;
            var profit = Random.int(150000, 169999);
            st.resources.cash += profit;
            st.flags._insiderProfit = profit;
            StateManager.addMessage(
              "💸 你卖出了！净赚¥" +
                profit.toLocaleString() +
                "。但时间点太完美了……",
              "event",
            );
            scheduleChainEvent(st, "insider_investigation", 30, "corporate");
          },
        },
        {
          text: "⏳ 等两周慢慢出货",
          hint: "隐蔽但可能回落",
          apply: function (st) {
            st.flags._insiderCashoutSeen = true;
            st.flags._insiderSlowSell = true;
            var profit = Random.int(80000, 119999);
            st.resources.cash += profit;
            st.flags._insiderProfit = profit;
            StateManager.addMessage(
              "⏳ 分批卖出赚了¥" + profit.toLocaleString() + "。应该不扎眼……",
              "event",
            );
            scheduleChainEvent(st, "insider_investigation", 45, "corporate");
          },
        },
      ],
    },
    {
      id: "insider_investigation",
      phase: "corporate",
      icon: "🔍",
      title: "证监会约谈",
      story:
        "HR通知你「有人找」。两个穿正装的人坐在会议室，桌上放着录音笔。「我们是证监会稽查局的，有几个交易记录需要跟你核实。」你的心沉了下去。",
      conditions: function (st) {
        return (
          (!!st.flags._insiderQuickSell || !!st.flags._insiderSlowSell) &&
          !st.flags._insiderInvestigationSeen
        );
      },
      choices: [
        {
          text: "😰 坦白从宽认罚",
          hint: "罚款+禁入市场",
          apply: function (st) {
            st.flags._insiderInvestigationSeen = true;
            st.flags._insiderConfessed = true;
            var fine = Math.round((st.flags._insiderProfit || 160000) * 0.6);
            st.resources.cash = Math.max(0, st.resources.cash - fine);
            st.flags._insiderRecord = true;
            st.player.fame = Math.max(0, (st.player.fame || 0) - 15);
            StateManager.addMessage(
              "😰 罚款¥" +
                fine.toLocaleString() +
                "，禁入证券180天，两年内不得晋升。",
              "danger",
            );
          },
        },
        {
          text: "🤥 否认坚持正常交易",
          hint: "赌博",
          apply: function (st) {
            st.flags._insiderInvestigationSeen = true;
            st.flags._insiderDenied = true;
            if (Random.chance(0.35)) {
              st.player.mental = Math.max(0, (st.player.mental || 50) - 8);
              StateManager.addMessage(
                "🤥 三个月后证据不足结案。你保住了钱但活在阴影里。",
                "event",
              );
            } else {
              st.flags._insiderCaught = true;
              var fine2 = Math.round((st.flags._insiderProfit || 160000) * 1.2);
              st.resources.cash = Math.max(0, st.resources.cash - fine2);
              StateManager.addMessage(
                "🤥 证据确凿，处罚加重！罚款¥" +
                  fine2.toLocaleString() +
                  "，行业通报。",
                "danger",
              );
            }
          },
        },
      ],
    },
    {
      id: "career_setup",
      phase: "corporate",
      icon: "🪤",
      title: "这份报告你签个字",
      story:
        "总监张总把一份项目验收报告放在你桌上：「走个流程，签个字就行。」——但毛利率算出来比实际高了15%。你之前听到过张总跟供应商不清不楚的往来。",
      conditions: function (st) {
        return (
          st.player.phase === "corporate" &&
          st.corp &&
          st.corp.level >= 5 &&
          !st.flags._careerSetupSeen
        );
      },
      choices: [
        {
          text: "✍️ 签字，领导让签就签",
          hint: "保平安还是埋雷",
          apply: function (st) {
            st.flags._careerSetupSeen = true;
            st.flags._careerSigned = st.player.day;
            st.player.corporate.upwardMgmt = Math.min(
              100,
              (st.player.corporate.upwardMgmt || 50) + 5,
            );
            st.player.corporate.risk = Math.min(
              100,
              (st.player.corporate.risk || 0) + 20,
            );
            StateManager.addMessage("✍️ 你签字了。纸包不住火。", "warning");
            scheduleChainEvent(st, "career_investigation", 25, "corporate");
          },
        },
        {
          text: "🚫 委婉拒绝说需要核实",
          hint: "不硬顶也不背锅",
          apply: function (st) {
            st.flags._careerSetupSeen = true;
            st.flags._careerRefused = true;
            st.player.corporate.upwardMgmt = Math.max(
              0,
              (st.player.corporate.upwardMgmt || 50) - 10,
            );
            StateManager.addMessage(
              "🚫 你说再跟财务对一下。他笑容淡了一瞬。",
              "info",
            );
            scheduleChainEvent(st, "career_retaliation", 15, "corporate");
          },
        },
        {
          text: "📱 悄悄保存一份证据",
          hint: "保护自己",
          apply: function (st) {
            st.flags._careerSetupSeen = true;
            st.flags._careerEvidence = true;
            st.flags._careerRefused = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            StateManager.addMessage(
              "📱 你拍照存档。信任是奢侈品证据是硬通货。",
              "event",
            );
            scheduleChainEvent(st, "career_retaliation", 15, "corporate");
          },
        },
      ],
    },
    {
      id: "career_investigation",
      phase: "corporate",
      icon: "🔎",
      title: "审计来了",
      story:
        "集团审计部突袭。你签过字的报告被抽中了。「这份报告是你签的？数据异常请你解释。」",
      conditions: function (st) {
        return !!st.flags._careerSigned && !st.flags._careerInvestigationSeen;
      },
      choices: [
        {
          text: "😰 坦白是张总让签的",
          hint: "供出上级",
          apply: function (st) {
            st.flags._careerInvestigationSeen = true;
            st.flags._careerNailed = true;
            st.player.corporate.upwardMgmt = Math.max(
              0,
              (st.player.corporate.upwardMgmt || 50) - 20,
            );
            st.player.corporate.popularity = Math.min(
              100,
              (st.player.corporate.popularity || 50) + 10,
            );
            StateManager.addMessage(
              "😰 张总被调离。你成了「那个举报了张总的人」。",
              "event",
            );
            scheduleChainEvent(st, "career_aftermath", 60, "corporate");
          },
        },
        {
          text: "😶 扛下来说是自己疏忽",
          hint: "替张总扛",
          apply: function (st) {
            st.flags._careerInvestigationSeen = true;
            st.flags._careerTookBlame = true;
            st.player.corporate.kpi = Math.max(
              0,
              (st.player.corporate.kpi || 50) - 15,
            );
            StateManager.addMessage(
              "😶 口头警告。张总说「记着你的好」——可这最不值钱。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "career_retaliation",
      phase: "corporate",
      icon: "😤",
      title: "张总给你穿小鞋",
      story: "拒签后KPI调高30%，最难客户分给你，凌晨两点还在改年会PPT第9版。",
      conditions: function (st) {
        return (
          !!st.flags._careerRefused &&
          !st.flags._careerRetaliationSeen &&
          !st.flags._careerSigned
        );
      },
      choices: [
        {
          text: "📋 隐忍收集证据",
          hint: "等待时机",
          apply: function (st) {
            st.flags._careerRetaliationSeen = true;
            st.flags._careerEvidence = true;
            StateManager.addMessage(
              "📋 你把每一次不合理要求都截图存档。",
              "event",
            );
            scheduleChainEvent(st, "career_evidence_payoff", 40, "corporate");
          },
        },
        {
          text: "💼 偷偷面试其他公司",
          hint: "准备后路",
          apply: function (st) {
            st.flags._careerRetaliationSeen = true;
            st.flags._careerJobHunting = true;
            StateManager.addMessage("💼 你更新简历偷偷面试。", "info");
            scheduleChainEvent(st, "career_aftermath", 60, "corporate");
          },
        },
        {
          text: "💥 找HR正面刚",
          hint: "鱼死网破",
          apply: function (st) {
            st.flags._careerRetaliationSeen = true;
            st.flags._careerHRComplaint = true;
            st.player.corporate.popularity = Math.min(
              100,
              (st.player.corporate.popularity || 50) + 8,
            );
            st.player.corporate.risk = Math.min(
              200,
              (st.player.corporate.risk || 0) + 30,
            );
            StateManager.addMessage(
              "💥 HR介入张总被约谈。你成了「定时炸弹」。",
              "event",
            );
            scheduleChainEvent(st, "career_aftermath", 60, "corporate");
          },
        },
      ],
    },
    {
      id: "career_evidence_payoff",
      phase: "corporate",
      icon: "♟️",
      title: "证据派上用场",
      story:
        "三个月后管理层合规审查，你的证据全部递交。张总被降级，你接手了他一部分工作。",
      conditions: function (st) {
        return (
          !!st.flags._careerEvidence &&
          !st.flags._careerEvidencePayoffSeen &&
          !st.flags._careerSigned
        );
      },
      choices: [
        {
          text: "🎯 接受新职责证明自己",
          hint: "升职机会",
          apply: function (st) {
            st.flags._careerEvidencePayoffSeen = true;
            st.corp.level = Math.min(10, (st.corp.level || 5) + 1);
            st.player.corporate.kpi = Math.min(
              100,
              (st.player.corporate.kpi || 50) + 10,
            );
            StateManager.addMessage(
              "🎯 你接手了张总的职责。证据比情绪有用。",
              "event",
            );
          },
        },
        {
          text: "😌 保持低调继续做好本职",
          hint: "不招摇",
          apply: function (st) {
            st.flags._careerEvidencePayoffSeen = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            StateManager.addMessage("😌 你没趁这个机会往上爬。", "success");
          },
        },
      ],
    },
    {
      id: "career_aftermath",
      phase: "corporate",
      icon: "👔",
      title: "前上司东山再起",
      story:
        "一年后行业峰会上张总跳槽成了VP。名片递过来你们四目相对——这个世界小到不知道得罪过的人明天坐在哪个位置上。",
      conditions: function (st) {
        return (
          (!!st.flags._careerNailed || !!st.flags._careerHRComplaint) &&
          !st.flags._careerAftermathSeen &&
          st.player.day >= 60
        );
      },
      choices: [
        {
          text: "🤝 主动握手冰释前嫌",
          hint: "多朋友少敌人",
          apply: function (st) {
            st.flags._careerAftermathSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            StateManager.addMessage(
              "🤝 你伸出手：「张总好久不见。」过去的恩怨谁都没提。",
              "event",
            );
          },
        },
        {
          text: "😤 视而不见擦肩而过",
          hint: "不原谅",
          apply: function (st) {
            st.flags._careerAftermathSeen = true;
            st.player.mental = Math.max(0, (st.player.mental || 50) - 3);
            StateManager.addMessage(
              "😤 你假装没看见。有些人不需要和解。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "siege_reversal",
      phase: "corporate",
      icon: "🏰",
      title: "围城反转",
      story:
        "你终于拿到了辰光网络的offer——P8，年薪¥80万。入职第一天，你发现旁边工位的同事在收拾东西：「公司第三季度要裁20%，你不知道？」HR的微笑很专业：「组织架构优化，正常调整。」",
      conditions: function (st) {
        return (
          st.player.phase === "corporate" &&
          st.player.day >= 80 &&
          !st.flags._siegeReversalSeen
        );
      },
      choices: [
        {
          text: "🔍 低调观察",
          hint: "智力+3，收集信息",
          apply: function (st) {
            st.flags._siegeReversalSeen = true;
            st.flags._siegeObserved = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 3,
            );
            StateManager.addMessage(
              "你搞清了格局——核心业务线稳，边缘部门人人自危。",
              "event",
            );
          },
        },
        {
          text: "📢 找领导表忠心",
          hint: "降低被裁概率，但开始卷",
          apply: function (st) {
            st.flags._siegeReversalSeen = true;
            st.flags._siegeKpiMode = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            StateManager.addMessage(
              "主动接了大项目。领导满意——但你每天加班到11点。",
              "info",
            );
          },
        },
        {
          text: "👨‍💻 更新简历面试",
          hint: "骑驴找马",
          apply: function (st) {
            st.flags._siegeReversalSeen = true;
            st.flags._siegeJobHunting = true;
            StateManager.addMessage(
              "偷偷更新了简历。外面机会不少但待遇都比这里差。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "short_self",
      phase: "corporate",
      icon: "📉",
      title: "做空自己公司",
      story:
        "作为辰光网络的P8员工，你看到了Q3内部数据——新增用户连续下滑，最大客户没续签，CFO悄悄减持。你知道股价三个月内必跌。一个念头冒出来：做空自己公司。",
      conditions: function (st) {
        return (
          st.player.phase === "corporate" &&
          st.player.day >= 100 &&
          !st.flags._shortSelfSeen
        );
      },
      choices: [
        {
          text: "💰 做空公司股票",
          hint: "¥50000保证金，合法但职业风险",
          apply: function (st) {
            st.flags._shortSelfSeen = true;
            if (st.resources.cash >= 50000) {
              st.resources.cash -= 50000;
              st.flags._shortedOwnCompany = true;
              st.flags._shortDay = st.player.day;
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(st, "short_self_settle", 30, "corporate");
              }
              StateManager.addMessage(
                "建立了做空仓位。上班看同事认真工作的样子——你有点分裂。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "做空需要¥50000保证金。你连做空自己都不够格。",
                "info",
              );
            }
          },
        },
        {
          text: "⚠️ 报告合规部",
          hint: "保护自己",
          apply: function (st) {
            st.flags._shortSelfSeen = true;
            st.flags._shortReported = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            StateManager.addMessage(
              "你匿名报告了CFO的减持。没说自己也有做空的念头。",
              "event",
            );
          },
        },
        {
          text: "📝 记录数据但不交易",
          hint: "留证据",
          apply: function (st) {
            st.flags._shortSelfSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            StateManager.addMessage(
              "你默默截了图。不是为了交易——是万一被裁了有谈判筹码。",
              "info",
            );
          },
        },
      ],
    },
  ];
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

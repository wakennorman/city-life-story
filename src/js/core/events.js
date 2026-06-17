/**
 * 事件引擎 — 随机事件判定、新闻应用、过期清理
 *
 * 重大改造：除原有的"广播式"新闻（仅记日志）外，
 * 新增「街头/职场随机事件 → 弹出带选项的剧情模态框」系统。
 * 事件触发后，玩家必须做出选择（2-4 个），每个选项会改变数值。
 *
 * 事件队列：state._pendingEvent — 等待弹出的事件
 * 弹窗由 showEventModal 渲染，玩家点击选项 → 结算 → 关闭
 */

/* =========================================================
 * 一、事件定义库
 * ========================================================= */

const RANDOM_EVENTS = [
  // === 街头 — 道德抉择 ===
  {
    id: "found_wallet",
    phase: "street",
    icon: "👛",
    title: "捡到了一个钱包",
    story:
      "路边有个黑色钱包，打开一看里面有一叠现金和一张身份证。失主看起来住在附近。",
    choices: [
      {
        text: "💰 据为己有",
        hint: "拿钱走人",
        apply: (st) => {
          const cash = 80 + Math.floor(Math.random() * 200);
          st.resources.cash += cash;
          st.needs.happiness = Math.max(0, st.needs.happiness - 8);
          st.flags._keptWallet = true;
          StateManager.addMessage(
            `💰 钱包里翻出了 ¥${cash}，但心里有点虚...`,
            "warning",
          );
        },
      },
      {
        text: "🏛️ 交给派出所",
        hint: "良心选择",
        apply: (st) => {
          st.needs.happiness = Math.min(100, st.needs.happiness + 12);
          st.status.fame = Math.min(100, st.status.fame + 3);
          st.flags._returnedWallet = true;
          StateManager.addMessage(
            "🏛️ 钱包交给了警察，警察夸你拾金不昧，心情大好！",
            "success",
          );
        },
      },
      {
        text: "🚶 当作没看见",
        hint: "怕惹麻烦",
        apply: (st) => {
          // 啥也不发生
          StateManager.addMessage("🚶 你假装没看见走了过去。", "info");
        },
      },
    ],
  },

  {
    id: "street_mugging",
    phase: "street",
    icon: "😱",
    title: "遇到小混混敲诈",
    story:
      "几个小混混拦住你，说最近手头紧，要借点钱花花。对方有 3 个人，你孤身一人。",
    conditions: (st) => st.resources.cash >= 50,
    choices: [
      {
        text: "💸 破财消灾 (¥80)",
        hint: "认怂保平安",
        cost: 80,
        apply: (st) => {
          st.resources.cash = Math.max(0, st.resources.cash - 80);
          st.needs.happiness = Math.max(0, st.needs.happiness - 15);
          StateManager.addMessage(
            "💸 给了 80 块，混混笑着走了。心里憋屈。",
            "warning",
          );
        },
      },
      {
        text: "🏃 撒腿就跑",
        hint: "考验敏捷",
        apply: (st) => {
          if (Math.random() < 0.5 + (st.player.agility - 20) * 0.02) {
            StateManager.addMessage(
              "🏃 你转身就跑，甩开了混混，逃过一劫！",
              "success",
            );
          } else {
            st.status.injured = true;
            st.status.health = Math.max(0, st.status.health - 20);
            st.resources.cash = Math.max(0, st.resources.cash - 100);
            StateManager.addMessage(
              "🏃 没跑掉，挨了一顿拳脚，被抢了 100 块！",
              "danger",
            );
          }
        },
      },
      {
        text: "📱 假装打电话报警",
        hint: "虚张声势",
        apply: (st) => {
          if (Math.random() < 0.4) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage(
              "📱 混混看你报警，一哄而散。你真聪明！",
              "success",
            );
          } else {
            st.resources.cash = Math.max(0, st.resources.cash - 50);
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "📱 被识破了！还是被抢了 50 块，混混也走了。",
              "warning",
            );
          }
        },
      },
    ],
  },

  {
    id: "stranger_invest",
    phase: "street",
    icon: "💹",
    title: "陌生人推荐「内部消息」",
    story:
      "一个穿西装的人凑过来，神神秘秘地说他知道一只股票的内幕消息，明天必涨，现在买入稳赚。",
    choices: [
      {
        text: "💰 信了，押 ¥500",
        hint: "赌一把",
        apply: (st) => {
          if (st.resources.cash < 500) {
            StateManager.addMessage(
              "💰 现金不足 500，错失良机（坑）",
              "warning",
            );
            return;
          }
          st.resources.cash -= 500;
          // 50% 概率赚一倍，50% 概率打水漂
          if (Math.random() < 0.4) {
            const profit = 300 + Math.floor(Math.random() * 400);
            st.resources.cash += profit;
            StateManager.addMessage(
              `💰 消息是真的！赚了 ¥${profit - 500}。`,
              "success",
            );
          } else {
            StateManager.addMessage(
              "💰 假消息！500 块打了水漂，人也跑了。",
              "danger",
            );
          }
        },
      },
      {
        text: "🚶 礼貌拒绝走人",
        hint: "理性选择",
        apply: (st) => {
          StateManager.addMessage(
            "🚶 你礼貌地摆摆手走开了。天上不会掉馅饼。",
            "info",
          );
        },
      },
      {
        text: "📱 反手举报给警察",
        hint: "正义感",
        apply: (st) => {
          st.status.fame = Math.min(100, st.status.fame + 5);
          st.needs.happiness = Math.min(100, st.needs.happiness + 6);
          StateManager.addMessage(
            "📱 警察抓到了诈骗团伙，给你点了个赞！",
            "success",
          );
        },
      },
    ],
  },

  {
    id: "old_man_help",
    phase: "street",
    icon: "👴",
    title: "老大爷需要帮助",
    story:
      "路边一位老大爷拎着两袋米，气喘吁吁地站在那儿。他想让你帮忙把米送回家，就在附近。",
    choices: [
      {
        text: "🤝 帮忙送米",
        hint: "可能有好报",
        apply: (st) => {
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 12);
          if (Math.random() < 0.5) {
            const reward = 50 + Math.floor(Math.random() * 80);
            st.resources.cash += reward;
            st.status.fame = Math.min(100, st.status.fame + 2);
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage(
              `🤝 老大爷非要给你 ¥${reward}，还夸你是个好孩子！`,
              "success",
            );
          } else {
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage(
              "🤝 把米送到了，大爷连声道谢。虽然没给钱，但心里暖暖的。",
              "success",
            );
          }
        },
      },
      {
        text: "🚶 装作赶时间走开",
        hint: "爱莫能助",
        apply: (st) => {
          st.needs.happiness = Math.max(0, st.needs.happiness - 3);
          StateManager.addMessage("🚶 你低着头快步走开了。", "info");
        },
      },
    ],
  },

  {
    id: "free_clinic",
    phase: "street",
    icon: "💊",
    title: "街头免费义诊",
    story:
      "社区在广场办免费义诊活动。志愿者医生说你最近看起来气色不好，可以免费做个基础检查。",
    choices: [
      {
        text: "🩺 接受检查",
        hint: "了解身体状况",
        apply: (st) => {
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
          if (st.status.sick) {
            st.status.sick = false;
            st.status.health = Math.min(100, st.status.health + 20);
            StateManager.addMessage(
              "🩺 医生发现你在生病，免费开了药！病好了，健康+20。",
              "success",
            );
          } else if (st.status.injured) {
            st.status.injured = false;
            st.status.health = Math.min(100, st.status.health + 15);
            StateManager.addMessage(
              "🩺 医生处理了你的伤口，上了点药。健康+15。",
              "success",
            );
          } else {
            st.status.health = Math.min(100, st.status.health + 5);
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage(
              "🩺 一切正常！医生夸你身体不错，心情也好了。",
              "success",
            );
          }
        },
      },
      {
        text: "🚶 没空，继续忙",
        hint: "省时间",
        apply: (st) => {
          StateManager.addMessage("🚶 你摇摇头继续忙自己的事了。", "info");
        },
      },
    ],
  },

  {
    id: "thrift_find",
    phase: "street",
    icon: "🛍️",
    title: "二手店捡漏",
    story:
      "路过一家二手店，老板说今天清仓，全场 5 折！你注意到有件还不错的东西。",
    choices: [
      {
        text: "🛍️ 买本技能书 (¥50)",
        hint: "可能加技能",
        cost: 50,
        apply: (st) => {
          if (st.resources.cash < 50) {
            StateManager.addMessage("🛍️ 钱不够买！", "warning");
            return;
          }
          st.resources.cash -= 50;
          const skills = Object.keys(st.skills);
          const key = skills[Math.floor(Math.random() * skills.length)];
          st.skills[key].xp += 40 + Math.floor(Math.random() * 30);
          StateManager.addMessage(
            `🛍️ 买到了《${key}入门》，翻了几页，受益匪浅。`,
            "success",
          );
        },
      },
      {
        text: "🧥 淘件二手衣服 (¥30)",
        hint: "提升卫生/心情",
        cost: 30,
        apply: (st) => {
          if (st.resources.cash < 30) {
            StateManager.addMessage("🧥 钱不够买！", "warning");
            return;
          }
          st.resources.cash -= 30;
          st.needs.hygiene = Math.min(100, st.needs.hygiene + 15);
          st.needs.happiness = Math.min(100, st.needs.happiness + 8);
          StateManager.addMessage(
            "🧥 买到了件干净的旧衣服，焕然一新！",
            "success",
          );
        },
      },
      {
        text: "🚶 啥都不需要",
        hint: "理性消费",
        apply: (st) => {
          StateManager.addMessage("🚶 家里啥都不缺，看看就好。", "info");
        },
      },
    ],
  },

  {
    id: "neighbor_fight",
    phase: "street",
    icon: "🤼",
    title: "邻居吵架请你评理",
    story: "楼上的两口子又在吵架，女方哭着跑下来向你诉苦。男的说她无理取闹。",
    choices: [
      {
        text: "🫂 安慰女方 (听听她说话)",
        hint: "提升好感",
        apply: (st) => {
          st.needs.happiness = Math.min(100, st.needs.happiness - 5);
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
          StateManager.addMessage(
            "🫂 听她哭诉了半天，搞得你也很烦躁。",
            "warning",
          );
        },
      },
      {
        text: "🧠 理智劝和",
        hint: "考验智力",
        apply: (st) => {
          if (Math.random() < 0.4 + (st.player.intelligence - 20) * 0.02) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            st.status.fame = Math.min(100, st.status.fame + 3);
            StateManager.addMessage(
              "🧠 你一番话说得两人都服气了，握手言和！还夸你通情达理。",
              "success",
            );
          } else {
            st.needs.happiness = Math.max(0, st.needs.happiness - 8);
            StateManager.addMessage(
              "🧠 你越劝越乱，两口子矛头转向了你...赶紧溜。",
              "warning",
            );
          }
        },
      },
      {
        text: "🚶 装作没听见",
        hint: "管闲事",
        apply: (st) => {
          StateManager.addMessage("🚶 你戴上耳机假装没听见。", "info");
        },
      },
    ],
  },

  {
    id: "lost_pet",
    phase: "street",
    icon: "🐕",
    title: "走失的小狗",
    story:
      "一只脏兮兮的小狗跟着你，可怜巴巴的。它脖子上有项圈但没联系方式，看着已经流浪几天了。",
    choices: [
      {
        text: "🏠 收养它",
        hint: "需要花钱照顾",
        apply: (st) => {
          st.resources.cash = Math.max(0, st.resources.cash - 30);
          st.needs.happiness = Math.min(100, st.needs.happiness + 20);
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 5);
          st.status.fame = Math.min(100, st.status.fame + 1);
          StateManager.addMessage(
            "🐕 收养了一只小狗！花了 30 块买了狗粮，心情大好！疲劳-5。",
            "success",
          );
          // 标记有宠物
          st.flags.hasPet = true;
        },
      },
      {
        text: "📞 帮它找主人",
        hint: "贴寻狗启事",
        apply: (st) => {
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 8);
          st.status.fame = Math.min(100, st.status.fame + 2);
          StateManager.addMessage(
            "📞 主人找到了！你好人有好报，心情不错。",
            "success",
          );
        },
      },
      {
        text: "🚶 爱莫能助",
        hint: "没办法",
        apply: (st) => {
          st.needs.happiness = Math.max(0, st.needs.happiness - 3);
          StateManager.addMessage(
            "🚶 你狠心走开了...希望它能自己找到家。",
            "info",
          );
        },
      },
    ],
  },

  // === 职场 — 风险/机会 ===
  {
    id: "corp_overtime",
    phase: "corporate",
    icon: "🌙",
    title: "老板要求周末加班",
    story: "领导突然在群里说：项目紧急，周末全员加班！完成有奖励，但确实很累。",
    choices: [
      {
        text: "💪 咬牙加班",
        hint: "高风险高回报",
        apply: (st) => {
          st.player.corporate.ability = Math.min(
            100,
            st.player.corporate.ability + 3,
          );
          st.player.corporate.kpi = Math.min(150, st.player.corporate.kpi + 12);
          st.player.corporate.upwardMgmt = Math.min(
            100,
            st.player.corporate.upwardMgmt + 5,
          );
          st.player.corporate.hair = Math.max(0, st.player.corporate.hair - 8);
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
          if (Math.random() < 0.5) {
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
          st.player.corporate.kpi = Math.min(150, st.player.corporate.kpi + 5);
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
          if (Math.random() < 0.4 + (st.player.intelligence - 20) * 0.02) {
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
            st.player.corporate.kpi = Math.max(0, st.player.corporate.kpi - 8);
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
          if (Math.random() < 0.5) {
            const offer = Math.round(
              (st.resources.totalEarned / Math.max(1, st.player.corpYear * 4)) *
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

  // === 职场 — 更多事件 ===
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
          st.player.corporate.hair = Math.max(0, st.player.corporate.hair - 6);
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
          if (Math.random() < 0.55) {
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
          st.player.corporate.risk = Math.max(0, st.player.corporate.risk - 10);
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
          if (Math.random() < 0.4) {
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
          st.player.corporate.hair = Math.max(0, st.player.corporate.hair - 2);
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
          const roll = Math.random();
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
          st.player.corporate.kpi = Math.min(150, st.player.corporate.kpi + 5);
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
          st.player.corporate.kpi = Math.min(150, st.player.corporate.kpi + 3);
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

  // === 投资/交易类事件（20个新增） ===
  // -- 街头交易类 --
  {
    id: "market_crash_news",
    phase: "street",
    icon: "📉",
    title: "突发利空！股市暴跌",
    story:
      "手机上弹出新闻：受国际局势影响，全球股市暴跌7%！所有人都在恐慌性抛售。你现在持有投资资产吗？",
    conditions: function (st) {
      var inv = st.investment || {};
      return inv.stockHoldings && inv.stockHoldings.length > 0;
    },
    choices: [
      {
        text: "📉 止损清仓",
        hint: "保全剩余本金",
        apply: function (st) {
          var inv = st.investment || {};
          var total = 0;
          if (inv.stockHoldings) {
            for (var i = 0; i < inv.stockHoldings.length; i++) {
              var h = inv.stockHoldings[i];
              var m = inv.stockMarket[h.symbol];
              if (m) total += (m.price * h.shares * h.shares) / h.shares;
            }
            st.resources.cash += total * 0.7;
            inv.stockHoldings = [];
          }
          StateManager.addMessage(
            "📉 恐慌清仓，按市价7折变现" +
              Math.round(total * 0.7).toLocaleString(),
            "warning",
          );
        },
      },
      {
        text: "💎 坚定持有",
        hint: "长期价值",
        apply: function (st) {
          st.needs.happiness = Math.max(0, st.needs.happiness - 65);
          st.player.mental = Math.max(5, st.player.mental - 10);
          StateManager.addMessage(
            "💎 坚定持有！虽然账面惨了但没实际亏损。心情-65,心智-10。",
            "info",
          );
        },
      },
      {
        text: "💰 逆势抄底",
        hint: "赌一把",
        apply: function (st) {
          var buyAmt = 500 + Math.floor(Math.random() * 1500);
          if (st.resources.cash >= buyAmt) {
            st.resources.cash -= buyAmt;
            st.needs.happiness = Math.max(0, st.needs.happiness - 10);
            StateManager.addMessage(
              "💰 拿出¥" + buyAmt + "进场抄底！是勇士还是韭菜只能让时间验证。",
              "event",
            );
          } else {
            StateManager.addMessage("💰 想抄底但没钱，只能干看着。", "warning");
          }
        },
      },
    ],
  },
  {
    id: "wholesale_bargain",
    phase: "street",
    icon: "📦",
    title: "批发老板甩货",
    story:
      "相熟的批发市场老板说有一批货急着清仓，低价卖给你：5折！但得一下子全部吃下。",
    conditions: function (st) {
      return st.resources.cash >= 1000;
    },
    choices: [
      {
        text: "📦 全部吃下(¥800)",
        hint: "转手能赚",
        cost: 800,
        apply: function (st) {
          st.resources.cash -= 800;
          var goods = ["electronics", "daily_use", "clothing", "beer"];
          var g = goods[Math.floor(Math.random() * goods.length)];
          var qty = 10 + Math.floor(Math.random() * 20);
          var exist = st.inventory.items.find(function (x) {
            return x.id === g;
          });
          if (exist) {
            exist.qty += qty;
          } else {
            st.inventory.items.push({
              id: g,
              qty: qty,
              boughtAt: "wholesale_market",
              avgBuyPrice: Math.round((800 / qty) * 100) / 100,
            });
          }
          StateManager.addMessage(
            "📦 一口吃下" + qty + "件货，800块全包！转手能赚。",
            "success",
          );
        },
      },
      {
        text: "🚶 怕卖不掉",
        hint: "保守选择",
        apply: function (st) {
          StateManager.addMessage("🚶 风险太大，还是稳点好。", "info");
        },
      },
    ],
  },
  {
    id: "lottery_scratch",
    phase: "street",
    icon: "🎫",
    title: "刮刮乐诱惑",
    story:
      "彩票店门口贴了大红横幅「今日头奖¥50,000！」。2块钱一张，要不要试试手气？",
    choices: [
      {
        text: "🎫 买一张(¥20)",
        hint: "小赌怡情",
        cost: 20,
        apply: function (st) {
          if (st.resources.cash >= 20) {
            st.resources.cash -= 20;
            if (Math.random() < 0.15) {
              var win = 200 + Math.floor(Math.random() * 500);
              st.resources.cash += win;
              st.needs.happiness = Math.min(100, st.needs.happiness + 15);
              StateManager.addMessage(
                "🎫 中了¥" + win + "！太爽了！",
                "success",
              );
            } else {
              StateManager.addMessage("🎫 啥也没中。2块钱买了个梦。", "info");
            }
          } else {
            StateManager.addMessage("🎫 连20块都没有...", "warning");
          }
        },
      },
      {
        text: "🎰 买10张冲大奖(¥200)",
        hint: "赌性大发",
        cost: 200,
        apply: function (st) {
          if (st.resources.cash >= 200) {
            st.resources.cash -= 200;
            if (Math.random() < 0.1) {
              var win = 5000 + Math.floor(Math.random() * 15000);
              st.resources.cash += win;
              st.needs.happiness = Math.min(100, st.needs.happiness + 30);
              StateManager.addMessage(
                "🎰 中了¥" + win + "！激动到手抖！",
                "success",
              );
            } else if (Math.random() < 0.3) {
              var win2 = 100 + Math.floor(Math.random() * 400);
              st.resources.cash += win2;
              StateManager.addMessage(
                "🎰 中了¥" + win2 + "，回了点本。",
                "info",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 20);
              StateManager.addMessage("🎰 全亏了！200块钱交学费。", "danger");
            }
          } else {
            StateManager.addMessage("🎰 钱不够，省省吧。", "warning");
          }
        },
      },
      {
        text: "🚶 赌博不好",
        hint: "理性",
        apply: function (st) {
          StateManager.addMessage("🚶 彩票本质是穷人税，不碰就对了。", "info");
        },
      },
    ],
  },
  {
    id: "gold_surge",
    phase: "street",
    icon: "🥇",
    title: "黄金暴涨！",
    story:
      "新闻说国际金价突破历史新高！地缘冲突升级，避险资金涌入黄金。你有黄金吗？",
    choices: [
      {
        text: "💰 马上买黄金",
        hint: "追涨",
        apply: function (st) {
          var inv = st.investment || {};
          if (!inv.stockMarket) return;
          var m = inv.stockMarket.XAU;
          if (!m) return;
          var cost = m.price * 5;
          if (st.resources.cash >= cost) {
            st.resources.cash -= cost;
            inv.stockHoldings = inv.stockHoldings || [];
            var h = inv.stockHoldings.find(function (x) {
              return x.symbol === "XAU";
            });
            if (h) {
              h.avgPrice =
                Math.round(
                  ((h.avgPrice * h.shares + cost) / (h.shares + 5)) * 100,
                ) / 100;
              h.shares += 5;
            } else {
              inv.stockHoldings.push({
                symbol: "XAU",
                shares: 5,
                avgPrice: m.price,
              });
            }
            StateManager.addMessage("💰 买了5克黄金，避险配置！", "success");
          } else {
            StateManager.addMessage("💰 没钱买黄金，错过一轮行情。", "warning");
          }
        },
      },
      {
        text: "🚶 看看再说",
        hint: "谨慎",
        apply: function (st) {
          StateManager.addMessage("🚶 市场情绪太亢奋了，先观望。", "info");
        },
      },
    ],
  },
  {
    id: "property_bubble",
    phase: "street",
    icon: "🏠",
    title: "房价可能要跌？",
    story:
      "隔壁城市出了严厉的房产调控政策，房价已经开始跌了。这边会不会跟进？你的房产怎么办？",
    conditions: function (st) {
      var inv = st.investment || {};
      return inv.properties && inv.properties.length > 0;
    },
    choices: [
      {
        text: "🏠 趁跌价前卖掉",
        hint: "止损",
        apply: function (st) {
          var inv = st.investment || {};
          if (!inv.properties) return;
          var total = 0;
          for (var i = 0; i < inv.properties.length; i++) {
            total +=
              inv.properties[i].currentPrice || inv.properties[i].buyPrice;
          }
          st.resources.cash += total * 0.85;
          inv.properties = [];
          StateManager.addMessage(
            "🏠 85折急售房产，回笼了¥" +
              Math.round(total * 0.85).toLocaleString() +
              "。",
            "warning",
          );
        },
      },
      {
        text: "🏠 反正自住无所谓",
        hint: "淡定",
        apply: function (st) {
          st.needs.happiness = Math.max(0, st.needs.happiness - 5);
          StateManager.addMessage(
            "🏠 房子是用来住的不是炒的。心里稍安。",
            "info",
          );
        },
      },
    ],
  },
  // -- 职场投资类 --
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
            if (Math.random() < 0.3) {
              st.resources.cash += 8000 + Math.floor(Math.random() * 15000);
              st.needs.happiness = Math.min(100, st.needs.happiness + 20);
              StateManager.addMessage(
                "🚀 运气爆棚追涨成功！大赚了一笔！",
                "success",
              );
            } else if (Math.random() < 0.5) {
              st.resources.cash += 3000 + Math.floor(Math.random() * 4000);
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
            if (def && (def.industry === "科技" || def.industry === "新能源")) {
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
          var cost = 1000 + Math.floor(Math.random() * 3000);
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
                  ((smic.avgPrice * smic.shares + cost) / (smic.shares + 50)) *
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
  // -- 状态变化触发类 --
  {
    id: "sick_desperate",
    phase: "street",
    icon: "🤒",
    title: "生病中有人介绍偏方",
    story: "你病还没好，路边一个老太太神神秘秘说她有个祖传偏方，包治百病。",
    conditions: function (st) {
      return st.status.sick || st.status.health < 40;
    },
    choices: [
      {
        text: "💊 试试偏方(¥50)",
        hint: "死马当活马医",
        cost: 50,
        apply: function (st) {
          if (st.resources.cash >= 50) {
            st.resources.cash -= 50;
            if (Math.random() < 0.4) {
              st.status.sick = false;
              st.status.health = Math.min(100, st.status.health + 30);
              st.needs.happiness = Math.min(100, st.needs.happiness + 10);
              StateManager.addMessage(
                "💊 偏方居然有效！病好了健康+30。",
                "success",
              );
            } else {
              st.status.health = Math.max(0, st.status.health - 10);
              StateManager.addMessage("💊 假药！病情加重了健康-10。", "danger");
            }
          } else {
            StateManager.addMessage("💊 连50块都没有...", "warning");
          }
        },
      },
      {
        text: "🏥 还是去正规医院吧",
        hint: "科学就医",
        apply: function (st) {
          StateManager.addMessage("🏥 祖传偏方不可信。建议你去医院。", "info");
        },
      },
    ],
  },
  {
    id: "hunger_begging",
    phase: "street",
    icon: "🍞",
    title: "饥饿中遇到好心人",
    story: "你实在饿得不行了。一位路过的阿姨看到你脸色不好，问你需不需要帮助。",
    conditions: function (st) {
      return st.needs.hunger < 20;
    },
    choices: [
      {
        text: "🍞 接受帮助",
        hint: "活下去",
        apply: function (st) {
          st.needs.hunger = Math.min(100, st.needs.hunger + 40);
          st.needs.happiness = Math.min(100, st.needs.happiness + 15);
          st.status.fame = Math.min(100, st.status.fame - 2);
          StateManager.addMessage(
            "🍞 阿姨给你买了份盒饭还塞了50块。感激涕零但不能老靠别人。名气-2。",
            "success",
          );
        },
      },
      {
        text: "🤚 婉拒，靠自己",
        hint: "有骨气",
        apply: function (st) {
          st.player.mental = Math.min(100, st.player.mental + 5);
          st.needs.happiness = Math.max(0, st.needs.happiness - 10);
          StateManager.addMessage("🤚 再饿也要靠自己，心智+5。", "info");
        },
      },
    ],
  },
  // -- 地点切换触发类 --
  {
    id: "bank_promo",
    phase: "street",
    icon: "🏦",
    title: "银行推销理财产品",
    story:
      "你走进银行，客户经理热情地推荐一款「稳赚不赔」的理财产品，年化收益号称8%。",
    choices: [
      {
        text: "💰 买¥2000理财",
        hint: "试试看",
        cost: 2000,
        apply: function (st) {
          if (st.resources.cash >= 2000) {
            st.resources.cash -= 2000;
            st._ipo_invest = 2000;
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            StateManager.addMessage(
              "💰 买了¥2000理财产品，30天后连本带利返还。",
              "success",
            );
          } else {
            StateManager.addMessage("💰 钱不够买理财。", "warning");
          }
        },
      },
      {
        text: "📚 先了解一下再决定",
        hint: "谨慎",
        apply: function (st) {
          st.skills.accounting.xp += 20;
          StateManager.addMessage(
            "📚 索要了产品说明书仔细研究，会计EXP+20。",
            "info",
          );
        },
      },
      {
        text: "🚶 没兴趣",
        hint: "走人",
        apply: function (st) {
          StateManager.addMessage("🚶 对理财产品敬而远之。", "info");
        },
      },
    ],
  },
  {
    id: "business_district_chance",
    phase: "street",
    icon: "🏢",
    title: "商业区创业大赛",
    story:
      "你路过商业区看到创业大赛海报：第一名可获¥50,000启动资金！报名截止今天。",
    choices: [
      {
        text: "🏢 报名参加(¥500报名费)",
        hint: "梦想",
        cost: 500,
        apply: function (st) {
          if (st.resources.cash >= 500) {
            st.resources.cash -= 500;
            var skillScore = st.skills.sales.level + st.skills.management.level;
            if (Math.random() < 0.2 + skillScore * 0.005) {
              st.resources.cash += 50000;
              st.status.fame = Math.min(100, st.status.fame + 20);
              st.needs.happiness = Math.min(100, st.needs.happiness + 30);
              StateManager.addMessage(
                "🏢 拿到了第一名！¥50,000到位+名气+20！",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 15);
              StateManager.addMessage("🏢 海选淘汰了。但收获了经验。", "info");
            }
          } else {
            StateManager.addMessage("🏢 报名费都拿不出。", "warning");
          }
        },
      },
      {
        text: "🚶 我还不够格",
        hint: "认清现实",
        apply: function (st) {
          StateManager.addMessage("🚶 知道自己几斤几两也是智慧。", "info");
        },
      },
    ],
  },
  // -- 赚钱/投资关键事件 --
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

  // === 道德困境类（This War of Mine 风格 — 没有对错，只有代价）===
  {
    id: "fallen_elder",
    phase: "street",
    icon: "🧓",
    title: "老人摔倒了",
    story: "菜市场门口，一位老大爷摔倒在地，周围人都在看但没人上前。你要怎么做？",
    conditions: function(st) { return st.player.phase === 'street'; },
    choices: [
      {
        text: "🤝 立刻上前扶起",
        hint: "先扶再说",
        apply: function(st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 15);
          st.status.fame = Math.min(100, st.status.fame + 5);
          if (Math.random() < 0.15) {
            const fine = 300 + Math.floor(Math.random() * 200);
            st.resources.cash = Math.max(0, st.resources.cash - fine);
            StateManager.addMessage('🧓 你扶起了老人，对方家属却说你撞倒了他，赔了 ¥' + fine + '...心情极差。', 'danger');
            st.needs.happiness = Math.max(0, st.needs.happiness - 25);
          } else {
            StateManager.addMessage('🧓 你扶起了老人，家属赶来道谢连连，周围人竖起大拇指。名气+5。', 'success');
          }
        },
      },
      {
        text: "📱 拍照留证后再扶",
        hint: "保护自己也帮人",
        apply: function(st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 8);
          st.status.fame = Math.min(100, st.status.fame + 2);
          StateManager.addMessage('📱 拍下视频留证后扶起老人，理性与善意兼顾。', 'success');
        },
      },
      {
        text: "🚶 绕道走，不惹麻烦",
        hint: "自保优先",
        apply: function(st) {
          st.needs.happiness = Math.max(0, st.needs.happiness - 5);
          StateManager.addMessage('🚶 你选择绕道走开，内心有些不安。', 'warning');
        },
      },
    ],
  },

  {
    id: "coworker_injured",
    phase: "street",
    icon: "🩹",
    title: "工友在工地受伤了",
    story: "你的工友老刘从脚手架上摔下来，工头悄悄跟你说"别声张，私了了事，你多分200块"。老刘疼得直哼。",
    conditions: function(st) { return st.player.phase === 'street'; },
    choices: [
      {
        text: "💰 收钱保持沉默",
        hint: "拿200块",
        apply: function(st) {
          st.resources.cash += 200;
          st.needs.happiness = Math.max(0, st.needs.happiness - 18);
          if (st.relationships && st.relationships['boss_li']) {
            st.relationships['boss_li'].affinity = Math.min(100, st.relationships['boss_li'].affinity + 10);
          }
          StateManager.addMessage('💰 你拿了200块，老刘被悄悄送回宿舍。你睡不着觉。', 'warning');
        },
      },
      {
        text: "🚑 坚持打120叫救护车",
        hint: "保护工友权益",
        apply: function(st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 20);
          st.status.fame = Math.min(100, st.status.fame + 8);
          st.flags._helpedCoworker = true;
          if (st.relationships && st.relationships['boss_li']) {
            st.relationships['boss_li'].affinity = Math.max(-100, st.relationships['boss_li'].affinity - 20);
          }
          StateManager.addMessage('🚑 你拨打了120，工头大怒，但工友老刘感激涕零。良心无价。', 'success');
        },
      },
      {
        text: "😶 假装没看到，先去干活",
        hint: "明哲保身",
        apply: function(st) {
          st.needs.happiness = Math.max(0, st.needs.happiness - 10);
          StateManager.addMessage('😶 你低头继续干活，那声哼叫一直在耳边回响。', 'info');
        },
      },
    ],
  },

  {
    id: "fake_goods",
    phase: "street",
    icon: "📦",
    title: "发现进了假货",
    story: "你从批发市场进了一批电子产品，摆摊时才发现全是山寨货。你手里还有20件，进货成本已经付了¥800。",
    conditions: function(st) { return st.player.phase === 'street' && (st.resources.cash > 0); },
    choices: [
      {
        text: "😈 继续卖，买者自负",
        hint: "损失已发生，捞回来",
        apply: function(st) {
          const earned = 400 + Math.floor(Math.random() * 300);
          st.resources.cash += earned;
          st.resources.totalEarned += earned;
          if (Math.random() < 0.3) {
            st.status.fame = Math.max(0, st.status.fame - 10);
            StateManager.addMessage('😈 卖出去了，但被客户投诉，名气-10。赚了 ¥' + earned + '。', 'warning');
          } else {
            StateManager.addMessage('😈 全部卖掉，没人发现。得了 ¥' + earned + '，但心知肚明。', 'warning');
          }
          st.needs.happiness = Math.max(0, st.needs.happiness - 8);
        },
      },
      {
        text: "🗑️ 全部销毁，认赔¥800",
        hint: "道德选择，损失惨重",
        apply: function(st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 10);
          st.status.fame = Math.min(100, st.status.fame + 5);
          st.flags._refusedFakeGoods = true;
          StateManager.addMessage('🗑️ 你把假货全部扔掉，损失¥800。这钱是教训钱，名气+5。', 'info');
        },
      },
      {
        text: "↩️ 去找批发商理论退货",
        hint: "据理力争",
        apply: function(st) {
          if (Math.random() < 0.5) {
            const refund = 400 + Math.floor(Math.random() * 200);
            st.resources.cash += refund;
            StateManager.addMessage('↩️ 死缠烂打两小时，批发商退了 ¥' + refund + '。没全退，但争回了一半。', 'success');
          } else {
            StateManager.addMessage('↩️ 批发商耍赖说验货时没说不行，白跑了一趟，消耗了大半天AP。', 'warning');
          }
        },
      },
    ],
  },

  {
    id: "mlm_trap",
    phase: "street",
    icon: "🎪",
    title: "同乡拉你听讲座",
    story: "老家来的表哥说带你去听个"财富自由分享会"，说能月入过万。地址在郊区某酒店。",
    conditions: function(st) { return st.player.phase === 'street'; },
    choices: [
      {
        text: "🎪 去听听，搞不好是机会",
        hint: "好奇心驱使",
        apply: function(st) {
          const loss = 500 + Math.floor(Math.random() * 500);
          if (st.resources.cash >= loss) {
            st.resources.cash -= loss;
            st.needs.happiness = Math.max(0, st.needs.happiness - 30);
            StateManager.addMessage('🎪 进去才发现是传销！被骗去 ¥' + loss + '，好不容易找借口跑出来。', 'danger');
          } else {
            st.needs.happiness = Math.max(0, st.needs.happiness - 15);
            StateManager.addMessage('🎪 他们嫌你穷让你走人了。心情很差，但也算逃过一劫。', 'warning');
          }
        },
      },
      {
        text: "🚫 直接拒绝，说有事",
        hint: "躲避风险",
        apply: function(st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 5);
          StateManager.addMessage('🚫 你找了个借口推掉了，表哥说你没格局。没事，格局不值500块。', 'success');
        },
      },
      {
        text: "🔍 上网先查一下这个公司",
        hint: "谨慎核实",
        apply: function(st) {
          st.player.intelligence = Math.min(100, st.player.intelligence + 0.5);
          st.needs.happiness = Math.min(100, st.needs.happiness + 3);
          StateManager.addMessage('🔍 一搜就发现是传销机构，直接举报，还顺手提升了防骗意识。智力+0.5。', 'success');
        },
      },
    ],
  },

  {
    id: "wage_theft",
    phase: "street",
    icon: "💸",
    title: "老板拖欠工资",
    story: "干了半个月，工头说"年底一起结"。你知道这条街上好几个外来务工者都被拖欠过，年底往往人去楼空。",
    conditions: function(st) { return st.player.phase === 'street'; },
    choices: [
      {
        text: "⏳ 忍着等，年底再说",
        hint: "赌一把",
        apply: function(st) {
          if (Math.random() < 0.45) {
            StateManager.addMessage('⏳ 年底工头跑路了。那两个月的工钱就这么没了。', 'danger');
            st.needs.happiness = Math.max(0, st.needs.happiness - 25);
          } else {
            const paid = 1200 + Math.floor(Math.random() * 800);
            st.resources.cash += paid;
            st.resources.totalEarned += paid;
            StateManager.addMessage('⏳ 没想到工头真的年底结账，一次性给了 ¥' + paid + '，虚惊一场。', 'success');
          }
        },
      },
      {
        text: "🏛️ 去劳动局投诉",
        hint: "用法律维权",
        apply: function(st) {
          const recovered = 600 + Math.floor(Math.random() * 400);
          st.resources.cash += recovered;
          st.resources.totalEarned += recovered;
          st.needs.happiness = Math.min(100, st.needs.happiness + 12);
          st.flags._foughtWageTheft = true;
          StateManager.addMessage('🏛️ 劳动仲裁历时3周，追回了 ¥' + recovered + '，虽然没全追回，但出了口气。', 'success');
        },
      },
      {
        text: "📸 偷偷收集证据再行动",
        hint: "有备无患",
        apply: function(st) {
          st.player.intelligence = Math.min(100, st.player.intelligence + 1);
          st.needs.happiness = Math.min(100, st.needs.happiness + 5);
          StateManager.addMessage('📸 你暗中留存了工资条和聊天记录。有准备的人不吃亏，智力+1。', 'info');
        },
      },
    ],
  },

  // === 街头机遇类 ===
  {
    id: "landlord_rent_hike",
    phase: "street",
    icon: "🏠",
    title: "房东突然涨租",
    story: "房东王大婶敲门说："下个月房租从300涨到500，不行就搬走。"你现在住的这里还算安全。",
    conditions: function(st) { return st.player.phase === 'street' && st.housing.tier >= 1; },
    choices: [
      {
        text: "😤 讨价还价，争取少涨",
        hint: "谈判试试",
        apply: function(st) {
          if (st.skills.sales && st.skills.sales.level >= 10) {
            StateManager.addMessage('😤 凭借你的销售口才，把涨幅砍到¥50，王大婶勉强答应了。', 'success');
          } else if (Math.random() < 0.4) {
            StateManager.addMessage('😤 磨了半小时，王大婶松口涨¥100，妥协了。', 'info');
          } else {
            StateManager.addMessage('😤 王大婶态度强硬，一分不让。只能接受¥200的涨价。', 'warning');
          }
          if (st.relationships && st.relationships['aunt_wang']) {
            st.relationships['aunt_wang'].affinity = Math.max(-100, st.relationships['aunt_wang'].affinity - 5);
          }
        },
      },
      {
        text: "✅ 直接同意，维持关系",
        hint: "花钱买安稳",
        apply: function(st) {
          if (st.relationships && st.relationships['aunt_wang']) {
            st.relationships['aunt_wang'].affinity = Math.min(100, st.relationships['aunt_wang'].affinity + 8);
          }
          StateManager.addMessage('✅ 你爽快答应了，王大婶对你印象更好了。好感+8。', 'success');
        },
      },
      {
        text: "🏃 找机会搬走",
        hint: "另谋住处",
        apply: function(st) {
          st.housing.tier = Math.max(0, st.housing.tier - 1);
          st.needs.happiness = Math.max(0, st.needs.happiness - 10);
          StateManager.addMessage('🏃 你搬去了更便宜的地方，条件差了点，但省了钱。住所降级。', 'warning');
        },
      },
    ],
  },

  {
    id: "street_talent_scout",
    phase: "street",
    icon: "🌟",
    title: "摆摊时被老板相中",
    story: "今天摆摊，一个穿着体面的中年女人在你摊位前停了很久，说她在一家公司负责采购，问你有没有兴趣合作供货。",
    conditions: function(st) { return st.player.phase === 'street' && (st.skills.sales ? st.skills.sales.level >= 5 : false); },
    choices: [
      {
        text: "💼 留下联系方式深入谈",
        hint: "可能是机遇",
        apply: function(st) {
          if (Math.random() < 0.6) {
            const bonus = 800 + Math.floor(Math.random() * 1200);
            st.resources.cash += bonus;
            st.resources.totalEarned += bonus;
            st.status.fame = Math.min(100, st.status.fame + 8);
            StateManager.addMessage('💼 合作谈成！对方下了首批订单，进账 ¥' + bonus + '！名气+8。', 'success');
          } else {
            StateManager.addMessage('💼 谈了三天，最后对方说预算砍了，合作告吹。但认识了个人脉。', 'info');
          }
        },
      },
      {
        text: "🎯 专注眼前，摆摊为主",
        hint: "稳字当头",
        apply: function(st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 3);
          StateManager.addMessage('🎯 你礼貌地拒绝了，专心摆好今天的摊。', 'info');
        },
      },
    ],
  },

  {
    id: "secondhand_phone",
    phase: "street",
    icon: "📱",
    title: "路边有人卖二手手机",
    story: "城中村路口有人摆了个二手手机摊，一部外观完好的安卓机，卖¥150，比正规店便宜多了。",
    conditions: function(st) { return st.player.phase === 'street' && st.resources.cash >= 150; },
    choices: [
      {
        text: "📱 买下来，以后跑外卖用",
        hint: "投资装备",
        apply: function(st) {
          if (Math.random() < 0.7) {
            st.resources.cash -= 150;
            st.status.fame = Math.min(100, st.status.fame + 2);
            StateManager.addMessage('📱 手机买到了，成色还不错！跑外卖的路敞开了，名气+2。', 'success');
          } else {
            st.resources.cash -= 150;
            st.needs.happiness = Math.max(0, st.needs.happiness - 10);
            StateManager.addMessage('📱 买回来发现是翻新机，主板有问题，修了¥50还是不稳定。买贵了。', 'warning');
          }
        },
      },
      {
        text: "🔍 要求当场测试再决定",
        hint: "谨慎些",
        apply: function(st) {
          st.player.intelligence = Math.min(100, st.player.intelligence + 0.3);
          const price = 100 + Math.floor(Math.random() * 80);
          st.resources.cash -= price;
          StateManager.addMessage('🔍 你仔细测试了30分钟，砍价到¥' + price + '成交，没有暗病。', 'success');
        },
      },
      {
        text: "❌ 不买，风险太大",
        hint: "安全第一",
        apply: function(st) {
          StateManager.addMessage('❌ 你走开了。路边货靠不住，心里踏实一点。', 'info');
        },
      },
    ],
  },

  {
    id: "township_buddy",
    phase: "street",
    icon: "🤗",
    title: "遇到了老乡",
    story: "菜场里，有人叫你名字——是你们县的老周头的儿子小周，在城里打拼了三年，看起来过得还行。",
    conditions: function(st) { return st.player.phase === 'street'; },
    choices: [
      {
        text: "🍺 请他喝瓶啤酒叙旧",
        hint: "¥10 维系人脉",
        apply: function(st) {
          if (st.resources.cash >= 10) {
            st.resources.cash -= 10;
            st.needs.happiness = Math.min(100, st.needs.happiness + 20);
            const tip = Math.random();
            if (tip < 0.4) {
              const cash = 200 + Math.floor(Math.random() * 300);
              st.resources.cash += cash;
              StateManager.addMessage('🤗 聊得投机，他给你介绍了个短期活，赚了 ¥' + cash + '！老乡最亲。', 'success');
            } else {
              StateManager.addMessage('🤗 喝了啤酒聊了两小时，得到了不少城里生存的经验，心情+20。', 'success');
            }
          } else {
            StateManager.addMessage('🤗 连10块啤酒钱都拿不出，尴尬，老乡请你喝了，心里不是滋味。', 'warning');
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
          }
        },
      },
      {
        text: "📞 加个微信，以后联系",
        hint: "不花钱建立联系",
        apply: function(st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 8);
          StateManager.addMessage('📞 加了老乡联系方式，城里认识的人又多了一个。', 'info');
        },
      },
    ],
  },

  {
    id: "rainy_day_dilemma",
    phase: "street",
    icon: "🌧️",
    title: "暴雨来了，摊子怎么办",
    story: "下午突然电闪雷鸣，暴雨将至。你的摊子还铺着货，跑一趟要20分钟。同时有个生意正谈到关键处。",
    conditions: function(st) { return st.player.phase === 'street'; },
    choices: [
      {
        text: "🏃 扔下生意去收摊",
        hint: "保住货物",
        apply: function(st) {
          const saved = 100 + Math.floor(Math.random() * 200);
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 12);
          st.needs.hygiene = Math.max(0, st.needs.hygiene - 10);
          StateManager.addMessage('🏃 冒雨跑去收摊，淋成落汤鸡，保住了约 ¥' + saved + ' 的货物。', 'info');
        },
      },
      {
        text: "💰 谈完生意再说",
        hint: "生意优先",
        apply: function(st) {
          if (Math.random() < 0.5) {
            const deal = 150 + Math.floor(Math.random() * 200);
            st.resources.cash += deal;
            st.resources.totalEarned += deal;
            StateManager.addMessage('💰 生意谈成了 ¥' + deal + '，但摊子淋湿了一半货，有得有失。', 'warning');
          } else {
            StateManager.addMessage('💰 生意没谈拢，货也淋湿了。今天运气真差。', 'danger');
            st.needs.happiness = Math.max(0, st.needs.happiness - 15);
          }
        },
      },
      {
        text: "🏠 躲进附近店铺等雨停",
        hint: "保命要紧",
        apply: function(st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 3);
          StateManager.addMessage('🏠 你躲进一家便利店，雨中喝了杯热茶，心情稍好。货丢了但没感冒。', 'info');
        },
      },
    ],
  },

  {
    id: "food_poisoning",
    phase: "street",
    icon: "🤢",
    title: "路边摊吃坏肚子了",
    story: "昨晚在夜市吃了碗牛杂，今早起来肚子一直不对劲。现在有工作要去，但感觉随时要跑厕所。",
    conditions: function(st) { return st.player.phase === 'street'; },
    choices: [
      {
        text: "💪 撑着去干活，不能误工",
        hint: "意志力胜过身体",
        apply: function(st) {
          st.status.sick = true;
          st.status.health = Math.max(0, st.status.health - 10);
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 20);
          StateManager.addMessage('💪 你撑着上了工，干活效率极低，肚子疼了一整天。健康-10，疲劳+20。', 'warning');
        },
      },
      {
        text: "💊 去药店买点止泻药",
        hint: "¥15 解决问题",
        apply: function(st) {
          if (st.resources.cash >= 15) {
            st.resources.cash -= 15;
            st.status.health = Math.min(100, st.status.health + 5);
            StateManager.addMessage('💊 买了止泻药，下午基本没事了。¥15 买健康很值。健康+5。', 'success');
          } else {
            st.status.sick = true;
            StateManager.addMessage('💊 连15块药费都拿不出来...只能硬扛。', 'danger');
          }
        },
      },
      {
        text: "🛏️ 在家休息一天",
        hint: "休养恢复",
        apply: function(st) {
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 20);
          st.status.health = Math.min(100, st.status.health + 8);
          st.needs.hunger = Math.max(0, st.needs.hunger - 15);
          StateManager.addMessage('🛏️ 睡了一天，肠胃好多了。少干了一天活，但恢复了精力。', 'info');
        },
      },
    ],
  },

  {
    id: "market_clearance_police",
    phase: "street",
    icon: "🚨",
    title: "城管大规模清理行动",
    story: "政府最近出通知要"整治市容"，整条街的摊贩都在风声鹤唳。据说明天会有大规模清查，抓到没证经营的罚款¥1000起。",
    conditions: function(st) { return st.player.phase === 'street'; },
    choices: [
      {
        text: "📋 花¥200办个临时许可证",
        hint: "正规化应对",
        apply: function(st) {
          if (st.resources.cash >= 200) {
            st.resources.cash -= 200;
            st.status.fame = Math.min(100, st.status.fame + 3);
            StateManager.addMessage('📋 花¥200办了临时证，城管来了直接亮证件，没事。名气+3。', 'success');
          } else {
            StateManager.addMessage('📋 凑不出¥200，只能另想办法。', 'warning');
          }
        },
      },
      {
        text: "🤝 打听消息，提前和城管疏通",
        hint: "走关系",
        apply: function(st) {
          const bribe = 100 + Math.floor(Math.random() * 100);
          if (st.resources.cash >= bribe) {
            st.resources.cash -= bribe;
            if (st.chengguan) st.chengguan.heat = Math.max(0, st.chengguan.heat - 30);
            StateManager.addMessage('🤝 花了 ¥' + bribe + ' 疏通关系，城管对你睁一只眼闭一只眼。', 'warning');
          } else {
            StateManager.addMessage('🤝 没够疏通的钱，只能祈祷了。', 'warning');
          }
        },
      },
      {
        text: "🏃 临时转移阵地，躲几天",
        hint: "惹不起躲得起",
        apply: function(st) {
          st.needs.happiness = Math.max(0, st.needs.happiness - 5);
          if (st.chengguan) st.chengguan.heat = Math.max(0, st.chengguan.heat - 20);
          StateManager.addMessage('🏃 你临时把摊子挪到了僻静处，躲过了这波清查，少赚了两天钱。', 'info');
        },
      },
    ],
  },

  // === NPC 关联触发类 ===
  {
    id: "aunt_wang_job_tip",
    phase: "street",
    icon: "👩",
    title: "王大婶介绍了个活",
    story: "房东王大婶敲门说："我侄子家装修，需要个会刷墙的人，管饭，300块一天，你去不去？"",
    conditions: function(st) {
      var rel = st.relationships && st.relationships['aunt_wang'];
      return st.player.phase === 'street' && rel && rel.affinity >= 20;
    },
    choices: [
      {
        text: "👍 去！一天300值了",
        hint: "抓住机会",
        apply: function(st) {
          const earned = 250 + Math.floor(Math.random() * 150);
          st.resources.cash += earned;
          st.resources.totalEarned += earned;
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 30);
          st.needs.hygiene = Math.max(0, st.needs.hygiene - 15);
          if (st.relationships && st.relationships['aunt_wang']) {
            st.relationships['aunt_wang'].affinity = Math.min(100, st.relationships['aunt_wang'].affinity + 5);
          }
          StateManager.addMessage('👍 刷了一天墙，累但收获 ¥' + earned + '，王大婶更器重你了。', 'success');
        },
      },
      {
        text: "❌ 推掉，有别的安排",
        hint: "婉拒",
        apply: function(st) {
          if (st.relationships && st.relationships['aunt_wang']) {
            st.relationships['aunt_wang'].affinity = Math.max(-100, st.relationships['aunt_wang'].affinity - 3);
          }
          StateManager.addMessage('❌ 你婉拒了王大婶，她有点失望。', 'info');
        },
      },
    ],
  },

  {
    id: "boss_li_bonus",
    phase: "street",
    icon: "🔨",
    title: "李工头发了奖金",
    story: "李工头难得开心，说这个月工程提前完工，要给干活积极的人发奖金。你和他的关系决定你能拿多少。",
    conditions: function(st) {
      return st.player.phase === 'street';
    },
    choices: [
      {
        text: "🎉 站出来，你一直很努力",
        hint: "争取奖金",
        apply: function(st) {
          var affinity = (st.relationships && st.relationships['boss_li']) ? st.relationships['boss_li'].affinity : 0;
          var bonus = affinity >= 50 ? 500 + Math.floor(Math.random() * 300)
                    : affinity >= 20 ? 200 + Math.floor(Math.random() * 200)
                    : 50 + Math.floor(Math.random() * 100);
          st.resources.cash += bonus;
          st.resources.totalEarned += bonus;
          StateManager.addMessage('🎉 根据你和工头的关系，拿到了奖金 ¥' + bonus + '！', 'success');
        },
      },
      {
        text: "😌 低调，不争",
        hint: "随缘",
        apply: function(st) {
          const small = 50 + Math.floor(Math.random() * 80);
          st.resources.cash += small;
          st.resources.totalEarned += small;
          StateManager.addMessage('😌 工头随手给了你 ¥' + small + ' 红包，低调也有收获。', 'info');
        },
      },
    ],
  },

  {
    id: "dorm_theft",
    phase: "street",
    icon: "🔑",
    title: "宿舍里发生了失窃",
    story: "合租的宿舍有人丢了¥300现金，室友们互相猜疑。你有点印象，昨天看到一个平时鬼鬼祟祟的人进过那屋。",
    conditions: function (st) {
      return st.player.phase === "street";
    },
    choices: [
      {
        text: "🗣️ 说出你看到的情况",
        hint: "仗义执言",
        apply: function (st) {
          if (Math.random() < 0.6) {
            st.status.fame = Math.min(100, st.status.fame + 5);
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            StateManager.addMessage("🗣️ 你提供了线索，失主追回了钱，大家都说你讲义气，名气+5。", "success");
          } else {
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage("🗣️ 你说了，但嫌疑人矢口否认，搞得大家都尴尬，没结果。", "warning");
          }
        },
      },
      {
        text: "🤐 不关我事，沉默",
        hint: "明哲保身",
        apply: function (st) {
          st.needs.happiness = Math.max(0, st.needs.happiness - 8);
          StateManager.addMessage("🤐 你选择沉默，这件事就这么算了。心里有点不是滋味。", "info");
        },
      },
      {
        text: "🚔 去跟楼管反映",
        hint: "走正规途径",
        apply: function (st) {
          st.player.mental = Math.min(100, st.player.mental + 2);
          StateManager.addMessage("🚔 你找了楼管，装了监控，宿舍氛围变好了，心智+2。", "success");
        },
      },
    ],
  },

  {
    id: "night_shift_offer",
    phase: "street",
    icon: "🌙",
    title: "夜班搬运工机会",
    story: "货运站招夜班搬运工，12点到早上6点，时薪¥25，一晚能赚¥150，但白天就没法正常干活了。",
    conditions: function (st) {
      return st.player.phase === "street" && st.needs.fatigue <= 60;
    },
    choices: [
      {
        text: "🌙 接！钱要紧",
        hint: "赚快钱",
        apply: function (st) {
          var earned = 120 + Math.floor(Math.random() * 60);
          st.resources.cash += earned;
          st.resources.totalEarned += earned;
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 40);
          st.status.health = Math.max(0, st.status.health - 8);
          StateManager.addMessage("🌙 熬了一夜，赚了¥" + earned + "。白天走路都在飘，健康-8，疲劳+40。", "warning");
        },
      },
      {
        text: "😴 不接，保证休息",
        hint: "长线考量",
        apply: function (st) {
          st.player.mental = Math.min(100, st.player.mental + 3);
          StateManager.addMessage("😴 你克制住了短期诱惑，好好睡了一觉。细水长流，心智+3。", "info");
        },
      },
      {
        text: "💬 问能不能做两三次就走",
        hint: "试探谈条件",
        apply: function (st) {
          if (Math.random() < 0.5) {
            var earned2 = 100 + Math.floor(Math.random() * 50);
            st.resources.cash += earned2;
            st.resources.totalEarned += earned2;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 20);
            StateManager.addMessage("💬 对方同意试做一晚，你赚了¥" + earned2 + "，没耗太多精力。", "success");
          } else {
            StateManager.addMessage("💬 对方说要长期干才要，你婉拒了。", "info");
          }
        },
      },
    ],
  },

  {
    id: "expensive_phone_found",
    phase: "street",
    icon: "📲",
    title: "路边捡到一部高端手机",
    story: "你在公交站椅子下发现一部崭新旗舰手机，锁屏是一对老夫妻和孙子的合影。附近几乎没人。",
    conditions: function (st) {
      return st.player.phase === "street";
    },
    choices: [
      {
        text: "📞 等失主，或交给警察",
        hint: "拾金不昧",
        apply: function (st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 15);
          st.status.fame = Math.min(100, st.status.fame + 8);
          if (Math.random() < 0.6) {
            var reward = 200 + Math.floor(Math.random() * 300);
            st.resources.cash += reward;
            StateManager.addMessage("📞 失主找来了，感激地塞给你¥" + reward + " 酬谢。良心无价，名气+8。", "success");
          } else {
            StateManager.addMessage("📞 手机还给了失主，对方道谢就走了没给钱。但你心里踏实，名气+8。", "success");
          }
          st.flags._everReturnedPhone = true;
        },
      },
      {
        text: "💰 卖给二手机商",
        hint: "换现金",
        apply: function (st) {
          var earn = 600 + Math.floor(Math.random() * 400);
          st.resources.cash += earn;
          st.resources.totalEarned += earn;
          st.needs.happiness = Math.max(0, st.needs.happiness - 12);
          StateManager.addMessage("💰 卖了¥" + earn + "。但那张锁屏合影的眼神你忘不掉。", "warning");
        },
      },
      {
        text: "📲 先找联系人再决定",
        hint: "人性化处理",
        apply: function (st) {
          st.player.intelligence = Math.min(100, st.player.intelligence + 0.5);
          var rewardB = 100 + Math.floor(Math.random() * 200);
          st.resources.cash += rewardB;
          st.resources.totalEarned += rewardB;
          st.status.fame = Math.min(100, st.status.fame + 4);
          StateManager.addMessage("📲 找到紧急联系人，家属赶来给了¥" + rewardB + " 感谢。名气+4。", "success");
        },
      },
    ],
  },

  {
    id: "volunteer_event",
    phase: "street",
    icon: "🤝",
    title: "社区招募志愿者",
    story: "街道办在门口贴了公告，招募周末社区义务清扫志愿者，完成可获荣誉证书，在本地求职有加分。",
    conditions: function (st) {
      return st.player.phase === "street" && st.player.day % 7 === 0;
    },
    choices: [
      {
        text: "🧹 参加！积累社会形象",
        hint: "名气+幸福感",
        apply: function (st) {
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
          st.needs.happiness = Math.min(100, st.needs.happiness + 18);
          st.status.fame = Math.min(100, st.status.fame + 10);
          StateManager.addMessage("🤝 参加了社区打扫，认识了不少街坊邻居！名气+10，心情+18。", "success");
        },
      },
      {
        text: "⏰ 太忙了，等下次",
        hint: "理性权衡",
        apply: function (st) {
          StateManager.addMessage("⏰ 你记下了下次活动的时间，今天还有正事要做。", "info");
        },
      },
      {
        text: "📸 去打个卡拍照就走",
        hint: "刷存在感",
        apply: function (st) {
          st.status.fame = Math.min(100, st.status.fame + 3);
          st.needs.happiness = Math.max(0, st.needs.happiness - 3);
          StateManager.addMessage("📸 打了个卡拍了张照就溜走了。名气+3，但感觉有点空洞。", "info");
        },
      },
    ],
  },

  {
    id: "elderly_collapse",
    phase: "street",
    icon: "🚑",
    title: "路边老人突然倒地",
    story: "去工地路上，一个老大爷突然捂着胸口倒在路边。旁边路人大多驻足观望，没人敢上前——\"扶不扶\"的事大家都怕。",
    conditions: function (st) {
      return st.player.phase === "street";
    },
    choices: [
      {
        text: "🚑 立刻上前扶起，打120",
        hint: "救人第一",
        apply: function (st) {
          if (Math.random() < 0.2) {
            var cost = 200 + Math.floor(Math.random() * 200);
            if (st.resources.cash >= cost) st.resources.cash -= cost;
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage("🚑 老人救回来了！但家属误以为你是肇事者讹了你¥" + cost + "，后来路人作证才澄清。", "warning");
          } else {
            st.needs.happiness = Math.min(100, st.needs.happiness + 20);
            st.status.fame = Math.min(100, st.status.fame + 12);
            StateManager.addMessage("🚑 你帮老人撑住身体等来了救护车，家属感激涕零，名气+12！", "success");
          }
          st.flags._everHelpedElderly = true;
        },
      },
      {
        text: "📞 打120但不上前",
        hint: "帮忙不担责",
        apply: function (st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 8);
          st.status.fame = Math.min(100, st.status.fame + 5);
          StateManager.addMessage("📞 你打了120再守在远处，救护车来了。帮了忙也保护了自己，名气+5。", "info");
        },
      },
      {
        text: "🚶 快步走开，不惹麻烦",
        hint: "自保优先",
        apply: function (st) {
          st.needs.happiness = Math.max(0, st.needs.happiness - 15);
          StateManager.addMessage("🚶 你走了。那个画面在脑海中挥散不去，心情-15。", "warning");
        },
      },
    ],
  },

  // === 道德后果事件 — 过去的选择会被记住 ===
  {
    id: "coworker_payback",
    phase: "street",
    icon: "🤝",
    title: "工友老刘来还人情",
    story: "当年你不顾工头施压，帮工友老刘叫了救护车。今天他来找你，说他表弟在正规工程公司，手上有个活缺人……",
    conditions: function(st) {
      return st.player.phase === "street" && st.flags._helpedCoworker && st.player.day >= 30;
    },
    choices: [
      {
        text: "💪 接！认识新朋友",
        hint: "人情就是资本",
        apply: function(st) {
          var pay = 300 + Math.floor(Math.random() * 200);
          st.resources.cash += pay;
          st.resources.totalEarned += pay;
          st.player.physique = Math.min(100, st.player.physique + 2);
          st.status.fame = Math.min(100, st.status.fame + 5);
          StateManager.addMessage("🤝 老刘的表弟给了你一单活，干完赚了¥" + pay + "，还认识了不少工地朋友！体质+2，名气+5。", "success");
        },
      },
      {
        text: "🙏 谢谢，但我最近有事",
        hint: "婉拒但维持关系",
        apply: function(st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 8);
          StateManager.addMessage("🙏 婉拒了老刘，但他说下次还有机会。好人好报，心情不错。", "info");
        },
      },
    ],
  },

  {
    id: "wallet_karma",
    phase: "street",
    icon: "👛",
    title: "噩梦还是惊喜",
    story: "路上你听到身后有人喊你。一个陌生女人说她当时丢了钱包，到处找，最后从监控看到你捡走了……",
    conditions: function(st) {
      return st.player.phase === "street" && st.flags._keptWallet && st.player.day >= 15;
    },
    choices: [
      {
        text: "😰 坦白承认，还钱",
        hint: "归还钱包里的钱",
        apply: function(st) {
          var repaid = 100 + Math.floor(Math.random() * 80);
          st.resources.cash = Math.max(0, st.resources.cash - repaid);
          st.needs.happiness = Math.min(100, st.needs.happiness + 15);
          st.status.fame = Math.min(100, st.status.fame + 8);
          st.flags._keptWallet = false;
          StateManager.addMessage("😰 你道了歉、还了¥" + repaid + "，对方感谢你的诚实。心里反而轻了许多。心情+15，名气+8。", "success");
        },
      },
      {
        text: "😤 矢口否认",
        hint: "死不承认",
        apply: function(st) {
          st.needs.happiness = Math.max(0, st.needs.happiness - 20);
          st.status.fame = Math.max(0, st.status.fame - 10);
          StateManager.addMessage("😤 你否认了。她半信半疑地走了。心里像压了块石头，名气-10。", "warning");
        },
      },
    ],
  },

  {
    id: "integrity_reward",
    phase: "street",
    icon: "🌟",
    title: "信誉带来回报",
    story: "你拒绝假货、做生意讲诚信的事传开了。商业区的老板们私下讨论，说你这个人靠谱，有个批发商想跟你长期合作……",
    conditions: function(st) {
      return st.player.phase === "street" && st.flags._refusedFakeGoods && st.status.fame >= 20;
    },
    choices: [
      {
        text: "🤝 合作！建立长期供货关系",
        hint: "打开批发渠道",
        apply: function(st) {
          var bonus = 500 + Math.floor(Math.random() * 300);
          st.resources.cash += bonus;
          st.resources.totalEarned += bonus;
          st.status.fame = Math.min(100, st.status.fame + 10);
          st.flags._bulkSupplier = true;
          StateManager.addMessage("🤝 合作谈成了！批发商先给了¥" + bonus + "的预付款。你的诚信名声打出去了，名气+10。", "success");
        },
      },
      {
        text: "🤔 了解一下，不急于答应",
        hint: "谨慎观望",
        apply: function(st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 10);
          StateManager.addMessage("🤔 你说先考虑一下，对方表示理解，留了联系方式。机会还在。", "info");
        },
      },
    ],
  },

  {
    id: "labor_rights_recognition",
    phase: "street",
    icon: "⚖️",
    title: "劳动局表彰",
    story: "你上次举报欠薪的事情，劳动仲裁中心记了档。今天接到通知：你的案例被评为"维权先锋"，有奖励，也有记者想采访……",
    conditions: function(st) {
      return st.player.phase === "street" && st.flags._foughtWageTheft && st.player.day >= 20;
    },
    choices: [
      {
        text: "🎤 接受采访，公开发声",
        hint: "名气暴增，但会树敌",
        apply: function(st) {
          var award = 200 + Math.floor(Math.random() * 100);
          st.resources.cash += award;
          st.resources.totalEarned += award;
          st.status.fame = Math.min(100, st.status.fame + 18);
          st.needs.happiness = Math.min(100, st.needs.happiness + 15);
          StateManager.addMessage("🎤 采访播出了！你成了工友圈的红人，拿了¥" + award + "奖励，名气+18！有些工头不太高兴……", "success");
        },
      },
      {
        text: "🏆 领奖就好，不接受采访",
        hint: "低调处理",
        apply: function(st) {
          var award = 200 + Math.floor(Math.random() * 100);
          st.resources.cash += award;
          st.resources.totalEarned += award;
          st.status.fame = Math.min(100, st.status.fame + 8);
          st.needs.happiness = Math.min(100, st.needs.happiness + 10);
          StateManager.addMessage("🏆 低调领了奖金¥" + award + "和荣誉证书，名气+8。做了好事，心里踏实。", "success");
        },
      },
      {
        text: "🙅 放弃，别惹麻烦",
        hint: "多一事不如少一事",
        apply: function(st) {
          StateManager.addMessage("🙅 你婉拒了。这段经历只有你自己知道。", "info");
        },
      },
    ],
  },

  {
    id: "old_liu_info",
    phase: "street",
    icon: "📱",
    title: "工友老刘发来内部消息",
    story: "老刘微信说他在新工地发现包工头要跑路，三十几个工友的工资危了！他第一个想到你——那次你帮他的事他一直没忘。",
    conditions: function(st) {
      return st.player.phase === "street" && (st.flags._helpedCoworker || st.flags._foughtWageTheft) && st.player.day >= 25;
    },
    choices: [
      {
        text: "📣 帮忙组织工友维权",
        hint: "用你的经验帮大家",
        apply: function(st) {
          st.status.fame = Math.min(100, st.status.fame + 12);
          st.needs.happiness = Math.min(100, st.needs.happiness + 20);
          st.player.mental = Math.min(100, st.player.mental + 2);
          StateManager.addMessage("📣 你和老刘一起组织，工友们联名上报，成功阻止了包工头跑路。大家都感谢你，名气+12，心智+2！", "success");
        },
      },
      {
        text: "📋 帮忙收集证据，但不出头",
        hint: "背后出力",
        apply: function(st) {
          st.player.intelligence = Math.min(100, st.player.intelligence + 1);
          st.needs.happiness = Math.min(100, st.needs.happiness + 10);
          StateManager.addMessage("📋 你偷偷收集了包工头的逃跑证据交给老刘，工友们维权成功。智力+1，良心过得去。", "success");
        },
      },
      {
        text: "😶 告诉他我帮不上",
        hint: "事不关己",
        apply: function(st) {
          st.needs.happiness = Math.max(0, st.needs.happiness - 5);
          StateManager.addMessage("😶 你说你帮不上忙。老刘半天没回复。心里有点不是滋味。", "warning");
        },
      },
    ],
  },

  {
    id: "xiao_mei_tutoring_lead",
    phase: "street",
    icon: "📚",
    title: "小美给你介绍了家教单",
    story: "大学城的小美发消息说她有个朋友想给孩子找数学家教，她推荐了你。对方愿意付每小时¥80，一周两节。",
    conditions: function(st) {
      var rel = st.relationships && st.relationships['xiao_mei'];
      return st.player.phase === 'street' && rel && rel.affinity >= 30 && st.player.intelligence >= 30;
    },
    choices: [
      {
        text: "✅ 接单！智力变现",
        hint: "每周+¥160",
        apply: function(st) {
          const earned = 160 + Math.floor(Math.random() * 80);
          st.resources.cash += earned;
          st.resources.totalEarned += earned;
          st.skills.english && (st.skills.english.xp += 15);
          StateManager.addMessage('✅ 教了两节课，赚了 ¥' + earned + '！小美这个人脉太值了。', 'success');
        },
      },
      {
        text: "😅 推掉，感觉教不了",
        hint: "量力而行",
        apply: function(st) {
          StateManager.addMessage('😅 你说自己不太擅长，小美表示理解。下次努力提升智力。', 'info');
        },
      },
    ],
  },
];

/* =========================================================
 * 二、事件触发与队列管理
 * ========================================================= */

/** 街头每日事件判定 */
function rollStreetEvent(state) {
  // 基础 18% 触发率，已存在待弹事件时不重复触发
  if (state._pendingEvent) return;
  const baseChance = 0.18;
  // 健康差或债务高时提高触发率
  let mod = 0;
  if (state.status.health < 50) mod += 0.1;
  if (state.resources.debt > 3000) mod += 0.05;
  if (state.needs.happiness < 30) mod += 0.05;
  if (Math.random() < baseChance + mod) {
    queueRandomEvent(state, "street");
  }
}

/** 职场每日事件判定 */
function rollCorporateEvent(state) {
  if (state._pendingEvent) return;
  const baseChance = 0.22;
  let mod = 0;
  if (state.player.corporate.risk > 50) mod += 0.1;
  if (state.player.corporate.popularity < 30) mod += 0.05;
  if (state.player.corporate.upwardMgmt < 20) mod += 0.05;
  if (Math.random() < baseChance + mod) {
    queueRandomEvent(state, "corporate");
  }
}

/** 把一个随机事件塞进待弹队列 */
function queueRandomEvent(state, phase) {
  const pool = RANDOM_EVENTS.filter((e) => e.phase === phase);
  if (pool.length === 0) return;

  // 过滤掉不满足条件的事件
  const eligible = pool.filter((e) => !e.conditions || e.conditions(state));
  if (eligible.length === 0) return;

  const evt = eligible[Math.floor(Math.random() * eligible.length)];
  // 使用唯一事件ID替代引用比较，避免引用失效导致事件卡住
  state._pendingEvent = evt;
  state._pendingEventId = evt.id;
  // 触发延迟到 render 阶段弹（避免在 tick 内部阻塞）
  setTimeout(() => {
    const s = StateManager.getState();
    if (s._pendingEvent && s._pendingEventId === evt.id) {
      showEventModal(evt);
      if (typeof playSound === "function") playSound("event");
      // 不再自动关闭——玩家必须手动点击选择（游戏设计决定）
    }
  }, 50);
}

/* =========================================================
 * 三、事件弹窗 UI
 * ========================================================= */

/**
 * 渲染并展示一个事件模态框
 * @param {Object} evt - 事件对象
 */
function showEventModal(evt) {
  // 先卸掉任何旧弹窗
  document.querySelector(".modal-overlay")?.remove();

  // 构建选项HTML
  const choicesHtml = evt.choices
    .map((ch, i) => {
      const hintStr = ch.hint
        ? `<div class="choice-hint">${ch.hint}</div>`
        : "";
      // 检查现金是否够
      let disabled = false;
      if (ch.cost && StateManager.getState().resources.cash < ch.cost) {
        disabled = true;
      }
      const costTag = ch.cost
        ? ` <span style="color:var(--warning);font-size:11px;">需 ¥${ch.cost}</span>`
        : "";
      return `
        <button class="event-choice ${disabled ? "disabled" : ""}" data-idx="${i}" ${disabled ? "disabled" : ""}>
          <div class="choice-main">${ch.text}${costTag}</div>
          ${hintStr}
        </button>
      `;
    })
    .join("");

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay event-modal";
  overlay.innerHTML = `
    <div class="modal-box event-box">
      <div class="event-header">
        <div class="event-icon">${evt.icon}</div>
        <h2 class="event-title">${evt.title}</h2>
      </div>
      <p class="event-story">${evt.story}</p>
      <div class="event-choices">${choicesHtml}</div>
      <div style="text-align:center;margin-top:8px;font-size:10px;color:var(--accent);">
        ⚡ 请选择一个选项继续
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // 绑定选项点击
  overlay.querySelectorAll(".event-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx);
      const choice = evt.choices[idx];
      if (!choice) return;
      const state = StateManager.getState();
      try {
        if (typeof choice.apply === "function") {
          choice.apply(state);
        }
      } catch (e) {
        console.error("Event choice apply error:", e);
      }
      // 清掉待弹事件（三字段全部清理）
      state._pendingEvent = null;
      state._pendingEventId = null;
      // 关闭弹窗 + 重新渲染
      document.body.removeChild(overlay);
      renderAll();
    });
  });

  // 点击遮罩关闭也清理事件悬挂
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      const s = StateManager.getState();
      s._pendingEvent = null;
      s._pendingEventId = null;
      document.body.removeChild(overlay);
      renderAll();
    }
  });
}

/** 跳槽 offer 决策弹窗（被 corp_headhunter 事件调用） */
function showJobOfferModal() {
  const state = StateManager.getState();
  const offer = state.corporate.jobOffer;
  if (!offer) return;
  showModal({
    title: "💼 跳槽 Offer 决策",
    body: `
      <p>另一家公司开出了 <strong style="color:var(--success);">年薪 ¥${offer.salary.toLocaleString()}</strong> 的条件挖你！</p>
      <p style="font-size:12px;color:var(--text-secondary);">跳槽有风险：人缘归零、向上管理归零、KPI 减半、需重新建立关系。</p>
    `,
    buttons: [
      { text: "继续考虑", cls: "", callback: () => {} },
      {
        text: `接受 Offer (¥${offer.salary.toLocaleString()})`,
        cls: "btn-success",
        callback: () => {
          // 简化版：直接加钱 + 重置属性
          state.resources.cash += offer.salary;
          state.player.corporate.kpi = Math.max(
            0,
            state.player.corporate.kpi * 0.5,
          );
          state.player.corporate.popularity = Math.max(
            0,
            state.player.corporate.popularity - 30,
          );
          state.player.corporate.upwardMgmt = Math.max(
            0,
            state.player.corporate.upwardMgmt - 30,
          );
          state.corporate.jobOffer = null;
          StateManager.addMessage(
            `💼 接受了新公司的 offer，拿到 ¥${offer.salary.toLocaleString()} 签字费！`,
            "event",
          );
          renderAll();
        },
      },
    ],
  });
}

/* =========================================================
 * 四、兼容旧 API
 * ========================================================= */

/** 每日新闻判定（旧 API，保持兼容） */
function rollDailyNews(state) {
  // 街头阶段不再发广播新闻，改用事件弹窗
  if (state.player.phase === "street") {
    rollStreetEvent(state);
    return;
  }
  // 职场阶段：保留少量市场新闻 + 事件弹窗
  const newsChance = state.activeNews.length > 0 ? 0.05 : 0.12;
  if (Math.random() < newsChance) {
    const news = getRandomNewsEvent();
    if (news && !state.flags.seenNewsToday.includes(news.id)) {
      news._appliedDay = state.player.day;
      state.activeNews.push(news);
      state.flags.seenNewsToday.push(news.id);
      applyNewsEffect(news, state);
      StateManager.addMessage(`📰 ${news.headline}`, "event");
    }
  }
  // 职场事件
  rollCorporateEvent(state);
  // 清理今日已见新闻列表
  if (state.player.day % 3 === 0) {
    state.flags.seenNewsToday = [];
  }
}

/** 每日结束时的清理 */
function dailyCleanup(state) {
  cleanupExpiredNews(state);
}

/** 季度结束时的职场清理 */
function quarterlyCleanup(state) {
  // 占位（兼容旧调用）
}

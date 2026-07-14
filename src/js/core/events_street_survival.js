/**
 * 街头随机事件数据 — 生存/日常篇
 * 从 events_street.js 拆分。日堂生存相关事件。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._streetSurvivalLoaded) return;
  RANDOM_EVENTS._streetSurvivalLoaded = true;
  var EVENTS = [
    {
      id: "found_wallet_street",
      _isChainEvent: false,
      // [conditions→triggers]
      triggers: { minDay: 5 },
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
            const cash = Random.int(80, 279);
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
            st.player.fame = Math.min(100, st.player.fame + 3);
            st.flags._returnedWallet = true;
            StateManager.addMessage(
              "🏛️ 钱包交给了警察，警察夸你拾金不昧，心情大好！",
              "success",
            );
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "wallet_owner_finds_you", 3, "street");
            }
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
      // [conditions→triggers]
      triggers: { minCash: 50 },
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
            if (Random.chance(0.5 + (st.player.agility - 20) * 0.02)) {
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
            if (Random.chance(0.4)) {
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
      _isChainEvent: false,
      // [conditions→triggers]
      triggers: { minDay: 15, minCash: 300 },
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
            if (Random.chance(0.4)) {
              const profit = Random.int(300, 699);
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
            st.player.fame = Math.min(100, st.player.fame + 5);
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
      _isChainEvent: false,
      // [conditions→triggers]
      triggers: { minDay: 3 },
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
            if (Random.chance(0.5)) {
              const reward = Random.int(50, 129);
              st.resources.cash += reward;
              st.player.fame = Math.min(100, st.player.fame + 2);
              st.needs.happiness = Math.min(100, st.needs.happiness + 10);
              // 类似老周的性格，帮忙后老周好感微量提升
              if (st.relationships && st.relationships["old_zhou"]) {
                st.relationships["old_zhou"].affinity = Math.min(
                  100,
                  st.relationships["old_zhou"].affinity + 1,
                );
              }
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
      id: "free_clinic_street",
      _isChainEvent: false,
      // [已审查] 含 OR 逻辑（day≥10 || health≤70），保留 conditions 不变
      conditions: function (st) {
        // [自洽修复] st.needs.health 不存在（state.needs 无 health 字段），改为 st.status.health
        return (
          st.player.day >= 10 || ((st.status && st.status.health) || 100) <= 70
        );
      },
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
      _isChainEvent: false,
      // [conditions→triggers]
      triggers: { minDay: 20, minCash: 100 },
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
            const key = Random.fromArray(skills);
            st.skills[key].xp += Random.int(40, 69);
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
      _isChainEvent: false,
      // [已审查] 含 OR 逻辑（fame>=3 || corporate.popularity>=10），保留 conditions 不变
      conditions: function (st) {
        return (
          st.player.day >= 10 &&
          ((st.player.fame || 0) >= 3 ||
            (st.player.corporate && st.player.corporate.popularity >= 10))
        );
      },
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
            if (Random.chance(0.4 + (st.player.intelligence - 20) * 0.02)) {
              st.needs.happiness = Math.min(100, st.needs.happiness + 10);
              st.player.fame = Math.min(100, st.player.fame + 3);
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
      _isChainEvent: false,
      // [conditions→triggers]
      triggers: { minDay: 5 },
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
            st.player.fame = Math.min(100, st.player.fame + 1);
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
            st.player.fame = Math.min(100, st.player.fame + 2);
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
    {
      id: "real_estate_rumour",
      phase: "street",
      // [全系统自洽修复] 域B 修复:链式根事件不应有_isChainEvent(否则永不被随机选中)
      _isChainEvent: false,
      icon: "🏗️",
      title: "楼盘烂尾传闻",
      story:
        "在城中村听到几个工友议论，说城郊那个新楼盘'锦绣豪庭'开发商资金链断了，可能要烂尾。不少购房者已经交了首付。有人说开发商正在秘密转让项目。",
      choices: [
        {
          text: "👂 多打听点消息 (花¥30请人吃饭)",
          hint: "需要情报",
          cost: 30,
          apply: (st) => {
            if (st.resources.cash < 30) {
              StateManager.addMessage("👂 钱不够，先攒点再说。", "warning");
              return;
            }
            st.resources.cash -= 30;
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            // 调度后续事件：内幕消息
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "real_estate_insider", 2, "street");
            }
            StateManager.addMessage(
              "👂 请几个工友吃了顿饭，他们透露：开发商老板已经出国了，项目可能被低价转让。",
              "info",
            );
          },
        },
        {
          text: "🏠 去看看楼盘情况",
          hint: "实地考察",
          apply: (st) => {
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 8);
            st.needs.happiness = Math.min(100, st.needs.happiness + 2);
            // 直接调度后续事件
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "real_estate_insider", 3, "street");
            }
            StateManager.addMessage(
              "🏠 去工地转了一圈，确实停工了，几个保安说开发商已经两个月没发工资。",
              "info",
            );
          },
        },
        {
          text: "🚶 关我啥事，走人",
          hint: "明哲保身",
          apply: (st) => {
            StateManager.addMessage(
              "🚶 你摇摇头走开了。房地产的事太复杂，还是不掺和。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "real_estate_insider",
      phase: "street",
      _isChainEvent: true,
      icon: "🎲",
      title: "内幕消息：赌局来了",
      story:
        "一个自称是开发商前财务的人找到你，说他知道一个内幕：项目下周会被一家小房企低价收购，收购消息一旦公布，相关股票会暴涨。他让你帮忙凑钱买股票，事成之后分你三成利润。但风险是：如果消息是假的，或者收购失败，钱就全砸里面了。对方要求你至少投入¥2000。",
      choices: [
        {
          text: "💰 全押进去 (¥2000+)",
          hint: "高风险高回报",
          cost: 2000,
          apply: (st) => {
            if (st.resources.cash < 2000) {
              StateManager.addMessage(
                "💰 现金不足2000，只能遗憾错过。",
                "warning",
              );
              return;
            }
            st.resources.cash -= 2000;
            // 60% 概率成功：收购消息公布，股票翻倍
            // 40% 概率失败：消息是假的/收购失败
            const success = Random.chance(0.6);
            if (success) {
              const profit = Random.int(2500, 3999);
              st.resources.cash += profit;
              st.player.fame = Math.min(100, st.player.fame + 5);
              st.needs.happiness = Math.min(100, st.needs.happiness + 15);
              // 标记已参与赌局成功
              st.flags._realEstateGambleWon = true;
              StateManager.addMessage(
                `💰 收购消息公布，股票暴涨！你赚了 ¥${profit - 2000}！这内幕消息真准！`,
                "success",
              );
              // 调度后续：财富膨胀的代价
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(
                  st,
                  "real_estate_aftermath_win",
                  5,
                  "street",
                );
              }
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 20);
              st.player.mental = Math.max(0, st.player.mental - 8);
              st.flags._realEstateGambleLost = true;
              StateManager.addMessage(
                "💰 收购泡汤了！消息是假的，2000块全砸里面了。那财务也不见了...",
                "danger",
              );
              // 调度后续：赌局失败的后果
              if (typeof scheduleChainEvent === "function") {
                scheduleChainEvent(
                  st,
                  "real_estate_aftermath_lose",
                  5,
                  "street",
                );
              }
            }
          },
        },
        {
          text: "💵 小试牛刀 (¥500)",
          hint: "留条后路",
          cost: 500,
          apply: (st) => {
            if (st.resources.cash < 500) {
              StateManager.addMessage("💵 钱不够！", "warning");
              return;
            }
            st.resources.cash -= 500;
            const success = Random.chance(0.6);
            if (success) {
              const profit = Random.int(700, 1199);
              st.resources.cash += profit;
              st.needs.happiness = Math.min(100, st.needs.happiness + 8);
              st.flags._realEstateGambleWon = true;
              StateManager.addMessage(
                `💰 赌对了！小赚 ¥${profit - 500}，虽然不多但心里踏实。`,
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 8);
              st.flags._realEstateGambleLost = true;
              StateManager.addMessage(
                "💰 消息是假的，500块打了水漂。还好没全押上。",
                "warning",
              );
            }
          },
        },
        {
          text: "🚫 拒绝，太危险了",
          hint: "远离赌博",
          apply: (st) => {
            st.needs.happiness = Math.min(100, st.needs.happiness + 2);
            st.player.mental = Math.min(100, st.player.mental + 3);
            st.flags._realEstateGambleRefused = true;
            StateManager.addMessage(
              "🚫 你拒绝了。这种内幕交易不靠谱，还是踏实赚钱更安心。",
              "success",
            );
            // 道德选择：获得声誉
            if (typeof calculateReputationBadges === "function") {
              st._reputationPendingRecompute = true;
            }
          },
        },
      ],
    },
    {
      id: "real_estate_aftermath_win",
      phase: "street",
      _isChainEvent: true,
      icon: "😰",
      title: "财不外露：麻烦来了",
      story:
        "那笔横财让你在小圈子里出了名。几天后，几个陌生人在城中村堵住了你，说知道你'有门路'，想让你带他们一起投资。语气不太友善。",
      choices: [
        {
          text: "💸 破财消灾 (给¥300)",
          hint: "花钱买平安",
          cost: 300,
          apply: (st) => {
            st.resources.cash = Math.max(0, st.resources.cash - 300);
            st.needs.happiness = Math.max(0, st.needs.happiness - 10);
            StateManager.addMessage(
              "💸 给了300块，他们才放你走。心里窝火，但平安最重要。",
              "warning",
            );
          },
        },
        {
          text: "👊 硬刚回去",
          hint: "看体质",
          apply: (st) => {
            const win = Random.chance(0.3 + (st.player.physique - 20) * 0.02);
            if (win) {
              st.needs.happiness = Math.min(100, st.needs.happiness + 5);
              st.player.fame = Math.min(100, st.player.fame + 3);
              StateManager.addMessage(
                "👊 你硬气地怼了回去，他们看你不好惹，骂骂咧咧走了。",
                "success",
              );
            } else {
              st.status.injured = true;
              st.status.health = Math.max(0, st.status.health - 15);
              st.resources.cash = Math.max(0, st.resources.cash - 200);
              StateManager.addMessage(
                "👊 硬刚失败了！挨了顿揍，还被抢了200块...",
                "danger",
              );
            }
          },
        },
        {
          text: "🚔 报警",
          hint: "走正规渠道",
          apply: (st) => {
            st.player.fame = Math.min(100, st.player.fame + 4);
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            StateManager.addMessage(
              "🚔 警察来了，把那几个混混带走了。这次运气不错。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "real_estate_aftermath_lose",
      phase: "street",
      _isChainEvent: true,
      icon: "😞",
      title: "赌输之后的烂摊子",
      story:
        "那笔钱本来是你准备还村长的。现在不仅没还上，还亏了不少。村长那边催债的电话又来了，语气越来越不耐烦。同时你发现那个'财务'早就消失了。",
      choices: [
        {
          text: "😔 硬着头皮去借",
          hint: "借新还旧",
          apply: (st) => {
            // 借高利贷
            const borrow = 1000;
            st.resources.cash += borrow;
            st.resources.villageDebt = (st.resources.villageDebt || 0) + borrow;
            st.needs.happiness = Math.max(0, st.needs.happiness - 12);
            st.player.mental = Math.max(0, st.player.mental - 5);
            StateManager.addMessage(
              `😔 只能再借 ¥${borrow}应急，债务雪上加霜...`,
              "danger",
            );
          },
        },
        {
          text: "💪 多打几份工补回来",
          hint: "勤劳致富",
          apply: (st) => {
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            // 当天额外收入
            const extra = Random.int(30, 69);
            st.resources.cash += extra;
            st.resources.totalEarned += extra;
            StateManager.addMessage(
              `💪 多干了几小时活，赚了 ¥${extra}。慢慢来，总能补回来。`,
              "info",
            );
          },
        },
        {
          text: "😤 跟村长求情延期",
          hint: "看面子",
          apply: (st) => {
            const success = Random.chance(0.3 + st.player.fame * 0.01);
            if (success) {
              st.needs.happiness = Math.min(100, st.needs.happiness + 5);
              StateManager.addMessage(
                "😤 村长看在你平时的面子上，同意宽限一个月。暂时松了口气。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 8);
              st.player.mental = Math.max(0, st.player.mental - 3);
              StateManager.addMessage(
                "😤 村长不松口，说下个月必须还。心里更焦虑了。",
                "warning",
              );
            }
          },
        },
      ],
    },
    {
      id: "market_crash_news",
      phase: "street",
      icon: "📉",
      title: "突发利空！股市暴跌",
      story:
        "手机上弹出新闻：受国际局势影响，全球股市暴跌7%！所有人都在恐慌性抛售。你现在持有投资资产吗？",
      // [conditions→triggers] 已审查：复杂条件（inv.stockHoldings.length>0）保留
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
                if (m && h.shares > 0) total += m.price * h.shares;
                // [全系统自洽修复] 域B 修复:market_crash_news 清仓时 h.shares=0 导致 NaN 除零崩溃
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
            var buyAmt = Random.int(500, 1999);
            if (st.resources.cash >= buyAmt) {
              st.resources.cash -= buyAmt;
              st.needs.happiness = Math.max(0, st.needs.happiness - 10);
              StateManager.addMessage(
                "💰 拿出¥" +
                  buyAmt +
                  "进场抄底！是勇士还是韭菜只能让时间验证。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "💰 想抄底但没钱，只能干看着。",
                "warning",
              );
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
      // [conditions→triggers] + [全系统自洽修复] 域B A类#4: location 非 evaluateTriggers 支持字段，改 conditions 函数
      triggers: { minCash: 1000 },
      conditions: function (st) {
        return st.trade && st.trade.currentLocation === "wholesaleMarket";
      },
      choices: [
        {
          text: "📦 全部吃下(¥800)",
          hint: "转手能赚",
          cost: 800,
          apply: function (st) {
            st.resources.cash -= 800;
            var goods = ["electronics", "daily_use", "clothing", "beer"];
            var g = Random.fromArray(goods);
            var qty = Random.int(10, 29);
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
      _isChainEvent: false,
      // [conditions→triggers]
      triggers: { minDay: 15, minCash: 20 },
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
              if (Random.chance(0.15)) {
                var win = Random.int(200, 699);
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
              if (Random.chance(0.1)) {
                var win = Random.int(5000, 19999);
                st.resources.cash += win;
                st.needs.happiness = Math.min(100, st.needs.happiness + 30);
                StateManager.addMessage(
                  "🎰 中了¥" + win + "！激动到手抖！",
                  "success",
                );
              } else if (Random.chance(0.3)) {
                var win2 = Random.int(100, 499);
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
            StateManager.addMessage(
              "🚶 彩票本质是穷人税，不碰就对了。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "gold_surge",
      _isChainEvent: false,
      // [conditions→triggers]
      triggers: { minDay: 30 },
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
              StateManager.addMessage(
                "💰 没钱买黄金，错过一轮行情。",
                "warning",
              );
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
              if (Random.chance(0.4)) {
                st.status.sick = false;
                st.status.health = Math.min(100, st.status.health + 30);
                st.needs.happiness = Math.min(100, st.needs.happiness + 10);
                StateManager.addMessage(
                  "💊 偏方居然有效！病好了健康+30。",
                  "success",
                );
              } else {
                st.status.health = Math.max(0, st.status.health - 10);
                StateManager.addMessage(
                  "💊 假药！病情加重了健康-10。",
                  "danger",
                );
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
            StateManager.addMessage(
              "🏥 祖传偏方不可信。建议你去医院。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "hunger_begging",
      phase: "street",
      icon: "🍞",
      title: "饥饿中遇到好心人",
      story:
        "你实在饿得不行了。一位路过的阿姨看到你脸色不好，问你需不需要帮助。",
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
            st.player.fame = Math.min(100, st.player.fame - 2);
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
    {
      id: "bank_promo",
      phase: "street",
      icon: "🏦",
      title: "银行推销理财产品",
      story:
        "你走进银行，客户经理热情地推荐一款「稳赚不赔」的理财产品，年化收益号称8%。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.trade &&
          st.trade.currentLocation === "bank" &&
          st.resources.cash >= 500
        );
      },
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
      _isChainEvent: false,
      conditions: function (st) {
        return (
          st.player.day >= 40 &&
          (st.resources.cash || 0) >= 500 &&
          (st.player.intelligence || 0) >= 25 &&
          st.trade &&
          st.trade.currentLocation === "commercialDist"
        );
      },
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
              var skillScore =
                st.skills.sales.level + st.skills.management.level;
              if (Random.chance(0.2 + skillScore * 0.005)) {
                st.resources.cash += 50000;
                st.player.fame = Math.min(100, st.player.fame + 20);
                st.needs.happiness = Math.min(100, st.needs.happiness + 30);
                StateManager.addMessage(
                  "🏢 拿到了第一名！¥50,000到位+名气+20！",
                  "success",
                );
              } else {
                st.needs.happiness = Math.max(0, st.needs.happiness - 15);
                StateManager.addMessage(
                  "🏢 海选淘汰了。但收获了经验。",
                  "info",
                );
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
    {
      id: "fallen_elder",
      phase: "street",
      icon: "🧓",
      title: "老人摔倒了",
      story:
        "菜市场门口，一位老大爷摔倒在地，周围人都在看但没人上前。你要怎么做？",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.trade &&
          (st.trade.currentLocation === "vegetable_market" ||
            st.trade.currentLocation === "slum")
        );
      },
      choices: [
        {
          text: "🤝 立刻上前扶起",
          hint: "先扶再说",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            st.player.fame = Math.min(100, st.player.fame + 5);
            if (Random.chance(0.15)) {
              const fine = Random.int(300, 499);
              st.resources.cash = Math.max(0, st.resources.cash - fine);
              StateManager.addMessage(
                "🧓 你扶起了老人，对方家属却说你撞倒了他，赔了 ¥" +
                  fine +
                  "...心情极差。",
                "danger",
              );
              st.needs.happiness = Math.max(0, st.needs.happiness - 25);
            } else {
              StateManager.addMessage(
                "🧓 你扶起了老人，家属赶来道谢连连，周围人竖起大拇指。名气+5。",
                "success",
              );
            }
          },
        },
        {
          text: "📱 拍照留证后再扶",
          hint: "保护自己也帮人",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            st.player.fame = Math.min(100, st.player.fame + 2);
            StateManager.addMessage(
              "📱 拍下视频留证后扶起老人，理性与善意兼顾。",
              "success",
            );
          },
        },
        {
          text: "🚶 绕道走，不惹麻烦",
          hint: "自保优先",
          apply: function (st) {
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "🚶 你选择绕道走开，内心有些不安。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "coworker_injured",
      phase: "street",
      icon: "🩹",
      title: "工友在工地受伤了",
      story:
        '你的工友老刘从脚手架上摔下来，工头悄悄跟你说"别声张，私了了事，你多分200块"。老刘疼得直哼。',
      // [自洽修复] conditions 新增：建筑工地职业/地点/行动频次 检查
      conditions: function (st) {
        var hasConstruction =
          (st.employment &&
            st.employment.currentJob &&
            st.employment.currentJob.id === "manual_labor_construction") ||
          (st.trade && st.trade.currentLocation === "construction") ||
          (st.stats &&
            st.stats.actionFreq &&
            st.stats.actionFreq["manual_labor_construction"] > 0);
        return st.player.phase === "street" && hasConstruction;
      },
      choices: [
        {
          text: "💰 收钱保持沉默",
          hint: "拿200块",
          apply: function (st) {
            st.resources.cash += 200;
            st.needs.happiness = Math.max(0, st.needs.happiness - 18);
            if (st.relationships && st.relationships["boss_li"]) {
              st.relationships["boss_li"].affinity = Math.min(
                100,
                st.relationships["boss_li"].affinity + 10,
              );
            }
            StateManager.addMessage(
              "💰 你拿了200块，老刘被悄悄送回宿舍。你睡不着觉。",
              "warning",
            );
          },
        },
        {
          text: "🚑 坚持打120叫救护车",
          hint: "保护工友权益",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 20);
            st.player.fame = Math.min(100, st.player.fame + 8);
            st.flags._helpedCoworker = true;
            if (st.relationships && st.relationships["boss_li"]) {
              st.relationships["boss_li"].affinity = Math.max(
                -100,
                st.relationships["boss_li"].affinity - 20,
              );
            }
            StateManager.addMessage(
              "🚑 你拨打了120，工头大怒，但工友老刘感激涕零。良心无价。",
              "success",
            );
          },
        },
        {
          text: "😶 假装没看到，先去干活",
          hint: "明哲保身",
          apply: function (st) {
            st.needs.happiness = Math.max(0, st.needs.happiness - 10);
            StateManager.addMessage(
              "😶 你低头继续干活，那声哼叫一直在耳边回响。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "fake_goods",
      phase: "street",
      icon: "📦",
      title: "发现进了假货",
      story:
        "你从批发市场进了一批电子产品，摆摊时才发现全是山寨货。你手里还有20件，进货成本已经付了¥800。",
      // [自洽修复] conditions 新增：摆摊职业/副业/行动频次 检查
      conditions: function (st) {
        var hasStall =
          (st.employment &&
            st.employment.currentJob &&
            [
              "food_stall",
              "street_vending_food",
              "street_vending_goods",
            ].includes(st.employment.currentJob.id)) ||
          (st.sideHustle && st.sideHustle.type === "stall") ||
          (st.stats &&
            st.stats.actionFreq &&
            (st.stats.actionFreq["food_stall"] > 0 ||
              st.stats.actionFreq["start_business"] > 0));
        return (
          st.player.phase === "street" && st.resources.cash > 0 && hasStall
        );
      },
      choices: [
        {
          text: "😈 继续卖，买者自负",
          hint: "损失已发生，捞回来",
          apply: function (st) {
            const earned = Random.int(400, 699);
            st.resources.cash += earned;
            st.resources.totalEarned += earned;
            if (Random.chance(0.3)) {
              st.player.fame = Math.max(0, st.player.fame - 10);
              StateManager.addMessage(
                "😈 卖出去了，但被客户投诉，名气-10。赚了 ¥" + earned + "。",
                "warning",
              );
            } else {
              StateManager.addMessage(
                "😈 全部卖掉，没人发现。得了 ¥" + earned + "，但心知肚明。",
                "warning",
              );
            }
            st.needs.happiness = Math.max(0, st.needs.happiness - 8);
          },
        },
        {
          text: "🗑️ 全部销毁，认赔¥800",
          hint: "道德选择，损失惨重",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            st.player.fame = Math.min(100, st.player.fame + 5);
            st.flags._refusedFakeGoods = true;
            StateManager.addMessage(
              "🗑️ 你把假货全部扔掉，损失¥800。这钱是教训钱，名气+5。",
              "info",
            );
          },
        },
        {
          text: "↩️ 去找批发商理论退货",
          hint: "据理力争",
          apply: function (st) {
            if (Random.chance(0.5)) {
              const refund = Random.int(400, 599);
              st.resources.cash += refund;
              StateManager.addMessage(
                "↩️ 死缠烂打两小时，批发商退了 ¥" +
                  refund +
                  "。没全退，但争回了一半。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "↩️ 批发商耍赖说验货时没说不行，白跑了一趟，消耗了大半天行动力。",
                "warning",
              );
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
      story:
        '老家来的表哥说带你去听个"财富自由分享会"，说能月入过万。地址在郊区某酒店。',
      conditions: function (st) {
        return st.player.phase === "street";
      },
      choices: [
        {
          text: "🎪 去听听，搞不好是机会",
          hint: "好奇心驱使",
          apply: function (st) {
            const loss = Random.int(500, 999);
            if (st.resources.cash >= loss) {
              st.resources.cash -= loss;
              st.needs.happiness = Math.max(0, st.needs.happiness - 30);
              StateManager.addMessage(
                "🎪 进去才发现是传销！被骗去 ¥" +
                  loss +
                  "，好不容易找借口跑出来。",
                "danger",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 15);
              StateManager.addMessage(
                "🎪 他们嫌你穷让你走人了。心情很差，但也算逃过一劫。",
                "warning",
              );
            }
          },
        },
        {
          text: "🚫 直接拒绝，说有事",
          hint: "躲避风险",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage(
              "🚫 你找了个借口推掉了，表哥说你没格局。没事，格局不值500块。",
              "success",
            );
          },
        },
        {
          text: "🔍 上网先查一下这个公司",
          hint: "谨慎核实",
          apply: function (st) {
            st.player.intelligence = Math.min(
              100,
              st.player.intelligence + 0.5,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            StateManager.addMessage(
              "🔍 一搜就发现是传销机构，直接举报，还顺手提升了防骗意识。智力+0.5。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "wage_theft",
      phase: "street",
      icon: "💸",
      title: "老板拖欠工资",
      story:
        '干了半个月，工头说"年底一起结"。你知道这条街上好几个外来务工者都被拖欠过，年底往往人去楼空。',
      conditions: function (st) {
        return st.player.phase === "street";
      },
      choices: [
        {
          text: "⏳ 忍着等，年底再说",
          hint: "赌一把",
          apply: function (st) {
            if (Random.chance(0.45)) {
              StateManager.addMessage(
                "⏳ 年底工头跑路了。那两个月的工钱就这么没了。",
                "danger",
              );
              st.needs.happiness = Math.max(0, st.needs.happiness - 25);
            } else {
              const paid = Random.int(1200, 1999);
              st.resources.cash += paid;
              st.resources.totalEarned += paid;
              StateManager.addMessage(
                "⏳ 没想到工头真的年底结账，一次性给了 ¥" +
                  paid +
                  "，虚惊一场。",
                "success",
              );
            }
          },
        },
        {
          text: "🏛️ 去劳动局投诉",
          hint: "用法律维权",
          apply: function (st) {
            const recovered = Random.int(600, 999);
            st.resources.cash += recovered;
            st.resources.totalEarned += recovered;
            st.needs.happiness = Math.min(100, st.needs.happiness + 12);
            st.flags._foughtWageTheft = true;
            StateManager.addMessage(
              "🏛️ 劳动仲裁历时3周，追回了 ¥" +
                recovered +
                "，虽然没全追回，但出了口气。",
              "success",
            );
          },
        },
        {
          text: "📸 偷偷收集证据再行动",
          hint: "有备无患",
          apply: function (st) {
            st.player.intelligence = Math.min(100, st.player.intelligence + 1);
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage(
              "📸 你暗中留存了工资条和聊天记录。有准备的人不吃亏，智力+1。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "landlord_rent_hike",
      phase: "street",
      icon: "🏠",
      title: "房东突然涨租",
      story:
        '房东王大婶敲门说："下个月房租从300涨到500，不行就搬走。"你现在住的这里还算安全。',
      // [自洽修复] 叙事中直接称呼"王大婶"(aunt_wang)，conditions 必须校验已结识
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.housing.tier >= 1 &&
          st.relationships &&
          st.relationships.aunt_wang &&
          st.relationships.aunt_wang.met === true
        );
      },
      choices: [
        {
          text: "😤 讨价还价，争取少涨",
          hint: "谈判试试",
          apply: function (st) {
            if (st.skills.sales && st.skills.sales.level >= 10) {
              StateManager.addMessage(
                "😤 凭借你的销售口才，把涨幅砍到¥50，王大婶勉强答应了。",
                "success",
              );
            } else if (Random.chance(0.4)) {
              StateManager.addMessage(
                "😤 磨了半小时，王大婶松口涨¥100，妥协了。",
                "info",
              );
            } else {
              StateManager.addMessage(
                "😤 王大婶态度强硬，一分不让。只能接受¥200的涨价。",
                "warning",
              );
            }
            if (st.relationships && st.relationships["aunt_wang"]) {
              st.relationships["aunt_wang"].affinity = Math.max(
                -100,
                st.relationships["aunt_wang"].affinity - 5,
              );
            }
          },
        },
        {
          text: "✅ 直接同意，维持关系",
          hint: "花钱买安稳",
          apply: function (st) {
            if (st.relationships && st.relationships["aunt_wang"]) {
              st.relationships["aunt_wang"].affinity = Math.min(
                100,
                st.relationships["aunt_wang"].affinity + 8,
              );
            }
            StateManager.addMessage(
              "✅ 你爽快答应了，王大婶对你印象更好了。好感+8。",
              "success",
            );
          },
        },
        {
          text: "🏃 找机会搬走",
          hint: "另谋住处",
          apply: function (st) {
            st.housing.tier = Math.max(0, st.housing.tier - 1);
            st.needs.happiness = Math.max(0, st.needs.happiness - 10);
            StateManager.addMessage(
              "🏃 你搬去了更便宜的地方，条件差了点，但省了钱。住所降级。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "street_talent_scout",
      phase: "street",
      icon: "🌟",
      title: "摆摊时被老板相中",
      story:
        "今天摆摊，一个穿着体面的中年女人在你摊位前停了很久，说她在一家公司负责采购，问你有没有兴趣合作供货。",
      // [自洽修复] conditions 新增：摆摊职业/副业/行动频次 检查
      conditions: function (st) {
        var hasStall =
          (st.employment &&
            st.employment.currentJob &&
            [
              "food_stall",
              "street_vending_food",
              "street_vending_goods",
            ].includes(st.employment.currentJob.id)) ||
          (st.sideHustle && st.sideHustle.type === "stall") ||
          (st.stats &&
            st.stats.actionFreq &&
            (st.stats.actionFreq["food_stall"] > 0 ||
              st.stats.actionFreq["start_business"] > 0));
        return (
          st.player.phase === "street" &&
          (st.skills.sales ? st.skills.sales.level >= 5 : false) &&
          hasStall
        );
      },
      choices: [
        {
          text: "💼 留下联系方式深入谈",
          hint: "可能是机遇",
          apply: function (st) {
            if (Random.chance(0.6)) {
              const bonus = Random.int(800, 1999);
              st.resources.cash += bonus;
              st.resources.totalEarned += bonus;
              st.player.fame = Math.min(100, st.player.fame + 8);
              StateManager.addMessage(
                "💼 合作谈成！对方下了首批订单，进账 ¥" + bonus + "！名气+8。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "💼 谈了三天，最后对方说预算砍了，合作告吹。但认识了个人脉。",
                "info",
              );
            }
          },
        },
        {
          text: "🎯 专注眼前，摆摊为主",
          hint: "稳字当头",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            StateManager.addMessage(
              "🎯 你礼貌地拒绝了，专心摆好今天的摊。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "secondhand_phone",
      phase: "street",
      icon: "📱",
      title: "路边有人卖二手手机",
      story:
        "城中村路口有人摆了个二手手机摊，一部外观完好的安卓机，卖¥150，比正规店便宜多了。",
      conditions: function (st) {
        return st.player.phase === "street" && st.resources.cash >= 150;
      },
      choices: [
        {
          text: "📱 买下来，以后跑外卖用",
          hint: "投资装备",
          apply: function (st) {
            if (Random.chance(0.7)) {
              st.resources.cash -= 150;
              st.player.fame = Math.min(100, st.player.fame + 2);
              // smartphone 是 accessory 装备：装备到槽位（带品质）
              var phoneDef =
                typeof getItemById === "function"
                  ? getItemById("smartphone")
                  : null;
              if (!st.inventory.equipment) st.inventory.equipment = {};
              if (!st.inventory.equipmentInstances)
                st.inventory.equipmentInstances = {};
              if (st.inventory.equipment.accessory) {
                // 已有配件：按成交价折现（避免 actualPrice 套利）
                st.resources.cash += 150;
                st.resources.totalEarned += 150;
                StateManager.addMessage(
                  "📱 买到一部成色不错的手机，但你已有配件，转手卖了¥150。跑外卖的路仍敞开，名气+2。",
                  "success",
                );
              } else if (
                phoneDef &&
                typeof createEquipmentInstance === "function"
              ) {
                var phoneInst = createEquipmentInstance(phoneDef, "event", {
                  qualityWeights:
                    typeof QUALITY_WEIGHTS_BY_SOURCE !== "undefined"
                      ? QUALITY_WEIGHTS_BY_SOURCE.event
                      : null,
                });
                st.inventory.equipment.accessory = "smartphone";
                st.inventory.equipmentInstances.accessory = phoneInst;
                var qTag =
                  phoneInst.qualityName && phoneInst.qualityName !== "普通"
                    ? "「" + phoneInst.qualityName + "」"
                    : "";
                StateManager.addMessage(
                  "📱 买到一部" +
                    qTag +
                    "成色不错的手机，已装备！跑外卖的路敞开了，名气+2。",
                  "success",
                );
              } else {
                StateManager.addMessage(
                  "📱 手机买到了，跑外卖的路敞开了，名气+2。",
                  "success",
                );
              }
            } else {
              st.resources.cash -= 150;
              st.needs.happiness = Math.max(0, st.needs.happiness - 10);
              StateManager.addMessage(
                "📱 买回来发现是翻新机，主板有问题，修了¥50还是不稳定。买贵了。",
                "warning",
              );
            }
          },
        },
        {
          text: "🔍 要求当场测试再决定",
          hint: "谨慎些",
          apply: function (st) {
            st.player.intelligence = Math.min(
              100,
              st.player.intelligence + 0.3,
            );
            const price = Random.int(100, 179);
            st.resources.cash -= price;
            // smartphone 是 accessory 装备：装备到槽位（带品质）
            var phoneDef2 =
              typeof getItemById === "function"
                ? getItemById("smartphone")
                : null;
            if (!st.inventory.equipment) st.inventory.equipment = {};
            if (!st.inventory.equipmentInstances)
              st.inventory.equipmentInstances = {};
            if (st.inventory.equipment.accessory) {
              // 已有配件：按成交价折现
              st.resources.cash += price;
              st.resources.totalEarned += price;
              StateManager.addMessage(
                "🔍 你仔细测试了30分钟，砍价到¥" +
                  price +
                  "成交，没有暗病。但你已有配件，转手卖了¥" +
                  price +
                  "。",
                "success",
              );
            } else if (
              phoneDef2 &&
              typeof createEquipmentInstance === "function"
            ) {
              var phoneInst2 = createEquipmentInstance(phoneDef2, "event", {
                qualityWeights:
                  typeof QUALITY_WEIGHTS_BY_SOURCE !== "undefined"
                    ? QUALITY_WEIGHTS_BY_SOURCE.event
                    : null,
              });
              st.inventory.equipment.accessory = "smartphone";
              st.inventory.equipmentInstances.accessory = phoneInst2;
              var qTag2 =
                phoneInst2.qualityName && phoneInst2.qualityName !== "普通"
                  ? "「" + phoneInst2.qualityName + "」"
                  : "";
              StateManager.addMessage(
                "🔍 你仔细测试了30分钟，砍价到¥" +
                  price +
                  "成交，没有暗病。" +
                  qTag2 +
                  "手机已装备！",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🔍 你仔细测试了30分钟，砍价到¥" +
                  price +
                  "成交，没有暗病。手机已装备。",
                "success",
              );
            }
          },
        },
        {
          text: "❌ 不买，风险太大",
          hint: "安全第一",
          apply: function (st) {
            StateManager.addMessage(
              "❌ 你走开了。路边货靠不住，心里踏实一点。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "township_buddy",
      phase: "street",
      icon: "🤗",
      title: "遇到了老乡",
      story:
        "菜场里，有人叫你名字——是你们县的老周头的儿子小周，在城里打拼了三年，看起来过得还行。",
      // [全系统自洽修复] 域B 修复:叙事直呼"老周头"(old_zhou),conditions需校验已结识
      conditions: function (st) {
        if (st.player.phase !== "street") return false;
        if (
          !st.relationships ||
          !st.relationships.old_zhou ||
          !st.relationships.old_zhou.met
        )
          return false;
        return true;
      },
      choices: [
        {
          text: "🍺 请他喝瓶啤酒叙旧",
          hint: "¥10 维系人脉",
          apply: function (st) {
            if (st.resources.cash >= 10) {
              st.resources.cash -= 10;
              st.needs.happiness = Math.min(100, st.needs.happiness + 20);
              const tip = Random.float(0, 1);
              if (tip < 0.4) {
                const cash = Random.int(200, 499);
                st.resources.cash += cash;
                StateManager.addMessage(
                  "🤗 聊得投机，他给你介绍了个短期活，赚了 ¥" +
                    cash +
                    "！老乡最亲。",
                  "success",
                );
              } else {
                StateManager.addMessage(
                  "🤗 喝了啤酒聊了两小时，得到了不少城里生存的经验，心情+20。",
                  "success",
                );
              }
            } else {
              StateManager.addMessage(
                "🤗 连10块啤酒钱都拿不出，尴尬，老乡请你喝了，心里不是滋味。",
                "warning",
              );
              st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            }
          },
        },
        {
          text: "📞 加个微信，以后联系",
          hint: "不花钱建立联系",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            StateManager.addMessage(
              "📞 加了老乡联系方式，城里认识的人又多了一个。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "rainy_day_dilemma",
      phase: "street",
      icon: "🌧️",
      title: "暴雨来了，摊子怎么办",
      story:
        "下午突然电闪雷鸣，暴雨将至。你刚摆好的货还没收，跑一趟要20分钟。同时有个生意正谈到关键处。",
      // [自洽修复] conditions 新增：暴雨天气 检查 + 摆摊职业/副业/行动频次 检查
      conditions: function (st) {
        var isRainy =
          st.weather &&
          (st.weather.current === "rainy" || st.weather.current === "stormy");
        var hasStall =
          (st.employment &&
            st.employment.currentJob &&
            [
              "food_stall",
              "street_vending_food",
              "street_vending_goods",
            ].includes(st.employment.currentJob.id)) ||
          (st.sideHustle && st.sideHustle.type === "stall") ||
          (st.stats &&
            st.stats.actionFreq &&
            (st.stats.actionFreq["food_stall"] > 0 ||
              st.stats.actionFreq["start_business"] > 0));
        return st.player.phase === "street" && isRainy && hasStall;
      },
      choices: [
        {
          text: "🏃 扔下生意去收摊",
          hint: "保住货物",
          apply: function (st) {
            const saved = Random.int(100, 299);
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 12);
            st.needs.hygiene = Math.max(0, st.needs.hygiene - 10);
            StateManager.addMessage(
              "🏃 冒雨跑去收摊，淋成落汤鸡，保住了约 ¥" + saved + " 的货物。",
              "info",
            );
          },
        },
        {
          text: "💰 谈完生意再说",
          hint: "生意优先",
          apply: function (st) {
            if (Random.chance(0.5)) {
              const deal = Random.int(150, 349);
              st.resources.cash += deal;
              st.resources.totalEarned += deal;
              StateManager.addMessage(
                "💰 生意谈成了 ¥" + deal + "，但摊子淋湿了一半货，有得有失。",
                "warning",
              );
            } else {
              StateManager.addMessage(
                "💰 生意没谈拢，货也淋湿了。今天运气真差。",
                "danger",
              );
              st.needs.happiness = Math.max(0, st.needs.happiness - 15);
            }
          },
        },
        {
          text: "🏠 躲进附近店铺等雨停",
          hint: "保命要紧",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            StateManager.addMessage(
              "🏠 你躲进一家便利店，雨中喝了杯热茶，心情稍好。货丢了但没感冒。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "food_poisoning",
      phase: "street",
      icon: "🤢",
      title: "路边摊吃坏肚子了",
      story:
        "昨晚在夜市吃了碗牛杂，今早起来肚子一直不对劲。现在有工作要去，但感觉随时要跑厕所。",
      conditions: function (st) {
        return st.player.phase === "street";
      },
      choices: [
        {
          text: "💪 撑着去干活，不能误工",
          hint: "意志力胜过身体",
          apply: function (st) {
            st.status.sick = true;
            st.status.health = Math.max(0, st.status.health - 10);
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 20);
            StateManager.addMessage(
              "💪 你撑着上了工，干活效率极低，肚子疼了一整天。健康-10，疲劳+20。",
              "warning",
            );
          },
        },
        {
          text: "💊 去药店买点止泻药",
          hint: "¥15 解决问题",
          apply: function (st) {
            if (st.resources.cash >= 15) {
              st.resources.cash -= 15;
              st.status.health = Math.min(100, st.status.health + 5);
              StateManager.addMessage(
                "💊 买了止泻药，下午基本没事了。¥15 买健康很值。健康+5。",
                "success",
              );
            } else {
              st.status.sick = true;
              StateManager.addMessage(
                "💊 连15块药费都拿不出来...只能硬扛。",
                "danger",
              );
            }
          },
        },
        {
          text: "🛏️ 在家休息一天",
          hint: "休养恢复",
          apply: function (st) {
            st.needs.fatigue = Math.max(0, st.needs.fatigue - 20);
            st.status.health = Math.min(100, st.status.health + 8);
            st.needs.hunger = Math.max(0, st.needs.hunger - 15);
            StateManager.addMessage(
              "🛏️ 睡了一天，肠胃好多了。少干了一天活，但恢复了精力。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "market_clearance_police",
      phase: "street",
      icon: "🚨",
      title: "城管大规模清理行动",
      story:
        '政府最近出通知要"整治市容"，街头管得更严了。据说明天会有大规模清查，抓到无证经营的罚款¥1000起。',
      // [全系统自洽修复] 域B 修复:城管清理事件无摆摊/职业条件检查→任何街头玩家都会触发，与叙事不符。添加摆摊/贸易相关条件。
      conditions: function (st) {
        var hasTrade =
          (st.trade &&
            st.trade.currentLocation &&
            st.trade.currentLocation !== "home") ||
          (st.sideHustle && st.sideHustle.active) ||
          (st.employment &&
            st.employment.currentJob &&
            [
              "food_stall",
              "street_vending_food",
              "street_vending_goods",
            ].includes(st.employment.currentJob.id));
        return st.player.phase === "street" && hasTrade;
      },
      choices: [
        {
          text: "📋 花¥200办个临时许可证",
          hint: "正规化应对",
          apply: function (st) {
            if (st.resources.cash >= 200) {
              st.resources.cash -= 200;
              st.player.fame = Math.min(100, st.player.fame + 3);
              StateManager.addMessage(
                "📋 花¥200办了临时证，城管来了直接亮证件，没事。名气+3。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "📋 凑不出¥200，只能另想办法。",
                "warning",
              );
            }
          },
        },
        {
          text: "🤝 打听消息，提前和城管疏通",
          hint: "走关系",
          apply: function (st) {
            const bribe = Random.int(100, 199);
            if (st.resources.cash >= bribe) {
              st.resources.cash -= bribe;
              if (st.chengguan)
                st.chengguan.heat = Math.max(0, st.chengguan.heat - 30);
              StateManager.addMessage(
                "🤝 花了 ¥" + bribe + " 疏通关系，城管对你睁一只眼闭一只眼。",
                "warning",
              );
            } else {
              StateManager.addMessage(
                "🤝 没够疏通的钱，只能祈祷了。",
                "warning",
              );
            }
          },
        },
        {
          text: "🏃 临时转移阵地，躲几天",
          hint: "惹不起躲得起",
          apply: function (st) {
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            if (st.chengguan)
              st.chengguan.heat = Math.max(0, st.chengguan.heat - 20);
            StateManager.addMessage(
              "🏃 你临时把摊子挪到了僻静处，躲过了这波清查，少赚了两天钱。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "aunt_wang_job_tip",
      phase: "street",
      icon: "👩",
      title: "王大婶介绍了个活",
      story:
        '房东王大婶敲门说："我侄子家装修，需要个会刷墙的人，管饭，300块一天，你去不去？"',
      // [自洽修复] 新增：aunt_wang 关系 met 检查（story 直呼"王大婶"，需已结识）
      conditions: function (st) {
        var rel = st.relationships && st.relationships["aunt_wang"];
        // [自洽修复] 检查 met 字段（直呼已定义NPC名需已结识）
        if (!rel || !rel.met) return false;
        return (
          st.player.phase === "street" &&
          rel.affinity >= 20 &&
          (st.housing.tier || 0) >= 1
        );
      },
      choices: [
        {
          text: "👍 去！一天300值了",
          hint: "抓住机会",
          apply: function (st) {
            const earned = Random.int(250, 399);
            st.resources.cash += earned;
            st.resources.totalEarned += earned;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 30);
            st.needs.hygiene = Math.max(0, st.needs.hygiene - 15);
            if (st.relationships && st.relationships["aunt_wang"]) {
              st.relationships["aunt_wang"].affinity = Math.min(
                100,
                st.relationships["aunt_wang"].affinity + 5,
              );
            }
            StateManager.addMessage(
              "👍 刷了一天墙，累但收获 ¥" + earned + "，王大婶更器重你了。",
              "success",
            );
          },
        },
        {
          text: "❌ 推掉，有别的安排",
          hint: "婉拒",
          apply: function (st) {
            if (st.relationships && st.relationships["aunt_wang"]) {
              st.relationships["aunt_wang"].affinity = Math.max(
                -100,
                st.relationships["aunt_wang"].affinity - 3,
              );
            }
            StateManager.addMessage("❌ 你婉拒了王大婶，她有点失望。", "info");
          },
        },
      ],
    },
    {
      id: "boss_li_bonus",
      phase: "street",
      icon: "🔨",
      title: "李工头发了奖金",
      story:
        "李工头难得开心，说这个月工程提前完工，要给干活积极的人发奖金。你和他的关系决定你能拿多少。",
      // [自洽修复] 新增：boss_li 关系 met 检查（story 直呼"李工头"，需已结识）
      conditions: function (st) {
        var rel = st.relationships && st.relationships["boss_li"];
        // [自洽修复] 检查 met 字段（直呼已定义NPC名需已结识）
        if (!rel || !rel.met) return false;
        return st.player.phase === "street" && rel.affinity >= 10;
      },
      choices: [
        {
          text: "🎉 站出来，你一直很努力",
          hint: "争取奖金",
          apply: function (st) {
            var affinity =
              st.relationships && st.relationships["boss_li"]
                ? st.relationships["boss_li"].affinity
                : 0;
            var bonus =
              affinity >= 50
                ? Random.int(500, 799)
                : affinity >= 20
                  ? Random.int(200, 399)
                  : Random.int(50, 149);
            st.resources.cash += bonus;
            st.resources.totalEarned += bonus;
            StateManager.addMessage(
              "🎉 根据你和工头的关系，拿到了奖金 ¥" + bonus + "！",
              "success",
            );
          },
        },
        {
          text: "😌 低调，不争",
          hint: "随缘",
          apply: function (st) {
            const small = Random.int(50, 129);
            st.resources.cash += small;
            st.resources.totalEarned += small;
            StateManager.addMessage(
              "😌 工头随手给了你 ¥" + small + " 红包，低调也有收获。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "dorm_theft",
      phase: "street",
      icon: "🔑",
      title: "宿舍里发生了失窃",
      story:
        "合租的宿舍有人丢了¥300现金，室友们互相猜疑。你有点印象，昨天看到一个平时鬼鬼祟祟的人进过那屋。",
      conditions: function (st) {
        return st.player.phase === "street" && (st.housing.tier || 0) >= 1;
      },
      choices: [
        {
          text: "🗣️ 说出你看到的情况",
          hint: "仗义执言",
          apply: function (st) {
            if (Random.chance(0.6)) {
              st.player.fame = Math.min(100, st.player.fame + 5);
              st.needs.happiness = Math.min(100, st.needs.happiness + 8);
              StateManager.addMessage(
                "🗣️ 你提供了线索，失主追回了钱，大家都说你讲义气，名气+5。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 5);
              StateManager.addMessage(
                "🗣️ 你说了，但嫌疑人矢口否认，搞得大家都尴尬，没结果。",
                "warning",
              );
            }
          },
        },
        {
          text: "🤐 不关我事，沉默",
          hint: "明哲保身",
          apply: function (st) {
            st.needs.happiness = Math.max(0, st.needs.happiness - 8);
            StateManager.addMessage(
              "🤐 你选择沉默，这件事就这么算了。心里有点不是滋味。",
              "info",
            );
          },
        },
        {
          text: "🚔 去跟楼管反映",
          hint: "走正规途径",
          apply: function (st) {
            st.player.mental = Math.min(100, st.player.mental + 2);
            StateManager.addMessage(
              "🚔 你找了楼管，装了监控，宿舍氛围变好了，心智+2。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "homeless_bag_theft",
      phase: "street",
      icon: "🎒",
      title: "桥洞下的背包被翻动了",
      story:
        "早上醒来，你放在桥洞下的背包被人翻过了。幸好现金还藏在鞋底的暗格里，但一些零碎物品不见了——包括那件冬天用来挡风的旧外套。周围几个同样露宿的人都在互相打量。",
      conditions: function (st) {
        return st.player.phase === "street" && (st.housing.tier || 0) === 0;
      },
      choices: [
        {
          text: "👀 盯着那个可疑的人",
          hint: "对峙试试",
          apply: function (st) {
            if (st.player.agility >= 25 || st.player.physique >= 30) {
              st.player.fame = Math.min(100, st.player.fame + 2);
              st.needs.happiness = Math.max(0, st.needs.happiness - 3);
              StateManager.addMessage(
                "你死死盯着那个可疑的人，对方心虚地移开目光，没敢再靠近。虽然没找回东西，但震慑住了对方。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 10);
              StateManager.addMessage(
                "你对峙过去，对方反而冷笑一声：「看什么看？」周围人也没人帮你说话。只能忍了。",
                "warning",
              );
            }
          },
        },
        {
          text: "😮‍💨 算了，反正也没啥值钱的",
          hint: "自认倒霉",
          apply: function (st) {
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "你叹了口气，把剩下的东西收拾好。在这座城市，这种事每天都在发生。",
              "info",
            );
          },
        },
        {
          text: "🙏 问问其他人有没有看到",
          hint: "收集线索",
          apply: function (st) {
            if (Random.chance(0.4)) {
              st.needs.happiness = Math.max(0, st.needs.happiness - 2);
              StateManager.addMessage(
                "一个老流浪汉悄悄告诉你：「昨晚看到有个穿黑夹克的在你们那边转悠。」你记住了这个特征。",
                "info",
              );
            } else {
              StateManager.addMessage(
                "没人愿意开口。在这地方，多一事不如少一事。",
                "info",
              );
            }
          },
        },
      ],
    },
    {
      id: "homeless_rain_shelter",
      phase: "street",
      icon: "🌧️",
      title: "暴雨前的争夺",
      story:
        "天气预报说今晚有暴雨。你平时躲雨的那个桥洞位置，已经被另一个人占了。他看着你，你也看着他。雨还有两小时就到。",
      // [自洽修复] conditions 新增：暴雨天气 检查
      conditions: function (st) {
        var isRainy =
          st.weather &&
          (st.weather.current === "rainy" || st.weather.current === "stormy");
        return (
          st.player.phase === "street" &&
          (st.housing.tier || 0) === 0 &&
          isRainy
        );
      },
      choices: [
        {
          text: "🗣️ 商量轮流用",
          hint: "和平协商",
          apply: function (st) {
            if (st.player.mental >= 25 || st.player.fame >= 10) {
              st.needs.happiness = Math.min(100, st.needs.happiness + 5);
              st.needs.hygiene = Math.max(0, st.needs.hygiene - 5);
              StateManager.addMessage(
                "你们商量了一下，决定轮流守夜。虽然条件艰苦，但至少有人互相照应。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 5);
              st.needs.hygiene = Math.max(0, st.needs.hygiene - 15);
              StateManager.addMessage(
                "对方拒绝了。你只能在雨中找另一个更差的位置，浑身湿透地度过了一夜。",
                "warning",
              );
            }
          },
        },
        {
          text: "💪 直接占位置",
          hint: "强势争夺",
          apply: function (st) {
            if (st.player.physique >= 35) {
              st.needs.hygiene = Math.max(0, st.needs.hygiene - 5);
              st.player.fame = Math.max(0, st.player.fame - 2);
              StateManager.addMessage(
                "你凭体格优势占了位置，对方没敢吭声。但你注意到他离开时看你的眼神很冷。",
                "info",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 10);
              st.needs.hygiene = Math.max(0, st.needs.hygiene - 15);
              StateManager.addMessage(
                "你想抢位置，但对方也不示弱，两人推搡了几下，最后你还是没占到。淋了一夜雨。",
                "danger",
              );
            }
          },
        },
        {
          text: "🚶 去找其他地方躲雨",
          hint: "退一步",
          apply: function (st) {
            st.needs.hygiene = Math.max(0, st.needs.hygiene - 10);
            st.needs.happiness = Math.max(0, st.needs.happiness - 3);
            StateManager.addMessage(
              "你找了个24小时快餐店的角落躲了一夜。虽然不舒服，但至少没淋雨。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "homeless_food_charity",
      phase: "street",
      icon: "🍲",
      title: "慈善食堂今天排长队",
      story:
        "街角那家慈善食堂今天开门早，已经有十几个人在排队了。你肚子很饿，但排队至少要两小时。旁边有人小声说：「今天好像有肉。」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.housing.tier || 0) === 0 &&
          st.needs.hunger < 40
        );
      },
      choices: [
        {
          text: "🍲 排！有肉吃",
          hint: "花时间换食物",
          apply: function (st) {
            st.needs.hunger = Math.min(100, st.needs.hunger + 35);
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage(
              "排了两小时，终于吃上了一碗热腾腾的肉末面条。虽然环境嘈杂，但这顿饭让你感觉活过来了。饱腹+35，疲劳+15。",
              "success",
            );
          },
        },
        {
          text: "💰 花¥10买份快餐",
          hint: "花钱省时间",
          apply: function (st) {
            if (st.resources.cash >= 10) {
              st.resources.cash -= 10;
              st.needs.hunger = Math.min(100, st.needs.hunger + 25);
              st.needs.happiness = Math.min(100, st.needs.happiness + 2);
              StateManager.addMessage(
                "你在旁边的小摊买了份快餐，花了10块钱。虽然不如食堂的分量足，但省了两个小时。",
                "info",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 5);
              StateManager.addMessage(
                "你摸了摸口袋，连10块钱都没有。只能继续排队。",
                "warning",
              );
            }
          },
        },
        {
          text: "🚶 先去找点零工",
          hint: "赚钱优先",
          apply: function (st) {
            st.needs.hunger = Math.max(0, st.needs.hunger - 10);
            if (Random.chance(0.4)) {
              const earned = Random.int(20, 49);
              st.resources.cash += earned;
              st.needs.happiness = Math.min(100, st.needs.happiness + 3);
              StateManager.addMessage(
                "你找到个临时活，赚了¥" +
                  earned +
                  "。用其中10块钱买了快餐填肚子。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 5);
              StateManager.addMessage(
                "转了一圈没找到活。饿着肚子又回到了原地，慈善食堂的队已经散了一部分。",
                "warning",
              );
            }
          },
        },
      ],
    },
    {
      id: "homeless_security_check",
      phase: "street",
      icon: "👮",
      title: "城管清理露宿点",
      story:
        "早上醒来，几个城管正在挨个叫醒露宿的人：「这里不能住了，赶紧收拾东西走人！」你的东西还堆在桥洞下，还没整理好。",
      conditions: function (st) {
        return st.player.phase === "street" && (st.housing.tier || 0) === 0;
      },
      choices: [
        {
          text: "🏃 赶紧收拾跑",
          hint: "保住所",
          apply: function (st) {
            if (st.player.agility >= 25) {
              st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
              st.needs.hygiene = Math.max(0, st.needs.hygiene - 5);
              StateManager.addMessage(
                "你手脚麻利地收拾好东西，在城管过来前离开了。虽然狼狈，但东西都保住了。",
                "success",
              );
            } else {
              st.resources.cash = Math.max(0, st.resources.cash - 20);
              st.needs.happiness = Math.max(0, st.needs.happiness - 10);
              StateManager.addMessage(
                "你收拾得太慢，被城管没收了部分东西，还罚了20块。剩下的东西散落在地上。",
                "warning",
              );
            }
          },
        },
        {
          text: "🗣️ 求情说没地方去",
          hint: "试试软办法",
          apply: function (st) {
            if (st.player.mental >= 30 || st.player.age <= 22) {
              st.needs.happiness = Math.max(0, st.needs.happiness - 3);
              StateManager.addMessage(
                "你说明了情况，其中一个城管叹了口气：「前面公园那边管得松点，去那儿吧。」你逃过一劫。",
                "info",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 8);
              StateManager.addMessage(
                "城管说：「大家都没地方去，按规定办事。」你还是得离开。",
                "warning",
              );
            }
          },
        },
        {
          text: "😮‍💨 默默收拾，不抵抗",
          hint: "认命",
          apply: function (st) {
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "你默默收拾好所有东西，跟着人群离开了。桥洞再也不是你的临时住所了。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "night_shift_offer",
      phase: "street",
      icon: "🌙",
      title: "夜班搬运工机会",
      story:
        "货运站招夜班搬运工，12点到早上6点，时薪¥25，一晚能赚¥150，但白天就没法正常干活了。",
      maxCash: 50000,
      conditions: function (st) {
        return st.player.phase === "street" && st.needs.fatigue <= 60;
      },
      choices: [
        {
          text: "🌙 接！钱要紧",
          hint: "赚快钱",
          apply: function (st) {
            var earned = Random.int(120, 179);
            st.resources.cash += earned;
            st.resources.totalEarned += earned;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 40);
            st.status.health = Math.max(0, st.status.health - 8);
            StateManager.addMessage(
              "🌙 熬了一夜，赚了¥" +
                earned +
                "。白天走路都在飘，健康-8，疲劳+40。",
              "warning",
            );
          },
        },
        {
          text: "😴 不接，保证休息",
          hint: "长线考量",
          apply: function (st) {
            st.player.mental = Math.min(100, st.player.mental + 3);
            StateManager.addMessage(
              "😴 你克制住了短期诱惑，好好睡了一觉。细水长流，心智+3。",
              "info",
            );
          },
        },
        {
          text: "💬 问能不能做两三次就走",
          hint: "试探谈条件",
          apply: function (st) {
            if (Random.chance(0.5)) {
              var earned2 = Random.int(100, 149);
              st.resources.cash += earned2;
              st.resources.totalEarned += earned2;
              st.needs.fatigue = Math.min(100, st.needs.fatigue + 20);
              StateManager.addMessage(
                "💬 对方同意试做一晚，你赚了¥" + earned2 + "，没耗太多精力。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "💬 对方说要长期干才要，你婉拒了。",
                "info",
              );
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
      story:
        "你在公交站椅子下发现一部崭新旗舰手机，锁屏是一对老夫妻和孙子的合影。附近几乎没人。",
      conditions: function (st) {
        return st.player.phase === "street";
      },
      choices: [
        {
          text: "📞 等失主，或交给警察",
          hint: "拾金不昧",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            st.player.fame = Math.min(100, st.player.fame + 8);
            if (Random.chance(0.6)) {
              var reward = Random.int(200, 499);
              st.resources.cash += reward;
              StateManager.addMessage(
                "📞 失主找来了，感激地塞给你¥" +
                  reward +
                  " 酬谢。良心无价，名气+8。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "📞 手机还给了失主，对方道谢就走了没给钱。但你心里踏实，名气+8。",
                "success",
              );
            }
            st.flags._everReturnedPhone = true;
          },
        },
        {
          text: "💰 卖给二手机商",
          hint: "换现金",
          apply: function (st) {
            var earn = Random.int(600, 999);
            st.resources.cash += earn;
            st.resources.totalEarned += earn;
            st.needs.happiness = Math.max(0, st.needs.happiness - 12);
            StateManager.addMessage(
              "💰 卖了¥" + earn + "。但那张锁屏合影的眼神你忘不掉。",
              "warning",
            );
          },
        },
        {
          text: "📲 先找联系人再决定",
          hint: "人性化处理",
          apply: function (st) {
            st.player.intelligence = Math.min(
              100,
              st.player.intelligence + 0.5,
            );
            var rewardB = Random.int(100, 299);
            st.resources.cash += rewardB;
            st.resources.totalEarned += rewardB;
            st.player.fame = Math.min(100, st.player.fame + 4);
            StateManager.addMessage(
              "📲 找到紧急联系人，家属赶来给了¥" + rewardB + " 感谢。名气+4。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "volunteer_event",
      phase: "street",
      icon: "🤝",
      title: "社区招募志愿者",
      story:
        "街道办在门口贴了公告，招募周末社区义务清扫志愿者，完成可获荣誉证书，在本地求职有加分。",
      // [自洽修复] 添加 excludeFlags 防止无限重复触发（原代码每7天永久触发）
      triggers: { excludeFlags: ["_volunteerEventSeen"] },
      choices: [
        {
          text: "🧹 参加！积累社会形象",
          hint: "名气+幸福感",
          apply: function (st) {
            st.flags._volunteerEventSeen = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
            st.needs.happiness = Math.min(100, st.needs.happiness + 18);
            st.player.fame = Math.min(100, st.player.fame + 10);
            StateManager.addMessage(
              "🤝 参加了社区打扫，认识了不少街坊邻居！名气+10，心情+18。",
              "success",
            );
          },
        },
        {
          text: "⏰ 太忙了，等下次",
          hint: "理性权衡",
          apply: function (st) {
            StateManager.addMessage(
              "⏰ 你记下了下次活动的时间，今天还有正事要做。",
              "info",
            );
          },
        },
        {
          text: "📸 去打个卡拍照就走",
          hint: "刷存在感",
          apply: function (st) {
            st.player.fame = Math.min(100, st.player.fame + 3);
            st.needs.happiness = Math.max(0, st.needs.happiness - 3);
            StateManager.addMessage(
              "📸 打了个卡拍了张照就溜走了。名气+3，但感觉有点空洞。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "elderly_collapse",
      phase: "street",
      icon: "🚑",
      title: "路边老人突然倒地",
      story:
        '去工地路上，一个老大爷突然捂着胸口倒在路边。旁边路人大多驻足观望，没人敢上前——"扶不扶"的事大家都怕。',
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.trade &&
          st.trade.currentLocation === "construction"
        );
      },
      choices: [
        {
          text: "🚑 立刻上前扶起，打120",
          hint: "救人第一",
          apply: function (st) {
            if (Random.chance(0.2)) {
              var cost = Random.int(200, 399);
              if (st.resources.cash >= cost) st.resources.cash -= cost;
              st.needs.happiness = Math.max(0, st.needs.happiness - 5);
              StateManager.addMessage(
                "🚑 老人救回来了！但家属误以为你是肇事者讹了你¥" +
                  cost +
                  "，后来路人作证才澄清。",
                "warning",
              );
            } else {
              st.needs.happiness = Math.min(100, st.needs.happiness + 20);
              st.player.fame = Math.min(100, st.player.fame + 12);
              StateManager.addMessage(
                "🚑 你帮老人撑住身体等来了救护车，家属感激涕零，名气+12！",
                "success",
              );
            }
            st.flags._everHelpedElderly = true;
          },
        },
        {
          text: "📞 打120但不上前",
          hint: "帮忙不担责",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            st.player.fame = Math.min(100, st.player.fame + 5);
            StateManager.addMessage(
              "📞 你打了120再守在远处，救护车来了。帮了忙也保护了自己，名气+5。",
              "info",
            );
          },
        },
        {
          text: "🚶 快步走开，不惹麻烦",
          hint: "自保优先",
          apply: function (st) {
            st.needs.happiness = Math.max(0, st.needs.happiness - 15);
            StateManager.addMessage(
              "🚶 你走了。那个画面在脑海中挥散不去，心情-15。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "milestone_day30",
      phase: "street",
      icon: "📅",
      title: "一个月了",
      story:
        "不知不觉，你已经在这座城市漂了整整一个月。站在路边，望着来来往往的人群，你开始思考……接下来的路怎么走？",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day === 30 &&
          !st.flags._milestone30
        );
      },
      choices: [
        {
          text: "💪 继续努力搞钱，先还清债务",
          hint: "专注生存，攒本钱",
          apply: function (st) {
            st.flags._milestone30 = true;
            st.flags._milestone30Path = "money";
            st.resources.cash += 150;
            st.resources.totalEarned += 150;
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage(
              "💪 你认清了方向：先把村长那5500还上，再图其他。得到了额外¥150的坚持奖励。",
              "success",
            );
          },
        },
        {
          text: "📚 投资自己，学技能升值",
          hint: "长线思维，提升竞争力",
          apply: function (st) {
            st.flags._milestone30 = true;
            st.flags._milestone30Path = "skills";
            var skKeys = Object.keys(st.skills);
            skKeys.forEach(function (k) {
              st.skills[k].xp += 30;
            });
            st.player.intelligence = Math.min(100, st.player.intelligence + 2);
            StateManager.addMessage(
              "📚 你决定投资自己的未来。全部技能XP+30，智力+2！知识不会贬值。",
              "success",
            );
          },
        },
        {
          text: "🤝 扩展人脉，认识更多人",
          hint: "人脉是最好的资本",
          apply: function (st) {
            st.flags._milestone30 = true;
            st.flags._milestone30Path = "network";
            st.player.fame = Math.min(100, st.player.fame + 15);
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            if (typeof NPCS !== "undefined") {
              NPCS.forEach(function (npc) {
                if (!st.relationships[npc.id])
                  st.relationships[npc.id] = { affinity: 0, met: false };
                st.relationships[npc.id].met = true;
                st.relationships[npc.id].affinity = Math.min(
                  100,
                  st.relationships[npc.id].affinity + 5,
                );
              });
            }
            StateManager.addMessage(
              "🤝 你决定主动结识周围的人。所有NPC关系建立，好感+5，名气+15！人脉是最重要的资产。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "milestone_day60",
      phase: "street",
      icon: "📅",
      title: "两个月了",
      story:
        "六十天。你已经对这座城市不再陌生。但偶尔还是会有迷茫——这条路，走对了吗？",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day === 60 &&
          !st.flags._milestone60
        );
      },
      choices: [
        {
          text: "🏆 回顾成绩，给自己打气",
          hint: "看看走了多远",
          apply: function (st) {
            st.flags._milestone60 = true;
            var totalEarned = st.resources.totalEarned || 0;
            var highlight =
              totalEarned > 5000
                ? "赚了¥" + totalEarned.toLocaleString() + "，成绩不错！"
                : "虽然辛苦，但你坚持下来了。";
            st.needs.happiness = Math.min(100, st.needs.happiness + 20);
            st.player.mental = Math.min(100, st.player.mental + 3);
            StateManager.addMessage(
              "🏆 " +
                highlight +
                " 两个月的磨练让你成长了很多。心智+3，心情大涨！",
              "success",
            );
          },
        },
        {
          text: "🔍 分析自己的短板，针对性提升",
          hint: "理性规划",
          apply: function (st) {
            st.flags._milestone60 = true;
            var minStat = "physique";
            var minVal = st.player.physique;
            ["intelligence", "agility", "mental"].forEach(function (s) {
              if (st.player[s] < minVal) {
                minStat = s;
                minVal = st.player[s];
              }
            });
            st.player[minStat] = Math.min(100, st.player[minStat] + 5);
            StateManager.addMessage(
              "🔍 你找出了自己最弱的一项：" +
                minStat +
                "，专项提升+5！针对性训练效果最好。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "milestone_day90",
      phase: "street",
      icon: "📅",
      title: "三个月——关键时刻",
      story:
        "九十天。一个季度。很多来这座城市的人，三个月后悄悄打道回府了。而你还在这里。这座城市在等你给它一个答案。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day === 90 &&
          !st.flags._milestone90
        );
      },
      choices: [
        {
          text: "🏙️ 我属于这里，不回头",
          hint: "正式扎根这座城市",
          apply: function (st) {
            st.flags._milestone90 = true;
            st.flags._cityResident = true;
            var allStatBonus = 2;
            ["physique", "intelligence", "agility", "mental"].forEach(
              function (s) {
                st.player[s] = Math.min(100, st.player[s] + allStatBonus);
              },
            );
            st.player.fame = Math.min(100, st.player.fame + 10);
            StateManager.addMessage(
              "🏙️ 你决定留下来！全属性+2，名气+10。城市居民身份让你做事更自信。",
              "success",
            );
          },
        },
        {
          text: "📞 给家人打个电话，获得支持",
          hint: "精神充电",
          apply: function (st) {
            st.flags._milestone90 = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 30);
            st.player.mental = Math.min(100, st.player.mental + 5);
            var remit = Random.int(200, 399);
            st.resources.cash += remit;
            st.resources.totalEarned += remit;
            StateManager.addMessage(
              "📞 家人听说你坚持了三个月，偷偷汇来了¥" +
                remit +
                "！心情大好+30，心智+5。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "coworker_payback",
      phase: "street",
      icon: "🤝",
      title: "工友老刘来还人情",
      story:
        "当年你不顾工头施压，帮工友老刘叫了救护车。今天他来找你，说他表弟在正规工程公司，手上有个活缺人……",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.flags._helpedCoworker &&
          st.player.day >= 30
        );
      },
      choices: [
        {
          text: "💪 接！认识新朋友",
          hint: "人情就是资本",
          apply: function (st) {
            var pay = Random.int(300, 499);
            st.resources.cash += pay;
            st.resources.totalEarned += pay;
            st.player.physique = Math.min(100, st.player.physique + 2);
            st.player.fame = Math.min(100, st.player.fame + 5);
            StateManager.addMessage(
              "🤝 老刘的表弟给了你一单活，干完赚了¥" +
                pay +
                "，还认识了不少工地朋友！体质+2，名气+5。",
              "success",
            );
          },
        },
        {
          text: "🙏 谢谢，但我最近有事",
          hint: "婉拒但维持关系",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            StateManager.addMessage(
              "🙏 婉拒了老刘，但他说下次还有机会。好人好报，心情不错。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "wallet_karma",
      phase: "street",
      icon: "👛",
      title: "噩梦还是惊喜",
      story:
        "路上你听到身后有人喊你。一个陌生女人说她当时丢了钱包，到处找，最后从监控看到你捡走了……",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.flags._keptWallet &&
          st.player.day >= 15
        );
      },
      choices: [
        {
          text: "😰 坦白承认，还钱",
          hint: "归还钱包里的钱",
          apply: function (st) {
            var repaid = Random.int(100, 179);
            st.resources.cash = Math.max(0, st.resources.cash - repaid);
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            st.player.fame = Math.min(100, st.player.fame + 8);
            st.flags._keptWallet = false;
            st.flags._returnedWallet = true;
            StateManager.addMessage(
              "😰 你道了歉、还了¥" +
                repaid +
                "，对方感谢你的诚实。心里反而轻了许多。心情+15，名气+8。",
              "success",
            );
          },
        },
        {
          text: "😤 矢口否认",
          hint: "死不承认",
          apply: function (st) {
            st.needs.happiness = Math.max(0, st.needs.happiness - 20);
            st.player.fame = Math.max(0, st.player.fame - 10);
            StateManager.addMessage(
              "😤 你否认了。她半信半疑地走了。心里像压了块石头，名气-10。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "integrity_reward",
      phase: "street",
      icon: "🌟",
      title: "信誉带来回报",
      story:
        "你拒绝假货、做生意讲诚信的事传开了。圈子里的人私下讨论，说你这个人靠谱，有个批发商想跟你长期合作……",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.flags._refusedFakeGoods &&
          st.player.fame >= 20
        );
      },
      choices: [
        {
          text: "🤝 合作！建立长期供货关系",
          hint: "打开批发渠道",
          apply: function (st) {
            var bonus = Random.int(500, 799);
            st.resources.cash += bonus;
            st.resources.totalEarned += bonus;
            st.player.fame = Math.min(100, st.player.fame + 10);
            st.flags._bulkSupplier = true;
            StateManager.addMessage(
              "🤝 合作谈成了！批发商先给了¥" +
                bonus +
                "的预付款。你的诚信名声打出去了，名气+10。",
              "success",
            );
          },
        },
        {
          text: "🤔 了解一下，不急于答应",
          hint: "谨慎观望",
          apply: function (st) {
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage(
              "🤔 你说先考虑一下，对方表示理解，留了联系方式。机会还在。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "labor_rights_recognition",
      phase: "street",
      icon: "⚖️",
      title: "劳动局表彰",
      story:
        '你上次举报欠薪的事情，劳动仲裁中心记了档。今天接到通知：你的案例被评为"维权先锋"，有奖励，也有记者想采访……',
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.flags._foughtWageTheft &&
          st.player.day >= 20
        );
      },
      choices: [
        {
          text: "🎤 接受采访，公开发声",
          hint: "名气暴增，但会树敌",
          apply: function (st) {
            var award = Random.int(200, 299);
            st.resources.cash += award;
            st.resources.totalEarned += award;
            st.player.fame = Math.min(100, st.player.fame + 18);
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            StateManager.addMessage(
              "🎤 采访播出了！你成了工友圈的红人，拿了¥" +
                award +
                "奖励，名气+18！有些工头不太高兴……",
              "success",
            );
          },
        },
        {
          text: "🏆 领奖就好，不接受采访",
          hint: "低调处理",
          apply: function (st) {
            var award = Random.int(200, 299);
            st.resources.cash += award;
            st.resources.totalEarned += award;
            st.player.fame = Math.min(100, st.player.fame + 8);
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage(
              "🏆 低调领了奖金¥" +
                award +
                "和荣誉证书，名气+8。做了好事，心里踏实。",
              "success",
            );
          },
        },
        {
          text: "🙅 放弃，别惹麻烦",
          hint: "多一事不如少一事",
          apply: function (st) {
            StateManager.addMessage(
              "🙅 你婉拒了。这段经历只有你自己知道。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "old_liu_info",
      phase: "street",
      icon: "📱",
      title: "工友老刘发来内部消息",
      story:
        "老刘微信说他在新工地发现包工头要跑路，三十几个工友的工资危了！他第一个想到你——那次你帮他的事他一直没忘。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.flags._helpedCoworker || st.flags._foughtWageTheft) &&
          st.player.day >= 25
        );
      },
      choices: [
        {
          text: "📣 帮忙组织工友维权",
          hint: "用你的经验帮大家",
          apply: function (st) {
            st.player.fame = Math.min(100, st.player.fame + 12);
            st.needs.happiness = Math.min(100, st.needs.happiness + 20);
            st.player.mental = Math.min(100, st.player.mental + 2);
            StateManager.addMessage(
              "📣 你和老刘一起组织，工友们联名上报，成功阻止了包工头跑路。大家都感谢你，名气+12，心智+2！",
              "success",
            );
          },
        },
        {
          text: "📋 帮忙收集证据，但不出头",
          hint: "背后出力",
          apply: function (st) {
            st.player.intelligence = Math.min(100, st.player.intelligence + 1);
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage(
              "📋 你偷偷收集了包工头的逃跑证据交给老刘，工友们维权成功。智力+1，良心过得去。",
              "success",
            );
          },
        },
        {
          text: "😶 告诉他我帮不上",
          hint: "事不关己",
          apply: function (st) {
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "😶 你说你帮不上忙。老刘半天没回复。心里有点不是滋味。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "xiao_mei_tutoring_lead",
      phase: "street",
      icon: "📚",
      title: "小美给你介绍了家教单",
      story:
        "大学城的小美发消息说她有个朋友想给孩子找数学家教，她推荐了你。对方愿意付每小时¥80，一周两节。",
      // [自洽修复] 新增：xiao_mei 关系 met 检查（story 直呼"小美"，需已结识）
      conditions: function (st) {
        var rel = st.relationships && st.relationships["xiao_mei"];
        // [自洽修复] 检查 met 字段（直呼已定义NPC名需已结识）
        if (!rel || !rel.met) return false;
        return (
          st.player.phase === "street" &&
          rel.affinity >= 30 &&
          st.player.intelligence >= 30
        );
      },
      choices: [
        {
          text: "✅ 接单！智力变现",
          hint: "每周+¥160",
          apply: function (st) {
            const earned = Random.int(160, 239);
            st.resources.cash += earned;
            st.resources.totalEarned += earned;
            st.skills.english && (st.skills.english.xp += 15);
            StateManager.addMessage(
              "✅ 教了两节课，赚了 ¥" + earned + "！小美这个人脉太值了。",
              "success",
            );
          },
        },
        {
          text: "😅 推掉，感觉教不了",
          hint: "量力而行",
          apply: function (st) {
            StateManager.addMessage(
              "😅 你说自己不太擅长，小美表示理解。下次努力提升智力。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "old_liu_advance",
      phase: "street",
      icon: "🏗️",
      title: "老刘当了小包工头",
      story:
        "老刘又来找你了。这次不一样——他自己接了个小工程，手上有三四个人，正在扩张，想拉你入伙一起干。他说：「当时你帮了我，这次我想帮你往上走一步。」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.flags._helpedCoworker &&
          st.player.day >= 60 &&
          !st.flags._oldLiuAdvance
        );
      },
      choices: [
        {
          text: "🤝 入伙！跟着刘哥一起干",
          hint: "开启长期合作，工地收入提升",
          apply: function (st) {
            st.flags._oldLiuAdvance = true;
            st.flags._liuPartner = true;
            var bonus = Random.int(600, 999);
            st.resources.cash += bonus;
            st.resources.totalEarned += bonus;
            st.player.physique = Math.min(100, st.player.physique + 3);
            st.player.fame = Math.min(100, st.player.fame + 8);
            StateManager.addMessage(
              "🏗️ 你和老刘签了口头合同，先拿了¥" +
                bonus +
                "的进场费！体质+3，名气+8。以后在老刘的工地做事，工资有额外加成。",
              "success",
            );
          },
        },
        {
          text: "🙏 谢谢老刘，但我想自己闯",
          hint: "婉拒，但保持友谊",
          apply: function (st) {
            st.flags._oldLiuAdvance = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage(
              "🙏 老刘点了点头，说：「好汉，有志气。」你们喝了杯茶，聊了很久。有些情谊比钱更珍贵。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "fakegoods_threatened",
      phase: "street",
      icon: "😡",
      title: "假货商上门来找茬",
      story:
        "一个陌生男人堵住你的去路，自我介绍说是那家倒闭假货铺的合伙人。他沉着脸说：「你让老板损失了不少钱，我们要你解释清楚。」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.flags._refusedFakeGoods &&
          st.player.fame >= 15 &&
          st.player.day >= 20 &&
          !st.flags._fakegoodsThreat
        );
      },
      choices: [
        {
          text: "💪 硬刚！我做的没错",
          hint: "强硬态度，名气+但有风险",
          apply: function (st) {
            st.flags._fakegoodsThreat = true;
            st.player.fame = Math.min(100, st.player.fame + 12);
            st.player.mental = Math.min(100, st.player.mental + 2);
            st.needs.happiness = Math.max(0, st.needs.happiness - 10);
            StateManager.addMessage(
              "💪 你看着他的眼睛说：「假货害人，我没错。你们要告就告。」他犹豫了一下，骂了句脏话走了。名气+12，但心情有点沉。",
              "success",
            );
          },
        },
        {
          text: "😰 假装不认识，找借口溜走",
          hint: "暂避锋芒",
          apply: function (st) {
            st.flags._fakegoodsThreat = true;
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "😰 你说认错人了，借口有急事，快步离开了。他盯着你的背影好久。感觉以后要小心点。",
              "warning",
            );
          },
        },
        {
          text: "📞 当场报警",
          hint: "彻底解决，但耗时间",
          apply: function (st) {
            st.flags._fakegoodsThreat = true;
            st.flags._reportedFakeSeller = true;
            st.player.fame = Math.min(100, st.player.fame + 6);
            StateManager.addMessage(
              "📞 你当着他面拨了110。他立刻转身就走。警察来了记了笔录，建议你注意人身安全。名气+6，威胁消除。",
              "success",
            );
          },
        },
      ],
    },
    // ====== 链式续：钱包主人找上门（由found_wallet的"交派出所"触发） ======
    {
      id: "wallet_owner_finds_you",
      _isChainEvent: true,
      phase: "street",
      icon: "🙏",
      title: "钱包主人找来了",
      story:
        "一个中年男人提着水果篮在巷口打听你。看到你之后，他快步走过来握住你的手：'太感谢了！我身份证和银行卡都在里面，补办太麻烦了。'他硬要把果篮塞给你，又从口袋里掏出一个信封。",
      conditions: function (st) {
        return !!st.flags._returnedWallet && !st.flags._walletOwnerVisited;
      },
      choices: [
        {
          text: "🎁 收下果篮和信封",
          hint: "好心有好报",
          apply: function (st) {
            st.flags._walletOwnerVisited = true;
            st.flags._walletOwnerFriend = true;
            var reward = Random.int(200, 499);
            st.resources.cash += reward;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "🎁 信封里有¥" +
                reward +
                "。'交个朋友，以后有事找我！'他递了名片。",
              "success",
            );
            // 远期：可能触发更多人脉事件
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "wallet_owner_connection", 60, "street");
            }
          },
        },
        {
          text: "🙌 只收果篮，不收钱",
          hint: "纯粹的善意",
          apply: function (st) {
            st.flags._walletOwnerVisited = true;
            st.flags._walletOwnerPure = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
            if (
              typeof getReputationBadges === "function" ||
              typeof calculateReputationBadges === "function"
            ) {
              st._reputationPendingRecompute = true;
            }
            StateManager.addMessage(
              "🙌 '好人啊！'他眼眶有点红。'这年头像你这样的人不多了。'",
              "event",
            );
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "wallet_owner_connection", 45, "street");
            }
          },
        },
      ],
    },
    {
      id: "wallet_owner_connection",
      _isChainEvent: true,
      phase: "street",
      icon: "📋",
      title: "好心人的回报",
      story:
        "几个月前你捡到钱包的那个人——他原来是一家小工厂的老板。他托人带话：厂里缺个靠谱的管仓库的，活不累，待遇比外面强。如果你有兴趣，随时可以过去看看。",
      conditions: function (st) {
        return (
          (!!st.flags._walletOwnerFriend || !!st.flags._walletOwnerPure) &&
          !st.flags._walletJobOffered
        );
      },
      choices: [
        {
          text: "💼 去看看，合适就干",
          hint: "获得稳定工作机会",
          apply: function (st) {
            st.flags._walletJobOffered = true;
            st.flags._walletJobAccepted = true;
            st.resources.cash += 2000;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            StateManager.addMessage(
              "💼 仓库管理员的工作还不错，月薪¥4500，包吃住。好人有好报。",
              "success",
            );
          },
        },
        {
          text: "🙏 婉拒，但保持联系",
          hint: "不欠人情",
          apply: function (st) {
            st.flags._walletJobOffered = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            StateManager.addMessage(
              "🙏 '谢谢好意，我现在还有别的打算。' '行，随时来找我。'",
              "info",
            );
          },
        },
      ],
    },

    // ====== v3.20 新增事件（已补全 conditions + apply，修复死代码）======

    // v3.20-7: 技能进阶里程碑（修理→工厂机会）
    {
      id: "mechanic_recruited_by_factory",
      phase: "street",
      icon: "🔧",
      title: "工厂技术主管挖人",
      story:
        '你在工厂区闲逛时，一个穿着工装的中年男人拍了拍你的肩膀："小伙子，看你手上全是茧子，干过机修吗？我们厂正缺个能修设备的。",\\n\\n他递了张名片——是一家中型工厂的技术主管。',
      // [自洽修复] v3.20 原始提交缺 conditions/apply → 补全
      conditions: function (st) {
        var rep = st.skills && st.skills.repair ? st.skills.repair.level : 0;
        return (
          st.player.phase === "street" &&
          rep >= 35 &&
          st.player.day >= 50 &&
          !st.flags._mechanicRecruited
        );
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🔧 去试试！",
          hint: "可能获得新工作机会",
          apply: function (st) {
            st.flags._mechanicRecruited = true;
            if ((st.skills.repair.level || 0) >= 50) {
              st.flags._factoryrepairJob = true;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
              StateManager.addMessage(
                "🔧 面试很顺利——你的技术让主管当场拍板。以后有活了就找你，稳定的技术兼职之路开启了。名气+3。",
                "success",
              );
            } else {
              st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
              StateManager.addMessage(
                "🔧 面试后对方说「技术还差点火候，回去再练练」。你记住了差距，心智+2。手艺这条路没有捷径。",
                "info",
              );
            }
          },
        },
        {
          text: "🔍 先了解一下待遇",
          hint: "谨慎行事",
          apply: function (st) {
            st.flags._mechanicRecruited = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
            StateManager.addMessage(
              "🔍 你问了问薪资和工时：日结¥200-300，按件计费。心里有底了，决定考虑考虑。心智+2。",
              "info",
            );
          },
        },
        {
          text: "🙋‍♂️ 婉拒，现在忙",
          hint: "放弃",
          apply: function (st) {
            st.flags._mechanicRecruited = true;
            StateManager.addMessage(
              "🙋‍♂️ 你说现在脱不开身。主管点点头：「想来了随时打电话。」机会留了个尾巴。",
              "info",
            );
          },
        },
      ],
    },

    // v3.20-8: 钱包归还后续（延迟回响·道德长线）
    {
      id: "wallet_return_late_reward",
      phase: "street",
      icon: "💲",
      title: "那个钱包改变了什么",
      story:
        '你把钱包还回去已经几个月了。今天在一个社区活动上，你意外遇到了那个钱包的主人——他竟然是个社区志愿者组织的负责人。\\n\\n他认出了你："原来是你！上次真是太感谢了！"',
      // [自洽修复] v3.20 原始提交缺 conditions/apply → 补全
      // 联动 flags._returnedFoundMoney（道德系统长线回响）
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.flags._returnedFoundMoney === true &&
          st.player.day >= (st.flags._walletReturnDay || 0) + 90 &&
          !st.flags._walletLateReward
        );
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🙏 主动打招呼",
          hint: "重建联系",
          apply: function (st) {
            st.flags._walletLateReward = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
            // 获得社区志愿者网络接入
            st.flags._communityNetwork = true;
            StateManager.addMessage(
              "🙏 他拉着你坐下聊了很久，还要推荐你加入志愿者组织。名气+8，心情+10。没想到几个月前的举手之缘，会在今天开花结果。",
              "success",
            );
          },
        },
        {
          text: "👋 假装不认识，默默走开",
          hint: "低调",
          apply: function (st) {
            st.flags._walletLateReward = true;
            StateManager.addMessage(
              "👋 你低着头快步走开了。他不理解，但你有你的活要干。善意不图回报，也不等人情绑架。",
              "info",
            );
          },
        },
      ],
    },
    // ====== 联动增强1: 雾天生存事件（天气系统交叉引用） ======
    // 设计意图：原天气系统只有 rainy/stormy 被事件引用，foggy 和 sunny 完全无人问津
    // 联动域：核心机制(weather) ↔ 事件系统(narrative)
    {
      id: "foggy_morning_market",
      phase: "street",
      icon: "🌫️",
      title: "浓雾中的早市",
      story:
        "清晨起来，城市被浓雾笼罩。能见度不到十米。你走到平时摆摊的街口，发现早市比往常人多——雾天大家不爱出门，集中在市场里买东西。",
      // [全系统自洽联动] 域B 联动增强: 新增 foggy 天气事件，填补天气系统空白
      triggers: {
        weather: "foggy",
        excludeFlags: ["_foggyMorningMarketSeen"],
      },
      choices: [
        {
          text: "📦 多备些货去摆摊",
          hint: "雾天客流集中",
          apply: function (st) {
            st.flags._foggyMorningMarketSeen = true;
            var extra = Random.int(100, 300);
            st.resources.cash += extra;
            st.resources.totalEarned += extra;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
            StateManager.addMessage(
              "📦 雾天生意出奇的好！多备的货全卖完了，多赚了¥" +
                extra +
                "。但雾天走路费劲，疲劳+10。",
              "success",
            );
          },
        },
        {
          text: "🏠 雾太大，今天不出摊",
          hint: "安全第一",
          apply: function (st) {
            st.flags._foggyMorningMarketSeen = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
            StateManager.addMessage(
              "🏠 雾天不出摊，在家歇了一天。明智的选择，心智+1。",
              "info",
            );
          },
        },
      ],
    },
    // ====== 联动增强2: 晴天户外事件 ======
    {
      id: "sunny_rooftop_rest",
      phase: "street",
      icon: "☀️",
      title: "难得的晴天",
      story:
        "连续阴雨后终于放晴了。阳光洒在身上暖洋洋的。你站在楼顶，看着这座城市的天际线，突然觉得今天应该做点什么不一样的。",
      // [全系统自洽联动] 域B 联动增强: 新增 sunny 天气事件
      triggers: {
        weather: "sunny",
        excludeFlags: ["_sunnyRooftopSeen"],
      },
      choices: [
        {
          text: "📖 去图书馆晒太阳看书",
          hint: "提升智力",
          apply: function (st) {
            st.flags._sunnyRooftopSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 3,
            );
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
            StateManager.addMessage(
              "📖 在图书馆坐了一下午，看了本关于城市经济的书。智力+3，心情+10。",
              "success",
            );
          },
        },
        {
          text: "🏃 出去跑步锻炼",
          hint: "提升体质",
          apply: function (st) {
            st.flags._sunnyRooftopSeen = true;
            st.player.physique = Math.min(100, (st.player.physique || 0) + 2);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
            StateManager.addMessage(
              "🏃 跑了5公里，汗流浃背但神清气爽。体质+2，心情+8。",
              "success",
            );
          },
        },
        {
          text: "😴 在家睡个懒觉",
          hint: "恢复疲劳",
          apply: function (st) {
            st.flags._sunnyRooftopSeen = true;
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
            StateManager.addMessage(
              "😴 拉上窗帘睡到自然醒。久违的放松，疲劳-20。",
              "info",
            );
          },
        },
      ],
    },
    // ====== 联动增强3: Phase1→Phase2 叙事继承桥接 ======
    // 设计意图：街头阶段的道德选择/人脉积累在进入职场阶段后应有叙事回响
    // 联动域：事件(events) ↔ 核心机制(lifecycle/phase transition)
    {
      id: "street_phase_transition_memory",
      phase: "street",
      icon: "🌅",
      title: "告别街头",
      story:
        "你收到了第一份正式工作的录用通知。收拾东西的时候，你翻出了这几个月攒下的各种小物件——一张旧名片、一个社区志愿者的徽章、还有那张还没寄出的感谢信。这座城市的第一章，快要翻过去了。",
      // [全系统自洽联动] 域B 联动增强: Phase1→Phase2 过渡叙事桥接
      triggers: {
        minDay: 120,
        excludeFlags: ["_phase1TransitionSeen"],
      },
      choices: [
        {
          text: "📝 写一封感谢信给帮过你的人",
          hint: "感谢过去的贵人",
          apply: function (st) {
            st.flags._phase1TransitionSeen = true;
            st.flags._gratitudeLetterSent = true;
            // 感谢过的NPC会获得额外好感
            var gratefulNpcs = ["aunt_wang", "boss_li", "old_zhou"];
            for (var i = 0; i < gratefulNpcs.length; i++) {
              if (
                st.relationships &&
                st.relationships[gratefulNpcs[i]] &&
                st.relationships[gratefulNpcs[i]].met
              ) {
                st.relationships[gratefulNpcs[i]].affinity = Math.min(
                  100,
                  (st.relationships[gratefulNpcs[i]].affinity || 0) + 10,
                );
              }
            }
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
            StateManager.addMessage(
              "📝 你给每个帮过你的人写了信。收到回信的那天，你眼眶湿了。心情+15，心智+5，道德+5。",
              "success",
            );
          },
        },
        {
          text: "💼 向前看，新的开始",
          hint: "放下过去",
          apply: function (st) {
            st.flags._phase1TransitionSeen = true;
            st.flags._forwardLooking = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 3,
            );
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
            StateManager.addMessage(
              "💼 你把这些东西收进箱子最底层。过去的事教会了你很多，但未来更重要。智力+3。",
              "info",
            );
          },
        },
      ],
    },
  ];
  for (var i = 0; i < EVENTS.length; i++) {
    // 防御性兜底：无 conditions 的事件默认放行（避免死代码），与 CAREER_EVENTS 一致
    if (!EVENTS[i].conditions && !EVENTS[i].triggers) {
      EVENTS[i].conditions = function () {
        return true;
      };
    }
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

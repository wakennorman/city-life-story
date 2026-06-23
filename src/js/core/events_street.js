/**
 * 街头随机事件数据（从 events.js 拆分）
 *
 * 自动推入 RANDOM_EVENTS 数组。
 * 必须在 events_core.js 之后加载。
 */

(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._streetLoaded) return;
  RANDOM_EVENTS._streetLoaded = true;
  var EVENTS = [
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
        return st.player.phase === "street";
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
      conditions: function (st) {
        return st.player.phase === "street";
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
      conditions: function (st) {
        return st.player.phase === "street" && st.resources.cash > 0;
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
                "↩️ 批发商耍赖说验货时没说不行，白跑了一趟，消耗了大半天AP。",
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
      conditions: function (st) {
        return st.player.phase === "street" && st.housing.tier >= 1;
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
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.skills.sales ? st.skills.sales.level >= 5 : false)
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
              // 添加到背包
              if (!st.inventory.items) st.inventory.items = [];
              var existPhone = st.inventory.items.find(function (x) {
                return x.id === "smartphone";
              });
              if (existPhone) {
                existPhone.qty = (existPhone.qty || 1) + 1;
              } else {
                st.inventory.items.push({ id: "smartphone", qty: 1 });
              }
              StateManager.addMessage(
                "📱 手机买到了，成色还不错！已放入背包，跑外卖的路敞开了，名气+2。",
                "success",
              );
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
            // 添加到背包
            if (!st.inventory.items) st.inventory.items = [];
            var existPhone2 = st.inventory.items.find(function (x) {
              return x.id === "smartphone";
            });
            if (existPhone2) {
              existPhone2.qty = (existPhone2.qty || 1) + 1;
            } else {
              st.inventory.items.push({ id: "smartphone", qty: 1 });
            }
            StateManager.addMessage(
              "🔍 你仔细测试了30分钟，砍价到¥" +
                price +
                "成交，没有暗病。手机已放入背包。",
              "success",
            );
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
      conditions: function (st) {
        return st.player.phase === "street";
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
      conditions: function (st) {
        return st.player.phase === "street";
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
      conditions: function (st) {
        return st.player.phase === "street";
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
      conditions: function (st) {
        var rel = st.relationships && st.relationships["aunt_wang"];
        return (
          st.player.phase === "street" &&
          rel &&
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
      conditions: function (st) {
        var rel = st.relationships && st.relationships["boss_li"];
        return st.player.phase === "street" && rel && rel.affinity >= 10;
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
      conditions: function (st) {
        return st.player.phase === "street" && (st.housing.tier || 0) === 0;
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
      conditions: function (st) {
        var rel = st.relationships && st.relationships["xiao_mei"];
        return (
          st.player.phase === "street" &&
          rel &&
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
    {
      id: "wage_thief_retaliate",
      phase: "street",
      icon: "🕵️",
      title: "欠薪包工头的报复",
      story:
        "你维权的事传开了，但有人告诉你，那个被举报的包工头在外面放话，说要「收拾你」。今天你注意到有人一直跟着你转，不远不近。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.flags._foughtWageTheft &&
          st.player.day >= 35 &&
          !st.flags._wageThiefRevenge
        );
      },
      choices: [
        {
          text: "🚔 直接去派出所备案",
          hint: "主动保护自己，获得法律保护",
          apply: function (st) {
            st.flags._wageThiefRevenge = true;
            st.flags._policeProtection = true;
            st.player.mental = Math.min(100, st.player.mental + 3);
            StateManager.addMessage(
              "🚔 你去派出所把情况说明，警察记了案，并联系了劳动局。对方收到警告后消停了。心智+3，获得法律保护光环。",
              "success",
            );
          },
        },
        {
          text: "📱 联系记者曝光",
          hint: "借助媒体保护自己",
          apply: function (st) {
            st.flags._wageThiefRevenge = true;
            st.player.fame = Math.min(100, st.player.fame + 15);
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage(
              "📱 你联系了做劳工报道的记者，把跟踪的事说了。记者写了篇稿子，包工头彻底缩了。名气+15，维权故事传出去了。",
              "success",
            );
          },
        },
        {
          text: "😶 忍着，当没看见",
          hint: "忍气吞声，继续观察",
          apply: function (st) {
            st.flags._wageThiefRevenge = true;
            st.needs.happiness = Math.max(0, st.needs.happiness - 12);
            st.player.mental = Math.max(0, st.player.mental - 2);
            StateManager.addMessage(
              "😶 你假装没注意，但心里一直悬着。这种感觉持续了好几天，越来越难受。心情-12，心智-2。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "honesty_compound_effect",
      phase: "street",
      icon: "🌟",
      title: "诚信声誉的叠加效应",
      story:
        "同时拒绝了假货、还帮工友维权，你的名声在这片地界出奇地好。今天一个在工商局上班的人主动找到你，说想帮你做点正规生意的注册手续……",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.flags._refusedFakeGoods &&
          st.flags._foughtWageTheft &&
          st.player.fame >= 30 &&
          st.player.day >= 40 &&
          !st.flags._honestyCompound
        );
      },
      choices: [
        {
          text: "📋 注册个体户营业执照",
          hint: "开通正规经营资格",
          apply: function (st) {
            st.flags._honestyCompound = true;
            st.flags._hasBusinessLicense = true;
            var cost = 50;
            st.resources.cash = Math.max(0, st.resources.cash - cost);
            st.player.fame = Math.min(100, st.player.fame + 10);
            StateManager.addMessage(
              "📋 花了¥" +
                cost +
                "手续费，你正式拿到了个体户营业执照！以后摆摊卖货不怕城管了，名气+10。",
              "success",
            );
          },
        },
        {
          text: "🙏 感谢好意，现在还不是时候",
          hint: "先观望",
          apply: function (st) {
            st.flags._honestyCompound = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            StateManager.addMessage(
              "🙏 你婉拒了，但对方留了联系方式说「随时联系」。这份人情记下了。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "wallet_returned_good_karma",
      phase: "street",
      icon: "🤝",
      title: "诚实带来的意外机缘",
      story:
        "那个失主后来找到你，说上次你主动还钱这事她一直记着。她的丈夫在一家正规工厂做人事，正好在招熟练工……",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.flags._returnedWallet &&
          st.player.day >= 22 &&
          !st.flags._walletKarmaGood
        );
      },
      choices: [
        {
          text: "✅ 去面试，试试看",
          hint: "获得工厂正式工作机会",
          apply: function (st) {
            st.flags._walletKarmaGood = true;
            var bonus = Random.int(400, 699);
            st.resources.cash += bonus;
            st.resources.totalEarned += bonus;
            st.player.intelligence = Math.min(100, st.player.intelligence + 2);
            StateManager.addMessage(
              "✅ 面试顺利，当天就入职了！对方预付了¥" +
                bonus +
                "的安置费。诚实不吃亏，智力+2。",
              "success",
            );
          },
        },
        {
          text: "🤔 现在有其他安排，先谢过",
          hint: "婉拒但维持好感",
          apply: function (st) {
            st.flags._walletKarmaGood = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 12);
            StateManager.addMessage(
              "🤔 你婉谢了，对方说机会总在，下次有合适的还会想到你。心情+12。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "labor_network_grows",
      phase: "street",
      icon: "📣",
      title: "你成了打工人的主心骨",
      story:
        "帮了老刘、维过权、也替工友出过头。一群外来务工者聚在你常去的工地角落，说你是这里说话最算数的人，想推你做「工友互助小组」的组长。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.flags._helpedCoworker &&
          st.flags._foughtWageTheft &&
          st.player.day >= 55 &&
          !st.flags._laborNetworkGrown
        );
      },
      choices: [
        {
          text: "🤝 接了！工友互助，才是真正的依靠",
          hint: "建立社会关系网络",
          apply: function (st) {
            st.flags._laborNetworkGrown = true;
            st.flags._laborOrganizer = true;
            st.player.fame = Math.min(100, st.player.fame + 20);
            st.player.mental = Math.min(100, st.player.mental + 3);
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            StateManager.addMessage(
              "📣 你接受了这个身份。大家开始每天轮流通报各处的工资行情和坑人老板。名气+20，心智+3，心情+15。",
              "success",
            );
          },
        },
        {
          text: "😅 大家抬举了，我只是个普通打工人",
          hint: "谦让，但名气仍受益",
          apply: function (st) {
            st.flags._laborNetworkGrown = true;
            st.player.fame = Math.min(100, st.player.fame + 8);
            StateManager.addMessage(
              "😅 你摆摆手，但大家还是把你当主心骨。名气+8。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "mental_breakdown_edge",
      phase: "street",
      icon: "😰",
      title: "撑不住了",
      story:
        "不知道是第几天了，你呆坐在出租屋的地板上，脑子一片空白。窗外霓虹还在闪，但什么声音都不像是给你的。那一刻你突然意识到：再这样下去，你真的会垮掉。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.player.mental || 0) < 20 &&
          st.player.day >= 10 &&
          (st.housing.tier || 0) >= 1 &&
          !st.flags._hadMentalCrisis
        );
      },
      choices: [
        {
          text: "📞 打电话给老家的人，哪怕什么都不说",
          hint: "倾诉释放，心智+心情回血",
          apply: function (st) {
            st.flags._hadMentalCrisis = true;
            st.flags._calledHome = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 20);
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            StateManager.addMessage(
              "📞 电话那头，妈妈的声音让你鼻子一酸。你说「没事，就是想打个电话」。挂断后你哭了很久，但好多了。心智+20，心情+15。",
              "success",
            );
          },
        },
        {
          text: "🚶 一个人出去走走，吹吹风",
          hint: "独处消化压力，小幅恢复",
          apply: function (st) {
            st.flags._hadMentalCrisis = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 10);
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            st.needs.fatigue = Math.max(0, st.needs.fatigue - 5);
            StateManager.addMessage(
              "🚶 你沿着街道走了两个小时，什么都没想，什么都想了。回来的时候好像轻了一点。心智+10，心情+8。",
              "info",
            );
          },
        },
        {
          text: "😤 忍着，继续干，日子总会好的",
          hint: "强撑，短期无效但意志力+",
          apply: function (st) {
            st.flags._hadMentalCrisis = true;
            st.flags._toughMindset = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            st.player.physique = Math.min(100, st.player.physique + 2);
            StateManager.addMessage(
              "😤 你握紧拳头，告诉自己：「今天不是最难的一天。」第二天你照常出门了。心智+3，体质+2（意志力磨练）。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "mental_therapy_chance",
      phase: "street",
      icon: "🛋️",
      title: "社区心理援助",
      story:
        "路边一个小摊前贴着「免费心理援助，限今日」的纸条，旁边坐着个看起来很平和的中年人。你站住了，不知道该不该过去。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.player.mental || 0) < 35 &&
          st.player.day >= 5 &&
          !st.flags._hadTherapy
        );
      },
      choices: [
        {
          text: "🛋️ 坐下来聊聊，反正免费",
          hint: "心理咨询，心智大幅恢复",
          apply: function (st) {
            st.flags._hadTherapy = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 30);
            st.needs.happiness = Math.min(100, st.needs.happiness + 12);
            StateManager.addMessage(
              "🛋️ 你说了很多，关于家、关于钱、关于不知道自己在这座城市值不值得。对方没有评判，只是点头。走的时候你感觉脚步轻了很多。心智+30，心情+12。",
              "success",
            );
          },
        },
        {
          text: "🚶 算了，走了",
          hint: "错过机会，但不丢脸",
          apply: function (st) {
            st.flags._hadTherapy = true;
            StateManager.addMessage(
              "🚶 你犹豫了一下，还是走开了。有些话，还没准备好说出口。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "mental_recovery_milestone",
      phase: "street",
      icon: "🌤️",
      title: "那个早晨不一样",
      story:
        "不知道是某天的阳光太好，还是因为最近手头松了点，还是因为你真的适应了这座城市的节奏——你发现今天醒来，没有那种沉甸甸的东西压在胸口了。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.player.mental || 0) >= 60 &&
          st.flags._hadMentalCrisis &&
          !st.flags._mentalRecoveryDone
        );
      },
      choices: [
        {
          text: "🌤️ 好好感受这一刻",
          hint: "全面小幅恢复",
          apply: function (st) {
            st.flags._mentalRecoveryDone = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 20);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 10);
            st.player.fame = Math.min(100, st.player.fame + 3);
            StateManager.addMessage(
              "🌤️ 你深吸一口气，告诉自己：「我他妈真的在这座城市活下来了。」心情+20，心智+10，名气+3（自信光环）。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "child_beggar_dilemma",
      phase: "street",
      icon: "👶",
      title: "巷子里的孩子",
      story:
        "你从批发市场回来，路过一条小巷，一个八九岁的孩子蹲在地上，脏兮兮的，手里攥着一个空饭盒。他抬头看见你，没有开口，只是盯着你的眼睛。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.trade.currentLocation === "market" &&
          st.player.day >= 5 &&
          !st.flags._childBeggaredSeen
        );
      },
      choices: [
        {
          text: "🍱 买一份盒饭给他",
          hint: "花点钱做件好事",
          apply: function (st) {
            st.flags._childBeggaredSeen = true;
            st.flags._gaveFoodToChild = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 15);
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            StateManager.addMessage(
              "🍱 你绕回去买了一份盒饭递给他。他接过去也没说谢谢，只是低头吃了起来。你站了一会儿，转身走了。心情+10，心智+5，-¥15。",
              "success",
            );
          },
        },
        {
          text: "💵 给他20块钱",
          hint: "花点零钱换好心情",
          apply: function (st) {
            st.flags._childBeggaredSeen = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 20);
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            StateManager.addMessage(
              "💵 你掏出一张20块塞进他手里，他终于说了一句「谢谢叔叔」。你走了很远还在想他今晚住哪里。心情+8，-¥20。",
              "success",
            );
          },
        },
        {
          text: "🚶 装作没看见，走了",
          hint: "不用花钱，但心里不好受",
          apply: function (st) {
            st.flags._childBeggaredSeen = true;
            st.player.mental = Math.max(0, (st.player.mental || 0) - 3);
            StateManager.addMessage(
              "🚶 你低着头走过去，没有停下来。走了两个路口，你想：也许他有家人来找他。心智-3。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "factory_fire_escape",
      phase: "street",
      icon: "🔥",
      title: "工厂火警",
      story:
        "你在路边等人，突然听到旁边一栋老厂房里「嗡」的一声，浓烟冒了出来。厂里有工人，保安已经往外跑，但里面还有几个没出来。你手里没有工具，只有双手。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 10 &&
          !st.flags._factoryFireSeen
        );
      },
      choices: [
        {
          text: "🏃 冲进去帮忙疏散工人",
          hint: "挺身而出，可能受伤但能积累名望",
          apply: function (st) {
            st.flags._factoryFireSeen = true;
            st.flags._factoryFireHero = true;
            st.player.fame = Math.min(100, st.player.fame + 10);
            st.player.physique = Math.min(100, st.player.physique + 2);
            st.status.health = Math.max(0, st.status.health - 15);
            StateManager.addMessage(
              "🏃 你跑进烟雾里，摸到两个工人往外推。出来时呛得直咳嗽，眼睛熏红了。但三个工人都出来了。有人拍了下来发到网上，评论区说「这年头还有这样的人。」名气+10，体质+2，健康-15。",
              "success",
            );
          },
        },
        {
          text: "📞 第一时间打119，在外面等",
          hint: "理智应对，稳妥至上",
          apply: function (st) {
            st.flags._factoryFireSeen = true;
            st.player.fame = Math.min(100, st.player.fame + 3);
            StateManager.addMessage(
              "📞 你拨了119，然后大喊让人群散开。消防车5分钟后来了。理性，安全。你没有冲进去，但事后没有人说你做错了。名气+3。",
              "info",
            );
          },
        },
        {
          text: "😨 惊慌失措，人群里往后退",
          hint: "随波逐流，但内心不安",
          apply: function (st) {
            st.flags._factoryFireSeen = true;
            st.player.mental = Math.max(0, (st.player.mental || 0) - 5);
            StateManager.addMessage(
              "😨 浓烟让你腿发软，你跟着人群往后退。后来听说工人都出来了，但那一刻你腿软的感觉还在。心智-5。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "coworker_document_leak",
      phase: "street",
      icon: "📄",
      title: "工友的秘密",
      story:
        "你在工地休息时，无意间看到工友老马桌上的一份文件——是他被包工头拖欠工资的记录，金额不小，足够证明违法。他不知道你看见了，但你可以帮他，也可以不说。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.trade.currentLocation === "construction" &&
          st.player.day >= 15 &&
          !st.flags._coworkerDocSeen
        );
      },
      choices: [
        {
          text: "🤫 偷偷复印一份，留着他需要的时候用",
          hint: "留一手，日后好做人",
          apply: function (st) {
            st.flags._coworkerDocSeen = true;
            st.flags._savedCoworkerDoc = true;
            StateManager.addMessage(
              "🤫 你悄悄拍了张照留存。没有告诉他——因为时机不对。但那份证据在你手机里。也许有天老马用得上。",
              "info",
            );
          },
        },
        {
          text: "💬 直接告诉老马，他应该知道",
          hint: "坦诚相待，对方会感激你",
          apply: function (st) {
            st.flags._coworkerDocSeen = true;
            st.flags._toldCoworkerDoc = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            StateManager.addMessage(
              "💬 你找了个空档告诉老马：「我看到那份记录了，你可以去劳动局。」他愣了一会儿，然后重重地点头：「谢了，兄弟。」心情+8，老马好感提升。",
              "success",
            );
          },
        },
        {
          text: "🙅 不是我的事，假装没看见",
          hint: "明哲保身，但夜里可能睡不着",
          apply: function (st) {
            st.flags._coworkerDocSeen = true;
            st.player.mental = Math.max(0, (st.player.mental || 0) - 2);
            StateManager.addMessage(
              "🙅 你站起身走开了，装作没事。但那份数字在脑子里转了好久——那可是他几个月的血汗钱。心智-2。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "lost_elderly",
      phase: "street",
      icon: "👵",
      title: "迷路的老人",
      story:
        "路口，一位老人站在那里，手里拿着一张纸条，四处张望。你走近一看，纸条上是一个地址——距离这里大概两公里，不算远。他的眼神有点茫然。",
      conditions: function (st) {
        return st.player.phase === "street" && !st.flags._helpedElderlyLost;
      },
      choices: [
        {
          text: "🚶 亲自送他过去",
          hint: "亲自帮忙，既费时也暖心",
          apply: function (st) {
            st.flags._helpedElderlyLost = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            st.player.fame = Math.min(100, st.player.fame + 5);
            StateManager.addMessage(
              "🚶 你陪他走了二十多分钟，到了目的地——是他儿子家。儿子开门一看，「爸，你怎么一个人出来了！」转头谢谢你，非要留你吃饭，你推开了。但那一路他讲的故事，你记了很久。心情+15，名气+5。",
              "success",
            );
          },
        },
        {
          text: "📱 帮他叫了辆顺风车",
          hint: "破费一点，省心省力",
          apply: function (st) {
            st.flags._helpedElderlyLost = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 15);
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            StateManager.addMessage(
              "📱 你帮他叫了车，看着车消失在路口。花了¥15，但那个老人上车前回头冲你笑了笑，你突然想起自己的爷爷。心情+8，-¥15。",
              "success",
            );
          },
        },
        {
          text: "🗺️ 给他指了路就走了",
          hint: "无影响",
          apply: function (st) {
            st.flags._helpedElderlyLost = true;
            StateManager.addMessage(
              "🗺️ 你跟他指了大概方向，然后走了。也许他找到了，也许他还是迷路了。你不知道，但你说了实话。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "lottery_ticket_found",
      phase: "street",
      icon: "🎫",
      title: "地上的彩票",
      story:
        "你在公园散步，脚边踩到一张皱巴巴的彩票。拣起来一看——号码和今天的公示完全对上了。¥3800。你环顾四周，没人注意你，这地方人也不多。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.trade.currentLocation === "park" &&
          st.player.day >= 7 &&
          !st.flags._foundLotteryTicket
        );
      },
      choices: [
        {
          text: "💰 去兑奖，这就是运气",
          hint: "收获现金，但内心隐隐不安",
          apply: function (st) {
            st.flags._foundLotteryTicket = true;
            st.flags._keptLotteryMoney = true;
            st.resources.cash = (st.resources.cash || 0) + 3800;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + 3800;
            st.player.mental = Math.max(0, (st.player.mental || 0) - 3);
            StateManager.addMessage(
              "💰 你去彩票站兑了奖，拿了3800块。柜台大妈说「运气好呀！」你笑笑，但那个「捡」字总让你脑子里有点不踏实。现金+¥3800，心智-3。",
              "success",
            );
          },
        },
        {
          text: "📢 在原地等了一会儿，想看有没有人来找",
          hint: "等失主，求个心安",
          apply: function (st) {
            st.flags._foundLotteryTicket = true;
            st.flags._waitedForLotteryOwner = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 12);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            StateManager.addMessage(
              "📢 你在原地站了半小时，没人来。最后你把彩票交给了公园管理处。什么都没拿到，但走出公园的时候脚步很轻。心情+12，心智+5。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "village_chief_warning",
      phase: "street",
      icon: "👴",
      title: "村长来电",
      story:
        "你的手机响了，屏幕上显示「村长」两个字。你在出租屋里接起来，对方开门见山：「你那5000多块钱，都欠了这么多天了。你现在在城里混得怎么样？什么时候还？」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.resources.villageDebt || 0) > 2000 &&
          st.player.day >= 15 &&
          !st.flags._debtWarningGiven
        );
      },
      choices: [
        {
          text: "🙏 好好解释，承诺三个月内还清",
          hint: "好感小损，但争取到宽限期",
          apply: function (st) {
            st.flags._debtWarningGiven = true;
            st.flags._debtExtensionDays = (st.player.day || 0) + 90;
            st.needs.happiness = Math.max(0, st.needs.happiness - 8);
            st.player.mental = Math.max(0, (st.player.mental || 0) - 5);
            StateManager.addMessage(
              "👴 「那行，我也不是催得很急，你慢慢来，三个月以内就行。」他挂了电话。你松了口气，但心里隐隐有点压力。心情-8，心智-5。",
              "warning",
            );
          },
        },
        {
          text: "💸 立刻打算还¥500过去表态",
          hint: "还钱表态，积攒信誉",
          apply: function (st) {
            var pay = Math.min(
              500,
              st.resources.cash || 0,
              st.resources.villageDebt || 0,
            );
            if (pay <= 0) {
              st.flags._debtWarningGiven = true;
              st.needs.happiness = Math.max(0, st.needs.happiness - 15);
              StateManager.addMessage(
                "💸 你翻了翻口袋——连500块都没有。「我...暂时没钱。」电话那头沉默了一会儿，然后挂掉了。心情-15。",
                "error",
              );
              return;
            }
            st.flags._debtWarningGiven = true;
            st.resources.cash -= pay;
            st.resources.villageDebt -= pay;
            st.flags._debtExtensionDays = (st.player.day || 0) + 60;
            StateManager.addMessage(
              "💸 你当场转了" +
                pay +
                "块过去。村长那边「嗯」了一声：「行，知道你有心，先这样。」现金-" +
                pay +
                "，村长债务-" +
                pay +
                "。",
              "success",
            );
          },
        },
        {
          text: "📵 装作没听见，挂掉电话",
          hint: "今日不处理，但事态会升级",
          apply: function (st) {
            st.flags._debtWarningGiven = true;
            st.flags._debtIgnored = true;
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "📵 你盯着屏幕让它震完，然后屏幕黑了。电话没接。你知道这不是解决问题，但今天实在不想面对。心情-5。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "village_chief_pressure",
      phase: "street",
      icon: "👴",
      title: "村长托人带话",
      story:
        "你老家的一个远房亲戚突然加了你微信，说「村长让我给你带个话：你那笔债不能再拖了，他说如果年前还不上，就要跟你爸说这事了。」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.resources.villageDebt || 0) > 3000 &&
          st.flags._debtWarningGiven &&
          !st.flags._debtPressureGiven &&
          (!st.flags._debtExtensionDays ||
            st.player.day > st.flags._debtExtensionDays)
        );
      },
      choices: [
        {
          text: "🤝 求亲戚帮忙说情，多给点时间",
          hint: "一家人还算一条心",
          apply: function (st) {
            st.flags._debtPressureGiven = true;
            st.flags._debtExtensionDays = (st.player.day || 0) + 30;
            st.needs.happiness = Math.max(0, st.needs.happiness - 10);
            st.player.mental = Math.max(0, (st.player.mental || 0) - 8);
            StateManager.addMessage(
              "🤝 亲戚叹了口气，说「那我帮你说说，你自己也争气点。」你知道这张人情欠下了。心情-10，心智-8，宽限30天。",
              "warning",
            );
          },
        },
        {
          text: "💰 还¥1000，表明诚意",
          hint: "还一笔，减轻债务压力",
          apply: function (st) {
            var pay = Math.min(
              1000,
              st.resources.cash || 0,
              st.resources.villageDebt || 0,
            );
            if (pay <= 0) {
              st.flags._debtPressureGiven = true;
              st.needs.happiness = Math.max(0, st.needs.happiness - 20);
              st.player.mental = Math.max(0, (st.player.mental || 0) - 10);
              StateManager.addMessage(
                "💰 钱包是空的。你回了个「好的」，然后关掉手机。心情-20，心智-10。",
                "error",
              );
              return;
            }
            st.flags._debtPressureGiven = true;
            st.resources.cash -= pay;
            st.resources.villageDebt -= pay;
            st.flags._debtExtensionDays = (st.player.day || 0) + 60;
            StateManager.addMessage(
              "💰 你转了" +
                pay +
                "块给村长，并让亲戚告诉他「余款月底前清」。村长那边消停了一阵子。现金-" +
                pay +
                "，村长债务-" +
                pay +
                "。",
              "success",
            );
          },
        },
        {
          text: "😤 跟亲戚说「随他便」",
          hint: "日利率提高，名气受损",
          apply: function (st) {
            st.flags._debtPressureGiven = true;
            st.flags._debtIgnored = true;
            var oldRate = st.resources.dailyInterest || 0.0035;
            st.resources.dailyInterest = Math.min(0.008, oldRate + 0.0015);
            st.player.fame = Math.max(0, st.player.fame - 5);
            st.needs.happiness = Math.max(0, st.needs.happiness - 12);
            StateManager.addMessage(
              "😤 消息传回去，村长怒了，开始向你家里人施压，利息也跟着涨了。名气-5，心情-12，日利率提升至" +
                (st.resources.dailyInterest * 100).toFixed(2) +
                "%。",
              "error",
            );
          },
        },
      ],
    },
    {
      id: "village_chief_final",
      phase: "street",
      icon: "👴",
      title: "村长亲自找来了",
      story:
        "你出租屋门被敲响了。打开门，看到村长站在门口，身后跟着你爸。「找到了，」村长说，「你自己说吧。」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.resources.villageDebt || 0) > 4000 &&
          st.flags._debtPressureGiven &&
          st.flags._debtIgnored &&
          !st.flags._debtFinalDone
        );
      },
      choices: [
        {
          text: "😰 当场还¥2000，保住颜面",
          hint: "破财消灾，保全体面",
          apply: function (st) {
            var pay = Math.min(
              2000,
              st.resources.cash || 0,
              st.resources.villageDebt || 0,
            );
            st.flags._debtFinalDone = true;
            if (pay < 500) {
              st.needs.happiness = Math.max(0, st.needs.happiness - 30);
              st.player.mental = Math.max(0, (st.player.mental || 0) - 20);
              st.player.fame = Math.max(0, st.player.fame - 15);
              StateManager.addMessage(
                "😰 你翻遍口袋，拿出零散的钞票。「就这点？」村长皱眉。你爸低下头。那个眼神……很久都忘不掉。心情-30，心智-20，名气-15。",
                "error",
              );
              return;
            }
            st.resources.cash -= pay;
            st.resources.villageDebt -= pay;
            st.resources.dailyInterest = 0.0035;
            st.needs.happiness = Math.max(0, st.needs.happiness - 15);
            StateManager.addMessage(
              "😰 你数出" +
                pay +
                "块递过去，剩余的口头承诺下月清。村长满意地点头，你爸也松了口气。现金-" +
                pay +
                "，村长债务-" +
                pay +
                "，利率恢复正常。心情-15（这种丢脸的钱还是伤自尊的）。",
              "warning",
            );
          },
        },
        {
          text: "🙇 跪下求情，让爸爸替你说话",
          hint: "家庭关系修复，但名气大损、心智重创",
          apply: function (st) {
            st.flags._debtFinalDone = true;
            st.player.fame = Math.max(0, st.player.fame - 25);
            st.player.mental = Math.max(0, (st.player.mental || 0) - 30);
            st.flags._hadMentalCrisis = true;
            st.needs.happiness = Math.max(0, st.needs.happiness - 25);
            st.flags._debtExtensionDays = (st.player.day || 0) + 60;
            StateManager.addMessage(
              "🙇 你在出租屋门口跪下来，对你爸说「爸，对不起」。村长摆了摆手，说「算了，以后别这样了」。但那一幕……名气-25，心智-30（心理危机），心情-25，获宽限60天。",
              "error",
            );
          },
        },
      ],
    },
    {
      id: "developer_collapse",
      phase: "street",
      icon: "🏚️",
      title: "楼盘暴雷了！",
      story:
        "你投资的楼盘开发商突然资金链断裂，宣布破产重组！工地停工，物业跑路，业主群炸了锅。这套房子…可能要烂尾了。",
      conditions: function (st) {
        var inv = st.investment || {};
        return (
          inv.properties &&
          inv.properties.length > 0 &&
          st.player.day > 100 &&
          !st.flags._developerCollapseTriggered
        );
      },
      choices: [
        {
          text: "💸 立刻低价出手，割肉止损",
          hint: "到手55%",
          apply: function (st) {
            st.flags._developerCollapseTriggered = true;
            st.flags._hasLostPropertyCollapse = true;
            var inv = st.investment || {};
            if (!inv.properties) return;
            var total = 0;
            for (var pi = 0; pi < inv.properties.length; pi++) {
              total +=
                inv.properties[pi].currentPrice || inv.properties[pi].buyPrice;
            }
            var proceeds = Math.round(total * 0.55);
            st.resources.cash += proceeds;
            st.resources.totalEarned += proceeds;
            inv.properties = [];
            st.needs.happiness = Math.max(0, st.needs.happiness - 20);
            st.player.mental = Math.max(0, st.player.mental - 5);
            StateManager.addMessage(
              "🏚️ 忍痛割肉，以原价55折出手，回笼¥" +
                proceeds.toLocaleString() +
                "。心里堵得慌，但总比全砸进去强。",
              "warning",
            );
          },
        },
        {
          text: "✊ 加入业主维权团，去要说法",
          hint: "花¥500，等结果",
          apply: function (st) {
            st.flags._developerCollapseTriggered = true;
            st.flags._propertyRightsGroup = true;
            st.flags._propertyCollapseDay = st.player.day;
            st.resources.cash = Math.max(0, st.resources.cash - 500);
            st.player.fame = Math.min(100, st.player.fame + 5);
            st.player.mental = Math.max(0, st.player.mental - 3);
            StateManager.addMessage(
              "✊ 加入了业主维权团，交了¥500组织费，开始每周去工地讨说法。名气+5，路很长…",
              "info",
            );
          },
        },
        {
          text: "🤞 相信政府会托底，先等等",
          hint: "不确定结果",
          apply: function (st) {
            st.flags._developerCollapseTriggered = true;
            st.flags._waitingPropertyResolution = true;
            st.flags._propertyCollapseDay = st.player.day;
            StateManager.addMessage(
              "🤞 新闻说政府在研究'保交楼'政策，先观望…内心不安，但还是选择相信。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "property_rights_win",
      phase: "street",
      icon: "✊",
      title: "维权有结果了！",
      story:
        "历时数月的业主维权终于有了结果——银行接管开发商，承诺续建烂尾楼，业主获得延期赔偿。你们赢了！",
      conditions: function (st) {
        return (
          !!st.flags._propertyRightsGroup &&
          st.player.day >= (st.flags._propertyCollapseDay || 0) + 25 &&
          !st.flags._propertyRightsResolved
        );
      },
      choices: [
        {
          text: "🎉 接受赔偿，继续等交房",
          hint: "补偿¥800+名气",
          apply: function (st) {
            st.flags._propertyRightsResolved = true;
            st.resources.cash += 800;
            st.resources.totalEarned += 800;
            st.player.fame = Math.min(100, st.player.fame + 8);
            st.player.mental = Math.min(100, st.player.mental + 8);
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            StateManager.addMessage(
              "✊ 维权成功！获得赔偿¥800，房子续建中，预计延期2年交付。名气+8，心里终于松了口气。",
              "success",
            );
          },
        },
        {
          text: "💰 拿赔偿后转让房产",
          hint: "套现离场",
          apply: function (st) {
            st.flags._propertyRightsResolved = true;
            var inv = st.investment || {};
            var total = 0;
            if (inv.properties) {
              for (var pi2 = 0; pi2 < inv.properties.length; pi2++) {
                total +=
                  inv.properties[pi2].currentPrice ||
                  inv.properties[pi2].buyPrice;
              }
              inv.properties = [];
            }
            var proceeds = Math.round(total * 0.72) + 800;
            st.resources.cash += proceeds;
            st.resources.totalEarned += proceeds;
            st.player.fame = Math.min(100, st.player.fame + 5);
            StateManager.addMessage(
              "💰 拿了¥800赔偿，再以72折转让房产，共到手¥" +
                proceeds.toLocaleString() +
                "。彻底离场，心里反而轻松了。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "subsidy_war_join",
      phase: "street",
      icon: "🛵",
      title: "补贴大战：骑手窗口期",
      story:
        "群里炸锅了！某外卖平台宣布每单补贴+¥3，另一家立刻跟进——这是一年里骑手最好赚的时候。平台代理正在路边招人，注册就给¥60，补贴大战期间接单收益额外+30%。错过了这个窗口，下次不知道什么时候再有。",
      conditions: function (st) {
        var hasNews =
          st.activeNews &&
          st.activeNews.some(function (n) {
            return n && n.id === "platform_subsidy_war";
          });
        return (
          hasNews &&
          !st.flags._subsidyWarJoinSeen &&
          st.player.phase === "street"
        );
      },
      choices: [
        {
          text: "📱 立刻注册骑手（加入窗口）",
          hint: "注册奖励¥60，补贴期多接单",
          apply: function (st) {
            st.flags._subsidyWarRider = st.player.day;
            st.flags._subsidyWarJoinSeen = true;
            st.resources.cash += 60;
            st.player.physique = Math.max(
              0,
              Math.min(100, (st.player.physique || 10) - 2),
            );
            StateManager.addMessage(
              "🛵 成功注册为平台骑手！注册奖励¥60到手，补贴大战期间接单收益额外+30%。体力多消耗了一点，但值！",
              "event",
            );
          },
        },
        {
          text: "👀 不参与，继续本来的计划",
          hint: "错过窗口，但省了体力",
          apply: function (st) {
            st.flags._subsidyWarJoinSeen = true;
            st.flags._subsidyWarWatched = true;
            StateManager.addMessage(
              "💭 选择旁观。补贴大战是机会，但平台说变脸就变脸——还是做自己的事。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "subsidy_war_crash",
      phase: "street",
      icon: "📉",
      title: "补贴战落幕：平台变脸了",
      story:
        "骑手群突然安静了。昨晚平台悄悄改了规则：每单补贴砍掉¥2，还加了「差评扣款机制」。你算了一下，实际收入比刚注册时少了35%。几个老骑手已经愤而离职，另一些准备组团维权。你才跑了这几天——怎么办？",
      conditions: function (st) {
        var hasRiderWinter =
          st.activeNews &&
          st.activeNews.some(function (n) {
            return n && n.id === "rider_winter";
          });
        return (
          hasRiderWinter &&
          !!st.flags._subsidyWarRider &&
          !st.flags._subsidyWarCrashSeen
        );
      },
      choices: [
        {
          text: "😤 直接退出，不干了",
          hint: "结算余款¥30，拿经验走人",
          apply: function (st) {
            st.flags._subsidyWarCrashSeen = true;
            st.flags._subsidyWarLeft = true;
            st.resources.cash += 30;
            StateManager.addMessage(
              "😤 退���了骑手平台，结清¥30余款。这波赚了点但也磨了体力——教训：补贴战是短期机会，别依赖平台。",
              "warning",
            );
          },
        },
        {
          text: "📢 联合维权（要求恢复补贴）",
          hint: "组织维权，积累声望",
          cost: 50,
          apply: function (st) {
            st.flags._subsidyWarCrashSeen = true;
            st.flags._riderRightsComplaint = st.player.day;
            st.resources.cash -= 50;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            StateManager.addMessage(
              "📢 加入骑手维权团，花了¥50组织费，名气+5。平台已知晓，15天后看结果。",
              "event",
            );
          },
        },
        {
          text: "🍜 用攒的钱转型开摊（需¥500）",
          hint: "投资自己，身体是革命的本钱",
          cost: 500,
          apply: function (st) {
            st.flags._subsidyWarCrashSeen = true;
            st.flags._exRiderVendor = true;
            st.resources.cash -= 200;
            st.player.physique = Math.min(100, (st.player.physique || 10) + 3);
            StateManager.addMessage(
              "🍜 用补贴大战攒的钱开了个摆摊！花掉¥200启动本钱，体质+3（骑手练出来的腿脚）。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "rider_rights_resolve",
      phase: "street",
      icon: "⚖️",
      title: "骑手维权结果出炉",
      story:
        "维权团传来消息：经过多次谈判，平台同意象征性支付一次「和解金」，但拒绝恢复补贴，并向组织者发了封号警告。团队里分成两派——一派说拿钱走人，活该；另一派说继续上诉，这是原则问题。",
      conditions: function (st) {
        return (
          !!st.flags._riderRightsComplaint &&
          st.player.day >= (st.flags._riderRightsComplaint || 0) + 15 &&
          !st.flags._riderRightsResolved
        );
      },
      choices: [
        {
          text: "💰 接受和解金",
          hint: "按天数结算，¥280+",
          apply: function (st) {
            var days = Math.min(
              30,
              st.player.day - (st.flags._riderRightsComplaint || st.player.day),
            );
            var payout = 280 + days * 3;
            st.flags._riderRightsResolved = true;
            st.resources.cash += payout;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            StateManager.addMessage(
              "💰 接受和解，到手¥" +
                payout +
                "，名气+3。不多，但也算有个结果，总比拖着强。",
              "event",
            );
          },
        },
        {
          text: "⚖️ 继续上诉，等法律途径",
          hint: "名声在外，但结果难测",
          apply: function (st) {
            st.flags._riderRightsResolved = true;
            st.flags._riderRightsAppealing = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            st.player.mental = Math.max(0, st.player.mental - 5);
            StateManager.addMessage(
              "⚖️ 继续走法律途径，名气+8（被媒体关注）。心理压力+，但你觉得这是原则——也许是正义，也许是更久的等待。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "property_govt_rescue",
      phase: "street",
      icon: "🏛️",
      title: "政府出手保交楼",
      story:
        "等了这么久，终于等到消息：政府启动'保交楼'专项基金，接管你的楼盘续建。代价是交付时间推迟2年，但总归不会烂尾了。",
      conditions: function (st) {
        return (
          !!st.flags._waitingPropertyResolution &&
          st.player.day >= (st.flags._propertyCollapseDay || 0) + 20 &&
          !st.flags._propertyGovtResolved
        );
      },
      choices: [
        {
          text: "😮‍💨 接受现实，继续持有",
          hint: "房产价值-25%，但保住了",
          apply: function (st) {
            st.flags._propertyGovtResolved = true;
            var inv = st.investment || {};
            if (inv.properties) {
              for (var pi3 = 0; pi3 < inv.properties.length; pi3++) {
                var p = inv.properties[pi3];
                p.currentPrice = Math.round(
                  (p.currentPrice || p.buyPrice) * 0.75,
                );
              }
            }
            st.player.mental = Math.min(100, st.player.mental + 5);
            StateManager.addMessage(
              "🏛️ 政府托底了。房产账面贬值25%，但终究没烂尾。等2年吧，也许还能涨回来。",
              "info",
            );
          },
        },
        {
          text: "🏃 趁现在还能转让，赶紧出手",
          hint: "70折卖出",
          apply: function (st) {
            st.flags._propertyGovtResolved = true;
            var inv2 = st.investment || {};
            var total2 = 0;
            if (inv2.properties) {
              for (var pi4 = 0; pi4 < inv2.properties.length; pi4++) {
                total2 +=
                  inv2.properties[pi4].currentPrice ||
                  inv2.properties[pi4].buyPrice;
              }
              inv2.properties = [];
            }
            var out = Math.round(total2 * 0.7);
            st.resources.cash += out;
            st.resources.totalEarned += out;
            StateManager.addMessage(
              "🏃 以70折出手，到手¥" +
                out.toLocaleString() +
                "。政府是托底了，但这2年的等待成本太高，离场更划算。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "acquisition_chance",
      phase: "street",
      icon: "🏪",
      title: "有人想把店转给你",
      story:
        "巷口“老李茶饮”贴了转让告示。老李说儿子留学，他要去陪读，店铺连带设备打包¥80,000。地段一般但有老客户，每月流水能跑个万把块。你掂量了下口袋：手头是有这个钱，可一旦砸下去，就是把家底押在一家小店上了。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day > 100 &&
          st.resources.cash >= 80000 &&
          !st.flags._acquisitionTeaSeen
        );
      },
      choices: [
        {
          text: "💰 接手茶饮店（¥80,000）",
          hint: "成为小老板，月流水预期",
          cost: 80000,
          apply: function (st) {
            st.flags._acquisitionTeaSeen = true;
            st.flags._acquiredTeaStore = st.player.day;
            st.flags._teaStoreCash = 80000;
            st.resources.cash -= 80000;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
            st.player.mental = Math.min(100, st.player.mental + 3);
            StateManager.addMessage(
              "🏪 签约接手老李茶饮，¥80,000打了水漂——啊不，是投了下去。门口挂上你的名字，从今天起就是小老板了。名气+4，心智+3。",
              "event",
            );
            if (typeof StateManager.markDirty === "function") {
              StateManager.markDirty();
            }
          },
        },
        {
          text: "🤔 看着不错但风险大，先放放",
          hint: "保留现金，错过机会",
          apply: function (st) {
            st.flags._acquisitionTeaSeen = true;
            st.flags._acquisitionTeaPassed = true;
            StateManager.addMessage(
              "🤔 算了，老李这店看着客流不行，砸进去八万怕是回不来。决定先观望——希望以后不会后悔。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "acquisition_struggle",
      phase: "street",
      icon: "📉",
      title: "茶饮店难做啊…",
      story:
        "接手老李茶饮快一个月了。问题来了：原来稳定的老客户大半流失（觉得“换老板就变味”），新顾客又不来。每月房租水电¥2,500，上个月只赚¥800，倒贴¥1,700。隔壁新开的“星巴超”反倒生意火爆——同样卖茶，人家做出了网红奶茶概念，年轻人在门口排队。",
      conditions: function (st) {
        return (
          !!st.flags._acquiredTeaStore &&
          st.player.day >= (st.flags._acquiredTeaStore || 0) + 25 &&
          !st.flags._acquisitionStruggleSeen
        );
      },
      choices: [
        {
          text: "💸 立刻挂牌出售（亏损止损）",
          hint: "原价 65 折出手",
          apply: function (st) {
            st.flags._acquisitionStruggleSeen = true;
            st.flags._acquisitionDealtEarly = true;
            st.flags._acquiredTeaStore = null;
            var proceeds = Math.round(80000 * 0.65);
            st.resources.cash += proceeds;
            st.resources.totalEarned += proceeds;
            st.player.mental = Math.max(0, st.player.mental - 5);
            st.needs.happiness = Math.max(0, st.needs.happiness - 10);
            StateManager.addMessage(
              "💸 挂牌一周就找到接盘的（应该是星巴超派人来谈的），原价65折成交，回笼¥" +
                proceeds.toLocaleString() +
                "。亏了¥28,000，但心里那块石头总算落地了。",
              "warning",
            );
          },
        },
        {
          text: "🔥 砸钱搞营销翻盘（¥15,000）",
          hint: "一搏成败",
          cost: 15000,
          apply: function (st) {
            st.flags._acquisitionStruggleSeen = true;
            st.flags._acquisitionFighting = true;
            st.flags._acquisitionFightDay = st.player.day;
            st.resources.cash -= 15000;
            st.player.mental = Math.max(0, st.player.mental - 3);
            StateManager.addMessage(
              "🔥 砸¥15,000搞了波装修+网红打卡墙+小红书投放。现在就赌这20天能不能起来——心智-3，骰子已经掷下去了。",
              "event",
            );
          },
        },
        {
          text: "🐢 慢慢熬，相信老客户会回来",
          hint: "继续每月小亏，等市场",
          apply: function (st) {
            st.flags._acquisitionStruggleSeen = true;
            st.flags._acquisitionEnduring = true;
            st.flags._teaStoreCash = (st.flags._teaStoreCash || 80000) - 1700;
            StateManager.addMessage(
              "🐢 决定再熬熬。老李说前两年开店也亏过，老顾客认人不认招牌。一个月再亏¥1,700——但你相信时间会告诉你答案。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "acquisition_swallow",
      phase: "street",
      icon: "🦈",
      title: "星巴超来收店了",
      story:
        "星巴超的人正式登门：他们要在这条街扩张，一口气收购周边7家店面，给你的报价是当初买入价的45%。代理人很客气：“王老板，您这店地段确实不错，但说实话——独立小店是熬不过我们这种连锁的。这价钱已经是给老李面子。”望着空荡荡的店面，你忽然意识到：自己这一年的折腾，不过是给对手培育了一片好地皮。",
      conditions: function (st) {
        var afterFight =
          !!st.flags._acquisitionFighting &&
          st.player.day >= (st.flags._acquisitionFightDay || 0) + 20;
        var enduring = !!st.flags._acquisitionEnduring;
        return (
          (afterFight || enduring) &&
          !st.flags._acquisitionSwallowSeen &&
          !st.flags._acquisitionDealtEarly
        );
      },
      choices: [
        {
          text: "🦈 接受收购（45 折，离场）",
          hint: "回笼现金，对手做大",
          apply: function (st) {
            st.flags._acquisitionSwallowSeen = true;
            st.flags._starbucksDominant = true;
            st.flags._businessLessonLearned = true;
            st.flags._acquiredTeaStore = null;
            var proceeds = Math.round(80000 * 0.45);
            st.resources.cash += proceeds;
            st.resources.totalEarned += proceeds;
            st.player.mental = Math.min(100, st.player.mental + 4);
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 3,
            );
            st.player.fame = Math.max(0, (st.player.fame || 0) - 3);
            StateManager.addMessage(
              "🦈 签字画押，到手¥" +
                proceeds.toLocaleString() +
                "。这一年的折腾换来¥" +
                proceeds.toLocaleString() +
                " + 智力+3 + 心智+4——你学到了：在独立小店和连锁巨头之间，独立小店没有规模护城河。星巴超借你的店面壮大成本街最大连锁，未来它可能会出现在股市上。",
              "warning",
            );
          },
        },
        {
          text: "✊ 死磕到底，绝不卖给他们",
          hint: "保留店面，但每月小亏",
          apply: function (st) {
            st.flags._acquisitionSwallowSeen = true;
            st.flags._teaStoreUnderdog = true;
            st.player.mental = Math.min(100, st.player.mental + 8);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "✊ 把代理人请出店门：“这店不卖。”心智+8，名气+6（街坊都知道有个倔脾气的小老板）。代价是每月还要继续亏¥1,700，但有些事比钱重要。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "industry_disruption_warning",
      phase: "street",
      icon: "⚡",
      title: "新入局者来了",
      story:
        "刷短视频时刷到一条爆款：你做的这行，有个 90 后团队搞了个新模式——他们用「订阅制+数据派单」，把传统从业者效率提升了 40%，3 个月就吃掉了 15% 的市场。看着评论区那句“老一代再不转型就要被淘汰了”，你心里一紧——你做这行已经 30 多天，今天的单量明显比一个月前少。",
      conditions: function (st) {
        var jobStreaks = st.flags._jobStreaks || {};
        var totalDays = 0;
        for (var k in jobStreaks) {
          if (Object.prototype.hasOwnProperty.call(jobStreaks, k)) {
            var rec = jobStreaks[k];
            var c = rec && typeof rec === "object" ? rec.count || 0 : rec || 0;
            if (c > totalDays) totalDays = c;
          }
        }
        return (
          st.player.phase === "street" &&
          st.player.day > 180 &&
          totalDays >= 30 &&
          !st.flags._disruptionSeen
        );
      },
      choices: [
        {
          text: "📚 买课学新模式（¥800，10 天后看选择）",
          hint: "技能 XP+，进入转型期",
          cost: 800,
          apply: function (st) {
            st.flags._disruptionSeen = true;
            st.flags._disruptionStudying = st.player.day;
            st.resources.cash -= 800;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            // 任意已有技能 +5 XP（增强当前职业）
            if (st.skills) {
              for (var sk in st.skills) {
                if (Object.prototype.hasOwnProperty.call(st.skills, sk)) {
                  if ((st.skills[sk].exp || 0) > 0) {
                    st.skills[sk].exp = (st.skills[sk].exp || 0) + 5;
                    break;
                  }
                }
              }
            }
            StateManager.addMessage(
              "📚 报名了¥800的“行业转型训练营”。智力+2，主力技能XP+5。10天后看你选什么道。",
              "event",
            );
          },
        },
        {
          text: "💪 不慌，靠老经验稳住（坚守）",
          hint: "工作收入小幅下降",
          apply: function (st) {
            st.flags._disruptionSeen = true;
            st.flags._disruptionHolding = st.player.day;
            st.player.mental = Math.min(100, st.player.mental + 3);
            StateManager.addMessage(
              "💪 嗤之以鼻——你这行的老门道不是几个 90 后看几集网课就能颠覆的。心智+3，但接下来一段时间收入可能会受冲击。",
              "info",
            );
          },
        },
        {
          text: "🚪 这行不行了，趁早抽身",
          hint: "立得名气补偿，但失去工作连击",
          apply: function (st) {
            st.flags._disruptionSeen = true;
            st.flags._disruptionExited = true;
            st.flags._jobStreaks = {}; // 清零所有连击
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.player.mental = Math.max(0, st.player.mental - 3);
            StateManager.addMessage(
              "🚪 决定放弃这行，转向新机会。所有工作连击清零（重头再来），名气+3（识时务），心智-3（承认自己跟不上时代不容易）。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "industry_pivot_choice",
      phase: "street",
      icon: "🔀",
      title: "训练营毕业了，怎么走？",
      story:
        "10 天的转型训练营结束。你学了“数据派单”逻辑，也认识了几个同期转型的人——有人做副业，有人 all-in 新模式。教练说：“旧行业的活儿还能干 6~12 个月，但每过一季度市场份额会少 5%。你现在转，是抄底；再等半年，可能连转的成本都凑不齐了。”",
      conditions: function (st) {
        return (
          !!st.flags._disruptionStudying &&
          st.player.day >= (st.flags._disruptionStudying || 0) + 10 &&
          !st.flags._disruptionPivotSeen
        );
      },
      choices: [
        {
          text: "🚀 All-in 新模式（清空连击，能力+15）",
          hint: "主动转型，40 天后看结果",
          apply: function (st) {
            st.flags._disruptionPivotSeen = true;
            st.flags._disruptionPivoted = st.player.day;
            st.flags._jobStreaks = {};
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 5,
            );
            st.player.agility = Math.min(100, (st.player.agility || 10) + 3);
            st.player.mental = Math.min(100, st.player.mental + 5);
            if (st.skills && st.skills.coding) {
              st.skills.coding.exp = (st.skills.coding.exp || 0) + 30;
            }
            StateManager.addMessage(
              "🚀 All-in 新模式！智力+5、敏捷+3、心智+5，编程XP+30（数据派单也是技术活）。连击清零，但你站到了浪头上。",
              "event",
            );
          },
        },
        {
          text: "🌗 副业兼职两边压（不舍弃老本行）",
          hint: "收入两边小赚，AP 消耗略增",
          apply: function (st) {
            st.flags._disruptionPivotSeen = true;
            st.flags._disruptionSidehustle = st.player.day;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 3,
            );
            st.player.physique = Math.max(
              0,
              Math.min(100, (st.player.physique || 10) - 1),
            );
            StateManager.addMessage(
              "🌗 决定两边都搞——白天老本行，晚上新模式接单。智力+3，体质-1（双线消耗）。稳是稳，但每件事都做不到极致。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "industry_aftermath",
      phase: "street",
      icon: "📊",
      title: "行业洗牌结束了",
      story:
        "三个月过去了。新模式占了行业 40% 份额，老模式从业者中能转型的转了，转不了的去了别的行业。你回头看自己这阵子的选择，发现这行业的洗牌就像潮水——不是谁错了，是潮水在往哪个方向走。",
      conditions: function (st) {
        var pivoted =
          !!st.flags._disruptionPivoted &&
          st.player.day >= (st.flags._disruptionPivoted || 0) + 40;
        var holding =
          !!st.flags._disruptionHolding &&
          st.player.day >= (st.flags._disruptionHolding || 0) + 50;
        var sidehustle =
          !!st.flags._disruptionSidehustle &&
          st.player.day >= (st.flags._disruptionSidehustle || 0) + 40;
        return (
          (pivoted || holding || sidehustle) &&
          !st.flags._disruptionAftermathSeen
        );
      },
      choices: [
        {
          text: "📊 接受这个时代",
          hint: "结算结果",
          apply: function (st) {
            st.flags._disruptionAftermathSeen = true;
            var msg = "";
            if (st.flags._disruptionPivoted) {
              // 转型成功者
              st.resources.cash += 3500;
              st.resources.totalEarned += 3500;
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 10) + 3,
              );
              st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
              st.flags._earlyAdopter = true;
              msg =
                "📊 转型那批人吃到了红利。新平台给早期入驻者发了¥3,500奖金，智力+3，名气+5。“早行动者”标签解锁——以后类似机会触发时优先看到。";
            } else if (st.flags._disruptionSidehustle) {
              // 副业派
              st.resources.cash += 1800;
              st.resources.totalEarned += 1800;
              st.player.physique = Math.max(0, (st.player.physique || 10) - 2);
              st.player.mental = Math.min(100, st.player.mental + 3);
              msg =
                "📊 两线作战的回报：累计副业收入¥1,800入账，体质-2（这阵子真累），心智+3（你扛过来了）。结论是不够极致，但没掉队。";
            } else if (st.flags._disruptionHolding) {
              // 坚守派
              st.resources.cash = Math.max(0, st.resources.cash - 1200);
              st.player.mental = Math.max(0, st.player.mental - 6);
              st.needs.happiness = Math.max(0, st.needs.happiness - 10);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
              msg =
                "📊 坚守的代价：行业萎缩，你这3个月少赚¥1,200，心智-6，心情-10。但街坊给你贴了“老把式”的标签（名气+4）——不是赢家，但是某种意义上的“守艺人”。";
            }
            StateManager.addMessage(msg, "event");
          },
        },
      ],
    },
    {
      id: "arbitrage_techpark_tip",
      phase: "street",
      icon: "📐",
      title: "小美的内幕消息：科技园要扩建",
      story:
        "小美把你拉到咖啡厅角落，压低声音：「我导师在规划局有熟人——科技园东边那片旧厂房要被政府收储了，规划是扩建三期。消息还没公开，估计两周内官宣。你要是能在那片搞到点什么……你懂的。」她眨眨眼，把一张二手房东的名片推过来。",
      conditions: function (st) {
        var rel = st.relationships && st.relationships.xiao_mei;
        var aff = rel ? rel.affinity || 0 : 0;
        return (
          st.player.phase === "street" &&
          aff >= 50 &&
          st.player.day >= 40 &&
          !st.flags._arbitrageTechparkTipSeen
        );
      },
      choices: [
        {
          text: "🏠 联系二手房东，谈下那片旧厂房（¥2000定金）",
          hint: "赌一把：如果真扩建，租金暴涨",
          cost: 2000,
          apply: function (st) {
            st.flags._arbitrageTechparkTipSeen = true;
            st.flags._arbitrageTechparkActed = st.player.day;
            st.resources.cash -= 2000;
            st.player.mental = Math.min(100, (st.player.mental || 10) + 2);
            StateManager.addMessage(
              "📐 你咬咬牙付了¥2000定金，以租代持谈下了一间旧厂房仓库的优先承租权。如果消息是真的，等科技园扩建公告一出，租金至少翻倍；如果是假的……¥2000打水漂。心智+2，赌局开始了。",
              "event",
            );
          },
        },
        {
          text: "📈 先小仓位买入科技股（¥1000买HUAW/SMIC）",
          hint: "温和布局，扩建利好科技板块",
          cost: 1000,
          apply: function (st) {
            st.flags._arbitrageTechparkTipSeen = true;
            st.flags._arbitrageTechparkModerate = st.player.day;
            st.resources.cash -= 1000;
            // 记入临时投资，政策兑现时模拟增值
            st.flags._arbitrageTechparkInvest =
              (st.flags._arbitrageTechparkInvest || 0) + 1000;
            StateManager.addMessage(
              "📈 你不敢all-in，但买了¥1000科技股。扩建利好整个板块，即使消息有误也不会亏太多。",
              "info",
            );
          },
        },
        {
          text: "🤨 内幕交易是违法的，当没听过",
          hint: "安全，但可能错过机会",
          apply: function (st) {
            st.flags._arbitrageTechparkTipSeen = true;
            st.flags._arbitrageTechparkSkipped = true;
            st.player.mental = Math.min(100, (st.player.mental || 10) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "🤨 你谢过小美，但没碰那名片。有些钱烫手，你知道。心智+3，心情+5——晚上睡得着比什么都重要。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "arbitrage_techpark_payoff",
      phase: "street",
      icon: "🏗️",
      title: "科技园扩建正式官宣！",
      story:
        "新闻推送弹出来：市政府正式公告科技园东区旧厂房改造项目立项，总投资80亿，预计带动周边3公里商业价值提升30%~50%。你记得两周前小美说的那番话——现在，到了看选择的时候了。",
      conditions: function (st) {
        return (
          (!!st.flags._arbitrageTechparkActed ||
            !!st.flags._arbitrageTechparkModerate) &&
          !st.flags._arbitrageTechparkPayoffSeen &&
          st.player.day >=
            (st.flags._arbitrageTechparkActed ||
              st.flags._arbitrageTechparkModerate ||
              0) +
              12
        );
      },
      choices: [
        {
          text: "💰 把优先承租权转手（溢价300%！）",
          hint: "空手套白狼，净赚¥5000~8000",
          conditions: function (st) {
            return !!st.flags._arbitrageTechparkActed;
          },
          apply: function (st) {
            st.flags._arbitrageTechparkPayoffSeen = true;
            var profit = Random.int(5000, 7999);
            st.resources.cash += profit;
            st.resources.totalEarned += profit;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            st.player.mental = Math.min(100, (st.player.mental || 10) + 3);
            StateManager.addMessage(
              "🏗️ 你以¥" +
                profit +
                "把优先承租权转手给了一家连锁便利店品牌，净赚¥" +
                (profit - 2000) +
                "！小美的消息比黄金还值钱。名气+8，心智+3。",
              "success",
            );
          },
        },
        {
          text: "📉 卖出科技股（获利+40%）",
          hint: "见好就收",
          conditions: function (st) {
            return !!st.flags._arbitrageTechparkModerate;
          },
          apply: function (st) {
            st.flags._arbitrageTechparkPayoffSeen = true;
            var invest = st.flags._arbitrageTechparkInvest || 1000;
            var ret = Math.round(invest * 1.4);
            st.resources.cash += ret;
            st.resources.totalEarned += ret;
            StateManager.addMessage(
              "📉 你卖掉了科技股，到手¥" +
                ret +
                "，收益¥" +
                (ret - invest) +
                "（+40%）。虽然不是暴富，但稳健也是一种胜利。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "arbitrage_license_tip",
      phase: "street",
      icon: "📋",
      title: "张姐透露：摊贩要持证上岗了",
      story:
        "张姐神神秘秘地凑过来说：「我表妹在市场监管局，说下个月要出新规——所有街头摊贩必须持《食品摊贩登记卡》才能出摊，无证的一律罚款¥200起。现在办证只需要¥50+健康证，等新规一出，办证窗口排都排不上，黄牛价至少¥500。」她把一张健康体检表塞到你手里。",
      conditions: function (st) {
        var rel = st.relationships && st.relationships.sister_zhang;
        var aff = rel ? rel.affinity || 0 : 0;
        return (
          st.player.phase === "street" &&
          aff >= 45 &&
          st.player.day >= 30 &&
          !st.flags._arbitrageLicenseTipSeen
        );
      },
      choices: [
        {
          text: "✅ 立刻去办证（¥50 + 体检¥30）",
          hint: "趁窗口期低价锁定资格",
          cost: 80,
          apply: function (st) {
            st.flags._arbitrageLicenseTipSeen = true;
            st.flags._arbitrageLicenseTipDay = st.player.day;
            st.flags._arbitrageLicenseActed = true;
            st.resources.cash -= 80;
            st.flags._hasBusinessLicense = true; // 复用个体户执照标志
            st.player.physique = Math.max(0, (st.player.physique || 10) - 1);
            StateManager.addMessage(
              "✅ 你花¥80办了登记卡和健康证。虽然体检抽血有点疼，但心里踏实了——等新规一出，这证就是你的护身符。",
              "success",
            );
          },
        },
        {
          text: "💡 多办3张卡倒卖（¥240）",
          hint: "黄牛操作，有风险",
          cost: 240,
          apply: function (st) {
            st.flags._arbitrageLicenseTipSeen = true;
            st.flags._arbitrageLicenseTipDay = st.player.day;
            st.flags._arbitrageLicenseScalped = true;
            st.resources.cash -= 240;
            st.player.fame = Math.max(0, (st.player.fame || 0) - 3);
            st.player.mental = Math.max(0, (st.player.mental || 10) - 2);
            StateManager.addMessage(
              "💡 你一口气办了4张卡（含自己的）。回来的路上有点心虚——但这城里谁不找点路子呢？名气-3（万一被查），心智-2。",
              "warning",
            );
          },
        },
        {
          text: "🙄 应该不会查这么严吧",
          hint: "赌一把，省钱但风险高",
          apply: function (st) {
            st.flags._arbitrageLicenseTipSeen = true;
            st.flags._arbitrageLicenseTipDay = st.player.day;
            st.flags._arbitrageLicenseIgnored = true;
            StateManager.addMessage(
              "🙄 你把体检表塞进兜里。这座城市的规定三天两头变，不一定查得到你头上……吧？",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "arbitrage_license_payoff",
      phase: "street",
      icon: "🛂",
      title: "城管突击检查！持证新规来了",
      story:
        "果然，新规说来就来。城管大队今天出现在街头，挨个检查登记卡。有证的摊贩照常营业，没证的被当场开罚单——¥200起步。你远远看着几个没证的同行跟城管吵起来，心里庆幸（或后悔）自己当初的选择。",
      conditions: function (st) {
        var tipDay = st.flags._arbitrageLicenseTipDay || 0;
        return (
          (st.flags._arbitrageLicenseActed ||
            st.flags._arbitrageLicenseScalped ||
            st.flags._arbitrageLicenseIgnored) &&
          !st.flags._arbitrageLicensePayoffSeen &&
          st.player.day >= tipDay + 12
        );
      },
      choices: function (st) {
        var choices = [];
        if (st.flags._arbitrageLicenseActed) {
          choices.push({
            text: "🛡️ 亮出登记卡，合法营业",
            hint: "无损失，安心",
            apply: function (s) {
              s.flags._arbitrageLicensePayoffSeen = true;
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 10);
              s.player.fame = Math.min(100, (s.player.fame || 0) + 3);
              StateManager.addMessage(
                "🛡️ 你从容亮出登记卡。城管点点头就走了。旁边几个没证的同行投来羡慕的眼神。心情+10，名气+3。当初那¥80花得太值了。",
                "success",
              );
            },
          });
        }
        if (st.flags._arbitrageLicenseScalped) {
          choices.push({
            text: "💰 把多办的卡高价卖出（¥400/张）",
            hint: "净赚¥960",
            apply: function (s) {
              s.flags._arbitrageLicensePayoffSeen = true;
              var profit = 400 * 3;
              s.resources.cash += profit;
              s.resources.totalEarned += profit;
              s.player.fame = Math.max(0, (s.player.fame || 0) + 5);
              s.player.mental = Math.min(100, (s.player.mental || 10) + 2);
              StateManager.addMessage(
                "💰 你以¥400一张把3张卡卖给了急得跳脚的同行，净赚¥960！消息灵通就是生产力。名气+5（他们感谢你），心智+2。",
                "success",
              );
            },
          });
        }
        if (st.flags._arbitrageLicenseIgnored) {
          choices.push({
            text: "😰 被罚¥200 + 今天不能出摊",
            hint: "损失惨重",
            apply: function (s) {
              s.flags._arbitrageLicensePayoffSeen = true;
              s.resources.cash = Math.max(0, (s.resources.cash || 0) - 200);
              s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 15);
              s.player.mental = Math.max(0, (s.player.mental || 10) - 2);
              StateManager.addMessage(
                "😰 你被开了¥200罚单，今天还不能出摊。早知道当初花¥80办了……心情-15，心智-2。这座城市不给你第二次机会。",
                "danger",
              );
            },
          });
        }
        return choices;
      },
    },
    {
      id: "arbitrage_hygiene_tip",
      phase: "street",
      icon: "🧹",
      title: "陈师傅说：卫生评级有补贴",
      story:
        "陈师傅一边擦灶台一边跟你说：「我听餐饮协会的老哥说，市里要搞『餐饮卫生星级评定』，A级店每季度补贴¥2000，还上推荐榜单。但是评上A级得提前整改——换不锈钢灶台、装灭蝇灯、搞明厨亮灶，成本大概¥1500。现在申请窗口还没开，等正式通知出来再搞，排队至少俩月。」他把一份整改清单递过来。",
      conditions: function (st) {
        var rel = st.relationships && st.relationships.chef_chen;
        var aff = rel ? rel.affinity || 0 : 0;
        return (
          st.player.phase === "street" &&
          aff >= 40 &&
          st.player.day >= 50 &&
          !st.flags._arbitrageHygieneTipSeen
        );
      },
      choices: [
        {
          text: "🔧 花¥1500提前整改（赌能评A级）",
          hint: "先投后收，长期回报",
          cost: 1500,
          apply: function (st) {
            st.flags._arbitrageHygieneTipSeen = true;
            st.flags._arbitrageHygieneInvested = st.player.day;
            st.resources.cash -= 1500;
            st.player.physique = Math.max(0, (st.player.physique || 10) - 2);
            StateManager.addMessage(
              "🔧 你买了不锈钢灶台和灭蝇灯，花了两天把摊位彻底改造。¥1500见了底，但看着焕然一新的操作台，你觉得值。",
              "event",
            );
          },
        },
        {
          text: "🧹 小修小补（花¥300简单应付）",
          hint: "可能评B级，补贴少但成本低",
          cost: 300,
          apply: function (st) {
            st.flags._arbitrageHygieneTipSeen = true;
            st.flags._arbitrageHygieneModerate = st.player.day;
            st.resources.cash -= 300;
            StateManager.addMessage(
              "🧹 你买了灭蝇灯和新的围裙，灶台擦了又擦。花¥300做了表面功夫——评不上A级，但至少不会被罚。",
              "info",
            );
          },
        },
        {
          text: "🤷 小本生意，折腾不起",
          hint: "省钱但错过补贴",
          apply: function (st) {
            st.flags._arbitrageHygieneTipSeen = true;
            st.flags._arbitrageHygieneSkipped = true;
            StateManager.addMessage(
              "🤷 你把整改清单塞进口袋。小本生意经不起折腾——先看看再说。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "arbitrage_hygiene_payoff",
      phase: "street",
      icon: "⭐",
      title: "卫生星级评定结果出炉",
      story:
        "餐饮协会的公告贴出来了。你挤在人群里找自己的摊位号——评级结果直接决定了接下来一个季度你能拿多少补贴、上什么推荐榜单。",
      conditions: function (st) {
        return (
          (st.flags._arbitrageHygieneInvested ||
            st.flags._arbitrageHygieneModerate ||
            st.flags._arbitrageHygieneSkipped) &&
          !st.flags._arbitrageHygienePayoffSeen &&
          st.player.day >=
            (st.flags._arbitrageHygieneInvested ||
              st.flags._arbitrageHygieneModerate ||
              0) +
              15
        );
      },
      choices: function (st) {
        var choices = [];
        if (st.flags._arbitrageHygieneInvested) {
          choices.push({
            text: "⭐ A级！拿补贴¥2000 + 推荐榜单",
            hint: "提前整改的回报",
            apply: function (s) {
              s.flags._arbitrageHygienePayoffSeen = true;
              s.resources.cash += 2000;
              s.resources.totalEarned += 2000;
              s.player.fame = Math.min(100, (s.player.fame || 0) + 12);
              s.player.mental = Math.min(100, (s.player.mental || 10) + 5);
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 20);
              StateManager.addMessage(
                "⭐ A级！你拿到了首批A级评定！补贴¥2000到手，你的摊位上了官方推荐榜——以后不愁客源了。名气+12，心智+5，心情+20。那¥1500花得真值！",
                "success",
              );
            },
          });
        }
        if (st.flags._arbitrageHygieneModerate) {
          choices.push({
            text: "🥈 B级，补贴¥500 + 继续整改建议",
            hint: "中等回报，有上升空间",
            apply: function (s) {
              s.flags._arbitrageHygienePayoffSeen = true;
              s.resources.cash += 500;
              s.resources.totalEarned += 500;
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 5);
              StateManager.addMessage(
                "🥈 B级。补贴¥500到手，公告建议你升级灶台设备争取下季度评A。小修小补没白做，但也没赚大钱。",
                "info",
              );
            },
          });
        }
        if (st.flags._arbitrageHygieneSkipped) {
          choices.push({
            text: "❌ C级，无补贴 + 被警告",
            hint: "没投入就没回报",
            apply: function (s) {
              s.flags._arbitrageHygienePayoffSeen = true;
              s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 10);
              StateManager.addMessage(
                "❌ C级（最低档）。没有补贴，还被贴了整改警告。看着隔壁A级摊位排起长队，你有点后悔当初没听陈师傅的。心情-10。",
                "warning",
              );
            },
          });
        }
        return choices;
      },
    },
    {
      id: "fate_company_boom",
      phase: "street",
      icon: "🚀",
      title: "内幕消息：你的持仓股要起飞",
      story:
        "你在刷新闻时看到一条不起眼的行业快讯——你持股的那家公司刚刚发布了超预期的产品数据。圈内小范围流传，正式公告要等三天后才出。现在买入还来得及……但这算内幕交易吗？",
      conditions: function (st) {
        if (
          st.player.phase !== "street" ||
          !st.investment ||
          !st.investment.stockHoldings ||
          !st.investment.stockHoldings.length
        )
          return false;
        if (!st.enterpriseFate || !st.enterpriseFate.companies) return false;
        for (var cid in st.enterpriseFate.companies) {
          var co = st.enterpriseFate.companies[cid];
          if (
            co &&
            co.knownToPlayer &&
            co.fateEventHistory &&
            co.fateEventHistory.length > 0
          ) {
            var last = co.fateEventHistory[co.fateEventHistory.length - 1];
            if (
              last &&
              last.eventType === "product_breakout" &&
              !st.flags._fateBoomSeen
            )
              return true;
          }
        }
        return false;
      },
      choices: [
        {
          text: "💰 加仓买入（¥5000）",
          hint: "消息兑现后收益+40%",
          cost: 5000,
          apply: function (st) {
            st.flags._fateBoomSeen = true;
            st.resources.cash -= 5000;
            st.flags._fateInsiderInvest =
              (st.flags._fateInsiderInvest || 0) + 5000;
            st.player.mental = Math.max(0, st.player.mental - 2);
            StateManager.addMessage(
              "💰 你通过场外渠道加仓¥5000。等正式公告出来，这笔钱至少能变成¥7000。但心里有点虚——这算内幕交易吗？心智-2。",
              "warning",
            );
          },
        },
        {
          text: "📊 等公告出来再操作（安全但晚一步）",
          hint: "合法合规，但收益打折扣",
          apply: function (st) {
            st.flags._fateBoomSeen = true;
            st.flags._fateBoomSafe = true;
            StateManager.addMessage(
              "📊 你合上了手机。内幕交易是红线，碰不得。等公告出来再操作，赚少一点但睡得着。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "fate_market_mover",
      phase: "street",
      icon: "📉",
      title: "你的股票大跳水！",
      story:
        "你持仓的一只股票突然异动，跌幅超过10%！消息面上，关联公司爆出了负面新闻。你要不要紧急操作？",
      conditions: function (st) {
        if (
          !st.investment ||
          !st.investment.stockHoldings ||
          !st.investment.stockHoldings.length
        )
          return false;
        if (!st.enterpriseFate || !st.enterpriseFate.companies) return false;
        var hasEvent = false;
        for (var cid in st.enterpriseFate.companies) {
          var co = st.enterpriseFate.companies[cid];
          if (
            co &&
            co.knownToPlayer &&
            co.fateEventHistory &&
            co.fateEventHistory.length > 0
          ) {
            var last = co.fateEventHistory[co.fateEventHistory.length - 1];
            if (
              last &&
              st.player.day - last.day <= 3 &&
              (last.eventType === "scandal" ||
                last.eventType === "cash_crisis" ||
                last.eventType === "market_erosion")
            ) {
              if (typeof CORP_STOCK_MAP !== "undefined") {
                var symbols = CORP_STOCK_MAP[cid] || [];
                for (
                  var si = 0;
                  si < st.investment.stockHoldings.length;
                  si++
                ) {
                  if (
                    symbols.indexOf(st.investment.stockHoldings[si].symbol) >= 0
                  ) {
                    hasEvent = true;
                    break;
                  }
                }
              }
            }
          }
        }
        return hasEvent && !st.flags._fateMoverSeen;
      },
      choices: [
        {
          text: "🏃 紧急减仓（卖出持仓的50%）",
          hint: "止损，控制亏损",
          apply: function (st) {
            st.flags._fateMoverSeen = true;
            var soldTotal = 0;
            var holdings = st.investment.stockHoldings;
            for (var i = holdings.length - 1; i >= 0; i--) {
              var h = holdings[i];
              var mkt =
                st.investment.stockMarket &&
                st.investment.stockMarket[h.symbol];
              if (mkt) {
                var sellShares = Math.floor(h.shares * 0.5);
                if (sellShares > 0) {
                  var revenue = Math.round(mkt.price * sellShares * 100) / 100;
                  st.resources.cash += revenue;
                  st.resources.totalEarned += revenue;
                  h.shares -= sellShares;
                  soldTotal += revenue;
                }
              }
            }
            st.investment.stockHoldings = st.investment.stockHoldings.filter(
              function (h) {
                return h.shares > 0;
              },
            );
            StateManager.addMessage(
              "🏃 你紧急减仓，回笼¥" +
                soldTotal.toLocaleString() +
                "。虽然亏了一些，但至少保住了本金。",
              "warning",
            );
          },
        },
        {
          text: "🧘 持有不动，相信长期价值",
          hint: "长期持有，等待反弹",
          apply: function (st) {
            st.flags._fateMoverSeen = true;
            st.player.mental = Math.min(100, st.player.mental + 3);
            StateManager.addMessage(
              "🧘 你关掉了交易软件。好公司总会回来——你告诉自己。心智+3。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "single_room_noise",
      phase: "street",
      icon: "🔊",
      title: "隔壁的噪音",
      story:
        "搬进单间后本以为能安静些，没想到隔壁是一对刚搬来的年轻情侣，半夜还在吵架摔东西。你敲了墙提醒，对方反而更大声了。明天还要早起打工，怎么办？",
      conditions: function (st) {
        return st.player.phase === "street" && (st.housing.tier || 0) === 2;
      },
      choices: [
        {
          text: "🔨 再敲一次墙，严肃警告",
          hint: "强硬态度",
          apply: function (st) {
            if (st.player.physique >= 30) {
              st.needs.happiness = Math.min(100, st.needs.happiness + 5);
              StateManager.addMessage(
                "你用力敲了几次墙，声音沉稳有力。隔壁安静了十几分钟，虽然没完全停止，但明显收敛了。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 8);
              StateManager.addMessage(
                "你敲了墙，但对方似乎觉得你软弱可欺，反而更加肆无忌惮。你烦躁地躺了一夜。",
                "warning",
              );
            }
          },
        },
        {
          text: "🏢 找房东投诉",
          hint: "走正规途径",
          apply: function (st) {
            if (Random.chance(0.5)) {
              st.needs.happiness = Math.min(100, st.needs.happiness + 3);
              StateManager.addMessage(
                "房东去隔壁说了一下，当晚安静了。但房东暗示你：「别老投诉，人家交着房租呢。」",
                "info",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 5);
              StateManager.addMessage(
                "房东说会去说，但第二天一切照旧。你意识到在这地方，房东也不会太管这些事。",
                "warning",
              );
            }
          },
        },
        {
          text: "😮‍💨 戴上耳塞忍一晚",
          hint: "省钱省事",
          apply: function (st) {
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "你戴上耳塞勉强睡了一晚，但睡眠质量很差，第二天精神不振。疲劳+15。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "single_room_delivery",
      phase: "street",
      icon: "📦",
      title: "外卖放门口被偷了",
      story:
        "点了一份¥25的外卖，放在门口准备回去拿，出来时发现袋子不见了。楼道里有个陌生人正鬼鬼祟祟地走开。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.housing.tier || 0) >= 2 &&
          st.resources.cash >= 25
        );
      },
      choices: [
        {
          text: "🏃 追上去问清楚",
          hint: "追回损失",
          apply: function (st) {
            if (Random.chance(0.35 + (st.player.agility || 20) * 0.01)) {
              st.needs.happiness = Math.min(100, st.needs.happiness + 3);
              StateManager.addMessage(
                "你追上去拦住了对方，对方慌慌张张地把外卖扔下跑了。虽然饭有点凉了，但至少没白花钱。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 5);
              StateManager.addMessage(
                "你追了几步，对方跑得飞快，转眼就消失在巷子里。25块钱和一顿饭都没了。",
                "warning",
              );
            }
          },
        },
        {
          text: "😤 算了，再点一份",
          hint: "花钱买省心",
          apply: function (st) {
            st.resources.cash -= 25;
            st.needs.hunger = Math.min(100, st.needs.hunger + 25);
            st.needs.happiness = Math.max(0, st.needs.happiness - 3);
            StateManager.addMessage(
              "你又点了一份，边吃边想：在这地方，这种事太常见了。",
              "info",
            );
          },
        },
        {
          text: "🚶 去路边随便吃点",
          hint: "不浪费",
          apply: function (st) {
            st.resources.cash -= 5;
            st.needs.hunger = Math.min(100, st.needs.hunger + 15);
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "你走到路边小摊花了5块钱买了个包子填肚子。20块钱算是交了学费。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "apartment_borrow_money",
      phase: "street",
      icon: "💸",
      title: "邻居来借钱",
      story:
        "住对门的那个独居中年男人来敲门，说家里急事要借¥200，明天就还。你们平时见面只是点头之交，但你注意到他神色慌张，手一直在抖。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.housing.tier || 0) >= 3 &&
          st.resources.cash >= 200
        );
      },
      choices: [
        {
          text: "💰 借给他",
          hint: "帮一把",
          apply: function (st) {
            st.resources.cash -= 200;
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            if (Random.chance(0.6)) {
              st.resources.cash += 200;
              st.needs.happiness = Math.min(100, st.needs.happiness + 3);
              StateManager.addMessage(
                "第二天他果然还了钱，还带了盒饼干：「谢谢啊，要不是你，我真不知道怎么办。」",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 10);
              StateManager.addMessage(
                "第二天敲门没人应，问物业说这户人搬走了。200块钱打水漂了。",
                "danger",
              );
            }
          },
        },
        {
          text: "🤔 先问问是什么事",
          hint: "谨慎些",
          apply: function (st) {
            if (Random.chance(0.5)) {
              st.needs.happiness = Math.max(0, st.needs.happiness - 2);
              StateManager.addMessage(
                "他支支吾吾说不清楚，只说「家里有事」。你更怀疑了，没借。他失望地走了。",
                "info",
              );
            } else {
              st.resources.cash -= 200;
              st.needs.happiness = Math.min(100, st.needs.happiness + 3);
              StateManager.addMessage(
                "他说家人生病要买药。你信了，借了200。第二天他没说还钱的事，你也没好意思催。",
                "warning",
              );
            }
          },
        },
        {
          text: "🚪 说自己也困难，关上门",
          hint: "明哲保身",
          apply: function (st) {
            st.needs.happiness = Math.max(0, st.needs.happiness - 3);
            StateManager.addMessage(
              "你说自己最近也紧，关上了门。隔着门听到他叹了口气走了。心里有点不是滋味。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "apartment_gym_chance",
      phase: "street",
      icon: "💪",
      title: "小区健身房办卡优惠",
      story:
        "小区物业在门口发传单：「业主专享！健身房年卡¥300，原价¥800。」你住的一居室正好在这个小区里。健身对身体好，但300块也不便宜。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          (st.housing.tier || 0) >= 3 &&
          st.resources.cash >= 300
        );
      },
      choices: [
        {
          text: "💪 办卡！投资健康",
          hint: "长期收益",
          apply: function (st) {
            st.resources.cash -= 300;
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            StateManager.addMessage(
              "你办了健身卡。虽然300块不少，但想想能锻炼身体，值了。心情+8。",
              "success",
            );
          },
        },
        {
          text: "🏃 先试试免费器械区",
          hint: "省点钱",
          apply: function (st) {
            st.needs.fatigue = Math.max(0, st.needs.fatigue - 8);
            st.player.physique = Math.min(100, (st.player.physique || 20) + 1);
            StateManager.addMessage(
              "你在小区免费器械区练了一周，虽然效果有限，但省了300块。体质+1，疲劳-8。",
              "info",
            );
          },
        },
        {
          text: "🚶 不用了，跑步就行",
          hint: "零成本",
          apply: function (st) {
            st.needs.fatigue = Math.max(0, st.needs.fatigue - 5);
            StateManager.addMessage(
              "你决定每天晨跑，零成本也能锻炼身体。省下的300块可以干别的。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "re_gamble",
      phase: "street",
      icon: "🏗️",
      title: "拆迁规划图流出",
      story:
        "巷口公告栏贴了一张城市规划公示图，隐约能看到你家那片被红线圈了起来。围观的邻居们窃窃私语：「要拆了要拆了！」你心算了一下——如果真拆，私房能赔¥150,000~¥250,000。但你手上没房，得现在买才有机会。卖私房的老王开口就要¥80,000，「你不买明天别人就买了。」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 40 &&
          st.resources.cash >= 80000 &&
          !st.flags._reGambleSeen
        );
      },
      choices: [
        {
          text: "🏠 赌拆迁！买下老王的私房（¥80,000）",
          hint: "押注拆迁",
          cost: 80000,
          apply: function (st) {
            st.flags._reGambleSeen = true;
            st.flags._reBoughtHouse = st.player.day;
            st.resources.cash -= 80000;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            StateManager.addMessage(
              "🏠 花了¥80,000把老王的破房子买下来了。邻居们说你疯了，但你知道自己在赌什么。",
              "event",
            );
            scheduleChainEvent(st, "re_demolition", 30, "street");
          },
        },
        {
          text: "🤔 观望一下，不参与",
          hint: "放弃拆迁红利",
          apply: function (st) {
            st.flags._reGambleSeen = true;
            st.flags._rePassed = true;
            StateManager.addMessage(
              "🤔 算了，拆迁这种事八字没一撇，¥80,000不是小数目。你决定先看看。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "re_demolition",
      phase: "street",
      icon: "📏",
      title: "拆迁办来了",
      story:
        "一个月后，拆迁办果然带着测量仪进村了！公示出来了：标准赔偿¥180,000/户，签字后30天打款。但老王那房子面积有争议，按照新规可能只能赔¥120,000。隔壁几户已经在商量联合起来抬价。你的选择是——",
      conditions: function (st) {
        return !!st.flags._reBoughtHouse && !st.flags._reDemolitionSeen;
      },
      choices: [
        {
          text: "✅ 接受官方赔偿（¥120,000净得）",
          hint: "稳妥，净赚¥40,000",
          apply: function (st) {
            st.flags._reDemolitionSeen = true;
            st.flags._reAccepted = true;
            st.resources.cash += 120000;
            st.resources.totalEarned += 120000;
            st.player.mental = Math.min(100, (st.player.mental || 20) + 3);
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            StateManager.addMessage(
              "✅ 签字、按手印、拿钱。卡里多了¥120,000，当初投¥80,000净赚¥40,000。但走出拆迁办时，你听到隔壁老王一家吵起来了——他卖给你的房子现在值180,000。",
              "event",
            );
            scheduleChainEvent(st, "re_settle", 15, "street");
          },
        },
        {
          text: "🤝 联合邻居抬价（团结阵线）",
          hint: "可能赔更多",
          apply: function (st) {
            st.flags._reDemolitionSeen = true;
            st.flags._reCoalition = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            st.player.mental = Math.min(100, (st.player.mental || 20) + 2);
            StateManager.addMessage(
              "🤝 你和邻居们签了共同协议：统一要价¥220,000，少一分不签。领头的老张说「团结就是力量！」你心里没底——但试试总没错。",
              "event",
            );
            scheduleChainEvent(st, "re_coalition_result", 20, "street");
          },
        },
        {
          text: "💢 反悔不卖了（拒绝签字）",
          hint: "会被定为钉子户",
          apply: function (st) {
            st.flags._reDemolitionSeen = true;
            st.flags._reHoldout = true;
            st.player.mental = Math.min(100, (st.player.mental || 20) + 5);
            st.player.fame = Math.min(100, (st.player.fame || 0) - 5);
            StateManager.addMessage(
              "💢 你告诉拆迁办：「这房我不卖了。」拆迁办的人面无表情地在本子上记了一笔。邻居们用奇怪的眼神看你——有人佩服你胆大，有人说你傻。",
              "event",
            );
            scheduleChainEvent(st, "re_holdout_end", 40, "street");
          },
        },
      ],
    },
    {
      id: "re_settle",
      phase: "street",
      icon: "💰",
      title: "拆迁款到账，然后呢？",
      story:
        "¥120,000的拆迁款到账了。你看着余额，这是你人生中最大的一笔钱。但城里的房价已经因为这波拆迁涨了一轮——你手上这点钱，付首付都不够。工友老张说：「赶紧买房！不买房钱会贬值！」也有人劝你：「拿这钱做点小生意吧。」你坐在出租屋里，对着手机银行发了一晚上的呆。",
      conditions: function (st) {
        return (
          !!st.flags._reAccepted &&
          !st.flags._reSettleSeen &&
          st.player.day >= (st.flags._reBoughtHouse || 0) + 45
        );
      },
      choices: [
        {
          text: "🏠 加钱上杠杆买房（再借¥120,000首付）",
          hint: "借钱也要上车",
          apply: function (st) {
            st.flags._reSettleSeen = true;
            st.flags._reBoughtProperty = true;
            st.flags._rePropertyDay = st.player.day;
            st.resources.cash -= 120000;
            st.resources.debt = (st.resources.debt || 0) + 120000;
            st.player.mental = Math.min(100, (st.player.mental || 20) + 5);
            StateManager.addMessage(
              "🏠 你看了一个月房，最后咬牙借了¥120,000加首付，在郊区买了套小两居。月供¥2,800，但心里踏实了——在这个城市，你终于有了一块属于自己的地方。",
              "event",
            );
          },
        },
        {
          text: "💼 拿¥80,000做本钱创业",
          hint: "自己当老板",
          apply: function (st) {
            st.flags._reSettleSeen = true;
            st.flags._reStartedBusiness = true;
            var bonus = Random.int(60000, 139999);
            st.resources.cash -= 80000;
            st.resources.cash += bonus;
            st.resources.totalEarned += bonus;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
            StateManager.addMessage(
              "💼 你用¥80,000在夜市盘了个摊位卖炒粉。生意比想象中好——第一个月净赚¥" +
                bonus.toLocaleString() +
                "！但每天凌晨两点收摊，累得跟狗一样。",
              "event",
            );
          },
        },
        {
          text: "💳 存银行吃利息，继续打工",
          hint: "保守选择",
          apply: function (st) {
            st.flags._reSettleSeen = true;
            st.flags._reSaved = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage(
              "💳 你把¥120,000存了定期，年化3.5%。利息虽然不多，但看着卡里六位数的余额，心里踏实了不少。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "re_coalition_result",
      phase: "street",
      icon: "⚖️",
      title: "团结阵线破裂",
      story:
        "等了20天，阵线内部开始松动了。老张的老婆生病需要钱，他第一个偷偷签了协议。阵线一破，拆迁办各个击破——最后到你这儿的时候，赔偿降到了¥110,000。比原来少了一万。邻居们互相指责，说有人当了叛徒。你也拿到了钱，但心里不是滋味。",
      conditions: function (st) {
        return !!st.flags._reCoalition && !st.flags._reCoalitionSeen;
      },
      choices: [
        {
          text: "😔 签字拿¥110,000走人",
          hint: "虽然少了，但结束了",
          apply: function (st) {
            st.flags._reCoalitionSeen = true;
            st.flags._reCoalitionAccepted = true;
            st.resources.cash += 110000;
            st.resources.totalEarned += 110000;
            st.player.mental = Math.max(0, (st.player.mental || 20) - 3);
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            StateManager.addMessage(
              "😔 签字拿了¥110,000。净赚¥30,000，比直接接受少了¥10,000。但你学到了：人越多的事，越不能拖。智力+2。",
              "event",
            );
          },
        },
        {
          text: "💥 拒绝签字，继续死扛",
          hint: "赌到底",
          apply: function (st) {
            st.flags._reCoalitionSeen = true;
            st.flags._reHoldout = true;
            st.player.mental = Math.min(100, (st.player.mental || 20) + 8);
            st.player.fame = Math.min(100, (st.player.fame || 0) - 8);
            StateManager.addMessage(
              "💥 你拒绝了。拆迁办的人冷冷地说：「那行，您慢慢住着。」邻居们都签完了，整栋楼只剩你一户。晚上一个人住在空荡荡的楼里，听着外面的风声，忽然有点害怕。名-8，心智+8。",
              "event",
            );
            scheduleChainEvent(st, "re_holdout_end", 30, "street");
          },
        },
      ],
    },
    {
      id: "re_holdout_end",
      phase: "street",
      icon: "🏚️",
      title: "钉子户的结局",
      story:
        "坚持了几个月，最终还是撑不住了。楼里断了水电气，周围全围了铁皮，进出要翻墙。晚上有陌生人敲窗「劝」你搬走。最后你在街道办的调解下签了字——赔偿¥90,000。老王在街对面看着你，脸上说不清是同情还是庆幸。",
      conditions: function (st) {
        return !!st.flags._reHoldout && !st.flags._reHoldoutEndSeen;
      },
      choices: [
        {
          text: "😞 签字拿¥90,000，彻底认了",
          hint: "身心俱疲",
          apply: function (st) {
            st.flags._reHoldoutEndSeen = true;
            st.flags._reFinalSettled = true;
            st.resources.cash += 90000;
            st.resources.totalEarned += 90000;
            st.player.mental = Math.max(0, (st.player.mental || 20) - 5);
            st.needs.happiness = Math.max(0, st.needs.happiness - 10);
            st.player.fame = Math.min(100, (st.player.fame || 0) - 5);
            StateManager.addMessage(
              "😞 签字那一刻，你不是如释重负，而是空虚。净赚¥10,000，折腾了几个月，搭进去多少精力。你告诉自己：下次别赌这么大。",
              "warning",
            );
          },
        },
        {
          text: "⚖️ 找律师维权，走法律程序",
          hint: "耗时长，但公平",
          apply: function (st) {
            st.flags._reHoldoutEndSeen = true;
            st.flags._reLawyered = true;
            st.resources.cash -= 15000;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 3,
            );
            StateManager.addMessage(
              "⚖️ 你找了法律援助中心，开始走行政诉讼。律师说有希望争取到¥130,000~¥150,000，但要等6~12个月。你填了一堆表格，按了好几次手印。不管结果如何，你在学着用规则保护自己。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "startup_meet_coder",
      phase: "street",
      icon: "💻",
      title: "咖啡馆里的创业梦",
      story:
        "你在咖啡馆躲雨时，邻座一个戴眼镜的年轻人突然跟你搭话：「哥们，我看你像个干实事的人。」他叫小陈，是个全栈程序员，说做了一个AI笔记App，就差一个懂市场和运营的合伙人。他不要你全职，先投点钱试试——¥30,000换10%股份。他眼睛亮得让人不忍心拒绝。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 50 &&
          st.resources.cash >= 30000 &&
          !st.flags._startupMeetSeen
        );
      },
      choices: [
        {
          text: "💰 投资¥30,000赌一把",
          hint: "10%股份",
          cost: 30000,
          apply: function (st) {
            st.flags._startupMeetSeen = true;
            st.flags._startupInvested = st.player.day;
            st.flags._startupAmount = 30000;
            st.resources.cash -= 30000;
            st.player.mental = Math.min(100, (st.player.mental || 20) + 3);
            StateManager.addMessage(
              "💻 你给了一个陌生程序员¥30,000。他留着你的微信，说「两个月后见分晓」。",
              "event",
            );
            scheduleChainEvent(st, "startup_progress", 45, "street");
          },
        },
        {
          text: "💵 投少点试试水（¥10,000）",
          hint: "小赌怡情",
          cost: 10000,
          apply: function (st) {
            st.flags._startupMeetSeen = true;
            st.flags._startupInvested = st.player.day;
            st.flags._startupAmount = 10000;
            st.resources.cash -= 10000;
            StateManager.addMessage(
              "💵 你给了¥10,000，占3%股份。小陈说「有总比没有好」。",
              "info",
            );
            scheduleChainEvent(st, "startup_progress", 45, "street");
          },
        },
        {
          text: "🚶 婉拒，留个微信",
          hint: "不投钱",
          apply: function (st) {
            st.flags._startupMeetSeen = true;
            st.flags._startupPassed = true;
            StateManager.addMessage(
              "🚶 你留了小陈的微信，说「以后有机会合作」。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "startup_progress",
      phase: "street",
      icon: "📊",
      title: "App数据出来了",
      story:
        "小陈深夜给你发了条微信，附件是一张用户增长曲线图——上线6周，DAU从0冲到了12,000，日新增1,500。他电话里兴奋地说：「我们要火了！但服务器扛不住了，需要再投¥50,000扩容，或者找机构投资进来——机构要占30%。」",
      conditions: function (st) {
        return !!st.flags._startupInvested && !st.flags._startupProgressSeen;
      },
      choices: [
        {
          text: "🔥 追加¥50,000自己扛",
          hint: "赌它成为独角兽",
          cost: 50000,
          apply: function (st) {
            st.flags._startupProgressSeen = true;
            st.flags._startupBurning = true;
            st.resources.cash -= 50000;
            StateManager.addMessage(
              "🔥 你把最后的积蓄砸了进去。小陈说「老板大气！」",
              "event",
            );
            scheduleChainEvent(st, "startup_exit", 40, "street");
          },
        },
        {
          text: "🤝 同意机构进场（股份稀释）",
          hint: "安全但股份少",
          apply: function (st) {
            st.flags._startupProgressSeen = true;
            st.flags._startupVCFunding = true;
            StateManager.addMessage(
              "🤝 机构¥200万进场，你的股份被稀释了。但公司活下来了。",
              "info",
            );
            scheduleChainEvent(st, "startup_exit", 60, "street");
          },
        },
        {
          text: "🛑 止损退出，卖给小陈",
          hint: "拿回本金",
          apply: function (st) {
            st.flags._startupProgressSeen = true;
            st.flags._startupExitedEarly = true;
            var refund = Math.round((st.flags._startupAmount || 30000) * 1.2);
            st.resources.cash += refund;
            StateManager.addMessage(
              "🛑 你跟小陈说急用钱，他加了20%还给你——¥" +
                refund.toLocaleString() +
                "。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "startup_exit",
      phase: "street",
      icon: "🎢",
      title: "创业的终点",
      story:
        "小陈电话里的声音很平静：「公司被字节龙收购了，¥1,200万全现金。你的股份按比例折算……钱明天打到账上。」你握着手机，回忆起那个雨天的咖啡馆。",
      conditions: function (st) {
        return (
          (!!st.flags._startupBurning || !!st.flags._startupVCFunding) &&
          !st.flags._startupExitSeen
        );
      },
      choices: [
        {
          text: "🎉 收购成功！拿钱离场",
          hint: "赌赢了",
          apply: function (st) {
            st.flags._startupExitSeen = true;
            st.flags._startupWin = true;
            var multi = st.flags._startupBurning ? 3.5 : 1.8;
            var base = st.flags._startupAmount || 30000;
            var payout = Math.round(base * multi) + Random.int(0, 49999);
            st.resources.cash += payout;
            st.resources.totalEarned += payout;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 12);
            st.player.mental = Math.min(100, (st.player.mental || 20) + 10);
            StateManager.addMessage(
              "🎉 收购完成！你拿到了¥" +
                payout.toLocaleString() +
                "。这就是风险投资。",
              "event",
            );
          },
        },
        {
          text: "💥 收购谈崩公司解散",
          hint: "赌输了",
          apply: function (st) {
            st.flags._startupExitSeen = true;
            st.flags._startupLose = true;
            st.player.mental = Math.max(0, (st.player.mental || 20) - 8);
            st.needs.happiness = Math.max(0, st.needs.happiness - 15);
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 4,
            );
            StateManager.addMessage(
              "💥 收购方最后关头压价，小陈没同意。公司解散。你的股份变成了空气。智力+4。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "gray_offer",
      phase: "street",
      icon: "😈",
      title: "老张的「路子」",
      story:
        "工友老张把你拉到一边，压低声音说批发市场那边有块「空地」——几个小摊贩每月交¥500保护费，没人管。他已经收了三个月了，想找个帮手，「你体格不错，往那一站就有威慑力。不用动手，分你三成。」他掏出三张皱巴巴的¥100，「这是你这个月的预付款。」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          !st.flags._grayOfferSeen &&
          st.player.physique >= 25
        );
      },
      choices: [
        {
          text: "😈 加入，先干一个月",
          hint: "来钱快有风险",
          apply: function (st) {
            st.flags._grayOfferSeen = true;
            st.flags._grayJoined = st.player.day;
            st.resources.cash += 300;
            st.player.fame = Math.max(0, (st.player.fame || 0) - 3);
            StateManager.addMessage(
              "😈 你接了那¥300。老张拍拍你肩膀：「识相！」",
              "warning",
            );
            scheduleChainEvent(st, "gray_collect", 15, "street");
          },
        },
        {
          text: "🙅 拒绝并劝老张",
          hint: "正义感",
          apply: function (st) {
            st.flags._grayOfferSeen = true;
            st.flags._grayRefused = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "🙅 「这钱烫手。」老张笑了笑：「你呀，早晚会明白。」",
              "success",
            );
          },
        },
        {
          text: "📱 匿名举报给派出所",
          hint: "彻底解决",
          apply: function (st) {
            st.flags._grayOfferSeen = true;
            st.flags._grayReported = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            StateManager.addMessage(
              "📱 你下班后绕到派出所匿名举报了。「早就盯着了。」",
              "event",
            );
            scheduleChainEvent(st, "gray_aftermath_reported", 20, "street");
          },
        },
      ],
    },
    {
      id: "gray_collect",
      phase: "street",
      icon: "📸",
      title: "第一次收钱",
      story:
        "跟老张去批发市场收钱。卖水果的老王头颤巍巍地数了¥500递给老张，眼神里全是恐惧。你站在旁边，觉得自己像一堵墙——不是保护他的墙，是压在他心口的墙。市场角落新装了两个监控摄像头。",
      conditions: function (st) {
        return !!st.flags._grayJoined && !st.flags._grayCollectSeen;
      },
      choices: [
        {
          text: "😶 拿着钱走，不管监控",
          hint: "继续干",
          apply: function (st) {
            st.flags._grayCollectSeen = true;
            st.flags._grayDeepIn = true;
            st.resources.cash += 500;
            st.player.fame = Math.max(0, (st.player.fame || 0) - 5);
            StateManager.addMessage(
              "😶 分到你手上¥500。监控正对着收钱的位置。",
              "warning",
            );
            scheduleChainEvent(st, "gray_cleanup", 25, "street");
          },
        },
        {
          text: "😰 跟老张说不干了",
          hint: "趁早退出",
          apply: function (st) {
            st.flags._grayCollectSeen = true;
            st.flags._grayQuit = true;
            StateManager.addMessage(
              "😰 你跟老张说不干了。他盯着你：「行，不勉强。」至少你退出来了。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "gray_cleanup",
      phase: "street",
      icon: "🚔",
      title: "警察回访调查",
      story:
        "两个便衣警察在工地门口等你：「××批发市场的案子，监控显示你上个月15号在场。你认识张××吗？」",
      conditions: function (st) {
        return !!st.flags._grayDeepIn && !st.flags._grayCleanupSeen;
      },
      choices: [
        {
          text: "😰 说实话，当污点证人",
          hint: "从轻处理",
          apply: function (st) {
            st.flags._grayCleanupSeen = true;
            st.flags._grayTestified = true;
            st.resources.cash = Math.max(0, st.resources.cash - 2000);
            st.player.fame = Math.max(0, (st.player.fame || 0) - 8);
            st.player.mental = Math.min(100, (st.player.mental || 20) + 6);
            StateManager.addMessage(
              "😰 你交代了。老张被拘留。你配合调查被从轻处理。",
              "warning",
            );
          },
        },
        {
          text: "🤐 说什么也没看见",
          hint: "侥幸脱身",
          apply: function (st) {
            st.flags._grayCleanupSeen = true;
            st.flags._grayLied = true;
            st.player.mental = Math.max(0, (st.player.mental || 20) - 8);
            StateManager.addMessage(
              "🤐 你说路过买水果什么也没看见。警察没追问，但那个眼神让你睡不着。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "gray_aftermath_reported",
      phase: "street",
      icon: "⚖️",
      title: "老张被抓了",
      story:
        "批发市场的案子破了。老王头托人转告你：「谢谢。」你不知道他怎么知道的。但你知道自己在这片的名声变了——有人敬你，也有人躲着你。",
      conditions: function (st) {
        return !!st.flags._grayReported && !st.flags._grayAftermathSeen;
      },
      choices: [
        {
          text: "😌 接受感谢坦然面对",
          hint: "你做对了",
          apply: function (st) {
            st.flags._grayAftermathSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage(
              "😌 老王头塞给你一袋橘子。好人会赢。",
              "success",
            );
          },
        },
        {
          text: "😰 担心老张的人报复",
          hint: "紧张不安",
          apply: function (st) {
            st.flags._grayAftermathSeen = true;
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "😰 你绕开批发市场走了一周。对的事也有代价。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "edu_rumor",
      phase: "street",
      icon: "📰",
      title: "教育行业要变天了",
      story:
        "热搜第一：教育部要出台新规，学科类培训机构可能全部关停。你手上持有教育股，那个做家教的朋友刚续了半年房租。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          !st.flags._eduRumorSeen
        );
      },
      choices: [
        {
          text: "📉 卖空教育类股票",
          hint: "做空获利",
          apply: function (st) {
            st.flags._eduRumorSeen = true;
            st.flags._eduShorted = true;
            st.resources.cash += 5000;
            StateManager.addMessage(
              "📉 你卖空了教育股。如果政策落地能赚更多。",
              "event",
            );
            scheduleChainEvent(st, "edu_crash", 5, "street");
          },
        },
        {
          text: "😰 赶紧抛售教育股",
          hint: "避险",
          apply: function (st) {
            st.flags._eduRumorSeen = true;
            st.flags._eduPanicSold = true;
            StateManager.addMessage("😰 你清仓了教育股。", "info");
            scheduleChainEvent(st, "edu_crash", 5, "street");
          },
        },
        {
          text: "🤔 不管，可能是假消息",
          hint: "以不变应万变",
          apply: function (st) {
            st.flags._eduRumorSeen = true;
            st.flags._eduIgnored = true;
            StateManager.addMessage("🤔 你关了手机。大概率是谣言。", "info");
            scheduleChainEvent(st, "edu_crash", 5, "street");
          },
        },
      ],
    },
    {
      id: "edu_crash",
      phase: "street",
      icon: "💥",
      title: "「双减」真的来了",
      story:
        "双减文件正式公布：学科类培训不得上市融资。教育股暴跌90%。你的家教兼职也发来消息：「抱歉不需要了。」",
      conditions: function (st) {
        return !!st.flags._eduRumorSeen && !st.flags._eduCrashSeen;
      },
      choices: [
        {
          text: "🏢 去教培公司收二手课桌椅",
          hint: "别人恐惧时贪婪",
          apply: function (st) {
            st.flags._eduCrashSeen = true;
            st.flags._eduBoughtAssets = true;
            st.resources.cash -= 5000;
            StateManager.addMessage(
              "🏢 你花了¥5,000买了满满一车课桌椅和投影仪。",
              "event",
            );
            scheduleChainEvent(st, "edu_aftermath", 30, "street");
          },
        },
        {
          text: "💼 联系被裁老师做私教",
          hint: "私下接单",
          apply: function (st) {
            st.flags._eduCrashSeen = true;
            st.flags._eduPrivateTutor = true;
            StateManager.addMessage(
              "💼 找到几个离职老师愿意私下接单——你抽30%中介。灰色但需求在。",
              "event",
            );
            scheduleChainEvent(st, "edu_aftermath", 30, "street");
          },
        },
        {
          text: "😞 认栽找别的出路",
          hint: "重新开始",
          apply: function (st) {
            st.flags._eduCrashSeen = true;
            st.flags._eduMovedOn = true;
            StateManager.addMessage("😞 你默默打开了招聘软件。", "warning");
          },
        },
      ],
    },
    {
      id: "edu_aftermath",
      phase: "street",
      icon: "♻️",
      title: "风暴过后",
      story:
        "双减落地一个月后，课桌椅在闲鱼上翻倍卖掉了。前老师在小区偷偷上网课月入¥12,000。政策没需求消失——只是藏到了地下。",
      conditions: function (st) {
        return (
          (!!st.flags._eduBoughtAssets || !!st.flags._eduPrivateTutor) &&
          !st.flags._eduAftermathSeen
        );
      },
      choices: [
        {
          text: "♻️ 翻倍卖出课桌椅赚差价",
          hint: "¥5,000→¥12,000",
          apply: function (st) {
            st.flags._eduAftermathSeen = true;
            var earn = Random.int(7000, 9999);
            st.resources.cash += earn;
            StateManager.addMessage(
              "♻️ 净赚¥" + earn.toLocaleString() + "。",
              "event",
            );
          },
        },
        {
          text: "📚 开深夜自习室",
          hint: "长期经营",
          apply: function (st) {
            st.flags._eduAftermathSeen = true;
            st.flags._eduStudyRoom = true;
            st.resources.cash -= 20000;
            StateManager.addMessage(
              "📚 你在城中村开了「深夜自习室」——¥5/小时。第一周来了12个人。",
              "event",
            );
          },
        },
        {
          text: "🤝 继续做私教中介",
          hint: "灰色可持续",
          apply: function (st) {
            st.flags._eduAftermathSeen = true;
            st.flags._eduMiddleman = true;
            var income = Random.int(3000, 7999);
            st.resources.cash += income;
            StateManager.addMessage(
              "🤝 月中介收入¥" +
                income.toLocaleString() +
                "。政策消灭不了需求。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "ev_frenzy",
      phase: "street",
      icon: "⚡",
      title: "新能源车补贴退坡",
      story:
        "新闻弹窗：国家新能源补贴退坡30%。比丫迪暴跌8%，蔚小李跌12%~15%。你持有的新能源股浮盈20%还没走。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 60 &&
          !st.flags._evFrenzySeen
        );
      },
      choices: [
        {
          text: "📉 割肉清仓落袋为安",
          hint: "保住利润",
          apply: function (st) {
            st.flags._evFrenzySeen = true;
            st.flags._evPanicSold = true;
            StateManager.addMessage("📉 你清掉了所有新能源仓位。", "info");
            scheduleChainEvent(st, "ev_shakeout", 15, "street");
          },
        },
        {
          text: "💰 别人恐惧我贪婪加仓",
          hint: "逆势操作",
          apply: function (st) {
            st.flags._evFrenzySeen = true;
            st.flags._evBoughtDip = true;
            st.resources.cash -= 30000;
            StateManager.addMessage(
              "💰 你在跌停板加仓。朋友说你疯了。",
              "event",
            );
            scheduleChainEvent(st, "ev_shakeout", 15, "street");
          },
        },
        {
          text: "🧘 不动拿着看看",
          hint: "不慌",
          apply: function (st) {
            st.flags._evFrenzySeen = true;
            st.flags._evHeld = true;
            StateManager.addMessage(
              "🧘 你关掉软件。投资最重要的是不慌。",
              "info",
            );
            scheduleChainEvent(st, "ev_shakeout", 15, "street");
          },
        },
      ],
    },
    {
      id: "ev_shakeout",
      phase: "street",
      icon: "🏭",
      title: "行业洗牌开始了",
      story:
        "三周后行业分化：比丫迪刀片电池突破，股价反弹；知马汽车停产，云度被起诉欠款。优胜劣汰。",
      conditions: function (st) {
        return !!st.flags._evFrenzySeen && !st.flags._evShakeoutSeen;
      },
      choices: [
        {
          text: "📊 换仓到龙头",
          hint: "优胜劣汰",
          apply: function (st) {
            st.flags._evShakeoutSeen = true;
            st.flags._evSwitchedToLeader = true;
            st.resources.cash -= 20000;
            StateManager.addMessage(
              "📊 卖掉杂牌加仓比丫迪。龙头就是龙头。",
              "event",
            );
            scheduleChainEvent(st, "ev_recovery", 30, "street");
          },
        },
        {
          text: "💪 加仓被错杀的小公司",
          hint: "高风险高回报",
          apply: function (st) {
            st.flags._evShakeoutSeen = true;
            st.flags._evBoughtSmall = true;
            st.resources.cash -= 15000;
            StateManager.addMessage(
              "💪 你找到一家现金流为正但被错杀的公司，投了¥15,000。",
              "event",
            );
            scheduleChainEvent(st, "ev_recovery", 30, "street");
          },
        },
        {
          text: "😞 全部清仓不玩了",
          hint: "认输",
          apply: function (st) {
            st.flags._evShakeoutSeen = true;
            st.flags._evQuit = true;
            StateManager.addMessage(
              "😞 你清仓了。亏了大概¥15,000。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "ev_recovery",
      phase: "street",
      icon: "📈",
      title: "时间的答案",
      story:
        "三个月后。比丫迪旗舰车型订单超预期300%，股价创了新高。你当初追加的投资翻了一倍。",
      conditions: function (st) {
        return (
          (!!st.flags._evSwitchedToLeader || !!st.flags._evBoughtSmall) &&
          !st.flags._evRecoverySeen
        );
      },
      choices: [
        {
          text: "🎉 持有龙头继续赚",
          hint: "利润最大化",
          apply: function (st) {
            st.flags._evRecoverySeen = true;
            var reward = Random.int(25000, 49999);
            st.resources.cash += reward;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 3,
            );
            StateManager.addMessage(
              "📈 赚了¥" + reward.toLocaleString() + "。恐慌时买入狂热时卖出。",
              "event",
            );
          },
        },
        {
          text: "✅ 止盈一半落袋为安",
          hint: "锁定利润",
          apply: function (st) {
            st.flags._evRecoverySeen = true;
            var reward2 = Random.int(30000, 39999);
            st.resources.cash += reward2;
            st.player.mental = Math.min(100, (st.player.mental || 20) + 5);
            StateManager.addMessage(
              "✅ 锁定了¥" + reward2.toLocaleString() + "的利润。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "community_group_buy",
      phase: "street",
      icon: "🥬",
      title: "团购大军杀到",
      story:
        "菜市场冷清了很多。王婶的菜被社区团购冲击——美团优选土豆¥0.99，进货价都不止。批发菜价跌了20%。等平台烧完钱会涨回来的。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 25 &&
          !st.flags._communityGroupBuySeen
        );
      },
      choices: [
        {
          text: "💰 趁低价囤菜等涨价",
          hint: "投机",
          apply: function (st) {
            st.flags._communityGroupBuySeen = true;
            st.resources.cash -= 2000;
            StateManager.addMessage("💰 你囤了一批土豆白菜。", "event");
          },
        },
        {
          text: "🛵 加入团购平台配送",
          hint: "打不过就加入",
          apply: function (st) {
            st.flags._communityGroupBuySeen = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
            st.resources.cash += 300;
            StateManager.addMessage(
              "🛵 注册了众包配送。钱不多但稳定。",
              "info",
            );
          },
        },
        {
          text: "😞 帮王婶卖菜抽成10%",
          hint: "帮人帮己",
          apply: function (st) {
            st.flags._communityGroupBuySeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            var earn = Random.int(200, 299);
            st.resources.cash += earn;
            StateManager.addMessage(
              "😞 帮王婶拉微信群配送，抽成¥" + earn.toLocaleString() + "。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "bike_share_boom",
      phase: "street",
      icon: "🚲",
      title: "满街的共享单车",
      story:
        "一夜之间三家共享公司投了上万辆车。运维员¥200/天，把乱停的车搬回去。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 20 &&
          !st.flags._bikeShareSeen
        );
      },
      choices: [
        {
          text: "🚲 去做运维赚快钱",
          hint: "¥200/天",
          apply: function (st) {
            st.flags._bikeShareSeen = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            st.resources.cash += 600;
            st.player.physique = Math.min(100, (st.player.physique || 20) + 1);
            StateManager.addMessage("🚲 干了一周到手¥600。", "event");
          },
        },
        {
          text: "🔧 拆废弃单车零件卖",
          hint: "灰色路线",
          apply: function (st) {
            st.flags._bikeShareSeen = true;
            st.resources.cash += 400;
            st.player.fame = Math.max(0, (st.player.fame || 0) - 2);
            StateManager.addMessage("🔧 拆零件卖废品赚了¥400。", "warning");
          },
        },
      ],
    },
    {
      id: "live_stream_rush",
      phase: "street",
      icon: "📱",
      title: "直播带货风口",
      story:
        "隔壁小哥一个月流水几十万——批发市场¥20的衣直播卖¥99。你知道这是风口。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 35 &&
          !st.flags._liveStreamSeen
        );
      },
      choices: [
        {
          text: "📱 试播三天",
          hint: "低成本",
          apply: function (st) {
            st.flags._liveStreamSeen = true;
            st.resources.cash -= 200;
            if (Random.chance(0.3)) {
              st.resources.cash += 800;
              StateManager.addMessage("📱 第三天卖了¥800！有搞头。", "success");
            } else {
              StateManager.addMessage("📱 最多5个观众。99%是炮灰。", "warning");
            }
          },
        },
        {
          text: "💼 给主播打包发货",
          hint: "确定性收入",
          apply: function (st) {
            st.flags._liveStreamSeen = true;
            var earn = Random.int(400, 599);
            st.resources.cash += earn;
            StateManager.addMessage(
              "💼 日结¥" + earn.toLocaleString() + "。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "ai_replace_jobs",
      phase: "street",
      icon: "🤖",
      title: "AI冲击打工人",
      story:
        "AI客服替代了300人团队。翻译老李两个月没接到单。但编程技能突然值钱了。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          !st.flags._aiReplaceSeen
        );
      },
      choices: [
        {
          text: "📚 报名学编程（¥1,000）",
          hint: "投资未来",
          cost: 1000,
          apply: function (st) {
            st.flags._aiReplaceSeen = true;
            if (st.skills && st.skills.coding)
              st.skills.coding.xp = (st.skills.coding.xp || 0) + 80;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 3,
            );
            StateManager.addMessage("📚 报名Python入门。不想被替代。", "event");
          },
        },
        {
          text: "😤 继续干体力活",
          hint: "AI搬不了砖",
          apply: function (st) {
            st.flags._aiReplaceSeen = true;
            StateManager.addMessage("😤 AI能搬砖吗？有些活替代不了。", "info");
          },
        },
      ],
    },
    {
      id: "stall_location_war",
      phase: "street",
      icon: "📍",
      title: "黄金摊位争夺战",
      story: "夜市街口位置空出来了。有人出¥3,000租一个月。那位置客流量是三倍。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          !st.flags._stallLocationSeen
        );
      },
      choices: [
        {
          text: "💰 砸¥3,000抢下",
          hint: "先下手为强",
          cost: 3000,
          apply: function (st) {
            st.flags._stallLocationSeen = true;
            var earn = Random.int(3000, 4999);
            st.resources.cash += earn;
            st.resources.totalEarned += earn;
            StateManager.addMessage(
              "💰 抢到位置！第一晚流水¥" + earn.toLocaleString() + "。",
              "event",
            );
          },
        },
        {
          text: "🤝 联合摊贩轮换",
          hint: "合作",
          apply: function (st) {
            st.flags._stallLocationSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            StateManager.addMessage("🤝 轮流用好位置，不用死抢。", "success");
          },
        },
        {
          text: "🚶 不争了",
          hint: "退一步",
          apply: function (st) {
            st.flags._stallLocationSeen = true;
            StateManager.addMessage("🚶 抢到了也得天天防着别人来抢。", "info");
          },
        },
      ],
    },
    {
      id: "temple_economy",
      phase: "street",
      icon: "🪫",
      title: "寺庙经济",
      story: "灵隐寺排队比商场还多。卖香烛的大妈一天¥3,000。年轻人全来上香了。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 40 &&
          !st.flags._templeEconomySeen
        );
      },
      choices: [
        {
          text: "🩧 进手串去卖（¥800）",
          hint: "高毛利",
          cost: 800,
          apply: function (st) {
            st.flags._templeEconomySeen = true;
            var earn = Random.int(1200, 1999);
            st.resources.cash += earn;
            StateManager.addMessage(
              "🩧 开光手串赚了¥" + earn.toLocaleString() + "。",
              "event",
            );
          },
        },
        {
          text: "\u2615 摆咖啡摊",
          hint: "年轻人喜欢",
          apply: function (st) {
            st.flags._templeEconomySeen = true;
            var earn2 = Random.int(800, 1199);
            st.resources.cash += earn2;
            StateManager.addMessage(
              "\u2615 三轮车咖啡摊赚了¥" + earn2.toLocaleString() + "。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "viral_harassment",
      phase: "street",
      icon: "📵",
      title: "一条视频惹的祸",
      story:
        "送外卖时被网红蹭到，她直播说你撞人想跑。3万人围观，你的照片被贴了出来。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          !st.flags._viralHarassmentSeen
        );
      },
      choices: [
        {
          text: "📱 拍视频解释",
          hint: "用证据反击",
          apply: function (st) {
            st.flags._viralHarassmentSeen = true;
            if (Random.chance(0.5)) {
              st.resources.cash += 2000;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
              StateManager.addMessage("📱 舆论反转！你涨了2,000粉。", "event");
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 15);
              StateManager.addMessage(
                "📱 澄清视频没人看。先发声才重要。",
                "warning",
              );
            }
          },
        },
        {
          text: "😤 忍了不回应",
          hint: "等热度过去",
          apply: function (st) {
            st.flags._viralHarassmentSeen = true;
            StateManager.addMessage(
              "😤 你卸载了抖音。三天后没人记得了。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "delivery_price_war",
      phase: "street",
      icon: "🛵",
      title: "配送费又降了",
      story: "单价从¥7.5降到¥5.8。有人号召罢工——但总有人愿意跑。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          !st.flags._deliveryPriceSeen
        );
      },
      choices: [
        {
          text: "😤 参加罢工",
          hint: "团结",
          apply: function (st) {
            st.flags._deliveryPriceSeen = true;
            st.resources.cash -= 200;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
            StateManager.addMessage("😤 罢工三天，单价涨回¥7.0。", "event");
          },
        },
        {
          text: "\u26a1 专接高价跑腿单",
          hint: "质胜量",
          apply: function (st) {
            st.flags._deliveryPriceSeen = true;
            var earn = Random.int(300, 599);
            st.resources.cash += earn;
            StateManager.addMessage(
              "\u26a1 跑腿高价单多赚¥" + earn.toLocaleString() + "。",
              "event",
            );
          },
        },
        {
          text: "😞 换行",
          hint: "此处不留爷",
          apply: function (st) {
            st.flags._deliveryPriceSeen = true;
            StateManager.addMessage(
              "😞 你把骑手服收起来了。明天重新开始。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "ev_used_car_crash",
      phase: "street",
      icon: "🚗",
      title: "新能源二手崩了",
      story:
        "去年¥120,000的新能源车，二手¥48,000。做二手车的陈哥仓库压了十几台。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 50 &&
          !st.flags._evUsedCarSeen
        );
      },
      choices: [
        {
          text: "💰 抄底收一台",
          hint: "赌反弹",
          apply: function (st) {
            st.flags._evUsedCarSeen = true;
            st.resources.cash -= 30000;
            StateManager.addMessage(
              "💰 花¥30,000收了一台。陈哥说你胆子真大。",
              "event",
            );
          },
        },
        {
          text: "🚫 不碰",
          hint: "不熟不做",
          apply: function (st) {
            st.flags._evUsedCarSeen = true;
            StateManager.addMessage(
              "🚫 知道自己不懂比什么都懂更重要。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "near_expiry_wholesale",
      phase: "street",
      icon: "🥫",
      title: "临期食品生意",
      story:
        "临期食品仓库——¥10一箱进口饼干¥5一瓶橄榄油。¥1,000进货能卖¥2,500。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 20 &&
          st.resources.cash >= 1000 &&
          !st.flags._nearExpirySeen
        );
      },
      choices: [
        {
          text: "📦 进¥1,000的货去卖",
          hint: "小本生意",
          cost: 1000,
          apply: function (st) {
            st.flags._nearExpirySeen = true;
            var earn = Random.int(1500, 2299);
            st.resources.cash += earn;
            StateManager.addMessage(
              "📦 夜市赚了¥" + earn.toLocaleString() + "。",
              "event",
            );
          },
        },
        {
          text: "🤝 长期合作",
          hint: "做大",
          apply: function (st) {
            st.flags._nearExpirySeen = true;
            st.resources.cash -= 5000;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            StateManager.addMessage("🤝 成了临期食品专营户。", "event");
          },
        },
      ],
    },
    {
      id: "gig_economy_trap",
      phase: "street",
      icon: "📋",
      title: "社保交还是不交",
      story:
        "灵活就业社保每月¥900。一个月才赚¥4,000~¥6,000。隔壁老周胆囊炎花了¥30,000全自费。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 45 &&
          !st.flags._gigSocialSeen
        );
      },
      choices: [
        {
          text: "\u2705 交",
          hint: "每月¥900",
          apply: function (st) {
            st.flags._gigSocialSeen = true;
            st.resources.cash -= 900;
            st.player.mental = Math.min(100, (st.player.mental || 20) + 5);
            StateManager.addMessage(
              "\u2705 每月扣¥900，但心里踏实了。",
              "event",
            );
          },
        },
        {
          text: "\u274c 不交存钱",
          hint: "现金为王",
          apply: function (st) {
            st.flags._gigSocialSeen = true;
            StateManager.addMessage(
              "\u274c 省钱当医保基金。祈祷别生病。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "knowledge_pay_bubble",
      phase: "street",
      icon: "🎓",
      title: "¥9,999财富自由课",
      story:
        "短视频导师讲普通人如何财富自由。课程¥9,999。评论分两派——真的有用还是割韭菜。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          !st.flags._knowledgePaySeen
        );
      },
      choices: [
        {
          text: "🎣 买了试试（¥9,999）",
          hint: "万一呢",
          cost: 9999,
          apply: function (st) {
            st.flags._knowledgePaySeen = true;
            if (Random.chance(0.15)) {
              st.resources.cash += 30000;
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 10) + 5,
              );
              StateManager.addMessage(
                "🎣 居然不是骗子！你赚回了学费。",
                "event",
              );
            } else {
              st.resources.cash -= 9999;
              StateManager.addMessage(
                "🎣 全是百度货。退款时被拉黑。所有教你快速致富的人都在靠你致富。",
                "warning",
              );
            }
          },
        },
        {
          text: "📚 自己买书学（¥200）",
          hint: "便宜但慢",
          apply: function (st) {
            st.flags._knowledgePaySeen = true;
            st.resources.cash -= 200;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            StateManager.addMessage("📚 学得慢但没人拉黑你。", "success");
          },
        },
        {
          text: "📵 刷走不看",
          hint: "清净",
          apply: function (st) {
            st.flags._knowledgePaySeen = true;
            StateManager.addMessage("📵 屏蔽垃圾信息和赚钱一样重要。", "info");
          },
        },
      ],
    },
    {
      id: "shopping_festival",
      phase: "street",
      icon: "🎉",
      title: "购物狂欢节来了",
      story:
        "铺天盖地的广告：「双11狂欢，全场五折！」批发市场里进货的人跟不要钱一样疯抢。但快递站贴出了急招临时工的大字报——日结¥280，干到凌晨两点。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 10 &&
          !st.flags._shoppingFestSeen &&
          st.player.day % 30 >= 8 &&
          st.player.day % 30 <= 12
        );
      },
      choices: [
        {
          text: "💰 进货囤货等涨价",
          hint: "¥3000进货，7天后卖出预计赚40%",
          apply: function (st) {
            st.flags._shoppingFestSeen = true;
            st.flags._shoppingFestDeal = "stock";
            st.resources.cash -= 3000;
            st.flags._shoppingStockDay = st.player.day;
            StateManager.addMessage(
              "🎉 囤了一批货，等节后涨价卖。存货价值¥4200。",
              "event",
            );
          },
        },
        {
          text: "📦 去快递站做临时工",
          hint: "¥280/天，消耗15AP",
          apply: function (st) {
            st.flags._shoppingFestSeen = true;
            st.resources.cash += 280;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
            st.needs.hunger = Math.max(0, st.needs.hunger - 8);
            StateManager.addMessage(
              "📦 干到凌晨两点，腰快断了。但钱是真的。",
              "info",
            );
          },
        },
        {
          text: "🛒 趁打折给自己买点好的",
          hint: "犒劳自己一下就对了",
          apply: function (st) {
            st.flags._shoppingFestSeen = true;
            st.resources.cash -= 200;
            st.needs.happiness = Math.min(100, st.needs.happiness + 15);
            StateManager.addMessage(
              "🛒 买了一套新衣服和一双鞋。好久没这么开心了。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "p2p_crash",
      phase: "street",
      icon: "💸",
      title: "全民贷跑路了",
      story:
        "你刷到一条新闻——「全民贷」爆雷，涉及金额¥80亿，线下门店被愤怒的老年人围得水泄不通。有人在门口拉横幅，有人蹲在地上哭。群里有人说内部消息：实际控制人已经飞加拿大。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          !st.flags._p2pCrashSeen &&
          st.resources.cash >= 500
        );
      },
      choices: [
        {
          text: "😰 去现场看看能不能低价收购债权",
          hint: "¥5000收¥30000债权，可能打水漂",
          apply: function (st) {
            st.flags._p2pCrashSeen = true;
            if (st.resources.cash >= 5000) {
              st.flags._p2pInvested = true;
              st.resources.cash -= 5000;
              st.flags._p2pDebtDay = st.player.day;
              StateManager.addMessage(
                "💸 你用¥5000收了一张¥30000的债权。也许能要回来，也许打了水漂。",
                "event",
              );
            } else {
              st.flags._p2pWatched = true;
              StateManager.addMessage(
                "👀 你围观了一天，什么都没做。有个大妈哭得站不住。",
                "info",
              );
            }
          },
        },
        {
          text: "📢 帮维权群众写联名信",
          hint: "帮助别人，让大家记住你",
          apply: function (st) {
            st.flags._p2pCrashSeen = true;
            st.flags._p2pHelped = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            st.player.actionPoints -= 15;
            StateManager.addMessage(
              "📢 你帮老人们写了投诉信。有人拉着你的手说谢谢。",
              "event",
            );
          },
        },
        {
          text: "🚶 看一眼就走了",
          hint: "事不关己",
          apply: function (st) {
            st.flags._p2pCrashSeen = true;
            StateManager.addMessage(
              "💸 不是你的事。但回家的路上心里堵得慌。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "sharing_economy_bubble",
      phase: "street",
      icon: "🚲",
      title: "共享单车坟场",
      story:
        "城郊的空地上堆满了五颜六色的共享单车——橙色、黄色、蓝色，层层叠叠像一座钢铁坟场。押金退了三个月还没到账。但有人在回收这些废铁，一辆¥15。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 20 &&
          !st.flags._sharingEconomySeen
        );
      },
      choices: [
        {
          text: "♻️ 回收废铁赚差价",
          hint: "15AP，预计赚¥200-400",
          apply: function (st) {
            st.flags._sharingEconomySeen = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 12);
            var earn = Random.int(200, 399);
            st.resources.cash += earn;
            st.needs.hygiene = Math.max(0, st.needs.hygiene - 5);
            StateManager.addMessage(
              "♻️ 拆了一下午单车，卖了¥" + earn + "。手上全是铁锈味。",
              "info",
            );
          },
        },
        {
          text: "📱 注册运维兼职",
          hint: "巡逻摆放单车，日薪¥150",
          apply: function (st) {
            st.flags._sharingEconomySeen = true;
            st.flags._sharingJobUnlocked = true;
            StateManager.addMessage(
              "📱 注册了共享单车运维。把这当作全职也行，月入¥3500。",
              "event",
            );
          },
        },
        {
          text: "😤 在群里骂押金不退",
          hint: "爽但不解决问题",
          apply: function (st) {
            st.flags._sharingEconomySeen = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            StateManager.addMessage("😤 骂完了，押金还是没退。", "info");
          },
        },
      ],
    },
    {
      id: "big_tech_layoff",
      phase: "street",
      icon: "🏢",
      title: "大厂毕业季",
      story:
        "你刷到一篇推送——「辰光网络Q2财报不及预期，裁员30%」。写字楼门口有抱着纸箱出来的人，有人西装革履站在路边抽烟发呆。二手平台上突然多了一批99新的MacBook Pro和人体工学椅。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 40 &&
          !st.flags._bigTechLayoffSeen
        );
      },
      choices: [
        {
          text: "💻 低价收购被裁员工的设备",
          hint: "¥3000收MacBook，转手可卖¥5000",
          apply: function (st) {
            st.flags._bigTechLayoffSeen = true;
            if (st.resources.cash >= 3000) {
              st.resources.cash -= 3000;
              st.flags._layoffGear = true;
              st.flags._layoffGearDay = st.player.day;
              StateManager.addMessage(
                "💻 收到一台99新的MacBook Pro和一把赫曼米勒。转手能赚¥2000。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "💻 看了一圈好东西但买不起。有个大哥问你要不要他的显示器，¥200。",
                "info",
              );
              if (st.resources.cash >= 200) {
                st.resources.cash -= 200;
                st.flags._layoffCheapGear = true;
                StateManager.addMessage(
                  "🖥️ 捡漏了一台27寸显示器，自己用也行卖了也行。",
                  "info",
                );
              }
            }
          },
        },
        {
          text: "📞 问有没有内推机会",
          hint: "高风险高回报",
          apply: function (st) {
            st.flags._bigTechLayoffSeen = true;
            st.flags._layoffAskedForReferral = true;
            StateManager.addMessage(
              "📞 被裁的人苦笑着：「我自己都没着落呢。」给了你一张名片：「下个月我可能在新公司。」",
              "event",
            );
          },
        },
        {
          text: "🏪 去写字楼门口卖盒饭",
          hint: "总得吃饭",
          apply: function (st) {
            st.flags._bigTechLayoffSeen = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 8);
            st.resources.cash += 180;
            StateManager.addMessage(
              "🏪 你推着小车过去。被裁的人买盒饭不还价——他们没心情。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "tech_996_debate",
      phase: "street",
      icon: "⏰",
      title: "取消大小周",
      story:
        "新闻炸了——「橙象集团取消大小周，员工月薪普降15%」。群里吵翻了：有人说时薪没变爽啊，有人说降薪了房贷怎么办。楼下便利店老板叹气：「大厂不加班了，夜里没人买夜宵了。」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 35 &&
          !st.flags._tech996Seen
        );
      },
      choices: [
        {
          text: "🎉 高兴——可以找正常下班的朋友玩",
          hint: "下班后的小确幸",
          apply: function (st) {
            st.flags._tech996Seen = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            StateManager.addMessage(
              "🎉 你发消息给在大厂的同学：「以后能约晚饭了！」他回了个苦笑表情。",
              "success",
            );
          },
        },
        {
          text: "📦 以后少进点夜宵货",
          hint: "便利店夜宵需求下降",
          apply: function (st) {
            st.flags._tech996Seen = true;
            st.flags._nightMarketDecline = true;
            StateManager.addMessage(
              "📦 你减少了夜宵进货。这附近的夜经济要冷一阵了。",
              "info",
            );
          },
        },
        {
          text: "💼 投简历——大厂现在WLB了",
          hint: "开启一条新路线",
          apply: function (st) {
            st.flags._tech996Seen = true;
            st.flags._techWLBFactor = true;
            StateManager.addMessage(
              "💼 你更新了简历。也许这是个进大厂的好时机。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "china_stock_delist",
      phase: "street",
      icon: "📉",
      title: "中概股退市风暴",
      story:
        "「审计底稿」争端升级，美股市场的中国公司集体面临退市。新闻里专家的嘴一张一合：「对业务没有实质影响。」但股价已经跌了70%。有朋友说他老板之前套现了¥3000万——现在人在新加坡。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 50 &&
          !st.flags._chinaDelistSeen
        );
      },
      choices: [
        {
          text: "📈 抄底中概股ETF",
          hint: "高风险投资，¥2000起",
          apply: function (st) {
            st.flags._chinaDelistSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._chinaDelistBought = true;
              st.flags._chinaDelistDay = st.player.day;
              StateManager.addMessage(
                "📈 你在最低点买了中概ETF。可能是抄底，可能是接飞刀。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📈 想抄底但没钱。你第一次感受到：「机会来了没钱也是一种痛苦。」",
                "info",
              );
            }
          },
        },
        {
          text: "💼 找机会进回港上市的公司",
          hint: "有些公司回港二次上市在招人",
          apply: function (st) {
            st.flags._chinaDelistSeen = true;
            st.flags._hkListJobChance = true;
            StateManager.addMessage(
              "💼 有猎头在群里发了几个香港职位。你不一定够格，但值得一试。",
              "event",
            );
          },
        },
        {
          text: "🧽 吃瓜看戏",
          hint: "什么都不做",
          apply: function (st) {
            st.flags._chinaDelistSeen = true;
            StateManager.addMessage(
              "📉 你关了新闻。这些离你太远了——你今天的晚饭还没着落。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "demolition_fortune",
      phase: "street",
      icon: "🏚️",
      title: "拆迁公告",
      story:
        "村口的公告栏贴了一张红头文件——「新城街道旧改项目征收公告」。20年的老房子，按补偿方案能赔¥120万或一套安置房。老李头拿着公告手在抖：「等了15年，终于等到了。」但旁边有人悄悄说：「现在签字亏了，等多三个月至少多赔30%。」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 60 &&
          !st.flags._demolitionSeen
        );
      },
      choices: [
        {
          text: "🏡 劝邻居早签早拿钱",
          hint: "稳妥派，邻居感谢你得人情",
          apply: function (st) {
            st.flags._demolitionSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            StateManager.addMessage(
              "🏡 你劝老李签字。他请你吃了顿饭：「小伙子实在人。」",
              "event",
            );
          },
        },
        {
          text: "💰 赌一把——借钱买公告范围内的老房子",
          hint: "高风险投机，需要¥5万首付",
          apply: function (st) {
            st.flags._demolitionSeen = true;
            if (st.resources.cash >= 50000) {
              st.resources.cash -= 50000;
              st.flags._demolitionGambled = true;
              st.flags._demolitionDay = st.player.day;
              StateManager.addMessage(
                "💰 你签了合同买下一间20平的老房。赌拆迁——要么翻倍，要么砸手里。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "💰 你算了算存款，不够首付。拆迁暴富的梦破灭了。",
                "info",
              );
            }
          },
        },
        {
          text: "🏪 进一批装修材料来卖",
          hint: "拆迁片区装修需求大",
          apply: function (st) {
            st.flags._demolitionSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._demolitionSupply = true;
              StateManager.addMessage(
                "🏪 你进了水泥和瓷砖。拆迁户装修总得买东西吧。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🏪 连进货的钱都没有。你蹲在路边看别人忙活。",
                "info",
              );
            }
          },
        },
      ],
    },
    {
      id: "unfinished_building",
      phase: "street",
      icon: "🏗️",
      title: "烂尾楼前",
      story:
        "一栋封顶的大楼矗立在雨中——脚手架还在，但工地上已经没人了。开发商资金链断裂，300多户业主交了首付却拿不到房。有人在楼顶拉横幅，有人在售楼处门口搭了帐篷。七个业主凑钱请了律师，每人摊¥3000。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 45 &&
          !st.flags._unfinishedSeen
        );
      },
      choices: [
        {
          text: "⚖️ 捐¥300支持业主打官司",
          hint: "名声+2，用良心投票",
          apply: function (st) {
            st.flags._unfinishedSeen = true;
            if (st.resources.cash >= 300) {
              st.resources.cash -= 300;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
              StateManager.addMessage(
                "⚖️ 你捐了¥300。业主群把你拉进去发了三个鲜花表情。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "⚖️ 你想帮忙，但口袋比脸还干净。",
                "info",
              );
            }
          },
        },
        {
          text: "🔍 打听烂尾楼有没有收购方",
          hint: "也许有投资机会",
          apply: function (st) {
            st.flags._unfinishedSeen = true;
            st.flags._unfinishedInvestigated = true;
            StateManager.addMessage(
              "🔍 听说有家AMC在谈收购。如果成了，房价能涨30%。如果谈不成……",
              "event",
            );
          },
        },
        {
          text: "🚶 绕路走",
          hint: "不关我事",
          apply: function (st) {
            st.flags._unfinishedSeen = true;
            StateManager.addMessage(
              "🏗️ 你绕过了那栋楼。雨里的钢筋混凝土像一座墓碑。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "rental_apartment_crash",
      phase: "street",
      icon: "🏠",
      title: "长租公寓爆雷",
      story:
        "「城客公寓」爆雷了。房东没收到租金要赶人，租客一次性交了半年房租却被物业贴了催缴单。你住的城中村虽然没有长租公寓，但好几个工友都在群里问：「有没有便宜的单间转租？」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 15 &&
          !st.flags._rentalCrashSeen
        );
      },
      choices: [
        {
          text: "🏠 帮忙转介绍靠谱房东",
          hint: "人情+2，介绍成功有红包",
          apply: function (st) {
            st.flags._rentalCrashSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            st.resources.cash += 100;
            StateManager.addMessage(
              "🏠 你介绍了王婶的空房给工友。王婶给了你¥100红包。",
              "success",
            );
          },
        },
        {
          text: "📢 提醒大家租房选月付",
          hint: "虽然贵点但安全",
          apply: function (st) {
            st.flags._rentalCrashSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            StateManager.addMessage(
              "📢 你在群里发了条消息：「租房别付超过一个月的押金。」有人回了个大拇指。",
              "info",
            );
          },
        },
        {
          text: "😴 跟自己没关系",
          hint: "你连房租都快交不起了",
          apply: function (st) {
            st.flags._rentalCrashSeen = true;
            StateManager.addMessage(
              "🏠 你连房租都快交不起了，管不了别人。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "purchase_restriction_relax",
      phase: "street",
      icon: "📋",
      title: "限购松绑了",
      story:
        "新政出台：社保满一年即可购房，二套房首付从60%降到40%。中介的朋友圈集体沸腾：「上车好时机！」你算了一下自己的存款——距离首付还差一个零。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 70 &&
          !st.flags._purchaseRelaxSeen
        );
      },
      choices: [
        {
          text: "🏦 找中介咨询低首付购房",
          hint: "也许有路子，但可能踩坑",
          apply: function (st) {
            st.flags._purchaseRelaxSeen = true;
            st.flags._consultedAgent = true;
            StateManager.addMessage(
              "🏦 中介热情得很：「首付贷我们帮你搞定！」利率没说。你没敢签。",
              "event",
            );
          },
        },
        {
          text: "📈 买房地产板块股票",
          hint: "政策利好，¥2000尝试",
          apply: function (st) {
            st.flags._purchaseRelaxSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._realEstateStockBought = true;
              st.flags._realEstateStockDay = st.player.day;
              StateManager.addMessage(
                "📈 买了两手地产股。希望这波行情能带带你。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📈 没钱买股票。你连二手都算不上。",
                "info",
              );
            }
          },
        },
        {
          text: "📱 刷过去当没看见",
          hint: "看了也买不起",
          apply: function (st) {
            st.flags._purchaseRelaxSeen = true;
            StateManager.addMessage("📱 你划走了。看多了容易心态崩。", "info");
          },
        },
      ],
    },
    {
      id: "old_community_elevator",
      phase: "street",
      icon: "🛗",
      title: "加装电梯风波",
      story:
        "你路过一个老旧小区，看到一楼住户和六楼老太太在吵架——加装电梯，一楼说挡了采光房子贬值，六楼说腿脚不便三年没下楼了。社区调解员两边赔笑脸，手里的本子记满了双方的意见。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 25 &&
          !st.flags._elevatorSeen
        );
      },
      choices: [
        {
          text: "🤝 帮忙调解",
          hint: "做和事佬，名声+3，花10AP",
          apply: function (st) {
            st.flags._elevatorSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            StateManager.addMessage(
              "🤝 你花了一下午调解。最后六楼阿姨哭了，一楼大叔沉默了。调解书上签了字。",
              "event",
            );
          },
        },
        {
          text: "🏪 推销搬家服务",
          hint: "如果他们谈不拢可能有人要搬家",
          apply: function (st) {
            st.flags._elevatorSeen = true;
            st.flags._elevatorMovingBiz = true;
            StateManager.addMessage(
              "🏪 你给六楼阿姨留了张名片：「需要搬家找我。」她收下了。",
              "info",
            );
          },
        },
        {
          text: "🚶 看热闹",
          hint: "不关你事",
          apply: function (st) {
            st.flags._elevatorSeen = true;
            StateManager.addMessage(
              "🛗 你站在旁边看了十分钟。这城市里每个人都有自己的难处。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "school_district_policy",
      phase: "street",
      icon: "📚",
      title: "学区房变天",
      story:
        "「多校划片」政策出台，实验小学的学区房一夜跌了40%。群里有个人三天前刚签了合同，多花¥80万买的学区房——现在和隔壁老破小一个学校。中介的电话被打爆了，全是骂人的。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 55 &&
          !st.flags._schoolDistrictSeen
        );
      },
      choices: [
        {
          text: "👍 正好——以后孩子上学不拼房子了",
          hint: "对你这种没房的人反而是利好",
          apply: function (st) {
            st.flags._schoolDistrictSeen = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            StateManager.addMessage(
              "👍 你一直觉得学区房是扯淡。公平起见，挺好。",
              "success",
            );
          },
        },
        {
          text: "💰 看有没有急售的学区房可以捡漏",
          hint: "有些房东急出手，打七折",
          apply: function (st) {
            st.flags._schoolDistrictSeen = true;
            if (st.resources.cash >= 100000) {
              st.resources.cash -= 100000;
              st.flags._schoolDistrictBought = true;
              st.flags._schoolDistrictDay = st.player.day;
              StateManager.addMessage(
                "💰 你捡漏了一套打折学区房。政策会变，但房子是实的。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "💰 你连首付零头都不够。学区房再跌你也买不起。",
                "info",
              );
            }
          },
        },
        {
          text: "🧽 吃瓜",
          hint: "看有钱人打架",
          apply: function (st) {
            st.flags._schoolDistrictSeen = true;
            StateManager.addMessage(
              "🧽 你在群里潜水看人吵架。有人@你：「你笑什么？」你没回。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "talent_introduction_war",
      phase: "street",
      icon: "🎓",
      title: "抢人大战",
      story:
        "二线城市又来抢人了：大专以上学历直接落户，给¥5万生活补贴，人才公寓租金打五折。你算了一下——自己好像符合条件。但要去一个陌生的城市重新开始。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 35 &&
          !st.flags._talentWarSeen &&
          (st.player.intelligence || 0) >= 25
        );
      },
      choices: [
        {
          text: "✈️ 认真考虑去二线城市发展",
          hint: "开启新城市线，但需要重新积累",
          apply: function (st) {
            st.flags._talentWarSeen = true;
            st.flags._considerRelocate = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 12);
            StateManager.addMessage(
              "✈️ 你认真查了那个城市的信息。房租¥800一居室，房价¥1万/平。有点心动。",
              "event",
            );
          },
        },
        {
          text: "📞 假装高端人才拿offer再拒绝",
          hint: "不太道德但能了解行情",
          apply: function (st) {
            st.flags._talentWarSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            StateManager.addMessage(
              "📞 你跟人才热线聊了20分钟。对方很热情。你觉得有点愧疚。",
              "info",
            );
          },
        },
        {
          text: "🚶 大城市还没混明白呢",
          hint: "不走",
          apply: function (st) {
            st.flags._talentWarSeen = true;
            StateManager.addMessage(
              "🚶 你还没在这座城市站稳脚跟。等混出头了再说吧。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "stock_market_boom",
      phase: "street",
      icon: "📈",
      title: "A股疯了",
      story:
        "大盘连续涨了15天，从2800点冲到了4200点。食堂里、公交上、厕所隔间——所有人都在看手机上的K线。卖菜的老刘把攒了五年的¥20万全扔进去了。你攥着口袋里的几千块，心跳加速。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          !st.flags._stockBoomSeen &&
          st.resources.cash >= 1000
        );
      },
      choices: [
        {
          text: "🔥 跟进去——全仓买入",
          hint: "高风险高回报，可能翻倍也可能腰斩",
          apply: function (st) {
            st.flags._stockBoomSeen = true;
            var invest = Math.min(st.resources.cash, 10000);
            st.resources.cash -= invest;
            st.flags._stockBoomInvested = invest;
            st.flags._stockBoomDay = st.player.day;
            StateManager.addMessage(
              "🔥 你全仓买入！看着红彤彤的K线，手心都是汗。",
              "event",
            );
          },
        },
        {
          text: "🤔 买一半留一半",
          hint: "稳健",
          apply: function (st) {
            st.flags._stockBoomSeen = true;
            var invest = Math.min(Math.floor(st.resources.cash / 2), 5000);
            st.resources.cash -= invest;
            st.flags._stockBoomHalfInvested = invest;
            st.flags._stockBoomDay = st.player.day;
            StateManager.addMessage(
              "🤔 你买了¥" + invest + "。留了一半现金——万一崩了还能吃饭。",
              "info",
            );
          },
        },
        {
          text: "🧊 不碰——都是泡沫",
          hint: "理智，但不赚钱",
          apply: function (st) {
            st.flags._stockBoomSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            StateManager.addMessage(
              "🧊 你忍住了。老刘在边上说：「你不买就是踏空啊！」你笑笑没说话。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "crypto_cycle",
      phase: "street",
      icon: "₿",
      title: "比特币又减半了",
      story:
        "比特币第四次减半完成，价格从¥25万冲到¥60万。群里有人说他2018年花¥3000买了0.5个BTC忘了，现在值¥30万。二手电脑城里有人开始攒显卡挖矿，电费¥1.2/度也拦不住。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 50 &&
          !st.flags._cryptoCycleSeen
        );
      },
      choices: [
        {
          text: "₿ 买一点比特币试试",
          hint: "¥2000起，可能暴富可能归零",
          apply: function (st) {
            st.flags._cryptoCycleSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._cryptoBought = true;
              st.flags._cryptoDay = st.player.day;
              StateManager.addMessage(
                "₿ 你买了¥2000的比特币。私钥抄在本子上，藏在枕头底下。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "₿ 连¥2000都拿不出来。你第一次觉得穷限制了对风险的想象。",
                "info",
              );
            }
          },
        },
        {
          text: "⚡ 去电脑城帮人装矿机",
          hint: "体力活，一天赚¥300",
          apply: function (st) {
            st.flags._cryptoCycleSeen = true;
            st.resources.cash += 300;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 12);
            StateManager.addMessage(
              "⚡ 装了一天显卡。老板问你要不要工资折成ETH——你没敢。",
              "info",
            );
          },
        },
        {
          text: "📚 学习区块链知识",
          hint: "增长见识，开阔视野",
          apply: function (st) {
            st.flags._cryptoCycleSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 3,
            );
            StateManager.addMessage(
              "📚 你花了一周搞懂了什么是共识机制。虽然还是买不起。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "retail_vs_wallstreet",
      phase: "street",
      icon: "🐂",
      title: "散户大战华尔街",
      story:
        "「柠檬汽水」被知名做空机构发布17页做空报告，股价暴跌20%。但REDDIT上的散户们不干了——「YOLO！ALL IN！」群里的中文翻译比原文还热闹：「机构做空200%，逼空要爆了！」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 40 &&
          !st.flags._retailVsWallSeen &&
          st.resources.cash >= 500
        );
      },
      choices: [
        {
          text: "🐂 跟散户一起冲",
          hint: "买¥2000，可能会翻倍也可能血本无归",
          apply: function (st) {
            st.flags._retailVsWallSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._retailWsbBet = true;
              st.flags._retailWsbDay = st.player.day;
              StateManager.addMessage(
                "🐂 你跟着群里的翻译一起买入了。群里在喊「DIAMOND HANDS！」你其实不知道什么意思。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🐂 你连¥2000都没有。只能在群里看别人暴富或跳楼。",
                "info",
              );
            }
          },
        },
        {
          text: "🏦 跟着机构做空",
          hint: "需要¥5000保证金，有大机构背书",
          apply: function (st) {
            st.flags._retailVsWallSeen = true;
            if (st.resources.cash >= 5000) {
              st.resources.cash -= 5000;
              st.flags._retailShortSide = true;
              st.flags._retailShortDay = st.player.day;
              StateManager.addMessage(
                "🏦 你跟机构站在一边。理性上是对的，但心里有点不舒服。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🏦 机构的门槛你都够不着。也许这就是散户的命。",
                "info",
              );
            }
          },
        },
        {
          text: "🍿 吃瓜看戏",
          hint: "什么都不做最安全",
          apply: function (st) {
            st.flags._retailVsWallSeen = true;
            StateManager.addMessage(
              "🍿 你搬了小板凳看群里的战况。今天不亏就是赚。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "quant_fund_harvest",
      phase: "street",
      icon: "🤖",
      title: "量化基金收割",
      story:
        "「幻方量化」去年收益43%，今年前三个月已经亏了15%。有人说量化基金就是高频割韭菜——散户的每一笔交易都被算法预测。你想起上周自己买了就跌、卖了就涨的股票，后背一凉。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 55 &&
          !st.flags._quantFundSeen
        );
      },
      choices: [
        {
          text: "🤖 买量化基金——打不过就加入",
          hint: "¥10000起购，年化预期12%",
          apply: function (st) {
            st.flags._quantFundSeen = true;
            if (st.resources.cash >= 10000) {
              st.resources.cash -= 10000;
              st.flags._quantFundBought = true;
              st.flags._quantFundDay = st.player.day;
              StateManager.addMessage(
                "🤖 你买了量化基金。AI帮你炒股，你在出租屋里等收益。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🤖 门槛¥10000，你差了¥" +
                  (10000 - st.resources.cash) +
                  "。想在城里活着真不容易。",
                "info",
              );
            }
          },
        },
        {
          text: "📖 学习量化交易知识",
          hint: "学习量化交易知识",
          apply: function (st) {
            st.flags._quantFundSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 2,
            );
            StateManager.addMessage(
              "📖 你看了三篇量化的文章。90%没看懂，但感觉很高端。",
              "success",
            );
          },
        },
        {
          text: "🚶 不碰——我就是那个被割的韭菜",
          hint: "有自知之明",
          apply: function (st) {
            st.flags._quantFundSeen = true;
            StateManager.addMessage(
              "🚶 你承认了自己就是韭菜。不丢人——至少今天没亏钱。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "deposit_rate_cut",
      phase: "street",
      icon: "🏦",
      title: "存款利率又降了",
      story:
        "银行又降息了——一年期存款利率从1.5%降到1.0%。余额宝的收益跌到1.8%，创历史新低。你算了算：存¥10000在银行，一年利息¥100，够吃两顿沙县。房东说下个月涨房租¥150。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 20 &&
          !st.flags._depositRateCutSeen
        );
      },
      choices: [
        {
          text: "📈 把钱从银行取出来投资",
          hint: "被迫承担更高风险",
          apply: function (st) {
            st.flags._depositRateCutSeen = true;
            st.flags._rateCutInvestMode = true;
            StateManager.addMessage(
              "📈 你把存款取了出来。存银行是等死，投资是找死——但找死还有一线生机。",
              "event",
            );
          },
        },
        {
          text: "🏠 跟房东谈年付打折",
          hint: "锁定一年租金，省下涨幅",
          apply: function (st) {
            st.flags._depositRateCutSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            StateManager.addMessage(
              "🏠 你找房东谈了年付。房东同意了——打95折。省下的钱够吃一个月沙县。",
              "success",
            );
          },
        },
        {
          text: "😤 存着吧，至少不会亏本",
          hint: "稳妥但购买力在缩水",
          apply: function (st) {
            st.flags._depositRateCutSeen = true;
            StateManager.addMessage(
              "😤 你看着账户里的数字。不增加就是减少，这道理你懂。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "exchange_rate_break7",
      phase: "street",
      icon: "💱",
      title: "汇率破7了",
      story:
        "美元兑人民币汇率突破7.2。做外贸的李哥最近订单接到手软——「人民币贬值了，老外觉得我们的货跟白送一样。」但进口商的脸色很难看——电脑配件进货价涨了15%，整条街的装机店都在调价。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 40 &&
          !st.flags._exchangeRateSeen
        );
      },
      choices: [
        {
          text: "💵 换点美元避险",
          hint: "¥5000换美元，保值但占用资金",
          apply: function (st) {
            st.flags._exchangeRateSeen = true;
            if (st.resources.cash >= 5000) {
              st.resources.cash -= 5000;
              st.flags._usdHeld = true;
              st.flags._usdHeldDay = st.player.day;
              StateManager.addMessage(
                "💵 你换了$700美元。握着绿色的票子，感觉确实不一样。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "💵 想换汇但钱太少。银行柜员看了你的余额没说啥——但你从她眼神里读到了。",
                "info",
              );
            }
          },
        },
        {
          text: "📦 趁电脑配件涨价前进一批货",
          hint: "进货成本增加前囤货",
          apply: function (st) {
            st.flags._exchangeRateSeen = true;
            if (st.resources.cash >= 3000) {
              st.resources.cash -= 3000;
              st.flags._importGoodsStock = true;
              StateManager.addMessage(
                "📦 你在涨价前进了一批硬盘和内存。过两周能卖个好价钱。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📦 连囤货的钱都没有。你感觉自己被通胀和贫穷两头夹击。",
                "info",
              );
            }
          },
        },
        {
          text: "💼 问问李哥那边缺不缺人",
          hint: "外贸业务扩张，可能需要人手",
          apply: function (st) {
            st.flags._exchangeRateSeen = true;
            st.flags._tradeJobChance = true;
            StateManager.addMessage(
              "💼 李哥说缺个跟单的，工资不高但能学东西。你留了电话。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "trust_crash",
      phase: "street",
      icon: "🧾",
      title: "信托暴雷",
      story:
        "「中诚信托·XX号」逾期了——涉及金额¥300亿，投资者在总部楼下拉起了横幅。你看到新闻里一个穿西装的中年男人对着镜头说：「这是我妈的养老钱，¥200万。」那个人的表情比哭还难看。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 60 &&
          !st.flags._trustCrashSeen
        );
      },
      choices: [
        {
          text: "🔍 打听有没有打折转让的信托份额",
          hint: "¥5000收¥50000份额，可能血本无归也可能翻盘",
          apply: function (st) {
            st.flags._trustCrashSeen = true;
            if (st.resources.cash >= 5000) {
              st.resources.cash -= 5000;
              st.flags._trustDebtBought = true;
              st.flags._trustDebtDay = st.player.day;
              StateManager.addMessage(
                "🔍 你从一个急着用钱的人手里收了¥50000的信托债权。他谢谢你——你是来接盘的。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🔍 收债权的机会摆在眼前，但你连¥5000都没有。",
                "info",
              );
            }
          },
        },
        {
          text: "📞 安慰一下那个上新闻的人",
          hint: "虽然不认识，但人心都是肉长的",
          apply: function (st) {
            st.flags._trustCrashSeen = true;
            st.needs.happiness = Math.min(100, st.needs.happiness - 3);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            StateManager.addMessage(
              "📞 你搜到了他的微博，留了条私信：「大哥，挺住。」已读，没回。",
              "info",
            );
          },
        },
        {
          text: "📵 关掉新闻",
          hint: "眼不见心不烦",
          apply: function (st) {
            st.flags._trustCrashSeen = true;
            StateManager.addMessage(
              "📵 你划走了。¥300亿离你很远——你今天的烦恼是午饭吃¥8还是¥12。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "pandemic_black_swan",
      phase: "street",
      icon: "🦠",
      title: "突发公共卫生事件",
      story:
        "新闻弹窗：某区发现新型流感病例，全市进入三级响应。药店的口罩10分钟被抢光，超市的泡面和矿泉水货架空了一半。社区在招志愿者——包三餐，每天¥100补贴。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 15 &&
          st.player.day <= 200 &&
          !st.flags._pandemicSeen
        );
      },
      choices: [
        {
          text: "😷 报名社区志愿者",
          hint: "包三餐+¥100/天，但有一定健康风险",
          apply: function (st) {
            st.flags._pandemicSeen = true;
            st.flags._pandemicVolunteer = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            st.resources.cash += 300;
            StateManager.addMessage(
              "😷 你穿了三天防护服。社区大妈给你竖了大拇指。累，但值。",
              "event",
            );
          },
        },
        {
          text: "📦 进一批口罩和消毒液来卖",
          hint: "倒卖防疫物资，收益高但有争议",
          apply: function (st) {
            st.flags._pandemicSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._pandemicProfiteer = true;
              StateManager.addMessage(
                "📦 你进了一批口罩按进价3倍卖。赚钱了——但你妈知道了会怎么说？",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📦 想发财连本钱都没有。你第一次感谢贫穷让你保住了道德。",
                "info",
              );
            }
          },
        },
        {
          text: "🏠 在家囤粮减少外出",
          hint: "安全第一",
          apply: function (st) {
            st.flags._pandemicSeen = true;
            st.resources.cash -= 200;
            StateManager.addMessage(
              "🏠 你买了半个月的粮食和水。待在屋里最安全。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "chip_localization",
      phase: "street",
      icon: "🔬",
      title: "芯片国产化浪潮",
      story:
        "美国又升级了对华芯片出口管制。但新闻里说国产芯片良率突破了70%——虽然跟台积电还有差距，但够用了。工业园区的封装厂到处贴招聘广告：「芯片测试员，月薪¥6000起，包吃住。」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 45 &&
          !st.flags._chipLocalSeen
        );
      },
      choices: [
        {
          text: "🏭 去芯片厂面试",
          hint: "月薪¥6000，技能要求智力≥25",
          apply: function (st) {
            st.flags._chipLocalSeen = true;
            if ((st.player.intelligence || 0) >= 25) {
              st.flags._chipFabJob = true;
              StateManager.addMessage(
                "🏭 你面试过了。穿上无尘服的那一刻，感觉自己像个科学家。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🏭 你连笔试都没过。基础电路图看不懂——城里的知识门槛比想象的高。",
                "warning",
              );
            }
          },
        },
        {
          text: "📈 买国产芯片概念股",
          hint: "¥2000，赌国运",
          apply: function (st) {
            st.flags._chipLocalSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._chipStockBought = true;
              st.flags._chipStockDay = st.player.day;
              StateManager.addMessage(
                "📈 你买了国产芯片股。这是情怀还是投资——你分不清。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📈 连¥2000的股票都买不起。芯片国产化和你的钱包没什么关系。",
                "info",
              );
            }
          },
        },
        {
          text: "📖 报名夜校学电路基础",
          hint: "花笔学费学习实用技能",
          apply: function (st) {
            st.flags._chipLocalSeen = true;
            if (st.resources.cash >= 500) {
              st.resources.cash -= 500;
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 10) + 3,
              );
              StateManager.addMessage(
                "📖 你在夜校学了两个月电路。老师说你有天赋——你第一次被人夸。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "📖 ¥500的学费都掏不出来。你恨自己为什么以前不好好学习。",
                "info",
              );
            }
          },
        },
      ],
    },
    {
      id: "pre_made_food_trend",
      phase: "street",
      icon: "🍱",
      title: "预制菜入侵",
      story:
        "那条街上的三家小饭馆有两家换上了「预制菜」的招牌——料理包加热3分钟，成本¥3.5，卖¥18。王婶的面馆还在坚持手工拉面——但客人少了四成。冷冻批发市场多了好多卖料理包的摊位。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 20 &&
          !st.flags._preMadeFoodSeen
        );
      },
      choices: [
        {
          text: "📦 批发料理包来卖",
          hint: "门槛低利润薄，¥1000进货",
          apply: function (st) {
            st.flags._preMadeFoodSeen = true;
            if (st.resources.cash >= 1000) {
              st.resources.cash -= 1000;
              st.flags._premadeStock = true;
              StateManager.addMessage(
                "📦 你进了200包鱼香肉丝料理包。¥3.5进价卖¥6——薄利多销。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📦 连¥1000批发本钱都没有。你先把自己喂饱再说吧。",
                "info",
              );
            }
          },
        },
        {
          text: "🍜 支持王婶——帮她宣传手工面",
          hint: "名声+2，也许能帮她拉回客流",
          apply: function (st) {
            st.flags._preMadeFoodSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "🍜 你帮王婶在群里打了广告。来了几个新客——但不够。",
              "success",
            );
          },
        },
        {
          text: "🥟 跟王婶学手工拉面手艺",
          hint: "学一门手艺总是好的",
          apply: function (st) {
            st.flags._preMadeFoodSeen = true;
            st.flags._learnedNoodle = true;
            StateManager.addMessage(
              "🥟 王婶教你拉面。面和水的比例、醒面的时间——里面全是学问。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "consumption_downgrade",
      phase: "street",
      icon: "💰",
      title: "平替风暴",
      story:
        "拼多多的市值超过了阿里。街头到处都是「9.9包邮」的广告——隔壁小张在拼多多上进了一样的货，价格只有你的一半。品牌店的老板说：「现在的人只买对的，不买贵的——但对的是指最便宜的。」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 25 &&
          !st.flags._consumptionDownSeen
        );
      },
      choices: [
        {
          text: "📦 调整进货策略——走低价路线",
          hint: "薄利多销，¥2000进货",
          apply: function (st) {
            st.flags._consumptionDownSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._lowPriceRoute = true;
              StateManager.addMessage(
                "📦 你进了便宜货。利润薄但走量大——¥10一件一天能卖30件。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📦 连薄利多销的启动资金都不够。",
                "info",
              );
            }
          },
        },
        {
          text: "✨ 坚持卖品质货——走高端路线",
          hint: "利润高但客流少，做口碑",
          apply: function (st) {
            st.flags._consumptionDownSeen = true;
            st.flags._premiumRoute = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "✨ 你决定不降价。贵有贵的道理——你相信识货的人。",
              "event",
            );
          },
        },
        {
          text: "🛵 帮拼多多商家送货",
          hint: "跑腿一天赚¥150",
          apply: function (st) {
            st.flags._consumptionDownSeen = true;
            st.resources.cash += 150;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
            StateManager.addMessage(
              "🛵 你跑了一天配送。9.9包邮的商品，配送费¥2.5——跑得腿抽筋。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "going_global_trend",
      phase: "street",
      icon: "🌍",
      title: "出海浪潮",
      story:
        "SHEIN在北美杀疯了——一件裙子$9.9，美国年轻人疯抢。国内供应商跟着吃肉——张老板的服装厂以前接国内订单¥25/件，现在接SHEIN的订单¥35/件，只要质量达标。他满世界找熟练车工。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 50 &&
          !st.flags._goingGlobalSeen
        );
      },
      choices: [
        {
          text: "🧵 去服装厂上班",
          hint: "月薪¥5000，要求缝纫技能≥15",
          apply: function (st) {
            st.flags._goingGlobalSeen = true;
            st.flags._garmentJobApplied = true;
            StateManager.addMessage(
              "🧵 张老板看了你的手：「没干过车工吧？——学三个月就能上手。」",
              "event",
            );
          },
        },
        {
          text: "📦 倒卖SHEIN尾单货",
          hint: "¥1500进货，在夜市卖",
          apply: function (st) {
            st.flags._goingGlobalSeen = true;
            if (st.resources.cash >= 1500) {
              st.resources.cash -= 1500;
              st.flags._sheinFlipping = true;
              StateManager.addMessage(
                "📦 你进了一批SHEIN尾单。质量不错，夜市上一晚上卖了¥400。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📦 尾单货也进不起。你摸了摸那些衣服——料子确实好。",
                "info",
              );
            }
          },
        },
        {
          text: "📖 学英语准备做出海运营",
          hint: "花钱买教材，为将来铺路",
          apply: function (st) {
            st.flags._goingGlobalSeen = true;
            if (st.resources.cash >= 300) {
              st.resources.cash -= 300;
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 10) + 2,
              );
              StateManager.addMessage(
                "📖 买了一套英语教材。你从「How are you」开始复习。",
                "success",
              );
            }
          },
        },
      ],
    },
    {
      id: "traditional_retail_collapse",
      phase: "street",
      icon: "🏪",
      title: "超市关门潮",
      story:
        "沃尔玛这个月关了第三家店。家乐福的货架越来越空——供应商说账期从30天拖到了120天。关店大清仓：货架¥50一个，冷柜¥200一台，整箱的方便面¥10一箱。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 35 &&
          !st.flags._retailCollapseSeen
        );
      },
      choices: [
        {
          text: "🛒 去扫货——低价囤日用品",
          hint: "¥500扫货，转手能卖¥1000",
          apply: function (st) {
            st.flags._retailCollapseSeen = true;
            if (st.resources.cash >= 500) {
              st.resources.cash -= 500;
              st.flags._clearanceStock = true;
              StateManager.addMessage(
                "🛒 你扫了一堆日用品——洗衣液¥5一瓶，纸巾¥2一条。赚了。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🛒 连¥500的便宜都占不起。你蹲在清仓区看别人抢购。",
                "info",
              );
            }
          },
        },
        {
          text: "🛋️ 买个便宜的货架自己摆摊用",
          hint: "投资固定资产，¥50一个货架",
          apply: function (st) {
            st.flags._retailCollapseSeen = true;
            st.resources.cash -= 50;
            st.flags._stallShelf = true;
            StateManager.addMessage(
              "🛋️ 你买了一个超市货架。以后摆摊东西终于可以摆放整齐了。",
              "event",
            );
          },
        },
        {
          text: "😔 在门口看了一会儿",
          hint: "感慨",
          apply: function (st) {
            st.flags._retailCollapseSeen = true;
            StateManager.addMessage(
              "🏪 你站在关门的超市门口。时代抛弃你的时候，连招呼都不打。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "ev_price_war",
      phase: "street",
      icon: "🚗",
      title: "新能源价格战",
      story:
        "特斯拉降价¥3万，比亚迪跟进降价¥2万，小鹏汽车直接推出了¥10万的车型。二手车商的朋友圈在哀嚎——「2022年的Model 3，收车价从¥18万跌到¥12万。」充电桩公司倒是笑开了花——车卖得多，桩不够用了。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          !st.flags._evPriceWarSeen
        );
      },
      choices: [
        {
          text: "⚡ 问充电桩公司需不需要人",
          hint: "安装充电桩，体力活但前景好",
          apply: function (st) {
            st.flags._evPriceWarSeen = true;
            st.flags._evChargingJob = true;
            StateManager.addMessage(
              "⚡ 充电桩公司缺安装工——日结¥350，就是晒。",
              "event",
            );
          },
        },
        {
          text: "📈 买充电桩公司的股票",
          hint: "电动汽车越多，充电桩越赚",
          apply: function (st) {
            st.flags._evPriceWarSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._evChargingStock = true;
              st.flags._evChargingStockDay = st.player.day;
              StateManager.addMessage(
                "📈 你买了充电桩公司的股票。卖铲子的人比挖金矿的人更稳。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📈 想投资但没钱。你连两轮电动车都只有一辆旧的。",
                "info",
              );
            }
          },
        },
        {
          text: "🚶 跟你没关系——你坐公交",
          hint: "地铁月卡¥200",
          apply: function (st) {
            st.flags._evPriceWarSeen = true;
            StateManager.addMessage(
              "🚶 你连电动自行车都还没骑上。价格战是别人的烟火。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "street_vendor_crackdown",
      phase: "street",
      icon: "🚨",
      title: "城管来了",
      story:
        "区里创文创卫检查，城管突然严打——三轮车被没收了五辆。老赵的车被抬上卡车时他差点哭了：「我贷款买的车啊……」但街角那个有固定摊位的人照样做生意——有关系和没关系，就是不一样。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 10 &&
          !st.flags._vendorCrackdownSeen
        );
      },
      choices: [
        {
          text: "🏪 花钱办个固定摊位证",
          hint: "花¥2000办证，以后合法经营",
          apply: function (st) {
            st.flags._vendorCrackdownSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.flags._legalStallPermit = true;
              StateManager.addMessage(
                "🏪 你办了摊位证。贵，但再也不用躲城管了。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🏪 连办证的钱都没有。你推着车躲了一天。",
                "warning",
              );
            }
          },
        },
        {
          text: "🚶 转做流动摊贩——打游击",
          hint: "低成本，但可能被没收装备",
          apply: function (st) {
            st.flags._vendorCrackdownSeen = true;
            st.flags._guerrillaVendor = true;
            StateManager.addMessage(
              "🚶 你学会了看风使舵——听到风声就收摊跑。生存技能+1。",
              "info",
            );
          },
        },
        {
          text: "📢 帮被没收车的人去要车",
          hint: "跑腿费¥100/次，需要关系",
          apply: function (st) {
            st.flags._vendorCrackdownSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            st.resources.cash += 100;
            StateManager.addMessage(
              "📢 你帮老赵要回了三轮车。他千恩万谢。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "minimum_wage_hike",
      phase: "street",
      icon: "🏃",
      title: "最低工资上调",
      story:
        "市人社局发公告了：最低工资从¥2200调到¥2480。餐馆门口贴出了新菜单——「因人工成本上涨，部分菜品价格上调5%~10%」。王婶说：「涨工资是好事——但物价涨得比工资快。」",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          !st.flags._minWageHikeSeen
        );
      },
      choices: [
        {
          text: "💰 这是好事——你的收入会涨",
          hint: "部分工作收入+10%",
          apply: function (st) {
            st.flags._minWageHikeSeen = true;
            st.flags._minWageRaised = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 8);
            StateManager.addMessage(
              "💰 你的日结工资确实涨了——虽然不多，但够每天加个蛋。",
              "success",
            );
          },
        },
        {
          text: "🏠 担心房东要涨房租",
          hint: "物价上涨后房租通常跟着涨",
          apply: function (st) {
            st.flags._minWageHikeSeen = true;
            st.flags._rentWillIncrease = true;
            StateManager.addMessage(
              "🏠 房东果然在群里暗示了。涨¥100——不多，但工资涨的那点全填进去了。",
              "info",
            );
          },
        },
        {
          text: "💭 跟工友讨论要不要找老板谈加薪",
          hint: "人多力量大，但也可能被开除",
          apply: function (st) {
            st.flags._minWageHikeSeen = true;
            st.flags._wageNegotiation = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "💭 大家商量好了——一起去找老板。你被推选为代表。",
              "event",
            );
          },
        },
      ],
    },
    {
      id: "social_security_reform",
      phase: "street",
      icon: "🏛️",
      title: "社保改革来了",
      story:
        "社保入税新政实施——以前最低基数交社保，现在必须按实际工资足额缴纳。灵活就业群里炸了锅：「自己交社保，一个月¥1500——我一个月才赚¥5000！」有人说不交了，有人说老了怎么办。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 40 &&
          !st.flags._socialSecuritySeen
        );
      },
      choices: [
        {
          text: "💰 咬咬牙按最低档交社保",
          hint: "¥800/月，长远看是保障",
          apply: function (st) {
            st.flags._socialSecuritySeen = true;
            st.flags._paySocialSecurity = true;
            if (st.resources.cash >= 800) {
              st.resources.cash -= 800;
              StateManager.addMessage(
                "💰 你交了¥800社保。心疼——但想到老了至少有个依靠。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "💰 连¥800都掏不出来。你第一次真切感受到什么是「生存大于生活」。",
                "info",
              );
            }
          },
        },
        {
          text: "💼 找个正规公司上班——让公司交",
          hint: "有稳定工作才能有社保",
          apply: function (st) {
            st.flags._socialSecuritySeen = true;
            st.flags._wantFormalJob = true;
            StateManager.addMessage(
              "💼 你开始认真找工作了——不为别的，就为那五险一金。",
              "event",
            );
          },
        },
        {
          text: "🤟 赌自己不会生病——不交了",
          hint: "省钱但高风险",
          apply: function (st) {
            st.flags._socialSecuritySeen = true;
            st.flags._noSocialSecurity = true;
            StateManager.addMessage(
              "🤟 你赌自己年轻不会出事。年轻是你唯一的资本。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "garbage_classification",
      phase: "street",
      icon: "🗑️",
      title: "垃圾分类来了",
      story:
        "小区楼下多了四个颜色的垃圾桶。居委会大妈每天早晚站在垃圾桶边：「你这是什么垃圾？」有个人因为没分类被罚了¥50。但有人发现了商机——「代扔垃圾，¥5一次」。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 15 &&
          !st.flags._garbageClassSeen
        );
      },
      choices: [
        {
          text: "👨‍🏫 报名做垃圾分类指导员",
          hint: "收入不高但有名气加成",
          apply: function (st) {
            st.flags._garbageClassSeen = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.resources.cash += 50;
            StateManager.addMessage(
              "👨‍🏫 你穿上了志愿者马甲。站了一天——比打工轻松。",
              "info",
            );
          },
        },
        {
          text: "🚶 帮人代扔垃圾",
          hint: "¥5/次，靠勤劳赚钱",
          apply: function (st) {
            st.flags._garbageClassSeen = true;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
            st.resources.cash += 60;
            StateManager.addMessage(
              "🚶 你帮几户老年人扔了垃圾。¥5不多，但积少成多。",
              "info",
            );
          },
        },
        {
          text: "📖 认真学习分类规则",
          hint: "不被罚款就是赚",
          apply: function (st) {
            st.flags._garbageClassSeen = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            );
            StateManager.addMessage(
              "📖 你背了分类口诀。「猪能吃的是湿垃圾」——记住了。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "short_video_fever",
      phase: "street",
      icon: "🎥",
      title: "短视频风口",
      story:
        "这条街上出了个网红——卖炒粉的阿珍，一个「炒粉翻锅」视频涨了10万粉。现在她直播炒粉，一晚流水¥3000。你也掏出手机试了试——拍了三条，播放量分别是12、3、0。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 25 &&
          !st.flags._shortVideoSeen
        );
      },
      choices: [
        {
          text: "🎥 认真做短视频——记录城市打工生活",
          hint: "投入精力不一定有回报",
          apply: function (st) {
            st.flags._shortVideoSeen = true;
            st.flags._triedShortVideo = true;
            var luck = Random.float(0, 1);
            if (luck < 0.15) {
              st.flags._shortVideoWentViral = true;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 20);
              st.resources.cash += 5000;
              StateManager.addMessage(
                "🎥 你拍的一条「城中村早餐摊」突然爆了！播放量200万！后台私信炸了。",
                "event",
              );
            } else if (luck < 0.5) {
              st.resources.cash += 200;
              st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
              StateManager.addMessage(
                "🎥 你坚持发了一个月。有了500个粉丝——不多，但有人在看。",
                "info",
              );
            } else {
              st.needs.happiness = Math.max(0, st.needs.happiness - 5);
              StateManager.addMessage(
                "🎥 你拍了30条视频，平均播放量不到50。这行不是谁都能干的。",
                "info",
              );
            }
          },
        },
        {
          text: "📦 给阿珍供货——她带货需要货源",
          hint: "做供应链赚钱稳",
          apply: function (st) {
            st.flags._shortVideoSeen = true;
            if (st.resources.cash >= 1000) {
              st.resources.cash -= 1000;
              st.flags._influencerSupply = true;
              StateManager.addMessage(
                "📦 你跟阿珍谈了合作——她卖货你供货。靠谱的生意。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📦 想供货但没本钱。阿珍说：「下次吧。」",
                "info",
              );
            }
          },
        },
        {
          text: "📱 刷短视频消磨时间",
          hint: "啥也不干",
          apply: function (st) {
            st.flags._shortVideoSeen = true;
            st.needs.happiness = Math.min(100, st.needs.happiness + 3);
            StateManager.addMessage(
              "📱 刷了一晚上短视频。时间就这么过去了。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "exam_competition",
      phase: "street",
      icon: "📝",
      title: "考公大军",
      story:
        "大学城旁边的书店里，考研和考公的资料占了整整两面墙。今年国考报名人数突破300万——一个岗位招1个，17000人报名。辅导班的广告说：「不过全退。」但学费¥49800。有人在大学城旁边开了钟点房——考试那周暴涨到¥500一晚。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 35 &&
          !st.flags._examCompetitionSeen &&
          (st.player.intelligence || 0) >= 20
        );
      },
      choices: [
        {
          text: "📚 买套考公资料自己学",
          hint: "花点钱换一个全新的方向",
          apply: function (st) {
            st.flags._examCompetitionSeen = true;
            if (st.resources.cash >= 300) {
              st.resources.cash -= 300;
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 10) + 2,
              );
              st.flags._studyingCivilExam = true;
              StateManager.addMessage(
                "📚 你买了行测和申论。翻开第一页——15年前的知识好像在脑子里还没丢完。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "📚 连¥300的书都买不起。你心想——算了吧，搬砖更适合我。",
                "info",
              );
            }
          },
        },
        {
          text: "🏠 在大学城附近租间房做日租",
          hint: "考试期间需求暴涨",
          apply: function (st) {
            st.flags._examCompetitionSeen = true;
            if (st.resources.cash >= 3000) {
              st.resources.cash -= 3000;
              st.flags._examRentalBiz = true;
              StateManager.addMessage(
                "🏠 你租了一间房做日租。考试那几天赚了¥2000。",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🏠 想做日租生意但没启动资金。机会是给有准备的人的。",
                "info",
              );
            }
          },
        },
        {
          text: "🏪 去辅导班发传单",
          hint: "日结¥120",
          apply: function (st) {
            st.flags._examCompetitionSeen = true;
            st.resources.cash += 120;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
            StateManager.addMessage(
              "🏪 你发了一天传单。每一个接过传单的人脸上都写着焦虑。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "health_scam",
      phase: "street",
      icon: "🧬",
      title: "免费体检陷阱",
      story:
        "街口新开了一家「健康理疗中心」，门口写着「免费测血压、测血糖、送鸡蛋一斤」。一群老年人排着队进去了。两个小时后每个人出来都提着一袋¥2980的「纳米磁疗被」。你知道是骗局——但那些老人笑得挺开心。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 20 &&
          !st.flags._healthScamSeen
        );
      },
      choices: [
        {
          text: "📢 去揭穿骗局——告诉那些老人",
          hint: "名声+5，但可能被威胁",
          apply: function (st) {
            st.flags._healthScamSeen = true;
            st.flags._scamWhistleblower = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            var danger = Random.float(0, 1);
            if (danger < 0.3) {
              st.status.health = Math.max(0, st.status.health - 5);
              StateManager.addMessage(
                "📢 你被理疗中心的人威胁了。「多管闲事的下场你知道吧？」你说知道了。",
                "warning",
              );
            } else {
              StateManager.addMessage(
                "📢 你成功劝住了三个老人。他们的子女打电话来感谢你。",
                "event",
              );
            }
          },
        },
        {
          text: "💰 去应聘做推销员——拿提成",
          hint: "灰色收入，卖一单提成¥500",
          apply: function (st) {
            st.flags._healthScamSeen = true;
            st.flags._scamSalesman = true;
            st.resources.cash += 500;
            st.player.fame = Math.max(0, (st.player.fame || 0) - 3);
            StateManager.addMessage(
              "💰 你卖出了一床被子。¥500提成拿到手——但那老太太说「小伙子你是个好人」的时候你不敢看她的眼睛。",
              "event",
            );
          },
        },
        {
          text: "🚶 领了鸡蛋就走",
          hint: "免费鸡蛋不拿白不拿",
          apply: function (st) {
            st.flags._healthScamSeen = true;
            st.needs.hunger = Math.min(100, st.needs.hunger + 3);
            StateManager.addMessage(
              "🚶 你领了一斤鸡蛋，听完推销就走了。销售在背后骂骂咧咧。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "last_baton",
      phase: "street",
      icon: "🎵",
      title: "最后一棒",
      story:
        "这条街上掀起了一股网红脆皮五花肉的热潮——第一家店门口排了30米长队。第二家在对面开张。现在这条街上有8家同款。第一家店的老板已经开始贴转让广告了。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 30 &&
          !st.flags._lastBatonSeen
        );
      },
      choices: [
        {
          text: "🥠 趁现在还赚钱开一家",
          hint: "¥5000投入，可能血本无归",
          apply: function (st) {
            st.flags._lastBatonSeen = true;
            if (st.resources.cash >= 5000) {
              st.resources.cash -= 5000;
              var luck = Random.float(0, 1);
              if (luck < 0.25) {
                st.resources.cash += 12000;
                StateManager.addMessage(
                  "生意火爆赚了¥12000！但满街模仿者让你不安。",
                  "event",
                );
              } else if (luck < 0.6) {
                st.resources.cash += 2000;
                StateManager.addMessage(
                  "不赚不亏。风口来得快去得也快。",
                  "info",
                );
              } else {
                StateManager.addMessage(
                  "开业太晚，整条街在打折甩卖。打水漂了。",
                  "warning",
                );
              }
            } else {
              StateManager.addMessage("连启动资金都不够。", "info");
            }
          },
        },
        {
          text: "💲 给第一家店供货",
          hint: "赚快钱，¥2000进货",
          apply: function (st) {
            st.flags._lastBatonSeen = true;
            if (st.resources.cash >= 2000) {
              st.resources.cash -= 2000;
              st.resources.cash += 3500;
              StateManager.addMessage("供了三天货，赚了¥1500。", "success");
            } else {
              StateManager.addMessage("想供货连本钱都没有。", "info");
            }
          },
        },
        {
          text: "🔍 什么都不做",
          hint: "等待泡沫破裂",
          apply: function (st) {
            st.flags._lastBatonSeen = true;
            st.flags._lastBatonWise = true;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 3,
            );
            StateManager.addMessage(
              "你看着这条街从风口变成闹剧。三个月后8家关了6家。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "sunk_cost_trap",
      phase: "street",
      icon: "🎰",
      title: "沉没成本",
      story:
        "你之前投了一笔生意——¥50万砸进去了，项目半死不活。合伙人电话来了：「再投¥10万就能撑到下一轮——已经走到这一步了。」你握着手机，手心全是汗。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 60 &&
          !st.flags._sunkCostSeen &&
          st.resources.cash >= 50000
        );
      },
      choices: [
        {
          text: "💰 追加投资",
          hint: "投¥10万，50%可能翻盘",
          apply: function (st) {
            st.flags._sunkCostSeen = true;
            if (st.resources.cash >= 100000) {
              st.resources.cash -= 100000;
              var luck = Random.float(0, 1);
              if (luck < 0.45) {
                st.resources.cash += 300000;
                StateManager.addMessage(
                  "赌对了！项目被收购，拿回¥30万。",
                  "event",
                );
              } else {
                StateManager.addMessage(
                  "又赔了。合伙人联系不上了。总共亏了¥15万。",
                  "danger",
                );
              }
            } else {
              StateManager.addMessage("想追加但钱不够。也许是好事。", "info");
            }
          },
        },
        {
          text: "✋ 止损",
          hint: "认了",
          apply: function (st) {
            st.flags._sunkCostSeen = true;
            st.flags._sunkCostStopped = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            StateManager.addMessage(
              "你说不。合伙人在电话里骂了你。但挂了电话反而轻松了。",
              "success",
            );
          },
        },
        {
          text: "🤝 找其他投资人接盘",
          hint: "名声≥30才能脱身",
          apply: function (st) {
            st.flags._sunkCostSeen = true;
            if ((st.player.fame || 0) >= 30) {
              st.flags._sunkCostBailed = true;
              st.resources.cash -= 5000;
              StateManager.addMessage(
                "通过关系找到接盘侠。亏了¥5万中介费——比全亏好。",
                "event",
              );
            } else {
              StateManager.addMessage("没人愿意接——你名声不够。", "warning");
            }
          },
        },
      ],
    },
    {
      id: "gray_to_legit",
      phase: "street",
      icon: "📄",
      title: "灰色地带合法化",
      story:
        "以前你靠灰色手段赚了第一桶金——倒卖发票、刷单。现在行业正规化了——政府发了牌照。当年的灰色技能突然变成了合规经验。以前的污点成了先发优势。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 90 &&
          !st.flags._grayToLegitSeen
        );
      },
      choices: [
        {
          text: "💼 申请正规牌照",
          hint: "¥20000办牌照，合法经营",
          apply: function (st) {
            st.flags._grayToLegitSeen = true;
            if (st.resources.cash >= 20000) {
              st.resources.cash -= 20000;
              st.flags._grayLegitBiz = true;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
              StateManager.addMessage(
                "拿到牌照。以前偷偷摸摸的事现在光明正大了。",
                "event",
              );
            } else {
              StateManager.addMessage("连办牌照的钱都不够。", "info");
            }
          },
        },
        {
          text: "🏠 低调退出",
          hint: "功成身退",
          apply: function (st) {
            st.flags._grayToLegitSeen = true;
            st.flags._grayRetired = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            StateManager.addMessage(
              "清空了灰色历史。以前的路不正——但你出来了。",
              "event",
            );
          },
        },
        {
          text: "👤 帮同行转正",
          hint: "名声+5",
          apply: function (st) {
            st.flags._grayToLegitSeen = true;
            st.flags._grayHelpedOthers = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
            StateManager.addMessage(
              "帮三个朋友办了正规手续。第一次干干净净吃饭。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "class_rollback",
      phase: "street",
      icon: "💨",
      title: "从天而降",
      story:
        "你中彩票了——或者拆迁款到账了——反正一夜之间有了¥200万。你搬进高档公寓，请工友吃了¥5000的饭。三个月后，钱花了一半。没有新的收入来源。",
      conditions: function (st) {
        return (
          st.player.phase === "street" &&
          st.player.day >= 50 &&
          !st.flags._classRollbackSeen &&
          (st.flags._demolitionGambled || st.resources.cash >= 50000)
        );
      },
      choices: [
        {
          text: "🏦 买房变资产",
          hint: "¥150万买房，月供¥5000",
          apply: function (st) {
            st.flags._classRollbackSeen = true;
            st.flags._rollbackBoughtHouse = true;
            st.resources.cash -= 1500000;
            if (st.housing) st.housing.tier = Math.max(st.housing.tier || 0, 5);
            StateManager.addMessage(
              "买了市中心两居室。月供¥5000——不叫财富自由，叫换种活法。",
              "event",
            );
          },
        },
        {
          text: "💰 存银行吃利息",
          hint: "¥200万大额存单3.5%",
          apply: function (st) {
            st.flags._classRollbackSeen = true;
            st.flags._rollbackSaved = true;
            st.resources.cash -= 2000000;
            st.flags._rollbackDay = st.player.day;
            StateManager.addMessage(
              "存了¥200万。月利息¥5800——比打工强，但越来越不值钱。",
              "event",
            );
          },
        },
        {
          text: "🎓 投资自己开公司",
          hint: "花¥50万学技能+注册",
          apply: function (st) {
            st.flags._classRollbackSeen = true;
            st.flags._rollbackStartedBiz = true;
            st.resources.cash -= 500000;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 10,
            );
            StateManager.addMessage(
              "报了MBA，注册了公司。有人笑你是暴发户——你没理。",
              "event",
            );
          },
        },
        {
          text: "🍺 继续高消费",
          hint: "爽一时，钱会花完",
          apply: function (st) {
            st.flags._classRollbackSeen = true;
            st.flags._rollbackBurned = true;
            st.resources.cash -= 50000;
            st.needs.happiness = Math.min(100, st.needs.happiness + 25);
            StateManager.addMessage(
              "租奔驰请全城喝了三天。卡里少了¥50000——最快乐72小时。",
              "event",
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

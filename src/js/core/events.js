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
          if (Math.random() < 0.5) {
            const reward = 50 + Math.floor(Math.random() * 80);
            st.resources.cash += reward;
            st.player.fame = Math.min(100, st.player.fame + 2);
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

  // === 房地产赌局事件链（3阶段链式） ===
  // L1：发现楼盘烂尾风险
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

  // L2：内幕消息 — 赌局抉择
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
          const success = Math.random() < 0.6;
          if (success) {
            const profit = 2000 + Math.floor(Math.random() * 1500) + 500;
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
              scheduleChainEvent(st, "real_estate_aftermath_win", 5, "street");
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
              scheduleChainEvent(st, "real_estate_aftermath_lose", 5, "street");
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
          const success = Math.random() < 0.6;
          if (success) {
            const profit = 500 + Math.floor(Math.random() * 500) + 200;
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

  // L3a：赌局成功的代价 — 被盯上
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
          const win = Math.random() < 0.3 + (st.player.physique - 20) * 0.02;
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

  // L3b：赌局失败的后果 — 欠债
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
          const extra = 30 + Math.floor(Math.random() * 40);
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
          const success = Math.random() < 0.3 + st.player.fame * 0.01;
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

  // === 内幕交易事件链（4阶段链式） ===
  // L1：风声 — 听到投资圈传闻
  {
    id: "insider_rumor_start",
    phase: "corporate",
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
          const found =
            Math.random() < 0.4 + (st.player.intelligence - 30) * 0.02;
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
          st.player.corporate.kpi = Math.min(150, st.player.corporate.kpi + 5);
          st.needs.happiness = Math.min(100, st.needs.happiness + 2);
          StateManager.addMessage(
            "🚫 你摇摇头继续干活。八卦听听就好，不耽误正事。",
            "info",
          );
        },
      },
    ],
  },

  // L2：验证结果 — 消息真假
  {
    id: "insider_verify",
    phase: "corporate",
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
          const success = Math.random() < 0.7;
          if (success) {
            const profit = 3000 + Math.floor(Math.random() * 2000) + 1000;
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
              scheduleChainEvent(st, "insider_aftermath_fail", 5, "corporate");
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
          const success = Math.random() < 0.7;
          if (success) {
            const profit = 1000 + Math.floor(Math.random() * 600) + 300;
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

  // L3a：成功后 — 监管调查
  {
    id: "insider_aftermath_success",
    phase: "corporate",
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
          const safe = Math.random() < 0.8;
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
          const ok = Math.random() < 0.6;
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
          const safe = Math.random() < 0.5;
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

  // L3b：失败后 — 追债
  {
    id: "insider_aftermath_fail",
    phase: "corporate",
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
          const recovered = Math.random() < 0.15;
          if (recovered) {
            const back = 300 + Math.floor(Math.random() * 200);
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
          st.player.corporate.kpi = Math.min(150, st.player.corporate.kpi + 10);
          st.player.corporate.upwardMgmt = Math.min(
            100,
            st.player.corporate.upwardMgmt + 3,
          );
          st.player.corporate.risk = Math.min(
            100,
            st.player.corporate.risk + 5,
          );
          const extra = 50 + Math.floor(Math.random() * 50);
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
  // -- 地点切换触发类 --
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
            var skillScore = st.skills.sales.level + st.skills.management.level;
            if (Math.random() < 0.2 + skillScore * 0.005) {
              st.resources.cash += 50000;
              st.player.fame = Math.min(100, st.player.fame + 20);
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
          if (Math.random() < 0.15) {
            const fine = 300 + Math.floor(Math.random() * 200);
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
          const earned = 400 + Math.floor(Math.random() * 300);
          st.resources.cash += earned;
          st.resources.totalEarned += earned;
          if (Math.random() < 0.3) {
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
          if (Math.random() < 0.5) {
            const refund = 400 + Math.floor(Math.random() * 200);
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
          const loss = 500 + Math.floor(Math.random() * 500);
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
          st.player.intelligence = Math.min(100, st.player.intelligence + 0.5);
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
          if (Math.random() < 0.45) {
            StateManager.addMessage(
              "⏳ 年底工头跑路了。那两个月的工钱就这么没了。",
              "danger",
            );
            st.needs.happiness = Math.max(0, st.needs.happiness - 25);
          } else {
            const paid = 1200 + Math.floor(Math.random() * 800);
            st.resources.cash += paid;
            st.resources.totalEarned += paid;
            StateManager.addMessage(
              "⏳ 没想到工头真的年底结账，一次性给了 ¥" + paid + "，虚惊一场。",
              "success",
            );
          }
        },
      },
      {
        text: "🏛️ 去劳动局投诉",
        hint: "用法律维权",
        apply: function (st) {
          const recovered = 600 + Math.floor(Math.random() * 400);
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

  // === 街头机遇类 ===
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
          } else if (Math.random() < 0.4) {
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
          if (Math.random() < 0.6) {
            const bonus = 800 + Math.floor(Math.random() * 1200);
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
          if (Math.random() < 0.7) {
            st.resources.cash -= 150;
            st.player.fame = Math.min(100, st.player.fame + 2);
            StateManager.addMessage(
              "📱 手机买到了，成色还不错！跑外卖的路敞开了，名气+2。",
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
          st.player.intelligence = Math.min(100, st.player.intelligence + 0.3);
          const price = 100 + Math.floor(Math.random() * 80);
          st.resources.cash -= price;
          StateManager.addMessage(
            "🔍 你仔细测试了30分钟，砍价到¥" + price + "成交，没有暗病。",
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
            const tip = Math.random();
            if (tip < 0.4) {
              const cash = 200 + Math.floor(Math.random() * 300);
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
          const saved = 100 + Math.floor(Math.random() * 200);
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
          if (Math.random() < 0.5) {
            const deal = 150 + Math.floor(Math.random() * 200);
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
            StateManager.addMessage("📋 凑不出¥200，只能另想办法。", "warning");
          }
        },
      },
      {
        text: "🤝 打听消息，提前和城管疏通",
        hint: "走关系",
        apply: function (st) {
          const bribe = 100 + Math.floor(Math.random() * 100);
          if (st.resources.cash >= bribe) {
            st.resources.cash -= bribe;
            if (st.chengguan)
              st.chengguan.heat = Math.max(0, st.chengguan.heat - 30);
            StateManager.addMessage(
              "🤝 花了 ¥" + bribe + " 疏通关系，城管对你睁一只眼闭一只眼。",
              "warning",
            );
          } else {
            StateManager.addMessage("🤝 没够疏通的钱，只能祈祷了。", "warning");
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

  // === NPC 关联触发类 ===
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
          const earned = 250 + Math.floor(Math.random() * 150);
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
              ? 500 + Math.floor(Math.random() * 300)
              : affinity >= 20
                ? 200 + Math.floor(Math.random() * 200)
                : 50 + Math.floor(Math.random() * 100);
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
          const small = 50 + Math.floor(Math.random() * 80);
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
          if (Math.random() < 0.6) {
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

  // === 露宿街头专属事件（housing.tier === 0）===
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
          if (Math.random() < 0.4) {
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

  // === 露宿街头专属事件（housing.tier === 0）续 ===
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
          if (Math.random() < 0.4) {
            const earned = 20 + Math.floor(Math.random() * 30);
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
          if (Math.random() < 0.5) {
            var earned2 = 100 + Math.floor(Math.random() * 50);
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
          if (Math.random() < 0.6) {
            var reward = 200 + Math.floor(Math.random() * 300);
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
          var earn = 600 + Math.floor(Math.random() * 400);
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
          st.player.intelligence = Math.min(100, st.player.intelligence + 0.5);
          var rewardB = 100 + Math.floor(Math.random() * 200);
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
          if (Math.random() < 0.2) {
            var cost = 200 + Math.floor(Math.random() * 200);
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

  // === 人生章节里程碑事件（day精确触发，每个只触发一次）===
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
          var remit = 200 + Math.floor(Math.random() * 200);
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

  // === 道德后果事件 — 过去的选择会被记住 ===
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
          var pay = 300 + Math.floor(Math.random() * 200);
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
          var repaid = 100 + Math.floor(Math.random() * 80);
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
          var bonus = 500 + Math.floor(Math.random() * 300);
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
          var award = 200 + Math.floor(Math.random() * 100);
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
          var award = 200 + Math.floor(Math.random() * 100);
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
          const earned = 160 + Math.floor(Math.random() * 80);
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

  // ── 中期生活片段事件 #60-69 ─────────────────────────────────
  {
    id: "neighbor_dispute",
    title: "🏠 邻里纷争",
    description:
      "隔壁两家因为停车位的事吵得不可开交，其中一家来找你评理。你在这片住了一阵，两边都有些交情。",
    conditions: function (state) {
      return (
        state.player.day >= 15 &&
        state.player.phase === "street" &&
        (state.trade.currentLocation === "slum" ||
          state.trade.currentLocation === "park")
      );
    },
    weight: 0.7,
    choices: [
      {
        text: "🤝 居中调停，说明利害",
        apply: function (state) {
          state.player.fame = Math.min(100, (state.player.fame || 0) + 5);
          state.needs.happiness = Math.min(100, state.needs.happiness + 8);
          StateManager.addMessage(
            "🤝 你耐心劝说，双方各退一步，你在街坊间的声望涨了不少。名气+5，心情+8。",
            "success",
          );
        },
      },
      {
        text: "🚶 假装没看见，快步走开",
        apply: function (state) {
          state.needs.happiness = Math.max(0, state.needs.happiness - 3);
          StateManager.addMessage(
            "😬 你低头快步走开，但总觉得少了点什么——有些事不能只当路人。",
            "info",
          );
        },
      },
    ],
  },

  {
    id: "street_cat_rescue",
    title: "🐱 巷子里的小猫",
    description:
      "一只小橘猫被卡在了下水道格栅里，路人围着看却没人动手。猫叫得越来越弱，再不救怕是凶多吉少。",
    conditions: function (state) {
      return (
        state.player.day >= 10 &&
        state.player.phase === "street" &&
        state.trade.currentLocation === "slum"
      );
    },
    weight: 0.6,
    choices: [
      {
        text: "🛠️ 撸起袖子，想办法救出来",
        apply: function (state) {
          state.needs.happiness = Math.min(100, state.needs.happiness + 12);
          state.needs.hygiene = Math.max(0, state.needs.hygiene - 10);
          state.player.fame = Math.min(100, (state.player.fame || 0) + 3);
          StateManager.addMessage(
            "🐱 你把小猫救了出来，路人鼓起掌来。衣服脏了，但心情大好。心情+12，卫生-10，名气+3。",
            "success",
          );
        },
      },
      {
        text: "😔 看了一眼，叹气离开",
        apply: function (state) {
          state.needs.happiness = Math.max(0, state.needs.happiness - 5);
          state.player.mental = Math.max(0, state.player.mental - 1);
          StateManager.addMessage(
            "😔 小猫的叫声追了你好久。城市太大了，不是每件事都能管。心情-5，心智-1。",
            "warning",
          );
        },
      },
    ],
  },

  {
    id: "expired_food_deal",
    title: "🛒 廉价食品",
    description:
      "超市门口有人在低价甩卖一批临期食品，看起来都是正规品牌，就是保质期只剩三天了。对现在的你来说，¥20能买够吃三天。",
    conditions: function (state) {
      return (
        state.player.day >= 5 &&
        state.player.phase === "street" &&
        state.resources.cash < 100 &&
        (state.trade.currentLocation === "commercialDist" ||
          state.trade.currentLocation === "slum")
      );
    },
    weight: 0.8,
    choices: [
      {
        text: "💰 买！¥20，省下来买别的",
        apply: function (state) {
          if (state.resources.cash >= 20) {
            state.resources.cash -= 20;
            state.needs.hunger = Math.min(100, state.needs.hunger + 40);
            StateManager.addMessage(
              "🛒 花了¥20买了一堆临期食品，够吃好几天了。饥饱+40。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "😢 翻了翻口袋，连¥20都不够了……",
              "warning",
            );
          }
        },
      },
      {
        text: "🙅 算了，吃新鲜的",
        apply: function (state) {
          state.needs.happiness = Math.min(100, state.needs.happiness + 3);
          StateManager.addMessage(
            "😌 你还是选择了有尊严地生活。省钱是省钱，但底线还是要有的。心情+3。",
            "info",
          );
        },
      },
    ],
  },

  {
    id: "rain_shelter",
    title: "🌧️ 避雨奇遇",
    description:
      "突然下起大雨，你跑进一家面馆门廊避雨。老板娘看你淋成落汤鸡的样子，笑着说'进来坐吧，不买也没事'。",
    conditions: function (state) {
      return (
        state.player.day >= 8 &&
        state.player.phase === "street" &&
        state.weather &&
        (state.weather.type === "rainy" || state.weather.type === "storm")
      );
    },
    weight: 1.0,
    choices: [
      {
        text: "☕ 进去坐，要碗便宜的汤",
        apply: function (state) {
          var cost = 8;
          if (state.resources.cash >= cost) {
            state.resources.cash -= cost;
            state.needs.hunger = Math.min(100, state.needs.hunger + 20);
            state.needs.happiness = Math.min(100, state.needs.happiness + 15);
            StateManager.addMessage(
              "🍜 热腾腾的汤下肚，冷意散了大半。雨里遇到的温情，比汤还暖。花费¥8，饥饱+20，心情+15。",
              "success",
            );
          } else {
            state.needs.happiness = Math.min(100, state.needs.happiness + 8);
            StateManager.addMessage(
              "😊 老板娘让你白坐着等雨停，还给你倒了杯热水。世界有时候比你想的温柔。心情+8。",
              "success",
            );
          }
        },
      },
      {
        text: "🏃 谢谢，我还有事，冒雨走",
        apply: function (state) {
          state.needs.hygiene = Math.max(0, state.needs.hygiene - 15);
          state.needs.fatigue = Math.min(100, state.needs.fatigue + 10);
          StateManager.addMessage(
            "🌧️ 你淋着雨跑回去，衣服全湿透了，疲惫加重了不少。卫生-15，疲劳+10。",
            "warning",
          );
        },
      },
    ],
  },

  {
    id: "phone_scam_call",
    title: "📞 诈骗电话",
    description:
      "你接到一个陌生电话，对方声称是'公安局'，说你名下有一张违规信用卡，需要配合调查，要你把存款转到'安全账户'……",
    conditions: function (state) {
      return (
        state.player.day >= 20 &&
        state.player.phase === "street" &&
        state.resources.bankBalance > 0 &&
        !state.flags._scamPhoneCall
      );
    },
    weight: 0.5,
    choices: [
      {
        text: "📴 挂断！然后屏蔽这个号码",
        apply: function (state) {
          state.flags._scamPhoneCall = true;
          state.player.intelligence = Math.min(
            100,
            state.player.intelligence + 1,
          );
          StateManager.addMessage(
            "✅ 你果断挂断了电话，记住了这个手法。以后遇到这种情况更警觉了。智力+1。",
            "success",
          );
        },
      },
      {
        text: "😰 半信半疑，继续听听……",
        apply: function (state) {
          state.flags._scamPhoneCall = true;
          var loss = Math.min(
            state.resources.bankBalance,
            Math.floor(state.resources.bankBalance * 0.3),
          );
          state.resources.bankBalance -= loss;
          StateManager.addMessage(
            "😱 你被骗了！对方说服你转账验证，转过去的¥" +
              loss.toLocaleString() +
              "再也没有了。银行存款-¥" +
              loss.toLocaleString() +
              "。",
            "danger",
          );
        },
      },
    ],
  },

  {
    id: "job_gossip",
    title: "📋 工友小道消息",
    description:
      "休息时，旁边的老工人凑过来低声说：'我听说隔壁工地老板要跑路，拖了两个月工资。你这里靠谱吗？'",
    conditions: function (state) {
      return (
        state.player.day >= 12 &&
        state.player.phase === "street" &&
        state.trade.currentLocation === "construction"
      );
    },
    weight: 0.8,
    choices: [
      {
        text: "🤔 认真打听一下，看看情况",
        apply: function (state) {
          state.player.intelligence = Math.min(
            100,
            state.player.intelligence + 1,
          );
          state.player.fame = Math.min(100, (state.player.fame || 0) + 2);
          StateManager.addMessage(
            "🔍 你详细问了问情况，记在心里了。这种消息，在工地里往往比官方通知更准。智力+1，名气+2。",
            "info",
          );
        },
      },
      {
        text: "🙄 当作没听到，自己顾自己",
        apply: function (state) {
          StateManager.addMessage(
            "😶 你点点头没多说话。工地里的事，不打听是非，是一种保护自己的方式。",
            "info",
          );
        },
      },
    ],
  },

  {
    id: "library_notice",
    title: "📚 图书馆限时开放",
    description:
      "公告牌上贴着一张告示：'本市市民图书馆本周免费开放，附赠一次免费自习时间和专业书借阅机会。'",
    conditions: function (state) {
      return (
        state.player.day >= 8 &&
        state.player.phase === "street" &&
        (state.trade.currentLocation === "park" ||
          state.trade.currentLocation === "school") &&
        !state.flags._libraryVisit
      );
    },
    weight: 0.7,
    choices: [
      {
        text: "📖 去借本书，认真读读",
        apply: function (state) {
          state.flags._libraryVisit = true;
          var xp = 20 + Math.floor(Math.random() * 15);
          state.player.intelligence = Math.min(
            100,
            state.player.intelligence + 2,
          );
          StateManager.addMessage(
            "📚 你借了本关于经济学的书，读了几章，感觉打开了新世界。智力+2。",
            "success",
          );
        },
      },
      {
        text: "🛌 太累了，改天再说",
        apply: function (state) {
          state.flags._libraryVisit = true;
          StateManager.addMessage(
            "😴 你收好了告示，心想改天有空一定去——但这样的机会不多了。",
            "info",
          );
        },
      },
    ],
  },

  {
    id: "market_price_tip",
    title: "💡 摊主的价格情报",
    description:
      "批发市场里一个熟面孔摊主把你拉到一边低声说：'最近水果价格要涨，你要进货的话，今天最合适。'",
    conditions: function (state) {
      return (
        state.player.day >= 10 &&
        state.player.phase === "street" &&
        state.trade.currentLocation === "wholesaleMarket" &&
        !state.flags._marketTipToday
      );
    },
    weight: 0.8,
    choices: [
      {
        text: "💸 现在多进一些货",
        apply: function (state) {
          state.flags._marketTipToday = true;
          var cost = Math.min(state.resources.cash, 120);
          if (cost >= 40) {
            state.resources.cash -= cost;
            state.needs.happiness = Math.min(100, state.needs.happiness + 5);
            StateManager.addMessage(
              "📦 你多进了¥" +
                cost +
                "的货，如果情报准确，这次能多赚不少。花费¥" +
                cost +
                "，心情+5。",
              "info",
            );
          } else {
            StateManager.addMessage(
              "😅 虽然心动，但现在兜里没钱，只好作罢。",
              "warning",
            );
          }
        },
      },
      {
        text: "🤔 谢谢，我考虑一下",
        apply: function (state) {
          state.flags._marketTipToday = true;
          StateManager.addMessage(
            "🤔 市场消息真真假假，谨慎没有坏处——但有时候错过就是错过了。",
            "info",
          );
        },
      },
    ],
  },

  {
    id: "sick_coworker_food",
    title: "🤧 病倒的工友",
    description:
      "工地上有个工友感冒发烧，趴在宿舍起不来，也没什么人管他。你正好手里有点零钱……",
    conditions: function (state) {
      return (
        state.player.day >= 15 &&
        state.player.phase === "street" &&
        state.trade.currentLocation === "construction" &&
        state.resources.cash >= 20
      );
    },
    weight: 0.6,
    choices: [
      {
        text: "🍜 给他买碗热粥送过去",
        apply: function (state) {
          state.resources.cash -= 15;
          state.needs.happiness = Math.min(100, state.needs.happiness + 10);
          state.player.fame = Math.min(100, (state.player.fame || 0) + 4);
          state.flags._helpedCoworker = true;
          StateManager.addMessage(
            "🤝 你花了¥15给工友买了碗粥，他虚弱地道谢。这条街上，大家都是相互依靠的。花费¥15，心情+10，名气+4。",
            "success",
          );
        },
      },
      {
        text: "😟 自己都不宽裕，帮不上忙",
        apply: function (state) {
          state.needs.happiness = Math.max(0, state.needs.happiness - 3);
          StateManager.addMessage(
            "😟 你叹了口气，每个人都有自己的难处。只是这份愧疚，不好受。心情-3。",
            "warning",
          );
        },
      },
    ],
  },

  {
    id: "city_night_view",
    title: "🌃 城市夜景",
    description:
      "天色晚了，你站在一处高处，看着这座城市的万家灯火。灯光里有那么多普通人，都在努力活着。",
    conditions: function (state) {
      return (
        state.player.day >= 25 &&
        state.player.phase === "street" &&
        (state.trade.currentLocation === "park" ||
          state.trade.currentLocation === "techPark") &&
        state.needs.happiness < 50
      );
    },
    weight: 0.7,
    choices: [
      {
        text: "🌟 看一会儿，让思绪飘荡",
        apply: function (state) {
          state.needs.happiness = Math.min(100, state.needs.happiness + 18);
          state.player.mental = Math.min(100, state.player.mental + 2);
          StateManager.addMessage(
            "🌃 夜风轻轻吹来，你突然觉得这一切都有意义。心情+18，心智+2。",
            "success",
          );
        },
      },
      {
        text: "🏠 还是回去睡，明天还要干活",
        apply: function (state) {
          state.needs.happiness = Math.min(100, state.needs.happiness + 5);
          StateManager.addMessage(
            "😌 是啊，得继续努力。感慨归感慨，日子还是要过的。心情+5。",
            "info",
          );
        },
      },
    ],
  },

  // === 道德后果事件（第二波）— 过去的选择继续发酵 ===

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
          var bonus = 600 + Math.floor(Math.random() * 400);
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
          var bonus = 400 + Math.floor(Math.random() * 300);
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

  // === 心理健康危机事件（P3.6）===
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
        hint: "花费¥15，心情+10，心智+5",
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
        hint: "花费¥20，心情+8",
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
        hint: "无消耗，但心智-3",
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
        hint: "名气+10，体质+2，但健康-15，有风险",
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
        hint: "理性选择，无惩罚，名气+3",
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
        hint: "无影响，但心智-5",
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
        hint: "好感+5（下次遇到老马），道德档案+",
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
        hint: "心情+8，老马好感大增",
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
        hint: "无后果，但心智-2",
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
        hint: "消耗一点AP，心情+15，名气+5",
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
        hint: "花费¥15，心情+8",
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
        hint: "现金+¥3800，但心智-3（总感觉有点不对劲）",
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
        hint: "无现金收益，但心情+12，心智+5",
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
        hint: "现金-500，但树立信誉",
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
        hint: "心情-10，再宽限30天",
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
        hint: "现金-1000，压力减轻",
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
        hint: "现金-2000，债务减少，家庭关系修复",
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
  // ---- 有梗世界事件：房地产开发商暴雷 ----
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
  // ---- 有梗世界事件：维权胜利结局 ----
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
  // ---- 有梗世界事件：网约车补贴大战弧线（第1段：加入窗口期） ----
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
        hasNews && !st.flags._subsidyWarJoinSeen && st.player.phase === "street"
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
  // ---- 有梗世界事件：网约车补贴大战弧线（第2段：补贴战落幕） ----
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
        hint: "消耗¥50组织费，名气+5，15天后见结果",
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
        hint: "花¥200启动摆摊，体质+3",
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
  // ---- 有梗世界事件：网约车补贴大战弧线（第3段：维权结果） ----
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
        hint: "名气+8，但结果不确定",
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
  // ---- 有梗世界事件：政府托底结局 ----
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
  // ============================================================
  // 有梗世界事件链 ②：收购反噬（街头，3 段弧）
  // 玩家攒够本钱收购小公司 → 经营不善 → 被竞争对手低价吞掉，
  // 对手反而因此壮大成行业龙头。剧情完整闭环，不是惩罚玩家，
  // 而是商业逻辑自然推演。参考 DEV.md 1.2 节"收购反噬"模板。
  // ============================================================
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
  // ============================================================
  // 有梗世界事件链 ③：黑马冲击（街头，3 段弧）
  // 玩家深耕某行业（外卖/摆摊/废品/建筑/家教 之一）累计天数后，
  // 新入局者用新模式 3 个月吃掉市场份额。玩家须转型/坚守/弃业。
  // 参考 DEV.md 1.2 节"行业黑马冲击"模板。
  // ============================================================
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
        (pivoted || holding || sidehustle) && !st.flags._disruptionAftermathSeen
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
  // ============================================================
  // 有梗世界事件链 ④：创始人回购（职场，3 段弧）
  // 玩家在职场被资本清洗 → 30 天后留下当员工的屈辱期 →
  // 45 天后老朋友筹钱让你买回主导权。参考 DEV.md 1.2 节模板。
  // ============================================================
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
        (st.corp && (st.player.corporate.kpi || 0) > 70 && st.player.day > 200);
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

  // ============================================================
  // 有梗世界事件链 ⑤：政策套利窗口（3 场景 × 2 阶段）
  // 先知道的人暴富，后知道的人被套——模拟"信息差"与"时机判断"博弈。
  // 参考 DEV.md 1.2 节"政策套利窗口"模板。
  // 场景 A：科技园扩建征地（小美情报）— 提前囤周边房产
  // 场景 B：外卖/摊贩持证上岗（张姐情报）— 提前考证占坑
  // 场景 C：餐饮卫生新规（陈师傅情报）— 提前整改免罚+补贴
  // ============================================================

  // ---- 场景 A-1：科技园扩建征地内幕 ----
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
  // ---- 场景 A-2：科技园扩建官宣兑现 ----
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
          var profit = 5000 + Math.floor(Math.random() * 3000);
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

  // ---- 场景 B-1：摊贩持证上岗新政内幕 ----
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
  // ---- 场景 B-2：摊贩持证新规实施 ----
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

  // ---- 场景 C-1：餐饮卫生评级补贴内幕 ----
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
  // ---- 场景 C-2：餐饮卫生评级结果 ----
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

  // ============================================================
  // 企业命运联动事件（3个）— P2#11 玩家与命运系统的互动
  // ============================================================

  // ---- 事件1：就职公司濒死，买断或坚守 ----
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
          var severance = 50000 + Math.floor(Math.random() * 20000);
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

  // ---- 事件2：持仓公司产品爆发，低价增持机会 ----
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

  // ---- 事件3：命运事件导致持仓大幅波动 ----
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
              for (var si = 0; si < st.investment.stockHoldings.length; si++) {
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
              st.investment.stockMarket && st.investment.stockMarket[h.symbol];
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

  // === 单间专属事件（housing.tier === 2）===
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
          if (Math.random() < 0.5) {
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
          if (Math.random() < 0.35 + (st.player.agility || 20) * 0.01) {
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

  // === 一居室专属事件（housing.tier === 3）===
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
          if (Math.random() < 0.6) {
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
          if (Math.random() < 0.5) {
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

  // === 职场陷阱事件链（3阶段链式） ===
  // L1：背锅 — 项目出问题被甩锅
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
          const success =
            Math.random() <
            0.3 +
              (st.player.corporate.upwardMgmt - 20) * 0.015 +
              (st.player.corporate.ability - 30) * 0.01;
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
            st.player.corporate.kpi = Math.max(0, st.player.corporate.kpi - 15);
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
          const success =
            Math.random() < 0.25 + (st.player.corporate.ability - 30) * 0.02;
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
            st.player.corporate.kpi = Math.max(0, st.player.corporate.kpi - 20);
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

  // L2a：老板记仇 — 穿小鞋
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
          const success =
            Math.random() <
            0.3 +
              (st.player.corporate.ability - 30) * 0.02 +
              (st.player.intelligence - 30) * 0.01;
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
            st.player.corporate.kpi = Math.max(0, st.player.corporate.kpi - 5);
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
          const success =
            Math.random() < 0.4 + (st.player.corporate.popularity - 30) * 0.01;
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

  // L2b：同事谣言 — 孤立
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
          const success =
            Math.random() <
            0.35 + (st.player.corporate.popularity - 20) * 0.015;
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
          st.player.corporate.kpi = Math.min(150, st.player.corporate.kpi + 10);
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

  // L3：猎头 offer — 跳槽抉择
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

  // L3b：时间压力 — 最后通牒
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

  ,
  // ============================================================
  // 有梗世界事件链 <EFBFBD><EFBFBD>：房地产赌局（街头，3 段弧）
  // 城中村拆迁规划 -> 30天后丈量赔偿 -> 3种结局
  // 参考 DEV.md 1.2 节"链条1：房地产赌局"
  // ============================================================
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
          var bonus = 60000 + Math.floor(Math.random() * 80000);
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
  }, // ============================================================
  // 有梗世界事件链 ⑦：创业公司的过山车（街头，3 段弧）
  // 遇到找合伙人的程序员 → 产品爆发或凉凉 → 结局
  // 参考 DEV.md 1.2 节"链条2：创业公司的过山车"
  // ============================================================
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
          var payout =
            Math.round(base * multi) + Math.floor(Math.random() * 50000);
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
  }, // ============================================================
  // 有梗世界事件链 ⑧：灰产线（街头，3 段弧）
  // 工友老张介绍保护费 → 第一次收钱被拍 → 警察回访
  // 参考 DEV.md 1.2 节"链条3：灰产线"
  // ============================================================
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
  }, // ============================================================
  // 有梗世界事件链 ⑨：内幕交易的诱惑与代价（职场，4 段弧）
  // 参考 DEV.md 1.2 节"链条4：内幕交易"
  // ============================================================
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
          var profit = 150000 + Math.floor(Math.random() * 20000);
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
          var profit = 80000 + Math.floor(Math.random() * 40000);
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
          if (Math.random() < 0.35) {
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
  }, // ============================================================
  // 有梗世界事件链 ⑩：教培风暴（街头，3 段弧）
  // 参考 DEV.md 1.2 节"链条6：教培行业覆灭"
  // ============================================================
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
          var earn = 7000 + Math.floor(Math.random() * 3000);
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
          var income = 3000 + Math.floor(Math.random() * 5000);
          st.resources.cash += income;
          StateManager.addMessage(
            "🤝 月中介收入¥" + income.toLocaleString() + "。政策消灭不了需求。",
            "event",
          );
        },
      },
    ],
  }, // ============================================================
  // 有梗世界事件链 ⑪：新能源泡沫（街头/投资，3 段弧）
  // 参考 DEV.md 1.2 节"链条7：新能源泡沫"
  // ============================================================
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
          StateManager.addMessage("💰 你在跌停板加仓。朋友说你疯了。", "event");
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
          StateManager.addMessage("😞 你清仓了。亏了大概¥15,000。", "warning");
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
          var reward = 25000 + Math.floor(Math.random() * 25000);
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
          var reward2 = 30000 + Math.floor(Math.random() * 10000);
          st.resources.cash += reward2;
          st.player.mental = Math.min(100, (st.player.mental || 20) + 5);
          StateManager.addMessage(
            "✅ 锁定了¥" + reward2.toLocaleString() + "的利润。",
            "event",
          );
        },
      },
    ],
  }, // ============================================================
  // 有梗世界事件链 ⑫：职场陷阱（职场，3 段弧）
  // 上级让你背锅 -> 调查/反击 -> 前上司东山再起
  // 参考 DEV.md 1.2 节"链条8：职业生涯的陷阱与机遇"
  // ============================================================
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
  }, // ============================================================
  // 五、独立叙事事件（12个，从60+蓝本中精选）
  // ============================================================
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
          StateManager.addMessage("🛵 注册了众包配送。钱不多但稳定。", "info");
        },
      },
      {
        text: "😞 帮王婶卖菜抽成10%",
        hint: "帮人帮己",
        apply: function (st) {
          st.flags._communityGroupBuySeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          var earn = 200 + Math.floor(Math.random() * 100);
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
          if (Math.random() < 0.3) {
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
          var earn = 400 + Math.floor(Math.random() * 200);
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
          var earn = 3000 + Math.floor(Math.random() * 2000);
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
          var earn = 1200 + Math.floor(Math.random() * 800);
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
          var earn2 = 800 + Math.floor(Math.random() * 400);
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
          if (Math.random() < 0.5) {
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
          var earn = 300 + Math.floor(Math.random() * 300);
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
          StateManager.addMessage("🚫 知道自己不懂比什么都懂更重要。", "info");
        },
      },
    ],
  },
  {
    id: "near_expiry_wholesale",
    phase: "street",
    icon: "🥫",
    title: "临期食品生意",
    story: "临期食品仓库——¥10一箱进口饼干¥5一瓶橄榄油。¥1,000进货能卖¥2,500。",
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
          var earn = 1500 + Math.floor(Math.random() * 800);
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
          StateManager.addMessage("\u2705 每月扣¥900，但心里踏实了。", "event");
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
          if (Math.random() < 0.15) {
            st.resources.cash += 30000;
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 5,
            );
            StateManager.addMessage("🎣 居然不是骗子！你赚回了学费。", "event");
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
];

/* =========================================================
 * 二、事件触发与队列管理
 * ========================================================= */

/** 街头每日事件判定 */
function rollStreetEvent(state) {
  // 基础 18% 触发率，已存在待弹事件时不重复触发
  if (state._pendingEvent) return;

  // 心理危机事件：mental<20时优先检查，不占用随机事件槽
  var mentalCrisisIds = [
    "mental_breakdown_edge",
    "mental_therapy_chance",
    "mental_recovery_milestone",
  ];
  for (var mci = 0; mci < mentalCrisisIds.length; mci++) {
    var mce = RANDOM_EVENTS.find(function (e) {
      return e.id === mentalCrisisIds[mci];
    });
    if (mce && typeof mce.conditions === "function" && mce.conditions(state)) {
      state._pendingEvent = mce;
      state.flags._todayMentalEvent = true;
      return;
    }
  }

  // 村长债务追讨事件：债务未还时优先触发，不占用随机事件槽
  var debtEventIds = [
    "village_chief_warning",
    "village_chief_pressure",
    "village_chief_final",
  ];
  for (var dci = 0; dci < debtEventIds.length; dci++) {
    var dce = RANDOM_EVENTS.find(function (e) {
      return e.id === debtEventIds[dci];
    });
    if (dce && typeof dce.conditions === "function" && dce.conditions(state)) {
      state._pendingEvent = dce;
      state.flags._todayDebtEvent = true;
      return;
    }
  }

  // 链式事件队列检查（高优先级，插入心理危机/债务检查之后，随机池之前）
  if (checkChainEventQueue(state, "street")) return;

  const baseChance = 0.18;
  // 健康差或债务高时提高触发率
  let mod = 0;
  if (state.status.health < 50) mod += 0.1;
  if (state.resources.debt > 3000) mod += 0.05;
  if (state.needs.happiness < 30) mod += 0.05;
  // 历史声誉幸运加成（P2.9）：积善之人事件触发率降低
  if (typeof getHistoryModifiers === "function") {
    var lk = getHistoryModifiers(state).luckBonus || 0;
    mod -= lk * 0.008; // 每点幸运降低0.8%触发率（+5幸运≈-4%）
  }
  if (Math.random() < baseChance + mod) {
    queueRandomEvent(state, "street");
  }
}

/** 职场每日事件判定 */
function rollCorporateEvent(state) {
  if (state._pendingEvent) return;

  // 链式事件队列检查（高优先级）
  if (checkChainEventQueue(state, "corporate")) return;

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

  // 支持 choices 为函数（动态生成，如政策套利兑现事件）
  var choicesArr = evt.choices;
  if (typeof choicesArr === "function") {
    choicesArr = choicesArr(StateManager.getState());
    if (!choicesArr || !choicesArr.length) {
      // 没有可用选项时自动跳过
      var s = StateManager.getState();
      s._pendingEvent = null;
      s._pendingEventId = null;
      return;
    }
  }

  // ====== 春节事件专属检测 ======
  var isSpringFest = !!evt._isSpringFestivalEvent;
  var springFestClass = isSpringFest ? "spring-fest-modal" : "";
  var springFestProgressHtml = "";
  var springFestDecorHtml = "";

  if (isSpringFest) {
    // 进度指示器：春节7天（除夕→初六）
    var dayNames = ["除夕", "初一", "初二", "初三", "初四", "初五", "初六"];
    var dayIcons = ["🏠", "🧧", "👨‍👩‍👧", "🔴", "💰", "🔨", "🗑️"];
    var currentDay = evt.id
      ? parseInt(evt.id.replace("spring_fest_day", ""))
      : 0;
    currentDay = Math.max(0, Math.min(6, currentDay));

    var dotsHtml = "";
    for (var d = 0; d < 7; d++) {
      var dotClass = "spring-fest-progress-dot";
      if (d === currentDay) dotClass += " active";
      else if (d < currentDay) dotClass += " passed";
      dotsHtml += '<div class="' + dotClass + '"></div>';
    }

    springFestProgressHtml =
      '<div class="spring-fest-progress">' +
      '<span class="spring-fest-progress-label">🧨 春节</span>' +
      '<div class="spring-fest-progress-dots">' +
      dotsHtml +
      "</div>" +
      '<span class="spring-fest-progress-label" style="margin-left:4px;">第' +
      (currentDay + 1) +
      "/7天 · " +
      dayNames[currentDay] +
      "</span>" +
      "</div>";

    // 春节装饰元素
    springFestDecorHtml =
      '<span class="spring-fest-decor lantern-left">🏮</span>' +
      '<span class="spring-fest-decor lantern-right">🏮</span>' +
      '<span class="spring-fest-decor coin-bottom">💰</span>';
  }

  // 构建选项HTML
  const choicesHtml = choicesArr
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
  overlay.className = "modal-overlay event-modal " + springFestClass;
  overlay.innerHTML = `
    <div class="modal-box event-box ${springFestClass}">
      ${springFestDecorHtml}
      ${springFestProgressHtml}
      <div class="event-header">
        <div class="event-icon">${evt.icon}</div>
        <h2 class="event-title">${evt.title}</h2>
      </div>
      <p class="event-story ${isSpringFest ? "spring-fest-story" : ""}">${evt.story}</p>
      <div class="event-choices">${choicesHtml}</div>
      <div style="text-align:center;margin-top:8px;font-size:10px;color:var(--accent);">
        ${isSpringFest ? "🧨 做出你的选择，迎接新的一年" : "⚡ 请选择一个选项继续"}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // 绑定选项点击
  overlay.querySelectorAll(".event-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx);
      const choice = choicesArr[idx];
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
 * 三·五、链式事件调度管理
 * ========================================================= */

/**
 * 调度一个链式事件在 delayDays 后触发
 * @param {Object} state - 游戏状态
 * @param {string} eventId - 事件ID
 * @param {number} delayDays - 延迟天数
 * @param {string} phase - "street" | "corporate"
 */
function scheduleChainEvent(state, eventId, delayDays, phase) {
  if (!state.flags._chainEventQueue) {
    state.flags._chainEventQueue = [];
  }
  var triggerDay = state.player.day + delayDays;
  // 避免重复调度同一事件
  for (var i = 0; i < state.flags._chainEventQueue.length; i++) {
    if (state.flags._chainEventQueue[i].eventId === eventId) {
      state.flags._chainEventQueue[i].triggerDay = triggerDay;
      return;
    }
  }
  state.flags._chainEventQueue.push({
    eventId: eventId,
    triggerDay: triggerDay,
    phase: phase,
  });
}

/**
 * 检查链式事件队列，有到期事件时直接弹出
 * @param {Object} state - 游戏状态
 * @param {string} phase - "street" | "corporate"
 * @returns {boolean} 是否触发了链式事件
 */
function checkChainEventQueue(state, phase) {
  if (state._pendingEvent) return false;
  var queue = state.flags._chainEventQueue;
  if (!queue || queue.length === 0) return false;

  // 按触发日排序，最急的在前
  queue.sort(function (a, b) {
    return a.triggerDay - b.triggerDay;
  });

  for (var i = 0; i < queue.length; i++) {
    var entry = queue[i];
    if (entry.phase !== phase) continue;
    if (state.player.day < entry.triggerDay) continue;

    // 从队列移除该事件
    queue.splice(i, 1);

    // 在 RANDOM_EVENTS 中查找对应事件
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j].id === entry.eventId) {
        state._pendingEvent = RANDOM_EVENTS[j];
        state._pendingEventId = entry.eventId;
        // 延迟弹窗（避免在 tick 内部阻塞）
        setTimeout(
          (function (evt) {
            return function () {
              var s = StateManager.getState();
              if (s._pendingEvent && s._pendingEventId === evt.id) {
                showEventModal(evt);
                if (typeof playSound === "function") playSound("event");
              }
            };
          })(RANDOM_EVENTS[j]),
          80,
        );
        return true;
      }
    }
    // 没找到事件（可能被删了），继续检查下一条
  }
  return false;
}

/* =========================================================
 * 四、兼容旧 API
 * ========================================================= */

/** 每日新闻判定（旧 API，保持兼容） */
function rollDailyNews(state) {
  // 街头阶段：触发随机事件弹窗，同时小概率触发投资新闻
  if (state.player.phase === "street") {
    rollStreetEvent(state);
    // 8%概率接到市场消息（影响投资市场，仅投资类新闻）
    if (Math.random() < 0.08 && typeof getRandomNewsEvent === "function") {
      var investNews = null;
      for (var _attempt = 0; _attempt < 5; _attempt++) {
        var candidate = getRandomNewsEvent();
        if (
          candidate &&
          candidate.type === "investment" &&
          !(state.flags.seenNewsToday || []).includes(candidate.id)
        ) {
          investNews = candidate;
          break;
        }
      }
      if (investNews) {
        investNews._appliedDay = state.player.day;
        state.activeNews = state.activeNews || [];
        state.activeNews.push(investNews);
        state.flags.seenNewsToday = state.flags.seenNewsToday || [];
        state.flags.seenNewsToday.push(investNews.id);
        applyNewsEffect(investNews, state);
        StateManager.addMessage("📰 " + investNews.headline, "event");
      }
    }
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
  // 清理链式事件队列中已过期的条目（超过触发日30天的视为过期未触发，清理防堆积）
  if (state.flags._chainEventQueue && state.flags._chainEventQueue.length > 0) {
    state.flags._chainEventQueue = state.flags._chainEventQueue.filter(
      function (entry) {
        return state.player.day < entry.triggerDay + 30;
      },
    );
  }
}

/** 季度结束时的职场清理 */
function quarterlyCleanup(state) {
  // 占位（兼容旧调用）
}

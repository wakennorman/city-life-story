/**
 * 人生抉择系统 — 关键日子的叙事抉择，塑造角色身份
 *
 * 设计参考：BitLife 人生决策 / Disco Elysium 思维阁 / 大多数 剧情分支
 *
 * 核心机制：
 *   在 Day 15/30/60/90/180/365 触发关键抉择事件，
 *   每个抉择 2-3 选项，选项有即时效果 + 长期 flag 影响后续事件。
 *   每个抉择一生只触发一次。
 */

/**
 * 人生抉择定义
 * 每个抉择有：触发日、标题、描述、选项列表
 * 选项有：文本、即时效果函数、flag 标识
 */
const LIFE_DECISIONS = [
  // ====== Day 15: 第一桶金 ======
  {
    day: 15,
    id: "first_windfall",
    title: "💡 第一桶金",
    desc: function (state) {
      var cash = state.resources ? state.resources.cash || 0 : 0;
      return (
        "你来到这座城市已经半个月了。兜里揣着 ¥" +
        Math.round(cash) +
        "，你开始思考下一步。" +
        "\n\n今天在街头，一个自称「老刘」的中年人拦住你，说有个稳赚不赔的门路——低价回收倒闭工厂的库存零件，转手卖给城东的修理铺。" +
        "\n\n你听说过这种套路：有人赚了，有人赔了裤衩。"
      );
    },
    choices: [
      {
        text: "💪 搏一把！投 ¥500 试试水",
        desc: "风险投资，可能翻倍也可能亏光",
        effect: function (state) {
          state.resources.cash = Math.max(0, state.resources.cash - 500);
          var roll = Random.float(0, 1);
          if (roll < 0.4) {
            // 40% 亏光
            StateManager.addMessage(
              "😰 老刘跑路了！你的 ¥500 打了水漂。街头果然不是那么好混的……",
              "danger",
            );
            state.flags._lifeDec_firstDeal = "lost";
          } else if (roll < 0.75) {
            // 35% 小赚
            var gain =
              300 +
              Random.int(0, 399);
            state.resources.cash += gain;
            state.resources.totalEarned =
              (state.resources.totalEarned || 0) + gain;
            StateManager.addMessage(
              "💰 零件倒手卖了 ¥" + gain + "，净赚！老刘没骗人。",
              "success",
            );
            state.flags._lifeDec_firstDeal = "small_win";
          } else {
            // 25% 大赚
            var bigGain =
              800 +
              Random.int(0, 699);
            state.resources.cash += bigGain;
            state.resources.totalEarned =
              (state.resources.totalEarned || 0) + bigGain;
            state.skills.sales.xp = (state.skills.sales.xp || 0) + 20;
            StateManager.addMessage(
              "🎉 大赚一笔！卖了 ¥" + bigGain + "，还认识了几个批发商！",
              "success",
            );
            state.flags._lifeDec_firstDeal = "big_win";
          }
        },
      },
      {
        text: "🤝 去看看，但不投钱",
        desc: "了解行情，积累人脉",
        effect: function (state) {
          state.skills.sales.xp = (state.skills.sales.xp || 0) + 15;
          state.player.fame = (state.player.fame || 0) + 1;
          StateManager.addMessage(
            "📋 你跟老刘跑了一天，虽然没投钱，但摸清了零件回收的门道。",
            "info",
          );
          state.flags._lifeDec_firstDeal = "learned";
        },
      },
      {
        text: "🚫 婉拒，专心打工",
        desc: "稳定积累，不急一时",
        effect: function (state) {
          // 打工专注力加成：未来 30 天工作收入 +5%
          state.flags._lifeDec_firstDeal = "focused";
          state.flags._focusBonusDays = 30;
          state.flags._focusBonusStarted = state.player.day;
          StateManager.addMessage(
            "💪 你选择专注眼前的工作。稳扎稳打，总比被骗强。",
            "success",
          );
        },
      },
    ],
  },

  // ====== Day 30: 立足之地 ======
  {
    day: 30,
    id: "settle_down",
    title: "🏠 立足之地",
    desc: function (state) {
      var cash = state.resources ? state.resources.cash || 0 : 0;
      var tier = state.housing ? state.housing.tier || 0 : 0;
      var housingName = tier >= 1 ? "有个住处" : "露宿街头";
      return (
        "一个月了。你" +
        housingName +
        "，手头有 ¥" +
        Math.round(cash) +
        "。" +
        "\n\n这座城市开始从陌生变得熟悉——你知道哪家摊位的盒饭实惠，哪个天桥底下能避雨。" +
        "\n\n一个人站在天桥上，看着车流，你问自己：下一步怎么走？"
      );
    },
    choices: [
      {
        text: "🏘️ 把钱花在住的地方",
        desc: "升级住房，改善生活质量",
        effect: function (state) {
          var tier = state.housing ? state.housing.tier || 0 : 0;
          if (tier < 1 && state.resources.cash >= 300) {
            state.resources.cash -= 300;
            state.housing.tier = 1;
            state.housing.rentedDay = state.player.day;
            if (state.inventory) state.inventory.capacity = 50;
            StateManager.addMessage(
              "🏠 你租下了城中村的一个床位。虽然简陋，但总算有个遮风挡雨的地方。",
              "success",
            );
          } else if (tier < 2 && state.resources.cash >= 800) {
            state.resources.cash -= 800;
            state.housing.tier = 2;
            state.housing.rentedDay = state.player.day;
            if (state.inventory) state.inventory.capacity = 100;
            StateManager.addMessage(
              "🏠 你搬进了一个单间。独立空间让你第一次在这座城市有了「家」的感觉。",
              "success",
            );
          } else {
            // 钱不够，象征性升级
            state.needs.happiness = Math.min(
              100,
              (state.needs.happiness || 50) + 5,
            );
            StateManager.addMessage(
              "💭 你看了看房租，又看了看钱包。还是再攒攒吧。",
              "info",
            );
          }
          state.flags._lifeDec_settle = "housing";
        },
      },
      {
        text: "📚 把钱花在提升自己",
        desc: "买书/培训，提升技能",
        effect: function (state) {
          // 全技能 +15 XP
          var skills = state.skills || {};
          var skillCount = 0;
          for (var sk in skills) {
            if (skills[sk] && typeof skills[sk].xp !== "undefined") {
              skills[sk].xp = (skills[sk].xp || 0) + 15;
              skillCount++;
            }
          }
          state.resources.cash = Math.max(0, state.resources.cash - 200);
          StateManager.addMessage(
            "📖 你花 ¥200 买了二手教材和网课。知识改变命运——希望吧。" +
              (skillCount > 0 ? " 所有技能 +15 XP" : ""),
            "success",
          );
          state.flags._lifeDec_settle = "skill";
        },
      },
      {
        text: "🤝 把钱花在社交上",
        desc: "请客吃饭，扩展人脉",
        effect: function (state) {
          state.resources.cash = Math.max(0, state.resources.cash - 150);
          state.player.fame = (state.player.fame || 0) + 3;
          // 随机 NPC 好感 +5
          if (typeof state.relationships === "object" && state.relationships) {
            var npcIds = Object.keys(state.relationships);
            if (npcIds.length > 0) {
              var target =
                npcIds[
                  typeof Random !== "undefined"
                    ? Random.int(0, npcIds.length - 1)
                    : Random.int(0, npcIds.length - 1)
                ];
              if (state.relationships[target]) {
                state.relationships[target].affinity =
                  (state.relationships[target].affinity || 0) + 5;
              }
            }
          }
          StateManager.addMessage(
            "🍻 你请几个工友喝了顿酒。关系近了，消息也灵通了。",
            "success",
          );
          state.flags._lifeDec_settle = "social";
        },
      },
    ],
  },

  // ====== Day 60: 机遇之门 ======
  {
    day: 60,
    id: "opportunity_knocks",
    title: "🚪 机遇之门",
    desc: function (state) {
      return (
        "两个月了。你已经不是刚来时的那个愣头青。" +
        "\n\n今天，一个熟人找到你，说有个「特别的机会」：" +
        "\n\n城东新开了一家科技园区，正在招初级技术员，培训上岗。但要求至少会基础的电脑操作。" +
        "\n\n另一个选择是，批发市场的老王想找个靠谱的人合伙——他出摊位你出力，利润对半分。"
      );
    },
    choices: [
      {
        text: "💻 去科技园区应聘",
        desc: "需要智力≥30，开启公司阶段",
        effect: function (state) {
          if ((state.player.intelligence || 0) >= 30) {
            state.player.phase = "corporate";
            state.flags._corporateEntry = "tech_park_early";
            StateManager.addMessage(
              "🏢 你通过了科技园区的面试！虽然只是初级技术员，但你踏进了白领的门槛。",
              "success",
            );
          } else {
            // 智力不够，但增加了学习动力
            state.player.intelligence = (state.player.intelligence || 0) + 2;
            state.flags._lifeDec_opportunity = "tech_rejected";
            StateManager.addMessage(
              "😅 面试没过——你连「Ctrl+C/V」都用了半天。但这次经历让你意识到了学习的重要性。智力+2。",
              "warning",
            );
          }
          state.flags._lifeDec_opportunity = "tech";
        },
      },
      {
        text: "🏪 跟老王合伙",
        desc: "开启摊位生意，被动收入",
        effect: function (state) {
          // 合伙生意：每天自动产生少量收入
          state.flags._lifeDec_opportunity = "stall";
          state.flags._stallPartnership = {
            startDay: state.player.day,
            totalEarned: 0,
          };
          StateManager.addMessage(
            "🍎 你跟老王一拍即合。他的摊位在批发市场入口，人流不错。虽然辛苦，但每天都能分到钱。",
            "success",
          );
        },
      },
      {
        text: "⏳ 再等等，我不急",
        desc: "继续积累，等待更好的机会",
        effect: function (state) {
          // 耐心奖励：未来 15 天收入 +10%
          state.flags._lifeDec_opportunity = "patient";
          state.flags._patientBonusDays = 15;
          state.flags._patientBonusStarted = state.player.day;
          StateManager.addMessage(
            "🧘 你选择再等等。这座城市每天都有新机会，你相信自己能等到更好的。",
            "info",
          );
        },
      },
    ],
  },

  // ====== Day 90: 城市的温度 ======
  {
    day: 90,
    id: "city_warmth",
    title: "🌆 城市的温度",
    desc: function (state) {
      var cash = state.resources ? state.resources.cash || 0 : 0;
      return (
        "三个月了。你在这座城市度过了整整一个季节。" +
        "\n\n你手里有 ¥" +
        Math.round(cash) +
        "。不算多，但也不慌了。" +
        "\n\n今天傍晚，你路过天桥，看到一个流浪老人在寒风中发抖。周围人来人往，没人停下。" +
        "\n\n你想起自己刚来这座城市时，也曾露宿街头。"
      );
    },
    choices: [
      {
        text: "❤️ 买份热饭和一件外套送给他",
        desc: "花费 ¥50，道德+5",
        effect: function (state) {
          state.resources.cash = Math.max(0, state.resources.cash - 50);
          state.needs.happiness = Math.min(
            100,
            (state.needs.happiness || 50) + 8,
          );
          state.flags._lifeDec_warmth = "helped";
          // 道德 flag 影响后续事件
          StateManager.addMessage(
            "🧣 老人接过热饭，眼眶红了。他说了句「好人一生平安」。你心里暖暖的。" +
              " 快乐+8。",
            "success",
          );
        },
      },
      {
        text: "🤝 给他 ¥100，让他自己去买",
        desc: "花费 ¥100，省事但疏离",
        effect: function (state) {
          state.resources.cash = Math.max(0, state.resources.cash - 100);
          state.player.fame = (state.player.fame || 0) + 1;
          state.flags._lifeDec_warmth = "gave_money";
          StateManager.addMessage(
            "💸 你给了老人 ¥100。他连声道谢。你转身走了——帮了，但总觉得少了点什么。",
            "info",
          );
        },
      },
      {
        text: "😔 默默走过，自己都难保",
        desc: "冷酷但现实，省下开支",
        effect: function (state) {
          state.needs.happiness = Math.max(
            0,
            (state.needs.happiness || 50) - 5,
          );
          state.flags._lifeDec_warmth = "ignored";
          StateManager.addMessage(
            "😞 你低头走过。不是不想帮，是你自己也才刚站稳。这座城市，谁都不容易。",
            "warning",
          );
        },
      },
    ],
  },

  // ====== Day 180: 半年之约 ======
  {
    day: 180,
    id: "half_year",
    title: "📅 半年之约",
    desc: function (state) {
      var cash = state.resources ? state.resources.cash || 0 : 0;
      var phase = state.player ? state.player.phase || "street" : "street";
      var phaseLabel = phase === "corporate" ? "在公司上班" : "在街头谋生";
      return (
        "半年了。整整 180 天。" +
        "\n\n你现在" +
        phaseLabel +
        "，手头有 ¥" +
        Math.round(cash) +
        "。" +
        "\n\n今晚你躺在床上，翻来覆去睡不着。这座城市教会了你很多，但你也付出了代价。" +
        "\n\n你拿出手机，看到一条推送：隔壁城市在招高级技工，薪资比这里高 30%。" +
        "\n\n你陷入了沉思……"
      );
    },
    choices: [
      {
        text: "🚄 去隔壁城市看看",
        desc: "冒险，可能更好也可能更差",
        effect: function (state) {
          // 短期损失，长期增益
          state.resources.cash = Math.max(0, state.resources.cash - 300);
          state.player.fame = Math.max(0, (state.player.fame || 0) - 2);
          // 但获得新视野
          state.player.intelligence = (state.player.intelligence || 0) + 2;
          state.flags._lifeDec_halfYear = "moved";
          StateManager.addMessage(
            "🚄 你去了隔壁城市考察了一周。虽然花了 ¥300 路费，但眼界大开——" +
              "原来外面的机会比想象中多。智力+2。",
            "info",
          );
        },
      },
      {
        text: "🏙️ 留下，深耕本地",
        desc: "专注现有资源，等待机会",
        effect: function (state) {
          // 专注奖励
          state.flags._lifeDec_halfYear = "stayed";
          state.flags._localFocusDays = 60;
          state.flags._localFocusStarted = state.player.day;
          StateManager.addMessage(
            "🏙️ 你决定留下。这座城市虽然不完美，但你已经在这里扎了根。" +
              "深耕本地，总会有回报。",
            "success",
          );
        },
      },
    ],
  },

  // ====== Day 365: 一年回望 ======
  {
    day: 365,
    id: "one_year",
    title: "🎂 一年回望",
    desc: function (state) {
      var cash = state.resources ? state.resources.cash || 0 : 0;
      var totalEarned = state.resources ? state.resources.totalEarned || 0 : 0;
      var phase = state.player ? state.player.phase || "street" : "street";
      var phaseLabel = phase === "corporate" ? "公司职员" : "街头谋生";
      return (
        "整整一年了。" +
        "\n\n你从¥300起家，到现在累计赚了 ¥" +
        Math.round(totalEarned).toLocaleString() +
        "，手头有 ¥" +
        Math.round(cash).toLocaleString() +
        "。" +
        "\n\n现在的你，是一个" +
        phaseLabel +
        "。" +
        "\n\n你站在城市的最高处——不是真的最高，只是你租的房子在 18 楼。" +
        "看着窗外的万家灯火，你想起了一年前的自己。" +
        "\n\n那时候你连明天住哪都不知道。"
      );
    },
    choices: [
      {
        text: "🌟 立下新的目标",
        desc: "设定一个更高的目标，获得动力加成",
        effect: function (state) {
          state.flags._lifeDec_oneYear = "ambitious";
          state.flags._ambitionBonus = true;
          state.needs.happiness = Math.min(
            100,
            (state.needs.happiness || 50) + 10,
          );
          StateManager.addMessage(
            "🌟 你对着窗外的城市许下心愿：一年后的今天，我要站得更高。" +
              " 快乐+10，未来收入+5%。",
            "success",
          );
        },
      },
      {
        text: "🙏 感恩现在的一切",
        desc: "知足常乐，心态平和",
        effect: function (state) {
          state.flags._lifeDec_oneYear = "grateful";
          state.needs.happiness = Math.min(
            100,
            (state.needs.happiness || 50) + 15,
          );
          state.status.health = Math.min(100, (state.status.health || 70) + 3);
          StateManager.addMessage(
            "🙏 你给自己倒了杯水，对自己说：辛苦了。这一年，你做得很好。" +
              " 快乐+15，健康+3。",
            "success",
          );
        },
      },
      {
        text: "🔥 还不够，我要更多",
        desc: "野心勃勃，追求卓越",
        effect: function (state) {
          state.flags._lifeDec_oneYear = "driven";
          state.flags._drivenBonus = true;
          state.player.fame = (state.player.fame || 0) + 5;
          state.resources.cash = Math.max(0, state.resources.cash - 500);
          StateManager.addMessage(
            "🔥 你撕掉了墙上那张写了又改、改了又写的计划表。重新写下一行字：" +
              "「要么不做，要么做到最好。」 名气+5，投资 ¥500 在自我提升上。",
            "success",
          );
        },
      },
    ],
  },
];

/**
 * 检查当前天数是否有待触发的人生抉择
 * 在每日管线中调用
 */
function checkLifeDecision(state) {
  if (!state || !state.player) return;
  // 游戏结束或已胜利时不触发
  if (state.flags.gameOver) return;
  // 已有待处理事件时不叠加
  if (state._pendingEvent) return;

  var day = state.player.day;
  if (typeof day !== "number") return;

  // 初始化抉择追踪
  if (!state.flags._lifeDecisionsTriggered) {
    state.flags._lifeDecisionsTriggered = {};
  }

  // 遍历所有配置的抉择
  for (var i = 0; i < LIFE_DECISIONS.length; i++) {
    var dec = LIFE_DECISIONS[i];
    // 到日子了且没触发过
    if (day === dec.day && !state.flags._lifeDecisionsTriggered[dec.id]) {
      // 标记已触发
      state.flags._lifeDecisionsTriggered[dec.id] = true;

      // 构建事件对象（desc→story，适配 showEventModal 的 story 字段）
      var decisionEvent = {
        id: "life_dec_" + dec.id,
        icon: dec.icon || "📜",
        title: dec.title,
        story:
          typeof dec.desc === "function" ? dec.desc(state) : dec.desc || "",
        choices: dec.choices.map(function (choice) {
          return {
            text: choice.text,
            effect: function (st) {
              // 执行效果
              if (typeof choice.effect === "function") {
                choice.effect(st);
              }
              // 清除待处理事件
              st._pendingEvent = null;
              st._pendingEventId = null;
              // 记录抉择历史
              if (!st.flags._lifeDecisionHistory) {
                st.flags._lifeDecisionHistory = {};
              }
              st.flags._lifeDecisionHistory[dec.id] = choice.text;
            },
          };
        }),
      };

      state._pendingEvent = decisionEvent;
      state._pendingEventId = decisionEvent.id;
      return;
    }
  }
}

/**
 * 为后续事件提供与人生抉择相关的 flag 查询
 */
function getLifeDecisionFlag(state, decisionId) {
  if (!state || !state.flags) return null;
  return state.flags["_lifeDec_" + decisionId] || null;
}

/**
 * 检查专注加成（Day 15 抉择：专注打工）
 */
function getFocusBonus(state) {
  if (!state.flags._focusBonusDays) return 1.0;
  var elapsed = state.player.day - (state.flags._focusBonusStarted || 0);
  if (elapsed < state.flags._focusBonusDays) {
    return 1.05; // +5%
  }
  delete state.flags._focusBonusDays;
  return 1.0;
}

/**
 * 检查耐心加成（Day 60 抉择：再等等）
 */
function getPatientBonus(state) {
  if (!state.flags._patientBonusDays) return 1.0;
  var elapsed = state.player.day - (state.flags._patientBonusStarted || 0);
  if (elapsed < state.flags._patientBonusDays) {
    return 1.1; // +10%
  }
  delete state.flags._patientBonusDays;
  return 1.0;
}

/**
 * 检查本地深耕加成（Day 180 抉择：留下深耕）
 */
function getLocalFocusBonus(state) {
  if (!state.flags._localFocusDays) return 1.0;
  var elapsed = state.player.day - (state.flags._localFocusStarted || 0);
  if (elapsed < state.flags._localFocusDays) {
    return 1.08; // +8%
  }
  delete state.flags._localFocusDays;
  return 1.0;
}

/**
 * 检查雄心加成（Day 365 抉择：立下新目标）
 */
function getAmbitionBonus(state) {
  if (state.flags._ambitionBonus) {
    return 1.05; // +5% 永久收入加成
  }
  return 1.0;
}

/**
 * 检查进取加成（Day 365 抉择：还不够）
 */
function getDrivenBonus(state) {
  if (state.flags._drivenBonus) {
    return 1.1; // +10% 永久收入加成（但已花费 ¥500）
  }
  return 1.0;
}

/**
 * 检查摊位合伙收入（Day 60 抉择：跟老王合伙）
 */
function getStallIncome(state) {
  if (!state.flags._stallPartnership) return 0;
  var daysActive = state.player.day - state.flags._stallPartnership.startDay;
  if (daysActive <= 0) return 0;
  var dailyIncome =
    5 + Random.int(0, 14);
  var total = Math.floor(dailyIncome * 0.5); // 当日收入的一半
  state.flags._stallPartnership.totalEarned =
    (state.flags._stallPartnership.totalEarned || 0) + total;
  return total;
}

/** 店铺每日收入（由 stall_income 管线步骤调用） */
function getShopIncome(state) {
  if (!state.flags._hasShop) return 0;
  var base = 50;
  var bonus =
    Random.int(0, 30);
  var fameBonus = Math.floor((state.player.fame || 0) * 0.5);
  var total = base + bonus + fameBonus;
  state.flags._shopTotalEarned = (state.flags._shopTotalEarned || 0) + total;
  if (
    typeof StateManager !== "undefined" &&
    state.player &&
    state.flags._shopLastMsgDay !== state.player.day
  ) {
    StateManager.addMessage(
      "🏪 奶茶店今日营业，净赚¥" + total + "。",
      "success",
    );
    state.flags._shopLastMsgDay = state.player.day;
  }
  return total;
}

/**
 * 初始化人生抉择系统
 */
function initLifeDecisions(state) {
  if (!state.flags._lifeDecisionsTriggered) {
    state.flags._lifeDecisionsTriggered = {};
  }
  if (!state.flags._lifeDecisionHistory) {
    state.flags._lifeDecisionHistory = {};
  }
}

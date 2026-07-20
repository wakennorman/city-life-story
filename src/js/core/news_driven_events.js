/**
 * 新闻驱动深度叙事事件 — 让新闻不只是背景板
 *
 * 设计理念：
 *   - 每条新闻都有可能触发有玩家选择、有后果的叙事事件
 *   - 玩家选择产生 flag，后续同一类新闻会参考这些 flag
 *   - 峰终定律：新闻事件的峰值情感体验创造记忆锚点
 *   - 损失厌恶：参与/不参与都有不同后果，没有绝对正确的选择
 *
 * v2.0 改动：
 *   - 新增 _hasNewsId() 辅助函数，自动匹配原始ID和 "intro_" 前缀ID
 *   - 确保开局新闻也能触发叙事事件
 *
 * 设计参考：This War of Mine 情景事件 / Papers Please 每日报纸 / 大多数 新闻回应
 *
 * 接入方式：与 cross_system_events.js 同样采用 IIFE 注入 RANDOM_EVENTS
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._newsDrivenLoaded) return;
  RANDOM_EVENTS._newsDrivenLoaded = true;

  /**
   * 检查 activeNews 中是否存在指定新闻ID
   * v2.0：自动支持原始ID和 "intro_" 前缀ID
   */
  function _hasNewsId(activeNews, targetId) {
    if (!activeNews || !Array.isArray(activeNews)) return false;
    for (var i = 0; i < activeNews.length; i++) {
      var nid = activeNews[i].id || "";
      if (nid === targetId || nid === "intro_" + targetId) return true;
    }
    return false;
  }

  var NEWS_EVENTS = [
    // ====== 建筑行业新闻驱动事件 ======
    {
      id: "construction_safety_incident",
      phase: "street",
      icon: "⚠️",
      title: "工地的安全警示",
      story:
        "新闻里说建筑行业大热，到处都在招人。今天你在工地上亲眼看到一个工友从脚手架上滑了下来——好在只擦破了皮。包工头让人赶紧把他扶走，压低声音说：「别声张，继续干。」\n\n你想起新闻里热火朝天的画面，和眼前的现实形成了对比。",
      conditions: function (st) {
        return (
          _hasNewsId(st.activeNews, "construction_boom") ||
          _hasNewsId(st.activeNews, "urban_renewal_pilot")
        );
      },
      probability: 0.03,
      repeatable: false,
      // [自洽修复] options→choices
      choices: [
        {
          text: "📢 向安全员举报",
          hint: "良心选择",
          apply: function (st) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            st.flags._constructionWhistleblower = true;
            StateManager.addMessage(
              "📢 你举报了安全隐患，安全员来做了全面检查。包工头黑着脸，但你心里踏实了。",
              "success",
            );
          },
        },
        {
          text: "🤫 假装没看见",
          hint: "不惹麻烦",
          apply: function (st) {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            StateManager.addMessage(
              "🤫 你低下头继续干活，但那个画面一直在脑子里转。",
              "warning",
            );
          },
        },
        {
          text: "📸 拍下来发网上",
          hint: "引发关注",
          apply: function (st) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            st.flags._constructionExposed = true;
            StateManager.addMessage(
              "📸 你把视频发到了网上，引发了不少讨论。工地被要求停工整改了。",
              "event",
            );
          },
        },
      ],
    },

    // ====== 流感季节新闻驱动事件 ======
    {
      id: "flu_hospital_overload",
      phase: "street",
      icon: "🏥",
      title: "医院走廊的加床",
      story:
        "新闻里说流感高峰到了、医院人满为患。今天你路过医院，发现走廊里全是加床，咳嗽声此起彼伏。\n\n护士台前排着长队，一个护士看见你，跑过来问：「你是来看病的还是来帮忙的？我们实在忙不过来了。」",
      conditions: function (st) {
        return _hasNewsId(st.activeNews, "flu_surge");
      },
      probability: 0.035,
      repeatable: false,
      // [自洽修复] options→choices
      choices: [
        {
          text: "😷 帮忙做志愿者",
          hint: "累但助人",
          apply: function (st) {
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.flags._fluVolunteer = true;
            StateManager.addMessage(
              "😷 你帮忙搬床送水跑腿，忙了整整一天。护士长感谢说：「你是好人。」",
              "success",
            );
          },
        },
        {
          text: "🛒 囤口罩卖高价",
          hint: "赚个差价",
          apply: function (st) {
            var profit = 80 + Random.int(0, 120);
            st.resources.cash = (st.resources.cash || 0) + profit;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
            st.flags._fluProfiteer = true;
            StateManager.addMessage(
              "🛒 你倒手赚了¥" + profit + "。但看着排队的人，心情有点复杂。",
              "event",
            );
          },
        },
        {
          text: "🚶 赶紧离开",
          hint: "避免被传染",
          apply: function (st) {
            StateManager.addMessage(
              "🚶 你戴好口罩快步离开了。流感季不该来医院晃悠。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 租金上涨新闻驱动事件 ======
    {
      id: "rental_crisis_landlord",
      phase: "street",
      icon: "🏠",
      title: "房东的涨价通知",
      story:
        "你刚在手机新闻里看到「租房市场全面紧张，租金飙涨」，房东就来敲门了。\n\n「小伙子，你也看到了，现在行情就是这样。下个月起，房租涨¥200。你要是接受不了，我也没办法——后面排队要租的人多的是。」",
      conditions: function (st) {
        return (
          _hasNewsId(st.activeNews, "rental_crisis") ||
          _hasNewsId(st.activeNews, "population_inflow") ||
          (st.housing && st.housing.tier > 0 && st.housing.tier < 4)
        );
      },
      probability: 0.04,
      repeatable: false,
      // [自洽修复] options→choices
      choices: [
        {
          text: "🤝 商量少涨点",
          hint: "讨价还价",
          apply: function (st) {
            var charm = st.player.charm || 0;
            if (charm >= 40 || Random.chance(0.4)) {
              st.flags._rentHalfIncrease = true;
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 3,
              );
              StateManager.addMessage(
                "🤝 你嘴皮子磨了半天，房东松口只涨¥100。省一点是一点。",
                "success",
              );
            } else {
              st.flags._rentFullIncrease = true;
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
              StateManager.addMessage(
                "🤝 房东根本不听：「爱租不租。」",
                "warning",
              );
            }
          },
        },
        {
          text: "😤 咬牙接受",
          hint: "多花钱省心",
          apply: function (st) {
            st.flags._rentFullIncrease = true;
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            StateManager.addMessage(
              "😤 你咬着牙答应了。现在行情就这样，搬家更折腾。",
              "warning",
            );
          },
        },
        {
          text: "🔍 开始找新住处",
          hint: "主动出击",
          apply: function (st) {
            st.flags._lookingForNewHome = true;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
            StateManager.addMessage(
              "🔍 你开始四处留意更便宜的住处。也许城郊能找到实惠的地方。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 科技裁员新闻驱动事件 ======
    {
      id: "tech_layoff_opportunity",
      phase: "street",
      icon: "💻",
      title: "被裁程序员的课堂",
      story:
        "新闻里说科技大厂裁员潮来了，互联网行业经历寒冬。\n\n今天你在城中村碰到几个年轻人，在小卖部门口贴了一张手写告示：「大厂被裁，手把手教编程——¥50/节，包教包会。」\n\n其中一个戴黑框眼镜的看了你一眼：「兄弟，要不要学一手？以前进大厂才用得上的技术。」",
      conditions: function (st) {
        return (
          _hasNewsId(st.activeNews, "tech_layoff") ||
          _hasNewsId(st.activeNews, "tech_layoff_echo")
        );
      },
      probability: 0.035,
      repeatable: false,
      // [自洽修复] options→choices
      choices: [
        {
          text: "💻 报名学习（¥50）",
          hint: "投资技能",
          cost: 50,
          apply: function (st) {
            if ((st.resources.cash || 0) < 50) {
              StateManager.addMessage(
                "💻 你摸了摸口袋，钱不够。先攒攒再说吧。",
                "warning",
              );
              return;
            }
            st.resources.cash -= 50;
            st.skills = st.skills || {};
            st.skills.coding = st.skills.coding || { level: 1, xp: 0 };
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 50;
            st.flags._learnedCodingFromLayoff = true;
            StateManager.addMessage(
              "💻 你花¥50学了一节编程课。虽然难，但打开了新世界的大门。技能经验+50。",
              "success",
            );
          },
        },
        {
          text: "👀 在边上旁听",
          hint: "白嫖知识",
          apply: function (st) {
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 2,
            );
            st.flags._codingInterestPiqued = true;
            StateManager.addMessage(
              "👀 你站在旁边听了一会儿。编程好像也没那么神秘。",
              "info",
            );
          },
        },
        {
          text: "🚶 路过而已",
          hint: "不感兴趣",
          apply: function (st) {
            StateManager.addMessage(
              "🚶 你摆摆手走开了。跟自己不是一个世界的东西。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 城管严查新闻驱动事件 ======
    {
      id: "crackdown_street_vendor",
      phase: "street",
      icon: "🚔",
      title: "城管的突击检查",
      story:
        "你刚在新闻里看到「城管严查摆摊」的消息，今天就撞上了现场。\n\n街口几个摆摊的小贩慌乱地收摊，一个卖烤红薯的大爷跑不及，三轮车被扣住了。大爷蹲在路边默默抽烟，手在微微发抖。旁边几个小贩围过来低声商量办法。",
      conditions: function (st) {
        return (
          _hasNewsId(st.activeNews, "crackdown") ||
          _hasNewsId(st.activeNews, "chengguan_special_op")
        );
      },
      probability: 0.04,
      repeatable: false,
      // [自洽修复] options→choices
      choices: [
        {
          text: "🤝 帮大爷求情",
          hint: "冒险但暖心",
          apply: function (st) {
            var charm = st.player.charm || 0;
            if (charm >= 50 || Random.chance(0.35)) {
              st.flags._helpedVendorGetCartBack = true;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 8,
              );
              StateManager.addMessage(
                "🤝 你过去跟城管说了几句好话，大爷的三轮车居然要回来了！大爷感激地塞给你两个烤红薯。",
                "success",
              );
            } else {
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
              StateManager.addMessage(
                "🤝 你试着求情，城管瞪了你一眼：「少管闲事。」",
                "warning",
              );
            }
          },
        },
        {
          text: "💰 凑钱帮交罚款",
          hint: "花¥50帮忙",
          cost: 50,
          apply: function (st) {
            if ((st.resources.cash || 0) < 50) {
              StateManager.addMessage(
                "💰 你自己也没几个钱，帮不上忙。",
                "warning",
              );
              return;
            }
            st.resources.cash -= 50;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            st.flags._donatedToVendor = true;
            StateManager.addMessage(
              "💰 你塞给大爷¥50。他眼圈红了：「孩子，你是个好人。」",
              "success",
            );
          },
        },
        {
          text: "📝 默默记下教训",
          hint: "长个心眼",
          apply: function (st) {
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 2,
            );
            StateManager.addMessage(
              "📝 摆摊的生意，得看天看地看城管。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 电商大促新闻驱动事件 ======
    {
      id: "ecom_festival_side_hustle",
      phase: "street",
      icon: "📦",
      title: "电商大促的临时工潮",
      story:
        "新闻里说电商大促节物流爆仓，快递站包裹堆成山。你刚好路过，站长满头大汗在门口招人：「日结¥300！干到晚上12点！谁来？」\n\n广播里不断播着「距离截单还有3小时」，快递员们像蚂蚁一样忙碌。",
      conditions: function (st) {
        return (
          _hasNewsId(st.activeNews, "e_commerce_festival") ||
          _hasNewsId(st.activeNews, "sea_double_11")
        );
      },
      probability: 0.05,
      repeatable: true,
      // [自洽修复] options→choices
      choices: [
        {
          text: "📦 干！日结¥300",
          hint: "赚快钱",
          apply: function (st) {
            var fatigue = 20 + Random.int(0, 10);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + fatigue);
            var income = 300 + Random.int(0, 100);
            st.resources.cash = (st.resources.cash || 0) + income;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + income;
            st.flags._ecomTempWorker = (st.flags._ecomTempWorker || 0) + 1;
            StateManager.addMessage(
              "📦 你干了一整天快递分拣，累得腰直不起来，但赚了¥" +
                income +
                "！",
              "success",
            );
          },
        },
        {
          text: "🔄 承包一条线路",
          hint: "赚更多（需¥200押金）",
          cost: 200,
          apply: function (st) {
            var charm = st.player.charm || 0;
            if (charm >= 35 && (st.resources.cash || 0) >= 200) {
              st.resources.cash -= 200;
              var income = 500 + Random.int(0, 200);
              st.resources.cash = (st.resources.cash || 0) + income;
              st.resources.totalEarned =
                (st.resources.totalEarned || 0) + income;
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
              st.flags._ecomSubcontractor = true;
              StateManager.addMessage(
                "🔄 你押了¥200，承包了一条路线配送到凌晨，赚了¥" +
                  income +
                  "！",
                "event",
              );
            } else {
              StateManager.addMessage(
                "🔄 站长看了看你：「连辆三轮车都没，包什么包？」",
                "warning",
              );
            }
          },
        },
        {
          text: "🚶 不凑热闹",
          hint: "人太多太乱",
          apply: function (st) {
            StateManager.addMessage(
              "🚶 你看着忙碌的快递站，转身走了。赚钱的机会还多。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 寒冷天气新闻驱动事件 ======
    {
      id: "cold_wave_homeless_encounter",
      phase: "street",
      icon: "🥶",
      title: "街角的寒夜",
      story:
        "新闻说寒潮来袭，气温骤降。深夜收工回家路上，你看到天桥下一个流浪老人蜷缩在纸箱里，冻得直哆嗦。\n\n风很大，街上几乎没有人。你站在不远处，犹豫着。",
      conditions: function (st) {
        return (
          _hasNewsId(st.activeNews, "cold_wave") ||
          _hasNewsId(st.activeNews, "winter_heating")
        );
      },
      probability: 0.03,
      repeatable: false,
      // [自洽修复] options→choices
      choices: [
        {
          text: "🧥 把外套给他",
          hint: "助人",
          apply: function (st) {
            // [全系统自洽修复] 域B A类#1: st.flags/st.needs/st.player/st.status 守卫
            if (!st.flags) st.flags = {};
            if (!st.needs) st.needs = { happiness: 50, fatigue: 0 };
            if (!st.player) st.player = { fame: 0 };
            if (!st.status) st.status = { health: 50 };
            st.flags._gaveCoatToHomeless = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            st.status.health = Math.max(0, (st.status.health || 50) - 2);
            StateManager.addMessage(
              "🧥 你脱下外套盖在老人身上。他醒了，含糊说了句「谢谢」。你快步走开，但心里一阵暖意。",
              "success",
            );
          },
        },
        {
          text: "🍞 买份热饭送去",
          hint: "花¥15",
          cost: 15,
          apply: function (st) {
            if ((st.resources.cash || 0) < 15) {
              StateManager.addMessage("🍞 你摸了摸口袋，没什么钱。", "warning");
              return;
            }
            st.resources.cash -= 15;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            st.flags._boughtFoodForHomeless = true;
            StateManager.addMessage(
              "🍞 你在便利店买了热包子和水，轻轻放在老人身边。希望他能撑过今晚。",
              "success",
            );
          },
        },
        {
          text: "🚶 快步走过",
          hint: "自顾不暇",
          apply: function (st) {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            StateManager.addMessage(
              "🚶 你裹紧衣服快步走过。这座城市里，每个人都有自己的难处。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 经济下行新闻驱动事件 ======
    {
      id: "recession_side_hustle_dilemma",
      phase: "street",
      icon: "📉",
      title: "经济寒潮下的选择",
      story:
        "新闻里说经济下行压力大，小生意难做。身边的工友老刘愁眉苦脸：「厂里订单少了，这周只排了两天班。」\n\n他问你：「听说你在搞副业？有没有路子？我什么都能干。」",
      conditions: function (st) {
        var ecoIds = [
          "eco_small_biz_hard",
          "eco_deflation_worry",
          "tech_layoff",
          "global_recession_fear",
        ];
        for (var ei = 0; ei < ecoIds.length; ei++) {
          if (_hasNewsId(st.activeNews, ecoIds[ei])) return st.player.day >= 10;
        }
        return false;
      },
      probability: 0.03,
      repeatable: false,
      // [自洽修复] options→choices
      choices: [
        {
          text: "🤝 帮老刘介绍活",
          hint: "助人积德",
          apply: function (st) {
            st.flags._helpedFriendFindWork = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            // [全系统自洽修复] 域B A类#2: old_zhou met 门控
            if (st.relationships && st.relationships.old_zhou && st.relationships.old_zhou.met) {
              st.relationships.old_zhou.affinity = Math.min(
                100,
                (st.relationships.old_zhou.affinity || 0) + 5,
              );
            }
            StateManager.addMessage(
              "🤝 你帮老刘介绍了一份零工。他千恩万谢，说改天请你喝酒。",
              "success",
            );
          },
        },
        {
          text: "😅 自顾不暇",
          hint: "说实话",
          apply: function (st) {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
            StateManager.addMessage(
              "😅 你苦笑着摊手：「我自己也紧巴巴的。」老刘叹了口气，没再说什么。",
              "info",
            );
          },
        },
        {
          text: "💡 劝他一起干副业",
          hint: "合伙",
          apply: function (st) {
            st.flags._startedHustleWithFriend = true;
            if (st.flags._startupProgress) {
              st.flags._startupProgress += 5;
            }
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
            StateManager.addMessage(
              "💡 你给老刘讲了讲副业的事。他眼睛亮了：「行，明天我跟你干！」",
              "event",
            );
          },
        },
      ],
    },
  ];

  // 注入到 RANDOM_EVENTS
  for (var i = 0; i < NEWS_EVENTS.length; i++) {
    if (!NEWS_EVENTS[i].conditions) {
      NEWS_EVENTS[i].conditions = function () {
        return true;
      };
    }
    RANDOM_EVENTS.push(NEWS_EVENTS[i]);
  }
})();

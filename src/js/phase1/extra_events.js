/**
 * 额外事件集 — 新增15个高重复价值事件
 *
 * 设计原则（1.4标准）：
 * - 逻辑自洽：事件原因→经过→结果符合现实逻辑
 * - 系统联动：每个事件至少影响2个游戏子系统
 * - 玩家可感知：通过UI和消息系统自然呈现
 * - 重复价值：季节循环事件每年可重复，NPC偶遇依赖好感度变化
 *
 * 这些事件会被推入 RANDOM_EVENTS 数组，自动参与事件轮询。
 * 在 index.html 中 events.js 加载后加载。
 */

(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;

  var EXTRA_EVENTS = [
    // ============================================================
    // 城市四季 — 每年循环，不同季节不同内容
    // ============================================================
    {
      id: "spring_employment_boom",
      phase: "street",
      icon: "🌸",
      title: "开春招工潮",
      story:
        "春节过后，城市迎来了招工旺季。工地、工厂、餐饮店门口都贴着招工启事。街上的招工中介也比平时多了好几家——春天是找工作的好时候。",
      conditions: function (st) {
        return st.weather && st.weather.season === "spring";
      },
      choices: [
        {
          text: "💪 趁旺季多打几份工",
          hint: "加班加成",
          cost: 0,
          apply: function (st) {
            st.resources.cash += Random.int(150, 249);
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 20);
            StateManager.addMessage(
              "🌸 开春招工旺季，你多打了几份工，收入不错。",
              "success",
            );
          },
        },
        {
          text: "📋 看看有没有更好的工作机会",
          hint: "可能找到新工作",
          apply: function (st) {
            st.flags._springJobSearch = true;
            StateManager.addMessage(
              "🌸 你留意了招工信息，似乎有更好的机会在等着你。",
              "hint",
            );
          },
        },
        {
          text: "😌 不急，慢慢来",
          hint: "保持体力",
          apply: function (st) {
            StateManager.addMessage(
              "🌸 你决定不跟风，保持自己的节奏。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "summer_heat_struggle",
      phase: "street",
      icon: "☀️",
      title: "炎夏难熬",
      story:
        "三伏天，太阳像火炉一样烤着街道。摆摊的商贩都躲到了阴凉处，工地的工人们也放慢了节奏。这种天气下干活，体力消耗是平时的两倍。",
      conditions: function (st) {
        return st.weather && st.weather.season === "summer";
      },
      choices: [
        {
          text: "💦 忍忍继续干",
          hint: "收入正常但疲劳翻倍",
          apply: function (st) {
            st.resources.cash += Random.int(80, 129);
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 30);
            st.needs.health = Math.max(0, st.needs.health - 3);
            StateManager.addMessage(
              "☀️ 你在酷暑中坚持工作，赚了钱但身体吃不消。",
              "info",
            );
          },
        },
        {
          text: "🧊 买冷饮消暑",
          hint: "花¥15减疲劳",
          cost: 15,
          apply: function (st) {
            st.resources.cash -= 15;
            st.needs.fatigue -= 10;
            StateManager.addMessage(
              "☀️ 一瓶冰水解了暑气，感觉好多了。",
              "success",
            );
          },
        },
        {
          text: "🌳 休息一天",
          hint: "体力恢复但没收入",
          apply: function (st) {
            st.needs.fatigue = Math.max(0, st.needs.fatigue - 25);
            StateManager.addMessage(
              "☀️ 你在树荫下歇了一天，避开了最热的时段。",
              "hint",
            );
          },
        },
      ],
    },
    {
      id: "autumn_price_drop",
      phase: "street",
      icon: "🍂",
      title: "秋收季节·物价波动",
      story:
        "入秋后，农产品大量上市，菜市场的水果蔬菜价格明显下降。与此同时，服装店开始上秋冬新款，旧款打折清仓。精明的商家知道这是个囤货的好时机。",
      conditions: function (st) {
        return st.weather && st.weather.season === "autumn";
      },
      choices: [
        {
          text: "🛒 趁便宜多买食材",
          hint: "食材开销减半",
          apply: function (st) {
            st.flags._autumnGroceries = true;
            st.resources.cash -= 20;
            StateManager.addMessage(
              "🍂 你囤了一批便宜食材，未来几天的吃饭开销会省不少。",
              "success",
            );
          },
        },
        {
          text: "📦 倒卖换季商品",
          hint: "薄利但稳妥",
          apply: function (st) {
            var profit = Random.int(40, 89);
            st.resources.cash += profit;
            StateManager.addMessage(
              "🍂 你倒卖了一批换季商品，净赚¥" + profit + "。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "winter_shelter_struggle",
      phase: "street",
      icon: "❄️",
      title: "严冬求生",
      story:
        "寒潮来袭，气温骤降到零下。街上的流浪猫狗都不见了踪影，路面结了一层薄冰。这种天气里，有个温暖的住处比什么都重要。",
      conditions: function (st) {
        return st.weather && st.weather.season === "winter";
      },
      choices: [
        {
          text: "🔥 找地方取暖",
          hint: "减少生病概率",
          apply: function (st) {
            st.needs.health = Math.min(100, (st.needs.health || 50) + 8);
            StateManager.addMessage(
              "❄️ 你在救助站取暖，身体暖和过来了。",
              "success",
            );
          },
        },
        {
          text: "💰 硬扛着去工作",
          hint: "高风险高回报",
          apply: function (st) {
            st.resources.cash += Random.int(120, 179);
            st.needs.health = Math.max(0, (st.needs.health || 50) - 5);
            if (Random.chance(0.3)) {
              st.flags._everSick = true;
              StateManager.addMessage(
                "❄️ 你在严寒中工作了一天，但好像着凉了。",
                "danger",
              );
            } else {
              StateManager.addMessage(
                "❄️ 你咬牙在寒风中工作了一天，赚到了钱。",
                "success",
              );
            }
          },
        },
      ],
    },
    {
      id: "rainy_season_flood",
      phase: "street",
      icon: "🌧️",
      title: "雨季城市内涝",
      story:
        "连续几天的暴雨让城市多处积水，低洼地段的路面变成了小河。很多人被困在家里，急需有人帮忙送东西。",
      conditions: function (st) {
        // 必须当前正在下雨（暴雨或大雨），且不在室内专属地点
        // [自洽修复] st.weather.current 存储英文值，原比较中文"暴雨"/"大雨"永不匹配
        var weatherNow = (st.weather && st.weather.current) || "sunny";
        if (weatherNow !== "rainy" && weatherNow !== "stormy") return false;
        var locKey = st.trade && st.trade.currentLocation;
        // 排除完全室内/非现实地点（银行、培训中心等）
        if (locKey === "bank" || locKey === "trainingCenter") return false;
        return true;
      },
      choices: [
        {
          text: "🚣 蹚水跑腿送货",
          hint: "溢价但危险，疲劳+25",
          apply: function (st) {
            var earnAmt = Random.int(130, 209);
            st.resources.cash += earnAmt;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 25);
            StateManager.addMessage(
              "🌧️ 你在积水中帮人跑腿送东西，浑身湿透但赚了¥" + earnAmt + "。",
              "success",
            );
          },
        },
        {
          text: "🏠 待在屋里",
          hint: "安全但没收入",
          apply: function (st) {
            st.needs.hygiene = Math.min(100, (st.needs.hygiene || 50) + 5);
            st.needs.mood = Math.min(100, (st.needs.mood || 50) + 3);
            StateManager.addMessage(
              "🌧️ 你在屋里躲了一天雨，读了一会书，心情平静。",
              "hint",
            );
          },
        },
      ],
    },

    // ============================================================
    // NPC偶遇 — 依赖好感度和位置
    // ============================================================
    {
      id: "npc_aunt_wang_tenant_help",
      phase: "street",
      icon: "🏠",
      title: "王大婶的租客纠纷",
      story:
        "王大婶皱着眉头来找你：'楼上那家租客拖欠了两个月房租，还总在半夜唱歌。你是读过书的人，帮我想想办法？'",
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.aunt_wang &&
          st.relationships.aunt_wang.affinity >= 30 &&
          (st.housing.tier || 0) >= 1
        );
      },
      choices: [
        {
          text: "📝 帮王大婶写催租通知",
          hint: "好感+5",
          apply: function (st) {
            if (st.relationships.aunt_wang)
              st.relationships.aunt_wang.affinity = Math.min(
                100,
                st.relationships.aunt_wang.affinity + 5,
              );
            st.resources.cash += 20;
            StateManager.addMessage(
              "🏠 你帮王大婶写了正规催租通知，她满意地塞给你¥20。",
              "success",
            );
          },
        },
        {
          text: "🤝 上楼去调解",
          hint: "可能有用或碰钉子",
          apply: function (st) {
            if (Random.chance(0.6)) {
              if (st.relationships.aunt_wang)
                st.relationships.aunt_wang.affinity = Math.min(
                  100,
                  st.relationships.aunt_wang.affinity + 8,
                );
              st.resources.cash += 50;
              StateManager.addMessage(
                "🏠 你成功调解了纠纷！王大婶开心地给了你¥50感谢费。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🏠 租客态度恶劣，调解失败。王大婶叹了口气。",
                "danger",
              );
            }
          },
        },
      ],
    },
    {
      id: "npc_boss_li_side_job",
      phase: "street",
      icon: "🔨",
      title: "李工头的私活",
      story:
        "李工头神秘兮兮地把你拉到一边：'有个老客户的别墅要翻新院子，不经过公司，咱们自己干。两天活儿，分你¥300，干不干？'",
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.boss_li &&
          st.relationships.boss_li.affinity >= 40 &&
          st.trade &&
          st.trade.currentLocation === "construction"
        );
      },
      choices: [
        {
          text: "💪 干！私活赚钱多",
          hint: "收入高但无保障",
          apply: function (st) {
            st.resources.cash += Random.int(300, 399);
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 25);
            if (Random.chance(0.1)) {
              st.flags._everInjured = true;
              StateManager.addMessage(
                "🔨 院子翻新出了点意外，你受了轻伤，但钱拿到了。",
                "danger",
              );
            } else {
              StateManager.addMessage(
                "🔨 你和李工头干了两天私活，分到了¥" +
                  Random.int(300, 399) +
                  "！",
                "success",
              );
            }
          },
        },
        {
          text: "⚠️ 算了，没保障",
          hint: "安全第一",
          apply: function (st) {
            if (st.relationships.boss_li)
              st.relationships.boss_li.affinity = Math.max(
                0,
                st.relationships.boss_li.affinity - 2,
              );
            StateManager.addMessage(
              "🔨 你婉拒了私活，李工头有点失望但表示理解。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "npc_sister_zhang_tip",
      phase: "street",
      icon: "💼",
      title: "张姐的内部消息",
      story:
        "张姐在东张西望后压低声音说：'城东新开了一家大型物流分拣中心，正在大量招人。我知道内部HR的微信，帮你推一把？不过人情费得你自己出。'",
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.sister_zhang &&
          st.relationships.sister_zhang.affinity >= 35 &&
          st.trade &&
          st.trade.currentLocation === "commercialDist"
        );
      },
      choices: [
        {
          text: "💰 给¥50人情费",
          hint: "解锁高薪工作",
          cost: 50,
          apply: function (st) {
            st.resources.cash -= 50;
            st.flags._zhangLogisticsJob = true;
            if (st.relationships.sister_zhang)
              st.relationships.sister_zhang.affinity = Math.min(
                100,
                st.relationships.sister_zhang.affinity + 3,
              );
            StateManager.addMessage(
              "💼 张姐帮你推了简历，物流中心的HR说下周可以来面试！",
              "success",
            );
          },
        },
        {
          text: "🙏 先记着，回头再说",
          hint: "保留机会",
          apply: function (st) {
            st.flags._zhangOfferPending = true;
            StateManager.addMessage(
              "💼 张姐说消息给你留着，想好了随时找她。",
              "hint",
            );
          },
        },
      ],
    },
    {
      id: "npc_old_zhou_secret",
      phase: "street",
      icon: "🗑️",
      title: "老周的废品宝藏",
      story:
        "老周正在整理一堆旧书废纸，突然兴奋地朝你招手：'快来快来！我淘到宝了——这些旧书里有几本绝版的专业书，网上能卖好价钱！你会用手机，帮我挂上去？'",
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.old_zhou &&
          st.relationships.old_zhou.affinity >= 30 &&
          st.trade &&
          st.trade.currentLocation === "slum"
        );
      },
      choices: [
        {
          text: "📱 帮老周挂二手平台",
          hint: "分你一半",
          apply: function (st) {
            var profit = Random.int(80, 199);
            st.resources.cash += profit;
            if (st.relationships.old_zhou)
              st.relationships.old_zhou.affinity = Math.min(
                100,
                st.relationships.old_zhou.affinity + 4,
              );
            StateManager.addMessage(
              "🗑️ 绝版书卖了¥" + profit * 2 + "，老周分了你¥" + profit + "！",
              "success",
            );
          },
        },
        {
          text: "📖 先看看有没有自己有用的",
          hint: "可能学到技能",
          apply: function (st) {
            var skillGain = Random.int(5, 19);
            for (var sk in st.skills) {
              st.skills[sk].xp += skillGain;
              break;
            }
            StateManager.addMessage(
              "🗑️ 你在旧书堆里找到一本有用的教材，所有技能+少量XP。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "npc_chef_chen_food_crisis",
      phase: "street",
      icon: "🍳",
      title: "陈师傅的食材危机",
      story:
        "陈师傅焦急地翻着手机：'今天送菜的供应商临时涨价，比平时贵了三成！不买的话今天没法开门。你知道附近哪里能买到平价食材吗？'",
      conditions: function (st) {
        return (
          st.relationships &&
          st.relationships.chef_chen &&
          st.relationships.chef_chen.affinity >= 30
        );
      },
      choices: [
        {
          text: "🛒 带他去批发市场",
          hint: "好感+5，奖励¥50",
          apply: function (st) {
            st.resources.cash += 50;
            if (st.relationships.chef_chen)
              st.relationships.chef_chen.affinity = Math.min(
                100,
                st.relationships.chef_chen.affinity + 5,
              );
            StateManager.addMessage(
              "🍳 你带陈师傅去了批发市场，省了一半钱！他开心地给了你¥50。",
              "success",
            );
          },
        },
        {
          text: "🍳 用你存的食材救急",
          hint: "消耗食材，好感大增",
          apply: function (st) {
            var hasIngredients =
              st.inventory &&
              st.inventory.some(function (i) {
                return i.isIngredient;
              });
            if (hasIngredients) {
              if (st.relationships.chef_chen)
                st.relationships.chef_chen.affinity = Math.min(
                  100,
                  st.relationships.chef_chen.affinity + 8,
                );
              st.resources.cash += 100;
              StateManager.addMessage(
                "🍳 你拿出存的食材帮陈师傅解了燃眉之急！他感动地给了¥100。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🍳 你想帮忙但发现自己也没有多余食材。",
                "danger",
              );
            }
          },
        },
      ],
    },

    // ============================================================
    // 资源危机 — 基于经济状况动态生成
    // ============================================================
    {
      id: "crisis_medical_bill",
      phase: "street",
      icon: "🏥",
      title: "突如其来的医药费",
      story:
        "你的身体发出了警报——持续的头痛和低烧让你不得不去医院。检查后发现是慢性疲劳综合症的前兆，医生开了一个疗程的药，费用¥200。",
      conditions: function (st) {
        // [自洽修复] st.needs.health 不存在，改 st.status.health
        return ((st.status && st.status.health) || 50) < 35;
      },
      choices: [
        {
          text: "💊 买药治疗",
          hint: "健康+15，花费¥200",
          cost: 200,
          apply: function (st) {
            st.resources.cash -= 200;
            st.needs.health = Math.min(100, (st.needs.health || 50) + 15);
            StateManager.addMessage(
              "🏥 你买了药开始治疗，感觉身体在慢慢恢复。",
              "success",
            );
          },
        },
        {
          text: "💪 扛一扛",
          hint: "不花钱但可能恶化",
          apply: function (st) {
            st.needs.health = Math.max(0, (st.needs.health || 50) - 5);
            StateManager.addMessage(
              "🏥 你决定硬扛，但身体似乎更差了……",
              "danger",
            );
          },
        },
        {
          text: "☎️ 找人借钱",
          hint: "找好感最高的NPC借",
          apply: function (st) {
            st.resources.cash += 200;
            st.flags._hasMedicalDebt = true;
            StateManager.addMessage(
              "🏥 你借到了钱买了药，但欠下了一笔人情债。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "crisis_debt_collector",
      phase: "street",
      icon: "💸",
      title: "催债人上门",
      story:
        "你正走在街上，一个穿皮夹克的男人拦住了你的去路：'听说你欠了不少钱？老板让我来问问，什么时候能还？'你的欠款已经引起了某些人的注意。",
      conditions: function (st) {
        return (st.resources.debt || 0) > 3000;
      },
      choices: [
        {
          text: "💰 先还一部分",
          hint: "还¥500",
          cost: 500,
          apply: function (st) {
            st.resources.debt = Math.max(0, (st.resources.debt || 0) - 500);
            StateManager.addMessage(
              "💸 你给了¥500先缓一缓，催债人暂时离开了。",
              "info",
            );
          },
        },
        {
          text: "🤝 争取宽限几天",
          hint: "心智高更容易成功",
          apply: function (st) {
            var success = (st.player.mental || 0) > 25;
            if (success) {
              StateManager.addMessage(
                "💸 你冷静地跟催债人说明了情况，他同意再给你一周时间。",
                "success",
              );
            } else {
              st.resources.debt = Math.min(
                100000,
                (st.resources.debt || 0) + 200,
              );
              StateManager.addMessage(
                "💸 催债人不耐烦地加了利息：'那就再多还¥200！'",
                "danger",
              );
            }
          },
        },
      ],
    },
    {
      id: "crisis_landlord_repair",
      phase: "street",
      icon: "🔧",
      title: "房子出问题了",
      story:
        "你回到住处，发现水管爆了，水漫了一地。房东说要修可以，但维修费得你出——要么你自己修，要么找人修，费用¥150。",
      conditions: function (st) {
        return (st.housing.tier || 0) >= 2 && (st.housing.tier || 0) <= 3;
      },
      choices: [
        {
          text: "🔧 自己修",
          hint: "维修技能高则省钱",
          apply: function (st) {
            var cost =
              st.skills.repair && st.skills.repair.level > 10 ? 30 : 150;
            st.resources.cash -= cost;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
            StateManager.addMessage(
              "🔧 你花了¥" + cost + "修好了水管。",
              cost < 50 ? "success" : "info",
            );
          },
        },
        {
          text: "💸 找师傅修",
          hint: "省事但贵",
          apply: function (st) {
            st.resources.cash -= 150;
            StateManager.addMessage(
              "🔧 你找了师傅修好水管，花了¥150。",
              "info",
            );
          },
        },
        {
          text: "📞 跟房东据理力争",
          hint: "心智高能说服房东出钱",
          apply: function (st) {
            var success = (st.player.mental || 0) > 30;
            if (success) {
              StateManager.addMessage(
                "🔧 你据理力争，房东最终同意承担维修费！",
                "success",
              );
            } else {
              st.resources.cash -= 150;
              st.relationships.aunt_wang = st.relationships.aunt_wang || {
                affinity: 0,
                met: true,
              };
              st.relationships.aunt_wang.affinity = Math.max(
                0,
                st.relationships.aunt_wang.affinity - 3,
              );
              StateManager.addMessage(
                "🔧 房东拒绝出钱，你还得自己掏¥150。",
                "danger",
              );
            }
          },
        },
      ],
    },
    {
      id: "crisis_identity_fraud",
      phase: "street",
      icon: "🚨",
      title: "身份信息泄露",
      story:
        "你收到一条短信：'【XX银行】您的账户异常登录，请立即点击链接验证……'紧接着一个陌生号码打来，自称是银行风控人员，要你提供身份证号和银行卡密码。",
      conditions: function (st) {
        return (st.resources.bankBalance || 0) > 1000;
      },
      choices: [
        {
          text: "📵 挂断并报警",
          hint: "安全第一",
          apply: function (st) {
            st.flags._reportedScam = true;
            StateManager.addMessage(
              "🚨 你挂断电话后举报了诈骗号码，保护了自己的财产安全。",
              "success",
            );
          },
        },
        {
          text: "🎣 逗逗骗子玩",
          hint: "可能反套路？",
          apply: function (st) {
            if (Random.chance(0.3)) {
              st.resources.cash += Random.int(0, 99);
              StateManager.addMessage(
                "🚨 你反套路了骗子，居然套出了对方的一些信息！",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🚨 骗子发现你在逗他，骂了一句挂断了。",
                "info",
              );
            }
          },
        },
        {
          text: "🏦 去银行确认",
          hint: "花行动力但最安全",
          apply: function (st) {
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
            StateManager.addMessage(
              "🚨 你去银行确认了账户安全，柜员夸你警惕性高。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "crisis_gearbreak",
      phase: "street",
      icon: "⚙️",
      title: "吃饭的家伙坏了",
      story:
        "你的关键装备出了问题——工作用的手套磨破了底，鞋底也快掉了。没有趁手的工具，接下来的工作效率会大打折扣。",
      conditions: function (st) {
        return (
          st.player.day >= 20 && Object.keys(st.equipment || {}).length > 0
        );
      },
      choices: [
        {
          text: "🆕 买新的",
          hint: "花¥30换新装备",
          cost: 30,
          apply: function (st) {
            st.resources.cash -= 30;
            StateManager.addMessage(
              "⚙️ 你换了新装备，干活又利索了。",
              "success",
            );
          },
        },
        {
          text: "🔧 自己修修",
          hint: "维修技能有用",
          apply: function (st) {
            var skill = st.skills.repair ? st.skills.repair.level : 0;
            if (skill > 5) {
              StateManager.addMessage(
                "⚙️ 你熟练地修好了装备，手艺不错！",
                "success",
              );
            } else {
              st.resources.cash -= 15;
              StateManager.addMessage(
                "⚙️ 你勉强修了一下，但效果不太好，还是花了¥15买修补材料。",
                "info",
              );
            }
          },
        },
      ],
    },
    // ====== 突发意外事件 ======
    {
      id: "phone_stolen",
      phase: "street",
      icon: "📱",
      title: "手机被偷了",
      story:
        "在拥挤的公交车上，你感觉口袋一轻——手机没了！那部手机虽然不值钱，但里面有你的通讯录、支付信息和各种账号。",
      conditions: function (st) {
        return st.player.day > 5 && st.resources.cash > 100;
      },
      choices: [
        {
          text: "🚓 报警挂失",
          hint: "安全第一，花¥200补办",
          cost: 200,
          apply: function (st) {
            StateManager.addMessage(
              "🚓 警察备了案，但找回希望渺茫。你赶紧补办了手机卡，花了¥200。",
              "info",
            );
          },
        },
        {
          text: "💪 自己沿路找找",
          hint: "花1点行动力碰运气",
          apply: function (st) {
            var found = Random.chance(0.3);
            if (found) {
              StateManager.addMessage(
                "🙏 你沿着原路找回去，竟然在垃圾桶旁边找到了！虚惊一场。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "😤 找了半天没找到，还耽误了时间。",
                "warning",
              );
            }
          },
        },
        {
          text: "😤 破财消灾，直接买二手",
          hint: "¥500换个二手",
          cost: 500,
          apply: function (st) {
            StateManager.addMessage(
              "💸 你在二手市场淘了个同款手机。虽然心疼钱，但好歹有手机用了。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "landlord_visit",
      phase: "street",
      icon: "🏠",
      title: "房东临时查房",
      story:
        "你正窝在出租屋里休息，突然传来急促的敲门声——房东来了！他皱着眉头扫了一圈屋里的情况，看来是要找茬涨房租。",
      conditions: function (st) {
        return st.player.day > 15 && !st.flags._landlordVisited;
      },
      choices: [
        {
          text: "🤝 好烟好茶招待",
          hint: "花¥100缓和关系",
          cost: 100,
          apply: function (st) {
            st.flags._landlordVisited = true;
            StateManager.addMessage(
              "🍵 你给房东递了根烟倒了杯茶。他脸色缓和了，临走说了句「小伙子懂事」。房租暂时不涨。",
              "success",
            );
          },
        },
        {
          text: "💪 据理力争，合同说话",
          hint: "需要心智≥30",
          apply: function (st) {
            st.flags._landlordVisited = true;
            if ((st.player.mental || 0) >= 30) {
              StateManager.addMessage(
                "📋 你拿出租房合同据理力争。房东理亏，嘟囔了几句走了。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "😰 你支支吾吾说不出个所以然，房东决定下个月涨租¥200。",
                "warning",
              );
            }
          },
        },
        {
          text: "😰 装可怜求情",
          hint: "可能需要好感",
          apply: function (st) {
            st.flags._landlordVisited = true;
            StateManager.addMessage(
              "😢 你跟房东说最近确实困难。房东叹了口气：「我也是给人打工的，下不为例。」",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "street_fight",
      phase: "street",
      icon: "👊",
      title: "街边冲突",
      story:
        "你路过小吃街时，几个人因为排队问题吵了起来。其中一个人推了你一把，差点把你推到路边的污水沟里。",
      conditions: function (st) {
        return st.player.day > 10;
      },
      choices: [
        {
          text: "🛡️ 忍了，绕道走",
          hint: "安全第一",
          apply: function (st) {
            StateManager.addMessage(
              "🚶 你绕了远路多花了10分钟。虽然憋屈，但没惹上麻烦。",
              "info",
            );
          },
        },
        {
          text: "💪 理论两句",
          hint: "需要体质≥30",
          apply: function (st) {
            if ((st.player.physique || 0) >= 30) {
              StateManager.addMessage(
                "💪 你站直了身板盯着对方。对方看你不好惹，嘟囔着走开了。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "😅 你刚开口就被怼了回来。周围人都在看你，尴尬至极。",
                "warning",
              );
            }
          },
        },
        {
          text: "📞 报警",
          hint: "让警察处理",
          apply: function (st) {
            StateManager.addMessage(
              "🚓 警察来了之后人群散了。你做了笔录，耽误了半小时。",
              "info",
            );
          },
        },
      ],
    },
    // ====== 机遇类事件 ======
    {
      id: "street_photographer",
      phase: "street",
      icon: "📸",
      title: "偶遇街拍摄影师",
      story:
        "一个背着相机的年轻人叫住你：「你好，我在做城市纪实摄影项目。你的穿搭很有感觉，能给你拍几张照片吗？」",
      conditions: function (st) {
        return st.player.day > 20 && (st.player.fame || 0) < 50;
      },
      choices: [
        {
          text: "😊 大方配合",
          hint: "名气+2，可能上本地公众号",
          apply: function (st) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            StateManager.addMessage(
              "📸 摄影师拍了几张照片，说会上传本地生活号。你感觉自己在城市里留了个印记。名气+2",
              "success",
            );
          },
        },
        {
          text: "🤝 跟他聊聊摄影",
          hint: "可能学到新技能",
          apply: function (st) {
            StateManager.addMessage(
              "📷 你们聊了半小时摄影。他说如果想学可以去找他，但需要自己有相机。",
              "hint",
            );
          },
        },
        {
          text: "🚶 婉拒，赶时间",
          hint: "没损失",
          apply: function (st) {
            StateManager.addMessage("🚶 你摆了摆手，继续赶路。", "info");
          },
        },
      ],
    },
    {
      id: "free_clinic",
      phase: "street",
      icon: "🏥",
      title: "社区免费体检",
      story:
        "社区卫生服务中心贴出公告：本周有免费体检活动，包括血压、血糖、心电图等基础项目。平时去医院要花好几百呢。",
      conditions: function (st) {
        return (
          // [自洽修复] st.needs.health 不存在，改 st.status.health
          st.player.day > 30 && ((st.status && st.status.health) || 100) < 90
        );
      },
      choices: [
        {
          text: "✅ 去体检",
          hint: "了解身体状况，免费",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._healthChecked = st.player.day;
            StateManager.addMessage(
              "🏥 体检结果：各项指标" +
                (Random.chance(0.8) ? "基本正常" : "有些指标需要注意") +
                "。心里踏实多了。",
              "success",
            );
          },
        },
        {
          text: "💪 顺便咨询健康建议",
          hint: "+1 体质经验",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._healthChecked = st.player.day;
            if (st.player.physique)
              st.player.physique = Math.min(100, st.player.physique + 1);
            StateManager.addMessage(
              "💪 医生给了你一些健康建议，你感觉身体状态有所改善。体质+1",
              "success",
            );
          },
        },
        {
          text: "😴 懒得去",
          hint: "错过免费机会",
          apply: function (st) {
            StateManager.addMessage(
              "😴 你想着反正年轻没事，就没去。但心里还是有点虚。",
              "info",
            );
          },
        },
      ],
    },
    // ====== 人情世故事件 ======
    {
      id: "old_friend_borrow",
      phase: "street",
      icon: "🤝",
      title: "老同学借钱",
      story:
        "多年没联系的老同学突然在微信上找你：「兄弟最近手头紧，能借点钱周转一下吗？下个月发工资就还你。」你翻了下聊天记录，上次说话是两年前。",
      conditions: function (st) {
        return st.player.day > 50 && st.resources.cash > 2000;
      },
      choices: [
        {
          text: "💰 借¥500",
          hint: "做好人，可能收不回",
          cost: 500,
          apply: function (st) {
            var repaid = Random.chance(0.4);
            if (repaid) {
              st.resources.cash += 600;
              StateManager.addMessage(
                "🙏 老同学真的还了，还多给了¥100当利息。你心里暖暖的。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "😤 一个月过去了，老同学再也没提还钱的事...",
                "warning",
              );
            }
          },
        },
        {
          text: "💰 借¥2000",
          hint: "大数目，高风险",
          cost: 2000,
          apply: function (st) {
            var repaid = Random.chance(0.25);
            if (repaid) {
              st.resources.cash += 2500;
              StateManager.addMessage(
                "🎉 老同学按时还了钱，还请你吃了顿饭。好人好报。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "💔 老同学失联了...你叹了口气，当交学费了。",
                "warning",
              );
            }
          },
        },
        {
          text: "❌ 婉拒",
          hint: "保护自己",
          apply: function (st) {
            StateManager.addMessage(
              "🚫 你说最近也紧张。他回了句「没事」，但之后再没联系过你。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "neighbor_gift",
      phase: "street",
      icon: "🎁",
      title: "邻居送特产",
      story:
        "楼下的阿姨敲开门，手里拎着一袋东西：「老家寄来的腊肉和干笋，给你尝尝！一个人在外打拼不容易，别总吃泡面。」",
      conditions: function (st) {
        return st.player.day > 25 && ((st.needs && st.needs.hunger) || 50) < 60;
      },
      choices: [
        {
          text: "🙏 感激收下",
          hint: "饥饱+15，幸福感+5",
          apply: function (st) {
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 15);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
            StateManager.addMessage(
              "🍖 晚上你炒了盘腊肉，香飘满屋。突然间觉得这座城市也没那么冰冷。",
              "success",
            );
          },
        },
        {
          text: "🎁 回赠一个小礼物",
          hint: "花¥50，好感再+5",
          cost: 50,
          apply: function (st) {
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 15);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
            StateManager.addMessage(
              "🍖 你送了阿姨一箱牛奶。她笑得合不拢嘴：「这孩子懂事！」",
              "success",
            );
          },
        },
        {
          text: "😐 客气几句收下",
          hint: "礼貌性回应",
          apply: function (st) {
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 10);
            StateManager.addMessage(
              "🍖 你客气了几句收下了。阿姨摆摆手：「别客气，邻里邻居的。」",
              "info",
            );
          },
        },
      ],
    },
  ]; // 新事件结束

  // 推入全局事件池
  for (var ei = 0; ei < EXTRA_EVENTS.length; ei++) {
    RANDOM_EVENTS.push(EXTRA_EVENTS[ei]);
  }
})();

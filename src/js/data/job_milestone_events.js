/**
 * 街头工作里程碑叙事事件 v1.0
 *
 * 当玩家在某个工作累计到 7/30/100 天时，触发叙事选择事件。
 * 参考：《大多数》成长感设计 / Papers Please 压力式选择 / BitLife 里程碑时刻
 *
 * 设计原则：
 *  - 峰终定律：里程碑是情感峰值，必须令玩家印象深刻
 *  - 真实中国场景：对话、人名、金额参照真实打工经历
 *  - 每次选择有后果：不做填充题，做影响资源/flag的真实决定
 *  - 三个等级：T1(熟练/7天) T2(老手/30天) T3(大师/100天)
 */

var JOB_MILESTONE_EVENTS = {
  // ==================== 废品回收 ====================
  waste_recycling: {
    t1: {
      title: "街坊认可",
      desc: "你在这片街区捡了七次废品，街坊邻里都开始认得你了。街口卖凉皮的胖大妈拍了拍你肩膀：\n\n「小伙子，我看你挺实诚的，不偷不抢。告诉你个秘密——4号楼林老师每周二把废纸箱放楼道口，5号楼每月初有废铜管。去早点，别让别人抢了。」\n\n这是这条街老江湖才知道的情报。",
      choices: [
        {
          label: "谢谢大妈，以后常过来",
          desc: "建立关系，获得稳定情报，收入+10%",
          apply: function (state) {
            state.flags._wasteRecyclingNetwork = true;
            state.flags._jobMultipliers = state.flags._jobMultipliers || {};
            state.flags._jobMultipliers["waste_recycling"] =
              (state.flags._jobMultipliers["waste_recycling"] || 1) * 1.1;
            StateManager.addMessage(
              "🗣️ 大妈的情报让你如鱼得水！废品回收收入永久+10%。",
              "success",
            );
          },
        },
        {
          label: "点头道谢，继续干活",
          desc: "保持独立，不欠人情",
          apply: function (state) {
            StateManager.addMessage(
              "你礼貌地感谢大妈，低头继续推车。踏实，是你的风格。",
              "hint",
            );
          },
        },
      ],
    },
    t2: {
      title: "回收站老板的橄榄枝",
      desc: "城西废品回收站的老刘找到了你：\n\n「我注意你有段时间了，勤快、不偷懒。我这站每天废品太多忙不过来。你愿不愿意固定给我供货？价格比市价高10%，但你得保证每天最少100斤，做不到就断合同。」\n\n固定合同意味着稳定，但你的自由就少了很多。",
      choices: [
        {
          label: "签了！稳定收入更重要",
          desc: "收入稳定+20%，但需每日完成量",
          apply: function (state) {
            state.flags._wasteRecyclingContract = true;
            state.flags.oldZhouReferred = true;
            state.flags.zhouScrapBonus = true;
            StateManager.addMessage(
              "📄 合同签了！老周回收站已解锁，废品收入稳定+20%。",
              "success",
            );
          },
        },
        {
          label: "算了，自由惯了",
          desc: "保持灵活，错过稳定",
          apply: function (state) {
            StateManager.addMessage(
              "你谢绝了老刘。每个人都有自己的活法。",
              "hint",
            );
          },
        },
      ],
    },
    t3: {
      title: "废品江湖的传承",
      desc: "100天，你认识了城东三个收购站、两个废铜铁小贩，摸透了哪个小区装修旺季最多废料。\n\n老张想退休，愿意把他摸索了十年的废品承包权以¥3000转让——包括客源和关系网。¥3000，你现在有多少？",
      choices: [
        {
          label: "接了！这是真正的投资",
          desc: "花¥3000获得完整客源网，老周回收站解锁+收入+35%",
          apply: function (state) {
            var cash = state.resources.cash || 0;
            if (cash >= 3000) {
              state.resources.cash -= 3000;
              state.flags.oldZhouReferred = true;
              state.flags.zhouScrapBonus = true;
              state.flags._jobMultipliers = state.flags._jobMultipliers || {};
              state.flags._jobMultipliers["waste_recycling"] =
                (state.flags._jobMultipliers["waste_recycling"] || 1) * 1.35;
              StateManager.addMessage(
                "🏆 你接手了老张的版图！废品收入+35%，正规回收站已解锁！",
                "success",
              );
            } else {
              StateManager.addMessage(
                "😓 你想接，但只有¥" +
                  Math.floor(cash) +
                  "，差了¥" +
                  (3000 - Math.floor(cash)) +
                  "。先去赚钱吧。",
                "warning",
              );
              state.flags._wasteRecyclingOffer = (state.player.day || 0) + 30;
            }
          },
        },
        {
          label: "干腻了，换个方向",
          desc: "放弃机会，获得额外现金+心情提升",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 200;
            state.needs.happiness = Math.min(
              100,
              (state.needs.happiness || 50) + 10,
            );
            StateManager.addMessage(
              "你谢绝了老张。¥200喝顿好的，换个赛道重新开始。",
              "hint",
            );
          },
        },
      ],
    },
  },

  // ==================== 建筑工地苦力 ====================
  manual_labor_construction: {
    t1: {
      title: "包工头的手套",
      desc: "七天，每天凌晨五点半出发，扛砖、拌混凝土、推独轮车。你的肌肉每天都在酸痛。\n\n今天包工头老李站在你旁边，沉默地看了你十分钟，扔给你一双厚手套：\n\n「把那边的新工引一引。你干过了，他们没干过。」\n\n在工地，这就是最高的认可。",
      choices: [
        {
          label: "接过手套，去带新人",
          desc: "获得小头目身份，疲劳减轻，人脉+1",
          apply: function (state) {
            state.needs.fatigue = Math.max(0, (state.needs.fatigue || 0) - 10);
            state.flags._constructionForeman = true;
            state.player.mental = Math.min(
              100,
              (state.player.mental || 10) + 3,
            );
            StateManager.addMessage(
              "🧤 工地小头目！你开始带人，疲劳-10，精神+3。",
              "success",
            );
          },
        },
        {
          label: "埋头苦干，多拿钱",
          desc: "获得额外¥60，不走管理路线",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 60;
            StateManager.addMessage(
              "💰 老李悄悄多给了你¥60辛苦费。埋头苦干，也是路。",
              "hint",
            );
          },
        },
      ],
    },
    t2: {
      title: "图纸上的字",
      desc: "一个月工地，你开始看懂一些东西——哪里要留孔，哪里要加固，图纸标注是什么意思。\n\n休息时，戴眼镜的年轻技术员教你看图纸，他说：\n\n「你这身体素质又懂现场，去考个施工员证，三年后比我薪资还高。」\n\n考证要花时间和钱，但那是这一行的升职阶梯。",
      choices: [
        {
          label: "问他怎么备考",
          desc: "获得备考路径，智力+3，李工头解锁",
          apply: function (state) {
            state.flags._constructionCertPath = true;
            state.flags.bossLiReferred = true;
            state.player.intelligence = Math.min(
              100,
              (state.player.intelligence || 10) + 3,
            );
            StateManager.addMessage(
              "📐 李工头给你指了路！智力+3，正规工程队岗位提前解锁。",
              "success",
            );
          },
        },
        {
          label: "谢谢，我只想多赚钱",
          desc: "获得¥100，不走证书路线",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 100;
            StateManager.addMessage(
              "💰 他请你喝了饮料，你们聊了一会儿。钱到手，感觉不错。",
              "hint",
            );
          },
        },
      ],
    },
    t3: {
      title: "工地老炮的选择",
      desc: "100天工地生涯。你见过太多人：新来的小年轻一周就跑了，外省老张干了八年，背驼了，攒了钱，家还是回不去。\n\n今天李工头说，正规建筑公司要招有经验的工人，工资两倍，但要签一年合同，过年不能回家。",
      choices: [
        {
          label: "签！工资翻倍值了",
          desc: "正规工程队解锁，长期高薪",
          apply: function (state) {
            state.flags.bossLiReferred = true;
            state.flags.bossLiSkillJob = true;
            StateManager.addMessage(
              "🏗️ 正规工程队已解锁！李工头给你开了路，工资翻倍！",
              "success",
            );
          },
        },
        {
          label: "过年要回家，不签",
          desc: "心情大幅提升，亲情无价",
          apply: function (state) {
            state.needs.happiness = Math.min(
              100,
              (state.needs.happiness || 50) + 20,
            );
            StateManager.addMessage(
              "🏠 家里等你回去。这个选择，以后不会后悔。心情+20。",
              "success",
            );
          },
        },
        {
          label: "试着谈谈能不能回家过年",
          desc: "销售≥20则谈成，两全其美",
          apply: function (state) {
            var salesLv =
              state.skills && state.skills.sales
                ? state.skills.sales.level || 0
                : 0;
            if (salesLv >= 20) {
              state.flags.bossLiReferred = true;
              state.flags.bossLiSkillJob = true;
              StateManager.addMessage(
                "🎉 谈成了！李工头网开一面，正规工程队解锁，过年还能回家！销售技能派上用场！",
                "success",
              );
            } else {
              StateManager.addMessage(
                "😔 你努力谈判，李工头说规定改不了。嘴皮子还不够硬，继续练销售吧。",
                "warning",
              );
            }
          },
        },
      ],
    },
  },

  // ==================== 工厂流水线 ====================
  factory_work_assembly: {
    t1: {
      title: "七天的手感",
      desc: "你的手已经不需要眼睛就知道怎么装下一个零件了。机械地重复七天后，身体记住了整套动作。\n\n隔壁的张姐休息时悄悄把纸条递给你：「下午主管不在，手快一点，能多走几件，他不会查的。」\n\n工厂的效益，有时候就藏在这些缝隙里。",
      choices: [
        {
          label: "照做，多走几件",
          desc: "70%概率+¥40，30%被发现扣薪¥20",
          apply: function (state) {
            if (typeof Random !== "undefined" && Random.chance(0.3)) {
              state.resources.cash = Math.max(
                0,
                (state.resources.cash || 0) - 20,
              );
              state.needs.happiness = Math.max(
                0,
                (state.needs.happiness || 50) - 10,
              );
              StateManager.addMessage(
                "⚠️ 主管突然回来了！被扣薪¥20，今天心情很糟糕。",
                "warning",
              );
            } else {
              state.resources.cash = (state.resources.cash || 0) + 40;
              state.flags.zhangFactoryBonus = true;
              StateManager.addMessage(
                "💰 多走了几件，偷偷多拿了¥40！张姐对你好感大增。",
                "success",
              );
            }
          },
        },
        {
          label: "按规矩来，不冒险",
          desc: "保持清白记录",
          apply: function (state) {
            StateManager.addMessage(
              "你按规矩来。流水线上，清白记录也是一种资本。",
              "hint",
            );
          },
        },
      ],
    },
    t2: {
      title: "代班组长的机会",
      desc: "你在工厂干了整整一个月，熟悉了每道工序。今天车间主任说：\n\n「下周有个老员工请假，需要有人代班管小组。¥200额外补贴，但要负责整组质检，出了问题你担责。」\n\n这是你第一次有机会'管人'。",
      choices: [
        {
          label: "接！试试管理",
          desc: "获得¥200，管理技能+25XP",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 200;
            if (state.skills && state.skills.management) {
              state.skills.management.xp =
                (state.skills.management.xp || 0) + 25;
            }
            StateManager.addMessage(
              "💼 代班成功！额外¥200到手，管理经验+25XP。上管理这条路，从这一步开始。",
              "success",
            );
          },
        },
        {
          label: "不了，安分打工",
          desc: "获得¥50慰问金，保持稳定",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 50;
            StateManager.addMessage(
              "😌 你拒绝了，主任理解，补了¥50辛苦费。安稳，也是一种选择。",
              "hint",
            );
          },
        },
      ],
    },
    t3: {
      title: "自动化的浪潮",
      desc: "你在流水线干了100天，今天工厂宣布「智能升级」，减少40%人工岗位。你的工位有50%概率被机器替代。\n\n工会代表来问你：愿不愿意接受转岗培训，学数控操作，月薪8500，但培训三个月期间只发60%工资？还是拿补偿走人？",
      choices: [
        {
          label: "接受培训，转型升级",
          desc: "三个月低薪，之后高薪技术岗，电工技能+50XP",
          apply: function (state) {
            state.flags._factoryReskilling = true;
            if (state.skills && state.skills.electrician) {
              state.skills.electrician.xp =
                (state.skills.electrician.xp || 0) + 50;
            }
            state.player.intelligence = Math.min(
              100,
              (state.player.intelligence || 10) + 5,
            );
            StateManager.addMessage(
              "🤖 转型培训开始！电工技能+50XP，智力+5。三个月后工资大幅提升！",
              "success",
            );
          },
        },
        {
          label: "拿补偿，另谋出路",
          desc: "获得一次性补偿¥1800，重新出发",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 1800;
            StateManager.addMessage(
              "💰 你拿了¥1800补偿，走出了陪伴100天的车间。重新出发。",
              "hint",
            );
          },
        },
      ],
    },
  },

  // ==================== 摆摊卖小吃 ====================
  street_vending_food: {
    t1: {
      title: "第一个回头客",
      desc: "你在路口摆了七天摊。大多数人走过，视而不见。\n\n今天下午，一个穿校服的女孩跑来问：「叔叔/阿姨，还有昨天那个辣条串串吗？真的好吃！」\n\n她是你的第一个回头客。你突然意识到——这个角落正在成为某些人的目的地，而不只是路过。",
      choices: [
        {
          label: "给她打个折，留住回头客",
          desc: "建立口碑，摊位收入永久+10%",
          apply: function (state) {
            state.resources.cash = Math.max(0, (state.resources.cash || 0) - 3);
            state.flags._vendingLoyalty = true;
            state.flags._jobMultipliers = state.flags._jobMultipliers || {};
            state.flags._jobMultipliers["street_vending_food"] =
              (state.flags._jobMultipliers["street_vending_food"] || 1) * 1.1;
            StateManager.addMessage(
              "❤️ 口碑建立！摆摊收入永久+10%。一个回头客的价值，不止三块钱。",
              "success",
            );
          },
        },
        {
          label: "正常卖，生意就是生意",
          desc: "维护商业原则，获得小费",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 5;
            StateManager.addMessage(
              "你笑着正常售卖，女孩额外塞了5块。做生意要有原则，这没错。",
              "hint",
            );
          },
        },
      ],
    },
    t2: {
      title: "隔壁摊的老关",
      desc: "隔壁卖糖葫芦的老关，在这里摆了八年了。他来找你：\n\n「我准备进批新货，资金差¥800。你借我先，下个月还你¥1000，不骗你。」\n\n老关人实在，你观察过，生意也算稳定。但¥800对你现在也不是小数。",
      choices: [
        {
          label: "借他，信任是有价值的",
          desc: "借出¥800，30天后收回¥1000，老关成为固定客源",
          apply: function (state) {
            var cash = state.resources.cash || 0;
            if (cash >= 800) {
              state.resources.cash -= 800;
              state.flags._loanToLaoGuan = (state.player.day || 0) + 30;
              state.flags._laoGuanFriend = true;
              StateManager.addMessage(
                "🤝 你借给了老关¥800。30天后¥1000回来，还有个真朋友。",
                "hint",
              );
            } else {
              StateManager.addMessage(
                "😓 你想借，但只有¥" +
                  Math.floor(cash) +
                  "，不够。老关理解，摆摆手走了。",
                "warning",
              );
            }
          },
        },
        {
          label: "手头紧，帮不了",
          desc: "守住资金，保持安全",
          apply: function (state) {
            StateManager.addMessage(
              "你解释了自己的困难。老关理解，拍拍你肩膀走了。",
              "hint",
            );
          },
        },
      ],
    },
    t3: {
      title: "餐厅老板的眼光",
      desc: "摆摊100天，你的串串在附近小有名气。一个中年男人连续三天来买，今天开门见山：\n\n「你这配方不错。我想买断一年使用权，¥5000现结。或者你来我餐厅当大厨，月薪¥4000，包吃住。」",
      choices: [
        {
          label: "卖配方，¥5000落袋",
          desc: "一次性获得¥5000，继续自由摆摊",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 5000;
            StateManager.addMessage(
              "💰 你卖出了配方，¥5000现结。这个口味一年内只属于他的餐厅了。",
              "hint",
            );
          },
        },
        {
          label: "去当大厨，稳定月薪",
          desc: "解锁陈师傅帮厨，转型正式厨师路径",
          apply: function (state) {
            state.flags.chefChenAssistant = true;
            StateManager.addMessage(
              "👨‍🍳 厨师之路开启！陈师傅帮厨岗位已解锁，稳定月薪等着你。",
              "success",
            );
          },
        },
        {
          label: "什么都不要，摊是我的骄傲",
          desc: "心情大幅提升，摊位收入+15%",
          apply: function (state) {
            state.needs.happiness = Math.min(
              100,
              (state.needs.happiness || 50) + 15,
            );
            state.flags._jobMultipliers = state.flags._jobMultipliers || {};
            state.flags._jobMultipliers["street_vending_food"] =
              (state.flags._jobMultipliers["street_vending_food"] || 1) * 1.15;
            StateManager.addMessage(
              "🏪 你的摊，你的骄傲！心情+15，摊位收入永久+15%。",
              "success",
            );
          },
        },
      ],
    },
  },

  // ==================== 外卖骑手 ====================
  delivery_rider: {
    t1: {
      title: "金牌骑手认证",
      desc: "平台消息：\n\n「🏆 恭喜！您已完成七次配送，准时率达标，平台升级您为【金牌骑手】。单笔抽成从8%提升至9%。」\n\n这座城市的街道，正在一点一点向你敞开。每一条捷径，你都记着。",
      choices: [
        {
          label: "继续冲单，追求钻石级",
          desc: "外卖收入永久+8%",
          apply: function (state) {
            state.flags._jobMultipliers = state.flags._jobMultipliers || {};
            state.flags._jobMultipliers["delivery_rider"] =
              (state.flags._jobMultipliers["delivery_rider"] || 1) * 1.08;
            StateManager.addMessage(
              "🛵 金牌骑手！外卖收入永久+8%！冲！",
              "success",
            );
          },
        },
        {
          label: "量力而为，别累坏身体",
          desc: "疲劳-8，稳健路线",
          apply: function (state) {
            state.needs.fatigue = Math.max(0, (state.needs.fatigue || 0) - 8);
            StateManager.addMessage(
              "😌 身体最重要。你决定按自己的节奏来，疲劳-8。",
              "hint",
            );
          },
        },
      ],
    },
    t2: {
      title: "常客老李的名片",
      desc: "送餐30天，你发现某小区3楼的老李几乎每天点同一家饭。有天他下楼来接单，递给你一盒烟：\n\n「你骑车认真，从不晚点。我在一家物流公司当主管。你要不要来做专职司机？稳定多了，不用看天气吃饭。」",
      choices: [
        {
          label: "考虑一下，要名片",
          desc: "获得物流转职机会，随时可用",
          apply: function (state) {
            state.flags._logisticsJobOffer = true;
            StateManager.addMessage(
              "📇 老李的名片揣好了。物流专职司机这条路，随时可以走。",
              "hint",
            );
          },
        },
        {
          label: "谢谢，骑手挺自由的",
          desc: "心情大幅提升，继续骑手路",
          apply: function (state) {
            state.needs.happiness = Math.min(
              100,
              (state.needs.happiness || 50) + 10,
            );
            StateManager.addMessage(
              "😄 你骑上车，风吹着，确实挺自由的。心情+10。",
              "success",
            );
          },
        },
      ],
    },
    t3: {
      title: "骑手站长的邀请",
      desc: "100天，无数次风雨中飞驰。平台区域运营找到你：\n\n「我们要在这个区开骑手服务站，管理20个骑手。底薪¥5500+管理奖金。有没有兴趣？」\n\n当骑手变成站长，失去风里来雨里去的自由，却换来了更高的位置。",
      choices: [
        {
          label: "做站长！向上走",
          desc: "转型管理路径，管理技能+80XP",
          apply: function (state) {
            state.flags._deliveryStationManager = true;
            if (state.skills && state.skills.management) {
              state.skills.management.xp =
                (state.skills.management.xp || 0) + 80;
            }
            StateManager.addMessage(
              "🏆 骑手站长诞生！管理技能+80XP，走向物流管理路径！",
              "success",
            );
          },
        },
        {
          label: "我永远是骑手",
          desc: "拒绝但平台给涨薪，收入+15%",
          apply: function (state) {
            state.flags._jobMultipliers = state.flags._jobMultipliers || {};
            state.flags._jobMultipliers["delivery_rider"] =
              (state.flags._jobMultipliers["delivery_rider"] || 1) * 1.15;
            StateManager.addMessage(
              "🛵 你拒绝了站长职位。作为补偿，平台给你永久提薪+15%。不错！",
              "success",
            );
          },
        },
      ],
    },
  },

  // ==================== 家教辅导 ====================
  tutoring: {
    t1: {
      title: "第一个进步的孩子",
      desc: "你辅导的第一个学生——初一的小明——今天数学考了74分。上次是52分。\n\n他妈妈接他时握了握你的手，眼睛里有水光：「谢谢你，他以前从来不肯写作业。」\n\n钱以外的东西，你第一次感受到了。",
      choices: [
        {
          label: "更用心投入，提升质量",
          desc: "智力+3，口碑建立，家教收入+10%",
          apply: function (state) {
            state.player.intelligence = Math.min(
              100,
              (state.player.intelligence || 10) + 3,
            );
            state.flags._tutoringReputation = true;
            state.flags._jobMultipliers = state.flags._jobMultipliers || {};
            state.flags._jobMultipliers["tutoring"] =
              (state.flags._jobMultipliers["tutoring"] || 1) * 1.1;
            StateManager.addMessage(
              "📚 口碑教师！智力+3，家教收入永久+10%。真正的成就感。",
              "success",
            );
          },
        },
        {
          label: "做好本分就行",
          desc: "获得¥100打赏",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 100;
            StateManager.addMessage(
              "💰 妈妈额外给了¥100感谢费。专业服务，值得回报。",
              "hint",
            );
          },
        },
      ],
    },
    t2: {
      title: "培训机构的邀请",
      desc: "一家教培机构的招聘官加了你微信：\n\n「您的学生进步案例在家长群里传开了。我们提供生源，您只要教——每周两节，1小时¥150，保底每月¥2000。但需要按我们课纲走。」",
      choices: [
        {
          label: "加入机构，提高收入",
          desc: "精英家教岗解锁，时薪翻倍",
          apply: function (state) {
            state.flags.xiaoMeiReferred = true;
            StateManager.addMessage(
              "🎓 精英家教岗解锁！机构引荐，时薪翻倍。教育路径提速！",
              "success",
            );
          },
        },
        {
          label: "继续散单，保持自主",
          desc: "独立教学，师生关系更真实",
          apply: function (state) {
            state.needs.happiness = Math.min(
              100,
              (state.needs.happiness || 50) + 8,
            );
            StateManager.addMessage(
              "你拒绝了机构。你喜欢真实地陪伴每个孩子，而不是流水线。心情+8。",
              "hint",
            );
          },
        },
      ],
    },
    t3: {
      title: "高考季的重托",
      desc: "你辅导了整整100次课。三个高中生家长联合找到你：\n\n「孩子明年高考，希望你专程陪冲刺三个月。每月¥8000，吃住在家里。无论结果如何，承诺兑现。」",
      choices: [
        {
          label: "接了，全身心投入",
          desc: "三个月后获得¥24000，教育技能大跃升",
          apply: function (state) {
            state.flags._gaokaoTutoring = true;
            state.flags._pendingGaokaoBonus = (state.player.day || 0) + 90;
            if (state.skills && state.skills.english) {
              state.skills.english.xp = (state.skills.english.xp || 0) + 60;
            }
            StateManager.addMessage(
              "📖 高考冲刺任务接下！90天后¥24000到账，英语技能大幅提升。",
              "success",
            );
          },
        },
        {
          label: "介绍同行，赚中介费",
          desc: "¥500中介费，保持现有节奏",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 500;
            StateManager.addMessage(
              "💰 你介绍了同行，赚了¥500中介费。搭桥也是能力。",
              "hint",
            );
          },
        },
      ],
    },
  },

  // ==================== 内容创作者 ====================
  content_writing: {
    t1: {
      title: "一万次阅读",
      desc: "你写的文章达到了10000次阅读。后台显示有人收藏、有人转发，留言里有人写「终于有人写到我心里去了」。\n\n你的第七篇，也是第一篇破万的。手悬在键盘上，你意识到：这件事，你可能真的能做。",
      choices: [
        {
          label: "继续写，专注质量",
          desc: "名气+5，英语技能+25XP，写作收入+10%",
          apply: function (state) {
            state.player.fame = Math.min(100, (state.player.fame || 0) + 5);
            if (state.skills && state.skills.english) {
              state.skills.english.xp = (state.skills.english.xp || 0) + 25;
            }
            state.flags._jobMultipliers = state.flags._jobMultipliers || {};
            state.flags._jobMultipliers["content_writing"] =
              (state.flags._jobMultipliers["content_writing"] || 1) * 1.1;
            StateManager.addMessage(
              "✍️ 破万爆文！名气+5，英语技能+25XP，写作收入永久+10%！",
              "success",
            );
          },
        },
        {
          label: "接广告变现",
          desc: "一次性¥300，短期变现",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 300;
            StateManager.addMessage(
              "💰 第一个广告合作，¥300到账。内容和商业，永远是个平衡。",
              "hint",
            );
          },
        },
      ],
    },
    t2: {
      title: "平台独家签约",
      desc: "一个头部内容平台发来邀请：\n\n「您的内容质量优秀，希望独家合作。保底每月¥2000，另享流量分成。」\n\n独家意味着不能多平台分发，但收入有了保底。",
      choices: [
        {
          label: "签了，稳定优先",
          desc: "每月额外+¥2000保底",
          apply: function (state) {
            state.flags._contentPlatformSigned = true;
            state.resources.cash = (state.resources.cash || 0) + 2000;
            StateManager.addMessage(
              "📱 签约成功！首月保底¥2000已到账，稳定收入来了。",
              "success",
            );
          },
        },
        {
          label: "多平台铺货，不独家",
          desc: "名气+8，长期收益更高",
          apply: function (state) {
            state.player.fame = Math.min(100, (state.player.fame || 0) + 8);
            StateManager.addMessage(
              "📊 你拒绝独家。多平台分发，名气+8，长期赢在内容。",
              "hint",
            );
          },
        },
      ],
    },
    t3: {
      title: "MCN公司的offer",
      desc: "一家MCN公司找到你：「¥10000买断IP使用权一年，同时聘你为签约作者，月薪¥6000起。」\n\n你从自由创作者变成公司员工——有保障，但失去对内容的完全控制权。",
      choices: [
        {
          label: "加入MCN，职业化",
          desc: "获得¥10000+月薪6000，内容创作职业化",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 10000;
            state.flags._mcnEmployee = true;
            StateManager.addMessage(
              "🏢 MCN签约！¥10000到账，月薪6000，内容创作走向职业化。",
              "success",
            );
          },
        },
        {
          label: "保持独立，靠名气",
          desc: "名气+15，写作收入+20%",
          apply: function (state) {
            state.player.fame = Math.min(100, (state.player.fame || 0) + 15);
            state.flags._jobMultipliers = state.flags._jobMultipliers || {};
            state.flags._jobMultipliers["content_writing"] =
              (state.flags._jobMultipliers["content_writing"] || 1) * 1.2;
            StateManager.addMessage(
              "🌟 保持独立！名气+15，写作收入永久+20%。内容人的尊严！",
              "success",
            );
          },
        },
      ],
    },
  },

  // ==================== 街头表演 ====================
  busking: {
    t1: {
      title: "路人停留的五块钱",
      desc: "你在天桥上唱了七天。大多数人走过，视而不见。\n\n今天，一个抱孩子的年轻妈妈停下来，孩子拍着手笑，妈妈往罐子里放了五块钱，说：「唱得挺好听的。」\n\n五块钱，但你感觉超过了这个数字。",
      choices: [
        {
          label: "为这个孩子多唱了一首",
          desc: "心情+20，精神+5，名气+3",
          apply: function (state) {
            state.needs.happiness = Math.min(
              100,
              (state.needs.happiness || 50) + 20,
            );
            state.player.mental = Math.min(
              100,
              (state.player.mental || 10) + 5,
            );
            state.player.fame = Math.min(100, (state.player.fame || 0) + 3);
            StateManager.addMessage(
              "🎵 你为孩子多唱了一首。心情+20，精神+5，名气+3。这就是音乐的意义。",
              "success",
            );
          },
        },
        {
          label: "专注演出，按计划来",
          desc: "收入+¥20，保持专业",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 20;
            StateManager.addMessage(
              "🎸 你保持专注，今天收入多了¥20。专业就是专业。",
              "hint",
            );
          },
        },
      ],
    },
    t2: {
      title: "餐厅驻唱邀请",
      desc: "隔壁餐厅老板来找你：「每周五晚上来我这驻唱，4小时，¥300，包两顿饭。」\n\n告别风吹日晒，有了场地和稳定收入，但街头那种自由感就不同了。",
      choices: [
        {
          label: "接了，室内演出更体面",
          desc: "演出收入永久+25%",
          apply: function (state) {
            state.flags._buskingVenue = true;
            state.flags._jobMultipliers = state.flags._jobMultipliers || {};
            state.flags._jobMultipliers["busking"] =
              (state.flags._jobMultipliers["busking"] || 1) * 1.25;
            StateManager.addMessage(
              "🎙️ 餐厅驻唱签约！演出收入永久+25%。",
              "success",
            );
          },
        },
        {
          label: "街头才是我的舞台",
          desc: "名气+8，坚持自我",
          apply: function (state) {
            state.player.fame = Math.min(100, (state.player.fame || 0) + 8);
            StateManager.addMessage(
              "🎸 你谢绝了餐厅。街头是你的舞台，名气+8。继续。",
              "hint",
            );
          },
        },
      ],
    },
    t3: {
      title: "互联网时代的街头",
      desc: "100天，风里来雨里去，你在这座城市留下了印记。一个做视频的年轻人把你的演出剪成短视频，意外地有十万播放。\n\n现在有人出¥5000买你一首原创歌词版权，还有选秀节目邀请你参加——不保证结果，但会扩大影响力。",
      choices: [
        {
          label: "卖歌词版权，实际",
          desc: "¥5000现金+名气+3",
          apply: function (state) {
            state.resources.cash = (state.resources.cash || 0) + 5000;
            state.player.fame = Math.min(100, (state.player.fame || 0) + 3);
            StateManager.addMessage(
              "💰 你卖出了第一首歌词版权，¥5000到手，名气+3。",
              "success",
            );
          },
        },
        {
          label: "参加选秀，赌一把",
          desc: "30%概率名气+30，70%概率只是经历",
          apply: function (state) {
            if (typeof Random !== "undefined" && Random.chance(0.3)) {
              state.player.fame = Math.min(100, (state.player.fame || 0) + 30);
              state.needs.happiness = Math.min(
                100,
                (state.needs.happiness || 50) + 25,
              );
              StateManager.addMessage(
                "🌟 你在选秀中脱颖而出！名气暴增+30，正式进入大众视野！",
                "success",
              );
            } else {
              state.needs.fatigue = Math.min(
                100,
                (state.needs.fatigue || 0) + 15,
              );
              StateManager.addMessage(
                "😔 选秀没有结果。但你演出了，这段经历是真实的。继续走。",
                "hint",
              );
            }
          },
        },
        {
          label: "什么都不要，纯粹街头",
          desc: "名气+10，心情大幅提升",
          apply: function (state) {
            state.player.fame = Math.min(100, (state.player.fame || 0) + 10);
            state.needs.happiness = Math.min(
              100,
              (state.needs.happiness || 50) + 15,
            );
            StateManager.addMessage(
              "🎸 你拒绝了所有。名气+10，心情+15。纯粹，是你的答案。",
              "success",
            );
          },
        },
      ],
    },
  },

  // ==================== 银行保安 ====================
  bank_security: {
    t1: {
      title: "上司的认可",
      desc: "你在银行门口站了七天，认真、准时、仪容整洁。今天保安队长路过时停下来：\n\n「不错，有职业素养。我记住你了。」\n\n在保安这一行，被记住，就是往上走的开始。",
      choices: [
        {
          label: "谢谢队长，继续努力",
          desc: "收入+5%，职业晋升积分",
          apply: function (state) {
            state.flags._jobMultipliers = state.flags._jobMultipliers || {};
            state.flags._jobMultipliers["bank_security"] =
              (state.flags._jobMultipliers["bank_security"] || 1) * 1.05;
            state.needs.happiness = Math.min(
              100,
              (state.needs.happiness || 50) + 8,
            );
            StateManager.addMessage(
              "👮 队长记住了你！保安收入+5%，心情+8。",
              "success",
            );
          },
        },
        {
          label: "淡然应对，本分做事",
          desc: "继续日常，保持稳定",
          apply: function (state) {
            StateManager.addMessage(
              "你点点头，继续站岗。踏实，是最好的表态。",
              "hint",
            );
          },
        },
      ],
    },
    t2: {
      title: "存款的启发",
      desc: "银行保安干了一个月，你每天看着人来人往——有人存几十万，有人取几百块，有人焦虑，有人淡定。\n\n今天一个老人存了一笔钱，说：「我每个月从工资里存20%，存了三十年，现在不慌了。」\n\n你想到了自己的账户。",
      choices: [
        {
          label: "现在就开始强制储蓄",
          desc: "立即存入¥500到银行，养成储蓄习惯",
          apply: function (state) {
            var cash = state.resources.cash || 0;
            var deposit = Math.min(500, cash);
            if (deposit > 0) {
              state.resources.cash -= deposit;
              state.resources.bankDeposit =
                (state.resources.bankDeposit || 0) + deposit;
              StateManager.addMessage(
                "🏦 你存入了¥" + deposit + "到银行！储蓄习惯从今天开始。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "😓 账户里没有余额了，这个月先努力赚钱吧。",
                "warning",
              );
            }
          },
        },
        {
          label: "先花着，以后再说",
          desc: "继续当下，不改变习惯",
          apply: function (state) {
            StateManager.addMessage(
              "老人的话你记在心里了，但还不急。以后再说。",
              "hint",
            );
          },
        },
      ],
    },
    t3: {
      title: "升班长的机会",
      desc: "你在银行保安干了100天，无一次迟到，无一次失职。银行HR找你谈话：\n\n「我们要设一个班长岗位，统筹3名保安，月薪¥5500，但要处理各种突发情况，责任更大。」",
      choices: [
        {
          label: "接！向上走",
          desc: "收入大幅提升，管理技能+50XP",
          apply: function (state) {
            state.flags._jobMultipliers = state.flags._jobMultipliers || {};
            state.flags._jobMultipliers["bank_security"] =
              (state.flags._jobMultipliers["bank_security"] || 1) * 1.4;
            if (state.skills && state.skills.management) {
              state.skills.management.xp =
                (state.skills.management.xp || 0) + 50;
            }
            StateManager.addMessage(
              "👮 班长上任！保安收入+40%，管理技能+50XP。从这里出发。",
              "success",
            );
          },
        },
        {
          label: "本分继续，不想担责",
          desc: "安稳，但错过晋升",
          apply: function (state) {
            StateManager.addMessage(
              "你谢绝了班长岗，继续按自己的节奏站岗。安稳是一种选择。",
              "hint",
            );
          },
        },
      ],
    },
  },
};

/**
 * 检查并触发工作里程碑叙事事件
 * @param {string} jobId
 * @param {number} newTier - 新的称号等级（1/2/3）
 * @param {Object} state
 */
function checkJobMilestoneEvent(jobId, newTier, state) {
  if (typeof JOB_MILESTONE_EVENTS === "undefined") return;
  var events = JOB_MILESTONE_EVENTS[jobId];
  if (!events) return;

  var tierKey = "t" + newTier;
  var ev = events[tierKey];
  if (!ev) return;

  if (typeof showModal !== "function") return;

  var tierIcons = { 1: "📋", 2: "🎖️", 3: "👑" };
  var tierLabels = { 1: "熟练工", 2: "资深老手", 3: "职业大师" };

  var buttons = ev.choices.map(function (choice) {
    return {
      text: choice.label,
      callback: function () {
        try {
          choice.apply(state);
        } catch (e) {
          console.warn("里程碑事件apply异常", e);
        }
      },
    };
  });

  var fullTitle =
    (tierIcons[newTier] || "") +
    " " +
    ev.title +
    " ·【" +
    (tierLabels[newTier] || "") +
    "】";
  showModal(fullTitle, ev.desc, buttons);
}

// 挂载到 window
if (typeof window !== "undefined") {
  window.JOB_MILESTONE_EVENTS = JOB_MILESTONE_EVENTS;
  window.checkJobMilestoneEvent = checkJobMilestoneEvent;
}

# -*- coding: utf-8 -*-
import os

events_js_path = "D:/Claude Code+DeepSeekV4/city-life-story/src/js/core/events.js"

with open(events_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# Build the events code
events = []

# ===================== ① 泛互联网·电商（6个） =====================

events.append("""
  {
    id: "shopping_festival",
    phase: "street",
    icon: "\U0001f389",
    title: "购物狂欢节来了",
    story: "铺天盖地的广告：「双11狂欢，全场五折！」批发市场里进货的人跟不要钱一样疯抢。但快递站贴出了急招临时工的大字报——日结¥280，干到凌晨两点。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 10 && !st.flags._shoppingFestSeen && st.player.day % 30 >= 8 && st.player.day % 30 <= 12;
    },
    choices: [
      { text: "\U0001f4b0 进货囤货等涨价", hint: "¥3000进货，7天后卖出预计赚40%", apply: function(st) {
        st.flags._shoppingFestSeen = true;
        st.flags._shoppingFestDeal = "stock";
        st.resources.cash -= 3000;
        st.flags._shoppingStockDay = st.player.day;
        StateManager.addMessage("\U0001f389 囤了一批货，等节后涨价卖。存货价值¥4200。", "event");
      }},
      { text: "\U0001f4e6 去快递站做临时工", hint: "¥280/天，消耗15AP", apply: function(st) {
        st.flags._shoppingFestSeen = true;
        st.resources.cash += 280;
        st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
        st.needs.hunger = Math.max(0, st.needs.hunger - 8);
        StateManager.addMessage("\U0001f4e6 干到凌晨两点，腰快断了。但钱是真的。", "info");
      }},
      { text: "\U0001f6d2 趁打折给自己买点好的", hint: "心情+15，花¥200", apply: function(st) {
        st.flags._shoppingFestSeen = true;
        st.resources.cash -= 200;
        st.needs.happiness = Math.min(100, st.needs.happiness + 15);
        StateManager.addMessage("\U0001f6d2 买了一套新衣服和一双鞋。好久没这么开心了。", "success");
      }},
    ],
  },""")

events.append("""
  {
    id: "p2p_crash",
    phase: "street",
    icon: "\U0001f4b8",
    title: "全民贷跑路了",
    story: "你刷到一条新闻——「全民贷」爆雷，涉及金额¥80亿，线下门店被愤怒的老年人围得水泄不通。有人在门口拉横幅，有人蹲在地上哭。群里有人说内部消息：实际控制人已经飞加拿大。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 30 && !st.flags._p2pCrashSeen && st.resources.cash >= 500;
    },
    choices: [
      { text: "\U0001f630 去现场看看能不能低价收购债权", hint: "¥5000收¥30000债权，可能打水漂", apply: function(st) {
        st.flags._p2pCrashSeen = true;
        if (st.resources.cash >= 5000) {
          st.flags._p2pInvested = true;
          st.resources.cash -= 5000;
          st.flags._p2pDebtDay = st.player.day;
          StateManager.addMessage("\U0001f4b8 你用¥5000收了一张¥30000的债权。也许能要回来，也许打了水漂。", "event");
        } else {
          st.flags._p2pWatched = true;
          StateManager.addMessage("\U0001f440 你围观了一天，什么都没做。有个大妈哭得站不住。", "info");
        }
      }},
      { text: "\U0001f4e2 帮维权群众写联名信", hint: "名气+5，耗时15AP", apply: function(st) {
        st.flags._p2pCrashSeen = true;
        st.flags._p2pHelped = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
        st.player.actionPoints -= 15;
        StateManager.addMessage("\U0001f4e2 你帮老人们写了投诉信。有人拉着你的手说谢谢。", "event");
      }},
      { text: "\U0001f6b6 看一眼就走了", hint: "事不关己", apply: function(st) {
        st.flags._p2pCrashSeen = true;
        StateManager.addMessage("\U0001f4b8 不是你的事。但回家的路上心里堵得慌。", "info");
      }},
    ],
  },""")

events.append("""
  {
    id: "sharing_economy_bubble",
    phase: "street",
    icon: "\U0001f6b2",
    title: "共享单车坟场",
    story: "城郊的空地上堆满了五颜六色的共享单车——橙色、黄色、蓝色，层层叠叠像一座钢铁坟场。押金退了三个月还没到账。但有人在回收这些废铁，一辆¥15。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 20 && !st.flags._sharingEconomySeen;
    },
    choices: [
      { text: "♻️ 回收废铁赚差价", hint: "15AP，预计赚¥200-400", apply: function(st) {
        st.flags._sharingEconomySeen = true;
        st.needs.fatigue = Math.min(100, st.needs.fatigue + 12);
        var earn = 200 + Math.floor(Math.random() * 200);
        st.resources.cash += earn;
        st.needs.hygiene = Math.max(0, st.needs.hygiene - 5);
        StateManager.addMessage("♻️ 拆了一下午单车，卖了¥" + earn + "。手上全是铁锈味。", "info");
      }},
      { text: "\U0001f4f1 注册运维兼职", hint: "巡逻摆放单车，日薪¥150", apply: function(st) {
        st.flags._sharingEconomySeen = true;
        st.flags._sharingJobUnlocked = true;
        StateManager.addMessage("\U0001f4f1 注册了共享单车运维。把这当作全职也行，月入¥3500。", "event");
      }},
      { text: "\U0001f624 在群里骂押金不退", hint: "爽但不解决问题", apply: function(st) {
        st.flags._sharingEconomySeen = true;
        st.needs.happiness = Math.min(100, st.needs.happiness + 5);
        StateManager.addMessage("\U0001f624 骂完了，押金还是没退。", "info");
      }},
    ],
  },""")

events.append("""
  {
    id: "big_tech_layoff",
    phase: "street",
    icon: "\U0001f3e2",
    title: "大厂毕业季",
    story: "你刷到一篇推送——「辰光网络Q2财报不及预期，裁员30%」。写字楼门口有抱着纸箱出来的人，有人西装革履站在路边抽烟发呆。二手平台上突然多了一批99新的MacBook Pro和人体工学椅。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 40 && !st.flags._bigTechLayoffSeen;
    },
    choices: [
      { text: "\U0001f4bb 低价收购被裁员工的设备", hint: "¥3000收MacBook，转手可卖¥5000", apply: function(st) {
        st.flags._bigTechLayoffSeen = true;
        if (st.resources.cash >= 3000) {
          st.resources.cash -= 3000;
          st.flags._layoffGear = true;
          st.flags._layoffGearDay = st.player.day;
          StateManager.addMessage("\U0001f4bb 收到一台99新的MacBook Pro和一把赫曼米勒。转手能赚¥2000。", "event");
        } else {
          StateManager.addMessage("\U0001f4bb 看了一圈好东西但买不起。有个大哥问你要不要他的显示器，¥200。", "info");
          if (st.resources.cash >= 200) {
            st.resources.cash -= 200;
            st.flags._layoffCheapGear = true;
            StateManager.addMessage("\U0001f5a5️ 捡漏了一台27寸显示器，自己用也行卖了也行。", "info");
          }
        }
      }},
      { text: "\U0001f4de 问有没有内推机会", hint: "高风险高回报", apply: function(st) {
        st.flags._bigTechLayoffSeen = true;
        st.flags._layoffAskedForReferral = true;
        StateManager.addMessage("\U0001f4de 被裁的人苦笑着：「我自己都没着落呢。」给了你一张名片：「下个月我可能在新公司。」", "event");
      }},
      { text: "\U0001f3ea 去写字楼门口卖盒饭", hint: "总得吃饭", apply: function(st) {
        st.flags._bigTechLayoffSeen = true;
        st.needs.fatigue = Math.min(100, st.needs.fatigue + 8);
        st.resources.cash += 180;
        StateManager.addMessage("\U0001f3ea 你推着小车过去。被裁的人买盒饭不还价——他们没心情。", "info");
      }},
    ],
  },""")

events.append("""
  {
    id: "tech_996_debate",
    phase: "street",
    icon: "⏰",
    title: "取消大小周",
    story: "新闻炸了——「橙象集团取消大小周，员工月薪普降15%」。群里吵翻了：有人说时薪没变爽啊，有人说降薪了房贷怎么办。楼下便利店老板叹气：「大厂不加班了，夜里没人买夜宵了。」",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 35 && !st.flags._tech996Seen;
    },
    choices: [
      { text: "\U0001f389 高兴——可以找正常下班的朋友玩", hint: "心情+10", apply: function(st) {
        st.flags._tech996Seen = true;
        st.needs.happiness = Math.min(100, st.needs.happiness + 10);
        StateManager.addMessage("\U0001f389 你发消息给在大厂的同学：「以后能约晚饭了！」他回了个苦笑表情。", "success");
      }},
      { text: "\U0001f4e6 以后少进点夜宵货", hint: "便利店夜宵需求下降", apply: function(st) {
        st.flags._tech996Seen = true;
        st.flags._nightMarketDecline = true;
        StateManager.addMessage("\U0001f4e6 你减少了夜宵进货。这附近的夜经济要冷一阵了。", "info");
      }},
      { text: "\U0001f4bc 投简历——大厂现在WLB了", hint: "开启一条新路线", apply: function(st) {
        st.flags._tech996Seen = true;
        st.flags._techWLBFactor = true;
        StateManager.addMessage("\U0001f4bc 你更新了简历。也许这是个进大厂的好时机。", "event");
      }},
    ],
  },""")

events.append("""
  {
    id: "china_stock_delist",
    phase: "street",
    icon: "\U0001f4c9",
    title: "中概股退市风暴",
    story: "「审计底稿」争端升级，美股市场的中国公司集体面临退市。新闻里专家的嘴一张一合：「对业务没有实质影响。」但股价已经跌了70%。有朋友说他老板之前套现了¥3000万——现在人在新加坡。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 50 && !st.flags._chinaDelistSeen;
    },
    choices: [
      { text: "\U0001f4c8 抄底中概股ETF", hint: "高风险投资，¥2000起", apply: function(st) {
        st.flags._chinaDelistSeen = true;
        if (st.resources.cash >= 2000) {
          st.resources.cash -= 2000;
          st.flags._chinaDelistBought = true;
          st.flags._chinaDelistDay = st.player.day;
          StateManager.addMessage("\U0001f4c8 你在最低点买了中概ETF。可能是抄底，可能是接飞刀。", "event");
        } else {
          StateManager.addMessage("\U0001f4c8 想抄底但没钱。你第一次感受到：「机会来了没钱也是一种痛苦。」", "info");
        }
      }},
      { text: "\U0001f4bc 找机会进回港上市的公司", hint: "有些公司回港二次上市在招人", apply: function(st) {
        st.flags._chinaDelistSeen = true;
        st.flags._hkListJobChance = true;
        StateManager.addMessage("\U0001f4bc 有猎头在群里发了几个香港职位。你不一定够格，但值得一试。", "event");
      }},
      { text: "\U0001f9fd 吃瓜看戏", hint: "什么都不做", apply: function(st) {
        st.flags._chinaDelistSeen = true;
        StateManager.addMessage("\U0001f4c9 你关了新闻。这些离你太远了——你今天的晚饭还没着落。", "info");
      }},
    ],
  },""")

# ===================== ② 房地产与城市发展（7个） =====================

events.append("""
  {
    id: "demolition_fortune",
    phase: "street",
    icon: "\U0001f3da️",
    title: "拆迁公告",
    story: "村口的公告栏贴了一张红头文件——「新城街道旧改项目征收公告」。20年的老房子，按补偿方案能赔¥120万或一套安置房。老李头拿着公告手在抖：「等了15年，终于等到了。」但旁边有人悄悄说：「现在签字亏了，等多三个月至少多赔30%。」",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 60 && !st.flags._demolitionSeen;
    },
    choices: [
      { text: "\U0001f3e1 劝邻居早签早拿钱", hint: "稳妥派，邻居感谢你得人情", apply: function(st) {
        st.flags._demolitionSeen = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
        StateManager.addMessage("\U0001f3e1 你劝老李签字。他请你吃了顿饭：「小伙子实在人。」", "event");
      }},
      { text: "\U0001f4b0 赌一把——借钱买公告范围内的老房子", hint: "高风险投机，需要¥5万首付", apply: function(st) {
        st.flags._demolitionSeen = true;
        if (st.resources.cash >= 50000) {
          st.resources.cash -= 50000;
          st.flags._demolitionGambled = true;
          st.flags._demolitionDay = st.player.day;
          StateManager.addMessage("\U0001f4b0 你签了合同买下一间20平的老房。赌拆迁——要么翻倍，要么砸手里。", "event");
        } else {
          StateManager.addMessage("\U0001f4b0 你算了算存款，不够首付。拆迁暴富的梦破灭了。", "info");
        }
      }},
      { text: "\U0001f3ea 进一批装修材料来卖", hint: "拆迁片区装修需求大", apply: function(st) {
        st.flags._demolitionSeen = true;
        if (st.resources.cash >= 2000) {
          st.resources.cash -= 2000;
          st.flags._demolitionSupply = true;
          StateManager.addMessage("\U0001f3ea 你进了水泥和瓷砖。拆迁户装修总得买东西吧。", "event");
        } else {
          StateManager.addMessage("\U0001f3ea 连进货的钱都没有。你蹲在路边看别人忙活。", "info");
        }
      }},
    ],
  },""")

events.append("""
  {
    id: "unfinished_building",
    phase: "street",
    icon: "\U0001f3d7️",
    title: "烂尾楼前",
    story: "一栋封顶的大楼矗立在雨中——脚手架还在，但工地上已经没人了。开发商资金链断裂，300多户业主交了首付却拿不到房。有人在楼顶拉横幅，有人在售楼处门口搭了帐篷。七个业主凑钱请了律师，每人摊¥3000。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 45 && !st.flags._unfinishedSeen;
    },
    choices: [
      { text: "⚖️ 捐¥300支持业主打官司", hint: "名声+2，用良心投票", apply: function(st) {
        st.flags._unfinishedSeen = true;
        if (st.resources.cash >= 300) {
          st.resources.cash -= 300;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          StateManager.addMessage("⚖️ 你捐了¥300。业主群把你拉进去发了三个鲜花表情。", "event");
        } else {
          StateManager.addMessage("⚖️ 你想帮忙，但口袋比脸还干净。", "info");
        }
      }},
      { text: "\U0001f50d 打听烂尾楼有没有收购方", hint: "也许有投资机会", apply: function(st) {
        st.flags._unfinishedSeen = true;
        st.flags._unfinishedInvestigated = true;
        StateManager.addMessage("\U0001f50d 听说有家AMC在谈收购。如果成了，房价能涨30%。如果谈不成……", "event");
      }},
      { text: "\U0001f6b6 绕路走", hint: "不关我事", apply: function(st) {
        st.flags._unfinishedSeen = true;
        StateManager.addMessage("\U0001f3d7️ 你绕过了那栋楼。雨里的钢筋混凝土像一座墓碑。", "info");
      }},
    ],
  },""")

events.append("""
  {
    id: "rental_apartment_crash",
    phase: "street",
    icon: "\U0001f3e0",
    title: "长租公寓爆雷",
    story: "「城客公寓」爆雷了。房东没收到租金要赶人，租客一次性交了半年房租却被物业贴了催缴单。你住的城中村虽然没有长租公寓，但好几个工友都在群里问：「有没有便宜的单间转租？」",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 15 && !st.flags._rentalCrashSeen;
    },
    choices: [
      { text: "\U0001f3e0 帮忙转介绍靠谱房东", hint: "人情+2，介绍成功有红包", apply: function(st) {
        st.flags._rentalCrashSeen = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
        st.resources.cash += 100;
        StateManager.addMessage("\U0001f3e0 你介绍了王婶的空房给工友。王婶给了你¥100红包。", "success");
      }},
      { text: "\U0001f4e2 提醒大家租房选月付", hint: "虽然贵点但安全", apply: function(st) {
        st.flags._rentalCrashSeen = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
        StateManager.addMessage("\U0001f4e2 你在群里发了条消息：「租房别付超过一个月的押金。」有人回了个大拇指。", "info");
      }},
      { text: "\U0001f634 跟自己没关系", hint: "你连房租都快交不起了", apply: function(st) {
        st.flags._rentalCrashSeen = true;
        StateManager.addMessage("\U0001f3e0 你连房租都快交不起了，管不了别人。", "info");
      }},
    ],
  },""")

events.append("""
  {
    id: "purchase_restriction_relax",
    phase: "street",
    icon: "\U0001f4cb",
    title: "限购松绑了",
    story: "新政出台：社保满一年即可购房，二套房首付从60%降到40%。中介的朋友圈集体沸腾：「上车好时机！」你算了一下自己的存款——距离首付还差一个零。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 70 && !st.flags._purchaseRelaxSeen;
    },
    choices: [
      { text: "\U0001f3e6 找中介咨询低首付购房", hint: "也许有路子，但可能踩坑", apply: function(st) {
        st.flags._purchaseRelaxSeen = true;
        st.flags._consultedAgent = true;
        StateManager.addMessage("\U0001f3e6 中介热情得很：「首付贷我们帮你搞定！」利率没说。你没敢签。", "event");
      }},
      { text: "\U0001f4c8 买房地产板块股票", hint: "政策利好，¥2000尝试", apply: function(st) {
        st.flags._purchaseRelaxSeen = true;
        if (st.resources.cash >= 2000) {
          st.resources.cash -= 2000;
          st.flags._realEstateStockBought = true;
          st.flags._realEstateStockDay = st.player.day;
          StateManager.addMessage("\U0001f4c8 买了两手地产股。希望这波行情能带带你。", "event");
        } else {
          StateManager.addMessage("\U0001f4c8 没钱买股票。你连二手都算不上。", "info");
        }
      }},
      { text: "\U0001f4f1 刷过去当没看见", hint: "看了也买不起", apply: function(st) {
        st.flags._purchaseRelaxSeen = true;
        StateManager.addMessage("\U0001f4f1 你划走了。看多了容易心态崩。", "info");
      }},
    ],
  },""")

events.append("""
  {
    id: "old_community_elevator",
    phase: "street",
    icon: "\U0001f6d7",
    title: "加装电梯风波",
    story: "你路过一个老旧小区，看到一楼住户和六楼老太太在吵架——加装电梯，一楼说挡了采光房子贬值，六楼说腿脚不便三年没下楼了。社区调解员两边赔笑脸，手里的本子记满了双方的意见。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 25 && !st.flags._elevatorSeen;
    },
    choices: [
      { text: "\U0001f91d 帮忙调解", hint: "做和事佬，名声+3，花10AP", apply: function(st) {
        st.flags._elevatorSeen = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
        st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 1);
        StateManager.addMessage("\U0001f91d 你花了一下午调解。最后六楼阿姨哭了，一楼大叔沉默了。调解书上签了字。", "event");
      }},
      { text: "\U0001f3ea 推销搬家服务", hint: "如果他们谈不拢可能有人要搬家", apply: function(st) {
        st.flags._elevatorSeen = true;
        st.flags._elevatorMovingBiz = true;
        StateManager.addMessage("\U0001f3ea 你给六楼阿姨留了张名片：「需要搬家找我。」她收下了。", "info");
      }},
      { text: "\U0001f6b6 看热闹", hint: "不关你事", apply: function(st) {
        st.flags._elevatorSeen = true;
        StateManager.addMessage("\U0001f6d7 你站在旁边看了十分钟。这城市里每个人都有自己的难处。", "info");
      }},
    ],
  },""")

events.append("""
  {
    id: "school_district_policy",
    phase: "street",
    icon: "\U0001f4da",
    title: "学区房变天",
    story: "「多校划片」政策出台，实验小学的学区房一夜跌了40%。群里有个人三天前刚签了合同，多花¥80万买的学区房——现在和隔壁老破小一个学校。中介的电话被打爆了，全是骂人的。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 55 && !st.flags._schoolDistrictSeen;
    },
    choices: [
      { text: "\U0001f44d 正好——以后孩子上学不拼房子了", hint: "对你这种没房的人反而是利好", apply: function(st) {
        st.flags._schoolDistrictSeen = true;
        st.needs.happiness = Math.min(100, st.needs.happiness + 8);
        StateManager.addMessage("\U0001f44d 你一直觉得学区房是扯淡。公平起见，挺好。", "success");
      }},
      { text: "\U0001f4b0 看有没有急售的学区房可以捡漏", hint: "有些房东急出手，打七折", apply: function(st) {
        st.flags._schoolDistrictSeen = true;
        if (st.resources.cash >= 100000) {
          st.resources.cash -= 100000;
          st.flags._schoolDistrictBought = true;
          st.flags._schoolDistrictDay = st.player.day;
          StateManager.addMessage("\U0001f4b0 你捡漏了一套打折学区房。政策会变，但房子是实的。", "event");
        } else {
          StateManager.addMessage("\U0001f4b0 你连首付零头都不够。学区房再跌你也买不起。", "info");
        }
      }},
      { text: "\U0001f9fd 吃瓜", hint: "看有钱人打架", apply: function(st) {
        st.flags._schoolDistrictSeen = true;
        StateManager.addMessage("\U0001f9fd 你在群里潜水看人吵架。有人@你：「你笑什么？」你没回。", "info");
      }},
    ],
  },""")

events.append("""
  {
    id: "talent_introduction_war",
    phase: "street",
    icon: "\U0001f393",
    title: "抢人大战",
    story: "二线城市又来抢人了：大专以上学历直接落户，给¥5万生活补贴，人才公寓租金打五折。你算了一下——自己好像符合条件。但要去一个陌生的城市重新开始。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 35 && !st.flags._talentWarSeen && (st.player.intelligence || 0) >= 25;
    },
    choices: [
      { text: "✈️ 认真考虑去二线城市发展", hint: "开启新城市线，但需要重新积累", apply: function(st) {
        st.flags._talentWarSeen = true;
        st.flags._considerRelocate = true;
        st.needs.happiness = Math.min(100, st.needs.happiness + 12);
        StateManager.addMessage("✈️ 你认真查了那个城市的信息。房租¥800一居室，房价¥1万/平。有点心动。", "event");
      }},
      { text: "\U0001f4de 假装高端人才拿offer再拒绝", hint: "不太道德但能了解行情", apply: function(st) {
        st.flags._talentWarSeen = true;
        st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 1);
        StateManager.addMessage("\U0001f4de 你跟人才热线聊了20分钟。对方很热情。你觉得有点愧疚。", "info");
      }},
      { text: "\U0001f6b6 大城市还没混明白呢", hint: "不走", apply: function(st) {
        st.flags._talentWarSeen = true;
        StateManager.addMessage("\U0001f6b6 你还没在这座城市站稳脚跟。等混出头了再说吧。", "info");
      }},
    ],
  },""")

print("Generated " + str(len(events)) + " events")

# Read original content
with open(events_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the closing ]; of RANDOM_EVENTS and insert before it
old_marker = "  },\n];\n\n/* =========================================================\n * 二、事件触发与队列管理"
new_part = "\n".join(events) + "\n"
new_marker = new_part + "  },\n];\n\n/* =========================================================\n * 二、事件触发与队列管理"

if old_marker in content:
    content = content.replace(old_marker, new_marker)
    with open(events_js_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: Events inserted into " + events_js_path)
else:
    print("ERROR: old_marker not found!")
    # Try with different context
    idx = content.find("二、事件触发与队列管理")
    if idx >= 0:
        snippet = content[idx-80:idx+10]
        print("Found '二' at byte", idx)
        print("Context:", repr(snippet))
    else:
        print("'二、事件触发' not found in file!")

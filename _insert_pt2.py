# -*- coding: utf-8 -*-
events_js_path = "D:/Claude Code+DeepSeekV4/city-life-story/src/js/core/events.js"

events_code = """

  // ---- ③ 金融与投资（8个） ----

  {
    id: "stock_market_boom",
    phase: "street",
    icon: "📈",
    title: "A股疯了",
    story: "大盘连续涨了15天，从2800点冲到了4200点。食堂里、公交上、厕所隔间——所有人都在看手机上的K线。卖菜的老刘把攒了五年的¥20万全扔进去了。你攥着口袋里的几千块，心跳加速。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 30 && !st.flags._stockBoomSeen && st.resources.cash >= 1000;
    },
    choices: [
      { text: "🔥 跟进去——全仓买入", hint: "高风险高回报，可能翻倍也可能腰斩", apply: function(st) {
        st.flags._stockBoomSeen = true;
        var invest = Math.min(st.resources.cash, 10000);
        st.resources.cash -= invest;
        st.flags._stockBoomInvested = invest;
        st.flags._stockBoomDay = st.player.day;
        StateManager.addMessage("🔥 你全仓买入！看着红彤彤的K线，手心都是汗。", "event");
      }},
      { text: "🤔 买一半留一半", hint: "稳健", apply: function(st) {
        st.flags._stockBoomSeen = true;
        var invest = Math.min(Math.floor(st.resources.cash / 2), 5000);
        st.resources.cash -= invest;
        st.flags._stockBoomHalfInvested = invest;
        st.flags._stockBoomDay = st.player.day;
        StateManager.addMessage("🤔 你买了¥" + invest + "。留了一半现金——万一崩了还能吃饭。", "info");
      }},
      { text: "🧊 不碰——都是泡沫", hint: "理智，但不赚钱", apply: function(st) {
        st.flags._stockBoomSeen = true;
        st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 2);
        StateManager.addMessage("🧊 你忍住了。老刘在边上说：「你不买就是踏空啊！」你笑笑没说话。", "info");
      }},
    ],
  },

  {
    id: "crypto_cycle",
    phase: "street",
    icon: "₿",
    title: "比特币又减半了",
    story: "比特币第四次减半完成，价格从¥25万冲到¥60万。群里有人说他2018年花¥3000买了0.5个BTC忘了，现在值¥30万。二手电脑城里有人开始攒显卡挖矿，电费¥1.2/度也拦不住。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 50 && !st.flags._cryptoCycleSeen;
    },
    choices: [
      { text: "₿ 买一点比特币试试", hint: "¥2000起，可能暴富可能归零", apply: function(st) {
        st.flags._cryptoCycleSeen = true;
        if (st.resources.cash >= 2000) {
          st.resources.cash -= 2000;
          st.flags._cryptoBought = true;
          st.flags._cryptoDay = st.player.day;
          StateManager.addMessage("₿ 你买了¥2000的比特币。私钥抄在本子上，藏在枕头底下。", "event");
        } else {
          StateManager.addMessage("₿ 连¥2000都拿不出来。你第一次觉得穷限制了对风险的想象。", "info");
        }
      }},
      { text: "⚡ 去电脑城帮人装矿机", hint: "体力活，一天赚¥300", apply: function(st) {
        st.flags._cryptoCycleSeen = true;
        st.resources.cash += 300;
        st.needs.fatigue = Math.min(100, st.needs.fatigue + 12);
        StateManager.addMessage("⚡ 装了一天显卡。老板问你要不要工资折成ETH——你没敢。", "info");
      }},
      { text: "📚 学习区块链知识", hint: "智力+3", apply: function(st) {
        st.flags._cryptoCycleSeen = true;
        st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 3);
        StateManager.addMessage("📚 你花了一周搞懂了什么是共识机制。虽然还是买不起。", "success");
      }},
    ],
  },

  {
    id: "retail_vs_wallstreet",
    phase: "street",
    icon: "🐂",
    title: "散户大战华尔街",
    story: "「柠檬汽水」被知名做空机构发布17页做空报告，股价暴跌20%。但REDDIT上的散户们不干了——「YOLO！ALL IN！」群里的中文翻译比原文还热闹：「机构做空200%，逼空要爆了！」",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 40 && !st.flags._retailVsWallSeen && st.resources.cash >= 500;
    },
    choices: [
      { text: "🐂 跟散户一起冲", hint: "买¥2000，可能会翻倍也可能血本无归", apply: function(st) {
        st.flags._retailVsWallSeen = true;
        if (st.resources.cash >= 2000) {
          st.resources.cash -= 2000;
          st.flags._retailWsbBet = true;
          st.flags._retailWsbDay = st.player.day;
          StateManager.addMessage("🐂 你跟着群里的翻译一起买入了。群里在喊「DIAMOND HANDS！」你其实不知道什么意思。", "event");
        } else {
          StateManager.addMessage("🐂 你连¥2000都没有。只能在群里看别人暴富或跳楼。", "info");
        }
      }},
      { text: "🏦 跟着机构做空", hint: "需要¥5000保证金，有大机构背书", apply: function(st) {
        st.flags._retailVsWallSeen = true;
        if (st.resources.cash >= 5000) {
          st.resources.cash -= 5000;
          st.flags._retailShortSide = true;
          st.flags._retailShortDay = st.player.day;
          StateManager.addMessage("🏦 你跟机构站在一边。理性上是对的，但心里有点不舒服。", "event");
        } else {
          StateManager.addMessage("🏦 机构的门槛你都够不着。也许这就是散户的命。", "info");
        }
      }},
      { text: "🍿 吃瓜看戏", hint: "什么都不做最安全", apply: function(st) {
        st.flags._retailVsWallSeen = true;
        StateManager.addMessage("🍿 你搬了小板凳看群里的战况。今天不亏就是赚。", "info");
      }},
    ],
  },

  {
    id: "quant_fund_harvest",
    phase: "street",
    icon: "🤖",
    title: "量化基金收割",
    story: "「幻方量化」去年收益43%，今年前三个月已经亏了15%。有人说量化基金就是高频割韭菜——散户的每一笔交易都被算法预测。你想起上周自己买了就跌、卖了就涨的股票，后背一凉。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 55 && !st.flags._quantFundSeen;
    },
    choices: [
      { text: "🤖 买量化基金——打不过就加入", hint: "¥10000起购，年化预期12%", apply: function(st) {
        st.flags._quantFundSeen = true;
        if (st.resources.cash >= 10000) {
          st.resources.cash -= 10000;
          st.flags._quantFundBought = true;
          st.flags._quantFundDay = st.player.day;
          StateManager.addMessage("🤖 你买了量化基金。AI帮你炒股，你在出租屋里等收益。", "event");
        } else {
          StateManager.addMessage("🤖 门槛¥10000，你差了¥" + (10000 - st.resources.cash) + "。想在城里活着真不容易。", "info");
        }
      }},
      { text: "📖 学习量化交易知识", hint: "智力+2，也许以后用得上", apply: function(st) {
        st.flags._quantFundSeen = true;
        st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 2);
        StateManager.addMessage("📖 你看了三篇量化的文章。90%没看懂，但感觉很高端。", "success");
      }},
      { text: "🚶 不碰——我就是那个被割的韭菜", hint: "有自知之明", apply: function(st) {
        st.flags._quantFundSeen = true;
        StateManager.addMessage("🚶 你承认了自己就是韭菜。不丢人——至少今天没亏钱。", "info");
      }},
    ],
  },

  {
    id: "deposit_rate_cut",
    phase: "street",
    icon: "🏦",
    title: "存款利率又降了",
    story: "银行又降息了——一年期存款利率从1.5%降到1.0%。余额宝的收益跌到1.8%，创历史新低。你算了算：存¥10000在银行，一年利息¥100，够吃两顿沙县。房东说下个月涨房租¥150。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 20 && !st.flags._depositRateCutSeen;
    },
    choices: [
      { text: "📈 把钱从银行取出来投资", hint: "被迫承担更高风险", apply: function(st) {
        st.flags._depositRateCutSeen = true;
        st.flags._rateCutInvestMode = true;
        StateManager.addMessage("📈 你把存款取了出来。存银行是等死，投资是找死——但找死还有一线生机。", "event");
      }},
      { text: "🏠 跟房东谈年付打折", hint: "锁定一年租金，省下涨幅", apply: function(st) {
        st.flags._depositRateCutSeen = true;
        st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 1);
        StateManager.addMessage("🏠 你找房东谈了年付。房东同意了——打95折。省下的钱够吃一个月沙县。", "success");
      }},
      { text: "😤 存着吧，至少不会亏本", hint: "稳妥但购买力在缩水", apply: function(st) {
        st.flags._depositRateCutSeen = true;
        StateManager.addMessage("😤 你看着账户里的数字。不增加就是减少，这道理你懂。", "info");
      }},
    ],
  },

  {
    id: "exchange_rate_break7",
    phase: "street",
    icon: "💱",
    title: "汇率破7了",
    story: "美元兑人民币汇率突破7.2。做外贸的李哥最近订单接到手软——「人民币贬值了，老外觉得我们的货跟白送一样。」但进口商的脸色很难看——电脑配件进货价涨了15%，整条街的装机店都在调价。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 40 && !st.flags._exchangeRateSeen;
    },
    choices: [
      { text: "💵 换点美元避险", hint: "¥5000换美元，保值但占用资金", apply: function(st) {
        st.flags._exchangeRateSeen = true;
        if (st.resources.cash >= 5000) {
          st.resources.cash -= 5000;
          st.flags._usdHeld = true;
          st.flags._usdHeldDay = st.player.day;
          StateManager.addMessage("💵 你换了$700美元。握着绿色的票子，感觉确实不一样。", "event");
        } else {
          StateManager.addMessage("💵 想换汇但钱太少。银行柜员看了你的余额没说啥——但你从她眼神里读到了。", "info");
        }
      }},
      { text: "📦 趁电脑配件涨价前进一批货", hint: "进货成本增加前囤货", apply: function(st) {
        st.flags._exchangeRateSeen = true;
        if (st.resources.cash >= 3000) {
          st.resources.cash -= 3000;
          st.flags._importGoodsStock = true;
          StateManager.addMessage("📦 你在涨价前进了一批硬盘和内存。过两周能卖个好价钱。", "event");
        } else {
          StateManager.addMessage("📦 连囤货的钱都没有。你感觉自己被通胀和贫穷两头夹击。", "info");
        }
      }},
      { text: "💼 问问李哥那边缺不缺人", hint: "外贸业务扩张，可能需要人手", apply: function(st) {
        st.flags._exchangeRateSeen = true;
        st.flags._tradeJobChance = true;
        StateManager.addMessage("💼 李哥说缺个跟单的，工资不高但能学东西。你留了电话。", "event");
      }},
    ],
  },

  {
    id: "trust_crash",
    phase: "street",
    icon: "🧾",
    title: "信托暴雷",
    story: "「中诚信托·XX号」逾期了——涉及金额¥300亿，投资者在总部楼下拉起了横幅。你看到新闻里一个穿西装的中年男人对着镜头说：「这是我妈的养老钱，¥200万。」那个人的表情比哭还难看。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 60 && !st.flags._trustCrashSeen;
    },
    choices: [
      { text: "🔍 打听有没有打折转让的信托份额", hint: "¥5000收¥50000份额，可能血本无归也可能翻盘", apply: function(st) {
        st.flags._trustCrashSeen = true;
        if (st.resources.cash >= 5000) {
          st.resources.cash -= 5000;
          st.flags._trustDebtBought = true;
          st.flags._trustDebtDay = st.player.day;
          StateManager.addMessage("🔍 你从一个急着用钱的人手里收了¥50000的信托债权。他谢谢你——你是来接盘的。", "event");
        } else {
          StateManager.addMessage("🔍 收债权的机会摆在眼前，但你连¥5000都没有。", "info");
        }
      }},
      { text: "📞 安慰一下那个上新闻的人", hint: "虽然不认识，但人心都是肉长的", apply: function(st) {
        st.flags._trustCrashSeen = true;
        st.needs.happiness = Math.min(100, st.needs.happiness - 3);
        st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
        StateManager.addMessage("📞 你搜到了他的微博，留了条私信：「大哥，挺住。」已读，没回。", "info");
      }},
      { text: "📵 关掉新闻", hint: "眼不见心不烦", apply: function(st) {
        st.flags._trustCrashSeen = true;
        StateManager.addMessage("📵 你划走了。¥300亿离你很远——你今天的烦恼是午饭吃¥8还是¥12。", "info");
      }},
    ],
  },

  {
    id: "pandemic_black_swan",
    phase: "street",
    icon: "🦠",
    title: "突发公共卫生事件",
    story: "新闻弹窗：某区发现新型流感病例，全市进入三级响应。药店的口罩10分钟被抢光，超市的泡面和矿泉水货架空了一半。社区在招志愿者——包三餐，每天¥100补贴。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 15 && st.player.day <= 200 && !st.flags._pandemicSeen;
    },
    choices: [
      { text: "😷 报名社区志愿者", hint: "包三餐+¥100/天，但有一定健康风险", apply: function(st) {
        st.flags._pandemicSeen = true;
        st.flags._pandemicVolunteer = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
        st.resources.cash += 300;
        StateManager.addMessage("😷 你穿了三天防护服。社区大妈给你竖了大拇指。累，但值。", "event");
      }},
      { text: "📦 进一批口罩和消毒液来卖", hint: "倒卖防疫物资，收益高但有争议", apply: function(st) {
        st.flags._pandemicSeen = true;
        if (st.resources.cash >= 2000) {
          st.resources.cash -= 2000;
          st.flags._pandemicProfiteer = true;
          StateManager.addMessage("📦 你进了一批口罩按进价3倍卖。赚钱了——但你妈知道了会怎么说？", "event");
        } else {
          StateManager.addMessage("📦 想发财连本钱都没有。你第一次感谢贫穷让你保住了道德。", "info");
        }
      }},
      { text: "🏠 在家囤粮减少外出", hint: "安全第一", apply: function(st) {
        st.flags._pandemicSeen = true;
        st.resources.cash -= 200;
        StateManager.addMessage("🏠 你买了半个月的粮食和水。待在屋里最安全。", "info");
      }},
    ],
  },

  // ---- ④ 实体产业与商业（6个） ----

  {
    id: "chip_localization",
    phase: "street",
    icon: "🔬",
    title: "芯片国产化浪潮",
    story: "美国又升级了对华芯片出口管制。但新闻里说国产芯片良率突破了70%——虽然跟台积电还有差距，但够用了。工业园区的封装厂到处贴招聘广告：「芯片测试员，月薪¥6000起，包吃住。」",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 45 && !st.flags._chipLocalSeen;
    },
    choices: [
      { text: "🏭 去芯片厂面试", hint: "月薪¥6000，技能要求智力≥25", apply: function(st) {
        st.flags._chipLocalSeen = true;
        if ((st.player.intelligence || 0) >= 25) {
          st.flags._chipFabJob = true;
          StateManager.addMessage("🏭 你面试过了。穿上无尘服的那一刻，感觉自己像个科学家。", "event");
        } else {
          StateManager.addMessage("🏭 你连笔试都没过。基础电路图看不懂——城里的知识门槛比想象的高。", "warning");
        }
      }},
      { text: "📈 买国产芯片概念股", hint: "¥2000，赌国运", apply: function(st) {
        st.flags._chipLocalSeen = true;
        if (st.resources.cash >= 2000) {
          st.resources.cash -= 2000;
          st.flags._chipStockBought = true;
          st.flags._chipStockDay = st.player.day;
          StateManager.addMessage("📈 你买了国产芯片股。这是情怀还是投资——你分不清。", "event");
        } else {
          StateManager.addMessage("📈 连¥2000的股票都买不起。芯片国产化和你的钱包没什么关系。", "info");
        }
      }},
      { text: "📖 报名夜校学电路基础", hint: "智力+3，花¥500学费", apply: function(st) {
        st.flags._chipLocalSeen = true;
        if (st.resources.cash >= 500) {
          st.resources.cash -= 500;
          st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 3);
          StateManager.addMessage("📖 你在夜校学了两个月电路。老师说你有天赋——你第一次被人夸。", "success");
        } else {
          StateManager.addMessage("📖 ¥500的学费都掏不出来。你恨自己为什么以前不好好学习。", "info");
        }
      }},
    ],
  },

  {
    id: "pre_made_food_trend",
    phase: "street",
    icon: "🍱",
    title: "预制菜入侵",
    story: "那条街上的三家小饭馆有两家换上了「预制菜」的招牌——料理包加热3分钟，成本¥3.5，卖¥18。王婶的面馆还在坚持手工拉面——但客人少了四成。冷冻批发市场多了好多卖料理包的摊位。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 20 && !st.flags._preMadeFoodSeen;
    },
    choices: [
      { text: "📦 批发料理包来卖", hint: "门槛低利润薄，¥1000进货", apply: function(st) {
        st.flags._preMadeFoodSeen = true;
        if (st.resources.cash >= 1000) {
          st.resources.cash -= 1000;
          st.flags._premadeStock = true;
          StateManager.addMessage("📦 你进了200包鱼香肉丝料理包。¥3.5进价卖¥6——薄利多销。", "event");
        } else {
          StateManager.addMessage("📦 连¥1000批发本钱都没有。你先把自己喂饱再说吧。", "info");
        }
      }},
      { text: "🍜 支持王婶——帮她宣传手工面", hint: "名声+2，也许能帮她拉回客流", apply: function(st) {
        st.flags._preMadeFoodSeen = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
        StateManager.addMessage("🍜 你帮王婶在群里打了广告。来了几个新客——但不够。", "success");
      }},
      { text: "🥟 跟王婶学手工拉面手艺", hint: "学一门手艺总是好的", apply: function(st) {
        st.flags._preMadeFoodSeen = true;
        st.flags._learnedNoodle = true;
        StateManager.addMessage("🥟 王婶教你拉面。面和水的比例、醒面的时间——里面全是学问。", "success");
      }},
    ],
  },

  {
    id: "consumption_downgrade",
    phase: "street",
    icon: "💰",
    title: "平替风暴",
    story: "拼多多的市值超过了阿里。街头到处都是「9.9包邮」的广告——隔壁小张在拼多多上进了一样的货，价格只有你的一半。品牌店的老板说：「现在的人只买对的，不买贵的——但对的是指最便宜的。」",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 25 && !st.flags._consumptionDownSeen;
    },
    choices: [
      { text: "📦 调整进货策略——走低价路线", hint: "薄利多销，¥2000进货", apply: function(st) {
        st.flags._consumptionDownSeen = true;
        if (st.resources.cash >= 2000) {
          st.resources.cash -= 2000;
          st.flags._lowPriceRoute = true;
          StateManager.addMessage("📦 你进了便宜货。利润薄但走量大——¥10一件一天能卖30件。", "event");
        } else {
          StateManager.addMessage("📦 连薄利多销的启动资金都不够。", "info");
        }
      }},
      { text: "✨ 坚持卖品质货——走高端路线", hint: "利润高但客流少，做口碑", apply: function(st) {
        st.flags._consumptionDownSeen = true;
        st.flags._premiumRoute = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
        StateManager.addMessage("✨ 你决定不降价。贵有贵的道理——你相信识货的人。", "event");
      }},
      { text: "🛵 帮拼多多商家送货", hint: "跑腿一天赚¥150", apply: function(st) {
        st.flags._consumptionDownSeen = true;
        st.resources.cash += 150;
        st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
        StateManager.addMessage("🛵 你跑了一天配送。9.9包邮的商品，配送费¥2.5——跑得腿抽筋。", "info");
      }},
    ],
  },

  {
    id: "going_global_trend",
    phase: "street",
    icon: "🌍",
    title: "出海浪潮",
    story: "SHEIN在北美杀疯了——一件裙子$9.9，美国年轻人疯抢。国内供应商跟着吃肉——张老板的服装厂以前接国内订单¥25/件，现在接SHEIN的订单¥35/件，只要质量达标。他满世界找熟练车工。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 50 && !st.flags._goingGlobalSeen;
    },
    choices: [
      { text: "🧵 去服装厂上班", hint: "月薪¥5000，要求缝纫技能≥15", apply: function(st) {
        st.flags._goingGlobalSeen = true;
        st.flags._garmentJobApplied = true;
        StateManager.addMessage("🧵 张老板看了你的手：「没干过车工吧？——学三个月就能上手。」", "event");
      }},
      { text: "📦 倒卖SHEIN尾单货", hint: "¥1500进货，在夜市卖", apply: function(st) {
        st.flags._goingGlobalSeen = true;
        if (st.resources.cash >= 1500) {
          st.resources.cash -= 1500;
          st.flags._sheinFlipping = true;
          StateManager.addMessage("📦 你进了一批SHEIN尾单。质量不错，夜市上一晚上卖了¥400。", "event");
        } else {
          StateManager.addMessage("📦 尾单货也进不起。你摸了摸那些衣服——料子确实好。", "info");
        }
      }},
      { text: "📖 学英语准备做出海运营", hint: "智力+2，花¥300买教材", apply: function(st) {
        st.flags._goingGlobalSeen = true;
        if (st.resources.cash >= 300) {
          st.resources.cash -= 300;
          st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 2);
          StateManager.addMessage("📖 买了一套英语教材。你从"How are you"开始复习。", "success");
        }
      }},
    ],
  },

  {
    id: "traditional_retail_collapse",
    phase: "street",
    icon: "🏪",
    title: "超市关门潮",
    story: "沃尔玛这个月关了第三家店。家乐福的货架越来越空——供应商说账期从30天拖到了120天。关店大清仓：货架¥50一个，冷柜¥200一台，整箱的方便面¥10一箱。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 35 && !st.flags._retailCollapseSeen;
    },
    choices: [
      { text: "🛒 去扫货——低价囤日用品", hint: "¥500扫货，转手能卖¥1000", apply: function(st) {
        st.flags._retailCollapseSeen = true;
        if (st.resources.cash >= 500) {
          st.resources.cash -= 500;
          st.flags._clearanceStock = true;
          StateManager.addMessage("🛒 你扫了一堆日用品——洗衣液¥5一瓶，纸巾¥2一条。赚了。", "event");
        } else {
          StateManager.addMessage("🛒 连¥500的便宜都占不起。你蹲在清仓区看别人抢购。", "info");
        }
      }},
      { text: "🛋️ 买个便宜的货架自己摆摊用", hint: "投资固定资产，¥50一个货架", apply: function(st) {
        st.flags._retailCollapseSeen = true;
        st.resources.cash -= 50;
        st.flags._stallShelf = true;
        StateManager.addMessage("🛋️ 你买了一个超市货架。以后摆摊东西终于可以摆放整齐了。", "event");
      }},
      { text: "😔 在门口看了一会儿", hint: "感慨", apply: function(st) {
        st.flags._retailCollapseSeen = true;
        StateManager.addMessage("🏪 你站在关门的超市门口。时代抛弃你的时候，连招呼都不打。", "info");
      }},
    ],
  },

  {
    id: "ev_price_war",
    phase: "street",
    icon: "🚗",
    title: "新能源价格战",
    story: "特斯拉降价¥3万，比亚迪跟进降价¥2万，小鹏汽车直接推出了¥10万的车型。二手车商的朋友圈在哀嚎——「2022年的Model 3，收车价从¥18万跌到¥12万。」充电桩公司倒是笑开了花——车卖得多，桩不够用了。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 30 && !st.flags._evPriceWarSeen;
    },
    choices: [
      { text: "⚡ 问充电桩公司需不需要人", hint: "安装充电桩，体力活但前景好", apply: function(st) {
        st.flags._evPriceWarSeen = true;
        st.flags._evChargingJob = true;
        StateManager.addMessage("⚡ 充电桩公司缺安装工——日结¥350，就是晒。", "event");
      }},
      { text: "📈 买充电桩公司的股票", hint: "电动汽车越多，充电桩越赚", apply: function(st) {
        st.flags._evPriceWarSeen = true;
        if (st.resources.cash >= 2000) {
          st.resources.cash -= 2000;
          st.flags._evChargingStock = true;
          st.flags._evChargingStockDay = st.player.day;
          StateManager.addMessage("📈 你买了充电桩公司的股票。卖铲子的人比挖金矿的人更稳。", "event");
        } else {
          StateManager.addMessage("📈 想投资但没钱。你连两轮电动车都只有一辆旧的。", "info");
        }
      }},
      { text: "🚶 跟你没关系——你坐公交", hint: "地铁月卡¥200", apply: function(st) {
        st.flags._evPriceWarSeen = true;
        StateManager.addMessage("🚶 你连电动自行车都还没骑上。价格战是别人的烟火。", "info");
      }},
    ],
  },

"""

with open(events_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# Insert before the closing ]; of RANDOM_EVENTS
# Find the last occurrence of "];" followed by the event trigger section
old_marker = "  },\n];\n\n/* =========================================================\n * 二、事件触发与队列管理"
new_marker = events_code + "  },\n];\n\n/* =========================================================\n * 二、事件触发与队列管理"

if old_marker in content:
    content = content.replace(old_marker, new_marker)
    with open(events_js_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: Part 2 inserted!")
    # Verify the count
    count = content.count("],\n\n  // ----")
    print("Section markers found:", count)
else:
    print("ERROR: old_marker not found!")
    idx = content.find("二、事件触发与队列管理")
    if idx >= 0:
        print("Found at byte", idx)
        print("Context:", repr(content[idx-100:idx+10]))

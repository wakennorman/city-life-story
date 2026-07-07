/**
 * 街头随机事件数据 — 财富/商机篇
 * 从 events_street.js 拆分。经商财富相关事件。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  var EVENTS = [
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
          st.trade &&
          st.trade.currentLocation === "construction" &&
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
          (st.trade.currentLocation === "market" ||
            st.trade.currentLocation === "wholesaleMarket") &&
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
          hint: "收入两边小赚，行动力消耗略增",
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
      _isChainEvent: true,
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
    // ====== 新链：黄金投机泡沫（3步链） ======
    {
      id: "gold_rush_start",
      _isChainEvent: true,
      phase: "street",
      icon: "🥇",
      title: "黄金暴涨！",
      story:
        "新闻在播报：国际金价突破历史新高，国内金饰价格已经冲到每克¥800。街边金店门口排起了长队，黄牛在门口加价收金条。你翻出手机看了眼——之前零散买的几克黄金已经涨了40%。要不要趁机操作一波？",
      conditions: function (st) {
        return st.player.day >= 30 && (st.resources.cash || 0) >= 2000;
      },
      choices: [
        {
          text: "💰 跟风买入¥5000",
          hint: "追高风险",
          cost: 5000,
          apply: function (st) {
            if (st.resources.cash < 5000) {
              StateManager.addMessage("💰 钱不够！", "warning");
              return;
            }
            st.resources.cash -= 5000;
            st.flags._goldBought = true;
            st.flags._goldPrice = 5000;
            StateManager.addMessage(
              "🥇 你冲进金店买了¥5000的金条。店员说'有眼光！'",
              "event",
            );
            scheduleChainEvent(st, "gold_rush_peak", 15, "street");
          },
        },
        {
          text: "💵 小买¥1000试试",
          hint: "谨慎参与",
          cost: 1000,
          apply: function (st) {
            if (st.resources.cash < 1000) {
              StateManager.addMessage("💵 钱不够！", "warning");
              return;
            }
            st.resources.cash -= 1000;
            st.flags._goldBought = true;
            st.flags._goldPrice = 1000;
            StateManager.addMessage(
              "🥇 你买了¥1000的金条。不算多，但至少参与了。",
              "info",
            );
            scheduleChainEvent(st, "gold_rush_peak", 15, "street");
          },
        },
        {
          text: "📊 观望不买",
          hint: "不追高",
          apply: function (st) {
            st.flags._goldWatched = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage(
              "📊 你忍住没买。追涨杀跌是散户亏钱的第一原因。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "gold_rush_peak",
      _isChainEvent: true,
      phase: "street",
      icon: "📈",
      title: "金价冲到顶了",
      story:
        "半个月过去，金价已经涨到了令人瞠目的程度——每克¥950！新闻里专家们还在喊'黄金看到¥1000'，但街边收金条的黄牛已经悄悄减少了收购量。你手里的金条现在浮盈不少。",
      conditions: function (st) {
        return !!st.flags._goldBought && !st.flags._goldPeakDone;
      },
      choices: [
        {
          text: "✅ 全部卖出，落袋为安",
          hint: "锁定利润",
          apply: function (st) {
            st.flags._goldPeakDone = true;
            st.flags._goldSold = true;
            var profit = Math.round((st.flags._goldPrice || 1000) * 0.6);
            st.resources.cash += (st.flags._goldPrice || 1000) + profit;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            StateManager.addMessage(
              "✅ 你卖出所有金条，净赚¥" + profit + "！",
              "success",
            );
          },
        },
        {
          text: "🤞 再等等，还能涨",
          hint: "贪婪可能酿成大错",
          apply: function (st) {
            st.flags._goldPeakDone = true;
            st.flags._goldHeld = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "🤞 你决定再等等。'还能涨，还能涨...'你念叨着。",
              "info",
            );
            scheduleChainEvent(st, "gold_rush_crash", 20, "street");
          },
        },
      ],
    },
    {
      id: "gold_rush_crash",
      _isChainEvent: true,
      phase: "street",
      icon: "📉",
      title: "金价暴跌！",
      story:
        "最坏的情况发生了——国际金价一夜暴跌15%！原因是美联储突然加息，美元走强。国内金价跟着跳水，你手里的金条现在不但没赚，反而亏了本金。金店门口又开始排队，这次是卖金的人。",
      conditions: function (st) {
        return !!st.flags._goldHeld && !st.flags._goldCrashDone;
      },
      choices: [
        {
          text: "😰 割肉卖出",
          hint: "止损离场",
          apply: function (st) {
            st.flags._goldCrashDone = true;
            var loss = Math.round((st.flags._goldPrice || 1000) * 0.35);
            st.resources.cash += (st.flags._goldPrice || 1000) - loss;
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
            st.player.mental = Math.max(0, (st.player.mental || 50) - 5);
            StateManager.addMessage(
              "😰 你割肉卖出，亏损¥" + loss + "。贪婪的教训。",
              "danger",
            );
          },
        },
        {
          text: "🧘 拿着不动，等反弹",
          hint: "长线持有",
          apply: function (st) {
            st.flags._goldCrashDone = true;
            st.flags._goldHeldLong = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            StateManager.addMessage(
              "🧘 你决定不看账户了。三五年后又是一条好汉。",
              "hint",
            );
            // 30天后部分反弹
            if (typeof scheduleChainEvent === "function") {
              scheduleChainEvent(st, "gold_rush_rebound", 30, "street");
            }
          },
        },
      ],
    },
    {
      id: "gold_rush_rebound",
      _isChainEvent: true,
      phase: "street",
      icon: "🔄",
      title: "金价反弹",
      story:
        "一个月后，金价慢慢回升到了中位线。虽然没回到最高点，但比你割肉时强多了。你当初坚持持有的决定，现在看来是对的。",
      conditions: function (st) {
        return !!st.flags._goldHeldLong && !st.flags._goldReboundDone;
      },
      choices: [
        {
          text: "✅ 趁反弹卖出",
          hint: "小亏出局",
          apply: function (st) {
            st.flags._goldReboundDone = true;
            var loss = Math.round((st.flags._goldPrice || 1000) * 0.12);
            st.resources.cash += (st.flags._goldPrice || 1000) - loss;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage(
              "✅ 反弹中卖出，亏损¥" + loss + "。比割肉强多了。",
              "info",
            );
          },
        },
        {
          text: "🤝 继续持有",
          hint: "佛系投资",
          apply: function (st) {
            st.flags._goldReboundDone = true;
            st.flags._goldDiamondHands = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            StateManager.addMessage(
              "🤝 你选择了长期持有。时间是投资的朋友。",
              "success",
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

/**
 * 扩展行动库
 *
 * 涵盖：街头生存 / 经营 / 社交 / 学习 / 生活 / 投资 / 梦想实现
 * 参考：《北京浮生记》《大多数》《中国式家长》《这是我的战争》《Stardew Valley》
 *
 * 用法：getAvailableActions() 末尾会调用 addExtraActions() 把这些行动合并进去
 */

/** 街头阶段通用行动（不依赖地点） */
function addStreetExtras(state, actions) {
  // === 街头生存类（任何街头地点都行） ===
  actions.push({
    id: "scavenge_trash",
    name: "规划拾荒路线",
    desc: "选择今天的拾荒区域：城中村小巷(稳)/废品站边缘(中)/工业区(高)/老周专线(⭐)。不同路线收益和风险各异。",
    icon: "🗺️",
    apCost: 15,
    payEstimate: "2~65",
    handler: () => {
      showScavengeRouteModal();
    },
  });

  actions.push({
    id: "vending_advice",
    name: "摆摊选址建议",
    desc: "根据天气、节日、周末等因素，智能推荐今日最佳摆摊地点。",
    icon: "📍",
    apCost: 5,
    handler: () => {
      if (typeof showVendingLocationAdviceModal === "function") {
        showVendingLocationAdviceModal();
      } else {
        StateManager.addMessage("功能暂未加载", "warning");
      }
    },
  });

  // v3.3 W2-T2: 天气准备（买伞/暖宝）
  actions.push({
    id: "weather_prep",
    name: "准备应对天气",
    desc: "查看明日天气，购买雨伞（¥20，雨天疲劳减半）或暖宝（¥50，寒冷健康保护）。未雨绸缪总没错。",
    icon: "🌤️",
    apCost: 5,
    handler: () => {
      var st = StateManager.getState();
      var prep = st.flags && st.flags._weatherPrep;
      if (prep && prep.umbrella && prep.warmPack) {
        StateManager.addMessage(
          "🌤️ 你已经做好了所有天气准备（伞+暖宝）。",
          "info",
        );
        return;
      }
      if (typeof prepareForWeather === "function") {
        prepareForWeather(st);
      } else {
        StateManager.addMessage("功能暂未加载", "warning");
      }
    },
  });

  actions.push({
    id: "busking",
    name: "街头卖唱",
    desc: "在地铁口或天桥上唱歌赚打赏。需要胆子大。",
    icon: "🎤",
    apCost: 20,
    payEstimate: "5~25",
    handler: () => {
      const st = StateManager.getState();
      const skill = st.player.mental; // 心智影响成功率
      const earned = Math.floor(5 + Random.float(0, 20) + (skill - 25) * 0.3);
      st.resources.cash += earned;
      st.resources.totalEarned += earned;
      addDailyTransaction(st, "income", "side_job", earned, "街头卖唱");
      st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
      st.player.fame = Math.min(100, st.player.fame + 1);
      if (Random.chance(0.2)) {
        st.needs.happiness = Math.max(0, st.needs.happiness - 5);
        StateManager.addMessage(
          `🎤 唱了半天，城管赶人+路人嫌弃，赚到 ¥${earned}。`,
          "warning",
        );
      } else {
        st.needs.happiness = Math.min(100, st.needs.happiness + 8);
        StateManager.addMessage(
          `🎤 卖唱结束，收获 ¥${earned} 打赏！心情好。`,
          "success",
        );
      }
      consumeAP(20);
    },
  });

  actions.push({
    id: "beg",
    name: "街头乞讨",
    desc: "放下尊严，跪地要饭。（有尊严损失）",
    icon: "🙏",
    apCost: 20,
    payEstimate: "1~5",
    handler: () => {
      const st = StateManager.getState();
      const earned = Random.int(1, 5);
      st.resources.cash += earned;
      st.resources.totalEarned += earned;
      addDailyTransaction(st, "income", "side_job", earned, "街头乞讨");
      st.needs.happiness = Math.max(0, st.needs.happiness - 12);
      st.player.fame = Math.max(0, st.player.fame - 2);
      st.flags._everBegged = true; // 成就追踪
      StateManager.addMessage(
        `🙏 跪了半小时，收到 ¥${earned}。心里五味杂陈。`,
        "warning",
      );
      consumeAP(20);
    },
  });

  actions.push({
    id: "play_dice",
    name: "路边赌骰子",
    desc: "和地摊小贩玩骰子，押 50 赢了翻倍，输了打水漂。",
    icon: "🎲",
    costEstimate: 50,
    apCost: 20,
    payEstimate: "0或100",
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 50) {
        StateManager.addMessage("🎲 押不起 50 块。", "warning");
        return;
      }
      st.resources.cash -= 50;
      addDailyTransaction(st, "expense", "entertainment", 50, "赌博押注");
      if (Random.chance(0.45)) {
        st.resources.cash += 100;
        st.resources.totalEarned += 50;
        addDailyTransaction(st, "income", "side_job", 100, "赌博赢钱");
        st.needs.happiness = Math.min(100, st.needs.happiness + 10);
        st.flags._everWonGamble = true; // 成就追踪
        StateManager.addMessage("🎲 赢了！100 块到手！", "success");
      } else {
        st.needs.happiness = Math.max(0, st.needs.happiness - 8);
        StateManager.addMessage("🎲 输了...50 块没了。", "danger");
      }
      consumeAP(20);
    },
  });

  // === 社交 / 家庭类 ===
  actions.push({
    id: "call_home",
    name: "给家里打电话",
    desc: "用公用电话给爸妈报平安，听听唠叨。",
    icon: "📞",
    costEstimate: 2,
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 2) {
        StateManager.addMessage("📞 电话费都付不起...", "warning");
        return;
      }
      st.resources.cash -= 2;
      addDailyTransaction(st, "expense", "misc", 2, "给家里打电话");
      st.needs.happiness = Math.min(100, st.needs.happiness + 15);
      st.needs.hunger = Math.max(0, st.needs.hunger - 3);
      if (Random.chance(0.3)) {
        st.resources.cash += 200; // 爸妈塞的钱
        addDailyTransaction(st, "income", "gift", 200, "爸妈给的零花钱");
        StateManager.addMessage(
          "📞 妈妈在电话里哭了，让你注意身体，转了 200 块。",
          "success",
        );
        st.resources.totalEarned += 200;
      } else {
        StateManager.addMessage(
          "📞 和爸妈聊了 10 分钟，心情好多了。",
          "success",
        );
      }
      consumeAP(20);
    },
  });

  actions.push({
    id: "remit_home",
    name: "给家里汇款",
    desc: "把一部分钱寄回老家。",
    icon: "💌",
    costEstimate: "200~1000",
    handler: () => {
      showRemitModal();
    },
  });

  actions.push({
    id: "internet_bar",
    name: "网吧上网",
    desc: "花 5 块在网吧上 2 小时网，可以查资料、刷视频、玩游戏。",
    icon: "💻",
    costEstimate: 5,
    apCost: 20,
    payEstimate: "智力+0.3, 随机技能XP",
    disabled: state.resources.cash < 5,
    reqFail: state.resources.cash < 5 ? "现金不足" : null,
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 5) {
        StateManager.addMessage("💻 5 块都掏不出来。", "warning");
        return;
      }
      st.resources.cash -= 5;
      st.needs.fatigue = Math.min(100, st.needs.fatigue + 8);
      st.player.intelligence = Math.min(100, st.player.intelligence + 0.3);
      const skills = ["english", "coding", "accounting"];
      const sk = Random.fromArray(skills);
      st.skills[sk].xp += Random.int(5, 14);
      st.needs.happiness = Math.min(100, st.needs.happiness + 5);
      StateManager.addMessage(
        "💻 在网吧待了 2 小时，智力+，还有点收获。",
        "info",
      );
      consumeAP(20);
    },
  });

  actions.push({
    id: "salon_chat",
    name: "路边理发店聊天",
    desc: "花 10 块剪个头发，顺便听听老板吹牛。需要敏捷≥18才能帮上忙。",
    icon: "💈",
    costEstimate: 10,
    apCost: 20,
    payEstimate: "心情+10",
    disabled: state.player.agility < 18 || state.resources.cash < 10,
    reqFail:
      state.player.agility < 18
        ? "需敏捷≥18"
        : state.resources.cash < 10
          ? "现金不足"
          : null,
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 10) {
        StateManager.addMessage("💈 剪不起头。", "warning");
        return;
      }
      st.resources.cash -= 10;
      st.needs.hygiene = Math.min(100, st.needs.hygiene + 25);
      st.needs.happiness = Math.min(100, st.needs.happiness + 10);
      st.player.fame = Math.min(100, st.player.fame + 1);
      StateManager.addMessage(
        "💈 剪了个利索的短发！清爽多了，运气好像也好了点。",
        "success",
      );
      consumeAP(20);
    },
  });

  // === 学习类 ===
  actions.push({
    id: "self_study",
    name: "图书馆自习",
    desc: "去图书馆（商业区旁）安静看书。",
    icon: "📖",
    apCost: 20,
    payEstimate: "技能XP+30",
    handler: () => {
      const st = StateManager.getState();
      st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
      const skills = Object.keys(st.skills);
      const key = Random.fromArray(skills);
      // 小美好感60解锁图书馆内部账号：学习效率+30%
      var xpMult = st.flags.xiaomeiLibrary ? 1.3 : 1.0;
      var xpGain = Math.floor((30 + Random.int(0, 19)) * xpMult);
      st.skills[key].xp += xpGain;
      st.player.intelligence = Math.min(100, st.player.intelligence + 0.2);
      var libTag = st.flags.xiaomeiLibrary
        ? "（小美的图书馆账号让效率提升30%）"
        : "";
      StateManager.addMessage(
        `📖 在图书馆泡了一下午，${key} XP+${xpGain}${libTag}！`,
        "success",
      );
      consumeAP(20);
    },
  });

  actions.push({
    id: "night_school",
    name: "上夜校",
    desc: "晚上上夜校，提升智力+相关技能。需要 ¥50 学费，智力≥25。",
    icon: "🌃",
    costEstimate: 50,
    apCost: 20,
    payEstimate: "智力+1, 技能+",
    disabled: state.player.intelligence < 25 || state.resources.cash < 50,
    reqFail:
      state.player.intelligence < 25
        ? "需智力≥25"
        : state.resources.cash < 50
          ? "现金不足"
          : null,
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 50) {
        StateManager.addMessage("🌃 学费 50 块都交不起。", "warning");
        return;
      }
      st.resources.cash -= 50;
      st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
      st.player.intelligence = Math.min(100, st.player.intelligence + 1);
      st.skills.english.xp += 30;
      st.skills.coding.xp += 30;
      st.skills.accounting.xp += 20;
      StateManager.addMessage(
        "🌃 夜校下课！智力+1，英语/编程/会计都涨了。累趴。",
        "success",
      );
      consumeAP(20);
    },
  });

  // === 生活类 ===
  actions.push({
    id: "gym",
    name: "办健身卡锻炼",
    desc: "去健身房办月卡，提升体质和敏捷。",
    icon: "🏋️",
    costEstimate: 200,
    apCost: 20,
    payEstimate: "体质+1, 敏捷+0.5",
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 200) {
        StateManager.addMessage("🏋️ 月卡 200 块都办不起。", "warning");
        return;
      }
      st.resources.cash -= 200;
      st.player.physique = Math.min(100, st.player.physique + 1);
      st.player.agility = Math.min(100, st.player.agility + 0.5);
      st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
      st.needs.happiness = Math.min(100, st.needs.happiness + 6);
      st.status.health = Math.min(100, st.status.health + 3);
      StateManager.addMessage(
        "🏋️ 在健身房撸铁 2 小时！体质+1，敏捷+0.5，累了但快乐。",
        "success",
      );
      consumeAP(20);
    },
  });

  actions.push({
    id: "movie",
    name: "看场电影",
    desc: "去影院看场电影放松一下。",
    icon: "🎬",
    costEstimate: 35,
    apCost: 20,
    payEstimate: "心情+18",
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 35) {
        StateManager.addMessage("🎬 35 块都掏不出来。", "warning");
        return;
      }
      st.resources.cash -= 35;
      st.needs.fatigue = Math.max(0, st.needs.fatigue - 8);
      st.needs.happiness = Math.min(100, st.needs.happiness + 18);
      st.player.fame = Math.min(100, st.player.fame + 0.5);
      StateManager.addMessage(
        "🎬 看了一部催泪电影，感动得稀里哗啦。心情大好！",
        "success",
      );
      consumeAP(20);
    },
  });

  actions.push({
    id: "ktv",
    name: "KTV 唱歌",
    desc: "约朋友去 KTV 吼两小时。",
    icon: "🎤",
    costEstimate: 80,
    apCost: 20,
    payEstimate: "心情+25, 人缘+",
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 80) {
        StateManager.addMessage("🎤 80 块都凑不齐。", "warning");
        return;
      }
      st.resources.cash -= 80;
      st.needs.happiness = Math.min(100, st.needs.happiness + 25);
      st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
      st.needs.hunger = Math.max(0, st.needs.hunger - 8);
      st.player.fame = Math.min(100, st.player.fame + 1);
      StateManager.addMessage(
        "🎤 吼了 2 小时，嗓子都哑了！心情+25。",
        "success",
      );
      consumeAP(20);
    },
  });

  actions.push({
    id: "pharmacy",
    name: "买药/买营养品",
    desc: "去药房买维生素、补品等。需要 ¥30~80。",
    icon: "💊",
    costEstimate: 30,
    apCost: 20,
    payEstimate: "健康+5",
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 30) {
        StateManager.addMessage("💊 30 块都掏不出来。", "warning");
        return;
      }
      st.resources.cash -= 30;
      st.status.health = Math.min(100, st.status.health + 5);
      st.player.physique = Math.min(100, st.player.physique + 0.3);
      StateManager.addMessage(
        "💊 买了瓶复合维生素，感觉自己又行了。健康+5。",
        "success",
      );
      consumeAP(20);
    },
  });

  actions.push({
    id: "supermarket",
    name: "去超市采购",
    desc: "去超市买点吃的用的。需要 ¥30~60。",
    icon: "🛒",
    costEstimate: 30,
    apCost: 20,
    payEstimate: "饥饱+30, 卫生+",
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 30) {
        StateManager.addMessage("🛒 30 块都掏不出来。", "warning");
        return;
      }
      st.resources.cash -= 30;
      st.needs.hunger = Math.min(100, st.needs.hunger + 30);
      st.needs.hygiene = Math.min(100, st.needs.hygiene + 15);
      st.needs.happiness = Math.min(100, st.needs.happiness + 3);
      StateManager.addMessage(
        "🛒 超市采购了泡面、纸巾、零食。饥饱+30，卫生+15。",
        "success",
      );
      consumeAP(20);
    },
  });

  actions.push({
    id: "clothing",
    name: "买件新衣服",
    desc: "去服装店买件像样的衣服，提升卫生/心情/名气。",
    icon: "👕",
    costEstimate: 80,
    apCost: 20,
    payEstimate: "卫生+10, 名气+",
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 80) {
        StateManager.addMessage("👕 80 块都掏不出来。", "warning");
        return;
      }
      st.resources.cash -= 80;
      st.needs.hygiene = Math.min(100, st.needs.hygiene + 10);
      st.needs.happiness = Math.min(100, st.needs.happiness + 8);
      st.player.fame = Math.min(100, st.player.fame + 1);
      StateManager.addMessage(
        "👕 买了一件衬衫！看起来人模人样的。卫生+10，名气+1。",
        "success",
      );
      consumeAP(20);
    },
  });

  // === 投资 / 理财类 ===
  actions.push({
    id: "lottery",
    name: "买张彩票",
    desc: "花 2 块买注彩票，搏一搏单车变摩托。",
    icon: "🎰",
    costEstimate: 2,
    apCost: 20,
    payEstimate: "0或50万",
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 2) {
        StateManager.addMessage("🎰 2 块都掏不出来。", "warning");
        return;
      }
      st.resources.cash -= 2;
      const roll = Random.float(0, 1);
      if (roll < 0.00005) {
        st.resources.cash += 500000;
        st.resources.totalEarned += 500000;
        st.needs.happiness = Math.min(100, st.needs.happiness + 50);
        StateManager.addMessage(
          "🎰🎉🎉🎉 中了头奖！¥500,000 到账！财务自由就在眼前！",
          "success",
        );
      } else if (roll < 0.005) {
        const prize = Random.int(50, 249);
        st.resources.cash += prize;
        st.resources.totalEarned += prize;
        st.needs.happiness = Math.min(100, st.needs.happiness + 15);
        StateManager.addMessage(`🎰 小赚一笔！中了 ¥${prize}！`, "success");
      } else {
        st.needs.happiness = Math.max(0, st.needs.happiness - 2);
        StateManager.addMessage("🎰 没中。", "info");
      }
      consumeAP(20);
    },
  });

  actions.push({
    id: "yu_e_bao",
    name: "买余额宝理财",
    desc: "把闲钱存进余额宝，每天 0.01% 收益。",
    icon: "💰",
    costEstimate: "100起",
    apCost: 20,
    payEstimate: "日息0.01%",
    handler: () => {
      showYuEBaoModal();
    },
  });

  actions.push({
    id: "buy_insurance",
    name: "买保险",
    desc: "花 200 买份意外险，下次受伤/生病能赔 500。",
    icon: "🛡️",
    costEstimate: 200,
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 200) {
        StateManager.addMessage("🛡️ 保险都买不起。", "warning");
        return;
      }
      st.resources.cash -= 200;
      st.flags.hasInsurance = true;
      st.flags.insuranceExpire = st.player.day + 30;
      StateManager.addMessage(
        "🛡️ 买了 30 天意外险！期间受伤/生病赔付 500。",
        "success",
      );
      consumeAP(20);
    },
  });

  // === 梦想 / 自我实现类 ===
  actions.push({
    id: "diary",
    name: "写日记",
    desc: "记录今天的心情。回顾一下，反思成长。",
    icon: "📓",
    handler: () => {
      const st = StateManager.getState();
      st.needs.happiness = Math.min(100, st.needs.happiness + 8);
      st.player.mental = Math.min(100, st.player.mental + 0.5);
      st.needs.fatigue = Math.max(0, st.needs.fatigue - 5);
      StateManager.addMessage(
        "📓 在小本本上写了几页。感觉思路清晰多了。",
        "info",
      );
      consumeAP(20);
    },
  });

  actions.push({
    id: "meditation",
    name: "冥想打坐",
    desc: "在公园/家里静坐 15 分钟。恢复心智、缓解疲劳。",
    icon: "🧘",
    handler: () => {
      const st = StateManager.getState();
      st.player.mental = Math.min(100, st.player.mental + 1);
      st.needs.fatigue = Math.max(0, st.needs.fatigue - 12);
      st.needs.happiness = Math.min(100, st.needs.happiness + 6);
      StateManager.addMessage(
        "🧘 闭眼冥想了 15 分钟。内心平静，疲劳-12。",
        "success",
      );
      consumeAP(20);
    },
  });

  actions.push({
    id: "start_business",
    name: "摆地摊创业",
    desc:
      "去批发市场进点货，到商业区摆摊卖。销售技能影响收益（当前：" +
      (state.skills.sales.level > 0
        ? "+" + (state.skills.sales.level * 0.8).toFixed(0) + "%"
        : "无加成") +
      "）。",
    icon: "🏪",
    costEstimate: 200,
    apCost: 20,
    payEstimate: "100~350",
    disabled: state.resources.cash < 200,
    reqFail: state.resources.cash < 200 ? "现金不足" : null,
    handler: () => {
      const st = StateManager.getState();
      if (st.resources.cash < 200) {
        StateManager.addMessage("🏪 200 块启动资金都没有。", "warning");
        return;
      }
      st.resources.cash -= 200;
      st.needs.fatigue = Math.min(100, st.needs.fatigue + 25);
      // 销售技能影响收益倍数：0级60%起步，每级+0.8%，50级达到100%基础收益，50级以上额外加成
      var salesLvl = st.skills.sales.level || 0;
      var salesMultiplier = Math.min(0.6 + salesLvl * 0.008, 1.0); // 上限100%基础收益
      if (salesLvl > 50) {
        salesMultiplier = 1.0 + (salesLvl - 50) * 0.005; // 50级以上额外+0.5%/级
      }
      var luck = Random.float(0, 1);
      var baseEarned = 0;
      var xpGain = 0;
      if (luck < 0.25) {
        // 大赚
        baseEarned = Random.int(150, 349);
        xpGain = Random.int(8, 14); // 8~14 XP
        st.player.fame = Math.min(100, st.player.fame + 2);
      } else if (luck < 0.7) {
        // 小赚
        baseEarned = Random.int(30, 119);
        xpGain = Random.int(4, 8); // 4~8 XP
      } else if (luck < 0.85) {
        // 勉强回本
        baseEarned = Random.int(180, 219);
        xpGain = Random.int(2, 4); // 2~4 XP
        StateManager.addMessage("🏪 摆摊勉强度日，赚了点辛苦钱。", "warning");
      } else {
        // 亏了
        StateManager.addMessage(
          "🏪 摆摊失败！货没卖掉，城管还罚了款。",
          "danger",
        );
        st.resources.cash = Math.max(0, st.resources.cash - 50);
        st.needs.happiness = Math.max(0, st.needs.happiness - 5);
        xpGain = Random.int(1, 3); // 1~3 XP（失败也能学点教训）
      }
      // 应用销售技能收益倍率
      var earned = Math.floor(baseEarned * salesMultiplier);
      if (earned > 0) {
        st.resources.cash += earned;
        st.resources.totalEarned += earned;
        addDailyTransaction(st, "income", "side_job", earned, "摆摊收入");
      }
      // 销售技能经验
      if (xpGain > 0) {
        st.skills.sales.xp = (st.skills.sales.xp || 0) + xpGain;
        // 检查升级
        while (
          st.skills.sales.xp >= (st.skills.sales.level + 1) * 120 &&
          st.skills.sales.level < 100
        ) {
          st.skills.sales.xp -= (st.skills.sales.level + 1) * 120;
          st.skills.sales.level++;
          if (st.player.agility < 100)
            st.player.agility = Math.min(100, st.player.agility + 1);
          StateManager.addMessage(
            "⭐ 销售技能升级到 Lv." + st.skills.sales.level + "！",
            "success",
          );
        }
      }
      if (earned > 0) {
        StateManager.addMessage(
          "🏪 摆摊收入 ¥" +
            earned +
            "（销售Lv." +
            salesLvl +
            "，倍率×" +
            salesMultiplier.toFixed(2) +
            "）📚销售+" +
            xpGain +
            "XP",
          "success",
        );
      }
      consumeAP(20);
    },
  });

  // === NPC 送礼 ===
  const npcsHere =
    typeof getNpcsAtLocation === "function"
      ? getNpcsAtLocation(state.trade.currentLocation)
      : [];
  const goodsIds =
    typeof GOODS !== "undefined"
      ? GOODS.map(function (g) {
          return g.id;
        })
      : [];
  const invGoods = (state.inventory.items || []).filter(function (item) {
    return goodsIds.includes(item.id) && item.qty > 0;
  });
  if (npcsHere.length > 0 && invGoods.length > 0) {
    actions.push({
      id: "gift_npc",
      name: "送礼联络感情",
      desc: "将背包里的商品送给附近的NPC。送对口的礼物好感+15，普通礼物好感+5。每天每人限一次。",
      icon: "🎁",
      apCost: 10,
      handler: function () {
        showGiftModal();
      },
    });
  }

  // === 编程自由职业 ===
  const codingLvl = state.skills.coding.level || 0;
  if (
    codingLvl >= 15 &&
    (state.trade.currentLocation === "school" ||
      state.trade.currentLocation === "commercialDist")
  ) {
    const estMin = 80 + Math.floor(codingLvl * 1.5);
    const estMax = 130 + Math.floor(codingLvl * 1.5);
    actions.push({
      id: "freelance_coding",
      name: "接网络外包单",
      desc:
        "在网吧或咖啡厅接网络开发单子。编程Lv." +
        codingLvl +
        "，预计收入 ¥" +
        estMin +
        "~" +
        estMax +
        "。每单消耗30AP。",
      icon: "💻",
      apCost: 30,
      payEstimate: estMin + "~" + estMax,
      pricePreview:
        typeof buildCodingPreview === "function"
          ? buildCodingPreview(state, {
              name: "网络外包单",
              budget: Math.round((estMin + estMax) / 2),
              complexity: Math.ceil(codingLvl / 30) + 1,
              deadline: 3,
            })
          : "",
      handler: function () {
        const st = StateManager.getState();
        const lvl = st.skills.coding.level || 0;
        const earned = Math.floor(80 + lvl * 1.5 + Random.float(0, 50));
        st.resources.cash += earned;
        st.resources.totalEarned += earned;
        addDailyTransaction(st, "income", "job_income", earned, "编程外包");
        st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
        st.player.intelligence = Math.min(100, st.player.intelligence + 0.2);
        const xpGain =
          8 +
          Random.int(0, 11) +
          Math.floor((st.player.intelligence || 0) / 20);
        st.skills.coding.xp = (st.skills.coding.xp || 0) + xpGain;
        while (
          st.skills.coding.xp >= (st.skills.coding.level + 1) * 120 &&
          st.skills.coding.level < 100
        ) {
          st.skills.coding.xp -= (st.skills.coding.level + 1) * 120;
          st.skills.coding.level++;
          if (st.player.intelligence < 100)
            st.player.intelligence = Math.min(100, st.player.intelligence + 1);
          StateManager.addMessage(
            "⭐ 编程技能升级到 Lv." + st.skills.coding.level + "！",
            "success",
          );
        }
        StateManager.addMessage(
          "💻 完成网络外包单！收入 ¥" + earned + "。📚编程+" + xpGain + "XP",
          "success",
        );
        consumeAP(30);
      },
    });
  }

  // === v3.2 道德恢复行动（捐款/义工）===
  var morality = state.player.morality || 50;
  // 捐款：寺庙/银行可捐，每¥100=+1道德
  if (
    state.trade.currentLocation === "temple" ||
    state.trade.currentLocation === "bank"
  ) {
    actions.push({
      id: "donate_money",
      name: "💰 捐款行善",
      desc:
        "捐钱给需要的人。每捐¥100道德+1，帮助他人让自己心安。当前道德" +
        morality +
        "。",
      icon: "💰",
      apCost: 5,
      handler: function () {
        var st = StateManager.getState();
        var maxDonate = Math.min(st.resources.cash, 1000);
        if (maxDonate < 100) {
          StateManager.addMessage(
            "💸 你翻遍口袋只找到¥" +
              (st.resources.cash || 0) +
              "，连捐款都不够。",
            "warning",
          );
          return;
        }
        var amount = Math.min(maxDonate, 500);
        st.resources.cash -= amount;
        var moralGain = Math.floor(amount / 100);
        if (typeof applyMoralityChange === "function") {
          applyMoralityChange(st, moralGain, "捐款");
        } else {
          st.player.morality = Math.min(
            100,
            (st.player.morality || 50) + moralGain,
          );
        }
        if (typeof addDailyTransaction === "function") {
          addDailyTransaction(st, "expense", "misc", amount, "捐款行善");
        }
        StateManager.addMessage(
          "🙏 你捐了¥" +
            amount +
            "，感觉心里踏实了一些。道德+" +
            moralGain +
            "。",
          "success",
        );
        consumeAP(5);
      },
    });
  }

  // 义工：医院/公园/寺庙可做，每次+3-5道德+8-20心情
  if (
    state.trade.currentLocation === "hospital" ||
    state.trade.currentLocation === "park" ||
    state.trade.currentLocation === "temple"
  ) {
    actions.push({
      id: "volunteer_work",
      name: "🤝 做义工",
      desc:
        "去医院/公园/寺庙做志愿者，帮助他人。提升道德和心情。当前道德" +
        morality +
        "。",
      icon: "🤝",
      apCost: 15,
      handler: function () {
        var st = StateManager.getState();
        var moralGain = 3 + Math.floor(Random.float(0, 3));
        var happyGain = 8 + Math.floor(Random.float(0, 13));
        st.player.morality = Math.min(
          100,
          (st.player.morality || 50) + moralGain,
        );
        st.needs.happiness = Math.min(
          100,
          (st.needs.happiness || 50) + happyGain,
        );
        st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
        st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
        StateManager.addMessage(
          "🤝 你花了一上午做义工，帮助了" +
            (st.trade.currentLocation === "hospital"
              ? "病患"
              : st.trade.currentLocation === "park"
                ? "清洁公园"
                : "寺庙修缮") +
            "。道德+" +
            moralGain +
            "，心情+" +
            happyGain +
            "。",
          "success",
        );
        consumeAP(15);
      },
    });
  }

  // === 确立/更改人生梦想（首次强制在游戏开始弹窗，后续可在公园/家里更改） ===
  var hasDream = state.flags && state.flags._dreamId;
  var atRestfulLoc =
    state.trade.currentLocation === "park" ||
    state.trade.currentLocation === "slum";
  if (!hasDream && atRestfulLoc) {
    actions.push({
      id: "set_dream",
      name: "确立人生目标",
      desc: "在这座城市，你想要什么？选定一个方向，脚踏实地去努力。",
      icon: "🌟",
      apCost: 5,
      handler: function () {
        showDreamSelectModal();
      },
    });
  }

  // v3.2 人生目标更改入口（已有梦想时，可在任何地点随时查看和更改）
  if (hasDream) {
    actions.push({
      id: "change_dream",
      name: "🎯 更改人生目标",
      desc:
        "当前目标：" +
        (function () {
          var d =
            typeof getCurrentDream === "function"
              ? getCurrentDream(state)
              : null;
          return d ? d.icon + " " + d.name : "";
        })(),
      icon: "🎯",
      apCost: 5,
      handler: function () {
        showDreamSelectModal();
      },
    });
  }

  // === 查看梦想进度（已有梦想时显示） ===
  if (hasDream) {
    var dream =
      typeof getCurrentDream === "function" ? getCurrentDream(state) : null;
    if (dream) {
      var progress =
        typeof getDreamProgress === "function" ? getDreamProgress(state) : 0;
      var curTitle =
        typeof getDreamCurrentTitle === "function"
          ? getDreamCurrentTitle(state)
          : "";
      actions.push({
        id: "view_dream",
        name: "梦想：" + dream.name,
        desc: "进度 " + progress + "% · 当前里程碑：" + curTitle,
        icon: "🌟",
        apCost: 0,
        handler: function () {
          showDreamProgressModal();
        },
      });
    }
  }

  // === 周末市集（每逢day%7=0或6出现：公园/商业区） ===
  var dayOfWeek = state.player.day % 7;
  var isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  var atMarketLoc =
    state.trade.currentLocation === "park" ||
    state.trade.currentLocation === "commercialDist" ||
    state.trade.currentLocation === "wholesaleMarket";
  var weekendMarketDoneKey =
    "_weekendMarket_" + Math.floor(state.player.day / 7);
  if (isWeekend && atMarketLoc && !state.flags[weekendMarketDoneKey]) {
    actions.push({
      id: "weekend_market",
      name: "周末集市摆摊",
      desc: "周末人流量翻倍！临时在集市摆个摊，收益远超平时。一周一次机会。",
      icon: "🏪",
      apCost: 25,
      handler: function () {
        var st = StateManager.getState();
        var dk = "_weekendMarket_" + Math.floor(st.player.day / 7);
        if (st.flags[dk]) {
          StateManager.addMessage(
            "🏪 本周集市机会已用过了，下周再来。",
            "warning",
          );
          return;
        }
        st.flags[dk] = true;
        var salesLvl = st.skills.sales ? st.skills.sales.level || 0 : 0;
        var base = Random.int(180, 329);
        var bonus = Math.floor(salesLvl * 1.5);
        var earned = base + bonus;
        var fameGain = Random.int(3, 7);
        st.resources.cash += earned;
        st.resources.totalEarned += earned;
        addDailyTransaction(st, "income", "side_job", earned, "周末集市摆摊");
        st.player.fame = Math.min(100, st.player.fame + fameGain);
        st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
        if (st.skills.sales) st.skills.sales.xp += 15;
        StateManager.addMessage(
          "🏪 周末集市火爆！你摆摊赚了¥" +
            earned +
            "，认识了不少顾客。名气+" +
            fameGain +
            "，销售XP+15。",
          "success",
        );
        consumeAP(25);
      },
    });
  }

  // === 周一打听消息（每逢day%7=1出现：任意地点，每周限一次） ===
  var mondayInfoKey = "_mondayInfo_" + Math.floor(state.player.day / 7);
  if (dayOfWeek === 1 && !state.flags[mondayInfoKey]) {
    actions.push({
      id: "monday_job_board",
      name: "打听本周零工机会",
      desc: "周一是信息最新鲜的时候。四处打听，可能发现本周收入最高的临时活。每周限一次。",
      icon: "📋",
      apCost: 10,
      handler: function () {
        var st = StateManager.getState();
        var mk = "_mondayInfo_" + Math.floor(st.player.day / 7);
        if (st.flags[mk]) {
          StateManager.addMessage("📋 本周的情报已经打听过了。", "warning");
          return;
        }
        st.flags[mk] = true;
        var roll = Random.float(0, 1);
        if (roll < 0.4) {
          var cashTip = Random.int(100, 249);
          st.resources.cash += cashTip;
          st.resources.totalEarned += cashTip;
          StateManager.addMessage(
            "📋 打听到一个搬家公司临时招人，接了个单赚了¥" +
              cashTip +
              "！情报就是钱。",
            "success",
          );
        } else if (roll < 0.7) {
          st.player.intelligence = Math.min(100, st.player.intelligence + 1);
          st.needs.happiness = Math.min(100, st.needs.happiness + 5);
          StateManager.addMessage(
            "📋 到处问了问，没找到特别赚钱的活，但跟邻居聊了不少，涨了见识。智力+1。",
            "info",
          );
        } else {
          var xpGainM = Random.int(25, 49);
          var skillKeys = Object.keys(st.skills);
          var sk = Random.fromArray(skillKeys);
          st.skills[sk].xp += xpGainM;
          StateManager.addMessage(
            "📋 碰到个老师傅，聊了很久，" +
              sk +
              " XP+" +
              xpGainM +
              "！见人长一智。",
            "success",
          );
        }
        consumeAP(10);
      },
    });
  }
}

/** 梦想选择模态框 */
function showDreamSelectModal() {
  if (typeof DREAMS === "undefined") return;
  var optHtml = DREAMS.map(function (d) {
    return (
      "<div onclick=\"selectDream('" +
      d.id +
      '\')" style="padding:10px 14px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;cursor:pointer;transition:all 0.2s;" ' +
      "onmouseover=\"this.style.borderColor='var(--accent)';\" onmouseout=\"this.style.borderColor='var(--border)';\"> " +
      "<strong>" +
      d.icon +
      " " +
      d.name +
      "</strong>" +
      '<div style="font-size:11px;color:var(--text-secondary);margin-top:4px;">' +
      d.desc +
      "</div>" +
      "</div>"
    );
  }).join("");
  showModal({
    title: "🌟 确立人生目标",
    body:
      '<p style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;">选定一个方向，游戏会追踪你的进度，在每个里程碑时给你一段专属故事。</p>' +
      optHtml,
    buttons: [{ text: "稍后再说", cls: "", callback: function () {} }],
  });
}

window.selectDream = function (dreamId) {
  document.querySelector(".modal-overlay") &&
    document.querySelector(".modal-overlay").remove();
  var st = StateManager.getState();
  st.flags._dreamId = dreamId;
  st.flags._dreamMilestone = 0;
  st.flags._dreamStartDay = st.player.day;
  var dream =
    typeof getCurrentDream === "function" ? getCurrentDream(st) : null;
  if (dream) {
    StateManager.addMessage(
      dream.icon +
        " 你确立了人生目标：" +
        dream.name +
        "。\n" +
        dream.desc +
        "。\n第一个里程碑：" +
        (dream.milestones[0] ? dream.milestones[0].title : ""),
      "event",
    );
  }
};

/** 梦想进度模态框 */
function showDreamProgressModal() {
  var st = StateManager.getState();
  var dream =
    typeof getCurrentDream === "function" ? getCurrentDream(st) : null;
  if (!dream) return;
  var milestoneHtml = dream.milestones
    .map(function (m, i) {
      var done = (st.flags._dreamMilestone || 0) > i;
      var current = (st.flags._dreamMilestone || 0) === i;
      return (
        '<div style="padding:8px 12px;margin:4px 0;border-radius:5px;background:' +
        (done
          ? "rgba(74,158,92,0.1)"
          : current
            ? "rgba(74,158,92,0.05)"
            : "var(--bg-card)") +
        ";border:1px solid " +
        (done
          ? "var(--accent)"
          : current
            ? "rgba(74,158,92,0.3)"
            : "var(--border)") +
        ';font-size:12px;">' +
        (done ? "✅ " : current ? "⏳ " : "⬜ ") +
        "<strong>" +
        m.title +
        "</strong>" +
        (current
          ? '<div style="font-size:11px;color:var(--text-secondary);margin-top:4px;">进行中…</div>'
          : "") +
        "</div>"
      );
    })
    .join("");
  var progress =
    typeof getDreamProgress === "function" ? getDreamProgress(st) : 0;
  showModal({
    title: dream.icon + " " + dream.name,
    body:
      '<div style="margin-bottom:12px;">' +
      '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;">总进度：' +
      progress +
      "%</div>" +
      '<div style="background:var(--bg-input);border-radius:4px;height:8px;overflow:hidden;">' +
      '<div style="width:' +
      progress +
      '%;height:100%;background:var(--accent);border-radius:4px;transition:width 0.5s;"></div>' +
      "</div></div>" +
      milestoneHtml,
    buttons: [{ text: "关闭", cls: "", callback: function () {} }],
  });
}

/** 汇款模态框 */
function showRemitModal() {
  const state = StateManager.getState();
  showModal({
    title: "💌 给家里汇款",
    body: `<p>当前现金: ¥${state.resources.cash.toLocaleString()}</p>
           <p style="font-size:11px;color:var(--text-secondary);">每汇 100 元，心情+3，家庭关系+1（汇款给家人不会涨名气，名气来自公共贡献）。</p>
           <label>汇款金额: <input id="remit-amount" type="number" min="100" max="${state.resources.cash}" value="200" style="width:100%;padding:8px;margin-top:8px;background:var(--bg-input);border:1px solid var(--border);color:var(--text-primary);border-radius:4px;"></label>`,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      {
        text: "汇款",
        cls: "btn-primary",
        callback: () => {
          const amt = Math.max(
            0,
            Math.min(
              state.resources.cash,
              parseInt(document.getElementById("remit-amount")?.value || 0),
            ),
          );
          if (amt < 100) {
            StateManager.addMessage("💌 至少汇 100 块。", "warning");
            return;
          }
          state.resources.cash -= amt;
          state.needs.happiness = Math.min(
            100,
            state.needs.happiness + (amt / 100) * 3,
          );
          // 家庭关系提升（不增加名气，名气来自公共贡献如捐款）
          if (!state.family) state.family = {};
          if (state.family.relationshipStage === undefined)
            state.family.relationshipStage = "stranger";
          // 汇款提升家庭关系阶段
          var stageOrder = [
            "stranger",
            "acquaintance",
            "friend",
            "good_friend",
            "crush",
            "dating",
            "engaged",
            "married",
          ];
          var currentIdx = stageOrder.indexOf(state.family.relationshipStage);
          if (
            amt >= 500 &&
            currentIdx < stageOrder.length - 1 &&
            Math.random() < 0.3
          ) {
            state.family.relationshipStage = stageOrder[currentIdx + 1];
            StateManager.addMessage(
              `💌 给家里汇了 ¥${amt.toLocaleString()}，爸妈很高兴，家庭关系提升到「${state.family.relationshipStage}」。`,
              "success",
            );
          } else {
            StateManager.addMessage(
              `💌 给家里汇了 ¥${amt.toLocaleString()}，爸妈很高兴。`,
              "success",
            );
          }
          document.querySelector(".modal-overlay")?.remove();
          renderAll();
        },
      },
    ],
  });
}

/** 余额宝模态框 */
function showYuEBaoModal() {
  const state = StateManager.getState();
  const yue = state.flags.yuEBao || 0;
  const todayInterest = Math.floor(yue * 0.0001);
  showModal({
    title: "💰 余额宝理财",
    body: `
      <p>当前余额宝: <strong style="color:var(--success);">¥${yue.toLocaleString()}</strong></p>
      <p>今日收益预估: <strong>+¥${todayInterest}</strong>（日息 0.01%）</p>
      <p>现金: ¥${state.resources.cash.toLocaleString()}</p>
      <label>转入金额: <input id="yue-amount" type="number" min="100" max="${state.resources.cash}" value="${Math.floor(state.resources.cash)}" style="width:100%;padding:8px;margin-top:8px;background:var(--bg-input);border:1px solid var(--border);color:var(--text-primary);border-radius:4px;"></label>
    `,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      {
        text: "全部转出",
        cls: "btn-warning",
        callback: () => {
          state.resources.cash += yue;
          state.flags.yuEBao = 0;
          StateManager.addMessage(
            `💰 从余额宝转出 ¥${yue.toLocaleString()}。`,
            "info",
          );
          document.querySelector(".modal-overlay")?.remove();
          renderAll();
        },
      },
      {
        text: "确认转入",
        cls: "btn-success",
        callback: () => {
          const amt = Math.max(
            0,
            Math.min(
              state.resources.cash,
              parseInt(document.getElementById("yue-amount")?.value || 0),
            ),
          );
          if (amt < 100) {
            StateManager.addMessage("💰 至少转入 100 块。", "warning");
            return;
          }
          state.resources.cash -= amt;
          state.flags.yuEBao = (state.flags.yuEBao || 0) + amt;
          StateManager.addMessage(
            `💰 转入余额宝 ¥${amt.toLocaleString()}。`,
            "success",
          );
          document.querySelector(".modal-overlay")?.remove();
          renderAll();
        },
      },
    ],
  });
}

/** 送礼模态框 */
function showGiftModal() {
  var state = StateManager.getState();
  var currentLoc = state.trade.currentLocation;
  var npcsHere =
    typeof getNpcsAtLocation === "function"
      ? getNpcsAtLocation(currentLoc)
      : [];
  if (npcsHere.length === 0) {
    StateManager.addMessage("🎁 这里没有熟悉的人可以送礼。", "warning");
    return;
  }
  var goodsIds =
    typeof GOODS !== "undefined"
      ? GOODS.map(function (g) {
          return g.id;
        })
      : [];
  var invGoods = (state.inventory.items || []).filter(function (item) {
    return goodsIds.includes(item.id) && item.qty > 0;
  });
  if (invGoods.length === 0) {
    StateManager.addMessage(
      "🎁 背包里没有可以送人的商品。去批发市场买些小礼品吧。",
      "warning",
    );
    return;
  }
  var npcOptions = npcsHere
    .map(function (npc) {
      var rel = state.relationships[npc.id] || { affinity: 0 };
      var label =
        typeof getAffinityLabel === "function"
          ? getAffinityLabel(rel.affinity)
          : "";
      var bdTag = state.flags["_birthdayToday_" + npc.id] ? " 🎂生日" : "";
      return (
        '<option value="' +
        npc.id +
        '">' +
        npc.name +
        "（" +
        npc.role +
        "）" +
        label +
        bdTag +
        "</option>"
      );
    })
    .join("");
  var goodOptions = invGoods
    .map(function (item) {
      var goodDef =
        typeof GOODS !== "undefined"
          ? GOODS.find(function (g) {
              return g.id === item.id;
            })
          : null;
      var name = goodDef ? goodDef.name : item.id;
      return (
        '<option value="' +
        item.id +
        '">' +
        name +
        " ×" +
        item.qty +
        "</option>"
      );
    })
    .join("");
  showModal({
    title: "🎁 送礼联络感情",
    body:
      (function () {
        var note =
          '<p style="font-size:12px;color:var(--text-secondary);">投其所好+15好感，普通礼物+5好感，每天每人限送一次。</p>';
        var festBonus =
          typeof getFestivalGiftBonus === "function"
            ? getFestivalGiftBonus()
            : 0;
        if (festBonus > 0)
          note +=
            '<p style="font-size:12px;color:#c4553d;">🎊 节日期间送礼额外+' +
            festBonus +
            "好感！</p>";
        // 生日提示
        var birthdayNpcs = npcsHere.filter(function (n) {
          return state.flags["_birthdayToday_" + n.id];
        });
        if (birthdayNpcs.length > 0) {
          note +=
            '<p style="font-size:12px;color:#e67e22;font-weight:600;">🎂 今天是' +
            birthdayNpcs
              .map(function (n) {
                return n.name;
              })
              .join("、") +
            "的生日！送礼好感×2！</p>";
        }
        return note;
      })() +
      '<label style="display:block;margin-top:10px;">选择对象：' +
      '<select id="gift-npc" style="width:100%;padding:8px;margin-top:4px;background:var(--bg-input);border:1px solid var(--border);color:var(--text-primary);border-radius:4px;">' +
      npcOptions +
      "</select></label>" +
      '<label style="display:block;margin-top:10px;">送出商品：' +
      '<select id="gift-good" style="width:100%;padding:8px;margin-top:4px;background:var(--bg-input);border:1px solid var(--border);color:var(--text-primary);border-radius:4px;">' +
      goodOptions +
      "</select></label>",
    buttons: [
      { text: "取消", cls: "", callback: function () {} },
      {
        text: "送出 (-10AP)",
        cls: "btn-primary",
        callback: function () {
          var st = StateManager.getState();
          var npcId = document.getElementById("gift-npc")
            ? document.getElementById("gift-npc").value
            : "";
          var goodId = document.getElementById("gift-good")
            ? document.getElementById("gift-good").value
            : "";
          if (!npcId || !goodId) return;
          var npc = typeof getNpcById === "function" ? getNpcById(npcId) : null;
          if (!npc) return;
          // Daily limit check
          var todayKey = "_giftToday_" + npcId;
          if (st.flags[todayKey] === st.player.day) {
            StateManager.addMessage(
              "🎁 今天已经给" + npc.name + "送过礼了。",
              "warning",
            );
            document.querySelector(".modal-overlay") &&
              document.querySelector(".modal-overlay").remove();
            return;
          }
          // Remove good from inventory
          var invItem = (st.inventory.items || []).find(function (i) {
            return i.id === goodId;
          });
          if (!invItem || invItem.qty <= 0) {
            StateManager.addMessage("🎁 商品数量不足。", "warning");
            return;
          }
          invItem.qty--;
          if (invItem.qty <= 0) {
            st.inventory.items = st.inventory.items.filter(function (i) {
              return i.id !== goodId;
            });
          }
          // Grant affinity
          if (!st.relationships[npcId])
            st.relationships[npcId] = { affinity: 0, met: true };
          var rel = st.relationships[npcId];
          var isPreferred = npc.giftPrefers && npc.giftPrefers.includes(goodId);
          var bonus = isPreferred ? 15 : 5;
          // 节日送礼额外加成（春节/中秋+10，其他节日+5）
          var festBonus =
            typeof getFestivalGiftBonus === "function"
              ? getFestivalGiftBonus()
              : 0;
          bonus += festBonus;
          // 生日送礼好感×2
          var isBirthday = !!st.flags["_birthdayToday_" + npcId];
          if (isBirthday) bonus = bonus * 2;
          rel.affinity = Math.min(100, rel.affinity + bonus);
          rel.met = true;
          st.flags[todayKey] = st.player.day;

          // 中秋节送礼成就追踪
          if (typeof getCurrentFestival === "function") {
            var fest = getCurrentFestival(st.player.day);
            if (fest && fest.id === "mid_autumn") {
              st.flags._midAutumnAchieveGift = true;
            }
          }
          var goodDef =
            typeof GOODS !== "undefined"
              ? GOODS.find(function (g) {
                  return g.id === goodId;
                })
              : null;
          var goodName = goodDef ? goodDef.name : goodId;
          var festSuffix =
            festBonus > 0 ? "（🎊节日加成+" + festBonus + "）" : "";
          var bdSuffix = isBirthday ? "（🎂生日双倍好感！）" : "";
          if (isPreferred) {
            StateManager.addMessage(
              "🎁 " +
                npc.name +
                '眼睛一亮："正合我意！" 好感度+' +
                bonus +
                "。" +
                festSuffix +
                bdSuffix +
                "（当前：" +
                rel.affinity +
                "）",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🎁 给" +
                npc.name +
                "送了" +
                goodName +
                "，对方礼貌收下。好感度+" +
                bonus +
                "。" +
                festSuffix +
                bdSuffix +
                "（当前：" +
                rel.affinity +
                "）",
              "info",
            );
          }
          // 检查好感阈值奖励
          if (typeof checkNpcAffinityRewards === "function") {
            checkNpcAffinityRewards(npcId, st);
          }
          consumeAP(10);
          document.querySelector(".modal-overlay") &&
            document.querySelector(".modal-overlay").remove();
          if (typeof renderAll === "function") renderAll();
        },
      },
    ],
  });
}

// ========== 状态恢复点（Amenity）行动 ==========

/**
 * 在当前地点的 amenities 全部加成行动列表。
 * 玩家可以主动选择恢复某个状态，而不是等到临界值才被动选择。
 */
function addAmenityActions(state, actions) {
  if (typeof getAmenitiesAtLoc !== "function") return;
  var here = getAmenitiesAtLoc(state.trade.currentLocation);
  for (var i = 0; i < here.length; i++) {
    var a = here[i];
    var primaryDesc = [];
    if (a.primary) {
      for (var k in a.primary) {
        if (!a.primary.hasOwnProperty(k)) continue;
        var amt = a.primary[k];
        var label =
          {
            hunger: "饥饱",
            fatigue: "疲劳",
            hygiene: "卫生",
            happiness: "心情",
            physique: "体质",
            intelligence: "智力",
            agility: "敏捷",
            mental: "心智",
            fame: "名气",
            health: "健康",
          }[k] || k;
        primaryDesc.push(label + (amt >= 0 ? "+" : "") + amt);
      }
    }
    var typeName =
      typeof getAmenityTypeName === "function"
        ? getAmenityTypeName(a.type)
        : a.type;
    actions.push({
      id: "amenity_" + a.id,
      name: a.name,
      desc: a.desc + " [" + primaryDesc.join(", ") + "]",
      icon: a.icon,
      apCost: a.ap || 0,
      costEstimate: a.cost || 0,
      category: "restore",
      handler: (function (amenityId) {
        return function () {
          travelToAmenityAndUse(amenityId);
        };
      })(a.id),
    });
  }
}

/** 买菜行动（批发市场 + 城中村小卖部 + 商业区超市） */
function addIngredientShoppingActions(state, actions) {
  var here = state.trade.currentLocation;
  var shoppingLocs = ["wholesaleMarket", "slum", "commercialDist"];
  if (shoppingLocs.indexOf(here) < 0) return;

  // 收集可买的食材
  var ingredientGoods = [];
  if (typeof GOODS !== "undefined") {
    for (var i = 0; i < GOODS.length; i++) {
      if (GOODS[i].isIngredient) ingredientGoods.push(GOODS[i]);
    }
  }

  if (ingredientGoods.length === 0) return;

  // 加一个"买菜"快捷入口 — 弹出食材购买弹窗
  var locPriceMod = 1.0;
  if (typeof LOCATIONS !== "undefined" && LOCATIONS[here]) {
    var priceMods = LOCATIONS[here].priceMod || {};
    var totalMod = 0,
      count = 0;
    for (var gid in priceMods) {
      var good = null;
      for (var gi = 0; gi < ingredientGoods.length; gi++) {
        if (ingredientGoods[gi].id === gid) {
          good = ingredientGoods[gi];
          break;
        }
      }
      if (good) {
        totalMod += priceMods[gid];
        count++;
      }
    }
    if (count > 0) locPriceMod = totalMod / count;
  }

  actions.push({
    id: "buy_ingredients",
    name: "买菜/食材",
    desc:
      "采购烹饪食材（大米/蔬菜/肉类/调料等）。当前市场价 ×" +
      locPriceMod.toFixed(2),
    icon: "🛒",
    apCost: 5,
    category: "shopping",
    handler: function () {
      showIngredientShopModal();
    },
  });
}

/** 食材购买弹窗 */
function showIngredientShopModal() {
  var state = StateManager.getState();
  var here = state.trade.currentLocation;
  var cash = state.resources.cash || 0;
  var capacity = state.inventory ? state.inventory.capacity || 20 : 20;
  var usedSlots =
    state.inventory && state.inventory.items
      ? state.inventory.items.reduce(function (s, it) {
          return s + (it.qty || 0);
        }, 0)
      : 0;

  var html = '<div class="ingredient-shop-modal">';
  html += '<h2 style="margin:0 0 8px;font-size:16px;">🛒 购买食材</h2>';
  html += '<p style="margin:0 0 12px;color:var(--text-muted);font-size:12px;">';
  html += "现金 ¥" + cash + " · 背包 " + usedSlots + "/" + capacity + "</p>";
  html += '<div style="max-height:420px;overflow-y:auto;">';

  var ingredientGoods = [];
  if (typeof GOODS !== "undefined") {
    for (var i = 0; i < GOODS.length; i++) {
      if (GOODS[i].isIngredient) ingredientGoods.push(GOODS[i]);
    }
  }

  // 按类别分组
  var cats = { 主食: [], 蔬菜: [], 肉类: [], 调料: [], 蛋奶: [] };
  var catIcons = { 主食: "🍚", 蔬菜: "🥬", 肉类: "🥩", 调料: "🧂", 蛋奶: "🥛" };

  // 从 items.js 获取食材类型
  for (var i = 0; i < ingredientGoods.length; i++) {
    var g = ingredientGoods[i];
    var itemDef = typeof getItemById === "function" ? getItemById(g.id) : null;
    var ingType =
      itemDef && itemDef.ingredientType ? itemDef.ingredientType : "其他";
    if (!cats[ingType]) cats[ingType] = [];
    cats[ingType].push({ good: g, itemDef: itemDef });
  }

  for (var catName in cats) {
    var list = cats[catName];
    if (list.length === 0) continue;
    html +=
      '<h3 style="margin:8px 0 4px;font-size:13px;">' +
      (catIcons[catName] || "📦") +
      " " +
      catName +
      "</h3>";

    for (var j = 0; j < list.length; j++) {
      var g = list[j].good;
      var itemDef = list[j].itemDef;
      var icon = itemDef ? itemDef.icon : "📦";
      // 本地价格
      var priceMod = 1.0;
      if (typeof LOCATIONS !== "undefined" && LOCATIONS[here]) {
        priceMod =
          (LOCATIONS[here].priceMod && LOCATIONS[here].priceMod[g.id]) || 1.0;
      }
      var price = Math.round(g.basePrice * priceMod * 100) / 100;

      html +=
        '<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;' +
        'border:1px solid var(--border);border-radius:6px;margin-bottom:4px;">';
      html += '<span style="font-size:18px;">' + icon + "</span>";
      html += '<div style="flex:1;">';
      html +=
        '<div style="font-size:13px;font-weight:500;">' + g.name + "</div>";
      html +=
        '<div style="font-size:10px;color:var(--text-muted);">¥' +
        price +
        "/" +
        g.unit;
      if (itemDef && itemDef.perishDays) {
        html += " · 保鲜" + itemDef.perishDays + "天";
      }
      html += "</div></div>";
      html += '<div style="display:flex;gap:4px;align-items:center;">';
      // 数量选择器
      html +=
        '<button class="btn btn-sm" onclick="ingredientBuyQty(\'' +
        g.id +
        '\', -1)" style="width:24px;height:24px;padding:0;">−</button>';
      html +=
        '<span id="ing_qty_' +
        g.id +
        '" style="min-width:20px;text-align:center;font-size:13px;">0</span>';
      html +=
        '<button class="btn btn-sm" onclick="ingredientBuyQty(\'' +
        g.id +
        '\', 1)" style="width:24px;height:24px;padding:0;">+</button>';
      html +=
        '<button class="btn btn-primary btn-sm" onclick="ingredientBuyConfirm(\'' +
        g.id +
        "'," +
        price +
        ')" style="padding:4px 10px;">买</button>';
      html += "</div></div>";
    }
  }

  html += "</div>"; // scrollable
  html += '<div style="text-align:center;margin-top:12px;">';
  html +=
    '<button class="btn btn-secondary" onclick="this.closest(\'.modal-overlay\').remove()">关闭</button>';
  html += "</div></div>";

  if (typeof showModal === "function") {
    showModal({
      title: "🛒 购买食材",
      body: html,
      buttons: [],
    });
  } else {
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML =
      '<div class="modal-box" style="max-width:520px;">' + html + "</div>";
    document.body.appendChild(overlay);
  }
}

/** 食材数量调节 */
function ingredientBuyQty(goodId, delta) {
  var span = document.getElementById("ing_qty_" + goodId);
  if (!span) return;
  var cur = parseInt(span.textContent) || 0;
  cur = Math.max(0, cur + delta);
  span.textContent = cur;
}

/** 食材购买确认 */
function ingredientBuyConfirm(goodId, unitPrice) {
  var span = document.getElementById("ing_qty_" + goodId);
  if (!span) return;
  var qty = parseInt(span.textContent) || 0;
  if (qty <= 0) {
    StateManager.addMessage("⚠️ 请先选择数量。", "warning");
    return;
  }

  var state = StateManager.getState();
  var totalCost = qty * unitPrice;

  if ((state.resources.cash || 0) < totalCost) {
    StateManager.addMessage(
      "💸 现金不足！需要 ¥" + totalCost.toFixed(2),
      "warning",
    );
    return;
  }

  // 检查背包容量
  var capacity = state.inventory ? state.inventory.capacity || 20 : 20;
  var usedSlots =
    state.inventory && state.inventory.items
      ? state.inventory.items.reduce(function (s, it) {
          return s + (it.qty || 0);
        }, 0)
      : 0;
  if (usedSlots + qty > capacity) {
    StateManager.addMessage(
      "🎒 背包空间不足！可用 " + (capacity - usedSlots) + " 格。",
      "warning",
    );
    return;
  }

  // 扣钱
  state.resources.cash -= totalCost;

  // 加库存（带购买日用于保鲜）
  state.inventory = state.inventory || { items: [], capacity: 20 };
  var existing = null;
  for (var i = 0; i < state.inventory.items.length; i++) {
    if (state.inventory.items[i].id === goodId) {
      existing = state.inventory.items[i];
      break;
    }
  }
  if (existing) {
    existing.qty += qty;
  } else {
    state.inventory.items.push({
      id: goodId,
      qty: qty,
      boughtDay: state.player.day || 0,
      perishDays: (function () {
        var def =
          typeof getItemById === "function" ? getItemById(goodId) : null;
        return def ? def.perishDays : 7;
      })(),
    });
  }

  // 添加购买记录
  if (typeof addDailyTransaction === "function") {
    addDailyTransaction(state, "expense", "ingredient", totalCost, goodId);
  }

  StateManager.addMessage(
    "🛒 购买了 " + qty + " 份食材。花费 ¥" + totalCost.toFixed(2),
    "success",
  );

  // 刷新弹窗
  var overlay = document.querySelector(".modal-overlay");
  if (overlay) overlay.remove();

  // 重新打开购物窗口
  showIngredientShopModal();
  if (typeof renderAll === "function") renderAll();
}

/** 医院解锁的"看病"行动 */
function addClinicAction(state, actions) {
  if (state.trade.currentLocation !== "hospital") return;
  var illCount = (state.status.illnesses && state.status.illnesses.length) || 0;
  actions.push({
    id: "see_doctor",
    name: "看病" + (illCount ? "（你有 " + illCount + " 种疾病）" : ""),
    desc: "由医生检查并选择治疗方案：药店/医院两档可选。",
    icon: "🏥",
    apCost: 5,
    handler: function () {
      if (typeof openClinicModal === "function") openClinicModal();
      consumeAP(5);
    },
  });
}

/**
 * 寺庙地点解锁的 4 项特殊行动（v3.0 P2-C-2 完善）
 * 设计参考：《大多数》心态值分级 + BitLife 随机 buff
 * 每项每日冷却 1 次，防止滥用
 */
function addTempleActions(state, actions) {
  if (state.trade.currentLocation !== "temple") return;
  var flags = state.flags || (state.flags = {});
  var day = state.player.day || 0;

  // 祈福：心情+8/运气+1，成本¥10，AP 3
  if (day - (flags._templePrayDay || -1) >= 1) {
    actions.push({
      id: "temple_pray",
      name: "🙏 祈福",
      desc: "在佛像前静默祈愿。心情+8，运气+1（每日1次）",
      icon: "🙏",
      apCost: 3,
      handler: function () {
        if (state.resources.cash < 10) {
          StateManager.addMessage("香火钱至少要¥10。", "warning");
          return;
        }
        state.resources.cash -= 10;
        state.needs.happiness = Math.min(100, (state.needs.happiness || 0) + 8);
        flags._luckBonus = (flags._luckBonus || 0) + 1;
        flags._templePrayDay = day;
        flags.moralGoodChoices = (flags.moralGoodChoices || 0) + 1;
        StateManager.addMessage(
          "🙏 你在佛像前虔诚跪拜，内心平静了些。心情+8，运气+1。",
          "success",
        );
        consumeAP(3);
        renderAll();
      },
    });
  }

  // 冥想：疲劳-15/心智+2，免费，AP 5
  if (day - (flags._templeMeditateDay || -1) >= 1) {
    actions.push({
      id: "temple_meditate",
      name: "🧘 冥想",
      desc: "在禅房静坐片刻。疲劳-15，心智+2（每日1次）",
      icon: "🧘",
      apCost: 5,
      handler: function () {
        state.needs.fatigue = Math.max(0, (state.needs.fatigue || 0) - 15);
        state.player.mental = Math.min(100, (state.player.mental || 0) + 2);
        flags._templeMeditateDay = day;
        StateManager.addMessage(
          "🧘 一炷香后，杂念渐息，精神焕发。疲劳-15，心智+2。",
          "success",
        );
        consumeAP(5);
        renderAll();
      },
    });
  }

  // 捐香火钱：运气+3/道德+1/名气+2，成本¥50，AP 2
  if (day - (flags._templeDonateDay || -1) >= 1) {
    actions.push({
      id: "temple_donate",
      name: "💰 捐香火钱",
      desc: "为修缮寺庙添砖加瓦。运气+3，道德+1，名气+2（每日1次，¥50）",
      icon: "💰",
      apCost: 2,
      handler: function () {
        if (state.resources.cash < 50) {
          StateManager.addMessage("香火钱至少¥50。", "warning");
          return;
        }
        state.resources.cash -= 50;
        flags._luckBonus = (flags._luckBonus || 0) + 3;
        flags.moralGoodChoices = (flags.moralGoodChoices || 0) + 1;
        state.player.fame = Math.min(100, (state.player.fame || 0) + 2);
        flags._templeDonateDay = day;
        StateManager.addMessage(
          "💰 你捐了¥50香火钱，方丈合十致谢。运气+3，道德+1，名气+2。",
          "success",
        );
        consumeAP(2);
        renderAll();
      },
    });
  }

  // 求签：随机 buff/debuff 24h，成本¥20，AP 2
  if (day - (flags._templeDivinationDay || -1) >= 1) {
    actions.push({
      id: "temple_divination",
      name: "🔖 求签",
      desc: "摇一支签，看看今日运势。随机效果持续到明日（¥20）",
      icon: "🔖",
      apCost: 2,
      handler: function () {
        if (state.resources.cash < 20) {
          StateManager.addMessage("求签费至少¥20。", "warning");
          return;
        }
        state.resources.cash -= 20;
        flags._templeDivinationDay = day;
        var rolls = [
          {
            name: "上上签",
            desc: "万事亨通",
            buff: { luck: 5, happiness: 10 },
          },
          { name: "上签", desc: "吉星高照", buff: { luck: 3, happiness: 5 } },
          { name: "中签", desc: "平平淡淡", buff: { luck: 1 } },
          {
            name: "下签",
            desc: "宜守不宜攻",
            buff: { luck: -2, happiness: -3 },
          },
          {
            name: "下下签",
            desc: "今日宜静",
            buff: { luck: -3, happiness: -5 },
          },
        ];
        var r = rolls[Math.floor(Math.random() * rolls.length)];
        flags._divinationResult = r.name;
        flags._divinationExpireDay = day + 1;
        flags._divinationBuff = r.buff;
        if (r.buff.luck)
          flags._luckBonus = (flags._luckBonus || 0) + r.buff.luck;
        if (r.buff.happiness)
          state.needs.happiness = Math.max(
            0,
            Math.min(100, (state.needs.happiness || 0) + r.buff.happiness),
          );
        StateManager.addMessage(
          "🔖 你摇出一支【" + r.name + "】：" + r.desc + "。效果持续到明日。",
          r.name.indexOf("下") >= 0 ? "warning" : "success",
        );
        consumeAP(2);
        renderAll();
      },
    });
  }
}

/** 给 main.js 调用的统一入口 */
function addExtraActions(state, actions) {
  if (state.player.phase === "street") {
    addStreetExtras(state, actions);
    addAmenityActions(state, actions);
    addHomeActions(state, actions);
    addClinicAction(state, actions);
    addIngredientShoppingActions(state, actions);
    addTempleActions(state, actions);
    // v3.4 C3D-T3: 位置×技能特色行动（检查玩家当前地点）
    if (typeof addLocationExtraActions === "function") {
      addLocationExtraActions(state, actions);
    }
    // v3.0 黑暗开局：违法行为（高收益高风险）
    if (typeof addIllegalActions === "function") {
      addIllegalActions(state, actions);
    }
  }
  // 余额宝每日利息
  if (state.flags.yuEBao > 0) {
    const interest = Math.floor(state.flags.yuEBao * 0.0001);
    if (interest > 0) {
      state.flags.yuEBao += interest;
    }
  }
  // 保险检查
  if (
    state.flags.hasInsurance &&
    state.flags.insuranceExpire < state.player.day
  ) {
    state.flags.hasInsurance = false;
    StateManager.addMessage("🛡️ 你的保险到期了，记得续保。", "info");
  }
  if (state.flags.hasInsurance && (state.status.injured || state.status.sick)) {
    if (!state.flags._insurancePaidThisCycle) {
      state.resources.cash += 500;
      state.flags._insurancePaidThisCycle = true;
      StateManager.addMessage("🛡️ 保险赔付了 ¥500！", "success");
    }
  }
  if (!state.status.injured && !state.status.sick) {
    state.flags._insurancePaidThisCycle = false;
  }
}

// ========== 家居行动（回住所做饭/洗澡/休息） ==========

/**
 * 添加「回住所」家居行动到 action 列表。
 * 根据住所等级显示可用的做饭/洗澡/休息选项。
 * 旅行AP = 从当前位置到住所位置的路径花费。
 */
function addHomeActions(state, actions) {
  var tier = state.housing ? state.housing.tier || 0 : 0;
  if (tier <= 0) return;

  var homeLoc =
    typeof getHomeLocationKey === "function" ? getHomeLocationKey(state) : null;
  if (!homeLoc) return;

  var homeAmenities =
    typeof getHomeAmenities === "function" ? getHomeAmenities(state) : [];
  if (homeAmenities.length === 0) return;

  var curLoc = state.trade.currentLocation;
  var travelAp =
    typeof getTravelApCost === "function"
      ? getTravelApCost(curLoc, homeLoc, state)
      : curLoc === homeLoc
        ? 0
        : 10;
  var isAtHome = curLoc === homeLoc;

  var cookingAvail = homeAmenities.some(function (a) {
    return a.id.indexOf("cook") >= 0;
  });
  var bathAvail = homeAmenities.some(function (a) {
    return a.id.indexOf("bath") >= 0;
  });
  var restAvail = homeAmenities.some(function (a) {
    return a.id.indexOf("nap") >= 0;
  });
  var icons = [];
  if (cookingAvail) icons.push("🍳");
  if (bathAvail) icons.push("🚿");
  if (restAvail) icons.push("🛏️");

  actions.push({
    id: "go_home",
    name: "🏠 回住所",
    icon: "🏠",
    desc:
      (isAtHome ? "在家中" : "回到住所") +
      " — " +
      icons.join(" ") +
      " | " +
      (isAtHome ? "🏠 已在住所" : "⚡ 需" + travelAp + "AP回家"),
    apCost: travelAp,
    category: "restore",
    handler: function () {
      var s = StateManager.getState();
      showHomeActionsModal(s);
    },
  });
}

/** 显示家居设施选择弹窗 */
function showHomeActionsModal(state) {
  var homeAmenities =
    typeof getHomeAmenities === "function" ? getHomeAmenities(state) : [];
  if (homeAmenities.length === 0) {
    StateManager.addMessage("🏠 住所没有可用的设施。", "info");
    return;
  }
  var html =
    '<div style="font-size:13px;margin-bottom:10px;color:var(--text-secondary);">选择一项居家活动：</div>';
  for (var i = 0; i < homeAmenities.length; i++) {
    var a = homeAmenities[i];
    var pd = [];
    if (a.primary) {
      for (var k in a.primary) {
        if (!a.primary.hasOwnProperty(k)) continue;
        var amt = a.primary[k];
        var lb =
          {
            hunger: "饥饱",
            fatigue: "疲劳",
            hygiene: "卫生",
            happiness: "心情",
          }[k] || k;
        pd.push(lb + (amt >= 0 ? "+" : "") + amt);
      }
    }
    html +=
      '<div class="action-card" style="margin-bottom:8px;padding:10px;cursor:pointer;border:1px solid var(--border);border-radius:8px;" data-amenity-id="' +
      a.id +
      '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;">' +
      '<span style="font-weight:600;">' +
      (a.icon || "🏠") +
      " " +
      a.name +
      "</span>" +
      '<span style="font-size:11px;color:var(--text-muted);">⚡' +
      (a.ap || 0) +
      "AP | " +
      (a.cost > 0 ? "¥" + a.cost : "免费") +
      "</span></div>" +
      '<div style="font-size:11px;color:var(--text-secondary);margin-top:4px;">' +
      pd.join(" → ") +
      "</div>" +
      '<div style="font-size:10px;color:var(--text-muted);margin-top:2px;">' +
      a.desc +
      "</div></div>";
  }
  showModal({
    title: "🏠 在住所",
    body: html,
    buttons: [{ text: "出门", cls: "", callback: function () {} }],
  });
  setTimeout(function () {
    var ov = document.querySelector(".modal-overlay");
    if (!ov) return;
    for (var j = 0; j < homeAmenities.length; j++) {
      (function (aid) {
        var el = ov.querySelector('[data-amenity-id="' + aid + '"]');
        if (el) {
          el.addEventListener("click", function () {
            var o = document.querySelector(".modal-overlay");
            if (o && o.parentNode) o.parentNode.removeChild(o);
            if (typeof travelToAmenityAndUse === "function")
              travelToAmenityAndUse(aid);
            else if (typeof useAmenity === "function") useAmenity(aid);
          });
        }
      })(homeAmenities[j].id);
    }
  }, 50);
}

// ============================================================
// v3.4 C3D-T3: 位置×技能特色行动（根据当前地点显示专属行动）
// ============================================================

/** 地点特色行动定义 — 玩家在当前地点时才会显示 */
var LOCATION_EXTRA_ACTIONS = [
  {
    id: "scrapyard_picking",
    name: "废品站淘货",
    desc: "在工地附近的废品站翻找，运气好能发现值钱物件。了解行情的人更容易捡到宝。",
    icon: "🔩",
    location: "construction",
    apCost: 20,
    condition: function (st) {
      return st.skills && st.skills.repair && st.skills.repair.level >= 30;
    },
    payEstimate: "50~300",
    handler: function (st) {
      var cost = 50;
      st.resources.cash -= cost;
      var findValue =
        Random.int(0, 100) + (st.skills.repair ? st.skills.repair.level : 0);
      var earn = 0;
      if (findValue > 120) earn = 250 + Random.int(0, 100);
      else if (findValue > 80) earn = 100 + Random.int(0, 80);
      else earn = 20 + Random.int(0, 30);
      st.resources.cash += earn;
      StateManager.addMessage(
        "🔩 你在废品站翻了半天，" +
          (earn > 100
            ? "找到一件有价值的旧零件，卖了¥" + earn
            : "就找到些破铜烂铁，卖了¥" + earn),
        earn > 100 ? "success" : "info",
      );
    },
  },
  {
    id: "factory_parttime",
    name: "工厂兼职",
    desc: "在工业区的工厂做临时工，体力活但收入稳定。需要一定的体力基础。",
    icon: "🏭",
    location: "factoryZone",
    apCost: 25,
    condition: function (st) {
      return st.player.physique >= 40;
    },
    payEstimate: "80~120",
    handler: function (st) {
      var earn = 80 + Random.int(0, 40);
      st.resources.cash += earn;
      st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
      StateManager.addMessage(
        "🏭 你在工厂干了一天体力活，赚了¥" +
          earn.toLocaleString() +
          "。累得腰酸背痛。",
        "info",
      );
    },
  },
  {
    id: "night_school",
    name: "夜校自习",
    desc: "在大学城找个自习室学习，效率比在住处高得多。需要交电费。",
    icon: "📚",
    location: "school",
    apCost: 25,
    condition: function (st) {
      return st.resources.cash >= 10;
    },
    payEstimate: "-10",
    handler: function (st) {
      st.resources.cash -= 10;
      if (st.skills) {
        for (var sk in st.skills) {
          if (st.skills[sk] && st.skills[sk].xp !== undefined) {
            st.skills[sk].xp += Math.round(15 * 1.3);
            break;
          }
        }
      }
      StateManager.addMessage(
        "📚 你在自习室学到很晚。虽然花了¥10电费，但学习效率比平时高出不少。",
        "info",
      );
    },
  },
  {
    id: "flyer_distribution",
    name: "商业区发传单",
    desc: "在商业区帮商家发传单，收入稳定但枯燥。",
    icon: "📄",
    location: "commercialDist",
    apCost: 20,
    condition: function (st) {
      return true;
    },
    payEstimate: "60~80",
    handler: function (st) {
      var earn = 60 + Random.int(0, 20);
      st.resources.cash += earn;
      st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
      StateManager.addMessage(
        "📄 你发了一天的传单，赚了¥" +
          earn.toLocaleString() +
          "。手都酸了，但看着商家满意的脸色，还算值得。",
        "info",
      );
    },
  },
  {
    id: "techpark_networking",
    name: "科技园找机会",
    desc: "在科技园里观察和接触创业公司的人，可能找到工作或创业机会。需要脑子灵活。",
    icon: "💡",
    location: "techPark",
    apCost: 20,
    condition: function (st) {
      return st.player.intel >= 60;
    },
    payEstimate: "0~∞",
    handler: function (st) {
      if (Random.chance(0.25)) {
        st.flags._techParkLead = true;
        StateManager.addMessage(
          "💡 你和一位创业者聊得很投机，他给了你一张名片：'有兴趣来我们公司聊聊！'",
          "success",
        );
      } else if (Random.chance(0.4)) {
        st.resources.cash += 50;
        StateManager.addMessage(
          "💡 你帮一个创业团队跑腿买了咖啡和午饭，赚了¥50小费。",
          "info",
        );
      } else {
        StateManager.addMessage(
          "💡 你在科技园逛了一圈，被保安问了几次话，收获不大。",
          "info",
        );
      }
    },
  },
  {
    id: "hospital_donate",
    name: "医院献血",
    desc: "去医院献血，既能帮助他人又能赚营养补贴。要求身体健康。",
    icon: "🩸",
    location: "hospital",
    apCost: 15,
    condition: function (st) {
      return st.status && st.status.health >= 60;
    },
    payEstimate: "200",
    handler: function (st) {
      st.resources.cash += 200;
      st.status.health = Math.min(100, (st.status.health || 80) + 10);
      st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
      StateManager.addMessage(
        "🩸 你献了400ml全血，护士给你发了营养补贴¥200。虽然有点头晕，但心里暖暖的。",
        "success",
      );
    },
  },
  {
    id: "park_exercise",
    name: "公园晨练",
    desc: "在公园晨练，免费又健康，还能放松身心。",
    icon: "🏃",
    location: "park",
    apCost: 15,
    condition: function (st) {
      return true;
    },
    payEstimate: "0",
    handler: function (st) {
      st.player.physique = Math.min(100, (st.player.physique || 50) + 3);
      st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
      StateManager.addMessage(
        "🏃 你在公园跑了三圈，打了套太极拳。浑身舒畅，精神焕发。",
        "success",
      );
    },
  },
  {
    id: "library_study",
    name: "图书馆啃书",
    desc: "在培训中心的图书馆看书，各种技能书都有，对提升技能很有帮助。只需交茶水费。",
    icon: "📖",
    location: "trainingCenter",
    apCost: 20,
    condition: function (st) {
      return st.resources.cash >= 5;
    },
    payEstimate: "-5",
    handler: function (st) {
      st.resources.cash -= 5;
      var xpGain = Math.round(Random.int(8, 18) * 1.15);
      if (st.skills) {
        for (var sk in st.skills) {
          if (st.skills[sk] && st.skills[sk].xp !== undefined) {
            st.skills[sk].xp += xpGain;
            break;
          }
        }
      }
      StateManager.addMessage(
        "📖 你泡了一天的图书馆。交了¥5茶位费，收获不小，技能经验提升了。",
        "info",
      );
    },
  },
  {
    id: "temple_meditate",
    name: "寺庙静心",
    desc: "在寺庙里打坐冥想，净化心灵。烧点香火，求个心安。",
    icon: "🧘",
    location: "temple",
    apCost: 15,
    condition: function (st) {
      return st.resources.cash >= 10;
    },
    payEstimate: "-10",
    handler: function (st) {
      st.resources.cash -= 10;
      st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
      if (st.morality !== undefined) {
        st.morality = Math.max(-100, Math.min(100, st.morality + 1));
      }
      StateManager.addMessage(
        "🧘 你在寺庙里打坐了一个小时。听着钟声，心静了下来，感觉整个人都轻松了。",
        "success",
      );
    },
  },
  {
    id: "wholesale_flip",
    name: "批发市场倒货",
    desc: "在批发市场寻找低价商品，就地转卖给其他摊位。需要口才和眼力。",
    icon: "🔄",
    location: "wholesaleMarket",
    apCost: 20,
    condition: function (st) {
      return st.skills && st.skills.social && st.skills.social.level >= 40;
    },
    payEstimate: "100~300",
    handler: function (st) {
      var earn = 100 + Random.int(0, 200);
      st.resources.cash += earn;
      if (st.skills && st.skills.social) {
        st.skills.social.xp = (st.skills.social.xp || 0) + 5;
      }
      StateManager.addMessage(
        "🔄 你在批发市场倒腾了一批小商品，赚了¥" +
          earn.toLocaleString() +
          "。嘴皮子功夫又见长了。",
        "success",
      );
    },
  },
];

/**
 * 添加位置限定行动到 actions 列表
 */
function addLocationExtraActions(state, actions) {
  var curLoc = state.trade && state.trade.currentLocation;
  if (!curLoc) return;
  for (var i = 0; i < LOCATION_EXTRA_ACTIONS.length; i++) {
    var act = LOCATION_EXTRA_ACTIONS[i];
    if (act.location !== curLoc) continue;
    if (typeof act.condition === "function" && !act.condition(state)) continue;
    (function (a) {
      actions.push({
        id: a.id,
        name: a.name,
        desc: a.desc,
        icon: a.icon,
        apCost: a.apCost,
        payEstimate: a.payEstimate,
        handler: function () {
          a.handler(StateManager.getState());
        },
      });
    })(act);
  }
}

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
    name: "🗺️ 规划拾荒路线",
    desc: "选择今天的拾荒区域：城中村小巷(稳)/废品站边缘(中)/工业区(高)/老周专线(⭐)。不同路线收益和风险各异。",
    icon: "🗺️",
    apCost: 15,
    payEstimate: "2~65",
    handler: () => {
      showScavengeRouteModal();
    },
  });

  actions.push({
    id: "busking",
    name: "🎤 街头卖唱",
    desc: "在地铁口或天桥上唱歌赚打赏。需要胆子大。",
    icon: "🎤",
    apCost: 20,
    payEstimate: "5~25",
    handler: () => {
      const st = StateManager.getState();
      const skill = st.player.mental; // 心智影响成功率
      const earned = Math.floor(5 + Math.random() * 20 + (skill - 25) * 0.3);
      st.resources.cash += earned;
      st.resources.totalEarned += earned;
      addDailyTransaction(st, "income", "side_job", earned, "街头卖唱");
      st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
      st.player.fame = Math.min(100, st.player.fame + 1);
      if (Math.random() < 0.2) {
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
    name: "🙏 街头乞讨",
    desc: "放下尊严，跪地要饭。（有尊严损失）",
    icon: "🙏",
    apCost: 20,
    payEstimate: "1~5",
    handler: () => {
      const st = StateManager.getState();
      const earned = 1 + Math.floor(Math.random() * 5);
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
    name: "🎲 路边赌骰子",
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
      if (Math.random() < 0.45) {
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
    name: "📞 给家里打电话",
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
      if (Math.random() < 0.3) {
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
    name: "💌 给家里汇款",
    desc: "把一部分钱寄回老家。",
    icon: "💌",
    costEstimate: "200~1000",
    handler: () => {
      showRemitModal();
    },
  });

  actions.push({
    id: "internet_bar",
    name: "💻 网吧上网",
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
      const sk = skills[Math.floor(Math.random() * skills.length)];
      st.skills[sk].xp += 5 + Math.floor(Math.random() * 10);
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
    name: "💈 路边理发店聊天",
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
    name: "📖 图书馆自习",
    desc: "去图书馆（商业区旁）安静看书。",
    icon: "📖",
    apCost: 20,
    payEstimate: "技能XP+30",
    handler: () => {
      const st = StateManager.getState();
      st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
      const skills = Object.keys(st.skills);
      const key = skills[Math.floor(Math.random() * skills.length)];
      // 小美好感60解锁图书馆内部账号：学习效率+30%
      var xpMult = st.flags.xiaomeiLibrary ? 1.3 : 1.0;
      var xpGain = Math.floor((30 + Math.floor(Math.random() * 20)) * xpMult);
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
    name: "🌃 上夜校",
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
    name: "🏋️ 办健身卡锻炼",
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
    name: "🎬 看场电影",
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
    name: "🎤 KTV 唱歌",
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
    name: "💊 买药/买营养品",
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
    name: "🛒 去超市采购",
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
    name: "👕 买件新衣服",
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
    name: "🎰 买张彩票",
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
      const roll = Math.random();
      if (roll < 0.0005) {
        st.resources.cash += 500000;
        st.resources.totalEarned += 500000;
        st.needs.happiness = Math.min(100, st.needs.happiness + 50);
        StateManager.addMessage(
          "🎰🎉🎉🎉 中了头奖！¥500,000 到账！财务自由就在眼前！",
          "success",
        );
      } else if (roll < 0.05) {
        const prize = 50 + Math.floor(Math.random() * 200);
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
    name: "💰 买余额宝理财",
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
    name: "🛡️ 买保险",
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
    name: "📓 写日记",
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
    name: "🧘 冥想打坐",
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
    name: "🏪 摆地摊创业",
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
      var luck = Math.random();
      var baseEarned = 0;
      var xpGain = 0;
      if (luck < 0.25) {
        // 大赚
        baseEarned = 150 + Math.floor(Math.random() * 200);
        xpGain = 8 + Math.floor(Math.random() * 7); // 8~14 XP
        st.player.fame = Math.min(100, st.player.fame + 2);
      } else if (luck < 0.7) {
        // 小赚
        baseEarned = 30 + Math.floor(Math.random() * 90);
        xpGain = 4 + Math.floor(Math.random() * 5); // 4~8 XP
      } else if (luck < 0.85) {
        // 勉强回本
        baseEarned = 180 + Math.floor(Math.random() * 40);
        xpGain = 2 + Math.floor(Math.random() * 3); // 2~4 XP
        StateManager.addMessage("🏪 摆摊勉强度日，赚了点辛苦钱。", "warning");
      } else {
        // 亏了
        StateManager.addMessage(
          "🏪 摆摊失败！货没卖掉，城管还罚了款。",
          "danger",
        );
        st.resources.cash = Math.max(0, st.resources.cash - 50);
        st.needs.happiness = Math.max(0, st.needs.happiness - 5);
        xpGain = 1 + Math.floor(Math.random() * 3); // 1~3 XP（失败也能学点教训）
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
      name: "🎁 送礼联络感情",
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
      name: "💻 接网络外包单",
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
      handler: function () {
        const st = StateManager.getState();
        const lvl = st.skills.coding.level || 0;
        const earned = Math.floor(80 + lvl * 1.5 + Math.random() * 50);
        st.resources.cash += earned;
        st.resources.totalEarned += earned;
        addDailyTransaction(st, "income", "job_income", earned, "编程外包");
        st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
        st.player.intelligence = Math.min(100, st.player.intelligence + 0.2);
        const xpGain =
          8 +
          Math.floor(Math.random() * 12) +
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

  // === 确立人生梦想（公园/家里才显示，未设定梦想时） ===
  var hasDream = state.flags && state.flags._dreamId;
  var atRestfulLoc =
    state.trade.currentLocation === "park" ||
    state.trade.currentLocation === "slum";
  if (!hasDream && atRestfulLoc) {
    actions.push({
      id: "set_dream",
      name: "💭 确立人生目标",
      desc: "在这座城市，你想要什么？选定一个方向，脚踏实地去努力。",
      icon: "🌟",
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
        name: dream.icon + " 梦想：" + dream.name,
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
      name: "🏪 周末集市摆摊",
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
        var base = 180 + Math.floor(Math.random() * 150);
        var bonus = Math.floor(salesLvl * 1.5);
        var earned = base + bonus;
        var fameGain = 3 + Math.floor(Math.random() * 5);
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
      name: "📋 打听本周零工机会",
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
        var roll = Math.random();
        if (roll < 0.4) {
          var cashTip = 100 + Math.floor(Math.random() * 150);
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
          var xpGainM = 25 + Math.floor(Math.random() * 25);
          var skillKeys = Object.keys(st.skills);
          var sk = skillKeys[Math.floor(Math.random() * skillKeys.length)];
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
           <p style="font-size:11px;color:var(--text-secondary);">每汇 100 元，心情+3，名气+0.5。</p>
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
          state.player.fame = Math.min(
            100,
            state.player.fame + (amt / 100) * 0.5,
          );
          StateManager.addMessage(
            `💌 给家里汇了 ¥${amt.toLocaleString()}，爸妈很高兴。`,
            "success",
          );
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
      name: a.icon + " " + a.name,
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

/** 医院解锁的"看病"行动 */
function addClinicAction(state, actions) {
  if (state.trade.currentLocation !== "hospital") return;
  var illCount = (state.status.illnesses && state.status.illnesses.length) || 0;
  actions.push({
    id: "see_doctor",
    name: "🏥 看病" + (illCount ? "（你有 " + illCount + " 种疾病）" : ""),
    desc: "由医生检查并选择治疗方案：药店/医院两档可选。",
    icon: "🏥",
    apCost: 5,
    handler: function () {
      if (typeof openClinicModal === "function") openClinicModal();
      consumeAP(5);
    },
  });
}

/** 给 main.js 调用的统一入口 */
function addExtraActions(state, actions) {
  if (state.player.phase === "street") {
    addStreetExtras(state, actions);
    addAmenityActions(state, actions);
    addClinicAction(state, actions);
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

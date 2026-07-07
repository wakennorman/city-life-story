/**
 * 打工人情境叙事系统 — Work Flavor Text
 *
 * 在每次工作完成后生成一句独特的"打工人感想"。
 * 让每天的工作体验都有不同的 flavor 和情感共鸣。
 *
 * 设计参考：
 * - 《大多数》：打工人日记式的底层叙事
 * - 《Stardew Valley》：每天不同的 NPC 对话
 * - 《This War of Mine》：情境化叙事弹窗
 * - 知乎/豆瓣「打工人日记」真实故事
 *
 * 心理学原理：
 * - 可变奖励（Variable Rewards）：每天不同的消息让工作本身变成期待
 * - 叙事密度（Narrative Density）：让城市生活更有"活着"的感觉
 * - 情感共鸣：打工人日常困境的真实感
 */

/**
 * 生成工作后情境叙事文本
 * 在 doStreetJob 末尾调用，追加在工作完成消息后
 */
function generateWorkFlavorText(state, job) {
  if (!state || !job) return "";

  var day = state.player.day || 1;
  var weather = state.weather ? state.weather.current : null;
  var streak = state.flags._workStreak || 0;
  var health = (state.status && state.status.health) || 100;
  var fatigue = state.needs.fatigue || 0;
  var hunger = state.needs.hunger || 100;
  var cash = state.resources.cash || 0;
  var happiness = state.needs.happiness || 50;

  // 构建可用的 flavor 池，按权重排序
  var flavorPool = [];

  // ====== 一级：高优先级情境（每次最多选1个） ======

  // 1. 天气相关（最直观的情境变化）
  switch (weather) {
    case "rainy":
      flavorPool.push({
        text: "☔ 雨打在脸上有点疼，衣服湿透了黏在身上。",
        weight: 8,
      });
      break;
    case "heavy_rain":
      flavorPool.push({
        text: "🌧️ 暴雨如注，视线都模糊了，但活儿不能停。",
        weight: 9,
      });
      break;
    case "stormy":
      flavorPool.push({
        text: "⛈️ 狂风暴雨，今天真是拼了老命在干。",
        weight: 9,
      });
      break;
    case "snowy":
      flavorPool.push({
        text: "❄️ 手冻得发僵，哈口气继续干，雪地上全是脚印。",
        weight: 8,
      });
      break;
    case "cold_snap":
      flavorPool.push({
        text: "🥶 寒潮来了，风像刀子一样刮在脸上。",
        weight: 8,
      });
      break;
    case "heatwave":
      flavorPool.push({
        text: "🌞 太阳晒得头皮发麻，水壶早就空了。",
        weight: 8,
      });
      break;
    case "hot":
      flavorPool.push({
        text: "☀️ 汗水顺着脖子往下流，衣服能拧出水来。",
        weight: 7,
      });
      break;
    case "foggy":
      flavorPool.push({
        text: "🌫️ 大雾天，十米外看不清人，街上冷冷清清的。",
        weight: 6,
      });
      break;
    case "plum_rain":
      flavorPool.push({
        text: "🌦️ 梅雨季，空气里都是潮气，浑身黏糊糊的。",
        weight: 7,
      });
      break;
  }

  // 2. 健康状态
  if (health < 20) {
    flavorPool.push({
      text: "🤢 感觉身体被掏空了...每一步都在硬撑。",
      weight: 10,
    });
  } else if (health < 35) {
    flavorPool.push({
      text: "😷 头重脚轻，浑身酸痛，但今天的工钱不能不赚。",
      weight: 9,
    });
  } else if (health < 50) {
    flavorPool.push({
      text: "😓 身体有点不舒服，希望只是累了，睡一觉就好。",
      weight: 7,
    });
  }

  // 3. 疲劳度
  if (fatigue > 80) {
    flavorPool.push({
      text: "😩 累得腰都直不起来了，坐在路边歇了五分钟才缓过来。",
      weight: 9,
    });
  } else if (fatigue > 60) {
    flavorPool.push({
      text: "😮‍💨 今天的活真不轻松，浑身酸疼。",
      weight: 6,
    });
  }

  // 4. 饥饿度
  if (hunger < 15) {
    flavorPool.push({
      text: "🍚 饿得前胸贴后背，脑子里全是热腾腾的饭菜。",
      weight: 8,
    });
  } else if (hunger < 30) {
    flavorPool.push({
      text: "🍜 肚子咕咕叫了一整天，收工了一定要好好吃一顿。",
      weight: 7,
    });
  }

  // 5. 连续工作
  if (streak >= 100) {
    flavorPool.push({
      text: "👑 第" + streak + "天连续工作，工友们都叫你「铁人」。",
      weight: 9,
    });
  } else if (streak >= 30) {
    flavorPool.push({
      text:
        "💪 连续工作" +
        streak +
        "天，身体已经习惯了这种节奏，哪天不干反而不自在。",
      weight: 8,
    });
  } else if (streak >= 14) {
    flavorPool.push({
      text: "🔥 连续" + streak + "天没歇过，你都快忘记休息是什么感觉了。",
      weight: 7,
    });
  } else if (streak >= 7) {
    flavorPool.push({
      text: "📋 连续第" + streak + "天上班，工友们开始跟你打招呼了。",
      weight: 6,
    });
  } else if (streak >= 3) {
    flavorPool.push({
      text: "👋 连续第" + streak + "天，老板对你点了点头，算是认可了。",
      weight: 5,
    });
  }

  // ====== 二级：中优先级情境（如果一级没有触发） ======

  // 6. 金钱状况
  if (cash < 50) {
    flavorPool.push({
      text: "💸 兜里比脸还干净，今天的工钱来得正是时候。",
      weight: 6,
    });
  } else if (cash > 50000) {
    flavorPool.push({
      text: "💰 手里有了点积蓄，但不知道为什么还是不敢停下来。",
      weight: 5,
    });
  }

  // 7. 心情状态
  if (happiness < 20) {
    flavorPool.push({
      text: "😞 心情很低落，机械地干着活，脑子里一片空白。",
      weight: 6,
    });
  } else if (happiness > 80) {
    flavorPool.push({
      text: "😊 今天心情不错，干活都有劲了。",
      weight: 4,
    });
  }

  // ====== 三级：通用 flavor（兜底） ======

  // 8. 随机生活 flavor（每天不同）
  var GENERAL_FLAVORS = [
    { text: "🌇 收工的时候正好看到夕阳，这座城市其实也挺美的。", minDay: 0 },
    { text: "🚶 下班路上买了瓶水，坐在路边看人来人往。", minDay: 0 },
    { text: "🍚 今天的工钱够吃两顿好的，值了。", minDay: 0 },
    {
      text: "📱 休息时刷了刷手机，看到老家亲戚发的朋友圈，有点想家。",
      minDay: 10,
    },
    { text: "🎵 干活时哼着歌，旁边的工友跟着一起唱了起来。", minDay: 5 },
    {
      text: "🐱 路边有只流浪猫，看了你一眼，又懒洋洋地闭上了眼睛。",
      minDay: 3,
    },
    { text: "🍵 隔壁摊位的大爷递了杯茶过来，「年轻人，悠着点」。", minDay: 7 },
    { text: "💭 干活的时候走神了，在想这条路还要走多久。", minDay: 15 },
    {
      text: "🌃 天黑了，路灯亮起来，你想起小时候放学也是这样的光。",
      minDay: 20,
    },
    { text: "🧮 算了一下今天的账，扣除吃饭和房租，还能剩下一点。", minDay: 10 },
    { text: "📝 今天没什么特别的，但活着就已经很了不起了。", minDay: 0 },
    { text: "☕ 路边摊买了杯豆浆，热乎乎的，暖到了心里。", minDay: 0 },
    {
      text: "👀 今天看到一个新来的小伙子，眼神跟你刚来时一模一样。",
      minDay: 30,
    },
    { text: "🎒 背包带子断了一根，用塑料袋缠了缠继续背。", minDay: 5 },
    { text: "🌧️ 收工时下起了小雨，你没带伞，干脆淋着走回去。", minDay: 3 },
    {
      text: "📸 拿出手机拍了张街景，这座城市每天都在变，但你还在。",
      minDay: 20,
    },
    {
      text: "💪 今天的活比昨天多干了一点，进步虽小，但确实在往前走。",
      minDay: 0,
    },
    { text: "🍺 工友递了瓶啤酒，「辛苦了，兄弟。」", minDay: 14 },
    { text: "🏃 下班后跑了步去赶公交，在城市里活着就是一场长跑。", minDay: 5 },
    { text: "🎯 今天的任务完成了，离这个月的目标又近了一步。", minDay: 7 },
    { text: "🌅 清晨的街道还没醒，你已经开始了一天的奔波。", minDay: 0 },
    { text: "🍜 今天奢侈了一把，面里加了个蛋。", minDay: 0 },
    { text: "🧹 干完活帮老板收拾了一下，他多给了几块钱。", minDay: 3 },
    { text: "🤝 今天帮新来的工友搬了趟货，他感激地递了根烟。", minDay: 10 },
    { text: "🌙 月亮升起来了，拖着疲惫的身体往住处走。", minDay: 0 },
    { text: "💫 今天没什么大事发生，但平凡的日子也是日子。", minDay: 0 },
  ];

  // 天安门控：仅当天数达标才加入
  for (var gi = 0; gi < GENERAL_FLAVORS.length; gi++) {
    if (day >= GENERAL_FLAVORS[gi].minDay) {
      flavorPool.push({
        text: GENERAL_FLAVORS[gi].text,
        weight: 3, // 通用 flavor 权重低于情境 flavor
      });
    }
  }

  // 9. 天数里程碑（覆盖式，遇到对应天数则优先级最高）
  var MILESTONE_FLAVORS = [
    {
      day: 1,
      text: "🌱 第一天打工，手忙脚乱的，但总算迈出了第一步。",
      weight: 99,
    },
    {
      day: 7,
      text: "🏫 来这座城市一周了，每天都在同一条街上讨生活。",
      weight: 99,
    },
    {
      day: 30,
      text: "🎉 一个月了！从陌生到熟悉，这条路你闭着眼都能走完。",
      weight: 99,
    },
    {
      day: 100,
      text: "💪 整整一百天！这座城市没有把你打垮，你反而越来越强了。",
      weight: 99,
    },
    {
      day: 180,
      text: "🌟 半年了！你已经不再是当初那个什么都不会的毛头小子了。",
      weight: 99,
    },
    {
      day: 365,
      text: "🎊 一年了！从最初的迷茫到现在的从容，你变了太多。",
      weight: 99,
    },
  ];
  for (var mi = 0; mi < MILESTONE_FLAVORS.length; mi++) {
    if (day === MILESTONE_FLAVORS[mi].day) {
      // 里程碑消息覆盖所有其他消息
      return MILESTONE_FLAVORS[mi].text;
    }
  }

  // 加权随机选取一条
  var totalWeight = 0;
  for (var fi = 0; fi < flavorPool.length; fi++) {
    totalWeight += flavorPool[fi].weight;
  }
  var roll = Math.random() * totalWeight;
  for (var fi2 = 0; fi2 < flavorPool.length; fi2++) {
    roll -= flavorPool[fi2].weight;
    if (roll <= 0) {
      return flavorPool[fi2].text;
    }
  }

  // 绝对兜底
  var FALLBACKS = [
    "🌙 平凡的一天，你还在努力活着。",
    "💪 今天的活干完了，明天继续。",
    "🌆 收工了，街上的人渐渐多了起来。",
    "🧘 深呼吸一口，今天又撑过去了。",
  ];
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

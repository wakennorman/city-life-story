/**
 * NPC-事件桥接系统 — 在不修改大量事件的前提下，为事件系统添加NPC连接
 *
 * 设计原则：
 * 1. 不修改 events.js 的内容（避免引入bug）
 * 2. 在 daily_pipeline 中插入钩子，根据当日事件/状态自动触发NPC互动
 * 3. 引用已有的 NPC 关系系统（npcs.js）
 *
 * 连接密度标准（2.1）：每项内容最低系统连接数
 * - NPC → 事件：每个NPC每天有概率在事件结算后追加 "NPC回响" 消息
 * - 事件 → NPC：某些事件触发后，检查相关NPC并更新关系
 * - 新闻 → NPC：新闻触发后，相关NPC有概率给出评论（好感度变化）
 */

// ============================================================
// 第一层：事件→NPC关系桥接
// ============================================================

/** 事件到NPC的映射表 — 事件触发后，自动影响对应NPC好感度 */
const EVENT_NPC_MAP = {
  found_wallet: {
    flags: { _returnedWallet: "sister_zhang,+5" }, // 拾金不昧张姐好感
    npcs: {
      sister_zhang: {
        flag: "_returnedWallet",
        change: 5,
        msg: "张姐听说你拾金不昧，对你更加信任。",
      },
    },
  },
  street_mugging: {
    npcs: {
      boss_li: {
        condition: (st) => st.player.physique >= 30,
        change: 3,
        msg: "李工头听说你打架赢了混混，笑道：'有种！'",
      },
    },
  },
  old_man_help: {
    npcs: {
      old_zhou: {
        change: 2,
        msg: "老周听说你帮忙老人，默默点头：'好人有好报。'",
      },
    },
  },
  neighbor_fight: {
    npcs: {
      aunt_wang: { change: 3, msg: "王大婶知道你去劝架，夸你懂事。" },
    },
  },
  free_clinic: {
    npcs: {
      xiao_mei: {
        condition: (st) => st.status.sick,
        change: 2,
        msg: "小美听说你去做检查：'注意身体呀！'",
      },
    },
  },
  hunger_begging: {
    npcs: {
      aunt_wang: {
        condition: (st) => st.resources.cash < 50,
        change: 3,
        msg: "王大婶偷偷塞给你两个馒头：'别在外面丢人了。'",
      },
      chef_chen: {
        condition: (st) => st.skills.cooking && st.skills.cooking.level >= 5,
        change: 2,
        msg: "陈师傅递来一碗热汤：'喝了，别饿着。'",
      },
    },
  },
  stranger_invest: {
    npcs: {
      sister_zhang: {
        condition: (st) => st.flags._returnedWallet,
        change: -2,
        msg: "张姐皱眉：'我听说你差点被骗了？投资要谨慎。'",
      },
      sister_zhang_flag_alt: {
        flag: "_keptWallet",
        change: -5,
        msg: "张姐叹气：'贪心的人容易被骗。'",
      },
    },
  },
  boss_li_bonus: {
    npcs: {
      boss_li: { change: 5, msg: "李工头拍着你肩膀：'好好干，亏不了你！'" },
    },
  },
  landlord_rent_hike: {
    npcs: {
      aunt_wang: { change: -3, msg: "王大婶因为涨租的事有点过意不去。" },
    },
  },
  coworker_injured: {
    npcs: {
      boss_li: { change: 4, msg: "李工头看你帮受伤工友，竖了个大拇指。" },
    },
  },
};

/**
 * 事件结算后的NPC回响 — 在事件选择apply后调用
 * @param {string} eventId 已触发的事件ID
 * @param {object} state 游戏状态
 */
function applyEventNpcEcho(eventId, state) {
  var map = EVENT_NPC_MAP[eventId];
  if (!map || !state.relationships) return;

  var npcs = map.npcs || {};
  for (var npcId in npcs) {
    (function (id, rule) {
      if (id.indexOf("_flag_alt") > 0) {
        // 根据flag分流
        var altId = id.split("_flag_alt")[0];
        var flagCheck = rule.flag;
        if (flagCheck && !state.flags[flagCheck]) return;
      } else {
        // 条件检查
        if (typeof rule.condition === "function" && !rule.condition(state))
          return;
        // flag检查（有则要求对应flag为true）
        if (rule.flag && !state.flags[rule.flag]) return;
      }
      if (!state.relationships[id.replace("_flag_alt", "")]) {
        state.relationships[id.replace("_flag_alt", "")] = {
          affinity: 0,
          met: true,
        };
      }
      state.relationships[id.replace("_flag_alt", "")].affinity = Math.min(
        100,
        Math.max(
          -100,
          state.relationships[id.replace("_flag_alt", "")].affinity +
            rule.change,
        ),
      );
      StateManager.addMessage("💬 " + rule.msg, "info");
    })(npcId, npcs[npcId]);
  }
}

// ============================================================
// 第二层：每日NPC随机「回响」
// ============================================================

/** 日常NPC回响 — 每天有概率根据玩家状态推送NPC对话 */
function rollDailyNpcEcho(state) {
  if (!state.relationships) return;
  // 每天20%概率触发一个NPC回响
  if (Math.random() > 0.2) return;

  // 只选择已经认识的NPC
  var knownNpcs = [];
  for (var id in state.relationships) {
    var rel = state.relationships[id];
    if (rel && rel.met) knownNpcs.push({ id: id, affinity: rel.affinity || 0 });
  }
  if (knownNpcs.length === 0) return;

  // 权重：好感度越高越容易触发（熟人更常互动）
  var totalWeight = knownNpcs.reduce(function (sum, n) {
    return sum + Math.max(1, n.affinity + 20);
  }, 0);
  var roll = Math.random() * totalWeight;
  var selected = knownNpcs[0];
  var cursor = 0;
  for (var i = 0; i < knownNpcs.length; i++) {
    cursor += Math.max(1, knownNpcs[i].affinity + 20);
    if (roll <= cursor) {
      selected = knownNpcs[i];
      break;
    }
  }

  // 生成回响消息
  var echoes = getNpcDailyEchoes(selected.id, selected.affinity, state);
  if (echoes) {
    StateManager.addMessage("💬 " + echoes, "info");
  }
}

/** 获取NPC日常回响内容 */
function getNpcDailyEchoes(npcId, affinity, state) {
  var echoes = {
    aunt_wang: [
      { min: -100, max: -10, text: "王大婶见到你扭过头去，假装没看见。" },
      { min: -10, max: 20, text: "王大婶嘟囔了一句：'房租别忘了交……'" },
      { min: 20, max: 50, text: "王大婶点点头：'今天精神不错嘛。'" },
      {
        min: 50,
        max: 80,
        text: "王大婶笑着招呼：'来家里吃饭吧，今天炖了汤。'",
      },
      { min: 80, max: 101, text: "王大婶塞给你一袋水果：'自家种的，拿着！'" },
    ],
    boss_li: [
      { min: -100, max: -10, text: "李工头板着脸：'你小子最近不老实啊。'" },
      { min: -10, max: 20, text: "李工头瞥了你一眼，没说什么。" },
      { min: 20, max: 50, text: "李工头叼着烟说：'明天工地缺人，来不来？'" },
      { min: 50, max: 80, text: "李工头递了根烟：'好好干，年底给你涨工钱。'" },
      {
        min: 80,
        max: 101,
        text: "李工头拍你肩膀：'我认识几个大老板，回头介绍给你！'",
      },
    ],
    sister_zhang: [
      { min: -100, max: -10, text: "张姐远远看到你就绕路了。" },
      { min: -10, max: 20, text: "张姐低头刷手机，当没看见你。" },
      { min: 20, max: 50, text: "张姐抬头：'有份新工作，¥150一天，做不做？'" },
      {
        min: 50,
        max: 80,
        text: "张姐笑着说：'我帮你问了个好岗位，待遇不错！'",
      },
      { min: 80, max: 101, text: "张姐拍胸脯：'你放心，姐姐帮你安排最好的！'" },
    ],
    old_zhou: [
      { min: -100, max: -10, text: "老周背对着你，不愿意搭话。" },
      { min: -10, max: 20, text: "老周埋头整理废品，没抬头。" },
      { min: 20, max: 50, text: "老周抬头：'废铁今天价格还行，多收点。'" },
      { min: 50, max: 80, text: "老周递了瓶水：'歇会儿吧，年轻人也别太拼。'" },
      {
        min: 80,
        max: 101,
        text: "老周笑呵呵的：'我那些老关系都介绍给你，你路子就宽了。'",
      },
    ],
    xiao_mei: [
      { min: -100, max: -10, text: "小美看到你，低头快步走开了。" },
      { min: -10, max: 20, text: "小美在图书馆埋头看书，没注意到你。" },
      { min: 20, max: 50, text: "小美抬头打招呼：'学长好！今天有空吗？'" },
      { min: 50, max: 80, text: "小美开心地说：'我英语考过了！多亏了你！'" },
      {
        min: 80,
        max: 101,
        text: "小美兴奋地拉着你：'我帮你争取到了实习内推！'",
      },
    ],
    chef_chen: [
      { min: -100, max: -10, text: "陈师傅在厨房里忙，没空搭理你。" },
      { min: -10, max: 20, text: "陈师傅专注颠勺，没看到你。" },
      { min: 20, max: 50, text: "陈师傅抬头：'吃了没？给你下碗面。'" },
      { min: 50, max: 80, text: "陈师傅招手：'来尝尝新菜式！我请你！'" },
      {
        min: 80,
        max: 101,
        text: "陈师傅拉你坐下：'我打算开店了，你来给我当合伙人吧！'",
      },
    ],
  };

  var pool = echoes[npcId];
  if (!pool || pool.length === 0) return null;

  for (var i = 0; i < pool.length; i++) {
    if (affinity >= pool[i].min && affinity < pool[i].max) {
      return pool[i].text;
    }
  }
  return null;
}

// ============================================================
// 第三层：新闻→NPC反馈
// ============================================================

/** 新闻事件触发的NPC评论 */
function rollNewsNpcComment(state, newsHeadline) {
  if (!state.relationships || !newsHeadline) return;
  // 三条活跃新闻以上不叠加NPC评论（避免刷屏）
  if ((state.activeNews || []).length > 3) return;
  // 30%概率触发
  if (Math.random() > 0.3) return;

  // 根据新闻关键词选择相关NPC
  var keywords = {
    aunt_wand: ["租金", "房东", "城中村", "旧改"],
    boss_li: ["工地", "建筑", "工程", "楼盘"],
    sister_zhang: ["招聘", "工作", "就业", "工资", "政策"],
    old_zhou: ["废品", "回收", "金属", "涨价"],
    xiao_mei: ["大学", "学校", "学生", "教育", "考试"],
    chef_chen: ["餐饮", "食品", "外卖", "物价", "天气"],
  };

  for (var npcId in keywords) {
    var actualNpcId = npcId; // 修正拼写
    var rel = state.relationships[actualNpcId];
    if (!rel || !rel.met) continue;
    var words = keywords[npcId];
    for (var k = 0; k < words.length; k++) {
      if (newsHeadline.indexOf(words[k]) >= 0) {
        // NPC对此新闻有反应
        var echoes = {
          aunt_wang: "王大婶摇头叹气：'唉，这世道……'",
          boss_li: "李工头看了看新闻：'跟咱们工地有关系吗？'",
          sister_zhang: "张姐刷到新闻：'这条对我这行有影响，得关注着。'",
          old_zhou: "老周耳朵竖起来：'这行情……我得合计合计。'",
          xiao_mei: "小美推了推眼镜：'这跟我专业相关诶！'",
          chef_chen: "陈师傅擦了擦手看新闻：'做餐饮的得盯着这消息。'",
        };
        StateManager.addMessage("💬 " + echoes[actualNpcId], "info");
        // 好感高的NPC更积极回应
        if (rel.affinity >= 40) {
          rel.affinity = Math.min(100, rel.affinity + 1);
        }
        return;
      }
    }
  }
}

// ============================================================
// 第四层：位置感知NPC交互（到达某地点时概率触发的NPC消息）
// ============================================================

const LOCATION_NPC_MESSAGES = {
  slum: {
    npcId: "aunt_wang",
    chance: 0.25,
    minAffinity: 0,
    msgs: [
      "王大婶正在门口择菜，看到你咧嘴笑了笑。",
      "王大婶喊住你：'帮我把这袋垃圾带下去！'",
      "楼道里碰到王大婶，她嘟囔着说水管又坏了。",
    ],
  },
  construction: {
    npcId: "boss_li",
    chance: 0.3,
    minAffinity: 0,
    msgs: [
      "李工头在指挥吊车，朝你打了个手势。",
      "李工头递了瓶水过来：'喝口水再干。'",
    ],
  },
  commercialDist: {
    npcId: "sister_zhang",
    chance: 0.2,
    minAffinity: 0,
    msgs: [
      "张姐在路边发传单，看到你招手：'过来帮我发几张！'",
      "张姐在咖啡店门口刷手机，抬头：'嗨！最近怎么样？'",
    ],
  },
  school: {
    npcId: "xiao_mei",
    chance: 0.3,
    minAffinity: 0,
    msgs: [
      "小美抱着书本从图书馆出来，笑着冲你点头。",
      "小美在食堂门口排着队，看到你招了招手。",
    ],
  },
};

function rollLocationNpcInteraction(state, locationKey) {
  if (!state.relationships) return;
  var locData = LOCATION_NPC_MESSAGES[locationKey];
  if (!locData) return;
  if (Math.random() > locData.chance) return;
  var rel = state.relationships[locData.npcId];
  if (!rel || !rel.met || rel.affinity < locData.minAffinity) return;

  var msg = Random.fromArray(locData.msgs);
  StateManager.addMessage("💬 " + msg, "info");
  // 每次偶遇好感+1（自动社交）
  rel.affinity = Math.min(100, rel.affinity + 1);
}

// ============================================================
// 桥接管线 — 在 daily_pipeline 中调用
// ============================================================

/** 每日NPC桥接主函数 — 在 daily_pipeline 的 events 步骤后调用 */
function runDailyNpcBridge(state) {
  if (!state.relationships) return;

  // 1. NPC日常回响
  rollDailyNpcEcho(state);

  // 2. 位置感知NPC互动
  if (state.trade && state.trade.currentLocation) {
    rollLocationNpcInteraction(state, state.trade.currentLocation);
  }

  // 3. 活跃新闻的NPC评论
  var activeNews = state.activeNews || [];
  if (activeNews.length > 0) {
    var latestNews = activeNews[activeNews.length - 1];
    rollNewsNpcComment(state, latestNews.headline);
  }
}

/** 事件结算后调用 — 由 showEventModal 中的 apply 后续触发 */
function afterEventApplied(eventId, state) {
  applyEventNpcEcho(eventId, state);
}

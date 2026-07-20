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
  // === 第二阶段扩展：覆盖更多事件 ===
  food_poisoning: {
    npcs: {
      chef_chen: {
        change: -2,
        msg: "陈师傅皱眉：'吃坏肚子了？街边摊不干净，以后来我这儿吃。'",
      },
      aunt_wang: {
        change: 1,
        msg: "王大婶给你送来了黄连素：'吃坏了吧？我这儿有药。'",
      },
    },
  },
  rainy_day_dilemma: {
    npcs: {
      aunt_wang: { change: 2, msg: "王大婶递了把伞：'拿着，别淋坏了。'" },
    },
  },
  wholesale_bargain: {
    npcs: {
      old_zhou: { change: 1, msg: "老周听说你进到便宜货：'会过日子！'" },
      sister_zhang: { change: 1, msg: "张姐点头：'进价低就是赚，有眼光。'" },
      auntie_lin: {
        change: 2,
        msg: "林阿姨笑着说：'会砍价是好习惯，买菜也得有技巧。'",
      },
    },
  },
  sick_desperate: {
    npcs: {
      xiao_mei: {
        change: 3,
        msg: "小美发来消息：'听说你病了？我帮你带了药和粥，放楼下了。'",
      },
      chef_chen: {
        change: 2,
        msg: "陈师傅托人带了碗热粥：'病了别扛着，喝点热的。'",
      },
    },
  },
  market_crash_news: {
    npcs: {
      sister_zhang: {
        change: -1,
        msg: "张姐愁眉苦脸：'股市跌惨了，我买的基金也亏了不少。'",
      },
      old_zhou: {
        change: 1,
        msg: "老周淡定：'涨涨跌跌正常的，废品价格从来不跌。'",
      },
    },
  },
  integrity_reward: {
    npcs: {
      aunt_wang: { change: 3, msg: "王大婶听说了你的善举：'好人一定有好报！'" },
      sister_zhang: {
        change: 2,
        msg: "张姐竖起大拇指：'你这样的年轻人不多了。'",
      },
    },
  },
  mental_breakdown_edge: {
    npcs: {
      xiao_mei: {
        change: 5,
        msg: "小美担心地看着你：'你还好吗？要不要聊聊？我随时都在。'",
      },
      chef_chen: {
        change: 3,
        msg: "陈师傅拉你坐下：'心里有事就说出来，别憋着。'",
      },
      dr_wang: {
        change: 3,
        msg: "王医生严肃地说：'身体是革命的本钱，别硬撑。'",
      },
    },
  },
  // === 新 NPC 事件桥接（v2.1）===
  // 林阿姨相关事件
  veggie_fresh_find: {
    npcs: {
      auntie_lin: {
        change: 3,
        msg: "林阿姨点头：'挑菜的眼光不错嘛，跟我学的吧？'",
      },
    },
  },
  // 赵师傅相关事件
  equipment_breakdown: {
    npcs: {
      master_zhao: {
        change: 2,
        msg: "赵师傅听说你东西坏了：'修修还能用，别急着扔。'",
      },
    },
  },
  repair_success: {
    npcs: {
      master_zhao: {
        change: 3,
        msg: "赵师傅竖起大拇指：'自己动手修好了？有出息！'",
      },
    },
  },
  // 小丽相关事件
  content_creation: {
    npcs: {
      xiaoli: {
        change: 2,
        msg: "小丽兴奋地说：'你也在做内容？改天一起直播啊！'",
      },
    },
  },
  viral_moment: {
    npcs: {
      xiaoli: {
        change: 4,
        msg: "小丽激动地拍你肩膀：'火了火了！教教我怎么做到的！'",
      },
    },
  },
  // 王医生相关事件
  health_checkup: {
    npcs: {
      dr_wang: {
        change: 2,
        msg: "王医生点头：'定期检查是好习惯，继续保持。'",
      },
    },
  },
  illness_recovery: {
    npcs: {
      dr_wang: {
        change: 3,
        msg: "王医生欣慰地说：'恢复得不错，按时吃药记得。'",
      },
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
      // [全系统自洽修复] 域D A类#3: 跨NPC好感变更统一走 applyAffinityChange(钳制 + _lastInteractionDay + 升级播报)
      applyAffinityChange(
        state,
        id.replace("_flag_alt", ""),
        rule.change,
        rule.msg,
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
  if (!Random.chance(0.2)) return;

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
  var roll = Random.float(0, totalWeight);
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
    // === 新 NPC 日常回响（v2.1）===
    auntie_lin: [
      { min: -100, max: -10, text: "林阿姨瞥了你一眼，转身继续忙。" },
      { min: -10, max: 20, text: "林阿姨低头挑菜，没注意到你。" },
      { min: 20, max: 50, text: "林阿姨招呼：'今天菜新鲜，来买点？'" },
      {
        min: 50,
        max: 80,
        text: "林阿姨笑着说：'今天有特价菜，给你留了点。'",
      },
      {
        min: 80,
        max: 101,
        text: "林阿姨塞给你一把青菜：'自家种的，拿着！'",
      },
    ],
    master_zhao: [
      { min: -100, max: -10, text: "赵师傅戴着护目镜，没看你。" },
      { min: -10, max: 20, text: "赵师傅埋头修车，没空搭话。" },
      { min: 20, max: 50, text: "赵师傅抬头：'车有问题？过来看看。'" },
      {
        min: 50,
        max: 80,
        text: "赵师傅递个扳手：'来帮我递下工具，顺便学学。'",
      },
      {
        min: 80,
        max: 101,
        text: "赵师傅拍你肩膀：'这铺子以后交给你都行！'",
      },
    ],
    xiaoli: [
      { min: -100, max: -10, text: "小丽戴着耳机直播，没注意到你。" },
      { min: -10, max: 20, text: "小丽低头回评论，当没看见。" },
      { min: 20, max: 50, text: "小丽挥手：'今天直播数据不错，来聊聊？'" },
      {
        min: 50,
        max: 80,
        text: "小丽兴奋地说：'我新视频爆了！改天教你拍！'",
      },
      {
        min: 80,
        max: 101,
        text: "小丽拉你：'帮我拍个视频吧，你出镜！'",
      },
    ],
    dr_wang: [
      { min: -100, max: -10, text: "王医生在写病历，没空理你。" },
      { min: -10, max: 20, text: "王医生匆匆路过，点头示意。" },
      { min: 20, max: 50, text: "王医生问：'最近身体怎么样？'" },
      {
        min: 50,
        max: 80,
        text: "王医生笑着说：'按时吃药，注意休息，别太拼。'",
      },
      {
        min: 80,
        max: 101,
        text: "王医生拍拍你：'有空来做个全面体检，我帮你安排。'",
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
  if (!Random.chance(0.3)) return;

  // 根据新闻关键词选择相关NPC
  var keywords = {
    aunt_wang: ["租金", "房东", "城中村", "旧改"],
    boss_li: ["工地", "建筑", "工程", "楼盘"],
    sister_zhang: ["招聘", "工作", "就业", "工资", "政策"],
    old_zhou: ["废品", "回收", "金属", "涨价"],
    xiao_mei: ["大学", "学校", "学生", "教育", "考试"],
    chef_chen: ["餐饮", "食品", "外卖", "物价", "天气"],
    // === 新 NPC 新闻关键词（v2.1）===
    auntie_lin: ["菜市场", "蔬菜", "食材", "物价", "农产品"],
    master_zhao: ["汽车", "维修", "机械", "工厂", "设备"],
    xiaoli: ["直播", "网红", "内容", "平台", "粉丝", "视频"],
    dr_wang: ["医院", "健康", "医疗", "药品", "疫情", "疾病"],
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
          // === 新 NPC 新闻评论（v2.1）===
          auntie_lin: "林阿姨点头：'菜价涨涨跌跌正常，我这摊子还得开下去。'",
          master_zhao:
            "赵师傅看了看新闻：'这跟修车没关系，但工厂的事我得留意。'",
          xiaoli: "小丽眼睛一亮：'这新闻能当素材！我得拍个视频！'",
          dr_wang: "王医生认真看完：'这条跟健康有关，得让更多人知道。'",
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
  // === 新 NPC 位置交互（v2.1）===
  wholesaleMarket: {
    npcId: "auntie_lin",
    chance: 0.25,
    minAffinity: 0,
    msgs: [
      "林阿姨正在整理菜摊，看到你招手：'今天菜新鲜！'",
      "林阿姨在称重，抽空抬头：'要买点什么？'",
      "菜市场碰到林阿姨，她正跟顾客讲价。",
    ],
  },
  factoryZone: {
    npcId: "master_zhao",
    chance: 0.2,
    minAffinity: 0,
    msgs: [
      "赵师傅在修车，满身油污地抬头：'车有问题？'",
      "赵师傅擦着手：'午休了，来喝口水。'",
      "工业区路过赵师傅的铺子，听到里面传来工具声。",
    ],
  },
  techPark: {
    npcId: "xiaoli",
    chance: 0.2,
    minAffinity: 0,
    msgs: [
      "小丽在草坪上直播，看到你挥手：'来当我的观众！'",
      "小丽刚结束直播，笑着问：'今天拍什么内容好？'",
      "科技园咖啡厅碰到小丽，她正在回粉丝评论。",
    ],
  },
  hospital: {
    npcId: "dr_wang",
    chance: 0.15,
    minAffinity: 0,
    msgs: [
      "王医生在走廊匆匆走过，点头示意。",
      "王医生在护士站查病历，抬头：'来看病？'",
      "医院碰到王医生，他正跟家属交代注意事项。",
    ],
  },
  // [全系统自洽修复] 域B A类#2: 删除重复键(merged from duplicate block, 避免覆盖)
  bank: {
    npcId: "uncle_chen_bank",
    chance: 0.2,
    minAffinity: 0,
    msgs: [
      "老陈站在银行门口，朝你点了点头。",
      "老陈在银行柜台后整理文件，抬头看了你一眼。",
    ],
  },
  // [全系统自洽修复] 域B A类#3: slum 额外NPC（与 aunt_wang 共存，rollLocationNpcInteraction 会随机选中）
  slumExtra: {
    npcId: "brother_huang",
    chance: 0.15,
    minAffinity: 0,
    msgs: [
      "阿黄在城中村收发快递，看到你帮忙搬箱子。",
      "阿黄坐在快递站门口抽烟，跟你闲聊了几句。",
    ],
  },
  // [全系统自洽修复] 域B A类#3: commercialDist 额外NPC（与 sister_zhang 共存）
  commercialDistExtra: {
    npcId: "sister_wu",
    chance: 0.15,
    minAffinity: 0,
    msgs: [
      "吴姐在美容院门口晒太阳，看到你招手。",
      "吴姐提着购物袋从商场出来，跟你打了声招呼。",
    ],
  },
  entertainment: {
    npcId: "xiaoli",
    chance: 0.2,
    minAffinity: 0,
    msgs: [
      "小丽在咖啡厅直播，看到你挥手：'来当我的观众！'",
      "小丽刚结束直播，笑着问：'今天拍什么内容好？'",
    ],
  },
};

function rollLocationNpcInteraction(state, locationKey) {
  if (!state.relationships) return;
  // v3.4 C3D-T1: 先检查是否有「本应在此」的 NPC（日程匹配）
  if (typeof getActiveNpcLocations === "function") {
    var scheduleNpcs = getActiveNpcLocations(state);
    for (var si = 0; si < scheduleNpcs.length; si++) {
      if (scheduleNpcs[si].location === locationKey) {
        var snpc = scheduleNpcs[si];
        var srel = state.relationships[snpc.npcId];
        if (srel && srel.met && Random.chance(0.4)) {
          var npcDef = null;
          for (var ni = 0; ni < NPCS.length; ni++) {
            if (NPCS[ni].id === snpc.npcId) {
              npcDef = NPCS[ni];
              break;
            }
          }
          if (npcDef) {
            var sline =
              npcDef.encounterLines && npcDef.encounterLines.length > 0
                ? Random.fromArray(npcDef.encounterLines)
                : npcDef.name + "正在附近忙活着呢。";
            StateManager.addMessage("💬 " + sline, "info");
            srel.affinity = Math.min(100, srel.affinity + 1);
            if (typeof tryRevealNpcInfo === "function") {
              tryRevealNpcInfo(snpc.npcId, state, "encounter");
            }
            return; // 日程匹配优先
          }
        }
      }
    }
  }
  var locData = LOCATION_NPC_MESSAGES[locationKey];
  if (!locData) return;
  // [全系统自洽修复] 域B A类#3: 支持 Extra 后缀条目（双NPC共存）
  var extraKey = locationKey + "Extra";
  var extraLocData = LOCATION_NPC_MESSAGES[extraKey];
  if (extraLocData && Random.chance(extraLocData.chance)) {
    var extraRel = state.relationships[extraLocData.npcId];
    if (
      extraRel &&
      extraRel.met &&
      extraRel.affinity >= extraLocData.minAffinity
    ) {
      locData = extraLocData;
    }
  }
  if (!Random.chance(locData.chance)) return;
  var rel = state.relationships[locData.npcId];
  if (!rel || !rel.met || rel.affinity < locData.minAffinity) return;

  // [全系统自洽修复] 域D 联动增强2: NPC生日自动祝贺
  var _npcDef =
    typeof getNpcById === "function" ? getNpcById(locData.npcId) : null;
  var _dayInYear = (state.player.day || 1) % 365;
  if (
    _npcDef &&
    _npcDef.birthday &&
    _dayInYear === _npcDef.birthday &&
    !state.flags._npcBirthdayGreeted
  ) {
    state.flags._npcBirthdayGreeted = {};
  }
  var _isBirthday =
    _npcDef && _npcDef.birthday && _dayInYear === _npcDef.birthday;

  if (_isBirthday) {
    // 生日特殊互动 — 不消耗常规消息
    if (!state.flags._npcBirthdayGreeted[locData.npcId]) {
      state.flags._npcBirthdayGreeted[locData.npcId] = true;
      var _bdayMsg = _npcDef.birthdayLine || "今天是我生日！你居然记得？";
      StateManager.addMessage(
        "🎂 " + _npcDef.name + "：" + _bdayMsg,
        "success",
      );
      // 赠送礼物检测（背包中有NPC喜欢的礼物品类）
      var _giftFound = false;
      if (
        state.inventory &&
        state.inventory.length > 0 &&
        _npcDef.giftPrefers
      ) {
        for (var _gi = 0; _gi < state.inventory.length; _gi++) {
          var _item = state.inventory[_gi];
          if (_item && _npcDef.giftPrefers.indexOf(_item.category) >= 0) {
            _giftFound = true;
            state.inventory.splice(_gi, 1);
            break;
          }
        }
      }
      if (_giftFound) {
        StateManager.addMessage(
          "🎁 你送出了" + _npcDef.name + "喜欢的礼物，她/他非常开心！好感+10。",
          "success",
        );
        rel.affinity = Math.min(100, rel.affinity + 10);
      } else {
        StateManager.addMessage(
          "💬 你送上生日祝福，" + _npcDef.name + "很高兴。好感+5。",
          "info",
        );
        rel.affinity = Math.min(100, rel.affinity + 5);
      }
      if (typeof tryRevealNpcInfo === "function") {
        tryRevealNpcInfo(locData.npcId, state, "encounter");
      }
      return;
    }
  }

  var msg = Random.fromArray(locData.msgs);
  StateManager.addMessage("💬 " + msg, "info");
  // 每次偶遇好感+1（自动社交）
  rel.affinity = Math.min(100, rel.affinity + 1);
  // 同时尝试信息解锁
  if (typeof tryRevealNpcInfo === "function") {
    tryRevealNpcInfo(locData.npcId, state, "encounter");
  }
}

// ============================================================
// 第五层：NPC信息发现系统 — 百科剧透隐藏的运行时支持
// ============================================================

/** 简易字符串哈希（确定性） */
function _npcHash(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * 判断NPC是否在场（基于天数的确定性格子判断）
 * @param {string} npcId
 * @param {number} day 当前天数
 * @returns {boolean}
 */
function isNpcPresent(npcId, day) {
  var npc = typeof getNpcById === "function" ? getNpcById(npcId) : null;
  if (!npc) return false;
  var chance =
    typeof npc.presenceChance === "number" ? npc.presenceChance : 0.8;
  var seed = _npcHash(npcId + "_" + (day || 1));
  return (seed % 1000) / 1000 < chance;
}

/**
 * 初始化NPC发现状态（确保discovered字段存在）
 * @param {object} rel NPC关系对象
 * @param {number} affinity 当前好感
 */
function ensureNpcDiscovered(rel, affinity) {
  if (!rel) return;
  if (!rel.discovered) {
    rel.discovered = {
      birthday: false,
      giftPrefers: false,
      favor: false,
      deepTask: false,
      presenceBonus: [],
      affinityRewards: [],
    };
  }
  var d = rel.discovered;
  d.presenceBonus = Array.isArray(d.presenceBonus) ? d.presenceBonus : [];
  d.affinityRewards = Array.isArray(d.affinityRewards) ? d.affinityRewards : [];
  // 自动根据好感解锁
  if (affinity >= 30 && !d.favor) d.favor = true;
  if (affinity >= 70 && !d.deepTask) d.deepTask = true;
  // 解锁在场加成阈值
  if (d.presenceBonus.indexOf(30) < 0 && affinity >= 30)
    d.presenceBonus.push(30);
  if (d.presenceBonus.indexOf(60) < 0 && affinity >= 60)
    d.presenceBonus.push(60);
  if (d.presenceBonus.indexOf(80) < 0 && affinity >= 80)
    d.presenceBonus.push(80);
  // 解锁好感奖励阈值
  if (d.affinityRewards.indexOf(30) < 0 && affinity >= 30)
    d.affinityRewards.push(30);
  if (d.affinityRewards.indexOf(60) < 0 && affinity >= 60)
    d.affinityRewards.push(60);
  if (d.affinityRewards.indexOf(80) < 0 && affinity >= 80)
    d.affinityRewards.push(80);
}

/**
 * 尝试解锁NPC隐藏信息
 * @param {string} npcId
 * @param {object} state
 * @param {string} triggerType "chat" | "encounter" | "affinity_up"
 */
function tryRevealNpcInfo(npcId, state, triggerType) {
  var npc = typeof getNpcById === "function" ? getNpcById(npcId) : null;
  if (!npc || !state.relationships) return null;
  var rel = state.relationships[npcId];
  if (!rel) return null;
  var aff = rel.affinity || 0;
  ensureNpcDiscovered(rel, aff);
  var d = rel.discovered;
  var revealed = [];

  // Birthday：当天在聊天时自动解锁；日常聊天好感≥15有5%概率
  if (!d.birthday && triggerType === "chat") {
    var dayInYear = (state.player.day || 1) % 365;
    if (dayInYear === (npc.birthday || 0)) {
      d.birthday = true;
      revealed.push("生日");
    } else if (aff >= 15 && Random.chance(0.05)) {
      d.birthday = true;
      revealed.push("生日");
    }
  }

  // GiftPrefers：聊天好感≥20有12%概率解锁；亲和力_up时高好感自动解锁
  if (!d.giftPrefers) {
    if (triggerType === "chat" && aff >= 20 && Random.chance(0.12)) {
      d.giftPrefers = true;
      revealed.push("礼物偏好");
    } else if (aff >= 50) {
      d.giftPrefers = true;
      revealed.push("礼物偏好（自动）");
    }
  }

  // Favor：好感≥30自动解锁（已由ensureNpcDiscovered处理）
  // DeepTask：好感≥70自动解锁（已由ensureNpcDiscovered处理）

  if (revealed.length > 0) {
    var hint = "";
    if (npc.infoHints && triggerType === "encounter") {
      hint = " " + (npc.infoHints.giftHint || "");
    }
    var msg =
      "🔍 你从" + npc.name + "那里了解到：" + revealed.join("、") + "。" + hint;
    StateManager.addMessage(msg, "hint");
    // 返回已解锁的信息列表（供其他模块使用）
  }
  return revealed.length > 0 ? revealed : null;
}

/**
 * 到达新地点时触发NPC互动
 * @param {object} state
 * @param {string} locationKey
 */
function rollNpcEncounterOnArrival(state, locationKey) {
  if (!state.relationships || !locationKey) return;
  var npcsHere =
    typeof getNpcsAtLocation === "function"
      ? getNpcsAtLocation(locationKey)
      : [];
  for (var i = 0; i < npcsHere.length; i++) {
    var npc = npcsHere[i];
    var rel = state.relationships[npc.id];
    if (!rel || !rel.met) continue;
    // 检查NPC是否在场
    if (!isNpcPresent(npc.id, state.player.day)) continue;
    // 60%概率触发
    if (!Random.chance(0.6)) continue;

    // 优先使用地点触发对话
    var line =
      npc.encounterLines && npc.encounterLines.length > 0
        ? Random.fromArray(npc.encounterLines)
        : npc.talkLines && npc.talkLines.length > 0
          ? Random.fromArray(npc.talkLines)
          : null;
    if (line) {
      StateManager.addMessage("💬 " + npc.name + "：" + line, "info");
      // 好感+1
      rel.affinity = Math.min(100, rel.affinity + 1);
      // 尝试信息解锁
      tryRevealNpcInfo(npc.id, state, "encounter");
    }
  }
}

// ============================================================
// 桥接管线 — 在 daily_pipeline 中调用
// ============================================================

/**
 * 好感×技能双门槛解锁检查 — 每次好感上升时检查是否满足 skillThresholds
 * 设计参考：Stardew Valley 好感事件技能检查 / 双条件解锁永久增益
 */
function checkNpcSkillUnlocks(state) {
  if (!state.relationships || (!state.NPCS && typeof NPCS === "undefined"))
    return;
  var npcsList = state.NPCS || NPCS;
  if (!npcsList) return;
  for (var ni = 0; ni < npcsList.length; ni++) {
    var npc = npcsList[ni];
    if (!npc.skillThresholds || !npc.skillThresholds.length) continue;
    var rel = state.relationships[npc.id];
    if (!rel || !rel.met) continue;
    for (var sj = 0; sj < npc.skillThresholds.length; sj++) {
      var st = npc.skillThresholds[sj];
      var flagKey = "_unlocked_" + st.id;
      if (rel[flagKey]) continue;
      if (rel.affinity < st.minAffinity) continue;
      var meetsSkill = true;
      if (st.skill) {
        meetsSkill =
          state.skills &&
          state.skills[st.skill] &&
          state.skills[st.skill].level >= st.minSkill;
      } else if (st.attr) {
        meetsSkill = state.player[st.attr] >= st.minAttr;
      }
      if (meetsSkill) {
        rel[flagKey] = true;
        if (typeof st.effect === "function") {
          st.effect(state);
        }
      }
    }
  }
}

/**
 * NPC好感事件检查 — 达到30/60/80阈值时触发奖励和叙事消息
 * 委托给 checkNpcAffinityRewards（skill_bonuses.js）使用正确的 affinityRewards 字段
 */
function checkNpcAffinityEvents(state, onlyNpcId) {
  if (!state || !state.relationships) return;
  var npcsList = typeof NPCS !== "undefined" ? NPCS : state.NPCS || [];
  if (!npcsList || !npcsList.length) return;
  if (!state.flags) state.flags = {};

  for (var ni = 0; ni < npcsList.length; ni++) {
    var npc = npcsList[ni];
    if (onlyNpcId && npc.id !== onlyNpcId) continue;
    var rel = state.relationships[npc.id];
    if (!rel || !rel.met) continue;
    // [全系统自洽修复] 域D A类#2: checkNpcAffinityRewards 使用正确的 affinityRewards 字段
    if (typeof checkNpcAffinityRewards === "function") {
      checkNpcAffinityRewards(npc.id, state);
    }
  }
}

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

  // 4. 好感×技能双门槛解锁检查 — 每日检查
  checkNpcSkillUnlocks(state);

  // 5. 好感阈值事件检查 — 每日检查，补足30/60/80叙事链路
  checkNpcAffinityEvents(state);
}

/**
 * v3.8 P1-3: 主动与 NPC 深入聊天
 * 消耗 2 AP，产生对话历史和好感变化。
 */
function chatWithNpc(npcId, state) {
  if (!state || !npcId) return;
  if (!state.relationships) state.relationships = {};
  var rel = state.relationships[npcId];
  if (!rel || !rel.met) {
    StateManager.addMessage("你还不认识这个人。", "warning");
    return;
  }
  // [全系统自洽修复] 域D A类#2: affinity/delta/chatType/message 显式声明，避免未声明变量崩溃 + NaN 污染
  var affinity = rel.affinity || 0;
  var delta = 0,
    chatType = "neutral",
    message = "";

  var ap = state.player.actionPoints || 0;
  if (ap < 2) {
    StateManager.addMessage(
      "行动力不足，需要 2 点行动力才能深入聊天。",
      "warning",
    );
    return;
  }
  state.player.actionPoints = ap - 2;

  // [全系统自洽修复] 域B A类#1: Math.random→Random.float 种子化RNG
  var rollVal =
    typeof Random !== "undefined" ? Random.float(0, 1) : Math.random();

  // [全系统自洽修复] 域G 联动增强: 情绪状态影响社交倾向（G→D，好情绪→社交加分，坏情绪→社交减分）
  if (state.status && state.status.emotionalState) {
    var _emoMods = { depressed: -0.15, sad: -0.10, stressed: -0.05, stable: 0, happy: 0.08, elated: 0.15 };
    var _emoMod = _emoMods[state.status.emotionalState] || 0;
    rollVal = Math.max(0, Math.min(1, rollVal - _emoMod));
  }

  if (affinity >= 50) {
    // 好感高：大概率正面
    if (rollVal < 0.6) {
      delta =
        typeof Random !== "undefined"
          ? Random.int(2, 3)
          : 2 + Math.floor(Math.random() * 2); // +2~3
      chatType = "positive";
      message = "你们聊得很开心";
    } else if (rollVal < 0.85) {
      delta = 1;
      chatType = "positive";
      message = "你们聊得还不错";
    } else {
      delta = -1;
      chatType = "neutral";
      message = "话题有点尴尬";
    }
  } else if (affinity >= 10) {
    // 好感中等：中性为主
    if (rollVal < 0.4) {
      delta =
        typeof Random !== "undefined"
          ? Random.int(1, 2)
          : 1 + Math.floor(Math.random() * 2); // +1~2
      chatType = "positive";
      message = "你们聊得挺投缘";
    } else if (rollVal < 0.7) {
      delta = 0;
      chatType = "neutral";
      message = "随便聊了几句";
    } else if (rollVal < 0.9) {
      delta = -1;
      chatType = "neutral";
      message = "话题不太对付";
    } else {
      delta = -2;
      chatType = "negative";
      message = "不小心说错话，气氛有点僵";
    }
  } else {
    // 好感低：大概率负面
    if (rollVal < 0.3) {
      delta = 1;
      chatType = "positive";
      message = "也许你们之前有误会";
    } else if (rollVal < 0.6) {
      delta = 0;
      chatType = "neutral";
      message = "礼节性寒暄几句";
    } else {
      delta =
        typeof Random !== "undefined"
          ? Random.int(-3, -1)
          : -1 - Math.floor(Math.random() * 3); // -1~-3
      chatType = "negative";
      message = "对方不太想搭理你";
    }
  }

  // [全系统自洽修复] 域D A类#2: 好感写入统一走 applyAffinityChange(钳制 + _lastInteractionDay + 升级播报)
  applyAffinityChange(state, npcId, delta, message);

  // 记录对话历史
  if (!rel.interactionHistory) rel.interactionHistory = [];
  rel.interactionHistory.push({
    day: state.player.day || 1,
    type: chatType,
    delta: delta,
    message: message,
  });
  // 保留最近 20 条
  if (rel.interactionHistory.length > 20) {
    rel.interactionHistory = rel.interactionHistory.slice(-20);
  }

  // 有概率解锁 NPC 信息
  if (typeof tryRevealNpcInfo === "function" && delta >= 0) {
    tryRevealNpcInfo(npcId, state, "chat");
  }

  // [全系统自洽修复] 域D A类#2: chatWithNpc 显示中文名称而非英文ID
  var npcName = "你";
  if (typeof NPCS !== "undefined") {
    var _nd = NPCS.find(function (n) {
      return n.id === npcId;
    });
    if (_nd) npcName = _nd.name;
    else npcName = npcId.replace(/_/g, " ");
  } else {
    npcName = npcId.replace(/_/g, " ");
  }
  if (delta > 0) {
    StateManager.addMessage(
      "💬 你和 " + npcName + " " + message + "，好感 +" + delta + "。",
      delta >= 2 ? "success" : "info",
    );
  } else if (delta === 0) {
    StateManager.addMessage(
      "💬 你和 " + npcName + " " + message + "。好感不变。",
      "info",
    );
  } else {
    StateManager.addMessage(
      "💬 你和 " + npcName + " " + message + "，好感 " + delta + "。",
      "warning",
    );
  }

  // 传导好感变化给相关 NPC
  if (typeof applyNpcPropagation === "function") {
    var changeData = {};
    changeData[npcId] = delta;
    applyNpcPropagation(state, changeData);
  }

  if (typeof renderAll === "function") renderAll();
}

/** 事件结算后调用 — 由 showEventModal 中的 apply 后续触发 */
function afterEventApplied(eventId, state) {
  applyEventNpcEcho(eventId, state);

  // 追踪事件遭遇次数（用于事件多样性）
  if (!state.flags._eventEncounters) state.flags._eventEncounters = {};
  state.flags._eventEncounters[eventId] =
    (state.flags._eventEncounters[eventId] || 0) + 1;

  // 追踪已体验的叙事（用于百科剧透隐藏）
  if (!state.flags._experiencedNarratives)
    state.flags._experiencedNarratives = [];
  if (state.flags._experiencedNarratives.indexOf(eventId) < 0) {
    state.flags._experiencedNarratives.push(eventId);
  }
}

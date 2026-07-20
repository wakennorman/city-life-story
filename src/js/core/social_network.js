/**
 * 社交网络系统 (Social Network System)
 *
 * 参考：微信朋友圈 + 微博双平台机制
 *
 * 核心功能：
 * - 发布朋友圈（消耗AP，选择配图，写文字，可见范围）
 * - 刷围脖（每日刷新热搜榜，点赞/评论/转发）
 * - NPC动态（NPC发布生活动态，玩家互动）
 * - 网红经济（粉丝数≥1000可接广告，≥10000可直播带货）
 * - 舆论危机（负面事件可能引发舆论风暴）
 */

// ====== 社交网络状态 ======
function createSocialNetworkState() {
  return {
    posts: [], // 朋友圈帖子 [{ id, authorId, content, images: [], visibility: 'public'|'friends'|'private', likes: [], comments: [], postedDay }]
    weiboHotlist: [], // 微博热搜榜 [{ rank, title, heat, category }]
    weiboPosts: [], // 微博动态 [{ id, author, content, likes, comments, reposts, hot }]
    npcFeeds: [], // NPC动态 [{ npcId, content, images: [], postedDay, type: 'daily'|'event'|'mood' }]
    playerFans: 0, // 粉丝数
    playerFollowers: [], // 关注者列表
    playerInfluencerLevel: "none", // 'none'|'micro'|'medium'|'large'|'top'
    influencerIncome: 0, // 网红收入
    lastWeiboRefresh: 0, // 上次刷新热搜的天数
    舆论危机: {
      active: false,
      severity: 0, // 0-100
      topics: [],
      daysRemaining: 0,
    },
  };
}

function ensureSocialNetworkState(state) {
  if (!state.socialNetwork) {
    state.socialNetwork = createSocialNetworkState();
  }
  var base = createSocialNetworkState();
  for (var key in base) {
    if (typeof state.socialNetwork[key] === "undefined") {
      state.socialNetwork[key] = base[key];
    }
  }
  if (!state.socialNetwork.舆论危机) {
    state.socialNetwork.舆论危机 = base.舆论危机;
  }
  return state.socialNetwork;
}

// ====== 发布朋友圈 ======
function postToMoments(state, content, images, visibility) {
  ensureSocialNetworkState(state);
  if ((state.player.actionPoints || 0) < 20) {
    return { ok: false, message: "行动力不足，发布朋友圈需要20点行动力。" };
  }
  var post = {
    id: "post_" + state.player.day + "_" + Date.now(),
    authorId: "player",
    content: content,
    images: images || [],
    visibility: visibility || "public",
    likes: [],
    comments: [],
    postedDay: state.player.day,
  };
  state.socialNetwork.posts.unshift(post);
  // 消耗AP
  state.player.actionPoints = Math.max(0, state.player.actionPoints - 20);
  // 增加粉丝（如果公开）
  if (visibility === "public") {
    // 基础增长：内容长度影响
    var baseGain = 1;
    if (content.length > 20) baseGain += 1; // 较长内容+1
    if (content.length > 50) baseGain += 1; // 长内容再+1
    if (images && images.length > 0) baseGain += 1; // 配图+1
    // 名气加成：每10点名气 +0.5粉丝
    var fameBonus = Math.floor((state.player.fame || 0) / 20);
    // 随机波动
    var totalGain =
      baseGain +
      fameBonus +
      (typeof Random !== "undefined"
        ? Random.int(0, 2)
        : Math.floor(Math.random() * 3));
    state.socialNetwork.playerFans += totalGain;
    // 反哺名气：少量粉丝增长也略微提升名气
    state.player.fame = Math.min(
      100,
      (state.player.fame || 0) + Math.floor(totalGain / 5),
    );
  }
  return { ok: true, post: post };
}

// ====== 预定义热搜话题池（30条，风格参考真实围脖热搜）======
var WEIBO_HOT_TOPICS = [
  { title: "某明星被曝恋情疑似地下情三年", category: "娱乐" },
  { title: "某知名企业家称未来五年最赚钱行业是AI", category: "财经" },
  { title: "某城市房价连跌三个月购房者观望加剧", category: "财经" },
  { title: "某品牌手机发布新品引发排队抢购", category: "科技" },
  { title: "某大学研发新型疫苗进入临床试验", category: "科技" },
  { title: "某平台外卖小哥月入过万引发热议", category: "社会" },
  { title: "某市出台新规严查租房乱收费", category: "社会" },
  { title: "某知名主播被曝带货数据造假", category: "娱乐" },
  { title: "某城市地铁新线开通市民排队体验", category: "社会" },
  { title: "CBA季后赛某队爆冷淘汰夺冠热门", category: "体育" },
  { title: "某选秀节目选手退赛引发争议", category: "娱乐" },
  { title: "某程序员连续加班猝死引关注", category: "社会" },
  { title: "某市出台人才新政本科可落户", category: "社会" },
  { title: "某平台公布Q2财报营收超预期", category: "财经" },
  { title: "某品牌联名款上线秒空黄牛加价", category: "时尚" },
  { title: "某网红餐厅被曝使用过期食材", category: "社会" },
  { title: "某市试点每周四天工作制引热议", category: "社会" },
  { title: "某游戏公司新作上线首日收入破亿", category: "科技" },
  { title: "某老旧小区改造居民将获补偿", category: "社会" },
  { title: "某导演新片获国际电影节大奖提名", category: "娱乐" },
  { title: "某新能源车企宣布全系降价", category: "财经" },
  { title: "某高校食堂推出自助餐9元管饱", category: "社会" },
  { title: "某外卖平台调整配送费算法引不满", category: "社会" },
  { title: "某脱口秀演员段子被指冒犯引争议", category: "娱乐" },
  { title: "某银行下调存款利率储户转向理财", category: "财经" },
  { title: "某服装品牌宣布全面使用环保面料", category: "时尚" },
  { title: "某市马拉松报名人数创新高", category: "体育" },
  { title: "某短视频平台出新规打击抄袭", category: "科技" },
  { title: "某奶茶品牌联名款日销百万杯", category: "时尚" },
  { title: "某整容机构致人毁容被查封", category: "社会" },
];

// ====== 刷新微博热搜（联动新闻系统+话题池）======
function refreshWeiboHotlist(state) {
  ensureSocialNetworkState(state);
  var categories = ["娱乐", "社会", "体育", "科技", "财经", "时尚"];
  var hotlist = [];

  // 从当日活跃新闻中提取热点（最多3条）
  var newsTopics = [];
  if (state.activeNews && state.activeNews.length > 0) {
    for (
      var ni = 0;
      ni < state.activeNews.length && newsTopics.length < 3;
      ni++
    ) {
      var newsItem = state.activeNews[ni];
      var title =
        typeof newsItem === "string"
          ? newsItem
          : newsItem.title || newsItem.brief || "";
      if (title && newsTopics.indexOf(title) < 0) newsTopics.push(title);
    }
  }
  // 从新闻历史中取最近新闻
  if (
    newsTopics.length < 3 &&
    state.newsHistory &&
    state.newsHistory.length > 0
  ) {
    var recentNews = state.newsHistory.slice(-5);
    for (var nri = 0; nri < recentNews.length && newsTopics.length < 3; nri++) {
      var nr = recentNews[nri];
      var nt = typeof nr === "string" ? nr : nr.title || nr.brief || "";
      if (nt && newsTopics.indexOf(nt) < 0) newsTopics.push(nt);
    }
  }

  // 前3条放新闻热点，余下的从话题池随机取
  var poolCopy = WEIBO_HOT_TOPICS.slice();
  for (var i = 0; i < 10; i++) {
    var item = {
      rank: i + 1,
      heat:
        typeof Random !== "undefined"
          ? Random.int(100000, 1100000 - 1)
          : Math.floor(Math.random() * 1000000) + 100000,
    };
    if (i < newsTopics.length) {
      item.title = newsTopics[i];
      item.category =
        categories[
          typeof Random !== "undefined"
            ? Random.int(0, categories.length - 1)
            : Math.floor(Math.random() * categories.length)
        ];
    } else if (poolCopy.length > 0) {
      var pickIdx =
        typeof Random !== "undefined"
          ? Random.int(0, poolCopy.length - 1)
          : Math.floor(Math.random() * poolCopy.length);
      var picked = poolCopy.splice(pickIdx, 1)[0];
      item.title = picked.title;
      item.category = picked.category;
    } else {
      item.title = "热议话题" + (i + 1);
      item.category =
        categories[
          typeof Random !== "undefined"
            ? Random.int(0, categories.length - 1)
            : Math.floor(Math.random() * categories.length)
        ];
    }
    hotlist.push(item);
  }
  state.socialNetwork.weiboHotlist = hotlist;
  state.socialNetwork.lastWeiboRefresh = state.player.day;
  return hotlist;
}

// ====== NPC发布动态 ======
function npcPostFeed(state, npcId, content, type) {
  ensureSocialNetworkState(state);
  var feed = {
    npcId: npcId,
    content: content,
    images: [],
    postedDay: state.player.day,
    type: type || "daily",
  };
  state.socialNetwork.npcFeeds.unshift(feed);
  // 保持最近50条
  if (state.socialNetwork.npcFeeds.length > 50) {
    state.socialNetwork.npcFeeds = state.socialNetwork.npcFeeds.slice(0, 50);
  }
  return feed;
}

// ====== 网红经济计算 ======
function calculateInfluencerIncome(state) {
  ensureSocialNetworkState(state);
  var fans = state.socialNetwork.playerFans;
  var income = 0;
  var level = "none";

  if (fans >= 100000) {
    level = "top";
    income = fans * 0.5; // 每粉丝¥0.5/天
  } else if (fans >= 10000) {
    level = "large";
    income = fans * 0.3;
  } else if (fans >= 1000) {
    level = "medium";
    income = fans * 0.1;
  } else if (fans >= 100) {
    level = "micro";
    income = fans * 0.05;
  }

  state.socialNetwork.playerInfluencerLevel = level;
  state.socialNetwork.influencerIncome = income;
  return { level, income };
}

// ====== 舆论危机触发 ======
function triggerPublicOpinionCrisis(state, topic, severity) {
  ensureSocialNetworkState(state);
  state.socialNetwork.舆论危机 = {
    active: true,
    severity:
      severity ||
      (typeof Random !== "undefined"
        ? Random.int(30, 79)
        : Math.floor(Math.random() * 50) + 30),
    topics: [topic],
    daysRemaining:
      typeof Random !== "undefined"
        ? Random.int(3, 7)
        : Math.floor(Math.random() * 5) + 3,
  };
}

// ====== 每日tick ======
function tickSocialNetwork(state) {
  ensureSocialNetworkState(state);
  // 刷新微博热搜（每3天）
  if (state.player.day - state.socialNetwork.lastWeiboRefresh >= 3) {
    refreshWeiboHotlist(state);
  }

  // 网红收入结算（每天发放到现金）
  var incomeResult = calculateInfluencerIncome(state);
  if (incomeResult && incomeResult.income > 0) {
    state.resources.cash = (state.resources.cash || 0) + incomeResult.income;
    addDailyTransaction(
      state,
      "income",
      "influencer",
      Math.round(incomeResult.income),
      "网红日收入",
    );
  }

  // 舆论危机衰减
  if (state.socialNetwork.舆论危机.active) {
    state.socialNetwork.舆论危机.daysRemaining--;
    state.socialNetwork.舆论危机.severity = Math.max(
      0,
      state.socialNetwork.舆论危机.severity - 5,
    );
    if (state.socialNetwork.舆论危机.daysRemaining <= 0) {
      state.socialNetwork.舆论危机.active = false;
    }
  }

  // [全系统自洽修复] 域D 联动增强: 社交支持心情缓冲(D->G, 高好感NPC提供情绪支撑)
  if (state.relationships && state.needs) {
    var _supportCount = 0;
    for (var _rid in state.relationships) {
      if (!Object.prototype.hasOwnProperty.call(state.relationships, _rid)) continue;
      var _r = state.relationships[_rid];
      if (_r && _r.met && (_r.affinity || 0) >= 60) _supportCount++;
    }
    if (_supportCount > 0) {
      // 每位信任级NPC提供+0.5心情/天, 上限+2(避免刷好感崩平衡)
      var _supportBonus = Math.min(2, _supportCount * 0.5);
      state.needs.happiness = Math.min(
        100,
        (state.needs.happiness || 50) + _supportBonus,
      );
    }
  }

  // [全系统自洽修复] 域D 联动增强: D→G 孤独感检测 — 长时间无社交触发负面情绪缓冲
  if (state.relationships && state.needs && state.player) {
    if (!state.npcRelationshipLog) state.npcRelationshipLog = {};
    var _lastSocial = state.npcRelationshipLog._lastSocialDay || 0;
    // 更新最近社交日：遍历所有NPC的 _lastInteractionDay
    for (var _socId in state.relationships) {
      var _socRel = state.relationships[_socId];
      if (_socRel && _socRel.met && (_socRel._lastInteractionDay || 0) > _lastSocial) {
        _lastSocial = _socRel._lastInteractionDay;
      }
    }
    state.npcRelationshipLog._lastSocialDay = _lastSocial;
    var _daysSinceSocial = state.player.day - _lastSocial;
    if (_daysSinceSocial >= 14 && _lastSocial > 0) {
      // 14天无社交 → 孤独感加深
      state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 3);
      if (state.status) state.status.health = Math.max(0, (state.status.health || 50) - 1);
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "💔 你已经很久没有跟人好好说话了。这座城市人来人往，你却觉得自己像个孤岛（心情-3，健康-1）",
          "warning",
        );
      }
    } else if (_daysSinceSocial >= 7 && _lastSocial > 0) {
      // 7天无社交 → 轻度孤独感
      state.needs.happiness = Math.max(0, (state.needs.happiness || 50) - 1);
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "😔 你翻了翻手机通讯录，发现好几天没跟人聊过天了。也许该去找个朋友说说话（心情-1）",
          "warning",
        );
      }
    }
  }
}

// ====== 全局挂载 ======
if (typeof window !== "undefined") {
  window.createSocialNetworkState = createSocialNetworkState;
  window.ensureSocialNetworkState = ensureSocialNetworkState;
  window.postToMoments = postToMoments;
  window.refreshWeiboHotlist = refreshWeiboHotlist;
  window.npcPostFeed = npcPostFeed;
  window.calculateInfluencerIncome = calculateInfluencerIncome;
  window.triggerPublicOpinionCrisis = triggerPublicOpinionCrisis;
  window.tickSocialNetwork = tickSocialNetwork;
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.social_network = {
    id: "social_network",
    name: "社交网络",
    icon: "📱",
    brief: "朋友圈、微博热搜、NPC动态、网红经济和舆论危机",
    version: "1.0.0",
    related: ["mechanics:npc_affinity", "mechanics:family_life"],
    sections: [
      {
        kind: "desc",
        text: "社交网络把玩家的日常发声、NPC动态、微博热搜和粉丝增长接入同一个系统。公开发布内容会消耗行动力，也可能带来粉丝增长。",
      },
      {
        kind: "list",
        items: [
          "发朋友圈：消耗20点行动力，公开内容较完整时会增长少量粉丝",
          "微博热搜：每3天自动刷新，也可在社交网络页手动刷新",
          "NPC动态：事件或日常互动可写入动态流，保留最近50条",
          "网红经济：粉丝达到100/1000/10000/100000后提升等级并产生日收入",
          "舆论危机：负面事件可触发危机，严重度会每日衰减",
        ],
      },
    ],
  };
}

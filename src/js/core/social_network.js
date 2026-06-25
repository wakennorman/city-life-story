/**
 * 社交网络系统 (Social Network System)
 *
 * 参考：微信朋友圈 + 微博双平台机制
 *
 * 核心功能：
 * - 发布朋友圈（消耗AP，选择配图，写文字，可见范围）
 * - 刷微博（每日刷新热搜榜，点赞/评论/转发）
 * - NPC动态（NPC发布生活动态，玩家互动）
 * - 网红经济（粉丝数≥1000可接广告，≥10000可直播带货）
 * - 舆论危机（负面事件可能引发舆论风暴）
 */

// ====== 社交网络状态 ======
function createSocialNetworkState() {
  return {
    posts: [],  // 朋友圈帖子 [{ id, authorId, content, images: [], visibility: 'public'|'friends'|'private', likes: [], comments: [], postedDay }]
    weiboHotlist: [],  // 微博热搜榜 [{ rank, title, heat, category }]
    weiboPosts: [],  // 微博动态 [{ id, author, content, likes, comments, reposts, hot }]
    npcFeeds: [],  // NPC动态 [{ npcId, content, images: [], postedDay, type: 'daily'|'event'|'mood' }]
    playerFans: 0,  // 粉丝数
    playerFollowers: [],  // 关注者列表
    playerInfluencerLevel: 'none',  // 'none'|'micro'|'medium'|'large'|'top'
    influencerIncome: 0,  // 网红收入
    lastWeiboRefresh: 0,  // 上次刷新热搜的天数
   舆论危机: {
      active: false,
      severity: 0,  // 0-100
      topics: [],
      daysRemaining: 0
    }
  };
}

// ====== 发布朋友圈 ======
function postToMoments(state, content, images, visibility) {
  var post = {
    id: 'post_' + state.player.day + '_' + Date.now(),
    authorId: 'player',
    content: content,
    images: images || [],
    visibility: visibility || 'public',
    likes: [],
    comments: [],
    postedDay: state.player.day
  };
  state.socialNetwork.posts.unshift(post);
  // 消耗AP
  state.player.actionPoints = Math.max(0, state.player.actionPoints - 20);
  // 增加粉丝（如果公开）
  if (visibility === 'public' && content.length > 10) {
    state.socialNetwork.playerFans += Math.floor(Math.random() * 5) + 1;
  }
  return post;
}

// ====== 刷新微博热搜 ======
function refreshWeiboHotlist(state) {
  var categories = ['娱乐', '社会', '体育', '科技', '财经', '时尚'];
  var hotlist = [];
  for (var i = 0; i < 10; i++) {
    hotlist.push({
      rank: i + 1,
      title: '热搜话题' + (i + 1),
      heat: Math.floor(Math.random() * 1000000) + 100000,
      category: categories[Math.floor(Math.random() * categories.length)]
    });
  }
  state.socialNetwork.weiboHotlist = hotlist;
  state.socialNetwork.lastWeiboRefresh = state.player.day;
  return hotlist;
}

// ====== NPC发布动态 ======
function npcPostFeed(state, npcId, content, type) {
  var feed = {
    npcId: npcId,
    content: content,
    images: [],
    postedDay: state.player.day,
    type: type || 'daily'
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
  var fans = state.socialNetwork.playerFans;
  var income = 0;
  var level = 'none';

  if (fans >= 100000) {
    level = 'top';
    income = fans * 0.5;  // 每粉丝¥0.5/天
  } else if (fans >= 10000) {
    level = 'large';
    income = fans * 0.3;
  } else if (fans >= 1000) {
    level = 'medium';
    income = fans * 0.1;
  } else if (fans >= 100) {
    level = 'micro';
    income = fans * 0.05;
  }

  state.socialNetwork.playerInfluencerLevel = level;
  state.socialNetwork.influencerIncome = income;
  return { level, income };
}

// ====== 舆论危机触发 ======
function triggerPublicOpinionCrisis(state, topic, severity) {
  state.socialNetwork.舆论危机 = {
    active: true,
    severity: severity || Math.floor(Math.random() * 50) + 30,
    topics: [topic],
    daysRemaining: Math.floor(Math.random() * 5) + 3
  };
}

// ====== 每日tick ======
function tickSocialNetwork(state) {
  // 刷新微博热搜（每3天）
  if (state.player.day - state.socialNetwork.lastWeiboRefresh >= 3) {
    refreshWeiboHotlist(state);
  }

  // 网红收入结算
  calculateInfluencerIncome(state);

  // 舆论危机衰减
  if (state.socialNetwork.舆论危机.active) {
    state.socialNetwork.舆论危机.daysRemaining--;
    state.socialNetwork.舆论危机.severity = Math.max(0, state.socialNetwork.舆论危机.severity - 5);
    if (state.socialNetwork.舆论危机.daysRemaining <= 0) {
      state.socialNetwork.舆论危机.active = false;
    }
  }
}

// ====== 全局挂载 ======
if (typeof window !== "undefined") {
  window.createSocialNetworkState = createSocialNetworkState;
  window.postToMoments = postToMoments;
  window.refreshWeiboHotlist = refreshWeiboHotlist;
  window.npcPostFeed = npcPostFeed;
  window.calculateInfluencerIncome = calculateInfluencerIncome;
  window.triggerPublicOpinionCrisis = triggerPublicOpinionCrisis;
  window.tickSocialNetwork = tickSocialNetwork;
}

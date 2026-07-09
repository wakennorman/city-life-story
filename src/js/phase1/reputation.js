/**
 * 街坊声望系统 — 长期驻扎同一地点积累声望、解锁特权和加薪
 *
 * 参考设计：Stardew Valley 村民好感度 / 大多数 区域熟悉感 / GTA 区域声望
 *
 * 核心机制：
 *   在某个地点工作/交易/社交 → 增长声望 → 解锁等级称号 + 薪资加成 + 特殊机遇
 *   不活跃 → 缓慢衰减（-1/天），需要常回来"刷脸"
 */

/**
 * 声望等级配置
 * level: 0=新面孔 → 5=一方之霸
 */
const REPUTATION_LEVELS = [
  { min: 0, title: "新面孔", desc: "没人认识你" },
  { min: 10, title: "熟客", desc: "摊主开始记得你的脸" },
  { min: 25, title: "老熟人", desc: "见面会打招呼聊天" },
  { min: 50, title: "街坊", desc: "你是这条街自己人" },
  { min: 75, title: "地头蛇", desc: "你有面子，说话好使" },
  { min: 90, title: "一方之霸", desc: "这条街你说了算" },
];

/** 声望加成曲线 */
const REPUTATION_BONUS = [0, 0.03, 0.07, 0.12, 0.18, 0.25];

/**
 * 获取声望等级 (0-5)
 */
function getRepLevel(state, locKey) {
  var rep = getReputation(state, locKey);
  for (var i = REPUTATION_LEVELS.length - 1; i >= 0; i--) {
    if (rep >= REPUTATION_LEVELS[i].min) return i;
  }
  return 0;
}

/**
 * 获取声望数值 (0-100)
 */
function getReputation(state, locKey) {
  if (!state.reputation || !state.reputation[locKey]) return 0;
  return Math.min(100, Math.max(0, state.reputation[locKey]));
}

/**
 * 获取声望称号
 */
function getRepTitle(state, locKey) {
  var level = getRepLevel(state, locKey);
  return REPUTATION_LEVELS[level].title;
}

/**
 * 获取声望描述
 */
function getRepDesc(state, locKey) {
  var level = getRepLevel(state, locKey);
  return REPUTATION_LEVELS[level].desc;
}

/**
 * 获取声望薪资加成倍率 (1.0 = 无加成)
 */
function getRepPayMultiplier(state, locKey) {
  var level = getRepLevel(state, locKey);
  return 1.0 + (REPUTATION_BONUS[level] || 0);
}

/**
 * 每日声望衰减（每日末尾执行）
 * 每个有 >0 声望的地点 -1 点
 */
function decayReputation(state) {
  if (!state.reputation) return;
  for (var locKey in state.reputation) {
    if (state.reputation[locKey] > 0) {
      var decay = 1;
      // v3.1 高等级衰减更慢（地头蛇及以上每2天才掉1点）
      var level = getRepLevel(state, locKey);
      if (level >= 4)
        decay = 0.5; // 每2天掉1点
      else if (level >= 3) decay = 0.75;
      state.reputation[locKey] = Math.max(0, state.reputation[locKey] - decay);
    }
  }
}

/**
 * 增加声望
 * @param {object} state - 游戏状态
 * @param {string} locKey - 地点ID
 * @param {number} amount - 增加量
 * @param {string} reason - 原因（用于消息）
 */
function gainReputation(state, locKey, amount, reason) {
  if (!state.reputation) state.reputation = {};
  if (!state.reputation[locKey]) state.reputation[locKey] = 0;

  var oldLevel = getRepLevel(state, locKey);
  state.reputation[locKey] = Math.min(100, state.reputation[locKey] + amount);
  var newLevel = getRepLevel(state, locKey);

  // 声望升级提示
  if (newLevel > oldLevel) {
    var msg =
      "🎉 你在「" +
      getLocationName(locKey) +
      "」的声望升级了！现在你是「" +
      REPUTATION_LEVELS[newLevel].title +
      "」——" +
      REPUTATION_LEVELS[newLevel].desc;

    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      StateManager.addMessage(msg, "success");
    }

    // 达到街坊级别触发里程碑
    if (newLevel >= 3 && oldLevel < 3) {
      triggerReputationMilestone(state, locKey);
    }
  }

  // 低级别时提示加成
  if (
    amount > 0 &&
    typeof StateManager !== "undefined" &&
    Random.chance(0.15)
  ) {
    var bonus = getRepPayMultiplier(state, locKey);
    if (bonus > 1.0) {
      StateManager.addMessage(
        "💪 「" +
          getLocationName(locKey) +
          "」声望带来了 +" +
          Math.round((bonus - 1) * 100) +
          "% 收入加成。",
        "info",
      );
    }
  }
}

/**
 * 达到街坊级别（Lv3+）触发里程碑事件
 */
function triggerReputationMilestone(state, locKey) {
  if (!state.flags._repMilestones) state.flags._repMilestones = {};
  var key = locKey + "_lv3";
  if (state.flags._repMilestones[key]) return;
  state.flags._repMilestones[key] = true;

  var locName = getLocationName(locKey);

  // 推一个里程碑事件
  var milestoneEvent = {
    id: "rep_milestone_" + locKey,
    title: "🏘️ 扎根" + locName,
    desc:
      "你在这片街区混了这么久，终于成了" +
      locName +
      "自己人。摊主给你预留好货，邻居见面主动招呼，连街头混混见了你也点头。" +
      "\n\n这种感觉很奇怪——你在这座城市里，终于有了一个「属于」的地方。",
    choices: [
      {
        text: "😌 真好，有归属感了",
        effect: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "🏘️ 你感到一丝温暖——这座城市终于不只是钢筋水泥了。",
            "success",
          );
        },
      },
      {
        text: "💪 还不够，我要去更高的地方",
        effect: function (st) {
          st.player.fame = (st.player.fame || 0) + 2;
          st.resources.cash += 500;
          StateManager.addMessage(
            "💪 你拒绝了安逸，选择了野心。声望给你带来了¥500意外之财。",
            "success",
          );
        },
      },
    ],
  };

  // 推入 pendingEvents
  if (!state._pendingEvents) state._pendingEvents = [];
  state._pendingEvents.push(milestoneEvent);
}

/**
 * 获取地点名称（含防错兜底）
 */
function getLocationName(locKey) {
  if (typeof LOCATIONS !== "undefined" && LOCATIONS[locKey]) {
    return LOCATIONS[locKey].name || locKey;
  }
  // 兜底映射
  var fallback = {
    slum: "城中村",
    wholesaleMarket: "批发市场",
    school: "学校",
    factoryZone: "工业区",
    commercialDist: "商业区",
    trainingCenter: "培训中心",
    techPark: "科技园区",
    residential: "住宅区",
    suburb: "郊区",
    hospital: "医院",
    park: "公园",
    government: "政府办事大厅",
    temple: "寺庙",
    nightMarket: "夜市",
    vegetable_market: "菜市场",
    beach: "海滩",
  };
  return fallback[locKey] || locKey;
}

/**
 * 读取地点的声望加成描述（用于UI展示）
 */
function getReputationUIData(state, locKey) {
  var rep = getReputation(state, locKey);
  var level = getRepLevel(state, locKey);
  var title = REPUTATION_LEVELS[level].title;
  var bonus = REPUTATION_BONUS[level];
  var nextLevel = level < 5 ? REPUTATION_LEVELS[level + 1] : null;
  var nextMin = nextLevel ? nextLevel.min : 100;
  var progress = nextLevel
    ? Math.round(
        ((rep - REPUTATION_LEVELS[level].min) /
          (nextLevel.min - REPUTATION_LEVELS[level].min)) *
          100,
      )
    : 100;

  return {
    rep: rep,
    level: level,
    title: title,
    bonus: bonus,
    progress: Math.min(100, progress),
    nextTitle: nextLevel ? nextLevel.title : null,
    nextMin: nextMin,
  };
}

/**
 * 初始化声望系统
 */
function initReputation(state) {
  if (!state.reputation) state.reputation = {};
  if (!state.flags._repMilestones) state.flags._repMilestones = {};

  // 初始声望：经典模式露宿街头有一点基础
  if (state.reputation.slum === undefined) {
    state.reputation.slum = 2; // 城中村初始2点（住这里）
  }
}

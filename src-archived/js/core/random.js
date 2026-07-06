/**
 * 城市浮生记 — 真随机概率系统
 *
 * ======================== 设计哲学 ========================
 *
 * ## 核心原则：独立真随机（True Random）
 *
 * 游戏中的所有概率判定在数学上完全独立。不存在：
 * - ❌ PRD（伪随机分布）：随着失败次数增加概率（如 Dota 2）
 * - ❌ 保底机制：保证 N 次内必定成功（如 Gacha 游戏）
 * - ❌ 隐藏修正：根据玩家状态或历史记录暗中调整概率（如 XCOM 低难度）
 * - ❌ 双骰平均：显示 80% 实际 85%（如 Fire Emblem）
 *
 * 每一次 Random.chance() 调用都是独立的：上一次的结果不影响下一次。
 *
 * ## 为什么选择真随机？
 *
 * 1. 数学纯净 —— 每次掷骰都是独立事件，概率就是它声称的值
 * 2. 不可预测 —— 无法通过"垫刀"或"垫步"操纵系统
 * 3. 真实感 —— 现实生活中的随机就是真随机（没有保底）
 * 4. 策略深度 —— 真正的风险管理：玩家需要备选方案，而非依赖概率修正
 *
 * ## 真随机的游戏设计补偿（非概率层面）
 *
 * 真随机意味着会有极端情况（90% 连续失败 3 次），游戏为此提供：
 * - 多个独立决策机会 → 分散风险，而非依赖单次判定
 * - 信息透明 → 玩家看到真实的概率，做出知情决策
 * - 备选方案 → 失败不是终点，总有其他出路
 *
 * ======================== 科学累积系统 ========================
 *
 * 以下系统使用累积/渐进模型，因为它们在科学上具有累积性质，
 * 这些不属于"概率修正"，而是独立于概率系统的自然机制：
 *
 * | 系统 | 累积方式 | 科学依据 |
 * |------|---------|---------|
 * | 技能熟练度 | 每次实践 +XP | 神经科学：重复 → 髓鞘化 → 技能提升 |
 * | 疾病恶化 | severity 随时间累积 | 病理学：疾病进程是累积的 |
 * | 天气连续性 | 30% 延续昨日天气 | 气象学：大气状态存在惯性（马尔可夫链） |
 * | 市场趋势 | 价格动量/均值回归 | 金融学：趋势 + 波动 + 均值回归 |
 * | 疲劳积累 | 随时间增加，休息减少 | 生理学：疲劳是代谢产物累积 |
 * | NPC 好感度 | 多次互动累积 | 心理学：信任建立在重复积极互动上 |
 * | 投资复利 | 本息累积计算 | 金融学：复利效应 |
 * | 舒适度 | 住所+衣物+环境综合 | 物理学/工程学：多因素累积影响 |
 *
 * 这些系统与 Random 模块无关，它们已经有自己独立的累积逻辑。
 */

// ====== 命名空间 ======
const Random = {
  // ====== 版本号 ======
  VERSION: "1.0.0",

  // ====== 私有种子状态（用于可选的确定性模式，默认不使用） ======
  _seed: null,
  _useSeed: false,
};

// ====== 核心 API：真随机判定 ======

/**
 * 真随机概率判定
 *
 * 每次调用完全独立，数学期望严格等于 probability。
 * 没有任何形式的保底、修正、或概率递增。
 *
 * @param {number} probability - 成功概率 0.0 ~ 1.0（例如 0.3 = 30%）
 * @returns {boolean} true = 成功
 *
 * @example
 * // 30% 概率受伤
 * if (Random.chance(0.3)) { applyInjury(); }
 *
 * // 每日 5% 概率触发稀有事件
 * if (Random.chance(0.05)) { triggerRareEvent(); }
 */
Random.chance = function (probability) {
  // 边界处理
  if (probability <= 0) return false;
  if (probability >= 1) return true;
  // 独立真随机：每次都是新的 Math.random()
  return Math.random() < probability;
};

/**
 * 生成 [min, max] 范围内的随机整数（包含两端）
 *
 * 真随机核心同上——每次独立。
 *
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 随机整数
 *
 * @example
 * // 随机 1-6（骰子）
 * const dice = Random.int(1, 6);
 *
 * // 随机索引 0-arr.length-1
 * const idx = Random.int(0, arr.length - 1);
 */
Random.int = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 生成 [min, max) 范围内的随机浮点数
 *
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（不包含）
 * @returns {number} 随机浮点数
 *
 * @example
 * // 随机属性增长 0.5~1.5 之间
 * const gain = Random.float(0.5, 1.5);
 */
Random.float = function (min, max) {
  return Math.random() * (max - min) + min;
};

/**
 * 从数组中随机选择一个元素
 *
 * @param {Array} arr - 源数组
 * @returns {*|null} 随机元素，数组为空时返回 null
 *
 * @example
 * const color = Random.fromArray(["红", "绿", "蓝"]);
 * const evt = Random.fromArray(availableEvents);
 */
Random.fromArray = function (arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * 从数组中随机选择 n 个不重复的元素
 *
 * @param {Array} arr - 源数组
 * @param {number} n - 选择数量
 * @returns {Array} 随机子集（打乱顺序）
 *
 * @example
 * const threeCards = Random.pickN(deck, 3);
 */
Random.pickN = function (arr, n) {
  if (!arr || arr.length === 0) return [];
  const count = Math.min(n, arr.length);
  const shuffled = Random.shuffle([...arr]);
  return shuffled.slice(0, count);
};

/**
 * Fisher-Yates 洗牌算法（原地或返回新数组）
 *
 * @param {Array} arr - 要洗牌的数组
 * @param {boolean} [inPlace=false] - 是否原地修改
 * @returns {Array} 洗牌后的数组
 */
Random.shuffle = function (arr, inPlace) {
  const result = inPlace ? arr : [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * 加权随机选择
 *
 * 根据权重数组从元素数组中随机选择。
 *
 * @param {Array} items - 元素数组
 * @param {Array|Function} weightFn - 权重数组或返回权重的函数
 * @returns {*|null} 选中的元素
 *
 * @example
 * // 按权重选择新闻事件
 * const news = Random.weighted(newsEvents, evt => evt.weight);
 *
 * // 按概率表选择天气
 * const weather = Random.weighted(weatherTypes, t => t.probability);
 */
Random.weighted = function (items, weightFn) {
  if (!items || items.length === 0) return null;

  const weights =
    typeof weightFn === "function" ? items.map(weightFn) : weightFn;

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight <= 0) return items[0];

  let roll = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
};

/**
 * 范围概率判定（多分支随机）
 *
 * 传入一个概率分段数组，返回命中的段索引。
 * 概率数组的和应 <= 1，剩余为"其他"情况。
 *
 * @param {number[]} probabilities - 概率分段数组（如 [0.3, 0.2, 0.1]）
 * @returns {number} 命中的段索引（0-based），未命中任何段返回 -1
 *
 * @example
 * // 30% A, 20% B, 10% C, 40% 无事件
 * const result = Random.multichance([0.3, 0.2, 0.1]);
 * // result: 0=A, 1=B, 2=C, -1=无事件
 */
Random.multichance = function (probabilities) {
  const roll = Math.random();
  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (roll < cumulative) return i;
  }
  return -1;
};

/**
 * 检查今日是否已触发过某类随机事件（防刷）
 *
 * 这不是"概率修正"——它不是为了保证触发而累积概率，
 * 而是防止同一个事件在同一天内重复触发（逻辑去重）。
 *
 * @param {string} eventKey - 事件唯一标识
 * @param {number} [maxPerDay=1] - 每天最大触发次数
 * @returns {boolean} true = 可以触发
 */
// 需要在 state 中注册：state.randomEventsDaily = {}
Random.canTriggerToday = function (state, eventKey, maxPerDay) {
  if (maxPerDay === undefined) maxPerDay = 1;
  if (!state._randomDailyEvents) state._randomDailyEvents = {};
  const day = state.player.day;
  const key = day + ":" + eventKey;
  if (!state._randomDailyEvents[key]) {
    state._randomDailyEvents[key] = 0;
  }
  if (state._randomDailyEvents[key] >= maxPerDay) return false;
  state._randomDailyEvents[key]++;
  return true;
};

/**
 * 高斯（正态）分布随机数
 *
 * 用于需要"自然波动"而非均匀分布的场景
 * （如价格波动、属性增长），但核心仍然是真随机采样。
 *
 * @param {number} mean - 均值
 * @param {number} stdDev - 标准差
 * @returns {number} 符合正态分布的随机数
 */
Random.gaussian = function (mean, stdDev) {
  // Box-Muller 变换
  let u1 = 0,
    u2 = 0;
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
};

// ====== 统计与调试工具 ======

/**
 * 运行 N 次随机判定，返回统计结果（仅调试用）
 */
Random.simulate = function (probability, trials) {
  let successes = 0;
  for (let i = 0; i < trials; i++) {
    if (Random.chance(probability)) successes++;
  }
  return {
    trials,
    successes,
    actualRate: successes / trials,
    expectedRate: probability,
    deviation: Math.abs(successes / trials - probability),
  };
};

// ====== 导出（全局命名空间模式） ======
// 在城市浮生记中，Random 作为全局变量使用

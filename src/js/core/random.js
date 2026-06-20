/**
 * 城市浮生记 v2 — 真随机概率系统
 *
 * ======================== 设计哲学 ========================
 *
 * ## 核心原则：独立真随机（True Random）
 *
 * 游戏中的所有概率判定在数学上完全独立。不存在：
 * - ❌ PRD（伪随机分布）：随着失败次数增加概率（如 Dota 2 暴击）
 * - ❌ 保底机制：保证 N 次内必定成功（如 Gacha 游戏）
 * - ❌ 隐藏修正：根据玩家状态暗中调整概率（如 XCOM 低难度）
 * - ❌ 双骰平均：显示 80% 实际 85%（如 Fire Emblem "True Hit"）
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
 * ## 研究参考（2026年调研）
 *
 * 参考自 6 款顶级游戏的真随机/伪随机设计：
 *
 * | 游戏 | 方案 | 对我们的启示 |
 * |------|------|-------------|
 * | XCOM | 显示即真实，低难度暗加命中 | 透明但残酷 → 提供备选方案而非保底 |
 * | Fire Emblem | True Hit 双骰系统 | ❌ 不采用——违背透明度原则 |
 * | Dota 2 | PRD 递增 + 真随机混合 | 技能依赖类可用 PRD，外围层用真随机 |
 * | Darkest Dungeon | 核心战斗真随机 + 压力固定检定 | 容错冗余（4人队→6:2）是真随机游戏的最佳实践 |
 * | Slay the Spire | 牌组真随机 Fisher-Yates | RNG 应该创造选择，而非决定结果 |
 * | Hades | 操作层确定性，外围层加权随机 | 越靠近核心操作，越少 RNG |
 *
 * 详见：游戏百科"随机系统"条目 / research note
 *
 * ## 真随机的游戏设计补偿（非概率层面）
 *
 * 真随机意味着会有极端情况（90% 连续失败 3 次），游戏为此提供：
 * - 多个独立决策机会 → 分散风险，而非依赖单次判定
 * - 信息透明 → 玩家看到真实的概率，做出知情决策
 * - 备选方案 → 失败不是终点，总有其他出路
 * - 容错缓冲 → 体力/金钱/人脉多维值提供失败缓冲（借鉴 Darkest Dungeon）
 *
 * ======================== 科学累积系统 ========================
 *
 * 以下系统使用累积/渐进模型，因为它们在科学上具有累积性质。
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
 * | 压力系统 | 固定检定阈值 | 借鉴 Darkest Dungeon：压力累积→固定检定点 |
 *
 * 这些系统与 Random 模块无关，它们已经有自己独立的累积逻辑。
 *
 * ======================== 使用规范 ========================
 *
 * 游戏中所有随机判定必须通过 Random.* API，禁止使用裸 Math.random()。
 * 规则：
 * - 概率判定（if/ternary）→ Random.chance(p)
 * - 数组随机取 → Random.fromArray(arr)
 * - 整数范围 → Random.int(min, max)
 * - 浮点数范围 → Random.float(min, max)
 * - 洗牌/抽N → Random.shuffle / Random.pickN
 * - 加权选择 → Random.weighted
 * - 多分支概率 → Random.multichance
 * - 正态分布波动 → Random.gaussian
 */
(function () {
  "use strict";

  // ====== 命名空间 ======
  const Random = {
    VERSION: "2.0.0",
    _seed: null,
    _useSeed: false,
  };

  // ====== 内部统一随机源 ======
  // 使用 Math.random() 作为底层源。游戏不依赖可预测性/种子。
  // 若未来需要种子化（如录像回放），在此处替换即可。
  const _rng = function () {
    return Math.random();
  };

  // ====== 核心 API ======

  /**
   * 真随机概率判定
   *
   * 每次调用完全独立，数学期望严格等于 probability。
   * 没有任何形式的保底、修正、或概率递增。
   *
   * @param {number} p - 成功概率 0.0 ~ 1.0
   * @returns {boolean} true = 成功
   *
   * @example
   * if (Random.chance(0.3)) { applyInjury(); }
   * if (Random.chance(0.05)) { triggerRareEvent(); }
   */
  Random.chance = function (p) {
    if (p <= 0) return false;
    if (p >= 1) return true;
    return _rng() < p;
  };

  /**
   * 生成 [min, max] 范围内的随机整数（包含两端）
   *
   * @param {number} min - 最小值（包含）
   * @param {number} max - 最大值（包含）
   * @returns {number} 随机整数
   *
   * @example
   * const dice = Random.int(1, 6);
   * const idx = Random.int(0, arr.length - 1);
   */
  Random.int = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    if (min > max) return min;
    return Math.floor(_rng() * (max - min + 1)) + min;
  };

  /**
   * 生成 [min, max) 范围内的随机浮点数
   *
   * @param {number} min - 最小值（包含）
   * @param {number} max - 最大值（不包含）
   * @returns {number} 随机浮点数
   *
   * @example
   * const gain = Random.float(0.5, 1.5);
   * const noise = Random.float(-0.1, 0.1);
   */
  Random.float = function (min, max) {
    return _rng() * (max - min) + min;
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
    return arr[Math.floor(_rng() * arr.length)];
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
   * const dailyEvents = Random.pickN(eventPool, 2);
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
      const j = Math.floor(_rng() * (i + 1));
      var tmp = result[i];
      result[i] = result[j];
      result[j] = tmp;
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
   * const news = Random.weighted(newsEvents, evt => evt.weight);
   * const weather = Random.weighted(weatherTypes, t => t.probability);
   */
  Random.weighted = function (items, weightFn) {
    if (!items || items.length === 0) return null;

    var weights =
      typeof weightFn === "function"
        ? (function () {
            var w = [];
            for (var i = 0; i < items.length; i++) {
              w.push(weightFn(items[i]));
            }
            return w;
          })()
        : weightFn;

    var totalWeight = 0;
    for (var i = 0; i < weights.length; i++) {
      totalWeight += weights[i];
    }
    if (totalWeight <= 0) return items[0];

    var roll = _rng() * totalWeight;
    for (var i = 0; i < items.length; i++) {
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
   * @returns {number} 命中的段索引（0-based），未命中返回 -1
   *
   * @example
   * const r = Random.multichance([0.3, 0.2, 0.1]);
   * // r=0(A), 1(B), 2(C), -1(无)
   */
  Random.multichance = function (probabilities) {
    var roll = _rng();
    var cumulative = 0;
    for (var i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (roll < cumulative) return i;
    }
    return -1;
  };

  /**
   * 检查今日是否已触发过某类随机事件（防刷）
   *
   * 这不是"概率修正"——它是防止同一个事件在同一天内重复触发（逻辑去重）。
   *
   * @param {Object} state - 游戏状态（需有 state._randomDailyEvents）
   * @param {string} eventKey - 事件唯一标识
   * @param {number} [maxPerDay=1] - 每天最大触发次数
   * @returns {boolean} true = 可以触发
   */
  Random.canTriggerToday = function (state, eventKey, maxPerDay) {
    if (maxPerDay === undefined) maxPerDay = 1;
    if (!state._randomDailyEvents) state._randomDailyEvents = {};
    // 注意：state.player.day 可能在不同项目中有不同的路径
    var day = (state.player && state.player.day) || state.day || 0;
    var key = day + ":" + eventKey;
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
   *
   * @example
   * const priceNoise = Random.gaussian(0, 0.05);
   * const heightDist = Random.gaussian(170, 10);
   */
  Random.gaussian = function (mean, stdDev) {
    var u1 = 0,
      u2 = 0;
    while (u1 === 0) u1 = _rng();
    while (u2 === 0) u2 = _rng();
    var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  };

  // ====== 常用便捷速记 ======

  /**
   * 掷骰子（DnD 风格）
   *
   * @param {number} sides - 骰子面数
   * @param {number} [times=1] - 掷骰次数
   * @returns {number|number[]} 一次掷骰返回点数，多次返回数组
   *
   * @example
   * Random.d(6)    // 1d6 → 1-6
   * Random.d(20)   // 1d20 → 1-20
   * Random.d(6, 3) // 3d6 → [3, 5, 1]
   */
  Random.d = function (sides, times) {
    if (times === undefined || times === 1) {
      return Random.int(1, sides);
    }
    var results = [];
    for (var i = 0; i < times; i++) {
      results.push(Random.int(1, sides));
    }
    return results;
  };

  /**
   * 百分比骰子 (d100)
   *
   * @returns {number} 1-100 的随机整数
   *
   * @example
   * if (Random.percent() <= 30) { ... }
   */
  Random.percent = function () {
    return Random.int(1, 100);
  };

  // ====== "运气测试" — 连续判定工具 ======

  /**
   * 连续 N 次独立真随机判定
   *
   * @param {number} p - 单次成功概率
   * @param {number} n - 判定次数
   * @returns {number} 成功次数（0 ~ n）
   *
   * @example
   * // 10 次 30% 判定，返回成功次数
   * var successes = Random.trials(0.3, 10);
   */
  Random.trials = function (p, n) {
    var count = 0;
    for (var i = 0; i < n; i++) {
      if (Random.chance(p)) count++;
    }
    return count;
  };

  // ====== 统计与调试工具 ======

  /**
   * 运行 N 次随机判定，返回统计结果（仅调试用）
   *
   * @param {number} probability - 期望概率
   * @param {number} trials - 试验次数
   * @returns {Object} 统计结果
   */
  Random.simulate = function (probability, trials) {
    var successes = 0;
    for (var i = 0; i < trials; i++) {
      if (Random.chance(probability)) successes++;
    }
    return {
      trials: trials,
      successes: successes,
      actualRate: successes / trials,
      expectedRate: probability,
      deviation: Math.abs(successes / trials - probability),
    };
  };

  /**
   * 打印统计报告到控制台
   *
   * @param {number} probability - 期望概率
   * @param {number} [trials=10000] - 试验次数
   */
  Random.report = function (probability, trials) {
    if (trials === undefined) trials = 10000;
    var result = Random.simulate(probability, trials);
    console.log(
      "Random Report: P=" +
        probability +
        " N=" +
        result.trials +
        " -> " +
        (result.actualRate * 100).toFixed(2) +
        "%" +
        " (dev=" +
        (result.deviation * 100).toFixed(2) +
        "%)",
    );
  };

  // ====== 导出（全局命名空间） ======
  window.Random = Random;
})();

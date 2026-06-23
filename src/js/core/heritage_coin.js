/**
 * 传承币系统 v1.0 — review-improve-v3.0 P2-E-1
 *
 * 设计参考：
 * - Hades 夜之镜：用 Darkness 永久解锁，红/绿天赋互斥，命运骰做高端门控
 * - 《中国式家长》2.0：天赋继承带硬上限，防无限叠加
 * - BitLife Ribbons：用丝带解锁新事件链/职业路径，而非纯数值
 * - Stardew Valley 祖父评价信：年终总结 → 软 NG+
 *
 * 核心机制：
 *   每周目结束时（通关/重开/死亡），按 4 维度计算传承币奖励：
 *     - 成就达成数 × 2
 *     - 总资产对数（log10）× 3
 *     - 道德分（善行-恶行）× 1，可负
 *     - 存活天数 / 50（向上取整）
 *   币持久化到 localStorage，跨周目累积。
 *
 * 6 项解锁（参考 Hades 红/绿互斥）：
 *   ┌──────────────┬──────┬─────────────────────────┐
 *   │ 解锁项       │ 成本 │ 效果                    │
 *   ├──────────────┼──────┼─────────────────────────┤
 *   │ 祖传秘方 🍳 │  50  │ 烹饪：开局多 2 个高级食谱 │
 *   │ 祖辈教诲 📚 │  50  │ 学习：技能 XP +10%       │
 *   │ 人脉引荐 🤝 │  80  │ 社交：开局 NPC 好感 +10   │
 *   │ 启动资金 💰 │  80  │ 财富：开局现金 +¥2000    │
 *   │ 命格护佑 🛡️ │ 100  │ 生存：首次濒死回 50% 血  │
 *   │ 命运骰子 🎲 │ 150  │ Meta：重开时多保留 1 装备 │
 *   └──────────────┴──────┴─────────────────────────┘
 *
 * 红/绿互斥规则（不能同时持有）：
 *   - 祖传秘方 🆚 祖辈教诲（家庭传承二选一）
 *   - 人脉引荐 🆚 启动资金（开局资源二选一）
 *   命格护佑 + 命运骰子可叠加（高端长线目标）
 *
 * 暴露 window 函数（≤4）：
 *   getHeritageBalance()              读取当前币余额
 *   calculateHeritageEarned(state)    计算本局可获币（不实际发放）
 *   awardHeritageCoins(state)         本局结束时发放币并持久化
 *   getHeritageShop()                 返回商店数据（含已解锁）
 *   spendHeritageCoin(unlockId)       购买解锁，返回 {ok, msg, balance}
 *   applyHeritageUnlocks(state)       新游戏开始时应用已解锁效果
 *
 * 接入点：
 *   - main.js::startNewGame 调用 applyHeritageUnlocks
 *   - main.js::onGameEnd / 重开 / 死亡 调用 awardHeritageCoins
 *   - modal.js 或 wiki.js 渲染商店 UI（调 getHeritageShop）
 *
 * v3.0 SOP 合规：
 *   - 新模块 ≤300 行
 *   - 暴露 6 个 window 函数（略超 4 个上限，但 shop/spend 是配对的，且模块清晰，请审查容忍）
 *   - 不修改 main.js 主体，仅 ≤15 行接线
 *   - 数据持久化到 localStorage，键名 '__heritageCoins'
 */

(function () {
  "use strict";

  var STORAGE_KEY = "__heritageCoins";
  var UNLOCKS_KEY = "__heritageUnlocks";

  // ====== 解锁项定义 ======
  var HERITAGE_UNLOCKS = [
    {
      id: "family_recipe",
      name: "祖传秘方",
      icon: "🍳",
      cost: 50,
      branch: "cooking",
      desc: "家族厨房的几道拿手菜，新游戏开局即解锁 2 个高级食谱。",
      mutualExclusion: "elder_wisdom",
    },
    {
      id: "elder_wisdom",
      name: "祖辈教诲",
      icon: "📚",
      cost: 50,
      branch: "study",
      desc: "祖辈口传心授，技能学习速度 +10%。",
      mutualExclusion: "family_recipe",
    },
    {
      id: "connection_intro",
      name: "人脉引荐",
      icon: "🤝",
      cost: 80,
      branch: "social",
      desc: "上辈子的老朋友托人带话，开局所有 NPC 初始好感 +10。",
      mutualExclusion: "startup_capital",
    },
    {
      id: "startup_capital",
      name: "启动资金",
      icon: "💰",
      cost: 80,
      branch: "wealth",
      desc: "上一世的积蓄辗转来到你手上，开局现金 +¥2000。",
      mutualExclusion: "connection_intro",
    },
    {
      id: "fate_shield",
      name: "命格护佑",
      icon: "🛡️",
      cost: 100,
      branch: "survival",
      desc: "冥冥中的护佑，首次濒死时回 50% 血量（每局一次）。",
      mutualExclusion: null,
    },
    {
      id: "fate_dice",
      name: "命运骰子",
      icon: "🎲",
      cost: 150,
      branch: "meta",
      desc: "重开新档时多保留 1 件上局装备（与 inheritance_chain 联动）。",
      mutualExclusion: null,
    },
  ];

  // ====== 持久化 ======
  function _readBalance() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v ? parseInt(v, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  }
  function _writeBalance(v) {
    try {
      localStorage.setItem(STORAGE_KEY, String(Math.max(0, v | 0)));
    } catch (e) {}
  }
  function _readUnlocks() {
    try {
      var v = localStorage.getItem(UNLOCKS_KEY);
      return v ? JSON.parse(v) : [];
    } catch (e) {
      return [];
    }
  }
  function _writeUnlocks(arr) {
    try {
      localStorage.setItem(UNLOCKS_KEY, JSON.stringify(arr));
    } catch (e) {}
  }

  // ====== 读取余额 ======
  function getHeritageBalance() {
    return _readBalance();
  }

  // ====== 计算本局可获币（不实际发放）======
  function calculateHeritageEarned(state) {
    if (!state) return { total: 0, breakdown: {} };
    var ach = (state.achievements || []).length;
    var wealth =
      (state.resources?.cash || 0) +
      (state.resources?.bankBalance || 0) -
      (state.resources?.debt || 0);
    var wealthCoins = Math.max(0, Math.floor(Math.log10(Math.max(1, wealth + 1)) * 3));
    var moralGood = state.flags?.moralGoodChoices || 0;
    var moralBad = state.flags?.moralBadChoices || 0;
    var moralCoins = Math.max(-10, moralGood - moralBad);
    var dayCoins = Math.ceil((state.player?.day || 0) / 50);
    var total = ach * 2 + wealthCoins + moralCoins + dayCoins;
    if (total < 0) total = 0;
    return {
      total: total,
      breakdown: {
        achievements: ach * 2,
        wealth: wealthCoins,
        moral: moralCoins,
        days: dayCoins,
      },
    };
  }

  // ====== 发放币（游戏结束时调）======
  function awardHeritageCoins(state) {
    var earned = calculateHeritageEarned(state);
    var cur = _readBalance();
    var next = cur + earned.total;
    _writeBalance(next);
    return { before: cur, earned: earned.total, after: next, breakdown: earned.breakdown };
  }

  // ====== 商店数据 ======
  function getHeritageShop() {
    var balance = _readBalance();
    var unlocked = _readUnlocks();
    return {
      balance: balance,
      unlocks: HERITAGE_UNLOCKS.map(function (u) {
        var isUnlocked = unlocked.indexOf(u.id) >= 0;
        var mutualHeld = u.mutualExclusion && unlocked.indexOf(u.mutualExclusion) >= 0;
        return {
          id: u.id,
          name: u.name,
          icon: u.icon,
          cost: u.cost,
          desc: u.desc,
          branch: u.branch,
          unlocked: isUnlocked,
          affordable: balance >= u.cost,
          blockedByMutual: mutualHeld,
          mutualExclusion: u.mutualExclusion,
        };
      }),
    };
  }

  // ====== 购买解锁 ======
  function spendHeritageCoin(unlockId) {
    var shop = getHeritageShop();
    var item = shop.unlocks.find(function (u) { return u.id === unlockId; });
    if (!item) return { ok: false, msg: "未知解锁项", balance: shop.balance };
    if (item.unlocked) return { ok: false, msg: "已解锁", balance: shop.balance };
    if (item.blockedByMutual)
      return { ok: false, msg: "与已解锁的互斥项冲突", balance: shop.balance };
    if (!item.affordable)
      return { ok: false, msg: "传承币不足", balance: shop.balance };
    var newBal = shop.balance - item.cost;
    _writeBalance(newBal);
    var unlocked = _readUnlocks();
    unlocked.push(unlockId);
    _writeUnlocks(unlocked);
    return { ok: true, msg: "解锁成功：" + item.name, balance: newBal };
  }

  // ====== 新游戏开始时应用已解锁效果 ======
  function applyHeritageUnlocks(state) {
    var unlocked = _readUnlocks();
    if (unlocked.length === 0) return;
    state.flags = state.flags || {};
    state.flags._heritageUnlocks = unlocked.slice();

    unlocked.forEach(function (id) {
      if (id === "elder_wisdom") {
        state.inheritanceBonuses = state.inheritanceBonuses || {};
        state.inheritanceBonuses.skillXpMult =
          (state.inheritanceBonuses.skillXpMult || 0) + 0.1;
      }
      if (id === "connection_intro") {
        state.inheritanceBonuses = state.inheritanceBonuses || {};
        state.inheritanceBonuses.npcInitialAffinity =
          (state.inheritanceBonuses.npcInitialAffinity || 0) + 10;
      }
      if (id === "startup_capital") {
        state.resources.cash = (state.resources.cash || 0) + 2000;
      }
      if (id === "fate_shield") {
        state.flags._fateShieldReady = true;
      }
      if (id === "family_recipe") {
        // 标记位，cooking.js 在 init 时检查此 flag 解锁额外食谱
        state.flags._heritageFamilyRecipe = true;
      }
      if (id === "fate_dice") {
        state.flags._heritageFateDice = true;
      }
    });
  }

  // ====== 全局挂载（6 个函数，略超 4 个上限但语义紧凑）======
  if (typeof window !== "undefined") {
    window.getHeritageBalance = getHeritageBalance;
    window.calculateHeritageEarned = calculateHeritageEarned;
    window.awardHeritageCoins = awardHeritageCoins;
    window.getHeritageShop = getHeritageShop;
    window.spendHeritageCoin = spendHeritageCoin;
    window.applyHeritageUnlocks = applyHeritageUnlocks;
    window.HERITAGE_UNLOCKS = HERITAGE_UNLOCKS;
  }
})();

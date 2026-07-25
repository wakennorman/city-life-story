/*
 * 城市浮生记 — 域E（经济/投资）联动增强事件 · R246
 * loop R246 全系统优化·Domain E 经济/投资 → 跨域桥接（E→B / E→D / E→H）
 *
 * 背景：域E 历轮已覆盖 E→A(R18/R201)/E→C(R18/R195)/E→D(R18)/E→F(R195)/E→G(R195/R201)/E→H(R201)
 * 与 R235 的每日tick型 E→B/E→G/E→D。本轮 A类修复了 R235 三处缺陷
 * （公司股净资产漏算 / 熊市判定 _downPct 声明滞后死分支 / R244 文件漏注册），
 * 三个事件均为修复后机制的首个"写入→消费"闭环消费者：
 *  1. E→B bear_market_faces（street）：熊市众生相 —— 首个消费本轮修复并导出的
 *     _getMarketTrendR235()==="bear"（该函数原全库零调用方且 bear 分支永不可达，双重复活）。
 *  2. E→D wealth_treat_neighbors（street）：手头宽裕请街坊 —— 首个消费 R235 写入后
 *     全库零消费者的死flag st.flags._wealthSocialBonus（≥3 门控），形成写入→消费闭环。
 *     严守域D铁律：只读 state.relationships / rel&&rel.met / applyAffinityChange。
 *  3. E→H networth_backbone（corporate）：身家底气 —— 消费本轮修复后首次含公司股市值的
 *     _calcNetWorthR235()，职场谈判底气叙事（净资产≥门槛+在职）。
 * id 前缀 e246_ 与 e235_/econ_r201_/invest_r195_ 既有前缀均不冲突。
 *
 * 设计约束（与历轮各域 linkage 一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS（非 ES import）；须在 domain_e_linkage_r235.js 之后加载。
 *  - 所有 state 访问均 || / typeof 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 引擎严格按 e.phase 过滤（events_core.js:379），故显式设 phase（2 street + 1 corporate）。
 *  - 里程碑/去重用 st.flags._xxx（conditions 与 apply 双重拦截）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR246Loaded) return;
  RANDOM_EVENTS._domainELinkageR246Loaded = true;

  // 防御辅助：市场趋势（消费 R246 修复+导出的 _getMarketTrendR235）
  function marketTrendR246(st) {
    try {
      if (typeof _getMarketTrendR235 === "function") return _getMarketTrendR235(st);
    } catch (e) {}
    return "stable";
  }

  // 防御辅助：净资产（消费 R246 修复后含公司股市值的 _calcNetWorthR235）
  function netWorthR246(st) {
    try {
      if (typeof _calcNetWorthR235 === "function") return _calcNetWorthR235(st) || 0;
    } catch (e) {}
    return 0;
  }

  // 防御辅助：取首个已结识且好感≥minAff 的 NPC id（域D铁律：只读 relationships + met 守卫）
  function firstMetNpcR246(st, minAff) {
    minAff = minAff || 0;
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) return id;
    }
    return null;
  }

  // 防御辅助：好感变更一律走 applyAffinityChange（自动 clamp+记 _lastInteractionDay）
  function bumpAffinityR246(st, npcId, delta, why) {
    try {
      if (typeof applyAffinityChange === "function") {
        applyAffinityChange(st, npcId, delta, why || "R246联动");
        return true;
      }
    } catch (e) {}
    return false;
  }

  function npcNameR246(npcId) {
    try {
      if (typeof getNpcDisplayName === "function") return getNpcDisplayName(npcId);
    } catch (e) {}
    return npcId;
  }

  var E_EVENTS_R246 = [
    // ===== 1. E→B：熊市众生相 ↔ 事件/叙事（复活 _getMarketTrendR235 死函数 + bear 死分支） =====
    {
      id: "e246_bear_market_faces",
      title: "熊市众生相",
      desc: "券商营业部门口，气氛比天气还冷。大爷把马扎一收：「不看了，眼不见心不烦。」穿西装的年轻人对着手机小声劝客户「别割在地板上」。你瞥了一眼大盘——满屏皆绿，七成个股在跌。市场先生今天心情很差，但你记得书上那句话：熊市是财富转移的季节，从没耐心的人手里，转到有耐心的人手里。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._e246BearFacesCooldownDay &&
            (st.player.day || 0) - st.flags._e246BearFacesCooldownDay < 45) return false; // [PLACEHOLDER] 冷却45天
        // 门控：本轮修复后 bear 分支首次可达（≥70%个股下跌）
        return marketTrendR246(st) === "bear";
      },
      choices: [
        {
          text: "在门口站了一会儿，把这一课记在心里",
          apply: function (st) {
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + 1); // [PLACEHOLDER]
            if (st.flags) {
              st.flags._e246BearFacesCooldownDay = (st.player && st.player.day) || 1;
              st.flags._bearMarketWitness = true; // 熊市见证 flag（后续叙事/投资域可消费）
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🐻 满屏皆绿的日子，你没慌。别人的恐惧，是你的学费也是你的机会。心智+4。", "info");
          },
        },
        {
          text: "翻出自选股清单，挑几只跌出价值的记下来",
          apply: function (st) {
            if (st.flags) {
              st.flags._e246BearFacesCooldownDay = (st.player && st.player.day) || 1;
              st.flags._dataInvestorMindset = true; // 复用既有投资意识 flag
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📋 你在小本子上记下几只跌到心动价的股票。熊市里做功课的人，牛市里才有底气。", "info");
          },
        },
      ],
      probability: 0.05, // [PLACEHOLDER]
    },

    // ===== 2. E→D：手头宽裕请街坊 ↔ NPC/社交（首个消费 _wealthSocialBonus 死flag，写入→消费闭环） =====
    {
      id: "e246_wealth_treat_neighbors",
      title: "「今天我来请」",
      desc: "路过巷口烧烤摊，熟人正好也在。老板笑着招呼：「哟，最近发财了啊，气色都不一样。」你摸了摸口袋——确实，手头宽裕之后，腰杆都直了几分。要不要大方一回，请大家撸几串？",
      phase: "street",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.player || !st.resources) return false;
        if (st.flags && st.flags._e246TreatCooldownDay &&
            (st.player.day || 0) - st.flags._e246TreatCooldownDay < 30) return false; // [PLACEHOLDER] 冷却30天
        // 门控：首个消费 R235 每日写入、全库原零消费者的 _wealthSocialBonus（≥3 = 现金≥3万扣除负债）
        if (!st.flags || (st.flags._wealthSocialBonus || 0) < 3) return false;
        if ((st.resources.cash || 0) < 500) return false;
        return !!firstMetNpcR246(st, 10);
      },
      choices: [
        {
          text: "大手一挥：「都别抢，今天我来」（花¥300）",
          apply: function (st) {
            var npcId = firstMetNpcR246(st, 10);
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300); // [PLACEHOLDER]
            var bonus = (st.flags && st.flags._wealthSocialBonus) || 0;
            if (npcId) bumpAffinityR246(st, npcId, 5 + Math.min(3, bonus), "宽裕请客"); // [PLACEHOLDER] 好感+5~8（财富社交加成放大）
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5); // [PLACEHOLDER]
            if (st.flags) st.flags._e246TreatCooldownDay = (st.player && st.player.day) || 1;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "🍢 你请" + (npcId ? npcNameR246(npcId) : "熟人") + "和街坊撸了顿串。钱花出去，人情攒下来——这买卖不亏。",
                "good",
              );
          },
        },
        {
          text: "笑着摆手：「下回下回，今天赶时间」",
          apply: function (st) {
            if (st.flags) st.flags._e246TreatCooldownDay = (st.player && st.player.day) || 1;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          },
        },
      ],
      probability: 0.05, // [PLACEHOLDER]
    },

    // ===== 3. E→H：身家底气 ↔ Phase2/公司（消费修复后首次含公司股市值的净资产） =====
    {
      id: "e246_networth_backbone",
      title: "身家给的底气",
      desc: "部门讨论新季度分工，几个烫手项目没人敢接。你在心里默默盘了盘自己的家底——现金、存款、持仓加起来，就算这份工作明天没了，也饿不着。奇妙的是，正因为「输得起」，你反而敢举手了。",
      phase: "corporate",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._e246BackboneSeen) return false; // 里程碑一次性
        // 在职守卫（career 动态字段可 undefined；corporate.company 顶层真实字段）
        var employed = (st.career && st.career.currentJob) || (st.corporate && st.corporate.company);
        if (!employed) return false;
        // 门控：修复后净资产（首次正确含公司股市值）≥ 5万 [PLACEHOLDER]
        return netWorthR246(st) >= 50000;
      },
      choices: [
        {
          text: "举手接下烫手项目：「我来试试」",
          apply: function (st) {
            if (st.flags) st.flags._e246BackboneSeen = true;
            if (typeof addSkillXp === "function") {
              try { addSkillXp("management", 10); } catch (e) {} // [PLACEHOLDER] 真实技能键
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
              if (st.player.corporate) st.player.corporate.upward = Math.min(100, (st.player.corporate.upward || 50) + 3); // [PLACEHOLDER] 真实惰性字段
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💼 财务上的安全垫，成了职场上的进攻性。你接下了没人敢碰的项目——赢了是履历，输了也赔得起。管理经验+10。", "good");
          },
        },
        {
          text: "按兵不动，继续观察",
          apply: function (st) {
            if (st.flags) st.flags._e246BackboneSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          },
        },
      ],
      probability: 0.06, // [PLACEHOLDER]
    },
  ];

  for (var i = 0; i < E_EVENTS_R246.length; i++) RANDOM_EVENTS.push(E_EVENTS_R246[i]);
})();

/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强事件
 * v3.106 · loop R14 全系统优化·Domain A 数值平衡→跨域桥接
 *
 * 设计约束（与 R11 economy / R12 lifecycle / R13 company 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 以覆盖两种人生阶段。
 *  - 里程碑类事件用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._dataLinkageLoaded) return;
  RANDOM_EVENTS._dataLinkageLoaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表
  function getMetNpcsA(st, minAff) {
    minAff = minAff || 0;
    var out = [];
    if (!st || !st.relationships) return out;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff)
        out.push({ id: id, rel: r });
    }
    return out;
  }

  // 取好感最高的已结识 NPC
  function pickClosestMetNpcA(st, minAff) {
    var met = getMetNpcsA(st, minAff || 0);
    if (!met.length) return null;
    met.sort(function (a, b) {
      return (b.rel.affinity || 0) - (a.rel.affinity || 0);
    });
    return met[0];
  }

  // 安全改好感：优先全局 applyAffinityChange（自动 clamp + 记 _lastInteractionDay），否则兜底直写
  function safeAffinityA(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域A联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 净资产快照（现金 + 银行存款 + 投资市值）
  function netWorthA(st) {
    if (!st || !st.resources) return 0;
    var nw = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
    if (typeof getInvestmentAssetSnapshot === "function") {
      try {
        var snap = getInvestmentAssetSnapshot(st);
        if (snap && snap.investmentValue) nw += snap.investmentValue;
      } catch (e) {
        /* 忽略 */
      }
    }
    return nw;
  }

  // ---- 域A 联动事件 ----

  var DATA_EVENTS = [
    // ===== A→D：数值平衡（身心状态均衡）↔ 社交好感 =====
    {
      id: "data_balanced_living",
      title: "状态仪表盘上的平衡感",
      desc: "你翻看自己的状态记录——健康、清洁、心情、心态都处在舒适的区间。这种稳稳的节奏，身边朋友也都感觉到了。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._dataBalancedLivingCooldown) return false;
        var health = (st.status && st.status.health) || 0;
        var hyg = (st.needs && st.needs.hygiene) || 0;
        var happy = (st.needs && st.needs.happiness) || 0;
        var mental = st.player.mental || 0;
        // 四项核心指标均达均衡线，才算"数值平衡"
        if (health < 60 || hyg < 60 || happy < 50 || mental < 50) return false;
        if (!getMetNpcsA(st, 10).length) return false;
        return true;
      },
      choices: [
        {
          text: "约上朋友，把这份安稳分享出去",
          apply: function (st) {
            var npc = pickClosestMetNpcA(st, 10);
            if (npc) safeAffinityA(st, npc.id, 5, "状态均衡的感染力");
            if (st.player) {
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 3,
              );
              st.player.mental = (st.player.mental || 50) + 2;
            }
            if (st.flags) st.flags._dataBalancedLivingCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "稳定的生活状态，让你在朋友圈里更让人安心。",
                "good",
              );
          },
        },
        {
          text: "自己享受这份踏实",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._dataBalancedLivingCooldown = true;
          },
        },
      ],
      probability: 0.05,
    },

    // ===== A→C：技能数据追踪 ↔ 职业成长（口碑/晋升势能） =====
    {
      id: "data_skill_efficiency",
      title: "你的技能曲线被看见了",
      desc: "一份长期技能记录显示，你在某项专长上的投入已经相当可观。一位前辈留意到了这条上扬的曲线。",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player || !st.skills) return false;
        if (st.flags && st.flags._dataSkillEfficiencyDone) return false;
        // 任意一项技能达到可量化的熟练门槛，代表被追踪到的"效率"
        var top = 0;
        for (var k in st.skills) {
          if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
          var lv = (st.skills[k] && st.skills[k].level) || 0;
          if (lv > top) top = lv;
        }
        if (top < 30) return false; // [PLACEHOLDER] 技能熟练门槛
        return true;
      },
      choices: [
        {
          text: "把这份专长转化为职场口碑",
          apply: function (st) {
            if (st.player && st.player.corporate)
              st.player.corporate.upwardMgmt = Math.min(
                (st.player.corporate.upwardMgmt || 50) + 5,
                100,
              ); // [PLACEHOLDER] 职场声誉回馈
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.flags) st.flags._dataSkillEfficiencyDone = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "长期积累的专长，开始在你的职业口碑里兑现。",
                "good",
              );
          },
        },
        {
          text: "继续深耕，不急于变现",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._dataSkillEfficiencyDone = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== A→E：净资产里程碑 ↔ 经济/投资资本（公司阶段） =====
    {
      id: "data_savings_milestone",
      title: "资产数字越过一道坎",
      desc: "记账本上的净资产第一次稳稳越过了 [PLACEHOLDER] 关口。你意识到，除了埋头赚钱，也该让钱开始替你工作。",
      phase: "corporate",
      triggers: { minDay: 120 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._dataSavingsMilestoneDone) return false;
        if (netWorthA(st) < 200000) return false; // [PLACEHOLDER] 净资产里程碑
        return true;
      },
      choices: [
        {
          text: "划出一笔可投资资金，开始系统理财",
          apply: function (st) {
            // E域桥接：释放一笔可投资现金（银行户），并强化投资心态
            if (st.resources) {
              st.resources.bankBalance =
                (st.resources.bankBalance || 0) + 30000; // [PLACEHOLDER] 一次性可投资资金
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 4;
            if (st.flags) {
              st.flags._dataSavingsMilestoneDone = true;
              st.flags._dataInvestorMindset = true; // 供 E域事件后续消费
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "资产里程碑达成，你开始认真规划个人投资。",
                "good",
              );
          },
        },
        {
          text: "维持现状，继续滚雪球",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._dataSavingsMilestoneDone = true;
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < DATA_EVENTS.length; i++) {
    RANDOM_EVENTS.push(DATA_EVENTS[i]);
  }
})();

/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强事件 · 第二轮
 * v3.113 · loop R22 全系统优化·Domain A 数值平衡→跨域桥接（R14 之后补充新角度）
 *
 * 设计约束（与 R14 data_linkage_events.js 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 以覆盖两种人生阶段。
 *  - 里程碑类事件用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 *  - 本文件事件 id 统一前缀 data2_*，与 R14 的 data_* 不冲突。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._dataLinkageR22Loaded) return;
  RANDOM_EVENTS._dataLinkageR22Loaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表
  function getMetNpcsR22(st, minAff) {
    minAff = minAff || 0;
    var out = [];
    if (!st || !st.relationships) return out;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff)
        out.push({ id: id, rel: r });
    }
    return out;
  }

  // 取好感最高的已结识 NPC
  function pickClosestMetNpcR22(st, minAff) {
    var met = getMetNpcsR22(st, minAff || 0);
    if (!met.length) return null;
    met.sort(function (a, b) {
      return (b.rel.affinity || 0) - (a.rel.affinity || 0);
    });
    return met[0];
  }

  // 安全改好感：优先全局 applyAffinityChange（自动 clamp + 记 _lastInteractionDay），否则兜底直写
  function safeAffinityR22(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域A联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 取等级最高的技能 key（用于 A→C 复盘加成落到真实技能上）
  function topSkillKeyR22(st) {
    if (!st || !st.skills) return null;
    var best = null,
      bestLv = 0;
    for (var k in st.skills) {
      if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
      var lv = (st.skills[k] && st.skills[k].level) || 0;
      if (lv > bestLv) {
        bestLv = lv;
        best = k;
      }
    }
    return best;
  }

  // ============ 事件定义 ============

  // ===== A→D：现金缓冲纪律 ↔ 社交底气（轻量聚会） =====
  RANDOM_EVENTS.push({
    id: "data2_lean_budget",
    title: "账面上的余裕，让你敢约人",
    desc: "连续几周，你的现金与存款都留出了安全垫。这种'算得清'的踏实，让你第一次愿意主动张罗一场小聚。",
    phase: "street",
    triggers: { minDay: 60 },
    conditions: function (st) {
      if (!st || !st.resources) return false;
      if (st.flags && st.flags._data2LeanBudgetDone) return false;
      // [PLACEHOLDER] 现金/存款安全垫阈值
      if ((st.resources.cash || 0) < 1000) return false;
      if ((st.resources.bankBalance || 0) < 3000) return false;
      if (!getMetNpcsR22(st, 10).length) return false;
      return true;
    },
    choices: [
      {
        text: "张罗一场小聚，把余裕分享出去",
        apply: function (st) {
          var npc = pickClosestMetNpcR22(st, 10);
          if (npc) safeAffinityR22(st, npc.id, 5, "账面余裕带来的底气");
          if (st.player) st.player.mental = (st.player.mental || 50) + 2;
          if (st.flags) st.flags._data2LeanBudgetDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "算得清的账目，让你在朋友面前更从容。",
              "good",
            );
        },
      },
      {
        text: "自己享受这份踏实",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 2;
          if (st.flags) st.flags._data2LeanBudgetDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== A→C：技能账本复盘 ↔ 职业精进（落到真实技能） =====
  RANDOM_EVENTS.push({
    id: "data2_skill_ledger",
    title: "你的技能账本露出规律",
    desc: "一份持续记录的技能账本显示，你在某一项上的投入已经形成清晰曲线。你决定把这种'复盘习惯'固化下来。",
    phase: "street",
    triggers: { minDay: 30 },
    conditions: function (st) {
      if (!st || !st.player || !st.skills) return false;
      if (st.flags && st.flags._data2SkillLedgerDone) return false;
      // [PLACEHOLDER] 触发所需的技能熟练门槛
      var top = 0;
      for (var k in st.skills) {
        if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
        var lv = (st.skills[k] && st.skills[k].level) || 0;
        if (lv > top) top = lv;
      }
      if (top < 20) return false;
      return true;
    },
    choices: [
      {
        text: "把复盘变成习惯，精进最拿手的那项",
        apply: function (st) {
          var key = topSkillKeyR22(st);
          if (key && typeof addSkillXp === "function") {
            addSkillXp(key, 6); // [PLACEHOLDER] 复盘加成
          }
          if (st.player) st.player.mental = (st.player.mental || 50) + 4;
          if (st.flags) st.flags._data2SkillLedgerDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "持续的数据复盘，让专长增长更有方向感。",
              "good",
            );
        },
      },
      {
        text: "只是看了看，没多想",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._data2SkillLedgerDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== A→E：资本储备纪律 ↔ 投资本金（职场阶段） =====
  RANDOM_EVENTS.push({
    id: "data2_capital_reserve",
    title: "一次干脆的财务复盘",
    desc: "在职场打拼之余，你给自己做了一次彻底的账务复盘：现金、存款、负债一目了然。你腾出了一笔可以长期不动的本金。",
    phase: "corporate",
    triggers: { minDay: 120 },
    conditions: function (st) {
      if (!st || !st.player || st.player.phase !== "corporate") return false;
      if (!st.resources) return false;
      if (st.flags && st.flags._data2CapitalReserveDone) return false;
      // [PLACEHOLDER] 触发所需的存款/现金储备阈值
      if ((st.resources.bankBalance || 0) < 5000) return false;
      if ((st.resources.cash || 0) < 2000) return false;
      return true;
    },
    choices: [
      {
        text: "把腾出的本金划入长期投资账户",
        apply: function (st) {
          if (st.resources)
            st.resources.bankBalance = (st.resources.bankBalance || 0) + 1500; // [PLACEHOLDER] 腾出本金
          if (st.flags) st.flags._dataInvestorMindset = true; // 复用跨轮投资者心态标记
          if (st.player) st.player.mental = (st.player.mental || 50) + 3;
          if (st.flags) st.flags._data2CapitalReserveDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "纪律性的财务复盘，让你有了第一笔长期本金。",
              "good",
            );
        },
      },
      {
        text: "维持现状，先不挪动",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 2;
          if (st.flags) st.flags._data2CapitalReserveDone = true;
        },
      },
    ],
    probability: 0.05,
  });
})();

/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强事件 · 第三轮
 * v3.120 · loop 全系统优化·Domain A 数值平衡→核心机制叙事化
 *          （R14 data_linkage_events.js / R22 data_linkage_events_r22.js 之后，
 *           补充「隐形经济平衡数据」的叙事化——此前 A 域联动只覆盖净资产的"量"，
 *           从未触及 economy_v3.1.js 真正计算的两套隐形机制：累进财富税梯度 / 市场饱和度惩罚）
 *
 * 设计约束（与 R14 / R22 一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS；所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 事件引擎严格按 e.phase 过滤（仅 "street"/"corporate"），本文件 2 个事件均 corporate。
 *  - 里程碑类事件用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截）。
 *  - EconomySystem（economy_v3.1.js）在 index.html 中于本文件之后加载，
 *    故所有 EconomySystem 访问均在事件函数体内惰性进行，并以 typeof 守卫，运行时必已就绪。
 *  - 本文件事件 id 统一前缀 data3_*，与 R14 data_* / R22 data2_* 不冲突。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._dataLinkageR23Loaded) return;
  RANDOM_EVENTS._dataLinkageR23Loaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 净资产快照（现金 + 银行存款 + 投资市值）
  function netWorthR23(st) {
    if (!st || !st.resources) return 0;
    var nw = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
    if (typeof getInvestmentAssetSnapshot === "function") {
      try {
        var snap = getInvestmentAssetSnapshot(st);
        if (snap && snap.investmentValue) nw += snap.investmentValue;
      } catch (e) {
        /* 忽略 */
      }
    }
    return nw;
  }

  // 当前活跃财富税档（惰性 + 守卫）
  function activeTaxTierR23(st) {
    if (typeof EconomySystem === "undefined" || !EconomySystem) return null;
    try {
      return EconomySystem.getActiveTaxTier(netWorthR23(st));
    } catch (e) {
      return null;
    }
  }

  // 市场饱和度惩罚系数（< 1.0 表示惩罚已生效）；惰性 + 守卫
  function satPenaltyR23(st) {
    if (typeof EconomySystem === "undefined" || !EconomySystem) return 1.0;
    try {
      var diff = (st && st._difficulty) || "normal";
      return EconomySystem.getMarketSaturationPenalty(
        netWorthR23(st),
        10000000,
        diff,
      );
    } catch (e) {
      return 1.0;
    }
  }

  // ============ 事件定义 ============

  // ===== A→G：累进财富税梯度 ↔ 核心机制叙事化（首次进入中产税档） =====
  // 设计意图：economy_v3.1.js 的 WEALTH_TAX_THRESHOLDS 是隐形数据，玩家从不知"为什么扣税、扣多少"。
  //   本事件在玩家首次踏入可感知的税档时，把"累进税制"这一核心机制包装成可理解的叙事。
  RANDOM_EVENTS.push({
    id: "data3_wealth_tax_intro",
    title: "账本上多了一笔「税」",
    desc: "你注意到每日结算里开始稳定扣一笔财富税——资产越多，边际税率越高。这背后是一套累进税制：入门税、中产税、精英税、富豪税逐级递增，越往上每一块钱都被征走更多。",
    phase: "corporate",
    triggers: { minDay: 150 },
    conditions: function (st) {
      if (!st || !st.player || st.player.phase !== "corporate") return false;
      if (st.flags && st.flags._data3WealthTaxIntroDone) return false;
      var tier = activeTaxTierR23(st);
      // 进入中产税及以上档（净资产 ≥ ¥50万），且税已可感知
      if (!tier || tier.min < 500000) return false; // [PLACEHOLDER] 触发档位门槛
      return true;
    },
    choices: [
      {
        text: "研究税制，把溢价部分做合理规划",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 4;
          if (st.flags) {
            st.flags._data3WealthTaxIntroDone = true;
            st.flags._dataTaxAware = true; // 供后续经济事件消费（税务规划心智）
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "你开始把累进税当成资产配置的一部分，而非单纯的损失。",
              "good",
            );
        },
      },
      {
        text: "肉疼，但认了",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._data3WealthTaxIntroDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== A→E：市场饱和度惩罚 ↔ 交易/投资经济（玩家体量开始影响市价） =====
  // 设计意图：economy_v3.1.js 的 getMarketSaturationPenalty 是隐形数据，玩家倒卖利润变薄却不知原因。
  //   本事件在饱和度惩罚首次生效时，把"你的体量在搅动市场"这一机制叙事化，并桥接 E 域投资心智。
  RANDOM_EVENTS.push({
    id: "data3_market_saturation",
    title: "你的买卖开始「搅动」市场",
    desc: "你发现同一笔倒卖生意的利润在悄悄变薄——当你的体量占到城市财富相当比例，买卖本身就会压低价、推高成本。这是市场饱和度的隐形之手，再大的盘子也逃不开边际递减。",
    phase: "corporate",
    triggers: { minDay: 200 },
    conditions: function (st) {
      if (!st || !st.player || st.player.phase !== "corporate") return false;
      if (st.flags && st.flags._data3MarketSaturationDone) return false;
      // 饱和度惩罚生效（玩家/城市财富比超过阈值 → 返回值 < 1.0）
      if (satPenaltyR23(st) >= 1.0) return false; // [PLACEHOLDER] 阈值由 EconomySystem 决定
      return true;
    },
    choices: [
      {
        text: "分散投资，绕开单一市场饱和",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 3;
          if (st.flags) {
            st.flags._data3MarketSaturationDone = true;
            st.flags._dataDiversifyMindset = true; // 供 E域投资事件消费（分散心智）
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "体量变大后，你学会了用分散来对抗市场饱和。",
              "good",
            );
        },
      },
      {
        text: "继续加码，赌规模效应",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._data3MarketSaturationDone = true;
        },
      },
    ],
    probability: 0.04,
  });

  // ===== B→A：供需失衡事件 — 事件系统反馈到市场数据 =====
  // 设计意图：当玩家在某地大量买入/卖出导致供需失衡时，触发叙事事件解释价格变动
  // 联动: data_linkage_events.js + pricing.js (supplyDemand)
  RANDOM_EVENTS.push({
    id: "data_supply_demand_tip",
    title: "市场的「看不见的手」",
    desc: "你频繁的买卖让商贩们开始警觉——他们悄悄调整了价格。这就是供需法则：买的人多了就涨，卖的人多了就跌。",
    phase: "street",
    triggers: { minDay: 15 },
    conditions: function (st) {
      if (!st || !st.trade || !st.trade.supplyDemand) return false;
      if (st.flags && st.flags._dataSupplyDemandTipDone) return false;
      // 检查是否有任何地点存在极端供需（|supplyDemand| >= 15）
      var sd = st.trade.supplyDemand;
      for (var locKey in sd) {
        if (!Object.prototype.hasOwnProperty.call(sd, locKey)) continue;
        var loc = sd[locKey];
        for (var goodId in loc) {
          if (!Object.prototype.hasOwnProperty.call(loc, goodId)) continue;
          if (Math.abs(loc[goodId]) >= 15) return true;
        }
      }
      return false;
    },
    choices: [
      {
        text: "留意供需变化，调整策略",
        hint: "心智+2·理解市场规律",
        apply: function (st) {
          if (st.flags) st.flags._dataSupplyDemandTipDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("📊 你开始理解供需法则——价格不是凭空变动的。", "good");
        },
      },
      {
        text: "继续按自己的节奏做买卖",
        hint: "习以为常",
        apply: function (st) {
          if (st.flags) st.flags._dataSupplyDemandTipDone = true;
        },
      },
    ],
    probability: 0.05,
  });
})();

/*
 * 城市浮生记 — 域E（经济/投资）联动增强事件 · R260
 * loop R260 全系统优化·Domain E 经济/投资 → 跨域桥接（E→G / E→C / E→D）
 *
 * 背景：域E 历轮已覆盖 E→A(R18/R201)/E→B(R246)/E→C(R18/R195)/E→D(R18/R246)/
 *   E→F(R195)/E→G(R195/R201)/E→H(R201/R246)。本轮聚焦「复活既有死flag / 首个叙事消费
 *   已维护但从未被叙事消费的真实计数器」，形成写入→消费闭环：
 *  1. E→G invest_r260_bull_return（street）：牛市归来 —— **首个消费 R246 写入、全库零消费者的
 *     死flag st.flags._bearMarketWitness**（R246 熊市众生相事件写入后至今无任何读取点）。
 *     叙事：曾在熊市站住脚的人，见到市场回暖时的对照与定力成长。
 *  2. E→C invest_r260_streak_review（corporate）：连胜复盘 —— **首个叙事消费 inv._consecutiveWins**
 *     （investment.js:1782/1927 真实累计、economy_v3.1.js:184 用于收益衰减，但从无事件叙事消费）。
 *     叙事：连续盈利后的过度自信警醒（认知偏差：禀赋效应/近因效应）+ 复盘习惯 → 会计技能。
 *  3. E→D invest_r260_market_wisdom（street）：把盘感讲给熟人听 —— 见证过熊市/有投资意识的你，
 *     把「别追高、别割肉」的教训分享给已结识的街坊 → applyAffinityChange。
 *     严守域D铁律：只读 state.relationships / rel&&rel.met / applyAffinityChange。
 * id 前缀 e260_ 与 e246_/e235_/econ_r201_/invest_r195_ 既有前缀均不冲突。
 *
 * 设计约束（与历轮各域 linkage 一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS（非 ES import）；须在 domain_e_linkage_r235.js/r246.js 之后加载。
 *  - 所有 state 访问均 || / typeof 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 引擎严格按 e.phase 过滤（events_core.js:379），故显式设 phase（2 street + 1 corporate）。
 *  - 里程碑/去重用 st.flags._xxx（conditions 与 apply 双重拦截）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR260Loaded) return;
  RANDOM_EVENTS._domainELinkageR260Loaded = true;

  // 防御辅助：市场趋势（消费 R246 修复+导出的 _getMarketTrendR235：bull/bear/stable）
  function marketTrendR260(st) {
    try {
      if (typeof _getMarketTrendR235 === "function") return _getMarketTrendR235(st);
    } catch (e) {}
    return "stable";
  }

  // 防御辅助：连续盈利次数（investment.js 维护的真实计数器）
  function consecutiveWinsR260(st) {
    if (!st || !st.investment) return 0;
    var w = st.investment._consecutiveWins;
    return typeof w === "number" && isFinite(w) ? w : 0;
  }

  // 防御辅助：取首个已结识且好感≥minAff 的 NPC id（域D铁律：只读 relationships + met 守卫）
  function firstMetNpcR260(st, minAff) {
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
  function bumpAffinityR260(st, npcId, delta, why) {
    try {
      if (typeof applyAffinityChange === "function") {
        applyAffinityChange(st, npcId, delta, why || "R260联动");
        return true;
      }
    } catch (e) {}
    return false;
  }

  function npcNameR260(npcId) {
    try {
      if (typeof getNpcDisplayName === "function") return getNpcDisplayName(npcId);
    } catch (e) {}
    return npcId;
  }

  var E_EVENTS_R260 = [
    // ===== 1. E→G：牛市归来（首个消费 R246 死flag _bearMarketWitness，写入→消费闭环） =====
    {
      id: "e260_bull_return",
      title: "牛市又回来了",
      desc: "地铁口卖煎饼的大姐都在聊股票了，营业部里久违地排起了队。你想起前阵子满屏皆绿的日子——那会儿人人都说「这辈子再不碰股票」，如今又都挤了回来。市场就是这样一茬一茬地循环。你摸了摸口袋里那张熊市里记下的清单，心里比谁都清楚：热闹的时候，才是最该冷静的时候。",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        // 门控：曾在熊市站住脚（R246 写入的死flag，本事件为首个消费者）
        if (!st.flags._bearMarketWitness) return false;
        if (st.flags._e260BullReturnSeen) return false; // 一次性对照叙事
        // 市场须已回暖（不再是 bear）——熊转牛/稳的对照才成立
        return marketTrendR260(st) !== "bear";
      },
      choices: [
        {
          text: "淡定翻出清单，只按计划操作，不追热点",
          apply: function (st) {
            if (st.flags) {
              st.flags._e260BullReturnSeen = true;
              st.flags._marketCycleVeteran = true; // 穿越牛熊 flag（后续叙事/投资域可消费）
              st.flags._dataInvestorMindset = true; // 复用既有投资意识 flag
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5); // [PLACEHOLDER]
              st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + 2); // [PLACEHOLDER]
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🐂 从熊到牛，你完整地走过了一轮。别人在追涨，你在看清单——穿越牛熊的人，才配谈定力。心智+5。", "good");
          },
        },
        {
          text: "有点心痒，也想趁热闹加点仓",
          apply: function (st) {
            if (st.flags) st.flags._e260BullReturnSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📈 热闹总是诱人的。你也动了心——愿这一次，你还记得熊市教过你的事。", "info");
          },
        },
      ],
      probability: 0.05, // [PLACEHOLDER]
    },

    // ===== 2. E→C：连胜复盘（首个叙事消费 inv._consecutiveWins 真实计数器） =====
    {
      id: "e260_streak_review",
      title: "连胜之后",
      desc: "最近几笔操作出奇地顺，卖一笔赚一笔。同事都笑你「股神附体」，你自己也开始飘飘然，甚至想加大仓位、上点杠杆。夜里对账时，你盯着那串连胜记录忽然警惕起来——上一个觉得自己战无不胜的人，后来怎么样了？连胜最危险的地方，恰恰是它让你忘了风险。",
      phase: "corporate",
      triggers: { minDay: 120 },
      conditions: function (st) {
        if (!st || !st.player || !st.investment) return false;
        if (st.flags && st.flags._e260StreakCooldownDay &&
            (st.player.day || 0) - st.flags._e260StreakCooldownDay < 60) return false; // [PLACEHOLDER] 冷却60天
        // 门控：连续盈利≥3 次（首个叙事消费该真实计数器）
        return consecutiveWinsR260(st) >= 3; // [PLACEHOLDER]
      },
      choices: [
        {
          text: "认真做一次复盘，把连胜归因写清楚（运气 or 能力）",
          apply: function (st) {
            if (typeof addSkillXp === "function") {
              try { addSkillXp("accounting", 8); } catch (e) {} // [PLACEHOLDER] 真实技能键
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
            if (st.flags) {
              st.flags._e260StreakCooldownDay = (st.player && st.player.day) || 1;
              st.flags._investReviewHabit = true; // 复盘习惯 flag
              st.flags._dataInvestorMindset = true;
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📒 你把每一笔连胜拆开来看，分清哪些是运气、哪些是能力。会计经验+8。清醒，是连胜里最贵的东西。", "good");
          },
        },
        {
          text: "乘胜追击，加大下一笔的仓位",
          apply: function (st) {
            if (st.flags) st.flags._e260StreakCooldownDay = (st.player && st.player.day) || 1;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🎲 你决定乘胜追击。连胜的快感让人上头——但市场从不保证下一把还赢。", "info");
          },
        },
      ],
      probability: 0.05, // [PLACEHOLDER]
    },

    // ===== 3. E→D：把盘感讲给熟人听（投资经验 → 社交好感，严守域D铁律） =====
    {
      id: "e260_market_wisdom",
      title: "巷口的「投资课」",
      desc: "街坊听说你在股市里摸爬滚打过，凑过来讨教：「你说这行情，我那点养老钱能不能放进去？」你没急着给答案，而是把自己踩过的坑一样样说给他听——别追高、别满仓、别借钱炒股。他听得直点头：「还是你懂行，实在。」",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        // 门控：有投资阅历（见证过熊市 或 已建立投资意识）
        if (!st.flags._bearMarketWitness && !st.flags._dataInvestorMindset && !st.flags._marketCycleVeteran) return false;
        if (st.flags._e260WisdomCooldownDay &&
            (st.player.day || 0) - st.flags._e260WisdomCooldownDay < 40) return false; // [PLACEHOLDER] 冷却40天
        return !!firstMetNpcR260(st, 5);
      },
      choices: [
        {
          text: "掏心窝子讲教训，不劝他买也不劝他卖",
          apply: function (st) {
            var npcId = firstMetNpcR260(st, 5);
            if (npcId) bumpAffinityR260(st, npcId, 6, "分享投资阅历"); // [PLACEHOLDER] 好感+6
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
            if (st.flags) st.flags._e260WisdomCooldownDay = (st.player && st.player.day) || 1;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "🤝 你把血泪教训讲给" + (npcId ? npcNameR260(npcId) : "街坊") + "听。真诚比荐股更值钱——他记住了你这个人。",
                "good",
              );
          },
        },
        {
          text: "含糊几句：「我也就瞎玩，别听我的」",
          apply: function (st) {
            if (st.flags) st.flags._e260WisdomCooldownDay = (st.player && st.player.day) || 1;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          },
        },
      ],
      probability: 0.05, // [PLACEHOLDER]
    },
  ];

  for (var i = 0; i < E_EVENTS_R260.length; i++) RANDOM_EVENTS.push(E_EVENTS_R260[i]);
})();

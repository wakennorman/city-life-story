/**
 * 域A(数据/数值平衡) 联动增强 R903b — 数值里程碑的跨域回响
 * 背景（A类审计）：本轮回 domain_a_linkage_events_r903b 配套的 A类修复聚焦「数据/数值承诺静默失效」，
 *   另发现 phase2/investment.js 动态写入的 _portfolioMilestone_<value> 三档(10000/50000/500000)
 *   自 R738b 消费 100000/1000000 后，余下三档全库零读取——纯写-only 死 flag。
 *   本文件以「域A·数据素养视角」对其做首消费(A→E)，将冰冷的里程碑数字转译为玩家的方法沉淀与财富坐标。
 * 联动（峰终定律+禀赋效应+损失厌恶）：
 *   A→E  a903b_portfolio_first_seed     ¥1万首破——数据觉醒，复盘 vs 庆祝
 *   A→E  a903b_portfolio_steady_growth  ¥5万站上——复利直觉，再加仓 vs 落袋为安
 *   A→E  a903b_portfolio_half_million   ¥50万冲破——财富坐标，长期配置 vs 安全垫
 * 防御：done-flag防重 / ||守卫 / isFinite / 显式phase:"street" / addSkillXp四参真实键 / 真实字段(state.resources.bankBalance/player.intelligence/player.mental/needs.happiness)
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR903bLoaded) return;
  RANDOM_EVENTS._domainALinkageR903bLoaded = true;

  function _gx(k, a) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(k, a); } catch (e) {}
    }
  }
  function _msg(txt, kind) {
    if (typeof StateManager !== "undefined") StateManager.addMessage(txt, kind || "info");
  }
  function _bank(st, amt) {
    if (!st || !st.resources) return;
    st.resources.bankBalance = Math.max(0, (st.resources.bankBalance || 0) + amt);
  }
  function _intel(st, n) {
    if (st && st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + n);
  }
  function _mental(st, n) {
    if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 0) + n);
  }
  function _happy(st, n) {
    if (st && st.needs && typeof st.needs.happiness === "number")
      st.needs.happiness = Math.min(100, st.needs.happiness + n);
  }

  var EVENTS = [
    // ===== 联动1: A→E ¥1万首破 — 数据素养觉醒 =====
    {
      id: "a903b_portfolio_first_seed",
      phase: "street",
      icon: "🌱",
      title: "第一桶金的复盘",
      story: "投资组合第一次站上 ¥10,000。你盯着那串数字，忽然想起当初连K线都看不懂的自己——原来从手忙脚乱到心中有数，中间隔的只是几十次「看数据、做决定、看结果」的循环。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a903bSeedDone) return false;
        return !!(st.flags && st.flags._portfolioMilestone_10000);
      },
      probability: 0.45,
      repeatable: false,
      choices: [
        {
          text: "📊 复盘总结，沉淀方法",
          hint: "智力+2，管理XP+5（数据方法论内化）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a903bSeedDone = true;
            _intel(st, 2);
            _gx("management", 5);
            _msg("📊 你把第一桶金的得失记进备忘录。往后每次买卖前，都会先翻一眼自己的复盘（智力+2，管理XP+5）。", "success");
          },
        },
        {
          text: "🎉 小小庆祝一下",
          hint: "幸福+4（里程碑的峰终愉悦）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a903bSeedDone = true;
            _happy(st, 4);
            _msg("🎉 你请自己吃了顿好的。数字会说话，但人得先替自己高兴一下（幸福+4）。", "info");
          },
        },
      ],
    },

    // ===== 联动2: A→E ¥5万站上 — 复利直觉 =====
    {
      id: "a903b_portfolio_steady_growth",
      phase: "street",
      icon: "📈",
      title: "五万块的复利直觉",
      story: "组合悄无声息地爬过 ¥50,000。你发现自己开始有了点「盘感」——什么时候该忍，什么时候该动，账户里的曲线比任何建议都诚实。数据，终于成了你的第二直觉。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a903bGrowthDone) return false;
        return !!(st.flags && st.flags._portfolioMilestone_50000);
      },
      probability: 0.4,
      repeatable: false,
      choices: [
        {
          text: "🔁 复盘加仓逻辑",
          hint: "会计XP+8，智力+1（财务敏锐度）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a903bGrowthDone = true;
            _gx("accounting", 8);
            _intel(st, 1);
            _msg("🔁 你把加仓的纪律写成一条铁律：不追高、不恐慌。账本记得更细了（会计XP+8，智力+1）。", "success");
          },
        },
        {
          text: "🏦 锁定部分收益，转存款",
          hint: "存款+¥3000（落袋为安·损失厌恶缓冲）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a903bGrowthDone = true;
            _bank(st, 3000);
            _msg("🏦 你取出 ¥3,000 存进定期。赚到的钱，先有一部分踏踏实实落袋，睡觉才安稳。", "info");
          },
        },
      ],
    },

    // ===== 联动3: A→E ¥50万冲破 — 财富坐标 =====
    {
      id: "a903b_portfolio_half_million",
      phase: "street",
      icon: "💎",
      title: "五十万的财富坐标",
      story: "组合冲破 ¥500,000。你不再是那个为月底房租反复盘算的人了——可数字越大，反而越怕一步走错。数据冷静地提醒你：这个阶段，守住比猛冲更重要。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._a903bHalfDone) return false;
        return !!(st.flags && st.flags._portfolioMilestone_500000);
      },
      probability: 0.35,
      repeatable: false,
      choices: [
        {
          text: "🧭 用数据做长期配置",
          hint: "管理XP+10，心智+3（战略定力）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a903bHalfDone = true;
            _gx("management", 10);
            _mental(st, 3);
            _msg("🧭 你按风险和期限重排了整个组合，把冲动换成了结构。手里的牌没变，但出牌的节奏稳了（管理XP+10，心智+3）。", "success");
          },
        },
        {
          text: "🛡️ 留出安全垫",
          hint: "存款+¥8000，幸福+3（禀赋效应·守住已有）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a903bHalfDone = true;
            _bank(st, 8000);
            _happy(st, 3);
            _msg("🛡️ 你拨出 ¥8,000 做应急金，告诉自己「这钱不到绝境不动」。手里有底，心里不慌（存款+¥8000，幸福+3）。", "info");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) RANDOM_EVENTS.push(EVENTS[i]);
})();

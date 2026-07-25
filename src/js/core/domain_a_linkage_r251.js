/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强事件 · R251
 * loop R251 全系统优化·Domain A 数据/数值平衡 → 跨域桥接（A→D / A→E / A→H）
 *
 * 背景：域A 已在 R14/R22/R189/R197/R242 覆盖 A→B/A→C/A→F/A→G/A→H。
 * 本轮 A类审计结论：A类=0（新缺陷）——illnesses/illness/jobs/economy_v3.1/
 * skill_synergy/items/finance/needs/goods 各子系统经历轮加固（R14/R22/R197/R242）
 * 后已自洽：死字段 grep 干净、8 个 _synergy_ 与 6 个 referral flag 均有写入者、
 * 商品定价与描述一致（无 >3 倍错配）。故本轮聚焦联动增强。
 *
 * 三事件均使用「真实字段 + 真实机制」做跨域桥接，且补齐历轮域A 未做的方向：
 *  - A→D（NPC/社交·全新配对）：技能助邻 —— 用真实生活技能（维修/厨艺/医护）
 *      帮已结识的街坊，好感变更严守域D铁律走 applyAffinityChange。
 *  - A→E（经济/投资·全新配对）：物价通胀嗅觉 —— 读真实 _eraState.inflationIndex，
 *      从菜价数据里养出避险意识，置 _dataInvestorMindset（E域事件消费）。
 *  - A→H（Phase2/公司）：年终数据复盘 —— 用真实 accounting/management 技能做
 *      经营复盘，换来 management XP + 绩效。（角度区别于 R197 争预算 / R242 证书背书）
 * id 前缀 a251_ 与 a189_/a197_/a242_/data_ 既有前缀均不冲突。
 *
 * 设计约束（与历轮各域 linkage 一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS（非 ES import），避免改主库既有事件文件。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），故显式设 phase（2 street + 1 corporate）。
 *  - 里程碑/去重用 st.flags._xxxCooldown（conditions 与 apply 双重拦截）。
 *  - 域D铁律：只读 state.relationships / rel&&rel.met / applyAffinityChange / getNpcDisplayName。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR251Loaded) return;
  RANDOM_EVENTS._domainALinkageR251Loaded = true;

  var PRACTICAL_SKILLS_R251 = ["repair", "cooking", "medicine"];
  var SKILL_CN_R251 = {
    repair: "维修",
    cooking: "厨艺",
    medicine: "医护",
    accounting: "会计",
    management: "管理",
  };

  // 防御辅助：取玩家最高的一项实用生活技能（level>=minLv 才算数），无则 null
  function topPracticalSkillR251(st, minLv) {
    minLv = minLv || 0;
    if (!st || !st.skills) return null;
    var bestKey = null;
    var bestLv = -1;
    for (var i = 0; i < PRACTICAL_SKILLS_R251.length; i++) {
      var k = PRACTICAL_SKILLS_R251[i];
      var s = st.skills[k];
      var lv = (s && s.level) || 0;
      if (lv >= minLv && lv > bestLv) {
        bestLv = lv;
        bestKey = k;
      }
    }
    return bestKey ? { key: bestKey, level: bestLv } : null;
  }

  // 防御辅助：取首个已结识且好感>=minAff 的 NPC id（域D铁律：只读 relationships + met 守卫）
  function firstMetNpcR251(st, minAff) {
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
  function bumpAffinityR251(st, npcId, delta, why) {
    try {
      if (typeof applyAffinityChange === "function") {
        applyAffinityChange(st, npcId, delta, why || "R251联动");
        return true;
      }
    } catch (e) {}
    return false;
  }

  function npcNameR251(npcId) {
    try {
      if (typeof getNpcDisplayName === "function")
        return getNpcDisplayName(npcId);
    } catch (e) {}
    return npcId || "街坊";
  }

  var A_EVENTS_R251 = [
    // ===== 1. A→D：技能助邻 ↔ NPC/社交（历轮域A 全新配对；真实技能 + 域D铁律好感变更） =====
    {
      id: "a251_skill_neighbor_help",
      title: "顺手帮个忙",
      desc: "楼道里碰见街坊正对着坏掉的东西发愁。你搭眼一看，心里有数——这点活儿难不倒你。举手之劳的事，帮衬一把，邻里间的情分就是这么一点点攒起来的。",
      phase: "street",
      triggers: { minDay: 35 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._a251SkillHelpCooldown) return false;
        // 门控：持有一项实用技能(level>=5) + 有已结识街坊(好感>=10)
        if (!topPracticalSkillR251(st, 5)) return false;
        return !!firstMetNpcR251(st, 10);
      },
      choices: [
        {
          text: "搭把手，把活儿干利索",
          apply: function (st) {
            var sk = topPracticalSkillR251(st, 5);
            var npcId = firstMetNpcR251(st, 10);
            if (npcId) bumpAffinityR251(st, npcId, 6, "技能助邻"); // [PLACEHOLDER] 好感
            // A→C 顺带：帮忙也是练手，对应技能小幅长进（含证书加成乘区）
            if (sk && sk.key && typeof addSkillXp === "function")
              addSkillXp(sk.key, 5); // [PLACEHOLDER] 技能XP
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER] 心智
            if (st.needs)
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 0) + 3,
              ); // [PLACEHOLDER] 心情
            if (st.flags) {
              st.flags._a251SkillHelpCooldown = true;
              st.flags._skillNeighborBond = true; // 技能睦邻 flag（D域后续叙事可消费）
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "🔧 " +
                  (sk ? SKILL_CN_R251[sk.key] || "手艺" : "手艺") +
                  "派上用场，帮了" +
                  npcNameR251(npcId) +
                  "一把。",
                "good",
              );
          },
        },
        {
          text: "点头示意，忙自己的去了",
          apply: function (st) {
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            if (st.flags) st.flags._a251SkillHelpCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 2. A→E：物价通胀嗅觉 ↔ 经济/投资（历轮域A 全新配对；读真实 _eraState.inflationIndex） =====
    {
      id: "a251_price_inflation_sense",
      title: "菜篮子里的数字",
      desc: "又去了趟菜市场，同样一篮子东西，比上个月贵了一截。你没急着抱怨，反倒摸出手机记了几笔——这半年菜价、房租、油钱的涨幅，心里渐渐有了本账。钱搁着不动就是在缩水，这个道理，从菜价里也能咂摸出来。",
      phase: "street",
      triggers: { minDay: 50 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._a251InflationSenseCooldown) return false;
        // 门控：读真实 _eraState.inflationIndex（>=1.2 通胀有感），未消费过
        var era = st._eraState;
        if (!era || typeof era.inflationIndex !== "number") return false;
        return era.inflationIndex >= 1.2;
      },
      choices: [
        {
          text: "记账、比价，琢磨怎么让钱保值",
          apply: function (st) {
            if (st.flags) {
              st.flags._dataInvestorMindset = true; // A→E 桥接：投资/避险意识（E域事件消费）
              st.flags._a251InflationSenseCooldown = true;
            }
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER] 心智
            if (typeof addSkillXp === "function") addSkillXp("accounting", 4); // [PLACEHOLDER] 会计XP（记账练手）
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "📈 菜价里读出通胀，钱得想办法保值了。",
                "good",
              );
          },
        },
        {
          text: "贵就少买点，日子照过",
          apply: function (st) {
            if (st.needs)
              st.needs.happiness = Math.max(
                0,
                (st.needs.happiness || 0) - 1,
              ); // [PLACEHOLDER] 精打细算的小失落
            if (st.flags) st.flags._a251InflationSenseCooldown = true;
          },
        },
      ],
      probability: 0.045,
    },

    // ===== 3. A→H：年终数据复盘 ↔ Phase2/公司（真实 accounting/management 技能做经营复盘） =====
    {
      id: "a251_ledger_year_review",
      title: "年终复盘会",
      desc: "部门年终复盘，一屋子人对着报表你一言我一语。轮到你，你把这一年的数字掰开揉碎讲——哪条线在涨、哪块成本虚高、明年该往哪使劲，条理清楚。散会时主管拍了拍你：「就爱听这种拿数据说话的。」",
      phase: "corporate",
      triggers: { minDay: 70 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._a251LedgerReviewCooldown) return false;
        // 门控：在职（career.currentJob 或 corporate.company）+ 会计或管理技能 level>=8
        var employed =
          (st.career && st.career.currentJob) ||
          (st.corporate && st.corporate.company);
        if (!employed) return false;
        var acc = (st.skills && st.skills.accounting && st.skills.accounting.level) || 0;
        var mgt = (st.skills && st.skills.management && st.skills.management.level) || 0;
        return acc >= 8 || mgt >= 8;
      },
      choices: [
        {
          text: "拿数据说话，把复盘讲透",
          apply: function (st) {
            if (typeof addSkillXp === "function") addSkillXp("management", 7); // [PLACEHOLDER] 管理XP
            if (st.resources)
              st.resources.cash = (st.resources.cash || 0) + 800; // [PLACEHOLDER] 复盘绩效
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER] 心智
            if (st.flags) {
              st.flags._a251LedgerReviewCooldown = true;
              st.flags._dataReviewCredibility = true; // 数据复盘口碑 flag（H域后续可消费）
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "📊 一场拿数据说话的复盘，给你挣足了印象分。",
                "good",
              );
          },
        },
        {
          text: "照本宣科念一遍就行",
          apply: function (st) {
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            if (st.flags) st.flags._a251LedgerReviewCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < A_EVENTS_R251.length; i++) {
    RANDOM_EVENTS.push(A_EVENTS_R251[i]);
  }
})();

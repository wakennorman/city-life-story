/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强事件 · R197
 * loop R197 全系统优化·Domain A 数据/数值平衡 → 跨域桥接（A→G / A→F / A→H）
 *
 * 背景：域A 已在 R14/R22/R189 覆盖 A→D/A→C/A→E（data_linkage_events.js / data_linkage_events_r22.js / domain_a_linkage_r189.js）。
 * 本轮 A类修复接通了「证书 healthBonus/illnessRiskReduction/fatigueReduction/mentalBonus」死效果键，
 * 主题围绕「把身体/收支/预算的数值真正用起来」，补齐尚未覆盖的跨域视角：
 *  - A→G（健康数值基线 → 生命周期健康意识，呼应本轮证书健康效果修复）
 *  - A→F（收支数据 → 清晰账本看板的秩序感）
 *  - A→H（数据分析 → 职场用数值争取预算/资源）
 * id 前缀 a197_ 与 R14 data_ / R22 data2_ / R189 data_a_r189_ 既有前缀均不冲突。
 *
 * 设计约束（与历轮各域 linkage 一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS（非 ES import），避免改主库既有事件文件。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），故显式设 phase（2 street + 1 corporate）。
 *  - 里程碑/去重用 st.flags._xxxCooldown（conditions 与 apply 双重拦截）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR197Loaded) return;
  RANDOM_EVENTS._domainALinkageR197Loaded = true;

  var A_EVENTS_R197 = [
    // ===== A→G：给自己建一份健康档案 ↔ 核心机制/生命周期（健康数值基线，呼应本轮证书健康效果修复） =====
    {
      id: "a197_health_baseline",
      title: "给自己，建一份像样的健康档案",
      desc: "你翻出体检单、买药记录、连着几周的作息，头一回认真把身体的「数据」摆到桌面上。数字不会骗人——哪儿透支了，哪儿还扛得住，一目了然。你决定，往后按这本账过日子。",
      phase: "street",
      triggers: { minDay: 50 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._a197HealthBaselineCooldown) return false;
        return true;
      },
      choices: [
        {
          text: "定期复盘，按数据调整作息",
          apply: function (st) {
            // G域桥接：健康数值基线反哺核心生存属性（health 在 status，mental 在 player，均为真实字段）
            if (st.status)
              st.status.health = Math.min(
                100,
                (st.status.health || 0) + 5,
              ); // [PLACEHOLDER] 健康
            if (st.player)
              st.player.mental = (st.player.mental || 50) + 4; // [PLACEHOLDER] 心智
            if (st.flags) {
              st.flags._healthBaselineKeeper = true; // 健康自律记忆 flag（G域生命周期事件可消费）
              st.flags._a197HealthBaselineCooldown = true;
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "把身体当账本管，比硬扛管用。",
                "good",
              );
          },
        },
        {
          text: "记一次就扔一边",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._a197HealthBaselineCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== A→F：把一年的收支做成一张明白账 ↔ 界面/体验（数据可视化的秩序感） =====
    {
      id: "a197_ledger_clarity",
      title: "把一年的收支，做成一张明白账",
      desc: "你把零散的进项、开销、欠账，一笔笔归到一张表里。等它成型的那一刻，你忽然看懂了自己这一年——钱是怎么来的、又漏在了哪。混沌的日子，第一次有了清晰的形状。",
      phase: "street",
      triggers: { minDay: 45 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._a197LedgerClarityCooldown) return false;
        return true;
      },
      choices: [
        {
          text: "以后每月都对一次账",
          apply: function (st) {
            // F域桥接：数据清晰感反哺心智+心情（mental 在 player，happiness 在 needs，均为真实字段）
            if (st.player) st.player.mental = (st.player.mental || 50) + 5; // [PLACEHOLDER] 心智
            if (st.needs)
              st.needs.happiness = (st.needs.happiness || 50) + 4; // [PLACEHOLDER] 心情
            if (st.flags) {
              st.flags._budgetClarityKeeper = true; // 收支清晰记忆 flag（F/E 域可消费）
              st.flags._a197LedgerClarityCooldown = true;
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "看得清钱的去向，才攥得住日子。",
                "good",
              );
          },
        },
        {
          text: "对付着记记就行",
          apply: function (st) {
            if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 1;
            if (st.flags) st.flags._a197LedgerClarityCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== A→H：用数据说话，在职场拿下预算 ↔ 公司/创业（数值分析转化为经营技能+资源） =====
    {
      id: "a197_data_driven_budget",
      title: "用数据说话，把预算争回来",
      desc: "例会上众人各执一词，你没吵，只甩出一张表：成本、转化、投入产出比，条条清楚。会议室安静了几秒，主管点头：『按你这个来。』——你头一回体会到，数字比嗓门更有分量。",
      phase: "corporate",
      triggers: { minDay: 110 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._a197DataBudgetCooldown) return false;
        // 须处于公司/职场语境（真实字段）
        var inCorp =
          (st.career && st.career.currentJob) ||
          (st.corporate && st.corporate.company);
        if (!inCorp) return false;
        return true;
      },
      choices: [
        {
          text: "把这套数据分析法固化下来",
          apply: function (st) {
            // H域桥接：数值分析能力转化为真实经营/管理技能（management 为公司 KPI 真实技能键）
            if (typeof addSkillXp === "function") addSkillXp("management", 8); // [PLACEHOLDER] 管理/经营XP
            // 争取到的预算/绩效落袋（state.resources.cash 真实字段）
            if (st.resources)
              st.resources.cash = (st.resources.cash || 0) + 900; // [PLACEHOLDER] 绩效奖金
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.flags) st.flags._a197DataBudgetCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "会用数据的人，永远手里有底牌。",
                "good",
              );
          },
        },
        {
          text: "这次赢了就够了",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._a197DataBudgetCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < A_EVENTS_R197.length; i++) {
    RANDOM_EVENTS.push(A_EVENTS_R197[i]);
  }
})();

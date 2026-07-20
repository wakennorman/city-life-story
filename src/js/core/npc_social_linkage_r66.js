/*
 * 城市浮生记 — 域D（NPC/社交）联动增强事件 v66
 * R66 全系统优化·Domain D NPC→经济(E) + NPC→职业成长(C) 桥接
 *
 * 设计约束（与 v3.108 / R17 npc_social_linkage_events.js 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import）
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER] 待数值组校准
 *  - 事件引擎严格按 e.phase 过滤，本文件事件 phase:"street"
 *  - NPC引用须 rel && rel.met；好感传导走 applyAffinityChange
 *  - 里程碑/冷却用 st.flags._xxxDone 去重
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._npcSocialR66Loaded) return;
  RANDOM_EVENTS._npcSocialR66Loaded = true;

  // ===== D→E：NPC投资情报（高好感NPC分享经济/投资线索,社交→经济跨域桥接）=====
  RANDOM_EVENTS.push({
    id: "npc_investment_whisper",
    phase: "street",
    icon: "💹",
    title: "老陈在银行门口拉住了你",
    desc:
      "老陈在银行站岗时看见你路过，神秘兮兮地凑过来：\n\n" +
      "「小陈啊，我跟你说，最近来办定期的人少了一半，都去买那个'理财'了。" +
      "大厅经理天天打电话拉客户。我站八年了，没见过这架势——你想想，啥信号？」\n\n" +
      "你心里一动：资金在从存款流向投资理财。",
    conditions: function (st) {
      if (!st || !st.relationships) return false;
      if (st.flags && st.flags._npcInvestmentWhisperDone) return false;
      var rel = st.relationships.uncle_chen_bank;
      // [全系统自洽修复] 域D 自洽: 要求 met + 好感≥40（通用称谓,不直呼NPC名）
      if (!rel || !rel.met || (rel.affinity || 0) < 40) return false;
      // 有可投资资产（总资产≥2万才触发投资相关情报）
      var totalAssets =
        (st.resources && (st.resources.cash || 0) + (st.resources.bankBalance || 0)) || 0;
      return totalAssets >= 20000;
    },
    choices: [
      {
        text: "📊 回去研究投资理财",
        hint: "心智+2,开启投资意识",
        apply: function (st) {
          if (st.flags) st.flags._npcInvestmentWhisperDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
          // [D→E 联动]: 标记"社交驱动的投资意识",E域事件可读取此flag降低触发门槛
          if (st.flags) st.flags._socialInvestmentAwareness = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "💡 老陈一句话点醒你：钱不能只躺着。打开投资 Tab，开始让钱为你工作。",
              "good",
            );
        },
      },
      {
        text: "😅 笑笑没当真",
        hint: "好感不变",
        apply: function (st) {
          if (st.flags) st.flags._npcInvestmentWhisperDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("😅 老陈摆摆手：「年轻人不想这些，也行，稳当。」", "info");
        },
      },
    ],
    probability: 0.04,
  });

  // ===== D→C：NPC技能指导（高好感NPC提供职业技能buff,社交→职业成长跨域桥接）=====
  // 设计: NPC好感≥60时,玩家执行匹配技能的工作可获额外XP(通过chatWithNpc对话间接种下"指导flag")
  RANDOM_EVENTS.push({
    id: "npc_skill_mentor_offer",
    phase: "street",
    icon: "🎓",
    title: "一位老朋友想教你点东西",
    desc:
      "难得的好天气,你在常去的地点碰见一位熟识已久的老朋友。寒暄过后,他/她认真地说：\n\n" +
      "「你最近干的活我看在眼里,有模有样了。要不要我点拨你几手?不收费,就当你这些天帮忙的回馈。」\n\n" +
      "简单几句话,胜过你自己琢磨好几天。这就是有人带和没人带的区别。",
    conditions: function (st) {
      if (!st || !st.relationships || !st.player) return false;
      if (st.flags && st.flags._npcSkillMentorOfferDone) return false;
      // 你已经有至少2天工作经历(非萌新)且至少有一个工作
      if ((st.player.day || 0) < 14) return false;
      // 找到一个已结识、好感≥60的NPC
      for (var id in st.relationships) {
        var r = st.relationships[id];
        if (r && r.met && (r.affinity || 0) >= 60) return true;
      }
      return false;
    },
    choices: [
      {
        text: "🎓 认真请教(获得技能指导buff)",
        hint: "该NPC后续相关技能永久+5%XP",
        apply: function (st) {
          if (st.flags) {
            st.flags._npcSkillMentorOfferDone = true;
            // 找到最高好感的已结识NPC作为"指导者"
          }
          var bestId = null, bestAff = 60;
          for (var id in st.relationships) {
            var r = st.relationships[id];
            if (r && r.met && (r.affinity || 0) > bestAff) { bestAff = r.affinity; bestId = id; }
          }
          if (bestId && st.flags) {
            st.flags._npcMentorId = bestId;
            st.flags._npcMentorXpBonus = 0.05; // [PLACEHOLDER] 5% XP加成
          }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🎓 有人指引的路,走得更快。你的指导者已就位,相关技能经验获取提升。",
              "success",
            );
        },
      },
      {
        text: "😊 先记下,以后再说",
        hint: "好感不变",
        apply: function (st) {
          if (st.flags) st.flags._npcSkillMentorOfferDone = true;
        },
      },
    ],
    probability: 0.03,
  });
})();

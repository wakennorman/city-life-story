/*
 * 城市浮生记 — 域C（职业/成长）联动增强事件 v65
 * R65 全系统优化·Domain C 联动增强 — 填补 C→E（职业→经济联动）空白
 *
 * 设计约束（与 R16/R24 career_linkage_events.js 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import）
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER] 待数值组校准
 *  - 事件引擎按 e.phase 过滤（street/corporate），本文件含 corporate 阶段事件
 *  - 里程碑事件用 st.flags._xxxDone 去重
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._careerR65Loaded) return;
  RANDOM_EVENTS._careerR65Loaded = true;

  // ---- 本地助手（IIFE 作用域） ----
  function safeAffinityR65(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域C R65联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      Math.max(0, Math.min(100, (st.relationships[npcId].affinity || 0) + change));
    st.relationships[npcId].met = true;
  }

  // ============ 事件定义 ============

  // ===== C→E：职业收入达标→经济觉醒（稳定高薪后首次考虑"钱生钱"） =====
  RANDOM_EVENTS.push({
    id: "career_investment_awakening",
    title: "一笔工资到账后，你第一次想了'然后呢'",
    desc:
      "卡里攒下的数字慢慢让你不安：光靠上班，天花板肉眼可见。你刷到一篇文章说" +
      "'工资是线性增长，资产是指数增长'。也许该考虑让钱替你干活了？",
    phase: "corporate",
    triggers: { minDay: 90 },
    conditions: function (st) {
      if (!st || !st.player) return false;
      if (st.player.phase !== "corporate") return false;
      if (st.flags && st.flags._careerInvestmentAwakeningDone) return false;
      // 工资达到稳定门槛才触发"经济觉醒"
      var corp = st.corporate || {};
      var rank = corp.rank || "P5";
      var rankOrder = ["P5", "P6", "P7", "P8", "P9", "P10"];
      var rankIdx = rankOrder.indexOf(rank);
      if (rankIdx < 1) return false; // P5 太初级不触发
      // 总资产达到可投资门槛（有闲钱）
      var totalCash = (st.resources && st.resources.cash) || 0;
      var bankBal = (st.resources && st.resources.bankBalance) || 0;
      if (totalCash + bankBal < 50000) return false;
      return true;
    },
    choices: [
      {
        text: "研究一下/投资理财",
        apply: function (st) {
          if (st.flags) {
            st.flags._careerInvestmentAwakeningDone = true;
            st.flags._investmentCareerPrimed = true; // 联动E域：标记"职业驱动的投资觉醒"
          }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "💡 职场稳定后的第一步觉醒：让钱为你打工。前往经济/投资 Tab 探索更多。",
              "good"
            );
          // 仪式性引导：如果存在 Tab 导航函数，切换到经济 Tab
          try {
            if (typeof navigateTo === "function") {
              navigateTo({ tab: "finance", silent: true });
            }
          } catch (e) { /* 非阻塞引导 */ }
        },
      },
      {
        text: "先不想这些，稳稳上班",
        apply: function (st) {
          if (st.flags) st.flags._careerInvestmentAwakeningDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
        },
      },
    ],
    probability: 0.06,
  });

  // ===== C→D：晋升庆祝→NPC社交圈涟漪（晋升消息传开，老朋友发来祝贺） =====
  RANDOM_EVENTS.push({
    id: "career_promotion_npc_congrats",
    title: "老朋友听说了你的晋升",
    desc:
      "你升职的消息不胫而走。一位许久没联系的老朋友发来消息：“恭喜啊，当初就说你行。”" +
      "简单一句，让你想起一路走来的点滴。",
    phase: "corporate",
    triggers: { minDay: 60 },
    conditions: function (st) {
      if (!st || !st.relationships) return false;
      if (st.flags && st.flags._careerPromotionNpcCongratsDone) return false;
      if (!st.flags._totalPromotions || st.flags._totalPromotions < 1) return false;
      // 有已结识且好感≥30的NPC
      var hasFriend = false;
      for (var id in st.relationships) {
        var r = st.relationships[id];
        if (r && r.met && (r.affinity || 0) >= 30) { hasFriend = true; break; }
      }
      return hasFriend;
    },
    choices: [
      {
        text: "回一条暖心的消息",
        apply: function (st) {
          if (st.flags) st.flags._careerPromotionNpcCongratsDone = true;
          // 随机选一个已结识的NPC加好感
          var met = [];
          for (var id in st.relationships) {
            var r = st.relationships[id];
            if (r && r.met && (r.affinity || 0) >= 30) met.push({ id: id, rel: r });
          }
          if (met.length && typeof Random !== "undefined") {
            var pick = met[Random.int(0, met.length - 1)];
            safeAffinityR65(st, pick.id, 5, "晋升消息引发老友祝福");
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🤝 老友的祝福让你暖意十足。人脉是职业之路最被低估的复利。",
              "good"
            );
        },
      },
      {
        text: "只回一个表情包",
        apply: function (st) {
          if (st.flags) st.flags._careerPromotionNpcCongratsDone = true;
        },
      },
    ],
    probability: 0.05,
  });
})();

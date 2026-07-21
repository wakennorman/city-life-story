/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强 · R76
 * 全系统优化 loop R76 · 联动增强 3项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR76) return;
  RANDOM_EVENTS._domainALinkageR76 = true;

  // ---- 本地助手 ----

  // 安全改好感
  function safeAffinityR76(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域A R76联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 净资产
  function netWorthR76(st) {
    if (!st || !st.resources) return 0;
    var nw = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
    if (typeof getInvestmentAssetSnapshot === "function") {
      try {
        var snap = getInvestmentAssetSnapshot(st);
        if (snap && snap.investmentValue) nw += snap.investmentValue;
      } catch (e) { /* 忽略 */ }
    }
    return nw;
  }

  // 当前活跃财富税档
  function activeTaxTierR76(st) {
    if (typeof EconomySystem === "undefined" || !EconomySystem) return null;
    try {
      return EconomySystem.getActiveTaxTier(netWorthR76(st));
    } catch (e) {
      return null;
    }
  }

  // ---- 联动事件 ----

  var A_EVENTS = [
    // ===== 联动1: A→B 财富税档位首达叙事 =====
    // 设计意图：累进财富税档位（入门/中产/精英/富豪）首次命中时触发叙事，
    //   让玩家感知到"钱越多税越重"的经济平衡机制，损失厌恶驱动资产多元化。
    {
      id: "wealth_tax_tier_milestone",
      title: "税务通知",
      desc: "你收到一条税务提醒短信。随着资产增长，你已进入新的纳税档次。",
      phase: "street",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (typeof EconomySystem === "undefined" || !EconomySystem) return false;
        var nw = netWorthR76(st);
        var tier = EconomySystem.getActiveTaxTier(nw);
        if (!tier) return false;
        // 每档仅触发一次
        var flagKey = "_taxTierDone_" + tier.label;
        if (st.flags[flagKey]) return false;
        // 至少进入中产税以上（入门税不触发叙事，避免早期信息轰炸）
        return nw >= 500000;
      },
      choices: [
        {
          text: "老老实实交税，守法公民",
          apply: function (st) {
            var tier = activeTaxTierR76(st);
            if (tier && st.flags) st.flags["_taxTierDone_" + tier.label] = true;
            if (st.player) st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("依法纳税，心里踏实。道德+2。", "good");
          },
        },
        {
          text: "研究一下合理避税渠道",
          apply: function (st) {
            var tier = activeTaxTierR76(st);
            if (tier && st.flags) st.flags["_taxTierDone_" + tier.label] = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
              st.player.morality = Math.max(0, (st.player.morality || 50) - 1);
            }
            // 标记：后续投资事件可消费此 flag 解锁"税务筹划"选项
            if (st.flags) st.flags._taxAvoidanceMindset = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("你开始关注税务筹划。智力+1，道德-1。", "hint");
          },
        },
      ],
      probability: 0.05,
    },

    // ===== 联动2: A→D 高资产NPC税负话题 =====
    // 设计意图：当玩家资产达到精英税档时，已结识的高好感NPC主动聊起税负话题，
    //   让经济数据（财富税）与社交系统产生交叉引用，体现"富有之后的烦恼"。
    {
      id: "npc_tax_burden_chat",
      title: "饭局上的税负话题",
      desc: "老友在饭桌上聊起最近的税务变化，看了你一眼：'你现在这个体量，得注意税务筹划啊。'",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player || !st.relationships || !st.flags) return false;
        if (st.flags._npcTaxBurdenChatDone) return false;
        if (typeof EconomySystem === "undefined" || !EconomySystem) return false;
        var nw = netWorthR76(st);
        // 精英税档以上（¥200万+）
        if (nw < 2000000) return false;
        // 至少1个已结识且好感≥40的NPC
        var hasClose = false;
        for (var id in st.relationships) {
          if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
          var r = st.relationships[id];
          if (r && r.met && (r.affinity || 0) >= 40) { hasClose = true; break; }
        }
        return hasClose;
      },
      choices: [
        {
          text: "点头称是，分享自己的税务心得",
          apply: function (st) {
            if (st.flags) st.flags._npcTaxBurdenChatDone = true;
            // 随机选一个高好感NPC好感+3
            if (st.relationships) {
              var best = null, bestAff = 0;
              for (var id in st.relationships) {
                if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
                var r = st.relationships[id];
                if (r && r.met && (r.affinity || 0) >= 40 && (r.affinity || 0) > bestAff) {
                  best = id; bestAff = r.affinity || 0;
                }
              }
              if (best) safeAffinityR76(st, best, 3, "税负话题共鸣");
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("与老友交流税务心得，心情舒畅。心智+2。", "good");
          },
        },
        {
          text: "淡然一笑，转移话题",
          apply: function (st) {
            if (st.flags) st.flags._npcTaxBurdenChatDone = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("你不喜欢在饭桌上谈钱。", "hint");
          },
        },
      ],
      probability: 0.03,
    },

    // ===== 联动3: A→G 贷款信用等级叙事 =====
    // 设计意图：economy_v3.1.js 的 getDynamicLoanRate 基于总资产阶梯定价，
    //   但玩家从未被告知自己的"信用等级"。此事件将隐藏的贷款率转化为叙事感知，
    //   让经济系统的隐性数据可见化，损失厌恶驱动玩家维护资产规模。
    {
      id: "loan_credit_tier_reveal",
      title: "银行客户经理的电话",
      desc: "银行打来电话：'基于您的资产状况，我们已经将您升级为VIP客户，享受优惠贷款利率。'",
      phase: "street",
      triggers: { minDay: 45 },
      conditions: function (st) {
        if (!st || !st.player || !st.resources || !st.flags) return false;
        if (st.flags._loanCreditTierRevealDone) return false;
        if (typeof EconomySystem === "undefined" || !EconomySystem) return false;
        var nw = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        // 总资产≥¥10万（进入第二档利率）
        return nw >= 100000;
      },
      choices: [
        {
          text: "接受VIP身份，了解一下贷款优惠",
          apply: function (st) {
            if (st.flags) st.flags._loanCreditTierRevealDone = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
            // 标记：后续可解锁低息贷款选项
            if (st.flags) st.flags._bankVipUnlocked = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              var rate = EconomySystem.getDynamicLoanRate(
                (st.resources.cash || 0) + (st.resources.bankBalance || 0)
              );
              StateManager.addMessage(
                "银行VIP客户已解锁！当前日利率 " + (rate * 100).toFixed(2) + "%。智力+1，心智+2。",
                "good"
              );
            }
          },
        },
        {
          text: "婉拒，不想欠银行人情",
          apply: function (st) {
            if (st.flags) st.flags._loanCreditTierRevealDone = true;
            if (st.player) st.player.morality = Math.min(100, (st.player.morality || 50) + 1);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("你婉拒了银行的VIP邀请。不欠人情，心里轻松。道德+1。", "hint");
          },
        },
      ],
      probability: 0.04,
    },
  ];

  // 注册到 RANDOM_EVENTS
  for (var i = 0; i < A_EVENTS.length; i++) {
    var evt = A_EVENTS[i];
    // 防御性兜底：确保必要字段存在
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions) evt.conditions = function () { return false; };
    RANDOM_EVENTS.push(evt);
  }
})();

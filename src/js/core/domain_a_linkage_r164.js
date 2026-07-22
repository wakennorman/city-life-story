/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强 · R164
 * 全系统优化 loop R164 · 联动增强 3项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR164) return;
  RANDOM_EVENTS._domainALinkageR164 = true;

  // ---- 本地助手 ----

  // 安全改好感
  function safeAffinityR164(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域A R164联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 净资产快照
  function netWorthR164(st) {
    if (!st || !st.resources) return 0;
    return (st.resources.cash || 0) + (st.resources.bankBalance || 0);
  }

  // 检查玩家是否患病（任意疾病）
  function hasAnyIllnessR164(st) {
    if (!st || !st.status) return false;
    if (st.status.diseases && Array.isArray(st.status.diseases) && st.status.diseases.length > 0) return true;
    if (st.status.illnesses && Array.isArray(st.status.illnesses) && st.status.illnesses.length > 0) return true;
    return false;
  }

  // 检查玩家是否有指定NPC已结识
  function hasMetNpcR164(st, npcId) {
    if (!st || !st.relationships || !npcId) return false;
    var r = st.relationships[npcId];
    return r && r.met === true;
  }

  // 计算总交易次数
  function totalTradeCountR164(st) {
    if (!st || !st.trade) return 0;
    var buy = (st.trade.totalBuys || 0);
    var sell = (st.trade.totalSells || 0);
    return buy + sell;
  }

  // 已结识NPC数量
  function metNpcCountR164(st) {
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      if (st.relationships[id] && st.relationships[id].met) count++;
    }
    return count;
  }

  // ---- 联动事件 ----

  var A_EVENTS = [

    // ===== 联动1: A→B 医药费用负担叙事 =====
    // 设计意图：当玩家患病且需购买药品时，药品价格（goods.js药品定价）与疾病系统
    //   交叉产生叙事事件，让玩家感知到"健康是有成本的"，损失厌恶驱动健康管理。
    {
      id: "health_cost_awakening",
      title: "药费账单上的数字",
      desc: "你翻看这个月的支出，发现花在药上的钱比饭钱还多。生病不只是身体受罪，钱包也在'流血'。",
      phase: "street",
      triggers: { minDay: 15 },
      conditions: function (st) {
        if (!st || !st.player || !st.resources || !st.flags) return false;
        if (st.flags._healthCostAwakeningDone) return false;
        // 必须正在患病
        if (!hasAnyIllnessR164(st)) return false;
        // 至少有过一些药费支出（累计购买药品或医疗支出）
        var medExpense = (st.resources.totalMedicalSpent || 0);
        if (medExpense < 500) return false;
        return true;
      },
      choices: [
        {
          text: "🏥 开始重视健康，减少生病就是省钱",
          apply: function (st) {
            if (st.flags) st.flags._healthCostAwakeningDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
            }
            if (st.flags) st.flags._healthCostAware = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "健康是最好的投资。你决定更加注意身体，减少不必要的医药开支。心智+3，智力+1。",
                "good"
              );
          },
        },
        {
          text: "💊 先治好病再说，钱可以再赚",
          apply: function (st) {
            if (st.flags) st.flags._healthCostAwakeningDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "身体是革命的本钱——你决定先把病治好。",
                "info"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动2: A→D 交易声望·商贩人脉 =====
    // 设计意图：交易数据（trade.js）中高频交易积累的"商贩人脉"转化为社交资产，
    //   让玩家在交易之外获得NPC关系收益，激励交易行为。
    {
      id: "trader_reputation_connection",
      title: "老主顾的面子",
      desc: "你在市场上频繁交易，商贩们都已经记住了你。一位老主顾悄悄告诉你一个进货渠道——价格比市场价低不少。",
      phase: "street",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.player || !st.trade || !st.flags) return false;
        if (st.flags._traderReputationDone) return false;
        // 交易次数达到一定门槛
        var totalTrades = totalTradeCountR164(st);
        if (totalTrades < 20) return false;
        // 至少认识1个NPC
        if (metNpcCountR164(st) < 1) return false;
        return true;
      },
      choices: [
        {
          text: "🤝 接受好意，建立长期合作",
          apply: function (st) {
            if (st.flags) st.flags._traderReputationDone = true;
            // 给随机已结识NPC加好感度
            if (st.relationships) {
              var best = null, bestAff = 0;
              for (var id in st.relationships) {
                if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
                var r = st.relationships[id];
                if (r && r.met && (r.affinity || 0) > bestAff) {
                  best = id; bestAff = r.affinity || 0;
                }
              }
              if (best) safeAffinityR164(st, best, 5, "交易声誉带来的社交信任");
            }
            // 标记：后续交易事件可消费此 flag 解锁折扣选项
            if (st.flags) st.flags._traderNetwork = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 1);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "市场里的老主顾关系让你在社交圈里更有分量。魅力+1，心智+3。",
                "good"
              );
          },
        },
        {
          text: "💰 打听一下具体怎么操作",
          apply: function (st) {
            if (st.flags) st.flags._traderReputationDone = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (st.flags) st.flags._traderNetwork = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你仔细问了进货渠道，记下了联系方式。智力+3。",
                "info"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动3: A→H 公司运营成本感知 =====
    // 设计意图：当玩家进入公司阶段（Phase2）后，goods.js中的商品定价数据
    //   影响公司运营成本感知——让Phase1积累的数据经验在Phase2产生叙事回响。
    {
      id: "corp_supply_cost_awareness",
      title: "成本账里的价格记忆",
      desc: "你坐在办公室里审阅采购清单，上面那些数字让你想起当初在市场里讨价还价的日子。'这个螺丝，以前在批发市场买只要两毛五……'你对着报表笑了笑。",
      phase: "corporate",
      triggers: { minDay: 150 },
      conditions: function (st) {
        if (!st || !st.player || st.player.phase !== "corporate") return false;
        if (!st.resources || !st.flags) return false;
        if (st.flags._corpSupplyCostAwarenessDone) return false;
        // 公司运营至少有一段时间
        if (!st.company && !st.startup) return false;
        // 在Phase1待过足够长的时间（至少30天）
        var streetDays = st.flags._streetPhaseDays || st.player.day || 0;
        if (streetDays < 30) return false;
        return true;
      },
      choices: [
        {
          text: "📋 用Phase1积累的供应链经验优化成本",
          apply: function (st) {
            if (st.flags) st.flags._corpSupplyCostAwarenessDone = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            // 标记：后续公司运营事件可消费此 flag 解锁成本优化选项
            if (st.flags) st.flags._supplyChainSavvy = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "以前当小贩的经验，现在变成了公司运营的智慧。你开始优化供应链成本。智力+3，心智+3。",
                "good"
              );
          },
        },
        {
          text: "💼 交给采购团队，自己专注战略",
          apply: function (st) {
            if (st.flags) st.flags._corpSupplyCostAwarenessDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你选择信任团队，把精力放在更大的事情上。",
                "info"
              );
          },
        },
      ],
      probability: 0.03,
    },
  ];

  // 注册到 RANDOM_EVENTS
  for (var i = 0; i < A_EVENTS.length; i++) {
    var evt = A_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions) evt.conditions = function () { return false; };
    RANDOM_EVENTS.push(evt);
  }
})();
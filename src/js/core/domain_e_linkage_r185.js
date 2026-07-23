/*
 * 城市浮生记 — 域E（经济/投资）联动增强 · R185
 * 全系统优化 loop R185 · 联动增强 3项（2 street + 1 corporate）
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；里程碑类事件用 st.flags._xxxDone 去重。
 *  - 引擎按 e.phase 过滤（events_core.js），每个事件显式设 phase。
 *  - 数值用 [PLACEHOLDER] 语义占位（下方常量集中标注）。
 *  - 严守域D铁律：只读 st.relationships、rel && rel.met 守卫、跨NPC传导走 applyAffinityChange。
 *
 * 本轮字段真实性已核（见 MEMORY.md / R18 / R27）：
 *  - 持仓容器 st.investment.stockHoldings（数组）；现金 st.resources.cash；存款 st.resources.bankBalance。
 *  - st.investment._totalInvestmentProfit 本轮起由 sellInvStock/sellBtc 真实累计（此前死字段）。
 *  - 幸福感真实字段 st.needs.happiness；心智 st.player.mental；智力 st.player.intelligence。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR185) return;
  RANDOM_EVENTS._domainELinkageR185 = true;

  // ---- [PLACEHOLDER] 数值常量（集中标注，便于平衡）----
  var P_SAFETY_NET_BANK = 50000; // [PLACEHOLDER] E→G 安全垫存款门槛
  var P_PROFIT_INSIGHT = 8000; // [PLACEHOLDER] E→D 盘感识风险的累计盈利门槛
  var P_FRIEND_AFF = 25; // [PLACEHOLDER] E→D 密友好感门槛
  var P_AFF_GAIN = 5; // [PLACEHOLDER] E→D 劝阻朋友后好感回馈
  var P_SKILL_XP = 8; // [PLACEHOLDER] E→C 财报盘感迁移职场技能XP

  // ---- 本地助手 ----
  function bankBalanceR185(st) {
    if (!st || !st.resources) return 0;
    return st.resources.bankBalance || 0;
  }
  function holdingsCountR185(st) {
    if (!st || !st.investment || !Array.isArray(st.investment.stockHoldings))
      return 0;
    return st.investment.stockHoldings.length;
  }
  function totalProfitR185(st) {
    if (!st || !st.investment) return 0;
    return st.investment._totalInvestmentProfit || 0;
  }
  function getMetNpcsR185(st, minAff) {
    if (!st || !st.relationships) return [];
    var out = [];
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) out.push(id);
    }
    return out;
  }
  function npcNameR185(id) {
    if (typeof getNpcDisplayName === "function") return getNpcDisplayName(id);
    if (typeof NPCS !== "undefined" && NPCS && NPCS.find) {
      var d = NPCS.find(function (n) {
        return n.id === id;
      });
      if (d && d.name) return d.name;
    }
    return id;
  }
  function affinityR185(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域E R185联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }
  function msgR185(text, kind) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage)
      StateManager.addMessage(text, kind || "info");
  }

  var E_EVENTS = [
    // ===== 1. E→G 财务安全垫 · 人生节点叙事 (street) =====
    // 设计意图：把「存款+持仓」这组冰冷数字，转化为「被动收入安全垫」的人生安全感节点，
    //   让攒钱理财第一次拥有情感温度——经济能力反哺核心生命体验。
    {
      id: "invest_r185_safety_net",
      title: "第一层安全垫",
      desc:
        "深夜结算这个月的账，你忽然意识到：银行里有了一笔够撑上好一阵子的存款，账户里还有在稳步生长的持仓。\n\n" +
        "这是你来到这座城市后，第一次不必为「万一明天丢了收入怎么办」而失眠。这层薄薄的安全垫，是你一分一分攒出来的底气。",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player || !st.needs || !st.flags) return false;
        if (st.flags._investE185SafetyNetDone) return false;
        if (bankBalanceR185(st) < P_SAFETY_NET_BANK) return false;
        if (holdingsCountR185(st) < 1) return false;
        return true;
      },
      choices: [
        {
          text: "🛡️ 记住这份踏实，继续稳扎稳打",
          apply: function (st) {
            if (st.flags) st.flags._investE185SafetyNetDone = true;
            if (st.needs)
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 0) + 4,
              );
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            // 标记：后续核心/生命节点事件可消费此安全感 flag（G域桥接）
            if (st.flags) st.flags._financialSafetyNet = true;
            msgR185(
              "有了安全垫，脚步更稳了。这份底气，比数字本身更珍贵。心情+4，心智+5。",
              "good",
            );
          },
        },
        {
          text: "🚀 拿一部分闲钱，去搏一个更大的目标",
          apply: function (st) {
            if (st.flags) st.flags._investE185SafetyNetDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 50) + 3,
              );
            }
            if (st.flags) st.flags._financialSafetyNet = true;
            msgR185(
              "安全垫给了你冒险的资格。你决定用它撬动更远的可能。智力+3，心智+2。",
              "info",
            );
          },
        },
      ],
      probability: 0.05,
    },

    // ===== 2. E→D 盘感识风险 · 劝阻朋友入局 (street) =====
    // 设计意图：把玩家积累的投资盘感转化为社交资本——朋友被高风险标的诱惑时，
    //   你凭经验识破并劝阻。诚实的忠告加深信任（D域好感），而非靠花钱请客。
    {
      id: "invest_r185_risk_guard",
      title: "朋友想跟一个'稳赚'的盘",
      desc:
        "一位朋友兴冲冲地找你：「有个内部消息，说某个标的这周必涨，你不是懂投资吗？要不要一起上车？」\n\n" +
        "你听完对方描述的「保证收益」「内部消息」，心里警铃大作——这正是你交过学费才认清的那类陷阱。",
      phase: "street",
      triggers: { minDay: 70 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._investE185RiskGuardDone) return false;
        // 有盘感：累计已实现盈利达门槛（本轮起真实维护）
        if (totalProfitR185(st) < P_PROFIT_INSIGHT) return false;
        // 有可劝阻的密友
        if (getMetNpcsR185(st, P_FRIEND_AFF).length < 1) return false;
        return true;
      },
      choices: [
        {
          text: "🛑 拦住朋友，把风险掰开揉碎讲清楚",
          apply: function (st) {
            if (st.flags) st.flags._investE185RiskGuardDone = true;
            var met = getMetNpcsR185(st, P_FRIEND_AFF);
            if (met.length > 0) {
              var idx =
                typeof Random !== "undefined"
                  ? Random.int(0, met.length - 1)
                  : 0;
              var nid = met[idx];
              affinityR185(st, nid, P_AFF_GAIN, "诚实劝阻高风险投资");
              msgR185(
                "💬 你把「保证收益」背后的猫腻讲给" +
                  npcNameR185(nid) +
                  "听。对方后怕地擦了擦汗：「幸亏问了你。」信任更深了一层。",
                "good",
              );
            }
            if (st.player) {
              st.player.morality = Math.min(
                100,
                (st.player.morality || 50) + 3,
              );
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
          },
        },
        {
          text: "🤐 各人有各人的判断，不便多嘴",
          apply: function (st) {
            if (st.flags) st.flags._investE185RiskGuardDone = true;
            if (st.player)
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 50) + 2,
              );
            msgR185(
              "你没多说什么。有些弯路，或许别人也得自己走一遍才懂。智力+2。",
              "info",
            );
          },
        },
      ],
      probability: 0.045,
    },

    // ===== 3. E→C 财报盘感迁移职场 (corporate) =====
    // 设计意图：让投资中练就的数据敏感度在职场兑现——把 K 线/财报的盘感迁移到业务分析，
    //   使经济能力反哺职业成长（E→C），避免投资收益与职业线彻底脱钩。
    {
      id: "invest_r185_data_instinct",
      title: "把盘感用在业务上",
      desc:
        "季度复盘会上，一份密密麻麻的业务数据摆在面前。别人看得头大，你却下意识地像看财报一样，" +
        "一眼扫出了趋势拐点和异常项——那是你在投资市场里被反复训练出来的数据直觉。",
      phase: "corporate",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._investE185DataInstinctDone) return false;
        if (holdingsCountR185(st) < 1) return false;
        return true;
      },
      choices: [
        {
          text: "📊 主动请缨，用数据视角做一版分析",
          apply: function (st) {
            if (st.flags) st.flags._investE185DataInstinctDone = true;
            if (typeof addSkillXp === "function") addSkillXp("accounting", P_SKILL_XP);
            if (st.player)
              st.player.intelligence = Math.min(
                100,
                (st.player.intelligence || 50) + 3,
              );
            msgR185(
              "你的数据分析让全场眼前一亮。市场教你的东西，在职场里同样值钱。会计经验+" +
                P_SKILL_XP +
                "，智力+3。",
              "good",
            );
          },
        },
        {
          text: "🙂 心里有数就好，不必出这个风头",
          apply: function (st) {
            if (st.flags) st.flags._investE185DataInstinctDone = true;
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            msgR185("藏而不露，也是一种成熟。心智+3。", "info");
          },
        },
      ],
      probability: 0.045,
    },
  ];

  for (var i = 0; i < E_EVENTS.length; i++) {
    var evt = E_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions)
      evt.conditions = function () {
        return false;
      };
    RANDOM_EVENTS.push(evt);
  }
})();

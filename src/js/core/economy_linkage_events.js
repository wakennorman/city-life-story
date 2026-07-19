/**
 * 经济/投资域联动增强事件 — 域 E（经济/投资）跨域桥接
 *
 * 设计意图（全系统优化·循环 R11 · 域E）：
 *   投资/股票/房产/财富税等经济系统长期"算而不显"——
 *   economy_v3.1、investment.js、property_market.js 的数值从不进入叙事。
 *   本文件补 3 个跨域桥接事件，把"钱"变成玩家能感知、能抉择的人生片段：
 *     ① bull_market_tea_party  — E→D（经济→社交）：牛市里与已结识 NPC 分享收益，好感+，社会比较
 *     ② asset_milestone_reflection — E→G（经济→核心/人生）：资产跨过里程碑，峰终定律式自我肯定
 *     ③ colleague_invest_club  — E→C（经济→职业）：职场期同事理财饭局，职场声誉/道德抉择
 *
 * 接入方式：与 insider_trading_events.js 相同的 IIFE 注入 RANDOM_EVENTS 模式
 * 全部字段 || 防御；数值标 [PLACEHOLDER]，待 playtest 调参。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._economyLinkageLoaded) return;
  RANDOM_EVENTS._economyLinkageLoaded = true;

  // ====== 工具: 估算玩家总资产（现金+存款+房产+车辆+股票市值+比特币）======
  function estimateTotalAssets(st) {
    var cash = (st.resources && st.resources.cash) || 0;
    var bank = (st.resources && st.resources.bankBalance) || 0;
    var total = cash + bank;
    var inv = st.investment;
    if (!inv) return total;
    if (inv.properties) {
      for (var i = 0; i < inv.properties.length; i++) {
        var p = inv.properties[i];
        total += p.currentPrice || p.buyPrice || 0;
      }
    }
    if (inv.cars) {
      for (var c = 0; c < inv.cars.length; c++) {
        var car = inv.cars[c];
        total += car.currentPrice || car.buyPrice || 0;
      }
    }
    if (inv.stockHoldings && inv.stockMarket) {
      for (var s = 0; s < inv.stockHoldings.length; s++) {
        var h = inv.stockHoldings[s];
        var m = inv.stockMarket[h.symbol];
        if (m && m.price) total += m.price * (h.shares || 0);
      }
    }
    if (inv.btcHoldings > 0 && inv.btcPrice > 0) {
      total += inv.btcHoldings * inv.btcPrice;
    }
    return total;
  }

  // ====== 工具: 选取好感最高的已结识 NPC id（守卫遍历）======
  function pickClosestMetNpc(st) {
    var rels = st.relationships || {};
    var bestId = null;
    var bestAff = -1;
    Object.keys(rels).forEach(function (k) {
      var r = rels[k];
      if (r && r.met && (r.affinity || 0) > bestAff) {
        bestAff = r.affinity || 0;
        bestId = k;
      }
    });
    return bestId;
  }

  var ECON_EVENTS = [
    // ===== ① E→D：牛市茶话会（经济收益溢出到社交）=====
    {
      id: "bull_market_tea_party",
      phase: "street",
      icon: "📈",
      title: "牛市里的茶话会",
      story:
        "你的账户这个月红了。不是大红，是那种让人踏实的小红——攒了几年的定投终于开始冒头。\n\n傍晚你溜达到常去的茶馆，老位置还空着。手机里几个已读不回的消息，是平时一起吐槽生活的朋友。\n\n你忽然想：赚了钱，第一反应不该是截图发朋友圈，而是约人喝杯茶。",
      triggers: { minDay: 120, excludeFlags: ["_bullTeaParty"] },
      conditions: function (st) {
        var inv = st.investment;
        if (!inv) return false;
        var holds =
          (inv.stockHoldings && inv.stockHoldings.length > 0) ||
          inv.btcHoldings > 0;
        if (!holds) return false;
        var rels = st.relationships || {};
        var hasFriend = Object.keys(rels).some(function (k) {
          var r = rels[k];
          return r && r.met && (r.affinity || 0) >= 20;
        });
        return hasFriend;
      },
      probability: 0.04, // [PLACEHOLDER] 触发率待 playtest
      repeatable: false,
      choices: [
        {
          text: "🍵 约朋友喝茶，聊聊这段行情",
          hint: "好感+[PLACEHOLDER]，心情+[PLACEHOLDER]",
          apply: function (st) {
            st.flags._bullTeaParty = true;
            var npcId = pickClosestMetNpc(st);
            if (npcId && typeof applyAffinityChange === "function") {
              applyAffinityChange(
                st,
                npcId,
                3 /*[PLACEHOLDER] 好感增益*/,
                "牛市茶话会",
              );
            }
            st.needs.happiness = Math.min(
              100,
              (st.needs.happiness || 50) + 6 /*[PLACEHOLDER] 心情增益*/,
            );
            StateManager.addMessage(
              "🍵 你约了朋友喝茶，把这段行情的得失摊开聊了聊。分享让喜悦翻了倍。心情+6。",
              "success",
            );
          },
        },
        {
          text: "🤫 闷声发大财",
          hint: "心情小幅+，不惊动关系网",
          apply: function (st) {
            st.flags._bullTeaParty = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage(
              "🤫 你没声张，只是默默记下了这笔收益。财不外露。心情+3。",
              "info",
            );
          },
        },
        {
          text: "💡 顺手给朋友推荐了只票",
          hint: "道德-[PLACEHOLDER]，社交风险",
          apply: function (st) {
            st.flags._bullTeaParty = true;
            st.player.morality = Math.max(
              0,
              (st.player.morality || 50) - 2 /*[PLACEHOLDER] 道德代价*/,
            );
            StateManager.addMessage(
              "💡 你给朋友推荐了持仓里的一只票。万一看错，这人情可就欠下了。道德-2。",
              "warning",
            );
          },
        },
      ],
    },

    // ===== ② E→G：资产里程碑（经济成就→人生峰终反思）=====
    {
      id: "asset_milestone_reflection",
      phase: "street",
      icon: "🏆",
      title: "资产里程碑",
      story:
        "今晚你破天荒翻了翻资产总览：现金、存款、那套小房子、几只票、还有早年间囤的比特币——加在一起，数字第一次让你自己都有点意外。\n\n你想起刚进城那年，兜里只剩三百块，在火车站广场坐了一夜。\n\n钱不是目的。但钱替你挡掉了很多深夜的恐慌。",
      triggers: { minDay: 60, excludeFlags: ["_assetMilestone"] },
      conditions: function (st) {
        var total = estimateTotalAssets(st);
        // [PLACEHOLDER] 阈值对齐 economy_v3.1 富豪税档（¥1000万），此处取"小有积蓄"档，待调参
        return (
          total >= 500000 /*[PLACEHOLDER] 资产里程碑阈值*/ &&
          (st.player.day || 0) > 60
        );
      },
      probability: 0.06, // [PLACEHOLDER] 触发率待 playtest
      repeatable: false,
      choices: [
        {
          text: "🏆 停下来，给自己一个肯定",
          hint: "心情+[PLACEHOLDER]，心智+[PLACEHOLDER]",
          apply: function (st) {
            st.flags._assetMilestone = true;
            st.needs.happiness = Math.min(
              100,
              (st.needs.happiness || 50) + 10 /*[PLACEHOLDER] 心情增益*/,
            );
            st.player.mental = Math.min(
              100,
              (st.player.mental || 50) + 5 /*[PLACEHOLDER] 心智增益*/,
            );
            StateManager.addMessage(
              "🏆 你给自己倒了杯酒，没发朋友圈，只是对着窗外的灯笑了笑。这一路，值了。心情+10，心智+5。",
              "success",
            );
          },
        },
        {
          text: "📊 复盘这段路",
          hint: "心智+[PLACEHOLDER]，标记税务意识",
          apply: function (st) {
            st.flags._assetMilestone = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            st.flags._taxPlanning = true;
            StateManager.addMessage(
              "📊 你把这几年的取舍在脑子里过了一遍：哪些赌对了，哪些差点翻车。复盘让人清醒。心智+8。",
              "info",
            );
          },
        },
        {
          text: "🚀 这只是起点，继续冲刺",
          hint: "轻量，保持冲劲",
          apply: function (st) {
            st.flags._assetMilestone = true;
            StateManager.addMessage(
              "🚀 你关掉资产页面，把目标往上挪了一格。下一个里程碑，还在前面。",
              "info",
            );
          },
        },
      ],
    },

    // ===== ③ E→C：同事理财饭局（经济×职业，职场期专属）=====
    {
      id: "colleague_invest_club",
      phase: "corporate",
      icon: "💼",
      title: "同事的理财饭局",
      story:
        "周五下班，同组的老周神秘兮兮地戳你：「晚上有空没？几个同事小聚，顺便聊聊……你懂的，最近那点行情。」\n\n包厢里坐着四五个熟人，手机都亮着自选股页面。有人晒收益，有人吐槽被套。\n\n老周夹了口菜：「在写字楼里，会干活是基本功，懂点钱路才踏实。你平时看着挺有想法的，怎么看后市？」",
      triggers: { minDay: 200, excludeFlags: ["_colleagueInvestClub"] },
      conditions: function (st) {
        if (!st.player || st.player.phase !== "corporate") return false;
        var inv = st.investment;
        if (!inv) return false;
        var holds =
          (inv.stockHoldings && inv.stockHoldings.length > 0) ||
          inv.btcHoldings > 0;
        return holds;
      },
      probability: 0.05, // [PLACEHOLDER] 触发率待 playtest
      repeatable: false,
      choices: [
        {
          text: "🍻 参加饭局，交换投资情报",
          hint: "职场声誉+[PLACEHOLDER]，心情+[PLACEHOLDER]",
          apply: function (st) {
            st.flags._colleagueInvestClub = true;
            if (st.player.corporate) {
              st.player.corporate.upwardMgmt = Math.min(
                100,
                (st.player.corporate.upwardMgmt || 50) +
                  4 /*[PLACEHOLDER] 职场声誉增益*/,
              );
            }
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "🍻 你去了饭局，几个同事越聊越投缘。信息差就是机会差——职场里多一条财路，也多一分底气。职场声誉+4，心情+5。",
              "success",
            );
          },
        },
        {
          text: "📵 推掉，专心把手头项目做好",
          hint: "道德+[PLACEHOLDER]，稳健",
          apply: function (st) {
            st.flags._colleagueInvestClub = true;
            st.player.morality = Math.min(
              100,
              (st.player.morality || 50) + 3 /*[PLACEHOLDER] 道德增益*/,
            );
            StateManager.addMessage(
              "📵 你婉拒了：「最近项目紧，先搞钱（工资）要紧。」老周笑了笑没强求。道德+3。",
              "info",
            );
          },
        },
        {
          text: "💡 拉同事一起研究公司期权",
          hint: "职场声誉+[PLACEHOLDER]（更高），深度绑定",
          apply: function (st) {
            st.flags._colleagueInvestClub = true;
            if (st.player.corporate) {
              st.player.corporate.upwardMgmt = Math.min(
                100,
                (st.player.corporate.upwardMgmt || 50) +
                  8 /*[PLACEHOLDER] 职场声誉增益（深）*/,
              );
            }
            st.flags._equityTalkActive = true;
            StateManager.addMessage(
              "💡 你把话题引到公司期权上，几个人当场算起账来。懂行权、懂套现，是职场人的另一门必修课。职场声誉+8。",
              "success",
            );
          },
        },
      ],
    },

    // ===== ④ E→D：投资盈利→NPC注意到你的变化（社交溢出）=====
    {
      id: "investment_profit_npc_attention",
      phase: "street",
      icon: "💰",
      title: "钱多了，朋友的眼神也变了",
      story:
        "这几个月账户红了又绿，但总体是赚的。你换了部新手机，穿了件像样的外套。\n\n朋友聚会时，有人不经意多看了你两眼。「你现在看着不像当初那个打零工的了。」\n\n钱不一定让人快乐，但确实改变了别人看你的方式。",
      triggers: { minDay: 90, excludeFlags: ["_profitNpcAttention"] },
      conditions: function (st) {
        var inv = st.investment;
        if (!inv) return false;
        var holds =
          (inv.stockHoldings && inv.stockHoldings.length > 0) ||
          inv.btcHoldings > 0;
        if (!holds) return false;
        var rels = st.relationships || {};
        return Object.keys(rels).some(function (k) {
          var r = rels[k];
          return r && r.met && (r.affinity || 0) >= 10;
        });
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🤝 请朋友们吃顿好的",
          hint: "花钱买开心，NPC好感+3~5",
          apply: function (st) {
            st.flags._profitNpcAttention = true;
            var npcId = pickClosestMetNpc(st);
            if (npcId && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, npcId, 3, "投资盈利·请客吃饭");
            }
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage("🤝 你请朋友们吃了顿好的。钱花在值得的地方，比存在账户里更有意义。心情+5。", "success");
          },
        },
        {
          text: "😏 保持低调，不声张",
          hint: "低调行事，避免嫉妒",
          apply: function (st) {
            st.flags._profitNpcAttention = true;
            st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
            StateManager.addMessage("😏 你没显摆，日子该怎么过还怎么过。低调是金。道德+2。", "info");
          },
        },
      ],
    },

    // ===== ⑤ E→G：巨额投资亏损→经济焦虑心理事件=====
    {
      id: "investment_loss_anxiety",
      phase: "street",
      icon: "📉",
      title: "账户绿到让你睡不着",
      story:
        "今天你打开投资软件，发现持仓又绿了。算了一下，这笔钱够交三个月房租。\n\n你开始怀疑自己：到底是该继续持有等反弹，还是赶紧割肉保住本金？\n\n失眠的那晚，你终于明白——投资最大的敌人不是市场，是自己。",
      triggers: { minDay: 60, excludeFlags: ["_invLossAnxiety"] },
      conditions: function (st) {
        var inv = st.investment;
        if (!inv) return false;
        var holds = inv.stockHoldings || [];
        if (holds.length === 0) return false;
        var totalPL = 0;
        for (var i = 0; i < holds.length; i++) {
          var h = holds[i];
          var m = inv.stockMarket && inv.stockMarket[h.symbol];
          if (m && m.price && h.avgPrice) {
            totalPL += (m.price - h.avgPrice) * (h.shares || 0);
          }
        }
        return totalPL < -10000; // [PLACEHOLDER] 浮亏超过¥10000触发
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "🧘 深呼吸，接受亏损是投资的一部分",
          hint: "心智+5，心情-2",
          apply: function (st) {
            st.flags._invLossAnxiety = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
            StateManager.addMessage("🧘 你接受了亏损的现实。投资第一课：市场永远比你聪明。心智+5。", "info");
          },
        },
        {
          text: "📖 停下来学习，补补投资知识",
          hint: "finance技能+8，心智+3",
          apply: function (st) {
            st.flags._invLossAnxiety = true;
            if (typeof addSkillXp === "function") addSkillXp("finance", 8);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            StateManager.addMessage("📖 你翻出了《聪明的投资者》，决心把亏的钱变成学费。finance+8。", "good");
          },
        },
        {
          text: "😤 不管了，反正也不是真钱",
          hint: "心情+3，但可能错失止损时机",
          apply: function (st) {
            st.flags._invLossAnxiety = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage("😤 你关掉了软件。眼不见为净——反正浮亏不是真亏。心情+3。", "warning");
          },
        },
      ],
    },

    // ===== ⑥ E→D：财富税触发→NPC间的经济话题=====
    {
      id: "wealth_tax_npc_conversation",
      phase: "corporate",
      icon: "🏛️",
      title: "收到财富税通知的那天",
      story:
        "你收到了一条银行短信：「您的财富税已扣除¥X,XXX。」\n\n中午和同事吃饭，有人提起最近涨的税。有人说该转移资产，有人说这是共同富裕。\n\n你忽然意识到：当你开始被收财富税的时候，说明你已经不是一般打工人了。",
      triggers: { minDay: 180, excludeFlags: ["_wealthTaxNpc"] },
      conditions: function (st) {
        var settlement = st._economySettlement;
        if (!settlement || !settlement.activeTaxTier) return false;
        return settlement.wealthTax > 0;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🤝 融入规则，学习税务筹划",
          hint: "心智+4，finance技能+5",
          apply: function (st) {
            st.flags._wealthTaxNpc = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof addSkillXp === "function") addSkillXp("finance", 5);
            st.flags._taxPlanning = true;
            StateManager.addMessage("🤝 你没有抱怨，而是开始研究税务筹划。这是富人必修的课。心智+4，finance+5。", "good");
          },
        },
        {
          text: "💬 和同事聊聊资产配置",
          hint: "职场声誉+3，社交加深",
          apply: function (st) {
            st.flags._wealthTaxNpc = true;
            if (st.player.corporate) {
              st.player.corporate.upwardMgmt = Math.min(100, (st.player.corporate.upwardMgmt || 50) + 3);
            }
            StateManager.addMessage("💬 你和几个同事讨论了资产配置的不同思路。信息差就是财富差。职场声誉+3。", "success");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < ECON_EVENTS.length; i++) {
    RANDOM_EVENTS.push(ECON_EVENTS[i]);
  }
})();

/*
 * 城市浮生记 — 域E（经济/投资）联动增强事件 · R27（第二轮）
 * v3.118 · loop 全系统优化·Domain E 经济/投资 → 跨域桥接
 *
 * 设计约束（与 R11/R15/R18/R23/R26 一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || / isFinite 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件每个事件显式注册 street + corporate 两个变体（共享去重 flag，不会跨阶段双发）。
 *  - 投资组合市值复用全局 getInvestmentAssetSnapshot(st).investmentValue（与引擎/UI 同源，
 *    避免重算导致口径漂移）；净值镜像 data_linkage_events.js 的 netWorthA（现金+存款+投资市值）。
 *  - 本次聚焦「经济成就 ↔ 职场圈层」(E→C) 与「组合回撤 ↔ 损失厌恶叙事」(E→B) 两段此前空白。
 *
 * 与既有 E 域事件不重复说明：
 *  - invest_acumen_career(E→C) 是「盘感→会计技能 XP」；本 R27 的 econ_career_invest_unlock(E→C)
 *    是「净值/职级达门槛→被私募圈层邀请跟投，给真实现金+管理技能」，触发前提与收益均不同。
 *  - invest_drawdown_moral(E→B) 是「单只持仓浮亏>10%」；本 R27 的 econ_portfolio_drawdown(E→B)
 *    是「组合市值自历史峰值回撤≥20%」（峰终定律/损失厌恶），是更宏观的回撤叙事，互不构成冗余。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._econLinkageR27Loaded) return;
  RANDOM_EVENTS._econLinkageR27Loaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 投资组合市值（现金等价物以外的投资仓位），复用引擎全局快照，口径一致
  function portfolioValueR27(st) {
    try {
      if (typeof getInvestmentAssetSnapshot === "function") {
        var snap = getInvestmentAssetSnapshot(st);
        if (snap && isFinite(snap.investmentValue)) return snap.investmentValue;
      }
    } catch (e) {
      /* 忽略 */
    }
    return 0;
  }

  // 净资产（镜像 netWorthA：现金 + 银行存款 + 投资市值）
  function netWorthR27(st) {
    try {
      var nw = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
      return nw + portfolioValueR27(st);
    } catch (e) {
      return 0;
    }
  }

  // 是否已踏入投资门槛（持有一个以上投资标的）——作为经济域联动的触发闸门
  function isInvestorR27(st) {
    if (!st || !st.investment) return false;
    var h = st.investment.stockHoldings;
    return Array.isArray(h) && h.length >= 1;
  }

  // 安全改心情（兜底直写，避免依赖可能不存在的全局助手）
  function moodR27(st, delta) {
    if (!st || !st.needs) return;
    st.needs.happiness = Math.max(
      0,
      Math.min(100, (st.needs.happiness || 50) + delta),
    );
  }

  // ---- 事件定义 ----

  // ===== E→C：财富/职级立足 → 私募跟投圈层（经济成就反哺职场圈层）=====
  function careerUnlockCond(st) {
    if (!st || !st.player || !st.resources) return false;
    if (st.flags && st.flags._careerInvestUnlocked) return false; // 一次性
    if (netWorthR27(st) >= 200000) return true; // [PLACEHOLDER] 净值门槛
    // 职场期：职级达 P6 及以上（中层）也被圈层注意到
    if (
      st.player.phase === "corporate" &&
      st.corporate &&
      ["P6", "P7", "P8", "P9", "P10"].indexOf(st.corporate.rank) >= 0
    )
      return true;
    return false;
  }

  function careerUnlockApply(st, accept) {
    try {
      if (st.flags) st.flags._careerInvestUnlocked = true; // 无论接受与否都锁定一次性
      if (accept) {
        // 真实收益：圈层跟投首笔分红（现金）+ 管理技能（职场硬技能）兑现
        if (st.resources) st.resources.cash = (st.resources.cash || 0) + 30000; // [PLACEHOLDER] 跟投首笔分红
        if (st.skills)
          st.skills.management = Math.min(
            100,
            (st.skills.management || 0) + 3, // [PLACEHOLDER] 管理技能加成
          );
        if (st.player) st.player.mental = (st.player.mental || 50) + 4;
        moodR27(st, 3);
        if (typeof StateManager !== "undefined" && StateManager.addMessage)
          StateManager.addMessage(
            "圈层递来跟投的橄榄枝——钱生钱之外，你也成了「被看见」的人。现金+¥30000，管理+3。",
            "success",
          );
      } else {
        if (st.player) st.player.mental = (st.player.mental || 50) + 1;
        if (typeof StateManager !== "undefined" && StateManager.addMessage)
          StateManager.addMessage(
            "你婉拒了圈层邀请，先把眼前的事做扎实。心智+1。",
            "info",
          );
      }
    } catch (e) {
      /* 静默：任一奖励失败都不应阻断每日管线 */
    }
  }

  // ===== E→B：组合市值自峰值回撤 ≥20% → 损失厌恶叙事化（峰终定律）=====
  function drawdownCond(st) {
    if (!st || !st.player) return false;
    if (!isInvestorR27(st)) return false;
    var inv = st.investment || {};
    var cur = portfolioValueR27(st);
    if (!(cur > 0)) return false;
    // 峰值追踪（每日更新，幂等）：创新高当天不触发，等回撤
    if (!(inv._portfolioPeak > 0) || cur > inv._portfolioPeak) {
      inv._portfolioPeak = cur;
      return false;
    }
    if (cur > inv._portfolioPeak * 0.8) return false; // [PLACEHOLDER] 回撤阈值 20%
    // 仅在新低时触发（避免同一轮下跌反复敲击）
    var lastLow = (st.flags && st.flags._econLastDrawdownValue) || Infinity;
    if (!(cur < lastLow)) return false;
    // 30 天冷却
    if (
      st.flags &&
      typeof st.flags._econPeakDrawdownDay === "number" &&
      st.player.day - st.flags._econPeakDrawdownDay < 30 // [PLACEHOLDER] 冷却天数
    )
      return false;
    return true;
  }

  function drawdownApply(st, action) {
    try {
      var inv = st.investment || {};
      if (st.flags) {
        st.flags._econPeakDrawdownDay = st.player.day;
        st.flags._econLastDrawdownValue = portfolioValueR27(st);
      }
      if (action === "cut") {
        // 割肉止损：卖掉一半 BTC，落袋为安，但心情受挫
        if ((inv.btcHoldings || 0) > 0 && (inv.btcPrice || 0) > 0) {
          var half = inv.btcHoldings / 2;
          var proceeds = half * inv.btcPrice;
          inv.btcHoldings = inv.btcHoldings - half;
          if (!isFinite(inv.btcHoldings)) inv.btcHoldings = 0;
          if (st.resources)
            st.resources.cash = (st.resources.cash || 0) + proceeds;
        }
        moodR27(st, -4); // [PLACEHOLDER] 割肉心情惩罚
        if (typeof StateManager !== "undefined" && StateManager.addMessage)
          StateManager.addMessage(
            "你按下卖出键，账户不再滴血——但那种抽离感，半天没缓过来。心情-4。",
            "warning",
          );
      } else if (action === "add") {
        // 逆势加仓：用 ≤¥50000 预算抄底 BTC
        var budget = Math.min(50000, st.resources ? st.resources.cash || 0 : 0); // [PLACEHOLDER] 加仓预算
        if (budget > 0 && (inv.btcPrice || 0) > 0) {
          if (st.resources)
            st.resources.cash = (st.resources.cash || 0) - budget;
          inv.btcHoldings = (inv.btcHoldings || 0) + budget / inv.btcPrice;
        }
        moodR27(st, -2); // [PLACEHOLDER] 抄底焦虑
        if (typeof StateManager !== "undefined" && StateManager.addMessage)
          StateManager.addMessage(
            "别人恐惧你贪婪——你又补了点仓，赌的是反转，押上的是神经。心情-2。",
            "info",
          );
      } else {
        // 装死：什么也不做，但账户绿得发慌
        moodR27(st, -6); // [PLACEHOLDER] 躺平心情惩罚
        if (typeof StateManager !== "undefined" && StateManager.addMessage)
          StateManager.addMessage(
            "你关掉软件，假装什么都没发生。可夜里翻来覆去，全是绿油油的数字。心情-6。",
            "warning",
          );
      }
    } catch (e) {
      /* 静默 */
    }
  }

  var ECON_R27_EVENTS = [
    // ---- E→C：财富/职级立足 → 私募跟投圈层 ----
    {
      id: "econ_career_invest_unlock_street",
      title: "圈层递来的橄榄枝",
      desc: "你资产摸到某个 invisible 门槛后，忽然有人引荐你进一个「低调却精明」的私募饭局。席间没人谈股票代码，谈的是谁拿到了哪轮份额。\n\n你意识到：钱到了一定量级，机会会自己找上门。",
      phase: "street",
      triggers: { minDay: 120 },
      conditions: careerUnlockCond,
      probability: 0.05,
      choices: [
        {
          text: "接住这层关系，跟投一笔",
          apply: function (st) {
            careerUnlockApply(st, true);
          },
        },
        {
          text: "先观望，不急着入场",
          apply: function (st) {
            careerUnlockApply(st, false);
          },
        },
      ],
    },
    {
      id: "econ_career_invest_unlock_corporate",
      title: "中层之后的「隐形人脉」",
      desc: "升到 P6 这道坎，你发现周报之外另有圈子——饭局、内推、跟投名额，都悄悄流向「已被认可」的人。\n\n一位前辈拍拍你肩：「下次有好项目，带你一个。」",
      phase: "corporate",
      triggers: { minDay: 120 },
      conditions: careerUnlockCond,
      probability: 0.05,
      choices: [
        {
          text: "跟紧这层关系，接下跟投",
          apply: function (st) {
            careerUnlockApply(st, true);
          },
        },
        {
          text: "先把手头业务做扎实",
          apply: function (st) {
            careerUnlockApply(st, false);
          },
        },
      ],
    },

    // ---- E→B：组合市值自峰值回撤 ≥20% → 损失厌恶叙事化 ----
    {
      id: "econ_portfolio_drawdown_street",
      title: "账户从最高点摔下来的那天",
      desc: "你曾盯着账户笑过。如今它从峰值跌去两成，绿得刺眼。手指悬在键盘上——割肉、加仓、还是装死？\n\n这一刻你才懂，真正考验人的从来不是上涨。",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: drawdownCond,
      probability: 0.04,
      choices: [
        {
          text: "🔪 割肉止损，落袋为安",
          apply: function (st) {
            drawdownApply(st, "cut");
          },
        },
        {
          text: "📈 逆势加仓，赌个反转",
          apply: function (st) {
            drawdownApply(st, "add");
          },
        },
        {
          text: "😶 关掉软件，装死",
          apply: function (st) {
            drawdownApply(st, "hold");
          },
        },
      ],
    },
    {
      id: "econ_portfolio_drawdown_corporate",
      title: "职场顺风顺水，账户却在褪色",
      desc: "职级往上走，工资涨了，可你那笔悄悄布局的投资正从高位滑落两成。白天你在会议室谈笑，夜里却盯着绿油油的曲线发呆。\n\n割肉、加仓、还是装死？",
      phase: "corporate",
      triggers: { minDay: 90 },
      conditions: drawdownCond,
      probability: 0.04,
      choices: [
        {
          text: "🔪 割肉止损，落袋为安",
          apply: function (st) {
            drawdownApply(st, "cut");
          },
        },
        {
          text: "📈 逆势加仓，赌个反转",
          apply: function (st) {
            drawdownApply(st, "add");
          },
        },
        {
          text: "😶 关掉软件，装死",
          apply: function (st) {
            drawdownApply(st, "hold");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < ECON_R27_EVENTS.length; i++) {
    RANDOM_EVENTS.push(ECON_R27_EVENTS[i]);
  }
})();

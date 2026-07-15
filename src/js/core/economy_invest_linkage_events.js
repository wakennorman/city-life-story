/*
 * 城市浮生记 — 域E（经济/投资）联动增强事件
 * v3.108 · loop R18 全系统优化·Domain E 经济/投资→跨域桥接
 *
 * 设计约束（与 R11 economy / R12 lifecycle / R13 company / R14 data / R16 career / R17 域D 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 覆盖两种人生阶段。
 *  - E→D 社交桥接严格遵守域D架构铁律：只读 state.relationships；引用 NPC 须 rel && rel.met；
 *    跨 NPC 好感传导一律走 applyAffinityChange（自动 clamp + 记 _lastInteractionDay + 升级播报）。
 *  - 经济桥接复用 R14 的投资者心态 flag `st.flags._dataInvestorMindset`（数据/经济域共享），
 *    以及真实的 `state.investment` 容器（stockHoldings / stockMarket 均属实字段）。
 *  - 里程碑/冷却用 st.flags._xxxCooldown 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._econInvestLinkageLoaded) return;
  RANDOM_EVENTS._econInvestLinkageLoaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 是否已踏入投资门槛（持有一个以上投资标的）——作为经济域联动的触发闸门
  function isInvestorE(st) {
    if (!st || !st.investment) return false;
    var h = st.investment.stockHoldings;
    return Array.isArray(h) && h.length >= 1;
  }

  // 取已结识且好感达阈值的 NPC 列表（域D铁律：须 rel && rel.met）
  function getMetNpcsE(st, minAff) {
    minAff = minAff || 0;
    var out = [];
    if (!st || !st.relationships) return out;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff)
        out.push({ id: id, rel: r });
    }
    return out;
  }

  // 安全改好感：优先全局 applyAffinityChange，否则兜底直写（域D铁律）
  function safeAffinityE(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域E联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // ---- 域E 联动事件 ----

  var ECON_EVENTS = [
    // ===== E→A：投资里程碑 ↔ 数值/心智（状态刷新 + 投资者心态） =====
    {
      id: "invest_milestone_mindset",
      title: "账户里第一次有了「钱生钱」的底气",
      desc: "某天你点开投资账户，发现那笔被你忘记的持仓竟悄悄涨了一截。不是大钱，但那种「钱在替你干活」的感觉，让紧绷的肩背松了一点。",
      phase: "street",
      triggers: { minDay: 80 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._investMilestoneCooldown) return false;
        if (!isInvestorE(st)) return false; // 须已持有一个以上投资标的
        return true;
      },
      choices: [
        {
          text: "把这份踏实感记在心里，继续稳健",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 5; // [PLACEHOLDER] 心智回馈
            if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 4; // [PLACEHOLDER] 心情
            if (st.flags) {
              st.flags._investMilestoneCooldown = true;
              st.flags._dataInvestorMindset = true; // 复用 R14 data_savings_milestone 投资者心态 flag
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "财务上的第一份「余裕」，悄悄改善了你的状态。",
                "good",
              );
          },
        },
        {
          text: "乐呵一下，该干嘛干嘛",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._investMilestoneCooldown = true;
          },
        },
      ],
      probability: 0.05,
    },

    // ===== E→C：盘感 ↔ 职业/成长（金融洞察转化为职场硬技能） =====
    {
      id: "invest_acumen_career",
      title: "看盘练出的那点「数字直觉」",
      desc: "盯了许久行情，你渐渐能嗅出报表里的门道。某次部门例会，你随口点出的成本异常，让主管高看了一眼——原来投资练出的盘感，也能用在班上。",
      phase: "street",
      triggers: { minDay: 100 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._investAcumenCooldown) return false;
        if (!isInvestorE(st)) return false;
        return true;
      },
      choices: [
        {
          text: "把这份洞察沉淀成能力",
          apply: function (st) {
            // C域桥接：金融盘感转化为会计/财务技能（accounting 为职业体系真实技能键）
            if (typeof addSkillXp === "function") addSkillXp("accounting", 8); // [PLACEHOLDER] 财务技能XP
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.flags) st.flags._investAcumenCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "投资练出的数字直觉，成了职场上实打实的加分项。",
                "good",
              );
          },
        },
        {
          text: "只是运气好，别当真",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._investAcumenCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== E→D：落袋为安后请朋友一顿 ↔ NPC/社交（经济反哺人情） =====
    {
      id: "invest_treat_friend",
      title: "一笔小赚，想请那个总帮你的朋友吃顿饭",
      desc: "账户里那笔收益落袋，你下意识想起一直照应你的朋友。赚钱的快乐若没人分享，好像也就那样——不如趁热请一顿，把好事说开。",
      phase: "corporate",
      triggers: { minDay: 120 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._investTreatCooldown) return false;
        if (!isInvestorE(st)) return false;
        // 至少一个"聊得来的圈内人"(好感≥25)的已结识 NPC
        if (!getMetNpcsE(st, 25).length) return false;
        return true;
      },
      choices: [
        {
          text: "大方请客，好好谢谢你朋友",
          apply: function (st) {
            // D域桥接：经济宽裕反哺人情（域D铁律：跨NPC好感走 applyAffinityChange）
            var npc = getMetNpcsE(st, 25)[0];
            if (npc) safeAffinityE(st, npc.id, 6, "投资小赚·请客致谢");
            // 请客花销从现金扣除（真实字段 state.resources.cash）
            if (st.resources)
              st.resources.cash = Math.max(
                0,
                (st.resources.cash || 0) - 800, // [PLACEHOLDER] 一顿饭的成本
              );
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 3;
            if (st.flags) st.flags._investTreatCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("钱赚到了，情谊也更近了一步。", "good");
          },
        },
        {
          text: "心里记着，下次再谢",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._investTreatCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== E→B：投资亏损后的心理事件（损失厌恶叙事化）=====
    {
      id: "invest_drawdown_moral",
      title: "账户绿得发慌的那一周",
      desc: '连续三天跌，持仓浮亏超过¥3000。你盯着屏幕，手指悬在"全部卖出"按钮上——要么割肉认栽，要么死扛到底。\n\n这种时候你才真正理解什么叫"市场有风险"。',
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._drawdownMoralCooldown) return false;
        if (!isInvestorE(st)) return false;
        // 检查是否有持仓亏损（浮亏>10%）
        var inv = st.investment;
        if (!inv || !inv.stockHoldings) return false;
        for (var i = 0; i < inv.stockHoldings.length; i++) {
          var h = inv.stockHoldings[i];
          var m = inv.stockMarket && inv.stockMarket[h.symbol];
          if (m && m.price && h.avgPrice) {
            var pnl = (m.price - h.avgPrice) / h.avgPrice;
            if (pnl < -0.1) return true; // 浮亏>10%
          }
        }
        return false;
      },
      choices: [
        {
          text: "🔪 割肉止损，保住本金",
          apply: function (st) {
            if (st.flags) st.flags._drawdownMoralCooldown = true;
            // 卖出亏损最多的持仓
            var inv = st.investment;
            if (inv && inv.stockHoldings) {
              var worstSym = null;
              var worstPnl = 0;
              for (var i = 0; i < inv.stockHoldings.length; i++) {
                var h = inv.stockHoldings[i];
                var m = inv.stockMarket && inv.stockMarket[h.symbol];
                if (m && m.price && h.avgPrice && h.shares > 0) {
                  var pnl = (m.price - h.avgPrice) / h.avgPrice;
                  if (pnl < worstPnl) {
                    worstPnl = pnl;
                    worstSym = h.symbol;
                  }
                }
              }
              if (worstSym && typeof sellInvStock === "function") {
                var shares =
                  (
                    inv.stockHoldings.find(function (h) {
                      return h.symbol === worstSym;
                    }) || {}
                  ).shares || 0;
                sellInvStock(worstSym, shares);
              }
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "止损虽痛，但活下来才有下一次机会。心智+3。",
                "warning",
              );
          },
        },
        {
          text: "💪 死扛到底，相信基本面",
          apply: function (st) {
            if (st.flags) st.flags._drawdownMoralCooldown = true;
            if (st.player) st.player.mental = (st.player.mental || 50) + 5;
            if (st.needs)
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你选择了相信自己的判断，暂时不动。心情-5，但心智+5——坚持也是一种能力。",
                "info",
              );
          },
        },
        {
          text: "📚 趁此机会学习投资知识",
          apply: function (st) {
            if (st.flags) st.flags._drawdownMoralCooldown = true;
            if (typeof addSkillXp === "function") addSkillXp("finance", 10);
            if (st.player) st.player.mental = (st.player.mental || 50) + 4;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "亏损是最好的老师。你翻开《股票作手回忆录》， finance+10。",
                "good",
              );
          },
        },
      ],
      probability: 0.03,
    },

    // ===== E→D：NPC推荐投资机会（社交反哺经济）=====
    {
      id: "npc_invest_tip",
      title: '朋友推荐的"内部消息"',
      desc: "你常联系的某个朋友突然发消息：「我这边有个靠谱的项目，据说近期有大动作，要不要一起看看？」\n\n投资机会往往来自人脉——但也可能来自陷阱。",
      phase: "street",
      triggers: { minDay: 100 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._npcInvestTipCooldown) return false;
        if (!isInvestorE(st)) return false;
        // 至少一个已结识NPC（好感≥15）
        var rels = st.relationships || {};
        for (var id in rels) {
          if (rels[id] && rels[id].met && (rels[id].affinity || 0) >= 15)
            return true;
        }
        return false;
      },
      probability: 0.03,
      choices: [
        {
          text: "🤝 认真了解这个机会",
          apply: function (st) {
            if (st.flags) st.flags._npcInvestTipCooldown = true;
            // 随机选择一个已结识NPC
            var npcId = null;
            var rels = st.relationships || {};
            var candidates = [];
            for (var id in rels) {
              if (rels[id] && rels[id].met && (rels[id].affinity || 0) >= 15) {
                candidates.push(id);
              }
            }
            if (candidates.length > 0) {
              npcId = candidates[Math.floor(Math.random() * candidates.length)];
              if (typeof applyAffinityChange === "function") {
                applyAffinityChange(st, npcId, 2, "投资机会分享");
              }
            }
            // 机会分好坏：70%正面/30%陷阱
            var isGood = Math.random() > 0.3;
            if (isGood) {
              if (typeof addSkillXp === "function") addSkillXp("finance", 5);
              if (st.player) st.player.mental = (st.player.mental || 50) + 3;
              if (
                typeof StateManager !== "undefined" &&
                StateManager.addMessage
              )
                StateManager.addMessage(
                  "朋友的推荐确实有价值！finance+5，心智+3。" +
                    (npcId
                      ? " [" +
                        (npcId.charAt(0).toUpperCase() + npcId.slice(1)) +
                        "] "
                      : ""),
                  "good",
                );
            } else {
              if (st.player)
                st.player.morality = Math.max(
                  0,
                  (st.player.morality || 50) - 3,
                );
              if (st.needs)
                st.needs.happiness = Math.max(
                  0,
                  (st.needs.happiness || 50) - 8,
                );
              if (
                typeof StateManager !== "undefined" &&
                StateManager.addMessage
              )
                StateManager.addMessage(
                  "这次推荐不太靠谱…你意识到不能盲目听信。道德-3，心情-8。",
                  "warning",
                );
            }
          },
        },
        {
          text: "🙏 礼貌感谢，婉拒机会",
          apply: function (st) {
            if (st.flags) st.flags._npcInvestTipCooldown = true;
            if (st.player)
              st.player.morality = Math.min(
                100,
                (st.player.morality || 50) + 2,
              );
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你保持了理性，没有盲目跟风。道德+2。",
                "info",
              );
          },
        },
        {
          text: "📊 先做功课再决定",
          apply: function (st) {
            if (st.flags) st.flags._npcInvestTipCooldown = true;
            if (typeof addSkillXp === "function") addSkillXp("finance", 8);
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你花了几天研究相关行业的财报，finance+8。",
                "good",
              );
          },
        },
      ],
    },

    // ===== E→H：公司股权/期权事件（经济×Phase2）=====
    {
      id: "corp_equity_decision",
      title: "公司给了你期权选择",
      desc: "你在公司干得不错，主管找你谈话：「公司最近在推股权激励计划，你有资格参与。行权价 ¥[PLACEHOLDER]，分四年归属。」\n\n这是把双刃剑——涨了大赚，跌了白干。",
      phase: "corporate",
      triggers: { minDay: 200 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._corpEquityCooldown) return false;
        if (st.player.phase !== "corporate") return false;
        // 必须有公司
        if (!st.corporate || !st.corporate.company) return false;
        // 投资系统有持仓（说明玩家已经在关注投资）
        return isInvestorE(st);
      },
      probability: 0.02,
      choices: [
        {
          text: "✅ 接受期权，和公司绑在一起",
          apply: function (st) {
            if (st.flags) {
              st.flags._corpEquityCooldown = true;
              st.flags._hasCorpEquity = true;
              st.flags._equityGrantDay = st.player.day;
            }
            // 消耗现金购买（象征性行权）
            if (st.resources) {
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5000); // [PLACEHOLDER] 行权费
            }
            if (st.player.corporate) {
              st.player.corporate.upward = Math.min(
                100,
                (st.player.corporate.upward || 50) + 8,
              );
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 5;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你签了期权协议，和公司成了利益共同体。职场声誉+8，心智+5。",
                "success",
              );
          },
        },
        {
          text: "📝 先拿纸质offer，再决定",
          apply: function (st) {
            if (st.flags) st.flags._corpEquityCooldown = true;
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你决定先研究透条款再签字。心智+2。",
                "info",
              );
          },
        },
        {
          text: "❌ 拒绝，工资就够了",
          apply: function (st) {
            if (st.flags) st.flags._corpEquityCooldown = true;
            if (st.player)
              st.player.morality = Math.min(
                100,
                (st.player.morality || 50) + 2,
              );
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你选择了简单直接——拿工资走人，不绑期权。道德+2。",
                "info",
              );
          },
        },
      ],
    },
  ];

  for (var i = 0; i < ECON_EVENTS.length; i++) {
    RANDOM_EVENTS.push(ECON_EVENTS[i]);
  }
})();

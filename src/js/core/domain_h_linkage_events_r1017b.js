/**
 * 域H(Phase2/公司) 联动增强 R1017b
 * — H→G 创始人压力体检 / H→E 季度经营账本复盘 / H→C 猎头开价里的自我定价
 *
 * 设计意图：本轮 A类修复把域H 长期「写完就扔」的经营数据接回了主循环
 *   （绩效→自家股价、VC 融资→创始人被换掉的叙事门控、团队月薪→招聘定价、团队专长→季度成长）。
 *   本联动继续吃掉域H 仅剩的三批写-only 数据，把冷冰冰的经营数字翻译成「人」的体感：
 *     ① corp_ops.js:655 `_founderStressLevel`（0~10 压力指数，此前全库零消费方，只有一句提示语）
 *        → 首个真实消费方：压力体检，兑现为健康/心智的真实代价与回报（H→G）。
 *     ② startup.js:3065 `_startupQuarterRevenue/_startupQuarterEmployees/_startupQuarterBurn/_startupQuarterValuation`
 *        与 corp_ops.js `_lastCorpQuarterRevenue/_lastCorpQuarterEmployees/_lastCorpQuarterBurn`
 *        （七个季度快照 flag 全部写-only）→ 首个真实消费方：年度账本复盘，迁移为个人理财意识（H→E）。
 *     ③ 本轮 A类#3 让招聘成本随月薪浮动，玩家第一次亲手为「一个人值多少钱」付账
 *        → 反身投射到自己的市场标价，沉淀管理经验（H→C）。
 *
 * 约束：IIFE 注册 RANDOM_EVENTS；显式 phase:"corporate"；全 || 防御；done-flag 防重复；
 *       真实字段：现金 st.resources.cash / 心智 st.player.mental / 健康 st.status.health /
 *       幸福 st.needs.happiness / 创业公司 st.startup.company / 职场团队 st.corporate.team。
 *       数值一律 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR1017bLoaded) return;
  RANDOM_EVENTS._domainHLinkageR1017bLoaded = true;

  function gx(k, a) {
    if (typeof addSkillXp === "function") {
      try {
        addSkillXp(k, a);
      } catch (e) {}
    }
  }
  function msg(t, k) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      StateManager.addMessage(t, k || "info");
    }
  }
  function num(v, d) {
    return typeof v === "number" && isFinite(v) ? v : d || 0;
  }
  // 七个季度快照 flag 里任取一份「有内容」的经营数据（职场版优先，创业版兜底）
  function quarterSnapshot(st) {
    if (!st || !st.flags) return null;
    var f = st.flags;
    var corpRev = num(f._lastCorpQuarterRevenue, 0);
    var upRev = num(f._startupQuarterRevenue, 0);
    if (corpRev > 0 || num(f._lastCorpQuarterEmployees, 0) > 0) {
      return {
        source: "corp",
        revenue: corpRev,
        employees: num(f._lastCorpQuarterEmployees, 0),
        burn: num(f._lastCorpQuarterBurn, 0),
        valuation: 0,
      };
    }
    if (upRev > 0 || num(f._startupQuarterEmployees, 0) > 0) {
      return {
        source: "startup",
        revenue: upRev,
        employees: num(f._startupQuarterEmployees, 0),
        burn: num(f._startupQuarterBurn, 0),
        valuation: num(f._startupQuarterValuation, 0),
      };
    }
    return null;
  }

  var E = [
    // ① H→G：创始人压力体检 —— _founderStressLevel 的首个真实消费方
    {
      id: "h1017b_founder_stress_checkup",
      phase: "corporate",
      icon: "🩺",
      title: "体检报告上的那行小字",
      story:
        "公司年度体检，你是最后一个进检查室的。\n\n医生翻着报告，抬头看了你一眼：“你这个心率和血压，不像是这个年纪该有的。最近压力很大？”\n\n你想说“还好”，但话到嘴边卡住了。现金流、工资条、下个月的房租、投资人下周要看的数字——它们不是压力，它们是你每天醒来的第一件事。\n\n医生在报告末尾写了一行小字：建议减少持续性应激源。你盯着那行字看了很久。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h1017bStressCheckupDone) return false;
        var lv = num(st.flags && st.flags._founderStressLevel, 0);
        return lv >= 5 && num(st.player.day, 0) >= 90; // [PLACEHOLDER: 压力指数≥5 且第90天后]
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🩺 听医生的，砍掉一部分事情",
          hint: "健康+8, 心智+6, 现金-1500（请人分担）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h1017bStressCheckupDone = true;
            st.flags._h1017bStressManaged = true;
            if (st.status) {
              st.status.health = Math.min(
                100,
                num(st.status.health, 70) + 8,
              ); // [PLACEHOLDER: 健康 +8]
            }
            if (st.player) {
              st.player.mental = Math.min(100, num(st.player.mental, 50) + 6); // [PLACEHOLDER: 心智 +6]
            }
            if (st.resources) {
              st.resources.cash = Math.max(
                0,
                num(st.resources.cash, 0) - 1500,
              ); // [PLACEHOLDER: 请人分担 -1500]
            }
            // 压力指数被真实缓解——写回源 flag，让后续季度结算从更低的基线累积
            st.flags._founderStressLevel = Math.max(
              0,
              num(st.flags._founderStressLevel, 5) - 3,
            ); // [PLACEHOLDER: 压力 -3]
            msg(
              "🩺 你把两件事交了出去。第一次觉得，公司离了你也能转半天。健康+8，心智+6。",
              "success",
            );
          },
        },
        {
          text: "💪 报告收进抽屉，这阵子熬过去再说",
          hint: "健康-5, 心智-4, KPI+3（短期硬扛）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h1017bStressCheckupDone = true;
            st.flags._h1017bStressIgnored = true;
            if (st.status) {
              st.status.health = Math.max(
                1,
                num(st.status.health, 70) - 5,
              ); // [PLACEHOLDER: 健康 -5]
            }
            if (st.player) {
              st.player.mental = Math.max(0, num(st.player.mental, 50) - 4); // [PLACEHOLDER: 心智 -4]
              if (!st.player.corporate) st.player.corporate = {};
              st.player.corporate.kpi = Math.min(
                100,
                num(st.player.corporate.kpi, 20) + 3,
              ); // [PLACEHOLDER: KPI +3]
            }
            st.flags._founderStressLevel = Math.min(
              10,
              num(st.flags._founderStressLevel, 5) + 1,
            );
            msg(
              "💪 你把报告折好放进抽屉。数字漂亮了一点，人差了一点。健康-5，心智-4，KPI+3。",
              "warning",
            );
          },
        },
      ],
    },

    // ② H→E：季度账本复盘 —— 七个季度快照 flag 的首个真实消费方
    {
      id: "h1017b_quarter_ledger_review",
      phase: "corporate",
      icon: "📒",
      title: "把公司的账，读成自己的账",
      story:
        "深夜，你把这几个季度的经营数据拉在一张表里：收入、人头、烧钱速度。\n\n以前你只关心“这个季度过没过”。今晚你第一次把它们连起来看——原来收入的曲线和烧钱的曲线，从来不是同一条节奏。\n\n你忽然想到自己的钱包：每个月进多少、出多少、剩下的那点去了哪里，你居然从来没这么认真算过。\n\n公司的账你算得清清楚楚，自己的账却是一笔糊涂账。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h1017bLedgerReviewDone) return false;
        return !!quarterSnapshot(st) && num(st.player.day, 0) >= 120; // [PLACEHOLDER: 第120天后]
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📒 用同一套方法，给自己也做一张表",
          hint: "会计XP+40, 心智+5, 置_dataInvestorMindset",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h1017bLedgerReviewDone = true;
            st.flags._dataInvestorMindset = true;
            st.flags._h1017bPersonalLedger = true;
            gx("accounting", 40); // [PLACEHOLDER: 会计XP +40]
            if (st.player) {
              st.player.mental = Math.min(100, num(st.player.mental, 50) + 5); // [PLACEHOLDER: 心智 +5]
            }
            var snap = quarterSnapshot(st);
            if (snap) {
              msg(
                "📒 上季经营：营收¥" +
                  Math.round(snap.revenue).toLocaleString() +
                  " · " +
                  snap.employees +
                  "人 · 烧钱¥" +
                  Math.round(snap.burn).toLocaleString() +
                  "。你照着做了一张自己的现金流表。会计EXP+40，心智+5。",
                "success",
              );
            } else {
              msg("📒 你照着公司的口径，给自己做了一张现金流表。会计EXP+40。", "success");
            }
          },
        },
        {
          text: "😮‍💨 公司的账够累了，自己的先算了吧",
          hint: "心情+4（放过自己）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h1017bLedgerReviewDone = true;
            if (st.needs) {
              st.needs.happiness = Math.min(
                100,
                num(st.needs.happiness, 50) + 4,
              ); // [PLACEHOLDER: 心情 +4]
            }
            msg("😮‍💨 你合上电脑。有些账，不算也罢。心情+4。", "info");
          },
        },
      ],
    },

    // ③ H→C：猎头开价里的自我定价 —— 承接本轮 A类#3「招聘成本随月薪浮动」
    {
      id: "h1017b_headhunter_pricing",
      phase: "corporate",
      icon: "🏷️",
      title: "你付过的那笔招聘费",
      story:
        "又一轮招人。你盯着预算表上那个数字发呆——为了一个人，公司愿意先掏出这么多。\n\n然后你想到一个从没想过的问题：如果换成是别人来挖你，他们愿意为你掏多少？\n\n你打开自己的简历，第一次不是以“求职者”的眼光，而是以“买方”的眼光去读它。有几行看起来很唬人，其实不值钱；有几行你一直觉得不值一提，反而是别人最想买的。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h1017bPricingDone) return false;
        var team = st.corporate && st.corporate.team;
        return (
          !!team &&
          team.length >= 2 && // [PLACEHOLDER: 团队≥2人]
          num(st.player.day, 0) >= 100
        );
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🏷️ 按“买方视角”重写一遍简历",
          hint: "管理XP+35, 向上管理+3, 置_h1017bMarketPriced",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h1017bPricingDone = true;
            st.flags._h1017bMarketPriced = true;
            gx("management", 35); // [PLACEHOLDER: 管理XP +35]
            if (st.player) {
              if (!st.player.corporate) st.player.corporate = {};
              st.player.corporate.upwardMgmt = Math.min(
                100,
                num(st.player.corporate.upwardMgmt, 50) + 3,
              ); // [PLACEHOLDER: 向上管理 +3]
            }
            msg(
              "🏷️ 你删掉三行漂亮话，补上两行别人真正在买的东西。管理EXP+35，向上管理+3。",
              "success",
            );
          },
        },
        {
          text: "💼 顺手把团队薪资结构也捋一遍",
          hint: "管理XP+20, 团队忠诚+3, 现金-800",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h1017bPricingDone = true;
            gx("management", 20); // [PLACEHOLDER: 管理XP +20]
            var team = st.corporate && st.corporate.team;
            if (team && team.length > 0) {
              for (var i = 0; i < team.length; i++) {
                if (!team[i]) continue;
                team[i].loyalty = Math.min(
                  100,
                  num(team[i].loyalty, 50) + 3,
                ); // [PLACEHOLDER: 忠诚 +3]
              }
            }
            if (st.resources) {
              st.resources.cash = Math.max(0, num(st.resources.cash, 0) - 800); // [PLACEHOLDER: 请团队吃饭 -800]
            }
            msg(
              "💼 你把每个人的价码摊开来看了一遍，也请大家吃了顿饭。管理EXP+20，团队忠诚+3。",
              "success",
            );
          },
        },
      ],
    },
  ];

  for (var i = 0; i < E.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === E[i].id) {
        exists = true;
        break;
      }
    }
    if (!exists) RANDOM_EVENTS.push(E[i]);
  }
})();

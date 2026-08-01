/**
 * 域A(数据/数值平衡) 联动增强 R1018b — 写-only 数据资产的首次消费
 * 背景（A类审计）：本轮回配套 A类修复已将 job_milestone_events.js 中 18 处死写入
 *   从 state.flags._jobMultipliers 批量迁至活路径 state._jobMultipliers
 *   （main.js 发薪/新闻/基线快照恢复均读活路径；死路径全库零读取 → 废品/摆摊/跑腿等
 *   永久收入增幅×1.05~×1.4 此前全部静默失效，18 处 = 52 次引用一次替换归零）。
 *   同时全库 grep 确认两个写入方持续产出却无人消费的数据：
 *   - economy_v3.1.js:207  state.flags._econHealth       （每月经济健康度快照，全库零消费者）
 *   - daily_pipeline.js:2006 state.flags._wasteRecyclingReady（老张废品承包权重报，全库零消费者）
 * 联动（峰终定律+禀赋效应+损失厌恶）：
 *   A→E   a1018b_econ_health           经济健康度快照 → 数据素养：顺势加仓 vs 稳健存钱
 *   A→E/G a1018b_waste_recycling_handoff 承包权重报 → 兑现废品永久×1.35 + 老周好感（写活路径 _jobMultipliers）
 * 防御：done-flag防重 / ||守卫 / isFinite / 显式phase:"street" / addSkillXp四参真实键(accounting/management) /
 *   真实字段(state.flags._econHealth / _wasteRecyclingReady / state._jobMultipliers / resources.cash / old_zhou关系)
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR1018bLoaded) return;
  RANDOM_EVENTS._domainALinkageR1018bLoaded = true;

  function _gx(k, a) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(k, a); } catch (e) {}
    }
  }
  function _msg(txt, kind) {
    if (typeof StateManager !== "undefined") StateManager.addMessage(txt, kind || "info");
  }
  function _intel(st, n) {
    if (st && st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + n);
  }
  function _mental(st, n) {
    if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 0) + n);
  }
  function _happy(st, n) {
    if (st && st.needs && typeof st.needs.happiness === "number")
      st.needs.happiness = Math.min(100, st.needs.happiness + n);
  }
  function _cash(st) {
    return st && st.resources ? (st.resources.cash || 0) : 0;
  }

  var EVENTS = [
    // ===== 联动1: A→E 经济健康度快照 — 数据素养叙事 =====
    {
      id: "a1018b_econ_health",
      title: "📊 经济健康度报告",
      desc: "报纸上整版的经济数据：税收、贷款、市场饱和度……大多数人扫一眼就翻页，你却停下来多看了一会。",
      phase: "street",
      probability: 0.04,
      maxRepeats: 4,
      cooldown: 45,
      conditions: function (st) {
        if (!st || !st.flags) return false;
        if (st.flags.gameOver) return false;
        if (st.flags._a1018bEconHealthDone) return false;
        if (!st.flags._econHealth || typeof st.flags._econHealth !== "object") return false;
        var h = st.flags._econHealth;
        if (typeof h.day !== "number" || !isFinite(h.day)) return false;
        if (st.flags._a1018bEconHealthCooldown &&
            st.player && typeof st.player.day === "number" &&
            st.flags._a1018bEconHealthCooldown > st.player.day) return false;
        return true;
      },
      choices: [
        {
          text: "💰 数据觉醒：看懂趋势的人先富",
          apply: function (st) {
            var h = st.flags._econHealth || {};
            var tax = typeof h.wealthTax === "number" && isFinite(h.wealthTax) ? h.wealthTax : 0;
            var sat = typeof h.saturationPenalty === "number" && isFinite(h.saturationPenalty) ? h.saturationPenalty : 1;
            _gx("accounting", 8);
            _intel(st, 2);
            _mental(st, 2);
            if (st.flags) st.flags._dataInvestorMindset = true;
            _msg("🧠 你把税负和饱和度的数字在心里过了一遍——「这行的钱没那么好赚了」。会计经验+8，心智+2。", "success");
            if (tax > 500 || sat < 0.8) {
              _msg("⚠️ 数据提醒你：高税负/市场饱和的环境里，扩张不如守成。", "warning");
            }
          },
        },
        {
          text: "🏦 稳健存钱：看不懂就不碰",
          apply: function (st) {
            _intel(st, 1);
            _mental(st, 1);
            _happy(st, 3);
            _msg("🌾 你不懂那些数字，但懂一件事：把赚到的钱存进银行，永远不亏。心智+1，心情+3。", "success");
          },
        },
      ],
      apply: function (st) {
        if (st.flags) {
          st.flags._a1018bEconHealthCooldown = (st.player && st.player.day ? st.player.day : 0) + 45;
        }
      },
    },

    // ===== 联动2: A→E/G 废品承包权重报 — 承诺兑现（写活路径） =====
    {
      id: "a1018b_waste_recycling_handoff",
      title: "♻️ 老张的废品承包权",
      desc: "老周托人带话：「老张那废品站的承包权又开放了，还是老价钱，¥3000。他要收山回老家了，错过这次，怕是没有下回了。」",
      phase: "street",
      probability: 0.06,
      maxRepeats: 1,
      cooldown: 30,
      conditions: function (st) {
        if (!st || !st.flags) return false;
        if (st.flags.gameOver) return false;
        if (st.flags._a1018bWasteHandoffDone) return false;
        return !!st.flags._wasteRecyclingReady;
      },
      choices: [
        {
          text: "🤝 接手承包权（¥3000）",
          apply: function (st) {
            var cash = _cash(st);
            if (cash < 3000) {
              _msg("😓 你想接，但只有¥" + Math.floor(cash) + "，差了¥" + (3000 - Math.floor(cash)) + "。先去赚钱吧。", "warning");
              if (st.flags) {
                st.flags._wasteRecyclingReady = false;
                st.flags._wasteRecyclingOffer = (st.player && st.player.day ? st.player.day : 0) + 15;
              }
              return;
            }
            st.resources.cash = cash - 3000;
            if (!st._jobMultipliers) st._jobMultipliers = {};
            st._jobMultipliers["waste_recycling"] =
              (typeof st._jobMultipliers["waste_recycling"] === "number" &&
               isFinite(st._jobMultipliers["waste_recycling"]) &&
               st._jobMultipliers["waste_recycling"] > 0)
                ? st._jobMultipliers["waste_recycling"] * 1.35
                : 1.35;
            if (st.flags) {
              st.flags.oldZhouReferred = true;
              st.flags.zhouScrapBonus = true;
              st.flags._wasteRecyclingReady = false;
              st.flags._a1018bWasteHandoffDone = true;
            }
            if (typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, "old_zhou", 8, "帮你把废品站承包权谈下来"); } catch (e) {}
            }
            _happy(st, 5);
            _msg("🏆 你接手了老周的版图！废品收入永久+35%，正规回收站已解锁。老周对你的信任又深了一层，心情+5。", "success");
          },
        },
        {
          text: "🙅 先缓缓，以后再说",
          apply: function (st) {
            if (st.flags) {
              st.flags._wasteRecyclingReady = false;
              st.flags._wasteRecyclingOffer = (st.player && st.player.day ? st.player.day : 0) + 30;
            }
            _msg("🤔 你决定先观望。老周点点头：「行，下个月我再看你。」", "info");
          },
        },
      ],
      apply: function (st) {
        if (st.flags && !st.flags._wasteRecyclingReady && !st.flags._a1018bWasteHandoffDone) {
          st.flags._wasteRecyclingOffer = (st.player && st.player.day ? st.player.day : 0) + 30;
        }
      },
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    if (typeof RANDOM_EVENTS.push === "function") RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

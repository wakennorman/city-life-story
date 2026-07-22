/*
 * 城市浮生记 — 域E（经济/投资）联动增强 · R167
 * 全系统优化 loop R167 · 联动增强 2项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR167) return;
  RANDOM_EVENTS._domainELinkageR167 = true;

  // ---- 本地助手 ----

  function safeAffinityR167(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域E R167联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 计算总资产
  function totalAssetsR167(st) {
    if (!st || !st.resources) return 0;
    return (st.resources.cash || 0) + (st.resources.bankBalance || 0);
  }

  // 取累计投资损益
  function totalInvestmentProfitR167(st) {
    if (!st || !st.investment) return 0;
    return (st.investment._totalInvestmentProfit || 0);
  }

  // 取已结识且好感达阈值的NPC列表
  function getMetNpcsR167(st, minAff) {
    if (!st || !st.relationships) return [];
    var out = [];
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff)
        out.push({ id: id, rel: r });
    }
    return out;
  }

  // ---- 联动事件 ----

  var E_EVENTS = [

    // ===== E→B 市场波动生存叙事 =====
    // 设计意图：当玩家经历市场下跌后仍持有资产，触发韧性叙事，
    //   让"持有"这个被动行为变成有情感温度的选择。
    {
      id: "market_storm_endurance",
      title: "风雨中守住仓位",
      desc: "市场最近跌得厉害，你的持仓市值缩水了不少。身边有人在割肉离场，有人在冷嘲热讽。\n\n但你看了看自己当初的投资逻辑——基本面没变，恐慌只是暂时的。你决定……",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player || !st.investment || !st.flags) return false;
        if (st.flags._marketStormEnduranceDone) return false;
        // 有持仓且累计投资亏损
        var profit = totalInvestmentProfitR167(st);
        if (profit >= 0) return false; // 没亏损不触发
        // 投资亏损超过¥5000
        if (profit > -5000) return false;
        return true;
      },
      choices: [
        {
          text: "🧘 坚持持有，相信自己的判断",
          apply: function (st) {
            if (st.flags) st.flags._marketStormEnduranceDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            }
            // 标记：后续投资事件可消费此flag解锁"坚持持有"选项
            if (st.flags) st.flags._marketEnduranceMindset = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "市场恐慌时保持冷静，是投资中最难也最值钱的品质。心智+5，智力+2。",
                "good"
              );
          },
        },
        {
          text: "📉 减仓避险，等市场明朗再说",
          apply: function (st) {
            if (st.flags) st.flags._marketStormEnduranceDone = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "及时止损也是一种智慧。你决定等市场明朗后再入场。智力+4。",
                "info"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== E→D 投资圈层社交 =====
    // 设计意图：当玩家积累了一定投资经验后，NPC开始主动请教投资问题，
    //   让经济能力转化为社交资本——富在深山有远亲。
    {
      id: "investment_social_circle",
      title: "朋友来请教投资经",
      desc: "你的投资成绩在朋友圈里传开了。饭桌上，一位朋友不好意思地开口：\n\n'听说你最近投资做得不错……能不能教教我？我也不求赚大钱，就想让工资别只躺在银行卡里贬值。'\n\n你看着对方期待的眼神，想起了自己当初第一次打开投资界面的样子。",
      phase: "street",
      triggers: { minDay: 80 },
      conditions: function (st) {
        if (!st || !st.player || !st.investment || !st.flags) return false;
        if (st.flags._investmentSocialCircleDone) return false;
        // 累计投资盈利≥¥20000
        var profit = totalInvestmentProfitR167(st);
        if (profit < 20000) return false;
        // 至少1个已结识NPC
        if (getMetNpcsR167(st, 10).length < 1) return false;
        return true;
      },
      choices: [
        {
          text: "🤝 热心分享，带朋友一起入门",
          apply: function (st) {
            if (st.flags) st.flags._investmentSocialCircleDone = true;
            // 给随机NPC加好感
            var met = getMetNpcsR167(st, 10);
            if (met.length > 0) {
              var idx = Random.int(0, met.length - 1);
              safeAffinityR167(st, met[idx].id, 5, "投资指导");
            }
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
              st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (st.flags) st.flags._investmentMentorMindset = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "分享知识是最好的学习。你带朋友入了投资的门，自己也更透彻了。魅力+3，道德+2，心智+3。",
                "good"
              );
          },
        },
        {
          text: "🙏 婉拒，说投资有风险建议谨慎",
          apply: function (st) {
            if (st.flags) st.flags._investmentSocialCircleDone = true;
            if (st.player) {
              st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你不想因为自己的建议让别人亏钱。这种谨慎，也是一种善良。道德+3，心智+2。",
                "good"
              );
          },
        },
      ],
      probability: 0.04,
    },
  ];

  // 注册到 RANDOM_EVENTS
  for (var i = 0; i < E_EVENTS.length; i++) {
    var evt = E_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions) evt.conditions = function () { return false; };
    RANDOM_EVENTS.push(evt);
  }
})();
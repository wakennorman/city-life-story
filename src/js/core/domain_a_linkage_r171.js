/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强 · R171
 * 全系统优化 loop R171 · 联动增强 2项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR171) return;
  RANDOM_EVENTS._domainALinkageR171 = true;

  // ---- 本地助手 ----

  function netWorthR171(st) {
    if (!st || !st.resources) return 0;
    return (st.resources.cash || 0) + (st.resources.bankBalance || 0);
  }

  function metNpcsR171(st) {
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      if (st.relationships[id] && st.relationships[id].met) count++;
    }
    return count;
  }

  function safeAffinityR171(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域A R171联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  var A_EVENTS = [

    // ===== 联动1: A→D NPC财富感知 =====
    // 设计意图：当玩家净资产达到¥50,000时，NPC伙伴注意到玩家的经济状况变化，
    //   让财富积累产生社交反馈，激励玩家继续积累。
    {
      id: "wealth_milestone_npc_notice",
      title: "你的变化，大家都看在眼里",
      desc: "你最近手头宽裕了不少，身边的朋友也注意到了。有人开始向你请教赚钱的门路，也有人半开玩笑地说要抱大腿。",
      phase: "street",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.player || !st.resources || !st.flags) return false;
        if (st.flags._wealthMilestoneNpcNoticeDone) return false;
        // 净资产达到¥50,000
        var nw = netWorthR171(st);
        if (nw < 50000) return false;
        // 至少认识2个NPC
        if (metNpcsR171(st) < 2) return false;
        return true;
      },
      choices: [
        {
          text: "🤝 谦虚回应，分享经验",
          apply: function (st) {
            if (st.flags) st.flags._wealthMilestoneNpcNoticeDone = true;
            // 提升所有已结识NPC的好感
            if (st.relationships) {
              for (var id in st.relationships) {
                if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
                if (st.relationships[id] && st.relationships[id].met) {
                  safeAffinityR171(st, id, 2, "财富分享");
                }
              }
            }
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你谦虚地分享了自己的经验，朋友们对你刮目相看。人脉+2，名气+2，心智+2。",
                "good"
              );
          },
        },
        {
          text: "💼 低调处理，避免露富",
          apply: function (st) {
            if (st.flags) st.flags._wealthMilestoneNpcNoticeDone = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你笑了笑岔开话题，不想让人知道自己的底细。智力+2。",
                "info"
              );
          },
        },
      ],
      probability: 0.05,
    },

    // ===== 联动2: A→D 商贩人情·老顾客折扣 =====
    // 设计意图：高频交易积累的商贩人脉在NPC关系中得到体现，
    //   当玩家在某个市场交易次数足够多时，商贩NPC会主动提供折扣信息。
    {
      id: "trader_favor_discount",
      title: "熟客的隐形福利",
      desc: "你在一家老字号的摊位前停下，老板认出你是常客，悄悄告诉你：'今天进货价低，老顾客给你个内部价。'",
      phase: "street",
      triggers: { minDay: 45 },
      conditions: function (st) {
        if (!st || !st.player || !st.trade || !st.flags) return false;
        if (st.flags._traderFavorDiscountDone) return false;
        // 总交易次数达到一定门槛
        var totalTrades = (st.trade.totalBuys || 0) + (st.trade.totalSells || 0);
        if (totalTrades < 30) return false;
        return true;
      },
      choices: [
        {
          text: "🛒 趁机多买点，囤货慢慢卖",
          apply: function (st) {
            if (st.flags) st.flags._traderFavorDiscountDone = true;
            // 给一个小额现金奖励作为"折扣"
            var discount = Random.int(200, 499);
            st.resources.cash = (st.resources.cash || 0) + discount;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你趁机多进了一批货，老板给了内部价，省了约¥" + discount + "。",
                "success"
              );
          },
        },
        {
          text: "🤝 和老板多聊几句，拉近关系",
          apply: function (st) {
            if (st.flags) st.flags._traderFavorDiscountDone = true;
            // 提升特定NPC好感（如果已结识）
            var marketNpcs = ["aunt_wang", "old_zhou", "xiao_mei", "zhaojie"];
            for (var ni = 0; ni < marketNpcs.length; ni++) {
              if (st.relationships && st.relationships[marketNpcs[ni]] && st.relationships[marketNpcs[ni]].met) {
                safeAffinityR171(st, marketNpcs[ni], 3, "市场人情");
              }
            }
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你和老板聊了很久，了解到不少市场行情。几位老熟人的好感度提升了。",
                "good"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动3: A→B 供需失衡·生活成本感知 =====
    // 设计意图：当玩家经历某种商品价格剧烈波动时，触发生活成本叙事，
    //   让玩家感受到宏观经济对普通人的影响，增强沉浸感。
    {
      id: "supply_demand_life_impact",
      title: "菜价涨了，人心慌了",
      desc: "今天去市场买菜，发现价格比上周贵了不少。旁边的大妈叹了口气：'哎，这日子越过越紧巴了。'你掂了掂手里的钱包，也沉默了。",
      phase: "street",
      triggers: { minDay: 15 },
      conditions: function (st) {
        if (!st || !st.trade || !st.flags) return false;
        if (st.flags._supplyDemandLifeImpactDone) return false;
        if (!st.trade.marketEvents || st.trade.marketEvents.length < 1) return false;
        // 至少有一个事件的价格变动超过30%
        var hasBigImpact = false;
        for (var ei = 0; ei < st.trade.marketEvents.length; ei++) {
          var evt = st.trade.marketEvents[ei];
          if (evt.priceMod >= 1.3 || evt.priceMod <= 0.7) {
            hasBigImpact = true;
            break;
          }
        }
        return hasBigImpact;
      },
      choices: [
        {
          text: "💰 精打细算，调整消费习惯",
          apply: function (st) {
            if (st.flags) st.flags._supplyDemandLifeImpactDone = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你开始记账了，每一笔花销都精打细算。智力+2，心智+1。",
                "good"
              );
          },
        },
        {
          text: "📈 趁机囤货，等涨价再卖",
          apply: function (st) {
            if (st.flags) st.flags._supplyDemandLifeImpactDone = true;
            var 投机收益 = Random.int(100, 299);
            st.resources.cash = (st.resources.cash || 0) + 投机收益;
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你敏锐地嗅到了商机，小赚了一笔¥" + 投机收益 + "。",
                "success"
              );
          },
        },
        {
          text: "😮‍💨 只能忍着，日子还得过",
          apply: function (st) {
            if (st.flags) st.flags._supplyDemandLifeImpactDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你叹了口气，日子还得继续过。心智+1。",
                "info"
              );
          },
        },
      ],
      probability: 0.035,
    },

    // ===== 联动4: A→F 交易次数里程碑·市场嗅觉 =====
    // 设计意图：当累计交易次数达到一定门槛时，玩家获得"市场嗅觉"加成，
    //   在UI提示中体现为更精准的价格预测，鼓励玩家持续参与交易系统。
    {
      id: "trade_milestone_market_sense",
      title: "你的市场嗅觉越来越敏锐了",
      desc: "经过多次买卖的磨练，你对价格波动有了直觉般的判断力。什么时候该进货，什么时候该出手，心里渐渐有了数。",
      phase: "street",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.trade || !st.flags) return false;
        if (st.flags._tradeMilestoneMarketSenseDone) return false;
        var totalTrades = (st.trade.totalBuys || 0) + (st.trade.totalSells || 0);
        if (totalTrades < 50) return false;
        return true;
      },
      choices: [
        {
          text: "📊 认真总结交易经验，形成体系",
          apply: function (st) {
            if (st.flags) st.flags._tradeMilestoneMarketSenseDone = true;
            if (st.skills && st.skills.sales) {
              st.skills.sales.xp = (st.skills.sales.xp || 0) + 80;
            }
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            }
            if (st.flags) st.flags._marketSenseUnlocked = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你总结了一套自己的交易法则，销售经验+80，智力+3。",
                "good"
              );
          },
        },
        {
          text: "🤑 趁着手热，多做大额交易",
          apply: function (st) {
            if (st.flags) st.flags._tradeMilestoneMarketSenseDone = true;
            var bonus = Random.int(300, 799);
            st.resources.cash = (st.resources.cash || 0) + bonus;
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            }
            if (st.flags) st.flags._marketSenseUnlocked = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你趁热打铁，做了一笔漂亮的交易，赚了¥" + bonus + "。名气+2。",
                "success"
              );
          },
        },
      ],
      probability: 0.03,
    },
  ];

  // 注册事件
  for (var i = 0; i < A_EVENTS.length; i++) {
    RANDOM_EVENTS.push(A_EVENTS[i]);
  }

  // 公开引用
  if (typeof window !== "undefined") {
    window._domainALinkageR171 = true;
  }

  // ================================================================
  // [全系统自洽修复] 域A R171补遗: treatCostMonthly首次叙事化 + CERTIFICATE salaryBonus→社交认可
  // 根因分析:
  //   - illnesses.js 多个疾病定义 treatCostMonthly (severe_insomnia:800, heart_attack:600, diabetes:300 等),
  //     illness.js 月度tick静默扣款但零事件有"每月扣病药费"的叙事包装
  //   - CERTIFICATES数组定义了16+本证书的salaryBonus只影响数字,无事件展示"证书带来社会认可"
  // ================================================================

  var _extraA_EVENTS = [

    // ===== 联动5: A→B 慢性病月治疗费通知 =====
    {
      id: "chronic_meds_monthly_notice",
      title: "💊 每月一次的治疗费扣款",
      desc: "医院按月扣除慢性病治疗费用。疾病子系统数据(treatCostMonthly)首次被事件消费。",
      phase: "street",
      repeatable: true,
      cooldownDays: 30,
      priority: 40,
      conditions: function (st) {
        if (!st || !st.status || !st.status.illnesses || !Array.isArray(st.status.illnesses)) return false;
        if (st.flags && st.flags._chronicMedsMonthEnd && (st.player.day || 0) - st.flags._chronicMedsMonthEnd < 30) return false;
        var totalMonthly = 0;
        for (var i = 0; i < st.status.illnesses.length; i++) {
          var illData = typeof getIllnessData === "function" ? getIllnessData(st.status.illnesses[i]) : null;
          if (illData && typeof illData.treatCostMonthly === "number" && illData.treatCostMonthly > 0) {
            totalMonthly += illData.treatCostMonthly;
          }
        }
        return totalMonthly > 0;
      },
      probability: 0.10,
      getText: function (st) {
        var totalMonthly = 0;
        var illnessNames = [];
        for (var i = 0; i < st.status.illnesses.length; i++) {
          var illData = typeof getIllnessData === "function" ? getIllnessData(st.status.illnesses[i]) : null;
          if (illData && typeof illData.treatCostMonthly === "number" && illData.treatCostMonthly > 0) {
            totalMonthly += illData.treatCostMonthly;
            illnessNames.push(illData.name || "疾病");
          }
        }
        return illnessNames.length > 0
          ? "银行短信来了：「您本月" + illnessNames.join("、") + "的治疗费用¥" + totalMonthly.toLocaleString() + "已扣除。」\n\n这病治不好但可以控制，只要按时吃药。"
          : "";
      },
      getStory: function (st) { return this.getText(st) || "每月治疗费正常扣除。"; },
      apply: function (st) {
        if (st.flags) st.flags._chronicMedsMonthEnd = st.player.day;
      },
      choices: [],
      icons: ["💊", "📱"],
    },

    // ===== 联动6: A→C/D 证书社会认可 =====
    {
      id: "cert_social_recognition",
      title: "🎓 同事注意到你的证书",
      desc: "CERTIFICATE salaryBonus数据首次被事件叙事化——证书不只是涨薪工具，也是社交资本。",
      phase: "corporate",
      repeatable: true,
      cooldownDays: 90,
      priority: 55,
      conditions: function (st) {
        if (!st || !st.corporate || !st.corporate.active) return false;
        if (!st.certificates || !Array.isArray(st.certificates) || st.certificates.length < 2) return false;
        if (st.flags && st.flags._certSocialRecogDone) return false;
        var day = st.player.day || 0;
        return day >= 30 && day - (st.corporate.joinedDay || 0) >= 60;
      },
      probability: 0.06,
      getText: function (st) {
        var count = (st.certificates && Array.isArray(st.certificates)) ? st.certificates.length : 0;
        return "新来的实习生看到你桌子上的证书堆，眼睛都直了：「您考了这么多证，真是厉害！」\n\n你笑了笑没说什么，只有你自己知道那些证书背后是多少个熬夜备考的夜晚。（拥有" + count + "个专业资质）";
      },
      getStory: function (st) { return this.getText(st); },
      apply: function (st) {
        if (!st) return;
        st.flags = st.flags || {};
        var c = st.player.corporate;
        if (!c) return;
        c.popularity = Math.min(100, (c.popularity || 0) + 5);
        c.dignity = Math.min(100, (c.dignity || 0) + 3);
        if (st.player) st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
        st.flags._certSocialRecogDone = true;
        StateManager.addMessage("🎓 你的专业资质让同事们刮目相看！人缘+5，尊严+3，道德感+2。", "success");
      },
      choices: [
        { id: "keep_current", text: "😊 谦虚回应，专注工作" },
      ],
      icons: ["🎓", "👏"],
    },
  ];

  for (var ei = 0; ei < _extraA_EVENTS.length; ei++) {
    RANDOM_EVENTS.push(_extraA_EVENTS[ei]);
  }
})();
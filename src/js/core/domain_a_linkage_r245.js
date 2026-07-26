/**
 * 域A(数据/数值平衡) 联动增强 R245
 * 背景：域A A类缺陷经多轮加固(历轮R14/R22/R189/R197/R242/R243)后结构性健康。
 *   本轮仅发现2处：① liver_cancer/sudden_death_risk 重症有naturalCureDays→可自然痊愈与描述矛盾(A类#4)；
 *   ② healthBonus/mentalBonus证书效果键已由main.js:3933-3941 R197修复接通(非新缺陷)。
 * 联动增强3项从A域数据首次被叙事消费方向切入：
 *   A→G  precision_health_narrative — 精确健康报告，首个叙事消费 health/hunger/fatigue卫生三项连续达标flag
 *   A→B  quantified_life — 量化人生的感悟，首个叙事消费 cash/bankBalance/debtRatio 的"资产画像"
 *   A→C  skill_market_insight — 技能市场价格洞察，首个叙事消费 skills.*.level×2+ 的"你的某两项技能组合在城里很抢手"
 *
 * 严格照 domain_b_linkage_r190.js / domain_c_linkage_r191.js / domain_c_linkage_r243.js 已验证范式。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR245Loaded) return;
  RANDOM_EVENTS._domainALinkageR245Loaded = true;

  // 安全读取技能等级
  function skillLv(st, key) {
    if (!st || !st.skills || !st.skills[key]) return 0;
    return st.skills[key].level || 0;
  }

  // 获取玩家所有技能按等级降序排列的前两名
  function topTwoSkills(st) {
    var keys = ["cooking", "repair", "coding", "english", "driving", "sales",
                "management", "accounting", "electrician", "welding", "medicine", "social"];
    var sorted = [];
    for (var i = 0; i < keys.length; i++) {
      var lv = skillLv(st, keys[i]);
      if (lv > 0) sorted.push({ key: keys[i], level: lv });
    }
    sorted.sort(function (a, b) { return b.level - a.level; });
    return sorted.slice(0, 2);
  }

  // 技能中文名映射
  var SKILL_CN = {
    cooking: "厨艺", repair: "维修", coding: "编程", english: "英语",
    driving: "驾驶", sales: "销售", management: "管理", accounting: "会计",
    electrician: "电工", welding: "焊工", medicine: "护理", social: "社交"
  };

  // 计算总资产(现金+存款+投资)
  function getTotalAssets(st) {
    var total = (st.resources && st.resources.cash) || 0;
    if (st.investment) {
      if (st.investment.savings) total += st.investment.savings || 0;
      if (st.investment.stockHoldings) {
        for (var s in st.investment.stockHoldings) {
          if (!Object.prototype.hasOwnProperty.call(st.investment.stockHoldings, s)) continue;
          var h = st.investment.stockHoldings[s];
          if (h) total += (h.shares || 0) * (h.avgPrice || 0);
        }
      }
    }
    return total;
  }

  // 获取负债总额
  function getTotalDebt(st) {
    var debt = 0;
    if (st.resources && st.resources.bankDebt) debt += st.resources.bankDebt || 0;
    if (st.debt && st.debt.village_debt) debt += st.debt.village_debt || 0;
    return debt;
  }

  var EVENTS = [
    {
      // A→G: 精确健康报告 — 首次叙事化消费health/hunger/fatigue持续达标flag
      id: "precision_health_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "身体的账本",
      story:
        "你突然意识到——最近一段时间你过得挺规律的。吃饭准时、睡得够、很少熬夜。身体不会骗人，那些看似不起眼的日常习惯，最终都会反映在你的状态上。",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要至少有一个持续正向的标志
        if (!st.flags) return false;
        // 消费 _goodHabitStreak(规律作息)/_balancedMeals(均衡饮食)/_regularSleep(规律睡眠) 中的任意一个
        return !!((st.flags._goodHabitStreak || st.flags._balancedMeals || st.flags._regularSleep));
      },
      choices: [
        {
          text: "🏃 继续保持好习惯",
          hint: "心智+3,心情+3,置健康自觉flag",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._healthAwareness = true; // [PLACEHOLDER] 后续G域/G→E可消费此flag
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🏃 你对自己的身体负责了——好习惯不是天赋，是选择。心智+3,心情+3。", "success");
          }
        },
        {
          text: "😅 差不多就行了",
          hint: "平静接受,心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._healthAwareness = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😅 你觉得够了就行——健康嘛,别太较真。心智+2。", "info");
          }
        }
      ]
    },
    {
      // A→B: 量化人生 — 资产数字的叙事回响
      id: "quantified_life",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "数字会讲故事",
      story:
        "你算了算自己的钱——存款加上投资，减去欠债，净值为¥{netWorth}。这个数字比刚来这座城市时多了{growthPct}%。你突然明白了什么叫'积少成多'。",
      triggers: { minDay: 60, excludeFlags: ["_quantifiedLifeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var assets = getTotalAssets(st);
        var debt = getTotalDebt(st);
        var netWorth = assets - debt;
        // 总资产≥2000才触发（避免开局几块钱时弹）
        if (assets < 2000) return false;
        return true;
      },
      renderStory: function (st) {
        if (!st) return this.story;
        var assets = getTotalAssets(st);
        var debt = getTotalDebt(st);
        var netWorth = Math.round(assets - debt);
        var growthPct = Math.round((netWorth / Math.max(1, 500)) * 100 - 100); // 假设计划起步¥500
        return this.story.replace("{netWorth}", "¥" + netWorth.toLocaleString()).replace("{growthPct}", growthPct);
      },
      choices: [
        {
          text: "📈 继续攒,朝着目标前进",
          hint: "置理财flag,心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._quantifiedLifeSeen = true;
            // 净资产≥5万置投资意识(供E域消费)
            var netWorth = getTotalAssets(st) - getTotalDebt(st);
            if (netWorth >= 50000) {
              st.flags._dataInvestorMindset = true;
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📈 数字不会说谎——你积累的每一分钱都在为你铺路。心智+3。", "good");
          }
        },
        {
          text: "😊 钱够花就好",
          hint: "心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._quantifiedLifeSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😊 钱够花就行——不贪不多,知足常乐。心情+3。", "info");
          }
        }
      ]
    },
    {
      // A→C: 技能市场价格洞察 — 你的技能组合在市场上值多少钱
      id: "skill_market_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "你的本事值多少钱",
      story:
        "你琢磨了一下自己在城里的两门拿手好戏——{skill1}({lv1}级)和{skill2}({lv2}级)。这两样本事凑一起,在城里可是吃不开的。",
      triggers: { minDay: 45, excludeFlags: ["_skillMarketSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills) return false;
        var top = topTwoSkills(st);
        // 两个真实技能都≥Lv.10才能触发
        return top.length >= 2 && top[1].level >= 10;
      },
      choices: [
        {
          text: "💪 该涨价了",
          hint: "对应技能XP+10,cash+500[PLACEHOLDER]",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._skillMarketSeen = true;
            var top = topTwoSkills(st);
            if (top.length >= 2) {
              if (typeof addSkillXp === "function") {
                try { addSkillXp(top[0].key, 10); } catch(e) { /* safe */ }
              }
            }
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 500; // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "💪 你在城里的行情涨了！" + (SKILL_CN[top[0].key] || top[0].key) + "和" + (SKILL_CN[top[1].key] || top[1].key) + "的双修优势显现。技能XP+10,现金+¥500。",
                "good"
              );
          }
        },
        {
          text: "🤝 低调做事,不急涨价",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._skillMarketSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🤝 你觉得手艺是自己练的,不是别人给的——但心里也明白自己值这个价。心智+2。", "info");
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

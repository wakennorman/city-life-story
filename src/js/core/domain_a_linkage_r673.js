/**
 * 域A(数据/数值平衡) 联动增强 R673
 * 桥接：
 *   A→E  a673_data_driven_invest    数据驱动投资 → 消费 state.trade+state.investment 数据,
 *     交易经验为投资决策提供参考
 *   A→C  a673_skill_market_report    技能市场报告 → 消费 state.skills+STREET_JOBS 数据,
 *     基于市场需求推送技能学习建议
 *   A→H  a673_corp_cost_optimize    公司成本优化 → 消费 state.trade+state.corp 数据,
 *     交易经验为公司采购优化提供建议
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR673Loaded) return;
  RANDOM_EVENTS._domainALinkageR673Loaded = true;

  // 辅助：获取已交易过的商品类别数
  function tradedGoodCategories(st) {
    if (!st || !st.inventory || !st.inventory.items) return 0;
    var cats = {};
    for (var i = 0; i < st.inventory.items.length; i++) {
      var item = st.inventory.items[i];
      var good = typeof getGoodById === "function" ? getGoodById(item.id) : null;
      if (good && good.category) cats[good.category] = true;
    }
    return Object.keys(cats).length;
  }

  // 辅助：获取累计交易利润（单位：档位）
  function tradeProfitLevel(st) {
    if (!st || !st.trade) return 0;
    var tp = st.trade.totalProfit || 0;
    if (tp >= 100000) return 5;
    if (tp >= 50000) return 4;
    if (tp >= 10000) return 3;
    if (tp >= 2000) return 2;
    if (tp >= 500) return 1;
    return 0;
  }

  // 辅助：获取技能市场上最缺的技能
  function getMostWantedSkill(st) {
    if (typeof STREET_JOBS === "undefined" || !Array.isArray(STREET_JOBS)) return null;
    var demand = {};
    for (var i = 0; i < STREET_JOBS.length; i++) {
      var job = STREET_JOBS[i];
      if (!job || !job.requirements) continue;
      for (var reqKey in job.requirements) {
        if (reqKey === "minAge" || reqKey === "maxAge" || reqKey === "educationRequired") continue;
        if (typeof job.requirements[reqKey] === "number") {
          demand[reqKey] = (demand[reqKey] || 0) + 1;
        }
      }
    }
    var best = null, bestCount = 0;
    for (var sk in demand) {
      if (demand[sk] > bestCount) {
        bestCount = demand[sk];
        best = sk;
      }
    }
    return best ? { skill: best, count: bestCount } : null;
  }

  // 辅助：获取技能中文名
  function getSkillDisplayName(skillKey) {
    var map = {
      physique: "体质", agility: "敏捷", intelligence: "智力", mental: "心智",
      charm: "魅力", cooking: "烹饪", repair: "维修", sales: "销售",
      driving: "驾驶", electrician: "电工", welding: "焊接", coding: "编程",
      english: "英语", management: "管理", accounting: "会计",
      medicine: "医学", caregiver: "护理", social: "社交", music: "音乐",
      fitness: "健身", craft: "手工"
    };
    return map[skillKey] || skillKey;
  }

  var EVENTS = [
    {
      id: "a673_data_driven_invest", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据驱动投资",
      story: "你多年倒买倒卖积累的市场直觉，似乎可以用于投资决策——{desc}",
      triggers: { minDay: 90, interval: 180, maxRepeats: 2, excludeFlags: ["_a673InvestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a673InvestCooldown) return false;
        var tpl = tradeProfitLevel(st);
        return tpl >= 2 && st.trade && st.trade.totalProfit >= 2000;
      },
      choices: [
        { text: "📈 分析市场周期", hint: "会计XP+6,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a673InvestCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
          // 标记投资分析加成
          st.flags._dataDrivenInvestor = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '数据不会说谎。' 你运用交易经验分析了市场周期。会计XP+6,智力+3,投资分析能力提升。", "success");
        }},
        { text: "💰 小试牛刀", hint: "销售XP+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a673InvestCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '小步快跑,试错迭代。' 你用小额资金验证了投资想法。销售XP+4,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var tpl = tradeProfitLevel(st);
        var levelLabel = ["", "初窥门径", "略知一二", "驾轻就熟", "炉火纯青", "登峰造极"][tpl] || "驾轻就熟";
        return "你多年倒买倒卖积累的市场直觉,似乎可以用于投资决策——'交易数据(" + levelLabel + ")告诉你,市场有规律可循。'";
      }
    },
    {
      id: "a673_skill_market_report", phase: "street", _isChainEvent: false, icon: "🎯",
      title: "技能市场报告",
      story: "你分析了当前市场上的职业需求数据——{desc}",
      triggers: { minDay: 60, interval: 150, maxRepeats: 3, excludeFlags: ["_a673SkillReportCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a673SkillReportCooldown) return false;
        var tpl = tradeProfitLevel(st);
        return tpl >= 1;
      },
      choices: [
        { text: "📚 针对性学习", hint: "推荐技能XP+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a673SkillReportCooldown = true;
          var wanted = getMostWantedSkill(st);
          var skillKey = wanted ? wanted.skill : "sales";
          if (typeof addSkillXp === "function") {
            try { addSkillXp(skillKey, 8); } catch(e) {
              try { addSkillXp("sales", 8); } catch(e2) {}
            }
          }
          var displayName = getSkillDisplayName(skillKey);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '市场需要什么,就学什么。' 你针对" + displayName + "进行了强化学习。" + displayName + "XP+8。", "success");
        }},
        { text: "🧠 拓宽视野", hint: "智力+4,销售XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a673SkillReportCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧠 '市场瞬息万变,知识是最好的护城河。' 你拓宽了视野。智力+4,销售XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var wanted = getMostWantedSkill(st);
        if (!wanted) return "你分析了市场上的职业需求数据——'目前各技能需求相对均衡,没有明显的热门技能。'";
        var displayName = getSkillDisplayName(wanted.skill);
        return "你分析了当前市场上的职业需求数据——'" + displayName + "(出现在" + wanted.count + "个工作需求中)是目前市场上最紧缺的技能,薪资溢价明显。'";
      }
    },
    {
      id: "a673_corp_cost_optimize", phase: "corporate", _isChainEvent: false, icon: "🏭",
      title: "公司成本优化",
      story: "你多年交易经验让你对公司采购成本格外敏感——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_a673CorpCostDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._a673CorpCostDone) return false;
        var tpl = tradeProfitLevel(st);
        // 需要有公司且交易经验>=3级
        return tpl >= 3 && st.corp && st.corp.name;
      },
      choices: [
        { text: "📋 优化供应链", hint: "管理XP+8,公司效率提升", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a673CorpCostDone = true;
          st.flags._corpSupplyChainOptimized = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 '采购省下的每一分钱都是纯利润。' 你优化了公司供应链。管理XP+8,公司运营成本降低。", "success");
        }},
        { text: "🤝 建立供应商网络", hint: "社交XP+5,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a673CorpCostDone = true;
          if (typeof addSkillXp === "function") {
            try { addSkillXp("management", 3); } catch(e) {}
            try { addSkillXp("social", 5); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '做生意就是做关系。' 你建立了稳定的供应商网络。社交XP+5,管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var tpl = tradeProfitLevel(st);
        var levelLabel = ["", "初窥门径", "略知一二", "驾轻就熟", "炉火纯青", "登峰造极"][tpl] || "驾轻就熟";
        return "你多年交易经验让你对公司采购成本格外敏感——'交易" + levelLabel + "的你,一眼看出供应商报价的水分。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
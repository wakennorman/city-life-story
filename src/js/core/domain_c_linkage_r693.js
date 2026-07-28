/**
 * 域C(职业/成长) 联动增强 R693
 * 桥接：
 *   C→A  c693_skill_market_intel     技能市场情报 → 消费 state.skills+state.trade,
 *     技能等级指导市场分析
 *   C→E  c693_career_invest_diversify 职业投资分散 → 消费 state.employment+state.investment,
 *     职业经验指导投资分散化
 *   C→G  c693_career_anniversary      职业周年 → 消费 state.employment+state.player,
 *     职业节点仪式感(峰终定律)
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR693Loaded) return;
  RANDOM_EVENTS._domainCLinkageR693Loaded = true;

  function topSkill(st) {
    if (!st || !st.skills) return null;
    var best = null, bestLv = -1;
    for (var k in st.skills) {
      var s = st.skills[k];
      if (s && typeof s.level === "number" && s.level > bestLv) {
        bestLv = s.level; best = k;
      }
    }
    return best;
  }

  var EVENTS = [
    {
      id: "c693_skill_market_intel",
      phase: "street",
      _isChainEvent: false,
      icon: "🔍",
      title: "技能带来的市场洞察",
      story: "你的技能让你看懂市场",
      triggers: { minDay: 70, interval: 90, maxRepeats: 3, excludeFlags: ["_c693IntelCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c693IntelCd) return false;
        return topSkill(st) && st.player && st.player.day >= 70;
      },
      choices: [
        {
          text: "📊 分析行业趋势",
          hint: "销售XP+5,智力+3,置_c693Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c693IntelCd = true;
            st.flags._c693Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔍 内行看门道,技能让你看懂市场。销售XP+5,智力+3。", "success");
            }
          }
        },
        {
          text: "💡 分享给同行",
          hint: "社交XP+4,置_c693Share",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c693IntelCd = true;
            st.flags._c693Share = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 知识分享,越分享越有价值。社交XP+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "技能'" + (topSkill(st) || "无") + "'的积累,让你对市场有了独特的洞察——'这就是专业优势。'";
      }
    },
    {
      id: "c693_career_invest_diversify",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "职业经验指导投资",
      story: "你的职业经验可以帮助投资决策",
      triggers: { minDay: 100, interval: 120, maxRepeats: 2, excludeFlags: ["_c693DiversifyCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c693DiversifyCd) return false;
        if (!st.investment) return false;
        var hasInv = (st.investment.stockHoldings && st.investment.stockHoldings.length > 0) ||
                      (st.investment.btcHoldings && st.investment.btcHoldings > 0);
        return hasInv && st.employment && st.employment.currentJob && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "🎯 集中投资熟悉领域",
          hint: "会计XP+5,智力+3,置_c693Concentrate",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c693DiversifyCd = true;
            st.flags._c693Concentrate = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 不懂不投,专注熟悉领域。会计XP+5,智力+3。", "success");
            }
          }
        },
        {
          text: "🌐 分散投资",
          hint: "管理XP+4,置_c693Diversify",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c693DiversifyCd = true;
            st.flags._c693Diversify = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌐 不要把所有鸡蛋放一个篮子里。管理XP+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "做" + (st.employment && st.employment.currentJob && st.employment.currentJob.title ? st.employment.currentJob.title : "这行") + "多年,你考虑把职业经验转化为投资优势——'懂行的人投资,看得更准。'";
      }
    },
    {
      id: "c693_career_anniversary",
      phase: "street",
      _isChainEvent: false,
      icon: "🎉",
      title: "职业周年纪念",
      story: "又一个值得纪念的日子",
      triggers: { minDay: 180, interval: 200, maxRepeats: 2, excludeFlags: ["_c693AnnivCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c693AnnivCd) return false;
        return st.employment && st.employment.currentJob && st.player && st.player.day >= 180;
      },
      choices: [
        {
          text: "🎊 庆祝小成就",
          hint: "心情+10,置_c693Celebrate(峰终定律)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c693AnnivCd = true;
            st.flags._c693Celebrate = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 每一段旅程都值得庆祝!心情+10。", "success");
            }
          }
        },
        {
          text: "🎯 设定新目标",
          hint: "管理XP+5,智力+3,置_c693Goal",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c693AnnivCd = true;
            st.flags._c693Goal = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 里程碑不是终点,是新起点。管理XP+5,智力+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "又一个职业周年纪念日——'回头看,每一步都算数;向前看,路还长。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

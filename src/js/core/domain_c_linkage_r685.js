/**
 * 域C(职业/成长) 联动增强 R685
 * 桥接：
 *   C→A  c685_skill_data_driven      技能数据驱动 → 消费 state.skills+state.trade,
 *     技能等级指导交易决策
 *   C→E  c685_career_invest_mastery  职业投资精通 → 消费 state.employment+state.investment,
 *     职业经验迁移到投资决策
 *   C→G  c685_career_lifecycle       职业生命周期 → 消费 state.employment+state.player,
 *     职业阶段人生节点叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR685Loaded) return;
  RANDOM_EVENTS._domainCLinkageR685Loaded = true;

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
      id: "c685_skill_data_driven",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "技能指导交易",
      story: "你的技能帮你做出更好的交易决策",
      triggers: { minDay: 60, interval: 80, maxRepeats: 3, excludeFlags: ["_c685DataCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c685DataCd) return false;
        return topSkill(st) && st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "📈 用技能分析市场",
          hint: "销售XP+5,智力+2,置_c685Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c685DataCd = true;
            st.flags._c685Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 内行看门道,技能让你看懂市场。销售XP+5,智力+2。", "success");
            }
          }
        },
        {
          text: "🤝 分享给同行",
          hint: "社交XP+4,置_c685Share",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c685DataCd = true;
            st.flags._c685Share = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 知识分享,越分享越有价值。社交XP+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "技能'" + (topSkill(st) || "无") + "'的积累,让你对市场价格有了更敏锐的直觉——'这行我懂,值不值一看就知道。'";
      }
    },
    {
      id: "c685_career_invest_mastery",
      phase: "street",
      _isChainEvent: false,
      icon: "🎓",
      title: "职业经验迁移投资",
      story: "职场的经验可以迁移到投资中",
      triggers: { minDay: 100, interval: 120, maxRepeats: 2, excludeFlags: ["_c685InvestCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c685InvestCd) return false;
        if (!st.investment) return false;
        var hasInv = (st.investment.stockHoldings && st.investment.stockHoldings.length > 0) ||
                      (st.investment.btcHoldings && st.investment.btcHoldings > 0);
        return hasInv && st.employment && st.employment.currentJob && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "🔍 用行业视角选股",
          hint: "会计XP+6,智力+3,置_c685IndustryEdge",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c685InvestCd = true;
            st.flags._c685IndustryEdge = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔍 懂行的人投资,看得更准。会计XP+6,智力+3。", "success");
            }
          }
        },
        {
          text: "⚠️ 谨慎跨界",
          hint: "心智+5,置_c685Cautious",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c685InvestCd = true;
            st.flags._c685Cautious = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("⚠️ 隔行如隔山,谨慎一点总没错。心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "做" + (st.employment && st.employment.currentJob && st.employment.currentJob.title ? st.employment.currentJob.title : "这行") + "多年,你对相关行业的投资有了天然优势——'这就是认知变现。'";
      }
    },
    {
      id: "c685_career_lifecycle",
      phase: "street",
      _isChainEvent: false,
      icon: "🔄",
      title: "职业阶段的人生节点",
      story: "站在职业的节点上,你思考人生的方向",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_c685LifeCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c685LifeCd) return false;
        return st.employment && st.employment.currentJob && st.player && st.player.day >= 150;
      },
      choices: [
        {
          text: "🎯 深耕当前领域",
          hint: "管理XP+6,置_c685Deepen",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c685LifeCd = true;
            st.flags._c685Deepen = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 十年磨一剑,深耕出壁垒。管理XP+6。", "success");
            }
          }
        },
        {
          text: "🌱 考虑转型",
          hint: "智力+5,社交XP+3,置_c685Pivot",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c685LifeCd = true;
            st.flags._c685Pivot = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌱 树挪死人挪活,看看别的可能。智力+5,社交XP+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "工作这么久,你问自己——'这辈子就这样了,还是还有别的可能?'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();

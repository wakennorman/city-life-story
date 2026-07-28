/**
 * 域H(Phase2/公司) 联动增强 R706
 * 桥接：
 *   H→E  h706_corp_cash_invest     公司现金流投资 → 消费 state.startup.company.cashReserve,
 *     公司闲置资金转化为投资建议
 *   H→C  h706_corp_exp_skill       创业经验技能转化 → 消费 state.startup,
 *     运营公司积累管理/会计经验
 *   H→G  h706_founder_health_stress 创始人压力健康 → 消费 state.startup+state.status,
 *     公司运营压力传导至创始人健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR706Loaded) return;
  RANDOM_EVENTS._domainHLinkageR706Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  var EVENTS = [
    {
      id: "h706_corp_cash_invest", phase: "corporate", _isChainEvent: false, icon: "💰",
      title: "公司闲置资金的投资建议",
      story: "公司账上资金充裕时,CFO建议将部分闲置资金用于投资——{desc}",
      triggers: { minDay: 150, interval: 180, maxRepeats: 2, excludeFlags: ["_h706InvestCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._h706InvestCd) return false;
        return hasCompany(st) && st.startup.company.cashReserve >= 50000;
      },
      choices: [
        {
          text: "📈 投资理财", hint: "会计XP+5,智力+3,置_h706InvestDone",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h706InvestCd = true;
            st.flags._h706InvestDone = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '让钱生钱,是创业者的必修课。' 会计XP+5,智力+3。", "success");
            }
          }
        },
        {
          text: "🏦 保持现金储备", hint: "心智+5,置_h706CashReserve",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h706InvestCd = true;
            st.flags._h706CashReserve = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏦 '现金为王,稳健经营才是长久之道。' 心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.startup && st.startup.company && st.startup.company.cashReserve) || 0;
        return "公司账上躺着¥" + Math.round(cash).toLocaleString() + "现金——'这笔钱,是继续投入业务,还是做点投资?'";
      }
    },
    {
      id: "h706_corp_exp_skill", phase: "corporate", _isChainEvent: false, icon: "📚",
      title: "创业经验沉淀",
      story: "运营公司的每一天都在积累经验——{desc}",
      triggers: { minDay: 120, interval: 150, maxRepeats: 3, excludeFlags: ["_h706SkillCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._h706SkillCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "📊 复盘经营数据", hint: "管理XP+6,会计XP+4,置_h706Review",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h706SkillCd = true;
            st.flags._h706Review = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据是最好的老师。' 管理XP+6,会计XP+4。", "success");
            }
          }
        },
        {
          text: "👥 团队管理心得", hint: "社交XP+5,管理XP+3,置_h706TeamLesson",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h706SkillCd = true;
            st.flags._h706TeamLesson = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("👥 '管理团队,就是管理人心。' 社交XP+5,管理XP+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var empCount = (st.startup && st.startup.company && st.startup.company.employees) ? st.startup.company.employees.length : 0;
        return "公司运营了" + ((st.player && st.player.day) || 0) + "天,团队" + empCount + "人——'每一天都在成长。'";
      }
    },
    {
      id: "h706_founder_health_stress", phase: "corporate", _isChainEvent: false, icon: "😰",
      title: "创业压力与健康",
      story: "公司运营压力不知不觉侵蚀着你的健康——{desc}",
      triggers: { minDay: 100, interval: 120, maxRepeats: 3, excludeFlags: ["_h706StressCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._h706StressCd) return false;
        return hasCompany(st) && st.status && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "🧘 减压休息", hint: "健康+4,疲劳-8,置_h706Rest",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h706StressCd = true;
            st.flags._h706Rest = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 4);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '创业是场马拉松,不是百米冲刺。' 健康+4,疲劳-8。", "success");
            }
          }
        },
        {
          text: "🏋️ 坚持锻炼", hint: "健康+6,行动力-10,置_h706Exercise",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h706StressCd = true;
            st.flags._h706Exercise = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 6);
            if (typeof consumeAP === "function") { try { consumeAP(10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏋️ '身体是革命的本钱。' 健康+6,消耗10点行动力。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 100;
        var fatigue = (st.needs && st.needs.fatigue) || 0;
        return "连续加班" + ((st.player && st.player.day) || 0) + "天,健康" + health + "%,疲劳" + fatigue + "——'创业,不是以健康为代价。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
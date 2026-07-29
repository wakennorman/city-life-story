/**
 * 域A(数据/数值平衡) 联动增强 R819 (第十四轮循环)
 * 桥接：
 *   A→B  a819_market_data_v12 市场数据v12 → 消费 pricing/trade 数据
 *   A→G  a819_econ_health_v10 经济健康v10 → 消费 经济数据+needs
 *   A→C  a819_skill_value_v10 技能价值v10 → 消费 skills+payCalc
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR819Loaded) return;
  RANDOM_EVENTS._domainALinkageR819Loaded = true;

  var EVENTS = [
    {
      id: "a819_market_data_v12", phase: "street", _isChainEvent: false, icon: "📊",
      title: "市场数据洞察",
      story: "价格波动背后,藏着这座城市的供需密码——看懂数据,就看清了市场。",
      triggers: { minDay: 150, interval: 250, maxRepeats: 3, excludeFlags: ["_a819DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a819DataCd) return false;
        return st.player && st.player.day >= 150 && st.trade;
      },
      text: function (st) {
        if (!st) return null;
        var trades = st.trade && st.trade.totalTrades != null ? st.trade.totalTrades : 0;
        return "你已完成" + trades + "笔交易——'价格波动背后,藏着这座城市的供需密码。'";
      },
      choices: [
        {
          text: "📈 分析价格趋势", hint: "智力+20,会计XP+15,置_a819Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a819DataCd = true;
            st.flags._a819Analyst = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '数据会说话,关键是要听懂。' 智力+20,会计XP+15。", "success");
            }
          }
        },
        {
          text: "📝 记录交易心得", hint: "心智+15,社交XP+12,置_a819Recorder",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a819DataCd = true;
            st.flags._a819Recorder = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 '经验是最好的老师。' 心智+15,社交XP+12。", "info");
            }
          }
        }
      ]
    },
    {
      id: "a819_econ_health_v10", phase: "street", _isChainEvent: false, icon: "💚",
      title: "经济健康度",
      story: "你的经济状况直接影响着生活质量——理性消费,才能活得更从容。",
      triggers: { minDay: 250, interval: 300, maxRepeats: 4, excludeFlags: ["_a819EconCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a819EconCd) return false;
        return st.player && st.player.day >= 250 && st.needs;
      },
      text: function (st) {
        if (!st) return null;
        var cash = st.resources && isFinite(st.resources.cash) ? Math.round(st.resources.cash) : 0;
        var happiness = st.needs && isFinite(st.needs.happiness) ? Math.round(st.needs.happiness) : 50;
        return "存款¥" + cash.toLocaleString() + ",心情" + happiness + "——'经济宽裕,心态就从容。'";
      },
      choices: [
        {
          text: "💰 制定预算计划", hint: "会计XP+20,智力+12,置_a819Budgeter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a819EconCd = true;
            st.flags._a819Budgeter = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '预算是自由的蓝图,不是束缚。' 会计XP+20,智力+12。", "success");
            }
          }
        },
        {
          text: "🧘 调整消费心态", hint: "心情+20,心智+15,置_a819Frugal",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a819EconCd = true;
            st.flags._a819Frugal = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '知足常乐,简约不简单。' 心情+20,心智+15。", "info");
            }
          }
        }
      ]
    },
    {
      id: "a819_skill_value_v10", phase: "street", _isChainEvent: false, icon: "🎯",
      title: "技能市场价值",
      story: "你的技能值多少钱,市场会告诉你答案——持续学习,才能保值增值。",
      triggers: { minDay: 350, interval: 400, maxRepeats: 3, excludeFlags: ["_a819SkillCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._a819SkillCd) return false;
        return st.player && st.player.day >= 350 && st.skills;
      },
      text: function (st) {
        if (!st) return null;
        var skills = st.skills || {};
        var topSkill = "", topLevel = 0;
        for (var k in skills) {
          if (skills[k] && skills[k].level && skills[k].level > topLevel) {
            topLevel = skills[k].level;
            topSkill = skills[k].name || k;
          }
        }
        if (topSkill) return "你的最强技能是" + topSkill + "(Lv." + topLevel + ")——'技能,是你在城市里最硬的通货。'";
        return "你的技能正在成长——'技能,是你在城市里最硬的通货。'";
      },
      choices: [
        {
          text: "📊 评估技能价值", hint: "智力+20,管理XP+15,置_a819Valuer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a819SkillCd = true;
            st.flags._a819Valuer = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '知道自己的价值,才能找到更好的位置。' 智力+20,管理XP+15。", "success");
            }
          }
        },
        {
          text: "🎓 制定学习计划", hint: "心智+18,置_a819Learner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a819SkillCd = true;
            st.flags._a819Learner = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎓 '学习是最好的投资。' 心智+18。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
/**
 * 域A(数据/数值平衡) 联动增强 R826 (第十五轮循环)
 * 桥接：
 *   A→B  a826_price_narrative 价格叙事 → 消费 pricing/trade 数据
 *   A→G  a826_econ_wellness 经济健康 → 消费 经济数据+needs
 *   A→C  a826_skill_demand 技能需求 → 消费 skills+payCalc
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR826Loaded) return;
  RANDOM_EVENTS._domainALinkageR826Loaded = true;

  var EVENTS = [
    {
      id: "a826_price_narrative", phase: "street", _isChainEvent: false, icon: "📊",
      title: "价格叙事", story: "每一次价格波动,都在讲述市场故事——读懂价格,就读懂了城市。",
      triggers: { minDay: 100, interval: 200, maxRepeats: 3, excludeFlags: ["_a826PriceCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._a826PriceCd) return false; return st.player && st.player.day >= 100 && st.trade; },
      text: function (st) { if (!st) return null; var t = st.trade && st.trade.totalTrades != null ? st.trade.totalTrades : 0; return "你已完成" + t + "笔交易——'每一次价格波动,都在讲述市场故事。'"; },
      choices: [
        { text: "📈 分析趋势", hint: "智力+18,会计XP+15,置_a826Analyst",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._a826PriceCd = true; st.flags._a826Analyst = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18); if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📈 '价格会说话。' 智力+18,会计XP+15。", "success"); } }
        },
        { text: "📝 记录心得", hint: "心智+15,置_a826Recorder",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._a826PriceCd = true; st.flags._a826Recorder = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15); if (typeof StateManager !== "undefined") { StateManager.addMessage("📝 '经验是最好的老师。' 心智+15。", "info"); } }
        }
      ]
    },
    {
      id: "a826_econ_wellness", phase: "street", _isChainEvent: false, icon: "💚",
      title: "经济健康", story: "经济状况影响生活质量——理性消费,从容生活。",
      triggers: { minDay: 200, interval: 250, maxRepeats: 4, excludeFlags: ["_a826EconCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._a826EconCd) return false; return st.player && st.player.day >= 200 && st.needs; },
      text: function (st) { if (!st) return null; var c = st.resources && isFinite(st.resources.cash) ? Math.round(st.resources.cash) : 0; var h = st.needs && isFinite(st.needs.happiness) ? Math.round(st.needs.happiness) : 50; return "存款¥" + c.toLocaleString() + ",心情" + h + "——'经济宽裕,心态从容。'"; },
      choices: [
        { text: "💰 预算计划", hint: "会计XP+20,智力+12,置_a826Budgeter",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._a826EconCd = true; st.flags._a826Budgeter = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12); if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 20); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("💰 '预算是自由的蓝图。' 会计XP+20,智力+12。", "success"); } }
        },
        { text: "🧘 调整心态", hint: "心情+20,心智+15,置_a826Frugal",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._a826EconCd = true; st.flags._a826Frugal = true; if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20); if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15); if (typeof StateManager !== "undefined") { StateManager.addMessage("🧘 '知足常乐。' 心情+20,心智+15。", "info"); } }
        }
      ]
    },
    {
      id: "a826_skill_demand", phase: "street", _isChainEvent: false, icon: "🎯",
      title: "技能市场需求", story: "市场需要什么技能——持续学习,才能保值增值。",
      triggers: { minDay: 300, interval: 350, maxRepeats: 3, excludeFlags: ["_a826SkillCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._a826SkillCd) return false; return st.player && st.player.day >= 300 && st.skills; },
      text: function (st) {
        if (!st) return null; var sk = st.skills || {}; var top = "", tl = 0;
        for (var k in sk) { if (sk[k] && sk[k].level && sk[k].level > tl) { tl = sk[k].level; top = sk[k].name || k; } }
        if (top) return "你的最强技能是" + top + "(Lv." + tl + ")——'技能是你在城市里最硬的通货。'"; return "技能正在成长——'技能是城市里最硬的通货。'";
      },
      choices: [
        { text: "📊 评估价值", hint: "智力+20,管理XP+15,置_a826Valuer",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._a826SkillCd = true; st.flags._a826Valuer = true; if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 20); if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📊 '知道自己的价值。' 智力+20,管理XP+15。", "success"); } }
        },
        { text: "🎓 学习计划", hint: "心智+18,置_a826Learner",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._a826SkillCd = true; st.flags._a826Learner = true; if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 18); if (typeof StateManager !== "undefined") { StateManager.addMessage("🎓 '学习是最好的投资。' 心智+18。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
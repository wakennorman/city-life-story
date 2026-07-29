/**
 * 域H(Phase2/公司) 联动增强 R856 (第十八轮循环)
 * 桥接：
 *   H→A  h856_corp_data_v17 经营数据v17 → 消费 company 运营数据
 *   H→B  h856_corp_legend_v18 公司传奇v18 → 消费 startup 估值+里程碑
 *   H→G  h856_founder_health_v17 创始人健康v17 → 消费 公司压力+健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR856Loaded) return;
  RANDOM_EVENTS._domainHLinkageR856Loaded = true;

  function hasCo(st) { return st && st.startup && st.startup.company && st.startup.active; }

  var EVENTS = [
    {
      id: "h856_corp_data_v17", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "经营数据洞察", story: "数据驱动决策,才能走得更远。",
      triggers: { minDay: 350, interval: 450, maxRepeats: 3, excludeFlags: ["_h856DataCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._h856DataCd) return false; return hasCo(st) && st.player && st.player.day >= 350; },
      text: function (st) { if (!st) return null; var c = st.startup && st.startup.company; if (!c) return "数据驱动决策。"; var r = isFinite(c.revenue) ? Math.round(c.revenue) : 0; var e = (c.employees && c.employees.length) || 0; return "营收¥" + r.toLocaleString() + ",团队" + e + "人——'数据驱动决策,才能走得更远。'"; },
      choices: [
        { text: "📈 分析", hint: "管理XP+30,会计XP+20,置_h856Analyst", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h856DataCd = true; st.flags._h856Analyst = true; if (typeof addSkillXp === "function") { try { addSkillXp("management", 30); } catch(e) {} } if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 20); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📊 '数据不会说谎。' 管理XP+30,会计XP+20。", "success"); } } },
        { text: "🎯 优化", hint: "管理XP+35,置_h856Strategist", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h856DataCd = true; st.flags._h856Strategist = true; if (typeof addSkillXp === "function") { try { addSkillXp("management", 35); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🎯 '好的策略来自数据。' 管理XP+35。", "info"); } } }
      ]
    },
    {
      id: "h856_corp_legend_v18", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司传奇", story: "每一个里程碑都值得被铭记。",
      triggers: { minDay: 450, interval: 550, maxRepeats: 3, excludeFlags: ["_h856LegendCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._h856LegendCd) return false; return hasCo(st) && st.player && st.player.day >= 450; },
      text: function (st) { if (!st) return null; var c = st.startup && st.startup.company; if (!c) return "你的公司正在书写传奇。"; var v = isFinite(c.valuation) ? Math.round(c.valuation) : 0; return "估值¥" + v.toLocaleString() + "——'每一个里程碑都值得被铭记。'"; },
      choices: [
        { text: "📜 记录", hint: "心智+25,魅力+20,置_h856Chronicler", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h856LegendCd = true; st.flags._h856Chronicler = true; if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 25); st.player.charm = Math.min(100, (st.player.charm || 50) + 20); } if (typeof StateManager !== "undefined") { StateManager.addMessage("🏆 '每一步都值得铭记。' 心智+25,魅力+20。", "success"); } } },
        { text: "📢 分享", hint: "社交XP+25,置_h856Storyteller", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h856LegendCd = true; st.flags._h856Storyteller = true; if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📢 '故事比数字更有感染力。' 社交XP+25。", "info"); } } }
      ]
    },
    {
      id: "h856_founder_health_v17", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "创始人健康管理", story: "创业是马拉松,健康才是最大的资产。",
      triggers: { minDay: 250, interval: 350, maxRepeats: 4, excludeFlags: ["_h856HealthCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._h856HealthCd) return false; return hasCo(st) && st.player && st.player.day >= 250 && st.status && st.needs; },
      text: function (st) { if (!st) return null; var h = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100; var f = st.needs && isFinite(st.needs.fatigue) ? Math.round(st.needs.fatigue) : 0; return "健康" + h + "%,疲劳" + f + "——'健康才是最大的资产。'"; },
      choices: [
        { text: "🏃 锻炼", hint: "健康+20,疲劳-20,置_h856Fitness", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h856HealthCd = true; st.flags._h856Fitness = true; if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 20); if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("💚 '身体是革命的本钱。' 健康+20,疲劳-20。", "success"); } } },
        { text: "🧘 减压", hint: "疲劳-25,心情+20,置_h856DeStress", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h856HealthCd = true; st.flags._h856DeStress = true; if (st.needs) { st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 25); st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20); } if (typeof StateManager !== "undefined") { StateManager.addMessage("🧘 '创业再忙也要照顾自己。' 疲劳-25,心情+20。", "info"); } } }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
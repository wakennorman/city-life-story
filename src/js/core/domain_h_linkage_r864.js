/**
 * 域H(Phase2/公司) 联动增强 R864 (第十九轮循环)
 * 桥接：
 *   H→A  h864_corp_data_v18 经营数据v18 → 消费 company 运营数据
 *   H→B  h864_corp_legend_v19 公司传奇v19 → 消费 startup 估值+里程碑
 *   H→G  h864_founder_health_v18 创始人健康v18 → 消费 公司压力+健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR864Loaded) return;
  RANDOM_EVENTS._domainHLinkageR864Loaded = true;

  function hasCo(st) { return st && st.startup && st.startup.company && st.startup.active; }

  var EVENTS = [
    {
      id: "h864_corp_data_v18", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "经营数据洞察", story: "数据驱动决策,才能走得更远。",
      triggers: { minDay: 300, interval: 400, maxRepeats: 3, excludeFlags: ["_h864DataCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._h864DataCd) return false; return hasCo(st) && st.player && st.player.day >= 300; },
      text: function (st) { if (!st) return null; var c = st.startup && st.startup.company; if (!c) return "数据驱动决策。"; var r = isFinite(c.revenue) ? Math.round(c.revenue) : 0; var e = (c.employees && c.employees.length) || 0; return "营收¥" + r.toLocaleString() + ",团队" + e + "人。"; },
      choices: [
        { text: "📈 分析", hint: "管理XP+30,会计XP+20,置_h864Analyst", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h864DataCd = true; st.flags._h864Analyst = true; if (typeof addSkillXp === "function") { try { addSkillXp("management", 30); } catch(e) {} } if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 20); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📊 '数据不会说谎。' 管理XP+30,会计XP+20。", "success"); } } },
        { text: "🎯 优化", hint: "管理XP+35,置_h864Strategist", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h864DataCd = true; st.flags._h864Strategist = true; if (typeof addSkillXp === "function") { try { addSkillXp("management", 35); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🎯 '好的策略来自数据。' 管理XP+35。", "info"); } } }
      ]
    },
    {
      id: "h864_corp_legend_v19", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司传奇", story: "每一个里程碑都值得被铭记。",
      triggers: { minDay: 400, interval: 500, maxRepeats: 3, excludeFlags: ["_h864LegendCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._h864LegendCd) return false; return hasCo(st) && st.player && st.player.day >= 400; },
      text: function (st) { if (!st) return null; var c = st.startup && st.startup.company; if (!c) return "你的公司正在书写传奇。"; var v = isFinite(c.valuation) ? Math.round(c.valuation) : 0; return "估值¥" + v.toLocaleString() + "。"; },
      choices: [
        { text: "📜 记录", hint: "心智+25,魅力+20,置_h864Chronicler", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h864LegendCd = true; st.flags._h864Chronicler = true; if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 25); st.player.charm = Math.min(100, (st.player.charm || 50) + 20); } if (typeof StateManager !== "undefined") { StateManager.addMessage("🏆 '每一步都值得铭记。' 心智+25,魅力+20。", "success"); } } },
        { text: "📢 分享", hint: "社交XP+25,置_h864Storyteller", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h864LegendCd = true; st.flags._h864Storyteller = true; if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📢 '故事比数字更有感染力。' 社交XP+25。", "info"); } } }
      ]
    },
    {
      id: "h864_founder_health_v18", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "创始人健康管理", story: "创业是马拉松,健康才是最大的资产。",
      triggers: { minDay: 200, interval: 300, maxRepeats: 4, excludeFlags: ["_h864HealthCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._h864HealthCd) return false; return hasCo(st) && st.player && st.player.day >= 200 && st.status && st.needs; },
      text: function (st) { if (!st) return null; var h = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100; var f = st.needs && isFinite(st.needs.fatigue) ? Math.round(st.needs.fatigue) : 0; return "健康" + h + "%,疲劳" + f + "。"; },
      choices: [
        { text: "🏃 锻炼", hint: "健康+20,疲劳-20,置_h864Fitness", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h864HealthCd = true; st.flags._h864Fitness = true; if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 20); if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("💚 '身体是革命的本钱。' 健康+20,疲劳-20。", "success"); } } },
        { text: "🧘 减压", hint: "疲劳-25,心情+20,置_h864DeStress", apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h864HealthCd = true; st.flags._h864DeStress = true; if (st.needs) { st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 25); st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20); } if (typeof StateManager !== "undefined") { StateManager.addMessage("🧘 '创业再忙也要照顾自己。' 疲劳-25,心情+20。", "info"); } } }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
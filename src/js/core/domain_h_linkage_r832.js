/**
 * 域H(Phase2/公司) 联动增强 R832 (第十五轮循环)
 * 桥接：
 *   H→A  h832_corp_data_v14 经营数据v14 → 消费 company 运营数据
 *   H→B  h832_corp_legend_v15 公司传奇v15 → 消费 startup 估值+里程碑
 *   H→G  h832_founder_health_v14 创始人健康v14 → 消费 公司压力+健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR832Loaded) return;
  RANDOM_EVENTS._domainHLinkageR832Loaded = true;

  function hasCo(st) { return st && st.startup && st.startup.company && st.startup.active; }

  var EVENTS = [
    {
      id: "h832_corp_data_v14", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "经营数据洞察", story: "公司的运营数据正在揭示经营真相——数据驱动决策,才能走得更远。",
      triggers: { minDay: 500, interval: 600, maxRepeats: 3, excludeFlags: ["_h832DataCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._h832DataCd) return false; return hasCo(st) && st.player && st.player.day >= 500; },
      text: function (st) { if (!st) return null; var c = st.startup && st.startup.company; if (!c) return "数据驱动决策。"; var r = isFinite(c.revenue) ? Math.round(c.revenue) : 0; var e = (c.employees && c.employees.length) || 0; return "营收¥" + r.toLocaleString() + ",团队" + e + "人——'数据驱动决策,才能走得更远。'"; },
      choices: [
        { text: "📈 分析财务", hint: "管理XP+30,会计XP+20,置_h832Analyst",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h832DataCd = true; st.flags._h832Analyst = true; if (typeof addSkillXp === "function") { try { addSkillXp("management", 30); } catch(e) {} } if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 20); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📊 '数据不会说谎。' 管理XP+30,会计XP+20。", "success"); } }
        },
        { text: "🎯 优化策略", hint: "管理XP+35,置_h832Strategist",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h832DataCd = true; st.flags._h832Strategist = true; if (typeof addSkillXp === "function") { try { addSkillXp("management", 35); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("🎯 '好的策略来自数据。' 管理XP+35。", "info"); } }
        }
      ]
    },
    {
      id: "h832_corp_legend_v15", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司传奇", story: "你的公司正在书写属于自己的传奇故事——每一个里程碑,都值得被铭记。",
      triggers: { minDay: 600, interval: 700, maxRepeats: 3, excludeFlags: ["_h832LegendCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._h832LegendCd) return false; return hasCo(st) && st.player && st.player.day >= 600; },
      text: function (st) { if (!st) return null; var c = st.startup && st.startup.company; if (!c) return "你的公司正在书写传奇。"; var v = isFinite(c.valuation) ? Math.round(c.valuation) : 0; return "估值¥" + v.toLocaleString() + "——'每一个里程碑都值得被铭记。'"; },
      choices: [
        { text: "📜 记录历史", hint: "心智+25,魅力+20,置_h832Chronicler",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h832LegendCd = true; st.flags._h832Chronicler = true; if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 25); st.player.charm = Math.min(100, (st.player.charm || 50) + 20); } if (typeof StateManager !== "undefined") { StateManager.addMessage("🏆 '每一步都值得铭记。' 心智+25,魅力+20。", "success"); } }
        },
        { text: "📢 分享故事", hint: "社交XP+25,置_h832Storyteller",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h832LegendCd = true; st.flags._h832Storyteller = true; if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} } if (typeof StateManager !== "undefined") { StateManager.addMessage("📢 '故事比数字更有感染力。' 社交XP+25。", "info"); } }
        }
      ]
    },
    {
      id: "h832_founder_health_v14", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "创始人健康管理", story: "创业是一场马拉松,不是短跑——身体健康,才是最大的资产。",
      triggers: { minDay: 400, interval: 500, maxRepeats: 4, excludeFlags: ["_h832HealthCd"] },
      conditions: function (st) { if (!st || st.gameOver) return false; if (st.flags && st.flags._h832HealthCd) return false; return hasCo(st) && st.player && st.player.day >= 400 && st.status && st.needs; },
      text: function (st) { if (!st) return null; var h = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100; var f = st.needs && isFinite(st.needs.fatigue) ? Math.round(st.needs.fatigue) : 0; return "健康" + h + "%,疲劳" + f + "——'健康才是最大的资产。'"; },
      choices: [
        { text: "🏃 锻炼", hint: "健康+20,疲劳-20,置_h832Fitness",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h832HealthCd = true; st.flags._h832Fitness = true; if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 20); if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20); if (typeof StateManager !== "undefined") { StateManager.addMessage("💚 '身体是革命的本钱。' 健康+20,疲劳-20。", "success"); } }
        },
        { text: "🧘 减压", hint: "疲劳-25,心情+20,置_h832DeStress",
          apply: function (st) { if (!st) return; st.flags = st.flags || {}; st.flags._h832HealthCd = true; st.flags._h832DeStress = true; if (st.needs) { st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 25); st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20); } if (typeof StateManager !== "undefined") { StateManager.addMessage("🧘 '创业再忙也要照顾自己。' 疲劳-25,心情+20。", "info"); } }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
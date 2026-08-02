/**
 * 域H(Phase2/公司) 联动增强 R1030
 * — H→C 公司培训 / H→E 公司现金流 / H→G 创始人健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR1030Loaded) return;
  RANDOM_EVENTS._domainHLinkageR1030Loaded = true;
  function msg(t,k) { if (typeof StateManager !== "undefined" && StateManager.addMessage) StateManager.addMessage(t, k || "info"); }
  function gx(k,a) { if (typeof addSkillXp === "function") { try { addSkillXp(k, a); } catch (e) {} } }
  var EVENTS = [
    { id: "h1030_corp_training", phase: "corporate", icon: "🎓", title: "公司培训日", story: "公司组织了一次全员培训——\n\n请来的讲师是业内大佬，讲的是行业前沿趋势。\n\n你认真地做了笔记，发现很多以前想不通的问题，\n在更高的视角下突然变得清晰了。\n\n这种站在巨人肩膀上的感觉，真好。", conditions: function(st) { if(!st||!st.player||st.gameOver) return false; if(st.flags&&st.flags._h1030TrainingDone) return false; return st.player.phase==="corporate"&&st.player.day>=30; }, probability: 0.02, repeatable: false, choices: [{ text: "🎓 认真听讲", hint: "管理XP+50, 智力+3", apply: function(st) { if(!st) return; st.flags=st.flags||{}; st.flags._h1030TrainingDone=true; gx("management",50); if(st.player) st.player.intelligence=Math.min(100,(st.player.intelligence||10)+3); msg("🎓 培训收获很大！管理EXP+50，智力+3。","success"); } }, { text: "🤝 跟讲师交换联系方式", hint: "人缘+5, 客户线索+3", apply: function(st) { if(!st) return; st.flags=st.flags||{}; st.flags._h1030TrainingDone=true; if(st.player) st.player.fame=Math.min(100,(st.player.fame||0)+3); var cap=typeof ensureCareerCapital==="function"?ensureCareerCapital(st):null; if(cap){cap.clientLeads=Math.min(100,(cap.clientLeads||0)+3); if(typeof clampCareerCapital==="function") clampCareerCapital(cap);} msg("🤝 你和大佬交换了联系方式。人缘+5，客户线索+3。","info"); } }] },
    { id: "h1030_corp_cashflow", phase: "corporate", icon: "💰", title: "公司现金流警报", story: "财务部发来了一份报告——\n\n公司当前的现金流只能维持3个月了。\n\n你看着报表上的数字，第一次真正理解了\n「现金为王」这句话的含义。\n\n没有利润，公司还能活一阵子；\n没有现金，公司明天就得关门。", conditions: function(st) { if(!st||!st.player||st.gameOver) return false; if(st.flags&&st.flags._h1030CashflowDone) return false; return st.player.phase==="corporate"&&st.player.day>=60; }, probability: 0.02, repeatable: false, choices: [{ text: "💰 严控成本", hint: "会计XP+50, 心智+5", apply: function(st) { if(!st) return; st.flags=st.flags||{}; st.flags._h1030CashflowDone=true; gx("accounting",50); if(st.player) st.player.mental=Math.min(100,(st.player.mental||50)+5); msg("💰 你开始严格把控公司成本。会计EXP+50，心智+5。","success"); } }, { text: "📈 寻找融资机会", hint: "销售XP+30", apply: function(st) { if(!st) return; st.flags=st.flags||{}; st.flags._h1030CashflowDone=true; gx("sales",30); msg("📈 你开始寻找新的融资渠道。销售EXP+30。","info"); } }] },
  ];
  for (var i = 0; i < EVENTS.length; i++) { if (typeof RANDOM_EVENTS.push === "function") RANDOM_EVENTS.push(EVENTS[i]); }
})();
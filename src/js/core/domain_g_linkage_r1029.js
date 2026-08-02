/**
 * 域G(核心机制/生命周期) 联动增强 R1029
 * — G→A 生命周期数据 / G→D 人生社交 / G→E 财富意义
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR1029Loaded) return;
  RANDOM_EVENTS._domainGLinkageR1029Loaded = true;
  function msg(t,k) { if (typeof StateManager !== "undefined" && StateManager.addMessage) StateManager.addMessage(t, k || "info"); }
  function gx(k,a) { if (typeof addSkillXp === "function") { try { addSkillXp(k, a); } catch (e) {} } }
  var EVENTS = [
    { id: "g1029_life_data", phase: "street", icon: "📊", title: "你的人生数据报告", story: "你回顾了自己这段时间的数据——\n\n赚了多少钱，走了多少路，认识了多少人，学了多少技能。\n\n每一组数字背后，都是一段故事。\n\n这些数据拼凑起来，就是你在这个城市里活过的证明。", conditions: function(st) { if (!st||!st.player||st.gameOver) return false; if (st.flags&&st.flags._g1029LifeDataDone) return false; return st.player.day >= 120; }, probability: 0.02, repeatable: false, choices: [{ text: "📊 分析人生数据", hint: "智力+5, 会计XP+30", apply: function(st) { if (!st) return; st.flags=st.flags||{}; st.flags._g1029LifeDataDone=true; gx("accounting",30); if(st.player) st.player.intelligence=Math.min(100,(st.player.intelligence||10)+5); msg("📊 你分析了这段时间的数据，对自己有了更清晰的认识。智力+5，会计EXP+30。","success"); } }, { text: "📝 写下人生感悟", hint: "心智+5", apply: function(st) { if(!st) return; st.flags=st.flags||{}; st.flags._g1029LifeDataDone=true; if(st.player) st.player.mental=Math.min(100,(st.player.mental||50)+5); msg("📝 你写下了一段人生感悟。心智+5。","info"); } }] },
    { id: "g1029_life_social", phase: "street", icon: "👥", title: "人生的社交沉淀", story: "时间是最好的过滤器。\n\n那些酒肉朋友渐渐淡出了你的生活，\n而那些真正在乎你的人，一直都在。\n\n你发现，真正高质量的社交不是数量，是质量。\n\n有那么三五个人，在你最难的时候伸过手，\n在你最好的时候真心为你高兴，\n这就够了。", conditions: function(st) { if(!st||!st.player||st.gameOver) return false; if(st.flags&&st.flags._g1029SocialDone) return false; if(!st.relationships) return false; var met=0; for(var _n in st.relationships){if(st.relationships[_n]&&st.relationships[_n].met) met++;} return met>=5 && st.player.day>=90; }, probability: 0.02, repeatable: false, choices: [{ text: "💚 感谢一直陪伴的朋友", hint: "好友好感+3, 心智+3", apply: function(st) { if(!st) return; st.flags=st.flags||{}; st.flags._g1029SocialDone=true; if(st.relationships){for(var _n in st.relationships){var _r=st.relationships[_n]; if(_r&&_r.met&&(_r.affinity||0)>=40&&typeof applyAffinityChange==="function") applyAffinityChange(st,_n,3,"人生感悟");}} if(st.player) st.player.mental=Math.min(100,(st.player.mental||50)+3); msg("💚 你给老朋友发了消息，感谢他们的陪伴。心智+3，好友好感+3。","success"); } }, { text: "📝 写一封给未来的信", hint: "智力+2", apply: function(st) { if(!st) return; st.flags=st.flags||{}; st.flags._g1029SocialDone=true; if(st.player) st.player.intelligence=Math.min(100,(st.player.intelligence||10)+2); msg("📝 你给未来的自己写了一封信。智力+2。","info"); } }] },
  ];
  for (var i = 0; i < EVENTS.length; i++) { if (typeof RANDOM_EVENTS.push === "function") RANDOM_EVENTS.push(EVENTS[i]); }
})();
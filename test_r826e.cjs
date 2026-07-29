const runner = require('./tests/headless_runner.cjs');
runner.init();
const evts = global.RANDOM_EVENTS || [];
const r826 = evts.filter(e => e.id && e.id.indexOf("f826") >= 0);
console.log("f826 count:", r826.length);
r826.forEach((e,i) => console.log("  ["+i+"]", e.id, "| has conditions:", typeof e.conditions, "| has triggers:", !!e.triggers));

// Test conditions directly
const st1 = { gameOver:false, player:{day:120, mental:60}, flags:{}, employment:{currentJob:{path:"tech",level:1}}, needs:{happiness:60} };
const careerEvt = r826.find(e => e.id === "f826_career_milestone_wall");
if (careerEvt) console.log("F→C conditions:", careerEvt.conditions(st1));

const st2 = { gameOver:false, player:{day:100, charm:50}, flags:{}, relationships:{
  aunt_wang:{met:true,affinity:35}, boss_li:{met:true,affinity:25}, sister_zhang:{met:true,affinity:20}
}, needs:{happiness:60} };
const socialEvt = r826.find(e => e.id === "f826_social_constellation");
if (socialEvt) console.log("F→D conditions (3 NPC):", socialEvt.conditions(st2));

const st3 = { gameOver:false, player:{day:50, mental:60}, flags:{}, startup:{company:{morale:70}, active:true} };
const corpEvt = r826.find(e => e.id === "f826_corp_vitality_panel");
if (corpEvt) console.log("F→H conditions (corporate):", corpEvt.conditions(st3));

console.log("\nALL TESTS DONE");

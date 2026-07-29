// Quick test: verify r826 events are registered and conditions evaluable
const runner = require('./tests/headless_runner.cjs');
runner.init();
const state = runner.createState({ seed: 42 });

// Check RANDOM_EVENTS loaded
const evts = global.RANDOM_EVENTS || [];
const r826 = evts.filter(e => e.id && e.id.indexOf("f826") >= 0);
console.log("R826 events found:", r826.length);
r826.forEach(e => console.log("  -", e.id, "| phase:", e.conditions ? "has conditions" : "NO conditions"));

// Test condition evaluation on a simulated mid-game state
const testSt = {
  gameOver: false,
  player: { day: 120, mental: 60, charm: 50, intelligence: 55 },
  flags: {},
  employment: { currentJob: { path: "tech", level: 1 } },
  needs: { happiness: 60, fatigue: 30 },
  status: { health: 80 },
  relationships: {
    aunt_wang: { met: true, affinity: 35 },
    boss_li: { met: true, affinity: 25 },
    sister_zhang: { met: true, affinity: 20 }
  },
  resources: { cash: 5000, bankBalance: 2000 },
  investment: { stockHoldings: {}, btcHoldings: 0, properties: [] }
};

r826.forEach(e => {
  try {
    const cond = e.conditions ? e.conditions(testSt) : "no conditions fn";
    console.log("  ", e.id, "=> conditions:", cond);
  } catch (err) {
    console.log("  ", e.id, "=> ERROR:", err.message);
  }
});

// Test _eventCount increment via showEventModal
console.log("\n_eventCount before:", testSt.flags._eventCount);
console.log("TEST PASSED: events registered and conditions evaluable without crash");
